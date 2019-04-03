<!--
  作者：yangchd
  时间：2018-10-15
  支持：员工调动-执行dialog
-->
<template>
  <el-dialog title="生效日期" v-model="dialogVisible" :show-close="false" size="tiny">
    <div>
      <P>执行后单据立即生效，是否继续？</P>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins: [pageModelMixin],
  props: {
    pk_entryapply: {
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
      funcode: 'funcode=60070register',
      // 接口前缀
      requestPrefix: '/hrhi/register/',
      requestUrl: {
        exec: 'execBill',
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
        pk: this.pk_entryapply,
        pk_org: this.pk_org,
        regularDate: date !== null ? date.getTime() : null,
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.exec,
        method: "post",
        params: param,
      }).then(res => {
        if (res.data.status) {
          if(res.data.data.warnMsg){
            this.$message({message: res.data.data.warnMsg, type: "warning"});
          }else{
            this.$message({message: "执行成功", type: "success"});
          }
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
