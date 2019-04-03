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
                $("#myBecome_box").on("click",function(e){//调动申请
                    e.stopPropagation();
                    if(res == "" || res==null){
                        window.vueInstance.$router.push('/hrss/myRegApply?funcode=60420regularApply&tilecode=myRegApply')
                    }else{
                        window.vueInstance.$router.push('/hrss/myRegApply?funcode=60420regularApply&tilecode='+res)
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
