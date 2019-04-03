<!--
  作者：liyn11
  时间：2018-11-07
  支持：岗位取消撤销dialog
-->
<template>
    <div >
    <!--转移规则设置弹窗-->
    <el-dialog title="取消撤销"  :visible.sync="dialogVisible"    size="small" :show-close="false">

        <!--转移规则-->
    <ifbp-template ref="uncancelRef"
                   tpl-id="post_uncancel_id"
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
                originalUnCancelDatas:{},
                pk_post:'',
                //导出框是否显示
                dialogVisible: false,
                transData: {
                    //校验规则
                    rules: {
                        effectDate: [
                            {
                                validator: (rule, value, callback) => {
                                    debugger
                                    var  $effectdate = vm.$refs.uncancelRef.getData('postUnCancel').effectDate.toString();
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
                debugger
                this.pk_post = tableSelections[0].pk_post;
                this.pk_org= tableSelections[0].pk_org;
                this.originalUnCancelDatas = tableSelections[0];
                this.postCreateDate = tableSelections[0].builddate;
                if(this.isCreatedUi){
                    this.$refs.uncancelRef.getData('postUnCancel').postname =this.originalUnCancelDatas.postname;
                }
            },
            afterCreateFunc(){
                this.$refs.uncancelRef.getData('postUnCancel').postname =this.originalUnCancelDatas.postname;
                this.isCreatedUi = true;
            },
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.uncancelRef.resetFormData();
                this.originalUnCancelDatas={};
                this.$emit('uncancelRequest');
            },
            handleFinish:function(){
                if(this.pk_post.length<1){
                    return;
                }
                let data = this.$refs.uncancelRef.getData('postUnCancel');
                data.pk_post = this.pk_post;
                this.$refs.uncancelRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/post/unCancelPost',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '取消撤销成功',
                                        type: 'success'
                                    });
                                    this.$refs.uncancelRef.resetFormData();
                                    this.dialogVisible=false;
                                    this.$emit('uncancelRequest');
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((er) => {
                                this.$message({
                                    message: '取消撤销失败'+er,
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
                if(flag&&oms&&oms[0]&&oms[0].hrcanceled==true){
                    this.dialogVisible=true;
                    this.request(oms);
                }else{
                    this.$message({
                        message: "该岗位未撤销",
                        type: 'warning'
                    });
                }
            },

        }
    }
</script>
