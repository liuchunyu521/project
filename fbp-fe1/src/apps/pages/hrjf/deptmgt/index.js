module.exports= {
    routes:[
        //部门信息
        {
            name:'hrWebDeptInfo',
            path: '/hrjf/hrDept',
            component: './src/orgDept/deptInfo.vue'

        }
        //部门信息新增
        , {
            name: 'hrWebDeptAdd',
            path: '/hrjf/hrDept/deptDetail',
            component: './src/orgDept/deptDetailDynamic.vue'
        }
        //组织机构图跳转部门
        ,{
            name: 'hrWebDeptDetailNoEdit',
            path: '/hrjf/hrDept/deptNoEditDetail/:id',
            component: './src/orgDept/deptNoEditDetail.vue'
        }
        //组织联查部门
        ,{
            name: 'hrWebDeptJoinInfo',
            path: '/hrjf/hrDept/deptJoinInfo',
            component: './src/orgDept/deptJoinInfo.vue'
        }


        //跳转非编辑态联查列表页
        ,{
            name: 'hrWebDeptJoinInfo',
            path: '/hrjf/hrDept/deptJoinInfo',
            component: './src/orgDept/deptJoinInfo.vue'
        }



    ]
}