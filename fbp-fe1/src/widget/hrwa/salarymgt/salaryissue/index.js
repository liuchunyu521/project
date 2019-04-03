define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
	var viewModel={
			Init:function(){
				var getUrlParam = function () {
					var r=window.parent.vueInstance.$route.query.tilecode
					if (r != null) return r;
					return null;
				}
				var res=getUrlParam();
				
				$("#salaryissue_box").on("click",function(){//薪资核算
					window.parent.location.hash='/hrwa/paydata/waClassListInfo?funcode=60130paydata&tilecode='+res;
				});
				
//				new Vue({
//				  	el: '#salaryissue_box',
//				    data() {
//				      return {
//				        date: new Date()
//				      }
//				    },
//				    methods:{
//				    	
//				    },
//			    
//			  	})
			}
		};
    return {
        init: function (widgetid, content) {
            content.innerHTML = html;
            viewModel.Init();
        }
    }
});
