<template>
  <el-dialog title="导出干部信息" :visible.sync="dialogFormVisible" size="tiny" :show-close="false">
    <el-form :model="cadresForm" label-width="120px">
      <el-form-item label="">
        <el-radio-group v-model="cadresForm.radio">
          <el-radio :label="1">导出当前数据</el-radio>
          <el-radio :label="2">导出所有数据</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cadresCancel">取 消</el-button>
      <el-button type="primary" @click="cadresSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      funcode: {
        type: String,
        required: true
      },
      requestPrefix: {
          type: String,
          required: true
      },
      pks:Array,
    },
    data() {
      return {
        // 请求路径
        requestUrl:{
          exportUrl:'/exportCadresXML'
        },
        //导出框是否显示
        dialogFormVisible: false,
        //导出框绑定数据
        cadresForm: {
          radio: 1,
        },
        //干部信息列表
        options: [],
      }
    },
    //初始化加载
    mounted() {

    },
    methods: {
      cadresSave: function () {
        if (this.cadresForm.radio === 1 && (!this.pks || this.pks.length <= 0)) {
          this.$message({message: "请选择要导出的数据！", type: "info"});
          return;
        }
        let isAll = false;
        isAll = this.cadresForm.radio !== 1;
//          let param = {
//              isAll: this.cadresForm.radio === 1 ? false : true,
//            pk_psndocs: this.pks,
//          };
//          this.$http({
//            url: this.requestPrefix + this.requestUrl.exportUrl,
//            method: "post",
//            params: param,
//          }).then((res) => {
        this.setDialogVisible(false);
        this.$nextTick(function () {
          window.location.href = "/hrhi/cadre" + this.requestUrl.exportUrl + "?arryPk_psndoc=" + this.pks + "&isAll=" + isAll;
        })
      },
      cadresCancel: function () {
        this.setDialogVisible(false);
      },
      setDialogVisible: function (val) {
        this.dialogFormVisible = val;
      }
    }
  }
</script>
