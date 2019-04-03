<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="薪资标准"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area>
            <el-button type="primary" @click="addWaGrade">新增</el-button>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_WaGrade_l"
                           class="uitemplate-no-top"
                           tpl-id="hrwa_wagrade_list"
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
            var vm = this;
            return {
                tableData: {},
                tableResetFun: function ($node) {

                    var $codecol = $node.find("[prop='code']");
                    $codecol.attr('render-type', 'default');
                    $codecol.html(
                        '<template scope="scope"><a href="javascript: void(0);" :pk="scope.row.pk_wa_grd" @click="showDetail($event)">{{scope.row.code}}</a></template>'
                    );

                    let $table = $node.find("el-table");
                    var operateHtml = this.getBaseTableOperateHtml();
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                delData: {},
                hasGroupPower: false,

                //模板组件内方法
                ruleTableMethods: {
                    showDetail(event){
                        let pk = $(event.target).attr("pk");
                        vm.$router.push("/hrwa/wagrade/detail/" + pk + "/0");
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

                var url = "/hrwa/wagrade/pageList?pn=" + pn + "&ps=" + ps;
                let myself = this;
                let svr = this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                });
                svr.then((res) => {
                    if (res.data.status === true) {
                        myself.$refs.ref_WaGrade_l.setData("WaGrade_t", res.data.data.content);
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
                this.$router.push("/hrwa/wagrade/detail/" + scope.row.pk_wa_grd + "/1");
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
            addWaGrade() {
                this.$router.push("/hrwa/wagrade/detail");
            },

            // 删除处理
            deleteClick() {
                let _this = this;
                let svr = this.$http({
                    url: "/hrwa/wagrade/delete",
                    method: "post",
                    data: JSON.parse(JSON.stringify(this.delData))
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        _this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        _this.request();
                    } else {
                        _this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    _this.$message({
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
