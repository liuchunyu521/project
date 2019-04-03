module.exports = {
  routes: [
    //入职登记列表
    {
      name: 'register-info',
      path: '/hrhi/register',
      component: './src/register/register-info.vue'
    },
    //入职登记新增
    {
      name: 'register-add',
      path: '/hrhi/register/add',
      component: './src/register/register-add.vue'
    },
    // 入职登记动态页面
    {
      name: 'register-dynamic',
      path: '/hrhi/register/dynamic/:id',
      component: './src/register/register-dynamic-detail.vue'
    },
    // 入职登记申请单
    {
      name: 'register-apply',
      path: '/hrhi/register/apply/:id/:edit',
      component: './src/register/register-apply-detail.vue'
    },

    // 员工信息维护-列表
    {
      name: 'employee-info',
      path: '/hrhi/employee',
      component: './src/employee/employee-info.vue'
    },
    // 员工信息维护-动态页面
    {
      name: 'employee-dynamic',
      path: '/hrhi/employee/dynamic/:id',
      component: './src/employee/employee-dynamic-detail.vue'
    },
    // 员工信息维护-结束兼职
    {
      name: 'parttime-end',
      path: '/hrhi/employee/endpart/:id',
      component: './src/employee/employee-parttime-end.vue'
    },

    // 员工信息查询-列表
    {
      name: 'psninfo-info',
      path: '/hrhi/psninfo',
      component: './src/psninfo/psninfo-info.vue'
    },
    // 员工信息查询-动态页面
    {
      name: 'psninfo-dynamic',
      path: '/hrhi/psninfo/dynamic/:id',
      component: './src/psninfo/psninfo-dynamic-detail.vue'
    },
    // 员工信息查询-联查
    {
      name: 'psninfo-join',
      path: '/hrhi/psndoc',
      component: './src/psninfo/psninfo-join.vue'
    },

    // 亲属规避信息-列表
    {
      name: 'familyavoid-info',
      path: '/hrhi/familyavoid',
      component: './src/familyavoid/familyavoid-info.vue'
    },
    // 亲属规避信息-详情
    {
      name: 'familyavoid-detail',
      path: '/hrhi/familyavoid/detail/:id',
      component: './src/familyavoid/familyavoid-detail.vue'
    },

    // 干部任免表-列表
    {
      name: 'cadres-info',
      path: '/hrhi/cadres/cadres',
      component: './src/cadres/cadres-info.vue'
    },
    // 干部任免表-动态页面
    {
      name: 'cadres-dynamic',
      path: '/hrhi/cadres/dynamic/:id',
      component: './src/cadres/cadres-dynamic-detail.vue'
    }
  ]
}
