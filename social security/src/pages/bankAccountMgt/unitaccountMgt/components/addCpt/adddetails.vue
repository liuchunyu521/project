/**
  Author:liuchym@yonyou.com
  desc:"单位账户新增账户明细"
**/
<template>
  <div>
    <div class="L_list" style="margin-top:8px">
        <div class="title">账户明细</div>
        <div class="content" style="padding:0;">
          
          <a-table  
            
            :dataSource="dataSource" 
            :columns="columns" 
            :scroll="{ x: 1600, y: 300 }"  
            :pagination="false"
            :rowSelection="{
              type:'radio',
              selectedRowKeys: selectedRowKeys, 
              onChange: onSelectChange
            }"
          >
            <!-- 银行账号(子账号) -->
            <template slot="subAccountNo" slot-scope="text, record">
                <a-input  v-model="record.subAccountNo"  />
            </template>
            <!--账户名称 -->
            <template slot="subAccountName" slot-scope="text, record">
                <a-input  v-model="record.subAccountName"  />
            </template>
            <!-- 账户类型 -->
            <template slot="subAccountType" slot-scope="text, record">
                <a-select  v-model="record.subAccountType"  >
                    <a-select-option :value="1" >死期</a-select-option>
                    <a-select-option :value="2" >活期</a-select-option>
                </a-select>
            </template>
            <!-- 基金险种 -->
            <template slot="insType" slot-scope="text, record">
                <a-select  v-model="record.insType"  >
                    <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in risksdata">{{item.asValue}}</a-select-option>
                </a-select>
            </template>
            
             <!-- 账户类型 -->
            <template slot="isSubAccount" slot-scope="text, record">
                <a-select  v-model="record.isSubAccount"  >
                    <a-select-option :value="1" >是</a-select-option>
                    <a-select-option :value="0" >否</a-select-option>
                </a-select>
            </template>
            <template slot="operation" slot-scope="text, record,index">
              <a-popconfirm
                v-if="dataSource.length"
                title="确定删除?"
                @confirm="() => onDelete(index)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
           <div style="padding:5px">
             <a-button class="editable-add-btn" @click="handleAdd">+</a-button>
             <!-- <a-button class="editable-add-btn" @click="handle">获取</a-button> -->
           </div>
        </div>
      </div>
      <span>余额合计：{{balance}}</span>元

      <!-- 流水记录 -->

      <a-modal
          title="账户明细流水查询"
        :visible="visible"
          @ok="handleOk"
          width="800px"
          okText="确认"
          cancelText="取消"
          @cancel="handleCancel"
        >

        <a-table 
          bordered  
         
          :columns="columnsdetails" 
          :dataSource="dataSourcedetails" 
          :scroll="{ x: 1000 }" 
          :pagination="true"
        />
    </a-modal>
  </div>
</template>

<script>
import { ajaxData } from '../../../../components/mixins/ajaxdata.js';
export default {
  name: 'unitaccountadddetails',
  props:['subAccountListdata'],
  data() {
    return {
      // 流水记录相关配置
      visible:false,
      columnsdetails:[{
        title: '银行交易流水号',
        dataIndex: 'bankSeqNo', 
      },
      {
        title: '交易时间',
        dataIndex: 'arrivalAccountDate', 
      },{
        title: '业务类型',
        dataIndex: 'businessType', 
      },{
        title: '摘要',
        dataIndex: '', 
      },{
        title: '用途',
        dataIndex: '', 
      },{
        title: '收款单位',
        dataIndex: '', 
      },{
        title: '收款账户',
        dataIndex: '', 
      },{
        title: '借贷标识',
        dataIndex: '', 
      },{
        title: '借方发生',
        dataIndex: '', 
      },{
        title: '贷方发生',
        dataIndex: '', 
      },{
        title: '余额',
        dataIndex: '', 
      }],
      dataSourcedetails:[],
      // 明细相关配置
      selectedRowKeys:[],
      dataSource: this.subAccountListdata,
      count: 2,
      columns: [{
        title: '银行账号(子账号)',
        dataIndex: 'subAccountNo',
        width: 150,
        fixed: 'left',
        scopedSlots: { customRender: 'subAccountNo' }
      }, {
        title: '账户名称',
        dataIndex: 'subAccountName', 
        width: 200,
        scopedSlots: { customRender: 'subAccountName' }
      }, {
        title: '账户类型',
        dataIndex: 'subAccountType',
        width: 150,
        scopedSlots: { customRender: 'subAccountType' }
      }, {
        title: '余额',
        dataIndex: 'subAccountBalance',
        width: 150
      }, {
        title: '余额更新日期',
        dataIndex: 'balanceDate',
        width: 150
      }, {
        title: '基金险种',
        dataIndex: 'insType',
        scopedSlots: { customRender: 'insType' },
        width: 150
      }, {
        title: '账套',
        dataIndex: 'accSysId',
        width: 150
      }, {
        title: '科目名称',
        dataIndex: 'subjectId',
        width: 150
      }, {
        title: '是否子账户',
        dataIndex: 'isSubAccount',
        scopedSlots: { customRender: 'isSubAccount' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
      }],
      risksdata:'',//基金险种数据
      balance:0,//余额
      updatadata:'',//所要更新的数据
    }
  },
  computed:{
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  mounted(){
    // // 获取险种
      var _url=this.service_sms+'/api/asVal?valType.typeCode=riskCode';
      ajaxData("get",_url,'', (res) => {
        console.log(res)
        this.risksdata=res.data;
      })
      // this.dataSource=this.subAccountListdata;
      console.log(this.subAccountListdata)
      this.calData();
  },
  methods: {
    handle(){
      // console.log(this.dataSource)
      var _data=JSON.parse(JSON.stringify(this.dataSource));

      for(var i=0;i<_data.length;i++){
        if(_data[i].insType){//左下拉数据处理
            var array=_data[i].insType.split("-");
            _data[i].insType={
                "id":array[0],
                "lastModifiedVersion":array[1]
            }
        }
      }
      return _data;
    },
    onSelectChange (selectedRowKeys, value) {//获取table 选中的数据
  
     this.selectedRowKeys = selectedRowKeys;
     var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].id)
      }
      this.updatadata=_data;
    },
    updatarequestbalance(){
      var id=this.updatadata[0]
      if(id){
        var _url=this.service_sms+'/api/unitAccount/getBlance/'+id;
        ajaxData("get",_url,'', (res) => {
          var id=res.data.data.id;
          for(let i=0;i<this.dataSource.length;i++){
            if(this.dataSource[i].id==id){
              this.dataSource[i].subAccountBalance=res.data.data.subAccountBalance;
              this.dataSource[i].balanceDate=res.data.data.balanceDate;
              this.dataSource[i].lastModifiedVersion=res.data.data.lastModifiedVersion;
            }
          }
          this.$message.success('余额更新成功');
          this.calData();//更新
        })
      }else {
        this.$message.warning('请选择要更新明细');
      }
    },
    onDelete (index) {
      this.dataSource.splice(index,1)
    },
    calData(){//计算总金额
      var sum=0;
      if(this.dataSource.length>0){
        for(let i=0;i<this.dataSource.length;i++){
          sum=sum+Number(this.dataSource[i].subAccountBalance);
        }
      }
      this.balance=sum;

    },
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        subAccountNo:null,
        subAccountName:null,
        subAccountType:2,
        subAccountBalance:0,
        balanceDate:null,
        insType:null,
        accSysId:null,
        subjectId:null,
        isSubAccount:1,
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    },
  }
}
</script>

<style lang="less" >
.L_list {
  .title {
    height: 40px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px 4px 0 0;
  }
  .content {
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px  4px;
    padding: 16px;  
  }

}

.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.L_list .editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}

</style>
