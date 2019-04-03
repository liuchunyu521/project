<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="定薪调薪" style="display:inline-block;"></ifbp-breadcrumb>
        <!-- <span style="float:right;color: #5CB0E6;font-size: 14px;cursor:pointer; " @click="showBill">调薪单据</span> -->

        <!-- 按钮区域 -->
        <ifbp-button-area>
            <el-button type="primary" :disabled="appPsnBtnDisable" @click="addPsndocWadoc">
                定薪调薪
            </el-button>
            <el-button type="default" @click="putiao">薪资普调</el-button>



            <!--<el-dropdown @command="handleCommand" menu-align="start" style="margin-left:10px;position: relative;top:3px;margin-right:10px ">-->
                <!--<el-button >-->
                    <!--<span style="position: relative;bottom: 3px;left: 6px;right:6px">发起申请</span><i class="el-icon-caret-bottom el-icon&#45;&#45;right" style="margin-left: 6px;margin-right:6px"></i>-->
                <!--</el-button>-->

                <!--<el-dropdown-menu slot="dropdown">-->
                    <!--<el-dropdown-item command="specialApply">个别调薪申请</el-dropdown-item>-->
                    <!--<el-dropdown-item command="allApply">薪资普调申请</el-dropdown-item>-->
                <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!-- <el-button type="default" @click="specialApply">调薪申请</el-button> -->

            <el-button type="default" @click="exportExcelTemp">导出</el-button>


            <el-upload
            ref="upload"
            :action="'/hrwa/psndocwadoc/importExcelTemp'"
            :show-file-list="false"
            :auto-upload="true"
            accept=".xls,.xlsx"
            :file-list="filelist"
            class="upload"
            :on-success="handleUploadSuccess"
            >
                <el-button type="default" slot="trigger">导入</el-button>
            </el-upload>
            <!--<el-button type="primary" class="button-no-radius" @click="importwadoc">导入</el-button>-->
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="psndocwadocSearchCode"
                         @search="handleSearch">
            </ifbp-search>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_psndocwadoc_l"
                           tpl-id="listPanel"
                           class="uitemplate-no-top"
                          
                           :tpl-data="psndocWadocData"
                           
                           :editable="true"
                           :tplResetFun="psndocwadocTableResetFun"
                           :methods="psndocwadocTableMethods"
                           @selection-change="psndocwadocSelectionChange"
                           @edit-table-click="psndocwadocTableEditClick"
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

        <ifbp-del-dialog
                v-model="delDialogVisible"
                message="确认删除该数据？删除后无法恢复。"
                @click="deleteClick"
        >
        </ifbp-del-dialog>
    </ifbp-page>
</template>

<script>
// 引入页面定制需要的方法
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
    mixins: [pageModelMixin],

    data() {
        let vm = this;
        return {
            filelist: [],
            // UI模板传入参数
            appPsnBtnDisable: false,
            psndocwadocSearchCode: "60130adjmtc",
            searchTemplate: {},
            psndocWadocData: {},
            psndocwadocTableResetFun: function ($node) {
                var $table = this.getTableDom($node);
                $table.attr('v-on:row-dblclick', 'psndocwadocDbClick');

                // 人员编码
                let code = $node.find("[prop='psnCode']");
                code.html(
                    '<template scope="scope">' +
                    '<a href="javascript:void(0);" @click="psndocwadocPsnClick(scope)">{{scope.row.psnCode}}</a>' +
                    '</template>'
                );
                // var operateArr = [{
                //     title: '编辑',
                //     icon: 'edit'
                // }];
                // var operateHtml = this.getTableOperateHtml(operateArr);
                // $table.append(operateHtml);

                return $node[0].outerHTML;
            },
            psndocwadocTableMethods: {
                psndocwadocDbClick(row) {
                    //location.hash = "/hrwa/psndocwadoc/edit" ;
                    $('.tooltip-normal').hide();
                    vm.$router.push("/hrwa/psndocwadoc/edit");

                    sessionStorage.setItem('pk_psndoc', row.pk_psndoc);
                    sessionStorage.setItem('pk_psnjob', row.pk_psnjob);
                },
                psndocwadocPsnClick(scope) {
                    vm.$router.push("/hrwa/psndocwadoc/edit");
                    sessionStorage.setItem('pk_psndoc', scope.row.pk_psndoc);
                    sessionStorage.setItem('pk_psnjob', scope.row.pk_psnjob);
                }

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
            pk_wa_class: "",
            delData: null,
            pk_psndoc: null
        };
    },
    created() {
        // var page = sessionStorage.getItem("psndocwadoc-currentPage");
        // var size = sessionStorage.getItem("psndocwadoc-pageSize");

        // if (size == null || size == undefined) {
        let size = this.size;
        // }
        // if (page == null || page == undefined) {
        let page = this.currentPage;
        // }
        this.request(page, size);
        this.size = parseInt(size);
        this.currentPage = parseInt(page);

    },
    methods: {
        handleUploadSuccess(res, file) {
            if (res.status === true) {
                this.$message({
                    message: res.msg,
                    type: "success"
                });
            } else {
                this.$message({
                    message: res.msg,
                    type: "error"
                });
            }

        },

        ifbpPageInit() {
            this.request(this.currentPage, this.size);
        },
        importExcelTemp() {

        },
        exportExcelTemp() {
            // window.location.href =  "/hrwa/psndocwadoc/downloadExcelTemp?funcode=60130adjmtc";
            this.$http({
                url: "/hrwa/psndocwadoc/downloadExcelTemp?funcode=60130adjmtc",
                method: "post",
                data: this.searchTemplate,
                headers: {
                    'Content-type': 'application/json'
                },
                responseType: 'arraybuffer'
            })
                .then((res) => {
                    var blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    var objectUrl = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display:none');
                    a.setAttribute('href', objectUrl);
                    a.setAttribute('download', 'psndocwadoc');
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                })
                .catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
        },
        request(n, s) {

            var url = "/hrwa/psndocwadoc/pageList";

            let param = {
                pn: n || 1,
                ps: s || 10,

            };
            this.$http({
                url: url,
                method: "post",
                data: this.searchTemplate,
                params: param,
            })
                .then((res) => {

                    if (this.$refs.ref_psndocwadoc_l) {
                        this.$refs.ref_psndocwadoc_l.setTableData(res.data.data.content);
                    } else {
                        this.$set(this.psndocWadocData, "uitemplateTableData", res.data.data.content);
                    }

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
        psndocwadocTableEditClick(scope) {
            this.$router.push("/hrwa/psndocwadoc/edit");
            sessionStorage.setItem('pk_psndoc', scope.row.pk_psndoc);
            sessionStorage.setItem('pk_psnjob', scope.row.pk_psnjob);
        },

        // table选中改变
        psndocwadocSelectionChange(selection) {
            if (selection && selection.length === 0) {
                this.appPsnBtnDisable = false;
                this.pk_psndoc = null;
            } else if (selection.length === 1) {
                this.pk_psndoc = selection[0].pk_psndoc;
                this.appPsnBtnDisable = false;
            } else {
                this.appPsnBtnDisable = true;
                this.pk_psndoc = null;
            }
        },


        // 跳转到添加地点页面
        addPsndocWadoc() {
            this.$router.push("/hrwa/psndocwadoc/edit");
            if (this.pk_psndoc == null) {
                sessionStorage.setItem('pk_psndoc', null);
            }

        },
        putiao() {
            this.$router.push("/hrwa/psndocwadoc/putiao");
            sessionStorage.setItem("psndocwadocSearchDto", JSON.stringify(this.searchTemplate));
        },
        importwadoc() {
            alert("导入");
        },

        // 翻页标签改变每页显示数据
        handleSizeChange(val) {
            this.request(1, val);
            this.size = parseInt(val);
            this.currentPage = 1;
            // sessionStorage.setItem('psndocwadoc-pageSize', this.size);
            // sessionStorage.setItem('psndocwadoc-currentPage', this.currentPage);
        },

        // 翻页标签改变当前页
        handleCurrentChange(val) {
            this.request(val, this.size);
            this.currentPage = parseInt(val);
            // sessionStorage.setItem('psndocwadoc-currentPage', this.currentPage);
        },

        handleSearch(searchTemplate) {
            this.searchTemplate = searchTemplate;
            this.request(this.currentPage, this.size);
        },
        showBill() {
            //                var queryParma = {funcode:'60130adjapply' };
            this.$router.push("/hrwa/adjustapply/adjustapplyinfo?funcode=60130adjapply");
        },
        specialApply() {
            //                var queryParma = {funcode:'60130adjapply' };
            this.$router.push("/hrwa/adjustapply/adjustApplyAdd?funcode=60130adjapply");
        },
        handleCommand(command) {

            if ("specialApply" == command) {

                var queryParma = { funcode: '60130adjapply' };
                this.$router.push({ path: "/hrwa/psndocwadoc/adjustApplyCard", query: queryParma });
            }
        },
        // 删除处理s
        deleteClick() {
            this.delDialogVisible = false;
            if (this.pk_wa_class === undefined) {
                return;
            }
            this.$http({
                url: "/hrwa/psndocwadoc/delete",
                method: "post",
                data: this.delData
            })
                .then((res) => {
                    if (res.data.status === true) {
                        //alert("222222");
                        this.request(this.currentPage, this.size);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.$message({
                        message: "基本信息详情获取失败",
                        type: "error"
                    });
                });
        }
    }
};
</script>
<style>
.upload {
  display: inline;
  margin-left: 12px;
}
</style>

