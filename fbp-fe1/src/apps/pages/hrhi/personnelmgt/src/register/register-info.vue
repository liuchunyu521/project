<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工入职-列表卡片页面
  修改：2018-10-30修改，在本页面添加入职申请功能
-->
<template>
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="员工入职" v-show="false"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader name="register"
                       @update:pk_org="val => {this.pk_org = val}"
                       @update:pk_hrorg="val => {this.pk_hrorg = val}"
                       @update:pk_dept="val => {this.pk_dept = val}"
                       busiRegion="psndoc"
                       :needDept="true"
                       @change="cascaderChange">
      </hr-org-cascader>
      <ifbp-search class="fr"
                   :ref="searchRef"
                   :no-breadcrumb-search="true"
                   :template-code="tplCode"
                   @ready="searchReady"
                   @search="advancedSearch">
      </ifbp-search>
      <div class="fr" id="searchLeftCheck"  style="margin-right: 15px;height: 32px;">
        <el-checkbox v-if="includeChildrenShow" v-model="includeChildren" @change="refreshTableList">包含下级</el-checkbox>
      </div>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list" class="paddingTop0" id="register_info_id">
      <el-upload
              v-show="false"
              ref="upload"
              class="upload-demo"
              accept=".xlsx,.xls"
              :action="requestPrefix + 'upload?'+funcode"
              :show-file-list="false"
              :auto-upload="true"
              :before-upload="beforeUploadFunc"
              :on-success="handleUploadSuccess">
      </el-upload>
      <el-tabs v-model="registerType" :has-bottom-border="false" :is-normal-type="false" :tab-position-top="true" @tab-click="registerHandleClick">
        <div slot="header" style="float: right;padding-top: 12px;">
          <psndoc-card-list :isList="isList"
                            :changeShow="registerType==='1'"
                            @change_card="change2card"
                            @change_list="change2list"
                            @set_show_item="setShowItem">
            <span slot="text_btn" v-if="registerType==='1'">
              <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="addRegister">新增</el-button>
              <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="importRegister">导入</el-button>
              <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="downTemplate">下载模板</el-button>
              <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="multiIntoDoc">转档</el-button>
              <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="newEntryFormAction">发起申请</el-button>
            </span>
          </psndoc-card-list>
        </div>
        <el-tab-pane label="待入职" name="1">
          <!-- 列表 -->
          <ifbp-template v-show="isList"
                         :ref="templateRef"
                         class="uitemplate-no-top"
                         tpl-id="hrhi_register_info"
                         :table-show-menu="false"
                         :tpl-data="psndocTableData"
                         :tplResetFun="psndocTableResetFun"
                         :methods="tableFormMethods"
                         @edit-table-click="psndocTableEditClick"
                         @delete-table-click="psndocTableDeleteClick"
                         @publish-table-click="tableEntryAction"
                         @exit-to-app-table-click="psndocTableIntodocClick">
          </ifbp-template>
          <!--卡片-->
          <psndoc-card v-show="!isList"
                       :psndocCardData="registerCardData"
                       btnType="register"
                       @edit-card-click="psndocTableEditClick"
                       @delete-card-click="psndocTableDeleteClick"
                       @exit-to-app-card-click="psndocTableIntodocClick"
                       @publish-card-click="tableEntryAction">
          </psndoc-card>
        </el-tab-pane>
        <el-tab-pane label="入职申请" name="2">
          <ifbp-template :ref="entryApplyRef"
                         class="uitemplate-no-top"
                         tpl-id="hrhi_entrymng_apply"
                         :table-show-menu="false"
                         :tpl-data="entryTableData"
                         :tpl-reset-fun="entryTableResetFun"
                         :methods="entryTableMethods"
                         @search-table-click="searchTableClick"
                         @edit-table-click="tableEditClick"
                         @publish-table-click="tableCommitClick"
                         @hr-icon-execute-table-click="tableExecuteClick"
                         @bottom-table-click="tableCallBackClick"
                         @delete-table-click="tableDeleteClick">
          </ifbp-template>
        </el-tab-pane>
      </el-tabs>

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

    <!--转档dialog-->
    <psndoc-dialog-into-doc :ref="intoDocDialogRef" 
                            :dialogData="intoDocDialogData"
                            @after_into_doc="refreshTableList">
    </psndoc-dialog-into-doc>
    <register-exec-dialog ref="execRef"
                          :pk_entryapply="pk_exec" 
                          :pk_org="pk_org_exec"
                          @after-exec="refreshTableList">
    </register-exec-dialog>

  </ifbp-page>
</template>

<script>

let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

import PsndocCard from '../components/psndoc-card.vue';
import PsndocCardList from '../components/psndoc-card-list.vue';
import PsndocDialogIntoDoc from '../components/psndoc-dialog-intodoc.vue';
import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import RegisterExecDialog from './register-apply-exec-dialog.vue';

export default {
  mixins: [pageModelMixin],
  components: {
    hrOrgCascader,
    PsndocCard,
    PsndocCardList,
    PsndocDialogIntoDoc,
    RegisterExecDialog,
  },
  data() {
    const registerInfoThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60070register',
      // 接口前缀
      requestPrefix: '/hrhi/register/',

      // 当前页面所有请求路径
      requestUrl: {
        list: 'pageList',
        applyList: 'applyList',
        delete: 'delete',
        insertEntry: 'insertEntry',
        saveEntry: 'saveEntry',
        commitEntry: 'commitEntry',
        callbackEntry: 'callbackEntry',
        deleteEntry: 'deleteEntry',
        execBill: 'execBill',
      },
      photoURL: '/hrhi/psndoc/getPhotoByPK',

      registerCardData: [],

      // 组织级联加载完毕
      orgCascaderReady: false,

      // 组织部门主键
      pk_org: '',
      pk_hrorg: '',
      pk_dept: '',

      // 包含下级
      includeChildrenShow: true,
      includeChildren: false,

      // 查询模板传入参数
      searchRef: 'searchRef',
      tplCode: 'hrhiRegisterSearch',
      optionCountBeforeMore: 4,
      searchTemplate: {},
      searchTempReady: false,

      // 页签
      registerType: '1',

      // UI模板传入参数
      templateRef: 'ref_psndoc_l',

      psndocTableData: {},
      psndocTableResetFun: function ($node) {
        let $table = $node.find('el-table');
        $table.attr('v-on:row-dblclick', 'dblClick');

        // 设置列表页面头像
        let $photo = $node.find("[prop='photo']");
        $photo.html(
          '<template scope="scope">' +
          '<img  :src="scope.row.imgPath" alt="" @error="errorLoadInfoImg" style="width: 24px;height: 32px">' +
          '</template>'
        );

        // 人员编码
        let code = $node.find("[prop='code']");
        code.html(
          '<template scope="scope">' +
          '<a href="javascript:void(0);" @click="psndocTableEditClick(scope)">{{scope.row.code}}</a>' +
          '</template>'
        );

        // 资料完整度
        let profile_cmplt_ptg = $node.find("[prop='profile_cmplt_ptg']");
        profile_cmplt_ptg.html(
          '<template scope="scope">' +
          '<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.profile_cmplt_ptg" :status="scope.row.profile_status"></el-progress>' +
          '</template>'
        );

        let intoDocIcon = [
          {
            title: "转档",
            icon: "exit-to-app",
          },
          {
            title: "发起申请",
            icon: "publish",
          }
        ];
        let operateHtml = this.getBaseTableOperateHtml(intoDocIcon);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      tableFormMethods: {
        // 图片加载失败
        errorLoadInfoImg: function (e) {
          e.srcElement.src = defaultAvatarMin;
        },
        // 点击行超链接事件
        psndocTableEditClick(scope) {
          registerInfoThis.detailPage(scope.row.pk_psndoc);
        },
        // 双击行事件
        dblClick(row) {
          $('.tooltip-normal').hide();
          registerInfoThis.detailPage(row.pk_psndoc);
        },
      },

      // 入职申请页面
      entryApplyRef: 'entryApplyRef',
      entryTableData: {},
      entryTableResetFun: function ($node) {
        // 人员编码
        let code = $node.find("[prop='bill_code']");
        code.html(
          '<template scope="scope">' +
          '<a href="javascript:void(0);" @click="applyDbClick(scope.row)">{{scope.row.bill_code}}</a>' +
          '</template>'
        );
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
        }, {
          title: '删除',
          icon: 'delete',
          vif: "scope.row.approve_state == -1"
        }, {
          title: "查看",
          icon: "search",
        }];
        let operateHtml = this.getTableOperateHtml(operateArr);
        let $table = $node.find('el-table');
        $table.append(operateHtml);
        $table.attr('v-on:row-dblclick', 'applyDbClick');
        return $node[0].outerHTML;
      },

      entryTableMethods: {
        tableCellClick: function (data) {
          registerInfoThis.$router.push("/hrhi/psninfo/dynamic/" + data.row.pk_psndoc + '?funcode=60070psninfo');
        },
        applyDbClick: function (row) {
          registerInfoThis.$router.push("/hrhi/register/apply/" + row.pk_entryapply + "/false?");
        }
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 12,
      pageSize: [12, 24, 36, 48],

      //卡片和列表标志位
      isList: true,

      // 转档dialog
      intoDocDialogRef: 'register_intoDoc_dialog',
      intoDocDialogData: [],

      // 执行参数
      pk_exec: '',
      pk_org_exec: '',

    };
  },

  methods: {
    ifbpPageInit: function () {
      this.refreshTableList();
    },

    // 刷新table
    refreshTableList: function () {
      if (this.searchTempReady && this.orgCascaderReady) {
        if (this.registerType === '1') {
          this.request(this.currentPage, this.size);
        } else if (this.registerType === '2') {
          this.requestApply(this.currentPage, this.size);
        }
      }
    },

    // 请求数据
    request(pageNum, pageSize) {

      // 没有组织，一定不能请求数据
      if (!this.pk_org) {
        return;
      }

      let param = {
        pageNum: pageNum || 1,
        pageSize: pageSize || 12,
        pk_org: this.pk_org,
        pk_hrorg: this.pk_hrorg,
        pk_dept: this.pk_dept,
        includeChildren: this.includeChildren,
      };

      this.$http({
        url: this.requestPrefix + this.requestUrl.list,
        method: "post",
        data: this.searchTemplate,
        params: param,
      }).then((res) => {
        if (res.data.status === true) {
          //有数据时，对列表图片进行转换
          let resultData = res.data.data.content;
          if (resultData) {
            for (let i = 0; i < resultData.length; i++) {
              resultData[i].imgPath = this.photoURL + "?pk_psndoc=" + resultData[i].pk_psndoc + "&compression=true&ts=" + (new Date()).getTime();
            }
          }
          this.$refs[this.templateRef].setTableData(resultData);
          this.registerCardData = resultData;
          this.totalElements = res.data.data.totalElements;
          this.size = res.data.data.size;
        } else {
          this.$message({ 
            message: res.data.msg, 
            type: "error" 
          });
        }
      }).catch(() => {
        this.$message({ message: "信息获取失败", type: "error" });
      });
    },

    // 请求入职申请数据
    requestApply(pageNum, pageSize) {
      let param = {
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        pk_org: this.pk_org,
        pk_dept: this.pk_dept,
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.applyList,
        method: "post",
        params: param,
        data: this.searchTemplate,
      }).then((res) => {
        let resultData = res.data.data.content;
        this.$refs[this.entryApplyRef].setTableData(resultData);
        this.totalElements = res.data.data.totalElements;
      }).catch(() => {
        this.$message({ message: "信息获取失败", type: "error" });
      });
    },

    // table行的编辑操作
    psndocTableEditClick(scope) {
      this.detailPage(scope.row.pk_psndoc);
    },

    // table行的删除操作
    psndocTableDeleteClick(scope) {
      this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.delPsn = scope.row;
        this.psnDeleteClick();
      }).catch(() => {
        // 这里加取消逻辑
      });
    },

    // 删除处理
    psnDeleteClick() {
      let delData = [];
      delData.push(this.delPsn);
      let para = {
        delData: delData
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.delete,
        method: "post",
        data: para,
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.refreshTableList();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch((res) => {
        this.$message({ message: "请求失败:" + res, type: "error" });
      });
    },

    // table转档点击
    psndocTableIntodocClick: function (scope) {
      this.singleIntoDoc(scope.row);
    },

    //上传前校验
    beforeUploadFunc(file){
        debugger;
        let fileName = file.name;
        if (fileName.lastIndexOf(".xls") === fileName.length - 4 || fileName.lastIndexOf(".xlsx") === fileName.length - 5) {
            return true;
        }else{
            this.$message({message: "请选择Excel文件上传！", type: "error"});
            return false;
        }
    },
    //上传成功后处理
    handleUploadSuccess(res, file){
        let reMap = res;
        if(reMap.status === true){
            this.$message({message: reMap.msg, type: "success"});
            this.refreshTableList();
        }else{
            this.$message({message: reMap.msg, type: "error"});
        }
    },
    downTemplate(){
        window.location.href = "/hrhi/register/downloadExcel" + "?" + this.funcode;
    },
    //导入人员
    importRegister(){
        this.$refs['upload'].$children[0].handleClick();
    },

    // 跳转到入职新增页面
    addRegister() {
      let url = "/hrhi/register/add" + "?" + this.funcode;
      let params = {
        pk_org: this.pk_org,
        pk_dept: this.pk_dept,
      };
      this.$router.push({ path: url, query: params });
    },

    // 详情页面跳转
    detailPage: function (pk_psndoc) {
      this.$router.push("/hrhi/register/dynamic/" + pk_psndoc + "?" + this.funcode);
    },

    // 单个转档提示
    singleIntoDoc(item) {
      if (!item) {
        this.$message({ message: "请先选择要转档的员工！", type: 'warning' });
      } else {
        let psndocs = [];
        psndocs.push(item);
        this.intoDocDialogData = psndocs;
        this.$nextTick(() => {
          this.$refs[this.intoDocDialogRef].setDialogVisible(true);
        });
      }
    },

    // 批量转档提示
    multiIntoDoc() {
      //将tableList的地址传给dialog
      let tableSelections = this.$refs[this.templateRef].comp.$refs[this.templateRef].getSelection();
      if (!tableSelections || tableSelections.length === 0) {
        this.$message({ message: "请先选择要转档的员工！", type: 'warning' });
      } else {
        let psndocs = [];
        for (let i = 0; i < tableSelections.length; i++) {
          let row = tableSelections[i];
          psndocs.push(row);
        }
        this.intoDocDialogData = psndocs;
        this.$nextTick(() => {
          this.$refs[this.intoDocDialogRef].setDialogVisible(true);
        });
      }
    },

    // table上的入职申请按钮
    tableEntryAction: function (scope) {
      let pks = [];
      pks.push(scope.row.pk_psndoc);
      this.$confirm('生成入职单据后，请在入职申请中查看单据状态。', '提示', {
        closeOnClickModal: false,
        type: 'info'
      }).then(() => {
        this.entryApplyByPks(pks);
      }).catch(() => {
      });
    },

    // 入职申请
    newEntryFormAction: function () {
      let tableSelections = this.$refs[this.templateRef].getTableComp().getSelection();
      if (tableSelections && tableSelections.length > 0) {
        let pks = [];
        for (let i = 0; i < tableSelections.length; i++) {
          pks.push(tableSelections[i].pk_psndoc);
        }
        this.$confirm('生成入职单据后，请在入职申请中查看单据状态。', '提示', {
          closeOnClickModal: false,
          type: 'info'
        }).then(() => {
          this.entryApplyByPks(pks);
        }).catch(() => {
        });
      } else {
        this.$message({ message: "请先选择要生成入职申请的员工！", type: 'warning' });
      }
    },

    entryApplyByPks: function (pks) {
      let param = {
        pk_psndocs: pks.join(','),
        pk_org: this.pk_org,
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.insertEntry,
        method: "post",
        params: param,
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.refreshTableList();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "提交失败", type: "error" });
      });
    },

    searchTableClick: function (scope) {
      this.$router.push("/hrhi/register/apply/" + scope.row.pk_entryapply + "/false?" + this.funcode);
    },

    tableEditClick(scope) {
      this.$router.push("/hrhi/register/apply/" + scope.row.pk_entryapply + "/true?" + this.funcode);
    },

    tableCommitClick(scope) {
      let svr = this.$http({
        url: this.requestPrefix + this.requestUrl.commitEntry,
        method: "post",
        data: scope.row,
      });
      svr.then(res => {
        if (res.data.status === true) {
          if (res.data.execMsg) {
            this.$message({ message: res.data.execMsg, type: "warning" });
          } else {
            this.$message({ message: res.data.msg, type: "success" });
          }
          this.refreshTableList();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      });
      svr.catch(() => {
        this.$message({ message: "提交失败", type: "error" });
      });
    },

    tableExecuteClick(scope) {
      this.pk_exec = scope.row.pk_entryapply;
      this.pk_org_exec = scope.row.pk_org;
      this.$refs['execRef'].setDialogVisible(true);
    },

    tableCallBackClick(scope) {
      let svr = this.$http({
        url: this.requestPrefix + this.requestUrl.callbackEntry,
        method: "post",
        data: scope.row
      });
      svr.then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.refreshTableList();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      });
      svr.catch(() => {
        this.$message({ message: "收回失败", type: "error" });
      });
    },

    // table行的删除操作
    tableDeleteClick(scope) {
      this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.applyDeleteClick(scope.row);
      }).catch(() => {
      });
    },

    // 删除处理
    applyDeleteClick(data) {
      let svr = this.$http({
        url: this.requestPrefix + this.requestUrl.deleteEntry,
        method: "post",
        data: data,
      });
      svr.then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.refreshTableList();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      });
      svr.catch(() => {
        this.$message({ message: "删除失败", });
      });
    },

    // 页签切换
    registerHandleClick: function (tab) {
      this.registerType = tab.name;
      this.isList = true;
      if (this.registerType === '1') {
        this.currentPage = 1;
        this.size = 12;
        this.pageSize = [12, 24, 36, 48];
        this.includeShow = true;
      } else if (this.registerType === '2') {
        this.currentPage = 1;
        this.size = 10;
        this.pageSize = [10, 20, 30, 40];
        this.includeShow = false;
      }
      this.refreshTableList();
    },

    // 级联选择改变后处理
    cascaderChange: function () {

      // 委托组织，不显示“包含下级” zyl 2019-01-16 12:58:12
      if (this.pk_org != this.pk_hrorg) {
        this.includeChildrenShow = false;
        this.includeChildren = false;
      } else {
        this.includeChildrenShow = true;
      }

      this.orgCascaderReady = true;

      this.currentPage = 1;

      this.refreshTableList();

      // 动态获取所有参照的filecode
      let fileCodes = [];
      if (this.searchTemplate) {
        let list = this.searchTemplate.conditionList;
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if ("Reference" === list[i].ctrltype) {
              fileCodes.push(list[i].fieldcode);
            }
          }
        }
      }
      // 所有的json参数，一定要stringify一下
      let cascaderParams = JSON.stringify({
        pk_org: this.pk_org,
        pk_dept: this.pk_dept,
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
      this.currentPage = 1;
      this.searchTemplate = searchTemplate;
      this.refreshTableList();
    },

    // 查询模板加载完毕
    searchReady: function (searchTemplate) {
      this.searchTemplate = searchTemplate;
      this.searchTempReady = true;
      this.refreshTableList();
    },

    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.currentPage = 1;
      this.size = val;
      this.refreshTableList();
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshTableList();
    },

    // 切换卡片页面
    change2card() {
      this.isList = false;
    },

    //切换列表页面
    change2list() {
      this.isList = true;
    },

    setShowItem: function () {
      if (this.registerType === '1') {
        this.$refs[this.templateRef].setTransferVisible(true);
      } else if (this.registerType === '2') {
        this.$refs[this.entryApplyRef].setTransferVisible(true);
      }
    },

  }
};
</script>

<style>
#register_info_id .el-tabs > div {
  margin-left: 0px;
}
#searchLeftCheck .el-checkbox__input {
  position: relative;
  top: -5px;
}
</style>
