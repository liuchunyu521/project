<template>
    <ifbp-page>
        <ifbp-breadcrumb name="定薪调薪详情"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="basePanel" title="人员信息"  class="titleLine">
                    <ifbp-template ref="ref_psndocwadoc_c"
                                   tpl-id="headPanel"
                                   
                                   :editable="psnEdit"
                                   :tplData="psndocwadocData"
                                   :tplResetFun="psndocwadocResetFun"
                                   :methods="psndocwadocFormMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!-- 子表页签 -->
                <ifbp-panel id="subPanel" title="定调薪信息" :toggle-show="false">
                    <ifbp-template ref="ref_psndocwadoc_sub"
                                   tpl-id="bodyPanel"
                                   :tpl-data="wadocData"
                                   :editable="false"
                                   @update:editable="updataEditable"
                                   :tplResetFun="wadocResetFun"
                                   :methods="wadocFormMethods"
                                   :table-show-menu="false"
                                   @row-click="tableFormRowClick"
                                   @form-edit-click = "wadocFormEdit"
                                   @edit-table-click="wadocEditClick"
                                   @delete-table-click="wadocDeleteClick"
                                   @form-confirm-click="wadocFormConfirm"
                                   @form-cancel-click="wadocFormCancel"
                                   @form-delete-click="wadocFormDelete"

                                   :table-oper-vif="false"
                                   @expand="rowExpend"
                                   :confirm-clear-edit="false"
                                   :confirm-button-show="false"
                                   :edit-button-show="false"
                                   :cancel-button-show="false"
                                   :delete-button-show="false"
                                   confirm-button="保存"
                                   edit-button="编辑"
                                   cancel-button="取消"
                                   delete-button="删除"

                            >
                    </ifbp-template>

                    <ifbp-del-dialog
                            v-model="delDialogVisible"
                            message="确认删除该数据？删除后无法恢复。"
                            @click="wadocDeleteDialogClick"
                    >
                    </ifbp-del-dialog>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>
<script>

    import gradePrmSecDialog from '../psndocwadoc/gradeprmsec-dialog.vue';

    // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        data() {
            Vue.component('grade-prm-sec-dialog', gradePrmSecDialog);
            var vm = this;
            return {
                // 通过传入的参数判断是新增还是修改操作
                pk_psndoc: '',
                pk_psnjob: '',
                pk_org: '',
                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                cancelButton:"取消",
                formData: {
                    psndocwadoc: {
                        psnname: '',
                        psncode: '',
                        orgname: '',
                        deptname: '',
                        psotname: '',
                        jobname: '',
                        psncl: ''
                    }
                },
                psnEdit: false,
                wadocEdit: false,
                tableOperVif:true,
                wadocBaseData: [],
                editData: null,
                delData: null,
                wadocEditIndex: -1,
                delDialogVisible: false,
                // UI模板所需参数
                pk_tempform: "0001AA1000000001E1PF",
                pk_tempsub: "0001AA1000000001EOV5",
                //单据VO的状态
                bodystatus: 2,//1,update;2,new;3,delete
                //showicons: null,
                addicons: [{
                    icon: 'plus',
                    click: () => {
                        // 关闭table中的编辑区
                        vm.$refs.ref_psndocwadoc_sub.getTableComp().closeExpandRow();
                        // 重置新增数据
                        vm.$refs.ref_psndocwadoc_sub.resetFormData();
                        vm.$refs.ref_psndocwadoc_sub.getFormData().negotiation_wage=false;
                        // 显示新增区域
                        vm.$refs.ref_psndocwadoc_sub.formShow = true;
                        if( vm.$refs.ref_psndocwadoc_sub.getTableData() && vm.$refs.ref_psndocwadoc_sub.getTableData().length>0){
                            vm.$refs.ref_psndocwadoc_sub.tableShow = true;
                        }else{
                            vm.$refs.ref_psndocwadoc_sub.tableShow = false;
                        }
                        vm.wadocEdit = true;
                        //vm.showicons = null;
                        vm.bodystatus = 2;
                        vm.$refs.ref_psndocwadoc_sub.setData("waItemDisable",false);
                    }
                }],
                wadocData: {
                    waItemDisable:true,
                    psnparams: {
                        pk_org: "",
                        pk_group: "",
                    },
                    wagrdparams: {
                        pk_wa_item: "",
                        pk_org:""
                    },

                    waitemparams:{},
                    rules: {
                        name: [{
                            required: true,
                            message: '名称不能为空',
                            trigger: 'blur'
                        }],
                        code: [{
                            required: true,
                            message: '编码不能为空',
                            trigger: 'blur'
                        }]
                    }
                },

                psndocwadocData: {
                    psnidshow: false,

                },

                psndocwadocResetFun: function ($node) {

                    var $psnidlab = $node.find("[prop='psnid']");
                    $psnidlab.attr("v-show", "psnidshow");

                    var $psnid = $node.find("[v-model='psndocwadoc.psnid']");
                    $psnid.attr('v-on:change', 'selectPsnid');
                    //$psnid.attr(":editable","false");
                    return $node[0].outerHTML;

                },
                psndocwadocFormMethods: {
                    selectPsnid(data){
                        //FIXME 组织的主键
                        if(data.value[0]){
                            sessionStorage.setItem("pk_psndoc",data.value[0].id);
                            //TODO: 人员任职信息主键
                            sessionStorage.setItem("pk_psnjob",data.value[0].pk_psnjob);
                            vm.$refs.ref_psndocwadoc_c.setData('psnidshow', false);
                            vm.$refs.ref_psndocwadoc_c.setData("wagrdparams" ,{"pk_wa_item":null,"pk_org":data.value[0].pk_org});
                            vm.request();
                        }
                    }
                },

                wadocResetFun: function ($node) {

                    var $pk_wa_item = $node.find("[v-model='PsndocWadocVO.pk_wa_item']");
                    $pk_wa_item.attr('v-on:change', 'waItemChange');
                    $pk_wa_item.attr(":disabled","waItemDisable");

                    var $funcode = $node.find("[v-model='PsndocWadocVO.negotiation_wage']");
                    $funcode.attr('v-on:change', 'handleChange');

                    var $pk_wa_crt = $node.find('[v-model="PsndocWadocVO.pk_wa_crt"]');
                    $pk_wa_crt.attr("custom-dialog-size","small");
                    $pk_wa_crt.attr('v-on:trigger', 'wacrtChange');
                    $pk_wa_crt.attr(":disabled","PsndocWadocVO.negotiation_wage");
                    $pk_wa_crt.attr("dialog-title","薪资标准表");
                    //$pk_wa_crt.attr(":editable","editable && !PsndocWadocVO.negotiation_wage");

                    var $pk_wa_crt_lab = $node.find('[prop="pk_wa_crt"]');
                    $pk_wa_crt_lab.attr(":required","!PsndocWadocVO.negotiation_wage");

                    var $pk_wa_grd = $node.find('[v-model="PsndocWadocVO.pk_wa_grd"]');
                    $pk_wa_grd.attr(":disabled","PsndocWadocVO.negotiation_wage");
                    $pk_wa_grd.attr("v-on:trigger","wagrdChange");

                    var $pk_wa_grd_lab = $node.find('[prop="pk_wa_grd"]');
                    $pk_wa_grd_lab.attr(":required","!PsndocWadocVO.negotiation_wage");

                    var $nmoney = $node.find('[v-model="PsndocWadocVO.nmoney"]');
                    //太厉害了，我自己都佩服自己了
                    $nmoney.attr(":disabled","!(PsndocWadocVO.negotiation_wage?PsndocWadocVO.negotiation_wage:PsndocWadocVO.isrange)");

                    var $table = this.getTableDom($node);
                    $table.attr(':show-header', 'false');
                    var operateHtml = this.getBaseTableOperateHtml("");
                    $table.append(operateHtml);
                    return $node[0].outerHTML;

                },

                wadocFormMethods: {
                    handleChange(val){
                        if(val.returnValue){
                            let data = vm.$refs.ref_psndocwadoc_sub.getFormData();
                            data.pk_wa_grd = null;
                            data.nmoney = null;
                            data.pk_wa_crt = null;
                        }
                    },
                    wagrdChange(type,val){
                        let temp = val.value[0];
                        if(temp){
                            vm.$refs.ref_psndocwadoc_sub.getFormData().isrange = temp.isrange=="是";
                            vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_grd = temp.id;
                        }

                        vm.$refs.ref_psndocwadoc_sub.getFormData().beanMap.pk_wa_crt_ref = {};
                        //vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_grd =null;
                        vm.$refs.ref_psndocwadoc_sub.getFormData().nmoney = null;
//                        vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_crt = null;

                    },
                    waItemChange(val){
                        if(val.value[0]){
                            this.wagrdparams = {"pk_wa_item":val.value[0].id,"pk_org":vm.pk_org};
                        }else{
                            this.wagrdparams = {"pk_wa_item":null,"pk_org":vm.pk_org};
                        }
                        vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_grd =null;
                        vm.$refs.ref_psndocwadoc_sub.getFormData().beanMap.pk_wa_crt_ref = {};
//                        vm.$refs.ref_psndocwadoc_sub.comp.$refs.ref_pk_wa_grd.reset();
//                        vm.$refs.ref_psndocwadoc_sub.getFormData().beanMap.pk_wa_crt_ref = {};
//                        vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_grd ='';
                        vm.$refs.ref_psndocwadoc_sub.getFormData().nmoney = null;
                    },
                    wacrtChange(type,val){
                        debugger
                        let temp = val.value[0];
                        if(temp){
                            if(temp.criterionvalue){
                                vm.$refs.ref_psndocwadoc_sub.getFormData().nmoney=temp.criterionvalue;
                            }else{
                                vm.$refs.ref_psndocwadoc_sub.getFormData().nmoney=null;
                            }
                            if(temp.pk_wa_grd){
                                vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_grd = temp.pk_wa_grd;
                            }
                            // else{
                            //     vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_grd = null;
                            // }
                            if(temp.pk_wa_seclv){
                                vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_seclv = temp.pk_wa_seclv;
                            }
                            // else{
                            //     vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_seclv = null;
                            // }
                            if(temp.pk_wa_prmlv){
                                vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_prmlv = temp.pk_wa_prmlv;
                            }
                            // else{
                            //     vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_prmlv = null;
                            // }
                            if(temp.code){
                                vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_crt_showname = temp.code;
                            }else{
                                vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_crt_showname = null;
                            }
                            //vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_crt_showname = temp.code;
                        }else{
                            vm.$refs.ref_psndocwadoc_sub.getFormData().nmoney=null;
                            vm.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_crt_showname = null;
                        }
                    }
                }

            };
        },
        mounted() {
            this.request();
        },
        methods: {
            // 获取数据
            request() {

                // 请求表头数据
                this.pk_psndoc = sessionStorage.getItem("pk_psndoc");
                this.pk_psnjob = sessionStorage.getItem("pk_psnjob");
                if (this.pk_psndoc == null || this.pk_psndoc === undefined || this.pk_psndoc == "null") {
                    this.psnEdit = true;
                    this.wadocEdit = true;
                    this.psndocwadocData.psnidshow = true;
                    this.$refs.ref_psndocwadoc_sub.tableShow = false;
                } else {
                    this.psnEdit = false;
                    this.wadocEdit = false;
                    //this.showicons = this.addicons;
                    this.requestPsnData();
                    this.requestSubData();
                }
            },
            requestSubData() {
                this.$http({
                    url: '/hrwa/psndocwadoc/getByHeadPk/' + this.pk_psndoc,
                    method: 'get'
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$nextTick(() => {
                                let data = res.data.data;
                                if(data){
                                    this.$refs.ref_psndocwadoc_sub.tableShow = true;
                                }else{
                                    this.$refs.ref_psndocwadoc_sub.tableShow = false;
                                }

                                this.wadocBaseData = data;
                                this.$refs.ref_psndocwadoc_sub.setTableData(
                                    JSON.parse(JSON.stringify(data))
                                );
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                        this.$message({
                            message: '获取数据失败',
                            type: 'error'
                        });
                    });

            },

            // 请求表头数据
            requestPsnData() {

                if (this.pk_psndoc === undefined) {
                    return;
                }
                this.$http({
                    url: "/hrwa/psndocwadoc/getById/" + this.pk_psnjob,
                    method: "get"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            var wapsndata = res.data.data;
//                            this.wadocData.waitemparams.pk_org = wapsndata.pk_org;
//                            this.wadocData.waitemparams.pk_group = wapsndata.pk_group;
                            this.pk_org = wapsndata.pk_org;
                            this.pk_psndoc = wapsndata.pk_psndoc;
                            this.pk_psnjob =  wapsndata.pk_psnjob;
                            this.$refs.ref_psndocwadoc_c.setFormData(JSON.parse(JSON.stringify(wapsndata)));
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                        this.$message({
                            message: "信息详情获取失败",
                            type: "error"
                        });
                    });
            },

            wadocFormEdit(){
                let data = this.$refs.ref_psndocwadoc_sub.getFormData();
                if (data.workflowflag) {
                     this.$alert('审批通过的数据不允许编辑', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }   
                        });
                    this.wadocEdit = false;
                } else {
                    this.wadocEdit = true;
                    this.bodystatus = 1;
                    this.wadocEditIndex = scope.$index;
                    this.$refs.ref_psndocwadoc_sub.setData("waItemDisable",true);
                    this.$refs.ref_psndocwadoc_sub.setData("wagrdparams",{"pk_wa_item":this.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_item,"pk_org":this.pk_org});
                }
            },
            // table行的编辑操作
            wadocEditClick(scope) {
                this.$refs.ref_psndocwadoc_sub.expandRow(scope.row,scope.$index)
                // this.$refs.typicalDemoChildRef.getTableComp().expandRow(scope.row);
                // this.$refs.typicalDemoChildRef.formShow = false;
//                this.childEditable = true;
//                this.$refs.ref_psndocwadoc_sub.getTableComp().expandRow(scope.row);
//                this.tableOperVif = false;
//                this.$refs.ref_psndocwadoc_sub.setFormData(scope.row);
////                this.wadocEdit = true;
                if (scope.row.workflowflag) {
                        this.$alert('审批通过的数据不允许编辑', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }   
                        });
                    this.wadocEdit = false;
                } else {
                    this.wadocEdit = true;
                    this.bodystatus = 1;
                    this.wadocEditIndex = scope.$index;
                    this.$refs.ref_psndocwadoc_sub.setData("waItemDisable",true);
                    this.$refs.ref_psndocwadoc_sub.setData("wagrdparams",{"pk_wa_item":this.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_item,"pk_org":this.pk_org});
                }

            },
            // table行的删除操作
            wadocDeleteClick(scope) {
                if (scope.row.workflowflag) {
                        this.$alert('审批通过的数据不允许删除', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }   
                        });
                   
                } else {
                    this.delDialogVisible = true;
                    this.delData = scope.row;fs.ref_psndocwadoc_sub.setData("wagrdparams",{"pk_wa_item":this.$refs.ref_psndocwadoc_sub.getFormData().pk_wa_item,"pk_org":this.pk_org});
                }
                
            },
            updataEditable(val){
                this.wadocEdit = val;
            },
            rowExpend(row, expanded){
                this.tableOperVif = !expanded
            },
            psnConfirm(){
                this.psnEdit = false;
                //this.showicons = this.addicons;
            },
            // form的保存操作
            wadocFormConfirm() {
                this.$refs.ref_psndocwadoc_sub.validate((valid) => {
                    if (valid) {
                        var data = this.$refs.ref_psndocwadoc_sub.getFormData();
                        data.status = this.bodystatus;
                        data.pk_psndoc = this.pk_psndoc;
                        data.pk_org = this.pk_org;
                        data.pk_psnjob= this.pk_psnjob;
                        this.$http({
                            url: "/hrwa/psndocwadoc/save",
                            method: "post",
                            data: data
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    this.$refs.ref_psndocwadoc_sub.clearEdit();
                                    this.$refs.ref_psndocwadoc_sub.getFormComp().clearErrorMessage();
//                                    if(this.bodystatus==2){
//                                        this.requestSubData();
//                                        this.wadocEdit = false;
//                                    }else{
//                                        let data = res.data.data;
//                                        //this.requestSubData();
//                                        this.wadocEdit = false;
//                                        this.$refs.ref_psndocwadoc_sub.setFormData(data);
//                                    }
                                    //let data = res.data.data;
                                    this.requestSubData();
                                    this.wadocEdit = false;
                                    //this.$refs.ref_psndocwadoc_sub.setFormData(data);
                                    this.$refs.ref_psndocwadoc_sub.formShow = false;

                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    message: "更新失败",
                                    type: "error"
                                });
                            });
                    }
                });

            },
            wadocFormDelete(type,row){
                if (row.workflowflag) {
                        this.$alert('审批通过的数据不允许删除', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }   
                        });
                   
                }else{
                    this.delDialogVisible = true;
                    this.delData = row;
                }
                
            },
            // form的取消操作
            wadocFormCancel(type) {
                //取消
                this.wadocEdit=false;
                if (type === 'form') {
                    this.$refs.ref_psndocwadoc_sub.formShow = false;
                }
            },
            wadocDeleteDialogClick() {
                var data = this.delData;
//                console.log('delete' + JSON.stringify(data));
                this.delDialogVisible = false;

                this.$http({
                    url: "/hrwa/psndocwadoc/delete/",
                    method: "post",
                    data: data
                })
                .then((res) => {
                    if (res.data.status === true) {
                        this.requestSubData ();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
            }
        }
    };
</script>
