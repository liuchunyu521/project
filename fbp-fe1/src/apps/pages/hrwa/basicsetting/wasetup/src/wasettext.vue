<template>
	<div>
	<ifbp-page>
		<!--<ifbp-breadcrumb name="薪酬设置"></ifbp-breadcrumb>-->
		<div class="top_text">基础设置</div>
		<ifbp-main-area type="list">
			<el-row :gutter="6">
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="public_pay" id="wa_set" @click="publicPay()">
						<div id="waset">
							<div class="public_pay_icon" id="wa_set_icon">
								<img :src="ggxzxm"/>
							</div>
							<div class="public_pay_text" id="wa_set_text">
								<div class="title">公共薪资项目</div>
								<div class="content">定义各种薪资项目，设置其数据来源及核算公式</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="wa_period" id="wa_set" @click="waPeriod()">
						<div id="waset">
								<div class="wa_period_icon" id="wa_set_icon">
									<img :src="xzqj"/>
								</div>
								<div class="wa_period_text" id="wa_set_text">
									<div class="title">薪资期间</div>
									<div class="content">支持按月度、年度等各类发薪周期设置薪资期间</div>
								</div>
							</div>	
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="rate_table" id="wa_set" @click="rateTable()">
						<div id="waset">
								<div class="rate_table_icon" id="wa_set_icon">
									<img :src="slb"/>
								</div>
								<div class="rate_table_text" id="wa_set_text">
									<div class="title">税率表</div>
									<div class="content">预置标准税率表，同时支持自定义多个税率表</div>
								</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="wa_rules" id="wa_set" @click="waRules()">
						<div id="waset">
								<div class="wa_rules_icon" id="wa_set_icon">
									<img :src="xzgz"/>
								</div>
								<div class="wa_rules_text" id="wa_set_text">
									<div class="title">薪资规则</div>
									<div class="content">以人员属性确定薪资金额，是一种薪资数据来源</div>
								</div>
							</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="wa_standard" id="wa_set" @click="waStandard()">
						<div id="waset">
								<div class="wa_standard_icon" id="wa_set_icon">
									<img :src="xzbz"/>
								</div>
								<div class="wa_standard_text" id="wa_set_text">
									<div class="title">薪资标准</div>
									<div class="content">企业薪资等级体系结构，是定薪调薪的依据</div>
								</div>
							</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="tax_apply" id="wa_set" @click="taxApply()">
						<div id="waset">
								<div class="tax_apply_icon" id="wa_set_icon">
									<img :src="gssb"/>
								</div>
								<div class="tax_apply_text" id="wa_set_text">
									<div class="title">个税申报表</div>
									<div class="content">设置年收入12万元以上个税申报表中的申报项目</div>
								</div>
							</div>
					</div>
				</el-col>
			</el-row>
		</ifbp-main-area>
	</ifbp-page>
	<ifbp-page>
		<div class="top_text">发放设置</div>
		<ifbp-main-area type="list">
			<el-row :gutter="6">
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="wa_plan" id="wa_set" @click="waPlan()">
						<div id="waset">
							<div class="wa_plan_icon" id="wa_set_icon">
								<img :src="xzfa"/>
							</div>
							<div class="wa_plan_text" id="wa_set_text">
								<div class="title">薪资方案</div>
								<div class="content">根据发放周期、发放人员等设置多种薪资方案</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="plan_permissions" id="wa_set" @click="planPermiss()">
						<div id="waset">
								<div class="plan_permissions_icon" id="wa_set_icon">
									<img :src="faqx"/>
								</div>
								<div class="plan_permissions_text" id="wa_set_text">
									<div class="title">方案权限</div>
									<div class="content">为角色或用户分配薪资方案的查看或处理权限</div>
								</div>
							</div>
					</div>
				</el-col>
				<!--<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="send_project" id="wa_set">
								<div class="send_project_icon" id="wa_set_icon">
									<img :src="ffxm"/>
								</div>
								<div class="send_project_text" id="wa_set_text">
									<div class="title">发放项目</div>
									<div class="content">设置各薪资方案所需的薪资项目及其核算规则</div>
								</div>
					</div>
				</el-col>-->
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="project_permissions" id="wa_set" @click="projectPermiss()">
						<div id="waset">
								<div class="project_permissions_icon" id="wa_set_icon">
									<img :src="xmqx"/>
								</div>
								<div class="project_permissions_text" id="wa_set_text">
									<div class="title">项目权限</div>
									<div class="content">为角色或用户分配薪资项目的查看或处理权限</div>
								</div>
							</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="wa_sum" id="wa_set" @click="waSum()">
						<div id="waset">
								<div class="wa_sum_icon" id="wa_set_icon">
									<img :src="hzxzfa"/>
								</div>
								<div class="wa_sum_text" id="wa_set_text">
									<div class="title">汇总薪资方案</div>
									<div class="content">将薪资方案按照一定的划分方式进行归类汇总</div>
								</div>
							</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6">
					<div class="tax_sum" id="wa_set" @click="taxSum()">
						<div id="waset">
								<div class="tax_sum_icon" id="wa_set_icon">
									<img :src="hbjsfa"/>
								</div>
								<div class="tax_sum_text" id="wa_set_text">
									<div class="title">合并计税方案</div>
									<div class="content">设置薪资方案合并计税组</div>
								</div>
							</div>
					</div>
				</el-col>
			</el-row>
		</ifbp-main-area>
	</ifbp-page>
	</div>
</template>

<script>
	import ggxzxm from "../img/ggxzxm@2x.png"
	import xzqj from "../img/xzqj@2x.png"
	import slb from "../img/slb@2x.png"
	import xzgz from "../img/xzgz@2x.png"
	import xzbz from "../img/xzbz@2x.png"
	import gssb from "../img/gssb@2x.png"
	import xzfa from "../img/xzfa@2x.png"
	import faqx from "../img/faqx@2x.png"
	import ffxm from "../img/ffxm@2x.png"
	import xmqx from "../img/xmqx@2x.png"
	import hzxzfa from "../img/hzxzfa@2x.png"
	import hbjsfa from "../img/hbjsfa@2x.png"
	
	
	export default {
		data(){
			return {
				ggxzxm:ggxzxm,
				xzqj:xzqj,
				slb:slb,
				xzgz:xzgz,
				xzbz:xzbz,
				gssb:gssb,
				xzfa:xzfa,
				faqx:faqx,
				ffxm:ffxm,
				xmqx:xmqx,
				hzxzfa:hzxzfa,
				hbjsfa:hbjsfa
			}
		},
		created(){
			
		},
		methods: {
				getUrlParam(){
					var r=window.parent.vueInstance.$route.query.tilecode
						if (r != null) return r;
						return null;
				},
				waPlan(){
					var res=this.getUrlParam();
					window.parent.location.hash='/hrwa/waclass?funcode=60130waclass&tilecode='+res;
				},
				waRules(){
					var res=this.getUrlParam();
					window.parent.location.hash='/hrwa/warule/info?funcode=60130payrule&tilecode='+res;
				},
				waStandard(){
					var res=this.getUrlParam();
					window.parent.location.hash='/hrwa/wagrade/info?funcode=60130paystd&tilecode='+res;
				},
				publicPay(){
					var res=this.getUrlParam();
					window.parent.location.hash='/hrwa/waitem/waItemInfo?funcode=60130glbitem&tilecode='+res;
				},
				waPeriod(){
					  this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				},
				rateTable(){
					this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				},
				taxApply(){
					this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				},
				planPermiss(){
					this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				},
				projectPermiss(){
					this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				},
				waSum(){
					this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				},
				taxSum(){
					this.$message({
				          showClose: true,
				          message: '开发中'
				        });
				}
		}
	}
	
</script>

<style scoped="scoped">
	#wa_set{
		/*width: 332px;*/
		height: 112px;
		cursor: pointer;
		background: #FFF;
		border-radius: 4px;
		margin: 0px 5px 16px 5px;
	}
	#wa_set:hover{
		background-color: #e9f7fc;
	}
	#wa_set_icon{
		float: left;
		/*margin-left: 44px;*/
	}
	#wa_set_icon img{
		width: 60px;
		height: 60px;
		margin-top: 25px;
	}
	#wa_set_text{
		width: 60%;
		height: 60px;
		float: left;
		margin-top: 25px;
		margin-left: 16px;
	}
	#wa_set_text .title{
		font-size: 14px;
		color: #333333;
		font-weight: bold;
	}
	#wa_set_text .content{
		height: 36px;
    	margin-top: 8px;
    	font-size: 12px;
		color: #333333;
	}
	.list-main-container{
		margin-bottom: -15px;
		padding: 0;
		background: rgba(0,0,0,0);
	}
	.top_text{
		font-size: 14px;
		color: #333333;
	}
	#waset{
	    width: 80%;
		margin-left: 16%;
	}
</style>