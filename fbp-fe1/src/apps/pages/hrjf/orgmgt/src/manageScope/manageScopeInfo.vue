<!--
  作者：liyn11
  时间：2018-11-19
  支持： 组织管理范围
-->
<template>
    <ifbp-page id="manageScopeId">
        <!-- 节点title -->
        <ifbp-breadcrumb name="组织管理范围设置" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
                <hr-org-cascader name="orgCasc"
                                 @update:pk_org="val => {this.pk_org = val}"
                                 :isNeedDept="false"
                                 @change="refreshData">
                </hr-org-cascader>
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!--<ifbp-no-data :search-state="searchState" :total-elements="totalElements+inintTotal"-->
                      <!--:no-search-data-text="noDataText" no-data-head=".no-data-header-ms"-->
                      <!--class="no-data-no-breadcrumb">-->
            <!-- 主体区域 -->
            <ifbp-main-area type="list" class="paddingTop0">

                <!--<div class="no-data-header-ms">-->
                    <div style="width:100%;height:16px;"></div>
                    <div align="right" class="top-button">
                        <span class="fl" id="numId">管理对象 ({{this.totalElements}})</span>
                        <el-button type="text" class="ifbp-layout-content-right-button marginleft24"
                                   @click="manageByOrg"><span>按组织管理</span></el-button>
                        <el-button type="text" class="ifbp-layout-content-right-button marginleft24"
                                   @click="manageByDept">按部门管理
                        </el-button>
                        <i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -4px;"
                           v-if="false"></i>
                    </div>
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_manageScope"
                                   tpl-id="manageScopeTplId"
                                   class="uitemplate-no-top"
                                   :tpl-data="scopeData"
                                   :table-show-menu="false"
                                   :tplResetFun="scopeResetFun"
                                   :methods="formMethods"
                                   @delete-table-click="scopeDeleteClick">
                    </ifbp-template>
                    <!--分页组件-->
                    <el-pagination
                            v-show="totalElements>0"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElements">
                    </el-pagination>
                <!--</div>-->

            </ifbp-main-area>
        <!--</ifbp-no-data>-->

        <manageScopeByOrg :ref="msByOrgRef" @msByOrgRequest="childRequest"></manageScopeByOrg>
        <manageScopeByDept :ref="msByDeptRef" @msByDeptRequest="childRequest"></manageScopeByDept>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
    import manageScopeByOrg from './manageByOrgDialog.vue';
    import manageScopeByDept from 'manageByDeptDialog.vue';

    export default {
        mixins: [pageModelMixin],
        components: {
            manageScopeByOrg,
            manageScopeByDept,
            HrOrgCascader
        },
        data() {
            const vm = this;
            return {
                inintTotal:1,
                noDataText: '暂无管理对象',
                searchState: 'search',
                msByOrgRef: 'msByOrgRef',
                msByDeptRef: 'msByDeptRef',
                pk_relation: '',
                search_input: '',
                defaultPk_org: '',
                pk_org: "",
                orgTreeData: [],
                //级联选择器
                orgModel: [],
                //接受后台判断是否有附件
                reqFileExist: {},
                // 查询模板传入参数
                tplCode: 'manageScopeTpls',
                searchTemplate: {},
                delIds: [],
                //分页
                totalElements: 0,
                currentPage: 1,
                size: 10,
                scopeData: {},
                formMethods: {

                    //停用启用点击事件
                    handleChange: function (rowData, pk_associateattr) {
                        if (!rowData || !pk_associateattr) {
                            return;
                        }
                        var updateDate = rowData;
                        var url = "/hrjf/manageScope/update";
                        let param = {
                            pk_associateattr: pk_associateattr
                        };
                        this.$http({
                            url: url,
                            method: "post",
                            traditional: true,
                            data: updateDate,
                            params: param
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "warning"
                                    });
                                    vm.request(vm.currentPage, vm.size);
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: "失败",
                                    type: "error"
                                });
                            });
                    },


                },
                scopeResetFun: function ($node) {
                    let $table = this.getTableDom($node);


                    var $psndocflag = $node.find("[prop='psndocflag']");
                    $psndocflag.attr('render-type', 'default');
                    $psndocflag.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row,\'PSNDOC00000000000000\')" v-model="scope.row.psndocflag"on-color="#4BD762" off-color="#AFAFAF" :on-value="true" :off-value="false" on-text="是" off-text="否"> </el-switch>' +
                        '</template>'
                    );

                    var $psnpactflag = $node.find("[prop='psnpactflag']");
                    $psnpactflag.attr('render-type', 'default');
                    $psnpactflag.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row,\'PSNPACT0000000000000\')" v-model="scope.row.psnpactflag"on-color="#4BD762" off-color="#AFAFAF" :on-value="true" :off-value="false" on-text="是" off-text="否"> </el-switch>' +
                        '</template>'
                    );


                    var $salaryflag = $node.find("[prop='salaryflag']");
                    $salaryflag.attr('render-type', 'default');
                    $salaryflag.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row,\'SALARY00000000000000\')" v-model="scope.row.salaryflag"on-color="#4BD762" off-color="#AFAFAF" :on-value="true" :off-value="false" on-text="是" off-text="否"> </el-switch>' +
                        '</template>'
                    );


                    let detail = [{
                        title: "删除",
                        icon: "delete",
                    }];
                    var operateHtml = this.getTableOperateHtml(detail,"");

                    $table.append(operateHtml);

                    return $node[0].outerHTML;
                },
            };
        },
        mounted() {
        },
        created() {
            // this.getOrgTreeData()
        },
        methods: {
            refreshData: function () {
                if (this.pk_org) {
                    this.request();
                }
            },
            // 请求数据，改成懒加载查询的是一级数据
            request(n, s) {
                if (!this.pk_org) {
                    return;
                }
                let param = {
                    pn: n ? n : '1',
                    ps: s ? s : '10',
                    sortField: '',
                    pk_org: this.pk_org
                };
                this.$http({
                    url: '/hrjf/manageScope/pageList',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    this.inintTotal=0;
                    if (res.data.status === true) {
                        this.$refs.ref_manageScope.setTableData(res.data.data.content);
                        this.totalElements = res.data.data.totalElements;
                      //  this.size = res.data.data.size;
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // 获取树的数据expand-trigger
            getOrgTreeData() {
                this.$http({
                    url: '/hrjf/post/orgCascaderData',
                    method: "get",
//                    data: this.searchTemplate,
                    params: '',
                }).then((res) => {
                    if (res.data.success) {
                        this.orgTreeData = res.data.data.orgtreedata;
                        let defaultnode = res.data.data.defaultorgpk;
                        if (!defaultnode) {
                            defaultnode = this.orgTreeData[0].value;
                        }
                        if ("string" != typeof(defaultnode)) {
                            this.defaultPk_org = defaultnode[defaultnode.length - 1];
                        } else {
                            this.defaultPk_org = defaultnode;
                        }

                        let pk_org = sessionStorage.getItem("manageScope-pk_org");

                        let orgModel = JSON.parse(sessionStorage.getItem("manageScope-orgModel"));

                        if (pk_org) {
                            this.pk_org = pk_org;
                        } else {
                            this.pk_org = this.defaultPk_org;
                        }
                        if (orgModel) {
                            this.orgModel = orgModel;
                        } else {
                            this.orgModel = [this.defaultPk_org];
                        }
                        this.request();
                    } else if (res.data.error && res.data.error.errorMessage) {
                        console.log('组织树获取失败', JSON.stringify(res.data.error));
                        this.$message({
                            message: '组织树获取失败: ' + res.data.error.errorMessage,
                            type: 'error'
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    this.$message.error('请求出错');
                });
            },
            // 格式化树状参照的显示(code + name)
            formatTreeLabel(dataArr) {
                if (!Array.isArray(dataArr)) {
                    return dataArr;
                }
                for (let i = 0; i < dataArr.length; i++) {
                    let refObj = dataArr[i];
                    if (Object.prototype.toString.call(refObj) !== '[object Object]') {
                        continue;
                    }
                    refObj.label = refObj.name;
                    refObj.value = refObj.pk_dept;
                    if (refObj.children && refObj.children.length > 0) {
                        refObj.children = this.formatTreeLabel(refObj.children);
                    } else {
                        refObj.children = null;
                    }
                }
                return dataArr;
            },
            orgChange(treeItem) {
                if (Array.isArray(treeItem) && treeItem.length) {
                    this.pk_org = treeItem[treeItem.length - 1];
                    this.pk_dept = '';
                    sessionStorage.setItem("manageScope-pk_org", this.pk_org);
                    sessionStorage.setItem("manageScope-orgModel", JSON.stringify(treeItem));
                    this.request();
                } else {
                    this.pk_org = '';
                }
            },
            // table行的删除操作
            scopeDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.pk_relation = scope.row.pk_relation;
                    if (this.pk_relation === undefined) {
                        return;
                    }
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.request();
            },

            //刷新table
            refreshTableList: function () {
                this.requestForSearch();
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.currentPage = 1;
                this.size = val;
                sessionStorage.setItem('manageScope-pageSize', parseInt(val));
                sessionStorage.setItem('manageScope-currentPage', this.currentPage);
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
                sessionStorage.setItem('manageScope-currentPage', this.currentPage);
            },
            // 删除处理
            deleteClick() {
                var pk_relation = this.pk_relation;
                this.$http({
                    url: '/hrjf/manageScope/delete/' + pk_relation,
                    method: 'get'
                }).then((res) => {
                    if (res.data.status) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.request(this.currentPage, this.size);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.delIds = "";
                }).catch((e) => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },


            //列表是否隐藏
            settingBtn() {
                this.$refs.ref_manageScope.setTransferVisible(true);
            },
            //子组件跳转父组件后刷新页面
            childRequest() {
                this.request(this.currentPage, this.size);
            },
            manageByOrg() {
                let pk_org_param = this.pk_org;
                this.$refs[this.msByOrgRef].setDialogVisible(true, pk_org_param);
            },
            manageByDept() {
                let pk_org_param = this.pk_org;
                this.$refs[this.msByDeptRef].setDialogVisible(true, pk_org_param);
            },
        }
    };
</script>
<style>
    #manageScopeId .top-button .el-button {

        /*font-size: 20px;*/
        margin-right: 16px;
        /*padding-right:0px;*/
    }

    /*#manageScopeId .el-checkbox__input {*/
    /*position:relative;*/
    /*top:-5px;*/
    /*}*/
    #numId {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 16px;
        margin-left: 3px;
    }
</style>
