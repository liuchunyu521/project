<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb  name="部门详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" :scroll-dom="scrollDom">
                <!-- 主表编辑页签 -->
                <ifbp-panel id='hrDeptPanel' title='部门信息' >
                    <ifbp-template ref='ref_dept_base'
                                   tplId='deptNoEditTplId'
                                   :tplData='deptData'
                                   :editable='deptEdit'
                                   :tpl-reset-fun='deptResetFun'
                                   :methods="deptMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!-- 子表 -->
                <ifbp-panel id='deptMgrPanel' title='部门主管'>
                    <ifbp-template ref='ref_dept_mgr_base'
                                   tpl-id='deptMgrNoEditId'
                                   :pk-temp='pk_tempDeptMgr'
                                   :tpl-data='deptMgrData'
                                   show-type='table'
                                   :tplResetFun='deptMgrResetFun'
                                   :methods="deptMgrMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!--部门变更历史-->
                <ifbp-panel id="deptHistoryPanel" title="部门变更历史"  class="titleLine" v-show="bodyShow">
                    <div align="right" class="top-button">
                        <i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -20px;"></i>
                    </div>
                    <ifbp-template ref="ref_dept_history"
                                   tpl-id="deptHistoryId"
                                   :tplData="deptHistoryData"
                                   :tplResetFun="deptHisResetFun"
                                   :methods="deptHisMethod"
                                   :table-show-menu="false"
                    >
                    </ifbp-template>
                </ifbp-panel>

                <!-- 动态子集 -->
                <ifbp-dynamic-panel :defaultCrud="'false'"
                                    :ref="dynRef"

                                    :dynamic-no-code-reset-funs="dynamicNoCodeResetFunc"
                                    :dynamic-template-props="dynamicTemplateProps"
                                    :dynamic-tpl-data="dynamicTplData"

                                    @update:editable="editableChange"
                                    @expand="dynamicExpandChange"
                                    :table-oper-vif="dynamicTableOperVif"
                                    :dynamic-readonly="dynamicReadonly"

                                    :child-icons="childIcons"
                                    @plus-icon-click="plusIconClick"

                                    @formConfirm="dynamicFormConfirm"
                                    @formCancel="dynamicFormCancel"
                                    @form-edit-click="dynamicFormEdit"
                                    @form-delete-click="dynamicFormDelete"

                                    @table-click="dynamicTableClick"
                                    @after-create="afterCreate"
                                    v-show="bodyShow"
                >
                </ifbp-dynamic-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins : [pageModelMixin],
        data()
        {
            const vm = this;
            //取路由路径参数
            var hrDeptParam = this.$root.$router.currentRoute.params.id;
            var $isNew;
            var $isEdit;
            return {
                // 通过传入的参数判断是新增还是修改操作
                //是否编辑态
                //是否新增态
                isNew: $isNew,
                isEdit: $isEdit,
                pk_hrDept: hrDeptParam,
                originalHeadValue: {},
                originalBodyValue: {},
                originalHisValue:{},
                // ifbp-panel-group所需参数
                scrollDom: 'ifbpScrollDom',
                // UI模板所需参数
                // pk_tempDept: '0001AA10000000009O17',
                // 部门主管模板主键
                pk_tempDeptMgr: '0001AA10000000002BD3',
                deptData: {
                    rules: {},
                    paramsPk_org: {
                        pk_org: "",
                    }
                },
                deptMgrData: {
//                    deptmanager_t: {},
//                    rules: {}
                },
                deptHistoryData: {

                },
                status: 2, //1, update; 2, new; 3, delete
                // 基本信息是否为修改态
                deptEdit: false,
                // 部门主管是否为修改态
                deptMgrEdit: false,
                bodyShow: false,
                deptResetFun: function ($node) {
                    var $pk_org = $node.find("[v-model='hrdept.pk_org']");
                    $pk_org.attr('v-on:change', 'orgChange');

                    return $node[0].outerHTML;
                },
                deptHisResetFun($node) {

                },
                deptMgrResetFun($node) {
                    // 给人员编码添加绑定
                    $node.find("[v-model='deptmanager.pk_psndoc']").attr("v-on:change", "psndocChange");
                    var $psndoccode = $node.find("[prop='psndoccode']");
                    $psndoccode.html(
//                        '<template scope="scope">' +
                        '<el-input id="psndoccode" :editable="editable" v-model="deptmanager.psndoccode" :disabled="true"></el-input>'
//                        '</template>'
                    );

                    //列名是否显示
                    var $table = this.getTableDom($node);
                    //子表不显示表头
                    $table.attr(':show-header', 'false');
                    return $node[0].outerHTML;
                },
                deptMethods: {
                    orgChange: function (val) {
                        if (val.value[0]) {
                            let refid = val.value[0].id;
                            if ((!this.paramsPk_org || !this.paramsPk_org.pk_org ) || this.paramsPk_org.pk_org !== refid) {
                                vm.$refs.ref_dept_base.getData("hrdept").pk_fatherorg = "";
                            }
                            if (refid) {
                                this.paramsPk_org.pk_org = refid;
                            }
                        }
                    }
                },
                deptHisMethod: {},
                deptMgrMethods: {
                    psndocChange: function (val) {
                        if (val.value[0]) {
                            let refcode = val.value[0].refcode;
                            if (!refcode) {
                                refcode = val.value[0].code;
                            }
                            if (refcode) {
                                this.deptmanager.psndoccode = refcode;
                            }
                        }
                    }
                },
                /*zgy*/


                //人员基本信息相关控制变量
                employeeDetail: {
                    //本页面所有可修改的子集
                    modifiable: ['psndoc'],
                    //所有参与加载的子集
                    psndoc: {
                        ref: 'ref_employee_psndoc',
                        edit: false,
                    },
                    psnjob: {
                        ref: 'ref_psnjob_panel',
                        edit: false,
                    },
                },

                //定义所有的icons，支持动态
                employeeIcons: {
                    psndoc: [{
                        icon: "edit",
                        click: function () {
                            employeeThis.psndocEditValueChange(!employeeThis.employeeDetail.psndoc.edit);
                        }
                    }],
                },



                // 动态部分
                // 权限前缀
                permissionPrefix:'/hrjf/hrDept',
                dynRef: "dynRef",
                dynUrl: {
                    list: "/listSubInfo",
                    save: "/saveSubInfo",
                    delete: "/deleteSubInfo",
                    getCodeEditable: '/getCodeEditable',
                },
                // 所有子集code
                allTableCode: [],
                allInfoSetCode: [],

                dynamicNoCodeResetFunc: function ($node) {
                    let $pageConfigTable = this.getTableDom($node);
                    $pageConfigTable.attr(':show-header', 'true');
                    let operateHtml = this.getBaseTableOperateHtml();
                    $pageConfigTable.append(operateHtml);
                    return $node[0].outerHTML;
                },
                dynamicTemplateProps:[],
                dynamicTplData:[],
                childIcons:[],

                // 子集计数
                countNum: 0,

                // 子集不可编辑
                dynamicReadonly: [],
                dynamicReadonlyTemp: [],
                dynamicReadonlyBak: [],
                dynamicReadonlyAll: [],

                // 列操作按钮
                dynamicTableOperVif: [],

                // 入转调离参数
                dimissionRef: "employeeDimissionRef",
                /*zgy end*/




            };
        }
        ,
        mounted()
        {
            this.request();
        }
        ,
        methods: {
            // 获取数据
            request()
            {
                // 请求基本信息详情
                this.requestdeptInfo();
            }
            ,
            // 基本信息详情
            requestdeptInfo()
            {
                if (!this.pk_hrDept || this.pk_hrDept === undefined || this.pk_hrDept.length <= 0) {
                    return;
                }
                this.$http({
                    url: '/hrjf/hrDept/getById/' + this.pk_hrDept,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.originalHeadValue = res.data.deptRetData;
                            this.originalBodyValue = res.data.deptMgrRetData;
                            this.originalHisValue = res.data.deptHistoryData;
                            this.bodyShow = true;
                            this.$refs.ref_dept_base.setData(
                                'hrdept',
                                JSON.parse(JSON.stringify(this.originalHeadValue))
                            );
                            //修改时将组织主键放入查询参数用于部门过滤
                            this.deptData.paramsPk_org.pk_org = this.originalHeadValue.pk_org;
                            if (this.originalBodyValue) {
                                this.$refs.ref_dept_mgr_base.setData(
                                    'deptmanager_t',
                                    JSON.parse(JSON.stringify(this.originalBodyValue))
                                );
                            }else{
                                this.$refs.ref_dept_mgr_base.tableShow = false;
                            }
                            if(this.originalHisValue){
                                this.$refs.ref_dept_history.tableShow = true;
                                this.$refs.ref_dept_history.setData(
                                    'depthistory_t',
                                    JSON.parse(JSON.stringify(this.originalHisValue))
                                );
                            }else{
                                this.$refs.ref_dept_history.tableShow = false;
                            }
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '获取数据失败！',
                            type: 'error'
                        });
                    });
            },


            /*zgy*/
            // 根据code修改只读状态
            changeReadOnly: function (code) {
                // 修改子集的可编辑状态
                let readonly = {
                    code: code,
                    dynamicReadonly: false,
                };
                for (let i = 0; i < this.dynamicReadonlyTemp.length; i++) {
                    if (this.dynamicReadonlyTemp[i].code === readonly.code) {
                        this.dynamicReadonlyTemp.splice(i, 1, readonly);
                        return;
                    }
                }
                this.dynamicReadonlyTemp.push(readonly);
            },
            // 动态子集非编辑状态修改
            changeDynamicEditByCode: function (code) {

                // 先禁用人员基本信息
                this.employeeDetail.psndoc.icons = [];
                this.employeeDetail.psnjob.icons = [];
                this.ifbpFooterShow = false;

                let all = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
                if (code) {
                    for (let i = 0; i < all.length; i++) {
                        if (code === all[i].code) {
                            this.$set(all[i], "dynamicReadonly", false);
                        }
                    }
                }
                let read = [];
                for (let m = 0; m < this.dynamicReadonly.length; m++) {
                    let data = {
                        code: this.dynamicReadonly[m].code,
                        dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly,
                    };
                    read.push(data);
                }
                if(!this.dynamicReadonlyBak || this.dynamicReadonlyBak.length <= 0){
                    this.dynamicReadonlyBak = read;
                }
                this.dynamicReadonly = all;
            },


            dynamicFormConfirm: function (item) {
                // 获取信息项名称和数据
                let confirmThis = this;
                let code = item.code;
                let codes = [];
                codes.push(code);
                let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];

                this.$refs[this.dynRef].$refs["dynamic_" + code][0].validate(function (valid) {
                    if (valid) {
                        let dynamicFormData = confirmThis.$refs[confirmThis.dynRef].getFormDataByCode(code);
                        dynamicFormData.pk_dept = confirmThis.pk_hrDept;
                        let data = {
                            infoSetCode: infoSetCode,
                            pk_dept: confirmThis.pk_hrDept,
                        };
                        this.$http({

                            url: "/hrjf/hrDept/saveSubInfo",
                            // url: confirmThis.permissionPrefix + confirmThis.dynUrl.save,
                            method: "post",
                            params: data,
                            data: dynamicFormData,
                        }).then(res => {
                            if (res.data.status === true) {
                                this.$message({message: "保存成功", type: "success"});
                                //  confirmThis.resetDynamicEdit();
                                confirmThis.dynamicTemplateInit(codes);
                            } else {
                                this.$message({message: res.data.msg, type: "error"});
                            }
                        }).catch(() => {
                            this.$message({message: "保存失败", type: "error"});
                        });
                    }
                });
            },
            //遍历获取模板code
            getInfoSetCodeByCodes(codes) {
                let infoSetCodes = [];
                for (let i = 0; i < codes.length; i++) {
                    for (let j = 0; j < this.allInfoSetCode.length; j++) {
                        if (codes[i] === this.allInfoSetCode[j].code) {
                            infoSetCodes.push(this.allInfoSetCode[j].value);
                            break;
                        }
                    }
                }
                return infoSetCodes;
            },

            // 动态模板初始化以后，开始加载动态模板的数据
            afterCreate: function () {
                let codes = [];
                let infoSets = [];
                let readonlyAll = [];
                let tableOperVif = [];
                let pageData = this.$refs[this.dynRef].dynamicPageData;
                if (pageData && pageData.length > 0) {
                    // 将模板的code和信息项编码分开，排除code写错时，无法显示的问题
                    for (let i = 0; i < pageData.length; i++) {
                        codes.push(pageData[i].code);
                        let infoSet = {
                            code: pageData[i].code,
                            value: pageData[i].attributename
                        };
                        infoSets.push(infoSet);
                        let readonly = {
                            code: pageData[i].code,
                            dynamicReadonly: true
                        };
                        readonlyAll.push(readonly);
                        let operVif = {
                            code: pageData[i].code,
                            tableOperVif: true
                        };
                        tableOperVif.push(operVif);
                    }
                }
                this.allTableCode = codes;
                this.allInfoSetCode = infoSets;
                this.dynamicReadonlyAll = readonlyAll;
                this.dynamicTableOperVif = tableOperVif;
                this.dynamicTemplateInit();
            },
            dynamicTemplateInit: function (codes) {
                if (!codes) {
                    codes = this.allTableCode;
                } else {
                    // 刷新前，进行一些关闭
                    for (let i = 0; i < codes.length; i++) {
                        let subThis = this.$refs[this.dynRef].$refs["dynamic_" + codes[i]][0];
                        subThis.formShow = false;
                        this.$refs[this.dynRef].setItemAttrBycode(codes[i], 'dynamicEditable', false);
                        subThis.clearEdit();
                    }
                }
                let infoSetCodes = this.getInfoSetCodeByCodes(codes);
                // 执行之前，设置数据备份

                this.tempData();

                // 动态扩展区获取所有页签编码 countNum
                for (let i = 0; i < infoSetCodes.length; i++) {
                    this.countNum += 1;
                    let data = {
                        infoSetCode: infoSetCodes[i],
                        pk_hrDept: this.pk_hrDept,
                    };
                    this.$http({
                        method: "post",
                        url: this.permissionPrefix + this.dynUrl.list,
                        params: data
                    }).then(res => {

                        if (res.data.status === true) {
                            let resData = res.data.data;
                            if (resData) {
                                this.$refs[this.dynRef].setTableDataByCode(codes[i], resData);
                            } else {
                                this.$refs[this.dynRef].setTableDataByCode(codes[i], []);
                            }
                            this.changeReadOnly(codes[i]);
                        } else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                        this.countNum -= 1;
                        // 合并备份数据
                        this.mergeData();
                    }).catch(() => {
                        this.countNum -= 1;
                        //    this.$message({message: "部门信息获取失败！", type: "error"});
                    });
                }
            },


            tempData: function () {
                let read = [];
                for (let m = 0; m < this.dynamicReadonly.length; m++) {
                    let data = {
                        code: this.dynamicReadonly[m].code,
                        dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly
                    };
                    read.push(data);
                }
                this.dynamicReadonlyTemp = read;
            },
        }
    }
</script>
<style>

</style>
