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
				$("#rank_box").on("click",function(){//职级类别
					window.vueInstance.$router.push('/hrjf/joblevelsys?funcode=60050joblevel');
				});
				$(".rank_middle").on("click",function(e){//新增
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/joblevelsys/jobLevelSysDetail?funcode=60050joblevel');
				})
			}
		};
    return {
        init: function (widgetid, content) {
            content.innerHTML = html;
            viewModel.Init();
        }
    }
});
