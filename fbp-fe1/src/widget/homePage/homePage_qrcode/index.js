define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					QrcodedialogVisible: false
				}
			},
			created: function() {
			},
			mounted:function() {
				
			},
			methods: {
//				Qrcodedialog(){
//					this.QrcodedialogVisible=true;
//				}
			}
		})
	}
	return {
		init: init
	}
});