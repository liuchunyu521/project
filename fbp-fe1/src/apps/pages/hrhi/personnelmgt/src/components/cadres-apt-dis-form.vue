<!--
  作者：彭传博 3.0.1
  时间：2018-11-23
  支持：员工信息——任免表
-->
<template>
  <div class="P_cadres">
		<!-- 面包屑 -->
		<!--<ifbp-breadcrumb name="简历模板"></ifbp-breadcrumb>-->
		
		<div class="monthstatcontent">
			<table style="font-size: 18px;margin: 10px 0px;" align="center" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td align="center" height="60">《干部任免表》 </td>
				</tr>
			</table>
			<table class="tabtop" width="70%" border="1" cellpadding="0" cellspacing="0" align="center">
				<tr>
					<td width="10%" class="btbg boxcolor">姓名</td>
					<td width="10%" class="btbg">{{data.XingMing}}</td>
					<td width="10%" class="btbg boxcolor">性别</td>
					<td width="10%" class="btbg">{{data.XingBie}}</td>
					<td width="10%" class="btbg boxcolor">出生日期</td>
					<td width="10%" class="btbg">{{data.ChuShengNianYue}}</td>
					<!--colspan="2"-->
					<td colspan="" class="btbg" width="10%" rowspan="4" ref="td_imgSrc" style="line-height: 0px;">
						<img v-bind:src="imgSrc" v-bind:style="imgStyle" alt="" class="P_cadres_imgSrc"  />
					</td>
				</tr>
				<tr>
					<td class="btbg boxcolor">民族</td>
					<td class="btbg">{{data.MinZu}}</td>
					<td class="btbg boxcolor">籍贯</td>
					<td class="btbg">{{data.JiGuan}}</td>
					<td class="btbg boxcolor">出生地</td>
					<td class="btbg">{{data.ChuShengDi}}</td>
				</tr>
				<tr>
					<td class="btbg boxcolor">入党时间</td>
					<td class="btbg">{{data.RuDangShiJian}}</td>
					<td class="btbg boxcolor">参加工作时间</td>
					<td class="btbg">{{data.CanJiaGongZuoShiJian}}</td>
					<td class="btbg boxcolor">健康状况</td>
					<td class="btbg">{{data.JianKangZhuangKuang}}</td>
				</tr>
				<tr>
					<td width="12%" class="btbg boxcolor">专业技术职务</td>
					<td  colspan="2" class="btbg">{{data.ZhuanYeJiShuZhiWu}}</td>
					<td width="12%" class="btbg boxcolor">熟悉专业有何专长</td>
					<td colspan="2" class="btbg">{{data.ShuXiZhuanYeYouHeZhuanChang}}</td>
				</tr>
				<!-- 模块二 -->
				<tr>
					<td class="btbg boxcolor" rowspan="2">学历学位</td>
					<td colspan="1" class="btbg boxcolor">全日制教育</td>
					<td colspan="2" class="btbg twoh">
						<p>{{data.QuanRiZhiJiaoYu_XueLi}}</p>
						<p>{{data.QuanRiZhiJiaoYu_XueWei}}</p>
					</td>
					<td colspan="1" class="btbg o boxcolor"><p>毕业院校系</p><p>及专业</p></td>
					<td colspan="3" class="btbg twoh">
						<p>{{data.QuanRiZhiJiaoYu_XueLi_BiYeYuanXiaoXi}}</p>
						<p>{{data.QuanRiZhiJiaoYu_XueWei_BiYeYuanXiaoXi}}</p>
					</td>
				</tr>
				<tr>
					<td colspan="1" class="btbg boxcolor">在职教育</td>
					<td colspan="2" class="btbg twoh">
						<p>{{data.ZaiZhiJiaoYu_XueLi}}</p>
						<p>{{data.ZaiZhiJiaoYu_XueWei}}</p>
					</td>
					<td colspan="1" class="btbg o boxcolor"><p>毕业院校系</p><p>及专业</p></td>
					<td colspan="3" class="btbg twoh">
						<p>{{data.ZaiZhiJiaoYu_XueLi_BiYeYuanXiaoXi}}</p>
						<p>{{data.ZaiZhiJiaoYu_XueWei_BiYeYuanXiaoXi}}</p>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="btbg boxcolor">现任职务</td>
					<td colspan="6" class="btbg">{{data.XianRenZhiWu}}</td>
				</tr>
				<tr>
					<td colspan="2" class="btbg boxcolor">拟免职务</td>
					<td colspan="6" class="btbg">{{data.NiRenZhiWu}}</td>
				</tr>
				<tr>
					<td colspan="2" class="btbg boxcolor">任免理由</td>
					<td colspan="6" class="btbg">{{data.NiMianZhiWu}}</td>
				</tr>
				<tr>
					<td colspan="1" class="btbg boxcolor">简历</td>
					<td colspan="7" class="btbg jianl" valign="top">
						<div class="ppl" v-for="item in JianLi_Web">
							<div class="mr">{{item.date}}</div>
							<div class='mc'>{{item.text}}</div>
						</div>
					</td>
				</tr>
			</table>
			<!-- 第二页 -->
			<table class="tabtop2" width="70%" border="1" cellpadding="0" cellspacing="0" align="center">
				<tr>
					<td colspan="1" width="16%" class="btbg hh1 boxcolor">奖惩情况</td>
					<td colspan="7" class="btbg">
						<p class="ppl2" v-for="item in JiangChengQingKuang_Web">
							<span class='mc2' v-if="item.text!=''">{{item.text}}</span>
						</p>
					</td>
				</tr>
				<tr>
					<td colspan="1" width="16%" class="btbg o hh1 boxcolor"><p>年度考核</p><p>结果</p></td>
					<td colspan="7" class="btbg">
						<p class="ppl2" v-for="item in NianDuKaoHeJieGuo_Web">
							<span class='mc2'  v-if="item.text!=''">{{item.text}}</span>
						</p>
					</td>
				</tr>
				<tr>
					<td colspan="1" width="16%" class="btbg hh1 boxcolor">任免理由</td>
					<td colspan="7" class="btbg"></td>
				</tr>
				<tr>
					<td colspan="" class="btbg boxcolor" style="line-height: 20px;" width="9%" v-bind:rowspan="homeNum">
						<p>家庭主要</p>
						<p>成员以及</p>
						<p>重要社会</p>
						<p>关系</p>
					</td>
					<td  width="12%" class="btbg h boxcolor">称谓</td>
					<td  width="12%" class="btbg h boxcolor">姓名</td>
					<td  width="12%" class="btbg h boxcolor">出生日期</td>
					<td  width="12%" class="btbg h boxcolor">政治面貌</td>
					<td  width="33%" class="btbg h boxcolor">工作单位及职务</td>
				</tr>
				<tr v-for="value in JiaTingChengYuan">
					<td  width="12%" class="btbg h">{{value.ChengWei}}</td>
					<td  width="12%" class="btbg h">{{value.XingMing}}</td>
					<td  width="12%" class="btbg h">{{value.ChuShengRiQi}}</td>
					<td  width="12%" class="btbg h">{{value.ZhengZhiMianMao}}</td>
					<td  width="33%" class="btbg h">{{value.GongZuoDanWeiJiZhiWu}}</td>
				</tr>
				<tr>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="33%" class="btbg  h"></td>
				</tr>
				<tr>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="33%" class="btbg  h"></td>
				</tr>
				<tr>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="12%" class="btbg  h"></td>
					<td  width="33%" class="btbg  h"></td>
				</tr>
				
				<!--尾巴-->
				<tr>
					<td width="12%" class="btbg boxcolor">呈报单位</td>
					<td colspan="5" class="btbg">{{data.ChengBaoDanWei}}</td>
				</tr>
				
			</table>
			
			<table class="tabtop3" width="70%" border="1" cellpadding="0" cellspacing="0" align="center">
			<tr>
				<td width="12.5%" class="btbg h boxcolor">身份证号</td>
				<td width="12.5%" class="btbg h">{{data.ShenFenZheng}}</td>
				<td width="12.5%" class="btbg h boxcolor">计算年龄时间</td>
				<td width="12.5%" class="btbg h">{{data.JiSuanNianLingShiJian}}</td>
				<td width="12.5%" class="btbg h boxcolor">填表时间</td>
				<td width="12.5%" class="btbg h">{{data.TianBiaoShiJian}}</td>
				<td width="12.5%" class="btbg h boxcolor">填表人</td>
				<td width="12.5%" class="btbg h">{{data.TianBiaoRen}}</td>
			</tr>
		</table>

		</div>
	</div>
</template>

<script>


  export default {
  	props: {
      pk_psndoc: {
        type: String,
        required: true
      },
    },
   
    data() {
      return {
				homeNum:"",
				data:{},//任免表数据
				JianLi_Web:[],//简历
				JiangChengQingKuang_Web:[],//奖惩情况
				NianDuKaoHeJieGuo_Web:[],//年度考核
				JiaTingChengYuan:[],//家庭成员
				imgSrc:"",
				imgStyle:{
					height:""
				}
      }
    },
    //初始化加载
    created() {
    	var _this = this;
    	_this.request();//请求数据
		},
		mounted() {
    	var _this = this;
    },
    methods: {
            getDefaultPhotoUrl:function () {
                //新增时间戳，防止缓存
                return '/hrhi/psndoc/getPhotoByPK?pk_psndoc=' + this.pk_psndoc + '&time=' + (new Date()).getTime();
            },

     		request:function(){//获取数据
     				var _this = this;
     				var url = '/hrhi/cadre/getCadresById?pk_psndoc=' + _this.pk_psndoc;
//						var url = '/hrhi/cadre/getCadresById?pk_psndoc=' + _this.pk_psndoc;//国寿接口
//   				/hrhi/cadre/getCadresById  国寿接口
		        this.$http({
		          url: url,
		          method: "post",
		        })
		          .then((res) => {
		            if (res.data.status === true) {
                      _this.data = res.data.data.cadres;
                    //   if(_this.data.JianLi){
                    //     _this.JianLi_Web = JSON.parse(_this.data.JianLi);//简历
                    //   }     
		              _this.JiangChengQingKuang_Web = JSON.parse(_this.data.JiangChengQingKuang_Web);//奖惩情况
		              _this.NianDuKaoHeJieGuo_Web = JSON.parse(_this.data.NianDuKaoHeJieGuo_Web); //年度考核
		              _this.JiaTingChengYuan = JSON.parse(_this.data.JiaTingChengYuan);//家庭成员
		              _this.homeNum = _this.JiaTingChengYuan.length + 4;
		             
		              _this.imgSrc = this.getDefaultPhotoUrl();
		              _this.init();
		              console.log(_this.data);
		            } else {
		              this.$message({
		                message: res.data.msg,
		                type: "error"
		              });
		            }
		          })
		          .catch((res) => {
		            this.$message({
		              message: "页面初始化失败",
		              type: "error"
		            });
		          });
		    		
						
						
     		},
     		init:function() {//定义高度
		      const _this = this;
		      this.$nextTick(function () {
        			var a = _this.$refs.td_imgSrc.clientHeight;
				    	_this.imgStyle.height = a + "px" ;
				    	
      		})
		    	
     		}
    }
  }
</script>

<style scoped>
  /*基本信息样式*/
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }
	.monthstatcontent {
		background: #FFFFFF;
		overflow: auto;
		font-size:14px;
		color: #333;
	}
	.btbg{
		text-align: center;
		line-height: 40px
	}

	.twoh p{
		line-height: 20px
	}
	.jianl{
		height: 600px;
		line-height: 20px;
    padding-top: 10px;
	}
	.o{
		line-height: 20px;
	}
	.h{
		height: 50px;
		line-height: 28px
	}
	.hh1{
		height: 120px
	}
	.ppl{
		text-align: left;
    	padding-left: 15px;
    	position: relative;
	}
	.ppl>div{
		float: left;
	}
	.mr{/*日期*/
		margin-right: 10px;
		position: relative;
    	/*top: -20px;*/
	}
	.mc{
		width: 79%;
	}
	.ppl2{
		line-height: 20px;	
		text-align: left;
    	padding-left: 15px;	
    	margin-bottom: 3px;
	}
	.mc2{
		width: 100%;
	}
	.boxcolor{
		background-color: #f0f0f5;
	}
	.tabtop2{	
		margin-top: 20px;
		border-bottom: none;
	}
	.tabtop3{
		margin-bottom: 55px;
	}
	.P_cadres_imgSrc{
		width: 100%;
	}
</style>
