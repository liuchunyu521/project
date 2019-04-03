<!--
  作者：zhanggyg
  时间：2018-08-23
  支持：自助管理——请假申请
-->
<template>
    <ifbp-page>
        <ifbp-breadcrumb name="请假申请" v-show="false"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">

                <ifbp-panel title="" style="height:180px" v-if="isinitiateFlowShow && approveType == 1">
                    <initiateFlow class="fl"
                                  ref="initfolwRef"
                                  billType="6404"
                                  agentuserId=""
                                  :billId="pk_leaveh"
                                  :showBtn='!isEdit'
                                  @isRecall="getIsRecall">
                    </initiateFlow>
                </ifbp-panel>

                <!-- 主表编辑页签 -->
                <ifbp-panel title="基本信息" :icons="[]" class="titleLine">
                    <ifbp-template :ref="leaveapplyhFormRef"
                                   tplId="leaveApplyHead"
                                   :tplData="leaveapplyhData"
                                   :editable="isEdit"
                                   :tplResetFun="leaveapplyhFormResetFun"
                                   :methods="leaveapplyhFormMethods">
                    </ifbp-template>
                </ifbp-panel>
                <ifbp-panel title="请假信息" :icons="[]">
                    <ifbp-template :ref="leaveapplybFormRef"
                                   tplId="leaveApplySub"
                                   :tplData="leaveapplybData"
                                   :editable="isEdit"
                                   :tplResetFun="leaveapplybFormResetFun"
                                   :methods="leaveapplybFormMethods">


                    </ifbp-template>
                </ifbp-panel>

                <ifbp-panel title="附件">
                    <ifbp-upload busi-code="transapply"
                                 force-type="normal"
                                 :disableUpdate="isEdit"
                                 :disableUpload="isEdit"
                                 :disableDelete="isEdit"
                                 :pk-busi="pk_leaveh">
                    </ifbp-upload>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer>
            <el-button @click="cancelHandle" v-if="isEdit">取消</el-button>
            <el-button @click="editHandle" v-if="!isEdit && !hasSubmited">编辑</el-button>
            <!-- <el-button type="primary" @click="printTemplate" v-if="!isEdit">打印</el-button> -->
            <el-button type="primary" @click="saveHandle" v-if="isEdit">保存</el-button>
            <el-button type="primary" @click="submitHandle" v-if="!hasSubmited">提交</el-button>
        </ifbp-footer>
    </ifbp-page>
</template>

<script>
import initiateFlow from "ifbp-business/initiateFlow";
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from "../../../../../common/printPre.js";
import { dateAddMonth } from "../../../../../common/js/computeDate";
export default {
    mixins: [pageModelMixin, printPre],
    components: {
        initiateFlow: initiateFlow
    },

    data() {
        var vm = this;
        const otApplyDetailThis = this;
        return {
            // 功能编码
            funcode: "funcode=60170leaveapply",
            // 权限前缀
            permissionPrefix: '/hrss/ta/LeaveApply/',
            requestUrl: {
                initData: 'initData',
                getByPK: 'getByPK',
                save: 'save',
                submit: 'submit',
                calculate: 'calculate',
                checkBillCanEdit: 'checkBillCanEdit'
            },

            leaveapplyhData: {
                timehour: 0,
                leaveyear: "",
                bill_codeHide: true,
                billmakerHide: true,

                //剩余 初始
                restdayorhour_show: false,
                //单据编码
                bill_code_show: false,
                //申请人
                billmaker_show: false,
                //单日哺乳时长
                lactationhour_show: false,

            },

            //子表
            leaveapplybData: {
                //开始时间
                leavebegintime_show: true,
                //结束时间
                leaveendtime_show: true,
                //开始日期
                leavebegindate_show: false,
                //结束日期
                leaveenddate_show: false,
                //哺乳时段
                lactationholidaytype_show: false,
                //休假时长
                leavehour_show: true,
                //申请时长 带单位  add by wangruie
                label_title: "申请时长(天)",
                //小数位数  add by wangruie
                timedecimal: 2,

            },

            leaveapplyhFormResetFun: function ($node) {
                debugger
                //剩余
                var $restdayorhour = $node.find("[prop='restdayorhour']");
                $restdayorhour.attr("v-show", "restdayorhour_show");

                $restdayorhour.attr('render-type', 'default');

                // var timehour = parseInt(this.timehour); {{}}
                $restdayorhour.html(
                    '<span _id="8t59ejx0x0l">' +
                    '<span style="color:#00A753" _id="5rjuwequtr4">{{parseInt(timehour)}}</span>' +
                    '天</span>'
                )


                //休假类型  单选
                var $leavetypecopy = $node.find("[v-model='hrtaleave.pk_leavetypecopy']");

                $leavetypecopy.attr('v-on:change', 'onChangeleavetypecopy');

                //单据编码
                var $bill_code = $node.find("[prop='bill_code']");
                $bill_code.attr("v-show", "bill_code_show");
                //申请人
                var $billmaker = $node.find("[prop='billmaker']");
                $billmaker.attr("v-show", "billmaker_show");
                //单日哺乳时长
                var $lactationhour = $node.find("[prop='lactationhour']");
                $lactationhour.attr("v-if", "lactationhour_show");


            },

            leaveapplyhFormMethods: {
                onChangeleavetypecopy(val) {
                    for (var i = 0; i < this.leavetypeOptionsVar.length; i++) {
                        if (this.leavetypeOptionsVar[i].value == val) {
                            var lab = this.leavetypeOptionsVar[i].label;
                            // vm.setpk_leavetypecopy(this.leavetypeOptionsVar[i]);
                            // 设置选中的休假类型
                            vm.leavetypecopypk = this.leavetypeOptionsVar[i].value;
                            vm.initData();
                            break;
                        }
                    }
                    // vm.setpk_leavetypecopy(lab);
                    //计算时长
                    let leaveb = vm.$refs[vm.leaveapplybFormRef].getFormData();
                    let leavebegintime = leaveb.leavebegintime;
                    let leaveendtime = leaveb.leaveendtime;
                    if (leavebegintime < leaveendtime) {
                        vm.calculate();
                    }

                },
            },


            leaveapplybFormResetFun: function ($node) {

                //设置时长 带单位  add by wangruie
                var $leavehour = $node.find("[v-model='leavehour']");
                $leavehour.attr(":label", "label_title");
                var $leavehour_num = $node.find("[v-model='hrtaleaveb.leavehour']");
                $leavehour_num.attr(":decimals", "timedecimal");

                //哺乳时段  lactationholidaytype
                var $lactationholidaytype = $node.find("[prop='lactationholidaytype']");
                $lactationholidaytype.attr("v-if", "lactationholidaytype_show");

                //休假时长  leavehour
                var $leavehour = $node.find("[prop='leavehour']");
                $leavehour.attr("v-show", "leavehour_show");
                //开始时间
                var $leavebegintime = $node.find("[prop='leavebegintime']");
                $leavebegintime.attr("v-show", "leavebegintime_show");
                //结束时间
                var $leaveendtime = $node.find("[prop='leaveendtime']");
                $leaveendtime.attr("v-show", "leaveendtime_show");
                //开始日期
                var $leavebegindate = $node.find("[prop='leavebegindate']");
                $leavebegindate.attr("v-show", "leavebegindate_show");
                //结束日期
                var $leaveenddate = $node.find("[prop='leaveenddate']");
                $leaveenddate.attr("v-show", "leaveenddate_show");
                //计算时长
                let $form = $node.find('el-form');
                // 加班开始时刻
                $node.find("[v-model='hrtaleaveb.leavebegintime']").attr("v-on:change", "timeChange");
                // 加班结束时刻
                $node.find("[v-model='hrtaleaveb.leaveendtime']").attr("v-on:change", "timeChange");

                return $node[0].outerHTML;
            },

            leaveapplybFormMethods: {

                // 加班开始、结束时刻 变化的触发事件
                timeChange: function (value) {

                    vm.calculate();
                },
            },


            isEdit: true,
            pk_leaveh: this.$root.$router.currentRoute.params.id,
            isinitiateFlowShow: false,
            hasSubmited: false,


            // 该单据是否可以编辑
            canEdit: false,
            // 审批方式，1才需要显示审批流
            approveType: 0,

            // UI模板参数
            leaveapplyhFormRef: 'ref_leaveapplyh_h',
            leaveapplybFormRef: 'ref_leaveapplyb_b',

            // 休假类别
            leavetypeOptionsVar: [],
            //单据VO的状态
            status: 2,
            //1,update;2,new;3,delete
            leaveapplyData: {
                leaveh: {}
                ,
                leaveb: {}
            }
            ,
            leaveapplyDataBak: {},
            leavetypecopypk: ""
        }
    },

    computed: {},

    created() {
        this.request()
    },

    methods: {

        getIsRecall(isrecall) {
            if (isrecall) {
                this.request()
            }

        },
        //设置请假change
        setpk_leavetypecopy(labitem) {
            // 动态设置单位  add by wangruie
            let unit = labitem.timeitemunit;
            this.$refs[this.leaveapplybFormRef].setData("label_title", "申请时长(天)");
            if (unit == 1) {
                // this.leaveapplybData.label_title = "申请时长(小时)"
                this.$refs[this.leaveapplybFormRef].setData("label_title", "申请时长(小时)");
            }

            let lab = labitem.label;
            //类型：年假
            if (lab == '年假') {
                //剩余

                this.$refs[this.leaveapplyhFormRef].setData("restdayorhour_show", true);


            } else {
                this.$refs[this.leaveapplyhFormRef].setData("restdayorhour_show", false);

            }
            //类型哺乳假
            if (lab == '哺乳假') {
                //单日哺乳时长
                this.$refs[this.leaveapplyhFormRef].setData("lactationhour_show", true);
                //哺乳时段
                this.$refs[this.leaveapplybFormRef].setData("lactationholidaytype_show", true);
                //开始时间
                this.$refs[this.leaveapplybFormRef].setData("leavebegintime_show", false);

                //结束时间
                this.$refs[this.leaveapplybFormRef].setData("leaveendtime_show", false);

                //开始日期
                this.$refs[this.leaveapplybFormRef].setData("leavebegindate_show", true);
                //结束日期
                this.$refs[this.leaveapplybFormRef].setData("leaveenddate_show", true);
                //休假时长
                this.$refs[this.leaveapplybFormRef].setData("leavehour_show", false);
            } else {
                //单日哺乳时长
                this.$refs[this.leaveapplyhFormRef].setData("lactationhour_show", false);
                //哺乳时段
                this.$refs[this.leaveapplybFormRef].setData("lactationholidaytype_show", false);
                //开始时间
                this.$refs[this.leaveapplybFormRef].setData("leavebegintime_show", true);
                //结束时间
                this.$refs[this.leaveapplybFormRef].setData("leaveendtime_show", true);
                //开始日期
                this.$refs[this.leaveapplybFormRef].setData("leavebegindate_show", false);
                //结束日期
                this.$refs[this.leaveapplybFormRef].setData("leaveenddate_show", false);
                //休假时长
                this.$refs[this.leaveapplybFormRef].setData("leavehour_show", true);

            }

        },


        request() {

            if (this.pk_leaveh) {
                this.requestBill()
                this.isEdit = false;
            } else {
                this.initData();
            }
        },

        // 新增单据时，初始化数据
        initData() {
            this.$http({
                url: this.permissionPrefix + this.requestUrl.initData,
                method: 'post',
                params: { leavetypecopypk: this.leavetypecopypk }
            })
                .then(res => {
                    debugger
                    if (res.data.status === true) {
                        let initData = res.data.data;
                        // 1.主表
                        let leaveh = initData.leaveh;

                        // 请假类别
                        this.$refs[this.leaveapplyhFormRef].setData('leavetypeOptionsVar', initData.typeCopys);
                        if (initData.typeCopys != null && initData.typeCopys.length > 0) {
                            // 默认选中第一个请假类型  add by wangruie
                            this.setpk_leavetypecopy(initData.selleavetypecopy)
                        }
                        this.$refs[this.leaveapplyhFormRef].setData('timehour', leaveh.restdayorhour == null ? 0 : leaveh.restdayorhour);
                        this.$refs[this.leaveapplybFormRef].setData('timedecimal', initData.timeRule.timedecimal);
                        // 有主键，说明是新增单据，需要设置一些值
                        if (this.pk_leaveh == undefined || this.pk_leaveh == null) {
                            this.leaveapplyData.leaveh.pk_psndoc = leaveh.pk_psndoc;

                            //默认类型
                            let leavetype = leaveh.pk_leavetypecopy;
                            //剩余
                            this.$refs[this.leaveapplyhFormRef].setData('usefuldayorhour', leaveh.usefuldayorhour);
                            this.$refs[this.leaveapplyhFormRef].setData('resteddayorhour', leaveh.resteddayorhour);
                            this.$refs[this.leaveapplyhFormRef].setData('realdayorhour', leaveh.realdayorhour);
                            this.$refs[this.leaveapplyhFormRef].setData('restdayorhour', leaveh.restdayorhour);
                            this.$refs[this.leaveapplyhFormRef].setData('freezedayorhour', leaveh.freezedayorhour);

                            // 主键
                            this.leaveapplyData.leaveh.leaveyear = leaveh.leaveyear;

                            this.leaveapplyData.leaveh.pk_leavetypecopy = leaveh.pk_leavetypecopy;
                            //剩余时长 （可用）
                            this.leaveapplyData.leaveh.usefuldayorhour = leaveh.usefuldayorhour;
                            this.leaveapplyData.leaveh.resteddayorhour = leaveh.resteddayorhour;
                            this.leaveapplyData.leaveh.realdayorhour = leaveh.realdayorhour;
                            this.leaveapplyData.leaveh.restdayorhour = leaveh.restdayorhour;
                            this.leaveapplyData.leaveh.freezedayorhour = leaveh.freezedayorhour;


                            this.$refs[this.leaveapplyhFormRef].setFormData(JSON.parse(JSON.stringify(this.leaveapplyData.leaveh)));

                            // 2.子表
                            // 默认的开始/结束时间、请假时长
                            this.leaveapplyData.leaveb = initData.leaveb;
                            this.$refs[this.leaveapplybFormRef].setFormData(JSON.parse(JSON.stringify(this.leaveapplyData.leaveb)));

                            // 新增单据，主表主键是空的，这里设置一下，用于上传附件
                            // this.pk_leaveh = initData.leaveh.pk_leaveh;

                            //计算时长  add by wangruie
                            let leaveb = this.$refs[this.leaveapplybFormRef].getFormData();
                            if (leaveb != null) {
                                let leavebegintime = leaveb.leavebegintime;
                                let leaveendtime = leaveb.leaveendtime;
                                if (leavebegintime < leaveendtime) {
                                    this.calculate();
                                }
                            }
                        }

                    } else {
                        this.$message({ message: res.data.msg, type: 'error' })
                    }
                })
                .catch((e) => {
                    this.$message({ message: '初始化失败', type: 'error' })
                })
        },

        // 获取单据数据
        requestBill() {
            debugger
            this.$http({

                url: this.permissionPrefix + this.requestUrl.getByPK,
                method: 'post',
                params: { pk_leaveh: this.pk_leaveh }
            })
                .then(res => {
                    debugger
                    if (res.data.status === true) {
                        let retData = res.data.data;
                        let retLeaveh = JSON.parse(JSON.stringify(retData.leaveh));
                        let retLeaveb = JSON.parse(JSON.stringify(retData.leaveb));

                        this.$refs[this.leaveapplyhFormRef].setFormData(retLeaveh);
                        this.$refs[this.leaveapplybFormRef].setFormData(retLeaveb);

                        this.leaveapplyData.leaveh = retData.leaveh;
                        this.leaveapplyData.leaveb = retData.leaveb;

                        this.pk_leaveh = retData.leaveh.pk_leaveh;
                        this.leavetypecopypk = retData.leaveh.pk_leavetypecopy
                        this.hasSubmited = retLeaveh.approve_state && retLeaveh.approve_state !== -1;
                        this.approveType = retData.approveType;
                        this.isinitiateFlowShow = this.hasSubmited;
                        this.initData();
                    } else {
                        this.$message({ message: res.data.msg, type: 'error' });
                    }
                })
                .catch(() => {
                    this.$message({ message: '获取请假申请单失败', type: 'error' });
                })
        },
        // 计算时长
        calculate() {
            if (true) {
                this.leaveapplyData.leaveh = this.$refs[this.leaveapplyhFormRef].getFormData();
                this.leaveapplyData.leaveb = this.$refs[this.leaveapplybFormRef].getFormData();

                let data = JSON.parse(JSON.stringify(this.leaveapplyData));

                this.$http({
                    url: this.permissionPrefix + this.requestUrl.calculate,
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.status === true) {
                        let retData = res.data.data;
                        let retLeaveb = JSON.parse(JSON.stringify(retData.leaveb));
                        this.$refs[this.leaveapplybFormRef].setFormData(retLeaveb);

                        this.leaveapplyData.leaveb = retData.leaveb;

                    } else {
                        this.$message({ message: res.data.msg, type: 'error' });
                    }
                }).catch(() => {
                    this.$message({ message: '加班时长失败！', type: 'error' });
                })
            }
        },
        // 编辑操作
        editHandle() {
            this.$http({
                url: this.permissionPrefix + this.requestUrl.checkBillCanEdit + '/' + this.pk_leaveh,
                method: 'get'
            })
                .then(res => {
                    if (res.data.status === true) {
                        //单据编码
                        this.$refs[this.leaveapplyhFormRef].setData("bill_code_show", true);
                        //申请人
                        this.$refs[this.leaveapplyhFormRef].setData("billmaker_show", true);
                        //申请时长
                        this.$refs[this.leaveapplybFormRef].setData("leavehour_show", true);

                        this.canEdit = res.data.data.canEdit;
                        if (this.canEdit) {
                            this.isEdit = true;
                            // 编辑态不允许提交
                            this.hasSubmited = true;
                            this.leaveapplyDataBak = JSON.parse(JSON.stringify(this.leaveapplyData));
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

            this.leaveapplyData = this.leaveapplyDataBak;
            this.$refs[this.leaveapplyhFormRef].setFormData(this.leaveapplyData.leaveh);
            this.$refs[this.leaveapplybFormRef].setFormData(this.leaveapplyData.leaveb);

            // 执行一次校验，去掉提示
            this.$nextTick(function () {
                this.pageValidate();
            })

            // 提交按钮
            this.hasSubmited = false;
            this.isEdit = false;
        },

        // 保存操作
        saveHandle() {
            var _this = this;
            if (this.pageValidate()) {
                this.leaveapplyData.leaveh = this.$refs[this.leaveapplyhFormRef].getFormData();
                this.leaveapplyData.leaveb = this.$refs[this.leaveapplybFormRef].getFormData();

                let data = JSON.parse(JSON.stringify(this.leaveapplyData));

                this.$http({
                    url: this.permissionPrefix + this.requestUrl.save,
                    method: 'post',
                    data: data
                })
                    .then(res => {
                        if (res.data.status === true) {
                            //单据编码
                            this.$refs[this.leaveapplyhFormRef].setData("bill_code_show", true);
                            //申请人
                            this.$refs[this.leaveapplyhFormRef].setData("billmaker_show", true);
                            //申请时长
                            this.$refs[this.leaveapplybFormRef].setData("leavehour_show", true);

                            this.$message({ message: res.data.msg, type: 'success' });
                            this.isEdit = false;

                            // 直接把后台返回的数据展示出来
                            let retData = res.data.data;
                            let retLeaveh = JSON.parse(JSON.stringify(retData.leaveh));
                            let retLeaveb = JSON.parse(JSON.stringify(retData.leaveb));

                            this.$refs[this.leaveapplyhFormRef].setFormData(retLeaveh);
                            this.$refs[this.leaveapplybFormRef].setFormData(retLeaveb);

                            this.leaveapplyData.leaveh = retData.leaveh;
                            this.leaveapplyData.leaveb = retData.leaveb;
                            this.pk_leaveh = retData.leaveh.pk_leaveh;
                            this.canEdit = true;
                            this.bill_code_show = false,

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
                this.leaveapplyData.leaveh = this.$refs[this.leaveapplyhFormRef].getFormData();
                this.leaveapplyData.leaveb = this.$refs[this.leaveapplybFormRef].getFormData();


                let data = JSON.parse(JSON.stringify(this.leaveapplyData));
                this.$http({
                    url: this.permissionPrefix + this.requestUrl.submit,
                    method: 'post',
                    data: data,
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

        /*  printTemplate: function () {
         let param = {
         billid: this.pk_leaveh
         }
         this.printPre('60090transapply', 'transapply-print-template', param)
         },*/

        // 上方模板和自定义的校验
        pageValidate: function () {
            let flag1 = false;
            let flag2 = false;
            this.$refs[this.leaveapplyhFormRef].validate(valid => {
                if (valid) {
                    flag1 = true;
                }
            })
            this.$refs[this.leaveapplybFormRef].getFormComp().validate(valid => {
                if (valid) {
                    flag2 = true;
                }
            })
            return flag1 && flag2;
        }
    }
}
</script>
