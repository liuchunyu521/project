<template>
	<el-dialog title="转档确认" :visible.sync="intoDocDialogVisible" size="tiny" :show-close="false">
		<div class="into-doc-font" style="margin-bottom: 16px; margin-top: 16px;">
			是否把所选择的人员转入人员档案?
		</div>

		<!--<el-checkbox v-model="syncWork" style="margin-bottom: 16px;" size="large">-->
			<!--<span class="into-doc-font">同步履历 </span>-->
		<!--</el-checkbox>-->

		<div slot="footer" class="dialog-footer">
			<el-button @click="rosterCancel">取 消</el-button>
			<el-button type="primary" @click="rosterSave">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	props: {
		dialogData: [Object, Array],
	},

	data() {
		return {
			// 接口前缀
			requestPrefix: '/hrhi/register',
			// 所有当前页面请求路径
			requestUrl: {
				intoDoc: '/intoDoc',
			},

			//导出框是否显示
			intoDocDialogVisible: false,
			//是否同步履历
			syncWork: true,
		}
	},

	methods: {
		rosterSave: function () {
			let intoDocData = {
				psndocs: this.dialogData,
				syncWork: this.syncWork,
			};
			this.doIntoDoc(intoDocData);
		},

		rosterCancel: function () {
			this.setDialogVisible(false);
		},

		// 转档处理
		doIntoDoc(intoDocData) {
			this.$http({
				url: this.requestPrefix + this.requestUrl.intoDoc,
				method: "post",
				data: JSON.parse(JSON.stringify(intoDocData)),
			}).then(res => {
				this.setDialogVisible(false);
				if (res.data.status === true) {
					this.$message({ message: res.data.msg, type: "success" });
					this.afterIntoDoc();
				} else {
					this.$message({ message: res.data.msg, type: "error" });
				}
			}).catch((res) => {
				this.$message({ message: "请求失败" + res, type: "error" });
			});
		},

		// 设置dialog是否可见
		setDialogVisible: function (val) {
			this.intoDocDialogVisible = val;
		},

		// 提示父节点
		afterIntoDoc: function () {
			this.$nextTick(function () {
				this.$emit('after_into_doc');
			});
		},
	}
}
</script>

<style scoped>
.into-doc-font {
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  line-height: 14px;
}
</style>
