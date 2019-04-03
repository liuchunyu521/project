<!--
	作者：liuchym
	时间：2018-08-28
	支持：自助 个税申报
-->
<template>
	<ifbp-page>
	    <!-- 面包屑 -->
    	<ifbp-breadcrumb name="个税申报"></ifbp-breadcrumb>
	    <!--查询界面开始-->
		<div class="taxReport">
			<div class="taxReporttittle">
				<span style="color: #333;font-size: 14px;height: 30px;" >
				  <span style="float: left;margin-top: 6px;">所得年份：</span>
				  <el-select v-model="value" @change="search()" :disabled="disabledInput" no-data-text="" placeholder="请选择" style="width: 100px;">
				    <el-option
				      v-for="item in options"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
				</span>
			</div>
			
			
			<!--查询的内容-->
			<ul class="taxReportwrap" :style="{height:maxheight+'px'}">
				<div style="text-align: center;padding-top: 10%;" v-show="reportdata==''">
					<i class="ifbp-icon-description" style="font-size: 60px;color:#DDDDDD;margin-left: -50px;"></i>
					<div style="font-size: 14px;color:#BFBFBF;margin-left: -54px;">{{textdetails}}</div>
				</div>
				
				<table v-if="reportdata!=''" class="reportwrap" style="margin-bottom: 10px;" width="100%" border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td class="taxReportline taxReportbg">纳税人姓名：</td>
						<td class="taxReportline">{{reportdata.psndoc.psnname}}</td>
						<td class="taxReportline taxReportbg">国家地区：</td>
						<td class="taxReportline">{{reportdata.psndoc.countryname}}</td>
						<td class="taxReportline taxReportbg">身份照类型：</td>
						<td class="taxReportline">{{reportdata.psndoc.idtype}}</td>
					</tr>
					<tr>
						<td class="taxReportline taxReportbg">身份照号码：</td>
						<td class="taxReportline">{{reportdata.psndoc.id}}</td>
						<td class="taxReportline taxReportbg">任职受雇单位识别号（社会信用代码）</td>
						<td class="taxReportline">{{reportdata.psndoc.workcorpCode}}</td>
						<td class="taxReportline taxReportbg">任职受雇单位：</td>
						<td class="taxReportline">{{reportdata.psndoc.workcorp}}</td>
					</tr>
					<tr>
						<td class="taxReportline taxReportbg">任职受雇单位所属行业：</td>
						<td class="taxReportline">{{reportdata.psndoc.comindstry}}</td>
						<td class="taxReportline taxReportbg">职务：</td>
						<td class="taxReportline">{{reportdata.psndoc.dutyname}}</td>
						<td class="taxReportline taxReportbg">职业：</td>
						<td class="taxReportline">{{reportdata.psndoc.vocation}}</td>
					</tr>
					<tr>
						<td class="taxReportline taxReportbg">在华天数：</td>
						<td class="taxReportline">{{reportdata.psndoc.incndays}}</td>
						<td class="taxReportline taxReportbg">境内有限联系地址：</td>
						<td class="taxReportline">{{reportdata.psndoc.addr}}</td>
						<td class="taxReportline taxReportbg">境内有限联系地址邮编：</td>
						<td class="taxReportline">{{reportdata.psndoc.postalcode}}</td>
					</tr>
					<tr>
						<td class="taxReportline taxReportbg">联系电话：</td>
						<td class="taxReportline">{{reportdata.psndoc.mobile}}</td>
						<td class="taxReportline taxReportbg">经营单位纳税人识别号：</td>
						<td class="taxReportline"></td>
						<td class="taxReportline taxReportbg">经营单位纳税人名称：</td>
						<td class="taxReportline"></td>
					</tr>
					
				</table>
				
				<table v-if="reportdata!=''" class="reportwrap" style="border-left:1px solid #dedede ;border-bottom:1px solid #dedede ;margin-bottom: 10px;" width="100%" border="0" cellpadding="0" cellspacing="0">
					<tr>
						<th class="rowtitle taxReportbg" rowspan="2">序号</th>
						<th class="rowtitle taxReportbg" rowspan="2">所得税项</th>
						<th class="rowtitle taxReportbg" colspan="3">年所得税</th>
						<th class="rowtitle taxReportbg" rowspan="2">应纳税所得额</th>
						<th class="rowtitle taxReportbg" rowspan="2">应纳税额</th>
						<th class="rowtitle taxReportbg" rowspan="2">已缴（扣）税额</th>
						<th class="rowtitle taxReportbg" rowspan="2">抵扣税额</th>
						<th class="rowtitle taxReportbg" rowspan="2">减免税额</th>
						<th class="rowtitle taxReportbg" rowspan="2">应补税额</th>
						<th class="rowtitle taxReportbg" rowspan="2">应退税额</th>
						<th class="rowtitle taxReportbg" rowspan="2">备注</th>
					</tr>
					<tr>
						<th class="rowtitle taxReportbg">境内</th>
						<th class="rowtitle taxReportbg">境外</th>
						<th class="rowtitle taxReportbg ">合计</th>
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
	    
	</ifbp-page>
</template>

<script>
import nodata from './public/ico/nodata.png';//暂无数据图标
import checkData from './public/checkData.json';
export default {
	data(){
		return {
			nodata:nodata,//暂无数据图标
			options: [],
	        value: '',
	        reportdata:'',
	        disabledInput:false,
	        textdetails:'请选择您要查询的年',
	        maxheight:''//自适应高度
		}
	},
	methods:{
		search(){
			var _this=this;
			if(_this.value==''){
				_this.$message({
					message:"查询日期不能为空",
					type:'info'
				});
			}else {
				//发送请求获取查询的数据
				//初始获取查询的日期
				var _Data={
					year:_this.value
				};
				this.$http({
	              url: "/hrss/taxreport/getYearWage",
	              method: "post",
	              data:JSON.parse(JSON.stringify(_Data))
	           	}).then((res) => {
	                if(res.data.status==true){
	                	_this.reportdata=res.data;
					}else{
						_this.$message.error(res.data.msg);
					}
              	}).catch((err) => {
                	_this.$message({
	                  message:"请求失败",
	                  type: "error"
	                });
              	});
			}	
				
		}
		
	},
	created(){
		//右侧内容高度自适应的设置
		var _this=this;
		var winHeight='';
		if (window.innerHeight){
			winHeight = window.innerHeight;
		}else if ((document.body) && (document.body.clientHeight)){
			winHeight = document.body.clientHeight;
		}
		_this.maxheight=winHeight-240;//减掉内容上方的高度；
			
		//初始将数据置空
		_this.reportdata='';
		_this.value='';
		//初始获取查询的日期
		
		var _Data={};
		this.$http({
          url: "/hrss/taxreport/listYears",
          method: "post",
          data: JSON.parse(JSON.stringify(_Data))
       	}).then((res) => {
            console.log(res)
            if(res.data.status==true){
            	
            	if(res.data.years){
            		
            		_this.options=res.data.years;
					_this.textdetails='请选择您要查询的年';
					_this.disabledInput=false;
            	}else {
					_this.disabledInput=true;
					_this.textdetails='暂无数据，需业务人员生成个税申报表';
            	}
				
			}else{
				
				_this.$message({
					message:res.data.msg,
					type:'error'
				});
			}
      	}).catch(() => {
        	_this.$message({
              message:"请求失败",
              type: "error"
            });
      	})
	}
		
}
</script>
<style scoped="scoped">
	.taxReporttittle {
		background: #fff;
		padding: 20px;
		margin-bottom: 10px;
	}
	.taxReportwrap {
		background: #fff;
		overflow: auto;
		padding: 16px;
	}
	.reportwrap {
		border-left: 1px solid #dedede;
		border-bottom: 1px solid #dedede;
	}
	.reportwrap .taxReportbg {
		background: #F5F5F5;
	}
	
	.taxReportline{
		width: 16.67%;
		padding: 5px;
		line-height: 24px;
		word-break: break-word;
		border: 1px solid #dedede;
		border-left: none;
		border-bottom: none;
		background: #fff;
		font-size: 14px;
		color: #666666;
		vertical-align:middle;
	}
	.rowtitle  {
		background: #fff;
		font-size: 14px;
		color: #666;
		line-height: 40px;
		text-align: center;
		 vertical-align:middle;
		font-weight: 100;
		font-family: "微软雅黑";
	}
	.rowline {
		padding: 5px;
		word-break: break-word;
		border: 1px solid #dedede;
		border-left: none;
		border-bottom: none;
		line-height: 48px;
		text-align: center;
		background: #fff;
		font-size: 14px;
		color: #666666;
	}
	th {
		border-top: 1px solid #DEDEDE;
		border-right:1px solid #DEDEDE ;
	}
</style>