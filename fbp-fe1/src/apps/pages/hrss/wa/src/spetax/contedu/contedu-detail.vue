<!--
	作者：wangruie
	时间：2018-11-30
	支持：自助 继续教育
-->
<template>
    <ifbp-page>
        <ifbp-breadcrumb name="继续教育" v-show="false"></ifbp-breadcrumb>
       
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
                <initiateFlow ref="initfolwRef" class="fl" :billId="pk_contedu_h" billType="TAX2"
                            :showBtn='true' @isRecall="getIsRecall" agentuserId="" ></initiateFlow>
          </ifbp-panel>


            <ifbp-button-area :no-breadcrumb="true"></ifbp-button-area>

            <!-- 主表编辑页签 -->
            <ifbp-panel id="basePanel"  class="titleLine">
                <ifbp-template ref="ref_contedu_h"
                            :tpl-id="templateheadcode"
                            :editable="false"
                            :tpl-data="conteduHData"
                            :tplResetFun="conteduHResetFun"
                            :methods="conteduHFormMethods"
                >
                </ifbp-template>
            </ifbp-panel> 

            <!-- 子表编辑页签 :pkTemp="subTemplate"
                                   show-type="table-form"-->
                <bodyEdu ref="bodyEdu"></bodyEdu>
                <bodyNationduty ref="bodyNationduty"></bodyNationduty>
        </ifbp-main-area>
    </ifbp-page> 
</template>

<script>
//引入流程图
import initiateFlow from 'ifbp-business/initiateFlow';
// 引入页面定制需要的方法
import pageModelMixin from "ifbp-business/pageModelMixin/index.js";

import bodyEdu from './body-edu.vue';
import bodyNationduty from './body-nationduty.vue';

export default {
  mixins: [pageModelMixin],
  components: {
    initiateFlow: initiateFlow,
    bodyEdu: bodyEdu,
    bodyNationduty: bodyNationduty
  },
  data() {
    return {
      isinitiateFlowShow: false,
      headEdit: true,
      allEditShow: false,
      submitShow: false,
      templateheadcode: 'contedu-head-card',
      subEdit: false,
      bodyEditBtnShow: false,
      mainBtns: [],
      pk_contedu_h: this.$root.$router.currentRoute.params['pk_contedu_h'],
      isDelbill: false,
      isCommitbill: false,
      editable: true,
      conteduHData: {},
      conteduHResetFun: function ($node) {

        return $node[0].outerHTML;
      },
      conteduHFormMethods: {

      },

     
      formMethods: {},
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
      //保存
      let head = this.$refs.ref_contedu_h.getFormData();
      let bodyedus = this.$refs.bodyEdu.getallBodys();
      let bodynationdutys = this.$refs.bodyNationduty.getallBodys();
      if (bodyedus == null && bodynationdutys == null) {
        return;
      }
      if (bodyedus.length <= 0 && bodynationdutys.length <= 0) {
        this.$message({
          message: "这张单据并没有数据！",
          type: "error"
        });
        return;
      }

      this.$refs.ref_contedu_h.validate(valid => {
        if (valid) {
          this.$http({
            url: "/hrwa/spetax/contedu/save",
            method: "post",
            data: {
              head: JSON.parse(JSON.stringify(head)),
              bodyedus: JSON.parse(JSON.stringify(bodyedus)),
              bodynationdutys: JSON.parse(JSON.stringify(bodynationdutys))
            }
          })
            .then(res => {

              if (res.data.status === true) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                head = res.data.data.head;
                bodyedus = res.data.data.bodyedus;
                bodynationdutys = res.data.data.bodynationdutys;

                this.$refs.ref_contedu_h.setFormData(JSON.parse(JSON.stringify(head)));
                this.$refs.ref_contedu_h.clearEdit();

                this.$refs.bodyEdu.setTableData(bodyedus);
                this.$refs.bodyNationduty.setTableData(bodynationdutys);

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

      this.$refs.bodyEdu.setBodybtnState(state)
      this.$refs.bodyNationduty.setBodybtnState(state)
    },
    delbill() {
      //删除
      let head = this.$refs.ref_contedu_h.getFormData();
      let bodyedus = this.$refs.bodyEdu.getallBodys();
      let bodynationdutys = this.$refs.bodyNationduty.getallBodys();


      this.$http({
        url: "/hrwa/spetax/contedu/delete",
        method: "post",
        data: {
          pk_contedu_h : head.pk_contedu_h
          // head: JSON.parse(JSON.stringify(head)),
          // bodyedus: JSON.parse(JSON.stringify(bodyedus)),
          // bodynationdutys: JSON.parse(JSON.stringify(bodynationdutys))
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
      //提交
      let head = this.$refs.ref_contedu_h.getFormData();
      let bodyedus = this.$refs.bodyEdu.getallBodys();
      let bodynationdutys = this.$refs.bodyNationduty.getallBodys();

      this.$http({
        url: "/hrwa/spetax/contedu/commit",
        method: "post",
        data: {
          pk_contedu_h : head.pk_contedu_h
          // head: JSON.parse(JSON.stringify(head)),
          // bodyedus: JSON.parse(JSON.stringify(bodyedus)),
          // bodynationdutys: JSON.parse(JSON.stringify(bodynationdutys))
        }
      }).then(res => {

        if (res.data.status === true) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });

          head = res.data.data.head;
          bodyedus = res.data.data.bodyedus;
          bodynationdutys = res.data.data.bodynationdutys;

          this.$refs.ref_contedu_h.setFormData(JSON.parse(JSON.stringify(head)));
          this.$refs.ref_contedu_h.clearEdit();
          this.pk_contedu_h = head.pk_contedu_h;

          this.$refs.bodyEdu.setTableData(bodyedus);
          this.$refs.bodyNationduty.setTableData(bodynationdutys);

          this.$refs.ref_contedu_h.clearEdit();

          this.pk_contedu_h = res.data.data.head.pk_contedu_h;
          this.request();
          // this.$router.push("/hrss/spetax/contedu/detail" + res.data.data.head.pk_contedu_h + "?funcode=60420spetax");
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

    getHeadData() {
      var url = '/hrwa/spetax/contedu/getPsnData';
      this.$http({
        url: url,
        method: "get",
        dataType: "json"
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$refs.ref_contedu_h.setFormData(res.data.data);

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
        url: "/hrwa/spetax/contedu/getById/" + this.pk_contedu_h,
        method: "get",
      })
        .then((res) => {
          if (res.data.status === true) {
            // this.$message({
            //   message: res.data.msg,
            //   type: "success"
            // });

            this.$refs.ref_contedu_h.setFormData(JSON.parse(JSON.stringify(res.data.data.head)));
            this.$refs.ref_contedu_h.clearEdit();

            this.$refs.bodyEdu.setTableData(res.data.data.bodyedus);
            this.$refs.bodyNationduty.setTableData(res.data.data.bodynationdutys);


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
    // 获取人员信息,设置表头
    if (this.pk_contedu_h) {
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