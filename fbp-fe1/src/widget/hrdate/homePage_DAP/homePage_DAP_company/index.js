define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
		
				}
			},
			created: function() {
				var myDate = new Date();
				y = myDate.getFullYear();
				m = myDate.getMonth();
				if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
					d = 1;
				}else if(m==4||m==6||m==9||m==11){
					d = 30;
				}else{
					d = 28;
				}
				lasttime = y+'年'+m+'月'+d+'日';
				/*var _this = this;
				$.ajax({
					type:"get",
					dataType:"json",
					url:"",
					success:function(res){
						if(res.status==true){
			        		
			        	}else{
			        		_this.$message({
					          showClose: true,
					          message: res.msg,
					          type: 'error'
					        });
			        	}
					}
				})*/
			},
			mounted: function() {
				
			},
			methods: {
			}
		})
	}
	return {
		init: init
	}
});