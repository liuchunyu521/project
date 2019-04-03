<template>
  <!-- <div v-show="value">  -->
    <el-dialog title="调薪日期" v-model="dialogVisible" size="tiny">
        <div style="width:100%;">
            <br/>
            <el-form :rules="rules" label-width="80px"  ref="paraForm" :model="DialogEntity">
                <el-form-item label="薪资项目" prop="waitem" required>
                    <el-select :editable="true" v-model="DialogEntity.waitem">
                        <el-option v-for="vo in WaItemVOs" :key="vo.itemkey" :label="vo.name" :value="vo.itemkey"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">确定</el-button>
      </span>
    </el-dialog>
  <!-- </div>  -->
</template>
<script>

  export default {
      //from=1:薪资规则  from=2:薪资发放项目 from=3:公共薪资项目
    props: ["pk_org", "from","inputSig"],
    data() {
      return {
        dialogVisible: false,
          DialogEntity:{
              waitem:'',
          },
          WaItemVOs:[],
          rules: {
              waitem:[ { required: true, message: '请选择薪资项目', trigger: 'change' },],
          },
      };
    },
    watch: {
      dialogVisible(val){
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
        this.dialogVisible = true;

        var url ="";
        if(this.from == 2){
            url = "/hrwa/payitemfomula/getPara4AdjustData";
        }else if(this.from == 3){
            url = "/hrwa/waitemfomula/getPara4AdjustData";
        }else{
            return;
          }
        url = url + '?pk_org=' + this.pk_org;
        this.$http({
          url: url,
          method: "get",
          dataType: "json"
        })
          .then((res) => {
            if (res.data.status === true) {
               this.WaItemVOs = JSON.parse(JSON.stringify(res.data.data))
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
        this.dialogVisible = false;
      },
      handleSave() {
        this.$refs.paraForm.validate(valid => {
          if (valid) {
              this.$emit("paraSel",this.inputSig + "(" + this.DialogEntity.waitem + ")");
              this.dialogVisible = false;
          }
        });
      },
    }
  };
</script>
<style>
</style>
