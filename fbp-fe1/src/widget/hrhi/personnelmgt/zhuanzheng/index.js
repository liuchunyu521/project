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
				$("#employeformal_box").on("click",function(e){//转正申请
					e.stopPropagation(); 
					window.parent.location.hash='/hrtrn/regapply/regmng?funcode=60090regapply&tilecode='+res;
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
