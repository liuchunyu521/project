<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="薪资规则"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area>
            <el-button type="primary" @click="addWaRule">新增</el-button>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_WageformVO_l"
                           class="uitemplate-no-top"
                           tpl-id="hrwa_warule_list"
                           :tpl-data="tableData"
                           :methods="ruleTableMethods"
                           :tpl-reset-fun="tableResetFun"
                           @edit-table-click="tableEditClick"
                           @delete-table-click="tableDeleteClick">
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

    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        data() {
            let vm = this;
            return {
                tableData: {},
                tableResetFun: function ($node) {

                    var $codecol = $node.find("[prop='code']");
                    $codecol.attr('render-type', 'default');
                    $codecol.html(
                        '<template scope="scope"><a href="javascript: void(0);" :pk="scope.row.pk_wa_wageform" @click="showDetail(scope.row)">{{scope.row.code}}</a></template>'
                    );

                    let $table = $node.find("el-table");
                    var operateHtml = this.getBaseTableOperateHtml();
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                hasGroupPower: false,
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                delData: {},

                //模板组件内方法
                ruleTableMethods: {
                    showDetail(row){
//            let pk = $(event.target).attr("pk");
                        vm.$router.push("/hrwa/warule/detail/" + row.pk_wa_wageform + "/0/" + row.name);
                    },
                },
            };
        },
        created() {
            this.request();
        },
        methods: {
            ifbpPageInit(){
                this.request(this.currentPage, this.size);
            },
            // 请求数据
            request(n, s) {
                var pn = !n ? 1 : n;
                var ps = !s ? 10 : s;
                var url = "/hrwa/warule/pageList?pn=" + pn + "&ps=" + ps;
                let myself = this;
                let svr = this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                });
                svr.then((res) => {
                    if (res.data.status === true) {
                        myself.$refs.ref_WageformVO_l.setData("WageformVO_t", res.data.data.content);
                        myself.totalElements = res.data.data.totalElements;
                        myself.size = res.data.data.size;
                        myself.currentPage = res.data.data.number;
                        myself.hasGroupPower = res.data.hasGroupPower;
                    } else {
                        myself.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
            },

            // table行的编辑操作
            tableEditClick(scope) {
                if (!this.hasGroupPower) {
                    let pk_group = this.$context.getFbpGroupPk();
                    if (scope.row.pk_org == pk_group) {
                        this.$confirm('您没有权限编辑集团数据。', '提示', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            closeOnClickModal: false,
                            type: 'error'
                        });
                        return;
                    }
                }
                this.$router.push("/hrwa/warule/detail/" + scope.row.pk_wa_wageform + "/1/" + scope.row.name);
            },
            // table行的删除操作
            tableDeleteClick(scope) {
                if (!this.hasGroupPower) {
                    let pk_group = this.$context.getFbpGroupPk();
                    if (scope.row.pk_org == pk_group) {
                        this.$confirm('您没有权限删除集团数据。', '提示', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            closeOnClickModal: false,
                            type: 'error'
                        });
                        return;
                    }
                }

                this.delData = scope.row;

                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.deleteClick();
                }).catch(() => {
                });
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },

            // 跳转到添加地点页面
            addWaRule() {
                this.$router.push("/hrwa/warule/detail");
            },

            // 删除处理
            deleteClick() {
                let myself = this;
                let svr = this.$http({
                    url: "/hrwa/warule/delete",
                    method: "post",
                    data: JSON.parse(JSON.stringify(this.delData))
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        myself.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        myself.request();
                    } else {
                        myself.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    myself.$message({
                        message: "删除失败",
                        type: "error"
                    });
                });
            },
        }
    };
</script>
<style>
</style>
