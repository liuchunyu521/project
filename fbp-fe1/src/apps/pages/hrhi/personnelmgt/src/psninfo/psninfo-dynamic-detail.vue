<!--
  作者：yangchd pengchb guoshou
  时间：2018-05-15
  支持：员工信息查询-详情界面
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="员工信息详情"></ifbp-breadcrumb>
    <ifbp-footer>
      <el-button type="primary" @click="printTemplate">打印</el-button>
    </ifbp-footer>
    
    <el-tabs :has-bottom-border = false v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="干部任免表" name="first">
			    <cadres-apt-dis-form :pk_psndoc="pk_psndoc">
			    </cadres-apt-dis-form>
		    </el-tab-pane>
		    
		    <el-tab-pane label="员工信息" name="second">
		    		<ifbp-main-area type="detail" v-if="activeName === 'second'">
			      <ifbp-panel-group  :navbar="true" base-nav-bar-top=1>
    
    <!--<ifbp-main-area type="detail">-->
      <!--<ifbp-panel-group :navbar="true">-->
        <!-- 人员详情部分 -->
        <ifbp-panel id="psndocPanel" title="基本信息">
          <psndoc-main-avatar :funcode="funcode" :requestPrefix="requestPrefix"
                              :mode="2"
                              :pk_psndoc="pk_psndoc" :psndocData="psndocData">
          </psndoc-main-avatar>
          <psndoc-main :ref="psninfoDetail.psndoc.ref" :pk_psndoc="pk_psndoc"
                       tpl_id="hrhi_psninfo_detail_psndoc"
                       :funcode="funcode" :requestPrefix="requestPrefix"
                       @dataChange="psndocDataChange">
          </psndoc-main>
        </ifbp-panel>

        <!--任职记录-->
        <ifbp-panel id="psnjobPanel" title="任职记录">
          <psndoc-subset-psnjob :ref="psninfoDetail.psnjob.ref" :pk_psndoc="pk_psndoc"
                                tpl_id="hrhi_psninfo_detail_psnjob"
                                :funcode="funcode" :requestPrefix="requestPrefix"
                                @dataChange="psnjobDataChange">
          </psndoc-subset-psnjob>
        </ifbp-panel>
        <!-- 动态子集 -->
        <ifbp-dynamic-panel :defaultCrud="'false'"
                            :ref="dynRef"
                            :dynamic-no-code-reset-funs="dynamicNoCodeResetFunc"
                            :dynamic-template-props="dynamicTemplateProps"
                            :dynamic-tpl-data="dynamicTplData"
                            :dynamic-readonly="dynamicReadonly"
                            :table-oper-vif="dynamicTableOperVif"
                            @after-create="afterCreate">
        </ifbp-dynamic-panel>
        <ifbp-panel id="attachmentPanel" title="附件管理">
          <ifbp-upload busi-code="psninfo"
                       force-type='normal'
                       :disableUpdate="attachmentDisable"
                       :disableUpload="attachmentDisable"
                       :disableDelete="attachmentDisable"
                       :pk-busi="pk_psndoc">
          </ifbp-upload>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
    
    	</el-tab-pane>
		</el-tabs>
		
  </ifbp-page>
</template>

<script>
import PsndocMain from "../subset/psndoc-main.vue";
import PsndocMainAvatar from "../subset/psndoc-main-avatar.vue";
import PsndocSubsetPsnjob from "../subset/psndoc-subset-psnjob.vue";

import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import printPre from '../../../../../common/printPre.js';
import pageLazyMixin from "ifbp-business/pageLazyMixin/pageLazyMixin.js";

import CadresAptDisForm from '../components/cadres-apt-dis-form.vue';

export default {
  mixins: [pageModelMixin, printPre, pageLazyMixin],
  components: {
    PsndocMain,
    PsndocMainAvatar,
    PsndocSubsetPsnjob,
    CadresAptDisForm
  },

  data() {
    return {
      // 功能编码
      funcode: "funcode=60070psninfo",
      // 接口前缀
      requestPrefix: "/hrhi/psninfo",

      //主键
      pk_psndoc: this.$root.$router.currentRoute.params["id"],

      // 附件修改禁用
      attachmentDisable: true,

      //存储人员基本信息和工作信息
      psndocData: {
        psndoc: false,
        psnjob: false
      },

      // 详情页面panel相关变量
      psninfoDetail: {
        psndoc: {
          ref: "ref_psninfo_psndoc",
          edit: false
        },
        psnjob: {
          ref: "ref_psnjob_panel",
          edit: false
        }
      },

      // 动态部分
      dynRef: "dynRef",
      dynUrl: {
        list: "/listSubInfo",
      },
      // 所有子集code
      allTableCode: [],
      // 所有信息集code
      allInfoSetCode: [],
      dynamicTplData: [],
      dynamicNoCodeResetFunc: function ($node) {
        let $pageConfigTable = this.getTableDom($node);
        $pageConfigTable.attr(':show-header', 'false');
        return $node[0].outerHTML;
      },
      dynamicResetFunc: [],
      dynamicTemplateProps: [],

      // 子集计数
      countNum: 0,

      // 子集不可编辑
      dynamicReadonly: [],
      dynamicReadonlyTemp: [],
      dynamicReadonlyAll: [],

      // 列操作按钮
      dynamicTableOperVif: [],

			//任免选项卡
			activeName: 'first',//页签
			judgetrue:false, //隐藏
			
    };
  },

  created() {

  },

  mounted() {
    // 解决定位不准的问题
    $("#main-right")[0].scrollTop = 0;
  },

  methods: {
    // 动态模板初始化以后，开始加载动态模板的数据
    afterCreate: function () {
      let codes = [];
      let infoSets = [];
      let readonlyAll = [];
      let tableOperVif = [];
      let tplData = [];
      let pageData = this.$refs[this.dynRef].dynamicPageData;
      if (pageData && pageData.length > 0) {
        debugger
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
          let tpl = {
            code: pageData[i].code,
            tplData: {
              postRefParams: {},
            }
          };
          tplData.push(tpl);
        }
      }
      this.allTableCode = codes;
      this.allInfoSetCode = infoSets;
      this.dynamicReadonlyAll = readonlyAll;
      this.dynamicTableOperVif = tableOperVif;
      this.dynamicTplData = tplData;
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
    // 人员基本信息数据改变
    psndocDataChange: function (val) {
      this.psndocData.psndoc = val;
    },
    // 工作信息数据改变
    psnjobDataChange: function (val) {
      this.psndocData.psnjob = val;
    },
    printTemplate: function () {
      let param = {
        billid: this.pk_psndoc,
      };
      this.printPre("60070psninfo", "psninfo-print-template", param);
    },
    
    //任免选项卡
    handleClick(tab, event) {//页签
				var _this = this;
				console.log(tab)
        if(tab.name == "first"){//第一页 不显示
        	_this.judgetrue = false;

        }else if(tab.name == "second"){//第二页 显示
        	_this.judgetrue = true;
        	console.log(_this.judgetrue)

        }
      }
    
    
  }
};
</script>
