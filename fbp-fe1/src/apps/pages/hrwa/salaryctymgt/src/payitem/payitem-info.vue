<template>
    <ifbp-page id="payiteminfo">
        <!-- 节点title -->
        <ifbp-breadcrumb :name="context.waclass.name" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            
            <div style="display:inline-block;" v-if="stopflag && !addBtnVisible" v-show="!opercolif">
                <div class="maohao">!</div>
                <span class="tip-content">当前方案已停用，不允许进行项目维护。</span></div>
            <div style="display:inline-block;" v-else v-show="!opercolif">
                <div class="maohao">!</div>
                <span class="tip-content">当前方案已审核，不允许进行项目维护。</span></div>
            <!-- 查询模板组件 -->
            <ifbp-search ref="searchref"
                         class="fr"
                         @ready="searchReady"
                         :no-breadcrumb-search="true"
                         template-code="hrwaPayitemListSearch"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list" class="maringTop0">
            <div class="fl">
                <span v-if="groupname===orgname" class="ifbp-layout-content-left-span">所属集团：{{groupname}}</span>
                <span v-else class="ifbp-layout-content-left-span"  >所属组织：{{orgname}}</span>
                <span class="ifbp-layout-content-left-span">薪资方案：{{context.waclass.name}}</span>
                <span class="ifbp-layout-content-left-span">薪资期间：{{lastperiod}}</span>
            </div>
            <div align="right" class="top-button">
                <el-button type="text" @click="addNew" v-if="addBtnVisible" class="ifbp-layout-content-right-button marginleft24" >新增</el-button>
            </div>
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_classitem_l"
                           class="uitemplate-no-top"
                           tpl-id="hrwa_payitem_list"
                           :table-show-menu="false"
                           :tpl-data="classitemTableData"
                           :table-oper-column-vif="opercolif"
                           :tpl-reset-fun="classitemTableResetFun"
                           :methods="classitemTableMethods"
                           @edit-table-click="classitemTableEditClick"
                           @delete-table-click="classitemTableDeleteClick">
            </ifbp-template>

            <!--分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
        </ifbp-main-area>

        <el-dialog :close-on-click-modal="false"
                   title="新增发放项目" :show-close="false"
                   v-model="batchAddDialogVisible" size="small">
            <div style="height:35px;padding:10px 0px;">
                <el-input class="fr" style="width:auto;"
                          placeholder="搜索公共项目名称"
                          icon="search"
                          v-model="searchItem"
                          @keyup.enter.native="handleIconClick"
                          :on-icon-click="handleIconClick">
                </el-input>
            </div>

            <ifbp-template ref="ref_waitem_l"
                           class="uitemplate-no-top"
                           tpl-id="hrwa_payitem_add"
                           :table-show-menu="false"
                           :tpl-data="waitemTableData"
                           :tpl-reset-fun="waitemTableResetFun">
            </ifbp-template>
            <span slot="footer" class="dialog-footer">
        <el-button @click="batchAddDialogVisible=false;">取消</el-button>
        <el-button @click="handleBatchAddSave" type="primary">保存</el-button>
      </span>
        </el-dialog>
    </ifbp-page>
</template>

<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        data() {
            var params = this.$root.$router.currentRoute.params;
            params.waclass = {};
            params.waclass.pk_wa_class = params.pk_wa_class;
            params.waclass.pk_group = params.pk_group;
            params.waclass.pk_org = params.pk_org;
            params.waclass.name = params.name;
            params.waclass.cyear = params.cyear;
            params.waclass.cperiod = params.cperiod;
            params.waclass.beanMap = {};
            params.waclass.beanMap.pk_org_ref = [];
            params.waclass.beanMap.pk_org_ref[params.waclass.pk_org] = {};
            params.waclass.beanMap.pk_org_ref[params.waclass.pk_org].name = params.pk_org_name;
            params.waclass.beanMap.pk_group_ref = [];
            params.waclass.beanMap.pk_group_ref[params.waclass.pk_group] = {};
            params.waclass.beanMap.pk_group_ref[params.waclass.pk_group].name = params.pk_group_name;
            let vm = this;
            return {
                context: {
                    waclass: params.waclass,
                },
                oriYear: params.cyear,
                oriPeriod: params.cperiod,

                // 查询模板传入参数
                searchTemplate: {},
                classitemTableData: {},

                // 要删除的行地应的数据
                delRowData: {},
                //新增按钮是否可用
                addBtnVisible: true,
                //列表的操作列可见性
                opercolif: true,
                stopflag: false,

                periodVOs: [],

                classitemTableResetFun: function ($node) {
                    //项目名称
                    var $taxflagcol = $node.find("[prop='name']");
                    $taxflagcol.attr('render-type', 'default');
                    $taxflagcol.html(
                        '<template scope="scope"><a class="name_a" href="javascript: void(0);" :pk="scope.row.pk_wa_classitem" @click="showDetail($event)">{{scope.row.name}}</a></template>'
                    );
                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit',
                        vif:"true"
                    },{
                        title: '删除',
                        icon: 'delete',
                        vif:"!scope.row.defaultflag"
                    }];

                    let $table = $node.find("el-table");
                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },

                classitemTableMethods: {
                    showDetail(event){
                        let pk = $(event.target).attr("pk");
                        vm.$router.push("/hrwa/payitem/detail/" + pk + "/" + 0 + "/" + vm.opercolif + "/"
                            + vm.context.waclass.pk_org + "/" + vm.context.waclass.pk_wa_class + "/"
                            + vm.context.waclass.cyear + "/" + vm.context.waclass.cperiod);
                    },
                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                code: '',
                name: '',
                ts: '',

                //新增对话框
                batchAddDialogVisible: false,
                searchItem: '',//搜索项目
                waitemTableData: {},
                waitemTableResetFun: function ($node) {
                    return $node[0].outerHTML;
                },
            };
        },
        computed: {
            lastperiod: function () {
                return this.context.waclass.cyear + '年' + this.context.waclass.cperiod + '月';
            },
            orgname: function () {
                return this.context.waclass.beanMap.pk_org_ref[this.context.waclass.pk_org].name;
            },
            groupname: function () {
                return this.context.waclass.beanMap.pk_group_ref[this.context.waclass.pk_group].name;
            },
        },
        mounted(){
        },
        created() {
            //没有找到合适的方法,暂且把router放入全局
            window.temp_router = this.$router;
            this.classitemTableListInit();
        },
        beforeMount(){
        },
        methods: {

            ifbpPageInit(){
                this.request(this.currentPage, this.size);
            },
            searchReady(){
                let url = '/hrwa/payitem/info/searchOption';
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    this.$refs.searchref.setOptionsByFieldcode(res.data.data);
                })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            setSearchOption(){
                try {
                    let param = {
                        'period': {},
                    };
                    for (let i = 0; i < this.periodVOs.length; i++) {
                        param.period[this.periodVOs[i]] = this.periodVOs[i].substr(0, 4) + "/" + this.periodVOs[i].substring(4);
                    }
                    this.$refs.searchref.setOptionsByFieldcode(param);
                }
                catch (err) {
                    let self = this;
                    if (self && !self._isDestroyed) {
                        setTimeout(() => {
                            if (self && !self._isDestroyed)
                                self.setSearchOption();
                        }, 1000);
                    }
                }
            },
            //列表初始化临时使用
            classitemTableListInit() {
                this.request();
            },
            // 请求数据
            request(n, s) {
                let waclass = this.context.waclass;
                let first = false;
                let url = '/hrwa/payitem/info/pageList?pk_wa_class=' + waclass.pk_wa_class + '&pk_group=' + waclass.pk_group + '&pk_org=' +
                    waclass.pk_org + '&cyear=' + this.oriYear + '&cperiod=' + this.oriPeriod;
                if (!this.periodVOs || this.periodVOs.length == 0) {
                    url += "&first=1";
                    first = true;
                }
                if (n === undefined) {
                    url += '&pn=1&ps=10';
                } else {
                    url += '&pn=' + n + '&ps=' + s;
                }
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "json",
                    data: this.searchTemplate,
                }).then((res) => {
                    this.$refs.ref_classitem_l.setData(
                        "wa_classitem_t",
                        res.data.data.content
                    );
                    this.addBtnVisible = res.data.addEnable;
                    this.opercolif = res.data.editEnable;
                    this.stopflag = res.data.stopflag;
                    this.context.waclass.cyear = res.data.realYear;
                    this.context.waclass.cperiod = res.data.realPeriod;
                    this.totalElements = res.data.data.totalElements;
                    this.size = res.data.data.size;
                    this.currentPage = res.data.data.number;
                    if (first) {
                        this.periodVOs = res.data.periods;
                        this.setSearchOption();
                    }
                })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            //新增
            addNew: function () {
                this.searchItem = "";
                this.batchAddDialogVisible = true;
                this.requestWaItem();
            },
            requestWaItem(){
                let waclass = this.context.waclass;
                let keyword = this.searchItem;
                let url = '/hrwa/payitem/info/waItemList?pk_wa_class=' + waclass.pk_wa_class + '&pk_group=' + waclass.pk_group + '&pk_org=' +
                    waclass.pk_org + '&cyear=' + waclass.cyear + '&cperiod=' + waclass.cperiod + '&searchColumn=' + keyword;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    this.$refs.ref_waitem_l.setData(
                        "waitem_t",
                        res.data.data
                    );
                })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // table行的编辑操作
            classitemTableEditClick(scope) {
                let pk = scope.row.pk_wa_classitem;
                this.$router.push("/hrwa/payitem/detail/" + pk + "/" + 1 + "/" + this.opercolif + "/"
                    + this.context.waclass.pk_org + "/" + this.context.waclass.pk_wa_class + "/"
                    + this.context.waclass.cyear + "/" + this.context.waclass.cperiod);
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.request(this.currentPage, this.size);
            },

            // table行的删除操作
            classitemTableDeleteClick(scope) {
                this.delRowData = scope.row;

                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.deleteClick();
                }).catch(() => {
                });
            },
            //刷新table
            refreshTableList: function () {
                this.request(this.currentPage, this.size);
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.currentPage = 1;
                this.size = val;
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
            },
            //搜索公共项目名称
            handleIconClick(){
                this.requestWaItem();
            },

            // 删除处理
            deleteClick() {
                this.$http({
                    url: "/hrwa/payitem/info/delete/",
                    method: "post",
                    data: this.delRowData
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            //alert("222222");
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "删除失败",
                            type: "error"
                        });
                    });
            },

            handleBatchAddSave(){
                let tableSelections = this.$refs.ref_waitem_l.comp.$refs.ref_waitem_l.getSelection();
                if (!tableSelections || tableSelections.length === 0) {
                    this.$message({
                        message: "请先选择薪资项目!",
                        type: 'warning'
                    });
                } else {
                    let pks = [];
                    for (let i = 0; i < tableSelections.length; i++) {
                        let row = tableSelections[i];
                        pks.push(row.pk_wa_item);
                    }
                    let waclass = this.context.waclass;
                    let url = '/hrwa/payitem/info/batchAddSave';
                    let svr = this.$http({
                        url: url,
                        method: "post",
                        dataType: "json",
                        data: {
                            pk_group: waclass.pk_group,
                            pk_org: waclass.pk_org,
                            cyear: waclass.cyear,
                            cperiod: waclass.cperiod,
                            pk_wa_class: waclass.pk_wa_class,
                            pks: pks
                        }
                    });
                    svr.then(res => {
                        if (res.data.status === true) {
                            this.batchAddDialogVisible = false;
                            this.request();
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    });
                    svr.catch((e) => {
                        this.$message({
                            message: "新增失败",
                            type: "error"
                        });
                    });
                }
            },
        }
    };
</script>
<style scoped>
    .classinfo {
        height: 16px;
        line-height: 16px;
        
        padding-bottom: 15px;
    }
    .split-space {
        width: 50px;
        display: inline-block;
    }
    .name_a:hover {
        color: #5CB0E6;
        cursor: pointer;
        text-decoration: underline;
    }

    .maohao {
        display: inline-block;
        margin-top: 9px;
        text-align: center;
        border: 1px solid #F3383F;
        color: #F3383F;
        background: #FFE2E2;
        line-height: 12px;
        font-size: 12px;
        width: 14px;
        box-sizing: border-box;
        font-weight: 900;
        border-radius: 14px;
        -moz-border-radius: 14px;
    }

    .tip-content {
        margin-top: 9px;
        margin-left: 8px;
        font-size: 14px;
        box-sizing: border-box;
        color: #333333;
        line-height: 14px;
    }
</style>
