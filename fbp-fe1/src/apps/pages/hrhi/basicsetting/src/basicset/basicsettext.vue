<template>
	<ifbp-page>
		<!--<ifbp-breadcrumb name="基础设置"></ifbp-breadcrumb>-->
		<ifbp-main-area type="list">
			<el-row :gutter="6">
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="setalterAudit" id="hi_set" @click="setalterAudit()">
						<div id="waset">
							<div class="setalterAudit_icon" id="hi_set_icon">
								<img :src="setalterAuditimg" />
							</div>
							<div class="setalterAudit_text" id="hi_set_text">
								<div class="title">人员类别规则设置</div>
								<div class="content">用于设置员工信息项的可见可编辑以及修改后是否需要审核等规则</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="trnstype" id="hi_set" @click="trnstype()">
						<div id="waset">
							<div class="trnstype_icon" id="hi_set_icon">
								<img :src="trnstypeimg" />
							</div>
							<div class="trnstype_text" id="hi_set_text">
								<div class="title">异动类型</div>
								<div class="content">新增、修改、删除异动项目，用于入职、转正、调配、离职业务</div>
							</div>
						</div>
					</div>
				</el-col>
				<!-- 提出磁贴 zyl 2019-01-14 11:05:20 -->
				<!-- <el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="repdef" id="hi_set" @click="repdef()">
						<div id="waset">
							<div class="repdef_icon" id="hi_set_icon">
								<img :src="repdefimg" />
							</div>
							<div class="repdef_text" id="hi_set_text">
								<div class="title">花名册设计</div>
								<div class="content">新增、修改、删除花名册，用于人员信息导出</div>
							</div>
						</div>
					</div>
				</el-col> -->
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="zhuanzheng" id="hi_set" @click="zhuanzheng()">
						<div id="waset">
							<div class="zhuanzheng_icon" id="hi_set_icon">
								<img :src="zhuanzhengimg" />
							</div>
							<div class="zhuanzheng_text" id="hi_set_text">
								<div class="title">转正页面设置</div>
								<div class="content">设置转正申请单使用到的字段</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="diaodong" id="hi_set" @click="diaodong()">
						<div id="waset">
							<div class="diaodong_icon" id="hi_set_icon">
								<img :src="diaodongimg" />
							</div>
							<div class="diaodong_text" id="hi_set_text">
								<div class="title">调动页面设置</div>
								<div class="content">设置调动申请单用到的字段</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="dimission" id="hi_set" @click="dimission()">
						<div id="waset">
						<div class="dimission_icon" id="hi_set_icon">
							<img :src="lzymimg" />
						</div>
						<div class="dimission_text" id="hi_set_text">
							<div class="title">离职页面设置</div>
							<div class="content">设置离职申请单使用到的字段</div>
						</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</ifbp-main-area>
	</ifbp-page>
</template>

<script>
	import setalterAuditimg from "/src/apps/assets/images/hrhi/basicImg/setalterAudit.png"
	import trnstypeimg from "/src/apps/assets/images/hrhi/basicImg/trnstype.png"
	import repdefimg from "/src/apps/assets/images/hrhi/basicImg/repdef.png"
	import zhuanzhengimg from "/src/apps/assets/images/hrhi/basicImg/zhuanzheng.png"
	import diaodongimg from "/src/apps/assets/images/hrhi/basicImg/diaodong.png"
	import lzymimg from "/src/apps/assets/images/hrhi/basicImg/lzym.png"

	export default {
		data() {
			return {
				setalterAuditimg: setalterAuditimg,
				trnstypeimg: trnstypeimg,
				repdefimg: repdefimg,
				zhuanzhengimg: zhuanzhengimg,
				diaodongimg: diaodongimg,
				lzymimg: lzymimg,
			}
		},
		created() {

		},
		methods: {
			getUrlParam() {
				var r = window.parent.vueInstance.$route.query.tilecode
				if(r != null) return r;
				return null;
			},
			
			setalterAudit() {
				var res = this.getUrlParam();
				window.vueInstance.$router.push('/hrpub/psnclrule?funcode=6001012&tilecode=' + res);
			},
			
			trnstype() {
				var res = this.getUrlParam();
				window.vueInstance.$router.push('/hrhi/trnstype?funcode=60070transtype&tilecode=' + res);
			},
			
			repdef() {
				var res = this.getUrlParam();
				window.vueInstance.$router.push('/hrhi/repdef?funcode=60070repdef&tilecode=' + res);
			},
			
			zhuanzheng() {
				var res = this.getUrlParam();
				window.vueInstance.$router.push('/hrtrn/basic/regitem?funcode=60090regitem&tilecode=' + res);
			},
			
			diaodong() {
				var res=this.getUrlParam();
				window.vueInstance.$router.push('/hrtrn/basic/transitem?funcode=60090transitem&tilecode='+res);
			},
			
			dimission() {
				var res=this.getUrlParam();
				window.vueInstance.$router.push('/hrtrn/basic/dimissionitem?funcode=60090dimissionitem&tilecode='+res);
			}
		}
	}
</script>

<style scoped>
	#hi_set {
		/*width: 332px;*/
		height: 112px;
		cursor: pointer;
		background: #FFF;
		border-radius: 4px;
		margin: 0px 5px 16px 5px;
	}
	#hi_set:hover{
		background-color: #e9f7fc;
	}
	#hi_set_icon {
		float: left;
		/*margin-left: 44px;*/
	}
	
	#hi_set_icon img {
		width: 60px;
		height: 60px;
		margin-top: 25px;
	}
	
	#hi_set_text {
		width: 60%;
		height: 60px;
		float: left;
		margin-top: 25px;
		margin-left: 16px;
	}
	
	#hi_set_text .title {
		font-size: 14px;
		color: #333333;
		font-weight: bold;
	}
	
	#hi_set_text .content {
		height: 36px;
		margin-top: 8px;
		font-size: 12px;
		color: #333333;
	}
	
	.list-main-container {
		margin-bottom: -15px;
		padding: 0;
		background: rgba(0,0,0,0);
	}
	
	.top_text {
		font-size: 18px;
		color: #333333;
	}
	#waset{
	    width: 90%;
		margin-left: 10%;
	}
</style>
