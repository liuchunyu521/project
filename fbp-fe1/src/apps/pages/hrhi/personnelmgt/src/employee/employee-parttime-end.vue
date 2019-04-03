<!--
  作者：yangchd
  时间：2018-11-09
  支持：员工管理——结束兼职
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="结束兼职"></ifbp-breadcrumb>

    <ifbp-main-area type="list">
      <ifbp-panel-group :navbar="false">
        <!-- 主体区域 -->
        <ifbp-panel id="endParttimePanel" title="兼职记录">
          <ifbp-template :ref="endPartRef"
                         tpl-id="hrhi_employee_endpart"
                         :tpl-data="templateData"
                         :editable="false"
                         :table-show-menu="false"
                         :cancel-button-show="false"
                         :edit-button-show="false"
                         :tpl-reset-fun="tableFormResetFun"
                         :computed="extraComputed"
                         :methods="extraMethods"
                         @power-table-click="tableFormEndClick">
          </ifbp-template>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>

    <!--结束日期选择-->
    <el-dialog title="结束日期" v-model="dialogVisible" :show-close="false" size="tiny">
      <div>
        <el-date-picker
                style="max-width: 250px;margin:0 auto;"
                v-model="effectDate"
                type="date"
                placeholder="选择结束日期"
                :show-icon="true">
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </ifbp-page>
</template>

<script>
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
export default {
  mixins: [pageModelMixin],
  data() {
    return {
      // 功能编码
      funcode:'funcode=60070employee',
      // 接口前缀
      requestPrefix:'/hrhi/employee/',

      mainInfo: {
        psnname: '',
        orgname: '',
        deptname: '',
      },
      //人员信息主键
      pk_psndoc: this.$root.$router.currentRoute.params.id,

      requestUrl: {
        list: "listSubInfo",
        save: "endParttime",
      },
      endPartRef:'endPartRef',
      templateData: {},

      tableFormResetFun($node) {
        let $table = this.getTableDom($node);
        $table.attr(':show-header', 'false');
        let operateArr = [{
          title: '结束兼职',
          icon: 'power',
          vif: "scope.row.poststat"
        }];
        let operateHtml = this.getTableOperateHtml(operateArr);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      extraComputed: {
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
      },

      extraMethods:{
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
                this.$message({message: res.data.msg, type: 'error'});
              }
            }).catch(() => {
              this.$message({message: '查询岗位信息失败！', type: 'error'});
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
                this.$message({message: res.data.msg, type: 'error'});
              }
            }).catch(() => {
              this.$message({message: '查询职务信息失败！', type: 'error'});
            });
          }
        },
      },

      isDimission: false,

      // dialog用参数
      selectedData:{},
      dialogVisible: false,
      effectDate: new Date(),
    };
  },
  mounted() {
    this.request();
  },
  methods: {
    // 获取数据
    request() {
      this.partTemplateInit();
    },

    partTemplateInit: function () {
      // 兼职页面专用
      let code = 'hi_psndoc_parttime';
      let data = {
        infoSetCode: code,
        pk_psndoc: this.pk_psndoc,
      };
      this.$http({
        method: "post",
        url: this.requestPrefix + this.requestUrl.list,
        params: data
      }).then(res => {
        if (res.data.status === true) {
          let resData = res.data.data;
          this.$refs[this.endPartRef].setTableData(resData);
        } else {
          this.$message({message: res.data.msg, type: "error"});
        }
      }).catch(() => {
        this.$message({message: "兼职信息获取失败！", type: "error"});
      });
    },

    refreshTableList:function () {
      this.partTemplateInit();
    },

    // 设置额外信息——这里暂时不校验离职，所以没用上
    resetData(res){
      this.isDimission = res.data.data.endflag;
    },

    // 结束兼职操作
    tableFormEndClick(scope) {
      if (this.isDimission) {
        this.$message({message: "当前选择的人员已经离职,不能进行操作.", type: "error"});
        return;
      }
      this.selectedData = JSON.parse(JSON.stringify(scope.row));
      this.setDialogVisible(true);
    },

    handleCancel(){
      this.dialogVisible = false;
    },

    handleSave() {
      if(!this.effectDate || this.selectedData.begindate >= this.effectDate){
        this.$message({message: "结束日期不能早于或等于开始日期！", type: "error"});
        return;
      }
      this.selectedData.enddate = this.effectDate.getTime();
      this.selectedData.poststat = false;
      this.execBill(this.selectedData);
    },

    execBill(data){
      let params = {
        infoSetCode: 'hi_psndoc_parttime',
        pk_psndoc: this.pk_psndoc,
      };
      this.$http({
        url: this.requestPrefix + this.requestUrl.save,
        method: "post",
        params: params,
        data: data,
      }).then(res => {
        if (res.data.status === true) {
          this.$message({message: "保存成功", type: "success"});
          this.setDialogVisible(false);
          this.refreshTableList();
        } else {
          this.$message({message: res.data.msg, type: "error"});
        }
      }).catch(() => {
        this.$message({message: "保存失败", type: "error"});
      });
    },

    // 设置dialog是否可见
    setDialogVisible: function (val) {
      this.dialogVisible = val;
    },
    
  }
};
</script>
