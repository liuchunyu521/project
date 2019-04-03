<template>
    <ifbp-page>
        <ifbp-breadcrumb name="薪资方案详情"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="basePanel" title="基本信息" class="titleLine">
                    <ifbp-template ref="ref_waclass_c"
                                   tpl-id="headPanel"
                                   :tplData="waclassData"
                                   :editable="headEdit"
                                   :tplResetFun="waclassFormResetFun"
                                   :methods="waclassFormMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!-- 子表页签 -->
                <!--<ifbp-panel id="subPanel" title="计薪规则" :icons=showsubicons v-show="subshow">-->
                <ifbp-panel id="subPanel" title="计薪规则" v-show="subshow">
                    <ifbp-template ref="ref_waclassrang"
                                   tpl-id="waclassrang"
                                   :pk-temp="pk_tempsub"
                                   :tpl-data="waclassrangData"
                                   show-type="table"
                                   :editable="headEdit"
                                   :table-oper-vif="headEdit"
                                   :table-show-menu="false"
                                   :methods="waclassrangFormMethods"
                                   :tplResetFun="waclassrangResetFun"
                                   @delete-table-click="waclassrangDeleteClick"
                    >
                    </ifbp-template>
                    <el-button type="text" @click="addWaclassRang()" v-show="headEdit">新增</el-button>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer>

            <el-button @click="waclassCancel" v-if="headEdit">取消</el-button>
            <el-button type="primary" @click="waclassSave" v-if="headEdit">保存</el-button>
            <el-button type="primary" @click="waclassEdit" v-if="!headEdit">编辑</el-button>
            <!--<el-button  @click="waclassDelete" v-if="!headEdit">删除</el-button>-->
        </ifbp-footer>
    </ifbp-page>
</template>

<script>
    // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        data() {
            var vm = this;

            return {
                // 通过传入的参数判断是新增还是修改操作
                pk_wa_class: '',
                waclassBase: null,
                waclassRangs: null,
                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                // UI模板所需参数
                pk_tempform: "0001AA1000000000XQIJ",
                pk_tempsub: '0001AA1000000000NMPU',

                //单据VO的状态
                status: 2,//1,update;2,new;3,delete
                // 表头是否编辑
                headEdit: false,
                bodyShow: false,
                // 基础panel显示图标
                icons: [
                    {
                        icon: "edit",
                        click: function () {
                            vm.headEdit = !vm.headEdit;
                            vm.showicons = null;
                        },
                        showicon: false
                    }
                ],

                showicons: null,
                waclassData: {
                    rules: {
                        code: [{required: true, message: "编码不能为空", trigger: "blur"}],
                        name: [{required: true, message: "名称不能为空", trigger: "blur"}]
                    },
                    rangeruleshow: true,
                    addflagshow: true,
                    orgeditable: false
                },

                showsubicons: null,
                subicons: [{
                    icon: 'plus',
                    click: () => {
                        var tabledata = vm.$refs.ref_waclassrang.getTableData();
                        var formdata = {pk_org:'',pk_dept:'',pk_psncl:'',pk_jobgrade:'',pk_jobrank:'',pk_job:'',pk_post:'',pk_postseries:''};
                        var data;
                        if (tabledata == undefined || tabledata==null) {
                            data = [formdata];
                        } else {
                            data = tabledata;
                            data.push(formdata);
                        }
                        this.$refs.ref_waclassrang.setTableData(data);
                    }
                }],
                subshow: false,
                waclassrangData:{
                    bodyEdit:false,
                    RefOrgParams:{
                        pk_org:''
                    }
                },
                waclassrangResetFun($node) {

                    let $pk_org = $node.find("[prop='pk_org']");
                    $pk_org.attr('render-type', 'default');
                    $pk_org.html(
                        '<template scope="scope" >' +
                        '<el-ref :editable="bodyEdit" field="pk_org"  template-value="scope.row" ref-code="adminOrgGroupPowerRef" :not-leaf-selectable="true">' +
                        '</el-ref>' +
//                       '<span v-show="typeof(scope.row.pk_org) != undefined && scope.row.pk_org.length==0" style="color:#F00">任职组织不能为空</span>'+
                        '</template>'
                    );

                    let $pk_dept = $node.find("[prop='pk_dept']");
                    $pk_dept.attr('render-type', 'default');
                    $pk_dept.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_dept" :query-params="RefOrgParams"  :template-value="scope.row" ref-code="hrwebdeptref" :not-leaf-selectable="true">' +
                        '</el-ref>' +
//                         '<span v-show="typeof(scope.row.pk_dept) != undefined && scope.row.pk_dept.length==0" style="color:#F00">部门不能为空</span>'+
                        '</template>'
                    );

                    let $pk_psncl = $node.find("[prop='pk_psncl']");
                    $pk_psncl.attr('render-type', 'default');
                    $pk_psncl.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_psncl"  :template-value="scope.row" ref-code="psnclref">' +
                        '</el-ref>' +
//                        '<span v-show="typeof(scope.row.pk_psncl) != undefined && scope.row.pk_psncl.length==0" style="color:#F00">人员类别不能为空</span>'+
                        '</template>'
                    );

                    let $pk_jobgrade = $node.find("[prop='pk_jobgrade']");
                    $pk_jobgrade.attr('render-type', 'default');
                    $pk_jobgrade.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_jobgrade"  :template-value="scope.row" ref-code="jobRankRef">' +
                        '</el-ref>' +
//                        '<span v-show="typeof(scope.row.pk_jobgrade) != undefined && scope.row.pk_jobgrade.length==0" style="color:#F00">职等不能为空</span>'+
                        '</template>'
                    );

                    let $pk_jobrank = $node.find("[prop='pk_jobrank']");
                    $pk_jobrank.attr('render-type', 'default');
                    $pk_jobrank.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_jobrank"  :template-value="scope.row" ref-code="joblevelRef">' +
//                        '<span v-show="typeof(scope.row.pk_jobrank) != undefined && scope.row.pk_jobrank.length==0" style="color:#F00">职级不能为空</span>'+
                        '</el-ref>' +
                        '</template>'
                    );

                    let $pk_job = $node.find("[prop='pk_job']");
                    $pk_job.attr('render-type', 'default');
                    $pk_job.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_job"  :template-value="scope.row" ref-code="jobRef">' +
//                        '<span v-show="typeof(scope.row.pk_job) != undefined && scope.row.pk_job.length==0" style="color:#F00">职务不能为空</span>'+
                        '</el-ref>' +
                        '</template>'
                    );

                    let $pk_post = $node.find("[prop='pk_post']");
                    $pk_post.attr('render-type', 'default');
                    $pk_post.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_post"  :query-params="RefOrgParams"  :template-value="scope.row" ref-code="postDeptRef" :not-leaf-selectable="true">' +
//                        '<span v-show="typeof(scope.row.pk_post) != undefined && scope.row.pk_post.length==0" style="color:#F00">岗位不能为空</span>'+
                        '</el-ref>' +
                        '</template>'
                    );

                    let $pk_postseries = $node.find("[prop='pk_postseries']");
                    $pk_postseries.attr('render-type', 'default');
                    $pk_postseries.html(
                        '<template scope="scope" >' +
                        '<el-ref  :editable="bodyEdit" field="pk_postseries"  :template-value="scope.row" ref-code="postSeriesRef">' +
//                        '<span v-show="typeof(scope.row.pk_postseries) != undefined && scope.row.pk_postseries.length==0" style="color:#F00">岗位序列不能为空</span>'+
                        '</el-ref>' +
                        '</template>'
                    );

                    var operateArr = [{
                        title: '删除',
                        icon: 'delete',
                        vif: "tableOperVif"
                    }];
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);

                    return $node[0].outerHTML;

                },
                waclassrangFormMethods: {},

                waclassFormResetFun: function ($node) {
                    //计薪规则
                    var $psnidlab = $node.find("[prop='rangerule']");
                    $psnidlab.attr("v-show", "rangeruleshow");

                    //是否允许下级增加发放项目
                    var $addflag = $node.find("[prop='addflag']");
                    $addflag.attr("v-show", "addflagshow");

                    //期间方案
                    var $periodscheme = $node.find("[v-model='WaClassVO.pk_periodscheme']");
                    $periodscheme.attr('v-on:trigger', 'periodschemeChange');
                    $periodscheme.attr(':disabled','WaClassVO.disable');

                    var $pk_org = $node.find("[v-model='WaClassVO.pk_org']");
                    $pk_org.attr('v-on:trigger', 'orgChange');
                    $pk_org.attr('disabled', true);
                    //计薪规则
                    var $rangerule = $node.find("[v-model='WaClassVO.rangerule']");
                    $rangerule.attr("v-on:trigger", "rangChang");

                    //起始期间
                    var $startperiod = $node.find("[v-model='WaClassVO.startperiod']");
                    $startperiod.attr("v-on:change", "stratPriodChang");
                    $startperiod.attr(':disabled','WaClassVO.disable');
                    //编码
                    var $code = $node.find("[v-model='WaClassVO.code']");
                    $code.attr(':disabled','WaClassVO.disable');
                    //名称
                    var $name = $node.find("[v-model='WaClassVO.name']");
                    $name.attr(':disabled','WaClassVO.disable');


                    return $node[0].outerHTML;
                },
                waclassFormMethods: {
                    stratPriodChang(val){
                        if(val){
                            vm.$refs.ref_waclass_c.getFormData().cyear = val.substr(0,4);
                            vm.$refs.ref_waclass_c.getFormData().cperiod = val.substr(5);
                            vm.$refs.ref_waclass_c.getFormData().startyearperiod = val.substr(0,4)+val.substr(5);
                        }
                    },
                    periodschemeChange(type, val){
                        var refdata = val.value;
                        var pk_refid = refdata[0].id;
                        var parmjson = {"pk_periodscheme": pk_refid};
                        //alert(JSON.stringify(parmjson));
                        this.$http({
                            url: "/hrwa/waclass/getCorespondingPriod",
                            method: "post",
                            data: parmjson
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    //alert(JSON.stringify(res.data.data));
                                    vm.$refs.ref_waclass_c.setData('startperiodOptionsVar', res.data.data.options);
                                    vm.$refs.ref_waclass_c.getFormData().startperiod = res.data.data.startperiod;
                                    vm.$refs.ref_waclass_c.getFormData().cyear = res.data.data.cyear;
                                    vm.$refs.ref_waclass_c.getFormData().cperiod = res.data.data.cperiod;
                                } else {
                                    vm.$refs.ref_waclass_c.setData('startperiodOptionsVar', null);
                                    vm.$refs.ref_waclass_c.getFormData().startperiod = null;
                                    vm.$refs.ref_waclass_c.getFormData().cyear = null;
                                    vm.$refs.ref_waclass_c.getFormData().cperiod = null;
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch((e) => {
                                this.$message({
                                    message: e.data,
                                    type: "error"
                                });
                            });
                    },

                    rangChang(type, data){

                        var rangs = data.value;

                        if (rangs.length == 0) {
                            vm.subshow = false;
                        } else {
                            vm.subshow = true;

                            let orgshow = false;
                            let deptshow = false;
                            let psnclshow = false;
                            let jobgradeshow = false;
                            let jobrankshow = false;
                            let jobshow = false;
                            let postshow = false;
                            let postseriesshow = false;

                            for (var i = 0; i < rangs.length; i++) {
                                 if (rangs[i].refcode == "hi_psnjob.pk_org" || rangs[i].refcode == "01") {
                                    orgshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_dept" || rangs[i].refcode == "02") {
                                    deptshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_psncl" || rangs[i].refcode == "03") {
                                    psnclshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_jobgrade" || rangs[i].refcode == "04") {
                                    jobgradeshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_jobrank" || rangs[i].refcode == "05") {
                                    jobrankshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_job" || rangs[i].refcode == "06") {
                                    jobshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_post" || rangs[i].refcode == "07") {
                                    postshow = true;
                                }
                                if (rangs[i].refcode == "hi_psnjob.pk_postseries" || rangs[i].refcode == "08") {
                                    postseriesshow = true;
                                }
                            }

                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_org', orgshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_dept', deptshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_psncl', psnclshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_jobgrade', jobgradeshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_jobrank', jobrankshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_job', jobshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_post', postshow);
                            vm.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_postseries', postseriesshow);

                            let pk_org = vm.$refs.ref_waclass_c.getFormData().pk_org;
                            vm.$refs.ref_waclassrang.setData("RefOrgParams", {"pk_org":pk_org});
                            vm.$refs.ref_waclassrang.setData("waclassrang_t", null);
                        }
                    },
                    orgChange(type, val){

                        var pk_group = vm.$context.getFbpGroupPK();
                        if(val.value[0]){
                            var pk_org = val.value[0].id;
                            //alert(pk_group +"-----"+pk_org);
                            //集团节点隐藏计薪规则等字段
                            if (pk_group == pk_org) {
                                // alert(pk_group +"11111"+pk_org);
                                vm.$refs.ref_waclass_c.setData("rangeruleshow", false);

                                vm.$refs.ref_waclass_c.setData("addflagshow", true);
                                //组织节点，隐藏允许下级能字段
                            } else {
                                //alert(pk_group +"2222"+pk_org);
                                //组织节点
                                vm.$refs.ref_waclass_c.setData("addflagshow", false);

                                vm.$refs.ref_waclass_c.setData("rangeruleshow", true);
                            }
                        }

                    }
                },
            };
        },
        mounted() {
            this.request();
        },
        methods: {
            // 获取数据
            request() {
                this.headEdit = this.$root.$router.currentRoute.params.editable == "true";
                this.$refs.ref_waclassrang.setData("bodyEdit",this.headEdit);
                // 请求表头数据
                if (this.headEdit) {
                    this.showsubicons = this.subicons;

                }
                this.requestwaclassInfo();

            },
            // 请求表头数据
            requestwaclassInfo() {

                this.pk_wa_class = this.$root.$router.currentRoute.params.pk_wa_class;
                if (this.pk_wa_class === undefined) {
                    this.status = 2;
                    this.$refs.ref_waclass_c.setData("orgeditable", true);
                    return;
                }
                this.status = 1;
                this.$http({
                    url: "/hrwa/waclass/getById/" + this.pk_wa_class,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            let waclass = res.data.data;
                            this.waclassBase = res.data.data;
                            let resData = JSON.parse(JSON.stringify(waclass));
                            if (this.$refs.ref_waclass_c) {
                                this.$refs.ref_waclass_c.setFormData(resData);
                            } else {
                                this.$set(this.waclassrangData, "uitemplateFormData", resData);
                            }
                            this.$refs.ref_waclass_c.setData("orgeditable", false);
                            if (waclass.pk_group == waclass.pk_org) {
                                this.$refs.ref_waclass_c.setData("rangeruleshow", false);

                                this.$refs.ref_waclass_c.setData("addflagshow", true);

                            } else {
                                this.$refs.ref_waclass_c.setData("addflagshow", false);

                                this.$refs.ref_waclass_c.setData("rangeruleshow", true);
                            }

                            if (waclass.rangs != null) {
                                //this.$refs.ref_waclassrang.setData("subshow" , true);
                                this.subshow = true;
                                let vmthis = this;
                                this.waclassRangs = JSON.parse(JSON.stringify(waclass.rangs));
                                setTimeout(function () {
                                    vmthis.setBodyFieldShow(waclass.rangerule);
                                    vmthis.$refs.ref_waclassrang.setTableData(JSON.parse(JSON.stringify(waclass.rangs)));

                                    vmthis.$refs.ref_waclassrang.setData("RefOrgParams", {"pk_org":resData.pk_org});
                                }, 400);

                            } else {
                                this.subshow = false;
                                this.$refs.ref_waclassrang.setTableData(null);
                            }
                            if( this.headEdit){
                                var parmjson = {"pk_periodscheme": resData.pk_periodscheme};
                                this.$http({
                                    url: "/hrwa/waclass/getCorespondingPriod",
                                    method: "post",
                                    data: parmjson
                                })
                                    .then((res) => {
                                        if (res.data.status === true) {
                                            //alert(JSON.stringify(res.data.data));
                                            this.$refs.ref_waclass_c.setData('startperiodOptionsVar', res.data.data.options);
//                            this.$refs.ref_waclass_c.getFormData().startperiod = res.data.data.startperiod;
//                            this.$refs.ref_waclass_c.getFormData().cyear = res.data.data.cyear;
//                            this.$refs.ref_waclass_c.getFormData().cperiod = res.data.data.cperiod;
                                            this.headEdit = true;
                                            this.$refs.ref_waclassrang.setData("bodyEdit",this.headEdit);
                                            this.$refs.ref_waclassrang.setData("table-oper-vif",this.headEdit);
                                            this.showsubicons = this.subicons;
                                            this.$refs.ref_waclass_c.setData("orgeditable", false);
                                        } else {
                                            this.$message({
                                                message: res.data.msg,
                                                type: "error"
                                            });
                                        }
                                    })
                                    .catch((e) => {
                                        this.$message({
                                            message: e.data,
                                            type: "error"
                                        });
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
                        console.error(e);
                        this.$message({
                            message: "基本信息详情获取失败",
                            type: "error"
                        });
                    });
            },
            setDataToRangs(){
                if(JSON.stringify(this.waclassRangs).indexOf("pk_org")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_org"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_dept")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_dept"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_psncl")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_psncl"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_job")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_job"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_post")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_post"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_jobrank")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_jobrank"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_jobgrade")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_jobgrade"]="";
                    });
                }
                if(JSON.stringify(this.waclassRangs).indexOf("pk_postseries")==-1){
                    this.waclassRangs.forEach(function (row) {
                        row["pk_postseries"]="";
                    });
                }
            },
            setBodyFieldShow(rangpks){
                let orgshow = false;
                let deptshow = false;
                let psnclshow = false;
                let jobgradeshow = false;
                let jobrankshow = false;
                let jobshow = false;
                let postshow = false;
                let postseriesshow = false;

                if (rangpks.indexOf("0000Z700000000000001") != -1) {
                    orgshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000002") != -1) {
                    deptshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000003") != -1) {
                    psnclshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000004") != -1) {
                    jobgradeshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000005") != -1) {
                    jobrankshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000006") != -1) {
                    jobshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000007") != -1) {
                    postshow = true;
                }
                if (rangpks.indexOf("0000Z700000000000008") != -1) {
                    postseriesshow = true;
                }

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_org', orgshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_org', orgshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_dept', deptshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_dept', deptshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_psncl', psnclshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_psncl', psnclshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_jobgrade', jobgradeshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_jobgrade', jobgradeshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_jobrank', jobrankshow);
               // this.$refs.ref_waclassrang.setData('formItemVIfpk_jobrank', jobrankshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_job', jobshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_job', jobshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_post', postshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_post', postshow);

                this.$refs.ref_waclassrang.setData('tableCoulmnVIfpk_postseries', postseriesshow);
                //this.$refs.ref_waclassrang.setData('formItemVIfpk_postseries', postseriesshow);
            },
            waclassrangDeleteClick(scope){
                let rangs = this.$refs.ref_waclassrang.getTableData();
                rangs.splice(scope.$index,1);
            },
            // 基本信息取消按钮操作
            waclassCancel() {
                this.headEdit = false;
                this.$refs.ref_waclassrang.setData("bodyEdit",this.headEdit);

                this.showsubicons = null;
                //this.showicons = this.icons;
                if (this.status === 2) {
                    this.$router.push("/hrwa/waclass");
                    this.waclassBase = null;
                } else {
                    let rangrule = this.waclassBase.rangerule;
                    this.$refs.ref_waclass_c.setFormData(
                        JSON.parse(JSON.stringify(this.waclassBase)));
                    if (rangrule == null) {
                        this.subshow = false;
                        this.$refs.ref_waclassrang.setFormData(
                            null
                        );
                    } else {
                        this.setBodyFieldShow(rangrule)
                        this.$refs.ref_waclassrang.setTableData(
                            JSON.parse(JSON.stringify(this.waclassRangs))
                        );
                    }

                }
            },
            addWaclassRang(){
                var tabledata = this.$refs.ref_waclassrang.getTableData();
                var formdata = {pk_org:'',pk_dept:'',pk_psncl:'',pk_jobgrade:'',pk_jobrank:'',pk_job:'',pk_post:'',pk_postseries:''};
                var data;
                if (tabledata == undefined || tabledata==null) {
                    data = [formdata];
                } else {
                    data = tabledata;
                    data.push(formdata);
                }
                this.$refs.ref_waclassrang.setTableData(data);

            },
            waclassEdit() {
                var data = this.$refs.ref_waclass_c.getFormData();
                if (data.stopflag) {
                    this.$alert('已停用的薪资方案不允许编辑', {
                        confirmButtonText: '确定',
                    });
                    return;
                } else if (data.isEditable) {
                    if (data.pk_group == data.pk_org) {
                        this.$alert('已经分配到组织的数据不能修改', {
                            confirmButtonText: '确定',
                        });
                    } else {
                        this.$alert('存在已审核数据，不能修改', {
                            confirmButtonText: '确定',
                        });
                    }
                    return;
                }
                if (!data.pk_periodscheme) {

                    this.$refs.ref_waclass_c.setData('startperiodOptionsVar', []);
                    this.headEdit = true;
                    this.$refs.ref_waclassrang.setData("bodyEdit",this.headEdit);
                    this.showsubicons = this.subicons;
                    this.$refs.ref_waclass_c.setData("orgeditable", false);
                } else {
                    var parmjson = {"pk_periodscheme": data.pk_periodscheme};
                    this.$http({
                        url: "/hrwa/waclass/getCorespondingPriod",
                        method: "post",
                        data: parmjson
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                //alert(JSON.stringify(res.data.data));
                                this.$refs.ref_waclass_c.setData('startperiodOptionsVar', res.data.data.options);
//                            this.$refs.ref_waclass_c.getFormData().startperiod = res.data.data.startperiod;
//                            this.$refs.ref_waclass_c.getFormData().cyear = res.data.data.cyear;
//                            this.$refs.ref_waclass_c.getFormData().cperiod = res.data.data.cperiod;
                                this.headEdit = true;
                                this.$refs.ref_waclassrang.setData("bodyEdit",this.headEdit);
                                this.$refs.ref_waclassrang.setData("table-oper-vif",this.headEdit);
                                this.showsubicons = this.subicons;
                                this.$refs.ref_waclass_c.setData("orgeditable", false);
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        })
                        .catch((e) => {
                            this.$message({
                                message: e.data,
                                type: "error"
                            });
                        });
                }

            },
//            waclassDelete(){
//                var data = this.$refs.ref_waclass_c.getData("WaClassVO");
//            },
            // 基本信息保存按钮操作
            waclassSave(){
                var data = this.$refs.ref_waclass_c.getFormData();
                var rangs;
                if (this.subshow) {
                    rangs = this.$refs.ref_waclassrang.getTableData();
                    if(!rangs || rangs.length==0){
                        this.$message({
                            message: "选择了计薪规则，计薪规则设置不能为空",
                            type: "error"
                        });
                        return;
                    }
                    let flag= false;
                    rangs = this.$refs.ref_waclassrang.getTableData();
                    let orgshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_org");
                    let deptshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_dept");
                    let psnclshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_psncl");
                    let jobgradeshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_jobgrade");
                    let jobrankshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_jobrank");
                    let jobshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_job");
                    let postshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_post");
                    let postseriesshow =  this.$refs.ref_waclassrang.getData("tableCoulmnVIfpk_postseries");
                    rangs.forEach(function (row) {

                        if (orgshow && row.pk_org=="" ) {
                            flag = true;
                        }
                        if(deptshow && row.pk_dept == ""){
                            flag = true;
                        }
                        if(psnclshow && row.pk_psncl == ""){
                            flag = true;
                        }
                        if(jobgradeshow && row.pk_jobgrade == ""){
                            flag = true;
                        }
                        if(jobrankshow && row.pk_jobrank == ""){
                            flag = true;
                        }
                        if(jobshow && row.pk_job == ""){
                            flag = true;
                        }
                        if(postshow && row.pk_post == ""){
                            flag = true;
                        }
                        if(postseriesshow && row.pk_postseries == ""){
                            flag = true;
                        }
                    });
                    if(flag){
                        alert("计薪规则不能有空值，请检查");
                        return;
                    }
                }

                var savedata;
                if (rangs == undefined) {
                    savedata = {"main": data};
                } else {
                    savedata = {"main": data, "subdata": rangs};
                }

                data.status = this.status;
//                console.log(JSON.stringify(savedata));
                this.$refs.ref_waclass_c.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: "/hrwa/waclass/save",
                            method: "post",
                            data: savedata
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$refs.ref_waclass_c.clearEdit();
                                    this.$refs.ref_waclassrang.clearEdit();
                                    this.headEdit = false;
                                    this.$refs.ref_waclassrang.setData("bodyEdit",this.headEdit);
                                    this.showsubicons = null;
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    this.waclassBase = res.data.data;
                                    if (rangs != undefined) {
                                        this.bodyShow = true;
                                        this.waclassRangs = rangs;
                                    }
                                    if (this.$refs.ref_waclass_c) {
                                        this.$refs.ref_waclass_c.setFormData(res.data.data);
                                    } else {
                                        this.$set(this.waclassrangData, "uitemplateFormData", res.data.data);
                                    }

                                    if ( res.data.data.rangs != null) {
                                        this.$refs.ref_waclassrang.setTableData(res.data.data.rangs);
                                    }
                                    //this.$refs.ref_waclass_c.setData("WaClassVO", JSON.parse(JSON.stringify(this.waclassBase)));
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch((e) => {
                                this.$message({
                                    message: "地点更新失败",
                                    type: "error"
                                });
                            });
                    }
                });
            }
        }
    };
</script>
<style>

</style>
