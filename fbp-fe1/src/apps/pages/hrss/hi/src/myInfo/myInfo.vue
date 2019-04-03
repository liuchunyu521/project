<!--
  作者：yangchd
  时间：2018-05-17
  支持：员工自助——我的信息
-->
<template>
  <ifbp-page>
    <ifbp-breadcrumb name="我的信息"></ifbp-breadcrumb>
    <ifbp-footer>
      <el-button type="primary" @click="postAttachment" v-if="pk_post">岗位附件</el-button>
      <el-button type="primary" @click="jobAttachment" v-if="pk_job">职务附件</el-button>
      <el-button type="primary" @click="printTemplate">打印</el-button>
    </ifbp-footer>
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="true">
        <!-- 基本信息 -->
        <ifbp-panel id="headPanel" title="基本信息"
                    :icons="myInfoDetail.icons_left" :right-icons="myInfoDetail.icons_right">
          <span slot="left" v-show="myInfoDetail.psndoc.content">
            <i class="ifbp-icon-error-outline" style="color:red;margin-right:5px;"></i>
            <span v-text="myInfoDetail.psndoc.content" :title="myInfoDetail.psndoc.content"
                  style="display: inline-block;vertical-align: bottom;font-size: 16px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 800px;"></span>
          </span>
          <psndoc-main-avatar :ref="myInfoDetail.avatar.ref"
                              :psndocData="myInfoData"
                              :funcode="funcode" :requestPrefix="requestPrefix"
                              :templateEdit="myInfoDetail.psndoc.edit"
                              :mode="1"
                              @dataChange="psndocDataChange">
          </psndoc-main-avatar>
          <psndoc-main :ref="myInfoDetail.psndoc.ref"
                       :funcode="funcode" :requestPrefix="requestPrefix"
                       :psndocData="myInfoData"
                       :psndocMainEdit="myInfoDetail.psndoc.edit"
                       :psndocMainBtn="myInfoDetail.psndoc.edit"
                       @editValueChange="psndocEditValueChange"
                       @dataStatus="statusChange"
                       @dataChange="psndocDataChange">
          </psndoc-main>
        </ifbp-panel>

        <!-- 任职记录 -->
        <ifbp-panel id="bodyPanel" title="任职记录">
          <psndoc-subset-psnjob :ref="myInfoDetail.psnjob.ref"
                                :funcode="funcode" :requestPrefix="requestPrefix"
                                @dataChange="psnjobDataChange">
          </psndoc-subset-psnjob>
        </ifbp-panel>

        <!-- 动态子集 -->
        <ifbp-dynamic-panel :defaultCrud="'false'"
                            :ref="dynRef"
                            :right-icons="rightIcons"
                            :dynamic-tpl-data="dynamicTplData"

                            :dynamic-no-code-reset-funs="dynamicNoCodeResetFunc"
                            :dynamic-reset-funs="dynamicResetFunc"
                            :left-content="leftContent"
                            :dynamic-readonly="dynamicReadonly"

                            @update:editable="editableChange"
                            :table-oper-vif="dynamicTableOperVif"
                            @expand="dynamicExpandChange"

                            @formConfirm="dynamicFormConfirm"
                            @formCancel="dynamicFormCancel"
                            @form-edit-click="dynamicFormEdit"
                            @form-delete-click="dynamicFormDelete"

                            @table-click="dynamicTableClick"
                            @after-create="afterCreate">
        </ifbp-dynamic-panel>
        <ifbp-panel id="attachmentPanel" title="附件管理">
          <ifbp-upload
                  v-if="pk_psndoc"
                  busi-code="myInfo"
                  force-type='normal'
                  :pk-busi="pk_psndoc">
          </ifbp-upload>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
    <psndoc-my-info-attachment
            :ref="postDialog"
            v-if="pk_post"
            :pk_attachment="pk_post">
    </psndoc-my-info-attachment>
    <psndoc-my-info-attachment
            :ref="jobDialog"
            v-if="pk_job"
            :pk_attachment="pk_job">
    </psndoc-my-info-attachment>
  </ifbp-page>
</template>

<script>
// 固定部分，引入人员的
import PsndocMain from "./psndoc-main.vue";
import PsndocMainAvatar from '../../../../../common/component/psndoc-main-avatar.vue';
import PsndocSubsetPsnjob from "./psndoc-subset-psnjob.vue";
import PsndocMyInfoAttachment from './psndoc-myinfo-attachment.vue';

// 引入页面定制需要的方法
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from '../../../../../common/printPre.js';
import pageMixin from "ifbp-business/pageLazyMixin/pageLazyMixin.js";

export default {
  mixins: [pageModelMixin, printPre, pageMixin],
  components: {
    PsndocMain,
    PsndocMainAvatar,
    PsndocSubsetPsnjob,
    PsndocMyInfoAttachment
  },
  data() {
    const myInfoThis = this;
    return {
      // 功能编码
      funcode: "funcode=60420myInfo",
      // 权限前缀
      requestPrefix: "/hrss/psnInfo",

      // 固定部分参数
      myInfoData: {
        psndoc: false,
        psnjob: false
      },
      myInfoDetail: {
        avatar: {
          ref: "ref_avatar",
        },
        psndoc: {
          ref: "ref_myInfo_psndoc",
          edit: true,
          status: -1,
          content: "",
          contentBak: ""
        },
        psnjob: {
          ref: "ref_psnjob_panel"
        },
        icons_left: [],
        icons_right: []
      },

      // 动态部分
      dynRef: "dynRef",
      dynUrl: {
        list: "/listInfos",
        save: "/saveSubInfo",
        delete: "/deleteSubInfo",
        handle: "/handle",
        checkAttachment: '/checkAttachment',
      },
      // 所有子集code
      allTableCode: [],
      // 所有信息集code
      allInfoSetCode: [],

      dynamicTplData: [],
      dynamicNoCodeResetFunc: function ($node) {
        let $pageConfigTable = this.getTableDom($node);
        $pageConfigTable.attr(':show-header', 'false');
        let operateHtml = this.getBaseTableOperateHtml();
        $pageConfigTable.append(operateHtml);
        return $node[0].outerHTML;
      },
      dynamicResetFunc: [],

      // 子集计数
      countNum: 0,

      // 左侧提示文字
      leftContent: [],
      leftContentTemp: [],

      // 右侧按钮
      rightIcons: [],
      rightIconsTemp: [],
      rightIconsBak: [],

      // 子集不可编辑
      dynamicReadonly: [],
      dynamicReadonlyTemp: [],
      dynamicReadonlyBak: [],
      dynamicReadonlyAll: [],

      // 列操作按钮
      dynamicTableOperVif: [],

      psndocIcons: [
        {
          icon: "edit",
          click: function () {
            myInfoThis.psndocEditValueChange(
              !myInfoThis.myInfoDetail.psndoc.edit
            );
          }
        }
      ],
      psndocRightIcons: [],

      // 附件部分
      postDialog: 'postDialogRef',
      jobDialog: 'jobDialogRef',
      pk_post: '',
      pk_job: '',
    };
  },
  computed: {
    pk_psndoc: function () {
      if (this.myInfoData.psndoc) {
        return this.myInfoData.psndoc.pk_psndoc;
      } else {
        return '';
      }
    },
  },

  mounted() {
  },

  methods: {
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

    editableChange(item, index, editable) {
      this.$refs[this.dynRef].setItemAttrBycode(item.code, 'deleteButtonShow', !editable);
    },

    dynamicTemplateInit: function (codes) {
      if (!codes) {
        codes = this.allTableCode;
        this.rightIcons = [];
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
        let dataCodes = [];
        dataCodes.push(infoSetCodes[i]);
        let data = {
          infoSetCodes: dataCodes.join(",")
        };
        this.$http({
          method: "post",
          url: this.requestPrefix + this.dynUrl.list,
          params: data
        }).then(res => {
          if (res.data.status === true) {
            if (res.data[infoSetCodes[i]]) {
              let resData = res.data[infoSetCodes[i]];
              if (resData["uivo"]) {
                this.$refs[this.dynRef].setTableDataByCode(codes[i], resData["uivo"]);
              } else {
                this.$refs[this.dynRef].setTableDataByCode(codes[i], []);
              }
              this.subIconAdd(codes[i], resData["status"]);
              this.subMessageAdd(codes[i], resData["content"]);
              this.changeReadOnly(codes[i], resData["status"]);
            }
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
          let data = {
            infoSetCode: infoSetCode,
            subInfo: dynamicFormData
          };
          this.$http({
            url: confirmThis.requestPrefix + confirmThis.dynUrl.save,
            method: "post",
            data: data
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
          this.$set(
            this.dynamicTableOperVif[y],
            "tableOperVif",
            !expanded && readonly
          );
          break;
        }
      }
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
      this.$http({
        url: this.requestPrefix + this.dynUrl.save,
        method: "post",
        data: data
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

    // 根据infoSetCode和状态获得按钮
    getBtnByCodeAndStatus: function (code, status) {
      let btnThis = this;
      // 人员的单独处理
      let icons = [];
      if (status === 0) {
        icons = [
          {
            icon: "send",
            title: "提交",
            click: function () {
              btnThis.doBtnByCodeAndName(code, "commit");
            }
          },
          {
            icon: "restore",
            title: "还原",
            click: function () {
              btnThis.doBtnByCodeAndName(code, "revert");
            }
          }
        ];
      } else if (status === 1) {
        icons = [
          {
            icon: "undo",
            title: "收回",
            click: function () {
              btnThis.doBtnByCodeAndName(code, "callback");
            }
          }
        ];
      } else if (status === 3) {
        icons = [
          {
            icon: "edit",
            title: "继续修改",
            click: function () {
              btnThis.doBtnByCodeAndName(code, "goonUpdate");
            }
          },
          {
            icon: "restore",
            title: "还原",
            click: function () {
              btnThis.doBtnByCodeAndName(code, "noUpdate");
            }
          }
        ];
      }
      return icons;
    },

    // 根据code和按钮发送请求
    doBtnByCodeAndName: function (code, name) {
      let codes = [];
      codes.push(code);
      let infoSetCodes = this.getInfoSetCodeByCodes(codes)[0];
      if ("bd_psndoc" === code) {
        infoSetCodes = code;
      }
      let data = {
        infoSetCode: infoSetCodes,
        handleType: name
      };
      this.$http({
        method: "post",
        url: this.requestPrefix + this.dynUrl.handle,
        params: data
      }).then(res => {
          if (res.data.status === true) {
            if (code === "bd_psndoc") {
              // 如果是还原操作，刷新一下照片
              if ("revert" == name) {
                this.$refs[this.myInfoDetail.avatar.ref].imgUrl = this.$refs[this.myInfoDetail.avatar.ref].getDefaultPhotoUrl();
              }
              this.$refs[this.myInfoDetail.psndoc.ref].requestPsndocMain();
            } else {
              this.dynamicTemplateInit(codes);
            }
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        }).catch(() => {
          this.$message({ message: "操作失败", type: "error" });
        });
    },

    /**
     * 拼接子集的右侧按钮
     * @param code
     * @param status
     * 0：已修改、未提交
     * 1：已提交
     * 2：审核通过
     * 3：审核未通过
     */
    subIconAdd: function (code, status) {
      let icon = this.getBtnByCodeAndStatus(code, status);
      let data = {
        code: code,
        icons: icon
      };
      for (let i = 0; i < this.rightIconsTemp.length; i++) {
        if (this.rightIconsTemp[i].code === data.code) {
          this.rightIconsTemp.splice(i, 1, data);
          return;
        }
      }
      this.rightIconsTemp.push(data);
    },

    // 根据code拼接提示信息
    subMessageAdd: function (code, content, status) {
      let dom;
      if (content) {
        dom = $(
          '<span title="' + content + '" style="display: inline-block;vertical-align: bottom;font-size: 16px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' +
          '<i class="ifbp-icon-error-outline" style="color: red;margin-right:5px;"></i>' + content +
          '</span>'
        )[0];
      } else {
        dom = $('<span></span>')[0];
      }
      let data = {
        code: code,
        dom: dom
      };
      for (let i = 0; i < this.leftContentTemp.length; i++) {
        if (this.leftContentTemp[i].code === code) {
          this.leftContentTemp.splice(i, 1, data);
          return;
        }
      }
      this.leftContentTemp.push(data);
    },

    // 根据code和状态修改只读状态
    changeReadOnly: function (code, status) {
      // 修改子集的可编辑状态，已提交和审核未通过的，不允许编辑
      let readonly = {
        code: code,
        dynamicReadonly: status === 1 || status === 3
      };
      for (let i = 0; i < this.dynamicReadonlyTemp.length; i++) {
        if (this.dynamicReadonlyTemp[i].code === readonly.code) {
          this.dynamicReadonlyTemp.splice(i, 1, readonly);
          return;
        }
      }
      this.dynamicReadonlyTemp.push(readonly);
    },

    tempData: function () {
      let right = [];
      for (let i = 0; i < this.rightIcons.length; i++) {
        let data = {
          code: this.rightIcons[i].code,
          icons: this.rightIcons[i].icons,
        };
        right.push(data);
      }
      this.rightIconsTemp = right;

      let left = [];
      for (let j = 0; j < this.leftContent.length; j++) {
        let data = {
          code: this.leftContent[j].code,
          dom: this.leftContent[j].dom
        };
        left.push(data);
      }
      this.leftContentTemp = left;

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
        this.rightIcons = this.rightIconsTemp;
        this.leftContent = this.leftContentTemp;
        this.dynamicReadonly = this.dynamicReadonlyTemp;
      }
    },

    // 人员基本信息数据改变
    psndocDataChange: function (val) {
      this.myInfoData.psndoc = val;
    },

    // 工作信息数据改变
    psnjobDataChange: function (val) {
      this.myInfoData.psnjob = val;
      if (val && val.length > 0) {
        let jobData = false;
        for (let i = 0; i < val.length; i++) {
          if (val[i].lastflag) {
            jobData = val[i];
            break;
          }
        }
        if (!jobData) {
          jobData = val[val.length - 1];
        }
        if (jobData.pk_post || jobData.pk_job) {
          let data = {
            pk_post: jobData.pk_post ? jobData.pk_post : '-1',
            pk_job: jobData.pk_job ? jobData.pk_job : '-1',
          };
          this.$http({
            method: "post",
            url: this.requestPrefix + this.dynUrl.checkAttachment,
            params: data
          }).then(res => {
            if (res.data.status === true) {
              let map = res.data.data;
              this.pk_post = map.pk_post ? map.pk_post : '';
              this.pk_job = map.pk_job ? map.pk_job : '';
            } else {
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(() => {
            this.$message({ message: "操作失败", type: "error" });
          });
        }
      }
    },

    // 人员基本信息信息状态
    statusChange: function (data) {
      let val = data["status"];
      this.myInfoDetail.psndoc.status = val;
      this.psndocRightIcons = this.getBtnByCodeAndStatus("bd_psndoc", val);
      this.myInfoDetail.icons_right = this.psndocRightIcons;
      if (val === 1) {
        this.myInfoDetail.icons_left = [];
      } else {
        this.myInfoDetail.icons_left = this.psndocIcons;
      }
      if (data["content"]) {
        this.myInfoDetail.psndoc.content = data["content"];
      } else {
        this.myInfoDetail.psndoc.content = "";
      }
    },

    // 人员基本信息编辑状态改变
    psndocEditValueChange: function (val) {
      if (val) {
        this.changeDynamicEditByCode();
      } else {
        this.resetDynamicEdit();
      }
      this.myInfoDetail.psndoc.edit = val;
    },

    // 动态子集非编辑状态修改
    changeDynamicEditByCode: function (code) {
      // 先禁用人员基本信息
      this.myInfoDetail.icons_left = [];
      this.myInfoDetail.icons_right = [];
      this.myInfoDetail.psndoc.contentBak = JSON.parse(
        JSON.stringify(this.myInfoDetail.psndoc.content)
      );
      this.myInfoDetail.psndoc.content = "";

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
      this.dynamicReadonlyBak = read;
      this.dynamicReadonly = all;

      let right = [];
      for (let i = 0; i < this.rightIcons.length; i++) {
        let data = {
          code: this.rightIcons[i].code,
          icons: this.rightIcons[i].icons,
        };
        right.push(data);
      }
      this.rightIconsBak = right;
      for (let m = 0; m < this.rightIcons.length; m++) {
        this.$set(this.rightIcons[m], 'icons', []);
      }
    },

    resetDynamicEdit: function () {
      if (this.dynamicReadonlyBak && this.dynamicReadonlyBak.length > 0) {
        this.dynamicReadonly = JSON.parse(JSON.stringify(this.dynamicReadonlyBak));
        this.dynamicReadonlyBak = [];
      }

      // 回复右侧按钮
      this.rightIcons = this.rightIconsBak;

      // 恢复人员基本信息
      if (this.myInfoDetail.psndoc.status !== 1) {
        this.myInfoDetail.icons_left = this.psndocIcons;
      } else {
        this.myInfoDetail.icons_left = [];
      }
      this.myInfoDetail.icons_right = this.psndocRightIcons;
      this.myInfoDetail.psndoc.content = this.myInfoDetail.psndoc.contentBak;
    },

    printTemplate: function () {
      let param = {
        billid: this.myInfoData.psndoc.pk_psndoc,
      };
      this.printPre("60420myInfo", "myInfo-print-template", param);
    },

    postAttachment: function () {
      this.$refs[this.postDialog].setDialogVisible(true);
    },

    jobAttachment: function () {
      this.$refs[this.jobDialog].setDialogVisible(true);
    },
  }
};
</script>
