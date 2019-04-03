define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					animate:false,
					timeOut:'',
					instituData:[{
						tittle:'新员工入职手册',
						date:'2018-01-01'
					},
					{
						tittle:'2017年绩效考核政策',
						date:'2018-02-01'
					},{
						tittle:'社会保险及住房公积金',
						date:'2018-03-01'
					},{
						tittle:'劳动合同续签管理制度',
						date:'2018-04-01'
					},{
						tittle:'劳动合同续签管理制度',
						date:'2018-05-01'
					},{
						tittle:'薪资管理制度',
						date:'2018-05-01'
					},{
						tittle:'员工管理制度',
						date:'2018-05-01'
					}]
				}
			},
			created: function() {
//				var _this=this;
//				_this.timeOut=setInterval(_this.scroll,2000)
			},
			mounted:function() {
				
			},
			methods: {
				
//				scroll:function(){
//				  var _this=this;
//			      _this.animate=true;    // 因为在消息向left滚动的时候需要添加css3过渡动画，所以这里需要设置true
//			      setTimeout(function(){      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
//			               _this.instituData.push(_this.instituData[0]);  // 将数组的第一个元素添加到数组的
//			               _this.instituData.shift();               //删除数组的第一个元素
//			               _this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
//			       },500)
//			    },
//			    stoptimeinterval:function(){//停止滚动
//			    	var _this=this;
//			    	clearInterval(_this.timeOut);  
//			    },
//			    begintimeinterval:function(){//开启滚动
//			    	var _this=this;
//			    	_this.timeOut=setInterval(_this.scroll,2000);
//			    }
			}
		})
	}
	return {
		init: init
	}
});