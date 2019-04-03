define(function (require, exports, module) {

    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    var styles = require('css!./index.css');
    var Echarts=require('./echarts.min.js');

	var viewModel={
			Init:function(){
				new Vue({
				  	el: '#pay_structureapp',
				    data() {
				      return {
				        date: new Date()
				      }
				    },
				    methods:{
				    	
				    },
			    
			  	})
		   
			  // 基于准备好的dom，初始化echarts实例
	        	var myChart = Echarts.init(document.getElementById('pay_structuremain'));
				option = {
					color: ['#71B4FF'],
				    title: {
				        //text: '单位(万)',
				        x:'left',
				        textStyle:{
					        //文字颜色
					        color:'#333333',
					        //字体大小
					　　　　 fontSize:14
					
					    }
				    },
				    tooltip: {
				    	trigger: 'axis',
					        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					        }
				    },
				    legend: {
//				        data:['历年用工总量']
				    },
				    xAxis: {
				        data: ["管理序列","营销序列","操作序列","专业序列","其他序列"],
				        splitLine:{  
		                        　　　　show:false  
		                        　 },
		                axisLine:{// x轴的颜色和宽度
                            lineStyle:{
                                color:'#EEEEEE',
                                width:1,   //这里是坐标轴的宽度,可以去掉
                            }
                        },
                        axisTick: {show: false}
				    },
				    yAxis: {
				    	axisLine: {show: false},//控制y轴线是否显示
						axisTick: {show: false},
						splitLine:{  
                        　　　　		lineStyle: {
						        // 使用深浅的间隔色
						        color: ['#EEEEEE']
						    }
	                        　　 	},
						
				    },
				    grid: {
				        left: '8%',   //距离左边的距离
				        right: '3%', //距离右边的距离
				        bottom: '20%',//距离下边的距离
				        top: '5%' //距离上边的距离
			        },
				    series: [{
				        name: '工资结构',
				        type: 'bar',
				        barWidth : 30,//柱图宽度
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
				        data: [220, 330, 412, 460, 330]
				    }]
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
