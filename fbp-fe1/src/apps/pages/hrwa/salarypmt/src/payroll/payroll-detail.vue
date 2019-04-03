<template>
    <ifbp-page>
        <ifbp-breadcrumb name="发放申请" v-show="false"></ifbp-breadcrumb>
        <ifbp-button-area :no-breadcrumb="true"></ifbp-button-area>
        <ifbp-main-area type="detail">
            <ifbp-panel  v-if="isinitiateFlowShow">
                <initiateFlow ref="initfolwRef" class="fl" :billId="pk_payroll" billType="6302"
                            :showBtn='true' @isRecall="getIsRecall" agentuserId="" ></initiateFlow>
            </ifbp-panel>

     
            <!-- 主表编辑页签 -->
            <ifbp-panel id="basePanel"  class="titleLine">
                <ifbp-template ref="ref_payroll"
                            tpl-id="headPanel"
                            :editable="editable"
                            :tpl-data="payrollData"
                            :tplResetFun="payrollResetFun"
                            :methods="payrollFormMethods"
                >
                </ifbp-template>
            </ifbp-panel>
            
            <ifbp-panel id="subPanel"  class="titleLine" style="margin-bottom:50px">
                <el-tabs v-model="activeName" @tab-click="tabsClick" :tab-position-top = true>
                    <div slot="header" style="float: right;"  v-if="issearchDialog">
                            <ifbp-search-dialog
                                ref="testSetOption"
                                :template-code="templateCode"
                                :dialog-title="dialogTitle"
                                @search="handleSearch"
                                
                            >
                            </ifbp-search-dialog>
                        </div>

                    <el-tab-pane label="员工明细" name="first">
                        <!-- UI模板组件 -->
                        <ifbp-template  ref="ref_psndoc_l"
                                tpl-id="psnList"
                                :tpl-data="psnListData"
                               
                                class="uitemplate-no-top"
                                :table-show-menu="true"
                                :tplResetFun="psnListResetFun"
                                :editable="false"
                                :methods="tableMethods"
                            >
                        </ifbp-template>
                        <el-pagination
                            @size-change="handleSizeChangePsn"
                            @current-change="handleCurrentChangePsn"
                            :current-page="currentPagePsn"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="sizePsn"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElementsPsn">
                        </el-pagination>
                    </el-tab-pane>
                    <el-tab-pane label="部门明细" name="second">
                        <!-- UI模板组件 -->
                        <ifbp-template  ref="ref_deptdoc_l"
                                tpl-id="deptList"
                                :tpl-data="deptListData"
                                class="uitemplate-no-top"
                                :table-show-menu="true"
                                :tplResetFun="deptListResetFun"
                                :editable="false"
                                :methods="tableMethods"
                            >
                        </ifbp-template>
                        <el-pagination
                            @size-change="handleSizeChangeDept"
                            @current-change="handleCurrentChangeDept"
                            :current-page="currentPageDept"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="sizeDept"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElementsDept">
                        </el-pagination>
                    </el-tab-pane>
                </el-tabs>
            </ifbp-panel>
        </ifbp-main-area>
        <ifbp-footer >
            <el-button @click="delbill" v-show="isDelbill">删除</el-button>
            <el-button @click="printTemplate">打印</el-button>
            <el-button type="primary"  @click="commitbill" v-show="isCommitbill">提交</el-button>
        </ifbp-footer>
    </ifbp-page> 
</template>
<script>

//引入流程图
// import initiateFlow from '../../../../../common/flow/src/initiateFlow.vue'
import initiateFlow from 'ifbp-business/initiateFlow';
// 引入页面定制需要的方法
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
    mixins: [pageModelMixin],
    components: {
        initiateFlow: initiateFlow
    },
    data() {
        let vm = this;
        let pk_payroll = this.$root.$router.currentRoute.params['pk_payroll'];
        return {
            issearchDialog:true,
            templateCode: '60130paydata1apply',
            dialogTitle: "过滤",
            customerClass: ["customer-search-dialog"],
            searchTemplate: {
                // ...
            },
            isinitiateFlowShow: false,
            pk_payroll: pk_payroll,
            pk_org: '',
            // ifbp-panel-group所需参数
            scrollDom: "ifbpScrollDom",
            activeName: "first",
            editable: false,
            payrollData: {},
            psnListData: {},
            deptListData: {},
            isCommitbill: false, //默认提交按钮不显示
            isDelbill: false,
            items: [],

            totalElementsPsn: 0,
            currentPagePsn: 1,
            sizePsn: 10,
            totalElementsData: null,
            totalElementsDept: 0,
            currentPageDept: 1,
            sizeDept: 10,
            sumdataall:[],
            tableMethods: {
                getTopSummaries(param) {
                    const { columns, data } = param;
                    const sums = [];
                    columns.forEach((column, index) => {
                        if (index === 0) {
                            sums[index] = '合计';
                            return;
                        }
                        let columnValue;

                        var temp = column.property;
                        var col = vm.totalElementsData[0];

                        if(column.property &&  column.property.indexOf("f_")==0 && column.renderType=="number"){
                            sums[index] = col[column.property];
                        }
                    });

                    return sums;
                },
            },

            payrollResetFun: function ($node) {
                // var $psnidlab = $node.find("[prop='psnid']");
                // $psnidlab.attr("v-show", "psnidshow");
                // var $psnid = $node.find("[v-model='payroll.psnid']");
                // $psnid.attr('v-on:change', 'selectPsnid');
                return $node[0].outerHTML;
            },

            psnListResetFun: function ($node) {
                let $table = this.getTableDom($node);
                $table.attr(":top-summary-method", "getTopSummaries");
                $table.attr("show-top-summary", "");
                $table.attr(":disable-tooltip", "true");
                for (var i = 0; i < vm.items.length; i++) {
                    let itemtype = "default";
                    if(vm.items[i].itemkey.indexOf("f_")==0 && vm.items[i].iitemtype == "0"){
                        itemtype = "number";
                    }

                    $table.append('<el-table-column  render-type="'+itemtype+'" align="left" header-align="left" prop="' + vm.items[i].itemkey + '" label="'
                        + vm.items[i].name + '" width="150" decimals="'+vm.items[i].iflddecimal+'" ></el-table-column>')
                }

                return $node[0].outerHTML;
            },



            deptListResetFun: function ($node) {
                let $table = this.getTableDom($node);
                $table.attr(":top-summary-method", "getTopSummaries");
                $table.attr("show-top-summary", "");
                $table.attr(":disable-tooltip", "true");
                for (var i = 0; i < vm.items.length; i++) {
                    let itemtype = "default";
                    let decimalsstr = " ";
                    if(vm.items[i].itemkey.indexOf("f_")==0 && vm.items[i].iitemtype == "0"){
                        itemtype = "number";
                    }

                    $table.append('<el-table-column  render-type="'+itemtype+'" align="left" header-align="left" prop="' + vm.items[i].itemkey + '" label="'
                        + vm.items[i].name + '" width="150" decimals="'+vm.items[i].iflddecimal+'" ></el-table-column>')
                }
                return $node[0].outerHTML;
            },
            payrollFormMethods: {

            },
        };
    },
    // created(){

    //     var getItemkey = this.getItemkey();
    //     this.initPromise(getItemkey);
    // },
    mounted() {
        var getItemkey = this.getItemkey();
        this.initPromise(getItemkey);
    },
    methods: {
    //页签切换
      tabsClick: function (tab) {
        if('second' == tab.name){
            this.issearchDialog = false;
        }else{
            this.issearchDialog = true;
        }
      },
        handleSearch(searchTemplate) {
            debugger;
            this.searchTemplate = searchTemplate;
            this.requestPsn(1, this.sizePsn);
        },
        printTemplate: function () {
            // let param = {
            //     billid: this.pk_hi_stapply,
            // };
            // this.printPre("60090dimissionapply", "dimissionapply-print-template", param);
        },
        commitbill() {
            this.$http({
                url: "/hrwa/payroll/commit",
                method: "post",
                data: this.payrollData.payroll
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.request(this.currentPage, this.size);
                        this.$message({
                            message: "提交成功",
                            type: "success"
                        });
                        // this.isCommitbill = false;
                        var queryParma = { funcode: '60130payslipaly' };//,datastate:datastate
                        this.$router.push({ path: "/hrwa/payroll/detail/" + res.data.data.pk_payroll + "?funcode=60130payslipaly", queryParma: queryParma });


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
                        message: "catc",
                        type: "error"
                    });
                });
        },
        delbill() {
            this.$http({
                url: "/hrwa/payroll/delete",
                method: "post",
                data: this.payrollData.payroll
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.request(this.currentPage, this.size);
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.$context.getApp().back(1);
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
                        message: "catc",
                        type: "error"
                    });
                });
        },
        getIsRecall(isrecall) {
            if (isrecall) {
                this.request();
                this.$refs.initfolwRef.doParams();
            }
        },
        afterApprove(action) {

            if (action == "agreeAble") {

            }
        },
        afterApprove(action) {

            if (action == "agreeAble") {

            }
        },
        initPromise(request) {
            Promise.all([request]).then(() => {
                this.request();
            });
        },
        getItemkey() {
            return this.$http({
                url: "/hrwa/payroll/getWaClassItem/" + this.$root.$router.currentRoute.params['pk_payroll'],
                method: "get",
            })
                .then((res) => {
                    if (res.data.data) {
                        this.items = res.data.data;
                        this.$refs.ref_psndoc_l.init();
                        this.$refs.ref_deptdoc_l.init();
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
        },

        request() {
            this.$http({
                url: "/hrwa/payroll/getById/" + this.$root.$router.currentRoute.params['pk_payroll'],
                method: "get",
            })
                .then((res) => {
                    if (res.data.data) {
                        debugger
                        this.$refs.ref_payroll.setFormData(res.data.data);
                        this.$refs.ref_psndoc_l.setTableData(res.data.data.psnList);
                        this.$refs.ref_deptdoc_l.setTableData(res.data.data.deptList);
                        this.totalElementsPsn = res.data.data.totalElementsPsn;
                        this.totalElementsDept = res.data.data.totalElementsDept;
                        this.totalElementsData = res.data.data.totalElementsData;

                        //设置按钮显示
                        if (res.data.data.billstate == -1) {
                            this.isCommitbill = true;
                            this.isDelbill = true;
                            this.isinitiateFlowShow = false;
                        } else {
                            this.isinitiateFlowShow = true;
                        }

                    } else {
                        this.$refs.ref_psndoc_l.setTableData(null);
                        this.totalElementsPsn = 0;
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
        },
        // 翻页标签改变每页显示数据
        handleSizeChangePsn(val) {
            this.requestPsn(1, val);
            this.sizePsn = parseInt(val);
            this.currentPagePsn = 1;

        },
        // 翻页标签改变当前页
        handleCurrentChangePsn(val) {
            this.requestPsn(val, this.sizePsn);
            this.currentPagePsn = parseInt(val);
        },

        // 翻页标签改变每页显示数据
        handleSizeChangeDept(val) {
            this.requestDept(1, val);
            this.sizeDept = parseInt(val);
            this.currentPageDept = 1;

        },
        // 翻页标签改变当前页
        handleCurrentChangeDept(val) {
            this.requestDept(val, this.sizeDept);
            this.currentPageDept = parseInt(val);
        },
        //查询人员明细
        requestPsn(n, s) {
            var url = "/hrwa/payroll/pageListPsn";
            let data = {
                pn: n,
                ps: s,
                pk_payroll: this.pk_payroll,
                searchTemplate:this.searchTemplate
            };
            this.$http({
                url: url,
                method: "post",
                data: data
            })
                .then((res) => {
                    if (res.data.data) {
                        // this.$refs.ref_psndoc_l.setTableData(res.data.data.psnList);
                        // this.totalElementsPsn = res.data.data.totalElementsPsn;
                        // this.totalElementsData = res.data.data.totalElementsData;
                        debugger
                        this.$refs.ref_psndoc_l.setTableData(res.data.data.psnList.content);
                        this.totalElementsPsn = res.data.data.psnList.totalElements;
                        this.sizePsn = res.data.data.psnList.size;
                        this.totalElementsData = res.data.data.totalElementsData;
                    } else {
                        this.$refs.ref_psndoc_l.setTableData(null);
                        this.totalElementsPsn = 0;
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
        },
        //查询部门明细
        requestDept(n, s) {
            var url = "/hrwa/payroll/pageListDept";
            let param = {
                pn: n,
                ps: s,
                pk_payroll: this.pk_payroll,
            };
            this.$http({
                url: url,
                method: "post",
                params: param,
            })
                .then((res) => {
                    if (res.data.data) {
                        debugger
                        this.$refs.ref_deptdoc_l.setTableData(res.data.data.content);
                        this.totalElementsDept = res.data.data.totalElements;
                        this.sizeDept = res.data.data.size;
                         this.totalElementsData = res.data.data.totalElementsData;
                    } else {
                        this.$refs.ref_deptdoc_l.setTableData(null);
                        this.totalElementsDept = 0;
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
        },
    }
};
</script>
