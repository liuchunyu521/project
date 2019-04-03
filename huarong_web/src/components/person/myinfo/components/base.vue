<template>
	<el-form class="y-baseinfo-form" ref="myForm" :model="formData" :rules="rules" label-position="left">    
		<!-- y-module-baseinfo begin 基本信息表单 [头像区域]-->
		<div class="y-module y-module-baseinfo clearfix">
			<!-- 按钮操作区域 begin -->
			<!--<div class="y-operate">
				<i @click="edit0" v-show="showButnEdit0" class="iconfont icon-ai-edit y-text-bianji"></i>
				
				<yFormBtns v-show="showButnsSave0" 
						:status="status" 
						@edit00="editBase10"
						@save="saveBase"
						@cancel="cancel0"
						@handle="handleBase">
				</yFormBtns>
			</div>-->
			<!-- 按钮操作区域 end -->
			<div class="y-content">
				<!-- 表单区域 begin -->
				<el-row v-show="editStatus0" :gutter="5">
					<template v-for="(val,key) in formDataConfig1"> 
						<el-col v-if="iconForm.indexOf(val.id) > -1" :xs="24" :sm="12" :md="8" :lg="8"> 
							<div class="y-icon-item">
								<i class="iconfont" :class="iconCls[val.id]"></i>
								<yInput :class="alterFields.indexOf(val.id) == 0 || alterFields.indexOf( ',' + val.id) > -1 ? 'y-alter-item' : ''" v-model="formData[key]" :inputData="formDataConfig1[key]" :initVal="formData[key]" :subtype="subDialogtype"></yInput>
							</div>
						</el-col>
						<el-col v-else :xs="24" :sm="12" :md="12" :lg="12" >
							<div class="y-box-base y-box-photo" v-if="val.id == 'photo'">
								<img class="dialogimg" v-if="!formData[key]" :src="Img"/>
						  		<img v-else :src="'data:image/png;base64,'+formData[key]"/>
							</div> 
							<yInput v-else :class="alterFields.indexOf(val.id) == 0 || alterFields.indexOf( ',' + val.id) > -1 ? 'y-alter-item' : ''" v-model="formData[key]" :inputData="formDataConfig1[key]" :initVal="formData[key]" :subtype="subDialogtype"></yInput>
						</el-col>	
					</template> 
				</el-row>
				<!-- 表单区域 end -->
				
				<!-- 视图区域 begin -->
				<el-row v-show="!editStatus0" :gutter="5">
					<template v-for="(val,key) in formDataConfig1"> 
						<el-col v-if="iconForm.indexOf(val.id) > -1" :xs="24" :sm="12" :md="12" :lg="12"> 
							<div class="y-baseinfo-tel">
								<div class="y-icon-item">
									<i class="iconfont" :class="iconCls[val.id]"></i>
									<el-input v-model="formData[key]" :title="formData[key]" :disabled="true"> </el-input>
								</div>
							</div> 
						</el-col>
						<el-col v-else :xs="24" :sm="12" :md="12" :lg="12">
							<div class="y-box-base y-box-photo" v-if="val.id == 'photo'">
								<img class="dialogimg" v-if="!formData[key]" :src="Img"/>
						  		<img v-else :src="'data:image/png;base64,'+formData[key]"/>
							</div> 
							<el-form-item :class="alterFields.indexOf(val.id) == 0 || alterFields.indexOf( ',' + val.id) > -1 ? 'y-alter-item' : ''" v-else :label="val.text"> 
								<el-input v-model="formDataConfig1[key].typedata[0][formData[key]]" v-if="formDataConfig1[key].type == 'radio'" :disabled="true"> </el-input>
								<el-input v-model="formData[key]" v-else :disabled="true"> </el-input>
							</el-form-item>
						</el-col>
					</template> 
				</el-row>
				<!-- 视图区域 end -->
			</div>
		</div>
		<!-- y-module-baseinfo end -->
		
		
		<!-- 基本信息表单 [头像下方区域]-->
		<div class="y-module y-module-baseinfo2" data-scroll="jibenxinxi">
			<div class="y-title">
				<!-- 按钮操作区域 begin -->
				<div class="y-operate">
					<i @click="edit" v-show="showButnEdit" class="iconfont icon-ai-edit y-text-bianji"></i>
					
					<yFormBtns v-show="!showButnEdit" 
							:status="status" 
							@edit="edit"
							@save="saveBase"
							@cancel="cancel"
							@handle="handle">
					</yFormBtns>
				</div>
				基本信息
			</div>
			<div class="y-content">
				<el-row v-show="editStatus1" :gutter="5">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" v-for="(val,key) in formDataConfig2"> 
						<yInput  v-model="formData[key]" 
							:class="alterFields.indexOf(val.id) == 0 || alterFields.indexOf( ',' + val.id) > -1  ? 'y-alter-item' : ''" 
							:name="key"
							:formData="formData"
							:subtype="subDialogtype"
							:inputData="formDataConfig2[key]" ></yInput> 
					</el-col>
				</el-row>
				<el-row v-show="!editStatus1" :gutter="5">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" v-for="(val,key) in formDataConfig2">
						<el-form-item :class="alterFields.indexOf(val.id) == 0 || alterFields.indexOf( ',' + val.id) > -1 ? 'y-alter-item' : ''" :label="val.text">
							<el-input v-model="formDataConfig2[key].typedata[0][formData[key]]" v-if="formDataConfig2[key].type == 'radio'" :disabled="true"> </el-input>
				<!-- 			<el-input v-model="formData[key]" :title="formData[key]" v-else :disabled="true"> </el-input>  -->
							<el-input v-model="formData[key]" :title="formData[key]" v-else :disabled="true"> </el-input> 
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</div>
	</el-form>
</template>
<script>
	import Qs from 'qs';
	import Cookies from 'js-cookie';
	import { deepCopyObj, deepCopyArry } from '@/assets/js/v-extend.js';
	import { ajaxData, getUpdateParam } from '@/assets/js/ajaxdata.js';
	import photoSrc from '../../../../assets/img/user.png';
	import yInput from '@/components/public/yinput';
	import yFormBtns from '@/components/public/yformbtns';
	import Image from '@/assets/img/peple.png';
	var UserInfo;
	export default {
		props: ['editabled'],
		data() {
			return {
				subDialogtype:{
					infoSetCode:''
				},
				rules: {},
				formDataInit: {}, //初始状态的表单数据 
				formData: {}, //当前表单数据
				formDataConfig1: {},
				formDataConfig2: {},
				
				showButnEdit : true,	// 默认显示编辑按钮
				
				editStatus0 : false, // 编辑状态-头像区域-默认不可编辑
				editStatus1 : false, // 编辑状态-头像以下区域-默认不可编辑
				
				status: -1,
				infoSetCode: '', //信息集编码(保存操作的时候需要传给后台)
				alterFields: '', //被修改的字段名称(后台传入)
				// iconForm: 'officephone,mobile,email',
				iconForm: 'officephone,mobile',
				iconCls: {
					'officephone': 'icon-dianhua1',
					'mobile': 'icon-dianhua'
					// 'email': 'icon-youjian'
				},
				Img:Image
			}
		}, 
		components: {
			yInput, //表单元素
			yFormBtns //表单操作按钮区[根据表单的不同状态，动态显示不同的操作按钮 ]
		},
		computed: {
			baseFormInit(){
				return this.$store.state.BaseInfo.baseFormInit;//获取初始信息静态数据
			}
		},
		created() { 
//			UserInfo = JSON.parse( Cookies.get('usermsg') );//获取人员信息
			this.formDataInit = deepCopyObj( this.baseFormInit );//数据深拷贝
			this.formData = deepCopyObj( this.baseFormInit ); 
			
			this.transferData(this.$store.state.BaseInfo.baseInfo1, this.formDataConfig1);
			this.transferData(this.$store.state.BaseInfo.baseInfo2, this.formDataConfig2);   
			this.loadInfoData();

		},
		methods: {
			//批量数据处理，转换成能自动生成表单的数据格式
			transferData(data, configdata) {
				var _formconfig = data; 
				for(let i in _formconfig) {
					var _d = _formconfig[i];
					var _id = _d.id;
					configdata[_id] = _d;

					if(_d.valid) {
						this.rules[_id] = _d.valid;
					};
				};
			},
			
			//动态加载基本信息数据
			loadInfoData() {
				// debugger;
				ajaxData(this.$store.state.Interface.hi, {
//					"pk_psndoc":UserInfo.pk_psndoc,
//			    	"cuserid":UserInfo.cuserid,
//			    	"pk_group":UserInfo.pk_group,
//			    	"pk_org": UserInfo.pk_org,
					"infoSetCode": "bd_psndoc",
					"transType": 'queryPsnInfo' 
				}, (res) => {   
									// debugger;
					var _dataobj = res.list[0]; 
					this.status = res.status;     
					if( res.status != -1 ){
						this.showButnEdit = false;
					}else{
						this.showButnEdit = true;
					};
					this.alterFields = (res.alterFields ? res.alterFields : '');  
					this.infoSetCode = res.infoSetCode;
					 
					_dataobj.photo = (_dataobj.photo == "" ? photoSrc : _dataobj.photo); 
					if( _dataobj.sex ){
						_dataobj.sex = _dataobj.sex.toString(); 
					}; 
					for(var i in this.baseFormInit ){ 
						if( !_dataobj[i] ){
							_dataobj[i] = this.baseFormInit[i];
						};
					};  
					this.formDataInit = deepCopyObj(_dataobj);
					this.formData = _dataobj;   
				});
			},
			
			//点击保存按钮
			saveBase(){  
				// debugger;
				var _formdatastr = JSON.stringify( this.formData );   
				if( _formdatastr == JSON.stringify( this.formDataInit ) ){ //没有实际修改 
					this.$refs['myForm'].validate((valid) => {
						if (valid) {
							this.showButnEdit = true;
							this.editStatus0 = false;
							this.editStatus1 = false;
						};
					});
				}else{ 
					this.$refs['myForm'].validate((valid) => {   
						if (valid) { 
							
							var _param = JSON.parse( JSON.stringify( getUpdateParam( this.formDataInit, this.formData ) ) );
							if( _param.addr_show ){
								delete _param.addr_show;
							}
							if(_param.nativeplace){
								_param.nativeplace=_param.addrnativeplace;
								delete _param.addrnativeplace;
							}
							if(_param.permanreside){
								_param.permanreside=_param.addrpermanreside;
								delete _param.addrpermanreside;
							}
							if(_param.glbdef14){
								_param.glbdef14=_param.addrglbdef14;
								delete _param.addrglbdef14;
							}
							
							ajaxData(this.$store.state.Interface.hi, {
								"transType": "savePsnInfo",  
								"infoSetCode": this.infoSetCode,
								"jsonStr": encodeURIComponent(JSON.stringify(_param))
							}, (res) => {  
								this.showButnEdit = false;
								this.editStatus0 = false;
								this.editStatus1 = false;
								this.loadInfoData();
							});
						};
			       }); 
				}; 
			},
			
			//点击提交、还原、收回按钮
			handle( data ){  
				ajaxData(this.$store.state.Interface.hi, {
					"transType": 'handlePsnInfo', 
					"infoSetCode": this.infoSetCode,
					"way": data[0]
				}, (res) => {   
					this.editStatus0 = false;
					this.editStatus0 = false;
					this.loadInfoData();
				});
			},
			
			// 编辑
			edit(){
				this.showButnEdit = false;
				
			 	this.editStatus0 = true;
			 	this.editStatus1 = true;
			},
			
			// 取消
			cancel(){
				this.formData = deepCopyObj(this.formDataInit ); 
				
				if( this.status == -1 ){
				 	this.showButnEdit = true;
				};
				
				this.editStatus0 = false;
				this.editStatus1 = false;
			},
			
			
		}
	}
</script>
