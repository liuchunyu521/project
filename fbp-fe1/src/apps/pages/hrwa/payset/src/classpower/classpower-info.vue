<!--
  作者：yangchd
  时间：2018-07-19
  支持：发放设置——薪资方案授权
-->
<template>
  <ifbp-page id="classpower_info">
    <!-- 节点title -->
    <ifbp-breadcrumb name="薪资方案授权"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" v-if="power_type==='1'" @click="listClassRoleClick">分配给角色</el-button>
      <el-button type="primary" v-if="power_type==='1'" @click="listClassUserClick">分配给用户</el-button>
      <el-button type="primary" v-if="power_type==='2'" @click="listRoleClassClick">分配方案</el-button>
      <el-button type="primary" v-if="power_type==='3'" @click="listUserClassClick">分配方案</el-button>
      <ifbp-search class="fr"
                   v-if="power_type==='1'"
                   :template-code="tplCode_class"
                   @search="advancedSearch">
      </ifbp-search>
      <ifbp-search class="fr"
                   v-if="power_type==='2'"
                   :template-code="tplCode_role"
                   @search="advancedSearch">
      </ifbp-search>
      <ifbp-search class="fr"
                   v-if="power_type==='3'"
                   :template-code="tplCode_user"
                   @search="advancedSearch">
      </ifbp-search>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <el-tabs v-model="power_type" @tab-click="handleClick">
        <el-tab-pane label="方案授权" name="1">
          <ifbp-template :ref="power_class.ref"
                         class="uitemplate-no-top"
                         :tpl-id="power_class.id"
                         :tpl-data="tplData"
                         :tplResetFun="powerClassResetFun"
                         @role-table-click="classRoleClick"
                         @user-table-click="classUserClick"
                         @after-create="afterCreate"
                         :methods="powerMethods">
          </ifbp-template>
        </el-tab-pane>
        <el-tab-pane label="角色授权" name="2">
          <ifbp-template :ref="power_role.ref"
                         class="uitemplate-no-top"
                         :tpl-id="power_role.id"
                         :tpl-data="tplData"
                         :tplResetFun="powerRoleResetFun"
                         @role-table-click="roleClassClick"
                         :methods="powerMethods">
          </ifbp-template>
        </el-tab-pane>
        <el-tab-pane label="用户授权" name="3">
          <ifbp-template :ref="power_user.ref"
                         class="uitemplate-no-top"
                         :tpl-id="power_user.id"
                         :tpl-data="tplData"
                         :tplResetFun="powerUserResetFun"
                         @user-table-click="userClassClick"
                         :methods="powerMethods">
          </ifbp-template>
        </el-tab-pane>
      </el-tabs>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="pageSize"
                     :page-size="size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalElements">
      </el-pagination>
    </ifbp-main-area>
    <dialog-class-role :ref="classRoleRef"
                       :powerData="dialogPowerData">
    </dialog-class-role>
    <dialog-class-user :ref="classUserRef"
                       :powerData="dialogPowerData">
    </dialog-class-user>
    <dialog-role-class :ref="roleClassRef"
                       :powerData="dialogPowerData">
    </dialog-role-class>
    <dialog-user-class :ref="userClassRef"
                       :powerData="dialogPowerData">
    </dialog-user-class>
  </ifbp-page>
</template>

<script>
  import DialogClassRole from "./dialog-class-role.vue";
  import DialogClassUser from "./dialog-class-user.vue";
  import DialogRoleClass from "./dialog-role-class.vue";
  import DialogUserClass from "./dialog-user-class.vue";

  import pageModelMixin from "ifbp-business/pageModelMixin";
  export default {
    components: {
      DialogClassRole,
      DialogClassUser,
      DialogRoleClass,
      DialogUserClass,
    },
    mixins: [pageModelMixin],
    data() {
      return {
        // 功能编码
        funcode: 'funcode=60130classpower',
        permissionPrefix: '/hrwa/classpower',

        // 查询模板传入参数
        tplCode_class: 'hrwa_classpower_class',
        tplCode_role: 'hrwa_classpower_role',
        tplCode_user: 'hrwa_classpower_user',
        searchTemplate: {},

        power_type: '1',

        url: {
          list: '/list',
        },

        power_class: {
          ref: 'power_class_ref',
          id: 'hrwa_classpower_class',
        },
        power_role: {
          ref: 'power_role_ref',
          id: 'hrwa_classpower_role',
        },
        power_user: {
          ref: 'power_user_ref',
          id: 'hrwa_classpower_user',
        },
        tplData: {
          roleName: 'role',
          userName: 'user',
          className: 'class',
        },
        powerClassResetFun($node) {
          //表头是否显示
          let $table = $node.find('el-table');
          $table.attr(':show-header', 'true');
          let html =
              '<el-table-column label="" width="152" v-if="tableOperColumnVif"  class-name="table-operate-column" header-align="center" >' +
              '<template scope="scope">' +
              '<i v-if="tableOperVif" class="el-table-operate-icon" @click="handleClick(roleName,scope)">分配给角色</i>' +
              '<i v-if="tableOperVif" class="el-table-operate-icon" @click="handleClick(userName,scope)">分配给用户</i>' +
              '</template>' +
              '</el-table-column>';
          $table.append(html);
          return $node[0].outerHTML;
        },
        powerRoleResetFun($node) {
          //表头是否显示
          let $table = $node.find('el-table');
          $table.attr(':show-header', 'true');
          let html =
              '<el-table-column label="" width="152" v-if="tableOperColumnVif"  class-name="table-operate-column" header-align="center" >' +
              '<template scope="scope">' +
              '<i v-if="tableOperVif" class="el-table-operate-icon" @click="handleClick(roleName,scope)">分配方案</i>' +
              '</template>' +
              '</el-table-column>';
          $table.append(html);
          return $node[0].outerHTML;
        },
        powerUserResetFun($node) {
          //表头是否显示
          let $table = $node.find('el-table');
          $table.attr(':show-header', 'true');
          let html =
              '<el-table-column label="" width="152" v-if="tableOperColumnVif"  class-name="table-operate-column" header-align="center" >' +
              '<template scope="scope">' +
              '<i v-if="tableOperVif" class="el-table-operate-icon" @click="handleClick(userName,scope)">分配方案</i>' +
              '</template>' +
              '</el-table-column>';
          $table.append(html);
          return $node[0].outerHTML;
        },
        powerMethods: {},

        // 分页组件传入参数
        totalElements: 0,
        currentPage: 1,
        size: 10,
        pageSize: [10, 20, 30, 40],

        classRoleRef: 'classRoleRef',
        classUserRef: 'classUserRef',
        roleClassRef: 'roleClassRef',
        userClassRef: 'userClassRef',

        pk_dialog: '',
        subject_type: '',

        dialogPowerData: [],
      };
    },

    methods: {
      afterCreate: function () {
        this.$nextTick(function () {
          this.requestData();
        });
      },
      // 初始化加载数据
      requestData(pageNum, pageSize) {
        let param = {
          pageNum: pageNum || 1,
          pageSize: pageSize || 10,
          type: Number(this.power_type),
        };
        this.$http({
          url: this.permissionPrefix + this.url.list,
          method: 'post',
          data: this.searchTemplate,
          params: param,
        }).then((res) => {
          switch (this.power_type) {
            case '1':
              this.$refs[this.power_class.ref].setTableData(res.data.data.content);
              break;
            case '2':
              this.$refs[this.power_role.ref].setTableData(res.data.data.content);
              break;
            case '3':
              this.$refs[this.power_user.ref].setTableData(res.data.data.content);
              break;
            default:
              break;
          }
          this.totalElements = res.data.data.totalElements;
          this.size = res.data.data.size;
        }).catch(() => {
          this.$message({message: '查询失败', type: 'error'});
        });
      },

      //刷新页面
      refreshRepDefData: function () {
        this.$nextTick(function () {
          this.requestData();
        });
      },

      handleClick: function () {
        this.searchTemplate = {};
        this.refreshRepDefData();
      },

      listClassRoleClick: function () {
        if (this.checkSelected(this.power_class.ref)) {
          this.$refs[this.classRoleRef].setDialogVisible(true);
        }
      },
      listClassUserClick: function () {
        if (this.checkSelected(this.power_class.ref)) {
          this.$refs[this.classUserRef].setDialogVisible(true);
        }
      },
      listRoleClassClick: function () {
        if (this.checkSelected(this.power_role.ref)) {
          this.$refs[this.roleClassRef].setDialogVisible(true);
        }
      },
      listUserClassClick: function () {
        if (this.checkSelected(this.power_user.ref)) {
          this.$refs[this.userClassRef].setDialogVisible(true);
        }
      },
      checkSelected: function (val) {
        this.dialogPowerData = this.$refs[val].getTableComp().getSelection();
        if (this.dialogPowerData && this.dialogPowerData.length > 0) {
          return true;
        } else {
          this.$message({message: '请先选择要分配的数据！', type: 'error'});
          return false;
        }
      },
      classRoleClick: function (scope) {
        let data = [];
        data.push(scope.row);
        this.dialogPowerData = data;
        this.$refs[this.classRoleRef].setDialogVisible(true);
      },
      classUserClick: function (scope) {
        let data = [];
        data.push(scope.row);
        this.dialogPowerData = data;
        this.$refs[this.classUserRef].setDialogVisible(true);
      },
      roleClassClick: function (scope) {
        let data = [];
        data.push(scope.row);
        this.pk_dialog = scope.row.pk_role;
        this.subject_type = '0';
        this.dialogPowerData = data;
        this.$refs[this.roleClassRef].setDialogVisible(true);
      },
      userClassClick: function (scope) {
        let data = [];
        data.push(scope.row);
        this.pk_dialog = scope.row.cuserid;
        this.subject_type = '1';
        this.dialogPowerData = data;
        this.$refs[this.userClassRef].setDialogVisible(true);
      },

      // 查询区点击搜索后的处理
      advancedSearch(searchTemplate) {
        this.searchTemplate = searchTemplate;
        this.requestData();
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

<style>
  #classpower_info .el-tabs > div {
    margin-left: 0px;
  }

  #classpower_info .el-table .table-operate-column .cell {
    width: 200px !important;
    text-align: right !important;
    margin-right: 50px !important;
  }

  #classpower_info .el-table .table-operate-column .cell i {
    font-style: normal;
  }
</style>
