<template>

    <ifbp-page>

            <!--节点title-->
            <ifbp-breadcrumb name="新增薪资项目"></ifbp-breadcrumb>
            <!-- 按钮区域 -->
            <ifbp-footer>
                <el-button type="default" @click="waItemCancel" v-if="itemEdit">取消</el-button>
                <el-button type="primary" @click="waItemConfirm" v-if="itemEdit">保存</el-button>
            </ifbp-footer>
            <!-- 主体区域 -->

            <ifbp-main-area type="detail">
                <ifbp-panel-group :navbar="false">
                    <!-- 主表编辑页签 -->
                    <ifbp-panel id="waItemPanel" title="基本信息">
                        <ifbp-template ref="ref_classitem_c"
                                       tplId="ref_classitem_c"

                                       :tplData="waItemData"
                                       :methods="formMethods"
                                       :tpl-reset-fun="classitemFormResetFun"
                                       :editable="itemEdit">
                        </ifbp-template>
                    </ifbp-panel>
                    <!-- 子区域 -->
                    <ifbp-panel id="dataSourcePanel" title="项目数据来源" :icons="[]">

                        <el-form label-width="150px" :adaptation="true" :inline="true">
                            <el-form-item label="数据来源" :required="true" style="margin-right: 10px">
                                <!--<label class="el-form-item__label data-source-lbl" for="dataSource">数据来源</label>-->
                                <el-select v-model="dataSource" placeholder="请选择" id="dataSource" :disabled="dataSourceDisabled"
                                           style="margin-right: 12px;" :editable="itemEdit">
                                    <el-option
                                            v-for="item in dataSourceOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :required="true" v-if="dataSource==0">
                                <!-- 由公式计算 -->
                                <el-ref :editable="itemEdit" v-model="dataSourceTmeplate[0].formula"
                                        field="formula"
                                        :template-value="dataSourceTmeplate[0]"
                                        :disabled="dataSourceDisabled" style="width:400px;display:inline-block;"
                                        dialog-title="公式编辑器" :dialog-show-close="true" custom-dialog="hrwa-fomula-dialog" refCode="HR001_0xx"
                                        v-on:trigger="fomulaRefTriggerHandle"
                                        custom-dialog-size="full" width="1000px" :query-params="queryParams"
                                >
                                </el-ref>
                            </el-form-item>
                            <el-form-item :required="true" v-if="dataSource==1">
                                <el-ref _id="dataSourceWageform" :editable="itemEdit" v-model="dataSourceTmeplate[1].formula"
                                        field="formula"
                                        :template-value="dataSourceTmeplate[1]" pk="83c6544f-a285-455a-84d6-4b580854159a"
                                        v-on:trigger="wageformRefTriggerHandle" :query-params="queryParams"
                                        ref-code="wageform" :disabled="dataSourceDisabled"
                                        style="width:250px;display:inline-block;">
                                </el-ref>
                            </el-form-item>
                            <el-form-item :required="true" v-if="dataSource==3">
                                <!-- 固定值 -->
                                <el-number :maxlength="dataSourceTmeplate[3].maxlength"
                                           separator="," :editable="itemEdit"

                                           v-model="dataSourceTmeplate[3].text"
                                           :decimals="dataSourceTmeplate[3].decimals"
                                           style="width:250px;display:inline-block;" :disabled="dataSourceDisabled"
                                ></el-number>
                            </el-form-item>
                            <el-form-item :required="true" v-if="dataSource==4">
                                <el-ref _id="dataSourceWagrade" :editable="itemEdit" v-model="dataSourceTmeplate[4].formula"
                                        field="formula"
                                        :template-value="dataSourceTmeplate[4]" pk="92054d71-866d-4d82-9085-75ad2f63d4c1"
                                        v-on:trigger="wagradeRefTriggerHandle" :query-params="queryParams"
                                        ref-code="wagrade" :disabled="dataSourceDisabled" style="width:250px;display:inline-block;">
                                </el-ref>
                            </el-form-item>
                        </el-form>
                    </ifbp-panel>
                </ifbp-panel-group>
            </ifbp-main-area>


    </ifbp-page>

</template>

<script>
    //中央事件总线
    let bus = new Vue();
    import fomula from '../fomuladialog/hrwa-fomula-dialog.vue';
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins:[pageModelMixin],
        data() {
            Vue.component('hrwa-fomula-dialog', fomula);
            var vm = this;
            var params = this.$root.$router.currentRoute.params;
            params.waclass = {};
            params.waclass.pk_wa_item = params.pk_wa_class;
            params.waclass.pk_org = params.pk_org;
            params.waclass.cyear = params.cyear;
            params.waclass.cperiod = params.cperiod;
            return {
                editvif: this.$root.$router.currentRoute.params.opercolif === 'true',
                // 通过传入的参数判断是新增还是修改操作
                pk_waitem: this.$root.$router.currentRoute.params.pk_waitem,
                // UI模板所需参数
                templatePK: "0001AA1000000000TATK",
                waItemData: {
                    //模板数据对象


                    waitem: {},
                    params: "",
                    params1: "",
                    isinhi:"",
                    taxflag:"",
                    clearflag:"",
                    cross_org_trans:"",
                    isinhi_show: true,
                    taxflag_show: true,
                    iflddecimal_show: true,
                 /*   // 数据长度只读
                    ifldwidth_disabled: false,
                    //增减属性
                    iproperty_disabled: false,
                    //数值类型
                    iitemtype_disabled: false,*/

                    rules: {}
                },

                //模板控件里的method内容
                formMethods: {

                    onChangeItemtype(val){

                        vm.setItemDataSource(val);
                    },

                    decimalTriggerHandle(newVal){
                        bus.$emit("decimalChange", newVal);
                    },
                    transferTriggerHandle: function (type, data) {
                        let editData = this.$refs.ref_classitem_c.model;
                        if (data.value == null || data.value == undefined || data.value.length == 0) {

                            editData.istransfer = false;
                            editData.destitempk = "";
                            editData.destitemcol = "";
                        } else {

                            editData.istransfer = true;
                            editData.destitempk = data.value[0].id;
                            editData.destitemcol = data.value[0].itemkey;
                        }
                    }
                },
                dataSourceDisabled: false,
                //模板控件的个性化设置
                classitemFormResetFun: function ($node) {
                    //显示项目绑定只读属性

                    //发放项目名称
                    let $name = $node.find("[prop='name']");
                    if ($name.length == 1) {
                        $name.children().first().attr(':disabled', 'waitem.name_disabled');
                    }
                    //项目分类
                    let $category_id = $node.find("[prop='category_id']");
                    if ($category_id.length == 1) {
                        $category_id.children().first().attr(':disabled', 'waitem.np_id_disabled');
                    }
                    //小数位数
                    var $iflddecimal = $node.find("[prop='iflddecimal']");
                    if ($iflddecimal.length == 1) {
                        $iflddecimal.attr("v-show", "iflddecimal_show");
                        var $iflddecimalCtr = $iflddecimal.children().first();
                        $iflddecimalCtr.attr(':disabled', 'waitem.iflddecimal_disabled');

                    }
                    //数值类型
                    var $iitemtype = $node.find("[v-model='waitem.iitemtype']");
                    $iitemtype.attr('v-on:change', 'onChangeItemtype');
                    $iitemtype.attr(':disabled', 'waitem.iitemtype_disabled');
                    //纳入薪酬
                    var $isinhi = $node.find("[prop='isinhi']");
                    if ($isinhi.length == 1) {
                        $isinhi.attr("v-show", "isinhi_show");
                        $isinhi.children().first().attr(':disabled', 'waitem.isinhi_disabled');
                    }

                    //扣税
                    var $taxflag = $node.find("[prop='taxflag']");

                    $taxflag.attr("v-show", "taxflag_show");
                    $taxflag.children().first().attr(':disabled', 'waitem.taxflag_disabled');

                    //下月清零
                    var $clearflag = $node.find("[prop='clearflag']");
                    $clearflag.children().first().attr(':disabled', 'waitem.clearflag_disabled');


                    //增减属性
                    var $iproperty = $node.find("[prop='iproperty']");
                    $iproperty.children().first().attr(':disabled', 'waitem.iproperty_disabled');

                    //数据长度
                    var $ifldwidth = $node.find("[prop='ifldwidth']");
                    $ifldwidth.children().first().attr(':disabled', 'ifldwidth_disabled');

                    //跨组织结转
                    var $cross_org_trans = $node.find("[prop='cross_org_trans']");
                    $cross_org_trans.children().first().attr(':disabled', 'cross_org_trans_disabled');


                    return $node[0].outerHTML;
                },

                // 基本信息是否为修改态
                itemEdit: true,
                dataSourceDisabled: false,
                dataSourceOptions: [
                    {value: 0, label: '由公式计算'},
                    {value: 1, label: '按薪资规则表'},
                    {value: 2, label: '手工输入'},
                    {value: 3, label: '固定值'},
                    {value: 4, label: '薪资标准表'},
                ],
                dataSource: 2,
                dataSourceTmeplate: [
                    {formula: ''},//由公式计算
                    {formula: ''},//按薪资规则表
                    ,//手工输入
                    {
                        maxlength: 15,
                        decimals: 2,
                        text: 0.00,
                    },//固定值
                    {formula: ''},//按薪资标准表
                    //其他系统(不使用)
                    {formula: ''},//薪资
                    {formula: ''},//人事系统
                ],
                //模板绑定的原始数据
                baseData: {},
                //模板以外的字段绑定的原始数据
                otherBaseData: {
                    datasourceitem1: '',//数据源1对应的参照值
                    datasourceitem4: '',//数据源4对应的参照值
                },

                queryParams: {
                    itemkey: '',
                    context: params.waitem,
                    from: 3,
                    pk_org: '',
                },
            };
        },

        mounted() {
            let myself = this;
            //中央总线事件绑定,小数位数变更
            bus.$on('decimalChange', function (newVal) {
                if (newVal == null || newVal == "") {
                    myself.dataSourceTmeplate[3].decimals = 0;
                } else {
                    myself.dataSourceTmeplate[3].decimals = newVal;
                }
            });
            this.request();
        },
        created(){
        },

        methods: {
            // 获取数据
            request() {
                //设置集团pk
                this.queryParams.pk_org = this.$context.getFbpGroupPk();
                this.requestBaseBaseInfo();

            },

            // 请求客户基本信息详情

            requestBaseBaseInfo() {
                this.pk_waitem = this.$root.$router.currentRoute.params.id;
                // alert("this.pk_waitem="+this.pk_waitem);
                if (!this.pk_waitem) return;
                this.$http({
                    url: "/hrwa/waItem/queryWaItemById",
                    method: "post",
                    data: {pk_wa_item: this.pk_waitem}

                })
                    .then(res => {
                        if (res.data.status === true) {
                            var originalValue = res.data.data;
                            //设置字段状态
                            this.setDataControl(originalValue, res.data.isGroupItem);
                            //数据备份
                            this.baseData = JSON.parse(JSON.stringify(originalValue));
                            this.otherBaseData.isGroupItem = res.data.isGroupItem;
                            this.otherBaseData.datasourceitem1 = res.data.datasourceitem1;
                            this.otherBaseData.datasourceitem4 = res.data.datasourceitem4;
                            //this.otherBaseData.destItemName = res.data.destItemName;

                            this.queryParams.pk_org = this.baseData.pk_org;
                            //设置模板绑定的数据
                            this.$refs.ref_classitem_c.setData(
                                "waitem",
                                JSON.parse(JSON.stringify(originalValue))
                            );

                            //设置数据来源控件绑定的数据
                            this.setItemDataSource(originalValue.iitemtype);

                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "详情获取失败!",
                            type: "error"
                        });
                    });
            },

            hiRefTriggerHandle: function (type, data) {
                this.fomulaRefTriggerHandle(type, data);
            },

            fomulaRefTriggerHandle: function (type, data) {
                let currdata = this.$refs.ref_classitem_c.getData("waitem");
                currdata.vformula = data.value[0].code;
                currdata.vformulastr = data.value[0].name;
                this.$refs.ref_classitem_c.setData("waitem", currdata);
            },
            wageformRefTriggerHandle: function (type, data) {
                this.setScriptLang(data.value[0].id, data.value[0].name);

            },

            wagradeRefTriggerHandle: function (type, data) {
                this.setScriptLang(data.value[0].id, data.value[0].refname);
            },
            setScriptLang(pk, name){
                let _this = this;
                let svr = this.$http({
                    url: "/hrwa/waItem/getScriptLang2",
                    method: "post",
                    data: {ifromflag: this.dataSource, pk: pk, name: name}
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        let currdata = this.$refs.ref_classitem_c.getData("waitem");
                        currdata.vformula = res.data.data.scirptLang;
                        currdata.vformulastr = res.data.data.businessLang;
                        this.$refs.ref_classitem_c.setData("waitem", currdata);
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(e => {
                    this.$message({
                        message: "详情获取失败",
                        type: "error"
                    });
                });
            },

            setTransferBind(){
                let transfer = {};
                if (!this.baseData.istransfer) {
                    transfer.pk = "";
                    transfer.pk_show = this.baseData.transferpk_show;
                    transfer.beanmap = {pk_ref: {}};
                } else {
                    transfer.pk = this.baseData.destitempk;
                    transfer.pk_show = this.baseData.transferpk_show;
                    transfer.beanmap = {pk_ref: {}};
                    transfer.beanmap.pk_ref[transfer.pk].id = transfer.pk;
                    transfer.beanmap.pk_ref[transfer.pk].code = this.otherBaseData.destItemName;
                    transfer.beanmap.pk_ref[transfer.pk].name = this.otherBaseData.destItemName;
                    transfer.beanmap.pk_ref[transfer.pk].itemkey = this.baseData.destitemcol;
                }
                //设置模板绑定的数据
                this.$refs.ref_classitem_c.setData("transfer", transfer);
            },

            //设置数据来源控件
            setItemDataSource(itemtype){

                this.dataSourceOptions = [];
                this.dataSource = 2;
                if (itemtype != 2) {
                    //数据类型不是日期的都可以用公式
                    this.dataSourceOptions.push({value: 0, label: '由公式计算'});
                }

                if (itemtype == 0) {
                    this.dataSourceOptions.push({value: 1, label: '按薪资规则表'});
                    this.$refs.ref_classitem_c.setData("taxflag_show", itemtype == 0);
                    this.$refs.ref_classitem_c.setData("iflddecimal_show", itemtype == 0);
                    this.$refs.ref_classitem_c.setData("isinhi_show", itemtype == 0);
                }

                this.dataSourceOptions.push({value: 2, label: '手工输入'});

                //数值类型时
                if (itemtype == 0) {
                    this.dataSourceOptions.push({value: 3, label: '固定值'});
                    this.dataSourceOptions.push({value: 4, label: '薪资标准表'});
                    //小数位数默认2
                    this.$refs.ref_classitem_c.getFormData().iflddecimal = 2;
                    //数据长度为12
                    this.$refs.ref_classitem_c.getFormData().ifldwidth = 12;
                    //增减属性为0
                    this.$refs.ref_classitem_c.getFormData().iproperty = 0;
                    //数据长度不只读
                    this.$refs.ref_classitem_c.setData("ifldwidth_disabled", false);

                    this.$refs.ref_classitem_c.getFormData().iproperty_disabled = false;


                    //数据来源只读
                    this.dataSourceDisabled = false;
                }

                //数据类型为字符型
                if (itemtype == 1) {
                    //数据长度为20
                    this.$refs.ref_classitem_c.getFormData().ifldwidth = 20;
                    //小数位数默认0
                    this.$refs.ref_classitem_c.getFormData().iflddecimal = 0;
                    //增减属性
                    this.$refs.ref_classitem_c.getFormData().iproperty = 2;
                    //数据来源只读
                    this.dataSourceDisabled = false;
                    //数据长度不只读
                    this.$refs.ref_classitem_c.setData("ifldwidth_disabled", false);
                    //数据来源为2手工输入
                    this.$refs.ref_classitem_c.getFormData().dataSource = 2;
                    //增减属性
                    this.$refs.ref_classitem_c.getFormData().iproperty_disabled = true;
                    this.$refs.ref_classitem_c.setData("iproperty_disabled", true);
                    //数据类型只读
                    this.$refs.ref_classitem_c.setData("iitemtype_disabled", true);


                    this.$refs.ref_classitem_c.setData("taxflag_show", itemtype == 0);
                    this.$refs.ref_classitem_c.setData("iflddecimal_show", itemtype == 0);
                    this.$refs.ref_classitem_c.setData("isinhi_show", itemtype == 0);

                }
                //数据类型为日期型
                if (itemtype == 2) {
                    //数据长度为10
                    this.$refs.ref_classitem_c.getFormData().ifldwidth = 10;
                    //小数位数默认0
                    this.$refs.ref_classitem_c.getFormData().iflddecimal = 0;
                    //数据来源只读
                    this.dataSourceDisabled = true;
                    //数据长度只读
                    this.$refs.ref_classitem_c.setData("ifldwidth_disabled", true);
                    //增减属性
                    this.$refs.ref_classitem_c.getFormData().iproperty = 2;
                    //增减属性只读
                    this.$refs.ref_classitem_c.getFormData().iproperty_disabled = true;

                    this.$refs.ref_classitem_c.setData("taxflag_show", itemtype == 0);
                    this.$refs.ref_classitem_c.setData("iflddecimal_show", itemtype == 0);
                    this.$refs.ref_classitem_c.setData("isinhi_show", itemtype == 0);


                }

                this.queryParams.itemkey = this.baseData.itemkey;
                switch (this.dataSource) {
                    case 0:
                        this.dataSourceTmeplate[0] = this.createDataSourceTemplate("XXXXXXX", this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 1:
                        this.dataSourceTmeplate[1] = this.createDataSourceTemplate(this.otherBaseData.datasourceitem1, this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 3:
                        if (this.baseData.ifldwidth != null && this.baseData.ifldwidth != undefined) {
                            let fieldWidth = parseInt(this.baseData.ifldwidth, 10);
                            let fieldDecimal = parseInt(this.baseData.iflddecimal, 10);
                            this.dataSourceTmeplate[3].maxlength = fieldWidth + 1 + fieldDecimal;
                            this.dataSourceTmeplate[3].decimals = fieldDecimal;
                        }
                        let text = parseFloat(this.baseData.vformula, 10);
                        this.dataSourceTmeplate[3].text = text;
                        break;
                    case 4:
                        this.dataSourceTmeplate[4] = this.createDataSourceTemplate(this.otherBaseData.datasourceitem4, this.baseData.vformula, this.baseData.vformulastr);
                        break;

                    default :
                        break;
                }
            },
            createDataSourceTemplate(pk, code, name){
                let template = {};
                template.formula = pk;
                template.beanMap = {};
                template.beanMap.formula_ref = {};
                template.beanMap.formula_ref[pk] = {};
                template.beanMap.formula_ref[pk].id = pk;
                template.beanMap.formula_ref[pk].code = code;
                template.beanMap.formula_ref[pk].name = name;
                return template;
            },
            //控制字段是否可以编辑
            setDataControl(data, isGroupItem){
                //默认数据类型按照FLOATTYPE处理
                let itemtype = 0;
                if (data.iitemtype != undefined && data.iitemtype != null && data.iitemtype != "") {
                    itemtype = data.iitemtype;
                }
                let isSystemItemKey = this.isSystemItemKey(data.itemkey);
                let isSpecialSystemItem = this.isSpecialSystemItem(data.itemkey);

                //增减属性
                data["iproperty_disabled"] = true;

                //数值类型
                data["iitemtype_disabled"] = true;

                //小数位数
                data["iflddecimal_disabled"] = false;

                //纳入薪资
                data["isinhi_disabled"] = false

                //扣税
                data["taxflag_disabled"] = false;
                //下月清零
                data["clearflag_disabled"] = true;
                //数据来源
                this.dataSourceDisabled = false;
                //小数位数的可见性的控制
                data["iflddecimal_show"] = false;
                //扣税的可见性的控制
                data["taxflag_show"] = false;

                //预警条件项目不可以编辑
                //TODO 暂时没有考虑

                if (itemtype == 0) {
                    //小数位数的可见性的控制
                    data["iflddecimal_show"] = true;
                    //扣税的可见性的控制
                    data["taxflag_show"] = false;


                } else if (itemtype == 1) {
                    //纳入薪资
                    data["isinhi_disabled"] = true;
                    //扣税
                    data["taxflag_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;
                    //小数位数的可见性的控制
                    data["iflddecimal_show"] = false;
                    //扣税的可见性的控制
                    data["taxflag_show"] = false;

                } else if (itemtype == 2) {
                    //纳入薪资
                    data["isinhi_disabled"] = true;
                    //扣税
                    data["taxflag_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;

                    //小数位数的可见性的控制
                    data["iflddecimal_show"] = false;
                    //扣税的可见性的控制
                    data["taxflag_show"] = false;
                }

                if (isSystemItemKey) {
                    //发放项目名称
                    data["name_disabled"] = false;
                    //舍位方式
                    data["round_type_disabled"] = false;

                    //审批项目
                    data["inapproveditem _disabled"] = false;

                    //数据来源
                    if (!isSpecialSystemItem) {
                        this.dataSourceDisabled = false;
                    } else {
                        this.dataSourceDisabled = true;
                    }
                    //预警条件项目可以编辑
                    //TODO 暂时没有考虑
                    //项目分类
                    data["category_id_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;
                    //纳入薪资
                    data["isinhi_disabled"] = true
                    //扣税
                    data["taxflag_disabled"] = true;
                    //下月清零
                    data["clearflag_disabled"] = true;

                } else if (isGroupItem) {
                    //发放项目名称
                    data["name_disabled"] = false;
                    //项目分类
                    data["category_id_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;
                    //纳入薪资
                    data["isinhi_disabled"] = true
                    //扣税
                    data["taxflag_disabled"] = true;
                    //下月清零
                    data["clearflag_disabled"] = true;
                    //中间项目
                    data["mid_disabled"] = true;
                    //数据来源
                    this.dataSourceDisabled = true;

                }

                //FLOATTYPE类型
                if (itemtype == 0) {
                    //小数位数
                    data["iflddecimal_show"] = false;
                } else {
                    data["iflddecimal_disabled"] = true;

                }
            },
            //判断是否系统预置项目
            isSystemItemKey(itemkey){
                if (itemkey != undefined && itemkey != null && itemkey != "" && itemkey.indexOf("f_") == 0) {
                    if (!isNaN(parseInt(itemkey.substring(2)))) {
                        return parseInt(itemkey.substring(2)) <= 9;
                    }
                }
                return false;
            },
            isSpecialSystemItem(itemkey){
                if (itemkey != undefined && itemkey != null && itemkey != "") {
                    if (itemkey == "f_6" || itemkey == "f_7" || itemkey == "f_8" || itemkey == "f_9") {
                        return true;
                    }
                }
                return false;
            },
            setItemOriBind(){
                let ori = 2;
                if (this.otherBaseData.isGroupItem) {
                    ori = 1;
                } else if (this.isSystemItemKey(this.baseData.itemkey)) {
                    ori = 0;
                }

                this.$refs.ref_classitem_c.setData("itemori", ori);
            },
            // 基本信息取消按钮操作
            waItemCancel() {

                this.itemEdit = false;
                if (this.baseData.code == undefined) {

                    this.$context.getApp().back();
                }
                else {
                    if (this.baseData == undefined) {
                        this.$refs.ref_classitem_c.setData("waitem", {});

                    }
                    else {
                        this.$refs.ref_classitem_c.setData("waitem", JSON.parse(JSON.stringify(this.baseData)));
                        this.setItemDataSource();


                    }

                }
            },
            // 基本信息保存按钮操作
            waItemConfirm() {
                //数据来源是否为空判断
                let sourceItem = this.dataSourceTmeplate[this.dataSource];
                let checkFlag = false;
                if (this.dataSource == 3) {
                    if (!sourceItem.text) {
                        checkFlag = true;
                    }
                } else if (this.dataSource == 2 || this.dataSource == 5) {

                } else {
                    if (!sourceItem.formula) {
                        checkFlag = true;
                    }
                    if (!sourceItem.beanMap || !sourceItem.beanMap.formula_ref
                        || !sourceItem.beanMap.formula_ref[sourceItem.formula]
                        || !sourceItem.beanMap.formula_ref[sourceItem.formula].id) {
                        checkFlag = true;
                    }
                }
                if (checkFlag) {
                    this.$confirm('数据来源不能为空!', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'error',
                    });
                    return;
                }
debugger
                /*let currdata = this.$refs.ref_classitem_c.getData("waitem");
                let data = JSON.parse(JSON.stringify(currdata));*/
                var data = this.$refs.ref_classitem_c.getFormData();

                data.ifromflag = this.dataSource;

                if (data.ifromflag == 3) {
                    data.vformula = this.dataSourceTmeplate[3].text;
                    data.vformulastr = "";
                }

                //限制问题
                this.$refs.ref_classitem_c.validate(valid => {
                    debugger
                    if (valid) {
                        this.$http({
                            url: "/hrwa/waItem/save",
                            method: "post",
                            data: data
                        })
                            .then(res => {

                                this.$refs.ref_classitem_c.clearEdit();

                                if (res.data.status === true) {
                                    this.$router.push("/hrwa/waitem/detail/" + res.data.data.pk_wa_item + "/" + false);
                                    this.$message({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    let originalValue = res.data.data;

                                    //设置字段状态
                                    this.setDataControl(originalValue, this.otherBaseData.isGroupItem);
                                    //数据备份
                                    this.baseData = JSON.parse(JSON.stringify(originalValue));
                                    this.otherBaseData.datasourceitem1 = res.data.datasourceitem1;
                                    this.otherBaseData.datasourceitem4 = res.data.datasourceitem4;
                                    this.otherBaseData.destItemName = res.data.destItemName;
                                    //设置模板绑定的数据
                                    this.$refs.ref_classitem_c.setData(
                                        "waitem",
                                        JSON.parse(JSON.stringify(originalValue))
                                    );

                                    //设置数据来源控件绑定的数据
                                    this.setItemDataSource(originalValue.iitemtype);

                                    this.itemEdit = false;
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
        },
    };
</script>
