<!--
  作者：liyn11
  时间：2018-08-15
  支持：假期查询-当前假期类型列表
-->
<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb :name="leave_name_show"  ></ifbp-breadcrumb>


        <ifbp-button-area>
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="tplCode"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_leaveslists"
                           tpl-id="tbm_leaves_list_id"
                           class="uitemplate-no-top"
                           :tpl-data="leaveshData"
                           :tplResetFun="leavehResetFun"
                           :methods="formMethods"

            >
            </ifbp-template>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>
    import  pageModelMixin from '../../../../../common/pageModelMixin.js';

    export default {
        mixins : [pageModelMixin],
        data() {

            const vm = this;
            return {
                tplCode:'hrta_leaveh_tpl',

                treeTableTree: [],
                //接受后台判断是否有附件
                reqFileExist: {},
                // 查询模板传入参数
                //tplCode: 'leavesSearchTpls',
                searchTemplate: {},
                leaveshData: {
                },

                formMethods: {

                },
                leavehResetFun: function ($node) {
                // @undo-table-click="billdetailClick"
                    // let $table = this.getTableDom($node);
                    // let detail = [{
                    //     title: "单据明细",
                    //     icon: "undo",
                    // }];
                    // 设置审核状态
                    let $approve_state = $node.find("[prop='approve_state']");
                    $approve_state.attr('render-type', 'default');
                    $approve_state.html(
                        '<template scope="scope">' +
                        '<span v-if="scope.row.approve_state==-1" style="color: #fff;display: inline-block;background:#4BD762;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">自由</span>' +
                        '<span v-if="scope.row.approve_state==0" style="color: #fff;display: inline-block;background:#FF0000;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">审批未通过</span>' +
                        '<span v-if="scope.row.approve_state==1" style="color: #fff;display: inline-block;background:#4BD762;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">审批通过</span>' +
                        '<span v-if="scope.row.approve_state==2" style="color: #fff;display: inline-block;background:#4BD762;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">审批中</span>' +
                        '<span v-if="scope.row.approve_state==3" style="color: #fff;display: inline-block;background:#4BD762;line-height: 24px;text-align: center;padding: 0 10px;border-radius: 4px;">提交</span>' +

                        '</template>'
                    );


                    // var operateHtml = this.getTableOperateHtml(detail);
                    // $table.append(operateHtml);
                    // return $node[0].outerHTML;

                },
                search_input: '',
                //获取部门联查岗位URL参数
                pk_leavetype: this.$route.query['pk_leavetype'],
                timeitemname:this.$route.query['timeitemname'],
                curyear:this.$route.query['curyear'],
                curmonth:this.$route.query['curmonth'],
                periodflag:this.$route.query['periodflag'],
                timeitemunit:this.$route.query['timeitemunit']
            };
        },
        created() {
            this.request();
        },
        computed: {
            leave_name_show:function () {
                return this.timeitemname+"明细";
            }
        },
        methods: {

            request() {

                let param = {
                    pk_leavetype: this.pk_leavetype,
                    curyear:this.curyear,
                    curmonth:this.curmonth,
                    periodflag:this.periodflag,     // true 期间  false 年
                    timeitemunit:this.timeitemunit  //0 天  1小时
                };
                this.$http({
                    url: '/hrss/ta/leaveBalances/getLeavesLists',
                    method: "post",
                    data: this.searchTemplate,
                    params: param,
                }).then((res) => {
                    if (res.data.status === true) {

                        this.$refs.ref_leaveslists.setData(
                            'hrtaleave_t',
                            res.data.data
                        );
                    } else {
                        this.$message({message: res.data.msg, type: "warning"});
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
                this.request();
            },
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.refreshTableList();
            },
            //刷新table
            refreshTableList: function () {
                this.requestForSearch();
            },
            //单据明细点击事件
            billdetailClick(scope){
                this.$router.push("/hrss/leaveapply/" + scope.row.pk_leaveh+"/?funcode=60420leaveapply");
            },
        }
    };
</script>
<style>

</style>
