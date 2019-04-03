export default {
    data() {
        const vm = this;
        return {
            // 标题旁的显示图标
            bodyIconsSub: [{
                isShow:false,
                icon: 'plus',
                click: () => {
                    vm.cancelButton = "取消";
                    vm.isShowHeadIcons = {};
                    vm.isShowJobLevelIcons = {};
                    vm.$refs.ref_poststd_levelrelation.getTableComp()
                        .closeExpandRow();
                    // 重置新增数据
                    vm.$refs.ref_poststd_levelrelation.resetFormData();
                    // 显示新增区域
                    vm.$refs.ref_poststd_levelrelation.formShow = true;
                    vm.poststdSubEdit = true;
                    //把已经选过的职级放入参数中
                    vm.requestpoststdSerSub;
                    var pkjobLevels = vm.$refs.ref_poststd_levelrelation.getData('paramsJobLevels').pk_joblevels;
                    //取出主表中的职级 pk_job
                    var pk_job = this.$refs.ref_poststd.getData('poststd').pk_job;

                    var  series =  vm.$refs.ref_poststd.getData('poststd').pk_postseries;
                    if(pk_job){
                        vm.$refs.ref_poststd_levelrelation.setData('paramsJobLevels', {
                            pk_joblevels: pkjobLevels, pk_job: pk_job
                        });
                    }else{
                        vm.$refs.ref_poststd_levelrelation.setData('paramsJobLevels', {
                            pk_joblevels: pkjobLevels, pk_postseries: this.selectedpostSeries
                        });
                    }
                    //职等第一次过滤，传入pk_job或者岗位序列主键
                    if(pk_job){
                        vm.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                            pk_job: pk_job
                        });
                    }else{
                        vm.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                            pk_postseries:series
                        });
                    }
                }
            }],
            // UI模板传入参数
            // pk_tempsub: '0001AA1000000000LGIV',
            poststdSubEdit: false,
            tableOperVif:true,
            deleteVo: '',
            poststdSerBaseData: '',
            poststdSerSubEditIndex: -1,
            bodystatus: 2, //1,update;2,new;3,delete
            pk_post_param: '',
            //存储基本信息中所选的职级职等
            selectedJoblevel:'',
            poststdSubData: {
                paramsJobLevels: {
                    pk_joblevels: "",
                    pk_postseries:"",
                    pk_job:""
                },
                paramsJobranks: {
                    pk_joblevel:"",
                    pk_postseries:"",
                    pk_job:""
                },
                paramsJobRank:{
                    pk_jobranks: ""
                },
                rules: {}
            },

            formClickMethods: {
                //职等选择后控制默认职等范围
                triggerHandleForpkjobrank: function (type, data) {
                    var arrJobrankIDs = [];
                    var btRef = vm.$refs.ref_poststd_levelrelation;
                    var currentData = btRef.getData("poststd_levelrelation");
                    data.value.forEach(function (datainner, indexinner) {
                        arrJobrankIDs[indexinner] = datainner.id;
                    });
                    //如果默认职等不等于空而且还在职等列表中
                    if (data.value.length > 0 && currentData.jobrank.toString().indexOf(',') < 0) {
                        currentData.defaultrank = data.value[0].id;
                        currentData.beanMap.defaultrank_ref = currentData.beanMap.jobrank_ref;
                    } else if (currentData.jobrank.toString().indexOf(',') >= 0
                        && arrJobrankIDs.toString().indexOf(btRef.getData("poststd_levelrelation").defaultrank) >= 0) {
                        if ('' == btRef.getData("poststd_levelrelation").defaultrank) {
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
                triggerHandleForDefaultlevelCard: function (type, model) {

                    if (type && type.target && type.target.checked
                        && type.target.checked === true) {
                        var $job_level_t = vm.$refs.ref_poststd_levelrelation.getData("poststd_levelrelation_t");
                        var $job_level = vm.$refs.ref_poststd_levelrelation.getData("poststd_levelrelation")
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
                //传递职级和岗位序列参数到后台，参照有问题，解决后放开
                transtParamForJobrank: function(type,data){
                    var changeDate = vm.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation');
                    changeDate.jobrank = "";
                    changeDate.defaultrank = "";

                    var level = vm.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation').pk_joblevel;
                    var  series =  vm.$refs.ref_poststd.getData('poststd').pk_postseries;
                    var pk_job = vm.$refs.ref_poststd.getData('poststd').pk_job;
                    if(pk_job){
                        vm.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                            pk_joblevel:level , pk_job: pk_job
                        });
                    }else{
                        vm.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                            pk_joblevel:level , pk_postseries: series
                        });
                    }
                    var changeDate = vm.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation');
                    changeDate.joblevel = "";
                }
            },
            poststdLevRankSubFun($node) {
                const $table = this.getNodeById($node, 'poststd_levelrelation_l');
                $table.attr(':show-header', 'false');  //表格表头隐藏

                //修改默认职级的显示 替换列表显示为switch开关控件
                var $jobdefaultlevel = $node.find("[v-if='tableCoulmnVIfdefaultlevel']");
                $jobdefaultlevel.html(
                    '<template scope="scope"><div>{{scope.row.defaultlevel?(scope.row.defaultlevel === true ? "是":"否"):"否" }}' +
                    '</div></template>'
                );
                //职等和默认职等
                var $pkjobrank = $node.find("[v-model='poststd_levelrelation.jobrank']");
                //为属性添加触发事件
                $pkjobrank.attr('v-on:trigger', 'triggerHandleForpkjobrank');
                $pkjobrank.attr(':disabled', "!poststd_levelrelation.pk_joblevel");
                //默认职级 勾选时校验是否有已经勾选为默认职级的
                var $defaultlevelCard = $node.find("[v-model='poststd_levelrelation.defaultlevel']");
                $defaultlevelCard.attr('v-on:change', 'triggerHandleForDefaultlevelCard');

                var $selectedLevel = $node.find("[v-model='poststd_levelrelation.pk_joblevel']");
                $selectedLevel.attr('v-on:change', 'transtParamForJobrank');

                //默认职等
                var $defaultRankList = $node.find("[v-model='poststd_levelrelation.defaultrank']");
                $defaultRankList.attr(':disabled', "!poststd_levelrelation.jobrank");

                const operateArr = [{}];
                if(!this.headEdit){
                    const operateHtml = this.getBaseTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                }
                return $node[0].outerHTML;
            },

        };
    },
    methods: {
        // 初始化加载数据
        requestpoststdSerSub() {
            if(this.$root.$router.currentRoute.params.id){
                this.pk_post_param = this.$root.$router.currentRoute.params.id;
            }
            if (!this.pk_post_param) {
                this.$nextTick(() => {
                    this.$refs.ref_poststd_levelrelation.tableShow = false;
                });
                return;
            }

            this.$http({
                url: '/hrjf/postStd/postStdLevRel/levelRelationList/' + this.pk_post_param ,
                method: "get"
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$nextTick(() => {
                            var jobLevelOriginal = res.data.data;
                            var arrJobLevelIDs = [];
                            var btRef = this.$refs.ref_poststd_levelrelation;
                            if (jobLevelOriginal != null && jobLevelOriginal && jobLevelOriginal.length > 0) {
                                this.bodyShow = true;
                                btRef.tableShow = true;
                                btRef.setData(
                                    'poststd_levelrelation_t',
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
                                    'poststd_levelrelation_t',
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
                    this.requestpoststdInfo();
                    this.requestpoststdDemand();
                    this.requestpoststdSerSub();
                });
        },
        //form点击编辑按钮触发的事件
        poststdJobLevelFormEditClick(){
            this.cancelButton= "取消";
            var rankspar = this.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation').jobrank;
            //修改数据时将当前编辑的职等pks放入参数中
            this.$refs.ref_poststd_levelrelation.setData('paramsJobRank', {pk_jobranks: rankspar});
            this.poststdSubEdit = true;
            this.headEdit = false;  //编辑子表时主表不可以编辑
            this.poststdDemandEdit=false;//编辑子表时主表不可以编辑
            //修改时重新将岗位序列和职级传入到后台
            var level = this.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation').pk_joblevel;
            var  series =  this.$refs.ref_poststd.getData('poststd').pk_postseries;
            var pk_job = this.$refs.ref_poststd.getData('poststd').pk_job;
            if(pk_job){
                this.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                    pk_joblevel:level , pk_job: pk_job
                });
            }else{
                this.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                    pk_joblevel:level , pk_postseries: series
                });
            }

            //把已经选过的职级放入参数中
            var pkjobLevels = this.$refs.ref_poststd_levelrelation.getData('paramsJobLevels').pk_joblevels;

            var pk_job = this.$refs.ref_poststd.getData('poststd').pk_job;
            if(pk_job){
                this.$refs.ref_poststd_levelrelation.setData('paramsJobLevels', {
                    pk_joblevels: pkjobLevels, pk_job: pk_job
                });
            }else{
                this.$refs.ref_poststd_levelrelation.setData('paramsJobLevels', {
                    pk_joblevels: pkjobLevels, pk_postseries: this.selectedpostSeries
                });
            }
        },
        // table行的编辑操作
        poststdSerEditClick(scope) {
            this.isShowHeadIcons = {};
            this.isShowJobLevelIcons = {};
            this.$refs.ref_poststd_levelrelation.getTableComp().expandRow(scope.row);
            this.$refs.ref_poststd_levelrelation.formShow = false;
            this.$refs.ref_poststd_levelrelation.setData('poststd_levelrelation', scope.row);
            this.$refs.ref_poststd_levelrelation.expandRow(scope.row, scope.$index);
            this.poststdSubEdit = true;
            //点击表体编辑时表头设为不可编辑
            this.headEdit = false;
            this.poststdDemandEdit=false;//编辑子表时主表不可以编辑
            this.bodystatus = 1;
            //把已经选过的职级放入参数中
            var pkjobLevels = this.$refs.ref_poststd_levelrelation.getData('paramsJobLevels').pk_joblevels;
            //取出主表中的职级 pk_job
            var pk_job = this.$refs.ref_poststd.getData('poststd').pk_job;
            if(pk_job ){
                this.$refs.ref_poststd_levelrelation.setData('paramsJobLevels', {
                    pk_joblevels: pkjobLevels, pk_job: pk_job
                });
            }else{
                this.$refs.ref_poststd_levelrelation.setData('paramsJobLevels', {
                    pk_joblevels: pkjobLevels, pk_postseries: this.selectedpostSeries
                });
            }
            //修改数据时将当前编辑的职等pks放入参数中
            this.$refs.ref_poststd_levelrelation.setData('paramsJobRank', {pk_jobranks: scope.row.jobrank});
            //修改时重新将岗位序列和职级传入到后台
            var level = this.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation').pk_joblevel;
            var  series =  this.$refs.ref_poststd.getData('poststd').pk_postseries;

            if(pk_job ){
                this.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                    pk_joblevel:level , pk_job: pk_job
                });
            }else{
                this.$refs.ref_poststd_levelrelation.setData('paramsJobranks', {
                    pk_joblevel:level , pk_postseries: series
                });
            }
        },
        poststdSerSubDeleteClick(scope) {
            this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.deleteVo = scope.row;
                this.poststdSerDeleteDialogClick();
            }).catch(() => {
                // 这里加取消逻辑
            });
        },
        // form的保存操作
        poststdSerSubFormConfirm() {
            var vm = this;
            const arrUIData = [];
            if(!vm.pk_post_param){
                vm.pk_post_param = vm.$refs.ref_poststd.getData('poststd').pk_post;
            }
            //最小长度报错，更新后放开
            vm.$refs.ref_poststd_levelrelation.validate((valid) => {
                if (valid) {
                        const omJobLevelData = vm.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation');
                        omJobLevelData.pk_post = vm.pk_post_param;
                        arrUIData[0] =  vm.$refs.ref_poststd.getData('poststd');
                        arrUIData[1] = omJobLevelData;
                    vm.$http({
                            url: '/hrjf/postStd/postStdLevRel/save',
                            method: 'post',
                            traditional: true,
                            data: {
                                arrUIData
                            }
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    vm.$refs.ref_poststd_levelrelation.clearEdit();
                                    vm.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    vm.isShowHeadIcons = vm.headIcons;
                                    vm.isShowJobLevelIcons = vm.bodyIconsSub;
                                    vm.poststdSubEdit = false;
                                    vm.$refs.ref_poststd_levelrelation.formShow = false;
                                    vm.$refs.ref_poststd_levelrelation.tableShow = true;
                                    vm.$refs.ref_poststd_levelrelation.getTableComp().closeExpandRow();
                                    vm.requestpoststdInfo();
                                    vm.requestpoststdDemand();
                                    vm.requestpoststdSerSub();

                                } else {
                                    vm.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch(() => {
                                vm.requestpoststdInfo();
                                vm.requestpoststdDemand();
                                vm.requestpoststdSerSub();
                                vm.$message({
                                    message: '保存失败',
                                    type: 'error'
                                });
                            });
                }
            });
        },
        // form的取消操作
        poststdSerSubFormCancel(type) {
            this.poststdSubEdit = false;
            this.isShowHeadIcons = this.headIcons;
            this.isShowBodyIcons = this.bodyIcons;
            this.isShowJobLevelIcons = this.bodyIconsSub;
            if (type === 'form') {
                this.$refs.ref_poststd_levelrelation.resetFormData();
                this.$refs.ref_poststd_levelrelation.formShow = false;
            }
        },
        //form的删除操作
        poststdjobLevelFormDelete(){
            const $scope = {
                row: this.$refs.ref_poststd_levelrelation.getData('poststd_levelrelation')
            };
            this.poststdSerSubDeleteClick($scope);
        },

        poststdSerDeleteDialogClick() {
            const arrUIData = [];
            arrUIData[0] = this.$refs.ref_poststd.getData('poststd');
            arrUIData[1] = this.deleteVo;
            this.$http({
                url: '/hrjf/postStd/postStdLevRel/delete',
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

                        this.poststdSubEdit = false;
                        this.$refs.ref_poststd_levelrelation.formShow = false;
                        this.$refs.ref_poststd_levelrelation.getTableComp().closeExpandRow();
                        var pk_joblevel_data = this.deleteVo.pk_joblevel;
                        if (this.poststdSubData.paramsJobLevels.pk_joblevels) {
                            this.poststdSubData.paramsJobLevels.pk_joblevels
                                .pop(pk_joblevel_data);
                        }
                        this.$refs.ref_poststd_levelrelation.clearEdit();
                        this.requestpoststdSerSub();
                        this.requestpoststdInfo();
                    } else {
                        this.requestpoststdSerSub();
                        this.requestpoststdInfo();
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(() => {
                    this.requestpoststdSerSub();
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
        }
    }
};
