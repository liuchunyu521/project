<template>
<div>
  <el-dialog class="apply_note" title="发放说明" :visible.sync="dialogVisible" size="tiny" :show-close="false" style=“width:400px;height:234px”>
    <el-form  :model="applyForm" label-width="50px" >
        

        <el-input type="textarea" width=“300px” :rows="4" resize=none  v-model="applyForm.apply_note" placeholder="请输入发放说明" ></el-input>
        
       
     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sumbit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  props: {
    dialogData: []
  },
  data() {
    return {

      //导出框是否显示
      dialogVisible: false,
      applyForm: {
        apply_note: ''
      },
      param: '',

      rule: {//修改时的校验
        apply_note: [
          { required: true, message: '发放说明不能为空', trigger: 'blur' }
        ]
      }


    }
  },
  //初始化加载
  mounted() {
    //数据初始化
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.applyForm.apply_note = '';
    },
    show() {
      this.dialogVisible = true;
      this.applyForm.apply_note = '';
    },
    sumbit() {
      this.$confirm('提交后不能进行修改，是否执行本次操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,

        type: 'warning'
      }).then(() => {
        this.dialogData.apply_note = this.applyForm.apply_note;
        this.$http({
          url: "/hrwa/payroll/save",
          method: "post",
          data: this.dialogData
        }).then(res => {
          if (res.data.status === true) {
            // alert(res.data.data.pk_payroll)
            var queryParma = { funcode: '60130payslipaly' };//,datastate:datastate
            this.$router.push({ path: "/hrwa/payroll/detail/" + res.data.data.pk_payroll + "?funcode=60130payslipaly", queryParma: queryParma });
            this.cancel();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      }).catch(() => {

      });



      // var queryParma = {funcode:'60130payfile',pk_org:pk_org,pk_wa_class:pk_wa_class,cyear:cyear,cperiod:cperiod,classname:classname,orgname:orgname};//,datastate:datastate
      // this.$router.push({path:"/hrwa/payFile/payFileInfo", query:queryParma}) ;

      //  var queryParma = {funcode:'60130payslipaly'};//,datastate:datastate
      //   this.$router.push({path:"/hrwa/payroll/detail/" +'1001AA1000000000JHE4',queryParma});
      // var queryParma = { funcode: '60130payslipaly' };//,datastate:datastate
      // this.$router.push({ path: "/hrwa/payroll/detail/" + '1001AA1000000000JHE4?funcode=60130payslipaly', queryParma: queryParma });
      // this.cancel();

    }
  }
}
</script>

<style>
.apply_note .el-textarea__inner {
  border: none !important;
}
.apply_note .el-dialog__footer {
  border-top: 1px solid #ddd;
}
</style>
