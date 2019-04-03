<!--
  作者：yangchd
  时间：2018-08-30
  支持：员工管理——员工调入dialog
-->
<template>
  <el-dialog :title="oprinfo.trnstypename" v-model="dialogVisible" size="small" id="transapply-dialog-id">
    <ifbp-template :ref="ddRef"
                   style="margin-top: 0;"
                   v-if="dialogVisible"
                   tpl-id="trans_apply_transin_dialog"
                   :tpl-data="transData"
                   :tpl-reset-fun="tableFormResetFun"
                   :methods="childFormMethods"
                   @change="dataChange">
    </ifbp-template>
    <trans-apply-template :ref="ddFormRef"
                          v-if="dialogVisible && itemTemplate && itemTemplate.length > 0"
                          type="dialog"
                          :rules="rules"
                          :stapply="stapply"
                          :stapply_mode="stapply_mode"
                          :itemTemplate="itemTemplate"
                          :isEdit="true">
    </trans-apply-template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleSave" type="primary">保存</el-button>
      <el-button @click="handleCommit" type="primary">提交</el-button>
    </div>
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
      stapply_mode: {
        type: String,
        required: true,
      }
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
          transinInit: '/transinInit',
        },
        dialogVisible: false,
        // 调配框名称
        oprinfo: {
          trnstypename: '调入',
        },
        // 上部模板REF
        ddRef: 'ddRef',
        ddFormRef: 'ddFormRef',
        transData: {
          trnsOption: [],
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
        pk_psnjob: '',
        pk_psndoc:'',
        pk_trnstype:'',

        rules: {},
        stapply: {},
        itemTemplate:[],

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
    created() {
      this.dialogInit();
    },
    methods: {
      dialogInit: function () {
        this.$http({
          url: this.permissionPrefix + this.requestUrl.transinInit,
          method: "post",
        }).then((res) => {
          if (res.data.status === true) {
            this.transData.trnsOption = res.data.trnstypes;
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "信息获取失败", type: "error"});
        });
      },
      dataChange:function(field, value){
        if(field==='pk_psndoc' || field==='pk_trnstype'){
          let change = false;
          if(field==='pk_psndoc' && this.pk_psndoc !== value){
            this.pk_psndoc = value.value[0].id;
            this.pk_psnjob = value.value[0].pk_psnjob;
            change = true;
          }
          if(field==='pk_trnstype' && this.pk_trnstype !== value){
            this.pk_trnstype = value;
            change= true;
          }
          if(change && this.pk_psndoc && this.pk_trnstype){
            this.initData(this.pk_psnjob,this.pk_trnstype);
          }
        }
      },
      initData(pk_psnjob, pk_trnstype){
        let url = this.permissionPrefix + this.requestUrl.addinit + '?pk_psnjob=' + pk_psnjob + '&trnstype=' + pk_trnstype;
        this.$http({
          url: url,
          method: "get",
        }).then((res) => {
          if (res.data.status === true) {
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
        this.setDialogVisible(false);
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
            this.setDialogVisible(false);
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
            this.setDialogVisible(false);
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
      },
      // 设置dialog是否可见
      setDialogVisible: function (val) {
        if (!val) {
          this.itemTemplate = [];
          this.stapply = {};
          this.pk_psnjob = '';
          this.pk_psndoc = '';
          this.pk_trnstype = '';
          this.$refs[this.ddRef].setFormData({});
        }
        this.dialogVisible = val;
      },
    }
  };
</script>
