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
                $("#teamot").on("click",function(e){//
                    e.stopPropagation();
					if(res == "" || res == null){
                    	window.vueInstance.$context.getApp().openTile('hrss_teamovertime') // xxx为tilecode
                    }else{
						window.vueInstance.$router.push('/hrss/ta/otapply/list?funcode=60420otapply')
                    }
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
