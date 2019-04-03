<!--
	wangruie
	时间：2018-12-14
	描述：住房租金列表
-->
<template>
     <ifbp-page>
        <!-- 按钮区域 -->
        <ifbp-button-area :no-breadcrumb="true">
            <div class="fl">
                <el-cascader
                        v-if="orgTreeData && orgTreeData.length"
                        ref="treeCascader"
                        expand-trigger="hover"
                        :options="orgTreeData"
                        v-model="selectedTreeNode"
                        :show-all-levels="false"
                        placeholder="请选择组织"
                        :not-leaf-selectable="true"
                        @change="handleTreeChange">
                </el-cascader>
            </div>
            
            <ifbp-search-dialog class="fr"
				        ref="testSetOption"
				        :template-code="searchCode"
				        :dialog-title="dialogTitle"
				        @search="handleSearch"
			        >
                    </ifbp-search-dialog>
            
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">

             <div class="ifbp-btn-line">
                <div class="fr">
                    <el-button type="text" @click="addbill">新增</el-button>
                    <!-- <el-button type="text"  @click="showTableSetting">设置</el-button> -->
                </div>    
            </div>

            <div>
                <!-- UI模板组件 -->
                <ifbp-template  ref="ref_rendas_l"
                                tpl-id="rendas-list"
                                :tpl-data="tableData"
                                :table-show-menu="false"
                                :editable="false"
                                :methods="tableFormMethods"
                                :tplResetFun="chlideduTableResetFun"
                                 @edit-table-click="tbleEditClick"
                                 @delete-table-click="tbleDeleteClick"
                                 @publish-table-click="tableCommitClick"
                                @bottom-table-click="tableCallbackClick"
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
    export default {
        mixins: [pageModelMixin],
        
        data() {
        	const rendasDetailThis = this;
            return {  
            	 // 查询模板编码
            searchCode: 'rendas-query',
            dialogTitle: '过滤',
            pk_org: '',
            selectedTreeNode: [],
            showEnd: false,
            defaultorgpk: '',
            searchTemplate: {},

            orgTreeData: [],

            tableData: {},
            chlideduTableResetFun: function ($node) {
                // 申请单编码
                let billcode = $node.find("[prop='billcode']");
                billcode.html(
                    '<template scope="scope">' +
                    '<a href="javascript:void(0);" @click="rendasDetailClick(scope)">{{scope.row.billcode}}</a>' +
                    '</template>'
                );

                var operateArr = [{
                    title: '编辑',
                    icon: 'edit',
                    vif: "scope.row.billstate == -1"
                }, {
                    title: '提交',
                    icon: 'publish',
                    vif: "scope.row.billstate == -1"
                },
                {
                    title: '收回',
                    icon: 'bottom',
                    vif: "scope.row.billstate == 3"
                },
                {
                    title: '删除',
                    icon: 'delete',
                    vif: "scope.row.billstate == -1"
                }];

                var $table = this.getTableDom($node);
                var operateHtml = this.getTableOperateHtml(operateArr);
                $table.append(operateHtml);

                return $node[0].outerHTML;
            },
            tableFormMethods: {
                // 点击行超链接事件
                rendasDetailClick: function (scope) {
                    rendasDetailThis.detailPage(scope.row.pk_rendas_h);
                },
            },
            // 分页组件传入参数
            totalElements: 0,
            currentPage: 1,
            size: 10,

            //默认的页码和每页行数
            defaultPage: 1,
            defaultSize: 10,
            };
        },
//       mounted() {
//	        this.request(this.currentPage, this.size);
//	    },
	    created() {
	        this.getOrgTreeData();
	    },
        methods: {
                   handleSearch(searchTemplate) {
		            this.searchTemplate = searchTemplate;
		            this.request(this.currentPage, this.size);
		        },
		        // table行的编辑操作
		        tbleEditClick(scope) {
		            this.detailPage(scope.row.pk_rendas_h);
		        },
		        // table行的删除操作
		        tbleDeleteClick(scope) {
		            this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
		                closeOnClickModal: false,
		                type: 'warning'
		            }).then(() => {
		                this.delbill(scope.row.pk_rendas_h)
		            }).catch(() => {
		                // 这里加取消逻辑
		            });
		        },
		        delbill(pk) {
		            //删除
		            this.$http({
		                url: "/hrwa/spetax/rendas/delete",
		                method: "post",
		                data: {
		                    pk_rendas_h: pk
		                }
		            })
		                .then((res) => {
		                    if (res.data.status === true) {
		                        this.$message({ message: res.data.msg, type: "success" });
		                        this.request(this.currentPage, this.size);
		                    } else {
		                        this.$message({ message: res.data.msg, type: "error" });
		                    }
		                })
		                .catch(e => {
		                    this.$message({ message: "请求失败:" + res, type: "error" });
		                });
		        },
		        // table行的提交操作
		        tableCommitClick(scope) {
		            //提交
		            this.$http({
		                url: "/hrwa/spetax/rendas/commit",
		                method: "post",
		                data: {
		                    pk_rendas_h: scope.row.pk_rendas_h
		                }
		            }).then(res => {
		                if (res.data.status === true) {
		                    this.$message({ message: res.data.msg, type: "success" });
		                    this.request(this.currentPage, this.size);
		                } else {
		                    this.$message({ message: res.data.msg, type: "error" });
		                }
		            }).catch(() => {
		                this.$message({
		                    message: "提交失败",
		                    type: "error"
		                });
		            });
		        },
		        // table行的提交操作
		        tableCallbackClick(scope) {
		            this.$confirm('确认收回该数据？', '提示', {
		                closeOnClickModal: false,
		                type: 'warning'
		            }).then(() => {
		                this.callbackBill(scope)
		            }).catch(() => {
		                // 这里加取消逻辑
		            });
		        },
		        callbackBill(scope) {
		            //收回
		            var obj = {};
		            obj.param_note = "recall";
		            var param = JSON.stringify(obj);
		            this.$http({
		                url: "/riart/fbpworkflows/doAction",
		                method: "post",
		                data: {
		                    action: "recall",
		                    param: param,
		                    billType: "TAX1",
		                    billId: scope.row.pk_rendas_h,
		                    agentuserId: "",
		                    pk_checkflow: ""
		                }
		            }).then(res => {
		                if (res.data.status === true) {
		                    this.$message({ message: "收回成功", type: "success" });
		                    this.request(this.currentPage, this.size);
		                } else {
		                    this.$message({ message: "收回失败", type: "error" });
		                }
		            }).catch(() => {
		                this.$message({
		                    message: "收回失败",
		                    type: "error"
		                });
		            });
		        },
		        // 详情页面跳转
		        detailPage: function (pk) {
		            this.$router.push("/hrwa/spetax/rendas/detail/" + pk);
		        },
		        request(n, s) {
		            var url = "/hrwa/spetax/rendas/pageList";
		            let param = {
		                pn: n,
		                ps: s,
		                pk_org: this.pk_org,
		
		            };
		            this.$http({
		                url: url,
		                method: "post",
		                data: this.searchTemplate,
		                params: param,
		            })
		                .then((res) => {
		                    if (res.data.data && res.data.data.content != null) {
		                        this.$refs.ref_rendas_l.setTableData(res.data.data.content);
		                        this.totalElements = res.data.data.totalElements;
		                        this.size = res.data.data.size;
		                    } else {
		                        this.$refs.ref_rendas_l.setTableData(null);
		                    }
		
		                })
		                .catch(() => {
		                    this.$message({
		                        message: "信息获取失败",
		                        type: "error"
		                    });
		                });
		        },
		        addbill() {
		            this.$router.push("/hrwa/spetax/rendas/detail/");
		        },
		
		        // 翻页标签改变每页显示数据
		        handleSizeChange(val) {
		            this.request(1, val);
		            this.size = parseInt(val);
		            this.currentPage = 1;
		        },
		
		        // 翻页标签改变当前页
		        handleCurrentChange(val) {
		            this.request(val, this.size);
		            this.currentPage = parseInt(val);
		        },
		        //获取组织树数据
		        getOrgTreeData() {
		            this.$http({
		                url: '/hrwa/payroll/getOrgTreeData',
		                method: "post",
		                //                    data: this.searchTemplate,
		                params: '',
		            }).then((res) => {
		                if (res.data.success) {
		                    this.orgTreeData = res.data.data.orgtreedata;
		                    let defaultnode = res.data.data.defaultorgpk;
		                    this.defaultorgpk = defaultnode[defaultnode.length - 1];
		
		                    this.pk_org = this.defaultorgpk;
		
		                    let size = this.defaultSize;
		                    let page = this.defaultPage;
		
		                    this.selectedTreeNode = res.data.data.defaultorgpk;
		                    this.request(parseInt(page), parseInt(size));
		                    this.size = parseInt(size);
		                    this.currentPage = parseInt(page);
		                } else if (res.data.error && res.data.error.errorMessage) {
		                    console.log('树获取失败', JSON.stringify(res.data.error));
		                    this.$message({
		                        message: '树获取失败: ' + res.data.error.errorMessage,
		                        type: 'error'
		                    });
		                }
		            }).catch((e) => {
		                console.log(e);
		                this.$message.error('请求出错');
		            });
		        },
		        handleTreeChange(treeItem) {
		            if (Array.isArray(treeItem) && treeItem.length) {
		                let pk_org = treeItem[treeItem.length - 1];
		                this.pk_org = pk_org;
		                this.size = this.defaultSize;
		                this.currentPage = this.defaultPage;
		
		                this.request(this.currentPage, this.size);
		            } else {
		                this.pk_org = '';
		            }
		        }, 
        }
    };
</script>

<style>
</style>