<template>
	<div class="index">
		<my-Header :photodata='photo'></my-Header>
		<!--content begin -->
		<div class="y-main">
		<el-row type="flex" :gutter="20" >
			<el-col :span='4'  class="y-navbar">
				<nav-Bar :navdata="navdata"></nav-Bar>
			</el-col>
			<el-col :span='20' class="y-content">
				<router-view></router-view>
			</el-col>
		</el-row>
		</div>
		<!--content end -->
	</div>
</template>

<script>
import myHeader from './header';
import navBar from './navbar';
import Cookies from 'js-cookie';
import Qs from 'qs';
//	var store=require('store')
export default {
  	name: 'index',
  	components: {
		myHeader, //顶部
		navBar //左侧菜单
	},
	data () {
	    return {
	    	navdata:"",
	    	data:'',
	    	photo:''
	    }
	},
	methods:{
		navfunc(){
			//权限判断 初始获取数据
	//		var userid=JSON.parse(Cookies.get('usermsg'));
			//发送请求
			//左侧菜单权限设置；
	//		var data=_func.func;
			var data=this.data;
			var data1={
				"E90102":{"icon":"iconfont icon-xiaoxi","url":"", id: 'E90102', pid: '0',text:'消息中心'},
				"E9010202":{"icon":"iconfont icon-renshihangzhengshi","url":"/Informmessagelist", id: 'E9010202', pid: 'E90102',text:'通知消息'},
				"E9010204":{"icon":"iconfont icon-renshihangzhengshi","url":"/Handlemessagelist", id: 'E9010204', pid: 'E90102',text:'工作任务'},
				"E9010206":{"icon":"iconfont icon-renshihangzhengshi","url":"/Warningmessagelist", id: 'E9010206', pid: 'E90102',text:'预警消息'},
				"E90104":{"icon":"iconfont icon-renshihangzhengshi","url":"", id: 'E90104', pid: '0',text:'人员信息'},
				"E9010402":{"icon":"","url":"/myInfo", id:'E9010402', pid: 'E90104',text:'我的信息'},
				"E90106":{"icon":"iconfont icon-xinzi","url":"", id: 'E90106', pid: '0',text:'我的薪资'},
				"E9010602":{"icon":"","url":"/mySalary", id:'E9010602', pid: 'E90106',text:'薪资查询'},
				"E9010604":{"icon":"","url":"/myTaxReport", id:'E9010604', pid: 'E90106',text:'个税申报表'},
				"E90108":{"icon":"iconfont icon-guzhangkaohe","url":"", id: 'E90108', pid: '0',text:'考核测评'},
				"E9010802":{"icon":"","url":"/assessScore", id:'E9010802', pid: 'E90108',text:'评测打分'},
				"E9010804":{"icon":"","url":"/assessRank", id:'E9010804', pid: 'E90108',text:'领导定级'}

			};
			var _cachepid = [];
			var _descdata = [];
			for( var i in data){
				var _d = data[i];
				var _pid = _d.pid;
				var _id = _d.id;

				var _data = data1[_id];
				_descdata.push( _data );
				if( _cachepid.join('').indexOf( _pid ) < 0 ){
					var _pdata = data1[_pid];
					_cachepid.push( _pid );
					_descdata.push( _pdata );
				};
			};
//			console.log(_descdata)
			var navdata=[];
			for(var i = 0; i < _descdata.length; i++){
				if(_descdata[i].pid==0){
					navdata.push({
						"icon":_descdata[i].icon,
						"id":_descdata[i].id,
						"pid":_descdata[i].pid,
						"text":_descdata[i].text,
						"url":_descdata[i].url,
						"children":[]
					});
				}
			}
			for(var i = 0; i < _descdata.length; i++){
				for(var j = 0; j < navdata.length; j++){
					if(_descdata[i].pid==navdata[j].id){
						navdata[j].children.push({
							"icon":_descdata[i].icon,
							"id":_descdata[i].id,
							"pid":_descdata[i].pid,
							"text":_descdata[i].text,
							"url":_descdata[i].url
						});
					}
				}
			}
			this.navdata=navdata;
		}
	},
	mounted(){
		this.$http.post(this.$store.state.Interface.sm,Qs.stringify ({
	    		'transType':'permission'
    	}), {
          	headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
          	}
  		}).then(function (response) {
			//返回数据成功跳转到首页
//			var _data=JSON.stringify(response.data)
			if(response.data.flag==0){
				this.photo=response.data;
				this.data=response.data.func;
				this.navfunc();
//				console.log(this.data)
			}else if(response.data.flag==-1){
				this.$message({
                    message : response.data.des,
                    type : 'error'
                })
			}else if(response.data.flag==1){
				this.$message({
                    message : response.data.des,
                    type : 'error'
                })
			}
	   	}.bind(this)).catch(function (error1) {
	         this.$message.error('请求数据失败');
	    }.bind(this));
	},
	created(){

	}
}
</script>
