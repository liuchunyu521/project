<template>
    <!-- <div v-show="value">  -->
    <el-dialog title="计薪日天数" v-model="dialogVisible" size="tiny">
        <div style="width:100%;">
            <br/>
            <el-form :rules="rules" label-width="80px" ref="paraForm" :model="DialogEntity">
                <el-form-item label="开始日期" prop="beginDate">
                    <el-date-picker
                            v-model="DialogEntity.beginDate"
                            format="yyyy-MM-dd"
                            align="right"
                            type="date"
                            placeholder="选择开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" prop="endDate">
                    <el-date-picker
                            v-model="DialogEntity.endDate"
                            format="yyyy-MM-dd"
                            align="right"
                            type="date"
                            placeholder="选择结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- </div>  -->
</template>
<script>

    export default {
        //from=1:薪资规则  from=2:薪资发放项目 from=3:公共薪资项目
        props: ["pk_org", "from", "inputSig"],
        data() {
            return {
                dialogVisible: false,
                DialogEntity: {
                    beginDate: '',
                    endDate: '',
                },
                rules: {},
            };
        },
        watch: {
            dialogVisible(val){
                if (!val) {
                    this.$emit('input', val);
                }
            }
        },

        mounted() {
        },

        methods: {
            show(){
                this.initData();
            },
            initData(){
                this.dialogVisible = true;
                this.DialogEntity.beginDate = '';
                this.DialogEntity.endDate = '';
            },
            handleCancel(){
                this.dialogVisible = false;
            },
            handleSave() {
                this.$refs.paraForm.validate(valid => {
                    if (valid) {
                        let begin = !this.DialogEntity.beginDate ? "" : this.date2str(this.DialogEntity.beginDate);
                        let end = !this.DialogEntity.endDate ? "" : this.date2str(this.DialogEntity.endDate);

                        this.$emit("paraSel", this.inputSig + "(\"" + begin + "\",\"" + end + "\")");
                        this.dialogVisible = false;
                    }
                });
            },
            date2str(date){
                var yyyy = date.getFullYear().toString();
                var M = date.getMonth() + 1;
                var MM = (M < 10) ? "0" + M : M;
                var dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
                return yyyy + "-" + MM + "-" + dd;
            },
        }
    };
</script>
<style>
</style>
