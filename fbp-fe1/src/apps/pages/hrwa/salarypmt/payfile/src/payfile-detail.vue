<!--
	作者：offline
	时间：2018-10-15
	描述：薪资档案详情--新版用不到
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="发薪人员详情"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
<!--:pkTemp="templatePK"-->

      <ifbp-panel id="payFilePanel" title="基本信息" >
          <ifbp-template ref="ref_payfile_c"
                         tpl-id="payFileDetail"
                         :tplData="payFileData"
                         :editable="payFileEdit"
                         :tplResetFun="formResetFun">
          </ifbp-template>

        <ifbp-form-button-area v-if="payFileEdit">
          <el-button type="primary"   @click="payFileConfirm">保存</el-button>
          <el-button type="default"   @click="payFileCancel">取消</el-button>
        </ifbp-form-button-area>

        <ifbp-form-button-area v-else>
          <el-button type="primary"  @click="changeEditStatus">编辑</el-button>
        </ifbp-form-button-area>
      </ifbp-panel>

    </ifbp-main-area>
  </ifbp-page>
</template>
<script>

    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins :[pageModelMixin],
    data() {
      var vm = this;
      var pk_wa_data= this.$route.query.pk_wa_data;
      return {
        // 通过传入的参数判断是新增还是修改操作
        pk_wa_data: pk_wa_data,
        scrollDom: "ifbpScrollDom",
        // UI模板所需参数
//        templatePK: "0001AA1000000000EDRO",
        payFileData: {
          payfile: {},
          taxrateparam: {
              pk_org : ""
          },

          rules: {

          }
        },
        formResetFun: function($node) {
           var $ownModule = this.getNodeById($node, 'pk_org');
           $ownModule.attr('v-on:trigger', 'triggerHandle');
           return $node[0].outerHTML;
        },
        formMethods:{
          triggerHandle:function(type, data){
            var id = data.value[0].pk_wa_taxbase;
            this.$refs.ref_payfile_c.setData('taxrateparam',
              {pk_org:id});
          }
        },
        // 基本信息是否为修改态
        payFileEdit: true
      };
    },
    mounted() {

      this.request();
    },
    methods: {
      // 获取数据
      request() {

        this.requestBaseBaseInfo();
      },
      // 请求客户基本信息详情
      requestBaseBaseInfo() {
          this.pk_wa_data = this.$root.$router.currentRoute.params.id;

          this.payFileEdit = this.$root.$router.currentRoute.params.nn == "true";

        if (!this.pk_wa_data) return;

        this.$http({
          url: "/hrwa/payFile/queryPayFileById",
          method: "post",
          data:{pk_wa_data : this.pk_wa_data}
        })
          .then(res => {
            if (res.data.status === true) {
              var originalValue = res.data.data;
              this.baseData = JSON.parse(JSON.stringify(originalValue));
              this.$refs.ref_payfile_c.setData(
                "payfile",
                JSON.parse(JSON.stringify(originalValue))
              );
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(e => {
            console.error(e);
            this.$message({
              message: "详情获取失败",
              type: "error"
            });
          });
      },
      // 基本信息取消按钮操作
      payFileCancel() {

        this.payFileEdit = false;
        if(this.baseData == undefined){
           this.$refs.ref_payfile_c.setData("payfile", {});
        }
        else{
           this.$refs.ref_payfile_c.setData("payfile", JSON.parse(JSON.stringify(this.baseData)));
        }

      },
      // 基本信息保存按钮操作
      payFileConfirm() {

         var data = this.$refs.ref_payfile_c.getData("payfile");

         var derateptg = data.derateptg;
         if(derateptg){

           var r = /^(\d{1,2}(\.\d{1,2})?|100)$/;

             if(!r.test(derateptg)){
              this.$message({
                message: "减税比例只能输入0-100，且最多两位小数",
                type: "error"
              });
              return ;
            }
         }



        this.$refs.ref_payfile_c.validate(valid => {
          if (valid) {
            this.$http({
              url: "/hrwa/payFile/save",
              method: "post",
              data: JSON.parse(JSON.stringify(data))
            })
              .then(res => {

                if (res.data.status === true) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.originalValue = res.data.data;

                  this.$refs.ref_payfile_c.setData(
                    "payfile",
                    JSON.parse(JSON.stringify(this.originalValue))
                  );
                  this.payFileEdit = false;
                  this.baseData =  JSON.parse(JSON.stringify(this.originalValue));
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  message: "更新失败",
                  type: "error"
                });
              });
          }
        });
      },
      changeEditStatus(){
        this.payFileEdit = !this.payFileEdit;
      }

    }
  };
</script>
<style>

</style>
