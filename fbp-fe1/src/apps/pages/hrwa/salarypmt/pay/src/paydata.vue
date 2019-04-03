<template>
    <ifbp-page :noPadding="true">
	    <!-- 节点title  liuchym-->
	    <ifbp-breadcrumb name="薪资核发" v-show="false"></ifbp-breadcrumb>
        <md-layout ref="mdLayout" :aside-width="asideWidth" @showMastList="showMastList">
          <div slot="master">
              <md-page>
                 <h4 slot="title" class="header-title">薪资核发({{leftSideArr.length}})
                    <i class="toggle-icon ifbp-icon-format-indent-decrease" @click="toggleLeft"></i>
                 </h4>
                 <div slot="content">
                 	 <div style="padding: 8px;border-bottom: 1px solid #E6E6EB;">
		                <hr-org-cascader name="hrwawaclasslist"
                                :pk_org="pk_org"
                                @update:pk_org="updateOrgPk"
                                :needDept="false"
                                @change="handleTreeChange"
                                :needGroup="false"
                                busiRegion="salary"
                                >
                        </hr-org-cascader>
                   	</div>
                    <ul>
                    	<div v-show="leftSideArr.length=='0'"  style="text-align: center;line-height: 48px;color: #666;font-size: 16px;">
                    		暂无发薪方案
                    	</div>
                      <li class="aside-item" v-for="(item,index) in leftSideArr" :key="index" @click="handleClickItem(item,index)" :class="{'aside-itembackground':clickcolor==index}">
                        <h4 class="aside-item-hd">{{item.cyear}}/{{item.cperiod}}<!--<span>{{item.psncount}}人</span>--></h4>
                        <div class="aside-item-info" :title="item.classname">
                            {{item.classname}}
                        </div>
                        <p class="aside-item-state">{{item.datastate}}</p>
                      </li> 
                    </ul>
                 </div>
                 <!-- 页脚右侧按钮 -->
                 <!--<div slot="footer">
                    <el-dropdown slot="left">
                      <i class="ifbp-icon-filter footer-icon"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>汇总方案</el-dropdown-item>
                        <el-dropdown-item>其他方案</el-dropdown-item>
                        <el-dropdown-item>非汇总方案</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>      
                 </div>  -->
              </md-page>
          </div>
          <span slot="detail" >
              <!-- 右侧详情页面 -->
              <md-page :showFooter="true" :showExpandbtn="true" :container-class="topClass " style="position: relative;">
                  <span slot="title" class="header-title">
                  	<div v-if="mdpagerightshow">
                  		<div style="position: absolute;" :style="{'left':toggleLeftflag==true ? '17px':'44px'}">
                  		<!--<div style="position: absolute;left:44px" >-->
              				<el-dropdown @command="selectCurrPeriod">
								  <span class="el-dropdown-link" style="line-height: 12px;margin-top: 16px;">
								    {{cyear}}/{{cperiod}}<i class="el-icon-caret-bottom el-icon--right"></i>
								  </span>
								  <el-dropdown-menu slot="dropdown">
								     <el-dropdown-item v-for="item in periods" :command="item">{{item.substr(0,4)}}/{{item.substr(4)}}</el-dropdown-item>
								  </el-dropdown-menu>
							</el-dropdown>
              			</div>
                  		<span @click="payplan()" :title="classname" class="classnameplan" style="font-size: 18px;color: #5CB0E6;margin-top: 2px;">{{classname}}</span>
                  		<div style="position: absolute;right: 30px;top: 0px;">{{classstate}}</div>
                  	</div>
                  </span>
                  <div slot="content">
                  	<!--公共部分排版 -->
                  	<div>
                  		<div v-show="mdpagerightshow==false" style="position: relative;text-align: center;width: 100%;">
                  			<div style="position: absolute;left: 50%;margin-left: -180px;margin-top: 162px;">
                  				<div>
	                  				<i style="color: #C8C8CD;font-size: 100px;margin-bottom: 42px;" class="ifbp-icon-copy"></i>
	                  			</div>
	                  			<div style="color: #75787B;font-size: 20px;">暂无发薪数据，请前往<span @click="payplan()" style="color: #0089FA;cursor: pointer;">薪资方案</span>进行设置</div>
                  			</div>
                  		</div>
                  		<div v-if="mdpagerightshow">
		                  
		                  	<div class="stepwrap" style="background: rgba(90,200,250,0.10);box-shadow: 0 1px 0 0 #E6E6EB;">
		                  		<div v-if="stepresh">
									<ifbp-steps-extend :stepClickIndex="stepClickIndex" v-if="isneedapprove==true" :active="active" :ifbp-steps-data="ifbpStepsData" @step-click="stepClick"></ifbp-steps-extend>
								</div>
								<div v-if="stepresh">
									<ifbp-steps-extend :stepClickIndex="stepClickIndex" v-if="isneedapprove==false" :active="active" :ifbp-steps-data="noifbpStepsData" @step-click="stepClick"></ifbp-steps-extend>
		                  		</div>
		                  	</div>
		                  	<div v-if="isneedapprove==false">
		                  		<!--人员页面-->
			                  	<div v-if="nextshow==1">
			                  		<psnList ref="payFileListRef" @psnqueryWaClass="psnqueryWaClass()" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @changeWaState='psnChildrenWaState' ></psnList>
			                  	</div>
			                  	<!--计算页面-->
								 <div  v-if="nextshow==2">
								 	<calList  ref="paycalListRef" @changeWaState='childrenWaState' :leftSideArrindex='leftSideArrindex' :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></calList>
								 </div>
								 <!--审核页面-->
								 <div  v-if="nextshow==3">
								 	<checkList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></checkList>
								 </div>
								 <!--发放页面-->
								 <div  v-if="nextshow==4">
								 	<payList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" :classname="classname"></payList>
								 </div>
								  <!--结账页面-->
								 <div  v-if="nextshow==5">
								 	<endList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></endList>
								 </div>
		                  	</div>
		                  	<div v-if="isneedapprove==true">
		                  		<!--人员页面-->
			                  	<div v-if="nextshow==1">
			                  		<psnList ref="payFileListRef" @psnqueryWaClass="psnqueryWaClass()" :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" @changeWaState='psnChildrenWaState' ></psnList>
			                  	</div>
			                  	<!--计算页面-->
								 <div  v-if="nextshow==2">
								 	<calList  ref="paycalListRef" @changeWaState='childrenWaState' :leftSideArrindex='leftSideArrindex' :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></calList>
								 </div>
								 <!--审核页面-->
								 <div  v-if="nextshow==3">
								 	<checkList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></checkList>
								 </div>
								 <!--申请页面-->
								 <div  v-if="nextshow==4">
								 	<applyList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></applyList>
								 </div>
								 <!--发放页面-->
								 <div  v-if="nextshow==5">
								 	<payList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" :classname="classname"></payList>
								 </div>
								  <!--结账页面-->
								 <div  v-if="nextshow==6">
								 	<endList :pk_org="pk_org" @changeWaState='childrenWaState' :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod"></endList>
								 </div>
		                  	</div>
		                  </div>
		                </div>
		                
	                  <!--<template slot="footer">
	                    <el-button type="primary" style="margin-right:10px;" @click="logSth('import')">导出</el-button>
	                    <el-button type="default" style="margin-right:10px;" @click="logSth('test')">测试</el-button>
	                  </template>-->
                  		
                  	</div>
                  	
              </md-page>
          </span>
        </md-layout>
    </ifbp-page>
</template>
<script>
     import MdLayout from 'ifbp-business/mdlayout';
     import MdPage from 'ifbp-business/mdpage';
     import MdChildPage from 'ifbp-business/mdchildpage';
 	 import psnList from './psn.vue';
 	 import applyList from './apply.vue';
 	 import calList from './cal.vue';
 	 import checkList from './check.vue';
 	 import endList from './end.vue';
    import payList from './pay.vue';
    let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

  export default {
    components:{
      "md-layout" : MdLayout,
      "md-page" : MdPage,
      "md-child-page" : MdChildPage, 
      "psnList" : psnList,
      "applyList" :applyList,
      "calList":calList,
      "checkList":checkList,
      "endList":endList,
      "payList":payList,
       "hr-org-cascader":HrOrgCascader,
    },
    
    data(){
      return {
      	// 
      	toggleLeftflag:true,
      	pk_org : '',
      	pk_wa_class:'',
      	cyear : '',
      	cperiod : '',
        classname:'',//薪资方案名称
        classstate:'',//薪资方案状态
        periods :'',//选中左侧的方案后，对应该方案下的所有期间
        isneedapprove:false,
      	//end
      	nextshow:1,
        leftSideArr:[],
        leftSideArrindex:0,//记录目前点击的是第几个，初始为零
        asideWidth:320,//左侧分屏宽度
        orgTreeData: [],
        selectedTreeNode: [],
 		clickcolor:-1,
 		topClass:['topClass'],//资金核发详情背景色
 		active: 1,//当前激活步骤
 		stepClickIndex:'',//步骤选中的状态
 		stepresh:false,//步骤条重新渲染
 		mdpagerightshow:'',//右侧内容区显示隐藏
 		noifbpStepsData:[
 		 {
          "title":'人员',
          "icon":'hr-icon-people'
          },
 		  {
          "title":'计算',
          "icon":'ifbp-icon-calculator'
          },
           {
          "title":'审核',
          "icon":'ifbp-icon-find-in-page'
          },
           {
          "title":'发放',
          "icon":'ifbp-icon-payroll'
          },
           {
          "title":'结账',
          "icon":'ifbp-icon-accounts'
          },
 		],
 		ifbpStepsData:[
 		 {
          "title":'人员',
          "icon":'hr-icon-people'
          },
 		  {
          "title":'计算',
          "icon":'ifbp-icon-calculator'
          },
           {
          "title":'审核',
          "icon":'ifbp-icon-find-in-page'
          },
           {
          "title":'申请',
          "icon":'ifbp-icon-assignment'
          },
           {
          "title":'发放',
          "icon":'ifbp-icon-payroll'
          },
           {
          "title":'结账',
          "icon":'ifbp-icon-accounts'
          },
 		]
      };
    },
    mounted(){
    	// this.getOrgTreeData();
    },
    methods: {
    	payplan(){
    		//方案跳转
    		this.$router.push({path:"/hrwa/waclass?funcode=60130waclass"});
    	},
    	//	stepsLength(步骤条的长度), clickIndex(当前点击的步骤条的下标加1)
    	stepClick(stepsLength,clickIndex){
    		console.log(clickIndex)
    		this.nextshow=clickIndex;
		 	this.stepClickIndex = clickIndex;
//        	alert(this.active+"||"+this.stepClickIndex+"||"+	this.nextshow);

        },
        
        updateOrgPk(val){
            this.pk_org = val;
        },
            //组织树切换组织
        handleTreeChange() {
            this.queryWaClass(this.pk_org);
        },
		// getOrgTreeData(){
		//     this.$http({
	    //             url: '/hrwa/salarymgt/payData/payData/getOrgTreeData',
	    //             method: "post",
	    //             params: '',
	    //         }).then((res) => {
	    //             if (res.data.success) {
	    //                 this.orgTreeData = res.data.data.orgtreedata;
	    //                 let defaultnode = res.data.data.defaultorgpk;
	    //                 this.pk_org = defaultnode[defaultnode.length - 1];
        //                 this.selectedTreeNode = defaultnode;
    	// 				this.queryWaClass(this.pk_org);//查询左侧列表
    					
    					
	    //             } else if (res.data.error && res.data.error.errorMessage) {
	    //                 console.log('树获取失败', JSON.stringify(res.data.error));
	    //                 this.$message({
	    //                     message: '树获取失败: ' + res.data.error.errorMessage,
	    //                     type: 'error'
	    //                 });
	    //             }
	    //         }).catch((e) => {
	    //             console.log(e);
	    //             this.$message.error('请求出错');
	    //         });
		// },
       	// handleTreeChange(treeItem) {
        //     if (Array.isArray(treeItem) && treeItem.length) {
        //         let pk_org = treeItem[treeItem.length - 1];
        //         this.pk_org = pk_org;
        //         this.queryWaClass(pk_org);
        //     } else {
        //     }
        // },
        psnqueryWaClass(){//人员重新请求数据
        	 this.$http({
	                url: '/hrwa/salarymgt/payData/payData/listWaClass',
	                method: "post",
	                params: {pk_org:this.pk_org},
	            }).then((res) => {
	                if (res.data.success) {
	                     this.leftSideArr = res.data.data;
	                     
	                     if(this.leftSideArr.length=='0'){
	                     	this.mdpagerightshow=false;
	                     }else {
	                     	this.mdpagerightshow=true;
	                     	var item=this.leftSideArr[0];
	    					this.pk_wa_class = item.pk_wa_class;
				        	this.cyear = item.cyear;
				        	this.cperiod = item.cperiod;
				        	this.classname =item.classname;
				       		this.classstate = item.datastate;
				       		this.isneedapprove=item.isneedapprove
				       		this.clickcolor = 0;
	    					this.queryPeriod();//查询右侧列表；
	    					this.active=item.activeStep;
	                     }
	                     
	                } else{
	                    this.$message({
	                        message:res.data.msg,
	                        type: 'error'
	                    });
	                }
	            }).catch((e) => {
	                this.$message({
	                        message:"查询该组织下的薪资方案失败",
	                        type: 'error'
	                });
	            });
        },
        queryWaClass(pk_org){
        	 this.$http({
	                url: '/hrwa/salarymgt/payData/payData/listWaClass',
	                method: "post",
	                params: {pk_org:pk_org},
	            }).then((res) => {
	                if (res.data.success) {
	                     this.leftSideArr = res.data.data;
	                     
	                     if(this.leftSideArr.length=='0'){
	                     	this.mdpagerightshow=false;
	                     }else {
	                     	this.mdpagerightshow=true;
	                     	var item=this.leftSideArr[0];
	    					this.pk_wa_class = item.pk_wa_class;
				        	this.cyear = item.cyear;
				        	this.cperiod = item.cperiod;
				        	this.classname =item.classname;
				       		this.classstate = item.datastate;
				       		this.isneedapprove=item.isneedapprove
				       		this.clickcolor = 0;
	    					this.queryPeriod();//查询右侧列表；
	    					this.active=item.activeStep;
	    					this.stepClickIndex=item.activeStep;
	    					this.nextshow=item.activeStep;
	                     }
	                     
	                } else{
	                    this.$message({
	                        message:res.data.msg,
	                        type: 'error'
	                    });
	                }
	            }).catch((e) => {
	                this.$message({
	                        message:"查询该组织下的薪资方案失败",
	                        type: 'error'
	                });
	            });
        },
        selectCurrPeriod(cmd){
        	this.cyear = cmd.substr(0,4);
        	this.cperiod = cmd.substr(4);
        	this.changeWaState(this.pk_org,this.pk_wa_class,this.cyear,this.cperiod);
        },
      	handleFirstChild(){
        	this.$refs.firstPanel.showChildPage();
     	},
     	handleSecondChild(){
        	this.$refs.secondPanel.showChildPage();
      	},
      	handleThirdChild(){
        	this.$refs.thirdPanel.showChildPage();
        },
      	handleCancel1(){
      	  this.$refs.firstPanel.hideChildPage();
     	},
      	handleCancel2(){
        	this.$refs.secondPanel.hideChildPage();
      	},
     	handleCancel3(){
        	this.$refs.thirdPanel.hideChildPage();
     	},
      	handleClickItem(item,index){
      		this.stepresh=false;
      		this.leftSideArrindex=index;
        	this.pk_wa_class = item.pk_wa_class;
        	this.cyear = item.cyear;
        	this.cperiod = item.cperiod;
        	this.classname =item.classname;
       		this.classstate = item.datastate;
       		this.isneedapprove=item.isneedapprove;
       		this.clickcolor = index;
       		this.mdpagerightshow='';
       		this.active=item.activeStep;
       		this.stepClickIndex=item.activeStep;
       		this.nextshow=item.activeStep;//切换的时候永远都是保证步骤末端
       		this.queryPeriod();
       		
      	},
      	//方案状态改变
      	childrenWaState(){
      		 this.stepresh=false;
      		 this.$http({
	                url: '/hrwa/salarymgt/payData/payData/getClassState',
	                method: "post",
	                params: {
	                	pk_org:this.pk_org,
	                	pk_wa_class:this.pk_wa_class,
	                	cyear:this.cyear,
	                	cperiod :this.cperiod
	                },
	            }).then((res) => {
	                if (res.data.success) {
	                      this.classstate = res.data.data.stateName;
	                      this.leftSideArr[this.leftSideArrindex].datastate=res.data.data.stateName;//改变列表的状态
	                      this.leftSideArr[this.leftSideArrindex].activeStep = res.data.data.activeStep;
	                      this.isneedapprove=res.data.data.isneedapprove;
	                      this.active=res.data.data.activeStep;
	                      this.stepClickIndex=res.data.data.activeStep;
	                      this.nextshow=res.data.data.activeStep;
	                      this.stepresh=true;
	                } else{
	                    this.$message({
	                        message:res.data.msg,
	                        type: 'error'
	                    });
	                }
	            }).catch((e) => {
	                this.$message({
	                        message:"查询薪资状态失败",
	                        type: 'error'
	                });
	            });
      	},
      	
      		//方案状态改变
      	psnChildrenWaState(){
      		 this.stepresh=false;
      		 this.$http({
	                url: '/hrwa/salarymgt/payData/payData/getClassState',
	                method: "post",
	                params: {
	                	pk_org:this.pk_org,
	                	pk_wa_class:this.pk_wa_class,
	                	cyear:this.cyear,
	                	cperiod :this.cperiod
	                },
	            }).then((res) => {
	                if (res.data.success) {
	                      this.classstate = res.data.data.stateName;
	                      this.leftSideArr[this.leftSideArrindex].datastate=res.data.data.stateName;//改变列表的状态
	                      this.leftSideArr[this.leftSideArrindex].activeStep = res.data.data.activeStep;
	                      this.isneedapprove=res.data.data.isneedapprove;
	                      if(this.active == res.data.data.activeStep){//状态没变，不做处理，还停在当前页面,只是刷新当前页面的数据
								 this.$refs.payFileListRef.request();
	                      }else{
  		                      	this.active=res.data.data.activeStep;//点亮的步骤
		                      	this.stepClickIndex=res.data.data.activeStep;//选中的步骤
		                      	this.nextshow=res.data.data.activeStep;//加载的页面
	                      }

	                      this.stepresh=true;
	                } else{
	                    this.$message({
	                        message:res.data.msg,
	                        type: 'error'
	                    });
	                }
	            }).catch((e) => {
	                this.$message({
	                        message:"查询薪资状态失败",
	                        type: 'error'
	                });
	            });
      	},
      	
      	//方案状态改变
      	changeWaState(pk_org,pk_wa_class,cyear,cperiod){
      		 this.stepresh=false;
      		 this.$http({
	                url: '/hrwa/salarymgt/payData/payData/getClassState',
	                method: "post",
	                params: {
	                	pk_org:pk_org,
	                	pk_wa_class:pk_wa_class,
	                	cyear:cyear,
	                	cperiod :cperiod
	                },
	            }).then((res) => {
	                if (res.data.success) {
	                      this.classstate = res.data.data.stateName;
//	                      this.leftSideArr[this.leftSideArrindex].datastate=res.data.data.stateName;//改变列表的状态
						  this.isneedapprove=res.data.data.isneedapprove;
	                      this.active=res.data.data.activeStep;
	                       this.stepClickIndex=res.data.data.activeStep;
	                       this.nextshow=res.data.data.activeStep;
	                       this.stepresh=true;
	                } else{
	                    this.$message({
	                        message:res.data.msg,
	                        type: 'error'
	                    });
	                }
	            }).catch((e) => {
	                this.$message({
	                        message:"查询薪资状态失败",
	                        type: 'error'
	                });
	            });
      	},
      	queryPeriod(){
      		   	 this.$http({
	                url: '/hrwa/salarymgt/payData/payData/queryPeriod',
	                method: "post",
	                params: {
	                	pk_org:this.pk_org,
	                	pk_wa_class:this.pk_wa_class,
	                	cyear:this.cyear,
	                	cperiod : this.cperiod
	                },
	            }).then((res) => {
	                if (res.data.success) {
	                	  this.mdpagerightshow=true;
	                      this.periods = res.data.data;
	                      this.stepresh=true;
	                } else{
	                    this.$message({
	                        message:res.data.msg,
	                        type: 'error'
	                    });
	                }
	            }).catch((e) => {
	                this.$message({
	                        message:"查询该薪资方案下的期间失败",
	                        type: 'error'
	                });
	            });
      	},
      	handleCloseChild(){
        	console.log("已关闭--do sth");
      	},
      	logSth(msg){
       	 console.log(msg);
      	},
      	showMastList(){//左侧点击出发事件
      		this.toggleLeftflag =true;
      	},
      // 切换左侧边栏
     	toggleLeft(){
     		this.toggleLeftflag =false;
        	this.$refs.mdLayout.toggleLeft();
      	}
    }
  }
</script>
<style>
	
	.mdlayout-wrapper .ifbp-footer{
	    position:absolute;
	}
 /* 左侧样式 */
  .aside-item{
    list-style: none;
    height:94px;
    position:relative;
    padding:16px;
    border-bottom:1px solid #E6E6EB;
    cursor: pointer;
  }
  .aside-itembackground{
  	background: rgba(90, 200, 250, 0.1);
  }
  .aside-item-hd{
    line-height: 14px;
    font-size:14px;
    color:#75787B;
    margin-bottom: 9px;
  }
  .aside-item-hd>span{
    font-size:18px;
    font-weight:500;
    color: #FF3B30;
    float:right;
  }
  .aside-item-info{
  	width: 80%;
    font-size: 18px;
    color: #2D2D2D;
    letter-spacing: 0;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	-webkit-line-clamp:2; 
  }
  .aside-item-state{
    float:right;
    font-size: 14px;
    color: #75787B;
    letter-spacing: 0;
    text-align: right;
    line-height: 14px;
    position: absolute;
    right: 16px;
    bottom: 16px;
  }
  .stepwrap .el-steps.ifbp-steps {
  
  	padding-left:16px !important;
  }
  /*.stepwrap .el-step__head.is-text.is-extend {
  	background-color: transparent;
  }*/
  .footer-icon{
    color:#fff;
    cursor:pointer;
  }
  .L_paydatalist .yon-uitemplate{
  	margin-top: 0;
  	padding: 16px 24px 16px 24px;
  }
  .topClass .mdlayout-page-header{
  	background: rgba(90,200,250,0.10);
  }
  .classnameplan {
  	width: 60%;
  	display: inline-block;
  	overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .classnameplan:hover{
  	text-decoration: underline;
  	cursor: pointer;
  }
</style>
