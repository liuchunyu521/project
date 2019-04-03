<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="组织信息" v-show="false" ></ifbp-breadcrumb>

        <ifbp-button-area :no-breadcrumb="true">
            <!--<el-button type="primary" @click="addOrgs">新增</el-button>-->

            <!--<el-button type="primary" @click="">导入</el-button>-->
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- top区域 -->
            <ifbp-btn-line
                    :text-btn-arr="btnLineTextBtnArr"
                    :icon-btn-arr="btnLineIconBtnArr"
                    :text-align="textAlign"
                    :slot-width="0"
                    style="margin-top:-16px;"
            >
                <!--<div slot="search-dialog">-->

                    <!--<ifbp-search-dialog class="fr"-->
                                        <!--:template-code="tplCode"-->
                                        <!--@search="advancedSearch">-->
                    <!--</ifbp-search-dialog>-->
                <!--</div>-->
            </ifbp-btn-line>
            <!-- UI模板组件 -->
            <ifbp-template :ref="orgInfoRef"
                           tpl-id="orgInfo_template_id"
                           :tpl-data="orgInfoTemplateData"
                           :tplResetFun="orgInfoResetFun"
                           :methods="orgInfoMethods"
                           :table-show-menu="false"
                           class="uitemplate-no-top"
                           @edit-table-click="orgInfoTableEditClick"
                           @delete-table-click="validateEnablestatus"
                           @folder-shared-table-click="folderSharedLinkDept">
            </ifbp-template>
        </ifbp-main-area>

        <drag-dialog :cascaderdialogVisible="dragDialogParams.cascaderdialogVisible"
                     :title="dragDialogParams.title"
                     :cascaderTreeData="dragDialogParams.cascaderTreeData"
                     :cascaderModel="dragDialogParams.cascaderModel"
                     :placeholdervalue="dragDialogParams.placeholdervalue"
                     :orderData="dragDialogParams.orderData"
                     :casShow="dragDialogParams.casShow"
                     @orderData="displayOrder"
                     @orderEndvalue="saveOrderResult"
                     @casdialogVisible="casdialogVisible"
        >
        </drag-dialog>
    </ifbp-page>
</template>

<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import dragDialog from '../../../../../common/component/dragdialog.vue';
    import IfbpBtnLine from "ifbp-business/ifbpBtnLine";


    export default {
        mixins: [pageModelMixin],
        components: {
            dragDialog,
            IfbpBtnLine

        },
        data(){
            const orgInfoThis = this;
            return {
                btnLineTextBtnArr: [
                    {
                        title: "新增",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "addOrgs",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: orgInfoThis.addOrgs,   // 按钮触发后调用函数
                    }
                ],
                btnLineIconBtnArr: [{
                    title: "组织排序",                // 图标按钮鼠标悬浮显示的文字
                    command: "orgsDisplayOrder",           // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    iconfont: "hr-icon-swap_vert", // 图标按钮的icon 对应的类名;
                    fn: orgInfoThis.orgsDisplayOrder,           // 按钮触发后调用的函数;
                },{
                    title: "设置",
                    command: "setting",
                    iconfont: "ifbp-icon-setting",
                    fn: orgInfoThis.showHeaderSetting,

                }],
                textAlign: "right",
                // 查询模板传入参数
                tplCode: 'hrjfOrgOrgs',
                searchTemplate: {},

                // UI模板传入参数
                orgInfoRef: 'orginfo_ref',
                // orgInfoPk: '0001AA10000000006BQN',
                orgInfoTemplateData: {
                    isTreeShow: true,
                },
                orgInfoResetFun: function ($node) {
                    let $table = this.getTableDom($node);
                    $table.attr(":disable-tooltip", "true");
                    $table.attr(":table-tree", "isTreeShow");

                    //懒加载
                    $table.attr(":table-tree", "true");
                    $table.attr(":lazy-tree", "true");
                    $table.attr("v-on:tree-icon-expanded", "loadTreeNodeData");

                    let code = $node.find("[prop='code']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop="orgInfoTableEditClick(scope)">{{scope.row.code}}</a>' +
                        '</template>'
                    );

                    let $enablestate = $node.find("[prop='enablestate']");
                    $enablestate.attr('render-type', 'default');
                    $enablestate.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row)" v-model="scope.row.enablestate"  on-color="#4BD762" off-color="#AFAFAF" :on-value="2" :off-value="3" on-text="是" off-text="否"></el-switch>' +
                        '</template>'
                    );


                    let detail = [{
                        title: "联查部门",
                        icon: "folder-shared",
                        vif: 'scope.row.hasAuth'
                    }];
                    let operateHtml = this.getBaseTableOperateHtml(detail,"");

                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                orgInfoMethods: {
                    loadTreeNodeData(row) {
                        let parentId = row.pk_org;
                        this.getLazyOrgChildMethod(parentId, row);

                    },
                    getLazyOrgChildMethod(parentId, row) {
                        let param = {
                            parentId: parentId
                        };
                        this.$http({
                            url: "/hrjf/hrOrg/getLazyChildOrgs",
                            method: "post",
                            data: orgInfoThis.searchTemplate,
                            params: param,
                        }).then((res) => {
                            if (res.data.status === true) {
                                orgInfoThis.tableListData = res.data.data;
                                if (orgInfoThis.tableListData) {
                                    orgInfoThis.$refs.orginfo_ref.getTableComp().setTreeDataByRow(res.data.data, row);
                                }
                                //  orgInfoThis.$refs[this.orgInfoRef].setData("isTreeShow", res.data.isTreeShow);
                            } else {
                                orgInfoThis.$message({message: res.data.msg, type: "warning"});
                            }
                        }).catch((err) => {
                            alert(err);
                            orgInfoThis.$message({message: "信息获取失败", type: "error"});
                        });
                    },

                    // table行的点击编码进入非编辑详情页
                    orgInfoTableEditClick(scope) {
                        orgInfoThis.$router.push({
                            path: '/hrjf/hrOrg/orgsDetails/' + scope.row.pk_org,
                            query: {isEdit: false}
                        });
                    },
                    handleChange(rowData){
                        this.$http({
                            url: "/hrjf/hrOrg/enable",
                            method: "post",
                            data: rowData,
                        }).then((res) => {
                            if (res.data.status === true) {
                                //需要将返回的值赋值给页面，否则页面没反应
                                rowData.enablestate = res.data.data.enablestate;
                                //ts若不重新赋值给前台界面，界面不能再次修改。
                                rowData.ts = res.data.data.ts;
                                orgInfoThis.$message({message: res.data.msg, type: "success"})
                                orgInfoThis.refreshList();
                            } else {
                                rowData.enablestate = (rowData.enablestate === 2 ? 3 : 2);
                                this.$message({message: res.data.msg, type: "warning"});
                            }
                        }).catch(() => {
                            rowData.enablestate = (rowData.enablestate === 2 ? 3 : 2);
                            this.$message({message: "操作失败", type: "error"});
                        });
                    }
                },

                // 组织数据备份
                tableListData: [],

                // 组织排序弹窗所需数据
                dragDialogParams: {
                    cascaderdialogVisible: false,
                    title: "组织排序",
                    cascaderTreeData: [],// 可选择的数据
                    cascaderModel: [],// 可选择的数据默认值
                    placeholdervalue: "请选择组织",
                    orderData: [],// 待排序的所有数据
                    casShow: false,
                }
            };
        },

        mounted() {
            var vm = this;
            vm.requestData();
        },

        methods: {
            ifbpPageInit(){
                this.requestData();
            },
            // 懒加载，查询一级数据
            requestData() {
                this.$http({
                    url: "/hrjf/hrOrg/getLazyParentOrgs",
                    method: "post",
                    data: this.searchTemplate,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.tableListData = res.data.data;
                        if (this.tableListData) {
                            this.$refs[this.orgInfoRef].setTableData(JSON.parse(JSON.stringify(this.tableListData)));
                        }
                        this.$refs[this.orgInfoRef].setData("isTreeShow", res.data.isTreeShow);
                    } else {
                        this.$message({message: res.data.msg, type: "warning"});
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败", type: "error"});
                });
            },
            requestOrgSearchData() {
                this.$http({
                    url: "/hrjf/hrOrg/getTree",
                    method: "post",
                    data: this.searchTemplate,
                }).then((res) => {
                    if (res.data.status === true) {
                        this.tableListData = res.data.data;
                        if (this.tableListData) {
                            this.$refs[this.orgInfoRef].setTableData(JSON.parse(JSON.stringify(this.tableListData)));
                        }
                        this.$refs[this.orgInfoRef].setData("isTreeShow", res.data.isTreeShow);
                    } else {
                        this.$message({message: res.data.msg, type: "warning"});
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败", type: "error"});
                });
            },


            // 跳转到添加页面
            addOrgs() {
                this.$router.push("/hrjf/hrOrg/orgsDetails/false");
            },
            // table行的编辑操作
            orgInfoTableEditClick(scope) {
                this.$router.push("/hrjf/hrOrg/orgsDetails/" + scope.row.pk_org);
            },

            // 组织列表联查部门按钮
            folderSharedLinkDept: function (scope) {
                // this.$router.push('/hrjf/hrDept?pk_org=' + scope.row.pk_org )
                this.$router.push('/hrjf/hrDept/deptJoinInfo?pk_org=' + scope.row.pk_org + '&org_name=' + scope.row.name + '&funcode=60050deptinfo')
            },

            validateEnablestatus(scope){
                if (scope.row.enablestate && scope.row.enablestate !== 3) {
                    this.$alert('【' + scope.row.name + '】组织在启用状态下不能删除，请先停用！', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
//                            this.$message({
//                                type: 'info',
//                                message: `action: ${ action }`
//                            });
                        }
                    });
                } else {
                    this.orgInfoTableDeleteClick(scope);
                }
            },
            // table行的删除操作
            orgInfoTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.deleteClick(scope.row.pk_org);
                }).catch(() => {
                });
            },
            // 删除处理
            deleteClick(pk_org) {
                this.$http({
                    url: "/hrjf/hrOrg/delete/" + pk_org,
                    method: "get"
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({message: res.data.msg, type: "success"});
                        this.refreshList();
                    } else {
                        this.$message({message: res.data.msg, type: "warning"});
                    }
                }).catch(() => {
                    this.$message({message: "删除失败", type: "error"});
                });
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshList();
            },

            //刷新table
            refreshList: function () {
                this.requestOrgSearchData();
            },

            // 组织排序
            orgsDisplayOrder: function () {
                this.getOrgsTreeData();
            },
            // 组织排序--参照数据
            getOrgsTreeData: function () {
                let params = {
                    isNeedGroup: false,
                };
                this.$http({
                    url: "/hrpub/component/common/orgCascader",
                    method: "post",
                    params: params,
                }).then((res) => {
                    if (res.data.status === true) {
                        if (res.data.data.orgtreedata && res.data.data.orgtreedata.length > 0) {
                            this.dragDialogParams.cascaderTreeData = res.data.data.orgtreedata;
//                            let defaultnode = res.data.data.defaultorgpk;
//                            if (!defaultnode) {
//                                defaultnode = res.data.data.orgtreedata[0].value;
//                            }
//                            for (var i = 0; i < defaultnode.length; i++) {
//                                defaultnode.splice(i, defaultnode.length - 1);
//                            }
//                            this.dragDialogParams.cascaderModel = defaultnode;
//
//                            let orgsModel = JSON.parse(sessionStorage.getItem("orgsInfo-orgsModel"));
//
//                            if (orgsModel && orgsModel.length > 0) {
//                                this.dragDialogParams.cascaderModel = orgsModel;
//                            }

                            //查询部门级联数据成功后 拿着默认值查询排序数据
                            this.displayOrder();
                        } else if (res.data.error && res.data.error.errorMessage) {
                            this.$message({
                                message: '数据树获取失败: ' + res.data.error.errorMessage,
                                type: 'warning'
                            });
                        }
                    }
                }).catch((e) => {
                    this.$message.error('请求出错');
                });
            },
            // 组织排序切换部门时，更新数据
            displayOrder: function (params$pk_org) {
                this.dragDialogParams.cascaderModel = params$pk_org;
//                sessionStorage.setItem("orgsInfo-orgsModel", JSON.stringify(this.dragDialogParams.cascaderModel));
                let pk_fatherorg = "";
                if (!params$pk_org) {
                    pk_fatherorg = "";
                }
                else if (params$pk_org && params$pk_org.length <= 0) {
                    pk_fatherorg = "";
                } else {
                    pk_fatherorg = params$pk_org[params$pk_org.length - 1];
                }

                var orgsInfoParams = {
                    pk_fatherorg: pk_fatherorg
                }
                this.dragDialogParams.cascaderdialogVisible = true;
                this.$http({
                    url: '/hrjf/hrOrg/getOrderDataByPkOrg',
                    method: 'get',
                    params: orgsInfoParams
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.dragDialogParams.orderData = res.data.data;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
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
            // 取消弹窗
            casdialogVisible: function (isShowDialog) {
                this.dragDialogParams.cascaderdialogVisible = false;

            },
            //保存排序后数据
            saveOrderResult: function (orderValue) {
                this.saveDept4DisplayOrder(orderValue);
                this.dragDialogParams.cascaderdialogVisible = false;

            },
            saveDept4DisplayOrder: function (orderValue) {
                this.$http({
                    url: '/hrjf/hrOrg/saveAdminorg4DisplayOrder',
                    method: 'post',
                    data: JSON.parse(JSON.stringify(orderValue)),
                    dataType: "application/json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.refreshList();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
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
            showHeaderSetting() {//设置显示列
                this.$refs[this.orgInfoRef].setTransferVisible(true);
            }

        }

    }
</script>
