<!--
  作者：liyn11
  时间：2018-09-20
  支持：部门更名dialog
-->
<template>
    <div >
    <!--转移规则设置弹窗-->
    <el-dialog title="更名"  :visible.sync="dialogVisible"    size="large" :show-close="false"  width="50%">

        <!--转移规则-->
    <ifbp-template ref="renameRef"
                   tpl-id="post_rename_id"
                   :tpl-data="transData"
                   :tpl-reset-fun="tableFormResetFun"
                   @after-create="afterCreateFunc"
                   :methods="childFormMethods">
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
                originalRenameDatas:{},
                pk_post:'',
                //导出框是否显示
                dialogVisible: false,
                transData: {
                    //校验规则
                    rules: {
                        renamedate: [
                            {
                                validator: (rule, value, callback) => {
                                    debugger
                                    var  $effectdate = vm.$refs.renameRef.getData('postRename').renamedate.toString();
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
                    $node.find("[v-model='postRename.postname']").attr("disabled", "disabled");
                    return $node[0].outerHTML;
                },
                childFormMethods: {


                    //判断是否可以新建版本号
                    judgeCreateVersion(){
                        let param = {
                            pk_post:vm.pk_post
                        };
                        this.$http({
                            url: '/hrjf/hrDept/judgeDeptVersion',
                            method: 'post',
                            params: param
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    if(res.data.data){
                                        vm.$refs.renameRef.getData('postRename').vno = vm.originalRenameDatas.vno;
                                        vm.$refs.renameRef.getData('postRename').vstartdate = vm.originalRenameDatas.vstartdate;
                                    }else{

                                        this.$message({
                                            message: res.data.msg,
                                            type: 'error'
                                        });
                                    }
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: '基本信息详情获取失败',
                                    type: 'error'
                                });
                            });
                    },

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
                this.originalRenameDatas = tableSelections[0];
                this.postCreateDate = tableSelections[0].builddate;
                if(this.isCreatedUi){
                    this.$refs.renameRef.getData('postRename').postname =this.originalRenameDatas.postname
                    ;
                }

            },
            afterCreateFunc(){
                this.$refs.renameRef.getData('postRename').postname =this.originalRenameDatas.postname
                ;
                this.isCreatedUi = true;
            },
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.renameRef.resetFormData();
                this.originalRenameDatas={};
                this.$emit('renameRequest');
            },
            handleFinish:function(){
                if(this.pk_post.length<1){
                    return;
                }
                this.$refs.renameRef.getData('postRename').pk_post=this.pk_post;
                let data = this.$refs.renameRef.getData('postRename');
                this.$refs.renameRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/post/rename',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '更名成功',
                                        type: 'success'
                                    });
                                    this.$refs.renameRef.resetFormData();
                                    this.dialogVisible=false;
                                    this.$emit('renameRequest');
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((er) => {
                                this.$message({
                                    message: '更名失败'+er,
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
