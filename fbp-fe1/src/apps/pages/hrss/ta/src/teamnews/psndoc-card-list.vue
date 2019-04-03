<!--
  作者：yangchd
  时间：2018-05-16
  支持：员工信息——卡片列表切换
-->
<template>
  <div class="fr" id="psndoc_card_list_swap">
    <slot name="check_box"></slot>
    <slot name="text_btn"></slot>
    <i class="ifbp-icon-view-headline marginleft16" v-show="changeShow"  :class="[ isList ? activeClass :noActiveClass]" @click="changeList" title="列表"></i>
    <i class="ifbp-icon-view-module marginleft16" v-show="changeShow" :class="[ isList ? noActiveClass:activeClass]"  @click="changeCard" title="卡片"></i>
    <i class="ifbp-icon-setting marginleft16" v-if="isList"  :class="[noActiveClass]" @click="setShowItem" title="设置"></i>
  </div>
</template>

<script>

  export default {
    props: {
      isList: {
        type: Boolean,
        default: function () {
          return true;
        },
      },
      changeShow: {
        type: Boolean,
        default: function () {
          return true;
        },
      },
    },
    data() {
      return {
        activeClass:"active",
        noActiveClass:"notActive"
      }
    },
    methods: {
      setShowItem: function () {
        this.$emit('set_show_item');
      },
      changeCard:function () {
        this.$emit('change_card');
      },
      changeList:function () {
        this.$emit('change_list');
      }
    }
  }
</script>

<style scoped>
  #psndoc_card_list_swap   {
    position: relative;
    z-index: 10;
    height: 16px;
    margin-bottom: 16px;
  }
  #psndoc_card_list_swap i {
    font-size: 22px;
  }
  #psndoc_card_list_swap  i:hover {
    color: #75787B;
    cursor: pointer;
  }
  #psndoc_card_list_swap .active{
    color: #75787B;
  }
  #psndoc_card_list_swap .notActive{
    color: #C8C8CD;
  }
</style>
