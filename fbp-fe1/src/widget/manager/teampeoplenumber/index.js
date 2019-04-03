define(['text!./index.html', 'css!./index.css','./echarts.min.js'], function(template,css,echarts) {
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
				var _this = this;
				/*this.$http({
					url: '',
					method: 'post',
				}).then(function(res){
					if(res.data.status == true) {
						
					} else {
						_this.$message({
							message: '数据请求失败',
							type: 'error'
						});
					}
				}).catch(function(res) {
					_this.$message({
						message: '数据请求失败',
						type: 'error'
					});
				});*/
				//charts开始
	           	var myChart = echarts.init(document.getElementById('teampeople'));
				myChart.setOption({
					color: ['#6FB4FF', '#FF6161'],
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					series: [{
						name: '团队人数',
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [
							{
								value: 15,
								name: '男性'
							},
							{
								value: 8,
								name: '女性'
							}
						]
					}]
				});
			    //charts结束
			},
			methods: {
				
			}
		})
	}
	return {
		init: init
	}
});