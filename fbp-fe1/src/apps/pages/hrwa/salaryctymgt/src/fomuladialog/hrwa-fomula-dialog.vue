<template>
        <div id="hrwafomuladialog">
            <div class="layout-top">
                <!-- textarea -->
                <div class="fomula-textarea-and-btns">
                    <el-input ref="fomulaTextarea"
                              class="fomula-textarea"
                              type="textarea"
                              :rows="10"
                              v-model="fomulaStr"
                              resize="none"
                              @blur="textareaBlur">
                    </el-input>
                    <div class="fomula-textarea-btns">
                        <el-button @click="ifClick" v-show="!fromWaRule">如果</el-button>
                        <el-button @click="thenClick" v-show="!fromWaRule">则</el-button>
                        <el-button @click="elseClick" v-show="!fromWaRule">否则</el-button>
                        <el-button @click="andClick">并且</el-button>
                        <el-button @click="orClick">或者</el-button>
                        <el-button @click="textareaValidate">验证</el-button>
                        <el-button @click="recover" v-show="fromPayItem">恢复默认</el-button>
                        <el-checkbox disabled v-show="fromPayItem"  v-model="isUserDef" style="margin-left: 16px;">自定义公式</el-checkbox>
                        <el-button type="primary" @click="textareaConfirm" style="margin-left: 16px;">确定</el-button>
                        <el-button @click="textareaCancel">取消</el-button>
                    </div>
                </div>
                <!-- calculator -->
                <div class="fomula-calculator">
                    <!-- numbers -->
                    <div class="fomula-calculator-numbers">
                        <div v-for="(row, rowIndex) in calcNumbers" :key="rowIndex" class="row">
                            <span v-for="(item, index) in row" :key="index" :span="6" @click="numberClick(item)">{{ item }}</span>
                        </div>
                    </div>

                    <!-- operators -->
                    <div class="fomula-calculator-operators">
                        <div v-for="(row, rowIndex) in calcOperators" :key="rowIndex" class="row" >
                            <span v-for="(item, index) in row" :key="index" :span="6" @click="calculatorClick(item)">{{ item }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <el-row :gutter="16" class="fomula-tpls-and-dbrelated">
                <!-- 公式模板 -->
                <el-col :span="12">
                    <el-tabs v-if="fomulaTpls && fomulaTpls.length" type="border-card" class="fomula-tpls" id="tabfunc">
                        <el-tab-pane v-for="(tplTab, tabIndex) in fomulaTpls" :key="tabIndex"
                                     v-if="tplTab.show"
                                     :label="tplTab.typeName">
                            <ul>
                                <li v-for="(fomula, fomulaIndex) in tplTab.fomulaItems" :key="fomulaIndex"
                                    :class="{ 'fomula-tpl-current': currentFomulaTpl === fomula }"
                                    @click="fomulaTplClick(fomula)"
                                    @dblclick="fomulaTplDblClick(fomula,tplTab.typeName)">
                                    {{ fomula.displayName }}
                                </li>
                            </ul>
                        </el-tab-pane>
                    </el-tabs>
                    <div v-else class="fomula-no-result">未获取到公式模板</div>
                </el-col>
                <!-- 数据库相关 -->
                <el-col :span="12">
                    <el-tabs v-if="databaseTables" type="border-card" class="fomula-dbrelated">
                        <!-- 表和字段相关 -->
                        <el-tab-pane v-if="databaseTables && databaseTables.length" label="表和字段">
                            <el-row class="fomula-tables-and-fields">
                                <!-- 表 -->
                                <el-col :span="12" class="fomula-tables">
                                    <ul>
                                        <li v-for="(table, tableIndex) in databaseTables"
                                            :key="tableIndex"
                                            v-if="table.displayName"
                                            :class="{'fomula-table-current': currentTable === table}"
                                            @click="tableClick(table)">
                                            {{ table.displayName }}
                                        </li>
                                    </ul>
                                </el-col>
                                <el-col :span="12" class="fomula-fields">
                                    <ul v-if="tableFields && tableFields.length">
                                        <li v-for="(field, fieldIndex) in tableFields"
                                            :key="fieldIndex"
                                            @click="fomulaTplClick(field)"
                                            @dblclick="fieldDblClick(field)">
                                            {{ field.displayName }}
                                        </li>
                                    </ul>
                                    <div v-else class="fomula-no-result__inner">请选择表</div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                    <div v-else class="fomula-no-result">未获取到表和字段相关信息</div>
                </el-col>
            </el-row>
            <div class="fomula-tips">{{ fomulaTips }}</div>
            <el-ref :ref-code="item"
                    field="pk_item"
                    :pk="pk"
                    v-show="false"
                    :ref="item"
                    @trigger="handleRefTrigger"
                    :query-params="queryParamsRef"
                    :not-leaf-selectable="true"
                    :template-value="refTemplateValue"  v-for="(item, idx) in refcodes">
            </el-ref>
            <span v-show="false">{{lastValue}}</span>
            <adjust-date-dialog ref="adjustDateDialog"
            :from="queryParams.from" :pk_org="pk_org"
                                :inputSig="curInputSig"
            @paraSel="insertContent"></adjust-date-dialog>
            <wage-days-dialog ref="wageDaysDialog"
                                :inputSig="curInputSig"
                                @paraSel="insertContent"></wage-days-dialog>
            <tax-rate-dialog ref="taxRateDialog"
                             :pk_org="pk_org"
                              :inputSig="curInputSig"
                              :queryParams="queryParams"
                              @paraSel="insertContent"></tax-rate-dialog>
        </div>
    <!-- </el-dialog> -->
 </template>
 <script>
     import adjustDateDialog from './pre-adjust-date-dialog.vue';
     import wageDaysDialog from './wage-days-dialog.vue';
     import taxRateDialog from './tax-rate-dialog.vue';
     export default {
         components: {
             adjustDateDialog,
             wageDaysDialog,
             taxRateDialog,
         },
         name: 'hrwaFomulaDialog',
         props: ['refCode', 'field', 'templateValue', 'isMutiSelect', 'queryParams'],
         data() {
             return {
                 // 公式结果字符串
                 fomulaStr: '',
                 //是否自定义公式
                 isUserDef:true,
                 sysfomulamap:[],
                 // 计算器数字
                 calcNumbers: [
                     ['7', '8', '9', '0'],
                     ['4', '5', '6', '.'],
                     ['1', '2', '3', '00']
                 ],
                 // 计算器操作符
                 calcOperators: [
                     ['+', '-', '*', '/'],
                     ['<>', '=', '(', ')'],
                     ['<', '>', '<=', '>=']
                 ],
                 refTemplateValue: {
                     beanMap: {
                         pk_item_ref: {},
                     },
                     pk_item: '',

                 },
                 refcode: '',
                 pk: '',
                 queryParamsRef: {
                     typeId: '',
                     pk_wa_grd: '',
                 },
                 // 当前光标起始和结束位置
                 selectionStartIndex: 0,
                 selectionEndIndex: 0,
                 // 用于防止 textarea@focus 光标自动移动至末尾
                 focusTimer: null,
                 curInputSig:'',

                 // 公式模板
                 fomulaTpls: [],
                 // 当前注释
                 fomulaTips: null,
                 // 当前选中的模板 (用于高亮显示)
                 currentFomulaTpl: null,

                 // 表体 tab 对象
                 database: null,
                 // 表和字段 tab 中的表数组
                 databaseTables: [],
                 // 表和字段 tab 中的字段数组
                 tableFields: null,
                 // 当前 table
                 currentTable: null,
                 refcodes:[],
                 refcodeMap:{},
                 enumparaMap:{},
                 selectedData:[
                     {
                         id:"ASDF",
                         code:"",
                         name:"",
                     },
                 ],
             };
         },
         computed: {
             fromWaRule:function(){
                 return this.queryParams.from == 1;
             },
             fromPayItem:function(){
                 return this.queryParams.from == 2;
             },
             fromWaItem:function(){
                 return this.queryParams.from == 3;
             },
             pk_org:function(){
                 if(this.queryParams.from == 2){
                     return this.queryParams.context.pk_org;
                 }else if(this.queryParams.from == 3){
                     return this.$context.getFbpGroupPk();
                 }else{
                     return '';
                 }
             },
             lastValue:function(){
                 if(!this.templateValue[this.field]){
                     this.fomulaStr = "";
                     return "";
                 }
                 let fomulaRef = this.templateValue.beanMap[this.field + "_ref"];
                 if(!fomulaRef){
                     this.fomulaStr = "";
                     return "";
                 }
                 let selData = fomulaRef[this.templateValue[this.field]];
                 if(!selData){
                     this.fomulaStr = "";
                     return "";
                 }
                 if(!selData.name){
                     this.fomulaStr = "";
                 }else{
                     this.fomulaStr = selData.name;
                 }
                 return selData.name;
             }
         },
         watch: {
             fomulaStr(newVal){
                 if(!this.fromPayItem){
                     return;
                 }
                 let itemkey = this.queryParams.itemkey;
                 if(itemkey!="f_1" && itemkey!="f_2" && itemkey!="f_3" && itemkey!="f_4" && itemkey!="f_5" ){
                     this.isUserDef = true;
                     return;
                 }
                 let key = this.queryParams.context.pk_org + this.queryParams.context.pk_wa_class
                     + this.queryParams.context.cyear + this.queryParams.context.cperiod + this.queryParams.itemkey;
                 if(!!this.sysfomulamap[key]){
                     if($.trim(newVal) == $.trim(this.sysfomulamap[key])){
                         this.isUserDef = false;
                     }else{
                         this.isUserDef = true;
                     }
                     return;
                 }
                 let url = "/hrwa/payitemfomula/getDefaultFormula?"
                     + "pk_org=" + this.queryParams.context.pk_org + "&pk_wa_class=" + this.queryParams.context.pk_wa_class
                     + "&cyear=" + this.queryParams.context.cyear + "&cperiod=" + this.queryParams.context.cperiod
                     + "&itemkey=" + this.queryParams.itemkey;

                 this.$http({
                     url:url,
                     method: "get",
                 })
                     .then(res => {
                         if (res.data.status === true) {
                             this.sysfomulamap[key] = res.data.data;
                             if($.trim(newVal) == $.trim(res.data.data)){
                                 this.isUserDef = false;
                             }else{
                                 this.isUserDef = true;
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
                             message: "获取默认公式失败",
                             type: "error"
                         });
                     });
             },
             lastValue(newVal) {
                 this.fomulaStr = this.lastValue;
             },
         },

         created() {
             this.initDialog();
         },
         methods: {
             /* eslint-disable no-undef */
             initDialog() {
                 // 光标移动到末尾
                 this.setSelectionByIndex();
                 // 获取模板数据
                 this.getFomulaTpls();
                 // 获取表列表数据
                 this.getDatabaseTables();
             },
             dialogCancel() {
                 this.$emit('cancel');
             },
             dialogConfirm() {
                 this.$emit('confirm', this.fomulaStr);
             },

             ifClick(){
                 this.insertContent(" 如果 ");
             },
             thenClick(){
                 this.insertContent(" 则 ");
             },
             elseClick(){
                 this.insertContent(" 否则 ");
             },
             andClick(){
                 this.insertContent(" 并且 ");
             },
             orClick(){
                 this.insertContent(" 或者 ");
             },
             /**
              * textarea 部分
              */
             // 点击确定
             textareaConfirm() {

                 let url = "";
                 if(this.fromWaRule){
                     url = "/hrwa/warulefomula/ok";
                 }else if(this.fromPayItem){
                     url = "/hrwa/payitemfomula/ok";
                 }else{
                     url = "/hrwa/waitemfomula/ok";
                 }

                 this.$http({
                     url: url,
                     method: "post",
                     data: {formula: this.fomulaStr, fomulaTpls: this.fomulaTpls,databaseTables:this.databaseTables}
                 })
                     .then(res => {
                         if (res.data.status === true) {
                             this.selectedData[0].code= res.data.data;
                             this.selectedData[0].name=this.fomulaStr;
                             this.$emit('customRefConfirm', this.selectedData);
                         } else {
                             this.$message({
                                 message: res.data.msg,
                                 type: "error"
                             });
                         }
                     })
                     .catch(() => {
                         this.$message({
                             message: "公式验证失败!",
                             type: "error"
                         });
                     });
             },
             // 点击取消
             textareaCancel() {
                 this.$emit('customRefCancel');
             },
             recover(){
                 let itemkey = this.queryParams.itemkey;
                 if(itemkey!="f_1" && itemkey!="f_2" && itemkey!="f_3" && itemkey!="f_4" && itemkey!="f_5" ){
                     return;
                 }
                 let key = this.queryParams.context.pk_org + this.queryParams.context.pk_wa_class
                     + this.queryParams.context.cyear + this.queryParams.context.cperiod + this.queryParams.itemkey;
                 let url = "/hrwa/payitemfomula/getDefaultFormula?"
                         + "pk_org=" + this.queryParams.context.pk_org + "&pk_wa_class=" + this.queryParams.context.pk_wa_class
                         + "&cyear=" + this.queryParams.context.cyear + "&cperiod=" + this.queryParams.context.cperiod
                     + "&itemkey=" + this.queryParams.itemkey;

                 this.$http({
                     url:url,
                     method: "get",
                 })
                     .then(res => {
                         if (res.data.status === true) {
                             this.sysfomulamap[key] = res.data.data;
                             this.fomulaStr = res.data.data;
                         } else {
                             this.$message({
                                 message: res.data.msg,
                                 type: "error"
                             });
                         }
                     })
                     .catch(() => {
                         this.$message({
                             message: "获取默认公式失败",
                             type: "error"
                         });
                     });
             },
             // 点击验证
             textareaValidate() {

                 let url = "";
                 if(this.fromWaRule){
                     url = "/hrwa/warulefomula/validate";
                 }else if(this.fromPayItem){
                     url = "/hrwa/payitemfomula/validate";
                 }else{
                     url = "/hrwa/waitemfomula/validate";
                 }
                 this.$http({
                     url: url,
                     method: "post",
                     data: {formula: this.fomulaStr, fomulaTpls: this.fomulaTpls,databaseTables:this.databaseTables}
                 })
                     .then(res => {

                         if (res.data.status === true) {
                             this.$message({
                                 message: res.data.msg,
                                 type: "info"
                             });
                         } else {
                             this.$message({
                                 message: res.data.msg,
                                 type: "error"
                             });
                         }
                     })
                     .catch(() => {
                         this.$message({
                             message: "公式校验失败!",
                             type: "error"
                         });
                     });
                 return false;
             },
             // 点击全选
             textareaSelectAll() {
                 const textareaEle = this.$refs.fomulaTextarea.$refs.textarea;
                 // textareaEle.focus();
                 this.setSelectionByIndex(0, this.fomulaStr.length, textareaEle);
                 // this.$refs.fomulaTextarea.$refs.input.focus();
             },
             // 点击清空
             textareaClearAll() {
                 this.fomulaStr = '';
                 this.setSelectionByIndex();
             },

             // textarea blur 事件
             textareaBlur(event) {
                 this.setSelectionByIndex(event.target.selectionStart, event.target.selectionEnd);
             },
             // 设置光标位置
             setSelectionByIndex(start, end, ele) {
                 // 如果传入对象, 就设置对象的选中值, 否则设置组件的当前选中位置
                 const startIndex = typeof start === 'number' ? start : this.fomulaStr.length;
                 const endIndex = typeof end === 'number' ? end : this.fomulaStr.length;
                 if (!ele) {
                     this.selectionStartIndex = startIndex;
                     this.selectionEndIndex = endIndex;
                     return;
                 }

                 // 防止光标移动至textarea末尾
                 this.focusTimer = setTimeout(() => {
                     if (this.focusTimer) {
                         clearTimeout(this.focusTimer);
                         this.focusTimer = null;
                     }
                     if (typeof ele.select === 'function') {
                         ele.select();
                     }
                     ele.selectionStart = startIndex;
                     ele.selectionEnd = endIndex;
                 }, 0);
             },
             // 插入内容
             insertContent(str, ele) {
                 // 获取 textarea dom 元素
                 ele = ele || this.$refs.fomulaTextarea.$refs.textarea;

                 // 不传入对象, 设置当前组件值
                 if (ele && typeof window.setRangeText === 'function') {
                     ele.setRangeText(str);
                 } else {
                     const prefixStr = this.fomulaStr.substring(0, this.selectionStartIndex);
                     const suffixStr = this.fomulaStr.substring(this.selectionEndIndex);
                     this.fomulaStr = prefixStr + str + suffixStr;
                 }
                 this.selectionStartIndex += str.length;
                 this.selectionEndIndex = this.selectionStartIndex;
                 this.setSelectionByIndex(this.selectionStartIndex, this.selectionStartIndex, ele);
             },

             /**
              * 计算器部分
              */
             // 点击数字
             numberClick(val){
                 this.insertContent(val);
             },
             // 点击操作符
             calculatorClick(val) {
                 this.insertContent(" " + val + " ");
             },

             /**
              * 模板部分
              */
             // 获取模板数据
             getFomulaTpls() {
                 let url = "";
                 if(this.fromWaRule){
                     url = "/hrwa/warulefomula/getFomulatpls";
                 }else if(this.fromPayItem){
                     url = "/hrwa/payitemfomula/getFomulatpls";
                 }else{
                     url = "/hrwa/waitemfomula/getFomulatpls";
                 }

                 this.$http({
                     url:url,
                     method: "get",
                 })
                     .then(res => {

                         if (res.data.status === true) {
                             this.fomulaTpls = res.data.data;
                         } else {
                             this.$message({
                                 message: res.data.msg,
                                 type: "error"
                             });
                         }
                     })
                     .catch(() => {
                         this.$message({
                             message: "未传入获取模板函数",
                             type: "error"
                         });
                     });
             },
             // 点击模板
             fomulaTplClick(fomula) {
                 this.currentFomulaTpl = fomula;
                 this.fomulaTips = fomula.hintMsg ? fomula.hintMsg : null;
             },
             // 双击模板
             fomulaTplDblClick(fomula,typename) {
                 if(!this.fromWaRule && typename == "薪资函数"){
                     let itemtype = this.queryParams.iitemtype;
                     if(itemtype == undefined || itemtype == -1 || itemtype == fomula.returnType){
                         this.insertContentTpl(fomula);
                     }else{
                         let itemTypeName = "数值型";
                         if(fomula.returnType == 1)itemTypeName = "字符型";
                         if(fomula.returnType == 2)itemTypeName = "日期型";
                         let msg = "公式返回类型为：" + itemTypeName + ",与项目数据类型不一致,请修改";
                         this.$alert(msg, "提示", {
                             confirmButtonText: "确定",
                             type:"warning",
                         });
                     }

                 }else{
                     this.insertContentTpl(fomula);
                 }
             },
             insertContentTpl(fomula){
                 if(fomula.code=="preAdjustDate"){
                     this.curInputSig = fomula.inputSig;
                     this.$nextTick(function(){
                         this.$refs.adjustDateDialog.show();
                     });
                 }else if(fomula.code=="wageDays"){
                     this.curInputSig = fomula.inputSig;
                     this.$nextTick(function(){
                         this.$refs.wageDaysDialog.show();
                     });
                 }else if(fomula.code=="taxRate"){
                     this.curInputSig = fomula.inputSig;
                     this.$nextTick(function(){
                         this.$refs.taxRateDialog.show();
                     });
                 }else{
                     this.insertContent(fomula.inputSig);
                 }
             },
             // field 双击事件
             fieldDblClick(field) {
                 if (!field.refCode) {
                     this.insertContent(field.inputSig);
                 } else {
                     this.refPreValue = field.inputSig;
                     this.refcode = field.refCode;
                     if (field.refCode == "enum") {
                         this.queryParamsRef.typeId = field.typeId;
                     } else if (field.refCode == "hrwa_prmlv" || field.refCode == "hrwa_seclv") {
                         this.queryParamsRef.pk_wa_grd = field.typeId;
                     }
                     let vm = this;
                     this.$nextTick(function () {
                         vm.$refs[field.refCode][0].showDialog();
                     });
                 }
 //                this.insertContent(val);
             },
             handleRefTrigger(type, data) {
                 // 点击事件触发时 type 为 change
                 if (type === 'change') {
                     let name = "";
                     if(data.value[0].refname == undefined){
                         name = data.value[0].name;
                     }else{
                         name = data.value[0].refname;
                     }
                     if(this.refPreValue == "[人员工作信息.部门]"){
                         name += "(" + data.value[0].orgname + ")(" + data.value[0].refcode + ")";
                     }
                     if(this.refPreValue == "[人员工作信息.岗位]"){
                         name += "(" + data.value[0].dept_name + ")(" + data.value[0].refcode + ")";
                     }
                     this.insertContent(this.refPreValue + ' = "' + name + '"');
                 }
             },
             // 获取表列表数据
             getDatabaseTables() {
                 this.refcodes = [];
                 this.refcodeMap = {};
                 this.enumparaMap = {};
                 let url = "";
                 if(this.fromWaRule){
                     url = "/hrwa/warulefomula/getDatabaseTables";
                 }else if(this.fromPayItem){
                     url = "/hrwa/payitemfomula/getDatabaseTables";
                 }else{
                     url = "/hrwa/waitemfomula/getDatabaseTables";
                 }

                 this.$http({
                     url:url,
                     method: "get",
                 })
                     .then(res => {
                         if (res.data.status === true) {
                             this.databaseTables = res.data.data;
                             for(let i=0;i<this.databaseTables.length;i++){
                                 this.getTableFields(this.databaseTables[i].displayName);
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
                             message: "获取表列表失败",
                             type: "error"
                         });
                     });
             },

             getTableFields(tablename){
                 let url = "";
                 if(this.fromWaRule){
                     url = "/hrwa/warulefomula/getTableFields?tablename="+tablename;
                 }else if(this.fromPayItem){
                     url = "/hrwa/payitemfomula/getTableFields?tablename="+tablename
                         + "&pk_org=" + this.queryParams.context.pk_org + "&pk_wa_class=" + this.queryParams.context.pk_wa_class
                         + "&cyear=" + this.queryParams.context.cyear + "&cperiod=" + this.queryParams.context.cperiod;
                 }else{
                     url = "/hrwa/waitemfomula/getTableFields?tablename="+tablename;
                 }
                 this.$http({
                     url:encodeURI(url),
                     method: "get",
                 })
                     .then(res => {
                         if (res.data.status === true) {
                             for(let i=0;i<this.databaseTables.length;i++){
                                 let table = this.databaseTables[i];
                                 if(table.displayName == tablename){
                                     table.tableFields = res.data.data;
                                     this.setRelateTableData(this.databaseTables);
                                     break;
                                 }
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
                             message: "获取表列表字段失败",
                             type: "error"
                         });
                     });
             },

             setRelateTableData(tables){
                 this.refcodes = [];
                 this.refcodeMap = {};
                 this.enumparaMap = {};
                 if(tables == undefined || tables == null || tables.length == 0){return this.refcodeMap;}
                 for(let i = 0; i<tables.length;i++){
                     let fields = !tables[i] ? null : tables[i].tableFields;
                     if(fields == undefined || fields == null || fields.length == 0){
                         continue;
                     }
                     for(let j = 0; j < fields.length; j++){
                         let field = fields[j];
                         if(!field || !field.refCode){continue;}
                         this.refcodeMap[field.code] = field.refCode;
                         let has = false;
                         for(let k=0;k<this.refcodes.length;k++){
                             if(this.refcodes[k] == field.refCode){
                                 has = true;
                                 break;
                             }
                         }
                         if(!has){
                             this.refcodes.push(field.refCode);
                         }
                         if("enum" == field.refCode){
                             this.enumparaMap[field.code] = field.typeId;
                         }
                     }
                 }
             },
             // 点击表选项
             tableClick(table) {
                 this.tableFields = table.tableFields;
                 this.currentTable = table;
             },

             preLogicConvertor(formula){
                 return formula.replace(/\s并且\s/g, " && ").replace(/\s或者\s/g, " || ");
             },

             preIIfConvertor(formula){
                 if (formula.indexOf("否则") == -1) {
                     return formula;
                 }
                 let words = formula.split(/如果|则|否则/);
                 let convertStatck = [];
                 for (let i = 0; i < words.length; i++) {
                     if (!!words[i]) {
                         convertStatck.push(words[i]);
                     }
                 }
                 let sbd = "";
                 while (true) {
                     let elseresult = convertStatck.pop();
                     let ifresult = convertStatck.pop();
                     let condition = convertStatck.pop();
                     let temp = " iif(" + condition + "," + ifresult + "," + elseresult + ")";

                     if (convertStatck.length == 0) {
                         sbd += temp;
                         break;
                     }

                     convertStatck.push(temp);
                 }

                 return sbd;
             },
             preHRVariableConvertor(formula){
                 for (let i = 0; i < this.databaseTables.length; i++) {
                     let tableFields = this.databaseTables[i].tableFields;
                     for (let j = 0; j < tableFields.length; j++) {
                         let field = tableFields[j];
                         let fieldCode = field.code;
                         let inputName = field.inputSig;
                         formula = this.replaceAll(formula, inputName, fieldCode);
                     }
                 }
                 return formula;
             },
             preFuncConvertor(formula){
                 for (let i = 0; i < this.fomulaTpls.length; i++) {
                     let fomulaItems = this.fomulaTpls[i].fomulaItems;
                     for (let j = 0; j < fomulaItems.length; j++) {
                         let field = fomulaItems[j];
                         let fieldCode = field.code;
                         let inputName = field.inputSig;
                         while(formula != formula.replace(inputName, fieldCode)){
                             formula = formula.replace(inputName, fieldCode);
                         }
                     }
                 }
                 return formula;
             },
             preRefConvertor(formula){
//                 let parten = /\s*(=|<>)\s*\".*?\"/g;
                 let match = false;
                 for(let key in this.refcodeMap){
                     let parten = key + '\\s*(=|<>)\\s*\".*?\"';
                     let matchLst = formula.match(parten);
                     if(matchLst != null && matchLst.length){
                         match = true;
                         break;
                     }
                 }
                 if(match){
                     this.replaceRefValue(formula);
                 }else{
                     this.selectedData[0].code= formula;
                     this.selectedData[0].name=this.fomulaStr;
                     this.$emit('customRefConfirm', this.selectedData);
                 }
             },

             replaceRefValue(formula){

                 this.$http({
                     url: "/hrwa/warulefomula/replaceRefValue",
                     method: "post",
                     data: {formula: formula, refcode: this.refcodeMap,enumpara:this.enumparaMap}
                 })
                     .then(res => {

                         if (res.data.status === true) {
                             formula = res.data.data;
                             this.selectedData[0].code= formula;
                             this.selectedData[0].name=this.fomulaStr;
                             this.$emit('customRefConfirm', this.selectedData);
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
             },

             replaceAll(str, source, replacement)
             {
                 let sindex = str.indexOf(source);
                 let replStr = replacement;// 要替换的字符串
                 while (sindex >= 0) {
                     // 如果要替换的关键字之间没有空格，在前边增加一空格 隔开，否则生成的系统语言不正确并且系统语言》业务语言时会转换有误
                     if (sindex > 0) {
                         if (str.substring(sindex - 1, sindex) == " ") {
                             replStr = replacement;
                         }
                         else {
                             replStr = " " + replacement;
                         }
                     }
                     else {
                         replStr = replacement;
                     }
                     str = str.replace(source, replStr);
                     sindex = str.indexOf(source);
                 }
                 return str;

             },


             postLogicConvertor(formula){
                 return formula.replace(/\s&&\s/g, " 并且 ").replace(/\s\|\|\s/g, " 或者 ");
             },

             postIIfConvertor(formula){
                 let pattern = /\s*iif\s*\(/;
                 let firsIIfstart = formula.search(pattern);
                 if (firsIIfstart == -1) {
                     return formula;
                 }
                 let firsIIfend = firsIIfstart;
                 let preFormular = formula.substring(0, firsIIfstart);
                 let bodyString = formula.substring(firsIIfstart);
                 // 查找第一个 '(' 所在的位置
                 let tempPos = bodyString.indexOf("(");
                 let illString = bodyString.substring(tempPos + 1);
                 let bracketStack = [];
                 bracketStack.push("(");
                 let pos = 0;
                 while (bracketStack.length > 0 && pos < illString.length) {
                     let c = illString.substring(pos, pos + 1);
                     if (c == "(") {
                         bracketStack.push(c);
                     }
                     else if (c == ")") {
                         let leftbracket = bracketStack.pop();
                         if (leftbracket != "(") {
                             // 左右 括号不匹配
                             // throw new Exception("左右 括号不匹配 ");
                         }
                     }
                     pos++;
                 }

                 // pos 是 illString 中的位置
                 if (bracketStack.length > 0 && pos >= illString.length) {
                     // iif 函数 括号不匹配
                     // throw new Exception("iif 函数 括号不匹配");
                 }
                 else {
                     firsIIfend = pos - 1 + preFormular.length + tempPos + 1;
                 }

                 // 提取 iif 函数
                 let iiffunc = formula.substring(firsIIfstart, firsIIfend + 1);
                 // iif 后面的公式 。
                 let posFormular = "";

                 if (firsIIfend + 1 < formula.length()) {
                     posFormular = formula.substring(firsIIfend + 1);
                 }
                 let allIIfs = iiffunc.match(pattern);
                 let iifcount = allIIfs.length;
                 iiffunc = iiffunc.replace(/\s*iif\s*\(/g, "");
                 if (iiffunc.lastIndexOf(")") >= 0) {
                     // 去掉与iif( 匹配的 右括号
                     iiffunc = iiffunc.substring(0, iiffunc.lastIndexOf(")") - iifcount + 1);
                 }
 //还没做完
             },

         },
     };
 </script>
 <style>

     /* reset background color when select words */
     #hrwafomuladialog::selection {
         background: none;
     }
     #hrwafomuladialog {
         box-sizing: border-box;
         padding: 16px 16px 0px 16px;
         width:100%;
         position:relative;
     }
     #hrwafomuladialog .el-textarea__inner {
         box-sizing: border-box;
         padding: 6px;
         line-height: 20px;
     }
     #hrwafomuladialog .layout-top {
         display: flex;
     }

     #hrwafomuladialog .fomula-textarea-and-btns {
         flex: 1;
         margin-right: 16px;
     }
     #hrwafomuladialog .fomula-textarea-btns {
         text-align: right;
     }
     #hrwafomuladialog .fomula-textarea-btns .el-button,
     #hrwafomuladialog .fomula-textarea-btns .el-checkbox
     {
         margin-top: 8px;
     }
     #hrwafomuladialog .fomula-textarea-btns .el-button + .el-button {
         margin-left: 16px;
     }
     /* calculator */
     #hrwafomuladialog .fomula-calculator{
         margin-right:16px;
         margin-left:16px;
     }

     #hrwafomuladialog .fomula-calculator-operators {
         margin-top: 16px;
     }
     #hrwafomuladialog .fomula-calculator-operators span,
     #hrwafomuladialog .fomula-calculator-numbers span {
         display: inline-block;
         box-sizing: border-box;
         width: 58px;
         height: 34px;
         border: 1px solid #D2D2D7;
         line-height: 34px;
         text-align: center;
         font-size: 14px;
         color: #333333;
         cursor: pointer;
     }
     #hrwafomuladialog .fomula-calculator-numbers span {
         background: #F5F5F5;
     }
     #hrwafomuladialog .fomula-calculator-numbers span:hover {
         background: #e7e6ec;
     }
     #hrwafomuladialog .fomula-calculator-numbers span:active {
         background: #d8d8d8;
     }
     #hrwafomuladialog .fomula-calculator-operators span {
         background: #DBDBDB;
     }
     #hrwafomuladialog .fomula-calculator-operators span:hover {
         background: #c9c8ce;
     }
     #hrwafomuladialog .fomula-calculator-operators span:active {
         background: #b4b4be;
     }
     #hrwafomuladialog .fomula-calculator-numbers .row + .row,
     #hrwafomuladialog .fomula-calculator-operators .row + .row {
         margin-top: 8px;
     }
     #hrwafomuladialog .fomula-calculator-numbers span + span,
     #hrwafomuladialog .fomula-calculator-operators span + span {
         margin-left: 8px;
     }
     #hrwafomuladialog .fomula-calculator-operators {
         margin-top: 16px;
     }

     /* bottom part */
     #hrwafomuladialog .fomula-tpls-and-dbrelated {
         margin-top: 16px;
     }
     #hrwafomuladialog .fomula-tpls,
     #hrwafomuladialog .fomula-dbrelated,
     #hrwafomuladialog .fomula-no-result {
         box-sizing: border-box;
         height: 250px;
         position: relative;
     }

     #hrwafomuladialog .fomula-no-result__inner,
     #hrwafomuladialog .fomula-no-result {
         padding: 10px;
     }
     #hrwafomuladialog .fomula-no-result,
     #hrwafomuladialog .fomula-tips {
         border: 1px solid #E6E6EB;
         border-radius: 4px;
         font-size: 14px;
         color: #2D2D2D;
     }
     /* tpls */
     #hrwafomuladialog .fomula-tpls .el-tabs__header,
     #hrwafomuladialog .fomula-dbrelated .el-tabs__header {
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         z-index: 2;
     }
     #hrwafomuladialog .fomula-tpls .el-tabs__content,
     #hrwafomuladialog .fomula-dbrelated .el-tabs__content {
         box-sizing: border-box;
         height: 100%;
         padding: 42px 0 0;
         overflow: auto;
     }
     #hrwafomuladialog .fomula-tpls ul,
     #hrwafomuladialog .fomula-dbrelated ul {
         margin: 0;
         padding: 0;
         list-style: none;
     }
     #hrwafomuladialog .fomula-tpls li,
     #hrwafomuladialog .fomula-dbrelated li {
         padding: 10px;
     }
     #hrwafomuladialog .fomula-tpl-current,
     #hrwafomuladialog .fomula-table-current,
     #hrwafomuladialog .fomula-tpls li:hover,
     #hrwafomuladialog .fomula-dbrelated li:hover {
         background: #EAF9FF;
         cursor: pointer;
     }
     #hrwafomuladialog .fomula-tips {
         box-sizing: border-box;
         margin-top: 16px;
         padding: 12px;
         height: 60px;
         line-height: 20px;
         overflow: auto;
     }
     #hrwafomuladialog .fomula-tables {
         border-right: 1px solid #d1dbe5;
     }
     #hrwafomuladialog .fomula-tables, .fomula-fields {
         height: 206px;
         overflow-y: auto !important;
     }
     #hrwafomuladialog .el-tabs__item{
         padding: 0 16px;
         height: 42px;
         box-sizing: border-box;
         line-height: 42px;
         list-style: none;
         font-size: 14px;
         color: #8392a5;
         position: relative;
     }
 </style>