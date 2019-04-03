<!--
  作者：yangchd
  时间：2018-08-30
  支持：员工调配——调配dialog
-->
<template>
  <el-dialog :title="oprinfo.trnstypename" v-model="dialogVisible" size="small" id="transapply-dialog-id">
    <ifbp-template :ref="ddRef"
                   style="margin-top: 0;"
                   tpl-id="hrtrn_transapply_dialog"
                   :tpl-data="transData"
                   :tpl-reset-fun="tableFormResetFun"
                   :methods="childFormMethods">
    </ifbp-template>
    <trans-apply-template :ref="ddFormRef"
                          v-if="itemTemplate && itemTemplate.length > 0"
                          type="dialog"
                          :rules="rules"
                          :stapply="stapply"
                          :stapply_mode="stapply_mode"
                          :itemTemplate="itemTemplate"
                          :isEdit="true">
    </trans-apply-template>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">保存</el-button>
        <el-button @click="handleCommit" type="primary">提交</el-button>
      </span>
  </el-dialog>
</template>
<script>
  import {dateAddMonth} from "../../../../../common/js/computeDate";
  import transApplyTemplate from '../../../../../common/component/trans-apply-template.vue';
  import pageModelMixin from "ifbp-business/pageModelMixin";
  export default {
    mixins: [pageModelMixin],
    components: {
      transApplyTemplate,
    },
    props: {
      stapply_mode: String,
      required: true,
    },
    data() {
      const ddDialogThis = this;
      return {
        // 功能编码
        funcode: 'funcode=60090transapply',
        // 权限前缀
        permissionPrefix: '/hrtrn/trans/apply',
        requestUrl: {
          addinit: '/addinit',
          insert: '/insert',
          commit: '/commit',
        },
        dialogVisible: false,
        // 调配框名称
        oprinfo: {
          trnstypename: '',
        },
        // 上部模板REF
        ddRef: 'ddRef',
        ddFormRef: 'ddFormRef',
        ddTemplatePk: '0001AA1000000001NMM8',
        transData: {
          stapply: {},
          rules: {
            effectdate: [{
              validator: (rule, value, callback) => {
                // 调配申请单的调配日期不能早于最新工作记录的开始日期
                let data = ddDialogThis.$refs[ddDialogThis.ddRef].getFormData();
                if (data.psnjob_begindate && data.effectdate) {
                  if (data.effectdate <= data.psnjob_begindate) {
                    callback(new Error('调配日期不能早于最新工作记录的开始日期'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }],
            trialbegindate: [{
              validator: (rule, value, callback) => {
                // 调配申请单的试用开始日期不能早于调配日期
                let data = ddDialogThis.$refs[ddDialogThis.ddRef].getFormData();
                if (data.effectdate && data.trialbegindate) {
                  if (data.trialbegindate < data.effectdate) {
                    callback(new Error('试用开始日期不能早于调配日期'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }],
          },
        },

        // 主键
        pk_hi_stapply: '',
        rules: {},
        stapply: {},
        itemTemplate:[],

        pk_psnjob: '',

        tableFormResetFun($node) {
          $node.find("[v-model='stapply.effectdate']").attr('v-on:change', 'effectdateChange');
          $node.find("[v-model='stapply.trialbegindate']").attr('v-on:change', 'computeTrialEndDate');
          $node.find("[v-model='stapply.trialdays']").attr("v-on:blur", "computeTrialEndDate");
          $node.find("[v-model='stapply.trial_flag']").attr("v-on:change", "trialFlagChange");
          return $node[0].outerHTML;
        },
        childFormMethods: {
          effectdateChange: function () {
            this['stapply'].trialbegindate = this['stapply'].effectdate;
            this.computeTrialEndDate();
          },
          computeTrialEndDate: function () {
            let trialbegindate = this['stapply'].trialbegindate;
            let trialdays = this['stapply'].trialdays;
            if (trialbegindate && trialdays) {
              this['stapply'].trialenddate = dateAddMonth(trialbegindate, trialdays).getTime();
            } else {
              this['stapply'].trialenddate = "";
            }
          },
          trialFlagChange: function () {
            if (this.stapply.trial_endflag && this.stapply.trial_flag) {
              this.stapply.trial_flag = false;
              this.$message({message: "当前调配人存在未结束的试用记录,不能勾选试用标志", type: "error"});
            } else {
              this.stapply.trialbegindate = this.stapply.effectdate;
            }
          }
        },
      };
    },
    methods: {
      show(pk_psnjob, oprinfo){
        this.pk_psnjob = pk_psnjob;
        this.oprinfo = oprinfo;
        this.initData(pk_psnjob, oprinfo.pk_trnstype);
      },
      initData(pk_psnjob, pk_trnstype){
        let url = this.permissionPrefix + this.requestUrl.addinit + '?pk_psnjob=' + pk_psnjob + '&trnstype=' + pk_trnstype+'&stapply_mode=1';
        this.$http({
          url: url,
          method: "get",
        }).then((res) => {
          if (res.data.status === true) {
            this.dialogVisible = true;
            this.$nextTick(function () {
              this.$refs[this.ddRef].setFormData(res.data.data);
              this.stapply = JSON.parse(JSON.stringify(res.data.data));
              this.pk_hi_stapply = res.data.data.pk_hi_stapply;
              this.itemTemplate = res.data.itemTemplate;
            });
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "操作失败", type: "error"});
        });
      },

      handleCancel(){
        this.dialogVisible = false;
      },
      handleSave() {
        if (this.pageValidate()) {
          this.handleRealSave();
        }
      },
      // 基本信息保存按钮操作
      handleRealSave() {
        let data = this.$refs[this.ddRef].getFormData();
        for (let item in this.stapply) {
          if (this.stapply.hasOwnProperty(item)) {
            if (item.indexOf("new") === 0 || item === "pk_hi_org" || item === "pk_hrcm_org") {
              data[item] = this.stapply[item];
            }
          }
        }
        data.approve_state = -1;
        data.stapply_mode = this.stapply_mode;
        let myself = this;
        this.$http({
          url: this.permissionPrefix + this.requestUrl.insert,
          method: "post",
          data: data
        }).then(res => {
          if (res.data.status === true) {
            this.dialogVisible = false;
            this.$nextTick(function () {
              myself.$router.push("/hrtrn/transmgt/transapply/detail/" + myself.pk_hi_stapply + "/false?" + this.funcode);
            });
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "保存失败", type: "error"});
        });
      },
      handleCommit(){
        if (this.pageValidate()) {
          this.handleRealCommit();
        }
      },
      handleRealCommit(){
        let data = this.$refs[this.ddRef].getFormData();
        let myself = this;
        data.status = 2;
        data.stapply_mode = this.stapply_mode;
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
            if (res.data.execMsg) {
              this.$message({message: res.data.execMsg, type: "warning"});
            }
            this.dialogVisible = false;
            this.$nextTick(function () {
              myself.$router.push("/hrtrn/transmgt/transapply/detail/" + myself.pk_hi_stapply + "/false?" + this.funcode);
            });
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "提交失败", type: "error"});
        });
      },
      // 上方模板和自定义的校验
      pageValidate: function () {
        let flag1 = false;
        let flag2 = false;
        this.$refs[this.ddRef].validate(valid => {
          if (valid) {
            flag1 = true;
          }
        });
        this.$refs[this.ddFormRef].getFormComp().validate(valid => {
          if (valid) {
            flag2 = true;
          }
        });
        return flag1 && flag2;
      }
    }
  };
</script>
<style>
  #transapply-dialog-id form>div{
    padding-left:0px !important;
  }
  #transapply-dialog-id .yon-uitemplate .el-form-item {
    display: block;
  }
</style>
