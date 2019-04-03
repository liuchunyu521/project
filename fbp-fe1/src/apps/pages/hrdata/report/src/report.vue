<template>
    <ifbp-page>
        <ifbp-breadcrumb name="对标分析"></ifbp-breadcrumb>

        <ifbp-button-area>
            <p class="ppp">机构：</p>
            <span class="bbb" style="">
                    <el-ref :is-muti-select="true"
                            ref-code="adminOrgGroupPowerRef"
                            :field="field"
                            :template-value="refTemplateValue"
                            width="100px"
                            :editable="isEdit"
                            placeholder="请选择"
                            @change="getData"
                            @trigger="handleRefTrigger2">
                    </el-ref>
                </span>
            <!--<span class="demonstration">年-月</span>-->
            <p class="ppp">报告期：</p>
            <span  class="bbb" >
                    <el-date-picker
                            v-model="value4"
                            type="month"
                            placeholder="选择年-月">
                    </el-date-picker>
                </span>
            <el-button type="primary" @click="start" >开始对比</el-button>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <div style="height:10px"></div>
            <div v-if="data.orgdata" class="spanC">
                <!--:style="{width:166*data.orgdata.length+'px'}"-->
                <div  :style="{width:166*data.orgdata.length+'px'}" class="spanCwrap">
                    <div  id="navright" :title="datavalue.orgname" style="width: 128px;padding: 0 16px 0 16px;margin-right:6px ;display: inline-block;line-height: 40px;text-align: center;position: relative;border-radius: 4px 4px 0 0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"  v-for="(datavalue,index) in data.orgdata">
                        {{datavalue.orgname}}
                        <span @click="delet(index)" style="position: absolute;right: 10px;top: -6px;color:#75787B;font-size: 12px;cursor: pointer;">X</span>
                    </div>
                </div>
            </div>

            <div id="userInfo" class="y-userinfo">
                <!--标题-->
                <div  ref="navlistname" id="navlistname" class="y-menu">
                    <div v-for="(item,index) in data.indata" class="navlist">
                        <div class="current" @click="leftnav(index)"  v-if="index==0" :scroll-href="getId(index)">
                            {{item.name}}
                            <span class="currentclr"></span>
                        </div>
                        <div @click="leftnav(index)"  v-else :scroll-href="getId(index)">
                            {{item.name}}
                            <span></span>
                        </div>
                    </div>
                </div>
                <!--内容-->
                <!--页签-->
                <div id="wraplist" class="wraplistTop" :style="{height:maxheight+'px'}">
                    <div class="reportsub"  :style="{width: computeWidth +'px'}"  v-for="(item , index) in data.indata" :data-scroll="getId2(index)">
                        <div class="titleWar">{{item.name}}</div>
                        <!--左一目录-->
                        <div class="contWar" >
                            <div class="zhiul" style="display: inline-block;text-indent: 15px;">
                                <div style="background: #F5F5F5;border-bottom: 1px solid #E6E6EB;">指标</div>
                                <div style="border-bottom: 1px solid #E6E6EB;" v-for="children in item.subdata">{{children}}</div>
                            </div>
                            <!--右侧内容-->
                            <div  v-if="data.orgdata"  style="display:inline-block;margin-left: -3px;position: absolute;top: 0px;left: 193px;" >
                                <div style="display: inline-block; width: 166px;text-align: center;" v-for="(datavalue,index) in data.orgdata">
                                    <div style="background: #F5F5F5;border-bottom: 1px solid #E6E6EB;">指标值/排名</div>
                                    <div v-for="value in datavalue[item.code]">
                                        <!--{{value}}-->
                                        <span v-if="value.split('/')[2]=='red'" style="color: #E60012;font-weight: bold">{{value | valuetarget}}</span>
                                        <span v-else-if="value.split('/')[2]=='green'" style="color: green;font-weight: bold">{{value | valuetarget}}</span>
                                        <span v-else-if="value.split('/')[2]=='black'" style="color: #000;">{{value | valuetarget}}</span>
                                        <span v-else>{{value | valuetarget}}</span>
                                        <span style="color: #ff9500;font-size: 14px;font-weight: bold">/{{value | valuerank}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--固定左侧指标-->
                    <div id="navfixed"  style="width: 200px;overflow: hidden;position: absolute;top: 0px;left:0px;background: #fff;">
                        <div v-for="(item , index) in data.indata" :data-scroll="getId2(index)">
                            <div class="titleWar">{{item.name}}</div>
                            <!--左一目录-->
                            <div class="contWar" style="border-right: none">
                                <div class="zhiul" style="display: inline-block;text-indent: 15px;">
                                    <div style="background: #F5F5F5;border-bottom: 1px solid #E6E6EB;">指标</div>
                                    <div style="border-bottom: 1px solid #E6E6EB;" v-for="children in item.subdata">{{children}}</div>
                                </div>
                                <!--右侧内容-->
                                <div  v-if="data.orgdata"   style="display:inline-block;margin-left: -3px;position: absolute;top: 0px;left: 193px;" >
                                    <div  style="display: inline-block; width: 166px;text-align: center;" v-for="(datavalue,index) in data.orgdata">
                                        <div style="background: #F5F5F5;border-bottom: 1px solid #E6E6EB;">指标值/排名</div>
                                        <div v-for="value in datavalue[item.code]">
                                            <!--{{value}}-->
                                            <span v-if="value.split('/')[2]=='red'" style="color:#E60012;font-weight: bold">{{value | valuetarget}}</span>
                                            <span v-else-if="value.split('/')[2]=='green'" style="color: green;font-weight: bold">{{value | valuetarget}}</span>
                                            <span v-else-if="value.split('/')[2]=='black'" style="color: #000;">{{value | valuetarget}}</span>
                                            <span v-else>{{value | valuetarget}}</span>
                                            <span style="color: #ff9500;font-size: 14px;font-weight: bold">/{{value | valuerank}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--为了撑开内容-->
                    <div :style="{height:maxheight+'px'}"></div>
                </div>
            </div>
        </ifbp-main-area>
    </ifbp-page>

</template>

<script>
//    import { scrollSpy } from '../../../../assets/js/scrollspy.js';
//    import { Loading } from 'ifbp-element';
    export default {
        data() {
            return {

                isMutiSelect: false,
                refcode: "org",
                field: "pk_org",
                isEdit: true,
                refTemplateValue: {
                    metaDefinedName: "psndoc",
                    namespace: "ifbp",
                    status: 0,
                    changedPropertyNames: null,
                    beanMap: {
                        pk_org_ref: {}
                    },
                },
                value4: '',//年月
     //           fullscreenLoading: false,//等待框
                data:{

//                    "indata": [{
//                        "code": "01",
//                        "name": "员工总量",
//                        "subdata": ["员工总人数", "正式员工占比", "劳务派遣人数占比", "销售人员占比", "离退休人员数量"]
//                    }, {
//                        "code": "02",
//                        "name": "性别结构",
//                        "subdata": ["男占比", "女占比"]
//                    }, {
//                        "code": "03",
//                        "name": "年龄、工龄、司龄",
//                        "subdata": ["平均年龄", "40岁以上人员占比", "平均工龄", "平均司龄"]
//                    }, {
//                        "code": "04",
//                        "name": "学历结构",
//                        "subdata": ["博士人数", "硕士人数", "学历（本科以上）占比", "人才密度当量"]
//                    }, {
//                        "code": "05",
//                        "name": "管理人员",
//                        "subdata": ["平均年龄", "学历（本科以上）占比", "本年员工增长数"]
//                    }, {
//                        "code": "06",
//                        "name": "员工流动性",
//                        "subdata": ["本年增长率", "本年员工辞离职人数", "本年流失率"]
//                    }, {
//                        "code": "07",
//                        "name": "人才竞争力",
//                        "subdata": ["人均收入", "人均利润"]
//                    }, {
//                        "code": "08",
//                        "name": "薪资福利",
//                        "subdata": ["平均工资", "薪酬总额"]
//                    }, {
//                        "code": "09",
//                        "name": "考勤情况",
//                        "subdata": ["本月人均工作时长", "本月人均假期时长"]
//                    }],
//
//                    "orgdata": [{
//                        "orgname": "新世纪财险股份有限公司内蒙古分公司",
//                        "01": ["34506/1/red", "23.34%/1/red", "48.32%/1/red", "45.32%/1/red", "20.34/1/red"],
//                        "02": ["50.43%/1/red", "49.32%/1/red"],
//                        "03": ["46.4/1/red", "23.34%/1/red", "10.34/1/red", "5.34/1/red"],
//                        "04": ["845/1/red", "23/1/red", "80.3%/1/red", "1.34/1/red"],
//                        "05": ["56.2/1/red", "40.34%/1/red", "3456%/1/red"],
//                        "06": ["34.2%/1/red", "345/1/red", "23.34%/1/red"],
//                        "07": ["45678.43/1/red", "234.45/1/red"],
//                        "08": ["56780.12/1/red", "334556664.4/1/red"],
//                        "09": ["170/1/red", "2.1/1/red"]
//                    }]

                },
                isshow:false,
                maxheight:'',//自适应高度
                computeWidth:''
            }
        },
        filters:{
            valuetarget(res){
                var data=res.split("/")[0]
                return data;
            },
            valuerank(res){
                var data=res.split("/")[1]
                return data;
            }

        },
        methods: {
            toggleEdit() {
                this.isEdit = !this.isEdit;
            },
            getId: function (index) {
                return "#idNum_" + index
            },
            getId2: function (index) {
                return "idNum_" + index
            },
            getData: function (data) {

            },
            handleRefTrigger2(type, data) {
                var _this = this;
                var pk_org = [];
                if (type === 'change') {
                    data.value.forEach(function(val,index,arr){//val为数组中当前的值，index为当前值的下表，arr为原数组
                        pk_org.push(val.id);
                    });
                    _this.pk_org = pk_org;
                }
            },
            handleChange(val) {//年月

            },
            handleScroll () {
                var witdh=-document.getElementById("wraplist").scrollLeft;
                if(witdh<0){
                    this.isshow=true;
                }else {
                    this.isshow=false;
                }
                $(".spanCwrap").css({
                    "transform": "-ms-translateX("+witdh+"px)",//IE9
                    "transform": "-moz-translateX("+witdh+"px)",//Firefox
                    "transform": "-webkit-translateX("+witdh+"px)",//Safari 和 Chrome
                    "transform": "-o-translateX("+witdh+"px)"//Opera
                });
                $("#navfixed").css({
                    "left":-witdh+'px'
                });
            },
            delet(index){
                //删除数据
                var Arry=this.data.orgdata;
                Arry.splice(index,1);
            },
            start(){//开始对比
                var _this = this;
                if(_this.pk_org =="" || _this.pk_org == null || _this.pk_org == undefined ||_this.value4 =="" || _this.value4 == null || _this.value4 == undefined){
                    _this.$message({
                        message: "请填写机构和日期",
                        type: "error"
                    });
                    return
                }
                var obj = {};
                obj.pk_org = _this.pk_org;
                var year = _this.value4.getFullYear();
                var month = _this.value4.getMonth()+1;
                if(month<=9 ){
                    month = "0"+ month;
                }
                obj.date = year + "-" + month;
                console.log("obj="+JSON.stringify(obj));
                this.$http({
                    method: "post",
                    url: '/hrdata/report/getOrgInData',
                    data: JSON.parse(JSON.stringify(obj))
                }).then(function (res) {
//                    this.fullscreenLoading = true;
//                    setTimeout(() => {
//                        this.fullscreenLoading = false;
//                    }, 1500);
                    _this.data = res.data.data;
                    if(res.data.data.orgdata.length == 0){//无数据
                        _this.$message({
                            message: "暂无对比数据",
                            type: "error"
                        });
                    }
                   _this.computeStyle();
                }).catch(function(res){
//                    console.log("res="+JSON.stringify(res));


                });


            },
            computeStyle() {
                var _this = this;
                if( _this.data.orgdata) {//如果有内容
                    var data=166 * _this.data.orgdata.length;
                    this.computeWidth=data;
                }
            },
            leftnav(index){

                var _this=this;
                var contentEls = document.querySelectorAll('[data-scroll]'); //内容区域
                var menuEls = document.querySelectorAll('[scroll-href]');
                var _href = menuEls[index].getAttribute('scroll-href').replace('#', '');
                _this.scrollMove( document.querySelectorAll('[data-scroll="'+ _href +'"]')[0].offsetTop );
            },
            init: function(){
                var _this=this;
                document.getElementById("wraplist").addEventListener('scroll', this.onScroll);
                var contentEls = document.querySelectorAll('[data-scroll]'); //内容区域
                var menuEls = document.querySelectorAll('[scroll-href]');
                _this.leftnav();
//                for(var i = 0, l = menuEls.length; i < l; i++){
//                    let j = i;
//                    var _menuitem = menuEls[i];
//                    console.log(_menuitem)
//                    _menuitem.onclick = function( e ){
//                        debugger;
//                        var _href = menuEls[j].getAttribute('scroll-href').replace('#', '');
//                        _this.scrollMove( document.querySelectorAll('[data-scroll="'+ _href +'"]')[0].offsetTop );
//                    }
//                };
            },
            //存监听菜单对应内容的起始位置
            scrollPosition: function(){
                var contentEls = document.querySelectorAll('[data-scroll]'); //内容区域
                var menuEls = document.querySelectorAll('[scroll-href]');
                var _scroll = [];
                for(var i = 0, l = contentEls.length; i < l; i++){
                    var _top = contentEls[i].offsetTop +50; //20为列表的高度
                    _scroll.push( _top );
                };
                return _scroll;
            },
            scrollMove: function( scrollTo ) {
                var scrollFrom;
                if(this.getScrollTop()){
                    scrollFrom = this.getScrollTop();
                }else {
                    scrollFrom=0;
                }
                var count = 0;
                var	time = 50;
                var scrollTo = parseInt( scrollTo );

                var interval = setInterval(function () {
                    count++;
                    document.getElementById("wraplist").scrollTop = (scrollTo - scrollFrom) / time * count + scrollFrom;
                    if (count >= time) {
                        clearInterval(interval);
                    }
                }, 10);
            },
            //获取当前滚动条位置
            getScrollTop: function(){
                return document.getElementById("wraplist").scrollTop || document.getElementById("wraplist").pageYOffset
            },
            //滚动监听
            onScroll: function() {
                var contentEls = document.querySelectorAll('[data-scroll]'); //内容区域
                var menuEls = document.querySelectorAll('[scroll-href]');
                let me = this;
                let scrolled = me.getScrollTop();
                let pos = me.scrollPosition();
                for( var i = 0, l = pos.length; i < l; i++){
                    var _idx = i;
                    var _start = ( _idx == 0 ? 0 : pos[ _idx - 1 ]);
                    var _end = pos[ _idx ];
                    if( scrolled >= _start && scrolled < _end ){
                        var _currentIdx = ( _idx ==  l - 1 ? l - 1 : _idx);

                        var _menuherf = contentEls[ _currentIdx ].getAttribute('data-scroll');

                        for( var j = 0, len = menuEls.length; j < len; j++ ){
                            var _menuitem = menuEls[j];
                            if( _menuitem.getAttribute('scroll-href') == '#' + _menuherf){
                                _menuitem.className="current";
                            }else{
                                _menuitem.className="";
                            };
                        };
                        break;
                    };
                };
            }

        },
        created() {
            var _this=this;

            this.$http({
                method: "post",
                url: '/hrdata/report/getOrgInData',
                data:{}
            }).then(function (res) {
                _this.data = res.data.data;
                _this.computeStyle();
                _this.init();
                document.getElementById("wraplist").addEventListener('scroll', this.handleScroll);

            }).catch(function(res){
//                    console.log("res="+JSON.stringify(res));
//                    this.$message({
//                        message: "信息获取失败",
//                        type: "error"
//                    });
            });

            var winHeight;
            if (window.innerHeight){
                winHeight = window.innerHeight;
            }else if ((document.body) && (document.body.clientHeight)){
                winHeight = document.body.clientHeight;
            }
            console.log(winHeight);
            _this.maxheight=winHeight-280;//减掉内容上方的高度；


        },
        mounted() {


        },
        computed: {


        }
    }

</script>
<style scoped="scoped">
    .ref-container{
        width: 100%;
        display: inline-block;
    }

    .y-menu,#wraplist{
        float: left;
    }
    .y-menu{
        margin-right:20px;
        background-color:#fff;
        width: 176px;
        margin-right: 16px;
    }
    .y-menu ul{
        margin-left:0px;
        font-size: 14px;
        color:#333333;
        padding-left: 9%;
    }
    .y-menu li{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .y-menu span{
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color:#E2E2E2;
        border-radius:10px;
        margin-right: 10%;
    }
    li{
        list-style:none;
        line-height:40px;
    }
    .zhiul{
        width: 100%;
        position: relative;
    }
    .companyLi{
        position: absolute;

    }
    .zhiul li{
        width: 200px;
    }
    .el-input {
        width: 18% !important;
    }
    .list-main-container {
        background: #f0f0f5 !important;
        padding-left: 0px !important;
    }
    #wraplist{
        overflow: auto;
        position:relative;
        width: calc(100% - 193px);
        background: #fff;
    }
    .reportsub {
        min-width: 100%;
        background: #fff;
    }
    .wraplistTop{
        line-height: 40px;
    }
    .bbb .el-input{
        width: 200px !important;
    }
    .bbb{
        margin-right: 2%;
        display: inline-block;
        margin-left:1%;
    }
    .ppp{
        display:inline-block;
        font-size: 1px;
    }

    .titleWar{
        color:#5CB0E6;
        font-size:16px;
        line-height:40px;
        padding-left:10px;
    }
    .contWar{
        position: relative;
        border:1px solid #E6E6EB;
        border-bottom: none;

        margin: 0 10px;
    }
    .spanC{
        position: relative;
        top: 0px;
        left: 393px;
        width: calc(100% - 403px);
        height: 40px;
        overflow: hidden;
        z-index: 999;
    }
    .spanCwrap {
        position: relative;
    }
    .spanC #navright{
        background: #fff;
        transform: translateX(0);
    }
    .list-main-container {
        padding: 0px;
    }
    .navlist div {
        height: 42px;
        line-height: 42px;
        text-indent: 16px;
        font-size: 14px;
        color: #333333;
        position: relative;
    }
    .navlist span {
        position: absolute;
        top: 14px;
        right: -2px;
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background: #E2E2E2;
    }
    .navlist .current {
        width: 176px;
        position: relative;
        height: 42px;
        background: #5CB0E6;
        color: #fff;
    }

    .navlist .current span {
        background: #fff;
    }
    .current:before {
        content: "";
        position: absolute;
        width: 0;
        height: 42px;
        top: -0px;
        right: -42px;
        border-width: 0px 21px 22px;
        transform: rotateZ(90deg);
        border-style: solid;
        border-color: transparent transparent #5CB0E6;
        z-index: 10;
    }
</style>