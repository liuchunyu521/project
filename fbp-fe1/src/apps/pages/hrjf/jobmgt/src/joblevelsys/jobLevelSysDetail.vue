<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb v-if="isNew" name="新增职级类别"></ifbp-breadcrumb>
        <ifbp-breadcrumb v-if="isEdit" name="职级类别详情"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='joblevelsysPanel' title='基本信息' :icons='isShowHeadIcons' >
                    <ifbp-template ref='ref_joblevelsys'
                                   tplId='joblevelsysdetail'
                                   :tplData='joblevelsysData'
                                   :editable='jobLevelSysEdit'
                                   :tpl-reset-fun='joblevelsysResetFun'
                    >
                    </ifbp-template>
                    <div class="form-button-div" v-if="jobLevelSysEdit">
                        <el-button type="primary" class="legacy" @click="joblevelsysSave">保存</el-button>
                        <el-button type="default" class="legacy" @click="joblevelsysCancel">取消</el-button>
                    </div>
                </ifbp-panel>
                <!-- 子表 -->
                <ifbp-panel id='joblevePanel' title='职级详情' :icons='isShowBodyIcons' v-show='bodyShow' >
                    <ifbp-template ref='ref_joblevel'
                                   tpl-id='jobleveId'
                                   :tpl-data='joblevelData'
                                   :editable='joblevelEdit'
                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :table-oper-vif="tableOperVif && !joblevelEdit && !jobLevelSysEdit"
                                   :tplResetFun='joblevelResetFun'
                                   :form-show-message='joblevelEdit'
                                   :table-show-menu="false"
                                   :confirm-clear-edit="false"

                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"

                                   @row-click='jobLevelRowClick'
                                   @edit-table-click='joblevelEditClick'
                                   @delete-table-click='joblevelDeleteClick'
                                   @form-edit-click='jobLevelPanelFormEditClick'
                                   @form-confirm-click='joblevelFormConfirm'
                                   @form-cancel-click='joblevelFormCancel'
                                   @form-delete-click="jobLevelFormDelete"
                    >
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import jobLevelSysDetailJS from './jobLevelSysDetailJS.js';
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [jobLevelSysDetailJS,pageModelMixin],
        data() {
            const vm = this;
            var pkjoblevelsys = this.$root.$router.currentRoute.params.id;
            var isEditForPath =  this.$root.$router.currentRoute.params.isEditForPath;
            var $isNew;
            var $isEdit;
            if (pkjoblevelsys) {
                $isNew = false;
                $isEdit = true;
            } else {
                $isNew = true;
                $isEdit = false;
            }
            var $headEdit=true;
            if(isEditForPath ===  "false"){
                $headEdit=false;
            }
            return {
                //是否新增态
                isNew: $isNew,
                //是否编辑态
                isEdit: $isEdit,
                isShowMessage: true,
                pk_joblevelsys: pkjoblevelsys,
                // 通过传入的参数判断是新增还是修改操作
                originalHeadValue: {},
                // ifbp-panel-group所需参数
                scrollDom: 'ifbpScrollDom',
//                isShowHeadIcons: {},//为了实现点击编码进入详情显示图标，此处需要注释
//                isShowBodyIcons: {},
                // 基础panel显示图标
                headIcons: [
                    {
                        icon: 'edit',
                        click: function () {
                            vm.status = 1;
                            vm.jobLevelSysEdit = !vm.jobLevelSysEdit;
                            vm.isShowHeadIcons = {};
                            vm.isShowBodyIcons = {};
                            //新增界面保存之后再修改状态点击取消不跳转到列表界面
                            vm.isNew = false;
                            vm.isEdit = true;
                        }
                    }
                ],
                // UI模板所需参数
                // pk_tempform: '0001AA1000000000LLSE',
                joblevelsysData: {
                    rules: {
                    }
                },
                status: 2, //1, update; 2, new; 3, delete
                // 基本信息是否为修改态
                jobLevelSysEdit: $headEdit,
                jobleveEdit: false,
                bodyShow: false,
                joblevelsysResetFun: function ($node) {
                    return $node[0].outerHTML;
                }
            };
        },
        computed: {
            isShowHeadIcons:function(){
                let retValue = {};
                if(this.jobLevelSysEdit === true || this.joblevelEdit === true){
                    return retValue;
                }else{
                    return this.headIcons;
                }
            },
            isShowBodyIcons:function(){
                let retValue = {};
                if(this.jobLevelSysEdit === true || this.joblevelEdit === true){
                    return retValue;
                }else{
                    return this.bodyIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.jobLevelSysEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.jobLevelSysEdit === true) {
                    return false;
                }
            },
            cancelButtonShow: function () {
                if (this.jobLevelSysEdit === true || this.joblevelEdit === false) {
                    return false;
                }
            },
            deleteButtonShow: function () {
                if (this.jobLevelSysEdit === true || this.joblevelEdit === true) {
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
                this.joblevelEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            // 获取数据
            request() {
                // 请求职级基本信息详情
                this.requestJoblevelsysInfo();
                // 请求职级子表列表
                this.requestJoblevel();
            },
            // 请求职级类别基本信息详情
            requestJoblevelsysInfo() {
                if (!this.pk_joblevelsys || this.pk_joblevelsys === undefined || this.pk_joblevelsys.length <= 0) {
                    this.status = 2;
                    return;
                } else {
                    this.status = 1;

                }
                this.$http({
                    url: '/hrjf/jobLevelSys/getById/' + this.pk_joblevelsys,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalHeadValue = res.data.data;
                            this.baseData = JSON.parse(JSON.stringify(this.originalHeadValue));
                            this.$refs.ref_joblevelsys.setData(
                                'om_joblevelsys',
                                JSON.parse(JSON.stringify(this.originalHeadValue))
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
            joblevelsysCancel() {
                if (this.isNew === true) {
                    this.$context.getApp().back();
//                    this.$router.push("/hrjf/jobLevelSys");
                }
                this.jobLevelSysEdit = false;
                this.isShowHeadIcons = this.headIcons;
                this.isShowBodyIcons = this.bodyIcons;
                if (this.originalHeadValue) {
                    this.$refs.ref_joblevelsys.setData("om_joblevelsys"
                        , JSON.parse(JSON.stringify(this.originalHeadValue)));
                } else {
                    this.$refs.ref_joblevelsys.setData("om_joblevelsys",
                        {
                            code: null,
                            name: null,
                            pk_org: null,
                        }
                    );
                }
            },
            // 基本信息保存按钮操作
            joblevelsysSave() {
                const data = this.$refs.ref_joblevelsys.getData('om_joblevelsys');
                data.status = this.status;
                this.$refs.ref_joblevelsys.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/jobLevelSys/save',
                            method: 'post',
                            data: JSON.parse(JSON.stringify(data))
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$refs.ref_joblevelsys.clearEdit();
                                    this.jobLevelSysEdit = false;
                                    this.isShowHeadIcons = this.headIcons;
                                    this.isShowBodyIcons = this.bodyIcons;
                                    this.bodyShow = true;
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.originalHeadValue = res.data.data;
                                    this.$refs.ref_joblevelsys.setData(
                                        'om_joblevelsys',
                                        JSON.parse(JSON.stringify(this.originalHeadValue))
                                    );
                                    this.request();
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: '更新失败',
                                    type: 'error'
                                });
                            });
                    }
                });
            }
        }
    };
</script>
<style>

</style>
