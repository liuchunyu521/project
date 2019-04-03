export default {
    data() {
        const vm = this;
        return {
            // 标题旁的显示图标
            jobLevelIcons: [{
                icon: 'plus',
                click: () => {
                    vm.isShowHeadIcons = {};
                    vm.isShowBodyIcons = {};
                    vm.$refs.ref_job_levelrelation.getTableComp()
                        .closeExpandRow();
                    // 重置新增数据
                    vm.$refs.ref_job_levelrelation.resetFormData();
                    // 显示新增区域
                    vm.$refs.ref_job_levelrelation.formShow = true;
                    vm.jobLevelEdit = true;

                    //把已经选过的职级放入参数中
                    var pkjobLevels = vm.$refs.ref_job_levelrelation.getData('paramsJobLevels').pk_joblevels;
                    var $pkjobtype = vm.$refs.ref_job_c.getData('om_job').pk_jobtype;
                    vm.$refs.ref_job_levelrelation.setData('paramsJobLevels', {
                        pk_joblevels: pkjobLevels, pk_jobtype: $pkjobtype
                    });
                    // //职级选择后将职级主键和职务类别主键放入参数中，作为职等过滤条件
                    // vm.$refs.ref_job_levelrelation.setData('paramsJobRank', {
                    //     pk_jobtype: $pkjobtype,
                    // });
                }
            }],
            // UI模板传入参数
            // jobLevelPk: '0001AA1000000000NZFT',
            pk_levelrelation: '',
            // pkJobrankIsAbleEdit: true,
            jobLevelEdit: false,
            tableOperVif:true,
            jobLevelBaseData: {},
            jobLevelRowData: {},
            //保存职级编辑行索引，方便取消恢复备份数据
            jobLevelEditIndex: -1,
            //是否显示行
            ifExpandRow: false,
            jobLevelData: {
                job_levelrelation: {},
                paramsJobLevels: {
                    pk_JobLevels: "",
                    pk_jobtype: ""
                },
                paramsJobRank: {
                    pk_jobtype: "",
                    pk_joblevel: ""
                },
                paramsDefaultJobRank: {
                    pk_jobranks: "",
                },
                rules: {}
            },
            formMethods4Child: {
                //根据职级过滤职等范围
                triggerHandle4$pkJoblevel: function (type, data) {
                    var btRef = vm.$refs.ref_job_levelrelation;
                    var currentData = btRef.getData("job_levelrelation");
                    if(data.value[0] || currentData.pk_joblevel !== data.value[0].id){
                        currentData.jobrank = "";
                        currentData.defaultrank = "";
                    }
                    btRef.setData('paramsJobRank', {
                        pk_jobtype: vm.$refs.ref_job_c.getData('om_job').pk_jobtype,
                        pk_joblevel: data.value[0]  ?  data.value[0].id : ""
                    });
                },
                //职等选择后控制默认职等范围
                triggerHandle4pkjobrank: function (type, data) {
                    var arrJobrankIDs = [];
                    var btRef = vm.$refs.ref_job_levelrelation;
                    var currentData = btRef.getData("job_levelrelation");
                    data.value.forEach(function (datainner, indexinner) {
                        arrJobrankIDs[indexinner] = datainner.id;
                    });
                    //如果默认职等不等于空而且还在职等列表中
                    if (data.value.length > 0 && currentData.jobrank.toString().indexOf(',') < 0) {
                        currentData.defaultrank = data.value[0] ? data.value[0].id : "";
                        currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                    } else if (currentData.jobrank.toString().indexOf(',') >= 0
                        && arrJobrankIDs.toString().indexOf(btRef.getData("job_levelrelation").defaultrank) >= 0) {
                        if ('' == btRef.getData("job_levelrelation").defaultrank) {
                            currentData.defaultrank = data.value[0] ? data.value[0].id : "";
                            currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                        }
                    } else if (currentData.jobrank.toString().indexOf(',') >= 0) {
                        currentData.defaultrank = data.value[0] ? data.value[0].id : "";
                        currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                    } else {
                        currentData.defaultrank = '';
                    }
                    btRef.setData('paramsDefaultJobRank', {pk_jobranks: arrJobrankIDs.toString()});

                },

                triggerHandle4DefaultlevelCard: function (type, model) {
                    // if (type === true) {
                    if (type && type.target && type.target.checked && type.target.checked === true) {
                        var $job_level_t = vm.$refs.ref_job_levelrelation.getData("job_levelrelation_t");
                        var $job_level = vm.$refs.ref_job_levelrelation.getData("job_levelrelation")
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
                }
            },
            jobLevelResetFun($node) {
                //+++++++++++++++++++++职务子表卡片+++++++++++++++++++++
                //默认职级 勾选时校验是否有已经勾选为默认职级的 文本id：he3ou3x6z7 输入框id:zg36yv2g2r
                // var $defaultlevelCard =this.getNodeById($node, 'he3ou3x6z7');
                var $defaultlevelCard = $node.find("[v-model='job_levelrelation.defaultlevel']");
                $defaultlevelCard.attr('v-on:change', 'triggerHandle4DefaultlevelCard');
                //职级
                var $pkJoblevel = $node.find("[v-model='job_levelrelation.pk_joblevel']");
                $pkJoblevel.attr('v-on:trigger', 'triggerHandle4$pkJoblevel');

                // //职等
                var $pkjobrank = $node.find("[v-model='job_levelrelation.jobrank']");
                $pkjobrank.attr(':disabled', "pkJobrankIsAbleEdit");
                //为属性添加触发事件
                $pkjobrank.attr('v-on:trigger', 'triggerHandle4pkjobrank');

                //默认职等
                var $defaultRankList = $node.find("[v-model='job_levelrelation.defaultrank']");
                $defaultRankList.attr(':disabled', "!job_levelrelation.jobrank");

                //-----------------------职务子表卡片---------------------
                //+++++++++++++++++++++职务子表列表+++++++++++++++++++++
                // 默认职级
                var $jobdefaultlevel = this.getNodeById($node, '02kt48slv0x7');
                //替换列表显示为switch开关控件
                $jobdefaultlevel.html(
                    '<template scope="scope"><div>{{scope.row.defaultlevel?(scope.row.defaultlevel === true ? "是":"否"):"否" }}' +
                    '</div></template>'
                );
                //列名是否显示
                var operateArr = [];
                var operateHtml = this.getBaseTableOperateHtml(operateArr);
                var $table = this.getNodeById($node, 'job_levelrelation_l');
                //子表不显示表头
                $table.attr(':show-header', 'false');
                $table.append(operateHtml);
                return $node[0].outerHTML;
            },
        };
    },
    computed: {

    },
    methods: {
        // 初始化加载数据
        requestJobLeveRelation() {
            this.jobLevelEdit = false;
            if (this.$root.$router.currentRoute.params.id) {
                this.pk_job = this.$root.$router.currentRoute.params.id;
            }
            if (!this.pk_job) {
                this.$nextTick(() => {
                    this.$refs.ref_job_levelrelation.tableShow = false;
                });
                return;
            }
            this.$http({
                url: '/hrjf/job/jobLrRelation/pageListByHeadPk/' + this.pk_job,
                method: 'get'
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            this.jobLevelBaseData = res.data.data;
                            var arrJobLevelIDs = [];
                            var btRef = this.$refs.ref_job_levelrelation;
                            if (this.jobLevelBaseData != null && this.jobLevelBaseData && this.jobLevelBaseData.length > 0) {
                                this.bodyShow = true;
                                this.jobDescShow = true;
                                btRef.tableShow = true;
                                btRef.setData(
                                    'job_levelrelation_t',
                                    JSON.parse(JSON.stringify(this.jobLevelBaseData))
                                );
                                this.jobLevelBaseData.forEach(function (datainner, indexinner) {
                                    arrJobLevelIDs[indexinner] = datainner.pk_joblevel;
                                });
                                // var $pkjobtype = this.$refs.ref_job_c.getData("om_job").pk_jobtype;
                                btRef.setData('paramsJobLevels', {
                                    pk_joblevels: arrJobLevelIDs,
                                    // pk_jobtype: $pkjobtype
                                });

                            } else {
                                this.bodyShow = true;
                                this.jobDescShow = true;
                                btRef.tableShow = false;
                                var btRef = this.$refs.ref_job_levelrelation;
                                    btRef.setData(
                                        'job_levelrelation_t',
                                        []
                                    );
                            }
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
                .catch((e) => {
                    this.$message({
                        message: '获取失败',
                        type: 'error'
                    });
                });
        },
        // table行的点击事件
        jobLevelRowClick(scope){
            this.jobLevelEdit = false;
        },
        // table行的编辑操作
        jobLevelPanelEditClick(scope) {
            this.isShowHeadIcons = {};
            this.isShowBodyIcons = {};
            var btRef = this.$refs.ref_job_levelrelation;

            btRef.expandRow(scope.row,scope.$index)
            // 备份数据
            // this.jobLevelRowData = scope.row;
            // this.jobLevelBaseData = JSON.parse(JSON.stringify(btRef.getData("job_levelrelation_t")));
            // this.jobLevelEditIndex = scope.$index;
            this.jobLevelEdit = true;
            this.jobEdit = false;
            //把已经选过的职级放入参数中
            var pkjobLevels = btRef.getData('paramsJobLevels').pk_joblevels;
            var $pkjobtype = this.$refs.ref_job_c.getData('om_job').pk_jobtype;
            //职级选择后将职级主键和职务类别主键放入参数中，作为职等过滤条件
            btRef.setData('paramsJobRank', {
                pk_jobtype: $pkjobtype,
                pk_joblevel: scope.row.pk_joblevel
            });

            btRef.setData('paramsJobLevels', {pk_joblevels: pkjobLevels, pk_jobtype: $pkjobtype});
            // //修改数据时将当前编辑的职等pks放入参数中
            btRef.setData('paramsDefaultJobRank', {pk_jobranks: scope.row.jobrank});
        },
        // form数据编辑操作
        jobLevelPanelFormEditClick(type) {
            var btRef = this.$refs.ref_job_levelrelation;
            this.isShowHeadIcons = {};
            this.isShowBodyIcons = {};
            this.jobLevelEdit = true;
            //把已经选过的职级放入参数中
            var pkjobLevels = btRef.getData('paramsJobLevels').pk_joblevels;
            var $pkjobtype = this.$refs.ref_job_c.getData('om_job').pk_jobtype;
            btRef.setData('paramsJobLevels', {pk_joblevels: pkjobLevels, pk_jobtype: $pkjobtype});
            this.jobLevelRowData = btRef.getData('job_levelrelation');
            this.jobLevelBaseData = JSON.parse(JSON.stringify(btRef.getData("job_levelrelation_t")));
            btRef.setData('paramsDefaultJobRank', {pk_jobranks: this.jobLevelRowData.jobrank});
            //职级选择后将职级主键和职务类别主键放入参数中，作为职等过滤条件
            btRef.setData('paramsJobRank', {
                pk_jobtype: $pkjobtype,
                pk_joblevel: this.jobLevelRowData.pk_joblevel
            });
        },
        // form的删除操作
        jobLevelFormDeleteClick(type,row) {
            const $scope = {
                row: row
            };
            this.pk_levelrelation = row.pk_levelrelation;
            this.jobLevelRowData = row;
            this.jobLevelDeleteClick($scope);
        },
        // table行的删除操作
        jobLevelDeleteClick(scope) {
            this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.pk_levelrelation = scope.row.pk_levelrelation;
                this.jobLevelRowData = scope.row;
                this.deleteDialogClick();
            }).catch(() => {
                // 这里加取消逻辑
            });
        },
        // form的保存操作
        jobLevelFormConfirm(type) {
            var btRef = this.$refs.ref_job_levelrelation;
            var data = this.$refs.ref_job_levelrelation.getData("job_levelrelation");
            this.pk_job = this.$refs.ref_job_c.getData('om_job').pk_job;
            if (!data.pk_levelrelation) {
                this.massageError = "保存失败";
                data.status = 2;
            } else {
                data.status = 1;
                this.massageError = "更新失败";
            }
            data.pk_job = this.pk_job;
            btRef.validate(valid => {
                if (valid) {
                    this.$http({
                        url: "/hrjf/job/jobLrRelation/save?pk_job=" + this.pk_job + "&status=" + data.status,
                        method: "post",
                        data: JSON.parse(JSON.stringify(data))
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                this.$refs.ref_job_levelrelation.clearEdit();
                                this.$message({
                                    message: res.data.msg,
                                    type: "success"
                                });
                                this.jobLevelEdit = false;
                                //将编辑界面修改图标显示
                                this.isShowHeadIcons = this.jobIcons;
                                this.isShowBodyIcons = this.jobLevelIcons;
                                this.originalValue = res.data.data;
                                btRef.formShow = false;
                                btRef.tableShow = true;
                                var jobLevelT = btRef.getData('job_levelrelation_t');
                                jobLevelT[this.jobLevelEditIndex] = this.originalValue;
                                btRef.setData('job_levelrelation_t', jobLevelT);
                                btRef.getTableComp().closeExpandRow();
                                this.requestJobBaseInfo();
                                this.requestJobLeveRelation();
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        })
                        .catch(() => {
                            this.$message({
                                message: this.massageError,
                                type: "error"
                            });
                        });
                }
            }, type);
        },
        // form的取消操作
        jobLevelFormCancel(type) {
            //将编辑界面修改图标隐藏
            this.jobLevelEdit = false;
            this.isShowHeadIcons = this.jobIcons;
            this.isShowBodyIcons = this.jobLevelIcons;
            if (type === 'form') {
                this.$refs.ref_job_levelrelation.resetFormData();
                this.$refs.ref_job_levelrelation.formShow = false;
            }
        },

        deleteDialogClick() {
            var btRef = this.$refs.ref_job_levelrelation;
            const arrUIData = [];
            //this.pk_levelrelation 该主键是点击 jobLevelDeleteClick(scope) 的时候添加进去的
            btRef.getData('job_levelrelation').pk_levelrelation = this.pk_levelrelation;
            //如果主键不为空，设置status为修改状态NEW：2，update:1 删除态：delete:3
            btRef.getData('job_levelrelation').status = 3;
            arrUIData[0] = this.$refs.ref_job_c.getData('om_job');
            arrUIData[1] = this.jobLevelRowData;

            this.$http({
                url: '/hrjf/job/jobLrRelation/delete',
                method: 'post',
                traditional: true,
                data: {
                    arrUIData
                }
            })
            .then((res) => {
                //将编辑界面修改图标显示
                this.isShowHeadIcons = this.jobIcons;
                this.isShowBodyIcons = this.jobLevelIcons;
                if (res.data.status === true) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.jobLevelEdit = false;
                    btRef.formShow = false;
                    btRef.getTableComp().closeExpandRow();
                    if (this.jobLevelData.paramsJobLevels.pk_joblevels && this.jobLevelData.paramsJobLevels.pk_joblevels instanceof Array) {
                        this.jobLevelData.paramsJobLevels.pk_joblevels.pop(this.jobLevelRowData.pk_joblevel);
                    }else if("string" === typeof this.jobLevelData.paramsJobLevels.pk_joblevels ){

                    }
                    btRef.clearEdit();
                    this.requestJobBaseInfo();
                    this.requestJobLeveRelation();
                } else {
                    this.requestJobBaseInfo();
                    this.requestJobLeveRelation();
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
            .catch(() => {
                //将编辑界面修改图标显示
                this.isShowHeadIcons = this.jobIcons;
                this.isShowBodyIcons = this.jobLevelIcons;
                this.requestJobBaseInfo();
                this.requestJobLeveRelation();
                this.$message({
                    message: '删除失败',
                    type: 'error'
                });
            });
        }
    }
};
