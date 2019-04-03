module.exports = {
  routes: [
    {
      name: 'regmngentry',
      path: '/hrtrn/regapply/regmng',
      component: './src/regapply/reg-apply-info.vue'
    },
      {
          name: 'regapplylist',
          path: '/hrtrn/regapply/applylist',
          component: './src/regapply/reg-apply-info.vue'
      },
      {
          name: 'regapplydetail',
          path: '/hrtrn/regapply/applydetail/:id/:edit/:trialresult',
          component: './src/regapply/reg-apply-detail.vue'
      },
  ]
};
