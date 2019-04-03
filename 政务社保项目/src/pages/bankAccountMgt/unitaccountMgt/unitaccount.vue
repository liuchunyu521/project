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
      <unitaccout-list @unitIsshow="unitIsshow" v-if="isShowpage"></unitaccout-list>
      <unitaccout-add :updaterequest="updaterequest" v-else></unitaccout-add>
  </div>
</template>

<script>

import unitaccoutAdd from './unitaccountadd';//引入新增页面
import unitaccoutList from './unitaccountlist';//引入列表页面


export default {
  name: 'unitaccout',
  components: {unitaccoutAdd,unitaccoutList},
  data () {
    return {
     isShowpage:true,//控制是否显示新增页面
     updaterequest:''//修改页面需要传ID值
    }
  },
  computed: {
    
  },
  mounted () {
   
  },
  
  methods: {
    isShowadd(){
      this.isShowpage=false
    },
    unitaccountadd(){//新增按钮事件
     this.isShowpage=false
    },
    returnunitaccount (){//返回
       this.isShowpage=true
    },
    unitIsshow(res){//传入新增页ID用来查询修改数据
       this.updaterequest=res;
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
