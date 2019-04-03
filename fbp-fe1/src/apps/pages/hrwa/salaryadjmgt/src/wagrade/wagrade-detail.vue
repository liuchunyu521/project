<template>
    <ifbp-page>
        <!--节点title-->
        <ifbp-breadcrumb :name="isNew ? '新增薪资标准' : '薪资标准详情'"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <!--<div class="operator-container" v-if="isNew">-->
            <!--<div class="f1">-->
                <!--<el-button type="primary" @click="saveHandle(1)">保存</el-button>-->
                <!--<el-button type="default" @click="topCancelHandle">取消</el-button>-->
            <!--</div>-->
        <!--</div>-->
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false" scroll-dom="ifbpScrollDom">
                <div class="ifbp-panel">
                    <div class="ifbp-panel-title">
                        <div class="fl iconleft"><span class="title-sub">基本信息</span><i class="el-icon-edit"
                                                                                       :class="{disabledIcon:isEffect || isUsed}"
                                                                                       v-show="!isNew&&!isMainEdit&&!isChildEdit&&hasEditPower"
                                                                                       @click="mainEditHandle"></i>
                        </div>
                    </div>
                    <!--<div style="width:100%;padding-top:3px;" v-show="!isNew">-->
                        <!--<hr style="height:1px;border:none;border-top:1px solid #E6E6EB;"/>-->
                    <!--</div>-->

                    <div class="ifbp-panel-body">
                        <!-- 主表编辑页签 -->
                        <ifbp-template ref='ref_WaGrade_c'
                                       tpl-id='hrwa_wagrade_detail'
                                       @change="mainFromChangeHandle"
                                       :methods='mainFormMethods'
                                       :computed='mainFormComputed'
                                       :tpl-data='mainFormData'
                                       :editable='isMainEdit'
                                       :form-show-message="isMainEdit"
                                       :tpl-reset-fun='gradeMainResetFun'
                        >
                        </ifbp-template>
                        <div class="form-button-div" v-show="isMainEdit">
                            <el-button type="primary" @click="saveHandleWithCheck(1)" v-if="isNew">保存</el-button>
                            <el-button type="default" @click="topCancelHandle" v-if="isNew">取消</el-button>
                            <el-button type="primary" @click="saveHandleForEdit" v-if="!isNew">保存</el-button>
                            <el-button type="default" @click="cancelHandle" v-if="!isNew">取消</el-button>
                        </div>
                    </div>
                </div>


                <!-- 子区域（薪资标准表） -->
                <div class="ifbp-panel" v-show="!isNew" style="padding-bottom:20px;">
                    <div class="ifbp-panel-title">
                        <div class="fl iconleft">
                            <span class="title-sub">薪资标准表</span>
                            <i class="el-icon-pt-shezhi" v-show="!isMainEdit && !isChildEdit && hasEditPower"
                               :class="{disabledIcon:isEffect||isUsed}" @click="shezhiHandle"></i>
                            <i class="el-icon-edit" v-show="!isMainEdit && !isChildEdit && ctrvisible && hasEditPower"
                               :class="{disabledIcon:isEffect}" @click="childEditHandle"></i>
                        </div>

                        <div class="ifbp-panel-icons-right" style="margin-top:-6px;">
                            <el-button type="primary" @click="addVerHandle" style="margin-left:3px;"
                                       v-if="ctrvisible && !isVerNew && isUsed && isLastVer && isEffect && hasEditPower"
                                       :disabled="isMainEdit || isChildEdit">新增版本
                            </el-button>
                            <el-button type="primary" @click="effectHandle" style="margin-left:10px;"
                                       v-if="!isEffect && ctrvisible && !isVerNew && hasEditPower"
                                       :disabled="isMainEdit || isChildEdit">生效
                            </el-button>
                            <el-button type="primary" @click="cancelEffectHandle" style="margin-left:10px;"
                                       v-else-if="isEffect && ctrvisible && !isVerNew && !isUsed && hasEditPower"
                                       :disabled="isMainEdit || isChildEdit">取消生效
                            </el-button>
                            <el-dropdown v-show="ctrvisible && gradeverDataList.length > 0"
                                         style="width:auto;margin-left: 10px; position: relative; top:3px;" @command="verHandleCommand">
                                <el-button type="default" :disabled="isMainEdit || isChildEdit" style="width:98px;">
                                    <span style="position: relative; bottom: 3px; left: 0px;">{{selvername}}</span>
                                    <span class="el-icon-caret-bottom"
                                                     style="margin-left:0px;padding:0;top:1px;position:relative;"></span>

                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="item.pk_wa_gradever"
                                                      v-for="(item, index) in gradeverDataList"
                                                      style="cursor:default;font-size:14px;">
                                        <!--<span>{{(item.gradever_num + "").slice(-2) == ".0" ? "V" + item.gradever_num : "V" + item.gradever_num + ".0"}}</span>-->
                                        <span>{{getVerName(item.gradever_num + "")}}</span>
                                        <span style="float: right;margin-left:10px;width:35px;color:#FFC107;"
                                              v-if="item.effect_flag">生效</span>
                                        <span style="float: right;margin-left:10px;width:35px;color:#5CB0E6;cursor:pointer;"
                                              :pk="item.pk_wa_gradever" @click.stop="deleteVer" v-show="hasEditPower"
                                              v-else-if="index == (gradeverDataList.length-1) && !item.effect_flag">删除</span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="ifbp-panel-body" v-show="ctrvisible">
                        <br/>
                        <crt-panel ref="crtref" :seclvVos="WaSeclvVO" :prmlvVos="WaPrmlvVO" :isMultsec="isMultsec"
                                   :isRange="isRange" :ctrData="ctrData" :editable="isChildEdit"
                                   :decimals="decimals"></crt-panel>
                        <div class="form-button-div" v-show="isChildEdit">
                            <el-button type="primary" @click="saveCrtHandle">保存</el-button>
                            <el-button type="default" @click="cancelCrtHandle">取消</el-button>
                        </div>
                    </div>
                </div>

            </ifbp-panel-group>
        <!-- 级别档别对话框 -->
            <el-dialog size="tiny" v-model="lvVisible" :close-on-click-modal="false" :show-close="false" id="levelset">

                <el-tabs v-model="activeLvName" v-if="isMultsec" style="height:370px;width:100%">
                    <el-tab-pane label="级别" name="prmlv">
                        <lv-panel ref="prmlvref" lvname="级别" v-model="editWaPrmlvVO"></lv-panel>
                    </el-tab-pane>
                    <el-tab-pane label="档别" name="seclv">
                        <lv-panel ref="seclvref" lvname="档别" v-model="editWaSeclvVO"></lv-panel>
                    </el-tab-pane>
                </el-tabs>
                <lv-panel ref="prmlvref" lvname="级别" v-model="editWaPrmlvVO" v-else style="height:320px;width:100%"></lv-panel>

                <div slot="title"><span class="el-dialog__title">薪资标准表设置</span>
                </div>
                <div slot="footer" class="form-button-div">
                    <el-button type="primary" @click="saveLv">保存</el-button>
                    <el-button type="default" @click="cancelLv">取消</el-button>
                </div>

            </el-dialog>

        </ifbp-main-area>
    </ifbp-page>
</template>
<script>

    import lvPanel from './lv-panel.vue';
    import crtPanel from './crt-panel.vue';

    //中央事件总线
    let bus = new Vue();

    import pageModelMixin from "ifbp-business/pageModelMixin";
    export default {
        mixins: [pageModelMixin],
        components: {
            lvPanel,
            crtPanel,
        },
        data() {
            const vm = this;
            var pk_wa_grd = this.$root.$router.currentRoute.params.id;

            var _isedit = !pk_wa_grd || (this.$root.$router.currentRoute.params.isedit == 1);
            return {
                //是否新增态
                isNew: !pk_wa_grd,
                //是否编辑态
                isEdit: _isedit,
                isMainEdit:false,
                isChildEdit:false,
                //是否生效
                isEffect: false,
                //是否被引用
                isUsed: false,
                //是否多档
                isMultsec:false,
                //是否宽带
                isRange:false,
                //主表主键
                pk_wa_grd: pk_wa_grd,
                //人员级别属性选择的个数
                psnhiCnt:0,
                //人员档别属性选择的个数
                psnhiSecCnt:0,
                //标准表的金额的小数位数
                decimals:2,
                //备份的数据
                baseData: {},
                hasEditPower:false,

                //主模板初期数据
                mainFormData: {
                    WaGrade: {
                        //级别人员属性
                        pk_wa_psnhi: '',
                        //档别人员属性
                        pk_wa_psnhi_seclv: '',
                        //组织可否编辑
                        pk_org_disabled:false,
                    },
                    //档别金额排序方式_可见
                    seclv_money_sort_show: false,
                    //档别人员属性_可见
                    pk_wa_psnhi_seclv_show: false,
                    //是否生效
                    effect_flag: false,
                    rules: {
                        pk_org: [{required: true, message: '所属组织不能为空', trigger: 'blur'}],
                        code: [{required: true, message: '薪资标准编码不能为空', trigger: 'blur'}],
                        name: [{required: true, message: '薪资标准名称不能为空', trigger: 'blur'}],
                        pk_wa_item: [{required: true, message: '薪资项目不能为空', trigger: 'blur'}],
                    }
                },
                //主模板Methods
                mainFormMethods: {
                    ismultsecChangeHandle(event){
                        //平台问题,有时不能触发该事件
                        //档别人员属性_可见控制
                        this.pk_wa_psnhi_seclv_show = event.target.checked;
                        //档别金额排序方式_可见控制
                        this.seclv_money_sort_show = event.target.checked;
                    },
                    psnhiClick(classtype){
                        vm.$router.push("/hrwa/wagrade/psnhidetail/" + this.WaGrade.pk_wa_grd + "/" + classtype);
                    },
                },
                mainFormComputed:{
                    psnhiName:function(){
                        if(!this.WaGrade.pk_wa_psnhi || !this.WaGrade.beanMap){
                            return "";
                        }
                        let refData = this.WaGrade.beanMap['pk_wa_psnhi_ref'];
                        var valueArr = [];
                        var tmp = this.WaGrade.pk_wa_psnhi.split(',');
                        Object.keys(refData).forEach(function (key) {
                            if (tmp.indexOf(key) > -1) {
                                var refObj = refData[key];
                                if (refObj && refObj.name) {
                                    valueArr.push(refObj.name);
                                } else if (refObj && refObj.refname) {
                                    valueArr.push(refObj.refname);
                                }
                            }
                        });
                        return valueArr.join(',');
                    },
                    psnhisecName:function(){
                        if(!this.WaGrade.pk_wa_psnhi_seclv || !this.WaGrade.beanMap){
                            return "";
                        }
                        let refData = this.WaGrade.beanMap['pk_wa_psnhi_seclv_ref'];
                        var valueArr = [];
                        var tmp = this.WaGrade.pk_wa_psnhi_seclv.split(',');
                        Object.keys(refData).forEach(function (key) {
                            if (tmp.indexOf(key) > -1) {
                                var refObj = refData[key];
                                if (refObj && refObj.name) {
                                    valueArr.push(refObj.name);
                                } else if (refObj && refObj.refname) {
                                    valueArr.push(refObj.refname);
                                }
                            }
                        });
                        return valueArr.join(',');
                    },
                },
                //主表模板个性化
                gradeMainResetFun: function ($node) {
                    let $org = $node.find("[prop='pk_org']");
                    if($org.length == 1){
                        $org.children().first().attr(':disabled','WaGrade.pk_org_disabled');
                    }

                    //多档复选框捆绑变更事件
                    var $ismultsec = $node.find("[v-model='WaGrade.ismultsec']");
                    $ismultsec.attr('v-on:change', 'ismultsecChangeHandle');

                    //档别人员属性_可见属性绑定
                    let $pk_wa_psnhi_seclv = $node.find("[prop='pk_wa_psnhi_seclv']");
                    $pk_wa_psnhi_seclv.attr("v-show", "pk_wa_psnhi_seclv_show");
                    //档别金额排序方式_可见属性绑定
                    let $seclv_money_sort = $node.find("[prop='seclv_money_sort']");
                    $seclv_money_sort.attr("v-show", "seclv_money_sort_show");

                    //级别人员属性
                    let $pk_wa_psnhi_ref = $node.find("[prop='pk_wa_psnhi']").children().first();
                    $pk_wa_psnhi_ref.attr("field", "pk_wa_psnhi");
                    $pk_wa_psnhi_ref.attr(":template-value", "WaGrade");
                    $pk_wa_psnhi_ref.attr("pk", "88eee001-1025-4019-9ff2-e7e9f2decf8f");
                    $pk_wa_psnhi_ref.attr("ref-code", "infosetitem");
                    $pk_wa_psnhi_ref.attr("v-model", "WaGrade.pk_wa_psnhi");
                    $pk_wa_psnhi_ref.attr("v-show","editable");
                    let $psnhi_div = $("<div v-show='!editable' class='tpl-label viewrefa'></div>");
                    let $psnhi_a = $("<span title='点击设置人员属性和级别的对应关系' @click='psnhiClick(1)' style='max-width: 180px;overflow: hidden;display: inline-block;text-overflow: ellipsis;'>{{psnhiName}}</span>");
                    $psnhi_div.append($psnhi_a);
                    $pk_wa_psnhi_ref.after($psnhi_div);

                    //档别人员属性
                    let $pk_wa_psnhi_seclv_ref = $node.find("[prop='pk_wa_psnhi_seclv']").children().first();
                    $pk_wa_psnhi_seclv_ref.attr("field", "pk_wa_psnhi_seclv");
                    $pk_wa_psnhi_seclv_ref.attr(":template-value", "WaGrade");
                    $pk_wa_psnhi_seclv_ref.attr("pk", "88eee001-1025-4019-9ff2-e7e9f2decf8f");
                    $pk_wa_psnhi_seclv_ref.attr("ref-code", "infosetitem");
                    $pk_wa_psnhi_seclv_ref.attr("v-model", "WaGrade.pk_wa_psnhi_seclv");
                    $pk_wa_psnhi_seclv_ref.attr("v-show","editable");
                    let $psnhisec_div = $("<div v-show='!editable' class='tpl-label viewrefa'></div>");
                    let $psnhisec_a = $("<span title='点击设置人员属性和档别的对应关系' @click='psnhiClick(2)' style='max-width: 180px;overflow: hidden;display: inline-block;text-overflow: ellipsis;'>{{psnhisecName}}</span>");
                    $psnhisec_div.append($psnhisec_a);
                    $pk_wa_psnhi_seclv_ref.after($psnhisec_div);

                    return $node[0].outerHTML;
                },

                //级别档别设置对话框是否显示
                lvVisible:false,
                //薪级
                WaPrmlvVO:[],
                //薪档
                WaSeclvVO:[],
                //薪级
                editWaPrmlvVO:[],
                //薪档
                editWaSeclvVO:[],
                //薪资标准表数据
                ctrData:{},
                //薪资标准表数据
                gradeverData:{},
                //薪资标准表所有版本数据
                gradeverDataList:[],
                //薪资标设置对话框上活动的页签
                activeLvName:"prmlv",
//                delDialogVisible:false,
                delVerPk:'',
            };
        },
        computed:{
            ctrvisible:function(){
                if(this.isMultsec){
                    return this.WaPrmlvVO.length > 0 && this.WaSeclvVO.length > 0;
                }else{
                    return this.WaPrmlvVO.length > 0;
                }
            },
            selvername:function(){
                if(!this.gradeverData)return "版本";
                if(!this.gradeverData.gradever_num)return "版本";
                var num = parseInt(this.gradeverData.gradever_num,10);
                if(!isNaN(num)){
                    return num + ".0版本";
                }else{
                    if(this.gradeverData.gradever_num.length >= 2) {
                        if(this.gradeverData.gradever_num.slice(-2) ==".0"){
                            return this.gradeverData.gradever_num + "版本";
                        }
                    }
                    return this.gradeverData.gradever_num + ".0版本";
                }
            },
            isVerNew:function(){
                if(!this.gradeverData)return true;
                if(!this.gradeverData.pk_wa_gradever)return true;
                return false;
            },
            isLastVer:function(){
              if(!this.gradeverData || !this.gradeverData.pk_wa_gradever){
                  return true;
              }
              if(!this.gradeverDataList)return true;
              let lastData = this.gradeverDataList[this.gradeverDataList.length - 1];
              if(lastData.pk_wa_gradever == this.gradeverData.pk_wa_gradever){
                  return true;
              }else{
                  return false;
              }
            },
        },
        watch: {
        },
        directives:{
            wrap:function (el, binding) {
                let pp = $(el).find("#prmlvtab");
                $(el).find(".el-dialog__body").append(pp);
                $(el).find(".el-tabs").attr("display","none");
            },
        },
        mounted() {
            this.request();
        },
        methods: {
            getVerName(num){
                var tempnum = parseInt(num,10);
                if(!isNaN(tempnum)){
                    return "V" + tempnum + ".0";
                }else{
                    if(num.length >= 2) {
                        if(num.slice(-2) ==".0"){
                            return "V" + num;
                        }
                    }
                    return "V" + num + ".0";
                }
            },
            mainFromChangeHandle(field, event){
                if(field == "ismultsec"){
                    this.$refs.ref_WaGrade_c.setData('pk_wa_psnhi_seclv_show',event.target.checked);
                    this.$refs.ref_WaGrade_c.setData('seclv_money_sort_show',event.target.checked);
                }
            },
            addVerHandle(){
                //数据备份
                this.ctrDataBase = JSON.parse(JSON.stringify(this.ctrData));
                this.gradeverDataBase = JSON.parse(JSON.stringify(this.gradeverData));
                this.gradeverDataListBase = JSON.parse(JSON.stringify(this.gradeverDataList));

                let maxNum = 0;
                let num;
                for(let i=0;i<this.gradeverDataList.length;i++){
                    num = parseInt(this.gradeverDataList[i].gradever_num,10);
                    if(!isNaN(num) && num > maxNum){
                        maxNum = num;
                    }
                }
                maxNum++;
                this.gradeverData.pk_wa_gradever = null;
                this.gradeverData.status = 2;
                this.gradeverData.gradever_num = maxNum;
                this.gradeverData.gradever_name = maxNum + "";
                this.gradeverData.effect_flag=false;
                this.gradeverDataList.push(this.gradeverData);
                this.isEffect = false;
                this.isChildEdit = true;
            },
            deleteVerClick(){
//                this.delDialogVisible = false;
                let gradeverVO = null;
                let delIdx = -1;
                for(let i=0;i<this.gradeverDataList.length;i++){
                    if(this.gradeverDataList[i].pk_wa_gradever == this.delVerPk){
                        gradeverVO = JSON.parse(JSON.stringify(this.gradeverDataList[i]));
                        delIdx = i;
                        break;
                    }
                }
                if(gradeverVO == null){
                    this.$message({
                        message: '找不到选择的版本数据!',
                        type: 'error'
                    });
                }
                let mainData = this.$refs.ref_WaGrade_c.getData('WaGrade');
                let svr = this.$http({
                    url: '/hrwa/wagrade/deletever',
                    method: 'post',
                    data:{main: mainData, wa_grade_ver: gradeverVO}
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }else{
                        this.gradeverDataList = res.data.wa_grade_ver_list;
                        this.gradeverData = res.data.wa_grade_ver;
                        this.isEffect = this.gradeverData.effect_flag;
                        this.ctrData = res.data.wa_crt;
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            deleteVer(e){
                this.delVerPk = $(e.target).attr("pk");
                if(this.gradeverDataList.length <= 1){
                    this.$message({
                        message: '操作失败,请至少保留一个版本数据!',
                        type: 'error'
                    });
                }else{

                    this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(() => {
                        this.deleteVerClick();
                    }).catch(() => {
                    });
//                    this.delDialogVisible = true;
                }
            },
            // 获取数据
            // 请求职级类别基本信息详情
            initNewData(){
                let svr = this.$http({
                    url: '/hrwa/wagrade/initData',
                    method: 'get'
                });
                svr.then((res) => {
                    this.$refs.ref_WaGrade_c.setData(
                        'WaGrade',
                        JSON.parse(JSON.stringify(res.data.data))
                    );
                });
                svr.catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            request() {
                if (this.isNew) {
                    this.initNewData();
                    this.isMainEdit = true;
                    this.hasEditPower = true;
                    return;
                }
                let myself = this;
                let svr = this.$http({
                    url: '/hrwa/wagrade/getById/' + this.pk_wa_grd,
                    method: 'get'
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        myself.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }
                    myself.hasEditPower = res.data.hasEditPower;
                    if(!myself.hasEditPower){
                        myself.isMainEdit = false;
                        myself.isChildEdit = false;
                    }
                    myself.svrDataToUI(res.data.data);

                    //编辑模式打开页面时,判断哪部分应该编辑
                    if(myself.isEdit){
                        if(myself.WaPrmlvVO != null && myself.WaPrmlvVO.length > 0 && !myself.isEffect){
                            myself.isChildEdit = true;
                        }else if(!myself.isEffect){
                            myself.isMainEdit = true;
                        }
                        myself.isEdit = false;
                    }
                });
                svr.catch(() => {
                    myself.$message({
                        message: '信息详情获取失败',
                        type: 'error'
                    });
                });
            },
            svrDataToUI(svrData){
                let mainData = svrData.mainData;
                //平台问题临时对应
                let psnhiData = svrData.wa_psnhi_h;
                this.gradeverDataList = svrData.wa_grade_ver_list;
                this.gradeverData = svrData.wa_grade_ver;
                this.isMultsec = mainData.ismultsec;
                this.isRange = mainData.isrange;
                this.isEffect = this.gradeverData.effect_flag;
                this.ctrData = svrData.wa_crt;
                this.isUsed = svrData.isused;
                this.decimals = mainData.iflddecimal;
                this.pk_wa_grd = mainData.pk_wa_grd;
                this.gradeverDataListBase = JSON.parse(JSON.stringify(svrData.wa_grade_ver_list));
                this.gradeverDataBase = JSON.parse(JSON.stringify(svrData.wa_grade_ver));
                this.ctrDataBase = JSON.parse(JSON.stringify(svrData.wa_crt));
                if(!!svrData.wa_prmlv){
                    this.WaPrmlvVO = svrData.wa_prmlv;
                    this.editWaPrmlvVO = JSON.parse(JSON.stringify(this.WaPrmlvVO));
                }
                if(!!svrData.wa_seclv){
                    this.WaSeclvVO = svrData.wa_seclv;
                    this.editWaSeclvVO = JSON.parse(JSON.stringify(this.WaSeclvVO));
                }

                //不是新增的时候,组织不能编辑
                mainData["pk_org_disabled"] = true;
                this.setPsnhiData(mainData,psnhiData);
                this.baseData = JSON.parse(JSON.stringify(svrData));
                this.$refs.ref_WaGrade_c.setFormData(mainData);
                this.$refs.ref_WaGrade_c.setData(
                    'effect_flag',
                    this.isEffect
                );

                this.$refs.ref_WaGrade_c.setData(
                    'seclv_money_sort_show',
                    this.isMultsec
                );
                this.$refs.ref_WaGrade_c.setData(
                    'pk_wa_psnhi_seclv_show',
                    this.isMultsec
                );
            },
            topCancelHandle(){
                if (this.isNew === true) {
//                    this.$router.push("/hrwa/wagrade/info");
                    this.$context.getApp().back();
                }
            },
            // 取消按钮操作
            cancelHandle() {
                let mainData = this.baseData.mainData;

                this.isMainEdit = false;
                this.$refs.ref_WaGrade_c.setData(
                    'WaGrade',
                    JSON.parse(JSON.stringify(mainData))
                );

                this.$refs.ref_WaGrade_c.setData(
                    'seclv_money_sort_show',
                    this.isMultsec
                );
                this.$refs.ref_WaGrade_c.setData(
                    'pk_wa_psnhi_seclv_show',
                    this.isMultsec
                );
            },
            comparePKs(pks1, pks2){
                //都没有值时,相等
                if(!pks1 && !pks2){
                  return true;
                }
                if(!pks1 || !pks2){
                    return false;
                }
                let arr1 = pks1.split(",");
                let arr2 = pks2.split(",");
                arr1.sort();
                arr2.sort();
                return arr1.toString() == arr2.toString();
            },
            saveHandleForEdit(){

                let mainData = this.$refs.ref_WaGrade_c.getData('WaGrade');
                let msg = "";
                if(mainData.ismultsec != this.isMultsec || mainData.isrange != this.isRange){
                    msg = "薪资标准表结构发生变化，标准金额将被重置,您需要重新维护各级别/档别的薪资标准金额。";
                }
                let lv = [];
                if(!this.comparePKs(mainData.pk_wa_psnhi, this.baseData.mainData.pk_wa_psnhi)){
                    lv.push("级别");
                }
                if(!this.comparePKs(mainData.pk_wa_psnhi_seclv, this.baseData.mainData.pk_wa_psnhi_seclv)){
                    lv.push("档别");
                }
                if(lv.length > 0){
                    msg = msg + lv.join("和") + "人员属性发生变化，需要重新添加级别人员属性设置数据。";
                }

                if(msg.length > 0){
                    msg = msg + "是否继续?";
                    this.$confirm(msg, "提示", {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        this.saveHandleWithCheck(2);
                    }).catch(() => {
                    });
                    return;
                }
                this.saveHandleWithCheck(2);
            },
            saveHandleWithCheck(mode){
                if(mode == 1 || mode == 2){
                    this.$refs.ref_WaGrade_c.validate((valid) => {
                        if (valid){
                            this.saveHandle(mode);
                        }
                    });
                }
            },

            //保存按钮操作
            saveHandle(mode) {
                let mainData = this.$refs.ref_WaGrade_c.getData('WaGrade');
                let psnhiData=[];
                this.getPsnhiData(mainData,"pk_wa_psnhi",psnhiData);
                this.getPsnhiData(mainData,"pk_wa_psnhi_seclv",psnhiData);
//                let childData = this.$refs.ref_WageformdetVO_l.getData('WageformdetVO_t');
                mainData = JSON.parse(JSON.stringify(mainData));
                psnhiData = JSON.parse(JSON.stringify(psnhiData));
                let prmlvData = this.getPrmlvData();
                let seclvData = this.getSeclvData();
                if (this.isNew) {
                    //新增
                    mainData.status = 2;
                } else {
                    //修改
                    mainData.status = 1;
                }

                let myself = this;
                let svr = this.$http({
                    url: '/hrwa/wagrade/save/',
                    method: 'post',
                    data: {main: mainData, wa_psnhi: psnhiData, wa_prmlv:prmlvData,wa_seclv:seclvData}
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        myself.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }
                    let oldIsNew = myself.isNew;
                    myself.isNew = false;
                    myself.isEdit = false;
                    if(mode == 3){
                        myself.lvVisible = false;
                    }else{
                        myself.isMainEdit = false;
                    }
                    let jbdbChg = res.data.data.mainData.ismultsec != myself.isMultsec
                    myself.svrDataToUI(res.data.data);

                    if(mode == 1){
                        let msg = "薪资标准已经保存,请维护级别信息及薪资标准金额。";
                        if(mainData.ismultsec){
                            msg = "薪资标准已经保存,请维护级别/档别信息及薪资标准金额。";
                        }
                        myself.$alert(msg, '提示', {
                            confirmButtonText: '确定',
                            type:'warning',
                        }).then(() => {
                            myself.$nextTick(() => {myself.lvVisible = true;});
                        });
                    }

                    if(mode == 2 && jbdbChg){
                        myself.$nextTick(() => {myself.lvVisible = true;});
                    }
                    this.$refs.ref_WaGrade_c.clearEdit();
                });
                svr.catch(() => {
                    myself.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                });
            },

            getPsnhiData(mainData,item,array){
                let values = mainData[item];
                if(!values)return;
                let valueArray = values.split(",");
                let classtype = item=="pk_wa_psnhi" ? 1:2;
                for(let i = 0; i< valueArray.length; i++){
                    let value = valueArray[i];
                    if(value == "")continue;
                    let selItem = mainData.beanMap[item+"_ref"];
                    let selBean = selItem[value];
                    let itemData ={classtype:classtype,pk_flddict:selBean.id,vfldcode:selBean.item_code,vfldname:selBean.item_name,status:2};
                    array.push(itemData);
                }
            },
            setPsnhiData(mainData,psnhiData){
                if(psnhiData == null || psnhiData == "")return;
                let psnhiPks =  [];
                let psnhiSeclvPks = [];
                mainData.beanMap.pk_wa_psnhi_ref={};
                mainData.beanMap.pk_wa_psnhi_seclv_ref={};
                let psnhiRef = mainData.beanMap.pk_wa_psnhi_ref;
                let psnhiSeclvRef = mainData.beanMap.pk_wa_psnhi_seclv_ref;

                for(let i = 0;i<psnhiData.length;i++){
                    let psnhiItem = psnhiData[i];
                    if(!psnhiItem.classtype)continue;
                    if(psnhiItem.classtype == 1){
                        psnhiPks.push(psnhiItem.pk_flddict);
                        psnhiRef[psnhiItem.pk_flddict]={};
                        psnhiRef[psnhiItem.pk_flddict].id=psnhiItem.pk_flddict;
                        psnhiRef[psnhiItem.pk_flddict].code=psnhiItem.vfldcode;
                        psnhiRef[psnhiItem.pk_flddict].name=psnhiItem.vfldname;
                        psnhiRef[psnhiItem.pk_flddict].item_code=psnhiItem.vfldcode;
                        psnhiRef[psnhiItem.pk_flddict].item_name=psnhiItem.vfldname;
                        psnhiRef[psnhiItem.pk_flddict].pk_infoset_item=psnhiItem.pk_flddict;
                    }else{
                        psnhiSeclvPks.push(psnhiItem.pk_flddict);
                        psnhiSeclvRef[psnhiItem.pk_flddict]={};
                        psnhiSeclvRef[psnhiItem.pk_flddict].id=psnhiItem.pk_flddict;
                        psnhiSeclvRef[psnhiItem.pk_flddict].code=psnhiItem.vfldcode;
                        psnhiSeclvRef[psnhiItem.pk_flddict].name=psnhiItem.vfldname;
                        psnhiSeclvRef[psnhiItem.pk_flddict].item_code=psnhiItem.vfldcode;
                        psnhiSeclvRef[psnhiItem.pk_flddict].item_name=psnhiItem.vfldname;
                        psnhiSeclvRef[psnhiItem.pk_flddict].pk_infoset_item=psnhiItem.pk_flddict;
                    }
                }
                mainData.pk_wa_psnhi=psnhiPks.toString();
                mainData.pk_wa_psnhi_seclv=psnhiSeclvPks.toString();
                this.psnhiCnt = psnhiPks.length;
                this.psnhiSecCnt = psnhiSeclvPks.length;
            },
            getPrmlvData(){
                let delVOs = new Array();
                for(let i=0;i<this.WaPrmlvVO.length;i++){
                    let has = false;
                    for(let j=0;j<this.editWaPrmlvVO.length;j++){
                        if(this.WaPrmlvVO[i].levelname == this.editWaPrmlvVO[j].levelname){
                            this.editWaPrmlvVO[j] = JSON.parse(JSON.stringify(this.WaPrmlvVO[i]));
                            has = true;
                        }
                    }
                    if(!has){
                        let prmlvVO = JSON.parse(JSON.stringify(this.WaPrmlvVO[i]));
                        prmlvVO.status = 3;
                        delVOs.push(prmlvVO);
                    }
                }
                for(let i=0;i < this.editWaPrmlvVO.length;i++){
                    this.editWaPrmlvVO[i].displayindex = i +1;
                    if(!this.editWaPrmlvVO[i].pk_wa_prmlv){
                        this.editWaPrmlvVO[i].status = 2;
                    }else{
                        this.editWaPrmlvVO[i].status = 1;
                    }
                }

                let lastPrmlvVOs = JSON.parse(JSON.stringify(this.editWaPrmlvVO));
                for(let i=0;i<delVOs.length;i++){
                    lastPrmlvVOs.push(delVOs[i]);
                }

                return lastPrmlvVOs;
            },
            getSeclvData(){

                let delVOs = new Array();
                if(!this.isMultsec){
                    for(let i=0;i<this.WaSeclvVO.length;i++){
                        let seclvVO = JSON.parse(JSON.stringify(this.WaSeclvVO[i]));
                        seclvVO.status = 3;
                        delVOs.push(seclvVO);
                    }
                    return delVOs;
                }
                for(let i=0;i<this.WaSeclvVO.length;i++){
                    let has = false;
                    for(let j=0;j<this.editWaSeclvVO.length;j++){
                        if(this.WaSeclvVO[i].levelname == this.editWaSeclvVO[j].levelname){
                            this.editWaSeclvVO[j] = JSON.parse(JSON.stringify(this.WaSeclvVO[i]));
                            has = true;
                        }
                    }
                    if(!has){
                        let seclvVO = JSON.parse(JSON.stringify(this.WaSeclvVO[i]));
                        seclvVO.status = 3;
                        delVOs.push(seclvVO);
                    }
                }
                for(let i=0;i < this.editWaSeclvVO.length;i++){
                    this.editWaSeclvVO[i].displayindex = i +1;
                    if(!this.editWaSeclvVO[i].pk_wa_seclv){
                        this.editWaSeclvVO[i].status = 2;
                    }else{
                        this.editWaSeclvVO[i].status = 1;
                    }
                }
                let lastSeclvVOs = JSON.parse(JSON.stringify(this.editWaSeclvVO));
                for(let i=0;i<delVOs.length;i++){
                    lastSeclvVOs.push(delVOs[i]);
                }
                return lastSeclvVOs;
            },
            childEditHandle(){

                if(this.isEffect){
                    let msg = null;
                    msg = "已生效的薪资标准不允许修改，请取消生效后再进行修改。";
//                    if(this.isUsed){
//                        msg = "该薪资标准已被引用，不允许修改。";
//                    }else{
//                        msg = "已生效的薪资标准不允许修改，请取消生效后再进行修改。";
//                    }
                    this.$alert(msg, '提示', {
                        confirmButtonText: '确定',
                        type:'warning',
                    });
                    return;
                }
                //数据备份
                this.ctrDataBase = JSON.parse(JSON.stringify(this.ctrData));
                this.gradeverDataBase = JSON.parse(JSON.stringify(this.gradeverData));
                this.gradeverDataListBase = JSON.parse(JSON.stringify(this.gradeverDataList));
                this.isChildEdit = true;
            },
            mainEditHandle(){
                if(this.isEffect || this.isUsed){
                    let msg = null;
                    if(this.isUsed){
                        if(this.isMultsec){
                            msg = "该薪资标准已被引用，不允许修改基本信息及级别/档别信息。";
                        }else{
                            msg = "该薪资标准已被引用，不允许修改基本信息及级别信息。";
                        }
                    }else{
                        msg = "已生效的薪资标准不允许修改基本信息，请取消生效后再进行基本信息设置。";
                    }
                    this.$alert(msg, '提示', {
                        confirmButtonText: '确定',
                        type:'warning',
                    });
                    return;
                }

                this.isMainEdit = true;
            },

            setClientData(data, key, value){
                if (data != null && data !== undefined && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i][key] = value;
                    }
                }
            },
            shezhiHandle(){
                if(this.isEffect || this.isUsed){
                    let msg = null;
                    if(this.isUsed){
                        if(this.isMultsec){
                            msg = "该薪资标准已被引用，不允许修改基本信息及级别/档别信息。";
                        }else{
                            msg = "该薪资标准已被引用，不允许修改基本信息及级别信息。";
                        }
                    }else{
                        if(this.isMultsec){
                            msg = "已生效的薪资标准不允许修改级别/档别信息，请取消生效后再进行级别/档别信息设置。";
                        }else{
                            msg = "已生效的薪资标准不允许维护级别信息，请取消生效后再进行级别信息设置。";
                        }
                    }
                    this.$alert(msg, '提示', {
                        confirmButtonText: '确定',
                        type:'warning',
                    });
                    return;
                }
                this.editWaPrmlvVO = JSON.parse(JSON.stringify(this.WaPrmlvVO));
                this.editWaSeclvVO = JSON.parse(JSON.stringify(this.WaSeclvVO));
              this.lvVisible = true;
            },
            addRemlv(){
                this.WaPrmlvVO.push({});
            },
            delRemlv(index){
                this.WaPrmlvVO.splice(index, 1);
            },
            addSeclv(){
                this.WaSeclvVO.push({});
            },
            delSeclv(index){
                this.WaSeclvVO.splice(index, 1);
            },
            cancelLv(){
                let WaPrmlvVO = this.baseData.wa_prmlv;
                let WaSeclvVO = this.baseData.wa_seclv;
                this.lvVisible = false;
            },
            saveLv(){
                let lvArrays = new Array();
                for(let i=0;i<this.editWaPrmlvVO.length;i++){
                    if(!this.editWaPrmlvVO[i].levelname){
                        this.$alert("名称不能为空！", "提示", {
                            confirmButtonText: "确定",
                            type:"warning",
                        });
                        return;
                    }
                    for(let j=0;j<lvArrays.length;j++){
                        if(this.editWaPrmlvVO[i].levelname == lvArrays[j]){
                            this.$alert("级别名称[" + lvArrays[j] + "]存在重复,不能保存！", "提示", {
                                confirmButtonText: "确定",
                                type:"warning",
                            });
                            return;
                        }
                    }
                    lvArrays.push(this.editWaPrmlvVO[i].levelname);
                }

                if(lvArrays.length == 0){
                    this.$alert("必须填写级别！", "提示", {
                        confirmButtonText: "确定",
                        type:"warning",
                    });
                    return;
                }

                if(this.isMultsec){
                    lvArrays = new Array();
                    for(let i=0;i<this.editWaSeclvVO.length;i++){
                        if(!this.editWaSeclvVO[i].levelname){
                            this.$alert("名称不能为空！", "提示", {
                                confirmButtonText: "确定",
                                type:"warning",
                            });
                            return;
                        }
                        for(let j=0;j<lvArrays.length;j++){
                            if(this.editWaSeclvVO[i].levelname == lvArrays[j]){
                                this.$alert("档别名称[" + lvArrays[j] + "]存在重复,不能保存！", "提示", {
                                    confirmButtonText: "确定",
                                    type:"warning",
                                });
                                return;
                            }
                        }
                        lvArrays.push(this.editWaSeclvVO[i].levelname);
                    }

                    if(lvArrays.length == 0){
                        this.$alert("你选择了多档，请填写档别信息！", "提示", {
                            confirmButtonText: "确定",
                            type:"warning",
                        });
                        return;
                    }
                }
                this.saveHandle(3);
            },
            effectHandle(){
              this.effect(true);
            },
            cancelEffectHandle(){
                this.effect(false);
            },
            cancelCrtHandle(){

                this.ctrData = JSON.parse(JSON.stringify(this.ctrDataBase));
                this.gradeverData = JSON.parse(JSON.stringify(this.gradeverDataBase));
                this.gradeverDataList = JSON.parse(JSON.stringify(this.gradeverDataListBase));
                this.isEffect = this.gradeverData.effect_flag;
                this.isChildEdit = false;
            },

            saveCrtHandle(){
                let mainData = this.$refs.ref_WaGrade_c.getData('WaGrade');
                mainData = JSON.parse(JSON.stringify(mainData));
                let gradeverVO = JSON.parse(JSON.stringify(this.gradeverData));
                let curCtrData = this.$refs.crtref.getEditCtrData();
                let resultMsgs = this.validateCrtRange(curCtrData);
                if(resultMsgs.length > 0){
                    const h = this.$createElement;
                    let arrayR = [];
                    for(let i=0;i<resultMsgs.length;i++){
                        arrayR.push(h("p",null,resultMsgs[i]));
                    }
                    this.$msgbox({
                        title: '错误提示',
                        message: h('p', null,arrayR)
                    });
                    return;
                }

                //级别金额排序
                let prmlv_money_sort = mainData.prmlv_money_sort;
                //档别金额排序
                let seclv_money_sort = mainData.seclv_money_sort;

                let criterionvos = new Array();
                for (let i = 0; i < this.WaPrmlvVO.length; i++) {
                    let pk_wa_prmlv = this.WaPrmlvVO[i].pk_wa_prmlv;
                    criterionvos[i] = curCtrData[pk_wa_prmlv];
                }

                const MoneyUpType = 1;
                const MoneyDownType = 2;
                let warningMsg = "";
                // 级别升序，档别升序
                if (MoneyUpType == prmlv_money_sort
                    && MoneyUpType == seclv_money_sort) {
                    warningMsg = this.validatePrmUpSecUp(criterionvos);
                }
                // 级别升序，档别降序
                else if (MoneyUpType == prmlv_money_sort
                    && MoneyDownType == seclv_money_sort) {
                    warningMsg = this.validatePrmUpSecDown(criterionvos);
                }
                // 级别降序，档别降序
                else if (MoneyDownType == prmlv_money_sort
                    && MoneyDownType == seclv_money_sort) {
                    warningMsg = this.validatePrmDownSecDown(criterionvos);
                }
                // 级别降序，档别升序
                else if (MoneyDownType == prmlv_money_sort
                    && MoneyUpType == seclv_money_sort) {
                    warningMsg = this.validatePrmDownSecUp(criterionvos);
                }

                let pk_wa_gradever = gradeverVO.pk_wa_gradever;
                if(!pk_wa_gradever){
                    this.$confirm('是否将当前标准表设置为"生效"？生效之后不允许再修改薪资标准信息。', '提示', {
                        confirmButtonText: '生效',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        gradeverVO.effect_flag=true;
                        this.realSaveCrtHandle(mainData,gradeverVO, curCtrData, warningMsg);
                    }).catch(() => {
                        gradeverVO.effect_flag=false;
                        this.realSaveCrtHandle(mainData,gradeverVO, curCtrData, warningMsg);
                    });
                }else{
                    this.realSaveCrtHandle(mainData,gradeverVO, curCtrData, warningMsg);
                }

            },

            realSaveCrtHandle(mainData,gradeverVO, curCtrData, warningMsg){

                let svr = this.$http({
                    url: '/hrwa/wagrade/saveGradeVer/',
                    method: 'post',
                    data: {main: mainData, wa_grade_ver: gradeverVO, wa_crt:curCtrData}
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }

                    let mainData = this.$refs.ref_WaGrade_c.getData('WaGrade');
                    mainData.ts=res.data.ts;
                    this.$refs.ref_WaGrade_c.setData('WaGrade',mainData);

                    this.gradeverDataList = res.data.wa_grade_ver_list;
                    this.gradeverData = res.data.wa_grade_ver;
                    this.isEffect = this.gradeverData.effect_flag;
                    this.ctrData = res.data.wa_crt;

                    this.isChildEdit = false;

                    if(warningMsg != ""){
                        this.$confirm(warningMsg, '提示', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            type: 'warning'
                        })
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                });
            },

            //宽带薪酬基准值不能低于下限值且不得高于上限值
            validateCrtRange(ctrData){
                let errs =[];
                //非宽带薪酬不校验
                if(!this.isRange){
                    return errs;
                }
                for (let i = 0; i < this.WaPrmlvVO.length; i++) {
                    let pk_wa_prmlv = this.WaPrmlvVO[i].pk_wa_prmlv;
                    let criterionvos = ctrData[pk_wa_prmlv];
                    for(let j = 0; j < criterionvos.length; j++){
                        let dblMin = parseFloat(criterionvos[j].min_value);
                        let dblBasic = parseFloat(criterionvos[j].criterionvalue);
                        let dblMax = parseFloat(criterionvos[j].max_value);
                        dblMin = isNaN(dblMin) ? 0 : dblMin;
                        dblBasic = isNaN(dblBasic) ? 0 : dblBasic;
                        dblMax = isNaN(dblMax) ? 0 : dblMax;

                        if (dblMin > dblBasic) {
                            errs.push((i + 1) + "行/ " + (j + 1) + "列 ：[下限值"
                                + dblMin + "] 不能大于 [基准值 "
                                + dblBasic + "]");
                        } else if (dblBasic > dblMax) {
                            errs.push((i + 1) + "行/" + (j + 1) + "列 ：[基准值"
                                + dblBasic + "] 不能大于 [上限值 "
                                + dblMax + "]");
                        }
                    }
                }
                return errs;
            },


            /**
             * 级别升序，档别升序的情况<BR>
             * 1 | 2 | 3 |<BR>
             * ----|----|----|---<BR>
             * 4 | 5 | 6 |<BR>
             * ----|----|----|---<BR>
             * 5 | 6 | 7 |<BR>
             * ----|----|----|---<BR>
             */
            validatePrmUpSecUp(criterionvos){
                let dblAftBasicValue,dblDownBasicValues,dblUpBasicValues,dblBefBasicValue,criterionvalue;
                let labelArray = new Array();
                let prmlvFlag = false;
                let seclvFlag = false;
                for (let i = 0; i < criterionvos.length; i++) {
                    for (let j = 0; j < criterionvos[i].length; j++) {
                        criterionvalue = parseFloat(criterionvos[i][j].criterionvalue);
                        criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblAftBasicValue=dblDownBasicValues = criterionvalue;
                        if (i != 0) {
                            criterionvalue = parseFloat(criterionvos[i-1][j].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblUpBasicValues = criterionvalue;
                            if (dblDownBasicValues < dblUpBasicValues && !prmlvFlag) {
                                labelArray.push("级别金额未严格按照升序排列。");
                                prmlvFlag = true;
                            }
                        }

                        if (j != 0) {
                            criterionvalue = parseFloat(criterionvos[i][j-1].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblBefBasicValue = criterionvalue;

                            if (dblAftBasicValue < dblBefBasicValue && !seclvFlag) {
                                labelArray.push("档别金额未严格按照升序排列。");
                                seclvFlag = true;
                            }
                        }
                    }
                }
               return labelArray.join("");
            },

            /**
             * 级别升序，档别降序的情况<BR>
             * 3 | 2 | 1 |<BR>
             * ----|----|----|---<BR>
             * 6 | 5 | 4 |<BR>
             * ----|----|----|---<BR>
             * 9 | 8 | 7 |<BR>
             * ----|----|----|---<BR>
             */
            validatePrmUpSecDown(criterionvos){
                let dblAftBasicValue,dblDownBasicValues,dblUpBasicValues,dblBefBasicValue,criterionvalue;
                let labelArray = new Array();
                let prmlvFlag = false;
                let seclvFlag = false;
                for (let i = 0; i < criterionvos.length; i++) {
                    for (let j = 0; j < criterionvos[i].length; j++) {
                        criterionvalue = parseFloat(criterionvos[i][j].criterionvalue);
                        criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                        dblAftBasicValue=dblDownBasicValues = criterionvalue;


                        if (i != 0) {
                            criterionvalue = parseFloat(criterionvos[i-1][j].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblUpBasicValues = criterionvalue;
                            if (dblDownBasicValues < dblUpBasicValues && !prmlvFlag) {
                                labelArray.push("级别金额未严格按照升序排列。");
                                prmlvFlag = true;
                            }
                        }

                        if (j != 0) {
                            criterionvalue = parseFloat(criterionvos[i][j-1].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblBefBasicValue = criterionvalue;

                            if (dblBefBasicValue < dblAftBasicValue && !seclvFlag) {
                                labelArray.push("档别金额未严格按照降序排列。");
                                seclvFlag = true;
                            }

                        }
                    }
                }
                return labelArray.join("");
            },

            /**
             * 级别降序，档别降序的情况<BR>
             * 9 | 8 | 7 |<BR>
             * ----|----|----|---<BR>
             * 6 | 5 | 4 |<BR>
             * ----|----|----|---<BR>
             * 3 | 2 | 1 |<BR>
             * ----|----|----|---<BR>
             */
            validatePrmDownSecDown(criterionvos){
                let dblAftBasicValue,dblDownBasicValues,dblUpBasicValues,dblBefBasicValue,criterionvalue;
                let labelArray = new Array();
                let prmlvFlag = false;
                let seclvFlag = false;
                for (let i = 0; i < criterionvos.length; i++) {
                    for (let j = 0; j < criterionvos[i].length; j++) {
                        criterionvalue = parseFloat(criterionvos[i][j].criterionvalue);
                        criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                        dblAftBasicValue=dblDownBasicValues = criterionvalue;
                        if (i != 0) {
                            criterionvalue = parseFloat(criterionvos[i-1][j].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblUpBasicValues = criterionvalue;
                            if (dblUpBasicValues < dblDownBasicValues && !prmlvFlag) {
                                labelArray.push("级别金额未严格按照降序排列。");
                                prmlvFlag = true;
                            }
                        }
                        if (j != 0) {
                            criterionvalue = parseFloat(criterionvos[i][j-1].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblBefBasicValue = criterionvalue;
                            if (dblBefBasicValue < dblAftBasicValue && !seclvFlag) {
                                labelArray.push("档别金额未严格按照降序排列。");
                                seclvFlag = true;
                            }
                        }
                    }
                }
                return labelArray.join("");
            },

            /**
             * 级别降序，档别升序的情况<BR>
             * 5 | 6 | 7 |<BR>
             * ----|----|----|---<BR>
             * 4 | 5 | 6 |<BR>
             * ----|----|----|---<BR>
             * 3 | 4 | 5 |<BR>
             * ----|----|----|---<BR>
             */
            validatePrmDownSecUp(criterionvos){
                let dblAftBasicValue,dblDownBasicValues,dblUpBasicValues,dblBefBasicValue,criterionvalue;
                let labelArray = new Array();
                let prmlvFlag = false;
                let seclvFlag = false;
                for (let i = 0; i < criterionvos.length; i++) {
                    for (let j = 0; j < criterionvos[i].length; j++) {
                        criterionvalue = parseFloat(criterionvos[i][j].criterionvalue);
                        criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                        dblAftBasicValue=dblDownBasicValues = criterionvalue;

                        if (i != 0) {
                            criterionvalue = parseFloat(criterionvos[i-1][j].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblUpBasicValues = criterionvalue;
                            if (dblUpBasicValues < dblDownBasicValues && !prmlvFlag) {
                                labelArray.push("级别金额未严格按照降序排列。");
                                prmlvFlag = true;
                            }

                        }
                        if (j != 0) {
                            criterionvalue = parseFloat(criterionvos[i][j-1].criterionvalue);
                            criterionvalue = isNaN(criterionvalue) ? 0 : criterionvalue;
                            dblBefBasicValue = criterionvalue;
                            if (dblAftBasicValue < dblBefBasicValue && !seclvFlag) {
                                labelArray.push("档别金额未严格按照升序排列。");
                                seclvFlag = true;
                            }
                        }
                    }
                }
                return labelArray.join();
            },

            handleCommand(classtype){
                location.hash = "/hrwa/wagrade/psnhidetail/" + this.pk_wa_grd + "/" + classtype;
            },
            verHandleCommand(pk_wa_gradever){
                let myself = this;
                let url = "/hrwa/wagrade/selver/" + pk_wa_gradever;
                let svr = this.$http({
                    url: url,
                    method: 'get'
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }else{
                        this.ctrData = res.data.data;
                        for(let i=0;i<this.gradeverDataList.length;i++){
                            if(pk_wa_gradever==this.gradeverDataList[i].pk_wa_gradever){
                                this.gradeverData = JSON.parse(JSON.stringify(this.gradeverDataList[i]));
                                this.isEffect = this.gradeverData.effect_flag;
                            }
                        }
                    }
                });
                svr.catch(() => {
                    myself.$message({
                        message: '操作发生异常!',
                        type: 'error'
                    });
                });
            },

            effect(flag){
                let mainData = this.$refs.ref_WaGrade_c.getData('WaGrade');
                let gradeverVO = JSON.parse(JSON.stringify(this.gradeverData));
                gradeverVO.effect_flag = flag;
                //let url = "/hrwa/wagrade/effect?pk_wa_grd=" + this.pk_wa_grd + "&pk_wa_gradever=" + this.gradeverData.pk_wa_gradever + "&effect_flag=" + flag;
                let svr = this.$http({
                    url: "/hrwa/wagrade/effect",
                    method: 'post',
                    data: {main: mainData, wa_grade_ver: gradeverVO}
                });
                svr.then((res) => {
                    if (res.data.status == false) {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        return;
                    }else{
                        this.gradeverDataList = res.data.wa_grade_ver_list;
                        this.gradeverData = res.data.wa_grade_ver;
                        this.isEffect = this.gradeverData.effect_flag;
                        this.ctrData = res.data.wa_crt;
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: '操作发生异常!',
                        type: 'error'
                    });
                });
            },
        }
    };
</script>
<style>
    .main-container-def {
        position: relative;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 20px 20px 0px 20px;
        background: #FFF;
    }
    #levelset .el-tabs>div {
        margin-left: 0px!important;
    }
    /*#levelset .el-dialog__body{*/
         /*padding: 0px 20px;*/
     /*}*/
    /*#levelset .el-dialog__header{*/
        /*padding:20px 0px 0px;*/
    /*}*/
    /*#levelset .el-dialog__title{*/
        /*padding-left:20px;*/
    /*}*/
    /*#levelset .el-dialog__footer{*/
        /*padding: 10px 0px 15px;*/
    /*}*/
    .disabledIcon{
        color: #75787B!important;
    }
    .viewrefa{
        white-space: nowrap;
        padding-bottom: 8px;
        padding-top: 8px;
        line-height: 16px;
        font-size: 14px;
        vertical-align: top;
        display: inline-block;
        color:#5CB0E6;
        text-decoration:underline;
        cursor:pointer;
    }

</style>
