<!--
  作者：yangchd
  时间：2018-08-29
  支持：员工管理——员工调入
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="员工调入" v-show="false"></ifbp-breadcrumb>
    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader name="trans_transin"
                        @update:pk_org="updateOrgPk"
                       @change="cascaderChange">
      </hr-org-cascader>
      <ifbp-search class="fr"
                   :ref="searchRef"
                   :no-breadcrumb-search="true"
                   :template-code="tplCode"
                   @ready="searchReady"
                   @search="advancedSearch">
      </ifbp-search>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list" id="trans_transin_id">
      <div class="ifbp-btn-line">
        <div class="fr">
          <el-button type="text" class=" ifbp-layout-content-right-button marginleft24" @click="transinBtn">调入</el-button>
          <!--<el-button type="text" class=" ifbp-layout-content-right-button marginleft24" @click="batchBtn">批量调入</el-button>-->
          <i class="ifbp-icon-setting marginleft16" @click="settingBtn"></i>
        </div>
      </div>
      <div v-show="totalElements>0">
        <ifbp-template :ref="transinRef"
                       :tpl-id="tplId"
                       :tpl-data="tableData"
                       class="uitemplate-no-top"
                       :tpl-reset-fun="tableResetFun"
                       :table-show-menu="false"
                       :methods="tableMethods"
                       @search-table-click="searchTableClick"
                       @edit-table-click="tableEditClick"
                       @publish-table-click="tableCommitClick"
                       @hr-icon-execute-table-click="tableExecuteClick"
                       @bottom-table-click="tableCallBackClick"
                       @delete-table-click="tableDeleteClick">
        </ifbp-template>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSize"
                       :page-size="size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalElements">
        </el-pagination>
      </div>
      <empty-list v-show="!(totalElements>0)"
                  :emptyText="emptyText"
                  iconClass="ifbp-icon-search">
      </empty-list>
    </ifbp-main-area>
    <transin-dialog :ref="transinDialogRef"
                    :stapply_mode="stapply_mode">
    </transin-dialog>
    <trans-exec-dialog ref="execRef" :pk_hi_stapply="pk_hi_stapply_exec" :pk_org="pk_org_exec"
                       @after-exec="request">
    </trans-exec-dialog>
  </ifbp-page>
</template>

<script>
  import EmptyList from '../../../../../common/component/empty-list.vue'
  import TransinDialog from './trans-apply-transin-dialog.vue';
  import TransExecDialog from './trans-apply-exec-dialog.vue';
  import pageModelMixin from "ifbp-business/pageModelMixin";

  let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
  export default {
    mixins: [pageModelMixin],
    components: {
      EmptyList,
      TransinDialog,
      TransExecDialog,
      HrOrgCascader,
    },
    data() {
      const transApplyTransinThis = this;
      return {
        // 功能编码
        funcode: 'funcode=60090transapply',
        // 权限前缀
        permissionPrefix: '/hrtrn/trans/apply',
        // 所有当前页面请求路径
        requestUrl: {
          init: '/pageInit',
          pageList: '/pageList',
          applyPageList: '/applyPageList',
          commit: '/commit',
          callback: '/callback',
          delete: '/delete',
        },

        // 查询模板传入参数
        searchRef:'searchRef',
        tplCode: '60090transinTemplate',
        searchTemplate: {},
        searchTempReady:false,

        // 调入调出标志位
        stapply_mode: '3',

        transinDialogRef: 'transinDialogRef',

        transinRef: 'transin_ref',
        tplId: 'trans_apply_transin_template',
        tableResetFun: function ($node) {
          // 设置审核状态
          let $data_status = $node.find("[prop='approve_state']");
          $data_status.attr('render-type', 'default');
          // 添加查看按钮
          let operateArr = [{
            title: '编辑',
            icon: 'edit',
            vif: "scope.row.approve_state == -1"
          }, {
            title: '提交',
            icon: 'publish',
            vif: "scope.row.approve_state == -1"
          }, {
            title: '收回',
            icon: 'bottom',
            vif: "scope.row.approve_state == 3"
          }, {
            title: '执行',
            icon: 'hr-icon-execute',
            ifbpIconShow: false,
            vif: "scope.row.approve_state == 1"
          },{
            title: '删除',
            icon: 'delete',
            vif: "scope.row.approve_state == -1"
          },{
            title: "查看",
            icon: "search",
          }];
          $data_status.html(
              '<template scope="scope">' +
              '<span v-if="scope.row.approve_state==-1" style="color: #75787B;display: inline-block;line-height: 24px;text-align: center;padding: 0 10px;">待提交</span>' +
              '<span v-if="scope.row.approve_state==3" style="color: #75787B;display: inline-block;line-height: 24px;text-align: center;padding: 0 10px;">待审批</span>' +
              '<span v-if="scope.row.approve_state==2" style="color: #FF9500;display: inline-block;line-height: 24px;text-align: center;padding: 0 10px;">审批中</span>' +
              '<span v-if="scope.row.approve_state==1" style="color: #00A753;display: inline-block;line-height: 24px;text-align: center;padding: 0 10px;">已同意</span>' +
              '<span v-if="scope.row.approve_state==102" style="color: #00A753;display: inline-block;line-height: 24px;text-align: center;padding: 0 10px;">已执行</span>' +
              '<span v-if="scope.row.approve_state==0" style="color: #E60012;display: inline-block;line-height: 24px;text-align: center;padding: 0 10px;">未通过</span>' +
              '</template>'
          );
          let operateHtml = this.getTableOperateHtml(operateArr);
          let $table = $node.find('el-table');
          $table.append(operateHtml);

          // 人员编码
          let code = $node.find("[prop='bill_code']");
          code.html(
              '<template scope="scope">' +
              '<a href="javascript:void(0);" @click="applyDbClick(scope.row)">{{scope.row.bill_code}}</a>' +
              '</template>'
          );
          $table.attr('v-on:row-dblclick', 'applyDbClick');
          return $node[0].outerHTML;
        },
        tableData: {
        },
        tableMethods: {
          transTableEditClick(scope) {
            transApplyTransinThis.$router.push("/hrtrn/transmgt/transapply/detail/" + scope.row.pk_hi_stapply + "/false?" + transApplyTransinThis.funcode)
          },
          tableCellClick:function (data) {
            transApplyTransinThis.$router.push("/hrhi/psninfo/dynamic/" + data.row.pk_psndoc + '?funcode=60070psninfo');
          },
          applyDbClick:function (row) {
            transApplyTransinThis.$router.push("/hrtrn/transmgt/transapply/detail/" + row.pk_hi_stapply + "/false?" + this.funcode);
          }
        },

        // 分页组件传入参数
        totalElements: 0,
        currentPage: 1,
        size: 10,
        pageSize: [10, 20, 30, 40],

        pk_org:'',
        cascaderReady:false,

        tabListData: [],
        emptyText: '未查询到调入人员～',

        // 执行单据
        pk_hi_stapply_exec:'',
        pk_org_exec:'',
      };
    },
    created() {
    },
    methods: {
      ifbpPageInit:function(){
        this.refreshTableList();
      },
      // 请求数据
      request(n, s) {
        let params = {
          pn: !n ? 1 : n,
          ps: !s ? 10 : s,
          stapply_mode: this.stapply_mode,
          pk_org:this.pk_org,
        };
        this.$http({
          url: this.permissionPrefix + this.requestUrl.applyPageList,
          method: "post",
          params: params,
          data: this.searchTemplate
        }).then((res) => {
          if (res.data.status === true) {
            this.tabListData = res.data.data.content;
            this.$refs[this.transinRef].setTableData(this.tabListData);
            this.trnstypeuivos = res.data.trnstypes;
            this.totalElements = res.data.data.totalElements;
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "信息获取失败", type: "error"});
        });
      },
      refreshTableList: function () {
        if(this.searchTempReady && this.cascaderReady){
          this.request(this.currentPage, this.size);
        }
      },
      transinBtn: function () {
        this.$refs[this.transinDialogRef].setDialogVisible(true);
      },
      batchBtn:function () {
        this.$message({message: "该功能未开发！", type: "info"});
      },
      settingBtn:function () {
        this.$refs[this.transinRef].setTransferVisible(true);
      },

      // 级联选择改变后处理
      cascaderChange: function () {
        this.cascaderReady = true;
        this.refreshTableList();

        // 动态获取所有参照的filecode
        let fileCodes = [];
        if (this.searchTemplate) {
          let list = this.searchTemplate.conditionList;
          if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              if("Reference" === list[i].ctrltype){
                fileCodes.push(list[i].fieldcode);
              }
            }
          }
        }
        // 所有的json参数，一定要stringify一下
        let cascaderParams = JSON.stringify({
          pk_org: this.pk_org,
        });
        // 每个参照要传入的参数
        let params = {};
        for (let i = 0; i < fileCodes.length; i++) {
          params[fileCodes[i]] = cascaderParams;
        }
        this.$nextTick(function () {
          this.$refs[this.searchRef].setFilterConditionByFieldCode(params);
        });
      },
      // 查询区点击搜索后的处理
      advancedSearch(searchTemplate) {
        this.searchTemplate = searchTemplate;
        this.request();
      },
      searchReady:function (searchTemplate) {
        this.searchTemplate = searchTemplate;
        this.searchTempReady = true;
        this.cascaderChange();
      },


      // 翻页标签改变每页显示数据
      handleSizeChange(val) {
        this.currentPage = 1;
        this.size = val;
        this.request(1, val);
      },
      // 翻页标签改变当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.request(val, this.size);
      },
      searchTableClick: function (scope) {
        this.$router.push("/hrtrn/transmgt/transapply/detail/" + scope.row.pk_hi_stapply + "/false?" + this.funcode);
      },
      tableEditClick(scope) {
        this.$router.push("/hrtrn/transmgt/transapply/detail/" + scope.row.pk_hi_stapply + "/true?" + this.funcode);
      },
      tableCommitClick(scope){
        let svr = this.$http({
          url: this.permissionPrefix + this.requestUrl.commit,
          method: "post",
          data: JSON.parse(JSON.stringify(scope.row))
        });
        svr.then(res => {
          if (res.data.status === true) {
            if(res.data.execMsg){
              this.$message({message: res.data.execMsg, type: "warning"});
            }else{
              this.$message({message: res.data.msg, type: "success"});
            }
            this.refreshTableList();
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        });
        svr.catch(() => {
          this.$message({message: "提交失败", type: "error"});
        });
      },
      tableExecuteClick(scope){
        this.pk_hi_stapply_exec = scope.row.pk_hi_stapply;
        this.pk_org_exec = scope.row.pk_neworg?scope.row.pk_neworg:this.pk_org;
        this.$refs['execRef'].setDialogVisible(true);
      },
      tableCallBackClick(scope){
        let svr = this.$http({
          url: this.permissionPrefix + this.requestUrl.callback,
          method: "post",
          data: JSON.parse(JSON.stringify(scope.row))
        });
        svr.then(res => {
          if (res.data.status === true) {
            this.$message({message: res.data.msg, type: "success"});
            this.refreshTableList();
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        });
        svr.catch(() => {
          this.$message({message: "收回失败", type: "error"});
        });
      },
      // table行的删除操作
      tableDeleteClick(scope) {
        this.delData = scope.row;
        this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.deleteClick();
        }).catch(() => {
        });
      },
        //选择组织后
        updateOrgPk(val){
            this.pk_org = val;
        },
      // 删除处理
      deleteClick() {
        let svr = this.$http({
          url: this.permissionPrefix + this.requestUrl.delete,
          method: "post",
          data: JSON.parse(JSON.stringify(this.delData))
        });
        svr.then(res => {
          if (res.data.status === true) {
            this.$message({message: res.data.msg, type: "success"});
            this.refreshTableList();
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        });
        svr.catch(() => {
          this.$message({message: "删除失败",});
        });
      },
    }
  };
</script>