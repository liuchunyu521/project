<template>
  <ifbp-page>
    <ifbp-breadcrumb name="薪资明细对比" v-show="false"></ifbp-breadcrumb>
    <ifbp-button-area :no-breadcrumb="true">
      <!--<el-button type="primary"   @click="exportData">导出</el-button>-->
      <!-- 查询模板组件 -->
      <ifbp-search class="fr"
                   :template-code="searchCode"
                   @search="handleSearch">
      </ifbp-search>
    </ifbp-button-area>
    <div class="list-main-container clearfix">
      <!-- UI模板组件 -->
      
      <div class="ifbp-btn-line" > 
	      <div class="fr">
	        <i class="ifbp-icon-setting marginleft16"  @click="showHeaderSetting" title="设置"></i>
	      	<!--<el-button type="text" class=" ifbp-layout-content-right-button marginleft24"  @click="exportData">导出</el-button>-->
	      </div>
	    </div>
      
      <ifbp-template ref="ref_paydata_d"
                     tpl-id="detailcompare"

                     :tpl-data="tableData"
										 :table-show-menu="false"
                     :tplResetFun="tableResetFun">
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
    </div>


  </ifbp-page>
</template>
<script>


    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

    export default {
        mixins :[pageModelMixin],
    data() {
        var that = this;

        var pk_org= this.$route.query.pk_org ;

        var pk_wa_class=this.$route.query.pk_wa_class  ;

        var cyear= this.$route.query.cyear  ;


        var cperiod = this.$route.query.cperiod  ;

        var dynamicColumn = sessionStorage.getItem('waDataDynamicColumn').split("||");

        var jsonDynamicColumns = [];

        for(var i=0;i<dynamicColumn.length;i++){
            var  aColumn = JSON.parse(dynamicColumn[i]);
            jsonDynamicColumns.push(aColumn);

        }


      return {
        // 查询模板传入参数
        searchTemplate: null,
        // UI模板传入参数
        tablePk: "0001AA1000000000KSHC",
          columns : jsonDynamicColumns,
        tableData:  {

        },

        tableResetFun: function($node) {
            var $table = this.getNodeById($node, "paydata_d");
          let colHTML = "";
            for(var i=0;i<that.columns.length;i++){
                var col = that.columns[i];

                colHTML+='<el-table-column render-type="'+col.renderType+'" align="left" header-align="left" prop="'+col.column+'" label="'
                    +col.label+'" width="150" format="'+col.format+'"   ';


                if(col.dataType == "number"){
                    colHTML+=' separator="," decimals="'+col.decimals+'" '
                }
                colHTML+= '></el-table-column>'
            }
            $table.append(colHTML);
            return $node[0].outerHTML;
        },

        // 分页组件传入参数
        totalElements: 0,
        currentPage: 1,
        size: 10,


        pk_org :pk_org,
        pk_wa_class : pk_wa_class,
        cyear : cyear,
        cperiod :cperiod,
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
          "/hrwa/salarymgt/payData/payData/detailCompare";
        this.$http({
          url: url,
          method: "post",
          data :{
            pn : pn,
            ps : ps,
            pk_wa_class :this.pk_wa_class,
            cyear : this.cyear,
            cperiod : this.cperiod,
            pk_org : this.pk_org,
          }
        })
          .then((res) => {

           if(res.data.status === true){
               this.$nextTick(() => {
                   var resData = res.data.data.content;
                   if(this.$refs.ref_paydata_d) {

                       this.$refs.ref_paydata_d.setData(
                           "paydata",
                           res.data.data.content
                       );
                       this.totalElements = res.data.data.totalElements;
                       this.size = res.data.data.size;
                       this.currentPage = res.data.data.number;
                   } else {
                       this.$set(this.tableData, 'uitemplateTableData', resData);
                   }
               });
           }else {
               this.$message({
                   message: res.data.msg,
                   type: "error"
               });
           }
          })
          .catch((e) => {
            this.$message({
              message: "信息获取失败",
              type: "error"
            });
          });
      },
			showHeaderSetting(){//设置显示列
      	this.$refs.ref_paydata_d.setTransferVisible(true);
      },
      handleSearch(){},

      // 跳转到添加地点页面
      exportData() {
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
    }
  };
</script>
<style>

</style>
