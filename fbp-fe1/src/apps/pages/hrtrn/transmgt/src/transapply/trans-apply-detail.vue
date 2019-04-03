<!--
  作者：yangchd
  时间：2018-08-30
  支持：员工管理——调配详情
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="调配申请单"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="false">

        <initiateFlow class="fl"
                      ref="initfolwRef"
                      billType="6113"
                      agentuserId=""
                      :billId="pk_hi_stapply"
                      :showBtn='!isEdit'
                      @isRecall="getIsRecall">
        </initiateFlow>
        <!-- 主表编辑页签 -->
        <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
          <ifbp-template :ref="stapplyFormRef"
                         tplId="hrtrn_transapply_detail"
                         :tplData="transapplyData"
                         :editable="isEdit"
                         :tplResetFun="transapplyFormResetFun"
                         :methods="transapplyFormMethods">
          </ifbp-template>
        </ifbp-panel>
        <ifbp-panel title="调配信息" :icons="[]" v-if="itemTemplate && itemTemplate.length > 0">
          <trans-apply-template :ref="transapplyFormRef"
                                type="detail"
                                :rules="transapplyData.rules"
                                :stapply="stapply"
                                :stapply_mode="stapply_mode"
                                :itemTemplate="itemTemplate"
                                :isEdit="isEdit">
          </trans-apply-template>
        </ifbp-panel>

        <ifbp-panel title="附件">
          <ifbp-upload busi-code="transapply"
                       force-type="normal"
                       :disableUpdate="!isEdit"
                       :disableUpload="!isEdit"
                       :disableDelete="!isEdit"
                       :pk-busi="pk_hi_stapply">
          </ifbp-upload>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
    <ifbp-footer>
      <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
      <el-button @click="editHandle" v-if="!isEdit && !editBtnIf">编辑</el-button>
      <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
      <el-button type="primary" @click="commitHandle" v-if="!hasCommited">提交</el-button>
      <el-button type="primary" @click="execHandle" v-if="stapply.approve_state==1">执行</el-button>
      <el-button type="primary" @click="printTemplate" v-if="!isEdit">打印</el-button>
    </ifbp-footer>

    <trans-exec-dialog ref="execRef" :pk_hi_stapply="stapply.pk_hi_stapply" :pk_org="stapply.pk_org"
                       @after-exec="execRefresh">
    </trans-exec-dialog>
  </ifbp-page>
</template>

<script>

  import initiateFlow from "ifbp-business/initiateFlow";
  import transApplyTemplate from '../../../../../common/component/trans-apply-template.vue';
  import {dateAddMonth} from "../../../../../common/js/computeDate";
  import pageModelMixin from "ifbp-business/pageModelMixin";
//  import printPre from "ifbp-business/printPre";
  import printPre from '../../../../../common/printPre.js';

  import TransExecDialog from './trans-apply-exec-dialog.vue';
  export default {
    mixins: [pageModelMixin,printPre],
    components: {
      initiateFlow,
      transApplyTemplate,
      TransExecDialog,
    },
    data() {
      const transApplyDetailThis = this;
      return {
        // 功能编码
        funcode: 'funcode=60090transapply',
        // 权限前缀
        permissionPrefix: '/hrtrn/trans/apply',
        requestUrl: {
          getById: '/getById',
          save: '/save',
          commit: '/commit',
          canEdit: '/canEdit',
        },
        // 通过传入的参数判断是新增还是修改操作
        isEdit: this.$root.$router.currentRoute.params.edit === "true",
        pk_hi_stapply: this.$root.$router.currentRoute.params.id,
        isinitiateFlowShow: false,
        hasCommited: true,
        // 该单据是否可以编辑
        canEdit: false,
        // 审批方式，1才需要显示审批流
        approveType: 0,

        // UI模板参数
        stapplyFormRef: 'ref_stapply_c',
        stapplyFormPk: '0001AA1000000001NMMC',
        //单据VO的状态
        status: 2,//1,update;2,new;3,delete
        transapplyData: {
          stapply: {},
          rules: {
            effectdate:[{
              validator: (rule, value, callback) => {
                // 调配申请单的调配日期不能早于最新工作记录的开始日期
                let data = transApplyDetailThis.$refs[transApplyDetailThis.stapplyFormRef].getFormData();
                if(data.psnjob_begindate && data.effectdate){
                  if(data.effectdate <= data.psnjob_begindate){
                    callback(new Error('调配日期不能早于最新工作记录的开始日期'));
                  }else {
                    callback();
                  }
                }else{
                  callback();
                }
              },
              trigger: 'blur'
            }],
            trialbegindate:[{
              validator: (rule, value, callback) => {
                // 调配申请单的试用开始日期不能早于调配日期
                let data = transApplyDetailThis.$refs[transApplyDetailThis.stapplyFormRef].getFormData();
                if(data.effectdate && data.trialbegindate){
                  if(data.trialbegindate < data.effectdate){
                    callback(new Error('试用开始日期不能早于调配日期'));
                  }else {
                    callback();
                  }
                }else{
                  callback();
                }
              },
              trigger: 'blur'
            }],
          },
        },
        transapplyFormRef: 'transapplyFormRef',
        stapply: {
          pk_hi_stapply:'',
          pk_org:'',
        },
        stapplyBak: {},
        itemTemplate:[],
        transapplyFormResetFun($node) {
          $node.find("[v-model='stapply.effectdate']").attr('v-on:change','effectdateChange');
          // 调配开始日期校验
          $node.find("[v-model='stapply.trialbegindate']").attr('v-on:change','computeTrialEndDate');
          $node.find("[v-model='stapply.trialdays']").attr("v-on:blur", "computeTrialEndDate");
          $node.find("[v-model='stapply.trial_flag']").attr("v-on:change", "trialFlagChange");

          // 详情连接
          let $pk_psndoc_ref = $node.find("[prop='pk_psndoc']").children().first();
          $pk_psndoc_ref.attr("v-show","editable");
          let $psndoc_a = $('<a class="hr-form-a" href="javascript:void(0);" v-show="!editable" @click.stop="showPsnDetail()">{{stapply.beanMap.pk_psndoc_ref[stapply.pk_psndoc].name}}</a>');
          $node.find("[prop='pk_psndoc']").append($psndoc_a);
          return $node[0].outerHTML;
        },
        transapplyFormMethods: {
          effectdateChange:function () {
            this['stapply'].trialbegindate = this['stapply'].effectdate;
            this.computeTrialEndDate();
          },
          computeTrialEndDate:function () {
            let trialbegindate = this['stapply'].trialbegindate;
            let trialdays = this['stapply'].trialdays;
            if (trialbegindate && trialdays) {
              this['stapply'].trialenddate = dateAddMonth(trialbegindate,trialdays).getTime();
            } else {
              this['stapply'].trialenddate = "";
            }
          },
          trialFlagChange:function () {
            if(this.stapply.trial_endflag && this.stapply.trial_flag ){
              this.stapply.trial_flag = false;
              this.$message({message: "当前调配人存在未结束的试用记录,不能勾选试用标志", type: "error"});
            }else{
              this.stapply.trialbegindate = this.stapply.effectdate;
            }
          },
          showPsnDetail(){
            let pk = this.stapply.pk_psndoc;
            transApplyDetailThis.$router.push("/hrhi/psninfo/dynamic/" + pk + "?funcode=60070psninfo");
          },
        },
      };
    },
    computed:{
      editBtnIf:function(){
        return this.stapply.approve_state===1 || this.stapply.approve_state===0 || this.stapply.approve_state===102;
      },
      stapply_mode:function () {
        return this.stapply.stapply_mode;
      }
    },
    mounted() {
      this.request();
    },
    methods: {
      getIsRecall(isrecall){
        if (isrecall) {
          this.request();
          this.$refs.initfolwRef.doParams();
        }
      },
      // 执行刷新
      execRefresh:function () {
        this.request();
        this.$refs.initfolwRef.doParams();
      },
      // 获取数据
      request() {
        this.$http({
          url: this.permissionPrefix + this.requestUrl.getById + "/" + this.pk_hi_stapply,
          method: "get"
        }).then((res) => {
          if (res.data.status === true) {
            this.stapply = res.data.data;
            this.stapplyBak = JSON.parse(JSON.stringify(this.stapply));
            this.$refs[this.stapplyFormRef].setFormData(this.stapply);
            this.hasCommited = typeof(this.stapply.approve_state) !== "undefined" && this.stapply.approve_state >= 0;
            this.isinitiateFlowShow = this.hasCommited;

            this.itemTemplate = res.data.itemTemplate;

            this.approveType = res.data.approveType;
            this.canEdit = res.data.canEdit;
            if (this.isEdit && !this.canEdit) {
              this.isEdit = false;
              this.$message({message: "您没有权限编辑当前数据！", type: "error"});
            }
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "信息详情获取失败", type: "error"});
        });

      },
      // 编辑取消
      editHandle(){
        this.$http({
          url: this.permissionPrefix + this.requestUrl.canEdit + "/" + this.pk_hi_stapply,
          method: "get"
        }).then((res) => {
          if (res.data.status === true) {
            this.canEdit = res.data.canEdit;
            if (this.canEdit) {
              this.isEdit = true;
              this.stapplyBak = JSON.parse(JSON.stringify(this.stapply));
            } else {
              this.$message({message: "您没有权限编辑当前数据！", type: "error"});
            }
          } else {
            this.$message({message: red.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "编辑权限信息获取失败", type: "error"});
        });
      },
      cancelHandle(){
        this.stapply = this.stapplyBak;
        this.$refs[this.stapplyFormRef].setFormData(this.stapply);
        // 执行一次校验，去掉提示
        this.$nextTick(function () {
          this.pageValidate();
        });
        this.isEdit = false;
      },
      saveHandle(){
        if (this.pageValidate()) {
          let data = this.$refs[this.stapplyFormRef].getFormData();
          for (let item in this.stapply) {
            if (this.stapply.hasOwnProperty(item)) {
              if (item.indexOf("new") === 0 || item === "pk_hi_org" || item === "pk_hrcm_org") {
                data[item] = this.stapply[item];
              }
            }
          }
          this.$http({
            url: this.permissionPrefix + this.requestUrl.save,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              this.$message({message: res.data.msg, type: "success"});
              this.isEdit = false;
              this.request();
            } else {
              this.$message({message: res.data.msg, type: "error"});
            }
          }).catch(() => {
            this.$message({message: "保存失败", type: "error"});
          });
        }
      },
      commitHandle(){
        if (this.pageValidate()) {
          let data = this.$refs[this.stapplyFormRef].getFormData();
          if (this.isEdit) {
            data.status = 1;
            for (let item in this.stapply) {
              if (this.stapply.hasOwnProperty(item)) {
                if (item.indexOf("new") === 0 || item === "pk_hi_org" || item === "pk_hrcm_org") {
                  data[item] = this.stapply[item];
                }
              }
            }
          } else {
            data.status = 0;
          }
          this.$http({
            url: this.permissionPrefix + this.requestUrl.commit,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              if(res.data.execMsg){
                this.$message({message: res.data.execMsg, type: "warning"});
              }else{
                this.$message({message: res.data.msg, type: "success"});
              }
              this.$refs.initfolwRef.doParams();
              this.isEdit = false;
              this.request();
            } else {
              this.$message({message: res.data.msg, type: "error"});
            }
          }).catch(() => {
            this.$message({message: "提交失败", type: "error"});
          });
        }
      },
      execHandle(){
        this.$refs['execRef'].setDialogVisible(true);
      },
      printTemplate:function () {
        let param = {
          billid:this.pk_hi_stapply,
        };
        this.printPre("60090transapply", "transapply-print-template", param);
      },
      // 上方模板和自定义的校验
      pageValidate: function () {
        let flag1 = false;
        let flag2 = false;
        this.$refs[this.stapplyFormRef].validate(valid => {
          if (valid) {
            flag1 = true;
          }
        });
        this.$refs[this.transapplyFormRef].getFormComp().validate(valid => {
          if (valid) {
            flag2 = true;
          }
        });
        return flag1 && flag2;
      }
    }
  };
</script>
