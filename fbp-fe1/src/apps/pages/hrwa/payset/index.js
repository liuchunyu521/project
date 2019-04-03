module.exports = {
    routes: [
        // 薪资方案权限
        {
            name: 'classpower',
            path: '/hrwa/classpower',
            component: './src/classpower/classpower-info.vue'
        },
        // 合并计税方案
        {
            name: 'sumrate',
            path: '/hrwa/sumrate',
            component: './src/sumrate/sumrate-info.vue'
        },
    ]
}