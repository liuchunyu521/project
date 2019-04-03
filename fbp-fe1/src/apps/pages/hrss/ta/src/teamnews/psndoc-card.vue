<!--
  作者：yangchd
  时间：2018-05-16
  支持：员工信息——卡片模板
-->
<template>
  <div class="L_psndocbox">
    <el-row :gutter="10" style="margin-left: -8px;margin-right: -8px;margin-bottom: -16px;">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(item, index) in psndocCardData" :key="index" style="padding-left: 8px;padding-right: 8px">
        <div class="psndoc-card clearfix" @mouseenter="showIcon(index)" @mouseleave="hiddenIcon(index)">
          <div class="psndoc-card-left">
            <img class="psndoc-card-avatar" :src="item.imgPath" alt="" @error="errorLoadCardImg"/>
          </div>
          <div class="psndoc-card-right">
            <div class="psndoc-card-info clearfix">
              <div style="float: left">
                <span class="psndoc-card-name hidden-text">{{item.name}}</span>
              </div>
              
            </div>
            <div class="psndoc-card-psncl" v-if="item.psncl_name" v-text="item.psncl_name"></div>
            <div class="psndoc-card-other hidden-text" v-if="item.dept_name" v-text="item.dept_name"></div>
            <div class="psndoc-card-other hidden-text" v-if="item.mobile" v-text="item.mobile"></div>
            <div class="psndoc-card-other hidden-text" v-if="item.email" v-text="item.email"></div>
          </div>
          
          <div class="psndoc-card-fun">
            <div v-if="btnType===registerType">
              <i v-show='index===mouseIndex' class="psndoc-card-btn-left ifbp-icon-edit" title="编辑"
                 style="margin-right: 16px" @click="editIconClick(item,index)"></i>
              <i v-show='index===mouseIndex' class="psndoc-card-btn-left ifbp-icon-delete" title="删除"
                 style="margin-right: 16px" @click="deleteIconClick(item,index)"></i>
              <i v-show='index===mouseIndex' class="psndoc-card-btn-left ifbp-icon-exit-to-app" title="转档"
                 style="margin-right: 16px" @click="singleIntoDocClick(item,index)"></i>
              <i v-show='index===mouseIndex' class="psndoc-card-btn-left ifbp-icon-publish" title="发起申请"
                 style="margin-right: 16px" @click="entryApplyClick(item,index)"></i>
            </div>
            <div v-if="btnType===employeeType">
              <i v-show='index===mouseIndex' class="psndoc-card-btn-left ifbp-icon-edit" title="编辑"
                 @click="editIconClick(item,index)"></i>
            </div>
            <div v-if="btnType===psninfoType">
              <i v-show='index===mouseIndex' class="psndoc-card-btn-left ifbp-icon-search" title="查看"
                 style="margin-right: 16px;" @click="editIconClick(item,index)"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 离职编辑对话框 -->
    <dimission-jl-detail :ref="dimissionRef"
                         :pk_psndoc="pk_psndoc"
                         @psnend="refreshFunc">
    </dimission-jl-detail>
  </div>
</template>

<script>
  // 定义默认头像，当加载失败的时候使用
  import defaultAvatarMin from '../../../../../assets/images/hrhi/avatar/default_avatar_min.png';

  // 引入离职
 // import DimissionJlDetail from './dimissionjl-detail.vue';

  export default {
    components: {
     // DimissionJlDetail
    },
    props: {
      btnType: String,
      psndocCardData: Array,
    },
    data() {
      return {
        mouseIndex: -1,
        dropdownIndex: -1,
        registerType: "register",
        employeeType: 'employee',
        psninfoType: 'psninfo',

        // 离职使用
        pk_psndoc: '',
        dimissionRef: 'psndocCardDimissionRef',
      }
    },
    //初始化加载
    mounted() {
    },
    methods: {
      // 图片加载失败
      errorLoadCardImg: function (e) {
        e.srcElement.src = defaultAvatarMin;
      },
      // 页面跳转
      editIconClick: function (val, index) {
        let data = {
          row: val,
          index: index,
        };
        this.$emit('edit-card-click', data);
      },
      // 删除点击
      deleteIconClick: function (val, index) {
        let data = {
          row: val,
          index: index,
        };
        this.$emit('delete-card-click', data);
      },
      // 转档点击
      singleIntoDocClick: function (val, index) {
        let data = {
          row: val,
          index: index,
        };
        this.$emit('exit-to-app-card-click', data);
      },
      entryApplyClick:function (val, index) {
        let data = {
          row: val,
          index: index,
        };
        this.$emit('publish-card-click', data);
      },
      // 卡片界面下拉按钮的事件派发
      cardHandleCommand(command) {
        this.dropdownIndex = -1;
        if ("regApply" === command.type) {
          this.$router.push("/hrtrn/trial/jldetail/" + command.data.pk_psndoc + "?funcode=60090regrds");
        } else if ("stApply" === command.type) {
          this.$router.push("/hrtrn/transfer/jldetail/" + command.data.pk_psndoc + "?funcode=60090transrds");
        } else if ("leave" === command.type) {
          this.pk_psndoc = command.data.pk_psndoc;
          this.$nextTick(function () {
            this.$refs[this.dimissionRef].show();
          });
        } else if ("partTime" === command.type) {
          this.$router.push("/hrtrn/parttime/jldetail/" + command.data.pk_psndoc + "?funcode=60090partrds");
        }
      },
      refreshFunc: function () {
        this.$emit('refreshCard');
      },
      hiddenIcon(index){//鼠标移除隐藏ico
        this.mouseIndex = -1;
      },
      showIcon(index){//鼠标移入显示ico
        this.mouseIndex = index;
      },
      Liudroppdownshow(index){
        this.dropdownIndex = index;
      },
      Liudroppdownhidden(index){
        this.dropdownIndex = -1;
      }
    }
  }
</script>

<style scoped>
  /*基本信息样式*/
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }
	.L_psndocbox .el-row>div {
		overflow: inherit !important; 
	}
  /*
   * 下拉框样式
   */
  .Liudroppdown-menu {
    transform-origin: center top 0px;
    z-index: 2034;
    position: absolute;
    top: 15px;
    right: -25px;
    margin: 5px 0;
    border: 1px solid #d1dbe5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .12);
    padding: 6px 0;
    min-width: 100px;
    background: #fff;
    border-radius: 4px;
  }

  .Liu-el-dropdown-item {
    list-style: none;
    line-height: 36px;
    padding: 0 16px;
    margin: 0;
    cursor: pointer;
    font-size: 14px;
    color: #2d2d2d;
  }

  .Liu-el-dropdown-item:hover {
    background-color: #F0F5FA;
    color: #48586a;
  }

  /*over*/

  .psndoc-card {
    height: 150px;
    margin-bottom: 16px;
    border-radius: 4px;
    border: 1px solid #E7E7E7;
    position: relative;
  }

  .psndoc-card:hover {
    background: rgba(243, 246, 249, 0.50);
    border: 1px solid #F0F0F5;
    box-shadow: 0 2px 4px 0 #E2E8EF;
    border-radius: 4px;
  }

  .psndoc-card-left {
    float: left;
    margin: 16px;
  }

  .psndoc-card-avatar {
    width: 64px;
    height: 90px;
  }

  .psndoc-card-right {
    position: absolute;
    top: 10px;
    left: 96px;
  }

  .psndoc-card-info {
    width: 100%;
  }

  .psndoc-card-name {
    font-size: 18px;
    color: #333333;
    letter-spacing: 0;
    line-height: 30px;
  }

  .psndoc-card-psncl {
    background: #42BBA7;
    border-radius: 2px;
    width: 72px;
    height: 18px;
    font-size: 12px;
    color: #fff;
    display: inline-block;
    text-align: center;
    line-height: 18px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .psndoc-card-other {
    font-size: 12px;
    color: #6B6B6B;
    letter-spacing: 0;
    line-height: 12px;
    margin-bottom: 6px;
  }

  .psndoc-card-fun {
    position: absolute;
    right: 0px;
    top: 16px;
    cursor: pointer;
  }

  .psndoc-card-btn-left {
    color: #20a0ff;
    width: 14px;
    height: 14px;
    float: left;
    /*display:block;*/
    /*display:none;*/
  }

  .psndoc-card-btn-right {
    color: #20a0ff;
    font-size: 22px;
    float: left;
    /*display:block;*/
    /*padding-left: 10px;*/
    /*display:none;*/
  }

  /*.psndoc-card:hover .psndoc-card-btn-left{
    display: block;
  }
  .psndoc-card:hover .psndoc-card-btn-right {
    display: block;
  }*/

  .hidden-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 14em;
  }
</style>
