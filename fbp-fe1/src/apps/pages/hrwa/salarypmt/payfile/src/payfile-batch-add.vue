<!--
	作者：offline
	时间：2018-10-15
	描述：添加发薪人员
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="新增发薪人员"></ifbp-breadcrumb>

    <ifbp-button-area>
      <el-button type="primary"   @click="addPayFile">加入发薪人员</el-button>
      <!-- 查询模板组件 -->
      <ifbp-search class="fr"
                   :template-code="tplCode"
                   @search="advancedSearch">
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- UI模板组件  :pk-temp="tablePk"-->
      <ifbp-template ref="ref_batch_add"
                     tpl-id="payFileBatchAddPsn"
                     :tpl-data="tableData">
      </ifbp-template>

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

            return {
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

                pk_org : pk_org,
                pk_wa_class : pk_wa_class,
                cyear : cyear,
                cperiod : cperiod,

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
                    "/hrwa/payFile/psnController/qryBatchAddPsn";
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

                        this.$refs.ref_batch_add.setData(
                            "hi_psnjob_t",
                            res.data.data.content
                        );

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

                var tableSelections = this.$refs.ref_batch_add.comp.$refs.ref_batch_add.getSelection();
                var addDatas = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        addDatas.push(row);
                    }
                }

                if(addDatas.length == 0){
                    this.$message({
                        message: "请选择数据",
                        type: "error"
                    });
                    return ;
                }

                this.addDatas = addDatas;

                this.addTaxRateDlgData.taxrateparam.pk_org = addDatas[0].pk_org;
                this.addDialogVisible = true;
            },

            addDialogConfirm(){
                this.$refs.ref_addTaxRateDlg.validate(valid => {
                    if (valid) {
                        var data = this.$refs.ref_addTaxRateDlg.getData("payfile");
                        var taxType = data.taxtype;
                        var taxRate = data.taxtableid;

                        this.$http({
                            url: "/hrwa/payFile/psnController/addAlterPsn",
                            method: "post",
                            data: {
                                data : this.addDatas ,
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
                                    this.request();
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

<stype>
  @import '/src/apps/common/css/pay.css';
</stype>