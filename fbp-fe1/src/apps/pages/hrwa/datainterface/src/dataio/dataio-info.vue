<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="数据接口" v-show="false"></ifbp-breadcrumb>

        <ifbp-button-area :no-breadcrumb="true">
            <hr-org-cascader name="treeCascader" @update:pk_org="orgChange" @change="handleOrgTreeChange" :disabled="orgTreeDisabled"></hr-org-cascader>
            <el-cascader :disabled="classTreeDisabled"
                         ref="treeWaClass"
                         expand-trigger="hover"
                         :options="waClassData"
                         v-model="selectedClassTreeNode"
                         placeholder="请选择薪资方案"
                         not-leaf-selectable="true"
                         :hideBorder="true"
                         :hideRight="true"
                         @change="handleWaClassTreeChange">
            </el-cascader>
            <el-cascader :disabled="periodTreeDisabled"
                         ref="treeWaPeriod"
                         expand-trigger="hover"
                         :options="waPeriodData"
                         v-model="selectedPeriodTreeNode"
                         placeholder="请选择期间"
                         :not-leaf-selectable="false"
                         :hideBorder="true"
                         :hideRight="true"
                         @change="handleWaPeriodTreeChange">
            </el-cascader>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <div class="ifbp-btn-line">
                <ifbp-btn-line
                        :text-btn-arr="textBtnArr"
                        :icon-btn-arr="iconBtnArr"
                        text-align="right"
                        style="margin-top:-16px;width:200px;float:right;">
                </ifbp-btn-line>
            </div>
            <ifbp-template ref="ref_dataio"
                           tpl-id="hrwa_dataio"
                           :tpl-data="dataioData"
                           :editable="dataioEdit"
                           :table-oper-vif="dataioVif"
                           :tplResetFun="dataioResetFun"
                           :form-show-message="dataioEdit"
                           :table-show-menu="false"
                           :methods="dataioMethods"

                           :confirm-button-show="confirmButtonShow"
                           :edit-button-show="editButtonShow"
                           :cancel-button-show="cancelButtonShow"
                           :delete-button-show="deleteButtonShow"

                           @row-click="dataioRowClick"
                           @expand="dataioExpand"
                           @roster-design-table-click="dataioDesignClick"
                           @edit-table-click="dataioEditClick"
                           @delete-table-click="dataioDeleteClick"
                           @form-edit-click="dataioFormEditClick"
                           @form-confirm-click="dataioFormConfirm"
                           @form-cancel-click="dataioFormCancel"
                           @form-delete-click="dataioFormDelete"
            >
            </ifbp-template>
            <!--分页组件-->
            <el-pagination  v-if="!!cperiod"
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
    import IfbpBtnLine from "ifbp-business/ifbpBtnLine";
    let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
    export default {
        mixins: [pageModelMixin],
        components: {
            hrOrgCascader,
            IfbpBtnLine,
        },
        data() {
            const vm = this;
            return {
                iconBtnArr:[],
                orgTreeDisabled:false,
                classTreeDisabled:false,
                periodTreeDisabled:false,
                selectedOrgTreeNode:[],
                selectedClassTreeNode:[],
                selectedPeriodTreeNode:[],
                pk_org:'',
                pk_waclass:'',
                cyear:'',
                cperiod:'',
                orgTreeData: [],
                waClassData:[],
                waPeriodData:[],
                dataioEdit: false,
                dataioData: {},
                dataioVif: true,
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                dataioResetFun: function ($node) {
                    var $table = this.getTableDom($node);
                    var $form = this.getFormDom($node);

                    var $classid = $form.find("[v-model='HrIntfaceVO.classid']");
                    $classid.attr('v-on:change', 'classidChg');
                    var $pk_org = $form.find("[v-model='HrIntfaceVO.pk_org']");
                    $pk_org.attr('v-on:change', 'orgChg');

                    let detail = [{
                        title: "设计",
                        icon: "roster-design",
                        vif: 'true'
                    }, {
                        title: "删除",
                        icon: "delete",
                        vif: 'true'
                    }];
                    let operateHtml = this.getTableOperateHtml(detail);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                dataioMethods: {
                    classidChg(curdata){
                        if(curdata.value[0]){
                            this.HrIntfaceVO.cyear=curdata.value[0].cyear;
                            this.HrIntfaceVO.cperiod=curdata.value[0].cperiod;
                            this.HrIntfaceVO.classname=curdata.value[0].name;
                            this.$refs.orgRef.setPK(curdata.value[0].pk_org);
                        }
                    },
                    orgChg(curdata){
                        if(curdata.value[0]){
                            this.HrIntfaceVO.cyear='';
                            this.HrIntfaceVO.cperiod='';
                            this.HrIntfaceVO.classname='';
                            this.HrIntfaceVO.classid='';
                        }
                    }
                },
            };
        },
        computed: {
            confirmButtonShow: function () {
                return this.dataioEdit;
            },
            editButtonShow: function () {
                return !this.dataioEdit;
            },
            cancelButtonShow: function () {
                return this.dataioEdit;
            },
            deleteButtonShow: function () {
                return !this.dataioEdit;
            },
            textBtnArr:function(){
                return [{
                    title: "新增",
                    fontNum:2,
                    fn: this.addDataIO,
                    disabled:!this.cperiod,
                    visible:true,
                }];
            },
        },
        mounted() {
//            this.getOrgTreeData();
        },
        methods: {
            orgChange(val){
                this.pk_org = val;
            },
            ifbpPageInit(){
                this.request(this.currentPage, this.size);
            },
//            getOrgTreeData(){
//                this.$http({
//                    url: '/hrwa/dataio/getOrgTreeData',
//                    method: "post",
//                    params: '',
//                }).then((res) => {
//                    if (res.data.success) {
//                        this.orgTreeData = res.data.data.orgtreedata;
//                    } else if (res.data.error && res.data.error.errorMessage) {
//                        console.log('树获取失败', JSON.stringify(res.data.error));
//                        this.$message({
//                            message: '树获取失败: ' + res.data.error.errorMessage,
//                            type: 'error'
//                        });
//                    }
//                }).catch((e) => {
//                    console.log(e);
//                    this.$message.error('请求出错');
//                });
//            },
            getWaClassData(){
                this.$http({
                    url: '/hrwa/dataio/getWaClassData',
                    method: "post",
                    params: {
                        pk_org:this.pk_org,
                    },
                }).then((res) => {
                    if (res.data.success) {
                        this.waClassData = res.data.data;
                    } else if (res.data.error && res.data.error.errorMessage) {
                        console.log('树获取失败', JSON.stringify(res.data.error));
                        this.$message({
                            message: '树获取失败: ' + res.data.error.errorMessage,
                            type: 'error'
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    this.$message.error('请求出错');
                });
            },
            getPeriodData(){
                this.$http({
                    url: '/hrwa/dataio/getPeriodData',
                    method: "post",
                    params: {
                        pk_waclass:this.pk_waclass,
                    },
                }).then((res) => {
                    if (res.data.success) {
                        this.waPeriodData = res.data.data;
                    } else if (res.data.error && res.data.error.errorMessage) {
                        console.log('树获取失败', JSON.stringify(res.data.error));
                        this.$message({
                            message: '树获取失败: ' + res.data.error.errorMessage,
                            type: 'error'
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    this.$message.error('请求出错');
                });
            },
            handleOrgTreeChange() {
                this.pk_waclass = '';
                this.cyear = '';
                this.cperiod = '';
                this.waClassData=[];
                this.waPeriodData=[];

                this.selectedClassTreeNode = [];
                this.selectedPeriodTreeNode = [];
                if(this.pk_org){
                    this.getWaClassData();
                    this.clearData();
                }
//                if (Array.isArray(treeItem) && treeItem.length) {
//                    let pk_org = treeItem[treeItem.length - 1];
//                    this.pk_org = pk_org;
//                    this.getWaClassData();
//                    this.clearData();
//                } else {
//                    this.pk_org = '';
//                }
            },

            handleWaClassTreeChange(treeItem) {
                this.cyear = '';
                this.cperiod = '';
                this.waPeriodData=[];
                this.selectedPeriodTreeNode = [];
                if (Array.isArray(treeItem) && treeItem.length) {
                    this.pk_waclass = treeItem[treeItem.length - 1];
                    this.getPeriodData();
                    this.clearData();
                } else {
                    this.pk_waclass = '';
                }
            },
            handleWaPeriodTreeChange(treeItem) {
                if (Array.isArray(treeItem) && treeItem.length) {
                    this.cperiod = treeItem[treeItem.length - 1];
                    this.cyear = treeItem[treeItem.length - 2];
                    this.request();
                } else {
                    this.cyear = '';
                    this.cperiod = '';
                }
            },
            clearData(){
                this.$refs.ref_dataio.setTableData([]);
//                this.totalElements = 0;
//                this.size = 0;
//                this.currentPage = 0;
            },
            // 获取数据
            request(n, s) {
                this.dataioEdit = false;

                var pn = !n ? 1 : n;
                var ps = !s ? 10 : s;
                var url = "/hrwa/dataio/pageList?pn=" + pn + "&ps=" + ps;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json",
                    params:{
                        pn:pn,
                        ps:ps,
                        pk_org:this.pk_org,
                        pk_waclass:this.pk_waclass,
                        cyear:this.cyear,
                        cperiod:this.cperiod,
                    }
                }).then((res) => {
                    if (res.data.status === true) {
                        if(!res.data.data.content){
                            this.$refs.ref_dataio.setTableData([]);
                        }else{
                            this.$refs.ref_dataio.setTableData(res.data.data.content);
                        }
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                        this.currentPage = res.data.data.number;
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
                        this.realSave();
                    }
                });
            },
            realSave(){
                var editData = this.$refs.ref_dataio.getFormData();
                var pk_dataio_intface = editData.pk_dataio_intface;
                this.orgTreeDisabled = false;
                this.classTreeDisabled = false;
                this.periodTreeDisabled = false;

                this.$http({
                    url: '/hrwa/dataio/savemain',
                    method: 'post',
                    traditional: true,
                    data: editData
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.dataioEdit = false;
                            this.$refs.ref_dataio.clearEdit();
                            this.$refs.ref_dataio.formShow = false;
                            this.$refs.ref_dataio.tableShow = true;
                            this.$refs.ref_dataio.getTableComp().closeExpandRow();
                            if (!pk_dataio_intface) {
                                this.$router.push("/hrwa/dataio/design/" + res.data.data.pk_dataio_intface);
                                return;
                            }
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
                this.orgTreeDisabled = false;
                this.classTreeDisabled = false;
                this.periodTreeDisabled = false;
            },
            addDataIO(){
                this.orgTreeDisabled = true;
                this.classTreeDisabled = true;
                this.periodTreeDisabled = true;
                this.dataioEdit = true;
                // 关闭table中的编辑区
                this.$refs.ref_dataio.getTableComp().closeExpandRow();
                // 显示新增区域
                this.$refs.ref_dataio.formShow = true;
                // 重
                this.$refs.ref_dataio.resetFormData();

                //设置默认值
                var editData = this.$refs.ref_dataio.getFormData();
                editData.classid=this.pk_waclass;
                editData.pk_org = this.pk_org;
                editData.cyear = this.cyear;
                editData.cperiod = this.cperiod;
                this.$refs.ref_dataio.setFormData(editData);
            },
        }
    };
</script>
<style>

</style>
