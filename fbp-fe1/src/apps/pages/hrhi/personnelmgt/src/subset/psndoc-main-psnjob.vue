<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工入职-新增-工作信息
-->
<template>
  <div>
    <ifbp-template
      :ref="psnjobMainRef"
      :tplId="tpl_id"
      :tplData="psnjobMainData"
      :tplResetFun="psnjobResetFun"
      :methods="psnjobExtraMethods"
      :computed="psnjobComputed"
      :editable="psnjobMainEdit"
      @after-create="afterCreateFunc"
      :form-show-message="psnjobMainEdit"
    ></ifbp-template>
  </div>
</template>

<script>
export default {
  props: {
    tpl_id: {
      type: String,
      required: true
    },
    pk_psndoc: String,
    clerkCode: Object,
    psnjobMainEdit: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    psnjobMainBtn: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
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
    const psndocMainPsnJobThis = this;
    return {
      // UI模板传入参数
      psnjobMainRef: "ref_psnjob_c",
      psnjobMainData: {
        // 员工号disabled属性值
        clerkCodeDisabled: false,
        rules: {
          trial_begindate: [
            {
              validator: (rule, value, callback) => {
                //判断合同期限类型，添加额外的校验
                let data = psndocMainPsnJobThis.$refs[psndocMainPsnJobThis.psnjobMainRef].getFormData();
                if (data.trial_flag && !data.trial_begindate) {
                  callback(new Error("请输入试用开始日期"));
                } else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ]
        }
      },

      isCreated: false,

      // 所有当前页面请求路径
      requestUrl: {
        getClerkCode: "/getClerkCode",
      },

      //原始数据保存
      originalValue: "",

      psnjobResetFun: function ($node) {
        // 给员工号加上disabled属性
        $node.find("[v-model='hi_psnjob.clerkcode']").attr(":disabled", "clerkCodeDisabled");
        // 组织变化触发事件
        $node.find("[v-model='hi_psnjob.pk_org']").attr("v-on:trigger", "orgTrigger");
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
          // 组织发生变化，有可能需要回滚旧号，取新号
          this.getNewClerkCode(this["hi_psnjob"].pk_org);

          // 选择组织后，清空部门、岗位、职务、职级、职等
          this["hi_psnjob"].pk_dept = "";
          this["hi_psnjob"].pk_post = "";
          this["hi_psnjob"].pk_job = "";
          this["hi_psnjob"].pk_jobgrade = "";
          this["hi_psnjob"].pk_jobrank = "";
        },

        getNewClerkCode: function (new_pk_org) {

          let precode = psndocMainPsnJobThis.clerkCode.precode;
          if (!precode) {
            return;
          }
          let old_pk_org = psndocMainPsnJobThis.clerkCode.pk_org;

          // 组织主键未发生变化，直接返回即可
          if (old_pk_org == new_pk_org) {
            return;
          }

          // 组织发生变化，给clerkCode赋值
          psndocMainPsnJobThis.clerkCode.pk_org = new_pk_org;

          let param = {
            oldClerkCode: psndocMainPsnJobThis.clerkCode.code,
            old_pk_org: old_pk_org,
            new_pk_org: new_pk_org
          };

          this.$http({
            url: psndocMainPsnJobThis.requestPrefix + psndocMainPsnJobThis.requestUrl.getClerkCode,
            method: "post",
            params: param
          }).then(res => {
            if (res.data.status === true) {
              psndocMainPsnJobThis.clerkCode.precode = res.data.data.precode;
              psndocMainPsnJobThis.clerkCode.code = res.data.data.code;
              psndocMainPsnJobThis.clerkCode.editable = res.data.data.editable;
              this["hi_psnjob"].clerkcode = res.data.data.code;
              this.clerkCodeDisabled = !res.data.data.editable;
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(res => {
            this.$message({ message: res, type: "error" });
          });
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
          let pk_post = this.hi_psnjob.pk_post;
          let pk_job = this.hi_psnjob.pk_job;
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
                    this["hi_psnjob"].beanMap.pk_job_ref =
                      defaultData.beanMap.pk_job_ref;

                    // 当岗位和职务同时存在的时候，职务优先
                    this.setDefaultDataByJob(defaultData.pk_job);
                  } else {
                    if (defaultData.pk_joblevel) {
                      this["hi_psnjob"].pk_jobgrade = defaultData.pk_joblevel;
                      this["hi_psnjob"].beanMap.pk_jobgrade_ref =
                        defaultData.beanMap.pk_joblevel_ref;
                    }
                    if (defaultData.defaultrank) {
                      this["hi_psnjob"].pk_jobrank = defaultData.defaultrank;
                      this["hi_psnjob"].beanMap.pk_jobrank_ref =
                        defaultData.beanMap.defaultrank_ref;
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
                    this["hi_psnjob"].beanMap.pk_jobgrade_ref =
                      defaultData.beanMap.pk_joblevel_ref;
                  }
                  if (defaultData.defaultrank) {
                    this["hi_psnjob"].pk_jobrank = defaultData.defaultrank;
                    this["hi_psnjob"].beanMap.pk_jobrank_ref =
                      defaultData.beanMap.defaultrank_ref;
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
      }
    };
  },

  watch: {
    clerkCode: {
      handler(newValue) {
        if (this.isCreated) {
          let data = this.$refs[this.psnjobMainRef].getFormData();
          if (newValue) {
            data.clerkcode = newValue.code;
          }

          this.$refs[this.psnjobMainRef].setFormData(data);
          if (newValue) {
            this.$refs[this.psnjobMainRef].setData("clerkCodeDisabled", !newValue.editable);
          }
        }
      },
      deep: true
    }
  },

  //初始化加载
  mounted() {

  },

  methods: {
    afterCreateFunc: function () {
      this.isCreated = true;
      let data = this.$refs[this.psnjobMainRef].getFormData();
      // remove by zyl 2018-12-04 15:39:31 某些项目不需要试用，会在模板上去掉，所以去掉这个默认值
      // data.trial_flag = true;

      if (this.clerkCode) {
        data.clerkcode = this.clerkCode.code;
      }

      this.$refs[this.psnjobMainRef].setFormData(data);
      if (this.clerkCode) {
        this.$refs[this.psnjobMainRef].setData("clerkCodeDisabled", !this.clerkCode.editable);
      }
      this.$emit('after-create');
    },

    // 修改新增或编辑的值
    changeEditValue: function (val) {
      this.$emit("editValueChange", val);
    },

    // 获取当前模块数据
    getTemplateData: function () {
      return this.$refs[this.psnjobMainRef].getFormData();
    },

    // 校验页面数据
    checkTemplateData: function () {
      let boolean = false;
      this.$refs[this.psnjobMainRef].validate((valid) => {
        boolean = valid;
      });
      return boolean;
    },

    // 查询或保存以后设置数据
    setTemplateData: function (data) {
      this.originalValue = data;
      this.$refs[this.psnjobMainRef].setFormData(
        JSON.parse(JSON.stringify(data))
      );
      this.$emit("dataChange", data);
    },

    // 重置表单数据
    resetTemplateData: function () {
      let data = this.$refs[this.psnjobMainRef].getFormData();
      if (data) {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            data[key] = "";
          }
        }
      }
      this.$refs[this.psnjobMainRef].setFormData(data);
      if (this.isCreated) {
        this.$nextTick(function () {
          this.$refs[this.psnjobMainRef].getFormComp().clearErrorMessage();
          this.afterCreateFunc();
        });
      }
    },

    // 清除编辑数据
    clearEditData: function () {
      this.$refs[this.psnjobMainRef].clearEdit();
    },
  }
};
</script>
