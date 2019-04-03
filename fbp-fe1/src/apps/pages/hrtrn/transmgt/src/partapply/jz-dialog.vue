<template>
    <el-dialog title="兼职" v-model="dialogVisible" size="large">
        <ifbp-template ref="jzRef"
                       style="margin-top:0px;"
                           tpl-id="hrtrn_partapply_add"
                           :tpl-data="partapplyData"
                           :tpl-reset-fun="tableFormResetFun"
                           :computed="childFormComputed"
                           :methods="childFormMethods">
        </ifbp-template>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">保存</el-button>
        <el-button @click="handleCommit" type="primary">提交</el-button>
      </span>
    </el-dialog>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        props: [],
        data() {
            var vm = this;
            return {
                dialogVisible: false,
                partapplyData:{},
                pk_partmng: '',
                pk_psnjob: '',

                childFormComputed:{
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
                //模板控件里的method内容
                childFormMethods: {

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

                tableFormResetFun($node) {
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
            };
        },
        watch: {},
        computed: {
        },
        mounted() {
        },

        methods: {
            show(pk_psnjob){
                this.pk_psnjob = pk_psnjob;
                this.initData(pk_psnjob);
            },
            initData(pk_psnjob){
                var url = '/hrtrn/part/apply/addinit?pk_psnjob=' + pk_psnjob;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.dialogVisible = true;
                            this.$nextTick(function () {
                                this.$refs.jzRef.setFormData(res.data.data);
                                this.pk_partmng = res.data.data.pk_partmng;
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

            handleCommit(){
                this.$refs.jzRef.validate(valid => {
                    if (valid) {
                        this.handleRealCommit();
                    }
                });
            },

            handleRealCommit(){
                let data = this.$refs.jzRef.getFormData();
                let myself = this;
                data.status = 2;

                this.$http({
                    url: "/hrtrn/part/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/transmgt/partapply/detail/" + myself.pk_partmng + "/false");
                            });
                        } else {
                            if (res.data.saveResult) {
                                this.dialogVisible = false;
                                this.$nextTick(function () {
                                    myself.$router.push("/hrtrn/transmgt/partapply/detail/" + myself.pk_partmng + "/false");
                                });
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
            handleCancel(){
                this.dialogVisible = false;
            },
            handleSave() {
                this.$refs.jzRef.validate(valid => {
                    if (valid) {
                        this.handleRealSave();
                    }
                });
            },
            // 基本信息保存按钮操作
            handleRealSave() {
                let data = this.$refs.jzRef.getFormData();
                let myself = this;
                this.$http({
                    url: "/hrtrn/part/apply/insert",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/transmgt/partapply/detail/" + myself.pk_partmng + "/false");
                            });

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

        }
    };
</script>
<style>
</style>
