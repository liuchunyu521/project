<template>
	<div class="y-maincontent">
		<!-- y-breadcrumb-box begin -->
		<div class="y-breadcrumb-box">
			<el-breadcrumb separator="/"> 
			  <!--<el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>-->
			  <el-breadcrumb-item>消息中心</el-breadcrumb-item> 
			  <el-breadcrumb-item>通知消息</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- y-breadcrumb-box end -->
		<!-- y-inner begin -->
		<div class="y-inner">
			<div class="y-maintitle">
				通知消息
			</div>
			<!-- y-search-form begin -->
			<el-form :inline="true" :model="searchform" class="demo-form-inline y-search-form">
				<el-form-item label="发送日期">
					<el-select class="y-select" v-model="value" placeholder="请输入查询时间">
					    <el-option class="y-option"
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select> 
				</el-form-item> 
				<el-form-item>
					<el-checkbox class="y-checkbox" v-model="isread">已读</el-checkbox> 
				</el-form-item> 
				<el-form-item>
					<el-button class="y-btn-searchp" type="danger" @click="onSearch">查询</el-button>
				</el-form-item>
				<el-button class=' y-btn-refresh' @click="onRefresh"><i class="iconfont icon-shuaxin"></i>&nbsp;刷新</el-button>
			</el-form>	 
			<!-- y-search-form end --> 			
			<MessageTable ref="InfoMsg" :url="url" :param="searchform" :judgedialog="judgedialog"></MessageTable>  
		</div>
		<!-- y-inner end --> 
	</div>
</template> 
<script>   
	import MessageTable from '@/components/messagecenter/messagelist';
	import Cookies from 'js-cookie';
	export default { 
		components: { 
			MessageTable
		}, 
		computed: {
			url(){  
				return this.$store.state.Interface.msglist;
			} 
		},
		data(){
			return {
				judgedialog:'inform',
				searchform: {
					sendStr: '',
					isRead: false,
					receiver: '',
					transType: 'msglist',
					msgType: 'notice', 
					pageIndex: 0,
					isHandled: false
				},
				options: [{
		          value: 'week',
		          label: '一周内'
		        }, {
		          value: 'one',
		          label: '一个月内'
		        }, {
		          value: 'three',
		          label: '三个月内'
		        }, {
		          value: 'half',
		          label: '半年内'
		        }, {
		          value: 'year',
		          label: '一年内'
		        }], 
		        value:'',
		        isread:''
			}
		},
		methods:{//点击刷新
		    onRefresh(){
		    	this.searchform.sendStr=this.value;//查询的时间
		    	this.searchform.isHandled=this.isHandled;//查询的时候将设置是否为处理状态
		    	
		    	if(this.searchform.isHandled==true){
		    		this.searchform.isRead=true
		    		console.log(this.searchform.isRead)
		    	}else if(this.searchform.isHandled==false){
		    		this.searchform.isRead=false
		    	}
		    	this.$refs.InfoMsg.loadData( this.searchform );  //调用子组件的加载方法
		    },  
		    //点击“查询”
		    onSearch(){ 
		    	this.searchform.sendStr=this.value;//查询的时间
		    	this.searchform.isRead=this.isread; 
		    	console.log(this.searchform.isread)
		    	
		    	if(this.searchform.isRead==true){
		    		this.searchform.isHandled=true
		    	}else if(this.searchform.isRead==false){
		    		this.searchform.isHandled=false
		    	}
		    	this.$refs.InfoMsg.loadData( this.searchform );  //调用子组件的加载方法
		    } 
		},
		created(){ 
//			var UserInfo = JSON.parse( Cookies.get('usermsg'));//获取人员信息
//			this.searchform.receiver=UserInfo.cuserid;
		}
	}
</script>

<style>
	
</style>