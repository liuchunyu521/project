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
				$("#homePage_DAP_humanCost_box").on("click",function(){
					window.parent.location.hash='/dap/statements?funcode=60630wa002&tilecode='+res;
				});
//				$(".homePage_DAP_humanCost_middle").on("click",function(){//员工转档
//					window.parent.location.hash='/hrjf/jobRankDetail';
//				});
			}
		};
    return {
        init: function (widgetid, content) {
            content.innerHTML = html;
            viewModel.Init();
        }
    }
});
