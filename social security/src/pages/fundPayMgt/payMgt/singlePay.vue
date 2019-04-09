/**
  Author:liuchym@yonyou.com
  desc:"支出管理单笔支付"
**/
<template>
    <div>
        <!-- <a-tabs>
            <a-tab-pane tab="批量支付" key="1"></a-tab-pane>
        </a-tabs> -->

        <div style="background:#e6f7ff;height:100px;padding:16px">
            <a-row>
               <a-col :span="8">
                    <span style="display:inline-block;width:100px;text-align:right;">险种：</span>
                    <a-select defaultValue="" style="width: 160px" @change="handleChange1">
                        <a-select-option value="jack">A级</a-select-option>
                        <a-select-option value="lucy">B级</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="8">
                    <span>业务批次号：</span>
                    <span style="display: inline-block;">
                     <a-input  placeholder=""/>
                    </span>
                </a-col>
                <a-col :span="8">
                    <span>财务批次号：</span>
                    <span style="display: inline-block;">
                     <a-input  placeholder=""/>
                    </span>
                </a-col>
               <a-col style="margin-top:8px" :span="8">
                    <span>待遇所属日期：</span>
                    <span style="display: inline-block;">
                     <a-date-picker @change="onChange" placeholder=""/>
                    </span>
                </a-col>
                
            </a-row>
           
        </div>
        <!-- table 区域 -->
        <div style="height:40px;margin-top:8px;">
            <div style="float:left;">
              <a-button type='primary'>查询</a-button>
              <a-button  type='primary'>待遇支付</a-button>
              <a-button  type='primary'>打印</a-button>
              <a-button  type='primary'>导出</a-button>
            </div>
        </div>
        <a-tabs @change="callback" type="card">
          <a-tab-pane tab="未支付" key="1"></a-tab-pane>
          <a-tab-pane tab="支付在途" key="2"></a-tab-pane>
          <a-tab-pane tab="银行实付信息" key="3"></a-tab-pane>
        </a-tabs>
        <a-table bordered :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="data" :pagination="false" :scroll="{x:2000 }">
        </a-table>
        <div style="margin-top:8px">
          <div style="float:right">
            <a-pagination 
              showSizeChanger 
              :pageSizeOptions="pageSizeOptions"
              :pageSize.sync="pageSize" 
              @showSizeChange="onShowSizeChange" 
              :total="500" 
              v-model="current">
                <template slot='buildOptionText' slot-scope='props'>
                  <span v-if="props.value!=='50'">{{props.value}}条/页</span>
                  <span v-if="props.value==='50'">全部</span>
                </template>
            </a-pagination>
          </div>
        </div>
    </div>
</template>
<script>

const columns = [{
  title: '业务批次号',
  dataIndex: 'name',
  width: 110,
  fixed:"left"
}, {
  title: '财务支付计划批次号',
  dataIndex: 'age',
  width: 100,
}, {
  title: '险种',
  dataIndex: 'address1',
  width: 150,
}, {
  title: '拨付方式',
  dataIndex: 'address2',
  width: 150,
}, {
  title: '应付类型',
  dataIndex: 'address3',
  width: 150,
}, {
  title: '付款银行行别',
  dataIndex: 'address4',
  width: 150,
}, {
  title: '付款银行编码(联行号)',
  dataIndex: 'address5',
  width: 150,
},{
  title: '付款银行网点名称',
  dataIndex: 'address6',
  width: 150,
},{
  title: '付款银行户名',
  dataIndex: 'address7',
  width: 150,
},{
  title: '付款银行账号',
  dataIndex: 'address8',
  width: 150,
},{
  title: '发放人数',
  dataIndex: 'address9',
  width: 150,
},{
  title: '金额（元）',
  dataIndex: 'address10',
  width: 150,
},{
  title: '社保经办机构',
  dataIndex: 'address11',
  width: 150,
}];

const data = [];
for (let i = 0; i < 4; i++) {
  data.push({
    key: i,
    name: `4343234 ${i}`,
    age:`B ${i}`,
    address1: `546 ${i}`,
    address2: `2019-09-08`,
    address3: `2019-09-08`,
    address4: `用友政务`,
    address5: `启用`,
    address6: `北京市 ${i}`,
    address7: `London ${i}`,
    address8: `London ${i}`,
    address9: `London ${i}`,
  });
}
export default {
  name: 'expensesPlanMgtBills',
  data () {
    return {
      data,
      columns,
       selectedRowKeys: [], // Check here to configure the default column
      //分页所需要数据
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSize: 10,
      current:0,
    }
  },
  computed: {
    
  },
  mounted () {
   
  },
  watch:{
    pageSize(val) {
      console.log('pageSize',val);
    },
    current(val) {
      console.log('current',val);
    }
  },
  methods: {
    handleChange1(value) {//险种
      console.log(`selected ${value}`);
    },
    
    onChange(date, dateString) {//日期改变
      console.log(date, dateString);
    },
   
    checkFun(){
        //查询
    },
    callback (key) {//标签页
      console.log(key)
    },
     onSelectChange (selectedRowKeys,value) {
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys = selectedRowKeys;
    },
     onShowSizeChange(current, pageSize) {//分页器
      console.log(current, pageSize);
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>

