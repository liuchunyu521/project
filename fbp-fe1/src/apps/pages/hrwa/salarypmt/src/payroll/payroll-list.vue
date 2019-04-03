<template>
    <ifbp-page>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <div class="fl">
                <hr-org-cascader name="hrwapayrolllist"
                            :pk_org="pk_org"
                            @update:pk_org="updateOrgPk"
                            :needDept="false"
                            @change="handleTreeChange"
                            busiRegion="salary"
                            >
            </hr-org-cascader>
            </div>
            
            <ifbp-search class="fr"
                        :no-breadcrumb-search="true"
                        :template-code="psndocSearchCode"
                        @search="handleSearch">
            </ifbp-search>
            
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">

             <div class="ifbp-btn-line">
                <div class="fr">
                    <el-button type="text" @click="addPayroll">新增</el-button>
                    <el-button type="text"  @click="showTableSetting">设置</el-button>
                </div>    
            </div>

            <div>
                <!-- UI模板组件 -->
                <ifbp-template  ref="ref_payroll_l"
                                tpl-id="listPanel"
                                :tpl-data="tableData"
                                :table-show-menu="false"
                                :editable="false"
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
            </div>    
        </ifbp-main-area>
    </ifbp-page>
</template>

<script>
  
  // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
   
    export default {
        mixins: [pageModelMixin],
        components: {
            HrOrgCascader,
        },
        
        data() {
            var vm = this;
            return {
                // 查询模板编码
                psndocSearchCode: '60170psndoc',
                pk_org:'',
                selectedTreeNode:[],
                showEnd:false,
                defaultorgpk:'',
                searchTemplate:{},
                
                // UI模板传入参数
                // pk_temptable: "0001AA1000000000XQIM",
                tableData: [],
                orgTreeData:[],
                dialogAllotVisible: false,
                confirmVisible: false,
                psndocMessage: "",
                search_input: '',
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,

                //默认的页码和每页行数
                defaultPage:1,
                defaultSize:10,

                // 是否显示批量删除按钮
                showDeleteButton: false,
                // 是否显示删除dialog
                delDialogVisible: false,
                multiDelDialogVisible: false,
                dialogFormVisible: false,
                pk_tbm_psndoc: "",
                delData: null,
                rowdata: null,
                unsealdate: null,
                unsealurl: null,
                className: null,
                classPeriod: null
            };
        },
        created() {
            // this.getOrgTreeData();
        },
        methods: {
            ifbpPageInit(){
                this.request(this.currentPage, this.size);
            },
            // 请求数据
            request(n, s) {
                var url = "/hrwa/payroll/pageList";
                let param = {
                    pn:  n,
                    ps: s,
                    pk_org:this.pk_org,

                };
                this.$http({
                    url: url,
                    method: "post",
                    data:this.searchTemplate,
                    params:param,
                })
                .then((res) => {
                    if(res.data.data){
                        this.$refs.ref_payroll_l.setTableData(res.data.data.content);
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                    }else{
                        this.$refs.ref_payroll_l.setTableData(null);
                    }
                    
                })
                .catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
            },
            addPayroll(){
                this.$router.push("/hrwa/payroll/detail/" +'1001AA1000000000JHE4');
            },
            handleSearch(searchTemplate){
                this.searchTemplate = searchTemplate;
                this.request(this.currentPage, this.size);
            },
        
            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
                this.size = parseInt(val);
                this.currentPage = 1;
                // sessionStorage.setItem('hrtapsndoc-pageSize',  parseInt(val));
                // sessionStorage.setItem('hrtapsndoc-currentPage', this.currentPage);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.currentPage = parseInt(val);
                this.request(this.currentPage, this.size);
                
                // sessionStorage.setItem('hrtapsndoc-currentPage', this.currentPage);
            },

            //字段显示设置
            showTableSetting(){
                this.$refs.ref_psndoc_l.setTransferVisible(true);
            },

            updateOrgPk(val){
                this.pk_org = val;
            },
             //组织树切换组织
            handleTreeChange() {
                this.currentPage = 1;
                this.request(this.currentPage,this.size);
            },
        }
    };
</script>

<style>
</style>

