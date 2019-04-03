<template>
    <el-form ref="waOtherItem" :model="waOtherItemData" :rules="waOtherItemRules" label-width="150px">
        <el-form-item label="公共薪资项目" :required="true" prop="pk_wa_item">
            <el-select placeholder="请选择薪资项目" v-model="waOtherItemData.pk_wa_item">
                <el-option :key="item.pk_wa_item" :label="item.name" :value="item.pk_wa_item"
                           v-for="(item,index) in waitemOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资期间" :required="true" prop="period">
            <el-select placeholder="请选择区间" v-model="waOtherItemData.period">
                <el-option :key="(new Date()).getFullYear()-1" label="上年度" :value="(new Date()).getFullYear()-1"></el-option>
                <el-option :key="(new Date()).getFullYear()" label="本年度" :value="(new Date()).getFullYear()"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="取值方式" :required="true" prop="way">
            <el-select placeholder="请选择取值方式" v-model="waOtherItemData.way" :disabled="true">
                <el-option key="sum" label="求和" value="sum"></el-option>
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
                func: 'waOtherItem',
                waitemOptions: [],
                waOtherItemData: {
                    pk_wa_item: '',
                    way: "sum",
                    period: '',
                },

                waOtherItemRules: {
                    pk_wa_item: [
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
            initData(para){
                this.waOtherItemData.pk_wa_item = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {func: this.func, pk_org: this.queryParams.pk_org}
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
                            message: "详情获取失败",
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
                    pk_wa_item: this.waOtherItemData.pk_wa_item,
                    year:this.waOtherItemData.period,
                };
            },
        },
    };
</script>
<style>
</style>
