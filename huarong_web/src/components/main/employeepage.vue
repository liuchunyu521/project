<template>
	<div>    
		<div id="L-mainbanner">
			<img src="../../assets/img/mainimg/banner.png"/>
		</div>
		<div id="L-mainmange">
			<el-row :gutter="15">
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<router-link to="/mySalary">
							<div class="L-mainmangestyle">	
							  	<div id="fontstyle">薪资查询</div>
							  	<div>
							  		<el-row>
							  			<el-col :span="10"><div class="L-img"><img src="../../assets/img/mainimg/xzcx.png"/></div></el-col>
							  			<el-col :span="14"><div class="L-reasons">每月工资明细、社保、公积金等福利随心查</div></el-col>
							  		</el-row>
							  	</div>
						  	</div>
					  	</router-link>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<div @click="temporary()" class="L-mainmangestyle">	
						  	<div id="fontstyle">请假申请</div>
						  	<div>
						  		<el-row>
						  			<el-col :span="10"><div class="L-img"><img src="../../assets/img/mainimg/qjsq.png"/></div></el-col>
						  			<el-col :span="14"><div class="L-reasons">快速填写申请单，实时更新审批流程，高效便捷</div></el-col>
						  		</el-row>
						  	</div>
					  	</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<div @click="temporary()" class="L-mainmangestyle">	
						  	<div id="fontstyle">开具证明</div>
						  	<div>
						  		<el-row>
						  			<el-col :span="10"><div class="L-img"><img src="../../assets/img/mainimg/kjzm.png"/></div></el-col>
						  			<el-col :span="14"><div class="L-reasons">开具各种证明，如工作证明、离职证明等等</div></el-col>
						  		</el-row>
						  	</div>
					  	</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<div @click="linkToAssessScore()" class="L-mainmangestyle">	
						  	<div id="fontstyle">考核测评</div>
						  	<div>
						  		<el-row>
						  			<el-col :span="10"><div class="L-img"><img src="../../assets/img/mainimg/khcp.png"/></div></el-col>
						  			<el-col :span="14"><div class="L-reasons">参与考核、查看个人考核历史评分及个人考核结果</div></el-col>
						  		</el-row>
						  	</div>
					  	</div>
					</div>
				</el-col>
				
			</el-row>
		</div>
		
		<div id="L-mainuserlist">
			<el-row type="flex" :gutter="16">
				<el-col :span="11" style='position: relative;'>
					<!--<div v-show="!listdata1.msglist" style="text-align: center;width:135px;height:84px;position: absolute;z-index: 999;top: 40%;left: 50%;margin-left: -70px;">
						<img  src="../../assets/img/nodata.png"/>
						<span>暂无数据哦</span>
					</div>-->
					<div class="morelist" @click="morelist">更多&gt;&gt;</div>
					<el-tabs v-model="activeName" @tab-click="handleClick">
						
					    <el-tab-pane  name="first">
					    	<span slot="label">工作任务<span><span style="font-size: 12px;" v-if="listdata1.totalcount">({{listdata1.totalcount}})</span><span style="font-size: 12px;" v-else='!listdata1.totalcount'>(0)</span></span></span>
					    	<li class="L-list clearfix" v-for="(item, index) in listdata1.msglist" @click="rowhand(index)">
					    		<span class="L-order">{{index+1}}.</span>
					    		<span class="L-listtitle">
					    			{{item.subject}}
					    			<span class="col"></span> 
					    		</span>
					    		<span class="L-date">{{item.sendtime}}</span>
					    	</li>
							<div v-show="!listdata1.msglist" style="text-align: center;width:135px;height:84px;position: absolute;z-index: 999;top: 40%;left: 50%;margin-left: -70px;">
								<img  src="../../assets/img/nodata.png"/>
								<span>暂无数据哦</span>
							</div>
					    </el-tab-pane>
					    <el-tab-pane  name="second">
					    	<!--v-show="totalshow==1"-->
					    	<span slot="label">通知消息<span><span style="font-size: 12px;"  v-if="listdata2.totalcount">({{listdata2.totalcount}})</span><span style="font-size: 12px;" v-else='!listdata2.totalcount'>(0)</span></span></span>
					    	
					    	<li class="L-list clearfix" v-for="(item, index) in listdata2.msglist" @click="rowhand(index)"> 
					    		<span class="L-order">{{index+1}}.</span>
					    		<span class="L-listtitle">
					    			{{item.subject}}
					    			<span class="col"></span>
					    		</span>
					    		<span class="L-date">{{item.sendtime}}</span>
					    	</li>
					    	<div v-show="!listdata2.msglist" style="text-align: center;width:135px;height:84px;position: absolute;z-index: 999;top: 40%;left: 50%;margin-left: -70px;">
								<img  src="../../assets/img/nodata.png"/>
								<span>暂无数据哦</span>
							</div>
					    	
					    </el-tab-pane>
					    <el-tab-pane  name="third">
					    	<span slot="label">预警消息<span><span style="font-size: 12px;" v-if="listdata3.totalcount">({{listdata3.totalcount}})</span><span style="font-size: 12px;" v-else='!listdata3.totalcount'>(0)</span></span></span>
					    	
					    	<li class="L-list clearfix" v-for="(item, index) in listdata3.msglist"  @click="rowhand(index)">
					    		<span class="L-order">{{index+1}}.</span>
					    		<span class="L-listtitle">
					    			{{item.subject}}
					    			<span class="col"></span>
					    		</span>
					    		<span class="L-date">{{item.sendtime}}</span>
					    	</li>
					    	<div v-show="!listdata3.msglist" style="text-align: center;width:135px;height:84px;position: absolute;z-index: 999;top: 40%;left: 50%;margin-left: -70px;">
								<img  src="../../assets/img/nodata.png"/>
								<span>暂无数据哦</span>
							</div>
					    </el-tab-pane>
					</el-tabs>
				</el-col>
				<!--规章制度开始-->
				<el-col :span="7">
					<el-tabs v-model="activeName1" >
					    <el-tab-pane label="规章制度"  name="first">
					    	<div  style="text-align: center;width:135px;height:84px;position: absolute;z-index: 999;top: 40%;left: 50%;margin-left: -70px;">
								<img  src="../../assets/img/nodata.png"/>
								<span>暂无数据哦</span>
							</div>
					    	<!--<li class="L-list clearfix" @click="temporary()">
					    		<span class="L-order">1.</span>
					    		<span class="L-ruleslisttitle">
					    			新员工转正管理制度
					    			<span class="col"></span>
					    		</span>
					    		<span class="L-date">2017-08-03</span>
					    	</li>
					    	<li class="L-list clearfix" @click="temporary()">
					    		<span class="L-order">2.</span>
					    		<span class="L-ruleslisttitle">
					    			新员工管理制度
					    			<span class="col"></span>
					    		</span>
					    		<span class="L-date">2017-08-03</span>
					    	</li>
					    	<li class="L-list clearfix" @click="temporary()">
					    		<span class="L-order">3.</span>
					    		<span class="L-ruleslisttitle">
					    			社会保险及公积金管理制度
					    			<span class="col"></span>
					    		</span>
					    		<span class="L-date">2017-08-03</span>
					    	</li>
					    	<li class="L-list clearfix" @click="temporary()">
					    		<span class="L-order">4.</span>
					    		<span class="L-ruleslisttitle">
					    			劳动合同续签管理制度
					    			<span class="col"></span>
					    		</span>
					    		<span class="L-date">2017-08-03</span>
					    	</li>-->
					    </el-tab-pane>
					   
					</el-tabs>
				</el-col>
				<el-col :span="6">
					<el-tabs v-model="activeName2" >
					    <el-tab-pane label="我的应用" name="first">
					    	<el-row >
					    		<el-col :span="8" class="system" >
				    				<div @click="mailhref()">
				    					<div  class="systemback  L-qianblue"><i class="iconfont iconfontsize icon-youjian"></i>
						    				<!--<span class="systembackmsg">12</span>-->
						    			</div>
						    			<span id="NewMailCount"></span>
						    			<div class="systemcolor">邮件系统</div>
				    				</div>
					    		</el-col>
					    		
					    		<el-col :span="8" class="system">
					    			<div @click="publichref()">
					    				<div class="systemback  L-qianyellow"><i class="iconfont iconfontsize icon-gonggao"></i></div>
					    				<span id="NotifyCount"></span>
					    				<div class="systemcolor">公共通知</div>
					    			</div>
					    		</el-col>
					    		<el-col :span="8" class="system ">
					    			<div @click="filehref()">
					    				<div class="systemback L-shenred"><i class="iconfont iconfontsize icon-wenjian"></i></div>
					    				<span id="NewFileCount"></span>
					    				<div class="systemcolor">文件系统</div>
					    			</div>
					    		</el-col>
					    		<el-col :span="8" class="system">
					    			<div @click="handlehref()">
					    				<div class="systemback  L-green"><i class="iconfont iconfontsize icon-daiban"></i></div>
					    				<span  id="WaitDealCount"></span>
					    				<div class="systemcolor">办公待办</div>
					    			</div>
					    		</el-col>
					    		<el-col :span="8" class="system">
					    			<div @click="businesshref()">
					    				<div class="systemback  L-yellew"><i class="iconfont iconfontsize icon-yewu"></i></div>
					    				<span id="BizWaitingCount"></span>
					    				<div class="systemcolor">业务待办</div>
					    			</div>
					    		</el-col>
					    		<el-col :span="8" class="system">
					    			<div @click="meethref()">
					    				<div class="systemback L-blue"><i class="iconfont iconfontsize icon-huiyiziliao"></i></div>
					    				<span id="badge"></span>
					    				<div class="systemcolor">会议资料</div>
					    			</div>
					    		</el-col>
					    		
					    	</el-row>
					    	
					    </el-tab-pane>
					    
					</el-tabs>
				</el-col>
			</el-row>
		</div>
		
		<MessageDialog :dialogvisible="openDialog" :data="msgdata" :judgedialog="judgedialog"
			@close="openDialog = false"
			@read="msgRead">
		</MessageDialog>
	</div>
</template>

<script>

import Qs from 'qs';
import Cookies from 'js-cookie';
import MessageDialog from '@/components/messagecenter/dialogmsg';
//var UserInfo;
export default{
	computed: {
		url(){ 
			return this.$store.state.Interface.msglist;
		} 
	},
	components: { 
		MessageDialog
	},
	data(){
		return {
			 openDialog: false, //默认关闭对话框
			 judgedialog:'handle',//初始是工作任务
			 activeName: 'first',
			 activeName1: 'first',
			 activeName2: 'first',
			 totalshow:0,
			 msgparam: {
				sendStr: '',
				isRead: 'N',
//				receiver:'',
				transType: 'msglist',
				msgType:'',
				pageIndex: 0,
				isHandled: 'N',
				pageSize: 4
			},
			listdata1:'',
			listdata2:'',
			listdata3:'',
			msgdata:''
		}
	},
	mounted(){
		this.loadMsg('worklist'); //初始显示流程消息数据
		this.loadMsg('notice'); 
		this.loadMsg('prealert'); 
		this.loadWaitingCount();
	},
	methods: {
	  loadWaitingCount() {
	      var mailBaseURL ='http://mail.chamc.com.cn';
	      var waitingCountURL ='http://hq-fs1.chamc.com.cn/Waitinglist/WaitingCount.ashx';
	        // 办公待办数量
	        var scriptWaitingCount = document.createElement("script");
	        scriptWaitingCount.type = "text/javascript";
	        scriptWaitingCount.src = waitingCountURL + "?callback=renderWaitingCount";
	        document.body.appendChild(scriptWaitingCount);

	        // 业务待办数量
	        var scriptBizWaitingCount = document.createElement("script");
	        scriptBizWaitingCount.type = "text/javascript";
	        scriptBizWaitingCount.src = "http://idm.chamc.com.cn/portal?access_url=http://bms.chamc.com.cn:807/portal/pt/fwd/getNoteCount1?callback=renderBizWaitingCount";
	        document.body.appendChild(scriptBizWaitingCount);

	        // 未读邮件数量
	        var scriptNewMailCount = document.createElement("script");
	        scriptNewMailCount.type = "text/javascript";
	        scriptNewMailCount.src = mailBaseURL + "/Exchange2010Access/MailCount.aspx?act=1&callback=renderNewMailCount";
	        document.body.appendChild(scriptNewMailCount);
	    },
		//消息被置为已读
	  msgRead(){ 
	    	this.openDialog = false;
	    	this.loadMsg(this.msgparam.msgType);  
	    },
      handleClick(tab, event) {
      	if(tab.index=="0"){
      		this.msgparam.msgType='worklist';
      		this.judgedialog='handle';
      		this.loadMsg( 'worklist');
      		this.totalshow=0;
      		
      	}else if(tab.index=="1"){
      		this.msgparam.msgType='notice';
      		this.judgedialog='inform';
      		this.loadMsg('notice');
      		this.totalshow=1;
      	}else if(tab.index=="2"){
      		this.msgparam.msgType='prealert';
      		this.judgedialog='warning';
      		this.loadMsg('prealert');
      		this.totalshow=2;
      	}       
      },
      rowhand(index){
      	//判断是通知消息还是代办消息
      		
	    	if(this.msgparam.msgType=='worklist'){
	    		var row=this.listdata1.msglist[index]
	    		//判断单据的类型，是离职、转正、等
	    		this.$http.post( this.url, Qs.stringify ({
					transType:'msgBill',
//					pk_psndoc:UserInfo.pk_psndoc,
					billId:row.billId,
					billType:row.billType
				}), {
		          	headers: {
		                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
		          	}
		      	}).then(( response ) => {  
					var _data = response.data; 
					if( _data.flag == "1" ){ //操作失败
						this.$message.error( _data.des );
					}else{
//						console.log(_data)
						this.openDialog = true; 
						this.msgdata = row;
		    			this.msgdata.Datalist = JSON.parse(_data.data).headMsg;
		    			this.msgdata.Hisapprove = _data.hisapprove;
					}; 
				}).catch((err) => { 
					this.$message.error( err );
				}); 
	    		
	    		
	    		
	    	}else if(this.msgparam.msgType=='notice'){
	    		var row=this.listdata2.msglist[index]
	    		//如果是通知需要判断通知的类型，是消息还是单据
	    		if(row.msgsourcetype=='notice'){
	    			//通知判断为空的时候
	    			this.openDialog = true; 
			    	this.msgdata = row;
//			    	this.msgdata.msgType = this.param.msgType;
			    	 
	    		}else if(row.msgsourcetype=='worklist' || row.msgsourcetype=='pfbizmsg'){
	    			//不为空的时候需要向后端发送请求显示字段的详细信息；
	    			//获取列表数据；
	    			
					this.$http.post( this.url, Qs.stringify ({
						transType:'msgBill',
//						pk_psndoc:UserInfo.pk_psndoc,
						billId:row.billId,
						billType:row.billType
					}), {
			          	headers: {
			                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
			          	}
			      	}).then(( response ) => {  
						var _data = response.data; 
						if( _data.flag == "1" ){ //操作失败
							this.$message.error( _data.des );
						}else{
//							console.log(JSON.stringify(_data))
							this.openDialog = true; 
							this.msgdata = row;
//			    			this.msgdata.msgType = this.param.msgType;
			    			this.msgdata.Datalist = JSON.parse(_data.data).headMsg;
			    			this.msgdata.Hisapprove = _data.hisapprove;
//			    			console.log(this.msgdata)
						}; 
					}).catch((err) => { 
						this.$message.error( err );
					}); 
	    		}
	    		
	    		
	    	}else if(this.msgparam.msgType=='prealert'){
	    		var row=this.listdata3.msglist[index]
	    		this.openDialog = true; 
		    	this.msgdata = row;
	    	}
	    	
      },
      temporary(){
      	this.$message('开发中敬请期待！！！');
      },
      linkToAssessScore(){
      	this.$router.push( {
      	  path:'/assessScore'
      	})
      },
      morelist(){
      	if(this.totalshow==0){
      		this.$router.push({
	  			name:'/Handlemessagelist',
	  		});
      	}else if(this.totalshow==1){
      		this.$router.push({
	  			name:'/Informmessagelist',
	  		});
      	}else if(this.totalshow==2){
      		this.$router.push({
	  			name:'/Warningmessagelist',
	  		});
      	}
      },
      loadMsg( type ){
      	this.msgparam.msgType = type;
      	var _param = this.msgparam;
		//获取列表数据；
		this.$http.post( this.url, Qs.stringify ( _param ), { 
          	headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
          	}
      	}).then(( response ) => {  
			var _data = response.data; 
			if( _data.flag == "0" ){ //操作失败
				if(type=="worklist"){
					this.listdata1 = _data;
				}else if(type=="notice"){
					this.listdata2 = _data;
				}else if(type=="prealert"){
					this.listdata3 = _data;
				}
				
			}else{
				this.$message.error( _data.des );
			}; 
		}).catch((err) => { 
			this.$message.error( err );
		}); 
     },
     mailhref(){   	
     	window.open('https://mail.chamc.com.cn:4443/owa');
     },
     publichref(){
     	window.open('http://kms.chamc.com.cn/WebPub/Office.html');
     },
     filehref(){
     	window.open('http://kms.chamc.com.cn/WebDoc');
     },
     handlehref(){
     	window.open('http://kms.chamc.com.cn/WebPub/Office.html');
     },
     businesshref(){
     	window.open('http://idm.chamc.com.cn/portal');
     },
     meethref(){
     	window.open('http://kms.chamc.com.cn/meetingdoc');
     }
   } 
}
</script>

<style scoped>
#NewFileCount,#WaitDealCount,#BizWaitingCount,#NewMailCount,#NotifyCount{
	position: absolute;
	width: 20px;
	height: 20px;
	background-color: #E6282A;
	border-radius: 10px;
	top: -5px;
	right: 10%;
	color: white;
	font-weight: bold;
	display: none;
}
.system{
	position: relative;
}
</style>