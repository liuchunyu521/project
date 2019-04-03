<!--
  作者：yangchd
  时间：2018-08-30
  支持：员工管理——员工调动
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="员工调动" v-show="false"></ifbp-breadcrumb>
    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader name="trans_transfer"
                       v-if="isInit"
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
    <ifbp-main-area type="list" class="paddingTop0" id="trans_transfer_id">
      <el-tabs v-model="transferType" :has-bottom-border="false" :is-normal-type="false" :tab-position-top="true" @tab-click="transferHandleClick">
        <div slot="header" style="float: right;padding-top: 6px;">
          <!--<el-button type="text" @click="batchBtn">批量调动</el-button>-->
          <i class="ifbp-icon-setting" style="cursor: pointer;color: #C8C8CD;margin-bottom: 8px;vertical-align: bottom;" @click="settingBtn"></i>
        </div>
        <el-tab-pane label="全部人员" name="1"></el-tab-pane>
        <el-tab-pane label="调动申请" name="2"></el-tab-pane>
      </el-tabs>
      <div v-if="isInit" v-show="totalElements>0">
        <ifbp-template v-show="transferType==='1'"
                       :ref="allPsnRef"
                       class="uitemplate-no-top"
                       :table-show-menu="false"
                       tpl-id="trans_apply_transfer_all"
                       :tpl-data="tableData"
                       id="trans_transfer_all_id"
                       :tpl-reset-fun="psnTableResetFun"
                       @after-create="refreshTableList"
                       :methods="tableMethods"
                       @trans-table-click="transTableClick">
        </ifbp-template>
        <ifbp-template v-show="transferType==='2'"
                       :ref="transingRef"
                       class="uitemplate-no-top"
                       :table-show-menu="false"
                       tpl-id="trans_apply_transfer_ing"
                       :tpl-data="tableData"
                       :tpl-reset-fun="tableResetFun"
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
    <trans-dialog ref="ddRef" :stapply_mode="stapply_mode"></trans-dialog>
    <trans-exec-dialog ref="execRef" :pk_hi_stapply="pk_hi_stapply_exec" :pk_org="pk_org_exec"
                       @after-exec="request">
    </trans-exec-dialog>
  </ifbp-page>
</template>

<script>
  import EmptyList from '../../../../../common/component/empty-list.vue'
  import TransDialog from './dd-dialog.vue';
  import TransExecDialog from './trans-apply-exec-dialog.vue';
  import pageModelMixin from "ifbp-business/pageModelMixin";

  let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
  export default {
    mixins: [pageModelMixin],
    components: {
      EmptyList,
      TransDialog,
      TransExecDialog,
      HrOrgCascader,
    },
    data() {
      const TransApplyTransferThis = this;
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
        cascaderReady:false,
        pk_org:'',
        // 查询模板传入参数
        searchRef:'searchRef',
        tplCode: '60090transapplyTemplate',
        searchTemplate: {},
        searchTempReady:false,

        stapply_mode: '1',
        transferType: '1',

        isInit: false,

        allPsnRef: 'allPsnRef',
        transingRef: 'transingRef',
        psnTableResetFun: function ($node) {
          let $table = $node.find('el-table');
          let operateHtml = this.getTableOperateHtml(TransApplyTransferThis.iconsContent,'right',200,'text');
          while (operateHtml.indexOf('(scope)') !== -1){
            operateHtml = operateHtml.replace('(scope)', '');
          }
          $table.append(operateHtml);
          return $node[0].outerHTML;
        },
        tableResetFun: function ($node) {
          // 设置审核状态
          let $data_status = $node.find("[prop='approve_state']");
          $data_status.attr('render-type', 'default');
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
          transClick: function (data, scope) {
            TransApplyTransferThis.transTableClick(scope.row.pk_psnjob,data);
          },
          transTableEditClick(scope) {
            TransApplyTransferThis.$router.push("/hrtrn/transmgt/transapply/detail/" + scope.row.pk_hi_stapply + "/false?" + TransApplyTransferThis.funcode)
          },
          tableCellClick:function (data) {
            TransApplyTransferThis.$router.push("/hrhi/psninfo/dynamic/" + data.row.pk_psndoc + '?funcode=60070psninfo');
          },
          applyDbClick:function (row) {
            TransApplyTransferThis.$router.push("/hrtrn/transmgt/transapply/detail/" + row.pk_hi_stapply + "/false?" + this.funcode);
          }
        },
        htmlContent: '',
        iconsContent:[],

        // 分页组件传入参数
        totalElements: 0,
        currentPage: 1,
        size: 10,
        pageSize: [10, 20, 30, 40],

        tabListData: [],
        emptyText: '未查询到调动人员～',

        // 执行单据
        pk_hi_stapply_exec:'',
        pk_org_exec:'',
      };
    },
    created() {
      this.pageInit();
    },
    methods: {
      ifbpPageInit:function(){
        this.refreshTableList();
      },
      // 获取页面的基本数据
      pageInit: function () {
        this.$http({
          url: this.permissionPrefix + this.requestUrl.init,
          method: "post",
        }).then((res) => {
          if (res.data.status === true) {
            this.trnstypeuivos = res.data.trnstypes;
            if (this.trnstypeuivos && this.trnstypeuivos.length > 0) {
              let html =
                  '<el-table-column label="" width="152" v-if="tableOperColumnVif"  class-name="table-operate-column" header-align="center" >' +
                  '<template scope="scope">';
              let data = [];
              let icons = [];
              for (let i = 0; i < this.trnstypeuivos.length; i++) {
                data.push(this.trnstypeuivos[i]);
                let icon = {
                  title:this.trnstypeuivos[i].trnstypename,
                  icon:'edit',
                  click:'transClick(trnstypeData[' + i + '],scope)',
                };
                icons.push(icon);
                html += '<i v-if="tableOperVif" class="el-table-operate-icon" @click="transClick(trnstypeData[' + i + '],scope)">' + this.trnstypeuivos[i].trnstypename + '</i>';
              }
              html += '</template>' + '</el-table-column>';
              this.htmlContent = html;
              this.iconsContent = icons;
              this.tableData.trnstypeData = data;
            }
            this.isInit = true;
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "信息获取失败", type: "error"});
        });
      },
      // 请求数据
      request(n, s) {
        let url = this.permissionPrefix;
        if (this.transferType === '1') {
          url += this.requestUrl.pageList;
        } else {
          url += this.requestUrl.applyPageList;
        }
        let params = {
          pn: !n ? 1 : n,
          ps: !s ? 10 : s,
          stapply_mode: '1',
          pk_org:this.pk_org,
        };
        this.$http({
          url: url,
          method: "post",
          params: params,
          data: this.searchTemplate
        }).then((res) => {
          if (res.data.status === true) {
            this.tabListData = res.data.data.content;
            if (this.transferType === '1') {
              this.$refs[this.allPsnRef].setTableData(res.data.data.content);
            } else if (this.transferType === '2') {
              this.$refs[this.transingRef].setTableData(res.data.data.content);
            }
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

      batchBtn:function () {
        this.$message({message: "该功能未开发！", type: "info"});
      },
      settingBtn:function () {
        if (this.transferType === '1') {
          this.$refs[this.allPsnRef].setTransferVisible(true);
        } else if (this.transferType === '2') {
          this.$refs[this.transingRef].setTransferVisible(true);
        }
      },
      transTableClick: function (pk_psnjob, data) {
        this.$refs['ddRef'].show(pk_psnjob, data);
      },

      // 页签切换
      transferHandleClick: function (tab) {
        this.transferType = tab.name;
        this.currentPage = 1;
        this.size = 10;
        this.refreshTableList();
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
            if (res.data.execMsg) {
              this.$message({message: res.data.execMsg, type: "warning"});
            } else {
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
        this.pk_org_exec = scope.row.pk_org;
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

<style>
  #trans_transfer_id .el-tabs > div {
    margin-left: 0px;
  }

  /*#trans_transfer_all_id .table-operate-column .cell {*/
    /*margin-right: 16px !important;*/
  /*}*/
</style>