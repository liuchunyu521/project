<template>
    <ifbp-page>
        <ifbp-breadcrumb name="离职申请"></ifbp-breadcrumb>
        <!-- 主体区域 -->
            <el-row :gutter="16" v-if="showType==1" id="dimission-type-list">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in trnstypeuivos">
                    <div class="dimission-type-item" style="" @click="clickType(item)">
                        <div class="img-container"><span class="default" :class="{lixiu:item.pk_trnstype=='1002Z710000000008GSV',tuixiu:item.pk_trnstype=='1002Z710000000008GSW',cizhi:item.pk_trnstype=='1002Z710000000008GSX',citui:item.pk_trnstype=='1002Z710000000008PAW',shengu:item.pk_trnstype=='1002Z710000000008GSZ'}"></span></div>
                        <div class="name-container"><span>{{item.trnstypename.indexOf("申请") > -1 ? item.trnstypename : item.trnstypename + "申请"}}</span></div>
                    </div>
                </el-col>
            </el-row>
        <ifbp-main-area type="detail" v-if="showType==2">
            <ifbp-panel-group :navbar="false">
                <!-- 主表编辑页签 -->
                <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
                    <ifbp-template ref="lzRef"
                                   tpl-id="hrss_myDimissionApply"
                                   :tpl-data="dimissionData"
                                   :tpl-reset-fun="tableFormResetFun"
                                   :methods="childFormMethods">
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel title="离职信息" :icons="[]" v-if="itemTemplate && itemTemplate.length > 0">
                    <el-form  ref="lzDetailRef" :rules="rules" label-width="150px" id="mylzchildinfo"
                             :model="stapply">
                        <el-form-item label="">
                            <el-col :span="11">
                                <span class="prezzinfo">离职前信息</span>
                            </el-col>
                            <el-col class="line arrow" :span="2">
                                &nbsp;
                            </el-col>
                            <el-col :span="11">
                                <span class="postzzinfo">离职后信息</span>
                            </el-col>
                        </el-form-item>

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
                    </el-form>
                </ifbp-panel>

                <ifbp-panel title="附件" :icons="[]">
                    <ifbp-upload busi-code="60090dimissionapply" force-type="normal" :pk-busi="stapply.pk_hi_stapply"></ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer  v-if="showType==2">
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
            var vm = this;
            return {
                showCnt:0,
                dimissionData: {
                    stapply: {},
                    rules: {},
                },
                showType:0,
                itemTemplate:[],
                trnstypeuivos:[],
                pk_hi_stapply: '',
                rules: {},
//                itemset: {
//                    pk_hi_orgmust: false,
//                    pk_hi_orgshow: false,
//                    newpk_orgmust: false,
//                    newpk_orgshow: false,
//                    newpk_deptmust: false,
//                    newpk_deptshow: false,
//                    newpk_postmust: false,
//                    newpk_postshow: false,
//                    newpk_postseriesmust: false,
//                    newpk_postseriesshow: false,
//                    newpk_jobmust: false,
//                    newpk_jobshow: false,
//                    newpk_jobgrademust: false,
//                    newpk_jobgradeshow: false,
//                    newpk_jobrankmust: false,
//                    newpk_jobrankshow: false,
//                    newpk_psnclmust: false,
//                    newpk_psnclshow: false,
//                    newdeposemodemust: false,
//                    newdeposemodeshow: false,
//                    newjobmodemust: false,
//                    newjobmodeshow: false,
//                    newmemomust: false,
//                    newmemoshow: false,
//                    newoccupationmust: false,
//                    newoccupationshow: false,
//                    newpk_job_typemust: false,
//                    newpk_job_typeshow: false,
//                    newpoststatmust: false,
//                    newpoststatshow: false,
//                    newseriesmust: false,
//                    newseriesshow: false,
//                    newworktypemust: false,
//                    newworktypeshow: false,
//                    pk_hrcm_orgmust: false,
//                    pk_hrcm_orgshow: false,
//                },
                stapply: {},
                oprinfo: {
                    trnstypename: '',
                },
                pk_psnjob: '',
                //模板控件里的method内容
                childFormMethods: {},

                tableFormResetFun($node) {
                    $node.find("el-form").attr("label-width", "150px");
                    return $node[0].outerHTML;
                },
            };
        },
        watch: {},

        mounted() {
            this.initTypeData();
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
            }
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
                this.initTypeData();
            },
            initTypeData(){
                var url = '/hrss/dimission/apply/myApplyInit';
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            if(res.data.approveState == 0){
                                this.trnstypeuivos = res.data.trnstypes;
                                this.pk_psnjob = res.data.pk_psnjob;
                                this.showType = 1;
                            }else{
                                this.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + res.data.pk_hi_stapply + "/false?funcode=60090dimissionapply");
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
            clickType(item){
                this.initData(this.pk_psnjob, item.pk_trnstype);
            },
            initData(pk_psnjob, pk_trnstype){
                var url = '/hrss/dimission/apply/addinit?pk_psnjob=' + pk_psnjob + '&trnstype=' + pk_trnstype + '&ishrssbill=true';
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.showType = 2;
                            this.$nextTick(function () {
//                                var itemsetClone = JSON.parse(JSON.stringify(this.itemset));
//                                for(var key in itemsetClone){
//                                    itemsetClone[key] = false;
//                                }
//                                for (var key in res.data.itemset) {
//                                    itemsetClone[key] = res.data.itemset[key];
//                                }
//                                this.itemset = itemsetClone;
                                this.$refs.lzRef.setFormData(res.data.data);
                                this.stapply = JSON.parse(JSON.stringify(res.data.data));
                                this.pk_hi_stapply = res.data.data.pk_hi_stapply;
                                this.itemTemplate = res.data.itemTemplate;
                                this.showCnt = !!this.itemTemplate ? this.itemTemplate.length : 0;
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
                if(this.showCnt > 0){
                    this.$refs.lzDetailRef.validate(valid2 => {
                    });
                }
            },

            handleCommit(){
                var hasError = false;
                this.$refs.lzRef.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });
                if(this.showCnt > 0){
                    this.$refs.lzDetailRef.validate(valid2 => {
                        if (!valid2) {
                            hasError = true;
                        }
                    });
                }
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
                    url: "/hrss/dimission/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.$refs.lzRef.clearEdit();
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + myself.pk_hi_stapply + "/false?funcode=60090dimissionapply");
                            });
                        } else {
                            if(res.data.saveResult){
                                this.$nextTick(function () {
                                    myself.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + myself.pk_hi_stapply + "/false?funcode=60090dimissionapply");
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
                this.showType=1;
            },
            handleSave() {
                var hasError = false;
                this.$refs.lzRef.validate(valid => {
                    if (!valid) {
                        hasError = true;
                    }
                });

                if(this.showCnt > 0){
                    this.$refs.lzDetailRef.validate(valid2 => {
                        if (!valid2) {
                            hasError = true;
                        }
                    });
                }
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
                    url: "/hrss/dimission/apply/insert",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$refs.lzRef.clearEdit();
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + myself.pk_hi_stapply + "/false?funcode=60090dimissionapply");
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
            },
        }
    };
</script>
<style>
    #dimission-type-list .dimission-type-item{
        height:114px;
        background-color:white;
        /*border: 1px solid #E6E6EB;*/
        border: 1px solid white;
        border-radius: 4px;
        box-sizing: border-box;
        margin-bottom: 16px;
        cursor: pointer;
        position:relative;
    }
    #dimission-type-list .dimission-type-item:hover {
        background-color: #e9f7fc;
        border: 1px solid #6bcaea;
    }
    #dimission-type-list .img-container{
        display: inline-block;
        padding: 32px;
        float:left;
    }
    #dimission-type-list .img-container span{
        font-size: 48px;
        line-height: 48px;
        font-family:ifbp-icons!important;
        -webkit-font-smoothing: antialiased;

    }
    #dimission-type-list .img-container .default:before{
        content: "\e955";
        color: #6FB4FF;
    }
    #dimission-type-list .img-container .lixiu:before{
        content: "\e9b5" !important;
        color: #6FB4FF !important;
    }
    #dimission-type-list .img-container .tuixiu:before{
        content: "\e924" !important;
        color: #FFCC00 !important;
    }
    #dimission-type-list .img-container .cizhi:before{
        content: "\e9b6" !important;
        color: #7FD3A9 !important;
    }
    #dimission-type-list .img-container .citui:before{
        content: "\e9ba" !important;
        color: #FF6161 !important;
    }
    #dimission-type-list .img-container .shengu:before{
        content: "\e9a4" !important;
        color: #7FD3A9 !important;
    }
    #dimission-type-list .name-container{
        display:inline-block;
        padding:48px 0px;
        float:left;
        width: calc(100% - 120px);
    }
    #dimission-type-list .name-container span{
        font-size: 16px;
        color: #333333;
        line-height: 16px;
        overflow: hidden;
        line-height: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        display: inline-block;
    }

    #mylzchildinfo .prezzinfo,
    #mylzchildinfo .postzzinfo {
        font-size: 16px;
        color: #5CB0E6;
        letter-spacing: 0;
        text-align: right;
        line-height: 16px;

    }
    #mylzchildinfo {
        max-width: 900px;
        padding-left: 30px;
    }
    #mylzchildinfo .iconright {
        color: #5CB0E6;
        line-height: 34px;
    }
    #mylzchildinfo .el-form-item__cover,
    #mylzchildinfo .el-form-item__error {
        width: 45.83333%;
        left: 54.16666%;
    }
    #mylzchildinfo .arrow{
        text-align: center;
        height:32px;
    }
</style>
