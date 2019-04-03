<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工信息查询-卡片列表页面
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="员工信息查询" v-show="false"></ifbp-breadcrumb>

    <!-- 按钮区域 -->
    <ifbp-button-area :no-breadcrumb="true">
      <hr-org-cascader name="psninfo"
                       @update:pk_org="val => {this.pk_org = val}"
                       @update:pk_dept="val => {this.pk_dept = val}"
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
        <el-checkbox v-model="includeChildren" @change="refreshTableList">包含下级</el-checkbox>
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
            <el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="exportRepDef">导出花名册</el-button>
          </span>
        </psndoc-card-list>
      </div>
      <!-- UI模板组件 -->
      <ifbp-template v-show="isList"
                     :ref="templateRef"
                     tpl-id="hrhi_psninfo_info"
                     class="uitemplate-no-top"
                     :table-show-menu="false"
                     :tpl-data="psndocTableData"
                     :methods="tableFormMethods"
                     :tplResetFun="psndocTableResetFun"
                     @search-table-click="psninfoDetailClick">
      </ifbp-template>
      <!--卡片-->
      <psndoc-card v-show="!isList"
                   :psndocCardData="psninfoCardData"
                   btnType="psninfo"
                   @edit-card-click="psninfoDetailClick">
      </psndoc-card>
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

    <!--花名册-->
    <psndoc-rep-def :ref="repDefRef"
                    :funcode="funcode"
                    :requestPrefix="requestPrefix"
                    :pk_org="pk_org"
                    :pks="pk_psndocs">
    </psndoc-rep-def>

    <!--导出干部信息-->
    <psndoc-cadres :ref="cadresRef"
                   :funcode="funcode"
                   :pks="pk_psndocs"
                   :requestPrefix="requestPrefix">
    </psndoc-cadres>

  </ifbp-page>
</template>

<script>

let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
import PsndocCard from '../components/psndoc-card.vue';
import PsndocCardList from '../components/psndoc-card-list.vue';
import PsndocRepDef from '../components/psndoc-dialog-repdef.vue';

import PsndocCadres from '../components/psndoc-dialog-cadres.vue';
import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

export default {
    mixins: [pageModelMixin],
    components: {
      hrOrgCascader,
      PsndocCard,
      PsndocCardList,
      PsndocRepDef,
      PsndocCadres,
    },
    data() {
      const psnInfoDetailThis = this;
      return {
        // 功能编码
        funcode:'funcode=60070psninfo',
        // 接口前缀
        requestPrefix:'/hrhi/psninfo',
        // 所有当前页面请求路径
        requestUrl:{
          pageList:'/pageList',
        },

        photoURL: '/hrhi/psndoc/getPhotoByPK',

        // 组织级联加载完毕
        orgCascaderReady:false,

        // 组织部门主键
        pk_org:'',
        pk_dept:'',

        // 是否包含下级
        includeChildren: false,

        // 查询模板传入参数
        searchRef:'searchRef',
        tplCode:'hrhiPsninfoSearch',
        optionCountBeforeMore:4,
        searchTemplate: {},
        searchTempReady: false,

        // UI模板传入参数
        templateRef: 'ref_psndoc_l',

        psndocTableData: {},
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
          let code = $node.find("[prop='code']");
          code.html(
              '<template scope="scope">' +
              '<a href="javascript:void(0);" @click="psninfoDetailClick(scope)">{{scope.row.code}}</a>' +
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
            title: "查看",
            icon: "search",
            vif: "tableOperVif",
          }];

          let operateHtml = this.getTableOperateHtml(detail);
          // by yangchd 2018-11-12去掉查询的操作列
          // $table.append(operateHtml);
          return $node[0].outerHTML;
        },
        
        tableFormMethods: {
          // 图片加载失败
          errorLoadInfoImg: function (e) {
            e.srcElement.src = defaultAvatarMin;
          },
          // 点击行超链接事件
          psninfoDetailClick: function (scope) {
            psnInfoDetailThis.detailPage(scope.row.pk_psndoc);
          },
          // 双击行事件
          dblClick(row) {
            $('.tooltip-normal').hide();
            psnInfoDetailThis.detailPage(row.pk_psndoc);
          },
        },
        
        // 分页组件传入参数
        totalElements: 0,
        currentPage: 1,
        size: 12,
        pageSize: [12, 24, 36, 48],

        // 卡片和列表标志位
        isList: true,

        // 卡片页面数据
        psninfoCardData: [],

        //花名册框
        repDefRef: 'repDefDialog',
        // 干部信息
        cadresRef: 'cadresDialog',
        pk_psndocs:[],
      };
    },

    created() {
//      this.psninfoTableListInit();
    },

    methods: {
      ifbpPageInit:function(){
        this.refreshTableList();
      },

      //列表初始化
      psninfoTableListInit() {
        this.request();
      },

      // 刷新table
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
          pk_dept: this.pk_dept,
          includeChildren: this.includeChildren,
        };
        this.$http({
          url: this.requestPrefix + this.requestUrl.pageList,
          method: "post",
          data:this.searchTemplate,
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
            this.psninfoCardData = resultData;
            this.totalElements = res.data.data.totalElements;
            this.size = res.data.data.size;
          } else {
            this.$message({ 
              message: res.data.msg, 
              type: "error" 
            });
          }
        }).catch(() => {
          this.$message({message: "信息获取失败", type: "error"});
        });
      },

      // 详情跳转
      psninfoDetailClick: function (scope) {
        this.detailPage(scope.row.pk_psndoc);
      },

      // 详情页面跳转
      detailPage:function (pk_psndoc) {
        this.$router.push("/hrhi/psninfo/dynamic/" + pk_psndoc + "?" + this.funcode);
      },

      // 刷新操作
      refreshPsndocTable: function () {
        this.refreshTableList();
      },

      // 级联选择改变后处理
      cascaderChange: function () {
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
      searchReady:function (searchTemplate) {
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
      change2card(){
        this.isList = false;
      },

      //切换列表页面
      change2list(){
        this.isList = true;
      },

      // 显示列隐藏
      setShowItem: function () {
        this.$refs[this.templateRef].setTransferVisible(true);
      },

      //导出花名册
      exportRepDef: function () {
        let selected = this.$refs[this.templateRef].getTableComp().getSelection();
        let pks = [];
        if(selected && selected.length > 0){
          for(let i = 0;i<selected.length;i++){
            pks.push(selected[i].pk_psndoc);
          }
        }
        this.pk_psndocs = pks;
        this.$refs[this.repDefRef].setDialogVisible(true)
      },

    }
  };
</script>

<style>
  #searchLeftCheck .el-checkbox__input {
    position:relative;
    top:-5px;
  }
</style>
