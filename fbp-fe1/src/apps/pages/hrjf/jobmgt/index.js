module.exports = {
  routes: [
      //职等
      {
          name: 'jobRankInfo',
          path: '/hrjf/jobRank',
          component: './src/jobrank/jobRankInfo.vue'
      },
      {
          name: 'jobRankDetail',
          path: '/hrjf/jobRank/jobRankDetail/:id',
          component: './src/jobrank/jobRankDetail.vue'
      },
      {
          name: 'jobRankAdd',
          path: '/hrjf/jobRank/jobRankDetail',
          component: './src/jobrank/jobRankDetail.vue'
      },
      {
          name: 'jobRankDetailNoEdit',
          path: '/hrjf/jobRank/jobRankDetail/:id/:isEditForPath',
          component: './src/jobrank/jobRankDetail.vue'
      },
      //职级类别
      {
          name: 'joblevelsys',
          path: '/hrjf/jobLevelSys',
          component: './src/joblevelsys/jobLevelSysInfo.vue'
      },
      {
          name: 'joblevelsysadd',
          path: '/hrjf/jobLevelSys/jobLevelSysDetail',
          component: './src/joblevelsys/jobLevelSysDetail.vue'
      },
      {
          name: 'joblevelsysedit',
          path: '/hrjf/jobLevelSys/jobLevelSysDetail/:id',
          component: './src/joblevelsys/jobLevelSysDetail.vue'
      },
      {
          name: 'joblevelsysnoedit',
          path: '/hrjf/jobLevelSys/jobLevelSysDetail/:id/:isEditForPath',
          component: './src/joblevelsys/jobLevelSysDetail.vue'
      },
      //职务类别
        {
            name: 'jobtype',
            path: '/hrjf/jobType',
            component: './src/jobtype/jobTypeInfo.vue'
        },
        {
            name: 'jobtype_detail-add',
            path: '/hrjf/jobType/jobTypeDetail',
            component: './src/jobtype/jobTypeDetail.vue'
        },
        {
            name: 'jobtype_detail-edit',
            path: '/hrjf/jobType/jobTypeDetail/:id',
            component: './src/jobtype/jobTypeDetail.vue'
        },
      {
          name: 'jobtype_detail-noedit',
          path: '/hrjf/jobType/jobTypeDetail/:id/:isEditForPath',
          component: './src/jobtype/jobTypeDetail.vue'
      },
         //职务信息
        {
          name: 'jobinfo',
          path: '/hrjf/job',
          component: './src/job/jobInfo.vue'
        },
        {
          name: 'jobadd',
          path: '/hrjf/job/jobDetail',
          component: './src/job/jobDetail.vue'
        },
      {
          name: 'jobdetail',
          path: '/hrjf/job/jobDetail/:id',
          component: './src/job/jobDetail.vue'
      },
      {
          name: 'jobdetailnoedit',
          path: '/hrjf/job/jobDetail/:id/:isEditForPath',
          component: './src/job/jobDetail.vue'
      },
      {
          name: 'jobChartInfo',
          path: '/hrjf/jobChart/jobChartInfo',
          component: './src/jobchart/jobChartInfo.vue'
      }
  ]
};
