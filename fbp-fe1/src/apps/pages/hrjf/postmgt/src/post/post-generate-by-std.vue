<template>
    <el-dialog title="按基准岗位批增" class="poststdDialog" :visible.sync="dialogVisible" size="large" width="80%"
               :show-close="false">
        <!-- 主体区域 -->
        <!--<ifbp-main-area type="detail">-->
        <div class="poststd_Spectrum">
            <el-steps :space="200" :active="active" finish-status="success">
                <el-step title="选择部门、基准岗位"></el-step>
                <el-step title="选择需要生成的岗位"></el-step>
                <el-step title="设置编码、名称"></el-step>
            </el-steps>
        </div>
        <div class="ref_postd_dialog">
            <ifbp-template ref="ref_poststd_dialog"
                           tpl-id="poststd_first_tpl"
                           v-show="isShowFirstTpl"
                           :editable="true"
                           :tpl-data="firstData"
                           :methods="firstFormMethods"
                           :tpl-reset-fun="firstResetFun"

                           @after-create="afterCreateFunc"
            >
            </ifbp-template>
        </div>


        <ifbp-template ref="ref_poststd_dialog2"
                       tpl-id="poststd_second_tpl"
                       :editable="true"
                       v-show="isShowSecondTpl"
                       :tpl-data="secondData"
                       :methods="secondFormMethods"
                       :tpl-reset-fun="secondResetFun"
        >
        </ifbp-template>

        <ifbp-template ref="ref_poststd_dialog3"
                       tpl-id="poststd_third_tpl"
                       :editable="true"
                       v-show="isShowThirdTpl"
                       :tpl-data="thirdData"
                       :methods="thirdMethods"
                       :tpl-reset-fun="thirdResetFun"
        >
        </ifbp-template>
        <span slot="footer" class="dialog-footer">
            <el-button @click="exit">取消</el-button>
            <el-button type="default" @click="prev" v-show="isShowPrev">上一步</el-button>
            <el-button type="primary" @click="next" v-show="isShowNext">下一步</el-button>
            <el-button type="primary" @click="submit" v-show="isShowSubmit">完成</el-button>
        </span>
        <!--</ifbp-main-area>-->
    </el-dialog>
</template>

<script>
    // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        props: {
            pk_org: String,
            pk_dept: String,
        },
        data() {
            var vm = this;
            return {
                //是否显示生成岗位窗口
                dialogVisible: false,
                //当前是第几步 1：第一步；2：第二步 3：第三步
                active: 1,
                //first
                isShowFirstTpl: true,
                //second
                isShowSecondTpl: false,
                // third
                isShowThirdTpl: false,

                isShowNext: true,//显示下一步按钮
                isShowPrev: false,//上一步
                isShowSubmit: false,//隐藏完成按钮

                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                //第一步的模板参数
                firstData: {
                    deptParams: {
                        pk_org: "",
                    },
                },
                firstResetFun: function ($node) {
                    //部门绑定change 事件
//                    let $pk_dept = $node.find("[prop='pk_dept']");
//                    $pk_dept.attr('v-on:trigger', 'changePk_dept');
                    var $pk_dept = $node.find("[v-model='poststd_first.pk_dept']");
                    $pk_dept.attr('v-on:trigger', 'changePk_dept');
                    return $node[0].outerHTML;
                },
                firstFormMethods: {
                    changePk_dept(val, data){
//                        vm.$refs.ref_jdb_c.getFormComp().clearErrorMessage();
                        if (data) {
                            //基准岗位NC不按部门过滤
                            let paramPk_dept = "";
                            if(data.value[0]){
                                paramPk_dept = data.value[0].id;
                            }
//                            vm.$refs.ref_poststd_dialog.setData('poststdParams', {
//                                pk_dept: paramPk_dept,isStd:true
//                            vm.$refs.ref_poststd_dialog.setData('poststdParams', {isStd:true});
                            vm.$refs.ref_poststd_dialog3.setData('postParams', {pk_dept:paramPk_dept});
                        }
                    }
                },
                afterCreateFunc: function ($node) {
                        if (vm.$refs.ref_poststd_dialog.comp.$refs.ref_deptpks) {
                            vm.$refs.ref_poststd_dialog.comp.$refs.ref_deptpks.setPKs(vm.pk_dept);
                        }

                        vm.$refs.ref_poststd_dialog.setData('deptParams', {
                            pk_org: vm.pk_org
                        });
                },

                //第二步的模板参数
                secondData: {
                    poststdParams: {
                        pk_dept: "",
                    },
                },
                secondResetFun: function ($node) {

                    return $node[0].outerHTML;
                },
                secondFormMethods: {},

                // 第三步的模板参数
                thirdData: {
                    postParams: {
                        pk_dept: "",
                    },
                },

                thirdResetFun: function ($node) {
                    var $postcode = $node.find("[prop='postcode']");
                    $postcode.attr('render-type', 'default');
                    $postcode.html(
                        '<template scope="scope" >' +
                        '<el-input _id="m7xlkufnf9" v-model="scope.row.postcode" :editable="editable"></el-input>' +
                        '</template>'
                    );

                    var $postcode = $node.find("[prop='postname']");
                    $postcode.attr('render-type', 'default');
                    $postcode.html(
                        '<template scope="scope" > ' +
                        '<el-input _id="e3jxd13h1vf" v-model="scope.row.postname" :editable="editable"></el-input>' +
                        '</template>'
                    );

                    var $postcode = $node.find("[prop='pk_postseries']");
                    $postcode.attr('render-type', 'default');
                    $postcode.html(
                        '<template scope="scope" > ' +
                        '<el-ref _id="7sr78ttjqqd" max="20" :editable="editable" v-model="scope.row.pk_postseries" field="pk_postseries" :template-value="scope.row" pk="d0a3192d-1493-4022-a400-2a202e9a6631" ref-code="postSeriesRef" :not-leaf-selectable="true"></el-ref>' +
                        '</template>'
                    );
                    var $postcode = $node.find("[prop='suporior']");
                    $postcode.attr('render-type', 'default');
                    $postcode.html(
                        '<template scope="scope" > ' +
                        '<el-ref _id="5zlvx03kwf4" max="20" :editable="editable" v-model="scope.row.suporior" field="suporior" :template-value="scope.row" :query-params="postParams" pk="d0a3192d-1493-4022-a400-2a202e9a6632" ref-code="postRef" :not-leaf-selectable="true"></el-ref>' +
                        '</template>'
                    );

                    return $node[0].outerHTML;
                },
                thirdMethods: {
                    clickChanged(val){
//                        this.moneyeditable = val.target.checked;
                    }
                }
            };
        },
        mounted() {

        },
        methods: {

            // 设置dialog是否可见
            setDialogVisible: function (flag, pk_org) {
                var vm = this;
                vm.dialogVisible = flag;
                vm.active = 1;
                vm.isShowNext = true;//隐藏下一步按钮
                vm.isShowPrev = false;//显示上一步按钮
                vm.isShowSubmit = false;//隐藏完成按钮

                vm.isShowFirstTpl = true; //是否显示第一个模板
                vm.isShowSecondTpl = false; //是否显示第二个模板
                vm.isShowThirdTpl = false; //是否显示第二个模板

                vm.$nextTick(function () {
                    if (vm.pk_dept && vm.$refs.ref_poststd_dialog.comp.$refs.ref_deptpks) {
                        vm.$refs.ref_poststd_dialog.comp.$refs.ref_deptpks.setPKs(vm.pk_dept);
                    }
                    vm.$refs.ref_poststd_dialog.setData('deptParams', {
                        pk_org: pk_org
                    });
                })

            },
            prev(){
                if (this.active === 3) {
                    this.active = 2;
                    this.isShowPrev = true;//显示上一步按钮
                    this.isShowNext = true;//隐藏下一步按钮
                    this.isShowSubmit = false;//显示完成按钮

                    this.isShowFirstTpl = false; //是否显示第一个模板
                    this.isShowSecondTpl = true; //是否显示第二个模板
                    this.isShowThirdTpl = false; //是否显示第三个模板
                } else if (this.active === 2) {
                    this.active = 1;
                    this.isShowSubmit = false;//显示完成按钮

                    this.isShowPrev = false;//显示上一步按钮
                    this.isShowNext = true;//隐藏下一步按钮
                    this.isShowFirstTpl = true; //是否显示第一个模板
                    this.isShowSecondTpl = false; //是否显示第二个模板
                    this.isShowThirdTpl = false; //是否显示第三个模板

                }

            },
            postStdFirstAction: function (vm) {
                vm.$refs.ref_poststd_dialog.validate((valid) => {
                    if (valid) {
                        let formData = vm.$refs.ref_poststd_dialog.getFormData();
                        vm.$http({
                            url: "/hrjf/post/findPostStdInfo/" + formData.pk_dept + "/" + formData.pk_poststd,
                            method: "get",
//                                data: JSON.parse(JSON.stringify(formData)),
//                                params: {"searchdto": sessionStorage.getItem("psndocwadocSearchDto")}
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    //表单校验通过后进行下一步操作，改变状态，以及显示完成按钮；隐藏下一步按钮
                                    vm.active = 2;
                                    vm.isShowNext = true//显示下一步按钮
                                    vm.isShowPrev = true;//显示上一步按钮
                                    vm.isShowSubmit = false;//显示完成按钮

                                    vm.isShowFirstTpl = false; //是否显示第一个模板
                                    vm.isShowSecondTpl = true; //是否显示第二个模板
                                    vm.isShowThirdTpl = false; //是否显示第三个模板
                                    vm.$nextTick(function () {
                                        vm.$refs.ref_poststd_dialog2.setTableData(res.data.data);
                                        vm.$refs.ref_poststd_dialog.setFormData(formData);

                                    })

                                } else {
                                    vm.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: "处理部门或基准岗位数据时出错！",
                                    type: "error"
                                });
                            });
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                });
            },
            next: function () {
                var vm = this;
                if (vm.active === 1) {
                    vm.postStdFirstAction(vm);

                } else if (vm.active === 2) {
//                    let selectedData = vm.$refs.ref_poststd_dialog2.comp.$refs.ref_poststd_second.getSelection();
                    let selectedData = vm.$refs.ref_poststd_dialog2.getTableComp().getSelection();
                    if (!selectedData || selectedData.length <= 0) {
                        this.$message({
                            message: "请选择需要生成的岗位！",
                            type: "warning"
                        });
                        return;
                    }
                    vm.active = 3;
                    vm.isShowNext = false;//显示上一步按钮
                    vm.isShowPrev = true;//隐藏下一步按钮
                    vm.isShowSubmit = true;//显示完成按钮


                    vm.isShowFirstTpl = false; //是否显示第一个模板
                    vm.isShowSecondTpl = false; //是否显示第二个模板
                    vm.isShowThirdTpl = true; //是否显示第三个模板
                    vm.$nextTick(function () {
                        vm.$refs.ref_poststd_dialog3.setTableData(selectedData);

                    })


                }

            },
            exit(){
                this.dialogVisible = false;
                this.active = 1;
                this.firstData.deptParams.pk_org = "";
//                if (this.$refs.ref_poststd_dialog) {
//                    this.$refs.ref_poststd_dialog.resetForm();
//                }
                this.$emit("refresh");
//                this.$context.getApp().back();
                // this.$router.push("/hrwa/psndocwadoc");
            },
            submit(){
                let tableData = this.$refs.ref_poststd_dialog3.getTableData();
                let data = {"tableData": tableData};
                this.$http({
                    url: "/hrjf/post/generatePost",
                    method: "post",
                    data: JSON.parse(JSON.stringify(data))
                })
                    .then((res) => {
                        this.$emit("refresh");
                        if (res.data.status === true) {
                            this.setDialogVisible(false);
                            this.$message({
                                message: res.data.msg,
                                type: "success"
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
                            message: "生成岗位失败",
                            type: "error"
                        });
                    });

            }
        }
    };
</script>
<style>
    /*必须写的样式样式*/
    .poststd_Spectrum {
        width: 100%;
        /*padding-top: 30px;*/
        background: #fff;
        text-align: center;

    }

    .ref_postd_dialog {
        width: 70%;
        margin-left: 120px;
        /*margin-left: 138px;*/
    }

    .poststdDialog .el-form-item {
        padding-left: 10px;
        width: 40% !important;
    }

    .poststdDialog .el-dialog__body {
        max-height: 270px;
    }

    .poststdDialog .el-dialog--large .el-dialog__body {
        max-height: 270px;
        /*initial | inherit | unset | revert*/
    }
</style>
