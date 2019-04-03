<template>
            <el-form ref="waAdjustDoc" :model="waAdjustDocData" :rules="waAdjustDocRules" label-width="150px">
                <el-form-item label="变动取值方式" :required="true" prop="way">
                    <el-select placeholder="请选择" v-model="waAdjustDocData.way" @change="wayChange">
                        <el-option key="0" label="时点发放金额" value="0"></el-option>
                        <el-option key="1" label="原发放金额" value="1"></el-option>
                        <el-option key="2" label="现发放金额" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="取值项目" :required="refShow" v-show="refShow" prop="pk_wa_item">
                    <el-ref :is-muti-select="false"
                            v-model="waAdjustDocData.pk_wa_item"
                            ref-code="waitem02"
                            field="pk_wa_item"
                            pk="317f74f8-7bc5-4496-a51b-0648ffbfd48b"
                            :template-value="waAdjustDocData"
                            width="auto">
                    </el-ref>
                </el-form-item>
                <el-form-item label="说明">
                    <span>{{hint}}</span>
                </el-form-item>
            </el-form>

</template>
<script>

    export default {
        props: ['hint','queryParams'],
        data() {
            var validatek_wa_item = (rule, value, callback) => {
                if ((this.waAdjustDocData.way === 1 || this.waAdjustDocData.way == 2) && value == '') {
                    callback(new Error('请选择取值项目'));
                } else {
                    callback();
                }
            };
            return {
                func: "waAdjustDoc",
                waAdjustDocData: {
                    beanMap: {
                        pk_wa_item_ref: {},
                    },
                    pk_wa_item: '',
                    way: '',
                },
                waAdjustDocRules: {
                    way: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    pk_wa_item: [
                        {validator: validatek_wa_item, trigger: 'blur'}
                    ],
                },
                parentItemkey: '',
                //取值项目可见性控制
                refShow: false,
            };
        },
        mounted() {
        },

        methods: {
            initData(para){
            },
            wayChange(selIndex){
                if (selIndex == 0) {
                    this.refShow = false;
                    this.hint = "取定调资数据的发放金额。如果区间内发生薪资变动，则按照变动时点进行时点金额计算。";
                } else if (selIndex == 1) {
                    this.hint = "取定调资数据的发放金额。如果区间内发生薪资变动，则按照变动前发放金额进行取值。";
                    this.refShow = true;
                } else {
                    this.hint = "取定调资数据的发放金额。如果区间内发生薪资变动，则按照变动后发放金额进行取值。";
                    this.refShow = true;
                }
            },
            validate(callback){
                this.$refs[this.func].validate((valid) => {
                    callback(valid);
                });
            },
            getPara(){
                let currItemkey = "";
                if (this.waAdjustDocData.way != 0) {
                    let currPk_wa_item = this.waAdjustDocData.pk_wa_item;
                    currItemkey = this.waAdjustDocData.beanMap.pk_wa_item_ref[currPk_wa_item].itemkey;
                }
                return {
                    ifromflag: 6,
                    func: this.func,
                    way: this.waAdjustDocData.way,
                    itemkey: currItemkey,
                    parentitemkey: this.queryParams.itemkey
                };
            },

        },
    };
</script>
<style>
</style>
