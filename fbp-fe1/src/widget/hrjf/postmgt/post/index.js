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
				$("#poststyle_box").on("click",function(){//岗位信息
					window.vueInstance.$router.push('/hrjf/post?funcode=60050post')
				});
				$(".poststyle_middle").on("click",function(e){//岗位新增
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/post/postDetail?funcode=60050post');
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
