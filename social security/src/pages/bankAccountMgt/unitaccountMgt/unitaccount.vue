/**
  Author:liuchym@yonyou.com
  desc:"单位账户模块"
**/

<template>
  <div >
      <a-tabs>
        <a-tab-pane tab="单位账户" key="1"></a-tab-pane>
       
        <a-button  v-if="isShowpage" @click='unitaccountadd' slot="tabBarExtraContent">新增</a-button>
        <a-button  v-else @click='returnunitaccount' slot="tabBarExtraContent" >X</a-button>
      
      </a-tabs>
      <unitaccout-list @unitIsshow="unitIsshow" @calbackdata='calbackdata' v-if="isShowpage"></unitaccout-list>
      <unitaccout-add  
        :updaterequest="updaterequest" 
        @addisShow='addisShow' 
        :unitdata="unitdata" 
        :accountTypeData="accountTypeData" 
        :options="options" 
        :bankNameData="bankNameData" 
        v-else
      >
      </unitaccout-add>
  </div>
</template>

<script>

import unitaccoutAdd from './unitaccountadd';//引入新增页面
import unitaccoutList from './unitaccountlist';//引入列表页面
import { ajaxData } from '../../components/mixins/ajaxdata.js';

export default {
  name: 'unitaccout',
  components: {unitaccoutAdd,unitaccoutList},
  data () {
    return {
     isShowpage:true,//控制是否显示新增页面
     updaterequest:'',//修改页面需要传ID值
     unitdata:'',//单位代码，单位名称回传数据
     accountTypeData:'',
     options:'',
     bankNameData:'',
    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  created () {
    // 账户类型
    var c_url=this.service_sms+'/api/AsVal?valType=4';
    ajaxData("get",c_url,'', (res) => {
        this.accountTypeData=res.data
    });
    // 获取行政区划数据
      var r_url=this.service_sms+'/api/organization';
      ajaxData("get",r_url,'', (res) => {
          this.options=res.data;
      });

    //银行列表数据请求
      var _url=this.service_sms+'/api/bankInfo';
      ajaxData("get",_url,'', (res) => {
        this.bankNameData=res.data;
      });
  },
  
  methods: {
    calbackdata(res){//回调数据
      if(res){
        var data={
          id:res.value,
          label:res.label
        }
        this.unitdata=data;
      }
      // console.log(this.unitdata)
    },
    addisShow(){
      this.isShowpage=true;
    },
    isShowadd(){
      this.updaterequest='';//將修改数据置空
      this.isShowpage=false
    },
    unitaccountadd(){//新增按钮事件
      if(this.unitdata){
         this.isShowpage=false
      }else {
        this.$message.warning('请选择一个单位进行新增');
      }
    
    },
    returnunitaccount (){//返回
      this.updaterequest='';//將修改数据置空
      this.unitdata='';//单位代码 单位名称数据置空;
       this.isShowpage=true
    },
    unitIsshow(res){//传入新增页ID用来查询修改数据
       this.updaterequest=res;
       this.unitdata='';//单位代码 单位名称数据置空;
       this.isShowpage=false
    }
  }
}
</script>

<style lang="less">
  .wraplist {
    height: 40px;
    background: #fff;
    text-align: center;  
    line-height: 40px;  
    border: 1px solid #ddd;
    border-bottom: none;
  }
  .unitleftwrap {
    border: 1px solid #ddd;
    height: 500px;
    background:#fff;
    overflow: auto;
    padding: 16px;
  }
</style>
