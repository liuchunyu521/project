<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工入职——详情界面
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="员工信息设置"></ifbp-breadcrumb>

    <ifbp-footer v-show="ifbpFooterShow">
      <el-button @click="registerDetailDelete">删除</el-button>
      <el-button type="primary" @click="psndocIntoDoc">转档</el-button>
      <el-button type="primary" @click="newEntryFormAction">入职申请</el-button>
      <el-button type="primary" @click="printTemplate">打印</el-button>
    </ifbp-footer>

    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="true">
        <!-- 人员详情部分 -->
        <ifbp-panel id="psndocPanel" title="基本信息" :icons="registerDetail.psndoc.icons">
          <psndoc-main-avatar :funcode="funcode"
                              :requestPrefix="requestPrefix"
                              :pk_psndoc="pk_psndoc"
                              :psndocData="registerData"
                              :templateEdit="registerDetail.psndoc.edit"
                              :mode="3"
                              @dataChange="psndocDataChange">
          </psndoc-main-avatar>
          <psndoc-main  :ref="registerDetail.psndoc.ref"
                        :pk_psndoc="pk_psndoc"
                        tpl_id="hrhi_register_detail_psndoc"
                        :funcode="funcode"
                        :requestPrefix="requestPrefix"
                        :codeEditable="codeEditable"
                        :psndocData="registerData"
                        :psndocMainEdit="registerDetail.psndoc.edit"
                        :psndocMainBtn="registerDetail.psndoc.edit"
                        @editValueChange="psndocEditValueChange"
                        @dataChange="psndocDataChange">
          </psndoc-main>
        </ifbp-panel>

        <!--任职记录-->
        <ifbp-panel id="psnjobPanel" title="任职记录" :icons="registerDetail.psnjob.icons">
          <psndoc-subset-psnjob :ref="registerDetail.psnjob.ref"
                                :pk_psndoc="pk_psndoc"
                                tpl_id="hrhi_register_detail_psnjob"
                                :funcode="funcode"
                                :requestPrefix="requestPrefix"
                                :clerkCodeEditable="clerkCodeEditable"
                                :templateEdit="registerDetail.psnjob.edit"
                                @editValueChange="psnjobEditValueChange"
                                @dataChange="psnjobDataChange">
          </psndoc-subset-psnjob>
        </ifbp-panel>
        <!-- 动态子集 -->
        <ifbp-dynamic-panel :defaultCrud="'false'"
                            :ref="dynRef"
                            :dynamic-no-code-reset-funs="dynamicNoCodeResetFunc"
                            :dynamic-template-props="dynamicTemplateProps"
                            :dynamic-tpl-data="dynamicTplData"
                            @update:editable="editableChange"
                            @expand="dynamicExpandChange"
                            :table-oper-vif="dynamicTableOperVif"
                            :dynamic-readonly="dynamicReadonly"
                            :child-icons="childIcons"
                            @plus-icon-click="plusIconClick"
                            @formConfirm="dynamicFormConfirm"
                            @formCancel="dynamicFormCancel"
                            @form-edit-click="dynamicFormEdit"
                            @form-delete-click="dynamicFormDelete"
                            @table-click="dynamicTableClick"
                            @after-create="afterCreate">
        </ifbp-dynamic-panel>

        <ifbp-panel id="attachmentPanel" title="附件管理">
          <ifbp-upload busi-code="register" force-type="normal" :pk-busi="pk_psndoc"></ifbp-upload>
        </ifbp-panel>

      </ifbp-panel-group>
    </ifbp-main-area>
    <!--转档dialog-->
    <psndoc-dialog-into-doc :ref="intoDocDialogRef"
                            :dialogData="intoDocDialogData"
                            @after_into_doc="registerDetailReturn">
    </psndoc-dialog-into-doc>
  </ifbp-page>
</template>

<script>
import PsndocMain from "../subset/psndoc-main.vue";
import PsndocMainAvatar from '../../../../../common/component/psndoc-main-avatar.vue';
import PsndocSubsetPsnjob from "../subset/psndoc-subset-psnjob.vue";

import PsndocDialogIntoDoc from "../components/psndoc-dialog-intodoc.vue";

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from '../../../../../common/printPre.js';
import pageLazyMixin from "ifbp-business/pageLazyMixin/pageLazyMixin.js";
export default {
  mixins: [pageModelMixin, printPre, pageLazyMixin],
  components: {
    PsndocMain,
    PsndocMainAvatar,
    PsndocSubsetPsnjob,
    PsndocDialogIntoDoc,
  },

  data() {
    const registerThis = this;
    return {
      // 功能编码
      funcode: "funcode=60070register",
      // 接口前缀
      requestPrefix: "/hrhi/register",
      //主键
      pk_psndoc: this.$root.$router.currentRoute.params["id"],

      // 全局按钮显示
      ifbpFooterShow: true,

      //存储人员基本信息和工作信息
      registerData: {
        psndoc: false,
        psnjob: false
      },

      // 详情页面panel相关变量
      registerDetail: {
        modifiable: ["psndoc", "psnjob",],
        psndoc: {
          ref: "ref_register_psndoc",
          edit: false
        },
        psnjob: {
          ref: "ref_psnjob_panel",
          edit: false
        }
      },
      // 人员编码、员工号 是否可编辑
      codeEditable: false,
      clerkCodeEditable: false,

      registerIcons: {
        psndoc: [
          {
            icon: "edit",
            click: function () {
              registerThis.psndocEditValueChange(!registerThis.registerDetail.psndoc.edit);
            }
          }
        ],
        psnjob: [
          {
            icon: "plus",
            click: function () {
              registerThis.$refs[registerThis.registerDetail.psnjob.ref].tableFormAdd();
            }
          },
          {
            icon: "edit",
            click: function () {
              registerThis.psnjobEditValueChange(!registerThis.registerDetail.psnjob.edit);
            }
          },
          {
            icon: "delete",
            click: function () {
              registerThis.$refs[registerThis.registerDetail.psnjob.ref].tableFormDelete();
            }
          }
        ],
      },

      // 动态部分
      dynRef: "dynRef",
      dynUrl: {
        list: "/listSubInfo",
        save: "/saveSubInfo",
        delete: "/deleteSubInfo",
        getCodeEditable: '/getCodeEditable',
        insertEntry: '/insertEntry',
      },

      // 所有子集code
      allTableCode: [],
      allInfoSetCode: [],

      dynamicNoCodeResetFunc: function ($node) {
        let $pageConfigTable = this.getTableDom($node);
        $pageConfigTable.attr(':show-header', 'false');
        let operateHtml = this.getBaseTableOperateHtml();
        $pageConfigTable.append(operateHtml);
        return $node[0].outerHTML;
      },
      dynamicTemplateProps: [],
      dynamicTplData: [],
      childIcons: [],

      // 子集计数
      countNum: 0,

      // 子集不可编辑
      dynamicReadonly: [],
      dynamicReadonlyTemp: [],
      dynamicReadonlyBak: [],
      dynamicReadonlyAll: [],

      // 列操作按钮
      dynamicTableOperVif: [],

      // 转档dialog
      intoDocDialogRef: "register_intoDoc_dialog",
      intoDocDialogData: [],
    };
  },

  created: function () {
    // 兼职
    let parttimeProps = {};
    parttimeProps.code = 'parttime';
    parttimeProps.props = {};
    parttimeProps.props.computed = {
      deptRefParams: function () {
        return {
          pk_org: this['hi_psndoc_parttime'].pk_org,
        };
      },
      postRefParams: function () {
        return {
          pk_org: this['hi_psndoc_parttime'].pk_org,
          pk_dept: this['hi_psndoc_parttime'].pk_dept,
          pk_post: this['hi_psndoc_parttime'].pk_job ? '' : this['hi_psndoc_parttime'].pk_post,
          pk_job: this['hi_psndoc_parttime'].pk_job,
          pk_joblevel: this['hi_psndoc_parttime'].pk_jobgrade,
        };
      },
    };

    parttimeProps.props.methods = {
      orgTrigger: function () {
        // 选择组织后，清空部门、岗位、职务、职级、职等
        this['hi_psndoc_parttime'].pk_dept = '';
        this['hi_psndoc_parttime'].pk_post = '';
        this['hi_psndoc_parttime'].pk_job = '';
        this['hi_psndoc_parttime'].pk_jobgrade = '';
        this['hi_psndoc_parttime'].pk_jobrank = '';
      },
      deptTrigger: function () {
        // 选择部门后，清空岗位、职务、职级、职等
        this['hi_psndoc_parttime'].pk_post = '';
        this['hi_psndoc_parttime'].pk_job = '';
        this['hi_psndoc_parttime'].pk_jobgrade = '';
        this['hi_psndoc_parttime'].pk_jobrank = '';
      },
      postTrigger: function () {
        // 选择岗位后，清空职务、职级、职等
        this['hi_psndoc_parttime'].pk_job = '';
        this['hi_psndoc_parttime'].pk_jobgrade = '';
        this['hi_psndoc_parttime'].pk_jobrank = '';
        // 触发岗位联动
        this.setDefaultDataByPost(this['hi_psndoc_parttime'].pk_post);
      },
      jobTrigger: function () {
        let pk_post = this['hi_psndoc_parttime'].pk_post;
        let pk_job = this['hi_psndoc_parttime'].pk_job;
        // 选择职务后，清空职级、职等
        this['hi_psndoc_parttime'].pk_jobgrade = '';
        this['hi_psndoc_parttime'].pk_jobrank = '';
        if (pk_job) {
          this.setDefaultDataByJob(pk_job);
        } else {
          this.setDefaultDataByPost(pk_post);
        }
      },

      jobGradeTrigger: function () {
        // 选择职级后，清空职等重新选择
        this['hi_psndoc_parttime'].pk_jobrank = '';
      },

      setDefaultDataByPost: function (pk_post) {
        if (pk_post) {
          this.$http({
            url: '/hrjf/postJoin/findPostInfo/' + pk_post,
            method: 'get',
          }).then((res) => {
            if (res.data.status === true) {
              let defaultData = res.data.data[0];
              if (!this['hi_psndoc_parttime'].beanMap) {
                this['hi_psndoc_parttime'].beanMap = defaultData.beanMap;
              }
              if (defaultData.pk_job) {
                this['hi_psndoc_parttime'].pk_job = defaultData.pk_job;
                this['hi_psndoc_parttime'].beanMap.pk_job_ref = defaultData.beanMap.pk_job_ref;

                // 当岗位和职务同时存在的时候，职务优先
                this.setDefaultDataByJob(defaultData.pk_job);
              } else {
                if (defaultData.pk_joblevel) {
                  this['hi_psndoc_parttime'].pk_jobgrade = defaultData.pk_joblevel;
                  this['hi_psndoc_parttime'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                }
                if (defaultData.defaultrank) {
                  this['hi_psndoc_parttime'].pk_jobrank = defaultData.defaultrank;
                  this['hi_psndoc_parttime'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                }
              }
            } else {
              this.$message({ message: res.data.msg, type: 'error' });
            }
          }).catch(() => {
            this.$message({ message: '查询岗位信息失败！', type: 'error' });
          });
        }
      },

      // 根据职务获取变量
      setDefaultDataByJob: function (pk_job) {
        if (pk_job) {
          this.$http({
            url: '/hrjf/jobJoin/findJobLevelRank/' + pk_job,
            method: 'get',
          }).then((res) => {
            if (res.data.status === true) {
              let defaultData = res.data.data;
              if (!this['hi_psndoc_parttime'].beanMap) {
                this['hi_psndoc_parttime'].beanMap = defaultData.beanMap;
              }
              if (defaultData.pk_joblevel) {
                this['hi_psndoc_parttime'].pk_jobgrade = defaultData.pk_joblevel;
                this['hi_psndoc_parttime'].beanMap.pk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
              }
              if (defaultData.defaultrank) {
                this['hi_psndoc_parttime'].pk_jobrank = defaultData.defaultrank;
                this['hi_psndoc_parttime'].beanMap.pk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
              }
            } else {
              this.$message({ message: res.data.msg, type: 'error' });
            }
          }).catch(() => {
            this.$message({ message: '查询职务信息失败！', type: 'error' });
          });
        }
      },
    };
    this.dynamicTemplateProps.push(parttimeProps);

    // 试用
    let trialProps = {};
    trialProps.code = 'trial';
    trialProps.props = {};
    trialProps.props.methods = {
      trialResultChange: function (val) {
        let thisData = this['hi_psndoc_trial'];
        let thisDataBak = this['hi_psndoc_trial_bak'];
        if (!thisDataBak) {
          //当数据备份不存在时，手动创建
          if (!this.hi_psndoc_trial_bak) {
            this.hi_psndoc_trial_bak = JSON.parse(JSON.stringify(thisData));
          }
          thisDataBak = this.hi_psndoc_trial_bak;
        }
        if (1 === val || 3 === val) {
          thisData.endflag = true;
          thisDataBak.trialresult = val;
        } else {
          //首先判断是不是新增
          if (!thisData.pk_psndoc_sub) {
            //没有主键，新增
            thisData.endflag = false;
            thisDataBak.trialresult = val;
          } else {
            //当非新增时，判断是不是历史记录
            if (thisData.lastflag &&
              (thisData.recordnum === 0 || "0" === thisData.recordnum)) {
              thisData.endflag = false;
              thisDataBak.trialresult = val;
            } else {
              this.$message({
                message: '历史试用记录不能选择延长试用期的试用结果或不选择试用结果',
                type: 'error'
              });
              thisData.trialresult = thisDataBak.trialresult;
            }
          }
        }
      },
    };
    this.dynamicTemplateProps.push(trialProps);

    // 合同模块
    let ctrtProps = {};
    ctrtProps.code = 'ctrt';
    ctrtProps.props = {};
    ctrtProps.props.methods = {
      conttypeChange: function (val) {
        if (val !== 1) {
          let tableData = this['hi_psndoc_ctrt_t'];
          let lastData;
          // 当合同不是签订的时候，给一个默认值
          if (tableData && tableData.length > 0) {
            for (let i = tableData.length - 1; i >= 0; i--) {
              if (tableData[i].lastflag) {
                // 当选择变更时，带出默认数据
                lastData = JSON.parse(JSON.stringify(tableData[i]));
                break;
              }
            }
            if (!lastData) {
              lastData = JSON.parse(JSON.stringify(tableData[tableData.length - 1]));
            }
            if (lastData.conttype === 4 || lastData.conttype === 5) {
              this.$message({ message: "合同签订记录已结束，请先重新签订合同！", type: "error" });
              this['hi_psndoc_ctrt'].conttype = 1;
              return;
            }

            let synData = ['pk_majorcorp', 'termtype', 'termmonth', 'begindate', 'enddate', 'ifprop', 'promonth', 'probegindate', 'probenddate', 'probenddate', 'startsalary'];
            this['hi_psndoc_ctrt'].contractnum = lastData.contractnum;
            if (val === 3 || val === 4 || val === 5) {
              for (let i = 0; i < synData.length; i++) {
                this['hi_psndoc_ctrt'][synData[i]] = lastData[synData[i]];
              }
            }
          } else {
            this['hi_psndoc_ctrt'].conttype = 1;
            this.$message({ message: "第一条合同信息只能是签订！", type: "error" });
          }
        }
        // 当不是签订或者变更时，试用设置为false
        if (val !== 1 || val !== 3) {
          this['hi_psndoc_ctrt'].ifprop = false;
        }
      },

      termTypeChange: function (val) {
        if ("CM02" === val) {
          this['hi_psndoc_ctrt'].termmonth = "";
          this['hi_psndoc_ctrt'].enddate = "";
        }
      },

      ifPropChange: function () {
        let trial = this['hi_psndoc_ctrt']['ifprop'];
        //需要试用为否时，试用期限、试用开始日期、试用结束日期、试用期工资不允许编辑
        if (!trial) {
          this['hi_psndoc_ctrt'].promonth = "";
          this['hi_psndoc_ctrt'].probegindate = "";
          this['hi_psndoc_ctrt'].probenddate = "";
          this['hi_psndoc_ctrt'].probsalary = "";
        }
      },

      // 合同期限改变
      computeTermmonth: function () {
        let begindate = this['hi_psndoc_ctrt'].begindate;
        let termmonth = this['hi_psndoc_ctrt'].termmonth;
        if (begindate && termmonth) {
          this['hi_psndoc_ctrt'].enddate = this.dateAddMonth(begindate, termmonth).getTime();
        } else {
          this['hi_psndoc_ctrt'].enddate = "";
        }
      },

      // 计算试用日期
      computePromonth: function () {
        let probegindate = this['hi_psndoc_ctrt'].probegindate;
        let promonth = this['hi_psndoc_ctrt'].promonth;
        if (probegindate && promonth) {
          this['hi_psndoc_ctrt'].probenddate = this.dateAddMonth(probegindate, promonth).getTime();
        } else {
          this['hi_psndoc_ctrt'].probenddate = "";
        }
      },

      dateAddMonth: function (date, month) {
        let now = new Date(date);
        let intYear = now.getFullYear();
        let intMonth = now.getMonth() + 1 + parseInt(month);
        let intDay = now.getDate();

        // 先进行月份的进位
        while (intMonth > 12) {
          intYear++;
          intMonth = intMonth - 12;
        }
        // 如果是每月一号，结束应该是上一个月的最后一天
        if (intDay === 1) {
          intMonth--; //减少一个月
          if (intMonth === 0) {
            intYear--; //0:减少一年
            intMonth = 12;
            intDay = 31;
          } else if (intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) {
            intDay = 30; //4,6,9,11:30天
          } else if (intMonth === 2) {
            intDay = 28; //2:28/29
            if (intYear % 4 === 0) {
              intDay = 29;
            }
          } else {
            intDay = 31; //1,3,5,7,8,10,12 :31天
          }
        } else {
          if (intMonth === 2 && intDay > 28) {
            if (intYear % 4 === 0) {
              intDay = 29;
            } else {
              intDay = 28;
            }
          }
          intDay--;
        }
        let strMonth = (intMonth) < 10 ? "0" + (intMonth).toString() : (intMonth).toString();
        let strDay = (intDay) < 10 ? "0" + (intDay).toString() : (intDay).toString();
        let strEndDate = intYear + "-" + strMonth + "-" + strDay;
        return new Date(strEndDate);
      }
    };
    this.dynamicTemplateProps.push(ctrtProps);

    let ctrtTplData = {};
    ctrtTplData.code = 'ctrt';
    ctrtTplData.tplData = {
      rules: {
        contractnum: [{
          validator: (rule, value, callback) => {
            let $node = this.$refs[this.dynRef].$refs["dynamic_ctrt"][0];
            //判断合同期限类型，添加额外的校验
            let formData = $node.getFormData();
            let tableData = $node.getTableData();
            if (tableData && tableData.length > 0) {
              let lastData;
              for (let i = tableData.length - 1; i >= 0; i--) {
                if (tableData[i].lastflag) {
                  // 当选择变更时，带出默认数据
                  lastData = JSON.parse(JSON.stringify(tableData[i]));
                  break;
                }
              }
              if (!lastData) {
                lastData = JSON.parse(JSON.stringify(tableData[tableData.length - 1]));
              }
              if (lastData.conttype === 4 || lastData.conttype === 5) {
                callback();
              } else {
                if (tableData && tableData.length > 0 && formData.conttype === 1) {
                  let flag = false;
                  for (let i = 0; i < tableData.length; i++) {
                    if (formData.pk_psndoc_sub !== tableData[i].pk_psndoc_sub
                      && formData.contractnum === tableData[i].contractnum) {
                      flag = true;
                      callback(new Error('合同编号已经存在'));
                    }
                  }
                  if (!flag) {
                    callback();
                  }
                } else {
                  callback();
                }
              }
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],

        termmonth: [{
          validator: (rule, value, callback) => {
            //判断合同期限类型，添加额外的校验
            let $node = this.$refs[this.dynRef].$refs["dynamic_ctrt"][0];
            let data = $node.getFormData();
            if (data.termtype !== 'CM02'
              && (typeof (value) === "undefined" || "" === value || "undefined" === value)) {
              callback(new Error('请输入合同期限'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],

        enddate: [{
          validator: (rule, value, callback) => {
            //判断合同期限类型，添加额外的校验
            let $node = this.$refs[this.dynRef].$refs["dynamic_ctrt"][0];
            let data = $node.getFormData();
            if (data.termtype !== 'CM02'
              && (typeof (value) === "undefined" || "" === value || "undefined" === value)) {
              callback(new Error('请输入合同结束日期'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],

        promonth: [{
          validator: (rule, value, callback) => {
            //判断合同期限类型，添加额外的校验
            let $node = this.$refs[this.dynRef].$refs["dynamic_ctrt"][0];
            let data = $node.getFormData();
            if (data.ifprop && (typeof (value) === "undefined" || "" === value || "undefined" === value)) {
              callback(new Error('请输入试用期限'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],

        probegindate: [{
          validator: (rule, value, callback) => {
            //判断合同期限类型，添加额外的校验
            let $node = this.$refs[this.dynRef].$refs["dynamic_ctrt"][0];
            let data = $node.getFormData();
            if (data.ifprop) {
              if (!value) {
                callback(new Error('请输入试用开始日期'));
              } else {
                let begindate = data.begindate;
                if (begindate && begindate > value) {
                  callback(new Error('试用开始日期不能早于合同开始日期！'));
                }
                callback();
              }
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],
        probenddate: [{
          validator: (rule, value, callback) => {
            //判断合同期限类型，添加额外的校验
            let $node = this.$refs[this.dynRef].$refs["dynamic_ctrt"][0];
            let data = $node.getFormData();
            if (data.ifprop && (typeof (value) === "undefined" || "" === value || "undefined" === value)) {
              callback(new Error('请输入试用结束日期'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],
      },
    };
    this.dynamicTplData.push(ctrtTplData);

    // 试用新增按钮
    let trialIcons = {};
    trialIcons.code = 'trial';
    trialIcons.icons = [
      {
        icon: 'plus',
        title: '新增',
        click: function () {
          let listData = this.$parent.getTableDataByCode('trial');
          if (listData) {
            for (let i = 0; i < listData.length; i++) {
              //对每一条记录都判断是否结束
              if (!listData[i]['endflag']) {
                this.$message({ message: "最新的试用记录没有结束,不能增加新的试用记录", type: "error" });
                return;
              }
            }
          }
          //关闭其他打开
          this.$parent.$refs['dynamic_trial'][0].getTableComp().closeExpandRow();
          this.$parent.$refs['dynamic_trial'][0].resetFormData();
          // 显示新增区域
          this.$parent.setItemAttrBycode('trial', 'dynamicEditable', true);
          this.$parent.$refs['dynamic_trial'][0].formShow = true;
          this.$parent.$emit('plus-icon-click', 'trial');
        }
      }
    ];
    this.childIcons.push(trialIcons);

    // 合同新增按钮
    let ctrtIcons = {};
    ctrtIcons.code = 'ctrt';
    ctrtIcons.icons = [
      {
        icon: 'plus',
        title: '新增',
        click: function () {
          // 入职操作里面，业务类型固定签订，编号1
          // 业务发生日期，默认当天
          let newData = {
            conttype: 1,
            signdate: new Date().getTime(),
            prop_unit: 2,
            cont_unit: 2,
          };
          let listData = this.$parent.getTableDataByCode('ctrt');
          // 如果没有数据，则是第一条合同，带上默认信息
          let psnjobData = {};
          if (this.$parent.registerData.psnjob) {
            for (let i = 0; i < this.$parent.registerData.psnjob.length; i++) {
              if (this.$parent.registerData.psnjob[i]['lastflag']) {
                psnjobData = JSON.parse(JSON.stringify(this.$parent.registerData.psnjob[i]));
                break;
              }
            }
          }
          if (!listData) {
            //开始日期
            newData.begindate = psnjobData.begindate;
            //试用
            newData.ifprop = psnjobData.trial_flag;
            newData.probegindate = psnjobData.trial_begindate;
            newData.probenddate = psnjobData.trial_enddate;
            //合同甲方
            newData.pk_majorcorp = psnjobData.pk_org;
            // 参照显示需要的数据，一定不能少
            newData.beanMap = psnjobData.beanMap;
            newData.beanMap.pk_majorcorp_ref = psnjobData.beanMap.pk_org_ref;

            newData.pk_org = psnjobData.pk_org;

          } else {
            newData.ifprop = true;
            //合同甲方
            newData.pk_majorcorp = psnjobData.pk_org;
            // 参照显示需要的数据，一定不能少
            newData.beanMap = psnjobData.beanMap;
            newData.beanMap.pk_majorcorp_ref = psnjobData.beanMap.pk_org_ref;
          }

          //关闭其他打开
          this.$parent.$refs['dynamic_ctrt'][0].getTableComp().closeExpandRow();
          this.$parent.$refs['dynamic_ctrt'][0].resetFormData();
          if (newData) {
            // 初始化新增数据
            let formData = this.$parent.getFormDataByCode('ctrt');
            for (let key in newData) {
              if (newData.hasOwnProperty(key) && newData[key]) {
                formData[key] = newData[key];
              }
            }
            this.$parent.setFormDataByCode('ctrt', formData);
          }
          // 显示新增区域
          this.$parent.setItemAttrBycode('ctrt', 'dynamicEditable', true);
          this.$parent.$refs['dynamic_ctrt'][0].formShow = true;
          this.$parent.$emit('plus-icon-click', 'ctrt');
        }
      }
    ];
    this.childIcons.push(ctrtIcons);

  },

  mounted() {
    // 解决定位不准的问题
    $("#main-right")[0].scrollTop = 0;
    this.registerDetailInit();
  },

  methods: {
    // 对页面按钮进行初始化
    registerDetailInit: function () {
      let modifiable = this.registerDetail.modifiable;
      if (modifiable) {
        for (let i = 0; i < modifiable.length; i++) {
          this.$set(this.registerDetail[modifiable[i]], "icons", this.registerIcons[modifiable[i]]);
        }
      }
      this.codeEditableFunc(this.pk_psndoc);
    },

    // 获取人员编码、员工号的可编辑性
    codeEditableFunc: function (pk_psndoc) {
      let param = {
        pk_psndoc: pk_psndoc
      };
      this.$http({
        url: this.requestPrefix + this.dynUrl.getCodeEditable,
        method: "post",
        params: param
      }).then(res => {
        if (res.data.status === true) {
          this.codeEditable = res.data.data.code;
          this.clerkCodeEditable = res.data.data.clerkCode;
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(res => {
        this.$message({ message: res, type: "error" });
      });
    },

    // 动态模板初始化以后，开始加载动态模板的数据
    afterCreate: function () {
      let codes = [];
      let infoSets = [];
      let readonlyAll = [];
      let tableOperVif = [];
      let pageData = this.$refs[this.dynRef].dynamicPageData;
      if (pageData && pageData.length > 0) {
        // 将模板的code和信息项编码分开，排除code写错时，无法显示的问题
        for (let i = 0; i < pageData.length; i++) {
          codes.push(pageData[i].code);
          let infoSet = {
            code: pageData[i].code,
            value: pageData[i].attributename
          };
          infoSets.push(infoSet);
          let readonly = {
            code: pageData[i].code,
            dynamicReadonly: true
          };
          readonlyAll.push(readonly);
          let operVif = {
            code: pageData[i].code,
            tableOperVif: true
          };
          tableOperVif.push(operVif);
        }
      }
      this.allTableCode = codes;
      this.allInfoSetCode = infoSets;
      this.dynamicReadonlyAll = readonlyAll;
      this.dynamicTableOperVif = tableOperVif;
      this.dynamicTemplateInit();
    },

    dynamicTemplateInit: function (codes) {
      if (!codes) {
        codes = this.allTableCode;
      } else {
        // 刷新前，进行一些关闭
        for (let i = 0; i < codes.length; i++) {
          let subThis = this.$refs[this.dynRef].$refs["dynamic_" + codes[i]][0];
          subThis.formShow = false;
          this.$refs[this.dynRef].setItemAttrBycode(codes[i], 'dynamicEditable', false);
          subThis.clearEdit();
        }
      }
      let infoSetCodes = this.getInfoSetCodeByCodes(codes);
      // 执行之前，设置数据备份
      this.tempData();
      // 动态扩展区获取所有页签编码 countNum
      for (let i = 0; i < infoSetCodes.length; i++) {
        this.countNum += 1;
        let data = {
          infoSetCode: infoSetCodes[i],
          pk_psndoc: this.pk_psndoc,
        };
        this.$http({
          method: "post",
          url: this.requestPrefix + this.dynUrl.list,
          params: data
        }).then(res => {
          if (res.data.status === true) {
            let resData = res.data.data;
            if (resData) {
              this.$refs[this.dynRef].setTableDataByCode(codes[i], resData);
            } else {
              this.$refs[this.dynRef].setTableDataByCode(codes[i], []);
            }
            this.changeReadOnly(codes[i]);
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
          this.countNum -= 1;
          // 合并备份数据
          this.mergeData();
        }).catch(() => {
          this.countNum -= 1;
          this.$message({ message: "人员信息获取失败！", type: "error" });
        });
      }
    },

    tempData: function () {
      let read = [];
      for (let m = 0; m < this.dynamicReadonly.length; m++) {
        let data = {
          code: this.dynamicReadonly[m].code,
          dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly
        };
        read.push(data);
      }
      this.dynamicReadonlyTemp = read;
    },

    mergeData: function () {
      if (this.countNum === 0) {
        this.dynamicReadonly = this.dynamicReadonlyTemp;
      }
    },

    getInfoSetCodeByCodes(codes) {
      let infoSetCodes = [];
      for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < this.allInfoSetCode.length; j++) {
          if (codes[i] === this.allInfoSetCode[j].code) {
            infoSetCodes.push(this.allInfoSetCode[j].value);
            break;
          }
        }
      }
      return infoSetCodes;
    },

    plusIconClick: function (code) {
      this.changeDynamicEditByCode(code);
    },

    dynamicFormConfirm: function (item) {
      // 获取信息项名称和数据
      let confirmThis = this;
      let code = item.code;
      let codes = [];
      codes.push(code);
      let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];

      this.$refs[this.dynRef].$refs["dynamic_" + code][0].validate(function (valid) {
        if (valid) {
          let dynamicFormData = confirmThis.$refs[confirmThis.dynRef].getFormDataByCode(code);
          dynamicFormData.pk_psndoc = confirmThis.pk_psndoc;
          let data = {
            infoSetCode: infoSetCode,
            pk_psndoc: confirmThis.pk_psndoc,
          };
          this.$http({
            url: confirmThis.requestPrefix + confirmThis.dynUrl.save,
            method: "post",
            params: data,
            data: dynamicFormData,
          }).then(res => {
            if (res.data.status === true) {
              this.$message({ message: "保存成功", type: "success" });
              confirmThis.resetDynamicEdit();
              confirmThis.dynamicTemplateInit(codes);
              for (let y = 0; y < confirmThis.dynamicTableOperVif.length; y++) {
                    if (confirmThis.dynamicTableOperVif[y].code === code) {
                        confirmThis.$set(confirmThis.dynamicTableOperVif[y], "tableOperVif", true);
                        break;
                    }
                }
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(() => {
            this.$message({ message: "保存失败", type: "error" });
          });
        }
      });
    },

    dynamicFormEdit: function (item, index, type, row) {
      this.changeDynamicEditByCode(item.code);
    },

    dynamicFormDelete(item, type, row) {
      this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
        closeOnClickModal: false,
        type: "warning"
      }).then(() => {
        let code = item.code;
        let codes = [];
        codes.push(code);
        let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];
        let data = {
          status: 3,
          infoSetCode: infoSetCode,
          subInfo: row
        };
        this.realDynamicDelete(data, codes);
      }).catch(() => {
      });
    },

    dynamicTableClick: function (item, index, icon, scope) {
      if ("edit" === icon) {
        let subThis = this.$refs[this.dynRef].$refs["dynamic_" + item.code][0];
        subThis.expandRow(scope.row, scope.$index);
        this.changeDynamicEditByCode(item.code);
      } else if ("delete" === icon) {
        this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
          closeOnClickModal: false,
          type: "warning"
        }).then(() => {
          let code = item.code;
          let codes = [];
          codes.push(code);
          let infoSetCode = this.getInfoSetCodeByCodes(codes)[0];
          let dynamicFormData = scope.row;

          let data = {
            status: 3,
            infoSetCode: infoSetCode,
            subInfo: dynamicFormData
          };
          this.realDynamicDelete(data, codes);
        }).catch(() => {
        });
      }
    },

    realDynamicDelete: function (data, codes) {
      let param = {
        infoSetCode: data.infoSetCode,
        pk_psndoc_sub: data.subInfo.pk_psndoc_sub ? data.subInfo.pk_psndoc_sub : data.subInfo.pk_psnjob,
      };
      this.$http({
        url: this.requestPrefix + this.dynUrl.delete,
        method: "post",
        params: param,
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: "删除成功", type: "success" });
          this.dynamicTemplateInit(codes);
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "删除失败", type: "error" });
      });
    },

    dynamicFormCancel: function () {
      this.resetDynamicEdit();
    },

    dynamicExpandChange: function (item, index, row, expanded) {
      let code = item.code;
      let readonly = false;
      for (let i = 0; i < this.dynamicReadonlyAll.length; i++) {
        if (this.dynamicReadonlyAll[i].code === code) {
          readonly = this.dynamicReadonlyAll[i].dynamicReadonly;
          break;
        }
      }
      for (let y = 0; y < this.dynamicTableOperVif.length; y++) {
        if (this.dynamicTableOperVif[y].code === code) {
          this.$set(this.dynamicTableOperVif[y], "tableOperVif", !expanded && readonly);
          break;
        }
      }
    },

    editableChange(item, index, editable) {
      this.$refs[this.dynRef].setItemAttrBycode(item.code, 'deleteButtonShow', !editable);
    },

    // 根据code修改只读状态
    changeReadOnly: function (code) {
      // 修改子集的可编辑状态
      let readonly = {
        code: code,
        dynamicReadonly: false,
      };
      for (let i = 0; i < this.dynamicReadonlyTemp.length; i++) {
        if (this.dynamicReadonlyTemp[i].code === readonly.code) {
          this.dynamicReadonlyTemp.splice(i, 1, readonly);
          return;
        }
      }
      this.dynamicReadonlyTemp.push(readonly);
    },

    // 人员基本信息编辑状态改变
    psndocEditValueChange: function (val) {
      if (val) {
        this.changeDynamicEditByCode();
      } else {
        this.resetDynamicEdit();
      }
      this.registerDetail.psndoc.edit = val;
    },

    // 工作信息编辑状态改变
    psnjobEditValueChange: function (val) {
      if (val) {
        this.changeDynamicEditByCode();
      } else {
        this.resetDynamicEdit();
      }
      this.registerDetail.psnjob.edit = val;
    },

    // 动态子集非编辑状态修改
    changeDynamicEditByCode: function (code) {
      // 先禁用人员基本信息
      this.registerDetail.psndoc.icons = [];
      this.registerDetail.psnjob.icons = [];
      this.ifbpFooterShow = false;

      let all = JSON.parse(JSON.stringify(this.dynamicReadonlyAll));
      if (code) {
        for (let i = 0; i < all.length; i++) {
          if (code === all[i].code) {
            this.$set(all[i], "dynamicReadonly", false);
          }
        }
      }
      let read = [];
      for (let m = 0; m < this.dynamicReadonly.length; m++) {
        let data = {
          code: this.dynamicReadonly[m].code,
          dynamicReadonly: this.dynamicReadonly[m].dynamicReadonly,
        };
        read.push(data);
      }
      if (!this.dynamicReadonlyBak || this.dynamicReadonlyBak.length <= 0) {
        this.dynamicReadonlyBak = read;
      }
      this.dynamicReadonly = all;
    },

    resetDynamicEdit: function () {
      if (this.dynamicReadonlyBak && this.dynamicReadonlyBak.length > 0) {
        this.dynamicReadonly = JSON.parse(JSON.stringify(this.dynamicReadonlyBak));
        this.dynamicReadonlyBak = [];
      }
      // 恢复人员基本信息
      let modifiable = this.registerDetail.modifiable;
      if (modifiable) {
        for (let i = 0; i < modifiable.length; i++) {
          this.$set(this.registerDetail[modifiable[i]], "icons", this.registerIcons[modifiable[i]]);
        }
      }
      this.ifbpFooterShow = true;
    },

    // 转档
    psndocIntoDoc: function () {
      let psndocs = [];
      let psndoc = this.registerData.psndoc;
      // 转档需要最新工作记录主键
      let psnjobs = this.registerData.psnjob;
      for (let i = 0; i < psnjobs.length; i++) {
        if (psnjobs[i].lastflag === true) {
          psndoc.pk_psnjob = psnjobs[i].pk_psnjob;
        }
      }
      psndocs.push(psndoc);
      this.intoDocDialogData = psndocs;
      this.$nextTick(() => {
        this.$refs[this.intoDocDialogRef].setDialogVisible(true);
      });
    },

    // 入职申请
    newEntryFormAction: function () {
      let pks = [];
      pks.push(this.pk_psndoc);
      this.$confirm('生成入职单据后，请在入职申请中查看单据状态', '提示', {
        closeOnClickModal: false,
        type: 'info'
      }).then(() => {
        this.entryApplyByPks(pks);
      }).catch(() => {
      });
    },

    entryApplyByPks: function (pks) {
      let param = {
        pk_psndocs: pks.join(','),
        pk_org: this.registerData.psndoc.pk_org,
      };
      this.$http({
        url: this.requestPrefix + this.dynUrl.insertEntry,
        method: "post",
        params: param,
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.$context.getApp().back();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "提交失败", type: "error" });
      });
    },

    // 删除人员
    registerDetailDelete: function () {
      this.$confirm("确认删除该数据？删除后无法恢复。", "提示", {
        closeOnClickModal: false,
        type: "warning"
      }).then(() => {
        this.registerDetailDeletePsndoc();
      }).catch(() => {
      });
    },

    // 详情界面删除人员
    registerDetailDeletePsndoc: function () {
      let delData = [];
      delData.push(this.registerData.psndoc);
      let para = {
        delData: delData
      };
      this.$http({
        url: this.requestPrefix + '/delete',
        method: "post",
        data: para
      }).then(res => {
        if (res.data.status === true) {
          this.$message({ message: res.data.msg, type: "success" });
          this.registerDetailReturn();
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(res => {
        this.$message({ message: "请求失败:" + res, type: "error" });
      });
    },

    // 人员基本信息数据改变
    psndocDataChange: function (val) {
      this.registerData.psndoc = val;
      // 将数据传入动态模板来使用
      this.$refs[this.dynRef].registerData = this.registerData;
    },

    // 工作信息数据改变
    psnjobDataChange: function (val) {
      this.registerData.psnjob = val;
      // 将数据传入动态模板来使用
      this.$refs[this.dynRef].registerData = this.registerData;
    },

    printTemplate: function () {
      let param = {
        billid: this.pk_psndoc,
      };
      this.printPre("60070register", "register-print-template", param);
    },

    // 详情页面返回列表
    registerDetailReturn() {
        this.$context.getApp().back();
    },

  }
};
</script>
