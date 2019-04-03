<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="职等" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <!--<el-button type="primary" class="legacy" @click="addJobrankDetail">新增</el-button>-->
            <!--<el-button type="primary" class="legacy" @click="multiDeleteDialogShow" v-show="showDeleteButton">删除-->
            <!--</el-button>-->
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
            </ifbp-btn-line>
            <!-- 主子表 -->
            <ifbp-template ref='ref_jobrank'
                           tpl-id='ref_jobrank'
                           class="uitemplate-no-top"
                           :table-show-menu="false"
                           :tpl-data='jobrankData'
                           :editable='jobrankEdit'
                           @update:editable="updateEvent"
                           @expand="expandEvent"

                           @selection-change="jobRankSelectionChange"
                           :table-oper-vif="tableOperVif"
                           :methods="formMethods"
                           :tplResetFun='jobRankResetFun'
                           :form-show-message='jobrankEdit'
                           :confirm-clear-edit="false"


                           :cancel-button-show="cancelButtonShow"
                           :delete-button-show="deleteButtonShow"

                           @row-click='rowClick'

                           @edit-table-click='jobRankEditClick'
                           @delete-table-click='jobRankTableDeleteClick'

                           @form-edit-click='jobrankPanelFormEditClick'
                           @form-delete-click="jobrankFormDelete"
                           @form-confirm-click='jobRankConfirm'
                           @form-cancel-click='jobrankFormCancel'
            >
            </ifbp-template>

            <!--分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import IfbpBtnLine from "ifbp-business/ifbpBtnLine";

    export default {
        mixins : [pageModelMixin],
        components: {
            IfbpBtnLine
        },
        data() {
            const vm = this;
            return {
                btnLineTextBtnArr: [
                    {
                        title: "新增",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "addJobrankDetail",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.addJobrankDetail,   // 按钮触发后调用函数
                    }
                ],
                btnLineIconBtnArr: [{
                    title: "设置",
                    command: "setting",
                    iconfont: "ifbp-icon-setting",
                    fn: vm.showHeaderSetting,

                }],
                textAlign: "right",
                // 查询模板传入参数
                tplCode: 'jobRankSTPL',
                searchTemplate:{},
                showSelectedTags: false,
                jobrankData: {},

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                // 是否显示批量删除按钮
                showDeleteButton: false,
                delId: '',
                search_input: '',

                jobrankEdit: false,
                pk_jobrank: '',//职等主键
                jobrankEditIndex: -1,//编辑行索引
                formMethods: {
                    // table行的点击编码进入非编辑详情页
//                    jobrankTableEditClick(scope) {
//                        vm.$router.push("/hrjf/jobRank/jobRankDetail/" + scope.row.pk_jobrank + "/false");
//                    },

                    handleChange(rowData){
                        var url;
                        var currentData = rowData;
                        if (currentData.enablestate === 3) {
                            //点击后rowData.enablestate 值已经改变，传到后台会过滤掉已经改变生效状态的VO
                            currentData.enablestate = 2;
                            url = "/hrjf/jobRank/disEnable";
                        } else {
                            currentData.enablestate = 3;
                            url = "/hrjf/jobRank/enable";
                        }
                        this.$http({
                            url: url,
                            method: "post",
                            traditional: true,
                            data: JSON.parse(JSON.stringify(currentData))
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    //需要将返回的值赋值给页面，否则页面没反应
                                    currentData.enablestate = res.data.data[0].enablestate;
                                    //ts若不重新赋值给前台界面，界面不能再次修改。
                                    currentData.ts = res.data.data[0].ts;
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: "处理失败，请稍后重试！",
                                    type: "error"
                                });
                            });
                    }
                },
                jobRankResetFun: function ($node) {
//                    let code = $node.find("[prop='jobrankcode']");
//                    code.html(
//                        '<template scope="scope">' +
//                        '<a href="javascript:void(0);" @click.stop="jobrankTableEditClick(scope)">{{scope.row.jobrankcode}}</a>' +
//                        '</template>'
//                    );
                    let $enablestate = $node.find("[v-if='tableCoulmnVIfenablestate']");
                    //[@change加了stop防止冒泡]
                    $enablestate.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row)"  v-model="scope.row.enablestate"  on-color="#4BD762" off-color="#AFAFAF" :on-value="2" :off-value="3" on-text="是" off-text="否"> </el-switch>' +
                        '</template>'
                    );
                    var $table = this.getNodeById($node, "jobrank_l");
                    var operateHtml = this.getBaseTableOperateHtml( );
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
            };
        },
        computed: {
            cancelButtonShow: function () {
                if (this.jobrankEdit) {
                    return true;
                } else {
                    return false;
                }
            },
            deleteButtonShow: function () {
                if (this.jobrankEdit) {
                    return false;
                } else {
                    return true;
                }
            },
            //如果是编辑态，不显示列后免得编辑按钮
            tableOperVif: function () {
                if (this.jobrankEdit) {
                    return false;
                } else {
                    return true;
                }
            },
        },
        created() {
            this.request();
        },
        methods: {
            showHeaderSetting() {
                this.$refs.ref_jobrank.setTransferVisible(true);
            },
            updateEvent(val){
                this.jobrankEdit = val
            },
            expandEvent(row, expanded) {
                this.tableOperVif = !expanded
            },
            ifbpPageInit(){
                this.request(this.currentPage, this.size, this.searchTemplate);
            },
            // 请求数据
            request(n, s, stpl) {
                var url;
                url = '/hrjf/jobRank/pageList';
                var $pn = '1';
                var $ps = '10';
                if (n !== undefined) {
                    $pn = n,
                        $ps = s
                }
                ;
                var jobDto = {
                    "pn": $pn,
                    "ps": $ps,
                    "sortColumn": "jobrankcode",
                    "searchTemplateAggDto": stpl
                }
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "JSON",
                    data: jobDto,
                    contentType: "application/json"
                })
                    .then((res) => {
                        this.$refs.ref_jobrank.setTableData(res.data.data.content);
//            this.$refs.ref_jobrank.setData(
//              "jobrank_t",
//              res.data.data.content
//            );
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // table行的编辑操作
            jobRankEditClick(scope) {
//          this.$router.push( "/hrjf/jobRank/jobRankDetail/" + scope.row.pk_jobrank );
                // table行的编辑操作
                this.jobrankEdit = true;
                this.$refs.ref_jobrank.expandRow(scope.row, scope.$index);
                // 备份数据
                // this.joblevelBaseData = JSON.parse(JSON.stringify(scope.row));
                // this.joblevelEditIndex = scope.$index;
            },

            // form的删除操作
            jobrankFormDelete(type, row) {
                const $scope = {
                    row: row
                };
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.delId = $scope.row.pk_jobrank;
                    this.deleteClick($scope);
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            // table行的删除dialog
            jobRankTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.delId = scope.row.pk_jobrank;
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },

            // 删除处理
            deleteClick() {
                this.$http({
                    url: '/hrjf/jobRank/delete/' + this.delId,
                    method: 'post'
                }).then((res) => {
                    this.delId = "";
                    if (res.data.status === true) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.$refs.ref_jobrank.clearEdit();
                        this.request(this.currentPage, this.size);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.delIds = "";
                }).catch(() => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },

            // 批量删除处理
            multiDeleteClick() {
                var tableSelections = this.$refs.ref_jobrank.comp.$refs.ref_jobrank_l.getSelection();
                var delIds = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        var id = row.pk_jobrank;
                        delIds.push(id);
                    }
                }
                this.$http({
                    url: '/hrjf/jobRank/delete/' + delIds,
                    params: {delIds},
                    method: 'post'
                }).then((res) => {
                    if (res.data.status === true) {
                        this.delIds = "";
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.request(this.currentPage, this.size);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.delIds = "";
                }).catch(() => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },

            // 批量删除点击处理
            multiDeleteDialogShow() {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.multiDeleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },

            // table选中改变
            jobRankSelectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            },

            // 新增按钮页面
            addJobrankDetail() {
                this.cancelButton = "取消";
                this.isShowMessage = true;
                this.jobrankEdit = true;
                // 关闭table中的编辑区
                this.$refs.ref_jobrank.getTableComp().closeExpandRow();
                // 显示新增区域
                this.$refs.ref_jobrank.formShow = true;
                // 重置新增数据
                this.$refs.ref_jobrank.resetFormData();
//                this.$router.push("/hrjf/jobRank/jobRankDetail");

            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;

                this.refreshList(this.currentPage, this.size, searchTemplate);
            },

            //刷新table
            refreshList: function (pn, ps, stpl) {
                this.request(pn, ps, stpl);
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
                this.currentPage = 1;
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.jobrankEdit = false;
                this.tableOperVif = true;
                this.currentPage = val;
                this.request(val, this.size);
            },

            // table行的编辑操作
            jobrankEditClick(scope) {
                this.jobrankEdit = true;
                this.$refs.ref_jobrank.expandRow(scope.row, scope.$index);
            },

            // 基本信息取消按钮操作
            jobrankCancel() {
                if (this.isNew === true) {
                    this.$context.getApp().back();
//                    this.$router.push("/hrjf/jobRank");
                }
                this.jobRankEdit = false;
//                this.showIcons = this.jobRankIcons;
                if (this.originalValue) {
                    this.$refs.ref_jobrank.setData("jobrank", JSON.parse(JSON.stringify(this.originalValue)));
                } else {
                    this.$refs.ref_jobrank.setData("jobrank",
                        {
//                            jobrankorder: null,
//                            jobrankcode: null,
//                            jobrankname: null,
//                            pk_org: null,
                        });
                }
            },


            rowClick(scope){
                this.jobrankEdit = false;
            },

            // form对于数据编辑操作
            jobrankPanelFormEditClick(type) {
                this.jobrankEdit = true;
                this.cancelButton = "取消";

            },

            // 基本信息保存按钮操作
            jobRankConfirm() {
                var data = this.$refs.ref_jobrank.getData("jobrank");
                if (!data.pk_jobrank) {
                    this.chooseAddOrUpdate = "/hrjf/jobRank/save";
                    this.massageError = "保存失败";
                } else {
                    this.chooseAddOrUpdate = "/hrjf/jobRank/update";
                    this.massageError = "更新失败";
                }
                this.$refs.ref_jobrank.validate((valid) => {
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
//                                    this.$refs.ref_jobrank.setData(
//                                        "jobrank",
//                                        JSON.parse(JSON.stringify(this.originalValue))
//                                    );
                                    this.$refs.ref_jobrank.setTableData(res.data.data);
                                    this.jobrankEdit = false;
                                    this.tableOperVif = true;
                                    //防止新增后点击行时显示“数据被修改提示”
                                    this.$refs.ref_jobrank.clearEdit();
                                    this.$refs.ref_jobrank.resetFormData();
                                    // 关闭table中的编辑区
                                    this.$refs.ref_jobrank.getTableComp().closeExpandRow();
                                    this.$refs.ref_jobrank.formShow = false;
                                    this.request(this.currentPage, this.size)
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
            },

            // form的取消操作
            jobrankFormCancel(type) {
                this.jobrankEdit = false;
//                if (type === 'form') {
//                    this.$refs.ref_jobrank.resetFormData();
//                    this.$refs.ref_jobrank.formShow = false;
//                }
            },
        }
    }
</script>
<style>
</style>
