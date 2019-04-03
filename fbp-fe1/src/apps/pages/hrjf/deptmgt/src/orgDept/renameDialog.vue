<!--
  作者：liyn11
  时间：2018-09-20
  支持：部门更名dialog
-->
<template>
    <div >
    <!--转移规则设置弹窗-->
    <el-dialog title="更名"  :visible.sync="dialogVisible"    size="large" :show-close="false"  width="50%">

        <!--更名-->
    <ifbp-template ref="renameRef"
                   tpl-id="hrDeptRenameId"
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
                deptCreatedDate:'',
                originalRenameDatas:{},
                pk_dept:'',
                //导出框是否显示
                dialogVisible: false,
                transData: {
                    isshow:false,
                    //校验规则
                    rules: {
                        effectdate: [
                            {
                                validator: (rule, value, callback) => {
                                    var  $effectdate = vm.$refs.renameRef.getData('hrdeptrename').effectdate.toString();
                                    var  deptCreateDate = this.deptCreatedDate.toString();
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
                    var $createDeptVersion = $node.find("[v-model='hrdeptrename.createDeptVersion']");
                    $createDeptVersion.attr('v-on:change', 'triggerDeptVersion');

                    $node.find("[v-model='hrdeptrename.originalname']").attr("disabled", "disabled");
                    return $node[0].outerHTML;
                },
                childFormMethods: {

                    triggerDeptVersion(){
                        let  iscreateVer = vm.$refs.renameRef.getData('hrdeptrename').createDeptVersion;
                        if(iscreateVer=='false'){
                            vm.$refs.renameRef.setData('isshow',false);
                            return;
                        }else{
                            vm.$refs.renameRef.setData('isshow',true);
                            this.judgeCreateVersion();
                        }
                    },

                    //判断是否可以新建版本号
                    judgeCreateVersion(){
                        let param = {
                            pk_dept:vm.pk_dept
                        };
                        this.$http({
                            url: '/hrjf/hrDept/judgeDeptVersion',
                            method: 'post',
                            params: param
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    if(res.data.data){
                                        vm.$refs.renameRef.getData('hrdeptrename').vno = vm.originalRenameDatas.vno;
                                        vm.$refs.renameRef.getData('hrdeptrename').vstartdate = vm.originalRenameDatas.vstartdate;
                                        vm.$refs.renameRef.getData('hrdeptrename').createDeptVersion = true;
                                        vm.$refs.renameRef.setData('isshow',true);
                                    }else{
                                        vm.$refs.renameRef.getData('hrdeptrename').createDeptVersion = false;
                                        this.$message({
                                            message: res.data.msg,
                                            type: 'warning'
                                        });
                                        var changeDate = vm.$refs.renameRef.getData('hrdeptrename');
                                        changeDate.createDeptVersion = false;
                                        vm.$refs.renameRef.setData('isshow',false);
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
                        message: "请选择一个部门",
                        type: 'warning'
                    });
                    return;
                }
                if(tableSelections[0].hrcanceled){
                    this.dialogVisible=false;
                    this.$message({
                        message: "已撤销部门不允许变更",
                        type: 'warning'
                    });
                    return;
                }
                this.pk_dept = tableSelections[0].pk_dept;
                this.pk_org= tableSelections[0].pk_org;
                this.originalRenameDatas = tableSelections[0];
                this.deptCreatedDate = tableSelections[0].createdate;
                if(this.isCreatedUi){
                    this.$refs.renameRef.setData('isshow',false);
                    this.$refs.renameRef.getData('hrdeptrename').originalname =this.originalRenameDatas.name;
                    this.$refs.renameRef.getData('hrdeptrename').createDeptVersion = false;
                }

            },
            afterCreateFunc(){
                this.$refs.renameRef.setData('isshow',false);
                this.$refs.renameRef.getData('hrdeptrename').originalname =this.originalRenameDatas.name;
                this.$refs.renameRef.getData('hrdeptrename').createDeptVersion = false;
                this.isCreatedUi = true;
            },
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.renameRef.setData('isshow',false);
                this.$refs.renameRef.resetFormData();
                this.originalRenameDatas={};
                this.$emit('renameRequest');
            },
            handleFinish:function(){
                if(this.pk_dept.length<1){
                    return;
                }
                this.$refs.renameRef.getData('hrdeptrename').pk_dept=this.pk_dept;
                let data = this.$refs.renameRef.getData('hrdeptrename');
                this.$refs.renameRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrDept/rename',
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
