<template>
  <div class="footer">
    <div class="links">
      <a target="_blank" :key="index" :href="item.link ? item.link : 'javascript: void(0)'" v-for="(item, index) in linkList">
        <a-icon />
      </a>
    </div>
    <div class="copyright">
      <div style="height:29px"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  props: ['copyright', 'linkList']
}
</script>

<style lang="less" scoped>
  .footer{
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
    .copyright{
      color: rgba(0,0,0,.45);
      font-size: 14px;
    }
    .links{
      margin-bottom: 8px;
      a:not(:last-child) {
        margin-right: 40px;
      }
      a{
        color: rgba(0,0,0,.45);
        -webkit-transition: all .3s;
        transition: all .3s;
      }
    }
  }
</style>
