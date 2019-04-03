<template>
	
	<div class="check">
		<!-- breadcrumb begin-->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/Index' }">考核测试</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessRank' }">领导评级</el-breadcrumb-item>
		  <el-breadcrumb-item>2017年业绩考核评级</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- breadcrumb end -->
		<!-- nav begin -->
		<div class="nav">
			<span class="performance_one">考核方案：{{this.schname}}</span>
			<!-- <span class="performance_two">部门：信息科技部</span> -->
		</div>
		<!-- nav end -->
		<!-- tab begin -->
		<div class="tab">
			<el-table
		      :data="tableData"
		      style="width: 100%">
		      <el-table-column
				label="序号"
				min-width='60'
		        type='index'>
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
		      </el-table-column>
		    </el-table>
		</div>
		<!-- tab end -->
	</div>
</template>

<script> 
import Qs from 'qs';
 export default {
 		name:"check",
 		data(){
 			return {
 				schname:"",
 				options: [{
		          value: '选项1',
		          label: 'A'
		        }, {
		          value: '选项2',
		          label: 'B'
		        }, {
		          value: '选项3',
		          label: 'C'
		        }, {
		          value: '选项4',
		          label: 'D'
		        }],
		        value: '',
 				tableData: []
 			}
 		},
 		computed:{
 			url(){
 				return this.$store.state.Interface.grade;
 			}
 		},
 		mounted(){
 				var that = this;
 				this.schname = this.$route.query.schname;
 				var pkHead = this.$route.query.pk_head;
 				// console.log(this.$route.params.pk_eva_group)
	    		this.$http.post(this.url,Qs.stringify({
	    			'transType':'grade',
	    			'pk_head': pkHead
	    		}),{
	    			headers:{
	    				'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
	    			}
	    		}).then(function(response){
	    			if(response.data.flag==0){
	    				// console.log(response.data);
	    				var _data = JSON.parse(response.data.data);
	    				// that.value=_data[0].indiname;
	    				console.log(_data);	
	    				that.tableData = _data;	
	    					
	    			}
	    		});
 		}, 		
 		methods: {
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

.el-button+.el-button{
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
.check .standard{
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
	margin-right: 40px;
}

</style>