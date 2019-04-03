<template>
    <div class="login-wrap">
        <div class="ms-title">中国华融</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password"  placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm()"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!--<p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>-->
            </el-form>
        </div>
    </div>
</template>

<script>
	import Cookies from 'js-cookie';
	import Qs from 'qs';
	
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                bgstyle:'1',
                bgshow:true,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
        	
            submitForm(formName) {
            	var username = this.ruleForm.username;  
                var password = this.ruleForm.password;  
                if(username == '' || password == ''){  
                    this.$message({  
                        message : '账号或密码为空！',  
                        type : 'error'  
                    })  
                    return;  
                }
                //发送请求
                 this.$http.post(this.url,Qs.stringify ({
			    		"userCode":username,
						"passWord":password
		    	}), {
		          	headers: {
		                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
		          	}
	      		}).then(function (response) {
					//返回数据成功跳转到首页
					var _data=JSON.stringify(response.data)
					if(response.data.flag==0){
//						console.log(window.localStorage.getItem("usermsg"));
//						Cookies.set('usermsg',_data)
//						console.log(Cookies.get('usermsg'))
						this.$router.push({
				  			// name:'/Index',
                            path:'/Index'
				  		});
					}else if(response.data.flag==-1){
						this.$message({  
	                        message : response.data.des,  
	                        type : 'error'  
	                    })  
					}else if(response.data.flag==1){
						this.$message({  
	                        message : response.data.des,  
	                        type : 'error'  
	                    }) 
					}
			   	}.bind(this)).catch(function (error1) {
			         this.$message.error('请求数据失败');
			    }.bind(this));
            }
        },
        computed: {
			url(){  
				return this.$store.state.Interface.login;
			} 
		},
		created(){
			
		}
       
    }
</script>

<style scoped>
	body {
		background: red;
	}
    .login-wrap{
        position: absolute;
        width:100%;
        height:100%;
        background: url(../../assets/img/login/2.jpg) no-repeat;
        background-size:100% ;
    }
    
	
    .login_bg {
    	width: 100%;
    	height: 100%;
    }
    .ms-title{
        position: absolute;
        top:50px;
        width:100%;
        text-align: center;
        font-size:30px;
        color: #fff;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>