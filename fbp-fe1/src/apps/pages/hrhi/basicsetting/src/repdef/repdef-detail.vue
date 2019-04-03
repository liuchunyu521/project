<!--
  作者：yangchd
  时间：2018-05-17
  支持：基础设置——人员花名册设计
-->
<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="花名册设计"></ifbp-breadcrumb>

    <ifbp-main-area type="list" id="roster_design">
      <!--上部步骤条-->
      <div class="roster_Setup">
        <el-steps :space="200" :active="active" finish-status="success">
          <el-step title="选择导出项" style="margin-left: 100px;"></el-step>
          <el-step title="选择排序项"></el-step>
        </el-steps>
      </div>
      <div class="roster_middle">
        <!--放入你查询的模版-->
        <div v-show="isTrueNext">
          <el-row>
            <el-col :span="11">
              <div class="roster-middle-title">全部</div>
              <div class="roster-middle-body">
                <div class="roster_select_tittle">
                    <span style="margin-left: 25px;">
                      <el-checkbox v-model="psnInfoAllCheck" @change="psnInfoCheckAll"></el-checkbox>
                    </span>
                  <span class="roster_select_tittle_left">人事信息</span>
                </div>
                <div class="roster-left-tree">
                  <el-tree :ref="psnInfoTree" :data="psnInfoData" :node-key="psnInfoNodeKey"
                           show-checkbox :check-strictly="false"
                           :default-checked-keys="defaultCheckKeys" :props="defaultProps"
                           @check-change="psnInfoCheckChange">
                  </el-tree>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <!--交换箭头-->
              <div style="text-align: center;line-height: 470px;">
                <i class="ifbp-icon-swap-horiz roster-ifbp-icon-middle"></i>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="roster-middle-title">已选择</div>
              <div class="roster-middle-body">
                <div class="roster_select_tittle">
                  <span class="roster_select_tittle_left">人事信息</span>
                  <span class="roster_select_tittle_right">操作</span>
                </div>
                <div class="roster-left-tree">
                  <div class="roster_select_list" v-for="(item,index) in psnInfoSelected">
                    <span class="roster_select_list_left">{{item.name}}</span>
                    <span v-show="index!='0'">
                    <i class="roster-ifbp-icon ifbp-icon-publish" @click="exportTop(item.pk_infoset_item)"></i>
                  </span>
                    <span v-show="index!='0'">
                    <i class="roster-ifbp-icon-small ifbp-icon-up" @click="exportUp(index)"></i>
                  </span>
                    <span v-show="index!=psnInfoSelected.length-1">
                    <i class="roster-ifbp-icon-small ifbp-icon-down" @click="exportDown(index)"></i>
                  </span>
                    <span v-show="index!=psnInfoSelected.length-1">
                    <i class="roster-ifbp-icon ifbp-icon-bottom" @click="exportBottom(item.pk_infoset_item)"></i>
                  </span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-show="!isTrueNext">
          <el-row>
            <el-col :span="11">
              <div class="roster-middle-title">全部</div>
              <div class="check-all-left-warp" style="border: 1px solid #ddd;height: 470px;position: relative;">
                <el-table :ref="selectedTable" :data="psnInfoSelected"
                          tooltip-effect="dark" style="width: 100%" height="470"
                          @selection-change="tableSelectedChange">
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column label="人事信息">
                    <template scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="2">
              <!--交换箭头-->
              <div style="text-align: center;line-height: 470px;">
                <i class="ifbp-icon-swap-horiz roster-ifbp-icon-middle"></i>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="roster-middle-title">已选择</div>
              <div class="roster-middle-body">
                <div class="roster_select_tittle">
                  <span class="roster_select_tittle_left" style="width: 200px;">人事信息</span>
                  <span class="roster_select_tittle_right" style="margin-right: 100px;">升降序</span>
                  <span class="roster_select_tittle_right">操作</span>
                </div>
                <div class="roster-left-tree">
                  <div class="roster_select_list" v-for="(item,index) in psnInfoSortSelected">
                    <span style="width: 200px;" class="roster_select_list_left">{{item.name}}</span>
                    <span v-if="item.is_asc === 'Y'">
                    <i class="roster-ifbp-icon-sc ifbp-icon-ascending" @click="ranking(item.pk_infoset_item)"></i>
                  </span>
                    <span v-else>
                    <i class="roster-ifbp-icon-sc ifbp-icon-descending" @click="ranking(item.pk_infoset_item)"></i>
                  </span>
                    <span v-show="index!='0'">
                    <i class="roster-ifbp-icon ifbp-icon-publish" @click="rankTop(item.pk_infoset_item)"></i>
                  </span>
                    <span v-show="index!='0'">
                    <i class="roster-ifbp-icon-small ifbp-icon-up" @click="rankUp(index)"></i>
                  </span>
                    <span v-show="index!=psnInfoSortSelected.length-1">
                    <i class="roster-ifbp-icon-small ifbp-icon-down" @click="rankDown(index)"></i>
                  </span>
                    <span v-show="index!=psnInfoSortSelected.length-1">
                    <i class="roster-ifbp-icon ifbp-icon-bottom" @click="rankBottom(item.pk_infoset_item)"></i>
                  </span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!--下部按钮-->
      <ifbp-footer>
        <el-button @click="repdefCancel">取消</el-button>
        <el-button @click="repdefPreStep" v-show="isTruePre">上一步</el-button>
        <el-button type="primary" @click="repdefNextStep" v-show="isTrueNext">下一步</el-button>
        <el-button type="primary" @click="repdefSubmit" v-show="isTrueSubmit">完成</el-button>
      </ifbp-footer>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>
  export default {
    data() {
      return {
        // 功能编码
        funcode:'funcode=60070repdef',
        requestPrefix:'/hrhi/repdef',
        requestUrl:{
          infoset:'/infoset/',
          design:'/design'
        },

        pk_rpt_def: this.$root.$router.currentRoute.params['id'],
        active: 1,
        isTrueNext: true,//显示下一步按钮
        isTruePre: false,//隐藏下一步按钮
        isTrueSubmit: false,//隐藏完成按钮

        //人事信息相关参数
        psnInfoTree: 'psnInfoTree',
        psnInfoAllCheck: false,

        //排序相关
        selectedTable: 'selectedTable',

        //所有可选择的信息集
        psnInfoData: [],
        //对应信息集的所有节点
        psnInfoLeftNodes: [],

        //默认选中的节点
        defaultCheckKeys: [],

        //已经选择的节点
        psnInfoSelected: [],

        //排序选中的节点
        psnInfoSortSelected: [],

        //这个属性类似于映射关系
        psnInfoNodeKey: 'pk_infoset_item',
        defaultProps: {
          id: 'pk_infoset_item',
          children: 'info_item',
          label: 'item_name'
        },

        //数据转换格式对应映射
        dataChangeProps: {
          pk_infoset: 'pk_infoset',
          pk_infoset_item: 'pk_infoset_item',
          code: 'item_code',
          name: 'item_name',
          data_type: 'data_type',
          showorder: 'showorder',
          meta_data: 'meta_data',
          table_code: '',
          sortorder: '',
          is_asc: '',
          is_display: '',
        },
        //最大的排序号
        startNum: 1,
        maxSortNumber: 99999,
      }
    },

    mounted() {
      this.repdefDesignInit();
    },

    methods: {
      //初始化数据
      repdefDesignInit: function () {
        this.$http({
          url: this.requestPrefix + this.requestUrl.infoset + this.pk_rpt_def,
          method: 'get',
        }).then((res) => {
          if (res.data.status === true) {
            this.psnInfoData = res.data.psnInfoData;
            this.psnInfoSelected = res.data.psnInfoSelected;
            this.defaultCheckKeys = res.data.defaultCheckKeys;
            //初始化以后，同步一下选择状态
            this.$nextTick(function () {
              this.getAllNodes();
              this.psnInfoCheckChange();
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        }).catch(() => {
          this.$message({
            message: '查询失败',
            type: 'error'
          });
        });
      },
      //获取当前所有的左节点
      getAllNodes: function () {
        this.psnInfoLeftNodes = [];
        for (let i = 0; i < this.psnInfoData.length; i++) {
          if (this.psnInfoData[i][this.defaultProps.children]) {
            for (let j = 0; j < this.psnInfoData[i][this.defaultProps.children].length; j++) {
              this.psnInfoLeftNodes.push(this.psnInfoData[i][this.defaultProps.children][j])
            }
          }
        }
      },
      //人事信息全选
      psnInfoCheckAll(){
        if (this.psnInfoAllCheck) {
          this.$confirm("数据较多时，全选可能导致浏览器卡死，是否继续", '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            closeOnClickModal: false,
            type: 'info'
          }).then(() => {
            this.$refs[this.psnInfoTree].setCheckedNodes(this.psnInfoData);
          }).catch(() => {
            this.psnInfoAllCheck = false;
          });
        } else {
          this.psnInfoSelected = [];
          this.$refs[this.psnInfoTree].setCheckedNodes([]);
        }
      },

      //获取所有的选中节点，保证已选择的顺序不变
      getAllSelectedNodes: function () {
        //获取被选中的字段
        let selectedData = this.$refs[this.psnInfoTree].getCheckedNodes();
        let _Data = [];
        for (let i = 0; i < selectedData.length; i++) {
          //两级目录，只有子集参与
          if (!selectedData[i][this.defaultProps.children]) {
            //将选中的节点转换格式
            let pushData = this.changeDataToPsnInfoSelected(selectedData[i]);
            _Data.push(pushData);
            if (!this.selectContains(this.psnInfoSelected, pushData)) {
              this.psnInfoSelected.push(pushData);
            }
          }
        }
        //去除多余项
        for (let j = 0; j < this.psnInfoSelected.length; j++) {
          if (!this.selectContains(_Data, this.psnInfoSelected[j])) {
            this.psnInfoSelected.splice(j--, 1);
          }
        }
        return this.psnInfoSelected;
      },
      //树的选择状态变化
      psnInfoCheckChange() {
        //获取被选中的字段
        let _Data = this.getAllSelectedNodes();
        this.psnInfoAllCheck = _Data.length > 0 && _Data.length === this.psnInfoLeftNodes.length;
      },


      //排序字段选择变化
      tableSelectedChange(val) {
        if (val) {
          //先剔除未选择的,剔除时排序设为最后
          for (let i = 0; i < this.psnInfoSortSelected.length; i++) {
            if (!this.selectContains(val, this.psnInfoSortSelected[i])) {
              this.psnInfoSortSelected[i].sortorder = null;
              this.psnInfoSortSelected[i].is_asc = null;
              this.psnInfoSortSelected.splice(i--, 1);
            }
          }
          //加入新选择的
          for (let y = 0; y < val.length; y++) {
            if (!this.selectContains(this.psnInfoSortSelected, val[y])) {
              this.psnInfoSortSelected.push(val[y]);
            }
          }
          //进行排序个排序序号从新记录
          this.reSortSelectedData();
        } else {
          this.psnInfoSortSelected = [];
        }
      },

      //下一步
      repdefNextStep() {
        this.active = 2;
        this.isTrueNext = false;//隐藏下一步按钮
        this.isTruePre = true;//显示上一步按钮
        this.isTrueSubmit = true;//显示完成按钮
        this.sortPsnInfoSelected();
        //设置默认勾选
        let checkLines = [];
        for (let i = 0; i < this.psnInfoSelected.length; i++) {
          if (this.psnInfoSelected[i].sortorder) {
            checkLines.push(this.psnInfoSelected[i]);
          }
        }
        if (checkLines) {
          checkLines.forEach(checkLine => {
            this.$refs[this.selectedTable].toggleRowSelection(checkLine, true);
          });
        } else {
          this.$refs[this.selectedTable].clearSelection();
        }
      },
      //上一步
      repdefPreStep(){
        this.active = 1;
        this.isTrueNext = true;//隐藏下一步按钮
        this.isTruePre = false;//隐藏上一步按钮
        this.isTrueSubmit = false;//显示完成按钮
        //返回时，将已选中的排序项进行更改
        this.mergeSortToData();
      },
      //完成
      repdefSubmit(){
        this.savePsnInfoData();
      },
      //取消
      repdefCancel(){
        this.$context.getApp().back();
//        this.$router.push("/hrhi/repdef"  + "?" + this.funcode);
      },

      //完成操作
      savePsnInfoData: function () {
        this.mergeSortToData();
        let data = {
          pk_rpt_def: this.pk_rpt_def,
          item: this.psnInfoSelected,
        };
        this.$http({
          url: this.requestPrefix + this.requestUrl.design,
          method: 'post',
          data: data,
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({message: res.data.msg, type: "success"});
            this.$context.getApp().back();
//            this.$router.push("/hrhi/repdef"  + "?" + this.funcode);
          } else {
            this.$message({message: res.data.msg, type: "error"});
          }
        }).catch(() => {
          this.$message({
            message: '保存失败',
            type: 'error'
          });
        });
      },

      //将排序项信息合并到显示项中
      mergeSortToData: function () {
        this.sortPsnInfoSelected();
        this.reMarkSortNumber();
      },

      //数据格式转换
      changeDataToPsnInfoSelected: function (data) {
        let selected = {};
        for (let key in this.dataChangeProps) {
          if (this.dataChangeProps.hasOwnProperty(key)) {
            if (this.dataChangeProps[key]) {
              selected[key] = data[this.dataChangeProps[key]]
            } else {
              selected[key] = null;
            }
          }
        }
        return selected;
      },

      //判断是否包含
      selectContains: function (arr, obj) {
        let i = arr.length;
        while (i--) {
          if (arr[i].pk_infoset_item === obj.pk_infoset_item) {
            return true;
          }
        }
        return false;
      },

      //导出项置顶
      exportTop(res){
        for (let i = 0; i < this.psnInfoSelected.length; i++) {
          if (res === this.psnInfoSelected[i].pk_infoset_item) {
            let str = this.psnInfoSelected.splice(i, 1);
            this.psnInfoSelected.unshift(str[0]);
          }
        }
        this.sortPsnInfoSelected();
      },
      //导出项置底
      exportBottom(res){
        for (let i = 0; i < this.psnInfoSelected.length; i++) {
          if (res === this.psnInfoSelected[i].pk_infoset_item) {
            let str = this.psnInfoSelected.splice(i, 1);
            this.psnInfoSelected.push(str[0]);
          }
        }
        this.sortPsnInfoSelected();
      },
      exportUp(res){
        this.psnInfoSelected[res] = this.psnInfoSelected.splice(res - 1, 1, this.psnInfoSelected[res])[0];
        this.sortPsnInfoSelected();
      },
      exportDown(res){
        this.psnInfoSelected[res] = this.psnInfoSelected.splice(res + 1, 1, this.psnInfoSelected[res])[0];
        this.sortPsnInfoSelected();
      },

      //升降排序
      ranking(res){
        for (let i = 0; i < this.psnInfoSortSelected.length; i++) {
          if (res === this.psnInfoSortSelected[i].pk_infoset_item) {
            if (this.psnInfoSortSelected[i].is_asc === 'Y') {
              this.psnInfoSortSelected[i].is_asc = 'N';
            } else {
              this.psnInfoSortSelected[i].is_asc = 'Y';
            }
            break;
          }
        }
      },
      //排序置顶
      rankTop(res){
        for (let i = 0; i < this.psnInfoSortSelected.length; i++) {
          if (res === this.psnInfoSortSelected[i].pk_infoset_item) {
            let str = this.psnInfoSortSelected.splice(i, 1);
            this.psnInfoSortSelected.unshift(str[0]);
          }
        }
        this.reMarkSortNumber();
      },
      //排序项置底
      rankBottom(res){
        for (let i = 0; i < this.psnInfoSortSelected.length; i++) {
          if (res === this.psnInfoSortSelected[i].pk_infoset_item) {
            let str = this.psnInfoSortSelected.splice(i, 1);
            this.psnInfoSortSelected.push(str[0]);
          }
        }
        this.reMarkSortNumber();
      },
      //排序项上移动
      rankUp(res){
        this.psnInfoSortSelected[res] = this.psnInfoSortSelected.splice(res - 1, 1, this.psnInfoSortSelected[res])[0];
        this.reMarkSortNumber();
      },
      //排序项下移动
      rankDown(res){
        this.psnInfoSortSelected[res] = this.psnInfoSortSelected.splice(res + 1, 1, this.psnInfoSortSelected[res])[0];
        this.reMarkSortNumber();
      },
      //对选项字段进行排序
      reSortSelectedData: function () {
        for (let m = 0; m < this.psnInfoSortSelected.length - 1; m++) {
          for (let n = 0; n < this.psnInfoSortSelected.length - 1 - m; n++) {
            if (!this.psnInfoSortSelected[n].sortorder) {
              this.psnInfoSortSelected[n].sortorder = this.maxSortNumber;
            }
            if (!this.psnInfoSortSelected[n + 1].sortorder) {
              this.psnInfoSortSelected[n + 1].sortorder = this.maxSortNumber;
            }
            if (this.psnInfoSortSelected[n].sortorder > this.psnInfoSortSelected[n + 1].sortorder) {
              //交换顺序
              let leftSelected = this.psnInfoSortSelected[n];
              this.psnInfoSortSelected[n] = this.psnInfoSortSelected[n + 1];
              this.psnInfoSortSelected[n + 1] = leftSelected;
            }
          }
        }
        this.reMarkSortNumber();
      },
      //对选择的显示项进行标号
      sortPsnInfoSelected: function () {
        this.$nextTick(() => {
          this.startNum = 1;
          for (let i = 0; i < this.psnInfoSelected.length; i++) {
            this.psnInfoSelected[i].showorder = this.startNum++;
          }
        })
      },
      //对选项字段进行重新标记
      reMarkSortNumber: function () {
        this.$nextTick(() => {
          this.startNum = 1;
          for (let i = 0; i < this.psnInfoSortSelected.length; i++) {
            this.psnInfoSortSelected[i].sortorder = this.startNum++;
          }
        })
      },
    },
  };
</script>

<style>
  #roster_design{
    margin-top: 0;
  }
  #roster_design .roster_Setup {
    /*line-height: 94px;*/
    background: #fff;
    text-align: center;
    padding-bottom:16px;
  }

  #roster_design .roster_middle {
    background: #fff;
  }

  #roster_design .roster-middle-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
  }

  #roster_design .roster-middle-body {
    border: 1px solid #ddd;
    position: relative;
    padding-top: 40px;
  }

  #roster_design .roster-left-tree {
    overflow-y: auto;
    height: 428px;
  }

  #roster_design .roster-left-tree .el-tree {
    border: none !important;
  }

  #roster_design .roster_select_tittle {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 40px;
    width: 100%;
    background: #F5F5F5;
    border-bottom: 1px solid #E6E6EB;
    line-height: 40px;
  }

  #roster_design .roster_select_tittle_left {
    display: inline-block;
    font-size: 14px;
    width: 300px;
    text-indent: 10px;
  }
  #roster_design .roster_select_tittle_right {
    font-size: 14px;
  }

  #roster_design .roster_select_list {
    background: #FFFFFF;
    height: 48px;
    border-bottom: 1px solid #E6E6EB;
    line-height: 48px;

    font-size: 14px;
  }

  #roster_design .roster_select_list_left {
    display: inline-block;
    width: 300px;
    text-indent: 10px;

  }

  #roster_design  .check-all-left-warp .el-table th > .cell {
    background: #f5f5f5;
    color: #2D2D2D;
  }

  #roster_design  .check-all-left-warp .el-table th {
    background: #f5f5f5;
  }

  #roster_design .check-all-left-warp .el-table {
    border: none;
  }

  #roster_design .check-all-left-warp .el-table::after {
    background: none;
  }

  #roster_design  .check-all-left-warp .el-table th > .cell {
    font-size: 14px;
    font-weight: 100;
  }
  .roster-ifbp-icon-middle{
    color: #B0B8BE;
    font-size: 60px !important;
  }
  .roster-ifbp-icon{
    color: #268CE7;
    cursor: pointer;
    font-size:20px;
  }
  .roster-ifbp-icon-small{
    color: #268CE7;
    cursor: pointer;
    font-size:18px;
  }
  .roster-ifbp-icon-sc{
    color: #268CE7;
    cursor: pointer;
    width: 135px;
  }
</style>
