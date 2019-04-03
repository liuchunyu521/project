<template>
	<div class="main-panel" v-loading="loading" element-loading-text="加载中">
		<!-- 面包屑 -->
		<ifbp-breadcrumb name="我的考勤月报" v-show="false"></ifbp-breadcrumb>
		<ifbp-button-area>
			<div class="monthtittle">
				<p style="color: #333;font-size: 14px;float: left;margin-top: 6px;">
					考勤期间：
				</p>
				<span class="statinput">
					   <el-date-picker
						    v-model="monthperiod"
						    type="month"
						    placeholder="选择年-月"
						    ref="statdate"
						    @change="handleChange"
						    :disabled="disabledInput"
						   >
					  </el-date-picker>
					</span>
				<!--<el-button type="primary" class='btnSearch' @click="call()" :disabled="disabledInput">查询</el-button>-->
			</div>
		</ifbp-button-area>
		<div class="monthstatcontent">
			<div class="nodata" v-if="attendanceinfolist=='' && datalist!=''">
				<i class="hr-icon-pie" style="font-size: 80px;color: #CFCFD3;margin-bottom: 25px;display: inline-block;"></i>
				<p style="font-size: 20px;color: #75787B;line-height: 20px;">当前期间还未生成考勤数据~</p>
			</div>
			<div class="attend_chart" v-show="attendanceinfolist!=''">
				<div id="echarts" style="width: 220px;height: 220px;margin: auto;"></div>
				<div class="attendDays">
					<span class="chuqin">{{actualday}}</span>
					<span class="yingchuqin">/{{workdays}}</span>
				</div>
				<div class="attendText">
					本月应出勤{{workdays}}天，实际出勤{{actualday}}天
				</div>
				<div class="monthlist">
					<el-row :gutter="16">
						<el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in attendanceinfolist">
							<div class="monthwrap">
								<div class="monthtype">{{item.caption}}</div>
								<div class="monthtime">
									<span id="number" class="chidaozaotui" v-if="item.captioncode=='LATELENGTH' || item.captioncode=='EARLYLENGTH' || item.captioncode=='LATECOUNT' || item.captioncode=='EARLYCOUNT'">{{item.showvalue}}</span>
									<span id="number" class="qingjia" v-else-if="item.captioncode>=101 && item.captioncode<=111 || item.captioncode=='LACTATIONCOUNT'">{{item.showvalue}}</span>
									<span id="number" class="jiabanchuchai" v-else-if="item.captioncode>=201 && item.captioncode<=203 || item.captioncode=='301'">{{item.showvalue}}</span>
									<span id="number" class="kuanggong" v-else-if="item.captioncode=='ABSENTHOUR'">{{item.showvalue}}</span>
									<span id="number" style="color: #75787B;" v-else>{{item.showvalue}}</span>
									<span class="xiaoshi">{{item.unit}}</span>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from "../../../../../assets/js/echarts.min.js";
	export default {
		data() {
			return {
				monthperiod: '',
				attendanceinfolist: [],
				//maxheight:'',//自适应高度
				workdays: '', //应出勤
				actualday: '', //实际出勤  
				datalist: '', //判断初始进页面，不显示暂无数据
				loading: false, //加载
				disabledInput: false,
			}
		},
		methods: {
			setEcharts() {

			},
			datefun(myDate) {
				var y = myDate.getFullYear();
				var m = myDate.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				//var d = myDate.getDate();  
				//d = d < 10 ? ('0' + d) : d;  
				return y + '-' + m;
			},
			handleChange(val) {
				this.loading = true;
				var a = val.slice(0, 4);
				var b = val.slice(5);
				var _Data = {
					year: a,
					month: b
				};
				this.$http({
						url: "/hrss/ta/myMonthstat/getMyMonthstatData",
						method: "post",
						data: _Data
					})
					.then(res => {
						this.loading = false;
						//alert(JSON.stringify(res))
						//alert(JSON.stringify(res.data.data))
						//alert(JSON.stringify(res.data.data.attendanceinfolist))
						this.datalist = res.data.data;
						if(!this.datalist){
                            this.attendanceinfolist = [];
                            this.actualday = {};
                            this.workdays = {};
                        }
						this.attendanceinfolist = res.data.data.attendanceinfolist;
						for(var j = 0; j < this.attendanceinfolist.length; j++) {
							//实际出勤天数
							if(this.attendanceinfolist[j].captioncode == 'ACTUALWORKDAYS') {
								this.actualday = this.attendanceinfolist[j].showvalue
							}
							//应出勤
							if(this.attendanceinfolist[j].captioncode == 'WORKDAYS') {
								this.workdays = this.attendanceinfolist[j].showvalue
							}
						}

						//charts开始
						var myChart = echarts.init(document.getElementById('echarts'));
						myChart.setOption({
							color: ['#D8D8D8', '#1BC198'],
							tooltip: {
								trigger: 'item',
								formatter: "{a} <br/>{b}: {c} ({d}%)"
							},
							series: [{
								name: '考勤月报',
								type: 'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									normal: {
										show: false,
										position: 'center'
									},
									emphasis: {
										show: false,
										textStyle: {
											fontSize: '30',
											fontWeight: 'bold'
										}
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								data: [{
										value: this.workdays - this.actualday,
										name: '未出勤天数'
									},
									{
										value: this.actualday,
										name: '出勤天数'
									}
								]
							}]
						});
						//charts结束

					})
					.catch(err => {
						this.loading = false;
						this.$message.error(err);
					});
			},
			/*call(){
				if(this.$refs.statdate.value==""){
					this.$message('请输入考勤期间');
				}else{
					this.loading = true;
					if(typeof(this.$refs.statdate.value)=="string"){//初始进来时间为字符串格式，要判断一下
						var a = this.$refs.statdate.value.slice(0,4);
						var b = this.$refs.statdate.value.slice(5);
					}else{//自己在datepicker选的是date，需要转换一下
						var a = this.datefun(this.$refs.statdate.value).slice(0,4);
						var b = this.datefun(this.$refs.statdate.value).slice(5);
					}
					var _Data={
						year: a,
						month: b
					};
			      	this.$http({
			          url: "/hrss/ta/myMonthstat/getMyMonthstatData",
			          method: "post",
			          data: _Data
			        })
			          .then(res => {
			          	this.loading = false;
			          	//alert(JSON.stringify(res))
			            //alert(JSON.stringify(res.data.data))
		             	//alert(JSON.stringify(res.data.data.attendanceinfolist))
		             	this.datalist = res.data.data;
		             	this.attendanceinfolist = res.data.data.attendanceinfolist;
		             	for(var j=0;j<this.attendanceinfolist.length;j++){
		             		//实际出勤天数
		             		if(this.attendanceinfolist[j].captioncode=='ACTUALWORKDAYS'){
		             			this.actualday = this.attendanceinfolist[j].showvalue
		             		}
		             		//应出勤
		             		if(this.attendanceinfolist[j].captioncode=='WORKDAYS'){
		             			this.workdays = this.attendanceinfolist[j].showvalue
		             		}
		             	}
			             
			           	//charts开始
			           	var myChart = echarts.init(document.getElementById('echarts'));
						myChart.setOption({
							color: ['#D8D8D8', '#1BC198'],
							tooltip: {
								trigger: 'item',
								formatter: "{a} <br/>{b}: {c} ({d}%)"
							},
							series: [{
								name: '考勤月报',
								type: 'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									normal: {
										show: false,
										position: 'center'
									},
									emphasis: {
										show: false,
										textStyle: {
											fontSize: '30',
											fontWeight: 'bold'
										}
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								data: [
									{
										value: this.workdays-this.actualday,
										name: '未出勤天数'
									},
									{
										value: this.actualday,
										name: '出勤天数'
									}
								]
							}]
						});
			           	//charts结束
			           	
			          })
			          .catch(err => {
			          	this.loading = false;
			            this.$message.error(err);
			          });
				}
			},*/
			/*autodivheight(){
				//内容高度自适应的设置
				var _this=this;
				var winHeight='';
				if (window.innerHeight){
					winHeight = window.innerHeight;
				}else if ((document.body) && (document.body.clientHeight)){//ie
					winHeight = document.body.clientHeight;
				}
				_this.maxheight=winHeight-230;//减掉内容上方的高度；
			},*/
		},

		mounted() {
			//this.setEcharts();
		},
		created() {
			//this.autodivheight();
			//window.onresize=this.autodivheight; //浏览器窗口发生变化时同时变化DIV高度
			//var _Data={};
			this.$http({
				url: "/hrss/ta/myMonthstat/getLastPeriod",
				method: "post",
				params: {pk_org:''}
			}).then((res) => {
				//alert(JSON.stringify(res))
				if(res.data.status == true) {
					if(res.data.data) {
						this.monthperiod = res.data.data;
						this.disabledInput = false;
						var a = this.monthperiod.slice(0, 4);
						var b = this.monthperiod.slice(5);
						var _Data = {
							year: a,
							month: b
						};
						this.$http({
								url: "/hrss/ta/myMonthstat/getMyMonthstatData",
								method: "post",
								data: _Data
							})
							.then(res => {
								this.loading = false;
								this.datalist = res.data.data;
								this.attendanceinfolist = res.data.data.attendanceinfolist;
								for(var j = 0; j < this.attendanceinfolist.length; j++) {
									//实际出勤天数
									if(this.attendanceinfolist[j].captioncode == 'ACTUALWORKDAYS') {
										this.actualday = this.attendanceinfolist[j].showvalue
									}
									//应出勤
									if(this.attendanceinfolist[j].captioncode == 'WORKDAYS') {
										this.workdays = this.attendanceinfolist[j].showvalue
									}
								}

								//charts开始
								var myChart = echarts.init(document.getElementById('echarts'));
								myChart.setOption({
									color: ['#D8D8D8', '#1BC198'],
									tooltip: {
										trigger: 'item',
										formatter: "{a} <br/>{b}: {c} ({d}%)"
									},
									series: [{
										name: '考勤月报',
										type: 'pie',
										radius: ['50%', '70%'],
										avoidLabelOverlap: false,
										label: {
											normal: {
												show: false,
												position: 'center'
											},
											emphasis: {
												show: false,
												textStyle: {
													fontSize: '30',
													fontWeight: 'bold'
												}
											}
										},
										labelLine: {
											normal: {
												show: false
											}
										},
										data: [{
												value: this.workdays - this.actualday,
												name: '未出勤天数'
											},
											{
												value: this.actualday,
												name: '出勤天数'
											}
										]
									}]
								});
								//charts结束
							})
							.catch(err => {
								this.loading = false;
								this.$message.error(err);
							});
					} else {
						this.disabledInput = true;
						this.$message({
							showClose: true,
							message: '还未设置考勤期间，无法查看考勤月报',
							type: 'warning'
						});
					}
				} else {
					this.$message({
						message: res.data.msg,
						type: 'error'
					});
				}
			}).catch(() => {
				this.$message({
					message: "请求失败",
					type: "error"
				});
			})
		}

	}
</script>

<style>
	.statinput {
		display: inline-block;
		margin-right: 16px;
		float: left;
	}
	
	.statinput .el-date-editor.el-input {
		width: 130px !important;
	}
	
	.monthstatcontent {
		background: #FFFFFF;
		margin-top: 8px;
		/*position: relative;*/
		overflow: auto;
	}
	
	.monthstatcontent .attendDays {
		position: relative;
		top: -120px;
		width: 94px;
		margin: auto;
		text-align: center;
	}
	
	.monthstatcontent .attendDays .chuqin {
		font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #1BC198;
	}
	
	.monthstatcontent .attendDays .yingchuqin {
		font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #2A2A2A;
	}
	
	.monthstatcontent .attendText {
		font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #2D2D2D;
		text-align: center;
		margin-top: -40px;
		margin-bottom: 24px;
		line-height: 16px;
	}
	
	.monthstatcontent .monthlist {
		padding: 16px;
	}
	
	.monthstatcontent .monthwrap {
		border: 1px solid #F0F0F5;
		border-radius: 4px;
		height: 100px;
		text-align: center;
		margin-bottom: 16px;
	}
	
	.monthstatcontent .monthwrap .monthtype {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #2D2D2D;
		line-height: 14px;
		margin-top: 22px;
		margin-bottom: 12px;
	}
	
	.monthstatcontent .monthwrap .monthtime {
		line-height: 30px;
	}
	
	.monthstatcontent .monthwrap .monthtime #number {
		font-family: PingFangSC-Regular;
		font-size: 30px;
	}
	
	.kuanggong {
		color: #FF3B30;
	}
	
	.shijia {
		color: #5AC8FA;
	}
	
	.jiabanchuchai {
		color: #40A9FF;
	}
	
	.chidaozaotui {
		color: #FF9500;
	}
	
	.weichuqin {
		color: #EB6964;
	}
	
	.qingjia {
		color: #3EC6E9;
	}
	
	.zhongtu {
		color: #DE7BEF;
	}
	
	.monthstatcontent .monthwrap .monthtime .xiaoshi {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #2A2A2A;
	}
	
	.monthstatcontent .nodata {
		width: 260px;
		margin: auto;
		text-align: center;
		margin-top: 120px;
		margin-bottom: 150px;
	}
</style>