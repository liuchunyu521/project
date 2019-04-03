<template>
    <div v-if="true">

        <!-- 主体区域 -->
        <ifbp-template :ref='templateMainRef'
                       tplId='org_orgs_template'
                       :tplData='templateMainData'
                       :editable='orgsMainEdit'
                       :form-show-message='orgsMainEdit'
                       :methods="templateMainMethods"
                       :tpl-reset-fun='templateMainResetFun'
                       @after-create="mainAfterCreate"
        >
        </ifbp-template>
        <div class='form-button-div' v-if='orgsMainEdit'>
            <el-button type='primary' @click='beforeSave'>保存</el-button>
            <el-button type='default' @click='orgsCancel'>取消</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            routePk_org: {
                type: String,
                required: true
            },
            templateMainRef: {
                type: String,
                required: true
            },
            permissionPrefix: {
                type: String,
                required: true
            },
            dynOrgMainUrl: {
                type: String,
                required: true
            },
            orgsMainEdit: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
        },
        data() {
            const orgsDetailThis = this;
            return {
                originalMainValue: {},
                // 主表模板需要参数
                templateMainData: {
                    preBillcode: "",
                    isEdit4Billcode: true,
                    paramsPkOrg: {
                        pk_org: ""
                    },
                    rules: {
                        tel: [{
                            required: true,
                            trigger: "blur",
                            validator(rule, value, callback) {
                                var errors = []
                                if (value && /[A-Za-z]+/.test(value)) {
                                    callback('不能输入英文字母！');
                                }
                                if (value && !/^[0-9]*[-]?[0-9]*$/.test(value)) {
                                    callback('格式应为：区号-话机号或者手机号！');
                                }
//                                if (value && !/^[0-9]*[-][0-9]*$/.test(value) && value.length !== 11 ) {
//                                    callback('手机号应为11位！');
//                                }
                                callback(errors);
                            }
                        }],
                    }
                },
                templateMainResetFun: function ($node) {
                    if (orgsDetailThis.templateMainData && orgsDetailThis.templateMainData.paramsPkOrg && orgsDetailThis.pk_org) {
                        orgsDetailThis.templateMainData.paramsPkOrg.pk_org = orgsDetailThis.routePk_org;
                    }
                    $node.find("[v-model='hrorginfo.code']").attr(":disabled", "isEdit4Billcode");
                    // 给是否法人组织添加绑定
//                    $node.find("[v-model='hrorginfo.orgtype2']").attr("v-on:change", "orgtype2Change");
//                    $node.find("[prop='legalbodycode']").html('<el-input id="legalbodycode" :editable="editable" v-model="hrorginfo.legalbodycode" :disabled="!hrorginfo.orgtype2"></el-input>');
                    return $node[0].outerHTML;
                },
                templateMainMethods: {
                    orgtype2Change: function (val) {
                        if (!val) {
                            this.hrorginfo.legalbodycode = null;
                        }
                    }
                },

            };
        },
        computed: {},
        mounted()
        {
            this.orgsMainInit();
        }
        ,
        methods: {
            orgsMainInit: function () {
                if (this.routePk_org && this.routePk_org != "false") {
                    this.requestOrgMain();
                } else if (!this.templateMainData.preBillcode || this.templateMainData.preBillcode.length <= 0) {
                    this.checkIsExistCodeRule();
                }
            },
            checkIsExistCodeRule: function () {
                this.$http({
                    method: "POST",
                    url: this.permissionPrefix + "/checkIsExistCodeRule",
                    dataType: "JSON",
                    data: [],
                    contentType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {

                        // 如果后台没给isEdit4Billcode传值，说明没有编码规则，如果有
                        if (res.data.billcode && res.data.billcode.length > 0) {
                            this.templateMainData.isEdit4Billcode = res.data.isEdit4Billcode  === undefined ? true:res.data.isEdit4Billcode;
                            this.templateMainData.preBillcode = res.data.billcode;
                        } else {
                            this.templateMainData.isEdit4Billcode = true;
                        }
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败！", type: "error"});
                });
            },
            requestOrgMain: function () {
                this.$http({
                    method: "get",
                    url: this.permissionPrefix + this.dynOrgMainUrl + "/" + this.routePk_org,
                    dataType: "JSON",
                    data: [],
                    contentType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {
                        let resData = res.data;
                        // 基本信息数据
                        this.originalMainValue = resData.main;
                        this.$emit("setOrgsMainDataBak", resData.main);
                        // 处理单据编码规则
                        this.templateMainData.isEdit4Billcode = res.data.isEdit4Billcode  === undefined ? true:res.data.isEdit4Billcode ;
                        this.$refs[this.templateMainRef].setFormData(JSON.parse(JSON.stringify(this.originalMainValue)));
                        //把当前组织主键放入查询参数中【组织负责人】
                        if (this.templateMainData && this.templateMainData.paramsPkOrg && this.originalMainValue) {
                            this.templateMainData.paramsPkOrg.pk_org = this.originalMainValue.pk_org;
                        }

                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败！", type: "error"});
                });
            },

            // 修改标志位改变
            mainEditValueChange: function (val) {
                this.$refs[this.templateMainRef].clearEdit();
                this.$emit("changeMainEditStatus", false);
                this.$emit('update:orgsMainEdit', val);
            }
            ,
            // 页面加载完触发的方法
            mainAfterCreate()
            {
                if (this.originalMainValue && this.routePk_org && this.routePk_org != "false") {
                    this.originalMainValue.enablestate = 2;
                    this.$refs[this.templateMainRef].setFormData(JSON.parse(JSON.stringify(this.originalMainValue)));
                }
                // 判断是否存在编码规则，处理组织编码是否可编辑，和添加预置数据
                if (this.templateMainData && this.templateMainData.preBillcode) {
                    let data = this.$refs[this.templateMainRef].getFormData();
                    data.code = this.templateMainData.preBillcode;
                    this.$refs[this.templateMainRef].setFormData(data);
                    this.$refs[this.templateMainRef].setData("isEdit4Billcode", !this.templateMainData.isEdit4Billcode);
                } else if (this.templateMainData && typeof (this.templateMainData.isEdit4Billcode)) {
                    // 因为this.codeEditable是布尔类型，所以只需判断是否未定义就行了
                    this.$refs[this.templateMainRef].setData("isEdit4Billcode", !this.templateMainData.isEdit4Billcode);
                }
                this.$nextTick(function () {
                    this.$refs[this.templateMainRef].getFormComp().clearErrorMessage();
                });
            }
            ,

            beforeSave(){
                let orgData = this.$refs[this.templateMainRef].getFormData();
                let data = {
                    org: orgData,
                    managerTableData: [],
                };
                this.$refs[this.templateMainRef].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrOrg/isExistRootOrg',
                            method: 'post',
                            data: data
                        }).then((res) => {
                            if (res.data.status === true) {
                                if (res.data.havRootOrg && res.data.havRootOrg === true) {
                                    this.$confirm(res.data.msg, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.orgsSave();
                                    }).catch(() => {
                                        //如果点击“取消”什么也不处理
//                                    this.$message({
//                                        type: 'info',
//                                        message: '保存失败！'
//                                    });
                                    });
                                } else {
                                    this.orgsSave();
                                }
                            } else {
                                this.$message({message: res.data.msg, type: 'error'});
                            }
                        }).catch((res) => {
                            this.$message({message: '保存失败' + res, type: 'error'});
                        });
                    }
                });
            },
            // 基本信息保存按钮操作
            orgsSave()
            {
                let orgData = this.$refs[this.templateMainRef].getFormData();
                let data = {
                    org: orgData,
                    managerTableData: [],
                };
//                // 由于法人代表字段是自己添加的，所有单独拿出来，方便后台转换
//                data.legalbodycode = orgData.legalbodycode;

                this.$refs[this.templateMainRef].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrOrg/save',
                            method: 'post',
                            data: data
                        }).then((res) => {
                            if (res.data.status === true) {
//                                this.routePk_org = res.data.data.pk_org;
                                this.$emit('setRoutePk_org', res.data.data.pk_org);
                                this.routePk_org = res.data.data.pk_org;
                                this.$emit("orgsMainData", res.data.data);
                                this.mainEditValueChange(false);
                                this.$message({message: res.data.msg, type: 'success'});
                                this.requestOrgMain();
                            } else {
                                this.$message({message: res.data.msg, type: 'error'});
                            }
                        }).catch((res) => {
                            this.$message({message: '保存失败' + res, type: 'error'});
                        });
                    }
                });
            }
            ,
            // 基本信息取消按钮操作
            orgsCancel()
            {
                if (!this.routePk_org || this.routePk_org.length <= 0 || this.routePk_org === 'false') {
                    this.checkIsRollBackCode();
                    this.$context.getApp().back();
                    // 纯新增状态并且没有新增完成任何主集时，点击取消，返回列表页面
                } else {
                    this.mainEditValueChange(false);
                    this.$refs[this.templateMainRef].setFormData(JSON.parse(JSON.stringify(this.originalMainValue)));
                }
            },
            checkIsRollBackCode: function () {
                this.$http({
                    method: "POST",
                    url: this.permissionPrefix + "/rollBackBillCode",
                    dataType: "JSON",
                    params: {billcode: this.templateMainData.preBillcode},
                    contentType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {
//                        this.$message({message: res.data.msg, type: 'success'});
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "编码回退失败，请稍后重试！", type: "error"});
                });
            },
        }
    }
    ;
</script>
