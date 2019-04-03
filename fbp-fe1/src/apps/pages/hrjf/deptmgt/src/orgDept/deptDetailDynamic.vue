<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb v-if="isNew" name="新增部门"></ifbp-breadcrumb>
        <ifbp-breadcrumb v-if="isEdit" name="部门详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='hrDeptPanel' title='部门信息' :icons='isShowHeadIcons'>
                    <ifbp-template ref='ref_dept'
                                   tplId='deptDetailTplId'
                                   :tplData='deptData'
                                   :editable='deptEdit'
                                   :tpl-reset-fun='deptResetFun'
                                   :methods="deptMethods"
                                   @after-create="deptAfterCreateFunc"
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
                <ifbp-panel id="deptHistoryPanel" title="部门变更历史" class="titleLine" v-show="bodyShow">
                    <ifbp-template ref="ref_dept_history"
                                   tpl-id="deptHistoryId"
                                   :tplData="deptHistoryData"
                                   :tplResetFun="deptHisResetFun"
                                   :methods="deptHisMethod"
                    >
                    </ifbp-template>
                </ifbp-panel>

                <!-- 动态子集 -->
                <ifbp-dynamic-panel :defaultCrud="'false'"
                                    :ref="dynRef"

                                    :dynamic-no-code-reset-funs="dynamicNoCodeResetFunc"
                                    :dynamic-template-props="dynamicTemplateProps"
                                    :dynamic-tpl-data="dynamicTplData"

                                    @update:editable="editableChange"
                                    @expand="dynamicExpandChange"
                                    :table-oper-vif="dynamicTableOperVif"
                                    :dynamic-readonly="dynamicReadonly"

                                    :child-icons="childIcons"
                                    @plus-icon-click="plusIconClick"

                                    @formConfirm="dynamicFormConfirm"
                                    @formCancel="dynamicFormCancel"
                                    @form-edit-click="dynamicFormEdit"
                                    @form-delete-click="dynamicFormDelete"

                                    @table-click="dynamicTableClick"
                                    @after-create="dynamicAfterCreate"
                                    v-show="bodyShow"
                >
                </ifbp-dynamic-panel>


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
        props: {
            routePk_org: {
                type: String,
                required: true
            },
            ref_dept: {
                type: String,
                required: true
            }, /*
             permissionPrefix: {
             type: String,
             required: true
             },
             dynOrgMainUrl: {
             type: String,
             required: true
             },
             orgsMainEdit: {
             type: Boolean,
             default: function () {
             return false;
             }
             },*/
        },


        mixins: [pageModelMixin],
        data()
        {
            const vm = this;
            //取路由路径参数
            var hrDeptParam = this.$route.query.id;
            var isEditForPath = this.$route.query.isEditForPath;
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
            if (isEditForPath != undefined) {
                $deptEdit = false;
            }
            return {
                originalMainValue: {},
                //新增时过滤上级部门
                pk_org_param: this.$route.query.pk_org_param,
                // 通过传入的参数判断是新增还是修改操作
                //是否编辑态
                //是否新增态
                isNew: $isNew,
                isEdit: $isEdit,
                pk_hrDept: hrDeptParam,
                originalHeadValue: {},
                originalBodyValue: {},
                originalHisValue: {},
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
                    hrdept:{},
                    preBillcode: "",
                    isEdit4Billcode: true,
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
                deptHistoryData: {},
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
                    $node.find("[v-model='hrdept.code']").attr(":disabled", "isEdit4Billcode");

                    var $pk_org = $node.find("[v-model='hrdept.pk_org']");
                    $pk_org.attr('v-on:change', 'orgChange');
                    if (vm.isEdit) {
                        //加上这句就不好看了
                        //$pk_org.attr(':disabled', true);
                        $pk_org.attr(':editable', false);
                    }
                    return $node[0].outerHTML;
                },
                deptAfterCreateFunc() {
                    if (vm.pk_org_param && vm.$refs.ref_dept && vm.$refs.ref_dept.comp.$refs.ref_deptdetailorg) {
                        vm.$refs.ref_dept.comp.$refs.ref_deptdetailorg.setPKs(vm.pk_org_param);
                        vm.$refs.ref_dept.setData('paramsPk_org', {
                            pk_org: vm.pk_org_param
                        });
                    }
                    /* if (vm.originalMainValue && vm.routePk_org && vm.routePk_org != "false") {
                     vm.originalMainValue.enablestate = 2;
                     vm.$refs[vm.ref_dept].setFormData(JSON.parse(JSON.stringify(vm.originalMainValue)));
                     }*/
                    // 判断是否存在编码规则，处理组织编码是否可编辑，和添加预置数据
                    if (vm.deptData && !vm.pk_hrDept) {
                        let data = vm.$refs.ref_dept.getFormData();
                        data.code = vm.deptData.preBillcode;
                        data.isEdit4Billcode = vm.deptData.isEdit4Billcode;
                        vm.$refs.ref_dept.setFormData(data);
                        vm.$refs.ref_dept.setData("isEdit4Billcode", !vm.deptData.isEdit4Billcode);
                    } else if (vm.deptData) {
                        // 因为vm.codeEditable是布尔类型，所以只需判断是否未定义就行了
                        vm.$refs.ref_dept.setData("isEdit4Billcode", !vm.deptData.isEdit4Billcode);
                    }

                    vm.$nextTick(function () {
                        vm.$refs.ref_dept.getFormComp().clearErrorMessage();
                    });
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
                    var operateHtml = this.getBaseTableOperateHtml();
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
                },
                /*zgy*/

                //人员基本信息相关控制变量
                employeeDetail: {
                    //本页面所有可修改的子集
                    modifiable: ['psndoc'],
                    //所有参与加载的子集
                    psndoc: {
                        ref: 'ref_employee_psndoc',
                        edit: false,
                    },
                    psnjob: {
                        ref: 'ref_psnjob_panel',
                        edit: false,
                    },
                },
                //定义所有的icons，支持动态
                employeeIcons: {
                    psndoc: [{
                        icon: "edit",
                        click: function () {
                            employeeThis.psndocEditValueChange(!employeeThis.employeeDetail.psndoc.edit);
                        }
                    }],
                },

                // 动态部分
                // 权限前缀
                permissionPrefix: '/hrjf/hrDept',
                dynRef: "dynRef",
                dynUrl: {
                    list: "/listSubInfo",
                    save: "/saveSubInfo",
                    delete: "/deleteSubInfo",
                    getCodeEditable: '/getCodeEditable',
                },
                // 所有子集code
                allTableCode: [],
                allInfoSetCode: [],

                dynamicNoCodeResetFunc: function ($node) {
                    let $pageConfigTable = this.getTableDom($node);
                    $pageConfigTable.attr(':show-header', 'true');
                    let operateHtml = this.getBaseTableOperateHtml();
                    $pageConfigTable.append(operateHtml);
                    return $node[0].outerHTML;
                },
                dynamicTemplateProps: [],
                dynamicTplData: [],
                childIcons: [],

                // 子集计数
                countNum: 0,

                // 子集不可编辑
                dynamicReadonly: [],
                dynamicReadonlyTemp: [],
                dynamicReadonlyBak: [],
                dynamicReadonlyAll: [],

                // 列操作按钮
                dynamicTableOperVif: [],

                // 入转调离参数
                dimissionRef: "employeeDimissionRef",
                /*zgy end*/


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
            this.orgsMainInit();
        }
        ,
        methods: {

            orgsMainInit: function () {
                if (!this.pk_hrDept || this.pk_hrDept === undefined || this.pk_hrDept.length <= 0 ) {
                    this.checkIsExistCodeRule();
                }else{
                    this.requestdeptInfo();
                }
            },
            updateEvent(val){
                this.deptMgrEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },

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
                            // 单据编码是否可编辑
                            if (this.deptData  ) {
                                this.deptData.isEdit4Billcode = this.originalHeadValue.isEdit4Billcode;
                                this.$refs.ref_dept.setData("isEdit4Billcode", this.originalHeadValue.isEdit4Billcode);

                            }
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

                            if (this.originalHisValue) {
                                this.$refs.ref_dept_history.tableShow = true;
                                this.$refs.ref_dept_history.setData(
                                    'depthistory_t',
                                    JSON.parse(JSON.stringify(this.originalHisValue))
                                );
                            } else {
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
                    this.checkIsRollBackCode();
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
                                    this.$refs.ref_dept.setData(
                                        'hrdept',
                                        // JSON.parse(JSON.stringify(this.originalHeadValue))
                                        res.data.data
                                    );
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
                                    this.requestdeptInfo();
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
                            this.requestdeptInfo();
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


            /*zgy*/
            // 根据code修改只读状态
            changeReadOnly: function (code) {
                // 修改子集的可编辑状态
                let readonly = {
                    code: code,
                    dynamicReadonly: false,
                };
                for (let i = 0; i < this.dynamicReadonlyTemp.length; i++) {
                    if (this.dynamicReadonlyTemp[i].code === readonly.code) {
                        this.dynamicReadonlyTemp.splice(i, 1, readonly);
                        return;
                    }
                }
                this.dynamicReadonlyTemp.push(readonly);
            },
            // 动态子集非编辑状态修改
            changeDynamicEditByCode: function (code) {

                // 先禁用人员基本信息
                this.employeeDetail.psndoc.icons = [];
                this.employeeDetail.psnjob.icons = [];
                this.ifbpFooterShow = false;

                let all = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
                if (code) {
                    for (let i = 0; i < all.length; i++) {
                        if (code === all[i].code) {
                            this.$set(all[i], "dynamicReadonly", false);
                        }
                    }
                }
                let read = [];
                for (let m = 0; m < this.dynamicReadonly.length; m++) {
                    let data = {
                        code: this.dynamicReadonly[m].code,
                        dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly,
                    };
                    read.push(data);
                }
                if (!this.dynamicReadonlyBak || this.dynamicReadonlyBak.length <= 0) {
                    this.dynamicReadonlyBak = read;
                }
                this.dynamicReadonly = all;
            },


            dynamicFormConfirm: function (item) {
                // 获取信息项名称和数据
                let confirmThis = this;
                let code = item.code;
                let codes = [];
                codes.push(code);
                let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];

                this.$refs[this.dynRef].$refs["dynamic_" + code][0].validate(function (valid) {
                    if (valid) {
                        let dynamicFormData = confirmThis.$refs[confirmThis.dynRef].getFormDataByCode(code);
                        dynamicFormData.pk_dept = confirmThis.pk_hrDept;
                        let data = {
                            infoSetCode: infoSetCode,
                            pk_dept: confirmThis.pk_hrDept,
                        };
                        this.$http({

                            url: "/hrjf/hrDept/saveSubInfo",
                            // url: confirmThis.permissionPrefix + confirmThis.dynUrl.save,
                            method: "post",
                            params: data,
                            data: dynamicFormData,
                        }).then(res => {
                            if (res.data.status === true) {
                                this.$message({message: "保存成功", type: "success"});
                                //  confirmThis.resetDynamicEdit();
                                confirmThis.dynamicTemplateInit(codes);
                            } else {
                                this.$message({message: res.data.msg, type: "error"});
                            }
                        }).catch(() => {
                            this.$message({message: "保存失败", type: "error"});
                        });
                    }
                });
            },
            //遍历获取模板code
            getInfoSetCodeByCodes(codes) {
                let infoSetCodes = [];
                for (let i = 0; i < codes.length; i++) {
                    for (let j = 0; j < this.allInfoSetCode.length; j++) {
                        if (codes[i] === this.allInfoSetCode[j].code) {
                            infoSetCodes.push(this.allInfoSetCode[j].value);
                            break;
                        }
                    }
                }
                return infoSetCodes;
            },

            // 动态模板初始化以后，开始加载动态模板的数据
            dynamicAfterCreate: function () {
                let codes = [];
                let infoSets = [];
                let readonlyAll = [];
                let tableOperVif = [];
                let pageData = this.$refs[this.dynRef].dynamicPageData;
                if (pageData && pageData.length > 0) {
                    // 将模板的code和信息项编码分开，排除code写错时，无法显示的问题
                    for (let i = 0; i < pageData.length; i++) {
                        codes.push(pageData[i].code);
                        let infoSet = {
                            code: pageData[i].code,
                            value: pageData[i].attributename
                        };
                        infoSets.push(infoSet);
                        let readonly = {
                            code: pageData[i].code,
                            dynamicReadonly: true
                        };
                        readonlyAll.push(readonly);
                        let operVif = {
                            code: pageData[i].code,
                            tableOperVif: true
                        };
                        tableOperVif.push(operVif);
                    }
                }
                this.allTableCode = codes;
                this.allInfoSetCode = infoSets;
                this.dynamicReadonlyAll = readonlyAll;
                this.dynamicTableOperVif = tableOperVif;
                this.dynamicTemplateInit();
            },
            dynamicTemplateInit: function (codes) {
                if (!codes) {
                    codes = this.allTableCode;
                } else {
                    // 刷新前，进行一些关闭
                    for (let i = 0; i < codes.length; i++) {
                        let subThis = this.$refs[this.dynRef].$refs["dynamic_" + codes[i]][0];
                        subThis.formShow = false;
                        this.$refs[this.dynRef].setItemAttrBycode(codes[i], 'dynamicEditable', false);
                        subThis.clearEdit();
                    }
                }
                let infoSetCodes = this.getInfoSetCodeByCodes(codes);
                // 执行之前，设置数据备份

                this.tempData();
                if (!this.pk_hrDept || this.pk_hrDept.length <= 0) {
                    return;
                }
                // 动态扩展区获取所有页签编码 countNum
                for (let i = 0; i < infoSetCodes.length; i++) {
                    this.countNum += 1;
                    let data = {
                        infoSetCode: infoSetCodes[i],
                        pk_hrDept: this.pk_hrDept,
                    };
                    this.$http({
                        method: "post",
                        url: this.permissionPrefix + this.dynUrl.list,
                        params: data
                    }).then(res => {

                        if (res.data.status === true) {
                            let resData = res.data.data;
                            if (resData) {
                                this.$refs[this.dynRef].setTableDataByCode(codes[i], resData);
                            } else {
                                this.$refs[this.dynRef].setTableDataByCode(codes[i], []);
                            }
                            this.changeReadOnly(codes[i]);
                        } else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                        this.countNum -= 1;
                        // 合并备份数据
                        this.mergeData();
                    }).catch(() => {
                        this.countNum -= 1;
                        //    this.$message({message: "部门信息获取失败！", type: "error"});
                    });
                }
            },


            tempData: function () {
                let read = [];
                for (let m = 0; m < this.dynamicReadonly.length; m++) {
                    let data = {
                        code: this.dynamicReadonly[m].code,
                        dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly
                    };
                    read.push(data);
                }
                this.dynamicReadonlyTemp = read;
            },
//动态子集删除
            dynamicFormDelete(item, type, row) {

                this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    let code = item.code;
                    let codes = [];
                    codes.push(code);
                    let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];
                    let data = {
                        status: 3,
                        infoSetCode: infoSetCode,
                        subInfo: row
                    };
                    this.realDynamicDelete(data, codes);
                }).catch(() => {
                });
            },
            //动态子集删除

            realDynamicDelete: function (data, codes) {

                let param = {
                    infoSetCode: data.infoSetCode,
                    pk_dept_sub: data.subInfo.pk_dept_sub,
                };
                this.$http({
                    url: this.permissionPrefix + this.dynUrl.delete,
                    method: "post",
                    params: param,
                }).then(res => {
                    if (res.data.status === true) {
                        this.$message({message: "删除成功", type: "success"});
                        this.dynamicTemplateInit(codes);
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "删除失败！", type: "error"});
                });
            },

            dynamicTableClick: function (item, index, icon, scope) {
                if ("edit" === icon) {
                    let subThis = this.$refs[this.dynRef].$refs["dynamic_" + item.code][0];
                    subThis.expandRow(scope.row, scope.$index);
                    this.changeDynamicEditByCode(item.code);
                } else if ("delete" === icon) {
                    this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
                        closeOnClickModal: false,
                        type: "warning"
                    }).then(() => {
                        let code = item.code;
                        let codes = [];
                        codes.push(code);
                        let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];
                        let dynamicFormData = scope.row;

                        let data = {
                            status: 3,
                            infoSetCode: infoSetCode,
                            subInfo: dynamicFormData
                        };
                        this.realDynamicDelete(data, codes);
                    }).catch(() => {
                    });
                }
            },
            dynamicFormEdit: function (item, index, type, row) {
                this.changeDynamicEditByCode(item.code);
            },

            // 动态子集非编辑状态修改
            changeDynamicEditByCode: function (code) {
                // 先禁用人员基本信息
                this.employeeDetail.psndoc.icons = [];
                this.employeeDetail.psnjob.icons = [];
                this.ifbpFooterShow = false;

                let all = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
                if (code) {
                    for (let i = 0; i < all.length; i++) {
                        if (code === all[i].code) {
                            this.$set(all[i], "dynamicReadonly", false);
                        }
                    }
                }
                let read = [];
                for (let m = 0; m < this.dynamicReadonly.length; m++) {
                    let data = {
                        code: this.dynamicReadonly[m].code,
                        dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly,
                    };
                    read.push(data);
                }
                if (!this.dynamicReadonlyBak || this.dynamicReadonlyBak.length <= 0) {
                    this.dynamicReadonlyBak = read;
                }
                this.dynamicReadonly = all;
            },

            checkIsExistCodeRule: function () {
                this.$http({
                    method: "POST",
                    url: this.permissionPrefix + "/checkIsExistCodeRule",
                    dataType: "JSON",
                    data: [],
                    contentType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {

                        // 如果后台没给isEdit4Billcode传值，说明没有编码规则，如果有
                        if (res.data.billcode && res.data.billcode.length > 0) {
                            this.deptData.isEdit4Billcode = res.data.isEdit4Billcode;
                            this.deptData.preBillcode = res.data.billcode;
                        } else {
                            this.deptData.isEdit4Billcode = true;
                        }
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败！", type: "error"});
                });
            },

            checkIsRollBackCode: function () {
                this.$http({
                    method: "POST",
                    url: this.permissionPrefix + "/rollBackBillCode",
                    dataType: "JSON",
                    params: {billcode: this.deptData.preBillcode},
                    contentType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {
//                        this.$message({message: res.data.msg, type: 'success'});
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "编码回退失败，请稍后重试！", type: "error"});
                });
            },
        }
    }
</script>
<style>

</style>
