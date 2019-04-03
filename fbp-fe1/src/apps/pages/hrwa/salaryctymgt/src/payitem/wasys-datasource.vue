<template>
    <div style="padding:0 16px 0 0;">
        <br/>
        <div style="width:100%;min-height:350px;">
            <el-form ref="common" :model="commonData" label-width="150px">
                <el-form-item label="薪资信息" prop="func" :required="true">
                    <el-select placeholder="请选择" v-model="commonData.func" @change="funcChange">
                        <el-option
                                v-for="(item,index) in funcOptions"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <adjust-doc-form ref="waAdjustDocRef" :hint="hint" :queryParams="queryParams"
                             v-if="commonData.func=='waAdjustDoc'"></adjust-doc-form>
            <statics-fix-prd-form ref="waStaticsFixPrdRef" :hint="hint" :queryParams="queryParams"
                                  v-if="commonData.func=='waStaticsFixPrd'"></statics-fix-prd-form>
            <other-item-form ref="waOtherItemRef" :hint="hint" :queryParams="queryParams"
                             v-if="commonData.func=='waOtherItem'"></other-item-form>
            <other-period-data-form ref="waOtherPeriodDataRef" :hint="hint" :queryParams="queryParams"
                                    v-if="commonData.func=='waOtherPeriodData'"></other-period-data-form>
            <grade-form ref="gradeInfoDataRef" :hint="hint" :queryParams="queryParams"
                        v-if="commonData.func=='gradeInfoData'"></grade-form>
            <other-class-data-form ref="waOtherClassDataRef" :hint="hint" :queryParams="queryParams"
                                  v-if="commonData.func=='waOtherClassData'"></other-class-data-form>
            <other-class-grp-data-form ref="waOtherClassGrpDataRef" :hint="hint" :queryParams="queryParams"
                                   v-if="commonData.func=='waOtherClassGrpData'"></other-class-grp-data-form>
            <another-period-form ref="payDataItemRef" :hint="hint" :queryParams="queryParams"
                                       v-if="commonData.func=='payDataItem'"></another-period-form>
            <statics-relative-prd-form ref="waStaticsRelativePrdRef" :hint="hint" :queryParams="queryParams"
                                 v-if="commonData.func=='waStaticsRelativePrd'"></statics-relative-prd-form>
        </div>
        <div class="el-dialog__footer dialog-footer">
            <el-button @click="dialogCancel">取 消</el-button>
            <el-button @click="dialogConfirm" type="primary">确 定</el-button>
        </div>
    </div>
</template>
<script>

    import adjustDocForm from './wapara-adjustDoc.vue';
    import staticsFixPrdForm from './wapara-staticsFixPrd.vue';
    import otherItemForm from './wapara-otherItem.vue';
    import otherPeriodDataForm from './wapara-otherPeriodData.vue';
    import gradeForm from './wapara-grade.vue';
    import otherClassDataForm from './wapara-otherClassData.vue';
    import otherClassGrpDataForm from './wapara-otherClassGrpData.vue';
    import anotherPeriodForm from './wapara-anotherPeriod.vue';
    import staticsRelativePrdForm from './wapara-staticsRelativePrd.vue';
    export default {
        props: ['refCode', 'field', 'templateValue', 'isMutiSelect', 'queryParams'],

        components: {
            adjustDocForm,
            staticsFixPrdForm,
            otherItemForm,
            otherPeriodDataForm,
            gradeForm,
            otherClassDataForm,
            otherClassGrpDataForm,
            anotherPeriodForm,
            staticsRelativePrdForm,
        },
        data() {
            return {
                commonData: {
                    func: 0,
                },

                //薪资信息函数的选项
                funcOptions: [],
                scirptLang: '',
                businessLang: '',
                //确定按钮按下后,回传得数据格式
                selectedData: [{id: '', code: '', name: ''}],
                hint: '',

            };
        },
        mounted() {
            this.init();
        },

        methods: {
            funcChange(para){
                debugger;
                if (!para) {
                    return;
                }

                for (var i =0; i < this.funcOptions.length; i++) {
                    if (this.funcOptions[i].key == para) {
                        this.hint = this.funcOptions[i].hintmsg;
                    }
                }
                this.$nextTick(function () {
                    this.$refs[this.commonData.func + "Ref"].initData(para);
                });
            },
            init(){
                this.$http({
                    url: "/hrwa/payitem/detail/queryFunNamesByFrom",
                    method: "post",
                    data: {ifromflag: 6}
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.funcOptions = res.data.data;
                            if (this.funcOptions && this.funcOptions.length > 0) {
                                this.commonData.func = this.funcOptions[0].key;
                                this.funcChange(this.funcOptions[0].key);
                            }
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

            dialogConfirm: function dialogConfirm() {
                this.$refs[this.commonData.func + "Ref"].validate((valid) => {
                    if (valid) {
                        this.realSave();
                    } else {
                    }
                });
            },
            realSave() {

                this.$http({
                    url: "/hrwa/payitem/detail/getScriptLangForWa",
                    method: "post",
                    data: this.$refs[this.commonData.func + "Ref"].getPara()
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.scirptLang = res.data.data.scirptLang;
                            this.businessLang = res.data.data.businessLang;
                            this.selectedData[0].id = this.commonData.func;
                            this.selectedData[0].code = this.scirptLang;
                            this.selectedData[0].name = this.businessLang;
                            this.$emit('customRefConfirm', this.selectedData);

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
            dialogCancel: function dialogCancel() {
                this.$emit('customRefCancel');
            },
        },
    };
</script>
<style>
</style>
