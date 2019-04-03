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
				
				$("#jobbrank_box").on("click",function(){//职等
					window.vueInstance.$router.push('/hrjf/jobRank?funcode=60050jobrank');
				});
				$(".jobbrank_middle").on("click",function(e){//职等新增
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/jobRank/jobRankDetail?funcode=60050jobrank');
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
