<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工-基本信息子集
-->
<template>
  <div>
    <ifbp-template :ref="psndocMainRef"
                   :tplId="tpl_id"
                   :tplData="psndocMainData"
                   :editable="psndocMainEdit"
                   :form-show-message="psndocMainEdit"
                   @after-create="afterCreateFunc"
                   :tplResetFun="psndocResetFun"
                   :methods="psndocExtraMethods">
    </ifbp-template>
    <ifbp-form-button-area v-if="psndocMainBtn">
      <el-button type="primary" @click="psndocMainConfirm">保存</el-button>
      <el-button type="default" @click="psndocMainCancel">取消</el-button>
    </ifbp-form-button-area>
  </div>
</template>

<script>
import { validateLegalEmpAge } from "../../../../../common/js/PsndocValidator.js";

export default {
  props: {
    // 模板id
    tpl_id: {
      type: String,
      required: true
    },
    pk_psndoc: String,
    psndocCode: Object,
    codeEditable: Boolean,
    psndocMainEdit: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    psndocMainBtn: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    psndocData: Object,
    funcode: {
      type: String,
      required: true
    },
    requestPrefix: {
      type: String,
      required: true
    }
  },

  data() {
    //在这里添加一个当前界面的this
    const psndocMainThis = this;
    return {
      // UI模板传入参数
      psndocMainRef: "ref_psndoc_c",
      psndocMainId: "psndoc-main-id",
      psndocMainData: {
        // 人员编码disabled属性值
        psndocCodeDisabled: false,
        regionRefParams: {
          // 国家地区默认为中国
          pk_country: "0001Z010000000079UJJ"
        }
      },
      isCreated: false,

      requestUrl: {
        getById: "/getBaseInfoByPK/",
        save: "/saveBaseInfo",
        validateID: "/validateID",
        checkPsnUnique: "/checkPsnUnique"
      },

      //原始数据保存
      originalValue: "",
      psndocResetFun: function ($node) {
        // 姓名失去焦点后，触发事件
        $node.find("[v-model='bd_psndoc.name']").attr("v-on:blur", "nameBlur");
        // 证件号码失去焦点后，触发事件
        $node.find("[v-model='bd_psndoc.id']").attr("v-on:blur", "IDBlur");
        // 给人员编码加上disabled属性
        $node.find("[v-model='bd_psndoc.code']").attr(":disabled", "psndocCodeDisabled");
        return $node[0].outerHTML;
      },

      psndocExtraMethods: {

        // 姓名失去焦点后，触发员工唯一性校验
        nameBlur: function () {
          let data = this["bd_psndoc"];
          let idtype = data.idtype;
          let id = data.id;
          let name = data.name;

          // 姓名、证件类型、证件号码都不为空，校验员工唯一性
          if (!name || !idtype || !id) {
            return;
          }
          this.checkPsnUnique(data);
        },

        // 证件号码失去焦点，触发事件，先校验证件号合法性，再校验员工唯一性
        IDBlur: function () {
          let data = this["bd_psndoc"];
          let idtype = data.idtype;
          let id = data.id;
          let name = data.name;

          // 证件类型、证件号码都不为空，校验证件号码是否合法
          if (!idtype || !id) {
            return;
          }

          let params = {
            idType: idtype,
            id: id
          };
          this.$http({
            url: '/hrhi/psndoc' + psndocMainThis.requestUrl.validateID,
            method: "post",
            params: params
          }).then(res => {
            if (res.data.status === true) {
              let result = res.data.data;

              if (result.birthdate) {
                data.birthdate = result.birthdate;
                data.sex = result.sex;
                let aggData = {};
                aggData.psndoc = data;
                psndocMainThis.$emit("setAddData", aggData);
              }

              if (result.status == 0) {
                // 姓名、证件类型、证件号码都不为空，才校验唯一性
                if (!name) {
                  return;
                } else {
                  this.checkPsnUnique(data);
                }
              } else if (result.status == 1) {
                if (result.force) {
                  this.$alert(result.msg + "请更正！", "警告", {
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
                    // 姓名、证件类型、证件号码都不为空，才校验唯一性
                    if (!name) {
                      return;
                    } else {
                      this.checkPsnUnique(data);
                    }
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

        // 校验新增员工唯一性
        checkPsnUnique: function (data) {
          this.$http({
            url: psndocMainThis.requestPrefix + psndocMainThis.requestUrl.checkPsnUnique,
            method: "post",
            data: JSON.parse(JSON.stringify(data))
          }).then(res => {
            if (res.data.status === true) {
              // 校验通过，不再提示
              // this.$message({
              //   message: res.data.msg,
              //   type: "success"
              // });
            } else {
              let data = res.data.data.msg;
              let tips = [];
              const h = this.$createElement;
              for (let i in data) {
                tips.push(h("p", null, data[i]));
              }
              this.$msgbox({
                title: res.data.data.title,
                type: res.data.data.type,
                message: h("div", null, tips),
                showCancelButton: res.data.data.showCancelButton,
                showConfirmButton: res.data.data.showConfirmButton,
                cancelButtonText: res.data.data.cancelButtonText,
                confirmButtonText: res.data.data.confirmButtonText,
                callback: (action, instance) => {
                  if ("confirm" === action) {
                    psndocMainThis.$emit("setAddData", res.data.data);
                  } else {
                  }
                }
              }).then(action => { });
            }
          }).catch(res => {
            this.$message({ message: res, type: "error" });
          });
        }
      }
    };
  },

  watch: {
    psndocCode: {
      handler(newValue) {
        if (this.isCreated) {
          if (newValue) {
            let data = this.$refs[this.psndocMainRef].getFormData();
            data.code = newValue.code;
            this.$refs[this.psndocMainRef].setFormData(data);
            this.$refs[this.psndocMainRef].setData("psndocCodeDisabled", !newValue.editable);
          } else if (typeof (this.codeEditable) !== "undefined") {
            // 因为this.codeEditable是布尔类型，所以只需判断是否未定义就行了
            this.$refs[this.psndocMainRef].setData("psndocCodeDisabled", !this.codeEditable);
          }
        }
      },
      deep: true
    }
  },

  //初始化加载
  mounted() {
    //数据初始化
    this.requestPsndocMain();
  },

  methods: {
    // 页面加载完触发的方法
    afterCreateFunc() {
      this.isCreated = true;
      if (this.psndocCode) {
        let data = this.$refs[this.psndocMainRef].getFormData();
        data.code = this.psndocCode.code;
        this.$refs[this.psndocMainRef].setFormData(data);
        this.$refs[this.psndocMainRef].setData("psndocCodeDisabled", !this.psndocCode.editable);
      } else if (typeof (this.codeEditable) != "undefined") {
        // 因为this.codeEditable是布尔类型，所以只需判断是否未定义就行了
        this.$refs[this.psndocMainRef].setData("psndocCodeDisabled", !this.codeEditable);
      }
    },

    // 请求基本信息
    requestPsndocMain() {
      if (!this.pk_psndoc) {
        // 没有主键，新增页面，打开新增表单
        this.changeEditValue(true);
        // 新增页面不需要继续请求数据
        return;
      } else {
        this.changeEditValue(false);
      }
      this.$http({
        url: this.requestPrefix + this.requestUrl.getById,
        method: "post",
        params: { pk_psndoc: this.pk_psndoc }
      }).then(res => {
        if (res.data.status === true) {
          this.setTemplateData(res.data.data);
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "人员基本信息获取失败！", type: "error" });
      });
    },

    // 保存按钮操作
    psndocMainConfirm() {
      this.$refs[this.psndocMainRef].validate(valid => {
        if (valid) {
          let data = this.getTemplateData();
          if (typeof this.psndocData.psndoc.photo !== "undefined") {
            data.photo = this.psndocData.psndoc.photo;
          }

          // 如果生日不为空，则判断是否满法定雇佣年龄
          let birthdate = data.birthdate;
          if (birthdate) {
            var oThis = this;
            if (!validateLegalEmpAge(birthdate)) {
              this.$alert("该员工年龄未满国家法定雇佣年龄16岁！不能保存！", "警告", {
                confirmButtonText: "确定",
                type: "warning",
                // remove by zyl 2018-11-14 18:49:37 不满16周岁，强制不允许保存！
                // callback: (action, instance) => {
                //   oThis.validateID(data);
                // }
              });
            } else {
              this.validateID(data);
            }
          } else {
            this.validateID(data);
          }
        }
      });
    },

    // 证件号码合法性校验
    validateID(data) {
      let idtype = data.idtype;
      let id = data.id;

      let params = {
        idType: idtype,
        id: id
      };
      this.$http({
        url: '/hrhi/psndoc' + this.requestUrl.validateID,
        method: "post",
        params: params
      }).then(res => {
        if (res.data.status === true) {
          let result = res.data.data;
          if (result.status == 0) {
            this.psndocMainRealSave(data);
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
                this.psndocMainRealSave(data);
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

    // 实际保存操作
    psndocMainRealSave: function (data) {
      this.$http({
        url: this.requestPrefix + this.requestUrl.save,
        method: "post",
        data: data
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.setTemplateData(res.data.data);
          this.changeEditValue(false);
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "保存失败", type: "error" });
      });
    },

    // 取消操作
    psndocMainCancel: function () {
      this.$refs[this.psndocMainRef].setFormData(
        JSON.parse(JSON.stringify(this.originalValue))
      );
      this.$emit("dataChange", JSON.parse(JSON.stringify(this.originalValue)));
      this.clearEditData();
      this.changeEditValue(false);
    },

    // 修改是否为编辑的状态
    changeEditValue: function (val) {
      this.$emit("editValueChange", val);
    },

    // 校验页面数据
    checkTemplateData: function () {
      let boolean = false;
      this.$refs[this.psndocMainRef].validate(valid => {
        boolean = valid;
      });
      return boolean;
    },

    // 获取当前页面card数据
    getTemplateData: function () {
      let data = this.$refs[this.psndocMainRef].getFormData();
      data.photo = this.psndocData.psndoc.photo;
      return data;
    },

    // 查询或保存以后设置数据
    setTemplateData: function (data) {
      // 这里不对photo的数据流进行操作
      if (data.photo) {
        data.photo = "";
      }

      this.originalValue = data;
      this.$refs[this.psndocMainRef].clearEdit();
      this.$refs[this.psndocMainRef].setFormData(
        JSON.parse(JSON.stringify(data))
      );
      this.$emit("dataChange", data);
    },

    // 重置表单数据
    resetTemplateData: function () {
      let data = this.$refs[this.psndocMainRef].getFormData();
      if (data) {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            data[key] = "";
          }
        }
      }
      this.$refs[this.psndocMainRef].setFormData(data);
      if (this.isCreated) {
        this.$nextTick(function () {
          this.$refs[this.psndocMainRef].getFormComp().clearErrorMessage();
          this.afterCreateFunc();
        });
      }
    },
    // 清除编辑数据
    clearEditData: function () {
      this.$refs[this.psndocMainRef].clearEdit();
    },
  }
};
</script>
