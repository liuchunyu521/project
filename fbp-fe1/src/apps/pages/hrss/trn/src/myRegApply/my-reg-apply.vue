<template>
    <ifbp-page>
        <ifbp-breadcrumb name="转正申请"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
                <ifbp-panel title="" :icons="[]" class="titleLine" v-show="noData==1" id="myregapplynodata">
                    <div class="no-data-container">
                        <div class="ifbp-icon-search no-data-icon"></div>
                        <div class="tip-content">您不是试用期员工，不需要转正!</div>
                    </div>
                </ifbp-panel>

                <!-- 主表编辑页签 -->
                <ifbp-panel title="基本信息" :icons="[]" class="titleLine" v-show="noData==0">
                    <ifbp-template ref="zzRef"
                                   tpl-id="hrss_myRegApply"
                                   :tpl-data="regapplyData"
                                   :tpl-reset-fun="tableFormResetFun"
                                   :methods="childFormMethods">
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel title="转正信息" :icons="[]" v-show="noData==0">
                    <el-form ref="zzDetailRef" :rules="rules" label-width="150px" id="myzzchildinfo"
                             :model="hi_regapply">
                        <el-form-item label="">
                            <el-col :span="11">
                                <span class="prezzinfo">试用期信息</span>
                            </el-col>
                            <el-col class="line arrow" :span="2">
                                &nbsp;
                            </el-col>
                            <el-col :span="11">
                                <span class="postzzinfo">转正后信息</span>
                            </el-col>
                        </el-form-item>

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

                    </el-form>
                </ifbp-panel>

                <ifbp-panel title="附件" :icons="[]" v-show="noData==0">
                    <ifbp-upload busi-code="60090regapply" force-type="normal" :pk-busi="hi_regapply.pk_hi_regapply"></ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer v-if="noData==0">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleSave" type="primary">保存</el-button>
            <el-button @click="handleCommit" type="primary">提交</el-button>
        </ifbp-footer>
    </ifbp-page>
</template>

<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        props: [],
        data() {
            return {
                regapplyData: {
                    hi_regapply: {},
                    rules: {},
                },
                hi_regapply: {},
                itemTemplate:[],
                rules: {
                },
                pk_hi_regapply:'',
                // -1:状态未知  0：没有数据  1：有数据
                noData:-1,
                //模板控件里的method内容
                childFormMethods: {
                },

                tableFormResetFun($node) {
                    $node.find("el-form").attr("label-width", "150px");
                    return $node[0].outerHTML;
                },
            };
        },
        watch: {
        },
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
            }
        },
        mounted() {
            this.initData();
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
                debugger;
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
            ifbpPageInit(){
                this.initData();
            },
            initData(){
                var url = '/hrss/regmng/apply/myApplyInit' ;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            if(res.data.approveState==0){
//                                var itemsetClone = JSON.parse(JSON.stringify(this.itemset));
//                                for(var key in res.data.itemset){
//                                    itemsetClone[key] = res.data.itemset[key];
//                                }
//                                this.itemset = itemsetClone;
                                this.$refs.zzRef.setFormData(res.data.data);
                                this.hi_regapply = JSON.parse(JSON.stringify(res.data.data));
                                this.pk_hi_regapply = res.data.data.pk_hi_regapply;
                                this.noData = 0;
                                this.itemTemplate = res.data.itemTemplate;
                            }else{
                                this.pk_hi_regapply = res.data.pk_hi_regapply;
                                this.$router.push("/hrtrn/regapply/applydetail/" + this.pk_hi_regapply + "/false/1?funcode=60090regapply");
                            }
                        } else {
                            this.noData = 1;
                            if(!res.data.noData){
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
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
                this.$refs.zzDetailRef.validate(valid2 => {});
            },
//            setRules(){
//                this.rules= new Object();
//
//                for(var key in this.itemset) {
//                    if(key.indexOf("must") != key.length-4 || !this.itemset[key]){
//                        continue;
//                    }
//                    var realKey = key.substring(0, key.length-4);
//                    var title="";
//                    var label = $("#zzchild label[for='" + realKey + "']");
//                    if(label.length != 0){
//                        title = label.attr("title");
//                    }
//                    this.rules[realKey] = [{"trigger":"blur","message":"请输入" + title,"required":true}];
//                }
//
//            },

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
                if(!hasError){
                    this.handleRealCommit();
                }
            },
            handleRealCommit(){
                let data = this.$refs.zzRef.getFormData();
                let myself = this;
                data.status = 2;
                for(var item in this.hi_regapply){
                    if(item.indexOf("new") == 0){
                        data[item] = this.hi_regapply[item];
                    }
                }
                this.$http({
                    url: "/hrss/regmng/apply/commit" ,
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$nextTick(function(){
                                myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/1?funcode=60090regapply");
                            });
                        } else {
                            if(res.data.saveResult){
                                this.$nextTick(function(){
                                    myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/1?funcode=60090regapply");
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
                this.$context.getApp().back();
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
                if(!hasError){
                    this.handleRealSave();
                }
            },
            // 基本信息保存按钮操作
            handleRealSave() {
                let data = this.$refs.zzRef.getFormData();
                data.approve_state=-1;

                for(var item in this.hi_regapply){
                    if(item.indexOf("new") == 0){
                        data[item] = this.hi_regapply[item];
                    }
                }
                let myself = this;
                this.$http({
                    url: "/hrss/regmng/apply/insert" ,
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$nextTick(function(){
                                myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/1?funcode=60090regapply");
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
            }
        }
    };
</script>
<style>
    #myzzchildinfo .prezzinfo,
    #myzzchildinfo .postzzinfo {
        font-size: 16px;
        color: #5CB0E6;
        letter-spacing: 0;
        text-align: right;
        line-height: 16px;
    }
    #myzzchildinfo {
        max-width: 900px;
        padding-left: 30px;
    }
    #myzzchildinfo .iconright {
        color: #5CB0E6;
        line-height: 34px;
    }
    #myzzchildinfo .el-form-item__cover,
    #myzzchildinfo .el-form-item__error {
        width: 45.83333%;
        left: 54.16666%;
    }
    /*#myzzchildinfo .el-form-item__error:before {*/
        /*content: "";*/
        /*display: inline-block;*/
        /*width: 54.16666%;*/
    /*}*/


    #myregapplynodata .no-data-container{
        padding:64px 0px;
        text-align:center;
        color: rgb(191, 191, 191);
    }
    #myregapplynodata .no-data-icon{
        font-size: 92px;
        padding-bottom: 36px;
    }
    #myregapplynodata .tip-content{
        font-size:20px;
    }
    #myzzchildinfo .arrow{
        text-align: center;
        height:32px;
    }
</style>
