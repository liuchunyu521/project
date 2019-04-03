import Vue from 'vue'
import Router from 'vue-router'
import PageView from '@/layouts/PageView'
import RouteView from '@/layouts/RouteView'
import MenuView from '@/layouts/MenuView'
import Login from '@/pages/login/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login,
      invisible: true
    },
    {
      path: '/',
      name: '首页',
      component: MenuView,
      redirect: '/login',
      icon: 'none',
      invisible: true,
      children: [
        {
          path: '/bankAccountMgt',
          name: '银行账户管理',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/bankAccountMgt/unitaccount',
              name: '单位账户管理',
              component: () => import('@/pages/bankAccountMgt/unitaccountMgt/unitaccount'),
              icon: 'none'
            },
            {
              path: '/bankAccountMgt/bankInfoMgt',
              name: '银行信息管理',
              component: () => import('@/pages/bankAccountMgt/bankInfoMgt/bankInfoMgt'),
              icon: 'none'
            },
            {
              path: '/bankAccountMgt/comegoUnMgt',
              name: '往来单位账户管理',
              component: () => import('@/pages/bankAccountMgt/comegoUnMgt/comegoUnMgt'),
              icon: 'none'
            },
            {
              path: '/bankAccountMgt/accountGoldcontrol',
              name: '账户资金监控信息',
              component: () => import('@/pages/bankAccountMgt/accountGoldcontrol/accountGoldcontrol'),
              icon: 'none'
            },
            {
              path: '/bankAccountMgt/comegoCompanyMgt',
              name: '往来单位管理',
              component: () => import('@/pages/bankAccountMgt/comegoCompanyMgt/comegoCompanyMgt'),
              icon: 'none'
            }
          ]
        },
        {
          path: '/adjustGoldMgt',
          name: '调剂金管理',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/adjustGoldMgt/adjustMakeBillslist',
              name: '调剂金制单',
              icon: 'none',
              component: RouteView,
              children: [
                {
                  path: '/adjustGoldMgt/adjustMakeBills',
                  name: '调剂金制单',
                  component: () => import('@/pages/adjustGoldMgt/adjustMakeBills'),
                  icon: 'none'
                },
                {
                  path: '/adjustGoldMgt/adjustMakeDetails',
                  name: '调剂金制单详细',
                  component: () => import('@/pages/adjustGoldMgt/adjustMakeDetails'),
                  icon: 'none'
                }]
            },
            {
              path: '/adjustGoldMgt/adjustMakeBillsMgt',
              name: '调剂金审核',
              component: RouteView,
              icon: 'none',
              children: [
                {
                  path: '/adjustGoldMgt/adjustApprove',
                  name: '调剂金审核',
                  component: () => import('@/pages/adjustGoldMgt/adjustApprove'),
                  icon: 'none'
                },
                {
                  path: '/adjustGoldMgt/adjustApproveDetails',
                  name: '调剂金审核详细',
                  component: () => import('@/pages/adjustGoldMgt/adjustApproveDetails'),
                  icon: 'none'
                }]
            }
          ]
        },
        {
          path: '/balanceAccountMgt',
          name: '对账管理',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/balanceAccount/balanceAccountDataMgt',
              name: '对账数据源管理',
              component: () => import('@/pages/balanceAccountMgt/balanceAccountDataMgt'),
              icon: 'none'
            }
          ]
        },
        {
          path: '/expensesPlanMgt',
          name: '用款计划管理',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/expensesPlanMgtlist',
              name: '用款计划制单',
              component: RouteView,
              icon: 'none',
              children: [
                {
                  path: '/expensesPlanMgt/expensesPlanMgtBills',
                  name: '用款计划制单',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtBills/expensesPlanMgtBills'),
                  icon: 'none'
                },
                {
                  path: '/expensesPlanMgt/expensesPlanMgtDetails',
                  name: '用款计划制单详细页面',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtBills/expensesPlanMgtDetails'),
                  icon: 'none'
                }
              ]
            },{
              path: '/expensesPlanMgtapprovelist',
              name: '用款计划审批',
              component: RouteView,
              icon: 'none',
              children: [
                {
                  path: '/expensesPlanMgt/expensesPlanMgtapprove',
                  name: '用款计划审批单',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtapprove/expensesPlanMgtapprove'),
                  icon: 'none'
                },
                {
                  path: '/expensesPlanMgt/expensesPlanMgtApproveDetails',
                  name: '用款计划审批详细页面',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtapprove/expensesPlanMgtapproveDetails'),
                  icon: 'none'
                }
              ]
            }
          ]
        },{
          path: '/fundPayMgt',
          name: '基金支出管理',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/payMgt',
              name: '支付管理',
              component: RouteView,
              icon: 'none',
              children: [
                {
                  path: '/payMgt/batchPay',
                  name: '批量支付',
                  component: () => import('@/pages/fundPayMgt/payMgt/batchPay'),
                  icon: 'none'
                },
                {
                  path: '/payMgt/singlePay',
                  name: '单笔支付',
                  component: () => import('@/pages/fundPayMgt/payMgt/singlePay'),
                  icon: 'none'
                }
              ]
            } 
          ]
        },{
          path: '/projectconfigMgt',
          name: '方案配置管理',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/projectconfigMgt/adjustGoldconfigMgtlist',
              name: '调剂金方案配置',
              component:RouteView,
              icon: 'none',
              children: [
                {
                  path: '/projectconfigMgt/adjustGoldconfigMgt',
                  name: '调剂金方案配置',
                  component: () => import('@/pages/projectconfigMgt/adjustGoldconfigMgt/adjustGoldconfigMgt'),
                  icon: 'none'
                },
                {
                  path: '/projectconfigMgt/adjustGoldconfigDetails',
                  name: '调剂金方案详细页面',
                  component: () => import('@/pages/projectconfigMgt/adjustGoldconfigMgt/adjustGoldconfigDetails'),
                  icon: 'none'
                }
              ]
            },
            {
              path: '/projectconfigMgt/accountGoldcontrolConfig',
              name: '资金账户监控配置',
              component:RouteView,
              icon: 'none',
              children: [
                {
                  path: '/projectconfigMgt/accountGoldcontrolConfig',
                  name: '资金账户监控配置',
                  component: () => import('@/pages/projectconfigMgt/accountGoldcontrolConfig/accountGoldcontrolConfig'),
                  icon: 'none'
                },
                {
                  path: '/projectconfigMgt/accountGoldcontrolDetails',
                  name: '资金监护详细',
                  component: () => import('@/pages/projectconfigMgt/accountGoldcontrolConfig/accountGoldcontrolDetails'),
                  icon: 'none'
                }
              ]
            }
          ]
        },
      ]
    }
  ]
})
