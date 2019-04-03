<!--
  作者：liyn11
  时间：2018-09-20
  支持：部门更名dialog
-->
<template>
    <div >
    <!--转移规则设置弹窗-->
    <el-dialog title="合并"  :visible.sync="dialogVisible"    size="large" :show-close="false"  width="50%">

        <!--转移规则-->
    <ifbp-template ref="mergeRef"
                   tpl-id="post_merge_id"
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
                originalMergeDatas:{},
                pk_post:'',
                pk_org:'',
                //导出框是否显示
                dialogVisible: false,
                transData: {
                    //校验规则
                    rules: {
                        mergeDate: [
                            {
                                validator: (rule, value, callback) => {
                                    var  $effectdate = vm.$refs.mergeRef.getData('postMerge').mergeDate;
                                    var  deptCreateDate = vm.postCreateDate;
                                    if ($effectdate && deptCreateDate&&$effectdate<deptCreateDate ) {
                                        callback(new Error("合并日期不得早于建立日期！"));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: "blur"
                            }
                        ]
                    },
                    paramReceivePost:{
                        pkPost:"",pk_org:""
                    }

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
                if(tableSelections.length!=1){
                    this.dialogVisible=false;
                    this.$message({
                        message: "请选择一个岗位",
                        type: 'warning'
                    });
                    return;
                }
                if(tableSelections[0].hrcanceled){
                    this.dialogVisible=false;
                    this.$message({
                        message: "已撤销岗位不允许变更",
                        type: 'warning'
                    });
                    return;
                }
                this.pk_post = tableSelections[0].pk_post;
                this.pk_org= tableSelections[0].pk_org;
                this.originalMergeDatas = tableSelections[0];
                this.postCreateDate = tableSelections[0].builddate;
                if(this.isCreatedUi){
                    this.$refs.mergeRef.getData('postMerge').postname =this.originalMergeDatas.postname;
                }
                this.$refs.mergeRef.setData('paramReceivePost', {
                    pkPost: this.pk_post,pk_org:this.pk_org
                });

            },
            afterCreateFunc(){
                this.$refs.mergeRef.getData('postMerge').postname =this.originalMergeDatas.postname;
                this.$refs.mergeRef.setData('paramReceivePost', {
                    pkPost: this.pk_post,pk_org:this.pk_org
                });
                this.isCreatedUi = true;
            },
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.mergeRef.resetFormData();
                this.originalMergeDatas={};
                this.$emit('mergeRequest');
            },
            handleFinish:function(){
                if(this.pk_post.length<1){
                    return;
                }
                let data = this.$refs.mergeRef.getData('postMerge');
                data.mergedPostPK = this.pk_post;
                this.$refs.mergeRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/post/mergePost',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '合并成功',
                                        type: 'success'
                                    });
                                    this.$refs.mergeRef.resetFormData();
                                    this.dialogVisible=false;
                                    this.$emit('mergeRequest');
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((er) => {
                                this.$message({
                                    message: '合并失败'+er,
                                    type: 'error'
                                });
                            });
                    }
                });

            },

            // 设置dialog是否可见
            setDialogVisible: function (flag,oms) {
                if(flag){
                    this.dialogVisible=true;
                    this.request(oms);
                }
            },

        }
    }
</script>
