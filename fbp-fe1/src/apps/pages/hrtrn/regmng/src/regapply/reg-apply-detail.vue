<template>
    <ifbp-page>
        <ifbp-breadcrumb name="转正申请单"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">

                <initiateFlow ref="initfolwRef" class="fl" :billId="pk_hi_regapply" billType="6111"
                              :showBtn='!isEdit' @isRecall="getIsRecall" agentuserId="" @afterAction="afterAction"></initiateFlow>

                <!-- 主表编辑页签 -->
                <ifbp-panel title="基本信息" :icons="[]" class="titleLine" v-show="tplid!=''">
                    <ifbp-template ref="ref_regapply_c"
                                   :tpl-id="tplid"
                                   :tplData="regapplyData"
                                   :editable="isEdit"
                                   :tplResetFun="regapplyFormResetFun"
                                   :form-show-message="isEdit"
                                   :methods="regapplyFormMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel title="转正信息" :icons="[]">
                    <el-form ref="ref_regapply_detail_c" :rules="rules" label-width="150px" id="zzchildinfo"
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
                                <el-ref max="20" :editable="isEdit" :disabled="true" v-model="hi_regapply[item.olditemkey]" :field="item.olditemkey"
                                        :template-value="hi_regapply" v-if="item.fldtype == 5"
                                        :ref-code="item.refcode"></el-ref>
                                <el-checkbox max="1" :editable="isEdit" :disabled="true" v-model="hi_regapply[item.olditemkey]" v-if="item.fldtype == 4"></el-checkbox>
                                <el-date-picker type="date" max="10" :editable="isEdit" :disabled="true" v-model="hi_regapply[item.olditemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
                                <el-input :editable="isEdit" :disabled="true" v-model="hi_regapply[item.olditemkey]"  v-if="isTextType(item.fldtype)"></el-input>
                            </el-col>
                            <el-col class="line arrow" :span="2">
                                <i class="ifbp-icon-right iconright"></i>
                            </el-col>
                            <el-col :span="11">
                                <el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="hi_regapply[item.newitemkey]"
                                        :field="item.newitemkey" :template-value="hi_regapply" :query-params="getQueryParams(item.itemkey)"
                                        :ref-code="item.refcode" :not-leaf-selectable="!item.ref_leaf_flag" @trigger="refTrigger" v-if="item.fldtype == 5"></el-ref>
                                <el-checkbox max="1" :editable="isEdit" @change="validateChildItem"
                                             v-model="hi_regapply[item.newitemkey]" v-if="item.fldtype == 4"></el-checkbox>
                                <el-date-picker type="date" max="10" :editable="isEdit" @change="validateChildItem" v-model="hi_regapply[item.newitemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
                                <el-input :editable="isEdit" @change="validateChildItem" v-model="hi_regapply[item.newitemkey]"  v-if="isTextType(item.fldtype)"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </ifbp-panel>

                <ifbp-panel title="附件" :icons="[]">
                    <ifbp-upload busi-code="60090regapply" force-type="normal" :pk-busi="hi_regapply.pk_hi_regapply"
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
            <el-button type="primary" @click="execHandle" v-if="hi_regapply.approve_state==1">执行</el-button>
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
    import pageModelMixin from "ifbp-business/pageModelMixin";
//    import printPre from "ifbp-business/printPre";
    import printPre from '../../../../../common/printPre.js';
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
                pk_hi_regapply: vm.$root.$router.currentRoute.params.id,
                isinitiateFlowShow: false,
                hasCommited: true,
                baseData:{},
                //单据VO的状态
                status: 2,//1,update;2,new;3,delete
                regapplyData: {
                    rules: {},
                },
                rules: {},
                hi_regapply: {},
                itemTemplate:[],
                trialresult: vm.$root.$router.currentRoute.params.trialresult,
                approveType: 0,
                regapplyFormResetFun($node) {
                    let $pk_psndoc_ref = $node.find("[prop='pk_psndoc']").children().first();
                    $pk_psndoc_ref.attr("v-show","editable");
                    let $psndoc_a = $('<a class="hr-form-a" href="javascript:void(0);" v-show="!editable" @click.stop="showPsnDetail()">{{hi_regapply.beanMap.pk_psndoc_ref[hi_regapply.pk_psndoc].name}}</a>');
                    $node.find("[prop='pk_psndoc']").append($psndoc_a);

                    return $node[0].outerHTML;
                },
                regapplyFormMethods: {
                    showPsnDetail(){
                        let pk = this.hi_regapply.pk_psndoc;
                        vm.$router.push("/hrhi/psninfo/dynamic/" + pk + "?funcode=60070psninfo");
                    },
                },

            };
        },
        mounted() {
            this.request();
        },
        computed: {
            editBtnIf:function(){
                return this.hi_regapply.approve_state!=1 && this.hi_regapply.approve_state!=0 && this.hi_regapply.approve_state!=102;
            },
            tplid: function () {
                return "hrtrn_regapply_detail_basic";
//                if (this.trialresult == 1) {
//                    return "hrtrn_regapply_detail_basic";
//                } else if (this.trialresult == 2) {
//                    return "hrtrn_regapply_detail_delay_basic";
//                } else if (this.trialresult == 3) {
//                    return "hrtrn_regapply_detail_nopass_basic";
//                }
//                return "";
            },
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
            getIsRecall(isrecall){
                if (isrecall) {
                      this.request();
                      this.$refs.initfolwRef.doParams();
                }
            },
            cancelHandle(){
                this.$refs.ref_regapply_c.setFormData(JSON.parse(JSON.stringify(this.baseData)));
                this.hi_regapply = JSON.parse(JSON.stringify(this.baseData));
                // 执行一次校验，去掉提示
                this.$nextTick(function () {
                    this.pageValidate();
                });
                this.isEdit = false;
            },
            // 获取数据
            request() {
                this.$http({
                    url: "/hrtrn/regmng/apply/getById/" + this.pk_hi_regapply,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_regapply_c.setFormData(res.data.data);
                            this.hi_regapply = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(res.data.data));
                            this.hasCommited = this.hi_regapply.approve_state != -1;
                            this.approveType = res.data.approveType;
                            this.isinitiateFlowShow = this.hi_regapply.approve_state != -1 && !!this.hi_regapply.approve_state;
                            this.trialresult = res.data.data.trialresult;
                            this.canEdit = res.data.canEdit;
                            this.itemTemplate = res.data.itemTemplate;
//                            if (res.data.data.trialresult == 1) {
//                                for (var key in res.data.itemset) {
//                                    this.itemset[key] = res.data.itemset[key];
//                                }
//                            }
//                            if (res.data.data.trialresult == 3) {
//                                this.isEdit = false;
//                            }
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
                    url: "/hrtrn/regmng/apply/canEdit/" + this.pk_hi_regapply,
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
                debugger;
                if (!this.pageValidate())return;
                let data = this.$refs.ref_regapply_c.getFormData();
//                if (this.trialresult == 1) {
                    for (var item in this.hi_regapply) {
                        if (item.indexOf("new") == 0) {
                            data[item] = this.hi_regapply[item];
                        }
                    }
//                }
                //如果试用结果不是转正，则结束日期变为初始默认值
                if(data.trialresult != 1){
                    data.end_date = this.hi_regapply.end_date;
                }
                this.$http({
                    url: "/hrtrn/regmng/apply/save",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.$refs.ref_regapply_c.setFormData(res.data.data);
                            this.hi_regapply = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(res.data.data));
                            this.hasCommited = this.hi_regapply.approve_state != -1;
                            this.isEdit = false;
                            this.$refs.ref_regapply_c.clearEdit();
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
                let data = this.$refs.ref_regapply_c.getFormData();
                if (this.isEdit) {
                    data.status = 1;
//                    if (this.trialresult == 1) {
                        for (var item in this.hi_regapply) {
                            if (item.indexOf("new") == 0) {
                                data[item] = this.hi_regapply[item];
                            }
                        }
//                    }
                    //如果试用结果不是转正，则结束日期变为初始默认值
                    if(data.trialresult != 1){
                        data.end_date = this.hi_regapply.end_date;
                    }
                } else {
                    data.status = 0;
                }
                this.$http({
                    url: "/hrtrn/regmng/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.$refs.ref_regapply_c.setFormData(res.data.data);
                            this.hi_regapply = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(res.data.data));
                            this.hasCommited = this.hi_regapply.approve_state != -1;
                            this.isinitiateFlowShow = true;
                            this.isEdit = false;
                            this.$refs.initfolwRef.doParams();
                            this.$refs.ref_regapply_c.clearEdit();
                        } else {
                            if(res.data.saveResult){
                                this.$refs.ref_regapply_c.setFormData(res.data.data);
                                this.hi_regapply = res.data.data;
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
                    this.execBill(true);
                }else{
                    this.request();
                }
            },
            execBill(checkBudget, date){
                debugger;
                this.$http({
                    url: "/hrtrn/regmng/apply/execBill",
                    method: "post",
                    params:{
                        pk:this.pk_hi_regapply,
                        pk_org:this.hi_regapply.pk_org,
                        checkBudget:checkBudget,
                        regularDate:date != null ? date.getTime() : null,
                    },
                })
                    .then(res => {
                        if (res.data.status === true) {
                            if(res.data.warn){
                                this.$confirm(res.data.msg, '提示', {
                                    confirmButtonText: '继续',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.execBill(false, date);
                                }).catch(() => {
                                });
                            }else{
                                if(res.data.msg){
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                }
                                this.request();
                            }
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
                this.execBill(true, this.effectDate);
            },
            // 上方模板和自定义的校验
            pageValidate: function () {
                debugger;
                var hasError = false;
//                if (this.trialresult == 3) {
//                    return true;
//                }
                this.$refs.ref_regapply_c.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
//                if (this.trialresult == 1) {
                    this.$refs.ref_regapply_detail_c.validate(valid => {
                        if (!valid) {
                            hasError = true;
                        }
                    });
//                }
                return !hasError;
            },

            validateChildItem(){
                this.$refs.ref_regapply_detail_c.validate(valid => {
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
            printTemplate:function () {
                let param = {
                    billid:this.pk_hi_regapply,
                };
                this.printPre("60090regapply", "RegApplyPrintTemp", param);
            },
        }
    };
</script>
<style>
    #zzchildinfo .prezzinfo,
    #zzchildinfo .postzzinfo {
        font-size: 16px;
        color: #5CB0E6;
        letter-spacing: 0;
        text-align: right;
        line-height: 16px;
    }
    #zzchildinfo {
        max-width: 900px;
        padding-left: 30px;
    }
    #zzchildinfo .iconright {
        color: #5CB0E6;
        line-height: 34px;
    }
    #zzchildinfo .el-form-item__cover,
    #zzchildinfo .el-form-item__error {
        width: 45.83333%;
        left: 54.16666%;
    }
    #zzchildinfo .arrow{
        text-align: center;
        height:32px;
    }
</style>
