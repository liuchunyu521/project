<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工信息维护-卡片列表页面
-->
<template>
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="员工信息维护" v-show="false"></ifbp-breadcrumb>

    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader  name="employee"
                        @update:pk_org="val => {this.pk_org = val}"
                        @update:pk_hrorg="val => {this.pk_hrorg = val}"
                        @update:pk_dept="val => {this.pk_dept = val}"
                        busiRegion="psndoc"
                        :needDept="true"
                        @change="orgCascaderChange">
      </hr-org-cascader>
      <ifbp-search  class="fr"
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
    <ifbp-main-area type="list">
      <!--卡片列表切换区域-->
      <div style="width:100%;height:32px;">
        <psndoc-card-list :isList="isList"
                          @change_card="change2card"
                          @change_list="change2list"
                          @set_show_item="setShowItem">
          <span slot="text_btn">
            <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="signTag">设置标签</el-button>
            <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="createUser">生成自助用户</el-button>
            <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="exportRepDef">导出花名册</el-button>
            <i class="hr-icon-swap_vert marginleft16 notActive" @click="psnOrderBtn" title="人员排序"></i>
          </span>
        </psndoc-card-list>
      </div>
      <!-- 列表 -->
      <ifbp-template  v-show="isList"
                      :ref="templateRef"
                      tpl-id="hrhi_employee_info"
                      class="uitemplate-no-top"
                      :table-show-menu="false"
                      :tpl-data="psndocTableData"
                      :tplResetFun="psndocTableResetFun"
                      :methods="tableFormMethods"
                      @edit-table-click="psndocTableEditClick">
      </ifbp-template>

      <!--卡片-->
      <psndoc-card  v-show="!isList"
                    :psndocCardData="employeeCardData"
                    btnType="employee"
                    @edit-card-click="psndocTableEditClick"
                    @refreshCard="refreshTableList">
      </psndoc-card>
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

    <!--花名册-->
    <psndoc-rep-def :ref="repDefRef"
                    :funcode="funcode"
                    :requestPrefix="requestPrefix"
                    :pk_org="pk_org"
                    :pks="pk_psndocs">
    </psndoc-rep-def>

    <psn-order ref="psnOrderRef" :pk_org="pk_org" :pk_dept="pk_dept" @refresh="refreshTableList"></psn-order>
    <tag-dialog ref="tagDialogRef" :pk_org="pk_org"></tag-dialog>
  </ifbp-page>
</template>

<script>

import PsndocCard from '../components/psndoc-card.vue';
import PsndocCardList from '../components/psndoc-card-list.vue';
import PsndocRepDef from '../components/psndoc-dialog-repdef.vue';
import psnOrder from './employee-psn-order.vue';
import tagDialog from '../../../../../common/component/tag-dialog.vue';

let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

export default {
  mixins: [pageModelMixin],
  components: {
    hrOrgCascader,
    PsndocCard,
    PsndocCardList,
    PsndocRepDef,
    psnOrder,
    tagDialog,
  },

  data() {
    const employeeInfoThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60070employee',
      // 接口前缀
      requestPrefix: '/hrhi/employee',
      // 当前页面所有请求路径
      requestUrl: {
        list: '/pageList',
        createUser: '/createUser',
      },

      photoURL: '/hrhi/psndoc/getPhotoByPK',

      employeeCardData: [],

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
      tplCode: 'hrhiEmployeeSearch',
      optionCountBeforeMore: 4,
      searchTemplate: {},
      searchTempReady: false,

      // UI模板传入参数
      templateRef: 'ref_psndoc_l',

      psndocTableResetFun: function ($node) {
        // 双击行事件
        let $table = $node.find('el-table');
        $table.attr('v-on:row-dblclick', 'dblClick');

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

        let detail = [{
          title: "编辑",
          icon: "edit",
          vif: "tableOperVif",
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
        // table行的编辑操作
        psndocTableEditClick(scope) {
          employeeInfoThis.detailPage(scope.row.pk_psndoc);
        },
        // 双击行事件
        dblClick(row) {
          $('.tooltip-normal').hide();
          employeeInfoThis.detailPage(row.pk_psndoc);
        },
        
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 12,
      pageSize: [12, 24, 36, 48],

      //卡片和列表标志位
      isList: true,

      //花名册框
      repDefRef: 'repDefDialog',
      // 导出当前时，选择的数据
      pk_psndocs: [],

    };
  },

  created() {
    // this.employeeTableListInit();
  },

  methods: {
    ifbpPageInit: function () {
      this.refreshTableList();
    },

    // 列表初始化
    employeeTableListInit() {
      this.request();
    },

    //刷新table
    refreshTableList: function () {
      if(this.searchTempReady && this.orgCascaderReady){
        this.request(this.currentPage, this.size);
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
          // 有数据时，对列表图片进行转换
          let resultData = res.data.data.content;
          if (resultData) {
            for (let i = 0; i < resultData.length; i++) {
              resultData[i].imgPath = this.photoURL + "?pk_psndoc=" + resultData[i].pk_psndoc + "&compression=true&ts=" + (new Date()).getTime();
            }
          }
          this.employeeCardData = resultData;
          this.$refs[this.templateRef].setTableData(resultData);
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

    // 设置标签
    signTag: function () {
        // 选择的数据
        let selected = this.$refs[this.templateRef].getTableComp().getSelection();
        if (!selected || selected.length == 0) {
            this.$message({ message: "请选择要设置标签的用户！", type: "warning" });
            return;
        }

        let psndocs = [];
        for (let i = 0; i < selected.length; i++) {
            let row = selected[i];
            psndocs.push(row.pk_psndoc);
        }
        this.$refs.tagDialogRef.showDialogForList(psndocs);
    },

    // 生成自助用户
    createUser: function () {
      // 选择的数据
      let selected = this.$refs[this.templateRef].getTableComp().getSelection();
      if (!selected || selected.length == 0) {
        this.$message({ message: "请选择要生成的用户！", type: "warning" });
        return;
      }

      let psndocs = [];
      for (let i = 0; i < selected.length; i++) {
        let row = selected[i];
        psndocs.push(row);
      }

      let data = {
				psndocs: psndocs,
			};

      this.$http({
        url: this.requestPrefix + this.requestUrl.createUser,
        method: "post",
        data: JSON.parse(JSON.stringify(data)),
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "生成自助用户失败：", type: "error" });
      });
    },

    // 导出花名册
    exportRepDef: function () {
      let selected = this.$refs[this.templateRef].getTableComp().getSelection();
      let pks = [];
      if (selected && selected.length > 0) {
        for (let i = 0; i < selected.length; i++) {
          pks.push(selected[i].pk_psndoc);
        }
      }
      this.pk_psndocs = pks;
      this.$refs[this.repDefRef].setDialogVisible(true)
    },

    psnOrderBtn:function () {
      if(!this.pk_dept){
        this.$message({ message: "请先选择要排序的部门！", type: "info" });
      }else{
        this.$refs['psnOrderRef'].setDialogVisible(true);
      }
    },

    // table行的编辑操作
    psndocTableEditClick(scope) {
      this.detailPage(scope.row.pk_psndoc);
    },

    // 详情页面跳转
    detailPage: function (pk_psndoc) {
      this.$router.push("/hrhi/employee/dynamic/" + pk_psndoc + "?" + this.funcode);
    },

    // 级联选择改变后处理
    orgCascaderChange: function () {

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
            if("Reference" === list[i].ctrltype){
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
      this.request(1, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.request(val, this.size);
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
      this.$refs[this.templateRef].setTransferVisible(true);
    },

  }
};
</script>

<style>
#searchLeftCheck .el-checkbox__input {
  position: relative;
  top: -5px;
}
</style>

