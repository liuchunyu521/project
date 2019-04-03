<!--
	作者：zhanghtc
	时间：2018-11-26
	描述：打标签
	父组件引入import psn-tag-dis from '../../../../../common/component/psn-tag-dis.vue';
-->
<template>
    <div>
        <div class="set-btn" v-if="mode==3 && useTagFunc"><a @click="setTag" class="hr-form-a">设置标签</a></div>
        <div>
            <el-tooltip placement="right-start" effect="light" v-for="(tag, index) in disTags">
                <div slot="content">
                    <div class="tooltip-content">
                        <div class="tooltip-title">标签信息</div>
                        <div class="tooltip-bar">
                            <div class="tooltip-name">{{tag.name}}</div>
                            <div class="tooltip-item-label">创建组织</div>
                            <div class="tooltip-item-value">{{tag.orgname}}</div>
                            <div class="tooltip-item-label">描述</div>
                            <div class="tooltip-item-value">{{tag.remark ? tag.remark : '无'}}</div>
                            <div class="tooltip-item-label">设置标签人</div>
                            <div class="tooltip-item-value">{{tag.user_name}}</div>
                        </div>
                    </div>
                </div>
            <el-tag
                    class="tag-item"

                    :key="index"
                    type="primary-outline">
                {{ tag.name }}
            </el-tag>
            </el-tooltip>
        </div>
        <tag-dialog ref="tagDialogRef" :initSelected="disTags" :pk_psndoc="pk_psndoc" :pk_org="pk_org" @confirm="handleChange"></tag-dialog>
        <el-popover
                ref="popover4"
                placement="right"
                width="400"
                trigger="hover">
            <el-table>
                <el-table-column width="150" property="date" label="日期"></el-table-column>
                <el-table-column width="100" property="name" label="姓名"></el-table-column>
                <el-table-column width="300" property="address" label="地址"></el-table-column>
            </el-table>
        </el-popover>
    </div>
</template>
<script>
    import tagDialog from './tag-dialog.vue';
    export default {
        components: {
            "tagDialog":tagDialog,
        },
        props: {
            mode:{
                type: Number,
                default: 1,  //1：自助页面  2：业务查看  3：业务设置
            },
            pk_psndoc: String,
            pk_org:String,
        },
        data() {
            return {
                disTags:[],
                useTagFunc:false,
            };
        },
        watch:{
            mode: function mode(val) {
                this.request();
            },
            pk_psndoc: function pk_psndoc(val) {
                this.request();
            }
        },
        computed: {},
        mounted() {
            this.request();

        },
        created: {},

        methods: {
            handleChange(){
                debugger;
                this.request();
            },
            setTag(){
                this.$refs.tagDialogRef.showDialog();
            },
            request(){
                const url = "/hrhi/tag/signedTag";
                this.$http({
                    url: url,
                    method: "POST",
                    params: {
                        mode:this.mode,
                        pk_psndoc:this.pk_psndoc,
                    }
                }).then(res => {
                    if (res.data.success) {
                        this.disTags = res.data.data;
                        this.useTagFunc = res.data.useTag;
                    }
                }).catch(e => {

                })
            }
        },
    };
</script>
<style scoped>
.set-btn{
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 12px;
}
.tag-item{
    margin:0 12px 12px 0;
}
.tooltip-content{
    max-width:350px;
    min-width:250px;
}
.tooltip-bar{
    border-top: 1px solid #E6E6EB;
}
.tooltip-title{
    font-size: 18px;
    color: #333333;
    line-height: 18px;
    margin-bottom:15px;
    margin-top:7px;
}
.tooltip-name{
    margin-top:16px;
    margin-bottom:6px;
    font-size: 18px;
    color: #2D2D2D;
    line-height: 18px;
}
.tooltip-item-label{
    margin-top:19px;
    font-size: 14px;
    color: #666666;
    line-height: 16px;
}
    .tooltip-item-value{
        margin-top:7px;
        font-size: 14px;
        color: #2D2D2D;
        line-height: 14px;
    }
</style>
