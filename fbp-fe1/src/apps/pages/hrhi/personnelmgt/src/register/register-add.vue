<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工入职-新增页面
-->
<template>
  <ifbp-page>
    <!-- 面包屑 -->
    <ifbp-breadcrumb name="新增员工"></ifbp-breadcrumb>

    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="false">
        <!-- 人员详情部分 -->
        <ifbp-panel id="registerAddPsndocPanel" title="基本信息" :toggle-show="panelToggleShow">
          <psndoc-main-avatar :ref="registerAvatarRef"
                              :psndocData="psndocAddData"
                              :templateEdit="registerPsndocEdit"
                              :funcode="funcode" :requestPrefix="requestPrefix"
                              :mode="2"
                              @dataChange="psndocAddDataChange">
          </psndoc-main-avatar>
          <psndoc-main :ref="registerPsndocRef"
                       tpl_id="hrhi_register_add_main"
                       :psndocData="psndocAddData"
                       :pk_psndoc="pk_psndoc"
                       :psndocMainEdit="registerPsndocEdit"
                       :psndocMainBtn="registerPsndocBtn"
                       :psndocCode="psndocCode"
                       :funcode="funcode" :requestPrefix="requestPrefix"
                       @setAddData="changeAddData">
          </psndoc-main>
        </ifbp-panel>
        <!--工作信息，分别新增和详情两种-->
        <ifbp-panel id="registerAddPsnjobPanel" title="工作信息" :toggle-show="panelToggleShow">
          <psndoc-main-psnjob :ref="registerPsnjobRef"
                              tpl_id="hrhi_register_add_psnjob"
                              :pk_psndoc="pk_psndoc"
                              :clerkCode="clerkCode"
                              :funcode="funcode"
                              :requestPrefix="requestPrefix"
                              :psnjobMainEdit="registerPsnjobEdit"
                              :psnjobMainBtn="registerPsnjobBtn"
                              @after-create="setDefaultOrg">
          </psndoc-main-psnjob>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>

    <!-- 按钮区域 -->
    <ifbp-footer>
      <el-button @click="registerReturn">取消</el-button>
      <el-button type="primary" @click="registerSave">保存</el-button>
      <el-button type="primary" class="no-min-width" @click="registerSaveAndNew">保存并新增</el-button>
    </ifbp-footer>
  </ifbp-page>
</template>

<script>
import PsndocMain from "../subset/psndoc-main.vue";
import PsndocMainAvatar from "../../../../../common/component/psndoc-main-avatar.vue";
import PsndocMainPsnjob from "../subset/psndoc-main-psnjob.vue";

import { validateLegalEmpAge } from "../../../../../common/js/PsndocValidator.js";

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

export default {
  mixins: [pageModelMixin],
  components: {
    PsndocMain,
    PsndocMainPsnjob,
    PsndocMainAvatar
  },
  data() {
    return {
      // 功能编码
      funcode: "funcode=60070register",
      // 接口前缀
      requestPrefix: "/hrhi/register/",
      // 所有当前页面请求路径
      requestUrl: {
        getPsndocCode: "getPsndocCode",
        getClerkCode: "getClerkCode",
        rollbackCode: "rollbackCode",
        validateID: "validateID",
        validateRegDate: "validateRegDate",
        register: "register"
      },
      // 新增页面panel不允许收起
      panelToggleShow: false,

      // 设置一个默认值
      pk_psndoc: "",
      pk_org: this.$route.query.pk_org,
      pk_dept: this.$route.query.pk_dept,

      psndocCode: {
        precode: true,
        code: "",
        editable: true
      },

      clerkCode: {
        pk_org: "",
        precode: true,
        code: "",
        editable: true
      },

      // 存储人员基本信息和工作信息
      psndocAddData: {
        psndoc: {},
        psnjob: {}
      },

      // 人员基本信息变量
      registerAvatarRef: "ref_register_add_avatar",
      registerPsndocRef: "ref_register_add_psndoc",
      registerPsndocEdit: true,
      registerPsndocBtn: false,

      // 工作信息变量
      registerPsnjobRef: "ref_register_add_psnjob",
      registerPsnjobEdit: true,
      registerPsnjobBtn: false
    };
  },

  mounted() {
    this.registerAddInit();
  },

  methods: {
    // 新增初始化方法
    registerAddInit: function () {
      this.getPsndocCode();
      this.getClerkCode();
      this.$nextTick(function () {
        $("#main-right")[0].scrollTop = 0;
        this.$refs[this.registerAvatarRef].resetTemplateData();
        this.$refs[this.registerPsndocRef].resetTemplateData();
        this.$refs[this.registerPsnjobRef].resetTemplateData();
      });
    },

    // 获取人员编码
    getPsndocCode() {
      this.$http({
        url: this.requestPrefix + this.requestUrl.getPsndocCode,
        method: "post"
      }).then(res => {
        if (res.data.status === true) {
          this.psndocCode.precode = res.data.data.precode;
          this.psndocCode.code = res.data.data.code;
          this.psndocCode.editable = res.data.data.editable;
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(res => {
        this.$message({ message: res, type: "error" });
      });
    },

    // 获取员工号
    getClerkCode() {
      this.$http({
        url: this.requestPrefix + this.requestUrl.getClerkCode,
        method: "post"
      }).then(res => {
        if (res.data.status === true) {
          this.clerkCode.precode = res.data.data.precode;
          this.clerkCode.code = res.data.data.code;
          this.clerkCode.editable = res.data.data.editable;
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(res => {
        this.$message({ message: res, type: "error" });
      });
    },

    // 新增界面取消——即返回列表页面
    registerReturn() {
      // 如果psndocCode.code、clerkCode.code不为空，说明是由编码规则来的，取消时，需要回滚
      let pprecode = this.psndocCode.precode;
      let psndoc_code = "";
      if (pprecode) {
        psndoc_code = this.psndocCode.code;
      }
      let cprecode = this.clerkCode.precode;
      let clerk_code = "";
      if (pprecode) {
        clerk_code = this.clerkCode.code;
      }

      if ((pprecode && psndoc_code) || (cprecode && clerk_code)) {
        this.rollbackPreCode(psndoc_code, this.clerkCode.pk_org, clerk_code);
      }
      this.$context.getApp().back();
    },

    // 回滚前编码
    rollbackPreCode(psndocCode, pk_org, clerkCode) {
      let param = {
        psndocCode: psndocCode,
        pk_org: pk_org,
        clerkCode: clerkCode
      };

      this.$http({
        url: this.requestPrefix + this.requestUrl.rollbackCode,
        method: "post",
        params: param
      }).then(res => {
        if (res.data.status === true) {
          // 回滚成功就好了，不用提示
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(res => {
        this.$message({ message: res, type: "error" });
      });
    },

    // 保存
    registerSave() {
      this.registerRealSave("save");
    },

    // 保存并新增
    registerSaveAndNew() {
      this.registerRealSave("saveAndNew");
    },

    // 实际的保存方法
    registerRealSave(type) {
      let $psndoc = this.$refs[this.registerPsndocRef];
      let $psnjob = this.$refs[this.registerPsnjobRef];

      // 对两个表单进行同时校验
      let psndocValidate = $psndoc.checkTemplateData();
      let psnjobValidate = $psnjob.checkTemplateData();

      // 当校验通过时，执行保存逻辑
      if (psndocValidate && psnjobValidate) {
        this.psndocAddData.psndoc = $psndoc.getTemplateData();
        this.psndocAddData.psnjob = $psnjob.getTemplateData();

        let data = JSON.parse(JSON.stringify(this.psndocAddData));

        let trial_begindate = data.psnjob.trial_begindate;
        if (trial_begindate) {
          let begindate = data.psnjob.begindate;
          if (trial_begindate < begindate) {
            this.$message({
              message: "试用开始日期不能早于任职开始时间！",
              type: "error"
            });
            return;
          }
        }

        // 如果生日不为空，则判断是否满法定雇佣年龄
        let birthdate = data.psndoc.birthdate;
        if (birthdate) {
          var oThis = this;
          if (!validateLegalEmpAge(birthdate)) {
            this.$alert("该员工年龄未满国家法定雇佣年龄16岁！不能入职！", "警告", {
              confirmButtonText: "确定",
              type: "warning",
              // remove by zyl 2018-11-14 18:26:57 不满16周岁，强制不允许入职！
              // callback: (action, instance) => {
              //   oThis.validateID(data, type);
              // }
            });
          } else {
            this.validateID(data, type);
          }
        } else {
          this.validateID(data, type);
        }
      }
    },

    // 证件号码合法性校验
    validateID(data, type) {
      let idtype = data.psndoc.idtype;
      let id = data.psndoc.id;

      let params = {
        idType: idtype,
        id: id
      };
      this.$http({
        url: '/hrhi/psndoc/' + this.requestUrl.validateID,
        method: "post",
        params: params
      }).then(res => {
        if (res.data.status === true) {
          let result = res.data.data;
          if (result.status == 0) {
            this.validateRegDate(data, type);
          } else if (result.status == 1) {
            if (result.force) {
              this.$alert(result.msg + "请更正后再保存！", "警告", {
                confirmButtonText: "确定",
                type: "warning",
              });
            } else {
              this.$confirm(result.msg + '是否继续？', "确认继续", {
                confirmButtonText: "是",
                showCancelButton: false,
                cancelButtonText: "否",
                type: "warning"
              }).then(() => {
                this.validateRegDate(data, type);
              }).catch(() => { });
            }
          }
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "校验证件号码失败：", type: "error" });
      });

    },

    // 返聘再聘时间间隔校验
    validateRegDate(data, type) {
      let pk_psndoc = data.psndoc.pk_psndoc;
      if (pk_psndoc) {
        // 主键不为空，说明是
        this.$http({
          url: this.requestPrefix + this.requestUrl.validateRegDate,
          method: "post",
          data: JSON.parse(JSON.stringify(data))
        }).then(res => {
          if (res.data.status === true) {
            // 校验通过
            this.registerAddRealSave(data, type);
          } else {
            this.$confirm(res.data.msg, "确认继续", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              closeOnClickModal: false,
              type: "warning"
            }).then(() => {
              this.registerAddRealSave(data, type);
            }).catch(() => { });
          }
        }).catch(res => {
          this.$message({ message: res, type: "error" });
        });
      } else {
        this.registerAddRealSave(data, type);
      }
    },

    // 校验通过后执行的方法
    registerAddRealSave: function (data, type) {
      this.$http({
        url: this.requestPrefix + this.requestUrl.register,
        method: "post",
        data: data
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          if ("save" === type) {
            this.$refs[this.registerPsndocRef].clearEditData();
            this.$refs[this.registerPsnjobRef].clearEditData();
            this.$router.replace("/hrhi/register/dynamic/" + res.data.data + "?" + this.funcode);
          } else {
            this.registerAddInit();
          }
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(res => {
        this.$message({ message: res, type: "error" });
      });
    },

    // 新增图片存储
    psndocAddDataChange: function (val) {
      this.psndocAddData.psndoc = val;
    },

    // 当触发再入职的时候，设置数据
    changeAddData: function (val) {
      if (val.psndoc) {
        this.$refs[this.registerPsndocRef].setTemplateData(val.psndoc);
      }
      if (val.psnjob) {
        this.$refs[this.registerPsnjobRef].setTemplateData(val.psnjob);
      }
    },

    setDefaultOrg: function () {
      if (this.pk_org || this.pk_dept) {
        let data = this.$refs[this.registerPsnjobRef].getTemplateData();
        if (this.pk_org) {
          data.pk_org = this.pk_org;
        }
        if (this.pk_dept) {
          data.pk_dept = this.pk_dept;
        }
        this.$refs[this.registerPsnjobRef].setTemplateData(data);
      }
    },
  }
};
</script>
