define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
	var viewModel={
			Init:function(){
//				$(".job_level_top").on("click",function(){//职等
//					window.parent.location.hash='/hrjf/jobRank';
//				});
//				$(".job_level_middle").on("click",function(){//职等新增
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
