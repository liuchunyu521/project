<template>
	<el-dialog title="附件" :visible.sync="dialogVisible" size="tiny" :show-close="false">
    <ifbp-upload
            busi-code="myInfo"
            force-type = 'normal'
            :disableUpdate="attachmentDisable"
            :disableUpload="attachmentDisable"
            :disableDelete="attachmentDisable"
            :pk-busi="pk_attachment">
    </ifbp-upload>
		<div slot="footer" class="dialog-footer">
			<el-button @click="closeDialog">关 闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props: {
		  pk_attachment:{
		    type:String,
        required:true,
      }
		},
		
		data() {
			return {
				// 是否显示
        dialogVisible: false,
        // 这里的附件只能看，不能改
        attachmentDisable:true,
			}
		},
		
		methods: {
      closeDialog:function () {
        this.setDialogVisible(false);
      },
			// 设置dialog是否可见
			setDialogVisible: function(val) {
				this.dialogVisible = val;
			},
		}
	}
</script>
