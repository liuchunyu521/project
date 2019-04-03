<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb v-if="isNew" name="新增部门"></ifbp-breadcrumb>
        <ifbp-breadcrumb v-if="isEdit" name="部门详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='hrDeptPanel' title='部门信息' :icons='isShowHeadIcons' >
                    <ifbp-template ref='ref_dept'
                                   tplId='deptDetailTplId'
                                   :tplData='deptData'
                                   :editable='deptEdit'
                                   :tpl-reset-fun='deptResetFun'
                                   :methods="deptMethods"
                                   @after-create="afterCreateFunc"
                    >
                    </ifbp-template>
                    <div class='form-button-div' v-if='deptEdit'>
                        <el-button type='primary' @click='deptSave'>保存</el-button>
                        <el-button type='default' @click='deptCancel'>取消</el-button>
                    </div>
                </ifbp-panel>
                <!-- 子表 -->
                <ifbp-panel id='deptMgrPanel' title='部门主管' :icons='isShowBodyIcons' v-show='bodyShow'>
                    <ifbp-template ref='ref_dept_mgr'
                                   tpl-id='deptMgrId'
                                   :tpl-data='deptMgrData'
                                   :editable='deptMgrEdit'
                                   :form-show-message='deptMgrEdit'
                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :table-oper-vif="tableOperVif && !deptMgrEdit&&!deptEdit"
                                   :tplResetFun='deptMgrResetFun'
                                   :methods="deptMgrMethods"
                                   :table-show-menu="false"
                                   :confirm-clear-edit="false"

                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"

                                   @delete-table-click='deptMgrDeleteClick'
                                   @edit-table-click='deptMgrPanelEditClick'
                                   @form-delete-click="deptMgrFormDelete"
                                   @form-edit-click='deptMgrPanelFormEditClick'
                                   @form-cancel-click='deptMgrFormCancel'
                                   @form-confirm-click='deptMgrFormConfirm'
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!--部门变更历史-->
                <ifbp-panel id="deptHistoryPanel" title="部门变更历史"  class="titleLine" v-show="bodyShow">
                    <div align="right" class="top-button">
                        <i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -20px;"></i>
                    </div>
                    <ifbp-template ref="ref_dept_history"
                                   tpl-id="deptHistoryId"
                                   :tplData="deptHistoryData"
                                   :tplResetFun="deptHisResetFun"
                                   :methods="deptHisMethod"
                                   :table-show-menu="false"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel id="deptAttachment" title="附件" v-show="deptAttachShow">
                    <ifbp-upload
                            busi-code="dept_attach"
                            force-type='normal'
                            :pk-busi="pk_hrDept">
                    </ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    //    import deptDetailJS from "./deptDetailJS.js";
    export default {
        mixins: [pageModelMixin],
//        mixins: [deptDetailJS],
        data()
        {
            const vm = this;
            //取路由路径参数
            var hrDeptParam =this.$route.query.id;
            var isEditForPath =this.$route.query.isEditForPath;
            var $isNew;
            var $isEdit;
            if (hrDeptParam) {
                $isNew = false;
                $isEdit = true;
            } else {
                $isNew = true;
                $isEdit = false;
            }
            var $deptEdit = true;
            if (isEditForPath !=undefined) {
                $deptEdit = false;
            }
            return {
                //新增时过滤上级部门
                pk_org_param:this.$route.query.pk_org_param,
                // 通过传入的参数判断是新增还是修改操作
                //是否编辑态
                //是否新增态
                isNew: $isNew,
                isEdit: $isEdit,
                pk_hrDept: hrDeptParam,
                originalHeadValue: {},
                originalBodyValue: {},
                originalHisValue:{},
                // ifbp-panel-group所需参数
                scrollDom: 'ifbpScrollDom',
                // 基础panel显示图标
                deptIcons: [
                    {
                        icon: 'edit',
                        click: function () {
                            vm.status = 1;
                            vm.deptEdit = !vm.deptEdit;
                            vm.isShowHeadIcons = {};
                            vm.isShowBodyIcons = {};
                            //新增界面保存之后再修改状态点击取消不跳转到列表界面
                            vm.isNew = false;
                            vm.isEdit = true;
                        }
                    }
                ],
                // 子表标题旁的显示图标
                deptMgrIcons: [{
                    icon: 'plus',
                    click: () => {
                        vm.isShowHeadIcons = {};
                        vm.isShowBodyIcons = {};
                        vm.deptMgrEdit = true;
                        vm.$refs.ref_dept_mgr.getTableComp()
                            .closeExpandRow();
                        // 显示新增区域
                        vm.$refs.ref_dept_mgr.formShow = true;
                        // 重置新增数据
                        vm.$refs.ref_dept_mgr.resetFormData();
                    }
                }],
                // UI模板所需参数
                // pk_tempDept: '0001AA10000000009O17',
                // 部门主管模板主键
                // pk_tempDeptMgr: '0001AA10000000002BD3',
                deptData: {
                    rules: {},
                    paramsPk_org: {
                        pk_org: "",
                    },
                    paramspkdept: {
                        pk_dept: "",
                    },
                },
                deptMgrData: {
//                    deptmanager_t: {},
//                    rules: {},
                    deptMgrPkdept: {
                        pk_dept: "",
                    },
                },
                deptHistoryData: {

                },
                status: 2, //1, update; 2, new; 3, delete
                // 基本信息是否为修改态
                deptEdit: $deptEdit,
                // 部门主管是否为修改态
                deptMgrEdit: false,
                tableOperVif: true,
                bodyShow: false,
                deptAttachShow: false,
                deptResetFun: function ($node) {
                    if (vm.deptData && vm.deptData.paramspkdept && vm.pk_hrDept) {
                        vm.deptData.paramspkdept.pk_dept = vm.pk_hrDept;
                    }

                    var $pk_org = $node.find("[v-model='hrdept.pk_org']");
                    $pk_org.attr('v-on:change', 'orgChange');
                    if (vm.isEdit) {
                        //加上这句就不好看了
                        //$pk_org.attr(':disabled', true);
                        $pk_org.attr(':editable', false);

                    }


                    return $node[0].outerHTML;
                },
                deptMgrResetFun($node) {
                    if (vm.deptMgrData && vm.deptMgrData.deptMgrPkdept && vm.pk_hrDept) {
                        vm.deptMgrData.deptMgrPkdept.pk_dept = vm.pk_hrDept;
                    }
                    // 给人员编码添加绑定
                    $node.find("[v-model='deptmanager.pk_psndoc']").attr("v-on:change", "psndocChange");
                    var $psndoccode = $node.find("[prop='psndoccode']");
                    $psndoccode.html(
//                        '<template scope="scope">' +
                        '<el-input id="psndoccode" :editable="editable" v-model="deptmanager.psndoccode" :disabled="true"></el-input>'
//                        '</template>'
                    );

                    //列名是否显示
                    var $table = this.getTableDom($node);
                    var operateArr = [
                        {
                            title: '编辑',
                            icon: 'edit',
                            vif: "scope.row.principalflag  != true"
                        },
                        {
                            title: '删除',
                            icon: 'delete',
                            vif: "scope.row.principalflag  != true"
                        }];

                    let operateHtml =  this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
//                    var $table = this.getNodeById($node, 'deptmanager_t');
                    //子表不显示表头
                    $table.attr(':show-header', 'false');
                    return $node[0].outerHTML;
                },
                deptHisResetFun($node) {

                },
                deptMethods: {
                    orgChange: function (val) {
                        if (val.value[0]) {
                            let refid = val.value[0].id;
                            if ((!this.paramsPk_org || !this.paramsPk_org.pk_org ) || this.paramsPk_org.pk_org !== refid) {
                                this.hrdept.pk_fatherorg = "";
                            }
                            if (refid) {
                                this.paramsPk_org.pk_org = refid;
                            }
                        }
                    }
                },
                deptHisMethod: {},
                deptMgrMethods: {
                    psndocChange: function (val) {
                        if (val.value[0]) {
                            let refcode = val.value[0].refcode;
                            if (!refcode) {
                                refcode = val.value[0].code;
                            }
                            if (refcode) {
                                this.deptmanager.psndoccode = refcode;
                            }
                        }
                    }
                }
            };
        }
        ,
        computed: {
            isShowHeadIcons: function () {
                let retValue = {};
                if (this.deptEdit === true || this.deptMgrEdit === true) {
                    return retValue;
                } else {
                    return this.deptIcons;
                }
            },
            isShowBodyIcons: function () {
                let retValue = {};
                if (this.deptEdit === true || this.deptMgrEdit === true) {
                    return retValue;
                } else {
                    return this.deptMgrIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.deptEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.deptEdit === true) {
                    return false;
                }
            },
            cancelButtonShow: function () {
                if (this.deptEdit === true || this.deptMgrEdit === false) {
                    return false;
                }
            },
            //如果子表是编辑态，不显示删除按钮
            deleteButtonShow: function () {
                if (this.deptEdit === true || this.deptMgrEdit === true) {
                    return false;
                } else {
                    return true;
                }
            }
        }
        ,
        mounted()
        {
            this.request();
        }
        ,
        methods: {
            updateEvent(val){
                this.deptMgrEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },

            // 获取数据save
            request()
            {
                // 请求基本信息详情
                this.requestdeptInfo();
            }
            ,
            // 基本信息详情
            requestdeptInfo()
            {
                if (!this.pk_hrDept || this.pk_hrDept === undefined || this.pk_hrDept.length <= 0) {
                    return;
                }
                this.$http({
                    url: '/hrjf/hrDept/getById/' + this.pk_hrDept,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalHeadValue = res.data.deptRetData;
                            this.originalBodyValue = res.data.deptMgrRetData;
                            this.originalHisValue = res.data.deptHistoryData;
                            this.bodyShow = true;
                            this.deptAttachShow = true;
                            this.$refs.ref_dept.setData(
                                'hrdept',
                                JSON.parse(JSON.stringify(this.originalHeadValue))
                            );
                            //把当前组织主键放入查询参数中【组织负责人】
                            if (this.deptData && this.deptData.paramspkdept && this.originalHeadValue) {
                                this.deptData.paramspkdept.pk_dept = this.originalHeadValue.pk_dept;
                            }

                            //修改时将组织主键放入查询参数用于【上级部门】过滤
                            if (this.deptData && this.deptData.paramsPk_org && this.originalHeadValue) {
                                this.deptData.paramsPk_org.pk_org = this.originalHeadValue.pk_org;
                            }
                            if (this.originalBodyValue) {
                                this.$refs.ref_dept_mgr.tableShow = true;
                                this.$refs.ref_dept_mgr.setData(
                                    'deptmanager_t',
                                    JSON.parse(JSON.stringify(this.originalBodyValue))
                                );
                            } else {
                                this.$refs.ref_dept_mgr.tableShow = false;
                            }
                            if(this.originalHisValue){
                                this.$refs.ref_dept_history.tableShow = true;
                                this.$refs.ref_dept_history.setData(
                                    'depthistory_t',
                                    JSON.parse(JSON.stringify(this.originalHisValue))
                                );
                            }else{
                                this.$refs.ref_dept_history.tableShow = false;
                            }
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '获取数据失败！',
                            type: 'error'
                        });
                    });
            }
            ,
            // 基本信息取消按钮操作
            deptCancel()
            {
                this.bodyShow = true;
                if (this.isNew === true) {
                    this.$context.getApp().back();
//                this.$router.push("/hrjf/hrDept");
                }
                this.deptEdit = false;
                this.deptMgrEdit = false;
                this.isShowHeadIcons = this.deptIcons;
                this.isShowBodyIcons = this.deptMgrIcons;
                if (this.originalHeadValue) {
                    this.$refs.ref_dept.resetFormData();
                    this.$refs.ref_dept.setFormData(JSON.parse(JSON.stringify(this.originalHeadValue)));
                } else {
                    this.$refs.ref_dept.resetFormData();
                }
            }
            ,
            // 基本信息保存按钮操作
            deptSave()
            {
                var btRef = this.$refs.ref_dept_mgr;
                var deptData = this.$refs.ref_dept.getFormData();

                let data = {
                    dept: deptData
                };
                if (!btRef.pk_dept) {
                    this.massageError = "保存失败";
                    deptData.status = 2;
                } else {
                    deptData.status = 1;
                    this.massageError = "更新失败";
                }
                this.$refs.ref_dept.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrDept/saveDept',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$refs.ref_dept.clearEdit();
                                    this.deptEdit = false;
                                    this.isShowHeadIcons = this.deptIcons;
                                    this.isShowBodyIcons = this.deptMgrIcons;
                                    this.pk_hrDept = res.data.data.pk_dept;
                                    this.originalHeadValue = res.data.data;
                                   //保存完不渲染页面，再次请求时再渲染
                                    // this.$refs.ref_dept.setData(
                                    //     'hrdept',
                                    //     // JSON.parse(JSON.stringify(this.originalHeadValue))
                                    //     res.data.data
                                    // );
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.requestdeptInfo();
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((er) => {
                                this.$message({
                                    message: this.massageError + er,
                                    type: 'error'
                                });
                            });
                    }
                });
            },
            //-----------------------------------------子表方法------------------------------
            // table行的点击
//        deptMgrRowClick(scope){
//            this.deptMgrEdit = false;
//        },
            // table行的编辑操作
            deptMgrPanelEditClick(scope) {
                var btRef = this.$refs.ref_dept_mgr;
                let deptData = this.$refs.ref_dept.getFormData();
                if (scope.row.pk_psndoc === deptData.principal) {
                    this.$alert("不能编辑部门负责人数据！", '提示', {
                        confirmButtonText: '确定',
//                    closeOnClickModal: false,
//                    type: 'info'
                    }).then(() => {
                        this.deptMgrEdit = false;
                    }).catch(() => {
                        this.deptMgrEdit = false;
                    });
                } else {
                    this.isShowHeadIcons = {};
                    this.isShowBodyIcons = {};
                    this.deptMgrEdit = true;
                    this.deptEdit = false;
                    this.$refs.ref_dept_mgr.expandRow(scope.row, scope.$index)
                    //注释掉表体上边的新增form框
                    btRef.formShow = false;
                    //将编辑的行数据放到表体的form中
//                btRef.setData('deptmanager', scope.row);
                    // 备份数据
//                this.deptMgrRowData = scope.row;
//                this.deptMgrBaseData = JSON.parse(JSON.stringify(btRef.getData("deptmanager_t")));
//                this.deptMgrEditIndex = scope.$index;
                }
            },
            // form数据编辑时触发此方法
            deptMgrPanelFormEditClick(type) {

                var btRef = this.$refs.ref_dept_mgr;
                let deptDataMgr = btRef.getFormData();
                let deptData = this.$refs.ref_dept.getFormData();
                if (deptDataMgr.pk_psndoc === deptData.principal) {
                    this.$alert("不能编辑部门负责人数据！", '提示', {
                        confirmButtonText: '确定',
//                    closeOnClickModal: false,
//                    type: 'info'
                    }).then(() => {
                        this.deptMgrEdit = false;
                    }).catch(() => {
                        this.deptMgrEdit = false;
                    });
                } else {
                    this.isShowHeadIcons = {};
                    this.isShowBodyIcons = {};
                    this.deptMgrEdit = true;
                    this.deptMgrRowData = btRef.getData('deptmanager');
//                this.deptMgrBaseData = JSON.parse(JSON.stringify(btRef.getData("deptmanager_t")));
                }
            },

            // form的保存操作
            deptMgrFormConfirm(type) {
                let btRef = this.$refs.ref_dept_mgr;
                //表头form数据
                let deptData = this.$refs.ref_dept.getFormData();
                //子表form数据
                let deptmanagerFormData = this.$refs.ref_dept_mgr.getFormData();
                //子表所有行数据
                let deptmanagerTableData = this.$refs.ref_dept_mgr.getTableData();
                let data = {
                    dept: deptData,
                    managerFormData: deptmanagerFormData,
                    managerTableData: deptmanagerTableData
                };
                if (!deptmanagerFormData.pk_orgmanager) {
                    this.massageError = "保存失败";
                    deptmanagerFormData.status = 2;
                } else {
                    deptmanagerFormData.status = 1;
                    this.massageError = "更新失败";
                }
                btRef.validate(valid => {
                    if (valid) {
                        this.$http({
                            url: "/hrjf/hrDept/saveDept",
                            method: "post",
                            data: JSON.parse(JSON.stringify(data))
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$refs.ref_dept_mgr.clearEdit();
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    this.deptMgrEdit = false;
                                    //将编辑界面修改图标显示
                                    this.isShowHeadIcons = this.deptIcons;
                                    this.isShowBodyIcons = this.deptMgrIcons;
                                    this.originalValue = res.data.data;
                                    btRef.formShow = false;
                                    btRef.tableShow = true;
                                    var deptMgrT = btRef.getData('deptmanager_t');
                                    deptMgrT[this.deptMgrEditIndex] = this.originalValue;
                                    btRef.setData('deptmanager_t', deptMgrT);
//                                btRef.getTableComp().closeExpandRow();
                                    this.request();
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
//                                deptmanagerTableData.pop(deptmanagerFormData);
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: this.massageError,
                                    type: "error"
                                });
                            });
                    }
                }, type);
            },
            // form的取消操作
            deptMgrFormCancel(type) {
                //将编辑界面修改图标隐藏
                this.deptMgrEdit = false;
                if (type === 'form') {
                    this.$refs.ref_dept_mgr.resetFormData();
                    this.$refs.ref_dept_mgr.formShow = false;
                }
            },
            // form的删除操作
            deptMgrFormDelete(type, row) {
                const $scope = {
                    row: row
                };
                this.deptMgrDeleteClick($scope);
            },
            // table行的删除操作
            deptMgrDeleteClick(scope) {
//            var btRef = this.$refs.ref_dept_mgr;
//            let deptDataMgr = btRef.getFormData();
                let deptData = this.$refs.ref_dept.getFormData();
                if (scope.row.pk_psndoc === deptData.principal) {
                    this.$alert("不能删除部门负责人数据！", '提示', {
                        confirmButtonText: '确定',
//                    closeOnClickModal: false,
//                    type: 'info'
                    }).then(() => {
                        this.deptMgrEdit = false;
                    }).catch(() => {
                        this.deptMgrEdit = false;
                    });
                } else {
                    this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(() => {
                        this.deptMgrRowData = scope.row;
                        this.deptMgrdeleteDialogClick();
                    }).catch(() => {
                        // 这里加取消逻辑
                    });
                }
            },
            deptMgrdeleteDialogClick() {
                let delPks = [];
                let btRef = this.$refs.ref_dept_mgr;
                let deptData = this.$refs.ref_dept.getFormData();
                //子表form数据
                let deptmanagerFormData = this.$refs.ref_dept_mgr.getFormData();
                //子表所有行数据
                let deptmanagerTableData = this.$refs.ref_dept_mgr.getTableData();
                for (let i = 0; i < deptmanagerTableData.length; i++) {
                    if (deptmanagerTableData[i].pk_psndoc === this.deptMgrRowData.pk_psndoc) {
                        deptmanagerTableData[i].status = 3;
                        deptmanagerFormData = deptmanagerTableData[i];
                    }
                }
                let data = {
                    dept: deptData,
                    managerTableData: deptmanagerTableData,
                    managerFormData: deptmanagerFormData
                };
                this.$http({
                    url: "/hrjf/hrDept/saveDept",
                    method: "post",
                    data: JSON.parse(JSON.stringify(data))
                })
                    .then((res) => {
                        //将编辑界面修改图标显示
                        this.isShowHeadIcons = this.deptIcons;
                        this.isShowBodyIcons = this.deptMgrIcons;
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            btRef.clearEdit();
                            this.request();
                            this.deptMgrEdit = false;
                            btRef.formShow = false;
                            btRef.getTableComp().closeExpandRow();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        //将编辑界面修改图标显示
                        this.isShowHeadIcons = this.deptIcons;
                        this.isShowBodyIcons = this.deptMgrIcons;
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    });
            },
            afterCreateFunc() {
                if (this.pk_org_param&&this.$refs.ref_dept && this.$refs.ref_dept.comp.$refs.ref_deptdetailorg) {
                    this.$refs.ref_dept.comp.$refs.ref_deptdetailorg.setPKs(this.pk_org_param);
                    this.$refs.ref_dept.setData('paramsPk_org', {
                        pk_org:  this.pk_org_param
                    });
                }
            },
            settingBtn() {
                this.$refs.ref_dept_history.setTransferVisible(true);
            },
        }
    }
</script>
<style>
    #deptHistoryPanel .top-button{
        height: 0px;
    }

</style>
