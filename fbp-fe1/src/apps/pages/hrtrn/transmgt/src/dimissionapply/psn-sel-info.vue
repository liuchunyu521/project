<template>
    <ifbp-page id="dimissionapplypsnselpage">
        <ifbp-breadcrumb name="员工离职" style="display:inline-block;"></ifbp-breadcrumb>
        <span style="float:right;color: #5CB0E6;font-size: 14px;cursor:pointer; " @click="toApplyList">离职单据</span>

        <!-- 按钮区域 -->
        <ifbp-button-area>
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         template-code="lzapplyselpsn"
                         @search="advancedSearch">
            </ifbp-search>
        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
                    <div class="tab-inside-title" v-if="totalElements > 0"></div>
                    <div class="row-container" v-for="(item, index) in tabListData">
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
                            <div class="opr-type show-link" v-for="trnstype in trnstypeuivos" v-if="!!item.pk_trnstype && item.pk_trnstype == trnstype.pk_trnstype"><span @click="lzClick({psninfo:item,oprinfo:trnstype})">{{trnstype.trnstypename}}</span></div>
                            <div class="opr-type show-link" v-for="trnstype in listShowOpr"v-if="!item.pk_trnstype"><span @click="lzClick({psninfo:item,oprinfo:trnstype})">{{trnstype.trnstypename}}</span></div>

                            <el-dropdown @command="lzClick" v-if="dropdownOpr.length>0 && !item.pk_trnstype">
                                <div class="opr-type show-link" >更多</div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{psninfo:item,oprinfo:trnstype}" v-for="trnstype in dropdownOpr">{{trnstype.trnstypename}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <!--分页组件-->
                    <el-pagination
                            v-if="totalElements > 0"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5,10, 20, 30, 40]"
                            :page-size="size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalElements">
                    </el-pagination>

            <div v-if="totalElements == 0" class="no-data-container">
                <div class="ifbp-icon-search no-data-icon"></div>
                <div class="tip-content">没有需要离职的员工</div>
            </div>
        </ifbp-main-area>
        <lzDialog ref="lzRef"></lzDialog>
    </ifbp-page>
</template>
<script>

    import lzDialog from './lz-dialog.vue'
    import defaultAvatar from '../../../../../assets/images/hrhi/avatar/default_avatar.png';

    export default {
        components:{
            lzDialog,
        },
        data() {
            return {
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 5,

                trnstypeuivos:[],

                //查询模板参数
                searchTemplate:{},

                tabListData:[],//离职人员数据
            };
        },
        computed:{
            //显示在列表上的操作项
            listShowOpr:function(){
                var oprArray = new Array();
                var size = 0;
                if(this.trnstypeuivos == null || this.trnstypeuivos.length ==0){
                    return oprArray;
                }else if(this.trnstypeuivos.length <= 4){
                    size = this.trnstypeuivos.length;
                }else{
                    size = 3;
                }
                for(var i =0; i < size; i++){
                    oprArray.push(this.trnstypeuivos[i]);
                }
                return oprArray;
            },
            //显示在下拉框上的
            dropdownOpr:function(){
                var oprArray = new Array();
                if(this.trnstypeuivos == null || this.trnstypeuivos.length <=4){
                    return oprArray;
                }

                for(var i =3; i < this.trnstypeuivos.length; i++){
                    oprArray.push(this.trnstypeuivos[i]);
                }
                return oprArray;
            },
        },

        created() {
            this.request();
        },
        methods: {
            // 请求数据
            request(n, s) {

                var pn = !n ? 1 : n;
                var ps = !s ? 5 : s;

                var url =
                    "/hrtrn/dimission/apply/pageList";
                this.$http({
                    url: url,
                    method: "post",
                    params :{
                        pn : pn,
                        ps : ps,
                    },
                    data : this.searchTemplate
                })
                    .then((res) => {
                        if(res.data.status === true){
                                this.tabListData = res.data.data.content;
                                this.size = res.data.data.size;
                                this.currentPage = res.data.data.number;
                                this.totalElements = res.data.data.totalElements;
                                this.trnstypeuivos = res.data.trnstypes;
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
                this.request();
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
            },
            lzClick(selinfo){
                if(selinfo.psninfo.approvestate == -1){
                    this.$router.push("/hrtrn/transmgt/dimissionapply/detail/" + selinfo.psninfo.pk_hi_stapply + "/false");
                }else{
                    this.$refs.lzRef.show(selinfo.psninfo.pk_psnjob, selinfo.oprinfo);
                }
            },
            toApplyList(){
                this.$router.push("/hrtrn/transmgt/dimissionapply/list") ;
            },
            //当图片加载失败以后触发
            errorLoadImg: function (e) {
                e.srcElement.src = defaultAvatar;
            },
        }
    };
</script>
<style>
    #dimissionapplypsnselpage .tab-inside-title{
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 1px;
        padding-bottom:1px;
        border-bottom: 1px solid #E6E6EB;
        position:relative;
    }
    #dimissionapplypsnselpage .row-container{
        box-sizing: border-box;
        position:relative;
        border-bottom:1px  solid #E6E6EB;
        padding:22px 0px;
    }
    #dimissionapplypsnselpage .psnimg{
        width: 46px;
        height: 46px;
        margin-right: 16px;
        border-radius: 25px;
    }
    #dimissionapplypsnselpage .content1{
        box-sizing: border-box;
        display:inline-block;
        height:46px;
        width:277px;
        text-align:left;
    }
    #dimissionapplypsnselpage .content1 div:first-child{
        display:block;
        font-size: 14px;
        color: #3896FC;
        letter-spacing: 0;
        line-height: 14px;
        height:14px;
        margin-bottom: 12px;
        overflow: hidden;
    }
    #dimissionapplypsnselpage .content1 div:nth-child(2){
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 16px;
        height:16px;
        overflow: hidden;
    }

    #dimissionapplypsnselpage .content2{
        box-sizing: border-box;
        display:inline-block;
        height:46px;
        width:auto;
        text-align:left;
    }
    #dimissionapplypsnselpage .content2 div:first-child{
        display:block;
        font-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 14px;
        height:14px;
        margin-bottom: 12px;
    }
    #dimissionapplypsnselpage .content2 div:nth-child(2){
        ffont-size: 14px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 16px;
        height:16px;
    }

    #dimissionapplypsnselpage .content3{
        box-sizing: border-box;
        position:relative;
        display:inline-block;
        height:46px;
        width:auto;
        text-align:left;
        float: right;
        padding:15px 0px;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 16px;
    }
    #dimissionapplypsnselpage .content3 .opr-type{
        display:inline-block;
        height:16px;
        padding-right:16px;
        font-size: 14px;
        color: #FFFFFF;
    }
    #dimissionapplypsnselpage .content3 div span{
        cursor:pointer;
    }
    #dimissionapplypsnselpage .row-container:hover .show-link{
        color: #0089FA;
    }
    #dimissionapplypsnselpage .row-container:hover{
        background: #EAF9FF;
    }

    #dimissionapplypsnselpage .no-data-container{
        padding:64px 0px;
        text-align:center;
        color: rgb(191, 191, 191);
    }
    #dimissionapplypsnselpage .no-data-icon{
        font-size: 92px;
        padding-bottom: 36px;
    }
    #dimissionapplypsnselpage .tip-content{
        font-size:20px;
    }
</style>
