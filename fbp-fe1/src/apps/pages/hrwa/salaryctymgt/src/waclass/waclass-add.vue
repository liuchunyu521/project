<template>
    <ifbp-page>
        <ifbp-breadcrumb name="新增薪资方案"></ifbp-breadcrumb>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail">
            <ifbp-panel-group :navbar="false">
                <!-- 主表编辑页签 -->
                <ifbp-panel id="basePanel" title="基本信息" class="titleLine">
                    <ifbp-template ref="ref_waclass_c"
                                   tpl-id="headPanel"
                                   :tplData="waclassData"
                                   :editable="headEdit"
                                   :tplResetFun="waclassFormResetFun"
                                   :methods="waclassFormMethods"
                    >
                    </ifbp-template>
                </ifbp-panel>
                <!-- 子表页签 -->
                <!--<ifbp-panel id="subPanel" title="计薪规则" :icons=showsubicons v-show="subshow">-->
                <ifbp-panel id="subPanel" title="计薪规则" v-show="subshow">
                    <ifbp-template ref="ref_waclassrang"
                                   tpl-id="waclassrang"
                                   :pk-temp="pk_tempsub"
                                   :tpl-data="waclassrangData"
                                   show-type="table"
                                   :editable="headEdit"
                                   :table-oper-vif="headEdit"
                                   :table-show-menu="false"
                                   :methods="waclassrangFormMethods"
                                   :tplResetFun="waclassrangResetFun"
                                   @delete-table-click="waclassrangDeleteClick"
                    >
                    </ifbp-template>
                    <el-button type="text" @click="addWaclassRang()" v-show="headEdit">新增</el-button>
                </ifbp-panel>
            </ifbp-panel-group>
        </ifbp-main-area>
        <ifbp-footer>
            <el-button type="default" @click="waclassCancel" v-if="headEdit">取消</el-button>
            <el-button type="primary" @click="waclassSave" v-if="headEdit">保存</el-button>
            <el-button type="primary" @click="waclassEdit" v-if="!headEdit">编辑</el-button>
        </ifbp-footer>
    </ifbp-page>
</template>

<script>
// 引入页面定制需要的方法
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins: [pageModelMixin],

  data() {
    var vm = this;

    return {
      // 通过传入的参数判断是新增还是修改操作
      pk_wa_class: "",
      waclassBase: null,
      waclassRangs: null,
      // ifbp-panel-group所需参数
      scrollDom: "ifbpScrollDom",
      // UI模板所需参数
      pk_tempform: "0001AA1000000000XQIJ",
      pk_tempsub: "0001AA1000000000NMPU",

      //单据VO的状态
      status: 2, //1,update;2,new;3,delete
      // 表头是否编辑
      headEdit: true,
      bodyShow: false,
      waclassrangData: {
        RefOrgParams: {
          pk_org: ""
        },
        bodyEdit: true
      },

      waclassData: {
        rules: {
          code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
          name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
        },
        rangeruleshow: false,
        addflagshow: false,
        orgeditable: false,
        params: {
          pk_org: "23423423"
        }
      },

      showsubicons: null,
      subicons: [
        {
          icon: "plus",
          click: () => {
            var tabledata = vm.$refs.ref_waclassrang.getTableData();
            var formdata = {
              pk_org: "",
              pk_dept: "",
              pk_psncl: "",
              pk_job: "",
              pk_post: "",
              pk_jobgrade: "",
              pk_jobrank: "",
              pk_postseries: ""
            };
            var data;
            if (tabledata == undefined || tabledata == null) {
              data = [formdata];
            } else {
              data = tabledata;
              data.push(formdata);
            }
            this.$refs.ref_waclassrang.setTableData(data);
          }
        }
      ],
      subshow: false,
      waclassrangResetFun($node) {
        let $pk_org = $node.find("[prop='pk_org']");
        $pk_org.attr("render-type", "default");
        $pk_org.html(
          '<template scope="scope" >' +
            '<el-ref :editable="bodyEdit" field="pk_org"  :template-value="scope.row" ref-code="businessUnitAndGroupRef" :not-leaf-selectable="true">' +
            "</el-ref>" +
            //                        '<span v-show="typeof(scope.row.pk_org) != undefined && scope.row.pk_org.length==0" style="color:#F00">任职组织不能为空</span>'+
            "</template>"
        );

        let $pk_dept = $node.find("[prop='pk_dept']");
        $pk_dept.attr("render-type", "default");
        $pk_dept.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_dept"  :query-params="RefOrgParams" :template-value="scope.row" ref-code="hrwebdeptref" :not-leaf-selectable="true">' +
            "</el-ref>" +
            //                        '<span v-show="typeof(scope.row.pk_dept) != undefined && scope.row.pk_dept.length==0" style="color:#F00">部门不能为空</span>'+
            "</template>"
        );

        let $pk_psncl = $node.find("[prop='pk_psncl']");
        $pk_psncl.attr("render-type", "default");
        $pk_psncl.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_psncl"  :template-value="scope.row" ref-code="psnclref">' +
            "</el-ref>" +
            //                        '<span v-show="typeof(scope.row.pk_psncl) != undefined && scope.row.pk_psncl.length==0" style="color:#F00">人员类别不能为空</span>'+
            "</template>"
        );

        let $pk_jobgrade = $node.find("[prop='pk_jobgrade']");
        $pk_jobgrade.attr("render-type", "default");
        $pk_jobgrade.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_jobgrade"  :template-value="scope.row" ref-code="jobRankRef">' +
            "</el-ref>" +
            // '<span v-show="typeof(scope.row.pk_jobgrade) != undefined && scope.row.pk_jobgrade.length==0" style="color:#F00">职级不能为空</span>'+
            "</template>"
        );

        let $pk_jobrank = $node.find("[prop='pk_jobrank']");
        $pk_jobrank.attr("render-type", "default");
        $pk_jobrank.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_jobrank"  :template-value="scope.row" ref-code="joblevelRef">' +
            //'<span v-show="typeof(scope.row.pk_jobrank) != undefined && scope.row.pk_jobrank.length==0" style="color:#F00">职等不能为空</span>'+
            "</el-ref>" +
            "</template>"
        );

        let $pk_job = $node.find("[prop='pk_job']");
        $pk_job.attr("render-type", "default");
        $pk_job.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_job"  :template-value="scope.row" ref-code="jobRef">' +
            //                        '<span v-show="typeof(scope.row.pk_job) != undefined && scope.row.pk_job.length==0" style="color:#F00">职务不能为空</span>'+
            "</el-ref>" +
            "</template>"
        );

        let $pk_post = $node.find("[prop='pk_post']");
        $pk_post.attr("render-type", "default");
        $pk_post.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_post" :query-params="RefOrgParams"  :template-value="scope.row" ref-code="postDeptRef" :not-leaf-selectable="true">' +
            //                        '<span v-show="typeof(scope.row.pk_post) != undefined && scope.row.pk_post.length==0" style="color:#F00">岗位不能为空</span>'+
            "</el-ref>" +
            "</template>"
        );

        let $pk_postseries = $node.find("[prop='pk_postseries']");
        $pk_postseries.attr("render-type", "default");
        $pk_postseries.html(
          '<template scope="scope" >' +
            '<el-ref  :editable="bodyEdit" field="pk_postseries"  :template-value="scope.row" ref-code="postSeriesRef">' +
            //                        '<span v-show="typeof(scope.row.pk_postseries) != undefined && scope.row.pk_postseries.length==0" style="color:#F00">岗位序列不能为空</span>'+
            "</el-ref>" +
            "</template>"
        );

        var operateArr = [
          {
            title: "删除",
            icon: "delete",
            vif: "tableOperVif"
          }
        ];
        var $table = this.getTableDom($node);
        var operateHtml = this.getTableOperateHtml(operateArr);
        $table.append(operateHtml);

        return $node[0].outerHTML;
      },
      waclassrangFormMethods: {},

      waclassFormResetFun: function($node) {
        //计薪规则
        var $psnidlab = $node.find("[prop='rangerule']");
        $psnidlab.attr("v-show", "rangeruleshow");
        //是否允许下级增加发放项目
        var $addflag = $node.find("[prop='addflag']");
        $addflag.attr("v-show", "addflagshow");

        var $funcode = $node.find("[v-model='WaClassVO.pk_periodscheme']");
        $funcode.attr("v-on:trigger", "periodschemeChange");

        var $pk_org = $node.find("[v-model='WaClassVO.pk_org']");
        $pk_org.attr("v-on:trigger", "orgChange");
        $pk_org.attr("disabled", false);

        var $collectflag = $node.find("[prop='collectflag']");
        $collectflag.attr("hide", true);

        var $cyear = $node.find("[prop='cyear']");
        $cyear.attr("hide", true);

        var $cperiod = $node.find("[prop='cperiod']");
        $cperiod.attr("hide", true);

        //计薪规则
        var $rangerule = $node.find("[v-model='WaClassVO.rangerule']");
        $rangerule.attr("v-on:trigger", "rangChang");
        return $node[0].outerHTML;
      },
      waclassFormMethods: {
        periodschemeChange(type, val) {
          var refdata = val.value;
          var pk_refid = refdata[0].id;
          var parmjson = { pk_periodscheme: pk_refid };
          //alert(JSON.stringify(parmjson));
          this.$http({
            url: "/hrwa/waclass/getCorespondingPriod",
            method: "post",
            data: parmjson
          })
            .then(res => {
              if (res.data.status === true) {
                vm.$refs.ref_waclass_c.setData(
                  "startperiodOptionsVar",
                  res.data.data.options
                );
                vm.$refs.ref_waclass_c.getFormData().startperiod =
                  res.data.data.startperiod;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(e => {
              this.$message({
                message: e.data,
                type: "error"
              });
            });
        },

        rangChang(type, data) {
          var rangs = data.value;

          if (rangs.length == 0) {
            vm.subshow = false;
          } else {
            vm.subshow = true;

            let orgshow = false;
            let deptshow = false;
            let psnclshow = false;
            let jobgradeshow = false;
            let jobrankshow = false;
            let jobshow = false;
            let postshow = false;
            let postseriesshow = false;

            for (var i = 0; i < rangs.length; i++) {
              if (
                rangs[i].refcode == "hi_psnjob.pk_org" ||
                rangs[i].refcode == "01"
              ) {
                orgshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_dept" ||
                rangs[i].refcode == "02"
              ) {
                deptshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_psncl" ||
                rangs[i].refcode == "03"
              ) {
                psnclshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_jobgrade" ||
                rangs[i].refcode == "04"
              ) {
                jobgradeshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_jobrank" ||
                rangs[i].refcode == "05"
              ) {
                jobrankshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_job" ||
                rangs[i].refcode == "06"
              ) {
                jobshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_post" ||
                rangs[i].refcode == "07"
              ) {
                postshow = true;
              }
              if (
                rangs[i].refcode == "hi_psnjob.pk_postseries" ||
                rangs[i].refcode == "08"
              ) {
                postseriesshow = true;
              }
            }
            vm.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_org", orgshow);
            vm.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_dept", deptshow);
            vm.$refs.ref_waclassrang.setData(
              "tableCoulmnVIfpk_psncl",
              psnclshow
            );
            vm.$refs.ref_waclassrang.setData(
              "tableCoulmnVIfpk_jobgrade",
              jobgradeshow
            );
            vm.$refs.ref_waclassrang.setData(
              "tableCoulmnVIfpk_jobrank",
              jobrankshow
            );
            vm.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_job", jobshow);
            vm.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_post", postshow);
            vm.$refs.ref_waclassrang.setData(
              "tableCoulmnVIfpk_postseries",
              postseriesshow
            );

            vm.$refs.ref_waclassrang.setTableData(null);
          }
        },
        orgChange(type, val) {
          var pk_group = vm.$context.getFbpGroupPk();

          if (!val.value[0]) {
            vm.$refs.ref_waclass_c.setData("rangeruleshow", false);
            vm.$refs.ref_waclass_c.setData("addflagshow", false);
          } else {
            var pk_org = val.value[0].id;
            vm.$refs.ref_waclass_c.setData("params", { pk_org: pk_org });
            vm.$refs.ref_waclassrang.setData("RefOrgParams", {
              pk_org: pk_org
            });
            //集团节点隐藏计薪规则等字段
            if (pk_group == pk_org) {
              vm.$refs.ref_waclass_c.setData("rangeruleshow", false);

              vm.$refs.ref_waclass_c.setData("addflagshow", true);
              //组织节点，隐藏允许下级能字段
            } else {
              //组织节点
              vm.$refs.ref_waclass_c.setData("addflagshow", false);

              vm.$refs.ref_waclass_c.setData("rangeruleshow", true);
            }
          }

          if (vm.subshow) {
            let deptshow = vm.$refs.ref_waclassrang.getData(
              "tableCoulmnVIfpk_dept"
            );

            let postshow = vm.$refs.ref_waclassrang.getData(
              "tableCoulmnVIfpk_post"
            );

            let rangs = vm.$refs.ref_waclassrang.getTableData();
            if (rangs) {
              rangs.forEach(function(row) {
                if (deptshow) {
                  row.pk_dept = null;
                }
                if (postshow) {
                  row.pk_post = null;
                }
              });
            }
          }
        }
      }
    };
  },
  mounted() {
    if (this.headEdit) {
      this.showsubicons = this.subicons;
    }
  },
  methods: {
    setBodyFieldShow(rangpks) {
      let orgshow = false;
      let deptshow = false;
      let psnclshow = false;
      let jobgradeshow = false;
      let jobrankshow = false;
      let jobshow = false;
      let postshow = false;
      let postseriesshow = false;

      if (rangpks.indexOf("0000Z700000000000001") != -1) {
        orgshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000002") != -1) {
        deptshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000003") != -1) {
        psnclshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000004") != -1) {
        jobgradeshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000005") != -1) {
        jobrankshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000006") != -1) {
        jobshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000007") != -1) {
        postshow = true;
      }
      if (rangpks.indexOf("0000Z700000000000008") != -1) {
        postseriesshow = true;
      }

      this.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_org", orgshow);

      this.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_dept", deptshow);

      this.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_psncl", psnclshow);

      this.$refs.ref_waclassrang.setData(
        "tableCoulmnVIfpk_jobgrade",
        jobgradeshow
      );

      this.$refs.ref_waclassrang.setData(
        "tableCoulmnVIfpk_jobrank",
        jobrankshow
      );

      this.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_job", jobshow);

      this.$refs.ref_waclassrang.setData("tableCoulmnVIfpk_post", postshow);

      this.$refs.ref_waclassrang.setData(
        "tableCoulmnVIfpk_postseries",
        postseriesshow
      );
    },

    // 基本信息取消按钮操作
    waclassCancel() {
      this.$context.getApp().back();
      // this.$router.push("/hrwa/waclass");
      this.waclassBase = null;
    },
    waclassEdit() {
      this.headEdit = true;
      this.showsubicons = this.subicons;
      this.$refs.ref_waclass_c.setData("orgeditable", false);
    },
    waclassrangDeleteClick(scope) {
      let rangs = this.$refs.ref_waclassrang.getTableData();
      rangs.splice(scope.rowIndex, 1);
    },
    addWaclassRang() {
      var tabledata = this.$refs.ref_waclassrang.getTableData();
      var formdata = {
        pk_org: "",
        pk_dept: "",
        pk_psncl: "",
        pk_job: "",
        pk_post: "",
        pk_jobgrade: "",
        pk_jobrank: "",
        pk_postseries: ""
      };
      var data;
      if (tabledata == undefined || tabledata == null) {
        data = [formdata];
      } else {
        data = tabledata;
        data.push(formdata);
      }
      this.$refs.ref_waclassrang.setTableData(data);
    },
    // 基本信息保存按钮操作
    waclassSave() {
      var data = this.$refs.ref_waclass_c.getFormData();
      var rangs;
      if (this.subshow) {
        let flag = false;
        rangs = this.$refs.ref_waclassrang.getTableData();
        if (!rangs || rangs.length == 0) {
          this.$message({
            message: "选择了计薪规则，计薪规则设置不能为空",
            type: "error"
          });
          return;
        }
        let orgshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_org"
        );
        let deptshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_dept"
        );
        let psnclshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_psncl"
        );
        let jobgradeshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_jobgrade"
        );
        let jobrankshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_jobrank"
        );
        let jobshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_job"
        );
        let postshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_post"
        );
        let postseriesshow = this.$refs.ref_waclassrang.getData(
          "tableCoulmnVIfpk_postseries"
        );

        rangs.forEach(function(row) {
          if (orgshow && row.pk_org == "") {
            flag = true;
          }
          if (deptshow && row.pk_dept == "") {
            flag = true;
          }
          if (psnclshow && row.pk_psncl == "") {
            flag = true;
          }
          if (jobgradeshow && row.pk_jobgrade == "") {
            flag = true;
          }
          if (jobrankshow && row.pk_jobrank == "") {
            flag = true;
          }
          if (jobshow && row.pk_job == "") {
            flag = true;
          }
          if (postshow && row.pk_post == "") {
            flag = true;
          }
          if (postseriesshow && row.pk_postseries == "") {
            flag = true;
          }
        });
        if (flag) {
          alert("计薪规则不能有空值，请检查");
          return;
        }
      }
      var savedata;
      if (rangs == undefined) {
        savedata = { main: data };
      } else {
        savedata = { main: data, subdata: rangs };
      }

      data.status = this.status;
      this.$refs.ref_waclass_c.validate(valid => {
        if (valid) {
          this.$http({
            url: "/hrwa/waclass/save",
            method: "post",
            data: savedata
          })
            .then(res => {
              this.$refs.ref_waclass_c.clearEdit();
              this.$refs.ref_waclassrang.clearEdit();
              if (res.data.status === true) {
                this.$router.push(
                  "/hrwa/waclass/edit/" +
                    res.data.data.pk_wa_class +
                    "/" +
                    false
                );
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "更新失败",
                type: "error"
              });
            });
        }
      });
    }
  }
};
</script>
<style>
</style>
