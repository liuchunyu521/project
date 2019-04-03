<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="接口设计"></ifbp-breadcrumb>

        <div id="dataio_design">
            <el-row>
                <el-col :span="11">
                    <div class="sub_title">全部</div>
                    <div class="table_title">
                        <span class="chk_area">
                            <el-checkbox class="check_box" v-model="allCheck" :disabled="true"></el-checkbox>
                        </span>
                        <span class="title_area">薪资项目</span>
                    </div>
                    <div class="item_area">
                        <div class="each_item" v-for="(item,index)  in allData" @click="addItem(index, item)">
                            <span class="chk_area">
                                <el-checkbox class="check_box" v-model="item.selstatus" @change="checkItem(index, item)"></el-checkbox>
                            </span>
                            <span class="item_left_area">{{item.name}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="2" class="swap_area"><i class="ifbp-icon-swap-horiz swap_icon"></i></el-col>
                <el-col :span="11" class="right_area">
                    <div class="sub_title">
                        <span>已选择</span>
                        <span class="del_link">单击移除</span>
                    </div>
                    <div class="table_title">
                        <el-row>
                            <el-col :span="12">
                                <span class="title_right">薪资项目</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="title_right">操作</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="item_area">
                        <div class="each_item" v-for="(selitem,index) in allSelData"
                             @click="removeItem(index, selitem)">
                            <el-row>
                                <el-col :span="12">
                                    <span class="item_right_area">{{selitem.name}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <div class="opr_area">
                                        <i class="ifbp-icon-publish opr-icon" v-if="index != 0"
                                           @click.stop="toHead(index, selitem)"></i>
                                        <i class="ifbp-icon-up opr-icon" v-if="index != 0" @click.stop="toUp(index, selitem)"></i>
                                        <i class="ifbp-icon-down opr-icon" v-if="index!=allSelData.length-1"
                                           @click.stop="toDown(index, selitem)"></i>
                                        <i class="ifbp-icon-bottom opr-icon" v-if="index!=allSelData.length-1"
                                           @click.stop="toEnd(index, selitem)"></i>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!--下部按钮-->
            <ifbp-footer>
                <el-button @click="cancelHandle">取消</el-button>
                <el-button type="primary" @click="finishHandle">完成</el-button>
            </ifbp-footer>
        </div>
    </ifbp-page>
</template>

<script>
    export default {
        data() {
            var vm = this;
            return {
                pk: vm.$root.$router.currentRoute.params.id,
                classid: '',
                cyear: '',
                cperiod: '',
                allData: [],
                allSelData: [],
                vcol:'code',
            }
        },
        computed: {
            allCheck: function () {
                if(this.allData == null || this.allSelData == null || this.allData.length == 0 || this.allSelData.length == 0){
                    return false;
                }
                if(this.allData.length == this.allSelData.length){
                    return true;
                }
                return false;
            },
        },

        mounted() {
            this.request();
        },

        methods: {
            request(){
                var url = "/hrwa/dataio/designData?pk=" + this.pk + "&classid=" + this.classid + "&cyear=" + this.cyear + "&cperiod=" + this.cperiod;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                }).then((res) => {
                    if (res.data.status === true) {
                        this.allData = res.data.data;
                        this.allSelData = res.data.seldata;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
            },
            checkAll(e){
                for(var i = 0; i < this.allData.length; i++){
                    this.allData[i].selstatus = true;
                }
            },
            checkItem(index,item){
                if(this.allData[index].selstatus){
                    var hasItem = false;
                    for(var i = 0; i < this.allSelData.length; i++){
                        if(this.allSelData[i].itemkey == item.itemkey){
                            hasItem = true;
                            break;
                        }
                    }
                    if(!hasItem){
                        this.allSelData.push(item);
                    }
                }else{
                    for(var i = 0; i < this.allSelData.length; i++){
                        if(this.allSelData[i].itemkey == item.itemkey){
                            this.allSelData.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            addItem(index, item){
                this.allData[index].selstatus = !this.allData[index].selstatus;
                this.checkItem(index,item);
            },
            removeItem(index, selItem){
                this.allSelData.splice(index, 1);
                for (var i = 0; i < this.allData.length; i++) {
                    if (this.allData[i].itemkey == selItem.itemkey) {
                        this.allData[i].selstatus = false;
                    }
                }
            },
            toHead(index, selItem){
                if(index == 0)return;
                var tempArray = new Array();
                tempArray.push(selItem);
                for(var i = 0; i < this.allSelData.length; i++){
                    if(i == index){
                        continue;
                    }
                    tempArray.push(this.allSelData[i]);
                }
                this.allSelData = tempArray;
            },
            toUp(index, selItem){
                if(index == 0)return;
                var tempArray =  JSON.parse(JSON.stringify(this.allSelData));
                tempArray[index - 1] = this.allSelData[index];
                tempArray[index] = this.allSelData[index - 1];
                this.allSelData = tempArray;
            },
            toDown(index, selItem){
                if(index == this.allSelData.length-1)return;
                var tempArray =  JSON.parse(JSON.stringify(this.allSelData));
                tempArray[index + 1] = this.allSelData[index];
                tempArray[index] = this.allSelData[index + 1];
                this.allSelData = tempArray;
            },
            toEnd(index, selItem){
                if(index == this.allSelData.length-1)return;
                var tempArray = new Array();
                for(var i = 0; i < this.allSelData.length; i++){
                    if(i == index){
                        continue;
                    }
                    tempArray.push(this.allSelData[i]);
                }
                tempArray.push(selItem);

                this.allSelData = tempArray;
            },

            check(){
                if(this.allSelData == null || this.allSelData.length == 0){
                    this.$message({
                        message: "接口定义项目不能为空！",
                        type: "error"
                    });
                    return false;
                }
                if(this.vcol == "code"){
                    var isContainCode = false;
                    for(var i = 0; i < this.allSelData.length; i++){
                        if(this.allSelData[i].itemkey == "bd_psndoc.code"){
                            isContainCode = true;
                            break;
                        }
                    }
                    if(!isContainCode){
                        this.$message({
                            message: "关联项目[人员编码]必须选择！",
                            type: "error"
                        });
                        return false;
                    }
                }else{
                    var isContainType = false;
                    var isContainId = false;
                    for(var i = 0; i < this.allSelData.length; i++){
                        if(this.allSelData[i].itemkey == "bd_psndoc.idtype"){
                            isContainType = true;
                        }
                        if(this.allSelData[i].itemkey == "bd_psndoc.id"){
                            isContainId = true;
                        }
                    }
                    if (!isContainType || !isContainId) {
                        this.$message({
                            message: "关联项目[证件类型+证件号码]必须同时选择！",
                            type: "error"
                        });
                        return false;
                    }
                }
                return true;
            },
            cancelHandle(){
                this.$context.getApp().back();
            },
            finishHandle(){
                if(this.check()){
                    this.realSave();
                }
            },

            realSave(){
                this.$http({
                    url: '/hrwa/dataio/savechild?mainpk=' + this.pk,
                    method: 'post',
                    data: this.allSelData
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.$context.getApp().back();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '保存失败',
                            type: 'error'
                        });
                    });
            },

        },
    };
</script>

<style>
    #dataio_design {
        position: relative;
        background-color: #fff;
        margin: 0;
        padding: 16px;
        border-top: 0px;
    }

    #dataio_design .right_area {
        position: relative;
    }

    #dataio_design .sub_title {
        position: relative;
        width: 100%;
        color: #333333;
        font-weight: bold;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 16px;
        margin-bottom: 10px;
    }

    #dataio_design .del_link {
        color: #999999;
        float: right;
    }

    #dataio_design .table_title {
        box-sizing: border-box;
        position: relative;
        background: #F5F5F5;
        border: 1px solid #E6E6EB;
        width: 100%;
        height: 40px;
    }

    #dataio_design .each_item {
        box-sizing: border-box;
        position: relative;
        border-bottom: 1px solid #E6E6EB;
        width: 100%;
        height: 48px;
    }

    #dataio_design .each_item:hover {
        background: #EAF9FF;
    }

    #dataio_design .chk_area {
        padding-left: 16px;
        padding-right: 30px;
    }

    #dataio_design .table_title .chk_area {
        line-height: 38px;
    }

    #dataio_design .left_item .chk_area {
        line-height: 48px;
    }

    #dataio_design .title_area {
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 38px;
    }

    #dataio_design .item_left_area {
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 48px;
    }

    #dataio_design .title_right {
        padding-left: 16px;
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 38px;
    }

    #dataio_design .item_right_area {
        padding-left: 16px;
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 48px;
    }

    #dataio_design .opr_area {
        padding-left: 16px;
        letter-spacing: 0;

    }

    #dataio_design .opr-icon {
        color: #268CE7;
        font-size: 20px;
        margin-right: 10px;
        line-height: 48px;
        cursor: pointer;
    }

    #dataio_design .swap_area {
        text-align: center;
        padding-top: 300px;
    }

    #dataio_design .swap_icon {
        font-size: 50px;
        color: #B0B8BE;
    }

    #dataio_design .item_area {
        height: 528px;
        overflow-y: auto;
        border: 1px solid #E6E6EB;
        border-top: 0px;
    }
</style>
