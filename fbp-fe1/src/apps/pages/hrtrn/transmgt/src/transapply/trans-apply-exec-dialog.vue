<!--
  作者：yangchd
  时间：2018-10-15
  支持：员工调动-执行dialog
-->
<template>
  <el-dialog title="生效日期" v-model="dialogVisible" :show-close="false" size="tiny">
    <div>
      <el-date-picker
              style="max-width: 250px;margin:0 auto;"
              v-model="effectDate"
              type="date"
              placeholder="选择生效日期"
              :show-icon="true">
      </el-date-picker>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import pageModelMixin from "ifbp-business/pageModelMixin";
  export default {
    mixins: [pageModelMixin],
    props: {
      pk_hi_stapply: {
        type: String,
        required: true,
      },
      pk_org: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        // 功能编码
        funcode: 'funcode=60090transapply',
        // 权限前缀
        permissionPrefix: '/hrtrn/trans/apply',
        requestUrl: {
          exec: '/execBill',
        },
        dialogVisible: false,
        effectDate: new Date(),
      };
    },
    methods: {
      handleCancel(){
        this.dialogVisible = false;
      },
      handleSave() {
        this.execBill(this.effectDate);
      },
      execBill(date){
        let param = {
          pk: this.pk_hi_stapply,
          pk_org: this.pk_org,
          regularDate: date !== null ? date.getTime() : null,
        };
        this.$http({
          url: this.permissionPrefix + this.requestUrl.exec,
          method: "post",
          params: param,
        }).then(res => {
          if (res.data.status) {
            this.$message({message: "执行成功", type: "success"});
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
          this.setDialogVisible(false);
          this.$emit('after-exec');
        }).catch(() => {
          this.$message({message: "执行失败", type: "error"});
        });
      },
      // 设置dialog是否可见
      setDialogVisible: function (val) {
        this.dialogVisible = val;
      },
    }
  };
</script>
