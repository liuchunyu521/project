define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					approvenum:'',
					msgnum:''
				}
			},
			created: function() {
				var _this=this;
				$.ajax({
			        type: "get",
			        dataType: "json",
			        url: '/hrss/setalter/countNoAudit?funcode=60420setalter',
			        success: function (res) {
			        	if(res.status==true){
			        		$("#employeeapprove_num").html(res.data.numberData);
			        		_this.approvenum=res.data.numberData;
			        	}else{
			        		_this.$message({
					          showClose: true,
					          message: res.msg,
					          type: 'error'
					        });
			        	}
			          
			        }
			    });
				
				$.ajax({
			        type: "get",
			        dataType: "json",
			        url: '/hrhi/psndoc/countWaitForZhuanZheng',
			        success: function (res) {
			        	if(res.status==true){
			        		$("#employeemsg_num").html(res.data.numberData);
			        		_this.msgnum=res.data.numberData;
			        	}else{
			        		_this.$message({
					          showClose: true,
					          message: res.msg,
					          type: 'error'
					        });
			        	}
			          
			        }
			    });
				
				
			},
			mounted:function() {
				var oThis = this;
				var getUrlParam = function () {
					var r=window.parent.vueInstance.$route.query.tilecode
					if (r != null) return r;
					return null;
				}
				var res=getUrlParam();
				
				$("#employeemsg_box").on("click",function(){//员工信息
					window.parent.location.hash='/hrhi/employee?funcode=60070employee&tilecode='+res;
//					window.vueInstance.$router.push('/hrhi/employee')
					
				});
				
				$(".employeemsg_middle_left").on("click",function(e){//自助审核信息
					e.stopPropagation(); 
					window.parent.location.hash='/hrss/setalter?funcode=60420setalter&tilecode='+res;
				});
				
				$(".employeemsg_bottom").on("click",function(e){//待转正
					e.stopPropagation(); 
					window.parent.location.hash='/hrhi/employee?funcode=60070employee&regular=N&tilecode='+res;
				});
			},
			methods: {
				
			}
		})
	}
	return {
		init: init
	}
});
