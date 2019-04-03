<!--
  作者：liyn11
  时间：2018-09-26
  支持：部门反撤销Dialog
-->
<template>
    <div >
    <!--撤销确定弹窗-->
    <el-dialog title="取消撤销"  :visible.sync="dialogVisible"    size="large" :show-close="false"  width="50%">
        <ifbp-template ref="uncancelRef"
                       tpl-id="hrdeptuncancelId"
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
                                    var  $effectdate = vm.$refs.uncancelRef.getData('hrdeptuncancel').effectdate.toString();
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
                    var $createDeptVersion = $node.find("[v-model='hrdeptuncancel.createDeptVersion']");
                    $createDeptVersion.attr('v-on:change', 'triggerDeptVersion');
                },
                childFormMethods: {
                    triggerDeptVersion(){
                        let  iscreateVer = vm.$refs.uncancelRef.getData('hrdeptuncancel').createDeptVersion;
                        if(iscreateVer=='false'){
                            vm.$refs.uncancelRef.setData('isshow',false);
                            return;
                        }else{
                            vm.$refs.uncancelRef.setData('isshow',true);
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
                                        vm.$refs.uncancelRef.getData('hrdeptuncancel').vno = vm.originalRenameDatas.vno;
                                        vm.$refs.uncancelRef.getData('hrdeptuncancel').vstartdate = vm.originalRenameDatas.vstartdate;
                                        vm.$refs.uncancelRef.getData('hrdeptuncancel').createDeptVersion = true;
                                        vm.$refs.uncancelRef.setData('isshow',true);
                                    }else{
                                        vm.$refs.uncancelRef.getData('hrdeptuncancel').createDeptVersion = false;
                                        this.$message({
                                            message: res.data.msg,
                                            type: 'warning'
                                        });
                                        var changeDate = vm.$refs.uncancelRef.getData('hrdeptuncancel');
                                        changeDate.createDeptVersion = false;
                                        vm.$refs.uncancelRef.setData('isshow',false);
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
                    this.$refs.uncancelRef.setData('isshow',false);
                    this.$refs.uncancelRef.getData('hrdeptuncancel').name =this.originalRenameDatas.name;
                    this.$refs.uncancelRef.getData('hrdeptuncancel').createDeptVersion = false;
                }
            },
            afterCreateFunc(){
                this.$refs.uncancelRef.setData('isshow',false);
                this.$refs.uncancelRef.getData('hrdeptuncancel').name =this.originalRenameDatas.name;
                this.$refs.uncancelRef.getData('hrdeptuncancel').createDeptVersion = false;
                this.isCreatedUi = true;
            },

            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.uncancelRef.setData('isshow',false);
                this.$refs.uncancelRef.resetFormData();
                this.originalRenameDatas={};
                this.$emit('uncancelRequest');
            },
            handleFines:function(){
                if(this.pk_dept.length<1){
                    return;
                }
                this.$refs.uncancelRef.getData('hrdeptuncancel').pk_dept=this.pk_dept;
                let data = this.$refs.uncancelRef.getData('hrdeptuncancel');
                this.$refs.uncancelRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrDept/uncancelDept',
                            method: 'post',
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '取消撤销成功',
                                        type: 'success'
                                    });
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
                if(flag){
                    if(oms.length!=1){
                        this.$message({
                            message: "请选择一个部门",
                            type: 'warning'
                        });
                        return;
                    }
                    if(oms&&oms[0]&&oms[0].hrcanceled==true){
                        this.dialogVisible=true;
                        this.request(oms);
                    }else{
                        this.$message({
                            message: "该部门未撤销",
                            type: 'warning'
                        });
                    }

                }
            },
        }
    }
</script>
