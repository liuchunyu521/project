define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					input2: '',
					//recentQuery = []
				}
			},
			created: function() {
				
			},
			mounted: function() {
				/*var _this = this;
				var params = this.$refs.input.value;
				this.$http({
					url:"",
					method: 'post',
					params:params
				}).then(function(res){
					if(res.data.status == true) {
						var getUrlParam = function () {
							var r=window.parent.vueInstance.$route.query.tilecode
							if (r != null) return r;
							return null;
						}
						var res=getUrlParam();
						window.parent.location.hash='/dap/statements?funcode=60630psn01&tilecode='+res;
				}).catch(function(res){
					_this.$message({
						message: res,
						type: 'error'
					});
				});
			})*/
			},
			methods: {
				handleIconClick(ev) {
	      			//alert(this.$refs.input.value);
	    		}
			}
		})
	}
	return {
		init: init
	}
});