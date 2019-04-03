<!--
  作者：liyn11
  时间：2018-03
  支持：岗位序列详情信息
-->
<template>
    <ifbp-page>

        <ifbp-breadcrumb  v-if="isNew" name="新增岗位序列"></ifbp-breadcrumb>
        <ifbp-breadcrumb  v-if="isEdit" name="岗位序列详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='postSeriesBasePanel' title='基本信息' :icons='isShowHeadIcons' >
                    <ifbp-template ref='ref_postseries'
                                   tplId='postseriesDetailTplId'
                                   :tplData='postSeriesData'
                                   :editable='headEdit'
                                   :tpl-reset-fun='postSeriesResetFun'
                    >
                    </ifbp-template>
                    <div class='form-button-div' v-if='headEdit'>
                        <el-button type='primary'  @click='postSeriesSave'>保存</el-button>
                        <el-button type='default'  @click='postSeriesCancel'>取消</el-button>
                    </div>
                </ifbp-panel>
                <!-- 子表 -->
                <ifbp-panel id='joblevePanel' title='职级职等' :icons='isShowBodyIcons' v-show='bodyShow'>
                    <ifbp-template ref='ref_postseries_levelrelation'
                                   tpl-id='postSeriesJobTplId'
                                   :tpl-data='postSeriesSubData'

                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :editable='postSeriesSubEdit'
                                   :form-show-message='postSeriesSubEdit'
                                   :tplResetFun='postSeriesSubFun'
                                   :methods="formMethodsForClickSeries"
                                   :table-show-menu="false"
                                   :table-oper-vif="tableOperVif  && !headEdit&&!postSeriesSubEdit"

                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"
                                   :confirm-clear-edit="false"

                                   @row-click="postSeriesJobLevelRowClick"
                                   @edit-table-click='postSerEditClick'
                                   @delete-table-click='postSerSubDeleteClick'
                                   @form-confirm-click='postSerSubFormConfirm'
                                   @form-cancel-click='postSerSubFormCancel'
                                   @form-edit-click='jobLevelPostSerEditClick'
                                   @form-delete-click="postSeriesjobLevelFormDelete"
                    >
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import postSeriesDetailJS from './postSeriesDetailJS.js';
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [postSeriesDetailJS,pageModelMixin],
        data() {
            const vm = this;
            //取路由路径参数
            var postSerParam = this.$root.$router.currentRoute.params.id;
            var isEditForPath =  this.$root.$router.currentRoute.params.isEditForPath;

            var $isNew;
            var $isEdit;
            if(postSerParam){
                $isNew = false;
                $isEdit = true;
            }else{
                $isNew = true;
                $isEdit = false;
            }
            var $headEdit=true;
            if(isEditForPath ===  "false"){
                $headEdit=false;
            }
            return {
                //是否新增态
                isNew:$isNew,
                //是否编辑态
                isEdit:$isEdit,
                pk_joblevelsys:postSerParam,
                // 通过传入的参数判断是新增还是修改操作
                originalHeadValue:{},
                // ifbp-panel-group所需参数
                scrollDom: 'ifbpScrollDom',
                // 基础panel显示图标
                headIcons: [
                    {
                        icon: 'edit',
                        click: function () {
                            vm.status = 1;
                            vm.headEdit = !vm.headEdit;
                            vm.isShowHeadIcons = {};
                            vm.isShowBodyIcons = {};
                            //新增界面保存之后再修改状态点击取消不跳转到列表界面
                            vm.isNew = false;
                            vm.isEdit = true;
                        }
                    }
                ],
                // UI模板所需参数
                // pk_tempform: '0001AA100000000060UJ',
                postSeriesData: {
                    rules: {
                        postseriescode: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
                        postseriesname: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
                    }
                },
                status: 2, //1, update; 2, new; 3, delete
                // 基本信息是否为修改态
                headEdit: $headEdit,
                jobleveEdit: false,
                bodyShow: false,
                postSeriesResetFun: function ($node) {
                    return $node[0].outerHTML;
                }
            };
        },
        computed: {
            isShowHeadIcons: function () {
                let tempData = {};
                if (this.headEdit === true || this.postSeriesSubEdit === true) {
                    return tempData;
                } else {
                    return this.headIcons;
                }
            },
            isShowBodyIcons : function () {
                let tempData = {};
                if (this.postSeriesSubEdit === true || this.headEdit === true) {
                    return tempData;
                } else {
                    return this.bodyIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.headEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.headEdit === true) {
                    return false;
                }
            },
            cancelButtonShow: function () {
                if (this.headEdit === true  || this.postSeriesSubEdit ===false) {
                    return false;
                }else{
                    return true;
                }
            },
            deleteButtonShow: function () {
                if (this.headEdit === true || this.postSeriesSubEdit ===true) {
                    return false;
                }else {
                    return true;
                }
            }
            // cancelSubButton: function () {
            //     return (this.postSeriesSubEdit ? "取消" : "删除");
            // }
        },
        mounted() {
            this.request();
        },

        methods: {
            updateEvent(val){
                this.postSeriesSubEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            // 获取数据
            request() {
                // 请求职级基本信息详情
                this.requestPostSeriesInfo();
                // 请求职级子表列表
                this.requestPostSerSub();
            },
            // 请求职级类别基本信息详情
            requestPostSeriesInfo() {
                if (!this.pk_joblevelsys || this.pk_joblevelsys === undefined || this.pk_joblevelsys.length <= 0) {
                    this.status = 2;  //新建
                    return;
                }else{
                    this.status = 1; //修改

                }
                this.$http({
                    url: '/hrjf/postSeries/getById/' + this.pk_joblevelsys,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalHeadValue = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(this.originalHeadValue));
                            this.$refs.ref_postseries.setData(
                                'postseries',
                                JSON.parse(JSON.stringify(this.originalHeadValue))
                                //res.data.data
                            );
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
            postSeriesCancel() {
                if(this.isNew === true){
                    this.$context.getApp().back();
                }else{
                   // this.requestPostSeriesInfo();
                    this.headEdit = !this.headEdit;
                    this.isShowHeadIcons = this.headIcons;
                    this.isShowBodyIcons = this.bodyIcons;
                    this.$refs.ref_postseries.resetFormData();
                    if(this.originalHeadValue){
                        this.$refs.ref_postseries.setData("postseries"
                            , JSON.parse(JSON.stringify(this.originalHeadValue)));
                    }else{
                        this.$refs.ref_postseries.setData("postseries",
                            {
                                postseriescode:null,
                                postseriesname:null,
                                father_pk:null,
                                enablestate:'1',
                                postseriesdesc:null
                            }
                        );
                    }
                }

            },
            // 基本信息保存按钮操作
            postSeriesSave() {
                const data = this.$refs.ref_postseries.getData('postseries');
                data.status = this.status;
                this.$refs.ref_postseries.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/postSeries/savePostSeries',
                            method: 'post',
                             data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.headEdit = false;
                                    this.$refs.ref_postseries.clearEdit();
                                    this.isShowHeadIcons = this.headIcons;
                                    this.isShowBodyIcons = this.bodyIcons;
                                    this.bodyShow = true;
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.originalHeadValue = res.data.data;
                                    this.$refs.ref_postseries.setData(
                                        'postseries',
                                        // JSON.parse(JSON.stringify(this.originalHeadValue))
                                        res.data.data
                                    );
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
            postSeriesJobLevelRowClick(scope){
                this.postSeriesSubEdit = false;
            }
        }
    };
</script>
<style>

</style>
