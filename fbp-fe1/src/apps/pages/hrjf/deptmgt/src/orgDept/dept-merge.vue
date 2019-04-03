<template>
    <el-dialog title="部门合并" class="deptMergeDialog" :visible.sync="dialogVisible" size="large" width="90%" height="100%"
               :show-close="false">
        <!-- 主体区域 -->
        <!--<ifbp-main-area type="detail">-->
        <div class="deptMerge_Spectrum">
            <el-steps :space="200" :active="active" finish-status="success">
                <el-step title="部门选择"></el-step>
                <el-step title="岗位合并"></el-step>
                <el-step title="人员合并"></el-step>
            </el-steps>
        </div>
        <div class="ref_deptMerge_dialog">
            <ifbp-template ref="ref_selectDept_dialog"
                           tpl-id="selectDeptTpl"
                           v-show="isShowFirstTpl"
                           :editable="editable"
                           :tpl-data="firstData"
                           :methods="firstFormMethods"
                           :tpl-reset-fun="firstResetFun"
                           @after-create="afterCreateFunc"
            >
            </ifbp-template>
        </div>
        <div id="dept_merge" v-show="isShowSecondTpl">
            <el-row>
                <el-col :span="11" class="left_area">
                    <div class="sub_title">被合并部门岗位</div>
                    <el-table :adaptive-mobile="false" max-height="300" :inline="true"
                              :data="leftDataVO"
                              isExpandTable="true" ref="ref_leftData_l"
                              @selection-change="handleSelectionChange">

                        <el-table-column type="selection" width="50" prop="selstatus" :sortable="false" align="left"
                                         header-align="left">
                            <!--<template scope="scope">-->
                            <!--<el-checkbox class="check_box" v-model="scope.row.selstatus"  ></el-checkbox>-->
                            <!--</template>-->
                        </el-table-column>
                        <el-table-column render-type="default" separator="," :multiply="false" symbol="￥"
                                         align="left"
                                         header-align="left" prop="postcode" label="岗位编码"
                                         width="150" format=""
                                         :sortable="false">
                        </el-table-column>
                        <el-table-column render-type="default" separator="," :multiply="false" symbol="￥"
                                         align="left"
                                         header-align="left" prop="postname" label="岗位名称"
                                         width="150" format=""
                                         :sortable="false">
                        </el-table-column>
                        <el-table-column render-type="default" separator="," :multiply="false" symbol="￥"
                                         align="left"
                                         header-align="left" prop="deptname" label="部门名称"
                                         width="150" format=""
                                         :sortable="false">

                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="2" class="swap_area"><i class="ifbp-icon-swap-horiz swap_icon"></i></el-col>
                <el-col :span="11" class="right_area">
                    <div class="sub_title">
                        <span>接收部门岗位</span>
                        <!--<span class="del_link">单击移除</span>-->
                    </div>
                    <el-table :adaptive-mobile="false" max-height="300" :inline="true"
                              :data="rightDataVO"
                              isExpandTable="true" ref="ref_rightData_l"
                    >
                        <!--<el-table-column type="selection" width="50" :sortable="false" align="left"-->
                        <!--header-align="left"></el-table-column>-->
                        <el-table-column render-type="default" separator="," :multiply="false" symbol="￥"
                                         align="left"
                                         header-align="left" prop="postcode" label="岗位编码"
                                         width="150" format=""
                                         :sortable="false">
                            <template scope="scope">
                                <el-input _id="m7xlkufnf9" v-model="scope.row.postcode" :editable="editable"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column render-type="default" separator="," :multiply="false" symbol="￥"
                                         align="left"
                                         header-align="left" prop="postname" label="岗位名称"
                                         width="150" format=""
                                         :sortable="false">
                            <template scope="scope">
                                <el-input _id="m7xlkufnf9" v-model="scope.row.postname" :editable="editable"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column render-type="default" separator="," :multiply="false" symbol="￥"
                                         align="left"
                                         header-align="left" prop="deptname" label="部门名称"
                                         width="150" format=""
                                         :sortable="false">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>

        <ifbp-template ref="ref_psnPost_dialog3"
                       tpl-id="psnPostTpl"
                       :editable="editable"
                       v-if="isShowThirdTpl"
                       :tpl-data="thirdData"
                       :methods="thirdMethods"
                       :tpl-reset-fun="thirdResetFun"
                       @after-create="thirdAfterCreateFunc"
        >
        </ifbp-template>
        <span slot="footer" class="dialog-footer">
            <el-button @click="exit">取消</el-button>
            <el-button type="default" @click="prev" v-show="isShowPrev">上一步</el-button>
            <el-button type="primary" @click="next" v-show="isShowNext">下一步</el-button>
            <el-button type="primary" @click="submit" v-show="isShowSubmit">完成</el-button>
        </span>
        <!--</ifbp-main-area>-->

        <el-dialog title="版本控制确认提示框" append-to-body :visible.sync="versionDialogVisible" size="tiny" width="90%"
                   height="100%" :show-close="false">

            <ifbp-template ref="ref_deptVersion"
                           tpl-id="deptVersionTPL"
                           :editable="editable"
                           v-show="isShowDeptVersion"
                           :tpl-data="deptVersionData"
                           :methods="deptVersionMethods"
                           :tpl-reset-fun="deptVersionResetFun"
                           @after-create="afterMergeFunc"
            >
            </ifbp-template>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancelDeptVersion">取消</el-button>
            <el-button type="primary" @click="executeDeptVersion">确定</el-button>
        </span>
        </el-dialog>
    </el-dialog>

</template>

<script>
    // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        props: {
            pk_org: String,
        },
        data() {
            var vm = this;
            return {
                //合并后的部门数据
                mergeRelateVOs: [],
                editable: true,
                pk_dept: "",
                pk_vid_ref: {},
                leftDataVO: [],
                rightDataVO: [],
                baseDataVO: [],
                //是否显示生成岗位窗口
                dialogVisible: false,
                versionDialogVisible: false,
                //界面选择的行
                selectRows: [],
                //当前是第几步 1：第一步；2：第二步 3：第三步
                active: 1,
                //first
                isShowFirstTpl: true,
                //second
                isShowSecondTpl: false,
                // third
                isShowThirdTpl: false,
                //isShowDeptVersion
                isShowDeptVersion: true,

                isShowNext: true,//显示下一步按钮
                isShowPrev: false,//上一步
                isShowSubmit: false,//隐藏完成按钮

                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                dialogFormVisible: false,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px',

                //第一步的模板参数
                firstData: {
                    deptParams: {
                        pk_org: "",
                    },
                },
                firstResetFun: function ($node) {
                    //部门绑定change 事件
                    var $pk_dept = $node.find("[v-model='deptmerge.recdeptpk']");
                    $pk_dept.attr('v-on:trigger', 'changePk_dept');
//                    var $mergedeptpks = $node.find("[v-model='deptmerge.mergedeptpks']");
//                    $mergedeptpks.attr('render-type', 'default');
//                    $mergedeptpks.html(
//                        '<template scope="scope" > ' +
//                        '<el-ref _id="j8mzbd333ee" max="20" :editable="editable" ref="mergedeptpksRef"  v-model="scope.row.mergedeptpks" field="mergedeptpks" :template-value="scope.row" pk="d0a3192d-1493-4022-a400-2a202e9a6456" ref-code="hrwebdeptref" :not-leaf-selectable="true"></el-ref>' +
//                        '</template>'
//                    );
                    return $node[0].outerHTML;
                },

                afterCreateFunc: function ($node) {
                    if (vm.selectRows) {
                        if (vm.$refs.ref_selectDept_dialog.comp.$refs.ref_mergedeptpks) {
                            vm.$refs.ref_selectDept_dialog.comp.$refs.ref_mergedeptpks.setPKs(vm.pk_dept);
                        }

                        vm.$refs.ref_selectDept_dialog.setData('deptParams', {
                            pk_org: vm.pk_org
                        });
                    }
                },
                afterMergeFunc: function ($node) {
                    vm.$refs.ref_deptVersion.getData('hrdept_v').vno = vm.mergeRelateVOs[0].vno;
                    vm.$refs.ref_deptVersion.getData('hrdept_v').vstartdate = vm.mergeRelateVOs[0].vstartdate;
                    vm.$refs.ref_deptVersion.getData('hrdept_v').creationtime = vm.mergeRelateVOs[0].creationtime;
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
                    takeOverDeptParams: {
                        "pk_dept": "",
                        "hrcanceled": "ALL",
                    },
                },
                // 用于放到thirdData.takeOverDeptParams.pk_dept中的临时变量，因为dialog初始化时会置空takeOverDeptParams值
                takeOverPk_dept: "",
                firstFormMethods: {
                    changePk_dept(val, data){
                        if (data && data.value[0]) {
                            var takeOverDeptParams = {
                                "pk_dept": data.value[0].id,
                                "hrcanceled": "ALL",
                            };
                            vm.takeOverPk_dept = takeOverDeptParams;
                            vm.thirdData.takeOverDeptParams = vm.takeOverPk_dept;
                        }
                    }
                },
                thirdResetFun: function ($node) {
                    var $postcode = $node.find("[prop='pk_newpost']");
                    $postcode.attr('render-type', 'default');
                    $postcode.html(
                        '<template scope="scope" > ' +
                        '<el-ref _id="j8mzbd333en" max="20" :editable="editable"  :query-params="takeOverDeptParams" v-model="scope.row.pk_newpost" field="pk_newpost" :template-value="scope.row"  pk="039385a6-3e60-489c-b257-f48a1b7ab046"  ref-code="postRef"  :not-leaf-selectable="true"></el-ref>' +
                        '</template>'
                    );

                    return $node[0].outerHTML;
                },
                thirdAfterCreateFunc: function ($node) {
                    vm.thirdData.takeOverDeptParams = vm.takeOverPk_dept;
                },
                thirdMethods: {
                    clickChanged(val){
//                        this.moneyeditable = val.target.checked;
                    }
                },
                // 第三步的模板参数
                deptVersionData: {},
                deptVersionResetFun: function ($node) {

                    return $node[0].outerHTML;
                },
                deptVersionMethods: {}
            };
        },
        mounted() {

        },
        methods: {
            handleSelectionChange(param){
                var leftData = JSON.parse(JSON.stringify(this.$refs.ref_leftData_l.tableData));
                var param1 = JSON.parse(JSON.stringify(param));
                if (!param1 || param1.length <= 0) {
                    this.rightDataVO = JSON.parse(JSON.stringify(this.baseDataVO));
                } else {
                    for (var m = 0; m < this.rightDataVO.length; m++) {
                        for (var n = 0; n < leftData.length; n++) {
                            if (this.rightDataVO[m] && leftData[n] && this.rightDataVO[m].pk_post === leftData[n].pk_post) {
                                this.rightDataVO.splice(m, 1);
                                leftData[n].selstatus = false;
                            }
                        }
                    }
                    for (var i = 0; i < param1.length; i++) {
                        this.rightDataVO.push(param1[i]);
                        param1[i].selstatus = true;
                    }
                }
            },
            rightTableRowClick(param1, param2, param3) {
//                console.log(param1, param2, param3);
            },

            // 设置dialog是否可见
            setDialogVisible: function (flag, pk_org, selectRows) {
                var vm = this;
                vm.dialogVisible = flag;
                vm.selectRows = selectRows;
                vm.active = 1;
                vm.isShowNext = true;//隐藏下一步按钮
                vm.isShowPrev = false;//显示上一步按钮
                vm.isShowSubmit = false;//隐藏完成按钮

                vm.isShowFirstTpl = true; //是否显示第一个模板
                vm.isShowSecondTpl = false; //是否显示第二个模板
                vm.isShowThirdTpl = false; //是否显示第二个模板

                if (vm.selectRows) {
                    var pk_vids = [];
                    for (var i = 0; i < vm.selectRows.length; i++) {
                        if(!vm.selectRows[i].hrcanceled){
                            pk_vids.push(vm.selectRows[i].pk_dept);
                        }
                    }
                    vm.pk_dept = pk_vids.toString();
                    if (vm.$refs.ref_selectDept_dialog && vm.$refs.ref_selectDept_dialog.comp.$refs.ref_mergedeptpks) {
                        vm.$refs.ref_selectDept_dialog.comp.$refs.ref_mergedeptpks.setPKs(vm.pk_dept);
                    }
                }
                vm.$nextTick(function () {
                    if (vm.$refs.ref_selectDept_dialog) {
                        vm.$refs.ref_selectDept_dialog.setData('deptParams', {
                            pk_org: pk_org
                        });
                    }
                })
            },
            prev(){
                if (this.active === 3) {
                    this.$http({
                        url: "/hrjf/hrDept/merge/cancelAction",
                        method: "post",
                        data: {}
                    }).then((res) => {
                        if (res.data.status === true) {
                            this.active = 2;
                            this.isShowPrev = true;//显示上一步按钮
                            this.isShowNext = true;//隐藏下一步按钮
                            this.isShowSubmit = false;//显示完成按钮

                            this.isShowFirstTpl = false; //是否显示第一个模板
                            this.isShowSecondTpl = true; //是否显示第二个模板
                            this.isShowThirdTpl = false; //是否显示第三个模板
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            message: "岗位数据回退处理失败",
                            type: "error"
                        });
                    });
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
            deptSelectedAction: function (vm) {
                vm.$refs.ref_selectDept_dialog.validate((valid) => {
                    if (valid) {
                        let formData = vm.$refs.ref_selectDept_dialog.getFormData();
                        var mergedpks;
                        var takeOverInnerCode;
                        var takeOverCreateDate;
                        var takeOverDeptName;
                        var takeOverDeptCode;
                        var takeOverPkOrg;
                        mergedpks = formData.mergedeptpks.split(",");
                        if (formData.beanMap.recdeptpk_ref[formData.recdeptpk]) {
                            takeOverInnerCode = (formData.beanMap.recdeptpk_ref[formData.recdeptpk].innercode);
                            takeOverCreateDate = (formData.beanMap.recdeptpk_ref[formData.recdeptpk].createdate);
                            takeOverDeptName = (formData.beanMap.recdeptpk_ref[formData.recdeptpk].refname);
                            takeOverDeptCode = (formData.beanMap.recdeptpk_ref[formData.recdeptpk].refcode);
                            takeOverPkOrg = (formData.beanMap.recdeptpk_ref[formData.recdeptpk].pk_org);
                        }
                        var deptJson = {
                            mergedDeptPKs: mergedpks,
                            takeOverDeptPK: formData.recdeptpk,
                            approvenum: formData.approvenum,
                            approvedept: formData.approvedept,
                            effectdate: formData.effectdate,
                            updateCareer: formData.updateCareer === "true" ? true : false,
                            memo: formData.memo,

                            takeOverInnerCode: takeOverInnerCode,
                            takeOverDeptName: takeOverDeptName,
                            takeOverCreateDate: takeOverCreateDate,
                            takeOverDeptCode: takeOverDeptCode,
                            takeOverPkOrg: takeOverPkOrg
                        }
                        vm.$http({
                            url: "/hrjf/hrDept/merge/qryPostByDept",
                            method: "post",
                            data: deptJson,
                            param: deptJson,
                            dataType: "json",
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
                                        vm.leftDataVO = res.data.data.leftData;
                                        vm.rightDataVO = res.data.data.rightData;
                                        vm.baseDataVO = JSON.parse(JSON.stringify(res.data.data.rightData));
                                        vm.$refs.ref_selectDept_dialog.setFormData(formData);
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
                                    message: "查询部门岗位出错！",
                                    type: "error"
                                });
                            });
                    } else {
                        return false
                    }
                });
            },
            postTransferNextAction: function (vm) {
                var deptJson = {pk_posts: vm.rightDataVO};
                vm.$http({
                    url: "/hrjf/hrDept/merge/checkSaveAdjustedPost",
                    method: "post",
                    data: deptJson,
                    param: deptJson,
                    dataType: "json",
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            //表单校验通过后进行下一步操作，改变状态，以及显示完成按钮；隐藏下一步按钮
                            vm.active = 3;
                            vm.isShowNext = false;//显示上一步按钮
                            vm.isShowPrev = true;//隐藏下一步按钮
                            vm.isShowSubmit = true;//显示完成按钮
                            vm.isShowFirstTpl = false; //是否显示第一个模板
                            vm.isShowSecondTpl = false; //是否显示第二个模板
                            vm.isShowThirdTpl = true; //是否显示第三个模板
                            vm.$nextTick(function () {
                                vm.$refs.ref_psnPost_dialog3.setTableData(res.data.data);
                                vm.thirdData.takeOverDeptParams = vm.takeOverPk_dept;

                            })
                        } else {
                            vm.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        vm.$message({
                            message: "处理岗位合并出错！",
                            type: "error"
                        });
                    });
            },

            next: function () {
                var vm = this;
                if (vm.active === 1) {
                    vm.deptSelectedAction(vm);

                } else if (vm.active === 2) {
                    vm.postTransferNextAction(vm);
                }
            },
            exit(){
                if (this.active === 3) {
                    this.$http({
                        url: "/hrjf/hrDept/merge/cancelAction",
                        method: "post",
                        data: {}
                    }).then((res) => {
                        if (res.data.status === true) {
                            // 退出时清空接收部门，防止新岗位选择时部门不更换
                            this.takeOverPk_dept = '';
                            this.setDialogVisible(false);

                            if (this.$refs.ref_selectDept_dialog) {
                                this.$refs.ref_selectDept_dialog.resetFormData();
                            }
                            this.selectRows = [];
                            this.$emit('refreshTable');
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            message: "失败",
                            type: "error"
                        });
                    });
                } else {
                    // 退出时清空接收部门，防止新岗位选择时部门不更换
                    this.takeOverPk_dept = '';
                    this.setDialogVisible(false);
                    if (this.$refs.ref_selectDept_dialog) {
                        this.$refs.ref_selectDept_dialog.resetFormData();
                    }
                    this.selectRows = [];
                    this.$emit('refreshTable');
                }
            },

            submit(){
                let tableData = this.$refs.ref_psnPost_dialog3.getTableData();
                let data = {"pk_org": this.pk_org, "personAdjustVOs": tableData};
                this.$http({
                    url: "/hrjf/hrDept/merge/merge",
                    method: "post",
                    data: JSON.parse(JSON.stringify(data))
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.mergeRelateVOs = res.data.data;
                            this.confirmDeptVersion();

                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "部门合并失败！",
                            type: "error"
                        });
                    });
            },
            confirmDeptVersion() {
                this.$confirm('名称合并成功，是否同时执行部门版本化？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.versionDialogVisible = true;
                    if (this.$refs.ref_deptVersion) {
                        this.$refs.ref_deptVersion.getData('hrdept_v').vno = this.mergeRelateVOs[0].vno;
                        this.$refs.ref_deptVersion.getData('hrdept_v').vstartdate = this.mergeRelateVOs[0].vstartdate;
                        this.$refs.ref_deptVersion.getData('hrdept_v').creationtime = this.mergeRelateVOs[0].creationtime;
                    }
                }).catch(() => {
                    // 退出时清空接收部门，防止新岗位选择时部门不更换
                    this.takeOverPk_dept = '';
                    this.$emit('refreshTable');
                    this.setDialogVisible(false);
                });
            },
            executeDeptVersion(){
                var _data = {
                    mergeRelateVOs: JSON.parse(JSON.stringify(this.mergeRelateVOs))
                }
                this.$http({
                    url: "/hrjf/hrDept/merge/deptVersion",
                    method: "post",
                    data: _data,
                    params: {vName: this.$refs.ref_deptVersion.getData('hrdept_v').vname}
                }).then((res) => {
                    this.$emit('refreshTable');
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        // 退出时清空接收部门，防止新岗位选择时部门不更换
                        this.takeOverPk_dept = '';
                        this.versionDialogVisible = false;
                        this.setDialogVisible(false);
                        // 退出时清空接收部门，防止新岗位选择时部门不更换
                        this.takeOverPk_dept = '';
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "部门版本化失败！",
                            type: "error"
                        });
                    });
            },
            cancelDeptVersion(){
                this.versionDialogVisible = false;
                // 退出时清空接收部门，防止新岗位选择时部门不更换
                this.takeOverPk_dept = '';
                this.setDialogVisible(false);

            }

        }
    };
</script>
<style>
    .deptMergeDialog .el-dialog__body {
        max-height: 270px;
    }

    .deptMergeDialog .el-dialog--large .el-dialog__body {
        max-height: 270px;
        /*initial | inherit | unset | revert*/
    }

    /*必须写的样式样式*/
    .deptMerge_Spectrum {
        width: 100%;
        /*padding-top: 30px;*/
        background: #fff;
        text-align: center;

    }

    .deptMergeDialog .el-form-item {
        padding-left: 10px;
        width: 40% !important;
    }

    .ref_deptMerge_dialog {
        padding: 0px;
        text-align: left;
        margin-left: 10%;
        width: 70% !important;
    }

    .deptMergeDialog .transfer-footer {
        margin-left: 20px;
        padding: 6px 5px;
        width: 40% !important;

    }

    #dept_merge {
        position: relative;
        background-color: #fff;
        margin: 0;
        padding: 0px;
        border-top: 0px;
        padding-left: 0px;
        border-left-width: 0px;

    }

    #dept_merge .sub_title {
        position: relative;
        width: 100%;
        color: #333333;
        font-weight: bold;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 16px;
        margin-bottom: 10px;
    }

    #dept_merge .del_link {
        color: #999999;
        float: right;
    }

    #dept_merge .swap_area {
        text-align: center;
        padding-top: 100px;
    }

    #dept_merge .swap_icon {
        font-size: 50px;
        color: #B0B8BE;
    }
</style>
