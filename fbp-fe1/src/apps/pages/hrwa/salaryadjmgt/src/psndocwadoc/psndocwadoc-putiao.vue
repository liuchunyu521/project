<template>
    <ifbp-page>
        <ifbp-breadcrumb name="薪资普调"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <div class="salary_Spectrum">
                <el-steps :space="100" :active="active" finish-status="success" >
                    <el-step title="设置规则"></el-step>
                    <el-step title="结果确认"></el-step>
                </el-steps>
            </div>
            <ifbp-panel-group :navbar="false">
                <ifbp-panel id="rulePanel" v-show="rulePanelShow">
                    <ifbp-template ref="ref_ruleitem_c"
                                   tpl-id="headPanel"
                                   :editable="true"
                                   :tpl-data="ruleData"
                                   :tplResetFun="ruleResetFun"
                                   :methods="ruleFormMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>

                <ifbp-panel id="jdbPanel" title="级别档别调整" v-show="jdbPanelShow">
                    <ifbp-template tpl-id="bodyPanel"
                                   ref="ref_jdb_c"
                                   :tpl-data="jdbData"
                                   :tplResetFun="jdbResetFun"
                                   :methods="jdbFormMethods"
                                   :editable="true"
                    >
                    </ifbp-template>
                </ifbp-panel>

                <ifbp-panel id="sgPanel" title="手工调整" v-show="sgPanelShow">
                    <!--复制DOM begin-->
                    <div class="handSalary_wrap">
                        <div class="handSalary_content clearfix">
                            <div class="handSalary_content_left clearfix">
                                <div class="clearfix">
                                    <span class="handSalary_content_money">金额：</span>
                                    <textarea  rows="9" cols="76" style="height: 202px;border-radius: 4px;border: none;border: 1px solid #D2D2D7; float: left;" v-model="textareaData"></textarea>
                                </div>
                                <div class="handSalary_content_reasons">
                                    说明：公式内容只支持由半角字符{()0-9+-*/[原薪资额]}组成的表达式。例如：(10+20)*8-[原薪资额]
                                </div>
                            </div>
                            <div class="handSalary_content_right">
                                <div style="width: 288px;" class="clearfix">
                                    <div class="handSalary_content_computed" @click="selectionValue(item.content)" :style="{background:item.background,color:item.color}" v-for="item in calculatorData">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--复制DOM over-->
                </ifbp-panel>

                <ifbp-panel id="resultPanel" v-show="resultPanelShow">
                    <ifbp-template ref="ref_result_l"
                                   tpl-id="resultList"
                                   show-type="table"
                                   :editable="true"
                                   :table-show-menu="false"
                                   :column-use-cache="false"
                                   :tpl-data="resultData"
                                   :tplResetFun="resultResetFun"
                                   :methods="resultMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
            </ifbp-panel-group>

            <ifbp-footer>
                <el-button @click="exit">取消</el-button>
                <el-button type="default" @click="prev" v-show="isTrueprev">上一步</el-button>
                <el-button type="primary" @click="next" v-show="isTruenext">下一步</el-button>
                <el-button type="primary" @click="submit" v-show="isTruesubmit">完成</el-button>
            </ifbp-footer>
        </ifbp-main-area>
    </ifbp-page>
</template>

<script>


   // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins: [pageModelMixin],
        data() {
            var vm = this;
            return {
                active: 1,
                isTruenext: true,//显示下一步按钮
                isTrueprev: false,//上一步
                isTruesubmit: false,//隐藏完成按钮
                //规则
                rulePanelShow: true,
                jdbPanelShow: false,
                sgPanelShow: false,
                resultPanelShow: false,

                adjustData: null,//调整规则数据
                // ifbp-panel-group所需参数
                scrollDom: "ifbpScrollDom",
                // UI模板所需参数
                // pk_temprule: "0001AA100000000039AL",
                // pk_tempresult: "0001AA100000000039BX",
                // pk_tempjdb: "0001AA100000000039CN",
                // pk_tempsub: "0001AA1000000001EOV5",
                pk_tempsg: "",
                ruleData: {
                    //FIXME 后续根据当前登录用户和集团取控制权限的话，就不需要这个传集团组织的主键了
                    waitemparams: {
                        pk_org: "",
                        pk_group: "",
                    },
                    wagrdparams: {
                        pk_wa_item: "",
                    }
                },

                calculatorData:[
                    {
                        content:"(",
                        background:"#DBDBDB",
                        color: "#333333"
                    },
                    {
                        content:")",
                        background:"#DBDBDB",
                        color: "#333333"
                    },{
                        content:"{",
                        background:"#DBDBDB",
                        color: "#333333"
                    },{
                        content:"}",
                        background:"#DBDBDB",
                        color: "#333333"
                    },{
                        content:"7",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"8",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"9",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"/",
                        background:"#DBDBDB",
                        color: "#333333"
                    },{
                        content:"4",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"5",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"6",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"*",
                        background:"#DBDBDB",
                        color: "#333333"
                    },{
                        content:"1",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"2",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"3",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"-",
                        background:"#DBDBDB",
                        color: "#333333"
                    },{
                        content:"0",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:".",
                        background:"#F5F5F5",
                        color: "#333333"
                    },{
                        content:"原金额",
                        background:"#3896FC",
                        color: "#fff"
                    },{
                        content:"+",
                        background:"#DBDBDB",
                        color: "#333333"
                    }

                ],
                textareaData:"",
                jdbData: {
                    adjust_direction_ismust:true,
                    adjust_direction_sec_ismust:true,
                    adjust_level_sec_ismust:false,
                    adjust_level_ismust:false,


                },
                jdbResetFun:function ($node) {
                    //级别调整方向
                    let $adjust_direction_lab = $node.find("[prop='adjust_direction']");
                    $adjust_direction_lab.attr(":required","adjust_direction_ismust");

                    let $adjust_direction = $node.find("[v-model='jdb.adjust_direction']");
                    $adjust_direction.attr("v-on:change","adjustDirectionChange");

                    //档别调整方向
                    let $adjust_direction_sec_lab = $node.find("[prop='adjust_direction_sec']");
                    $adjust_direction_sec_lab.attr(":required","adjust_direction_sec_ismust");

                    let $adjust_direction_sec = $node.find("[v-model='jdb.adjust_direction_sec']");
                    $adjust_direction_sec.attr("v-on:change","adjustDirectionSecChange");

                    let $adjust_level_lab = $node.find("[prop='adjust_level']");
                    $adjust_level_lab.attr(":required","adjust_level_ismust");

                    let $adjust_level = $node.find("[v-model='jdb.adjust_level']");
                    $adjust_level.attr(":disabled","!adjust_level_ismust");

                    let $adjust_level_sec_lab = $node.find("[prop='adjust_level_sec']");
                    $adjust_level_sec_lab.attr(":required","adjust_level_sec_ismust");

                    let $adjust_level_sec = $node.find("[v-model='jdb.adjust_level_sec']");
                    $adjust_level_sec.attr(":disabled","!adjust_level_sec_ismust");

                    let $isoverprmlv = $node.find("[v-model='jdb.isoverprmlv']");
                    $isoverprmlv.attr(":disabled","!adjust_level_sec_ismust");

                },
                jdbFormMethods: {
                    adjustDirectionChange(val){
                        vm.$refs.ref_jdb_c.getFormComp().clearErrorMessage();
                        if (val) {
                            this.adjust_level_ismust = true;
                            this.adjust_direction_sec_ismust = false;
                        }else{
                            let temp = vm.$refs.ref_jdb_c.getFormData().adjust_direction_sec;
                            if(!temp){
                                this.adjust_direction_ismust = true;
                                this.adjust_direction_sec_ismust = true;
                            }
                            this.adjust_level_ismust = false;
//                            this.adjust_direction_sec_ismust = true;
                        }
                        vm.$refs.ref_jdb_c.getFormData().adjust_level=null;
                    },
                    adjustDirectionSecChange(val){
                        vm.$refs.ref_jdb_c.getFormComp().clearErrorMessage();
                        if (val){
                            this.adjust_level_sec_ismust=true;
                            this.adjust_direction_ismust=false
                        }else{
                            let temp = vm.$refs.ref_jdb_c.getFormData().adjust_direction;
                            if(!temp){
                                this.adjust_direction_ismust = true;
                                this.adjust_direction_sec_ismust = true;
                            }
                            this.adjust_level_sec_ismust=false;
                        }
                        vm.$refs.ref_jdb_c.getFormData().adjust_level_sec=null;
                        vm.$refs.ref_jdb_c.getFormData().isoverprmlv=null;
                    }
                },
                ruleResetFun: function ($node) {
                    var $pk_wa_item = $node.find("[v-model='dtrule.pk_wa_item']");
                    $pk_wa_item.attr('v-on:trigger', 'waItemChange');

                    var $pk_wa_grd = $node.find("[v-model='dtrule.pk_wa_grd']");
                    $pk_wa_grd.attr('v-on:trigger', 'wagrdChange');

                    var $main_adjust_type = $node.find("[v-model='dtrule.main_adjust_type']");
                    $main_adjust_type.attr('v-on:change', 'adjustTypeChange');
                    return $node[0].outerHTML;
                },
                ruleFormMethods: {
                    adjustTypeChange(val){
                        if (parseInt(val) == 2) {
                            vm.sgPanelShow = false;
                            vm.jdbPanelShow = true;
                        } else if(parseInt(val) == 1){
                            vm.jdbPanelShow = false;
                            vm.sgPanelShow = false;
                        }else if(parseInt(val) == 3){
                            vm.jdbPanelShow = false;
                            vm.sgPanelShow = true;
                        }else{
                            vm.jdbPanelShow = false;
                            vm.sgPanelShow = false;
                        }
                    },
                    waItemChange(type,val){
                        if(val.value[0]){
                            this.wagrdparams = {"pk_wa_item":val.value[0].id};
                        }else{
                            this.wagrdparams = {"pk_wa_item":null};
                        }
                        vm.$refs.ref_ruleitem_c.comp.$refs.ref_pk_wa_grd.reset();
                    },
                    wagrdChange(type,val){
                        let adjustOptionsVar = [];
                        if(!val.value[0]){
                            return;
                        }
                        if(val.value[0].isrange=="否"){
                            adjustOptionsVar=[{
                                value:1,
                                label:"按照最新的薪资标准调整薪资金额"
                            },{
                                value:2,
                                label:"按照级别档别进行调整"
                            }]
                        }else{
                            adjustOptionsVar=[{
                                value:3,
                                label:"手工调整"
                            }]
                        }
                        vm.sgPanelShow = false;
                        vm.jdbPanelShow = false;
                        vm.$refs.ref_ruleitem_c.setData("adjustOptionsVar",adjustOptionsVar);
                        vm.$refs.ref_ruleitem_c.getFormData().main_adjust_type=null;

                    }
                },
                resultData: {
//                    moneyeditable:false
                },

                resultResetFun: function ($node) {
                    var $table = this.getTableDom($node);
                    $table.attr(":border", true);
                    $table.attr(":height", "450");
                    $table.append(
                        '<el-table-column  render-type="money" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="change_money" label="调整金额" width="120" format=""></el-table-column>'
                        + '<el-table-column label="调整前" align = "center">'
                            + '<el-table-column  sortable render-type="default" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="crt_name_old"  label="调整前标准" width="150" format=""></el-table-column>'
                            + '<el-table-column  sortable render-type="money" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="grade_money_old" label="标准金额" width="120" format=""></el-table-column>'
                            + '<el-table-column  sortable render-type="money" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="money_old" label="金额" width="100" format=""></el-table-column>'
                        + '</el-table-column>'
                        + '<el-table-column label="调整后" align = "center">'
//                        + '<el-table-column  render-type="default" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="negotiation" label="谈判工资" width="150" format="">'
//                        + '<template scope="scope">'
//                        + '<el-checkbox v-model="scope.row.negotiation" @change="clickChanged"></el-checkbox>'
//                        + '</template> '
//                        + '</el-table-column>'
                            + '<el-table-column  sortable render-type="default" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="crt_name_adjust"  label="调整后标准" width="150" format=""></el-table-column>'
                            + '<el-table-column  sortable render-type="money" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="grade_money_adjust"  label="标准金额" width="120" format=""></el-table-column>'
                            + '<el-table-column  sortable render-type="money" separator="," :multiply="false" symbol="￥" align="left" header-align="left" prop="money_adjust" label="金额" width="100" format=""></el-table-column>'
//                        + '<template scope="scope">'
//                        + '<el-input type="money" :decimals="2":comma="true" v-model="scope.row.money_adjust" :editable="scope.row.negotiation"> </el-input>'
//                        + '</template> '
                        + '</el-table-column>'
                    );
                    return $node[0].outerHTML;
                },
                resultMethods: {
                    clickChanged(val){
//                        this.moneyeditable = val.target.checked;
                    }
                }
            };
        },
        mounted() {

        },
        methods: {
            selectionValue(data){
                if(data=="原金额"){
                    this.textareaData+="[原薪资额]";
                }else{
                    this.textareaData+=data;
                }
            },
            prev(){
                this.active = 1;
                this.resultPanelShow = false;
                this.rulePanelShow = true;
                this.isTruenext = true;//隐藏下一步按钮
                this.isTrueprev = false;//显示上一步
                this.isTruesubmit = false;//显示完成按钮
                let value = this.$refs.ref_ruleitem_c.getFormData().main_adjust_type;
                if (parseInt(value) == 2) {
                    this.sgPanelShow = false;
                    this.jdbPanelShow = true;
                } else if(parseInt(value) == 1){
                    this.jdbPanelShow = false;
                    this.sgPanelShow = false;
                }else if(parseInt(value) == 3){
                    this.jdbPanelShow = false;
                    this.sgPanelShow = true;
                }else{
                    this.jdbPanelShow = false;
                    this.sgPanelShow = false;
                }
            },
            next() {
                this.$refs.ref_ruleitem_c.validate((valid) => {
                    if (valid) {
                        let data = this.$refs.ref_ruleitem_c.getFormData();
                        //FIXME 级别档别调整，手工调整
                        let reqdata = {"base": data};

                        if (this.jdbPanelShow) {
                            let flag = false;

                            this.$refs.ref_jdb_c.validate((valid) => {

                                if (!valid) {
                                    flag=true;
                                    return false;
                                }
                            });
                            if(flag){
                                return ;
                            }
                            let jdbdata = this.$refs.ref_jdb_c.getFormData();
                            reqdata["jibie"] = jdbdata;
                        }
                        if(this.sgPanelShow){
                            reqdata["shoug"]={"textareaData":this.textareaData};
                        }
                        this.adjustData = reqdata;
                        this.$http({
                            url: "/hrwa/psndocwadoc/queryWadoc4Adjust",
                            method: "post",
                            data: JSON.parse(JSON.stringify(reqdata)),
                            params:{"searchdto":sessionStorage.getItem("psndocwadocSearchDto")}
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    //表单校验通过后进行下一步操作，改变状态，以及显示完成按钮；隐藏下一步按钮
                                    this.active = 2;
                                    this.rulePanelShow = false;
                                    this.jdbPanelShow = false;
                                    this.sgPanelShow = false;
                                    this.resultPanelShow = true;
                                    this.isTruenext = false;//隐藏下一步按钮
                                    this.isTrueprev = true;//显示上一步
                                    this.isTruesubmit = true;//显示完成按钮
                                    this.$refs.ref_result_l.setTableData(res.data.data);
                                    this.$refs.ref_ruleitem_c.clearEdit();
                                    this.$refs.ref_jdb_c.clearEdit();
                                    let rows = res.data.data;
                                    let vmthis = this;
                                    setTimeout(function () {
                                        rows.forEach(function (row) {
                                            vmthis.$refs.ref_result_l.getTableComp().toggleRowSelection(row, true)
                                        });
                                    }, 300);

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
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                });

            },
            exit(){
                this.$context.getApp().back();
                // this.$router.push("/hrwa/psndocwadoc");
            },
            submit(){
                let seldata = this.$refs.ref_result_l.getTableComp().getSelection();
                let data = {"adjustrule": this.adjustData, "wadoc": seldata};
                this.$http({
                    url: "/hrwa/psndocwadoc/saveAdjustWadoc",
                    method: "post",
                    data: JSON.parse(JSON.stringify(data))
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.$context.getApp().back();
                            // this.$router.push("/hrwa/psndocwadoc");

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
        }
    };
</script>
<style scoped>
    /*必须写的样式样式*/
    .salary_Spectrum {
        width: 100%;
        padding-top: 30px;
        background: #fff;
        text-align: center;
    }
     .handSalary_wrap {
         background: #fff;
     }
    .handSalary_tittle {
        text-indent: 20px;
        line-height: 56px;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        border-bottom: 1px solid #D1DAE4;
    }
    .handSalary_content {
        padding: 20px;
    }
    .clearfix:after{
        display: block;
        clear: both;
        content:"";
    }
    .handSalary_content_left{
        float: left;
        margin-left: 130px;
        margin-right: 20px;
    }
    .handSalary_content_right{
        float: left;

    }
    .handSalary_content_money{
        font-family: "微软雅黑";
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 14px;
        margin-right: 10px;
        float: left;
    }
    .handSalary_content_reasons {
        font-family: "微软雅黑";
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 14px;
        margin-right: 10px;
        margin-top: 20px;
    }
    .handSalary_content_computed {
        float: left;
        width: 60px;
        height: 34px;
        margin-right: 10px;
        /*border: 1px solid  #D2D2D7;*/
        margin-bottom: 10px;
        text-align: center;
        line-height: 34px;
        cursor: pointer;

    }
    .handSalary_content_computed:hover {
        transform: scale(1.1);
    }

</style>
