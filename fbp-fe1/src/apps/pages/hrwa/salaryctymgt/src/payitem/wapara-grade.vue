<template>
            <el-form ref="waGrade" :model="waGradeData" :rules="waGradeRules" label-width="150px">
                <el-form-item label="薪资标准类别" :required="true"  prop="pk_wa_grade">
                    <el-ref :is-muti-select="false"
                            v-model="waGradeData.pk_wa_grade"
                            ref-code="wagrade"
                            field="pk_wa_grade"
                            pk="92054d71-866d-4d82-9085-75ad2f63d4c1"
                            :template-value="waGradeData"
                            @trigger="gradeTrigger"
                            width="auto">
                    </el-ref>
                </el-form-item>
                <el-form-item label="参照取值" :required="true" prop="refIdex">
                    <el-select placeholder="请选择" v-model="waGradeData.refIdex">
                        <el-option key="0" label="级别名称" value="0"></el-option>
                        <el-option key="1" label="档别名称" value="1" v-if="isMultSec"></el-option>
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
                func: "waGrade",
                waGradeData: {
                    beanMap: {
                        pk_wa_grade_ref: {},
                    },
                    pk_wa_grade: '',
                    refIdex: '',
                },
                waGradeRules: {
                    refIdex: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    pk_wa_grade: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                },
                isMultSec: false,
            };
        },
        mounted() {
        },

        methods: {
            initData(para){
                this.waGradeData.pk_wa_grade = "";
                this.waGradeData.refIdex = "";
                return;
            },
            gradeTrigger(type, data){
                if(data.value && data.value.length > 0){
                    this.isMultSec = data.value[0].ismultsec == "是" ? true : false;
                }else{
                    this.isMultSec = false;
                }
                this.waGradeData.refIdex = "";
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
                    refIdex: this.waGradeData.refIdex,
                    pk_wa_grade: this.waGradeData.pk_wa_grade,
                    iitemtype:this.queryParams.iitemtype,
                };
            },

        },
    };
</script>
<style>
</style>
