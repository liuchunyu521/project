export default {
    data() {
        const vm = this;
        return {
            // 标题旁的显示图标
            bodyIcons: [{
                isShow:false,
                icon: 'plus',
                click: () => {
                    vm.cancelButton = "取消";
                    vm.isShowHeadIcons = {};
                    vm.isShowBodyIcons = {};
                    vm.$refs.ref_postseries_levelrelation.getTableComp()
                        .closeExpandRow();
                    // 重置新增数据
                    vm.$refs.ref_postseries_levelrelation.resetFormData();
                    // 显示新增区域
                    vm.$refs.ref_postseries_levelrelation.formShow = true;
                    vm.postSeriesSubEdit = true;
                    //把已经选过的职级放入参数中
                    var pkjobLevels = vm.$refs.ref_postseries_levelrelation.getData('paramsJobLevels').pk_joblevels;

                    //把主表中获取职级类别
                    var pkjoblevelsys =  vm.$refs.ref_postseries.getData('postseries').pk_joblevelsys;

                    //把主表中的上级岗位序列主键传入职级参照的参数中
                    var fatherpk = vm.$refs.ref_postseries.getData('postseries').father_pk;
                    //如果有上级序列，目前上级序列优先级大于职级类别
                    if(fatherpk){
                        vm.$refs.ref_postseries_levelrelation.setData('paramsJobLevels', {
                            // pk_joblevels: pkjobLevels, pk_joblevelsys: pkjoblevelsys, pk_postseries:fatherpk
                            pk_joblevels: pkjobLevels, pk_postseries:fatherpk
                        });
                    }else{
                        vm.$refs.ref_postseries_levelrelation.setData('paramsJobLevels', {
                            pk_joblevels: pkjobLevels, pk_joblevelsys: pkjoblevelsys
                        });
                    }

                    //paramsJobranks 过滤职等
                    vm.$refs.ref_postseries_levelrelation.setData('paramsJobranks', {
                        pk_postseries:fatherpk
                    });

                }
            }],
            // UI模板传入参数
            // pk_tempsub: '0001AA1000000000VUSG',
            postSeriesSubEdit: false,
            tableOperVif: true,
            deleteVo: '',
            postSerBaseData: '',
            postSerSubEditIndex: -1,
            bodystatus: 2, //1,update;2,new;3,delete
            pk_postseries: '',
            postSeriesSubData: {
                postseries_levelrelation: {},
                paramsJobLevels: {
                    pk_JobLevels: "",
                    pk_joblevelsys:"",
                    pk_postseries:""
                },
                paramsJobRank: {
                    pk_jobranks: "",
                },
                paramsJobranks: {
                    pk_joblevel:"",
                    pk_postseries:"",
                    pk_job:""
                },
                rules: {}
            },

            formMethodsForClickSeries: {
                //职等选择后控制默认职等范围
                triggerHandleforpkjobrank: function (type, data) {
                    var arrJobrankIDs = [];
                    var btRef = vm.$refs.ref_postseries_levelrelation;
                    var currentData = btRef.getData("postseries_levelrelation");
                    data.value.forEach(function (datainner, indexinner) {
                        arrJobrankIDs[indexinner] = datainner.id;
                    });
                    //如果默认职等不等于空而且还在职等列表中
                    if (data.value.length > 0 && currentData.jobrank.toString().indexOf(',') < 0) {
                        currentData.defaultrank = data.value[0].id;
                        currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                    } else if (currentData.jobrank.toString().indexOf(',') >= 0
                        && arrJobrankIDs.toString().indexOf(btRef.getData("postseries_levelrelation").defaultrank) >= 0) {
                        if ('' == btRef.getData("postseries_levelrelation").defaultrank) {
                            currentData.defaultrank = data.value[0].id;
                            currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                        }
                    } else if (currentData.jobrank.toString().indexOf(',') >= 0) {
                        currentData.defaultrank = data.value[0].id;
                        currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                    } else {
                        currentData.defaultrank = '';
                    }
                    btRef.setData('paramsJobRank', {pk_jobranks: arrJobrankIDs.toString()});

                },
                triggerHandleforDefaultlevelCard: function (type, model) {
                    if (type && type.target && type.target.checked
                        && type.target.checked === true) {
                        var $job_level_t = vm.$refs.ref_postseries_levelrelation.getData("postseries_levelrelation_t");
                        var $job_level = vm.$refs.ref_postseries_levelrelation.getData("postseries_levelrelation");
                        //保存默认职级的值，如果有两个为true那么提示不能有两个默认职级
                        var arrDefaultlevel = [];
                        var arrIndex = 0;
                        //记录当前修改行的索引
                        var currentIndex = -1;
                        $job_level_t.forEach(function (data, index) {
                            if (data.pk_levelrelation === $job_level.pk_levelrelation) {
                                currentIndex = index;
                            }
                            if (data.defaultlevel === true || data.defaultlevel === "true") {
                                arrDefaultlevel[arrIndex++] = data.defaultlevel;
                            }
                            //如果是新增职级职等，卡片界面主键为空且列表中有默认职级给出提示
                            if (!$job_level.pk_levelrelation && arrDefaultlevel.length >= 1) {
                                $job_level.defaultlevel = false;
                                vm.$alert('默认职级只能有一个！', '提示信息', {
                                    confirmButtonText: '确定',
                                });
                            } else if (arrDefaultlevel && arrDefaultlevel.length >= 2) {
                                $job_level.defaultlevel = false;
                                vm.$alert('默认职级只能有一个！', '提示信息', {
                                    confirmButtonText: '确定',
                                });
                            }
                        });
                    }
                },
                clickJobLevelForJobRank : function(type,data){

                    var changeFormData = vm.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation');
                    changeFormData.jobrank = "";
                    changeFormData.defaultrank = "";

                    //把主表中的上级岗位序列主键传入职级参照的参数中
                    var fatherpk = vm.$refs.ref_postseries.getData('postseries').father_pk;
                    //当前行职级
                    var pkjobLevel = vm.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation').pk_joblevel;
                    //过滤职等
                    vm.$refs.ref_postseries_levelrelation.setData('paramsJobranks', {
                        pk_postseries:fatherpk, pk_joblevel:pkjobLevel
                    });

                }

            },
            postSeriesSubFun($node) {
                const $table = this.getNodeById($node, 'postseries_levelrelation_l');
                $table.attr(':show-header', 'false');  //表格表头隐藏

                //修改默认职级的显示 替换列表显示为switch开关控件
                var $jobdefaultlevel = this.getNodeById($node, 'iz07kzysfygkkyfbbc9tl0udi');
                $jobdefaultlevel.html(
                    '<template scope="scope"><div>{{scope.row.defaultlevel?(scope.row.defaultlevel === true ? "是":"否"):"否" }}' +
                    '</div></template>'
                );
                //职等和默认职等
                var $pkjobrank = $node.find("[v-model='postseries_levelrelation.jobrank']");
                //为属性添加触发事件
                $pkjobrank.attr('v-on:trigger', 'triggerHandleforpkjobrank');
                $pkjobrank.attr(':disabled', "!postseries_levelrelation.pk_joblevel");
                //默认职级 勾选时校验是否有已经勾选为默认职级的 文本id：he3ou3x6z7 输入框id:zg36yv2g2r
                var $defaultlevelCard = $node.find("[v-model='postseries_levelrelation.defaultlevel']");
                $defaultlevelCard.attr('v-on:change', 'triggerHandleforDefaultlevelCard');

                var $defaultRankList = $node.find("[v-model='postseries_levelrelation.defaultrank']");
                $defaultRankList.attr(':disabled', "!postseries_levelrelation.jobrank");

                var $jobLevelchange = $node.find("[v-model='postseries_levelrelation.pk_joblevel']");
                $jobLevelchange.attr('v-on:change', 'clickJobLevelForJobRank');

                const operateArr = [{}];
                if(!this.headEdit){
                    const operateHtml = this.getBaseTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                }
                return $node[0].outerHTML;
            },
            // 是否显示删除dialog
            postSerDelDialogVisible: false
        };
    },
    methods: {
        // 初始化加载数据
        requestPostSerSub() {
            if(this.$root.$router.currentRoute.params.id){
                this.pk_postseries = this.$root.$router.currentRoute.params.id;
            }
            if (!this.pk_postseries) {
                this.$nextTick(() => {
                    this.$refs.ref_postseries_levelrelation.tableShow = false;
                });
                return;
            }

            this.$http({
                url: '/hrjf/postSeries/levelRelaltion/levelRelationList/' + this.pk_postseries ,
                method: "get"
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            var jobLevelOriginal = res.data.data;
                            var arrJobLevelIDs = [];
                            var btRef = this.$refs.ref_postseries_levelrelation;
                            if (jobLevelOriginal != null && jobLevelOriginal && jobLevelOriginal.length > 0) {
                                this.bodyShow = true;
                                btRef.tableShow = true;
                                btRef.setData(
                                    'postseries_levelrelation_t',
                                    JSON.parse(JSON.stringify(jobLevelOriginal))
                                );
                                jobLevelOriginal.forEach(function (datainner, indexinner) {
                                    arrJobLevelIDs[indexinner] = datainner.pk_joblevel;
                                });
                                btRef.setData('paramsJobLevels', {pk_joblevels: arrJobLevelIDs});
                            } else {
                                this.bodyShow = true;
                                btRef.tableShow = false;
                                btRef.setData(
                                    'postseries_levelrelation_t',
                                    []
                                );
                                btRef.setData('paramsJobLevels', {pk_joblevels: []});
                            }
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
                    this.requestPostSeriesInfo();
                    this.requestPostSerSub();
                });
        },
        //form行的编辑操作
        jobLevelPostSerEditClick(scope){
            this.postSeriesSubEdit = true;
            this.headEdit =false;
            var pkjobLevels = this.$refs.ref_postseries_levelrelation.getData('paramsJobLevels').pk_joblevels;

            var pkjoblevelsys =  this.$refs.ref_postseries.getData('postseries').pk_joblevelsys;

            //把主表中的上级岗位序列主键传入职级参照的参数中
            var fatherpk = this.$refs.ref_postseries.getData('postseries').father_pk;

            //如果有上级序列，目前上级序列优先级大于职级类别
            if(fatherpk){
                this.$refs.ref_postseries_levelrelation.setData('paramsJobLevels', {
                    // pk_joblevels: pkjobLevels, pk_joblevelsys: pkjoblevelsys, pk_postseries:fatherpk
                    pk_joblevels: pkjobLevels, pk_postseries:fatherpk
                });
            }else{
                this.$refs.ref_postseries_levelrelation.setData('paramsJobLevels', {
                    pk_joblevels: pkjobLevels, pk_joblevelsys: pkjoblevelsys
                });
            }

            //过滤当前职等，将当前行职级和上级序列传入参数中
            var pkjobLevel = this.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation').pk_joblevel;
            this.$refs.ref_postseries_levelrelation.setData('paramsJobranks', {
                pk_postseries:fatherpk, pk_joblevel:pkjobLevel
            });

            var rankspar = this.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation').jobrank;
            //修改数据时将当前编辑的职等pks放入参数中
            this.$refs.ref_postseries_levelrelation.setData('paramsJobRank', {pk_jobranks: rankspar});
        },
        // table行的编辑操作
        postSerEditClick(scope) {
            this.isShowHeadIcons = {};
            this.isShowBodyIcons = {};
            this.$refs.ref_postseries_levelrelation.getTableComp().expandRow(scope.row);
            this.$refs.ref_postseries_levelrelation.formShow = false;
            this.$refs.ref_postseries_levelrelation.setData('postseries_levelrelation', scope.row);
            this.$refs.ref_postseries_levelrelation.expandRow(scope.row, scope.$index);
            this.postSeriesSubEdit = true;
            //点击表体编辑时表头设为不可编辑
            this.headEdit = false;
            this.bodystatus = 1;
            // 备份数据
            this.postSerBaseData = JSON.parse(JSON.stringify(scope.row));
            this.postSerSubEditIndex = scope.$index;
            //把已经选过的职级放入参数中
            var pkjobLevels = this.$refs.ref_postseries_levelrelation.getData('paramsJobLevels').pk_joblevels;


            var pkjoblevelsys =  this.$refs.ref_postseries.getData('postseries').pk_joblevelsys;


            //把主表中的上级岗位序列主键传入职级参照的参数中
            var fatherpk = this.$refs.ref_postseries.getData('postseries').father_pk;

            //如果有上级序列，目前上级序列优先级大于职级类别
            if(fatherpk){
                this.$refs.ref_postseries_levelrelation.setData('paramsJobLevels', {
                    // pk_joblevels: pkjobLevels, pk_joblevelsys: pkjoblevelsys, pk_postseries:fatherpk
                    pk_joblevels: pkjobLevels, pk_postseries:fatherpk
                });
            }else{
                this.$refs.ref_postseries_levelrelation.setData('paramsJobLevels', {
                    pk_joblevels: pkjobLevels, pk_joblevelsys: pkjoblevelsys
                });
            }

            //过滤当前职等，将当前行职级和上级序列传入参数中
            var pkjobLevel = this.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation').pk_joblevel;
            this.$refs.ref_postseries_levelrelation.setData('paramsJobranks', {
                pk_postseries:fatherpk, pk_joblevel:pkjobLevel
            });

            //修改数据时将当前编辑的职等pks放入参数中
            this.$refs.ref_postseries_levelrelation.setData('paramsJobRank', {pk_jobranks: scope.row.jobrank});

        },
        postSerSubDeleteClick(scope) {
            this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.postSerDelDialogVisible = true;
                this.deleteVo = scope.row;
                this.postSerDeleteDialogClick();
            }).catch(() => {
                // 这里加取消逻辑
            });
        },
        // form的保存操作
        postSerSubFormConfirm() {
            const arrUIData = [];
            if(!this.pk_postseries){
                this.pk_postseries = this.$refs.ref_postseries.getData('postseries').pk_postseries;
            }
            this.$refs.ref_postseries_levelrelation.validate((valid) => {
                if (valid) {
                    const omJobLevelData = this.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation');
                    omJobLevelData.pk_postseries = this.pk_postseries;
                    //如果主键不为空，设置status为修改状态 NEW：2，update:1
                    if (omJobLevelData.pk_levelrelation) {
                        omJobLevelData.status = 1;
                    } else {
                        omJobLevelData.status = 2;
                    }
                    arrUIData[0] = this.$refs.ref_postseries.getData('postseries');
                    arrUIData[1] = omJobLevelData;
                    this.$http({
                        url: '/hrjf/postSeries/levelRelaltion/save',
                        method: 'post',
                        traditional: true,
                        data: {
                            arrUIData
                        }
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                this.$refs.ref_postseries_levelrelation.clearEdit();
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.isShowHeadIcons = this.headIcons;
                                this.isShowBodyIcons = this.bodyIcons;
                                this.postSeriesSubEdit = false;
                                this.$refs.ref_postseries_levelrelation.formShow = false;
                                this.$refs.ref_postseries_levelrelation.tableShow = true;
                                this.$refs.ref_postseries_levelrelation.getTableComp().closeExpandRow();
                                this.requestPostSeriesInfo();
                                this.requestPostSerSub();
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                        })
                        .catch(() => {
                            this.requestPostSeriesInfo();
                            this.requestPostSerSub();
                            this.$message({
                                message: '保存失败',
                                type: 'error'
                            });
                        });
                }
            });
        },
        //form的删除操作
        postSeriesjobLevelFormDelete(){
            const $scope = {
                row: this.$refs.ref_postseries_levelrelation.getData('postseries_levelrelation')
            };
            this.postSerSubDeleteClick($scope);
        },
        // form的取消操作
        postSerSubFormCancel(type) {
            this.postSeriesSubEdit = false;
            this.isShowHeadIcons = this.headIcons;
            this.isShowBodyIcons = this.bodyIcons;
            if (type === 'form') {
                this.$refs.ref_postseries_levelrelation.resetFormData();
                this.$refs.ref_postseries_levelrelation.formShow = false;
            }
        },
        postSerDeleteDialogClick() {
            const arrUIData = [];
            arrUIData[0] = this.$refs.ref_postseries.getData('postseries');
            arrUIData[1] = this.deleteVo;;
            this.$http({
                url: '/hrjf/postSeries/levelRelaltion/delete',
                method: 'post',
                traditional: true,
                data: {
                    arrUIData
                }
            })
                .then((res) => {
                    this.isShowHeadIcons = this.headEdit;
                    this.isShowBodyIcons = this.bodyIcons;
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.$refs.ref_postseries_levelrelation.clearEdit();
                        this.requestPostSeriesInfo();
                        this.requestPostSerSub();
                        this.postSeriesSubEdit = false;
                        this.$refs.ref_postseries_levelrelation.formShow = false;
                        this.$refs.ref_postseries_levelrelation.getTableComp().closeExpandRow();
                        if (this.postSeriesSubData.paramsJobLevels.pk_joblevels) {
                            this.postSeriesSubData.paramsJobLevels.pk_joblevels
                                .pop(this.deleteVo.pk_joblevel);
                        }
                    } else {
                        this.requestPostSeriesInfo();
                        this.requestPostSerSub();
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            this.postSerDelDialogVisible = false;
        }
    }
};
