<template>
    <el-dialog title="转正" v-model="dialogVisible" size="small">
        <div style="min-height:464px;overflow:auto;">
        <div id="zzDialogTemplate">
            <ifbp-template ref="zzRef"
                           style="margin-top: 0px;"
                           tpl-id="hrtrn_regapply_zz_dialog"
                           :tpl-data="regapplyData"
                           :tpl-reset-fun="tableFormResetFun"
                           :methods="childFormMethods">
            </ifbp-template>
        </div>
        <el-form ref="zzDetailRef" :rules="rules" label-width="100px" id="zzchild"
                 :model="hi_regapply">

            <el-form-item :label="item.itemname" :prop="item.newitemkey" :required="item.ismustnotnull" v-for="(item,index) in itemTemplate">
                <el-col :span="11">
                    <el-ref max="20" :editable="true" :disabled="true" v-model="hi_regapply[item.olditemkey]" :field="item.olditemkey"
                            :template-value="hi_regapply" v-if="item.fldtype == 5"
                            :ref-code="item.refcode"></el-ref>
                    <el-checkbox max="1" :editable="true" :disabled="true" v-model="hi_regapply[item.olditemkey]" v-if="item.fldtype == 4"></el-checkbox>
                    <el-date-picker type="date" max="10" :editable="true" :disabled="true" v-model="hi_regapply[item.olditemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
                    <el-input :editable="true" :disabled="true" v-model="hi_regapply[item.olditemkey]"  v-if="isTextType(item.fldtype)"></el-input>
                </el-col>
                <el-col class="line arrow" :span="2">
                    <i class="ifbp-icon-right iconright"></i>
                </el-col>
                <el-col :span="11">
                    <el-ref max="20" :editable="true" @change="validateChildItem" v-model="hi_regapply[item.newitemkey]"
                            :field="item.newitemkey" :template-value="hi_regapply" :query-params="getQueryParams(item.itemkey)"
                            :ref-code="item.refcode" :not-leaf-selectable="!item.ref_leaf_flag" @trigger="refTrigger" v-if="item.fldtype == 5"></el-ref>
                    <el-checkbox max="1" :editable="true" @change="validateChildItem"
                                 v-model="hi_regapply[item.newitemkey]" v-if="item.fldtype == 4"></el-checkbox>
                    <el-date-picker type="date" max="10" :editable="true" @change="validateChildItem" v-model="hi_regapply[item.newitemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
                    <el-input :editable="true" @change="validateChildItem" v-model="hi_regapply[item.newitemkey]"  v-if="isTextType(item.fldtype)"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="附件">
                <ifbp-upload busi-code="60090regapply" force-type="normal" file-class="new" :is-show-title="false"
                             :pk-busi="hi_regapply.pk_hi_regapply"></ifbp-upload>
            </el-form-item>
        </el-form>
    </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">保存</el-button>
        <el-button @click="handleCommit" type="primary">提交</el-button>
      </span>
    </el-dialog>
    <!-- </div>  -->
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
                regapplyData: {
                    hi_regapply: {},
                    rules: {},
                },
                hi_regapply: {},
                itemTemplate:[],
                rules: {},
                pk_hi_regapply: '',
                trial_type: 1,
                pk_psnjob: '',
                //模板控件里的method内容
                childFormMethods: {},

                tableFormResetFun($node) {
                    return $node[0].outerHTML;
                },
            };
        },
        watch: {},
        computed: {
            deptRefParams: function () {
                return {
                    pk_org: this.hi_regapply.newpk_org
                };
            },
            postRefParams: function () {
                return {
                    pk_org: this.hi_regapply.newpk_org,
                    pk_dept: this.hi_regapply.newpk_dept,
                    pk_post: this.hi_regapply.newpk_job ? "" : this.hi_regapply.newpk_post,
                    pk_job: this.hi_regapply.newpk_job,
                    pk_joblevel: this.hi_regapply.newpk_jobgrade
                };
            },
        },
        mounted() {
        },

        methods: {
            //返回参照的查询参数
            getQueryParams(itemkey){
                if(itemkey=='pk_dept'){
                    return this.deptRefParams;
                }else if(itemkey=='pk_post' || itemkey=='pk_jobgrade' || itemkey=='pk_jobrank'){
                    return this.postRefParams;
                }
                return "";
            },
            refTrigger(type, event){
                if(event.key=="newpk_org"){
                    this.orgTrigger(type, event);
                }else if(event.key=="newpk_dept"){
                    this.deptTrigger(type, event);
                }else if(event.key=="newpk_post"){
                    this.postTrigger(type, event);
                }else if(event.key=="newpk_job"){
                    this.jobTrigger(type, event);
                }else if(event.key=="newpk_jobgrade"){
                    this.jobGradeTrigger(type, event);
                }
            },
            isDataType(fldtype){
                return fldtype == 3 || fldtype == 20 || fldtype == 101 || fldtype == 102;
            },
            isTextType(fldtype){
                return fldtype == 0 || fldtype == 1 || fldtype == 2 || fldtype == 14 || fldtype == 16 || fldtype == 18;
            },
            show(pk_psnjob, trial_type){
                this.trial_type = trial_type;
                this.pk_psnjob = pk_psnjob;
                this.initData(pk_psnjob, trial_type);
            },
            initData(pk_psnjob, trial_type){
                var url = '/hrtrn/regmng/apply/addinit?pk_psnjob=' + pk_psnjob + '&probationType=' + trial_type + '&isZz=true';
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.dialogVisible = true;
                            this.itemTemplate = res.data.itemTemplate;
                            this.$nextTick(function () {
                                this.$refs.zzRef.setFormData(res.data.data);
                                this.hi_regapply = JSON.parse(JSON.stringify(res.data.data));
                                this.pk_hi_regapply = res.data.data.pk_hi_regapply;
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
            validateChildItem(){
                this.$refs.zzDetailRef.validate(valid2 => {
                });
            },

            handleCommit(){
                var hasError = false;
                this.$refs.zzRef.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
                this.$refs.zzDetailRef.validate(valid2 => {
                    if (!valid2) {
                        hasError = true;
                    }
                });
                if (!hasError) {
                    this.handleRealCommit();
                }
            },
            handleRealCommit(){
                let data = this.$refs.zzRef.getFormData();
                let myself = this;
                data.status = 2;
                for (var item in this.hi_regapply) {
                    if (item.indexOf("new") == 0) {
                        data[item] = this.hi_regapply[item];
                    }
                }
                //如果试用结果不是转正，则结束日期变为初始默认值
                if(data.trialresult != 1){
                    data.end_date = this.hi_regapply.end_date;
                }
                this.$http({
                    url: "/hrtrn/regmng/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/1");
                            });
                        } else {
                            if (res.data.saveResult) {
                                this.dialogVisible = false;
                                this.$nextTick(function () {
                                    myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/1");
                                });
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }else{
                                this.$alert(res.data.msg, '提交失败', {
                                    confirmButtonText: '确定',
                                    type:'error',
                                });
                            }

                        }
                    })
                    .catch(() => {
                        this.$alert('提交失败', '提交失败', {
                            confirmButtonText: '确定',
                            type:'error',
                        });
                    });
            },
            handleCancel(){
                this.dialogVisible = false;
            },
            handleSave() {
                var hasError = false;
                this.$refs.zzRef.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
                this.$refs.zzDetailRef.validate(valid2 => {
                    if (!valid2) {
                        hasError = true;
                    }
                });
                if (!hasError) {
                    this.handleRealSave();
                }
            },
            // 基本信息保存按钮操作
            handleRealSave() {
                let data = this.$refs.zzRef.getFormData();
                data.approve_state = -1;

                for (var item in this.hi_regapply) {
                    if (item.indexOf("new") == 0) {
                        data[item] = this.hi_regapply[item];
                    }
                }
                //如果试用结果不是转正，则结束日期变为初始默认值
                if(data.trialresult != 1){
                    data.end_date = this.hi_regapply.end_date;
                }
                let myself = this;
                this.$http({
                    url: "/hrtrn/regmng/apply/insert",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/1");
                            });

                        } else {
                            this.$alert(res.data.msg, '保存失败', {
                                confirmButtonText: '确定',
                                type:'error',
                            });
                        }
                    })
                    .catch(() => {
                        this.$alert('保存失败', '保存失败', {
                            confirmButtonText: '确定',
                            type:'error',
                        });
                    });
            },

            // 组织变化的触发事件
            orgTrigger: function () {
                // 选择组织后，清空部门、岗位、职务、职级、职等
                this.hi_regapply.newpk_dept = "";
                this.hi_regapply.newpk_post = "";
                this.hi_regapply.newpk_job = "";
                this.hi_regapply.newpk_jobgrade = "";
                this.hi_regapply.newpk_jobrank = "";
            },
            deptTrigger: function () {
                // 选择部门后，清空岗位、职务、职级、职等
                this.hi_regapply.newpk_post = "";
                this.hi_regapply.newpk_job = "";
                this.hi_regapply.newpk_jobgrade = "";
                this.hi_regapply.newpk_jobrank = "";
            },
            // 岗位变化
            postTrigger: function () {
                // 选择岗位后，清空职务、职级、职等
                this.hi_regapply.newpk_job = "";
                this.hi_regapply.newpk_jobgrade = "";
                this.hi_regapply.newpk_jobrank = "";

                // 触发岗位联动
                this.setDefaultDataByPost(this.hi_regapply.newpk_post);
            },
            jobTrigger: function () {
                let pk_post = this.hi_regapply.newpk_post;
                let pk_job = this.hi_regapply.newpk_job;
                // 选择职务后，清空职级、职等
                this.hi_regapply.newpk_jobgrade = "";
                this.hi_regapply.newpk_jobrank = "";
                if (pk_job) {
                    this.setDefaultDataByJob(pk_job);
                } else {
                    this.setDefaultDataByPost(pk_post);
                }
            },
            jobGradeTrigger: function () {
                // 选择职级后，清空职等重新选择
                this.hi_regapply.newpk_jobrank = "";
            },
            setDefaultDataByPost: function (pk_post) {
                if (pk_post) {
                    this.$http({
                        url: "/hrjf/postJoin/findPostInfo/" + pk_post,
                        method: "get"
                    }).then(res => {
                        if (res.data.status === true) {
                            let defaultData = res.data.data[0];
                            if (!this.hi_regapply.beanMap) {
                                this.hi_regapply.beanMap = defaultData.beanMap;
                            }
                            if (defaultData.pk_job) {
                                this.hi_regapply.newpk_job = defaultData.pk_job;
                                this.hi_regapply.beanMap.newpk_job_ref = defaultData.beanMap.pk_job_ref;

                                // 当岗位和职务同时存在的时候，职务优先
                                this.setDefaultDataByJob(defaultData.pk_job);
                            } else {
                                if (defaultData.pk_joblevel) {
                                    this.hi_regapply.newpk_jobgrade = defaultData.pk_joblevel;
                                    this.hi_regapply.beanMap.newpk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                }
                                if (defaultData.defaultrank) {
                                    this.hi_regapply.newpk_jobrank = defaultData.defaultrank;
                                    this.hi_regapply.beanMap.newpk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                                }
                            }
                        } else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                    }).catch(() => {
                        this.$message({message: "查询岗位信息失败！", type: "error"});
                    });
                }
            },

            // 根据职务获取变量
            setDefaultDataByJob: function (pk_job) {
                if (pk_job) {
                    this.$http({
                        url: "/hrjf/jobJoin/findJobLevelRank/" + pk_job,
                        method: "get"
                    }).then(res => {
                        if (res.data.status === true) {
                            let defaultData = res.data.data;
                            if (!this.hi_regapply.beanMap) {
                                this.hi_regapply.beanMap = defaultData.beanMap;
                            }
                            if (defaultData.pk_joblevel) {
                                this.hi_regapply.newpk_jobgrade = defaultData.pk_joblevel;
                                this.hi_regapply.beanMap.newpk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                            }
                            if (defaultData.defaultrank) {
                                this.hi_regapply.newpk_jobrank = defaultData.defaultrank;
                                this.hi_regapply.beanMap.newpk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                            }
                        } else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                    }).catch(() => {
                        this.$message({message: "查询职务信息失败！", type: "error"});
                    });
                }
            },
        }
    };
</script>
<style>

    #zzDialogTemplate form>div{
        padding-left:0px !important;
    }
    #zzchild {
        /*padding-right: 50px;*/
    }

    #el-templatehrtrn_regapply_zz_dialog .el-form-item {
        padding-left: 0px !important;
    }

    #zzchild .iconright {
        color: #5CB0E6;
        line-height: 34px;
    }
    #zzchild .el-form-item__cover,
    #zzchild .el-form-item__error {
        width: 45.83333%;
        left: 54.16666%;
    }
    #zzchild .arrow{
        text-align: center;
        height:32px;
    }
</style>
