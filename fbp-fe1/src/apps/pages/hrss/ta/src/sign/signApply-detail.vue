<!--
  @des: 补考勤（签卡）申请
  @author: zyl
  @date: 2018-08-18
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="申请单填写"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="false">
        <initiateFlow class="fl" 
                      ref="initfolwRef" 
                      billType="6402"
                      agentuserId=""
                      :billId="pk_signh" 
                      :showBtn='!isEdit' 
                      @isRecall="getIsRecall">
        </initiateFlow>

        <!-- 主表编辑页签 -->
        <ifbp-panel title="基本信息" :icons="[]" class="titleLine" v-show="headShow">
          <ifbp-template :ref="signApplyhFormRef" 
                         tplId="head" 
                         :tplData="signApplyhData" 
                         :editable="isEdit" 
                         :tplResetFun="signApplyhFormResetFun" 
                         :methods="signApplyhFormMethods">
          </ifbp-template>
        </ifbp-panel>
        <ifbp-panel title="签卡信息" :icons="[]">
          <ifbp-template :ref="signApplybFormRef" 
                         tplId="body" 
                         :tplData="signApplybData" 
                         :editable="isEdit" 
                         :tplResetFun="signApplybFormResetFun" 
                         :methods="signApplybFormMethods">
          </ifbp-template>
        </ifbp-panel>

        <ifbp-panel title="附件">
          <ifbp-upload busi-code="60420signapply" 
                       force-type="normal"
                       :disableUpdate="!isEdit" 
                       :disableUpload="!isEdit" 
                       :disableDelete="!isEdit" 
                       :pk-busi="pk_signh">
          </ifbp-upload>
        </ifbp-panel>

      </ifbp-panel-group>
    </ifbp-main-area>

    <!-- 单据冲突dialog -->
    <el-dialog title="单据冲突" 
               :visible.sync="billConflictDlgVisible"
               size="tiny">
        <div>12122221</div>
    </el-dialog>

    <ifbp-footer>
      <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
      <el-button @click="editHandle" v-if="!isEdit && !hasSubmited">编辑</el-button>
      <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
      <el-button type="primary" @click="submitHandle" v-if="!hasSubmited">提交</el-button>
    </ifbp-footer>
  </ifbp-page>
</template>

<script>
import initiateFlow from 'ifbp-business/initiateFlow'
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from '../../../../../common/printPre.js'
import { dateAddMonth } from '../../../../../common/js/computeDate'
export default {
  mixins: [pageModelMixin, printPre],
  components: {
    initiateFlow: initiateFlow
  },

  data() {
    const signApplyDetailThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60420signapply',

      // 权限前缀
      requestPrefix: '/hrss/ta/signapply/',
      requestUrl: {
        initData: 'initData',
        getByPK: 'getByPK',
        save: 'save',
        submit: 'submit',
        checkBillCanEdit: 'checkBillCanEdit'
      },

      // 主表是否显示
      headShow: false,

      signApplyhData: {
        bill_codeHide: true,
        billmakerHide: true,
      },

      signApplyhFormResetFun: function ($node) { },

      signApplyhFormMethods: {},

      signApplybData: {},

      signApplybFormResetFun: function ($node) { },

      signApplybFormMethods: {},

      isEdit: true,
      pk_signh: this.$root.$router.currentRoute.params.id,
      signTime: this.$root.$router.currentRoute.params.signTime,
      signstatus: this.$root.$router.currentRoute.params.signstatus,
      signremark: this.$root.$router.currentRoute.params.signremark,
      isinitiateFlowShow: false,
      hasSubmited: false,

      //单据VO的状态
      status: 2,//1,update;2,new;3,delete

      // 该单据是否可以编辑
      canEdit: false,
      // 审批方式，1才需要显示审批流
      approveType: 0,

      // UI模板参数
      signApplyhFormRef: 'ref_signApply_h',
      signApplybFormRef: 'ref_signApply_b',

      signApplyData: {
        signh: {},
        signb: {}
      },
      signApplyDataBak: {},

      // 单据冲突dialog是否显示
      billConflictDlgVisible: false,
    }
  },

  computed: {},

  mounted() {
    if ('new' != this.pk_signh) {
      this.isEdit = false;
    }
    this.request();
  },

  methods: {
    getIsRecall(isrecall) {
      if (isrecall) {
        this.request();
        this.$refs.initfolwRef.doParams();
      }
    },

    // 请求数据
    request() {
      if ('new' != this.pk_signh) {
        this.requestBill()
      } else {
        this.initData();
      }
    },

    // 新增单据时，初始化数据
    initData() {
      this.$http({
        url: this.requestPrefix + this.requestUrl.initData,
        method: 'post',
        params: { signTime: this.signTime }
      }).then(res => {
        if (res.data.status === true) {
          let initData = res.data.data;

          // 1.主表
          this.signApplyData.signh = initData.signh;
          let signh = JSON.parse(JSON.stringify(this.signApplyData.signh));
          this.$refs[this.signApplyhFormRef].setFormData(signh);

          // 2.子表
          this.signApplyData.signb = initData.signb;
          // 从汇总页面过来的值，赋上去
          this.signApplyData.signb.signstatus = this.signstatus;
          this.signApplyData.signb.signremark = this.signremark;
          let signb = JSON.parse(JSON.stringify(this.signApplyData.signb));
          this.$refs[this.signApplybFormRef].setFormData(signb);

          // 如果是新增单据，主表主键是空的，这里设置一下，用于上传附件
          if ('new' == this.pk_signh) {
            this.pk_signh = initData.signh.pk_signh
          }

        } else {
          this.$message({ message: res.data.msg, type: 'error' })
        }
      }).catch(() => {
        this.$message({ message: '初始化失败', type: 'error' })
      })
    },

    // 获取单据数据
    requestBill() {
      this.$http({
        url: this.requestPrefix + this.requestUrl.getByPK,
        method: 'post',
        params: { pk_signh: this.pk_signh }
      }).then(res => {
        if (res.data.status === true) {
          // 设置主表可见
          this.headShow = true;

          let retData = res.data.data;
          let retSignh = JSON.parse(JSON.stringify(retData.signh));
          let retSignb = JSON.parse(JSON.stringify(retData.signb));

          this.$refs[this.signApplyhFormRef].setFormData(retSignh);
          this.$refs[this.signApplybFormRef].setFormData(retSignb);

          this.pk_signh = retData.signh.pk_signh;
          this.signApplyData.signh = retData.signh;
          this.signApplyData.signb = retData.signb;
          this.status = retData.signh.status;

          this.hasSubmited = retSignh.approve_state && retSignh.approve_state !== -1;
          this.approveType = retData.approveType;
          this.isinitiateFlowShow = this.hasSubmited;
        } else {
          this.$message({ message: res.data.msg, type: 'error' });
        }
      }).catch(() => {
        this.$message({ message: '获取补考勤申请单失败', type: 'error' });
      })
    },

    // 保存操作
    saveHandle() {
      if (this.pageValidate()) {
        this.signApplyData.signh = this.$refs[this.signApplyhFormRef].getFormData();
        this.signApplyData.signb = this.$refs[this.signApplybFormRef].getFormData();

        let data = JSON.parse(JSON.stringify(this.signApplyData));

        this.$http({
          url: this.requestPrefix + this.requestUrl.save,
          method: 'post',
          data: data
        }).then(res => {
          if (res.data.status === true) {
            this.$message({ message: res.data.msg, type: 'success' });
            this.isEdit = false;

            // 设置主表可见
            this.headShow = true;

            let retData = res.data.data;

            // 直接把后台返回的数据展示出来
            let retSignh = JSON.parse(JSON.stringify(retData.signh));
            let retSignb = JSON.parse(JSON.stringify(retData.signb));

            this.$refs[this.signApplyhFormRef].setFormData(retSignh);
            this.$refs[this.signApplybFormRef].setFormData(retSignb);

            this.pk_signh = retData.signh.pk_signh;
            this.signApplyData.signh = retData.signh;
            this.signApplyData.signb = retData.signb;
            this.status = retData.signh.status;

            this.canEdit = true;
            // 能保存，说明没提交
            this.hasSubmited = false;
          } else {
            this.$message({ message: res.data.msg, type: 'error' });
          }
        }).catch(() => {
          this.$message({ message: '保存失败', type: 'error' });
        })
      }
    },

    // 编辑操作
    editHandle() {
      this.$http({
        url: this.requestPrefix + this.requestUrl.checkBillCanEdit,
        method: 'post',
        params: { pk_signh: this.pk_signh }
      })
        .then(res => {
          if (res.data.status === true) {
            this.canEdit = res.data.data.canEdit;
            if (this.canEdit) {
              this.isEdit = true;
              // 编辑态不允许提交
              this.hasSubmited = true;
              this.signApplyDataBak = JSON.parse(JSON.stringify(this.signApplyData));
            } else {
              this.$message({
                message: '您没有权限编辑当前数据！',
                type: 'error'
              })
            }
          } else {
            this.$message({ message: red.data.msg, type: 'error' });
          }
        })
        .catch(() => {
          this.$message({ message: '编辑权限信息获取失败', type: 'error' });
        })
    },

    // 取消操作
    cancelHandle() {
      // 新增未保存的取消，返回上一个页面
      if (2 == this.status) {
        this.$context.getApp().back(1);
        return;
      }

      this.signApplyData = this.signApplyDataBak;
      this.$refs[this.signApplyhFormRef].setFormData(this.signApplyData.signh);
      this.$refs[this.signApplybFormRef].setFormData(this.signApplyData.signb);

      // 执行一次校验，去掉提示
      this.$nextTick(function () {
        this.pageValidate();
      })

      // 提交按钮
      this.hasSubmited = false;
      this.isEdit = false;
    },

    // 提交操作
    submitHandle() {
      if (this.pageValidate()) {
        this.signApplyData.signh = this.$refs[this.signApplyhFormRef].getFormData();
        this.signApplyData.signb = this.$refs[this.signApplybFormRef].getFormData();

        let data = JSON.parse(JSON.stringify(this.signApplyData));

        this.$http({
          url: this.requestPrefix + this.requestUrl.submit,
          method: 'post',
          data: data
        }).then(res => {
          if (res.data.status === true) {
            if (res.data.execMsg) {
              this.$message({ message: res.data.execMsg, type: 'warning' })
            } else {
              this.$message({ message: res.data.msg, type: 'success' })
            }
            this.isEdit = false;
            this.requestBill();
            this.$refs.initfolwRef.doParams();
          } else {
            this.$message({ message: res.data.msg, type: 'error' })
          }
        }).catch(() => {
          this.$message({ message: '提交失败', type: 'error' })
        })
      }

    },

    // 上方模板和自定义的校验
    pageValidate: function () {
      let flag1 = false;
      let flag2 = false;
      this.$refs[this.signApplyhFormRef].validate(valid => {
        if (valid) {
          flag1 = true;
        }
      })
      this.$refs[this.signApplybFormRef].getFormComp().validate(valid => {
        if (valid) {
          flag2 = true;
        }
      })
      return flag1 && flag2;
    }
  }
}
</script>
