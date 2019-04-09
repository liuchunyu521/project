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
                <a-select-option value="1">账户类型</a-select-option>
               
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
          <a-row>
            <a-col :span="12" :offset="15">
              <a-input-search
                style="width: 200px;display:inline-block;"
                @search="onSearch"
              />
              <a-button  icon="upload"  />
              <a-button  icon="download" />
            </a-col>
          </a-row>
         <div>
           <!-- table 表格区域 -->
           <template>
            <a-table bordered :loading="loading" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="dataSource" :scroll="{ x: 1500 }" :pagination="false">
              <a slot="bankAccount" slot-scope="text,record"  href="javascript:;"><span @click="hrefmodify(record.id)">{{text}}</span></a>
              <span slot="state" slot-scope="text, record"  href="javascript:;">{{record.state | statesfilters}}</span>

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

const x = 3
const y = 2
const z = 1
const gData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key, scopedSlots: { title: 'title' }})
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)

const dataList = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children, node.key)
    }
  }
}
generateList(gData)

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
console.log(gData)
// table 测试数据
const columns = [
  { title: '银行账号', width: 150, dataIndex: 'bankAccount', key: 'bankAccount', fixed: 'left',scopedSlots: { customRender: 'bankAccount' }, },
  { title: '单位代码', width: 100, dataIndex: 'regoin.code', key: '5' },
  { title: '银行账户', dataIndex: 'accountName', key: '1', width: 150 },
  { title: '银行名称', dataIndex: 'bankInfo.bankName', key: '2', width: 150 },
  { title: '银行网点', dataIndex: 'bankNode.bankNodeName', key: '3', width: 150 },
  { title: '状态', dataIndex: 'state', key: '4', width: 150 ,scopedSlots: { customRender: 'state' } }, 
  
 
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
      selectedRows:[],//删除行数据
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSize: 10,
      current:1,
      total:0,
      visible:false, //新增弹框内容
      accountType:'',//账户类型
      state:'',//状态
      regoinId:''//左侧单位ID
    }
  },
 
  computed: {
    
  },
  mounted () {
    this.request(this.current-1,this.pageSize)
  },
   watch:{
    pageSize(val) {
      console.log('pageSize',val);
      this.request(this.current-1,this.pageSize)
    },
    current(val) {
      console.log('current',val);
      this.request(this.current-1,this.pageSize)
    }
   },
  methods: {
    
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
   
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = dataList.map((item) => {
        if (item.key.indexOf(value) > -1) {
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
      console.log(this.selectedRows);

      var params= {
            state: this.state,
            accountType:this.accountType,
            regoinId:this.regoinId,
            page:p,
            size:s
          }
      var _data=this.deleteEmptyProperty(params)
      var _url='api/unitAccount?fetchProperties=id,regoin[code],bankAccount,state,accountName,bankNode[id,bankNodeName],bankInfo[bankName]&sort=id,asc';
      ajaxData("get",_url,_data, (res) => {
        console.log('ddd'+res);
          
          this.dataSource=res.data;
      });

    },
    onSearch (value) {//搜索相关的列表内容
      console.log(value)
    },
    onSelectChange (selectedRowKeys, selectedRows) {//获取table 选中的数据
     this.selectedRows=selectedRows;
      this.selectedRowKeys = selectedRowKeys;


    },
    hrefmodify(res){//点击银行账号跳转修改页面
      console.log("idddd"+res)
      this.$emit('unitIsshow',res)
    },
    request(p,s){//获取数据
      var params= {
            state: this.state,
            accountType:this.accountType,
            regoinId:this.regoinId,
            page:p,
            size:s
          }
      var _data=this.deleteEmptyProperty(params)
      var _url='api/unitAccount?fetchProperties=id,regoin[code],bankAccount,state,accountName,bankNode[id,bankNodeName],bankInfo[bankName]&sort=id,asc';
      ajaxData("get",_url,_data, (res) => {
        console.log(res);
        var T=res.headers;
        this.total=Number(T["x-page-totalelements"])
        this.loading=false;
        this.dataSource=res.data;
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
