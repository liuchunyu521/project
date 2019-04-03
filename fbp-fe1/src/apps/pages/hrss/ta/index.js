module.exports = {

    routes: [

        // 签卡（补考勤）汇总
        {
            name: 'signapply',
            path: '/hrss/ta/signapply',
            component: './src/sign/signApply-sum.vue'
        },
        // 签卡（补考勤）申请单
        {
            name: 'signapply',
            path: '/hrss/ta/signapply/detail/:id',
            component: './src/sign/signApply-detail.vue'
        },
        // 签卡（补考勤）申请单
        {
            name: 'signapply',
            path: '/hrss/ta/signapply/detail/:id/:signTime/:signstatus/:signremark',
            component: './src/sign/signApply-detail.vue'
        },

        // 我的考勤月报
        {
            name: 'myMonthstat',
            path: '/hrss/myMonthstat',
            component: './src/myMonthstat/myMonthstat.vue'
        },

        // 出差申请新增
        {
            name: 'away-add',
            path: '/hrss/ta/awayapply/detail',
            component: './src/away/away-detail.vue'
        },
        // 出差申请详情
        {
            name: 'away-add',
            path: '/hrss/ta/awayapply/detail/:id',
            component: './src/away/away-detail.vue'
        },
        // 出差申请单-列表（经理-团队出差）
        {
            name: 'away-list',
            path: '/hrss/ta/awayapply/list',
            component: './src/away/awayapply-info.vue'
        },
        //假期查询
        {
            name: 'leave',
            path: '/hrss/leave',
            component: './src/leave/leave-list.vue'
        },
        //休假申请新增
        {
            name: 'leave-add',
            path: '/hrss/ta/leaveapply',
            component: './src/leave/leave-detail.vue'
        },
        // 休假申请单-列表（经理-团队休假）
        {
            name: 'leave-list',
            path: '/hrss/ta/leaveapply/list',
            component: './src/leave/leaveapply-info.vue'
        },
        // 休假申请单-详情
        {
            name: 'leave',
            path: '/hrss/leaveapply/:id',
            component: './src/leave/leave-detail.vue'
        },

        //休假明细
        {
            name: 'leavelists',
            path: '/hrss/tbmLeavesList',
            component: './src/leave/tbm-leaves.vue'
        },

        // 加班申请单-列表（经理-团队加班）
        {
            name: 'otapply',
            path: '/hrss/ta/otapply/list',
            component: './src/overtime/otapply-info.vue'
        },
        // 加班申请单-新增
        {
            name: 'otapply',
            path: '/hrss/ta/otapply/detail',
            component: './src/overtime/otapply-detail.vue'
        },
        // 加班申请单-详情
        {
            name: 'otapply',
            path: '/hrss/ta/otapply/detail/:id',
            component: './src/overtime/otapply-detail.vue'
        },
        // 团队信息查询-列表（经理-团队信息）
        {
            name: 'teamnews-info',
            path: '/hrss/ta/teamnews',
            component: './src/teamnews/teamnews-info.vue'
        },

        // 团队出勤-列表（经理-团队出勤）
        {
            name: 'teamattendance-list',
            path: '/hrss/ta/teamattendance',
            component: './src/teamattendance/teamattendance-info.vue'
        },

    ]

}
