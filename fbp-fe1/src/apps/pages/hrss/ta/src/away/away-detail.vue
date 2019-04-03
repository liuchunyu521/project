<!--
  作者：zhanggyg
  时间：2018-08-23
  支持：自助管理——出差申请
-->
<template>
    <ifbp-page>
        <ifbp-breadcrumb name="出差申请"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">

                <ifbp-panel title="" style="height:180px" v-if="isinitiateFlowShow && approveType == 1">
                    <initiateFlow class="fl"
                                  ref="initfolwRef"
                                  billType="6403"
                                  agentuserId=""
                                  :billId="pk_awayh"
                                  :showBtn='!isEdit'
                                  @isRecall="getIsRecall">
                    </initiateFlow>
                </ifbp-panel>

                <!-- 主表编辑页签 -->
                <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
                    <ifbp-template :ref="awayapplyhFormRef"
                                   tplId="awayApplyHead"
                                   :tplData="awayapplyhData"
                                   :editable="isEdit"
                                   :tplResetFun="awayapplyhFormResetFun"
                                   :methods="awayapplyhFormMethods">
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel title="出差信息" :icons="[]">
                    <ifbp-template :ref="awayapplybFormRef"
                                   tplId="awayApplySub"
                                   :tplData="awayapplybData"
                                   :editable="isEdit"
                                   :tplResetFun="awayapplybFormResetFun"
                                   :methods="awayapplybFormMethods">
                    </ifbp-template>
                </ifbp-panel>

                <ifbp-panel title="附件">
                    <ifbp-upload busi-code="transapply"
                                 force-type="normal"
                                 :disableUpdate="!isEdit"
                                 :disableUpload="!isEdit"
                                 :disableDelete="!isEdit"
                                 :pk-busi="pk_awayh">
                    </ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer>
            <el-button @click="editHandle" v-if="!isEdit && !hasSubmited">编辑</el-button>
            <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
            <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
            <el-button type="primary" @click="submitHandle" v-if="!hasSubmited">提交</el-button>
        </ifbp-footer>
    </ifbp-page>
</template>

<script>
import initiateFlow from "ifbp-business/initiateFlow";
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from '../../../../../common/printPre.js'
import { dateAddMonth } from '../../../../../common/js/computeDate'
export default {
    mixins: [pageModelMixin, printPre],
    components: {
        initiateFlow: initiateFlow
    },

    data() {
        var vm = this;
        const awayApplyDetailThis = this;
        return {
            // 功能编码
            funcode: 'funcode=60420awayapply',

            // 权限前缀
            permissionPrefix: '/hrss/ta/AwayApply/',
            requestUrl: {
                initData: 'initData',
                getByPK: 'getByPK',
                save: 'save',
                calculate: 'calculate',
                submit: 'submit',
                checkBillCanEdit: 'checkBillCanEdit'
            },

            awayapplyhData: {
                bill_codeHide: true,
                billmakerHide: true,
                //单据编码
                bill_code_show: false,
                //申请人
                billmaker_show: false,

            },
            awayapplybData: {
                //申请时长
                awayhour_show: true,
                //申请时长 带单位  add by wangruie
                label_title: "申请时长(天)",
                //小数位数  add by wangruie
                timedecimal: 2
            },


            awayapplyhFormResetFun: function ($node) {


                // 出差类型
                $node.find("[v-model='hrtaawayh.pk_awaytypecopy']").attr("v-on:change", "typeChange");

                //单据编码
                var $bill_code = $node.find("[prop='bill_code']");
                $bill_code.attr("v-show", "bill_code_show");
                //申请人
                var $billmaker = $node.find("[prop='billmaker']");
                $billmaker.attr("v-show", "billmaker_show");

            },
            awayapplybFormResetFun: function ($node) {
                //设置时长 带单位  add by wangruie
                var $awayhour = $node.find("[prop='awayhour']");
                $awayhour.attr(":label", "label_title");
                var $awayhour_num = $node.find("[v-model='hrtaawayb.awayhour']");
                $awayhour_num.attr(":decimals", "timedecimal");

                var $awayhour = $node.find("[prop='awayhour']");
                $awayhour.attr("v-show", "awayhour_show");
                //计算时长
                let $form = $node.find('el-form');
                // 出差开始时刻
                $node.find("[v-model='hrtaawayb.awaybegintime']").attr("v-on:change", "timeChange");
                // 出差结束时刻
                $node.find("[v-model='hrtaawayb.awayendtime']").attr("v-on:change", "timeChange");

                return $node[0].outerHTML;
            },
            awayapplybFormMethods: {
                // 出差开始、结束时刻 变化的触发事件
                timeChange: function (value) {
                    vm.calculate();
                },
            },

            awayapplyhFormMethods: {
                // 类型变化的触发事件
                typeChange: function (value) {
                    let options = vm.testOptionsVar;
                    for (let i = 0; i < options.length; i++) {
                        let option = options[i];
                        if (value == option.value) {
                            vm.setpk_awaytypecopy(option)

                            let awayh = vm.$refs[vm.awayapplyhFormRef].getFormData();
                            awayh.pk_timeitemcopy = option.pk_timeitemcopy;
                            vm.$refs[vm.awayapplyhFormRef].setFormData(JSON.parse(JSON.stringify(awayh)));
                            break;
                        }
                    }

                    let awayb = vm.$refs[vm.awayapplybFormRef].getFormData();
                    let awaybegintime = awayb.awaybegintime;
                    let awayendtime = awayb.awayendtime;
                    if (awaybegintime < awayendtime) {
                        vm.calculate();
                    }

                },
            }
            ,

            isEdit: true,
            pk_awayh: this.$root.$router.currentRoute.params.id,
            isinitiateFlowShow: false,
            hasSubmited: false,

            // 该单据是否可以编辑
            canEdit: false,
            // 审批方式，1才需要显示审批流
            approveType: 0,

            // UI模板参数
            awayapplyhFormRef: 'ref_awayapplyh_h',
            awayapplybFormRef: 'ref_awayapplyb_b',
            //单据VO的状态
            status: 2, //1,update;2,new;3,delete
            awayapplyData: {
                awayh: {}
                ,
                awayb: {}
            }
            ,
            awayapplyDataBak: {},
            testOptionsVar: [],
        }
    },

    computed: {},
    created() {
        this.request()
    },
    mounted() {
        // this.request()
    },

    methods: {

        getIsRecall(isrecall) {
            if (isrecall) {
                this.request()
            }
        },


        request() {
            if (this.pk_awayh) {
                this.initData(false);
                this.isEdit = false;
                this.requestBill()
            } else {
                this.initData(true);
            }
        },
        setpk_awaytypecopy(option) {
            // 动态设置单位  add by wangruie
            let unit = option.timeitemunit;
            this.$refs[this.awayapplybFormRef].setData("label_title", "申请时长(天)");
            if (unit == 1) {
                // this.leaveapplybData.label_title = "申请时长(小时)"
                this.$refs[this.awayapplybFormRef].setData("label_title", "申请时长(小时)");
            }

        },

        // 新增单据时，初始化数据
        initData(newBill) {
            this.$http({
                url: this.permissionPrefix + this.requestUrl.initData,
                method: 'post',
                params: { newBill: newBill }
            })
                .then(res => {
                    debugger
                    if (res.data.status === true) {
                        let initData = res.data.data;
                        // 出差类别，不管是新增还是查看详情，都需要
                        /*   this.$refs[this.awayapplyhFormRef].setData('awaytypeOptions', initData.types);
                           this.awaytypeOptions = initData.types;*/

                        // 1.主表
                        let awayh = initData.awayh;
                        this.awayapplyData.awayh.pk_psndoc = awayh.pk_psndoc;
                        // 出差类别
                        this.$refs[this.awayapplyhFormRef].setData('testOptionsVar', awayh.typeCopys);
                        this.testOptionsVar = awayh.typeCopys;
                        this.$refs[this.awayapplybFormRef].setData('timedecimal', awayh.timeRule.timedecimal);
                        // 有主键，说明是新增单据，需要设置一些值
                        if (awayh.pk_awayh) {
                             if (awayh.typeCopys != null && awayh.typeCopys.length > 0) {
                                // 默认选中第一个出差类型  add by wangruie
                                this.setpk_awaytypecopy(awayh.typeCopys[0])
                            }
                            // 主键
                            this.awayapplyData.awayh.pk_awayh = awayh.pk_awayh;
                            this.awayapplyData.awayh.pk_awaytypecopy = awayh.pk_awaytypecopy;
                            this.$refs[this.awayapplyhFormRef].setFormData(JSON.parse(JSON.stringify(this.awayapplyData.awayh)));

                            // 2.子表
                            // 默认的开始/结束时间、出差时长
                            this.awayapplyData.awayb = initData.awayb;
                            this.$refs[this.awayapplybFormRef].setFormData(JSON.parse(JSON.stringify(this.awayapplyData.awayb)));

                            // 新增单据，主表主键是空的，这里设置一下，用于上传附件
                            this.pk_awayh = initData.awayh.pk_awayh;

                        }

                    } else {
                        this.$message({ message: res.data.msg, type: 'error' })
                    }
                })
                .catch(() => {
                    this.$message({ message: '初始化失败', type: 'error' })
                })
        },

        // 获取单据数据
        requestBill() {
            this.$http({

                url: this.permissionPrefix + this.requestUrl.getByPK,
                method: 'post',
                params: { pk_awayh: this.pk_awayh }
            })
                .then(res => {
                    if (res.data.status === true) {
                        let retData = res.data.data;
                        let retAwayh = JSON.parse(JSON.stringify(retData.awayh));
                        let retAwayb = JSON.parse(JSON.stringify(retData.awayb));

                        this.$refs[this.awayapplyhFormRef].setFormData(retAwayh);
                        this.$refs[this.awayapplybFormRef].setFormData(retAwayb);

                        this.pk_awayh = retData.awayh.pk_awayh;

                        this.awayapplyData.awayh = retData.awayh;
                        this.awayapplyData.awayb = retData.awayb;
                        this.status = retData.awayh.status;


                        this.hasSubmited = retAwayh.approve_state && retAwayh.approve_state !== -1;
                        this.approveType = retData.approveType;
                        this.isinitiateFlowShow = this.hasSubmited;
                    } else {
                        this.$message({ message: res.data.msg, type: 'error' });
                    }
                })
                .catch(() => {
                    this.$message({ message: '获取出差申请单失败', type: 'error' });
                })
        },

        // 编辑操作
        editHandle() {            
            this.$http({
                url: this.permissionPrefix + this.requestUrl.checkBillCanEdit + '/' + this.pk_awayh,
                method: 'get'
            })
                .then(res => {

                    if (res.data.status === true) {
                        //单据编码
                        this.$refs[this.awayapplyhFormRef].setData("bill_code_show", true);
                        //申请人
                        this.$refs[this.awayapplyhFormRef].setData("billmaker_show", true);

                        //申请时长
                        this.$refs[this.awayapplyhFormRef].setData("awayhour_show", true);

                        this.canEdit = res.data.data.canEdit;
                        if (this.canEdit) {
                            this.isEdit = true;
                            // 编辑态不允许提交
                            this.hasSubmited = true;
                            this.awayapplyDataBak = JSON.parse(JSON.stringify(this.awayapplyData));
                        } else {
                            this.$message({
                                message: '您没有权限编辑当前数据！',
                                type: 'error'
                            })
                        }
                    } else {
                        this.$message({ message: red.data.msg, type: 'error' });
                    }
                })
                .catch(() => {
                    this.$message({ message: '编辑权限信息获取失败', type: 'error' });
                })
        },

        // 取消操作
        cancelHandle() {
            if (2 == this.status) {
                this.$context.getApp().back(1);
                return;
            }

            this.awayapplyData = this.awayapplyDataBak;
            this.$refs[this.awayapplyhFormRef].setFormData(this.awayapplyData.awayh);
            this.$refs[this.awayapplybFormRef].setFormData(this.awayapplyData.awayb);

            // 执行一次校验，去掉提示
            this.$nextTick(function () {
                this.pageValidate();
            })

            // 提交按钮
            this.hasSubmited = false;
            this.isEdit = false;
        },
        // 计算时长
        calculate() {
            if (this.pageValidate()) {
                this.awayapplyData.awayh = this.$refs[this.awayapplyhFormRef].getFormData();
                this.awayapplyData.awayb = this.$refs[this.awayapplybFormRef].getFormData();

                let data = JSON.parse(JSON.stringify(this.awayapplyData));

                this.$http({
                    url: this.permissionPrefix + this.requestUrl.calculate,
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.status === true) {
                        let retData = res.data.data;
                        let retAwayb = JSON.parse(JSON.stringify(retData.awayb));
                        this.$refs[this.awayapplybFormRef].setFormData(retAwayb);

                        this.awayapplyData.awayb = retData.awayb;

                    } else {
                        this.$message({ message: res.data.msg, type: 'error' });
                    }
                }).catch(() => {
                    this.$message({ message: '加班时长失败！', type: 'error' });
                })
            }
        },
        // 保存操作

        saveHandle() {
            var _this = this;
            if (this.pageValidate()) {
                this.awayapplyData.awayh = this.$refs[this.awayapplyhFormRef].getFormData();
                this.awayapplyData.awayb = this.$refs[this.awayapplybFormRef].getFormData();

                let data = JSON.parse(JSON.stringify(this.awayapplyData));

                this.$http({
                    url: this.permissionPrefix + this.requestUrl.save,
                    method: 'post',
                    data: data
                })
                    .then(res => {
                        if (res.data.status === true) {
                            //单据编码
                            this.$refs[this.awayapplyhFormRef].setData("bill_code_show", true);
                            //申请人
                            this.$refs[this.awayapplyhFormRef].setData("billmaker_show", true);

                            //申请时长
                            this.$refs[this.awayapplybFormRef].setData("awayhour_show", true);

                            this.$message({ message: res.data.msg, type: 'success' });
                            this.isEdit = false;

                            // 直接把后台返回的数据展示出来
                            let retData = res.data.data;
                            let retAwayh = JSON.parse(JSON.stringify(retData.awayh));
                            let retAwayb = JSON.parse(JSON.stringify(retData.awayb));

                            this.$refs[this.awayapplyhFormRef].setFormData(retAwayh);
                            this.$refs[this.awayapplybFormRef].setFormData(retAwayb);

                            this.awayapplyData.awayh = retData.awayh;
                            this.awayapplyData.awayb = retData.awayb;

                            this.canEdit = true;

                            // 能保存，说明没提交
                            this.hasSubmited = false;


                        } else {
                            this.$message({ message: res.data.msg, type: 'error' });
                        }
                    })
                    .catch(() => {
                        this.$message({ message: '保存失败', type: 'error' });
                    })
            }
        },

        submitHandle() {
            if (this.pageValidate()) {
                this.awayapplyData.awayh = this.$refs[this.awayapplyhFormRef].getFormData();
                this.awayapplyData.awayb = this.$refs[this.awayapplybFormRef].getFormData();

                let data = JSON.parse(JSON.stringify(this.awayapplyData));

                this.$http({

                    url: this.permissionPrefix + this.requestUrl.submit,
                    method: 'post',
                    data: data

                })
                    .then(res => {

                        if (res.data.status === true) {
                            if (res.data.execMsg) {
                                this.$message({ message: res.data.execMsg, type: 'warning' })
                            } else {
                                this.$message({ message: res.data.msg, type: 'success' })
                            }
                            this.isEdit = false;
                            this.requestBill();
                        } else {
                            this.$message({ message: res.data.msg, type: 'error' })
                        }
                    })
                    .catch(() => {
                        this.$message({ message: '提交失败', type: 'error' })
                    })
            }
        },

        /*printTemplate: function () {
         let param = {
         billid: this.pk_awayh
         }
         this.printPre('60090transapply', 'transapply-print-template', param)
         },
         */
        // 上方模板和自定义的校验
        pageValidate: function () {
            let flag1 = false;
            let flag2 = false;
            this.$refs[this.awayapplyhFormRef].validate(valid => {
                if (valid) {
                    flag1 = true;
                }
            })
            this.$refs[this.awayapplybFormRef].getFormComp().validate(valid => {
                if (valid) {
                    flag2 = true;
                }
            })
            return flag1 && flag2;
        }
    }
}
</script>
