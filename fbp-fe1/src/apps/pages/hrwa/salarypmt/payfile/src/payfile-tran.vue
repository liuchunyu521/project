<!--
	作者：offline
	时间：2018-10-15
	描述：异动人员
-->
<template>
    <ifbp-page>
        <ifbp-breadcrumb name="异动人员"></ifbp-breadcrumb>
    <ifbp-button-area>
                  <span style="line-height: 32px;">查询期间：</span>
                    <div class="block" style="display: inline-block;">
                      <el-date-picker
                              v-model="begindateModel"
                        type="date"
                        placeholder="开始日期"
                        size="small"
                        @change="begindateChange"
                      :valuetoms="true">
                      </el-date-picker>
                    </div>
                    <div style="display: inline-block;width: 28px;color: #D2D2D7;font-size: 14px;text-align: center;">—</div>
                    <div class="block" style="display: inline-block;margin-right: 16px;">
                      <el-date-picker
                              v-model="enddateModel"
                        type="date"
                        placeholder="结束日期"
                        size="small"
                        @change = "endDateChange"
                              :valuetoms="true">
                      </el-date-picker>
                    </div>

                <el-button type="primary" @click="queryClick">查询</el-button>
                <el-button type="primary"   @click="tableAddClick"    v-show="showAddButton" :disabled="addDisabled">增加</el-button>
                <el-button type="primary"   @click="tableDeleteClick" v-show="showDeleteButton" :disabled="delDisabled">删除</el-button>





    </ifbp-button-area>

        <ifbp-main-area type="list" id="tran">

            <el-dialog
                    title="添加到发薪人员"
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



            <el-tabs   @tab-click="handleTabClick"  v-model="activeName">
              <el-tab-pane :label="alterAddTabLabel" name="alterAddTab">
                <alter_add ref="alterAdd"  :beginDate="beginDate"  :endDate="endDate" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @setTabLabel="setAlterAddTabLabel" @actionDisable="isActionDisabled"></alter_add>
              </el-tab-pane>

              <el-tab-pane :label="alterSubPsnTabLabel" name="alterSubPsnTab">
                <alter_sub ref="alterSub" :beginDate="beginDate"  :endDate="endDate"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @setTabLabel="setAlterSubPsnTabLabel" @actionDisable="isActionDisabled"></alter_sub>
              </el-tab-pane>

              <el-tab-pane :label="alterPartAddPsnTabLabel" name="alterPartAddPsnTab">
                <alter_part_add ref="alterPartAdd" :beginDate="beginDate"  :endDate="endDate" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"  @setTabLabel="setAlterPartAddPsnTabLabel" @actionDisable="isActionDisabled"></alter_part_add>
              </el-tab-pane>

              <el-tab-pane :label="alterPartSubPsnTabLabel" name="alterPartSubPsnTab">
                <alter_part_sub ref="alterPartSub" :beginDate="beginDate"  :endDate="endDate"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @setTabLabel="setAlterPartSubPsnTabLabel" @actionDisable="isActionDisabled"></alter_part_sub>
              </el-tab-pane>

              <el-tab-pane :label="alterModifyPsnTabLabel" name="alterModifyPsnTab">
                <alter_modify ref="alterModify" :beginDate="beginDate"  :endDate="endDate" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"  @setTabLabel="setAlterModifyPsnTabLabel" @actionDisable="isActionDisabled"></alter_modify>
              </el-tab-pane>
            </el-tabs>

        </ifbp-main-area>
    </ifbp-page>
</template>
<script>

  import alter_add  from './payfile-tran-add.vue';
  import alter_sub from './payfile-tran-sub.vue';
  import alter_part_add from './payfile-tran-partAdd.vue';
  import alter_part_sub  from './payfile-tran-partSub.vue';
  import alter_modify  from './payfile-tran-postMod.vue';


  import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
  export default {
      mixins :[pageModelMixin],
    components :{
      alter_add,
      alter_sub,
      alter_part_add,
      alter_part_sub,
      alter_modify
    },

    data() {
      var pk_org= this.$route.query.pk_org ;

      var pk_wa_class= this.$route.query.pk_wa_class  ;

      var cyear= this.$route.query.cyear  ;

      var cperiod = this.$route.query.cperiod  ;

      return {
        alterAddTabLabel : "新进人员",
        alterSubPsnTabLabel:"离职人员",
        alterPartAddPsnTabLabel:"兼职开始",
        alterPartSubPsnTabLabel:"兼职结束",
        alterModifyPsnTabLabel:"调配人员",

        enddateModel : '',
        begindateModel : '',
        activeName : "alterAddTab",
        beginDate :"",
        endDate : "",
        addDialogVisible : false,
//        delDialogVisible : false,
        showAddButton : true,
        showDeleteButton : false,

          addDisabled  :true,
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

        pk_org : pk_org,
        pk_wa_class:pk_wa_class,
        cyear:cyear,
        cperiod :cperiod
      }
    },
    mounted() {

     var setDefaultDate =  this.queryDateDefaultValue();
        this.initPromise(setDefaultDate);
    },

    methods:{
        initPromise(request) {
            Promise.all([request]).then(() => {
                if(!this.checkParam()){
                    return ;
                }
                this.queryTabShowCount();
                this.$refs['alterAdd'].request();
            });
        },
      checkParam(){
        if(!this.pk_org || !this.pk_wa_class|| !this.cyear || !this.cperiod){
          this.$message({
            message: "参数错误",
            type: "error"
          });
          return false ;
        }

          if(!this.begindateModel || !this.enddateModel){
              this.$message({
                  message: "开始日期和结束日期不能为空",
                  type: "error"
              });
                return false;
          }
        return true;
      },
        queryDateDefaultValue(){
            var url =  "/hrwa/payFile/psnController/queryStartEndDateValue";
            return    this.$http({
                url: url,
                method: "post",
                data: {
                    pk_org:this.pk_org,
                    pk_wa_class : this.pk_wa_class,
                    cyear : this.cyear,
                    cperiod : this.cperiod,
                }
            })
                .then((res) => {

                    if (res.data.status === true){

                        this.begindateModel = res.data.data.startdate;
                        this.enddateModel = res.data.data.enddate;
                        this.begindateChange( this.begindateModel);
                        this.endDateChange( this.enddateModel)
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }

                })
                .catch(() => {

                    this.$message({
                        message: "薪资期间错误",
                        type: "error"
                    });
                });
        },
        queryTabShowCount(){
            var url =  "/hrwa/payFile/psnController/queryAlterPsnCount";
            this.$http({
                url: url,
                method: "post",
                data: {
                    pk_org:this.pk_org,
                    begindate : this.beginDate,
                    enddate : this.endDate,
                    pk_wa_class : this.pk_wa_class,
                    cyear : this.cyear,
                    cperiod : this.cperiod,
                }
            })
                .then((res) => {

                    if (res.data.status === true){
                            this.alterAddTabLabel = "新进人员("+res.data.data.TRN_ADD+")",
                            this.alterSubPsnTabLabel = "离职人员("+res.data.data.TRN_SUB+")",
                            this.alterPartAddPsnTabLabel="兼职开始("+res.data.data.TRN_PART_ADD+")",
                            this.alterPartSubPsnTabLabel = "兼职结束("+res.data.data.TRN_PART_SUB+")",
                            this.alterModifyPsnTabLabel="调配人员("+res.data.data.TRN_POST_MOD+")";

                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }

                })
                .catch(() => {

                    this.$message({
                        message: "查询页签上显示数量失败",
                        type: "error"
                    });
                });
      },
      queryClick(){
        if(!this.checkParam()){
          return ;
        }
          this.queryTabShowCount();
        if(this.activeName== "alterAddTab"){

          this.$refs['alterAdd'].request();
        }else if(this.activeName == "alterSubPsnTab"){

          this.$refs['alterSub'].request();
        }else if(this.activeName == "alterPartAddPsnTab"){

          this.$refs['alterPartAdd'].request();
        }else if(this.activeName == "alterPartSubPsnTab"){

          this.$refs['alterPartSub'].request();
        }else if(this.activeName == "alterModifyPsnTab"){

          this.$refs['alterModify'].request();
        }
      },
      endDateChange(enddate){
          Date.prototype.toLocaleString = function() {
              let month = this.getMonth() + 1;
              if(month<10){
                  month = "0"+month;
              }

              let date = this.getDate();
              if(date<10){
                  date = "0"+date;
              }
              return this.getFullYear() + "-" + month + "-" + date ;
          };
          this.endDate = new Date(enddate).toLocaleString();

//        this.endDate = enddate;
      },
      begindateChange(begindate){
          Date.prototype.toLocaleString = function() {
              let month = this.getMonth() + 1;
              if(month<10){
                  month = "0"+month;
              }

              let date = this.getDate();
              if(date<10){
                  date = "0"+date;
              }
              return this.getFullYear() + "-" + month + "-" + date ;
          };
          this.beginDate = new Date(begindate).toLocaleString();

//          this.beginDate = begindate;
      },
      setAlterAddTabLabel(name){this.alterAddTabLabel=name;},
      setAlterSubPsnTabLabel(name){this.alterSubPsnTabLabel = name;},
      setAlterPartAddPsnTabLabel(name){this.alterPartAddPsnTabLabel = name;},
      setAlterPartSubPsnTabLabel(name){this.alterPartSubPsnTabLabel =name; },
      setAlterModifyPsnTabLabel(name){this.alterModifyPsnTabLabel = name;},
        isActionDisabled(disable){
          if(this.activeName == "alterAddTab" || this.activeName == "alterPartAddPsnTab" ){
                this.addDisabled = disable;
          }else{
                this.delDisabled = disable;
          }
        },
      handleTabClick(tab, event){
            if(!this.checkParam()){
              return ;
            }
         this.  addDisabled  = true;
            this.delDisabled = true;
           if(tab.name == "alterAddTab"){

            this.$refs['alterAdd'].request();
            this.showAddButton= true;
            this.showDeleteButton = false;
          }else if(tab.name == "alterSubPsnTab"){

             this.$refs['alterSub'].request();
             this.showAddButton= false;
             this.showDeleteButton = true;
          }else if(tab.name == "alterPartAddPsnTab"){

            this.$refs['alterPartAdd'].request();
            this.showAddButton= true;
            this.showDeleteButton = false;

          }else if(tab.name == "alterPartSubPsnTab"){

             this.$refs['alterPartSub'].request();
             this.showAddButton= false;
             this.showDeleteButton = true;
          }else if(tab.name == "alterModifyPsnTab"){

             this.$refs['alterModify'].request();
             this.showAddButton= false;
             this.showDeleteButton = true;
          }
      },

      getCurrentRef(){
        var ref ;
        if(this.activeName == "alterAddTab"){

          ref = this.$refs['alterAdd'];
         // this.addDialogVisible = true;
        }else if(this.activeName == "alterSubPsnTab"){

          ref = this.$refs['alterSub'];
        }else if(this.activeName == "alterPartAddPsnTab"){

          ref = this.$refs['alterPartAdd'];
        //   this.addDialogVisible = true;
        }else if(this.activeName == "alterPartSubPsnTab"){

          ref = this.$refs['alterPartSub'];
        }else if(this.activeName == "alterModifyPsnTab"){

          ref = this.$refs['alterModify'];
        }
        return ref;
      },
      tableAddClick(){
        var ref = this.getCurrentRef();
       var data =  ref.operationButtonClick();
       if(data.length ==0){
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
        var ref = this.getCurrentRef();
          var data =   ref.operationButtonClick();
          if(data.length ==0){
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
//        this.delDialogVisible = true;
      },
      addDialogConfirm(){
        var ref = this.getCurrentRef();
        var addDatas = ref.getSelectedData();

        this.$refs.ref_addTaxRateDlg.validate(valid => {
          if (valid) {
            var data = this.$refs.ref_addTaxRateDlg.getData("payfile");
            var taxType = data.taxtype;
            var taxRate = data.taxtableid;

            this.$http({
              url: "/hrwa/payFile/psnController/addAlterPsn",
              method: "post",
              data: {
                data : addDatas ,
                pk_org : this.pk_org,
                pk_wa_class : this.pk_wa_class,
                cyear : this.cyear,
                cperiod :this.cperiod,
                taxtype :taxType,
                taxtableid : taxRate
              }
            })
              .then(res => {

                if (res.data.status === true) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  ref.request();
                  this.addDialogVisible = false;
                } else {
                  this.addDialogVisible = false;
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
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
        var ref = this.getCurrentRef();
        var delDatas = ref.getSelectedData();


        this.$http({
          url: "/hrwa/payFile/psnController/deleteAlterPsn",
          method: "post",
          data: {
            data :   delDatas,
            pk_org:this.pk_org,
            pk_wa_class : this.pk_wa_class,
            cyear : this.cyear,
            cperiod :this.cperiod,
          }
        })
          .then(res => {

            if (res.data.status === true) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });

              ref.request();
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

//        this.delDialogVisible = false;
      }
    }
  }
  </script>
<style>
    @import '/src/apps/common/css/pay.css';
    #tran .el-tabs>div{
        margin-left:0 !important;
        margin-bottom: 0 !important;
    }
</style>