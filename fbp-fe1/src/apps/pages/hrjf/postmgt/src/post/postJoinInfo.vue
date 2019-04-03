<!--
  作者：liyn11
  时间：2018-03
  支持：岗位信息
-->
<template>
    <ifbp-page  id="uiPostJoinId" >
        <!-- 节点title -->
        <ifbp-breadcrumb name="岗位信息" ></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area >
            <div class="postinfo-join-div" v-if="org_name" ><p class="postinfo-join-p" v-text="org_name_show"></p></div>
            <div class="postinfo-join-div" v-if="dept_name" ><p class="postinfo-join-p"  v-text="dept_name_show"></p></div>
            <div class="fr"  style="margin-right: 15px" id="uiPostJoinId">
                <el-checkbox v-model="showCanceled" @change="showCancelChange" >显示已撤销</el-checkbox>
            </div>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_post_join"
                           tpl-id="postJoinList"
                           class="uitemplate-no-top"
                           :tpl-data="postTableData"
                           :tplResetFun="postTableResetFun"
                           :methods="formMethods"
                           @people-table-click="postIntoEmployeeJoinClick">
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
    </ifbp-page>
</template>
<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

    export default {
        mixins : [pageModelMixin],
        data() {
            const vm = this;
            return {
                showCanceled:false,
                //分页
                totalElements: 0,
                currentPage:1,
                size:10,
                //接受后台判断是否有附件
                reqFileExist :{},
                // 查询模板传入参数
                tplCode: 'postSearchTpls',
                searchTemplate: {},
                delIds: [],
                // UI模板传入参数
                // postTablePk: "0001AA10000000004V9R",
                postTableData: {
                    isTreeShow: true,//数据是否树形展示
                },

                formMethods: {
                    // table行中点击编码进入详情的操作
                    postInfoTableEditClick(scope) {
                        vm.$router.push({path: '/hrjf/post/postDetail', query: {id: pkUrlPost,isEditForPath:false}});
                    },
                },
                postTableResetFun: function ($node) {
                    let cancelTab = $node.find("[prop='hrcanceled']");
                    cancelTab.html(
                        '<template scope="scope">' +
                        '<span style="color: #00A753" v-if="scope.row.hrcanceled">是</span>' +
                        '<span  v-if="!scope.row.hrcanceled">否</span>' +
                        '</template>'
                    );
                    $node.find("[_id='om_post_l']").attr(":table-tree", "isTreeShow");
                    $node.find("[prop='checkbox4post']").attr("v-if","false");
                    var $table = this.getNodeById($node, "om_post_l");
                    let detail = [{
                        title: "联查人员",
                        icon: "people",
                    }];
                    var operateHtml = this.getTableOperateHtml(detail);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                search_input: '',
                //获取部门联查岗位URL参数
                pk_dept:this.$route.query['pk_dept'],
                // 所属组织
                org_name:this.$route.query['org_name'],
                // 所属部门
                dept_name:this.$route.query['dept_name']
            };
        },
        computed: {
            org_name_show: function () {
                return "所属组织：" + this.org_name;
            },
            dept_name_show: function () {
                return "所属部门：" + this.dept_name;
            }
        },
        created() {
            this.request();
        },
        methods: {
            ifbpPageInit(){
                this.request();
            },
            // 请求数据
            request(n, s) {
                    let param = {
                        pn: n ? n : '1',
                        ps: s ? s : '10',
                        sortField: 'pk_org , pk_dept, postcode',
                        urlParam: {"pk_dept": this.pk_dept,"showCanceled":this.showCanceled}
                    };
                    this.$http({
                        url: '/hrjf/post/pageList',
                        method: "post",
                        data: this.searchTemplate,
                        params: param,
                    }).then((res) => {
                        if (res.data.status === true) {
                            if (this.$refs.ref_post_join) {
                                // this.$refs.ref_post.setTableData(res.data.data.content);
                                this.$refs.ref_post_join.setTableData(res.data.data.content);
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
                // let param = {
                //     sortField: 'postcode',
                //     urlParam:{"pk_dept":  this.pk_dept}
                // };
                // this.$http({
                //     url: '/hrjf/post/getTree',
                //     method: "post",
                //     data:this.searchTemplate,
                //     params: param,
                // }).then((res) => {
                //     if (res.data.status === true) {
                //         if (this.$refs.ref_post_join) {
                //             // this.$refs.ref_post.setTableData(res.data.data.content);
                //             this.$refs.ref_post_join.setTableData(res.data.data);
                //         } else {
                //             this.$set(this.postTableData, "uitemplateTableData", res.data.data);
                //         }
                //         this.$refs.ref_post_join.setData("isTreeShow", res.data.isTreeShow);
                //     } else {
                //         this.$message({message: res.data.msg, type: "error"});
                //     }
                // })
                //     .catch(() => {
                //         this.$message({
                //             message: "信息获取失败",
                //             type: "error"
                //         });
                //     });
            },
            //刷新table
            refreshTableList: function () {
                this.request();
            },
            //岗位联查人员的点击事件
            postIntoEmployeeJoinClick(scope) {
                let orgName = scope.row.beanMap.pk_org_ref ? scope.row.beanMap.pk_org_ref[scope.row.pk_org]["name"] : "";
                let deptName = scope.row.beanMap.pk_dept_ref ? scope.row.beanMap.pk_dept_ref[scope.row.pk_dept]["name"] : "";
                let $url = "/hrhi/psndoc?funcode=60070psninfo&pk_org=" + scope.row.pk_org + " &pk_dept="  + scope.row.pk_dept + "&pk_post="+scope.row.pk_post+"&post_name="+scope.row.postname+"&org_name=" +orgName + " &dept_name="  + deptName;
                this.$router.push( $url );
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
            showCancelChange(e){
                this.request();
            },
        }
    };
</script>
<style>
    #uiPostJoinId .postinfo-join-p{
        font-size: 14px;
        color: #333333;
        line-height: 14px;

    }
    #uiPostJoinId .postinfo-join-div{
        display:inline-block;
        padding-right:50px;
        max-height: 32px;
        padding-top: 9px;
        padding-bottom: 9px;
    }
    #uiPostJoinId .el-checkbox__inner {
        position:relative;
        top:-5px;
    }
</style>
