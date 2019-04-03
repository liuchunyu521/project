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
				
//				$("#orgdepartmentstyle_box").on("click",function(){//职务
//					window.parent.location.hash='/hrjf/job?tilecode='+res;
//				});
//				$(".orgdepartmentstyle_middle").on("click",function(e){//职务新增
//					e.stopPropagation(); 
//					window.parent.location.hash='/hrjf/job/jobDetail?tilecode='+res;
//				});
//				$(".orgdepartmentstyle_bottom").on("click",function(e){//职务类别
//					e.stopPropagation(); 
//					window.parent.location.hash='/hrjf/jobType?tilecode='+res;
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
