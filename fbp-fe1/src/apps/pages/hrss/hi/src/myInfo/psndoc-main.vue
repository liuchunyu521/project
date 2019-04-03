<!--
  作者：yangchd
  时间：2018-05-17
  支持：员工自助——员工基本信息
-->
<template>
  <div>
    <ifbp-template  :ref="psndocMainRef"
                    class="psndoc-main-myInfo"
                    :tplId="psndocMainId"
                    :tplData="psndocMainData"
                    :editable="psndocMainEdit"
                    :form-show-message="psndocMainEdit"
                    show-type="form"
                    @after-create="changeAlterFieldsStyle"
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
export default {
  props: {
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
    requestPrefix: {
      type: String,
      required: true
    }
  },

  data() {
    // 在这里添加一个当前界面的this
    const psndocMainThis = this;
    return {
      // 查询code
      infoSetCode: "bd_psndoc",
      // UI模板传入参数
      psndocMainRef: "ref_psndoc_c",
      psndocMainId: "psndoc-main-id",
      psndocMainData: {
        rules: {},
        regionRefParams: {
          // 国家地区默认为中国
          pk_country: "0001Z010000000079UJJ"
        }
      },
      templateUrl: {
        getInfo: "/listInfos",
        save: "/saveBaseInfo"
      },
      // 原始数据保存
      originalValue: "",
      // 本页面所有表单
      cardArray: [],
      alterFields: [],
      psndocResetFun: function ($node) {
        // 自定义颜色添加
        let $items = $node.find("el-form-item");
        if ($items && $items.length > 0) {
          for (let i = 0; i < $items.length; i++) {
            // 给每一个字段做标记，并且记录所有的字段
            $($items[i]).attr("class", $($items[i]).attr("prop"));
            psndocMainThis.cardArray.push($($items[i]).attr("prop"));
          }
        }
        return $node[0].outerHTML;
      },

      psndocExtraMethods: {}
    };
  },

  // 初始化加载
  mounted() {
    // 数据初始化
    this.requestPsndocMain();
  },

  methods: {
    // 请求基本信息
    requestPsndocMain() {
      this.$refs[this.psndocMainRef].formShow = true;
      this.$refs[this.psndocMainRef].tableShow = true;
      this.changeEditValue(false);
      let infoSetCodes = [];
      infoSetCodes.push(this.infoSetCode);
      let data = {
        infoSetCodes: infoSetCodes.join(",")
      };
      this.$http({
        method: "post",
        url: this.requestPrefix + this.templateUrl.getInfo,
        params: data
      }).then(res => {
        if (res.data.status === true) {
          let resData = res.data[this.infoSetCode];
          let alterFields = resData["alterFields"];
          if (alterFields && alterFields.length > 0) {
            this.alterFields = alterFields;
          } 
          this.setTemplateData(resData);

          // 在读取完数据以后，尝试进行一个审核字段变红
          this.$nextTick(function () {
            this.changeAlterFieldsStyle();
          });
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "人员基本信息获取失败", type: "error" });
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
          this.$http({
            url: this.requestPrefix + this.templateUrl.save,
            method: "post",
            data: JSON.parse(JSON.stringify(data))
          }).then(res => {
            if (res.data.status === true) {
              debugger
              let resData = res.data[this.infoSetCode];
              let alterFields = resData["alterFields"];
              if (alterFields && alterFields.length > 0) {
                this.alterFields = alterFields;
              } 
              this.setTemplateData(resData);

              // 在读取完数据以后，尝试进行一个审核字段变红
              this.$nextTick(function () {
                this.changeAlterFieldsStyle();
              });

              this.$message({ message: res.data.msg, type: "success" });
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(res => {
            this.$message({ message: res, type: "error" });
          });
        }
      });
    },

    // 改变需要审核的提示
    changeAlterFieldsStyle: function () {
      debugger
      let alterFields = this.alterFields;
      if (alterFields && alterFields.length > 0) {
        if (this.cardArray && this.cardArray.length > 0) {
          for (let i = 0; i < this.cardArray.length; i++) {
            let $node = $(this.$refs[this.psndocMainRef].$el).find("." + this.cardArray[i]).find("label");
            if (alterFields.includes(this.cardArray[i])) {
              $node.attr("style", "color:red");
            } else {
              $node.removeAttr("style");
            }
          }
        }

      } 
    },

    // 取消操作
    psndocMainCancel: function () {
      this.$refs[this.psndocMainRef].setFormData(
        JSON.parse(JSON.stringify(this.originalValue))
      );
      this.$emit("dataChange", JSON.parse(JSON.stringify(this.originalValue)));
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
    setTemplateData: function (resData) {
      let data = resData["uivo"][0];
      // 这里不对photo的数据流进行操作
      if (data.photo) {
        data.photo = "";
      }
      this.originalValue = data;
      this.$refs[this.psndocMainRef].clearEdit();
      this.$refs[this.psndocMainRef].setFormData(
        JSON.parse(JSON.stringify(this.originalValue))
      );
      this.$emit("dataChange", data);
      this.$emit("dataStatus", resData);
    }
  }
};
</script>

<style>
.psndoc-main-myInfo .el-form--inline .el-form-item__label {
  width: 150px;
}
</style>