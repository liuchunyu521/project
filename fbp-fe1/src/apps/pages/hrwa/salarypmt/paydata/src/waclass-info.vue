
<template>
    <ifbp-page>
        <ifbp-breadcrumb name="薪资核算"></ifbp-breadcrumb>

        <ifbp-button-area>
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <ifbp-main-area type="list">
            <!--<el-row :gutter="10">-->
            <!--<div>-->
            <!--<el-col :xs="24" :sm="12" :md="8" :lg="6"  v-for="(item, index) in list">-->
            <!--<div id="Payrollwh" class="Payroll clearfix" @click="payData(item)">-->
            <!--<div class="Payroll_tittle"><span class="Payroll_tittle_left"><span class="Payroll_tittle_border"></span>{{item.classname}}</span><span class="Payroll_tittle_right">{{item.datastate}}</span></div>-->
            <!--<div class="Payroll_content">-->
            <!--<div class="Payroll_content_org clearfix"><span>所属组织：</span><span class="org">{{item.orgname}}</span></div>-->
            <!--<div class="Payroll_content_date clearfix"><span>最新期间：</span><span class="date">{{item.cyear}}年{{item.cperiod}}月</span></div>-->
            <!--<div class="Payroll_content_org clearfix"><span >发薪人数：</span><span class="org payFifestyle" @click.stop="payFife(item)">{{item.psncount}}</span></div>-->
            <!--<div class="Payroll_content_org clearfix"><span>应发合计：</span><span class="org">{{item.f_1}}</span></div>-->
            <!--<div class="Payroll_content_org clearfix"><span>实发合计：</span><span class="org">{{item.f_3}}</span></div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</el-col>-->
            <!--</div>-->
            <!--</el-row>-->
            <el-row :gutter="10">
                <div>
                    <el-col :xs="24" :sm="12" :md="8" :lg="6"  v-for="(item, index) in list">
                        <div id="Payrollwh" class="Payroll clearfix" @click="payData(item)" @mouseenter="enter(index)" @mouseleave="leave(index)">
                            <div class="date">{{item.cyear}}/{{item.cperiod}}<span class="angle"></span><span class="angle1"></span></div>
                            <div class="jobwrap clearfix"><span class="job">{{item.classname}}</span><span class="num" title="调整发薪人员"><span class="payFifestyle"  @click.stop="payFife(item)" >{{item.psncount}}</span><span class="rem">人</span></span></div>
                            <div class="dept" :title="item.orgname">{{item.orgname}}</div>
                            <div class="now_state">
                                <!--<img style="width: 45px;height: 45px;" v-if="item.states.cum=='1'" :src="calculate" alt="" />
                                <img style="width: 42px;height: 50px;" v-if="item.states.app=='1'" :src="check" alt="" />
                                <img style="width: 50px;height: 50px;" v-if="item.states.send=='1'" :src="payroll" alt="" />
                                <img style="width: 50px;height: 50px;" v-if="item.states.over=='1'" :src="accounts" alt="" />-->
                                <i class="ifbp-icon-calculator" style="font-size: 60px;color: #F0F0F5 ;" v-if="item.states.cum=='1'"></i>
                                <i class="ifbp-icon-find-in-page" style="font-size: 60px;color: #F0F0F5 ;" v-if="item.states.app=='1'"></i>
                                <i class="ifbp-icon-payroll" style="font-size: 60px;color: #F0F0F5 ;" v-if="item.states.send=='1'"></i>
                                <i class="ifbp-icon-accounts" style="font-size: 60px;color: #F0F0F5 ;" v-if="item.states.over=='1'"></i>
                                <div class="now_state_text" v-if="item.states.cum=='1'">待计算</div>
                                <div class="now_state_text" v-if="item.states.app=='1'">待审核</div>
                                <div class="now_state_text" v-if="item.states.send=='1'">待发放</div>
                                <div class="now_state_text" v-if="item.states.over=='1'">待结账</div>
                            </div>
                            <div class="progress_state" v-if="isShow == index">
                            <!--<div class="progress_state">-->
						    	<ul class="wrap">
									<el-row>
										<el-col :span='6'>
											<li :class="item.states.cum=='1'||item.states.cum=='0' ? 'style':''" class="style" style="z-index: 5;">计算<span class="span" :class="item.states.cum=='1'||item.states.cum=='0' ? 'styleright':''"></span></li>
										</el-col>
										<el-col :span='6'>
											<li :class="item.states.app=='1'||item.states.app=='0' ? 'style':''" style="z-index: 4;">审核<span class="span" :class="item.states.app=='1'||item.states.app=='0' ? 'styleright':''"></span><span  class="span1"></span></li>
										</el-col>
										<el-col :span='6'>
											<li :class="item.states.send=='1'||item.states.send=='0' ? 'style':''" style="z-index: 3;">发放<span class="span" :class="item.states.send=='1'||item.states.send=='0' ? 'styleright':''"></span><span class="span1"></span></li>
										</el-col>
										<el-col :span='6'>
											<li :class="item.states.over=='1' ? 'style':''" style="z-index: 2;">结账<span class="span1"></span></li>
										</el-col>
									</el-row>
								</ul>
    						</div>
                        </div>
                    </el-col>
                </div>
            </el-row>
            <!--分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[12, 24, 36, 48]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>

    import duiImage from "../img/dui.png";
    import ksuoImage from "../img/ksuo.png";
    import bsuoImage from "../img/bsuo.png";
    import application from "../img/application.png";
    import accounts from "../img/accounts.png";
    import approve from "../img/approve.png";
    import calculate from "../img/calculate.png";
    import check from "../img/check.png";
    import payroll from "../img/payroll.png";

    export default {
        data() {
            return {

                "list": [],
                totalElements: 0,
                currentPage: 1,
                bsuoImage:bsuoImage,
                duiImage:duiImage,
                ksuoImage:ksuoImage,
                application:application,
                accounts:accounts,
                approve:approve,
                calculate:calculate,
                check:check,
                payroll:payroll,
                isShow:null,
                size: 10,
                // 查询模板传入参数
                tplCode:'60130paydataclass',
                searchTemplate: {},

                bgcolor:{
                    "01":"#F8776E",
                    "02":"#F5C119",
                    "03":"#F5C119",
                    "04":"#9AC342",
                    "05":"#7CC29C",
                    "06":"#4EC1E0",
                    "07":"#6FB4FF",
                    "08":"#3680BA",
                    "09":"#abaaea",
                    "10":"#AF81DC",
                    "11":"#DC66B7",
                    "12":"#c0c0c0",
                }
            };
        },
        created() {
            this.request();
        },
        methods: {
            payFife(data){
                var pk_org = data.pk_org;
                var pk_wa_class = data.pk_wa_class;
                var cyear = data.cyear;
                var cperiod = data.cperiod;
                var orgname = data.orgname;
                var classname = data.classname;
                var datastate = data.datastate;

//                this.$router.push("/hrwa/payFile/payFileInfo/"+pk_org+"/"+pk_wa_class+"/"+cyear+"/"+cperiod+"/"+orgname+"/"+classname+"/"+datastate) ;

                var queryParma = {funcode:'60130payfile',pk_org:pk_org,pk_wa_class:pk_wa_class,cyear:cyear,cperiod:cperiod,classname:classname,orgname:orgname};//,datastate:datastate
                this.$router.push({path:"/hrwa/payFile/payFileInfo", query:queryParma}) ;
            },
            payData(data){
                var psncount = data.psncount;

                if(psncount ==0 && (data.collectflag=='N' || data.collectflag=='n')){
                    this.$confirm('【'+data.classname+'】尚未添加发薪人员，请增加发薪人员后再进行薪资核算。', '提示', {
                        confirmButtonText: '添加发薪人员',
                        cancelButtonText: '取消',
                        closeOnClickModal:false,

                        type: 'warning'
                    }).then(() => {
                        // 这里是以前的删除的逻辑
                        this.payFife(data);
                    }).catch(() => {
                        // 这里加取消逻辑
                    });
                }else{
                    var pk_org = data.pk_org;
                    var pk_wa_class = data.pk_wa_class;
                    var cyear = data.cyear;
                    var cperiod = data.cperiod;
                    var classname = data.classname;

                    var queryParma = {funcode:'60130paydata',pk_org:pk_org,pk_wa_class:pk_wa_class,cyear:cyear,cperiod:cperiod,classname:classname};
//                    this.$router.push("/hrwa/paydata/info/"+pk_org+"/"+pk_wa_class+"/"+cyear+"/"+cperiod+"/"+classname) ;
                    this.$router.push({path:"/hrwa/paydata/info", query:queryParma}) ;
                }

            },
            request(n,s){
                var pn = 1;
                var ps =12 ;

                if(n){
                    pn = n;
                }
                if(s){
                    ps = s;
                }
                var url = "/hrwa/payData/listWaClass";
                var params  = {pn : pn,ps : ps};
                this.$http({
                    url: url,
                    method: "post",
                    params : params,
                    data : this.searchTemplate
                }).then((res) => {
                    this.list = res.data.data.content;
                    this.totalElements = res.data.data.totalElements;
                    this.size = res.data.data.size;
                    this.currentPage = res.data.data.number;

                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },
            enter(index){
                this.isShow = index;

            },
            leave(index){
                this.isShow = null;

            },
            advancedSearch(searchTemplate){
                this.searchTemplate = searchTemplate;
                this.request();
            }

        }
    };
</script>
<style scoped="scoped">
    .el-row>div{
        overflow: inherit;
    }
    .Payroll {
        border-radius: 4px;
        margin-bottom: 16px;
        border: 1px solid #E7E7E7;
        background: #fff;
        /*padding-bottom: 10px;*/
        height: 150px;
        position: relative;
        margin-left: 3px;
        margin-right: 3px;
    }
    .Payroll .date {
        width: 100px;
        /* background: #6FB4FF;*/
        border-radius: 4px 0 0 0;
        color: #fff;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        margin-bottom: 12px;
        margin-left: 16px;
    	margin-top: 16px;
    }
    .Payroll .date .angle {
        width:0;
        height:0;
        border-width:15px 20px 15px 29px;
        border-style:solid;
        border-color:transparent #fff transparent transparent;/*透明 灰 透明 透明 */
        position: absolute;
        right: 0px;
        top: 0px;
    }
    .Payroll .date .angle1 {
        width:0;
        height:0;
        border-width:15px 20px 15px 29px;
        border-style:solid;
        border-color:transparent #fff transparent transparent;/*透明 灰 透明 透明 */
        position: absolute;
        right: 0px;
        top: 0px;
    }
    .Payroll:hover .angle1 {
        border-color:transparent rgba(243,246,249,0.50) transparent transparent;/*透明 灰 透明 透明 */
    }
    .Payroll:hover {
        background: rgba(243,246,249,0.50);
        border: 1px solid #F0F0F5;
        box-shadow: 0 2px 4px 0 #E2E8EF;
        border-radius: 4px;
    }
    .Payroll:hover .now_state_text{
        display: none;
    }
    .Payroll:hover .payFifestyle{
        text-decoration: underline;
    }
    .Payroll .jobwrap {
        margin-left: 16px;
        margin-bottom: 12px;
        
    }
    .Payroll .jobwrap .job{
    	width: 74%;
        font-size: 18px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 19px;
        float: left;
        overflow: hidden;
	    text-overflow: ellipsis;
	    display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 
    }
    .Payroll .jobwrap .num {
        font-size: 20px;
        color: #3896FC;
        letter-spacing: 0;
        text-align: right;
        line-height: 20px;
        float: right;
        margin-right: 16px;
        position: relative;
        top: -30px;
    }
    .Payroll .jobwrap .num .rem {
        font-size: 14px;
        color: #3896FC;
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
    }
    .Payroll .dept {
    	width: 75%;
        text-indent: 16px;
        font-size: 14px;
        color: #75787B;
        letter-spacing: 0;
        line-height: 14px;
        margin-bottom: 24px;
        overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
    }
    .Payroll .progress {
        text-indent: 16px;
        margin-bottom: 16px;
        position: absolute;
        bottom: 0px;
    }
    .Payroll .progress img{
        width: 20px;
        height: 20px;
    }
    .Payroll .progress .list {
        float: left;
        text-align: center;
    }
    .Payroll .progress .border {
        background: #D3D3D3;
        width: 49px;
        margin-bottom: 10px;
        margin-top: 10px;
        border-bottom: 1px solid #D3D3D3;
        float: left;
        margin-left: -5px;
        margin-right: -16px;
    }
    .Payroll .progress .list .compute {
        font-size: 12px;
        color: #333333;
        text-align: right;
        line-height: 12px;
    }
    .clearfix:after {
        content: "";
        display: block;
        clear: both;
    }
    .payFifestyle {
        cursor:pointer; 
    }
    .now_state{
        width: 60px;
        height: 60px;
        text-align: center;
        float: right;
        position: absolute;
		right: 16px;
		bottom: 45px;
    }

    .now_state_text{
        width: 60px;
        height: 18px;
        line-height: 18px;
        background: #A6B7CB;
        border-radius: 2px;
        color: white;
        margin-top: 5px;
        /*position: relative;
        right: 12px;
        bottom: 70px;*/
    }
    .progress_state{
    	position: absolute;
    	width: 90%;
    	bottom: 16px;
    	padding: 0 16px;
    }
	.progress_state .wrap {
		height: 18px;
		background: #fff;
		overflow: hidden;
		padding-right: 5px;
	}
	.progress_state .clearfix:after{
		display: block;
		clear: both;
		content: "";
	}
	.progress_state .wrap li {
		height: 18px;
		line-height: 18px;
		/*float: left;*/
		/*width: 80px;*/
		color: #fff;
		background: #D0D0D0;
		position: relative;
		border-radius: 9px;
		text-align: center;
		margin-right: -5px;
	}
	.progress_state .span {
		position: absolute;
		right: -6px;
		top: -7px;
		border-width: 16px 0 16px 16px;
	    border-color: transparent transparent transparent #D0D0D0;
	    border-style: dashed dashed dashed solid;
	}
	.progress_state .span1{
		position: absolute;
		left: -1px;
		top: -7px;
		border-width: 16px 0 16px 16px;
	    border-color: transparent transparent transparent #fff;
	    border-style: dashed dashed dashed solid;
	}
	.progress_state .wrap .style {
		background: #51C781;
	}
	.progress_state .styleright {
		border-width: 16px 0 16px 16px;
	    border-color: transparent transparent transparent #51C781;
	    border-style: dashed dashed dashed solid;
	}
</style>
