<template>  
<div style="padding: 20px;">
  <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="200px" label-position="left" class="demo-ruleForm">
    <el-form-item label="[vue自带] 名称不为空" prop="pass">
      <el-input v-model="ruleForm2.pass" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="[vue自带] 3-5个字符" prop="name">
      <el-input v-model="ruleForm2.name"></el-input>
    </el-form-item>
    <el-form-item label="[vue自带] 日期" prop="age"> 
      <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm2.age" style="width: 100%;"></el-date-picker>
    </el-form-item> 
    <el-form-item label="[vue自带] 至少选一个" prop="type">
      <el-checkbox-group v-model="ruleForm2.type">
        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
        <el-checkbox label="地推活动" name="type"></el-checkbox>
        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="[自定义] 邮箱" prop="email">
      <el-input v-model="ruleForm2.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="[自定义] 汉字" prop="chinese">
      <el-input v-model="ruleForm2.chinese" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label-width="100px">
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>   
import {validForm} from '@/assets/js/validform.js'; 
export default {
	data() { 
      return {
        ruleForm2: {
          pass: '',
          email: '',
          age: '',
          name: '',
          type: [],
          chinese: ''
        },
        rules: {
          pass: [
            { required: true, message: '请输入', trigger: 'blur' }
          ], 
          age: [
            { type: 'date', message: '请选择日期', trigger: 'change' }
          ],
          name: [
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          email: [
            { validator: validForm.email, required: true, trigger: 'change' }
          ],
          chinese: [
            { validator: validForm.chinese, trigger: 'change' }
          ]
        }
      };
    },
    methods: {
    	//提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script> 