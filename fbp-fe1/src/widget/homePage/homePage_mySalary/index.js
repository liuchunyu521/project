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
                $("#mySalary_box").on("click",function(e){//我的薪资
                    e.stopPropagation();
                    
                    if(res == "" || res == null){
                    	window.vueInstance.$context.getApp().openTile('hrss_myWage') // xxx为tilecode
                    }else{
						window.vueInstance.$router.push('/hrss/myWage')
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
