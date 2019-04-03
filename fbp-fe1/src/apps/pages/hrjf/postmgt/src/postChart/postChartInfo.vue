<template>
    <ifbp-page>
        <ifbp-breadcrumb v-if="isNew" name="岗位图谱"></ifbp-breadcrumb>
        <ifbp-breadcrumb v-if="isEdit" name="岗位详情"></ifbp-breadcrumb>
        <div id="indexTab2">
            <!--<div class="abso zhiji" v-bind:style="{width: everyWidth +'px'}">职级类别</div>-->
            <!--<div class="abso zhijiLevel" v-bind:style="{width: everyWidth+'px',left:everyWidth+'px'}">职级</div>-->
            <!--<div class="abso zhiwu" v-bind:style="{left:everyWidth*2+'px'}">岗位序列</div>-->
            <div class="abso2 zhiji2" style="width: 100px">职级类别</div>
            <div class="abso2 zhijiLevel2" style="width: 100px;left:100px">职级</div>
            <div class="abso2 zhiwu2" style="left:200px">岗位序列</div>
        </div>

    </ifbp-page>
</template>
<script>
    import "css/post.css";
    //    import "js/jquery.min.js";
    export default {
        data() {
            const vm = this;
            //---面包屑---
            var $isNew;
            var $isEdit;
            var pkjob = this.$root.$router.currentRoute.params.id;
            if (pkjob) {
                $isNew = false;
                $isEdit = true;
            } else {
                $isNew = true;
                $isEdit = false;
            }
            //---面包屑结束---
            return {
                //---面包屑---
                isNew: $isNew,//是否新增态
                isEdit: $isEdit,//是否编辑态
                pk_job: pkjob,
                scrollDom: "ifbpScrollDom",
                //---面包屑结束---

                indexTabWidth:"",//indexTab的宽
                everyWidth:"",//每个x轴的宽
                xAxis:{},//x轴的数据含pos
                yAxis:{},//y轴的数据含pos
                coincidence:{},//xy重合的数据
                count:-1,
                xCount : "",//叶子数量x
                yCount : "",//叶子数量 y
                deep : "",//深度
                deepl : "", //top
                deepw : "",//宽

                //x轴
                left : "",//240
                level : 1,
                //y轴
                topY : "",
                levelY : 0,
                //内容
                yy : 0,

//                数据源
                zhiwu:[],//上
                zhiji:[],//左
                neirong:[],//中
            };
        },
        created(){
            var vm = this;
            //请求数据


        },

        mounted() {//DOM加载完毕
            var vm = this;
            vm.$http.all([
//                axios.get('/hrjf/jobChart/jobType/getAll'),//接口1 上
//                axios.get('/hrjf/jobChart/levelTypeAndLevel/getAll'), //接口2 左
//                axios.get('/hrjf/jobChart/job/getAll')//接口3 中
                axios.get('/hrjf/postOVP/postChart/postSeries'),//接口1 上
                axios.get('/hrjf/postOVP/postChart/levelTypeAndLevel'), //接口2 左
                axios.get('/hrjf/postOVP/postChart/post')//接口3 中内容
            ])
                .then(axios.spread(function (userResp, reposResp,threeResp) {
                    // 上面两个请求都完成后，才执行这个回调方法
                    vm.zhiwu = userResp.data.data;
                    vm.zhiji = reposResp.data.data;
                    vm.neirong = threeResp.data.data;
//1.标识X和Y轴对象，获取X轴深度
                    vm.xCount = vm.markAxis(vm.zhiwu,vm.xAxis,vm.count,"pk_postSeries");
                    //叶子数量x  创建自己对象xAxis加入pos zhiwu加pos
                    vm.yCount = vm.markYAxis(vm.zhiji,vm.yAxis);//叶子数量y  OK




                    vm.left = 200;
                    vm.deep = vm.getDeep(vm.zhiwu);//深度
                    //alert('x轴总数量：'+ (vm.xCount + 1) + '  深度：' + vm.deep);
                    vm.deepl = (vm.deep + 1) * 48; //top
                    vm.topY = vm.deepl;
//                  4.渲染y轴
                    vm.diguiY(vm.zhiji,vm.topY,vm.level);
//                  5.遍历内容
                    vm.ergodic();

//得到平均宽度
                    var indexTabWidth = document.getElementById("indexTab2").offsetWidth;//外层宽
                    vm.indexTabWidth = indexTabWidth - 240;
                    var xC = vm.xCount+1;
                    for(var X in vm.coincidence){
                        xC = xC + vm.coincidence[X] - 1;
                    }
                    vm.everyWidth = (vm.indexTabWidth/xC).toFixed(2);

//                  6.渲染x轴
                    vm.digui(vm.zhiwu, vm.left,vm.level);

                    vm.leftXaxis();//对xAxis增加left属性

                    vm.neirongFun(vm.neirong);//内容
                    //vm.Tab((vm.deep+1)*40,vm.left,vm.xCount,vm.yCount);
                    //表格top1,left1,X,Y

                    document.getElementsByClassName("zhiji2")[0].style.lineHeight = vm.deepl+'px';//职级类别
                    document.getElementsByClassName("zhijiLevel2")[0].style.lineHeight =  vm.deepl+"px";//职级
                    document.getElementsByClassName("zhiwu2")[0].style.width =
                        vm.indexTabWidth - 1 +"px";//职务类别宽

                }));
        },
        methods: {
// x轴
            DOMTag:function(jobtypename,left,top, width,height){//添加div
                var vm = this;
                var Div = document.createElement("div");
                Div.innerHTML = jobtypename;//div内容
                Div.style.width = width + 'px';
                Div.style.left = left  +'px';//
                Div.style.top =top + 'px';
                Div.style.position = 'absolute';
                Div.style.zIndex = 10;
                Div.style.background = '#F5F5F5';
                Div.style.height = height*48+'px';
                Div.style.lineHeight = height*48+'px';
                document.getElementById("indexTab2").appendChild(Div);
                return Div;
            },
            digui:function(node,left,level){ //递归
                var vm = this;
                node.forEach(function(item,index,arr){//遍历职务数组
                    if (item.hasOwnProperty("childlist") && item.childlist.length != 0){
                        //有子集

                        var count = 0 ;
                        count = vm.getCount(item.childlist);
                        var a=10;

                    }else{//没子集
                        var count = vm.coincidence[item.pos]
                    }
                    if(count == undefined || isNaN(count)){//当xpos下没有内容时
                        count = 1;
                    }
                    var width = count * vm.everyWidth;//获得宽度
                    var top =  level * 48; //距顶端
                    var dom = vm.DOMTag(item.postseriesname, left , top , width);//绘制DOM

                    if (!item.hasOwnProperty("childlist") || item.childlist.length == 0){//没子集
                        dom.style.height = (vm.deep - level + 1) * 48 + 'px';
                        dom.style.lineHeight = (vm.deep - level + 1) * 48 + 'px';
                    }else if(item.hasOwnProperty("childlist") && item.childlist.length != 0){//有子集
                        vm.digui(item.childlist, left, level + 1);
                    }
                    left = left + width;//width


                });
            },

            getCount:function(node){
                var vm = this, count = 0;
                node.forEach(function(item, index){
                    if(item.hasOwnProperty("childlist") && item.childlist.length != 0){//有节点
                        count += vm.getCount(item.childlist);
                    }else{//无子节点
                        count += vm.coincidence[item.pos];
                    }
                });
                return count;
            },
// y轴
            DOMTagY:function(name,leftY,topY, herightY){//添加div
                var vm = this;
                var Div = document.createElement("div");
                Div.innerHTML   = name;//div内容
                Div.style.width =  '100px';//'120px';vm.everyWidth160
                Div.style.left  = leftY +'px';
                Div.style.top   = topY + 'px';
                Div.style.height= herightY+'px';
                Div.style.lineHeight= herightY+'px';
                Div.style.position = 'absolute';
                Div.style.background = '#F5F5F5';

                document.getElementById("indexTab2").appendChild(Div);
                return Div;
            },
            diguiY:function(node,topY){//node=zhiji
                var vm = this;
                node.forEach(function(item,index,arr){//遍历职务数组
                    if(item.hasOwnProperty("leveltypename")){//一层渲染
                        var oh = Object.keys(item.childlist).length;
                        var herightY = oh*48;//高度
                        var dom = vm.DOMTagY(item.leveltypename, 0 ,topY , herightY);//

                    }else if(item.hasOwnProperty("levelname")){//二层渲染
                        vm.levelY = vm.levelY + 1;
                        var topYn = (item.pos)*48 + vm.deepl;
                        var herightYn = 48;
                        var dom = vm.DOMTagY(item.levelname, 100 ,topYn, herightYn);
                    }

                    if(item.hasOwnProperty("childlist") && item.childlist.length != 0){//有子集
                        vm.diguiY(item.childlist,topY);//第二次遍历
                    }
                    topY = topY + herightY ;//上边距

                });
            },

//渲染内容
            neirongFun:function(arr){
                var vm = this;
                var content = {};
                arr.forEach(function(item,index,arr){
                    if(item.pk_level != ""){//有pk_level
                        if(Object.prototype.toString.call(item.pk_level) == "[object Array]" ){//判断是否为数组 如果是则循环展示Object
                            item.pk_level.forEach(function(items,index){
                                if(items != ""){
                                    var yAxisson =  vm.yAxis[items];//职级
                                    var xAxisson =  vm.xAxis[item.pk_postSeries
                                        ];//X轴
                                    if(yAxisson == 'undefined'|| yAxisson == undefined){
                                        return
                                    }
                                    if(xAxisson == 'undefined'|| xAxisson == undefined){
                                        return
                                    }
                                    var Y = yAxisson.pos;
                                    var T = yAxisson.pos;//yPos距离上侧的格子数
                                    // var H = yAxisson.count;
                                    var L = xAxisson.left;//xPos距离左侧的格子数

                                    var xAxisson =  vm.xAxis[item.pk_postSeries
                                        ];//职务

                                    var X = xAxisson.pos;
                                    var XY = X + '_' + Y;
                                    var preItem = content[X + '_' + (Y-1)];//上数据
                                    var preItemA = content[X + '_' + (Y+1)];//下数据

                                    if (content[X + '_' + Y]){ //如果当前格子数组已创建
                                        //1.找上下一样的dom优先合
                                        //  并考虑重合div部分
                                        //2.遍历数组找空档插入



                                        if(content[X + '_' + (Y-1)] != undefined){//如果上有和它一样数据 遍历寻找一样 并拼接到其下方

                                            var sameCl ;
                                            for(var i=0;i<content[X + '_' + (Y-1)].length;i++){
                                                if(content[X + '_' + (Y-1)][i] &&content[X + '_' + (Y-1)][i]._div.innerHTML == item.postname){//当找到与上一行一样的内容

                                                    //获取一样内容的countLeft
                                                    sameCl = content[X + '_' + (Y-1)][i]._div.countLeft;
                                                    for(var j=0;j<=content[X + '_' + Y].length-1;j++){
                                                        //如果要插入的位置有内容重叠
                                                        if(content[X + '_' + Y][j] != undefined &&  content[X + '_' + Y][j]._div.countLeft == sameCl){

                                                            //如果要插入的位置的原数据和下方有相同内容 则不插入数据和dom
                                                            if(content[X + '_' + (Y+1)] && content[X + '_' + (Y+1)][j] && content[X + '_' + (Y+1)][j]._div.innerHTML == content[X + '_' + Y][j]._div.innerHTML){
                                                                //则不插入dom


                                                                //content对象中复制原数据到右侧
                                                                //content[X + '_' + (Y+1)][j+1] = content[X + '_' + Y][j];
                                                                //在右侧创建原数据dom  那边几个前端
                                                                // vm.createDom(content,content[X + '_' + Y][j+1]._div.innerHTML,L,j+1,T,X,Y);
                                                                // break;


                                                            }else if(content[X + '_' + (Y+1)] && content[X + '_' + (Y+1)][j] == undefined){

                                                                var up = vm.Up(preItem,item.postname,content,X,Y);
                                                            }else{//如果要插入的位置的原数据和下方有相同不同时 则右移当前原数据
                                                                if(content[X + '_' + Y][j+1] == undefined ){
                                                                    content[X + '_' + Y][j+1] = content[X + '_' + Y][j];
                                                                    vm.createDom(content,content[X + '_' + Y][j+1]._div.innerHTML,L,j+1,T,X,Y);

                                                                }else if(content[X + '_' + Y][j+1] !=  undefined){
                                                                    if(content[X + '_' + Y][j+2] == undefined){
                                                                        content[X + '_' + Y][j+2] = content[X + '_' + Y][j];
                                                                        vm.createDom(content,content[X + '_' + Y][j+2]._div.innerHTML,L,j+2,T,X,Y);
                                                                    }else{
                                                                        content[X + '_' + Y][j+3] = content[X + '_' + Y][j];
                                                                        vm.createDom(content,content[X + '_' + Y][j+3]._div.innerHTML,L,j+3,T,X,Y);
                                                                    }

                                                                }
                                                                var up = vm.Up(preItem,item.postname,content,X,Y);
                                                                break
                                                            }

                                                            if(content[X + '_' + Y][j+1] == undefined){
                                                                content[X + '_' + Y][j+1] = content[X + '_' + Y][j];//右移创建对象
                                                                vm.createDom(content,content[X + '_' + Y][j+1]._div.innerHTML,L,j+1,T,X,Y);
                                                            }else if(content[X + '_' + Y][j+1] !=  undefined && content[X + '_' + Y][j+2] == undefined){
                                                                content[X + '_' + Y][j+2] = content[X + '_' + Y][j];//右移创建对象
                                                                vm.createDom(content,content[X + '_' + Y][j+2]._div.innerHTML,L,j+2,T,X,Y);
                                                            }else if(content[X + '_' + Y][j+1] !=  undefined && content[X + '_' + Y][j+2] != undefined && content[X + '_' + Y][j+3] == undefined){
                                                                content[X + '_' + Y][j+3] = content[X + '_' + Y][j];//右移创建对象
                                                                vm.createDom(content,content[X + '_' + Y][j+3]._div.innerHTML,L,j+3,T,X,Y);
                                                            }
                                                            break;

                                                        }
                                                        else{
                                                            var up = vm.Up(preItem,item.postname,content,X,Y);
                                                            break
                                                        }//if结束

                                                    }//for结束

                                                }


                                            }
                                        }//preItem 结束

                                        // if(preItemA != undefined && preItem == undefined){//如果下有数据 遍历寻找一样 并拼接到其下方
                                        //  alert(222);

                                        // }





                                        var r=content[X + '_' + Y][content[X + '_' + Y].length-1]._div.countLeft;//最右的cl

                                        //1.衔接合并与上一样的DOM
                                        var upT = vm.UpT(preItem,item.postname,content,X,Y);


                                        if(upT != true){//2.衔接合并与下一样的DOM
                                            var Down = vm.Down(preItemA,item.postname,content,X,Y);
                                        }

                                        //  重合部分移动
                                        if(upT == true){
                                            //与上面一样 判断下是否有数据若被覆盖，则向右或左空档处平移下面的数据 修改原有高度

                                        }else if(Down == true){//与下面一样 判断上是否有数据若被覆盖，则平移上面的数据

                                        }else if(upT != true && Down != true){//2.上下均无相同内容 遍历数组找空档插入

                                            var arrZ = 1;//没空档
                                            for(var i=0;i<r;i++){//之前有空档
                                                if(content[X + '_' + Y][i] == null){//之前有空档 arrZ设置为0
                                                    vm.createDom(content,item.postname,L,i,T,X,Y);
                                                    arrZ = 0;
                                                }
                                            }
                                            if(arrZ == 1){//没空档
                                                vm.createDom(content,item.postname,L,r+1,T,X,Y);
                                            }

                                        }



                                    }else{//XY格子没被占用
                                        var up = vm.Up(preItem,item.postname,content,X,Y);
                                        var Down = vm.Down(preItemA,item.postname,content,X,Y);
                                        if(up != true && Down != true ){
                                            vm.createDom(content,item.postname,L,0,T,X,Y);
                                        }

                                    }
                                }
                            });//遍历结束
                        }//是数组结束

                    }else if(item.pk_level == ""){}//若无pk_level,数据不渲染
                });
            },//neirongFun结束

            //判断四周有无元素的公共方法
            Up:function(preItem,itemJobname,content,X,Y){//判断上
                if(preItem != undefined || preItem){
                    for(var i=0;i<preItem.length;i++){
                        if(preItem[i] && preItem[i] != undefined && preItem[i]._div.innerHTML == itemJobname){//与上一样则合并
                            var height = preItem[i]._div.offsetHeight + 48 ;
                            preItem[i]._div.style.height = (height-3) + 'px';
                            preItem[i]._div.style.lineHeight = (height-3) + 'px';

                            content[X + '_' + (Y-1)][i] = preItem[i];
                            if(content[X + '_' + Y] == undefined){//此前无数据
                                content[X + '_' + Y] = [];
                                content[X + '_' + Y][i] = preItem[i];
                            }else{//此前有数据 原来数据右移动
                                // content[X + '_' + Y][i+1] = content[X + '_' + Y][i];
                                content[X + '_' + Y][i] = preItem[i];
                            }
                            return true
                        }
                    }
                }
            },
            UpT:function(preItem,itemJobname,content,X,Y){//判断上
                if(preItem != undefined || preItem){
                    for(var i=0;i<preItem.length;i++){
                        if(preItem[i] && preItem[i] != undefined && preItem[i]._div.innerHTML == itemJobname){//与上一样则合并

                            return true
                        }
                    }
                }
            },
            Down:function(preItemA,itemJobname,content,X,Y){//判断下
                if(preItemA != undefined || preItemA){
                    for(var i=0;i<preItemA.length;i++){
                        if(preItemA && preItemA[i] != undefined && preItemA[i]._div.innerHTML == itemJobname){//与下一样则合并
                            var height = preItemA[i]._div.offsetHeight + 48 ;
                            var top = preItemA[i]._div.offsetTop - 48 ;
                            preItemA[i]._div.style.top = top + 'px';
                            preItemA[i]._div.style.height = (height-3) + 'px';
                            preItemA[i]._div.style.lineHeight = (height-3) + 'px';
                            content[X + '_' + (Y+1)][i] = preItemA[i];
                            if(content[X + '_' + Y] == undefined){
                                content[X + '_' + Y] = [];
                                content[X + '_' + Y][i] = preItemA[i];
                            }else{
                                // content[X + '_' + Y][i+1] = content[X + '_' + Y][i];
                                content[X + '_' + Y][i] = preItemA[i];
                            }
                            return true
                        }
                    }
                }
            },
            createDom:function(content,jobname,L,cL,T,X,Y){//内容对象,名字,pos左边距,dom左边内距
                var vm = this;
                var Div = document.createElement("div");
                // Div.count = 1;//纵向跨度
                Div.countLeft = cL;//左标记
                Div.innerHTML   = jobname;//div内容
                Div.setAttribute("title", jobname);
                Div.style.width =  (vm.everyWidth-4) + 'px';
                Div.style.left = ((L+Div.countLeft) * vm.everyWidth + 200) +'px';
                Div.style.top   = (T + (vm.deep+1))*48 + 'px';
                Div.style.height= (1*48-3)+'px';
                Div.style.display = 'table';
                Div.style.verticalAlign = 'middle';
                Div.style.position = 'absolute';
                Div.style.zIndex = 120;
                Div.style.display= 'flex';
                Div.style.alignItems= 'center';
                Div.style.justifyContent= 'space-around';
                Div.style.flexDirection= 'column';
                var n = X%3;
                if(n == 0){
                    Div.style.background='#C4DFB3';//绿
                }else if(n == 1){
                    Div.style.background='#A9D2FF';//蓝
                }else if(n == 2){
                    Div.style.background='#FFB7A6';//红
                }
                document.getElementById("indexTab2").appendChild(Div);
                if(cL == 0){
                    content[X + '_' + Y] = [];
                }
                content[X + '_' + Y][cL] = {_div:Div}//item;
            },



            getDeep:function(node,currentLevel){//深度
                var vm = this;
                var maxDeep = 0;
                currentLevel = currentLevel || 1;
                node.forEach(function(item){
                    if (item.childlist && item.childlist.length != 0){
                        //currentLevel
                        var itemDeep = vm.getDeep(item.childlist,currentLevel + 1);
                        if (maxDeep < itemDeep){
                            maxDeep = itemDeep;
                        }
                    }
                });
                if (maxDeep < currentLevel){
                    maxDeep = currentLevel;
                }
                return maxDeep;
            },//getDeep结束

            markAxis:function(node, axis, count,pk){//标记轴坐标\叶子个数 X
                var vm = this;
                node.forEach(function(item){
                    if (!item.childlist || item.childlist.length == 0 ){
                        item.pos = ++count;
                        axis[item[pk]] = item;//为了构建axis数据对象
                    }else{
                        count = vm.markAxis(item.childlist, axis,count,pk);
                    }
                });
                return count;
            },//markAxis

            markYAxis:function(node, yaxis){//标记轴坐标\叶子个数  把y轴数据放在yAxis对象中 top
                var vm = this;
                var count = -1;
                for(var i=0;i<node.length;i++){
                    node[i].childlist.forEach(function(item,index,arr){
                        item.pos = ++count;//加入 top
                        yaxis[item['pk_level']] = item;//给axis对象添加item属性作为数据(其中包含POS)
                    })
                }
                return count;
            },

            markAxisSon:function(node,count){//子集叶子个数
                var vm = this;
                node.forEach(function(item){
                    if (!item.hasOwnProperty("childlist")|| item.childlist.length == 0){
                        ++count;
                    }else{
                        count = vm.markAxisSon(item.childlist ,count);
                    }
                });
                return count;
            },

            Tab:function(top1,left1,X,Y){//添加表格
                var vm = this;
                for(var i=0;i<=X;i++){//循环x
                    for(var j=0;j<=Y;j++){//循环y
                        var h;//高度
                        var top;
                        if(vm.coincidence.hasOwnProperty(j)){//有重合->div高度为重合数量
                            h = vm.coincidence[j];
                            top = vm.getObj(vm.yAxis,j).top;
                        }else{//没重合->div高度默认为1
                            h = 1;
                            top = vm.getObj(vm.yAxis,j).top;
                        }
                        var left = left1+ i* vm.everyWidth;//120
//                        var top = top1+j*40;
                        top = top1+top*48;
                        vm.DOMTagb("",left,top, vm.everyWidth,"#fff",h);//120
                    }
                }
            },

            DOMTagb:function(jobtypename,left,top, width,bg,h){//添加div
                var Div = document.createElement("div");
                Div.innerHTML = jobtypename;//div内容
                Div.style.width = width + 'px';
                Div.style.left = left +'px';
                Div.style.top =top + 'px';
                Div.style.height = h*48 + 'px';
                Div.style.position = 'absolute';
                Div.style.zIndex = 10;
                Div.style.background = 'bg';
                if(bg !="" || bg!=undefined || bg!="undefined"){
                    Div.style.background = bg;
                }
                document.getElementById("indexTab2").appendChild(Div);
                return Div;
            },
            adjustPos: function (xPos,yPos,points) {
                var vm = this;
                if(points[xPos + '_' + yPos] == undefined ){//如果格子没内容
                    points[xPos + '_' + yPos] = 1;
                }else{//如果格子有内容
                    var p = ++ points[xPos + '_' + yPos];
                    if (vm.coincidence[xPos]==undefined ){//如果第一次重合
                        vm.coincidence[xPos] = 2;
                    }else if(vm.coincidence[xPos] < p){//如果第一次以上重合
                        vm.coincidence[xPos] = p; //vm.coincidence[xPos]+1;
                    }
                }
            },

            ergodic:function(){//遍历内容 得到重合对象
                var vm = this;
                var points = {};
                vm.neirong.forEach(function(item,index,arr){//遍历内容
                    var xItem = vm.xAxis[item.pk_postSeries
                        ];//X轴对象
                    if(xItem != undefined && xItem != 'undefined'){ //如果数据有问题
                        var xPos = xItem.pos;//当前X轴对象的pos
                        if (Array.isArray(item.pk_level)){//如果内容有
                            for (var i=0; i< item.pk_level.length; i++){//遍历
                                var yItem = vm.yAxis[item.pk_level[i]];//y轴对象
                                var yPos = yItem.pos;//当前y轴对象的pos
                                vm.adjustPos(xPos,yPos,points);//Xpos,Ypos,有格子的对象
                            }
                        }else{//如果内容为空
                            var yItem = vm.yAxis[item.pk_level];
                            var yPos = yItem.pos;
                            vm.adjustPos(xPos,yPos, points);
                        }
                    }
                });
            },
            leftXaxis:function(){//为X添加left
                var vm = this;
                for(var item in vm.xAxis){
                    var left = -1;
                    var posD = vm.xAxis[item].pos;
                    for(var i=0;i<=posD;i++){
                        if(!vm.coincidence[i-1]){
                            left = left + 1;
                        }else{
                            left = left + vm.coincidence[i-1];
                        }
                    }
                    vm.xAxis[item].left = left;

                }
            },
            getObj:function(obj, n){
                var i=0;
                for(var k in obj){
                    if(i==n)
                        return obj[k];
                    else
                        i++;
                }
            },
            getLast:function(str){
                var index = str.indexOf("_");
                var str = str.substring(index+1,str.length);
                return str
            },
            getStart:function(str){
                var index = str.indexOf("_");
                var str = str.substring(0,index);
                return str
            },



        }//mounted结束了
    };
</script>
<style>

</style>
