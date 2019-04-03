/**
  Author:liuchym@yonyou.com
  desc:"单位账户新增账户明细"
**/
<template>
  <div>
    <div class="L_list" style="margin-top:8px">
        <div class="title">账户明细</div>
        <div class="content" style="padding:0;">
          
          <a-table  :dataSource="dataSource" :columns="columns" :scroll="{ x: 1500, y: 300 }"  :pagination="false">
            <template slot="address" slot-scope="text, record">
               <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, 'address')"
              />

              <template v-else>{{record.address}}</template>
            </template>
            
            
            <template slot="name" slot-scope="text, record">
              <a-select v-if="record.editable" v-model="record.name" style="width: 120px" @change="onCellChange(record.key, 'name',record.name)">
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
              </a-select>

              <template v-else>{{record.name}}</template>
              <!-- <editable-cell :text="text" @change="onCellChange(record.key, 'name',text)"  /> -->
            </template>



            <template slot="operation" slot-scope="text, record,index">
              
              <span v-if="record.editable">
                <a @click="() => save(record.key)">保存</a>
                <a-popconfirm title='确定取消?' @confirm="() => cancel(record.key)">
                  <a>取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a href="javascript:;" style="margin-left:4px" @click="onedit(record.key)">编辑</a>
              </span>
              
              <a-popconfirm
                v-if="dataSource.length"
                title="确定删除?"
                @confirm="() => onDelete(record.key)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
           <div style="padding:5px">
             <a-button class="editable-add-btn" @click="handleAdd">+</a-button>
             <a-button class="editable-add-btn" @click="handle">获取</a-button>
           </div>
        </div>
      </div>
      <span>余额合计：XXXXXX</span>元
  </div>
</template>

<script>
import EditableCell from './EditableCell'
export default {
  name: 'unitaccountadddetails',
  components: {
    EditableCell,
  },
  data() {
    return {
      cacheData:[{
        key: '0',
        name: '北京',
        age: '32',
        address: '北京银行',
        address1: '用友政务',
        address2: '2019-09-09',
        address3: '2019-09-09',
        address4: 'A',
        address5: '海淀区',
        address6: '北京市',
      }],
      dataSource: [{
        key: '0',
        name: '北京',
        age: '32',
        address: '北京银行',
        address1: '用友政务',
        address2: '2019-09-09',
        address3: '2019-09-09',
        address4: 'A',
        address5: '海淀区',
        address6: '北京市',
      }],
      count: 2,
      columns: [{
        title: '银行账号(子账号)',
        dataIndex: 'name',
        width: 200,
        fixed: 'left',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '账户名称',
        dataIndex: 'age', 
        width: 150
      }, {
        title: '账户类型',
        dataIndex: 'address',
        width: 150
      }, {
        title: '余额',
        dataIndex: 'address1',
        width: 150
      }, {
        title: '余额更新日期',
        dataIndex: 'address2',
        width: 150
      }, {
        title: '基金险种',
        dataIndex: 'address3',
        width: 150
      }, {
        title: '账套',
        dataIndex: 'address4',
        width: 150
      }, {
        title: '科目名称',
        dataIndex: 'address5',
        width: 150
      }, {
        title: '是否子账户',
        dataIndex: 'address6',
        width: 150
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
      }],
    }
  },
  methods: {
    handle(){
      console.log(this.dataSource)
    },
    onChange(...args) {
      console.log(args)
    },
    handleChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    onCellChange (key,dataIndex,value) {  
     
      console.log(key,dataIndex,value)
     
        const dataSource = [...this.dataSource]
        const target = dataSource.find(item => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.dataSource = dataSource

          console.log( this.dataSource)
        
      }
    },
    onedit (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.dataSource = newData
      }
    },
    save (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.dataSource = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },
    cancel (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.dataSource = newData
      }
    },
    onDelete (key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
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
