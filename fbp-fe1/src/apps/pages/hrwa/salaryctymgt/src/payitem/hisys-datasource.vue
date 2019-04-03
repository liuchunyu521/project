<template>
  <div style="padding:0 16px 0 0;">
    <br/>
    <div style="width:100%;">
      <el-form ref="form" :model="formData" :rules="rules" label-width="150px">
        <el-form-item label="人事信息:" :required="true" prop="func">
          <el-select placeholder="请选择" v-model="formData.func" @change="funcChange">
            <el-option
              v-for="(item,index) in funcOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <psn-subinf-form ref="psnSubinfRef" :queryParams="queryParams"
                       v-if="formData.func=='psnSubinf'"></psn-subinf-form>
      <el-form ref="form2" label-width="150px">
        <el-form-item label="说明:">
          <span>{{hint}}</span>
        </el-form-item>
      </el-form>

    </div>
    <div class="el-dialog__footer dialog-footer">
      <el-button @click="dialogCancel">取 消</el-button>
      <el-button @click="dialogConfirm" type="primary">确 定</el-button>
    </div>
  </div>
</template>
<script>

  import psnSubinfForm from './hipara-psnSubinf.vue';
  export default {
    props: ['refCode', 'field', 'templateValue', 'isMutiSelect', 'queryParams'],
      components: {
          psnSubinfForm,
      },
    data() {
      return {
        formData:{
          func:'',
        },
          rules:{
              func:[
                  { required: true, message: '请选择', trigger: 'blur' }
              ],
          },
        //薪资信息函数的选项
        funcOptions: [],
        scirptLang:'',
        businessLang:'',
        //确定按钮按下后,回传得数据格式
        selectedData: [{id:'',code:'',name:''}],
        hint: '',
      };
    },
      computed:{
      },
    mounted() {
        this.init();
    },

    methods: {
        funcChange(para){
            if (!para) {
                return;
            }

            for (var i =0; i < this.funcOptions.length; i++) {
                if (this.funcOptions[i].key == para) {
                    this.hint = this.funcOptions[i].hintmsg;
                }
            }
            if("psnSubinf" == para){
                this.$nextTick(function () {
                    this.$refs[this.formData.func + "Ref"].initData(para);
                });
            }
        },
      init(){
        this.$http({
          url: "/hrwa/payitem/detail/queryFunNamesByFrom",
          method: "post",
          data:{ifromflag : 7}
        })
          .then(res => {
            if (res.data.status === true) {
              this.funcOptions = res.data.data;
                if (this.funcOptions && this.funcOptions.length > 0) {
                    this.formData.func = this.funcOptions[0].key;
                    this.funcChange(this.funcOptions[0].key);
                }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(e => {
            this.$message({
              message: "详情获取失败",
              type: "error"
            });
          });
      },

        dialogConfirm: function dialogConfirm() {
          var checkFlg = true;
            this.$refs["form"].validate((valid) => {
                if (!valid) {
                    checkFlg = false;
                }
            });
            if(!checkFlg)return;
            if("psnSubinf" == this.formData.func){
                this.$refs[this.formData.func + "Ref"].validate((valid) => {
                    if (valid) {
                        this.realSave();
                    } else {
                    }
                });

            }else{
                this.realSave();
            }
        },
      realSave() {

          var data = null;
          if("psnSubinf" == this.formData.func){
              data = this.$refs[this.formData.func + "Ref"].getPara();
          }else{
              data = {ifromflag : 7, func:this.formData.func,parentitemkey:this.queryParams.itemkey};
          }
        this.$http({
          url: "/hrwa/payitem/detail/getScriptLangForHi",
          method: "post",
          data:data
        })
          .then(res => {
            if (res.data.status === true) {
//              this.funcOptions = res.data.data;
              this.scirptLang = res.data.data.scirptLang;
              this.businessLang = res.data.data.businessLang;
              this.selectedData[0].id=this.formData.func;
              this.selectedData[0].code=this.scirptLang;
              this.selectedData[0].name=this.businessLang;
              this.$emit('customRefConfirm', this.selectedData);

            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(e => {
            this.$message({
              message: "详情获取失败",
              type: "error"
            });
          });
      },
      dialogCancel: function dialogCancel() {
        this.$emit('customRefCancel');
      },

      showProps: function showProps() {
      },
    },
    created: function created() {
      this.showProps();
    }
  };
</script>
<style>
  /*.small-card {*/
    /*cursor: pointer;*/
    /*background: #fff;*/
    /*height: auto;*/
    /*float: left;*/
    /*width: 18rem;*/
    /*position: relative;*/
    /*z-index: 0;*/
    /*overflow: hidden;*/
    /*box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);*/
    /*box-sizing: border-box;*/
    /*border-radius: 3px;*/
    /*margin: 0.5rem 0 0.5rem 1rem !important;*/
    /*border: 1px solid #bfcbd9;*/
  /*}*/

  /*.scard-title {*/
    /*border-bottom: 1px solid #bfcbd9;*/
  /*}*/

  /*.scard-title-child {*/
    /*height: 40px;*/
    /*padding-top: 10px;*/
    /*padding-left: 7px;*/
    /*padding-right: 10px;*/
  /*}*/

  /*.scard-title-icon {*/
    /*display: inline-block;*/
    /*border-left: 3px solid #EF6161;*/
    /*border-radius: 0px;*/
    /*width: 0px;*/
    /*height: 10px;*/
  /*}*/

  /*.class-name {*/
    /*float: left;*/
    /*display: inline-block;*/
  /*}*/

  /*.class-status {*/
    /*text-align: right;*/
    /*display: inline-block;*/
  /*}*/
</style>
