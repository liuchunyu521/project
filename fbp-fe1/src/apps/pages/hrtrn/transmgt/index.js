module.exports = {
  routes: [
    {
      name: 'dimissionapplyentry',
      path: '/hrtrn/transmgt/dimissionapply2',
      component: './src/dimissionapply/psn-sel-info.vue'
    },
    {
      name: 'dimissionapplylist',
        path: '/hrtrn/transmgt/dimissionapply',
      component: './src/dimissionapply/dimission-apply-info.vue'
    },
    {
      name: 'dimissionapplydetail',
      path: '/hrtrn/transmgt/dimissionapply/detail/:id/:edit',
      component: './src/dimissionapply/dimission-apply-detail.vue'
    },
    {
      name: 'transapplydetail',
      path: '/hrtrn/transmgt/transapply/detail/:id/:edit',
      component: './src/transapply/trans-apply-detail.vue'
    },
    // 员工调入
    {
      name: 'transin',
      path: '/hrtrn/transmgt/transin',
      component: './src/transapply/trans-apply-transin.vue'
    },
    // 员工调动
    {
      name: 'transfer',
      path: '/hrtrn/transmgt/transfer',
      component: './src/transapply/trans-apply-transfer.vue'
    },
      {
          name: 'partapplylist',
          path: '/hrtrn/transmgt/partapply',
          component: './src/partapply/part-apply-info.vue'
      },
      {
          name: 'partapplydetail',
          path: '/hrtrn/transmgt/partapply/detail/:id/:edit',
          component: './src/partapply/part-apply-detail.vue'
      },
  ]
};
