define(['text!./index.html', 'css!./index.css'], function(template) {
    function init(id) {
        new Vue({
            el: '#' + id,
            template: template,
            data:function() {
                return {

                }
            },
            created: function() {
                
            },
            mounted:function() {
                var oThis = this;
                var getUrlParam = function () {
                    var r=window.parent.vueInstance.$route.query.tilecode
                    if (r != null) return r;
                    return null;
                }
                var res=getUrlParam();
                $("#teamsalaryfiles").on("click",function(e){//
                    e.stopPropagation();
					alert("开发中")
//					if(res == "" || res == null){
//                  	window.vueInstance.$context.getApp().openTile('hrss_payarchives') // xxx为tilecode
//                  }else{
//						window.vueInstance.$router.push('payarchives')
//                  }
                });
            },
            methods: {

            }
        })
    }
    return {
        init: init
    }
});
