/**
  Author:liuchym@yonyou.com
  desc:"调剂金方案配置详细"
**/
<template>
    <div>
        <!-- <div  style="height:30px;margin-bottom:8px"> -->
            <!-- <a-button style="float:right;" type="primary">新增</a-button> -->
        <!-- </div> -->
        <div style="margin-bottom:8px">
            <a-button  type="primary" @click="onSeeing()">单据预览</a-button>
            <a-button class="butwidth" type="primary" @click="onSave">保存</a-button>
        </div>
        <div class="adjustGOldconfigDetails">
                <!-- 内容区域 -->
                <div class="wrap">
                    
                    <a-form
                        :form="form"
                        @submit="handleSubmit"
                    >
                        <div>
                            <div>
                                <span class="style"></span>
                                <span>方案信息</span>
                            </div>
                            <div>
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
                                            <a-textarea placeholder="" :autosize="{ minRows: 2, maxRows: 6 }" 
                                                v-decorator="[
                                                'formData.description',
                                                {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue:formData.description}
                                                ]"
                                            />
                                            
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            label="状态"
                                            :label-col="{ span: 5 }"
                                            :wrapper-col="{ span: 12 }"
                                            >
                                           <a-radio-group 
                                                v-decorator="[
                                                    'formData.state',
                                                    {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue:formData.state
                                                    }
                                                ]"
                                           >
                                                <a-radio :value="1">启用</a-radio>
                                                <a-radio :value="0">禁用</a-radio>
                                                
                                            </a-radio-group>
                                            
                                        </a-form-item>
                                    </a-col>

                                    <a-col :span="12">
                                        <a-form-item
                                            label="月份or季度"
                                            :label-col="{ span: 5 }"
                                            :wrapper-col="{ span: 12 }"
                                            >
                                           <a-radio-group 
                                                v-decorator="[
                                                    'formData.quarterOrMonth',
                                                    {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue:formData.quarterOrMonth 
                                                    }
                                                ]"
                                           >
                                                <a-radio :value="0">月份</a-radio>
                                                <a-radio :value="1">季度</a-radio>
                                                
                                            </a-radio-group>
                                            
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </div>
                        </div>

                        <div>
                            <span class="style"></span>
                            <span>使用险种设置</span>
                            <div style="padding:16px">
                                <a-form-item
                                    label=""
                                >
                                    <a-checkbox-group
                                        v-decorator="['formData.containsRisk', {
                                            rules: [{ required: true, message: '请选择险种' }],
                                            initialValue:initcontainsRisk}]"
                                        style="width: 100%;"
                                    >
                                        <a-row>

                                            <a-col :span="6" :key="index" v-for="(item,index) in formData.containsRisk">
                                                <a-checkbox :value="item.asCode">{{item.asValue}}</a-checkbox>
                                            </a-col>
                                            
                                        </a-row>
                                    </a-checkbox-group>
                                </a-form-item>
                            </div>
                        </div>

                        <div>
                            <span class="style"></span>
                            <span>调剂金列表展示项设置</span>
                            <div>
                                <a-form-item
                                    label="是否允许上传附件"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                                    >
                                    <a-radio-group v-decorator="[
                                        'formData.isEnableUpload',
                                        {initialValue: 'true'}
                                    ]">
                                        <a-radio value="true">
                                        是
                                        </a-radio>
                                        <a-radio value="false">
                                       否
                                        </a-radio>
                                    </a-radio-group>
                                </a-form-item>
                            </div>
                        </div>

                        <div>
                            <span class="style"></span>
                            <span >展示项设置</span>
                            <!-- 配置table区域 -->
                            <a-table ref="adjustGoldconfigwrap" style="margin-top:8px" align="'center'"  bordered :dataSource="dataSource" :columns="columns" :pagination="false" :scroll="{ x: 1600 }">
                                <!-- 数据项 -->
                                <template slot="dataItem" slot-scope="text, record">
                                    <div class="rowIdbc" v-if="record.rowId =='ZD1' || record.rowId =='ZD2'">{{record.dataItem}}</div>
                                    <div v-else class="inputstyle">
                                        <a-input  v-model="record.dataItem"></a-input>
                                    </div>
                                </template>
                                <!-- 录入方式 -->
                                <template slot="dataIntoWay" slot-scope="text, record">
                                    <div class="rowIdbc" v-if="record.rowId =='ZD1' || record.rowId =='ZD2'">
                                        <a-select defaultValue="04" disabled  class="inputstyle" >
                                            <a-select-option value="04">制单固定参数</a-select-option>
                                        </a-select>
                                    </div>
                                    <a-select v-else  v-model="record.dataIntoWay"  class="inputstyle" @change="onCellChange(record, 'dataIntoWay',record.dataIntoWay)">
                                        <a-select-option value="01">手工录入</a-select-option>
                                        <a-select-option value="02">接口读取</a-select-option>
                                        <a-select-option value="03">运算项</a-select-option>
                                    </a-select>
                                </template>
                                <!-- 读取系统 -->
                                <template slot="dockingSys" slot-scope="text, record">
                                    <div class="rowIdbc" v-if="record.rowId =='ZD1' || record.rowId =='ZD2'"></div>
                                    <div class="rowIdbc01" v-else-if="record.dataIntoWay =='01'"></div>
                                    <div  v-else-if="record.dataIntoWay =='03'"></div>

                                    <a-select v-else  v-model="record.dockingSys" class="inputstyle" @change="onCellChange(record, 'dockingSys',record.dockingSys)">
                                        <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in tableData.dockingSysdata">{{item.sysName}}</a-select-option>
                                    </a-select>
                                </template>
                                <!-- 接口选择 -->
                                <template slot="dockingInterface" slot-scope="text, record">
                                    <div class="rowIdbc" v-if="record.rowId =='ZD1' || record.rowId =='ZD2'"></div>
                                    <div class="rowIdbc01" v-else-if="record.dataIntoWay =='01'"></div>
                                    <div  v-else-if="record.dataIntoWay =='03'"></div>
                                    <a-select v-else ref="test" v-model="record.dockingInterface" class="inputstyle" @change="onCellChange(record, 'dockingInterface',record.dockingInterface)">
                                        <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="item in record.dockingInterfacedata">{{item.interfaceName}}</a-select-option>
                                    </a-select>
                                </template>
                                <!-- 字段选择 -->
                                <template slot="interfaceField" slot-scope="text, record">
                                    <div class="rowIdbc" v-if="record.rowId =='ZD1' || record.rowId =='ZD2'"></div>
                                    <div class="rowIdbc01" v-else-if="record.dataIntoWay =='01'"></div>
                                    <div  v-else-if="record.dataIntoWay =='03'"></div>
                                    <a-select v-else   v-model="record.interfaceField" class="inputstyle" @change="onCellChange(record, 'interfaceField',record.interfaceField)">
                                        <a-select-option :key="item.id" :value="item.id+'-'+item.lastModifiedVersion" v-for="(item) in record.interfaceFielddata">{{item.fieldName}}</a-select-option>
                                    </a-select>
                                </template>
                                <!-- 参数配置params -->
                                 <template slot="params" slot-scope="text, record">
                                    <div class="rowIdbc" v-if="record.rowId =='ZD1' || record.rowId =='ZD2'"></div>
                                    <div class="rowIdbc01" v-else-if="record.dataIntoWay =='01'"></div>
                                    <div  v-else-if="record.dataIntoWay =='03'"></div>
                                    <a v-else  href="javascript:;" @click="onParams(record)" >{{record.paramsShowdata}}</a>
                                </template>
                                <!-- 是否展示 -->
                                <template slot="isShow" slot-scope="text, record">
                                    <a-radio-group   v-model="record.isShow" class="inputstyle" @change="onCellChange(record, 'isNewline',record.isNewline)">
                                        <a-radio :value="item.value" :key='index' v-for="(item,index) in flagData">{{item.name}}</a-radio>
                                    </a-radio-group>
                                </template>
                                <!-- 是否换行 -->
                                <template slot="isNewline" slot-scope="text, record">
                                    
                                    <a-radio-group   v-model="record.isNewline" class="inputstyle" @change="onCellChange(record, 'isNewline',record.isNewline)">
                                        <a-radio :value="item.value" :key='index' v-for="(item,index) in flagData">{{item.name}}</a-radio>
                                    </a-radio-group>
                                </template>
                                <!-- 运算项 -->
                                <template slot="rowId" slot-scope="text, record">
                                    <div style="text-align:center;" class="inputstyle" v-if="record.dataIntoWay =='03'">
                                        <a-input  v-model="record.rowId"></a-input>
                                    </div>
                                    <div style="text-align:center;" v-else>{{record.rowId}}</div>
                                </template>

                                <!-- 操作区域 -->
                                <template slot="operation" slot-scope="text, record,index">
                                    <div style="padding-left:8px">
                                        <a style="margin-right:4px" v-if="index!=0" href="javascript:;" @click='upData(record,index)'>上移</a>
                                        <a style="margin-right:4px" v-if="index!=dataSource.length-1" href="javascript:;" @click='downData(record,index)'>下移</a>
                                        <a style="margin-right:4px" v-if="record.dataIntoWay=='02'"  href="javascript:;" @click="testMethod(record)">测试</a>
                                        <a-popconfirm
                                            v-if="!(record.rowId =='ZD1' || record.rowId =='ZD2') "
                                            title="确定删除吗?"
                                            @confirm="() => onDelete(record.id,index)">
                                            <a href="javascript:;">删除</a>
                                        </a-popconfirm>
                                    </div>
                                </template>
                            </a-table>
                            <div style="margin-top:6px;"> 
                                <a-button class="butwidth" @click="handleAdd">+</a-button>
                                
                                
                            </div>
                        </div>
                    </a-form>
                </div>
                <!-- 注释区域 -->
                <div style="font-weight:600;">注：</div>
                <div style="padding:0 0 0 16px;line-height:26px">
                    <div>\QJX：前X（说明：该转义符数据项为变值，用于获得前几季度。例：当前季度为四，得到值为前三）</div>
                    <div>\DX：X（说明：该转义符数据项为变值，用于获得当前季度。例：当前季度为四，得到值为四）</div>
                    <div>\QX：X（说明：该转义符数据项为变值，用于获得前一季度。例：当前季度为四，得到值为三）</div>
                </div>
        </div>
        <!-- 参数配置弹框 -->
        <a-modal
            title="参数配置"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel">
            <a-table  align="'center'"  bordered :dataSource="paramsdataSource" :columns="paramscolumns" :pagination="false">
                <template slot="name" slot-scope="text, record">
                    <div class="rowIdbc" v-if="record.isInput ==false">{{record.name}}</div>
                    <div v-else class="inputstyle">
                        <span>{{record.name}}</span>
                    </div>
                </template>
                <!-- 录入方式 -->
                <template slot="value" slot-scope="text, record">
                    <div class="rowIdbc" v-if="record.isInput ==false">{{record.value}}</div>
                    <a-input v-else  v-model="record.value"  class="inputstyle" ></a-input>
                </template>
            </a-table>
        </a-modal>
         <!-- 测试弹框 -->
        <a-modal
            title="测试"
            :visible="testvisible"
            @ok="testhandleOk"
            @cancel="testhandleCancel">
            <a-table  align="'center'"  bordered :dataSource="paramsTestdataSource" :columns="paramsTestcolumns" :pagination="false">
                <template slot="name" slot-scope="text, record">
                    <div>{{record.name}}</div>
                </template>
                <!-- 录入方式 -->
                <template slot="value" slot-scope="text, record">
                    <a-input v-model="record.value" ></a-input>
                </template>
            </a-table>
        </a-modal>
        <!-- 单据预览 -->
        <a-modal
            title="单据预览"
            :visible="seevisible"
            width='800'
            @cancel="seehandleCancel"
            :footer="null"
           >
           <div  class="adjustFundItemswrap">
            <div class="line"></div>
            <a-row>
              <div :key="index" v-for="(item,index) in seeshowData">
                <div v-if="item.isNewline==true && item.isShow==true">
                    <a-col :span="item.keySpace">
                      <div class="dataItemstyle">{{item.dataItem}}</div>
                    </a-col>
                    <a-col :span="item.valueSpace">
                      <div class="dataValuestyle">
                        <span style="width:100%" v-if="item.dataIntoWay=='01'">
                          <a-input :key="index"   v-model="item.dataValue"></a-input>
                        </span>
                        <span style="width:100%"  v-else-if="item.rowId=='ZD2'">
                          <a-input :key="index"  v-model="item.dataValue"></a-input>
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
                          <a-input :key="index" v-model="item.dataValue"></a-input>
                        </span>
                        <span style="width:100%" v-else-if="item.rowId=='ZD2'">
                          <a-input  :key="index"  v-model="item.dataValue"></a-input>
                        </span>
                        <span v-else>{{item.dataValue}}</span>
                    </div>
                  </a-col>
                </div>
              </div>
            </a-row>

          </div>
        </a-modal>
    </div>
</template>

<script>
import { ajaxData } from '../../components/mixins/ajaxdata.js';
import { parse } from 'path';

export default {
  name: 'adjustGoldconfigDetails',
  components: {},
  data () {
    return {
        form: this.$form.createForm(this),
        tempData: [],
        flagData:[{
            name:'是',
            value:true
        },{
            name:'否',
            value:false
        }],
        visible: false,//参数弹框显示隐藏
        seevisible:false,//单据预览
        testvisible:false,//测试
        testfieldId:'',//测试字段
        testinterfaceId:'',//测试接口
        seeshowData:[],//单据预览数据
        paramsdataSource:[],//参数table数据
        paramscolumns:[
             {
                title: '参数项',
                dataIndex: 'name',
                scopedSlots: { customRender: 'name' },
            }, {
                title: '值',
                dataIndex: 'value',
                scopedSlots: { customRender: 'value' },
            }
        ],
        paramsTestdataSource:[],//测试数据
        paramsTestcolumns:[//测试字段
             {
                title: '参数项',
                dataIndex: 'name',
                scopedSlots: { customRender: 'name' },
            }, {
                title: '值',
                dataIndex: 'value',
                scopedSlots: { customRender: 'value' },
            }
        ],
        //参数table 表头
        count: 3,//计算运算项
        formData:{//表单区域涉及的数据
            planName:null,
            description:null,
            containsRisk:[],
            state:1,
            quarterOrMonth:0,
            isEnableUpload:true,
            lastModifiedVersion:null

        },
        submitData:{},//提交数据
        columns: [{
            title: '数据项',
            dataIndex: 'dataItem',
            fixed:"left",
            width:"200px",
            scopedSlots: { customRender: 'dataItem' },
        }, {
            title: '录入方式',
            dataIndex: 'dataIntoWay',
             width:"200px",
            scopedSlots: { customRender: 'dataIntoWay' },
        }, {
            title: '读取系统',
            dataIndex: 'dockingSys',
            scopedSlots: { customRender: 'dockingSys' },
        }, {
            title: '接口选择',
            dataIndex: 'dockingInterface',
            scopedSlots: { customRender: 'dockingInterface' },
        }, {
            title: '字段选择',
            dataIndex: 'interfaceField',
            scopedSlots: { customRender: 'interfaceField' },
        }, {
            title: '参数配置',
            dataIndex: 'params',
            width:'150px',
            scopedSlots: { customRender: 'params' },
        },{
            title: '是否展示',
            dataIndex: 'isShow',
            scopedSlots: { customRender: 'isShow' },
        },{
            title: '是否换行',
            dataIndex: 'isNewline',
            scopedSlots: { customRender: 'isNewline' },
        },{
            title: '运算项',
            dataIndex: 'rowId',
            width:'150px',
            scopedSlots: { customRender: 'rowId' },
        },{
            title: '操作',
            dataIndex: 'operation',
            fixed:"right",
            width:"200px",
            scopedSlots: { customRender: 'operation' },
        }],
        dataSource: [{//table 初始数据涉及的字段
            dataItem:'经办机构',
            dataIntoWay:'04',
            rowId:"ZD1",
            isShow:true,
            isNewline:false

        },{
            dataItem:'申请调剂金金额',
            dataIntoWay:'04',
            rowId:"ZD2",
            isShow:true,
            isNewline:false
        }],
        tableData:{//table 参数的一些数据
            dockingSysdata:[],//系统需要的数据
            dockingInterfacedata:[],//接口需要的数据
            interfaceFielddata:[],//字段需要的数据
            paramsdata:[],//参数需要的数据
        },
        resData:'',
        rowId:'',//弹框所需要的点击的是第几个rowId
        // 修改所需要数据处理
        initcontainsRisk:[],
        planId:null,//方案id

    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  created(){
      var data=this.$route.query
      this.containsRiskrequest()//险种请求数据
      if(Object.keys(data)==0){
          console.log('0')
          this.dockingSysrequest()//系统数据请求
      }else{
            console.log(data.id)
            var id=data.id;
            this.dockingSysrequest(id)//系统数据请求
            
      }

      

  },
  methods: {
    onSeeing(){//单据预览
        this.seevisible=true;
        var data=this.dataSource;
        var showData=[];
		for (var i=0;i<data.length;i++) {
			if(data[i].isShow !=false){
				showData.push(data[i])
			}
		}
		if (showData.length !=0){
		    var totalSpace = 24; //前端表格一行占位数，所有key值均占位为4
		    for (var i=0;i<showData.length;i++) {
		        var m = 4;
	            if (showData[i].isNewline){
	                showData[i].keySpace=m;
	                totalSpace -= m;
	                showData[i].valueSpace=totalSpace;
	                totalSpace = 24; //出现换行时totalSpace恢复初始化
	            } else {
	                showData[i].keySpace=m
	                showData[i].valueSpace=m
	                totalSpace -= m*2;
	            }
		    }
        }
        this.seeshowData=showData;
        console.log(this.seeshowData)
        
    },
    seehandleCancel(){
        this.seevisible=false;
    },
    modifyData(id){
        var params= {}
        var _url=this.service_sms+'/api/plan/'+id+'?fetchProperties=*,planItems[*,dockingSys[id,lastModifiedVersion],dockingInterface[id,lastModifiedVersion],interfaceField[id,lastModifiedVersion],params[*]]';
        ajaxData("get",_url,params, (res) => {
            // 从新获取列表
            console.log(res.data)
            let _data= JSON.parse(JSON.stringify(res.data))
            // 表单区域所涉及的修改数据
            this.planId=id;
            this.initcontainsRisk=_data.containsRisk.split(',')//险种默认值
            this.formData.planName=_data.planName
            this.formData.description=_data.description
            this.formData.state=_data.state
            this.formData.quarterOrMonth=_data.quarterOrMonth
            this.formData.isEnableUpload=_data.isEnableUpload
            this.formData.lastModifiedVersion=_data.lastModifiedVersion
            // table 区域所涉及的数据
            // 处理系统 /接口/字段数据
            var planItemsData=_data.planItems;
            var sysData=_data.planItems;
            for(var d=0;d<planItemsData.length;d++){
                if(planItemsData[d].dockingSys){
                        planItemsData[d].dockingSys=planItemsData[d].dockingSys.id+'-'+planItemsData[d].dockingSys.lastModifiedVersion;
                }
                if(planItemsData[d].dockingInterface){
                    planItemsData[d].dockingInterface=planItemsData[d].dockingInterface.id+'-'+planItemsData[d].dockingInterface.lastModifiedVersion;
                }
                if(planItemsData[d].interfaceField){
                    planItemsData[d].interfaceField=planItemsData[d].interfaceField.id+'-'+planItemsData[d].interfaceField.lastModifiedVersion;
                }
            }
            this.dataSource=planItemsData;

            for(var c=0;c<sysData.length;c++){//接口数据的处理
                if(sysData[c].dockingSys){
                    var value=sysData[c].dockingSys;
                    var _index=value.split("-")[0];//取出一行的系统id

                    var len=this.tableData.dockingSysdata
                    for(var i=0;i<len.length;i++){
                        if(len[i].id==_index){
                            var plen=this.dataSource;
                            for(var j=0;j<plen.length;j++){
                                if(plen[j].rowId==sysData[c].rowId){
                                    this.$set(plen[j], 'dockingInterfacedata',len[i].interfaces)
                                }
                            } 
                        }
                    }
                }
            }
            //字段的数据处理方法；
             for(var z=0;z<sysData.length;z++){
                 if(sysData[z].dockingInterface){
                    var value=sysData[z].dockingInterface;
                    var _index=value.split("-")[0];//取出一行的接口id
                    var len=this.dataSource[z].dockingInterfacedata;//取出改行接口数据 
                    for(var i=0;i<len.length;i++){
                        if(len[i].id==_index){
                            var plen=this.dataSource;
                            for(var j=0;j<plen.length;j++){
                                if(plen[j].rowId==sysData[z].rowId){
                                    this.$set(plen[j], 'interfaceFielddata',len[i].fields)
                                }
                            }

                        }
                    }
                 }
             }

            for(var z=0;z<sysData.length;z++){
               
                 if(sysData[z].dockingInterface){
                    var value=sysData[z].dockingInterface;
                    var _index=value.split("-")[0];//取出一行的接口id
                    var lenD=this.dataSource[z].dockingInterfacedata;// 参数数据
                    for(var y=0;y<lenD.length;y++){
                        if(lenD[y].id==_index){
                            var plen=this.dataSource;
                            for(var j=0;j<plen.length;j++){
                                if(plen[j].rowId==sysData[z].rowId){
                                    this.$set(plen[j], 'paramsdata',lenD[y].params)

                                     var showdata=[];
                                     var lenshow=lenD[y].params
                                    for(var b=0;b<lenshow.length;b++){
                                        var l=lenshow[b].code;
                                        var json = {};
                                        json[l]=lenshow[b].value;
                                        showdata.push(json)
                                    }
                                    this.$set(plen[j], 'paramsShowdata',showdata)
                                    
                                }
                            }
                        }
                    }
                 }
            }
            
           
            console.log(this.dataSource)
            
        })
    },
    containsRiskrequest(){//险种请求
      var params= {}
      var _url=this.service_sms+'/api/asVal?valType.typeCode=riskCode&fetchProperties=id,asCode,asValue';
      ajaxData("get",_url,params, (res) => {
        // 从新获取列表
        // console.log(res)
        this.formData.containsRisk=res.data;
      })
    },
    dockingSysrequest(id){//系统数据请求
        var params= {}
      var _url=this.service_sms+'/api/dockingSys?fetchProperties=*,interfaces[*,fields[*],params[*]]';
      ajaxData("get",_url,params, (res) => {
        // 从新获取列表
        // console.log(res)
        if(id){
            this.tableData.dockingSysdata=res.data;
            this.modifyData(id)
        }else {
            this.tableData.dockingSysdata=res.data;
        }
        
      })
    },
    handleSubmit (e,_data) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
            var subdata=values;
            subdata.formData.containsRisk=subdata.formData.containsRisk.join(",")
            subdata.formData.planItems=_data;
            subdata.formData.businessType="TJJ";
            subdata.formData.lastModifiedVersion=this.formData.lastModifiedVersion;
            console.log('Received values of form: ', subdata);

            var params= subdata.formData;
                params.id=this.planId;
            var _url=this.service_sms+'/api/plan';
            ajaxData("post",_url,params, (res) => {
                // 页面保存
                console.log(res)
                if(res.status==200){
                   this.$message.success('保存成功')
                   this.$router.push({//跳转列表页
                        path: "/projectconfigMgt/adjustGoldconfigMgt"
                    });
                }else {
                     this.$message.error('保存失败');
                }
            })
          
        }
      });
    },
    swapItems(arr, index1, index2){//处理数据
    　　arr[index1] = arr.splice(index2,1,arr[index1])[0]
    　　return arr
    },
    upData (arr, index) {//向上排序
    　　if (this.dataSource.length > 1 && index !== 0) {
    　　　　this.dataSource = this.swapItems(this.dataSource, index, index - 1)
    　　}
    },
    downData (arr, index) {//向下排序
    　　if (this.dataSource.length > 1 && index !== (this.dataSource.length - 1)) {
    　　　　this.dataSource = this.swapItems(this.dataSource, index, index + 1)
    　　}
    },
    onDelete (id,index) {
      this.dataSource.splice(index,1)
    },
    resetValue(res,type){
        if(type=='dockingSys'){
            var l=this.dataSource;
            for(var i=0;i<l.length;i++){
                if(l[i].rowId==res.rowId){
                    l[i].dockingInterface='';
                    l[i].interfaceField='';
                    l[i].params='';
                }
            }
        }else if(type=='dockingInterface'){
           
            var l=this.dataSource;
            for(var i=0;i<l.length;i++){
                if(l[i].rowId==res.rowId){
                    l[i].interfaceField='';
                }
            }
        }

    },
    testMethod(res){
        console.log(res)
        if( this.testfieldId && this.testinterfaceId){
            this.paramsTestdataSource=res.paramsdata;
            this.testfieldId=res.interfaceField.split("-")[0];
            this.testinterfaceId=res.dockingInterface.split("-")[0];
            this.testvisible =true;
        }else {
            this.$message.warning("字段或参数不能为空哦！！！")
        }
        
    },
    testhandleOk() {//测试弹框确定
        // 发送请求
        // this.visible = false
        console.log(this.paramsTestdataSource)
        var data=this.paramsTestdataSource;
        var params=[]
        for(var i=0;i<data.length;i++){
            params.push({
                "code": data[i].code,
                "name": data[i].name,
                "value": data[i].value
            })
        }
        
        var _Data={
            
            paramEntities:params,
            fieldId:this.testfieldId,
            interfaceId:this.testinterfaceId
           
        }
        console.log(_Data)
        var _url=this.service_sms+'/api/adjustFund/connectivityTest';
        ajaxData("post",_url,_Data, (res) => {
            if(res.data.code==0){
                this.$message.success(res.data.msg)
            }
        })
    },
    testhandleCancel(e) {//测试弹框取消
      this.testvisible = false
    },
    
    handleOk() {//参数弹框确定
        var res={
            rowId:this.rowId,
            paramsdata:this.paramsdataSource
        }
        this.publicmethods(res);
        this.visible = false
    },
    handleCancel(e) {//参数弹框取消
      this.visible = false
    },
    onParams(res){
        this.rowId=res.rowId;//记录rowId 弹框做处理
       this.visible = true
       this.paramsdataSource=res.paramsdata;
    },
    publicmethods(res){
        console.log(res)
         //页面显示参数数据
        var lenshow=res.paramsdata
        var showdata=[];
        for(var z=0;z<lenshow.length;z++){
            var l=lenshow[z].code;
            var json = {};
            json[l]=lenshow[z].value;
            showdata.push(json)
        }

        //赋值显示的数据

        //赋值提交的真实数据
        var submitinit=res.paramsdata
        var submitdata=[];
        for(var s=0;s<submitinit.length;s++){
            submitdata.push({
                "name": submitinit[s].name,
                "value": submitinit[s].value,
                "code":submitinit[s].code
            })
        }
        var p=this.dataSource;
        for(var m=0;m<p.length;m++){
            if(p[m].rowId==res.rowId){
                p[m].params=submitdata;//提交真实数据
                if(showdata.length==0){
                    p[m].paramsShowdata=''
                }else {
                    p[m].paramsShowdata=showdata;//显示数据
                }
            }
        }
    },
    printRecord(rec){
        console.log('test',rec, rec.dockingInterfacedata);
        return rec;
    },
    onCellChange (res,dataIndex,value) {  
      
       if(dataIndex=='dockingSys'){//通过系统数据查找接口数据/
        //值置空
            this.resetValue(res,'dockingSys')
        //数据置空
            this.tableData.dockingInterfacedata=[];
            this.tableData.interfaceFielddata=[];
            var _index=value.split("-")[0];
            var len=this.tableData.dockingSysdata
            for(var i=0;i<len.length;i++){
                if(len[i].id==_index){
                    var plen=this.dataSource;
                    for(var j=0;j<plen.length;j++){
                        if(plen[j].rowId==res.rowId){
                            this.$set(plen[j], 'dockingInterfacedata',len[i].interfaces)
                        }
                    } 
                }
            }
           
       }else if(dataIndex=='dockingInterface'){//通过接口获取字段及参数的数据
            // 字段数据
            // console.log(res)
            this.resetValue(res,'dockingInterface')
            var _index=value.split("-")[0];
            var len=res.dockingInterfacedata;
            for(var i=0;i<len.length;i++){
                if(len[i].id==_index){
                    // this.tableData.interfaceFielddata=len[i].fields;
                    var plen=this.dataSource;
                    for(var j=0;j<plen.length;j++){
                        if(plen[j].rowId==res.rowId){
                            // plen[j].interfaceFielddata=len[i].fields;
                            this.$set(plen[j], 'interfaceFielddata',len[i].fields)
                        }
                    }

                }
            }

            
            // 参数数据
            var lenD=res.dockingInterfacedata;
            console.log(lenD)
            for(var y=0;y<lenD.length;y++){
                if(lenD[y].id==_index){
                    var plen=this.dataSource;
                    for(var j=0;j<plen.length;j++){
                        if(plen[j].rowId==res.rowId){
                            this.$set(plen[j], 'paramsdata',lenD[y].params)
                        }
                    }
                }
            }
           this.publicmethods(res);


       }
       
    },
    handleAdd () {//添加行元素
      const { count, dataSource } = this
      const newData = {
        dataItem:null,
        dataIntoWay:null,
        dockingSys:null,
        dockingInterface:null,
        interfaceField:null,
        params:null,
        paramsShowdata:null,
        isShow:true,
        isNewline:false,
        rowId:'ZD'+count
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    },
    onSave(e){//保存
        let _data= JSON.parse(JSON.stringify(this.dataSource)) 
        for(var i=0;i<_data.length;i++){
            if(_data[i].dockingSys){//系统数据处理
                var array=_data[i].dockingSys.split("-");
                _data[i].dockingSys={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(_data[i].dockingInterface){//接口数据处理
                var array=_data[i].dockingInterface.split("-");
                _data[i].dockingInterface={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(_data[i].interfaceField){//接口数据处理
                var array=_data[i].interfaceField.split("-");
                _data[i].interfaceField={
                    "id":array[0],
                    "lastModifiedVersion":array[1]
                }
            }
            if(_data[i].paramsShowdata){//删除页面显示的参数
                delete _data[i].paramsShowdata;
            }
            if(_data[i].dockingInterfacedata){//删除接口数据
                delete _data[i].dockingInterfacedata;
            }
            if(_data[i].interfaceFielddata){//删除字段数据
                delete _data[i].interfaceFielddata;
            }
            if(_data[i].paramsdata){//删除参数数据
                delete _data[i].paramsdata;
            }
            

        }
        
        for(let i=0;i<_data.length;i++){
            _data[i].orderIndex=i;
        }
        console.log(_data);
        this.handleSubmit(e,_data);
    },
  }
}
</script>

<style lang="less" scoped>
.adjustGOldconfigDetails {
    
    .wrap {
        border: 1px solid #ddd;
        padding: 16px;
        .style {
            width: 3px;
            height: 12px;
            
            background: blue;
            display: inline-block

        }
    }
    .ant-table-tbody > tr > td {
        padding: 0px;
    }
}
.ant-form-item {
    margin-bottom: 0px;
}
.butwidth {
    width: 60px;
}
.rowIdbc {
    background: #D3D3D3;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
}
.rowIdbc01{
    background: #BEBEBE;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
}
.inputstyle {
    padding: 4px;
}
.adjustFundItemswrap {
    border-top: 1px solid #000;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
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
    border-left:1px solid #000;
    border-bottom:1px solid #000;
    background: #c0e2f3;
    padding: 4px;
    height: 46px;
    display: flex;
    align-items: center;        /* 垂直居中 */
    justify-content: center;    /* 水平居中 */
  }
  .dataValuestyle {
    border-left:1px solid #000;
    border-bottom:1px solid #000;
    padding: 4px;
    height: 46px;
    display: flex;
    align-items: center;        /* 垂直居中 */
    // justify-content: center;    /* 水平居中 */
  }
</style>
