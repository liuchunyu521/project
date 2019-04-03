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
				$("#postSeriesstyle_box").on("click",function(){//岗位序列
					window.vueInstance.$router.push('/hrjf/postSeries?funcode=60050postSeries');
				});
				$(".postSeriesstyle_middle").on("click",function(e){//岗位序列新增
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/postSeries/postSeriesDetail?funcode=60050postSeries');
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
