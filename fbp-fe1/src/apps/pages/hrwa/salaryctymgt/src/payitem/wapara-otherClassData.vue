<template>
    <el-form ref="waOtherClassData" :model="waOtherClassData" :rules="waOtherItemRules" label-width="150px">
        <el-form-item label="薪资方案" :required="true" prop="pk_wa_class">
            <el-select placeholder="请选择薪资方案" v-model="waOtherClassData.pk_wa_class" @change="classChange">
                <el-option :key="item.pk_wa_class" :label="item.name" :value="item.pk_wa_class"
                           v-for="(item,index) in waclassOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资期间" :required="true" prop="period">
            <el-select placeholder="请选择区间" v-model="waOtherClassData.period" @change="periodChange">
                <el-option :key="item" :label="item" :value="item"
                           v-for="(item,index) in periodOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资项目" :required="true" prop="pk_wa_item">
            <el-select placeholder="请选择薪资项目" v-model="waOtherClassData.pk_wa_item">
                <el-option :key="item.pk_wa_item" :label="item.name" :value="item.pk_wa_item"
                           v-for="(item,index) in waitemOptions"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="取值方式" prop="way" :required="true">
            <el-select placeholder="请选择取值方式" v-model="waOtherClassData.way">
                <el-option key="sum" label="取和" value="sum"></el-option>
                <el-option key="avg" label="取平均值" value="avg"></el-option>
                <el-option key="max" label="取最大值" value="max"></el-option>
                <el-option key="min" label="取最小值" value="min"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="部门" :required="false"  prop="pk_dept">
            <el-ref :is-muti-select="false"
                    v-model="waOtherClassData.pk_dept"
                    ref-code="hrwebdeptref"
                    field="pk_dept"
                    pk="58115861-ce2b-44e8-b881-80119db7bf84"
                    :template-value="waOtherClassData"
                    width="auto">
            </el-ref>
        </el-form-item>
        <el-form-item label="人员类别" :required="false"  prop="pk_psncl">
            <el-ref :is-muti-select="false"
                    v-model="waOtherClassData.pk_psncl"
                    ref-code="psnclref"
                    field="pk_psncl"
                    pk="400f55be-f4cc-4b38-b1e2-aabdc75e2aad"
                    :template-value="waOtherClassData"
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
            return {
                func: 'waOtherClassData',
                periodOptions:[],
                waclassOptions:[],
                waitemOptions: [],
                waOtherClassData: {
                    pk_wa_class: '',
                    pk_wa_item: '',
                    period: '',
                    way:'',
                    pk_dept:'',
                    pk_psncl:'',
                },

                waOtherItemRules: {
                    pk_wa_class: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    pk_wa_item: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    period: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    way: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                },
            };
        },
        mounted() {
        },

        methods: {
            periodChange(para){
                this.waOtherClassData.pk_wa_item = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'item',
                        pk_wa_class:this.waOtherClassData.pk_wa_class,
                        period:this.waOtherClassData.period,
                        cyear:this.queryParams.cyear,
                        cperiod:this.queryParams.cperiod,
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
                this.waOtherClassData.pk_wa_item = "";
                this.waOtherClassData.period = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'period',
                        pk_wa_class:this.waOtherClassData.pk_wa_class,
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
                this.waOtherClassData.pk_wa_item = "";
                this.waOtherClassData.period = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {func: this.func, pk_org: this.queryParams.pk_org, contextClassPk:this.queryParams.context.pk_wa_class}
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
                    pk_wa_class:this.waOtherClassData.pk_wa_class,
                    pk_wa_item:this.waOtherClassData.pk_wa_item,
                    period:this.waOtherClassData.period,
                    way:this.waOtherClassData.way,
                    pk_dept:this.waOtherClassData.pk_dept,
                    pk_psncl:this.waOtherClassData.pk_psncl,
                    cyear:this.queryParams.cyear,
                    cperiod:this.queryParams.cperiod,
                    iitemtype:this.queryParams.iitemtype,
                    itemkey:this.queryParams.itemkey,
                };
            },
        },
    };
</script>
<style>
</style>
