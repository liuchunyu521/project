<!--
  作者：liyn11
  时间：2018-11-21
  支持：组织范围管理按部门设置dialog
-->
<template>
    <div id="manageDeptId">
        <!--转移规则设置弹窗-->
        <el-dialog title="按部门管理" :visible.sync="dialogVisible" width="75%" size="large" :show-close="false">
            <div class="roster_Setup">
                <el-steps :space="300" :active="active" finish-status="success" align-center="true" center="true">
                    <el-step title="选择部门"></el-step>
                    <el-step title="设置管理范围"></el-step>
                </el-steps>
            </div>
            <ifbp-btn-line >
                <div slot="search-dialog" style="float:right;margin-bottom: 5px;">
                    <ifbp-search-dialog
                            ref="testSetOption"
                            :template-code="tplCode"
                            v-show="isShowDepts"
                            :dialog-title="dialogTitle"
                            @search="advancedSearch">
                    </ifbp-search-dialog>
                </div>
            </ifbp-btn-line>
            <!--选择部门-->
            <ifbp-template ref="manageByDeptRef"
                           tpl-id="org_managescope_depts"
                           :tpl-data="morgData"
                           v-show="isShowDepts"
                           :table-show-menu="false"
                           :tpl-reset-fun="tableFormResetFun"
                           @after-create="afterCreateFunc"
                           :methods="childFormMethods">
            </ifbp-template>
            <el-pagination
                    style="margin-top: 30px"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    v-show="isShowDepts"
                    :current-page="currentPage"
                    :page-sizes="[10,20,30,40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
            <!--  设置管理范围  -->
            <!--<div v-show="isShowScrope" style="height: 80px;"></div>-->
            <ifbp-template ref="scopeByDeptRef"
                           tpl-id="org_manage_scopes"
                           v-show="isShowScrope"
                           :tpl-data="scopesData"
                           :tpl-reset-fun="tableFormScropResetFun"
                           :methods="childFormScopeMethods"
            >
            </ifbp-template>
            <div v-show="isShowScrope" style="height: 378px;"></div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button v-show="!isShowScrope" @click="handleNext" type="primary">下一步</el-button>
         <el-button v-show="isShowScrope" @click="handleLast">上一步</el-button>
         <el-button v-show="isShowScrope" @click="handleFines" type="primary">完成</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {

        data() {
            const vm = this;
            return {
                dialogTitle: "按组织过滤",
                addScopeData: {
                    sourceData: {},
                    attrData: {},
                },
                pk_org_target: '',   //管理组织主键
                ieStorage: false,   //页面缓存
                tplCode: 'manageDeptListTpl',
                searchTemplate: {},
                //分页
                totalElements: 0,
                currentPage: 1,
                size: 10,
                isShowScrope: false,
                isShowDepts: true,
                active: 0,
                postCreateDate: '',
                originalRenameDatas: {},
                pk_post: '',
                //导出框是否显示
                dialogVisible: false,
                morgData: {},
                scopesData: {},
                tableFormResetFun($node) {
                    let $tabledept = this.getTableDom($node);
                    $tabledept.attr(':height', '450'); //控制表格高度
                },
                tableFormScropResetFun($node) {

                },
                childFormMethods: {},
                childFormScopeMethods: {}
            }
        },
        mounted() {

        },
        created() {
        },
        methods: {
            request(n, s) {
                let param = {
                    pn: n ? n : '1',
                    ps: s ? s : '10',
                    sortField: '',
                };
                this.$http({
                    url: '/hrjf/manageScope/deptPageList',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$refs.manageByDeptRef.setTableData(res.data.data.content);
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
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
            afterCreateFunc() {
                this.request();
                this.ieStorage = true;
            },
            //取消
            handleCancel: function () {
                this.searchTemplate = {};
                this.dialogVisible = false;
                this.isShowDepts = true;
                this.isShowScrope = false;
                this.currentPage = 1;
                this.$emit('msByDeptRequest');
            },
            handleNext: function () {
                var sourceData = this.$refs.manageByDeptRef.getTableComp().getSelection();
                if (!sourceData || sourceData.length < 1) {
                    this.$message({
                        message: "请勾选管理对象",
                        type: "warning"
                    });
                    return;
                }
                if (this.active++ > 2) this.active = 0;
                this.isShowDepts = false;
                this.isShowScrope = true;
            },
            handleLast: function () {
                if (this.active-- > 2) this.active = 0;
                this.isShowDepts = true;
                this.isShowScrope = false;
            },
            handleFines: function () {
                if (!this.pk_org_target) {
                    return;
                }
                var pk_org_target = this.pk_org_target;
                var sourceData = this.$refs.manageByDeptRef.getTableComp().getSelection();
                var pk_attrs = this.$refs.scopeByDeptRef.getData('orgrelation_attrs').associateattrs;
                if (!pk_attrs || pk_attrs.length < 1) {
                    this.$message({
                        message: "请设置管理范围",
                        type: "warning"
                    });
                    return;
                }

                var url = "/hrjf/manageScope/addManageScopeByDept";
                let param = {
                    pk_org_target: pk_org_target,
                    pk_attrs: pk_attrs.join(',')
                };
                this.$http({
                    url: url,
                    method: "post",
                    traditional: true,
                    data: sourceData,
                    params: param
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.isShowDepts = true;
                            this.isShowScrope = false;
                            this.dialogVisible = false;
                            this.active = 0;
                            this.$refs.scopeByDeptRef.resetFormData();
                            this.currentPage = 1;
                            this.$emit('msByDeptRequest');
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "warning"
                            });
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "失败",
                            type: "error"
                        });
                    });
                1
            },

            // 设置dialog是否可见
            setDialogVisible: function (flag, pk_org) {
                if (pk_org) {
                    this.pk_org_target = pk_org;
                    this.dialogVisible = true;
                    if (this.ieStorage) {
                        this.request();
                    }
                } else {
                    this.$message({
                        message: "请选择组织",
                        type: "warning"
                    });
                }
            },
            handleSizeChange(val) {
                this.currentPage = 1;
                this.request(1, val);
            },
            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
            },
            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.currentPage = 1;
                this.request();
            },
        }
    }
</script>
<style>
</style>
