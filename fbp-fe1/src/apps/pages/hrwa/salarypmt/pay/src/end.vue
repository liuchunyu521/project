
<template>
  <div>
      <ifbp-main-area type="list" class="maringTop0">
      	<!--btnisShow 状态是否获取成功来确定显示按钮区域-->
        <div class="ifbp-btn-line" v-if="btnisShow">
          <div class="fl">
            <span class="ifbp-layout-content-left-span">发薪人员({{totalElements}})</span>
          </div>
          <!--<div class="fr">
          	<el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="unMonthEnd" v-show="showUnTransferMonthEnd">取消结账</el-button>
            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="monthEnd" v-show="showTransferMonthEnd">结账</el-button>
            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="detailCompareEnd" :disabled="detailCompareDisabled">明细对比</el-button>
            <i class="ifbp-icon-setting marginleft16"  @click="showHeaderSettingcheck" title="设置"></i>
          </div>-->
          
          <!-- 组件 ifbpBtnLine  -->
          <ifbp-btn-line 
            :text-btn-arr="textBtnArr"
            :icon-btn-arr="iconBtnArr"
            :text-align="textAlign"
            :slot-width="0"
            style="margin-top:-16px;width: calc(100% - 200px);float: right;">
                <!--<div slot="search-dialog">-->
                    <!--<ifbp-search-dialog
							        ref="testSetOption"
							        :template-code="templateCode"
							        :dialog-title="dialogTitle"
							        @search="handleSearch">
                    </ifbp-search-dialog>-->
                <!--</div>--> 
          </ifbp-btn-line>
          
        </div>
    <!-- 主体区域 -->
      <!-- UI模板组件 :pk-temp="tablePk"   show-type="table-form"-->
      <ifbp-template ref="ref_paydatacheck"
                     tpl-id="paydatacheck"
                     :tpl-data="tableData"
					 :table-show-menu='false'
                     :auto-create="false"
                     :tplResetFun="tableResetFun"
                     :methods="tableMethods"
                     :editable="false"
                     @form-cancel-click="cancel"
                     :edit-button-show="false"
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
      	
      <!--分页组件-->
      <el-pagination
      				v-if="btnisShow"
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
  </div>
</template>
<script>
    
    import pageModelMixin from 'ifbp-business/pageModelMixin/index.js';
    import tableHeightMixin from "ifbp-business/tableHeightMixin/index.js";
	import batch_edit from './batch-edit-dlg.vue';
	import IfbpBtnLine from "ifbp-business/ifbpBtnLine";
    export default {
        mixins :[pageModelMixin,tableHeightMixin],
        props :['pk_org','pk_wa_class','cyear','cperiod'],
        components:{
            batch_edit,
            "ifbp-btn-line":IfbpBtnLine
        },
        data() {

            var that = this;
     
            return {
             		otherHeight:230,
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
                backExportDisabled:true,
                // UI模板传入参数
                tablePk: "0001AA10000000006GA8",
                tableData:  {
                    paydata_c:{
                        f_1:''
                    }

                },
                columnsData:[],
                sumdataall:[],
                tableMethods:{
                    getTopSummaries(param) {
                        const { columns, data } = param;
                        const sums = [];
                        
                        let sumdataall = that.sumdataall;
                        columns.forEach((column, index) => {
                            if (column.property=="psncode") {
                                sums[index] = '合计';
                                return;
                            }
                            
                            if(column.property &&  column.property.indexOf("f_")==0 && column.renderType=="number"){
                                sums[index] = sumdataall[0][column.property];
                            }
                            
                        });

                        return sums;
                    },
                },
                tableResetFun: function($node) {
                	
                		// 是否计算
                		var $style = this.getNodeById($node, "paydata_l");
						        var caculateflag_html = $style.find("[prop='caculateflag']");
						        caculateflag_html.html(
						          '<template scope="scope">' +
						          '<div v-if="scope.row.caculateflag && scope.row.caculateflag==true" style="color:#00A753">是</div>' +
						          '<div v-else>否</div>' +
						          '</template>'
						        );
				                // 是否审核
						        var checkflag_html = $style.find("[prop='checkflag']");
						        checkflag_html.html(
						          '<template scope="scope">' +
						          '<div v-if="scope.row.checkflag && scope.row.checkflag==true" style="color:#00A753">是</div>' +
						          '<div v-else>否</div>' +
						          '</template>'
						        );
                	
                    var $table = this.getNodeById($node, "paydata_l");
                    $table.attr(':height','tBodyHeight');
                    var colHTML = "";
                    for(var i=0;i<that.columnsData.length;i++){
                        var col = that.columnsData[i];

                        colHTML+='<el-table-column render-type="'+col.renderType+'" align="right" header-align="right" prop="'+col.column+'" label="'
                            +col.label+'" width="150" format="'+col.format+'"   v-if="tableCoulmnVIf'+col.column+'"';


                        if(col.dataType == "number"){
                            colHTML+=' separator="," decimals="'+col.decimals+'" '
                        }
                        colHTML+= '></el-table-column>'
                    }
                    $table.append(colHTML);
                    $table.attr(":top-summary-method", "getTopSummaries");
                    $table.attr(":show-top-summary", "true");
                    $table.attr(":disable-tooltip", "true");

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

                            columnHtml = columnHtml + '<el-date-picker  :editable="editable"  type="date" :valuetoms="true" ';

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


                hitVisible:false,
                editableItem :"",
                hitMsg:"",

                
                importDataDisabled : false,
                exportDataDisabled : false,
                detailCompareDisabled : true,//明细对比 true-禁止点击
                transferMonthEndDisabled :true,
                unTransferMonthEndDisabled:true,

                showTransferMonthEnd : false,
                showUnTransferMonthEnd : false, 
                
                            
                
                tplCode:'60130paydata',
                searchTemplate:{},
                tableListData : [],//列表中数据
                baseData : '',//记录表单操作的数据，然后表格进行同步
                waclassstate : '',
                periodCondition:'',
                //dialogVisible:true//批量
                checkupdate:false,//批量修改 true禁止
                checkadjustment:false,//个别调整 true禁止
                btnisShow:false, //操作按钮区域 例如计算 批量修改
                
                //如下为ifbpBtnLine 配置项;
		            textAlign:"right",
		            // 左侧 文字按钮区域;
		            textBtnArr: [{
		                title: "结账",
		                command: "",
		                fontNum:2,
		                fn: this.monthEnd,
		                visible:false
		            },{
		                title: "取消结账",
		                command: "",
		                fontNum:4,
		                fn: this.unMonthEnd,
		                visible:false
		            },{
		                title: "明细对比",
		                command: "",
		                fontNum:4,
		                fn: this.detailCompareEnd,
		                disabled:true
		            }],
		            // 右侧 图标按钮区域;
		            iconBtnArr: [{
		                title: "设置",
		                fn: this.showHeaderSettingcheck,
		                command: "setting",
		                iconfont: "ifbp-icon-setting"
		            }]
            };
        },
        
        created() {
            var getColumDataDefer = this.getClassItemColumn();
            this.initPromise(getColumDataDefer);
        },
	     	watch:{
					cyear(){
						  var getColumDataDefer = this.getClassItemColumn();
		                  this.initPromise(getColumDataDefer);
					},
					cperiod(){
						  var getColumDataDefer = this.getClassItemColumn();
		           		  this.initPromise(getColumDataDefer);
					}
				},
				mounted(){
		    },
        methods: {
        	// 当页面高度变化后重置tbody的高度;
	        resetTableHeight(height){
	           this.$refs.ref_paydatacheck.setData('tBodyHeight',height);
	        },
        	calrequest(){
    			var getColumDataDefer = this.getClassItemColumn();
        		this.initPromise(getColumDataDefer);
    		},
        	detailCompareEnd(){//明细对比
        		var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                this.$router.push({path:"/hrwa/paydata/paydataDetailcompare", query:queryParma}) ;

        	},
            initPromise(request) {
                Promise.all([request]).then(() => {
                    // this.$refs.cover.remove();
                    this.request();
                });
            },
            getClassItemColumn(){
                var that = this;
                return this.$http({
                    url: "/hrwa/salarymgt/payData/payData/getUserShowClassItems",
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
                            this.sumdataall = res.data.data.sumdataall;

                            this.columnsData = columnInfo;
                            if(this.columnsData && this.columnsData.length>0){
                                 for(var i = 0;i<this.columnsData.length;i++){
                                     var k = "tableCoulmnVIf"+this.columnsData[i].column;
                                     this.tableData[k] = true;
                                 }
                            }
                            this.$refs.ref_paydatacheck.setData('columns', this.columnsData);
                            this.$refs.ref_paydatacheck.init();

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
            cancel(){

                this.$refs.ref_paydatacheck.formShow = false;
                this.$refs.ref_paydatacheck.getTableComp().closeExpandRow();
            },
            
            request(n, s) {// 请求数据

                var pn = 1;
                var ps =10 ;

                if(n){
                    pn = n;
                }
                if(s){
                    ps = s;
                }
                var url =
                    "/hrwa/salarymgt/payData/payData/pageList";
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
                    data : {}//后期加模板用的
                })
                    .then((res) => {
                        if(res.data.status === true){
                            this.$nextTick(() => {
                                var resData = res.data.data.content;
                                if(this.$refs.ref_paydatacheck) {
                                    this.tableListData = res.data.data.content;
                                    this.$refs.ref_paydatacheck.setTableData(
                                        this.tableListData
                                    );
                                    this.actionEnableAndDataCount(this.tableListData);//修改按钮状态

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
                    url: "/hrwa/salarymgt/payData/payData/actionDiasbledAndDataCount",
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
                        		//状态显示成功才显示按钮区域
                    		this.btnisShow=true;
                    		this.backExportDisabled = res.data.data.unpayDisabled;
                            this.waclassstate = res.data.data.waclassstate ;
                            
                            var detailCompareDisabled = res.data.data.detailCompareDisabled;//明细对比
                            this.$set(this.textBtnArr[2],"disabled",detailCompareDisabled);
                            
                            this.transferMonthEndDisabled = res.data.data.transferMonthEndDisabled;
                            this.unTransferMonthEndDisabled = res.data.data.unTransferMonthEndDisabled;
                            
                            var showTransferMonthEnd= !this.transferMonthEndDisabled;
                            var showUnTransferMonthEnd = !this.unTransferMonthEndDisabled;
                            this.$set(this.textBtnArr[0],"visible",showTransferMonthEnd);
                            this.$set(this.textBtnArr[1],"visible",showUnTransferMonthEnd);
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
            unMonthEnd(){
                this.$http({
                    url: "/hrwa/salarymgt/payData/payData/unMonthEnd",
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
                        	this.$emit('changeWaState');
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
//                          this.setQueryCondition();
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
                    url: "/hrwa/salarymgt/payData/payData/monthEnd",
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
                        	this.$emit('changeWaState');
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
//                          this.setQueryCondition();
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

            periodSelect(template,condition,option){
                if(condition.fieldcode == "period" && option){
                    this.cyear = option.value.substr(0,4);
                    this.cperiod = option.value.substring(4);
                }
                this.searchTemplate = template;
                this.request();
            },
            setQueryCondition(){

                let url ="/hrwa/salarymgt/payData/payData/queryPeriod";
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
            getOperateDatas(){
                var tableSelections = this.$refs.ref_paydatacheck.comp.$refs.ref_paydatacheck.getSelection();
                var selectedDatas = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        selectedDatas.push(row);
                    }
                }
                if(selectedDatas.length == 0){
                    selectedDatas = this.$refs.ref_paydatacheck.getTableData();
                }
                return selectedDatas;
            },


            showExportItemSelDialog(){
                this.$http({
                    url: "/hrwa/salarymgt/payData/payData/bankio/showSelItems?pk_org=" +this.pk_org ,
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
                let url = "/hrwa/salarymgt/payData/payData/bankio/downloadExcel?pk_org=" + this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType + "&selitems=" + selItems + "&funcode=60130paydata";
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
                    url: "/hrwa/salarymgt/payData/payData/bankio/preDownload?pk_org=" +this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType,
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
//              let url = "/hrwa/payitem/info/" + this.pk_wa_class + "/" + pk_group + "/" + this.pk_org + "/" + this.cyear + "/" + this.cperiod + "/" + this.classname + "/" + pk_group_name + "/" + pk_org_name+"?funcode=60130payitem";
//              this.$router.push(url);
            },
			      showlogVisible(){//批量修改弹框ok
			      		console.log(this.dialogVisible);
			      		this.$refs.batchEditDlg.show();
			      },
			      showHeaderSettingcheck(){//设置显示列ok
			      	this.$refs.ref_paydatacheck.setTransferVisible(true);
			      }

        },
        watch:{
			cyear(){
				this.request();
			},
			cperiod(){
				this.request();
			}
		},
    };
</script>
<style>
.salarypmt.el-pagination {
	margin-top: 70px !important;
}
</style>
