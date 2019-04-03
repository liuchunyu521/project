
<template>
	<div>
	<el-dialog
      class="adjustinfo" 
		  title="个别调整列表"
		  :visible.sync="dialogVisible"
		  size="large"
		  :before-close="handleClose"
		  @open="openDialog"
      >
  <ifbp-page>
    <!-- 节点title -->
    <!-- <ifbp-breadcrumb name="个别调整列表" v-show="false"></ifbp-breadcrumb> -->
    <!-- 按钮区域 -->
    <!-- <ifbp-button-area :no-breadcrumb="true"> -->
      <!-- 查询模板组件 -->
      <!-- <ifbp-search class="fr"
                   :template-code="searchCode"
                   @search="handleSearch">
      </ifbp-search>
    </ifbp-button-area> -->
    <!-- 主体区域 -->
     <ifbp-main-area type="list"> 
    	 <div class="ifbp-btn-line" > 
	      <div class="fr">
          <!-- <el-button type="text" class=" ifbp-layout-content-right-button marginleft24"  @click="dialogVisible = false">取 消</el-button> -->
	      	<el-button type="text" class=" ifbp-layout-content-right-button marginleft24"   @click="add">新增</el-button>
      		<!-- <el-button type="text" class=" ifbp-layout-content-right-button marginleft24"  @click="multiDeleteDialgShow" v-if="showDeleteButton">删除</el-button> -->
	      </div>
	     </div> 
      <!-- UI模板组件  :pk-temp="tablePk"      show-type="table" -->
      <ifbp-template ref="ref_datas_t"
                     tpl-id="adjusttable"
                     :tpl-data="tableData"
										 :table-show-menu='false'
                     :tplResetFun="tableResetFun"
                     @edit-table-click="tableEditClick"
                     @delete-table-click="tableDeleteClick">
      </ifbp-template>
      <!--分页组件-->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination> -->
      <paydataAdjustdetaildlg ref="paydataAdjustdetaildlg" :pk_wa_datas="pk_wa_datas"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" ></paydataAdjustdetaildlg> 
     </ifbp-main-area> 
    <!-- <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="add">新增</el-button>
		    <el-button type="primary" >删除</el-button>
		  </div > -->
  </ifbp-page>
  		</el-dialog>
		</div>
</template>
<script>

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import paydataAdjustdetaildlg from './paydata-adjust-detail-dlg.vue';

export default {
  mixins: [pageModelMixin],
  components: {paydataAdjustdetaildlg },
  props: ['pk_org', 'pk_wa_class', 'cyear', 'cperiod'],
  data() {
    // var pk_org=  this.$route.query.pk_org ;
    // var pk_wa_class=  this.$route.query.pk_wa_class  ;
    // var cyear=  this.$route.query.cyear  ;
    // var cperiod =  this.$route.query.cperiod  ;

    return {
      pk_wa_datas:null,
      dialogVisible: false,
      // 查询模板传入参数
      searchTemplate: null,
      // UI模板传入参数
      tablePk: "0001AA1000000000CVTZ",
      tableData: {},
      tableResetFun: function ($node) {
        var $table = this.getNodeById($node, "datas_l");

        let valueCode = $node.find("[prop='value']");
        let caculateCode = $node.find("[prop='caculatevalue']");
        valueCode.attr('render-type', 'default');
        caculateCode.attr('render-type', 'default');
        valueCode.html(
          '<template scope="scope">'
          + '<el-number :decimals="scope.row.iflddecimal"  v-model="scope.row.value" :editable="false"> </el-number>'
          + '</template> '
        );
        caculateCode.html(
          '<template scope="scope">'
          + '<el-number :decimals="scope.row.iflddecimal"  v-model="scope.row.caculatevalue" :editable="false"> </el-number>'
          + '</template> '
        );

        var operateHtml = this.getBaseTableOperateHtml();
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      // 是否显示批量删除按钮
      showDeleteButton: false,
      // 是否显示删除dialog
      //        delDialogVisible: false,
      //        multiDelDialogVisible: false,

      // pk_org :pk_org,
      // pk_wa_class :pk_wa_class,
      // cyear :cyear,
      // cperiod : cperiod,

      searchCode: '',


    };
  },
  created() {
    // this.request();

  },
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
    // 请求数据
    request(n, s) {

      var pn = 1;
      var ps = 10;

      if (n) {
        pn = n;
      }
      if (s) {
        ps = s;
      }
      var url =
        "/hrwa/salarymgt/payData/payDatas/queryAdjustInfo";
      this.$http({
        url: url,
        method: "post",
        data: {
          pn: pn,
          ps: ps,
          pk_wa_class: this.pk_wa_class,
          pk_org: this.pk_org,
          cyear: this.cyear,
          cperiod: this.cperiod
        }
      })
        .then((res) => {
          
          this.$refs.ref_datas_t.setData(
            "datas_t",
            res.data.data.content
          );

          this.totalElements = res.data.data.totalElements;
          this.size = res.data.data.size;
          //alert(res.data.data.number);
          this.currentPage = res.data.data.number;

        })
        .catch(() => {

          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },

    handleSearch() { },
    // table行的编辑操作
    tableEditClick(scope) {
      this.pk_wa_datas = scope.row.pk_wa_datas
      this.$refs.paydataAdjustdetaildlg.show(this);
      // var queryParma = {
      //   id: scope.row.pk_wa_datas,
      //   pk_org: this.pk_org,
      //   pk_wa_class: this.pk_wa_class,
      //   cyear: this.cyear,
      //   cperiod: this.cperiod
      // };
      // this.$router.push({ path: "/hrwa/paydata/paydataAdjustdetail", query: queryParma });
    },
    // table行的删除操作
    tableDeleteClick(scope) {
      //        this.delDialogVisible = true;


      this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,

        type: 'warning'
      }).then(() => {
        // 这里是以前的删除的逻辑
        this.delData = scope.row;
        this.deleteClick();
      }).catch(() => {
        // 这里加取消逻辑
      });

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
    add() {
      // let param = {
      //   pk_org: this.pk_org,
      //   pk_wa_class: this.pk_wa_class,
      //   cyear: this.cyear,
      //   cperiod: this.cperiod
      // };
      // this.$router.push({ path: "/hrwa/paydata/paydataAdjustdetail", query: param });
      this.pk_wa_datas = null
      this.$refs.paydataAdjustdetaildlg.show(this);
    },

    // 批量删除点击处理
    multiDeleteDialgShow() {
      //        this.multiDelDialogVisible = true;
      this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,

        type: 'warning'
      }).then(() => {
        // 这里是以前的删除的逻辑
        this.multiDeleteClick();
      }).catch(() => {
        // 这里加取消逻辑
      });


    },

    // 查询区点击搜索后的处理
    advancedSearch(searchTemplate) {
      console.log("search triggered", searchTemplate);
    },

    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.request(1, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.request(val, this.size);
    },
    showHeaderSetting() {//设置显示列
      this.$refs.ref_datas_t.setTransferVisible(true);
    },
    // 删除处理
    deleteClick() {

      //        this.delDialogVisible = false;

      this.$http({
        url: "/hrwa/salarymgt/payData/payDatas/delete",
        method: "post",
        data: {
          pk_wa_class: this.pk_wa_class,
          pk_org: this.pk_org,
          cyear: this.cyear,
          cperiod: this.cperiod,
          uivo: JSON.stringify(this.delData),
        }


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

    // 批量删除处理
    multiDeleteClick() {

      var tableSelections = this.$refs.ref_datas_t.comp.$refs.ref_datas_t.getSelection();
      var delDatas = [];
      if (tableSelections && tableSelections.length > 0) {
        for (var i = 0; i < tableSelections.length; i++) {
          var row = tableSelections[i];
          delDatas.push(row);
        }
      }


      this.$http({
        url: "/hrwa/salarymgt/payData/payDatas/multiDelete",
        method: "post",
        data: {
          pk_wa_class: this.pk_wa_class,
          pk_org: this.pk_org,
          cyear: this.cyear,
          cperiod: this.cperiod,
          uivos: JSON.stringify(delDatas)
        }
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

      //        this.multiDelDialogVisible = false;
    }
  }
};
</script>
<style>
	@import '/src/apps/common/css/pay.css';
    .adjustinfo .el-tabs>div{
        margin-left:0 !important;
        margin-bottom: 0 !important;
    }
    .yidong .el-table__body-wrapper{
    	height: 250px;
    	overflow: scroll;
    }
    .adjustinfo .el-dialog{
    	/* max-height: none; */
      height: 80%;
    }
    .adjustinfo .el-dialog .main-panel{
      padding:0px 24px 16px;
      background: white;
    }
    .adjustinfo .el-dialog__body{
    	padding-bottom: 0;
      height: 80%;
    }
    .adjustinfo .el-dialog__body .el-table__header{
      width: 100%
    }
    .adjustinfo .el-dialog__body .operator-container{
    	padding-left: 0;
    }
</style>
