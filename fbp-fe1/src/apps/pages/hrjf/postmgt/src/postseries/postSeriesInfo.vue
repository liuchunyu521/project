<!--
  作者：liyn11
  时间：2018-03
  支持：岗位序列信息
-->
<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="岗位序列" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
                <!--<el-button type="primary"  @click="addBaseinfo">新增</el-button>-->
                <!--<el-button type="primary"  @click="multiDeleteDialgShow" v-show="showDeleteButton">删除</el-button>-->
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
            </ifbp-btn-line>

            <!-- UI模板组件 -->
            <ifbp-template ref="ref_postseries_l"
                           tpl-id="postSeriesListTplId"
                           class="uitemplate-no-top"
                           :table-show-menu="false"
                           :tpl-data="tableData"
                           :tplResetFun="postTableResetFun"
                           :methods="formMethods"
                           @selection-change="postSeriesInfoSelectionChange"
                           @edit-table-click="postSeriesInfoTableEditClick"
                           @delete-table-click="postSeriesInfoTableDeleteClick">
            </ifbp-template>
        </ifbp-main-area >
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
        data(){
            const vm = this;
            return{
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
                    title: "设置",
                    command: "setting",
                    iconfont: "ifbp-icon-setting",
                    fn: vm.showHeaderSetting,

                }],
                textAlign: "right",
                tplCode:"postSeriesSearchTpls",
                // 查询模板传入参数
                searchTemplate: {},
                // UI模板传入参数
                // postSeriesInfoTablePk: "0001AA10000000005Q1E",
                tableData: {
                    isTreeShow:true,
                },
                deleteForData:{
                },
                formMethods:{
                    //点击展开符事件
                    loadTreeNodeData(row) {
                        let parentId = row.pk_postseries;
                        this.getLazyChildPsMethod(parentId,row);
                    },
                    getLazyChildPsMethod(parentId,row){
                        var   url = "/hrjf/postSeries/getLazyChildPs";
                        let param = {
//                            sortColumn: 'postseriescode',
                            "parentId": parentId === null ? '': parentId
                        };
                        if(!this.searchTemplate || this.searchTemplate === null){
                            this.searchTemplate = {};
                        }
                        this.$http({
                            url: url,
                            method: "post",
                            data: this.searchTemplate,
                            params:param,
                            contentType:'application/json'
                        })
                            .then((res) => {
                                vm.$refs.ref_postseries_l.getTableComp().setTreeDataByRow( res.data.data, row);
                            })
                            .catch(() => {
                                vm.$message({
                                    message: "信息获取失败",
                                    type: "error"
                                });
                            });
                    },
                    // table行的点击编码进入非编辑详情页
                    postSeriesTableEditClick(scope) {
                        vm.$router.push( "/hrjf/postSeries/postSeriesDetail/"+ scope.row.pk_postseries +"/false");
                    },
                    //停用启用点击事件
                    handleChange(rowData){
                        var postSerieslsysdata = rowData;
                        var url;
                        if(postSerieslsysdata.enablestate === 3){
                            //点击后rowData.enablestate 值已经改变，传到后台会过滤掉已经改变生效状态的VO
                            postSerieslsysdata.enablestate = 2;
                            url =  "/hrjf/postSeries/disEnable";
                        }else {
                            postSerieslsysdata.enablestate = 3;
                            url =  "/hrjf/postSeries/enable";
                        }
                        this.$http({
                            url: url,
                            method: "post",
                            traditional: true,
                            data: {
                                arrUIData:postSerieslsysdata
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
                postTableResetFun: function ($node) {
                    var $table = this.getTableDom($node);

                    //懒加载
                    $table.attr(":table-tree","true");
                    $table.attr(":lazy-tree","true");
                    $node.find("[_id='postseries_l']").attr("v-on:tree-icon-expanded", "loadTreeNodeData");

                    $table.attr(":disable-tooltip","true");
                  //  $node.find("[_id='postseries_l']").attr(":table-tree", "isTreeShow");
                    let code = $node.find("[prop='postseriescode']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop="postSeriesTableEditClick(scope)">{{scope.row.postseriescode}}</a>' +
                        '</template>'
                    );
                    var $enablestate = $node.find("[prop='enablestate']");
                    $enablestate.attr('render-type', 'default');
                    $enablestate.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row)" v-model="scope.row.enablestate"on-color="#4BD762" off-color="#AFAFAF" :on-value="2" :off-value="3" on-text="是" off-text="否"> </el-switch>' +
                        '</template>'
                    );

                    var operateHtml = this.getBaseTableOperateHtml("","");
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                search_input: '',
                // 是否显示批量删除按钮
                showDeleteButton: false,
                // 是否显示删除dialog
                delDialogVisible: false,
                multiDelDialogVisible: false
            };
        },
        created() {
            this.request();
        },
        methods: {
            showHeaderSetting() {
                this.$refs.ref_postseries_l.setTransferVisible(true);
            },
            ifbpPageInit(){
                this.request();
            },
            // 请求数据
            request() {
                var   url = "/hrjf/postSeries/getLazyParentPs";
                let param = {
                    sortColumn: "postseriescode"
                };
                this.$http({
                    url: url,
                    method: "post",
                    data: this.searchTemplate === null ? {}: this.searchTemplate,
                    params: param,
                    contentType:'application/json'
                })
                    .then((res) => {
                        this.$refs.ref_postseries_l.setData("isTreeShow", res.data.isTreeShow);
                        this.$refs.ref_postseries_l.setData(
                            "postseries_t",
                            res.data.data
                        );
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            requestSeriesSearchData() {
                let param = {
                    sortColumn: "postseriescode"
                };
                this.$http({
                    url: "/hrjf/postSeries/getTree",
                    method: "post",
                    data: this.searchTemplate === null ? {}: this.searchTemplate,
                    params: param,
                    contentType:'application/json'
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$refs.ref_postseries_l.setData("isTreeShow", res.data.isTreeShow);
                        this.$refs.ref_postseries_l.setData(
                            "postseries_t",
                            res.data.data
                        );
                    }
                }).catch(() => {
                    this.$message({message: "信息获取失败", type: "error"});
                });
            },
            // 跳转到添加页面
            addBaseinfo() {
                this.$router.push("/hrjf/postSeries/postSeriesDetail");
            },
            // table行的编辑操作
            postSeriesInfoTableEditClick(scope) {
                this.$router.push( "/hrjf/postSeries/postSeriesDetail/"+ scope.row.pk_postseries );
            },
            //单个删除
            postSeriesInfoTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.pk_postseries = scope.row.pk_postseries;
                    this.deleteForData = scope.row;
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            // table选中改变
            postSeriesInfoSelectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            },

            // 跳转到添加页面
            addJoblevelsysDetail() {
                this.$router.push( "/hrjf/joblevelsys/jobLevelSysDetail" );
                },
            multiDeleteDialgShow() {
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

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshList();
            },
            //刷新table
            refreshList: function () {
                this.requestSeriesSearchData();
            },

            // 删除处理
            deleteClick() {
                var  deletePostSingle = this.deleteForData;
                this.delDialogVisible = false;
                var tableSelections = this.$refs.ref_postseries_l
                    .comp.$refs.ref_postseries_l.getSelection();
                this.$http({
                    url: "/hrjf/postSeries/delete"  ,
                    method: "post",
                    data: {
                        arrUIData:deletePostSingle
                    }
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.request();
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
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
            // 批量删除处理
            multiDeleteClick() {
                var tableSelections = this.$refs.ref_postseries_l
                    .comp.$refs.ref_postseries_l.getSelection();
                this.multiDelDialogVisible = false;
                this.$http({
                    url: '/hrjf/postSeries/deletebatch',
                    data:tableSelections,
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
                    this.delDialogVisible = false;
                }).catch(() => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            }
        }
    }
</script>
<style scoped>
</style>