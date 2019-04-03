define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
    var Echarts=require('./echarts.min.js');

	var viewModel={
			Init:function(){
				// 基于准备好的dom，初始化echarts实例
        	var myChart = Echarts.init(document.getElementById('psndoc_structure_main'));
				var colors = ['#FF4012', '#71B4FF', '#675bba'];
				option = {
				    color: colors,
					title: {
				        text: '入离职趋势',
				        top:2,
				         x: 'center',
				         textStyle:{
					        //文字颜色
					        color:'#333333',
					        //字体大小
					　　　　 fontSize:14
					    }
				    },
				    tooltip: {
				        trigger: 'none',
				        axisPointer: {
				            type: 'cross'
				        }
				    },
				    legend: {
				    	top:5,
				    	right:20,
				        data:['入职', '离职']
				    },
				    grid: {
				        left: '10%',   //距离左边的距离
				        right: '10%', //距离右边的距离
				        bottom: '15%',//距离下边的距离
				        top: '15%' //距离上边的距离
			        }, 
				    xAxis: [
				    	
				        {	
				            type: 'category',
				            axisTick: {
				                alignWithLabel: false
				            },
				            axisPointer: {
				                label: {
				                    formatter: function (params) {
				                        return '降水量  ' + params.value
				                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
				                    }
				                }
				            },
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
				            data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
				            
				        },
				        {	
				        	show:false,
				            type: 'category',
				            axisTick: {
				                alignWithLabel: false
				            },
//				            axisLine: {
//				                onZero: false,
//				                lineStyle: {
//				                    color: colors[0]
//				                }
//				            },
				            axisPointer: {
				                label: {
				                    formatter: function (params) {
				                        return '降水量  ' + params.value
				                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
				                    }
				                }
				            },
				            splitLine:{  
		                        　　　　			show:false  
		                        　			}, 
		                    axisLine:{// x轴的颜色和宽度
	                            lineStyle:{
	                                color:'#EEEEEE',
	                                width:1,   //这里是坐标轴的宽度,可以去掉
	                            }
                        	},
				            data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
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
				    series: [
				        {
				            name:'入职',
				            type:'line',
				            xAxisIndex: 1,
				            smooth: true,
				            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				        },
				        {
				            name:'离职',
				            type:'line',
				            smooth: true,
				            data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
				        }
				    ]
				};
				 // 使用刚指定的配置项和数据显示图表。
       			 myChart.setOption(option);
//     			 window.onresize = myChart.resize;
				window.addEventListener('resize',function(){
					myChart.resize();
				})
			}
		};
    return {
        init: function (widgetid, content) {
            content.innerHTML = html;
            viewModel.Init();
        }
    }
});
