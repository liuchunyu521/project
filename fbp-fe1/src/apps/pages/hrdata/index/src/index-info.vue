<!--
  作者：zhangyl
  时间：2018-07-12
  支持：指标数据——指标
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="指标管理"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" @click="tableFormAddRow">新增</el-button>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- UI模板组件 -->
      <ifbp-template :ref="hrdataIndex.ref"
                     :tplId="hrdataIndex.id"
                     :tplData="hrdataIndex.data"
                     class="uitemplate-no-top"

                     :editable="hrdataIndex.edit"
                     :form-show-message="hrdataIndex.edit"
                     :cancel-button-show="hrdataIndex.edit"
                     :delete-button-show="!hrdataIndex.edit"
                     :table-oper-vif="!hrdataIndex.expand"
                     @expand="tableExpandChange"

                     :tplResetFun="tableFormResetFun"
                     @edit-table-click="tableFormEditClick"
                     @delete-table-click="tableFormDeleteClick"
                     @form-edit-click="tableFormEdit"
                     @form-delete-click="tableFormDelete"
                     @form-confirm-click="tableFormConfirm"
                     @form-cancel-click="tableFormCancel">
      </ifbp-template>

      <!--分页组件-->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="pageSize"
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
  mixins: [pageModelMixin],
  data() {
    return {
      // 功能编码
      funcode: "funcode=60630indexData",
      requestPrefix: "/hrdata/index",

      // 查询模板传入参数
      tplCode: "hrhiRegisterSearch",
      optionCountBeforeMore: 4,
      searchTemplate: {},

      hrdataIndex: {
        ref: "hrdata_index_ref",
        id: "index",
        data: {},
        url: {
          list_url: "/pageList",
          save_url: "/save",
          delete_url: "/delete"
        },
        edit: false,
        expand: false,
        tablePk: "pk_index",
        originalValue: []
      },

      tableFormResetFun($node) {
        //表头是否显示
        let $table = $node.find("el-table");
        $table.attr(":show-header", "true");
        let operateHtml = this.getBaseTableOperateHtml();
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 12,
      pageSize: [12, 24, 36, 48]
    };
  },

  mounted() {
    this.pageInit();
  },

  methods: {
    pageInit: function() {
      this.requestData();
    },
    // 初始化加载数据
    requestData(pageNum, pageSize) {
      let param = {
        pageNum: pageNum || 1,
        pageSize: pageSize || 12,
        sortField: "code"
      };
      this.$http({
        url: this.requestPrefix + this.hrdataIndex.url.list_url,
        method: "post",
        data: this.searchTemplate,
        params: param
      })
        .then(res => {
          this.hrdataIndex.originalValue = res.data.data.content;
          this.totalElements = res.data.data.totalElements;
          this.size = res.data.data.size;
          this.$refs[this.hrdataIndex.ref].clearEdit();
          this.$refs[this.hrdataIndex.ref].setTableData(
            this.hrdataIndex.originalValue
          );
        })
        .catch(() => {
          this.$message({ message: "查询失败", type: "error" });
        });
    },

    // 刷新数据
    refreshData: function() {
      this.$refs[this.hrdataIndex.ref].getTableComp().closeExpandRow();
      this.editValueChange(false);
      this.$nextTick(function() {
        this.requestData();
      });
    },

    // 新增打开方法
    tableFormAddRow: function() {
      // 关闭其他打开
      this.$refs[this.hrdataIndex.ref].getTableComp().closeExpandRow();
      this.$refs[this.hrdataIndex.ref].resetFormData();
      // 显示新增区域
      this.editValueChange(true);
      this.$refs[this.hrdataIndex.ref].formShow = true;
    },

    // form的保存操作
    tableFormConfirm() {
      let data = this.$refs[this.hrdataIndex.ref].getFormData();

      this.$refs[this.hrdataIndex.ref].validate(valid => {
        if (valid) {
          this.$http({
            url: this.requestPrefix + this.hrdataIndex.url.save_url,
            method: "post",
            data: data
          })
            .then(res => {
              if (res.data.status === true) {
                this.$refs[this.hrdataIndex.ref].formShow = false;
                this.$message({ message: res.data.msg, type: "success" });
                this.refreshData();
              } else {
                this.$message({ message: res.data.msg, type: "error" });
              }
            })
            .catch(() => {
              this.$message({ message: "保存失败", type: "error" });
            });
        }
      });
    },

    // table行的编辑操作
    tableFormEditClick(scope) {
      this.tableFormExpandRow(scope.row, scope.$index);
      this.$nextTick(function() {
        this.editValueChange(true);
      });
    },

    // tableForm展开方法（样式修改，数据备份）
    tableFormExpandRow: function(data, index) {
      this.$refs[this.hrdataIndex.ref].expandRow(data, index);
      this.$refs[this.hrdataIndex.ref].getTableComp().expandRow(data);
      this.$refs[this.hrdataIndex.ref].setFormData(data);
      this.$refs[this.hrdataIndex.ref].formShow = false;
    },

    // form的取消操作
    tableFormCancel(type) {
      if (type === "form") {
        this.$refs[this.hrdataIndex.ref].resetFormData();
        this.$refs[this.hrdataIndex.ref].formShow = false;
      }
      this.editValueChange(false);
    },

    // 行展开变化
    tableExpandChange: function(row, expanded) {
      this.hrdataIndex.expand = expanded;
      if (!expanded) {
        this.editValueChange(false);
      }
    },

    //点开里面编辑按钮
    tableFormEdit: function() {
      this.editValueChange(true);
    },

    // table行的删除操作
    tableFormDeleteClick(scope) {
      this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          this.realDelete(scope.row);
        })
        .catch(() => {});
    },

    tableFormDelete: function(type, row) {
      this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          this.realDelete(row);
        })
        .catch(() => {});
    },

    // table行的删除确认操作
    realDelete(data) {
      this.$http({
        url: this.requestPrefix + this.hrdataIndex.url.delete_url,
        method: "post",
        data: data,
      })
        .then(res => {
          if (res.data.status === true) {
            this.$message({ message: "删除成功", type: "success" });
            this.refreshData();
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        })
        .catch(() => {
          this.$message({ message: "操作失败", type: "error" });
        });
    },

    // 提供当前页的所有数据
    getTemplateListData: function() {
      return this.hrdataIndex.originalValue;
    },

    // 编辑状态改变
    editValueChange: function(val) {
      this.hrdataIndex.edit = val;
    },

    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.currentPage = 1;
      this.size = val;
      this.requestData(1, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.requestData(val, this.size);
    }
  }
};
</script>
