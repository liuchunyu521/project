<!--
	作者：liuchym
	时间：2018-11-16
	描述：拖拽组件
	父组件引入import dragDialog from '../../../../../common/component/dragdialog.vue';
	数据格式：
		cascaderTreeData:[],
	   	cascaderModel:[],
	   	orderData:[{
	   		id:'222',
	   		name:'王者',
	   		parentName:''//上级
	   	},
	   	{
	   		id:'333',
	   		name:'王者1'，
	   		parentName:''//上级
	   	}],
	组件使用：
		<drag-dialog 
	   		@orderEndvalue="orderEndvalue" 
	   		@orderData="orderData"
	   		@casdialogVisible="casdialogVisible"
	   		cascaderdialogVisible='true'
	   		title="组织排序"
	   		:casShow="true"
	   		placeholdervalue='请选择组织'
	   		:cascaderTreeData='cascaderTreeData'
	   		:cascaderModel='cascaderModel'
	   		:orderData='orderData'
	   		>
	   	</drag-dialog>
	文档：{
	      @orderEndvalue: 最终确认排序的数据 调用排序接口；
	      @orderData: 选择级联请求接口要排序的数据；
	      :cascaderdialogVisible 控制弹框显示隐藏；
	      :title 弹框的表头名称；
	      :cascaderTreeData 级联数据；
	      cascaderModel 级联默认值；
	      orderData 排序的数据；
	      :casShow 是否需要级联菜单 
      	}
    
-->
<template>
	<!--DOM begin-->
 		<div >
 			<el-dialog
 			  class="L_dragwrap"
 			  :show-close='false'
			  :visible="cascaderdialogVisible"
			  size="small">
			    <span slot="title" >
				    <span class="el-dialog__title" style="margin-left: 16px;">{{title}}</span>
				    <div class="cascader" v-if="casShow">
				    	<el-cascader
                            ref="orgTreeCascader"
                            expand-trigger="hover"
                            :options="cascaderTreeData"
                            v-model="cascaderModel"
                            :placeholder="placeholdervalue"
                            :show-all-levels="false"
                            not-leaf-selectable="true"
                            :hideBorder="true"
                            :hideRight="true"
							clearable
                            @change="cascaderChange">
                    	</el-cascader>
				    </div>
			    </span>
			  	<!--draggable begin-->
			  	<draggable v-model="orderData" :options="{group:'people',filter: '.undraggable'}" @start="drag=true" @end="drag=false">
				    <div class="dragwrap" v-for="element in orderData">
					   	<span class="undraggable"  :key="element.id">
					   		<span v-if="element.parentName">{{element.parentName}}<span style="padding: 0 4px;">/</span></span>{{element.name}} 
					   	</span>
					   	<span class="ifbp-icon-menu drag-icon dragicon"></span>
				    </div>
				</draggable>
			  	<!--draggable over-->
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="cancle()">取 消</el-button>
			    <!---->
			    <el-button type="primary" @click="submitSend()">确 定</el-button>
			  </span>
			</el-dialog>
        </div>
    <!--DOM over-->
</template>

<script>
	export default{
		props:["cascaderdialogVisible","title","cascaderTreeData","cascaderModel","placeholdervalue","orderData",'casShow'],
		data:function() {
           return {
           		cascaderdialogVisible:false
			 	//测试用
//			 	title:'',//弹框title name
//			 	cascaderTreeData: [],//级联所有数据
//			 	cascaderModel: [],//级联默认值
//			 	placeholdervalue:'rr',//级联 默认holder值 例如 《请选择组织》
//			    orderData: []    
           }
        },
        methods: {
        	cascaderChange(res){
        		this.$emit('orderData',res);
        	},
			submitSend(){
				//Send value
				this.$emit('orderEndvalue',this.orderData);
				this.cascaderdialogVisible = false;
			},
			cancle(){
				this.$emit('casdialogVisible',"false");
				this.cascaderdialogVisible = false;
			}
        }
	}
</script>

<style>
	.L_dragwrap .el-dialog__body {
		padding: 0;
		min-height: 300px;
		max-height:400px;
	}

	.L_dragwrap .el-dialog__header {
		padding: 0;
	}
	.L_dragwrap .cascader {
		position: relative;
		left: 100px;
		top: -48px;
		width: 150px;
		line-height: 16px;
	}
	/*.L_dragwrap .el-cascader .el-input__icon, .L_dragwrap .hide-border.el-cascader .el-input__icon {
		position: relative;
		top: 6px;
		left: 16px;
	}*/
	.L_dragwrap .dragwrap {
		height: 44px;
		background: #C1E5FD;
		line-height: 44px;
		padding: 0 16px 0 16px;
		border-bottom: 1px solid #F0F0F5;
	}
	.L_dragwrap .dragicon {
		float: right;
		cursor: auto;
	}
</style>