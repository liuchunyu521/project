<!--
  作者：liyn11
  时间：2018-03-02
  支持：岗位信息
-->
<template>
    <ifbp-page id="hrPostUiId">
        <!-- 节点title -->
        <ifbp-breadcrumb name="岗位信息" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <hr-org-cascader name="postInfo"
                             @update:pk_org="val => {this.pk_org = val}"
                             @update:pk_dept="val => {this.pk_dept = val}"
                             :needDept="true"
                             @change="refreshTableList">
            </hr-org-cascader>
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         :no-breadcrumb-search="true"
                         @search="advancedSearch">
            </ifbp-search>
            <!--显示已撤销-->
            <div class="fr"  style="margin-right: 15px">
                <el-checkbox v-model="showCanceled" @change="showCancelChange" >显示已撤销</el-checkbox>
            </div>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!--<div align="right" class="top-button">-->
        <!--&lt;!&ndash;<span slot="text_btn">&ndash;&gt;-->
                <!--<el-button type="text" class="ifbp-layout-content-right-button marginleft24" @click="addPostBaseinfo"><span >新增</span></el-button>-->
                <!--<el-button type="text" class="ifbp-layout-content-right-button marginleft24"  @click="poststdGeneratePosts">按基准岗位批增</el-button>-->
                <!--<el-dropdown  menu-align="start" trigger="click"  @command="handleCommand" >-->
                    <!--<el-button   type="text" class="ifbp-layout-content-right-button marginleft24">-->
                        <!--<span >变更</span><i  class="el-icon-caret-bottom el-icon&#45;&#45;right" style="position: relative;top: 3px;"></i>-->
                    <!--</el-button>-->
                    <!--<el-dropdown-menu slot="dropdown">-->
                        <!--<el-dropdown-item command="renameClick">更名</el-dropdown-item>-->
                        <!--<el-dropdown-item command="mergeClick">合并</el-dropdown-item>-->
                        <!--<el-dropdown-item command="cancelClick">撤销</el-dropdown-item>-->
                        <!--<el-dropdown-item command="uncancelClick">取消撤销</el-dropdown-item>-->
                    <!--</el-dropdown-menu>-->
                <!--</el-dropdown>-->
                <!--<i class="ifbp-icon-setting" @click="settingBtn" style="position: relative;top: -4px;"></i>-->

                <!--&lt;!&ndash;</span>&ndash;&gt;-->
            <!--</div>-->

            <ifbp-btn-line
                    :text-btn-arr="btnLineTextBtnArr"
                    :icon-btn-arr="btnLineIconBtnArr"
                    :text-align="textAlign"
                    :slot-width="0"
                    style="margin-top:-16px;"
            >
            </ifbp-btn-line>
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_post"
                           tpl-id="postInfoListId"
                           class="uitemplate-no-top"
                           :tpl-data="postTableData"
                           :table-show-menu="false"
                           :tplResetFun="postTableResetFun"
                           :methods="formMethods"
                           @edit-table-click="postTableEditClick"
                           @delete-table-click="postTableDeleteClick"
                           @people-table-click="postIntoEmployeeClick">
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
            <post-generate-by-std :ref="poststdRef"
                                  :pk_org="pk_org"
                                  :pk_dept="pk_dept"
                                  @refresh="refreshTableList"
            >
            </post-generate-by-std>
        </ifbp-main-area>
        <renameDialog :ref="renameRef" @renameRequest="childRequest"></renameDialog>
        <mergeDialog :ref="mergeRef" @mergeRequest="childRequest"></mergeDialog>
        <cancelDialog  :ref="cancelRef"  @cancelRequest="childRequest"></cancelDialog>
        <uncancelDialog :ref="uncancelRef"  @uncancelRequest="childRequest"></uncancelDialog>
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    import PostGenerateByStd from './post-generate-by-std.vue'
    import  renameDialog from './postRenameDialog.vue';
    import mergeDialog from './postMergeDialog.vue';
    import  cancelDialog from './postCancelDialog.vue';
    import  uncancelDialog from './postUnCancelDialog.vue';
    import IfbpBtnLine from "ifbp-business/ifbpBtnLine";

    let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

    export default {
        mixins: [pageModelMixin],
        components: {
            hrOrgCascader,
            IfbpBtnLine,
            PostGenerateByStd,
            renameDialog,
            mergeDialog,
            cancelDialog,
            uncancelDialog
        },
        data() {
            const vm = this;
            return {
                btnLineTextBtnArr: [{
                    title: "新增",        // 按钮显示文字
                    disabled: false,      // 是否为禁用
                    command: "addPostBaseinfo",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                    fn: vm.addPostBaseinfo,   // 按钮触发后调用函数
                },{
                    title: "按基准岗位批增",        // 按钮显示文字
                    disabled: false,      // 是否为禁用
                    command: "poststdGeneratePosts",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    fontNum: 7,            // 按钮文字的个数, 用于计算按钮宽度
                    fn: vm.poststdGeneratePosts,   // 按钮触发后调用函数
                }, {
                    title: "变更",        // 按钮显示文字
                    disabled: false,      // 是否为禁用
                    command: "handleCommand",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用 @command="handleCommand"
                    fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                    fn: '',   // 按钮触发后调用函数
                    itemArr: [{
                        title: "更名",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "renameClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.renameClick,   // 按钮触发后调用函数
                    },{
                        title: "合并",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "mergeClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.mergeClick,   // 按钮触发后调用函数
                    }, {
                        title: "撤销",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "cancelClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 2,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.cancelClick,   // 按钮触发后调用函数
                    }, {
                        title: "取消撤销",        // 按钮显示文字
                        disabled: false,      // 是否为禁用
                        command: "uncancelClick",   // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                        fontNum: 4,            // 按钮文字的个数, 用于计算按钮宽度
                        fn: vm.uncancelClick,   // 按钮触发后调用函数
                    }],
                }],
                btnLineIconBtnArr: [{
                    title: "设置",                // 图标按钮鼠标悬浮显示的文字
                    command: "settingBtn",           // 唯一的英文名字,用于显示在下拉列表时,点击触发对应函数是使用
                    iconfont: "ifbp-icon-setting", // 图标按钮的icon 对应的类名;
                    fn: vm.settingBtn,           // 按钮触发后调用的函数;
                }],
                textAlign: "right",
                showCanceled:false,
                uncancelRef:'uncancelRef',
                cancelRef:'cancelRef',
                mergeRef:'mergeRef',
                renameRef:'renameRef',
                //从基准岗位新增
                poststdRef: 'ref_poststd_dialog',
                search_input: '',
                //获取部门联查岗位URL参数
                pk_dept: this.$route.query['pk_dept'],
                defaultPk_org: '',
                pk_org: "",
                deptTreeData: [],
                orgTreeData: [],
                //级联选择器
                orgModel: [],
                deptModel: [],

                notLeafSelect: true,
                // cid: 'pk_post',
                // pid: 'suporior',
                //接受后台判断是否有附件
                reqFileExist: {},
                // 查询模板传入参数
                tplCode: 'postSearchTpls',
                searchTemplate: {},
                delIds: [],
                //分页
                totalElements: 0,
                currentPage:1,
                size:10,
                postTableData: {
                    isTreeShow: true,//数据是否树形展示
                    listDataLazy: [],
                },
                formMethods: {
                    // table行中点击编码进入详情的操作
                    postInfoTableEditClick(scope) {
                        var pkUrlPost = scope.row.pk_post;
                        if(pkUrlPost){
                            vm.$router.push({path: '/hrjf/post/postDetail', query: {id: pkUrlPost,isEditForPath:false}});
                        }
                    },

                },


                postTableResetFun: function ($node) {
                    let $table = this.getTableDom($node);
                    let code = $node.find("[prop='postcode']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click.stop="postInfoTableEditClick(scope)">{{scope.row.postcode}}</a>' + '<i  v-show="scope.row.hasfile"   class="ifbp-icon-attach-file" style="color: #5AC8FA ;margin-left:8px ; height: 16px; vertical-align: -19%;"></i>' +
                        '</template>'
                    );
                    let cancelTab = $node.find("[prop='hrcanceled']");
                    cancelTab.html(
                        '<template scope="scope">' +
                        '<span style="color: #00A753" v-if="scope.row.hrcanceled">是</span>' +
                        '<span  v-if="!scope.row.hrcanceled">否</span>' +
                        '</template>'
                    );
                    let detail = [{
                        title: "联查人员",
                        icon: "people",
                    }];
                    var operateHtml = this.getBaseTableOperateHtml(detail);
                    $table.append(operateHtml);

                    return $node[0].outerHTML;
                },
            };
        },
        mounted() {

        },
        created() {

        },
        methods: {
            ifbpPageInit(){
                this.request(this.currentPage, this.size);
            },
            // 请求数据，改成懒加载查询的是一级数据
            request(n, s){
                let param = {
                    pn: n ? n : '1',
                    ps: s ? s : '10',
                    sortField: 'pk_org , pk_dept, postcode',
                    urlParam: {"pk_org": this.pk_org,"pk_dept": this.pk_dept,"showCanceled":this.showCanceled}
                };
                this.$http({
                    url: '/hrjf/post/pageList',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        if (this.$refs.ref_post) {
                            // this.$refs.ref_post.setTableData(res.data.data.content);
                            this.$refs.ref_post.setTableData(res.data.data.content);
                        } else {
                            this.$set(this.postTableData, "uitemplateTableData", res.data.data.content);
                        }
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    } else {

                        this.$message({message: res.data.msg, type: "error"});
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            //点击搜索框的查询方法
            requestForSearch() {
                let param = {
                    pn:this.currentPage,
                    ps:this.size,
                    sortField: 'pk_org , pk_dept, postcode',
                    urlParam: {"pk_org": this.pk_org, "pk_dept": this.pk_dept,"showCanceled":this.showCanceled}
                };
                this.$http({
                    url: '/hrjf/post/pageList',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {
                        if (this.$refs.ref_post) {
                            // this.$refs.ref_post.setTableData(res.data.data.content);
                            this.$refs.ref_post.setTableData(res.data.data.content);
                        } else {
                            this.$set(this.postTableData, "uitemplateTableData", res.data.data.content);
                        }
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    } else {
                        this.$message({message: res.data.msg, type: "error"});
                    }
                })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // table行的编辑操作
            postTableEditClick(scope) {
                var pkUrlPost = scope.row.pk_post;
                if(pkUrlPost){
                    this.$router.push({path: '/hrjf/post/postDetail/', query: {id: pkUrlPost}});
                }
            },
            // table行的删除操作
            postTableDeleteClick(scope) {
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.pk_post = scope.row.pk_post;
                    if (this.pk_post === undefined) {
                        return;
                    }
                    this.deleteClick();
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            //岗位联查人员的点击事件
            postIntoEmployeeClick(scope) {
                let orgName = scope.row.beanMap.pk_org_ref ? scope.row.beanMap.pk_org_ref[scope.row.pk_org]["name"] : "";
                let deptName = scope.row.beanMap.pk_dept_ref ? scope.row.beanMap.pk_dept_ref[scope.row.pk_dept]["name"] : "";
                let $url = "/hrhi/psndoc?funcode=60070psninfo&pk_org=" + scope.row.pk_org + "&pk_dept=" + scope.row.pk_dept + "&pk_post=" + scope.row.pk_post + "&post_name=" + scope.row.postname + "&org_name=" + orgName + "&dept_name=" + deptName;
                this.$router.push($url);
            },
            // 跳转到添加地点页面
            addPostBaseinfo() {
                this.$router.push({path: '/hrjf/post/postDetail', query: {pk_org_param: this.pk_org,pk_dept_param:this.pk_dept}});
            },
            //跳转到导入页面暂未实现
            importBaseInfo(){

            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.currentPage = 1;
                this.searchTemplate = searchTemplate;
                this.refreshTableList();
            },

            //刷新table
            refreshTableList: function () {
                this.currentPage = 1;
                this.requestForSearch();
            },
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.currentPage = 1;
                sessionStorage.setItem('postInfo-pageSize', parseInt(val));
                sessionStorage.setItem('postInfo-currentPage', this.currentPage);
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.request(val, this.size);
                sessionStorage.setItem('postInfo-currentPage', this.currentPage);
            },
            // 删除处理
            deleteClick() {
                var pk_id = this.pk_post;
                this.$http({
                    url: '/hrjf/post/delete/' + pk_id,
                    method: 'get'
                }).then((res) => {
                    this.delId = "";
                    this.request(this.currentPage, this.size);
                    if (res.data.status === true) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.delIds = "";
                }).catch((e) => {
                    this.delIds = "";
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },
            //列表是否隐藏
            settingBtn() {
                    this.$refs.ref_post.setTransferVisible(true);
            },
            //子组件跳转父组件后刷新页面
            childRequest(){
                this.request(this.currentPage,this.size);
            },
            poststdGeneratePosts() {
                this.$refs[this.poststdRef].setDialogVisible(true, this.pk_org);
            },
            renameClick() {
                var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                this.$refs[this.renameRef].setDialogVisible(true,selectRows);
            },
            mergeClick() {
                var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                this.$refs[this.mergeRef].setDialogVisible(true,selectRows);
            },
            cancelClick() {
                var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                this.$refs[this.cancelRef].setDialogVisible(true, selectRows);
            },
            uncancelClick() {
                var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                this.$refs[this.uncancelRef].setDialogVisible(true, selectRows);
            },
            handleCommand(command){
                if(command=="renameClick"){
                    var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                    this.$refs[this.renameRef].setDialogVisible(true,selectRows);
                     return;
                }
                if(command=="mergeClick"){
                    var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                    this.$refs[this.mergeRef].setDialogVisible(true,selectRows);
                    return;
                }
                if(command=="cancelClick"){
                    var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                    this.$refs[this.cancelRef].setDialogVisible(true, selectRows);
                    return;
                }
                if(command =="uncancelClick"){
                    var selectRows = this.$refs.ref_post.getTableComp().getSelection();
                    this.$refs[this.uncancelRef].setDialogVisible(true, selectRows);
                    return;
                }

            },
            showCancelChange(e){
                this.request();
            },
        }
    };
</script>
<style>
    #hrPostUiId .el-checkbox__inner {
        margin-top: -10px !important;
    }
</style>
