<!--
  花名册组件
  @author zyl
  @date 2018-12-24 14:26:52
 -->
<template>
  <el-dialog title="导出花名册" :visible.sync="dialogFormVisible" size="tiny" :show-close="false">
    <el-form :model="repDefForm" label-width="120px">
      <el-form-item label="导出花名册" style="padding-right: 120px">
        <el-select style="min-width:230px;" v-model="repDefForm.repDef" placeholder="请选择花名册">
          <el-option
            v-for="item in options"
            :key="item.pk_rpt_def"
            :label="item.rpt_name"
            :value="item.pk_rpt_def"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-radio-group v-model="repDefForm.radio">
          <el-radio :label="1">导出当前数据</el-radio>
          <el-radio :label="2">导出所有数据</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="repDefCancel">取 消</el-button>
      <el-button type="primary" @click="repDefSave">确 定</el-button>
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
    pk_org: {
      type: String,
      required: true
    },
    pks: Array,
  },

  data() {
    return {
      // 请求路径
      requestUrl: {
        listRepDefs: '/listRepDefs',
        downloadUrl: '/getUrl',
        exportUrl: '/export'
      },

      // 导出框是否显示
      dialogFormVisible: false,

      // 导出框绑定数据
      repDefForm: {
        repDef: '',
        radio: 1,
      },

      // 花名册列表
      options: [],

    }
  },

  mounted() {
    
  },

  methods: {
    // 请求花名册列表
    requestRepDefs() {
      let params = {
        pk_org: this.pk_org,
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.listRepDefs,
        method: "post",
        params: params,
      }).then(res => {
        if (res.data.status === true) {
          this.options = res.data.data;
        } else {
          this.$message({message: res.data.msg, type: "error"});
        }
      }).catch(() => {
        this.$message({message: "花名册获取失败！", type: "error"});
      });
    },

    repDefSave: function () {
      if (!this.repDefForm.repDef) {
        this.$message({ message: "请选择要导出的花名册！", type: "info" });
      } else {
        if (this.repDefForm.radio === 1 && (!this.pks || this.pks.length <= 0)) {
          this.$message({ message: "请选择要导出的数据！", type: "info" });
          return;
        }
        let param = {
          pk_rpt_def: this.repDefForm.repDef,
          exporttype: this.repDefForm.radio,
          pk_psndocs: this.pks,
        };
        this.$http({
          url: this.requestPrefix + this.requestUrl.downloadUrl,
          method: "post",
          params: param,
        }).then((res) => {
          this.setDialogVisible(false);
          if (res.data.status === true) {
            this.$nextTick(function () {
              window.location.href = this.requestPrefix + this.requestUrl.exportUrl
                + "?" + this.funcode + "&pk_rpt_def=" + res.data.data;
            })
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        }).catch(() => {
          this.setDialogVisible(false);
          this.$message({ message: "导出失败", type: "error" });
        });
      }
    },

    repDefCancel: function () {
      this.setDialogVisible(false);
    },

    setDialogVisible: function (val) {
      if (val) {
        this.requestRepDefs();
      }
      this.dialogFormVisible = val;
    }
  }
}
</script>
