<template>
    <!-- <div v-show="value">  -->
    <el-dialog title="延长试用期" v-model="dialogVisible" size="tiny">
        <ifbp-template ref="ycsyqRef"
                       tpl-id="hrtrn_regapply_yc_dialog"
                       :tpl-data="regapplyData"
                       :tpl-reset-fun="tableFormResetFun"
                       :methods="childFormMethods">
        </ifbp-template>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">保存</el-button>
        <el-button @click="handleCommit" type="primary">提交</el-button>
      </span>
    </el-dialog>
    <!-- </div>  -->
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        props: [],
        data() {
            var vm = this;
            return {
                dialogVisible: false,
                regapplyData: {
                    hi_regapply: {},
                    rules: {},
                },
                hi_regapply: {},
                pk_hi_regapply: '',
                pk_psnjob: '',
                trial_type: 1,
                //模板控件里的method内容
                childFormMethods: {},

                tableFormResetFun($node) {
                    var form = $node.find("el-form");
                    var html = '<el-form-item label="附件">'
                        + '<ifbp-upload busi-code="60090regapply" force-type = "normal" :pk-busi="hi_regapply.pk_hi_regapply"></ifbp-upload>'
                        + '</el-form-item>';
                    form.append(html);
                    return $node[0].outerHTML;
                },
            };
        },
        watch: {
        },
        mounted() {
        },
        methods: {
            show(pk_psnjob, trial_type){
                this.trial_type = trial_type;
                this.pk_psnjob = pk_psnjob;
                this.initData(pk_psnjob, trial_type);
            },
            initData(pk_psnjob, trial_type){
                this.pk_psnjob = pk_psnjob;
                var url = '/hrtrn/regmng/apply/addinit?pk_psnjob=' + pk_psnjob + '&probationType=' + trial_type + '&isZz=false';
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.dialogVisible = true;
                            this.$nextTick(function () {
                                this.$refs.ycsyqRef.setFormData(res.data.data);
                                this.hi_regapply = JSON.parse(JSON.stringify(res.data.data));
                                this.pk_hi_regapply = res.data.data.pk_hi_regapply;
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: "页面初始化失败",
                            type: "error"
                        });
                    });
            },
            handleCommit(){
                this.$refs.ycsyqRef.validate(valid => {
                    if (valid) {
                        this.handleRealCommit();
                    }
                });
            },

            handleRealCommit(){
                let data = this.$refs.ycsyqRef.getFormData();
                let myself = this;
                data.status = 2;
                this.$http({
                    url: "/hrtrn/regmng/apply/commit",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/2");
                            });
                        } else {
                            if(res.data.saveResult){
                                this.dialogVisible = false;
                                this.$nextTick(function(){
                                    myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/2");
                                });
                            }
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "提交失败",
                            type: "error"
                        });
                    });

            },
            handleCancel(){
                this.dialogVisible = false;
            },
            handleSave() {
                this.$refs.ycsyqRef.validate(valid => {
                    if (valid) {
                        this.handleRealSave();
                    }
                });
            },
            // 基本信息保存按钮操作
            handleRealSave() {
                let data = this.$refs.ycsyqRef.getFormData();
                data.approve_state = -1;
                let myself = this;
                this.$http({
                    url: "/hrtrn/regmng/apply/insert",
                    method: "post",
                    data: data
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.dialogVisible = false;
                            this.$nextTick(function () {
                                myself.$router.push("/hrtrn/regapply/applydetail/" + myself.pk_hi_regapply + "/false/2");
                            });

                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "保存失败",
                            type: "error"
                        });
                    });
            }
        }
    };
</script>
<style>
</style>
