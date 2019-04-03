/*jshint esversion: 6 */
export default {

    data() {
        return {
            pk_tempallot: "0001AA1000000000IV13",
            pk_assign_waclass: null,
            waclassAllot: [{
                pk_org: "",
                orgname: "",
                orgcode: "",
                startperiod: "",
                cperiod: "",
                assigned: false,
                canunassign: true
            }],
            waclassAllotData: {
                periods: []
            },
            dialogAllotVisible: false,
            WaClassAllotVO: {
                code: "12312",
                name: "123123",
                startperiod: "201701",
                cperiod: ""
            },
            periods: [],
            waclassAllotMethods: {
                selectable(row, index){
                    return row.canunassign;
                },
            },
            waclassAllotResetFun: function ($node) {
                var $table = this.getTableDom($node);
                $table.attr(':show-header', 'true');
                $table.attr(":height", "380");

                var $selection = $node.find('[type="selection"]');
                $selection.attr(":selectable", "selectable")

               //得到列表单个属性控件
                var $startperiod = $node.find("[prop='startperiod']");

                //替换列表显示为switch开关控件
                $startperiod.attr('render-type', 'default');
                $startperiod.html(
                    '<template scope="scope" >' +
                    '<el-select placeholder="请选择期间" v-model="scope.row.startperiod" :editable="scope.row.canunassign">' +
                    '    <el-option ' +
                    '        v-for="period in periods"' +
                    '        :key="period.value"' +
                    '        :label="period.label"' +
                    '        :value="period.value">' +
                    '    </el-option>' +
                    '</el-select>' +
                    '</template>'
                );
                return $node[0].outerHTML;
            },
        };
    },

    methods: {

        periodChange(val){
           let rows = this.$refs.ref_allot.getTableData();
            rows.forEach(function (row) {
                if (!row.assigned) {
                    row.startperiod = val;
                }
            });
        },
        cancleAllotDialog(){
            this.$refs.ref_allot.setTableData(null);
            this.WaClassAllotVO={};

            this.dialogAllotVisible = false;

        },
        confirmAllotDialog(){
            let selectedOrgs = this.$refs.ref_allot.getTableComp().getSelection();
            let orgs = this.$refs.ref_allot.getTableData();
            orgs.forEach(function (orgData) {
                orgData.assigned = false;
                if (selectedOrgs && selectedOrgs.length > 0) {
                    for (let i = 0; i < selectedOrgs.length; i++) {
                        if (orgData.pk_org == selectedOrgs[i].pk_org) {
                            orgData.assigned = true;
                        }
                    }
                }
            });

            var data = {"orgdata": orgs, "waclass": {pk_wa_class: this.pk_assign_waclass}};
            this.$http({
                url: "/hrwa/waclass/assign/signWaClass",
                method: "post",
                data: data
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.dialogAllotVisible = false;
                        this.request(this.currentPage, this.size);
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
        advancedSearch(value) {
            alert(value);
        },

        initDialog(){

            this.WaClassAllotVO.name = this.className;
            this.WaClassAllotVO.startperiod = this.classPeriod;
            var parmjson = {"pk_wa_class": this.pk_assign_waclass};
            this.$http({
                url: "/hrwa/waclass/assign/getOrgs",
                method: "post",
                data: parmjson
            })
            .then((res) => {
                if (res.data.status === true) {
                    let rows = res.data.data.orgdata;
                    //this.baseRows = JSON.parse(JSON.stringify(rows));
                    this.$refs.ref_allot.setTableData(rows);
                    let vm = this;
                    setTimeout(function () {
                        vm.$refs.ref_allot.getTableComp().clearSelection();
                        rows.forEach(function (row) {
                            if (row.assigned) {
                                vm.$refs.ref_allot.getTableComp().toggleRowSelection(row, true)
                            }
                        });
                    }, 500);
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

        }

    }
};
