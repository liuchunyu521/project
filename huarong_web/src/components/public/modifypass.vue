<!--
	作者：yugl
	时间：2017-09-06 
	支持：城市地区参照类型的选择弹窗
-->
<template>  
	<div class="y-dialog"> 
		<el-dialog class="y-info-dialog y-cascader-dialog" title="修改密码" :before-close="handleClose" :show-close="true" :visible="visible">   
		 	<el-form :model="ruleForm2" style="text-align: center;background: #fff;" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
			  <el-form-item label="原密码:" prop="passinit">
			    <el-input type="password" v-model="ruleForm2.passinit"placeholder='请输入原始密码' auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="新密码:" prop="pass">
			    <el-input type="password" v-model="ruleForm2.pass" placeholder='(6-8位之间的数字)' auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="确认新密码:" prop="checkPass">
			    <el-input type="password" v-model="ruleForm2.checkPass" placeholder='(6-8位之间的数字)' auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" style=' width: 250px;border-color:#CC2123;background: #CC2123;margin-left: -100px;'  @click="submitForm('ruleForm2')">提交</el-button>
			  </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>  
import axios from 'axios';  
import Qs from 'qs';
import Cookies from 'js-cookie';
import { ajaxData } from '@/assets/js/ajaxdata.js';
var UserInfo;
export default {  
	data(){
		var res=/^\d{6,8}$/;
		 
	      var validatePass = (rule, value, callback) => {
	        if (value === '') {
	          callback(new Error('请输入密码'));
	        }else if(!res.test(value)) {
	        	 callback(new Error('请输入6-8位之间的数字'));
	        }else {
	          if (this.ruleForm2.checkPass !== '') {
	             this.$refs.ruleForm2.validateField('checkPass');
	          }
	          callback();
	        }
	      };
	      var validatePass2 = (rule, value, callback) => {
	        if (value === '') {
	          callback(new Error('请再次输入密码'));
	        }else if(!res.test(value)) {
	        	 callback(new Error('请输入6-8位之间的数字'));
	        }else if (value !== this.ruleForm2.pass) {
	          callback(new Error('两次输入密码不一致!'));
	        } else {
	          callback();
	        }
	      };
		return {   
			ruleForm2: {
				passinit: '',
		        pass: '',
		        checkPass: ''
		    },
	        rules2: {
	          passinit: [
	            { validator: validatePass, trigger: 'change' }
	          ],
	          pass: [
	            { validator: validatePass2, trigger: 'change' }
	          ],
	          checkPass: [
	            { validator: validatePass2, trigger: 'change' }
	          ]
	        }
		};
	},
	props:["visible"],
	created(){

	},
	methods: {  
		handleClose(){
			this.$emit('close');
		},
		submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	            
		            this.$http.post(this.$store.state.Interface.wa, Qs.stringify({
						transType: "handleWAPSWD",
						way: "modify",
						oldPswd:this.ruleForm2.passinit,
						newPswd:this.ruleForm2.checkPass
					})).then((res) => {
						if(res.data.flag=='0'){
							if(res.data.result[0].flag=='0'){
								this.$emit('close');
								this.$message(res.data.result[0].des);
							}else{
								this.$message.error( res.data.result[0].des );
							}
						}else{
							this.$message.error( res.data.des );
						}
					}).catch((err) => {
						this.$message.error(err);
					})
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
      	}
    }
}
</script>
 