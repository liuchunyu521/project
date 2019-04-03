define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					newEmps:[],
					imgPathdata:[],
					num:''
				}
			},
			created: function() {
				
			},
			mounted:function() {
				var _this = this;
				this.$http({
					url: '/hrhi/psndoc/listNewEmps',
					method: 'post',
				}).then(function(res){
					if(res.data.status == true) {
						if(res.data.data && res.data.data.newEmps){
							var _DATA=[];
							_this.num=res.data.data.newEmps.length;
							if(res.data.data.newEmps.length>3){
			        			_DATA=res.data.data.newEmps.slice(0,3);
			        			_this.newEmps=res.data.data.newEmps.slice(0,3);
			        			
			        		}else{
			        			_DATA=res.data.data.newEmps;
			        			_this.newEmps=res.data.data.newEmps;
			        		}
			        		for(var i=0;i<_DATA.length;i++){
			        			_this.imgPathdata.push({
			        				imgPath:'/hrhi/psndoc/getPhotoByPK?pk_psndoc='+_DATA[i].pk_psndoc
			        			})
			        		}
						}else {//还需要改进
//							_this.$message({
//								message: res.data.msg,
//								type: 'error'
//							});
						}
					} else {
						_this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch(function(res){
					_this.$message({
						message: res,
						type: 'error'
					});
				});
			},
			methods: {
				errorLoadImg: function(index) {
					var _this = this;
					_this.imgPathdata[index].imgPath = '../i_hr/ifbp_hr/widget/hrhi/personnelmgt/newEmp/img/peple.png'
				}
			}
		})
	}
	return {
		init: init
	}
});