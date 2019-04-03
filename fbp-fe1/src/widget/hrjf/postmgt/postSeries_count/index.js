
define(['text!./index.html', 'css!./index.css','./echarts.min.js'], function(template,a,echarts) {
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
				var _this=this;
				var name=[];
				var nameData=[];
				var resData=[];
				$.ajax({
			        type: "get",
			        dataType: "json",
			        url: '/hrjf/postOVP/postSeriesPsnTotal',
			        success: function (res) {
			        	if(res.status==true){
			        		
			        		if(res.data.length>5){
			        			resData=res.data.slice(0,5);
			        			$(".postSeriesnum").text('5');
			        			$(".postSeriesnumsum").text(res.data.length);
			        			
			        		}else{
			        			resData=res.data;//赋值数据；
			        			$(".postSeriesmore").css({
			        				'display':"none"
			        			})
			        			if(res.data.length==0){
			        				$(".postSeriesnum").text('0');
			        				$(".postSeriesnumsum").text('0');
			        			}else {
			        				$(".postSeriesnum").text(res.data.length);
			        				$(".postSeriesnumsum").text(res.data.length);
			        			}
			        		}
			        		//条形图名称
			        		
			        		for(var i=0;i<resData.length;i++){
			        			name.push(resData[i].postSeriesName)
			        		}
			        		//条形图数据
			        		for(var i=0;i<resData.length;i++){
			        			nameData.push(resData[i].psndoctotal)
			        		}
			        		// 基于准备好的dom，初始化echarts实例
							var myChart = echarts.init(document.getElementById('postSeries_count_main'));
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
									    
//							            data: ['业务主管', '一级业务主管', '高级业务主管', '高级专家','总监']
							            data:name
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
					                        　　 	}
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
							            name: '岗位个数',
							            type: 'bar',
							            barGap: 0,
							            barWidth : 32,//柱图宽度
							            itemStyle: {
							                 normal: {
							                     label: {
							                         show: true,
							                         textStyle: {
							                             color: '#71B4FF'
							                         },
							                          position: 'top'
							                     }
							                 }
							             },
//							            data: [320, 332, 301, 334,234]
							            data: nameData
							        }
							    ]
							};
							 // 使用刚指定的配置项和数据显示图表。
			       			 myChart.setOption(option);
			       			 window.onresize = myChart.resize;//自适应屏幕
			        	}else{
			        		_this.$message({
					          showClose: true,
					          message: res.msg,
					          type: 'error'
					        });
			        	}
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