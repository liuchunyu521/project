/**
  Author:liuchym@yonyou.com
  desc:"账户资金监控信息"
**/
<template>
    <div>
        <a-tabs>
            <a-tab-pane tab="账户资金监控信息" key="1"></a-tab-pane>
        </a-tabs>

        <div style="background:#e6f7ff;height:60px;padding:16px">
            <a-row>
                <a-col :span="5">
                    <span>预警方案：</span>
                    <a-select defaultValue="" style="width: 120px" @change="handleChange1">
                        <a-select-option value="jack">Jack</a-select-option>
                        <a-select-option value="lucy">Lucy</a-select-option>
                        <a-select-option value="disabled" disabled>Disabled</a-select-option>
                        <a-select-option value="Yiminghe">yiminghe</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="5">
                    <span>预警级别：</span>
                    <a-select defaultValue="" style="width: 120px" @change="handleChange1">
                        <a-select-option value="jack">Jack</a-select-option>
                        <a-select-option value="lucy">Lucy</a-select-option>
                        <a-select-option value="disabled" disabled>Disabled</a-select-option>
                        <a-select-option value="Yiminghe">yiminghe</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="11">
                    <span>日期：</span>
                    <a-date-picker @change="onChange1" placeholder=""/>
                    至
                    <a-date-picker @change="onChange2" placeholder=""/>
                </a-col>
                <a-col :span="3">
                    <a-button @click="checkFun()" type='primary'>查询</a-button>
                </a-col>
            </a-row>
        </div>
        <!-- table 区域 -->
        <a-table bordered :columns="columns" :dataSource="data" :pagination="false" :scroll="{x:2000, y: 240 }" />
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
  title: '预警方案',
  dataIndex: 'name',
  width: 250,
  fixed:"left"
}, {
  title: '预警级别',
  dataIndex: 'age',
  width: 150,
}, {
  title: '银行',
  dataIndex: 'address1',
  width: 200,
}, {
  title: '账户',
  dataIndex: 'address2',
  width: 200,
}, {
  title: '险种',
  dataIndex: 'address3',
  width: 200,
}, {
  title: '银行交易流水号',
  dataIndex: 'address4',
  width: 200,
}, {
  title: '交易日期',
  dataIndex: 'address5',
  width: 200,
}, {
  title: '摘要',
  dataIndex: 'address6',
  width: 200,
}, {
  title: '用途',
  dataIndex: 'address7',
  width: 200,
}, {
  title: '预警信息',
  dataIndex: 'address8',
  fixed:'right',
  width: 200,
}];

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    name: `风险 ${i}`,
    age:`1 ${i}`,
    address1: `中国银行 ${i}`,
    address2: `34535657879 ${i}`,
    address3: `A ${i}`,
    address4: `B ${i}`,
    address5: `2019-03- ${i}`,
    address6: `北京市 ${i}`,
    address7: `London ${i}`,
    address8: `London ${i}`,
    address9: `London ${i}`,
  });
}
export default {
  name: 'accountGoldcontrol',
  data () {
    return {
      data,
      columns,
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
    handleChange1(value) {//预警方案下拉
      console.log(`selected ${value}`);
    },
    handleChange2(value) {//预警级别下拉
      console.log(`selected ${value}`);
    },
    onChange1(date, dateString) {//日期改变
      console.log(date, dateString);
    },
    onChange2(date, dateString) {
      console.log(date, dateString);
    },
    checkFun(){
        //查询
    },
     onShowSizeChange(current, pageSize) {//分页器
      coonShowSizeChangensole.log(current, pageSize);
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>

