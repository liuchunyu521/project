<template>
	<div>
		<!-- y-breadcrumb-box begin -->
		<div class="y-breadcrumb-box">
			<el-breadcrumb separator="/"> 
			  <!--<el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>-->
			  <el-breadcrumb-item>我的薪资</el-breadcrumb-item> 
			  <el-breadcrumb-item>个税申报表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- y-breadcrumb-box end -->
		
		<!--查询界面开始-->
		<div class="L-salaryinner">
			<div class="L-salarytittle">
				<span style="margin-right: 40px; color: #333;font-size: 16px;" >
				  所得年份：
				  <el-select v-model="value" placeholder="请选择" style="width: 100px;">
				    <el-option
				      v-for="item in options"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
				</span>
				<el-button type="primary" class='y-btn-search' style="margin-left: 20px;" @click="search()">查询</el-button>
			</div>
			
			
			
			<!--查询的内容-->
			<ul class="L-salarylistwrap">
				<div style="margin-left: 50%;margin-top: 15%;" v-show="reportdata==''">
					<img style="margin-left: -42px;" src="../../assets/img/nodata.png" alt="" />
					<div style="font-size: 14px;color:#BFBFBF;margin-left: -42px;">请选择您要查询的年</div>
				</div>
				
		
				<table v-if="reportdata!=''" class="reportwrap" style="border-left:1px solid #dedede ;border-bottom:1px solid #dedede ;margin-bottom: 10px;" width="100%" border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td class="line bg">纳税人姓名：</td>
						<td class="line">{{reportdata.psndoc.psnname}}</td>
						<td class="line bg">国家地区：</td>
						<td class="line">{{reportdata.psndoc.countryname}}</td>
						<td class="line bg">身份照类型：</td>
						<td class="line">{{reportdata.psndoc.idtype}}</td>
					</tr>
					<tr>
						<td class="line bg">身份照号码：</td>
						<td class="line">{{reportdata.psndoc.id}}</td>
						<td class="line bg">任职受雇单位识别号（社会信用代码）</td>
						<td class="line">{{reportdata.psndoc.workcorpCode}}</td>
						<td class="line bg">任职受雇单位：</td>
						<td class="line">{{reportdata.psndoc.workcorp}}</td>
					</tr>
					<tr>
						<td class="line bg">任职受雇单位所属行业：</td>
						<td class="line">{{reportdata.psndoc.comindstry}}</td>
						<td class="line bg">职务：</td>
						<td class="line">{{reportdata.psndoc.dutyname}}</td>
						<td class="line bg">职业：</td>
						<td class="line">{{reportdata.psndoc.vocation}}</td>
					</tr>
					<tr>
						<td class="line bg">在华天数：</td>
						<td class="line">{{reportdata.psndoc.incndays}}</td>
						<td class="line bg">境内有限联系地址：</td>
						<td class="line">{{reportdata.psndoc.addr}}</td>
						<td class="line bg">境内有限联系地址邮编：</td>
						<td class="line">{{reportdata.psndoc.postalcode}}</td>
					</tr>
					<tr>
						<td class="line bg">联系电话：</td>
						<td class="line">{{reportdata.psndoc.mobile}}</td>
						<td class="line bg">经营单位纳税人识别号：</td>
						<td class="line"></td>
						<td class="line bg">经营单位纳税人名称：</td>
						<td class="line"></td>
					</tr>
					
				</table>
				
				<table v-if="reportdata!=''" class="reportwrap" style="border-left:1px solid #dedede ;border-bottom:1px solid #dedede ;margin-bottom: 10px;" width="100%" border="0" cellpadding="0" cellspacing="0">
					<tr>
						<th class="rowtitle" rowspan="2">序号</th>
						<th class="rowtitle" rowspan="2">所得税项</th>
						<th class="rowtitle" colspan="3">年所得税</th>
						<th class="rowtitle" rowspan="2">应纳税所得额</th>
						<th class="rowtitle" rowspan="2">应纳税额</th>
						<th class="rowtitle" rowspan="2">已缴（扣）税额</th>
						<th class="rowtitle" rowspan="2">抵扣税额</th>
						<th class="rowtitle" rowspan="2">减免税额</th>
						<th class="rowtitle" rowspan="2">应补税额</th>
						<th class="rowtitle" rowspan="2">应退税额</th>
						<th class="rowtitle" rowspan="2">备注</th>
					</tr>
					<tr>
						<th class="rowtitle">境内</th>
						<th class="rowtitle">境外</th>
						<th class="rowtitle">合计</th>
					</tr>
					
					<tr>
						<td class="rowline">1</td>
						<td class="rowline">工资、薪金所得</td>
						<td class="rowline">{{reportdata.taxReport.incomen}}</td>
						<td class="rowline">{{reportdata.taxReport.incomew}}</td>
						<td class="rowline">{{reportdata.taxReport.incometotal}}</td>
						<td class="rowline">{{reportdata.taxReport.incometax}}</td>
						<td class="rowline">{{reportdata.taxReport.taxqut}}</td>
						<td class="rowline">{{reportdata.taxReport.taxedqut}}</td>
						<td class="rowline">{{reportdata.taxReport.taxkill}}</td>
						<td class="rowline">{{reportdata.taxReport.taxfree}}</td>
						<td class="rowline">{{reportdata.taxReport.taxedqut}}</td>
						<td class="rowline">{{reportdata.taxReport.taxhandback}}</td>
						<td class="rowline">{{reportdata.taxReport.memo}}</td>
					</tr>
					<tr>
						<td class="rowline">2</td>
						<td class="rowline">个体工商户的生产、经营所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">3</td>
						<td class="rowline">对企事业单位的承包经营、承租经营所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">4</td>
						<td class="rowline">劳务报酬所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">5</td>
						<td class="rowline">稿酬所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">6</td>
						<td class="rowline">特许权使用费所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">7</td>
						<td class="rowline">利息、股息、红利所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">8</td>
						<td class="rowline">财产租赁所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">9</td>
						<td class="rowline">财产转让所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td colspan="2"  class="rowline">其中：股票转让所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td colspan="2" class="rowline">个人房屋转让所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">10</td>
						<td class="rowline">偶然所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					<tr>
						<td class="rowline">11</td>
						<td class="rowline">其他所得</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline">0</td>
						<td class="rowline"></td>
					</tr>
					
				</table>
				
			</ul>
		
		</div>
		<!--查询界面结束-->
		
		
	
	</div>
</template>

<script>
	
import Qs from 'qs';
	export default {
		
		data(){
			return {
				options: [],
		        value: '',
		        reportdata:''
			}
		},
		methods:{
			search(){
				if(this.value==''){
					this.$message({
						message:"查询日期不能为空",
						type:'info'
					});
				}else {
					//发送请求获取查询的数据
					//初始获取查询的日期
					this.$http.post(this.$store.state.Interface.wa, Qs.stringify({
						transType: "queryTaxReport",
						way: "queryYearWage",
						year:this.value
					})).then((res) => {
						if(res.data.flag=='0'){
							this.reportdata=res.data.data
						}else{
							this.$message.error(res.data.des);
						}
					}).catch((err) => {
						this.$message.error(err);
					})
				}
					
			}

		},
		
		created(){
			//初始将数据置空
			this.reportdata='';
			this.value='';
			//初始获取查询的日期
			this.$http.post(this.$store.state.Interface.wa, Qs.stringify({
				transType: "queryTaxReport",
				way: "queryYear"
				
			})).then((res) => {
				if(res.data.flag=='0'){
					this.options=res.data.data.years;
				}else{
					this.$message({
						message:res.data.des,
						type:'info'
					});
				}
			}).catch((err) => {
				this.$message.error(err);
			})
		}
		
	}
</script>

<style>
	.reportwrap .bg {
		background: #F4F4F4;
	}
	
	.line{
		width: 16.67%;
		padding: 5px;
		word-break: break-word;
		border: 1px solid #dedede;
		border-left: none;
		border-bottom: none;
		background: #fff;
		font-size: 14px;
		color: #666666;
	}
	.rowtitle  {
		background: #fff;
		font-size: 14px;
		color: #666;
		font-weight: 100;
		font-family: "微软雅黑";
	}
	.rowline {
		padding: 5px;
		word-break: break-word;
		border: 1px solid #dedede;
		border-left: none;
		border-bottom: none;
		text-align: center;
		background: #fff;
		font-size: 14px;
		color: #666666;
	}
	th {
		/*border: 1px solid #000000;*/
		border-top: 1px solid #DEDEDE;
		border-right:1px solid #DEDEDE ;
	}
	
</style>