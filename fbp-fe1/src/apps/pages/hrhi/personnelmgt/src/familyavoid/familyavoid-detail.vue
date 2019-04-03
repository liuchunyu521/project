<!--
  作者：zyl
  时间：2018-12-06
  支持：亲属规避-详情页面
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="亲属信息详情"></ifbp-breadcrumb>
    <div>
      <div class="person-info clearfix">
        <div class="person-img fl">
          <img :src="imgSrc" @error="errorLoadImg()"/>
        </div>
        <div class="person-details fl">
          <p class="person-base">
            <span class="psndoc_name">{{ psndoc_name }}</span>
            <span class="psncl_name">{{ psncl_name }}</span>
          </p>
          <p class="person-job">
            <span>{{ org_name }}</span>
            <span>|</span>
            <span>{{ dept_name }}</span>
            <span>|</span>
            <span>{{ job_name }}</span>
          </p>
        </div>
      </div>
    </div>
    <ifbp-main-area type="list">
      <ifbp-template :ref="templateRef" tpl-id="familyavoid-detail" :tpl-data="psndocTableData"></ifbp-template>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

export default {
  mixins: [pageModelMixin],
  data() {
    return {
    	imgSrc:'',
      psndoc_name: '',
      psncl_name: '',
      org_name: '',
      dept_name: '',
      job_name: '',
      templateRef: 'familyInfoDetails',
      psndocTableData: {},
      pk_psndoc: this.$root.$router.currentRoute.params['id'],
    }
  },

  created() {

  },

  mounted() {
    this.getBaseInfo();
    this.pageListSub();
  },

  methods: {
  	errorLoadImg: function() {
			this.imgSrc = '../i_hr/ifbp_hr/assets/images/hrhi/familyavoiddetails/peple.png';
		},
    pageListSub() {
      this.$http({
        url: "/hrhi/familyavoid/pageListSub",
        method: "post",
        params: { 
          pk_psndoc: this.pk_psndoc 
        }
      }).then((res) => {
        if (res.data.status === true) {
          this.$refs[this.templateRef].setTableData(res.data.data.content);
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

    getBaseInfo() {
      this.$http({
        url: "/hrhi/familyavoid/getBaseInfoByPK",
        method: "post",
        params: {
          pk_psndoc: this.pk_psndoc,
        }
      }).then((res) => {
        if (res.data.status === true) {
          let data = res.data.data;
          let psndoc = data.psndoc;
          let psnjob = data.psnjob;
          this.psndoc_name = psndoc.name;
          this.psncl_name = psnjob.beanMap.pk_psncl_ref[psnjob.pk_psncl]['name'];
          this.org_name = psnjob.beanMap.pk_org_ref[psnjob.pk_org]['name'];
          this.dept_name = psnjob.beanMap.pk_dept_ref[psnjob.pk_dept]['name'];
          if (psnjob.pk_job) {
            this.job_name = psnjob.beanMap.pk_job_ref[psnjob.pk_job]['name'];
          }
          this.imgSrc = "/hrhi/psndoc/getPhotoByPK?pk_psndoc=" + this.pk_psndoc + "&compression=true"
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
    }
  }
}
</script>

<style scoped>
.person-info {
  height: 60px;
  padding: 16px;
}
.person-img img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.person-details p {
  height: 30px;
  line-height: 30px;
  margin-left: 10px;
}
.psndoc_name {
  font-size: 18px;
  color: #0089FA;
}
.psncl_name {
  font-size: 12px;
color: #2D2D2D;
letter-spacing: 0;
line-height: 12px;
}
.person-job {
  font-size: 12px;
color: #666666;
letter-spacing: 0;
line-height: 12px;
}
</style>
