<!--
	作者：offline
	时间：2018-10-15
	描述：规则检查-不符合规则的人员
-->
<template>
<div>
      <!--    :pk-temp="illegalPsnTempId"-->
      <ifbp-template ref="ref_delbyrule"
                     tpl-id="delByRule"

                     :tpl-data="illegalPsnData"
                   >
      </ifbp-template>

      <el-pagination
        @size-change="handleIllegalSizeChange"
        @current-change="handleaIllegalCurrentChange"
        :current-page="IllegalcCurrentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="ilegalSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ilegalTotalElements">
      </el-pagination>
</div>
</template>
<script>

    export default {

    props :['pk_org','pk_wa_class','cyear','cperiod'],
    data() {
      return {


        illegalPsnTempId : "0001AA1000000000PGXK",
        illegalPsnData : {},
        IllegalcCurrentPage:1,
        ilegalSize:1,
        ilegalTotalElements:0,

       };
    },

    methods: {

      // 不符合薪资规则人员
      request(n,s) {
        var pn = 1;
        var ps =10 ;

        if(n){
          pn = n;
        }
        if(s){
          ps = s;
        }
        var url =
          "/hrwa/payFile/qryIllegalData";
        this.$http({
          url: url,
          method: "post",
          data : {
              pn : pn,
              ps :ps,
              pk_org:this.pk_org,
              pk_wa_class:this.pk_wa_class,
              cyear:this.cyear,
              cperiod:this.cperiod
          }
        })
          .then(res => {
            if (res.data.status === true) {
              var originalValue = res.data.data.content;

              this.IllegalcCurrentPage = res.data.data.number;
              this.ilegalSize = res.data.data.size;
              this.ilegalTotalElements = res.data.data.totalElements;

              this.$emit("setTabLabel","不符合计薪规则的人员("+ this.ilegalTotalElements +")");
                this.$emit("actionDisable",this.ilegalTotalElements==0);

              this.$refs.ref_delbyrule.setData(
                "payfile_t",
                JSON.parse(JSON.stringify(originalValue))
              );
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.$emit("setTabLabel","不符合计薪规则的人员(0)");
            }
          })
          .catch(e => {
            console.error(e);
            this.$message({
              message: "不符合薪资规则人员获取失败",
              type: "error"
            });
            this.$emit("setTabLabel","不符合计薪规则的人员(0)");
          });
      },
      operationButtonClick(){
        var tableSelections = this.$refs.ref_delbyrule.comp.$refs.ref_delbyrule.getSelection();
        var delDatas = [];
        if (tableSelections && tableSelections.length > 0) {
          for (var i = 0; i < tableSelections.length; i++) {
            var row = tableSelections[i];
            delDatas.push(row);
          }
        }


        this.delData = delDatas;
        return this.getSelectedData();
       },

      getSelectedData(){
        return this.delData;
      },
      handleIllegalSizeChange(val){
        this.request(1, val);
      },


      handleaIllegalCurrentChange(val){
        this.request(val, this.ilegalSize);
      },

    }
  };
</script>
<style>

</style>
