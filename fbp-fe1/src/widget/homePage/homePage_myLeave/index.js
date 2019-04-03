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
                $("#myLeave_box").on("click",function(e){//
                    e.stopPropagation();
                    if(res =="" || res == null){
                        window.vueInstance.$router.push('/hrss/myDimissionApply?funcode=60420dimissionApply&tilecode=myDimissionApply')
                    }else{
                       window.vueInstance.$router.push('/hrss/myDimissionApply?funcode=60420dimissionApply&tilecode='+res)
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
