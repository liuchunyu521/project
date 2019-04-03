<!--
  作者：yangchd
  时间：2018-05-15
  支持：基础设置——个人信息审核
-->
<template>
  <ifbp-page>
    <!--面包屑-->
    <ifbp-breadcrumb name="信息审核规则"></ifbp-breadcrumb>

    <!-- 主体区域 -->
    <ifbp-main-area type="list" id="psnclrule-el-tree">

      <div v-if="psnclTree.length==0">
        <div style="margin-left: 50%;margin-top: 20%;padding-bottom: 10%;">
          <div><i style="font-size: 100px;color: #F0F0F5;" class="ifbp-icon-multi-file"></i></div>
          <div style="margin-left: -40px;">请增加人员类别数据后查看</div>
        </div>
      </div>

      <div v-else="psnclTree.length>0">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-tree :data="psnclTree"
                     :highlight-current="true"
                     :node-key="nodeKey"
                     :props="defaultProps"
                     @current-change="handleNodeClick">
            </el-tree>
          </el-col>
          <el-col :span="20">
            <el-table :data="psnclruleTable" :table-tree="true" height="600">
              <el-table-column prop="infoname" label="名称" width="300px" style="cursor:pointer;"></el-table-column>
              <el-table-column label="需要审核">
                <template scope="scope">
                  <el-switch @change="switchFun(scope.row)" v-model="scope.row.checkFlag"
                             :disabled="scope.row.disabled"
                             on-text="是" off-text="否" on-color="#4BD762" off-color="#AFAFAF">
                  </el-switch>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>
  export default {
    data() {
      return {
        // 功能编码
        funcode: "funcode=6001012",
        requestPrefix: "/hrpub/psnclrule",
        requestUrl: {
          getTree: "/getTree",
          getPsnclrule: "/getPsnclrule",
          save: "/save"
        },
        // 左侧人员类别树
        psnclTree: [],

        // 当前打开的人员类别
        pk_psncl: "",

        // 人员类别树加载规则
        defaultProps: {
          id: "pk_psncl",
          pid: "parent_id",
          label: "name",
          children: "children"
        },

        // 右侧表格数据
        psnclruleTable: [],

        nodeKey: "pk_psncl",
      };
    },

    created() {
      this.requestPsncl();
    },

    methods: {
      // 初始化人员类别树
      requestPsncl: function () {
        this.$http({
          url: this.requestPrefix + this.requestUrl.getTree,
          method: "get"
        }).then(res => {
          if (res.data.status === true) {
            this.psnclTree = res.data.data;
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.psnclTree = [];
          this.$message({message: "请求失败!", type: "error"});
        });
      },

      // 根据人员类别获取审核设置信息
      requestPsnclrule: function () {
        this.$http({
          url: this.requestPrefix + this.requestUrl.getPsnclrule + "?pk_psncl=" + this.pk_psncl,
          method: "get"
        }).then(res => {
          if (res.data.status === true) {
            this.psnclruleTable = res.data.data;
            // 修改下样式
            this.$nextTick(function () {
              $($("td[class^='el-table_1_column']")[0]).attr('style', 'cursor:pointer;');
            });
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "请求失败!", type: "error"});
        });
      },

      // 左侧树点击时候取节点数据；
      handleNodeClick(data) {
        // 排除父节点，只请求子节点数据
        if (!data.children || data.children.length <= 0) {
          this.pk_psncl = data.data.pk_psncl;
          this.requestPsnclrule();
        }else {
          // by yangchd 不是选择叶子节点时，清空右侧数据
          this.pk_psncl = '';
          this.psnclruleTable = [];
        }
      },

      switchFun(clickData) {
        let data = {
          infopk: clickData.infopk,
          checkFlag: clickData.checkFlag,
          pk_psncl: this.pk_psncl
        };
        this.$http({
          url: this.requestPrefix + this.requestUrl.save,
          method: "post",
          data: data
        }).then(res => {
          if (res.data.status === true) {
            this.changeStatus(clickData);
            this.$message({message: "操作成功！", type: "success"});
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({message: "请求失败!", type: "error"});
        });
      },

      // 改变审核状态
      changeStatus: function (res) {
        // 以下代码在点击按钮是否需要审核成功后使用
        if (res.infotype === 1) {
          // 处理一级全选操作
          for (let i = 0; i < this.psnclruleTable.length; i++) {
            if (
                res.infopk === this.psnclruleTable[i].infopk &&
                this.psnclruleTable[i].children
            ) {
              if (res.checkFlag) {
                for (let j = 0; j < this.psnclruleTable[i].children.length; j++) {
                  this.psnclruleTable[i].children[j].checkFlag = true;
                }
              } else {
                for (let j = 0; j < this.psnclruleTable[i].children.length; j++) {
                  this.psnclruleTable[i].children[j].checkFlag = false;
                }
              }
            }
          }
        }

        // 处理子级控制一级全选情况
        if (res.infotype === 2) {
          for (let i = 0; i < this.psnclruleTable.length; i++) {
            if (this.psnclruleTable[i].children) {
              // 由于只有一个人员基本信息有children，所以这里的判断简单化
              let flag = true;
              for (let j = 0; j < this.psnclruleTable[i].children.length; j++) {
                if (this.psnclruleTable[i].children[j].checkFlag === false) {
                  flag = false;
                  break;
                }
              }
              this.psnclruleTable[i].checkFlag = flag;
            }
          }
        }
      },

      // 获取默认展开
      getDefaultKeysByData: function (data) {
        let expand = [];
        if (data && data.length > 0) {
          let first = data[0];
          expand.push(first[this.defaultProps.id]);
          return expand;
        } else {
          return expand;
        }
      }
    }
  };
</script>

<style>
  #psnclrule-el-tree .el-tree {
    overflow-y: auto;
    height: 600px !important;
  }
</style>
