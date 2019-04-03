<template>
    <ifbp-page id="regapplypsnselpage">
        <ifbp-breadcrumb name="员工转正" style="display:inline-block;"></ifbp-breadcrumb>
        <span style="float:right;color: #5CB0E6;font-size: 14px;cursor:pointer; " @click="toApplyList">转正单据</span>

        <!-- 按钮区域 -->
        <ifbp-button-area>
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         template-code="zzapplyselpsn"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="tab1Name" name="first">
                    <div class="tab-inside-title" v-if="totalElements1 > 0"></div>
                    <div class="row-container" v-for="(item, index) in tab1ListData">
                        <img class="psnimg" :src="'/hrhi/psndoc/getPhotoByPK?pk_psndoc=' + item.pk_psndoc" @error="errorLoadImg" >
                        <div class="content1">
                            <div>{{item.psnname}}&nbsp;</div>
                            <div>{{item.deptname}}&nbsp;{{!!item.postname ? '|' : ''}}&nbsp;{{item.postname}}</div>
                        </div>
                        <div class="content2">
                            <div>{{item.psnclname}}&nbsp;</div>
                            <div>{{item.eduname}}&nbsp;</div>
                        </div>
                        <div class="content3">
                            <div class="show-link" v-show="item.trialresult == null || item.trialresult == 1"><span @click="zzClick(item)">转正</span></div>
                            <div class="show-link" v-show="item.trialresult == null || item.trialresult == 2"><span @click="ycClick(item)">延长试用</span></div>
                            <div class="show-link" v-show="item.trialresult == null || item.trialresult == 3"><span @click="noPassClick(item)">未通过试用</span></div>
                        </div>
                    </div>
                    <!--分页组件-->
                    <el-pagination
                            v-if="totalElements1 > 0"
                            @size-change="handleSizeChange1"
                            @current-change="handleCurrentChange1"
                            :current-page="currentPage1"
                            :page-sizes="[5,10, 20, 30, 40]"
                            :page-size="size1"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElements1">
                    </el-pagination>
                    <div v-if="totalElements1 == 0" class="no-data-container">
                        <div class="ifbp-icon-search no-data-icon"></div>
                        <div class="tip-content">没有需要转正的员工</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="tab2Name" name="second">
                    <div class="tab-inside-title" v-if="totalElements2 > 0"></div>
                    <div class="row-container" v-for="(item, index) in tab2ListData">
                        <img class="psnimg" :src="'/hrhi/psndoc/getPhotoByPK?pk_psndoc=' + item.pk_psndoc" @error="errorLoadImg" >
                        <div class="content1">
                            <div>{{item.psnname}}&nbsp;</div>
                            <div>{{item.deptname}}&nbsp;{{!!item.postname ? '|' : ''}}&nbsp;{{item.postname}}</div>
                        </div>
                        <div class="content2">
                            <div>{{item.psnclname}}&nbsp;</div>
                            <div>{{item.eduname}}&nbsp;</div>
                        </div>
                        <div class="content3">
                            <div class="show-link" v-show="item.trialresult == null || item.trialresult == 1"><span @click="zzClick(item)">转正</span></div>
                            <div class="show-link" v-show="item.trialresult == null || item.trialresult == 2"><span @click="ycClick(item)">延长试用</span></div>
                            <div class="show-link" v-show="item.trialresult == null || item.trialresult == 3"><span @click="noPassClick(item)">未通过试用</span></div>
                        </div>
                    </div>
                    <!--分页组件-->
                    <el-pagination
                            v-if="totalElements2 > 0"
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="currentPage2"
                            :page-sizes="[5,10, 20, 30, 40]"
                            :page-size="size2"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElements2">
                    </el-pagination>
                    <div v-if="totalElements2 == 0" class="no-data-container">
                        <div class="ifbp-icon-search no-data-icon"></div>
                        <div class="tip-content">没有需要转正的员工</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </ifbp-main-area>
        <ycDialog ref="ycRef"></ycDialog>
        <zzDialog ref="zzRef"></zzDialog>
    </ifbp-page>
</template>
<script>

    import ycDialog from './yc-dialog.vue'
    import zzDialog from './zz-dialog.vue';
    import defaultAvatar from '../../../../../assets/images/hrhi/avatar/default_avatar.png';

    export default {
        components:{
            ycDialog,
            zzDialog,
        },
        data() {
            return {
                activeName: 'first',

                // 分页组件传入参数
                totalElements1: 0,
                currentPage1: 1,
                size1: 5,

                totalElements2: 0,
                currentPage2: 1,
                size2: 5,


                //查询模板参数
                searchTemplate:{},

                tab1ListData:[],//入职转正页签的数据
                tab2ListData:[],//转岗转正页签的数据
            };
        },
        computed:{
            tab1Name:function(){
                return "入职转正(" + this.totalElements1 + ")";
            },
            tab2Name:function(){
                return "转岗转正(" + this.totalElements2 + ")";
            },
        },

        created() {
            this.request(1);
            this.request(2);
        },
        methods: {
            // 请求数据
            request(type, n, s) {

                var pn = !n ? 1 : n;
                var ps = !s ? 5 : s;

                var url =
                    "/hrtrn/regmng/apply/pageList";
                this.$http({
                    url: url,
                    method: "post",
                    params :{
                        pn : pn,
                        ps : ps,
                        trialType :type,
                    },
                    data : this.searchTemplate
                })
                    .then((res) => {
                        if(res.data.status === true){
                            if(type == 1){
                                this.tab1ListData = res.data.data.content;
                                this.size1 = res.data.data.size;
                                this.currentPage1 = res.data.data.number;
                                this.totalElements1 = res.data.data.totalElements;
                            }else{
                                this.tab2ListData = res.data.data.content;
                                this.size2 = res.data.data.size;
                                this.currentPage2 = res.data.data.number;
                                this.totalElements2 = res.data.data.totalElements;
                            }
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((e) => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                this.searchTemplate = searchTemplate;
                this.request(1);
                this.request(2);
            },

            // 翻页标签改变每页显示数据
            handleSizeChange1(val) {
                this.request(1, 1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange1(val) {
                this.request(1, val, this.size1);
            },

            // 翻页标签改变每页显示数据
            handleSizeChange2(val) {
                this.request(2, 1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange2(val) {
                this.request(2, val, this.size2);
            },

            noPassClick(item){
                if(item.approvestate == -1){
                    this.$router.push("/hrtrn/regapply/applydetail/" + item.pk_hi_regapply + "/false/3");
                    return;
                }
                this.$confirm('确定此员工未通过试用?', '未通过试用', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.noPassCommit(item.pk_psnjob);
                }).catch(() => {
                });
            },
            noPassCommit(pk_psnjob){
                let trial_type = this.activeName=="first" ? 1 : 2;
                var url = '/hrtrn/regmng/apply/nopasscommit?pk_psnjob=' + pk_psnjob + '&probationType=' + trial_type;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.$router.push("/hrtrn/regapply/applydetail/" + res.data.data.pk_hi_regapply + "/false/3");
                        } else {
                            if(res.data.saveResult){
                                this.$router.push("/hrtrn/regapply/applydetail/" + res.data.pk_hi_regapply + "/false/3");
                            }
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: "页面初始化失败",
                            type: "error"
                        });
                    });
            },
            ycClick(item){
                if(item.approvestate == -1){
                    this.$router.push("/hrtrn/regapply/applydetail/" + item.pk_hi_regapply + "/false/2");
                }else{
                    let trial_type = this.activeName=="first" ? 1 : 2;
                    this.$refs.ycRef.show(item.pk_psnjob, trial_type);
                }
            },
            zzClick(item){
                if(item.approvestate == -1){
                    this.$router.push("/hrtrn/regapply/applydetail/" + item.pk_hi_regapply + "/false/1");
                }else{
                    let trial_type = this.activeName=="first" ? 1 : 2;
                    this.$refs.zzRef.show(item.pk_psnjob, trial_type);
                }
            },
            toApplyList(){
                this.$router.push("/hrtrn/regapply/applylist") ;
            },

            //当图片加载失败以后触发
            errorLoadImg: function (e) {
                e.srcElement.src = defaultAvatar;
            },
        }
    };
</script>
<style>
    #regapplypsnselpage .el-tabs>div {
        margin-left: 0px;
    }
    #regapplypsnselpage .list-main-container{
        padding-top: 2px !important;
    }
    #regapplypsnselpage .tab-inside-title{
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 0px;
        padding-bottom:0px;
        border-bottom: 1px solid #E6E6EB;
        position:relative;
    }
    #regapplypsnselpage .row-container{
        box-sizing: border-box;
        position:relative;
        border-bottom:1px  solid #E6E6EB;
        padding:22px 0px;
    }
    #regapplypsnselpage .psnimg{
        width: 46px;
        height: 46px;
        margin-right: 16px;
        border-radius: 25px;
    }
    #regapplypsnselpage .content1{
        box-sizing: border-box;
        display:inline-block;
        height:46px;
        width:277px;
        text-align:left;
    }
    #regapplypsnselpage .content1 div:first-child{
        display:block;
        font-size: 14px;
        color: #3896FC;
        letter-spacing: 0;
        line-height: 14px;
        height:14px;
        margin-bottom: 12px;
        overflow: hidden;
    }
    #regapplypsnselpage .content1 div:nth-child(2){
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 16px;
        height:16px;
        overflow: hidden;
    }

    #regapplypsnselpage .content2{
        box-sizing: border-box;
        display:inline-block;
        height:46px;
        width:auto;
        text-align:left;
    }
    #regapplypsnselpage .content2 div:first-child{
        display:block;
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 14px;
        height:14px;
        margin-bottom: 12px;
    }
    #regapplypsnselpage .content2 div:nth-child(2){
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing:0;
        line-height:16px;
        height:16px;
    }

    #regapplypsnselpage .content3{
        box-sizing: border-box;
        position:relative;
        height:46px;
        width:auto;
        text-align:left;
        float:right;
        padding:15px 0px;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 16px;
    }
    #regapplypsnselpage .content3 .show-link{
        display:inline-block;
        height:16px;
        margin-right:16px;
    }
    #regapplypsnselpage .content3 div span{
        cursor:pointer;
    }
    #regapplypsnselpage .row-container:hover .show-link{
        color: #0089FA;
    }
    #regapplypsnselpage .row-container:hover{
        background: #EAF9FF;
    }
    #regapplypsnselpage .no-data-container{
        padding:64px 0px;
        text-align:center;
        color: rgb(191, 191, 191);
    }
    #regapplypsnselpage .no-data-icon{
        font-size: 92px;
        padding-bottom: 36px;
    }
    #regapplypsnselpage .tip-content{
        font-size:20px;
    }
</style>
