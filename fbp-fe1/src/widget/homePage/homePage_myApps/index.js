define(['text!./index.html', 'css!./index.css','css!./fonts/iconfont.css','./vuedrag.js'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					dialogVisible: false
				}
			},
			created: function() {
			},
			mounted:function() {
				
			},
			methods: {
				addmyApp:function(){
					//添加新的应用
//					this.dialogVisible=true;
					
				},
				getUrlParam:function(){
					var r=window.parent.vueInstance.$route.query.tilecode
						if (r != null) return r;
						return null;
				},
				salaryhref:function(){
					var res=this.getUrlParam();
					window.parent.location.hash='/hrss/myWage?tilecode='+'myWage';
				},
				geshuihref:function(){
					var res=this.getUrlParam();
					window.parent.location.hash='/hrss/taxReport?tilecode='+'taxReport';
				}
			}
		})
	}
	return {
		init: init
	}
});