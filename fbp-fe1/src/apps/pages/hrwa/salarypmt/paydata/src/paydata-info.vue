<template>
  <ifbp-page>

    <ifbp-breadcrumb :name="classname"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary"  @click="caculate" :disabled="caculateDisabled" v-if="showCaculate">计算</el-button>
      <el-button type="primary" :disabled="retotalDisabled" @click="retotal"  v-if="showRetotal">汇总</el-button>
      <el-button type="primary"  :disabled="checkDisabled" @click="check"  v-if="showCheck">审核</el-button>
      <el-button type="primary" :disabled="payDisabled" @click="pay" v-if="showPay">发放</el-button>
      <el-button type="primary" :disabled="transferMonthEndDisabled"  @click="monthEnd" v-if="showTransferMonthEnd">结账</el-button>

        <el-dropdown @command="handleCommand" menu-align="start" style="margin-left:10px;position: relative;top:3px">
          <el-button >
            <span style="position: relative;bottom: 3px;left: 6px;">更多</span><i class="el-icon-caret-bottom el-icon--right" style="margin-left: 6px;"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="importData" :disabled="importDataDisabled">导入</el-dropdown-item>
            <el-dropdown-item command="exportData"  :disabled="exportDataDisabled">导出</el-dropdown-item>
            <el-dropdown-item command="uncheck"  :disabled="uncheckDisabled">取消审核</el-dropdown-item>
            <el-dropdown-item command="unpay"  :disabled="unpayDisabled">取消发放</el-dropdown-item>
            <el-dropdown-item command="unMonthEnd"  :disabled="unTransferMonthEndDisabled">取消结账</el-dropdown-item>
            <el-dropdown-item command="batchEdit"  :disabled="batchEditDisabled">批量修改</el-dropdown-item>
            <el-dropdown-item command="adjust" :disabled="adjustDisabled">个别调整</el-dropdown-item>
            <el-dropdown-item command="ontime" :disabled="ontimeDisabled">时点薪资</el-dropdown-item>
            <el-dropdown-item command="detailCompare"  :disabled="detailCompareDisabled">明细对比</el-dropdown-item>
            <el-dropdown-item command="bankExport"  :disabled="unpayDisabled">银行报盘</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      <!-- 查询模板组件 -->
      <ifbp-search class="fr"
                   :template-code="tplCode"
                   @search="advancedSearch"
                   :search-on-select="true"
                   @select="periodSelect"
                   @ready="setQueryCondition"
                   ref="testSetOption">
      </ifbp-search>
    </ifbp-button-area>

    <div class="monthpaywrap">
      <el-row>
        <el-col :xs="5" :sm="5" :md="5" :lg="5">
          <div class="monthmgt clearfix">
            <div class="left">
            	<!--<img :src="dateImage"/>-->
            	<i class="ifbp-icon-date el-icon-date" style="color: #5AC8FA;font-size: 30px;"></i>
            </div>
            <div class="right">
              <div class="date">{{this.cyear}}/{{this.cperiod}}</div>
              <div class="datetittle">薪资期间</div>
            </div>
          </div>
        </el-col>

        <el-col :xs="5" :sm="5" :md="5" :lg="5">
          <div class="monthmgt clearfix">
            <div class="left">
            	<!--<img :src="cumImage"/>-->
            	<i class="ifbp-icon-calculator" style="color: #5AC8FA;font-size: 30px;"></i>
            </div>
            <div class="right">
              <div class="date">{{this.caculateCount}}/{{this.totalElements}}</div>
              <div class="datetittle">已计算</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="5" :sm="5" :md="5" :lg="5">
          <div class="monthmgt clearfix">
            <div class="left">
            	<!--<img :src="appImage"/>-->
            	<i class="ifbp-icon-approve" style="color: #5AC8FA;font-size: 30px;"></i>
            </div>
            <div class="right">
              <div class="date">{{this.checkCount}}/{{this.totalElements}}</div>
              <div class="datetittle">已审核</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="5" :sm="5" :md="5" :lg="5">
          <div class="monthmgt clearfix">
            <div class="left">
            	<!--<img :src="sendImg"/>-->
            	<i class="ifbp-icon-salary" style="color: #5AC8FA;font-size: 30px;"></i>
            </div>
            <div class="right">
              <div class="date">{{this.principlePay}}</div>
              <div class="datetittle">应发合计(元)</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4">
          <div class="monthmgt clearfix">
            <div class="left">
            	<!--<img :src="faImg"/>-->
            	<i class="ifbp-icon-grant" style="color: #5AC8FA;font-size: 30px;"></i>
            </div>
            <div class="right">
              <div class="date">{{this.actualPay}}</div>
              <div class="datetittle">实发合计(元)</div>
            </div>
          </div>
        </el-col>

      </el-row>
    </div>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- UI模板组件 :pk-temp="tablePk"   show-type="table-form"-->
      <ifbp-template ref="ref_paydata"
                     tpl-id="paydatainfo"

                     :tpl-data="tableData"

                     :auto-create="false"
                     :tplResetFun="tableResetFun"
                     :editable="isEdit"
                     @form-confirm-click="confirm"
                     @form-edit-click = "edit"
                     @form-cancel-click="cancel"
                     :edit-button-show="editShow"
                     @row-click="rowClick"
                     :local-storage-id="pk_wa_class">
                     <!--@edit-table-click="tableEditClick">-->
      </ifbp-template>

      <el-dialog
              title="提示"
              :visible.sync="hitVisible"
              size="small">
        <span>hitMsg</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hitVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
      <batch_edit ref="batchEditDlg"  :editableItem="editableItem" @okAction = "batchEditConfirm"></batch_edit>
      <!--分页组件-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalElements">
      </el-pagination>
    </ifbp-main-area>

    <el-dialog :close-on-click-modal="false"
               title="选择报盘项目" :show-close="false"
               v-model="selItemDialogVisible" size="small">
      <div slot="title">
        <div style="float:left;line-height:64px;" class="el-dialog__title">选择报盘项目</div>
        <el-form :model="refBankValue" :rules="bankRules" ref="bankTypeForm" label-width="95px" style="float:right;top:16px;">
          <el-form-item label="报送银行：" prop="bankType">
            <el-ref
            ref-code="banktyperef"
            field="bankType"
            :template-value="refBankValue"
            width="300px"
            placeholder="请选择">
            </el-ref>
          </el-form-item>
        </el-form>
      </div>
      <ifbp-template ref="ref_bankio_selitem"
                     class="uitemplate-no-top"
                     tpl-id="hrwa_bankio_selitem"
                     :table-show-menu="false">
      </ifbp-template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="selItemDialogVisible=false;">取消</el-button>
        <el-button @click="preDownLoad" type="primary">导出</el-button>
      </span>
    </el-dialog>
  </ifbp-page>
</template>
<script>


    import batch_edit from './batch-edit-dlg.vue';

    import sendImg from "../img/send.png";
    import faImg from "../img/fa.png";
    import dateImage from "../img/date.png";
    import cumImage from "../img/cum.png";
    import appImage from "../img/app.png";
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

    export default {
        mixins :[pageModelMixin],
        components:{batch_edit},
        data() {

            var that = this;
            var pk_org= this.$route.query.pk_org ;
            var pk_wa_class= this.$route.query.pk_wa_class  ;
            var cyear= this.$route.query.cyear  ;
            var cperiod = this.$route.query.cperiod  ;
            var classname = this.$route.query.classname  ;
            return {
                bankRules: {
                    bankType: [
                        {required: true, message: '请选择报送银行', trigger: 'blur'},
                    ],
                },
                refBankValue: {
                    bankType:'',
                    beanMap: {
                        bankType_ref:{},
                    },
                },
                //银行报盘项目
                selItemDialogVisible: false,
                // UI模板传入参数
                tablePk: "0001AA10000000006GA8",
                tableData:  {
                    paydata_c:{
                        f_1:''
                    }

                },
                columnsData:[],
                tableResetFun: function($node) {
                    var $table = this.getNodeById($node, "paydata_l");
                    var colHTML = "";
                    for(var i=0;i<that.columnsData.length;i++){
                        var col = that.columnsData[i];

                        colHTML+='<el-table-column render-type="'+col.renderType+'" align="left" header-align="left" prop="'+col.column+'" label="'
                            +col.label+'" width="150" format="'+col.format+'"   v-if="tableCoulmnVIf'+col.column+'"';


                        if(col.dataType == "number"){
                            colHTML+=' separator="," decimals="'+col.decimals+'" '
                        }
                        colHTML+= '></el-table-column>'
                    }
                    $table.append(colHTML);

                    var $form = this.getNodeById($node, "opxq7lmyhbf");
                    var columnHtml = '';
                    for(var i=0;i<that.columnsData.length;i++){
                        var aColumn = that.columnsData[i];
                        aColumn.model =  "paydata."+aColumn.column;;
                        columnHtml = columnHtml + '<el-form-item label="' + aColumn.label + '" class="" prop="' + aColumn.prop + '">' ;


                        var disabled = aColumn.disabled;
                        if(aColumn.dataType == "input"){
                            columnHtml = columnHtml +  '<el-input  :editable="editable" ';

                            if(disabled){
                                columnHtml = columnHtml + ' disabled="'+aColumn.disabled+'" ';
                            }
                            columnHtml = columnHtml +  ' v-model="' + aColumn.model + '"></el-input>' ;

                        }else if(aColumn.dataType == "date"){

                            columnHtml = columnHtml + '<el-date-picker  :editable="editable"  type="date"';

                            if(disabled){
                                columnHtml = columnHtml + ' disabled="'+aColumn.disabled+'" ';
                            }
                            columnHtml = columnHtml +'  v-model="'+aColumn.model+'"></el-date-picker>';

                        }else if(aColumn.dataType == "number"){
                            columnHtml = columnHtml + '<el-number  :editable="editable" separator="," decimals="'+aColumn.decimals+'" ';
                            if(disabled){
                                columnHtml = columnHtml + '  disabled="'+aColumn.disabled+'" ';
                            }
                            columnHtml = columnHtml +'v-model="'+aColumn.model+'"></el-number>';
                        }

                        columnHtml = columnHtml+'</el-form-item>';
                    }

                    $form.append(columnHtml);

                    return $node[0].outerHTML;
                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,

                pk_org : pk_org,
                pk_wa_class :pk_wa_class,
                cyear : cyear,
                cperiod :cperiod,

                hitVisible:false,
                editableItem :"",
                hitMsg:"",

                caculateDisabled : true,
                retotalDisabled : true,
                checkDisabled :true,
                uncheckDisabled : true,
                payDisabled : true,
                unpayDisabled : true,
                transferMonthEndDisabled :true,
                importDataDisabled : false,
                exportDataDisabled : false,
                batchEditDisabled : true,
                adjustDisabled : true,
                ontimeDisabled : true,
                detailCompareDisabled : true,
                unTransferMonthEndDisabled:true,

                showRetotal : false,
                showCheck : false,
                showUncheck : false,
                showPay : false,
                showUnpay : false,
                showTransferMonthEnd:false,
                showCaculate : false,


                caculateCount : '',
                checkCount :'',
                principlePay : '',
                actualPay:'',


                sendImg : sendImg,
                faImg:faImg,
                dateImage:dateImage,
                cumImage :cumImage,
                appImage:appImage,

                tplCode:'60130paydata',
                searchTemplate:{},


                isEdit:false,
                classname : classname,

                tableListData : [],//列表中数据
                baseData : '',//记录表单操作的数据，然后表格进行同步
                editShow : false,//卡片的编辑按钮是否显示
                waclassstate : '',
                periodCondition:''
            };
        },


        created() {
            var getColumDataDefer = this.getClassItemColumn();
            this.initPromise(getColumDataDefer);

        },
        methods: {
            initPromise(request) {
                Promise.all([request]).then(() => {
                    // this.$refs.cover.remove();
                    this.request();
                });
            },
            getClassItemColumn(){
                var that = this;
                return this.$http({
                    url: "/hrwa/payData/getUserShowClassItems",
                    method: "post",
                    data: {
                        pk_wa_class :this.pk_wa_class,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        pk_org : this.pk_org
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            var columnInfo = res.data.data.classitem;

                            this.columnsData = columnInfo;
                            if(this.columnsData && this.columnsData.length>0){
                                 for(var i = 0;i<this.columnsData.length;i++){
                                     var k = "tableCoulmnVIf"+this.columnsData[i].column;
                                     this.tableData[k] = true;
                                 }
                            }
                            this.$refs.ref_paydata.setData('columns', this.columnsData);
                            this.$refs.ref_paydata.init();

                            var strColumn =  "";
                            if(columnInfo){
                                for(var i=0;i<columnInfo.length;i++){
                                    strColumn = strColumn+JSON.stringify(columnInfo[i])+"||";
                                }
                            }
                            if(strColumn){
                                strColumn = strColumn.substring(0,strColumn.length-2);
                            }

                            sessionStorage.setItem('waDataDynamicColumn', strColumn);



                            var editableItem = res.data.data.editableitem;
                            this.editableItem =  JSON.stringify(editableItem) ;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "获取薪资项目对应的动态列失败",
                            type: "error"
                        });
                    });

            },
            confirm(){
                var data = this.$refs.ref_paydata.getData("paydata");

                var psnData = this.$refs.ref_paydata.getData("paydata");

                data.caculateflag = psnData.caculateflag;
                //这些信息一起传过去，在后台解析后使用
                data.pk_wa_class = this.pk_wa_class;
                data.cyear = this.cyear;
                data.cperiod = this.cperiod;
                data.pk_org = this.pk_org;


                this.$refs.ref_paydata.validate(valid => {
                    if (valid) {
                        this.$http({
                            url: "/hrwa/payData/save",
                            method: "post",
                            data: JSON.parse(JSON.stringify(data))
                        })
                            .then(res => {

                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });

                                    this.baseData = res.data.data;
                                    this.isEdit = false;
                                    this.tableDataSynchronieze(this.baseData);

                                    var currentDatas = this.$refs.ref_paydata.getTableData();
                                    this.actionEnableAndDataCount(currentDatas);
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: "更新失败",
                                    type: "error"
                                });
                            });
                    }
                });

            },
            edit(){
               var data =  this.$refs.ref_paydata.getFormData();
               if(data.checkflag == true){
                   this.$message({
                       message: "已经审核的数据不能编辑",
                       type: "error"
                   });
                  return ;
               }
               this.baseData = JSON.parse(JSON.stringify(data)) ;//转换下，避免指向同一个对象
                this.isEdit = true;
            },
            cancel(){

                if( this.isEdit ){
                    this.isEdit = false;
                    this.tableDataSynchronieze(this.baseData);
                }else{
                    this.$refs.ref_paydata.formShow = false;
                    this.$refs.ref_paydata.getTableComp().closeExpandRow();
                }
            },
            rowClick(row, event, column){
               let isChecked =  row.checkflag;
               if(isChecked && isChecked===true){
                   this.editShow = false;
               }else{
                   this.editShow = true;
               }

            },
            tableDataSynchronieze(data){
              for(var i=0;i<this.tableListData.length;i++){
                  var aListData = this.tableListData[i];
                  if(aListData.pk_wa_data == data.pk_wa_data){
                      this.tableListData[i] = data;
                      break;
                  }
              }
            },
            // 请求数据
            request(n, s) {

                var pn = 1;
                var ps =10 ;

                if(n){
                    pn = n;
                }
                if(s){
                    ps = s;
                }
                var url =
                    "/hrwa/payData/pageList";
                this.$http({
                    url: url,
                    method: "post",
                    params :{
                        pn : pn,
                        ps : ps,
                        pk_wa_class :this.pk_wa_class,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        pk_org : this.pk_org,
                       // state : this.state
                    },
                    data : this.searchTemplate
                })
                    .then((res) => {
                        if(res.data.status === true){
                            this.$nextTick(() => {
                                var resData = res.data.data.content;
                                if(this.$refs.ref_paydata) {
                                    this.tableListData = res.data.data.content;
                                    this.$refs.ref_paydata.setTableData(
                                        this.tableListData
                                    );
                                    this.actionEnableAndDataCount(this.tableListData);

                                    this.totalElements = res.data.data.totalElements;
                                    this.size = res.data.data.size;
                                    this.currentPage = res.data.data.number;
                                } else {
                                    console.log(2)
                                    this.$set(this.tableData, 'uitemplateTableData', resData);
                                }
                            });
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            actionEnableAndDataCount(data){
                this.$http({
                    url: "/hrwa/payData/actionDiasbledAndDataCount",
                    method: "post",
                    params:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                    },
                    data : {
                        searchTemplate :JSON.stringify(this.searchTemplate) ,
                        uivos : JSON.stringify(data),
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.waclassstate = res.data.data.waclassstate ;

                            this.caculateDisabled = res.data.data.caculateDisabled;
                            this.retotalDisabled =  res.data.data.retotalDisabled;
                            this.checkDisabled =  res.data.data.checkDisabled;
                            this.uncheckDisabled = res.data.data.uncheckDisabled;
                            this.payDisabled = res.data.data.payDisabled;
                            this.unpayDisabled = res.data.data.unpayDisabled;
                            this.detailCompareDisabled = res.data.data.detailCompareDisabled;
                            this.transferMonthEndDisabled = res.data.data.transferMonthEndDisabled;
                            this.unTransferMonthEndDisabled = res.data.data.unTransferMonthEndDisabled;
                            //暂时让“批量修改”“个别调整”“时点薪资”按钮状态：计算按钮可用或者审核按钮可用的时候偶这些按钮才能是可用的
                            this.batchEditDisabled = this.caculateDisabled&& this.checkDisabled ;
                            this.adjustDisabled = this.caculateDisabled&& this.checkDisabled;
                            this.ontimeDisabled =  this.caculateDisabled&& this.checkDisabled;

                            this.showRetotal = !this.retotalDisabled;
                            this.showCheck = !this.checkDisabled;
                            this.showUncheck  = !this.uncheckDisabled;
                            this.showPay = !this.payDisabled;
                            this.showUnpay = !this.unpayDisabled;
                            this.showTransferMonthEnd = !this.transferMonthEndDisabled;
                            this.showCaculate = !this.caculateDisabled;

                            this.principlePay = res.data.data.principlepay;
                            this.actualPay = res.data.data.actualpay;
                            this.caculateCount  = res.data.data.caculateCount;
                            this.checkCount = res.data.data.checkCount;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "查询按钮状态失败",
                            type: "error"
                        });
                    });
            },
            handleCommand(command) {

                if("adjust"==command) {

                    var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                    this.$router.push({path:"/hrwa/paydata/adjustinfo", query:queryParma}) ;
                }else if("ontime" == command){
                    var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                    this.$router.push({path:"/hrwa/paydata/ontimeinfo", query:queryParma}) ;

                }else if("detailCompare" == command){
                    var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                    this.$router.push({path:"/hrwa/paydata/detailcompare", query:queryParma}) ;


                }
                else if("uncheck" == command){
                    this.uncheck();
                }
                else if("unpay" == command){
                    this.unpay();
                }else if("unMonthEnd" == command){
                      this.unMonthEnd();
                }
                else if("batchEdit" == command){
                    this.$refs['batchEditDlg'].show();
                }
                else if("bankExport" == command){
                    this.showExportItemSelDialog();
                }else if("importData" == command){
                    var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                    this.$router.push({path:"/hrwa/dataio/import?funcode=60130dataitf", query:queryParma});
                }else if("exportData" == command){
                    var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                    this.$router.push({path:"/hrwa/dataio/export?funcode=60130dataitf", query:queryParma});
                }
            },
            unMonthEnd(){
                this.$http({
                    url: "/hrwa/payData/unMonthEnd",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        pk_org : this.pk_org,
                        waclassstate:this.waclassstate
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                            this.setQueryCondition();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "取消结账失败",
                            type: "error"
                        });
                    });
            },
            monthEnd(){
                this.$http({
                    url: "/hrwa/payData/monthEnd",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        pk_org : this.pk_org,
                        waclassstate:this.waclassstate

                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.setQueryCondition();
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "结账失败",
                            type: "error"
                        });
                    });
            },
            retotal(){
                this.$confirm('汇总将覆盖当前数据，是否继续？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    closeOnClickModal:false,

                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: "/hrwa/payData/retotal",
                        method: "post",
                        data:{
                            pk_wa_class : this.pk_wa_class,
                            pk_org : this.pk_org,
                            cyear : this.cyear,
                            cperiod : this.cperiod,
                            waclassstate:this.waclassstate
                        }
                    })
                        .then(res => {

                            if (res.data.status === true) {
                                this.$message({
                                    message: res.data.msg,
                                    type: "success"
                                });
                                this.request();
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        })
                        .catch(() => {
                            this.$message({
                                message: "汇总失败",
                                type: "error"
                            });
                        });
                }).catch(() => {
                    // 这里加取消逻辑
                });


            },
            pay(){
                this.$http({
                    url: "/hrwa/payData/pay",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        waclassstate:this.waclassstate
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "发放失败",
                            type: "error"
                        });
                    });
            },
            unpay(){
                this.$http({
                    url: "/hrwa/payData/unPay",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        waclassstate:this.waclassstate
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "取消发放失败",
                            type: "error"
                        });
                    });
            },
            uncheck(){
                this.$http({
                    url: "/hrwa/payData/unCheckValidate",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,

                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            if(res.data.msg == "fail"){//校验失败
                                this.hitMsg =  res.data.data;
                                this.hitVisible = true;
                            }else if(res.data.msg == "success"){
                                this.allUncheck();
                            }

                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "校验已被加入离职发薪人员失败",
                            type: "error"
                        });
                    });
            },
            allUncheck(){
                this.$http({
                    url: "/hrwa/payData/unCheck",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        waclassstate:this.waclassstate

                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "查询是否有未计算的数据失败",
                            type: "error"
                        });
                    });
            },
            check(){
                this.$http({
                    url: "/hrwa/payData/check",
                    method: "post",
                    params:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        waclassstate:this.waclassstate
                    },
                    data : this.searchTemplate
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "审核失败",
                            type: "error"
                        });
                    });
            },

            periodSelect(template,condition,option){
                if(condition.fieldcode == "period" && option){
                    this.cyear = option.value.substr(0,4);
                    this.cperiod = option.value.substring(4);
                }
                this.searchTemplate = template;
                this.request();
            },
            setQueryCondition(){

                let url ="/hrwa/payData/queryPeriod";
                this.$http({
                    url: url,
                    method: "post",
                    params :{
                        pk_wa_class :this.pk_wa_class,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        pk_org : this.pk_org
                    },
                }).then((res) => {
                    if(res.data.status === true){
                        this.periodCondition = res.data.data;
                        let param = {
                            'period' : {
                            }
                        };
                        if(this.periodCondition!=null && this.periodCondition.length>0){
                            for(var i=0;i<this.periodCondition.length;i++){
                                param.period[this.periodCondition[i]] = this.periodCondition[i].substr(0,4) + "/" + this.periodCondition[i].substring(4);
                            }
                        }
                        this.$refs.testSetOption.setOptionsByFieldcode(param);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }

                }).catch(() => {
                    this.$message({
                        message: "查询条件中期间信息获取失败",
                        type: "error"
                    });
                });

            },
            alertUncaculatePsn(){

                this.$confirm('本期间有员工的定调薪信息发生变化，请先核算时点发放金额，再进行薪资计算', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,

                    type: 'warning'
                }).then(() => {
                    let queryParam = {
                        pk_org:this.pk_org,
                        pk_wa_class:this.pk_wa_class,
                        cyear:this.cyear,
                        cperiod:this.cperiod
                    };
                    this.$router.push({path:"/hrwa/paydata/ontimeinfo",query:queryParam});
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            caculateAllData(){
                var selectedDatas = this.$refs.ref_paydata.getTableData();
                this.$http({
                    url: "/hrwa/payData/caculate",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        vos : JSON.stringify(selectedDatas),
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "查询是否有未计算的数据失败",
                            type: "error"
                        });
                    });
            },
            // 跳转到添加地点页面
            caculate() {
                this.$http({
                    url: "/hrwa/payData/isExistUnCaculatePsn",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            if(res.data.data === true){
                                this.alertUncaculatePsn();
                            }else{
                                //执行计算动作
                                this.caculateAllData();
                            }
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "查询是否有未计算的数据失败",
                            type: "error"
                        });
                    });
            },


            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.request();
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },
            batchEditConfirm(data){
                var dataObj = JSON.parse(data);
                var  selectedItemKey = dataObj.selectedItemKey;
                var formular = dataObj.formular;
                var replaceType = dataObj.replaceType;
                var selectedData = this.getOperateDatas();
                var uivos = JSON.stringify(this.getOperateDatas());

                this.$http({
                    url: "/hrwa/payData/replace",
                    method: "post",
                    data:{
                        pk_wa_class : this.pk_wa_class,
                        pk_org : this.pk_org,
                        cyear : this.cyear,
                        cperiod : this.cperiod,
                        replaceType : replaceType,
                        replacedItemKey : selectedItemKey,
                        formular : formular,
                        uivos : uivos,
                        queryConditon :  JSON.stringify(this.searchTemplate)
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.$refs['batchEditDlg'].hide();
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "批量修改失败",
                            type: "error"
                        });
                    });


            },
            getOperateDatas(){
                var tableSelections = this.$refs.ref_paydata.comp.$refs.ref_paydata.getSelection();
                var selectedDatas = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        selectedDatas.push(row);
                    }
                }
                if(selectedDatas.length == 0){
                    selectedDatas = this.$refs.ref_paydata.getTableData();
                }
                return selectedDatas;
            },


            showExportItemSelDialog(){
                this.$http({
                    url: "/hrwa/payData/bankio/showSelItems?pk_org=" +this.pk_org ,
                    method: "get",
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.selItemDialogVisible = true;
                            this.$nextTick(function() {
                                this.$refs.ref_bankio_selitem.setTableData(res.data.data);
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "查询导出项目时发生异常!",
                            type: "error"
                        });
                    });
            },

            bankExport(){
                let selItems = this.tableBankSelections[0].vcontent;
                for(var i = 1; i < this.tableBankSelections.length; i++){
                    selItems += "|" + this.tableBankSelections[i].vcontent;
                }
                this.selItemDialogVisible = false;
                let url = "/hrwa/payData/bankio/downloadExcel?pk_org=" + this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType + "&selitems=" + selItems + "&funcode=60130paydata";
                window.location.href = encodeURI(url);
            },

            preDownLoad(){
                this.$refs.bankTypeForm.validate((valid) => {
                    if (valid) {
                        this.preDownLoadReal();
                    }
                });
            },

            preDownLoadReal(){
                this.tableBankSelections = this.$refs.ref_bankio_selitem.comp.$refs.tableRef.getSelection();
                if (!this.tableBankSelections || this.tableBankSelections.length === 0) {
                    this.$message({
                        message: "请先选择报盘项目!",
                        type: 'warning'
                    });
                    return;
                }
                this.selItemDialogVisible = false;
                this.$http({
                    url: "/hrwa/payData/bankio/preDownload?pk_org=" +this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType,
                    method: "get",
                })
                    .then(res => {
                        if (res.data.status === true) {
                            var checkRtn = res.data.checkRtn;
                            if(checkRtn == 1){
                                this.$confirm('薪资发放项目未设置代发工资卡', '提示', {
                                    confirmButtonText: '前往设置',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.payItem(res.data.pk_org_name,res.data.pk_group_name, res.data.pk_group);
                                }).catch(() => {
                                });
                            }else if(checkRtn == 2){
                                this.$confirm('未找到发薪人员有效的银行账户信息，请在“个人银行账户”进行维护。', '提示', {
                                    confirmButtonText: '确定',
                                    showCancelButton:false,
                                    type: 'warning'
                                }).then(() => {

                                }).catch(() => {
                                });
                            }else if(checkRtn == 3){
                                this.$confirm(res.data.tips + '未找到有效的银行账户信息，是否继续导出？', '提示', {
                                    confirmButtonText: '继续导出',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.bankExport();
                                }).catch(() => {
                                });
                            }else{
                                this.bankExport();
                            }
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "发生异常!",
                            type: "error"
                        });
                    });
            },
            payItem(pk_org_name, pk_group_name, pk_group){
                let url = "/hrwa/payitem/info/" + this.pk_wa_class + "/" + pk_group + "/" + this.pk_org + "/" + this.cyear + "/" + this.cperiod + "/" + this.classname + "/" + pk_group_name + "/" + pk_org_name+"?funcode=60130payitem";
                this.$router.push(url);
            },
        }
    };
</script>
<style>
  .monthpaywrap {
    height: 80px;
    background: #fff;
    margin-top: 16px;
  }
  .monthmgt {
    height: 80px;
    margin-left: 40px;
  }
  .monthmgt .left {
    margin-top: 24px;
    float: left;
  }
  .monthmgt .left img {
    width: 30px;
    height: 30px;
  }
  .monthmgt .right {
    float: left;
  }
  .monthmgt .right .date {
    margin-top: 20px;
    margin-left: 16px;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    line-height: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .monthmgt .right .datetittle {
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    line-height: 12px;
    margin-left: 16px;
  }
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }
</style>
