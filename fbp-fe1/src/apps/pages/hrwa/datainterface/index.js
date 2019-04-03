module.exports = {
  routes: [
      {
          name: 'dataio',
          path: '/hrwa/dataio',
          component: './src/dataio/dataio-info.vue'
      },
      // 数据接口设计
      {
          name: 'dataiodesign',
          path: '/hrwa/dataio/design/:id',
          component: './src/dataio/dataio-design.vue'
      },
      // 数据接口导出
      {
          name: 'dataioexport',
          path: '/hrwa/dataio/export',
          component: './src/dataio/dataio-export.vue'
      },
      // 数据接口导入
      {
          name: 'dataioimport',
          path: '/hrwa/dataio/import',
          component: './src/dataio/dataio-import.vue'
      },
  ]
}
