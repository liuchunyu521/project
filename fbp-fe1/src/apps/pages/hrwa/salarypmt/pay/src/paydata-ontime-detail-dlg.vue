<template>
	<div>
			<el-dialog
	      		class="ontimedetail" 
			  title="时点薪资卡片"
			  :visible.sync="dialogVisible_a"
			  size="small"
			  :before-close="handleClose"
			  @open="openDialog"
			  @close="closeDialog">
      		
  					<div style="width:100%">
  						<ifbp-page>
  							<ifbp-main-area type="detail">
						      <ifbp-panel id="waDatasPanel">
						          <ifbp-template ref="ref_ontime_c"
						                         tpl-id="ontimeform"
						                         :tplData="onTimeData"
						                         :editable="canEdit"
						                         :tplResetFun="formResetFun"
						                          @after-create="afterCreateFunc"
>
						          </ifbp-template>
						        <ifbp-form-button-area>
						          	  <el-button type="primary"   @click="confirm" v-show="canEdit">保存</el-button>
						              <el-button type="primary"   @click="changeEditStatus" v-show="!canEdit">编辑</el-button>
		          		         	  <el-button type="default"   @click="cancel" >取消</el-button>
						        </ifbp-form-button-area>
						      </ifbp-panel>
						    </ifbp-main-area>
			   			 </ifbp-page>
		   			</div>
   			</el-dialog>
	</div>
</template>

<script>
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default{
	    mixins: [pageModelMixin],
		props: ['pk_wa_datas', 'pk_org', 'pk_wa_class', 'cyear', 'cperiod'],
		data() {
			  var vm = this;
		      var onTimeDataParam = sessionStorage.getItem('onTimeDataParam');

			return {
				 dialogVisible_a :false,
		          onTimeDataParam : onTimeDataParam,
		          // ifbp-panel-group所需参数
		          scrollDom: "ifbpScrollDom",
		        // UI模板所需参数
		          templatePK: "0001AA1000000000K0OZ",
		          onTimeData: {
		              ontime: {},
		              rules: {
		                  basedays: [{
		                      required: true,
		                      message: '基准天数不能为空',
		                      trigger: 'blur'
		                  }],
		                  m_wanceforedays: [{
		                      required: true,
		                      message: '调整前天数不能为空',
		                      trigger: 'blur'
		                  }],
		                  m_wanbeforemoney: [{
		                      required: true,
		                      message: '调整前日薪不能为空',
		                      trigger: 'blur'
		                  }],
		                  m_wanafterdays: [{
		                      required: true,
		                      message: '调整后天数不能为空',
		                      trigger: 'blur'
		                  }],
		                  m_wanaftermoney: [{
		                      required: true,
		                      message: '调整后日薪不能为空',
		                      trigger: 'blur'
		                  }]
		              }
		        },
		        // 基本信息是否为修改态
		        canEdit: false,
	          	formResetFun:function($node){
	              let moneyCode = $node.find("[v-model='ontime.m_wadocnmoney']");
	              let oldMoneyCode = $node.find("[v-model='ontime.m_oldwadocnmoney']");
	              let wanMoneyCode = $node.find("[v-model='ontime.m_wanmoney']")
	
	              moneyCode.attr(":decimals","ontime.iflddecimal");
	              oldMoneyCode.attr(":decimals","ontime.iflddecimal");
	              wanMoneyCode.attr(":decimals","ontime.iflddecimal");
	              return $node[0].outerHTML;
	          	},
	           p_this:null   ,//父弹框的对象
	           templateLoaded:false
      	};
      
	},

	methods:{
	 show(p_this,isEdit) {
	 	if(isEdit){
	 		this.canEdit = isEdit;
	 	}else{
	 		this.canEdit = false;
	 	}
	 	
      this.dialogVisible_a = true;
      this.p_this = p_this
    },
    handleClose() {
      this.dialogVisible_a = false;
    },
    openDialog() {
      this.request();
    },
    closeDialog(){
    	sessionStorage.removeItem('onTimeDataParam');
    },
		  // 获取数据
  	request() {
  		
  		this.onTimeDataParam = sessionStorage.getItem('onTimeDataParam');
  		if(this.templateLoaded == true){
			  var data = JSON.parse(this.onTimeDataParam );
	          this.$refs.ref_ontime_c.setData(
	              "ontime",
	              JSON.parse(JSON.stringify(data))
	          );
  		}
  	
  	},
	 afterCreateFunc() {
	 	
	 	 this.templateLoaded = true;
	 	 this.onTimeDataParam = sessionStorage.getItem('onTimeDataParam');
	 	  let data = JSON.parse(this.onTimeDataParam);
	        this.$refs.ref_ontime_c.setData(
	            "ontime",
	            JSON.parse(JSON.stringify(data))
	        );

	 },
      // 基本信息取消按钮操作
  	cancel() {
     
        if(this.canEdit == false){
        	  this.dialogVisible_a = false;
        	  sessionStorage.removeItem('onTimeDataParam') ;

        }else{
        	   var data = JSON.parse(this.onTimeDataParam);
        	   this.canEdit = false;
        		this.$refs.ref_ontime_c.setData(
            		"ontime",
           			 JSON.parse(JSON.stringify(data))
        		);
        }

  	},
      // 基本信息保存按钮操作
  	confirm() {

	        var data = this.$refs.ref_ontime_c.getData("ontime");
	        var url = "/hrwa/salarymgt/payData/payDataOnTime/save" ;
	        this.$refs.ref_ontime_c.validate(valid => {
	          if (valid) {
	              this.$http({
	                  url: url,
	                  method: "post",
	                  data: {
	                      uivo :JSON.stringify(data),
	                      pk_wa_class : this.pk_wa_class,
	                      pk_org :this.pk_org,
	                      cyear : this.cyear,
	                      cperiod : this.cperiod
	                  }
	              })
	              .then(res => {
	
	                if (res.data.status === true) {
	                    this.$message({
	                        message: res.data.msg,
	                        type: "success"
	                    });
	                    sessionStorage.removeItem('onTimeDataParam') ;
	                    let queryParma = {
	                            pk_org:this.pk_org,
	                            pk_wa_class:this.pk_wa_class,
	                            cyear:this.cyear,
	                            cperiod:this.cperiod
	                    };
                      	this.p_this.request();
                		this.handleClose();
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
      	changeEditStatus(){
       		 this.canEdit = !this.canEdit;
      	}
	}
}
</script>

<style>
	@import '/src/apps/common/css/pay.css';
    .ontimedetail .el-tabs>div{
        margin-left:0 !important;
        margin-bottom: 0 !important;
    }
    
    .ontimedetail .el-dialog .main-panel{
      padding:0px 24px 16px;
      background: white;
    }
   
    .ontimedetail .el-dialog__body{
    	padding-bottom: 0;
      height: 300px;
    }
    .ontimedetail .el-dialog__body .operator-container{
    	padding-left: 0;
    }
</style>