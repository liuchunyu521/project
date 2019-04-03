<template>
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb :name="classType==1 ? '级别人员属性设置' : '档别人员属性设置'"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <div class="operator-container" v-show="hasEditPower">
            <el-button type="primary" @click="addPsnhi" :disabled="isEditing">新增</el-button>
        </div>

        <!-- 主体区域 -->
        <div class="list-main-container clearfix">
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    ref="psnhitableref"
                    @row-click="tableRowClick">
                <el-table-column type="noIconExpand" v-if="hasEditPower">
                    <template scope="props">
                        <el-form label-position="left" inline :model="props.row" :rules="rules" ref="editFormRef">


                            <el-form-item :label="item.vfldname" v-for="(item, index) in schemes" :prop="item.pk_wa_psnhi"
                                          :required="item.vfldname=='对应级别' || item.vfldname=='对应档别'">
                                <el-ref :editable="editable" v-model="props.row[item.pk_wa_psnhi]"
                                        :field="item.pk_wa_psnhi"
                                        :template-value="props.row" :pk="item.pk"
                                        :ref-code="item.refcode" v-if="item.data_type==5"></el-ref>
                                <el-select :editable="editable" clearable v-model="props.row[item.pk_wa_psnhi]"
                                           v-else-if="item.data_type==6">
                                    <el-option v-for="(option,key) in item.options" :label="option" :value="key"
                                               :disabled="false"></el-option>
                                </el-select>
                                <el-date-picker type="date" :editable="editable" v-model="props.row[item.pk_wa_psnhi]"
                                                v-else-if="item.data_type==3"></el-date-picker>
                                <el-date-picker type="time" :editable="editable" v-model="props.row[item.pk_wa_psnhi]"
                                                v-else-if="item.data_type==8"></el-date-picker>
                                <el-date-picker type="datetime" :editable="editable"
                                                v-model="props.row[item.pk_wa_psnhi]"
                                                v-else-if="item.data_type==15"></el-date-picker>
                                <el-checkbox :editable="editable" v-model="props.row[item.pk_wa_psnhi]"
                                             v-else-if="item.data_type==4"></el-checkbox>
                                <el-input :editable="editable" v-model="props.row[item.pk_wa_psnhi]" v-else></el-input>
                            </el-form-item>

                            <div class="form-button-div">
                                <el-button type="primary" @click="saveEdit" v-show="isEdit && isEditing">保存</el-button>
                                <el-button v-show="!isEdit || isEditing" @click="cancelEdit">取消</el-button>
                            </div>
                        </el-form>

                    </template>
                </el-table-column>
                <el-table-column :render-type="item.data_type==5 ? 'ref' : item.data_type==6 ? 'select' : 'default'"
                                 :label="item.vfldname" :prop="item.pk_wa_psnhi"
                                 :render-select-options-var="options[item.pk_wa_psnhi]"
                                 v-for="(item, index) in schemes">
                </el-table-column>

                <el-table-column
                        label=""
                        width="100" v-if="hasEditPower">
                    <template scope="scope">
                        <i class="ifbp-icon-edit el-table-operate-icon" @click.stop="tableFormEditClick(scope)"
                           v-if="isEdit && !isEditing"></i>
                        <i class="el-icon-delete el-table-operate-icon" @click.stop="tableFormDelClick(scope)"
                           v-if="isEdit && !isEditing"></i>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <!-- 新增对话框 -->
        <el-dialog size="tiny" v-model="addVisible" :close-on-click-modal="false" :show-close="false"
                   id="addpsnhidialog">
            <el-form :inline="false" ref="addFromRef" label-width="100px" :rules="rules" :model="hivo">

                <el-form-item :label="item.vfldname" :prop="item.pk_wa_psnhi == 'prmlvseclv' ? 'prmlvseclv' : index.toString()" v-for="(item, index) in schemes"
                              :required="item.vfldname=='对应级别' || item.vfldname=='对应档别'">
                    <el-ref :editable="true" v-model="hivo[index]" :field="index.toString()" :template-value="hivo" :pk="item.pk"
                            :ref-code="item.refcode" v-if="item.data_type==5"></el-ref>
                    <el-select :editable="true" v-model="hivo[(item.pk_wa_psnhi == 'prmlvseclv' ? 'prmlvseclv' : index)]" :clearable="item.pk_wa_psnhi != 'prmlvseclv'" v-else-if="item.data_type==6">
                        <el-option v-for="(option,key) in item.options" :label="option" :value="key"
                                   :disabled="false"></el-option>
                    </el-select>
                    <el-date-picker type="date" :editable="true" v-model="hivo[index]"
                                    v-else-if="item.data_type==3"></el-date-picker>
                    <el-date-picker type="time" :editable="true" v-model="hivo[index]"
                                    v-else-if="item.data_type==8"></el-date-picker>
                    <el-date-picker type="datetime" :editable="true" v-model="hivo[index]"
                                    v-else-if="item.data_type==15"></el-date-picker>
                    <el-checkbox :editable="true" v-model="hivo[index]" v-else-if="item.data_type==4"></el-checkbox>
                    <el-input :editable="true" v-model="hivo[index]" v-else></el-input>
                </el-form-item>

            </el-form>
            <div slot="title"><span class="el-dialog__title" v-if="classType==1">级别人员属性新增</span>
                <span class="el-dialog__title" v-else="classType==1">档别人员属性新增</span>
            </div>
            <div slot="footer" class="form-button-div">
                <el-button type="primary" @click="savAddPsnhi">确定</el-button>
                <el-button type="default" @click="cancelAddPsnhi">取消</el-button>
            </div>

        </el-dialog>

    </ifbp-page>
</template>
<script>

    export default {
        data() {
            var classtype = this.$root.$router.currentRoute.params.classtype;
            var pk_wa_grd = this.$root.$router.currentRoute.params.id;
            return {
                //1:级别 2:档别
                classType: classtype,
                pk_wa_grd: pk_wa_grd,
                addVisible: false,
                isEditing: false,
                isEdit: true,
                editable: false,
                hasEditPower:false,
                schemes: [],
                tableData: [],
                hivo: {
                    beanMap:{
                    },
                    "0": null,
                    "1": null,
                    "2": null,
                    "3": null,
                    "4": null,
                    "5": null,
                    "6": null,
                    "7": null,
                    "8": null,
                    "9": null,
                    "10": null,
                    "11": null,
                    "12": null,
                    "13": null,
                    "14": null,
                    "15": null,
                    "16": null,
                    "17": null,
                    "18": null,
                    "19": null,
                    "20": null,
                    "21": null,
                    "22": null,
                    "23": null,
                    "24": null,
                    "25": null,
                    prmlvseclv:null,
                },
                rules: {
                    prmlvseclv: [
                        {required: true, message: '请选择级别', trigger: 'change'},
                    ],
                },
                //级别所在的索引
                prmlvseclv_idx: 0,
                //列表控件的下拉框绑定的数据
                options: {},
            };
        },
        directives: {},
        created() {
            this.request();
        },
        beforeMount(){
        },
        mounted(){
        },
        methods: {
            // 页面初期的请求数据处理
            request() {
                var url = "/hrwa/wagrade/psnhi/getById?id=" + this.pk_wa_grd + "&classtype=" + this.classType;
                let myself = this;
                let svr = this.$http({
                    url: url,
                    method: "get",
                    dataType: "json"
                });
                svr.then((res) => {
                    if (res.data.status === true) {
                        myself.schemes = res.data.scheme;
                        myself.hasEditPower = res.data.hasEditPower;
                        if(!myself.hasEditPower){
                            myself.isEdit = false;
                        }
                        myself.tableData = res.data.data;
                        myself.baseData = JSON.parse(JSON.stringify(res.data.data));

                        for (let i = 0; i < myself.schemes.length; i++) {
                            if (myself.schemes[i].pk_wa_psnhi == "prmlvseclv") {
                                myself.prmlvseclv_idx = i;
                            }
                            //把下拉框的选项放到options里
                            if (myself.schemes[i].data_type == 6) {
                                let curOptions = myself.schemes[i].options;
                                let realOptions = [];
                                for (let key in curOptions) {
                                    realOptions.push({value: key, label: curOptions[key]});
                                }
                                myself.options[myself.schemes[i].pk_wa_psnhi] = realOptions;
                            }
                        }

                    } else {
                        myself.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "信息获取失败",
                        type: "error"
                    });
                });
            },

            //保存编辑中的数据(全量保存)
            saveEdit(){
                this.$refs.editFormRef.validate((valid) => {
                    if (valid) {
                        let allData = JSON.parse(JSON.stringify(this.tableData));
                        this.saveData(allData, 2);
                    }
                });
            },

            //实际的保存操作(项服务器发送请求)
            saveData(data, updInsOrDel){
                var url = "/hrwa/wagrade/psnhi/save?pk_wa_grd=" + this.pk_wa_grd + "&classtype=" + this.classType;
                let myself = this;
                let svr = this.$http({
                    url: url,
                    method: "post",
                    dataType: "json",
                    data: data
                });
                svr.then((res) => {
                    if (res.data.status === true) {
                        //更新
                        if (updInsOrDel == 2) {
                            myself.isEditing = false;
                            myself.editable = false;
                            myself.$refs.psnhitableref.closeExpandRow();
                        } else if (updInsOrDel == 1) {
                            myself.addVisible = false;
                            //新增
                        } else if (updInsOrDel == 3) {
                            //删除
                        }

                        myself.tableData = res.data.data;
                        myself.baseData = JSON.parse(JSON.stringify(res.data.data));

                        myself.$message({
                            message: res.data.msg,
                            type: "info"
                        });
                    }
                    else {
                        myself.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
                svr.catch(() => {
                    this.$message({
                        message: "操作发生异常！",
                        type: "error"
                    });
                });
            },
            //取消编辑操作
            cancelEdit()
            {
                this.isEditing = false;
                this.editable = false;
                this.tableData = JSON.parse(JSON.stringify(this.baseData));
                this.$refs.psnhitableref.closeExpandRow();
            },
            //列表行的单击事件
            tableRowClick(row)
            {
                if (!this.isEdit)return false;
                this.formData = JSON.parse(JSON.stringify(row));
                this.$refs.psnhitableref.expandRow(row);
                this.isEditing = true;
                this.editable = true;
            },

            //新增按钮绑定处理
            addPsnhi()
            {
                this.addVisible = true;
            },
            //新增对话框的保存按钮处理
            savAddPsnhi()
            {

                this.$refs.addFromRef.validate((valid) => {
                    if (valid) {
                        //最后一个是级别，不用重新专门设置值
                        for (let i = 0; i < this.schemes.length-1; i++) {
                            this.hivo[this.schemes[i].pk_wa_psnhi] = this.hivo[i];
                        }
                        let allData = JSON.parse(JSON.stringify(this.tableData));
                        allData.push(this.hivo);

                        this.saveData(allData, 1);
                    }
                });
            },
            //新增对话框的取消按钮处理
            cancelAddPsnhi()
            {
                this.addVisible = false;
            },

            // table行的编辑操作
            tableFormEditClick(scope)
            {
                if (!this.isEdit)return false;
                this.formData = JSON.parse(JSON.stringify(scope.row));
                this.$refs.psnhitableref.expandRow(scope.row);
                this.isEditing = true;
                this.editable = true;
            },

            tableFormDelClick(scope)
            {
                if (!this.isEdit)return false;
                this.del_idx = scope.$index;
                this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.deleteClick();
                }).catch(() => {
                });
            },

            // 删除处理
            deleteClick()
            {
                let allData = JSON.parse(JSON.stringify(this.tableData));
                allData.splice(this.del_idx, 1);
                this.saveData(allData, 3);
            },
        }
    };
</script>
<style>
</style>
