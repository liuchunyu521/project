<!--
  @des: 加班申请-详情
  @author: zyl
  @date: 2018-08-15
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="加班申请"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="false">
        <initiateFlow class="fl" 
                      ref="initfolwRef" 
                      billType="6405"
                      agentuserId=""
                      :billId="pk_overtimeh" 
                      :showBtn='!isEdit' 
                      @isRecall="getIsRecall">
        </initiateFlow>

        <!-- 主表编辑页签 -->
        <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
          <ifbp-template :ref="otapplyhFormRef" 
                         tplId="head" 
                         :tplData="otapplyhData" 
                         :editable="isEdit" 
                         :tplResetFun="otapplyhFormResetFun" 
                         :methods="otapplyhFormMethods">
          </ifbp-template>
        </ifbp-panel>
        <ifbp-panel title="加班信息" :icons="[]">
          <ifbp-template :ref="otapplybFormRef" 
                         tplId="body" 
                         :tplData="otapplybData" 
                         :editable="isEdit" 
                         :tplResetFun="otapplybFormResetFun" 
                         :methods="otapplybFormMethods">
          </ifbp-template>
        </ifbp-panel>

        <ifbp-panel title="附件">
          <ifbp-upload busi-code="60420otapply" 
                       force-type="normal" 
                       :disableUpdate="!isEdit" 
                       :disableUpload="!isEdit" 
                       :disableDelete="!isEdit" 
                       :pkBusi="pk_overtimeh">
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
    initiateFlow
  },

  data() {
    const otThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60420otapply',

      // 权限前缀
      requestPrefix: '/hrss/ta/otapply/',
      requestUrl: {
        initData: 'initData',
        getByPK: 'getByPK',
        calculate: 'calculate',
        save: 'save',
        submit: 'submit',
        checkBillCanEdit: 'checkBillCanEdit'
      },

      otapplyhData: {
        // 单据编码、申请日期、申请人 同时存在同时隐藏
        someItemsShow: false,
      },

      otapplyhFormResetFun: function ($node) {
        let $form = $node.find('el-form');
        // 单据编码
        $node.find("[prop='bill_code']").attr("v-show", "someItemsShow");
        // 申请日期
        $node.find("[prop='apply_date']").attr("v-show", "someItemsShow");
        // 申请人
        $node.find("[prop='billmaker']").attr("v-show", "someItemsShow");
        // 加班类型
        $node.find("[v-model='hrtaovertimeh.pk_overtimetype']").attr("v-on:change", "typeChange");

        return $node[0].outerHTML;
      },

      otapplyhFormMethods: {
        // 类型变化的触发事件
        typeChange: function (value) {
          let options = otThis.overtimetypeOptions;
          for (let i = 0; i < options.length; i++) {
            let option = options[i];
            if (value == option.value) {
              let overtimeh = otThis.$refs[otThis.otapplyhFormRef].getFormData();
              overtimeh.pk_timeitemcopy = option.pk_timeitemcopy;
              otThis.$refs[otThis.otapplyhFormRef].setFormData(JSON.parse(JSON.stringify(overtimeh)));
              break;
            }
          }

          let overtimeb = otThis.$refs[otThis.otapplybFormRef].getFormData();
          let overtimebegintime = overtimeb.overtimebegintime;
          let overtimeendtime = overtimeb.overtimeendtime;
          if (overtimebegintime < overtimeendtime) {
            otThis.calculate();
          }

        },
      },

      otapplybData: {
        overtimehourLabel: '加班时长（小时）',
      },

      otapplybFormResetFun: function ($node) {
        let $form = $node.find('el-form');
        // 加班开始时刻
        $node.find("[v-model='hrtaovertimeb.overtimebegintime']").attr("v-on:change", "timeChange");
        // 加班结束时刻
        $node.find("[v-model='hrtaovertimeb.overtimeendtime']").attr("v-on:change", "timeChange");
        // 加班时长label
        $node.find("[prop='overtimehour']").removeAttr("label");
        $node.find("[prop='overtimehour']").attr(":label", "overtimehourLabel");

        return $node[0].outerHTML;
      },

      otapplybFormMethods: {
        // 加班开始、结束时刻 变化的触发事件
        timeChange: function (value) {
          otThis.calculate();
        },
      },

      isEdit: true,
      pk_overtimeh: "",
      hasSubmited: false,

      //单据VO的状态
      status: 2,//1,update;2,new;3,delete
      // 该单据是否可以编辑
      canEdit: false,
      // 审批方式，1才需要显示审批流
      approveType: 0,

      // UI模板参数
      otapplyhFormRef: 'ref_otapplyh_h',
      otapplybFormRef: 'ref_otapplyb_b',

      // 加班类别
      overtimetypeOptions: [],

      otapplyData: {
        overtimeh: {},
        overtimeb: {}
      },
      otapplyDataBak: {},

      // 单据冲突dialog是否显示
      billConflictDlgVisible: false,
    }
  },

  computed: {},

  created() {
    let id = this.$root.$router.currentRoute.params.id;
    if (id) {
      this.pk_overtimeh = id;
    }
  },

  mounted() {
    this.request()
  },

  methods: {
    getIsRecall(isrecall) {
      if (isrecall) {
        this.requestBill();
        this.$refs.initfolwRef.doParams();
      }
    },

    // 请求数据
    request() {
      if (this.pk_overtimeh) {
        this.initData(false);
        this.isEdit = false;
        this.requestBill()
      } else {
        this.initData(true);
      }
    },

    // 新增单据时，初始化数据
    initData(newBill) {
      this.$http({
        url: this.requestPrefix + this.requestUrl.initData,
        method: 'post',
        params: { newBill: newBill }
      }).then(res => {
        if (res.data.status === true) {
          let initData = res.data.data;

          // 加班类别，不管是新增还是查看详情，都需要
          this.$refs[this.otapplyhFormRef].setData('overtimetypeOptions', initData.types);
          this.overtimetypeOptions = initData.types;

          // 新增单据，需要设置一些值
          if (newBill) {
            // 1.主表
            this.otapplyData.overtimeh = initData.overtimeh;
            this.$refs[this.otapplyhFormRef].setFormData(JSON.parse(JSON.stringify(this.otapplyData.overtimeh)));

            // 2.子表
            // 默认的开始/结束时间、加班时长
            this.otapplyData.overtimeb = initData.overtimeb;
            this.$refs[this.otapplybFormRef].setFormData(JSON.parse(JSON.stringify(this.otapplyData.overtimeb)));

            // 加班时长label
            this.otapplybData.overtimehourLabel = initData.overtimehourLabel;

            // 新增单据，主表主键是空的，这里设置一下，用于上传附件
            this.pk_overtimeh = initData.overtimeh.pk_overtimeh;
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
        params: { pk_overtimeh: this.pk_overtimeh }
      }).then(res => {
        if (res.data.status === true) {
          // 设置主表的几个字段可见
          this.$refs[this.otapplyhFormRef].setData('someItemsShow', true);

          let rtnData = res.data.data;
          let retOvertimeh = JSON.parse(JSON.stringify(rtnData.overtimeh));
          let retOvertimeb = JSON.parse(JSON.stringify(rtnData.overtimeb));

          this.$refs[this.otapplyhFormRef].setFormData(retOvertimeh);
          this.$refs[this.otapplybFormRef].setFormData(retOvertimeb);

          this.pk_overtimeh = rtnData.overtimeh.pk_overtimeh;
          this.otapplyData.overtimeh = rtnData.overtimeh;
          this.otapplyData.overtimeb = rtnData.overtimeb;
          this.status = rtnData.overtimeh.status;

          this.hasSubmited = retOvertimeh.approve_state && retOvertimeh.approve_state !== -1;
          this.approveType = rtnData.approveType;
        } else {
          this.$message({ message: res.data.msg, type: 'error' });
        }
      }).catch(() => {
        this.$message({ message: '获取加班申请单失败', type: 'error' });
      })
    },

    // 计算时长
    calculate() {
      if (this.pageValidate()) {
        this.otapplyData.overtimeh = this.$refs[this.otapplyhFormRef].getFormData();
        this.otapplyData.overtimeb = this.$refs[this.otapplybFormRef].getFormData();

        // 开始、结束时刻的判断
        let begintime = this.otapplyData.overtimeb.overtimebegintime;
        let endtime = this.otapplyData.overtimeb.overtimeendtime;

        if (begintime > endtime) {
          this.$message({ message: "加班开始时刻不能晚于结束时刻！", type: 'error' });
          return;
        } else if (begintime == endtime) {
          this.otapplyData.overtimeb.overtimehour = "0.00";
          let retOvertimeb = JSON.parse(JSON.stringify(this.otapplyData.overtimeb));
          this.$refs[this.otapplybFormRef].setFormData(retOvertimeb);
          return;
        } else {
          let data = JSON.parse(JSON.stringify(this.otapplyData));
          this.$http({
            url: this.requestPrefix + this.requestUrl.calculate,
            method: 'post',
            data: data
          }).then(res => {
            if (res.data.status === true) {
              let rtnData = res.data.data;
              // 加班时长label
              let overtimehourLabel = rtnData.overtimehourLabel;
              if (overtimehourLabel) {
                this.otapplybData.overtimehourLabel = overtimehourLabel;
              }

              this.otapplyData.overtimeb = rtnData.overtimeb;
              let overtimeb = JSON.parse(JSON.stringify(this.otapplyData.overtimeb));
              this.$refs[this.otapplybFormRef].setFormData(overtimeb);

            } else {
              this.$message({ message: res.data.msg, type: 'error' });
            }
          }).catch(() => {
            this.$message({ message: '计算加班时长失败！', type: 'error' });
          })
        }

      }
    },

    // 保存操作
    saveHandle() {
      if (this.pageValidate()) {
        this.otapplyData.overtimeh = this.$refs[this.otapplyhFormRef].getFormData();
        this.otapplyData.overtimeb = this.$refs[this.otapplybFormRef].getFormData();

        let data = JSON.parse(JSON.stringify(this.otapplyData));

        this.$http({
          url: this.requestPrefix + this.requestUrl.save,
          method: 'post',
          data: data
        }).then(res => {
          if (res.data.status === true) {
            this.$message({ message: res.data.msg, type: 'success' });
            this.isEdit = false;

            // 设置主表的几个字段可见
            this.$refs[this.otapplyhFormRef].setData('someItemsShow', true);

            let rtnData = res.data.data;

            // 直接把后台返回的数据展示出来
            let retOvertimeh = JSON.parse(JSON.stringify(rtnData.overtimeh));
            let retOvertimeb = JSON.parse(JSON.stringify(rtnData.overtimeb));

            this.$refs[this.otapplyhFormRef].setFormData(retOvertimeh);
            this.$refs[this.otapplybFormRef].setFormData(retOvertimeb);

            this.pk_overtimeh = rtnData.overtimeh.pk_overtimeh;
            this.otapplyData.overtimeh = rtnData.overtimeh;
            this.otapplyData.overtimeb = rtnData.overtimeb;
            this.status = rtnData.overtimeh.status;

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
        params: { pk_overtimeh: this.pk_overtimeh }
      }).then(res => {
        if (res.data.status === true) {
          this.canEdit = res.data.data.canEdit;
          if (this.canEdit) {
            this.isEdit = true;
            // 编辑态不允许提交
            this.hasSubmited = true;
            this.otapplyDataBak = JSON.parse(JSON.stringify(this.otapplyData));
          } else {
            this.$message({
              message: '您没有权限编辑当前数据！',
              type: 'error'
            })
          }
        } else {
          this.$message({ message: red.data.msg, type: 'error' });
        }
      }).catch(() => {
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

      this.otapplyData = this.otapplyDataBak;
      this.$refs[this.otapplyhFormRef].setFormData(this.otapplyData.overtimeh);
      this.$refs[this.otapplybFormRef].setFormData(this.otapplyData.overtimeb);

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
        this.otapplyData.overtimeh = this.$refs[this.otapplyhFormRef].getFormData();
        this.otapplyData.overtimeb = this.$refs[this.otapplybFormRef].getFormData();

        let data = JSON.parse(JSON.stringify(this.otapplyData));

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
      this.$refs[this.otapplyhFormRef].validate(valid => {
        if (valid) {
          flag1 = true;
        }
      })
      this.$refs[this.otapplybFormRef].getFormComp().validate(valid => {
        if (valid) {
          flag2 = true;
        }
      })
      return flag1 && flag2;
    }
  }
}
</script>
