<!--
	作者：彭传博
	时间：2018-10-17
	描述：薪酬审核
-->
<template>
  <div>
      <ifbp-main-area type="list" class="maringTop0">
      	<!--btnisShow 状态是否获取成功来确定显示按钮区域-->
        <div class="ifbp-btn-line" v-if="btnisShow">
      	 	<div class="fl">
	            <span class="ifbp-layout-content-left-span">已审核({{checkCount}}/{{totalElements}})</span>
          </div>
          <!--<div class="fr">
          	<el-button type="text"  class=" ifbp-layout-content-right-button marginleft24" @click="uncheck" v-show="showUncheck">取消审核</el-button>
            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="check" v-show="showCheck">审核</el-button>
          	<el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="importData" :disabled="importDataDisabled">导入</el-button>
            <el-button type="text"  class="ifbp-layout-content-right-button marginleft24" @click="exportData"  :disabled="exportDataDisabled">导出</el-button>
            <el-dropdown @command="handleCommand" menu-align="start" class="ifbp-layout-content-dropdown marginleft24">
             <span>
              	更多
              <i class="el-icon-caret-bottom el-icon--right" ></i>
             </span>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item command="batchEdit"   :disabled="batchEditDisabled">批量修改</el-dropdown-item>
        		<el-dropdown-item command="specialAdjust"   :disabled="adjustDisabled">个别调整</el-dropdown-item>
                <el-dropdown-item command="ontime" :disabled="ontimeDisabled" >时点薪资</el-dropdown-item>
                <el-dropdown-item command="detailCompare"  :disabled="detailCompareDisabled">明细对比</el-dropdown-item>
                <el-dropdown-item command="alertInfo" >查看预警</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <ifbp-search-dialog
				ref="testSetOption"
				:template-code="templateCode"
				:dialog-title="dialogTitle"
				@search="handleSearch"
			>
            </ifbp-search-dialog>
            <i class="ifbp-icon-setting marginleft16"  @click="showHeaderSettingcheck" title="设置"></i>
          </div>-->
          <!-- 组件 ifbpBtnLine  -->
          <ifbp-btn-line 
            :text-btn-arr="textBtnArr"
            :icon-btn-arr="iconBtnArr"
            :text-align="textAlign"
            style="margin-top:-16px;width: calc(100% - 200px);float: right;">
                <div slot="search-dialog">
                    <ifbp-search-dialog
						ref="testSetOption"
						:template-code="templateCode"
						:dialog-title="dialogTitle"
						@search="handleSearch"
					>
                    </ifbp-search-dialog>
                </div> 
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
      <batch_edit ref="batchEditDlg"  :editableItem="editableItem" @okAction = "batchEditConfirm"></batch_edit> 
      <ontimeDlgInfoDlg ref="ontimeInfodlg"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" ></ontimeDlgInfoDlg> 
     <alertDataDlg ref="ref_alertdata"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" ></alertDataDlg>
     <paydataAdjustinfodlg ref="paydataAdjustinfodlg"  :pk_org="pk_org" :pk_wa_class="pk_wa_class" :cyear="cyear"  :cperiod="cperiod" ></paydataAdjustinfodlg> 
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

    <el-dialog :close-on-click-modal="false"
               title="选择报盘项目" :show-close="false"
               v-model="selItemDialogVisible" size="small">
      <div slot="title">
        <div style="float:left;line-height:64px;" class="el-dialog__title">选择报盘项目</div>
        <el-form :model="refBankValue" :rules="bankRules" ref="bankTypeForm" label-width="95px" style="float:right;top:16px;">
          <el-form-item label="报送银行：" prop="bankType">
            <el-ref
            ref-code="banktyperef"
            field="bankType"
            :template-value="refBankValue"
            width="300px"
            placeholder="请选择">
            </el-ref>
          </el-form-item>
        </el-form>
      </div>
      <ifbp-template ref="ref_bankio_selitem"
                     class="uitemplate-no-top"
                     tpl-id="hrwa_bankio_selitem"
                     :table-show-menu="false">
      </ifbp-template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="">取消</el-button>
        <el-button @click="preDownLoad" type="primary">导出</el-button>
      </span>
    </el-dialog>
    
     <el-dialog :close-on-click-modal="false"
               title="直接导出" :show-close="false"
               v-model="directExportVisible" size="small">
      <ifbp-template ref="ref_directexport_items"
                     class="uitemplate-no-top"
                     tpl-id="directExport"
                     :table-show-menu="false">
      </ifbp-template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="directExportVisible=false;">取消</el-button>
        <el-button @click="directExport" type="primary">导出</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>

import paydataAdjustinfodlg from './paydata-adjust-info-dlg.vue';
import pageModelMixin from 'ifbp-business/pageModelMixin/index.js';
import tableHeightMixin from "ifbp-business/tableHeightMixin/index.js";
import batch_edit from './batch-edit-dlg.vue';
import alertDataDlg from './alert-dlg.vue';

import ontimeDlgInfoDlg from './paydata-ontime-info_dlg.vue';

import IfbpBtnLine from "ifbp-business/ifbpBtnLine";

export default {
    mixins: [pageModelMixin,tableHeightMixin],
    props: ['pk_org', 'pk_wa_class', 'cyear', 'cperiod'],
    components: {
        batch_edit,
        paydataAdjustinfodlg,
        alertDataDlg,
        ontimeDlgInfoDlg,
        "ifbp-btn-line":IfbpBtnLine
    },
    data() {

        var that = this;

        return {
        	directExportVisible :false,
            selvalue: [],
            otherHeight:230,
            options: [{
                value: 'checkflag_Y',
                label: '已审核'
            }, {
                value: 'checkflag_N',
                label: '未审核'
            }],

            templateCode: '60130paydata1cal',
            dialogTitle: "过滤",
            customerClass: ["customer-search-dialog"],
            searchTemplate: {
                // ...
            },
            bankRules: {
                bankType: [
                    { required: true, message: '请选择报送银行', trigger: 'blur' },
                ],
            },
            refBankValue: {
                bankType: '',
                beanMap: {
                    bankType_ref: {},
                },
            },
            //银行报盘项目
            selItemDialogVisible: false,
            // UI模板传入参数
            tablePk: "0001AA10000000006GA8",
            tableData: {
                paydata_c: {
                    f_1: ''
                }

            },
            columnsData: [],
            sumdataalltemp: [], //临时存一下
            sumdataall: [],
            tableMethods: {
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

                        columnHtml = columnHtml + '<el-date-picker  :editable="editable"  type="date" :valuetoms="true" ';

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
            editableItem: "",
            hitMsg: "",
            caculateDisabled: true,
            retotalDisabled: true,
            checkDisabled: true,
            uncheckDisabled: true,
            payDisabled: true,
            unpayDisabled: true,
            transferMonthEndDisabled: true,
            importDataDisabled: false,
            exportDataDisabled: false,
            batchEditDisabled: false,//批量修改
            adjustDisabled: false,//个别调整
            ontimeDisabled: true,//时点薪资 true-禁止点击
            detailCompareDisabled: true,//明细对比 true-禁止点击
            unTransferMonthEndDisabled: true,
            showRetotal: false,
            showCheck: true,//审核
            showUncheck: false,//取消审核
            showPay: false,
            showUnpay: false,
            showTransferMonthEnd: false,
            showCaculate: false,
            caculateCount: '',
            checkCount: '',
            principlePay: '',
            actualPay: '',
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
            //如下为ifbpBtnLine 配置项;
            textAlign:"right",
            // 左侧 文字按钮区域;
            textBtnArr: [{
                title: "审核",
                command: "showCheck",
                fontNum:2,
                fn: this.check,
                visible:false
            },{
                title: "取消审核",
                command: "showUncheck",
                fontNum:4,
                fn: this.uncheck,
                visible:false
            },{
                title: "直接导出",
                command: "exportD",
                fontNum:2,
                fn: this.exportDataD,
                disabled:false
            },{
                title: "批量修改",
                command: "batchEdit",
                fontNum:4,
                disabled:true,
                fn:this.batchEdit
            },{
                title: "个别调整",
                command: "specialAdjust",
                fontNum:4,
                disabled:true,
                fn:this.specialAdjust
            },{
                title: "时点薪资",
                command: "ontime",
                fontNum:4,
                disabled:true,
                fn:this.ontime
            },{
                title: "明细比较",
                command: "detailCompare",
                fontNum:4,
                disabled: true,
                fn:this.detailCompare
            },{
                title: "查看预警",
                command: "alertInfo",
                fontNum:4,
                disabled: false,
                fn:this.alertInfo
            },{
                title: "导入",
                command: "import",
                fontNum:2,
                fn: this.importData,
                disabled:true
            },{
                title: "导出",
                command: "export",
                fontNum:2,
                fn: this.exportData,
                disabled:true
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
	   	directExport(){
    	 	 this.directExportSelection = this.$refs.ref_directexport_items.comp.$refs.tableRef.getSelection();
        	if (!this.directExportSelection || this.directExportSelection.length === 0) {
                    this.$message({
                        message: "请先选择导出项目!",
                        type: 'warning'
                    });
                    return;
            }
            
			let selItems = this.directExportSelection[0].vcontent;
            for(var i = 1; i < this.directExportSelection.length; i++){
                selItems += "|" + this.directExportSelection[i].vcontent;
            }
            this.directExportVisible = false;
           let searchTemplatstr = "";
           if(this.searchTemplate){
            	searchTemplatstr = JSON.stringify(this.searchTemplate);
            }
            let url = "/hrwa/salarymgt/payData/payData/directExportData?pk_org=" + this.pk_org + "&pk_wa_class=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&outItems=" + selItems +"&searchTemplatstr="+ searchTemplatstr + "&funcode=60130paydata1";
            window.location.href = encodeURI(url);        	
        },
    	// 当页面高度变化后重置tbody的高度;
        resetTableHeight(height){
           this.$refs.ref_paydatacheck.setData('tBodyHeight',height);
        },
         exportDataD(){
        	
        	 this.$http({
                url: "/hrwa/salarymgt/payData/payData/getAllExportableItems",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    pk_org: this.pk_org,
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                    	 this.directExportVisible = true;
                            this.$nextTick(function() {
                                this.$refs.ref_directexport_items.setTableData(res.data.data);
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
                        message: "查询导出项目失败",
                        type: "error"
                    });
                });
                
        },
        deleteTag() {
            this.calrequest();
        },
        visibleChange(b) {
            if (b) {
                // alert("show")
            } else {
                this.calrequest();
            }
        },

        handleSearch(searchTemplate) {
            this.searchTemplate = searchTemplate;
            this.calrequest();
        },

        adjustcheck() {//个别调整
            // var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
            // this.$router.push({ path: "/hrwa/paydata/paydataAdjustinfo", query: queryParma });
            this.$refs.paydataAdjustinfodlg.show();
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
                    pk_org: this.pk_org,
                    searchTemplate: this.searchTemplate
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        var columnInfo = res.data.data.classitem;
                        this.sumdataalltemp = res.data.data.sumdataall;

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
                                this.$emit('changeWaState')
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
            let selvalue =  this.selvalue.join('-')
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
                    selvalue: selvalue
                },
                data: this.searchTemplate//后期加模板用的
            })
                .then((res) => {
                    debugger
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            var resData = res.data.data.content;
                            if (this.$refs.ref_paydatacheck) {
                                this.tableListData = res.data.data.content;
                                this.$refs.ref_paydatacheck.setTableData(
                                    this.tableListData
                                );
                                this.actionEnableAndDataCount(this.tableListData);//修改按钮状态
                                this.sumdataall = this.sumdataalltemp;  // 在这里设置合计值
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
        actionEnableAndDataCount(data) {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/actionDiasbledAndDataCount",
                method: "post",
                params: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                },
                data: {
                    searchTemplate: JSON.stringify(this.searchTemplate),
                    uivos: JSON.stringify(data),
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        //状态显示成功才显示按钮区域
                        this.btnisShow = true;

                        this.waclassstate = res.data.data.waclassstate;
                        this.caculateDisabled = res.data.data.caculateDisabled;
                        this.retotalDisabled = res.data.data.retotalDisabled;
                        this.checkDisabled = res.data.data.checkDisabled;
                        this.uncheckDisabled = res.data.data.uncheckDisabled;
                        this.payDisabled = res.data.data.payDisabled;
                        this.unpayDisabled = res.data.data.unpayDisabled;
                        //                          debugger
                        var detailCompareDisabled = res.data.data.detailCompareDisabled;//明细对比
                        this.$set(this.textBtnArr[6],"disabled",detailCompareDisabled);
                        
                        this.transferMonthEndDisabled = res.data.data.transferMonthEndDisabled;
                        this.unTransferMonthEndDisabled = res.data.data.unTransferMonthEndDisabled;
                        //暂时让“批量修改”“个别调整”“时点薪资”按钮状态：计算按钮可用或者审核按钮可用的时候偶这些按钮才能是可用的
                        var batchEditDisabled = this.caculateDisabled && this.checkDisabled;//批量修改
                        this.$set(this.textBtnArr[3],"disabled",batchEditDisabled);
                        var adjustDisabled = this.caculateDisabled && this.checkDisabled;//个别调整
                        this.$set(this.textBtnArr[4],"disabled",adjustDisabled);
                        var ontimeDisabled = this.caculateDisabled && this.checkDisabled;//时点薪资
                        this.$set(this.textBtnArr[5],"disabled",ontimeDisabled);
                        // 导入导出同上控制
                        var importDataDisabled = this.caculateDisabled && this.checkDisabled;
                        this.$set(this.textBtnArr[8],"disabled",importDataDisabled);
                       
                        var exportDataDisabled = this.caculateDisabled && this.checkDisabled;
                        this.$set(this.textBtnArr[9],"disabled",exportDataDisabled);

                        this.showRetotal = !this.retotalDisabled;
                        
                        var showCheck = !this.checkDisabled;//审核按钮状态
                        this.$set(this.textBtnArr[0],"visible",showCheck);
                        
                        var showUncheck = !this.uncheckDisabled;//取消审核按钮状态
                        this.$set(this.textBtnArr[1],"visible",showUncheck);
                        
                        this.showPay = !this.payDisabled;
                        this.showUnpay = !this.unpayDisabled;
                        this.showTransferMonthEnd = !this.transferMonthEndDisabled;
                        this.showCaculate = !this.caculateDisabled;

                        this.principlePay = res.data.data.principlepay;
                        this.actualPay = res.data.data.actualpay;
                        this.caculateCount = res.data.data.caculateCount;
                        this.checkCount = res.data.data.checkCount;
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
//      handleCommand(command) {
//          if ("adjust" == command) {
//              var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
//              this.$router.push({ path: "/hrwa/paydata/adjustinfo", query: queryParma });
//          } else if("batchEdit" == command ){
//          	
//      	}else if("specialAdjust"== command ){
//      		
//  		}else if ("ontime" == command) {//时点薪资
//              
//          } else if ("detailCompare" == command) {//明细对比
//              
//          }
//          else if ("uncheck" == command) {
//              
//          }
//          else if ("unpay" == command) {
//              this.unpay();
//          } else if ("unMonthEnd" == command) {
//              this.unMonthEnd();
//          }
//          else if ("batchEdit" == command) {
//              
//          }
//          else if ("bankExport" == command) {
//              this.showExportItemSelDialog();
//          } else if("alertInfo" == command){
//          	
//          }
//      },
        alertInfo(){
        	this.$refs.ref_alertdata.show();
        },
        detailCompare(){
        	var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
            this.$router.push({ path: "/hrwa/paydata/paydataDetailcompare", query: queryParma });
        },
        onTimeInfo(){
        	 this.$refs.ontimeInfodlg.show();
        },
        ontime(){
        	this.onTimeInfo();
        	//var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
            //this.$router.push({ path: "/hrwa/paydata/paydataOntimeinfo", query: queryParma });
        },
        specialAdjust(){
        	this.adjustcheck();
        },
        batchEdit(){
        	this.$refs['batchEditDlg'].show();
        },
        importData(){
        	 var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
             this.$router.push({ path: "/hrwa/dataio/import?funcode=60130dataitf", query: queryParma });
        },
        exportData(){
        	 var queryParma = { pk_org: this.pk_org, pk_wa_class: this.pk_wa_class, cyear: this.cyear, cperiod: this.cperiod };
             this.$router.push({ path: "/hrwa/dataio/export?funcode=60130dataitf", query: queryParma });
        },
        unMonthEnd() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/unMonthEnd",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    pk_org: this.pk_org,
                    waclassstate: this.waclassstate
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.request();
                        this.setQueryCondition();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "取消结账失败",
                        type: "error"
                    });
                });
        },
        monthEnd() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/monthEnd",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    pk_org: this.pk_org,
                    waclassstate: this.waclassstate

                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.setQueryCondition();
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
                        message: "结账失败",
                        type: "error"
                    });
                });
        },
        retotal() {
            this.$confirm('汇总将覆盖当前数据，是否继续？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                closeOnClickModal: false,

                type: 'warning'
            }).then(() => {
                this.$http({
                    url: "/hrwa/salarymgt/payData/payData/retotal",
                    method: "post",
                    data: {
                        pk_wa_class: this.pk_wa_class,
                        pk_org: this.pk_org,
                        cyear: this.cyear,
                        cperiod: this.cperiod,
                        waclassstate: this.waclassstate
                    }
                })
                    .then(res => {

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
                    })
                    .catch(() => {
                        this.$message({
                            message: "汇总失败",
                            type: "error"
                        });
                    });
            }).catch(() => {
                // 这里加取消逻辑
            });


        },
        pay() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/pay",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    waclassstate: this.waclassstate
                }
            })
                .then(res => {

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
                })
                .catch(() => {
                    this.$message({
                        message: "发放失败",
                        type: "error"
                    });
                });
        },
        unpay() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/unPay",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    waclassstate: this.waclassstate
                }
            })
                .then(res => {

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
                })
                .catch(() => {
                    this.$message({
                        message: "取消发放失败",
                        type: "error"
                    });
                });
        },
        uncheck() {//取消审核
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/unCheckValidate",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,

                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        if (res.data.msg == "fail") {//校验失败
                            this.hitMsg = res.data.data;
                            this.hitVisible = true;
                        } else if (res.data.msg == "success") {

                            this.allUncheck();
                        }

                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "校验已被加入离职发薪人员失败",
                        type: "error"
                    });
                });
        },
        allUncheck() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/unCheck",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    waclassstate: this.waclassstate

                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.$emit('changeWaState');//取消审核改状态
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
                        message: "查询是否有未计算的数据失败",
                        type: "error"
                    });
                });
        },
        check() {//点击审核
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/check",
                method: "post",
                params: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    waclassstate: this.waclassstate
                },
                data: this.searchTemplate
            })
                .then(res => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.$emit('changeWaState');
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
                        message: "审核失败",
                        type: "error"
                    });
                });
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
        alertUncaculatePsn() {

            this.$confirm('本期间有员工的定调薪信息发生变化，请先核算时点发放金额，再进行薪资计算', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,

                type: 'warning'
            }).then(() => {
                let queryParam = {
                    pk_org: this.pk_org,
                    pk_wa_class: this.pk_wa_class,
                    cyear: this.cyear,
                    cperiod: this.cperiod
                };
                this.$router.push({ path: "/hrwa/paydata/ontimeinfo", query: queryParam });
            }).catch(() => {
                // 这里加取消逻辑
            });
        },
        caculateAllData() {
            var selectedDatas = this.$refs.ref_paydatacheck.getTableData();
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/caculate",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                    vos: JSON.stringify(selectedDatas),
                }
            })
                .then(res => {

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
                })
                .catch(() => {
                    this.$message({
                        message: "查询是否有未计算的数据失败",
                        type: "error"
                    });
                });
        },
        // 跳转到添加地点页面
        caculate() {
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/isExistUnCaculatePsn",
                method: "post",
                data: {
                    pk_wa_class: this.pk_wa_class,
                    pk_org: this.pk_org,
                    cyear: this.cyear,
                    cperiod: this.cperiod,
                }
            })
                .then(res => {

                    if (res.data.status === true) {
                        if (res.data.data === true) {
                            this.alertUncaculatePsn();
                        } else {
                            //执行计算动作
                            this.caculateAllData();
                        }
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "查询是否有未计算的数据失败",
                        type: "error"
                    });
                });
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

                        this.$emit('changeWaState');
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
                        this.selItemDialogVisible = true;
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
            this.selItemDialogVisible = false;
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

        preDownLoadReal() {
            this.tableBankSelections = this.$refs.ref_bankio_selitem.comp.$refs.tableRef.getSelection();
            if (!this.tableBankSelections || this.tableBankSelections.length === 0) {
                this.$message({
                    message: "请先选择报盘项目!",
                    type: 'warning'
                });
                return;
            }
            this.selItemDialogVisible = false;
            this.$http({
                url: "/hrwa/salarymgt/payData/payData/bankio/preDownload?pk_org=" + this.pk_org + "&classid=" + this.pk_wa_class + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod + "&bankType=" + this.refBankValue.bankType,
                method: "get",
            })
                .then(res => {
                    if (res.data.status === true) {
                        var checkRtn = res.data.checkRtn;
                        if (checkRtn == 1) {
                            this.$confirm('薪资发放项目未设置代发工资卡', '提示', {
                                confirmButtonText: '前往设置',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.payItem(res.data.pk_org_name, res.data.pk_group_name, res.data.pk_group);
                            }).catch(() => {
                            });
                        } else if (checkRtn == 2) {
                            this.$confirm('未找到发薪人员有效的银行账户信息，请在“个人银行账户”进行维护。', '提示', {
                                confirmButtonText: '确定',
                                showCancelButton: false,
                                type: 'warning'
                            }).then(() => {

                            }).catch(() => {
                            });
                        } else if (checkRtn == 3) {
                            this.$confirm(res.data.tips + '未找到有效的银行账户信息，是否继续导出？', '提示', {
                                confirmButtonText: '继续导出',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.bankExport();
                            }).catch(() => {
                            });
                        } else {
                            this.bankExport();
                        }
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: "发生异常!",
                        type: "error"
                    });
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
</style>
