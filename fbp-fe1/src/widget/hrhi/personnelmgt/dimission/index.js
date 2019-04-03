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
				
				
			},
			mounted:function() {
				var oThis = this;
				var getUrlParam = function () {
					var r=window.parent.vueInstance.$route.query.tilecode
					if (r != null) return r;
					return null;
				}
				var res=getUrlParam();
				$("#employeleave_box").on("click",function(e){//离职申请
					e.stopPropagation(); 
					window.parent.location.hash='/hrtrn/transmgt/dimissionapply?funcode=60090dimissionapply&tilecode='+res;
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
