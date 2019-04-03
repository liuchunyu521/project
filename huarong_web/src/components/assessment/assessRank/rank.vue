<template>
	
	<div class="rank">
		<!-- breadcrumb begin-->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/Index' }">考核测试</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessRank' }">领导评级</el-breadcrumb-item>
		  <el-breadcrumb-item>2017年业绩考核评级</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- breadcrumb end -->
		<!-- navigation begin -->
		<div class="navigation">
			<span class="performance_one">考核方案：{{this.schname}}</span>
			<span class="performance_two">部门：信息科技部</span>
			<!-- MessageBox -->
			<!-- <el-button type="text" @click="open">评级说明附件</el-button> -->
			<!-- MessageBox -->			
			<el-button type="primary" id='rankconstruction' @click="comment"><i id="rankicon"></i>评级说明</el-button>
			<el-button type="primary" id='storedatabutton' @click='storeData'>保存</el-button>
			<el-button type="primary" @click='submit'>提交</el-button>
		</div>
		<!-- dialog start-->
		<el-dialog title="评级说明" :visible.sync="dialogTableVisible">
		  <el-table :data="gridData" stripe>
		    <el-table-column text-align='left' property="dept_name" label="部门"></el-table-column>
		    <el-table-column property="dept_number" label="评A数量"></el-table-column>
		  </el-table>
		</el-dialog>
		<!-- dialog end -->
		<!-- navigation end -->
		<!-- tab begin -->
		<div class="tab">
			<el-table
		      :data="tableData"
		      style="width: 100%">
		      <el-table-column
				type='index'
		        label="序号">
		      </el-table-column>
		      <el-table-column
		        prop="staff"
		        label="员工号">
		      </el-table-column>
		      <el-table-column
		        prop="name"
		        label="被考核人">
		      </el-table-column>
		      <el-table-column
		        prop="checkscore"
		        label="总分">
		      </el-table-column>
		      <el-table-column
		        prop="rate"
		        label="领导评级">
		        <template scope='scope'>
		        	<el-select v-model="tableData[scope.$index].rate" placeholder="请选择" @change='getValue'>
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
		        </template> 
		      </el-table-column>
		    </el-table>
		</div>
		<!-- tab end -->
	</div>
</template>
<script> 
import Qs from 'qs';
 export default {
 		name:"rank",
 		data(){
 			return {
 				schname:"",
 				//评级附件数据
 				 gridData: [],
		        dialogTableVisible: false,
		        //评级数据
 				options: [{
		          value: 'A',
		          label: 'A'
		        }, {
		          value: 'B',
		          label: 'B'
		        }, {
		          value: 'C',
		          label: 'C'
		        }, {
		          value: 'D',
		          label: 'D'
		        }],
		        value: '',
 				tableData: [],
 				originResponseData:[]
 			}
 		},
 		computed:{
 			url(){
 				return this.$store.state.Interface.grade;
 			}
 		},
 		mounted(){
 			var that = this;
 			var pkHead = this.$route.query.pk_head;
 			this.schname = this.$route.query.schname;
 			this.$http.post(this.url,Qs.stringify({
 				'transType':'grade',
 				'pk_head': pkHead			
 			}),{
 				headers:{
 					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
 				}
 			}).then(function(response){
 				if(response.data.flag==0){
 					var _data = JSON.parse(response.data.data);
 					console.log(_data);		
 					that.originResponseData = JSON.parse(response.data.data);
 					//response返回数据格式
 				// 	[ {
					//   "staff": "1212111", "name":"考核测试", "checkscore":"", "pk_body":"1001ZZ1000000000HD3M"
					// }
					// ,
					// {
					//   "staff": "3869", "name":"张乾坤", "checkscore":"", "pk_body":"1001ZZ1000000000HD3N"
					// }]
					//遍历response 将hiddenSth属性加入到response
					// for(var i=0;i<_data.length;i++){
					// 	var item = _data[i];
					// 	item.rate='';
					// }
					that.tableData=_data;
					console.log(_data);
 				}
 			})
 		},
 		methods: {
 			comment(){
 				// alert('ni')
 				var schemepk=this.$route.query.schemepk;
 				this.dialogTableVisible=true;
 				var that = this;
 				this.$http.post(this.url,Qs.stringify({
 					'transType':'aNum',
 					'pk_head':schemepk
 				}),{
 					headers:{
 						'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
 					}
 				}).then(function(response){
 					if(response.data.flag==0){
 						var _data = response.data.data;
 						that.gridData = JSON.parse(_data);
 					}
 				})
 			},
 			getValue(){
 				console.log(this.tableData)
 			},
 			storeData(){
 				// var pkHead = this.$route.query.pk_head;
 				var that = this;
 				console.log(JSON.stringify(this.tableData))
 				var bodyStr=encodeURIComponent(JSON.stringify(this.tableData));
 				console.log(bodyStr)
 				this.$http.post(this.url,Qs.stringify({
 					'transType':'saveGrade',
 					'bodyStr': bodyStr
 				}),{
 					headers:{
 						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
 					}
 				}).then(function(response){
 					if(response.data.flag==0){
 						that.$message({
 							message:response.data.des,
 							type:'success'
 						})
 					}else {
 						that.$message({
 							message:'there is no data from backedge',
 							type:'info'
 						})
 					}
 				})
 			},
 			submit(){
 				var pkHead = this.$route.query.pk_head;
 				var bodyStr=encodeURIComponent(JSON.stringify(this.tableData));
 				var that = this;
 				console.log(bodyStr)
 				this.$http.post(this.url,Qs.stringify({
 					'transType':'commitGrade',
 					'pk_head': pkHead,
 					'bodyStr':bodyStr
 				}),{
 					headers:{
 						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
 					}
 				}).then(function(response){
 					if(response.data.flag==0){
 						that.$message({
 							message:response.data.des,
 							type:'success'
 						})
 						
	    				that.pk_head=that.$route.query.pk_head;
		 				that.schname=that.$route.query.schname;
	    				that.$router.push({path:'/assessRank/check',
	    					query:{pk_head:that.$route.query.pk_head,schname:that.$route.query.schname}}) 						
 					}else{
 						that.$message({
 							message:'there is no data from backedge'
 						})
 					}
 				})
 			},
	     	open() {
	        this.$alert('这是一段内容', '标题名称', {
	          confirmButtonText: '确定',
	          callback: action => {
	            this.$message({
	              type: 'info',
	              message: `action: ${ action }`
	            });
	          }
	        });
	      }
    	}
  }
</script> 
<style scoped>

.el-dialog .el-table__header-wrapper{
	text-align: left;
}
.navigation #storedatabutton{
	/*margin-left: 350px;*/
	margin-left: 20%;
}
.navigation #rankconstruction{
	width: 120px;
	background-color: #fff;
	border:1px solid #CC2123;
	color: #CC2123;
	
}
.navigation #rankconstruction:hover{
	width: 120px;
	background-color: #CC2123;
	border:1px solid #CC2123;
	color: #fff;
}
.navigation #rankicon{
	display: inline-block;
	width: 15px;
	height: 15px;
	vertical-align: bottom;
	margin-right: 5px;
	outline: none;
	background: url(../../../assets/img/Shape.png);
}
.navigation #rankconstruction:hover #rankicon{
	background:url(../../../assets/img/ShapeCopy.png);
}
.el-button--text{
	color: #CC2123;
}
.el-button--text:hover{
	color: #E6282A;
}
.el-table::after, .el-table::before{
	background-color: #fff;
}
.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover{
	background-color: #eef1f6;
}
.el-button--primary{
	background-color: #CC2123;
	border:1px solid #ccc;
}
.el-button{
	width: 80px;
	height: 36px;
	margin-left: 12px;
}
.el-button--text{
	margin-right: 320px;
}
.tab .el-table{
	border:none;
}
.el-table::after, .el-table::before{
	height: 0;
	background-color: #fff;
}
.tab{
	/*width: 1160px;*/
	width: 100%;
	height: auto;
	background: #FFFFFF;
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
.rank{
	width: 100%;
}
.rank .standard{
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
.standard span{
	display: inline-block;
	height: 21px;
	line-height: 21px;
	font-family: MicrosoftYaHei;
	font-size: 16px;
	color: #333333;
}
.el-button--primary:hover{
	background: #E6282A;
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
	margin-right: 40px;
}
</style>