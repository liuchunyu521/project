<template> 
	<div>
		<ifbp-main-area type="list" class="maringTop0">
			
			<div class="ifbp-btn-line">
	          <div class="fl">
	            <span class="ifbp-layout-content-left-span">发薪人员({{totalElements}}人)</span>
	          </div>
	          <!--<div class="fr">
	          	<el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="pay"   v-show="payshow">发放</el-button>
	            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="unpay" v-show="unpayshow">取消发放</el-button>
	            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="detailcompare">明细对比</el-button>
	            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="showExportItemSelDialog" :disabled="payshow" >银行报盘</el-button>
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
					        @search="handleSearch"
				        >
	                    </ifbp-search-dialog>-->
	                <!--</div>--> 
	          </ifbp-btn-line>
	          
	        </div>
        
		       <ifbp-template ref="ref_paydata_pay"
                     tpl-id="paydatapay"
                     :tpl-data="tableData"
                     :auto-create="false"
                     :tplResetFun="tableResetFun"
                     :editable="false"
                     @form-cancel-click="cancel"
                     :edit-button-show="false"
                     :confirm-button-show="false"
                     :local-storage-id="pk_wa_class"
                     :methods="tableMethods"
                     :table-show-menu='false'
                     >
                     
                     <!--@edit-table-click="tableEditClick">-->
 			 	</ifbp-template>
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
	</div>
</template>

<script>
	  import pageModelMixin from 'ifbp-business/pageModelMixin/index.js';
    import tableHeightMixin from "ifbp-business/tableHeightMixin/index.js";
	  import IfbpBtnLine from "ifbp-business/ifbpBtnLine";
	  
	  export default {
	  	mixins :[pageModelMixin,tableHeightMixin],
	  	components: { "ifbp-btn-line":IfbpBtnLine},
	  	props :['pk_org','pk_wa_class','cyear','cperiod','classname'],
	  	data() {
	  		var that = this;
			  	 return {
			  	 	otherHeight:230,
			  	 	payshow:false,
			  	 	unpayshow:false,
			  	 	backExportDisabled:true,
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
		                tableData:  {
		                    paydata_c:{
		                        f_1:''
		                    }
                        },
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
		                columnsData:[],
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
                            $table.attr(":top-summary-method", "getTopSummaries");
                            $table.attr("show-top-summary", "true");
                            $table.attr(":disable-tooltip", "true");
		                    var colHTML = "";
		                    for(var i=0;i<that.columnsData.length;i++){
		                        var col = that.columnsData[i];
                                debugger
		                        colHTML+='<el-table-column render-type="'+col.renderType+'" align="right" header-align="right" prop="'+col.column+'" label="'
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
		                totalElements: 0,
		                currentPage: 1,
		                size: 10,
		                
		                tableListData : [],//列表中数据
		                baseData : '',//记录表单操作的数据，然后表格进行同步
		                waclassstate: '',
		                //如下为ifbpBtnLine 配置项;
			            textAlign:"right",
			            // 左侧 文字按钮区域;
			            textBtnArr: [{
			                title: "发放",
			                command: "",
			                fontNum:2,
			                fn: this.pay,
			                visible:false
			            },{
			                title: "取消发放",
			                command: "",
			                fontNum:4,
			                fn: this.unpay,
			                visible:false
			            },{
			                title: "明细对比",
			                command: "detailcompare",
			                fontNum:4,
			                fn: this.detailcompare,
			                disabled:false
			            },{
			                title: "银行报盘",
			                command: "",
			                fontNum:4,
			                fn: this.showExportItemSelDialog,
			                disabled:false
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
	           this.$refs.ref_paydata_pay.setData('tBodyHeight',height);
	        },
        	request(){
        		this.requestData();
        	},
            initPromise(request) {
                Promise.all([request]).then(() => {
                    // this.$refs.cover.remove();
                    this.requestData();
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
                        searchTemplate :{} ,
                        uivos : JSON.stringify(data),
                    }
                })
                    .then(res => {

                        if (res.data.status === true) {
							this.backExportDisabled = res.data.data.unpayDisabled;
                            var payshow = !res.data.data.payDisabled;
                            var unpayshow = !res.data.data.unpayDisabled;
                            this.$set(this.textBtnArr[0],"visible",payshow);
                            this.$set(this.textBtnArr[1],"visible",unpayshow);
                            this.$set(this.textBtnArr[3],"disabled",payshow);
                            
                            this.waclassstate = res.data.data.waclassstate ;

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
                            this.$refs.ref_paydata_pay.setData('columns', this.columnsData);
                            
                            this.$refs.ref_paydata_pay.init();

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

                this.$refs.ref_paydata_pay.formShow = false;
                this.$refs.ref_paydata_pay.getTableComp().closeExpandRow();
            },
               // 请求数据
            requestData(n, s) {
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
                    data : {}
                })
                    .then((res) => {
                        if(res.data.status === true){
                            this.$nextTick(() => {
                                var resData = res.data.data.content;
                                if(this.$refs.ref_paydata_pay) {
                                    this.tableListData = res.data.data.content;
                                    this.$refs.ref_paydata_pay.setTableData(
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
            pay(){
                this.$http({
                    url: "/hrwa/salarymgt/payData/payData/pay",
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
                            this.$emit('changeWaState');
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
                    url: "/hrwa/salarymgt/payData/payData/unPay",
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
                        	this.$emit('changeWaState');
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
            showHeaderSettingcheck(){
		      	this.$refs.ref_paydata_pay.setTransferVisible(true);
            },
            bankExport(){
                let selItems = this.tableBankSelections[0].vcontent;
                for(var i = 1; i < this.tableBankSelections.length; i++){
                    selItems += "|" + this.tableBankSelections[i].vcontent;
                }
                this.selItemDialogVisible = false;
                let url = "/hrwa/salarymgt/payData/bankio/downloadExcel?pk_org=" + this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType + "&selitems=" + selItems + "&funcode=60130paydata";
                window.location.href = encodeURI(url);
            },
            detailcompare(){
            	 var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                 this.$router.push({path:"/hrwa/paydata/paydataDetailcompare", query:queryParma}) ;
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
                    url: "/hrwa/salarymgt/payData/bankio/preDownload?pk_org=" +this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType,
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
             // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.requestData(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.requestData(val, this.size);
            },
           showExportItemSelDialog(){
                this.$http({
                    url: "/hrwa/salarymgt/payData/bankio/showSelItems?pk_org=" +this.pk_org ,
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
        }
  }
</script>

<style>
	.maringTop0{
	  margin-top:0px !important;
	}
   .marginleft24{
	  margin-left: 24px !important;
	}
	.marginleft16{
	  margin-left: 16px !important;
	}

</style>
