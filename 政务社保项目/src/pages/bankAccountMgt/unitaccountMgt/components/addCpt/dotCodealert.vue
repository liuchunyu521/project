/**
  Author:liuchym@yonyou.com
  desc:"单位账户网点代码弹框"
**/
<template>
  <div>
    <a-modal
      title="银行网点"
      v-model="visible"
      @ok="handleOk"
      width="800px"
      okText="确认"
      cancelText="取消"
    >
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="date"
          label="银行网点代码"
          width="120">
        </el-table-column>
        <el-table-column
          property="name"
          label="网点名称"
          width="120">
        </el-table-column>
        <el-table-column
          property="address"
          label="银行网点地址">
        </el-table-column>
      </el-table>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'unitaccountaddalert',
  components: {
    
  },
  data() {
    return {
      visible: false,
       tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      currentRow: null
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
      console.log(this.currentRow)
      this.visible = false
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
}
</script>

<style lang="less" >


</style>
