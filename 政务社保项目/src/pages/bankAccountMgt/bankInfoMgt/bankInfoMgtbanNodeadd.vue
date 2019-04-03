/**
  Author:liuchym@yonyou.com
  desc:"银行信息管理 网点新增"
**/
<template>
  <div>
    <a-modal
      :title="info"
      :visible="visible"
      :maskClosable='false'
      :keyboard='false'
      @ok="handleOk"
      width="800px"
      okText="确认"
      cancelText="取消"
      @cancel="handleCancel"
    >
      <a-form
        :form="form"
        @submit="handleSubmit"
      >
        <a-row>
          <a-col :span="12">
              <a-form-item
                label="银行"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.bankInfo',
                    {rules: [{ required: true, message: '请输入银行' }],
                    initialValue: formData.bankInfo
                    }
                  ]"
                >
                <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in bankNameData">{{item.bankName}}</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="行政区划"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              
              <a-cascader
                v-decorator="[
                  'formData.region',
                  {rules: [{ required: true, message: '请输入行政区划' }],
                  initialValue:formData.region
                  }
                ]"
               :options="options" @change="onChange" changeOnSelect />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="网点名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.bankNodeName',
                  {rules: [{ required: true, message: '请输入网点名称' }],
                  initialValue:formData.bankNodeName}
                ]"
              />
            </a-form-item>
          </a-col>
           <a-col :span="12">
            <a-form-item
              label="银行联行号"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.bankNodeSeq',
                  {rules: [{ required: false, message: '' }],
                  initialValue:formData.bankNodeSeq}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="网点地址"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.bankNodeAddress',
                  {rules: [{ required: false, message: '' }],
                  initialValue:formData.bankNodeAddress}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="联系人"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.contacts',
                  {rules: [{ required: false, message: '' }],
                  initialValue:formData.contacts}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="省份"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'formData.province',
                  {rules: [{ required: false, message: '' }],
                  initialValue:formData.province
                }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="城市"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'formData.city',
                  {
                    rules: [{ required: false, message: '' }],
                  initialValue:formData.city}
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
import { setTimeout } from 'timers';

export default {
  name: 'bankinfonodeadd',
  components: {
    
  },
  props:['bankNodedialogvisible','bankNodedialogData'],
  data() {
    return {
      visible: this.bankNodedialogvisible,
      info:'',
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      flag:false, //新增增还是修改
      formData:{
        bankInfo:null,
        region:null,
        bankNodeName:null,
        bankNodeSeq:null,
        bankNodeAddress:null,
        contacts:null,
        province:null,
        city:null
      },
      modifyData:'',
      bankNameData:[],//银行信息数据
      options:'',//行政区划数据参数
    }
  },
  
  created(){
    
      // 获取银行数据
      // var _url='sifc-sms/api/bankInfo';
      // ajaxData("get",_url,'', (res) => {
      //     console.log(res);
      //     this.bankNameData=res.data;
      // });

      
    
      var propsres=this.bankNodedialogData;
      this.bankNameData=propsres[2];
      this.options=propsres[3];
      this.showModal(propsres[0],propsres[1])
  },
  methods: {
   
    showModal(res,data) {
      console.log(data)
      if(res==true){
        this.info='新增网点信息'
        this.flag=res;
      }else {
        this.info='修改网点信息'
        this.flag=res;
        var _data=JSON.parse(JSON.stringify(data));
        if(_data.bankInfo){
          _data.bankInfo=_data.bankInfo.id+'-'+_data.bankInfo.lastModifiedVersion;
        }
        if(_data.region){
          var b=JSON.parse(JSON.stringify(_data.region));
          console.log(b)
          _data.region=[]
          _data.region.push(Number(b))
        }
        this.formData=_data;
      }
    },
    onChange(value,selectedOptions) {//行政区划选择的值
      console.log(value,selectedOptions);
      var _url='sifc-sms/api/region/'+selectedOptions[selectedOptions.length-1].code;
      ajaxData("get",_url,'', (res) => {
        console.log(res.data)
        this.formData.province=res.data.provinc
        this.formData.city=res.data.city
        // this.$set(this.formData, 'province',res.data.provinc);
        // this.$set(this.formData, 'city',res.data.city)
      })
    },
    handleOk(e) {
      this.handleSubmit(e)
    },
    handleCancel(e) {
      this.$emit('onesc')
      this.visible = false;
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
           console.log('Received values of form: ', values);
          // 判断是新增或修改
          var _url='sifc-sms/api/bankNode';
          var params={}
          if(this.flag==true){//走新增接口
            params=values.formData;
            params.region=values.formData.region[values.formData.region.length-1]
            if(params.bankInfo){//系统数据处理
                var array=params.bankInfo.split("-");
                params.bankInfo={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            ajaxData("post",_url,params, (res) => {
              this.$emit("refreshtablerequest")
              this.form.resetFields();
              this.$emit('onesc')
              this.visible = false;
            })
          }else {
            // 走修改接口
            var olddata=JSON.parse(JSON.stringify(this.formData));
            var newdata=values.formData;
            for(var item in olddata){
              if(newdata[item]){
                olddata[item]=newdata[item]
              }
            }
            params=olddata;
            if(params.bankInfo){//系统数据处理
                var array=params.bankInfo.split("-");
                params.bankInfo={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            
            params.region=params.region[params.region.length-1]
            ajaxData("post",_url,params, (res) => {
              console.log(res)
              this.$emit("refreshtablerequest");
              this.form.resetFields();
              this.$emit('onesc')
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
