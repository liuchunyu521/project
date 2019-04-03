define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
    var Echarts=require('./echarts.min.js');

	var viewModel={
			Init:function(){
				new Vue({
			  	el: '#pay_sumapp',
			    data() {
			      return {
			        date: new Date()
			      }
			    },
			    methods:{
			    	
			    },
			    
			  	})
			   
			  // 基于准备好的dom，初始化echarts实例
	        	var myChart = Echarts.init(document.getElementById('pay_summain'));
					option = {
					    title: {
					       // text: '折线图堆叠'
					    },
					    tooltip: {
					        trigger: 'axis'
					    },
					    legend: {
					       
					    },
					    toolbox: {
					        //feature: {
					            //saveAsImage: {}
					        //}
					    },
					    xAxis: {
					    	splitLine:{show: false},//去除网格线
					        type: 'category',
					        boundaryGap: false,
					        axisLine:{// x轴的颜色和宽度
	                            lineStyle:{
	                                color:'#EEEEEE',
	                                width:1,   //这里是坐标轴的宽度,可以去掉
	                            }
	                        },
	                        axisTick: {show: false},
					        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
					    },
					    yAxis: {
					        type: 'value',
					        axisLine: {show: false},//控制y轴线是否显示
							axisTick: {show: false},
							splitLine:{  
	                        　　　　		lineStyle: {
							        // 使用深浅的间隔色
							        color: ['#EEEEEE']
							    }
		                        　　 	}
					    },
					    grid: {
					        left: '10%',   //距离左边的距离
					        right: '3%', //距离右边的距离
					        bottom: '20%',//距离下边的距离
					        top: '5%' //距离上边的距离
				        },
					    series: [
					       
					        {
					           // name:'搜索引擎',
					            type:'line',
					            stack: '总量',
					            itemStyle : {  
                                normal : { 
                                		color:'#F9423A',
	                                    lineStyle:{  
	                                        color:'#F9423A'  
	                                    }  
                                	}  
                            	},
					            data:[820, 932, 901, 934, 1290, 1330, 10320,790,1200,560,666,777]
					        }
					    ]
					};
				 // 使用刚指定的配置项和数据显示图表。
       			 myChart.setOption(option);
       			 window.onresize = myChart.resize;
			}
		};
    return {
        init: function (widgetid, content) {
            content.innerHTML = html;
            viewModel.Init();
        }
    }
});
