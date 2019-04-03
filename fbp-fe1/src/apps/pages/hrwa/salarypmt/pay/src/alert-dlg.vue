<template>
	<div>
		<el-dialog
		  class="alertDialog"
		  title="预警"
		  :visible="dialogVisible"
		  size="large"
		  :before-close="handleClose"
		  @open="openDialog">
		  		  <span style="height: 450px;display: block;overflow: auto;overflow-y: hidden;">

				     
				      	
	      	       <ifbp-panel-group :navbar="false">
		                <ifbp-panel id="psnAlert" title="个人薪资项目预警"  class="titleLine">
		                  	<ifbp-template ref="paydataalert"
							                     tpl-id="alerttemplate"
							                     :tpl-data="tableData"
							                     :table-show-menu="false">
				      		</ifbp-template> 
				      		
                		</ifbp-panel>
            		    <ifbp-panel id="sumalert" title="薪资项目总额预警"  class="titleLine">
		                  	<ifbp-template ref="paydatasumalert"
							                     tpl-id="sumalert"
							                     :tpl-data="sumAlertTableData"
							                     :table-show-menu="false">
				      		</ifbp-template> 
                		</ifbp-panel>
                	</ifbp-panel-group>
                
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
      var that = this;
      return {

		dialogVisible:false,
        tableData: {},
        sumAlertTableData:{}
      };
    },
    methods: {
	handleClose(){
    		this.dialogVisible = false;
    		debugger;
            this.$emit('changeWaState');

	},
	openDialog(){
    		this.request();
	},
	show(){
		this.dialogVisible = true;
	},
      // 请求数据
      request() {
	        var url =
	          "/hrwa/salarymgt/payData/payData/queryAlertData";
	        this.$http({
	          url: url,
	          method: "post",
	          data: {
	              pk_wa_class : this.pk_wa_class,
	              pk_org :this.pk_org,
	              cyear : this.cyear,
	              cperiod : this.cperiod
	          }
	        })
	          .then((res) => {
	
	            this.$refs.paydataalert.setData(
	              "alertdata",
	              res.data.data.psnAlert
	            );
	            
	             this.$refs.paydatasumalert.setTableData(res.data.data.sumAlert);
	          })
	          .catch(() => {
	            this.$message({
	              message: "信息获取失败",
	              type: "error"
	            });
	          });
      },
	  

    }
  };
</script>

<style>
    .alertDialog .el-dialog{
    	max-height: none;
    }
    .alertDialog .el-pagination{
    	padding: 0;
    }
    .alertDialog .el-dialog__body{
    	padding-bottom: 0px;
    }
</style>