<!--
	规则检查-新进人员
-->

<template>
<div>
      <!-- :pk-temp="newAddPsnTempId"-->
      <ifbp-template ref="ref_newadd"
                     tpl-id="addByRule"
                     :tpl-data="newAddPsnData"
                    >
      </ifbp-template>

      <el-pagination
        @size-change="handleNewAddedSizeChange"
        @current-change="handleNewAddedCurrentChange"
        :current-page="NewAddedCurrentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="NewAddedSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="NewAddedTotalElements">
      </el-pagination>
</div>
</template>
<script>


    export default {

    props :['pk_org','pk_wa_class','cyear','cperiod'],
    data() {

      return {

//        newAddPsnTempId: "0001AA10000000019RE4",
        newAddPsnData: {
        },
        NewAddedCurrentPage:1,
        NewAddedSize :1,
        NewAddedTotalElements:0,
      };
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
          "/hrwa/payFile/qryNewAddData";

        this.$http({
          url: url,
          method: "post",
          data :{
              pn : pn,
              ps : ps,
              pk_org : this.pk_org,
              pk_wa_class : this.pk_wa_class,
              cyear:this.cyear ,
              cperiod:this.cperiod
          }
        })
          .then(res => {
            if (res.data.status === true) {

              var originalValue = res.data.data.content;

              this.NewAddedCurrentPage = res.data.data.number;
              this.NewAddedSize = res.data.data.size;
              this.NewAddedTotalElements = res.data.data.totalElements;

              this.$emit("setTabLabel","新进人员("+this.NewAddedTotalElements+")");
                this.$emit("actionDisable",this.NewAddedTotalElements==0);
              this.$refs.ref_newadd.setData(
                "hi_psnjob_t",
                JSON.parse(JSON.stringify(originalValue))
              );
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.$emit("setTabLabel","新进人员(0)");
            }
          })
          .catch(e => {
            console.error(e);
            this.$message({
              message: "新进人员获取失败",
              type: "error"
            });
            this.$emit("setTabLabel","新进人员(0)");
          });
      },
      // 跳转到添加地点页面
      operationButtonClick() {
        var tableSelections = this.$refs.ref_newadd.comp.$refs.ref_newadd.getSelection();
        var addDatas = [];
        if (tableSelections && tableSelections.length > 0) {
          for (var i = 0; i < tableSelections.length; i++) {
            var row = tableSelections[i];
            addDatas.push(row);
          }
        }
          this.addDatas = addDatas;
          return this.getSelectedData();
      },

      getSelectedData(){
        return this.addDatas;
      },
      // 翻页标签改变每页显示数据
      handleNewAddedSizeChange(val) {
        this.request(1, val);
      },

      // 翻页标签改变当前页
      handleNewAddedCurrentChange(val) {
        this.request(val, this.NewAddedSize);
      }
    }
  };
</script>
<style>

</style>
