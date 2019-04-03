<template>
    <ifbp-page>
        <ifbp-breadcrumb v-if="isNew" name="新增职务"></ifbp-breadcrumb>
        <ifbp-breadcrumb v-if="isEdit" name="职务详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="jobPanel" title="基本信息" :icons="isShowHeadIcons" >
                    <ifbp-template ref="ref_job_c"
                                   tplId="jobDetailTpId"
                                   :tplData="jobData"
                                   :editable="jobEdit"
                                   :tpl-reset-fun="jobFormResetFun"
                                   :methods="formMethods"
                    >
                    </ifbp-template>
                    <ifbp-form-button-area v-if="jobEdit">
                        <el-button type="primary" class="legacy" @click="jobConfirm">保存</el-button>
                        <el-button type="default" class="legacy" @click="jobCancel">取消</el-button>
                    </ifbp-form-button-area>
                </ifbp-panel>
                <!-- 子表职务_职级页签 -->
                <ifbp-panel id="jobLevelPanel" title="职级职等" :icons="isShowBodyIcons" v-show='bodyShow'>
                    <ifbp-template ref="ref_job_levelrelation"
                                   tpl-id="jobJobLevelTpId"
                                   :tpl-data="jobLevelData"
                                   :tpl-reset-fun="jobLevelResetFun"
                                   :methods="formMethods4Child"
                                   :editable="jobLevelEdit"
                                   :form-show-message='jobLevelEdit'
                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :table-oper-vif="tableOperVif && !jobLevelEdit && !jobEdit"
                                   :computed="childComputed"
                                   :table-show-menu="false"
                                   :confirm-clear-edit="false"

                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"

                                   @row-click='jobLevelRowClick'
                                   @edit-table-click='jobLevelPanelEditClick'
                                   @delete-table-click='jobLevelDeleteClick'
                                   @form-edit-click='jobLevelPanelFormEditClick'
                                   @form-confirm-click='jobLevelFormConfirm'
                                   @form-cancel-click='jobLevelFormCancel'
                                   @form-delete-click="jobLevelFormDeleteClick"

                    >
                    </ifbp-template>
                </ifbp-panel>

                <!--职务说明书-->
                <ifbp-panel id="jobDescPanel" title="职务说明书" v-show="jobDescShow" >
                    <ifbp-upload
                            busi-code="jobdesc"
                            force-type = 'normal'
                            :pk-busi="pk_job">
                    </ifbp-upload>
                </ifbp-panel>


            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import jobDetailJS from "./jobDetailJS.js";
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [jobDetailJS,pageModelMixin],
        data() {
            const vm = this;
            var pkjob = this.$root.$router.currentRoute.params.id;
            var isEditForPath = this.$root.$router.currentRoute.params.isEditForPath;

            var $isNew;
            var $isEdit;
            if (pkjob) {
                $isNew = false;
                $isEdit = true;
            } else {
                $isNew = true;
                $isEdit = false;
            }
            var $headEdit = true;
            if (isEditForPath === "false") {
                $headEdit = false;
            }
            return {
                //是否新增态
                isNew: $isNew,
                //是否编辑态
                isEdit: $isEdit,
                // 通过传入的参数判断是新增还是修改操作
                pk_job: pkjob,
                pk_joblevelsys: '',
                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                //编辑前数据
                originalHeadValue: {},
//                isShowHeadIcons: {},
//                isShowBodyIcons: {},
                // 基础panel显示图标
                jobIcons: [
                    {
                        icon: "edit",
                        click: function () {
                            vm.jobEdit = !vm.jobEdit;
                            vm.isShowHeadIcons = {};
                            vm.isShowBodyIcons = {};
                            //新增界面保存之后再修改状态点击取消不跳转到列表界面
                            vm.isNew = false;
                            vm.isEdit = true;
                        },
                    }
                ],
                // UI模板所需参数
                // jobPk: "0001AA10000000014YKO",
                // 基本信息是否为修改态
                jobEdit: $headEdit,
                //是否显示表体
                bodyShow: false,
                jobDescShow: false,
                chooseAddOrUpdateUrl: "",
                massageError: "",
                //按钮名称
//                cancelButton: "删除",
                childComputed:{
                    //职等和默认职等是否可编辑
                    pkJobrankIsAbleEdit: function () {
                        if(!this.job_levelrelation.jobrank){
                            this.job_levelrelation.defaultrank = "";
                        }
                        if(this.job_levelrelation.pk_joblevel){
                            return false;
                        }else{
                            this.job_levelrelation.jobrank = "";
                            this.job_levelrelation.defaultrank = "";
                            return true;
                        }
                    },

                },
                jobData: {
                    job: {},
                    rules: {}
                },
                formMethods: {
                    //选择职务类别后，将值作为子表职级的过滤条件，继承职务类别的子表职级
                    triggerHandle: function (type, data) {
                        var btRef = vm.$refs.ref_job_levelrelation;
                        if(data.value && data.value.length > 0){
                            var newRefId = data.value[0].id;
                            btRef.setData('paramsJobLevels', {pk_jobtype: newRefId});
                        }
                    }
                },
                jobFormResetFun: function ($node) {
                    //参照传参 职级类别
                    var $refPkJobltype = $node.find("[v-model='om_job.pk_jobtype']");
                    $refPkJobltype.attr('v-on:trigger', 'triggerHandle');
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getBaseTableOperateHtml();
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
            };
        },
        computed: {
            isShowHeadIcons: function () {
                let retValue = {};
                if (this.jobEdit === true || this.jobLevelEdit === true) {
                    return retValue;
                } else {
                    return this.jobIcons;
                }
            },
            isShowBodyIcons: function () {
                let retValue = {};
                if (this.jobEdit === true || this.jobLevelEdit === true) {
                    return retValue;
                } else {
                    return this.jobLevelIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.jobEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.jobEdit === true) {
                    return false;
                }
            },
            cancelButtonShow: function () {
                if (this.jobEdit === true || this.jobLevelEdit === false) {
                    return false;
                }
            },
            //如果子表是编辑态，不显示删除按钮
            deleteButtonShow: function () {
                if (this.jobEdit === true || this.jobLevelEdit === true) {
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
                this.jobLevelEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            // 获取数据
            request() {
                // 请求主表基本信息详情
                this.requestJobBaseInfo();
                // 请求子表列表信息
                this.requestJobLeveRelation();
            },
            // 请求职务基本信息详情
            requestJobBaseInfo() {
                if (!this.pk_job) return;
                this.$http({
                    url: "/hrjf/job/get/" + this.pk_job,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalHeadValue = res.data.data;
                            this.$refs.ref_job_c.setData(
                                "om_job",
                                JSON.parse(JSON.stringify(this.originalHeadValue))
                            );
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "基本信息详情获取失败",
                            type: "error"
                        });
                    });
            },
            // 基本信息取消按钮操作
            jobCancel() {
                if (this.isNew === true) {
                    this.$context.getApp().back();
//                    this.$router.push("/hrjf/job");
                }
                this.jobEdit = !this.jobEdit;
                this.isShowHeadIcons = this.jobIcons;
                this.isShowBodyIcons = this.jobLevelIcons;
                if (!this.pk_job) {
                    // 显示新增区域
                    this.$refs.ref_job_levelrelation.formShow = false;
                }
                this.$refs.ref_job_c.setData('om_job', JSON.parse(JSON.stringify(this.originalHeadValue)));

            },
            // 基本信息保存按钮操作
            jobConfirm() {
                var data = this.$refs.ref_job_c.getData("om_job");
                if (!this.pk_job) {
                    this.chooseAddOrUpdateUrl = "/hrjf/job/save";
                    this.massageError = "保存失败";
                } else {
                    this.chooseAddOrUpdateUrl = "/hrjf/job/update";
                    this.massageError = "更新失败";
                }
                this.$refs.ref_job_c.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.chooseAddOrUpdateUrl,
                            method: "post",
                            data: JSON.parse(JSON.stringify(data))
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.request();
                                    //成功提示消息框
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    //将成功数据缓存
                                    this.originalHeadValue = res.data.data;
                                    this.$refs.ref_job_c.setData(
                                        'om_job',
                                        JSON.parse(JSON.stringify(this.originalHeadValue))
                                    );

                                    //将主表设为不可编辑
                                    this.jobEdit = false;
                                    this.$refs.ref_job_c.clearEdit();
                                    //将子表设置为显示
                                    this.bodyShow = true;
                                    this.jobDescShow= true;
                                    if (this.$refs.ref_job_levelrelation
                                            .getData('job_levelrelation_t').length <= 0) {
                                        this.$refs.ref_job_levelrelation.tableShow = false;
                                    }
                                    this.pk_job = this.originalHeadValue.pk_job;
                                    //将编辑界面修改图标隐藏
                                    this.isShowHeadIcons = this.jobIcons;
                                    this.isShowBodyIcons = this.jobLevelIcons;
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: this.massageError,
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
