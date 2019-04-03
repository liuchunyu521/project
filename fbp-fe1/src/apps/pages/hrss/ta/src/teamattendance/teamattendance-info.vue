<!--
  @des: 团队出勤-列表
  @author: zgy
  @date: 2018年11月22日13:47:58
-->
<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="团队出勤" v-show="false"></ifbp-breadcrumb>
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
            <ifbp-template ref="teamattendanceref"
                           tplId="teamattendance"
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
            const otThis = this;
            return {
                //时段二默认隐藏
                twobegintime_show: true,
                twoendtime_show: false,
                twoworklen_show: true,
                //时段三默认隐藏
                threebegintime_show: true,
                threeendtime_show: true,
                threeworklen_show: true,

                types: [],
                // 功能编码
                funcode: 'funcode=60420otapply',
                // 权限前缀
                permissionPrefix: '/hrss/ta/teammattendance/',
                requestUrl: {
                    getManagedDeptTree: 'getManagedDeptTree',
                    list: 'pageList',
                },

                photoURL: '/hrhi/psndoc/getPhotoByPK',

                // 查询模板传入参数
                tplCode: 'teamdata',
                optionCountBeforeMore: 4,
                searchTemplate: {},
                // UI模板传入参数

                tabletplData: {},

                selRange: [new Date(), new Date()],
                orgTreeData: [],
                selectedTreeNode: [],

                pk_dept: '',

                tableResetFun: function ($node) {
                    //时段2开始
                    var $twobegintime = $node.find("[prop='twobegintime']");
                    $twobegintime.attr("default-hide", true);
                    /*
                     //时段2结
                     var $twoendtime = $node.find("[prop='twoendtime']");
                     $twoendtime.attr("v-show", true);

                     //时段2工作时长
                     var $twoworklen = $node.find("[prop='twoworklen']");
                     $twoworklen.attr("v-show", "twoworklen_show");*/


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
                this.$refs.teamattendanceref.setTransferVisible(true);
            },


            // 请求数据


            request(pageNum, pageSize) {  debugger
                let begindate = this.selRange[0].getTime();
                let enddate = this.selRange[1].getTime();
                let params = {
                    pageNum: pageNum || 1,
                    pageSize: pageSize || 10,
                   // pk_dept: this.selectedTreeNode[1],
                    pk_dept:this.pk_dept,
                    begindate: begindate,
                    enddate: enddate
                };
                this.$http({
                    url: this.permissionPrefix + this.requestUrl.list,
                    method: "post",
                    data: this.searchTemplate,
                    params: params,
                }).then((res) => {
                    debugger
                    let resultData = res.data.data.content;
                    // this.$refs[this.templateRef].setTableData(resultData);

                    this.$refs.teamattendanceref.setTableData(resultData);
                    this.totalElements = res.data.data.totalElements;
                    this.size = res.data.data.size;
                }).catch(() => {
                    this.$message({message: "信息获取到的失败", type: "error"});
                });
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
                            //this.orgTreeData = initData.treeData;
                            for (var i = 0; i <initData.treeData.length; i++) {

                                this.orgTreeData.push({
                                    "label": initData.treeData[i].name,
                                    "value": initData.treeData[i].pk_dept
                                });
                            }
                            ;
                            this.selectedTreeNode =[initData.treeData[0].name,initData.treeData[0].pk_dept];

                            let pk_dept = initData.defaultPK[0];
                            this.pk_dept = pk_dept;
                            this.request();
                        }

                    } else {
                        this.$message({message: res.data.msg, type: 'error'})
                    }
                }).catch((e) => {
                    this.$message.error('获取主管部门树出错啦！');
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