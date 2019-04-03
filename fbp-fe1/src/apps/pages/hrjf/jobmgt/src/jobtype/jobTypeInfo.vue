<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="职务类别" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <!--<el-button type="primary" class="legacy" @click="addBaseinfo">新增</el-button>-->
            <!--<el-button type="primary" class="legacy" @click="multiDeleteDialogShow" v-show="showDeleteButton">删除</el-button>-->
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
            <!--<div align="right" class="top-button">-->
                <!--<i class="hr-icon-swap_vert" @click="jobDisplayOrder" style="position: relative;top: -4px;"></i>-->
                <!--<i class="ifbp-icon-setting" @click="showHeaderSetting" style="position: relative;top: -4px;"></i>-->
            <!--</div>-->
            <!-- top区域 -->
            <ifbp-btn-line
                    :text-btn-arr="btnLineTextBtnArr"
                    :icon-btn-arr="btnLineIconBtnArr"
                    :text-align="textAlign"
                    :slot-width="0"
                    style="margin-top:-16px;"
            >
            </ifbp-btn-line>
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_jobtype"
                           tpl-id="jobTypeId"
                           :tpl-data="jobTypeTableData"
                           :tplResetFun="jobTypeTableResetFun"
                           :methods="formMethods"
                           :table-show-menu="false"
                           class="uitemplate-no-top"
                           @selection-change="jobTypeSelectionChange"
                           @edit-table-click="jobTypeTableEditClick"
                           @delete-table-click="jobTypeTableDeleteClick">
            </ifbp-template>
            <!--分页组件-->
            <!--      <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
                  </el-pagination>-->
        </ifbp-main-area>
        <drag-dialog 
            :cascaderdialogVisible="dragDialogParams.cascaderdialogVisible"         
            :title="dragDialogParams.title"         
            :cascaderTreeData="dragDialogParams.cascaderTreeData"         
            :cascaderModel="dragDialogParams.cascaderModel"         
            :placeholdervalue="dragDialogParams.placeholdervalue"         
            :orderData="dragDialogParams.orderData"         
            :casShow="dragDialogParams.casShow"         
            @orderData="displayOrder"         
            @orderEndvalue="saveOrderResult"         
            @casdialogVisible="casdialogVisible">
        </drag-dialog>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import dragDialog from '../../../../../common/component/dragdialog.vue';
    import IfbpBtnLine from "ifbp-business/ifbpBtnLine";

    export default {
        components: {
            dragDialog,
            IfbpBtnLine
        },
        mixins : [pageModelMixin],
        data() {
            const vm = this;
            return {
                btnLineTextBtnArr: [
                    {
                        title: "新增",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "addBaseinfo",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.addBaseinfo,   // 按钮触发后调用函数
                    }
                ],
                btnLineIconBtnArr: [{
                    title: "排序",                // 图标按钮鼠标悬浮显示的文字
                    command: "jobDisplayOrder",           // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    iconfont: "hr-icon-swap_vert", // 图标按钮的icon 对应的类名;
                    fn: vm.jobDisplayOrder,           // 按钮触发后调用的函数;
                },{
                    title: "设置",
                    command: "setting",
                    iconfont: "ifbp-icon-setting",
                    fn: vm.showHeaderSetting,

                }],
                textAlign: "right",
                searchTemplate: {},
                // 查询模板传入参数
                tplCode: 'jobTypeSTPL',
                showSelectedTags: false,
                // UI模板传入参数
                // jobTypeTablePk: "0001AA10000000014YKE",
                jobTypeTableData: {
                    isTreeShow:"false",//数据是否树形展示
                },
                formMethods: {
                    //点击展开符事件
                    loadTreeNodeData(row) {
                        let parentId = row.pk_jobtype;
                        this.getLazyChildMethod(parentId,row);
                    },
                    getLazyChildMethod(parentId,row){
                        var  url = '/hrjf/jobType/getLazyChildJobTypes';
                        var jobDto = {
                            "sortColumn": "jobtypecode",
                            "searchTemplateAggDto": vm.searchTemplate
                        };
                        let param = {
                            parentId: parentId
                        };
                        this.$http({
                            url: url,
                            method: "post",
                            dataType: "JSON",
                            data: jobDto,
                            contentType: "application/json",
                            params: param
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    // this.$refs.ref_jobtype.setData(
                                    //     "jobtype_t",
                                    //     res.data.data
                                    // );
                                    vm.$refs.ref_jobtype.getTableComp().setTreeDataByRow( res.data.data, row);
                                    vm.totalElements = res.data.data.totalElements;
                                    vm.size = res.data.data.size;
                                    vm.$refs.ref_jobtype.setData("isTreeShow", res.data.isTreeShow);

                                }else {
                                    vm.$message({message: res.data.msg, type: "error"});
                                }
                            })
                            .catch((e) => {
                                vm.$message({
                                    message: "信息获取失败"+e,
                                    type: "error"
                                });
                            });
                    },


                    // table行的点击编码进入非编辑详情页
                    linkDetailPage(scope) {
                        vm.$router.push("/hrjf/jobType/jobTypeDetail/" + scope.row.pk_jobtype + "/false");
                    },
                    handleChange(rowData){
                        var jobtypedata = rowData;
                        var url;
                        if (jobtypedata.enablestate === 3) {
                            //点击后rowData.enablestate 值已经改变，传到后台会过滤掉已经改变生效状态的VO
                            jobtypedata.enablestate = 2;
                            url = "/hrjf/jobType/disEnable";
                        } else {
                            jobtypedata.enablestate = 3;
                            url = "/hrjf/jobType/enable";
                        }
                        this.$http({
                            url: url,
                            method: "post",
                            traditional: true,
                            data: {
                                arrUIData: jobtypedata
                            }
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    //需要将返回的值赋值给页面，否则页面没反应
                                    rowData.enablestate = res.data.data.enablestate;
                                    //ts若不重新赋值给前台界面，界面不能再次修改。
                                    rowData.ts = res.data.data.ts;
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: "失败",
                                    type: "error"
                                });
                            });
                    }
                },
                jobTypeTableResetFun: function ($node) {
                    var $tableDom = this.getTableDom($node);

                    //懒加载
                    $tableDom.attr(":table-tree","true");
                    $tableDom.attr(":lazy-tree","true");
                    $tableDom.attr("v-on:tree-icon-expanded", "loadTreeNodeData");

                  //  $node.find("[_id='jobtype_l']").attr(":table-tree", "isTreeShow");
                    let code = $node.find("[prop='jobtypecode']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop="linkDetailPage(scope)">{{scope.row.jobtypecode}}</a>' +
                        '</template>'
                    );
                    let $enablestate = $node.find("[prop='enablestate']");
                    $enablestate.attr('render-type', 'default');
                    $enablestate.html(
                        '<template scope="scope">' +
                        '<el-switch @change="handleChange(scope.row)" v-model="scope.row.enablestate"  on-color="#4BD762" off-color="#AFAFAF" :on-value="2" :off-value="3" on-text="是" off-text="否">' +
                        '</el-switch></template>'
                    );
                    var operateHtml = this.getBaseTableOperateHtml();
                    $tableDom.append(operateHtml);
                    return $node[0].outerHTML;
                },

                // 是否显示批量删除按钮
                showDeleteButton: false,
                dragDialogParams:{
                    cascaderdialogVisible:false,
                    title:"职务排序",
                    cascaderTreeData:[],// 可选择的数据
                    cascaderModel:[],// 可选择的数据默认值
                    placeholdervalue:"请选择职务",
                    orderData:[],// 待排序的所有数据
                    casShow:false,
                }
            };
        },
        created() {
            this.request();
        },
        methods: {
            showHeaderSetting() {
                this.$refs.ref_jobtype.setTransferVisible(true);
            },
            jobDisplayOrder () {
                this.dragDialogParams.cascaderdialogVisible = true;
                this.displayOrder();
            },
            displayOrder() {
                this.$http({
                    url: '/hrjf/jobType/getOrderDataByPkOrg',
                    method: 'get'
                }).then((res) => {
                    if (res.data.status === true) {
                        this.dragDialogParams.orderData = res.data.data;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '获取数据失败！',
                        type: 'error'
                    });
                });
            },
            // 取消弹窗
            casdialogVisible() {
                this.dragDialogParams.cascaderdialogVisible = false;
            },
            //保存排序后数据
            saveOrderResult: function (orderValue) {
                this.saveDept4DisplayOrder(orderValue);
                this.dragDialogParams.cascaderdialogVisible = false;
            },
            saveDept4DisplayOrder: function (orderValue) {
                this.$http({
                    url: '/hrjf/jobType/saveJobType4DisplayOrder',
                    method: 'post',
                    data:JSON.parse(JSON.stringify(orderValue)),
                    dataType: "application/json"
                }).then((res) => {
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
                }).catch(() => {
                    this.$message({
                        message: '获取数据失败！',
                        type: 'error'
                    });
                });
            },
            ifbpPageInit(){
                this.request(this.currentPage, this.size, this.searchTemplate);
            },
            // 请求数据
            request(n, s, stpl) {
                var url;
                url = '/hrjf/jobType/getLazyParJobTypes';
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
                    "sortColumn": "jobtypecode,displayorder",
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
                        if (res.data.status === true) {
                            this.$refs.ref_jobtype.setData(
                                "jobtype_t",
                                res.data.data
                            );
                            this.totalElements = res.data.data.totalElements;
                            this.size = res.data.data.size;
                            this.$refs.ref_jobtype.setData("isTreeShow", res.data.isTreeShow);

                        }else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败"+e,
                            type: "error"
                        });
                    });
            },
            requestForSearch(n, s, stpl) {
                var url;
                url = '/hrjf/jobType/pageList';
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
                    "sortColumn": "jobtypecode",
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
                        if (res.data.status === true) {
                            this.$refs.ref_jobtype.setData(
                                "jobtype_t",
                                res.data.data
                            );
                            this.totalElements = res.data.data.totalElements;
                            this.size = res.data.data.size;
                            this.$refs.ref_jobtype.setData("isTreeShow", res.data.isTreeShow);

                        }else {
                            this.$message({message: res.data.msg, type: "error"});
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败"+e,
                            type: "error"
                        });
                    });
            },

            // table行的编辑操作
            jobTypeTableEditClick(scope) {
                this.$router.push("/hrjf/jobType/jobTypeDetail/" + scope.row.pk_jobtype);
            },
            // table行的删除操作
            jobTypeTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.delId = scope.row.pk_jobtype;
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
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
                    this.delId = scope.row.pk_jobtype;
                    this.multiDeleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },

            // table选中改变
            jobTypeSelectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            },

            // 跳转到添加地点页面
            addBaseinfo() {
                this.$router.push("/hrjf/jobType/jobTypeDetail");
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshList(this.currentPage, this.size, searchTemplate);
            },

            //刷新table
            refreshList: function (pn, ps, stpl) {
                // this.request(pn, ps, stpl);
                this.requestForSearch(pn,ps,stpl)
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request();
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request();
            },
            // 删除处理
            deleteClick() {
                this.$http({
                    url: '/hrjf/jobType/delete/' + this.delId,
                    method: 'post'
                }).then((res) => {
                    this.delId = "";
                    if (res.data.status === true) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.delIds = "";
                }).catch((e) => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },

            // 批量删除处理
            multiDeleteClick() {
                var tableSelections = this.$refs.ref_jobtype.comp.$refs.ref_jobtype_l.getSelection();
                var delIds = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        var id = row.pk_jobtype;
                        delIds.push(id);
                    }
                }
                this.$http({
                    url: '/hrjf/jobType/delete/' + delIds,
                    params: {delIds},
                    method: 'post'
                }).then((res) => {
                    if (res.data.status === true) {
                        this.delIds = "";
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.delIds = "";
                }).catch((e) => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            }
        }
    };
</script>
<style>

</style>
