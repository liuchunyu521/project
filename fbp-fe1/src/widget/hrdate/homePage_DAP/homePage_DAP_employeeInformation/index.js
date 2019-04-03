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
				$("#homePage_DAP_employeeInformation_box").on("click",function(){
					if(res == "" || res == null){
						window.vueInstance.$router.push('/hrhi/psninfo?funcode=60070psninfo&tilecode=hrhi_psninfo');
					}else{
						window.vueInstance.$router.push('/hrhi/psninfo?funcode=60070psninfo&tilecode='+res);
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
