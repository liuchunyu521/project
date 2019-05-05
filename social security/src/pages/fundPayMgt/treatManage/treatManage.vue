/**
Author:huangwqk
desc:"待遇支付计划管理"
**/
<template>
  <div>
    <a-tabs>
      <a-tab-pane tab="待遇支付计划管理" key="1"></a-tab-pane>
    </a-tabs>
    <div style="background:#e6f7ff;padding:16px">
      <a-row style="margin-bottom: 10px">
        <a-col :span="8">
          <span class="choiceText">险种：</span>
          <a-select defaultValue="" style="width: 200px" v-model="selectCode" >
            <a-select-option v-for="(item,index) in safe" :value="item.asCode" :key="item.id">{{item.asValue}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <span class="choiceText">待遇所属期：</span>
          <span style="display: inline-block;">
            <a-month-picker @change="dateChange" :defaultValue="moment(nowMonth, 'YYYY-MM')" placeholder="请选择日期"/>
          </span>
        </a-col>
        <a-col :span="8">
          <span class="choiceText">业务批次号：</span>
          <div style="display: inline-block;">
            <a-input  placeholder="请输入" v-model="ywNum"/>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <span class="choiceText">拨付方式：</span>
          <a-select defaultValue="" style="width: 200px">
            <a-select-option value="1">1</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <span class="choiceText">应付类型：</span>
          <a-select defaultValue="" style="width: 200px">
            <a-select-option value="1">1</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>
    <!-- table 区域 -->
    <div style="height:40px;margin-top:8px;">
      <div style="float:left;">
        <a-button type='primary' @click="checkFun">查询</a-button>
        <a-button type='primary' @click="mxTable">查看支付明细</a-button>
        <a-button type='primary' v-show="this.activeKey==0?true:false">同意</a-button>
        <a-button type='primary' v-show="this.activeKey==0?true:false">驳回</a-button>
        <a-button type='primary'>流程跟踪</a-button>
      </div>
    </div>
    <a-tabs @change="callback" v-model="activeKey">
      <a-tab-pane tab="待办" :key="0"></a-tab-pane>
      <a-tab-pane tab="已办" :key="1"></a-tab-pane>
    </a-tabs>
    <a-table bordered
             :loading="loading"
             :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:onSelectChange,type:'radio'}"
             :columns="columns"
             :dataSource="data"
             :pagination="false"
             :scroll="{x:'150%' }">
              <template slot="operation" slot-scope="text, record">
                <a href="javascript:;" @click="showModal(record)">{{text}}</a>
              </template>
    </a-table>
    <div style="margin-top:8px">
      <div style="float:right">
        <a-pagination
          :showTotal="total => `共 ${total} 条数据`"
          showSizeChanger
          :pageSizeOptions="pageSizeOptions"
          :pageSize="pageSize"
          @showSizeChange="changePageSize"
          @change="changePage"
          :total="total"
          v-model="current">
          <template slot='buildOptionText' slot-scope='props'>
            <span v-if="props.value!=='50'">{{props.value}}条/页</span>
            <span v-if="props.value==='50'">全部</span>
          </template>
        </a-pagination>
      </div>
    </div>
    <!--详情页-->
    <a-modal
      title="待遇支付计划汇总单"
      v-model="visible"
      @ok="visible=false"
      okText="确定"
      cancelText="关闭"
      width="1300px">
      <div style="margin-bottom: 20px">
        <a-button type='primary'>同意</a-button>
        <a-button type='primary'>退回</a-button>
        <a-button type='primary'>附件</a-button>
        <a-button type='primary'>导出</a-button>
        <a-button type='primary'>打印</a-button>
      </div>
      <!--表格上方信息-->
      <div style="text-align: center;">
        <h2>养老保险支付计划汇总表</h2>
      </div>
      <div style="float: left;">
        <span>经办机构名称：{{jbjg}}</span>
      </div>
      <div style="float: right;">
        <span>业务期别：{{ywqb}}</span>
      </div>
      <!--表格-->
      <a-table bordered
               :columns="columns2"
               :dataSource="data2"
               :pagination="false">
      </a-table>
      <a-table  style="margin-top: 50px"
                bordered
               :columns="columns3"
               :dataSource="data3"
               :pagination="false">
      </a-table>
      <div style="margin-top: 10px">
        <span>业务制单：</span>
        <span style="margin-left: 800px;">财务制单：</span>
      </div>
      <div style="margin-top: 10px">
        <span>业务复核：</span>
        <span style="margin-left: 800px;">财务复核：</span>
      </div>
      <div style="margin-top: 10px">
        <span>业务审批：</span>
        <span style="margin-left: 800px;">财务审批：</span>
      </div>
    </a-modal>
    <!--支付明细页-->
    <a-modal
      title="查看支付明细"
      v-model="mxVisible"
      @ok="mxVisible=false"
      okText="确定"
      cancelText="关闭"
      width="1000px">
      <div>
        <a-table  bordered
                  :loading="mxLoading"
                  :columns="mxColumn"
                  :dataSource="mxData"
                  :pagination="false"
                  :scroll="{x:'140%' }">
          <template slot="id" slot-scope="text, record">
            {{selectedRows[0].aaz030}}
          </template>
        </a-table>
      </div>
      <div>
        <div style="float:right;margin-top:8px">
          <a-pagination
            :showTotal="total => `共 ${mxTotal} 条数据`"
            showSizeChanger
            :pageSizeOptions="pageSizeOptions"
            :pageSize="mxPageSize"
            @showSizeChange="mxChangePageSize"
            @change="mxChangePage"
            :total="mxTotal"
            v-model="mxCurrent">
            <template slot='buildOptionText' slot-scope='props'>
              <span v-if="props.value!=='50'">{{props.value}}条/页</span>
              <span v-if="props.value==='50'">全部</span>
            </template>
          </a-pagination>
        </div>
        <div style="clear: both"></div>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import moment from 'moment';
  import deleteEmptyProperty from '../../components/mixins/json.js';
  import { ajaxData } from '../../components/mixins/ajaxdata.js';
  const columns = [
    {title: '业务批次号', dataIndex: 'aaz030', fixed:'left', width:150, scopedSlots: { customRender: 'operation' },},
    {title: '险种',dataIndex: 'aae140',},
    {title: '经办机构',dataIndex: 'aab034',},
    {title: '待遇所属期',dataIndex: 'aae002',},
    {title: '拨付方式',dataIndex: 'aaa079',},
    {title: '应付类型',dataIndex: 'aaa088',},
    {title: '单位个数', dataIndex: 'totalCompany',},
    {title: '发放笔数',dataIndex: 'totalCount',},
    {title: '发放人数',dataIndex: 'totalPeople',},
    {title: '金额（元）',dataIndex: 'totalMoney',align: 'right',},
    {title: '制单人',dataIndex: 'zdr', width: 100, fixed:'right',},
    {title: '制单时间', dataIndex: 'zdsj', width: 100, fixed:'right',}
  ];
  const columns2=[//模态框内第一表格列
    {title: '支付汇总信息', dataIndex: '',
      children:[
        {title:'应付类型', dataIndex:'aaa088'},
        {title:'拨付方式', dataIndex:'aaa079'},
        {title:'单位个数', dataIndex:'totalCompany'},
        {title:'发放笔数', dataIndex:'totalCount'},
        {title:'发放人数', dataIndex:'totalPeople'},
        {title:'支付金额合计', dataIndex:'totalMoney',align: 'right',},
      ]
    }
  ];
  const columns3=[//模态框内第一表格列
    {title: '支付计划明细信息', dataIndex: 'aae140',
      children:[
        {title:'序号', dataIndex:''},
        {title:'财务汇总批次号', dataIndex:''},
        {title:'单位个数', dataIndex:''},
        {title:'支付人数', dataIndex:''},
        {title:'待遇项目', dataIndex:'',
          children:[
            {title:'基础养老金', dataIndex:''},
            {title:'个人账户养老金', dataIndex:''},
            {title:'过渡性养老金', dataIndex:''},
            {title:'离休金', dataIndex:''},
            {title:'退休金', dataIndex:''},
            {title:'退职生活费', dataIndex:''},
            {title:'补贴和调节金', dataIndex:''},
            {title:'累计调待额', dataIndex:''},
            {title:'冬季取暖补贴', dataIndex:''},
            {title:'生活补贴', dataIndex:''}
          ]
        },
        {title:'供养亲属人数', dataIndex:''},
        {title:'供养亲属定期生活补助', dataIndex:''},
        {title:'支付金额合计', dataIndex:''}
      ]
    }
  ];
  const mxColumn=[
    {title: '业务批次号',dataIndex: 'aaz030',scopedSlots: { customRender: 'id' },},
    {title: '参保对象编码',dataIndex: 'insuredObjectNo',},
    {title: '参保对象类型',dataIndex: 'insuredObjectType',},
    {title: '参保对象名称',dataIndex: 'insuredObjectName',},
    {title: '参保对象证件类型',dataIndex: 'insuredObjectPaperType',},
    {title: '参保对象证件号码',dataIndex: 'insuredObjectPaperNo',},
    {title: '收款行号',dataIndex: 'inBankNo',},
    {title: '收款行名',dataIndex: 'inBankName',},
    {title: '收款账号',dataIndex: 'inNo',},
    {title: '收款户名',dataIndex: 'inName',},
    {title: '交易金额',dataIndex: 'count',},
  ];
  const year=new Date().getFullYear();
  const month=new Date().getMonth()+1;
  const nowMonth=year+'-'+(month<10?'0'+month:month);
  export default {
    name: 'treatManage',
    mixins:[deleteEmptyProperty],
    data () {
      return {
        selectCode:'',
        ywNum:'',
        safe:[],
        nowMonth,//月份
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        activeKey:0,
        visible:false,
        id:'',//点击业务批次号记录
        /*外部表格*/
        data:[],
        loading:false,
        selectedRows: [],
        selectedRowKeys:[],
        columns,
        current:1,
        total:0,
        pageSize: 10,
        /*内部表格*/
        jbjg:'',//内部表格上方信息
        ywqb:'',
        columns2,
        columns3,
        data2:[],
        data3:[],
        /*明细表格*/
        mxVisible:false,
        mxData:[],
        mxLoading:false,
        mxColumn,
        mxCurrent:1,
        mxTotal:0,
        mxPageSize:10
      }
    },
    methods: {
      /*过滤条件*/
      moment,
      dateChange(date, dateString) {
        this.nowMonth=dateString;
      },
      /*标签页切换回调*/
      callback () {
        this.selectedRowKeys = [];//去掉勾选
        this.getTableData();
      },
      /*分页管理*/
      changePage(page, pageSize){
        this.current=page;
        this.getTableData();
      },
      changePageSize(current, size){
        this.current=current;
        this.pageSize=size;
        this.getTableData();
      },
      mxChangePage(page, pageSize){
        this.mxCurrent=page;
        this.mxTable();
      },
      mxChangePageSize(current, size){
        this.mxCurrent=current;
        this.mxPageSize=size;
        this.mxTable();
      },
      /*表格选择数据*/
      onSelectChange (selectedRowKeys,value) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = value;
      },
      /*加载表格数据*/
      getTableData(){
        this.loading=true;
        let param={
          aae140:this.selectCode,
          aaz030:this.ywNum,
          aae002:this.nowMonth.replace('-',''),
          page:this.current-1,
          size:this.pageSize,
        };
        param=this.deleteEmptyProperty(param);
        const url=this.service_bdmp+'/api/BatchGrant';
        ajaxData("get",url,param, (res) => {
          this.data=res.data;
          this.total=parseInt(res.headers["x-page-totalelements"]);
          this.loading=false;//取消加载动画
          this.selectedRowKeys = [];//取消勾选
          this.selectedRows=[];//清空勾选数据
        });
      },
      /*详情页*/
      showModal(record){
        this.id=record.id;
        this.visible=true;
        this.jbjg=record.aab034;//经办机构
        this.ywqb=record.aae002;//业务期别
        this.data2=[{
          aaa088:record.aaa088,
          aaa079:record.aaa079,
          totalCompany:record.totalCompany,
          totalCount:record.totalCount,
          totalPeople:record.totalPeople,
          totalMoney:record.totalMoney
        }];
      },
      /*按钮功能*/
      checkFun(){//查询
        this.getTableData();
      },
      mxTable(){//查看明细数据
        if(this.selectedRows.length==0){
          this.$message.warning('请选择数据！');
        }
        else{
          this.mxVisible=true;
          this.mxLoading=true;
          const url=this.service_bdmp+'/api/workFlow/queryFileContent';
          const params={
            aae140:this.selectedRows[0].aae140,
            aaz030:this.selectedRows[0].aaz030,
            aab034:this.selectedRows[0].aab034,
            aae002:this.selectedRows[0].aae002,
            pageSize:this.mxPageSize,
            pageNum:this.mxCurrent-1
          };
          ajaxData("get",url,params, (res) => {
            if(res.data.code==0){
              this.mxData=res.data.result;
              this.mxTotal=res.data.total;
            }
            else{
              this.$error({
                title:'失败',
                content:res.data.result
              });
            }
            this.mxLoading=false;//取消加载动画
          });
        }
      }
    },
    computed:{
      service_sms(){
        return this.$store.state.setting.service_sms
      },
      service_bdmp(){
        return this.$store.state.setting.service_bdmp
      },
    },
    mounted () {
      const that=this;
      const url=this.service_sms+'/api/asVal?valType.typeCode=riskCode&fetchProperties=id,asCode,asValue';
      ajaxData("get",url,{}, (res) => {
        that.safe=res.data;
        that.selectCode=that.safe[0].asCode;
        that.getTableData();
      });
    }
  }
</script>

<style lang="less" scoped>
  @import "./../../../assets/pubCss/card";
</style>

