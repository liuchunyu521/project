/**
  Author:liuchym@yonyou.com
  desc:"单位账户模块"
**/

<template>
  <div>
      <a-row :gutter="16">
        <a-col :span="5">
          <div class="wraplist">单位信息列表</div>
          <div class="unitleftwrap">
            
            <a-input-search style="margin-bottom:8px;" placeholder="请输入单位名称" @change="onChange" />
            <a-tree
              
              @expand="onExpand"
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              :treeData="gData"
               @select="onSelect"
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
        </a-col>
        <a-col :span="19">
          <!-- 按钮区域 -->
         <a-row>
           <div style="background:#e6f7ff;height:60px;padding:16px">
             <a-col :span="8" >
              <span>账户类型：</span>
              <a-select defaultValue="" v-model="accountType" style="width: 120px" @change="handleChange">
                <!-- <a-select-option value="1">账户类型</a-select-option> -->
               <a-select-option :key="item.id" :value="item.id" v-for="item in bankNameData">{{item.asValue}}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <div style="margin-top:4px">
                <span>状态：</span>
                <a-radio-group  defaultValue=""  v-model="state" size="small" buttonStyle="solid">
                  <a-radio-button value="">全部</a-radio-button>
                  <a-radio-button value="1">启用</a-radio-button>
                  <a-radio-button value="0">停用</a-radio-button>
                  <a-radio-button value="2">待处理</a-radio-button>
                </a-radio-group>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="float:right;">
                <a-button @click="checkFun">查询</a-button>
                <a-button @click="resetFun">重置</a-button>
              </div>
            </a-col>
           </div>
         </a-row>
         <!-- table 区域按钮区域 -->
          <!-- <div style="padding:6px;height:46px;"> -->
              <!-- <a-input-search
                style="width: 200px;display:inline-block;"
                @search="onSearch"
              /> -->
              <!-- <div style="float:right;">
                <a-button  icon="upload"  />
                <a-button  icon="download" />
              </div> -->
          <!-- </div> -->
         <div>
           <!-- table 表格区域 -->
           <template>
            <a-table bordered :loading="loading" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="dataSource" :scroll="{ x: 1000 }" :pagination="false">
              <template slot="state" slot-scope="text, record">
                <span>{{record.state | statesfilters}}</span>
              </template>
              <template slot="operation" slot-scope="text, record">
                  <a href="javascript:;" @click="hrefmodify(record)">编辑</a>
              </template>

            </a-table>
            <div style="margin-top:8px">
              <div style="float:left">
                <a-button @click='deletFun()'>删除</a-button>
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
          </template>
         </div>
        </a-col>
    </a-row>

    
  </div>
</template>

<script>
import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';

const gData =[];

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
console.log(dataList)
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
// table 测试数据
const columns = [
  { title: '银行账号', width: 200, dataIndex: 'bankAccount', fixed: 'left',scopedSlots: { customRender: 'bankAccount' }, },
  { title: '单位代码', dataIndex: 'organization.code', },
  { title: '银行账户', dataIndex: 'accountName', },
  { title: '银行名称', dataIndex: 'bankInfo.bankName',  },
  { title: '银行网点', dataIndex: 'bankNode.bankNodeName',   },
  { title: '状态', dataIndex: 'state' ,scopedSlots: { customRender: 'state' } }, 
  { title: '操作', dataIndex: 'operation' ,fixed: 'right',width: 100,scopedSlots: { customRender: 'operation' } }, 
];

export default {
  name: 'unitaccout',
  components: {},
  mixins:[deleteEmptyProperty], 
  filters:{//状态过滤器
    statesfilters:function(res){
      if(res==0){
        return "停用"
      }else if(res==1){
        return "启用"
      }else if(res==2){
        return "待处理"
      }
    }
  },
  data () {
    return {
      loading:true,//table 加载。。。。
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData,
      dataSource:[],
      columns,//行字段配置
      selectedRowKeys: [], // Check here to configure the default column
      deletedata:[],//删除行数据
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSize: 10,
      current:1,
      total:0,
      selectedKeys:[],//当前选中的单位的字段
      visible:false, //新增弹框内容
      bankNameData:'',//账户类型参数数据
      accountType:'',//账户类型
      state:'',//状态
      regoinId:''//左侧单位ID
    }
  },
 
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  created() {
    this.unlistrequest();
    // 账户类型
    var c_url=this.service_sms+'/api/AsVal?valType=4';
    ajaxData("get",c_url,'', (res) => {
        console.log(res)
        this.bankNameData=res.data;
    });

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
    
    //获取单位列表
    unlistrequest(){
      // 获取单位，建华说暂时用这个
      var l_url=this.service_sms+'/api/organization';
      ajaxData("get",l_url,'', (res) => {
        console.log(res)
        this.gData=res.data;
        this.getArray(this.gData);
        generateList(this.gData)
      });
    },
    getArray(data){//转换数据的值；
      var _this=this;
      for (var i in data) {
        data[i].key=data[i].value;
        data[i].title=data[i].label;
        data[i].scopedSlots={
          title:"title"
        }
          if (data[i].children != undefined && data[i].children.length > 0) {
              _this.getArray(data[i].children)
          }
      }
    },
    onShowSizeChange(current, pageSize) {
      this.current=current;
      this.pageSize=pageSize;
      this.request(this.current-1,this.pageSize)
    },
   onSelect (selectedKeys, info) {//左侧菜单选中的key值 在去请求右侧数据
      // console.log('onSelect', info)
      this.selectedKeys = selectedKeys
      // console.log(selectedKeys)
      this.$emit('calbackdata',info.selectedNodes[0].data.props)
      this.request(this.current-1,this.pageSize);//初始获取列表数据
     
    },
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      debugger;
      const value = e.target.value
      const expandedKeys = dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, this.gData)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    },
    handleChange(value) {//账户类型
      console.log(`selected ${value}`);
    },
    checkFun(){//查询
      this.current=1;
      this.pageSize=10;
      this.request(this.current-1,this.pageSize)
    },
    resetFun(){//重置类型状态
      this.state="";
      this.accountType=""
    },
    deletFun(){//删除行操作
      var _data=this.deletedata;
      if(_data.length>0){
        
        var _url=this.service_sms+'/api/unitAccount/batchRemove?ids='+_data;
        ajaxData("get",_url,'', (res) => {
          console.log(res)
          this.$message.success('删除成功');
          this.request(this.current-1,this.pageSize);
        });
      }else {
        this.$message.error('请选择要删除行');
      }
      
    },
    onSearch (value) {//搜索相关的列表内容
      console.log(value)
    },
    onSelectChange (selectedRowKeys, value) {//获取table 选中的数据
    //  this.selectedRows=selectedRows;
     this.selectedRowKeys = selectedRowKeys;
     var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].id)
      }
      this.deletedata=_data;
    },
    hrefmodify(res){//点击银行账号跳转修改页面
      console.log("idddd"+res)
      this.$emit('unitIsshow',res)
    },
    request(p,s){//获取数据
      this.loading=true;
     var id=this.selectedKeys[0];
      var str=''
      if(id){
        str='&bankInfo.id='+id
      }else {
        str=''
      }
      var params= {
            state: this.state,
            accountType:this.accountType,
            regoinId:str,
            page:p,
            size:s
          }
      var _data=this.deleteEmptyProperty(params)
      var _url=this.service_sms+'/api/unitAccount?fetchProperties=*,organization[*],subAccountLists[*,insType[*]],accountType[*],bankNode[*],bankInfo[*]&sort=id,asc';
      ajaxData("get",_url,_data, (res) => {
        console.log(res);
        var T=res.headers;
        this.total=Number(T["x-page-totalelements"])
        this.loading=false;
        this.dataSource=res.data;
        this.selectedRowKeys=[];
     });
     
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
    height: 350px;
    background:#fff;
    overflow: auto;
    padding: 16px;
  }
</style>
