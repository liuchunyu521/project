<template>
    <el-form ref="waOtherPeriodData" :model="waOtherPeriodData" :rules="waOtherItemRules" label-width="150px">
        <el-form-item label="薪资方案" :required="true" prop="pk_wa_class">
            <el-select placeholder="请选择薪资方案" v-model="waOtherPeriodData.pk_wa_class" @change="classChange">
                <el-option :key="item.pk_wa_class" :label="item.name" :value="item.pk_wa_class"
                           v-for="(item,index) in waclassOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资期间" :required="true" prop="period">
            <el-select placeholder="请选择区间" v-model="waOtherPeriodData.period" @change="periodChange">
                <el-option :key="item" :label="item" :value="item"
                           v-for="(item,index) in periodOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资项目" prop="pk_wa_item">
            <el-select placeholder="请选择薪资项目" v-model="waOtherPeriodData.pk_wa_item">
                <el-option :key="item.pk_wa_item" :label="item.name" :value="item.pk_wa_item"
                           v-for="(item,index) in waitemOptions"></el-option>
            </el-select>
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
            return {
                func: 'waOtherPeriodData',
                periodOptions:[],
                waclassOptions:[],
                waitemOptions: [],
                waOtherPeriodData: {
                    pk_wa_class: '',
                    pk_wa_item: '',
                    period: '',
                },

                waOtherItemRules: {
                    pk_wa_class: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    period: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                },
            };
        },
        mounted() {
        },

        methods: {
            periodChange(para){
                this.waOtherPeriodData.pk_wa_item = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'item',
                        pk_wa_class:this.waOtherPeriodData.pk_wa_class,
                        period:this.waOtherPeriodData.period,
                        waYear:this.queryParams.cyear,
                        waPeriod:this.queryParams.cperiod,
                        iitemtype:this.queryParams.iitemtype,
                    }
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.waitemOptions = res.data.data.item;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "薪资期间下拉框数据获取失败",
                            type: "error"
                        });
                    });
            },
            classChange(para){
                this.waOtherPeriodData.pk_wa_item = "";
                this.waOtherPeriodData.period = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'period',
                        pk_wa_class:this.waOtherPeriodData.pk_wa_class,
                    }
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.periodOptions = res.data.data.period;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "薪资期间下拉框数据获取失败",
                            type: "error"
                        });
                    });
            },
            initData(para){
                this.waOtherPeriodData.pk_wa_item = "";
                this.waOtherPeriodData.period = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {func: this.func, pk_org: this.queryParams.pk_org}
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.waclassOptions = res.data.data.class;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "薪资方案下拉框数据获取失败",
                            type: "error"
                        });
                    });
            },

            validate(callback){
                this.$refs[this.func].validate((valid) => {
                    callback(valid);
                });
            },
            getPara(){
                return {
                    ifromflag: 6,
                    func: this.func,
                    pk_wa_class:this.waOtherPeriodData.pk_wa_class,
                    pk_wa_item:this.waOtherPeriodData.pk_wa_item,
                    period:this.waOtherPeriodData.period,
                    waYear:this.queryParams.cyear,
                    waPeriod:this.queryParams.cperiod,
                    iitemtype:this.queryParams.iitemtype,
                    itemkey:this.queryParams.itemkey,
                };
            },
        },
    };
</script>
<style>
</style>
