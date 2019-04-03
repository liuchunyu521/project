<template>
	<div class="y-dialog">
		<el-dialog :title="title" :show-close="showClose" :before-close="handleClose" :visible="visible" class="y-info-dialog">
		 	<el-form :model="formData" :rules='rules' ref="myForm" label-width="110px" class="clearfix">
				<yInput v-for="(val,key) in formDataConfig"
					v-model="formData[key]"
					:class="formDataConfig[key].type == 'date' ? 'y-date-formitem' : ''"
					:name="key"
					:formData="formData"
					:inputData="formDataConfig[key]"
					@dateChange="dateChange">
				</yInput>
			</el-form>
			<div class="y-btn-box">
				<el-button class="y-btn-danger" type="danger" @click="submitForm()">保存</el-button>
	  			<el-button class="y-btn-default" @click="cancel()">取消</el-button>
  			</div>
		</el-dialog>
	</div>
</template>
<script>
import { deepCopyObj } from '@/assets/js/v-extend.js';
import Cookies from 'js-cookie';
import yInput from '@/components/public/yinput';
export default {
	props: ["visible", "title", "formConfig", "formData" ],
	data() {
		return {
			showClose: true, //隐藏右上角关闭按钮
			changedReferKey: [], //缓存被修改的参照字段
			rules: { },
			formDataConfig: { },
			addFlag: true, //当前是新增操作
			initFormData: '' //缓存初始状态的表单字段
		}
	},
	components: {
		yInput, //表单元素
	},
	mounted(){
		this.transferData();

	},
	watch: {
		formData:function( val ){
      this.initFormData = JSON.stringify( val );
		}
	},
	methods: {
		dateChange: function( val ){
			this.$emit('dateChange',val );
		},
		//确定操作
		submitForm(){
		 	this.$refs['myForm'].validate((valid) => {
		 		var _postdata = this.postFormData();

				if (valid) {
					if( _postdata ){
						this.$emit('submit', _postdata );
						if(this.visible=="true"){
							this.resetForm();
						}

					}else{
//						alert('没有任何修改，请取消返回');
						// Edit By zhangyl5 保存时，若无修改信息，关闭弹框 2017-09-27
						this.cancel();
					};
				} else {
					return false;
				};
	       });
		},
		//被提交到后台的表单数据
		postFormData(){
			var _postdata = {};
			var _initdata = JSON.parse( this.initFormData );
			for(var i in _initdata){
				var _val = this.formData[i];
				if( _initdata[i] != _val ){
					_postdata[i] = _val;
				};
				if( _initdata[i] != ""){
					this.addFlag = false; //编辑操作
				};
			};

			if( JSON.stringify( _postdata ) == "{}" ){
				return false;
			};
			if( this.addFlag ){ //当前是新增操作
				return this.formData;
			};
			return _postdata;
		},
		//取消操作
		cancel() {
	        this.$emit('close');
	    },
	    handleClose(){
	    	this.$emit('close');
	    },
	    //重置表单
	    resetForm(){
	     	for(var i in this.formData ){
	     		this.formData[i] = '';
	     	};
//	     	if( document.querySelector('.el-cascader__label') && this.addFlag ){
//	     		document.querySelector('.el-cascader__label').innerHTML = "";
//	     	};
	     	this.$refs['myForm'].resetFields();
	    },
	    //表单数据批量处理
		transferData(){
			var _formconfig = this.formConfig;
			for( let i in _formconfig ){
				var _d = _formconfig[i];
				var _id = _d.id;
				this.formDataConfig[_id] = _d;

				if( _d.valid ){
					this.rules[ _id ] = _d.valid;
				};
			};
		}
	}
}
</script>
