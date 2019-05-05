/**
  Author:liuchym@yonyou.com
  desc:"单位账户新增修改"
**/
<template>
  <div>
    <a-form
      class="form"
      :form="form"
      @submit="handleSubmit"
    >
      <div class="L_list">
        <div class="title">账户信息</div>
        <div class="content">
          <a-row class="form-row">
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="单位代码"
              >
                <a-input
                  disabled
                  v-decorator="['formData.organization',
                  {
                    rules: [{ required:false}],
                    initialValue: formData.organization
                  }]"
                  
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="单位名称"
              >
                <a-input
                  disabled
                  v-decorator="[
                  'organizationName',
                    {initialValue:organizationName}
                  ]"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="行政区划"
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
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="开户银行 "
              >
                 <a-select
                  @change="bankInfohandleChange"
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
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="账号名称"
              >
                <a-input
                  v-decorator="['formData.accountName',
                    {rules: [{ required: false }],
                    initialValue: formData.accountName}
                  ]"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="银行账号"
              >
                <a-input
                  v-decorator="[
                    'formData.bankAccount',
                    {rules: [
                      { pattern:/([\d]{4})([\d]{4})([\d]{4})([\d]{4})([\d]{0,})?/, message: '请输入正确银行账号' },
                      { required: true, message: '请输入银行账号' }
                      ],
                    initialValue:formData.bankAccount
                  }]"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="账户类型"
              >
                <a-select
                  v-decorator="[
                    'formData.accountType',
                    {rules: [{ required: false }],
                    initialValue: formData.accountType
                    }
                  ]"
                >
                  <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in accountTypeData">{{item.asValue}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> 
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="账户状态 "
              >
               
                <a-radio-group buttonStyle="solid"
                  v-decorator="['formData.state',
                    {
                      rules: [{ required: false }],
                      initialValue:formData.state
                    }
                  ]"
                >
                  <a-radio-button :value="1">启用</a-radio-button>
                  <a-radio-button :value="0">停用</a-radio-button>
                  <a-radio-button :value="2">待处理</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>  
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="是否存在子账号"
              >
                <a-radio-group  buttonStyle="solid"
                  v-decorator="[
                    'formData.isSubAccount',
                    {
                      rules: [{ required: false }],
                      initialValue: formData.isSubAccount
                    }
                  ]"
                >
                  <a-radio-button :value="1">是</a-radio-button>
                  <a-radio-button :value="0">否</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col> 
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="开户日期"  
              >
                <a-date-picker
                  placeholder="选择开户日期"
                   v-decorator="['formData.enableDate', {
                      rules: [{ required: false }],
                      initialValue:formData.enableDate==null? formData.enableDate : moment(formData.enableDate, dateFormat) 
                    }]" :format="dateFormat"/>
              </a-form-item>
            </a-col> 
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="停用日期"
              >
                <a-date-picker
                  placeholder="选择停用日期"
                 v-decorator="['formData.disableDate', {
                      rules: [{ required: false }],
                      initialValue:formData.disableDate==null? formData.disableDate : moment(formData.disableDate, dateFormat) 
                    }]" :format="dateFormat"/>
              </a-form-item>
            </a-col> 
          </a-row>
        </div>
      </div>
    <!-- 网点区域 -->
      <div class="L_list" style="margin-top:8px">
        <div class="title">银行网点</div>
        <div class="content">
          <a-row class="form-row">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="网点代码"
              >
                <a-input-search 
                   @search="bankNodeCodeFuc"
                   disabled
                  v-decorator="[
                  'formData.bankNode',
                  {rules: [{ required: true, message: '请输入网点代码' }],
                  initialValue: bankNodeData.bankNodeSeq
                  }]"
                >
                 <a-button slot="enterButton" >...</a-button>
                </a-input-search>
              </a-form-item>
            </a-col> 
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="网点名称"
              >
                <a-input
                  disabled
                  v-decorator="['bankNodeData.bankNodeName',
                  {rules: [{ required: false, message: '请输入账户类型' }],
                  initialValue: bankNodeData.bankNodeName
                  }]"
                >
                </a-input>
              </a-form-item>
            </a-col> 
            <a-col :lg="12" :md="24" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="网点地址"
              >
                <a-input
                  disabled
                  v-decorator="['bankNodeData.bankNodeAddress',
                  {rules: [{ required: false, message: '请输入账户类型' }],
                  initialValue:bankNodeData.bankNodeAddress
                  }]"
                >
                </a-input>
              </a-form-item>
            </a-col> 
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="人行联行号"
              >
                <a-input
                  disabled
                  v-decorator="['bankNodeData.bankNodeSeq',{
                  initialValue:bankNodeData.bankNodeSeq
                  }]"
                >
                </a-input>
              </a-form-item>
            </a-col> 
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="省份"
              >
                <a-input
                  disabled
                  v-decorator="['bankNodeData.province',{
                  initialValue:bankNodeData.province
                  }]"
                >
                </a-input>
              </a-form-item>
            </a-col> 
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="城市"
              >
                <a-input
                  disabled
                  v-decorator="['bankNodeData.city',{
                  initialValue:bankNodeData.city
                  }]"
                >
                </a-input>
              </a-form-item>
            </a-col> 
          </a-row>
        </div>
      </div>
      <add-details ref="adddetails" v-if="adddetailsvisible" :subAccountListdata='subAccountListdata'></add-details>

     </a-form>
     <footer-tool-bar>
      <a-button type="primary" @click="Flowingwater()">流水记录</a-button>
      <a-button type="primary" @click="updatarequestbalance()">更新余额</a-button>
      <a-button type="primary" @click="check">保存</a-button>
      <!-- <a-button type="primary" >打印</a-button> -->
    </footer-tool-bar>
    <dotCodealert :dotCodealertvisible="dotCodealertvisible" :bankNodeListData='bankNodeListData' @onEsc="onEsc" v-if="dotCodealertvisible==true"></dotCodealert>
    <streamRecordalert :streamRecordalert="streamRecordalert"  @onEscstream="onEscstream" v-if="streamRecordalert==true"></streamRecordalert>
  </div>
</template>

<script>
import addDetails from './components/addCpt/adddetails';
import dotCodealert from './components/addCpt/dotCodealert';
import streamRecordalert from './components/addCpt/streamRecordalert';
import FooterToolBar from '../../../components/tool/FooterToolBar';
import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  name: 'unitaccountadd',
  components: { addDetails,FooterToolBar,dotCodealert ,streamRecordalert},
  mixins:[deleteEmptyProperty], 
  props:["updaterequest",'unitdata','accountTypeData','options','bankNameData'],
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',//日期类型
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      options:this.options,//行政区划数据参数
      bankNameData:this.bankNameData,//银行数据参数
      accountTypeData:this.accountTypeData,//账户类型数据参数
      // 表单字段
      
      // 表单字段
      formData:{
        organization:null,//单位代码，单位名称 只传id 就行
        regoin: null,//ID+版本
        bankNode: null,//网点传id
        bankInfo: null,//id+版本
        accountName: null,//账户名称
        bankAccount:null,//银行账号
        accountType: null,//账户类型 id+版本
        isSubAccount: 1,//是否存在子级账号
        enableDate: null,//开户日期
        disableDate: null,//停用日期
        state: 1,//账户状态
      },
      organizationName:'',//单位名称
      dotCodealertvisible:false,//是否显示网点弹框
      streamRecordalert:false,//是否显示流水弹框
      bankNodeData:'',//网点展示数据
      bankNodeListData:'',//网点列表数据
      subAccountListdata:'',//修改时候子账户数据;
      adddetailsvisible:false,//详细显示隐藏
      modifyoldData:'',//修改前的老数据
      updaterequestvisible:false,//判断是否是修改；
    }
  },
  computed:{
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  mounted(){

    console.log(this.updaterequest)
    console.log(this.unitdata)
    if(this.updaterequest){//修改数据处理；
      this.updaterequestvisible=true;
      let _Data=this.updaterequest;
      let _Datalist=this.updaterequest.subAccountLists;

      this.formData.organization=JSON.parse(JSON.stringify(_Data.organization.id));//单位代码赋值；
      this.organizationName=_Data.organization.name;//单位名称赋值；
      // 网点赋值
      this.formData.bankNode=_Data.bankNode.id;
      this.bankNodeData=_Data.bankNode;

      //数据处理
      if(_Data.bankNode){
         _Data.bankNode=_Data.bankNode.id+'-'+_Data.bankNode.lastModifiedVersion;
      }
      if(_Data.bankInfo){
         _Data.bankInfo=_Data.bankInfo.id+'-'+_Data.bankInfo.lastModifiedVersion;
      }
      if(_Data.accountType){
         _Data.accountType=_Data.accountType.id+'-'+_Data.accountType.lastModifiedVersion;
      }
      if(_Data.createDate){
         _Data.createDate=this.date(_Data.createDate)
      }
      if(_Data.disableDate){
         _Data.disableDate=this.date(_Data.disableDate)
      }
      if(_Data.organization){
         _Data.organization=_Data.organization.id;
      }
      
      for(let i=0;i<_Datalist.length;i++){
        if(_Datalist[i].insType){
          _Datalist[i].insType=_Datalist[i].insType.id+'-'+_Datalist[i].insType.lastModifiedVersion;
        }
      }
      
      this.bankInfohandleChange(_Data.bankInfo);
      this.formData=_Data;
      this.modifyoldData=_Data;
      this.subAccountListdata=_Datalist;
      this.adddetailsvisible=true;
    }else {
      debugger
      this.formData.organization=this.unitdata.id;//单位代码赋值；
      this.organizationName=this.unitdata.label;//单位名称赋值；
      this.adddetailsvisible=true;
    }
  },
  methods: {
    moment,
    Flowingwater(){//流水记录
    console.log('liushui')
      this.streamRecordalert=true;
    },
    onEscstream(){
      this.streamRecordalert=false;
    },
    updatarequestbalance(){//更新余额
      this.$refs.adddetails.updatarequestbalance();
    },
    bankNodeCodeFuc(res){//显示网点信息
      if(this.bankNodeListData){
        this.dotCodealertvisible=true;
      }else {
        this.$message.warning('请选择开户银行');
      }
      
    },
    onEsc(res){
      if(res){//网点数据赋值
        this.bankNodeData=res;
        
      }
      this.dotCodealertvisible=false;
    },
    bankInfohandleChange(val){//通过银行获取网点
      console.log(val)
      var id=val.split("-")[0];
      var e_url=this.service_sms+'/api/bankNode?bankInfo.id='+id;
      ajaxData("get",e_url,'', (res) => {
          this.bankNodeListData=res.data;
      });
    },
   
     check  (e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
             // 处理数据
            if(values.formData.disableDate){
              values.formData.disableDate=values.formData['disableDate'].format('YYYY-MM-DD')
            }
            if(values.formData.enableDate){
              values.formData.enableDate=values.formData['enableDate'].format('YYYY-MM-DD')
            }
            if(values.formData.region){
              values.formData.region=values.formData.region[0]
            }
            if(values.formData.accountType){
              var array=values.formData.accountType.split("-");
              values.formData.accountType={
                  "id":array[0],
                  "lastModifiedVersion":array[1]
              }
            }
            if(values.formData.bankInfo){
              var array=values.formData.bankInfo.split("-");
              values.formData.bankInfo={
                  "id":array[0],
                  "lastModifiedVersion":array[1]
              }
            }
            if(values.formData.bankNode){
              values.formData.bankNode={
                id:this.bankNodeData.id,
                lastModifiedVersion:this.bankNodeData.lastModifiedVersion
              };
            }
            console.log('Received values of form: ', values);
            var Data=values.formData;
            var calbackdata=this.$refs.adddetails.handle();
            Data.subAccountLists=calbackdata;
            console.log(Data)

            if(this.updaterequestvisible==true){
               Data.id=this.modifyoldData.id;
               Data.lastModifiedVersion=this.modifyoldData.lastModifiedVersion;
            }
          //  新增保存
            var l_url=this.service_sms+'/api/unitAccount';
            ajaxData("post",l_url,Data, (res) => {
              console.log(res)
               this.$message.success('保存成功');
              // 提交 保存成功跳回列表页
              this.$emit('addisShow');
            });

          }
        });
    },
    handleSubmit  (e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    date(time){
        let oldDate = new Date(time)
        let newDate = new Date()
        var dayNum = "";
        var getTime = (newDate.getTime() - oldDate.getTime())/1000;

        if(getTime < 60*5){
            dayNum = "刚刚";
        }else if(getTime >= 60*5 && getTime < 60*60){
            dayNum = parseInt(getTime / 60) + "分钟前";
        }else if(getTime >= 3600 && getTime < 3600*24){
            dayNum = parseInt(getTime / 3600) + "小时前";
        }else if(getTime >= 3600 * 24 && getTime < 3600 * 24 * 30){
            dayNum = parseInt(getTime / 3600 / 24 ) + "天前";
        }else if(getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12){
            dayNum = parseInt(getTime / 3600 / 24 / 30 ) + "个月前";  
        }else if(time >= 3600 * 24 * 30 * 12){
            dayNum = parseInt(getTime / 3600 / 24 / 30 / 12 ) + "年前";  
        }

        let year   = oldDate.getFullYear();
        let month  = oldDate.getMonth()+1;
        let day    = oldDate.getDate();
        let hour   = oldDate.getHours(); 
        let minute = oldDate.getMinutes(); 
        let second = oldDate.getSeconds(); 
        // return dayNum+" "+year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
        return year+"-"+month+"-"+day
    }
  }
}
</script>

<style lang="less" scoped>
.L_list {
  .title {
    height: 40px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px 4px 0 0;
  }
  .content {
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px  4px;
    padding: 16px;  
  }

}
.form {
  .ant-col-sm-24 , .ant-col-md-12 ,.ant-col-lg-8 {
    height: 50px;
  }
}
</style>
