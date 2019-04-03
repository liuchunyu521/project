<!--
	作者：wangruie
	时间：2018-11-30
	支持：自助 专项个税
-->
<template>
 <ifbp-page>
<!-- <ifbp-breadcrumb name="专项个税申报"></ifbp-breadcrumb> -->

    <el-row :gutter="16" id="spetax-list">
      <el-col :xs="24" :sm="12" :md="8" :lg="6"  v-for="item in spetaxtitle" :key="item">
        <div class="spetax-type-item" style="" @click="clickType(item.url)">
          <div>
            <span style="display: inline-block;font-size: 48px;margin-bottom: 26px;" :style="{color:item.color}" :class="item.class" ></span>
          </div>
          <div>
            <span style="font-size:16px ;color: #2D2D2D;line-height: 16px;margin-bottom: 24px;display: inline-block;">{{item.name}}</span>
          </div>
          <div style="color:#666666;font-size: 12px;line-height: 16px;">{{item.text}}</div>
        </div>
      </el-col>
    </el-row>

 </ifbp-page>
</template>

<script>

export default {
  
  data() {


    return {
      spetaxtitle:[
        {"key":"tax1","color":"#7fd3a9","class":"hr-icon-face","name":"子女教育","url":"/hrss/spetax/childedu/detail","text":"子女教育专项附件扣除，每个子女每年12000元(每月1000元)"},
        {"key":"tax2","color":"#6FB4FF","class":"hr-icon-train","name":"继续教育","url":"/hrss/spetax/contedu/detail","text":"继续教育专项附加扣除，每年3600元或4800元"},
        {"key":"tax3","color":"#FFCC00","class":"hr-icon-payroll","name":"住房贷款利息","url":"/hrss/spetax/loan/detail","text":"首套住房贷款利息，偿贷款期间按照每年12000元(每月1000元)标准定额扣除"},
        {"key":"tax4","color":"#FF6161","class":"hr-icon-hospital","name":"大病医疗","url":"/hrss/spetax/illmedical/detail","text":"超过15000元的医药费用支出部分，可按照每年60000元标准限额据实扣除"},
        {"key":"tax5","color":"#6FB4FF","class":"hr-icon-city","name":"住房租金","url":"/hrss/spetax/rendas/detail","text":"主要工作城市没有住房，每月800-1200元"},
        {"key":"tax6","color":"#FFCC00","class":"hr-icon-oldman","name":"赡养老人","url":"/hrss/spetax/support/detail","text":"赡养60岁(含)以上父母以及其他定赡养人的支出，每月2000元标准定额扣除"},
        {"key":"tax7","color":"#7fd3a9","class":"ifbp-icon-search el-icon-search el-icon-pt-sousuo","name":"专项附加扣除查询","url":"/hrss/spetax/specialadd/detail","text":"预测扣除情况"},
        ]     
    }

  },
  components: {

  },
  methods: {
      clickType(url){
         this.$router.push(url);
      },
  },
  mounted() {


  },
  created() {
    debugger
  }
};
</script>

<style>
 #spetax-list .spetax-type-item {
    height: 200px;
    padding: 30px 52px;
    background-color: white;
    border: 1px solid white;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 16px;
    cursor: pointer;
    position: relative;
    text-align: center;
  }
  #spetax-list .spetax-type-item:hover {
    background-color: #e9f7fc;
    border: 1px solid #6bcaea;
  }

  #spetax-list .img-container {
    display: inline-block;
    padding: 32px;
    float: left;
  }

  #spetax-list .name-container {
    display: inline-block;
    padding: 48px 0px;
    float: left;
    width: calc(100% - 120px);
  }

  #spetax-list .name-container span {
    font-size: 16px;
    color: #333333;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    display: inline-block;
  }
</style>