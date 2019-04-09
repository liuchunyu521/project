/**
  Author:liuchym@yonyou.com
  desc:"用款计划制单"
**/

<template>
  <div >
    
    <div class="adjustbillswrap">
      <div style="background:rgb(230, 247, 255);height:100px;padding:10px">
         <a-row :gutter="16">
           <a-form
              :form="form"
              @submit="handleSubmit"
            >
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="审批单号"
                >
                  <a-input
                    v-decorator="[
                      'fundUsageNo',
                      {
                        initialValue :''}
                    ]"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="险种 "
                >
                  <a-select
                    v-decorator="['riskCode']">
                    <a-select-option :key="index" v-for="(item,index) in risksdata" :value="item.asCode">
                      {{item.asValue}}
                    </a-select-option>
                    
                  </a-select>
                </a-form-item>
              </a-col>
              
              
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="申请时间 "
                >
                  <a-range-picker
                   
                    v-decorator="['createDate',
                      {
                        rules: [{ required: false, message: '日期' }],
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="申请金额"
                >
                  <a-input
                    v-decorator="[
                      'applyAmount',
                      {
                        initialValue :''}
                    ]"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
            </a-form>
        </a-row>
      </div>
      <!-- 按钮区域 -->
      <div style="height:40px;">
        <div style="float:left;margin:8px 0 0 16px;">
          <a-button type="primary" @click="check">查询</a-button>
          <a-button type="primary" @click="onadd()">新增申请</a-button>
          <a-button type="primary" v-if="auditState==0" @click="onSubmit()">提交</a-button>
          <a-button type="primary" v-if="auditState==0" @click="ondelete()">删除</a-button>
        </div>
      </div>
      <!-- table area -->
      <div style="padding:16px">
        <a-tabs defaultActiveKey="0" @change="callback">
          <a-tab-pane tab="未提交" key="0"></a-tab-pane>
          <a-tab-pane tab="已提交" key="1" forceRender></a-tab-pane>
          <a-tab-pane tab="驳回" key="2"></a-tab-pane>
        </a-tabs>
        <a-table :loading="loading" bordered :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"  :columns="columns" :dataSource="dataSource" :pagination="false">
          <template slot="createDate" slot-scope="text, record">
            <span>{{record.createDate | date}}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" v-if="auditState==0" @click="onModify(record)">修改</a>
            <a href="javascript:;" @click="onSeeing(record)">查看</a>
          </template>
          
          <template slot="organization" slot-scope="text, record">
            <span>{{record.organization.name}}</span>
          </template>
        </a-table>
        <div style="margin-top:8px">
           
            <div v-if="total!=0" style="float:right">
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
      </div>
    </div>
  </div>
</template>

<script>
import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';
import filters from '../../components/mixins/filters.js';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// table 数据
const columns = [{
  title: '审批单号',
  dataIndex: 'fundUsageNo',
}, {
  title: '险种',
  dataIndex: 'riskCode',
}, {
  title: '申请总金额',
  dataIndex: 'applyAmount',
},{
  title: '年度',
  dataIndex: 'year',
},{
  title: '季度',
  dataIndex: 'quarter',
},{
  title: '月份',
  dataIndex: 'month',
},{
  title: '申请日期',
  dataIndex: 'createDate',
  scopedSlots: { customRender: 'createDate' },

},{
  title: '申请单位',
  dataIndex: 'organization',
  scopedSlots: { customRender: 'organization' },
},{
  title: '状态',
  dataIndex: 'auditState',
},{
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
}];



export default {
  name: 'expensesbills',
   mixins:[deleteEmptyProperty,filters], 
  data () {
    return {
      loading:true,
     labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      monthdata:[
        {key:"1月",value:1},
        {key:"2月",value:2},
        {key:"3月",value:3},
        {key:"4月",value:4},
        {key:"5月",value:5},
        {key:"6月",value:6},
        {key:"7月",value:7},
        {key:"8月",value:8},
        {key:"9月",value:9},
        {key:"10月",value:10},
        {key:"11月",value:11},
        {key:"12月",value:12}
        ],//月份数据
      // table 数据
      dataSource:[],
      columns,
      selectedRowKeys: [], // Check here to configure the default column

      //分页所需要数据
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSize: 10,
      current:1,
      total:'',
      yeardata:'',
      risksdata:'',//险种
      auditState:0,//页签切换状态
      paramsdata:{},//传参数
      deletedata:[]//删除数据id
    }
  },
  computed: {
    
  },
  mounted () {
      // 获取险种
      var params= {}
      var _url='sifc-sms/api/asVal?valType.typeCode=riskCode&fetchProperties=id,asCode,asValue';
      ajaxData("get",_url,params, (res) => {
        console.log(res)
        this.risksdata=res.data;
      })

      this.request(this.current-1,this.pageSize);//初始获取列表数据

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
     moment,
    onSelectChange (selectedRowKeys,value) {//table 选择行
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys = selectedRowKeys;
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].id)
      }
      this.deletedata=_data;
    },
    onShowSizeChange(current, pageSize) {//分页选择器
      this.current=current;
      this.pageSize=pageSize;
      this.request(this.current-1,this.pageSize)
    },
    onSubmit(){//提交
      var _data=this.deletedata;
      var params=_data;
      var _url='sifc-sms/api/fundUsage/batchCommitData';
      ajaxData("post",_url,params, (res) => {
         console.log(res)
         if(res.data.code==0){
           this.$message.success("提交成功")
           this.request(this.current-1,this.pageSize);
         }else{
           this.$message.error("提交失败")
         }
         
      });
    },
    ondelete(){//删除操作
      var _data=this.deletedata;
      var params={
       
      }
      var _url='/api/fundUsage/batchRemove?ids='+_data;
      ajaxData("get",_url,params, (res) => {
         console.log(res)
         this.request(this.current-1,this.pageSize);
      });
    },
    onadd(){
      var data=this.$route.query//通过数据来判断跳转过来的是从方案跳，还是从制单页面跳
    
      if(data.id){
        this.$router.push({//你需要接受路由的参数再跳转
          path: "/expensesPlanMgt/expensesPlanMgtDetails",
            query: { 
                id: data.id,
             }
      });
    }else {
      this.$message.error('未配置方案id,不能新增');
    }
      
    },
    onSeeing(item){//查看
      this.$router.push({//你需要接受路由的参数再跳转
          path: "/expensesPlanMgt/expensesPlanMgtDetails",
            query: { 
                id: item.id,
                flag:1,
                planId:item.planId,
                key:this.auditState
             }
      });
    },
    onModify(item){//制单修改
      this.$router.push({//你需要接受路由的参数再跳转
          path: "/expensesPlanMgt/expensesPlanMgtDetails",
            query: { 
                id: item.id,
                flag:0,
                planId:item.planId
             }
      });
    },
    check(e){//查询
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.paramsdata=values;
         this.current=1,
         this.pageSize=10;
         this.loading=true;
          this.request(this.current-1,this.pageSize);
          
        }
      });
      
    },
    callback (key) { //页签切换
      this.auditState=key;
      this.loading=true;
      this.current=1,
      this.pageSize=10;
      this.request(this.current-1,this.pageSize);
    },
    request(p,s){
          var _url;
          var Data=this.paramsdata;
          if(Data.createDate){
             Data.createDate= [Data.createDate[0].format('YYYY-MM-DD') , Data.createDate[1].format('YYYY-MM-DD')]
             _url='sifc-sms/api/fundUsage?fetchProperties=*,organization[id,name]&createDate >'+Data.createDate[0]+'&createDate <'+Data.createDate[1];
            delete Data.createDate;
          }else {
            _url='sifc-sms/api/fundUsage?fetchProperties=*,organization[id,name]';
          }
          Data.auditState=this.auditState;
          Data.page=p;
          Data.size=s;
          Data=this.deleteEmptyProperty(Data)
      ajaxData("get",_url,Data, (res) => {
          console.log(res);
          this.total=Number(res.headers['x-page-totalelements'])
          this.selectedRowKeys=[];
          this.dataSource=res.data;
          this.loading=false;

      });
    },
   handleSubmit  (e) {
     
    },
  }
}
</script>

<style lang="less" scoped>
  .adjustbillswrap {
    border: 1px solid #ddd;
    min-height: 800px;
    border-radius: 4px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
</style>
