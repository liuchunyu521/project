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
                $("#myContract_box").on("click",function(e){//
                    e.stopPropagation();
                    if(res =="" || res == null){
                       window.vueInstance.$router.push('/hrss/mycontract?tilecode=hrss_mycontract')
                    }else{
                        window.vueInstance.$router.push('/hrss/mycontract?tilecode='+res)
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
