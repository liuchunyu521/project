<template>
    <div class="main-panel">
        <ifbp-breadcrumb name="我的业务"  v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area >
            <ifbp-search class="fr"
                         :template-code="searchCode"
                         @search="handleSearch">
            </ifbp-search>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- <div class="list-main-container clearfix"> -->
            <div align="right" class="top-button">
                <el-button  type="text"  class="ifbp-layout-content-right-button marginleft24"  @click="multiApproveClickDialgShow" v-show="showMultiButton" ><span>批量审批</span></el-button>
                <el-button  type="text"  class="ifbp-layout-content-right-button marginleft24"  @click="multiRejectClickDialgShow" v-show="showMultiButton" ><span>批量驳回</span></el-button>

                <i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -4px;"></i>
            </div>
            <!-- UI模板组件 -->
            <ifbp-template ref="tableRef"
                           tpl-id="tableId"
                           :pk-temp="tablePkTemp"
                           :funnode="tableFunnode"
                           :nexuskey="tableNexuskey"
                           :tpl-data="tableData"
                           show-type="table"
                           :table-show-menu="false"
                           :methods="tableMethods"
                           :tplResetFun="tableResetFun"
                           @selection-change="tableSelectionChange"
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
                    :total="totalElements"
            >
            </el-pagination>
        </ifbp-main-area>
        <!-- </div> -->
    </div>
</template>
<script>
    export default {
        data() {
            var funNode = 'message';//window.vueInstance.$route.query.funcode;
            var vm = this;
            return {
                listUrl: '/hrpub/myBill/pageList/center',
                // 查询模板传入参数
                searchCode: "hrpubMyBill",
                searchData: null,
                // UI模板传入参数
                tablePkTemp: '0001AA10000000020FCT',
                tableFunnode: funNode,
                tableNexuskey: "messageNk",
                tableData: {},
                opinion: "",
                tableMethods: {
                    tableShowClick: function (scope) {
                        var weburl = "";
                        var billType = scope.row.reason3;
                        var billId = scope.row.billid;
                        this.$http({
                            method: "get",
                            url: '/hrpub/myBill/getWebUrl?billType=' + billType + '&billId=' + billId
                        }).then(res => {
                            if (res.data.status === true) {
                                weburl = res.data.data;
                                if (weburl === "") {
                                    this.$message({
                                        message: "地址为空",
                                        type: "error"
                                    });
                                } else {
                                    //                window.open(weburl);
                                    if("{" === weburl.charAt(0)){
                                        vm.$router.push(JSON.parse(weburl));
                                    }else{
                                        vm.$router.push(weburl);
                                    };
                                }
                            }
                        }).catch(() => {
                            this.$message({
                                message: "地址获取失败",
                                type: "error"
                            });
                        });
                    },
                    tableModifyClick: function (scope) {
                        debugger;
                        var weburl = "";
                        var billType = scope.row.reason3;
                        var billId = scope.row.billid;
                        this.$http({
                            method: "get",
                            url: '/hrpub/myBill/getModifyURL?billType=' + billType + '&billId=' + billId
                        }).then(res => {
                            if (res.data.status === true) {
                                weburl = res.data.data;
                                if (weburl === "") {
                                    this.$message({
                                        message: "地址为空",
                                        type: "error"
                                    });
                                } else {
                                    //                window.open(weburl);
                                    if("{" === weburl.charAt(0)){
                                        vm.$router.push(JSON.parse(weburl));
                                    }else{
                                        vm.$router.push(weburl);
                                    };
                                }
                            }
                        }).catch(() => {
                            this.$message({
                                message: "地址获取失败",
                                type: "error"
                            });
                        });

                    },
                    tableDeleteClick: function (scope) {
                        this.$confirm('确认删除编号为【' + scope.row.billno + '】这张单据吗？', '提示')
                            .then(_ => {
                                this.$http({
                                    url: '/hrpub/myBill/dealDeleteAct',
                                    method: 'POST',
                                    params: {
                                        billType: scope.row.reason3,
                                        billId: scope.row.billid,
                                    }
                                }).then((response) => {
                                    if (response && response.data && (response.data.status === true)) {
                                        this.dialogRecall = false;
                                        this.$message({
                                            type: 'success',
                                            message: response.data.msg
                                        });
                                        vm.request();
                                    } else if (response && response.data && (response.data.status === false)) {
                                        this.$message({
                                            type: 'error',
                                            message: response.data.msg
                                        });
                                    }
                                }).catch((error) => {

                                });
                            })
                            .catch(_ => {
                            });

                    },
                    tableCommitClick: function (scope) {
                        this.$confirm('确认提交编号为【' + scope.row.billno + '】这张单据吗？', '提示')
                            .then(_ => {
                                this.$http({
                                    url: '/hrpub/myBill/dealSubmitAct',
                                    method: 'get',
                                    params: {
                                        billType: scope.row.reason3,
                                        billId: scope.row.billid,
                                    }
                                }).then((response) => {
                                    if (response && response.data && (response.data.status === true)) {
                                        this.dialogRecall = false;
                                        this.$message({
                                            type: 'success',
                                            message: response.data.msg
                                        });
                                        vm.request();
                                    } else if (response && response.data && (response.data.status === false)) {
                                        this.$message({
                                            type: 'error',
                                            message: response.data.msg
                                        });
                                    }
                                }).catch((error) => {

                                });
                            })
                            .catch(_ => {
                            });

                    },
                    tableRecallClick: function (scope) {
                        this.$confirm('确认收回编号为【' + scope.row.billno + '】这张单据吗？', '提示')
                            .then(_ => {
                                var obj = {};
                                obj.param_note = 'recall';
                                var param = JSON.stringify(obj);
                                this.$http({
                                    url: '/riart/fbpworkflows/doAction',
                                    method: 'post',
                                    data: {
                                        action: 'recall',
                                        param: param,
                                        billType: scope.row.reason3,
                                        billId: scope.row.billid,
                                        agentuserId:"",
                                        pk_checkflow: ''
                                    }
                                }).then((response) => {
                                    if (response && response.data && (response.data.status === true)) {
                                        this.dialogRecall = false;
                                        let msg = "";
                                        if (response && response.data && (response.data.message === 'success')) {
                                            msg = "收回成功！";
                                        }else{
                                            msg = "收回失败！";
                                        }
                                        this.$message({
                                            type: 'success',
                                            message: msg

                                        });
                                        //请求玩必须刷新界面，否则单据状态不刷新
                                        vm.request();
                                        this.$nextTick(function () {
                                            this.$emit('isRecall', true);
                                        });
                                        vm.isAgree = false;
                                    } else if (response && response.data && (response.data.status === false)) {
                                        this.$message({
                                            type: 'error',
                                            message: response.data.msg
                                        });
                                    }
                                }).catch((error) => {
                                    this.dialogRecall = false;
                                });
                            })
                            .catch(_ => {
                            });
                    },
                },
                tableResetFun: function ($node) {
                    // 增加默认的新增删除按钮
                    var $table = this.getTableDom($node);
                    var $columns = $node.find('el-table-column[prop="billno"]');
                    $columns.html('<template scope="scope"><a href="javascript:;" @click="tableShowClick(scope)" class="op-a">{{scope.row.billno}}</a></template>');
                    var baseOperateArr = [
                        {
                            title: "编辑",
                            click: "tableModifyClick",
                            icon: "edit",
                            vif: "scope.row.status === '-1'"
                        },
                        {
                            title: "删除",
                            click: "tableDeleteClick",
                            icon: "delete",
                            vif: "scope.row.status === '-1'"
                        },
                        {
                            title: "提交",
                            click: "tableCommitClick",
                            icon: "send",
                            vif: "scope.row.status === '-1'"
                        },
                        {
                            title: "收回",
                            click: "tableRecallClick",
                            icon: "undo",
                            vif: "scope.row.status === '3'"
                        },
                        {
                            title: "查看单据",
                            click: "tableShowClick",
                            icon: "view"
                        }
                    ];
                    var operateHtml = this.getTableOperateHtml(baseOperateArr,"");
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },


                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                // 是否显示批量按钮
                showMultiButton: false,
                // 是否显示dialog
                approveDialogVisible: false,
                rejectDialogVisible: false,
                clickDialogVisible: false,
                multiApproveClickDialogVisible: false,
                multiRejectClickDialogVisible: false
            };
        },
        created() {
//    this.request();
        },
        mounted(){
            this.request();
        },

        methods: {

            cancelClick() {
                this.$emit("input", false);
            },
            ifbpPageInit(){
                this.request();
            },
            // 请求数据
            request(curPage, size) {
                var listSearchDto = {
                    pn: curPage || 1,
                    ps: size || this.size,
                    searchTemplateAggDto: this.searchData ? this.searchData : null,
                };
                this.$http({
                    url: this.listUrl,
                    method: "post",
                    data: listSearchDto,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json"
                }).then(res => {
                    if (res.data.status === true) {
                        if (res.data.data.content && res.data.data.content.length) {
                            var vm = res.data.data.content;
                            vm.forEach(function (v, i) {
                                vm[i].reason3 = vm[i].billtype;
                                vm[i].billtype = res.data.addresultMap.billTypeMap[vm[i].billtype];
                            });
                        } else {
                            this.$message({
                                message: "没有查询到您的单据！",
                                type: "success"
                            });
                        }
                    }
                    this.$refs.tableRef.setTableData(vm);
                    this.totalElements = res.data.data.totalElements;
                    this.size = res.data.data.size;
                })
                    .catch(() => {
                        this.$message({
                            message: "列表中包含异常数据！",
                            type: "error"
                        });
                    });
            },
            search(ev) {
                console.log(ev);
            },
            // 查询区点击搜索后的处理
            handleSearch(searchData) {
                if (!searchData) {
                    return;
                }
                this.searchData = searchData;
                this.request();
            },

            // 审批处理
            approveClick() {
                if (this.opinion === "") {
                    this.opinion = '同意';
                }
                var obj = {};
                obj.param_note = this.opinion;
                var em = {};
                em.nolockandconsist = 'Y';
                obj.eParam = em;
                var param = JSON.stringify(obj);
                var data = {
                    action: 'agree',
                    billType: this.approveRow.reason3,
                    billId: this.approveRow.billid,
                    pk_checkflow: this.approveRow.pk_checkflow,
                    param: param
                };
                this.$http({
                    url: "/riart/fbpworkflows/doAction",
                    method: "post",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json"
                })
                    .then(res => {
                        if (res.data.success === true) {
                            this.$message({
                                message: "审批成功",
                                type: "success"
                            });
                            this.approveDialogVisible = false;
                            this.request();
                        } else {
                            this.approveDialogVisible = false;
                            this.$message({
                                message: res.data.error.errorMessage,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.approveDialogVisible = false;
                        this.$message({
                            message: "审批失败",
                            type: "error"
                        });
                    });
            },
            // 驳回处理
            rejectClick() {
                if (this.opinion === "") {
                    this.opinion = '驳回';
                }
                var obj = {};
                obj.param_reject_activity = this.rejectRow.activity_id;
                obj.param_note = this.opinion;
                var param = JSON.stringify(obj);
                var data = {
                    action: 'reject',
                    billType: this.rejectRow.reason3,
                    billId: this.rejectRow.billid,
                    pk_checkflow: this.rejectRow.pk_checkflow,
                    param: param
                };
                this.$http({
                    url: "/riart/fbpworkflows/doAction",
                    method: "post",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json"
                })
                    .then(res => {
                        if (res.data.success === true) {
                            this.$message({
                                message: "驳回成功",
                                type: "success"
                            });
                            this.rejectDialogVisible = false;
                            this.request();
                        } else {
                            this.rejectDialogVisible = false;
                            this.$message({
                                message: res.data.error.errorMessage,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.rejectDialogVisible = false;
                        this.$message({
                            message: "驳回失败",
                            type: "error"
                        });
                    });
            },

            // 批量批准
            multiApproveClickDialgShow() {
                this.multiApproveClickDialogVisible = true;
                vm.opinion = "";
            },
            // 批量驳回
            multiRejectClickDialgShow() {
                this.multiRejectClickDialogVisible = true;
                vm.opinion = "";
            },

            // 批量审批处理
            multiApproveClick() {

                var tableSelections = this.$refs.tableRef.getTableComp().getSelection();
                var billtypes = [];
                var billids = [];
                var pk_checkflows = [];
                var activity_ids = [];
                for (var i = 0; i < tableSelections.length; i++) {
                    billtypes.push(tableSelections[i].reason3);
                    billids.push(tableSelections[i].billid);
                    pk_checkflows.push(tableSelections[i].pk_checkflow);
                    activity_ids.push(tableSelections[i].activity_id);
                }
                var data = {
                    action: 'agree',
//        tableSelections:tableSelections
                    billtypes: billtypes,
                    billids: billids,
                    pk_checkflows: pk_checkflows,
                    activity_ids: activity_ids,
                    param_note: this.opinion
                };
                this.multiApproveClickDialogVisible = false;
                this.$http({
                    url: "/hrpub/myBill/doBatchAction",
                    method: "post",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json"
                })
                    .then(res => {
                        if (res.data.success === true) {
                            this.$message({
                                message: "批量审批成功",
                                type: "success"
                            });

                            this.request();
                        } else {
                            this.$message({
                                message: res.data.error.errorMessage,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "批量审批失败",
                            type: "error"
                        });
                    });
            },

            // 批量驳回处理
            multiRejectClick() {
                var tableSelections = this.$refs.tableRef.getTableComp().getSelection();
                var billtypes = [];
                var billids = [];
                var pk_checkflows = [];
                var activity_ids = [];
                for (var i = 0; i < tableSelections.length; i++) {
                    billtypes.push(tableSelections[i].reason3);
                    billids.push(tableSelections[i].billid);
                    pk_checkflows.push(tableSelections[i].pk_checkflow);
                    activity_ids.push(tableSelections[i].activity_id);
                }
                var data = {
                    action: 'reject',
                    billtypes: billtypes,
                    billids: billids,
                    pk_checkflows: pk_checkflows,
                    activity_ids: activity_ids,
                    param_note: this.opinion
                };
                this.multiRejectClickDialogVisible = false;
                this.$http({
                    url: "/hrpub/myBill/doBatchAction",
                    method: "post",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json"
                })
                    .then(res => {
                        if (res.data.success === true) {
                            this.$message({
                                message: "批量驳回成功",
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.error.errorMessage,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "批量驳回失败",
                            type: "error"
                        });
                    });
            },
// table选中改变
            tableSelectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showMultiButton = true;
                } else {
                    this.showMultiButton = false;
                }
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },
            settingBtn() {
                this.$refs.tableRef.setTransferVisible(true);
            },
        }
    };
</script>
<style>
    #messageCenter {
        width: 100%;
        /*width: 98%;*/
        /*height: 100%;*/
        margin: 0 auto;
        position: relative;
        /*padding: 15px 24px;*/
    }

    #messageCenter .messageheader {
        font-size: 18px;
        padding-bottom: 16px;
        /*line-height: 18px;*/
        /*padding-top: 20px;*/
        /*padding-left: 16px;*/
        /*font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;*/
    }

    #messageCenter .messageheader .sp0 {
        line-height: 18px;
        display: inline-block;
    }

    #messageCenter .handle {
        background: #fff;
        height: 70px;
        line-height: 70px;
        /*padding-left: 20px;*/
    }

    #messageCenter .handle .back,
    #messageCenter .handle .search {
        float: right;
        margin-right: 25px;
    }

    #messageCenter .handle-body {
        margin-top: 10px;
        background: #fff;
        /*padding: 15px 5px;*/
    }

    #messageCenter .handle-body {
        font-size: 14px;
        color: #666666;
    }

    #messageCenter .handle-body ul {
        display: inline-block;
    }

    #messageCenter .handle-body ul li {
        display: inline-block;
        margin: 20px 0 10px 20px;
    }

    #messageCenter .handle-body .setLabel {
        width: 80px;
        display: inline-block;
        text-align: right;
        margin: 20px 0 0 0;
    }

    #messageCenter .handle-body ul li:hover {
        cursor: pointer;
    }

    .active1 {
        background: #1baede;
        color: #fff;
        padding: 2px 6px;
    }

    #messageCenter .tableList {
        margin-top: 20px;
    }

    #messageCenter .block1 .el-pagination {
        float: right;
    }

    #messageCenter .block1 {
        margin-top: 10px;
        margin-bottom: 20px;
    }

    #messageCenter .el-table tr {
        height: 58px !important;
        padding-top: 10px;
    }

    #messageCenter .el-table {
        border: none !important;
    }

    #messageCenter .el-table::after,
    #messageCenter .el-table::before {
        background-color: transparent !important;
    }

    #messageCenter .tableList .mdate {
        font-size: 12px;
        color: #9e9e9e;
        /*padding-top: 15px;*/
    }

    #messageCenter .tableList .content .cell {
        width: 800px;
        font-size: 14px !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        color: #262626 !important;
    }

    #messageCenter .background_grey {
        color: #9e9e9e !important;
    }

    #messageCenter .el-table__empty-block {
        background-color: #eeeff1;
    }
</style>
