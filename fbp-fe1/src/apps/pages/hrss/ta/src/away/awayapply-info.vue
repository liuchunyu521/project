<!--
  @des: 出差申请-列表
  @author: zhanggy
  @date: 2018-08-28
-->
<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="团队出差" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">

            <el-cascader
                    v-if="orgTreeData && orgTreeData.length"
                    ref="treeCascader"
                    expand-trigger="hover"
                    :options="orgTreeData"
                    v-model="selectedTreeNode"
                    placeholder="请选择部门"
                    not-leaf-selectable="true"
                    :hide-border="true"
                    :hide-right="true"
                    :show-all-levels="false"
                    @change="handleTreeChange">
            </el-cascader>
            <el-date-picker
                    class="range_date"
                    v-model="selRange"
                    range-separator="～"
                    type="daterange"
                    placeholder="选择日期"
                    :show-icon="true"
                    @change="selDateChg">
            </el-date-picker>


            <el-cascader
                    :options="types"
                    v-model="deftype"
                    :hide-border="true"
                    :hide-right="true"
                    :show-all-levels="false"
                    :clearable="true"
                    placeholder="选择出差类型"
                    @change="typeChange">
            </el-cascader>


            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <div class="ifbp-btn-line">
                <div slot="header" class="fr">
                    <div class="ifbp-btn-line">
                        <i class="ifbp-icon-setting" @click="showTableSetting"></i>
                    </div>
                </div>

            </div>
            <!-- 列表 -->
            <ifbp-template :ref="tableRef"
                           tplId="list"
                           :tpl-data="tabletplData"
                           :tplResetFun="tableResetFun"
                           :table-show-menu="false"
                           :methods="tableMethods">
            </ifbp-template>

            <!--分页组件-->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="pageSize"
                           :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totalElements">
            </el-pagination>
        </ifbp-main-area>

    </ifbp-page>
</template>

<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        components: {},
        data() {
            const setalterInfoThis = this;
            return {
                types: [],
                deftype:[ ],
                // 功能编码
                funcode: 'funcode=60420awayapply',
                // 权限前缀
                permissionPrefix: '/hrss/ta/AwayApply/',
                requestUrl: {
                    getManagedDeptTree: 'getManagedDeptTree',
                    list: 'pageList',
                    gettype: 'gettype',
                },

                photoURL: '/hrhi/psndoc/getPhotoByPK',

                // 查询模板传入参数
                tplCode: 'hrss_awayapply_l',
                optionCountBeforeMore: 4,
                searchTemplate: {},

                // UI模板传入参数
                tableRef: 'ref_awayapplyh_l',
                tabletplData: {},

                selRange: [new Date(), new Date()],
                orgTreeData: [],

                pk_dept: '',

                tableResetFun: function ($node) {

                    let $table = $node.find('el-table');

                    return $node[0].outerHTML;
                },

                tableMethods: {},

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                pageSize: [10, 20, 30, 40],

            };
        },

        created() {
            this.getDeptTreeData();
        },


        methods: {
            showTableSetting() {
                this.$refs.ref_awayapplyh_l.setTransferVisible(true);
            },


            // 请求数据
            request(pageNum, pageSize) {debugger

                let begindate = this.selRange[0].getTime();
                let enddate = this.selRange[1].getTime();


                let param = {
                    deftype:this.deftype[0],
                    pageNum: pageNum || 1,
                    pageSize: pageSize || 10,
                    pk_dept: this.pk_dept,
                    begindate: begindate,
                    enddate: enddate
                };
                this.$http({
                    url: this.permissionPrefix + this.requestUrl.list,
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    let resultData = res.data.data.content;

                    this.$refs[this.tableRef].setTableData(resultData);
                    this.totalElements = res.data.data.totalElements;
                    this.size = res.data.data.size;
                }).catch(() => {
                    this.$message({message: "信息获取失败", type: "error"});
                });
            },

            //获取出差类型
            gettype(){
                debugger
                let param = {
                    pk_dept: this.pk_dept,
                };
                this.$http({
                    url: this.permissionPrefix + this.requestUrl.gettype,
                    method: "post",
                    params: param,
                }).then((res) => {
                    debugger
                    if (res.data.status === true) {
                        let initData = res.data.data;
                        if (initData!=null) {

                            for (var i = 0; i < res.data.data.length; i++) {

                                this.types.push({
                                    "label": initData[i].label,
                                    "value": initData[i].value
                                });
                            };

                            this.deftype =[initData[0].lable,initData[0].value],

                            this.request();
                        }

                    } else {
                        this.$message({message: res.data.msg, type: 'error'})
                    }
                }).catch((e) => {
                    this.$message.error('获取出差类型出错啦！');
                });
            },

            // 类型变化的触发事件
            typeChange(treeItem) {
                this.request();

            },

            // 获取部门树
            getDeptTreeData() {

                this.$http({
                    url: this.permissionPrefix + this.requestUrl.getManagedDeptTree,
                    method: "post",
                    params: '',
                }).then((res) => {
                    if (res.data.status === true) {
                        let initData = res.data.data;
                        if (initData.treeData) {
                            for (var i = 0; i <initData.treeData.length; i++) {

                                this.orgTreeData.push({
                                    "label": initData.treeData[i].name,
                                    "value": initData.treeData[i].pk_dept
                                });
                            };


                            this.selectedTreeNode =[initData.treeData[0].name,initData.treeData[0].pk_dept];
                            let pk_dept = initData.defaultPK[0];
                            this.pk_dept = pk_dept;
                            this.gettype();

                        }

                    } else {
                        this.$message({message: res.data.msg, type: 'error'})
                    }
                }).catch((e) => {
                    this.$message.error('请求主管部门树出错啦！');
                });
            },

            // 部门树变化的触发事件
            handleTreeChange(treeItem) {
                if (Array.isArray(treeItem) && treeItem.length) {
                    let pk_dept = treeItem[treeItem.length - 1];
                    this.pk_dept = pk_dept;
                    this.request();
                }
            },

            // 日期范围变化的触发事件
            selDateChg() {
                this.request();
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.refreshTableList();
            },

            // 刷新table
            refreshTableList: function () {
                this.request(this.currentPage, this.size);
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.currentPage = 1;
                this.size = val;
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
            },

        }
    };
</script>