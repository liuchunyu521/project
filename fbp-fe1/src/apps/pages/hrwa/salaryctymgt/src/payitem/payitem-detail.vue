<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb name="薪资发放项目详情"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
                <ifbp-panel id="waItemPanel" title="基本信息" :icons="[]">
                    <ifbp-template ref="ref_classitem_c"
                                   tpl-id="hrwa_payitem_detail"
                                   :tplData="waClassItemData"
                                   :methods="formMethods"
                                   :tpl-reset-fun="classitemFormResetFun"
                                   :editable="itemEdit">
                    </ifbp-template>
                </ifbp-panel>

                <!-- 子区域 -->
                <ifbp-panel id="dataSourcePanel" title="项目数据来源" :icons="[]">
                    <br/>
                    <el-form label-width="150px" id="dataSourcepayitem">
                        <el-form-item label="数据来源" :required="true" style="padding-left:30px;">
                    <!--<label class="el-form-item__label data-source-lbl" for="dataSource">数据来源</label>-->
                    <el-select v-model="dataSource" placeholder="请选择" id="dataSource" :disabled="dataSourceDisabled"
                               style="width:200px;margin-right: 12px;" :editable="itemEdit">
                        <el-option
                                v-for="item in dataSourceOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <!-- 由公式计算 -->
                    <el-ref :editable="itemEdit" v-model="dataSourceTmeplate[0].formula"
                            field="formula" v-show="dataSource==0"
                            :template-value="dataSourceTmeplate[0]"
                            :disabled="dataSourceDisabled" style="width:400px;display:inline-block;"
                            dialog-title="公式编辑器" :dialog-show-close="true" custom-dialog="hrwa-fomula-dialog"
                            v-on:trigger="fomulaRefTriggerHandle"
                            custom-dialog-size="full" width="1000px" :query-params="queryParams"
                    >
                    </el-ref>
                    <el-ref _id="dataSourceWageform" :editable="itemEdit" v-model="dataSourceTmeplate[1].formula"
                            field="formula" v-show="dataSource==1"
                            :template-value="dataSourceTmeplate[1]" pk="83c6544f-a285-455a-84d6-4b580854159a"
                            v-on:trigger="wageformRefTriggerHandle" :query-params="queryParams"
                            ref-code="wageform" :disabled="dataSourceDisabled"
                            style="width:250px;display:inline-block;">
                    </el-ref>
                    <!-- 固定值 -->
                    <el-number :maxlength="dataSourceTmeplate[3].maxlength"
                            separator="," :editable="itemEdit"
                            v-show="dataSource==3"
                            v-model="dataSourceTmeplate[3].text"
                            :decimals="dataSourceTmeplate[3].decimals"
                            style="width:250px;display:inline-block;" :disabled="dataSourceDisabled"
                    ></el-number>
                    <el-ref _id="dataSourceWagrade" :editable="itemEdit" v-model="dataSourceTmeplate[4].formula"
                            field="formula" v-show="dataSource==4"
                            :template-value="dataSourceTmeplate[4]" pk="92054d71-866d-4d82-9085-75ad2f63d4c1"
                            v-on:trigger="wagradeRefTriggerHandle" :query-params="queryParams"
                            ref-code="wagrade" :disabled="dataSourceDisabled" style="width:250px;display:inline-block;">
                    </el-ref>
                    <!-- 薪资系统来源 -->
                    <el-ref _id="dataSourceWageitem" :editable="itemEdit" v-model="dataSourceTmeplate[6].formula"
                            field="formula" v-show="dataSource==6" dialog-title="薪资系统来源"
                            :template-value="dataSourceTmeplate[6]" custom-dialog="wa-system-dialog"
                            custom-dialog-size="tiny" 　:query-params="queryParams" v-on:trigger="wageRefTriggerHandle"
                            ref-code="waitem" :disabled="dataSourceDisabled" style="width:350px;display:inline-block;">
                    </el-ref>
                    <!-- 人事系统来源 -->
                    <el-ref _id="dataSourceHi" :editable="itemEdit" v-model="dataSourceTmeplate[7].formula"
                            field="formula" v-show="dataSource==7" dialog-title="人事系统来源"
                            :template-value="dataSourceTmeplate[7]" custom-dialog="hi-system-dialog"
                            custom-dialog-size="tiny" :query-params="queryParams" v-on:trigger="hiRefTriggerHandle"
                            ref-code="waitem" :disabled="dataSourceDisabled" style="width:300px;display:inline-block;">
                    </el-ref>
                        </el-form-item>
                    </el-form>
                </ifbp-panel>

                <ifbp-panel id="warnItemPanel" title="预警条件设置" :icons="[]" v-if="baseData.iitemtype==0">
                    <ifbp-template ref="ref_warnitem_c"
                                   tpl-id="hrwa_payitem_warnform"
                                   :tplData="warnItemData"
                                   :methods="warnFormMethods"
                                   :mounted="warnFormMounted"
                                   :tpl-reset-fun="warnitemFormResetFun"
                                   :editable="itemEdit"
                                   @after-create="warnFormCreate">
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer v-if="editvif">
            <el-button type="default" @click="itemCancel" v-if="itemEdit" style="float:right">取消</el-button>
            <el-button type="primary" @click="itemConfirm" v-if="itemEdit" style="float:right">保存</el-button>
            <el-button type="primary" @click="changeEditStatus" v-if="!itemEdit">编辑</el-button>
        </ifbp-footer>
    </ifbp-page>
</template>
<script>

    //中央事件总线
    let bus = new Vue();
    import waSystemDialog from './wasys-datasource.vue';
    import hiSystemDialog from './hisys-datasource.vue';
    import fomula from '../fomuladialog/hrwa-fomula-dialog.vue';

    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        data() {
            Vue.component('wa-system-dialog', waSystemDialog);
            Vue.component('hi-system-dialog', hiSystemDialog);
            Vue.component('hrwa-fomula-dialog', fomula);

            var vm = this;
            //var pk_wa_item = this.$root.$router.currentRoute.params.pk_wa_classitem;

            var params = this.$root.$router.currentRoute.params;
            params.waclass = {};
            params.waclass.pk_wa_class = params.pk_wa_class;
            params.waclass.pk_org = params.pk_org;
            params.waclass.cyear = params.cyear;
            params.waclass.cperiod = params.cperiod;

            return {
                editvif: this.$root.$router.currentRoute.params.opercolif === 'true',
                // 通过传入的参数判断是新增还是修改操作
                pk_wa_classitem: this.$root.$router.currentRoute.params.pk_wa_classitem,

                warnItemData:{
                },
                warnFormMethods:{
                },
                warnFormMounted:function(){
                    var warnForm = this;
                    bus.$on('decimalChange', function (newVal) {
                    if (newVal == null || newVal == "") {
                        warnForm.iflddecimal = 0;
                    } else {
                        warnForm.iflddecimal = newVal;
                    }});
                },
                warnitemFormResetFun: function ($node) {
                    var $form = this.getFormDom($node);
                    var $nsumceil = $form.find("[v-model='wa_classitem.nsumceil']");
                    $nsumceil.attr(":decimals", "wa_classitem.iflddecimal");
                    var $nsumfloor = $form.find("[v-model='wa_classitem.nsumfloor']");
                    $nsumfloor.attr(":decimals", "wa_classitem.iflddecimal");
                    var $npsnceil = $form.find("[v-model='wa_classitem.npsnceil']");
                    $npsnceil.attr(":decimals", "wa_classitem.iflddecimal");
                    var $npsnfloor = $form.find("[v-model='wa_classitem.npsnfloor']");
                    $npsnfloor.attr(":decimals", "wa_classitem.iflddecimal");

                    return $node[0].outerHTML;
                },
                // UI模板所需参数
                waClassItemData: {
                    //模板数据对象
                    wa_classitem: {},
                    //结转设置数据对象
                    transfer: {
                        beanMap: {pk_ref: {}},
                        pk: '',
                    },
                    itemori: '',
                    params: "",
                    params1: "",
                    rules: {}
                },

                //模板控件里的method内容
                formMethods: {
                    decimalTriggerHandle(newVal){
                        bus.$emit("decimalChange", newVal);
                    },
                    transferTriggerHandle: function (type, data) {
//                        let editData = this.$refs.ref_classitem_c.model;
                        let editData = this.wa_classitem;
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
                //模板控件的个性化设置
                classitemFormResetFun: function ($node) {
                    //显示项目绑定只读属性
                    //发放项目名称
                    let $name = $node.find("[prop='name']");
                    if ($name.length == 1) {
                        $name.children().first().attr(':disabled', 'wa_classitem.name_disabled');
                    }
                    //项目分类
                    let $category_id = $node.find("[prop='category_id']");
                    if ($category_id.length == 1) {
                        $category_id.children().first().attr(':disabled', 'wa_classitem.category_id_disabled');
                    }
                    //小数位数
                    var $iflddecimal = $node.find("[prop='iflddecimal']");
                    if ($iflddecimal.length == 1) {
                        $iflddecimal.attr("v-show", "wa_classitem.iflddecimal_show");
                        var $iflddecimalCtr = $iflddecimal.children().first();
                        $iflddecimalCtr.attr(':disabled', 'wa_classitem.iflddecimal_disabled');
                        $iflddecimalCtr.attr('v-on:change', 'decimalTriggerHandle');
                    }
                    //舍位方式
                    var $round_type = $node.find("[prop='round_type']");
                    if ($round_type.length == 1) {
                        $round_type.attr("v-show", "wa_classitem.round_type_show");
                        $round_type.children().first().attr(':disabled', 'wa_classitem.round_type_disabled');
                    }
                    //扣税
                    var $taxflag = $node.find("[prop='taxflag']");
                    if ($taxflag.length == 1) {
                        $taxflag.attr("v-show", "wa_classitem.taxflag_show");
                        $taxflag.children().first().attr(':disabled', 'wa_classitem.taxflag_disabled');
                    }
                    //下月清零
                    var $clearflag = $node.find("[prop='clearflag']");
                    if ($clearflag.length == 1) {
                        $clearflag.children().first().attr(':disabled', 'wa_classitem.clearflag_disabled');
                    }

                    //动态增加结转设置控件
                    let transferWrap = $("<el-form-item></el-form-item>");
                    transferWrap.attr("_id", "transferitemid");
                    transferWrap.attr("label", "结转设置");
                    transferWrap.attr("prop", "transfer");
                    transferWrap.attr("v-show", "transfer.pk_show");
                    let transferRef = $("<el-ref></el-ref>");
                    transferRef.attr("_id", "transferRefid");
                    transferRef.attr(":editable", "editable");
                    transferRef.attr("v-model", "transfer.pk");
                    transferRef.attr("field", "pk");
                    transferRef.attr(":template-value", "transfer");
                    transferRef.attr("pk", "e2d14b43-c222-42c9-aede-325dcd2f997a");
                    transferRef.attr("ref-code", "classitem02");
                    transferRef.attr("v-on:trigger", "transferTriggerHandle");
//                    transferRef.attr(":disabled", "transfer.pk_disabled");
                    transferRef.attr(":query-params", "wa_classitem");
                    transferWrap.append(transferRef);
                    $node.find("el-form").append(transferWrap);

                    return $node[0].outerHTML;
                },
                // 基本信息是否为修改态
                itemEdit: this.$root.$router.currentRoute.params.is_edit == 1,
                dataSourceDisabled: false,
                dataSourceOptions: [],
                dataSource: '',
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
                    ,//其他系统(不使用)
                    {formula: ''},//薪资
                    {formula: ''},//人事系统
                ],
                //模板绑定的原始数据
                baseData: {},
                //模板以外的字段绑定的原始数据
                otherBaseData: {
                    isGroupItem: false,//是否集团项目
                    datasourceitem1: '',//数据源1对应的参照值
                    datasourceitem4: '',//数据源4对应的参照值
                    destItemName: '',//结转设置项目对应的参照的名称
                },
                queryParams: {
                    itemkey: '',
                    context:params.waclass,
                    cyear:params.cyear,
                    cperiod:params.cperiod,
                    from: 2,
                    pk_org:'',
                    iitemtype:0,
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

                this.requestBaseBaseInfo();

            },
            // 请求客户基本信息详情
            requestBaseBaseInfo() {
                if (!this.pk_wa_classitem) return;
                this.$http({
                    url: "/hrwa/payitem/detail/queryWaClassItemById",
                    method: "post",
                    data: {pk_wa_classitem: this.pk_wa_classitem}
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
                            this.otherBaseData.destItemName = res.data.destItemName;
                            this.queryParams.pk_org = this.baseData.pk_org;
                            //设置模板绑定的数据
                            this.$refs.ref_classitem_c.setData(
                                "wa_classitem",
                                JSON.parse(JSON.stringify(originalValue))
                            );
                            if(this.$refs.ref_warnitem_c){
                                this.$refs.ref_warnitem_c.setFormData(JSON.parse(JSON.stringify(originalValue)));
                            }
                            //设置项目来源
                            this.setItemOriBind();
                            //设置数据来源控件绑定的数据
                            this.setItemDataSource();
                            //设置结转设置控件绑定的数据
                            this.setTransferBind();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "详情获取失败",
                            type: "error"
                        });
                    });
            },

            hiRefTriggerHandle: function (type, data) {
                this.fomulaRefTriggerHandle(type, data);
            },
            wageRefTriggerHandle: function (type, data) {
                this.fomulaRefTriggerHandle(type, data);
            },
            fomulaRefTriggerHandle: function (type, data) {
                let currdata = this.$refs.ref_classitem_c.getData("wa_classitem");
                currdata.vformula = data.value[0].code;
                currdata.vformulastr = data.value[0].name;
                this.$refs.ref_classitem_c.setData("wa_classitem",currdata);
            },
            wageformRefTriggerHandle: function (type, data) {
                this.setScriptLang(data.value[0].id, data.value[0].name);
            },

            wagradeRefTriggerHandle: function (type, data) {
                this.setScriptLang(data.value[0].id, data.value[0].name);
            },
            setScriptLang(pk, name){
                let _this = this;
                let svr = this.$http({
                    url: "/hrwa/payitem/detail/getScriptLang2",
                    method: "post",
                    data: {ifromflag: this.dataSource, pk: pk, name: name}
                });
                svr.then(res => {
                    if (res.data.status === true) {
                        let currdata = this.$refs.ref_classitem_c.getData("wa_classitem");
                        currdata.vformula = res.data.data.scirptLang;
                        currdata.vformulastr = res.data.data.businessLang;
                        this.$refs.ref_classitem_c.setData("wa_classitem",currdata);
//              _this.waClassItemData.wa_classitem.vformula = res.data.data.scirptLang;
//              _this.waClassItemData.wa_classitem.vformulastr = res.data.data.businessLang;
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
                    transfer.beanMap = {pk_ref: {}};
                } else {
                    transfer.pk = this.baseData.destitempk;
                    transfer.pk_show = this.baseData.transferpk_show;
                    transfer.beanMap = {pk_ref: {}};
                    transfer.beanMap.pk_ref[transfer.pk] = {};
                    transfer.beanMap.pk_ref[transfer.pk].id = transfer.pk;
                    transfer.beanMap.pk_ref[transfer.pk].code = this.otherBaseData.destItemName;
                    transfer.beanMap.pk_ref[transfer.pk].name = this.otherBaseData.destItemName;
                    transfer.beanMap.pk_ref[transfer.pk].itemkey = this.baseData.destitemcol;
                }
                //设置模板绑定的数据
                this.$refs.ref_classitem_c.setData("transfer", transfer);
            },
            //设置数据来源控件
            setItemDataSource(){
                this.dataSourceOptions = [];
                let itemtype = this.baseData.iitemtype;

                if (itemtype != 2) {
                    //数据类型不是日期的都可以用公式
                    this.dataSourceOptions.push({value: 0, label: '由公式计算'});
                }

                if (itemtype == 0) {
                    this.dataSourceOptions.push({value: 1, label: '按薪资规则表'});
                }
                this.dataSourceOptions.push({value: 2, label: '手工输入'});

                if (itemtype == 0) {
                    this.dataSourceOptions.push({value: 3, label: '固定值'});
                    this.dataSourceOptions.push({value: 4, label: '按薪资标准表'});
                }

                //FIXME  其他系统的显示控制还没有做
                this.dataSourceOptions.push({value: 6, label: '其他系统-薪资'});
                this.dataSourceOptions.push({value: 7, label: '其他系统-人事信息'});
//        this.dataSourceOptions.push({value:8,label:'发放次数汇总'});
//        this.dataSourceOptions.push({value:9,label:'其他系统-考勤'});
//        this.dataSourceOptions.push({value:10,label:'其他系统-社保'});
//        this.dataSourceOptions.push({value:11,label:'其他系统-绩效'});

                this.dataSource = this.baseData.ifromflag;
                this.queryParams.itemkey = this.baseData.itemkey;
                this.queryParams.iitemtype = this.baseData.iitemtype;

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
                    case 6:
                        this.dataSourceTmeplate[6] = this.createDataSourceTemplate("OLDID", this.baseData.vformula, this.baseData.vformulastr);
                        break;
                    case 7:
                        this.dataSourceTmeplate[7] = this.createDataSourceTemplate("OLDID", this.baseData.vformula, this.baseData.vformulastr);
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


                //发放项目名称
                data["name_disabled"] = false;
                //舍位方式
                data["round_type_disabled"] = false;
                //银行帐号
                data["bankaccount_disabled"] = false;
                //审批项目
                data["inapproveditem _disabled"] = false;
                //项目分类
                data["category_id_disabled"] = false;

                //小数位数
                data["iflddecimal_disabled"] = false;
                //扣税
                data["taxflag_disabled"] = false;
                //下月清零
                data["clearflag_disabled"] = false;
                //中间项目
                data["mid_disabled"] = false;

                //数据来源
                this.dataSourceDisabled = false;

                //结转设置的可见性的控制
                data["transferpk_show"] = true;
                //舍位方式的可见性的控制
                data["round_type_show"] = true;
                //小数位数的可见性的控制
                data["iflddecimal_show"] = true;
                //扣税的可见性的控制
                data["taxflag_show"] = true;

                //预警条件项目不可以编辑
                //TODO 暂时没有考虑

                if (itemtype == 0) {
                    if (data.iproperty == 2) {
                        //中间项目
                        data["mid_disabled"] = false;
                    } else {
                        //中间项目
                        data["mid_disabled"] = true;
                    }
                } else if (itemtype == 1) {
                    //扣税
                    data["taxflag_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;
                    //银行帐号
                    data["bankaccount_disabled"] = true;

                    //结转设置的可见性的控制
                    data["transferpk_show"] = false;
                    //舍位方式的可见性的控制
                    data["round_type_show"] = false;
                    //小数位数的可见性的控制
                    data["iflddecimal_show"] = false;
                    //扣税的可见性的控制
                    data["taxflag_show"] = false;

                } else if (itemtype == 2) {
                    //扣税
                    data["taxflag_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;
                    //银行帐号
                    data["bankaccount_disabled"] = true;

                    //结转设置的可见性的控制
                    data["transferpk_show"] = false;
                    //舍位方式的可见性的控制
                    data["round_type_show"] = false;
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
                    //银行帐号
                    data["bankaccount_disabled"] = false;
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
                    //扣税
                    data["taxflag_disabled"] = true;
                    //下月清零
                    data["clearflag_disabled"] = true;
                    //中间项目
                    data["mid_disabled"] = true;

                } else if (isGroupItem) {
                    //发放项目名称
                    data["name_disabled"] = false;


                    //舍位方式
                    data["round_type_disabled"] = true;
                    //银行帐号
                    data["bankaccount_disabled"] = true;
                    //审批项目
                    data["inapproveditem _disabled"] = true;
                    //项目分类
                    data["category_id_disabled"] = true;
                    //小数位数
                    data["iflddecimal_disabled"] = true;
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
                    data["iflddecimal_disabled"] = false;
                    //舍位方式
                    data["round_type_disabled"] = false;
                } else {
                    data["iflddecimal_disabled"] = true;
                    //舍位方式
                    data["round_type_disabled"] = true;
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
            warnFormCreate(){
                this.$refs.ref_warnitem_c.setFormData(JSON.parse(JSON.stringify(this.baseData)));
            },
            // 基本信息取消按钮操作
            itemCancel() {
                this.itemEdit = false;
                this.$refs.ref_classitem_c.setData("wa_classitem", JSON.parse(JSON.stringify(this.baseData)));
                this.$refs.ref_classitem_c.clearEdit();
                if(this.baseData.iitemtype==0){
                    this.$refs.ref_warnitem_c.setFormData(JSON.parse(JSON.stringify(this.baseData)));
                    this.$refs.ref_warnitem_c.clearEdit();
                }
                //设置数据来源控件绑定的数据
                this.setItemDataSource();
                //设置结转设置控件绑定的数据
                this.setTransferBind();
            },
            // 基本信息保存按钮操作
            itemConfirm() {
                let sourceItem = this.dataSourceTmeplate[this.dataSource];
                let checkFlag = false;
                if(this.dataSource == 3){
                    if(!sourceItem.text){
                        checkFlag = true;
                    }
                }else if(this.dataSource == 2 || this.dataSource == 5){

                }else if(this.dataSource == 0 && this.dataSourceDisabled ){
                    //数据来源是公式，且不可编辑时，不需要校验必输
                }else{
                    if(!sourceItem.formula){
                        checkFlag = true;
                    }
                    if(!sourceItem.beanMap || !sourceItem.beanMap.formula_ref
                        || !sourceItem.beanMap.formula_ref[sourceItem.formula]
                        || !sourceItem.beanMap.formula_ref[sourceItem.formula].name){
                        checkFlag = true;
                    }
                }
                if(checkFlag){
                    this.$confirm('数据来源不能为空!', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton:false,
                        type: 'error',
                    });
                    return;
                }

                let currdata = this.$refs.ref_classitem_c.getData("wa_classitem");
                let data = JSON.parse(JSON.stringify(currdata));
                data.ifromflag = this.dataSource;
                //结转设置
                let transfer = this.$refs.ref_classitem_c.getData("transfer");
                if(!transfer.pk){
                    data.istransfer = false;
                    data.destitempk = "";
                    data.destitemcol = "";
                }else{
                    data.istransfer = true;
                    data.destitempk = transfer.pk;
                    data.destitemcol = transfer.beanMap.pk_ref[transfer.pk].itemkey;
                }
                if(data.ifromflag == 3){
                    data.vformula = this.dataSourceTmeplate[3].text;
                    data.vformulastr = "";
                }
                //手工输入时，清空残余数据
                if(data.ifromflag == 2){
                    data.vformula = "";
                    data.vformulastr = "";
                }
                if(data.iitemtype == 0){
                    let currWarnData = this.$refs.ref_warnitem_c.getFormData();
                    data.nsumceil = currWarnData.nsumceil;
                    data.nsumfloor = currWarnData.nsumfloor;
                    data.npsnceil = currWarnData.npsnceil;
                    data.npsnfloor = currWarnData.npsnfloor;
                    data.sumceilflag = true;
                    data.sumfloorflag  = true;
                    data.psnceilflag   = true;
                    data.psnfloorflag = true;
                    if(data.nsumceil == null || data.nsumceil === ""){
                        data.sumceilflag = false;
                    }
                    if(data.nsumfloor == null || data.nsumfloor === ""){
                        data.sumfloorflag  = false;
                    }
                    if(data.npsnceil == null || data.npsnceil === ""){
                        data.psnceilflag   = false;
                    }
                    if(data.npsnfloor == null || data.npsnfloor === ""){
                        data.psnfloorflag = false;
                    }
                }else{
                    data.sumceilflag = false;
                    data.sumfloorflag  = false;
                    data.psnceilflag   = false;
                    data.psnfloorflag = false;
                }

                this.$refs.ref_classitem_c.validate(valid => {
                    if (valid) {
                        this.$http({
                            url: "/hrwa/payitem/detail/update",
                            method: "post",
                            data: data
                        })
                            .then(res => {

                                if (res.data.status === true) {
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
                                        "wa_classitem",
                                        JSON.parse(JSON.stringify(originalValue))
                                    );
                                    //设置项目来源
                                    this.setItemOriBind();
                                    //设置数据来源控件绑定的数据
                                    this.setItemDataSource();
                                    //设置结转设置控件绑定的数据
                                    this.setTransferBind();

                                    this.itemEdit = false;
                                    this.$refs.ref_classitem_c.clearEdit();
                                    if(this.baseData.iitemtype == 0){
                                        this.$refs.ref_warnitem_c.clearEdit();
                                    }
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
            changeEditStatus(){
                this.itemEdit = !this.itemEdit;
            }

        }
    };
</script>
<style>
    .data-source-lbl {
        width: 150px;
        display: inline-block;
    }
    #dataSourcepayitem .el-form-item__content{
        max-width: calc(100% - 150px)!important;
    }
</style>
