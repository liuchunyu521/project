<!--
	作者：xijga
	时间：2018-10-15
	描述：发薪人员
-->
<template>
	<div>
		<ifbp-main-area type="list" class="maringTop0">
			<div class="ifbp-btn-line">
	          <div class="fl">
	            <span class="ifbp-layout-content-left-span">发薪人员({{totalElements}})</span>
	          </div>
	          <!--
	              <div class="fr">
		            <el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="addPayFile" :disabled="buttondisabled">添加发薪人员</el-button>
		            <el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="transPsn" :disabled="buttondisabled">异动人员检查</el-button>
		            <el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="ruleCheck" :disabled="buttondisabled">规则检查</el-button>
					<ifbp-search-dialog
						ref="testSetOption"
						:template-code="templateCode"
						:dialog-title="dialogTitle"
						@search="handleSearch"
					>
					</ifbp-search-dialog>
		            <i class="ifbp-icon-setting marginleft16"  @click="showHeaderSetting" title="设置"></i>
		          </div>-->
	          <!-- 组件 ifbpBtnLine  -->
		          <ifbp-btn-line 
		            :text-btn-arr="textBtnArr"
		            :icon-btn-arr="iconBtnArr"
		            
		            :text-align="textAlign"
		            style="margin-top:-16px;width: calc(100% - 200px);float: right;">
		                <div slot="search-dialog">
		                    <ifbp-search-dialog
								ref="testSetOption"
								:template-code="templateCode"
								:dialog-title="dialogTitle"
								@search="handleSearch">
		                    </ifbp-search-dialog>
		                </div> 
		          </ifbp-btn-line>
	          
        	</div>
	    	<!-- 主体区域 -->
	    	
	        <ifbp-template ref="ref_payfile_t"
	                     tpl-id="payfilelist"
	                     :table-show-menu='false'
	                     :tpl-data="tableData"
	                     :tplResetFun="tableResetFun"
	                     :methods="TableMethods"
	                     :editable="payFileEdit"
	                     @form-confirm-click="confirm"
	                     @form-edit-click = "edit"
	                     @form-cancel-click="cancel"
	                     :edit-button-show="editShow"
                    	 @row-click="rowClick"
	                     @selection-change="selectionChange"
	                     @delete-table-click="tableDeleteClick"
	                     @edit-table-click="tableEditClick">
	        </ifbp-template>
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
      	<psnBatchAdd ref="psnbatchadd" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"    @changeWaState='synchWaState'></psnBatchAdd>
      	<psnTran ref="psntran" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @psntran="tran"></psnTran>
      	<psnopByRule ref="psnopbyrule" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @psnbyrule="byrule"></psnopByRule>
	</div>
</template>
<script>


    import pageModelMixin from 'ifbp-business/pageModelMixin/index.js';
    import tableHeightMixin from "ifbp-business/tableHeightMixin/index.js";
  	import psnBatchAdd from './psn-batch-add.vue';
  	import psnTran from './psn-tran.vue';
  	import psnopByRule from './psn-opByRule.vue';
  	import IfbpBtnLine from "ifbp-business/ifbpBtnLine";
    export default {
        mixins :[pageModelMixin,tableHeightMixin],
        props :['pk_org','pk_wa_class','cyear','cperiod'],
		components:{
			psnBatchAdd,
			psnTran,
			psnopByRule,
			"ifbp-btn-line":IfbpBtnLine
		},
	    data() {
	        var vm = this;
	      return {
	      	otherHeight:230,
  			templateCode:'60130paydata1psn',
            dialogTitle:"过滤",
			customerClass:["customer-search-dialog"],
            dialogClass:["a","b"],
            searchTemplate:{
                // ...
            },

	      	 editShow : false,//卡片的编辑按钮是否显示
      	     tableListData : [],//列表中数据
	      	payFileEdit:false,
	      	buttondisabled:true,//按钮根据状态置灰
	      	searchpsn:'',//搜索人员姓名
	        tableData: {},
	        tableResetFun: function($node) {
	
	            var $table = this.getTableDom($node);
	            $table.attr(':height','tBodyHeight');
	            $table.attr(':show-header', 'true');
	            //icon隐藏
//	            {
//	                title: '编辑',
//	                icon: 'edit',
//	                vif: "scope.row.checkflag != true"
//	            },
	            var operateArr = [
	            {
	                title: '编辑',
	                icon: 'edit',
	                vif: "scope.row.checkflag != true"
	            },
	            {
	                title: '删除',
	                icon: 'delete',
	                vif: "scope.row.checkflag != true"
	            }];
	          // 人员编码详情
	//          let psncode = $node.find("[prop='psncode']");
	//          psncode.html(
	//              '<template scope="scope">' +
	//              '<a href="javascript:void(0);" @click="wacalssNameClick(scope)">{{scope.row.psncode}}</a>' +
	//              '</template>'
	//          );
	            var operateHtml = this.getTableOperateHtml(operateArr);
	          $table.append(operateHtml);
	          return $node[0].outerHTML;
	        },
	
	        //详情
	        TableMethods: {
	//          wacalssNameClick(scope) {
	//              vm.$router.push("/hrwa/payFile/payFileDetail/" + scope.row.pk_wa_data + "/" + false);
	//          },
	
	//          waclassDbClick(row){
	//              vm.$router.push("/hrwa/payFile/payFileDetail/"+ row.pk_wa_data + "/" + false );
	//
	//          },
	        },
	
			baseData : '',//记录表单操作的数据，然后表格进行同步
	        // 分页组件传入参数
	        totalElements: 0,
	        currentPage: 1,
	        size: 10,
	        // 是否显示批量删除按钮
	        showDeleteButton: false,
	        // 是否显示删除dialog
	        isActionEnable : true,
	        
	        //如下为ifbpBtnLine 配置项;
            ifbpBtnLineWidth:0,
            textAlign:"right",
            // 左侧 文字按钮区域;
            textBtnArr: [{
                title: "添加发薪人员",
                command: "buttondisabled",
                fontNum:5,
                fn: this.addPayFile,
                disabled:true
            },{
                title: "异动人员检查",
                command: "buttondisabled",
                fontNum:5,
                fn: this.transPsn,
                disabled:true
            },{
                title: "检查规则",
                command: "buttondisabled",
                fontNum:4,
                fn: this.ruleCheck,
                disabled:true
            }],
            // 右侧 图标按钮区域;
            iconBtnArr: [{
                title: "设置",
                fn: this.showHeaderSetting,
                command: "setting",
                iconfont: "ifbp-icon-setting"
            }]
	      };
	    },
	    watch:{
			cyear(){
				this.request();
			},
			cperiod(){
				this.request();
			}
		},
	    created() {
	     	this.request();	
	   	},
	   	mounted(){
	       
	    },
	    methods: {
	    	
	    	
		    // 当页面高度变化后重置tbody的高度;
	        resetTableHeight(height){
	           this.$refs.ref_payfile_t.setData('tBodyHeight',height);
	        },
			setQueryCondition(){
				// let param = {
                //         'period' : {
                //         }
				// 	};
					
				// this.$refs.testSetOption.setOptionsByFieldcode(param);
			},
			handleSearch(searchTemplate){
				this.searchTemplate = searchTemplate;
				this.requestListDatas()
			},
	    	//新增人员弹框关闭后更新人数
	    	tran(){
	    		this.request();
	    		//左侧人数更新 remove by wangyf 首先人员数量已经去掉、其次这样会原来的焦点。
//	    		this.$emit("psnqueryWaClass")
	    	},
	    	//规则检查弹框关闭后更新人数
	    	byrule(){
	    		this.request();
	    		//左侧人数更新remove by wangyf 首先人员数量已经去掉、其次这样会原来的焦点。
//	    		this.$emit("psnqueryWaClass")
	    	},
	        // 请求数据
	        request(n, s) {
	          this.setActionEnableStateStateCount();
	          this.requestListDatas(n,s)
	        },
	        requestListDatas(n,s){
	            var pn = 1;
	            var ps =10 ;
	
	            if(n){
	                pn = n;
	            }
	            if(s){
	                ps = s;
	            }
	            var url =
					"/hrwa/salarymgt/payData/payFile/pageList";
					
	            this.$http({
	                url: url,
	                method: "post",
	                params :{
	                    pn : pn,
	                    ps : ps,
	                    pk_wa_class :this.pk_wa_class,
	                    cyear : this.cyear,
	                    cperiod : this.cperiod,
						pk_org : this.pk_org
					},
					data:this.searchTemplate,
					contentType: "application/json"
	            })
	                .then((res) => {
	                    if(res.data.status === true){
	                        this.$refs.ref_payfile_t.setTableData(
	                            res.data.data.content
	                        );
                            this.tableListData = res.data.data.content;

	                        this.totalElements = res.data.data.totalElements;
	                        this.size = res.data.data.size;
	                        this.currentPage = res.data.data.number;
	                    }else{
	                        this.$message({
	                            message: res.data.msg,
	                            type: "error"
	                        });
	                    }
	
	
	                })
	                .catch(() => {
	
	                    this.$message({
	                        message: "信息获取失败",
	                        type: "error"
	                    });
	                });
	        },
	
	        setActionEnableStateStateCount(){
	 
		        var url =
		          "/hrwa/salarymgt/payData/payFile/isActionEnableAndPsnCount";
		        this.$http({
		           url: url,
		           method: "post",
		           params :{
		             pk_wa_class :this.pk_wa_class,
		             cyear : this.cyear,
		             cperiod : this.cperiod,
		             pk_org : this.pk_org
		            }
		        })
		          .then((res) => {
		          	 
		              if(res.data.status === true){
		                  let result = res.data.data.actionstate;
		//                  this.periodCondition = res.data.data.periodcondition;
		                  this.datastate = res.data.data.datastate;
		                  if(result == 'y' || result == 'Y'){
		                      this.isActionEnable = true;
//		                      this.buttondisabled = false;
		                      this.$set(this.textBtnArr[0],"disabled",false);
		                      this.$set(this.textBtnArr[1],"disabled",false);
		                      this.$set(this.textBtnArr[2],"disabled",false);
		                      
		                  }else{
		                      this.isActionEnable = false;
//		                      this.buttondisabled = true;
		                      this.$set(this.textBtnArr[0],"disabled",true);
		                      this.$set(this.textBtnArr[1],"disabled",true);
		                      this.$set(this.textBtnArr[2],"disabled",true);
		                  }
		
		              }else{
		                  this.$message({
		                      message: res.data.msg,
		                      type: "error"
		                  });
		              }
		
		          })
		          .catch(() => {
		          	 
		            this.isActionEnable= true;
		            this.buttondisabled = false;
		            this.$message({
		              message: "信息获取失败",
		              type: "error"
		            });
		        });
		    },
	        transPsn(){
	            //var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
	            //this.$router.push({path:"/hrwa/payFile/tranPsn", query:queryParma}) ;
				this.$refs.psntran.show();
	        },
	        confirm(){
	        	  var data = this.$refs.ref_payfile_t.getFormData();
			
			         var derateptg = data.derateptg;
			         if(derateptg){
			
			           var r = /^(\d{1,2}(\.\d{1,2})?|100)$/;
			
			             if(!r.test(derateptg)){
			              this.$message({
			                message: "减税比例只能输入0-100，且最多两位小数",
			                type: "error"
			              });
			              return ;
			            }
			         }
			        this.$refs.ref_payfile_t.validate(valid => {
			          if (valid) {
			            this.$http({
			              url: "/hrwa/salarymgt/payData/payFile/save",
			              method: "post",
			              data: JSON.parse(JSON.stringify(data))
			            })
			              .then(res => {
			
			                if (res.data.status === true) {
			                  this.$message({
			                    message: res.data.msg,
			                    type: "success"
			                  });
			                  this.originalValue = res.data.data;
			
			                  this.$refs.ref_payfile_t.setFormData(
			                    JSON.parse(JSON.stringify(this.originalValue))
			                  );
			                  this.payFileEdit = false;
			                  this.baseData =  JSON.parse(JSON.stringify(this.originalValue));
			                  this.tableDataSynchronieze(this.baseData);
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
        	       var data =  this.$refs.ref_payfile_t.getFormData();
	               if(data.checkflag == true){
	                   this.$message({
	                       message: "已经审核的数据不能编辑",
	                       type: "error"
	                   });
	                  return ;
	               }
	               this.baseData = JSON.parse(JSON.stringify(data)) ;//转换下，避免指向同一个对象
	               this.payFileEdit = true;
	        },
	        cancel(){
    	       if( this.payFileEdit ){
                    this.payFileEdit = false;
                    this.tableDataSynchronieze(this.baseData);
                }else{
                    this.$refs.ref_payfile_t.formShow = false;
                    this.$refs.ref_payfile_t.getTableComp().closeExpandRow();
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
	        ruleCheck(){
	            let url ="/hrwa/salarymgt/payData/payFile/hasRangRule/"+this.pk_wa_class;
	            this.$http({
	                url: url,
	                method: "GET",
	               
	            }).then((res) => {
	                if(res.data.status === true){
	                    if(res.data.data){
	                        //var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
	                        //this.$router.push({path:"/hrwa/payFile/opByRule", query:queryParma}) ;
	                        this.$refs.psnopbyrule.show();
	                    }else{
	                         this.$alert('该方案未设置计薪规则，无法进行规则检查。如需设置，请在【薪资设置】-【薪资方案】中进行调整', '提示', {
	                            confirmButtonText: '确定',
	                            callback: action => {
	                            }   
	                        });
	                    }
	                    
	                }else{
	                    this.$message({
	                        message: res.data.msg,
	                        type: "error"
	                    });
	                }
	
	            }).catch(() => {
	                this.$message({
	                    message: "查询计薪规则失败",
	                    type: "error"
	                });
	            });
	           
	
	        },
	      // table行的编辑操作
	      tableEditClick(scope) {
		      this.$refs.ref_payfile_t.expandRow(scope.row,scope.$index)
		      this.payFileEdit = true;
	      },
	      // table行的删除操作
	      tableDeleteClick(scope) {
	          if(this.isCanEdit(scope.row)){
	
	              this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
	                  confirmButtonText: '确定',
	                  cancelButtonText: '取消',
	                  closeOnClickModal:false,
	
	                  type: 'warning'
	              }).then(() => {
	                  // 这里是以前的删除的逻辑
	                  this.delData = scope.row;
	                  this.singleDelDialogClick();
	              }).catch(() => {
	                  // 这里加取消逻辑
	              });
	
	          }else{
	              this.$message({
	                  message: "已审核的数据不能删除",
	                  type: "error"
	            });
	          }
	
	      },
	      isCanEdit(data){
	        if(data.checkflag == true){
	            return false;
	        }else{
	            return true;
	        }
	      },
	      // table选中改变
	      selectionChange(selection) {
	        if (selection && selection.length > 0) {
	          this.showDeleteButton = true;
	        } else {
	          this.showDeleteButton = false;
	        }
	      },
	
	      // 跳转到添加地点页面
	      addPayFile() {
	          //var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
	          //this.$router.push({path:"/hrwa/payFile/batchAddPsn", query:queryParma}) ;
	          this.$refs['psnbatchadd'].show();
	      },
	      // 翻页标签改变每页显示数据
	      handleSizeChange(val) {
	        this.request(1, val);
	      },
	
	      // 翻页标签改变当前页
	      handleCurrentChange(val) {
	        this.request(val, this.size);
	      },
	      synchWaState(){
	      	this.$emit('changeWaState');
	      },
	      // 删除处理
	      singleDelDialogClick() {
	        this.$http({
	          url: "/hrwa/salarymgt/payData/payFile/delete",
	          method: "post",
	          data: JSON.parse(JSON.stringify(this.delData))
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
	          })
	          .catch(() => {
	            this.$message({
	              message: "删除失败",
	              type: "error"
	            });
	          });
	      },
	      showHeaderSetting(){
	      	this.$refs.ref_payfile_t.setTransferVisible(true);
	      }
	    }
  };
</script>
<style>
 
</style>
