<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="职级类别"  v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <!--<el-button type="primary" class="legacy" @click="addJoblevelsysDetail">新增</el-button>-->
            <!--<el-button class="legacy" @click="multiDeleteDialogShow" v-show="showDeleteButton">删除</el-button>-->
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
                <!-- UI模板组件 -->
                <ifbp-template ref="ref_joblevelsys_l"
                               tpl-id="joblevelsysinfoId"
                               :tpl-data="tableData"
                               :tplResetFun="joblevelsysTableResetFun"
                               :methods="formMethods"
                               :table-show-menu="false"
                               class="uitemplate-no-top"
                               @selection-change="joblevelsysSelectionChange"
                               @edit-table-click="joblevelsysTableEditClick"
                               @delete-table-click="joblevelsysTableDeleteClick">
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
                        command: "addJoblevelsysDetail",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.addJoblevelsysDetail,   // 按钮触发后调用函数
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
                tplCode: 'jobLevelSysSTPL',
                searchTemplate:{},
                showSelectedTags: false,
                // UI模板传入参数
                // pk_temptable: "0001AA1000000000WLMD",
                tableData: {},
                formMethods: {
                    // table行的点击编码进入非编辑详情页
                    linkDetailPage(scope) {
                        vm.$router.push("/hrjf/jobLevelSys/jobLevelSysDetail/" + scope.row.pk_joblevelsys + "/false");
                    },

                    handleChange(rowData){
                        var joblevelsysdata = rowData;
                        var url;
                        var errmsg;
                        if (joblevelsysdata.enablestate === 3) {
                            //点击后rowData.enablestate 值已经改变，传到后台会过滤掉已经改变生效状态的VO
                            joblevelsysdata.enablestate = 2;
                            url = "/hrjf/jobLevelSys/disEnable";
                            errmsg = "启用";
                        } else {
                            joblevelsysdata.enablestate = 3;
                            url = "/hrjf/jobLevelSys/enable";
                            errmsg = "停用";
                        }
                        this.$http({
                            url: url,
                            method: "post",
                            traditional: true,
                            data: {
                                arrUIData: joblevelsysdata
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
                                    message:  errmsg + "失败，请稍后重试！",
                                    type: "error"
                                });
                            });
                    }
                },
                joblevelsysTableResetFun: function ($node) {
                    let code = $node.find("[prop='code']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop ="linkDetailPage(scope)">{{scope.row.code}}</a>' +
                        '</template>'
                    );
                    let $enablestate = $node.find("[prop='enablestate']");

                    $enablestate.attr('render-type', 'default');
                    $enablestate.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row)" v-model="scope.row.enablestate" on-color="#4BD762" off-color="#AFAFAF" :on-value="2" :off-value="3" on-text="是" off-text="否"> </el-switch>' +
                        '</template>'
                    );
                    var $table = this.getTableDom($node);
                    var operateHtml = this.getBaseTableOperateHtml();
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
            };
        },
        created() {
//            this.getSearchData();
            this.request();
        },
        methods: {
            showHeaderSetting() {
                this.$refs.ref_joblevelsys_l.setTransferVisible(true);
            },
            ifbpPageInit(){
                this.request(this.currentPage, this.size, this.searchTemplate);
            },
            // 请求数据
            request(n, s, stpl)
            {
                var url;
                url = '/hrjf/jobLevelSys/pageList';
                var $pn = '1';
                var $ps = '10';
                if (n !== undefined) {
                    $pn = n,
                        $ps = s
                }
                ;
                var jobLevelSysDto = {
                    "pn": $pn,
                    "ps": $ps,
                    "sortColumn": "code",
                    "searchTemplateAggDto": stpl
                }
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "JSON",
                    data: jobLevelSysDto,
                    contentType: "application/json"
                })
                    .then((res) => {
                        this.$refs.ref_joblevelsys_l.setData(
                            "om_joblevelsys_t",
                            res.data.data.content
                        );
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            }
            ,
            // table行的编辑操作
            joblevelsysTableEditClick(scope)
            {
                this.$router.push("/hrjf/jobLevelSys/jobLevelSysDetail/" + scope.row.pk_joblevelsys);
            }
            ,
            // table行的删除操作
            joblevelsysTableDeleteClick(scope)
            {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.pk_joblevelsys = scope.row.pk_joblevelsys;
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            }
            ,

            // 批量删除点击处理
            multiDeleteDialogShow()
            {
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
            }
            ,
            // table选中改变
            joblevelsysSelectionChange(selection)
            {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            }
            ,

            // 跳转到添加页面
            addJoblevelsysDetail()
            {
                this.$router.push("/hrjf/jobLevelSys/jobLevelSysDetail");
            }
            ,

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate)
            {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshList(this.currentPage, this.size, searchTemplate);
            }
            ,

            //刷新table
            refreshList: function (pn, ps, stpl) {
                this.request(pn, ps, stpl);
            }
            ,

            // 翻页标签改变每页显示数据
            handleSizeChange(val)
            {
                this.request(1, val);
            }
            ,

            // 翻页标签改变当前页
            handleCurrentChange(val)
            {
                this.currentPage = val;
                this.request(val, this.size);
            }
            ,

            // 删除处理
            deleteClick()
            {
                this.$http({
                    url: "/hrjf/jobLevelSys/delete/" + this.pk_joblevelsys,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.request(this.currentPage, this.size);
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                        }else{
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
            }
            ,

            // 批量删除处理
            multiDeleteClick()
            {
                var tableSelections = this.$refs.ref_joblevelsys_l
                    .comp.$refs.ref_joblevelsys_l.getSelection();
                var delIds = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        var id = row.pk_joblevelsys;
                        delIds.push(id);
                    }
                }
            }
        }
    };
</script>
<style>

</style>