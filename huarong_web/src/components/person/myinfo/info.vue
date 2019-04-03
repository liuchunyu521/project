
<template>
	<div class="y-maincontent" style="padding-bottom: 200px;">
		<div class="y-breadcrumb-box">
			<el-breadcrumb separator="/">
			  <el-breadcrumb-item>人员信息</el-breadcrumb-item>
			  <el-breadcrumb-item>我的信息</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="y-row-box">
			<div id="userInfo" class="y-inner y-userinfo">
				<div class="y-menu">
					<ul>
						<li> <a class="current" scroll-href="#jibenxinxi">基本信息</a> </li>
						<li> <a scroll-href="#gongzuo">企业内任职经历</a> </li>
						<li> <a scroll-href="#lvli">履历记录</a> </li>
						<li> <a scroll-href="#hetong">合同信息</a> </li>
						<li> <a scroll-href="#xueli">学历信息</a> </li>
						<li> <a scroll-href="#shenfenzheng">身份证件</a> </li>
						<li> <a scroll-href="#jiating">家庭信息</a> </li>
						<li> <a scroll-href="#zhicheng">职称信息</a> </li>
						<li> <a scroll-href="#dangpai">参加党派记录</a> </li>
						<li> <a scroll-href="#jiangli">奖励情况</a> </li>
						<!-- <li> <a scroll-href="#psnOrg">人员组织关系</a> </li> -->
						<li> <a scroll-href="#ass">考核记录</a> </li>
						<li> <a scroll-href="#zhiye">职业资格</a> </li>
						<li> <a scroll-href="#jinji">紧急联系人</a> </li>
						<li> <a scroll-href="#yuyan">语言能力</a> </li>
						<li> <a scroll-href="#peixun">培训记录</a> </li>
						<li> <a scroll-href="#chuguo">出国境情况</a> </li>
						<li> <a scroll-href="#fujian">附件管理</a> </li>
					</ul>
				</div>
				<!-- 基本信息 begin -->
				<baseInfo :editabled="true"></baseInfo>
				<!-- 基本信息 end -->
				<!-- 企业内任职经历 begin -->
        <gongZuo data-scroll="gongzuo"></gongZuo>
				<!-- 企业内任职经历 end -->
				<!-- 履历记录 begin -->
        <lvLi data-scroll="lvli"></lvLi>
				<!-- 履历记录 end -->
				<!-- 合同信息 begin -->
        <heTong data-scroll="hetong"></heTong>

				<!-- 合同信息 end -->
				<!-- 学历信息 begin -->
        <xueLiXinXi data-scroll="xueli"></xueLiXinXi>

				<!-- 学历信息 end -->
				<!-- 身份证件 begin -->
        <shenFen data-scroll="shenfenzheng"></shenFen>

				<!-- 身份证件 end -->
				<!-- 家庭信息 begin -->
        <jiaTing data-scroll="jiating"></jiaTing>

				<!-- 家庭信息 end -->
				<!-- 职称信息 begin -->
        <zhiCheng data-scroll="zhicheng"></zhiCheng>

				<!-- 职称信息 end -->
				<!-- 参加党派记录 begin -->
        <dangPai data-scroll="dangpai"></dangPai>
				<!-- 参加党派记录 end -->
				<!-- 奖励情况 begin -->
        <jiangLi data-scroll="jiangli"></jiangLi>

				<!-- 奖励情况 end -->
				<!-- 华融人员组织关系 begin -->
		<!-- 		<subList
					data-scroll="psnOrg"
					title='华融人员组织关系'
					:infoSetCode="subDialogConfig.psnOrg.infoSetCode"
					:editabled="false"
					:theaddata='psnOrgTheadData'></subList>  -->
				<!-- 华融人员组织关系 end -->

				<!-- 考核记录 begin -->
        <kaoHeJiLu data-scroll="ass"></kaoHeJiLu>

				<!-- 考核记录 end -->

				<!--职业资格begin-->
        <zhiYeZiGe data-scroll="zhiye"></zhiYeZiGe>


				<!-- 职业资格 end -->
				<!-- 紧急联系人 begin -->
        <jinJi data-scroll="jinji"></jinJi>

				<!-- 紧急联系人 end -->

				<!-- 语言能力 begin -->
        <yuYan data-scroll="yuyan"></yuYan>

				<!-- 语言能力 end -->

				<!-- 培训记录 begin -->
        <peiXunJiLu data-scroll="peixun"></peiXunJiLu>

				<!-- 语言能力 end -->
				<!-- 出国境情况 begin -->
        <chuGuo data-scroll="chuguo"></chuGuo>

				<!-- 出国境情况 end -->
				<!-- 附件开始 -->
				<div class="y-module" data-scroll="fujian">
					<div class="y-title" >
						附件管理
					</div>
					<div class="y-content">
						<el-table class="y-table y-table-baseinfo" :data="fileList3" style="width: 100%">

							<el-table-column
						      prop="filename"
						      label="文件名">
						    </el-table-column>
						    <el-table-column
						      width='200'
						      prop="uploadtime"
						      label="上传时间">
						    </el-table-column>
							<el-table-column  label="操作"  width='100'>
								<template scope="scope">
									<i style="color: #50CC7A;cursor: pointer;" class="iconfont icon-xiazai"
									@click="downloadRow(scope.$index, scope.row)"></i>
									<i  style="color: #49A7F5;cursor: pointer;" class="iconfont icon-shanchu"
									@click="filedeleteRow(scope.$index, scope.row)"></i>
								</template>
							</el-table-column>
						</el-table>
						<el-upload
						  style='text-align: center;'
						  class="upload-demo"
						  name='file'
						  :action="fileUploadURL"
						  :show-file-list='false'
						  :on-success="handleSuccess"
						  :file-list="fileList3"
						  :before-upload="beforeAvatarUpload">
						  <span style="color: #CC2123;cursor: pointer;"><i class="iconfont icon-tianjia"></i>上传附件</span>
						  <!--<el-button size="small" type="text" class="y-title" style='border-bottom: none;color: #CC2123;cursor: pointer;'><i class="iconfont icon-tianjia"></i>附件上传</el-button>-->
						  <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</div>
				</div>
				<!-- 附件结束 -->
			</div>
		</div>

	</div>
</template>
<script>
import Qs from 'qs';
import Cookies from 'js-cookie';
import {scrollSpy} from '@/assets/js/scrollspy.js';
import { ajaxData } from '@/assets/js/ajaxdata.js';
import Base64 from 'js-base64';
import baseInfo from './components/base';
import gongZuo from './components/gongzuo';
import lvLi from './components/lvli';
import heTong from './components/hetong';
import kaoHeJiLu from './components/kaohejilu';
import zhiYeZiGe from './components/zhiyezige';
import peiXunJiLu from './components/peixunjilu';
import xueLiXinXi from './components/xuelixinxi';
import shenFen from './components/shenfen';
import jiaTing from './components/jiating';
import zhiCheng from './components/zhicheng';
import dangPai from './components/dangpai';
import jiangLi from './components/jiangli';
import jinJi from './components/jinji';
import yuYan from './components/yuyan';
import chuGuo from './components/chuguo';

export default {
	data() {
		return {
			fileUploadURL:'',//附件上传地址
			fileList3: [],
			currentDialog: { //当前显示的子集弹窗相关数据
				infoSetCode: '',  //弹窗类型
				operate: '', //弹窗操作
				index: 0 //列表索引
			},
			sendStr:{
				"transType":"fileManage"
			}//上传文件传参
		}
	},
	created(){
//		UserInfo = JSON.parse( Cookies.get('usermsg'));//获取人员信息
		this.fileUploadURL=window.location.origin+'/service/hrweb/sm';
		this.fileinit();
	},
	mounted(){
		var _interface = this.$store.state.Interface.hi;
		scrollSpy( document.querySelectorAll('#userInfo') );
	},
	computed:{
		//获取基本信息数据
		baseInfo(){ return this.getData("baseInfo"); }
	},
	components: {
		baseInfo, //基本信息
	    gongZuo, //企业内任职经历
	    lvLi, //履历
	    heTong, //hetong
	    kaoHeJiLu,//kaohe
	    zhiYeZiGe,//zhiyezige
	    peiXunJiLu,//peixunlilu
	    xueLiXinXi,//xuelixinxi
	    shenFen,//shenfen
	    jiaTing,//jiating
	    zhiCheng,//zhicheng
	    dangPai,//dangpai
	    jiangLi,//jaing
	    jinJi,//jinji
	    yuYan,//yuyan
	    chuGuo//chuguo
	},
	methods: {
		//修改家庭信息的出生日期，动态计算年龄
		dateChange: function( data ){
			//data[1].glbdef2 = 10;
			// var choose_date = data[0];
			// choose_date = choose_date.split('-')[0];
			// var current_date = new Date();
			// var current_year = current_date.getFullYear();
			// data[1].glbdef2 = parseInt(current_year-choose_date);
		},
		fileinit() {
			this.$http.post(this.$store.state.Interface.sm, Qs.stringify({
				transType: "fileManage",
				handleType: "queryFileTree"
			})).then((res) => {
				// console.log(res)
				if(res.data.flag=='0'){
					this.fileList3=res.data.data.files;
				}else if(res.data.flag=='-1'){
					this.fileList3=[];
				}else{
					this.$message.error( res.data.des );
				}
			}).catch((err) => {
				this.$message.error(err);
			})
		}, //附件上传
		beforeAvatarUpload(file) {
			//上传之前判断格式及大小；成功之后可以继续上传;
			//			var fd=new FormData();
			//				fd.append('ddd', file)
			//			this.$http.post( 'service/hrweb/sm', Qs.stringify (fd)).then(( res) => {
							// console.log(res)
			//			}).catch((err) => {
			//				this.$message.error( err );
			//			})
		},
		handleSuccess(response, file, fileList) {
			// console.log(response)
			if(response.flag == '0') {
				this.fileinit();
			} else {
				this.$message.error(response.des);
			}
		},
		downloadRow(row1, row2) {
			//附件的下载
			// console.log(row1, row2)
			window.location.href = row2.url;
			//			this.$http.post( 'service/hrweb/sm', Qs.stringify ({
			//				transType:"fileManage",
			//				handleType:"downLoadFile"
			////				pk_doc:row2.pk_doc
			//			})).then(( res) => {
							// console.log(res)
			//				if(res.data.flag=='0'){
			//					res.data.filebyte
			//					//ddddddddddddddddddddddddddddddddddddd下载
			//				}else{
			//					this.$message.error( res.data.des );
			//				}
			//			}).catch((err) => {
			//				this.$message.error( err );
			//			})
		},
		filedeleteRow(row1, row2) {
			//附件的删除
			// console.log(row1, row2)
			this.$http.post(this.$store.state.Interface.sm, Qs.stringify({
				transType: "fileManage",
				handleType: "deleteFile",
				pk_doc: row2.pk_doc
			})).then((res) => {
				// console.log(res)
				if(res.data.flag == '0') {
					this.fileinit();
				} else {
					this.$message.error(res.data.des);
				}
			}).catch((err) => {
				this.$message.error(err);
			})

		},
		//获取 stroe中存的静态数据
		getData(key) {
			return this.$store.state.Information[key];
		}
	}
	}</script>
