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
                $("#myTax_box").on("click",function(e){//
                    e.stopPropagation();
//                  if(res == "" || res == null){
//                      window.parent.location.hash='/hrss/taxReport?tilecode=hrss_taxReport';
//                  }else{
//                      window.parent.location.hash='/hrss/taxReport?tilecode='+res;
//                  }
					
					if(res == "" || res == null){
                    	window.vueInstance.$context.getApp().openTile('hrss_taxReport') // xxx为tilecode
                    }else{
						window.vueInstance.$router.push('/hrss/taxReport')
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
