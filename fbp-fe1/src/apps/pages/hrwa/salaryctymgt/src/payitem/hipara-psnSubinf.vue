<template>
    <el-form ref="psnSubinf" :model="psnSubinfData" :rules="psnSubinfRules" label-width="150px">
        <el-form-item label="日期按业务期间设置" prop="ifPeriod">
            <el-checkbox v-model="psnSubinfData.ifPeriod"></el-checkbox>
            <div style="display:inline-block;font-size:12px;padding-left:8px;">
                <label v-if="!psnSubinfData.ifPeriod">默认：日期为空取最新记录的数据</label>
                <label v-if="psnSubinfData.ifPeriod">默认：期间为空则按当前期间</label>
            </div>
        </el-form-item>
        <el-form-item label="员工信息项" :required="true" prop="pk_infoset_item">
            <el-ref :is-muti-select="false"
                    v-model="psnSubinfData.pk_infoset_item"
                    ref-code="HRWA901_psninfo"
                    field="pk_infoset_item"
                    :template-value="psnSubinfData"
                    @trigger="itemTrigger"
                    :query-params="itemQueryParams"
                    width="auto">
            </el-ref>
        </el-form-item>
        <el-form-item label="期间" prop="periodDate" v-if="!psnSubinfData.ifPeriod">
            <el-date-picker type="date" v-model="psnSubinfData.periodDate" :valuetoms="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="期间" prop="period" v-if="psnSubinfData.ifPeriod">
            <el-input v-model="psnSubinfData.period">
                <template slot="prepend">前</template>
                <template slot="append">
                    <label>期间</label>
                    <el-select v-model="psnSubinfData.appDate" placeholder="请选择" style="display:inline-block;width:100px;">
                        <el-option label="起始日期" value="0"></el-option>
                        <el-option label="终止日期" value="1"></el-option>
                    </el-select>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="参照取值" prop="way" v-if="psnSubinfData.ifWay">
            <el-select placeholder="请选择取值方式" v-model="psnSubinfData.way">
                <el-option key="1" label="编码" value="1"></el-option>
                <el-option key="2" label="名称" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="取离职前工作记录" prop="preLeave" v-if="psnSubinfData.ifPreLeave">
            <el-checkbox v-model="psnSubinfData.preLeave"></el-checkbox>
        </el-form-item>
    </el-form>
</template>
<script>

    export default {
        props: ['queryParams'],
        data() {
            return {
                func: 'psnSubinf',
                psnSubinfData: {
                    ifPeriod:false,
                    pk_infoset_item: "",
                    way: "1",
                    periodDate:"",
                    period: "",
                    appDate:"1",
                    ifWay:false,
                    preLeave:false,
                    ifPreLeave:false,
                    data_type:-1,
                    infoset_code:"",
                    item_code:"",
                    ref_model_name:"",
                    pk_infoset:"",
                    table_code:"",
                },

                psnSubinfRules: {
                },
            };
        },
        computed: {
            itemQueryParams:function(){
                return {
                };
            },
        },
        mounted() {
        },

        methods: {
            itemTrigger(type, data){
                if(data.value && data.value.length > 0){
                    this.psnSubinfData.data_type = data.value[0].data_type;
                    this.psnSubinfData.infoset_code = data.value[0].infoset_code;
                    this.psnSubinfData.item_code = data.value[0].item_code;
                    this.psnSubinfData.ref_model_name = data.value[0].ref_model_name;
                    this.psnSubinfData.pk_infoset = data.value[0].pk_infoset;
                    this.psnSubinfData.table_code = data.value[0].table_code;

                    if(this.psnSubinfData.data_type == 0 || this.psnSubinfData.data_type == 5){
                        this.psnSubinfData.ifWay = true;
                    }
                    if(this.psnSubinfData.infoset_code == "hi_psnjob"){
                        if(!this.psnSubinfData.ifPreLeave){
                            this.psnSubinfData.preLeave = false;
                        }
                        this.psnSubinfData.ifPreLeave = true;
                    }else{
                        this.psnSubinfData.ifPreLeave = false;
                        this.psnSubinfData.preLeave = false;
                    }
                    if(this.psnSubinfData.data_type == 6){
                        this.psnSubinfData.ifPreLeave = false;
                        this.psnSubinfData.preLeave = false;
                    }
                }else{
                    this.psnSubinfData.data_type = -1;
                    this.psnSubinfData.infoset_code = "";
                    this.psnSubinfData.item_code = "";
                    this.psnSubinfData.ref_model_name = "";
                    this.psnSubinfData.pk_infoset = "";
                    this.psnSubinfData.table_code = "";

                    this.psnSubinfData.ifPreLeave = false;
                    this.psnSubinfData.preLeave = false;
                    this.psnSubinfData.ifWay = false;
                }
            },

            initData(para){

            },

            validate(callback){
                this.$refs[this.func].validate((valid) => {
                    callback(valid);
                });
            },
            getPara(){
                return {
                    ifromflag: 7,
                    func: this.func,
                    iitemtype:this.queryParams.iitemtype,
                    ifPeriod:this.psnSubinfData.ifPeriod,
                    pk_infoset_item: this.psnSubinfData.pk_infoset_item,
                    way: this.psnSubinfData.way,
                    periodDate:this.psnSubinfData.periodDate,
                    period: this.psnSubinfData.period,
                    appDate:this.psnSubinfData.appDate,
                    ifWay:this.psnSubinfData.ifWay,
                    preLeave:this.psnSubinfData.preLeave,
                    ifPreLeave:this.psnSubinfData.ifPreLeave,
                    data_type:this.psnSubinfData.data_type,
                    infoset_code:this.psnSubinfData.infoset_code,
                    item_code:this.psnSubinfData.item_code,
                    ref_model_name:this.psnSubinfData.ref_model_name,
                    pk_infoset:this.psnSubinfData.pk_infoset,
                    table_code:this.psnSubinfData.table_code,
                };
            },
        },
    };
</script>
<style>
</style>
