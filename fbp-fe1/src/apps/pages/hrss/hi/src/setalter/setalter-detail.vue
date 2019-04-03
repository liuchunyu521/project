<!--
  作者：yangchd
  时间：2018-05-16
  支持：员工信息审核——详情界面
-->
<template>
	<ifbp-page>
    <!--面包屑-->
    <ifbp-breadcrumb name="员工信息审核详情"></ifbp-breadcrumb>

    <!-- 按钮区域 只有待审核的情况才显示 -->
    <ifbp-footer v-if="setalterData.status==1">
      <el-button type="primary" @click="passClick">通过</el-button>
      <el-button @click="unPassClick">不通过</el-button>
    </ifbp-footer>

		<!-- 主体区域 -->
		<ifbp-main-area type="detail">
				<div class="psndoc-top clearfix">
					<div class="psndoc-top-left">
						<img :src="setalterData.photo" @error="errorLoadImg"/>
					</div>
					<div class="psndoc-top-right">
						<div class="psndoc-top-right-line"><span class="span-line-left">变更人:</span><span style="color:#3896FC;">{{setalterData.psnName}}</span></div>
						<div class="psndoc-top-right-line"><span class="span-line-left">所属组织:</span><span style="color: #2d2d2d;">{{setalterData.orgName}}</span></div>
						<div class="psndoc-top-right-line"><span class="span-line-left">所属部门:</span><span style="color: #2d2d2d;">{{setalterData.deptName}}</span></div>
						<div class="psndoc-top-right-line"><span class="span-line-left">变更日期:</span><span style="color: #2d2d2d;">{{setalterData.alterDate}}</span></div>
						<div class="psndoc-top-right-line">
							<span class="span-line-left">审核状态:</span>
							<span v-if="setalterData.status==1" style="background:#F54636;" class="span-line-setalter">待审批</span>
							<span v-if="setalterData.status==2" style="background:#4BD762;" class="span-line-setalter">通过</span>
							<span v-if="setalterData.status==3" style="background:#AFAFAF;" class="span-line-setalter">未通过</span>
						</div>
						<div class="psndoc-top-right-line"><span class="span-line-left">审核人:</span><span style="color: #2d2d2d;">{{setalterData.checker}}</span></div>
					</div>
				</div>
				<div class="psndoc-bottom">
					<div class="tittle" v-text="setalterData.alterSet.infoSetName"></div>
					<div class="type" v-for="items in setalterData.alterSet.rows">
						<div v-if="items.alterType=='2'" class="span-left"><span class="bottom-type-left">问题类型：</span><span class="bottom-type-right">新增</span></div>
						<div v-if="items.alterType=='1'" class="span-left"><span class="bottom-type-left">问题类型：</span><span class="bottom-type-right">修改</span></div>
						<div v-if="items.alterType=='3'" class="span-left"><span class="bottom-type-left">问题类型：</span><span class="bottom-type-right">删除</span></div>
						<div v-for="item in items.alterFields">
							<div style="margin-bottom: 16px;">
								<span class="fields-left">{{item.name}}:</span>
								<!--新旧照片-->
								<div v-if="item.code=='photo'" class="photo">
									<div>
										<img :src="item.oldValue" @error="errorLoadImg"/>
										<p>【修改前照片】</p>
									</div>
									<div>
										<img :src="item.newValue" @error="errorLoadImg"/>
										<p>【修改后照片】</p>
									</div>
								</div>
								<span v-else>
                  <span v-if="item.flag=='2'" class="fields-right" style="background: #DDFADE;">{{item.newValue}}</span>
                  <span v-if="item.flag=='1'" class="fields-right" style="background: #FFE7E7;text-decoration:line-through">{{item.oldValue}}</span>
                  <span v-if="item.flag=='1'" class="fields-right" style="background: #DDFADE;">{{item.newValue}}</span>
                  <span v-if="item.flag=='3'" class="fields-right" style="background: #FFE7E7;text-decoration:line-through">{{item.oldValue}}</span>
								</span>
							</div>
						</div>
					</div>
          <!--审批意见-->
					<div style="text-indent: 16px;margin-top: 20px;" v-if="setalterData.checkNote">
						<span><span class="ifbp-icon-message check-note">审批意见：</span><span class="check-note-right">{{setalterData.checkNote}}</span></span>
					</div>
				</div>
		</ifbp-main-area>

		<!-- 审批意见Dialog -->
    <setalter-dialog :ref="setalterDialogRef"
                     :data="setalterDialogData"
                     :status="setalterDialogStatus"
                     :funcode="funcode" 
                     :requestPrefix="requestPrefix"
                     @listRefresh="returnListPage">
    </setalter-dialog>
	</ifbp-page>
</template>

<script>
import setalterDialog from "./setalter-dialog.vue";
import defaultAvatar from "../../../../../assets/images/hrhi/avatar/default_avatar.png";

export default {
  components: {
    setalterDialog
  },
  data() {
    return {
      // 功能编码
      funcode: "funcode=60420setalter",
      // 接口前缀
      requestPrefix: "/hrss/setalter",
      requestUrl: {
        getByPK: "/getByPK"
      },

      photoURL: "/hrhi/psndoc/getPhotoByPK",

      //主键
      pk_hrss_setalter: this.$root.$router.currentRoute.params["id"],
      setalterData: {
        alterSet: {
          infoSetName: "",
          rows: []
        }
      },
      // 审批意见框Ref
      setalterDialogRef: "setalter_dialog_ref",
      // 审批数据
      setalterDialogData: [],
      // 通过OR不通过
      setalterDialogStatus: true
    };
  },

  mounted() {
    this.request();
  },
  
  methods: {
    // 请求数据
    request() {
      if (!this.pk_hrss_setalter) {
        return;
      }
      let param = {
        pk_hrss_setalter: this.pk_hrss_setalter
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.getByPK,
        method: "post",
        params: param
      })
        .then(res => {
          if (res.data.status === true) {
            this.setalterData = res.data.data;
            this.setalterData.photo = this.photoURL + "?pk_psndoc=" + res.data.data.photo + "&time=" + new Date().getTime();
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        })
        .catch(() => {
          this.$message({ message: "信息获取失败", type: "error" });
        });
    },

    //当图片加载失败以后触发
    errorLoadImg: function(e) {
      e.srcElement.src = defaultAvatar;
    },

    // 通过按钮
    passClick: function() {
      this.setalterDialogStatus = true;
      this.dialogVisibleChange(true);
    },

    // 不通过按钮
    unPassClick: function() {
      this.setalterDialogStatus = false;
      this.dialogVisibleChange(true);
    },

    // dialog显示字段改变
    dialogVisibleChange: function(val) {
      let data = {
        //          data_status:1,
        data_status: this.setalterData.status,
        pk_hrss_setalter: this.pk_hrss_setalter
      };
      this.setalterDialogData = [];
      this.setalterDialogData.push(data);
      this.$refs[this.setalterDialogRef].visibleChange(val);
    },
    returnListPage:function () {
      this.$router.push('/hrss/setalter?'+ this.funcode);
    },

  }
};
</script>

<style scoped="">
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

.psndoc-top {
  background: #f5f8fa;
  height: 168px;
  padding: 16px;
}

.psndoc-top-left img {
  width: 126px;
  height: 168px;
  margin-right: 20px;
}

.psndoc-top-right,
.psndoc-top-left {
  float: left;
}

.psndoc-top-right-line {
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 14px;
}

.span-line-left {
  width: 70px;
  display: inline-block;
  color: #666666;
}

.span-line-setalter {
  color: #fff;
  display: inline-block;
  line-height: 24px;
  text-align: center;
  padding: 0 10px;
  border-radius: 4px;
}

.psndoc-bottom {
  padding: 16px 0 16px 0;
  background: #fff;
  border-top: 1px solid #d1dae4;
}

.psndoc-bottom .tittle {
  font-size: 18px;
  color: #2d2d2d;
  letter-spacing: 0;
  line-height: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-indent: 16px;
}

.psndoc-bottom .type {
  border-bottom: 1px solid #d1dae4;
  text-indent: 16px;
}

.psndoc-bottom .span-left {
  margin-bottom: 34px;
  margin-top: 10px;
}

.bottom-type-left {
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  line-height: 14px;
}

.bottom-type-right {
  font-size: 14px;
  color: #3896fc;
  letter-spacing: 0;
  line-height: 14px;
}

.fields-left {
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  line-height: 14px;
  margin-right: 10px;
}

.fields-right {
  font-size: 14px;
  color: #2d2d2d;
  letter-spacing: 0;
  line-height: 14px;
}

.check-note {
  font-size: 14px;
  color: #3896fc;
  letter-spacing: 0;
  line-height: 14px;
}

.check-note-right {
  font-size: 14px;
  color: #2d2d2d;
  letter-spacing: 0;
  line-height: 14px;
}

.photo {
  width: 340px;
  margin-left: 54px;
  margin-top: -14px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.photo > div {
  width: 155px;
}
.photo > div > p {
  text-align: center;
  text-indent: 0px;
  color: #666666;
  margin-top: 5px;
}
.photo > div img {
  width: 126px;
  height: 168px;
}
</style>