<template>
  <ifbp-page>
    <ifbp-breadcrumb name="时点薪资详情"></ifbp-breadcrumb>
    <!-- 主体区域   :pkTemp="templatePK"  show-type="form"-->
    <ifbp-main-area type="detail">



      <ifbp-panel id="waDatasPanel">
          <ifbp-template ref="ref_ontime_c"
                         tpl-id="ontimedetail"
                         :tplData="onTimeData"
                         :editable="canEdit"
                         :tplResetFun="formResetFun">
          </ifbp-template>



        <ifbp-form-button-area  v-if="canEdit">
          <el-button type="primary"   @click="confirm">保存</el-button>
          <el-button type="default"   @click="cancel">取消</el-button>
        </ifbp-form-button-area>

        <ifbp-form-button-area  v-else>
          <el-button type="primary"   @click="changeEditStatus">编辑</el-button>
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
      var pk_org = this.$route.query.pk_org ;
      var pk_wa_class = this.$route.query.pk_wa_class ;
      var cperiod = this.$route.query.cperiod ;
      var cyear = this.$route.query.cyear ;
      var onTimeDataParam = sessionStorage.getItem('onTimeDataParam');
      return {
          pk_org :pk_org,
          pk_wa_class :pk_wa_class,
          cperiod  :cperiod,
          cyear :cyear,
          onTimeDataParam : onTimeDataParam,
          // ifbp-panel-group所需参数
          scrollDom: "ifbpScrollDom",
        // UI模板所需参数
          templatePK: "0001AA1000000000K0OZ",
          onTimeData: {
              ontime: {},
              rules: {
                  basedays: [{
                      required: true,
                      message: '基准天数不能为空',
                      trigger: 'blur'
                  }],
                  m_wanceforedays: [{
                      required: true,
                      message: '调整前天数不能为空',
                      trigger: 'blur'
                  }],
                  m_wanbeforemoney: [{
                      required: true,
                      message: '调整前日薪不能为空',
                      trigger: 'blur'
                  }],
                  m_wanafterdays: [{
                      required: true,
                      message: '调整后天数不能为空',
                      trigger: 'blur'
                  }],
                  m_wanaftermoney: [{
                      required: true,
                      message: '调整后日薪不能为空',
                      trigger: 'blur'
                  }]
              }
        },
        // 基本信息是否为修改态
        canEdit: false,
          formResetFun:function($node){
              let moneyCode = $node.find("[v-model='ontime.m_wadocnmoney']");
              let oldMoneyCode = $node.find("[v-model='ontime.m_oldwadocnmoney']");
              let wanMoneyCode = $node.find("[v-model='ontime.m_wanmoney']")

              moneyCode.attr(":decimals","ontime.iflddecimal");
              oldMoneyCode.attr(":decimals","ontime.iflddecimal");
              wanMoneyCode.attr(":decimals","ontime.iflddecimal");
              return $node[0].outerHTML;
          }
      };
    },
    mounted() {
       this.request();
    },
    methods: {
      // 获取数据
      request() {

          var data = JSON.parse(this.onTimeDataParam);
          this.$refs.ref_ontime_c.setData(
              "ontime",
              JSON.parse(JSON.stringify(data))
          );
      },

      // 基本信息取消按钮操作
      cancel() {
        this.canEdit = false;
        var data = JSON.parse(this.onTimeDataParam);
        this.$refs.ref_ontime_c.setData(
            "ontime",
            JSON.parse(JSON.stringify(data))
        );

      },
      // 基本信息保存按钮操作
      confirm() {

        var data = this.$refs.ref_ontime_c.getData("ontime");
        var url = "/hrwa/payData/payDataOnTime/save" ;
        this.$refs.ref_ontime_c.validate(valid => {
          if (valid) {
              this.$http({
                  url: url,
                  method: "post",
                  data: {
                      uivo :JSON.stringify(data),
                      pk_wa_class : this.pk_wa_class,
                      pk_org :this.pk_org,
                      cyear : this.cyear,
                      cperiod : this.cperiod
                  }
              })
              .then(res => {

                if (res.data.status === true) {
                    this.$message({
                        message: res.data.msg,
                        type: "success"
                    });
                    sessionStorage.removeItem('onTimeDataParam') ;
                    let queryParma = {
                            pk_org:this.pk_org,
                            pk_wa_class:this.pk_wa_class,
                            cyear:this.cyear,
                            cperiod:this.cperiod
                    };
                    this.$router.push({path:"/hrwa/paydata/ontimeinfo",query:queryParma});
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
        this.canEdit = !this.canEdit;
      }


    }
  };
</script>
<style>

</style>
