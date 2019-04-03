<!--
	作者：yugl
	时间：2017-09-06 
	支持：表单状态操作按钮组件 
-->
<template>
	<div v-if=" status== statusArry[0] ">
		<el-button type="text">{{statusMsg[0]}}</el-button>
		<el-button class="y-btn-danger" type="danger" size="small" @click="save">保存</el-button>
		<el-button class="y-btn-default" size="small" @click="cancel">取消</el-button>
	</div>
	<div v-else-if=" status== statusArry[1] ">
		<el-button type="text">{{statusMsg[1]}}</el-button>
		<el-button size="small" v-show="!showSave" @click="submit">提交</el-button>
		<el-button size="small" v-show="!showSave" @click="revert">还原</el-button>
		<el-button class="y-btn-default" v-show="!showSave" size="small" @click="Edit">继续修改</el-button>
		<el-button class="y-btn-danger" v-show="showSave" type="danger" size="small" @click="save">保存</el-button>
		<el-button class="y-btn-default" v-show="showSave" size="small" @click="cancel">取消</el-button>
	</div>
	<div v-else-if=" status== statusArry[2] ">
		<el-button type="text">{{statusMsg[2]}}</el-button>
		<el-button size="small" @click="callback">收回</el-button>
	</div>
	<div v-else-if=" status== statusArry[3] ">
		<el-button type="text">{{statusMsg[3]}}</el-button>
		<el-button class="y-btn-danger" type="danger" size="small" @click="save">保存</el-button>
		<el-button size="small" @click="cancel">取消</el-button>
	</div>
	<div v-else-if=" status== statusArry[4] ">
		<el-button type="text">{{statusMsg[4]}}</el-button>
		<el-button size="small" v-show="!showSave" @click="noUpdate">还原</el-button>
		<el-button class="y-btn-default" v-show="!showSave" size="small" @click="goonUpdate">继续修改</el-button>
		<el-button class="y-btn-danger" v-show="showSave" type="danger" size="small" @click="save">保存</el-button>
		<el-button class="y-btn-default" v-show="showSave" size="small" @click="cancel">取消</el-button>
	</div>
</template>

<script>
	export default {
		props: ['status'],
		data() {
			return {
				showSave: false,
				statusArry: ['-1', '0', '1', '2', '3'],
				statusMsg: ['', '待提交', '待审核', '审核通过', '审核不通过']
			}
		},
		methods: {

			// 未提交-继续修改
			Edit() {
				this.showSave = true;
				this.$emit('edit');
			},

			// 审核不通过-继续修改
			goonUpdate() {
				this.$emit('handle', ['goonUpdate']);
				this.showSave = true;
				this.$emit('edit');
			},

			save() {
				this.showSave = false;
				this.$emit('save');
			},

			cancel() {
				this.showSave = false;
				this.$emit('cancel');
			},

			submit() {
				this.$emit('handle', ['commit']);
			},

			revert() {
				this.$emit('handle', ['revert']);
			},

			noUpdate() {
				this.$emit('handle', ['noUpdate']);
			},

			callback() {
				this.$emit('handle', ['callback']);
			}

		}
	};
</script>

<style>

</style>