<!--
  作者：liyn11
  时间：2018-11-07
  支持：岗位撤销dialog
-->
<template>
    <div >
    <!--转移规则设置弹窗-->
    <el-dialog title="撤销"  :visible.sync="dialogVisible"    size="small" :show-close="false">

        <!--转移规则-->
    <ifbp-template ref="cancelRef"
                   tpl-id="post_cancel_id"
                   :tpl-data="transData"
                   :tpl-reset-fun="tableFormResetFun"
                   @after-create="afterCreateFunc"
                   :methods="formMethod">
    </ifbp-template>

    <span slot="footer" class="dialog-footer" >
        <el-button @click="handleCancel">取消</el-button>
         <el-button  @click="handleFinish" type="primary">完成</el-button>
      </span>
</el-dialog>
    </div>
</template>

<script>
    export default {

        data() {
            const vm = this;
            return {
                isCreatedUi:false,
                postCreateDate:'',
                originalCancelDatas:{},
                pk_post:'',
                //导出框是否显示
                dialogVisible: false,
                transData: {
                    //校验规则
                    rules: {
                        mergeDate: [
                            {
                                validator: (rule, value, callback) => {
                                    var  $effectdate = vm.$refs.cancelRef.getData('postCancel').effectDate.toString();
                                    var  deptCreateDate = this.postCreateDate.toString();
                                    if ($effectdate && deptCreateDate&&$effectdate<deptCreateDate ) {
                                        callback(new Error("生效日期不得早于建立日期！"));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: "blur"
                            }
                        ]
                    },
                },
                tableFormResetFun($node) {
                },
                formMethod: {
                },

            }
        },
        mounted() {

        },
        methods: {
            request(oms) {
                var tableSelections = oms;
                this.pk_post = tableSelections[0].pk_post;
                this.pk_org= tableSelections[0].pk_org;
                this.originalCancelDatas = tableSelections[0];
                this.postCreateDate = tableSelections[0].builddate;
                if(this.isCreatedUi){
                    this.$refs.cancelRef.getData('postCancel').postname =this.originalCancelDatas.postname;
                }
            },
            afterCreateFunc(){
                this.$refs.cancelRef.getData('postCancel').postname =this.originalCancelDatas.postname;
                this.isCreatedUi = true;
            },
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.cancelRef.resetFormData();
                this.originalCancelDatas={};
                this.$emit('cancelRequest');
            },
            handleFinish:function(){
                if(this.pk_post.length<1){
                    return;
                }
                let data = this.$refs.cancelRef.getData('postCancel');
                data.pk_post = this.pk_post;
                this.$refs.cancelRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/post/cancelPost',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '撤销成功',
                                        type: 'success'
                                    });
                                    this.$refs.cancelRef.resetFormData();
                                    this.dialogVisible=false;
                                    this.$emit('cancelRequest');
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((er) => {
                                this.$message({
                                    message: '撤销失败'+er,
                                    type: 'error'
                                });
                            });
                    }
                });

            },

            // 设置dialog是否可见
            setDialogVisible: function (flag,oms) {
                if(oms.length!=1){
                    this.dialogVisible=false;
                    this.$message({
                        message: "请选择一个岗位",
                        type: 'warning'
                    });
                    return;
                }
                if(flag&&oms&&oms[0]&&oms[0].hrcanceled==false){
                    this.dialogVisible=true;
                    this.request(oms);
                }else{
                    this.$message({
                        message: "该岗位已撤销",
                        type: 'warning'
                    });
                }
            },

        }
    }
</script>
