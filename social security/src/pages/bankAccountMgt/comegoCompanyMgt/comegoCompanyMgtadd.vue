/**
  Author:liuchym@yonyou.com
  desc:"往来单位新增"
**/
<template>
  <div>
    <a-modal
      title="往来单位"
      :visible="visible"
      @ok="handleOk"
      width="800px"
      okText="保存"
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
              label="单位"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'formData.organization',
                  {rules: [{ required: false, message: '请输入网点名称' }],
                    initialValue: formData.organization
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="往来单位代码"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.orgCode',
                  {rules: [{ required: true, message: '请输入往来单位代码' }],
                    initialValue: formData.orgCode
                }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="往来单位名称"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.orgName',
                  {rules: [{ required: true, message: '请输入往来单位名称' }],
                    initialValue: formData.orgName
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="单位类型"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.orgType',
                    {rules: [{ required: false }],
                    initialValue: formData.orgType
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in orgTypeData">{{item.asValue}}</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="所属地区"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-cascader
                  v-decorator="[
                    'formData.region',
                    {rules: [{ required: true, message: '请输入行政区划' }],
                    initialValue:formData.region
                    }
                  ]"
                :options="regoinData" @change="onChange" changeOnSelect />
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="联系人"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.contacts',
                  {rules: [{ required: false }],
                    initialValue: formData.contacts
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="联系方式"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.contactPhone',
                  {rules: [{ required: false}],
                    initialValue: formData.contactPhone
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="备注"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-textarea placeholder="" :autosize="{ minRows: 2, maxRows: 6 }"
                 v-decorator="[
                  'formData.remarks',
                  {rules: [{ required: false }],
                    initialValue: formData.remarks
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
  name: 'comegoCompanyMgtadd',
  components: {
    
  },
  props:['dialogvisible','dialogData'],
  data() {
    return {
      visible: this.dialogvisible,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      orgTypeData:'',//单位类型数据
      regoinData:'',//所属地区数据
      formData:{
        organization:null,
        orgCode:null,
        orgName:null,
        orgType:null,
        region:null,
        contacts:null,
        contactPhone:null,
        remarks:null
      },
      flag:false, //新增增还是修改
      organizationData:''
    }
  },
  created(){
    // console.log(this.dialogvisible)
    console.log(this.dialogData)
    var propsres=this.dialogData;
    this.regoinData=propsres[3];
    this.orgTypeData=propsres[4];
    this.organizationData=propsres[2];
    this.formData.organization=this.organizationData.name;
    this.showModal(propsres[0],propsres[1]);
  },
  methods: {
    handleCancel(e) {
      this.$emit('onesc')
      this.visible = false;
    },
    showModal(res,data) {
      console.log(data)
      if(res==true){
        this.flag=res;
      }else {
        this.flag=res;
        var _data=JSON.parse(JSON.stringify(data));
        if(_data.orgType){
          _data.orgType=_data.orgType.id+'-'+_data.orgType.lastModifiedVersion;
        }
        if(_data.region){
          var b=JSON.parse(JSON.stringify(_data.region));
          console.log(b)
          _data.region=[]
          _data.region.push(Number(b))
        }
        if(_data.organization){
          this.organizationData=_data.organization;
          _data.organization=_data.organization.code+' '+_data.organization.name
        }
        this.formData=_data;
       
      }
    },
    handleOk(e) {
      this.handleSubmit(e)
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
           console.log('Received values of form: ', values);
          // 判断是新增或修改
          var _url='sifc-sms/api/ContanctOrg';
          var params='';
          if(this.flag==true){//走新增接口
            params=values.formData;
            // params.organization=this.organizationData.id;
            params.organization=3;//测试用的
            params.region=values.formData.region[values.formData.region.length-1]
            if(params.orgType){//系统数据处理
                var array=params.orgType.split("-");
                params.orgType={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            ajaxData("post",_url,params, (res) => {
              this.$emit("refreshrequest")
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
            if(params.orgType){//系统数据处理
                var array=params.orgType.split("-");
                params.orgType={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            
            params.region=params.region[params.region.length-1];
            params.organization=this.organizationData.id;
            ajaxData("post",_url,params, (res) => {
              console.log(res)
              this.$emit("refreshrequest");
              this.form.resetFields();
              this.$emit('onesc')
              this.visible = false;
            })
          }
        }
      });
    },
    onChange(value,selectedOptions) {//行政区划选择的值
      console.log(value,selectedOptions);
      // this.formData.region=selectedOptions[selectedOptions.length-1].value;
    },
    
  }
}
</script>

<style lang="less" >


</style>
