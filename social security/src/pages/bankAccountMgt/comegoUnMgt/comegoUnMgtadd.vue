/**
  Author:liuchym@yonyou.com
  desc:"往来单位账户新增"
**/
<template>
  <div>
    <a-modal
      title="往来单位账户"
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
              label="开户行名"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.accountName',
                  {rules: [{ required: false, message: '' }],
                    initialValue: formData.accountName
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="银行账号"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'formData.accountNo',
                  {rules: [
                    { pattern:/([\d]{4})([\d]{4})([\d]{4})([\d]{4})([\d]{0,})?/, message: '请输入正确银行账号' },
                    { required: true, message: '请输入银行账号' }],
                    initialValue: formData.accountNo
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="往来单位"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.contanctOrg',
                    {rules: [{ required: false,message: '请输入往来单位'}],
                    initialValue: formData.contanctOrg
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in orgNameData">{{item.orgName}}</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
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
          </a-col> -->
          <a-col :span="12">
              <a-form-item
                label="账户类型"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.accountType',
                    {rules: [{ required: false }],
                    initialValue: formData.accountType
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in bankNameData">{{item.asValue}}</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="基金险种"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-select
                  v-decorator="[
                    'formData.insType',
                    {rules: [{ required: true, message: '请输入基金险种' }],
                    initialValue: formData.insType
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in insTypeData">{{item.asValue}}</a-select-option>
                </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="开户银行"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.bankInfo',
                    {rules: [{ required: false }],
                    initialValue: formData.bankInfo
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in bankInfoData">{{item.bankName}}</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
           <a-col :span="12">
              <a-form-item
                label="网点"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.bankNode',
                    {rules: [{ required: true, message: '请输入网点'  }],
                    initialValue: formData.bankNode
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in bankNodeData">{{item.bankNodeName}}</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="人行联行号"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'formData.bankNodeSeq',
                  {rules: [{ required: false, message: '请输入人行联行号' }],
                    initialValue: formData.bankNodeSeq
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="是否使用"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'formData.state',
                    {rules: [{ required: false }],
                    initialValue: formData.state
                    }
                  ]"
                >
                  <a-select-option value="1">
                    是
                  </a-select-option>
                  <a-select-option value="0">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="省份"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'formData.province',
                  {rules: [{ required: false, message: '' }],
                    initialValue: formData.province
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="城市"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'formData.city',
                  {rules: [{ required: false, message: '' }],
                    initialValue: formData.city
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
                  {rules: [{ required: false, message: '' }],
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
      formData:{//表单提交的数据
        accountName:null,
        accountNo:null,
        contanctOrg:null,
        // orgType:null,
        accountType:null,
        insType:null,
        bankInfo:null,
        bankNode:null,
        state:null,
        remarks:null
      },
      orgNameData:'',//往来单位数据
      // orgTypeData:'',//单位类型数据
      bankNameData:'',//账户类型数据
      bankInfoData:'',//开户银行数据
      bankNodeData:'',//网点数据
      insTypeData:'',//险种数据
    }
  },
  computed:{
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  created(){
    var _data=this.dialogData;
    this.orgNameData=_data[2];
    // this.orgTypeData=_data[3];
    this.bankNameData=_data[4];
    this.bankInfoData=_data[5];
    this.bankNodeData=_data[6];
    this.insTypeData=_data[7];

    this.showModal(_data[0],_data[1])
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
        if(_data.contanctOrg){
          _data.contanctOrg=_data.contanctOrg.id+'-'+_data.contanctOrg.lastModifiedVersion;
        }
        if(_data.accountType){
          _data.accountType=_data.accountType.id+'-'+_data.accountType.lastModifiedVersion;
        }
        if(_data.insType){
          _data.insType=_data.insType.id+'-'+_data.insType.lastModifiedVersion;
        }
        if(_data.bankInfo){
          _data.bankInfo=_data.bankInfo.id+'-'+_data.bankInfo.lastModifiedVersion;
        }
        if(_data.bankNode){
          _data.province=_data.bankNode.province;
          _data.city=_data.bankNode.city;
          _data.province=_data.bankNode.province;
        }
        if(_data.bankNode){
          _data.bankNode=_data.bankNode.id+'-'+_data.bankNode.lastModifiedVersion;
        }
       
        this.formData=_data;
      }
    },
    handleOk(e) {
      // console.log(this.$refs.singleTable.setCurrentRow(row));
      this.handleSubmit(e)
    },
    handleSubmit (e) {//可以在优化一下代码
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          // 判断是新增或修改
          var _url=this.service_sms+'/api/ContanctOrgAccount';
          var params={}
          if(this.flag==true){//走新增接口
            params=values.formData;
           
            if(params.contanctOrg){//往来单位数据处理
                var array=params.contanctOrg.split("-");
                params.contanctOrg={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            
            if(params.accountType){//账户类型数据处理
                var array=params.accountType.split("-");
                params.accountType={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(params.insType){//险种数据处理
                var array=params.insType.split("-");
                params.insType={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(params.bankInfo){//开户银行数据处理
                var array=params.bankInfo.split("-");
                params.bankInfo={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(params.bankNode){//网点数据处理
                var array=params.bankNode.split("-");
                params.bankNode={
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
           if(params.contanctOrg){//往来单位数据处理
                var array=params.contanctOrg.split("-");
                params.contanctOrg={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            
            if(params.accountType){//账户类型数据处理
                var array=params.accountType.split("-");
                params.accountType={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(params.insType){//险种数据处理
                var array=params.insType.split("-");
                params.insType={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(params.bankInfo){//开户银行数据处理
                var array=params.bankInfo.split("-");
                params.bankInfo={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(params.bankNode){//网点数据处理
                var array=params.bankNode.split("-");
                params.bankNode={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
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
    
  }
}
</script>

<style lang="less" >

.ant-row .ant-form-item {
  margin-bottom: 0px;
}
</style>
