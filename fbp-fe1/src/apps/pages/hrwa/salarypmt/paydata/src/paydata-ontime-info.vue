
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="时点薪资"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary"   @click="allCaculate">全部计算</el-button>
      <el-button type="primary"   @click="showBatchEditDlg">批量修改</el-button>
      <!-- 查询模板组件 -->
      <ifbp-search class="fr"
                   :template-code="searchCode"
                   @search="handleSearch">
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- UI模板组件 :pk-temp="tablePk"  show-type="table"-->
      <ifbp-template ref="ref_wapsndoc_t"
                     tpl-id="ontimeinfo"

                     :tpl-data="tableData"

                     :tplResetFun="tableResetFun"
                     @edit-table-click="tableEditClick"
                     :methods="onTimeTableMethods">
      </ifbp-template>

      <el-dialog
              title="批量修改"
              :visible.sync="batchEditVisible"
              size="tiny">
        <div id="paydlg">
        <ifbp-template ref="ref_dlgdata_c"
                       tpl-id="ref_dlgdata_c"
                       :pk-temp="batchEditTempId"
                       :tpl-data="batchEditTempData"
                       show-type="form">
        </ifbp-template>
        </div>
        <span slot="footer" class="dialog-footer">
                              <el-button @click="batchEditVisible = false">取 消</el-button>
                              <el-button type="primary" @click="batchEditConfirm">确 定</el-button>
                           </span>
      </el-dialog>

    </ifbp-main-area>

  </ifbp-page>
</template>
<script>

    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

    export default {
        mixins :[pageModelMixin],
    data() {
      var pk_org=  this.$route.query.pk_org ;

      var pk_wa_class=  this.$route.query.pk_wa_class  ;

      var cyear=  this.$route.query.cyear  ;

      var cperiod =  this.$route.query.cperiod  ;

      var that = this;
      return {
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
                  sessionStorage.setItem('onTimeDataParam', JSON.stringify(scope.row));
                  that.goToDetail();
              }
         },

        pk_org :pk_org,
        pk_wa_class :pk_wa_class,
        cyear :cyear,
        cperiod : cperiod,

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
    created() {
      this.request();

    },
    methods: {
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
          "/hrwa/payData/payDataOnTime/pageList";
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
          sessionStorage.setItem('onTimeDataParam', JSON.stringify(scope.row));
          this.goToDetail();

      },
        goToDetail(){
            let queryParam = {
                pk_org :this.pk_org,
                pk_wa_class :this.pk_wa_class,
                cyear :this.cyear,
                cperiod : this.cperiod,
            };
            this.$router.push({path:"/hrwa/paydata/ontimedetail",query:queryParam});
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

            var url = "/hrwa/payData/payDataOnTime/calculate4List";
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
                        url: "/hrwa/payData/payDataOnTime/batchUpdate",
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
    }
  };
</script>
<style>
  @import '/src/apps/common/css/pay.css';
</style>
