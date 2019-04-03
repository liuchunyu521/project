export default {
    data() {
        const vm = this;
        return {
            // 标题旁的显示图标
            bodyIcons: [{
                isShow: false,
                icon: 'plus',
                click: () => {
                    vm.cancelButton = "取消";
                    vm.isShowHeadIcons = {};
                    vm.isShowBodyIcons = {};
                    vm.isShowMessage = true;
                    vm.joblevelEdit = true;
                    // 关闭table中的编辑区
                    vm.$refs.ref_joblevel.getTableComp().closeExpandRow();
                    // 显示新增区域
                    vm.$refs.ref_joblevel.formShow = true;
                    // 重置新增数据
                    vm.$refs.ref_joblevel.resetFormData();
                }
            }],
            // UI模板传入参数
            // pk_temp_b: '0001AA1000000000LLSF',
            joblevelEdit: false,
            pk_joblevel: '',
            joblevelBaseData: '',
            joblevelEditIndex: -1,
            tableOperVif:true,
            pk_joblevelsys: '',
            joblevelData: {},
            joblevelResetFun($node) {
                const $table = this.getNodeById($node, 'om_joblevel_l');
                //子表不显示表头
                $table.attr(':show-header', 'false');
                const operateArr = [{}];
                if (!this.jobLevelSysEdit) {
                    const operateHtml = this.getBaseTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                }
                return $node[0].outerHTML;
            },
        };
    },
    computed: {
        cancelButton: function () {
            if (this.joblevelEdit) {
                return "取消";
            } else {
                return "删除";
            }
        }
    },
    methods: {
        // 初始化加载数据
        requestJoblevel() {
            this.cancelButton = "删除";
            this.joblevelEdit = false;
            if (this.$root.$router.currentRoute.params.id) {
                this.pk_joblevelsys = this.$root.$router.currentRoute.params.id;
            }
            if (!this.pk_joblevelsys) {
                this.$nextTick(() => {
                    this.$refs.ref_joblevel.tableShow = false;
                });
                return;
            }
            this.$http({
                url: '/hrjf/jobLevelSys/jobLevelSysLevel/getByHeadPk/' + this.pk_joblevelsys,
                method: 'get'
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            const retOriginal = res.data.data;
                            if (!retOriginal || retOriginal.length > 0) {
                                this.bodyShow = true;
                                this.$refs.ref_joblevel.tableShow = true;
                            } else {
                                this.bodyShow = true;
                                this.$refs.ref_joblevel.tableShow = false;
                            }
                            this.$refs.ref_joblevel.setData(
                                'om_joblevel_t',
                                JSON.parse(JSON.stringify(retOriginal))
                            );
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '获取数据失败',
                        type: 'error'
                    });
                    this.requestJoblevelsysInfo();
                    this.requestJoblevel();
                });
        },
        // table行的点击事件
        jobLevelRowClick(scope){
            this.joblevelEdit = false;
        },
        // table行的编辑操作
        joblevelEditClick(scope) {
            this.joblevelEdit = true;
            //点击表体编辑时表头设为不可编辑
            this.jobLevelSysEdit = false;
            this.isShowHeadIcons = {};
            this.isShowBodyIcons = {};
            this.$refs.ref_joblevel.expandRow(scope.row, scope.$index);
            // 备份数据
            // this.joblevelBaseData = JSON.parse(JSON.stringify(scope.row));
            // this.joblevelEditIndex = scope.$index;

        },
        // form对于数据编辑操作
        jobLevelPanelFormEditClick(type) {
            this.isShowHeadIcons = {};
            this.isShowBodyIcons = {};
            this.joblevelEdit = true;
            this.cancelButton = "取消";

        },
        // form的删除操作
        jobLevelFormDelete(type, row) {
            const $scope = {
                row: row
            };
            this.joblevelDeleteClick($scope);
        },
        // table行的删除操作
        joblevelDeleteClick(scope) {
            this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.pk_joblevel = scope.row.pk_joblevel;
                this.joblevelDeleteDialogClick();
            }).catch(() => {
                // 这里加取消逻辑
            });
        },
        // form的保存操作
        joblevelFormConfirm() {
            const arrUIData = [];
            if (!this.pk_joblevelsys) {
                this.pk_joblevelsys = this.$refs.ref_joblevelsys.getData('om_joblevelsys').pk_joblevelsys;
            }
            this.$refs.ref_joblevel.validate((valid) => {
                if (valid) {
                    const omJobLevelData = this.$refs.ref_joblevel.getData('om_joblevel');
                    omJobLevelData.pk_joblevelsys = this.pk_joblevelsys;
                    //如果主键不为空，设置status为修改状态 NEW：2，update:1
                    if (omJobLevelData.pk_joblevel) {
                        omJobLevelData.status = 1;
                    } else {
                        omJobLevelData.status = 2;
                    }
                    arrUIData[0] = this.$refs.ref_joblevelsys.getData('om_joblevelsys');
                    arrUIData[1] = omJobLevelData;
                    this.$http({
                        url: '/hrjf/jobLevelSys/jobLevelSysLevel/save',
                        method: 'post',
                        traditional: true,
                        data: {
                            arrUIData
                        }
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                this.$refs.ref_joblevel.clearEdit();
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.$refs.ref_joblevel.setData(
                                    'om_joblevel_t',
                                    JSON.parse(JSON.stringify(res.data.data))
                                );
                                this.isShowHeadIcons = this.headIcons;
                                this.isShowBodyIcons = this.bodyIcons;
                                this.joblevelEdit = false;
                                this.$refs.ref_joblevel.formShow = false;
                                this.$refs.ref_joblevel.tableShow = true;
                                this.$refs.ref_joblevel.getTableComp().closeExpandRow();
                                this.requestJoblevelsysInfo();
                                this.requestJoblevel();
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                        })
                        .catch(() => {
                            this.requestJoblevelsysInfo();
                            this.requestJoblevel();
                            this.$message({
                                message: '保存失败',
                                type: 'error'
                            });
                        });
                }
            });
        },
        // form的取消操作
        joblevelFormCancel(type) {
            this.joblevelEdit = false;
            if (type === 'form') {
                this.$refs.ref_joblevel.resetFormData();
                this.$refs.ref_joblevel.formShow = false;
            }
        },
        joblevelDeleteDialogClick() {
            const arrUIData = [];
            this.$refs.ref_joblevel.getData('om_joblevel').pk_joblevel = this.pk_joblevel;
            //如果主键不为空，设置status为修改状态NEW：2，update:1 删除态：delete:3
            this.$refs.ref_joblevel.getData('om_joblevel').status = 3;
            arrUIData[0] = this.$refs.ref_joblevelsys.getData('om_joblevelsys');
            arrUIData[1] = this.$refs.ref_joblevel.getData('om_joblevel');
            this.$http({
                url: '/hrjf/jobLevelSys/jobLevelSysLevel/delete',
                method: 'post',
                traditional: true,
                data: {
                    arrUIData
                }
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.$refs.ref_joblevel.clearEdit();
                        this.requestJoblevelsysInfo();
                        this.requestJoblevel();
                        this.joblevelEdit = false;
                        this.$refs.ref_joblevel.formShow = false;
                        this.$refs.ref_joblevel.getTableComp().closeExpandRow();
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
        }
    }
};
