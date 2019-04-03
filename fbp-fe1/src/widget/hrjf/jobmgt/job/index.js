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
				
				$("#position_information_box").on("click",function(){//职务
					window.vueInstance.$router.push('/hrjf/job?funcode=60050job');
				});
				$(".position_information_middle").on("click",function(e){//职务新增
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/job/jobDetail?funcode=60050job');
				});
				$(".position_information_bottom").on("click",function(e){//职务类别
					e.stopPropagation(); 
					window.vueInstance.$router.push('/hrjf/jobType?funcode=60050jobtype');
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
