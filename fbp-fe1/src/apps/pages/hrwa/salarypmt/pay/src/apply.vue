<!--
	作者：wangruie
	时间：2018-10-24
	描述：发放申请
-->
<template>
	<div>
		<ifbp-main-area type="list" class="maringTop0">
			<!--btnisShow 状态是否获取成功来确定显示按钮区域-->
			<div class="ifbp-btn-line" v-if="btnisShow">
				<div class="fl">
					<span class="ifbp-layout-content-left-span">发薪人员({{totalElements}})</span>
				</div>
				<!--<div class="fr">
                    <el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="applyView" v-show="showUnApply">查看申请</el-button>
					<el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="apply" v-show="showApply">申请</el-button>
                    <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="detailCompare">明细对比</el-button>
				    <i class="ifbp-icon-setting marginleft16"  @click="showHeaderSettingcheck" title="设置"></i>
				</div>-->
				<ifbp-btn-line 
	            :text-btn-arr="textBtnArr"
	            :icon-btn-arr="iconBtnArr"
	            :text-align="textAlign"
	            :slot-width="0"
	            style="margin-top:-16px;width: calc(100% - 200px);float: right;">
	                <!--<div slot="search-dialog">-->
	                    <!--<ifbp-search-dialog
					        ref="testSetOption"
					        :template-code="templateCode"
					        :dialog-title="dialogTitle"
					        @search="handleSearch"
				        >
	                    </ifbp-search-dialog>-->
	                <!--</div>--> 
	          </ifbp-btn-line>
				
				
				
			</div>
			<!-- 主体区域 -->
			<!-- UI模板组件 :pk-temp="tablePk" show-type="table-form"-->
			<ifbp-template ref="ref_paydatacheck"
						   tpl-id="paydatacheck"
						   :tpl-data="tableData"
						   :table-show-menu='false'
						   :auto-create="false"
						   :tplResetFun="tableResetFun"
                           :methods="tableMethods"
						   :editable="isEdit"
						   @form-confirm-click="confirm"
						   @form-edit-click = "edit"
						   @form-cancel-click="cancel"
						   :edit-button-show="editShow"
						   @row-click="rowClick"
						   :local-storage-id="pk_wa_class">
				<!--@edit-table-click="tableEditClick">-->
			</ifbp-template>

			<el-dialog
					title="提示"
					:visible.sync="hitVisible"
					size="small">
				<span>hitMsg</span>
				<span slot="footer" class="dialog-footer">
            <el-button @click="hitVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
			</el-dialog>
			<applyDialog ref="applyDialogRef"  :dialogData="intoDocDialogData" ></applyDialog> 

			<!--分页组件-->
			<el-pagination
					v-if="btnisShow"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="size"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalElements">
			</el-pagination>
		</ifbp-main-area>

	</div>
</template>
<script>
import applyDialog from './apply-dialog-edit.vue';
import pageModelMixin from 'ifbp-business/pageModelMixin/index.js';
    import tableHeightMixin from "ifbp-business/tableHeightMixin/index.js";

import IfbpBtnLine from "ifbp-business/ifbpBtnLine";
export default {
    mixins: [pageModelMixin,tableHeightMixin],
    props: ['pk_org', 'pk_wa_class', 'cyear', 'cperiod'],
    components: {
        applyDialog,
        "ifbp-btn-line":IfbpBtnLine
    },
    data() {

        var that = this;

        return {
        	otherHeight:230,
            payrollPk: '',//申请单主键
            // UI模板传入参数
            tablePk: "0001AA10000000006GA8",
            tableData: {
                paydata_c: {
                    f_1: ''
                }

            },
            columnsData: [],
            sumdataall:[],
            selItemDialogVisible:false,
            tableMethods:{
                    getTopSummaries(param) {
                        const { columns, data } = param;
                        const sums = [];
                        
                        let sumdataall = that.sumdataall;
                        columns.forEach((column, index) => {
                            if (column.property=="psncode") {
                                sums[index] = '合计';
                                return;
                            }

                            if(column.property &&  column.property.indexOf("f_")==0 && column.renderType=="number"){
                                sums[index] = sumdataall[0][column.property];
                            }
                            
                        });

                        return sums;
                    },
                },
            tableResetFun: function ($node) {
            	// 是否计算
                var $style = this.getNodeById($node, "paydata_l");
		        var caculateflag_html = $style.find("[prop='caculateflag']");
		        caculateflag_html.html(
		          '<template scope="scope">' +
		          '<div v-if="scope.row.caculateflag && scope.row.caculateflag==true" style="color:#00A753">是</div>' +
		          '<div v-else>否</div>' +
		          '</template>'
		        );
                // 是否审核
		        var checkflag_html = $style.find("[prop='checkflag']");
		        checkflag_html.html(
		          '<template scope="scope">' +
		          '<div v-if="scope.row.checkflag && scope.row.checkflag==true" style="color:#00A753">是</div>' +
		          '<div v-else>否</div>' +
		          '</template>'
		        );
            	
                var $table = this.getNodeById($node, "paydata_l");
                 $table.attr(':height','tBodyHeight');
                var colHTML = "";
                for (var i = 0; i < that.columnsData.length; i++) {
                    var col = that.columnsData[i];

                    colHTML += '<el-table-column render-type="' + col.renderType + '" align="right" header-align="right" prop="' + col.column + '" label="'
                        + col.label + '" width="150" format="' + col.format + '"   v-if="tableCoulmnVIf' + col.column + '"';


                    if (col.dataType == "number") {
                        colHTML += ' separator="," decimals="' + col.decimals + '" '
                    }
                    colHTML += '></el-table-column>'
                }
                $table.append(colHTML);
                $table.attr(":top-summary-method", "getTopSummaries");
                $table.attr(":show-top-summary", "true");
                $table.attr(":disable-tooltip", "true");

                var $form = this.getNodeById($node, "opxq7lmyhbf");
                var columnHtml = '';
                for (var i = 0; i < that.columnsData.length; i++) {
                    var aColumn = that.columnsData[i];
                    aColumn.model = "paydata." + aColumn.column;;
                    columnHtml = columnHtml + '<el-form-item label="' + aColumn.label + '" class="" prop="' + aColumn.prop + '">';


                    var disabled = aColumn.disabled;
                    if (aColumn.dataType == "input") {
                        columnHtml = columnHtml + '<el-input  :editable="editable" ';

                        if (disabled) {
                            columnHtml = columnHtml + ' disabled="' + aColumn.disabled + '" ';
                        }
                        columnHtml = columnHtml + ' v-model="' + aColumn.model + '"></el-input>';

                    } else if (aColumn.dataType == "date") {

                        columnHtml = columnHtml + '<el-date-picker  :editable="editable"  type="date"';

                        if (disabled) {
                            columnHtml = columnHtml + ' disabled="' + aColumn.disabled + '" ';
                        }
                        columnHtml = columnHtml + '  v-model="' + aColumn.model + '"></el-date-picker>';

                    } else if (aColumn.dataType == "number") {
                        columnHtml = columnHtml + '<el-number  :editable="editable" separator="," decimals="' + aColumn.decimals + '" ';
                        if (disabled) {
                            columnHtml = columnHtml + '  disabled="' + aColumn.disabled + '" ';
                        }
                        columnHtml = columnHtml + 'v-model="' + aColumn.model + '"></el-number>';
                    }

                    columnHtml = columnHtml + '</el-form-item>';
                }

                $form.append(columnHtml);

                return $node[0].outerHTML;
            },

            // 分页组件传入参数
            totalElements: 0,
            currentPage: 1,
            size: 10,

            hitVisible: false,

            intoDocDialogData: [],
            hitMsg: "",


            detailCompareDisabled: false,//明细对比 true-禁止点击
            showApply: true,//申请
            showUnapply: false,//取消申请



            caculateCount: '',
            checkCount: '',
            principlePay: '',
            actualPay: '',

            orgPk: '',



            tplCode: '60130paydata',
            searchTemplate: {},


            isEdit: false,

            tableListData: [],//列表中数据
            baseData: '',//记录表单操作的数据，然后表格进行同步
            editShow: true,//卡片的编辑按钮是否显示
            waclassstate: '',
            periodCondition: '',
            //dialogVisible:true//批量
            checkupdate: false,//批量修改 true禁止
            checkadjustment: false,//个别调整 true禁止
            btnisShow: false, //操作按钮区域 例如计算 批量修改
            dataparam: {},
            //如下为ifbpBtnLine 配置项;
            textAlign:"right",
            // 左侧 文字按钮区域;
            textBtnArr: [{
                title: "申请",
                command: "",
                fontNum:2,
                fn: this.apply,
                visible:true
            },{
                title: "查看申请",
                command: "",
                fontNum:2,
                fn: this.applyView,
                visible:false
            },{
                title: "明细对比",
                command: "",
                fontNum:2,
                fn: this.detailCompare,
                disabled:false
            }],
            // 右侧 图标按钮区域;
            iconBtnArr: [{
                title: "设置",
                fn: this.showHeaderSettingcheck,
                command: "setting",
                iconfont: "ifbp-icon-setting"
            }]
        };
    },


    created() {
        var getColumDataDefer = this.getClassItemColumn();
        this.initPromise(getColumDataDefer);

    },
    mounted(){
        
    },
    methods: {
    	
    	// 当页面高度变化后重置tbody的高度;
        resetTableHeight(height){
           this.$refs.ref_paydatacheck.setData('tBodyHeight',height);
        },
        adjustcheck() {//个别调整
            var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
            this.$router.push({ path: "/hrwa/paydata/paydataAdjustinfo", query: queryParma });
        },
        ontimecheck() {//时点薪资
            var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
            this.$router.push({ path: "/hrwa/paydata/paydataOntimeinfo", query: queryParma });
        },
        calrequest() {
            var getColumDataDefer = this.getClassItemColumn();
            this.initPromise(getColumDataDefer);
        },
        initPromise(request) {
            Promise.all([request]).then(() => {
                // this.$refs.cover.remove();
                this.request();
            });
        },
        getClassItemColumn() {
            var that = this;
            return this.$http({
                url: "/hrwa/salarymgt/payData/payData/getUserShowClassItems",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    pk_org: this.pk_org
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        var columnInfo = res.data.data.classitem;
                        this.sumdataall = res.data.data.sumdataall;

                        this.columnsData = columnInfo;
                        if (this.columnsData && this.columnsData.length > 0) {
                            for (var i = 0; i < this.columnsData.length; i++) {
                                var k = "tableCoulmnVIf" + this.columnsData[i].column;
                                this.tableData[k] = true;
                            }
                        }
                        this.$refs.ref_paydatacheck.setData('columns', this.columnsData);
                        this.$refs.ref_paydatacheck.init();

                        var strColumn = "";
                        if (columnInfo) {
                            for (var i = 0; i < columnInfo.length; i++) {
                                strColumn = strColumn + JSON.stringify(columnInfo[i]) + "||";
                            }
                        }
                        if (strColumn) {
                            strColumn = strColumn.substring(0, strColumn.length - 2);
                        }

                        sessionStorage.setItem('waDataDynamicColumn', strColumn);



                        var editableItem = res.data.data.editableitem;
                        this.editableItem = JSON.stringify(editableItem);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "获取薪资项目对应的动态列失败",
                        type: "error"
                    });
                });

        },
        confirm() {
            var data = this.$refs.ref_paydatacheck.getData("paydata");

            var psnData = this.$refs.ref_paydatacheck.getData("paydata");

            data.caculateflag = psnData.caculateflag;
            //这些信息一起传过去，在后台解析后使用
            data.pk_wa_class = this.pk_wa_class;
            data.cyear = this.cyear;
            data.cperiod = this.cperiod;
            data.pk_org = this.pk_org;


            this.$refs.ref_paydatacheck.validate(valid => {
                if (valid) {
                    this.$http({
                        url: "/hrwa/salarymgt/payData/payData/save",
                        method: "post",
                        data: JSON.parse(JSON.stringify(data))
                    })
                        .then(res => {

                            if (res.data.status === true) {
                                this.$message({
                                    message: res.data.msg,
                                    type: "success"
                                });

                                this.baseData = res.data.data;
                                this.isEdit = false;
                                this.tableDataSynchronieze(this.baseData);

                                var currentDatas = this.$refs.ref_paydatacheck.getTableData();
                                this.actionEnableAndDataCount(currentDatas);
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        })
                        .catch(() => {
                            this.$message({
                                message: "更新失败",
                                type: "error"
                            });
                        });
                }
            });

        },
        edit() {
            var data = this.$refs.ref_paydatacheck.getFormData();
            if (data.checkflag == true) {
                this.$message({
                    message: "已经审核的数据不能编辑",
                    type: "error"
                });
                return;
            }
            this.baseData = JSON.parse(JSON.stringify(data));//转换下，避免指向同一个对象
            this.isEdit = true;
        },
        cancel() {

            if (this.isEdit) {
                this.isEdit = false;
                this.tableDataSynchronieze(this.baseData);
            } else {
                this.$refs.ref_paydatacheck.formShow = false;
                this.$refs.ref_paydatacheck.getTableComp().closeExpandRow();
            }
        },
        rowClick(row, event, column) {
            let isChecked = row.checkflag;
            if (isChecked && isChecked === true) {
                this.editShow = false;
            } else {
                this.editShow = true;
            }

        },
        tableDataSynchronieze(data) {
            for (var i = 0; i < this.tableListData.length; i++) {
                var aListData = this.tableListData[i];
                if (aListData.pk_wa_data == data.pk_wa_data) {
                    this.tableListData[i] = data;
                    break;
                }
            }
        },

        request(n, s) {// 请求数据

            var pn = 1;
            var ps = 10;

            if (n) {
                pn = n;
            }
            if (s) {
                ps = s;
            }
            var url =
                "/hrwa/salarymgt/payData/payData/pageList";
            this.$http({
                url: url,
                method: "post",
                params: {
                    pn: pn,
                    ps: ps,
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    pk_org: this.pk_org,
                    // state : this.state
                },
                data: {}//后期加模板用的
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            var resData = res.data.data.content;
                            if (this.$refs.ref_paydatacheck) {
                                this.tableListData = res.data.data.content;
                                this.$refs.ref_paydatacheck.setTableData(
                                    this.tableListData
                                );
                                this.actionEnableAndDataCount(this.tableListData);//修改按钮状态
                                this.totalElements = res.data.data.totalElements;
                                this.size = res.data.data.size;
                                this.currentPage = res.data.data.number;
                            } else {
                                console.log(2)
                                this.$set(this.tableData, 'uitemplateTableData', resData);
                            }
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch((e) => {
                    console.log(e)
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
        },
        applyBtnEnable(datadata) {
            //
            this.$http({
                url: "/hrwa/payroll/getPayrollDetail",
                method: "post",
                data: this.dataparam
            }).then(res => {
                if (res.data.status === true) {
                    //状态显示成功才显示按钮区域
                    this.btnisShow = true;
                    this.detailCompareDisabled = datadata.detailCompareDisabled;//明细对比

                    this.principlePay = datadata.principlepay;
                    this.actualPay = datadata.actualpay;
                    this.caculateCount = datadata.caculateCount;
                    this.checkCount = datadata.checkCount;
                    if (res.data.data == null) {
                        //显示申请按钮
//                        this.showApply = true;
//                      this.showUnApply = false;
                        this.$set(this.textBtnArr[0],"visible",true);
                        this.$set(this.textBtnArr[1],"visible",false);
                    } else {
                        //显示查看申请按钮
                        this.payrollPk = res.data.data.pk_payroll;
//                      this.showUnApply = true;
//                      this.showApply = false;
                        this.$set(this.textBtnArr[0],"visible",false);
                        this.$set(this.textBtnArr[1],"visible",true);
                    }
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    });
                }
            })
        },
        actionEnableAndDataCount(data) {
            //这些信息一起传过去，在后台解析后使用  这块统一赋一直值
            this.dataparam.pk_wa_class = this.pk_wa_class;
            this.dataparam.cyear = this.cyear;
            this.dataparam.cperiod = this.cperiod;
            this.dataparam.pk_org = this.pk_org;
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/actionDiasbledAndDataCount",
                method: "post",
                params: this.dataparam,
                data: {
                    searchTemplate: JSON.stringify(this.searchTemplate),
                    uivos: JSON.stringify(data),
                }
            })
                .then(res => {
                    if (res.data.status === true) {
                        //不想动后台代码,这样写 保证按钮一起显示
                        var datadata = res.data.data;
                        this.applyBtnEnable(datadata);//申请按钮状态

                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "查询按钮状态失败",
                        type: "error"
                    });
                });
        },
        handleCommand(command) {

            if ("adjust" == command) {

                var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
                this.$router.push({ path: "/hrwa/paydata/adjustinfo", query: queryParma });
            }
            else if ("bankExport" == command) {
                this.showExportItemSelDialog();
            } else if ("importData" == command) {
                var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
                this.$router.push({ path: "/hrwa/dataio/import?funcode=60130dataitf", query: queryParma });
            } else if ("exportData" == command) {
                var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
                this.$router.push({ path: "/hrwa/dataio/export?funcode=60130dataitf", query: queryParma });
            }
        },
        applyView() {//查看申请
            this.$http({
                url: "/hrwa/payroll/getPayrollDetail",
                method: "post",
                data: this.dataparam
            }).then(res => {
                if (res.data.status === true) {
                    var queryParma = { funcode: '60130payslipaly' };//,datastate:datastate
                    this.$router.push({ path: "/hrwa/payroll/detail/" + res.data.data.pk_payroll + "?funcode=60130payslipaly", queryParma: queryParma });
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    });
                }
            })



        },
        apply() {//点击申请
            // this.editDialogParam =  "{pk_wa_class :"+this.pk_wa_class+",cyear : "+this.cyear+",cperiod : "+this.cperiod+",pk_org : "+this.pk_org+"}" ;
            this.intoDocDialogData = this.dataparam;
            this.$nextTick(() => {
                this.$refs['applyDialogRef'].show();
            });

        },

        detailCompare() {  //明细对比
            var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
            this.$router.push({ path: "/hrwa/paydata/paydataDetailcompare", query: queryParma });
        },

        periodSelect(template, condition, option) {
            if (condition.fieldcode == "period" && option) {
                this.cyear = option.value.substr(0, 4);
                this.cperiod = option.value.substring(4);
            }
            this.searchTemplate = template;
            this.request();
        },
        setQueryCondition() {

            let url = "/hrwa/salarymgt/payData/payData/queryPeriod";
            this.$http({
                url: url,
                method: "post",
                params: {
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    pk_org: this.pk_org
                },
            }).then((res) => {
                if (res.data.status === true) {
                    this.periodCondition = res.data.data;
                    let param = {
                        'period': {
                        }
                    };
                    if (this.periodCondition != null && this.periodCondition.length > 0) {
                        for (var i = 0; i < this.periodCondition.length; i++) {
                            param.period[this.periodCondition[i]] = this.periodCondition[i].substr(0, 4) + "/" + this.periodCondition[i].substring(4);
                        }
                    }
                    this.$refs.testSetOption.setOptionsByFieldcode(param);
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    });
                }

            }).catch(() => {
                this.$message({
                    message: "查询条件中期间信息获取失败",
                    type: "error"
                });
            });

        },


        // 查询区点击搜索后的处理
        advancedSearch(searchTemplate) {
            this.searchTemplate = searchTemplate;
            this.request();
        },

        // 翻页标签改变每页显示数据
        handleSizeChange(val) {
            this.request(1, val);
        },

        // 翻页标签改变当前页
        handleCurrentChange(val) {
            this.request(val, this.size);
        },
        batchEditConfirm(data) {
            //          		alert("batchEditConfirm");
            var dataObj = JSON.parse(data);
            var selectedItemKey = dataObj.selectedItemKey;
            var formular = dataObj.formular;
            var replaceType = dataObj.replaceType;
            var selectedData = this.getOperateDatas();
            var uivos = JSON.stringify(this.getOperateDatas());

            this.$http({
                url: "/hrwa/salarymgt/payData/payData/replace",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    replaceType: replaceType,
                    replacedItemKey: selectedItemKey,
                    formular: formular,
                    uivos: uivos,
                    queryConditon: JSON.stringify(this.searchTemplate)
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.$refs['batchEditDlg'].hide();
                        this.request();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "批量修改失败",
                        type: "error"
                    });
                });


        },
        getOperateDatas() {
            var tableSelections = this.$refs.ref_paydatacheck.comp.$refs.ref_paydatacheck.getSelection();
            var selectedDatas = [];
            if (tableSelections && tableSelections.length > 0) {
                for (var i = 0; i < tableSelections.length; i++) {
                    var row = tableSelections[i];
                    selectedDatas.push(row);
                }
            }
            if (selectedDatas.length == 0) {
                selectedDatas = this.$refs.ref_paydatacheck.getTableData();
            }
            return selectedDatas;
        },


        showExportItemSelDialog() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/bankio/showSelItems?pk_org=" + this.pk_org,
                method: "get",
            })
                .then(res => {
                    if (res.data.status === true) {
                        // this.selItemDialogVisible = true;
                        this.$nextTick(function () {
                            this.$refs.ref_bankio_selitem.setTableData(res.data.data);
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "查询导出项目时发生异常!",
                        type: "error"
                    });
                });
        },

        bankExport() {
            let selItems = this.tableBankSelections[0].vcontent;
            for (var i = 1; i < this.tableBankSelections.length; i++) {
                selItems += "|" + this.tableBankSelections[i].vcontent;
            }
            // this.selItemDialogVisible = false;
            let url = "/hrwa/salarymgt/payData/payData/bankio/downloadExcel?pk_org=" + this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType + "&selitems=" + selItems + "&funcode=60130paydata";
            window.location.href = encodeURI(url);
        },

        preDownLoad() {
            this.$refs.bankTypeForm.validate((valid) => {
                if (valid) {
                    this.preDownLoadReal();
                }
            });
        },

      
        payItem(pk_org_name, pk_group_name, pk_group) {
            //              let url = "/hrwa/payitem/info/" + this.pk_wa_class + "/" + pk_group + "/" + this.pk_org + "/" + this.cyear + "/" + this.cperiod + "/" + this.classname + "/" + pk_group_name + "/" + pk_org_name+"?funcode=60130payitem";
            //              this.$router.push(url);
        },
        showlogVisible() {//批量修改弹框ok
            console.log(this.dialogVisible);
            this.$refs.batchEditDlg.show();
        },
        showHeaderSettingcheck() {//设置显示列ok
            this.$refs.ref_paydatacheck.setTransferVisible(true);
        }

    },//methods结束
    watch: {
        cyear() {
            this.request();
        },
        cperiod() {
            this.request();
        }
    },
};
</script>
<style>
.el-button.ifbp-layout-content-right-button,
.el-button + .el-button.ifbp-layout-content-right-button {
  font-size: 14px;
  color: #2a9be3;
  top: -7px;
  position: relative;
  min-width: auto;
}

.el-button.ifbp-layout-content-right-button.is-disabled,
.el-button + .el-button.ifbp-layout-content-right-button.is-disabled {
  color: rgba(0, 137, 250, 0.5);
}

.el-dropdown.ifbp-layout-content-dropdown {
  color: #2a9be3;
  top: -7px;
}
.ifbp-btn-line .fr .ifbp-layout-content-dropdown i {
  margin-left: 0px;
  top: 3px;
  position: relative;
  color: #0089fa;
}

.ifbp-btn-line .fr .search-input-container i {
  font-size: 16px;
  margin-left: 0px;
}

.ifbp-layout-content-search {
  top: -7px;
  position: relative;
  display: inline-block;
}

.marginleft24 {
  margin-left: 24px !important;
}

.marginleft16 {
  margin-left: 16px !important;
}

.maringTop0 {
  margin-top: 0px !important;
}

</style>