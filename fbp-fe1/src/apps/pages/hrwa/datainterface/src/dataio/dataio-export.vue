<template>
    <ifbp-page id="dataio_export">
        <!--节点title-->
        <ifbp-breadcrumb name="导出" class="breadcrumb" v-show="false"></ifbp-breadcrumb>
        <span class="right_top_label">
            <span>如需调整接口格式，请前往</span>
            <span class="right_top_link" @click="goDataIO">“数据接口”</span>
            <span>进行设计</span>
        </span>
        <!-- 按钮区域 -->
        <ifbp-button-area>
            <span class="iolabel">选择接口:</span>
            <el-select v-model="selio" placeholder="接口名称" class="ioselect" @change="selChg">
                <el-option label="" value=""></el-option>
                <el-option :label="option.vifname" :value="option.pk_dataio_intface"
                           v-for="option in options"></el-option>
            </el-select>
            <el-button type="primary" @click="exportFile" :disabled="!selio">导出</el-button>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <el-table  v-if="selio"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column v-for="item in headItems"
                                 :prop="item.vcontent"
                                 :label="item.vfieldname"
                                 width="150"
                                 separator=","
                                 :render-type="item.ifieldtype=='20' ? 'date' :  (item.ifieldtype=='2' ? (item.iflddecimal == 0 ? 'default':'number') : 'default')"
                                 symbol=""
                                 :format="item.ifieldtype=='20' ? 'YYYY-MM-DD' : ''"
                                 :decimals="item.iflddecimal"
                                 :align="item.ifieldtype=='2' ? 'right' : 'left'">
                </el-table-column>
            </el-table>

            <div v-if="!selio" class="no-data-container">
                <div class="ifbp-icon-search no-data-icon"></div>
                <div class="tip-content">请选择接口类型，进行数据查询</div>
            </div>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        data() {
            var pk_org = this.$route.query.pk_org;
            var pk_wa_class = this.$route.query.pk_wa_class;
            var cyear = this.$route.query.cyear;
            var cperiod = this.$route.query.cperiod;
            const vm = this;
            return {
                pk_org: pk_org,
                pk_wa_class: pk_wa_class,
                cyear: cyear,
                cperiod: cperiod,
                selio: '',
                options: [],
                tableData: [],
                headItems: [],
                dataioEdit: false,
                dataioData: {},
                dataioVif: true,
            };
        },
        computed: {},
        mounted() {
            this.request();
        },
        methods: {
            // 获取数据
            request() {
                var url = "/hrwa/dataio/initExport?pk_org=" + this.pk_org + "&pk_wa_class=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    if (res.data.status === true) {
                        this.options = res.data.data;
                        if (res.data.data.length > 0) {
                            this.selio = res.data.data[0].pk_dataio_intface;
                            this.exportData();
                        }
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });

            },
            exportData(){

                var url = "/hrwa/dataio/exportData?pk=" + this.selio;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    if (res.data.status === true) {
                        this.headItems = res.data.data;
                        this.tableData = res.data.showdata;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
            },
            exportFile(){
                window.location.href = "/hrwa/dataio/downloadExcel?pk=" + this.selio + "&funcode=60130dataitf";
            },
            selChg(){
                if(!this.selio){
                    this.headItems = [];
                    this.tableData = [];
                }else{
                    this.exportData();
                }
            },
            dataioExpand(row, expanded){
                this.dataioVif = !expanded;
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },

            // table行的点击事件
            dataioRowClick(scope){
                this.dataioEdit = false;
            },
            dataioDesignClick(scope){
                this.$router.push("/hrwa/dataio/design/" + scope.row.pk_dataio_intface);
            },
            // table行的编辑操作
            dataioEditClick(scope) {
                this.dataioEdit = true;
                this.$refs.ref_dataio.expandRow(scope.row, scope.$index);
            },
            // table行的删除操作
            dataioDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.dataioDeleteDialogClick(scope.row);
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },

            dataioDeleteDialogClick(row) {
                this.$http({
                    url: '/hrwa/dataio/delete',
                    method: 'post',
                    data: row
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.request(this.currentPage, this.size);
                            this.dataioEdit = false;
                            this.$refs.ref_dataio.formShow = false;
                            this.$refs.ref_dataio.getTableComp().closeExpandRow();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    });
            },

            // form对于数据编辑操作
            dataioFormEditClick(type) {
                this.dataioEdit = true;
            },

            // form的删除操作
            dataioFormDelete(type, row) {
                const $scope = {
                    row: row
                };
                this.dataioDeleteClick($scope);
            },
            // form的保存操作
            dataioFormConfirm() {
                this.$refs.ref_dataio.validate((valid) => {
                    if (valid) {
                        this.save();
                    }
                });
            },
            save(){
                this.$refs.ref_dataio.validate((valid) => {
                    if (valid) {
                        this.realSave();
                    }
                });
            },
            realSave(){
                var editData = this.$refs.ref_dataio.getFormData();
                var pk_dataio_intface = editData.pk_dataio_intface;

                if (!pk_dataio_intface) {
                    editData.cyear = "2018";
                    editData.cperiod = "04";
                }

                this.$http({
                    url: '/hrwa/dataio/savemain',
                    method: 'post',
                    traditional: true,
                    data: editData
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_dataio.clearEdit();
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.dataioEdit = false;
                            this.$refs.ref_dataio.formShow = false;
                            this.$refs.ref_dataio.tableShow = true;
                            this.$refs.ref_dataio.getTableComp().closeExpandRow();
                            this.request(this.currentPage, this.size);
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '保存失败',
                            type: 'error'
                        });
                    });
            },
            // form的取消操作
            dataioFormCancel(type) {
                this.dataioEdit = false;
                if (type === 'form') {
                    this.$refs.ref_dataio.resetFormData();
                    this.$refs.ref_dataio.formShow = false;
                }
            },
            addDataIO(){
                this.dataioEdit = true;
                // 关闭table中的编辑区
                this.$refs.ref_dataio.getTableComp().closeExpandRow();
                // 显示新增区域
                this.$refs.ref_dataio.formShow = true;
                // 重置新增数据
                this.$refs.ref_dataio.resetFormData();
            },
            goDataIO(){
                this.$router.push("/hrwa/dataio");
            },
        }
    };
</script>
<style>
    #dataio_export .breadcrumb {
        display: inline-block;
    }

    #dataio_export .right_top_label {
        float: right;
        color: #333;
        font-size: 14px;
    }

    #dataio_export .right_top_link {
        cursor: pointer;
        color: #5CB0E6;
    }

    #dataio_export .iolabel {
        font-size: 14px;
    }

    #dataio_export .ioselect {
        position: relative;
        display: inline-block;
        padding-left: 5px;
        padding-right: 16px;
        width: 200px;
    }

    #dataio_export .no-data-container {
        padding: 64px 0px;
        text-align: center;
        color: rgb(191, 191, 191);
    }

    #dataio_export .no-data-icon {
        font-size: 92px !important;
        padding-bottom: 36px;
    }

    #dataio_export .tip-content {
        font-size: 20px;
        color: rgb(191, 191, 191);
    }
</style>
