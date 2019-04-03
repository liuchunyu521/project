<template>
    <ifbp-page>
        <ifbp-breadcrumb name="员工兼职" v-show="false"></ifbp-breadcrumb>
        <ifbp-button-area :no-breadcrumb="true">
            <hr-org-cascader name="treeCascader" @update:pk_org="orgChange"></hr-org-cascader>
            <!--<div class="fl">-->
                <!--<el-cascader-->
                        <!--ref="treeCascader"-->
                        <!--expand-trigger="hover"-->
                        <!--:show-all-levels="false"-->
                        <!--:options="orgTreeData"-->
                        <!--v-model="selectedTreeNode"-->
                        <!--placeholder="请选择组织"-->
                        <!--:not-leaf-selectable="true"-->
                        <!--:hideBorder="true"-->
                        <!--:hideRight="true"-->
                        <!--@change="handleTreeChange">-->
                <!--</el-cascader>-->
            <!--</div>-->

            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         ref="searchRef"
                         :template-code="searchCode"
                         :no-breadcrumb-search="true"
                         @ready="resetSearchRefCond"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!--<ifbp-no-data :search-state="searchState" :total-elements="totalElements" :no-search-data-text="noDataText" no-data-head=".no-data-header-content" class="no-data-no-breadcrumb">-->
        <!-- 主体区域 -->
        <ifbp-main-area type="list" class="paddingTop0">
            <div class="no-data-header-content">
            <el-tabs v-model="tabType" @tab-click="tabClick" :has-bottom-border="false" :is-normal-type="false" :tab-position-top="true" class="ifbp-content-tabs">
                <div slot="header" class="fr">
                    <div class="ifbp-btn-line" >
                        <div class="fr">
                            <i class="ifbp-icon-setting" @click="settingBtn"></i>
                        </div>
                    </div>
                </div>
                <el-tab-pane label="全部人员" name="0">
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_nopartapply_l"
                                   tpl-id="hrtrn_partapply_allpsn_list"
                                   class="uitemplate-no-top"
                                   @after-create="pageInit"
                                   :table-show-menu="false"
                                   :tpl-data="tableDataNoJZ"
                                   :methods="ruleTableMethodsNoJZ"
                                   :tpl-reset-fun="tableResetFunNoJZ">
                    </ifbp-template>
                    <!--分页组件-->
                    <el-pagination
                            v-if="totalElements > 0"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElements">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="兼职申请" name="1">
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_partapply_l"
                                   tpl-id="hrtrn_partapply_apply_list"
                                   class="uitemplate-no-top"
                                   :table-show-menu="false"
                                   :tpl-data="tableData"
                                   :methods="applyTableMethods"
                                   :tpl-reset-fun="tableResetFun"
                                   @after-create="pageInit"
                                   @view-table-click="tableViewClick"
                                   @edit-table-click="tableEditClick"
                                   @publish-table-click="tableCommitClick"
                                   @hr-icon-execute-table-click="tableExecuteClick"
                                   @bottom-table-click="tableCallBackClick"
                                   @delete-table-click="tableDeleteClick">
                    </ifbp-template>
                    <!--分页组件-->
                    <el-pagination
                            v-if="totalElements > 0"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElements">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
            </div>
        </ifbp-main-area>
        <!--</ifbp-no-data>-->
        <jzDialog ref="jzRef"></jzDialog>

        <el-dialog title="生效日期" v-model="execDialogVisible" :show-close="false" size="tiny">
            <div>
                <el-date-picker
                        style="max-width: 250px;margin:0 auto;"
                        v-model="effectDate"
                        type="date"
                        placeholder="选择生效日期"
                        :show-icon="true">
                </el-date-picker>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="execDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="execDialogConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    import jzDialog from './jz-dialog.vue';
    let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
    export default {
        mixins: [pageModelMixin],
        components: {
            hrOrgCascader,
            jzDialog,
        },
        data() {
            var vm = this;
            return {
                searchState: "search",
                execDialogVisible:false,
                effectDate:new Date(),
                hi_partapply:{},
                //已加载完的UI模板件数
                createCnt: 0,
//                orgTreeData: [],
//                selectedTreeNode: [],
                pk_org: '',
                tabType: '0',
                tableData: {},
                tableDataNoJZ: {},
                tableResetFunNoJZ: function ($node) {

                    var operateArr = [{
                        title: '兼职',
                        icon: 'gavel',
                        click:'jzClick(scope)',
                        vif: "true"
                    }];
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getTableOperateHtml(operateArr,'right',100,'text');
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                ruleTableMethodsNoJZ: {
                    jzClick(scope){
                        vm.jzClick(scope);
                    },
                    showPsnDetail(scope){
                        let pk = scope.row.pk_psndoc;
                        vm.$router.push("/hrhi/psninfo/dynamic/" + pk + "?funcode=60070psninfo");
                    },
                },
                tableResetFun: function ($node) {
                    let $bill_code = $node.find("[prop='bill_code']");
                    $bill_code.attr('render-type', 'default');
                    $bill_code.html(
                        '<template scope="scope"><a href="javascript:void(0);" @click.stop="showDetail(scope)">{{scope.row.bill_code}}</a></template>'
                    );

                    var $approve_state = $node.find("[prop='approve_state']");
                    $approve_state.attr('render-type', 'default');
                    $approve_state.html(
                        '<template scope="scope"><span :style="{color:getStateColor(scope.row.approve_state)}">{{getStateStr(scope.row.approve_state)}}</span></template>'
                    );

                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit',
                        vif: "scope.row.approve_state == -1"
                    }, {
                        title: '提交',
                        icon: 'publish',
                        vif: "scope.row.approve_state == -1"
                    },{
                        title: '执行',
                        icon: 'hr-icon-execute',
                        ifbpIconShow: false,
                        vif: "scope.row.approve_state == 1"
                    }, {
                        title: '收回',
                        icon: 'bottom',
                        vif: "scope.row.approve_state == 3"
                    }, {
                        title: '删除',
                        icon: 'delete',
                        vif: "scope.row.approve_state == -1"
                    }, {
                        title: '查看',
                        icon: 'view',
                        vif: "true"
                    }];
                    var $table = this.getTableDom($node);
                    $table.attr('v-on:row-dblclick', 'dblClick');
                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                delData: {},
                hasGroupPower: false,
                //模板组件内方法
                applyTableMethods: {
                    // 双击行事件
                    dblClick(row) {
                        $('.tooltip-normal').hide();
                        let pk = row.pk_partmng;
                        vm.$router.push("/hrtrn/transmgt/partapply/detail/" + pk + "/false");
                    },
                    showDetail(scope){
                        let pk = scope.row.pk_partmng;
                        vm.$router.push("/hrtrn/transmgt/partapply/detail/" + pk + "/false");
                    },
                    showPsnDetail(scope){
                        let pk = scope.row.pk_psndoc;
                        vm.$router.push("/hrhi/psninfo/dynamic/" + pk + "?funcode=60070psninfo");
                    },
                    getStateStr(state){
                        if (state == -1) {
                            return "待提交";
                        } else if (state == 1) {
                            return "已同意";
                        } else if (state == 2) {
                            return "审批中";
                        } else if (state == 3) {
                            return "待审批";
                        } else if (state == 0) {
                            return "未通过";
                        } else if (state == 102) {
                            return "已执行";
                        }
                    },
                    getStateColor(state){
                        if (state == -1) {
                            return "#75787B";
                        } else if (state == 1) {
                            return "#00A753";
                        } else if (state == 2) {
                            return "#FF9500";
                        } else if (state == 3) {
                            return "#75787B";
                        } else if (state == 0) {
                            return "#E60012";
                        } else if (state == 102) {
                            return "#00A753";
                        }
                    },
                },

                //查询模板参数
                searchTemplate: {},
            };
        },
        computed: {
            noDataText:function(){
                if (this.tabType == "0") {
                    return "没查询到人员";
                }else{
                    return "没查询到兼职申请单";
                }
            },
            searchCode:function(){
                if(this.tabType == '0'){
                    return "hrtrn_partapply_allpsn_list";
                }else{
                    return "hrtrn_partapply_apply_list";
                }
            },
        },
        watch: {
            pk_org(newVal, oldVal) {
                this.resetSearchRefCond();
            },
        },
        created() {
        },
        methods: {
            //重新设置查询模板里的参照的过滤条件
            resetSearchRefCond(){
                //给部门参照条件过滤条件
                if (this.tabType == "0") {
                    this.$refs.searchRef.setFilterConditionByFieldCode({'hi_psnjob.pk_dept':JSON.stringify({"pk_org": this.pk_org})});
                }else{
//                    this.$refs.searchRef.setFilterConditionByFieldCode({'newpk_dept':JSON.stringify({"pk_org": this.pk_org})});
                }
            },
            ifbpPageInit(){
                this.request(this.currentPage, this.size);
            },
            // 获取页面的基本数据
            pageInit: function () {
                this.createCnt++;
                if (this.createCnt != 2) {
                    return;
                }
                if(!this.pk_org || this.pk_org.length == 0){
                    return;
                }
                this.request();

//                this.$http({
//                    url: "/hrtrn/part/apply/getOrgTreeData",
//                    method: "post",
//                }).then((res) => {
//                    if (res.data.status === true) {
//                        this.orgTreeData = res.data.data.orgtreedata;
//                        let defaultnode = res.data.data.defaultorgpk;
//                        this.pk_org = defaultnode[defaultnode.length - 1];
//                        this.selectedTreeNode = defaultnode;
//
//                        this.request();
//                    } else {
//                        this.$message({message: res.data.msg, type: "error"});
//                    }
//                }).catch(() => {
//                    this.$message({message: "信息获取失败", type: "error"});
//                });
            },

            // 请求数据
            request(n, s){
                if (this.tabType == "0") {
                    this.requestNoJZ(n, s);
                } else {
                    this.requestApply(n, s);
                }
            },
            requestNoJZ(n, s) {
                if(!this.pk_org)return;
                var pn = !n ? 1 : n;
                var ps = !s ? 10 : s;

                var url =
                    "/hrtrn/part/apply/pageList";
                this.$http({
                    url: url,
                    method: "post",
                    params: {
                        pn: pn,
                        ps: ps,
                        pk_org: this.pk_org,
                    },
                    data: this.searchTemplate
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_nopartapply_l.setTableData(res.data.data.content);
                            this.totalElements = res.data.data.totalElements;
                            this.size = res.data.data.size;
                            this.currentPage = res.data.data.number;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            // 请求数据
            requestApply(n, s) {
                if(!this.pk_org)return;
                var pn = !n ? 1 : n;
                var ps = !s ? 10 : s;

                var url = "/hrtrn/part/apply/applyPageList";
                let myself = this;
                let svr = this.$http({
                    url: url,
                    method: "post",
                    params: {
                        pn: pn,
                        ps: ps,
                        pk_org: this.pk_org,
                    },
                    data: this.searchTemplate,
                    dataType: "json"
                });
                svr.then((res) => {
                    if (res.data.status === true) {
                        myself.$refs.ref_partapply_l.setTableData(res.data.data.content);
                        myself.totalElements = res.data.data.totalElements;
                        myself.size = res.data.data.size;
                        myself.currentPage = res.data.data.number;
                    } else {
                        myself.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
            },

            // table行的查看操作
            tableViewClick(scope) {
                this.$router.push("/hrtrn/transmgt/partapply/detail/" + scope.row.pk_partmng + "/false");
            },
            // table行的编辑操作
            tableEditClick(scope) {
                this.$router.push("/hrtrn/transmgt/partapply/detail/" + scope.row.pk_partmng + "/true");
            },
            tableCommitClick(scope){

                let svr = this.$http({
                    url: "/hrtrn/part/apply/commit",
                    method: "post",
                    data: JSON.parse(JSON.stringify(scope.row))
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                });
            },
            tableExecuteClick(scope){
                this.hi_partapply = scope.row;
                this.execDialogVisible = true;
            },
            execBill(date){
                this.$http({
                    url: "/hrtrn/part/apply/execBill",
                    method: "post",
                    params:{
                        pk:this.hi_partapply.pk_partmng,
                        pk_org:this.hi_partapply.pk_org,
                        regularDate:date != null ? date.getTime() : null,
                    },
                })
                    .then(res => {
                        if (res.data.status === true) {
                                this.$message({
                                    message: "执行成功",
                                    type: "success"
                                });
                                this.requestApply(this.currentPage, this.size);
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "执行失败",
                            type: "error"
                        });
                    });
            },
            execDialogConfirm(){
                this.execDialogVisible = false;
                this.execBill(this.effectDate);
            },
            tableCallBackClick(scope){

                let svr = this.$http({
                    url: "/hrtrn/part/apply/callback",
                    method: "post",
                    data: JSON.parse(JSON.stringify(scope.row))
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                });
            },
            // table行的删除操作
            tableDeleteClick(scope) {
                this.delData = scope.row;
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

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },

            // 删除处理
            deleteClick() {
                let svr = this.$http({
                    url: "/hrtrn/part/apply/delete",
                    method: "post",
                    data: JSON.parse(JSON.stringify(this.delData))
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                });
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.request();
            },

            orgChange(val){
                this.pk_org = val;
                if(this.createCnt < 2)return;
                if(!this.pk_org || this.pk_org.length == 0){
                    this.pk_org = '';
                    this.$refs.ref_nopartapply_l.setTableData([]);
                    this.$refs.ref_partapply_l.setTableData([]);
                }else{
                    this.request();
                }
            },
//            handleTreeChange(treeItem) {
//                if (Array.isArray(treeItem) && treeItem.length) {
//                    let pk_org = treeItem[treeItem.length - 1];
//                    this.pk_org = pk_org;
//                    this.request();
//                } else {
//                    this.pk_org = '';
//                    this.$refs.ref_nopartapply_l.setTableData([]);
//                    this.$refs.ref_partapply_l.setTableData([]);
//                }
//            },

            settingBtn() {
                if (this.tabType == "0") {
                    this.$refs.ref_nopartapply_l.setTransferVisible(true);
                } else if (this.tabType === '1') {
                    this.$refs.ref_partapply_l.setTransferVisible(true);
                }
            },
            tabClick(){
                this.searchTemplate = {};
                this.$nextTick(function(){
                    this.resetSearchRefCond();
                    this.request();
                });
            },

            jzClick(scope){
                this.$refs.jzRef.show(scope.row.pk_psnjob);
            },
        }
    };
</script>
<style>
</style>
