/**
  Author:liuchym@yonyou.com
  desc:"对账数据源管理"
**/
<template>
    <div>
        <a-tabs>
            <a-tab-pane tab="对账数据源管理" key="1"></a-tab-pane>
        </a-tabs>

        <div style="background:#e6f7ff;height:100px;padding:16px">
            <a-row>
                <a-col :span="8">
                    <span>对账方案：</span>
                    <a-select defaultValue="" style="width: 120px" @change="handleChange1">
                        <a-select-option value="jack">方案一</a-select-option>
                        <a-select-option value="lucy">方案二</a-select-option>
                        <a-select-option value="Yiminghe">方案三</a-select-option>
                    </a-select>
                </a-col>
                
                <a-col :span="8">
                    <span>截止日期：</span>
                    <a-date-picker @change="onChange" placeholder=""/>
                   
                </a-col>
               
              </a-row>
              <a-row>
                 <a-col :span="8">
                  <span>对账状态：</span>
                   <a-radio-group defaultValue="a" buttonStyle="solid">
                    <a-radio-button value="a">全部</a-radio-button>
                    <a-radio-button value="b">已对账</a-radio-button>
                    <a-radio-button value="c">未对账</a-radio-button>
                  </a-radio-group>
                   
                </a-col>
                <a-col :span="8">
                    <span>基金险种：</span>
                    <a-select defaultValue="" style="width: 120px" @change="handleChange1">
                        <a-select-option value="jack">Jack</a-select-option>
                        <a-select-option value="lucy">Lucy</a-select-option>
                        <a-select-option value="disabled" disabled>Disabled</a-select-option>
                        <a-select-option value="Yiminghe">yiminghe</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="5">

                </a-col>
                <a-col :span="3">
                    <a-button @click="checkFun()" type='primary'>查询</a-button>
                </a-col>
            </a-row>
        </div>
        <!-- table 区域 -->
        <a-table bordered :columns="columns" :dataSource="data" :pagination="false" :scroll="{x:1300, y: 240 }" />
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
  title: '对账方案',
  dataIndex: 'name',
  width: 110,
  fixed:"left"
}, {
  title: '级别',
  dataIndex: 'age',
  width: 100,
}, {
  title: '银行',
  dataIndex: 'address1',
  width: 150,
}, {
  title: '账户',
  dataIndex: 'address2',
  width: 150,
}, {
  title: '险种',
  dataIndex: 'address3',
  width: 150,
}, {
  title: '银行交易流水号',
  dataIndex: 'address4',
  width: 150,
}, {
  title: '交易日期',
  dataIndex: 'address5',
  width: 150,
}, {
  title: '摘要',
  dataIndex: 'address6',
  width: 150,
}, {
  title: '用途',
  dataIndex: 'address7',
  width: 150,
}, {
  title: '预警信息',
  dataIndex: 'address8',
  fixed:'right',
  width: 150,
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
    onChange(date, dateString) {//截止日期
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
  .ant-col-8 {
    margin-bottom: 6px;
  }
</style>

