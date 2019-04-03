define(['text!./index.html', 'css!./index.css'], function(template) {
	function init(id) {
		new Vue({
			el: '#' + id,
			template: template,
			data:function() {
				return {
					date : new Date(),
					nowYear : new Date().getFullYear(),
					nowMonth : new Date().getMonth() + 1,
					nowDay : new Date().getDate(),
					splitString : "-",
					weekDays : new Array("日", "一", "二", "三", "四", "五", "六"),
					dayTypeName:["","加","差","假","节"],
					dayTypeColor:["","#0089FA","#5856D6","#FF9500","#00A753"],
					checkYear : '',
					checkMonth : '',
                    checkDate:'',
					allShowDays :[],
					thisDayCount:'',//这个月有几天
					ThisWeekDayCounrt:"",//这个周有多少天
					lineHeight:"",//控制页面行高 避免空格难看
					allFindedDays:[],
                    hasFinded:false,
					errorMsg:'',
				}
			},
			computed:{
				selDate:function(){
					for(var i = 0; i < this.allShowDays.length; i++){
						var tempyear = this.allShowDays[i].year;
						var tempmonth = this.allShowDays[i].month;
						var tempdate = this.allShowDays[i].date;
						if(tempyear == this.checkYear && tempmonth == this.checkMonth && tempdate == this.checkDate){
							return this.allShowDays[i];
						}
					}
					return null;
                },
			},
			created: function() {
                this.checkYear= this.nowYear;
                this.checkMonth= this.nowMonth;
                this.checkDate=this.nowDay;
                this.show();
			},
			methods: {
				//刷新日历
				show:function(){
                    this.setAllShowDays();
                    this.setLineHeight();
                    if(!this.hasFinded){
                        //初始调用服务请求
                        this.requreData();
                    }else{
                        this.$forceUpdate();
					}
				},
				//设置显示数据
				setAllShowDays:function(){
                    this.allShowDays = new Array();
                    this.hasFinded = false;
					var basicDate = new Date(this.checkYear, this.checkMonth - 1, 1);
					var tempDate = new Date(basicDate);
                    this.ThisWeekDayCounrt = tempDate.getDay();
                    tempDate.setMonth(tempDate.getMonth() + 1);
                    tempDate.setDate(0);
                    this.thisDayCount = tempDate.getDate();
                    var beginDate = this.getBeginDate(basicDate);
                    var endDate = this.getEndDate(basicDate);
                    if(this.checkDate > this.thisDayCount){
                        this.checkDate = 1;
					}
                    while(beginDate <= endDate){
                        var item = new Object();
                        item.year = beginDate.getFullYear();
                        item.month = beginDate.getMonth() + 1;
                        item.date = beginDate.getDate();
                        item.day = beginDate.getDay();
                        item.currMonth = item.month == this.checkMonth;
                        this.allShowDays.push(item);
                        beginDate.setDate(beginDate.getDate() + 1);
                    }
                    //用中间日期来检查是否从服务器取过数据
                    var checkDate = new Date(this.checkYear, this.checkMonth - 1, 15);
                    var tempShowDays = new Array();
                    for(var i= 0; i < this.allFindedDays.length; i++){
                    	if(this.allFindedDays[i].year == checkDate.getFullYear() &&
							this.allFindedDays[i].month == checkDate.getMonth() + 1 &&
							this.allFindedDays[i].date == checkDate.getDate()){
                            this.hasFinded = true;
						}
					}
					if(this.hasFinded){
                        for(var i= 0; i < this.allFindedDays.length; i++){
                        	for(var j=0; j<this.allShowDays.length; j++){
                                if(this.allFindedDays[i].year == this.allShowDays[j].year &&
                                    this.allFindedDays[i].month == this.allShowDays[j].month &&
                                    this.allFindedDays[i].date == this.allShowDays[j].date){
                                    this.allShowDays[j].attend = this.allFindedDays[i].attend;
                                }
							}
                        }
					}
				},
				//设置日历的每行的高
				setLineHeight:function(){
                    var thisDayCount1=this.thisDayCount;
                    var ThisWeekDayCounrt1=this.ThisWeekDayCounrt;
                    if(ThisWeekDayCounrt1<5){
                        this.lineHeight = 52;
                    }else if(ThisWeekDayCounrt1 == 5 && thisDayCount1 <= 30){
                        this.lineHeight = 52;
                    }else if(ThisWeekDayCounrt1 == 5 && thisDayCount1 > 30){
                        this.lineHeight = 43;
                    }else if(ThisWeekDayCounrt1 > 5 && thisDayCount1 <= 29){
                        this.lineHeight = 52;
                    }else {
                        this.lineHeight = 43;
                    }
				},
				//计算的起始日期
				getBeginDate:function(date){
					var rtnDate = new Date(date);
                    rtnDate.setDate(1);
                    var day = rtnDate.getDay();
                    rtnDate.setDate(rtnDate.getDate()-day);
                    return rtnDate;
				},
				//计算的终止日期
				getEndDate:function(date){
                    var rtnDate = new Date(date);
                    rtnDate.setMonth(rtnDate.getMonth() + 1);
                    rtnDate.setDate(0);
                    var day = 6 - rtnDate.getDay();
                    rtnDate.setDate(rtnDate.getDate() + day);
                    return rtnDate;
				},
                //点击天根据数据渲染右侧的内容
				getdate:function(item){
					if(item.month != this.checkMonth || item.year != this.checkYear){
						return;
					}
					this.checkDate = item.date;
				},
                //返回今天 重新获取今天的数据渲染页面
				getThisDay:function () {
					debugger;
					if(this.checkYear == this.nowYear && this.checkMonth == this.nowMonth){
						this.checkDate = this.nowDay;
						return;
					}
                    this.checkYear= this.nowYear;
                    this.checkMonth= this.nowMonth;
                    this.checkDate=this.nowDay;
                    this.show();
				},
                //切换上一个月
				lastMonthClick:function () {
					if (this.checkMonth == 1) {
						this.checkYear = this.checkYear - 1;
						this.checkMonth = 12;
					} else {
						this.checkMonth = this.checkMonth - 1;
					}
                    this.show();
				},
                //切换下一个月
				nextMonthClick:function () {
					if (this.checkMonth == 12) {
						this.checkYear = this.checkYear + 1;
						this.checkMonth = 1;
					} else {
						this.checkMonth = this.checkMonth + 1;
					}
                    this.show();
				},
				//日期类型转换为字符串
				toNumDate:function(indate){
					var year = indate.getFullYear() + "";
					var month = indate.getMonth() + 1;
					if(month < 10){
                        month = "0"+ month;
					}
					var date = indate.getDate();
					if(date < 10){
						date = "0" + date;
					}
					return year + month + date;
				},
				//从服务器上查询数据
                requreData:function(){
                    var basicDate = new Date(this.checkYear, this.checkMonth - 1, 1);
                    var beginDate = this.toNumDate(this.getBeginDate(basicDate));
                    var endDate = this.toNumDate(this.getEndDate(basicDate));
                    var myself = this;
                    var url = "/hrta/calendar/queryAttendance?begindate=" + beginDate + "&enddate=" + endDate;
                    this.$http({
                        url: url,
                        method: 'get',
                    }).then(function(res){
                        if(res.data.status == true) {
                        	var data = res.data.data;
                        	for(var i = 0; i < data.length; i++){
                        		for(var j = 0; j < myself.allShowDays.length; j++){
                        			if(myself.allShowDays[j].month == data[i].date.substr(5,2) &&
                                        myself.allShowDays[j].date == data[i].date.substr(8,2)){
                                        myself.allShowDays[j].attend = data[i];
                                        break;
									}
								}
							}
                            for(var i = 0; i < myself.allShowDays.length; i++){
                                myself.allFindedDays.push(myself.allShowDays[i]);
                            }
                            myself.hasFinded = true;
                            myself.errorMsg = "";
							myself.$forceUpdate();
                        } else {
                            myself.errorMsg = res.data.msg;
                        }
                    }).catch(function(res) {
                        myself.errorMsg = "日历数据请求失败";
                    });
				},
				//右侧数据的top
				getSelDateTop:function(selDate){
					if(!selDate.attend){
                        return "40px";
					}
					var cnt = selDate.attend.value.length;
					if(cnt <= 2){
						return "40px";
					}else if(cnt <= 4){
                        return "10px";
                    }
					return "0px";
				}
			}
		});
	}
	return {
		init: init
	}
});