/**
  Author:liuchym@yonyou.com
  desc:"调剂金审批"
**/

<template>
  <div >
    <!-- button area -->
     <!-- <div style="height:40px">
       <a-button style="float:right">新增</a-button>
     </div> -->
    <!-- check area -->
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
                  label="调剂金单号"
                >
                  <a-input
                    v-decorator="[
                      'adjustFundNo',
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
                  label="年度 "
                >
                  <a-select
                    v-decorator="['year']">
                    <a-select-option :key="index" v-for="(item,index) in yeardata" :value="yeardata[index]">
                      {{yeardata[index]}}
                    </a-select-option>
                    
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="季度"
                >
                  <a-select mode="multiple"  v-decorator="['quarter']">
                    <a-select-option value="1">
                      第一季度
                    </a-select-option>
                    <a-select-option value="2">
                      第二季度
                    </a-select-option>
                    <a-select-option value="3">
                      第三季度
                    </a-select-option>
                    <a-select-option value="4">
                      第四季度
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="月份 "
                >
                  <a-select v-decorator="['month']">
                    <a-select-option :value="item.value" :key="index" v-for="(item,index) in monthdata">{{item.key}}</a-select-option>
                    
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="制单日期 "
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
                  label="申请金额 "
                >
                  <a-input v-decorator="['applyAmount']"></a-input>
                </a-form-item>
              </a-col>
            </a-form>
        </a-row>
      </div>
      <!-- 按钮区域 -->
      <div style="height:40px;">
        <div style="float:left;margin:8px 0 0 16px;">
          <a-button type="primary" @click="check">查询</a-button>
          <!-- <a-button type="primary" v-if="auditState==0" >审批通过</a-button>
          <a-button type="primary" v-if="auditState==0" >审批驳回</a-button> -->
        </div>
      </div>
      <!-- table area -->
      <div style="padding:16px">
        <a-tabs defaultActiveKey="0" @change="callback">
          <a-tab-pane tab="待办" key="0"></a-tab-pane>
          <a-tab-pane tab="已办" key="1" forceRender></a-tab-pane>
        </a-tabs>
        <a-table :loading="loading" bordered :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"  :columns="columns" :dataSource="dataSource" :pagination="false">
          <template slot="createDate" slot-scope="text, record">
            <span>{{record.createDate | date}}</span>
          </template>
          <template slot="auditState" slot-scope="text, record">
            <span>{{record.auditState | statesfilters}}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" @click="onSeeing(record)">查看</a>
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
import deleteEmptyProperty from '../components/mixins/json.js';
import { ajaxData } from '../components/mixins/ajaxdata.js';
import filters from '../components/mixins/filters.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// table 数据
const columns = [{
  title: '调剂金单号',
  dataIndex: 'adjustFundNo',
}, {
  title: '年份',
  dataIndex: 'year',
}, {
  title: '季度',
  dataIndex: 'quarter',
},{
  title: '月份',
  dataIndex: 'month',
},{
  title: '申请金额',
  dataIndex: 'applyAmount',
},{
  title: '制单人',
  dataIndex: 'createBy',
},{
  title: '制单提交日期',
  dataIndex: 'createDate',
  scopedSlots: { customRender: 'createDate' },
},{
  title: '审批状态',
  dataIndex: 'auditState',
  scopedSlots: { customRender: 'auditState' },
},{
  title: '审批核定金额',
  dataIndex: 'auditAmount',
},{
  title: '核定状态',
  dataIndex: 'approvalState',
},{
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
}];



export default {
  name: 'adjustbills',
   mixins:[deleteEmptyProperty,filters], 
   filters:{//状态过滤器
    statesfilters:function(res){
      if(res==0){
        return "未审核"
      }else if(res==1){
        return "已审核"
      }else if(res==2){
        return "驳回"
      }
    }
  },
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
      auditState:0,//页签切换状态
      paramsdata:{},//传参数
      deletedata:[],//审核数据
    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  mounted () {
      // 获取年度
      var Data='';
      var _url=this.service_sms+'/api/adjustFund/getYears';
      ajaxData("get",_url,Data, (res) => {
         this.yeardata=res.data.years;
      });

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
   
   
    onSeeing(item){//查看 审核详细
      this.$router.push({//你需要接受路由的参数再跳转
          path: "/adjustGoldMgt/adjustApproveDetails",
            query: { 
                data:JSON.stringify(item),
                id: item.id,
                flag:1,
                planId:item.planId,
                key:this.auditState
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
          var _url=this.service_sms+'/api/adjustFund/findAudit';
          var Data=this.paramsdata;
          if(Data.createDate){

            Data.createDate= [Data.createDate[0].format('YYYY-MM-DD') , Data.createDate[1].format('YYYY-MM-DD')]
            Data.startDate=Data.createDate[0];
            Data.endDate=Data.createDate[1];
            delete Data.createDate;
          }
          Data.tabFlag=this.auditState;
          Data.page=p;
          Data.size=s;
          Data=this.deleteEmptyProperty(Data)
      ajaxData("post",_url,Data, (res) => {
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
