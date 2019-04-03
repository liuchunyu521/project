<template>
    <el-table
            :data="tableData"
            :border="isRange"
            style="width: 100%"
            ref="editExpandTable1">
        <el-table-column
                type="index"
                label="序号"
                width="80">
        </el-table-column>
        <el-table-column width="150"
                         label="级别"
                         prop="prmlvName">
        </el-table-column>

        <el-table-column :width="mainWidth" :decimals="decimals"
                         :label="col.name" :header-align="col.isgroup ? align_c:align_l"
                         :prop="col.itemkey" v-for="(col, index_p) in cols">
            <el-table-column :width="childWidth" :decimals="decimals"
                             :label="childCol.name"
                             :prop="childCol.itemkey" v-for="(childCol,index_c) in col.child" v-if="col.isgroup">
                <template scope="scope">
                    <el-number separator="," :editable="editable" :decimals="decimals" v-model="scope.row[colnames[index_p*3+index_c]]"></el-number>
                </template>
            </el-table-column>
            <template scope="scope" v-if="!col.isgroup">
                <el-number separator="," :editable="editable" :decimals="decimals" v-model="scope.row[colnames[index_p]]"></el-number>
            </template>
        </el-table-column>
        <el-table-column label="">
        </el-table-column>
    </el-table>

</template>
<script>
    export default {
        props: ["seclvVos", "prmlvVos", "isMultsec", "isRange", "ctrData","editable","decimals"],
        data() {
            return {
                //seclvVos: [],
                //prmlvVos:[],
//                ctrData:{},  //  数据格式要求：{prmlvpk:[WaCriterionVO],prmlvpk:[WaCriterionVO],......}
//                isMultsec: true,
//                isRange: false,
                align_c: "center",
                align_l: "left",


            };
        },
        computed: {
            mainWidth:function(){
              if(this.isRange){
                  return 150*3;
              }else{
                  return 150;
              }
            },
            childWidth:function(){
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
                        let colObj = {};
                        colObj.name = this.seclvVos[i].levelname;
                        colObj.isgroup = true;
                        colObj.itemkey = "";
                        colObj.child = [];
                        colObj.child[0] = {};
                        colObj.child[0].name = "下限";
                        colObj.child[0].itemkey = "precran_down_" + this.seclvVos[i].pk_wa_seclv;
                        colObj.child[1] = {};
                        colObj.child[1].name = "基准值";
                        colObj.child[1].itemkey = "precran_basic_" + this.seclvVos[i].pk_wa_seclv;
                        colObj.child[2] = {};
                        colObj.child[2].name = "上限";
                        colObj.child[2].itemkey = "precran_up_" + this.seclvVos[i].pk_wa_seclv;
                        retCols.push(colObj);
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
            },
            //金额列的绑定数据
            tableData: function () {
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
            addLv(){
            },
            delLv(index){
            },
            getCriterionVO(vos, seclvPK, prmlvPK){
                if (vos == null)return null;
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
            getEditCtrData(){
                let refCtrData = {};
                let ctrDataCopy = JSON.parse(JSON.stringify(this.ctrData));
                for (let i = 0; i < this.prmlvVos.length; i++) {
                    let pk_wa_prmlv = this.prmlvVos[i].pk_wa_prmlv;
                    if (ctrDataCopy[pk_wa_prmlv] == null) {
                        ctrDataCopy[pk_wa_prmlv] = [];
                    }
                    let criterionvos = ctrDataCopy[pk_wa_prmlv];
                    let newCriterionvos = [];
                    if (this.isMultsec) {
                        for (let j = 0; j < this.seclvVos.length; j++) {
                            let seclvvo = this.seclvVos[j];
                            let criterionVO = this.getCriterionVO(criterionvos, seclvvo.pk_wa_seclv, pk_wa_prmlv);
                            if (criterionVO == null) {
                                criterionVO = {pk_wa_seclv: seclvvo.pk_wa_seclv, pk_wa_prmlv: pk_wa_prmlv, status: 2}
                            } else {
                                criterionVO.status = 1;
                            }
                            if (this.isRange) {
                                criterionVO.min_value = this.tableData[i]["precran_down_" + seclvvo.pk_wa_seclv];
                                criterionVO.criterionvalue = this.tableData[i]["precran_basic_" + seclvvo.pk_wa_seclv];
                                criterionVO.max_value = this.tableData[i]["precran_up_" + seclvvo.pk_wa_seclv];
                            } else {
                                criterionVO.min_value = 0;
                                criterionVO.criterionvalue = this.tableData[i]["prec_" + seclvvo.pk_wa_seclv];
                                criterionVO.max_value = 0;
                            }
                            newCriterionvos.push(criterionVO);
                        }
                    } else {
                        let criterionVO = this.getCriterionVO(criterionvos, '', pk_wa_prmlv);
                        if (criterionVO == null) {
                            criterionVO = {pk_wa_seclv: '~', pk_wa_prmlv: pk_wa_prmlv, status: 2}
                        } else {
                            criterionVO.status = 1;
                        }
                        if (this.isRange) {
                            criterionVO.min_value = this.tableData[i]["pran_down_criterionvalue"];
                            criterionVO.criterionvalue = this.tableData[i]["pran_basic_criterionvalue"];
                            criterionVO.max_value = this.tableData[i]["pran_up_criterionvalue"];
                        } else {
                            criterionVO.min_value = 0;
                            criterionVO.criterionvalue = this.tableData[i]["criterionvalue"];
                            criterionVO.max_value = 0;
                        }
                        newCriterionvos.push(criterionVO);
                    }

                    refCtrData[pk_wa_prmlv] = newCriterionvos;
                }
                return refCtrData;
            }
        }
    };
</script>
<style scoped>
    .grouptitle {
        text-align: center;
    }
    .tpl-label{
        width:auto!important;
    }
</style>
