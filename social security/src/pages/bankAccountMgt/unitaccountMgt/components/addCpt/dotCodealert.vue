/**
  Author:liuchym@yonyou.com
  desc:"单位账户网点代码弹框"
**/
<template>
  <div>
    <a-modal
      title="银行网点"
     :visible="visible"
      @ok="handleOk"
      width="800px"
      okText="确认"
      cancelText="取消"
       @cancel="handleCancel"
    >
     <a-table 
      
      bordered  
      :rowSelection="{selectedRowKeys: selectedRowKeys,type:'radio', onChange: onSelectChange}" 
      :columns="columns" :dataSource="dataSource" 
      :scroll="{ x: 1000 }" 
      :pagination="false"
     />
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'unitaccountaddalert',
  components: {
    
  },
  props:['dotCodealertvisible','bankNodeListData'],
  data() {
    return {
      visible: this.dotCodealertvisible,
      selectedRowKeys:[],
      columns:[
        { title: '银行网点代码',  dataIndex: 'bankNodeSeq' },
        { title: '网点名称', dataIndex: 'bankNodeName' },
        { title: '银行网点地址', dataIndex: 'bankNodeAddress' },
        { title: '省份', dataIndex: 'province' },
        { title: '城市', dataIndex: 'city'},
      ],
      dataSource:this.bankNodeListData,
      selectedRows:'',//网点选中的值；
    }
  },
  created(){
    console.log(this.bankNodeListData)
  },
  methods: {
    noshowModal() {
      this.visible = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {//获取table 选中的数据
     this.selectedRowKeys = selectedRowKeys;
    this.selectedRows=selectedRows;
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.$emit('onEsc',this.selectedRows[0]);
      this.visible = false;
    },
    handleCancel(e) {
      this.$emit('onEsc','')
      this.visible = false;
    },
  }
}
</script>

<style lang="less" >


</style>
