<template>
    <el-form ref="waStaticsRelativePrd" :model="waStaticsRelativePrdData" :rules="waStaticsRelativePrdRules" label-width="150px">
        <el-form-item label="薪资方案" :required="true" prop="pk_wa_class">
            <el-select placeholder="请选择薪资方案" v-model="waStaticsRelativePrdData.pk_wa_class" @change="classChange">
                <el-option :key="item.pk_wa_class" :label="item.name" :value="item.pk_wa_class"
                           v-for="(item,index) in waclassOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资项目" :required="true" prop="pk_wa_item">
            <el-select placeholder="请选择薪资项目" v-model="waStaticsRelativePrdData.pk_wa_item">
                <el-option :key="item.pk_wa_item" :label="item.name" :value="item.pk_wa_item"
                           v-for="(item,index) in waitemOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="统计方式" :required="true" prop="way">
            <el-select placeholder="请选择统计方式" v-model="waStaticsRelativePrdData.way">
                <el-option key="sum" label="取合计" value="sum"></el-option>
                <el-option key="avg" label="取平均值" value="avg"></el-option>
                <el-option key="max" label="取最大值" value="max"></el-option>
                <el-option key="min" label="取最小值" value="min"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="起始期间" :required="true" prop="begin">
            <el-input v-model="waStaticsRelativePrdData.begin" decimals="0" type="number">
                <template slot="prepend">前</template>
                <template slot="append">期间</template>
            </el-input>
        </el-form-item>
        <el-form-item label="终止期间" :required="true" prop="end">
            <el-input v-model="waStaticsRelativePrdData.end" decimals="0" type="number">
                <template slot="prepend">前</template>
                <template slot="append">期间</template>
            </el-input>
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
                func: 'waStaticsRelativePrd',
                waclassOptions: [],
                waitemOptions: [],
                waStaticsRelativePrdData: {
                    pk_wa_class: '',
                    pk_wa_item: '',
                    way: "sum",
                    hint:"",
                },
                waStaticsRelativePrdRules: {
                    pk_wa_class: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    pk_wa_item: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    way: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    begin: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {max: 2, message: '输入长度最多为2位', trigger: 'blur'},
                        {min: 1, message: '输入长度最多为1位', trigger: 'blur'}
                    ],
                    end: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {max: 2, message: '输入长度最多为2位', trigger: 'blur'},
                        {min: 1, message: '输入长度最多为1位', trigger: 'blur'}
                    ],
                },

                scirptLang: '',
                businessLang: '',
            };
        },
        mounted() {
        },

        methods: {
            classChange(para){
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {func: this.func, target: 'item', pk_wa_class: this.waStaticsRelativePrdData.pk_wa_class}
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
            initData(para){
                this.waStaticsRelativePrdData.pk_wa_class = "";
                this.waStaticsRelativePrdData.pk_wa_item = "";
                this.waStaticsRelativePrdData.way = "sum";
                this.waStaticsRelativePrdData.begin = "";
                this.waStaticsRelativePrdData.end = "";
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
                    pk_wa_class: this.waStaticsRelativePrdData.pk_wa_class,
                    pk_wa_item: this.waStaticsRelativePrdData.pk_wa_item,
                    way: this.waStaticsRelativePrdData.way,
                    begin: this.waStaticsRelativePrdData.begin,
                    end: this.waStaticsRelativePrdData.end,
                    iitemtype: this.queryParams.iitemtype,
                };
            },
        },
    };
</script>
<style>
</style>
