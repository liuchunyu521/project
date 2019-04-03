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
				$("#orgstyle_box").on("click",function(){//组织信息
					window.vueInstance.$router.push('/hrjf/hrOrg?funcode=60050orginfo');
				});
				$(".orgstyle_middle").on("click",function(e){//组织新增
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/hrOrg/orgsDetails?funcode=60050orginfo');
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
