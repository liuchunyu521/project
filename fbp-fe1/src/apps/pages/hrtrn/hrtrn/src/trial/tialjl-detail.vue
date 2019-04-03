<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="转正"></ifbp-breadcrumb>

        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
        <div class="main-info">
            <div>
            人员姓名：{{mainInfo.psnname}}<span class="split-space"></span>所属组织：{{mainInfo.orgname}}<span
                class="split-space"></span>所属部门：{{mainInfo.deptname}}
            </div>
        </div>

        <!-- 主体区域 -->
        <!--<ifbp-main-area type="list">-->
            <!--<ifbp-panel-group :navbar="false">-->
                <ifbp-panel id="trialPanel" title="试用情况" :icons="workIcons" class="titleLine" :toggle-show="false">
                    <ifbp-template ref="ref_table_form"
                                   tpl-id="hrtrn_trialjl_detail"
                                   :tpl-data="templateData"
                                   :editable="templateEdit"
                                   :cancel-button="cancelButtonText"
                                   :table-show-menu="false"
                                   :table-oper-vif="operEditable"
                                   :form-show-message="formShowMsg"
                                   :tpl-reset-fun="tableFormResetFun"
                                   :methods="childFormMethods"
                                   @row-click="childRowClick"
                                   @edit-table-click="tableFormEditClick"
                                   @delete-table-click="tableFormDeleteClick"
                                   @form-edit-click="formEditClick"
                                   @form-confirm-click="tableFormConfirm"
                                   @form-cancel-click="tableFormCancel">
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>

    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        data() {
            var vm = this;
            //人员信息主键
            var parm_pk_psndoc = this.$root.$router.currentRoute.params.id;
            return {
                mainInfo: {
                    psnname: '',
                    orgname: '',
                    deptname: '',
                },
                //panel的操作图标
                workIcons: [{
                    icon: "plus",
                    show: true,
                    click: function () {
                        vm.tableFormAdd();
                    }
                }],
                templateData: {
                    rules: {}
                },
                cancelButtonText:"删除",
                templateEdit: false,
                operEditable: true,
                formShowMsg: true,
                rowClickExpend:true,
                tableFormResetFun($node) {
                    let $table = this.getNodeById($node, 'psndoc_trial_l');
                    //表头显示控制
                    $table.attr(':show-header', 'false');


                    let $trialresult = $node.find("[v-model='hi_psndoc_trial.trialresult']");
                    $trialresult.attr('v-on:change', 'trialresultChgHandle');

                    //操作列
                    let operateHtml = this.getBaseTableOperateHtml();
                    operateHtml = operateHtml.replace(/@click=/g,"@click.stop=");
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },

                //模板控件里的method内容
                childFormMethods: {
                    //试用结果选择变更
                    trialresultChgHandle:function (value) {
                        if(value == 1 || value == 3){
                            this.hi_psndoc_trial.endflag=true;
                        }else{
                            this.hi_psndoc_trial.endflag=false;
                        }
                    }
                },
                templateTableForm: {
                    card_id: 'psndoc_trial_c',
                    card: 'hi_psndoc_trial',
                    card_ref: 'ref_psndoc_trial_c',
                    list_id: 'psndoc_trial_l',
                    list: 'hi_psndoc_trial_t',
                    list_ref: 'ref_psndoc_trial_l',
                },
                templateUrl: {
                    init_url: '/hrtrn/trial/jldetail/addinit?pk_psndoc=',
                    save_url: '/hrtrn/trial/jldetail/save',
                    edit_url: '/hrtrn/trial/save',
                    delete_url: '/hrtrn/trial/jldetail/delete',
                },

                //新增的初始数据
                addLineInitData: {},
                //人员信息主键
                pk_psndoc: parm_pk_psndoc,
                isDimission: false,
            };
        },

        watch: {
            templateEdit(curVal, oldVal){
                this.workIcons[0].show = !curVal;
                this.operEditable = !curVal;
                this.rowClickExpend = !curVal;
            },
        },
        mounted() {
            this.request();
        },

        methods: {
            // 获取数据
            request() {
                //获取页面初始数据
                this.initData();
            },
            initData(){
                var url = this.templateUrl.init_url + this.pk_psndoc;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.resetData(res);
                            if (res.data.trial.length === 0) {
                                this.$refs.ref_table_form.tableShow = false;
                                // 显示新增区域
                                this.$refs.ref_table_form.formShow = true;
                                this.$refs.ref_table_form.setData(this.templateTableForm.card, res.data.initadd);
                                this.templateEdit = true;
                                this.cancelButtonText="取消";
                            } else {
                                this.$refs.ref_table_form.tableShow = true;
                            }
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: "页面初始化失败",
                            type: "error"
                        });
                    });
            },

            //绑定数据
            resetData(res){
                var originalValue = res.data.data;
//        this.$refs.ref_psnjob_c.setData("hi_psnjob", JSON.parse(JSON.stringify(originalValue)));
//        this.$refs.ref_psnjob_c.setData("psnname", res.data.psndoc.name);
                this.isDimission = originalValue.endflag;
                this.$refs.ref_table_form.setData(this.templateTableForm.list, res.data.trial);
                this.addLineInitData = res.data.initadd;
                this.mainInfo.psnname = res.data.psndoc.name;
                this.mainInfo.orgname = res.data.data.beanMap.pk_org_ref[res.data.data.pk_org].name;
                this.mainInfo.deptname = res.data.data.beanMap.pk_dept_ref[res.data.data.pk_dept].name;
            },

            // table行的编辑操作
            tableFormEditClick(scope) {
                this.cancelButtonText = "取消";
                this.$refs.ref_table_form.getTableComp().expandRow(scope.row);
                this.$refs.ref_table_form.formShow = false;
                this.$refs.ref_table_form.setData(this.templateTableForm.card, JSON.parse(JSON.stringify(scope.row)));
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能修改试用记录.", type: "warning"});
                    return;
                }
                if (scope.row.endflag) {
                    this.$message({message: "当前选择的试用记录已经结束,不能修改.", type: "warning"});
                    return;
                }
                this.templateEdit = true;
            },
            // table行的删除操作
            tableFormDeleteClick(scope) {
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能删除试用记录.", type: "error"});
                    return;
                }
                this.delete_idx = scope.$index;
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.tableFormDelete(false);
                }).catch(() => {
                });
            },
            // table行的删除确认操作
            tableFormDelete(isFormDel) {
                let data = this.$refs.ref_table_form.getData(this.templateTableForm.list)[this.delete_idx];
                this.$http({
                    url: this.templateUrl.delete_url,
                    method: 'post',
                    dataType: 'json',
                    data: data
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.resetData(res);
                        if (res.data.trial.length === 0) {
                            this.$refs.ref_table_form.tableShow = false;
                            this.$refs.ref_table_form.formShow = false;
                            this.templateEdit = false;
                            this.cancelButtonText="取消";
                        }
                        if(isFormDel){
                            this.operEditable = true;
                            this.$refs.ref_table_form.getTableComp().closeExpandRow();
                        }
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },

            // form的保存操作
            tableFormConfirm(type) {
                this.$refs.ref_table_form.validate((valid) => {
                    if (valid) {
                        let data = this.$refs.ref_table_form.getData(this.templateTableForm.card);
//                        if (data.endflag && data.trialresult == 1) {
//                            this.$confirm('是否同步履历?', '确认同步', {
//                                confirmButtonText: '是',
//                                cancelButtonText: '否',
//                                closeOnClickModal: false,
//                                type: 'info'
//                            }).then(() => {
//                                this.handleSave(1);
//                            }).catch(() => {
//                                this.handleSave(0);
//                            });
//                        } else {
//                            this.handleSave(0);
//                        }
                        //需求变更,不再需要同步履历
                        this.handleSave(0);
                    }
                });
            },

            handleSave(isSyncWork){
                let data = this.$refs.ref_table_form.getData(this.templateTableForm.card);

                this.$http({
                    url: this.templateUrl.save_url,
                    method: "post",
                    data: data
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });

                        this.resetData(res);

                        this.$refs.ref_table_form.tableShow = true;
                        // 显示新增区域
                        this.$refs.ref_table_form.formShow = false;
                        this.templateEdit = false;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "保存失败",
                        type: "error"
                    });
                });
            },
            // form的取消操作
            tableFormCancel(type) {
                if (type === 'form') {
                    this.$refs.ref_table_form.formShow = false;
                    let lstData = this.$refs.ref_table_form.getTableData();
                    if (!!lstData && lstData.length > 0) {
                        this.$refs.ref_table_form.tableShow = true;
                    }
                } else {

                    if(this.cancelButtonText == "删除"){

                        let formData = this.$refs.ref_table_form.getFormData();
                        let lstData = this.$refs.ref_table_form.getTableData();
                        for(let i=0;i<lstData.length;i++) {
                            if (lstData[i].pk_psndoc_sub == formData.pk_psndoc_sub) {
                                if (this.isDimission) {
                                    this.$message({message: "当前选择的人员已经离职,不能删除试用记录.", type: "error"});
                                    return;
                                }
                                this.delete_idx = i;
                                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    closeOnClickModal: false,
                                    type: 'warning'
                                }).then(() => {
                                    this.tableFormDelete(true);
                                }).catch(() => {
                                });
                            }
                        }
                    }else{
                        this.operEditable = true;
                        this.$refs.ref_table_form.getTableComp().closeExpandRow();
                    }
                }
                this.templateEdit = false;
            },
            //点击加号新增操作
            tableFormAdd: function () {
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能增加新的试用记录.", type: "error"});
                    return;
                }
                // 关闭table中的编辑区
                this.$refs.ref_table_form.getTableComp().closeExpandRow();
                // 重置新增数据
                this.$refs.ref_table_form.setData(this.templateTableForm.card, this.addLineInitData);
                // 显示新增区域
                this.$refs.ref_table_form.formShow = true;
                this.cancelButtonText = "取消";
                this.templateEdit = true;
            },

//      isDimission(){
//        let psnjobData = this.$refs.ref_psnjob_c.getData("hi_psnjob");
//        if (psnjobData.endflag) {
//          return true;
//        }
//        return false;
//      },

            childRowClick(row,event,column,extend){
//                if(!this.rowClickExpend)return;
//
//                if(extend){
//                    this.operEditable = false;
//                }else{
//                    if(!this.templateEdit){
//                        this.operEditable = true;
//                    }
//                }
                if(extend){
                    this.templateEdit = false;
                    this.$nextTick(function(){
                        this.operEditable = false;
                    });
                }else{
                    this.templateEdit = false;
                    this.operEditable = true;
                }
                let rowData = JSON.parse(JSON.stringify(row));
                this.$refs.ref_table_form.setFormData(rowData);
                this.cancelButtonText = "删除";
            },

            formEditClick(){
                let row = this.$refs.ref_table_form.getFormData();
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能修改试用记录.", type: "warning"});
                    return;
                }
                if (row.endflag) {
                    this.$message({message: "当前选择的试用记录已经结束,不能修改.", type: "warning"});
                    return;
                }
                this.templateEdit = true;
                this.cancelButtonText = "取消";
            },
        }
    };
</script>

<style scoped>
    .main-info {
        position: relative;
        box-sizing: border-box;
        background-color: #fff;
        font-size: 14px;
        color: #48576a;
        height:64px;
        padding-top:25px;
        padding-left:16px;
    }
    .main-info div{
        box-sizing: border-box;
        height:14px;
        line-height: 14px;
        font-size: 14px;
    }
    .split-space {
        width: 50px;
        display: inline-block;
    }
</style>
