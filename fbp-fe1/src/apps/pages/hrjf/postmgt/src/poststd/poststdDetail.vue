<template>
    <ifbp-page>

        <ifbp-breadcrumb  v-if="isNew" name="新增基准岗位"></ifbp-breadcrumb>
        <ifbp-breadcrumb  v-if="isEdit" name="基准岗位详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='poststdBasicPanel' title='基本信息' :icons='isShowHeadIcons'   >
                    <ifbp-template ref='ref_poststd'
                                   tplId='poststdDetailTPL'
                                   :tpl-data='poststdData'
                                   :editable='headEdit'
                                   :tpl-reset-fun='poststdResetFun'
                                   :methods="poststdBasicMethods"
                                   :confirm-clear-edit="false"
                    >
                    </ifbp-template>
                    <div class='form-button-div' v-if='headEdit' v-show="isbEdit">
                        <el-button type='primary'  @click='poststdBasicInfoSave'>保存</el-button>
                        <el-button type='default'  @click='poststdBasicInfoCancel'>取消</el-button>
                    </div>
                </ifbp-panel>
                <!-- 子表1 -->
                <ifbp-panel id='poststdDemandPanel' title='任职资格' :icons='isShowBodyIcons'>
                    <ifbp-template ref='ref_poststddemand'
                                   tplId='poststdDemandsTPL'
                                   :tplData='poststdDemandData'
                                   :editable='poststdDemandEdit'
                                   :tpl-reset-fun='poststdDemandResetFun'
                                   :confirm-clear-edit="false"
                    >
                    </ifbp-template>
                    <div class='form-button-div' v-if='poststdDemandEdit'  v-show="isbEdit">
                        <el-button type='primary'  @click='poststdDemandSave'>保存</el-button>
                        <el-button type='default'  @click='poststdDemandCancel'>取消</el-button>
                    </div>
                </ifbp-panel>

                <!-- 子表2 -->
                <ifbp-panel id='joblevePanel' title='职级职等' :icons='isShowJobLevelIcons'  v-show='bodyShow' >
                    <ifbp-template ref='ref_poststd_levelrelation'
                                   tpl-id='poststdJobLevelAndRankId'
                                   :tpl-data='poststdSubData'
                                   :editable='poststdSubEdit'
                                   :form-show-message='poststdSubEdit'
                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :tplResetFun='poststdLevRankSubFun'
                                   :methods="formClickMethods"
                                   :table-show-menu="false"
                                   :table-oper-vif="tableOperVif && !headEdit && !poststdSubEdit&& !poststdDemandEdit"
                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"
                                   :confirm-clear-edit="false"
                                   @row-click="poststdJobLevelRowClick"
                                   @form-edit-click='poststdJobLevelFormEditClick'
                                   @edit-table-click='poststdSerEditClick'
                                   @delete-table-click='poststdSerSubDeleteClick'
                                   @form-confirm-click='poststdSerSubFormConfirm'
                                   @form-cancel-click='poststdSerSubFormCancel'
                                   @form-delete-click="poststdjobLevelFormDelete"
                    >
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>

        <!-- 按钮区域 -->
        <ifbp-footer   v-if="isNew" >
            <el-button type="default" @click="poststdBasicInfoCancel">取消</el-button>
            <el-button type="primary" @click="poststdAddDemandSave">保存</el-button>
        </ifbp-footer>

    </ifbp-page>
</template>
<script>
    import poststdDetail1JS from './poststdDetailSub.js';
    import  poststdJobTypeJS from './poststdJobLevelRankJS.js';
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
         mixins: [poststdDetail1JS,poststdJobTypeJS,pageModelMixin],
        data() {
            const vm = this;
            //取路由路径参数
            var poststdParam = this.$root.$router.currentRoute.params.id;
            var isEditForPath =  this.$root.$router.currentRoute.params.isEditForPath;

            var $isNew;
            var $isEdit;
            if(poststdParam){
                $isNew = false;
                $isEdit = true;
            }else{
                $isNew = true;
                $isEdit = false;
            }
            var $headEdit=true;    //调整进入编辑页时是否是编辑态 false 否  true  是
            if(isEditForPath ===  "false"){
                $headEdit=false;
            }
            return {
                // 存储基准岗位基本信息和任职资格
                poststdBaseAndDemandData: {
                    poststdbase: {},
                    poststddemand: {},
                },
                //存储所选的基准岗位序列对象
                selectedpoststdSeries:"",
                //是否新增态
                isNew:$isNew,
                //是否编辑态
                isEdit:$isEdit,
                pk_poststd:poststdParam,
                originalHeadValue:{},
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
                poststdData:{

                },
                // 基本信息是否为修改态
                headEdit: $headEdit,
                isbEdit: $isEdit ,
                descpoststdEdit:$isEdit,
                bodyShow: false,

                poststdBasicMethods:{

                },
                poststdResetFun: function ($node) {

                    return $node[0].outerHTML;
                }
            };
        },
        computed: {
            isShowJobLevelIcons:function () {
                let  tempVal = {};
                if(this.poststdSubEdit === true || this.headEdit === true || this.poststdDemandEdit === true  ){
                    return tempVal;
                }else {
                    return this.bodyIconsSub;
                }
            },

            isShowHeadIcons:function(){
                let  tempVal = {};
                if(this.headEdit === true || this.poststdSubEdit === true || this.poststdDemandEdit === true ){
                    return tempVal;
                }else{
                    return this.headIcons;
                }
            },
            isShowBodyIcons:function(){
                let tempVal = {};
                if(this.poststdDemandEdit === true || this.headEdit === true || this.poststdSubEdit === true){
                    return tempVal;
                }else{
                    return this.bodyIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.poststdDemandEdit === true || this.headEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.poststdDemandEdit === true || this.headEdit === true) {
                    return false;
                }
            },
            //子表取消按钮显示逻辑：点击编辑按钮，子表可编辑，显示取消按钮
            cancelButtonShow: function () {
                if (this.poststdDemandEdit === true || this.headEdit === true || this.poststdSubEdit ===false) {
                    return false;
                }
            },
            //子表删除按钮显示逻辑：子表不可编辑时，点击行，显示删除按钮
            deleteButtonShow: function () {
                if (this.headEdit === true || this.poststdDemandEdit === true || this.poststdSubEdit === true) {
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
                this.poststdSubEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            // 获取数据
            request() {
                // 请求基准岗位基本信息详情
                this.requestpoststdInfo();
                // 请求基准岗位子表列表,引入js后放开
                this.requestpoststdDemand();
                // 职级职等
                this.requestpoststdSerSub();
            },

            requestpoststdInfo(pk_post) {
                if (!this.pk_poststd || this.pk_poststd === undefined || this.pk_poststd.length <= 0 || pk_post) {
                    return;
                }
                this.$http({
                    url: '/hrjf/postStd/getById/' + this.pk_poststd,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.selectedpoststdSeries = res.data.data.pk_postseries;
                            this.originalHeadValue = res.data.data;
                            this.$refs.ref_poststd.setData(
                                'poststd',
                                 JSON.parse(JSON.stringify(this.originalHeadValue))
                               // res.data.data
                            );
                            this.$refs.ref_poststddemand.setData(
                                         'poststd_demands',
                                         JSON.parse(JSON.stringify(this.originalHeadValue))
                                          // res.data.data
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
            poststdBasicInfoCancel() {
                if (this.isNew === true) {
                    this.$context.getApp().back();
                }else{
                   // this.requestpoststdInfo();
                    this.headEdit = false;
                    this.isShowHeadIcons = this.headIcons;
                    this.isShowBodyIcons = this.bodyIcons;
                    this.isShowJobLevelIcons = this.bodyIconsSub;
                    this.$refs.ref_poststd.resetFormData();
                    this.$refs.ref_poststd.setData('poststd', JSON.parse(JSON.stringify(this.originalHeadValue)));
                }

            },

            //主表新增时基本信息和 任职资格 一块保存
            poststdAddDemandSave(){
                var vm = this;
                const  $dataDemand = vm.$refs.ref_poststddemand.getData('poststd_demands');
                const $dataBase = vm.$refs.ref_poststd.getData('poststd');
                vm.poststdBaseAndDemandData.poststdbase = $dataBase;
                vm.poststdBaseAndDemandData.poststddemand = $dataDemand;
                let data = JSON.parse(JSON.stringify(vm.poststdBaseAndDemandData));
                vm.$refs.ref_poststddemand.validate((valid) => {
                    if(valid){
                        vm.$refs.ref_poststd.validate((valid) => {
                            if(valid){
                                vm.$http({
                                    url: '/hrjf/postStd/saveBothPost',
                                    method: 'post',
                                    data: data
                                })
                                    .then((res) => {
                                        if (res.data.status === true) {
                                            vm.$refs.ref_poststd.clearEdit();
                                            vm.$refs.ref_poststddemand.clearEdit();
                                            // this.$refs.ref_poststd.clearEdit();
                                            vm.selectedpoststdSeries = res.data.data.pk_postseries;
                                            vm.isNew =false;
                                            vm.isEdit = true;
                                            vm.isbEdit = true;
                                            vm.headEdit = false;
                                            vm.poststdDemandEdit = false;
                                            vm.isShowHeadIcons = vm.headIcons;
                                            vm.isShowBodyIcons = vm.bodyIcons;
                                            vm.bodyShow = true;
                                            vm.descpoststdEdit = true;
                                            vm.$message({
                                                message: res.data.msg,
                                                type: 'success'
                                            });
                                            vm.originalHeadValue = res.data.data;
                                            vm.$refs.ref_poststddemand.setData(
                                                'poststd_demands',
                                                // JSON.parse(JSON.stringify(this.originalHeadValue))
                                                res.data.data
                                            );
                                            vm.$refs.ref_poststd.setData(
                                                'poststd',
                                                // JSON.parse(JSON.stringify(this.originalHeadValue))
                                                res.data.data
                                            );
                                            vm.request();
                                        } else {
                                            vm.$message({
                                                message: res.data.msg,
                                                type: 'error'
                                            });
                                        }
                                    })
                                    .catch((er) => {
                                        vm.$message({
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
            poststdBasicInfoSave() {
                const data = this.$refs.ref_poststd.getData('poststd');
                this.$refs.ref_poststd.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/postStd/savePost',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    // this.$refs.ref_poststd.clearEdit();
                                    this.selectedpoststdSeries = res.data.data.pk_postseries;
                                    this.headEdit = false;
                                    this.$refs.ref_poststd.clearEdit();
                                    this.isShowHeadIcons = this.headIcons;
                                    this.isShowBodyIcons = this.bodyIcons;
                                    this.isShowJobLevelIcons = this.bodyIconsSub;
                                    this.bodyShow = true;
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.originalHeadValue = res.data.data;
                                    this.$refs.ref_poststd.setData(
                                        'poststd',
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
            poststdJobLevelRowClick(scope){
                this.poststdSubEdit = false;
            }
        }
    };
</script>
<style>

</style>
