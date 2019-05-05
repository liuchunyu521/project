/**
  Author:liuchym@yonyou.com
  desc:"银行信息管理 银行新增"
**/
<template>
  <div>
    <a-modal
      :title="info"
      v-model="visible"
      @ok="handleOk"
      width="800px"
      okText="确认"
      cancelText="取消"
       @cancel="handleCancel1"
    >
      <a-form
        :form="form"
        @submit="handleSubmit"
      >
        <a-row>
          <a-col :span="12">
              <a-form-item
                label="银行代码"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-input
                  v-decorator="[
                    'formData.bankCode',
                    {
                      rules: [{ required: true, message: '请输入银行代码' }],
                      initialValue:formData.bankCode
                      }
                  ]"
                />
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="银行名称"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.bankName',
                  {
                    rules: [{ required: true, message: '请输入银行名称' }],
                    initialValue:formData.bankName
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="备注"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-textarea placeholder="" :autosize="{ minRows: 2, maxRows: 6 }" 
                v-decorator="[
                  'formData.remarks',
                  {
                    rules: [{ required: false, message: '' }],
                    initialValue:formData.remarks
                  }
                ]"
              />
  
             
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { ajaxData } from '../../components/mixins/ajaxdata.js';
export default {
  name: 'unitaccountaddalert',
  components: {
    
  },
  data() {
    return {
      visible: false,
      info:'',
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      flag:false, //新增增还是修改
      formData:{
        bankCode:null,
        bankName:null,
        remarks:null
      },
      modifyData:''
    }
  },
  computed:{
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  methods: {
    
    handleCancel1(e) {
      console.log('Clicked cancel button');
      this.visible = false;

      this.form.resetFields();
      this.formData.bankCode=null;
      this.formData.bankName=null;
      this.formData.remarks=null;
    },
    showModal(res,data) {
      console.log(res)
      if(res==true){
        this.info='新增银行信息'
        this.flag=res;
        console.log("新增")
      }else {
        this.info='修改银行信息'
        this.flag=res;
        console.log("修改",data)
        this.modifyData=data;
        this.formData.bankCode=data.bankCode
        this.formData.bankName=data.bankName
        this.formData.remarks=data.remarks
      }
      this.visible = true
    },
    handleOk(e) {
      // console.log(this.$refs.singleTable.setCurrentRow(row));
      this.handleSubmit(e)
      
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
           console.log('Received values of form: ', values);
          // 判断是新增或修改
          var _url=this.service_sms+'/api/bankInfo';
          var params={}
          if(this.flag==true){//走新增接口
            params.bankCode=values.formData.bankCode
            params.bankName=values.formData.bankName
            params.remarks=values.formData.remarks
            ajaxData("post",_url,params, (res) => {
              console.log(res)
              this.$emit("refreshbankinfo")
              this.form.resetFields();
              this.visible = false;
            })
          }else {
            // 走修改接口
            params=this.modifyData;
            console.log(params)
            params.bankCode=values.formData.bankCode
            params.bankName=values.formData.bankName
            params.remarks=values.formData.remarks
            ajaxData("post",_url,params, (res) => {
              console.log(res)
              this.$emit("refreshbankinfo")
              this.form.resetFields();
              this.visible = false;
            })
          }
         
        }
      });
    }
  }
}
</script>

<style lang="less" >


</style>
