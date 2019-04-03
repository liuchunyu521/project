<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="员工定薪"  v-show="false"></ifbp-breadcrumb>
       
        <!-- 按钮区域 -->
        <ifbp-button-area  :no-breadcrumb="true">
            <hr-org-cascader name="hrwawaclasslist"
                            :pk_org="pk_org"
                            @update:pk_org="updateOrgPk"
                            :needDept="false"
                            @change="handleTreeChange"
                            :needGroup="true"
                            busiRegion="salary"
                            >
            </hr-org-cascader>
          
            <ifbp-search class="fr"
                        :no-breadcrumb-search="true"
                        :template-code="psndocwadocSearchCode"
                        @search="handleSearch">
            </ifbp-search>
            
        </ifbp-button-area>
        
        <!-- 主体区域 -->
        <ifbp-main-area type="list">

            <div class="fl">
	            <span class="ifbp-layout-content-left-span">薪资方案</span>
          	</div>
            <div align="right" class="top-button">
                <el-button type="text" v-for="item in mainTitleBtns"  @click="triggerClick(item)"  class="ifbp-layout-content-right-button marginleft24" v-text="item.displayname"></el-button>
            </div>
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_psndocwadoc_l"
                           tpl-id="adjustapply-psndoc"
                           class="uitemplate-no-top"

                           :tpl-data="psndocWadocData"

                           :editable="true"
                           :tplResetFun="psndocwadocTableResetFun"
                           :methods="psndocwadocTableMethods"
                           @selection-change="psndocwadocSelectionChange"
                           @edit-table-click="psndocwadocTableEditClick"
            >
                <!--  -->
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

        <ifbp-del-dialog
                v-model="delDialogVisible"
                message="确认删除该数据？删除后无法恢复。"
                @click="deleteClick"
        >
        </ifbp-del-dialog>
    </ifbp-page>
</template>

<script>
    // 引入页面定制需要的方法
     // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
   
    export default {
        mixins: [pageModelMixin,waclassAllotDialog],
        components: {
            HrOrgCascader,
        },

        data() {
            let vm = this;
            //把上次操作这个页面存到session中的数据清除，否则会影响本次操作，有垃圾数据
            sessionStorage.removeItem("applySubData");
            sessionStorage.removeItem("pk_org");
            return {
                // UI模板传入参数
                appPsnBtnDisable: false,
                psndocwadocSearchCode:"60130adjmtc",
                searchTemplate:{},
                psndocWadocData: {},
                psndocwadocTableResetFun: function ($node) {

                    var $table = this.getTableDom($node);
                    $table.attr('v-on:row-dblclick', 'psndocwadocDbClick');

                    // 人员编码
                    let code = $node.find("[prop='psnCode']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click="psndocwadocPsnClick(scope)">{{scope.row.psnCode}}</a>' +
                        '</template>'
                    );
                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit'
                    }];
                    var operateHtml = this.getTableOperateHtml(operateArr);
                    $table.append(operateHtml);

                    return $node[0].outerHTML;
                },
                psndocwadocTableMethods: {
                    psndocwadocDbClick(row){
                        //location.hash = "/hrwa/psndocwadoc/edit" ;
                        $('.tooltip-normal').hide();
                        vm.$router.push("/hrwa/adjustapply/psndocwadoc/edit");

                        sessionStorage.setItem('pk_psndoc', row.pk_psndoc);
                        sessionStorage.setItem('pk_psnjob', row.pk_psnjob);
                    },
                    psndocwadocPsnClick(scope){
                        vm.$router.push("/hrwa/adjustapply/psndocwadoc/edit");
                        sessionStorage.setItem('pk_psndoc', scope.row.pk_psndoc);
                        sessionStorage.setItem('pk_psnjob', scope.row.pk_psnjob);
                    }

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
                pk_wa_class: "",
                delData: null,
                pk_psndoc: null,
                //下面是勾选定薪调薪数据带到定调资申请过程中需要用到的字段
                differentOrg : false,//勾选的数据是否属于同一个组织
                pk_psndoc_subs:'',//选中的定薪调薪数据的主键
                pk_org:'',//选中的定薪调薪数据的组织(组织需要相同)

            };
        },
        created() {
            var page = sessionStorage.getItem("psndocwadoc-currentPage");
            var size = sessionStorage.getItem("psndocwadoc-pageSize");

            if (size == null || size == undefined) {
                size = this.size;
            }
            if (page == null || page == undefined) {
                page = this.currentPage;
            }
            this.request(page, size);
            this.size = parseInt(size);
            this.currentPage = parseInt(page);

        },
        methods: {
            exportExcelTemp(){
//                window.location.href =  "/hrwa/psndocwadoc/downloadExcelTemp?funcode=60130adjmtc";
            },
            request(n, s) {

                var url = "/hrwa/psndocwadoc/pageList";

                let param = {
                    pn:  n||1,
                    ps: s||10,
                };
                this.$http({
                    url: url,
                    method: "post",
                    data:this.searchTemplate,
                    params:param,
                })
                    .then((res) => {

                        if (this.$refs.ref_psndocwadoc_l) {
                            this.$refs.ref_psndocwadoc_l.setTableData(res.data.data.content);
                        } else {
                            this.$set(this.psndocWadocData, "uitemplateTableData", res.data.data.content);
                        }

                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // table行的编辑操作
            psndocwadocTableEditClick(scope) {
                // alert( JSON.stringify(scope.row));
                //location.hash = "/hrwa/psndocwadoc/edit";
                this.$router.push("/hrwa/adjustapply/psndocwadoc/edit");
                sessionStorage.setItem('pk_psndoc', scope.row.pk_psndoc);
                sessionStorage.setItem('pk_psnjob', scope.row.pk_psnjob);
            },

            // table选中改变
            psndocwadocSelectionChange(selection) {
                if(selection){
                    let pk_psndoc_subs = [];
                    let pk_org = selection[0].pk_org;
                    let orgDifferentFalg = false;
                    for(let i=0;i<selection.length;i++){
                        pk_psndoc_subs.push(selection[i].pk_psndoc_sub);
                        if(selection[i].pk_org != pk_org ){

                            orgDifferentFalg = true;
                        }
                    }
                    if(orgDifferentFalg){
                        this.differentOrg = true;
                    }else{
                        this.differentOrg = false;
                        this.pk_psndoc_subs = pk_psndoc_subs;
                        this.pk_org = pk_org;
                    }
                }else{

                    this.differentOrg = false;
                    this.pk_psndoc_subs = '';
                    this.pk_org = '';
                }
            },
            putiaoApply() {
                this.$router.push("/hrwa/adjustapply/putiao");
                sessionStorage.setItem("psndocwadocSearchDto",JSON.stringify(this.searchTemplate));
            },


            importwadoc() {
                alert("导入");
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
                this.size = parseInt(val);
                this.currentPage = 1;
                sessionStorage.setItem('psndocwadoc-pageSize', this.size);
                sessionStorage.setItem('psndocwadoc-currentPage', this.currentPage);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
                this.currentPage = parseInt(val);
                sessionStorage.setItem('psndocwadoc-currentPage', this.currentPage);
            },

            handleSearch(searchTemplate){
                this.searchTemplate = searchTemplate;
                this.request(this.currentPage, this.size);
            },
            showBill(){
                this.$router.push( "/hrwa/adjustapply/adjustapplyinfo?funcode=60130adjapply" ) ;
            },
            specialApply(){
                if(this.differentOrg){
                    this.$message({
                        message: "选中的数据必须有相同的组织",
                        type: 'error'
                    });
                    return ;
                }

                if(this.pk_psndoc_subs&&this.pk_org){
                    this.convert2ApplyVO(this.pk_psndoc_subs,this.pk_org);
                }else{
                    sessionStorage.setItem("hrwaadjust-backnum",1);
                    this.$router.push("/hrwa/adjustapply/adjustApplyAdd?funcode=60130adjapply") ;
                }

            },
            //选择组织后
            updateOrgPk(val){
                this.pk_org = val;
            },
            convert2ApplyVO(pk_psndoc_subs,pk_org){
                var url =
                    "/hrwa/psndocwadoc/adjustapply/applyWithPsn";
                this.$http({
                    url: url,
                    method: "post",
                    data:{
                        pk_psndoc_subs : pk_psndoc_subs
                    },

                })
                    .then((res) => {
                        if(res.data.status === true){

                            let  bodys = res.data.data;
                            let subList =  bodys;
                            sessionStorage.setItem("applySubData",JSON.stringify(subList));
                            sessionStorage.setItem("pk_org",pk_org);
                            sessionStorage.setItem("hrwaadjust-backnum",1);
                            this.$router.push("/hrwa/adjustapply/adjustApplyAdd?funcode=60130adjapply") ;
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
            // 删除处理s
            deleteClick() {
                this.delDialogVisible = false;
                if (this.pk_wa_class === undefined) {
                    return;
                }
                this.$http({
                    url: "/hrwa/psndocwadoc/delete",
                    method: "post",
                    data: this.delData
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            //alert("222222");
                            this.request(this.currentPage, this.size);
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        console.error(e);
                        this.$message({
                            message: "基本信息详情获取失败",
                            type: "error"
                        });
                    });
            }
        }
    };
</script>
