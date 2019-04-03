<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="兼职"></ifbp-breadcrumb>

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
                <ifbp-panel id="parttimePanel" title="兼职记录" :icons="workIcons" class="titleLine" :toggle-show="false">
                    <ifbp-template ref="ref_table_form"
                                   tpl-id="hrtrn_parttimejl_detail"
                                   :tpl-data="templateData"
                                   :editable="templateEdit"
                                   :cancel-button="cancelButtonText"
                                   :table-show-menu="false"
                                   :table-oper-vif="operEditable"
                                   :form-show-message="formShowMsg"
                                   :tpl-reset-fun="tableFormResetFun"
                                   :methods="childFormMethods"
                                   :watch="childFormWatch"
                                   :computed="childFormComputed"
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
            var parm_pk_psndoc = this.$root.$router.currentRoute.params.id;
            return {
                mainInfo: {
                    psnname: '',
                    orgname: '',
                    deptname: '',
                },
                //兼职记录
                workIcons: [{
                    icon: "plus",
                    show: true,
                    click: function () {
                        vm.tableFormAdd();
                    }
                }],
                templateData: {
                },
                cancelButtonText:"删除",
                //新增数据初始值
                addLineInitData: {},
                templateEdit: false,
                operEditable: true,
                formShowMsg: true,
                //模板控件里的method内容
                childFormMethods: {


                    // 组织变化的触发事件
                    orgTrigger: function () {
                        // 选择组织后，清空部门、岗位、职务、职级、职等
                        this['hi_psndoc_parttime'].pk_dept = '';
                        this['hi_psndoc_parttime'].pk_post = '';
                        this['hi_psndoc_parttime'].pk_job = '';
                        this['hi_psndoc_parttime'].pk_jobgrade = '';
                        this['hi_psndoc_parttime'].pk_jobrank = '';
                    },

                    deptTrigger: function () {
                        // 选择部门后，清空岗位、职务、职级、职等
                        this['hi_psndoc_parttime'].pk_post = '';
                        this['hi_psndoc_parttime'].pk_job = '';
                        this['hi_psndoc_parttime'].pk_jobgrade = '';
                        this['hi_psndoc_parttime'].pk_jobrank = '';
                    },
                    // 岗位变化
                    postTrigger: function () {
                        // 选择岗位后，清空职务、职级、职等
                        this['hi_psndoc_parttime'].pk_job = '';
                        this['hi_psndoc_parttime'].pk_jobgrade = '';
                        this['hi_psndoc_parttime'].pk_jobrank = '';

                        // 触发岗位联动
                        this.setDefaultDataByPost(this['hi_psndoc_parttime'].pk_post);
                    },
                    jobTrigger: function () {
                        let pk_post = this.hi_psndoc_parttime.pk_post;
                        let pk_job = this.hi_psndoc_parttime.pk_job;
                        // 选择职务后，清空职级、职等
                        this['hi_psndoc_parttime'].pk_jobgrade = '';
                        this['hi_psndoc_parttime'].pk_jobrank = '';
                        if (pk_job) {
                            this.setDefaultDataByJob(pk_job);
                        } else {
                            this.setDefaultDataByPost(pk_post);
                        }
                    },
                    jobGradeTrigger: function () {
                        // 选择职级后，清空职等重新选择
                        this['hi_psndoc_parttime'].pk_jobrank = '';
                    },
                    setDefaultDataByPost: function (pk_post) {
                        if (pk_post) {
                            this.$http({
                                url: '/hrjf/postJoin/findPostInfo/' + pk_post,
                                method: 'get',
                            }).then((res) => {
                                if (res.data.status === true) {
                                    let defaultData = res.data.data[0];
                                    if (!this['hi_psndoc_parttime'].beanMap) {
                                        this['hi_psndoc_parttime'].beanMap = defaultData.beanMap;
                                    }
                                    if (defaultData.pk_job) {
                                        this['hi_psndoc_parttime'].pk_job = defaultData.pk_job;
                                        this['hi_psndoc_parttime'].beanMap.pk_job_ref = defaultData.beanMap.pk_job_ref;

                                        // 当岗位和职务同时存在的时候，职务优先
                                        this.setDefaultDataByJob(defaultData.pk_job);
                                    } else {
                                        if (defaultData.pk_joblevel) {
                                            this['hi_psndoc_parttime'].pk_jobgrade = defaultData.pk_joblevel;
                                            this['hi_psndoc_parttime'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                        }
                                        if (defaultData.defaultrank) {
                                            this['hi_psndoc_parttime'].pk_jobrank = defaultData.defaultrank;
                                            this['hi_psndoc_parttime'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                                        }
                                    }
                                } else {
                                    this.$message({message: res.data.msg, type: 'error'});
                                }
                            }).catch(() => {
                                this.$message({message: '查询岗位信息失败！', type: 'error'});
                            });
                        }
                    },
                    // 根据职务获取变量
                    setDefaultDataByJob: function (pk_job) {
                        if (pk_job) {
                            this.$http({
                                url: '/hrjf/jobJoin/findJobLevelRank/' + pk_job,
                                method: 'get',
                            }).then((res) => {
                                if (res.data.status === true) {
                                    let defaultData = res.data.data;
                                    if (!this['hi_psndoc_parttime'].beanMap) {
                                        this['hi_psndoc_parttime'].beanMap = defaultData.beanMap;
                                    }
                                    if (defaultData.pk_joblevel) {
                                        this['hi_psndoc_parttime'].pk_jobgrade = defaultData.pk_joblevel;
                                        this['hi_psndoc_parttime'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                    }
                                    if (defaultData.defaultrank) {
                                        this['hi_psndoc_parttime'].pk_jobrank = defaultData.defaultrank;
                                        this['hi_psndoc_parttime'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                                    }
                                } else {
                                    this.$message({message: res.data.msg, type: 'error'});
                                }
                            }).catch(() => {
                                this.$message({message: '查询职务信息失败！', type: 'error'});
                            });
                        }
                    },
//                    triggerHandle: function (type, data) {
//                        if(!vm.templateEdit)return;
//                        let key = data.key;
//                        let editData = this.$refs.ref_psndoc_parttime_c.model;
//                        if (key === "pk_group") {
//                            editData.pk_dept = "";
//                            editData.pk_org = "";
//                            if (!editData.pk_post) {
//                                editData.pk_psncl = "";
//                                editData.pk_post = "";
//                                editData.pk_jobgrade = "";
//                                editData.pk_postseries = "";
//                                editData.pk_job = "";
//                                editData.series = "";
//                                editData.pk_jobrank = "";
//                            }
//                        } else if (key === "pk_org") {
//                            var id = data.value[0].id;
//                            this.params.pk_org = id;
//
//                            editData.pk_dept = "";
//                            if (!editData.pk_post) {
//                                editData.pk_post = "";
//                                editData.pk_jobgrade = "";
//                                editData.pk_postseries = "";
//                                editData.pk_job = "";
//                                editData.series = "";
//                                editData.pk_jobrank = "";
//                            }
//                        } else if (key === "pk_dept") {
//                            if (!editData.pk_post) {
//                                editData.pk_post = "";
//                                editData.pk_jobgrade = "";
//                                editData.pk_postseries = "";
//                                editData.pk_job = "";
//                                editData.series = "";
//                                editData.pk_jobrank = "";
//                            }
//                        } else if (key === "pk_post") {
//                            editData.pk_postseries = "";
//                            editData.pk_job = "";
//                            editData.pk_jobgrade = "";
//                            editData.pk_jobrank = "";
//                            editData.series = "";
//                        } else if (key === "pk_job") {
//                            editData.pk_jobgrade = "";
//                            editData.pk_jobrank = "";
//                            editData.series = "";
//                        } else if (key === "series") {
//                            editData.pk_jobgrade = "";
//                            editData.pk_jobrank = "";
//                        } else if (key === "pk_postseries") {
//                            editData.pk_jobgrade = "";
//                            editData.pk_jobrank = "";
//                        } else if (key === "pk_jobgrade") {
//                            editData.pk_jobrank = "";
//                        }
//                    }
                },

                childFormWatch:{
                },
                childFormComputed:{
                    params:function(){
                        return {
                            pk_org:this.hi_psndoc_parttime.pk_org,
                            pk_dept:this.hi_psndoc_parttime.pk_dept,
                            hrcanceled:'N'
                        };
                    },
                    postRefParams: function () {
                        return {
                            pk_org: this['hi_psndoc_parttime'].pk_org,
                            pk_dept: this['hi_psndoc_parttime'].pk_dept,
                            pk_post: this['hi_psndoc_parttime'].pk_job ? '' : this['hi_psndoc_parttime'].pk_post,
                            pk_job: this['hi_psndoc_parttime'].pk_job,
                            pk_joblevel: this['hi_psndoc_parttime'].pk_jobgrade,
                        };
                    },
                },
                //模板信息
                templateTableForm: {
                    card_id: 'psndoc_parttime_c',
                    card: 'hi_psndoc_parttime',
                    card_ref: 'ref_psndoc_parttime_c',
                    list_id: 'psndoc_parttime_l',
                    list: 'hi_psndoc_parttime_t',
                    list_ref: 'ref_psndoc_parttime_l',
                },
                templateUrl: {
                    init_url: '/hrtrn/parttime/jldetail/addinit?pk_psndoc=',
                    save_url: '/hrtrn/parttime/jldetail/save',
                    delete_url: '/hrtrn/parttime/jldetail/delete',
                },

                tableFormResetFun($node) {
                    //增加编辑联动事件
//                    var $ownModule = $node.find("[v-model^='hi_psndoc_parttime.']");
//                    $ownModule.attr('v-on:trigger', 'triggerHandle');

                    // 组织的触发事件
                    $node.find("[v-model='hi_psndoc_parttime.pk_org']").attr("v-on:trigger", "orgTrigger");
                    // 部门的触发事件
                    $node.find("[v-model='hi_psndoc_parttime.pk_dept']").attr("v-on:trigger", "deptTrigger");
                    // 岗位触发事件
                    $node.find("[v-model='hi_psndoc_parttime.pk_post']").attr("v-on:trigger", "postTrigger");
                    // 职务触发事件
                    $node.find("[v-model='hi_psndoc_parttime.pk_job']").attr("v-on:trigger", "jobTrigger");
                    // 职级触发事件
                    $node.find("[v-model='hi_psndoc_parttime.pk_jobgrade']").attr("v-on:trigger", "jobGradeTrigger");

                    let $table = this.getNodeById($node, 'psndoc_parttime_l');
                    //列表表头显示控制
                    $table.attr(':show-header', 'false');
                    //列表操作列显示控制
                    let operateHtml = this.getBaseTableOperateHtml();
                    operateHtml = operateHtml.replace(/@click=/g,"@click.stop=");
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                //人员信息主键
                pk_psndoc: parm_pk_psndoc,
                isDimission: false,
            };
        },

        watch: {
            templateEdit(curVal, oldVal){
                this.workIcons[0].show = !curVal;
                this.operEditable = !curVal;
//                this.rowClickExpend = !curVal;
            },
        },
        mounted() {
            this.request();
        },

        methods: {
            // 获取数据
            request() {
                this.requestData();
            },
            requestData(){
                var url = this.templateUrl.init_url + this.pk_psndoc;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.resetData(res);
                            if (res.data.part.length === 0) {
                                this.$refs.ref_table_form.tableShow = false;
                                this.templateEdit = false;
                                // 显示新增区域
                                this.$refs.ref_table_form.formShow = true;
                                this.$refs.ref_table_form.setData(this.templateTableForm.card, res.data.initadd);

                                this.$nextTick(function(){
                                    this.templateEdit = true;
                                });
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

            resetData(res){
                var originalValue = res.data.data;
//        this.$refs.ref_psnjob_c.setData("hi_psnjob", JSON.parse(JSON.stringify(originalValue)));
//        this.$refs.ref_psnjob_c.setData("psnname", res.data.psndoc.name);
                this.isDimission = originalValue.endflag;
                this.$refs.ref_table_form.setData(this.templateTableForm.list, res.data.part);
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
                this.templateEdit = false;
                this.$refs.ref_table_form.setData(this.templateTableForm.card, JSON.parse(JSON.stringify(scope.row)));
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能修改兼职记录.", type: "warning"});
                    this.templateEdit = false;
                } else {
                    this.$nextTick(function(){
                        this.templateEdit = true;
                    });
                }
            },

            // table行的删除操作
            tableFormDeleteClick(scope) {
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能删除兼职记录.", type: "error"});
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
                        if (res.data.part.length === 0) {
                            this.$refs.ref_table_form.tableShow = false;
                            this.templateEdit = false;
                            this.$refs.ref_table_form.formShow = false;
//                            this.$nextTick(function(){
//                                this.templateEdit = true;
//                            });
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
            tableFormConfirm() {
                this.$refs.ref_table_form.validate((valid) => {
                    if (valid) {
                        this.$confirm('是否同步履历?', '确认同步', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            closeOnClickModal: false,
                            type: 'info'
                        }).then(() => {
                            this.handleSave(1);
                        }).catch(() => {
                            this.handleSave(0);
                        });
                    }
                });
            },

            //实际的保存操作
            handleSave(isSyncWork){
                let data = this.$refs.ref_table_form.getData(this.templateTableForm.card);
                this.$http({
                    url: this.templateUrl.save_url + "?issyswork=" + isSyncWork,
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
                        for(let i=0;i<lstData.length;i++){
                           if(lstData[i].pk_psnjob == formData.pk_psnjob){
                               if (this.isDimission) {
                                   this.$message({message: "当前选择的人员已经离职,不能删除兼职记录.", type: "error"});
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

                               break;
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
                    this.$message({message: "当前选择的人员已经离职,不能增加新的兼职记录.", type: "error"});
                    return;
                }
                // 关闭table中的编辑区
                this.$refs.ref_table_form.getTableComp().closeExpandRow();
                this.templateEdit = false;
                // 重置新增数据
                this.$refs.ref_table_form.setData(this.templateTableForm.card, this.addLineInitData);
                // 显示新增区域
                this.$refs.ref_table_form.formShow = true;
                this.cancelButtonText = "取消";
                this.$nextTick(function(){
                    this.templateEdit = true;
                });

            },

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
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能修改兼职记录.", type: "warning"});
                    this.templateEdit = false;
                } else {
                    this.templateEdit = true;
                    this.cancelButtonText = "取消";
                }
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
