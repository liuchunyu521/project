define(['text!./index.html', 'jquery', 'css!./index.css'], function (template, $) {
    function init(id) {
        new Vue({
            el: '#' + id,
            template: template,
            data: function () {
                return {
                    value: '',
                    todoType: 'todo',
                    dialogVisible: false,
                    billtype: '',
                    billtypeName: '',
                    options: [{
                        value: 'todo',
                        label: '待办'
                    }, {
                        value: 'claim',
                        label: '待领'
                    }],
                    size: 0,
                    totalElements: 0,
                    totalPages: 0,
                    todoListValue: [],
                    task: '',
                    opinion: '',
                    time: '',
                    billTypeArr: [],
                    billTypeMap: {},
                    runType: '',
                    billtypeClick: true,
                    more: true,
                    newEmps: false,//图片
                    durationTime: new Date().getTime() - 1000 * 60 * 12,
                    // formatDuration: null
                };
            },
            methods: {
                /**
                 * 日期转换方法
                 * */

                // MillisecondToDate: function (msd,timeGO) {
                //     console.log("距离现在的时间差="+msd);
                //     console.log("单据时间="+timeGO);
                //      var time = parseFloat(msd) / 1000;//得到秒数
                //     console.log("time="+time);
                //     if (time != null && time != "" ) {
                //         if(time < 60 ){
                //             time = parseInt(time) + "秒前";
                //         }else if (time > 60 && time < 60 * 60) {//一分钟~一小时
                //             time = parseInt(time / 60.0) + "分钟前";
                //         }
                //         else if (time >= 60 * 60 && time < 60 * 60 * 24) {//一小时~一天
                //             time = parseInt(time / 3600.0) + "小时前";
                //         }
                //         else if (time >= 60 * 60 * 24 && time <= 60 * 60 * 24 * 7) {//一天~一周
                //             var week = timeGO.getDay(); //周几
                //             if(week == 1){
                //                 weeks = "一";
                //             }else if(week == 2){
                //                 weeks = "二";
                //             }else if(week == 3){
                //                 weeks = "三";
                //             }else if(week == 4){
                //                 weeks = "四";
                //             }else if(week == 5){
                //                 weeks = "五";
                //             }else if(week == 6){
                //                 weeks = "六";
                //             }else if(week == 0){
                //                 weeks = "日";
                //             }
                //                 var getHours = timeGO.getHours();
                //             if(getHours < 10 ){ getHours = "0" + getHours }
                //                 var getMinutes = timeGO.getMinutes();
                //             if(getMinutes < 10 ){ getMinutes = "0" + getMinutes }
                //                 time = "周"+ weeks + " "+ getHours + ":" + getMinutes;
                //         }else if(time > 60 * 60 * 24 * 7){//大于一周
                //             time = timeGO.getFullYear() + "/" + (timeGO.getMonth()+1) + "/" + timeGO.getDate();
                //         }
                //         return time
                //     }
                // },
                /**
                 * 事项列表数据
                 * */
                getData: function () {
                    var self = this;
                    self.$http({
                        method: 'get',
                        url: '/hrpub/myBill/pageList/widget?pn=1&ps=3&billtype=' + this.billtype//OK
                    }).then(function (res) {
                        self.todoListValue = [];
//                      console.log("输出数据res=" + JSON.stringify(res));
                        if (res.data.status === true) {
                            if (res.data.data) {//有数据
                                if (res.data.data.content && res.data.data.content.length) {//有数据
                                    var vm = res.data.data.content;//数组数据
                                    self.billTypeMap = res.data.addresultMap.billTypeMap;//人员类型
                                    // console.log("self.billTypeMap="+JSON.stringify(self.billTypeMap));
                                    vm.forEach(function (v, i) {
                                        vm[i].billtypeName = res.data.addresultMap.billTypeMap[vm[i].billtype];//清单类型
//                                      console.log("vm[i].billdate=" + vm[i].billdate);
                                        vm[i].time = self.$traceBackRender(vm[i].billdate);

                                        // var billdate = new Date(vm[i].billdate);//单据时间
                                        // var myDate = new Date();//当前时间戳
                                        // var difference =  myDate.getTime() - billdate.getTime();
                                        // // vm[i].time = self.MillisecondToDate(difference , billdate);//得到毫秒
                                        self.billTypeArr.push(vm[i].billtype);
                                        self.todoListValue.push(vm[i]);
                                    });

                                }
                            }
                            if (res.data.data) {//有数据
//                              console.log("res.data.data=" + JSON.stringify(res.data.data));
                                if (res.data.data.content && res.data.data.content.length) {
                                    // if(res.data.data.totalElements<res.data.data.size ){ //不展示更多
                                    //     self.more = false;
                                    // }
                                    self.size = res.data.data.content.length > 0 ? res.data.data.content.length : 0;
                                } else {
                                    self.size = res.data.data.size > 0 ? res.data.data.size : 0;
                                }
                            } 
                            if(res.data.data == null){//没数据
//                              self.size = res.data.data.size > 0 ? res.data.data.size : 0;
                                self.more = false;//不展示更多 
                                self.newEmps = true
                            }
                            
                            if(res.data.data != null){
                            	self.totalPages = res.data.data.totalPages > 0 ? res.data.data.totalPages : 0
                            	self.totalElements = res.data.data.totalElements > 0 ? res.data.data.totalElements : 0	
                            }
                            
                        }
                    });
                },
                search: function (item, index) {
                    if (this.billtypeClick === true) {
                        this.billtype = item;
                        this.getData();
                        var span = document.querySelectorAll('.billtype span');
                        $('.billtype span').removeClass('active');
                        $(span[index]).addClass('active');
                        this.billtypeClick = false;
                    } else {
                        this.billtype = "";
                        this.getData();
                        this.billtypeClick = true;
                    }
                },
                /**
                 * 按钮操作
                 * @param action
                 * @url: /hrss/myBill/doAction
                 * */
                jumpMore: function () {//更多

                    //        window.vueInstance.$context.getApp().allList.push({path:'/hrpub/myBillsCenter?funcode=60420myBill',label:'我的单据',code:'hrss_myBill'});
                    //        window.vueInstance.$context.getApp().openTile('hrss_myBill');

                    window.vueInstance.$context.getApp().openTile({ name: '我的单据', path: '/hrpub/myBillsCenter?funcode=60420myBill', tilecode: 'hrss_myBill' });
                },

                showDetail: function (billType, billId) {//详情
                    //alert("详情billType="+billType + "billId="+billId);
                    var weburl = "";
                    this.$http({
                        method: "get",
                        url: '/hrpub/myBill/getWebUrl?billType=' + billType + '&billId=' + billId //单据主键 单据类型
                    }).then(function (res) {

                        //箭头函数this 指向？
                        if (res.data.status === true) {
                            weburl = res.data.data;
                            if (weburl === "") {
                                this.$message({
                                    message: "地址为空",
                                    type: "error"
                                });
                            } else {
                                // window.open(weburl);
                                window.top.vueInstance.$children[0].$router.push(weburl);//修改跳页 提交和收回提示
                            }
                        }
                    }).catch(function (res) {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
                },
                
                // 修改跳转
                edit: function (billType, billId) {
                    event.stopPropagation();
                    var weburl = "";
                    //alert("进入修改billType="+billType + "billId="+billId);
                    this.$http({
                        method: "get",
                        url: '/hrpub/myBill/getModifyURL?billType=' + billType + '&billId=' + billId //单据主键 单据类型
                    }).then(function (res) {//箭头函数this 指向？
                        if (res.data.status === true) {
                            weburl = res.data.data;
                            if (weburl === "") {
                                this.$message({
                                    message: "修改跳转地址未返回",
                                    type: "error"
                                });
                            } else {
                                // window.open(weburl);
                                window.top.vueInstance.$children[0].$router.push(weburl);//修改跳页 提交和收回提示
                            }
                        }
                    }).catch(function (res) {
                        this.$message({
                            message: "修改失败",
                            type: "error"
                        });
                    });
                },

                // 提交
                submit: function (billType, billId) {
                    var self = this;
                    event.stopPropagation();
                    //alert("提交billType="+billType + "billId="+billId);
                    this.$http({
                        method: "get",
                        url: '/hrpub/myBill/dealSubmitAct?' + 'billType=' + billType + '&billId=' + billId //单据主键 单据类型
                    }).then(function (res) {//箭头函数this 指向？
                        if (res.data.status === true) {
                            self.getData();
                            self.$message({
                                message: "提交成功",
                                type: "success"
                            });
                        } else {
                            self.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    }).catch(function (res) {
                        self.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    });
                },

                // 收回
                callback: function (billType, billId) {
                    var self = this;
                    event.stopPropagation();
                    // alert("收回billType="+billType + "billId="+billId);
                    var obj = {};
                    obj.param_note = 'recall';
                    var param = JSON.stringify(obj);
                    this.$http({
                        url: '/riart/fbpworkflows/doAction',
                        method: 'post',
                        data: {
                            action: 'recall',
                            param: param,
                            billType: billType,
                            billId: billId,
                            pk_checkflow: '',
                            agentuserId: ''
                        },
                        // url: '/riart/fbpworkflows/doAction' //单据主键 单据类型
                    }).then(function (res) {//箭头函数this 指向？
                        if (res.data.status === true) {
                            self.getData();
                            self.$message({
                                message: "收回成功",
                                type: "success"
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    }).catch(function (res) {
                        self.$message({
                            message: "收回失败",
                            type: "error"
                        });
                    });
                },

                change: function (item) { //下拉框
                    var self = this;
                    self.$http({
                        method: 'get',
                        url: '/hrpub/myBill/pageList/widget?pn=1&ps=3&billtype=' + item//OK
                    }).then(function (res) {
                        self.todoListValue = [];
//                      console.log("输出数据res=" + JSON.stringify(res));
                        if (res.data.status === true) {
                            if (res.data.data) {//有数据
                                if (res.data.data.content && res.data.data.content.length) {//有数据
                                    var vm = res.data.data.content;//数组数据
                                    // self.time = self.MillisecondToDate(new Date() - new Date(vm[0].dealtime));

//                                  console.log("self.billTypeMap=" + JSON.stringify(self.billTypeMap));
                                    vm.forEach(function (v, i) {
                                        vm[i].billtypeName = res.data.addresultMap.billTypeMap[vm[i].billtype];//清单类型
                                        console.log("vm[i].billdate=" + vm[i].billdate);
                                        vm[i].time = self.$traceBackRender(vm[i].billdate);
                                        // var billdate = new Date(vm[i].billdate);//单据时间
                                        // var myDate = new Date();//获取当前时间戳
                                        // console.log("myDate="+myDate);
                                        // var difference =  myDate.getTime() - billdate.getTime();
                                        // // vm[i].time = self.MillisecondToDate(difference , billdate);//得到毫秒
                                        self.billTypeArr.push(vm[i].billtype);
                                        self.todoListValue.push(vm[i]);
                                    });
                                   // console.log("self.billTypeMap111=" + JSON.stringify(self.billTypeMap));
                                   // console.log("self.billTypeArr111=" + JSON.stringify(self.billTypeArr));
                                }
                            }

                            if (res.data.data) {//有数据
//                              console.log("res.data.data=" + JSON.stringify(res.data.data));
                                if (res.data.data.content && res.data.data.content.length) {
                                    self.size = res.data.data.content.length > 0 ? res.data.data.content.length : 0;
                                } else {
                                    self.size = res.data.data.size > 0 ? res.data.data.size : 0;
                                }
                            } else {//没数据
                                self.size = res.data.data.size > 0 ? res.data.data.size : 0;
                                self.more = false;//不展示更多
                                self.newEmps = true
                            }
                            if(res.data.data != null){
                            	self.totalPages = res.data.data.totalPages > 0 ? res.data.data.totalPages : 0
                            	self.totalElements = res.data.data.totalElements > 0 ? res.data.data.totalElements : 0	
                            }
                            
                        }
                    });



                }//change结束

            },

            created: function () {
                this.getData();
            }

        });
    }

    return {
        init: init
    }
});
