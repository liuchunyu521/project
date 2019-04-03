module.exports = {
  routes: [
    {
      name: 'myWage',
      path: '/hrss/myWage',
      component: './src/myWage/myWage.vue'
    },
    {
      name: 'taxReport',
      path: '/hrss/taxReport',
      component: './src/taxReport/taxReport.vue'
    },
    //专项教育
    {
      name: 'spetax',
      path: '/hrss/spetax',
      component: './src/spetax/spetax.vue'
    },
    //专项教育-子女教育
    {
      name: 'spetaxchildedu',
      path: '/hrss/spetax/childedu/detail',
      component: './src/spetax/childedu/childedu-detail.vue'
    },
    //专项教育-子女教育详情
    {
      name: 'spetaxchildedu',
      path: '/hrss/spetax/childedu/detail/:pk_childedu_h',
      component: './src/spetax/childedu/childedu-detail.vue'
    },
    //专项教育-继续教育
    {
      name: 'spetaxcontedu',
      path: '/hrss/spetax/contedu/detail',
      component: './src/spetax/contedu/contedu-detail.vue'
    },
    //专项教育-继续教育详情
    {
      name: 'spetaxcontedu',
      path: '/hrss/spetax/contedu/detail/:pk_contedu_h',
      component: './src/spetax/contedu/contedu-detail.vue'
    },
    //专项教育-住房贷款利息
    {
      name: 'spetaxloanedu',
      path: '/hrss/spetax/loan/detail',
      component: './src/spetax/loan/loan-detail.vue'
    },
    //专项教育-住房贷款利息详情
    {
      name: 'spetaxloanedu',
      path: '/hrss/spetax/loan/detail/:pk_loan_h',
      component: './src/spetax/loan/loan-detail.vue'
    },
    //个税专项-大病医疗利息
    {
      name: 'spetaxillmedical',
      path: '/hrss/spetax/illmedical/detail',
      component: './src/spetax/illmedical/illmedical-detail.vue'
    },
    //个税专项-大病医疗详情
    {
      name: 'spetaxillmedical',
      path: '/hrss/spetax/illmedical/detail/:pk_illmedical_h',
      component: './src/spetax/illmedical/illmedical-detail.vue'
    },
    //个税专项-赡养老人利息
    {
      name: 'spetaxsupport',
      path: '/hrss/spetax/support/detail',
      component: './src/spetax/support/support-detail.vue'
    },
    //个税专项-赡养老人详情
    {
      name: 'spetaxsupportedu',
      path: '/hrss/spetax/support/detail/:pk_support_h',
      component: './src/spetax/support/support-detail.vue'
    },
    {
      name: 'rendasadd',
      path: '/hrss/spetax/rendas/detail',
      component: './src/spetax/rendas/rendas-detail.vue'
    },
    {
      name: 'spetaxsupportedu',
      path: '/hrss/spetax/rendas/detail/:pk_rendas_h',
      component: './src/spetax/rendas/rendas-detail.vue'
    },
    //专项附加扣除查询
    {
      name: 'spetaxspecialadd',
      path: '/hrss/spetax/specialadd/detail',
      component: './src/spetax/specialadd/specialadd-detail.vue'
    }
  ]
}
