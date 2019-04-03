<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="薪资方案" v-show="false"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area  :no-breadcrumb="true">
            <hr-org-cascader name="hrwawaclasslist"
                            :pk_org="pk_org"
                            @update:pk_org="updateOrgPk"
                            :needDept="false"
                            @change="handleTreeChange"
                            :needGroup="true"
                            busiRegion="salary"
                            >
            </hr-org-cascader>
          
            <ifbp-search class="fr"
                        :no-breadcrumb-search="true"
                        :template-code="waclassSearchCode"
                        @search="handleSearch">
            </ifbp-search>
            
        </ifbp-button-area>
        
        <!-- 主体区域 -->
        <ifbp-main-area type="list" class="maringTop0">
            <div class="fl">
	            <span class="ifbp-layout-content-left-span">薪资方案</span>
          	</div>
            <div align="right" class="top-button">
                <el-button type="text" v-for="item in mainTitleBtns"  @click="triggerClick(item)"  class="ifbp-layout-content-right-button marginleft24" v-text="item.displayname"></el-button>
            </div>
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_waclass_l"
                           tpl-id="listPanel"
                           :tpl-data="tableData"
                           class="uitemplate-no-top"
                           :editable="true"
                           :tplResetFun="waclassTableResetFun"
                           :methods="waclassTableMethods"
                           @selection-change="waclassSelectionChange"
                           @edit-table-click="waclassTableEditClick"
                           @delete-table-click="waclassTableDeleteClick">
            </ifbp-template>
            <!--分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
        </ifbp-main-area>

        <el-dialog title="启用"  v-model="dialogFormVisible" size="tiny" :before-close="onDialogCancle" class="as">
            <el-form label-width="90px"> <!--20 80-->
                <el-form-item label="启用日期">
                    <el-col :span="11">
                        <el-date-picker
                                v-model="unsealdate"
                                type="date"
                                placeholder="选择日期"
                                width="80px"
                                :valuetoms="true"
                        >
                        </el-date-picker>
                   </el-col >
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onDialogCancle()">取 消</el-button>
                <el-button type="primary" @click="onDialogConfirm()">确 定</el-button>
            </div>
        </el-dialog>
        <!--删除确认Dialog-->
        <ifbp-del-dialog
                v-model="delDialogVisible"
                message="确认删除该数据？删除后无法恢复。"
                @click="deleteClick"
        >
        </ifbp-del-dialog>

        <ifbp-del-dialog
                v-model="confirmVisible"
                message="waclassMessage"
                @click="confirmVisible=false"
        >
        </ifbp-del-dialog>

        <ifbp-del-dialog
                v-model="multiDelDialogVisible"
                message="确认删除所选数据？删除后无法恢复。"
                @click="multiDeleteClick"
        >
        </ifbp-del-dialog>
        <el-dialog title="方案分配" v-model="dialogAllotVisible" @open="initDialog()">
            <el-form label-width="80px" :model="WaClassAllotVO" ref="ref_waclass_allot">
                <el-row >
                    <el-col :span="12">
                        <el-form-item label="分配方案" prop="name">
                            <el-input :editable="false" v-model="WaClassAllotVO.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="起始期间" prop="startperiod">
                            <el-select placeholder="请选择活动区域" v-model="WaClassAllotVO.startperiod" @change="periodChange">
                                <el-option
                                        v-for="period in periods"
                                        :key="period.value"
                                        :label="period.label"
                                        :value="period.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<el-search-form class="fr" size="small">-->
                        <!--</el-search-form>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>

            <ifbp-template ref="ref_allot"
                           tpl-id="allot"
                           :pk-temp="pk_tempallot"
                           :tpl-data="waclassAllotData"
                           show-type="table"
                           :editable="true"
                           :table-show-menu="false"
                           :tplResetFun="waclassAllotResetFun"
                           :methods="waclassAllotMethods"
            >
            </ifbp-template>
            <ifbp-button-area align="right">
                <el-button type='default' @click='cancleAllotDialog'>
                    <!--dialogShow=false,dialogAllotVisible=false-->
                    取消
                </el-button>
                <el-button type='primary'  @click='confirmAllotDialog'>确定</el-button>
            </ifbp-button-area>
        </el-dialog>
    </ifbp-page>

    </div>
</template>

<script>
    import waclassAllotDialog from "./waclass-allot-dialog.js";

    // 引入页面定制需要的方法
    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    let HrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];
   
    export default {
        mixins: [pageModelMixin,waclassAllotDialog],
        components: {
            HrOrgCascader,
        },
        
        data() {
            var vm = this;
            return {
                // 查询模板编码
                waclassSearchCode: '60130waclass',
                mainTitleBtns:[],
                searchTemplate:{},
                // UI模板传入参数
                // pk_temptable: "0001AA1000000000XQIM",
                tableData: {},
                dialogAllotVisible: false,
                confirmVisible: false,
                waclassMessage: "",
                pk_org:'',

                waclassTableResetFun: function ($node) {
                    var $table = this.getTableDom($node);
                    $table.attr(':show-header', 'true');
                    $table.attr('v-on:row-dblclick', 'waclassDbClick');
                    var operateArr = [{
                        title: '编辑',
                        icon: 'edit',
                        vif:"!(scope.row.isEditable||scope.row.stopflag)"
                    },{
                        title: '删除',
                        icon: 'delete',
                        vif:"!scope.row.isDelable"
                    },{
                        title: '分配',
                        icon: 'swap-horiz',
                        click: "fenPei",
                        vif:"!(scope.row.stopflag || scope.row.pk_org!=scope.row.pk_group)"
                    },{
                        title: '薪资发放项目',
                        icon: 'description',
                        click: "payItem",
                        vif:"scope.row.cyear"
                    }];

                    // 方案编码
                    let code = $node.find("[prop='code']");
                    code.html(
                        '<template scope="scope">' +
                        '<a href="javascript:void(0);" @click="wacalssCodeClick(scope)">{{scope.row.code}}</a>' +
                        '</template>'
                    );

                    //得到列表单个属性控件
                    var $defaultlevelTable = $node.find("[prop='stopflag']");
                    //替换列表显示为switch开关控件
                    $defaultlevelTable.attr('render-type', 'default');
                    $defaultlevelTable.html(
                        '<template scope="scope" >' +
                        '<el-switch @change="handleChange(scope.row)" v-model="scope.row.stopflag"  on-color="#AFAFAF" off-color="#4BD762" :on-value="true" :off-value="false" on-text=" " off-text=" "> </el-switch>' +
                        '</template>'
                    );

                    var operateHtml = this.getTableOperateHtml(operateArr);
//                    var operateHtml = this.getBaseTableOperateHtml(operateArr);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                waclassTableMethods: {
                    payItem(scope){
                        let waclass = scope.row;

                        if(!waclass.cyear){
                            this.$message({
                                message: "该方案没有设置起始期间不允许编辑薪资发放项目",
                                type: "error"
                            });
                            return;
                        }
                        let pk_org_name = waclass.beanMap.pk_org_ref[waclass.pk_org].name;
                        let pk_group_name = waclass.beanMap.pk_group_ref[waclass.pk_group].name;
                        let url = "/hrwa/payitem/info/" + waclass.pk_wa_class + "/" + waclass.pk_group + "/" + waclass.pk_org + "/" + waclass.cyear + "/" + waclass.cperiod.substr(5) + "/" + waclass.name + "/" + pk_group_name + "/" + pk_org_name+"?funcode=60130payitem";
                        vm.$router.push(url);
                    },
                    fenPei(scope) {
                        if (scope.row.pk_group != scope.row.pk_org) {
                            this.$alert('集团的方案才能分配', {
                                confirmButtonText: '确定',
                            });
                            return
                        }

                        if (scope.row.stopflag) {
                            this.$alert('停用的方案不能分配', {
                                confirmButtonText: '确定',
                            });
                            return
                        }
                        vm.pk_assign_waclass = scope.row.pk_wa_class;
                        vm.className = scope.row.name;
                        vm.classPeriod = scope.row.startperiod;
                        vm.dialogAllotVisible = true;
                        var parmjson = {"pk_periodscheme": scope.row.pk_periodscheme};
                        this.$http({
                            url: "/hrwa/waclass/getCorespondingPriod",
                            method: "post",
                            data: parmjson
                        })
                            .then((res) => {
                                if (res.data.status === true) {
                                    //alert(JSON.stringify(res.data.data));
                                    vm.periods = res.data.data.options;
                                    vm.$refs.ref_allot.setData("periods", vm.periods);
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch((e) => {
                                this.$message({
                                    message: e.data,
                                    type: "error"
                                });
                            });

                    },
                    handleChange(row){
                        var url;
                        if (row.stopflag == 1) {
                            url = "/hrwa/waclass/seal";

                            this.$confirm(row.name + "(" + row.cperiod + ")" + '停用后将不能继续使用，确定要停用吗?', '停用', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$http({
                                    url: url,
                                    method: "post",
                                    traditional: true,
                                    data: row
                                })
                                    .then((res) => {
                                        if (res.data.status === true) {
                                            vm.request(vm.currentPage, vm.size)
                                        } else {
                                            row.stopflag = !row.stopflag;
                                            this.$message({
                                                message: res.data.msg,
                                                type: "error"
                                            });
                                        }
                                    })
                                    .catch(() => {
                                        row.stopflag = !row.stopflag;
                                        this.$message({
                                            message: "操作失败",
                                            type: "error"
                                        });
                                    });
                            }).catch(() => {
                                row.stopflag = !row.stopflag;
                            });
                        } else {
                            vm.dialogFormVisible = true;
                            vm.rowdata = row;
                            vm.unsealurl = "/hrwa/waclass/unseal";
                        }

                    },
                    wacalssCodeClick(scope) {
                        vm.$router.push("/hrwa/waclass/edit/"+scope.row.pk_wa_class+"/"+false);
                    },
                    waclassDbClick(row){
                        $('.tooltip-normal').hide();
                        vm.$router.push("/hrwa/waclass/edit/"+row.pk_wa_class+"/"+false);
                    }

                },
                search_input: '',
                // 分页组件传入参数
                totalElements: 0,
                currentPage: 1,
                size: 10,
                // 是否显示批量删除按钮
                showDeleteButton: false,
                // 是否显示删除dialog
                delDialogVisible: false,
                multiDelDialogVisible: false,
                dialogFormVisible: false,
                pk_wa_class: "",
                delData: null,
                rowdata: null,
                unsealdate: null,
                unsealurl: null,
                className: null,
                classPeriod: null
            };
        },
        created() {
            
            this.mainTitleBtns = [];
          
            // 获取页面配置信息
            this.getPageModel(function(pageModel) {
           
                this.waclassSearchCode = pageModel.getSearchCode("listPanel");
                this.mainTitleBtns = pageModel.getTitleBusiButtons("listPanel");
            
            });
            this.$nextTick(() => {
                if(this.$refs.ref_waclass_l) {
                    this.$refs.ref_waclass_l.init();
                }
            })
            this.getSceneCode();
        
            this.request(this.currentPage, this.size);           
        },
        methods: {
            ifbpPageInit() {
                this.request(this.currentPage, this.size);
            },
            // 请求数据
            request(n, s) {
                var url = "/hrwa/waclass/pageList";

                let param = {
                    pn:  n||1,
                    ps: s||10,
                    pk_org:this.pk_org

                };
                this.$http({
                    url: url,
                    method: "post",
                    data:this.searchTemplate,
                    params:param,
                })
                    .then((res) => {
                        this.$refs.ref_waclass_l.setTableData(res.data.data.content);
                        this.totalElements = res.data.data.totalElements;
                        this.size = res.data.data.size;
                        sessionStorage.setItem('pk_group', this.$context.getFbpGroupPk());
                    })
                    .catch(() => {
                        this.$message({
                            message: "信息获取失败",
                            type: "error"
                        });
                    });
            },
            onDialogCancle(){
                this.rowdata.stopflag = !this.rowdata.stopflag;
                this.dialogFormVisible = false;
            },
            onDialogConfirm(){
                if(!this.unsealdate){
                    this.$message({
                        message: "请选择日期",
                        type: "error"
                    });
                    return;
                }
                this.rowdata['unsealdate'] = this.unsealdate;
                this.$http({
                    url: this.unsealurl,
                    method: "post",
                    traditional: true,
                    data: this.rowdata,
                })
                .then((res) => {
                    debugger
                    if (res.data.status === true) {
                        this.request(this.currentPage, this.size)
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                        this.rowdata.stopflag = !this.rowdata.stopflag;
                    }

                })
                .catch((e) => {
                    debugger
                    this.rowdata.stopflag = !this.rowdata.stopflag;
                    this.$message({
                        message: "操作失败"+e.data,
                        type: "error"
                    });
                });
                this.dialogFormVisible = false;
            },
            // 获取查询模板数据
            getSearchData() {
                this.searchTemplate = testSearchTemplate;
            },

            handleSearch(searchTemplate){
                this.searchTemplate = searchTemplate;
                this.request(this.currentPage, this.size);
            },
            // table行的编辑操作
            waclassTableEditClick(scope) {
                if (scope.row.stopflag){
                    this.$alert('已停用的薪资方案不允许编辑', {
                        confirmButtonText: '确定',
                    });

                }else if (scope.row.isEditable) {
                    if(scope.row.pk_group == scope.row.pk_org){
                        this.$alert('已经分配到组织的数据不能修改', {
                            confirmButtonText: '确定',
                        });
                    }else{
                        this.$alert('存在已审核数据，不能修改', {
                            confirmButtonText: '确定',
                        });
                    }
                } else {
                    this.$router.push("/hrwa/waclass/edit/"+scope.row.pk_wa_class+"/"+true);
                }
            },
            // table行的删除操作
            waclassTableDeleteClick(scope) {

                if (scope.row.pk_group == scope.row.pk_org) {
                   if(scope.row.isDelable){
                       this.$alert('已分配的方案不能删除', {
                           confirmButtonText: '确定',
                       });
                   }else{
                       this.delDialogVisible = true;
                       this.delData = scope.row;
                       this.pk_wa_class = scope.row.pk_wa_class;
                   }
                } else {
                    if(scope.row.isallot){
                        this.$alert('集团分配的方案不能删除', {
                            confirmButtonText: '确定',
                        });
                    } else if(scope.row.isDelable){
                        this.$alert('存在已审核的数据，不能删除', {
                            confirmButtonText: '确定',
                        });
                    }else{
                        this.delDialogVisible = true;
                        this.delData = scope.row;
                        this.pk_wa_class = scope.row.pk_wa_class;
                    }
                }
            },
            // table选中改变
            waclassSelectionChange(selection) {
                if (selection && selection.length > 0) {
                    this.showDeleteButton = true;
                } else {
                    this.showDeleteButton = false;
                }
            },

            // 跳转到添加地点页面
            addWaClass() {
                this.$router.push("/hrwa/waclass/add");
            },

            // 批量删除点击处理
            multiDeleteDialgShow() {
                this.multiDelDialogVisible = true;
            },

            // 查询区点击搜索后的处理
            advancedSearch(searchTemplate) {
                console.log("search triggered", searchTemplate);
            },

            // 翻页标签改变每页显示数据
            handleSizeChange(val) {
                this.request(1, val);
                this.size = parseInt(val);
                this.currentPage = 1;
                //sessionStorage.setItem('waclass-pageSize', this.size);
                //sessionStorage.setItem('waclass-currentPage', this.currentPage);
            },

            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.request(val, this.size);
                this.currentPage = parseInt(val);
                //sessionStorage.setItem('waclass-currentPage', this.currentPage);
            },

            // 删除处理s
            deleteClick() {
                this.delDialogVisible = false;
                if (this.pk_wa_class === undefined) {
                    return;
                }
                this.$http({
                    url: "/hrwa/waclass/delete",
                    method: "post",
                    data: this.delData
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.request(this.currentPage, this.size);
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });

                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        console.error(e);
                        this.$message({
                            message: "基本信息详情获取失败",
                            type: "error"
                        });
                    });
            },

            // 批量删除处理
            multiDeleteClick() {
                var tableSelections = this.$refs.ref_joblevelsys_l.comp.$refs.ref_joblevelsys_l.getSelection();
                var delIds = [];
                if (tableSelections && tableSelections.length > 0) {
                    for (var i = 0; i < tableSelections.length; i++) {
                        var row = tableSelections[i];
                        var id = row.pk_wa_class;
                        delIds.push(id);
                    }
                }
                console.log("multiDelete" + delIds);
                this.multiDelDialogVisible = false;
            },
            //选择组织后
            updateOrgPk(val){
                this.pk_org = val;
            },
             //组织树切换组织
            handleTreeChange() {
                this.currentPage = 1;
                this.request(this.currentPage,this.size);
            },

        }
    };
</script>
<style>
    .as .el-dialog__header{
        border-bottom: 1px solid #fff !important;
    }
</style>

