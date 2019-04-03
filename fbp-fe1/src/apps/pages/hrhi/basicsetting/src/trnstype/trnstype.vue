<!--
  作者：yangchd
  时间：2018-05-17
  支持：基础设置——异动类型
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="异动类型"></ifbp-breadcrumb>

    <!-- 主体区域 -->
    <ifbp-main-area type="list" id="trnstype-el-tabs">
      <el-tabs v-model="hrTrnsevent" @tab-click="trnstypeHandleClick" style="margin-top: -10px">
        <el-tab-pane label="入职" name="1"></el-tab-pane>
        <el-tab-pane label="转正" name="2"></el-tab-pane>
        <el-tab-pane label="调配" name="3"></el-tab-pane>
        <el-tab-pane label="离职" name="4"></el-tab-pane>
        <el-tab-pane label="离职后变动" name="5"></el-tab-pane>
      </el-tabs>
      <!-- UI模板组件 -->
      <ifbp-panel-group :navbar="false">
        <ifbp-panel id="trnstype_panel" style="padding:0;" :title="titleName" :icons="hrTrnstype.icons">
          <ifbp-template :ref="hrTrnstype.ref"
                         :tplId="hrTrnstype.id"
                         :tplData="hrTrnstype.data"

                         :editable="hrTrnstype.edit"
                         :form-show-message="hrTrnstype.edit"
                         :table-oper-vif="!tableExpand && templateEdit"
                         @expand="tableExpandChange"

                         :confirm-button-show="buttonShow"
                         :edit-button-show="buttonShow"
                         :cancel-button-show="hrTrnstype.edit && buttonShow"
                         :delete-button-show="!hrTrnstype.edit && buttonShow && deleteBtnShow"

                         :tplResetFun="tableFormResetFun"
                         :methods="tableFormMethods"

                         @edit-table-click="tableFormEditClick"
                         @delete-table-click="tableFormDeleteClick"
                         @form-edit-click="tableFormEdit"
                         @form-delete-click="tableFormDelete"
                         @form-confirm-click="tableFormConfirm"
                         @form-cancel-click="tableFormCancel">
          </ifbp-template>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins: [pageModelMixin],
  data() {
    const trnstypeDetailThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60070transtype',
      //分页
      hrTrnsevent: '1',
      titleName: '入职',
      hrTrnstype: {
        ref: 'hr_trnstype_ref',
        id: 'hrhi_trnstype_id',
        edit: false,
        data: {
          use_url: '/hrhi/trnstype/unUse',
        },
        url: {
          list_url: '/hrhi/trnstype/list',
          save_url: '/hrhi/trnstype/save',
          delete_url: '/hrhi/trnstype/delete/',
          use_url: '/hrhi/trnstype/unUse',
        },
        tablePk: 'pk_trnstype',
        icons: [{
          icon: "plus",
          click: function () {
            trnstypeDetailThis.tableFormAddRow();
          }
        }],
        iconsBak: [{
          icon: "plus",
          click: function () {
            trnstypeDetailThis.tableFormAddRow();
          }
        }],
        listData: [],
      },

      // 参照用常量
      beanMap: {},


      // 按钮是否显示
      buttonShow: true,
      // 行展开
      tableExpand: false,
      // 当前是否可编辑
      templateEdit: true,
      // deleteBtn
      deleteBtnShow: false,

      tableFormResetFun($node) {

        //表头是否显示
        let $table = $node.find('el-table');
        $table.attr(':show-header', 'true');

        // 启用停用
        let $enablestate = $table.find("[prop='enablestate']");
        $enablestate.attr('render-type', 'default');
        $enablestate.html(
          '<template scope="scope">' +
          '<el-switch @change="trnstypeChange(scope.row)" v-model="scope.row.enablestate" class="el-table-column-no-click" ' +
          'on-color="#4BD762" off-color="#AFAFAF" :on-value="2" :off-value="3" on-text="是" off-text="否"></el-switch>' +
          '</template>'
        );
        let operateHtml =
          '<el-table-column label="" width="152" v-if="tableOperColumnVif" class-name="table-operate-column" header-align="center" fixed="right">'
          + '<template scope="scope">'
          + '<i @click="handleClick(\'edit\',scope)" v-if="tableOperVif" class="ifbp-icon-edit el-table-operate-icon" title="编辑"></i>'
          + '<i @click="handleClick(\'delete\',scope)" v-show="!scope.row.systypeflag" v-if="tableOperVif" class="ifbp-icon-delete el-table-operate-icon" title="删除"></i>'
          + '</template>'
          + '</el-table-column>';
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },
      tableFormMethods: {
        trnstypeChange(rowData) {
          let data = {};
          data.pks = rowData['pk_trnstype'];
          data.state = !(rowData.enablestate === 2);
          this.$http({
            url: this.use_url,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              this.$message({ message: res.data.msg, type: "success" });
              trnstypeDetailThis.refreshTrnstypeData();
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(() => {
            this.$message({ message: "保存失败", type: "error" });
          });
        }
      }
    };
  },

  mounted() {
    this.trnstypeRequestData();
  },

  methods: {
    // 初始化加载数据
    trnstypeRequestData() {
      this.$http({
        url: this.hrTrnstype.url.list_url + "?trnsevent=" + this.hrTrnsevent,
        method: 'get',
      }).then((res) => {
        this.hrTrnstype.listData = res.data.data;
        this.beanMap = this.hrTrnstype.listData[0].beanMap;
        this.$nextTick(function () {
          this.$refs[this.hrTrnstype.ref].clearEdit();
          this.$refs[this.hrTrnstype.ref].setTableData(this.hrTrnstype.listData);
        })
      }).catch(() => {
        this.$message({ message: '查询失败', type: 'error' });
      });
    },

    //刷新页面
    refreshTrnstypeData: function () {
      this.$refs[this.hrTrnstype.ref].getTableComp().closeExpandRow();
      this.$refs[this.hrTrnstype.ref].formShow = false;
      this.editValueChange(false);

      this.trnstypeRequestData();
    },

    //页签切换
    trnstypeHandleClick: function (tab) {
      this.hrTrnsevent = tab.name;
      this.titleName = tab.label;
      this.buttonVisibleChange(this.hrTrnsevent);
      this.refreshTrnstypeData();
    },

    //新增打开方法
    tableFormAddRow: function () {
      let data = {
        trnsevent: this.hrTrnsevent,
        ishrss: true,
        beanMap: this.beanMap,
      };
      //关闭其他打开
      this.$refs[this.hrTrnstype.ref].getTableComp().closeExpandRow();
      this.$refs[this.hrTrnstype.ref].resetFormData();
      if (data) {
        // 初始化新增数据
        let formData = this.$refs[this.hrTrnstype.ref].getFormData();
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            if (data[key]) {
              formData[key] = data[key];
            }
          }
        }
        this.$refs[this.hrTrnstype.ref].setFormData(formData);
      }
      // 显示新增区域
      this.editValueChange(true);
      this.$refs[this.hrTrnstype.ref].formShow = true;
    },
    // 行展开变化
    tableExpandChange: function (row, expanded) {
      this.tableExpand = expanded;
      this.deleteBtnShow = !row.systypeflag;
      if (!expanded) {
        this.editValueChange(false);
      }
    },

    // table行的编辑操作
    tableFormEditClick(scope) {
      this.editValueChange(true);
      this.tableFormExpandRow(scope.row, scope.$index);
    },

    // table行的删除操作
    tableFormDeleteClick(scope) {
      if (scope.row.systypeflag) {
        this.$message({ message: '系统预置的异动类型不能删除', type: 'error' });
        return;
      }
      this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.realDelete(scope.row[this.hrTrnstype.tablePk]);
      }).catch(() => {
      });
    },
    tableFormDelete: function (type, row) {
      if (row.systypeflag) {
        this.$message({ message: '系统预置的异动类型不能删除', type: 'error' });
        return;
      }
      this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.realDelete(row[this.hrTrnstype.tablePk]);
      }).catch(() => {
      });
    },
    // table行的删除确认操作
    realDelete(pk) {
      this.$http({
        url: this.hrTrnstype.url.delete_url + pk,
        method: 'post',
        dataType: 'json'
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({ message: '删除成功', type: 'success' });
          this.trnstypeRequestData();
        } else {
          this.$message({ message: res.data.msg, type: 'error' });
        }
      }).catch(() => {
        this.$message({ message: '删除失败', type: 'error' });
      });
    },

    // form的保存操作
    tableFormConfirm() {
      let data = this.$refs[this.hrTrnstype.ref].getFormData();
      this.$refs[this.hrTrnstype.ref].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.hrTrnstype.url.save_url,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              this.$message({ message: res.data.msg, type: "success" });
              // 新增区域隐藏
              this.$refs[this.hrTrnstype.ref].formShow = false;
              this.refreshTrnstypeData();
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(() => {
            this.$message({ message: "保存失败", type: "error" });
          });
        }
      });
    },

    tableFormEdit: function () {
      this.editValueChange(true);
    },

    // form的取消操作
    tableFormCancel(type) {
      if (type === 'form') {
        this.$refs[this.hrTrnstype.ref].resetFormData();
        this.$refs[this.hrTrnstype.ref].formShow = false;
      }
      this.editValueChange(false);
    },

    // tableForm展开方法（样式修改，数据备份）
    tableFormExpandRow: function (data, index) {
      this.$refs[this.hrTrnstype.ref].expandRow(data, index);
      this.$refs[this.hrTrnstype.ref].getTableComp().expandRow(data);
      this.$refs[this.hrTrnstype.ref].setFormData(data);
      this.$refs[this.hrTrnstype.ref].formShow = false;
    },

    // 按钮和右侧是否显示
    buttonVisibleChange: function (val) {
      // 按钮是否显示
      if (val === "2") {
        this.hrTrnstype.icons = [];
        this.buttonShow = true;
        this.templateEdit = true;
      } else if (val === "5") {
        this.hrTrnstype.icons = [];
        this.buttonShow = false;
        this.templateEdit = false;
      } else {
        this.hrTrnstype.icons = this.hrTrnstype.iconsBak;
        this.buttonShow = true;
        this.templateEdit = true;
      }
    },

    //编辑状态改变
    editValueChange: function (val) {
      this.hrTrnstype.edit = val;
    },

  }
};
</script>

<style>
#trnstype-el-tabs .el-tabs > div {
  margin-left: 0 !important;
}
</style>
