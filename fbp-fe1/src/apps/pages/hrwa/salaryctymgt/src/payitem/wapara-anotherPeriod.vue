<template>
    <el-form ref="waAnotherPeriod" :model="waAnotherPeriod" :rules="waOtherItemRules" label-width="150px">
        <el-form-item label="期间项目" :required="true"  prop="pk_wa_classitem">
            <el-ref :is-muti-select="false"
                    v-model="waAnotherPeriod.pk_wa_classitem"
                    ref-code="classitem01"
                    field="pk_wa_classitem"
                    pk="e2d14b43-c222-42c9-aede-325dcd2f997a"
                    :template-value="waAnotherPeriod"
                    @trigger="classItemTrigger"
                    :query-params="classItemQueryParams"
                    width="auto">
            </el-ref>
        </el-form-item>
        <el-form-item label="薪资方案" :required="true" prop="pk_wa_class">
            <el-select placeholder="请选择薪资方案" v-model="waAnotherPeriod.pk_wa_class" @change="classChange">
                <el-option :key="item.pk_wa_class" :label="item.name" :value="item.pk_wa_class"
                           v-for="(item,index) in waclassOptions"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="薪资项目" :required="true" prop="pk_wa_item">
            <el-select placeholder="请选择薪资项目" v-model="waAnotherPeriod.pk_wa_item">
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
                func: 'waAnotherPeriod',
                waclassOptions:[],
                waitemOptions: [],
                waAnotherPeriod: {
                    pk_wa_class: '',
                    pk_wa_item: '',
                    pk_wa_classitem: '',
                    classitem_itemkey: '',
                },

                waOtherItemRules: {
                    pk_wa_class: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    pk_wa_item: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    pk_wa_classitem: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                },
            };
        },
        computed: {
            classItemQueryParams:function(){
                return {
                    pk_org: this.queryParams.pk_org,
                    pk_wa_class:this.queryParams.context.pk_wa_class,
                    cyear:this.queryParams.cyear,
                    cperiod:this.queryParams.cperiod,
                    iitemtype:'1',
                };
            },
        },
        mounted() {
        },

        methods: {

            classItemTrigger(type, data){
                if(data.value && data.value.length > 0){
                    this.waAnotherPeriod.classitem_itemkey = data.value[0].itemkey;
                }else{
                    this.waAnotherPeriod.classitem_itemkey = "";
                }
            },
            classChange(para){
                this.waAnotherPeriod.pk_wa_item = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        target:'item',
                        pk_wa_class:this.waAnotherPeriod.pk_wa_class,
                        cyear:this.queryParams.cyear,
                        cperiod:this.queryParams.cperiod,
                    }
                })
                    .then(res => {
                        if (res.data.status === true) {
                            this.waitemOptions = res.data.data.period;
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "薪资项目下拉框数据获取失败",
                            type: "error"
                        });
                    });
            },
            initData(para){
                this.waAnotherPeriod.pk_wa_item = "";
                this.$http({
                    url: "/hrwa/payitem/detail/queryParaData",
                    method: "post",
                    data: {
                        func: this.func,
                        pk_org: this.queryParams.pk_org,
                        contextClassPk:this.queryParams.context.pk_wa_class,
                        cyear:this.queryParams.cyear,
                        cperiod:this.queryParams.cperiod,
                    }
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
                    pk_wa_class:this.waAnotherPeriod.pk_wa_class,
                    pk_wa_item:this.waAnotherPeriod.pk_wa_item,
                    classitem_itemkey:this.waAnotherPeriod.classitem_itemkey,
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
