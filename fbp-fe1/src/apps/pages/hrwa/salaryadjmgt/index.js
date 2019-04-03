module.exports = {
  routes: [
      {
          name: 'psndocwadoc',
          path: '/hrwa/psndocwadoc',
          component: './src/psndocwadoc/psndocwadoc-info.vue'
      },
      {
          name: 'psndocwadoc-edit',
          path: '/hrwa/psndocwadoc/edit',
          component: './src/psndocwadoc/psndocwadoc-detail.vue'
      },
      {
          name: 'psndocwadoc-add',
          path: '/hrwa/psndocwadoc/edit',
          component: './src/psndocwadoc/psndocwadoc-detail.vue'
      },
      {
          name: 'psndocwadoc-putiao',
          path: '/hrwa/psndocwadoc/putiao',
          component: './src/psndocwadoc/psndocwadoc-putiao.vue'
      },
      {
          name: 'wagradeinfo',
          path: '/hrwa/wagrade/info',
          component: './src/wagrade/wagrade-info.vue'
      },
      {
          name: 'wagradeDetail',
          path: '/hrwa/wagrade/detail/:id/:isedit',
          component: './src/wagrade/wagrade-detail.vue'
      },
      {
          name: 'wagradeDetailAdd',
          path: '/hrwa/wagrade/detail',
          component: './src/wagrade/wagrade-detail.vue'
      },
      {
          name: 'wagradePsnhiDetail',
          path: '/hrwa/wagrade/psnhidetail/:id/:classtype',
          component: './src/wagrade/psnhi-detail.vue'
      },


      {
        name: 'adjustapply',
        path: '/hrwa/adjustapply/adjustapplyinfo',
        component: './src/adjustapply/adjustapply-info.vue'
    },

    {
        name: 'adjustapply-edit',
        path: '/hrwa/adjustapply/adjustApplyDetail/:pk_psnapp/:edit',
        component: './src/adjustapply/adjustapply-add.vue'
    },
    {
        name: 'adjustapply-add',
        path: '/hrwa/adjustapply/adjustApplyAdd',
        component: './src/adjustapply/adjustapply-add.vue'
    },
    {
        name: 'adjustapply-putiao',
        path: '/hrwa/adjustapply/putiao',
        component: './src/adjustapply/adjustapply-putiao.vue'
    },
      {
          name: 'adjustapply-psndoc',
          path: '/hrwa/adjustapply/psndocwadoc',
          component: './src/adjustapply/psndocwadoc-info.vue'
      },
      {
          name: 'psndocwadoc-apply-edit',
          path: '/hrwa/adjustapply/psndocwadoc/edit',
          component: './src/adjustapply/psndocwadoc-detail.vue'
      }
  ]
}
