<template>
    <div style="padding: 16px;"> 
        <br/>
        <el-table @cell-click="cellClickHandle"
                  cell-style="cellStyle"
                  id="gradeprmsectable"
                  row-class-name="none"
                  :data="tableData"
                  :border="true"
                  style="width: 100%;"
                  ref="editExpandTable1"
                  height="380"
                 >
            <!--
            <el-table-column
                    type="index"
                    label="序号"
                    width="50">
            </el-table-column>
            -->
            <el-table-column width="150"
                             label="级别"
                             prop="prmlvName"
                             v-show="true">
            </el-table-column>

            <el-table-column :width="mainWidth" :decimals="decimals" align="right" 
                             :label="col.name" :header-align="col.isgroup ? align_c:align_r"
                             :prop="col.itemkey" v-for="(col, index_p) in cols">
                <el-table-column :width="childWidth" :decimals="decimals"
                                 :label="childCol.name" align="right"
                                 :prop="childCol.itemkey" v-for="(childCol,index_c) in col.child" v-if="col.isgroup">
                    <template scope="scope">
                        <el-number separator="," :editable="false" :decimals="decimals"
                                   v-model="scope.row[colnames[index_p*3+index_c]]"></el-number>
                    </template>
                </el-table-column>
                <template scope="scope" v-if="!col.isgroup">
                    <el-number separator="," :editable="false" :decimals="decimals"
                               v-model="scope.row[colnames[index_p]]"></el-number>
                </template>
            </el-table-column>
        </el-table>

        <div class="el-dialog__footer dialog-footer">
            <el-button @click="dialogCancel">取 消</el-button>
            <el-button @click="dialogConfirm" type="primary">确 定</el-button>

        </div>
    </div>
</template>

<script>
    export default {
        props: ['refCode', 'field', 'templateValue', 'isMutiSelect', 'queryParams', 'panelVisible'],
        data() {

            return {
                align_c: "center",
                align_l: "left",
                align_r: "right",
                isMultsec: false,
                isRange: false,
                decimals: 2,
                seclvVos: [],
                prmlvVos: [],
                ctrData: [],
                updating: true,
                selCriterionVO: {},
                oldpkWaGrd: ''
            };
        },
        watch: {
            pk_wa_grd(curVal){
                this.syncData();
            },
            panelVisible(val) {
                if (val) {
                    if(this.oldpkWaGrd !== this.queryParams.pk_wa_grd){
                        this.syncData();
                    }
                }
            },
        },

        created() {
            this.syncData();
        },
        computed: {
            pk_wa_grd:function(){
              return this.queryParams.pk_wa_grd;
            },
            mainWidth: function () {
                if (this.isRange) {
                    return 150;
                } else {
                    return 150;
                }
            },
            childWidth: function () {
                return 150;
            },
            //金额列的key
            colnames: function () {
                let retColnames = [];
                if (this.isMultsec && this.isRange) {
                    for (let i = 0; i < this.seclvVos.length; i++) {
                        retColnames.push("precran_down_" + this.seclvVos[i].pk_wa_seclv);
                        retColnames.push("precran_basic_" + this.seclvVos[i].pk_wa_seclv);
                        retColnames.push("precran_up_" + this.seclvVos[i].pk_wa_seclv);
                    }
                } else if (this.isMultsec && !this.isRange) {
                    for (let i = 0; i < this.seclvVos.length; i++) {
                        retColnames.push("prec_" + this.seclvVos[i].pk_wa_seclv);
                    }

                } else if (!this.isMultsec && this.isRange) {
                    retColnames.push("pran_down_criterionvalue");
                    retColnames.push("pran_basic_criterionvalue");
                    retColnames.push("pran_up_criterionvalue");
                } else if (!this.isMultsec && !this.isRange) {
                    retColnames.push("criterionvalue");
                }
                return retColnames;
            },
            //金额列的表头结构
            cols: function () {
                let retCols = [];
                if (this.isMultsec && this.isRange) {
                    for (let i = 0; i < this.seclvVos.length; i++) {
                        // let colObj = {};
                        // colObj.name = this.seclvVos[i].levelname;
                        // colObj.isgroup = true;
                        // colObj.itemkey = "";
                        // colObj.child = [];
                        // colObj.child[0] = {};
                        // colObj.child[0].name = "下限";
                        // colObj.child[0].itemkey = "precran_down_" + this.seclvVos[i].pk_wa_seclv;
                        // colObj.child[1] = {};
                        // colObj.child[1].name = "基准值";
                        // colObj.child[1].itemkey = "precran_basic_" + this.seclvVos[i].pk_wa_seclv;
                        // colObj.child[2] = {};
                        // colObj.child[2].name = "上限";
                        // colObj.child[2].itemkey = "precran_up_" + this.seclvVos[i].pk_wa_seclv;
                        // 
                        let colObj1 = {};
                        colObj1.name = this.seclvVos[i].levelname +"下限";
                        colObj1.isgroup = true;
                        colObj1.itemkey = "precran_down_" + this.seclvVos[i].pk_wa_seclv;
                        retCols.push(colObj1);

                        let colObj2 = {};
                        colObj2.name = this.seclvVos[i].levelname +"基准值";
                        colObj2.isgroup = true;
                        colObj2.itemkey ="precran_basic_" + this.seclvVos[i].pk_wa_seclv;
                        retCols.push(colObj2);

                        let colObj3 = {};
                        colObj3.name = this.seclvVos[i].levelname + "上限";
                        colObj3.isgroup = true;
                        colObj3.itemkey = "precran_up_" + this.seclvVos[i].pk_wa_seclv;
                        retCols.push(colObj3);
                    }
                } else if (this.isMultsec && !this.isRange) {
                    for (let i = 0; i < this.seclvVos.length; i++) {
                        let colObj = {};
                        colObj.name = this.seclvVos[i].levelname;
                        colObj.isgroup = false;
                        colObj.itemkey = "prec_" + this.seclvVos[i].pk_wa_seclv;
                        retCols.push(colObj);
                    }
                } else if (!this.isMultsec && this.isRange) {
                    let colObj = {};
                    colObj.name = "金额";
                    colObj.isgroup = true;
                    colObj.itemkey = "";
                    colObj.child = [];
                    colObj.child[0] = {};
                    colObj.child[0].name = "下限";
                    colObj.child[0].itemkey = "pran_down_criterionvalue";
                    colObj.child[1] = {};
                    colObj.child[1].name = "基准值";
                    colObj.child[1].itemkey = "pran_basic_criterionvalue";
                    colObj.child[2] = {};
                    colObj.child[2].name = "上限";
                    colObj.child[2].itemkey = "pran_up_criterionvalue";
                    retCols.push(colObj);
                } else if (!this.isMultsec && !this.isRange) {
                    let colObj = {};
                    colObj.name = "金额";
                    colObj.isgroup = false;
                    colObj.itemkey = "criterionvalue";
                    retCols.push(colObj);
                }
                return retCols;
            }
            ,
            //金额列的绑定数据
            tableData: function () {
                if (this.updating)return [];
                let num = 0;
                num = parseFloat(num.toFixed(this.decimals));
                let retTableData = [];
                if (this.isMultsec) {
                    for (let i = 0; i < this.prmlvVos.length; i++) {
                        let itemData = {};
                        itemData.prmlvName = this.prmlvVos[i].levelname;
                        let criterionVOs = this.ctrData[this.prmlvVos[i].pk_wa_prmlv];
                        for (let j = 0; j < this.seclvVos.length; j++) {
                            let seclvvo = this.seclvVos[j];
                            let criterionVO = this.getCriterionVO(criterionVOs, seclvvo.pk_wa_seclv, this.prmlvVos[i].pk_wa_prmlv);
                            if (criterionVO != null) {
                                if (this.isRange) {
                                    itemData["precran_down_" + seclvvo.pk_wa_seclv] = criterionVO.min_value;
                                    itemData["precran_basic_" + seclvvo.pk_wa_seclv] = criterionVO.criterionvalue;
                                    itemData["precran_up_" + seclvvo.pk_wa_seclv] = criterionVO.max_value;
                                } else {
                                    itemData["prec_" + seclvvo.pk_wa_seclv] = criterionVO.criterionvalue;
                                }

                            } else {
                                if (this.isRange) {
                                    itemData["precran_down_" + seclvvo.pk_wa_seclv] = num;
                                    itemData["precran_basic_" + seclvvo.pk_wa_seclv] = num;
                                    itemData["precran_up_" + seclvvo.pk_wa_seclv] = num;
                                } else {
                                    itemData["prec_" + seclvvo.pk_wa_seclv] = num;
                                }
                            }
                        }
                        retTableData.push(itemData);
                    }
                } else if (!this.isMultsec) {
                    for (let i = 0; i < this.prmlvVos.length; i++) {
                        let itemData = {};
                        itemData.prmlvName = this.prmlvVos[i].levelname;
                        let criterionVOs = this.ctrData[this.prmlvVos[i].pk_wa_prmlv];

                        let criterionVO = this.getCriterionVO(criterionVOs, '', this.prmlvVos[i].pk_wa_prmlv);
                        if (criterionVO != null) {
                            if (this.isRange) {
                                itemData["pran_down_criterionvalue"] = criterionVO.min_value;
                                itemData["pran_basic_criterionvalue"] = criterionVO.criterionvalue;
                                itemData["pran_up_criterionvalue"] = criterionVO.max_value;
                            } else {
                                itemData["criterionvalue"] = criterionVO.criterionvalue;
                            }

                        } else {
                            if (this.isRange) {
                                itemData["pran_down_criterionvalue"] = num;
                                itemData["pran_basic_criterionvalue"] = num;
                                itemData["pran_up_criterionvalue"] = num;
                            } else {
                                itemData["criterionvalue"] = num;
                            }
                        }
                        retTableData.push(itemData);
                    }
                }
                return retTableData;
            },
        },
        methods: {

            cellStyle({row, column, rowIndex, columnIndex}){
                if(rowIndex === 1 && columnIndex === 2){ //指定坐标
                    return 'background:pink'
                }else{
                    return ''
                }
            },

            syncData(){
                
                this.updating = true;

                this.seclvVos = [];
                this.prmlvVos = [];
                this.ctrData = [];
                if(!this.queryParams.pk_wa_grd){
                    return;
                }
                this.oldpkWaGrd = this.queryParams.pk_wa_grd;
                let svr = this.$http({
                    url: '/hrwa/psndocwadocref/getById/' + this.queryParams.pk_wa_grd,
                    method: 'get'
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }

                    let svrData = res.data.data;
                    let mainData = svrData.mainData;

                    this.isMultsec = mainData.ismultsec;
                    this.isRange = mainData.isrange;

                    this.ctrData = svrData.wa_crt;
                    this.decimals = mainData.iflddecimal;

                    if (!!svrData.wa_prmlv) {
                        this.prmlvVos = svrData.wa_prmlv;
                    }
                    if (!!svrData.wa_seclv) {
                        this.seclvVos = svrData.wa_seclv;
                    }
                    this.updating = false;
                });
                svr.catch(() => {
                    this.$message({
                        message: '信息详情获取失败',
                        type: 'error'
                    });
                });
            },
            dialogConfirm: function dialogConfirm() {
                this.$emit('customRefConfirm', this.selCriterionVO);
                this.selCriterionVO={};
            },
            dialogCancel: function dialogCancel() {
                this.$emit('customRefCancel');
            },
            cellClickHandle(){
                let property = arguments[1].property;
                if (property == "prmlvName")return false;
                $("#gradeprmsectable td").removeClass("wa-sel-cell");
                let cell = $(arguments[2]);
                cell.addClass("wa-sel-cell");
                let secPK = null;
                if (this.isMultsec) {
                    secPK = property.substring(property.lastIndexOf("_") + 1);
                }
                let tempVO = this.getSelCriterionVO(secPK, arguments[0].prmlvName);
                this.selCriterionVO = JSON.parse(JSON.stringify(tempVO));
                this.selCriterionVO.id = this.selCriterionVO.pk_wa_crt;
                this.selCriterionVO.name = arguments[0].prmlvName;
                if (this.isMultsec) {
                    let secname = "";
                    for (let i = 0; i < this.seclvVos.length; i++) {
                        if (secPK == this.seclvVos[i].pk_wa_seclv) {
                            secname = this.seclvVos[i].levelname;
                            break;
                        }
                    }
                    this.selCriterionVO.name += "/" + secname;
                    this.selCriterionVO.code = this.selCriterionVO.name;
                }
            },
            getSelCriterionVO(seclvPK, prmlvName){
                let ctrDataCopy = JSON.parse(JSON.stringify(this.ctrData));
                let criterionvos = null;
                let pk_wa_prmlv = null;
                for (let i = 0; i < this.prmlvVos.length; i++) {
                    if (prmlvName == this.prmlvVos[i].levelname) {
                        pk_wa_prmlv = this.prmlvVos[i].pk_wa_prmlv;
                        break;
                    }
                }
                criterionvos = ctrDataCopy[pk_wa_prmlv];
                if (!this.isMultsec) {
                    return criterionvos[0];
                }
                for (let i = 0; i < criterionvos.length; i++) {
                    if (criterionvos[i].pk_wa_seclv == seclvPK) {
                        return criterionvos[i];
                    }
                }
            },

            getCriterionVO(vos, seclvPK, prmlvPK){
                if (vos == null)
                    return null;
                for (let i = 0; i < vos.length; i++) {
                    if (seclvPK == "") {
                        if (vos[i].pk_wa_prmlv == prmlvPK) {
                            return vos[i];
                        }
                    } else if (vos[i].pk_wa_seclv == seclvPK && vos[i].pk_wa_prmlv == prmlvPK) {
                        return vos[i];
                    }
                }
                return null;
            },
        }
    };
</script>
<style>
    .wa-sel-cell {
        background-color: #5AC8FA !important;
    }
    
    #gradeprmsectable .el-table__body-wrapper {
    	height: 331px;
    	overflow: auto;
    }
</style>
