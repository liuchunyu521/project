<!--
  作者：yangchd
  时间：2018-07-16
  支持：发放设置——合并计税方案
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="合并计税方案"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" @click="tableFormAddRow" :disabled="hrwaSumrate.edit">新增</el-button>
      <ifbp-search class="fr"
                   :template-code="tplCode"
                   @search="advancedSearch">
      </ifbp-search>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- UI模板组件 -->
      <ifbp-template :ref="hrwaSumrate.ref"
                     :tplId="hrwaSumrate.id"
                     :tplData="hrwaSumrate.data"
                     class="uitemplate-no-top"

                     :editable="hrwaSumrate.edit"
                     :form-show-message="hrwaSumrate.edit"
                     :cancel-button-show="hrwaSumrate.edit"
                     :delete-button-show="!hrwaSumrate.edit"
                     :table-oper-vif="!hrwaSumrate.expand"
                     @expand="tableExpandChange"

                     :tplResetFun="tableFormResetFun"
                     @edit-table-click="tableFormEditClick"
                     @delete-table-click="tableFormDeleteClick"
                     @form-edit-click="tableFormEdit"
                     @form-delete-click="tableFormDelete"
                     @form-confirm-click="tableFormConfirm"
                     @form-cancel-click="tableFormCancel">
      </ifbp-template>
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
        funcode:'funcode=60130sumrate',
        permissionPrefix:'/hrwa/sumrate',

        // 查询模板传入参数
        tplCode:'hrwa_sumrate_search',
        searchTemplate: {},

        hrwaSumrate: {
          ref: 'hrwa_sumrate_ref',
          id: 'hrwa_sumrate_info',
          data: {},
          url: {
            list_url: '/list',
            save_url: '/save',
            delete_url: '/delete/',
            check:'/checkEdit'
          },
          edit: false,
          expand:false,
          tablePk: 'pk_taxgroup',
        },
        originalValue: [],
        tableFormResetFun($node) {
          //表头是否显示
          let $table = $node.find('el-table');
          $table.attr(':show-header', 'true');
          let operateHtml = this.getBaseTableOperateHtml();
          $table.append(operateHtml);
          return $node[0].outerHTML;
        },
      };
    },

    mounted() {
      this.requestInfoData();
    },

    methods: {
      // 初始化加载数据
      requestInfoData() {
        this.$http({
          url: this.permissionPrefix + this.hrwaSumrate.url.list_url,
          method: 'post',
          data: this.searchTemplate,
        }).then((res) => {
          this.originalValue = res.data.data;
          this.$refs[this.hrwaSumrate.ref].setTableData(this.originalValue);
        }).catch(() => {
          this.$message({message: '查询失败', type: 'error'});
        });
      },

      //刷新页面
      refreshData: function () {
        this.editValueChange(false);
        this.hrwaSumrate.expand = false;
        this.$refs[this.hrwaSumrate.ref].clearEdit();
        this.$nextTick(function () {
          this.requestInfoData();
        });
      },

      //新增打开方法
      tableFormAddRow: function () {
        //关闭其他打开
        this.$refs[this.hrwaSumrate.ref].getTableComp().closeExpandRow();
        this.$refs[this.hrwaSumrate.ref].resetFormData();
        // 显示新增区域
        this.editValueChange(true);
        this.$refs[this.hrwaSumrate.ref].formShow = true;
      },

      // form的保存操作
      tableFormConfirm() {
        let data = this.$refs[this.hrwaSumrate.ref].getFormData();
        this.$refs[this.hrwaSumrate.ref].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.permissionPrefix + this.hrwaSumrate.url.save_url,
              method: "post",
              data: data
            }).then(res => {
              if (res.data.status === true) {
                this.$refs[this.hrwaSumrate.ref].formShow = false;
                this.$message({message: res.data.msg, type: "success"});
                this.refreshData();
              } else {
                this.$message({message: res.data.msg, type: "error"});
              }
            }).catch(() => {
              this.$message({message: "保存失败", type: "error"});
            });
          }
        });
      },

      // form的取消操作
      tableFormCancel(type) {
        if (type === 'form') {
          this.$refs[this.hrwaSumrate.ref].resetFormData();
          this.$refs[this.hrwaSumrate.ref].formShow = false;
        }
        this.editValueChange(false);
      },
      // 行展开变化
      tableExpandChange:function (row, expanded) {
        this.hrwaSumrate.expand = expanded;
        if(!expanded){
          this.editValueChange(false);
        }
      },

      //点开里面编辑按钮
      tableFormEdit: function (type,row) {
        this.$http({
          url: this.permissionPrefix + this.hrwaSumrate.url.check + "?pk_taxgroup=" + row.pk_taxgroup,
          method: 'post',
        }).then((res) => {
          if (res.data.status === true) {
            this.editValueChange(true);
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        }).catch(() => {
          this.$message({message: '操作失败', type: 'error'});
        });
      },

      // table行的编辑操作
      tableFormEditClick(scope) {
        this.$http({
          url: this.permissionPrefix + this.hrwaSumrate.url.check + "?pk_taxgroup=" + scope.row.pk_taxgroup,
          method: 'post',
        }).then((res) => {
          if (res.data.status === true) {
            this.editValueChange(true);
            this.tableFormExpandRow(scope.row, scope.$index);
            this.$nextTick(function () {
              this.editValueChange(true);
            });
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        }).catch(() => {
          this.$message({message: '操作失败', type: 'error'});
        });
      },
      // tableForm展开方法（样式修改，数据备份）
      tableFormExpandRow: function (data, index) {
        this.$refs[this.hrwaSumrate.ref].expandRow(data,index);
        this.$refs[this.hrwaSumrate.ref].getTableComp().expandRow(data);
        this.$refs[this.hrwaSumrate.ref].setFormData(data);
        this.$refs[this.hrwaSumrate.ref].formShow = false;
      },

      // table行的删除操作
      tableFormDeleteClick(scope) {
        this.$http({
          url: this.permissionPrefix + this.hrwaSumrate.url.check + "?pk_taxgroup=" + scope.row.pk_taxgroup,
          method: 'post',
        }).then((res) => {
          if (res.data.status === true) {
            this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              this.realDelete(scope.row[this.hrwaSumrate.tablePk]);
            }).catch(() => {
            });
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        }).catch(() => {
          this.$message({message: '操作失败', type: 'error'});
        });
      },
      tableFormDelete:function (type,row) {
        this.$http({
          url: this.permissionPrefix + this.hrwaSumrate.url.check + "?pk_taxgroup=" + row.pk_taxgroup,
          method: 'post',
        }).then((res) => {
          if (res.data.status === true) {
            this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              this.realDelete(row[this.hrwaSumrate.tablePk]);
            }).catch(() => {
            });
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        }).catch(() => {
          this.$message({message: '操作失败', type: 'error'});
        });
      },
      // table行的删除确认操作
      realDelete(pk) {
        this.$http({
          url: this.permissionPrefix + this.hrwaSumrate.url.delete_url + pk,
          method: 'post',
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({message: '删除成功', type: 'success'});
            this.refreshData();
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        }).catch(() => {
          this.$message({message: '操作失败', type: 'error'});
        });
      },

      // 编辑状态改变
      editValueChange: function (val) {
        this.hrwaSumrate.edit = val;
      },

      // 查询区点击搜索后的处理
      advancedSearch(searchTemplate) {
        this.searchTemplate = searchTemplate;
        this.refreshData();
      },


    }
  };
</script>
