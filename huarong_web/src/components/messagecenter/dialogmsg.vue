<template>  
	<div class="y-msg-dialog">
		<!--<el-dialog :title="title" :show-close="false" :visible="dialogvisible" size="tiny">-->
		<!--预警消息弹框-->
		<div v-if="judgedialog=='warning'">
			<el-dialog :title="title"  :show-close="true" :before-close="handleClose" :visible="dialogvisible" size="tiny">
				<div v-show="true">
					<div class="y-dialog-body">
						<table class="y-info-list">
							<tr>
								<td>主题:</td>
								<td>{{data.subject}}</td>
							</tr>
							
							<tr>
								<td>发送人:</td>
								<td>{{data.sender}}</td>
							</tr>
							<tr>
								<td>时间:</td>
								<td>{{data.sendtime}}</td>
							</tr>
							
							<tr>
								<td>内容 :</td>
								<td>{{data.content}}</td>
							</tr>
							<tr v-if="data.attach && data.attach.length > 0">
								<td>附件 :</td>
								<td><a v-for="item in data.attach" :href="item.filesrc" target="_blank">{{item.filename}}</a></td>
							</tr>
						</table>  
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button> 
				  	</div>
				</div>
				
			</el-dialog>
		</div>
		<!--待办消息弹框-->
		<div v-else-if="judgedialog=='handle'">
			<el-dialog :title="title"  :show-close="true" :before-close="handleClose" :visible="dialogvisible" size="tiny">
				<div v-if="billType=='6111'">
					<div class="y-dialog-body">
						<el-row :gutter="20">
						  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
						</el-row>
						<!--审批进度-->
						<el-row :gutter="20">
						  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
						  <el-col :span="20">
						  	<div v-for="(val,key) in data.Hisapprove">
						  		<!--y-dialog-border-->
						  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
						  			<div style="float: left;position: absolute;left: -16px;">
						  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  				<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
						  			</div>
						  			<div class="dialogpingyu">
						  				<div class="dialogsanjiao"></div>
						  				<div class="clearfix">
						  					<div style="float: left;">
						  						<span>[<span>{{val.spzk}}</span>]</span>
							  					<span>{{val.checkman}}</span>
						  					</div>
							  				<div style="float: right;">
							  					<span>{{val.ApproveTime}}</span>
							  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
							  				</div>
						  				</div>
						  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
						  			</div>
						  		</div>
						  	</div>
						  	
						  </el-col>
						</el-row>
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<!--<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>-->
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="approve()">批准</el-button>
				    	<el-button class="y-btn-searchb" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="reject()">驳回</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus!='0'&&data.billStatus!='-1'" @click="abandoned()">弃审</el-button>
				    	<el-button class="y-btn-searchj" v-show="data.isaddsign=='true'&&data.billStatus!='-1'" type="danger" @click="sign()">加签</el-button>
				    	<el-button class="y-btn-searchj" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="dialognone()">取消</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.billStatus=='-1'"  @click="beRead()">我知道了</el-button>
				  	</div>
				</div>
				<div v-else-if="billType=='6117'">
					<div class="y-dialog-body">
						<el-row :gutter="20">
						  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
						</el-row>
						<!--审批进度-->
						<el-row :gutter="20">
						  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
						  <el-col :span="20">
						  	<div v-for="(val,key) in data.Hisapprove">
						  		<!--y-dialog-border-->
						  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
						  			<div style="float: left;position: absolute;left: -16px;">
						  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  				<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
						  			</div>
						  			<div class="dialogpingyu">
						  				<div class="dialogsanjiao"></div>
						  				<div class="clearfix">
						  					<div style="float: left;">
						  						<span>[<span>{{val.spzk}}</span>]</span>
							  					<span>{{val.checkman}}</span>
						  					</div>
							  				<div style="float: right;">
							  					<span>{{val.ApproveTime}}</span>
							  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
							  				</div>
						  				</div>
						  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
						  			</div>
						  		</div>
						  	</div>
						  	
						  </el-col>
						</el-row>
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<!--<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>-->
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="approve()">批准</el-button>
				    	<el-button class="y-btn-searchb" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="reject()">驳回</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus!='0'&&data.billStatus!='-1'" @click="abandoned()">弃审</el-button>
				    	<el-button class="y-btn-searchj" v-show="data.isaddsign=='true'&&data.billStatus!='-1'" type="danger" @click="sign()">加签</el-button>
				    	<el-button class="y-btn-searchj" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="dialognone()">取消</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.billStatus=='-1'" @click="beRead()">我知道了</el-button>
				  	</div>
				</div>
				<div v-else-if="billType=='6115'">
					<div class="y-dialog-body">
						<el-row :gutter="20">
						  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
						</el-row>
						<!--审批进度-->
						<el-row :gutter="20">
						  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
						  <el-col :span="20">
						  	<div v-for="(val,key) in data.Hisapprove">
						  		<!--y-dialog-border-->
						  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
						  			<div style="float: left;position: absolute;left: -16px;">
						  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  				<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
						  			</div>
						  			<div class="dialogpingyu">
						  				<div class="dialogsanjiao"></div>
						  				<div class="clearfix">
						  					<div style="float: left;">
						  						<span>[<span>{{val.spzk}}</span>]</span>
							  					<span>{{val.checkman}}</span>
						  					</div>
							  				<div style="float: right;">
							  					<span>{{val.ApproveTime}}</span>
							  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
							  				</div>
						  				</div>
						  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
						  			</div>
						  		</div>
						  	</div>
						  	
						  </el-col>
						</el-row>
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<!--<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>-->
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="approve()">批准</el-button>
				    	<el-button class="y-btn-searchb" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="reject()">驳回</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus!='0'&&data.billStatus!='-1'" @click="abandoned()">弃审</el-button>
				    	<el-button class="y-btn-searchj" v-show="data.isaddsign=='true'&&data.billStatus!='-1'" type="danger" @click="sign()">加签</el-button>
				    	<el-button class="y-btn-searchj" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="dialognone()">取消</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.billStatus=='-1'" @click="beRead()">我知道了</el-button>
				  	</div>
				</div>
				<div v-else-if="billType=='6113'">
					<div class="y-dialog-body">
						<el-row :gutter="20">
						  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
						</el-row>
						<!--审批进度-->
						<el-row :gutter="20">
						  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
						  <el-col :span="20">
						  	<div v-for="(val,key) in data.Hisapprove">
						  		<!--y-dialog-border-->
						  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
						  			<div style="float: left;position: absolute;left: -16px;">
						  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  				<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
						  			</div>
						  			<div class="dialogpingyu">
						  				<div class="dialogsanjiao"></div>
						  				<div class="clearfix">
						  					<div style="float: left;">
						  						<span>[<span>{{val.spzk}}</span>]</span>
							  					<span>{{val.checkman}}</span>
						  					</div>
							  				<div style="float: right;">
							  					<span>{{val.ApproveTime}}</span>
							  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
							  				</div>
						  				</div>
						  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
						  			</div>
						  		</div>
						  	</div>
						  	
						  </el-col>
						</el-row>
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<!--<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>-->
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="approve()">批准</el-button>
				    	<el-button class="y-btn-searchb" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="reject()">驳回</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus!='0'&&data.billStatus!='-1'" @click="abandoned()">弃审</el-button>
				    	<el-button class="y-btn-searchj" v-show="data.isaddsign=='true'&&data.billStatus!='-1'" type="danger" @click="sign()">加签</el-button>
				    	<el-button class="y-btn-searchj" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="dialognone()">取消</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.billStatus=='-1'" @click="beRead()">我知道了</el-button>
				  	</div>
				</div>
				<div v-else-if="billType=='6101'">
					<div class="y-dialog-body">
						<el-row :gutter="20">
						  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
						</el-row>
						<!--审批进度-->
						<el-row :gutter="20">
						  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
						  <el-col :span="20">
						  	<div v-for="(val,key) in data.Hisapprove">
						  		<!--y-dialog-border-->
						  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
						  			<div style="float: left;position: absolute;left: -16px;">
						  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  				<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
						  			</div>
						  			<div class="dialogpingyu">
						  				<div class="dialogsanjiao"></div>
						  				<div class="clearfix">
						  					<div style="float: left;">
						  						<span>[<span>{{val.spzk}}</span>]</span>
							  					<span>{{val.checkman}}</span>
						  					</div>
							  				<div style="float: right;">
							  					<span>{{val.ApproveTime}}</span>
							  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
							  				</div>
						  				</div>
						  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
						  			</div>
						  		</div>
						  	</div>
						  	
						  </el-col>
						</el-row>
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<!--<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>-->
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="approve()">批准</el-button>
				    	<el-button class="y-btn-searchb" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="reject()">驳回</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.approveStatus!='0'&&data.billStatus!='-1'" @click="abandoned()">弃审</el-button>
				    	<el-button class="y-btn-searchj" v-show="data.isaddsign=='true'&&data.billStatus!='-1'" type="danger" @click="sign()">加签</el-button>
				    	<el-button class="y-btn-searchj" type="danger" v-show="data.approveStatus=='0'&&data.billStatus!='-1'" @click="dialognone()">取消</el-button>
				    	<el-button class="y-btn-searchp" type="danger" v-show="data.billStatus=='-1'" @click="beRead()">我知道了</el-button>
				  	</div>
				</div>
				<div v-else>
					<div class="y-dialog-body">
						开发中。。。
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<el-button class="y-btn-search" type="danger" @click="dialognone">我知道了</el-button>
				  	</div>
				</div>
			</el-dialog>
		</div>
		<!--通知消息弹框-->
		<div v-else-if="judgedialog=='inform'">
			
			<el-dialog :title="title"  :show-close="true" :before-close="handleClose" :visible="dialogvisible" size="tiny">
				<div v-if="data.msgsourcetype=='notice'">
					<div class="y-dialog-body">
						<table class="y-info-list">
							<tr>
								<td>主题:</td>
								<td>{{data.subject}}</td>
							</tr>
							
							<tr>
								<td>发送人:</td>
								<td>{{data.sender}}</td>
							</tr>
							<tr>
								<td>时间:</td>
								<td>{{data.sendtime}}</td>
							</tr>
							
							<tr>
								<td>内容 :</td>
								<td>{{data.content}}</td>
							</tr>
							<tr v-if="data.attach && data.attach.length > 0">
								<td>附件 :</td>
								<td><a v-for="item in data.attach" :href="item.filesrc" target="_blank">{{item.filename}}</a></td>
							</tr>
						</table>  
					</div> 
				  	<div slot="footer" class="y-dialog-footer">
				    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button> 
				  	</div>
				</div>
				
				<div v-else-if="data.msgsourcetype=='pfbizmsg'||data.msgsourcetype=='worklist'">
					<!--判断通知消息-->
					<div v-if="billType=='6111'">
						<div class="y-dialog-body">
							<el-row :gutter="20">
							  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
							</el-row>
							<!--审批进度-->
							<el-row :gutter="20">
							  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
							  <el-col :span="20">
							  	<div v-for="(val,key) in data.Hisapprove">
							  		<!--y-dialog-border-->
							  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
							  			<div style="float: left;position: absolute;left: -16px;">
							  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  					<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
							  			</div>
							  			<div class="dialogpingyu">
							  				<div class="dialogsanjiao"></div>
							  				<div class="clearfix">
							  					<div style="float: left;">
							  						<span>[<span>{{val.spzk}}</span>]</span>
								  					<span>{{val.checkman}}</span>
							  					</div>
								  				<div style="float: right;">
								  					<span>{{val.ApproveTime}}</span>
								  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
								  				</div>
							  				</div>
							  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
							  			</div>
							  		</div>
							  	</div>
							  	
							  </el-col>
							</el-row>
						</div> 
					  	<div slot="footer" class="y-dialog-footer">
					    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>
					  	</div>
					</div>
					<div v-else-if="billType=='6117'">
						<div class="y-dialog-body">
							<el-row :gutter="20">
							  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
							</el-row>
							<!--审批进度-->
							<el-row :gutter="20">
							  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
							  <el-col :span="20">
							  	<div v-for="(val,key) in data.Hisapprove">
							  		<!--y-dialog-border-->
							  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
							  			<div style="float: left;position: absolute;left: -16px;">
							  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  					<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
							  			</div>
							  			<div class="dialogpingyu">
							  				<div class="dialogsanjiao"></div>
							  				<div class="clearfix">
							  					<div style="float: left;">
							  						<span>[<span>{{val.spzk}}</span>]</span>
								  					<span>{{val.checkman}}</span>
							  					</div>
								  				<div style="float: right;">
								  					<span>{{val.ApproveTime}}</span>
								  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
								  				</div>
							  				</div>
							  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
							  			</div>
							  		</div>
							  	</div>
							  	
							  </el-col>
							</el-row>
						</div> 
					  	<div slot="footer" class="y-dialog-footer">
					    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>
					  	</div>
					</div>
					<div v-else-if="billType=='6115'">
						<div class="y-dialog-body">
							<el-row :gutter="20">
							  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
							</el-row>
							<!--审批进度-->
							<el-row :gutter="20">
							  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
							  <el-col :span="20">
							  	<div v-for="(val,key) in data.Hisapprove">
							  		<!--y-dialog-border-->
							  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
							  			<div style="float: left;position: absolute;left: -16px;">
							  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  					<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
							  			</div>
							  			<div class="dialogpingyu">
							  				<div class="dialogsanjiao"></div>
							  				<div class="clearfix">
							  					<div style="float: left;">
							  						<span>[<span>{{val.spzk}}</span>]</span>
								  					<span>{{val.checkman}}</span>
							  					</div>
								  				<div style="float: right;">
								  					<span>{{val.ApproveTime}}</span>
								  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
								  				</div>
							  				</div>
							  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
							  			</div>
							  		</div>
							  	</div>
							  	
							  </el-col>
							</el-row>
						</div> 
					  	<div slot="footer" class="y-dialog-footer">
					    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>
					  	</div>
					</div>
					<div v-else-if="billType=='6113'">
						<div class="y-dialog-body">
							<el-row :gutter="20">
							  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
							</el-row>
							<!--审批进度-->
							<el-row :gutter="20">
							  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
							  <el-col :span="20">
							  	<div v-for="(val,key) in data.Hisapprove">
							  		<!--y-dialog-border-->
							  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
							  			<div style="float: left;position: absolute;left: -16px;">
							  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  					<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
							  			</div>
							  			<div class="dialogpingyu">
							  				<div class="dialogsanjiao"></div>
							  				<div class="clearfix">
							  					<div style="float: left;">
							  						<span>[<span>{{val.spzk}}</span>]</span>
								  					<span>{{val.checkman}}</span>
							  					</div>
								  				<div style="float: right;">
								  					<span>{{val.ApproveTime}}</span>
								  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
								  				</div>
							  				</div>
							  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
							  			</div>
							  		</div>
							  	</div>
							  	
							  </el-col>
							</el-row>
						</div> 
					  	<div slot="footer" class="y-dialog-footer">
					    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>
					  	</div>
					</div>
					<div v-else-if="billType=='6101'">
						<div class="y-dialog-body">
							<el-row :gutter="20">
							  <el-col :span="8"  v-for="(val,key) in newDatalist"><span class="y-dialog-line">{{val}}</span>：<span class="y-dialog-line">{{data.Datalist[key]}}</span></el-col>
							</el-row>
							<!--审批进度-->
							<el-row :gutter="20">
							  <el-col :span="4"><span class="y-dialog-line">审批进度：</span></el-col>
							  <el-col :span="20">
							  	<div v-for="(val,key) in data.Hisapprove">
							  		<!--y-dialog-border-->
							  		<div class="clearfix" :class="data.Hisapprove.length==key+1? 'y-dialog-border1' :'y-dialog-border'"  style="position: relative;padding-bottom: 12px;" >
							  			<div style="float: left;position: absolute;left: -16px;">
							  				<img class="dialogimg" v-if="!val.img" :src="Img"/>
						  					<img class="dialogimg" v-else :src="'data:image/png;base64,'+val.img"/>
							  			</div>
							  			<div class="dialogpingyu">
							  				<div class="dialogsanjiao"></div>
							  				<div class="clearfix">
							  					<div style="float: left;">
							  						<span>[<span>{{val.spzk}}</span>]</span>
								  					<span>{{val.checkman}}</span>
							  					</div>
								  				<div style="float: right;">
								  					<span>{{val.ApproveTime}}</span>
								  					<!--<span>到达时间：{{val.strSendTime}}</span>-->
								  				</div>
							  				</div>
							  				<div><span>审批意见</span>：<span>{{val.result}}</span></div>
							  			</div>
							  		</div>
							  	</div>
							  	
							  </el-col>
							</el-row>
						</div> 
					  	<div slot="footer" class="y-dialog-footer">
					    	<el-button class="y-btn-search" type="danger" @click="beRead">我知道了</el-button>
					  	</div>
					</div>
					<div v-else>
						<div class="y-dialog-body">
							开发中。。。
						</div> 
					  	<div slot="footer" class="y-dialog-footer">
					    	<el-button class="y-btn-search" type="danger" @click="dialognone">我知道了</el-button>
					  	</div>
					</div>
				</div>
				
			</el-dialog>
		</div>
		
		<!--提交弹框-->
		<div class="y-dialogmit">
			<el-dialog title="审批意见" :show-close="false" top='30%' :close-on-click-modal="false" :visible.sync="dialogFormVisible">
			  <div class="y-dialogsubmit-body">
			  	<!--书写理由-->
			  	<textarea placeholder="请输入审批意见" style="width:100%;height:100px;border:none;resize:none;outline:none;overflow-x:hidden;overflow-y:hidden">{{sumreason}}</textarea>
			  	<!--判断是否加签-->
			    <!--判断是批准-->
			    <div v-if="judgbutton=='approveb'">
			    	<div v-show="options.length!='0'">
				    	<template>
						  <el-select v-model="value5" filterable multiple placeholder="请选择指派人">
						    <el-option
						      v-for="item in options"
						      :key="item.user_id"
						      :label="item.user_name"
						      :value="item.user_id">
						    </el-option>
						  </el-select>
					    </template>
				    </div>
			    </div>
			    <!--判断是驳回-->
			    <div v-else-if="judgbutton=='rejectb'">
			    	<div>
				    	<template>
						  <el-select v-model="value5" placeholder="请选择指派人" filterable>
						    <el-option
						      v-for="item in options"
						      :key="item.user_id"
						      :label="item.user_name"
						      :value="item.user_id">
						    </el-option>
						  </el-select>
					    </template>
				    </div>
			    </div>
			    <!--判断是加签-->
			    <div v-else-if="judgbutton=='signb'">
			    	<div>
				    	<template>
						  <el-select v-model="value5" filterable multiple placeholder="请选择指派人">
						    <el-option
						      v-for="item in options"
						      :key="item.user_id"
						      :label="item.user_name"
						      :value="item.user_id">
						    </el-option>
						  </el-select>
					    </template>
				    </div>
			    </div>
			    
			  </div>
			  <div slot="footer" class="dialog-footer">
			    <el-button class="y-btn-searchp" type="danger"  @click="submit('Y')">提交</el-button>
			    <el-button class="y-btn-searchb" type="danger" @click="dialogFormVisible = false">取 消</el-button>
			  </div>
			</el-dialog>
		</div>
		
	</div>
	
</template> 
<script>   
	
import Qs from 'qs';
import Image from '@/assets/img/peple.png';
import Cookies from 'js-cookie';

var UserInfo;
export default {  
	props: ['dialogvisible','data','judgedialog'], 
	computed: {
		url(){  
			return this.$store.state.Interface.msglist;//后端接口；
		},
		title(){
//			var _type = this.data.msgType;
			if(this.judgedialog=='warning'){
				return this.titleObj['prealert'];
			}else if(this.judgedialog=='inform'){
				return this.titleObj['notice'];
			}else if(this.judgedialog=='handle'){
				return this.titleObj['worklist'];
			}
		},
		billType(){
			if(this.data==''){
				return '';
			}else{
				return this.data.billType.slice(0,4);
			}
		},
		newDatalist(){
			
			if(this.data==''){
				return '';
			}else{
//				var diaoborder=document.getElementsByClassName('y-dialog-border');
//				console.log(diaoborder)
				
				var objdata="";
				//console.log(this.data)
				//处理弹框为显示的字段
				
				var billType=this.data.billType.slice(0,4);
				
				
				if(billType=="6101"){//入职申请
					objdata=this.$store.state.Msgdata.entryrequest;
					return objdata;
				}else if(billType=="6111"){//转正申请
					objdata=this.$store.state.Msgdata.becomerequest;
					return objdata;
				}else if(billType=="6113"){//调配申请
					objdata=this.$store.state.Msgdata.tunerequest;
					return objdata;
				}else if(billType=="6117"){//兼职申请
					objdata=this.$store.state.Msgdata.partjobrequest;
					return objdata;
				}else if(billType=="6115"){//离职申请
					objdata=this.$store.state.Msgdata.leaverequest;
					return objdata;
				}
			}
			
		}
		
	},
	mounted(){
//		UserInfo = JSON.parse( Cookies.get('usermsg') );//获取人员信息
	},
	data(){
		return {
			dialogFormVisible:false,
			judgbutton:'',
			borderkey:'',//流程历史最后一个不显示边框
			titleObj: {
				"notice": "通知消息",
				"prealert": "预警消息",
				"worklist": "待办消息"
			},
			options:'',
	        value5:'',//加签的值
	        sumreason:"",
	        signshow:false,
	        Img:Image
	        
		}
	},
	methods:{
		dialognone(){//暂时控制未开发的单据关闭；
			this.$emit('close');
		},
		approve(){
			this.sumreason='同意';
			this.judgbutton='approveb';
			this.dialogFormVisible=true;
			this.assignman('0');//获取指派人数据
		},
		reject(){
			this.sumreason='驳回';
			this.judgbutton='rejectb';
			this.dialogFormVisible=true;
			this.assignman('2');//获取指派人数据
		},
		sign(){
			this.sumreason='加签';
			this.judgbutton='signb';
			this.dialogFormVisible=true;
			this.assignman('3');//获取指派人数据
		},
		abandoned(){
			this.$http.post( this.url, Qs.stringify ({
				transType:'approveBack',
//				pk_group:UserInfo.pk_group,
//				cuserid:UserInfo.cuserid,
				taskId:this.data.pk_detail
			}), {
	          	headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
	          	}
	      	}).then(( response ) => {  
				
//				console.log(response);
				if(response.data.flag=='0'){
					this.$message({
			          message: response.data.des,
			          type: 'success'
			        });
			        this.$emit('read');
				}else{
					this.$message.error( response.data.des );
				}
				
			}).catch((err) => { 
				this.$message.error( err );
			});
			
		},
		submit(isflag){
//			console.log(this.sumreason,'\\',this.value5)
			if(this.judgbutton=='approveb'){//如果有指派人也是必须填写
				if(this.options.length!='0'){
					if(this.value5==''){
						this.$message.error("指派人不能为空");
					}else{
						var dispath='';
						for(var i in this.value5){
							dispath+=this.value5[i]+';';
						}
						this.submitdata('0',dispath,this.sumreason,'',isflag)
					}
				}else{
					this.submitdata('0','',this.sumreason,'',isflag)
				}
				
			}else if(this.judgbutton=='rejectb'){//驳回指派人是可有可无的
				
				var dispath='';
				for(var i in this.value5){
					dispath+=this.value5[i];
				}
				this.submitdata('2','',this.sumreason,dispath,isflag);//驳回的时候只能选择一个人，并且传的值不能带分好；
				
			}else if(this.judgbutton=='signb'){//加签指派人必须有
				
				if(this.value5==''){
					this.$message.error("指派人不能为空");
				}else{
					var dispath='';
					for(var i in this.value5){
						dispath+=this.value5[i]+';';
					}
					this.submitdata('3','',this.sumreason,dispath,isflag)
				}
			}
		},
		dialognone(){//取消按钮
			this.$emit('close');
		},
		handleClose(){
			this.$emit('close');
		},
		beRead(){ 
			var _msgpk = this.data.msgpk;
			
			//点击我知道了发送已读信息；
			this.$http.post( this.url, Qs.stringify ({
				"transType":'markreaded',
				"msgpk": _msgpk
			}), { 
	          	headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
	          	}
	      	}).then(( response ) => {  
				var _data = response.data;
				if( _data.flag == "0" ){
					this.$emit('read'); 
				}else{
					this.$message.error( _data.des );
					this.$emit('close'); 
				}; 
			}).catch((err) => { 
				this.$message.error( err );
			}); 
		},
		assignman(arg){
			this.$http.post( this.url, Qs.stringify ({
				transType:'dispatch',
//				pk_group:UserInfo.pk_group,
				billId:this.data.billId,
//				cuserid:UserInfo.cuserid,
				opflag:arg,
				taskId:this.data.pk_detail
			}), {
	          	headers: {
	                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
	          	}
	      	}).then(( response ) => {  
				if(response.data.flag=='0'){
					this.options=JSON.parse(response.data.data);
				}else{
					this.$message.error(response.data.des );
				}
			}).catch((err) => { 
				this.$message.error( err );
			});
		},
		submitdata(arg,asg,rea,ject,flag){//封装审批驳回加签提交数据
			this.$http.post( this.url, Qs.stringify ({
				transType:'billHandler',
				billId:this.data.billId,
//				cuserid:UserInfo.cuserid,
//				pk_group:UserInfo.pk_group,
				taskId:this.data.pk_detail,
				isflag:flag,
//				pk_org:UserInfo.pk_org,
				opflag:arg,
				dispatchId:asg,//指派人
				checkNote:rea,//审批意见
				nodeId:ject//驳回传驳回节点
			})).then(( response ) => {
//				console.log(response)
				if(response.data.flag=='0'){//提交数据成功函数
					this.$message({
			          message: response.data.des,
			          type: 'success'
			        });
			        this.dialogFormVisible=false;
			        this.$emit('read');
			        this.value5='';
			        this.sumreason='';
					
				}else if(response.data.flag=='3'){
					
					this.$confirm(response.data.des, '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消'
			        }).then(() => {
						this.submit('N')		         
			        }).catch(() => {
			          
			        });
				}else{
					this.$message.error( response.data.des );
				}

			}).catch((err) => { 
				this.$message.error( err );
			});
		}
	} 
};
</script> 