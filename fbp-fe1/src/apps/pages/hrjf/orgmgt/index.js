module.exports = {
  routes: [
      //组织管理
      {
          name: 'orgchart',
          path: '/hrjf/orgChart',
          component: './src/orgchart/organization.vue'//组织机构图正式
      },
      {
          name:'orgs',
          path:'/hrjf/hrOrg',
          component:'./src/orgs/orgsInfo.vue' //获取组织信息列表
      },
      {
          name:'orgsEdit',
          path:'/hrjf/hrOrg/orgsDetails/:id',
          component:'./src/orgs/orgs-dynamic-detail.vue' //组织信息编辑
      },
      {
          name:'orgsReadOnlyDetail',
          path:'/hrjf/hrOrg/orgsReadOnlyDetails/:id',
          component:'./src/orgs/orgs-dynamic-detail.vue' //组织信息编辑
      },
      //组织委托，别删
      {
          name:'manageScope',
          path:'/hrjf/manageScope',
          component:'./src/manageScope/manageScopeInfo.vue' //组织委托
      }
  ]
};
