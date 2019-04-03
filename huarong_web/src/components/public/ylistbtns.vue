<!--
	作者：yugl
	时间：2017-09-06 
	支持：列表状态操作按钮组件
-->
<template>  
	<div v-if=" status == statusArry[1] ">
		<el-button size="small" type="text">{{statusMsg[1]}}</el-button>
		<el-button size="small" @click="submit">提交</el-button>
  		<el-button size="small" @click="revert">还原</el-button> 
	</div>
	<div v-else-if=" status == statusArry[2] ">
		<el-button size="small" type="text">{{statusMsg[2]}}</el-button>
		<el-button size="small" @click="callback">收回</el-button> 
	</div> 
	<div v-else-if=" status == statusArry[4] ">
		<el-button size="small" type="text">{{statusMsg[4]}}</el-button> 
  		<el-button size="small" @click="noUpdate">还原</el-button> 
  		<el-button class="y-btn-default" size="small" @click="goonUpdate">继续修改</el-button>
	</div>
</template>

<script>
	export default { 
		props: ['status'], 
		data(){
			return {
				statusArry: ['-1', '0', '1', '2', '3'],
				statusMsg: ['', '待提交', '待审核', '审核通过', '审核不通过'] 
			}
		},
		methods: {  
			submit(){
				this.$emit('handle', ['commit']);
			},
			revert(){
				this.$emit('handle', ['revert']);
			},
			noUpdate(){
				this.$emit('handle', ['noUpdate']);
			},
			// 审核不通过-继续修改
			goonUpdate() {
				this.$emit('handle', ['goonUpdate']);
				this.$emit('edit');
			},
			callback(){
				this.$emit('handle', ['callback']);
			}
		}
	};
</script>

<style>
</style>