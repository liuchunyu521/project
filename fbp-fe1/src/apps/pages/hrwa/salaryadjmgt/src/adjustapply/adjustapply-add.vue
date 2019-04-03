<template>
    <ifbp-page>
        <ifbp-breadcrumb name="个别调薪申请"></ifbp-breadcrumb>

        <!-- 按钮区域 -->
        <ifbp-footer >
            <el-button                  @click="allCancel"  v-if="headEdit" >取消</el-button>
            <el-button type="primary" @click="save"  v-if="headEdit">保存</el-button>
            <el-button type="primary" @click="saveCommit"  v-if="headEdit" >提交</el-button>
            <el-button type="primary" @click="allEdit"  v-if="allEditShow">编辑</el-button>
            <el-button type="primary" @click="commit"  v-if="submitShow">提交</el-button>
            <el-button type="primary" @click="print"  v-if="!headEdit">打印</el-button>
        </ifbp-footer>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">

                <!--<ifbp-panel title="" style="height:180px" v-if="isinitiateFlowShow">
                    <initiateFlow class="fl"
                                  ref="folwRef"
                                  billType="6301"
                                  :billId="pk_psnapp"
                                  :showBtn='!headEdit'
                                  @isRecall="getIsRecall"
                                  agentuserId="">
                    </initiateFlow>
                </ifbp-panel>-->
                <initiateFlow class="fl"
                      ref="initfolwRef"
                      billType="6301"
                      agentuserId=""
                      :billId="pk_psnapp"
                      :showBtn='!headEdit'
                      @isRecall="getIsRecall">
        		</initiateFlow>
                <!-- 主表编辑页签 :pkTemp="headTemplate"
                                   show-type="form" -->
                <ifbp-panel id="basePanel" title="基本信息"  class="titleLine">
                    <ifbp-template ref="psnappaprove_ref"
                                   tpl-id="adjustApplyHead"

                                   :tplData="applyCardHeadData"
                                   @after-create="afterCreateFunc"
                                   :editable="headEdit"
                                   :tplResetFun="headResetFunc"
                                   :methods="headFormMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>

                <!-- 子表编辑页签 :pkTemp="subTemplate"
                                   show-type="table-form"-->
                <ifbp-panel id="subPanel" title="定调薪详情"  class="titleLine" :icons="addicons" >
                    <ifbp-template ref="ref_adjustapply_c"
                                   tpl-id="adjustApplySub"

                                   :tplData="applyCardSubData"
                                   :tplResetFun="applyCardResetFunc"
                                   :methods="formMethods"
                                   confirm-button="确定"
                                   @form-confirm-click="confirm"
                                   @form-cancel-click="formCancel"
                                   @form-edit-click="formEdit"
                                   @form-delete-click="formDelete"
                                   :cancel-button-show="subEdit"
                                   :edit-button-show="bodyEditBtnShow"
                                   :delete-button-show="bodyEditBtnShow"
                                   :editable="subEdit"
                                   @delete-table-click="tableDeleteClick"
                                   @edit-table-click="tableEditClick"
                                   :table-show-menu="false"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel id="attach" title="附件" v-show="!headEdit"  :main-title="true" >
                    <ifbp-upload
                            busi-code="60130adjapply"
                            force-type = 'normal'
                            :pk-busi="pk_psnapp">
                    </ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>

    import gradePrmSecDialog from '../psndocwadoc/gradeprmsec-dialog.vue';
//  import initiateFlow from "../../../../../common/flow/src/initiateFlow.vue";
  	import initiateFlow from "ifbp-business/initiateFlow";
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import printPre       from '../../../../../common/printPre.js';
    export default {
        mixins: [pageModelMixin,printPre],
        components: {
            initiateFlow,
        },
        data() {

            var vm = this;
            Vue.component('grade-prm-sec-dialog', gradePrmSecDialog);

            return {

                headEdit:this.$root.$router.currentRoute.params.edit=="true"?true:false,//传过来的是字符串
                subEdit:false,
                allEditShow:false,
                bodyEditBtnShow:false,
                submitShow:false,
                headTemplate : "0001A91000000001OXPC",
                applyCardHeadData :{
                    Psnappaprove:{},
                    rules:{
//                        billcode: [{
//                            required: true,
//                            message: '单据编码不能为空',
//                            trigger:  'blur'
//                        }],
//                        billname: [{
//                            required: true,
//                            message: '申请单名称不能为空',
//                            trigger: 'blur'
//                        }],
//                        usedate: [{
//                            required: true,
//                            message: '生效日期不能为空',
//                            trigger: 'blur'
//                        }],
                    }
                },
                subTemplate:'0001A91000000001OXPD',
                applyCardSubData:{
                    PsnappaproveB:{},
                    showOpeColumn : true,
                    jobparam:{pk_org:''},
                    waGrdParam:{pk_org:'',pk_wa_item:''},
                    rules:{
//                        pk_psndoc: [{
//                            required: true,
//                            message: '人员不能为空',
//                            trigger: 'blur'
//                        }],
//                        pk_wa_item: [{
//                            required: true,
//                            message: '薪资项目不能为空',
//                            trigger: 'blur'
//                        }],
//                        pk_wa_grd: [{
//                            required: true,
//                            message: '薪资标准类别不能为空',
//                            trigger: 'blur'
//                        }],
//                        wa_apply_money: [{
//                            required: true,
//                            message: '申请金额不能为空',
//                            trigger: 'blur'
//                        }],
                    }
                },

                //页面上显示的值
                addIconShow:true,
                subList:[],
                delList:[],
                baseHead:'',//记录表头的原始值，取消时页面数据回滚
                baseBodys:'',//记录表体的原始值，取消时页面数据回滚
                isinitiateFlowShow : false,
                pk_psnapp:  "",
                headResetFunc:function($node){
                    let $pk_org = $node.find('[v-model="Psnappaprove.pk_org"]');//组织
                    $pk_org.attr('v-on:trigger', 'orgChange');

                    let pk = vm.$root.$router.currentRoute.params.pk_psnapp;
                    let disabled;
                    if(pk){
                        disabled = true;
                    }else{
                        disabled = false;
                    }
                    $pk_org.attr(":disabled",disabled);
                    return $node[0].outerHTML;
                },
                headFormMethods:{
                    orgChange(type,data ){

                        //清空表头的值
                        vm.$refs.psnappaprove_ref.setFormDataByField('billcode','');
                        vm.$refs.psnappaprove_ref.setFormDataByField('billname','');
                        vm.$refs.psnappaprove_ref.setFormDataByField('pk_changecause','');
                        vm.$refs.psnappaprove_ref.setFormDataByField('usedate',new Date().getTime());
                        vm.$refs.psnappaprove_ref.getFormData().beanMap.pk_changecause_ref={};
//                        vm.$refs.psnappaprove_ref.setFormDataByField('operator','');
//                        vm.$refs.psnappaprove_ref.getFormData().beanMap.operator_ref={};
                        //清空表体的值
                        vm.subList = [];
                        vm.delList=[];
                        vm.$refs.ref_adjustapply_c.setTableData(vm.subList);
                        if(vm.$refs.ref_adjustapply_c.formShow){
                            vm.$refs.ref_adjustapply_c.resetFormData("table-form");
                        }

                        if (data&&data.value[0]) {
                            let pk_org = data.value[0].id;
                            vm.$refs.ref_adjustapply_c.setData("jobparam", {"pk_org": pk_org});
                            vm.$refs.ref_adjustapply_c.setData("waGrdParam",{"pk_org": pk_org}) ;
                            let url = "/hrwa/psndocwadoc/adjustapply/getBillCode";
                            vm.$http({
                                url: url,
                                method: "post",
                                params:{
                                    pk_org:pk_org
                                }
                            })
                                .then((res) => {

                                    if(res.data.status === true){
                                        let billCode =  res.data.data;
                                        vm.$refs.psnappaprove_ref.setFormDataByField('billcode',billCode);
                                        vm.$refs.psnappaprove_ref.setFormDataByField('billname',billCode);
                                    }else{
                                        vm.$message({
                                            message: res.data.msg,
                                            type: "error"
                                        });
                                    }

                                })
                                .catch(() => {
                                    vm.$message({
                                        message: "单据编码获取失败",
                                        type: "error"
                                    });
                                });
                        }
                    }
                },
                applyCardResetFunc:function ($node){
                    var $pk_wa_crt = $node.find('[v-model="PsnappaproveB.pk_wa_crt"]');//申请薪资标准
                    $pk_wa_crt.attr('v-on:trigger', 'wacrtChange');
                    $pk_wa_crt.attr(":disabled","PsnappaproveB.negotiation");
                    $pk_wa_crt.attr("dialog-title","薪资标准表");

                    var crtProp= $node.find('[prop="pk_wa_crt"]');
                    crtProp.attr(":required","!PsnappaproveB.negotiation&&PsnappaproveB.is_range!='Y'");

                    var $pk_job =  $node.find('[v-model="PsnappaproveB.pk_psnjob"]');//工作记录
                    $pk_job.attr('v-on:trigger', 'jobChange');

                    var $pk_wa_grd =  $node.find('[v-model="PsnappaproveB.pk_wa_grd"]');//薪资类别标准
                    $pk_wa_grd.attr('v-on:trigger', 'wagrdChange');
                    $pk_wa_grd.attr(":disabled","PsnappaproveB.negotiation");

                    var $gradeProp= $node.find('[prop="pk_wa_grd"]');
                    $gradeProp.attr(":required","!PsnappaproveB.negotiation");

                    var $negotiation =  $node.find('[v-model="PsnappaproveB.negotiation"]');//谈判工资
                    $negotiation.attr('v-on:change', 'negotiationChange');

                    var $waItem =  $node.find('[v-model="PsnappaproveB.pk_wa_item"]');//谈判工资
                    $waItem.attr('v-on:trigger', 'waItemChange');


                    var $applyMoney= $node.find('[v-model="PsnappaproveB.wa_apply_money"]');
                    $applyMoney.attr(":disabled","(!PsnappaproveB.negotiation)&&(PsnappaproveB.is_range!='Y')");

                    var applyMoneyProp= $node.find('[prop="wa_apply_money"]');
                    applyMoneyProp.attr(":required","PsnappaproveB.negotiation||PsnappaproveB.is_range=='Y'");



                    var $table = this.getTableDom($node);
                    $table.attr(':show-header', 'true');
                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit',
                        vif:"showOpeColumn"
                    },{
                        title: '删除',
                        icon: 'delete',
                        vif:"showOpeColumn"
                    }];

                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                formMethods:{

                    wacrtChange(type,val)
                    {
                        vm.$refs.ref_adjustapply_c.getFormData(). wa_apply_money ='';
                        vm.$refs.ref_adjustapply_c.getFormData(). wa_crt_apply_money ='';
                        vm.$refs.ref_adjustapply_c.getFormData().  pk_wa_prmlv_apply ='';
                        vm.$refs.ref_adjustapply_c.getFormData().  pk_wa_seclv_apply ='';
                        vm.$refs.ref_adjustapply_c.getFormData(). crt_min_value ='';
                        vm.$refs.ref_adjustapply_c.getFormData(). crt_max_value ='';
                        vm.$refs.ref_adjustapply_c.getFormData(). vnote ='';
                        vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_crt ='';
                        let temp = val.value[0];
                        if(temp) {
                            vm.$refs.ref_adjustapply_c.getFormData().wa_apply_money = temp.criterionvalue;
                            vm.$refs.ref_adjustapply_c.getFormData().pk_wa_crt = temp.pk_wa_crt;
                            vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_prmlv_apply = temp.pk_wa_prmlv;
                            vm.$refs.ref_adjustapply_c.getFormData().pk_wa_seclv_apply = temp.pk_wa_seclv;
                            vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_crt_apply_showname = temp.prmlvName;
                            vm.$refs.ref_adjustapply_c.getFormData().wa_crt_apply_money = temp.criterionvalue;
                            if(vm.$refs.ref_adjustapply_c.getFormData().is_range == 'Y' || vm.$refs.ref_adjustapply_c.getFormData().is_range=='y'){
                                vm.$refs.ref_adjustapply_c.getFormData().crt_min_value =  temp.min_value;
                                vm.$refs.ref_adjustapply_c.getFormData().crt_max_value =temp.max_value;
                            }
                        }
                    },
                    jobChange(type,val){
                        let temp =val.value[0];
                        if(temp){
                            vm.$refs.ref_adjustapply_c.getFormData().partflag = temp.partflag;
                            vm.$refs.ref_adjustapply_c.getFormData().assgid = temp.assgid;
                            vm.$refs.ref_adjustapply_c.getFormData().pk_psndoc = temp.pk_psndoc;

                        }
                        vm.$refs.ref_adjustapply_c.getFormData().approved = 'Y';

                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_item_showname = '';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_item = '';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_grd_showname = '';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_grd ='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_crt_old_showname ='';
                        vm.$refs.ref_adjustapply_c.getFormData().wa_old_money ='';
                        vm.$refs.ref_adjustapply_c.getFormData().wa_crt_old_money ='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_prmlv_old='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_seclv_old='';
                        vm.$refs.ref_adjustapply_c.getFormData().negotiation =false;
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_crt_apply_showname ='';
                        vm.$refs.ref_adjustapply_c.getFormData().wa_apply_money ='';
                        vm.$refs.ref_adjustapply_c.getFormData().wa_crt_apply_money='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_prmlv_apply='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_seclv_apply='';
                        vm.$refs.ref_adjustapply_c.getFormData().is_range='N';
                        vm.$refs.ref_adjustapply_c.getFormData().crt_min_value='';
                        vm.$refs.ref_adjustapply_c.getFormData().crt_max_value='';
                        vm.$refs.ref_adjustapply_c.getFormData().vnote ='';
                    },
                    wagrdChange(type,val){
                        //'wa_old_money','wa_crt_old_money','pk_wa_crt_old_showname','pk_wa_prmlv_old','pk_wa_seclv_old',
                        //原本上述字段也在数组中的，但是后来需求变化，这些字段的值在项目编辑后带出来

                        let clearRow = ['wa_apply_money','wa_crt_apply_money',
                            'pk_wa_prmlv_apply','pk_wa_seclv_apply','crt_min_value',
                            'crt_max_value','vnote','pk_wa_crt'
                        ];
                        for(var i =0;i<clearRow.length;i++){
                            vm.$refs.ref_adjustapply_c.setFormDataByField(clearRow[i],'');
                        }
                        vm.$refs.ref_adjustapply_c.getFormData().is_range = 'N';
                        vm.$refs.ref_adjustapply_c.getFormData().negotiation = false;

                        let pk_item =  vm.$refs.ref_adjustapply_c.getFormData().pk_wa_item;
                        let pk_psnjob = vm.$refs.ref_adjustapply_c.getFormData().pk_psnjob;

                        let temp =val.value[0];
                        if(temp){
                            if("是"==temp.isrange || 'Y' == temp.isrange || 'y' == temp.isrange){
                                vm.$refs.ref_adjustapply_c.getFormData().is_range = 'Y';
                            }else{
                                vm.$refs.ref_adjustapply_c.getFormData().is_range = 'N';
                            }
                            let url = "/hrwa/psndocwadoc/adjustapply/changeWaGrd";
                            if(!pk_item || !pk_psnjob){
                                return;
                            }
                            vm.$http({
                                url: url,
                                method: "post",
                                data :{
                                    pk_wa_item : pk_item,
                                    pk_psnjob  : pk_psnjob,
                                    pk_wa_grd : temp.id
                                },

                            })
                                .then((res) => {
                                    if(res.data.status === true){
                                        let data =  res.data.data ;
                                        if(data){
                                            for(var i =0;i<clearRow.length;i++){
                                                vm.$refs.ref_adjustapply_c.setFormDataByField(clearRow[i],data[clearRow[i]]);
                                            }
                                            vm.$refs.ref_adjustapply_c.setFormDataByField('negotiation',data.negotiation);
                                        }
                                    }else{
                                        this.$message({
                                            message: res.data.msg,
                                            type: "error"
                                        });
                                    }
                                })
                                .catch(() => {

                                    this.$message({
                                        message: "信息获取失败",
                                        type: "error"
                                    });
                                });
                        }
                    },
                    waItemChange(type,val){
                        let clearRow = ['pk_wa_crt_old_showname','wa_old_money','pk_wa_prmlv_old','pk_wa_seclv_old','wa_crt_old_money'];
                        for(var i =0;i<clearRow.length;i++){
                            vm.$refs.ref_adjustapply_c.setFormDataByField(clearRow[i],'');
                        }
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_grd_showname='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_grd='';

                        vm.$refs.ref_adjustapply_c.getFormData().negotiation=false;
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_crt_apply_showname='';
                        vm.$refs.ref_adjustapply_c.getFormData().wa_apply_money='';
                        vm.$refs.ref_adjustapply_c.getFormData().wa_crt_apply_money='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_prmlv_apply='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_seclv_apply='';
                        vm.$refs.ref_adjustapply_c.getFormData().is_range='N';
                        vm.$refs.ref_adjustapply_c.getFormData().crt_min_value='';
                        vm.$refs.ref_adjustapply_c.getFormData().crt_max_value='';
                        vm.$refs.ref_adjustapply_c.getFormData().vnote='';
                        let currentValue = val.value[0];
                        if(currentValue){
                            vm.$refs.ref_adjustapply_c.getData("waGrdParam").pk_wa_item = currentValue.id;
                        }
                        let pk_item = currentValue.id;
                        let pk_psnjob = vm.$refs.ref_adjustapply_c.getFormData().pk_psnjob;
                        let url = "/hrwa/psndocwadoc/adjustapply/changeWaItem";
                        if(!pk_item || !pk_psnjob){
                            return;
                        }
                        vm.$http({
                            url: url,
                            method: "post",
                            data :{
                                pk_wa_item : pk_item,
                                pk_psnjob  : pk_psnjob,
                            },

                        })
                            .then((res) => {
                                if(res.data.status === true){
                                    let data =  res.data.data ;
                                    if(data){

                                        for(var i =0;i<clearRow.length;i++){
                                            vm.$refs.ref_adjustapply_c.setFormDataByField(clearRow[i],data[clearRow[i]]);
                                        }
                                    }
                                }else{
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                
                                this.$message({
                                    message: "信息获取失败",
                                    type: "error"
                                });
                            });
                    },
                    negotiationChange(val){
//                        vm.$refs.ref_adjustapply_c.getFormData().  wa_crt_old_money='';
//                        vm.$refs.ref_adjustapply_c.getFormData().  wa_old_money='';
//                        vm.$refs.ref_adjustapply_c.getFormData().  pk_wa_crt_old_showname='';

                        vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_grd ='';
                        vm.$refs.ref_adjustapply_c.getFormData().  pk_wa_grd_showname='';
                        vm.$refs.ref_adjustapply_c.getFormData().   pk_wa_crt_apply_showname='';
                        vm.$refs.ref_adjustapply_c.getFormData().   wa_crt_apply_money='';
                        vm.$refs.ref_adjustapply_c.getFormData().  wa_apply_money='';
                        vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_prmlv_apply='';
                        vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_seclv_apply='';
                        vm.$refs.ref_adjustapply_c.getFormData().pk_wa_crt_cofm_showname='';
                        vm.$refs.ref_adjustapply_c.getFormData(). wa_crt_cofm_money='';
                        vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_seclv_cofm='';
                        vm.$refs.ref_adjustapply_c.getFormData(). pk_wa_prmlv_cofm='';
                        vm.$refs.ref_adjustapply_c.getFormData().  pk_wa_crt = "";

                    }

                },
                billCode : '',
                addiconsValue: [{
                    icon: 'plus',
                    click: () => {
                        // 关闭table中的编辑区

                        vm.$refs.ref_adjustapply_c.getTableComp().closeExpandRow();
                        this.subEdit = true;
                        this.bodyEditBtnShow = false;
                        vm.$refs.ref_adjustapply_c.formShow = true;
                        vm.$refs.ref_adjustapply_c.resetFormData();
                        this. addicons = [];
                    },

                }],
                addicons:[]
            }
        },
        created() {
            let id = this.$root.$router.currentRoute.params.pk_psnapp;
            if (id) {
                this.pk_psnapp = id;
            }
        },
        mounted() {
            if(this.pk_psnapp){//点击编辑或者查看详情后页面跳转

                this.getDataByID(this.pk_psnapp)
            }else{//新增
                this.$refs.ref_adjustapply_c.setData("showOpeColumn",true);
                this.addicons = this.addiconsValue;
                this.headEdit = true;
                this.allEditShow = false;// 新增态不显示编辑按钮
                this.submitShow = false;//新增态不显示提交按钮，
                let applySubData = sessionStorage.getItem("applySubData");
                let pk_org = sessionStorage.getItem("pk_org");

                if(applySubData&&pk_org){
                    this.addByPsnDoc(applySubData,pk_org);
                }
                
            }


        },
        methods: {
            addByPsnDoc(applySubData,pk_org){
                    this.subList = JSON.parse(applySubData);
                    this.$refs.ref_adjustapply_c.setTableData(this.subList);

                    this.$refs.ref_adjustapply_c.setData("jobparam", {"pk_org": pk_org});
                    this.$refs.ref_adjustapply_c.setData("waGrdParam",{"pk_org":  pk_org}) ;
                    this. subEdit=true;
                    this.$refs.ref_adjustapply_c.setData('showOpeColumn',true);
                    this.addicons= this.addiconsValue;
                    this.bodyEditBtnShow = false;
                    this.$refs.ref_adjustapply_c.init();
            },
            getDataByID(id){
                var url =
                    "/hrwa/psndocwadoc/adjustapply/queryById";
                this.$http({
                    url: url,
                    method: "post",
                    data :{
                        pk_psnapp : this.pk_psnapp
                    },

                })
                    .then((res) => {
                        if(res.data.status === true){
                            let  head = res.data.data.head;
                            let  bodys = res.data.data.bodys;
                            this.baseHead = JSON.parse(JSON.stringify(head));
                            this.baseBodys =  JSON.parse(JSON.stringify(bodys));


                            this.$refs.psnappaprove_ref.setFormData(JSON.parse(JSON.stringify(head)));
                            this.subList = JSON.parse(JSON.stringify(bodys));

                            this.$refs.ref_adjustapply_c.setTableData(this.subList);

                            this.$refs.ref_adjustapply_c.setData("jobparam", {"pk_org": this.baseHead.pk_org});
                            this.$refs.ref_adjustapply_c.setData("waGrdParam",{"pk_org":  this.baseHead.pk_org}) ;
                            let constate = head.confirmstate;
                            this.$refs.ref_adjustapply_c.init();
                            if(constate == 3||constate == 2||constate == 1||constate == 0){
                                this.isinitiateFlowShow = true;
                            }
                            if(this.headEdit===true){//编辑
                                this. subEdit=false;
                                this.$refs.ref_adjustapply_c.setData('showOpeColumn',true);
                                this.setActionState(this.headEdit,JSON.parse(JSON.stringify(head)), this.subEdit);
                                this.addicons= this.addiconsValue;

                            }else{//查看详情
                                this.addicons= [];

                                this.headEdit=false;
                                this. subEdit=false;
                                this.$refs.ref_adjustapply_c.setData('showOpeColumn',false);
                                this.setActionState(this.headEdit,JSON.parse(JSON.stringify(head)), this.subEdit);
                            }

                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }

                        this.$refs.ref_adjustapply_c.init();
                    })
                    .catch(() => {

                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            getIsRecall(isrecall){

                if (isrecall) {
//                  this.isinitiateFlowShow = false;
                    this.getDataByID( this.$refs.psnappaprove_ref.getFormData().pk_psnapp);
                    this.$refs.initfolwRef.doParams();
                }
            },
            afterCreateFunc: function() {

                let pk_org = sessionStorage.getItem("pk_org");
                let pk_changecause = sessionStorage.getItem("pk_changecause");
                if(!pk_org){
                    pk_org = '';
                }
                if(!pk_changecause){
                    pk_changecause = '';
                }
                if(!this.pk_psnapp){//没有主键则是新增，那么查询单据编码，否则不查询
                    this.$http({
                        url:"/hrwa/psndocwadoc/adjustapply/setDefaultValue",
                        method: "post",
                        params : {
                            pk_org:pk_org,//勾选了定薪调薪数据后进行申请则组织是带过来的
                            pk_changecause:pk_changecause
                        }
                    }) .then(res => {

                        if (res.data.status === true) {
                            let head = res.data.data;
                            let jsonData = JSON.parse(JSON.stringify(head));
                            this.$refs.psnappaprove_ref.getFormData().beanMap = jsonData.beanMap;
                            this.$refs.psnappaprove_ref.getFormData().operator = jsonData.operator;
                            this.$refs.psnappaprove_ref.getFormData().usedate = jsonData.usedate;
                            if(pk_org){
                                this.$refs.psnappaprove_ref.getFormData().pk_org = jsonData.pk_org;
                                this.$refs.psnappaprove_ref.getFormData().billcode = jsonData.billcode;
                                this.$refs.psnappaprove_ref.getFormData().billname = jsonData.billcode;
                            }
                            if(pk_changecause){
                                this.$refs.psnappaprove_ref.getFormData().pk_changecause = jsonData.pk_changecause;                            
                            }
                            
//                            this.$refs.psnappaprove_ref.setFormData();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    }) .catch(() => {
                        this.$message({
                            message: "查询默认值失败",
                            type: "error"
                        });
                    });
//                    let data =  this.$refs.psnappaprove_ref.getFormData();
//                    this.$refs.psnappaprove_ref.setFormDataByField('billcode',this.billCode);
//                    this.$refs.psnappaprove_ref.setFormDataByField('billname',this.billCode);
//                    this.$refs.psnappaprove_ref.setFormDataByField('usedate',new Date().getTime());

//
//                    let usercode =  this.$context.getFbpUserCode();
//                    let userid =  this.$context.getFbpUserId();
//                    let username = this.$context.getFbpUserName();
//                    this.$refs.psnappaprove_ref.setFormDataByField('operator',userid);
//                   this.$refs.psnappaprove_ref.getFormData().beanMap.operator_ref[userid]={id:userid,code : usercode,name:username};
                }


            },
            confirm(type, row){
                this.$refs.ref_adjustapply_c.validate(valid => {
                    if (valid) {

                        let data =   this.$refs.ref_adjustapply_c.getFormData();

                        if(data.pk_psnapp_b){
                            this.$refs.ref_adjustapply_c.setFormDataByField("status",1);
                        }else{
                            this.$refs.ref_adjustapply_c.setFormDataByField("status",2);
                        }
                        if(type == "form"){
                            this.subList.push(data);
                            this.$refs.ref_adjustapply_c.setTableData(this.subList);
                        }
                        this.$refs.ref_adjustapply_c.formShow = false;
                        this.$refs.ref_adjustapply_c.getTableComp().closeExpandRow();
                        this.addicons = this.addiconsValue;
                    }
                });


            },
            saveCommit(){
                if(this.$refs.ref_adjustapply_c.formShow){
                    this.$message({
                        message: "子表数据没有保存",
                        type: "error"
                    });
                    return ;
                }
                let head = this.$refs.psnappaprove_ref.getFormData();
                let bodys = this.$refs.ref_adjustapply_c.getTableData();
                let allBodys =  bodys.concat(this.delList);

                this.$refs.psnappaprove_ref.validate(valid => {
                    if (valid) {
                        this.$http({
                            url: "/hrwa/psndocwadoc/adjustapply/saveCommit",
                            method: "post",
                            data: {
                                head :JSON.parse(JSON.stringify(head)),
                                bodys:JSON.parse(JSON.stringify(allBodys))
                            }
                        })
                            .then(res => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });


                                    head = res.data.data.head;
                                    bodys = res.data.data.bodys;

                                    this.baseHead = JSON.parse(JSON.stringify(head));
                                    this.baseBodys =  JSON.parse(JSON.stringify(bodys));

                                    this.$refs.psnappaprove_ref.setFormData(JSON.parse(JSON.stringify(head)));
                                    this.subList = JSON.parse(JSON.stringify(bodys));
                                    this.delList = [];
                                    this.$refs.ref_adjustapply_c.setTableData(this.subList);
                                    // this.headEdit = false;
                                    // this.subEdit = false;
                                    // this.setActionState(this.headEdit,JSON.parse(JSON.stringify(head)),  this.subEdit);
                                    // this.isinitiateFlowShow =true;
                                    this.addicons =[];
                                    this.pk_psnapp = head.pk_psnapp;
                                    // this.$refs.initfolwRef.doParams();
                                    // this.$refs.ref_adjustapply_c.setData('showOpeColumn',false);
                                    this.$router.push(  "/hrwa/adjustapply/adjustApplyDetail/"+this.pk_psnapp+"/false?funcode=60130adjapply" ) ;

                                    this.$refs.psnappaprove_ref.clearEdit();
                                    this.$refs.ref_adjustapply_c.clearEdit();
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
                    }
                });
            },
            save(){
                if(this.$refs.ref_adjustapply_c.formShow){
                    this.$message({
                        message: "子表数据没有保存",
                        type: "error"
                    });
                    return ;
                }
                let head = this.$refs.psnappaprove_ref.getFormData();
                let bodys = this.$refs.ref_adjustapply_c.getTableData();
                if(bodys.length <= 0){
                    this.$message({
                        message: "这张单据并没有数据！",
                        type: "error"
                    });
                    return ;
                }

                let allBodys =  bodys.concat(this.delList);

                this.$refs.psnappaprove_ref.validate(valid => {
                    if (valid) {
                        this.$http({
                            url: "/hrwa/psndocwadoc/adjustapply/save",
                            method: "post",
                            data: {
                                head :JSON.parse(JSON.stringify(head)),
                                bodys:JSON.parse(JSON.stringify(allBodys))
                            }
                        })
                            .then(res => {

                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });


                                    head = res.data.data.head;
                                    bodys = res.data.data.bodys;

                                    this.baseHead = JSON.parse(JSON.stringify(head));
                                    this.baseBodys =  JSON.parse(JSON.stringify(bodys));

                                    this.$refs.psnappaprove_ref.setFormData(JSON.parse(JSON.stringify(head)));
                                    this.subList = JSON.parse(JSON.stringify(bodys));
                                    this.delList = [];
                                    this.$refs.ref_adjustapply_c.setTableData(this.subList);
                                    this.headEdit = false;
                                    this.subEdit = false;
                                    this.setActionState(this.headEdit,JSON.parse(JSON.stringify(head)),  this.subEdit);
                                    this.$refs.ref_adjustapply_c.setData('showOpeColumn',false);

                                    this.addicons =[];
                                    this.pk_psnapp = head.pk_psnapp;
                                    this.$refs.ref_adjustapply_c.init();

                                    this.$refs.psnappaprove_ref.clearEdit();
                                    this.$refs.ref_adjustapply_c.clearEdit();
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
                    }
                });
            },
            print(){
                this.printPre("60130adjapply", "adjustapply", "{billid:" + this.$refs.psnappaprove_ref.getFormData().pk_psnapp + "}");
            },
            commit(){

                let head = this.$refs.psnappaprove_ref.getFormData();
                let bodys = this.$refs.ref_adjustapply_c.getTableData();
                this.$http({
                    url:"/hrwa/psndocwadoc/adjustapply/commit",
                    method: "post",
                    data: {
                        head :JSON.parse(JSON.stringify(head)),
                        bodys:JSON.parse(JSON.stringify(bodys))
                    }
                }) .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });


                        head = res.data.data.head;
                        bodys = res.data.data.bodys;

                        this.baseHead = JSON.parse(JSON.stringify(head));
                        this.baseBodys =  JSON.parse(JSON.stringify(bodys));
                        this.headEdit = false;
                        this.subEdit = false;
                        this.addicons= [];
                        this. setActionState(this.headEdit,JSON.parse(JSON.stringify(head)),  this.subEdit);

                        this.$refs.psnappaprove_ref.setFormData(JSON.parse(JSON.stringify(head)));
                        this.subList = JSON.parse(JSON.stringify(bodys));
                        this.$refs.ref_adjustapply_c.setTableData(this.subList);
                        this.isinitiateFlowShow =true;
                        this.$refs.initfolwRef.doParams();



                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }) .catch(() => {
                    this.$message({
                        message: "提交失败",
                        type: "error"
                    });
                });
            },


            tableEditClick(row, rowIndex){
                this.$refs.ref_adjustapply_c.expandRow(row.row,row.$index);

                this.subEdit = true;
                this.addicons= [];
                this.bodyEditBtnShow = false;

                let pk_wa_item = row.row.pk_wa_item;
                this.setwaGrdParam(pk_wa_item);

            },
            setwaGrdParam(pk_wa_item){
                this.$refs.ref_adjustapply_c.getData("waGrdParam").pk_wa_item = pk_wa_item;

            },
            tableDeleteClick(row, rowIndex){
                let pk_psnapp_b =  row.row.pk_psnapp_b;
                let index = row.$index;
                let delData = row.row;
                this.delete(pk_psnapp_b,index,delData);
            },
            formCancel(type, row){
                this.subEdit = false;
                this.bodyEditBtnShow = true;
                this.addicons= this.addiconsValue;
            },
            formDelete(type, row){

                let index = this.subList.indexOf(row);
                let pk_b = row.pk_psnapp_b;
                this.delete(pk_b,index,row);

            },
            delete(pk_psnapp_b,index,delData){

                this.$confirm('确认删除该数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,

                    type: 'warning'
                }).then(() => {

                    if(pk_psnapp_b){//这一行的值已经做持久化了，最后要真的到数据库中删除
                        delData.status = 3;
                        this.delList.push(delData);
                    }
                    this.$refs.ref_adjustapply_c.formShow = false;
                    this.$refs.ref_adjustapply_c.getTableComp().closeExpandRow();

                    this.subList.splice(index,1);
                    this.$refs.ref_adjustapply_c.setTableData(this.subList);
                    this.$refs.ref_adjustapply_c.clearEdit();
                    //可能编辑后就删除了，下面是处理这种情况
                    this.addicons= this.addiconsValue;
                    this.subEdit = false;
                }).catch(() => {
                    // 这里加取消逻辑
                });

            },
            formEdit(type, row){
                this.subEdit = true;
                this.bodyEditBtnShow  = false;
                this.addicons= [];

                let pk_wa_item = row.pk_wa_item;
                this.setwaGrdParam(pk_wa_item);
            },
            allCancel(){
                if( !this.$refs.psnappaprove_ref.getFormData().pk_psnapp){
                    // this.$router.push("/hrwa/psndocwadoc?funcode=60130adjmtc" ) ;
                    let num = sessionStorage.getItem("hrwaadjust-backnum");
                    if(num){
                        this.$context.getApp().back(parseInt(num));
                    }
                    
                }else{
                    this.addicons= [];
                    this.headEdit = false;
                    this.subEdit = false;

                    this.$refs.psnappaprove_ref.setFormData(JSON.parse(JSON.stringify(this.baseHead)));
                    this.subList = JSON.parse(JSON.stringify(   this.baseBodys ));
                    this.$refs.ref_adjustapply_c.setTableData(this.subList);
                    this.delList = [];
                    this.$refs.ref_adjustapply_c.setData('showOpeColumn',false);

                    this. setActionState(this.headEdit,JSON.parse(JSON.stringify(this.baseHead)) , this.subEdit);
                }
            },
            allEdit(){
                this.headEdit = true;
                this.addicons=  this.addiconsValue;
                this.$refs.ref_adjustapply_c.setData('showOpeColumn',true);

                this.setActionState(this.headEdit, this.$refs.psnappaprove_ref.getFormData(),  this.subEdit);

            },
            setActionState(headCanEdit,headDataTemp,subCanEdit){
                //非编辑态并且单据为自由态
                this.allEditShow = !headCanEdit && headDataTemp.confirmstate == -1
                this.submitShow = !headCanEdit &&  headDataTemp.confirmstate == -1;
                //编辑态且表体为浏览态
                this.bodyEditBtnShow = headCanEdit&&!subCanEdit;
            }
        }
    };
</script>
