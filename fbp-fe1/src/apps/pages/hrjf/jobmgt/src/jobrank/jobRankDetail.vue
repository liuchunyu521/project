<template>
    <ifbp-page>
        <!--节点title-->
            <ifbp-breadcrumb v-if="isNew" name="新增职等"></ifbp-breadcrumb>
            <ifbp-breadcrumb v-if="isEdit" name="职等详情"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="jobRankPanel" title="基本信息"  >
                    <ifbp-template ref="ref_jobrank_c"
                                   tplId="ref_jobrank_c"
                                   :tplData='jobRankData'
                                   :editable='jobRankEdit'
                    >
                    </ifbp-template>
                    <div class="form-button-div"  v-if="jobRankEdit">
                        <el-button type="primary" class="legacy" @click="jobRankConfirm">保存</el-button>
                        <el-button type="default" class="legacy" @click="jobRankCancel">取消</el-button>
                    </div>
                    <div class="form-button-div"  v-if="!jobRankEdit">
                        <el-button type="primary" class="legacy" @click="editButtonClick">编辑</el-button>
                    </div>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {

        mixins : [pageModelMixin],
        data() {
            var vm = this;
            var $isNew;//是否是点击新增进入本页面
            var $isEdit;//是否是点击修改进入本页面
            var pkJobRank = this.$root.$router.currentRoute.params.id;
            var isEditForPath =  this.$root.$router.currentRoute.params.isEditForPath;
            if(pkJobRank){
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
                //是否新增
                isNew:$isNew,
                isEdit:$isEdit,
                editTitle:"新增职等",
                // 通过传入的参数判断是新增还是修改操作
                pk_jobRank: pkJobRank,
                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                // 基础panel显示图标
//                jobRankIcons: [
//                    {
//                        icon: "edit",
//                        click: function () {
//                            vm.jobRankEdit = !vm.jobRankEdit;
//                            vm.isNew = false;
//                            vm.isEdit = true;
//                        },
//                    }
//                ],
                // UI模板所需参数
                // jobRankPk: "0001AA10000000011DPF",
                jobRankData: {
                    jobrank: {},
                    params: "",
                    params1: "",
                    rules: {
//                        jobrankcode: [{
//                        required: true,
//                        trigger: "blur",
//                            validator(rule, value, callback) {
//                                var errors = [];
//                                if (!value) {
//                                    callback('编码不能为空');
////                                } else if (value.length > 6) {
////                                    callback('长度不能大于6.');
////                                } else if (!/^[0-9]+[-][0-9]+$/.test(value)) {
////                                    callback('格式：数字-数字 例如：10-1');
//                                }
//                                callback(errors);
//                            }
//                        }],
//                        jobrankname: [{required: true, message: "名称不能为空", trigger: "blur"}],
                    }
                },
                // 基本信息是否为修改态
                jobRankEdit: $headEdit,
                chooseAddOrUpdate: "",
                massageError: ""

            };
        },
        computed: {
//            showIcons:function(){
//                let retValue = {};
//                if(this.jobRankEdit === true){
//                    return retValue;
//                }else{
//                    return this.jobRankIcons;
//                }
//            }
        },
        mounted() {
        this.request();
        },
        methods: {
            editButtonClick() {
                this.jobRankEdit = !this.jobRankEdit;
                this.isNew = false;
                this.isEdit = true;
            },
            // 获取数据
            request() {
                // 请求基本信息详情
                this.requestJobRankBaseInfo();
            },
            // 请求客户基本信息详情
            requestJobRankBaseInfo() {
                if (!this.pk_jobRank) return;
                this.$http({
                    url: "/hrjf/jobRank/get/" + this.pk_jobRank,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalValue = res.data.data;
                            this.$refs.ref_jobrank_c.setData(
                                "jobrank",
                                JSON.parse(JSON.stringify(this.originalValue))
                            );
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "基本信息详情获取失败",
                            type: "error"
                        });
                    });
            },
            // 基本信息取消按钮操作
            jobRankCancel() {
                if(this.isNew === true){
                    this.$context.getApp().back();
//                    this.$router.push("/hrjf/jobRank");
                }
                this.jobRankEdit = false;
//                this.showIcons = this.jobRankIcons;
                if (this.originalValue) {
                    this.$refs.ref_jobrank_c.setData("jobrank", JSON.parse(JSON.stringify(this.originalValue)));
                } else {
                    this.$refs.ref_jobrank_c.setData("jobrank",
                        {
//                            jobrankorder: null,
                            jobrankcode: null,
                            jobrankname: null,
                            pk_org: null,
                        });
                }
            },
            // 基本信息保存按钮操作
            jobRankConfirm() {
                var data = this.$refs.ref_jobrank_c.getData("jobrank");
                if (!this.pk_jobRank) {
                    this.chooseAddOrUpdate = "/hrjf/jobRank/save";
                    this.massageError = "保存失败";
                } else {
                    this.chooseAddOrUpdate = "/hrjf/jobRank/update";
                    this.massageError = "更新失败";
                }
                this.$refs.ref_jobrank_c.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.chooseAddOrUpdate,
                            method: "post",
                            data: JSON.parse(JSON.stringify(data))
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    this.originalValue = res.data.data;
                                    this.$refs.ref_jobrank_c.setData(
                                        "jobrank",
                                        JSON.parse(JSON.stringify(this.originalValue))
                                    );
                                    this.pk_jobRank = this.originalValue.pk_jobrank;
                                    this.$refs.ref_jobrank_c.clearEdit();
                                    this.jobRankEdit = false;
//                                    this.showIcons = this.jobRankIcons;
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: this.massageError,
                                    type: "error"
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
