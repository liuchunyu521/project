<!--
	作者：xijga
	时间：2018-10-16
	描述：添加发薪人员
-->
<template>
	<div>
  		<el-dialog
  		  class="batchadd"
		  title="添加发薪人员"
		  :visible="dialogVisible"
		  size="large"
		  :before-close="handleClose"
		  @open="openDialog">
		  <span style="height: 450px;display: block;overflow: auto;overflow-y: hidden;">
			  	<div class="buzhou">
				  	<el-steps :space="240" :active="active" finish-status="success" :center="true" :align-center="true">
					  <el-step class="buzhou1" title="选择发薪人员"></el-step>
					  <el-step title="设置扣税规则"></el-step>
					</el-steps>
				</div>
				<div class="s1" v-show="step1">
					<ifbp-button-area>
						<!-- 查询模板组件 -->
				      <!-- <ifbp-search class="fr"
				                   :template-code="tplCode"
				                   @search="advancedSearch"
				                   >
				      </ifbp-search> -->

		                    <ifbp-search-dialog
                                class="fr"
								ref="testSetOption"
								:template-code="tplCode"
								:dialog-title="dialogTitle"
								@search="advancedSearch">
		                    </ifbp-search-dialog>

				    </ifbp-button-area>
			    	<!-- 主体区域 -->
				      <!-- UI模板组件  :pk-temp="tablePk"-->
				    <div class="add">
				      <ifbp-template ref="ref_batch_add"
				                     tpl-id="batchadd"
				                     :tpl-data="tableData"
				                     :table-show-menu="false">
				      </ifbp-template> 
				    </div>
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
				</div>
		  		<div v-show="step2">
		  			<!--扣税规则设置-->
			        <ifbp-template ref="ref_addTaxRateDlg"
			                       tpl-id="ref_addTaxRateDlg"
			                       :pk-temp="addTaxRateDlgId"
			                       :tpl-data="addTaxRateDlgData"
			                       show-type="form">
			        </ifbp-template>
		  		</div>
		        <el-checkbox v-model="checkedall" v-show="checkall" @change="checkchange" style="margin-top: 16px;margin-left: 14px;">全部全选</el-checkbox>

		  </span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancel">取 消</el-button>
		    <el-button type="primary" @click="addPayFile" v-show="nextbutton">下一步</el-button>
		    <el-button @click="last" v-show="lastbutton">上一步</el-button>
		    <el-button type="primary" @click="addDialogConfirm" v-show="overbutton">完 成</el-button>
		  </span>
		</el-dialog>
    </div>  
</template>
<script>


    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins :[pageModelMixin],
        props :['pk_org','pk_wa_class','cyear','cperiod'],
        data() {
            /*var pk_org= this.$route.query.pk_org ;

            var pk_wa_class= this.$route.query.pk_wa_class  ;

            var cyear= this.$route.query.cyear  ;


            var cperiod = this.$route.query.cperiod  ;*/

            return {
                dialogTitle:"过滤",
            	//    	测试begin
				/*pk_org:'0001A910000000000B9V',
				pk_wa_class:'1001A910000000000804',
				cyear:'2018',
				cperiod:'04',*/
				//		测试over
            	
            	dialogVisible:false,
            	active:0,
            	step1:true,
            	step2:false,
            	nextbutton:true,//下一步
            	lastbutton:false,//上一步
            	overbutton:false,//完成
            	checkedall:false,
            	checkall:true,//全选按钮隐藏显示
                // 查询模板传入参数
                tplCode :'60130payfilepsn',
                searchTemplate: {},
                // UI模板传入参数
//                tablePk: "0001AA1000000000QJJ9",
                tableData: {},

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,

                /*pk_org : pk_org,
                pk_wa_class : pk_wa_class,
                cyear : cyear,
                cperiod : cperiod,*/

                addDialogVisible : false,
                addTaxRateDlgId:"0001AA1000000001DQXL",
                addTaxRateDlgData:{
                    payfile : {},
                    taxrateparam :{
                        pk_org : ""
                    },
                    rules:{
                        taxtype: [{required: true, message: "扣税方式不能为空", }],
                    }
                },

            };
        },
        /*created() {
            this.request();

        },*/
        methods: {
        	show(){
        		this.dialogVisible = true;
        	},
        	cancel(){
        		this.handleClose();
        	},
        	handleClose(){
        		this.active = 0;
        		this.step1 = true;
        		this.step2 = false;
        		this.nextbutton = true;
        		this.lastbutton = false;
        		this.overbutton = false;
        		this.checkall = true;
        		this.dialogVisible = false;
        	},
        	last(){
        		this.active--;
        		this.step1 = true;
        		this.step2 = false;
        		this.nextbutton = true;
        		this.lastbutton = false;
        		this.overbutton = false;
        		this.checkall = true;
        	},
        	/*next(){
        		this.active++;
        		this.step1 = false;
        		this.step2 = true;
        		this.nextbutton = false;
        		this.lastbutton = true;
        		this.overbutton = true;
        	},*/
        	openDialog(){
        		this.request();
        		this.checkedall = false;
        	},
        	checkchange(){
        		if(this.checkedall==true){
        			this.$refs.ref_batch_add.getTableComp().selectAllRow()
        		}else if(this.checkedall==false){
        			this.$refs.ref_batch_add.getTableComp().unSelectAllRow()
        		}
        		
        	},
        	initPromise(request) {
                Promise.all([request]).then(() => {
                    if(this.checkedall==true){
        				this.$refs.ref_batch_add.getTableComp().selectAllRow()
	        		}else if(this.checkedall==false){
	        			this.$refs.ref_batch_add.getTableComp().unSelectAllRow()
	        		}
                });
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
                    "/hrwa/salarymgt/payData/psnController/qryBatchAddPsn";
                this.$http({
                    url: url,
                    method: "post",
                    params :{
                        pn : pn,
                        ps : ps,
                        pk_org:this.pk_org,
                        pk_wa_class :this.pk_wa_class,
                        cyear : this.cyear,
                        cperiod : this.cperiod
                    },
                    data:this.searchTemplate
                })
                    .then((res) => {
//                      this.$refs.ref_batch_add.setData(
//                          "hi_psnjob_t",
//                          res.data.data.content
//                      );
						this.initPromise( this.$refs.ref_batch_add.setData(
                            "hi_psnjob_t",
                            res.data.data.content
                       ));
						
						this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                        this.currentPage = res.data.data.number;
                        
                    })
                    .catch(() => {

                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },


            // 跳转到添加地点页面
            addPayFile() {
            	var addDatas = [];
                var tableSelections = this.$refs.ref_batch_add.comp.$refs.ref_batch_add.getSelection();
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        addDatas.push(row);
                    }
                }
                
			 
			     if(addDatas.length == 0 && this.checkedall == false){
                    this.$message({
                        message: "请选择数据",
                        type: "error"
                    });
                    return ;
                }
				
           

                this.addDatas = addDatas;

                this.addTaxRateDlgData.taxrateparam.pk_org = this.pk_org;
                this.active++;
        		this.step1 = false;
        		this.step2 = true;
        		this.nextbutton = false;
        		this.lastbutton = true;
        		this.overbutton = true;
        		this.checkall = false;
            },

            addDialogConfirm(){
                this.$refs.ref_addTaxRateDlg.validate(valid => {
                    if (valid) {
                        var data = this.$refs.ref_addTaxRateDlg.getData("payfile");
                        var taxType = data.taxtype;
                        var taxRate = data.taxtableid;

                        this.$http({
                            url: "/hrwa/salarymgt/payData/psnController/addAlterPsn",
                            method: "post",
                            data: {
                                data : this.addDatas ,
                                pk_org : this.pk_org,
                                pk_wa_class : this.pk_wa_class,
                                cyear : this.cyear,
                                cperiod :this.cperiod,
                                taxtype :taxType,
                                taxtableid : taxRate,
                                isAll : this.checkedall,
                                searchTemplate:this.searchTemplate,
                                transType :'BATCH_ADD'
                            }
                        })
                            .then(res => {

                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    this.$emit('changeWaState');
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                                this.handleClose();
                            })
                            .catch(() => {
                                this.$message({
                                    message: "操作失败",
                                    type: "error"
                                });
                            });
                    }
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
        }
    };
</script>

<style>
  @import '/src/apps/common/css/pay.css';
    .batchadd .el-dialog{
    	max-height: none;
    }
    .batchadd .el-pagination{
    	padding: 0;
    }
    .batchadd .el-dialog__body{
    	padding-bottom: 0px;
    }
  	.add .el-table__body-wrapper{
    	height: 253px;
    	overflow: scroll;
    }
    .buzhou{
    	height: 64px;
    }
    .s1 .operator-container{
    	padding: 8px;
    }
    .s1 .advanced-search-panel{
    	z-index: 111;
    	position: absolute;
    }
    .add .yon-uitemplate{
    	margin-top: 0px;
    }
    .buzhou .el-step__head.is-text.is-process{
	    width: 16px;
	    height: 16px;
	    margin-top: 6px;
	    margin-left: 5px;
        border-color: #5CB0E6;
    	background-color: #ffffff;
    	color: #5CB0E6;
    }
    .buzhou .el-step__icon{
    	line-height: 16px;
    }
    .buzhou .el-step__title.is-process{
    	color: #5CB0E6;
    	font-weight: normal;
    }
    .buzhou .el-step__head.is-text.is-wait{
    	width: 16px;
	    height: 16px;
	    margin-top: 6px;
	    margin-left: 5px;
    }
    .buzhou .el-step__head.is-text.is-success{
    	width: 16px;
	    height: 16px;
	    margin-top: 6px;
	    margin-left: 5px;
	    border-color: #5CB0E6;
	    background: #5CB0E6;
    }
    .buzhou .el-step__title.is-success{
    	color: #75787B;
    	font-weight: normal;
    }
    .buzhou1{
    	margin-left: 26px;
    }
</style>
