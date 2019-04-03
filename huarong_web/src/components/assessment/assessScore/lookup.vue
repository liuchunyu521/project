<template>
	
	<div class="lookup">
		<!-- breadcrumb begin-->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessScore'}">考核测试</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessScore'}">评测打分</el-breadcrumb-item>
		  <el-breadcrumb-item>2017年年度评测打分</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- breadcrumb end -->
		<!-- nav begin -->
		<div class="nav">
			<span class="performance_one">考核方案：{{this.schname}}</span>
			<span class="performance_two">考核截止时间：{{this.end_date}}</span>
		</div>
		<!-- nav end -->
		<!-- standard begin -->
		<div class="standard">
			<div class="assessstandard">
				<span>评分指标：</span>
				<el-select v-model="value"  placeholder='' @visible-change='getData'>
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
				  :rows="2"
				  resize='none'
				  placeholder="请输入内容"
				  v-model="textarea">
				</el-input>
			</div>
		</div>
		<!-- standard end -->
		<!-- tab begin -->
		<div class="tab" >
			<el-table
		      :data="tableData"
		      style="width: 100%">
		      <el-table-column
		        prop="clerkcode"
		        label="员工号"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="name"
		        label="姓名"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        style='text-algin:center'
		        v-for='(item,index) in options'
		        :prop='item.score'
		        :label='item.indiname'>
		        <template scope='scope'>
		        	<el-input
		        	readonly
		        	class='inputcontent'
		        	v-model.number='scope.row.indis[index].score'
		        	></el-input>
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
 		data(){
 			return {
 				textarea: '',
 				tableData: [],
 				value:"",
 				options:[],
 				schname:"",
 				end_date:"",
 				option:[]
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
 				var param = this.$route.query;
 				// console.log(param);
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
	    					that.textarea += _data[i].standard;
	    					var item = _data[i];
	    					var object = {};
	    					for(var k in item){	    						
	    						object[k]=item[k];	    						
	    					}
	    					// console.log(object);
	    					// object.weight = object.weight*100;
	    					// console.log(object.weight)
	    					object.indiname = object.indiname +'(' +(object.weight*100)+'%'+')';
	    					console.log(object)
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
	    				// console.log(response.data);
	    				// that.tableData=JSON.parse(_data);
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
	    				// 将needArr放到tableData中
	    				// 遍历data中的数据
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
	    				// console.log(data);
	    				that.tableData = data;	  
	    			}
	    		})
 		},
 		methods:{
 			getData(){
 				this.textarea = this.value;
 			}
 		}
  }
</script> 
<style scoped>
.tab .el-input__inner{
	border: none;
}
.assesscriterion{
	margin-top: 20px;
}
.lookup .assesscriterion .content{
	display: block;
	float: left;
}
 .el-textarea .el-textarea__inner{
	height: 110px;
}
.lookup .assesscriterion .el-textarea{
	display: block;
	margin-top: 1px;
	float: left;
	width: 1034px;
	resize: none;
}
.tab{
	margin-top: 20px;
	/*width: 1160px;*/
	width: 100%;
	height: auto;
	background: #FFFFFF;
}
.el-table{
	border: none;
}
.el-table::after, .el-table::before{
	background-color: #fff;
}
.el-table .is-leaf .cell{
	font-family: PingFangSC-Medium;
	font-size: 16px;
	color: #333333;
	line-height: 16px;
	background: #FFFFFF;
}
.assesscriterion .detail{
	width: 1034px;
	height: 110px;
	margin-top: 12px;
	vertical-align: top;
	background: #FFFFFF;
	border: 1px solid #CCCCCC;
	border-radius: 4px;
	box-sizing: border-box;
	padding: 10px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #333333;
	resize: none;
	line-height: 21px;
	overflow: hidden;
}
.lookup .standard{
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
.assesstandard .el-element{
	margin-top: 12px;
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
.nav{
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
.nav .performance_two{
	margin-left: 40px;
	margin-right: 500px;
}

</style>