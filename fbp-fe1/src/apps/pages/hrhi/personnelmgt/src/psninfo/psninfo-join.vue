<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工信息查询-联查页面
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="联查人员"></ifbp-breadcrumb>

    <!-- 按钮区域 -->
    <ifbp-button-area>
      <div class="psninfo-join-div" v-if="org_name"><p class="psninfo-join-p" v-text="org_name_show"></p></div>
      <div class="psninfo-join-div" v-if="dept_name"><p class="psninfo-join-p" v-text="dept_name_show"></p></div>
      <div class="psninfo-join-div" v-if="post_name"><p class="psninfo-join-p" v-text="post_name_show"></p></div>
      <div class="psninfo-join-div" v-if="job_name"><p class="psninfo-join-p" v-text="job_name_show"></p></div>
    </ifbp-button-area>

    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!--卡片列表切换区域-->
      <div style="width:100%;height:32px;">
        <psndoc-card-list :isList="isList"
                          @change_card="change2card"
                          @change_list="change2list"
                          @set_show_item="setShowItem">
        </psndoc-card-list>
      </div>
      <!-- UI模板组件 -->
      <ifbp-template  v-show="isList"
                      :ref="templateRef"
                      tpl-id="hrhi_psninfo_join"
                      class="uitemplate-no-top"
                      :table-show-menu="false"
                      :tpl-data="psndocTableData"
                      :methods="tableFormMethods"
                      :tplResetFun="psndocTableResetFun">
      </ifbp-template>
      <!--卡片-->
      <psndoc-card v-show="!isList"
                   :psndocCardData="psninfoCardData">
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

  </ifbp-page>
</template>

<script>
import PsndocCard from '../components/psndoc-card.vue';
import PsndocCardList from '../components/psndoc-card-list.vue';
import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins: [pageModelMixin],
  components: {
    PsndocCard,
    PsndocCardList,
  },
  data() {
    return {
      // 功能编码
      funcode: 'funcode=60070psninfo',
      // 权限前缀
      requestPrefix: '/hrhi/psndoc',
      requestUrl: {
        pageList: '/pageList',
      },

      photoURL: '/hrhi/psndoc/getPhotoByPK',

      // 联查条件
      pk_org: this.$route.query['pk_org'],
      pk_dept: this.$route.query['pk_dept'],
      pk_post: this.$route.query['pk_post'],
      pk_job: this.$route.query['pk_job'],

      // 所属组织 所属部门 岗位名称 职务名称
      org_name: this.$route.query['org_name'],
      dept_name: this.$route.query['dept_name'],
      post_name: this.$route.query['post_name'],
      job_name: this.$route.query['job_name'],

      // UI模板传入参数
      templateRef: 'ref_psndoc_l',
      psndocTableData: {},

      psndocTableResetFun: function ($node) {
        let $photo = $node.find("[prop='photo']");
        $photo.html(
          '<template scope="scope">' +
          '<img  :src="scope.row.imgPath" alt="" @error="errorLoadInfoImg" style="width: 24px;height: 32px">' +
          '</template>'
        );
        let profile_cmplt_ptg = $node.find("[prop='profile_cmplt_ptg']");
        profile_cmplt_ptg.html(
          '<template scope="scope">' +
          '<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.profile_cmplt_ptg" :status="scope.row.profile_status"></el-progress>' +
          '</template>'
        );
        return $node[0].outerHTML;
      },

      tableFormMethods: {
        // 图片加载失败
        errorLoadInfoImg: function (e) {
          e.srcElement.src = defaultAvatarMin;
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

    };
  },

  computed: {
    org_name_show: function () {
      return "所属组织：" + this.org_name;
    },
    dept_name_show: function () {
      return "所属部门：" + this.dept_name;
    },
    post_name_show: function () {
      return "岗位名称：" + this.post_name;
    },
    job_name_show: function () {
      return "职务名称：" + this.job_name;
    },
  },

  created() {
    this.psninfoTableListInit();
  },

  methods: {
    ifbpPageInit: function () {
      this.refreshTableList();
    },
    //列表初始化
    psninfoTableListInit() {
      this.request();
    },

    // 请求数据
    request(pageNum, pageSize) {
      let param = {
        pageNum: pageNum || 1,
        pageSize: pageSize || 12,
        pk_org: this.pk_org,
        pk_dept: this.pk_dept,
        pk_post: this.pk_post,
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.pageList + "?" + this.funcode,
        method: "post",
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
      }).catch((res) => {
        this.$message({ message: "信息获取失败" + res, type: "error" });
      });
    },

    // 刷新table
    refreshTableList: function () {
      this.request(this.currentPage, this.size);
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

    // 显示列隐藏
    setShowItem: function () {
      this.$refs[this.templateRef].setTransferVisible(true);
    },

  }
};
</script>

<style scoped>
.psninfo-join-div {
  display: inline-block;
  padding-right: 50px;
}

.psninfo-join-p {
  font-size: 14px;
  color: #333333;
  line-height: 14px;
}

.operator-container {
  max-height: 64px;
  padding-top: 25px;
  padding-bottom: 25px;
}
</style>
