<!--
  作者：liuchym
  时间：2018-01-10
  支持：基础设置——人员花名册列表
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="花名册列表" v-show="false"></ifbp-breadcrumb>

    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader
        name="employee"
        @update:pk_org="val => {this.pk_org = val}"
        @update:pk_hrorg="val => {this.pk_hrorg = val}"
        @update:pk_dept="val => {this.pk_dept = val}"
        :needGroup="true"
        :needDept="false"
        @change="orgCascaderChange"
      ></hr-org-cascader>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list" class="paddingTop0">
      <el-tabs
        v-model="repdef_type"
        @tab-click="tabClick"
        :has-bottom-border="false"
        :is-normal-type="false"
        :tab-position-top="true"
        class="ifbp-content-tabs"
      >
        <div slot="header" class="fr">
          <div class="ifbp-btn-line">
            <div class="fr">
              <el-button
                type="text"
                @click="tableFormAddRow"
                v-if="addvisible"
                class="ifbp-layout-content-right-button marginleft24"
              >新增</el-button>
              <el-button type="text" v-if="repdef_type==='0'" @click="listRepdefRoleClick">分配给角色</el-button>
              <el-button type="text" v-if="repdef_type==='0'" @click="listRepdefUserClick">分配给用户</el-button>
              <el-button type="text" v-if="repdef_type==='2'" @click="listRoleRepdefClick">分配花名册</el-button>
              <el-button type="text" v-if="repdef_type==='1'" @click="listUserRepdefClick">分配花名册</el-button>
              <i class="ifbp-icon-setting marginleft16" @click="showHeaderSetting" title="设置"></i>
            </div>
          </div>
        </div>
        <el-tab-pane label="花名册" name="0">
          <!-- UI模板组件 -->
          <ifbp-template  :ref="hrRptDef.ref"
                          :tplId="hrRptDef.id"
                          :tplData="hrRptDef.data"
                          :table-show-menu="false"
                          class="uitemplate-no-top"
                          :editable="hrRptDef.edit"
                          :form-show-message="hrRptDef.edit"
                          :cancel-button-show="hrRptDef.edit"
                          :delete-button-show="!hrRptDef.edit"
                          :table-oper-vif="!hrRptDef.expand"
                          @expand="tableExpandChange"
                          :tplResetFun="tableFormResetFun"
                          @roster-design-table-click="tableFormDesignClick"
                          @delete-table-click="tableFormDeleteClick"
                          @form-edit-click="tableFormEdit"
                          @form-delete-click="tableFormDelete"
                          @form-confirm-click="tableFormConfirm"
                          @form-cancel-click="tableFormCancel"
                          :methods="repdefMethods">
          </ifbp-template>
        </el-tab-pane>
        <el-tab-pane label="按角色授权" name="2">
          <!-- UI模板组件 -->
          <ifbp-template
            :ref="hrRptRoleDef.ref"
            :tplId="hrRptRoleDef.id"
            :tplData="hrRptRoleDef.data"
            :table-show-menu="false"
            class="uitemplate-no-top"
            :tplResetFun="tableFormRoleResetFun"
            :methods="repdefMethods"
          ></ifbp-template>
        </el-tab-pane>
        <el-tab-pane label="按用户授权" name="1">
          <!-- UI模板组件 -->
          <ifbp-template
            :ref="hrRptUserDef.ref"
            :tplId="hrRptUserDef.id"
            :tplData="hrRptUserDef.data"
            :table-show-menu="false"
            class="uitemplate-no-top"
            :tplResetFun="tableFormUserResetFun"
            :methods="repdefMethods"
          ></ifbp-template>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        v-if="totalElements > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSize"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
      ></el-pagination>
    </ifbp-main-area>
    <dialog-repdef-role :ref="repdefRoleRef" :pk_org="pk_org" :repdefData="dialogRepdefData"></dialog-repdef-role>
    <dialog-repdef-user :ref="repdefUserRef" :pk_org="pk_org" :repdefData="dialogRepdefData"></dialog-repdef-user>
    <dialog-role-repdef :ref="roleRepdefRef" :pk_org="pk_org" :repdefData="dialogRepdefData"></dialog-role-repdef>
    <dialog-user-repdef :ref="userRepdefRef" :pk_org="pk_org" :repdefData="dialogRepdefData"></dialog-user-repdef>
  </ifbp-page>
</template>

<script>

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import DialogRepdefRole from "./dialog-repdef-role.vue";
import DialogRepdefUser from "./dialog-repdef-user.vue";
import DialogRoleRepdef from "./dialog-role-repdef.vue";
import DialogUserRepdef from "./dialog-user-repdef.vue";
let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

export default {
  mixins: [pageModelMixin],
  components: {
    hrOrgCascader,
    DialogRepdefRole,
    DialogRepdefUser,
    DialogRoleRepdef,
    DialogUserRepdef,
  },

  data() {
    var vm = this;
    return {
      // 功能编码
      funcode: 'funcode=60070repdef',
      // 接口前缀
      requestPrefix: '/hrhi/repdef',
      //页签类型
      repdef_type: '0',
      // 当前页面所有请求路径
      requestUrl: {
        pageList: '/pageList',
        save: '/save',
        delete: '/delete',
      },
      //花名册ref
      hrRptDef: {
        ref: 'hr_rpt_def_ref',
        id: 'hrhi_repdef',
        data: {},
        edit: false,
        expand: false,
        tablePk: 'pk_rpt_def',
        originalValue: [],
      },
      //角色ref
      hrRptRoleDef: {
        ref: 'hr_rpt_Role_ref',
        id: 'hrhi_repdef_role',
        data: {},
        edit: false,
        expand: false,
        tablePk: 'pk_rpt_def',
        originalValue: [],
      },
      //用户ref
      hrRptUserDef: {
        ref: 'hr_rpt_User_ref',
        id: 'hrhi_repdef_user',
        data: {},
        edit: false,
        expand: false,
        tablePk: 'pk_rpt_def',
        originalValue: [],
      },

      // 组织主键
      pk_org: '',
      pk_hrorg: '',

      // 组织级联加载完成
      orgCascaderReady: false,

      //addvisible 新增显示隐藏
      addvisible: true,
      //弹框ref
      repdefRoleRef: 'repdefRoleRef',
      repdefUserRef: 'repdefUserRef',
      roleRepdefRef: 'roleRepdefRef',
      userRepdefRef: 'userRepdefRef',

      pk_dialog: '',
      subject_type: '',
      dialogRepdefData: [],//弹框传值

      tableFormResetFun($node) {
        //表头是否显示
        let $table = $node.find('el-table');
        $table.attr(':show-header', 'true');
        //定义查看按钮方法
        let baseOperateArr = [{
          title: "设计",
          icon: "roster-design",
          vif: "tableOperVif"
        }, {
          title: "删除",
          icon: "delete",
          vif: "tableOperVif"
        }, {
          title: '分配给角色',
          click: 'assignRole',
          vif: "tableOperVif"
        }, {
          title: '分配给用户',
          click: 'assignUser',
          vif: "tableOperVif"
        }];
        let operateHtml = this.getTableOperateHtml(baseOperateArr, 'right', 300, 'text');
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      tableFormRoleResetFun($node) {
        //表头是否显示
        let $table = $node.find('el-table');
        $table.attr(':show-header', 'true');
        //定义查看按钮方法
        let baseOperateArr = [{
          title: '分配花名册',
          click: 'assignRolerepdef',
          vif: "tableOperVif"
        }];
        let operateHtml = this.getTableOperateHtml(baseOperateArr, 'right', 300, 'text');
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      tableFormUserResetFun($node) {
        //表头是否显示
        let $table = $node.find('el-table');
        $table.attr(':show-header', 'true');
        //定义查看按钮方法
        let baseOperateArr = [{
          title: '分配花名册',
          click: 'assignUserrepdef',
          vif: "tableOperVif"
        }];
        let operateHtml = this.getTableOperateHtml(baseOperateArr, 'right', 300, 'text');
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      repdefMethods: {
        assignRole(scope) {
          vm.assignRole(scope);
        },
        assignUser(scope) {
          vm.assignUser(scope);
        },
        assignRolerepdef(scope) {
          vm.assignRolerepdef(scope);
        },
        assignUserrepdef(scope) {
          vm.assignUserrepdef(scope);
        }
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      pageSize: [10, 20, 30, 40],
    };
  },

  mounted() {

  },

  methods: {
    ifbpPageInit: function () {
      this.refreshRepDefData();
    },

    // 刷新table
    refreshTableList: function () {
      if (this.orgCascaderReady) {
        this.requestData();
      }
    },

    tabClick: function () {
      if (!this.pk_org) return;
      this.$nextTick(function () {
        this.requestData();
      });
      if (this.repdef_type == '0') {
        this.addvisible = true;
      } else if (this.repdef_type == "2") {
        this.addvisible = false;
      } else if (this.repdef_type == "1") {
        this.addvisible = false;
      }
    },

    listRepdefRoleClick: function () {
      if (this.checkSelected(this.hrRptDef.ref)) {
        this.$refs[this.repdefRoleRef].setDialogVisible(true);
      }
    },

    listRepdefUserClick: function () {
      if (this.checkSelected(this.hrRptDef.ref)) {
        this.$refs[this.repdefUserRef].setDialogVisible(true);
      }
    },

    listRoleRepdefClick: function () {
      if (this.checkSelected(this.hrRptRoleDef.ref)) {
        this.$refs[this.roleRepdefRef].setDialogVisible(true);
      }
    },

    listUserRepdefClick: function () {
      if (this.checkSelected(this.hrRptUserDef.ref)) {
        this.$refs[this.userRepdefRef].setDialogVisible(true);
      }
    },

    checkSelected: function (val) {
      this.dialogRepdefData = this.$refs[val].getTableComp().getSelection();
      if (this.dialogRepdefData && this.dialogRepdefData.length > 0) {
        return true;
      } else {
        this.$message({ message: '请先选择要分配的数据！', type: 'error' });
        return false;
      }
    },

    assignRole(scope) {//分配给角色
      console.log(scope)
      let data = [];
      data.push(scope.row);
      this.dialogRepdefData = data;
      this.$refs[this.repdefRoleRef].setDialogVisible(true);
    },

    assignUser(scope) {//分配给用户
      console.log(scope)
      let data = [];
      data.push(scope.row);
      this.dialogRepdefData = data;
      this.$refs[this.repdefUserRef].setDialogVisible(true);
    },

    assignRolerepdef(scope) {//角色分配给花名册
      console.log(scope)
      let data = [];
      data.push(scope.row);
      this.pk_dialog = scope.row.pk_role;
      this.subject_type = '0';
      this.dialogRepdefData = data;
      this.$refs[this.roleRepdefRef].setDialogVisible(true);
    },

    assignUserrepdef(scope) {//角色分配给花名册
      console.log(scope)
      let data = [];
      data.push(scope.row);
      this.pk_dialog = scope.row.cuserid;
      this.subject_type = '1';
      this.dialogRepdefData = data;
      this.$refs[this.userRepdefRef].setDialogVisible(true);
    },

    // 请求数据
    requestData(pageNum, pageSize) {
      // 没有组织，一定不能请求数据
      if (!this.pk_org) {
        return;
      }

      let param = {
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        type: Number(this.repdef_type),
        pk_org: this.pk_org,
      };

      this.$http({
        url: this.requestPrefix + this.requestUrl.pageList,
        method: "post",
        params: param,
      }).then((res) => {
        if (res.data.status === true) {
          if (this.repdef_type == '0') {
            this.hrRptDef.originalValue = res.data.data.content;
            this.$refs[this.hrRptDef.ref].clearEdit();
            this.$refs[this.hrRptDef.ref].setTableData(this.hrRptDef.originalValue);
          } else if (this.repdef_type == "2") {
            this.hrRptRoleDef.originalValue = res.data.data.content;
            this.$refs[this.hrRptRoleDef.ref].clearEdit();
            this.$refs[this.hrRptRoleDef.ref].setTableData(this.hrRptRoleDef.originalValue);
          } else if (this.repdef_type == "1") {
            this.hrRptUserDef.originalValue = res.data.data.content;
            this.$refs[this.hrRptUserDef.ref].clearEdit();
            this.$refs[this.hrRptUserDef.ref].setTableData(this.hrRptUserDef.originalValue);
          }
          this.totalElements = res.data.data.totalElements;
          this.size = res.data.data.size;

        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      }).catch(() => {
        this.$message({
          message: "信息获取失败",
          type: "error"
        });
      });
    },

    // 级联选择改变后处理
    orgCascaderChange: function () {
      this.orgCascaderReady = true;

      this.refreshTableList();
    },

    // 刷新页面
    refreshRepDefData: function () {
      this.$refs[this.hrRptDef.ref].getTableComp().closeExpandRow();
      this.editValueChange(false);
      this.$nextTick(function () {
        this.refreshTableList();
      });
    },

    // 花名册设计
    tableFormDesignClick: function (scope) {
      this.$router.push("/hrhi/repdef/detail/" + scope.row[this.hrRptDef.tablePk] + "?" + this.funcode);
    },

    // 新增打开方法
    tableFormAddRow: function () {
      // 关闭其他打开
      this.$refs[this.hrRptDef.ref].getTableComp().closeExpandRow();
      this.$refs[this.hrRptDef.ref].resetFormData();
      // 显示新增区域
      this.editValueChange(true);
      this.$refs[this.hrRptDef.ref].formShow = true;
      this.setDefaultOrg();
    },

    // form的保存操作
    tableFormConfirm() {
      let data = this.$refs[this.hrRptDef.ref].getFormData();
      // 报表类型写死花名册
      data.rpt_type = 2;
      this.$refs[this.hrRptDef.ref].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.requestPrefix + this.requestUrl.save,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.status === true) {
              if (this.$refs[this.hrRptDef.ref].formShow) {
                this.$refs[this.hrRptDef.ref].formShow = false;
                this.$confirm("新增花名册成功，是否前往花名册设计页面完成设置", '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  closeOnClickModal: false,
                  type: 'info'
                }).then(() => {
                  this.$router.push("/hrhi/repdef/detail/" + res.data.data[this.hrRptDef.tablePk] + "?" + this.funcode);
                }).catch(() => {
                  this.refreshTableList();
                });
              } else {
                this.$refs[this.hrRptDef.ref].formShow = false;
                this.$message({ message: res.data.msg, type: "success" });
                this.refreshTableList();
              }
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(() => {
            this.$message({ message: "保存失败", type: "error" });
          });
        }
      });
    },

    // form的取消操作
    tableFormCancel(type) {
      if (type === 'form') {
        this.$refs[this.hrRptDef.ref].resetFormData();
        this.$refs[this.hrRptDef.ref].formShow = false;
      }
      this.editValueChange(false);
    },

    // 行展开变化
    tableExpandChange: function (row, expanded) {
      this.hrRptDef.expand = expanded;
      if (!expanded) {
        this.editValueChange(false);
      }
    },

    // 点开里面编辑按钮
    tableFormEdit: function () {
      this.editValueChange(true);
    },

    // table行的删除操作
    tableFormDeleteClick(scope) {
      this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.doDelete(scope.row);
      }).catch(() => {
      });
    },

    // form的删除操作
    tableFormDelete: function (type, row) {
      this.$confirm("确认删除该数据？删除后无法恢复。", '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.doDelete(row);
      }).catch(() => {
      });
    },

    // 删除事件
    doDelete(delData) {
      // TODO 判断报表是否可以删除

      this.$http({
        url: this.requestPrefix + this.requestUrl.delete,
        method: 'post',
        data: delData,
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({ message: '删除成功', type: 'success' });
          this.refreshRepDefData();
        } else {
          this.$message({ message: res.data.msg, type: 'error' });
        }
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' });
      });
    },

    // 提供当前页的所有数据
    getTemplateListData: function () {
      return this.hrRptDef.originalValue;
    },

    // 编辑状态改变
    editValueChange: function (val) {
      this.hrRptDef.edit = val;
    },

    // 设置显示列
    showHeaderSetting() {
      // 判断是那个页签
      if (this.repdef_type == '0') {
        this.$refs[this.hrRptDef.ref].setTransferVisible(true);
      } else if (this.repdef_type == "2") {
        this.$refs[this.hrRptRoleDef.ref].setTransferVisible(true);
      } else if (this.repdef_type == "1") {
        this.$refs[this.hrRptUserDef.ref].setTransferVisible(true);
      }
    },

    // 设置默认的组织
    setDefaultOrg: function () {
      if (this.pk_org) {
        let data = this.$refs[this.hrRptDef.ref].getFormData();
        if (this.pk_org) {
          data.pk_org = this.pk_org;
          data.beanMap = {};
        }
        this.$refs[this.hrRptDef.ref].setFormData(JSON.parse(JSON.stringify(data)));
      }
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
    },
  }
};
</script>
