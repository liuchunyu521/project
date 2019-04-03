/**
  Author:liuchym@yonyou.com
  desc:"资金账户监控详细""
**/
<template>
  
  <div class="accountGoldcontrolConfig">
      <a-form
            :form="form"
            @submit="handleSubmit"
         >
        <div>
            <div class="title">
                方案名称
            </div>
            
                <a-row>
                    <a-col :span="12">
                        <a-form-item
                            label="方案名称"
                            :label-col="{ span: 5 }"
                            :wrapper-col="{ span: 12 }"
                            >
                            <a-input
                                v-decorator="[
                                'formData.planName',
                                {
                                    rules: [{ required: true, message: '请输入方案名称' }],
                                    initialValue:formData.planName}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="方案描述"
                            :label-col="{ span: 5 }"
                            :wrapper-col="{ span: 12 }"
                            >
                        <a-textarea  :autosize="{ minRows: 2, maxRows: 6 }"
                            v-decorator="[
                            'formData.planDescribe',
                            {
                                rules: [{ required: false, message: '' }],
                                initialValue:formData.planDescribe}
                            ]"
                        
                         ></a-textarea> 
                        </a-form-item>
                        
                    </a-col>
                </a-row>
            
        </div>
        <div class="title">
            预警规则配置
        </div>
        <a-row>
            <a-col :span="12">
                <a-form-item
                label="配置银行账户"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
                >
                <a-radio-group :options="plainOptions"
                     v-decorator="[
                        'formData.type',
                        {
                            rules: [{ required: false, message: '' }],
                            initialValue:formData.type}
                    ]"
                 @change="onChange"  />
            </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item
                    label="预警级别"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                    >
                    <a-select 
                        
                        style="width: 120px" 
                        v-decorator="[
                            'formData.warnLevel',
                            {
                                rules: [{ required: false, message: '' }],
                                initialValue:formData.warnLevel
                            }
                        ]"
                    >
                        <a-select-option value="1">1</a-select-option>
                        <a-select-option value="2">2</a-select-option>
                    </a-select>
                    
                </a-form-item>
            </a-col>
        </a-row>
        <a-row v-if="bankvalue=='2'">
            <a-col :span="5"></a-col>
            <a-col :span="12">
                <a-form-item>
                    <a-select 
                        v-decorator="[
                            'formData.subAccount',
                            {
                                rules: [{ required: false, message: '' }],
                                initialValue:formData.subAccount}
                        ]"
                    style="width: 120px" >
                        <a-select-option :value="item.id+'-'+item.lastModifiedVersion" :key="item.id" v-for="item in unitSubAccountData">{{item.subAccountName}}</a-select-option>
                        
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <!-- 配置table区域 -->
        <a-table style="margin-top:8px;" bordered :dataSource="dataSource" :columns="columns" :pagination="false">
        <template slot="leftSelect" slot-scope="text, record">
            <a-select  v-model="record.leftSelect" style="width: 120px" >
                <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in leftSelectData">{{item.asValue}}</a-select-option>
            </a-select>
        </template>
       <template slot="field" slot-scope="text, record">
            <a-select  v-model="record.field" style="width: 120px" >
                <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in fieldData">{{item.asValue}}</a-select-option>
            </a-select>
        </template>
        <template slot="operator" slot-scope="text, record">
            <a-select  v-model="record.operator" style="width: 120px" >
                <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in operatorData">{{item.asValue}}</a-select-option>
            </a-select>
        </template>
        <template slot="limitValue" slot-scope="text, record">
            <a-input  v-model="record.limitValue" style="width: 120px" />
        </template>
        <template slot="rightSelect" slot-scope="text, record">
            <a-select  v-model="record.rightSelect" style="width: 120px" >
                <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in rightSelectData">{{item.asValue}}</a-select-option>
            </a-select>
        </template>
        <template slot="relatives" slot-scope="text, record">
            <a-select  v-model="record.relatives" style="width: 120px" >
                <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in relativesData">{{item.asValue}}</a-select-option>
            </a-select>
        </template>


        <template slot="operation" slot-scope="text, record,index">
                <a style="margin-right:4px" v-if="index!=0" href="javascript:;" @click='upData(record,index)'>上移</a>
                <a style="margin-right:4px" v-if="index!=dataSource.length-1" href="javascript:;" @click='downData(record,index)'>下移</a>

                <a-popconfirm
                    v-if="record.id"
                    title="确定从数据库删除吗?"
                    @confirm="() => onDelete(record.id,index)">
                    <a href="javascript:;">删除</a>
                </a-popconfirm>
                <a v-else @click="onDelete(record.id,index)" href="javascript:;">删除</a>
        </template>
        </a-table>
        <div style="margin-top:6px;"> 
            <a-button class="butwidth" @click="handleAdd">+</a-button>
            <a-button class="butwidth" type="primary" @click="onSave">保存</a-button>
        </div>
    </a-form>
  </div>
</template>

<script>
import compare from '../../components/mixins/compare'
import { ajaxData } from '../../components/mixins/ajaxdata';
export default {
  name: 'accountGoldcontrolConfig',
  components: {},
  mixins:[compare],
  data () {
    return {
        form: this.$form.createForm(this),
       bankvalue:'1',//配置银行账户

       plainOptions:[
            { label: '全部账户', value: '1' },
            { label: '单一账户', value: '2' }
        ],
        dataSource: [],
        count: 0,
        columns: [{
            title: '左下拉列表',
            dataIndex: 'leftSelect',
            scopedSlots: { customRender: 'leftSelect' },
        }, {
            title: '字段',
            dataIndex: 'field',
            scopedSlots: { customRender: 'field' },
        }, {
            title: '操作符',
            dataIndex: 'operator',
            scopedSlots: { customRender: 'operator' },
        }, {
            title: '值',
            dataIndex: 'limitValue',
            scopedSlots: { customRender: 'limitValue' },
        }, {
            title: '右下拉列表',
            dataIndex: 'rightSelect',
            scopedSlots: { customRender: 'rightSelect' },
        }, {
            title: '关系符',
            dataIndex: 'relatives',
            scopedSlots: { customRender: 'relatives' },
        },{
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
        }],
        formData:{//表单区域涉及的数据
            planName:null,//方案
            planDescribe:null,//方案描述
            type:'1',//方案类型
            warnLevel:1,//预警级别
            subAccount:''//单位账户
        },
        unitSubAccountData:[],//银行账户
        leftSelectData:[],
        fieldData:[],
        operatorData:[],
        rightSelectData:[],
        relativesData:[],
        modifyData:'',//修改数据初始;
        flag:false,//判断是新增的保存 还是修改的保存；
    }
  },
  created(){
    //   新增请求的各种参数
    this.request();

    var data=this.$route.query

    if(data.id){
        // 走修改查询数据
        this.modifyrequest(data.id);
        this.flag=true;
    }
  },
  methods: {
    modifyrequest(id){
        var _url='sifc-sms/api/MoneyWarnPlan/'+id+'?fetchProperties=*,subAccount[*],warnPlanItems[*,leftSelect[*],field[*],operator[*],rightSelect[*],relatives[*]]';
        ajaxData("get",_url,'', (res) => {
            console.log(res)
            this.modifyData=res.data;

            this.formData.planName=res.data.planName
            this.formData.planDescribe=res.data.planDescribe
            this.formData.type=res.data.type
            this.bankvalue=res.data.type
            this.formData.warnLevel=res.data.warnLevel
            if(res.data.subAccount){
                this.formData.subAccount=res.data.subAccount.id+'-'+res.data.subAccount.lastModifiedVersion;
            }
            var _data=res.data.warnPlanItems;
            for(var i=0;i<_data.length;i++){
                if(_data[i].leftSelect){
                    _data[i].leftSelect=_data[i].leftSelect.id+'-'+_data[i].leftSelect.lastModifiedVersion;
                }
                if(_data[i].field){
                    _data[i].field=_data[i].field.id+'-'+_data[i].field.lastModifiedVersion;
                }
                if(_data[i].operator){
                    _data[i].operator=_data[i].operator.id+'-'+_data[i].operator.lastModifiedVersion;
                }
                if(_data[i].rightSelect){
                    _data[i].rightSelect=_data[i].rightSelect.id+'-'+_data[i].rightSelect.lastModifiedVersion;
                }
                if(_data[i].relatives){
                    _data[i].relatives=_data[i].relatives.id+'-'+_data[i].relatives.lastModifiedVersion;
                }
            }
            this.dataSource=_data;

        });
    },
    request(){//新增请求数据
        //银行账户
        var unitSubAccounturl='sifc-sms/api/unitSubAccount';
        ajaxData("get",unitSubAccounturl,'', (res) => {
            this.unitSubAccountData=res.data;
        });

        var leftSelecturl='sifc-sms/api/AsVal?fetchProperties=*,asVals[*]&valType=6';
        ajaxData("get",leftSelecturl,'', (res) => {
            this.leftSelectData=res.data;
        });

        var fieldurl='sifc-sms/api/AsVal?fetchProperties=*,asVals[*]&valType=8';
        ajaxData("get",fieldurl,'', (res) => {
            this.fieldData=res.data;
        });

        var  operatorurl='sifc-sms/api/AsVal?fetchProperties=*,asVals[*]&valType=9';
        ajaxData("get", operatorurl,'', (res) => {
            this.operatorData=res.data;
        });
        var rightSelecturl='sifc-sms/api/AsVal?fetchProperties=*,asVals[*]&valType=7';
        ajaxData("get",rightSelecturl,'', (res) => {
            this.rightSelectData=res.data;
        });
        var relativesurl='sifc-sms/api/AsVal?fetchProperties=*,asVals[*]&valType=10';
        ajaxData("get",relativesurl,'', (res) => {
            this.relativesData=res.data;
        });




    },
    swapItems(arr, index1, index2){
    　　arr[index1] = arr.splice(index2,1,arr[index1])[0]
    　　return arr
    },
    upData (arr, index) {
    　　if (this.dataSource.length > 1 && index !== 0) {
    　　　　this.dataSource = this.swapItems(this.dataSource, index, index - 1)
    　　}
    },
    downData (arr, index) {
    　　if (this.dataSource.length > 1 && index !== (this.dataSource.length - 1)) {
    　　　　this.dataSource = this.swapItems(this.dataSource, index, index + 1)
    　　}
    },
    
    onChange(e) { //配置银行账户 单选
      this.bankvalue=e.target.value;
      console.log('radio1 checked', e.target.value)
    },
   
    onDelete (id,index) {
        if(id){
            var _url='sifc-sms/api/WarnPlanItem/delete/'+id;
            ajaxData("delete",_url,'', (res) => {
                this.dataSource.splice(index,1)
            });
        }
      
    },
   
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        field: null,
        leftSelect: null,
        limitValue: null,
        operator: null,
        relatives: null,
        rightSelect:null
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    },
    handleSubmit (e,_data) {//保存
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
            let _data= JSON.parse(JSON.stringify(this.dataSource)) 
            for(var i=0;i<_data.length;i++){
                if(_data[i].leftSelect){//左下拉数据处理
                    var array=_data[i].leftSelect.split("-");
                    _data[i].leftSelect={
                        "id":array[0],
                        "lastModifiedVersion":array[1]
                    }
                }
                if(_data[i].field){//字段数据处理
                    var array=_data[i].field.split("-");
                    _data[i].field={
                        "id":array[0],
                        "lastModifiedVersion":array[1]
                    }
                }
                if(_data[i].operator){//操作符数据处理
                    var array=_data[i].operator.split("-");
                    _data[i].operator={
                        "id":array[0],
                        "lastModifiedVersion":array[1]
                    }
                }
                if(_data[i].rightSelect){//右下拉数据处理
                    var array=_data[i].rightSelect.split("-");
                    _data[i].rightSelect={
                        "id":array[0],
                        "lastModifiedVersion":array[1]
                    }
                }
                if(_data[i].relatives){//关系符数据处理
                    var array=_data[i].relatives.split("-");
                    _data[i].relatives={
                        "id":array[0],
                        "lastModifiedVersion":array[1]
                    }
                }
                _data[i].indexSeq=i;
            }

            // 单位账户数据处理
            if(values.formData.subAccount){
                 var subAccountdata=values.formData.subAccount.split("-");
                values.formData.subAccount={
                    "id":subAccountdata[0],
                    "lastModifiedVersion":subAccountdata[1]
                }
            }
            // 发送保存请求
            console.log(values,_data)
            this.saveRequest(values,_data)
        }
      })
    },
    saveRequest(values,_data){
        var _url='sifc-sms/api/MoneyWarnPlan';
        if(this.flag==true){
            //修改保存；
            var modifyValue=values.formData;
            console.log(values)
            var params=this.modifyData;
                params.planDescribe=modifyValue.planDescribe
                params.planName=modifyValue.planName
                params.subAccount=modifyValue.subAccount
                params.type=modifyValue.type
                params.warnLevel=modifyValue.warnLevel
                params.warnPlanItems=_data;
        }else{
            // 新增保存
            var params=values.formData;
                params.warnPlanItems=_data;
        }
        ajaxData("post",_url,params, (res) => {
            this.$message.success('保存成功')
            this.$router.push({//返回列表页
                path: "/projectconfigMgt/accountGoldcontrolConfig"
            });
        });
    },
    onSave(e){//保存
        var _data=this.dataSource;
        this.handleSubmit(e,_data);
    },
    onCellChange (id,dataIndex,value) {  
        
    },
    
  }
}
</script>

<style lang="less" scoped>
 .accountGoldcontrolConfig {
     padding: 16px;
     .title {
         border-left:4px solid blue;padding-left:6px;font-size:16px;
         font-weight: 600;
     }
     .butwidth {
         width: 60px;
     }
 }
 .ant-form-item  {
     margin-bottom: 0px;
 }
</style>
