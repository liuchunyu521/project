<!--
	作者：offline
	时间：2018-10-15
	描述：发薪人员列表
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="发薪人员"></ifbp-breadcrumb>
    <ifbp-button-area>


        <el-button type="primary"   @click="addPayFile" v-if="isActionEnable" >新增</el-button>
        <el-button @click="transPsn"  v-if="isActionEnable">异动人员</el-button>
        <el-button @click="ruleCheck" v-if="isActionEnable">规则检查</el-button>

      <div style="display:inline-block;"  v-else   >
        <span class="tip-content"> <div class="maohao">!</div>当前方案已经审核,不能维护发薪人员</span>
      </div>

      <!-- 查询模板组件 -->
      <ifbp-search class="fr"
                   ref="testSetOption"
                   :template-code="tplCode"
                   :search-on-select="true"
                   @search="advancedSearch"
                    @select="periodSelect"

                    @ready="setQueryCondition">
      </ifbp-search>
    </ifbp-button-area>


    <!-- 主体区域 -->
    <ifbp-main-area type="list">

      <div style="margin-bottom: 16px;font-size:14px;height: 16px">
      	<span style="margin-right: 40px;">方案组织：{{orgname }}</span>
      	<span style="margin-right: 40px;">薪资方案：{{classname }}</span>
      	<span style="margin-right: 40px;">发薪时间：{{cyear}}年{{cperiod}}月</span>
      	<span style="margin-right: 40px;">发薪状态：{{datastate}}</span>
      </div>
      <!-- UI模板组件  :pk-temp="tablePk"-->
      <ifbp-template ref="ref_payfile_t"
                     tpl-id="payFileInfo"

                     :tpl-data="tableData"

                     :tplResetFun="tableResetFun"
                     :methods="TableMethods"
                     @selection-change="selectionChange"
                     @edit-table-click="tableEditClick"
                     @delete-table-click="tableDeleteClick">
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


  </ifbp-page>
</template>
<script>


    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins :[pageModelMixin],
    data() {
        var pk_org= this.$route.query.pk_org ;

        var pk_wa_class= this.$route.query.pk_wa_class  ;

        var cyear= this.$route.query.cyear  ;


        var cperiod = this.$route.query.cperiod  ;

        var orgname = this.$route.query.orgname;

        var classname = this.$route.query.classname;

//        var datastate =   this.$route.query.datastate;
        var vm = this;
      return {


        // UI模板传入参数
//        tablePk: "0001AA10000000015TEX",
        tableData: {},
        tableResetFun: function($node) {

        // var $table = this.getNodeById($node, "payfile_l");
            var $table = this.getTableDom($node);
            $table.attr(':show-header', 'true');
            $table.attr('v-on:row-dblclick', 'waclassDbClick');
            //icon隐藏
            var operateArr = [{
                title: '编辑',
                icon: 'edit',
                vif: "scope.row.checkflag != true"
            }, {
                title: '删除',
                icon: 'delete',
                vif: "scope.row.checkflag != true"
            }];
          // 人员编码详情
            let psncode = $node.find("[prop='psncode']");
            psncode.html(
                '<template scope="scope">' +
                '<a href="javascript:void(0);" @click="wacalssNameClick(scope)">{{scope.row.psncode}}</a>' +
                '</template>'
            );
            var operateHtml = this.getTableOperateHtml(operateArr);
          $table.append(operateHtml);
          return $node[0].outerHTML;



        },

        //详情
        TableMethods: {
            wacalssNameClick(scope) {
                vm.$router.push("/hrwa/payFile/payFileDetail/" + scope.row.pk_wa_data + "/" + false);
            },

            waclassDbClick(row){
                vm.$router.push("/hrwa/payFile/payFileDetail/"+ row.pk_wa_data + "/" + false );

            },
        },


        // 分页组件传入参数
        totalElements: 0,
        currentPage: 1,
        size: 10,
        // 是否显示批量删除按钮
        showDeleteButton: false,
        // 是否显示删除dialog

        pk_org : pk_org,
        pk_wa_class : pk_wa_class,
        cyear :cyear,
        cperiod :cperiod,
        isActionEnable : true,

          orgname : orgname,
          classname:classname,
          datastate :'',
          caculateCount : '',
          checkCount:'',

          tplCode:'60130payfilelist',
          searchTemplate: {},
          periodCondition:''
      };
    },
    created() {


      this.request();

    },
    methods: {
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
                "/hrwa/payFile/pageList";
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
                data:this.searchTemplate
            })
                .then((res) => {
                    if(res.data.status === true){
                        this.$refs.ref_payfile_t.setData(
                            "payfile_t",
                            res.data.data.content
                        );

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
          "/hrwa/payFile/isActionEnableAndPsnCount";
        this.$http({
           url: url,
           method: "post",
           params :{
             pk_wa_class :this.pk_wa_class,
             cyear : this.cyear,
             cperiod : this.cperiod,
             pk_org : this.pk_org
            },
            data:this.searchTemplate
        })
          .then((res) => {
              if(res.data.status === true){
                  let result = res.data.data.actionstate;
//                  this.periodCondition = res.data.data.periodcondition;
                  this.datastate = res.data.data.datastate;
                  if(result == 'y' || result == 'Y'){
                      this.isActionEnable = true;
                  }else{
                      this.isActionEnable = false;
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
            this.$message({
              message: "信息获取失败",
              type: "error"
            });
          });
      },
        setQueryCondition(){

            let url ="/hrwa/payFile/queryPeriod";
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
        transPsn(){
            var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
            this.$router.push({path:"/hrwa/payFile/tranPsn", query:queryParma}) ;

        },
        ruleCheck(){
            let url ="/hrwa/payFile/hasRangRule/"+this.pk_wa_class;
            this.$http({
                url: url,
                method: "GET",
               
            }).then((res) => {
                if(res.data.status === true){
                    if(res.data.data){
                        var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
                        this.$router.push({path:"/hrwa/payFile/opByRule", query:queryParma}) ;
                    }else{
                         this.$alert('该方案未设置计薪规则，无法进行规则检查。如需设置，请在【薪资管理】-【薪资方案】中进行调整', '提示', {
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
          if( this.isCanEdit(scope.row)){
              this.$router.push("/hrwa/payFile/payFileDetail/" + scope.row.pk_wa_data + "/" + true);
          }else{
            this.$message({
              message: "已审核的数据不能编辑",
              type: "error"
            });
          }

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
          var queryParma = { pk_org:this.pk_org,pk_wa_class:this.pk_wa_class,cyear:this.cyear,cperiod:this.cperiod };
          this.$router.push({path:"/hrwa/payFile/batchAddPsn", query:queryParma}) ;
      },

      // 批量删除点击处理
      multiDeleteDialgShow() {
          this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal:false,

              type: 'warning'
          }).then(() => {
              // 这里是以前的删除的逻辑
                this.multiDelDialogClick();
          }).catch(() => {
              // 这里加取消逻辑
          });
      },


      // 翻页标签改变每页显示数据
      handleSizeChange(val) {
        this.request(1, val);
      },

      // 翻页标签改变当前页
      handleCurrentChange(val) {
        this.request(val, this.size);
      },

      // 删除处理
      singleDelDialogClick() {


        this.$http({
          url: "/hrwa/payFile/delete",
          method: "post",
          data: JSON.parse(JSON.stringify(this.delData))
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
              message: "删除失败",
              type: "error"
            });
          });
      },
        advancedSearch(searchTemplate){
            this.searchTemplate = searchTemplate;
            this.request();
        },
        periodSelect(template,condition,option){
            if(condition.fieldcode == "period" && option){
                this.cyear = option.value.substr(0,4);
                this.cperiod = option.value.substring(4);
            }
            this.searchTemplate = template;
            this.request();
        },
      // 批量删除处理
      multiDelDialogClick() {

        var tableSelections = this.$refs.ref_payfile_t.comp.$refs.ref_payfile_t.getSelection();
        var delDatas = [];
        if (tableSelections && tableSelections.length > 0) {
          for (var i = 0; i < tableSelections.length; i++) {
            var row = tableSelections[i];
             delDatas.push(row);
          }
        }


        this.$http({
          url: "/hrwa/payFile/multiDelete",
          method: "post",
          data: JSON.parse(JSON.stringify(delDatas))
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
              message: "删除失败",
              type: "error"
            });
          });

      }
    }
  };
</script>
<style>
  .tip-content {
    margin-top: 9px;
    margin-left: 8px;
    font-size: 14px;
    box-sizing: border-box;
    color: #333333;
    line-height: 14px;
  }
  .maohao {
    display: inline-block;
    margin-top: 9px;
    text-align: center;
    border: 1px solid #F3383F;
    color: #F3383F;
    background: #FFE2E2;
    line-height: 12px;
    font-size: 12px;
    width: 14px;
    box-sizing: border-box;
    font-weight: 900;
    border-radius: 14px;
    -moz-border-radius: 14px;
  }
</style>
