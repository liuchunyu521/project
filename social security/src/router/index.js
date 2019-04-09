import Vue from 'vue'
import Router from 'vue-router'
import PageView from '@/layouts/PageView'
import RouteView from '@/layouts/RouteView'
import MenuView from '@/layouts/MenuView'
import Login from '@/pages/login/Login'

Vue.use(Router)
// {
//   path: '/login',
//   name: '登录页',
//   component: Login,
//   invisible: true
// },

export default new Router({
  routes: [
    
    {
      path: '/',
      name: '首页',
      component: MenuView,
      redirect: '/workspace',
      icon: 'none',
      invisible: true,
      children: [
        {
          path: '/workspace',
          name: '工作台',
          icon: 'dashboard',
          component: () => import('@/pages/workSpace/homePage'),
          invisible: true,
        },

        {
          path: '/bankAccountMgt',
          name: '银行账户管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/bankAccountMgt/unitaccount',
              name: '单位账户管理',
              component: () => import('@/pages/bankAccountMgt/unitaccountMgt/unitaccount'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/bankAccountMgt/bankInfoMgt',
              name: '银行信息管理',
              component: () => import('@/pages/bankAccountMgt/bankInfoMgt/bankInfoMgt'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/bankAccountMgt/comegoUnMgt',
              name: '往来单位账户管理',
              component: () => import('@/pages/bankAccountMgt/comegoUnMgt/comegoUnMgt'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/bankAccountMgt/accountGoldcontrol',
              name: '账户资金监控信息',
              component: () => import('@/pages/bankAccountMgt/accountGoldcontrol/accountGoldcontrol'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/bankAccountMgt/comegoCompanyMgt',
              name: '往来单位管理',
              component: () => import('@/pages/bankAccountMgt/comegoCompanyMgt/comegoCompanyMgt'),
              icon: 'none',
              invisible: true,
            }
          ]
        },
        {
          path: '/adjustGoldMgt',
          name: '调剂金管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/adjustGoldMgt/adjustMakeBillslist',
              name: '调剂金制单',
              icon: 'none',
              component: RouteView,
              invisible: true,
              children: [
                {
                  path: '/adjustGoldMgt/adjustMakeBills',
                  name: '调剂金制单',
                  component: () => import('@/pages/adjustGoldMgt/adjustMakeBills'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/adjustGoldMgt/adjustMakeDetails',
                  name: '调剂金制单详细',
                  component: () => import('@/pages/adjustGoldMgt/adjustMakeDetails'),
                  icon: 'none',
                  invisible: true,
                }]
            },
            {
              path: '/adjustGoldMgt/adjustMakeBillsMgt',
              name: '调剂金审核',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/adjustGoldMgt/adjustApprove',
                  name: '调剂金审核',
                  component: () => import('@/pages/adjustGoldMgt/adjustApprove'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/adjustGoldMgt/adjustApproveDetails',
                  name: '调剂金审核详细',
                  component: () => import('@/pages/adjustGoldMgt/adjustApproveDetails'),
                  icon: 'none',
                  invisible: true,
                }]
            }
          ]
        },
        {
          path: '/balanceAccountMgt',
          name: '对账管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/balanceAccount/balanceAccountDataMgt',
              name: '对账数据源管理',
              component: () => import('@/pages/balanceAccountMgt/balanceAccountDataMgt'),
              icon: 'none',
              invisible: true,
            }
          ]
        },
        {
          path: '/expensesPlanMgt',
          name: '用款计划管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/expensesPlanMgtlist',
              name: '用款计划制单',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/expensesPlanMgt/expensesPlanMgtBills',
                  name: '用款计划制单',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtBills/expensesPlanMgtBills'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/expensesPlanMgt/expensesPlanMgtDetails',
                  name: '用款计划制单详细页面',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtBills/expensesPlanMgtDetails'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            },{
              path: '/expensesPlanMgtapprovelist',
              name: '用款计划审批',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/expensesPlanMgt/expensesPlanMgtapprove',
                  name: '用款计划审批单',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtapprove/expensesPlanMgtapprove'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/expensesPlanMgt/expensesPlanMgtApproveDetails',
                  name: '用款计划审批详细页面',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtapprove/expensesPlanMgtapproveDetails'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            }
          ]
        },{
          path: '/fundPayMgt',
          name: '基金支出管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/payMgt',
              name: '支付管理',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/payMgt/batchPay',
                  name: '批量支付',
                  component: () => import('@/pages/fundPayMgt/payMgt/batchPay'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/payMgt/singlePay',
                  name: '单笔支付',
                  component: () => import('@/pages/fundPayMgt/payMgt/singlePay'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            } 
          ]
        },{
          path: '/projectconfigMgt',
          name: '方案配置管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/projectconfigMgt/adjustGoldconfigMgtlist',
              name: '调剂金方案配置',
              component:RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/projectconfigMgt/adjustGoldconfigMgt',
                  name: '调剂金方案配置',
                  component: () => import('@/pages/projectconfigMgt/adjustGoldconfigMgt/adjustGoldconfigMgt'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/projectconfigMgt/adjustGoldconfigDetails',
                  name: '调剂金方案详细页面',
                  component: () => import('@/pages/projectconfigMgt/adjustGoldconfigMgt/adjustGoldconfigDetails'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            },{
              path: '/projectconfigMgt/expensesPlanconfig',
              name: '用款计划方案配置',
              component:RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/projectconfigMgt/expensesPlanconfig',
                  name: '用款计划方案配置',
                  component: () => import('@/pages/projectconfigMgt/expensesPlanconfig/expensesPlanconfig'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/projectconfigMgt/expensesPlanconfigDetails',
                  name: '用款计划方案详细页面',
                  component: () => import('@/pages/projectconfigMgt/expensesPlanconfig/expensesPlanconfigDetails'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            },
            {
              path: '/projectconfigMgt/accountGoldcontrolConfig',
              name: '资金账户监控配置',
              component:RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/projectconfigMgt/accountGoldcontrolConfig',
                  name: '资金账户监控配置',
                  component: () => import('@/pages/projectconfigMgt/accountGoldcontrolConfig/accountGoldcontrolConfig'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/projectconfigMgt/accountGoldcontrolDetails',
                  name: '资金监护详细',
                  component: () => import('@/pages/projectconfigMgt/accountGoldcontrolConfig/accountGoldcontrolDetails'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            }
          ]
        },
      ]
    }
  ]
})
