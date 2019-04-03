<!--
  作者：liyn11
  时间：2018-03
  支持：岗位详情
-->
<template>
    <ifbp-page>

        <ifbp-breadcrumb  v-if="isNew" name="新增岗位"></ifbp-breadcrumb>
        <ifbp-breadcrumb  v-if="isEdit" name="岗位信息详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='postBasicPanel' title='基本信息' :icons='isShowHeadIcons'  >
                    <ifbp-template ref='ref_post'
                                   tplId='postDetailId'
                                   :tpl-data='postData'
                                   :editable='headEdit'
                                   :tpl-reset-fun='postResetFun'
                                   :methods="postBasicMethods"
                                   :confirm-clear-edit="false"
                                   @after-create="afterPostCreateFunc"
                    >
                    </ifbp-template>
                    <div class='form-button-div' v-if='headEdit' v-show="isbEdit">
                        <el-button type='primary'  @click='postBasicInfoSave'>保存</el-button>
                        <el-button type='default'  @click='postBasicInfoCancel'>取消</el-button>
                    </div>
                </ifbp-panel>
                <!-- 子表1 -->
                <ifbp-panel id='postDemandPanel' title='任职资格' :icons='isShowBodyIcons'>
                    <ifbp-template ref='ref_postdemand'
                                   tplId='postDemandId'
                                   :tplData='postDemandData'
                                   :editable='postDemandEdit'
                                   :tpl-reset-fun='postDemandResetFun'
                                   :confirm-clear-edit="false"
                    >
                    </ifbp-template>
                    <div class='form-button-div' v-if='postDemandEdit'  v-show="isbEdit">
                        <el-button type='primary'  @click='postDemandSave'>保存</el-button>
                        <el-button type='default'  @click='postDemandCancel'>取消</el-button>
                    </div>
                </ifbp-panel>

                <!-- 子表2 -->
                <ifbp-panel id='joblevePanel' title='职级职等' :icons='isShowJobLevelIcons'  v-show='bodyShow' >
                    <ifbp-template ref='ref_post_levelrelation'
                                   tpl-id='postJobLevelAndRankId'
                                   :tpl-data='postSubData'
                                   :editable='postSubEdit'
                                   :form-show-message='postSubEdit'
                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :tplResetFun='postSeriesSubFun'
                                   :methods="formClickMethods"
                                   :table-show-menu="false"
                                   :table-oper-vif="tableOperVif && !headEdit && !postSubEdit&& !postDemandEdit"
                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"
                                   :confirm-clear-edit="false"
                                   @row-click="postJobLevelRowClick"
                                   @form-edit-click='postJobLevelFormEditClick'
                                   @edit-table-click='postSerEditClick'
                                   @delete-table-click='postSerSubDeleteClick'
                                   @form-confirm-click='postSerSubFormConfirm'
                                   @form-cancel-click='postSerSubFormCancel'
                                   @form-delete-click="postjobLevelFormDelete"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel id="postHistoryPanel" title="岗位变更历史"  class="titleLine" v-show="bodyShow">
                    <div align="right" class="top-button">
                        <i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -20px;"></i>
                    </div>
                    <ifbp-template ref="ref_post_history"
                                   tpl-id="postHistoryId"
                                   :tplData="postHistoryData"
                                   :tplResetFun="postHisResetFun"
                                   :methods="postHisMethod"
                                   :table-show-menu="false"
                    >
                    </ifbp-template>
                </ifbp-panel>
                
                
                <!--岗位说明书-->
                <ifbp-panel id="postDescPanel" title="岗位说明书" v-show="descPostEdit" >
                    <ifbp-upload
                            busi-code="postdesc"
                            force-type = 'normal'
                            :pk-busi="pk_post">
                    </ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>

        <!-- 按钮区域 -->
        <ifbp-footer   v-if="isNew" >
            <el-button type="default" @click="postBasicInfoCancel">取消</el-button>
            <el-button type="primary" @click="postAddDemandSave">保存</el-button>
        </ifbp-footer>

    </ifbp-page>
</template>
<script>
    import postDetail1JS from './postDetailSub.js';
    import  postJobTypeJS from './postJobLevelRankJS.js';
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
         mixins: [postDetail1JS,postJobTypeJS,pageModelMixin],
        data() {
            const vm = this;
            //取路由路径参数
            var postParam =this.$route.query.id;
            var isEditForPath =this.$route.query.isEditForPath;

            var $isNew;
            var $isEdit;
            if(postParam){
                $isNew = false;
                $isEdit = true;
            }else{
                $isNew = true;
                $isEdit = false;
            }
            var $headEdit=true;    //调整进入编辑页时是否是编辑态 false 否  true  是
            if(isEditForPath !=undefined){
                $headEdit=false;
            }
            return {
                //新增时将列表页的组织、部门自动填写
                pk_org_param:this.$route.query.pk_org_param,
                pk_dept_param:this.$route.query.pk_dept_param,
                // 存储岗位基本信息和任职资格
                postBaseAndDemandData: {
                    postbase: {},
                    postdemand: {},
                },
                //存储所选的岗位序列对象
                selectedPostSeries:"",
                //是否新增态
                isNew:$isNew,
                //是否编辑态
                isEdit:$isEdit,
                pk_post:postParam,
                originalHeadValue:{},
                postHistoryList:[],
                // ifbp-panel-group所需参数
                scrollDom: 'ifbpScrollDom',
                // 基础panel显示图标
                headIcons: [
                    {
                        icon: 'edit',
                        click: function () {
                            vm.headEdit = !vm.headEdit;
                            vm.isShowHeadIcons = {};
                            vm.isShowBodyIcons = {};
                            vm.isShowJobLevelIcons = {};
                        }
                    }
                ],
                // UI模板所需参数
                //pk_tempform: '0001AA10000000004V7D',
                postData:{
                    paramDeptForPost:{
                        pk_org:""
                    },
                    paramPostForDept:{
                        pk_org:""
                    }
                },
                postHistoryData:{

                },
                // 基本信息是否为修改态
                headEdit: $headEdit,
                isbEdit: $isEdit ,
                descPostEdit:$isEdit,
                bodyShow: false,
                postHisMethod:{},
                postBasicMethods:{
                    changPkOrgParam :function(type,data) {
                        var sourceData = vm.$refs.ref_post.getData('om_post');
                        var pkOrg = sourceData.pk_org;
                        vm.$refs.ref_post.setData('paramDeptForPost', {
                           pk_org: pkOrg
                        });
                        sourceData.pk_dept = "";
                        //测试岗位树的过滤是否生效
                        vm.$refs.ref_post.setData('paramPostForDept', {
                            pk_org: pkOrg
                        });
                        sourceData.suporior = "";

                    }
                    // ,changPkDeptParam:function(type,data){
                    //     var  sourceData2 = vm.$refs.ref_post.getData('om_post');
                    //     var pkDept = sourceData2.pk_dept;
                    //     vm.$refs.ref_post.setData('paramPostForDept', {
                    //         pk_dept: pkDept
                    //     });
                    //     sourceData2.suporior = "";
                    // }
                },
                postHisResetFun:function ($node) {

                },
                postResetFun: function ($node) {
                    //选所属组织后过滤部门
                    var $changePkOrg = $node.find("[v-model='om_post.pk_org']");
                    $changePkOrg.attr('v-on:change', 'changPkOrgParam');

                    //选择部门后过滤上级岗位
                    // var $changePostDept = $node.find("[v-model='om_post.pk_dept']");
                    // $changePostDept.attr('v-on:change', 'changPkDeptParam');

                    // var $changePkDept = $node.find("[v-model='om_post.pk_dept']");
                    // $changePkDept.attr(':disabled', "!om_post.pk_org");

                    return $node[0].outerHTML;
                }
            };
        },
        computed: {
            isShowJobLevelIcons:function () {
                let  tempVal = {};
                if(this.postSubEdit === true || this.headEdit === true || this.postDemandEdit === true  ){
                    return tempVal;
                }else {
                    return this.bodyIconsSub;
                }
            },

            isShowHeadIcons:function(){
                let  tempVal = {};
                if(this.headEdit === true || this.postSubEdit === true || this.postDemandEdit === true ){
                    return tempVal;
                }else{
                    return this.headIcons;
                }
            },
            isShowBodyIcons:function(){
                let tempVal = {};
                if(this.postDemandEdit === true || this.headEdit === true || this.postSubEdit === true){
                    return tempVal;
                }else{
                    return this.bodyIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.postDemandEdit === true || this.headEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.postDemandEdit === true || this.headEdit === true) {
                    return false;
                }
            },
            //子表取消按钮显示逻辑：点击编辑按钮，子表可编辑，显示取消按钮
            cancelButtonShow: function () {
                if (this.postDemandEdit === true || this.headEdit === true || this.postSubEdit ===false) {
                    return false;
                }
            },
            //子表删除按钮显示逻辑：子表不可编辑时，点击行，显示删除按钮
            deleteButtonShow: function () {
                if (this.headEdit === true || this.postDemandEdit === true || this.postSubEdit === true) {
                    return false;
                }else{
                    return true;
                }
            }
        },

        mounted() {
            this.request();
        },

        methods: {
            updateEvent(val){
                this.postSubEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            // 获取数据
            request() {
                // 请求岗位基本信息详情
                this.requestPostInfo();
                // 请求岗位子表列表,引入js后放开
                this.requestPostDemand();
                // 职级职等
                this.requestPostSerSub();
            },

            requestPostInfo() {
                if (!this.pk_post || this.pk_post === undefined || this.pk_post.length <= 0) {
                    return;
                }
                this.$http({
                    url: '/hrjf/post/getById/' + this.pk_post,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.selectedPostSeries = res.data.data.pk_postseries;
                            this.originalHeadValue = res.data.data;
                            this.postHistoryList = res.data.postHisData;
                            this.$refs.ref_post.setData(
                                'om_post',
                                JSON.parse(JSON.stringify(this.originalHeadValue))
                            );
                            this.$refs.ref_postdemand.setData(
                                         'post_demands',
                                         JSON.parse(JSON.stringify(this.originalHeadValue))
                            );
                            if(this.postHistoryList && this.$refs.ref_post_history){
                                this.$refs.ref_post_history.setData('om_posthistory_t', this.postHistoryList)
                            }

                            //将组织主键传入部门参照中以过滤部门
                            var pkOrgId = res.data.data.pk_org;

                            this.$refs.ref_post.setData('paramDeptForPost', {
                                pk_org: pkOrgId
                            });
                            //过滤上级岗位树
                            this.$refs.ref_post.setData('paramPostForDept', {
                                pk_org: pkOrgId
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '基本信息详情获取失败',
                            type: 'error'
                        });
                    });
            },
            // 基本信息取消按钮操作
            postBasicInfoCancel() {
                debugger
                if (this.isNew === true) {
                    this.$context.getApp().back();
                }else{
                   // this.requestPostInfo();
                    this.headEdit = false;
                    this.isShowHeadIcons = this.headIcons;
                    this.isShowBodyIcons = this.bodyIcons;
                    this.isShowJobLevelIcons = this.bodyIconsSub;
                    this.$refs.ref_post.resetFormData();
                    this.$refs.ref_post.setData('om_post', JSON.parse(JSON.stringify(this.originalHeadValue)));
                }

            },

            //主表新增时基本信息和 任职资格 一块保存
            postAddDemandSave(){
                const  $dataDemand = this.$refs.ref_postdemand.getData('post_demands');
                const $dataBase = this.$refs.ref_post.getData('om_post');
                this.postBaseAndDemandData.postbase = $dataBase;
                this.postBaseAndDemandData.postdemand = $dataDemand;
                let data = JSON.parse(JSON.stringify(this.postBaseAndDemandData));
                this.$refs.ref_postdemand.validate((valid) => {
                    if(valid){
                        this.$refs.ref_post.validate((valid) => {
                            if(valid){
                                this.$http({
                                    url: '/hrjf/post/saveBothPost',
                                    method: 'post',
                                    data: data
                                })
                                    .then((res) => {
                                        if (res.data.status === true) {
                                            this.selectedPostSeries = res.data.data.pk_postseries;
                                            this.isNew =false;
                                            this.isEdit = true;
                                            this.isbEdit = true;
                                            this.headEdit = false;
                                            this.postDemandEdit = false;
                                            this.isShowHeadIcons = this.headIcons;
                                            this.isShowBodyIcons = this.bodyIcons;
                                            this.bodyShow = true;
                                            this.descPostEdit = true;
                                            this.$message({
                                                message: res.data.msg,
                                                type: 'success'
                                            });
                                            this.originalHeadValue = res.data.data;
                                            this.$refs.ref_postdemand.setData(
                                                'post_demands',
                                                res.data.data
                                            );
                                            this.$refs.ref_post.setData(
                                                'om_post',
                                                res.data.data
                                            );
                                            this.pk_post = this.originalHeadValue.pk_post;
                                            this.request();
                                            this.$refs.ref_post.clearEdit();
                                            this.$refs.ref_postdemand.clearEdit();
                                            this.$refs.ref_post_levelrelation.clearEdit();
                                        } else {
                                            this.$message({
                                                message: res.data.msg,
                                                type: 'error'
                                            });
                                        }
                                    })
                                    .catch((er) => {
                                        this.$message({
                                            message: '更新失败'+er,
                                            type: 'error'
                                        });
                                    });

                            }
                        });

                    }
                });
            },
            // 基本信息保存按钮操作
            postBasicInfoSave() {
                const data = this.$refs.ref_post.getData('om_post');
                this.$refs.ref_post.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/post/savePost',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    // this.$refs.ref_post.clearEdit();
                                    this.selectedPostSeries = res.data.data.pk_postseries;
                                    this.headEdit = false;
                                    this.isShowHeadIcons = this.headIcons;
                                    this.isShowBodyIcons = this.bodyIcons;
                                    this.isShowJobLevelIcons = this.bodyIconsSub;
                                    this.bodyShow = true;
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.originalHeadValue = res.data.data;
                                    this.$refs.ref_post.setData(
                                        'om_post',
                                        // JSON.parse(JSON.stringify(this.originalHeadValue))
                                        res.data.data
                                    );
                                    this.$refs.ref_post.clearEdit();
                                    this.$refs.ref_postdemand.clearEdit();
                                    this.$refs.ref_post_levelrelation.clearEdit();
                                    this.request();
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((er) => {
                                this.$message({
                                    message: '更新失败'+er,
                                    type: 'error'
                                });
                            });
                    }
                });
            },
            // table行的点击事件
            postJobLevelRowClick(scope){
                this.postSubEdit = false;
            },
            afterPostCreateFunc(){
                if (this.pk_org_param&&this.$refs.ref_post && this.$refs.ref_post.comp.$refs.ref_postdetailorg) {
                    this.$refs.ref_post.comp.$refs.ref_postdetailorg.setPKs(this.pk_org_param);
                    //过滤部门
                    this.$refs.ref_post.setData('paramDeptForPost', {
                        pk_org: this.pk_org_param
                    });
                    this.$refs.ref_post.setData('paramPostForDept', {
                        pk_org:  this.pk_org_param
                    });
                }
                // if (this.pk_dept_param&&this.$refs.ref_post && this.$refs.ref_post.comp.$refs.ref_postdetaildept) {
                //     this.$refs.ref_post.comp.$refs.ref_postdetaildept.setPKs(this.pk_dept_param);
                // }
            },
            settingBtn() {
                this.$refs.ref_post_history.setTransferVisible(true);
            },
        }
    };
</script>
<style>
    #postHistoryPanel .top-button{
        height: 0px;
    }
</style>
