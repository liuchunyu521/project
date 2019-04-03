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
                $("#orgdepartmentstyle_box").on("click",function(){//部门信息
                    window.vueInstance.$router.push('/hrjf/hrDept?funcode=60050deptinfo');
                });
                
                $(".orgdepartmentstyle_middle").on("click",function(e){//部门信息新增
                	e.stopPropagation(); 
                   window.vueInstance.$router.push('/hrjf/hrDept/deptDetail?funcode=60050deptinfo');
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
