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
				$("#orgchartstyle_box").on("click",function(){//组织机构图
					window.vueInstance.$router.push('/hrjf/orgChart');
				});
				
			}
		};
    return {
        init: function (widgetid, content) {
            content.innerHTML = html;
            viewModel.Init();
        }
    }
});
