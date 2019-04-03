<template>
    <div class="peng">
        <ifbp-page>
            <!-- 节点title -->
            <ifbp-breadcrumb name="公共薪资项目"></ifbp-breadcrumb>
            <!-- 按钮区域 -->
            <ifbp-button-area>
                <el-button type="primary" @click="addWaItem">新增</el-button>
                <el-button @click="multiDeleteDialgShow" v-show="showDeleteButton">删除</el-button>

                <!-- 查询模板组件 -->

                <ifbp-search class="fr"
                             :template-code="waitemcode"
                             @search="handleSearch">
                             <!--@ready="setQueryCondition"-->
                </ifbp-search>
            </ifbp-button-area>

            <!-- 主体区域 -->

            <ifbp-main-area type="list">
                <!-- UI模板组件 -->

                <ifbp-template ref="ref_waitem_l"
                               tpl-id="ref_waitem_l"
                               class="uitemplate-no-top"
                               :tpl-data="tableData"
                               :tplResetFun="tableResetFun"
                               :methods="waclassTableMethods"
                               @selection-change="selectionChange"
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


            <!--删除确认Dialog-->
            <ifbp-del-dialog
                    v-model="delDialogVisible"
                    message="确认删除该数据？删除后无法恢复。"
                    @click="deleteClick"
            >
            </ifbp-del-dialog>
            <ifbp-del-dialog
                    v-model="confirmVisible"
                    message="waclassMessage"
                    @click="confirmVisible=false"
            >
            </ifbp-del-dialog>

            <ifbp-del-dialog
                    v-model="multiDelDialogVisible"
                    message="确认删除所选数据？删除后无法恢复。"
                    @click="multiDeleteClick"
            >
            </ifbp-del-dialog>
            <!--删除确认Dialog-->
            <ifbp-del-dialog
                    v-model="delDialogVisible"
                    message="确认删除该数据？删除后无法恢复。"
                    @click="deleteClick"
            >
            </ifbp-del-dialog>
            <ifbp-del-dialog
                    v-model="multiDelDialogVisible"
                    message="确认删除所选数据？删除后无法恢复。"
                    @click="multiDeleteClick"
            >
            </ifbp-del-dialog>

        </ifbp-page>
    </div>
</template>

<script>
    // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins:[pageModelMixin],
        data() {
            var vm = this;
            return {
                // 查询模板传入参数
                waitemcode: '60130glbitem',
                searchTemplate: {},
                // UI模板传入参数
                tablePk: "0001AA1000000000Y89J",
                tableData: {},
                dialogAllotVisible: false,
                confirmVisible: false,
                waclassMessage: "",

                tableResetFun: function ($node) {
                    //插件显示不出来
                    var $table = this.getTableDom($node);
                    $table.attr(':show-header', 'true');
                    $table.attr('v-on:row-dblclick', 'waclassDbClick');
                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit',
                        vif: "scope.row.category_id != '1001Z7100000000WA001'"
                    }, {
                        title: '删除',
                        icon: 'delete',
                        vif: "scope.row.category_id != '1001Z7100000000WA001'"
                    }];

                    // 名称查询
                    let code = $node.find("[prop='code']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click="wacalssNameClick(scope)">{{scope.row.code}}</a>' +
                        '</template>'
                    );

                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                //详情
                waclassTableMethods: {
                    wacalssNameClick(scope) {
                        vm.$router.push("/hrwa/waitem/detail/" + scope.row.pk_wa_item + "/" + false);

                    },

                    waclassDbClick(row){
                        vm.$router.push("/hrwa/waitem/detail/" + row.pk_wa_item + "/" + false);

                    },
                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                // 是否显示批量删除按钮
                showDeleteButton: false,
                // 是否显示删除dialog
                delDialogVisible: false,
                multiDelDialogVisible: false
            };
        },
        created() {
            this.request();
            this.getSearchData();
        },
        methods: {
            ifbpPageInit() {
                this.request(this.currentPage, this.size);
            },
            // 请求数据
            request(n, s) {
                let param = {
                    pn: n || 1,
                    ps: s || 10,

                };
                var url = "/hrwa/waItem/pageList";
                this.$http({
                    url: url,
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                })

                    .then((res) => {
                        this.$refs.ref_waitem_l.setData(
                            "waitem_t",
                            res.data.data.content
                        );

                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                        //alert(res.data.data.number);
                        this.currentPage = res.data.data.number;

                    })
                    .catch(() => {

                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            setItemDataSource(itemtype){
                this.dataSourceOptions = [];
                if (itemtype != 2) {
                    //数据类型不是日期的都可以用公式
                    this.dataSourceOptions.push({value: 0, label: '由公式计算'});
                }

                if (itemtype == 0) {
                    this.dataSourceOptions.push({value: 1, label: '按薪资规则表'});
                }
                this.dataSourceOptions.push({value: 2, label: '手工输入'});

                if (itemtype == 0) {
                    this.dataSourceOptions.push({value: 3, label: '固定值'});
                    this.dataSourceOptions.push({value: 4, label: '按薪资标准表'});
                }


                //  this.dataSource = this.baseData.ifromflag;
                // this.queryParams.itemkey = this.baseData.itemkey;

                switch (this.dataSource) {
                    case 0:
                        this.dataSourceTmeplate[0] = this.createDataSourceTemplate("XXXXXXX", this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 1:
                        this.dataSourceTmeplate[1] = this.createDataSourceTemplate(this.otherBaseData.datasourceitem1, this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 3:
                        if (this.baseData.ifldwidth != null && this.baseData.ifldwidth != undefined) {
                            let fieldWidth = parseInt(this.baseData.ifldwidth, 10);
                            let fieldDecimal = parseInt(this.baseData.iflddecimal, 10);
                            this.dataSourceTmeplate[3].maxlength = fieldWidth + 1 + fieldDecimal;
                            this.dataSourceTmeplate[3].decimals = fieldDecimal;
                        }
                        let text = parseFloat(this.baseData.vformula, 10);
                        this.dataSourceTmeplate[3].text = text;
                        break;
                    case 4:
                        this.dataSourceTmeplate[4] = this.createDataSourceTemplate(this.otherBaseData.datasourceitem4, this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 6:
                        this.dataSourceTmeplate[6] = this.createDataSourceTemplate("OLDID", this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 7:
                        this.dataSourceTmeplate[7] = this.createDataSourceTemplate("OLDID", this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    default :
                        break;
                }
            },


            // 获取查询模板数据
            getSearchData() {
                this.searchTemplate = testSearchTemplate;
            },
            // 查询区点击搜索后的处理
            handleSearch(searchTemplate){
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.request(this.currentPage, this.size);
            },

            advancedSearch(searchTemplate) {
                this.currentPage = 1;
            },


            // table行的编辑操作
            tableEditClick(scope) {

                if (scope.row.category_id == "1001Z7100000000WA001") {
                    this.$alert('系统项目不能修改', {
                        confirmButtonText: '确定',
                    });
                } else {
                    this.$router.push("/hrwa/waitem/detail/" + scope.row.pk_wa_item + "/" + true);
                }

            },
            // table行的删除操作
            tableDeleteClick(scope) {

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
            // table选中改变
            selectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            },

            // 跳转到添加地点页面
            addWaItem(){

                //设置数据来源控件绑定的数据
                this.$router.push("/hrwa/waitem/add");
                this.itemEdit = !this.itemEdit;
                this.setItemDataSource();


            },

            // 批量删除点击处理
            multiDeleteDialgShow() {
                this.multiDelDialogVisible = true;
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
                debugger
                this.delDialogVisible = false;

                this.$http({
                    url: "/hrwa/waItem/delete",
                    method: "post",
                    data: JSON.parse(JSON.stringify(this.delData))
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "删除失败!",
                            type: "error"
                        });
                    });
            },
            // 查询模板设置 fieldcode 对应条件的选项名称
            setQueryCondition(){
                let url = "/hrwa/waItem/queryPeriod";
                this.$http({
                    url: url,
                    method: "post",
                    params: {
                        pk_wa_item: this.pk_wa_item,
                        category_id: this.category_id,
//                        cyear : this.cyear,
//                        cperiod : this.cperiod,
//                        pk_org : this.pk_org
                    },
                }).then((res) => {
                    if (res.data.status === true) {
                        this.periodCondition = res.data.data;
                        let param = {
                            'period': {}
                        };
                        if (this.periodCondition != null && this.periodCondition.length > 0) {
                            for (var i = 0; i < this.periodCondition.length; i++) {
                                param.period[this.periodCondition[i]] = this.periodCondition[i].substr(0, 4) + "/" + this.periodCondition[i].substring(4);
                            }
                        }
                        this.$refs.testSetOption.setOptionsByFieldcode(param);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }

                }).catch(() => {
                    this.$message({
                        message: "查询条件中期间信息获取失败",
                        type: "error"
                    });
                });

            },
            // 批量删除处理
            multiDeleteClick() {
                var tableSelections = this.$refs.ref_waitem_l.comp.$refs.ref_waitem_l.getSelection();
                var delDatas = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        delDatas.push(row);
                    }
                }


                this.$http({
                    url: "/hrwa/waItem/multiDelete",
                    method: "post",
                    data: JSON.parse(JSON.stringify(delDatas))
                })
                    .then(res => {

                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.request();
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

                this.multiDelDialogVisible = false;
            }
        }
    };
</script>
<style>

    .peng .is-center {
        text-align: left !important;
    }
</style>
