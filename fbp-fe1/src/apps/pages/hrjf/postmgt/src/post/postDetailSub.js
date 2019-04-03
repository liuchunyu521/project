export default {
    data() {
        const vm = this;
        var postParam = this.$route.query.id;
        var $isNew;
        var $isEdit;
        if(postParam){
            $isNew = false;
            $isEdit = true;
        }else{
            $isNew = true;
            $isEdit = false;
        }
        var $headEdit=false;    //调整进入编辑页时是否是编辑态 false 否  true  是

        return {
            //是否新增态
            isNew:$isNew,
            //是否编辑态
            isEdit:$isEdit,
            // 标题旁的显示图标
            bodyIcons: [
                {
                    icon: 'edit',
                    click: function () {
                        vm.status = 1;
                        vm.postDemandEdit = !vm.postDemandEdit;
                        vm.isShowHeadIcons = {};
                        vm.isShowBodyIcons = {};
                        //新增界面保存之后再修改状态点击取消不跳转到列表界面
                        vm.isNew = false;
                        vm.isEdit = true;
                    }
                }
            ],
            originalHeadValue:{},
            // isShowHeadIcons:{},
            // isShowBodyIcons:{},
            // 基础panel显示图标
            // UI模板所需参数
            // pk_postDemand: '0001AA10000000004V9N',
            postDemandEdit:$isNew,
            postDemandData: {},
            postUrlParam:postParam,
            pk_post:'',
            postDemandResetFun: function ($node) {
                    return $node[0].outerHTML;
                }
            }
    },

    methods: {
        // 获取数据
        requestPostDemand() {
        },

        // 基本信息取消按钮操作
        postDemandCancel() {
           // this.requestPostInfo();
            this.postDemandEdit = false;
            this.isShowHeadIcons = this.headIcons;
            this.isShowBodyIcons = this.bodyIcons;
            this.$refs.ref_postdemand.resetFormData();
            this.$refs.ref_postdemand.setData("post_demands"
                , JSON.parse(JSON.stringify(this.originalHeadValue)));
        },
        // 基本信息保存按钮操作
        postDemandSave() {
            const data = this.$refs.ref_postdemand.getData('post_demands');
            data.status = this.status;
            this.$refs.ref_postdemand.validate((valid) => {
                if (valid) {
                    this.$http({
                        url: '/hrjf/post/savePost',
                        method: 'post',
                        data: data
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                // this.$refs.ref_postdemand.clearEdit();
                                this.headEdit = false;
                                this.postDemandEdit = false;
                                this.isShowHeadIcons = this.headIcons;
                                this.isShowBodyIcons = this.bodyIcons;
                                this.bodyShow = true;
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.originalHeadValue = res.data.data;
                                this.$refs.ref_postdemand.setData(
                                    'post_demands',
                                    // JSON.parse(JSON.stringify(this.originalHeadValue))
                                    res.data.data
                                );
                                this.$refs.ref_post.clearEdit();
                                this.$refs.ref_postdemand.clearEdit();
                                this.$refs.ref_post_levelrelation.clearEdit();
                                this.request();
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                        })
                        .catch((er) => {
                            this.$message({
                                message: '更新失败'+er,
                                type: 'error'
                            });
                        });
                }
            });
        },
    }
};