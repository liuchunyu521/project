<template>
    <ifbp-page>
        <ifbp-breadcrumb name="员工转正" v-show="false"></ifbp-breadcrumb>
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
                         @search="advancedSearch"
                         @toggle-search-panel="toggleSearchPanel">
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
                            <el-button type="text" @click="batchBtn" class="ifbp-layout-content-right-button marginleft24"  v-if="false">批量转正</el-button>
                            <i class="ifbp-icon-setting" @click="settingBtn"></i>
                        </div>
                    </div>
                </div>
                <el-tab-pane label="未转正" name="0">
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_noregapply_l"
                                   tpl-id="hrtrn_noregapply_list"
                                   class="uitemplate-no-top"
                                   @after-create="pageInit"
                                   :table-show-menu="false"
                                   :tpl-data="tableDataNoZZ"
                                   :methods="ruleTableMethodsNoZZ"
                                   :tpl-reset-fun="tableResetFunNoZZ">
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
                <el-tab-pane label="转正申请" name="1">
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_regapply_l"
                                   tpl-id="hrtrn_regapply_list"
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
        <zzDialog ref="zzRef"></zzDialog>

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
    import hrPeriod from './period-comp.vue';
    import zzDialog from './zz-dialog.vue';
    import pageModelMixin from "ifbp-business/pageModelMixin";
    import tableHeightMixin from "ifbp-business/tableHeightMixin";
    let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
    export default {
        mixins: [pageModelMixin,tableHeightMixin],
        components: {
            hrOrgCascader,
            zzDialog,
        },
        data() {
            var vm = this;
            Vue.component('hr-period', hrPeriod);
            return {
                // 页面除 el-table(tbody)之外的高度;
                otherHeight: 210,
                searchState: "search",
                execDialogVisible:false,
                effectDate:new Date(),
                hi_regapply:{},
                //已加载完的UI模板件数
                createCnt: 0,
//                orgTreeData: [],
//                selectedTreeNode: [],
                pk_org: '',
                tabType: '0',
                tableData: {},
                tableDataNoZZ: {},
                tableResetFunNoZZ: function ($node) {

                    var $begindate = $node.find("[prop='begindate']");
                    $begindate.attr('render-type', 'default');
                    $begindate.html(
                        '<template scope="scope"><hr-period :begindate="scope.row.begindate" :enddate="scope.row.enddate"></hr-period></template>'
                    );

                    var operateArr = [{
                        title: '转正',
                        icon: 'gavel',
                        click:'zzClick(scope)',
                        vif: "true"
                    }];
                    var $table = this.getTableDom($node);
                    //设置Table高度
                    //有问题，暂时不用
//                    $table.attr(':height','tBodyHeight');
                    var operateHtml = this.getTableOperateHtml(operateArr,'right',100,'text');
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                ruleTableMethodsNoZZ: {
                    zzClick(scope){
                        vm.zzClick(scope);
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

                    //试用期
                    var $begin_date = $node.find("[prop='begin_date']");
                    $begin_date.attr('render-type', 'default');
                    $begin_date.html(
                        '<template scope="scope"><span>{{getPeriodStr(scope.row.begin_date,scope.row.end_date)}}</span></template>'
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
                    //设置Table高度
                    //有问题，暂时不用
//                    $table.attr(':height','tBodyHeight');
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
                        let pk = row.pk_hi_regapply;
                        vm.$router.push("/hrtrn/regapply/applydetail/" + pk + "/false/" + row.trialresult);
                    },
                    getPeriodStr(begindate, enddate){
                        var date1 = new Date(begindate);
                        var year = date1.getFullYear();
                        var month = date1.getMonth() + 1;
                        if (month < 10) month = "0" + month;
                        var day = date1.getDate();
                        if (day < 10) day = "0" + day;
                        var begindatestr = year + "-" + month + "-" + day;
                        begindatestr += "~"
                        if (!!enddate) {
                            var date2 = new Date(enddate);
                            year = date2.getFullYear();
                            month = date2.getMonth() + 1;
                            if (month < 10) month = "0" + month;
                            day = date2.getDate();
                            if (day < 10) day = "0" + day;
                            var enddatestr = year + "-" + month + "-" + day;
                            begindatestr += enddatestr;
                        }
                        return begindatestr;
                    },
                    showDetail(scope){
                        let pk = scope.row.pk_hi_regapply;
                        vm.$router.push("/hrtrn/regapply/applydetail/" + pk + "/false/" + scope.row.trialresult);
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
            searchCode: function () {
                if (this.tabType == "0") {
                    return "zzapplyselpsn";
                } else {
                    return "zzapplylist";
                }
            },
            noDataText:function(){
                if (this.tabType == "0") {
                    return "暂无转正人员";
                }else{
                    return "没查询到转正申请单";
                }
            }
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
                    this.$refs.searchRef.setFilterConditionByFieldCode({'pk_dept':JSON.stringify({"pk_org": this.pk_org})});
                }else{
                    this.$refs.searchRef.setFilterConditionByFieldCode({'newpk_dept':JSON.stringify({"pk_org": this.pk_org})});
                }
            },
            // 当页面高度变化后重置tbody的高度;
            resetTableHeight(height){
                //有问题，暂时不用
//                this.$refs["ref_noregapply_l"].setData('tBodyHeight',height);
//                this.$refs["ref_regapply_l"].setData('tBodyHeight',height);
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
//                    url: "/hrtrn/regmng/apply/getOrgTreeData",
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
                    this.requestNoZZ(n, s);
                } else {
                    this.requestApply(n, s);
                }
            },
            requestNoZZ(n, s) {
                if(!this.pk_org)return;
                var pn = !n ? 1 : n;
                var ps = !s ? 10 : s;

                var url =
                    "/hrtrn/regmng/apply/pageList";
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
                            this.$refs.ref_noregapply_l.setTableData(res.data.data.content);
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

                var url = "/hrtrn/regmng/apply/applyPageList";
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
                        myself.$refs.ref_regapply_l.setData("hi_regapply_t", res.data.data.content);
                        myself.totalElements = res.data.data.totalElements;
                        myself.size = res.data.data.size;
                        myself.currentPage = res.data.data.number;
                        myself.hasGroupPower = res.data.hasGroupPower;
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
                this.$router.push("/hrtrn/regapply/applydetail/" + scope.row.pk_hi_regapply + "/false/" + scope.row.trialresult);
            },
            // table行的编辑操作
            tableEditClick(scope) {
                this.$router.push("/hrtrn/regapply/applydetail/" + scope.row.pk_hi_regapply + "/true/" + scope.row.trialresult);
            },
            tableCommitClick(scope){

                let svr = this.$http({
                    url: "/hrtrn/regmng/apply/commit",
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
                this.hi_regapply = scope.row;
                this.execDialogVisible = true;
            },
            execBill(checkBudget, date){
                this.$http({
                    url: "/hrtrn/regmng/apply/execBill",
                    method: "post",
                    params:{
                        pk:this.hi_regapply.pk_hi_regapply,
                        pk_org:this.hi_regapply.pk_org,
                        checkBudget:checkBudget,
                        regularDate:date != null ? date.getTime() : null,
                    },
                })
                    .then(res => {
                        if (res.data.status === true) {
                            if(res.data.warn){
                                this.$confirm(res.data.msg, '提示', {
                                    confirmButtonText: '继续',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.execBill(false, date);
                                }).catch(() => {
                                });
                            }else{
                                this.$message({
                                    message: "执行成功",
                                    type: "success"
                                });
                                this.requestApply(this.currentPage, this.size);
                            }
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
                this.execBill(true, this.effectDate);
            },
            tableCallBackClick(scope){

                let svr = this.$http({
                    url: "/hrtrn/regmng/apply/callback",
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
                    url: "/hrtrn/regmng/apply/delete",
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
                    this.$refs.ref_noregapply_l.setTableData([]);
                    this.$refs.ref_regapply_l.setTableData([]);
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
//                    this.$refs.ref_noregapply_l.setTableData([]);
//                    this.$refs.ref_regapply_l.setTableData([]);
//                }
//            },

            settingBtn() {
                if (this.tabType == "0") {
                    this.$refs.ref_noregapply_l.setTransferVisible(true);
                } else if (this.tabType === '1') {
                    this.$refs.ref_regapply_l.setTransferVisible(true);
                }
            },
            batchBtn(){
                alert("该功能暂时不需要开发！如果项目有需要，请联系需求人员。");
            },
            tabClick(){
                this.searchTemplate = {};
                this.$nextTick(function(){
                    this.resetSearchRefCond();
                    this.request();
                });
            },

            zzClick(scope){
                var item = scope.row;
                if (item.approvestate == -1) {
                    this.$router.push("/hrtrn/regapply/applydetail/" + item.pk_hi_regapply + "/false/1");
                } else {
                    this.$refs.zzRef.show(item.pk_psnjob, item.trial_type);
                }
            },
        }
    };
</script>
<style>
</style>
