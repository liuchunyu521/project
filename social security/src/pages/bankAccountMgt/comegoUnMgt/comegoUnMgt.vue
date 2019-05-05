/**
  Author:liuchym@yonyou.com
  desc:"往来单位账户管理"
**/

<template>
  <div >
      <a-tabs>
        <a-tab-pane tab="往来单位账户" key="1"></a-tab-pane>
        <a-button   slot="tabBarExtraContent" @click="onadd()">新增</a-button>
      </a-tabs>
      <!-- //sheck area -->
      <div style="height:50px">
        <div style="float:left">

          <span style="margin-left:100px">往来单位：</span>
          <a-select v-model="comegoValue" :allowClear="true" style="width: 120px">
            <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in orgNameData">{{item.orgName}}</a-select-option>
          </a-select>

          <a-button type="primary" @click="onlistSearch">查询</a-button>
        </div>
       
      </div>
      <!-- table area -->
      <a-table bordered :loading='loading'  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"  :columns="columns" :dataSource="tabledata" :pagination="false" :scroll="{ x: 1800 }">
       
        <template slot="insType" slot-scope="text, record">
         <span v-if="record.insType">{{record.insType.asValue}}</span>
        </template>
        <template slot="contanctOrg" slot-scope="text, record">
         <span v-if="record.contanctOrg">{{record.contanctOrg.orgName}}</span>
        </template>
        
        <template slot="accountType" slot-scope="text, record">
         <span v-if="record.accountType">{{record.accountType.asValue}}</span>
        </template>

        <template slot="bankInfo" slot-scope="text, record">
         <span v-if="record.bankInfo">{{record.bankInfo.bankName}}</span>
        </template>

        <template slot="bankNode" slot-scope="text, record">
         <span v-if="record.bankNode">{{record.bankNode.bankNodeName}}</span>
        </template>
        <template slot="bankNodeSeq" slot-scope="text, record">
         <span v-if="record.bankNode">{{record.bankNode.bankNodeSeq}}</span>
        </template>
        <template slot="province" slot-scope="text, record">
         <span v-if="record.bankNode">{{record.bankNode.province}}</span>
        </template>
        <template slot="city" slot-scope="text, record">
         <span v-if="record.bankNode">{{record.bankNode.city}}</span>
        </template>

        <template slot="operation" slot-scope="text, record">
          
          <a href="javascript:;" @click="modifyfun(record)">编辑</a>
        </template>
        
      </a-table>
      <div style="margin-top:8px">
          <div style="float:left">
            <a-button @click="ondelete">删除</a-button>
            <a-button @click='onExpore()'>导出excel</a-button>
          </div>
          <div style="float:right">
            <a-pagination 
              showSizeChanger 
              :pageSizeOptions="pageSizeOptions"
              :pageSize.sync="pageSize" 
              @showSizeChange="onShowSizeChange" 
              :total="total" 
              v-model="current">
                <template slot='buildOptionText' slot-scope='props'>
                  <span v-if="props.value!=='50'">{{props.value}}条/页</span>
                  <span v-if="props.value==='50'">全部</span>
                </template>
            </a-pagination>
          </div>
        </div>

        <!-- 新增组件 -->
        <comegoUnMgtadd @onesc="onesc()" v-if="dialogvisible"  :dialogData='dialogData' @refreshrequest="refreshrequest()" :dialogvisible='dialogvisible'></comegoUnMgtadd>
   </div>
</template>

<script>
import comegoUnMgtadd from './comegoUnMgtadd';//新增弹框
import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';
const columns = [{
  title: '银行账号',
  dataIndex: 'accountNo',
  width: 150,
  fixed:'left',
  scopedSlots: { customRender: 'accountNo' },
}, {
  title: '基金险种',
  dataIndex: 'insType',
  scopedSlots: { customRender: 'insType' },
}, {
  title: '开户名',
  dataIndex: 'accountName',
}, {
  title: '往来单位',
  dataIndex: 'contanctOrg',
  scopedSlots: { customRender: 'contanctOrg' },
}, {
  title: '开户银行',
  dataIndex: 'bankInfo',
  scopedSlots: { customRender: 'bankInfo' },
}, {
  title: '网点',
  dataIndex: 'bankNode',
  scopedSlots: { customRender: 'bankNode' },
}, {
  title: '账户类型',
  dataIndex: 'accountType',
  scopedSlots: { customRender: 'accountType' },
}, {
  title: '人行联行号',
  dataIndex: 'bankNodeSeq',
  scopedSlots: { customRender: 'bankNodeSeq' },
}, {
  title: '省份',
  dataIndex: 'province',
  scopedSlots: { customRender: 'province' },
},{
  title: '城市',
  dataIndex: 'city',
  scopedSlots: { customRender: 'city' },
},{
  title: '备注',
  dataIndex: 'remarks',
}, {
  title: '操作',
  fixed: 'right',
  width:100,
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
}];


export default {
  name: 'comegounitaccout',
  components:{comegoUnMgtadd},
  mixins:[deleteEmptyProperty], 
  data () {
    return {
      tabledata:'',
      columns,
      selectedRowKeys:[],
      //分页所需要数据
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSize: 10,
      current:1,
      total:0,
      loading:false,
      comegoValue:'',//往来单位查询值
      regoin:'',
      options:'',//查询地区
      deletedata:[],//删除数据
      dialogvisible:false,//弹框
      dialogData:'',//弹框数据
      orgNameData:'',//往来单位数据
      orgTypeData:'',//单位类型数据
      bankNameData:'',//账户类型数据
      
      bankInfoData:'',//开户银行数据
      bankNodeData:'',//网点数据
      insTypeData:'',//险种数据
    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  mounted () {
    
    // 往来单位数据
    var a_url=this.service_sms+'/api/ContanctOrg';
    ajaxData("get",a_url,'', (res) => {
        this.orgNameData=res.data
    });
    // 单位类型
    var b_url=this.service_sms+'/api/AsVal?fetchProperties=*,asVals[*]&valType=3';
    ajaxData("get",b_url,'', (res) => {
          this.orgTypeData=res.data;
    });
    // 账户类型
    var c_url=this.service_sms+'/api/AsVal?valType=4';
    ajaxData("get",c_url,'', (res) => {
        this.bankNameData=res.data
    });
   
    // 开户银行
    var d_url=this.service_sms+'/api/bankInfo';
    ajaxData("get",d_url,'', (res) => {
        this.bankInfoData=res.data
    });
    //网点数据
    
    var e_url=this.service_sms+'/api/bankNode';
    ajaxData("get",e_url,'', (res) => {
        this.bankNodeData=res.data
    });
     
    // 险种数据
    var f_url=this.service_sms+'/api/AsVal?valType=1';
    ajaxData("get",f_url,'', (res) => {
        this.insTypeData=res.data
    });
    // 初始获取列表数据；
    this.request(this.current-1,this.pageSize)
  },
  watch:{
    pageSize(val) {
      this.pageSize=val;
      this.request(this.current-1,this.pageSize)
    },
    current(val) {
      this.current=val;
      this.request(this.current-1,this.pageSize)
    }
  },
  methods: {
    onesc(){
      this.dialogvisible=false;
    },
    refreshrequest(){//弹框返回刷新列表操作
      // 新增网点或编辑回调刷新列表
      this.request(this.current-1,this.pageSize)
    },
    request(p,s){//列表数据请求
      this.loading=true;
      var _Value='';
      if(this.comegoValue){
        var b=this.comegoValue.split("-");
        _Value=b[0];
      }
      var _url=this.service_sms+'/api/ContanctOrgAccount?fetchProperties=orgType[*],*,bankInfo[id,bankName,lastModifiedVersion],bankNode[*],contanctOrg[id,orgName,lastModifiedVersion],accountType[id,asValue,lastModifiedVersion],insType[id,asValue,lastModifiedVersion]&contanctOrg.id:'+_Value
      var Data={}

      Data.page=p;
      Data.size=s;
      Data=this.deleteEmptyProperty(Data)
      ajaxData("get",_url,Data, (res) => {
          console.log(res);
          this.total=Number(res.headers['x-page-totalelements'])
          this.selectedRowKeys=[];
          this.tabledata=res.data;
          this.loading=false;
      });
    },
    // 新增操作
    onadd(){
      this.dialogvisible=true;
      this.dialogData=[true,'',this.orgNameData,this.orgTypeData,this.bankNameData,this.bankInfoData,this.bankNodeData,this.insTypeData]
    },
    onExpore(){
      this.$message.warning('建华后期实现该功能')
    },
    modifyfun(res){
      console.log(res)
      this.dialogvisible=true;
      this.dialogData=[false,res,this.orgNameData,this.orgTypeData,this.bankNameData,this.bankInfoData,this.bankNodeData,this.insTypeData]
    },
    onSelectChange (selectedRowKeys,value) {
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys = selectedRowKeys;
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].id)
      }
      this.deletedata=_data;
    },
    ondelete(){//删除数据
      console.log(this.selectedRowKeys)
      var _data=this.deletedata;
      console.log(_data)
      var _url=this.service_sms+'/api/contanctorgAccount/batchRemove?ids='+_data;
      ajaxData("get",_url,"", (res) => {
         console.log(res)
         this.request(this.current-1,this.pageSize);
      });
    },
    onlistSearch (value) {//列表内容查询
      this.current=1;
      this.pageSize=10;
      this.request(this.current-1,this.pageSize)
    },
    onShowSizeChange(current, pageSize) {//分页选择器
      this.current=current;
      this.pageSize=pageSize;
      this.request(this.current-1,this.pageSize)
    },
  }
}
</script>

<style lang="less" scoped>
  .wraplist {
    height: 40px;
    background: #fff;
    
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
