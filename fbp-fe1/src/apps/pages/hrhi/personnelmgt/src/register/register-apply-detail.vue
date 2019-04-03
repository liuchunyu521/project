<!--
  作者：yangchd
  时间：2018-10-25
  支持：员工入职——入职申请单详情
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="入职申请单"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="false">
        <initiateFlow class="fl"
                      ref="initfolwRef"
                      billType="6101"
                      agentuserId=""
                      :billId="pk_entryapply"
                      :showBtn='!isEdit'
                      @isRecall="getIsRecall">
        </initiateFlow>
        <!-- 主表编辑页签 -->
        <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
          <ifbp-template :ref="entryFormRef"
                         tplId="hrhi_entry_apply_detail"
                         :tplData="entryApplyData"
                         :editable="isEdit"
                         :tplResetFun="entryapplyFormResetFun"
                         :methods="entryapplyFormMethods">
          </ifbp-template>
        </ifbp-panel>
        <ifbp-panel title="附件">
          <ifbp-upload busi-code="entryapply"
                       force-type="normal"
                       :disableUpdate="!isEdit"
                       :disableUpload="!isEdit"
                       :disableDelete="!isEdit"
                       :pk-busi="pk_entryapply">
          </ifbp-upload>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
    <ifbp-footer>
      <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
      <el-button @click="editHandle" v-if="!isEdit && !editBtnIf">编辑</el-button>
      <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
      <el-button type="primary" @click="commitHandle" v-if="!hasCommited">提交</el-button>
      <el-button type="primary" @click="execHandle" v-if="entryapply.approve_state==1">执行</el-button>
      <el-button type="primary" @click="printTemplate" v-if="!isEdit">打印</el-button>
    </ifbp-footer>

    <register-exec-dialog ref="execRef" :pk_entryapply="entryapply.pk_entryapply" :pk_org="entryapply.pk_org"
                       @after-exec="execRefresh">
    </register-exec-dialog>
  </ifbp-page>
</template>

<script>
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from '../../../../../common/printPre.js';
import RegisterExecDialog from './register-apply-exec-dialog.vue';
import initiateFlow from "ifbp-business/initiateFlow";
export default {
  mixins: [pageModelMixin, printPre],
  components: {
    RegisterExecDialog,
    initiateFlow,
  },
  data() {
    const registerApplyThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60070register',
      // 接口前缀
      requestPrefix: '/hrhi/register/',
      requestUrl: {
        getById: 'getById',
        insertEntry: 'insertEntry',
        saveEntry: 'saveEntry',
        commitEntry: 'commitEntry',
        callbackEntry: 'callbackEntry',
        deleteEntry: 'deleteEntry',
        execBill: 'execBill',
      },
      // 通过传入的参数判断是新增还是修改操作
      isEdit: this.$root.$router.currentRoute.params.edit === "true",
      pk_entryapply: this.$root.$router.currentRoute.params.id,
      isinitiateFlowShow: false,
      hasCommited: true,
      // 该单据是否可以编辑
      canEdit: false,

      // UI模板参数
      entryFormRef: 'entryFormRef',
      //单据VO的状态
      status: 2,//1,update;2,new;3,delete
      entryApplyData: {
      },
      entryapply: {
        pk_entryapply: '',
        pk_org: '',
      },
      entryapplyBak: {},
      entryapplyFormResetFun($node) {
        let $pk_psndoc_ref = $node.find("[prop='pk_psndoc']").children().first();
        $pk_psndoc_ref.attr("v-show", "editable");
        let $psndoc_a = $('<a class="hr-form-a" href="javascript:void(0);" v-show="!editable" @click.stop="showPsnDetail()">{{entryapply.beanMap.pk_psndoc_ref[entryapply.pk_psndoc].name}}</a>');
        $node.find("[prop='pk_psndoc']").append($psndoc_a);
        return $node[0].outerHTML;
      },
      entryapplyFormMethods: {
        showPsnDetail() {
          let pk = this.entryapply.pk_psndoc;
          registerApplyThis.$router.push("/hrhi/psninfo/dynamic/" + pk + "?funcode=60070psninfo");
        },
      },
    };
  },

  computed: {
    editBtnIf: function () {
      return this.entryapply.approve_state === 1 || this.entryapply.approve_state === 0 || this.entryapply.approve_state === 102;
    },
  },

  mounted() {
    this.request();
  },

  methods: {
    getIsRecall(isrecall) {
      if (isrecall) {
        this.request();
        this.$refs.initfolwRef.doParams();
      }
    },

    // 执行刷新
    execRefresh: function () {
      this.request();
      this.$refs.initfolwRef.doParams();
    },

    // 获取数据
    request() {
      this.$http({
        url: this.requestPrefix + this.requestUrl.getById + "/" + this.pk_entryapply,
        method: "get"
      }).then((res) => {
        if (res.data.status === true) {
          this.$refs[this.entryFormRef].clearEdit();
          this.entryapply = res.data.data;
          this.entryapplyBak = JSON.parse(JSON.stringify(this.entryapply));
          this.$refs[this.entryFormRef].setFormData(this.entryapply);

          this.hasCommited = typeof (this.entryapply.approve_state) !== "undefined" && this.entryapply.approve_state >= 0;
          this.isinitiateFlowShow = this.hasCommited;
          this.canEdit = res.data.canEdit;

          if (this.isEdit && !this.canEdit) {
            this.isEdit = false;
            this.$message({ message: "您没有权限编辑当前数据！", type: "error" });
          }
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "信息详情获取失败", type: "error" });
      });

    },

    // 编辑事件
    editHandle() {
      if (this.canEdit) {
        this.isEdit = true;
        this.entryapplyBak = JSON.parse(JSON.stringify(this.entryapply));
      } else {
        this.$message({ message: "您没有权限编辑当前数据！", type: "error" });
      }
    },

    cancelHandle() {
      this.entryapply = this.entryapplyBak;
      this.$refs[this.entryFormRef].setFormData(this.entryapply);
      // 执行一次校验，去掉提示
      this.$nextTick(function () {
        this.pageValidate();
      });
      this.isEdit = false;
    },

    saveHandle() {
      if (this.pageValidate()) {
        let data = this.$refs[this.entryFormRef].getFormData();
        this.$http({
          url: this.requestPrefix + this.requestUrl.saveEntry,
          method: "post",
          data: data
        }).then(res => {
          if (res.data.status === true) {
            this.$message({ message: res.data.msg, type: "success" });
            this.isEdit = false;
            this.request();
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        }).catch(() => {
          this.$message({ message: "保存失败", type: "error" });
        });
      }
    },

    commitHandle() {
      if (this.pageValidate()) {
        let data = this.$refs[this.entryFormRef].getFormData();
        if (this.isEdit) {
          data.status = 1;
        } else {
          data.status = 0;
        }
        this.$http({
          url: this.requestPrefix + this.requestUrl.commitEntry,
          method: "post",
          data: data
        }).then(res => {
          if (res.data.status === true) {
            if (res.data.execMsg) {
              this.$message({ message: res.data.execMsg, type: "warning" });
            } else {
              this.$message({ message: res.data.msg, type: "success" });
            }
            this.$refs.initfolwRef.doParams();
            this.isEdit = false;
            this.request();
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        }).catch(() => {
          this.$message({ message: "提交失败", type: "error" });
        });
      }
    },

    execHandle() {
      this.$refs['execRef'].setDialogVisible(true);
    },

    printTemplate: function () {
      let param = {
        billid: this.pk_entryapply,
      };
      this.printPre("60070register", "hrhi_emtry_apply", param);
    },

    // 上方模板和自定义的校验
    pageValidate: function () {
      let flag1 = false;
      this.$refs[this.entryFormRef].validate(valid => {
        if (valid) {
          flag1 = true;
        }
      });
      return flag1;
    }
  }
};
</script>
