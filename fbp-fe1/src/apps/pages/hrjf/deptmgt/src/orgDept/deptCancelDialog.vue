<!--
  作者：liyn11
  时间：2018-09-20
  支持：部门撤销Dialog
-->
<template>
    <div >
    <!--撤销确定弹窗-->
    <el-dialog title="撤销"  :visible.sync="dialogVisible"    size="large" :show-close="false"  width="50%">
        <ifbp-template ref="cancelRef"
                       tpl-id="hrdeptcancelId"
                       :tpl-data="transData"
                       :tpl-reset-fun="tableFormResetFun"
                       :methods="childFormMethods"
                       @after-create="afterCreateFunc">
        </ifbp-template>
        <span slot="footer" class="dialog-footer" >
            <el-button @click="handleCancel">取消</el-button>
             <el-button  @click="handleFines" type="primary">完成</el-button>
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
                                    //转移组织不能一样
                                    var  $effectdate = vm.$refs.cancelRef.getData('hrdeptcancel').effectdate.toString();
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
                    var $createDeptVersion = $node.find("[v-model='hrdeptcancel.createDeptVersion']");
                    $createDeptVersion.attr('v-on:change', 'triggerDeptVersion');
                },
                childFormMethods: {
                    triggerDeptVersion(){
                        let  iscreateVer = vm.$refs.cancelRef.getData('hrdeptcancel').createDeptVersion;
                        if(iscreateVer=='false'){
                            vm.$refs.cancelRef.setData('isshow',false);
                            return;
                        }else{
                            vm.$refs.cancelRef.setData('isshow',true);
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
                                        vm.$refs.cancelRef.getData('hrdeptcancel').vno = vm.originalRenameDatas.vno;
                                        vm.$refs.cancelRef.getData('hrdeptcancel').vstartdate = vm.originalRenameDatas.vstartdate;
                                        vm.$refs.cancelRef.getData('hrdeptcancel').createDeptVersion = true;
                                        vm.$refs.cancelRef.setData('isshow',true);
                                    }else{
                                        vm.$refs.cancelRef.getData('hrdeptcancel').createDeptVersion = false;
                                        this.$message({
                                            message: res.data.msg,
                                            type: 'warning'
                                        });
                                        var changeDate = vm.$refs.cancelRef.getData('hrdeptcancel');
                                        changeDate.createDeptVersion = false;
                                        vm.$refs.cancelRef.setData('isshow',false);
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

                this.pk_dept = tableSelections[0].pk_dept;
                this.originalRenameDatas = tableSelections[0];
                this.deptCreatedDate = tableSelections[0].createdate;
                if(this.isCreatedUi){
                    this.$refs.cancelRef.setData('isshow',false);
                    this.$refs.cancelRef.getData('hrdeptcancel').name =this.originalRenameDatas.name;
                    this.$refs.cancelRef.getData('hrdeptcancel').createDeptVersion = false;
                }
            },
            afterCreateFunc(){
                this.$refs.cancelRef.setData('isshow',false);
                this.$refs.cancelRef.getData('hrdeptcancel').name =this.originalRenameDatas.name;
                this.$refs.cancelRef.getData('hrdeptcancel').createDeptVersion = false;
                this.isCreatedUi = true;
            },
            
            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.cancelRef.setData('isshow',false);
                this.$refs.cancelRef.resetFormData();
                this.originalRenameDatas={};
                this.$emit('cancelRequest');
            },
            handleFines:function(){
                if(this.pk_dept.length<1){
                    return;
                }
                this.$refs.cancelRef.getData('hrdeptcancel').pk_dept=this.pk_dept;
                let data = this.$refs.cancelRef.getData('hrdeptcancel');
                this.$refs.cancelRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrDept/cancelDept',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '撤销成功',
                                        type: 'success'
                                    });
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
                if(flag){
                    if(oms.length!=1){
                        this.dialogVisible=false;
                        this.$message({
                            message: "请选择一个部门",
                            type: 'warning'
                        });
                        return;
                    }
                    if(oms&&oms[0]&&oms[0].hrcanceled==true){
                        this.$message({
                            message: "该部门已撤销",
                            type: 'error'
                        });
                        return;
                    }
                    this.dialogVisible=true;
                    this.request(oms);
                }
            },

        }
    }
</script>
