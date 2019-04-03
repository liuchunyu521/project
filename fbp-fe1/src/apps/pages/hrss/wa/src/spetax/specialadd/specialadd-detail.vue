<!--
	作者：lichaoyang
	时间：2018-12-18
	支持：专项附加扣除查询
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="专项附加扣除查询" v-show="false"></ifbp-breadcrumb>
    <ifbp-button-area :no-breadcrumb="true">
      <div class="fl">
        <el-cascader
          ref="treeCascader"
          expand-trigger="hover"
          :show-all-levels="false"
          :options="yearTreeData"
          v-model="selectedTreeNode"
          placeholder="请选择年份"
          :not-leaf-selectable="true"
          :hideBorder="true"
          :hideRight="true"
          @change="handleTreeChange"
        ></el-cascader>
      </div>
    </ifbp-button-area>
    <div class="tipMsg">
      <i class="ifbp-icon-warning el-icon-warning"></i>抵扣情况按照当月进行预测，如果存在与实际不一致情况，请以实际为准。
    </div>
    <ifbp-main-area type="list">
      <ifbp-template
        ref="specialAddTpl"
        tpl-id="specialAddTplId"
        :pk-temp="specialAddTplPkTemp"
        :tpl-data="specialAddTplTableData"
        :table-show-menu="false"
        show-type="table"
        :tpl-reset-fun="specialAddTplResetFun"
        :methods="specialAddTplMethods"
        v-show="showTable"
        style="margin-top: 0;"
      ></ifbp-template>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>
export default {
  data() {
    return {
      // 层级选择器数据
      yearTreeData: [],
      selectedTreeNode: [],
      defaultYear: "",
      // UI模板
      specialAddTplPkTemp: "0001AA1000000004OAYX",
      specialAddTplTableData: {},
      specialAddTplResetFun: function($node) {},
      specialAddTplMethods: {},
      showTable: true,
      tableData: []
    };
  },
  methods: {
    // 获取年份事件
    getYear() {
      this.$http({
        url: "/hrwa/spetax/deduction/getYear",
        method: "get"
      })
        .then(res => {
          if (res.data.status === true) {
            this.yearTreeData = [];
            res.data.data.forEach(item => {
              let obj = {};
              obj.value = item;
              obj.label = item;
              this.yearTreeData.push(obj);
            });
            this.defaultYear = this.yearTreeData[
              this.yearTreeData.length - 1
            ].label;
            let defaultnode = [];
            let arr = res.data.data;
            defaultnode.push(arr[arr.length - 1]);
            this.selectedTreeNode = defaultnode;
            this.request();
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        })
        .catch(err => {
          this.$message({
            message: "请求年份接口出错！",
            type: "error"
          });
        });
    },
    // 层级选择器的change事件
    handleTreeChange(treeItem) {
      if (Array.isArray(treeItem) && treeItem.length) {
        let year = treeItem[treeItem.length - 1];
        this.defaultYear = year;
        this.request();
      } else {
        this.defaultYear = "";
        this.$refs.specialAddTpl.setTableData([]);
      }
    },
    // 请求table数据
    request() {
      this.$http({
        url: "/hrwa/spetax/deduction/getByYear/" + this.defaultYear,
        method: "get"
      })
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data;
            this.$nextTick(() => {
              if (this.$refs.specialAddTpl) {
                this.$refs.specialAddTpl.setTableData(this.tableData);
              } else {
                this.$set(
                  this.specialAddTplTableData,
                  "uitemplateTableData",
                  this.tableData
                );
              }
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "请求数据出错！",
            type: "error"
          });
        });
    }
  },
  created() {
    this.getYear();
  }
};
</script>
<style scoped>
.tipMsg {
  height: 62px;
  background: #fff4e5;
  border: 1px solid #ff9500;
  font-size: 14px;
  color: #2d2d2d;
}
.tipMsg i {
  color: #ff9500;
  font-size: 14px;
  margin-left: 16px;
  line-height: 62px;
  margin-right: 16px;
}
</style>