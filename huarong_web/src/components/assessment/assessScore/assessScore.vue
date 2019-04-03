<template>
	<div class="assessScore">
		<!-- breadcrumb begin-->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessScore'}">考核测试</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/assessScore'}">评测打分</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- breadcrumb end -->
		<!-- nav begin -->
		<div class="nav">
			<span class="performance">绩效方案：</span>
			<el-select v-model="value1" placeholder="请输入查询条件"  @visible-change='changeEvent_one'>
			    <el-option
			      v-for="item in options1"
			      :key="item.pk_sch_eva"
			      :label="item.name"
			      :value="item.pk_sch_eva"
			    ></el-option>
			</el-select>
			<span class="performance">考核期间：</span>
			<el-select v-model="value2" placeholder="请输入查询条件" @visible-change='changeEvent_two' 		      >
			    <el-option
			      v-for="item in options2"
			      :key="item.pk_sch_eva"
			      :label="item.pername"
			      :value="item.pk_sch_eva"
			      ></el-option>
			</el-select>
			<span class="performance">考核状态：</span>
			<el-select v-model="value3" placeholder="请输入查询条件"  @visible-change='changeEvent_three'>
			    <el-option
			      v-for="item in options3"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value"
			      ></el-option>
			</el-select>
			<el-button type="danger" size='small' @click.native='findData'>查询</el-button>
			<el-button type="primary" size='small' plain  @click.native='clearData'>清空</el-button>
		</div>
		<!-- nav end -->
		<!-- tab begin -->
		<div class="tab">
		  <el-table
		    :data="tableData"
		    header-align:center
		    style="width: 100%">
		    <el-table-column
		      prop="schname"
		      label="绩效方案"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="periodname"
		      label="考核期间"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="groupname"
		      label="考核对象组"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="groupStatus"
		      label="考核状态"
		    >
		    </el-table-column>	
		    <el-table-column
		      label="操作"
		    >
		      <template scope="scope">
		      	<!-- :to="{path:'assessScore/lookup',query:{pk_eva_group:scope.row.pk_eva_group,end_date:scope.row.end_date,schnaem:scope.row.schname}}" -->
		        <router-link :to="{path:'assessScore/lookup',query:{pk_eva_group:scope.row.pk_eva_group,end_date:scope.row.end_date,schname:scope.row.schname}}" v-show="scope.row.groupStatus=='已考核'"  type="text" size="small">查看</router-link>
<!-- 		        <router-link :to='"/assessScore/lookup/"+scope.row.pk_eva_group' v-show="scope.row.groupStatus=='已考核'"  type="text" size="small">查看</router-link> -->
		        <router-link :to="{path:'assessScore/submit',query:{pk_eva_group:scope.row.pk_eva_group,end_date:scope.row.end_date,schname:scope.row.schname}}" v-show="scope.row.groupStatus!='已考核'"  type="text" size="small">评分</router-link>
		      </template>
		    </el-table-column>
		  </el-table>  
		</div>
		<!-- tab end -->
	</div>

</template>

<script> 
import axios from 'axios';
import Qs from 'qs';
 export default {
    data() {
      return {
      	id:"",
        options1: [],
        value1:"",
        options2: [],
        value2:"",
        options3: [{
          value: '1',
          label: '未考核'
        }, {
          value: '2',
          label: '考核中'
        }, {
          value: '3',
          label: '已考核'
        }],
        value3:"",
	  	tableData: []
	   }
	},
	computed:{
		url(){
			return this.$store.state.Interface.as;
		}
	},        
    mounted(){
    	var that = this;
    	this.$http.post(this.url,Qs.stringify ({
	    		'transType':'assessList',
	    		'queryBs':'load'
    	}), {
          	headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
          	}
  		}).then(function(response){
    		if(response.data.flag==0){
    			// console.log(response.data.data);
    			var _data = JSON.parse(response.data.data);
	    		for(var i=0;i<_data.length;i++){
	    			var item = _data[i];
	    			for(var k in item ){
	    				if(k=='groupStatus'&item[k]==1){
	    					item[k]='未考核'
	    				}else if(k=='groupStatus'& item[k]==2){
	    					item[k]='考核中'
	    				}else if(k=='groupStatus'& item[k]==3){
	    					item[k]='已考核'
	    				}
	    			}
	    		}    			
				that.tableData = _data;  		
    		}
    	}).catch(function(response){
    		// console.log(response.data);
    	})    	
    },
    methods:{
    	//清空按钮
    	clearData(){
    		this.value1='';
    		this.value2='';
    		this.value3='';
    	},
    	//查询按钮
    	findData(){
    		// alert("this is require button");
    		var pkvalue1 = this.value1;
    		var pkvalue2 = this.value2;
    		var pkvalue3 = this.value3;
    		var that = this ;
    		this.$http.post(this.url,Qs.stringify({
    			'transType':'assessList',
    			'pk_sch_eva':pkvalue1,
    			'pk_period':pkvalue2,
    			'groupStatus':pkvalue3
    		}),{
    			headers:{
    				'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
    			}
    		}).then(function(response){
    			if(response.data.flag==0){
    				// console.log(response.data);
    			var _data = JSON.parse(response.data.data);
    			// console.log(_data)
	    		for(var i=0;i<_data.length;i++){
	    			var item = _data[i];
	    			for(var k in item ){
	    				if(k=='groupStatus'&item[k]==1){
	    					item[k]='未考核'
	    				}else if(k=='groupStatus'& item[k]==2){
	    					item[k]='考核中'
	    				}else if(k=='groupStatus'& item[k]==3){
	    					item[k]='已考核'
	    				}
	    			}
	    		}    				
    				that.tableData = _data;
    			}
    		}).catch(function(response){
    				// that.tableData = JSON.parse(response.data.data);
    		})
    	},
    	changeEvent_one(){
    		// alert("nihao");
    		this.value2='';
    		this.value3='';    		
    		var that = this;
    		this.$http.post(this.url,Qs.stringify({
    			'transType':'schEvaRef'
    		}),{
    			headers:{
    				'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
    			}
    		}).then(function(response){
    			if(response.data.flag==0){
    				// console.log(response.data);
    				that.options1 = JSON.parse(response.data.data);
    			}
    		})
    	},
    	changeEvent_two(){
    		// alert("this is second");
    		var pkvalue1 = this.value1;
    		var that = this;
    		this.$http.post(this.url,Qs.stringify({
    			'transType':'period',
    			'pk_sch_eva': pkvalue1
    		}),{
    			headers:{
    				'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
    			}
    		}).then(function(response){
    			if(response.data.flag==0){
    				// console.log(response.data);
    				that.options2 = JSON.parse(response.data.data);
    			}
    		})
    	},
    	changeEvent_three(){
    		// alert("this is third");
    	}

    }
  }
</script> 
<style scoped>
.el-table::after, .el-table::before{
	height: 0;
	background-color: #fff;
}
.el-table .cell:nth-child(odd){
	color:red;
}
.tab{
	/*width: 1160px;*/
	width: 100%;
}
.el-breadcrumb {
    line-height: 19px;
    width: 200px;
    height: 19px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
	color: #333333;
	margin: 16px 0;
}
.el-button--primary.is-plain{
	background-color:gray;
	width: 70px;
	color: white;
}
.el-button--primary:hover{
	border:none;
	background-color: #928a8a;
}
.el-button--danger{
	background-color: #CC2123;
	width: 70px;
}
.el-button--danger:hover{
	background: #E6282A;
}
.nav{
	/*width: 1160px;*/
	width: 100%;
	height: 80px;
	line-height: 80px;
	background-color: white;
	padding: 0 20px;
	box-sizing: border-box;
	margin-bottom: 20px;	
}
.nav .performance{
	display: inline-block;
	width: 80px;
	height: 21px;
	font-family: MicrosoftYaHei;
	color: #333333 ;
	line-height: 21px;
	font-size: 16px;
}
.el-select{
	width: 200px;
	height: 36px;
	line-height: 36px;
	background: #FFFFFF;
	border-radius: 4px;
}
.el-button--danger[data-v-916b269c], .el-button--primary.is-plain[data-v-916b269c]{
	width: 79px;
	margin-left: 20px;
	height: 36px;
	background: #CC2123;
	border-radius: 4px;
}
.el-button--primary.is-plain[data-v-916b269c]{
	background: #999999;
}
.el-button--danger[data-v-916b269c] .el-button--small{
	display: inline-block;
	width: 32px;
	height: 22px;
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #FFFFFF;
	line-height: 22px;
}
.el-table{
	text-align: center;
}
.el-table th{
	text-align: center !important;
	font-size: 12px;
	font-weight: normal;
}
.el-table th>.cell{
	text-align: -webkit-center;
}
</style>