<!--
  作者：zhang'htc
  时间：2018-10-10
  支持：发放设置——薪资项目授权
-->
<template>
    <ifbp-page id="itempower_info">
        <ifbp-breadcrumb name="薪资项目权限" v-show="false"></ifbp-breadcrumb>

        <ifbp-button-area :no-breadcrumb="true">
            <hr-org-cascader name="treeCascader" @update:pk_org="orgChange" @change="handleTreeChange"></hr-org-cascader>
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
            <el-cascader ref="treeWaClass"
                         expand-trigger="hover"
                         :show-all-levels="false"
                         :options="waClassData"
                         v-model="selectedClassTreeNode"
                         placeholder="请选择薪资方案"
                         not-leaf-selectable="true"
                         :hideBorder="true"
                         :hideRight="true"
                         @change="handleWaClassTreeChange">
            </el-cascader>

            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         v-if="power_type==1"
                         template-code="hrwa_itempower_item"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
            <ifbp-search class="fr"
                         v-if="power_type==2"
                         template-code="hrwa_itempower_role"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
            <ifbp-search class="fr"
                         v-if="power_type==3"
                         template-code="hrwa_itempower_user"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <ifbp-no-data :search-state="searchState" :total-elements="totalElements" :no-search-data-text="noDataText" no-data-head=".no-data-header-content" class="no-data-no-breadcrumb">
        <!-- 主体区域 -->
        <ifbp-main-area type="list" class="paddingTop0">
            <div class="no-data-header-content">
            <el-tabs v-model="power_type" @tab-click="tabClick" :has-bottom-border="false" :is-normal-type="false" :tab-position-top="true" class="ifbp-content-tabs">
                <div slot="header" class="fr">
                    <div class="ifbp-btn-line" >
                        <div class="fr">
                    <el-button type="text" @click="batchAssignRole" v-if="power_type==1" class="ifbp-layout-content-right-button marginleft24">分配给角色</el-button>
                    <el-button type="text" @click="batchAssignUser" v-if="power_type==1" class="ifbp-layout-content-right-button marginleft24">分配给用户</el-button>
                    <el-button type="text" @click="batchAssignItem" v-if="power_type!=1" class="ifbp-layout-content-right-button marginleft24">分配项目</el-button>
                        </div>
                    </div>
                </div>
                <el-tab-pane label="项目授权" name="1">
                    <ifbp-template ref="powerItemRef"
                                   :table-show-menu="false"
                                   class="uitemplate-no-top el-table-no-empty"
                                   tpl-id="hrwa_itempower_item"
                                   @after-create="pageTplCreate"
                                   :tpl-data="tplData"
                                   :tplResetFun="powerItemResetFun"
                                   :methods="powerMethods">
                    </ifbp-template>
                </el-tab-pane>
                <el-tab-pane label="角色授权" name="2">
                    <ifbp-template ref="powerRoleRef"
                                   :table-show-menu="false"
                                   class="uitemplate-no-top el-table-no-empty"
                                   tpl-id="hrwa_itempower_role"
                                   @after-create="pageTplCreate"
                                   :tpl-data="tplData"
                                   :tplResetFun="powerRoleResetFun"
                                   :methods="powerMethods">
                    </ifbp-template>
                </el-tab-pane>
                <el-tab-pane label="用户授权" name="3">
                    <ifbp-template ref="powerUserRef"
                                   :table-show-menu="false"
                                   class="uitemplate-no-top el-table-no-empty"
                                   tpl-id="hrwa_itempower_user"
                                   @after-create="pageTplCreate"
                                   :tpl-data="tplData"
                                   :tplResetFun="powerUserResetFun"
                                   :methods="powerMethods">
                    </ifbp-template>
                </el-tab-pane>
            </el-tabs>
            </div>
            <el-pagination
                    v-if="totalElements > 0"
                    @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="pageSize"
                           :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totalElements">
            </el-pagination>
        </ifbp-main-area>
        </ifbp-no-data>
        <el-dialog title="分配项目" v-model="itemDialogVisible" :show-close="false">
            <div>
                <ifbp-template ref="itemRef"
                               :table-show-menu="false"
                               class="uitemplate-no-top"
                               tpl-id="hrwa_itempower_dialog_item"
                               @after-create="itemTplCreate"
                               :tpl-data="tplDialogItemData"
                               :methods="dialogItemPowerMethods"
                               :tplResetFun="powerDialogItemResetFun">
                </ifbp-template>
                <el-checkbox class="all-checked" v-model="itemAllChecked" @change="handleItemAllCheck">全部全选</el-checkbox>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="itemDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="itemDialogSave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配给角色" v-model="roleDialogVisible" :show-close="false">
            <div>
                <ifbp-template ref="roleRef"
                               :table-show-menu="false"
                               class="uitemplate-no-top"
                               tpl-id="hrwa_itempower_dialog_role"
                               @after-create="roleTplCreate"
                               :tpl-data="tplDialogRoleData"
                               :methods="dialogRolePowerMethods"
                               :tplResetFun="powerDialogRoleResetFun">
                </ifbp-template>
                <el-checkbox class="all-checked" v-model="roleAllChecked" @change="handleRoleAllCheck">全部全选</el-checkbox>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="roleDialogSave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配给用户" v-model="userDialogVisible" :show-close="false">
            <div>
                <ifbp-template ref="userRef"
                               :table-show-menu="false"
                               class="uitemplate-no-top"
                               tpl-id="hrwa_itempower_dialog_user"
                               @after-create="userTplCreate"
                               :tpl-data="tplDialogUserData"
                               :methods="dialogUserPowerMethods"
                               :tplResetFun="powerDialogUserResetFun">
                </ifbp-template>
                <el-checkbox class="all-checked" v-model="userAllChecked" @change="handleUserAllCheck">全部全选</el-checkbox>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="userDialogSave">确 定</el-button>
            </div>
        </el-dialog>
    </ifbp-page>
</template>

<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
    export default {
        components: {
            hrOrgCascader,
        },
        mixins: [pageModelMixin],
        data() {
            var vm = this;
            return {
                searchState:"search",
                //已加载完的UI模板件数
                createCnt: 0,
                searchTemplate: {},
                power_type: '1',
                itemDialogVisible: false,
                roleDialogVisible: false,
                userDialogVisible: false,
                pk_org: '',
                pk_waclass: '',
                orgTreeData: [],
                waClassData: [],
                selectedTreeNode: [],
                selectedClassTreeNode: [],
                itemTplLoad: false,
                roleTplLoad: false,
                userTplLoad: false,
                waitScope:null,
                waitBatch:false,
                tplData: {},
                tplDialogItemData: {},
                tplDialogRoleData: {},
                tplDialogUserData: {},
                selSubjectPKs:[],
                selItemPKs:[],
                isReset:false,//是否批量设置

                itemAllChecked:false,
                roleAllChecked:false,
                userAllChecked:false,
                powerItemResetFun($node) {
                    var operateArr = [{
                        title: '分配给角色',
                        click: 'assignRole',
                        vif: "true"
                    }, {
                        title: '分配给用户',
                        click: 'assignUser',
                        vif: "true"
                    }];
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getTableOperateHtml(operateArr, 'right', 300, 'text');
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                powerRoleResetFun($node) {
                    var operateArr = [{
                        title: '分配项目',
                        click: 'assignItem',
                        vif: "true"
                    }];
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getTableOperateHtml(operateArr, 'right', 300, 'text');
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                powerUserResetFun($node) {
                    var operateArr = [{
                        title: '分配项目',
                        click: 'assignItem',
                        vif: "true"
                    }];
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getTableOperateHtml(operateArr, 'right', 300, 'text');
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                powerDialogItemResetFun($node){
                },
                dialogItemPowerMethods:{
                    resetDefItemAllCheck(){
                        vm.resetDefItemAllCheck();
                    },
                    isSelChange(row){
                        if(row.iscanedit){
                            row.editflag = row.issel;
                        }
                        vm.resetDefItemAllCheck();
                    },
                },
                powerDialogRoleResetFun($node){

                },
                dialogRolePowerMethods:{
                    resetDefRoleAllCheck(){
                        vm.resetDefRoleAllCheck();
                    },
                    isSelChange(row){
                        if(this.tableCoulmnVIfeditflag){
                            row.editflag = row.issel;
                        }
                        vm.resetDefRoleAllCheck();
                    },
                },
                powerDialogUserResetFun($node){

                },
                dialogUserPowerMethods:{
                    resetDefUserAllCheck(){
                        vm.resetDefUserAllCheck();
                    },
                    isSelChange(row){
                        if(this.tableCoulmnVIfeditflag){
                            row.editflag = row.issel;
                        }
                        vm.resetDefUserAllCheck();
                    },
                },
                powerMethods: {
                    assignRole(scope){
                        vm.assignRole(scope);
                    },
                    assignUser(scope){
                        vm.assignUser(scope);
                    },
                    assignItem(scope){
                        vm.assignItem(scope);
                    },

                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                pageSize: [10, 20, 30, 40],
            };
        },

        computed: {
            searchCode: function () {
                if (this.power_type == "1") {
                    return "hrwa_itempower_item";
                } else if (this.power_type == "2") {
                    return "hrwa_itempower_role";
                } else if (this.power_type == "3") {
                    return "hrwa_itempower_user";
                }
            },
            noDataText:function(){
                if (this.power_type == "1") {
                    return "没查询到项目";
                }else if (this.power_type == "2") {
                    return "没查询到角色";
                }else if (this.power_type == "3") {
                    return "没查询到用户";
                }
            }
        },
        created() {
        },
        methods: {
            orgChange(val){
                this.pk_org = val;
            },
            //项目全选复选框的Change事件
            handleItemAllCheck(){
                    var tableData = this.$refs.itemRef.getTableData();
                    if (!!tableData) {
                        for (var i = 0; i < tableData.length; i++) {
                            tableData[i].issel = this.itemAllChecked;
                            if(tableData[i].iscanedit){
                                tableData[i].editflag = this.itemAllChecked;
                            }
                        }
                    }
                    this.$refs.itemRef.setTableData(tableData);
            },
            //根据后台数据设置项目的全选复选框的状态
            resetDefItemAllCheck(){
                var tableData = this.$refs.itemRef.getTableData();
                if (!!tableData) {
                    for (var i = 0; i < tableData.length; i++) {
                        if(!tableData[i].issel){
                            this.itemAllChecked = false;
                            return;
                        }
                        if(tableData[i].iscanedit && !tableData[i].editflag){
                            this.itemAllChecked = false;
                            return;
                        }
                    }
                }else{
                    this.itemAllChecked = false;
                }
                this.itemAllChecked = true;
            },
            //角色全选复选框的Change事件
            handleRoleAllCheck(){
                var iscanedit = this.$refs.roleRef.getData("tableCoulmnVIfeditflag");
                var tableData = this.$refs.roleRef.getTableData();
                if (!!tableData) {
                    for (var i = 0; i < tableData.length; i++) {
                        tableData[i].issel = this.roleAllChecked;
                        if(iscanedit){
                            tableData[i].editflag = this.roleAllChecked;
                        }
                    }
                }
                this.$refs.roleRef.setTableData(tableData);
            },
            //根据后台数据设置角色的全选复选框的状态
            resetDefRoleAllCheck(){
                var tableData = this.$refs.roleRef.getTableData();
                var iscanedit = this.$refs.roleRef.getData("tableCoulmnVIfeditflag");
                if (!!tableData) {
                    for (var i = 0; i < tableData.length; i++) {
                        if(!tableData[i].issel){
                            this.roleAllChecked = false;
                            return;
                        }
                        if(iscanedit && !tableData[i].editflag){
                            this.roleAllChecked = false;
                            return;
                        }
                    }
                }else{
                    this.roleAllChecked = false;
                }
                this.roleAllChecked = true;
            },
            //用户全选复选框的Change事件
            handleUserAllCheck(){
                var iscanedit = this.$refs.userRef.getData("tableCoulmnVIfeditflag");
                var tableData = this.$refs.userRef.getTableData();
                if (!!tableData) {
                    for (var i = 0; i < tableData.length; i++) {
                        tableData[i].issel = this.userAllChecked;
                        if(iscanedit){
                            tableData[i].editflag = this.userAllChecked;
                        }
                    }
                }
                this.$refs.userRef.setTableData(tableData);
            },
            //根据后台数据设置用户的全选复选框的状态
            resetDefUserAllCheck(){
                var tableData = this.$refs.userRef.getTableData();
                var iscanedit = this.$refs.userRef.getData("tableCoulmnVIfeditflag");
                if (!!tableData) {
                    for (var i = 0; i < tableData.length; i++) {
                        if(!tableData[i].issel){
                            this.userAllChecked = false;
                            return;
                        }
                        if(iscanedit && !tableData[i].editflag){
                            this.userAllChecked = false;
                            return;
                        }
                    }
                }else{
                    this.userAllChecked = false;
                }
                this.userAllChecked = true;
            },
            pageTplCreate(){
                this.createCnt++;
                if (this.createCnt != 3) {
                    return;
                }
                if(this.pk_waclass){
                    this.requestData();
                }
            },
            // 获取页面的基本数据
//            pageInit: function () {
//                this.$http({
//                    url: "/hrwa/itempower/getOrgTreeData",
//                    method: "post",
//                }).then((res) => {
//                    if (res.data.status === true) {
//                        this.orgTreeData = res.data.data.orgtreedata;
//                        let defaultnode = res.data.data.defaultorgpk;
//                        this.pk_org = defaultnode[defaultnode.length - 1];
//                        this.selectedTreeNode = defaultnode;
//                        this.getWaClassData();
//                    } else {
//                        this.$message({message: res.data.msg, type: "error"});
//                    }
//                }).catch(() => {
//                    this.$message({message: "信息获取失败", type: "error"});
//                });
//            },

            handleTreeChange(treeItem) {
                this.pk_waclass = '';
                this.waClassData = [];
                if(this.$refs.powerItemRef){
                    this.$refs.powerItemRef.setTableData([]);
                }
                if(this.$refs.powerRoleRef){
                    this.$refs.powerRoleRef.setTableData([]);
                }
                if(this.$refs.powerUserRef){
                    this.$refs.powerUserRef.setTableData([]);
                }

                this.selectedClassTreeNode = [];
                if(this.pk_org){
                    this.getWaClassData();
                }
//                if (Array.isArray(treeItem) && treeItem.length) {
//                    let pk_org = treeItem[treeItem.length - 1];
//                    this.pk_org = pk_org;
//                } else {
//                    this.pk_org = '';
//                }
            },

            getWaClassData(){
                this.$http({
                    url: '/hrwa/itempower/getWaClassData',
                    method: "post",
                    params: {
                        pk_org: this.pk_org,
                    },
                }).then((res) => {
                    if (res.data.success) {
                        this.waClassData = res.data.data;
                        if(this.waClassData && this.waClassData.length > 0){
                            this.pk_waclass = this.waClassData[0].value;
                            this.selectedClassTreeNode = [this.pk_waclass];
                            this.requestData();
                        }
                    } else if (res.data.error && res.data.error.errorMessage) {
                        this.$message({
                            message: '树获取失败: ' + res.data.error.errorMessage,
                            type: 'error'
                        });
                    }
                }).catch((e) => {
                    this.$message.error('请求出错');
                });
            },
            handleWaClassTreeChange(treeItem) {
                this.$refs.powerItemRef.setTableData([]);
                if (Array.isArray(treeItem) && treeItem.length) {
                    this.pk_waclass = treeItem[treeItem.length - 1];
                    this.requestData();
                } else {
                    this.pk_waclass = '';
                }
            },

            // 初始化加载数据
            requestData(pageNum, pageSize) {
                if(this.createCnt < 3){
                    //三个模板没有全加载完，则不从后台取数
                    return;
                }

                let param = {
                    pageNum: pageNum || 1,
                    pageSize: pageSize || 10,
                    type: Number(this.power_type),
                    pk_org: this.pk_org,
                    pk_wa_class: this.pk_waclass,
                };
                this.$http({
                    url: '/hrwa/itempower/list',
                    method: 'post',
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    switch (this.power_type) {
                        case '1':
                            this.$refs.powerItemRef.setTableData(res.data.data.content);
                            break;
                        case '2':
                            this.$refs.powerRoleRef.setTableData(res.data.data.content);
                            break;
                        case '3':
                            this.$refs.powerUserRef.setTableData(res.data.data.content);
                            break;
                        default:
                            break;
                    }
                    this.totalElements = res.data.data.totalElements;
                    this.size = res.data.data.size;
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });
            },


            tabClick: function () {
                this.searchTemplate = {};
                if(!this.pk_org || !this.pk_waclass)return;
                this.$nextTick(function(){
                    this.requestData();
                });
            },
            itemTplCreate(){
                this.itemTplLoad = true;
                if(this.waitBatch){
                    this.waitBatch = false;
                    this.batchAssignItem();
                }else if(this.waitScope){
                    this.assignItem(this.waitScope);
                    this.waitScope = null;
                }
            },
            roleTplCreate(){
                this.roleTplLoad = true;
                if(this.waitBatch){
                    this.waitBatch = false;
                    this.batchAssignRole();
                }else if(this.waitScope){
                    this.assignRole(this.waitScope);
                    this.waitScope = null;
                }
            },
            userTplCreate(){
                this.userTplLoad = true;
                if(this.waitBatch){
                    this.waitBatch = false;
                    this.batchAssignUser();
                }else if(this.waitScope){
                    this.assignUser(this.waitScope);
                    this.waitScope = null;
                }
            },
            assignItem(scope){
                this.isReset = false;
                this.itemDialogVisible = true;
                if(!this.itemTplLoad){
                    this.waitScope = scope;
                    return;
                }
                this.$nextTick(function () {
                    this.$refs.itemRef.setTableData([]);
                });
//
                var subjectId = "";
                if (Number(this.power_type) == 2) {
                    subjectId = scope.row.pk_role;
                } else if (Number(this.power_type) == 3) {
                    subjectId = scope.row.cuserid;
                }
                this.selSubjectPKs = [subjectId];
                let param = {
                    type: Number(this.power_type),
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                    subjectId: subjectId,
                };
                this.$http({
                    url: '/hrwa/itempower/dialogitem',
                    method: 'post',
                    params: param,
                }).then((res) => {
                    this.$refs.itemRef.setTableData(res.data.data);
                    this.resetDefItemAllCheck();
//                        this.$nextTick(function () {
//                            var tableData = this.$refs.itemRef.getTableData();
//                            if (!!tableData) {
//                                for (var i = 0; i < tableData.length; i++) {
//                                    this.$refs.itemRef.getTableComp().toggleRowSelection(tableData[i], tableData[i].pk_subject);
//                                }
//                            }
//                        });
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });

            },
            assignRole(scope){
                this.isReset = false;
                this.roleDialogVisible = true;
                if(!this.roleTplLoad){
                    this.waitScope = scope;
                    return;
                }
                this.$nextTick(function () {
                    this.$refs.roleRef.setTableData([]);
                });
                this.selItemPKs = [scope.row.pk_wa_item];
                let param = {
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                    pk_wa_item: scope.row.pk_wa_item,
                };
                this.$http({
                    url: '/hrwa/itempower/dialogrole',
                    method: 'post',
                    params: param,
                }).then((res) => {
                    this.$refs.roleRef.setTableData(res.data.data);
                    this.$refs.roleRef.setData("tableCoulmnVIfeditflag",scope.row.iscanedit);
                    this.resetDefRoleAllCheck();
//                    this.$nextTick(function () {
//                        var tableData = this.$refs.roleRef.getTableData();
//                        if (!!tableData) {
//                            for (var i = 0; i < tableData.length; i++) {
//                                this.$refs.roleRef.getTableComp().toggleRowSelection(tableData[i], tableData[i].issel);
//                            }
//                        }
//                    });
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });
            },
            assignUser(scope){
                this.isReset = false;
                this.userDialogVisible = true;
                if(!this.userTplLoad){
                    this.waitScope = scope;
                    return;
                }
                this.$nextTick(function () {
                    this.$refs.userRef.setTableData([]);
                });
                this.selItemPKs = [scope.row.pk_wa_item];
                let param = {
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                    pk_wa_item: scope.row.pk_wa_item,
                };
                this.$http({
                    url: '/hrwa/itempower/dialoguser',
                    method: 'post',
                    params: param,
                }).then((res) => {
                    this.$refs.userRef.setTableData(res.data.data);
                    this.$refs.userRef.setData("tableCoulmnVIfeditflag",scope.row.iscanedit);
                    this.resetDefUserAllCheck();
//                    this.$nextTick(function () {
//                        var tableData = this.$refs.userRef.getTableData();
//                        if (!!tableData) {
//                            for (var i = 0; i < tableData.length; i++) {
//                                this.$refs.userRef.getTableComp().toggleRowSelection(tableData[i], tableData[i].issel);
//                            }
//                        }
//                    });
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });

            },
            itemDialogSave(){
                if(!this.isReset){
                    this.realItemDialogSave();
                    return;
                }
                this.$confirm('此操作将重置所选项目的权限设置，是否继续？', '提示', {
                    confirmButtonText: '重置',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.realItemDialogSave();
                }).catch(() => {
                });
            },
            realItemDialogSave(){
                var pk_wa_items = [];
                var editflags = [];
//                var selectRows = this.$refs.itemRef.getTableComp().getSelection();
                var tableData = this.$refs.itemRef.getTableData();
                if(tableData){
                    for(var i = 0; i < tableData.length; i++){
                        if(!!tableData[i].issel){
                            pk_wa_items.push(tableData[i].pk_wa_item);
                            editflags.push(!!tableData[i].editflag);
                        }
                    }
                }
//                if(!!selectRows){
//                    for(var i = 0; i < selectRows.length; i++){
//                        pk_wa_items.push(selectRows[i].pk_wa_item);
//                        editflags.push(!!selectRows[i].editflag);
//                    }
//                }
                let param = {
                    type: Number(this.power_type),
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                    pk_subject: this.selSubjectPKs,
                    pk_wa_item:pk_wa_items,
                    editflag:editflags,
                };
                this.$http({
                    url: '/hrwa/itempower/saveItem',
                    method: 'post',
                    data: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({message: res.data.msg, type: 'success'});
                        this.itemDialogVisible = false;
                    } else {
                        this.$message({message: res.data.msg, type: 'error'});
                    }
                }).catch(() => {
                    this.$message({message: '保存失败', type: 'error'});
                });
            },

            roleDialogSave(){
                if(!this.isReset){
                    this.realRoleDialogSave();
                    return;
                }
                this.$confirm('此操作将重置所选角色的项目权限设置，是否继续？', '提示', {
                    confirmButtonText: '重置',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.realRoleDialogSave();
                }).catch(() => {
                });
            },

            realRoleDialogSave(){
                var pk_wa_items = this.selItemPKs;
                var pk_subjects = [];
                var editflags = [];
//                var selectRows = this.$refs.roleRef.getTableComp().getSelection();
//                if(!!selectRows){
//                    for(var i = 0; i < selectRows.length; i++){
//                        if(selectRows[i].haschild){
//                           continue;
//                        }
//                        pk_subjects.push(selectRows[i].pk_role);
//                        editflags.push(!!selectRows[i].editflag);
//                    }
//                }

                var tableData = this.$refs.roleRef.getTableData();
                if(tableData){
                    for(var i = 0; i < tableData.length; i++){
                        if(!!tableData[i].issel){
                            pk_subjects.push(tableData[i].pk_role);
                            editflags.push(!!tableData[i].editflag);
                        }
                    }
                }

                let param = {
                    isRole: true,
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                    pk_subject: pk_subjects,
                    pk_wa_item:pk_wa_items,
                    editflag:editflags,
                };
                this.$http({
                    url: '/hrwa/itempower/saveOther',
                    method: 'post',
                    data: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({message: res.data.msg, type: 'success'});
                        this.roleDialogVisible = false;
                    } else {
                        this.$message({message: res.data.msg, type: 'error'});
                    }
                }).catch(() => {
                    this.$message({message: '保存失败', type: 'error'});
                });
            },

            userDialogSave(){
                if(!this.isReset){
                    this.realUserDialogSave();
                    return;
                }
                this.$confirm('此操作将重置所选用户的项目权限设置，是否继续？', '提示', {
                    confirmButtonText: '重置',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.realUserDialogSave();
                }).catch(() => {
                });
            },

            realUserDialogSave(){
                var pk_wa_items = this.selItemPKs;
                var pk_subjects = [];
                var editflags = [];
//                var selectRows = this.$refs.userRef.getTableComp().getSelection();
//                if(!!selectRows){
//                    for(var i = 0; i < selectRows.length; i++){
//                        if(selectRows[i].haschild){
//                            continue;
//                        }
//                        pk_subjects.push(selectRows[i].cuserid);
//                        editflags.push(!!selectRows[i].editflag);
//                    }
//                }

                var tableData = this.$refs.userRef.getTableData();
                if(tableData){
                    for(var i = 0; i < tableData.length; i++){
                        if(!!tableData[i].issel){
                            pk_subjects.push(tableData[i].cuserid);
                            editflags.push(!!tableData[i].editflag);
                        }
                    }
                }

                let param = {
                    isRole: false,
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                    pk_subject: pk_subjects,
                    pk_wa_item:pk_wa_items,
                    editflag:editflags,
                };
                this.$http({
                    url: '/hrwa/itempower/saveOther',
                    method: 'post',
                    data: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({message: res.data.msg, type: 'success'});
                        this.userDialogVisible = false;
                    } else {
                        this.$message({message: res.data.msg, type: 'error'});
                    }
                }).catch(() => {
                    this.$message({message: '保存失败', type: 'error'});
                });
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.requestData();
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.currentPage = 1;
                this.size = val;
                this.requestData(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.requestData(val, this.size);
            },

            batchAssignRole(){
                this.isReset = true;
                var selItems = this.$refs.powerItemRef.getTableComp().getSelection();
                if (!selItems || selItems.length == 0) {
                    this.$message({message: '请先选择要分配的数据！', type: 'error'});
                    return false;
                }
                this.roleDialogVisible = true;
                if(!this.roleTplLoad){
                    this.waitBatch = true;
                    return;
                }
                this.$nextTick(function () {
                    this.$refs.roleRef.setTableData([]);
                });
                this.selItemPKs = [];
                var isCanEdit = false;
                for(var i=0; i < selItems.length; i++){
                    this.selItemPKs.push(selItems[i].pk_wa_item);
                    isCanEdit = isCanEdit || selItems[i].iscanedit;
                }
                let param = {
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                };
                this.$http({
                    url: '/hrwa/itempower/dialogrole',
                    method: 'post',
                    params: param,
                }).then((res) => {
                    this.$refs.roleRef.setTableData(res.data.data);
                    this.$refs.roleRef.setData("tableCoulmnVIfeditflag",isCanEdit);
                    this.resetDefRoleAllCheck();
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });
            },
            batchAssignUser(){
                this.isReset = true;
                var selItems = this.$refs.powerItemRef.getTableComp().getSelection();
                if (!selItems || selItems.length == 0) {
                    this.$message({message: '请先选择要分配的数据！', type: 'error'});
                    return false;
                }

                this.userDialogVisible = true;
                if(!this.userTplLoad){
                    this.waitBatch = true;
                    return;
                }

                this.$nextTick(function () {
                    this.$refs.userRef.setTableData([]);
                });
                this.selItemPKs = [];
                var isCanEdit = false;
                for(var i=0; i < selItems.length; i++){
                    this.selItemPKs.push(selItems[i].pk_wa_item);
                    isCanEdit = isCanEdit || selItems[i].iscanedit;
                }
                let param = {
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                };
                this.$http({
                    url: '/hrwa/itempower/dialoguser',
                    method: 'post',
                    params: param,
                }).then((res) => {
                    this.$refs.userRef.setTableData(res.data.data);
                    this.$refs.userRef.setData("tableCoulmnVIfeditflag",isCanEdit);
                    this.resetDefUserAllCheck();
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });
            },
            batchAssignItem(){
                this.isReset = true;
                var selItems;
                if (Number(this.power_type) == 2) {
                    selItems = this.$refs.powerRoleRef.getTableComp().getSelection();
                } else if (Number(this.power_type) == 3) {
                    selItems = this.$refs.powerUserRef.getTableComp().getSelection();
                }

                if (!selItems || selItems.length == 0) {
                    this.$message({message: '请先选择要分配的数据！', type: 'error'});
                    return false;
                }

                this.itemDialogVisible = true;
                if(!this.itemTplLoad){
                    this.waitBatch = true;
                    return;
                }

                this.selSubjectPKs = [];
                for(var i=0; i < selItems.length; i++){
                    if (Number(this.power_type) == 2) {
                        this.selSubjectPKs.push(selItems[i].pk_role);
                    } else if (Number(this.power_type) == 3) {
                        this.selSubjectPKs.push(selItems[i].cuserid);
                    }

                }

                this.$nextTick(function () {
                    this.$refs.itemRef.setTableData([]);
                });

                let param = {
                    type: Number(this.power_type),
                    pk_org: this.pk_org,
                    pk_waclass: this.pk_waclass,
                };
                this.$http({
                    url: '/hrwa/itempower/dialogitem',
                    method: 'post',
                    params: param,
                }).then((res) => {
                    this.$refs.itemRef.setTableData(res.data.data);
                    this.resetDefItemAllCheck();
                }).catch(() => {
                    this.$message({message: '查询失败', type: 'error'});
                });
            },

        }
    };
</script>

<style scoped>
    .all-checked{
        margin:16px;
    }
</style>
