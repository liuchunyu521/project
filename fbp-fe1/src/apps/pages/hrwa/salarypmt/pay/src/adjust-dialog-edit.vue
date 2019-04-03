<!--该文件没有用-->
<template>
<div>
  <el-dialog title="个别调整" :visible.sync="dialogVisible" size="tiny" :show-close="false">
    <el-form  :model="adjustForm" ref="adjustForm" :rules="rules" >
         <el-form-item label="薪资项目" prop="salaryobject">
                      <el-select  v-model="adjustForm.salaryobject" placeholder="请选择薪资项目">
                        <el-option
                                v-for="item in salaryobjectoptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                      </el-select>
        </el-form-item>

      <el-form-item label="调整金额" >
          <el-input type="number" v-model="adjustForm.jine"  ></el-input>
      </el-form-item>
      <el-form-item label="调整原因" >
          <el-input type="text" v-model="adjustForm.yuanyi" ></el-input>
      </el-form-item>  
    
     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sumbit('adjustForm')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
	import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins :[pageModelMixin],
  props: {
    dialogData: []
  },
  data() {
    return {

      //导出框是否显示
      dialogVisible: false,
      salaryobjectoptions: [],
      adjustForm: {
        salaryobject: null,
        jine: null,
        yuanyi:null
      },
      param: '',

      rules: {//修改时的校验
        salaryobject: [
          { required: true, message: '薪资项目不能为空', trigger: 'blur' }
        ]
      },


    }
  },
  //初始化加载
  mounted() {
    //数据初始化
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.adjustForm.salaryobject = '';
    },
    show() {
      this.dialogVisible = true;
      this.applyForm.salaryobject = null;
      this.applyForm.jine = null;
      this.applyForm.yuanyi = null;

      this.salaryobjectoptions = JSON.parse(this.editableItem);

      var dynamicColumn = sessionStorage.getItem('waDataDynamicColumn').split("||");
      var jsonDynamicColumns = [];
      for (var i = 0; i < dynamicColumn.length; i++) {
        var aColumn = JSON.parse(dynamicColumn[i]);

        var item = {};
        item.value = aColumn.column;
        item.label = aColumn.label;
        jsonDynamicColumns.push(item);
      }
      this.options = jsonDynamicColumns;
    },
    sumbit(formName) {
        this.$refs[formName].validate((valid) => {
                    if (valid) {
                       
                    } else {
                        return false;
                    }
                });
    }
  }
}
</script>

