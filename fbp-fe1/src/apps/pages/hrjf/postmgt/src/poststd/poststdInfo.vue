<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="基准岗位" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
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
                <!--<el-button type="text" @click="addPoststdBaseinfo">新增</el-button>-->
                <!--<i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: 3px;"></i>-->
            <!--</div>-->
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_poststd_l"
                           tpl-id="hrjf_poststd_table_tpl"
                           :tpl-data="poststdTableData"
                           :tplResetFun="poststdTableResetFun"
                           :methods="formMethods"
                           :table-show-menu="false"
                           class="uitemplate-no-top"
                           @edit-table-click="poststdTableEditClick"
                           @delete-table-click="poststdTableDeleteClick"
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
        mixins: [pageModelMixin],
        components: {
            IfbpBtnLine,
        },
        data() {

            const vm = this;
            return {
                btnLineTextBtnArr: [{
                    title: "新增",        // 按钮显示文字
                    disabled: false,      // 是否为禁用
                    command: "addPoststdBaseinfo",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                    fn: vm.addPoststdBaseinfo,   // 按钮触发后调用函数
                }],
                btnLineIconBtnArr: [{
                    title: "设置",                // 图标按钮鼠标悬浮显示的文字
                    command: "settingBtn",           // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    iconfont: "ifbp-icon-setting", // 图标按钮的icon 对应的类名;
                    fn: vm.settingBtn,           // 按钮触发后调用的函数;
                }],
                textAlign: "right",
                treeTableTree: [],
                //级联选择器
                selectedTreeNode: [],
                pk_postseries:'',
                notLeafSelect: true,
                // cid: 'pk_post',
                // pid: 'suporior',
                //接受后台判断是否有附件
                reqFileExist: {},
                // 查询模板传入参数
                tplCode: 'postSearchTpls',
                searchTemplate: {},
                delIds: [],
                // UI模板传入参数
                poststdTablePk: "0001AA10000000004V9R",
                poststdTableData: {
                    isTreeShow: true,//数据是否树形展示
                    listDataLazy: [],
                },
                //分页
                totalElements: 0,
                currentPage: 1,
                size: 10,
                formMethods: {
                    // table行中点击编码进入详情的操作
                    poststdInfoTableEditClick(scope) {
                        vm.$router.push("/hrjf/poststd/poststdDetail/" + scope.row.pk_post + "/false");
                    },

                },
                poststdTableResetFun: function ($node) {
                    let $table = this.getTableDom($node);
                    let code = $node.find("[prop='postcode']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop="poststdInfoTableEditClick(scope)">{{scope.row.postcode}}</a>' + '<i  v-show="scope.row.hasfile"   class="ifbp-icon-attach-file" style="color: #5AC8FA ;margin-left:8px ; height: 16px; vertical-align: -19%;"></i>' +
                        '</template>'
                    );
                    var operateHtml = this.getBaseTableOperateHtml(false);
                    $table.append(operateHtml);

                    return $node[0].outerHTML;
                },
                search_input: '',
                //获取部门联查基准岗位URL参数
                pk_dept: this.$route.query['pk_dept']
            };
        },
        created() {
            this.request();
        },
        methods: {
            ifbpPageInit(){
                this.request();
            },
            // 请求数据，改成懒加载查询的是一级数据
            request(n, s){
                let param = {
                    pn: n ? n : '1',
                    ps: s ? s : '10',
                    sortField: 'pk_postseries, postcode',
                    urlParam: {"pk_postseries": this.pk_postseries}
                };
                this.$http({
                    url: '/hrjf/postStd/pageList',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        if (this.$refs.ref_poststd_l && res.data.data.content != null) {
                            this.$refs.ref_poststd_l.setTableData(res.data.data.content);
                        } else {
                            this.$set(this.poststdTableData, "uitemplateTableData", res.data.data.content);
                        }
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            //点击搜索框的查询方法
            requestForSearch() {
                let param = {
                    pn:this.currentPage ? this.currentPage:1,
                    ps:this.size ? this.size:10,
                    sortField: 'pk_postseries, postcode',
                    urlParam: {"pk_postseries": this.pk_postseries}
                };
                this.$http({
                    url: '/hrjf/postStd/pageList',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        if (this.$refs.ref_poststd_l) {
                            // this.$refs.ref_poststd_l.setTableData(res.data.data.content);
                            this.$refs.ref_poststd_l.setTableData(res.data.data.content);
                        } else {
                            this.$set(this.poststdTableData, "uitemplateTableData", res.data.data.content);
                        }
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            handleTreeChange(treeItem) {
                if (Array.isArray(treeItem) && treeItem.length) {
                    this.pk_dept = treeItem[treeItem.length - 1];
                    //this.currentTitle = this.currentApp.label;
//                    this.busitypecode = this.currentFunCode;
                    this.request();
                } else {
                    this.pk_dept = '';
                }
            },


            // table行的编辑操作
            poststdTableEditClick(scope) {
                this.$router.push("/hrjf/poststd/poststdDetail/" + scope.row.pk_post + "/true");
            },
            // table行的删除操作
            poststdTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.pk_post = scope.row.pk_post;
                    if (this.pk_post === undefined) {
                        return;
                    }
                    this.deleteClick(scope.row);
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },

            // 跳转到添加地点页面
            addPoststdBaseinfo() {
                this.$router.push("/hrjf/poststd/poststdDetail");
            },
            //跳转到导入页面暂未实现
            importBaseInfo(){

            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshTableList();
            },

            //刷新table
            refreshTableList: function () {
                this.requestForSearch();
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
                this.currentPage = 1;
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
            },
            // 删除处理
            deleteClick(postStdVO) {
                var pk_id = this.pk_post;
                this.$http({
                    url: '/hrjf/postStd/delete',
                    method: 'post',
                    data: postStdVO
                }).then((res) => {
                    this.delId = "";
                    this.refreshTableList();
                    if (res.data.status === true) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
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
            //列表是否隐藏
            settingBtn() {
                    this.$refs.ref_poststd_l.setTransferVisible(true);
            },
        }
    };
</script>
<style>

</style>
