<!--
  作者：yangchd
  时间：2018-06-6
  支持：我要调动——调动选项面板
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="调配申请"></ifbp-breadcrumb>

    <!--没有单据的时候，需要显示的选项信息-->
    <el-row :gutter="16" id="trans-type-list" v-show="!hasAddInit && pageShow">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in trnstypeuivos" :key="item">
        <div class="trans-type-item" style="" @click="clickType(item)">
          <div class="img-container">
            <span class="default"
                  :class="{ diaodong:item.pk_trnstype=='1002Z710000000008GSN',
                            jinsheng:item.pk_trnstype=='1002Z710000000008GSL',
                            jiangzhi:item.pk_trnstype=='1002Z710000000008GSM',
                            mianzhi:item.pk_trnstype=='1002Z710000000008GSO'}">
            </span>
          </div>
          <div class="name-container">
            <span>{{item.trnstypename.indexOf("申请") > -1 ? item.trnstypename : item.trnstypename + "申请"}}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--当选择一项调动后，显示详情-->
    <ifbp-main-area type="detail" v-show="hasAddInit">
      <ifbp-panel-group :navbar="false">
        <ifbp-panel title="基本信息">
          <ifbp-template :ref="stapplyFormRef"
                         tplId="hrss_mytransapply_card"
                         :tplData="transapplyData"
                         :editable="isEdit"
                         :tplResetFun="transapplyFormResetFun"
                         :methods="transapplyFormMethods">
          </ifbp-template>
        </ifbp-panel>
        <ifbp-panel title="调动信息" v-if="itemTemplate && itemTemplate.length > 0">
          <trans-apply-template :ref="transapplyFormRef"
                                type="detail"
                                :rules="transapplyData.rules"
                                :stapply="stapply"
                                :stapply_mode="'1'"
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
    <ifbp-footer v-show="hasAddInit">
      <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
      <el-button @click="editHandle" v-if="!isEdit">编辑</el-button>
      <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
      <el-button type="primary" @click="commitHandle" v-if="hasAddInit">提交</el-button>
    </ifbp-footer>
  </ifbp-page>
</template>

<script>
  import transApplyTemplate from '../../../../../common/component/trans-apply-template.vue';

  import {dateAddMonth} from "../../../../../common/js/computeDate";
  import pageModelMixin from "ifbp-business/pageModelMixin";
  export default {
    mixins: [pageModelMixin],
    components: {
      transApplyTemplate,
    },
    data(){
      const myTransDetailThis = this;
      return {
        permissionPrefix: '/hrss/trans/apply',
        requestUrl: {
          myApplyInit: '/myApplyInit',
          addinit: '/addinit',
          insert: '/insert',
          commit: '/commit'
        },
        // 调动选项
        trnstypeuivos: [],
        pk_psnjob: '',
        pk_hi_stapply: '',
        hasAddInit: false,
        pageShow: false,
        isEdit: true,
        hasSave: false,

        // UI模板参数
        stapplyFormRef: 'ref_stapply_c',
        transapplyData: {
          stapply: {},
          rules: {
            effectdate:[{
              validator: (rule, value, callback) => {
                // 调动申请单的调动日期不能早于最新工作记录的开始日期
                let data = myTransDetailThis.$refs[myTransDetailThis.stapplyFormRef].getFormData();
                if(data.psnjob_begindate && data.effectdate){
                  if(data.effectdate <= data.psnjob_begindate){
                    callback(new Error('调动日期不能早于最新工作记录的开始日期'));
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
                // 调动申请单的试用开始日期不能早于调动日期
                let data = myTransDetailThis.$refs[myTransDetailThis.stapplyFormRef].getFormData();
                if(data.effectdate && data.trialbegindate){
                  if(data.trialbegindate < data.effectdate){
                    callback(new Error('试用开始日期不能早于调动日期'));
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
        stapply: {},
        stapplyBak: {},
        itemTemplate:[],
        transapplyFormResetFun($node) {
          $node.find("[v-model='stapply.effectdate']").attr('v-on:change','effectdateChange');
          // 调动开始日期校验
          $node.find("[v-model='stapply.trialbegindate']").attr('v-on:change','computeTrialEndDate');
          $node.find("[v-model='stapply.trialdays']").attr("v-on:blur", "computeTrialEndDate");
          $node.find("[v-model='stapply.trial_flag']").attr("v-on:change", "trialFlagChange");
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
          }
        },
      }
    },
      mounted() {
          this.request();
      },
    methods: {
        ifbpPageInit(){
            this.request();
        },
      request: function () {
        this.$http({
          url: this.permissionPrefix + this.requestUrl.myApplyInit,
          method: "get",
        }).then((res) => {
          if (res.data.status === true) {
            this.pageShow = true;
            this.trnstypeuivos = res.data.trnstypes;
            if (res.data.approveState === 0) {
              this.pk_psnjob = res.data.pk_psnjob;
            } else {
              this.$message({message: '存在未完成的调动单据，已自动跳转！', type: "info"});
              this.jumpTransApplyPage(res.data.pk_hi_stapply);
            }
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "获取调动申请失败！", type: "error"});
        });
      },
      clickType(item){
        this.initData(this.pk_psnjob, item.pk_trnstype);
      },
      initData(pk_psnjob, pk_trnstype){
        this.$http({
          url: this.permissionPrefix + this.requestUrl.addinit + '?pk_psnjob=' + pk_psnjob + '&trnstype=' + pk_trnstype + '&ishrssbill=true',
          method: "get",
        }).then((res) => {
          if (res.data.status === true) {
            this.itemTemplate = res.data.itemTemplate;
            this.stapply = JSON.parse(JSON.stringify(res.data.data));
            this.pk_hi_stapply = res.data.data.pk_hi_stapply;
            this.hasAddInit = true;
            this.isEdit = true;
            this.$nextTick(function () {
              this.$refs[this.stapplyFormRef].setFormData(res.data.data);
            });
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "页面初始化失败", type: "error"});
        });
      },
      // 编辑取消
      editHandle(){
        this.stapplyBak = JSON.parse(JSON.stringify(this.stapply));
        this.isEdit = true;
      },
      cancelHandle(){
        if (this.hasSave) {
          this.stapply = this.stapplyBak;
          this.$refs[this.stapplyFormRef].setFormData(this.stapply);
          // 执行一次校验，去掉提示
          this.$nextTick(function () {
            this.pageValidate();
          });
          this.isEdit = false;
        } else {
          this.hasAddInit = false;
        }
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
            url: this.permissionPrefix + this.requestUrl.insert,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              this.$message({message: res.data.msg, type: "success"});
              this.jumpTransApplyPage(res.data.data.pk_hi_stapply);
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
          data.status = 2;
          for (let item in this.stapply) {
            if (this.stapply.hasOwnProperty(item)) {
              if (item.indexOf("new") === 0 || item === "pk_hi_org" || item === "pk_hrcm_org") {
                data[item] = this.stapply[item];
              }
            }
          }
          this.$http({
            url: this.permissionPrefix + this.requestUrl.commit,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              if(res.data.execMsg){
                this.$message({message: res.data.execMsg, type: "warning"});
              }
              this.jumpTransApplyPage(res.data.data.pk_hi_stapply);
            } else {
              if (res.data.saveResult) {
                this.jumpTransApplyPage(res.data.data.pk_hi_stapply);
              }
              this.$message({message: res.data.msg, type: "error"});
            }
          }).catch(() => {
            this.$message({message: "提交失败", type: "error"});
          });
        }
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
      },
      // 跳转到单据详情页
      jumpTransApplyPage: function (pk) {
        this.$router.push("/hrtrn/transmgt/transapply/detail/" + pk + "/false?funcode=60090transapply");
      },
    }
  }
</script>

<style>
  #trans-type-list .trans-type-item {
    height: 114px;
    background-color: white;
    border: 1px solid white;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 16px;
    cursor: pointer;
    position: relative;
  }
  #trans-type-list .trans-type-item:hover {
    background-color: #e9f7fc;
    border: 1px solid #6bcaea;
  }

  #trans-type-list .img-container {
    display: inline-block;
    padding: 32px;
    float: left;
  }

  #trans-type-list .img-container span {
    font-size: 48px;
    line-height: 48px;
    font-family: ifbp-icons !important;
    -webkit-font-smoothing: antialiased;

  }

  #trans-type-list .img-container .default:before {
    content: "\e955";
    color: #6FB4FF;
  }
  #trans-type-list .img-container .diaodong:before{
    content: "\e9b9" !important;
    color: #6FB4FF !important;
  }
  #trans-type-list .img-container .jinsheng:before{
    content: "\e9ad" !important;
    color: #7FD3A9 !important;
  }
  #trans-type-list .img-container .jiangzhi:before{
    content: "\e9aa" !important;
    color: #FFCC00 !important;
  }
  #trans-type-list .img-container .mianzhi:before{
    content: "\e9af" !important;
    color: #FF6161 !important;
  }

  #trans-type-list .name-container {
    display: inline-block;
    padding: 48px 0px;
    float: left;
    width: calc(100% - 120px);
  }

  #trans-type-list .name-container span {
    font-size: 16px;
    color: #333333;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    display: inline-block;
  }
</style>