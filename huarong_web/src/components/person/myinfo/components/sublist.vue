<template>
	<div class="y-module">
		<div class="y-title">
			<div class="y-operate">
				<yListBtns :status="status"
					@handle="handleList"></yListBtns>
			</div>
			<span v-html="title"></span>
		</div>
		<div class="y-content">
			<el-table class="y-table y-table-baseinfo" :data="tempData" style="width: 100%">

				<el-table-column type='expand'>
					<template scope="props">
						<el-form label-position="left" inline class='y-demo-table-expand'>
							<template  v-for="item in theaddata">
								<el-form-item  v-if="!item.required && typeof item.param == 'string'" :prop="item.param" :label="item.text+':'">
								        <span :title="props.row[item.param]">{{props.row[item.param] | YNChinese}}</span>
								</el-form-item>
								<el-form-item   v-else-if="!item.required" :prop="item.param[0]" :label="item.text">
								        {{props.row[item.param[0]]}}~{{props.row[item.param[1]]}}
								</el-form-item>
								<el-form-item  v-else-if="item.required && typeof item.param == 'string'" :render-header="requiredCol" :prop="item.param" :label="item.text+':'">
								        <span :title="props.row[item.param]">{{props.row[item.param] | YNChinese}}</span>
								</el-form-item>
								<el-form-item  v-else :render-header="requiredCol" :prop="item.param[0]" :label="item.text+':'">
								        {{props.row[item.param[0]]}}~{{props.row[item.param[1]]}}
								</el-form-item>
							</template>
						</el-form>
					</template>
				</el-table-column>


				<template  v-for="item in theaddata.slice(0,5)">
					<el-table-column  v-if="!item.required && typeof item.param == 'string'" :prop="item.param" :label="item.text">
					        <template scope="scope">
					        	<span :title="scope.row[item.param]">{{scope.row[item.param] | YNChinese}}</span>
					        </template>
					</el-table-column>
					<el-table-column   v-else-if="!item.required" :prop="item.param[0]" :label="item.text">
						<template scope="scope">
					        {{scope.row[item.param[0]]}} ~ {{scope.row[item.param[1]]}}
					    </template>
					</el-table-column>
					<el-table-column  v-else-if="item.required && typeof item.param == 'string'" :render-header="requiredCol" :prop="item.param" :label="item.text">
					    <template scope="scope">
					        <span :title="scope.row[item.param]">{{scope.row[item.param] | YNChinese}}</span>
					    </template>
					</el-table-column>
					<el-table-column  v-else :render-header="requiredCol" :prop="item.param[0]" :label="item.text">
					    <template scope="scope">
					       {{scope.row[item.param[0]]}}  ~   {{scope.row[item.param[1]]}}
					    </template>
					</el-table-column>
				</template>


				<el-table-column v-if="editabled && ( status == -1 || status == 0 || status == 2)"  label="操作"  width="100">
					<template scope="scope">
						<i style="color: #50CC7A;cursor: pointer;" class="iconfont icon-bianji1"
						@click="editRow(scope.$index, scope.row)"></i>
						<i  style="color: #49A7F5;cursor: pointer;" class="iconfont icon-shanchu"
						@click="deleteRow(scope.$index, scope.row)"></i>
					</template>
				</el-table-column>
			</el-table>

			<div v-if="editabled && ( status == -1 || status == 0 || status == 2)" class="text-center">
				<span style="color: #CC2123;cursor: pointer;" @click="addRow"><i class="iconfont icon-tianjia"></i>新增{{title}}</span>
			</div>
		</div>
	</div>
</template>
<script>
import { deepCopyObj, deepCopyArry } from '@/assets/js/v-extend.js';
import { ajaxData } from '@/assets/js/ajaxdata.js';
import yListBtns from '@/components/public/ylistbtns';
import Qs from 'qs';
import Cookies from 'js-cookie';
var UserInfo;
export default {
	//infoSetCode: 数据源
	//editabled:是否可编辑 Boolean(true)
	//title: 模块标题
	//theaddata: 表头显示
	props: ['editabled', 'title', 'theaddata', 'infoSetCode'],
	data() {
		return {
			listdata: [],
			EditInfo: false,
			tempData: [],
			status: -1 //列表状态, 控制操作按钮的类型
		}
	},
	components: {
		yListBtns //列表操作按钮区[根据列表的不同状态，动态显示不同的操作按钮 ]
	},
	watch: {
	    // 如果 listdata 发生改变，这个函数就会运行
	    listdata: function ( data ) {
	    	this.tempData = deepCopyArry( data );
//	    	console.log(this.tempData)
	    }
	},
	created(){
//		UserInfo = JSON.parse( Cookies.get('usermsg') );//获取人员信息
		this.loadData();

	},
	filters: {
		YNChinese: function( val ){
			var _val = val;
			if( _val == "Y"){
				_val = "是";
			};
			if( _val == "N"){
				_val = "否";
			};
			return _val;
		}
	},
	methods: {
		//动态加载数据
		loadData(){
			this.$http.post( this.$store.state.Interface.hi, Qs.stringify ({
//				"pk_psndoc":UserInfo.pk_psndoc,
//		    	"cuserid":UserInfo.cuserid,
//		    	"pk_group":UserInfo.pk_group,
//		    	"pk_org": UserInfo.pk_org,
				"infoSetCode": this.infoSetCode,
				"transType": 'queryPsnInfo'
			})).then(( res) => {
				if(res.data.flag=='0'){
					this.status = res.data.data.status;
					this.listdata = res.data.data.list;
				}else if(res.data.flag=='-1'){
					this.status = '-1';
					this.listdata =[];
				}
			}).catch((err) => {
				this.$message.error( err );
			})
		},
		//调用父组件的提交方法,弹出新增窗口
		handleList( data ){
			this.$emit( 'handle', [ data[0], this.infoSetCode] );
		},
		//点击底部的新增按钮
		addRow(){
			this.$emit('add',["add", this.infoSetCode]);  //调用父组件的新增方法,弹出新增窗口
		},
		//点击删除按钮
		deleteRow(index, row){
			this.$emit('delete', ['remove', this.infoSetCode, row ]);  //调用父组件的新增方法,弹出新增窗口
		},
		//点击编辑按钮
		editRow( index, row ){
			this.$emit('add', ["edit", this.infoSetCode, row ]);  //调用父组件的新增方法,弹出新增窗口
		},
		//列表必填列
		requiredCol(createElement, { column }) {
			return [ column.label, createElement('span', {
					'class': 'text-red'
				},'*')
			];
		}
	}
}
</script>
