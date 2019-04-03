<template>
  <ifbp-page :noPadding="true" id="hitagmgr">
    <ifbp-breadcrumb name="标签管理" v-show="false"></ifbp-breadcrumb>
    <md-layout ref="mdLayout" :aside-width="asideWidth" @showMastList="showMastList">
      <div slot="master">
        <md-page>
          <h4 slot="title" class="header-title">
            标签类型({{tagTypeList.length}})
            <i
              class="toggle-icon ifbp-icon-format-indent-decrease"
              @click="toggleLeft"
            ></i>
          </h4>
          <div slot="content">
            <ul>
              <div
                v-show="tagTypeList.length=='0'"
                style="text-align: center;line-height: 48px;color: #666;font-size: 16px;"
              >暂无标签类型
                <el-tooltip effect="light" content="只有有集团权限的人,才可以维护标签类型！" placement="bottom-start">
                  <i class="ifbp-icon-help" style="color:#ecbc04;height:18px;"></i>
                </el-tooltip>
              </div>
              <li
                class="aside-item"
                v-for="(item,index) in tagTypeList"
                :key="index"
                @click="handleClickItem(item,index)"
                :class="{'aside-itembackground':clickidx==index}"
              >
                <div class="aside-item-info" :title="item.name">
                  <div style="display: inline-block;width:80%;">{{item.name}}</div>
                  <div class="fr icon" v-if="isGroupUser">
                    <i
                      class="ifbp-icon-edit"
                      style="margin-left: 8px;"
                      @click.stop="editType(item)"
                    ></i>
                    <i
                      class="ifbp-icon-delete"
                      style="margin-left: 8px;"
                      @click.stop="delType(item)"
                    ></i>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 页脚右侧按钮 -->
          <div slot="footer" v-if="isGroupUser">
            <div class="fr">
              <i class="ifbp-icon-add footer-icon" @click="addType"></i>
              <i class="hr-icon-swap_vert footer-icon" @click="orderType"></i>
            </div>
          </div>
        </md-page>
      </div>
      <span slot="detail">
        <!-- 右侧详情页面 -->
        <md-page
          :showFooter="true"
          :showExpandbtn="true"
          :container-class="topClass "
          style="position: relative;"
        >
          <div slot="title" class="header-title">
            <div>
              <div
                style="position:absolute;top:0px;"
                :style="{'left':toggleLeftflag==true ? '8px':'35px'}"
              >
                <div style="box-sizing: border-box;position:relative;height:47px;">
                  <hr-org-cascader name="treeCascader" @update:pk_org="orgChange" :needGroup="true" @change="handleTreeChange"　style="line-height: 32px;"></hr-org-cascader>
                  <!--<el-cascader-->
                    <!--style="line-height: 32px;"-->
                    <!--ref="treeCascader"-->
                    <!--expand-trigger="hover"-->
                    <!--:hide-border="true"-->
                    <!--:hide-right="true"-->
                    <!--:options="orgTreeData"-->
                    <!--v-model="selectedTreeNode"-->
                    <!--placeholder="请选择组织"-->
                    <!--not-leaf-selectable="true"-->
                    <!--@change="handleTreeChange"-->
                    <!--:show-all-levels="false"-->
                  <!--&gt;</el-cascader>-->
                </div>
              </div>
              <div>
                <span :title="tagTypeName" class="tagTypeName">{{tagTypeName}}</span>
              </div>
            </div>
          </div>
          <div slot="content">
            <div
              v-show="tagTypeList.length==0"
              style="position: relative;text-align: center;width: 100%;"
            >
              <div style="position: absolute;left: 50%;margin-left: -180px;margin-top: 162px;">
                <div>
                  <i
                    style="color: #C8C8CD;font-size: 100px;margin-bottom: 42px;"
                    class="ifbp-icon-copy"
                  ></i>
                </div>
                <div style="color: #75787B;font-size: 20px;">暂无标签信息，请先新建标签类型吧</div>
              </div>
            </div>
            <ifbp-no-data
              :total-elements="totalElements"
              no-data-text="暂无标签信息"
              v-if="tagTypeList.length>0"
              no-data-head=".no-data-header-content"
              class="no-data-no-breadcrumb"
            >
              <ifbp-main-area type="list" class="maringTop0" v-show="tagTypeList.length>0">
                <div class="no-data-header-content">
                  <div class="ifbp-btn-line">
                    <div class="fl">
                      <span class="ifbp-layout-content-left-span">标签({{totalElements}})</span>
                      <el-checkbox class="marginleft24" v-model="disStop" @change="disStopChg">显示停用</el-checkbox>
                    </div>
                    <div class="fr">
                      <el-button
                        type="text"
                        class="ifbp-layout-content-right-button marginleft24"
                        @click="addTag"
                        v-if="!isEdit"
                      >创建标签</el-button>
                      <i class="hr-icon-swap_vert marginleft16" @click="orderTag" title="排序"></i>
                      <i
                        class="ifbp-icon-setting marginleft16"
                        @click="showHeaderSettingcheck"
                        title="设置"
                      ></i>
                    </div>
                  </div>

                  <ifbp-template
                    ref="tagListRef"
                    tpl-id="hrhi_tag_list"
                    :tpl-data="tableData"
                    :table-show-menu="false"
                    class="el-table-no-empty"
                    :tplResetFun="tableResetFun"
                    :methods="tableMethods"
                    :editable="isEdit"
                    @update:editable="updateEditable"
                    :table-oper-vif="tableOperVif"
                    :confirm-button-show="isEdit"
                    :edit-button-show="!isEdit"
                    :cancel-button-show="isEdit"
                    :delete-button-show="!isEdit"
                    :confirm-clear-edit="false"
                    @after-create="tagListTplCreate"
                    @expand="expandChange"
                    @edit-table-click="tableFormEditClick"
                    @delete-table-click="deleteTag"
                    @form-confirm-click="tableFormConfirm"
                    @form-edit-click="tableFormEdit"
                    @form-delete-click="formDeleteTag"
                    @form-cancel-click="tableFormCancel"
                  ></ifbp-template>

                  <!--分页组件-->
                  <el-pagination
                    v-if="tableListData.length>0"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements"
                  ></el-pagination>
                  <!--<tag-dis pk_psndoc="0001AA1000000002ZK0E" pk_org="0001A910000000000B9Y" mode="3"></tag-dis>-->
                </div>
              </ifbp-main-area>
            </ifbp-no-data>
          </div>
        </md-page>
      </span>
    </md-layout>
    <drag-dialog
      @orderEndvalue="saveTagTypeOrder"
      :cascaderdialogVisible="tagTypeOrderVisible"
      @casdialogVisible="tagTypeOrderVisible=false"
      title="标签类型排序"
      :casShow="false"
      :orderData="tagTypeOrderList"
    ></drag-dialog>
    <drag-dialog
      @orderEndvalue="saveTagOrder"
      @casdialogVisible="tagOrderVisible=false"
      :cascaderdialogVisible="tagOrderVisible"
      title="标签排序"
      :casShow="false"
      :orderData="tagOrderList"
    ></drag-dialog>

    <el-dialog :title="tagTypeTitle" v-model="tagTypeVisible" size="tiny">
      <ifbp-template
        style="margin-top: 0px;"
        ref="tagTypeRef"
        tpl-id="hrhi_tag_type"
        :editable="true"
      ></ifbp-template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="tagTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveType">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="tagTitle" v-model="tagVisible" size="small">
      <div id="tagcreateform">
        <ifbp-template
          style="margin-top: 0px;"
          ref="tagRef"
          tpl-id="hrhi_tag_form"
          :tplResetFun="formResetFun"
          :methods="formMethods"
          :editable="true"
          @after-create="tagTplCreate"
        ></ifbp-template>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="tagVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTag">确 定</el-button>
      </span>
    </el-dialog>
    <power ref="powerRef" @confirm="powerDialogConfirm"></power>
  </ifbp-page>
</template>
<script>
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";
import MdLayout from 'ifbp-business/mdlayout';
import MdPage from 'ifbp-business/mdpage';
import MdChildPage from 'ifbp-business/mdchildpage';
import power from './power.vue';
//    import tagDis from '../../../../../common/component/psn-tag-dis.vue';
import dragDialog from '../../../../../common/component/dragdialog.vue';
let hrOrgCascader = require('i_hr/hrpub^/src/apps/common/navigation/hr-org-cascader.vue')["default"];

export default {
  mixins: [pageModelMixin],
  components: {
     "hr-org-cascader": hrOrgCascader,
    "md-layout": MdLayout,
    "md-page": MdPage,
    "md-child-page": MdChildPage,
    "power": power,
    //            "tag-dis": tagDis,
    "drag-dialog": dragDialog,
  },
  data() {
    var vm = this;
    return {
      tableOperVif: true,
      toggleLeftflag: true,
      asideWidth: 320,//左侧分屏宽度
      orgTreeData: [],
      pk_org: '',
      selectedTreeNode: [],
      //标签类型
      pk_hi_tagtype: '',
      //列表中数据
      tableListData: [],
      //标签类型列表
      tagTypeList: [],
      tagTypeName: '',
      tagTypeSaveMode: 0, //标签类型维护模式：1 update  2 new
      tagSaveMode: 0, //标签维护模式：1 update  2 new

      tagTypeTitle: '',
      tagTitle: '',

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      searchTemplate: {},

      tagTypeVisible: false,
      tagVisible: false,

      tagTplLoaded: false,
      tagTypeTplLoaded: false,

      editTagVO: {},
      editTagTypeVO: {},

      //使用权限
      userPks: [],
      rolePks: [],
      powerNames: "",

      leftSideArrindex: -1,

      clickidx: -1,
      topClass: ['topClass'],//详情背景色

      tableData: {
      },


      mdpagerightshow: '',//右侧内容区显示隐藏
      disStop: false,//显示停用

      tagTypeOrderVisible: false,
      tagTypeOrderList: [],

      tagOrderVisible: false,
      tagOrderList: [],
      isGroupUser: false,

      tableResetFun: function ($node) {
        let $table = this.getTableDom($node);
        debugger;
        var $scopecol = $table.find("[prop='scope']");
        $scopecol.attr('render-type', 'default');
        $scopecol.html(
          '<template scope="scope">' +
          '<a href="javascript: void(0);" @click="setPower(scope.row)" v-if="scope.row.scope==2">{{getScopeTxt(scope.row.scope)}}</a>' +
          '<span v-if="scope.row.scope!=2">{{getScopeTxt(scope.row.scope)}}</span>' +
          '</template>'
        );

        let $enablestate = $table.find("[prop='enablestate']");
        $enablestate.attr('render-type', 'default');
        $enablestate.html(
          '<template scope="scope" >' +
          '<el-switch @change="handleChange(scope.row)" v-model="scope.row.enablestate"  on-color="#4BD762" off-color="#AFAFAF" :on-value="true" :off-value="false" on-text="是" off-text="否"></el-switch>' +
          '</template>'
        );

        let operateHtml = this.getBaseTableOperateHtml();
        $table.append(operateHtml);

        let $form = this.getFormDom($node);
        var $powerstrFormItem = $form.find('[prop="powerstr"]');
        $powerstrFormItem.attr("v-if", "hi_tag.scope==2");
        $powerstrFormItem.attr(":required", "hi_tag.scope==2");

        //                    var $enablestateItem = $form.find('[v-model="hi_tag.enablestate"]');
        //                    $enablestateItem.attr("on-color", "#4BD762");
        //                    $enablestateItem.attr("off-color", "#AFAFAF");
        //                    $enablestateItem.attr("on-text", "是");
        //                    $enablestateItem.attr("off-text", "否");
        //
        //                    var $selfshowItem = $form.find('[v-model="hi_tag.selfshow"]');
        //                    $selfshowItem.attr("on-color", "#4BD762");
        //                    $selfshowItem.attr("off-color", "#AFAFAF");
        //                    $selfshowItem.attr("on-text", "是");
        //                    $selfshowItem.attr("off-text", "否");
        //
        //                    var $mobileflagItem = $form.find('[v-model="hi_tag.mobileflag"]');
        //                    $mobileflagItem.attr("on-color", "#4BD762");
        //                    $mobileflagItem.attr("off-color", "#AFAFAF");
        //                    $mobileflagItem.attr("on-text", "是");
        //                    $mobileflagItem.attr("off-text", "否");



        return $node[0].outerHTML;
      },
      tableMethods: {
        setPower(row) {
          vm.powerDirectClick(row);
        },
        powerClick() {
          debugger;
          vm.powerClick(this.hi_tag);
        },
        getScopeTxt(scope) {
          for (var i = 0; i < this.scopevar.length; i++) {
            if (this.scopevar[i].value == scope) {
              return this.scopevar[i].label;
            }
          }
        },
        handleChange(rowData) {
          this.$http({
            url: "/hrhi/tag/enableTag",
            method: "post",
            data: rowData,
          }).then((res) => {
            if (res.data.status === true) {
              //需要将返回的值赋值给页面，否则页面没反应
              rowData.enablestate = res.data.data.enablestate;
              //ts若不重新赋值给前台界面，界面不能再次修改。
              rowData.ts = res.data.data.ts;
              this.$message({ message: res.data.msg, type: "success" });
            } else {
              rowData.enablestate = (rowData.enablestate ? false : true);
              this.$message({ message: res.data.msg, type: "error" });
            }
          }).catch(() => {
            rowData.enablestate = (rowData.enablestate ? false : true);
            this.$message({ message: "操作失败", type: "error" });
          });
        }
      },

      formResetFun: function ($node) {
        var $enablestate = $node.find('[v-model="hi_tag.enablestate"]');
        $enablestate.attr("on-color", "#4BD762");
        $enablestate.attr("off-color", "#AFAFAF");
        $enablestate.attr("on-text", "是");
        $enablestate.attr("off-text", "否");

        var $selfshow = $node.find('[v-model="hi_tag.selfshow"]');
        $selfshow.attr("on-color", "#4BD762");
        $selfshow.attr("off-color", "#AFAFAF");
        $selfshow.attr("on-text", "是");
        $selfshow.attr("off-text", "否");

        var $mobileflag = $node.find('[v-model="hi_tag.mobileflag"]');
        $mobileflag.attr("on-color", "#4BD762");
        $mobileflag.attr("off-color", "#AFAFAF");
        $mobileflag.attr("on-text", "是");
        $mobileflag.attr("off-text", "否");

        return $node[0].outerHTML;
      },
      formMethods: {
        powerClick() {
          vm.powerClick(this.hi_tag);
        },
      },
      isEdit: false,
    };
  },
  mounted() {
//    this.getOrgTreeData();
    this.hasGroupPower();
    this.searchTagType(0);
  },
  created() {
  },
  methods: {
      orgChange(val){
          this.pk_org = val;
      },
    tagListTplCreate() {
      //              this.tableOperVif = true;
    },
    updateEditable(val) {
      this.isEdit = val;
    },
    // form的保存操作
    tableFormConfirm() {
      this.saveTag();
    },

    tableFormCloseExpandRow: function (type) {
      if (type === 'form') {
        this.$refs.tagListRef.resetFormData();
        this.$refs.tagListRef.formShow = false;
      }
    },
    // form的取消操作
    tableFormCancel(type) {
      this.isEdit = false;
      if (type === 'form') {
        //                    this.$refs.tagListRef.resetFormData();
        this.$refs.tagListRef.formShow = false;
      }
    },
    //点开里面编辑按钮
    tableFormEdit: function (type, row) {
      this.tagSaveMode = 1;
      this.isEdit = true;
      if (row.scope == 2) {
        if (row.userPks) {
          this.userPks = JSON.parse(JSON.stringify(row.userPks));
        }
        if (row.rolePks) {
          this.rolePks = JSON.parse(JSON.stringify(row.rolePks));
        }
        this.powerNames = row.powerstr;
      } else {
        this.userPks = [];
        this.rolePks = [];
        this.powerNames = "";
      }
    },
    // table行的编辑操作
    tableFormEditClick(scope) {
      this.tagSaveMode = 1;
      this.isEdit = true;
      this.$refs.tagListRef.expandRow(scope.row, scope.$index);
      if (scope.row.scope == 2) {
        if (scope.row.userPks) {
          this.userPks = JSON.parse(JSON.stringify(scope.row.userPks));
        }
        if (scope.row.rolePks) {
          this.rolePks = JSON.parse(JSON.stringify(scope.row.rolePks));
        }
        this.powerNames = scope.row.powerstr;
      } else {
        this.userPks = [];
        this.rolePks = [];
        this.powerNames = "";
      }
    },
    // tableForm展开方法（样式修改，数据备份）
    tableFormExpandRow: function (data, index) {
      this.$refs.tagListRef.expandRow(data, index);
      this.$refs.tagListRef.getTableComp().expandRow(data);
      this.$refs.tagListRef.setFormData(data);
      this.$refs.tagListRef.formShow = false;
    },
    // 行展开
    expandChange: function (row, expanded) {
      debugger;
      this.tableOperVif = !expanded;
    },

    showMastList() {//左侧点击出发事件
      this.toggleLeftflag = true;
    },
    //取得所有的标签类型
    hasGroupPower() {
      var url =
        "/hrhi/tag/hasGroupPower";
      this.$http({
        url: url,
        method: "post",
      })
        .then((res) => {
          if (res.data.status === true) {
            this.isGroupUser = res.data.data;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },
    orderType() {
      var orderData = new Array();
      for (var i = 0; i < this.tagTypeList.length; i++) {
        orderData.push({
          id: this.tagTypeList[i].pk_hi_tagtype,
          name: this.tagTypeList[i].name,
        });
      }
      this.tagTypeOrderList = orderData;
      this.tagTypeOrderVisible = true;
    },
    orderTag() {
      var url =
        "/hrhi/tag/orderTagData";
      this.$http({
        url: url,
        method: "post",
        params: {
          pk_hi_tagtype: this.pk_hi_tagtype,
          pk_org: this.pk_org,
          disstop: this.disStop,
        }
      })
        .then((res) => {
          if (res.data.status === true) {
            this.tagOrderList = res.data.data;
            this.tagOrderVisible = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },

    saveTagTypeOrder(data) {
      var url = "/hrhi/tag/saveTagTypeOrder";
      this.$http({
        url: url,
        method: "post",
        data: {
          orderData: data,
        }
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.tagTypeOrderVisible = false;
            this.searchTagType(0);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "排序更新失败！",
            type: "error"
          });
        });
    },
    saveTagOrder(data) {
      var url = "/hrhi/tag/saveTagOrder";
      this.$http({
        url: url,
        method: "post",
        data: {
          orderData: data,
        }
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.tagOrderVisible = false;
            this.request();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "排序更新失败！",
            type: "error"
          });
        });

    },
    disStopChg() {
      this.request();
    },
    tagTplCreate() {
      if (this.tagTplLoaded) {
        return;
      }
      this.tagTplLoaded = true;
      if (this.tagSaveMode == 2) {
        var tagVO = this.$refs.tagRef.getFormData();
        tagVO.enablestate = true;
        tagVO.pk_org = this.pk_org;
        tagVO.powerstr = this.powerNames;
        this.$refs.tagRef.setFormData(JSON.parse(JSON.stringify(tagVO)));
      } else {
        this.$refs.tagRef.setFormData(JSON.parse(JSON.stringify(this.editTagVO)));
      }
    },
    powerDialogConfirm(userpks, rolepks, names, directUpd) {
      this.userPks = userpks;
      this.rolePks = rolepks;
      this.powerNames = names;
      if (directUpd) {
        this.saveUsePower();
      } else {
        if (this.tagSaveMode == 2) {
          var formData = this.$refs.tagRef.getFormData();
          formData.powerstr = names;
          this.$refs.tagRef.setFormData(formData);
          this.$forceUpdate();
        } else {
          var formData = this.$refs.tagListRef.getFormData();
          formData.powerstr = names;
          //                        this.$refs.tagListRef.setFormData(formData);
          //                        this.$forceUpdate();
        }
      }
    },

    //保存标签
    saveUsePower() {
      var url = "/hrhi/tag/updUsePowerData";
      this.$http({
        url: url,
        method: "post",
        params: {
          pk_hi_tag: this.editTagVO.pk_hi_tag,
          pk_org: this.editTagVO.pk_org,
        },
        data: {
          users: this.userPks,
          roles: this.rolePks,
        }
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
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
            message: "权限更新失败！",
            type: "error"
          });
        });
    },

    powerDirectClick(row) {
      this.editTagVO = row;
      this.$refs.powerRef.showDirectDialog(row.pk_org, row.pk_hi_tag);
    },
    powerClick(row) {
      debugger;
      this.$refs.powerRef.showDialog(row.pk_org, row.pk_hi_tag, this.userPks, this.rolePks);
    },
    // 切换左侧边栏
    toggleLeft() {
      this.toggleLeftflag = false;
      this.$refs.mdLayout.toggleLeft();
    },
//    getOrgTreeData() {
//      this.$http({
//        url: '/hrhi/tag/getOrgTreeData',
//        method: "post",
//        params: '',
//      }).then((res) => {
//        if (res.data.success) {
//          this.orgTreeData = res.data.data.orgtreedata;
//          let defaultnode = res.data.data.defaultorgpk;
//          this.pk_org = defaultnode[defaultnode.length - 1];
//          this.selectedTreeNode = defaultnode;
//          this.request();
//        } else if (res.data.error && res.data.error.errorMessage) {
//          this.$message({
//            message: '树获取失败: ' + res.data.error.errorMessage,
//            type: 'error'
//          });
//        }
//      }).catch((e) => {
//        this.$message.error('请求出错');
//      });
//    },
    handleTreeChange() {
          if(this.pk_org){
              this.request();
          }
//      if (Array.isArray(treeItem) && treeItem.length) {
//        let pk_org = treeItem[treeItem.length - 1];
//        this.pk_org = pk_org;
//        this.request();
//      } else {
//      }
    },
    selTypeByIdx() {
      if (!this.tagTypeList || this.tagTypeList.length == 0) {
        this.leftSideArrindex = -1;
        this.pk_hi_tagtype = "";
        this.clickidx = -1;
        this.mdpagerightshow = '';
        this.tagTypeName = "";
        return;
      }
      if (this.clickidx < 0 || this.clickidx >= this.tagTypeList.length) this.clickidx = 0;
      this.leftSideArrindex = this.clickidx;
      this.pk_hi_tagtype = this.tagTypeList[this.clickidx].pk_hi_tagtype;
      this.clickidx = this.clickidx;
      this.mdpagerightshow = '';
      this.tagTypeName = this.tagTypeList[this.clickidx].name;
      this.request();
    },
    //取得所有的标签类型
    searchTagType(selIdx) {
      var url =
        "/hrhi/tag/tagTypeList";
      this.$http({
        url: url,
        method: "post",
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$nextTick(() => {
              this.tagTypeList = res.data.data;
              if (selIdx == null && this.clickidx >= this.tagTypeList.length) {
                this.clickidx = 0;
              } else if (selIdx == -1) {
                this.clickidx = this.tagTypeList.length - 1;
              } else if (selIdx == 0) {
                this.clickidx = 0;
              }
              this.selTypeByIdx();
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },
    handleClickItem(item, index) {
      this.leftSideArrindex = index;
      this.pk_hi_tagtype = item.pk_hi_tagtype;
      this.clickidx = index;
      this.mdpagerightshow = '';
      this.tagTypeName = item.name;
      this.request();
    },
    request(n, s) {// 请求数据
      if (!this.pk_hi_tagtype) {
        this.tableListData = [];
        return;
      }
      var pn = n || 1;
      var ps = s || 10;

      var url =
        "/hrhi/tag/pageList";
      this.$http({
        url: url,
        method: "post",
        params: {
          pn: pn,
          ps: ps,
          pk_hi_tagtype: this.pk_hi_tagtype,
          pk_org: this.pk_org,
          disstop: this.disStop,
        },
        data: {}//后期加模板用的
      })
        .then((res) => {
          if (res.data.status === true) {
            this.tableListData = res.data.data.content;
            this.tableListData = this.tableListData || [];
            this.$refs.tagListRef.setTableData(this.tableListData);
            this.totalElements = res.data.data.totalElements;
            this.size = res.data.data.size;
            this.currentPage = res.data.data.number;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },
    // 查询区点击搜索后的处理
    advancedSearch(searchTemplate) {
      this.searchTemplate = searchTemplate;
      this.request();
    },

    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.request(1, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.request(val, this.size);
    },
    addType() {
      //新增模式
      this.tagTypeSaveMode = 2;
      this.tagTypeTitle = "新增标签类型";
      var tagTypeVO = {};
      tagTypeVO.enablestate = true;
      this.tagTypeVisible = true;
      this.$nextTick(function () {
        this.$refs.tagTypeRef.setFormData(tagTypeVO);
      });
    },
    editType(typeRow) {
      //编辑模式
      this.tagTypeSaveMode = 1;
      this.tagTypeTitle = "维护标签类型";
      this.tagTypeVisible = true;
      this.$nextTick(function () {
        this.$refs.tagTypeRef.setFormData(typeRow);
      });
    },
    saveType() {
      this.$refs.tagTypeRef.validate((valid) => {
        if (valid) {
          this.realSaveType();
        }
      });
    },
    realSaveType() {
      var tagTypeVO = this.$refs.tagTypeRef.getFormData();
      var url = "/hrhi/tag/";
      if (this.tagTypeSaveMode == 2) {
        url += "insertType";
      } else {
        url += "updateType";
      }

      this.$http({
        url: url,
        method: "post",
        data: tagTypeVO //后期加模板用的
      })
        .then((res) => {
          if (res.data.status === true) {
            this.tagTypeVisible = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            if (this.tagTypeSaveMode == 2) {
              this.searchTagType(-1);
            } else {
              this.searchTagType();
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "保存失败！",
            type: "error"
          });
        });
    },

    //删除标签类型
    delType(typeRow) {
      var url = "/hrhi/tag/deleteType";
      this.$http({
        url: url,
        method: "post",
        data: typeRow
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });

            this.searchTagType();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "删除失败！",
            type: "error"
          });
        });
    },

    //创建标签
    addTag() {
      //新增模式
      this.tagSaveMode = 2;
      this.tagTitle = "创建标签";
      this.userPks = [];
      this.rolePks = [];
      this.powerNames = "";
      this.tagVisible = true;
      if (this.tagTplLoaded) {
        this.$nextTick(function () {
          this.$refs.tagRef.resetFormData();
          var tagVO = this.$refs.tagRef.getFormData();
          tagVO.enablestate = true;
          tagVO.pk_org = this.pk_org;
          tagVO.powerstr = this.powerNames;
          this.$refs.tagRef.setFormData(tagVO);
        });
      }
    },

    //编辑标签
    editTag(scope) {
      //编辑模式
      this.tagSaveMode = 1;
      this.tagTitle = "维护标签";
      if (scope.row.scope != 2) {
        this.tagVisible = true;
        this.userPks = [];
        this.rolePks = [];
        this.powerNames = "";
        scope.row.powerstr = this.powerNames;
        if (!this.tagTplLoaded) {
          this.editTagVO = scope.row;
        } else {
          this.$refs.tagRef.setFormData(JSON.parse(JSON.stringify(scope.row)));
        }
        return;
      }
      var url = "/hrhi/tag/usePowerData";
      this.$http({
        url: url,
        method: "post",
        params: {
          pk_hi_tag: scope.row.pk_hi_tag,
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.tagVisible = true;
            this.userPks = res.data.userpks;
            this.rolePks = res.data.rolepks;
            this.powerNames = res.data.names;
            if (!this.powerNames) {
              this.powerNames = "";
            }
            scope.row.powerstr = this.powerNames;
            if (!this.tagTplLoaded) {
              this.editTagVO = scope.row;
            } else {
              this.$refs.tagRef.setFormData(JSON.parse(JSON.stringify(scope.row)));
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "查询数据失败！",
            type: "error"
          });
        });
    },

    saveTag() {
      if (this.tagSaveMode == 2) {
        this.$refs.tagRef.validate((valid) => {
          if (valid) {
            this.realSaveTag();
          }
        });
      } else {
        this.$refs.tagListRef.validate((valid) => {
          if (valid) {
            this.realSaveTag();
          }
        });
      }
    },

    //保存标签
    realSaveTag() {
      var tagVO = null;
      var url = "/hrhi/tag/";
      if (this.tagSaveMode == 2) {
        url += "insertTag";
        tagVO = this.$refs.tagRef.getFormData();
      } else {
        url += "updateTag";
        tagVO = this.$refs.tagListRef.getFormData();
      }
      if (tagVO.scope != 2) {
        this.userPks = [];
        this.rolePks = [];
      }
      this.$http({
        url: url,
        method: "post",
        params: {
          pk_hi_tagtype: this.pk_hi_tagtype,
          pk_org: this.pk_org,
        },
        data: {
          tag: tagVO,
          users: this.userPks,
          roles: this.rolePks,
        }
      })
        .then((res) => {
          if (res.data.status === true) {
            this.tagVisible = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.request();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "保存失败！",
            type: "error"
          });
        });
    },

    formDeleteTag(type, row) {
      var url = "/hrhi/tag/deleteTag";
      this.$http({
        url: url,
        method: "post",
        data: row
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });

            this.request();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "删除失败！",
            type: "error"
          });
        });
    },
    deleteTag(scope) {
      var url = "/hrhi/tag/deleteTag";
      this.$http({
        url: url,
        method: "post",
        data: scope.row
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });

            this.request();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "删除失败！",
            type: "error"
          });
        });
    },
    showHeaderSettingcheck() {
      this.$refs.tagListRef.setTransferVisible(true);
    },

    logSth(msg) {
      console.log(msg);
    },
  }
}
</script>
<style>
/* 左侧样式 */
#hitagmgr .aside-item {
  list-style: none;
  height: 50px;
  position: relative;
  padding: 16px;
  border-bottom: 1px solid #e6e6eb;
  cursor: pointer;
  box-sizing: border-box;
}

#hitagmgr .aside-itembackground {
  background: rgba(90, 200, 250, 0.1);
}

#hitagmgr .icon {
  color: #fff;
}

#hitagmgr .aside-item-info {
  width: 100%;
  font-size: 18px;
  /*color: #2D2D2D;*/
  color: #000;
  letter-spacing: 0;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  /*display: -webkit-box;*/
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

#hitagmgr .aside-item:hover .icon,
#hitagmgr .aside-itembackground .icon {
  color: #5cb0e6;
}

#hitagmgr .aside-item:hover {
  background: rgba(90, 200, 250, 0.1);
}

#hitagmgr .footer-icon {
  margin-left: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
}
#hitagmgr .tagTypeName {
  width: 60%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  /*color: #5CB0E6;*/
  color: #000;
  margin-top: 2px;
}
#hitagmgr .topClass .mdlayout-page-header {
  background: rgba(90, 200, 250, 0.1);
}
/*#tagcreateform form>div{*/
/*padding-left:0px !important;*/
/*}*/

/*#hitagmgr.ifbp-main {*/
/*padding-top: 0px;*/
/*}*/
</style>
