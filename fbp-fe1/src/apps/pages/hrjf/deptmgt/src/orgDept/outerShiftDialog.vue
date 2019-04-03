<!--
  作者：liyn11
  时间：2018-09-20
  支持：部门跨业务单元转移
-->
<template>
    <div>
        <!--转移规则设置弹窗-->
        <el-dialog :title="titleForOuter" :visible.sync="dialogVisible" size="large" :show-close="false" width="75%">
            <div class="roster_Setup">
                <el-steps :space="400" :active="active" finish-status="success" align-center="true" center="true">
                    <el-step title="设置部门转移规则"></el-step>
                    <el-step title="确认部门转移信息"></el-step>
                </el-steps>
            </div>

            <div style="height: 370px; margin-top: 40px;" v-show="isShowForm">
                <!--转移规则-->
                <ifbp-template ref="outerRef"
                               tpl-id="outerShift_dialog_id"
                               v-show="isShowForm"
                               @after-create="afterCreateOuterFunc"
                               :tpl-data="transData"
                               :tpl-reset-fun="tableFormResetFun"
                               :methods="childFormMethods">
                </ifbp-template>
            </div>
            <div style="height: 395px;" v-show="isShowDepts">
                <ifbp-template ref="outerDeptRef"
                               tpl-id="outerShift_depts_id"
                               v-show="isShowDepts"
                               :tpl-data="transDeptsData"
                               :tpl-reset-fun="tableFormDeptResetFun"
                               :methods="childFormDeptMethods"
                >
                </ifbp-template>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button v-show="!isShowDepts" @click="handleNext" type="primary">下一步</el-button>
         <el-button v-show="isShowDepts" @click="handleLast">上一步</el-button>
         <el-button v-show="isShowDepts" @click="handleFines" type="primary">完成</el-button>
      </span>
        </el-dialog>

        <!--部门详情弹窗-->
        <el-dialog title="查看部门详情" :visible.sync="deptDetailVisible" size="large" :show-close="false">
            <!--多页签-->
            <el-tabs v-model='deptDetailEvent' @tab-click="outerDeptHandleClick"
                     style="margin-left: -20px;margin-top:-5px">
                <el-tab-pane label="转移岗位" name="1" style="margin-top:-20px">
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_outer_dept_post"
                                   tpl-id="hrDeptOuterPost"
                                   :tpl-data="outerDeptPostData"
                                   :tplResetFun="outerDeptPostResetFun"
                                   :methods="outerDeptPostMethods"
                                   :confirm-clear-edit="false"
                    >
                    </ifbp-template>
                </el-tab-pane>
                <el-tab-pane label="转移人员" name="2" style="margin-top:-20px">
                    <!-- UI模板组件 -->
                    <ifbp-template ref="ref_outer_dept_psn"
                                   tpl-id="outerShiftPsns"
                                   :tpl-data="outerDeptPsnData"
                                   :tplResetFun="outerDeptPsnResetFun"
                                   :methods="outerDeptPsnMethods"
                                   :confirm-clear-edit="false"
                    >
                    </ifbp-template>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
        <el-button @click="postAndPsnHandleCancel">取消</el-button>
        <el-button @click="postAndPsnClick" type="primary">确定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {

        data() {
            const vm = this;
            return {
                isCreatedUi: false,
                selectedRows: [],
                pkDepts: '',  //待校验部门pk
                outerPostQueryParam: {
                    ruleVo: {},
                    deptVo: {},
                    deptTable: {},
                },
                //查询参数 ：  转移规则，部门信息，岗位信息
                outerDeptPsnsQueryParam: {
                    ruleVo: {},
                    deptVo: {},
                    postVoList: [],
                    generalVos: [],
                },
                doTransParam: {
                    ruleVo: {},
                    deptVo: {},
                    deptTables: [],
                    generalVos: []
                },
                savePostAndPsnParam: {
                    deptVo: {},  //deptTransDept
                    generalVos: [],  //psnDto
                    postVoList: [],
                    psnVoList: []

                },
                pk_dept: '',
                deptDetailEvent: '1', //标签页
                originalData: {},  //转移规则data
                originalDeptsData: [], //所有部门data
                originalDeptSelectedData: {}, //所选部门data
                newPostsTableData: [], //表格中修改后的岗位
                originalPsnsData: [],  //人员列表页数据
                newDeptTransDept: [],  //newDeptTransDept包括所选的所有部门，该部门已由用户修改，和部门下的所有岗位，岗位也修改
                newOriginalVo: [], // 人员信息，只要打开人员页面默认人员被修改，最后转移都要替换这些人员信息
                isShowDepts: false,
                isShowForm: true,
                active: 0,
                //导出框是否显示
                dialogVisible: false,
                deptDetailVisible: false,
                transData: {
                    //校验规则
                    rules: {
                        neworg: [
                            {
                                validator: (rule, value, callback) => {
                                    //转移组织不能一样
                                    var $oldorg = vm.$refs.outerRef.getData('outerShift').oldorg;
                                    var $neworg = vm.$refs.outerRef.getData('outerShift').neworg;
                                    if ($oldorg && $neworg && $oldorg == $neworg) {
                                        callback(new Error("转移组织不能一样"));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: "blur"
                            }
                        ]
                    },
                    deptOuterTrnsParam: {
                        trnsevent: "3"
                    },
                    paramsDepts4SelectedOrg: {
                        pk_org: ""
                    },
                    paramsAimDept4NewOrg: {
                        pk_org: ""
                    }
                },
                transDeptsData: {},
                outerDeptPostData: {},
                outerDeptPsnData: {},
                tableFormResetFun($node) {
                    //原业务单元控制部门
                    var $orgSelectChangeOld = $node.find("[v-model='outerShift.oldorg']");
                    $orgSelectChangeOld.attr('v-on:change', 'triggerHandleForDept');
                    //新业务单元控制上级部门
                    var $orgSelectChangeNew = $node.find("[v-model='outerShift.neworg']");
                    $orgSelectChangeNew.attr('v-on:change', 'triggerHandleForDept2');
                },
                tableFormDeptResetFun($node) {
                    let $table = this.getTableDom($node);
                    //得到列表单个属性控件
                    var $aimdeptcode = $node.find("[prop='aimdeptcode']");
                    //替换列表显示为switch开关控件
                    $aimdeptcode.attr('render-type', 'default');
                    $aimdeptcode.html(
                        '<template scope="scope" >' +
                        '<el-input _id="shgozvx2hgf" v-model="scope.row.aimdeptcode" :editable="editable"></el-input>' +
                        '</template>'
                    );

                    //得到列表单个属性控件
                    var $aimdeptname = $node.find("[prop='aimdeptname']");
                    //替换列表显示为switch开关控件
                    $aimdeptname.attr('render-type', 'default');
                    $aimdeptname.html(
                        '<template scope="scope" >' +
                        '<el-input _id="shgozvx2hgf" v-model="scope.row.aimdeptname" :editable="editable"></el-input>' +
                        '</template>'
                    );
                    var operateArr = [{
                        title: '部门详情',
                        icon: 'gavel',
                        click: 'zzClick(scope)',
                        vif: "true"
                    }];

                    var operateHtml = this.getTableOperateHtml(operateArr, 'right', 100, 'text');
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                outerDeptPostResetFun($node) {
                    let $tabledept = this.getTableDom($node);
                    $tabledept.attr(':height', '450'); //控制表格高度

                    var $postcode = $node.find("[prop='aimPostCode']");
                    $postcode.attr('render-type', 'default');
                    $postcode.html(
                        '<template scope="scope" >' +
                        '<el-input _id="shgozvx2hgf" v-model="scope.row.aimPostCode" :editable="editable"></el-input>' +
                        '</template>'
                    );

                    var $postname = $node.find("[prop='aimPostName']");
                    $postname.attr('render-type', 'default');
                    $postname.html(
                        '<template scope="scope" >' +
                        '<el-input _id="shgozvx2qtf" v-model="scope.row.aimPostName" :editable="editable"></el-input>' +
                        '</template>'
                    );

                    var $pk_postseries = $node.find("[prop='postseries']");
                    $pk_postseries.attr('render-type', 'default');
                    $pk_postseries.html(
                        '<template scope="scope" >' +
                        '<el-ref _id="qmhlzmiiek" max="20" :editable="editable" v-model="scope.row.postseries" field="postseries" :template-value="scope.row" pk="d0a3192d-1493-4022-a400-2a202e9a6636" ref-code="postSeriesRef" :not-leaf-selectable="true"></el-ref>' +
                        '</template>'
                    );
                    var $creationtime = $node.find("[prop='transdata']");
                    $creationtime.attr('render-type', 'default');
                    $creationtime.html(
                        '<template scope="scope" >' +
                        '<el-date-picker _id="so0vvv36do0l" type="date" :editable="editable" v-model="scope.row.transdata" :valuetoms="true"></el-date-picker>' +
                        '</template>'
                    );


                },
                outerDeptPsnResetFun($node) {
                    let $tablepsn = this.getTableDom($node);
                    $tablepsn.attr(':height', '450'); //控制表格高度

                    var $newpsncl = $node.find("[prop='newpsncl']");
                    $newpsncl.attr('render-type', 'default');
                    $newpsncl.html(
                        '<template scope="scope" >' +
                        '  <el-ref _id="06598lvkf3eg" max="20" :editable="editable" v-model="scope.row.newpsncl" field="newpsncl" :template-value="scope.row" pk="400f55be-f4cc-4b38-b1e2-aabdc75e2aad" ref-code="psnclref"></el-ref>' +
                        '</template>'
                    );


                },


                childFormMethods: {
                    triggerHandleForDept: function (type, data) {
                        var $oldorg = vm.$refs.outerRef.getData('outerShift').oldorg;
                        if ($oldorg) {
                            vm.$refs.outerRef.getData('outerShift').pk_depts = "";
                            vm.$refs.outerRef.setData('paramsDepts4SelectedOrg', {
                                pk_org: $oldorg
                            });
                        }
                    },

                    triggerHandleForDept2: function (type, data) {
                        var $neworg = vm.$refs.outerRef.getData('outerShift').neworg;
                        if ($neworg) {
                            vm.$refs.outerRef.getData('outerShift').aimdept = "";
                            vm.$refs.outerRef.setData('paramsAimDept4NewOrg', {
                                pk_org: $neworg
                            });
                        }
                    }
                },
                childFormDeptMethods: {
                    zzClick(scope) {
                        vm.postAndPsnQueryClick(scope);
                    }
                },
                outerDeptPostMethods: {},
                outerDeptPsnMethods: {},

            }
        },
        mounted() {
        },
        computed: {
            titleForOuter: function () {
                return "跨组织转移 (包含下级部门)";
            }
        },
        methods: {
            initOuterShift: function () {
                this.$refs.outerRef.setData('deptOuterTrnsParam', {trnsevent: "3"});
            },
            //取消
            handleCancel: function () {
                this.dialogVisible = false;
                this.active = 0;
                this.isShowForm = true;
                this.isShowDepts = false;
                this.$refs.outerRef.resetFormData();
                this.selectedRows = [];
                this.$emit('outerRequest');
            },
            postAndPsnHandleCancel: function () {
                this.deptDetailVisible = false;
                this.dialogVisible = true;
                this.deptDetailEvent = '1';
            },
            postAndPsnClick: function () {
                this.originalPsnsData = this.$refs.ref_outer_dept_psn.getData('hi_psnjob_outer_t');
                this.newPostsTableData = this.$refs.ref_outer_dept_post.getData('om_post_outer_t');
                //点击完成按钮，需要更新deptTransDept和GeneralVo
                this.changeSaveDeptTransDeptAndGeneralVo();
                this.deptDetailVisible = false;
                this.dialogVisible = true;
                this.deptDetailEvent = '1';
            },
            //每次点击详情页面完成按钮都需要更新下deptTransDept和GenearlVo   使得修改岗位和人员生效
            changeSaveDeptTransDeptAndGeneralVo() {
                let url;
                url = '/hrjf/hrDept/savePostAndPsn';
                if (this.newDeptTransDept) {
                    this.savePostAndPsnParam.deptVo = this.newDeptTransDept;
                } else {
                    this.savePostAndPsnParam.deptVo = [];
                }
                if (this.newOriginalVo) {
                    this.savePostAndPsnParam.generalVos = this.newOriginalVo;
                } else {
                    this.savePostAndPsnParam.generalVos = [];
                }

                if (this.newPostsTableData) {
                    this.savePostAndPsnParam.postVoList = this.newPostsTableData;
                } else {
                    this.savePostAndPsnParam.postVoList = [];
                }

                if (this.originalPsnsData) {
                    this.savePostAndPsnParam.psnVoList = this.originalPsnsData;
                } else {
                    this.savePostAndPsnParam.psnVoList = [];
                }


                let data = JSON.parse(JSON.stringify(this.savePostAndPsnParam));
                let param = {
                    pkDepts: this.pkDepts,
                    pkSelectedDept: this.pk_dept
                };
                this.$http({
                    url: url,
                    method: 'post',
                    data: data,
                    params: param
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.newDeptTransDept = res.data.data.deptTransDept;
                            this.newOriginalVo = res.data.data.generalVos;
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "保存失败",
                            type: "error"
                        });
                    });

            },
            handleNext: function () {
                this.$refs.outerRef.validate((valid) => {
                    if (valid) {
                        let omData = this.$refs.outerRef.getData('outerShift');
                        this.originalData = omData;
                        this.$http({
                            url: '/hrjf/hrDept/validateOuterDept',
                            method: 'post',
                            traditional: true,
                            data: JSON.parse(JSON.stringify(omData))
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$refs.outerRef.clearEdit();
                                    if (!res.data.data.validateFlag) {
                                        this.$message({
                                            message: res.data.data.resMsg,
                                            type: 'warning'
                                        });
                                    } else {
                                        this.isShowDepts = true;
                                        this.isShowForm = false;
                                        this.$refs.outerDeptRef.setData(
                                            'hrDeptOrter',
                                            res.data.data.content
                                        );
                                        this.pkDepts = res.data.data.pkDepts;
                                        if (this.active++ > 2) this.active = 0;


                                    }
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((e) => {
                                this.$message({
                                    message: '请求失败' + e,
                                    type: 'error'
                                });
                            });
                    }
                });
            },
            handleLast: function () {
                if (this.active-- > 2) this.active = 0;
                this.isShowDepts = false;
                this.isShowForm = true;
                this.$refs.outerRef.setData('outerShift', this.originalData);
            },
            handleFines: function () {
                let omDeptData = this.$refs.outerDeptRef.getData('hrDeptOrter');
                this.originalDeptsData = omDeptData;

                let url;
                url = '/hrjf/hrDept/doTransDept';
                this.doTransParam.ruleVo = this.originalData;
                this.doTransParam.deptTables = this.originalDeptsData;
                this.doTransParam.deptVo = this.newDeptTransDept;
                this.doTransParam.generalVos = this.newOriginalVo;

                let data = JSON.parse(JSON.stringify(this.doTransParam));
                let param = {
                    pkDepts: this.pkDepts
                };
                this.$http({
                    url: url,
                    method: 'post',
                    data: data,
                    params: param
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.isShowDepts = false;
                            this.isShowForm = true;
                            this.dialogVisible = false;
                            this.active = 0;
                            this.newDeptTransDept = [];
                            this.newOriginalVo = [];
                            this.$refs.outerRef.resetFormData();
                            this.$emit('outerRequest');
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }

                    })
                    .catch(() => {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    });


            },
            initForm: function () {
                if (this.isCreatedUi) {
                    this.setOuterForm();
                    this.initOuterShift();
                }
            },
            //表单赋值
            setOuterForm: function () {
                var tableSelections = this.selectedRows;
                if (tableSelections && tableSelections.length > 0) {
                    var oldOrgPk = tableSelections[0].pk_org;
                    if (oldOrgPk && this.$refs.outerRef && this.$refs.outerRef.comp.$refs.ref_oldOrgParam) {
                        this.$refs.outerRef.comp.$refs.ref_oldOrgParam.setPKs(oldOrgPk);
                        //过滤待转移部门
                        this.$refs.outerRef.setData('paramsDepts4SelectedOrg', {
                            pk_org: oldOrgPk
                        });
                    }
                    var deptStr = "";
                    var i = 0, len = tableSelections.length;
                    for (; i < len; i++) {
                        if (!tableSelections[i].hrcanceled) {
                            deptStr += "," + tableSelections[i].pk_dept;
                        }
                    }
                    deptStr = deptStr.substring(1);
                    if (this.$refs.outerRef && this.$refs.outerRef.comp.$refs.ref_deptsRefParam) {
                        this.$refs.outerRef.comp.$refs.ref_deptsRefParam.setPKs(deptStr);
                    }
                }
            },
            afterCreateOuterFunc: function () {
                this.isCreatedUi = true;
                this.setOuterForm();
                this.initOuterShift();
            },
            // 设置dialog是否可见
            setDialogVisible: function (flag, rows) {
                if (flag) {
                    this.dialogVisible = true;
                    this.selectedRows = rows;
                    this.initForm();
                }
            },
            postAndPsnQueryClick(scope) {
                this.pk_dept = scope.row.olddeptpk;
                this.originalDeptSelectedData = scope.row;
                let omDeptData = this.$refs.outerDeptRef.getData('hrDeptOrter');
                this.originalDeptsData = omDeptData;
                this.deptDetailVisible = true;
                this.dialogVisible = false;
                this.deptPostPsnRequest(scope);
            },
            // 请求部门下所有岗位
            deptPostPsnRequest(scope) {
                let url;
                url = '/hrjf/hrDept/getPostsById';
                let aimdeptname = scope.row.aimdeptname;
                if (!this.pk_dept) {
                    return;
                }
                this.outerPostQueryParam.deptVo = this.newDeptTransDept;
                this.outerPostQueryParam.ruleVo = this.originalData;
                this.outerPostQueryParam.deptTable = this.originalDeptsData
                let param = {
                    pk_dept: this.pk_dept,
                    pkDepts: this.pkDepts,
                    aimdeptname: aimdeptname
                };
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "JSON",
                    data: this.outerPostQueryParam,
                    params: param,
                    contentType: "application/json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.newDeptTransDept = res.data.data.deptTransDept;
                            this.$refs.ref_outer_dept_post.setData('om_post_outer_t', res.data.data.content);
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败" + e,
                            type: "error"
                        });
                    });
            },

            //页签切换
            outerDeptHandleClick: function (tab) {
                this.newPostsTableData = this.$refs.ref_outer_dept_post.getData('om_post_outer_t');
                this.deptDetailEvent = tab.name;
                this.titleName = tab.label;
                if (this.deptDetailEvent === '1') {
                    this.$refs.ref_outer_dept_post.setData('om_post_outer_t', this.newPostsTableData);
                } else {
                    //切换标签时校验岗位,请求该部门下人员
                    this.queryPsnsRequest();
                }
            },
            queryPsnsRequest() {
                //请求该部门下人员
                let url;
                url = '/hrjf/hrDept/getPsnsList';
                this.outerDeptPsnsQueryParam.ruleVo = this.originalData;
                this.outerDeptPsnsQueryParam.deptVo = this.newDeptTransDept;
                if (this.newPostsTableData) {
                    this.outerDeptPsnsQueryParam.postVoList = this.newPostsTableData; //切标签前修改的岗位，后台整合到deptTransDept
                } else {
                    this.outerDeptPsnsQueryParam.postVoList = [];
                }
                this.outerDeptPsnsQueryParam.generalVos = this.newOriginalVo;
                let data = JSON.parse(JSON.stringify(this.outerDeptPsnsQueryParam));
                let param = {
                    pkDepts: this.pkDepts,
                    pkSelectedDept: this.pk_dept
                };
                this.$http({
                    url: url,
                    method: 'post',
                    data: data,
                    params: param
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.newDeptTransDept = res.data.data.deptTransDept;
                            this.$refs.ref_outer_dept_psn.setData('hi_psnjob_outer_t', res.data.data.content);
                            this.newOriginalVo = res.data.data.generalVos;
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败" + e,
                            type: "error"
                        });
                    });

            },
        }
    }
</script>
<style>
    /*.el-dialog__body{*/
    /*height: 448px;*/
    /*}*/
</style>
