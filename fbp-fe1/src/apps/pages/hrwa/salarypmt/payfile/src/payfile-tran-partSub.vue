<!--
	作者：offline
	时间：2018-10-15
	描述：异动-兼职结束
-->
<template>
    <div>
        <!--:pk-temp="subPsnTempId"-->
      <ifbp-template ref="ref_alter_partout"
                     tpl-id="partout"

                     :tpl-data="subPsnData"
                      >
      </ifbp-template>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>

    </div>
</template>
<script>


  export default {
    props :['pk_org','pk_wa_class','cyear','cperiod','beginDate','endDate'],
    data() {

      return {

        subPsnTempId: "0001AA1000000000ONRB",
        subPsnData: {
        },
        currentPage :1,
        pageSize   :1,
        totalElements :0,
      };
    },

    methods: {

      // 请求数据
      request(n, s) {

        if(!this.beginDate || !this.endDate){
          return ;
        }
        var pn = 1;
        var ps =10;

        if(n){
          pn = n;
        }
        if(s){
          ps = s;
        }
        var url =
          "/hrwa/payFile/psnController/queryAlterPsn";

        this.$http({
          url: url,
          method: "post",
          data :{
            pk_org:this.pk_org,
            trnType:"TRN_PART_SUB",
            begindate : this.beginDate,
            enddate : this.endDate,
            pk_wa_class : this.pk_wa_class,
            cyear : this.cyear,
            cperiod : this.cperiod,
            pn : pn,
            ps : ps
          }
        })
          .then(res => {
            if (res.data.status === true) {

              var originalValue = res.data.data.content;

              this.currentPage = res.data.data.number;
              this.pageSize = res.data.data.size;
              this.totalElements = res.data.data.totalElements;
              this.$emit("setTabLabel","兼职结束("+ this.totalElements+")");
                this.$emit("actionDisable",this.totalElements==0);
              this.$refs.ref_alter_partout.setData(
                "hi_psnjob_t",
                JSON.parse(JSON.stringify(originalValue))
              );
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.$emit("setTabLabel","兼职结束(0)");
            }
          })
          .catch(e => {
            console.error(e);
            this.$message({
              message: "人员获取失败",
              type: "error"
            });
            this.$emit("setTabLabel","兼职结束(0)");
          });
      },
      // 跳转到添加地点页面
      operationButtonClick() {
         var tableSelections = this.$refs.ref_alter_partout.comp.$refs.ref_alter_partout.getSelection();
        var delDatas = [];
        if (tableSelections && tableSelections.length > 0) {
          for (var i = 0; i < tableSelections.length; i++) {
            var row = tableSelections[i];
            delDatas.push(row);
          }
        }


        this.delDatas = delDatas;
        return this.getSelectedData();
      },
      getSelectedData(){
        return this.delDatas;
      },
      // 翻页标签改变每页显示数据
      handleSizeChange(val) {
        this.request(1, val);
      },

      // 翻页标签改变当前页
      handleCurrentPageChange(val) {
        this.request(val, this.pageSize);
      }
    }
  };
</script>
<style>

</style>
