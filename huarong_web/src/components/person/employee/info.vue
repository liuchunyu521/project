<template>
	<div>
		<div class="y-breadcrumb-box">
			<el-breadcrumb separator="/"> 
			  <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
			  <el-breadcrumb-item>人事管理</el-breadcrumb-item> 
			  <el-breadcrumb-item>我的信息{{id}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="y-row-box">
			<div class="y-inner">  
				<!-- 基本信息 begin -->
				<baseInfo :listdata="initdata" :editabled="false"></baseInfo> 
				<!-- 基本信息 end -->
				<!-- 工作履历 begin -->
				<subList 
					title='<i class="iconfont icon-gongzuo y-text-gognzuo"></i>工作履历'
					:editabled="false"  
					:listdata="jobListData"  
					:theaddata='jobTheadData'></subList> 
				<!-- 工作履历 end -->
			</div>
		</div>
	</div>
</template>
<script>    
import baseInfo from '@/components/person/myinfo/components/base';
import subList from '@/components/person/myinfo/components/sublist';
export default {
	data() {
		return { 
			initdata: [{
				id: 'name',
				text: '姓名',
				val: '张三',
				edit: false
			},{
				id: 'sex',
				text: '性别',
				val: '男',
				edit: false
			},{
				id: 'date',
				text: '出生日期',
				val: '1990-6-18',
				edit: false
			},{
				id: 'mail',
				text: '电子邮箱',
				val: 'zhangsan@yonyou.com',
				edit: true
			},{
				id: 'phone',
				text: '手机',
				val: '187xxxxxxxx',
				edit: true
			}],
			jobListData: [{
				date: '2016-05-02',
				danwei: '单位1',
				zhiwu: '经理1',
				zhize: 'aa'
			}],
			jobTheadData: [{
				param: 'date',
				text: '起止时间',
				required: true
			},{
				param: 'danwei',
				text: '工作单位',
				required: true
			},{
				param: 'zhiwu',
				text: '担任职务' 
			},{
				param: 'zhize',
				text: '主要职责' 
			}],
		}
	},
	mounted(){  
	},
	computed: {
		id(){
			return this.$route.params.id;
		}
	},
	components: { 
		baseInfo,
		subList
	}, 
	methods: {  
	}
}
</script> 