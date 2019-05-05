/**
  Author:liuchym@yonyou.com
  desc:"往来单位管理"
**/

<template>
  <div >
      <a-tabs>
        <a-tab-pane tab="往来单位" key="1"></a-tab-pane>
        <a-button   slot="tabBarExtraContent" @click="onadd()">新增</a-button>
      </a-tabs>
      <!-- //sheck area -->
      <div style="height:50px">
        <div style="float:left">
          <span style="margin-left:50px">单位：</span>
          <span>{{orgname}}</span>

          <span style="margin-left:100px">所属地区：</span>
          <a-cascader :options="options" @change="onChange" placeholder="Please select" />

          <a-button type="primary" @click="onlistSearch">查询</a-button>
        </div>
        <!-- <div style="float:right;width:200px">
          <a-input-search
            placeholder="请输入要搜索的关键词"
            @search="onSearch"
            enterButton
          />
        </div> -->
      </div>
      <!-- table area -->
      <a-table bordered :loading='loading'  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"  :columns="columns" :dataSource="tabledata" :pagination="false" :scroll="{ x: 1300 }">
       
        <template slot="orgType" slot-scope="text, record">
         <span v-if="record.orgType">{{record.orgType.asValue}}</span>
        </template>
        <template slot="regoin" slot-scope="text, record">
         <span v-if="record.regoin">{{record.regoin.name}}</span>
        </template>

        <template slot="operation" slot-scope="text, record">
          
          <a href="javascript:;" @click="modifyfun(record)">编辑</a>
        </template>
        
      </a-table>
      <div style="margin-top:8px">
          <div style="float:left">
            <a-button @click="ondelete">删除</a-button>
            <a-button @click="onExpore()">导出excel</a-button>
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
        <comegoCompanyMgtadd @onesc="onesc()" v-if="dialogvisible"  :dialogData='dialogData' @refreshrequest="refreshrequest()" :dialogvisible='dialogvisible'></comegoCompanyMgtadd>
   </div>
</template>

<script>
import comegoCompanyMgtadd from './comegoCompanyMgtadd';//新增弹框
import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';
const columns = [{
  title: '往来单位代码',
  dataIndex: 'orgCode',
  width: 150,
  fixed:'left',
  
}, {
  title: '往来单位名称',
  dataIndex: 'orgName',
}, {
  title: '单位类型',
  dataIndex: 'orgType',
  scopedSlots: { customRender: 'orgType' },
},{
  title: '地区',
  dataIndex: 'regoin',
  scopedSlots: { customRender: 'regoin' },
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
  name: 'unitaccout',
  components:{comegoCompanyMgtadd},
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
      organization:'',
      orgname:'',
      regoin:'',
      options:'',//查询地区
      deletedata:[],//删除数据
      dialogvisible:false,//弹框
      dialogData:'',//弹框数据
      orgTypeData:''//单位类型数据
    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  mounted () {
    // 获取当前用户单位信息
    var _url=this.service_sms+'/api/region/getByuser';
    ajaxData("get",_url,'', (res) => {
        if(res.data.organization){
          this.orgname=res.data.organization.code+' '+res.data.organization.name;
          this.organization=res.data.organization.id;
        }
        this.request(this.current-1,this.pageSize);
    });
    var l_url=this.service_sms+'/api/organization';
    ajaxData("get",l_url,'', (res) => {
          this.options=res.data;
    });
    // 单位类型
    var b_url=this.service_sms+'/api/AsVal?fetchProperties=*,asVals[*]&valType=3';
    ajaxData("get",b_url,'', (res) => {
          this.orgTypeData=res.data;
    });
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
    onExpore(){
      this.$message.warning('建华后期实现该功能')
    },
    refreshrequest(){//弹框返回刷新列表操作
      // 新增网点或编辑回调刷新列表
      this.request(this.current-1,this.pageSize)
    },
    request(p,s){//列表数据请求
      this.loading=true;
     
      var _url=this.service_sms+'/api/ContanctOrg?fetchProperties=orgType[*],*,organization[code,name,id],regoin[*]'
      var Data={
        // organization:this.organization,//建华说后期加上2019/04/02
        regoin:this.regoin
      }

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
    onChange(value,selectedOptions) {//查询地区方法
          console.log(value,selectedOptions);
          this.regoin=selectedOptions[selectedOptions.length-1].code;
    },
    // 新增操作
    onadd(){
      this.dialogvisible=true;
      this.dialogData=[true,'',{name:this.orgname,id:this.organization},this.options,this.orgTypeData]
    },
    modifyfun(res){
      console.log(res)
      this.dialogvisible=true;
      this.dialogData=[false,res,{name:this.orgname,id:this.organization},this.options,this.orgTypeData]
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
      var _url=this.service_sms+'/api/contanctorg/batchRemove?ids='+_data;
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
