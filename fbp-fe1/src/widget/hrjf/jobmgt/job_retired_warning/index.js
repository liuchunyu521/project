define(['text!./index.html', 'css!./index.css','./echarts.min.js'], function(template,a,echarts) {
	function init(id) {
		// 基于准备好的dom，初始化echarts实例
		
		var option;
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
				var _this=this;
				var name1=[];
				var nameData1=[];
				var resData1=[];
				
				$.ajax({
			        type: "get",
			        dataType: "json",
			        url: '/hrjf/jobOVP/queryLevelPsndocTotal',
			        success: function (res) {
			        	if(res.status==true){
			        		if(res.data.length>6){
			        			resData1=res.data.slice(0,6);
			        			$(".retired_warningnum").text('6');
			        			$(".retired_warningnumsum").text(res.data.length);
			        		}else{
			        			resData1=res.data;
			        			$(".retired_warningmore").css({
			        				'display':"none"
			        			})
			        			if(res.data.length==0){
			        				$(".retired_warningsnum").text('0');
			        				$(".retired_warningnumsum").text('0');
			        			}else {
			        				$(".retired_warningsnum").text(res.data.length);
			        				$(".retired_warningnumsum").text(res.data.length);
			        			}
			        		}
			        		//条形图名称
			        		for(var i=0;i<resData1.length;i++){
			        			name1.push(resData1[i].levelname)
			        		}
			        		//条形图数据
			        		for(var i=0;i<resData1.length;i++){
			        			nameData1.push(resData1[i].psndoctotal)
			        		}
			        		var myChartLevel = echarts.init(document.getElementById('retired_main'));
							option = {
							    color: ['#71B4FF'],
							    tooltip: {
							        trigger: 'axis',
							        axisPointer: {
							            type: 'shadow'
							        }
							    },
							    legend: {
			//				        data: ['基层', '中层', '高层'],
			//				        x: 'right'
							    },
							    calculable: true,
							    xAxis: [
							        {
							            type: 'category',
							            axisTick: {show: false},
							            splitLine:{  
					                        　　　　	show:false  
					                        　　	},
					                    axisLine:{// x轴的颜色和宽度
				                            lineStyle:{
				                                color:'#EEEEEE',
				                                width:1,   //这里是坐标轴的宽度,可以去掉
				                            }
				                        },
				                        axisTick: {show: false},
							            data: name1
							        }
							    ],
							    yAxis: [
							        {
							            type: 'value',
							            axisLine: {show: false},//控制y轴线是否显示
							            axisTick: {show: false},
							            splitLine:{  
				                        　　　　		lineStyle: {
										        // 使用深浅的间隔色
										        color: ['#EEEEEE']
										    }
					                        　　 	},
							        }
							    ],
							     grid: {
							        left: '10%',   //距离左边的距离
							        right: '10%', //距离右边的距离
							        bottom: '10%',//距离下边的距离
							        top: '10%' //距离上边的距离
						        }, 
							    series: [
							        {	
							        	name:'职级人数',
							            type:'bar',
							            barWidth: 32,//柱图宽度
							            data: nameData1
							        }
							    ]
							};
							 // 使用刚指定的配置项和数据显示图表。
			       			 myChartLevel.setOption(option);
//			       			 window.onresize = myChartLevel.resize;//自适应屏幕
			        		window.addEventListener('resize',function(){
								myChartLevel.resize();
							})
			        	}else{
			        		_this.$message({
					          showClose: true,
					          message: res.msg,
					          type: 'error'
					        });
			        	}
			        }
				})
				
			},
			methods: {
				
			}
		})
	}
	return {
		init: init
	}
});