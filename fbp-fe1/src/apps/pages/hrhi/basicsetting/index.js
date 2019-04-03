module.exports = {
    routes: [
        // 花名册设置
        {
            name: 'repdef-info',
            path: '/hrhi/repdef',
            component: './src/repdef/repdef-info.vue'
        },
        // 花名册设置新增
        {
            name: 'repdef-add',
            path: '/hrhi/repdef/add',
            component: './src/repdef/repdef-detail.vue'
        },
        // 花名册设置编辑
        {
            name: 'repdef-detail',
            path: '/hrhi/repdef/detail/:id',
            component: './src/repdef/repdef-detail.vue'
        },
        // 异动类型
        {
            name: 'trnstype',
            path: '/hrhi/trnstype',
            component: './src/trnstype/trnstype.vue'
        },
        // 基础设置
        {
            name: 'basicset',
            path: '/hrhi/basicset',
            component: './src/basicset/basicsettext.vue'
        },
        // 标签
        {
            name: 'tag',
            path: '/hrhi/tag',
            component: './src/tag/tag.vue'
        },
    ]
}