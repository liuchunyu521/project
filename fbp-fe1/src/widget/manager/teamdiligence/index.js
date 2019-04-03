define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					workdata:[],
					details:''
				}
			},
			created: function() {

			},
			mounted:function() {
				var _this = this;
				this.$http({
					url: '/hrss/hrtaqfb/queryWorkLength',
					method: 'post',
				}).then(function(res) {
					if(res.data.status == true) {
						if(res.data.data=='' || res.data.data==null){
							_this.details='只有主管才有权限查看勤奋榜'
						}else {
							_this.workdata=res.data.data;
						}
					} else {
						
					}
				}).catch(function(res){
					_this.$message({
						message: res,
						type: 'error'
					});
				});
			},
			methods: {
				errorLoadImg: function(index) {
					
					var imgsrc=document.getElementsByClassName('imgSRC')[index];
					imgsrc.src='';
					imgsrc.src='../i_hr/ifbp_hr/widget/manager/teamdiligence/img/peple.png'
					if(index=='2' || index=='1'){
						imgsrc.style.width='48px';
						imgsrc.style.height='48px';
						imgsrc.style.marginTop='0px';
						imgsrc.style.marginLeft='0px';
					}else if(index=='0' ){
						imgsrc.style.width='72px';
						imgsrc.style.height='72px';
						imgsrc.style.marginTop='0px';
						imgsrc.style.marginLeft='0px';
					}else {
						imgsrc.style.width='40px';
						imgsrc.style.height='40px';
						imgsrc.style.marginTop='0px';
						imgsrc.style.marginLeft='0px';
					}
					
				}
			}
		})
	}
	return {
		init: init
	}
});