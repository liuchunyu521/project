define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					imgPath: '',
					percentage: '',
					widthData: '',
					name: '',
					postName: '',
					deptName: '',
					show:true,
					showmsg:''
				}
			},
			created: function() {

			},
			mounted:function() {
				var _this = this;
				this.$http({
					url: '/hrss/psnInfo/getSimpleInfo?funcode=60420myInfo',
					method: 'post',
				}).then(function(res) {
					if(res.data.status == true) {
						_this.show=true;
						_this.postName = res.data.data.postName;
						_this.deptName = res.data.data.deptName;
						_this.imgPath = '/hrhi/psndoc/getPhotoByPK?pk_psndoc=' + res.data.data.pk_psndoc;
						_this.name = res.data.data.name;
						r1 = res.data.data.profile_cmplt_ptg;
						_this.widthData = r1;
						_this.percentage = r1 + "%";

						var getUrlParam = function() {
							var r = window.parent.vueInstance.$route.query.tilecode
							if(r != null) return r;
							return null;
						}
						var res = getUrlParam();

						$(".perfect").on("click", function() { //员工信息
							window.vueInstance.$router.push('/hrss/myInfo?funcode=60420myInfo&tilecode=' + res);
						});
					} else {
						_this.show=false;
						_this.showmsg=res.data.msg;
//						_this.$message({
//							message: res.data.msg,
//							type: 'error'
//						});
					}
				}).catch(function(res){
					_this.$message({
						message: res,
						type: 'error'
					});
				});
			},
			methods: {
				errorLoadImg: function() {
					this.imgPath = '../i_hr/ifbp_hr/widget/homePage/homePage_material/img/peple.png'
				}
			}
		})
	}
	return {
		init: init
	}
});