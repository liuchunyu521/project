<template>
  <div>
      <div class="L_salarysend">
        <el-dialog title="批量修改" :visible="dialogVisible" :show-close="false">
          <div id="contenttop">
            <el-row>
              <el-col :span="12">
                <div class="contenttop_left">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="薪资项目" prop="salaryobject">
                      <el-select v-model="ruleForm.salaryobject" placeholder="请选择薪资项目">
                        <el-option
                                v-for="item in salaryobjectoptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="修改为" prop="modify">
                      <el-input type="textarea" @keyup.native="modifyFunc($event)"  v-model="ruleForm.modify"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="contenttop_right">
                  <div style="float: left;width: 210px;">
                    <div>
                      <template>
                        <el-select v-model="valueData" @change="typeselect" placeholder="请选择">
                          <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item">
                          </el-option>
                        </el-select>
                      </template>
                      <!--<span class="calculatorright">||</span>-->
                    </div>
                    <div>
                      <div class="calculatorleft" @click="numselect(7)">7</div>
                      <div class="calculatorleft" @click="numselect(8)">8</div>
                      <div class="calculatorleft" @click="numselect(9)" style="margin: 0px;">9</div>
                      <div class="calculatorleft" @click="numselect(4)">4</div>
                      <div class="calculatorleft" @click="numselect(5)">5</div>
                      <div class="calculatorleft" @click="numselect(6)" style="margin: 0px;">6</div>
                      <div class="calculatorleft" @click="numselect(1)">1</div>
                      <div class="calculatorleft" @click="numselect(2)">2</div>
                      <div class="calculatorleft" @click="numselect(3)" style="margin: 0px;">3</div>
                      <div class="calculatorleft" @click="numselect(0)" style="width: 133px;">0</div>
                      <div class="calculatorleft" @click="numselect('.')" style="margin: 0px;">.</div>
                    </div>
                  </div>
                  <div style="float: left;width: 60px;">
                    <div class="calculatorright" @click="numselect('||')">||</div>
                    <div class="calculatorright" @click="numselect('/')">/</div>
                    <div class="calculatorright" @click="numselect('*')">*</div>
                    <div class="calculatorright" @click="numselect('-')">-</div>
                    <div class="calculatorright" @click="numselect('+')">+</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div id="contentmiddle">
            <div style="margin-left: -217px;">
              <template>
                <el-radio class="radio" v-model="radio" label="all">全部修改</el-radio>
                <el-radio class="radio" v-model="radio" label="part">部分修改(仅修改已查询出人员的相关数据)</el-radio>
              </template>
            </div>
            <div>
              <div style="margin-top: 19px;color: #666666;line-height: 26px;">说明：1.用户可直接在输入框中输入公式表达式，例如：奖金 修改为[数值型项目]*0.25</div>
              <div style="margin-left: 48px;color:#666666; line-height: 26px;">2.连接两个字符串、字符型或日期型薪资项目时用||(不要用+,+仅用于数字型数据)</div>
              <div style="margin-left: -50px;color: #666666;line-height: 26px;">3.字符或日期型常量前后必须加双引号,日期型格式YYYY-MM-DD</div>
            </div>
          </div>
          <div id="sumbit">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="sumbit('ruleForm')">确定</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
</template>
<script>
    export default {
        props :['editableItem'],
        data(){
            return{
                dialogVisible:false,//控制弹框显示隐藏
                radio: 'part',//全部修改，部分修改label值可以修改根据后台或自己定义；
                salaryobjectoptions:[],
                options: [],
                ruleForm: {//左侧薪资项目与修改后的值
                    salaryobject: '',
                    modify: ''
                },
                valueData: '',//右侧选择值
                rules: {//修改时的校验
                    salaryobject: [
                        { required: true, message: '薪资项目不能为空', trigger: 'blur' }
                    ],
                    modify: [
                        { required: true, message: '修改内容不能为空', trigger: 'blur' }
                    ]
                },
                showData:[],//显示文本框内的数据
                submitData:""//提交后台的值
            }
        },
        created(){

        },
        methods: {
            cancel(){
               this.dialogVisible = false;
                this.ruleForm.modify= "";
                this.showData =[];
            },
            show(){
                this.dialogVisible = true;
                this.ruleForm.modify = "";
                this.ruleForm.salaryobject="";
                this.salaryobjectoptions = JSON.parse(this.editableItem);

                var dynamicColumn = sessionStorage.getItem('waDataDynamicColumn').split("||");
                var jsonDynamicColumns = [];
                for(var i=0;i<dynamicColumn.length;i++){
                    var  aColumn = JSON.parse(dynamicColumn[i]);

                    var item = {};
                    item.value = aColumn.column;
                    item.label = aColumn.label;
                    jsonDynamicColumns.push(item);
                }
                this.options = jsonDynamicColumns;
            },
            hide(){
                this.dialogVisible = false;
            },
            typeselect(){//左侧下拉框选择值
                this.showData.push('['+this.valueData.label+']');
                var str="";
                for(var i=0;i<this.showData.length;i++){
                    str+=this.showData[i];
                }
                this.ruleForm.modify=str;
            },
            numselect(res){//左侧数据选择值
                this.showData.push(res);
                var str="";
                for(var i=0;i<this.showData.length;i++){
                    str+=this.showData[i];
                }
                this.ruleForm.modify=str;
            },
            modifyFunc(event){
                var str="";
                if(event.keyCode==8){
                    var _Dataarry=this.ruleForm.modify.split(" ");
                    var newarry=[];
                    for(var i=0;i<_Dataarry.length;i++){
                        if(_Dataarry[i]!=""){
                            newarry.push(_Dataarry[i])
                        }
                    }
                    console.log(newarry)
                    this.showData=newarry;
                    for(var i=0;i<this.showData.length;i++){
                        str+=this.showData[i];
                    }
                    this.ruleForm.modify=str;
                }else{
                    var str="";
                    var _Dataarry=this.ruleForm.modify.split(" ");
                    var newarry=[];
                    for(var i=0;i<_Dataarry.length;i++){
                        if(_Dataarry[i]!=""){
                            newarry.push(_Dataarry[i])
                        }
                    }
                    this.showData=newarry;
                    for(var i=0;i<this.showData.length;i++){
                        str+=this.showData[i];
                    }
                    this.ruleForm.modify=str;
                }
            },
            sumbit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //提交校验通过可以进行下一步操作
                        var _Data={
                            selectedItemKey:this.ruleForm.salaryobject,
                            formular:this.ruleForm.modify,
                            replaceType:this.radio
                        };
                       this.$emit("okAction",JSON.stringify(_Data));
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped="scoped">

  /*.el-dialog__header {
    padding: 22px 20px 20px 20px;
    border-bottom: 1px solid #D2D2D7;

  }
   .el-dialog__body {
    padding: 0px;
  }*/
  .el-dialog__body {
    padding: 0px;
  }

   #sumbit {
    /*border-top:1px solid  #D2D2D7;*/
    text-align: right;
    padding: 16px;
  }
   #contenttop {
    padding-top: 24px;
  }
   .el-textarea__inner {
    height: 209px;
  }
   .contenttop_right {
    margin-top: 51px;
    margin-left: 10px;

  }
  .calculatorright {
    width: 60px;
    /*display: inline-block;*/
    text-align: center;
    line-height: 33px;
    height: 33px;
    margin-left: 10px;
    background: #DBDBDB;
    border: 1px solid #D2D2D7;
    margin-bottom: 8px;
    cursor: pointer;

  }
   .calculatorright:hover {
    background:darkgray;
  }

   .calculatorleft {
    width: 60px;
    margin-top: 8px;
    display: inline-block;
    margin-right: 7px;
    text-align: center;
    line-height: 34px;
    height: 34px;
    background: #F5F5F5;
    cursor: pointer;
    border: 1px solid #D2D2D7;
  }
   .calculatorleft:hover {
    background:darkgray;
  }
  #contentmiddle {
    text-align: center;
  }
</style>
