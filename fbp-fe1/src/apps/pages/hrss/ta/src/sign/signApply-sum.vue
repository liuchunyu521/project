<!--
  @des: 补考勤（签卡）汇总
  @author: zyl
  @date: 2018-08-17
-->
<template>
	<div class="main-panel">
    <ifbp-breadcrumb name="补考勤"></ifbp-breadcrumb>
		<ifbp-button-area>
  		<div class="attendtittle">
				<span style="color: #333;font-size: 14px;float: left;margin-top: 6px;" >
				  	考勤期间：
				</span>
				<span>
				   <el-date-picker
					    v-model="period"
					    type="month"
					    placeholder="选择年-月"
					    @change="handleChange">
				  </el-date-picker>
				</span>
		</div>
		</ifbp-button-area>
	    <!--补考勤 begin-->
	    <div class="attendlist">
	    	<div class="nosign" v-if="signCardList.length == 0">
					<i class="ifbp-icon-emoticon" style="font-size: 80px;color: #CFCFD3;margin-bottom: 35px;"></i>
					<p style="font-size: 20px;color: #75787B;line-height: 20px;">{{ msg }}</p>
				</div>
				<div v-if="signCardList.length > 0">
			    <el-row :gutter="16">
			        <div>
			            <el-col :xs="24" :sm="12" :md="8" :lg="6"  v-for="(item, index) in signCardList">
			                <div class="attendwrap" @mouseenter="enter(index)" @mouseleave="leave(index)" @click="clickCard(item)" :pk="item.pk_signh">
			                	<div class="attendLeft">
				                	<div class="attendDate">
				                		{{item.dateTime | capitalize}}
				                	</div>
				                	<div class="attendTime">
				                		{{item.dateTime | capitalize1}}
				                	</div>
			                	</div>
			                	<div class="attendRight">
	                        <!-- -2=补考勤，待填写签卡申请 -->
			                		<i class="ifbp-icon-signature" style="font-size: 60px;color: #DCEBFD ;" v-if="item.status=='-2'"></i>
	                        <!-- -1=自由态，待提交 -->
			                		<i class="ifbp-icon-send" style="font-size: 60px;color: #DCEBFD ;" v-if="item.status=='-1'"></i>
	                        <!-- 0=审批未通过 -->
			                		<i class="hr-icon-not-pass" style="font-size: 60px;color: #FC8A87 ;" v-if="item.status=='0'"></i>
	                        <!-- 1=审批通过 -->
			                		<i class="ifbp-icon-through-examination-and-approval" style="font-size: 60px;color: #4ABD8E ;" v-if="item.status=='1'"></i>
	                        <!-- 2=审批进行中 -->
			                		<i class="ifbp-icon-in-approve" style="font-size: 60px;color: #DCEBFD ;" v-if="item.status=='2'"></i>
			                		<i class="ifbp-icon-approve" style="font-size: 60px;color: #DCEBFD ;" v-if="item.status=='3'"></i>
			                		<div class="status" v-if="item.status=='-2'">补考勤</div>
			                		<div class="status" v-if="item.status=='-1'" v-show="isshow!=index">待提交</div>
			                		<!-- <div class="status" v-if="item.status=='0'" v-show="isshow!=index">审批未通过</div>
			                		<div class="status" v-if="item.status=='1'" v-show="isshow!=index">审批通过</div> -->
			                		<div class="status" v-if="item.status=='2'">审批中</div>
			                		<div class="status" v-if="item.status=='3'">提交</div>
			                	</div>
			                	<div class="attendFoot" v-show="isshow==index">
			                		<div class="free" v-if="item.status=='-1'">
			                			<button class="submit" @click.stop="submit(item)">
			                				<i class="ifbp-icon-up"></i>
			                				提交
			                			</button>
			                			<button class="edit" @click.stop="edit(item)">
			                				<i class="ifbp-icon-edit"></i>
			                				修改
			                			</button>
			                		</div>
			                		<div class="commit" v-if="item.status=='3'">
			                			<button class="callback" @click.stop="callback(item)">
			                				<i class="ifbp-icon-undo"></i>
			                				收回
			                			</button>
			                		</div>
			                	</div>
			                </div>
			            </el-col>
			        </div>
			    </el-row>
			  </div>
	    </div>
	    <!--补考勤 over-->
	</div>
</template>

<script>
export default {
  data() {
    return {

      // 功能编码
      funcode: 'funcode=60420signapply',

      // 权限前缀
      requestPrefix: '/hrss/ta/signapply/',
      requestUrl: {
        listSignCards: 'listSignCards',
        submit: 'submit',
        callback: 'callback',
      },

      msg: '您不需要补考勤哦，棒棒哒~',

      signCardList: [],
      //maxheight: "",//自适应高度
      period: "",
      isshow: null,
    }
  },

  created() {
    // 浏览器窗口发生变化时同时变化DIV高度
    //this.autodivheight();
    //window.onresize = this.autodivheight;

    // 设置期间的初始值
    var myDate = new Date();
    this.period = this.datefun(myDate);
  },

  mounted() {
    this.requestSum();
  },

  filters: {
    capitalize: function (value) {
      if (value) {
        return value.slice(5, 10).replace(/-/, "/");
      } else {
        return '';
      }
    },
    capitalize1: function (value) {
      if (value) {
        return value.slice(11, 16);
      } else {
        return '';
      }cd 
    }
  },

  methods: {

    // 期间变化时触发的动作
    handleChange(val) {
      this.period = val;
      this.requestSum();
    },

    // 请求签卡情况汇总信息
    requestSum() {
      // 期间为空，不查询
      if (!this.period) {
        return;
      }

      let params = {
        period: this.period,
      };

      this.$http({
        url: this.requestPrefix + this.requestUrl.listSignCards,
        method: "post",
        params: params,
      }).then((res) => {
        if (res.data.status === true) {
         
          let retData = res.data.data;
          if (retData) {
            this.signCardList = retData;
          } else {
        		this.signCardList = [];
            this.msg = res.data.msg;
          }
        } else {
          this.$message({ message: res.data.msg, type: 'error' })
        }

      }).catch((err) => {
        this.$message.error(err);
      })
    },

    enter(index) {
      this.isshow = index;
    },

    leave(index) {
      this.isshow = null;
    },

    // 编辑，跳转到详情页面
    edit(item) {
      this.clickCard(item);
    },

    // 提交
    submit(item) {
      this.request(item.pk_signh, this.requestUrl.submit);
    },

    // 收回
    callback(item) {
      this.request(item.pk_signh, this.requestUrl.callback);
    },

    // 提交和收回的网络请求
    request(pk_signh, handle) {
      let data = {
        pk_signh: pk_signh,
      };

      this.$http({
        url: this.requestPrefix + handle,
        method: 'post',
        data: data
      }).then(res => {
        if (res.data.status === true) {
          if (res.data.execMsg) {
            this.$message({ message: res.data.execMsg, type: 'warning' })
          } else {
            this.$message({ message: res.data.msg, type: 'success' })
          }
          this.requestSum();
        } else {
          this.$message({ message: res.data.msg, type: 'error' })
        }
      }).catch(() => {
        this.$message({ message: '提交失败', type: 'error' })
      })
    },

    // 卡片的点击事件
    clickCard(item) {
      let pk_signh = item.pk_signh;
      if (!pk_signh) {
        pk_signh = 'new';
      }
      let signTime = item.dateTimeLong;
      let signstatus = item.signstatus;
      let signremark = item.signremark;

      this.$router.push("/hrss/ta/signapply/detail/" + pk_signh + "/" + signTime + "/" + signstatus + "/" + signremark);
    },

    datefun(myDate) {
      var y = myDate.getFullYear();
      var m = myDate.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      //var d = myDate.getDate();  
      //d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m;
    },

  },

}
</script>

<style>
.attendlist {
  margin-top: 8px;
  background: #ffffff;
  padding: 16px;
  overflow: auto;
}
.attendwrap {
  height: 126px;
  background: #ffffff;
  border: 1px solid #f0f0f5;
  border-radius: 4px;
  margin-bottom: 16px;
  position: relative;
}
.attendwrap:hover {
  background: rgba(243, 246, 249, 0.5);
  border: 1px solid #f0f0f5;
  box-shadow: 0 2px 4px 0 #e2e8ef;
}
.attendtittle .el-input {
  width: 130px;
}
.attendLeft {
  float: left;
}
.attendRight {
  float: right;
}
.attendwrap .attendLeft .attendDate {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #75787b;
  line-height: 14px;
  margin-bottom: 14px;
  margin-left: 16px;
  margin-top: 16px;
}
.attendwrap .attendLeft .attendTime {
  font-family: PingFangSC-Regular;
  font-size: 36px;
  color: #2d2d2d;
  line-height: 36px;
  margin-left: 16px;
}
.attendRight {
  margin: 16px 16px 0px 0px;
}
.attendwrap .attendRight .status {
  width: 60px;
  height: 18px;
  background: #a6b7cb;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
  line-height: 18px;
}
.attendFoot .free .submit {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #75787b;
  line-height: 30px;
  outline: none;
}
.attendFoot .free .submit:hover,
.attendFoot .free .edit:hover {
  color: #0089fa;
}
.attendFoot .free .edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #75787b;
  line-height: 30px;
  outline: none;
}
.attendFoot .commit .callback {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #75787b;
  line-height: 30px;
  outline: none;
}
.attendFoot .commit .callback:hover {
  color: #0089fa;
}
.attendFoot i {
  position: relative;
  top: 3px;
}
.attendlist .nosign {
  width: 260px;
  margin: auto;
  text-align: center;
  margin-top: 120px;
  margin-bottom: 120px;
}
</style>