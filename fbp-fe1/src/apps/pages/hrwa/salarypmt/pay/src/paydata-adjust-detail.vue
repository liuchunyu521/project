<template>
  <ifbp-page>
    <ifbp-breadcrumb name="个别调整卡片" v-show="false"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">


<!-- :pkTemp="templatePK"             show-type="form"-->
      <ifbp-panel id="waDatasPanel">
          <ifbp-template ref="ref_datas_c"
                         tpl-id="adjustdetail"
                         :tplData="waDatasData"
                         :editable="canEdit"
                         :tplResetFun="formResetFun"
                         :methods="formMethods">
          </ifbp-template>

 					<ifbp-form-button-area>
		          <el-button type="primary"   @click="confirm" v-show="canEdit">保存</el-button>
		          <el-button type="primary"   @click="editClick" v-show="!canEdit">编辑</el-button>
		          <el-button type="default"   @click="cancel">取消</el-button>
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
      var pk_wa_datas = this.$route.query.id;
      var pk_org = this.$route.query.pk_org ;
      var pk_wa_class = this.$route.query.pk_wa_class ;
      var cperiod = this.$route.query.cperiod ;
      var cyear = this.$route.query.cyear ;
      return {
        // 通过传入的参数判断是新增还是修改操作
          pk_wa_datas: pk_wa_datas,
          pk_org :pk_org,
          pk_wa_class :pk_wa_class,
          cperiod  :cperiod,
          cyear :cyear,
          // ifbp-panel-group所需参数
          scrollDom: "ifbpScrollDom",
          formResetFun:function($node){

              var $psnref = $node.find("[v-model='datas.pk_wa_data']");
              $psnref.attr("v-on:trigger","afterSelectPsn");

              var $itemref = $node.find("[v-model='datas.pk_wa_classitem']");
              $itemref.attr("v-on:trigger","afterSelectClassItem");

              let valueCode = $node.find("[v-model='datas.value']");
              let caculateCode = $node.find("[v-model='datas.caculatevalue']")
              valueCode.attr(":decimals","datas.iflddecimal");
              caculateCode.attr(":decimals","datas.iflddecimal");
              return $node[0].outerHTML;
          },
          formMethods:{

              afterSelectPsn(type, data) {
                  if (type === 'change') {

                      vm.$refs.ref_datas_c.getFormData().psnname = data.value[0].name1;

                      vm.$refs.ref_datas_c.getFormData().checkflag = false;
                      vm.$refs.ref_datas_c.getFormData().pk_wa_classitem = null;
                      vm.$refs.ref_datas_c.getFormData().itemname= null;
                      vm.$refs.ref_datas_c.getFormData().caculatevalue= null;
                      vm.$refs.ref_datas_c.getFormData().iflddecimal= null;
                      vm.$refs.ref_datas_c.getFormData(). value= null;
                  }
              },
              afterSelectClassItem(type, data){
                  if (type === 'change') {
                      var itemKey = data.value[0].itemkey;
                      var value = data.value[0].iflddecimal;

                      vm.$refs.ref_datas_c.getFormData(). iflddecimal= value;
                      vm.$refs.ref_datas_c.getFormData(). value = null;

                      var pk_wa_data =  vm.$refs.ref_datas_c.getFormData().pk_wa_data;


                      this.$http({
                          url: "/hrwa/salarymgt/payData/payData/queryDataById",
                          method: "post",
                          data:{
                              pk_org:pk_org,
                              pk_wa_class :pk_wa_class,
                              cyear : cyear,
                              cperiod : cperiod,
                              pk_wa_data : pk_wa_data
                          }
                      })
                          .then(res => {
                              if (res.data.status === true) {
                                  vm.$refs.ref_datas_c.getFormData(). caculatevalue = res.data.data[itemKey];

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



                  }

              }
          },
        // UI模板所需参数
          templatePK: "0001AA1000000000E9YB",
          waDatasData: {
              datas: {},
              psnparam: {
                  pk_wa_class : pk_wa_class,
                  cyear : cyear,
                  cperiod : cperiod
              },
              itemparam : {
                  pk_wa_class : pk_wa_class,
                  cyear : cyear,
                  cperiod : cperiod,
                  pk_org : pk_org,
              },
              params1: "",
              rules: {
                  pk_wa_data: [{
                      required: true,
                      message: '员工号不能为空',
                      trigger: 'blur'
                  }],
                  pk_wa_classitem: [{
                      required: true,
                      message: '薪资项目不能为空',
                      trigger: 'blur'
                  }],
                  value: [{
                      required: true,
                      message: '调整金额不能为空',
                      trigger: 'blur'
                  }]
              }
        },
        // 基本信息是否为修改态
        canEdit: true
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
        if (!this.pk_wa_datas) return;
        this.$http({
          url: "/hrwa/salarymgt/payData/payDatas/queryAdjustInfoById",
          method: "post",
          data:{pk_wa_datas : this.pk_wa_datas}
        })
          .then(res => {
            if (res.data.status === true) {
              var originalValue = res.data.data;
              this.baseData = JSON.parse(JSON.stringify(originalValue));

              this.$refs.ref_datas_c.setData(
                "datas",
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
      cancel() {
      	if(this.pk_wa_datas){//修改
		        if(this.canEdit == true){//编辑态
		        		this.canEdit = false;
		        	  if(this.baseData == undefined){
				           this.$refs.ref_datas_c.setData("datas", {});
				        }
				        else{
				           this.$refs.ref_datas_c.setData("datas", JSON.parse(JSON.stringify(this.baseData)));
				        }
		        }else{
		        	 let queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
               this.$router.push({path:"/hrwa/paydata/paydataAdjustinfo", query:queryParma}) ;
		        }
      	}else{//新增
      			let queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
            this.$router.push({path:"/hrwa/paydata/paydataAdjustinfo", query:queryParma}) ;
      	}

      },
      editClick(){
      	this.canEdit = true;
      },
      // 基本信息保存按钮操作
      confirm() {
        var data = this.$refs.ref_datas_c.getData("datas");
        this.$refs.ref_datas_c.validate(valid => {
          if (valid) {
            this.$http({
              url: "/hrwa/salarymgt/payData/payDatas/save",
              method: "post",
              data: {
                  uivo : JSON.stringify(data),
                  pk_wa_class : this.pk_wa_class,
                  pk_org : this.pk_org,
                  cyear : this.cyear,
                  cperiod : this.cperiod,
              }
            })
              .then(res => {

                if (res.data.status === true) {
                    this.$message({
                        message: res.data.msg,
                        type: "success"
                    });

                    let queryParam = {
                        pk_org: this.pk_org,
                        pk_wa_class:this.pk_wa_class,
                        cyear:this.cyear,
                        cperiod:this.cperiod
                    };
                    this.$router.push({path : "/hrwa/paydata/paydataAdjustinfo",query:queryParam});
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
