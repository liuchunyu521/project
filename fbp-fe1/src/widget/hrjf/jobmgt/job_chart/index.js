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
				
				$("#position_map_box").on("click",function(e){//职务图谱
					e.stopPropagation();
					if(res == "" || res == null){
                    	window.vueInstance.$context.getApp().openTile('hrdata_jobChart') // xxx为tilecode
                    }else{
						window.vueInstance.$router.push('/hrjf/jobChart/jobChartInfo')
                    }
					
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
