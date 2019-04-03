module.exports = {
    routes: [
        {
            name: 'transferjldetail',
            path: '/hrtrn/transfer/jldetail/:id',
            component: './src/transfer/transferjl-detail.vue'
        },
        {
            name: 'trialjldetail',
            path: '/hrtrn/trial/jldetail/:id',
            component: './src/trial/tialjl-detail.vue'
        },
        {
            name: 'parttimejldetail',
            path: '/hrtrn/parttime/jldetail/:id',
            component: './src/parttime/parttimejl-detail.vue'
        },
        {
            name: 'regitem',
            path: '/hrtrn/basic/regitem',
            component: './src/basic/regitem.vue'
        },
        {
            name: 'transitem',
            path: '/hrtrn/basic/transitem',
            component: './src/basic/transitem.vue'
        },
        {
            name: 'dimissionitem',
            path: '/hrtrn/basic/dimissionitem',
            component: './src/basic/dimissionitem.vue'
        }

    ]
};
