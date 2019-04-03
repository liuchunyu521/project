<template>
  <div class="no-data-container">
    <div style="font-size: 92px;padding-bottom: 36px;" :class="emptyClass"></div>
    <div class="tip-content" v-text="emptyText"></div>
  </div>
</template>

<script>
  export default{
    props: {
      emptyText: String,
      iconClass: String,
    },
    computed: {
      emptyClass: function () {
        if (this.iconClass) {
          return this.iconClass;
        }else{
          return 'ifbp-icon-search';
        }
      }
    },
  }
</script>

<style scope>
  .no-data-container {
    padding: 64px 0px;
    text-align: center;
    color: rgb(191, 191, 191);
  }
  .tip-content {
    font-size: 20px;
  }
</style>