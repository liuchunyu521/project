module.exports = {
  routes: [
      {
          name: 'childedu',
          path: '/hrwa/spetax/childedu/list',
          component: './src/childedu/childedu-list.vue'
      },
      {
        name: 'childeduadd',
        path: '/hrwa/spetax/childedu/detail',
        component: './src/childedu/childedu-detail.vue'
      },
     {
        name: 'childeduadd',
        path: '/hrwa/spetax/childedu/detail/:pk_childedu_h',
        component: './src/childedu/childedu-detail.vue'
      },
      {
        name: 'contedu',
        path: '/hrwa/spetax/contedu/list',
        component: './src/contedu/contedu-list.vue'
    },
   {
        name: 'conteduadd',
        path: '/hrwa/spetax/contedu/detail',
        component: './src/contedu/contedu-detail.vue'
    },
    {
        name: 'contedudetail',
        path: '/hrwa/spetax/contedu/detail/:pk_contedu_h',
        component: './src/contedu/contedu-detail.vue'
    },
    {
        name: 'loan',
        path: '/hrwa/spetax/loan/list',
        component: './src/loan/loan-list.vue'
    },
    {
        name: 'loanadd',
        path: '/hrwa/spetax/loan/detail',
        component: './src/loan/loan-detail.vue'
    },
    {
        name: 'loandetail',
        path: '/hrwa/spetax/loan/detail/:pk_loan_h',
        component: './src/loan/loan-detail.vue'
    },
    {
        name: 'illmedical',
        path: '/hrwa/spetax/illmedical/list',
        component: './src/illmedical/illmedical-list.vue'
    },
   {
        name: 'illmedicaladd',
        path: '/hrwa/spetax/illmedical/detail',
        component: './src/illmedical/illmedical-detail.vue'
    },
     {
        name: 'illmedicaldetail',
        path: '/hrwa/spetax/illmedical/detail/:pk_illmedical_h',
        component: './src/illmedical/illmedical-detail.vue'
    },
    {
        name: 'rendas',
        path: '/hrwa/spetax/rendas/list',
        component: './src/rendas/rendas-list.vue'
    },
    {
        name: 'rendasadd',
        path: '/hrwa/spetax/rendas/detail',
        component: './src/rendas/rendas-detail.vue'
    },
     {
        name: 'rendasdetail',
        path: '/hrwa/spetax/rendas/detail/:pk_rendas_h',
        component: './src/rendas/rendas-detail.vue'
    },
    {
        name: 'support',
        path: '/hrwa/spetax/support/list',
        component: './src/support/support-list.vue'
    },
     {
        name: 'supportadd',
        path: '/hrwa/spetax/support/detail',
        component: './src/support/support-detail.vue'
    },
     {
        name: 'supportdetail',
        path: '/hrwa/spetax/support/detail/:pk_support_h',
        component: './src/support/support-detail.vue'
    },
  ]
}
