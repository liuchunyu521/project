<template>
    <ifbp-page>
        <!--节点title-->
            <ifbp-breadcrumb v-if="isNew" name="新增职务类别"></ifbp-breadcrumb>
            <ifbp-breadcrumb v-if="isEdit" name="职务类别详情"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="jobTypePanel" title="基本信息" :icons="isShowHeadIcons">
                    <ifbp-template ref="ref_jobtype_c"
                                   tplId="jobTypeDetailTpId"
                                   :tplData="jobTypeData"
                                   :editable="jobTypeEdit"
                                   :tpl-reset-fun="jobTypeFormResetFun"
                                   :methods="formMethods"
                    >
                    </ifbp-template>
                    <div class="form-button-div" v-if="jobTypeEdit">
                        <el-button type="primary" class="legacy" @click="jobTypeConfirm">保存</el-button>
                        <el-button type="default" class="legacy" @click="jobTypeCancel">取消</el-button>
                    </div>
                </ifbp-panel>
                <!-- 子表职务类别_职级页签 -->
                <ifbp-panel id="jobTypeLevelPanel" title="职级职等" :icons="isShowBodyIcons" v-show='bodyShow'>
                    <ifbp-template ref="ref_jobtype_levelrelation"
                                   tpl-id="jobTypeLevelTpId"
                                   :tpl-data="jobTypeLevelData"
                                   :tpl-reset-fun="jobTypeLevelResetFun"
                                   :methods="formMethods4Child"
                                   :editable="jobTypeLevelEdit"
                                   :form-show-message='jobTypeLevelEdit'
                                   @update:editable="updateEvent"
                                   @expand="expandEvent"
                                   :table-oper-vif="tableOperVif && !jobTypeLevelEdit && !jobTypeEdit"
                                   :table-show-menu="false"
                                   :confirm-clear-edit="false"

                                   :confirm-button-show="confirmButtonShow"
                                   :edit-button-show="editButtonShow"
                                   :cancel-button-show="cancelButtonShow"
                                   :delete-button-show="deleteButtonShow"

                                   @row-click="jobTypeLevelRowClick"
                                   @edit-table-click='jobTypeLevelPanelEditClick'
                                   @delete-table-click='jobTypeLevelDeleteClick'
                                   @form-edit-click='jobTypeLevelPanelFormEditClick'
                                   @form-confirm-click='jobTypeLevelFormConfirm'
                                   @form-cancel-click='jobTypeLevelFormCancel'
                                   @form-delete-click='jobTypeLevelFormDelete'
                    >
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import jobTypeDetailJS from "./jobTypeDetailJS.js";
    export default {
        mixins: [jobTypeDetailJS,pageModelMixin],
        data() {
            const vm = this;
            var pkJobType = this.$root.$router.currentRoute.params.id;
            var isEditForPath =  this.$root.$router.currentRoute.params.isEditForPath;
            var $isNew;
            var $isEdit;
            if(pkJobType){
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
                // 通过传入的参数判断是新增还是修改操作
                pk_jobType: pkJobType,
                pk_joblevelsys: '',
                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                //编辑前数据
                originalHeadValue: {},
                originalBodyValue: [],
//                isShowHeadIcons:{},
//                isShowBodyIcons:{},
                // 基础panel显示图标
                jobTypeIcons: [
                    {
                        icon: "edit",
                        click: function () {
                            vm.jobTypeEdit = !vm.jobTypeEdit;
                            vm.isShowHeadIcons = {};
                            vm.isShowBodyIcons    = {};
                            //新增界面保存之后再修改状态点击取消不跳转到列表界面
                            vm.isNew = false;
                            vm.isEdit = true;
                        },
                    }
                ],
                // UI模板所需参数
                // jobTypePk: "0001AA10000000006H1O",
                // 基本信息是否为修改态
                jobTypeEdit: $headEdit,
                //是否显示表体
                bodyShow: false,
                chooseAddOrUpdateUrl: "",
                massageError: "",
                jobTypeData: {
                    jobtype: {},
                    jobTypeParams:{
                        unSelfAndChild: pkJobType
                    },
                    rules: {
//                        jobtypename: [{required: true, message: "名称不能为空", trigger: "blur"}],
//                        jobtypecode: [{required: true, message: "编码不能为空", trigger: "blur"}],
//                        pk_joblevelsys: [{required: true, message: "职级类别不能为空", trigger: "blur"}],
//                        pk_org: [{required: true, message: "所属组织不能为空", trigger: "blur"}]

                    }
                },
                formMethods: {
                   //如果选择了其他的职级类别那么需要清空所有职级数据
                    triggerHandle: function (type, data) {
                        var btRef = vm.$refs.ref_jobtype_levelrelation;
                        var newRefId = data.value[0].id;
                        btRef.setData('paramsJobLevelSys',{pk_joblevelsys: newRefId});
                        if(vm.originalHeadValue && (vm.originalHeadValue.pk_joblevelsys !== newRefId)){
                            btRef.setData("jobtype_levelrelation_t",[]);

                        }
                    }
                },
                jobTypeFormResetFun: function ($node) {
                    //参照传参 职级类别
                    var refpkjoblevelsys = $node.find("[v-model='jobtype.pk_joblevelsys']");
                    refpkjoblevelsys.attr('v-on:trigger', 'triggerHandle');
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getBaseTableOperateHtml();
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
            };
        },
        computed: {
            isShowHeadIcons:function(){
                let retValue = [];
                if(this.jobTypeEdit === true || this.jobTypeLevelEdit === true){
                    return retValue;
                }else{
                    return this.jobTypeIcons;
                }
            },
            isShowBodyIcons:function(){
                let retValue = [];
                if(this.jobTypeEdit === true || this.jobTypeLevelEdit === true){
                    return retValue;
                }else{
                    return this.jobTypeLevelIcons;
                }
            },
            confirmButtonShow: function () {
                if (this.jobTypeEdit === true) {
                    return false;
                }
            },
            editButtonShow: function () {
                if (this.jobTypeEdit === true) {
                    return false;
                }
            },
            cancelButtonShow: function () {
                if (this.jobTypeEdit === true || this.jobTypeLevelEdit === false) {
                    return false;
                }
            },
            deleteButtonShow: function () {
                if (this.jobTypeEdit === true || this.jobTypeLevelEdit === true) {
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
                this.jobTypeLevelEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            // 获取数据
            request() {
                // 请求主表基本信息详情
                this.requestJobTypeBaseInfo();
                // 请求子表列表信息
                this.requestJobLeveRelation();
            },
            // 请求职务类别基本信息详情
            requestJobTypeBaseInfo() {
                if (!this.pk_jobType) return;
                this.$http({
                    url: "/hrjf/jobType/get/" + this.pk_jobType,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalHeadValue = res.data.data;
                            this.$refs.ref_jobtype_c.setData(
                                "jobtype",
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
            jobTypeCancel() {
                if(this.isNew === true){
                    this.$context.getApp().back();
//                    this.$router.push("/hrjf/jobType");
                }
                this.jobTypeEdit = !this.jobTypeEdit;
                this.isShowHeadIcons = this.jobTypeIcons;
                this.isShowBodyIcons = this.jobTypeLevelIcons;
                if (!this.pk_jobType) {
                    // 显示新增区域
                    this.$refs.ref_jobtype_levelrelation.formShow = false;
                }
                this.$refs.ref_jobtype_c.setData('jobtype', JSON.parse(JSON.stringify(this.originalHeadValue)));
                if(this.originalBodyValue){
                    this.$refs.ref_jobtype_levelrelation.setData('jobtype_levelrelation_t', JSON.parse(JSON.stringify(this.originalBodyValue)));
                }
            },
            // 基本信息保存按钮操作
            jobTypeConfirm() {
                var data = this.$refs.ref_jobtype_c.getData("jobtype");
                if (!this.pk_jobType) {
                    this.chooseAddOrUpdateUrl = "/hrjf/jobType/save";
                    this.massageError = "保存失败";
                } else {
                    this.chooseAddOrUpdateUrl = "/hrjf/jobType/update";
                    this.massageError = "更新失败";
                }
                this.$refs.ref_jobtype_c.validate((valid) => {
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
                                    this.$refs.ref_jobtype_c.setData(
                                        'jobtype',
                                        JSON.parse(JSON.stringify(this.originalHeadValue))
                                    );
                                    this.$refs.ref_jobtype_c.clearEdit();
                                    //将主表设为不可编辑
                                    this.jobTypeEdit = false;
                                    //将子表设置为显示
                                    this.bodyShow = true;
                                    if(this.$refs.ref_jobtype_levelrelation
                                            .getData('jobtype_levelrelation_t').length <= 0){
                                        this.$refs.ref_jobtype_levelrelation.tableShow = false;
                                    }
                                    this.pk_jobType = this.originalHeadValue.pk_jobtype;
                                    //将编辑界面修改图标隐藏
                                    this.isShowHeadIcons = this.jobTypeIcons;
                                    this.isShowBodyIcons = this.jobTypeLevelIcons;
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
