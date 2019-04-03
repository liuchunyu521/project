<!--
  作者：zhanggy
  时间：2018年11月22日14:46:02
  支持：团队信息-卡片列表页面
-->
<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="团队信息" v-show="false"></ifbp-breadcrumb>

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
            <ifbp-search class="fr"
                         :no-breadcrumb-search="true"

                         :template-code="tplCode"
                         @search="advancedSearch"
                         @ready="searchReady"


            >
            </ifbp-search>

        </ifbp-button-area>


        <!-- 主体区域 -->
        <ifbp-main-area type="list">


            <!--卡片列表切换区域-->
            <div style="width:100%;height:32px;">
                <psndoc-card-list :isList="isList"
                                  @change_card="change2card"
                                  @change_list="change2list"
                                  @set_show_item="setShowItem">

                </psndoc-card-list>
            </div>

            <!-- 列表 -->
            <ifbp-template v-show="isList"
                           :ref="templateRef"
                           tpl-id="teamnews-info"
                           class="uitemplate-no-top"
                           :table-show-menu="false"
                           :tpl-data="psndocTableData"
                           :tplResetFun="psndocTableResetFun"
                           :methods="tableFormMethods"
            >
            </ifbp-template>

            <!--卡片-->
            <psndoc-card v-show="!isList"
                         :psndocCardData="employeeCardData"
                         btnType="psninfo"
                         @edit-card-click="psninfoDetailClick">
            </psndoc-card>
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
    import PsndocCard from './psndoc-card.vue';
    import PsndocCardList from './psndoc-card-list.vue';

    import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        components: {
            PsndocCard,
            PsndocCardList,
        },
        data() {
            const psnInfoDetailThis = this;
            return {
                // 功能编码
                funcode: 'funcode=60420teamnews',
                // 权限前缀
                permissionPrefix: '/hrss/ta/teamnews',
                // 所有当前页面请求路径
                requestUrl: {
                    list: '/pageList',
                },
                orgTreeData: [],
                photoURL: '/hrhi/psndoc/getPhotoByPK',

                employeeCardData: [],

                // 联查条件
                pk_org: '',
                pk_dept: '',
                pk_hrorg: '',

                pk_psndoc: this.$route.query['pk_psndoc'],


                regular: this.$route.query['regular'],

                // 查询模板传入参数
                tplCode: 'hrhiEmployeeSearch',
                optionCountBeforeMore: 4,
                searchTemplate: {},
                searchTempReady: false,

                // 离职
                dimissionRef: 'dimissionRef',
                leave_pk_psndoc: '',

                // UI模板传入参数
                templateRef: 'ref_psndoc_l',
                psndocTablePk: "0001HRHI060070000001",
                psndocTableData: {
                    edit_name: 'edit',
                    regApply: 'regApply',
                    stApply: 'stApply',
                    partTime: 'partTime',
                    leave: 'leave',
                },
                psndocTableResetFun: function ($node) {

                    let $table = $node.find('el-table');
                    $table.attr('v-on:row-dblclick', 'dblClick');

                    let $photo = $node.find("[prop='photo']");
                    $photo.html(
                        '<template scope="scope">' +
                        '<img  :src="scope.row.imgPath" alt="" @error="errorLoadInfoImg" style="width: 24px;height: 32px">' +
                        '</template>'
                    );

                    // 人员编码
                    let code = $node.find("[prop='code']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click="psninfoDetailClick(scope)">{{scope.row.code}}</a>' +
                        '</template>'
                    );

                    // 资料完整度
                    let profile_cmplt_ptg = $node.find("[prop='profile_cmplt_ptg']");
                    profile_cmplt_ptg.html(
                        '<template scope="scope">' +
                        '<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.profile_cmplt_ptg" :status="scope.row.profile_status"></el-progress>' +
                        '</template>'
                    );
                    let detail = [{
                        title: "编辑",

                        vif: "tableOperVif",
                    }];
                    let operateHtml = this.getTableOperateHtml(detail);
                    return $node[0].outerHTML;
                },

                tableFormMethods: {
                    // 图片加载失败
                    errorLoadInfoImg: function (e) {
                        e.srcElement.src = defaultAvatarMin;
                    },
                    // 点击行超链接事件
                    psninfoDetailClick: function (scope) {
                        psnInfoDetailThis.detailPage(scope.row.pk_psndoc);
                    },
                    // 双击行事件
                    dblClick(row) {
                        $('.tooltip-normal').hide();
                        psnInfoDetailThis.detailPage(row.pk_psndoc);
                    },
                },

                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 12,
                pageSize: [12, 24, 36, 48],

                //卡片和列表标志位
                isList: true,

                // 卡片页面数据
                psninfoCardData: [],

            };
        },
     /*   created() {

            this.getDeptTreeData();
        },*/

        methods: {

            // 列表初始化

            // 请求数据
            request(pageNum, pageSize) {
                debugger
                let param = {
                    pageNum: pageNum || 1,
                    pageSize: pageSize || 12,
                    pk_dept: this.pk_dept };
                this.$http({
                    url: this.permissionPrefix + this.requestUrl.list,
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {  debugger
                        // 有数据时，对列表图片进行转换
                        let resultData = res.data.data.content;
                        if (resultData) {
                            for (let i = 0; i < resultData.length; i++) {
                                resultData[i].imgPath = this.photoURL + "?pk_psndoc=" + resultData[i].pk_psndoc + "&compression=true&ts=" + (new Date()).getTime();
                            }
                        }
                        this.employeeCardData = resultData;
                        this.$refs[this.templateRef].setTableData(resultData);
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
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



            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.refreshTableList();
            },
            // 查询区初始化
            searchReady: function (searchTemplate) {  debugger
                this.searchTemplate = searchTemplate;
                this.searchTempReady = true;
               this.refreshTableList();
            },

            //刷新table
            refreshTableList: function () {
                if(this.searchTempReady) {
                    this.getDeptTreeData();
                  //  this.request(this.currentPage, this.size);
                }
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
            // 切换卡片页面
            change2card() {
                this.isList = false;
            },


            //切换列表页面
            change2list(){
                this.isList = true;
            },
            setShowItem: function () {
                this.$refs[this.templateRef].setTransferVisible(true);
            },
            // 获取部门树
            getDeptTreeData() {debugger

                this.$http({
                    url: "/hrss/ta/otapply/getManagedDeptTree",
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

            // 详情跳转
            psninfoDetailClick: function (scope) {
                this.detailPage(scope.row.pk_psndoc);
            },
            // 详情页面跳转
            detailPage: function (pk_psndoc) {

                this.$router.push("/hrhi/psninfo/dynamic/" + pk_psndoc + "?funcode=60070psninfo");
            },

        }
    };
</script>

