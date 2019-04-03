<!--
	作者：liuchym
	时间：2018-08-28
	支持：自助 我的薪资
-->
<template>
	<div class="main-panel">
		
    	<ifbp-breadcrumb name="我的薪资"></ifbp-breadcrumb>
    	
		<ifbp-button-area>
			<div class="myWage_check" style="height: 30px;" v-show="salaryshow">
				
			  	<span style="font-size: 14px;color: #333333;line-height: 33px;margin-right: 10px;float: left;">薪资期间:</span>
			  	<span class="block1">
				   	<el-date-picker
				      v-model="value1"
				      type="month"
				      placeholder="选择查询日期"
				      @change="date1">
				    </el-date-picker>
			    </span>
			  	<span style="text-align: center;color: #D2D2D7;font-size: 12px;width:16px;float: left;border-bottom: 1px solid #ddd;margin: 16px 16px 0px 16px;">
			    </span>
			  	<span class="block1">
				    <el-date-picker
				      v-model="value2"
				      type="month"
				       align="right"
				      placeholder="选择查询日期"
				      @change="date2">
				    </el-date-picker>
			     </span>
				<!--<el-button type="primary" class='y-btn-search' style="margin-left: 10px;" @click="search()">查询</el-button>-->
				
				<span style="position: absolute;right: 0px;top:6px;" @click.stop="seeingbtn()" class="biao"><i v-if="seeing==true" style="font-size: 24px;color: #0089FA;" class="iconfontWage icon-yanjingWage"></i><i v-else="seeing==false" style="font-size: 24px;color: #0089FA;;" class="iconfontWage icon-biyanWage"></i></span>
	
			</div>
		</ifbp-button-area>
		
	     <!-- 主体区域 -->
	    <!--<ifbp-main-area type="list">-->
	   		<div class="myWage_content" :style="{height:maxheight+'px'}" v-bind:class="{active:isActive}">
	   			
	   			<!--登录密码begin-->
	   			<div class="myWage_pass" v-show="login">
	   				<div class="myWage_pass_tittle">登录密码</div>
	   				<div class="myWage_pass_wrap">
						<div >
							<el-form :model="numberValidateForm" ref="numberValidateForm" style="margin-left: -50px;padding-top: 30%;" label-width="100px" class="demo-ruleForm">
							  <el-form-item
							    label="密码:"
							    prop="pass"
							    :rules="[
							      { required: true, message: '密码不能为空'}
							    ]"
							  >
							    <el-input type="password" v-model.number="numberValidateForm.pass" placeholder='请输入工资查询密码'  auto-complete="off"></el-input>
							  </el-form-item>
							  <el-form-item>
							    <el-button type="primary"  @click="submitForm('numberValidateForm')">查询</el-button>
							  </el-form-item>
							</el-form>
							<div>
								<el-button style="margin-left: 50px;" type="text" @click="reset()">找回密码</el-button><el-button style='font-size: 20px;color:  #979797;' type="text">|</el-button><el-button @click="modifypass()" type="text">修改密码</el-button>
								
								<div style="margin-top: 30px;padding-left: 10px;">
									<div class="myWage_pass_text"><img style="height: 14px;width: 14px;" :src="zhuyi"/>&nbsp;&nbsp;为了保证您的薪资隐私安全,请输入密码进行修改</div>
									<div class="myWage_pass_text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(初次使用请先通过<span style="color:#979797;">“找回密码”</span>获取初始密码)</div>
								</div>
							</div>
						</div>
					</div>
	   			</div>
	   			<!--登录密码over-->
	   			
	   			<!--修改密码begin-->
	   			<div v-show="showdialog" class="myWage_pass">
	   				<div class="myWage_pass_tittle">修改密码</div>
	   				<div class="myWage_pass_wrap">
						<div >
							<el-form :model="ruleForm2" style="text-align: center;background: #fff;margin-top: 100px;" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
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
							    <el-button type="primary" style=' width: 250px;'  @click="submitpass('ruleForm2')">提交</el-button>
							  </el-form-item>
							</el-form>
						</div>
					</div>
	   			</div>
	   			<!--修改密码over-->
	   			
	   			<!--薪资查询begin-->
	   			<div class="L-salaryinner" v-show="checkcontent">
					<!--查询的内容-->
					<ul class="L-salarylistwrap">
						<div style="margin-left: 50%;margin-top: 10%;" v-if="salarydata==''">
							<!--差一个图片-->
							<i class="ifbp-icon-description" style="font-size: 60px;color:#DDDDDD;"></i>
							<!--<img style="margin-left: -42px; height: 100px;width: 120px;"  :src="nodata" alt="" />-->
							<div style="font-size: 14px;color:#BFBFBF;margin-left: -44px;">请选择您要查询的月份</div>
						</div>
						
						<li class="L-salarylist"  v-for="item in salarydata">
							<div class="L-salarylisttittle">
								<span class="date">{{item.yearPeriod}}</span>
							</div>
							<div class="L-salarylistinner" v-for="value in item.perPeriodPayslip">
								<div class="L-tittle">{{value.waclassName}}</div>
								<div class="L-salarylistborder clearfix">
									<el-row>
										<el-col :span="4" class="inner" v-for="list in value.items">
											<span class="sizatop">{{list.itemTitle}}:</span>
											<span class="sizacon"><span v-if="seeing==true">{{list.itemContent}}</span><span v-if="seeing==false">******</span></span>
										</el-col>
									</el-row>
								</div>
							</div>
						</li>
						<!--合计-->
						<li class="L-salarylist" v-for="value in salarysum">
							<div class="L-salarylisttittle">
								<span class="date">合计&nbsp;&nbsp;({{value.moneyType}})</span>
							</div>
							<div class="L-salarylistinner clearfix L-salarytotal">
								<el-row>
									<el-col :span="6" class="list" v-for="val in value.items">
										<span class="totaltop">{{val.itemTitle}}：&nbsp;&nbsp;</span>
										<span class="totalmoney"><span v-if="seeing==true">{{val.itemContent}}</span><span v-if="seeing==false">******</span></span>
									</el-col>
								</el-row>
							</div>
						</li>
						
					</ul>
					<!--合计-->
				</div>
	   			<!--薪资查询over-->
	   		</div>
	
	</div>
</template>

<script>
import zhuyi from "./public/ico/zhuyi.png"; //注意图标
import nodata from "./public/ico/nodata.png"; //暂无数据图标
import "./public/ico/iconfont.css";
import checkData from "./public/checkData.json";

export default {
  data() {
    //修改密码校验规则begin
    var res = /^\d{6,8}$/;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!res.test(value)) {
        callback(new Error("请输入6-8位之间的数字"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!res.test(value)) {
        callback(new Error("请输入6-8位之间的数字"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }; //修改密码校验规则over
    return {
    	cascaderTreeData:[],
	   	cascaderModel:[],
	   	orderData:[{
	   		id:'222',
	   		name:'王者'
	   	},
	   	{
	   		id:'333',
	   		name:'王者1'
	   	}],
	   	
	   	
	   	
      nodata: nodata, //暂无数据图标
      zhuyi: zhuyi, //注意图标
      salaryshow: true,
      login: false,
      showdialog: false, //修改密码弹框
      seeing: true, //眼睛闭合
      value1: "",
      value2: "",
      checkcontent: false, //查询界面
      salarydata: "",
      salarysum: "", //薪资合计
      maxheight: "",
      numberValidateForm: {
        pass: ""
      },
      isActive: false,
      //修改密码begin数据
      ruleForm2: {
        passinit: "",
        pass: "",
        checkPass: ""
      },
      rules2: {
        passinit: [{ validator: validatePass, trigger: "change" }],
        pass: [{ validator: validatePass2, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }]
      }
      //修改密码over
    };
  },
  components: { 
		
  },
  methods: {
	  orderEndvalue(res){
	  	console.log(res)
	  },
	  orderData(){
	  	
	  },
    submitpass(formName) {
      //修改密码提交方法
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _Data = {
            oldPswd: this.ruleForm2.passinit,
            newPswd: this.ruleForm2.checkPass
          };
          this.$http({
            url: "/hrss/profile/modifyPswd",
            method: "post",
            data: JSON.parse(JSON.stringify(_Data))
          })
            .then(res => {
              //			       		alert(JSON.stringify(res))
              if (res.data.status == true) {
                if (res.data.result == true) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.login = true;
                  this.showdialog = false;
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message({
                  message: res.data.result[0].des,
                  type: "info"
                });
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          return false;
        }
      });
    },
    date1(res) {
      this.value1 = res;
      this.search();
    },
    date2(res) {
      this.value2 = res;
      this.search();
    },
    reset() {
      //重置密码
      var _Data = {};
      this.$http({
        url: "/hrss/profile/resetPswd",
        method: "post",
        data: JSON.parse(JSON.stringify(_Data))
      })
        .then(res => {
          //		       		alert(JSON.stringify(res))
          if (res.data.status == true) {
            if (res.data.result == true) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message({
              message: res.data.result[0].des,
              type: "info"
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    datefun(myDate) {
      var y = myDate.getFullYear();
      var m = myDate.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = myDate.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m;
    },
    modifypass() {
      this.login = false;
      this.showdialog = true;
    },
    search() {
      var a = this.datefun(new Date(this.value1));
      var b = this.datefun(new Date(this.value2));
      if (a == "") {
        this.$message("开始时间不能为空");
      } else if (b == "") {
        this.$message("结束时间不能为空");
      } else if (a > b) {
      	console.log(a + b)
        this.$message("开始时间不能大于结束时间");
      } else {
        // 发送请求获取查询的数据
        var _Data = {
          beginTime: a,
          endTime: b
        };
        this.$http({
          url: "/hrss/payslip/listSelfPayslip",
          method: "post",
          data: JSON.parse(JSON.stringify(_Data))
        })
          .then(res => {
            // alert(JSON.stringify(res))
          
            if (res.data.status == true && Object.keys(res.data.data).length !=0) {
              this.salarydata = res.data.data.myPayslips;
              this.salarysum = res.data.data.sumItems;
              this.isActive = true; //改变背景颜色
            }else if(res.data.status == true && Object.keys(res.data.data).length == 0){
            	
            	this.$message.error("该期间没有薪资数据");
            }else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    },
    seeingbtn() {
      this.seeing = !this.seeing;
    },
    submitForm(formName) {
      //提交密码
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _Data = {
            pswd: this.numberValidateForm.pass
          };
          this.$http({
            url: "/hrss/profile/checkPswd",
            method: "post",
            data: JSON.parse(JSON.stringify(_Data))
          })
            .then(res => {
              // alert(JSON.stringify(res))
              if (res.data.status == true) {
                if (res.data.result == false) {
                  this.$message.error(res.data.msg);
                } else {
                  //密码校验成功后查询页面
                  this.salaryshow = true;
                  this.login = false;
                  this.checkcontent = true;
                }
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          return false;
        }
      });
    },
  },

  created() {
    var myDate = new Date();

    //重置查询日期
    this.value1 = this.datefun(myDate);
    this.value2 = this.datefun(myDate);

    //右侧内容高度自适应的设置
    var winHeight = "";
    if (window.innerHeight) {
      winHeight = window.innerHeight;
    } else if (document.body && document.body.clientHeight) {
      winHeight = document.body.clientHeight;
    }
    this.maxheight = winHeight - 160; //减掉内容上方的高度；

    this.salaryshow = false; //初始不显示查询

    //初始判断用户需不需要登录密码

    var _Data = {};
    this.$http({
      url: "/hrss/profile/needPswd",
      method: "post",
      data: JSON.parse(JSON.stringify(_Data))
    })
      .then(res => {
        //alert(JSON.stringify(res))
        if (res.data.status == true) {
          if (res.data.result == false) {
            this.salaryshow = true;
            this.login = false;
            this.checkcontent = true;
            
            this.search()
          } else if (res.data.result == true) {
            this.salaryshow = false;
            this.login = true;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "info"
          });
        }
      })
      .catch(() => {
        this.$message.error(err);
      });
  }
};
</script>

<style>
.block1 {
  width: 130px;
  float: left;
}
.block1 .el-date-editor.el-input{
	width: 130px !important;
}
.myWage_content {
  background: #fff;
  padding: 10px;
  overflow: auto;
  margin-top: 8px;
}
.myWage_content.active {
  background: #eee;
  padding: 0;
  margin-top: 16px;
}
.myWage_pass_tittle {
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d1dae4;
}
.myWage_pass_wrap {
  width: 350px;
  margin: auto;
}
.myWage_pass_text {
  line-height: 22px;
  font-size: 14px;
  color: #333333;
}
/*薪资查询*/
.myWage_check {
  position: relative;
}

.L-salaryinner .L-salarylist {
  background: #fff;
  padding: 16px;
  padding-top: 0px;
  border-bottom: 10px solid #eee;
}
.L-salaryinner .L-salarylisttittle {
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 57px;
  border-bottom: 1px solid #d1dae4;
}
.L-salaryinner .L-tittle {
  /*margin-top: 10px;*/
  /*margin-bottom: 10px;*/
  font-size: 16px;
  color: #333333;
  line-height: 54px;
  /*border-left:6px solid #3896FC;*/
}
.L-salaryinner .L-salarylistborder {
  border: 1px solid #e6e6eb;
  padding: 20px;
  padding-bottom: 0px;
  font-size: 14px;
  color: #333333;
  line-height: 14px;
}
.L-salaryinner .L-salarylistborder .el-row {
  margin-bottom: 0px;
}
.L-salaryinner .L-salarylistborder .inner {
  margin-bottom: 20px;
}
.L-salarytotal {
  margin-top: 10px;
  border: 1px solid #e6e6eb;
  padding: 20px;
  font-size: 14px;
  color: #333333;
  line-height: 14px;
}
</style>