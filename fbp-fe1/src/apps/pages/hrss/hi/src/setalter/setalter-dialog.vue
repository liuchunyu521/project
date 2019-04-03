<!--
  作者：yangchd
  时间：2018-05-16
  支持：员工信息审核——审批意见框
-->
<template>
	<el-dialog title="审批意见" :visible.sync="dialogFormVisible" size="tiny" :show-close="false">
		<el-form :model="setalterDialogForm" label-width="120px">
			<el-input type="textarea" v-model="setalterDialogForm.checkNote" maxlength="500" placeholder="请输入审批意见" :rows="setalterDialogForm.max_row"></el-input>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="setalterConfirm">确 定</el-button>
			<el-button @click="setalterCancel">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			data: Array,
			status: Boolean,
      funcode: {
        type: String,
        required: true
      },
      requestPrefix: {
        type: String,
        required: true
      },
		},
		data() {
			return {

			  requestUrl:{
          audit:'/audit',
        },

				// dialog显示标志位
				dialogFormVisible: false,

				setalterDialogForm: {
					checkNote: '',
          max_row:5,
				}
			}
		},

		methods: {
			// 审核确认按钮的触发动作
			setalterConfirm: function() {
				let checkNote = this.setalterDialogForm.checkNote;
				this.visibleChange(false);
        // 清空审批意见
        this.clearCheckNote();
				this.doAudit(this.status, checkNote);
			},

			// 审核取消按钮的触发动作
			setalterCancel: function() {
				this.visibleChange(false);
        // 清空审批意见
        this.clearCheckNote();
			},

			// 审核处理
			doAudit(pass, checkNote) {
				let selectedPKs = [];
				let selected = this.data;
				for(let i = 0; i < selected.length; i++) {
					if(1 === selected[i].data_status) {
						selectedPKs.push(selected[i].pk_hrss_setalter)
					}
				}
				if(!selectedPKs || selectedPKs.length < 1){
          this.$message({message: "未找到可以审核的数据！", type: "error"});
          return;
        }
				let auditData = {
					pass: pass,
					pk: selectedPKs.join(','),
					checkNote: checkNote,
				};

				this.$http({
					url: this.requestPrefix + this.requestUrl.audit,
					method: "post",
					params: auditData,
				}).then(res => {
					if(res.data.status === true) {
            this.$message({message: res.data.msg, type: "success"});
            this.$nextTick(function () {
              this.emitRefresh();
            });
					} else {
						this.$message({message: res.data.msg, type: "error"});
					}
				}).catch((res) => {
					this.$message({message: "请求失败" + res, type: "error"});
				});
			},

      // 审批通过触发刷新
      emitRefresh:function () {
        this.$emit('listRefresh')
      },

      // 清空审批意见
      clearCheckNote:function () {
        this.setalterDialogForm.checkNote = '';
      },

      // dialog显示标志位
			visibleChange: function(val) {
				this.dialogFormVisible = val;
			},
		}
	}
</script>