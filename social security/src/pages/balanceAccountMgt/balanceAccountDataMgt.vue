/**
  Author:liuchym@yonyou.com
  desc:"对账管理"
**/
<template>
    <div>
      <a-spin :spinning="spinning" >
        <a-button style="margin-left:8px" v-if="recStatus=='0'" @click="handwork()" type='primary'>手工标记对账</a-button>
        <a-popover v-if="recStatus=='0'" placement="bottomLeft">
          <template slot="content">
            <a-table  bordered :rowSelection="{selectedRowKeys: selectedRowKeysTle, onChange: onSelectChangeTle}"  :columns="columnsTle" :dataSource="dataSourceTle" :pagination="false"></a-table>
            <div style="margin-top:8px;">
              <a-button  @click="automaticFuc">确定</a-button>
            </div>
          </template>
          <a-button style="margin-left:8px" type='primary'>自动匹配对账</a-button>
        </a-popover>
        
        <a-button style="margin-left:8px" v-if="recStatus=='1'" @click="cancelRecFuc" type='primary'>取消对账</a-button>
        <a-button style="margin-left:8px" @click="checkFun()" type='primary'>查询</a-button>
        
        <div style="background:#e6f7ff;height:100px;padding:16px;margin-top:6px;">
            <a-row style="margin-bottom:6px;">
                <a-col :span="12">
                    <span>对账方案：</span>
                    <a-select v-model="planId"  style="width: 220px" @change="handPlanid">
                      <a-select-option :key="index" v-for="(item,index) in planIdData" :value="item.id" >
                        {{item.name}}
                      </a-select-option>
                    </a-select>
                </a-col>
                
                <a-col :span="12">
                    <span>截止日期：</span>
                    <a-range-picker @change="onChange" placeholder=""/>
                   
                </a-col>
               
              </a-row>
              <a-row>
                 <a-col :span="12">
                  <span>对账状态：</span>
                   <a-radio-group v-model="recStatus" buttonStyle="solid">
                    <a-radio-button value="1">已对账</a-radio-button>
                    <a-radio-button value="0">未对账</a-radio-button>
                  </a-radio-group>
                   
                </a-col>
                <a-col :span="12">
                    <span>基金险种：</span>
                    <a-select v-model="riskCode" style="width: 220px">
                      <a-select-option :key="index" v-for="(item,index) in risksdata" :value="item.asCode">
                        {{item.asValue}}
                      </a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="5">

                </a-col>
                <a-col :span="3">
                    
                </a-col>
            </a-row>
        </div>
        <!-- table 区域 -->
        <div :key="index" v-for="(item,index) in tableData">
          <!-- 表头 -->
          <div style="line-height:40px;padding-left:16px;">{{item.recName}}</div>
          <!-- 表体 -->
          <a-table v-if="item.busCode=='01'" bordered :columns="columns01" :dataSource="dataSource01" :rowSelection="{fixed:true, columnWidth:60, selectedRowKeys: selectedRowKeys01, onChange: onSelectChange01}" :pagination="false" :scroll="{ x: 2300,y:300 }" />
          <a-table v-if="item.busCode=='02'" bordered :columns="columns02" :dataSource="dataSource02" :rowSelection="{fixed:true, columnWidth:60, selectedRowKeys: selectedRowKeys02, onChange: onSelectChange02}" :pagination="false" :scroll="{ x: 2300,y:300  }" />
          <a-table v-if="item.busCode=='03'" bordered :columns="columns03" :dataSource="dataSource03" :rowSelection="{fixed:true, columnWidth:60, selectedRowKeys: selectedRowKeys03, onChange: onSelectChange03}" :pagination="false" :scroll="{ x: 2300,y:300  }" />
          <a-table v-if="item.busCode=='04'" bordered :columns="columns04" :dataSource="dataSource04" :rowSelection="{fixed:true, columnWidth:60, selectedRowKeys: selectedRowKeys04, onChange: onSelectChange04}" :pagination="false" :scroll="{ x: 2300,y:300  }" />
        </div>
        <div v-if="tableData.length=='0'" style="text-align: center;">
          <img src="../../assets/no.gif" style="height: 300px;">
        </div>

        <!-- 对账完成弹框 -->
        <div>
          <a-modal
            title="对账完成！！！"
            :visible="visible"
            @ok="handleOk"
          >
            <div :key="index" v-for="(item,index) in recDoingData">
              <span>{{item.busDesc}}</span>:
              <span>{{item.totalCount}}</span>笔
              <span>共{{item.totalAmount}}</span>元;
            </div>
            <template slot="footer">
              
              <a-button type="primary"  @click="handleOk">
                知道了
              </a-button>
            </template>
          </a-modal>
        </div>
      </a-spin>
    </div>
</template>
<script>
import { ajaxData } from '../components/mixins/ajaxdata.js';
export default {
  name: 'accountGoldcontrol',
  data () {
    return {
      visible:false,
      spinning: false,
      columnsTle:[{
        title: '对账规则',
        dataIndex: 'ruleName'
      }],
      dataSourceTle:[],
      selectedRowKeysTle: [], // Check here to configure the default column
      dataSource01:[],//社保业务数据
      dataSource02:[],//
      dataSource03:[],//
      dataSource04:[],//
      columns01:[],//社保业务表头
      columns02:[],
      columns03:[],
      columns04:[],

      // 查询需要的字段
      planId:null,//方案id
      recStatus:'0',
      riskCode:null,
      startDate:'',
      endDate:'',
      risksdata:'',//险种数据
      planIdData:'',//方案数据

      // 表格总体数据
      selectedRowKeys01:[],
      selectedRowKeys02:[],
      selectedRowKeys03:[],
      selectedRowKeys04:[],
      selectedRowKeysData01:[],
      selectedRowKeysData02:[],
      selectedRowKeysData03:[],
      selectedRowKeysData04:[],
      tableData:[],

      ruleDataId:'', // 对账规则参数
      isMoney:'',//是否选中了金额
      recDoingData:[],//对账完成显示数据
    }
  },
  computed: {
    service_dep () {
      return this.$store.state.setting.service_dep
    },
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  mounted () {
    //请求查询条件;
    this.originrequest()
    
  },
 
  methods: {
    originrequest(){
      // 获取险种
      var params= {}
      var _url=this.service_sms+'/api/asVal?valType.typeCode=riskCode&fetchProperties=id,asCode,asValue';
      ajaxData("get",_url,params, (res) => {
        console.log(res)
        this.risksdata=res.data;
      })
      // 获取方案数据
      var _url=this.service_sms+'/api/recPlan?';
      ajaxData("get",_url,params, (res) => {
          console.log(res);
          this.planIdData=res.data;
      });


    },
    handPlanid(r,s){//选择方案的是请求规则
     this.rulerequest(r);
    },
   rulerequest(id){
     var _url=this.service_sms+'/api/RecPlanRule?fetchProperties=id,ruleName,isMoney&&recPlan.id='+id;
     ajaxData("get",_url,'', (res) => {
        this.dataSourceTle=res.data;
        for (var item in this.dataSourceTle) {
          if(this.dataSourceTle[item].isMoney){
            this.isMoney=this.dataSourceTle[item].id;
          }
        }
       
      },(err)=>{
        if(err){
          if(err.message){
            this.$warning({
              title: '报错喽 请联系管理员',
              content: err.message,
            });
          }
        }
      });
   },
    onSelectChangeTle (selectedRowKeys,value) {//table 选择行
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeysTle = selectedRowKeys;
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].id)
      }
      this.ruleDataId=_data;
    },
    onSelectChange01(selectedRowKeys,value){
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys01=selectedRowKeys;
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].ID)
      }
      this.selectedRowKeysData01=_data;
      
    },
    onSelectChange02(selectedRowKeys,value){
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys02=selectedRowKeys
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].ID)
      }
      this.selectedRowKeysData02=_data;
    },
    onSelectChange03(selectedRowKeys,value){
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys03=selectedRowKeys
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].ID)
      }
      this.selectedRowKeysData03=_data;
    },
    onSelectChange04(selectedRowKeys,value){
      console.log('selectedRowKeys changed: ', selectedRowKeys,value);
      this.selectedRowKeys04=selectedRowKeys
      var _data=[];
      for(var i=0;i<value.length;i++){
        _data.push(value[i].ID)
      }
      this.selectedRowKeysData04=_data;
    },
    onChange(date, dateString) {//截止日期
      this.startDate=dateString[0];
      this.endDate=dateString[1];
    },
    checkFun(){
      this.spinning=true;
        //查询获取对账的数据
        this.tableData=[]
      this.dataSource01=[]//社保业务数据
      this.dataSource02=[]
      this.dataSource03=[]
      this.dataSource04=[]
      this.columns01=[]//社保业务表头
      this.columns02=[]
      this.columns03=[]
      this.columns04=[]

      this.selectedRowKeys01=[]
      this.selectedRowKeys02=[]
      this.selectedRowKeys03=[]
      this.selectedRowKeys04=[]
      this.selectedRowKeysData01=[]
      this.selectedRowKeysData02=[]
      this.selectedRowKeysData03=[]
      this.selectedRowKeysData04=[]
      var params={
        planId:this.planId,//方案id
        recStatus:this.recStatus,
        riskCode:this.riskCode,
        startDate:this.startDate,
        endDate:this.endDate,
      }
      var _url=this.service_dep+'/api/reconciliation/prepareData';
        
      ajaxData("post",_url,params, (res) => {
        var _data=res.data; 
        this.tableData=_data;
          for(let i=0;i<_data.length;i++){
            if(_data[i].busCode=='01'){
              if(_data[i].titleMap){
                let y=0;
                for(var tmp in _data[i].titleMap){
                  this.columns01.push({
                    width:y == Object.keys(_data[i].titleMap).length-1 ? null : 200,
                    title:_data[i].titleMap[tmp] ,
                    dataIndex: tmp
                  })
                  y++;
                }
              }
              this.dataSource01=_data[i].list;
            }else if(_data[i].busCode=='02'){
              if(_data[i].titleMap){
                let y=0;
                for(var tmp in _data[i].titleMap){
                  this.columns02.push({
                    width:y == Object.keys(_data[i].titleMap).length-1 ? null : 200,
                    title:_data[i].titleMap[tmp] ,
                    dataIndex: tmp
                  })
                  y++;
                }
              }
              this.dataSource02=_data[i].list;
            }else if(_data[i].busCode=='03'){
              if(_data[i].titleMap){
                let y=0;
                for(var tmp in _data[i].titleMap){
                  this.columns03.push({
                    width:y == Object.keys(_data[i].titleMap).length-1 ? null : 200,
                    title:_data[i].titleMap[tmp] ,
                    dataIndex: tmp
                  })
                  y++;
                }
              }
              this.dataSource03=_data[i].list;
            }else if(_data[i].busCode=='04'){
              if(_data[i].titleMap){
                let y=0;
                for(var tmp in _data[i].titleMap){
                  this.columns04.push({
                    width:y == Object.keys(_data[i].titleMap).length-1 ? null : 200,
                    title:_data[i].titleMap[tmp] ,
                    dataIndex: tmp
                  })
                  y++;
                }
              }
              this.dataSource04=_data[i].list;
            }
          }
           
          this.spinning=false;
        },(err)=>{
        if(err){
          if(err.message){
            this.$warning({
              title: '报错喽 请联系管理员',
              content: err.message,
            });
          }
        }
      });
      console.log(params)
    },
    handwork(){
      // 手工对账
      this.spinning=true;
      var a=this.selectedRowKeysData01.concat(this.selectedRowKeysData02),
          b=a.concat(this.selectedRowKeysData03),
          c=b.concat(this.selectedRowKeysData04);
      if(c.length>1){
        var params={
          planId:this.planId,//方案id
          riskCode:this.riskCode,
          ids:c,
          startDate:this.startDate,
          endDate:this.endDate,
        }
        var _url=this.service_dep+'/api/reconciliation/manualRecon';
          
        ajaxData("post",_url,params, (res) => {
          if(res.data.code==0){
              this.$success({
                title: '成功喽！！！',
                content: res.data.msg,
              });
              this.spinning=false;
              this.checkFun();
          }else{
            this.$warning({
                title: '提示',
                content: res.data.msg,
              });
          }

          },(err)=>{
          if(err){
            if(err.message){
              this.$warning({
                title: '报错喽 请联系管理员',
                content: err.message,
              });
            }
          }
        });
      }else {
        this.$message.warning("请选择手工对账的数据")
      }
    },
    handleOk(e) {
      this.visible = false
    },
    cancelRecFuc(){//取消对账
      this.spinning=true;
      var a=this.selectedRowKeysData01.concat(this.selectedRowKeysData02),
          b=a.concat(this.selectedRowKeysData03),
          c=b.concat(this.selectedRowKeysData04);
      if(c.length>1){
        var params={
          planId:this.planId,//方案id
          riskCode:this.riskCode,
          ids:c,
          startDate:this.startDate,
          endDate:this.endDate,
        }
        var _url=this.service_dep+'/api/reconciliation/cancelRecData';
          
        ajaxData("post",_url,params, (res) => {
          if(res.data.code==0){
              this.$success({
                title: '成功喽！！！',
                content: res.data.msg,
              });
              this.spinning=false;
              this.checkFun();

          }else{
            this.$warning({
                title: '提示',
                content: res.data.msg,
              });
          }

          },(err)=>{
          if(err){
            if(err.message){
              this.$warning({
                title: '报错喽 请联系管理员',
                content: err.message,
              });
            }
          }
        });
      }else {
        this.$message.warning("请选择取消对账的数据")
      }
      
    },
    automaticFuc(){//自动对账
      this.spinning=true;
      if(this.ruleDataId){
        if(this.ruleDataId.indexOf(this.isMoney) > -1){
          //则包含该元素
        
          var params={
            planId:this.planId,//方案id
            riskCode:this.riskCode,
            ruleIds:this.ruleDataId,
            startDate:this.startDate,
            endDate:this.endDate,
          }
          var _url=this.service_dep+'/api/reconciliation/autoRecon';
            
          ajaxData("post",_url,params, (res) => {
              this.recDoingData=res.data; 
              this.visible=true;
              this.checkFun();
              this.spinning=false;
            },(err)=>{
            if(err){
              if(err.message){
                this.$warning({
                  title: '报错喽 请联系管理员',
                  content: err.message,
                });
              }
            }
          });
        }else{
          this.$message.error('对账规则必须选择金额');
        }
      }else {
        this.$message.error("请选择对账规则")
      }
    }
     
  }
}
</script>

<style lang="less" scoped>
  .ant-col-8 {
    margin-bottom: 6px;
  }
</style>

