<!--
	作者：zhanghtc
	时间：2018-11-26
	描述：标签选择，目前只有psn-tag-dis才会使用
-->
<template>
    <div>
        <el-dialog
                id="hitagdialog"
                @update:visible="val => dialogTagVisible = val"
                title="选择标签"
                size="small"
                :visible="dialogTagVisible"
                custom-class="tagdialog"
        >

            <div class="all_content">
            <el-tabs class="ifbp-content-tabs tabs-area">
                <div slot="header" class="fr">
                    <el-input
                            placeholder="搜索标签名称"
                            icon="search"
                            v-model="condtion"
                            :on-icon-click="handleSearch"
                            @keyup.enter.native="handleSearch">
                    </el-input>
                </div>
                <el-tab-pane label="全部">
                    <div class="area-tag">
                        <div v-for="tagType in allTags">
                            <div class="typeTag">{{tagType.typename}}</div>
                            <div>
                                <el-tag  @click.native="tagClick(tag)"
                                        class="top-tag"
                                        v-for="(tag, index) in tagType.child"
                                        :key="index"
                                        :hit="tag.select"
                                        type="hrline">{{ tag.name }}</el-tag>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="height:150px;width:100%" v-if="showType==0">&nbsp;</div>
            <el-collapse
                    v-model="activeNames"
                    class="selected-panel" v-if="showType==0">
                <el-collapse-item
                        :title="'已选' + (Array.isArray(selected) && selected.length ? '(' + selected.length + ')' : '')"
                        name="1">
                    <el-tag
                            class="selected-tag"
                            v-for="(tag, index) in selected"
                            :key="index"
                            type="primary-outline"
                            :closable="tag.closeable"
                            closeTransition
                            @close="removeSelected(tag, index)">{{ tag.name }}
                    </el-tag>
                </el-collapse-item>
            </el-collapse>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: "tagDialog",
        props: {
            //已选择的标签
            initSelected: {
                type: Object,
                required:false,
                default: function () {
                    return [];
                }
            },
            pk_psndoc:{
                type: String,
                required:false,
            },
            pk_org:String,
        },
        watch: {},
        data(){
            return {
                //当前选择窗口是否可见
                dialogTagVisible: false,
                //展开的面板
                activeNames: ["1"],
                //所有的标签
                allTags: {},
                bakAllTags: {},
                //查询条件
                condtion: "",
                selected:[],
                showType: 0,  //0： 显示已选    1：不显示已选
                pk_psndocs:[],
            }
        },
        mounted(){
        },
        methods: {
            //单击标签
            tagClick(tag){
                tag.select = !tag.select;
                if (tag.select) {
                    this.selected.push(tag);
                } else {
                    for (var i = 0; i < this.selected.length; i++) {
                        if (this.selected[i].pk == tag.pk) {
                            this.selected.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            //显示当前对话框
            showDialog(){
                this.showType = 0;
                this.dialogTagVisible = true;
                this.condtion = "";
                this.allTags = [];
                this.bakAllTags = [];
                this.selected = JSON.parse(JSON.stringify(this.initSelected));
                this.request();
            },
            showDialogForList(pk_psndocs){
                this.showType = 1;
                this.dialogTagVisible = true;
                this.condtion = "";
                this.allTags = [];
                this.bakAllTags = [];
                this.selected = [];
                this.pk_psndocs = pk_psndocs;
                this.request();
            },

            //获取数据
            request() {
                const url = "/hrhi/tag/allUseTag";
                this.$http({
                    url: url,
                    method: "POST",
                    data: {}
                }).then(res => {
                    if (res.data.success) {
                        this.allTags = res.data.data;
                        this.bakAllTags = JSON.parse(JSON.stringify(this.allTags));
                        if(this.showType == 0){
                            this.margeSelToTags(this.allTags);
                            this.setSelTagStatus(this.allTags);
                        }
                    }
                }).catch(e => {

                })
            },

            setSelTagStatus(tags){
                if(!this.selected){
                    return;
                }
                var selPKs = new Array();
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i].child) {
                        for (var j = 0; j < tags[i].child.length; j++) {
                            selPKs.push(tags[i].child[j].pk);
                        }
                    }
                }

                for(var i=0;i<this.selected.length;i++){
                    if(selPKs.indexOf(this.selected[i].pk) != -1){
                        this.selected[i].closeable = true;
                    }else{
                        this.selected[i].closeable = false;
                    }
                }
            },
            margeSelToTags(tags){
                var selPKs = new Array();
                if(this.selected){
                    for(var i=0;i<this.selected.length;i++){
                        selPKs.push(this.selected[i].pk);
                    }
                }
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i].child) {
                        for (var j = 0; j < tags[i].child.length; j++) {
                            if (selPKs.indexOf(tags[i].child[j].pk) != -1) {
                                tags[i].child[j].select = true;
                            }else{
                                tags[i].child[j].select = false;
                            }
                        }
                    }
                }
            },
            //移除已经选择的标签
            removeSelected(tag, tagIndex) {
                this.selected.splice(tagIndex, 1);
                for (var i = 0; i < this.allTags.length; i++) {
                    if (this.allTags[i].child) {
                        for (var j = 0; j < this.allTags[i].child.length; j++) {
                            if (this.allTags[i].child[j].pk == tag.pk) {
                                this.allTags[i].child[j].select = false;
                                return;
                            }
                        }
                    }
                }
            },
            //检索
            handleSearch(){
                if (!this.condtion) {
                    this.allTags = JSON.parse(JSON.stringify(this.bakAllTags));
                    this.margeSelToTags(this.allTags);
                    return;
                }
                var tempTags = JSON.parse(JSON.stringify(this.bakAllTags));
                for (var i = 0; i < tempTags.length; i++) {
                    if (tempTags[i].child) {
                        for (var j = tempTags[i].child.length - 1; j > -1; j--) {
                            if (tempTags[i].child[j].name.indexOf(this.condtion) == -1) {
                                tempTags[i].child.splice(j, 1);
                            }
                        }
                    }
                }
                for (var i = tempTags.length - 1; i > -1; i--) {
                    if (!tempTags[i].child || tempTags[i].child.length == 0) {
                        tempTags.splice(i, 1);
                    }
                }
                this.allTags = tempTags;
                this.margeSelToTags(this.allTags);
            },

            handleCancel(){
                this.dialogTagVisible = false;
            },

            handleConfirm(){
                this.dialogTagVisible = false;
                var pks = new Array();
                if(this.selected){
                    for(var i = 0; i < this.selected.length; i++){
                        pks.push(this.selected[i].pk);
                    }
                }

                if(pks.length == 0 && this.showType == 1){
                    this.$message({
                        message: "请先选择标签",
                        type: "warning"
                    });
                    return;
                }

                var url, params, data;
                if(this.showType == 0){
                    url = "/hrhi/tag/updSignedTag";
                    params = {
                        pk_org:this.pk_org,
                        pk_psndoc:this.pk_psndoc,
                    };
                    data = {
                        pk_hi_tags:pks,
                    }
                }else{
                    url = "/hrhi/tag/batchSignTag";
                    params = {
                        pk_org:this.pk_org,
                    };
                    data = {
                        pk_hi_tags:pks,
                        pk_psndocs:this.pk_psndocs,
                    }
                }
                this.$http({
                    url: url,
                    method: "POST",
                    params:params,
                    data: data,
                }).then(res => {
                    if (res.data.success) {
                        this.$message({
                            message: "设置标签成功",
                            type: "success"
                        });
                        this.$emit('confirm');
                    }else{
                        this.$message({
                            message: "设置标签失败",
                            type: "error"
                        });
                    }
                }).catch(e => {
                    this.$message({
                        message: "设置标签失败",
                        type: "error"
                    });
                });
            }
        },
    }
</script>

<style>
    #hitagdialog .tagdialog .el-dialog__body {
        padding: 8px 0 1px 0;
        /*max-height: 688px;*/
        height: auto;
    }
    #hitagdialog .all_content{
        /*height:364px;*/
        min-height:300px;
        position:relative;
        box-sizing: border-box
    }

    #hitagdialog .typeTag {
        font-size: 16px;
        color: #2D2D2D;
        letter-spacing: 0;
        line-height: 16px;
        margin-bottom: 16px;
    }
    #hitagdialog .tabs-area{
        padding-left: 16px;
        padding-right: 16px;
    }
    #hitagdialog .area-tag{
        /*height: 255px;*/
        overflow-y: auto;
    }
    #hitagdialog .top-tag{
        margin: 0 12px 12px 0;
        cursor:pointer;
    }

    #hitagdialog .selected-panel {
        margin-top: 16px;
        border: none;
        position: absolute;
        bottom:0px;
        width:100%;
    }

    #hitagdialog .selected-panel .el-collapse-item__header {
        height: 48px;
        line-height: 48px;
        border: none;
        background: #F0F5FA;
    }

    #hitagdialog .selected-panel .el-collapse-item__content {
        box-sizing: border-box;
        height: 102px;
        overflow-y: auto;
        padding: 0 16px;
        background: #F0F5FA;
    }

    #hitagdialog .selected-tag {
        margin-right: 12px;
        margin-bottom: 12px;
    }

    #hitagdialog .el-tag--hrline.is-hit {
        border-color: #5CB0E6 !important;
        color: #5CB0E6 !important;
    }

    #hitagdialog .el-tag--hrline {
        background-color: transparent !important;
        border-color: #D2D2D7 !important;
        color: #75787B !important;
    }

    #hitagdialog .el-tag--hrline .el-icon-close {
        color: #C8C8CD !important;
    }

    #hitagdialog .el-tag--hrline .el-tag__close:hover {
        background-color: #D2D2D7 !important;
        color: #fff !important;
    }
</style>