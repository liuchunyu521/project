<!--
	作者：wangruie
	时间：2018-11-30
	支持：自助 继续教育-学历
-->
<template>

 <ifbp-panel id="subPanel" title="学历信息"  class="titleLine" :icons="addicons" >
                    <ifbp-template ref="ref_edu_c"
                                   :tpl-id="templatebodycode"

                                   :tplData="eduCardSubData"
                                   :tplResetFun="eduCardResetFunc"
                                   :methods="formMethods"
                                   confirm-button="确定"
                                   @form-confirm-click="confirm"
                                   @form-cancel-click="formCancel"
                                   @form-edit-click="formEdit"
                                   @form-delete-click="formDelete"
                                   :cancel-button-show="subEdit"
                                   :edit-button-show="bodyEditBtnShow"
                                   :delete-button-show="bodyEditBtnShow"
                                   :editable="subEdit"
                                   @delete-table-click="tableDeleteClick"
                                   @edit-table-click="tableEditClick"
                                   :table-show-menu="false"
                    >
                    </ifbp-template>
                  </ifbp-panel> 

</template>


<script>
export default {
    props: {
    },
    data() {
        return {
            subList: [],
            delList: [],
            subEdit: false,
            templatebodycode: 'contedu-body-edu-card',
            eduCardSubData: {
                eduParam: { pk_org: '', pk_edu_b: '' },
                showOpeColumn: true,
                rules: {},
            },
            addIconShow: true,
            addiconsValue: [{
                icon: 'plus',
                click: () => {
                    // 关闭table中的编辑区
                    this.$refs.ref_edu_c.getTableComp().closeExpandRow();
                    this.subEdit = true;
                    this.bodyEditBtnShow = false;
                    this.$refs.ref_edu_c.formShow = true;
                    this.$refs.ref_edu_c.resetFormData();
                    this.addicons = [];
                },

            }],
            addicons: [],
            eduCardResetFunc: function ($node) {

                var $table = this.getTableDom($node);
                $table.attr(':show-header', 'true');
                var operateArr = [{
                    title: '编辑',
                    icon: 'edit',
                    vif: "showOpeColumn"
                }, {
                    title: '删除',
                    icon: 'delete',
                    vif: "showOpeColumn"
                }];

                var operateHtml = this.getTableOperateHtml(operateArr);
                $table.append(operateHtml);
                return $node[0].outerHTML;
            },
            formMethods: {},
        }
    },
    //初始化加载
    mounted() {
        //数据初始化
    },
    methods: {
        confirm(type, row) {
            this.$refs.ref_edu_c.validate(valid => {
                if (valid) {
                    let data = this.$refs.ref_edu_c.getFormData();
                    if (data.pk_edu_b) {
                        this.$refs.ref_edu_c.setFormDataByField("status", 1);
                    } else {
                        this.$refs.ref_edu_c.setFormDataByField("status", 2);
                    }
                    if (type == "form") {
                        this.subList.push(data);
                        this.$refs.ref_edu_c.setTableData(this.subList);
                    }
                    //
                    this.subList = this.$refs.ref_edu_c.getTableData();
                    this.$refs.ref_edu_c.formShow = false;
                    this.$refs.ref_edu_c.getTableComp().closeExpandRow();
                    this.addicons = this.addiconsValue;
                }
            });
        },
        formCancel(type, row) {
            this.subEdit = false;
            this.bodyEditBtnShow = true;
            this.addicons = this.addiconsValue;
        },
        formEdit(type, row) {
            this.subEdit = true;
            this.bodyEditBtnShow = false;
            this.addicons = [];

            let pk_edu_b = row.pk_edu_b;
            this.eduParam(pk_edu_b);

        },
        formDelete(type, row) {
            let index = this.subList.indexOf(row);
            let pk_edu_b = row.pk_edu_b;
            this.delete(pk_edu_b, index, row);

        },
        delete(pk_edu_b, index, delData) {

            this.$confirm('确认删除该数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,

                type: 'warning'
            }).then(() => {

                if (pk_edu_b) {//这一行的值已经做持久化了，最后要真的到数据库中删除
                    delData.status = 3;
                    this.delList.push(delData);
                }
                this.$refs.ref_edu_c.formShow = false;
                this.$refs.ref_edu_c.getTableComp().closeExpandRow();

                this.subList.splice(index, 1);
                this.$refs.ref_edu_c.setTableData(this.subList);
                this.$refs.ref_edu_c.clearEdit();
                //可能编辑后就删除了，下面是处理这种情况
                this.addicons = this.addiconsValue;
                this.subEdit = false;
            }).catch(() => {
                // 这里加取消逻辑
            });

        },
        tableDeleteClick(row, rowIndex) {
            let pk_edu_b = row.row.pk_edu_b;
            let index = row.$index;
            let delData = row.row;
            this.delete(pk_edu_b, index, delData);
        },
        tableEditClick(row, rowIndex) {
            this.$refs.ref_edu_c.expandRow(row.row, row.$index);

            this.subEdit = true;
            this.addicons = [];
            this.bodyEditBtnShow = false;

            let pk_edu_b = row.row.pk_edu_b;
            this.setwaGrdParam(pk_edu_b);

        },
        setBodybtnState(state) {
            //state为是否是浏览状态 true 是浏览状态   false是编辑状态
            this.$refs.ref_edu_c.setData("showOpeColumn", !state);//子表编辑按钮
            this.subEdit = !state;//取消行点击
            this.addicons = this.addiconsValue;
            if (state) {
                this.addicons = [];
            }
        },
        getallBodys() {
            if (this.$refs.ref_edu_c.formShow) {
                this.$message({
                    message: "子表数据没有保存",
                    type: "error"
                });
                return null;
            }
            let bodys = this.$refs.ref_edu_c.getTableData();

            let allBodys = bodys.concat(this.delList);

            return allBodys;
        },
        setTableData(bodys) {
            this.$refs.ref_edu_c.setTableData(bodys);
            if(bodys){
            	this.subList = JSON.parse(JSON.stringify(bodys));
            }else{
            	this.subList = [];
            }
            
            this.delList = [];
            this.$refs.ref_edu_c.clearEdit();
            this.setBodybtnState(true);
        }
    }
}
</script>

<style>
</style>