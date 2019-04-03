<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="调配"></ifbp-breadcrumb>

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
                <ifbp-panel id="joblistPanel" title="任职情况" :icons="workIcons" class="titleLine" :toggle-show="false">
                    <ifbp-template ref="ref_table_form"
                                   tpl-id="hrtrn_transferjl_detail"
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
            //人员信息主键
            var parm_pk_psndoc = this.$root.$router.currentRoute.params.id;
            return {
                mainInfo: {
                    psnname: '',
                    orgname: '',
                    deptname: '',
                },
                jobData: {
                    rules: {}
                },
                //试用情况
                workIcons: [{
                    icon: "plus",
                    show: true,
                    click: function () {
                        vm.tableFormAdd();
                    }
                }],

                templateData: {
//                    params: {
//                        pk_org: ""
//                    },
//                    rules: {
//                    }
                },
                cancelButtonText:"删除",
                templateEdit: false,
                operEditable: true,
                formShowMsg: true,
                rowClickExpend:true,
                tableFormResetFun($node) {
                    //增加编辑联动事件
                    //var $ownModule = this.getNodeById($node, 'ayj2zw8d44');
//                    var $ownModule = $node.find("[v-model^='hi_psnjob.']");
//                    $ownModule.attr('v-on:trigger', 'triggerHandle');

                    // 组织的触发事件
                    $node.find("[v-model='hi_psnjob.pk_org']").attr("v-on:trigger", "orgTrigger");
                    // 部门的触发事件
                    $node.find("[v-model='hi_psnjob.pk_dept']").attr("v-on:trigger", "deptTrigger");
                    // 岗位触发事件
                    $node.find("[v-model='hi_psnjob.pk_post']").attr("v-on:trigger", "postTrigger");
                    // 职务触发事件
                    $node.find("[v-model='hi_psnjob.pk_job']").attr("v-on:trigger", "jobTrigger");
                    // 职级触发事件
                    $node.find("[v-model='hi_psnjob.pk_jobgrade']").attr("v-on:trigger", "jobGradeTrigger");


                    let $table = this.getNodeById($node, 'psnjob_l');
                    //表头是否显示控制
                    $table.attr(':show-header', 'false');
                    //操作列的图标控制
                    let operateHtml = this.getBaseTableOperateHtml();
                    operateHtml = operateHtml.replace(/@click=/g,"@click.stop=");
                    $table.append(operateHtml);

                    return $node[0].outerHTML;
                },

                //模板控件里的method内容
                childFormMethods: {

                    // 组织变化的触发事件
                    orgTrigger: function () {
                        // 选择组织后，清空部门、岗位、职务、职级、职等
                        this['hi_psnjob'].pk_dept = '';
                        this['hi_psnjob'].pk_post = '';
                        this['hi_psnjob'].pk_job = '';
                        this['hi_psnjob'].pk_jobgrade = '';
                        this['hi_psnjob'].pk_jobrank = '';
                    },

                    deptTrigger: function () {
                        // 选择部门后，清空岗位、职务、职级、职等
                        this['hi_psnjob'].pk_post = '';
                        this['hi_psnjob'].pk_job = '';
                        this['hi_psnjob'].pk_jobgrade = '';
                        this['hi_psnjob'].pk_jobrank = '';
                    },
                    // 岗位变化
                    postTrigger: function () {
                        // 选择岗位后，清空职务、职级、职等
                        this['hi_psnjob'].pk_job = '';
                        this['hi_psnjob'].pk_jobgrade = '';
                        this['hi_psnjob'].pk_jobrank = '';

                        // 触发岗位联动
                        this.setDefaultDataByPost(this['hi_psnjob'].pk_post);
                    },
                    jobTrigger: function () {
                        let pk_post = this.hi_psnjob.pk_post;
                        let pk_job = this.hi_psnjob.pk_job;
                        // 选择职务后，清空职级、职等
                        this['hi_psnjob'].pk_jobgrade = '';
                        this['hi_psnjob'].pk_jobrank = '';
                        if (pk_job) {
                            this.setDefaultDataByJob(pk_job);
                        } else {
                            this.setDefaultDataByPost(pk_post);
                        }
                    },
                    jobGradeTrigger: function () {
                        // 选择职级后，清空职等重新选择
                        this['hi_psnjob'].pk_jobrank = '';
                    },
                    setDefaultDataByPost: function (pk_post) {
                        if (pk_post) {
                            this.$http({
                                url: '/hrjf/postJoin/findPostInfo/' + pk_post,
                                method: 'get',
                            }).then((res) => {
                                if (res.data.status === true) {
                                    let defaultData = res.data.data[0];
                                    if (!this['hi_psnjob'].beanMap) {
                                        this['hi_psnjob'].beanMap = defaultData.beanMap;
                                    }
                                    if (defaultData.pk_job) {
                                        this['hi_psnjob'].pk_job = defaultData.pk_job;
                                        this['hi_psnjob'].beanMap.pk_job_ref = defaultData.beanMap.pk_job_ref;

                                        // 当岗位和职务同时存在的时候，职务优先
                                        this.setDefaultDataByJob(defaultData.pk_job);
                                    } else {
                                        if (defaultData.pk_joblevel) {
                                            this['hi_psnjob'].pk_jobgrade = defaultData.pk_joblevel;
                                            this['hi_psnjob'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                        }
                                        if (defaultData.defaultrank) {
                                            this['hi_psnjob'].pk_jobrank = defaultData.defaultrank;
                                            this['hi_psnjob'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
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
                                    if (!this['hi_psnjob'].beanMap) {
                                        this['hi_psnjob'].beanMap = defaultData.beanMap;
                                    }
                                    if (defaultData.pk_joblevel) {
                                        this['hi_psnjob'].pk_jobgrade = defaultData.pk_joblevel;
                                        this['hi_psnjob'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                    }
                                    if (defaultData.defaultrank) {
                                        this['hi_psnjob'].pk_jobrank = defaultData.defaultrank;
                                        this['hi_psnjob'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
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
//                        let editData = this.$refs.ref_psnjob_c.model;
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
                        pk_org:this.hi_psnjob.pk_org,
                        pk_dept:this.hi_psnjob.pk_dept,
                        hrcanceled:'N'
                    };
                  },
                    postRefParams: function () {
                        return {
                            pk_org: this['hi_psnjob'].pk_org,
                            pk_dept: this['hi_psnjob'].pk_dept,
                            pk_post: this['hi_psnjob'].pk_job ? '' : this['hi_psnjob'].pk_post,
                            pk_job: this['hi_psnjob'].pk_job,
                            pk_joblevel: this['hi_psnjob'].pk_jobgrade,
                        };
                    },
                },
                templateTableForm: {
                    card_id: 'psnjob_c',
                    card: 'hi_psnjob',
                    card_ref: 'ref_psnjob_c',
                    list_id: 'psnjob_l',
                    list: 'hi_psnjob_t',
                    list_ref: 'ref_psnjob_l',
                },

                templateUrl: {
                    init_url: '/hrtrn/transfer/jldetail/addinit?pk_psndoc=',
                    save_url: '/hrtrn/transfer/jldetail/save?issyswork=',
                    edit_url: '/hrtrn/transfer/save',
                    delete_url: '/hrtrn/transfer/jldetail/delete',
                },

                tableListData: {},
                //新增行的默认是显示数据
                addLineInitData: {},

                pk_psndoc: parm_pk_psndoc,
                isDimission: false,
            }
        },
        watch: {
            templateEdit(curVal, oldVal){
                this.workIcons[0].show = !curVal;
                this.operEditable = !curVal;
//                this.rowClickExpend = !curVal;
            },
        },
        mounted()
        {
            this.request();
        },

        methods: {
            // 获取数据
            request()
            {
                //获取页面初始数据
                this.initData();
            },
            initData()
            {
                var url = '/hrtrn/transfer/jldetail/addinit?pk_psndoc=' + this.pk_psndoc;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            if (res.data.psnjob.length === 0) {
                                this.$refs.ref_table_form.tableShow = false;
                                // 显示新增区域
                                this.$refs.ref_table_form.formShow = true;
                                this.$refs.ref_table_form.setData(this.templateTableForm.card, res.data.initadd);
                                this.templateEdit = true;
                            } else {
                                this.$refs.ref_table_form.tableShow = true;
                            }
                            this.$nextTick(() => {
                                this.resetData(res);
                            });
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

            //设置前台显示数据
            resetData(res)
            {
                var originalValue = res.data.data;
//        this.$refs.ref_psnjob_c.setData("hi_psnjob", originalValue);
//        this.$refs.ref_psnjob_c.setData("psnname", res.data.psndoc.name);
                this.isDimission = originalValue.endflag;
//        this.$refs.ref_table_form.setData("hi_psnjob_t", res.data.psnjob);
                this.$refs.ref_table_form.setTableData(res.data.psnjob);
                this.addLineInitData = res.data.initadd;
                this.mainInfo.psnname = res.data.psndoc.name;
                this.mainInfo.orgname = res.data.data.beanMap.pk_org_ref[res.data.data.pk_org].name;
                this.mainInfo.deptname = res.data.data.beanMap.pk_dept_ref[res.data.data.pk_dept].name;
            },

            // table行的编辑事件
            tableFormEditClick(scope)
            {
                this.cancelButtonText = "取消";
                this.$refs.ref_table_form.getTableComp().expandRow(scope.row);
                this.$refs.ref_table_form.formShow = false;
                this.templateEdit = false;
                this.$refs.ref_table_form.setData(this.templateTableForm.card, JSON.parse(JSON.stringify(scope.row)));
                if (this.isDimission && scope.row.lastflag) {
                    this.$message({message: "当前选择的人员已经离职,不能修改最新的任职记录.", type: "warning"});
                    this.templateEdit = false;
                } else {
                    this.$nextTick(function(){
                        this.templateEdit = true;
                    });
                }
            },

            //判断是否已经离职
//      isDimission()
//      {
//        let psnjobData = this.$refs.ref_psnjob_c.getData("hi_psnjob");
//        if (psnjobData.endflag) {
//          return true;
//        }
//        return false;
//      },

            // table行的删除事件
            tableFormDeleteClick(scope)
            {
                let childVOSize = this.$refs.ref_table_form.getData("hi_psnjob_t").length;
                if (childVOSize == 1) {
                    this.$message({message: "当前选择的人员只有一条工作记录,不能删除.", type: "error"});
                    return;
                }
                if (this.isDimission && scope.row.lastflag) {
                    this.$message({message: "当前选择的人员已经离职,不能删除最新的任职记录.", type: "error"});
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
            tableFormDelete(isFormDel)
            {
                let data = this.$refs.ref_table_form.getData("hi_psnjob_t")[this.delete_idx];
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
                        if (res.data.psnjob.length === 0) {
                            this.$refs.ref_table_form.tableShow = false;
                            this.$refs.ref_table_form.formShow = true;
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
            tableFormConfirm(type)
            {
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

            handleSave(isSyncWork)
            {
                let data = this.$refs.ref_table_form.getData(this.templateTableForm.card);
                this.$http({
                    url: this.templateUrl.save_url + isSyncWork,
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
            tableFormCancel(type)
            {
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
                        if (lstData.length == 1) {
                            this.$message({message: "当前选择的人员只有一条工作记录,不能删除.", type: "error"});
                            return;
                        }
                        if (this.isDimission && formData.lastflag) {
                            this.$message({message: "当前选择的人员已经离职,不能删除最新的任职记录.", type: "error"});
                            return;
                        }
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
            formEditClick(){
                let row = this.$refs.ref_table_form.getFormData();
                if (this.isDimission && row.lastflag) {
                    this.$message({message: "当前选择的人员已经离职,不能修改最新的任职记录.", type: "warning"});
                    this.templateEdit = false;
                } else {
                    this.templateEdit = true;
                    this.cancelButtonText = "取消";
                }
            },
            //点击加号新增操作
            tableFormAdd: function () {
                if (this.isDimission) {
                    this.$message({message: "当前选择的人员已经离职,不能增加新的任职记录.", type: "error"});
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
//                if (!this.rowClickExpend)return;
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
