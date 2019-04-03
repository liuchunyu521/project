<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="离职页面设置"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area>
            <el-button type="primary" @click="edit" v-show="showEditBtn">设置</el-button>
            <el-button @click="refresh" v-show="showRefreshBtn">刷新</el-button>
            <el-button type="primary" @click="save" v-show="showSaveBtn"style="margin-left: 0px !important;">保存</el-button>
            <el-button @click="cancel" v-show="showCancelBtn">取消</el-button>
            <el-button @click="selAll" v-show="showSelAllBtn">全选</el-button>
            <el-button @click="unSelAll" v-show="showUnSelAllBtn">全消</el-button>

            <div class="fr">
                <span class="search-label">离职业务类型:</span>
                <el-select v-model="pk_sttype" placeholder="请选择" :disabled="searchDisabled" @change="handleSearchChange"
                           style="width:130px;">
                    <el-option
                            v-for="item in options"
                            :key="item.pk_trnstype"
                            :label="item.trnstypename"
                            :value="item.pk_trnstype">
                    </el-option>

                </el-select>
            </div>

        </ifbp-button-area>

        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- UI模板组件 -->
            <ifbp-template ref="ref_reg_itemset"
                           tpl-id="itemTableId"
                           :tpl-data="itemTableData"
                           :methods="itemTableMethods"
                           :table-show-menu="false"
                           :tpl-reset-fun="itemTableResetFun">
            </ifbp-template>
        </ifbp-main-area>

    </ifbp-page>
</template>

<script>


    import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
    export default {
        mixins:[pageModelMixin],
        data() {
            return {
                searchEntity: {
                    beanMap: {
                        pk_org_ref: {},
                    },
                    pk_org: '',
                },

                options: [{
                    value: 'trnstypecode',
                    label: 'trnstypename'
                }],
                value: '',


                //调配业务类型
                pk_sttype: '',
//        selectedOptions: [],
                searchDisabled: false,
                //设置
                showEditBtn: true,
                //刷新
                showRefreshBtn: true,
                showSaveBtn: false,
                showCancelBtn: false,
                showSelAllBtn: false,
                showUnSelAllBtn: false,
                //修改前的数据
                backupData: {},
                itemTableData: {},
                isshowdisabled: true,
                itemTableMethods: {
                    handleIsShowChange(event, idx){
                        let value = event.target.checked;
                        let data = this.$refs.ref_reg_itemset_l.data;
                        if (value) {
                            data[idx].cl_isedit_disabled = false;
                            data[idx].isedit = true;
                            data[idx].cl_ismustnotnull_disabled = false;
                            data[idx].isdefault = true;
                            let max = 0;
                            for (let k = 0; k < data.length; k++) {
                                if (data[k].disorder > max) {
                                    max = data[k].disorder;
                                }
                            }
                            data[idx].disorder = max + 1;
                        } else {
                            data[idx].cl_isedit_disabled = true;
                            data[idx].cl_ismustnotnull_disabled = true;
                            data[idx].isedit = false;
                            data[idx].ismustnotnull = false;
                            data[idx].isdefault = false;
                            data[idx].disorder = "";
                        }
                        data[idx].cl_isdefault_disabled = false;
                    },
                    handleIsEditChange(event, idx){
                        let value = event.target.checked;
                        let data = this.$refs.ref_reg_itemset_l.data;
                        if (value) {
                            data[idx].cl_ismustnotnull_disabled = false;
                            data[idx].isdefault = true;
                        } else {
                            data[idx].cl_ismustnotnull_disabled = true;
                            data[idx].ismustnotnull = false;
                        }
                    },
                },
                itemTableResetFun: function ($node) {

                    var $isshowcol = $node.find("[_id='wi6015j7dr']");
//          //替换列表显示为switch开关控件
                    //  $isshowcol.attr('v-show', 'whether1_show');
                    $isshowcol.attr('render-type', 'default');
                    $isshowcol.html(
                        '<template scope="scope">' +
                        '<el-checkbox v-model="scope.row.isshow"  @change="handleIsShowChange($event,scope.$index)" :disabled="scope.row.cl_isshow_disabled"/></template>'
                    );

                    var $iseditcol = $node.find("[_id='t9rumdcg0b']");
                    $iseditcol.attr('render-type', 'default');
                    $iseditcol.html(
                        '<template scope="scope">' +
                        '<el-checkbox v-model="scope.row.isedit"  @change="handleIsEditChange($event,scope.$index)" :disabled="scope.row.cl_isedit_disabled"/></template>'
                    );

                    var $ismustnotnullcol = $node.find("[_id='m8oozeelr4g']");
                    $ismustnotnullcol.attr('render-type', 'default');
                    $ismustnotnullcol.html(
                        '<template scope="scope">' +
                        '<el-checkbox v-model="scope.row.ismustnotnull" :disabled="scope.row.cl_ismustnotnull_disabled"/></template>'
                    );

                    var $isdefaultcol = $node.find("[_id='orp56vf1g4n']");
                    $isdefaultcol.attr('render-type', 'default');
                    $isdefaultcol.html(
                        '<template scope="scope">' +
                        '<el-checkbox v-model="scope.row.isdefault" :disabled="scope.row.cl_isdefault_disabled"/></template>'
                    );
                    return $node[0].outerHTML;
                },
            };
        },

        mounted() {
            this.init();
        },

        methods: {
            //初始化
            init(){
                var url = '/hrtrn/basic/dimissionitem/init';
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            this.setClientData(res.data.data, "cl_isshow_disabled", true);
                            this.setClientData(res.data.data, "cl_isedit_disabled", true);
                            this.setClientData(res.data.data, "cl_ismustnotnull_disabled", true);
                            this.setClientData(res.data.data, "cl_isdefault_disabled", true);
                            this.backupData = JSON.parse(JSON.stringify(res.data.data));
                            this.options = res.data.trnstypes;

                            this.$refs.ref_reg_itemset.setTableData(JSON.parse(JSON.stringify(res.data.data)));
                        } else {
                            this.$message({

                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: "页面初始化失败",
                            type: "error"
                        });
                    });
            },

            //设置
            edit(){
                let data = this.$refs.ref_reg_itemset.getData("hi_reg_itemset_t");
                if (this.pk_sttype == "") {
                    this.$message({
                            message: "业务类型不能为空",
                            type: "error"
                        }
                    )
                } else {

                    if (data != null && data !== undefined && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            let itemkey = data[i].itemkey;
                            data[i].cl_isshow_disabled = false;
                            data[i].cl_isedit_disabled = !data[i].isshow;
                            data[i].cl_ismustnotnull_disabled = !data[i].isedit;
                            data[i].cl_isdefault_disabled = false;
                        }
                    }
                    this.showEditBtn = false;
                    this.showRefreshBtn = false;
                    this.showSaveBtn = true;
                    this.showCancelBtn = true;
                    this.showSelAllBtn = true;
                    this.showUnSelAllBtn = true;
                    this.searchDisabled = true;

                }
            },
            //刷新
            refresh(){
                var aa = "1"
                this.handleSearchChange(aa);
            },
            //保存
            save(){
                let data = this.$refs.ref_reg_itemset.getData("hi_reg_itemset_t");
                var url = '/hrtrn/basic/dimissionitem/save?pkstType=' + this.pk_sttype;
                this.$http({
                    url: url,
                    method: "post",
                    data: data
                }).then((res) => {
                    if (res.data.status === true) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.showEditBtn = true;
                        this.showRefreshBtn = true;
                        this.showSaveBtn = false;
                        this.showCancelBtn = false;
                        this.showSelAllBtn = false;
                        this.showUnSelAllBtn = false;
                        this.searchDisabled = false;
                        this.setClientData(res.data.data, "cl_isshow_disabled", true);
                        this.setClientData(res.data.data, "cl_isedit_disabled", true);
                        this.setClientData(res.data.data, "cl_ismustnotnull_disabled", true);
                        this.setClientData(res.data.data, "cl_isdefault_disabled", true);
                        this.backupData = JSON.parse(JSON.stringify(res.data.data));
                        this.$refs.ref_reg_itemset.setTableData(JSON.parse(JSON.stringify(res.data.data)));
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "保存失败",
                        type: "error"
                    });
                });
            },
            //取消
            cancel(){
                this.showEditBtn = true;
                this.showRefreshBtn = true;
                this.showSaveBtn = false;
                this.showCancelBtn = false;
                this.showSelAllBtn = false;
                this.showUnSelAllBtn = false;
                this.searchDisabled = false;
                this.$refs.ref_reg_itemset.setData("hi_reg_itemset_t", JSON.parse(JSON.stringify(this.backupData)));
            },
            //全选
            selAll(){
                let data = this.$refs.ref_reg_itemset.getData("hi_reg_itemset_t");
                for (var i = 0; i < data.length; i++) {
                    let itemkey = data[i].itemkey;
                    data[i].isshow = true;
                    data[i].isedit = true;
                    data[i].isdefault = true;
                    data[i].cl_isshow_disabled = false;
                    data[i].cl_isedit_disabled = false;
                    data[i].cl_ismustnotnull_disabled = false;
                    data[i].cl_isdefault_disabled = false;
                    data[i].ismustnotnull = false;
                }
            },
            //全消
            unSelAll(){
                let data = this.$refs.ref_reg_itemset.getData("hi_reg_itemset_t");
                for (var i = 0; i < data.length; i++) {
                    let itemkey = data[i].itemkey;
                    data[i].cl_ismustnotnull_disabled = true;
                    data[i].cl_isedit_disabled = true;
                    data[i].isshow = false;
                    data[i].isedit = false;
                    data[i].isdefault = false;
                    data[i].ismustnotnull = false;
                    data[i].cl_isshow_disabled = false;
                    data[i].cl_isdefault_disabled = false;
                }
            },
            handleSearchChange(aa){
                var url = '/hrtrn/basic/dimissionitem/search?pkstType=' + this.pk_sttype;
                this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                })
                    .then((res) => {
                        if (res.data.status === true) {
                            if (aa == 1) {
                                this.$message({
                                    message: "刷新成功"
                                });
                            }


                            this.setClientData(res.data.data, "cl_isshow_disabled", true);
                            this.setClientData(res.data.data, "cl_isedit_disabled", true);
                            this.setClientData(res.data.data, "cl_ismustnotnull_disabled", true);
                            this.setClientData(res.data.data, "cl_isdefault_disabled", true);
                            this.backupData = JSON.parse(JSON.stringify(res.data.data));
                            this.$refs.ref_reg_itemset.setTableData(JSON.parse(JSON.stringify(res.data.data)));
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: "查询数据失败",
                            type: "error"
                        });
                    });
            },
            //增加前台要用到的控制数据
            setClientData(data, key, value){
                if (data != null && data !== undefined && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i][key] = value;
                    }
                }
            },
        }
    };
</script>
<style>
    .search-label {
        font-size: 14px !important;
    }
</style>
