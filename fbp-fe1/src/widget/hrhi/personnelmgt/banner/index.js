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