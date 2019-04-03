<template>
  <!-- <div v-show="value">  -->
    <el-dialog title="离职" v-model="dimissionDialogVisible" size="tiny" id="dimissiondialog">
      <ifbp-template ref="ref_psnjob_c"
                     tpl-id="jobId"
                     pk-temp="0001AA10000000013COI"
                     show-type="form"
                     :tpl-data="jobData"
                     :tpl-reset-fun="tableFormResetFun"
                     :methods="childFormMethods"
                     :editable=true>
      </ifbp-template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">保存</el-button>
      </span>
    </el-dialog>
  <!-- </div>  -->
</template>
<script>

  export default {
    props: ["value", "pk_psndoc"],
    data() {
      var vm = this;
      return {
        dimissionDialogVisible: false,
        jobData: {
          hi_psnjob: {},
          params: {
            pk_org: "",
            pk_defdoclist: "1001Z71000000000GPD1"
          },
          rules: {
            // begindate: [
            //   {required: true, message: '请输入开始日期', trigger: "change"}
            //],
//            pk_psncl: [
//              {required: true, message: '请选择人员类别', trigger: "change"}
//            ]
          }
        },

        //模板控件里的method内容
        childFormMethods: {
          orgTriggerHandle: function (type, data) {
            let key = data.key;
            let editData = this.$refs.ref_psnjob_c.model;
            if (key === "pk_group") {
              editData.pk_dept = null;
              editData.pk_org = null;
              if (editData.pk_post != null) {
                editData.pk_psncl = null;
                editData.pk_post = null;
                editData.pk_jobgrade = null;
                editData.pk_postseries = null;
                editData.pk_job = null;
                editData.series = null;
                editData.pk_jobrank = null;
              }
            } else if (key === "pk_org") {
              var id = data.value[0].id;
              this.params.pk_org = id;

              editData.pk_dept = null;
              if (editData.pk_post != null) {
                editData.pk_post = null;
                editData.pk_jobgrade = null;
                editData.pk_postseries = null;
                editData.pk_job = null;
                editData.series = null;
                editData.pk_jobrank = null;
              }
            } else if (key === "pk_dept") {
              if (editData.pk_post != null) {
                editData.pk_post = null;
                editData.pk_jobgrade = null;
                editData.pk_postseries = null;
                editData.pk_job = null;
                editData.series = null;
                editData.pk_jobrank = null;
              }
            } else if (key === "pk_post") {
              editData.pk_postseries = null;
              editData.pk_job = null;
              editData.pk_jobgrade = null;
              editData.pk_jobrank = null;
              editData.series = null;
            } else if (key === "pk_job") {
              editData.pk_jobgrade = null;
              editData.pk_jobrank = null;
              editData.series = null;
            } else if (key === "series") {
              editData.pk_jobgrade = null;
              editData.pk_jobrank = null;
            } else if (key === "pk_postseries") {
              editData.pk_jobgrade = null;
              editData.pk_jobrank = null;
            } else if (key === "pk_jobgrade") {
              editData.pk_jobrank = null;
            }
          }
        },

        tableFormResetFun($node) {
          //增加编辑联动事件
          var $ownModule = $node.find("[v-model^='hi_psnjob.']");
          $ownModule.attr('v-on:trigger', 'orgTriggerHandle');

          return $node[0].outerHTML;
        },
      };
    },
    watch: {
//      value(val){
//        if (val) {
//          this.initData();
//        }
//      },
      dimissionDialogVisible(val){
        if (!val) {
          this.$emit('input', val);
        }
      }
    },

    mounted() {
    },

    methods: {
        show(){
            this.initData();
        },
      initData(){
        this.dimissionDialogVisible = true;
        var url = '/hrtrn/dimission/jldetail/addinit?pk_psndoc=' + this.pk_psndoc;
        this.$http({
          url: url,
          method: "get",
          dataType: "json"
        })
          .then((res) => {
            if (res.data.status === true) {
              var originalValue = res.data.data;
              this.$refs.ref_psnjob_c.setData(
                "hi_psnjob",
                JSON.parse(JSON.stringify(originalValue))
              );
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch((res) => {
            this.$message({
              message: "页面初始化失败",
              type: "error"
            });
          });
      },
      handleCancel(){
        this.dimissionDialogVisible = false;
      },
      handleSave() {
        this.$refs.ref_psnjob_c.validate(valid => {
          if (valid) {
//              this.$confirm('是否同时停用当前人员？', '确认停用', {
//                  confirmButtonText: '是',
//                  cancelButtonText: '否',
//                  closeOnClickModal:false,
//                  type: 'warning'
//              }).then(() => {
//                  this.handleRealSave(1);
//              }).catch(() => {
//                  this.handleRealSave(0);
//              });
              this.handleRealSave(0);
          }
        });
      },
      // 基本信息保存按钮操作
      handleRealSave(isdisablepsn) {
        let data = this.$refs.ref_psnjob_c.getData("hi_psnjob");
        var url = "/hrtrn/dimission/jldetail/save?isdisablepsn=" + isdisablepsn;
        this.$http({
          url: url,
          method: "post",
          data: data
        })
          .then(res => {
            if (res.data.status === true) {
              this.dimissionDialogVisible = false;
              this.$nextTick(function(){
                  this.$emit("psnend");
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(() => {
            this.$message({
              mge: "离职信息更新失败",
              type: "error"
            });
          });
      }
    }
  };
</script>
<style>
  #dimissiondialog .el-dialog__body{
  padding-bottom: 0px!important;
}
</style>
