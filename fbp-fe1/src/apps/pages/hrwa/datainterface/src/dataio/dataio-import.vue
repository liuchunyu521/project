<template>
    <ifbp-page id="dataio_import">
        <!--节点title-->
        <ifbp-breadcrumb name="导入" class="breadcrumb" v-show="false"></ifbp-breadcrumb>
        <span class="right_top_label">
            <span>如需调整接口格式，请前往</span>
            <span @click="goDataIO" class="right_top_link">“数据接口”</span>
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
            <span class="selfile">浏览文件:</span>
            <el-upload
                    :action="'/hrwa/dataio/upload?pk=' + selio + '&funcode=60130dataitf'"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="handleUploadSuccess"
                    :auto-upload="true"
                    accept=".xlsx,.xls"
                    :file-list="[]"
                    class="upload"
                    :disabled="!selio">
                <div>
                    <el-input placeholder="" v-model="address" :disabled="true" class="filepath">
                        <el-button slot="append" icon="search" v-if="selio"></el-button>
                    </el-input>
                </div>
            </el-upload>
            <el-button size="small" type="primary" @click="importData" class="importbtn" :disabled="!address">导入</el-button>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <el-table :data="tableData" style="width: 100%" v-if="selio">
                <el-table-column v-for="item in headItems"
                                 :prop="item.vcontent"
                                 :label="item.vfieldname"
                                 width="150"
                                 :render-type="item.ifieldtype=='20' ? 'date' :  (item.ifieldtype=='2' ? (item.iflddecimal == 0 ? 'default':'number') : 'default')"
                                 symbol=""
                                 :format="item.ifieldtype=='20' ? 'YYYY-MM-DD' : ''"
                                 :decimals="item.iflddecimal"
                                 :align="item.ifieldtype=='2' ? 'right' : 'left'">
                </el-table-column>
            </el-table>
            <div v-if="tableData.length==0" class="no-data-container">
                <div class="ifbp-icon-search no-data-icon"></div>
                <div class="tip-content">请选择接口类型，及您要导入的数据</div>
            </div>
        </ifbp-main-area>

        <el-dialog :close-on-click-modal="false"
                   title="导入项目选择" :show-close="false"
                   v-model="selItemDialogVisible" size="small">
            <ifbp-template ref="ref_dataio_selitem"
                           class="uitemplate-no-top"
                           tpl-id="hrwa_dataio_selitem"
                           :table-show-menu="false">
            </ifbp-template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selItemDialogVisible=false;">取消</el-button>
                <el-button @click="confirmSelItem" type="primary">确定</el-button>
            </span>
        </el-dialog>
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
                dataioData: {},
                address: '',
                selItemDialogVisible: false,
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
                            this.listTitleData();
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
            listTitleData(){

                var url = "/hrwa/dataio/importTitle?pk=" + this.selio;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    if (res.data.status === true) {
                        this.headItems = res.data.data;
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
            selChg(){
                this.listTitleData();
            },

            handleUploadSuccess(res, file){
                this.tableData = res.data;
            },
            beforeUpload(file){
                var fileName = file.name;
                if (fileName.lastIndexOf(".xls") == fileName.length - 4 || fileName.lastIndexOf(".xlsx") == fileName.length - 5) {
                    this.address = fileName;
                    return true;
                }
                this.$message({
                    message: "请选择Excel文件上传！",
                    type: "error"
                });
                return false;
            },

            importData(){

                var url = "/hrwa/dataio/selUpdItems?pk=" + this.selio;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    if (res.data.status === true) {
                        this.selItemDialogVisible = true;
                        this.$nextTick(function () {
                            this.$refs.ref_dataio_selitem.setTableData(res.data.data);
                        });
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
            confirmSelItem(){
                let tableSelections = this.$refs.ref_dataio_selitem.comp.$refs.tableRef.getSelection();
                if (!tableSelections || tableSelections.length === 0) {
                    this.$message({
                        message: "请先选择薪资项目!",
                        type: 'warning'
                    });
                    return;
                }

                let url = "/hrwa/dataio/dataIntoDB?pk=" + this.selio;
                let svr = this.$http({
                    url: url,
                    method: "post",
                    dataType: "json",
                    data: {
                        indata: this.tableData,
                        selitem: tableSelections,
                    }
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        this.selItemDialogVisible = false;
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch((e) => {
                    this.$message({
                        message: "导入失败",
                        type: "error"
                    });
                });
            },
            goDataIO(){
                this.$router.push("/hrwa/dataio");
            },
        }
    };
</script>
<style>
    #dataio_import .breadcrumb {
        display: inline-block;
    }

    #dataio_import .right_top_label {
        float: right;
        color: #333;
        font-size: 14px;
    }

    #dataio_import .right_top_link {
        cursor: pointer;
        color: #5CB0E6;
    }

    #dataio_import .iolabel {
        font-size: 14px;
    }

    #dataio_import .ioselect {
        position: relative;
        display: inline-block;
        padding-left: 5px;
        padding-right: 16px;
        width: 200px;
    }

    #dataio_import .upload {
        display: inline-block;
    }

    #dataio_import .selfile {
        font-size: 14px;
        padding-right: 5px;
    }

    #dataio_import .filepath {
        width: 300px;
    }

    #dataio_import .importbtn {
        margin-left: 16px;
    }

    #dataio_import .no-data-container {
        padding: 64px 0px;
        text-align: center;
        color: rgb(191, 191, 191);
    }

    #dataio_import .no-data-icon {
        font-size: 92px !important;
        padding-bottom: 36px;
    }

    #dataio_import .tip-content {
        font-size: 20px;
        color: rgb(191, 191, 191);
    }
</style>
