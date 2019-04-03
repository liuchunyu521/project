<!--
  作者：yangchd
  时间：2018-11-16
  支持：员工信息——人员排序
-->
<template>
  <!-- 人员排序字段 -->
  <drag-dialog
          @orderEndvalue="orderEndvalue"
          @orderData="orderData"
          :cascaderdialogVisible='dialogVisible'
          :title="title"
          :casShow="false"
          :orderData='orderList'>
  </drag-dialog>
</template>

<script>
  import dragDialog from '../../../../../common/component/dragdialog.vue';
  export default {
    props: {
      pk_org: {
        type: String,
        required: true,
      },
      pk_dept: {
        type: String,
        required: true,
      },
    },
    components: {
      dragDialog,
    },

    data() {
      return {
        // 功能编码
        funcode: 'funcode=60070employee',
        // 接口前缀
        requestPrefix: '/hrhi/employee/',
        // 所有当前页面请求路径
        requestUrl: {
          getPsnOrderList: 'getPsnOrderList',
          saveOrderList:'saveOrderList',
        },
        dialogVisible:false,
        title:'人员排序',

        orderList:[],
      }
    },

    methods: {
      setDialogVisible: function (val) {
        if(val){
          this.getDataByDept(this.pk_dept);
        }else{
          this.dialogVisible = val;
          this.orderList = [];
        }
      },

      // 保存方法
      orderEndvalue:function (data) {
        let params = {
          orderData:data,
        };
        this.$http({
          url: this.requestPrefix + this.requestUrl.saveOrderList,
          method: "post",
          data: params
        }).then(res => {
          if (res.data.status === true) {
            this.$message({ message: res.data.msg, type: "success" });
            this.$emit('refresh');
            this.setDialogVisible(false);
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        }).catch(() => {
          this.$message({ message: '保存失败！', type: "error" });
        });
      },

      // 级联选择改变
      orderData:function (val) {
        if(val && val.length > 0){
          this.cascaderModel = val;
          this.getDataByDept(val[val.length - 1]);
        }
      },

      getDataByDept:function (pk_dept) {
        let params = {
          pk_dept:pk_dept,
        };
        this.$http({
          url: this.requestPrefix + this.requestUrl.getPsnOrderList,
          method: "post",
          params:params,
        }).then(res => {
          if (res.data.status === true) {
            this.orderList = res.data.data.orderList;
            this.$nextTick(function () {
              this.dialogVisible = true;
            });
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        }).catch((res) => {
          this.$message({ message: "请求失败" + res, type: "error" });
        });
      },

    }
  }
</script>
