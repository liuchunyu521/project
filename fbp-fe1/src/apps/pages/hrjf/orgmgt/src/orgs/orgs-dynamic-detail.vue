<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb :name="breadCrumbTitle"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
                <ifbp-panel id='orgsDetailPanel' title='基本信息' :icons='mainIcon'>
                    <orgs-main-detail tpl_id="org_orgs_template"
                                      ref="templateMainRef"
                                      :templateMainRef="templateMainRef"
                                      :routePk_org="routePk_org"
                                      :funcode="funcode"
                                      :permissionPrefix="prefixUrl"
                                      :dynOrgMainUrl="reqUrlSet.dynOrgMainUrl"
                                      :orgsMainEdit.sync="orgsMainEdit"
                                      @changeMainEditStatus="changeMainEditStatus"
                                      @setOrgsMainDataBak="setOrgsMainDataBak"
                                      @setRoutePk_org="setRoutePk_org"

                    >
                    </orgs-main-detail>
                </ifbp-panel>

                <!--子表组织主管不允许动态显示，部门主管可以 -->

                <ifbp-panel id='orgMgrPanel' title='组织主管' :icons='orgsMgrRender.orgsMgrIcon'
                            v-show='orgsMgrRender.mgrPanelShow'>
                    <orgsMgnagerDetail :orgsMgrTplId="orgsMgrRender.orgsMgrTplId"
                                       :orgsMgrRef="orgsMgrRender.orgsMgrRef"
                                       :orgsMgrEdit.sync="orgsMgrRender.orgsMgrEdit"
                                       :routePk_org.sync="routePk_org"
                                       :funcode="funcode"
                                       :permissionPrefix="prefixMgrUrl"
                                       :orgsMgrDataUrl="reqUrlSet.dynOrgSubUrl"
                                       :orgsMainDataBak="orgsMainDataBak"
                                       :orgsMainEdit="orgsMainEdit"
                                       :isOrgLink.sync="isOrgLink"
                                       @orgsEditValueChange="orgsEditValueChange"
                                       @changeOrgsMgrIcon="changeOrgsMgrIcon"
                                       @dynamicTemplateInit="dynamicTemplateInit"


                    >
                    </orgsMgnagerDetail>
                </ifbp-panel>
                <div v-show='orgsMgrRender.mgrPanelShow'>
                    <!-- 动态子集 -->
                    <ifbp-dynamic-panel :defaultCrud="'false'"
                                        :ref="dynOrgSubRef"
                                        :dynamic-no-code-reset-funs="dynamicNoCodeResetFunc"
                                        :dynamic-template-props="dynamicTemplateProps"
                                        :dynamic-tpl-data="dynamicTplData"
                                        :dynamic-readonly="propDynamicReadonly"
                                        :table-oper-vif="dynamicTableOperVif"
                                        :dynamic-editable="dynamicEditableAll"
                                        @update:editable="editableChange"
                                        @expand="dynamicExpandChange"
                                        @after-create="afterCreate"

                                        :child-icons="dynamicSubPlusIconAll"
                                        @plus-icon-click="plusIconClick"

                                        @formConfirm="dynamicFormConfirm"
                                        @formCancel="dynamicFormCancel"
                                        @form-edit-click="dynamicFormEdit"
                                        @form-delete-click="dynamicFormDelete"
                                        @table-click="dynamicTableClick"


                    >
                    </ifbp-dynamic-panel>
                </div>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import orgsMainDetail from "./orgs-main-detail.vue";
    import orgsMgnagerDetail from "./orgs-manager-detail.vue";
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import pageLazyMixin from "ifbp-business/pageLazyMixin/pageLazyMixin.js";

    export default {
        mixins: [pageModelMixin, pageLazyMixin],
        components: {
            orgsMainDetail,
            orgsMgnagerDetail
        },
        data()
        {
            const dynThis = this;
            var isClickNewButton = dynThis.$root.$router.currentRoute.params['id'];

            return {
                //组织基本信息 ref编码
                templateMainRef: 'orgs_main_ref',
                mainIcon: [],
                orgsMainEdit: false,
                orgsMainDataBak: {},

                orgsMgrRender: {
                    orgsMgrTplId: "org_org_manager",
                    orgsMgrRef: 'orgs_mgr_ref',
                    orgsMgrIcon: [],
                    orgsMgrEdit: false,
                    mgrPanelShow: false,
                },

                // panel图标
                orgsDetailIcons: {
                    main: [{
                        icon: 'edit',
                        click: function () {
                            dynThis.orgsEditValueChange(true);
                        }
                    }],
                },

                funcode: "$funcode=60050deptinfo",
                // 动态模板ref
                dynOrgSubRef: "dynOrgSubRef",
                //所有子集的tablecodes
                tableCodes: [],
                //所有动态子集的模板编码
                dynCodes: [],
                //请求后台数据URL前缀
                prefixUrl: "/hrjf/hrOrg",
                prefixMgrUrl: "/hrjf/hrOrg",
                reqUrlSet: {
                    dynOrgMainUrl: "/getById",
                    dynOrgSubUrl: "/getByHeadId",
                    saveDynOrgsSub: "/saveDynOrgsSub",
                    deleteDynOrgsSub: "/deleteDynOrgsSub",
                },
                // 组织主键
                routePk_org: dynThis.$root.$router.currentRoute.params['id'],
                //如果是点击列表【编辑】按钮，此处为true
                // 如果routeIsEdit为false,并且routePk_org为不为空，那么说明是联查页面
                routeIsEdit: dynThis.$route.query.isEdit,

                isOrgLink: dynThis.$route.query.isOrgLink === "true" ? true:dynThis.$route.query.isOrgLink,
                // 面包屑变量
                breadCrumbTitle:(!isClickNewButton || isClickNewButton.length <= 0 || isClickNewButton === 'false') === true ? '新增组织': '组织详情' ,
                //临时数据
                originalDynData: {},

                // 所有信息集code
                allInfoSetCode: [],
                dynamicTplData: [],
                dynamicNoCodeResetFunc: function ($node) {
                    let $pageConfigTable = this.getTableDom($node);
                    $pageConfigTable.attr(':show-header', 'false');
                    let operateHtml = this.getBaseTableOperateHtml();
                    $pageConfigTable.append(operateHtml);
                    return $node[0].outerHTML;
                },

                pageData: [],

                dynamicResetFunc: [],
                dynamicTemplateProps: [],

                // 子集不可编辑
                propDynamicReadonly: [],
                dynamicReadonlyTemp: [],
                //所有动态子表 只读状态
                dynamicReadonlyAll: [],
                dynamicReadonlyBak: [],
                dynamicSubPlusIconAll: [],
                dynamicEditableAll: [],

                // 列操作按钮
                dynamicTableOperVif: [],

            };
        },
        mounted()
        {
//            this.requestMainAndSynSubData();
        }
        ,
        methods: {
            // 动态模板初始化以后，开始加载动态模板的数据
            afterCreate: function () {
                let dynCodes = [];
                let tableCodes = [];
                let infoSets = [];
                let readonlyAll = [];
                let tableOperVif = [];
                let tplData = [];
                let subPlusIconAll = [];
                let allDynamicEditable = [];
                let pageData = this.$refs[this.dynOrgSubRef].dynamicPageData;
                this.pageData = pageData;
                if (pageData && pageData.length > 0) {
                    // 将模板的code和信息项编码分开，排除code写错时，无法显示的问题
                    for (let i = 0; i < pageData.length; i++) {
                        dynCodes.push(pageData[i].code);
                        tableCodes.push(pageData[i].attributename);
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
                            tableOperVif: false
                        };
                        tableOperVif.push(operVif);
                        let plusIcon = {
                            code: pageData[i].code,
                            isShowPlusIcon: []
                        };
                        subPlusIconAll.push(plusIcon);
                        let dynamicEditable = {
                            code: pageData[i].code,
                            dynamicEditable: pageData[i].dynamicEditable
                        };
                        allDynamicEditable.push(dynamicEditable);
                        let tpl = {
                            code: pageData[i].code,
                            tplData: {}
                        };
                        tplData.push(tpl);
                    }
                }
                this.dynCodes = dynCodes;
                this.tableCodes = tableCodes;
                this.allInfoSetCode = infoSets;
                this.dynamicReadonlyAll = readonlyAll;
                this.dynamicTableOperVif = tableOperVif;
                this.dynamicTplData = tplData;
                this.dynamicSubPlusIconAll = subPlusIconAll;
                this.dynamicEditableAll = allDynamicEditable;
                if (this.isOrgLink) {
                    this.organizationLink(!this.isOrgLink);
                } else if (!this.routeIsEdit && this.routeIsEdit != false) {
                    this.orgsEditValueChange(true);
                } else {
                    this.orgsEditValueChange(false);
                }
                if (this.routePk_org && this.routePk_org != "false") {
                    this.orgsMgrRender.mgrPanelShow = true;
                    this.$refs.templateMainRef.requestOrgMain();
                }
                if(tableCodes && tableCodes.length > 0){
                    this.dynamicTemplateInit(tableCodes);
                }
                // 联查组织可能会用到 初始的时候部门主管显示新增按钮加号
//                this.orgsMgrRender.orgsMgrIcon = this.orgsDetailIcons.mgrIcon;
            }
            ,
            dynamicTemplateInit: function (tableCodes) {
                if (this.routePk_org && this.routePk_org != "false") {
                    this.$refs.templateMainRef.requestOrgMain();
                }
                if (!tableCodes) {
                    tableCodes = this.tableCodes;
                    if(!tableCodes || tableCodes.length <= 0){
                        return ;
                    }
                    // 刷新前，进行一些关闭
                    for (let i = 0; i < this.dynCodes.length; i++) {
                        let subThis = this.$refs[this.dynOrgSubRef].$refs["dynamic_" + this.dynCodes[i]][0];
                        subThis.formShow = false;
                        this.$refs[this.dynOrgSubRef].setItemAttrBycode(this.dynCodes[i], 'dynamicEditable', false);
                        subThis.clearEdit();
                    }
                }
                // 执行之前，设置数据备份
//                    this.tempData();
                // 动态扩展区获取所有页签编码
                let data = {
                    tableCodes: tableCodes,
                    pk_org: this.routePk_org,
                };
                this.$http({
                    method: "post",
                    url: this.prefixUrl + this.reqUrlSet.dynOrgSubUrl,
                    dataType: "JSON",
                    data: data,
                    contentType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {
                        let resData = res.data;
                        //第一次加载需要用afterCreate 给子表赋值
                        this.originalDynData = JSON.parse(JSON.stringify(res.data));
                        this.orgsMainDataBak = resData.main;
                        // 基本信息数据
                        for (let i = 0; i < this.tableCodes.length; i++) {
                            if (resData) {
                                this.$refs[this.dynOrgSubRef].setTableDataByCode(this.dynCodes[i], resData[this.tableCodes[i]] == null ? [] : resData[this.tableCodes[i]]);
                            } else {
                                this.$refs[this.dynOrgSubRef].setTableDataByCode(this.dynCodes[i], []);
                            }
                            this.changeReadOnly(tableCodes[i]);
                        }

                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败！", type: "error"});
                });
            }
            ,
            // 根据code和状态修改只读状态
            changeReadOnly: function (code, status) {
                // 修改子集的可编辑状态
                let readonly = {
                    code: code,
                    dynamicReadonly: status === 1
                };
                for (let i = 0; i < this.dynamicReadonlyTemp.length; i++) {
                    if (this.dynamicReadonlyTemp[i].code === readonly.code) {
                        this.dynamicReadonlyTemp.splice(i, 1, readonly);
                        return;
                    }
                }
                this.dynamicReadonlyTemp.push(readonly);
            },

            dynamicExpandChange: function (item, index, row, expanded) {
                let code = item.code;
                let readonly = false;
                // 遍历处理动态子表是否只读
                for (let i = 0; i < this.dynamicReadonlyAll.length; i++) {
                    if (this.dynamicReadonlyAll[i].code === code) {
                        readonly = this.dynamicReadonlyAll[i].dynamicReadonly;
                        break;
                    }
                }
                // 遍历处理动态子表是否显示【编辑】【删除】按钮
                for (let j = 0; j < this.dynamicTableOperVif.length; j++) {
                    if (this.dynamicTableOperVif[j].code === code) {
                        this.$set(this.dynamicTableOperVif[j], "tableOperVif", !expanded && readonly);
                        break;
                    }
                }
            }
            ,
            // 子表进入编辑态时的处理方法
            editableChange(item, index, editable)
            {
                this.$refs[this.dynOrgSubRef].setItemAttrBycode(item.code, 'deleteButtonShow', editable);
            }
            ,
            // 子表点击【加号】按钮时
            plusIconClick: function (dynCode) {
                this.orgsEditValueChange(false, dynCode);
            }
            ,

            // 组织机构图
            organizationLink: function (isEditForMain) {
                this.orgsMainEdit = isEditForMain;
                // 先禁用基本信息
                this.mainIcon = [];
                this.orgsMgrRender.orgsMgrIcon = [];
                this.resetDynamicEdit(true);
            },
            // 基本信息编辑状态改变 || 组织主管为编辑态时也调用这个方法
            orgsEditValueChange: function (isEditForMain, dynCode, isEditOrgsMgr) {
                if (!dynCode) {
                    this.orgsMainEdit = isEditForMain;
//                    this.$emit('update:orgsMgrRender.orgsMgrEdit', isEditOrgsMgr);
                    this.orgsMgrRender.orgsMgrEdit = isEditOrgsMgr;
                    if (this.orgsMainEdit || isEditOrgsMgr) {
                        // 先禁用基本信息
                        this.mainIcon = [];
                        this.orgsMgrRender.orgsMgrIcon = [];
                    } else {
                        this.mainIcon = this.orgsDetailIcons.main;
                        this.orgsMgrRender.orgsMgrIcon = this.orgsDetailIcons.mgrIcon;
                    }
                    this.resetDynamicEdit(this.orgsMainEdit, isEditOrgsMgr);
                } else {
                    // 否则， 如果点击了子表的加号 ，主表比为不可编辑态
                    this.orgsMainEdit = false;
                    this.mainIcon = [];
                    this.orgsMgrRender.orgsMgrIcon = [];
                    this.changeDynamicEditByCode(dynCode);
                }
            }
            ,
            // 动态子集修改为非编辑状态方法
            changeDynamicEditByCode: function (dynCode) {
                let dynamicReadonlyAll = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
                for (let i = 0; i < dynamicReadonlyAll.length; i++) {
                    if (dynCode && dynCode === dynamicReadonlyAll[i].code) {
                        // 如果当前主表是编辑态，所有子表只读属性dynamicReadonly=true
                        this.$set(dynamicReadonlyAll[i], "dynamicReadonly", false);
                    } else {
                        // 如果当前主表是编辑态，所有子表只读属性dynamicReadonly=true
                        this.$set(dynamicReadonlyAll[i], "dynamicReadonly", true);
                    }

                    // 遍历处理动态子表是否显示【编辑】【删除】按钮
                    for (var j = 0; j < this.dynamicTableOperVif.length; j++) {
                        if (dynCode && dynCode === this.dynamicReadonlyAll[j].code) {
                            this.$set(this.dynamicTableOperVif[j], "tableOperVif", false);
                        }
                    }
//                    // 遍历处理动态子表是否显示plus图标
//                    for (var k = 0; k < this.dynamicSubPlusIconAll.length; k++) {
//                        if (dynCode && dynCode === this.dynamicReadonlyAll[k].code) {
//                            this.$set(this.dynamicSubPlusIconAll[k], "icons", []);
//                        }
//                    }
//                    let dynamicSubIconAll = JSON.parse(JSON.stringify(this.dynamicSubPlusIconAll));
//
//                    for (var k = 0; k < this.dynamicSubIconAll.length; k++) {
//                        if (dynCode && dynCode === this.dynamicSubIconAll[k].code) {
//                            this.$set(this.dynamicSubIconAll[k], "isShowPlusIcon", []);
//                        }
//                    }


                }
                this.propDynamicReadonly = dynamicReadonlyAll;
            }
            ,
            resetDynamicEdit: function (isEditOrgsMain, isEditOrgsMgr) {
                let dynamicReadonlyAll = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
                for (let i = 0; i < dynamicReadonlyAll.length; i++) {
                    // 如果当前主表是编辑态，所有子表只读属性dynamicReadonly=true
                    this.$set(dynamicReadonlyAll[i], "dynamicReadonly", isEditOrgsMain || isEditOrgsMgr);
                }
                this.propDynamicReadonly = dynamicReadonlyAll;
                // 遍历处理动态子表是否显示【编辑】【删除】按钮
                for (var j = 0; j < this.dynamicTableOperVif.length; j++) {
                    this.$set(this.dynamicTableOperVif[j], "tableOperVif", true);
                }
                // 恢复基本信息
            }
            ,
            // 基本信息取消按钮 将编辑态设置为false,加上编辑图标
            changeMainEditStatus: function (val) {
                this.orgsEditValueChange(val);
                if (!val || (this.routePk_org && this.routePk_org.length > 0 && this.routePk_org != "false")) {
                    this.orgsMgrRender.mgrPanelShow = true;
                }
            },

            // 组织主管是否显示新增图标
            changeOrgsMgrIcon: function (val) {
                this.orgsDetailIcons.mgrIcon = val;
            },
            // 动态模板的保存
            dynamicFormConfirm: function (item) {
                // 获取信息项名称和数据
                let confirmThis = this;
                let code = item.code;
                let codes = [];
                codes.push(code);
                let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];

                this.$refs[confirmThis.dynOrgSubRef].$refs["dynamic_" + code][0].validate(function (valid) {
                    if (valid) {
                        let dynamicFormData = confirmThis.$refs[confirmThis.dynOrgSubRef].getFormDataByCode(code);
                        dynamicFormData.pk_org = confirmThis.routePk_org;
                        let data = {
                            infoSetCode: infoSetCode,
                            pk_org: confirmThis.routePk_org,
                        };
                        this.$http({
                            url: confirmThis.prefixUrl + confirmThis.reqUrlSet.saveDynOrgsSub,
                            method: "post",
                            params: data,
                            data: dynamicFormData,
                        }).then(res => {
                            if (res.data.status === true) {
                                confirmThis.$message({message: "保存成功", type: "success"});
                                confirmThis.orgsEditValueChange(false);
                                confirmThis.dynamicTemplateInit();
                            } else {
                                confirmThis.$message({message: res.data.msg, type: "error"});
                            }
                        }).catch(() => {
                            confirmThis.$message({message: "保存失败", type: "error"});
                        });
                    }
                });
            },
            // 动态模板的编辑按钮事件
            dynamicFormEdit: function (item, index, type, row) {
                this.orgsEditValueChange(false, item.code);
            },
            // 动态模板的删除按钮事件
            dynamicFormDelete(item, type, row) {
                this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    let code = item.code;
                    let codes = [];
                    codes.push(code);
                    let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];
                    let data = {
                        status: 3,
                        infoSetCode: infoSetCode,
                        subInfo: row
                    };
                    this.realDynamicDelete(data, codes);
                }).catch(() => {
                });
            },

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

            //// 动态模板列表的编辑和删除按钮事件
            dynamicTableClick: function (item, index, icon, scope) {
                if ("edit" === icon) {
                    let subThis = this.$refs[this.dynOrgSubRef].$refs["dynamic_" + item.code][0];
                    subThis.expandRow(scope.row, scope.$index);
                    this.orgsEditValueChange(false, item.code);
                } else if ("delete" === icon) {
                    this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
                        closeOnClickModal: false,
                        type: "warning"
                    }).then(() => {
                        let code = item.code;
                        let codes = [];
                        codes.push(code);
                        let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];
                        let dynamicFormData = scope.row;

                        let data = {
                            infoSetCode: infoSetCode,
                            subInfo: dynamicFormData
                        };
                        this.realDynamicDelete(data, codes);
                    }).catch(() => {
                    });
                }
            },
            realDynamicDelete: function (data, codes) {
                let param = {
                    tableCode: data.infoSetCode,
                    pk_org: data.subInfo.pk_org,
                };
                this.$http({
                    url: this.prefixUrl + this.reqUrlSet.deleteDynOrgsSub,
                    method: "post",
                    params: param,
                    data: data.subInfo
                }).then(res => {
                    if (res.data.status === true) {
                        this.$message({message: "删除成功", type: "success"});
                        this.dynamicTemplateInit();
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                }).catch(() => {
                    this.$message({message: "删除失败", type: "error"});
                });
            },

            dynamicFormCancel: function (val) {
                this.orgsMainEdit = false;
                this.mainIcon = this.orgsDetailIcons.main;
                this.orgsMgrRender.orgsMgrIcon = this.orgsDetailIcons.mgrIcon;
                let dynamicReadonlyAll = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
                for (let i = 0; i < dynamicReadonlyAll.length; i++) {
                    // 如果当前主表是编辑态，所有子表只读属性dynamicReadonly=true
                    this.$set(dynamicReadonlyAll[i], "dynamicReadonly", this.orgsMainEdit);
                }
                this.propDynamicReadonly = dynamicReadonlyAll;
            },
            setOrgsMainDataBak: function (val) {
                this.orgsMainDataBak = val;
            },
            setRoutePk_org: function (val) {
                this.routePk_org = val;
            }
        }
    }
</script>
