/**
Author:liuchym@yonyou.com
desc:"支出管理单笔支付"
edit:huangwqk
**/
<template>
  <div>
    <a-tabs>
      <a-tab-pane tab="单笔支付" key="1"></a-tab-pane>
    </a-tabs>
    <div style="background:#e6f7ff;padding:16px">
      <a-row>
        <a-col :span="8">
          <span class="choiceText">险种：</span>
          <a-select style="width: 200px" v-model="selectCode" >
            <a-select-option v-for="item in safe" :value="item.asCode" :key="item.id">{{item.asValue}}</a-select-option>
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
          <span style="display: inline-block;">
                    <a-input  placeholder="请输入" v-model="ywNum"/>
                  </span>
        </a-col>
      </a-row>
    </div>
    <div style="padding: 6px 0">
      <a-button type='primary' @click="checkFun">查询</a-button>
      <a-button type='primary' v-show="this.activeKey==0?true:false" @click="payment" :loading="payLoading">待遇支付</a-button>
    </div>
    <!-- table 区域 -->
    <a-tabs @change="callback" v-model="activeKey">
      <a-tab-pane tab="未支付" :key="0"></a-tab-pane>
      <a-tab-pane tab="支付在途" :key="1"></a-tab-pane>
      <a-tab-pane tab="银行实付信息" :key="2"></a-tab-pane>
    </a-tabs>
    <a-table bordered
             :loading="loading"
             :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:onSelectChange,type:'radio'}"
             :columns="columns"
             :dataSource="data"
             :pagination="false"
             :scroll="{x:'150%' }">
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;" @click="showModal(record)">详情</a>
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
      title="发放银行"
      v-model="visible"
      @ok="visible=false"
      okText="确定"
      cancelText="关闭"
      width="1000px">
      <div style="margin-bottom: 20px">
        <a-button type='primary' v-show="this.activeKey==1?true:false"
                  @click="resend"
                  :loading="threeLoading">重发</a-button>
        <a-button type='primary' v-show="this.activeKey==1?true:false"
                  @click="twoButtons(service_bdmp+'/api/sendToBank/queryBatchFile')"
                  :loading="threeLoading">查看支付进度</a-button>
        <a-button type='primary' v-show="this.activeKey==1?true:false"
                  @click="twoButtons(service_bdmp+'/api/sendToBank/batchReturnNotice')"
                  :loading="threeLoading">回盘重发</a-button>
      </div>
      <div>
        <a-table  bordered
                  :loading="loading2"
                  :columns="columns2"
                  :dataSource="data2"
                  :rowSelection="{selectedRowKeys: selectedRowKeys2,onChange:onSelectChange2,type:'radio'}"
                  :pagination="false"
                  :scroll="{x:'120%' }">
        </a-table>
      </div>
      <div>
        <div style="float:right;margin-top:8px">
          <a-pagination
            :showTotal="total => `共 ${total2} 条数据`"
            showSizeChanger
            :pageSizeOptions="pageSizeOptions"
            :pageSize="pageSize2"
            @showSizeChange="changePageSize2"
            @change="changePage2"
            :total="total2"
            v-model="current2">
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
    {title: '业务批次号', dataIndex: 'aaz030', fixed:'left', width:150,},
    {title: '险种', dataIndex: 'aae140',},
    {title: '经办机构',dataIndex: 'aab034',},
    {title: '待遇所属期',dataIndex: 'aae002',},
    {title: '拨付方式', dataIndex: 'aaa079',},
    {title: '应付类型', dataIndex: 'aaa088',},
    {title: '支付状态', dataIndex: 'dataStatus',},
    {title: '单位个数', dataIndex: 'totalCompany',},
    {title:'发放笔数', dataIndex:'totalCount'},
    {title: '发放人数', dataIndex: 'totalPeople',},
    {title: '金额（元）', dataIndex: 'totalMoney', align: 'right',},
    {title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, fixed:'right',}
  ];
  const columns2=[
    {title: '财务汇总批次号', dataIndex: 'aaz032', fixed:'left', width:150,},
    {title: '费款所属期', dataIndex: 'aae002',},
    {title: '银行代码', dataIndex: 'bankCode',},
    {title: '支付状态', dataIndex: 'dataStatus',},
    {title: '总单位数', dataIndex: 'totalCompany',},
    {title: '总人数', dataIndex: 'totalPeople',},
    {title: '总金额', dataIndex: 'totalMoney',},
    {title: '总笔量', dataIndex: 'totalCount',},
    {title: '失败金额', dataIndex: 'failMoney',},
    {title: '失败数量', dataIndex: 'failCount',}
  ];
  const columns3=[

  ];
  const columns4=[

  ];
  const year=new Date().getFullYear();
  const month=new Date().getMonth()+1;
  const nowMonth=year+'-'+(month<10?'0'+month:month);
  export default {
    name: 'batchPay',
    mixins:[deleteEmptyProperty],
    data () {
      return {
        /*查询条件*/
        selectCode:'',
        ywNum:'',
        safe:[],
        nowMonth,
        /*分页格式、页签及一些属性*/
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        activeKey:0,
        visible:false,
        record:'',//点击详情记录
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
        data2:[],
        loading2:false,
        selectedRows2: [],
        selectedRowKeys2:[],
        columns2,
        columns3,
        columns4,
        current2:1,
        total2:0,
        pageSize2: 10,
        /*按钮加载状态*/
        payLoading:false,
        threeLoading:false
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
      changePage2(page, pageSize){
        this.current2=page;
        this.getTableData2();
      },
      changePageSize2(current, size){
        this.current=current;
        this.pageSize2=size;
        this.getTableData2();
      },
      /*表格选择数据*/
      onSelectChange (selectedRowKeys,value) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = value;
      },
      onSelectChange2 (selectedRowKeys,value) {
        this.selectedRowKeys2 = selectedRowKeys;
        this.selectedRows2 = value;
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
          dataStatus:'0'+this.activeKey
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
      getTableData2(){
        this.loading2=true;
        let param={
          page:this.current2-1,
          size:this.pageSize2,
          batchGrant:this.record.id
        };
        param=this.deleteEmptyProperty(param);
        const url=this.service_bdmp+'/api/BatchGrantItem';
        ajaxData("get",url,param, (res) => {
          this.data2=res.data;
          this.total2=parseInt(res.headers["x-page-totalelements"]);
          this.loading2=false;//取消加载动画
          this.selectedRowKeys2 = [];//取消勾选
          this.selectedRows2=[];//清空勾选数据
        });
      },
      /*详情页*/
      showModal(record){
        this.record=record;
        this.visible=true;
        this.getTableData2();
      },
      /*按钮功能*/
      checkFun(){//查询
        this.getTableData();
      },
      payment(){//待遇支付
        if(this.selectedRows.length==0){
          this.$message.warning('请选择数据！');
        }
        else{
          this.payLoading=true;
          ajaxData("get",this.service_bdmp+'/api/sendToBank/fileReadyToBankMore',{id:this.selectedRows[0].id,aaz030:this.selectedRows[0].aaz030}, (res) => {
            this.payLoading=false;
            if(res.data.code==0){//成功
              this.$message.success(res.data.msg);
              this.getTableData();
            }
            else{
              this.$error({
                title:'失败',
                content:res.data.msg
              });
            }
          });
        }
      },
      resend(){//重发
        if(this.selectedRows2.length==0){
          this.$message.warning('请选择数据！');
        }
        else{
          this.threeLoading=true;
          ajaxData("get",this.service_bdmp+'/api/sendToBank/fileReadyToBankOne',{aaz032:this.selectedRows2[0].aaz032,aaz030:this.record.aaz030}, (res) => {
            this.threeLoading=false;
            if(res.data.code==0){//成功
              this.$message.success(res.data.msg);
              this.getTableData2();
            }
            else{
              this.$error({
                title:'失败',
                content:res.data.msg
              });
            }
          });
        }
      },
      twoButtons(url){//第二页签三个按钮
        if(this.selectedRows2.length==0){
          this.$message.warning('请选择数据！');
        }
        else{
          this.threeLoading=true;
          ajaxData("get",url,{aaz032:this.selectedRows2[0].aaz032}, (res) => {
            this.threeLoading=false;
            if(res.data.code==0){//成功
              this.$message.success(res.data.msg);
              this.getTableData2();
            }
            else{
              this.$error({
                title:'失败',
                content:res.data.msg
              });
            }
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
  .choiceText{
    display:inline-block;
    width:100px;
    text-align:right;
  }
</style>

