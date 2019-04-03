<template>
    <div v-if="true">
    <ifbp-template :ref='orgsMgrRef'
                   tplId='org_org_manager'
                   :tplData='orgsMgrData'
                   :editable='orgsMgrEdit'
                   :form-show-message="orgsMgrEdit"
                   :tplResetFun='orgsMgrResetFun'
                   :methods="orgsMgrMethods"
                   @update:editable="updateEvent"
                   @expand="expandEvent"
                   :table-oper-vif="tableOperVif && !orgsMainEdit && !orgsMgrEdit"
                   :table-show-menu="false"
                   :confirm-clear-edit="false"

                   :confirm-button-show="confirmButtonShow"
                   :edit-button-show="editButtonShow"
                   :cancel-button-show="cancelButtonShow"
                   :delete-button-show="deleteButtonShow"

                   @row-click="orgsMgrRowClick"
                   @edit-table-click='orgsMgrEditClick'
                   @delete-table-click='orgsMgrDeleteClick'
                   @form-confirm-click='orgsMgrFormConfirm'
                   @form-edit-click='orgsMgrFormEdit'
                   @form-cancel-click='orgsMgrFormCancel'
                   @form-delete-click='orgsMgrFormDelete'
    >
    </ifbp-template>
    </div>
</template>

<script>
    export default {
        props: {
            routePk_org: {
                type: String,
                required: true
            },
            orgsMgrRef: {
                type: String,
                required: true
            },
            permissionPrefix: {
                type: String,
                required: true
            },

            orgsMgrDataUrl: {
                type: String,
                required: true
            },
            orgsMgrEdit: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            isOrgLink: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            orgsMainDataBak: {
                type: Object,
            },
            orgsMainEdit: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
        },
        data() {
            const orgsMgrThis = this;
            return {
                // 组织主键
                orgsMgrData: {},
//                orgsMainDataBak:{},
                tableCodes: ["orgmanagers"],
                mgrIcon: [{
                    icon: 'plus',
                    click: () => {
                        // 重置新增数据
                        orgsMgrThis.$refs[this.orgsMgrRef].getTableComp()
                            .closeExpandRow();
                        orgsMgrThis.$refs[this.orgsMgrRef].resetFormData();
                        // 显示新增区域
                        orgsMgrThis.$refs[this.orgsMgrRef].formShow = true;
                        orgsMgrThis.$emit("orgsEditValueChange", false, false, true);
                    }
                }],
                orgsMgrResetFun: function ($node) {
                    let $table = this.getTableDom($node);
                    $table.attr(':show-header', 'false');

                    // 给人员编码添加绑定
                    $node.find("[v-model='hrorgmanager.pk_psndoc']").attr("v-on:change", "psndocChange");
                    var operateArr = [
                        {
                            title: '编辑',
                            icon: 'edit',
                            vif: "scope.row.checkflag != true && tableOperVif"
                        },
                        {
                            title: '删除',
                            icon: 'delete',
                            vif: "scope.row.checkflag != true && tableOperVif"
                        }];

                    let operateHtml =  this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                orgsMgrMethods: {
                    psndocChange: function (val) {
                        if (val.value[0]) {
                            let refcode = val.value[0].refcode;
                            let refname = val.value[0].refname;
                            if (!refcode) {
                                refcode = val.value[0].code;
                            }
                            if (!refname) {
                                refname = val.value[0].name;
                            }
                            if (refcode) {
                                this['hrorgmanager'].refcode = refcode;
                            }
                            if (refname) {
                                this['hrorgmanager'].refname = refname;
                            }
                            if (val.value[0].id) {
                                this['hrorgmanager'].pk_psndoc = val.value[0].id;
                            }
                        }
                    }
                },
                originalSubValue: [],
                currRowExpanded: true,//默认显示子表行按钮
            };
        },
        computed: {
            // panel边上的图片通过对编辑状态的计算得出
//            mgrIcon: function () {
//                return (this.orgsMainEdit || this.orgsMgrEdit) ? [] : this.orgsDetailIcons.sub;
//            },
            confirmButtonShow: function () {
                if (this.orgsMainEdit === true ||  this.isOrgLink === true ) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.orgsMainEdit === true || this.isOrgLink === true) {
                    return false;
                }
            },
            cancelButtonShow: function () {
                if (this.orgsMainEdit === true || this.orgsMgrEdit === false  || this.isOrgLink === true) {
                    return false;
                }
            },
            deleteButtonShow: function () {
                if (this.orgsMainEdit === true || this.orgsMgrEdit === true  || this.isOrgLink === true) {
                    return false;
                } else {
                    return true;
                }
            },
            tableOperVif: function () {
                if (this.isOrgLink === true || this.orgsMainEdit === true || this.orgsMgrEdit === true || !this.currRowExpanded) {
                    return false;
                } else {
                    return true;
                }
            },
        },
        mounted()
        {
           this.orgsManagerInit();

        }
        ,
        methods: {
            updateEvent(val){
                this.subEditValueChange(val);
            },
            expandEvent(row, expanded) {
                this.currRowExpanded = !expanded
            },
            orgsManagerInit: function () {
                if(this.routePk_org && this.routePk_org != "false"){
                    this.request();
                }else{
                    this.$refs[this.orgsMgrRef].tableShow = false;
                }
                this.$emit("changeOrgsMgrIcon", this.mgrIcon);

            },
            // 获取组织主管数据
            request: function () {
                var jsonParams = {
                    pk_org: this.routePk_org,
                    tableCodes: this.tableCodes,
                }
                this.$http({
                    url: '/hrjf/hrOrg/getByHeadId/',
                    method: 'POST',
                    data: jsonParams
                }).then((res) => {
                    if (res.data.status === true) {
                        this.originalSubValue = res.data.orgmanagers;
                        this.orgsMainDataBak = res.data.main;
                        if (this.originalSubValue) {
                            this.$refs[this.orgsMgrRef].tableShow = true;
                            this.$refs[this.orgsMgrRef].setTableData(JSON.parse(JSON.stringify(this.originalSubValue)));
                        } else {
                            this.$refs[this.orgsMgrRef].tableShow = false;
                            this.$refs[this.orgsMgrRef].setTableData([]);
                        }
                    } else {
                        this.$message({message: res.data.msg, type: 'error'});
                    }
                }).catch(() => {
                    this.$message({message: '组织主管数据获取失败', type: 'error'});
                });
            }
            ,

            // 刷新数据
            refreshOrgDetail: function () {
                this.request();
                this.$emit('dynamicTemplateInit');
            },
            // table行的点击事件
            orgsMgrRowClick(scope){
                this.$emit("orgsEditValueChange", false,false,false);

//                this.orgsMgrEdit = false;
            },
            // table行的编辑操作
            orgsMgrEditClick(scope)
            {
                this.orgMgrTableData = JSON.parse(JSON.stringify(this.$refs[this.orgsMgrRef].getData("hrorgmanager_t")));
                let orgData = this.orgsMainDataBak;
                if (scope.row.pk_psndoc === orgData.principal) {
                    this.$alert("不能编辑组织负责人数据！", '提示', {
                        confirmButtonText: '确定',
//                    closeOnClickModal: false,
//                    type: 'info'
                    }).then(() => {

                    }).catch(() => {
                    });
                    return;
                }

                this.$refs[this.orgsMgrRef].expandRow(scope.row, scope.$index);
                this.subEditValueChange(true);
//            // 备份数据
//            this.subDataBak = JSON.parse(JSON.stringify(scope.row));
//            this.subIndexBak = scope.$index;
            },
            // form的删除操作
            orgsMgrFormDelete(type, row) {
                const $scope = {
                    row: row
                };
                this.orgsMgrDeleteClick($scope);
            },
            // table行的删除操作
            orgsMgrDeleteClick(scope)
            {
                let orgData = this.orgsMainDataBak;
                if (scope.row.pk_psndoc === orgData.principal) {
                    this.$alert("不能删除组织负责人数据！", '提示', {
                        confirmButtonText: '确定',
//                    closeOnClickModal: false,
//                    type: 'info'
                    }).then(() => {

                    }).catch(() => {
                    });
                    return;
                }
                this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.orgsMgrDelete(scope.row);
                }).catch(() => {
                });
            }
            ,
            orgsMgrDelete(formData)
            {
                let orgData = this.orgsMainDataBak;
                let data = {
                    org: orgData,
                    managerTableData: [],
                };
//                data.legalbodycode = orgData.legalbodycode;
                let managerTableData = this.$refs[this.orgsMgrRef].getTableData();

                for (let i = 0; i < managerTableData.length; i++) {
                    if (managerTableData[i].pk_psndoc === formData.pk_psndoc) {
                        managerTableData[i].status = 3;
                        break;
                    }
                }
                data.managerTableData = managerTableData;
                this.$http({
                    url: '/hrjf/hrOrg/save',
                    method: 'post',
                    data: data
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({message: res.data.msg, type: 'success'});
                        this.subEditValueChange(false);
                        this.$refs[this.orgsMgrRef].formShow = false;
                        this.$refs[this.orgsMgrRef].getTableComp().closeExpandRow();
                        this.$refs[this.orgsMgrRef].clearEdit();
                        this.refreshOrgDetail();
                    } else {
                        this.$message({message: res.data.msg, type: 'error'});
                    }
                }).catch(() => {
                    this.$message({message: '删除失败', type: 'error'});
                });
            }
            ,
            // form的保存操作
            orgsMgrFormConfirm()
            {
                //主管table数据
                let managerTableData = this.$refs[this.orgsMgrRef].getTableData();
                //主管Form数据
                let managerFormData = this.$refs[this.orgsMgrRef].getFormData();
                //组织主表Form数据
                let orgData = this.orgsMainDataBak;

                this.$refs[this.orgsMgrRef].validate((valid) => {
                    if (valid) {
                        let data = {
                            org: orgData,
                            managerFormData: managerFormData,
                            managerTableData: managerTableData
                        };
//                        data.legalbodycode = orgData.legalbodycode;
                        this.$http({
                            url: '/hrjf/hrOrg/save',
                            method: 'post',
                            data: data
                        }).then((res) => {
                            if (res.data.status === true) {
                                this.$refs[this.orgsMgrRef].clearEdit();
                                this.subEditValueChange(false);
                                this.$message({message: res.data.msg, type: 'success'});
                                this.$refs[this.orgsMgrRef].formShow = false;
                                this.$refs[this.orgsMgrRef].tableShow = true;
                                this.$refs[this.orgsMgrRef].getTableComp().closeExpandRow();
                                this.refreshOrgDetail();
                            } else {
                                this.$message({message: res.data.msg, type: 'error'});
                            }
                        }).catch(() => {
                            this.$message({message: '保存失败', type: 'error'});
                        });
                    }
                });
            }
            ,
            // form编辑操作
            orgsMgrFormEdit: function () {
                let orgData = this.orgsMainDataBak;
                let formData = this.$refs[this.orgsMgrRef].getFormData();
                // 备份数据
                this.orgMgrTableData = JSON.parse(JSON.stringify(this.$refs[this.orgsMgrRef].getData("hrorgmanager_t")));
                if (formData.pk_psndoc === orgData.principal) {
                    this.$alert("不能编辑组织负责人数据！", '提示', {
                        confirmButtonText: '确定',
//                    closeOnClickModal: false,
//                    type: 'info'
                    }).then(() => {
                        this.subEditValueChange(false);
                    }).catch(() => {
                        this.subEditValueChange(false);
                    });
                } else {
                    this.subEditValueChange(true);
                }
            }
            ,
            // 子表form的取消操作
            orgsMgrFormCancel(type)
            {
                this.subEditValueChange(false);
                if (type === 'form') {
                    this.$refs[this.orgsMgrRef].resetFormData();
                    this.$refs[this.orgsMgrRef].formShow = false;
                }
            }
            ,
            // 修改标志位改变
            mainEditValueChange: function (val) {
                this.$emit("orgsEditValueChange", val);
            }
            ,
            //设置当前页面是否编辑态
            subEditValueChange: function (val) {
                this.$emit("orgsEditValueChange", false,false,val);
//                this.$emit('update:orgsMgrEdit', val);

            },
        }
    }
    ;
</script>
