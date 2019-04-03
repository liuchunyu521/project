module.exports= {
    routes:[
        //岗位序列
        {
                name:'postInfo',
                path: '/hrjf/postSeries',
                component: './src/postseries/postSeriesInfo.vue'

        }
        //岗位序列详情页
        ,{
            name: 'postSeriesEdit',
            path: '/hrjf/postSeries/postSeriesDetail/:id',
            component: './src/postseries/postSeriesDetail.vue'
        }
        //岗位序列新增
       , {
            name: 'postSeriesadd',
            path: '/hrjf/postSeries/postSeriesDetail',
            component: './src/postseries/postSeriesDetail.vue'
        }
        //岗位序列非编辑态详情
        ,{
            name: 'postSeriesEdit2',
            path: '/hrjf/postSeries/postSeriesDetail/:id/:isEditForPath',
            component: './src/postseries/postSeriesDetail.vue'
        }
        //岗位信息
        ,{
            name: 'postInfo',
            path: '/hrjf/post',
            component: './src/post/postInfo.vue'
        }
        //岗位信息
        ,{
            name: 'postDetail',
            path: '/hrjf/post/postDetail',
            component: './src/post/postDetail.vue'
        }
        //岗位图谱
        ,{
            name: 'postChatInfo',//名称
            path: '/hrjf/postChart/postChartInfo',//网址
            component: './src/postChart/postChartInfo.vue'//路径
        }
        //联查岗位只读列表页
        ,{
            name: 'postJoinInfo',
            path: '/hrjf/post/postJoinInfo',
            component: './src/post/postJoinInfo.vue'
        }

        //基准岗位
        ,{
            name: 'poststdInfo',
            path: '/hrjf/poststd',
            component: './src/poststd/poststdInfo.vue'
        }
        //基准岗位详情
        ,{
            name: 'poststdDetail',
            path:  '/hrjf/poststd/poststdDetail/:id/:isEditForPath',
            component: './src/poststd/poststdDetail.vue'
        }
        //基准岗位--新增
        ,{
            name: 'poststdDetail',
            path: '/hrjf/poststd/poststdDetail',
            component: './src/poststd/poststdDetail.vue'
        }
    ]
}