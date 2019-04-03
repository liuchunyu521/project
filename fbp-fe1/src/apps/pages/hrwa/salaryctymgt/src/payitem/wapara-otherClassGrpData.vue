<template>
    <el-form ref="waOtherClassGrpData" :model="waOtherClassGrpData" :rules="waOtherItemRules" label-width="150px">
        <el-form-item label="薪资方案" :required="true" prop="pk_wa_class">
            <el-select placeholder="请选择薪资方案" v-model="waOtherClassGrpData.pk_wa_class" @change="classChange">
                <el-option :key="item.pk_wa_class" :label="item.name" :value="item.pk_wa_class"
                           v-for="(item,index) in waclassOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资期间" :required="true" prop="period">
            <el-select placeholder="请选择期间" v-model="waOtherClassGrpData.period" @change="periodChange">
                <el-option :key="item" :label="item" :value="item"
                           v-for="(item,index) in periodOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资项目" :required="true" prop="pk_wa_item">
            <el-select placeholder="请选择薪资项目" v-model="waOtherClassGrpData.pk_wa_item">
                <el-option :key="item.pk_wa_item" :label="item.name" :value="item.pk_wa_item"
                           v-for="(item,index) in waitemOptions"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="计算方式" prop="way" :required="true">
            <el-select placeholder="请选择计算方式" v-model="waOtherClassGrpData.way">
                <el-option key="sum" label="取和" value="sum"></el-option>
                <el-option key="avg" label="取平均值" value="avg"></el-option>
                <el-option key="max" label="取最大值" value="max"></el-option>
                <el-option key="min" label="取最小值" value="min"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="统计范围" prop="area" :required="true">
            <el-select placeholder="请选择统计范围" v-model="waOtherClassGrpData.area">
                <el-option key="pk_dept" label="所在部门" value="pk_dept"></el-option>
                <el-option key="pk_org" label="所在组织" value="pk_org"></el-option>
                <el-option key="pk_psncl" label="所在人员类别" value="pk_psncl"></el-option>
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
                func: 'waOtherClassGrpData',
                periodOptions:[],
                waclassOptions:[],
                waitemOptions: [],
                waOtherClassGrpData: {
                    pk_wa_class: '',
                    pk_wa_item: '',
                    period: '',
                    way:'',
                    area:'',
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
                    area: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                },
            };
        },
        mounted() {
        },

        methods: {
            periodChange(para){
                this.waOtherClassGrpData.pk_wa_item = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'item',
                        pk_wa_class:this.waOtherClassGrpData.pk_wa_class,
                        period:this.waOtherClassGrpData.period,
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
                this.waOtherClassGrpData.pk_wa_item = "";
                this.waOtherClassGrpData.period = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'period',
                        pk_wa_class:this.waOtherClassGrpData.pk_wa_class,
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
                this.waOtherClassGrpData.pk_wa_item = "";
                this.waOtherClassGrpData.period = "";
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
                var pk_wa_classitem = '';
                if(this.waitemOptions && this.waOtherClassGrpData.pk_wa_item){
                    for(var i = 0; i < this.waitemOptions.length; i++){
                        if(this.waOtherClassGrpData.pk_wa_item == this.waitemOptions[i].pk_wa_item){
                            pk_wa_classitem = this.waitemOptions[i].pk_wa_classitem;
                            break;
                        }
                    }
                }
                return {
                    ifromflag: 6,
                    func: this.func,
                    pk_wa_class:this.waOtherClassGrpData.pk_wa_class,
                    pk_wa_item:this.waOtherClassGrpData.pk_wa_item,
                    period:this.waOtherClassGrpData.period,
                    way:this.waOtherClassGrpData.way,
                    area:this.waOtherClassGrpData.area,
                    pk_wa_classitem:pk_wa_classitem,
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
