<!--
  作者：yangchd
  时间：2018-05-16
  支持：员工信息审核——列表界面
-->
<template>
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="员工信息审核" v-show="false"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader  name="setalter_info"
                        @update:pk_org="val => {this.pk_org = val}"
                        @update:pk_hrorg="val => {this.pk_hrorg = val}"
                        @update:pk_dept="val => {this.pk_dept = val}"
                        busiRegion="psndoc"
                        :needDept="false"
                        @change="refreshTableList">
      </hr-org-cascader>
      <ifbp-search  class="fr"
                    :no-breadcrumb-search="true"
                    :template-code="tplCode"
                    @search="advancedSearch">
      </ifbp-search>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <div class="ifbp-btn-line">
        <div class="fr">
          <el-button type="text" class=" ifbp-layout-content-right-button marginleft24" @click="passClick">通过</el-button>
          <el-button type="text" class=" ifbp-layout-content-right-button marginleft24" @click="unPassClick">不通过</el-button>
          <i class="ifbp-icon-setting marginleft16" @click="settingBtn"></i>
        </div>
      </div>
      <!-- 列表 -->
      <ifbp-template  :ref="setalterTemplateRef"
                      class="uitemplate-no-top"
                      :tpl-id="setalterTemplateId"
                      :tpl-data="setalterTableData"
                      :table-show-menu="false"
                      :tplResetFun="setalterTableResetFun"
                      :methods="tableFormMethods"
                      @search-table-click="setalterTableDetailClick">
      </ifbp-template>

      <!--分页组件-->
      <el-pagination  @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSize"
                      :page-size="size"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalElements">
      </el-pagination>
    </ifbp-main-area>

    <!-- 审批意见Dialog -->
    <setalter-dialog  :ref="setalterDialogRef"
                      :data="setalterDialogData"
                      :status="setalterDialogStatus"
                      :funcode="funcode" 
                      :requestPrefix="requestPrefix"
                      @listRefresh="refreshTableList">
    </setalter-dialog>

  </ifbp-page>
</template>

<script>
import setalterDialog from './setalter-dialog.vue';
import defaultAvatarMin from "../../../../../assets/images/hrhi/avatar/default_avatar_min.png";

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

export default {
  mixins: [pageModelMixin],
  components: {
    setalterDialog,
    hrOrgCascader,
  },
  
  data() {
    const setalterInfoThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60420setalter',
      // 接口前缀
      requestPrefix: '/hrss/setalter',
      requestUrl: {
        list: '/pageList',
      },

      photoURL: '/hrhi/psndoc/getPhotoByPK',

      // 组织部门主键
      pk_org: '',
      pk_hrorg: '',
      pk_dept: '',

      // 查询模板传入参数
      tplCode: 'hrss_setalter',
      optionCountBeforeMore: 4,
      searchTemplate: {},

      // 审批意见框Ref
      setalterDialogRef: 'setalter_dialog_ref',
      // 审批数据
      setalterDialogData: [],
      // 通过OR不通过
      setalterDialogStatus: true,

      // UI模板传入参数
      setalterTemplateRef: 'ref_setalter_l',
      setalterTemplateId: 'hrss_setalter_info',
      setalterTableData: {},

      setalterTableResetFun: function ($node) {
        let $table = $node.find('el-table');
        $table.attr('v-on:row-dblclick', 'dblClick');

        // 设置列表页面头像
        let $photo = $node.find("[prop='photo']");
        $photo.attr('render-type', 'default');
        $photo.html(
          '<template scope="scope">' +
          '<img  :src="scope.row.imgPath" alt="" @error="errorLoadInfoImg" style="width: 24px;height: 32px">' +
          '</template>'
        );

        // 变更人
        let psndoc = $node.find("[prop='pk_psndoc']");
        psndoc.attr('render-type', 'default');
        psndoc.html(
          '<template scope="scope">' +
          '<a href="javascript:void(0);" @click="setalterDetailClick(scope)">{{scope.row.beanMap.pk_psndoc_ref[scope.row.pk_psndoc].name}}</a>' +
          '</template>'
        );

        // 设置审核状态
        let $data_status = $node.find("[prop='data_status']");
        $data_status.attr('render-type', 'default');
        $data_status.html(
          '<template scope="scope">' +
          '<span v-if="scope.row.data_status==1" style="color: #fff;display: inline-block;background:#F54636;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">待审批</span>' +
          '<span v-if="scope.row.data_status==2" style="color: #fff;display: inline-block;background:#4BD762;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">通过</span>' +
          '<span v-if="scope.row.data_status==3" style="color: #fff;display: inline-block;background:#AFAFAF;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">未通过</span>' +
          '</template>'
        );

        let detail = [{
          title: "查看",
          icon: "search",
        }];
        let operateHtml = this.getTableOperateHtml(detail);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },
      tableFormMethods: {
        // 图片加载失败
        errorLoadInfoImg: function (e) {
          e.srcElement.src = defaultAvatarMin;
        },
        // 点击行超链接事件
        setalterDetailClick(scope) {
          setalterInfoThis.$router.push("/hrss/setalter/detail/" + scope.row.pk_hrss_setalter + "?" + setalterInfoThis.funcode);
        },
        // 双击行事件
        dblClick(row) {
          setalterInfoThis.$router.push("/hrss/setalter/detail/" + row.pk_hrss_setalter + "?" + setalterInfoThis.funcode);
        },
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
    
    // 刷新table
    refreshTableList: function () {
      this.request(this.currentPage, this.size);
    },

    // 请求数据
    request(pageNum, pageSize) {
      let param = {
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        pk_org: this.pk_org,
        pk_hrorg: this.pk_hrorg,
      };
      
      this.$http({
        url: this.requestPrefix + this.requestUrl.list,
        method: "post",
        data: this.searchTemplate,
        params: param,
      }).then((res) => {
        let resultData = res.data.data.content;
        if (resultData) {
          for (let i = 0; i < resultData.length; i++) {
            resultData[i].imgPath = this.photoURL + "?pk_psndoc=" + resultData[i].pk_psndoc + "&compression=true";
          }
        }
        this.$refs[this.setalterTemplateRef].setTableData(resultData);
        this.totalElements = res.data.data.totalElements;
        this.size = res.data.data.size;
      }).catch(() => {
        this.$message({ message: "信息获取失败", type: "error" });
      });
    },

    // 通过按钮
    passClick: function () {
      this.setalterDialogStatus = true;
      this.openSetalterDialog();
    },

    // 不通过按钮
    unPassClick: function () {
      this.setalterDialogStatus = false;
      this.openSetalterDialog();
    },

    // 打开审批Dialog
    openSetalterDialog: function () {
      this.setalterDialogData = this.getSelectedData();
      if (this.setalterDialogData && this.setalterDialogData.length > 0) {
        this.dialogVisibleChange(true);
      } else {
        this.$message({
          message: "请选择要审批的数据",
          type: "warning"
        });
      }
    },

    // 获取当前选择的数据
    getSelectedData: function () {
      return this.$refs[this.setalterTemplateRef].getTableComp().getSelection();
    },

    // 查询区点击搜索后的处理
    advancedSearch(searchTemplate) {
      this.currentPage = 1;
      this.searchTemplate = searchTemplate;
      this.refreshTableList();
    },

    // 详情跳转
    setalterTableDetailClick(scope) {
      this.$router.push("/hrss/setalter/detail/" + scope.row.pk_hrss_setalter + "?" + this.funcode);
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

    // dialog显示字段改变
    dialogVisibleChange: function (val) {
      this.$refs[this.setalterDialogRef].visibleChange(val);
    },

    settingBtn: function () {
      this.$refs[this.setalterTemplateRef].setTransferVisible(true);
    },

  }
};
</script>