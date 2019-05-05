/**
  Author:liuchym@yonyou.com
  desc:"调剂金制单详细"
**/

<template>
  <div >
    <!-- button area -->
     <!-- <div style="height:40px">
       <a-button style="float:right">新增</a-button>
     </div> -->
    <!-- check area -->
    <div style="height:40px">
      <div style="float:left">
        <a-button v-if="makebillid!=''" type="primary">
          <a :href="httpurl+service_sms+'/api/adjustFund/exportExcel?adjustFundId='+makebillid" download="ddd">导出</a>
        </a-button>
        <a-button type="primary" v-if="flag ==1" @click="doPrint()">打印</a-button>
        <a-button type="primary" v-if="seeState !=1" @click="onSubmit()">提交</a-button>
        <a-button type="primary" v-if="flag !=1" @click="onSave()">保存</a-button>
        <!-- <a-button type="primary">关闭</a-button> -->
      </div>
    </div>
    <div id="printBox" class="adjustbillswrap">
      <!-- 按钮区域 -->
      <div>
        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="16">
            <a-select ref="wrap" :disabled='disabled' :allowClear="true" v-model="year"  style="width: 120px" @change="handleChangeyear">
              <a-select-option :key="index" v-for="(item,index) in yeardata" :value="yeardata[index]">
                      {{yeardata[index]}}
              </a-select-option>
            </a-select>
            <span>年</span>
            <span v-if="quarterOrMonth==1">
              <a-select :allowClear="true" :disabled='disabled' v-model="month" style="width: 120px" @change="handleChangemonth">
                <a-select-option :value="item.value" :key="index" v-for="(item,index) in monthdata">{{item.key}}</a-select-option>
              </a-select>
            
              <span>月</span>
            </span>
            <span v-else>
              <a-select :allowClear="true" :disabled='disabled' v-model="quarter" style="width: 120px" @change="handleChangequarter">
                <a-select-option :value="item.value" :key="index" v-for="(item,index) in quarterdata">{{item.key}}</a-select-option>
                      
              </a-select>
              <span>季度</span>
            </span>
              <a-select v-model="riskCode" :disabled='disabled' style="width: 120px" @change="handleChangecold">
                <a-select-option :value="item.asCode" :key="index" v-for="(item,index) in risks">{{item.asValue}}</a-select-option>
                
              </a-select>
            
            <span>调剂金拨款表</span>

          </a-col>
          <a-col :span="4">
            <a-button :disabled='disabled' v-if="flag !=1" @click="oncheck()">查询</a-button>
          </a-col>
        </a-row>
        <div style="margin-top:18px;margin-bottom:8px">
          <a-row >
            <a-col :span="8">调剂金单号：<a href="javascript:;">{{adjustFundNo}}</a></a-col>
            <a-col :span="12"></a-col>
            <a-col :span="4">单位：万元</a-col>
          </a-row>
        </div>
        <!-- 表单区域 -->
        <!--startprint-->
        <!-- 打印区域 -->
        <div >
          <div  class="adjustFundItemswrap">
            <div class="line"></div>
            <a-row>
              <div :key="index" v-for="(item,index) in adjustFundItems">
                <div v-if="item.isNewline==true && item.isShow==true">
                    <a-col :span="item.keySpace">
                      <div class="dataItemstyle">{{item.dataItem}}</div>
                    </a-col>
                    <a-col :span="item.valueSpace">
                      <div class="dataValuestyle">
                        <span style="width:100%" v-if="item.dataIntoWay=='01'">
                          <a-input :key="index" v-if="disabled==false" @change="onchangefun"  v-model="item.dataValue"></a-input>
                          <span v-else>{{item.dataValue}}</span>
                        </span>
                        <span style="width:100%"  v-else-if="item.rowId=='ZD2'">
                          <a-input :key="index" v-if="disabled==false" @change="onchangefun" v-model="item.dataValue"></a-input>
                          <span v-else>{{item.dataValue}}</span>
                        </span>
                        <span v-else>{{item.dataValue}}</span>
                      </div>
                    </a-col>
                </div>
                <div v-else-if="item.isNewline==false && item.isShow==true">
                  <a-col :span="item.keySpace">
                    <div class="dataItemstyle">{{item.dataItem}}</div>
                  </a-col>
                  <a-col :span="item.valueSpace">
                    <div class="dataValuestyle">
                        <span style="width:100%" v-if="item.dataIntoWay=='01'">
                          <a-input :key="index" v-if="disabled==false" @change="onchangefun" v-model="item.dataValue"></a-input>
                          <span v-else>{{item.dataValue}}</span>
                        </span>
                        <span style="width:100%" v-else-if="item.rowId=='ZD2'">
                          <a-input  @change="onchangefun" v-if="disabled==false" :key="index"  v-model="item.dataValue"></a-input>
                           <span v-else>{{item.dataValue}}</span>
                        </span>
                        <span v-else>{{item.dataValue}}</span>
                    </div>
                  </a-col>
                </div>
              </div>
            </a-row>

          </div>
        </div>
      </div>
    </div>
    <!--endprint-->  

    <!-- 附件信息区域 -->
    <div style="margin-top:8px">
      <div v-if="isEnableUpload==true" class="fontstyle">附件信息</div>
        <div style="padding:16px">
          <template>
            <a-upload :action="action" :showUploadList="false" :data="upmyData"  :headers="myHeader" :multiple="true"  @change="handleChange">
              <a-button :disabled='disabled'>
                <a-icon type="upload" /> 上传
              </a-button>
            </a-upload>
          </template>
          <div style="margin-bottom: 8px;" :key="index" v-for="(item,index) in fileListData">
            <span style="display:inline-block;width:360px;">{{item.fileName.replace(item.uuid,'')}}</span>
              <a-button  style="margin-right:8px"  type="primary">
                <a :href="httpurl+service_sms+'/api/storage/download?fileName='+item.fileName+'&filePath='+item.filePath+'&serviceType=SMS_ADJUST'" download="ddd">下载</a>
              </a-button>
              <a-button type="primary" :disabled='disabled' @click="ondeletefile(item,index)">删除</a-button></div>
          </div>
        <div>
      </div>
    </div>
    <!-- 审批流程区域 -->
    <div>
      <div class="fontstyle">审批流程</div>
        <div style="padding:16px">
          <a-tabs defaultActiveKey="1" @change="callback">
            <a-tab-pane tab="流程跟踪" key="1">
              <workflow-flow v-if="workflow" direction="horizontal" :options='options' />
            </a-tab-pane>
            <a-tab-pane tab="审批历史" key="2" forceRender>
                <a-table bordered :dataSource="dataSource" :columns="columns" ></a-table>
            </a-tab-pane>
          </a-tabs>

        </div>
      <div>

      </div>
    </div>
      
  </div>
</template>

<script>

import deleteEmptyProperty from '../components/mixins/json.js';
import { ajaxData } from '../components/mixins/ajaxdata.js';
import { Component, Prop, Vue } from "vue-property-decorator";
import workflow, {
  canTaskRevoke,
  revoke,
  startWorkflow
} from "../components/libs";

Vue.use(workflow);
export default {
  name: 'adjustbillsdetails',
  mixins:[deleteEmptyProperty], 
  data () {
    return {
      yeardata:'',//年度
      quarterdata:[{
        key:"一",
        value:1
      },{
        key:"二",
        value:2
      },{
        key:"三",
        value:3
      },{
        key:"四",
        value:4
      }],
      monthdata:[
        {key:"1月",value:1},
        {key:"2月",value:2},
        {key:"3月",value:3},
        {key:"4月",value:4},
        {key:"5月",value:5},
        {key:"6月",value:6},
        {key:"7月",value:7},
        {key:"8月",value:8},
        {key:"9月",value:9},
        {key:"10月",value:10},
        {key:"11月",value:11},
        {key:"12月",value:12}
        ],//月份数据
      
      

      dataSource: [{//审批历史数据
        key: '0',
        name: '谢莹莹',
        age: '2019-09-09 15:30:00',
        address: '通过',
        address1: '同意',
      },{
        key: '1',
        name: '谢莹莹',
        age: '2019-09-09 15:30:00',
        address: '通过',
        address1: '同意',
      }],
      columns: [{//审批历史表头
        title: '操作人',
        dataIndex: 'name',
        width: '30%',
      }, {
        title: '操作日期',
        dataIndex: 'age',
      }, {
        title: '操作',
        dataIndex: 'address',
      }, {
        title: '备注',
        dataIndex: 'address1',
      }],
      //方案id
      planId:'',
      // 制单id
      makebillid:'',//控制导出
      modifyid:'',//修改要传的制单id
      lastModifiedVersion:'',//修改要传的版本号
      //文件上传需要的一些信息
      myHeader:{
            'Authorization': 'Bearer '+localStorage.getItem("uptoken")
      },//请求头设置
      action:'',
      upmyData:{
        // serviceType:'SMS_ADJUST'
      },
      defaultFileList: [],
      //查询所需要的数据
      year:'',
      month:'',
      quarter:'',
      riskCode:'',
      adjustFundNo:"", //调剂金单号
      risks:'',//调剂金拨款表数据
      organization:'',
      adjustFundItems:[],//显示项目
      hideAdjustFundItems:[],//隐藏项目
      // 文件上传需要的数据
      fileListData:[],
      httpurl:'',//获取ip
      disabled:false,
      flag:2,//2 查询按钮代表是新增 0, 代表是走修改接口 1 查看
      seeId:'',//查看传的id
      seeState:'',//查看的状态
      modifyData:'',//修改保存提交数据
      isEnableUpload:'',//是否显示 上传附件
      quarterOrMonth:'',//显示月份还是季度

      options:{//流程所需要的参数
        procInstId:null
      },
      workflow:false,//流程显示
    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  created () {
    console.log(this.service_sms)
    this.httpurl=localStorage.getItem("IP"); //上线
    this.action=localStorage.getItem("IP")+this.service_sms+'/api/storage/upload?serviceType=SMS_ADJUST';

    // 上线记得干掉获取token的请求 测试使用上传功能
    var paramstoken={
      username:'88888888',
      password:'qqq123',
      grant_type:'password'
    }
    var _urltoken=this.httpurl+'auth/oauth/token?';
    this.$axios.post(_urltoken,paramstoken ,{
      transformRequest: [
          function(paramstoken) {
              let ret = '';
              for (let it in paramstoken) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(paramstoken[it]) + '&';
              }
              return ret;
          }
      ],
      headers: {
        "Authorization": 'Basic bXlpZDpteXNlY3JldA=='
      }
    }).then((res) => {
        console.log(res)
        localStorage.setItem("uptoken",res.data.access_token)
     })

    //制单新增时操作
    var data=this.$route.query//通过数据来判断跳转过来的是从方案跳，还是从制单页面跳
    
    if(data.flag==0){//修改
      this.planId=data.planId;
      this.requestmodify(data.id);
      this.options.procInstId=data.procInstId;
      this.workflow=true;
      this.flag=0;
      console.log("走修改请求接口")
    }else if(data.flag==1){//查看
      console.log(data)
      this.options.procInstId=data.procInstId;
      this.workflow=true;
      this.planId=data.planId;
      this.seeId=data.id;
      this.requestmodify(data.id);
      this.flag=1;
      this.disabled=true;
      this.seeState=data.key;
      console.log("走查看请求接口")
    }else {
      console.log("走新增接口")
      this.planId=data.id;
      this.request(data.id);
    }
    

    var Data='';
    var _url=this.service_sms+'/api/adjustFund/getHeadData/'+this.planId;
    ajaxData("get",_url,Data, (res) => {
      console.log(res)
        this.yeardata=res.data.years;//年获取值
        this.risks=res.data.risks;//调剂金拨款表
        this.quarterOrMonth=res.data.quarterOrMonth;//
        this.isEnableUpload=res.data.isEnableUpload;
    });

  },
  
  methods: {

      doPrint(){
        var printBox = document.getElementById('printBox');
        //拿到打印的区域的html内容
        var newContent =printBox.innerHTML;
        //将旧的页面储存起来，当打印完成后返给给页面。
        var oldContent = document.body.innerHTML;
        //赋值给body
        document.body.innerHTML = newContent;
        //执行window.print打印功能
        window.print();
        // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
      },     
    
    request(order){//新增请求数据
      // 获取方案项
      var Data='';
      var _url=this.service_sms+'/api/adjustFund/apply/'+order;
      ajaxData("get",_url,Data, (res) => {
        var a=res.data.showAdjustFundItems;//显示项目
        var b=res.data.hideAdjustFundItems;//显示项目
        a.concat(b)
         this.adjustFundItems=a;//项目
         this.adjustFundNo=res.data.adjustFundNo;//调剂金号
         this.organization=res.data.org.id;
      });
    },
    requestmodify(order){//修改请求数据
      var Data='';
      var _url=this.service_sms+'/api/adjustFund/'+order+'?fetchProperties=*,adjustFundItems[*]';
      ajaxData("get",_url,Data, (res) => {

        console.log(res)
          this.modifyData=res.data;

          this.adjustFundItems=res.data.adjustFundItems;//项目
          this.adjustFundNo=res.data.adjustFundNo;//调剂金号
          this.organization=res.data.organization;//机构id
          this.fileListData=res.data.attachment;//附件的数据

          this.year=res.data.year;
          console.log(this.year)
          this.month=res.data.month;
          this.quarter=res.data.quarter;
          this.riskCode=res.data.riskCode;
          this.makebillid=res.data.id;
          this.modifyid=res.data.id;
          this.lastModifiedVersion=res.data.lastModifiedVersion;
          this.$forceUpdate();
          
      });
    },
    onchangefun(e){//判断输入是否正确进行校验
      var b=e.target.value
      if(isNaN(b)){
        // e.target.parentElement.classList.add("has-error");
        return false
      }else{
        // e.target.parentElement.classList.remove("has-error");
        this.onblur();//输入正确执行计算操作
      }
    },
    onblur(){//失去焦点进行计算
      console.log("进行计算")
      var res=this.adjustFundItems;
      this.adjustFundItems=this.calculate(res);

    },
    
    ondeletefile(item,index){//删除附件
      console.log(item)
      var Data={
        fileName:item.fileName,
        filePath:item.filePath,
        serviceType:'SMS_ADJUST'
      }
      var _url=this.service_sms+'/api/storage/delete'
       ajaxData("get",_url,Data, (res) => {
         this.fileListData.splice(index,1)
          this.$message.success(res.data.msg)
      });
    },
    calculate(res){//计算运算规则
      var res=res;
      // 循环出变量值 在进行赋值；
      for(var i=0;i<res.length;i++){
        if(res[i].dataIntoWay=='03'){//判断存在运算项时 先完成一个运算，
          var str=res[i].rowId;
          for(var j=0;j<res.length;j++){
            if(new RegExp(res[j].rowId).test(str)==true){
              str=str.replace(res[j].rowId,res[j].dataValue)
            }
          }
          res[i].dataValue=eval(str);
        }
      }
      return res;
      console.log(res);
    },
    oncheck(){
      
      if(this.flag==2){//新增  接口不一致 返回数据格式也不一致只能分开写
        this.makebillid='';
        var _url=this.service_sms+'/api/adjustFund/prepareData';
        var Data={
            planId:this.planId,
            year:this.year,
            month:this.month,
            quarter:this.quarter,
            riskCode:this.riskCode
        }
        Data=this.deleteEmptyProperty(Data)
        ajaxData("get",_url,Data, (res) => {
          var a=res.data.showAdjustFundItems;//显示项目
          var b=res.data.hideAdjustFundItems;//显示项目
          a.concat(b)
          console.log(a)
          var _Data=this.calculate(a)
          this.adjustFundItems=_Data;
        });
      }else {//修改
        var _url=this.service_sms+'/api/adjustFund/prepareModifiedData';
        var Data={
            planId:this.planId,
            id:this.makebillid,
            year:this.year,
            month:this.month,
            quarter:this.quarter,
            riskCode:this.riskCode
        }
        Data=this.deleteEmptyProperty(Data)
        ajaxData("get",_url,Data, (res) => {
          var _Data=this.calculate(res.data.adjustFundItems);
          this.adjustFundItems=_Data;
          this.makebillid='';
        });

      }
    },

    handleChangemonth(value){//月度选择
      this.month=value;
      console.log(`selected ${value}`);
    },
    handleChangeyear(value) {//年选择
      this.year=value;
      console.log(`selected ${value}`);
    },
    handleChangequarter(value) {//季度选择
      this.quarter=value;
      console.log(`selected ${value}`);
    },
    handleChangecold(value) {//拨款表选择
      this.riskCode=value;
      console.log(`selected ${value}`);
    },
    handleChange({file, fileList}) {//上传附件
      console.log(file)
      if(file.response && file.response.code==0){
        // var result = file.response.fileName.replace(file.response.uuid,'');
        this.fileListData.push({
          fileName:file.response.data.fileName,
          filePath:file.response.data.filePath,
          uuid:file.response.data.uuid
        })
        // if(this.fileListData.length!=0){
        //   for(var i=0;i<this.fileListData.length;i++){
        //     if(this.fileListData[i].fileName.indexOf(file.response.fileName)==-1){
        //       var result = file.response.fileName.replace(file.response.uuid,'');
        //       this.fileListData.push({
        //         fileName:result,
        //         filePath:file.response.filePath,
        //         uuid:file.response.uuid
        //       })
        //     }else{
        //       this.$message.error("不能上传重复的附件")
        //     }
            
        //   }
        // }else {
        //   var result = file.response.fileName.replace(file.response.uuid,'');
        //   this.fileListData.push({
        //     fileName:result,
        //     filePath:file.response.filePath,
        //     uuid:file.response.uuid
        //   })
        // }
      }
        console.log(this.fileListData)

    },
    callback (key) {//审批流程页签 切换值
      console.log(key)
    },
    onSubmit(){//提交操作
      if(this.flag==1){//查看时候提交接口
        this.requestseeing();
      }else{
        this.requestData(1,"提交成功");
      }
    },
    onSave(){
      this.requestData(0,"保存成功");
    },
    requestseeing(res){
      // 查看时候的提交
      console.log(this.flag)
      var _url=this.service_sms+'/api/adjustFund/batchCommitData';
      var Data=[this.seeId]
      ajaxData("post",_url,Data, (res) => {
          if(res.data.code==0){
           this.$message.success("提交成功")
           this.request();
         }else{
           this.$message.error("提交失败")
         }
      });
    },
    requestData(state,msg){
      //保存操作 提交操作
      console.log(this.adjustFundItems)
      // 去申请金额值 组织机构值
      var applyAmount;
      for(var i=0;i<this.adjustFundItems.length;i++) {
        if(this.adjustFundItems[i].rowId=='ZD2'){
            applyAmount=this.adjustFundItems[i].dataValue;
        }
       
      }
      console.log(applyAmount)
     // auditState 点击保存传0,提交传1

      var _url='';
      if(state==1){//提交
          _url=this.service_sms+'/api/adjustFund/commitDataToSave';
        }else {
          _url=this.service_sms+'/api/adjustFund';
        }
      if(this.flag==2){//新增时候的提交保存
        var Data={
            planId:this.planId,
            year:this.year,
            month:this.month,
            quarter:this.quarter,
            riskCode:this.riskCode,
            adjustFundNo:this.adjustFundNo,
            organization:this.organization,
            applyAmount:applyAmount,
            auditState:state,
            attachment:this.fileListData
        }
      }else {//修改传的数据  的提交保存
        var Data=this.modifyData;
            Data.year=this.year
            Data.month=this.month
            Data.quarter=this.quarter
            Data.riskCode=this.riskCode
            Data.applyAmount=applyAmount
            Data.attachment=this.fileListData
            Data.auditState=state
      }
      
      Data.adjustFundItems=this.adjustFundItems;
      Data=this.deleteEmptyProperty(Data)
      ajaxData("post",_url,Data, (res) => {
        if(res.status==200){
          this.$message.success(msg)
          this.makebillid=res.data.id;
          // 提交 保存成功跳回列表页
          this.$router.push({//跳回列表页
              path: "/adjustGoldMgt/adjustMakeBills?id="+this.planId
          });
        }else {
          console.log(res)
        }
        
      });
    }

  }
}
</script>

<style lang="less" scoped>
  .adjustbillswrap {
    border: 1px solid #ddd;
    height: 100%;
    border-radius: 4px;
    padding: 16px;
  }
  .fontstyle {
    font-size: 16px;
    font-weight: 600;
  }
  .adjustFundItemswrap {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    position: relative;
    .line {
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0px;
        left: 1px;
        z-index: 99;
        border-bottom: 1px solid #fff;
    }

  }
  .dataItemstyle {
    border-left:1px solid #ddd;
    border-bottom:1px solid #ddd;
    background: #efefef;
    padding: 4px;
    height: 46px;
    display: flex;
    align-items: center;        /* 垂直居中 */
    // justify-content: center;    /* 水平居中 */
  }
  .dataValuestyle {
    border-left:1px solid #ddd;
    border-bottom:1px solid #ddd;
    padding: 4px;
    height: 46px;
    display: flex;
    align-items: center;        /* 垂直居中 */
    // justify-content: center;    /* 水平居中 */
  }
</style>
