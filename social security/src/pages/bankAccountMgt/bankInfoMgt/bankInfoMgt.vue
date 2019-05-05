/**
  Author:liuchym@yonyou.com
  desc:"银行信息管理"
**/

<template>
  <div >
      <a-tabs>
        <a-tab-pane tab="银行信息" key="1"></a-tab-pane>
        <a-button @click="bankInfoMgtbanNodeaddfun" slot="tabBarExtraContent">新增网点</a-button>
      </a-tabs>
      <a-row :gutter="16">
        <a-col :span="5">
          <div class="wraplist" >
            <span style="float:left;">单位信息列表</span>
            <span @click="bankInfoMgtaddfun" style="float:right;"><a href="javascript:;">+新增银行</a></span>
          </div>
          <div class="unitleftwrap">
            
            <a-input-search style="margin-bottom:8px;" placeholder="请输入单位名称" @change="onChange" />
            <a-tree
              @expand="onExpand"
              :expandedKeys="expandedKeys"
              @select="onSelect"
              
              :autoExpandParent="autoExpandParent"
              :treeData="gData"
            >
              <template slot="title" slot-scope="{title}">
                <span v-if="title.indexOf(searchValue) > -1">
                  {{title.substr(0, title.indexOf(searchValue))}}
                  <span style="color: #f50">{{searchValue}}</span>
                  {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
                </span>
                <span v-else>{{title}}</span>
              </template>
            </a-tree>
            
          </div>
          <!-- 设置 删除 新增功能 -->
          <div class="treefooter">
              <span style="float:right;padding-right:16px">
                <a-icon class="cur" @click="bankInfoMgtmodifyfun" title="设置" type="setting" style="margin-right:10px"/>
                <a-icon class="cur" @click="bankdelete" title="删除" type="delete" />
              </span>
          </div>
        </a-col>
        <a-col :span="19">
          <a-table :loading="loading" bordered :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"  :columns="columns" :dataSource="tabledata" :pagination="false">
            <template slot="operation" slot-scope="text, record">
              <a href="javascript:;" @click="bankInfoMgtbanNodeamodifyfun(record)">编辑</a>
            </template>
          </a-table>
          <div style="margin-top:8px">
            <div style="float:left">
              <a-button @click="ondelete">删除</a-button>
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
        </a-col>
      </a-row>
      <!-- 新增银行 -->
      <bankInfoMgtadd @refreshbankinfo="refreshbankinfo()" ref="bankInfoMgtadd"> </bankInfoMgtadd>  
      <!-- 新增网点 -->
      <bankInfoMgtbanNodeadd  @refreshtablerequest="refreshtablerequest()" v-if="bankNodedialogvisible" @onesc="onesc()" :bankNodedialogvisible='bankNodedialogvisible' :bankNodedialogData='bankNodedialogData'></bankInfoMgtbanNodeadd>
  </div>
</template>

<script>
import bankInfoMgtadd from "./bankInfoMgtbankadd"
import bankInfoMgtbanNodeadd from "./bankInfoMgtbanNodeadd"

import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';

const gData = [{
  key:"",
  title:"全部",
  scopedSlots:{
    title:"title"
  },
  children:[]
}]


console.log(gData)

const dataList = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    const title = node.title

    dataList.push({ key, title: title })
    if (node.children) {
      generateList(node.children, node.key)
    }
  }
}



const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}


// table 数据
const columns = [{
  title: '网点名称',
  dataIndex: 'bankNodeName',
}, {
  title: '网点地址',
  dataIndex: 'bankNodeAddress',
},{
  title: '银行联行号',
  dataIndex: 'bankNodeSeq',
},{
  title: '行政区划',
  dataIndex: 'region',
},{
  title: '省份',
  dataIndex: 'province',
},{
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
}];



export default {
  name: 'unitaccout',
  components:{bankInfoMgtadd,bankInfoMgtbanNodeadd},
   mixins:[deleteEmptyProperty], 
  data () {
    return {
      //左侧菜单需要数据
      expandedKeys: [''],
      searchValue: '',
      autoExpandParent: true,
      defaultExpandAll:true,
      gData,

      tabledata:[],//table表格数据  
      loading:true,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      //分页所需要数据
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSize: 10,
      current:1,
      total:0,
      selectedKeys:[],//当前选中的银行字段
      deletedata:[],//删除数据id
      bankNodedialogvisible:false, //控制网点是否显示
      bankNodedialogData:'',//网点弹框传的数据
      bankNameData:'',//网点银行数据
      organizationoptionsData:''//网点行政银行数据
    }
  },
  computed: {
   service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  created(){
    // 请求银行信息列表
    this.bankrequest();
    // 获取行政区划数据
      var r_url=this.service_sms+'/api/organization';
      ajaxData("get",r_url,'', (res) => {
          this.organizationoptionsData=res.data;
      });
    this.request(this.current-1,this.pageSize);//初始获取列表数据

  },
  mounted () {
   
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
      this.bankNodedialogvisible=false;
    },
    request(p,s){//列表数据请求
      this.loading=true;
      var id=this.selectedKeys[0];
      var string=''
      if(id){
        string='&bankInfo.id='+id
      }else {
        string=''
      }
      var _url=this.service_sms+'/api/bankNode?fetchProperties=*,bankInfo[id,lastModifiedVersion]'+string;
      var Data={}
       
     
      Data.page=p;
      Data.size=s;
      ajaxData("get",_url,Data, (res) => {
          console.log(res);
          this.total=Number(res.headers['x-page-totalelements'])
          this.selectedRowKeys=[];
          this.tabledata=res.data;
          this.loading=false;
      });
    },
    refreshbankinfo(){//新增或修改从新请求银行列表数据
      this.bankrequest();
    },
    refreshtablerequest(){
      // 新增网点或编辑回调刷新列表
      this.request(this.current-1,this.pageSize)
    },
    bankrequest(){//银行列表数据请求
      var _url=this.service_sms+'/api/bankInfo';
      ajaxData("get",_url,'', (res) => {
        console.log(res)
        this.bankNameData=res.data;
        this.selectedKeys=[]
        var l=res.data;
        for(var i=0;i<l.length;i++){
          l[i].key=JSON.stringify(l[i].id);
          l[i].title=l[i].bankName;
          l[i].scopedSlots={
            title:"title"
          }
        }
        gData[0].children=l;
        generateList(gData)
      })
    },
    bankdelete(){//银行删除操作按钮
      if(this.selectedKeys==''){
        this.$message.warning('请选择要删除的银行');
      }else {
        var id=this.selectedKeys[0];
        var _url=this.service_sms+'/api/bankInfo/delete/'+id;
        ajaxData("get",_url,'', (res) => {
          this.bankrequest();
          this.$message.success('删除银行成功');
        })
      }
    },
    bankInfoMgtbanNodeaddfun(){
      // 新增网点
      this.bankNodedialogvisible=true;
      this.bankNodedialogData=[true,'',this.bankNameData,this.organizationoptionsData]
    },
    bankInfoMgtbanNodeamodifyfun(res){
      // 修改网点
      this.bankNodedialogvisible=true;
      this.bankNodedialogData=[false,res,this.bankNameData,this.organizationoptionsData]
    },
    bankInfoMgtaddfun(){
      // 新增银行
      this.$refs.bankInfoMgtadd.showModal(true,'');
    },
    // 修改银行
    bankInfoMgtmodifyfun(){
      if(this.selectedKeys==''){
        this.$message.warning('请选择要修改的银行');
      }else {
        var id=this.selectedKeys[0];
        var _url=this.service_sms+'/api/bankInfo/'+id;
        ajaxData("get",_url,'', (res) => {
          console.log(res.data)
         this.$refs.bankInfoMgtadd.showModal(false,res.data);
        })
      }
      
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
    ondelete(){//删除网点
      var _data=this.deletedata;
      console.log(_data)
      var _url=this.service_sms+'/api/bankNode/batchRemove?ids='+_data;
      ajaxData("get",_url,"", (res) => {
         console.log(res)
         this.request(this.current-1,this.pageSize);
      });
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    //tree methods
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {//左侧菜单选中的key值 在去请求右侧数据
      // console.log('onSelect', info)
      this.selectedKeys = selectedKeys
      // console.log(selectedKeys)
      this.request(this.current-1,this.pageSize);//初始获取列表数据
     
    },
    onChange (e) {
      
      const value = e.target.value
      const expandedKeys = dataList.map(function(item){
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    },
    //table methods
    start () {
      this.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    }
  }
}
</script>

<style lang="less" scoped>
  .wraplist {
    height: 50px;
    background: #fff;
    padding:8px; 
    line-height: 40px;  
    border: 1px solid #ddd;
    border-bottom: none;
  }
  .unitleftwrap {
    border: 1px solid #ddd;
    height: 350px;
    background:#fff;
    overflow: auto;
    padding: 16px;
    
  }
  .treefooter {
      height: 40px;
      line-height: 40px;
      border: 1px solid #ddd;
      border-top: none;
      .cur {
        cursor: pointer;
      }
    }
</style>
