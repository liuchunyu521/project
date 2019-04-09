<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
//import enquireScreen from './utils/device'

export default {
  name: 'App',
  created () {
//  let _this = this
//  enquireScreen(isMobile => {
//    _this.$store.commit('setting/setDevice', isMobile)
//  })
  }
}
</script>

<style lang="less">
  :global{
    //拖拽控件全局样式
    .dragable-ghost{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-chose{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-drag{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    //页面切换动画
    .page-toggle-enter-active{
      transition: all 0.2s ease-in 0.25s;
    }
    .page-toggle-leave-active{
      transition: all 0.2s ease-out 0s;
    }
    .page-toggle-enter, .page-toggle-leave-to{
      opacity: 0;
      padding: 0px;
    }
  }

  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 5px 5px;
  }
  .ant-table-thead > tr > th {//表头居中
    text-align: center;
  }
  .adjustGOldconfigDetails .ant-table-tbody > tr > td {//调剂金配置页面全局样式
    padding: 0px;
  }
  .ant-table-tbody {
    text-align: center;
  }
</style>
