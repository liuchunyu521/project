<!--
  作者：彭传博
  时间：2018-12-05
  支持：组织范围管理按组织设置dialog
-->
<template>
    <div  id="scopeOrgId">
    <!--转移规则设置弹窗-->
    <el-dialog title="按组织管理"  :visible.sync="dialogVisible"  size="full" :show-close="false" >
        <div class="roster_Setup">
            <el-steps :space="400" :active="active" finish-status="success" align-center="true" center="true">
                <el-step title="选择委托人"></el-step>
                <el-step title="设置委托业务"></el-step>
            </el-steps>
        </div>
        <ifbp-button-area id="buttonId" style="padding: 0px; margin-bottom: -12px; margin-top: -12px;">
        <!-- 查询模板组件 -->
        <ifbp-search class="fr"
                     :template-code="tplCode"
                     v-show="isShowOrgs"
                     :no-breadcrumb-search="true"
                     @search="advancedSearch">
        </ifbp-search>
        </ifbp-button-area>
        <!--选择组织-->
    <ifbp-template ref="manageByOrgRef"
                   tpl-id="hr_manage_psn_psndoc"
                   :tpl-data="morgData"
                   v-show="isShowOrgs"
                   :tpl-reset-fun="tableFormResetFun"
                   @after-create="afterCreateFunc"
                   :methods="childFormMethods">
    </ifbp-template>
    <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-show="isShowOrgs"
                :current-page="currentPage"
                :page-sizes="[3,6,9,12]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalElements">
    </el-pagination>
    
		<div v-show="isShowScrope" style="margin-top: 50px;margin-left: 100px;">
				<span style='color:#666;margin-right: 10px;'><span style='color:#E60012'>*</span>委托业务</span>
			  <el-checkbox-group v-model="checkList" style="display: inline-block;">
			    <el-checkbox label="PSNDOC00000000000000">{{'人事管理'}}</el-checkbox>
			    <el-checkbox label="PSNPACT0000000000000">{{'合同管理'}}</el-checkbox>
			    <el-checkbox label="SALARY00000000000000">{{'薪酬管理'}}</el-checkbox>
			  </el-checkbox-group>
		</div>
    <span slot="footer" class="dialog-footer" >
        <el-button @click="handleCancel">取消</el-button>
        <el-button v-show="!isShowScrope" @click="handleNext" type="primary">下一步</el-button>
         <el-button v-show="isShowScrope" @click="handleLast" >上一步</el-button>
         <el-button v-show="isShowScrope" @click="handleFines" type="primary">完成</el-button>
      </span>
</el-dialog>
    </div>
</template>

<script>
    export default {
				props:["pkorg"],
				
        data() {
        		
            const vm = this;
            return {
                addScopeData: {
                    sourceData: {},
                    attrData: {},
                },
                pk_org_target:'',   //管理组织主键
                ieStorage:false,   //页面缓存
                tplCode: 'hrhiEmployeeSearch',
                searchTemplate: {},
                //分页
                totalElements: 0,
                currentPage:1,
                size:10,
                isShowScrope:false,
                isShowOrgs:true,
                active: 0,
                postCreateDate:'',
                originalRenameDatas:{},
                pk_post:'',
                //导出框是否显示
                dialogVisible: false,
                morgData: {
                },
                scopesData: {},
                tableFormResetFun($node) {
                    const $table = this.getNodeById($node, ' scope_hrorginfo_l');
                    $table.attr(':height', '450');

                },
                tableFormScropResetFun($node) {

                },
                childFormMethods: {
                },
                childFormScopeMethods:{

                },
                checkList: []

            }
        },
        mounted() {
        	this.checkList = [];
        	this.currentPage = 1;
        },
        created() {
        },
        methods: {
            request(n, s){
            	  let pk_org = this.pkorg;
//              let param = {
//                  pageNum: n ? n : '1',
//                  pageSize: s ? s : '3',
//                  pk_org: pk_org,
//              };
								let param = {
                    pn: n ? n : '1',
                    ps: s ? s : '12',
                    pk_org: pk_org,
              };
                this.$http({
                    url: '/hrhi/manageScopePsn/employPage',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$refs.manageByOrgRef.setTableData(res.data.data.content);
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            afterCreateFunc(){
                this.request();
                this.ieStorage = true;
            },
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.isShowOrgs=true;
                this.isShowScrope = false;
                this.currentPage=1;
                this.$emit('msByOrgRequest');
            },
            handleNext:function(){//下一页
                var  sourceData =this.$refs.manageByOrgRef.getTableComp().getSelection();
                if(!sourceData ||sourceData.length<1){
                    this.$message({
                        message: "请勾选管理对象",
                        type: "error"
                    });
                    return;
                }
                for (var i=0,len=sourceData.length; i<len; i++)
                {
                        if(sourceData[i].pk_org==this.pk_org_target){
                            this.$message({
                                message: "本组织的业务不用委托给本组织！",
                                type: "error"
                            });
                            return;
                        }
                }
                if (this.active++ > 2) this.active = 0;
                this.isShowOrgs = false;//第一页隐藏
                this.isShowScrope = true;
            },
            handleLast:function(){
                if (this.active-- > 2) this.active = 0;
                this.isShowOrgs = true;
                this.isShowScrope = false;
            },
            handleFines:function(){//完成按钮
                if(!this.pk_org_target){
                    return;
                }
                var  pk_org_target = this.pk_org_target ;
                var  sourceData = this.$refs.manageByOrgRef.getTableComp().getSelection();
                var  pk_psndocs = [];//数据pk_psndocs
                sourceData.forEach(function(item,index,arr){
                	pk_psndocs.push(item.pk_psnjob);
                })
                pk_psndocs = pk_psndocs.toString();//选中的字符串形式
                var pk_associateattrs = this.checkList.toString();//三个选项
                if(pk_associateattrs == ""){
                	this.$message({
                        message: "请选择委托业务",
                        type: "error"
                    });
                    return;
                }

                var url = "/hrhi/manageScopePsn/save";
                let param = {
                    pk_org:pk_org_target,
                    pk_psnjobs:pk_psndocs,
                    pk_associateattrs:pk_associateattrs
                };
//              debugger
//              return;
                this.$http({
                    url: url,
                    method: "post",
                    traditional: true,
                    data:sourceData,
                    params: param
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.isShowOrgs=true;
                            this.isShowScrope = false;
                            this.dialogVisible=false;
                            this.$refs.scopeByOrgRef.resetFormData();
                            this.currentPage=1;
                            this.$emit('msByOrgRequest');
                        }else if(res.data.status === false){
                        		this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                            this.isShowOrgs=true;
                            this.isShowScrope = false;
                            this.dialogVisible=false;
                            this.$refs.scopeByOrgRef.resetFormData();
                            this.currentPage=1;
                            this.$emit('msByOrgRequest');
                        }else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
//                      this.$message({
//                          message: "失败",
//                          type: "error"
//                      });
                    });
										
            },

            // 设置dialog是否可见
            setDialogVisible: function (flag,pk_org) {
                if(pk_org){
                    this.pk_org_target = pk_org;
                    this.dialogVisible=true;
                    if(this.ieStorage){
                        this.request();
                    }
                }else{
                    this.$message({
                        message: "请选择组织",
                        type: "error"
                    });
                }
            },
            handleSizeChange(val) {
                this.currentPage = 1;
                this.request(1, val);
            },
            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
            },
            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage=1;
                this.searchTemplate = searchTemplate;
                this.request();
            },
            	
        }
    }
</script>
<style>


</style>
