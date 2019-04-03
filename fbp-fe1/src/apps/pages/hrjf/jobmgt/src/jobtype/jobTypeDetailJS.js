export default {
    data() {
        const vm = this;
        return {
            // 标题旁的显示图标
            jobTypeLevelIcons: [{
                icon: 'plus',
                click: () => {
                    //将表头数据放入参照参数中
                    if (!vm.$refs.ref_jobtype_c.getData("jobtype").pk_joblevelsys
                        || vm.$refs.ref_jobtype_c.getData("jobtype").pk_joblevelsys.length <= 0) {
                        vm.$alert('请先选择基本信息中的[职级类别]', '提示信息', {
                            confirmButtonText: '确定',
                        });
                        return;
                    }
                    vm.$refs.ref_jobtype_levelrelation.getTableComp()
                        .closeExpandRow();
                    // 重置新增数据
                    vm.$refs.ref_jobtype_levelrelation.resetFormData();

                    var btRef = vm.$refs.ref_jobtype_levelrelation;
                    var pkJobLevels = btRef.getData('paramsJobLevelSys').pk_joblevels;
                    btRef.setData('paramsJobLevelSys', {
                        pk_joblevelsys: vm.$refs.ref_jobtype_c.getData("jobtype").pk_joblevelsys
                        , pk_joblevels: pkJobLevels
                    });
                    // 显示新增区域
                    vm.$refs.ref_jobtype_levelrelation.formShow = true;
                    vm.jobTypeLevelEdit = true;
                    // }
                }
            }],
            // UI模板传入参数
            // jobTypeLevelPk: '0001AA1000000000PVC5',
            pk_levelrelation: '',
            jobTypeLevelEdit: false,
            tableOperVif:true,
            jobLevelRowData: {},
            jobTypeLevelBaseData: {},
            //保存职级编辑行索引，方便取消恢复备份数据
            jobTypeLevelEditIndex: -1,
            jobTypeLevelData: {
                jobtype_levelrelation: {},
                paramsJobLevelSys: {
                    pk_joblevelsys: "",
                    pk_JobLevels: ""
                },
                paramsJobRank: {
                    pk_jobranks: "",
                },
                rules: {
                    jobrank: [{
                        required: false,
                        trigger: "blur",
                        validator(rule, value, callback) {
                            var errors = [];
                            var $jobtype_levelrelation = vm.$refs.ref_jobtype_levelrelation.getData("jobtype_levelrelation");
                            if (!value) {
                                $jobtype_levelrelation.defaultrank = "";
                            }
                            callback(errors);
                        }
                    }]
                }
            },
            formMethods4Child: {
                //职级选择后
                jobtype4pkjobTypeLevel: function (type, data) {

                },
                //职等选择后控制默认职等范围
                jobtype4pkjobrank: function (type, data) {
                    var arrJobrankIDs = [];
                    var btRef = vm.$refs.ref_jobtype_levelrelation;
                    var currentData = btRef.getData("jobtype_levelrelation");
                    data.value.forEach(function (datainner, indexinner) {
                        arrJobrankIDs[indexinner] = datainner.id;
                    });
                    //如果默认职等不等于空而且还在职等列表中
                    if (data.value.toString().length > 0 && currentData.jobrank.toString().indexOf(',') < 0) {
                        currentData.defaultrank = data.value[0].id;
                        currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                    } else if (currentData.jobrank.toString().indexOf(',') >= 0
                        && arrJobrankIDs.toString().indexOf(btRef.getData("jobtype_levelrelation").defaultrank) >= 0) {
                        if ('' == btRef.getData("jobtype_levelrelation").defaultrank) {
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
                jobtype4DefaultlevelCard: function (type, model) {
                    if (type && type.target && type.target.checked && type.target.checked === true) {
                    // if (type === true) {
                        var $jobtype_level_t = vm.$refs.ref_jobtype_levelrelation.getData("jobtype_levelrelation_t");
                        var $jobtype_level = vm.$refs.ref_jobtype_levelrelation.getData("jobtype_levelrelation")
                        //保存默认职级的值，如果有两个为true那么提示不能有两个默认职级
                        var arrDefaultlevel = [];
                        var arrIndex = 0;
                        //记录当前修改行的索引
                        var currentIndex = 0;
                        $jobtype_level_t.forEach(function (data, index) {
                            if (data.pk_levelrelation === vm.jobLevelRowData.pk_levelrelation) {
                                currentIndex = index;
                            }
                            if (data.defaultlevel === true || data.defaultlevel === "true") {
                                arrDefaultlevel[arrIndex++] = data.defaultlevel;
                            }
                            //如果是新增职级职等，卡片界面主键为空且列表中有默认职级给出提示
                            if (!$jobtype_level.pk_levelrelation && arrDefaultlevel.length >= 1) {
                                $jobtype_level.defaultlevel = false;
                                vm.$alert('默认职级只能有一个！', '提示信息', {
                                    confirmButtonText: '确定',
                                });
                            }else if (arrDefaultlevel && arrDefaultlevel.length >= 2) {
                                $jobtype_level_t[currentIndex].defaultlevel = false;
                                vm.$alert('默认职级只能有一个！', '提示信息', {
                                    confirmButtonText: '确定',
                                });
                            }
                        });
                    }
                }
            },
            jobTypeLevelResetFun($node) {

                //卡片 默认职级 勾选时校验是否有已经勾选为默认职级的 文本id：he3ou3x6z7 输入框id:zg36yv2g2r
                // var $defaultlevelCard = this.getNodeById($node, 'zg36yv2g2r');
                var $defaultlevelCard = $node.find("[v-model='jobtype_levelrelation.defaultlevel']");

                $defaultlevelCard.attr('v-on:change', 'jobtype4DefaultlevelCard');

                //职级 9rkwaxseorb/qrojjbrkg3
                var $pkjoblevel = this.getNodeById($node, 'qrojjbrkg3');
                //为属性添加触发事件
                $pkjoblevel.attr('v-on:trigger', 'jobtype4pkjobTypeLevel');

                //职等
                var $pkjobrank = this.getNodeById($node, 'sp1d5ip9n');
                //为属性添加触发事件
                $pkjobrank.attr('v-on:trigger', 'jobtype4pkjobrank');

                //列表 默认职级
                var $defaultlevel = this.getNodeById($node, 'pn209a0x4bo');
                //替换列表显示为switch开关控件
                $defaultlevel.html(
                    '<template scope="scope"><div>{{scope.row.defaultlevel?(scope.row.defaultlevel === true ? "是":"否"):"否" }}' +
                    // '<el-switch v-model="scope.row.defaultlevel"  on-color="#13ce66" off-color="#ff4949" :on-value="true" :off-value="false" on-text="是" off-text="否">' +
                    // '</el-switch>' +
                    '</div></template>'
                );
                //列名是否显示
                var operateArr = [];
                var operateHtml = this.getBaseTableOperateHtml(operateArr);
                var $table = this.getNodeById($node, 'jobtype_levelrelation_l');
                //子表不显示表头
                $table.attr(':show-header', 'false');
                $table.append(operateHtml);
                return $node[0].outerHTML;
            }
        };
    },
    methods: {
        // 初始化加载数据
        requestJobLeveRelation() {
            this.jobTypeLevelEdit = false;
            if (this.$root.$router.currentRoute.params.id) {
                this.pk_jobType = this.$root.$router.currentRoute.params.id;
            }
            if (!this.pk_jobType) {
                this.$nextTick(() => {
                    this.$refs.ref_jobtype_levelrelation.tableShow = false;
                });
                return;
            }
            this.$http({
                url: '/hrjf/jobType/jobTypeLrRelation/pageListByHeadPk/' + this.pk_jobType,
                method: 'get'
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            var jobTypeLevelOriginal = res.data.data;
                            if (jobTypeLevelOriginal != null && jobTypeLevelOriginal && jobTypeLevelOriginal.length > 0) {
                                this.bodyShow = true;
                                this.$refs.ref_jobtype_levelrelation.tableShow = true;
                                this.$refs.ref_jobtype_levelrelation.setData(
                                    'jobtype_levelrelation_t',
                                    JSON.parse(JSON.stringify(jobTypeLevelOriginal))
                                );
                                //表头更换职级类别后取消使用
                                this.originalBodyValue = JSON.parse(JSON.stringify(jobTypeLevelOriginal));
                                //过滤职级
                                var arrJobLevelIDs = [];
                                var btRef = this.$refs.ref_jobtype_levelrelation;
                                jobTypeLevelOriginal.forEach(function (datainner, indexinner) {
                                    arrJobLevelIDs[indexinner] = datainner.pk_joblevel;
                                });
                                btRef.setData('paramsJobLevelSys', {pk_joblevels: arrJobLevelIDs});
                            } else {
                                this.bodyShow = true;
                                this.$refs.ref_jobtype_levelrelation.tableShow = false;
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
        jobTypeLevelRowClick(scope){
            this.jobTypeLevelEdit = false;
        },
        // table行的编辑操作
        jobTypeLevelPanelEditClick(scope) {
            this.$refs.ref_jobtype_levelrelation.expandRow(scope.row,scope.$index);

            // 备份数据
            // this.jobLevelRowData = scope.row;
            // this.jobTypeLevelBaseData = JSON.parse(JSON.stringify(
            //     this.$refs.ref_jobtype_levelrelation.getData('jobtype_levelrelation_t')));
            // this.jobTypeLevelEditIndex = scope.$index;
            this.jobTypeLevelEdit = true;
            this.jobTypeEdit = false;
            var btRef = this.$refs.ref_jobtype_levelrelation;
            var pkJobLevels = btRef.getData('paramsJobLevelSys').pk_joblevels;
            btRef.setData('paramsJobLevelSys', {
                pk_joblevelsys: this.$refs.ref_jobtype_c.getData("jobtype").pk_joblevelsys
                , pk_joblevels: pkJobLevels
            });
            //修改数据时将当前编辑的职等pks放入参数中
            btRef.setData('paramsJobRank', {pk_jobranks: scope.row.jobrank});
        },
        // form数据编辑操作
        jobTypeLevelPanelFormEditClick(type) {
            var btRef = this.$refs.ref_jobtype_levelrelation;
            this.jobTypeLevelEdit = true;
            this.jobLevelRowData = btRef.getData("jobtype_levelrelation");
            this.jobTypeLevelBaseData = JSON.parse(JSON.stringify( btRef.getData("jobtype_levelrelation_t")));
            var pkJobLevels = btRef.getData('paramsJobLevelSys').pk_joblevels;
            //职级过滤
            btRef.setData('paramsJobLevelSys', {
                pk_joblevelsys: this.$refs.ref_jobtype_c.getData("jobtype").pk_joblevelsys
                , pk_joblevels: pkJobLevels
            });
            //默认职等过滤
            btRef.setData('paramsJobRank', {pk_jobranks: this.jobLevelRowData.jobrank});

        },
        // form的删除操作
        jobTypeLevelFormDelete(type, row) {
            const $scope = {
                row: row
            };
            this.jobTypeLevelDeleteClick($scope);
        },
        // table行的删除操作
        jobTypeLevelDeleteClick(scope) {
            this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.pk_levelrelation = scope.row.pk_levelrelation;
                this.jobTypeLevelDeleteDialogClick();
            }).catch(() => {
                // 这里加逻辑
            });
        },
        // form的保存操作
        jobTypeLevelFormConfirm(type) {
            var data = this.$refs.ref_jobtype_levelrelation.getData("jobtype_levelrelation");
            this.pk_jobType = this.$refs.ref_jobtype_c.getData('jobtype').pk_jobtype;
            if (!data.pk_levelrelation) {
                this.massageError = "保存失败";
                data.status = 2;
            } else {
                data.status = 1;
                this.massageError = "更新失败";
            }
            data.pk_jobtype = this.pk_jobType;
            this.$refs.ref_jobtype_levelrelation.validate(valid => {
                if (valid) {
                    this.$http({
                        url: "/hrjf/jobType/jobTypeLrRelation/save?pk_jobType=" + this.pk_jobType + "&status=" + data.status,
                        method: "post",
                        data: JSON.parse(JSON.stringify(data))
                    })
                        .then((res) => {
                            if (res.data.status === true) {
                                this.$refs.ref_jobtype_levelrelation.clearEdit();
                                this.jobTypeLevelEdit = false;
                                //将编辑界面修改图标显示
                                this.isShowHeadIcons = this.jobTypeIcons;
                                this.isShowBodyIcons = this.jobTypeLevelIcons;
                                this.$message({
                                    message: res.data.msg,
                                    type: "success"
                                });
                                this.originalValue = res.data.data;
                                this.$refs.ref_jobtype_levelrelation.formShow = false;
                                this.$refs.ref_jobtype_levelrelation.tableShow = true;
                                var jobTypeLevelT = this.$refs.ref_jobtype_levelrelation.getData('jobtype_levelrelation_t');
                                jobTypeLevelT[this.jobTypeLevelEditIndex] = this.originalValue;
                                this.$refs.ref_jobtype_levelrelation.setData('jobtype_levelrelation_t', jobTypeLevelT);
                                this.$refs.ref_jobtype_levelrelation.getTableComp()
                                    .closeExpandRow();
                                this.requestJobTypeBaseInfo();
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
        jobTypeLevelFormCancel(type) {
            this.jobTypeLevelEdit = false;
            if (type === 'form') {
                this.$refs.ref_jobtype_levelrelation.resetFormData();
                this.$refs.ref_jobtype_levelrelation.formShow = false;
            }
        },

        jobTypeLevelDeleteDialogClick() {
            const arrUIData = [];
            //this.pk_levelrelation 该主键是点击 jobTypeLevelDeleteClick(scope) 的时候添加进去的
            this.$refs.ref_jobtype_levelrelation.getData('jobtype_levelrelation').pk_levelrelation = this.pk_levelrelation;
            //如果主键不为空，设置status为修改状态NEW：2，update:1 删除态：delete:3
            this.$refs.ref_jobtype_levelrelation.getData('jobtype_levelrelation').status = 3;
            arrUIData[0] = this.$refs.ref_jobtype_c.getData('jobtype');
            arrUIData[1] = this.$refs.ref_jobtype_levelrelation.getData('jobtype_levelrelation');

            this.$http({
                url: '/hrjf/jobType/jobTypeLrRelation/delete',
                method: 'post',
                traditional: true,
                data: {
                    arrUIData
                }
            })
                .then((res) => {
                    //将编辑界面修改图标显示
                    this.isShowHeadIcons = this.jobTypeIcons;
                    this.isShowBodyIcons = this.jobTypeLevelIcons;
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.$refs.ref_jobtype_levelrelation.clearEdit();
                        this.requestJobTypeBaseInfo();
                        this.requestJobLeveRelation();
                        this.jobTypeLevelEdit = false;
                        this.$refs.ref_jobtype_levelrelation.formShow = false;
                        this.$refs.ref_jobtype_levelrelation.getTableComp().closeExpandRow();
                        if (this.jobTypeLevelData.paramsJobLevelSys.pk_joblevels) {
                            this.jobTypeLevelData.paramsJobLevelSys.pk_joblevels
                                .pop(this.$refs.ref_jobtype_levelrelation.getData('jobtype_levelrelation').pk_joblevel);
                        }
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(() => {
                    //将编辑界面修改图标显示
                    this.isShowHeadIcons = this.jobTypeIcons;
                    this.isShowBodyIcons = this.jobTypeLevelIcons;
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
        }
    }
};
