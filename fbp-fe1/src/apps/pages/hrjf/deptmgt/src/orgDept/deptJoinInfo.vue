<template>
    <ifbp-page  id="uideptJoinId">
        <!-- 节点title -->
        <ifbp-breadcrumb name="部门信息"  ></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area  >
            <div class="deptinfo-join-div" v-if="org_name"><p class="deptinfo-join-p" v-text="org_name_show"></p></div>
            <!--显示已撤销-->
            <div class="fr"  style="margin-right: 15px">
                <el-checkbox v-model="showCanceled" @change="showCancelChange" >显示已撤销</el-checkbox>
            </div>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_deptJoin_l"
                           tpl-id="deptJoinTplId"
                           class="uitemplate-no-top"
                           :tpl-data="tableData"
                           :tplResetFun="deptInfoTableResetFun"
                           :methods="formMethods"
                           @assignment-ind-table-click="deptInfoTableLinkAssignment"
                           @people-table-click="deptInfoTableLinkPsn">

            </ifbp-template>
        </ifbp-main-area>
    </ifbp-page>
</template>

<script>
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

    export default {
        mixins : [pageModelMixin],
        data(){
            const vm = this;
            return {
                showCanceled:false,
                // 查询模板传入参数
                tplCode: 'hrWebDeptSTPL',
                showSelectedTags: false,
                // UI模板传入参数
                // deptInfoTablePk: "0001AA10000000009O16",
                isHavAttachment: false,
                tableData: {
                    hrdept: {},
                    isTreeShow: true,
                },
                formMethods: {
                    // table行的点击编码进入非编辑详情页
                    deptTableEditClick(scope) {
                        var pkUrlDept = scope.row.pk_dept
                        if(pkUrlDept){
                            deptInfo$This.$router.push({path: '/hrjf/hrDept/deptDetail', query: {id: pkUrlDept,isEditForPath:false}});
                        }
                    },
                },
                deptInfoTableResetFun: function ($node) {
                    $node.find("[_id='dept_l']").attr(":table-tree", "isTreeShow");

                    // let code = $node.find("[prop='code']");
                    // code.html(
                    //     '<template scope="scope">' +
                    //     '<a href="javascript:void(0);" @click="deptTableEditClick(scope)">{{scope.row.code}}</a> ' +
                    //     '</template>'
                    // );
                    let cancelTab = $node.find("[prop='hrcanceled']");
                    cancelTab.html(
                        '<template scope="scope">' +
                        '<span style="color: #00A753" v-if="scope.row.hrcanceled">是</span>' +
                        '<span  v-if="!scope.row.hrcanceled">否</span>' +
                        '</template>'
                    );
                    $node.find("[prop='checkbox4Dept']").attr("v-if","false");
                    let detail = [
                        {
                            title: "联查岗位",
                            icon: "assignment-ind",
                        },
                        {
                            title: "联查人员",
                            icon: "people",
                        }
                    ];
                    var $table = this.getTableDom($node);

                    var operateHtml = this.getTableOperateHtml(detail);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
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
                //获取联查参数
                pk_org: this.$route.query['pk_org'],
                // 所属组织
                org_name: this.$route.query['org_name']
            };
        },
        computed: {
            org_name_show: function () {
                return "所属组织：" + this.org_name;
            }
        },
        mounted() {
            this.request();
        },

        methods: {
            // 请求数据
            request(n, s, stpl) {
                var url;
                url = '/hrjf/hrDept/pageList';
                var $pn = '1';
                var $ps = '10';
                if (n !== undefined) {
                    $pn = n,
                        $ps = s
                }
                let param = {
                    showCanceled: this.showCanceled
                };

                var deptDto = {
                    "pn": $pn,
                    "ps": $ps,
                    "sortColumn": "code",
                    "searchTemplateAggDto": stpl,
                    "linkCondition":'{"pk_org":"' + this.pk_org +'"}'
                }
                this.$http({
                    url: url,
                    method: "post",
                    dataType: "JSON",
                    data: deptDto,
                    params:param,
                    contentType: "application/json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$refs.ref_deptJoin_l.setData("isTreeShow", res.data.isTreeShow);
//                            this.$refs.ref_dept_l.setTableData(res.data.data);
                            this.$refs.ref_deptJoin_l.setData(
                                "dept_t",
                                res.data.data
                            );
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.refreshList(this.currentPage, this.size, searchTemplate);
            },

            //刷新table
            refreshList: function (pn, ps, stpl) {
                this.request(pn, ps, stpl);
            },


            // 部门列表联查岗位按钮
            deptInfoTableLinkAssignment: function (scope) {
                let orgName = scope.row.beanMap.pk_org_ref ? scope.row.beanMap.pk_org_ref[scope.row.pk_org]["name"] : "";
                let $url = '/hrjf/post/postJoinInfo?funcode=60050post&pk_dept=' + scope.row.pk_dept + '&dept_name=' + scope.row.name + "&org_name=" + orgName;
                this.$router.push($url);
            },
            // 部门列表联查人员按钮
            deptInfoTableLinkPsn: function (scope) {
                let orgName = scope.row.beanMap.pk_org_ref ? scope.row.beanMap.pk_org_ref[scope.row.pk_org]["name"] : "";
                let $url = '/hrhi/psndoc?funcode=60070psninfo&pk_org=' + scope.row.pk_org + '&pk_dept=' + scope.row.pk_dept + "&dept_name=" + scope.row.name + "&org_name=" + orgName;
                this.$router.push($url);
            },
            showCancelChange(e){
                // this.isShowCancel = !this.isShowCancel;
                this.request();
            },
        }
    }
</script>

<style>
    #uideptJoinId   .el-table-attachemnt-icon {
        color: #F7BA2A !important;
    }

    #uideptJoinId .deptinfo-join-p {
        font-size: 14px;
        color: #333333;
        line-height: 14px;
    }
    #uideptJoinId  .deptinfo-join-div{
        display:inline-block;
        padding-right:50px;
        max-height: 32px;
        padding-top: 9px;
        padding-bottom: 9px;
    }
    #uideptJoinId .el-checkbox__inner {
        position:relative;
        top:-5px;
    }

</style>