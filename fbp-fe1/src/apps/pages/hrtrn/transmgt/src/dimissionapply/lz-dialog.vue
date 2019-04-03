<template>
    <el-dialog :title="oprinfo.trnstypename" v-model="dialogVisible" size="small">
        <div id="lzDialogTemplate">
            <ifbp-template ref="lzRef"
                           style="margin-top: 0px;"
                       tpl-id="hrtrn_dimissionapply_lz_dialog"
                       :tpl-data="dimissionData"
                       :tpl-reset-fun="tableFormResetFun"
                       :methods="childFormMethods">
            </ifbp-template>
        </div>
        <el-form ref="lzDetailRef" :rules="rules" label-width="100px" id="lzchild"
                 :model="stapply">
            <el-form-item :label="item.itemname" :prop="item.newitemkey" :required="item.ismustnotnull" v-for="(item,index) in itemTemplate">
                <el-col :span="11">
                    <el-ref max="20" :editable="true" :disabled="true" v-model="stapply[item.olditemkey]" :field="item.olditemkey"
                            :template-value="stapply" v-if="item.fldtype == 5"
                            :ref-code="item.refcode"></el-ref>
                    <el-checkbox max="1" :editable="true" :disabled="true" v-model="stapply[item.olditemkey]" v-if="item.fldtype == 4"></el-checkbox>
                    <el-date-picker type="date" max="10" :editable="true" :disabled="true" v-model="stapply[item.olditemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
                    <el-input :editable="true" :disabled="true" v-model="stapply[item.olditemkey]"  v-if="isTextType(item.fldtype)"></el-input>
                </el-col>
                <el-col class="line arrow" :span="2">
                    <i class="ifbp-icon-right iconright"></i>
                </el-col>
                <el-col :span="11">
                    <el-ref max="20" :editable="true" @change="validateChildItem" v-model="stapply[item.newitemkey]"
                            :field="item.newitemkey" :template-value="stapply" :query-params="getQueryParams(item.itemkey)"
                            :ref-code="item.refcode" :not-leaf-selectable="!item.ref_leaf_flag" @trigger="refTrigger" v-if="item.fldtype == 5"></el-ref>
                    <el-checkbox max="1" :editable="true" @change="validateChildItem"
                                 v-model="stapply[item.newitemkey]" v-if="item.fldtype == 4"></el-checkbox>
                    <el-date-picker type="date" max="10" :editable="true" @change="validateChildItem" v-model="stapply[item.newitemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
                    <el-input :editable="true" @change="validateChildItem" v-model="stapply[item.newitemkey]"  v-if="isTextType(item.fldtype)"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="附件">
                <ifbp-upload busi-code="60090dimissionapply" force-type="normal" file-class="new" :is-show-title="false"
                             :pk-busi="stapply.pk_hi_stapply"></ifbp-upload>
            </el-form-item>
        </el-form>
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
                dimissionData: {
                    stapply: {},
                    rules: {},
                },
                itemTemplate:[],
                pk_hi_stapply: '',
                rules: {},
                stapply: {},
                oprinfo: {
                    trnstypename: '',
                },
                pk_psnjob: '',
                //模板控件里的method内容
                childFormMethods: {},

                tableFormResetFun($node) {
                    return $node[0].outerHTML;
                },
            };
        },
        watch: {},
        mounted() {
        },
        computed: {
            deptRefParams: function () {
                return {
                    pk_org: this.stapply.newpk_org
                };
            },
            postRefParams: function () {
                return {
                    pk_org: this.stapply.newpk_org,
                    pk_dept: this.stapply.newpk_dept,
                    pk_post: this.stapply.newpk_job ? "" : this.stapply.newpk_post,
                    pk_job: this.stapply.newpk_job,
                    pk_joblevel: this.stapply.newpk_jobgrade
                };
            },
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
            show(pk_psnjob, oprinfo){
                this.pk_psnjob = pk_psnjob;
                this.oprinfo = oprinfo;
                this.initData(pk_psnjob, oprinfo.pk_trnstype);
            },
            initData(pk_psnjob, pk_trnstype){
                var url = '/hrtrn/dimission/apply/addinit?pk_psnjob=' + pk_psnjob + '&trnstype=' + pk_trnstype;
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
                                this.$refs.lzRef.setFormData(res.data.data);
                                this.stapply = JSON.parse(JSON.stringify(res.data.data));
                                this.pk_hi_stapply = res.data.data.pk_hi_stapply;
                            });
                        } else {
                            this.dialogVisible = false;
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.dialogVisible = false;
                        this.$message({
                            message: "页面初始化失败",
                            type: "error"
                        });
                    });

            },

            validateChildItem(){
                this.$refs.lzDetailRef.validate(valid2 => {
                });
            },

            handleCommit(){
                var hasError = false;
                this.$refs.lzRef.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
                this.$refs.lzDetailRef.validate(valid2 => {
                    if (!valid2) {
                        hasError = true;
                    }
                });
                if (!hasError) {
                    this.handleRealCommit();
                }
            },
            handleRealCommit(){
                let data = this.$refs.lzRef.getFormData();
                let myself = this;
                data.status = 2;
                for (var item in this.stapply) {
                    if (item.indexOf("new") == 0 || item == "pk_hi_org" || item == "pk_hrcm_org") {
                        data[item] = this.stapply[item];
                    }
                }
                this.$http({
                    url: "/hrtrn/dimission/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + myself.pk_hi_stapply + "/false");
                            });
                        } else {
                            if(res.data.saveResult){
                                this.dialogVisible = false;
                                this.$nextTick(function () {
                                    myself.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + myself.pk_hi_stapply + "/false");
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
                var hasError = false;
                this.$refs.lzRef.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
                this.$refs.lzDetailRef.validate(valid2 => {
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

                let data = this.$refs.lzRef.getFormData();
                for (var item in this.stapply) {
                    if (item.indexOf("new") == 0 || item == "pk_hi_org" || item == "pk_hrcm_org") {
                        data[item] = this.stapply[item];
                    }
                }
                data.approve_state = -1;
                let myself = this;
                this.$http({
                    url: "/hrtrn/dimission/apply/insert",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + myself.pk_hi_stapply + "/false");
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

            // 组织变化的触发事件
            orgTrigger: function () {
                // 选择组织后，清空部门、岗位、职务、职级、职等
                this.stapply.newpk_dept = "";
                this.stapply.newpk_post = "";
                this.stapply.newpk_job = "";
                this.stapply.newpk_jobgrade = "";
                this.stapply.newpk_jobrank = "";
            },
            deptTrigger: function () {
                // 选择部门后，清空岗位、职务、职级、职等
                this.stapply.newpk_post = "";
                this.stapply.newpk_job = "";
                this.stapply.newpk_jobgrade = "";
                this.stapply.newpk_jobrank = "";
            },
            // 岗位变化
            postTrigger: function () {
                // 选择岗位后，清空职务、职级、职等
                this.stapply.newpk_job = "";
                this.stapply.newpk_jobgrade = "";
                this.stapply.newpk_jobrank = "";

                // 触发岗位联动
                this.setDefaultDataByPost(this.stapply.newpk_post);
            },
            jobTrigger: function () {
                let pk_post = this.stapply.newpk_post;
                let pk_job = this.stapply.newpk_job;
                // 选择职务后，清空职级、职等
                this.stapply.newpk_jobgrade = "";
                this.stapply.newpk_jobrank = "";
                if (pk_job) {
                    this.setDefaultDataByJob(pk_job);
                } else {
                    this.setDefaultDataByPost(pk_post);
                }
            },
            jobGradeTrigger: function () {
                // 选择职级后，清空职等重新选择
                this.stapply.newpk_jobrank = "";
            },
            setDefaultDataByPost: function (pk_post) {
                if (pk_post) {
                    this.$http({
                        url: "/hrjf/postJoin/findPostInfo/" + pk_post,
                        method: "get"
                    }).then(res => {
                        if (res.data.status === true) {
                            let defaultData = res.data.data[0];
                            if (!this.stapply.beanMap) {
                                this.stapply.beanMap = defaultData.beanMap;
                            }
                            if (defaultData.pk_job) {
                                this.stapply.newpk_job = defaultData.pk_job;
                                this.stapply.beanMap.newpk_job_ref = defaultData.beanMap.pk_job_ref;

                                // 当岗位和职务同时存在的时候，职务优先
                                this.setDefaultDataByJob(defaultData.pk_job);
                            } else {
                                if (defaultData.pk_joblevel) {
                                    this.stapply.newpk_jobgrade = defaultData.pk_joblevel;
                                    this.stapply.beanMap.newpk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                                }
                                if (defaultData.defaultrank) {
                                    this.stapply.newpk_jobrank = defaultData.defaultrank;
                                    this.stapply.beanMap.newpk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
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
                            if (!this.stapply.beanMap) {
                                this.stapply.beanMap = defaultData.beanMap;
                            }
                            if (defaultData.pk_joblevel) {
                                this.stapply.newpk_jobgrade = defaultData.pk_joblevel;
                                this.stapply.beanMap.newpk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                            }
                            if (defaultData.defaultrank) {
                                this.stapply.newpk_jobrank = defaultData.defaultrank;
                                this.stapply.beanMap.newpk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                            }
                        } else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                    }).catch(() => {
                        this.$message({message: "查询职务信息失败！", type: "error"});
                    });
                }
            }
        }
    };
</script>
<style>
    #lzDialogTemplate form>div{
        padding-left:0px !important;
    }
    #lzchild {
        /*padding-right: 50px;*/
    }
    #el-templatehrtrn_dimissionapply_lz_dialog .el-form-item {
        padding-left: 0px !important;
    }
    #lzchild .iconright {
        color: #5CB0E6;
        line-height: 34px;
    }
    #lzchild .el-form-item__cover,
    #lzchild .el-form-item__error {
        width: 45.83333%;
        left: 54.16666%;
    }
    #lzchild .arrow{
        text-align: center;
        height:32px;
    }

</style>
