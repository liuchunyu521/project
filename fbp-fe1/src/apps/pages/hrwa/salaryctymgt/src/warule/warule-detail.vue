<template>
    <ifbp-page>
        <ifbp-breadcrumb v-if="isNew || !rulename" name="新增薪资规则"></ifbp-breadcrumb>
        <ifbp-breadcrumb v-else :name="rulename"></ifbp-breadcrumb>

        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" id="waruledetailpanel">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="basePanel" title="基本信息" :icons="[]" class="titleLine">
                    <!-- 主表编辑页签 -->
                    <ifbp-template ref='ref_WageformVO_c'
                                   tplId='hrwa_warule_detail'
                                   :methods='mainFormMethods'
                                   :tpl-data='ruleData'
                                   :editable='isEdit'
                                   :form-show-message='isEdit'
                                   :tpl-reset-fun='ruleMainResetFun'
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!-- 子表页签 -->
                <ifbp-panel title="规则公式" :icons="[]" id="warulechildpanel">
                    <br>
                    <el-row>
                        <el-col :span="2">
                            <div class="rule-child-title-xh">序号</div>
                            <div class="rule-child-cell-xh" v-for="(item, index) in childVOs">
                                <div>{{item.ilevel}}</div>
                            </div>
                            <div class="rule-child-cell-new" v-show="isEdit">
                                <div @click="addFormula">新增</div>
                            </div>
                        </el-col>
                        <el-col :span="14">
                            <div class="rule-child-title" :class="{'rule-required':isEdit}">公式<span v-show="isEdit && hasFormulaError" class="error-tip">请选择公式</span></div>
                            <div class="rule-child-cell" v-for="(item, index) in childVOs">
                                <el-ref v-model="item.formula" :editable="isEdit"  :class="{'list-cell-error': isEdit && (!item.formula || !item.vformulastr)}"
                                        field="formula" dialog-title="公式编辑器" :dialog-show-close="true"
                                        :template-value="item" custom-dialog="hrwa-fomula-dialog" @trigger="formulaTrigger(item)"
                                        custom-dialog-size="full" width="1000px"　:query-params="queryParams">
                                </el-ref>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="rule-child-title" :class="{'rule-required':isEdit}">金额<span v-show="isEdit && hasMoneyError" class="error-tip">请输入金额</span></div>
                            <div class="rule-child-cell" v-for="(item, index) in childVOs">
                                <el-money separator="," :decimals="iflddecimal" :editable="isEdit" symbol="" :class="{'list-cell-error': isEdit && item.nvalue==''}"
                                           v-model="item.nvalue"></el-money>
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <div class="rule-child-title">&nbsp;</div>
                            <div class="rule-child-cell-opr" v-for="(item, index) in childVOs"><i
                                    class="el-icon-delete rule-child-i" @click="ruleChildDeleteClick(index)"
                                    v-show="isEdit"></i></div>
                        </el-col>
                    </el-row>
                    <br/>
                    <!--<div v-show="false">-->
                        <!--<span>公式_临时测试</span>-->
                        <!--&lt;!&ndash;<fomula v-model="value"&ndash;&gt;-->
                        <!--&lt;!&ndash;:validate-function="validateFunction"&ndash;&gt;-->
                        <!--&lt;!&ndash;:get-fomula-tpls-function="getFomulaTplsFunction"&ndash;&gt;-->
                        <!--&lt;!&ndash;:get-database-tables-function="getDatabaseTablesFunction"></fomula>&ndash;&gt;-->

                        <!--<el-ref v-model="refTemplateValue.formula"-->
                                <!--field="formula" dialog-title="公式编辑器" :dialog-show-close="true"-->
                                <!--:template-value="refTemplateValue" custom-dialog="fomula-dialog"-->
                                <!--custom-dialog-size="small" 　:query-params="queryParams"-->
                                <!--ref-code="waitem" style="width:350px;display:inline-block;">-->
                        <!--</el-ref>-->
                    <!--</div>-->
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer v-if="hasEditPower">
            <el-button type="default" @click="ruleCancel" v-if="isNew || isEdit">取消</el-button>
            <el-button type="primary" @click="ruleConfirm" v-if="isNew || isEdit">保存</el-button>
            <el-button type="primary" @click="changeEditStatus" v-else >编辑</el-button>
        </ifbp-footer>
    </ifbp-page>
</template>
<script>
    import fomula from '../fomuladialog/hrwa-fomula-dialog.vue';

    //中央事件总线
    let bus = new Vue();

    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        data() {
            Vue.component('hrwa-fomula-dialog', fomula);
            const vm = this;
            var pk_wa_wageform = this.$root.$router.currentRoute.params.id;
            var _isedit = !pk_wa_wageform || (this.$root.$router.currentRoute.params.isedit == 1);
            return {
//                refTemplateValue: {
//                    beanMap: {
//                        formula: {},
//                    },
//                    formula: '',
//                },
                queryParams: {
                    from:1,
                },
                //是否新增态
                isNew: !pk_wa_wageform,
                //是否编辑态
                isEdit: _isedit,
                pk_wa_wageform: pk_wa_wageform,
                childVOs: [],
                hasEditPower:false,
                //备份的数据
                baseData: {},
                rulename: this.$root.$router.currentRoute.params.name,
                //主模板初期数据
                ruleData: {
                    WageformVO: {
                        pk_org_disabled: false,
                    },
                },
                //主模板Methods
                mainFormMethods: {
                    decimalTriggerHandle(newVal){
                        bus.$emit("decimalChange", newVal);
                    }
                },
                //主表模板个性化
                ruleMainResetFun: function ($node) {
                    //小数编辑框捆绑变更事件
                    var $iflddecimal = $node.find("[v-model='WageformVO.iflddecimal']");
                    $iflddecimal.attr('v-on:change', 'decimalTriggerHandle');

                    let $org = $node.find("[prop='pk_org']");
                    if ($org.length == 1) {
                        $org.children().first().attr(':disabled', 'WageformVO.pk_org_disabled');
                    }

                    return $node[0].outerHTML;
                },
                //删除了的薪资规则，提交后清空
                delRuleRow: [],
            };
        },
        computed:{
//            rulename:function(){
//                if(!this.baseData || !this.baseData.mainData || !this.baseData.mainData.name){
//                    return "薪资规则详情";
//                }else{
//                    return this.baseData.mainData.name;
//                }
//            },
            //是否所有行都已经选择了公式
            hasFormulaError:function(){
                if(!this.childVOs || this.childVOs.length == 0)return false;
                for(let i=0;i<this.childVOs.length;i++){
                    if(!this.childVOs[i].formula || !this.childVOs[i].vformulastr){
                        return true;
                    }
                }
                return false;
            },
            //是否所有行都已经输入了金额
            hasMoneyError:function(){
                if(!this.childVOs || this.childVOs.length == 0)return false;
                for(let i=0;i<this.childVOs.length;i++){
                    if(!this.childVOs[i].nvalue){
                        return true;
                    }
                }
                return false;
            },
        },
        watch: {},
        created () {
            let myself = this;
            //中央总线事件绑定,小数位数变更
            bus.$on('decimalChange', function (newVal) {
                myself.iflddecimal = newVal;
            });
        },
        mounted() {
//            this.queryParams.getFomulaTplsFunction = this.getFomulaTplsFunction;
//            this.queryParams.getDatabaseTablesFunction = this.getDatabaseTablesFunction;
//            this.queryParams.validateFunction = this.validateFunction;
            this.request();
        },
        methods: {
            formulaTrigger(item){
                item.vformula=item.beanMap.formula_ref.ASDF.code;
                item.vformulastr=item.beanMap.formula_ref.ASDF.name;
            },
//            validateFunction(fomulaStr){
//                return true;
//            },
//            getFomulaTplsFunction() {
//                let resData;
//                $.ajax({
//                    type: 'GET',
//                    url: '/hrwa/warulefomula/getFomulatpls',
//                    dataType: 'json',
//                    async: false,
//                    success(result) {
//                        resData = result.data;
//                    },
//                    error() {
//                    }
//                });
//                return resData;
//            },
//            getDatabaseTablesFunction() {
//                let resData;
//                $.ajax({
//                    type: 'GET',
//                    url: '/hrwa/warulefomula/getDatabaseTables',
//                    dataType: 'json',
//                    async: false,
//                    success(result) {
//                        resData = result.data;
//                    },
//                    error() {
//                    }
//                });
//                return resData;
//            },
            // 获取数据
            // 请求职级类别基本信息详情
            request() {
                if (this.isNew) {
                    this.iflddecimal = 2;
                    this.hasEditPower = true;
                    return;
                }
                let svr = this.$http({
                    url: '/hrwa/warule/getById/' + this.pk_wa_wageform,
                    method: 'get'
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }
                    this.hasEditPower = res.data.hasEditPower;
                    if(!this.hasEditPower){
                        this.isEdit = false;
                    }
                    this.data2ui(res.data.data);
                });
                svr.catch(() => {
                    this.$message({
                        message: '信息详情获取失败',
                        type: 'error'
                    });
                });
            },
            data2ui(dbData){
                let mainData = dbData.mainData;
//                this.rulename = mainData.name;
                //不是新增的时候,组织不能编辑
                mainData["pk_org_disabled"] = true;
                let childData = dbData.childData;
                this.addChildItem(childData);
                //主表数据设置到页面
                this.$refs.ref_WageformVO_c.setData(
                    'WageformVO',
                    JSON.parse(JSON.stringify(mainData))
                );
                this.iflddecimal = mainData.iflddecimal;
                //子表数据设置到页面
                this.childVOs = JSON.parse(JSON.stringify(childData));
                //数据备份
                this.baseData = JSON.parse(JSON.stringify(dbData));
            },
            addChildItem(childDatas){
                if (!childDatas || childDatas.length == 0)return;
                for (let i = 0; i < childDatas.length; i++) {
                    childDatas[i].formula = "ASDF";
                    if (!childDatas[i].beanMap) {
                        childDatas[i].beanMap = {};
                    }
                    childDatas[i].beanMap["formula_ref"] = {};
                    childDatas[i].beanMap.formula_ref.ASDF = {};
                    childDatas[i].beanMap.formula_ref.ASDF.id = "ASDF";
                    childDatas[i].beanMap.formula_ref.ASDF.code = childDatas[i].vformula;
                    childDatas[i].beanMap.formula_ref.ASDF.name = childDatas[i].vformulastr;
                }
            },
            // 取消按钮操作
            ruleCancel() {
                this.$refs.ref_WageformVO_c.clearEdit();
                if (this.isNew === true) {
//                    this.$router.push("/hrwa/warule/info");
                    this.$context.getApp().back();
                    return;
                }
                this.isEdit = false;
                this.delRuleRow = [];

                this.childVOs = JSON.parse(JSON.stringify(this.baseData.childData));
                let mainData = this.baseData.mainData;
                this.iflddecimal = mainData.iflddecimal;

                this.$refs.ref_WageformVO_c.setData(
                    'WageformVO',
                    JSON.parse(JSON.stringify(mainData))
                );

            },

            //保存按钮操作
            ruleConfirm() {

                this.$refs.ref_WageformVO_c.validate((valid) => {
                    if (valid && !this.hasFormulaError && !this.hasMoneyError) {
                        this.realSave();
                    } else {

                    }
                });
            },
            //保存按钮操作
            realSave() {
                let mainData = this.$refs.ref_WageformVO_c.getData('WageformVO');
                mainData = JSON.parse(JSON.stringify(mainData));
                let childData = JSON.parse(JSON.stringify(this.childVOs));
                if (this.isNew) {
                    //新增
                    mainData.status = 2;
                } else {
                    //修改
                    mainData.status = 1;
                }
                //子表数据设置状态
                for (let i = 0; i < childData.length; i++) {
                    if (!childData[i].pk_wa_wageformdet) {
                        //新增
                        childData[i].status = 2;
                    } else {
                        //修改
                        childData[i].status = 1;
                    }
                }
                let delRowData = JSON.parse(JSON.stringify(this.delRuleRow));
                for (let j = 0; j < delRowData.length; j++) {
                    if (!delRowData[j].pk_wa_wageformdet) {
                        //没有往DB里保存过的数据，直接忽略
                        continue;
                    } else {
                        //删除
                        delRowData[j].status = 3;
                        childData.push(delRowData[j]);
                    }
                }

                let myself = this;
                let svr = this.$http({
                    url: '/hrwa/warule/save/',
                    method: 'post',
                    data: {main: mainData, child: childData}
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        myself.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }
                    this.delRuleRow = [];
                    this.isNew = false;
                    this.isEdit = false;

                    this.data2ui(res.data.data);
                    this.$refs.ref_WageformVO_c.clearEdit();
                });
                svr.catch(() => {
                    myself.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                });
            },

            //子模板增加数据
            addFormula(){
                //新增行的默认值
                let newData = {};
                newData.nvalue = 0;
                newData.ilevel = this.childVOs.length + 1;
                newData.formula='';
                newData.vformula='';
                newData.vformulastr='';
                this.childVOs.push(newData);
            },

            changeEditStatus(){
                this.isNew = false;
                this.isEdit = true;
            },

            // table行的删除操作
            ruleChildDeleteClick(idx) {
                if (!!this.childVOs[idx].pk_wa_wageformdet) {
                    this.delRuleRow.push(this.childVOs[idx]);
                }
                this.childVOs.splice(idx, 1);
            },
        }
    };
</script>
<style>
    .rule-child-title-xh,
    .rule-child-title {
        color: gray;
        font-weight: normal;
        font-size: 14px;
        padding: 0 28px;
        height: 44px;
        vertical-align: middle;
        box-sizing: border-box;
        line-height: 44px;
    }

    .rule-child-title {
        padding: 0 28px;
        text-align: left;
    }

    .rule-required:before {
        content: '*';
        color: #ff4949;
        margin-right: 4px;
    }
    .rule-child-cell-new,
    .rule-child-title-xh {
        padding: 0px;
        text-align: center;
    }

    .rule-child-cell-new {
        color: #5CB0E6;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        line-height: 44px;
        height: 44px;
        vertical-align: middle;
    }

    .rule-child-cell-new:focus,
    .rule-child-cell-new:hover {
        color: #7dc0eb;
    }

    .rule-child-cell-new:active {
        color: #539ecf;
    }

    .rule-child-cell,
    .rule-child-cell-xh,
    .rule-child-cell-opr {
        height: 44px;
        vertical-align: middle;
        box-sizing: border-box;
        width: 100%;
        position: relative;
        line-height: 44px;
        position: relative;
    }

    .rule-child-cell {
        padding: 0 28px;
        text-align: left;
    }

    .rule-child-cell-xh {
        padding: 0px;
        text-align: center;
    }

    .rule-child-cell-opr {
        padding: 0px;
        text-align: right;
    }

    .rule-child-i {
        color: #5CB0E6;
        font-size: 20px;
        cursor: pointer;
        border-radius: 4px;
        text-align: right;
        width: 20px;
        vertical-align: middle;
    }

    #waruledetailpanel .ifbp-panel-title {
        height: 20px;
    }
    #warulechildpanel .list-cell-error input{
        border-color: #ff4949;
    }
    #warulechildpanel .error-tip{
        color: #ff4949;
        font-size: 12px;
        line-height: 1;
        margin-left:4px;
        padding-top:2px;
    }

</style>
