module.exports = {
  routes: [
      {
          name: 'waitemInfo',
          path: '/hrwa/waitem/waItemInfo',
          component: './src/waitem/waitem-info.vue'
      },
      {
          name: 'waitemDetail',
          path: '/hrwa/waitem/detail/:id/:nn',
          component: './src/waitem/waitem-detail.vue'
      },
      {
          name: 'waitemAdd',
          path: '/hrwa/waitem/add',
          component: './src/waitem/waitem-add.vue'
      },
      {
          name: 'waclass',
          path: '/hrwa/waclass',
          component: './src/waclass/waclass-info.vue'
      },
      {
          name: 'waclass-add',
          path: '/hrwa/waclass/add',
          component: './src/waclass/waclass-add.vue'
      },
      {
          name: 'waclass-edit',
          path: '/hrwa/waclass/edit/:pk_wa_class/:editable',
          component: './src/waclass/waclass-detail.vue'
      },
      {
          name: 'payiteminfo',
          path: '/hrwa/payitem/info/:pk_wa_class/:pk_group/:pk_org/:cyear/:cperiod/:name/:pk_group_name/:pk_org_name',
          component: './src/payitem/payitem-info.vue'
      },
      {
          name: 'payitemdetail',
          path: '/hrwa/payitem/detail/:pk_wa_classitem/:is_edit/:opercolif/:pk_org/:pk_wa_class/:cyear/:cperiod',
          component: './src/payitem/payitem-detail.vue'
      },
      {
          name: 'waruleinfo',
          path: '/hrwa/warule/info',
          component: './src/warule/warule-info.vue'
      },
      {
          name: 'waruleDetail',
          path: '/hrwa/warule/detail/:id/:isedit/:name',
          component: './src/warule/warule-detail.vue'
      },
      {
          name: 'waruleDetailAdd',
          path: '/hrwa/warule/detail',
          component: './src/warule/warule-detail.vue'
      },
      {
          name: 'itempowerInfo',
          path: '/hrwa/itempower',
          component: './src/itempower/itempower-info.vue'
      },
  ]
}
