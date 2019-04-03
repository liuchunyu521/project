/**
  Author:liuchym@yonyou.com
  desc:"定期待遇选择"
**/
<template>
  <div>
    <a-modal
      title="生成基金拨付申请"
      v-model="visible"
      @ok="handleOk"
      width="1000px"
      okText="确认"
      cancelText="取消"
    >
      <a-row style="margin-bottom:8px">
        
        <a-col :span="8">
            <span>险种：</span>
            <a-select defaultValue="" style="width: 120px" @change="handleChange">
                <a-select-option value="jack">A级</a-select-option>
                <a-select-option value="lucy">B级</a-select-option>
            </a-select>
        </a-col>
        <a-col :span="8">
            <span>待遇所属期：</span>
            <span style="width：200px;display: inline-block;">
              <a-input  placeholder=""/>
            </span>
        </a-col>
        <a-col :span="8">
          <a-button type="primary">查询</a-button>
        </a-col>
      </a-row>

      <!-- table 区域 -->
      <a-table bordered :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :scroll="{ x: 1600 }"  :columns="columns" :dataSource="data" :pagination="false">
           
      </a-table>
    </a-modal>
  </div>
</template>

<script>
// table 数据
const columns = [{
  title: '业务批次号',
  dataIndex: 'bankNodeName',
}, {
  title: '财务批次号',
  dataIndex: 'bankNodeAddress',
}, {
  title: '险种',
  dataIndex: 'bankNodeSeq',
},{
  title: '拨付时间',
  dataIndex: 'regoinId',
},{
  title: '拨付方式',
  dataIndex: 'regoinId1',
},{
  title: '是否财政专户发放',
  dataIndex: 'regoinId2',
},{
  title: '支出户银行名',
  dataIndex: 'regoinId3',
},{
  title: '支出户银行号',
  dataIndex: 'regoinId4',
},{
  title: '支持户开户行',
  dataIndex: 'regoinId5',
},{
  title: '银行编号',
  dataIndex: 'regoinId6',
},{
  title: '发放人数',
  dataIndex: 'regoinId7',
},{
  title: '金额(元)',
  dataIndex: 'regoinId8',
},{
  title: '经办机构名称',
  dataIndex: 'regoinId9',
},{
  title: '拨付方式',
  dataIndex: 'regoinId10',
},{
  title: '拨付方式',
  dataIndex: 'regoinId11',
},{
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
}];

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    bankNodeName: `中国工商银行 ${i}`,
    bankNodeAddress: '北京市海淀区',
    bankNodeSeq: `2938493754754 ${i}`,
    regoinId: `北京 ${i}`,
    regoinId1: `四川 ${i}`,
  });
}
export default {
  name: 'expensesPlanMgtBillsAlert',
  components: {
    
  },
  data() {
    return {
      visible: false,
      data,//table表格数据  
      columns,
     selectedRowKeys: [], // Check here to configure the default column
    }
  },
  methods: {
    noshowModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      // console.log(this.$refs.singleTable.setCurrentRow(row));
      this.handleSubmit(e)
      this.visible = false
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    handleChange(value) {//险种下拉
      console.log(`selected ${value}`);
    },
     onSelectChange (selectedRowKeys,value) {//table 选择行数据
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys = selectedRowKeys;
    },
  }
}
</script>

<style lang="less" >


</style>
