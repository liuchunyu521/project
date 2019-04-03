<!--
  亲属规避-列表页面
  @author zyl
  @date 2018-12-06
-->
<template>
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="亲属规避" v-show="false"></ifbp-breadcrumb>

    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader  name="familyavoid"
                        @update:pk_org="val => {this.pk_org = val}"
                        @update:pk_hrorg="val => {this.pk_hrorg = val}"
                        @update:pk_dept="val => {this.pk_dept = val}"
                        busiRegion="psndoc"
                        :needDept="true"
                        @change="cascaderChange">
      </hr-org-cascader>
      <ifbp-search  class="fr"
                    :ref="searchRef"
                    :no-breadcrumb-search="true"
                    :template-code="tplCode"
                    @ready="searchReady"
                    @search="advancedSearch">
      </ifbp-search>

      <div class="fr" id="searchLeftCheck" style="margin-right: 15px;height: 32px;">
        <el-checkbox v-if="includeChildrenShow" v-model="includeChildren" @change="refreshTableList">包含下级</el-checkbox>
      </div>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- 列表 -->
      <ifbp-template
        :ref="templateRef"
        tpl-id="familyavoid-list"
        class="uitemplate-no-top"
        :table-show-menu="false"
        :tplResetFun="psndocTableResetFun"
        :methods="tableFormMethods"
      ></ifbp-template>

      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSize"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
      ></el-pagination>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>

let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
import PsndocCardList from '../components/psndoc-card-list.vue';

import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins: [pageModelMixin],
  components: {
    HrOrgCascader,
    PsndocCardList,
  },

  data() {
    const familyavoidInfoThis = this;
    return {
      // 功能编码
      funcode: 'funcode=60070familyavoid',
      // 接口前缀
      requestPrefix: '/hrhi/familyavoid',
      // 当前页面所有请求路径
      requestUrl: {
        pageList: '/pageList',
      },
      photoURL: '/hrhi/psndoc/getPhotoByPK',

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

        let $table = $node.find('el-table');
        $table.attr('v-on:row-dblclick', 'dblClick');

        let $photo = $node.find("[prop='photo']");
        $photo.html(
          '<template scope="scope">' +
          '<img  :src="scope.row.imgPath" alt="" @error="errorLoadInfoImg" style="width: 24px;height: 32px">' +
          '</template>'
        );

        // 人员编码
        let code = $node.find("[prop='family_num']");
        code.html(
          '<template scope="scope">' +
          '<a href="javascript:void(0);" @click="psndocTableEditClick(scope)">{{scope.row.family_num}}</a>' +
          '</template>'
        );

        // 资料完整度
        let profile_cmplt_ptg = $node.find("[prop='profile_cmplt_ptg']");
        profile_cmplt_ptg.html(
          '<template scope="scope">' +
          '<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.profile_cmplt_ptg" :status="scope.row.profile_status"></el-progress>' +
          '</template>'
        );
      },

      tableFormMethods: {
        // 图片加载失败
        errorLoadInfoImg: function (e) {
          e.srcElement.src = defaultAvatarMin;
        },
        // table行的编辑操作
        psndocTableEditClick(scope) {
          familyavoidInfoThis.detailPage(scope.row.pk_psndoc);
        },
        // 双击行事件
        dblClick(row) {
          $('.tooltip-normal').hide();
          familyavoidInfoThis.detailPage(row.pk_psndoc);
        },

      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      pageSize: [10, 20, 30, 40],

    };
  },

  created() {
    // this.familyavoidTableListInit();
  },

  methods: {
    ifbpPageInit: function () {
      this.refreshTableList();
    },

    // 列表初始化
    familyavoidTableListInit() {
      this.request();
    },

    //刷新table
    refreshTableList: function () {
      if (this.searchTempReady && this.orgCascaderReady) {
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
        pageSize: pageSize || 10,
        pk_org: this.pk_org,
        pk_hrorg: this.pk_hrorg,
        pk_dept: this.pk_dept,
        includeChildren: this.includeChildren,
      };

      this.$http({
        url: this.requestPrefix + this.requestUrl.pageList,
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

    // table行的编辑操作
    psndocTableEditClick(scope) {
      this.detailPage(scope.row);
    },

    // 详情页面跳转
    detailPage: function (pk_psndoc) {
      this.$router.push("/hrhi/familyavoid/detail/" + pk_psndoc + "?" + this.funcode);
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

  }
};
</script>

<style>
#searchLeftCheck .el-checkbox__input {
  position: relative;
  top: -5px;
}
</style>

