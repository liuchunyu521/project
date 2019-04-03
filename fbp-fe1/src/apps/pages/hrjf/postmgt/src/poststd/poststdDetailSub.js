export default {
    data() {
        const vm = this;
        var poststdParam = this.$root.$router.currentRoute.params.id;
        var $isNew;
        var $isEdit;
        if(poststdParam){
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
                        vm.poststdDemandEdit = !vm.poststdDemandEdit;
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
            // pk_poststdDemand: '0001AA10000000004V9N',
            poststdDemandEdit:$isNew,
            poststdDemandData: {},
            poststdUrlParam:poststdParam,
            pk_poststd:'',
            poststdDemandResetFun: function ($node) {
                    return $node[0].outerHTML;
                }
            }
    },

    methods: {
        // 获取数据
        requestpoststdDemand() {
        },

        // 基本信息取消按钮操作
        poststdDemandCancel() {
           // this.requestpoststdInfo();
            this.poststdDemandEdit = false;
            this.isShowHeadIcons = this.headIcons;
            this.isShowBodyIcons = this.bodyIcons;
            this.$refs.ref_poststddemand.resetFormData();
            this.$refs.ref_poststddemand.setData("poststd_demands"
                , JSON.parse(JSON.stringify(this.originalHeadValue)));
        },
        // 基本信息保存按钮操作
        poststdDemandSave() {
            const data = this.$refs.ref_poststddemand.getData('poststd_demands');
            data.status = this.status;
            this.$refs.ref_poststddemand.validate((valid) => {
                if (valid) {
                    this.$http({
                        url: '/hrjf/postStd/savePost',
                        method: 'post',
                        data: data
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                // this.$refs.ref_poststddemand.clearEdit();
                                this.$refs.ref_poststd.clearEdit();
                                this.$refs.ref_poststddemand.clearEdit();
                                this.headEdit = false;
                                this.poststdDemandEdit = false;
                                this.isShowHeadIcons = this.headIcons;
                                this.isShowBodyIcons = this.bodyIcons;
                                this.bodyShow = true;
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.pk_poststd =  res.data.data.pk_post;
                                this.originalHeadValue = res.data.data;
                                this.$refs.ref_poststddemand.setData(
                                    'poststd_demands',
                                    // JSON.parse(JSON.stringify(this.originalHeadValue))
                                    res.data.data
                                );
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