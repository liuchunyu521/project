<template>
	<div class="y-maincontent">
		<div class="y-breadcrumb-box">
			<el-breadcrumb separator="/"> 
			  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
			  <el-breadcrumb-item>人事管理</el-breadcrumb-item> 
			  <el-breadcrumb-item>员工信息</el-breadcrumb-item>
			</el-breadcrumb>
		</div>	 
		<div class="y-inner">
			<div class="y-maintitle">
				员工信息
			</div>
			<el-form :inline="true" :model="searchform" class="demo-form-inline y-search-form">
				<el-form-item label="员工工号">
					<el-input v-model="searchform.userno" placeholder="请输入"></el-input>
				</el-form-item> 
				<el-form-item label="员工部门">
					<el-input v-model="searchform.bumen" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="员工姓名">
					<el-input v-model="searchform.username" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>	
			<el-table class="y-table" :data="tableData" style="width: 100%">
				<el-table-column prop="date" label="人员工号"></el-table-column>
				<el-table-column prop="name" label="人员姓名"></el-table-column>
				<el-table-column prop="address" label="性别"></el-table-column>
				<el-table-column prop="date" label="所属部门"></el-table-column>
				<el-table-column prop="name" label="当前职务"></el-table-column>
				<el-table-column prop="address" label="入职日期"></el-table-column>
				<el-table-column prop="name" label="联系电话"></el-table-column>
				<el-table-column prop="address" label="邮箱"></el-table-column>
				<el-table-column label="操作" width="100">
					<template scope="scope">
						<router-link :to='"/Employeeinfo/"+scope.row.id'>详情</router-link>  
					</template>
				</el-table-column>
			</el-table>
		</div> 
	</div>
</template>
<script>   
export default {
	data() {
		return {   
			searchform: {
				userno: '',
				bumen: '',
				username: ''
			},
			tableData: [{
				id: '001',
				date: '2016-05-02',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1518 弄'
			}, {
				id: '002',
				date: '2016-05-04',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1517 弄'
			}, {
				id: '003',
				date: '2016-05-01',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1519 弄'
			}, {
				id: '004',
				date: '2016-05-03',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1516 弄'
			}] 
		}
	},
	components: { 
	}, 
	methods: {  
		onSubmit(){

		}
	}
}
</script> 