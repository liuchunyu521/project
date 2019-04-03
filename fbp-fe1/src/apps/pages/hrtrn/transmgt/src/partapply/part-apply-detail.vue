<template>
    <ifbp-page>
        <ifbp-breadcrumb name="兼职申请单"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">

                <initiateFlow ref="initfolwRef" class="fl" :billId="pk_partmng" billType="6117"
                              :showBtn='!isEdit' @isRecall="getIsRecall" agentuserId="" @afterAction="afterAction"></initiateFlow>

                <!-- 主表编辑页签 -->
                <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
                    <ifbp-template ref="ref_partapply_c"
                                   tpl-id="hrtrn_partapply_apply_detail"
                                   :tplData="partapplyData"
                                   :editable="isEdit"
                                   :tplResetFun="partapplyFormResetFun"
                                   :form-show-message="isEdit"
                                   :methods="partapplyFormMethods"
                                   :computed="partapplyFormComputed"
                    >
                    </ifbp-template>
                </ifbp-panel>

                <ifbp-panel title="附件" :icons="[]">
                    <ifbp-upload busi-code="60090partapply" force-type="normal" :pk-busi="hi_partapply.pk_partmng"
                                 :disableUpdate="!isEdit"
                                 :disableUpload="!isEdit"
                                 :disableDelete="!isEdit"></ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer>
            <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
            <el-button @click="editHandle" v-if="!isEdit && editBtnIf">编辑</el-button>
            <el-button type="primary" @click="printTemplate" v-if="!isEdit">打印</el-button>
            <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
            <el-button type="primary" @click="commitHandle" v-if="!hasCommited">提交</el-button>
            <el-button type="primary" @click="execHandle" v-if="hi_partapply.approve_state==1">执行</el-button>
        </ifbp-footer>

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

    import initiateFlow from 'ifbp-business/initiateFlow';
    import printPre from '../../../../../common/printPre.js';
    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin,printPre],

        components: {
            initiateFlow: initiateFlow
        },
        data() {
            var vm = this;
            return {
                //生效日期
                effectDate: new Date(),
                //执行时的生效日期
                execDialogVisible:false,
                // 通过传入的参数判断是新增还是修改操作
                pk_wa_class: '',
                isEdit: vm.$root.$router.currentRoute.params.edit == "true",
                canEdit:false,
                pk_partmng: vm.$root.$router.currentRoute.params.id,
                isinitiateFlowShow: false,
                hasCommited: true,
                baseData:{},
                //单据VO的状态
                status: 2,//1,update;2,new;3,delete
                partapplyData: {},
                rules: {},
                approveType: 0,
                hi_partapply: {},
                partapplyFormResetFun($node) {

                    let $pk_psndoc_ref = $node.find("[prop='pk_psndoc']").children().first();
                    $pk_psndoc_ref.attr("v-show","editable");
                    let $psndoc_a = $('<a class="hr-form-a" href="javascript:void(0);" v-show="!editable" @click.stop="showPsnDetail()">{{hi_partapply.beanMap.pk_psndoc_ref[hi_partapply.pk_psndoc].name}}</a>');
                    $node.find("[prop='pk_psndoc']").append($psndoc_a);

                    // 组织的触发事件
                    $node.find("[v-model='hi_partapply.pk_org']").attr("v-on:trigger", "orgTrigger");
                    // 部门的触发事件
                    $node.find("[v-model='hi_partapply.pk_dept']").attr("v-on:trigger", "deptTrigger");
                    // 岗位触发事件
                    $node.find("[v-model='hi_partapply.pk_post']").attr("v-on:trigger", "postTrigger");
                    // 职务触发事件
                    $node.find("[v-model='hi_partapply.pk_job']").attr("v-on:trigger", "jobTrigger");
                    // 职级触发事件
                    $node.find("[v-model='hi_partapply.pk_jobgrade']").attr("v-on:trigger", "jobGradeTrigger");
                    return $node[0].outerHTML;
                },

                partapplyFormComputed:{
                    showPsnDetail(){
                        let pk = this.hi_partapply.pk_psndoc;
                        vm.$router.push("/hrhi/psninfo/dynamic/" + pk + "?funcode=60070psninfo");
                    },
                    postRefParams: function () {
                        return {
                            pk_org: this['hi_partapply'].pk_org,
                            pk_dept: this['hi_partapply'].pk_dept,
                            pk_post: this['hi_partapply'].pk_job ? '' : this['hi_partapply'].pk_post,
                            pk_job: this['hi_partapply'].pk_job,
                            pk_joblevel: this['hi_partapply'].pk_jobgrade,
                        };
                    },
                },
                partapplyFormMethods: {
                    // 组织变化的触发事件
                    orgTrigger: function () {
                        // 选择组织后，清空部门、岗位、职务、职级、职等
                        this['hi_partapply'].pk_dept = '';
                        this['hi_partapply'].pk_post = '';
                        this['hi_partapply'].pk_job = '';
                        this['hi_partapply'].pk_jobgrade = '';
                        this['hi_partapply'].pk_jobrank = '';
                    },

                    deptTrigger: function () {
                        // 选择部门后，清空岗位、职务、职级、职等
                        this['hi_partapply'].pk_post = '';
                        this['hi_partapply'].pk_job = '';
                        this['hi_partapply'].pk_jobgrade = '';
                        this['hi_partapply'].pk_jobrank = '';
                    },
                    // 岗位变化
                    postTrigger: function () {
                        // 选择岗位后，清空职务、职级、职等
                        this['hi_partapply'].pk_job = '';
                        this['hi_partapply'].pk_jobgrade = '';
                        this['hi_partapply'].pk_jobrank = '';

                        // 触发岗位联动
                        this.setDefaultDataByPost(this['hi_partapply'].pk_post);
                    },
                    jobTrigger: function () {
                        let pk_post = this.hi_partapply.pk_post;
                        let pk_job = this.hi_partapply.pk_job;
                        // 选择职务后，清空职级、职等
                        this['hi_partapply'].pk_jobgrade = '';
                        this['hi_partapply'].pk_jobrank = '';
                        if (pk_job) {
                            this.setDefaultDataByJob(pk_job);
                        } else {
                            this.setDefaultDataByPost(pk_post);
                        }
                    },
                    jobGradeTrigger: function () {
                        // 选择职级后，清空职等重新选择
                        this['hi_partapply'].pk_jobrank = '';
                    },
                    setDefaultDataByPost: function (pk_post) {
                        if (pk_post) {
                            this.$http({
                                url: '/hrjf/postJoin/findPostInfo/' + pk_post,
                                method: 'get',
                            }).then((res) => {
                                if (res.data.status === true) {
                                    let defaultData = res.data.data[0];
                                    if (!this['hi_partapply'].beanMap) {
                                        this['hi_partapply'].beanMap = defaultData.beanMap;
                                    }
                                    if (defaultData.pk_job) {
                                        this['hi_partapply'].pk_job = defaultData.pk_job;
                                        this['hi_partapply'].beanMap.pk_job_ref = defaultData.beanMap.pk_job_ref;

                                        // 当岗位和职务同时存在的时候，职务优先
                                        this.setDefaultDataByJob(defaultData.pk_job);
                                    } else {
                                        if (defaultData.pk_joblevel) {
                                            this['hi_partapply'].pk_jobgrade = defaultData.pk_joblevel;
                                            this['hi_partapply'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                        }
                                        if (defaultData.defaultrank) {
                                            this['hi_partapply'].pk_jobrank = defaultData.defaultrank;
                                            this['hi_partapply'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
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
                                    if (!this['hi_partapply'].beanMap) {
                                        this['hi_partapply'].beanMap = defaultData.beanMap;
                                    }
                                    if (defaultData.pk_joblevel) {
                                        this['hi_partapply'].pk_jobgrade = defaultData.pk_joblevel;
                                        this['hi_partapply'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                    }
                                    if (defaultData.defaultrank) {
                                        this['hi_partapply'].pk_jobrank = defaultData.defaultrank;
                                        this['hi_partapply'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                                    }
                                } else {
                                    this.$message({message: res.data.msg, type: 'error'});
                                }
                            }).catch(() => {
                                this.$message({message: '查询职务信息失败！', type: 'error'});
                            });
                        }
                    },
                },

            };
        },
        mounted() {
            this.request();
        },
        computed: {
            editBtnIf:function(){
                return this.hi_partapply.approve_state!=1 && this.hi_partapply.approve_state!=0 && this.hi_partapply.approve_state!=102;
            },
        },
        methods: {
            getIsRecall(isrecall){
                if (isrecall) {
                      this.request();
                      this.$refs.initfolwRef.doParams();
                }
            },
            cancelHandle(){
                this.$refs.ref_partapply_c.setFormData(JSON.parse(JSON.stringify(this.baseData)));
                this.hi_partapply = JSON.parse(JSON.stringify(this.baseData));
                // 执行一次校验，去掉提示
                this.$nextTick(function () {
                    this.pageValidate();
                });
                this.isEdit = false;
            },
            // 获取数据
            request() {
                this.$http({
                    url: "/hrtrn/part/apply/getById/" + this.pk_partmng,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_partapply_c.setFormData(res.data.data);
                            this.hi_partapply = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(res.data.data));
                            this.hasCommited = this.hi_partapply.approve_state != -1;
                            this.isinitiateFlowShow = this.hi_partapply.approve_state != -1 && !!this.hi_partapply.approve_state;
                            this.canEdit = res.data.canEdit;
                            this.approveType = res.data.approveType;
                            if(this.isEdit && !this.canEdit){
                                this.isEdit = false;
                                this.$message({
                                    message: "您没有权限编辑当前数据！",
                                    type: "error"
                                });
                            }
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息详情获取失败",
                            type: "error"
                        });
                    });

            },
            editHandle(){

                this.$http({
                    url: "/hrtrn/part/apply/canEdit/" + this.pk_partmng,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.canEdit = res.data.canEdit;
                            if(this.canEdit){
                                this.isEdit = true;
                            }else{
                                this.$message({
                                    message: "您没有权限编辑当前数据！",
                                    type: "error"
                                });
                            }
                        }else{
                            this.$message({
                                message: red.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "编辑权限信息获取失败",
                            type: "error"
                        });
                    });
            },
            saveHandle(){
                if (!this.pageValidate())return;
                let data = this.$refs.ref_partapply_c.getFormData();
                this.$http({
                    url: "/hrtrn/part/apply/save",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.$refs.ref_partapply_c.setFormData(res.data.data);
                            this.hi_partapply = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(res.data.data));
                            this.hasCommited = this.hi_partapply.approve_state != -1;
                            this.isEdit = false;
                            this.$refs.ref_partapply_c.clearEdit();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "保存失败",
                            type: "error"
                        });
                    });
            },
            commitHandle(){
                if (!this.pageValidate())return;
                let data = this.$refs.ref_partapply_c.getFormData();
                if (this.isEdit) {
                    data.status = 1;
                } else {
                    data.status = 0;
                }
                this.$http({
                    url: "/hrtrn/part/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.$refs.ref_partapply_c.setFormData(res.data.data);
                            this.hi_partapply = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(res.data.data));
                            this.hasCommited = this.hi_partapply.approve_state != -1;
                            this.isinitiateFlowShow = true;
                            this.isEdit = false;
                            this.$refs.initfolwRef.doParams();
                            this.$refs.ref_partapply_c.clearEdit();
                        } else {
                            if(res.data.saveResult){
                                this.$refs.ref_partapply_c.setFormData(res.data.data);
                                this.hi_partapply = res.data.data;
                                this.baseData = JSON.parse(JSON.stringify(res.data.data));
                                this.isEdit = false;
                            }
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "提交失败",
                            type: "error"
                        });
                    });
            },

            afterAction(action){
                //审批通过后【执行】
                if(action == "agreeAble"){
                    this.execBill();
                }else{
                    this.request();
                }
            },
            execBill(date){
                this.$http({
                    url: "/hrtrn/part/apply/execBill",
                    method: "post",
                    params:{
                        pk:this.pk_partmng,
                        pk_org:this.hi_partapply.pk_org,
                        regularDate:date != null ? date.getTime() : null,
                    },
                })
                    .then(res => {
                        if (res.data.status === true) {
                            if(res.data.msg){
                                this.$message({
                                    message: res.data.msg,
                                    type: "success"
                                });
                            }
                                this.request();
                        } else {
                            this.request();
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
            execHandle(){
                this.execDialogVisible = true;
            },
            execDialogConfirm(){
                this.execDialogVisible = false;
                this.execBill(this.effectDate);
            },
            // 上方模板和自定义的校验
            pageValidate: function () {
                var hasError = false;
                this.$refs.ref_partapply_c.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
                return !hasError;
            },

            printTemplate:function () {
                let param = {
                    billid:this.pk_partmng,
                };
                this.printPre("60090partapply", "PartApplyPrintTemp", param);
            },
        }
    };
</script>
<style>
</style>
