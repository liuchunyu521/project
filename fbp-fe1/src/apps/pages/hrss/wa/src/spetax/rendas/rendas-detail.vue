<!--
	作者：wangruie
	时间：2018-12-10
	支持：自助 住房租金
-->
<template>
    <ifbp-page>
        <ifbp-breadcrumb name="住房租金" v-show="false"></ifbp-breadcrumb>
       
        <!-- 按钮区域 -->
        <ifbp-footer >
        <!-- 根据页面定制控制的权限来显示对应的按钮 -->
        <!-- <el-button type="primary" v-for="item in mainBtns"  @click="triggerClick(item)" v-if="item.event" v-text="item.displayname"></el-button> -->
         <el-button type="primary" @click="delbill"  v-if="allEditShow">删除</el-button>
            <el-button type="primary" @click="savebill"  v-if="headEdit">保存</el-button>
            <el-button type="primary" @click="editbill"  v-if="allEditShow">编辑</el-button>
            <el-button type="primary" @click="commitbill"  v-if="submitShow">提交</el-button>
            <el-button type="primary" @click="print"  v-if="!headEdit">打印</el-button>
        </ifbp-footer>




        <ifbp-main-area type="detail">
        <ifbp-panel  v-if="isinitiateFlowShow">
                <initiateFlow ref="initfolwRef" class="fl" :billId="pk_rendas_h" billType="TAX5"
                            :showBtn='true' @isRecall="getIsRecall" agentuserId="" ></initiateFlow>
          </ifbp-panel>


            <ifbp-button-area :no-breadcrumb="true"></ifbp-button-area>

            <!-- 主表编辑页签 -->
            <ifbp-panel id="basePanel"  class="titleLine">
                <ifbp-template ref="ref_rendas_h"
                            :tpl-id="templateheadcode"
                            :editable="false"
                            :tpl-data="rendasHData"
                            :tplResetFun="rendasHResetFun"
                            :methods="rendasHFormMethods"
                >
                </ifbp-template>
            </ifbp-panel> 

            <!-- 子表编辑页签 :pkTemp="subTemplate"
                                   show-type="table-form"-->
                <ifbp-panel id="subPanel" title="赡养老人详情"  class="titleLine" :icons="addicons" >
                    <ifbp-template ref="ref_rendas_c"
                                   :tpl-id="templatebodycode"

                                   :tplData="rendasCardSubData"
                                   :tplResetFun="rendasCardResetFunc"
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
        </ifbp-main-area>
    </ifbp-page> 
</template>

<script>
//引入流程图
import initiateFlow from 'ifbp-business/initiateFlow';
// 引入页面定制需要的方法
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

export default {
  mixins: [pageModelMixin],
  components: {
    initiateFlow: initiateFlow
  },
  data() {
    return {
      isinitiateFlowShow: false,
      headEdit: true,
      allEditShow: false,
      submitShow: false,
      templateheadcode: 'rendas-head-card',
      templatebodycode: 'rendas-body-card',
      subEdit: false,
      bodyEditBtnShow: false,
      mainBtns: [],
      pk_rendas_h: this.$root.$router.currentRoute.params['pk_rendas_h'],
      isDelbill: false,
      isCommitbill: false,
      editable: true,
      rendasHData: {},
      subList: [],
      delList: [],
      addIconShow: true,
      addiconsValue: [{
        icon: 'plus',
        click: () => {
          // 关闭table中的编辑区
          debugger
          this.$refs.ref_rendas_c.getTableComp().closeExpandRow();
          this.subEdit = true;
          this.bodyEditBtnShow = false;
          this.$refs.ref_rendas_c.formShow = true;
          this.$refs.ref_rendas_c.resetFormData();
          this.addicons = [];
        },

      }],
      addicons: [],
      rendasHResetFun: function ($node) {

        return $node[0].outerHTML;
      },
      rendasHFormMethods: {

      },

      rendasCardSubData: {
        rendasParam: { pk_org: '', pk_rendas_b: '' },
        showOpeColumn: true,
        rules: {}
      },
      rendasCardResetFunc: function ($node) {

        var $population =  $node.find('[v-model="spetax_rendas_b.population"]');//分摊比例
        $population.attr('v-on:change', 'populationChange');

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
      formMethods: {
        // 人口规模变化时 金额自动带出
        populationChange(val){
          vm.$refs.ref_support_c.setFormDataByField('deduction','');
          if(val == '101'){
            vm.$refs.ref_support_c.setFormDataByField('deduction',1000);
          }else{
             vm.$refs.ref_support_c.setFormDataByField('deduction',800);
          }
        }
      },
    }

  },
  methods: {
    editbill() {
      //编辑
      this.setbtnState(false);
      this.headEdit = true;  //
      this.allEditShow = false;// 
      this.submitShow = false;//
    },
    savebill() {
      debugger
      //保存
      if (this.$refs.ref_rendas_c.formShow) {
        this.$message({
          message: "子表数据没有保存",
          type: "error"
        });
        return;
      }
      let head = this.$refs.ref_rendas_h.getFormData();
      let bodys = this.$refs.ref_rendas_c.getTableData();
      if (bodys.length <= 0) {
        this.$message({
          message: "这张单据并没有数据！",
          type: "error"
        });
        return;
      }

      let allBodys = bodys.concat(this.delList);

      this.$refs.ref_rendas_h.validate(valid => {
        if (valid) {
          this.$http({
            url: "/hrwa/spetax/rendas/save",
            method: "post",
            data: {
              head: JSON.parse(JSON.stringify(head)),
              bodys: JSON.parse(JSON.stringify(allBodys))
            }
          })
            .then(res => {

              if (res.data.status === true) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                head = res.data.data.head;
                bodys = res.data.data.bodys;

                this.$refs.ref_rendas_h.setFormData(JSON.parse(JSON.stringify(head)));
                this.$refs.ref_rendas_c.setTableData(JSON.parse(JSON.stringify(bodys)));

                this.subList = JSON.parse(JSON.stringify(bodys));
                this.delList = [];
                this.$refs.ref_rendas_h.clearEdit();
                this.$refs.ref_rendas_c.clearEdit();

                this.setbtnState(true);
                this.headEdit = false;  //
                this.allEditShow = true;// 
                this.submitShow = true;//


              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "保存失败",
                type: "error"
              });
            });
        }
      });
    },
    setbtnState(state) {
      //state为是否是浏览状态 true 是浏览状态   false是编辑状态
      this.$refs.ref_rendas_c.setData("showOpeColumn", !state);//子表编辑按钮
      this.subEdit = !state;//取消行点击
      this.addicons = this.addiconsValue;
      if (state) {
        this.addicons = [];
      }
    },
    delbill() {
      //删除
      debugger
      let head = this.$refs.ref_rendas_h.getFormData();
      let bodys = this.$refs.ref_rendas_c.getTableData();
      this.$http({
        url: "/hrwa/spetax/rendas/delete",
        method: "post",
        data: {
          pk_rendas_h: head.pk_rendas_h
          // head: JSON.parse(JSON.stringify(head)),
          // bodys: JSON.parse(JSON.stringify(bodys))
        }
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.$context.getApp().back(1);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "catc",
            type: "error"
          });
        });
    },
    commitbill() {
      debugger
      //提交
      let head = this.$refs.ref_rendas_h.getFormData();
      let bodys = this.$refs.ref_rendas_c.getTableData();
      this.$http({
        url: "/hrwa/spetax/rendas/commit",
        method: "post",
        data: {
          pk_rendas_h: head.pk_rendas_h
          // head: JSON.parse(JSON.stringify(head)),
          // bodys: JSON.parse(JSON.stringify(bodys))
        }
      }).then(res => {

        if (res.data.status === true) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });

          head = res.data.data.head;
          bodys = res.data.data.bodys;

          this.$refs.ref_rendas_h.setFormData(JSON.parse(JSON.stringify(head)));
          this.$refs.ref_rendas_c.setTableData(JSON.parse(JSON.stringify(bodys)));
          this.pk_rendas_h = bodys[0].pk_rendas_h; //设置主表主键


          this.subList = JSON.parse(JSON.stringify(bodys));
          this.delList = [];
          this.$refs.ref_rendas_h.clearEdit();
          this.$refs.ref_rendas_c.clearEdit();

          this.pk_rendas_h = res.data.data.head.pk_rendas_h;
          this.request();
          // this.$router.push("/hrss/spetax/rendas/detail" + res.data.data.head.pk_rendas_h + "?funcode=60420spetax");
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      }).catch(() => {
        this.$message({
          message: "提交失败",
          type: "error"
        });
      });
    },
    printbill() {
      //打印
      alert("打印")
    },
    getIsRecall(isrecall) {
      if (isrecall) {
        this.request();
        this.$refs.initfolwRef.doParams();
      }
    },
    confirm(type, row) {
      debugger
      this.$refs.ref_rendas_c.validate(valid => {
        if (valid) {
          let data = this.$refs.ref_rendas_c.getFormData();
          if (data.pk_rendas_b) {
            this.$refs.ref_rendas_c.setFormDataByField("status", 1);
          } else {
            this.$refs.ref_rendas_c.setFormDataByField("status", 2);
          }
          if (type == "form") {
            this.subList.push(data);
            this.$refs.ref_rendas_c.setTableData(this.subList);
          }
          //
          this.subList = this.$refs.ref_rendas_c.getTableData();
          this.$refs.ref_rendas_c.formShow = false;
          this.$refs.ref_rendas_c.getTableComp().closeExpandRow();
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

      let pk_rendas_b = row.pk_rendas_b;
      this.rendasParam(pk_rendas_b);

    },
    formDelete(type, row) {
      let index = this.subList.indexOf(row);
      let pk_rendas_b = row.pk_rendas_b;
      this.delete(pk_rendas_b, index, row);

    },
    delete(pk_rendas_b, index, delData) {

      this.$confirm('确认删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,

        type: 'warning'
      }).then(() => {

        if (pk_rendas_b) {//这一行的值已经做持久化了，最后要真的到数据库中删除
          delData.status = 3;
          this.delList.push(delData);
        }
        this.$refs.ref_rendas_c.formShow = false;
        this.$refs.ref_rendas_c.getTableComp().closeExpandRow();

        this.subList.splice(index, 1);
        this.$refs.ref_rendas_c.setTableData(this.subList);
        this.$refs.ref_rendas_c.clearEdit();
        //可能编辑后就删除了，下面是处理这种情况
        this.addicons = this.addiconsValue;
        this.subEdit = false;
      }).catch(() => {
        // 这里加取消逻辑
      });

    },
    tableDeleteClick(row, rowIndex) {
      let pk_rendas_b = row.row.pk_rendas_b;
      let index = row.$index;
      let delData = row.row;
      this.delete(pk_rendas_b, index, delData);
    },
    tableEditClick(row, rowIndex) {
      this.$refs.ref_rendas_c.expandRow(row.row, row.$index);

      this.subEdit = true;
      this.addicons = [];
      this.bodyEditBtnShow = false;

      let pk_rendas_b = row.row.pk_rendas_b;
      this.setwaGrdParam(pk_rendas_b);

    },
    setwaGrdParam(pk_rendas_b) {
      this.$refs.ref_rendas_c.getData("rendasParam").pk_rendas_b = pk_rendas_b;

    },
    getHeadData() {
      var url = '/hrwa/spetax/rendas/getPsnData';
      this.$http({
        url: url,
        method: "get",
        dataType: "json"
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$refs.ref_rendas_h.setFormData(res.data.data);

            this.setbtnState(false)

            this.headEdit = true;  //
            this.allEditShow = false;// 
            this.submitShow = false;//

          } else {
            this.noData = 1;
            if (!res.data.noData) {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          }
        })
        .catch((res) => {
          this.$message({
            message: "页面初始化失败",
            type: "error"
          });
        });
    },
    request() {
      debugger
      this.$http({
        url: "/hrwa/spetax/rendas/getById/" + this.pk_rendas_h,
        method: "get",
      })
        .then((res) => {
          if (res.data.status === true) {
            // this.$message({
            //   message: res.data.msg,
            //   type: "success"
            // });

            this.$refs.ref_rendas_h.setFormData(JSON.parse(JSON.stringify(res.data.data.head)));
            this.$refs.ref_rendas_c.setTableData(JSON.parse(JSON.stringify(res.data.data.bodys)));
            this.setbtnState(true)


            this.headEdit = false;  //
            //设置按钮显示
            if (res.data.data.head.billstate == -1) {

              this.allEditShow = true;// 
              this.submitShow = true;//
              this.isinitiateFlowShow = false;
            } else {


              this.allEditShow = false;// 
              this.submitShow = false;//
              this.isinitiateFlowShow = true;
            }

          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }

        })
        .catch(() => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },
  },
  mounted() {
    debugger
    // 获取人员信息,设置表头
    if (this.pk_rendas_h) {
      //修改
      this.request()
    } else {
      //新增
      this.getHeadData();
    }
  },
  created() {
    // 获取页面配置信息
    this.getPageModel(function (pageModel) {
      // 获取按钮
      this.mainBtns = pageModel.getButtons(this.templateheadcode);
    });
  }
};
</script>

<style>
</style>