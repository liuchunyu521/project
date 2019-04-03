<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工-任职记录-带切换模式
-->
<template>
  <div style="margin-top: 16px;">
    <!--上部页签-->
    <ul class="experiencetabs clearfix" v-if="tableListVisible">
      <el-row :gutter="5">
        <el-col :style="styleObject" v-for="(tab,index) in tableListData" :key="index">
          <li class="experiencelist" @click="tabsSwitch(tab,index)">
            <a href="javascript:" class="experiencetab-link" v-bind:class="{active:tab.isSelected}"></a>
            <span class="experiencecircle"></span><span class="experienceortial"></span>
            <div class="experiencetime">{{tab.beginDateFormat}} - {{tab.endDateFormat}}</div>
          </li>
        </el-col>
      </el-row>
    </ul>
    <!--点击页签以后，显示的内容-->
    <ifbp-template  :ref="templateRef"
                    :tplId="tpl_id"
                    :tplData="templateData"
                    :editable="templateEdit"
                    :form-show-message="templateEdit"
                    show-type="form"
                    @after-create="afterCreateFunc"
                    :tplResetFun="tableFormResetFun"
                    :computed="psnjobComputed"
                    :methods="psnjobExtraMethods">
    </ifbp-template>
    <ifbp-form-button-area v-if="templateEdit">
      <el-button type="primary" @click="registerConfirm">保存</el-button>
      <el-button type="default" @click="registerCancel">取消</el-button>
    </ifbp-form-button-area>

  </div>
</template>

<script>
import { formatDate } from "../../../../../common/js/formatDate";
export default {
  props: {
    tpl_id: {
      type: String,
      required: true
    },
    pk_psndoc: String,
    clerkCodeEditable: Boolean,
    templateEdit: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    psndocData: Object,
    funcode: {
      type: String,
      required: true
    },
    requestPrefix: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      // infoSetCode
      infoSetCode: "hi_psnjob",
      // UI模板传入参数
      templateRef: "ref_psnjob_c",
      templateData: {
        // 员工号disabled属性值
        clerkCodeDisabled: false,
        orgDisabled: true,
      },
      tablePk: "pk_psnjob",
      templateUrl: {
        list_url: "/listSubInfo",
        save_url: "/saveSubInfo",
        delete_url: "/deleteSubInfo"
      },

      tableFormResetFun: function ($node) {
        // 将在岗设置成只有最新一条记录可以编辑
        $node.find("[v-model='hi_psnjob.poststat']").parent().html(
          '<el-checkbox id="hi_psnjob.poststat" :editable="editable" ' +
          'v-model="hi_psnjob.poststat" :disabled="!hi_psnjob.lastflag"></el-checkbox>'
        );

        // 给员工号加上disabled属性
        $node.find("[v-model='hi_psnjob.clerkcode']").attr(":disabled", "clerkCodeDisabled");
        // 组织变化触发事件
        $node.find("[v-model='hi_psnjob.pk_org']").attr("v-on:trigger", "orgTrigger");
        $node.find("[v-model='hi_psnjob.pk_org']").attr(":disabled", "orgDisabled");
        // 部门变化触发事件
        $node.find("[v-model='hi_psnjob.pk_dept']").attr("v-on:trigger", "deptTrigger");
        // 岗位变化触发事件
        $node.find("[v-model='hi_psnjob.pk_post']").attr("v-on:trigger", "postTrigger");
        // 职务变化触发事件
        $node.find("[v-model='hi_psnjob.pk_job']").attr("v-on:trigger", "jobTrigger");
        // 职级变化触发事件
        $node.find("[v-model='hi_psnjob.pk_jobgrade']").attr("v-on:trigger", "jobGradeTrigger");
        // 异动事件变化触发事件
        $node.find("[v-model='hi_psnjob.trnsevent']").attr("v-on:change", "trnseventChange");

        return $node[0].outerHTML;
      },

      psnjobComputed: {
        deptRefParams: function () {
          return {
            pk_org: this["hi_psnjob"].pk_org
          };
        },
        postRefParams: function () {
          return {
            pk_org: this["hi_psnjob"].pk_org,
            pk_dept: this["hi_psnjob"].pk_dept,
            pk_post: this["hi_psnjob"].pk_job ? "" : this["hi_psnjob"].pk_post,
            pk_job: this["hi_psnjob"].pk_job,
            pk_joblevel: this["hi_psnjob"].pk_jobgrade
          };
        }
      },

      psnjobExtraMethods: {
        // 组织变化触发事件
        orgTrigger: function () {
          // 选择组织后，清空部门、岗位、职务、职级、职等
          this["hi_psnjob"].pk_dept = "";
          this["hi_psnjob"].pk_post = "";
          this["hi_psnjob"].pk_job = "";
          this["hi_psnjob"].pk_jobgrade = "";
          this["hi_psnjob"].pk_jobrank = "";
        },

        // 部门变化触发事件
        deptTrigger: function () {
          // 选择部门后，清空岗位、职务、职级、职等
          this["hi_psnjob"].pk_post = "";
          this["hi_psnjob"].pk_job = "";
          this["hi_psnjob"].pk_jobgrade = "";
          this["hi_psnjob"].pk_jobrank = "";
        },

        // 岗位变化触发事件
        postTrigger: function () {
          // 选择岗位后，清空职务、职级、职等
          this["hi_psnjob"].pk_job = "";
          this["hi_psnjob"].pk_jobgrade = "";
          this["hi_psnjob"].pk_jobrank = "";

          // 触发岗位联动
          this.setDefaultDataByPost(this["hi_psnjob"].pk_post);
        },

        // 职务变化触发事件
        jobTrigger: function () {
          let pk_post = this["hi_psnjob"].pk_post;
          let pk_job = this["hi_psnjob"].pk_job;
          // 选择职务后，清空职级、职等
          this["hi_psnjob"].pk_jobgrade = "";
          this["hi_psnjob"].pk_jobrank = "";
          if (pk_job) {
            this.setDefaultDataByJob(pk_job);
          } else {
            this.setDefaultDataByPost(pk_post);
          }
        },

        // 职级变化触发事件
        jobGradeTrigger: function () {
          // 选择职级后，清空职等重新选择
          this["hi_psnjob"].pk_jobrank = "";
        },

        // 异动事件变化触发事件
        trnseventChange: function () {
          this["hi_psnjob"].trnstype = "";
        },

        setDefaultDataByPost: function (pk_post) {
          if (pk_post) {
            this.$http({
              url: "/hrjf/postJoin/findPostInfo/" + pk_post,
              method: "get"
            })
              .then(res => {
                if (res.data.status === true) {
                  let defaultData = res.data.data[0];
                  if (!this["hi_psnjob"].beanMap) {
                    this["hi_psnjob"].beanMap = defaultData.beanMap;
                  }
                  if (defaultData.pk_job) {
                    this["hi_psnjob"].pk_job = defaultData.pk_job;
                    this["hi_psnjob"].beanMap.pk_job_ref = defaultData.beanMap.pk_job_ref;

                    // 当岗位和职务同时存在的时候，职务优先
                    this.setDefaultDataByJob(defaultData.pk_job);
                  } else {
                    if (defaultData.pk_joblevel) {
                      this["hi_psnjob"].pk_jobgrade = defaultData.pk_joblevel;
                      this["hi_psnjob"].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                    }
                    if (defaultData.defaultrank) {
                      this["hi_psnjob"].pk_jobrank = defaultData.defaultrank;
                      this["hi_psnjob"].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                    }
                  }
                } else {
                  this.$message({ message: res.data.msg, type: "error" });
                }
              })
              .catch(() => {
                this.$message({ message: "查询岗位信息失败！", type: "error" });
              });
          }
        },

        // 根据职务获取变量
        setDefaultDataByJob: function (pk_job) {
          if (pk_job) {
            this.$http({
              url: "/hrjf/jobJoin/findJobLevelRank/" + pk_job,
              method: "get"
            })
              .then(res => {
                if (res.data.status === true) {
                  let defaultData = res.data.data;
                  if (!this["hi_psnjob"].beanMap) {
                    this["hi_psnjob"].beanMap = defaultData.beanMap;
                  }
                  if (defaultData.pk_joblevel) {
                    this["hi_psnjob"].pk_jobgrade = defaultData.pk_joblevel;
                    this["hi_psnjob"].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                  }
                  if (defaultData.defaultrank) {
                    this["hi_psnjob"].pk_jobrank = defaultData.defaultrank;
                    this["hi_psnjob"].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                  }
                } else {
                  this.$message({ message: res.data.msg, type: "error" });
                }
              })
              .catch(() => {
                this.$message({ message: "查询职务信息失败！", type: "error" });
              });
          }
        }
      },

      // 工作信息-最新的任职记录
      lastJob: {},
      // 页签数据
      tableListData: [],
      // 页签当前选择
      tableListIsSelected: 0,
      // 页签是否显示
      tableListVisible: true
    };
  },

  computed: {
    styleObject: function () {
      return {
        width: 100 / this.tableListData.length + "%"
      };
    }
  },

  // 初始化加载
  mounted() {
    this.requestTableData();
  },

  methods: {

    // 页面加载完触发的方法
    afterCreateFunc() {
      if (typeof (this.clerkCodeEditable) != "undefined") {
        // 因为this.codeEditable是布尔类型，所以只需判断是否未定义就行了
        this.$refs[this.templateRef].setData("clerkCodeDisabled", !this.clerkCodeEditable);
      }
    },

    // 初始化加载数据
    requestTableData() {
      if (!this.pk_psndoc) {
        // 一般来说肯定要传入人员主键
        return;
      }
      let data = {
        infoSetCode: this.infoSetCode,
        pk_psndoc: this.pk_psndoc
      };
      this.$http({
        url: this.requestPrefix + this.templateUrl.list_url,
        method: "post",
        params: data
      })
        .then(res => {
          if (res.data.status === true) {
            this.$nextTick(() => {
              this.tableListData = res.data.data;
              // 初始化默认选择
              let len = res.data.data.length;
              for (let i = 0; i < len; i++) {
                this.tableListData[i].isSelected = false;
              }
              this.tableListIsSelected = len - 1;
              this.tableListData[this.tableListIsSelected].isSelected = true;
              let selectedData = this.tableListData[this.tableListIsSelected];
              this.lastJob = selectedData;
              this.setTemplateListData(this.tableListData);
              this.$refs[this.templateRef].setFormData(JSON.parse(JSON.stringify(selectedData)));
            });
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        })
        .catch(() => {
          this.$message({ message: "查询失败", type: "error" });
        });
    },

    // 页签切换方法
    tabsSwitch: function (tab, index) {
      // 当删除了最后一个时，会溢出，所以这里加上校验
      if (this.tableListData.length >= this.tableListIsSelected + 1) {
        // 注意：vue绑定截取set和get方法，数组不支持，所有手动进行一次set，让页面和数据同步
        this.tableListData[this.tableListIsSelected].isSelected = false;
        this.$set(
          this.tableListData,
          this.tableListIsSelected,
          this.tableListData[this.tableListIsSelected]
        );
      }
      this.tableListIsSelected = index;
      this.$refs[this.templateRef].setFormData(
        JSON.parse(JSON.stringify(this.tableListData[this.tableListIsSelected]))
      );

      this.tableListData[this.tableListIsSelected].isSelected = true;
      this.$set(
        this.tableListData,
        this.tableListIsSelected,
        this.tableListData[this.tableListIsSelected]
      );

      // 如果clerkCodeEditable定义了，则设置员工号是否可编辑
      if (typeof this.clerkCodeEditable != "undefined") {
        // 如果不是最新的，都可以编辑，是最新的，则判断一下
        if (this.tableListData.length == this.tableListIsSelected + 1) {
          this.$refs[this.templateRef].setData("clerkCodeDisabled", !this.clerkCodeEditable);
        } else {
          this.$refs[this.templateRef].setData("clerkCodeDisabled", false);
        }
      }

    },

    // form新增
    tableFormAdd: function () {

      // 设置员工号可编辑
      this.$refs[this.templateRef].setData("clerkCodeDisabled", false);
      this.$refs[this.templateRef].setData("orgDisabled", false);

      this.tableListStatusChange(false);
      this.changeEditValue(true);
      let data = this.$refs[this.templateRef].getFormData();
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = "";
        }
      }
      if (this.tableListData && this.tableListData.length > 0) {
        data.clerkcode = this.tableListData[this.tableListData.length - 1].clerkcode;
      }
      this.$refs[this.templateRef].resetFormData();
      this.$refs[this.templateRef].setFormData(data);
    },

    // form删除
    tableFormDelete: function () {
      // 删除之前，判断是否为最新一条记录
      if (this.tableListData.length === this.tableListIsSelected + 1) {
        this.$message({ message: "最新任职记录不能删除", type: "error" });
        return;
      }
      this.$confirm("确认删除该数据？删除后无法恢复", "提示", {
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let data = {
            infoSetCode: this.infoSetCode,
            pk_psndoc_sub: this.tableListData[this.tableListIsSelected].pk_psnjob
          };
          this.$http({
            url: this.requestPrefix + this.templateUrl.delete_url,
            method: "post",
            params: data
          })
            .then(res => {
              if (res.data.status === true) {
                this.$message({ message: "删除成功", type: "success" });
                this.requestTableData();
                // 删除当前以后，将默认选择为第一个
                this.tabsSwitch(null, 0);
              } else {
                this.$message({ message: res.data.msg, type: "error" });
              }
            })
            .catch(() => {
              this.$message({ message: "删除失败", type: "error" });
            });
        })
        .catch(() => { });
    },

    // form的保存操作
    registerConfirm() {
      let data = this.$refs[this.templateRef].getFormData();
      this.$refs[this.templateRef].validate(valid => {
        if (valid) {
          data.pk_psndoc = this.pk_psndoc;
          // 判断开始日期不能等于或晚于最新任职记录
          let begindate = data.begindate;
          if (!data.lastflag && begindate >= this.lastJob.begindate) {
            this.$alert("不能存在开始日期等于或晚于最新任职记录开始日期的任职记录！", "警告", {
              confirmButtonText: "确定",
              type: "warning",
            });
          } else {
            this.subsetPsnjobRealSave(data);
          }
        }
      });
    },

    // 校验通过后的保存操作
    subsetPsnjobRealSave: function (data) {
      this.$http({
        url: this.requestPrefix + this.templateUrl.save_url,
        method: "post",
        params: { infoSetCode: this.infoSetCode, pk_psndoc: this.pk_psndoc },
        data: data
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.changeEditValue(false);
          this.requestTableData();
          this.$refs[this.templateRef].setData("orgDisabled", true);
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "保存失败", type: "error" });
      });
    },

    // 取消操作
    registerCancel: function () {
      this.$refs[this.templateRef].setFormData(
        JSON.parse(JSON.stringify(this.tableListData[this.tableListIsSelected]))
      );
      this.changeEditValue(false);
      this.$refs[this.templateRef].setData("orgDisabled", true);
    },

    // 修改新增或编辑的值
    changeEditValue: function (val) {
      this.$emit("editValueChange", val);
      // 当不可编辑的时候，页签一定显示
      if (!val) {
        this.tableListStatusChange(true);
      }
    },

    // 提供当前页的所有数据
    getTemplateListData: function () {
      return this.tableListData;
    },

    // 查询或保存以后设置数据
    setTemplateListData: function (data) {
      // 在这里对日期进行格式化
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].beginDateFormat = formatDate(data[i].begindate, "yyyy-MM-dd");
          data[i].endDateFormat = formatDate(data[i].enddate, "yyyy-MM-dd");
        }
      }
      this.$refs[this.templateRef].clearEdit();
      this.$emit("dataChange", JSON.parse(JSON.stringify(data)));
    },

    // 页签显示状态修改
    tableListStatusChange: function (val) {
      this.tableListVisible = val;
    }
  }
};
</script>

<style scoped>
.experiencetabs {
  padding-left: 0 !important;
}

.experiencetabs .el-row > div {
  overflow: visible !important;
}

.experiencetabs li {
  float: left;
  margin-right: 8px;
  list-style: none;
  position: relative;
  width: 100%;
}

.experiencetabs .experiencetab-link {
  display: block;
  width: 100%;
  height: 144px;
  text-align: center;
  line-height: 49px;
  background-color: #fff;
  color: #fff;
  text-decoration: none;
}

.experiencetabs .experiencetab-link.active {
  height: 144px;
  background: #c4ddff;
  opacity: 0.3;
  transition: 0.3s;
}

.experiencetabs .experiencecircle {
  position: absolute;
  top: 60px;
  left: -10px;
  width: 10px;
  height: 10px;
  border: 5px solid #5cb0e6;
  border-radius: 10px;
}

.experiencetabs .experienceortial {
  position: absolute;
  top: 69px;
  left: 10px;
  width: calc(100% - 10px);
  border-bottom: 4px solid #5cb0e6;
}

.experiencetime {
  overflow: hidden;
  height: 32px;
  line-height: 32px;
  background: #c4ddff;
  text-align: center;
  cursor: pointer;
}

.clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
}

.clearfix {
  zoom: 1;
}
</style>
