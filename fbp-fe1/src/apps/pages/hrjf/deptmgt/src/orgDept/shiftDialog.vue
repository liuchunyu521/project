<!--
  作者：liyn11
  时间：2018-10-24
  支持：部门组织内转移dialog
-->
<template>
    <div >
    <!--转移规则设置弹窗-->
    <el-dialog title="组织内转移"  :visible.sync="dialogVisible"    size="large" width="50%" :show-close="false"  >

        <!--转移规则-->
    <ifbp-template ref="shiftRef"
                   tpl-id="hrDeptShiftId"
                   :tpl-data="transData"
                   :tpl-reset-fun="tableFormResetFun"
                   @after-create="afterCreateFunc"
                   :methods="childFormMethods">
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
                pk_org:'',
                //导出框是否显示
                dialogVisible: false,
                transData: {
                    paramDeptForTrans:{
                        pk_org:'',
                        pkDept:''
                    },
                    isshow:false,
                    //校验规则
                    rules: {
                        effectdate: [
                            {
                                validator: (rule, value, callback) => {
                                    //校验时间
                                    var  $effectdate = vm.$refs.shiftRef.getData('hrdeptshift').effectdate.toString();
                                    var  deptCreateDate = this.deptCreatedDate.toString();
                                    if ($effectdate && deptCreateDate&&$effectdate<deptCreateDate ) {
                                        callback(new Error("生效日期不得早于建立日期！"));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: "blur"
                            }
                        ],
                        pk_receivedept:[
                            {
                                validator: (rule, value, callback) => {
                                    //校验转移部门  不能一样
                                    var  $toDept = vm.$refs.shiftRef.getData('hrdeptshift').pk_receivedept.toString();
                                    var  $Dept = vm.pk_dept.toString();
                                    if ($Dept && $toDept&&$Dept==$toDept ) {
                                        callback(new Error("目标部门不可以是转移部门！"));
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
                    var $createDeptVersion = $node.find("[v-model='hrdeptshift.createDeptVersion']");
                    $createDeptVersion.attr('v-on:change', 'triggerDeptVersion');
                },
                childFormMethods: {

                    triggerDeptVersion(){
                        let  iscreateVer = vm.$refs.shiftRef.getData('hrdeptshift').createDeptVersion;
                        if(iscreateVer=='false'){
                            vm.$refs.shiftRef.setData('isshow',false);
                            return;
                        }else{
                            vm.$refs.shiftRef.setData('isshow',true);
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
                                        vm.$refs.shiftRef.getData('hrdeptshift').vno = vm.originalRenameDatas.vno;
                                        vm.$refs.shiftRef.getData('hrdeptshift').vstartdate = vm.originalRenameDatas.vstartdate;
                                        vm.$refs.shiftRef.getData('hrdeptshift').createDeptVersion = true;
                                        vm.$refs.shiftRef.setData('isshow',true);
                                    }else{
                                        vm.$refs.shiftRef.getData('hrdeptshift').createDeptVersion = false;
                                        this.$message({
                                            message: res.data.msg,
                                            type: 'warning'
                                        });
                                        var changeDate = vm.$refs.shiftRef.getData('hrdeptshift');
                                        changeDate.createDeptVersion = false;
                                        vm.$refs.shiftRef.setData('isshow',false);
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
                    this.$refs.shiftRef.setData('isshow',false);
                    this.$refs.shiftRef.getData('hrdeptshift').name =this.originalRenameDatas.name;
                    this.$refs.shiftRef.getData('hrdeptshift').createDeptVersion = false;
                    this.$refs.shiftRef.setData('paramDeptForTrans', {
                        pk_org:  this.pk_org,pkDept: this.pk_dept
                    });
                }
            },
            afterCreateFunc(){
                this.$refs.shiftRef.setData('isshow',false);
                this.$refs.shiftRef.getData('hrdeptshift').name =this.originalRenameDatas.name;
                this.$refs.shiftRef.getData('hrdeptshift').createDeptVersion = false;
                this.$refs.shiftRef.setData('paramDeptForTrans', {
                    pk_org:  this.pk_org,pkDept: this.pk_dept
                });
                this.isCreatedUi = true;
            },

            //取消
            handleCancel: function () {
                this.dialogVisible=false;
                this.$refs.shiftRef.setData('isshow',false);
                this.$refs.shiftRef.resetFormData();
                this.originalRenameDatas={};
                this.$emit('shiftRequest');
            },
            handleFines:function(){
                let data = this.$refs.shiftRef.getData('hrdeptshift');
                let param = {
                    pk_dept: this.pk_dept
                };
                this.$refs.shiftRef.validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: '/hrjf/hrDept/shift',
                            method: 'post',
                            data: data,
                            params:param
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$message({
                                        message: '组织内转移成功',
                                        type: 'success'
                                    });
                                    this.dialogVisible=false;
                                    this.$emit('shiftRequest');
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch((e) => {
                                this.$message({
                                    message: '组织内转移失败'+e,
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
