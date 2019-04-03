define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
	var viewModel={
			Init:function(){
				$.ajax({
			        type: "post",
			        dataType: "json",
			        url: '/hrss/psnInfo/getEnterOrgTime?funcode=60420myInfo',
			        success: function (res) {
			        	if(res.status==true){
			        		$(".SiLing_month").text(res.data.time)
			        	}else{
			        		alert(res.msg)
			        	}
			          
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
