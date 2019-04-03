<template>
	<div>
			<el-dialog
     		 class="ontime" 
			  title="时点薪资"
			  :visible.sync="dialogVisible"
			  size="large"
			  :before-close="handleClose"
			  @open="openDialog"
	      >
       			<ifbp-page>
       				<ifbp-main-area type="list">
      <!-- UI模板组件 :pk-temp="tablePk"  show-type="table"-->
      
					      <div class="ifbp-btn-line" > 
						      <div class="fr">
						      	<el-button type="text" class=" ifbp-layout-content-right-button marginleft24"   @click="allCaculate">全部计算</el-button>
					      		<el-button type="text" class=" ifbp-layout-content-right-button marginleft24"   @click="showBatchEditDlg">批量修改</el-button>
						        <i class="ifbp-icon-setting marginleft16"  @click="showHeaderSetting" title="设置"></i>
						      </div>
						    </div>
					      <ifbp-template ref="ref_wapsndoc_t"
					                     tpl-id="ontimetable"
					
					                     :tpl-data="tableData"
															 :table-show-menu='false'
					                     :tplResetFun="tableResetFun"
					                     @edit-table-click="tableEditClick"
					                     :methods="onTimeTableMethods">
					      </ifbp-template>
			            <paydataOntimedlg ref="paydataOntimedetaildlg" :pk_wa_datas="pk_wa_datas"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" ></paydataOntimedlg> 

			       </ifbp-main-area> 
	     		 </ifbp-page>
  		</el-dialog>

	</div>
</template>

<script>
	import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import paydataOntimedlg from './paydata-ontime-detail-dlg.vue';

 
export default {
	    mixins: [pageModelMixin],
    	components: {paydataOntimedlg },

    	props: ['pk_org', 'pk_wa_class', 'cyear', 'cperiod'],
	  	data() {

    	  var that = this;
      
		    return {
		    	dialogVisible: false,
		        // 查询模板传入参数
		        searchTemplate: null,
		        // UI模板传入参数
		        tablePk: "0001AA1000000000I9FT",
		        tableData: {},
		        tableResetFun: function($node) {
		            var $table = this.getNodeById($node, "wapsndoc_t");
		
		            let code = $node.find("[prop='m_clerkcode']");
		            code.html(
		                '<template scope="scope">' +
		                '<a href="javascript:void(0);" @click="clertCodeClick(scope)">{{scope.row.m_clerkcode}}</a>' +
		                '</template>'
		            );
		
		
		            let moneyCode = $node.find("[prop='m_wadocnmoney']");//现金额
		            let oldMoneyCode = $node.find("[prop='m_oldwadocnmoney']");//原金额
		            let wanMoneyCode = $node.find("[prop='m_wanmoney']");//发放金额
		
		            moneyCode.attr('render-type', 'default');
		            oldMoneyCode.attr('render-type', 'default');
		            wanMoneyCode.attr('render-type', 'default');
		            moneyCode.html(
		                '<template scope="scope">'
		                + '<el-number :decimals="scope.row.iflddecimal"  v-model="scope.row.m_wadocnmoney" :editable="false"> </el-number>'
		                + '</template> '
		            );
		            oldMoneyCode.html(
		                '<template scope="scope">'
		                + '<el-number :decimals="scope.row.iflddecimal"  v-model="scope.row.m_oldwadocnmoney" :editable="false"> </el-number>'
		                + '</template> '
		            );
		            wanMoneyCode.html(
		                '<template scope="scope">'
		                + '<el-number :decimals="scope.row.iflddecimal"  v-model="scope.row.m_wanmoney" :editable="false"> </el-number>'
		                + '</template> '
		            );
		
		            var operateHtml = this.getTableOperateHtml([{title:"编辑",icon:"edit"}]);
		            $table.append(operateHtml);
		            return $node[0].outerHTML;
		        },
		          onTimeTableMethods:{
		              clertCodeClick(scope){
		              	       let setDtlInfo = that.setInfoToDetail(scope);
           						 that.initPromise(setDtlInfo,false);
//		                  sessionStorage.setItem('onTimeDataParam', JSON.stringify(scope.row));
//		                    that.$refs.paydataOntimedetaildlg.show(that);
		              }
		         },
		          batchEditVisible :false,
		          batchEditTempId : "0001AA1000000000JF3N",
		          batchEditTempData:{
		              dlgdata :{},
		              rules:{
		                  item: [{
		                      required: true,
		                      message: '项目不能为空',
		                      trigger: 'blur'
		                  }],
		                  value: [{
		                      required: true,
		                      message: '修改值不能为空',
		                      trigger: 'blur'
		                  }],
		              }
		          },
		          searchCode:''
		    };
	  	},
//	created() {
//    this.request();
//  },
    methods: {
	    show() {
	      this.dialogVisible = true;
	    },
	    handleClose() {
	      this.dialogVisible = false;
	    },
	    openDialog() {
	      this.request();
	    },
    	showHeaderSetting(){
    		this.$refs.ref_wapsndoc_t.setTransferVisible(true);
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
          "/hrwa/salarymgt/payData/payDataOnTime/pageList";
        this.$http({
          url: url,
          method: "post",
          data: {
              pn : pn,
              ps : ps,
              pk_wa_class : this.pk_wa_class,
              pk_org :this.pk_org,
              cyear : this.cyear,
              cperiod : this.cperiod
          }
        })
          .then((res) => {

            this.$refs.ref_wapsndoc_t.setData(
              "wapsndoc",
              res.data.data
            );


          })
          .catch(() => {
            this.$message({
              message: "信息获取失败",
              type: "error"
            });
          });
      },

      // 获取查询模板数据
        handleSearch(){},
      // table行的编辑操作
      tableEditClick(scope) {
      	
	        let setDtlInfo = this.setInfoToDetail(scope);
            this.initPromise(setDtlInfo,true);

      },
      setInfoToDetail(scope){
      	return sessionStorage.setItem('onTimeDataParam', JSON.stringify(scope.row));
      },
        initPromise(request,isEdit) {
                Promise.all([request]).then(() => {
                    // this.$refs.cover.remove();
                    this.$refs.paydataOntimedetaildlg.show(this,isEdit);
                });
            },
        goToDetail(){
//          let queryParam = {
//              pk_org :this.pk_org,
//              pk_wa_class :this.pk_wa_class,
//              cyear :this.cyear,
//              cperiod : this.cperiod,
//          };
//          this.$router.push({path:"/hrwa/paydata/paydataOntimedetail",query:queryParam});
        },

      getOperateDatas(){
          var tableSelections = this.$refs.ref_wapsndoc_t.comp.$refs.ref_wapsndoc_t.getSelection();
          var selectedDatas = [];
          if (tableSelections && tableSelections.length > 0) {
              for (var i = 0; i < tableSelections.length; i++) {
                  var row = tableSelections[i];
                  selectedDatas.push(row);
              }
          }
          if(selectedDatas.length == 0){
              selectedDatas = this.$refs.ref_wapsndoc_t.getData("wapsndoc");
          }
          return selectedDatas;
      },
      // 跳转到添加地点页面
        allCaculate () {

            var selectedDatas = this.getOperateDatas();
            if(selectedDatas == null || selectedDatas.length==0){
                this.$message({
                    message: "没有需要计算的数据",
                    type: "error"
                });
                return ;
            }

            var url = "/hrwa/salarymgt/payData/payDataOnTime/calculate4List";
            this.$http({
                url: url,
                method: "post",
                data: {
                    uivos :JSON.stringify(selectedDatas),
                    pk_wa_class : this.pk_wa_class,
                    pk_org :this.pk_org,
                    cyear : this.cyear,
                    cperiod : this.cperiod
                }
            })
                .then((res) => {
                    if (res.data.status === true){
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.request();
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
      // 查询区点击搜索后的处理
      advancedSearch(searchTemplate) {
        console.log("search triggered", searchTemplate);
      },
        showBatchEditDlg(){
            var selectedDatas = this.getOperateDatas();
            if(!selectedDatas){
                this.$message({
                    message: "没有待修改的数据",
                    type: "error"
                });
                return ;
            }
            this.batchEditVisible  = true;
        },
        batchEditConfirm(){
            var data = this.$refs.ref_dlgdata_c.getData("dlgdata");

            var selectedDatas = this.getOperateDatas();
            if(!selectedDatas){
                this.$message({
                    message: "没有待修改的数据",
                    type: "error"
                });
                return ;
            }
            this.$refs.ref_dlgdata_c.validate(valid => {
                if (valid) {
                    this.$http({
                        url: "/hrwa/salarymgt/payData/payDataOnTime/batchUpdate",
                        method: "post",
                        data: {
                            selectDatas : JSON.stringify(selectedDatas),
                            newData : JSON.stringify(data),
                            pk_wa_class : this.pk_wa_class,
                            pk_org : this.pk_org,
                            cyear : this.cyear,
                            cperiod : this.cperiod,
                        }
                    })
                        .then(res => {

                            if (res.data.status === true) {
                                this.$message({
                                    message: res.data.msg,
                                    type: "success"
                                });
                                this.batchEditVisible = false;
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
                                message: "更新失败",
                                type: "error"
                            });
                        });
                }
            });

        }
        //bathEditConfirm结束
    } //method结束
 };
   
</script>

<style>
		@import '/src/apps/common/css/pay.css';
    .ontime .el-tabs>div{
        margin-left:0 !important;
        margin-bottom: 0 !important;
    }
    
    .ontime .el-dialog{
    	/* max-height: none; */
      height: 80%;
    }
    .ontime .el-dialog .main-panel{
      padding:0px 24px 16px;
      background: white;
    }
    .ontime .el-dialog__body{
    	padding-bottom: 0;
      height: 80%;
    }
    .ontime .el-dialog__body .el-table__header{
      width: 100%
    }
    .ontime .el-dialog__body .operator-container{
    	padding-left: 0;
    }
    
</style>