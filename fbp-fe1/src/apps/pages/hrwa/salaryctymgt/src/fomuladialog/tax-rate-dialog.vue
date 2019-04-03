<template>
    <!-- <div v-show="value">  -->
    <el-dialog title="扣税函数" v-model="dialogVisible" size="tiny">
        <div style="width:100%;">
            <br/>
            <el-form :rules="rules" label-width="80px" ref="paraForm" :model="DialogEntity">
                <el-form-item label="扣税方式" prop="ksway" required>
                    <el-select :editable="true" v-model="DialogEntity.ksway" :clearable="false">
                        <el-option key="0" label="普通计税" value="0"></el-option>
                        <el-option key="1" label="年终奖计税" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="label2Name" prop="item2Value" required>
                    <el-select :editable="true" v-model="DialogEntity.item2Value" :clearable="false">
                        <el-option v-for="vo in WaItemVOs" :key="vo.itemkey" :label="vo.name"
                                   :value="vo.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当月工资" prop="curMonthWage" v-show="DialogEntity.ksway == 1" :required="DialogEntity.ksway == 1">
                    <el-select :editable="true" v-model="DialogEntity.curMonthWage" :clearable="false">
                        <el-option v-for="vo in WaItemVOs" :key="vo.itemkey" :label="vo.name"
                                   :value="vo.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="期间个数" prop="periodCnt" v-show="DialogEntity.ksway == 1">
                    <el-select :editable="true" v-model="DialogEntity.periodCnt" :clearable="true">
                        <el-option v-for="vo in WaItemVOs" :key="vo.itemkey" :label="vo.name"
                                   :value="vo.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- </div>  -->
</template>
<script>

    export default {
        //from=1:薪资规则  from=2:薪资发放项目 from=3:公共薪资项目
        props: ["pk_org", "queryParams", "inputSig"],
        data() {
            return {
                dialogVisible: false,
                DialogEntity: {
                    ksway: 0,
                    item2Value: '',
                    curMonthWage: '',
                    periodCnt: '',
                },
                rules: {
                    ksway: [{required: true, message: '请选择扣税方式', trigger: 'change'},],
                    item2Value:[{required: true, message: '请选择', trigger: 'change'},],
                },
                WaItemVOs: {},
            };
        },
        watch: {
            dialogVisible(val){
                if (!val) {
                    this.$emit('input', val);
                }
            }
        },

        computed: {
            from: function () {
                return this.queryParams.from;
            },
            label2Name: function () {
                if (this.DialogEntity.ksway == 0) {
                    return "薪资项目";
                } else if (this.DialogEntity.ksway == 1) {
                    return "年度奖金";
                } else {
                    return "薪资项目";
                }
            }
        },
        mounted() {
        },

        methods: {
            show(){
                this.initData();
            },
            initData(){
                this.dialogVisible = true;
                this.DialogEntity.ksway = 0;
                var url = "";
                if (this.from == 2) {
                    url = "/hrwa/payitemfomula/getPara4TaxRate?"
                        + "pk_org=" + this.queryParams.context.pk_org + "&pk_wa_class=" + this.queryParams.context.pk_wa_class
                        + "&cyear=" + this.queryParams.context.cyear + "&cperiod=" + this.queryParams.context.cperiod;
                } else if (this.from == 3) {
                    url = "/hrwa/waitemfomula/getPara4TaxRate?pk_org=" + this.pk_org;
                } else {
                    return;
                }
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.WaItemVOs = JSON.parse(JSON.stringify(res.data.data))
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: "页面初始化失败",
                            type: "error"
                        });
                    });
            },
            handleCancel(){
                this.dialogVisible = false;
            },
            handleSave() {
                this.$refs.paraForm.validate(valid => {
                    if (valid) {
                        let paraStr = this.DialogEntity.ksway + ", "
                        let tableName = "";
                        if (this.from == 2) {
                            tableName = "薪资发放项目";
                        } else if (this.from == 3) {
                            tableName = "公共薪资项目";
                        } else {
                            return;
                        }
                        paraStr += "[" + tableName + "." + this.DialogEntity.item2Value + "]";
                        if (this.DialogEntity.ksway == 1) {
                            paraStr += ", [" + tableName + "." + this.DialogEntity.curMonthWage + "]";
                            if (!this.DialogEntity.periodCnt) {
                                paraStr += ", 12";
                            } else {
                                paraStr += ", [" + tableName + "." + this.DialogEntity.periodCnt + "]";
                            }
                        } else {
                            paraStr += ", null, null";
                        }
                        this.$emit("paraSel", this.inputSig + "(" + paraStr + ")");
                        this.dialogVisible = false;
                    }
                });
            },
        }
    };
</script>
<style>
</style>
