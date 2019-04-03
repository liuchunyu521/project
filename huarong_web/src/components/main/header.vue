<template>
	<header class="clearfix y-header">
			<div id="headerlogo">
				<img src="../../assets/img/login-logo.png"/>
				<span id="headersys">人力资源系统</span>
			</div>
			
			<div class="headerdesgiter clearfix">
				<!--search-->
				<div style="float: left;">
					<el-input 
					placeholder="请输入您要搜索的姓名"
					icon="search"
					v-model="searchinner"
					:on-icon-click="handleIconClick">
					</el-input>
				</div>

				<div style="float: left;width: 90px;line-height: 64px;text-align: center;cursor: pointer;">
					<el-col>
						<el-dropdown trigger="click" @command="handleCommand"> 
							<span class="el-dropdown-link">
								<img class="userlogo" v-if="!photodata.photo" src="../../assets/img/peple.png"/>
								<img class="userlogo" v-else :src="'data:image/png;base64,'+photodata.photo"/>
								<!--<i class="el-icon-caret-bottom el-icon--right" style="color:#838A94;"></i>-->
							</span>
							<!--<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="a">暂无开发</el-dropdown-item>
								<el-dropdown-item command="b">账户设置</el-dropdown-item>
								<el-dropdown-item command="c">退出登录</el-dropdown-item>
							</el-dropdown-menu>-->
						</el-dropdown>
					</el-col>
				</div>
			</div>
		</header>
</template>

<script>
export default{
	props:['photodata'],
	data(){
		
		return { 
			searchinner: ''
		}
	},
	methods: {
	    handleIconClick(ev) {
	      if(this.searchinner){
	      	 window.open("http://kms.chamc.com.cn/AddressBook/Personal/Search.html?searchKey="+this.searchinner);
	      }else if(this.searchinner==''){
	      	 window.open("http://kms.chamc.com.cn/AddressBook/Index.html#orgID=ORG100002274");
	      }
	    },
	    handleCommand(command) {
//      	if(command=="c"){
//      		window.localStorage.removeItem('userid')
//
//      		this.$router.push({
//		  			name:'/Login',
//		  		});
//      		
//      	}
      	}
	    
	}
}
</script>
 