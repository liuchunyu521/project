<template>
    <ifbp-page id="hrdeptUiId">
        <!-- 节点title -->
        <ifbp-breadcrumb name="部门信息" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <hr-org-cascader name="deptInfo"
                             @update:pk_org="val => {this.pk_org = val}"
                             :needDept="false"
                             @change="orgChange">
            </hr-org-cascader>
            <!-- 查询模板组件 -->
            <ifbp-search
                    class="fr"
                    :template-code="tplCode"
                    :show-selected-tags="showSelectedTags"
                    :conditions-before-advance="4"
                    :no-breadcrumb-search="true"
                    @search="advancedSearch"
            >
            </ifbp-search>

            <!--显示已撤销-->
            <div class="fr" style="margin-right: 15px">
                <el-checkbox v-model="showCanceled" @change="showCancelChange">显示已撤销</el-checkbox>
            </div>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <ifbp-btn-line
                    :text-btn-arr="btnLineTextBtnArr"
                    :icon-btn-arr="btnLineIconBtnArr"
                    :text-align="textAlign"
                    :slot-width="0"
                    style="margin-top:-16px;"
            >
            </ifbp-btn-line>
            <!--<div align="right" class="top-button">-->

            <!--<el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="addBaseinfo"><span>新增</span>-->
            <!--</el-button>-->

            <!--<el-dropdown menu-align="start" trigger="click" @command="handleCommand">-->
            <!--<el-button type="text" class="ifbp-layout-content-right-button marginleft24">-->
            <!--<span>变更</span> <i style="position: relative;top: 3px;"-->
            <!--class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>-->
            <!--</el-button>-->
            <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item command="outerShiftClick">跨组织转移</el-dropdown-item>-->
            <!--<el-dropdown-item command="renameClick">更名</el-dropdown-item>-->
            <!--<el-dropdown-item command="cancelClick">撤销</el-dropdown-item>-->
            <!--<el-dropdown-item command="unCancelClick">取消撤销</el-dropdown-item>-->
            <!--<el-dropdown-item command="shiftClick">组织内转移</el-dropdown-item>-->
            <!--<el-dropdown-item command="deptMergeClick">合并</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--<i class="hr-icon-swap_vert" @click="deptDisplayOrder" style="position: relative;top: -4px;"></i>-->
            <!--<i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -4px;"></i>-->
            <!--</div>-->
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_dept_l"
                           tpl-id="deptInfoTplId"
                           class="uitemplate-no-top"
                           :table-show-menu="false"
                           :tpl-data="tableData"
                           :tplResetFun="deptInfoTableResetFun"
                           :methods="formMethods"
                           show-type="table"
                           @selection-change="deptInfoSelectionChange"
                           @edit-table-click="deptInfoTableEditClick"
                           @delete-table-click="deptInfoTableDeleteClick"
                           @assignment-ind-table-click="deptInfoTableLinkAssignment"
                           @people-table-click="deptInfoTableLinkPsn"
            >
            </ifbp-template>
        </ifbp-main-area>
        <outerDialog :ref="outerRef" @outerRequest="request"></outerDialog>
        <renameDialog :ref="renameRef" @renameRequest="request"></renameDialog>
        <cancelDialog :ref="cancelRef" @cancelRequest="request"></cancelDialog>
        <shiftDialog :ref="shiftRef" @shiftRequest="request"></shiftDialog>
        <uncancelDialog :ref="uncancelRef" @uncancelRequest="request"></uncancelDialog>
        <dept-merge :ref="deptMergeRef"
                    :pk_org="pk_org"
                    @refreshTable="request"
        ></dept-merge>

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
    import outerDialog from './outerShiftDialog.vue';
    import renameDialog from './renameDialog.vue';
    import cancelDialog from './deptCancelDialog.vue';
    import  shiftDialog from  './shiftDialog.vue';
    import  uncancelDialog from './deptUnCancelDialog.vue';
    import deptMerge from './dept-merge.vue'
    import dragDialog from '../../../../../common/component/dragdialog.vue';
    import IfbpBtnLine from "ifbp-business/ifbpBtnLine";
    import tableHeightMixin from "ifbp-business/tableHeightMixin/index.js";

    let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

    export default {
        components: {
            HrOrgCascader,
            IfbpBtnLine,
            outerDialog,
            renameDialog,
            cancelDialog,
            shiftDialog,
            uncancelDialog,
            deptMerge,
            dragDialog
        },
        mixins: [pageModelMixin,tableHeightMixin],

        data(){

            const deptInfo$This = this;
            return {
                btnLineTextBtnArr: [{
                    title: "新增",        // 按钮显示文字
                    disabled: false,      // 是否为禁用
                    command: "addBaseinfo",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                    fn: deptInfo$This.addBaseinfo,   // 按钮触发后调用函数
                }, {
                    title: "变更",        // 按钮显示文字
                    disabled: false,      // 是否为禁用
                    command: "deptShift",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                    fn: '',   // 按钮触发后调用函数
                    itemArr: [ {
                        title: "更名",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "renameClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: deptInfo$This.renameClick,   // 按钮触发后调用函数
                    },{
                        title: "合并",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "deptMergeClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: deptInfo$This.deptMergeClick,   // 按钮触发后调用函数
                    }, {
                        title: "撤销",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "cancelClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: deptInfo$This.cancelClick,   // 按钮触发后调用函数
                    }, {
                        title: "取消撤销",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "unCancelClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 4,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: deptInfo$This.unCancelClick,   // 按钮触发后调用函数
                    },{
                        title: "组织内转移",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "shiftClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 5,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: deptInfo$This.shiftClick,   // 按钮触发后调用函数
                    },{
                        title: "跨组织转移",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "outerShiftClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 5,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: deptInfo$This.outerShiftClick,   // 按钮触发后调用函数
                    }],
                }],
                btnLineIconBtnArr: [{
                    title: "部门排序",                // 图标按钮鼠标悬浮显示的文字
                    command: "deptDisplayOrder",           // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    iconfont: "hr-icon-swap_vert", // 图标按钮的icon 对应的类名;
                    fn: deptInfo$This.deptDisplayOrder,           // 按钮触发后调用的函数;
                }, {
                    title: "设置",                // 图标按钮鼠标悬浮显示的文字
                    command: "settingBtn",           // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    iconfont: "ifbp-icon-setting", // 图标按钮的icon 对应的类名;
                    fn: deptInfo$This.settingBtn,           // 按钮触发后调用的函数;
                }],
                otherHeight: 230,
                textAlign: "right",
                //是否显示是否撤销列
                // isShowCancel:false,
                //默认组织
                defaultPk_org: "",
                //组织选择数据
                orgTreeData: [],
                orgModel: [],
                deptMergeRef: 'deptMergeRef',
                showCanceled: false,
                uncancelRef: 'uncancelRef',
                shiftRef: 'shiftRef',
                cancelRef: 'cancelRef',
                outerRef: 'outerRef',
                renameRef: 'renameRef',
                searchTemplate: {},
                // 查询模板传入参数
                tplCode: 'hrWebDeptSTPL',
                showSelectedTags: false,
                // UI模板传入参数
                // deptInfoTablePk: "0001AA10000000009O16",
                isHavAttachment: false,
                tableData: {
                    dept: {},
                    isTreeShow: true,
                    tBodyHeight:'',
                },
                formMethods: {
                    loadTreeNodeData(row) {
                        let parentId = row.pk_dept;
                        this.getLazyDeptChildMethod(parentId, row);
                    },
                    // table行的点击编码进入非编辑详情页
                    deptTableEditClick(scope) {
                        var pkUrlDept = scope.row.pk_dept;
                        if (pkUrlDept) {
                            deptInfo$This.$router.push({
                                path: '/hrjf/hrDept/deptDetail',
                                query: {id: pkUrlDept, isEditForPath: false}
                            });
                        }
                    },
                    getLazyDeptChildMethod(parentId, row){
                        var url = '/hrjf/hrDept/getLazyChildDept';
                        let param = {
                            parentId: parentId,
                            showCanceled: deptInfo$This.showCanceled
                        };
                        var deptDto = {
                            "searchTemplateAggDto": deptInfo$This.searchTemplate,
                            "linkCondition": '{"pk_org":"' + deptInfo$This.pk_org + '"}',
                        }
                        this.$http({
                            url: url,
                            method: "post",
                            dataType: "JSON",
                            data: deptDto,
                            params: param,
                            contentType: "application/json"
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    deptInfo$This.$refs.ref_dept_l.setData("isTreeShow", res.data.isTreeShow);
                                    deptInfo$This.$refs.ref_dept_l.getTableComp().setTreeDataByRow(res.data.data, row);
                                    deptInfo$This.totalElements = res.data.data.totalElements;
                                    deptInfo$This.size = res.data.data.size;
                                }
                            })
                            .catch(() => {
                                deptInfo$This.$message({
                                    message: "信息获取失败",
                                    type: "error"
                                });
                            });

                    }
                },
                deptInfoTableResetFun: function ($node) {
                    let $table = this.getTableDom($node);
                    $table.attr(':height', 'tBodyHeight');

                    //这个属性的作用是替换成浏览器自带的tip显示
                    $table.attr(":disable-tooltip", "true");
                    //$table.attr(":highlight-current-row","true");
                    //懒加载
                    $table.attr(":table-tree", "true");
                    $table.attr(":lazy-tree", "true");
                    $table.attr("v-on:tree-icon-expanded", "loadTreeNodeData");
                    // $node.find("[_id='dept_l']").attr(":table-tree", "isTreeShow");
                    let code = $node.find("[prop='code']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop="deptTableEditClick(scope)">{{scope.row.code}}</a>' + '<i  v-show="scope.row.hasfile"   class="ifbp-icon-attach-file" style="color: #5AC8FA ;margin-left:8px ; height: 16px; vertical-align: -19%;"></i>' +
                        '</template>'
                    );
                    let cancelTab = $node.find("[prop='hrcanceled']");
                    cancelTab.html(
                        '<template scope="scope">' +
                        '<span style="color: #00A753" v-if="scope.row.hrcanceled">是</span>' +
                        '<span  v-if="!scope.row.hrcanceled">否</span>' +
                        '</template>'
                    );
                    let detail = [
                        {
                            title: "联查岗位",
                            icon: "assignment-ind",
                        },
                        {
                            title: "联查人员",
                            icon: "people",
                        }
                    ];

                    var operateHtml = this.getBaseTableOperateHtml(detail, "");
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                search_input: '',
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                // 是否显示批量删除按钮
                showDeleteButton: false,
                // 是否显示删除dialog
                delDialogVisible: false,
                multiDelDialogVisible: false,
                //获取联查参数
                pk_org: this.$route.query['pk_org'],
                org_name: this.$route.query['org_name'],
                dragDialogParams: {
                    cascaderdialogVisible: false,
                    title: "部门排序",
                    cascaderTreeData: [],// 可选择的数据
                    cascaderModel: [],// 可选择的数据默认值
                    placeholdervalue: "请选择部门",
                    orderData: [],// 待排序的所有数据
                    casShow: false,
                }
            };
        },

        mounted() {
//            this.request();
//            var vm = this;
//            vm.getOrgTreeData();
        },
        methods: {
            resetTableHeight(height){
                this.$refs.ref_dept_l.setData('tBodyHeight',height);
            },
            ifbpPageInit(){
//                this.getOrgTreeData();
                this.request(this.currentPage, this.size, this.searchTemplate);
            },
            // 获取树的数据expand-trigger
            getOrgTreeData() {
                this.$http({
                    url: '/hrjf/hrDept/orgCascaderData',
                    method: "get",
//                    data: this.searchTemplate,
                    params: '',
                }).then((res) => {
                    if (res.data.success) {
                        this.orgTreeData = res.data.data.orgtreedata;
                        let defaultnode = res.data.data.defaultorgpk;
                        if (!defaultnode) {
                            defaultnode = this.orgTreeData[0].value;
                        }
                        if ("string" != typeof(defaultnode)) {
                            this.defaultPk_org = defaultnode[defaultnode.length - 1];
                        } else {
                            this.defaultPk_org = defaultnode;
                        }

                        let pk_org = sessionStorage.getItem("deptInfo-pk_org");

                        let orgModel = JSON.parse(sessionStorage.getItem("deptInfo-orgModel"));
                        let page = sessionStorage.getItem("deptInfo-currentPage");
                        let size = sessionStorage.getItem("deptInfo-pageSize");

                        if (pk_org) {
                            this.pk_org = pk_org;
                        } else {
                            this.pk_org = this.defaultPk_org;
                        }
                        if (orgModel) {
                            this.orgModel = orgModel;
                        } else {
                            this.orgModel = [this.defaultPk_org];
                        }
                        // this.$refs.ref_dept_l.setData('isShowCancel',this.isShowCancel);
//                        this.request(page, size, this.searchTemplate);
                    } else if (res.data.error && res.data.error.errorMessage) {
                        console.log('组织数据获取失败', JSON.stringify(res.data.error));
                        this.$message({
                            message: '组织数据获取失败: ' + res.data.error.errorMessage,
                            type: 'error'
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    this.$message.error('请求出错');
                });
            },

            // 格式化树状参照的显示(code + name)
            formatTreeLabel(dataArr) {
                if (!Array.isArray(dataArr)) {
                    return dataArr;
                }
                for (let i = 0; i < dataArr.length; i++) {
                    let refObj = dataArr[i];
                    if (Object.prototype.toString.call(refObj) !== '[object Object]') {
                        continue;
                    }
                    refObj.label = refObj.name;
                    refObj.value = refObj.pk_dept;
                    if (refObj.children && refObj.children.length > 0) {
                        refObj.children = this.formatTreeLabel(refObj.children);
                    } else {
                        refObj.children = null;
                    }
                }
                return dataArr;
            },
            orgChange: function () {
                this.currentPage = 1;

                this.request(this.currentPage, this.size);
            },
            // 请求数据
            request(n, s, stpl) {
                var url;
                url = '/hrjf/hrDept/getLazyParentDept';
                var $pn = '1';
                var $ps = '10';
                if (n !== undefined) {
                    $pn = n,
                        $ps = s
                }
                let param = {
                    showCanceled: this.showCanceled,
                };
                var deptDto = {
                    "pn": $pn,
                    "ps": $ps,
                    "linkCondition": '{"pk_org":"' + this.pk_org + '"}',
                    "searchTemplateAggDto": stpl,
                }
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "JSON",
                    data: deptDto,
                    params: param,
                    contentType: "application/json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_dept_l.setData("isTreeShow", res.data.isTreeShow);
//                            this.$refs.ref_dept_l.setTableData(res.data.data);
                            this.$refs.ref_dept_l.setData(
                                "dept_t",
                                res.data.data
                            );
                            this.totalElements = res.data.data.totalElements;
                            this.size = res.data.data.size;
                            // this.$refs.ref_dept_l.setData('isShowCancel',this.isShowCancel);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },


            requestForSearch(n, s, stpl) {
                var url;
                url = '/hrjf/hrDept/pageList';
                var $pn = '1';
                var $ps = '10';
                if (n !== undefined) {
                    $pn = n,
                        $ps = s
                }
                let param = {
                    showCanceled: this.showCanceled,
                };

                var deptDto = {
                    "pn": $pn,
                    "ps": $ps,
                    "sortColumn": "code",
                    "searchTemplateAggDto": stpl,
                    "linkCondition": '{"pk_org":"' + this.pk_org + '"}',

                }
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "JSON",
                    data: deptDto,
                    params: param,
                    contentType: "application/json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_dept_l.setData("isTreeShow", res.data.isTreeShow);
//                            this.$refs.ref_dept_l.setTableData(res.data.data);
                            this.$refs.ref_dept_l.setData(
                                "dept_t",
                                res.data.data
                            );

                            this.totalElements = res.data.data.totalElements;
                            this.size = res.data.data.size;
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // 跳转到添加页面
            addBaseinfo() {
                this.$router.push({path: '/hrjf/hrDept/deptDetail', query: {pk_org_param: this.pk_org}});
            },
            //部门跨组织转移
            outerShiftClick(){
                var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                this.$refs[this.outerRef].setDialogVisible(true, selectRows);
            },
            //组织内转移
            shiftClick(){
                var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                this.$refs[this.shiftRef].setDialogVisible(true, selectRows);
            },
            //反撤销
            unCancelClick(){
                var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                this.$refs[this.uncancelRef].setDialogVisible(true, selectRows);
            },
            //撤销
            cancelClick(){
                var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                this.$refs[this.cancelRef].setDialogVisible(true, selectRows);
            },
            //更名
            renameClick(){
                var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                this.$refs[this.renameRef].setDialogVisible(true, selectRows);
            },
            // 部门合并弹框可见
            deptMergeClick(){
                var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                this.$refs[this.deptMergeRef].setDialogVisible(true, this.pk_org, selectRows);
            },
            // table行的编辑操作
            deptInfoTableEditClick(scope) {
                var pkUrlDept = scope.row.pk_dept;
                if (pkUrlDept) {
                    this.$router.push({path: '/hrjf/hrDept/deptDetail', query: {id: pkUrlDept}});
                }
            },
            // table行的删除操作
            deptInfoTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.pk_dept = scope.row.pk_dept;
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            // table选中改变
            deptInfoSelectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshList(this.currentPage, this.size, this.searchTemplate);
            },

            //刷新table
            refreshList: function (pn, ps, stpl) {
                this.requestForSearch(pn, ps, stpl);
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },

            // 删除处理
            deleteClick() {
                this.delDialogVisible = false;
                this.$http({
                    url: "/hrjf/hrDept/delete/" + this.pk_dept,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.request(this.currentPage, this.size);
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
                            message: "删除失败",
                            type: "error"
                        });
                    });
            },
            // 部门列表联查岗位按钮
            deptInfoTableLinkAssignment: function (scope) {
                // this.$router.push('/hrjf/post/?pk_dept=' + scope.row.pk_dept)
                let orgName = scope.row.beanMap.pk_org_ref ? scope.row.beanMap.pk_org_ref[scope.row.pk_org]["name"] : "";
                let $url = '/hrjf/post/postJoinInfo?funcode=60050post&pk_dept=' + scope.row.pk_dept + '&dept_name=' + scope.row.name + "&org_name=" + orgName;
                this.$router.push($url);
            },
            // 部门列表联查人员按钮
            deptInfoTableLinkPsn: function (scope) {
                let orgName = scope.row.beanMap.pk_org_ref ? scope.row.beanMap.pk_org_ref[scope.row.pk_org]["name"] : "";
                let $url = '/hrhi/psndoc?funcode=60070psninfo&pk_org=' + scope.row.pk_org + '&pk_dept=' + scope.row.pk_dept + "&dept_name=" + scope.row.name + "&org_name=" + orgName;
                this.$router.push($url);
            },
            showCancelChange(e){
                // this.isShowCancel = !this.isShowCancel;
                this.request();
            },
            settingBtn() {
                this.$refs.ref_dept_l.setTransferVisible(true);
            },
            handleCommand(command){
                if (command == "outerShiftClick") {
                    var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                    this.$refs[this.outerRef].setDialogVisible(true, selectRows);
                    return;
                }
                if (command == "unCancelClick") {
                    var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                    this.$refs[this.uncancelRef].setDialogVisible(true, selectRows);
                    return;
                }
                if (command == "shiftClick") {
                    var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                    this.$refs[this.shiftRef].setDialogVisible(true, selectRows);
                    return;
                }
                if (command == "deptMergeClick") {
                    var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                    this.$refs[this.deptMergeRef].setDialogVisible(true, this.pk_org, selectRows);
                    return;
                }
                if (command == "renameClick") {
                    var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                    this.$refs[this.renameRef].setDialogVisible(true, selectRows);
                    return;
                }
                if (command == "cancelClick") {
                    var selectRows = this.$refs.ref_dept_l.getTableComp().getSelection();
                    this.$refs[this.cancelRef].setDialogVisible(true, selectRows);
                    return;
                }

            },

            deptDisplayOrder: function () {
                this.getDeptTreeData();
            },
            // 部门排序--参照数据
            getDeptTreeData: function () {
                let params = {
                    pk_org: this.pk_org,
                };
                this.$http({
                    url: "/hrpub/component/common/deptCascader",
                    method: "post",
                    params: params,
                }).then((res) => {
                    if (res.data.status === true) {
                        if (res.data.data.deptTreeData && res.data.data.deptTreeData.length > 0) {
                            this.dragDialogParams.cascaderTreeData = res.data.data.deptTreeData;
//                            let defaultnode = res.data.data.defaultDeptPk;
//                            if (!defaultnode) {
//                                defaultnode = res.data.data.deptTreeData[0].value;
//                            }
//                            if (defaultnode && defaultnode.length > 1) {
//                                this.dragDialogParams.cascaderModel = [defaultnode[defaultnode.length - 1]];
//                            } else {
//                                this.dragDialogParams.cascaderModel = defaultnode;
//                            }
//
//                            let deptModel = JSON.parse(sessionStorage.getItem("deptInfo-deptModel"));
//
//                            if (deptModel  && deptModel.length > 0) {
//                                this.dragDialogParams.cascaderModel = deptModel;
//                            }

                            //查询部门级联数据成功后 拿着默认值查询排序数据
                            this.displayOrder();
                        } else if (res.data.error && res.data.error.errorMessage) {
                            this.$message({
                                message: '数据树获取失败: ' + res.data.error.errorMessage,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                message: '没有待排序数据！',
                                type: 'success'
                            });
                        }
                    }
                }).catch((e) => {
                    this.$message.error('请求出错');
                });
            },
            // 部门排序切换部门时，更新数据
            displayOrder: function (params$pk_dept) {
                this.dragDialogParams.cascaderdialogVisible = true;
                var param$pkDept = "";
                if (params$pk_dept && "string" != typeof(params$pk_dept)) {
                    if (params$pk_dept.length > 0) {
                        param$pkDept = params$pk_dept[params$pk_dept.length - 1];
                    } else {
                        param$pkDept = "";
                    }
                } else if (!params$pk_dept) {
                    param$pkDept = "";
                } else {
                    param$pkDept = params$pk_dept;
                }
                var orgsInfoParams = {
                    pk_org: this.pk_org,
                    pk_fatherorg: param$pkDept
                }
                this.$http({
                    url: '/hrjf/hrDept/getOrderDataByPkOrgOrPkDept',
                    method: 'get',
                    params: orgsInfoParams
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.dragDialogParams.orderData = res.data.data;
                            this.dragDialogParams.cascaderModel = params$pk_dept;
//                            sessionStorage.setItem("deptInfo-deptModel", JSON.stringify(this.dragDialogParams.cascaderModel));
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
                    url: '/hrjf/hrDept/saveDept4DisplayOrder',
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
                            this.request(this.currentPage, this.size);
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

        }
    }
</script>

<style>
    #hrdeptUiId .el-table-attachemnt-icon {
        color: #F7BA2A !important;
    }

    #hrdeptUiId .el-checkbox__inner {
        margin-top: -10px !important;
    }
</style>