<template>
    <ifbp-page>
        <ifbp-breadcrumb name="个别调薪申请单据列表"></ifbp-breadcrumb>


        <!-- 主体区域  :pkTemp="templatePk"
                                   show-type="table"-->
        <ifbp-main-area type="list">

                    <ifbp-template ref="applist"
                                   tpl-id="adjustapplyinfo"

                                   :tplResetFun="tableResetFun"
                                   @edit-table-click="tableEditClick"
                                   @publish-table-click="tableCommitClick"
                                   @bottom-table-click="tableCallBackClick"
                                   @delete-table-click="tableDeleteClick"
                                   :methods="tableMethods"
                    >
                    </ifbp-template>
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
        mixins: [pageModelMixin],


        data() {
       var that = this;
            return {
                templatePk : "0001A9100000000200PL",
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,

                tableResetFun: function($node) {
                    let code = $node.find("[prop='billcode']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click="billCodeClick(scope)">{{scope.row.billcode}}</a>' +
                        '</template>'
                    );

                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit',
                        vif:"scope.row.confirmstate == -1"
                    },{
                        title: '提交',
                        icon: 'publish',
                        vif:"scope.row.confirmstate == -1"
                    },{
                        title: '收回',
                        icon: 'bottom',
                        vif:"scope.row.confirmstate == 3"
                    },{
                        title: '删除',
                        icon: 'delete',
                        vif:"scope.row.confirmstate == -1"
                    }];

                    var $table = this.getTableDom($node);
                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                tableMethods :{
                    billCodeClick(scope){

//                        var queryParma = {pk_psnapp:scope.row.pk_psnapp,funcode:'60130adjapply'};
//                        this.$router.push(  "/hrwa/psndocwadoc/adjustApplyDetail/"+scope.row.pk_psnapp+"/true?funcode=60130adjapply" ) ;

                        that.$router.push(  "/hrwa/adjustapply/adjustApplyDetail/"+scope.row.pk_psnapp+"/false?funcode=60130adjapply" ) ;
                    }
                }
            }
        },
        mounted() {
            this.request();
        },
        methods: {
            tableEditClick(scope){
//                var queryParma = {pk_psnapp:scope.row.pk_psnapp,funcode:'60130adjapply'};
//                this.$router.push({path:"/hrwa/psndocwadoc/adjustApplyCard", query:queryParma}) ;
                this.$router.push(  "/hrwa/adjustapply/adjustApplyDetail/"+scope.row.pk_psnapp+"/true?funcode=60130adjapply" ) ;

            },
            tableCommitClick(scope){
                this.$http({
                    url:"/hrwa/psndocwadoc/adjustapply/tablecommit",
                    method: "post",
                    data: {
                        head :JSON.parse(JSON.stringify(scope.row)),
                    }
                }) .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });

                         this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }) .catch(() => {
                    this.$message({
                        message: "提交失败",
                        type: "error"
                    });
                });
            },
            tableCallBackClick(scope){
                this.$http({
                    url:"/hrwa/psndocwadoc/adjustapply/tablecallback",
                    method: "post",
                    data: {
                        head :JSON.parse(JSON.stringify(scope.row)),
                    }
                }) .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });

                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }) .catch(() => {
                    this.$message({
                        message: "收回失败",
                        type: "error"
                    });
                });
            },
            tableDeleteClick(scope){
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,

                    type: 'warning'
                }).then(() => {
                    this.delete(scope);
                }).catch(() => {
                    // 这里加取消逻辑
                });
            },
            delete(scope){
                this.$http({
                    url:"/hrwa/psndocwadoc/adjustapply/tabledelete",
                    method: "post",
                    data: {
                        head :JSON.parse(JSON.stringify(scope.row)),
                    }
                }) .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });

                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }) .catch(() => {
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                });

            },
            request(n,s){
                var pn = 1;
                var ps =10 ;

                if(n){
                    pn = n;
                }
                if(s){
                    ps = s;
                }
                let url =
                    "/hrwa/psndocwadoc/adjustapply/query";
                this.$http({
                    url: url,
                    method: "post",
                    data :{
                        pn : pn,
                        ps : ps,
                    },

                })
                    .then((res) => {
                        if(res.data.status === true){
                            this.$refs.applist.setData(
                                "Psnappaprove_t",
                                res.data.data.content
                            );

                            this.totalElements = res.data.data.totalElements;
                            this.size = res.data.data.size;
                            this.currentPage = res.data.data.number;
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }


                    })
                    .catch(() => {

                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            handleSizeChange(val) {
                this.request(1, val);
            },
            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },
        }


    };
</script>
