<template>
	<div>
	<el-dialog
		  class="psnrule"
		  title="规则检查"
		  :visible="dialogVisible"
		  size="large"
		  :before-close="handleClose"
		  @open="openDialog">
		  <span>
		    	<!-- 主体区域 -->
			    <el-dialog
                    title="扣税规则设置"
                    :visible.sync="addDialogVisible"
                    size="tiny">
	                <div id="paydlg">
	                         <ifbp-template ref="ref_addTaxRateDlg"
	                               tpl-id="ref_addTaxRateDlg"
	                               :pk-temp="addTaxRateDlgId"
	                               :tpl-data="addTaxRateDlgData"
	                               show-type="form">
	                     </ifbp-template>
	                </div>
                	<span slot="footer" class="dialog-footer">
	                      <el-button @click="addDialogVisible = false">取 消</el-button>
	                      <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
                   </span>
            	</el-dialog>	
	            <div class="byrule">
	            	<el-tabs  @tab-click="handleClick"  v-model="activeName" style="margin-top: -10px">
				        <el-tab-pane :label="addPsnTabLabel" name="newAddedPsnTab">
				          <newAddedPsn ref="newAddedPsnRef" @setTabLabel="setAddPsnTabLabel"  @setIsAllPageSelect="setIsAllPageSelect" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @actionDisable="isActionDisabled"></newAddedPsn>
				        </el-tab-pane>
				
				        <el-tab-pane :label="illegalPsnTabLabel" name="illgalPsnTab">
				          <illegalPsn ref="ilegalPsnRef"  @setTabLabel="setIllegalTabLabel" @setIsAllPageSelect="setIsAllPageSelect"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @actionDisable="isActionDisabled"></illegalPsn>
				        </el-tab-pane>
	      			</el-tabs>
	      		</div>
		  </span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="tableAddClick" v-show="showAddButton">加入发薪人员</el-button>
		    <el-button type="primary" @click="tableDeleteClick" v-show="showDeleteButton">删除发薪人员</el-button>
		  </span>
		</el-dialog>
		</div>
</template>

<script>
	import illegalPsn from './payfile-notInrulePsn.vue';
  import newAddedPsn from './payfile-newAddedPsn.vue';

  import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
  export default {
      mixins :[pageModelMixin],
      props :['pk_org','pk_wa_class','cyear','cperiod'],
    components :{
      illegalPsn,
      newAddedPsn
    },
    data() {

      /*var pk_org= this.$route.query.pk_org ;
      var pk_wa_class= this.$route.query.pk_wa_class  ;
      var cyear= this.$route.query.cyear  ;
      var cperiod = this.$route.query.cperiod  ;*/

      return {
      	//    	测试begin
		/*pk_org:'0001A910000000000B9V',
		pk_wa_class:'1001A910000000000804',
		cyear:'2018',
		cperiod:'04',*/
		//		测试over
		
      	dialogVisible:false,
        addPsnTabLabel: "新进人员",
        illegalPsnTabLabel : "不符合计薪规则的人员",
        activeName : "newAddedPsnTab",
        showAddButton : true,
        showDeleteButton : false,
          addDisabled : true,
          delDisabled:true,
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
        addDialogVisible : false,
//        delDialogVisible : false,


        /*pk_org : pk_org,
        pk_wa_class:pk_wa_class,
        cyear:cyear,
        cperiod :cperiod,*/

          searchCode:'',
		isAllPageSelect :false,
      };
    },
    mounted() {
      /*if(!this.checkParam()){
          return ;
      }
       this.queryTabShowCount();
      this.$refs['newAddedPsnRef'].request();*/
    },

    methods: {
    	show(){
    		this.dialogVisible = true;
        },
        handleClose(){
        	this.dialogVisible = false;
        },
        openDialog(){
    		if(!this.checkParam()){
	          	return ;
	      	}
	        this.queryTabShowCount();
	        //this.$refs['newAddedPsnRef'].request();
        },
        queryTabShowCount(){
            var url =  "/hrwa/salarymgt/payData/payFile/queryRuleTabDataCount";
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

                    if (res.data.status === true){

                        this.addPsnTabLabel = "新进人员("+res.data.data.newAddedCount+")";
                        this.illegalPsnTabLabel = "不符合计薪规则的人员("+res.data.data.ilegalCount+")";
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
      setAddPsnTabLabel(name){
            this.addPsnTabLabel = name;
      },
      setIllegalTabLabel(name){
            this.illegalPsnTabLabel = name;
      },
      handleClick(tab, event){
        if(!this.checkParam()){
          return ;
        }
          this.  addDisabled  = true;
          this.delDisabled = true;

        if(tab.name == "newAddedPsnTab"){
		  this.$refs['newAddedPsnRef'].setCheckedallValue(false);
          this.$refs['newAddedPsnRef'].request();
          this.showAddButton = true;
          this.showDeleteButton= false;
        }else if(tab.name == "illgalPsnTab"){
    	  this.$refs['ilegalPsnRef'].setCheckedallValue(false);
          this.$refs['ilegalPsnRef'].request();
          this.showAddButton = false;
          this.showDeleteButton= true;
        }
      },
      tableAddClick(){
        let data = this.$refs['newAddedPsnRef'].operationButtonClick();
         
        if(data.length == 0 && this.isAllPageSelect == false){
            this.$message({
                message: "请选择数据再操作",
                type: "error"
            });
            return ;
        }
          this.addTaxRateDlgData.taxrateparam.pk_org = this.pk_org;
        this.addDialogVisible = true;
      },
      tableDeleteClick(){
       var data = this.$refs['ilegalPsnRef'].operationButtonClick();
          if(data.length == 0 && this.isAllPageSelect == false ){
              this.$message({
                  message: "请选择数据再操作",
                  type: "error"
              });
              return ;
          }else{
              this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  closeOnClickModal:false,

                  type: 'warning'
              }).then(() => {
                  this.delDialogConfirm();
              }).catch(() => {
                  // 这里加取消逻辑
              });
          }
      },
      checkParam(){
        if(!this.pk_org || !this.pk_wa_class|| !this.cyear || !this.cperiod){
          this.$message({
            message: "参数错误",
            type: "error"
          });
          return false ;
        }
        return true;
      },
        isActionDisabled(disable){
            if(this.activeName  == "newAddedPsnTab" ){
                this.addDisabled = disable;
            }else{
                this.delDisabled = disable;
            }
        },
        handleSearch(){},
        setIsAllPageSelect(isAllPageSelect){
        	this.isAllPageSelect  = isAllPageSelect;
        },
      addDialogConfirm(){
          var addDatas = this.$refs['newAddedPsnRef'].getSelectedData();
        this.$refs.ref_addTaxRateDlg.validate(valid => {
          if (valid) {
            var data = this.$refs.ref_addTaxRateDlg.getData("payfile");
            var taxType = data.taxtype;
            var taxRate = data.taxtableid;

            this.$http({
              url: "/hrwa/salarymgt/payData/psnController/addAlterPsn",
              method: "post",
              data: {
                data : addDatas ,
                pk_org : this.pk_org,
                pk_wa_class : this.pk_wa_class,
                cyear : this.cyear,
                cperiod :this.cperiod,
                taxtype :taxType,
                taxtableid : taxRate,
                isAll : this.isAllPageSelect,
                searchTemplate:{},
                transType : 'RULE_NEW_ADD'
              }
            })
              .then(res => {

                if (res.data.status === true) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });

                  this.$refs['newAddedPsnRef'].request();
                  this.addDialogVisible = false;
                } else {
                  this.addDialogVisible = false;
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
                this.dialogVisible = false;
                this.$emit("psnbyrule");
              })
              .catch(() => {
                this.addDialogVisible = false;
                this.$message({
                  message: "操作失败",
                  type: "error"
                });
              });


          }
        });
      },
      delDialogConfirm(){

        var delDatas =    this.$refs['ilegalPsnRef'].getSelectedData();

        this.$http({
          url: "/hrwa/salarymgt/payData/psnController/deleteAlterPsn",
          method: "post",
          data: {
              data :   delDatas,
              pk_org:this.pk_org,
              pk_wa_class : this.pk_wa_class,
              cyear : this.cyear,
              cperiod :this.cperiod,
              transType : 'RULE_NEW_OFF',
              isAll : this.isAllPageSelect,
              searchTemplate:{},
              
          }
        })
          .then(res => {

            if (res.data.status === true) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });

              this.$refs['ilegalPsnRef'].request();
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

          //this.delDialogVisible = false;
      }
    }
  };
</script>

<style>
	@import '/src/apps/common/css/pay.css';
    .psnrule .el-tabs>div{
        margin-left:0 !important;
        margin-bottom: 0 !important;
    }
    .psnrule .el-pagination{
    	padding: 0;
    }
    .byrule .el-table__body-wrapper{
    	height: 250px;
    	overflow: scroll;
    }
    .psnrule .el-dialog{
    	max-height: none;
    }
    .psnrule .el-dialog__body{
    	padding-bottom: 0;
    }
</style>
