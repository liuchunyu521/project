<template>
	
	<div class="submit">
		<!-- breadcrumb begin-->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessScore'}">考核测评</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessScore'}">评测打分</el-breadcrumb-item>
		  <el-breadcrumb-item>2017年年度评测打分</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- breadcrumb end -->
		<!-- navigation begin -->
		<div class="navigation">
			<span class="performance_one">考核方案：{{this.schname}}</span>
			<span class="performance_two">考核截止时间：{{this.end_date}}</span>
			<el-button 
			type="primary" 
			@click.native='storeData'
			>保存</el-button>
			
			<el-button 
			ref='mysubmit'
			type="primary"
			 @click.native = 'sendData'
			  >提交</el-button>
		</div>
		<!-- 保存弹出框 -->
<!-- 		<el-dialog
			  title="提示"
			  :visible.sync="dialogVisible1"
			  size="tiny"
			  :before-close="handleClose1">
			  <span>是否确认保存</span>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible1 = false">取 消</el-button>
			    <el-button type="primary" @click='storeData'>确 定</el-button>
			  </span>
			</el-dialog> -->
		 <!-- 提交弹出框 -->
			<el-dialog
			  title="提示"
			  :visible.sync="dialogVisible"
			  size="tiny"
			  :before-close="handleClose">
			  <img src="../../../assets/img/tip.png" height="20" width="20" alt="">
			  <span>是否确认提交</span>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click='submitconfirm'>确 定</el-button>
			  </span>
			</el-dialog>
		<!-- navigation end -->
		<!-- standard begin -->
		<div class="standard">
			<div class="assessstandard">
				<span>评分指标：</span>
				<el-select v-model="value" placeholder='' @visible-change='changeEvent'>
				    <el-option
				      v-for="item in options"
				      :key="item.score"
				      :label="item.indiname"
				      :value="item.standard">
				    </el-option>
				 </el-select>
			</div>
			<div class="assesscriterion">
				<span class="content">评分标准：</span>
				<el-input
				  type="textarea"
				  readonly
				  resize='none'
				  placeholder="请输入内容"
				  v-model="textarea">
				</el-input>
			</div>
		</div>
		<!-- standard end -->
		<!-- tab begin -->
		<div class="tab">
			<el-table
		      :data="tableData"
		      style="width: 100%">
		      <el-table-column
		        prop="clerkcode"
		        label="员工号">
		      </el-table-column>
		      <el-table-column
		        prop="name"
		        label="姓名">
		      </el-table-column>
		      <el-table-column
		        v-for='(item,index) in options'
				:prop='item.score'
		        :label='item.indiname'>
		        <template scope='scope'>
		        	<el-tooltip content="请输入0-100的整数" placement="top" effect='light' style='color:red'>
						<el-input
			        	 max='scope.row.indis[index].rule_score_max'
			        	 min='0'
			        	 ref='myinput'
			        	 @keypress.native='keypressevent'
			        	 @keyup.native='onleavekey'
			        	 @change='calculateTotal'
			        	 v-model.number='scope.row.indis[index].score' class='inputcontent' placeholder=""></el-input>
					</el-tooltip>
		        	
		        </template>
		      </el-table-column>
		      <el-table-column	
		        prop="totalScore"
		        label="总分↑↓">
		      </el-table-column>
		    </el-table>
		</div>
		<!-- tab end -->
	</div>
</template>

<script> 
import Qs from 'qs';
 export default {
 		name:"submit",
 		data(){
 			return {
 				dialogVisible:false,
 				textarea:"",
 				tableData: [],
 				value:"",
 				options:[],
 				schname:"",
 				end_date:"",
 				option:[],
 				input:''
 			}
 		},
 		computed:{
 			url(){
 				return this.$store.state.Interface.as;
 			}
 		},
 		mounted(){
 				var that = this;
 				this.schname = this.$route.query.schname;
 				this.end_date = this.$route.query.end_date;
 				var params = this.$route.query.pk_eva_group;
 				// console.log(this.$route.params.pk_eva_group)
	    		this.$http.post(this.url,Qs.stringify({
	    			'transType':'gauge',
	    			'pk_eva_group':params
	    		}),{
	    			headers:{
	    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	    			}
	    		}).then(function(response){
	    			if(response.data.flag==0){
	    				// console.log(response.data);
	    				// console.log(that.options);
	    				var _data = JSON.parse(response.data.data);
	    				that.option=_data;
	    				that.value=_data[0].indiname;
	    				// console.log(_data);
	    				
	    				var newArr =[];
	    				for(var i=0;i<_data.length;i++){
	    					that.textarea = _data[0].standard;
	    					var item = _data[i];
	    					var object = {};
	    					for(var k in item){	    						
	    						object[k]=item[k];	    						
	    					}
	    					// console.log(object);
	    					// object.weight = object.weight*100;
	    					// console.log(object.weight)
	    					object.indiname = object.indiname + (object.weight*100)+'%';
	    					// console.log(object)
	    					newArr.push(object);
	    				} 	
	    				// console.log(newArr)
	    				that.options = newArr;	    				
	    			}
	    		});
	    		this.$http.post(this.url,Qs.stringify({
	    			'transType':'assess',
	    			'pk_eva_group':params
	    		}),{
	    			headers:{
	    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	    			}
	    		}).then(function(response){
	    			if(response.data.flag==0){	    				
	    				// console.log(response.data.data);
	    				//将tableData中的数据与options中的数据相关联，是的顺序保持一致	   
	    				var _data1=that.option;
	    				// console.log(_data1)
	    				var optionsArr=[];
	    				for(var i=0;i<_data1.length;i++){
	    					var item =_data1[i];
	    					for(var k in item){
	    						if(k=='indiname'){
	    							var needObj={};
	    							needObj[k]=item[k]
	    							optionsArr.push(needObj);
	    						}
	    					}
	    				}
	    				// console.log(optionsArr);
	    				var data = JSON.parse(response.data.data);
	    				var needArr=[];
		    			// for(var a=0;a<optionsArr.length;a++){
		    			// 	//获取到每一个权重指标
		    			// 		var itemoption = optionsArr[a];
		    					//遍历获取到的后台tableData数据
   			    				for(var i=0;i<data.length;i++){
   			    						//获取每一个对象（一层）
		    						var item = data[i];
		    						for(var a=0;a<optionsArr.length;a++){
		    							var itemoption=optionsArr[a];
			    						//遍历对象
			    						for(var t in item){
			    							//获取到indis
			    							if(t=='indis'){
			    								//遍历indis
			    								for(var j=0;j<item[t].length;j++){
			    									//获取到indis的每一项
			    									var item1=item[t][j]
			    									for(var h in item1){
			    										if(itemoption['indiname']==item1[h]){
			    											//遍历该h属性所在的对象
			    											needArr.push(item1)
			    										}
			    									}
			    								}
			    							}
			    						}		    							
		    						}

		    					}				
	    				// }
	    				// console.log(needArr)	
	    				//将needArr放到tableData中
	    				//遍历data中的数据
	    				for(var b=0;b<data.length;b++){
	    					//获取到每一项
	    					var dataitem = data[b];
	    					//遍历每一项（对象）
	    					for(var g in dataitem){
	    						if(g=='indis'){
	    							dataitem['indis']=needArr.splice(0,_data1.length)
	    						}
	    					}

	    				}	
	    				// var data = JSON.parse(response.data.data);
	    				for(var i=0;i<data.length;i++){
	    					var item = data[i];
	    					for(var k in item){
	    						if(k=='totalScore'){
	    							var score = item[k]; 
	    							score=Number(score).toFixed(2);
	    							item[k]=score;
	    						}
	    					}
	    				}
	    				// console.log(data)
	    				that.tableData = data;	    				
	    			}
	    		})
 		},
 		watch:{
 			'input':function(val){
 				// alert('nihao');
 				if(!/^\D/.test(val)){
            	this.input=''
        		}
 			}
 		},
 		methods:{
 			//确认提交
 			submitconfirm(){
 				this.dialogVisible = false;
 				var sendData = encodeURIComponent(JSON.stringify(this.tableData));
 				// console.log(sendData);
 				var that = this;
	    		this.$http.post(this.url,Qs.stringify({
	    			'transType':'commitScore',
	    			'indiStr':sendData,
	    			'isWeightFlag':'Y'
	    		}),{
	    			headers:{
	    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	    			}
	    		}).then(function(response){
	    			if(response.data.flag==0){
	    				that.$message({
	    					message:response.data.des,
	    					type:'success'
	    				});
	    				that.pk_eva_group=that.$route.query.pk_eva_group;
		 				that.end_date=that.$route.query.end_date;
		 				that.schname=that.$route.query.schname;
	    				that.$router.push({path:'/assessScore/lookup',
	    					query:{pk_eva_group:that.$route.query.pk_eva_group,end_date:that.$route.query.end_date,schname:that.$route.query.schname}})
	    			}
	    			else if(response.data.flag==1){
						that.$message(response.data.des);
	    			} else if(response.data.flag==3){
	    				// that.$alert(response.data.des,'提示');
	    				that.$confirm(response.data.des,'提示',{
	    					confirmButtonText:"确定",
	    					cancelButtonText:"取消",
	    					type:'warning'
	    				}).then(()=>
	    				that.$http.post(that.url,Qs.stringify({
		    			'transType':'commitScore',
		    			'indiStr':sendData,
		    			'isWeightFlag':'N'
		    		}),{
		    			headers:{
		    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		    			}
		    		}).then(function(response){
		    			if(response.data.flag==0){
		    				that.$message(response.data.des)
	    				that.pk_eva_group=that.$route.query.pk_eva_group;
		 				that.end_date=that.$route.query.end_date;
		 				that.schname=that.$route.query.schname;
	    				that.$router.push({path:'/assessScore/lookup',
	    					query:{pk_eva_group:that.$route.query.pk_eva_group,end_date:that.$route.query.end_date,schname:that.$route.query.schname}})		    				
		    			}
		    		})).catch(()=>{
	    					that.$message({
	    						type:'info',
	    						message:'已经取消'
	    					})
	    				})
	    				
	    			}
	    		}) 				
 			},
			handleClose(done) {
			        this.$confirm('确认关闭？')
			          .then(_ => {
			            done();
			          })
			          .catch(_ => {});
			 },		         
 			//鼠标按下
 			keypressevent(event){
 				 // /[\d]/.test(String.fromCharCode(event.keyCode))			
 			},
 			//鼠标弹起时触发
 			onleavekey(e){
 				//校验
 				var inputvalue  = this.$refs.myinput;
 				console.log(inputvalue)
 				for(var i=0;i<inputvalue.length;i++){
 					var item = inputvalue[i];
 					// if(item.value==0){
 					// 	e.target.value=''
 					// }
 					// if(item.value==''&item.value!=0){
 					// 	//兼容IE浏览器
 					// 	e.srcElement.value='';
 					// 	e.target.value='';
 					// 	this.$message("请输入数字");
 					// }
			 		if(/^\D/.test(item.value)){
			 			console.log(item.value)
			            e.target.value='';
			            this.$message('请输入整数');
			        }
 					if(String(item.value).indexOf('.',0)!=-1){
 						//兼容IE浏览器
 						e.srcElement.value='';
 						e.target.value='';
 						this.$message("请输入整数");	
 					}
 					if(String(item.value).indexOf('-',0)!=-1){
 						e.target.value=''
 						this.$message('请输入整数');
 					}
 					if(item.value<0){
 						//兼容IE浏览器
 						e.srcElement.value='';
 						e.target.value='';
 						this.$message("请输入0-100的整数");
 					}
 					if(item.value>100){
 						//兼容IE浏览器
 						e.srcElement.value='';
 						e.target.value='';
 						this.$message("请输入0-100的整数");
 					}
 				} 								
 			},
 			//总分计算
 			calculateTotal(){
 				//获取tableData中的分数
 				var arr=[];
 				var data1=this.tableData;
				for(var i =0;i<data1.length;i++){
				  var item = data1[i];
				  for(var k in item){
				  	if(k=='indis'){
				  		for(var j=0;j<item[k].length;j++){
				  		arr.push(item[k][j].score)
				  		}
				  	}
				  }
				}
				console.log(arr);
				//将arr分成二维数组				
				var num = this.options.length; //每个子数组里的元素个数
				// console.log(num)
				var Arr = new Array(Math.ceil(arr.length / num));
				for (var i = 0; i < Arr.length; i++) {
				    Arr[i] = new Array();
				    for (var j = 0; j < num; j++) {
				        Arr[i][j] = '';
				    }
				}
				for (var i = 0; i < arr.length; i++) {
				    Arr[parseInt(i / num)][i % num] = arr[i];
				}									
				// console.log(Arr)
 				//获取options中的weight权重
 				var data2=this.options;
				var Arr2 = [];
				for(var i=0;i<data2.length;i++){
					var item = data2[i];
					for( var k in item){
						if(k=='weight'){
							Arr2.push(item[k])
						}
					}
				} 
				// console.log(Arr2)	
 				//计算总分totalScore
 				var totalScore=[];
				//遍历数组arr2
				for(var i=0;i<Arr.length;i++){
					//获取arr2
					var item2=Arr[i];
					//遍历arr2内层数组item2
					var total =0;
					for(var j=0;j<item2.length;j++){
						var item3=item2[j]
						total+=item3*Arr2[j]
					}
					// console.log(total)
					total=total.toFixed(2);
					totalScore.push(total);
				}
				// console.log(totalScore);
				//遍历data1,将totalScore加入到tableData
				for(var i=0;i<data1.length;i++){
					var item = data1[i];
					for(var k in item){
						if(k=='totalScore'){
							item[k]=totalScore[i]
						}
					}
				}
 			},
 			//提交按钮
 			sendData(){
 				this.dialogVisible = true;
 			},
 			//保存按钮
 			storeData(){
 				var sendData = encodeURIComponent(JSON.stringify(this.tableData));
 				console.log(sendData);
 				var that = this;
	    		this.$http.post(this.url,Qs.stringify({
	    			'transType':'saveScore',
	    			'indiStr':sendData,
	    			'isWeightFlag':'Y'
	    		}),{
	    			headers:{
	    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	    			}
	    		}).then(function(response){
	    			if(response.data.flag==0){
	    				that.$message({
	    					message:response.data.des,
	    					type:'success'
	    				});
	    			}
	    			else if(response.data.flag==1){
						that.$message(response.data.des);
	    			} else if(response.data.flag==3){
	    				that.$confirm(response.data.des,'提示',{
	    					cancelButtonText:"取消",
	    					confirmButtonText:"确定",
	    					type:'warning'
	    				}).then(()=>{
	    					that.$http.post(that.url,Qs.stringify({
					    			'transType':'saveScore',
					    			'indiStr':sendData,
					    			'isWeightFlag':'N'
					    		}),{
					    			headers:{
					    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
					    			}
					    		}).then(function(response){
					    			if(response.data.flag==0){
					    				// console.log(response)
					    				that.$message({
					    					message:response.data.des,
					    					type:'success'
					    				})
					    				//设置tabelData中的数据的默认值
						 				var data1=that.tableData;
						 				// console.log(data1)
										for(var i =0;i<data1.length;i++){
										  var item = data1[i];
										  // console.log(item)
										  for(var k in item){
										  	var initscore = item[initscore];
										  	if(k=='indis'){
										  		// console.log(item[k])
										  		for(var j=0;j<item[k].length;j++){
										  			//获取到indis对象里的每一项
										  			var item1=item[k][j];
										  			// console.log(item1);
										  			for(var h in item1){
										  				if(h=='score'&&item1[h]==""){
										  					item1[h]=initscore;
										  				}
										  			}
										  		}
										  	}
										  }
										}
										// console.log(data1)
										window.location.reload();
					    			}
					    		})
	    				})
	    			}
	    		}) 				
 			},
 			changeEvent(){
 				var that = this;
 				var params = this.$route.query.pk_eva_group;
 				// console.log(this.$route.params.pk_eva_group)
	    		this.$http.post(this.url,Qs.stringify({
	    			'transType':'assess',
	    			'pk_eva_group':params
	    		}),{
	    			headers:{
	    				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	    			}
	    		}).then(function(response){
	    			if(response.data.flag==0){
	    				// console.log(response.data.data);
	    				that.textarea = that.value; 	
	    			}
	    		})
 			}
 		}
  }
</script> 
<style scoped>

.el-dialog{
	width: 420px;
	height: 178px;
	line-height: none;
}
.el-dialog__header{
	height: 40px;
	line-height: 40px;
}
.el-dialog__body{
	height: 40px;
	line-height: 40px;
}
.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover{
	background-color: #eef1f6;
}
.el-button--primary{
	background-color: #CC2123;
	border:1px solid #ccc;
}
.el-button--primary:hover{
	background: #E6282A;
}
.submit .tab tbody  .cell .el-input{
	width: 100px;
}
.el-table{
	border: none;
}
.el-table::after, .el-table::before{
	background-color: #fff;
}
.el-textarea{
	float: left;
	width: 1034px;
}
.el-textarea__inner{
	height: 110px;
}
.tab{
	/*width: 1160px;*/
	width: 100%;
	height: auto;
	background: #FFFFFF;
	margin-top: 20px;
}
.el-table .is-leaf .cell{
	font-family: PingFangSC-Medium;
	font-size: 16px;
	color: #333333;
	line-height: 16px;
	background: #FFFFFF;
}
.assesscriterion .content{
	float: left;
}
.submit .standard{
	/*width: 1160px;*/
	width: 100%;
	height: 201px;
	background: #FFFFFF;
	box-sizing: border-box;
	padding: 0 20px;
	overflow: hidden;
}
.assessstandard{
	margin-top: 28px;
}
.assesscriterion{
	margin-top: 20px;
	overflow: hidden;
}
.standard span{
	display: inline-block;
	height: 21px;
	line-height: 21px;
	font-family: MicrosoftYaHei;
	font-size: 16px;
	color: #333333;
}
.el-breadcrumb{
	width: 420px;
	height: 19px;
	margin: 16px 0;
	font-family: "MicrosoftYaHei";
	font-size: 14px;
	color: #333333;
	line-height: 19px;
}
.navigation{
	/*width: 1160px;*/
	width: 100%;
	height: 80px;
	background-color: #fff;
	line-height: 80px;
	box-sizing: border-box;
	padding: 0 20px;
	font-family: "MicrosoftYaHei";
	font-size: 16px;
	color: #333333;
	margin-bottom: 16px;
}
.navigation .performance_two{
	margin-left: 40px;
	margin-right: 40%;
}
</style>