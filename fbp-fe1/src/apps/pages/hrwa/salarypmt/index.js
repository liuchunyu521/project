module.exports = {
  routes: [
          {
              name: 'payFileInfo',
              path: '/hrwa/payFile/payFileInfo',
              component: './payfile/src/payfile-info.vue'
          },
          {
              name: 'payFileAdd',
              path: '/hrwa/payFile/payFileAdd',
              component: './payfile/src/payfile-detail.vue'
          },
          {
              name: 'payFileDetail',
              path: '/hrwa/payFile/payFileDetail/:id/:nn',
              component: './payfile/src/payfile-detail.vue'
          },
          {
              name: 'payFileOpByRule',
              path: '/hrwa/payFile/opByRule',
              component: './payfile/src/payfile-opByRule.vue'
          },
          {
              name: 'payFilePsnTran',
              path: '/hrwa/payFile/tranPsn',
              component: './payfile/src/payfile-tran.vue'
          },
          {
              name: 'payFileBatchAddPsn',
              path: '/hrwa/payFile/batchAddPsn',
              component: './payfile/src/payfile-batch-add.vue'
          },
          {
              name: 'paydatainfo',
              path: '/hrwa/paydata/info',
              component: './paydata/src/paydata-info.vue'
          },

          {
              name: 'adjustinfo',
              // path: '/hrwa/paydata/adjustinfo/:pk_org/:pk_wa_class/:cyear/:cperiod',
              path: '/hrwa/paydata/adjustinfo',
              component: './paydata/src/paydata-adjust-info.vue'
          },
          {
              name: 'adjustdetail',
              // path: '/hrwa/paydata/adjustdetail/:id',
              path: '/hrwa/paydata/adjustdetail',
              component: './paydata/src/paydata-adjust-detail.vue'
          },
         {
          name: 'adjustadd',
          path: '/hrwa/paydata/adjustadd',
          component: './paydata/src/paydata-adjust-detail.vue'
        },
       {
          name: 'ontimeinfo',
           path: '/hrwa/paydata/ontimeinfo',
          component: './paydata/src/paydata-ontime-info.vue'
       },
      {
          name: 'ontimedetail',
          path: '/hrwa/paydata/ontimedetail',
          component: './paydata/src/paydata-ontime-detail.vue'
      },
      {
          name: 'detailcompare',
          // path: '/hrwa/paydata/detailcompare/:pk_org/:pk_wa_class/:cyear/:cperiod',
          path: '/hrwa/paydata/detailcompare',
          component: './paydata/src/paydata-detail-compare.vue'
      },
      {
          name: 'waclasslistinfo',
          path: '/hrwa/paydata/waClassListInfo',
          component: './paydata/src/waclass-info.vue'
      },
 

      /**
       * 以下是分屏的薪资核算
       */
      {
          name: 'waclasslistinfo',
          path: '/hrwa/paydata/paydata',
          component: './pay/src/paydata.vue'
      },
      {
          name: 'paydataAdjustinfo',
          path: '/hrwa/paydata/paydataAdjustinfo',
          component: './pay/src/paydata-adjust-info.vue'
      },
      {
          name: 'paydataAdjustdetail',
          path: '/hrwa/paydata/paydataAdjustdetail',
          component: './pay/src/paydata-adjust-detail.vue'
      },
      {
          name: 'paydataAdjustadd',
          path: '/hrwa/paydata/paydataAdjustadd',
          component: './pay/src/paydata-adjust-detail.vue'
      },
      {
          name: 'paydataOntimeinfo',
           path: '/hrwa/paydata/paydataOntimeinfo',
          component: './pay/src/paydata-ontime-info.vue'
      },
      {
          name: 'paydataOntimedetail',
          path: '/hrwa/paydata/paydataOntimedetail',
          component: './pay/src/paydata-ontime-detail.vue'
      },
      {
          name: 'paydataDetailcompare',
          path: '/hrwa/paydata/paydataDetailcompare',
          component: './pay/src/paydata-detail-compare.vue'
      },
//     {
//        name: 'paydataAlert',
//        path: '/hrwa/paydata/payDataAlert',
//        component: './pay/src/pay-item-alert.vue'
//    },
      /**
       * end
       */
    {
        name: 'payrollList',
        path: '/hrwa/payroll',
        component: './src/payroll/payroll-list.vue'
    },
    {
        name: 'payrollDetail',
        path: '/hrwa/payroll/detail/:pk_payroll',
        component: './src/payroll/payroll-detail.vue'
    },
    {
        name: 'payrollAdd',
        path: '/hrwa/payroll/add',
        component: './src/payroll/payroll-add.vue'
    }
  ]
}
