define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
	var viewModel={
			Init:function(){
				$.ajax({
			        type: "get",
			        dataType: "json",
			        url: '/hrhi/psndoc/countNotIntoDoc',
			        success: function (res) {
			        	if(res.status==true){
			        		$("#employetraining_num").html(res.data.numberData)
			        	}else{
			        		alert('员工入职转档数量获取异常')
			        	}
			          
			        }
			    });
				
				var getUrlParam = function () {
					var r=window.parent.vueInstance.$route.query.tilecode
					if (r != null) return r;
					return null;
				}
				var res=getUrlParam();
				$("#employetraining_box").on("click",function(){//员工入职
					window.parent.location.hash='/hrhi/register?funcode=60070register&tilecode='+res;
				});
//				$(".employetraining_middle").on("click",function(){//员工转档
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
