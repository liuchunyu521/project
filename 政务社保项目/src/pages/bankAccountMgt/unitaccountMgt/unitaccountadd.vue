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
                  v-decorator="['userName1',
                  {
                    rules: [{ required:false}],
                    initialValue: ''
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
                  v-decorator="['userName2']"
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
                <a-select
                  v-decorator="[
                    'bankNode.regoinId',
                    {
                      rules:[{required:false}],
                      initialValue:updaterequest =='' ? initformData.bankNode.regoinId : formData.bankNode.regoinId
                    }
                  ]"
                >
                  <a-select-option value="1000">
                    China1
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A1
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="开户银行 "
              >
                <a-select
                  v-decorator="[
                    'bankName',
                    {rules: [{ required: true, message: '请输入开户银行' }],
                    initialValue: updaterequest =='' ? initformData.bankName : formData.bankName
                    }
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
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
                  v-decorator="['accountName',
                    {rules: [{ required: false }],
                    initialValue: updaterequest =='' ? initformData.accountName : formData.accountName}
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
                  v-decorator="['bankAccount',{rules: [{ required: true, message: '请输入银行账号' }],
                    initialValue: updaterequest =='' ? initformData.bankAccount : formData.bankAccount
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
                    'accountType',
                    {rules: [{ required: true, message: '请输入账户类型' }], 
                    initialValue: updaterequest =='' ? initformData.accountType : formData.accountType}
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
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
                  v-decorator="['state',
                    {
                      rules: [{ required: false }],
                      initialValue: updaterequest =='' ? initformData.state : formData.state
                    }
                  ]"
                >
                  <a-radio-button :value="0">启用</a-radio-button>
                  <a-radio-button :value="1">停用</a-radio-button>
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
                    'isSubAccount',
                    {
                      rules: [{ required: false }],
                      initialValue: updaterequest =='' ? initformData.isSubAccount : formData.isSubAccount
                    }
                  ]"
                >
                  <a-radio-button :value="0">是</a-radio-button>
                  <a-radio-button :value="1">否</a-radio-button>
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
                   v-decorator="['enableDate', {
                      rules: [{ required: false }],
                      initialValue: updaterequest =='' ? null : moment(formData.enableDate, dateFormat)
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
                 v-decorator="['disableDate', {
                      rules: [{ required: false }],
                      initialValue:updaterequest =='' ? null : moment(formData.disableDate, dateFormat)
                    }]" :format="dateFormat"/>
              </a-form-item>
            </a-col> 
          </a-row>
        </div>
      </div>

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
                  'bankNode.bankNodeCode',
                  {rules: [{ required: true, message: '请输入网点代码' }],
                  initialValue: updaterequest =='' ? initformData.bankNode.bankNodeCode : formData.bankNode.bankNodeCode
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
                  v-decorator="['bankNode.bankNodeName',
                  {rules: [{ required: false, message: '请输入账户类型' }],
                  initialValue: updaterequest =='' ? initformData.bankNode.bankNodeName : formData.bankNode.bankNodeName
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
                  v-decorator="['bankNode.bankNodeAddress',
                  {rules: [{ required: false, message: '请输入账户类型' }],
                  initialValue: updaterequest =='' ? initformData.bankNode.bankNodeAddress : formData.bankNode.bankNodeAddress
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
                  v-decorator="['userName15']"
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
                  v-decorator="['userName16']"
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
                  v-decorator="['userName17']"
                >
                </a-input>
              </a-form-item>
            </a-col> 
          </a-row>
        </div>
      </div>
      <add-details></add-details>

     </a-form>
     <footer-tool-bar>
      <a-button type="primary" >流水记录</a-button>
      <a-button type="primary" >更新余额</a-button>
      <a-button type="primary" @click="check">保存</a-button>
      <a-button type="primary" >打印</a-button>
    </footer-tool-bar>
    <dotCodealert ref="dotCodealertshow"></dotCodealert>
  </div>
</template>

<script>
import addDetails from './components/addCpt/adddetails';
import dotCodealert from './components/addCpt/dotCodealert';
import FooterToolBar from '../../../components/tool/FooterToolBar';
import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';
import moment from 'moment';

export default {
  name: 'unitaccountadd',
  components: { addDetails,FooterToolBar,dotCodealert },
  mixins:[deleteEmptyProperty], 
  props:["updaterequest"],
  data() {
    return {
      dateFormat: 'YYYY/MM/DD',//日期类型
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      // 表单字段
      initformData:{
        id: '',
        regoin: {
          code: "",
          name: "",
          enabled: true,
          faspCode: "",
          isTopLevel: '',
          levelNum:'' ,
          leafNode: false
        },
        bankNode: {
          regoinId: '',
          bankNodeName: "",
          bankNodeCode: '',
          bankNodeAddress: "",
          bankNodeSeq: '',
          contacts: "",
          state: 1,
        },
        bankInfo: {
         
          bankCode: '',
          bankName: "",
          remarks: "",
          icon: "",
          state: 1,
        },
        accountName: "",
        bankAccount: "",
        accountType: 1,
        isSubAccount: 1,
        enableDate: "",
        disableDate: "",
        state: 0,
      },
      // 表单字段
      formData:{
        id: 10,
        createBy: 5000,
        createDate: "2019-03-06T01:30:53.665+0000",
        lastModifiedBy: 5000,
        lastModifiedDate: "2019-03-06T01:30:53.665+0000",
        lastModifiedVersion: 0,
        regoin: {
          id: 3,
          createBy: null,
          createDate: null,
          lastModifiedBy: 1,
          lastModifiedDate: "2018-11-27T07:11:05.865+0000",
          lastModifiedVersion: 3,
          code: "360102000",
          name: "南昌市东湖区",
          enabled: true,
          faspCode: "360102",
          isTopLevel: false,
          levelNum: null,
          leafNode: false
        },
        bankNode: {
          id: 1,
          createBy: 5000,
          createDate: "2019-03-05T02:00:54.849+0000",
          lastModifiedBy: 5000,
          lastModifiedDate: "2019-03-05T02:00:54.849+0000",
          lastModifiedVersion: 0,
          regoinId: 1000,
          bankNodeName: "华夏银行2222育知路支行",
          bankNodeCode: 102221,
          bankNodeAddress: "育知路138号",
          bankNodeSeq: 22,
          contacts: "张三",
          state: 1,
          resField1: null,
          resField2: null
        },
        bankInfo: {
          id: 1,
          createBy: 5000,
          createDate: "2019-03-05T01:59:17.314+0000",
          lastModifiedBy: 5000,
          lastModifiedDate: "2019-03-05T01:59:17.314+0000",
          lastModifiedVersion: 0,
          bankCode: 101,
          bankName: "华夏银行",
          remarks: "测试数据",
          icon: "asd/sas/csasd",
          state: 1,
          resField1: null,
          resField2: null
        },
        accountName: "测试数据",
        bankAccount: 622217789331,
        accountType: 1,
        isSubAccount: 1,
        enableDate: "2019-02-22",
        disableDate: "2012-02-22",
        state: 1,
        resField1: null,
        resField2: null
      }
    }
  },
  mounted(){
    console.log(this.updaterequest)
    if(this.updaterequest==""){
      // 新增
    }else {
      //取ID 发送请求
      this.request();
    }
  },
  methods: {
    moment,
    bankNodeCodeFuc(res){
      console.log(res)
      this.$refs.dotCodealertshow.showModal()
      // this.initformData.bankNode.bankNodeCode="777"
      // console.log(this.initformData.bankNode.bankNodeCode)
    },
    request(){
      var params= {
            id:this.updaterequest
          }
      var data=this.deleteEmptyProperty(params)
      var _url='api/unitAccount?fetchProperties=*,regoin[*],bankInfo[*],bankNode[*],subAccountLists[*]';
      ajaxData("get",_url,params, (res) => {
        console.log('新增'+res.data);
         
      });
    },
     check  (e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.disableDate=values['disableDate'].format('YYYY-MM-DD'),
            values.enableDate=values['enableDate'].format('YYYY-MM-DD'),
            console.log('Received values of form: ', values);
            // 处理数据

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
