<!--
  作者：pengcb
  时间：2018-08-15
  支持：假期查询
-->
<template>
    <ifbp-page>
        <ifbp-button-area :no-breadcrumb="true">
            <!--<p class="leaveP">假期查询：</p>-->
            <!--<span class="leaveTime" >-->
              <!--<el-date-picker-->
                      <!--v-model="valueY"-->
                      <!--type="year"-->
                      <!--placeholder="选择年"-->
                      <!--@change="handleChange">-->
              <!--</el-date-picker>-->
             <!--</span>-->

            <div class="fl">
                <el-date-picker
                        id="rangeDateLeave"
                        v-model="valueY"
                        class="range_date"
                        type="year"
                        :clearable="false"
                        placeholder="选择年"
                        style="width: 80px;"
                        :show-icon="true"
                        @change="handleChange">
                </el-date-picker>
            </div>



        </ifbp-button-area>

        <ifbp-main-area type="list">
            <div class="leave-main">
                <el-row :gutter="16">
                    <el-col :xs="24" :sm="12" :md="8" :lg="6" :key="datavalue"  v-for="(datavalue,index) in date">
                        <div class="grid-content colDiv" @click="goIn(index)">
                            <p class="colCanvasP">
                                <span style="color:#00C297">{{parseInt(datavalue.yidayorhour)}}/</span><span style="color:#2D2D2D">{{parseInt(datavalue.alldayhour)}}</span>
                            </p>
                            <span class="colTime" v-if="datavalue.periodflag" @click="pre" style="margin-right: 0;margin-left: 0;">
								              <el-date-picker
                                                      v-model="mouthObj[index]"
                                                      type="month"
                                                      :monthonly="true"
                                                      @change="changeHandler($event,index)"
                                                      placeholder="选择月">
								              </el-date-picker>
                                <!--@change="(value) => changeHandler(value, index)"-->
							              </span>
                            <div class="colTitle">
                                <span>{{datavalue.timeitemname}}</span>
                            </div>
                            <div :id="getId(index)" class="colCanvas"></div>
                            <div class="colDate">
                                <p v-if="datavalue.timeitemunit == '0'">
                                    已休{{parseInt(datavalue.yidayorhour)}}天
                                    <span v-if="datavalue.timeitemunit == '0' && datavalue.issyshowflag">，剩余{{parseInt(datavalue.sydayorhour)}}天</span>
                                </p>
                                <p v-if="datavalue.timeitemunit == '1'">
                                    已休{{parseInt(datavalue.yidayorhour)}}小时
                                    <span v-if="datavalue.timeitemunit == '1' && datavalue.issyshowflag">，剩余{{parseInt(datavalue.sydayorhour)}}小时</span>
                                </p>
                            </div>
                            <div class="colSurplus">
                                <p v-if="datavalue.lastdayhourflag && datavalue.timeitemunit=='0'">上期结余{{parseInt(datavalue.lastdayorhour)}}天</p>
                                <p v-else-if="datavalue.lastdayhourflag && datavalue.timeitemunit=='1'">上期结余{{parseInt(datavalue.lastdayorhour)}}小时</p>
                                <p v-else-if="!datavalue.lastdayhourflag" style="color: #fff;"><br/></p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--<div id="colCanvas1" style="width: 200px;height:200px;"></div>-->
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import echarts from '../../../../../assets/js/echarts.min.js';

    export default {
        data() {
            return {
                valueY:'',//年份
                temporaryMouth:"",//临时月份
                mouthObj:{
                },
                date:[],
                echartDate:[

                ],
                prevent:0,
//              pickerOptions0:{//假期查询年份范围 日期选择器disabledDate
//              	disabledDate(time) {
//              		//debugger
//              		//console.log("time="+time);
//              		//:picker-options="pickerOptions0" 加在标签中
//				            return time.getTime() < Date.now() - 8.64e7;
//				          }
//              }
            }
        },
        created() {
            var _this = this;
            var myDate = new Date();//获取系统当前时间
            _this.valueY = String(myDate.getFullYear());
            _this.leavebtn();
            this.autodivheight();
            window.onresize=this.autodivheight; //浏览器窗口发生变化时同时变化DIV高度
        },

        mounted(){
            $(this.$el).find("#rangeDateLeave i").after("<div class='el-cascader-right-line'></div>");
        },

        methods: {
            c:function(){

            },
            b:function(){

            },
            pre:function(){
                var _this = this;
                _this.prevent = 1;
            },
            leavebtn:function(){//查询按钮
                var _this = this;
                var date = new Date();
                var nowMonth = date.getMonth() + 1;
                nowMonth = nowMonth.toString()
                if(nowMonth >= 1 && nowMonth <= 9){
                    nowMonth = 0 + nowMonth;
                }
//              console.log(nowMonth)
                let param = {
                    leaveYear: _this.valueY,
//                  leaveMonth: "08"
                    leaveMonth: nowMonth
                };
                _this.$http({
                    method: "post",
                    url: '/hrss/ta/leaveBalances/getLeaves',
                    params: param,
                }).then(function (res) {
                    _this.date = res.data.data;
                    console.log(JSON.stringify(_this.date));
                    if(res.data.status == true){
                        setTimeout(function(){//解决异步

                            _this.date.forEach(function(value,index){//初始化月份
                                var ready = parseInt(value.yidayorhour);//左
                                var all = parseInt(value.alldayhour - value.yidayorhour);//总
                                if(all == 0){
                                    all = 1
                                }
                                var colCanvas = "colCanvas"+index;//画图
                                var myChart = echarts.init(document.getElementById(colCanvas));
                                myChart.setOption({
                                    color:['#D8D8D8','#1BC198'],
//                                  tooltip: {
//                                      trigger: 'item',
//                                      formatter: "{a} <br/>{b}: {c} ({d}%)"
//                                  },
                                    legend: {
                                        orient: 'vertical',
                                        x: 'left',
                                        data:['直接访问','邮件营销']
                                    },
                                    series: [
                                        {
                                            name:'',
                                            type:'pie',
                                            radius: ['50%', '70%'],
                                            avoidLabelOverlap: false,
                                            label: {
                                                normal: {
                                                    show: false,
                                                    position: 'center'
                                                },
                                                emphasis: {
                                                    show:false,
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
                                            data:[
                                                {value:all},//总共
                                                {value:ready},//已休
                                            ]
                                        }
                                    ]
                                });//画图结束
                                if(value.curmonth<=9){
                                    var mou = "0" + value.curmonth;
                                }else{
                                    var mou = value.curmonth;
                                }
                                Vue.set(_this.mouthObj,index,mou);//新增属性 (对象、属性名、值)
                            });
                        },0);
                    }else if(res.data.status == false){
                        _this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                    }
                }).catch(function(res){
//					alert(JSON.stringify(res));
                });
            },//查询按钮结束
            getId:function(index){
                return "colCanvas" + index
            },
            handleChange:function(val) {//年份选择器
                var _this = this;
                _this.valueY = val;
                _this.leavebtn();//查询函数
                console.log(_this.valueY)
            },
            changeHandler:function(val,index){//月份选择器(月份 索引)，发请求
            	  console.log(val,index)
  	  
                var _this = this;
                
                if(val==""){
                    return;
                }
                _this.prevent = 0;
                if(val == "010"){
                    val = "10"
                }else if(val == 11){
                    val = "11"
                }else if(val == 12){
                    val = "12"
                }
                _this.mouthObj[index] = val;
                var pk_timeitem = _this.date[index].pk_timeItem;
//              debugger
                let param = {
                    leaveYear: _this.valueY,
                    leaveMonth: val,
                    pk_timeitem:pk_timeitem
                };
                console.log("传参="+JSON.stringify(param));

                _this.$http({
                    method: "post",
                    url: '/hrss/ta/leaveBalances/getLeavesByMonth',
                    params: param,
                }).then(function (res) {
                    if(res.data.status == true){
                        console.log(JSON.stringify(res));
                        Vue.set(_this.date,index,res.data.data);//更新视图
                        console.log("res.data.data="+ JSON.stringify(res.data.data));
                        console.log("_this.date="+ JSON.stringify(_this.date));

                        setTimeout(function(){

                            var value = _this.date[index];
                            var ready = parseInt(value.yidayorhour);//左
                            var all = parseInt(value.alldayhour - value.yidayorhour);//总
                            if(all == 0){
                                all = 1
                            }
                            var colCanvas = "colCanvas"+index;//画图
                            var myChart = echarts.init(document.getElementById(colCanvas));
                            myChart.setOption({
                                color:['#D8D8D8','#1BC198'],
//                              tooltip: {
//                                  trigger: 'item',
//                                  formatter: "{a} <br/>{b}: {c} ({d}%)"
//                              },
                                legend: {
                                    orient: 'vertical',
                                    x: 'left',
                                    data:['直接访问','邮件营销']
                                },
                                series: [
                                    {
                                        name:'访问来源',
                                        type:'pie',
                                        radius: ['50%', '70%'],
                                        avoidLabelOverlap: false,
                                        label: {
                                            normal: {
                                                show: false,
                                                position: 'center'
                                            },
                                            emphasis: {
                                                show:false,
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
                                        data:[
                                            {value:all},//总共
                                            {value:ready},//已休
                                        ]
                                    }
                                ]
                            });//画图结束
                            if(value.curmonth<=9){
                                var mou = "0" + value.curmonth;
                            }else{
                                var mou = value.curmonth;
                            }
                            Vue.set(_this.mouthObj,index,mou);//新增属性 (对象、属性名、值)

                        },0)//setTimeout结束
                    }else if(res.data.status == false){
                        _this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                    }

                }).catch(function(res){
                    _this.$message({
                        message: res.data.message,
                        type: "error"
                    });
                });//ajax结束

                console.log(JSON.stringify(_this.mouthObj))
            },
            canvasfun:function(index,ready,all){//画图
                var colCanvas = "colCanvas"+index;
                var myChart = echarts.init(document.getElementById(colCanvas));

                myChart.setOption({
                    color:['#D8D8D8','#1BC198'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['直接访问','邮件营销']
                    },
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show:false,
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
                            data:[
                                {value:all},//总共
                                {value:ready},//已休
                            ]
                        }
                    ]
                });
            },
            autodivheight(){
                //内容高度自适应的设置
                var _this=this;
                var winHeight='';
                if (window.innerHeight){
                    winHeight = window.innerHeight;
                }else if ((document.body) && (document.body.clientHeight)){//ie
                    winHeight = document.body.clientHeight;
                }
                _this.maxheight=winHeight-230;//减掉内容上方的高度；
            },
            goIn(index){//点击事件
                var _this = this;
                var curmonth="";
                if(_this.date[index].curmonth){
                    curmonth = _this.date[index].curmonth;
                }
                if(_this.prevent == 0){
                    let $url = '/hrss/tbmLeavesList?pk_leavetype=' + _this.date[index].pk_timeItem
                        + '&timeitemname=' + _this.date[index].timeitemname
                        + '&curyear=' + _this.date[index].curyear
                        + '&curmonth=' + curmonth
                        + '&periodflag=' + _this.date[index].periodflag
                        + '&timeitemunit=' + _this.date[index].timeitemunit;
                    this.$router.push($url);
                }

            }
        }
    };
</script>
<style scoped="scoped">
    .leaveP{
        display:inline-block;
        font-size: 1px;
    }
    .leaveTime,.colTime{
        margin-right: 2%;
        display: inline-block;
        margin-left:1%;
    }
    .leave-main .el-col{
        /*border:1px solid #F0F0F5;
        margin: 0% 1%;
        width: 22.9%;
        margin-bottom: 2%;
        border-radius: 4px;
        padding-left: 24px !important;
        padding-right: 24px !important;*/
    }
    .colDiv{
        /*padding-bottom:29px;*/
        height:100%;
        width:100%;
        position: relative;
        border: 1px solid #F0F0F5;
        margin-bottom: 16px;
        height: 286px;
        border-radius: 4px;
        cursor:pointer
    }
    .colTime{
        position: absolute;
        right: 16px;
        top: 16px;
        text-align: right;
    }
    .colTitle{
        margin-top: -7px;
        margin-bottom: 8px;
        padding-left: 16px;
        /*padding-right: 5%;*/
    }
    .colTitle span{
        font-size: 18px;
        font-weight: bold;
    }
    .colCanvas{
        width: 166px;
        height: 166px;
        margin: 0 auto;
        margin-top: 25px;
    }
    .colCanvasP{
        position: relative;
        margin: 0 auto;
        width: 32px;
        top: 139px;
        font-size: 24px;
    }
    .colDate{
        margin-top: -8px;
    }
    .colDate>p{
        color: #2D2D2D;
        font-size: 18px;
        font-weight: bold;

    }
    .colSurplus>p{
        font-size: 14px;
        color: #FF3B30;
        margin-top: 12px;
    }
    .colDate>p,.colSurplus>p{
        text-align: center;
        line-height: 16px;
    }
</style>
<style>
    .colTime .el-input{
        width: 40% !important;
    }
</style>