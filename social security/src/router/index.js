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
          path: '/systemManage',
          name: '系统管理',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children:[
            {
              path: '/systemManage/fileServerConfig',
              name: '文件服务器配置',
              component: () => import('@/pages/systemManage/fileServerConfig'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/systemManage/dataDictionary',
              name: '数据字典',
              component: () => import('@/pages/systemManage/dataDictionary'),
              icon: 'none',
              invisible: true,
            }
          ]
        },
        {
          path: '/dataExchange',
          name: '数据交换平台',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/dataExchange/dataExchangeConfig',
              name: '数据交换方案配置',
              component: () => import('@/pages/dataExchange/dataExchangeConfig'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/dataExchange/dataExchangeConfigDetails',
              name: '数据交换方案详细',
              component: () => import('@/pages/dataExchange/dataExchangeConfigDetails'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/dataExchange/dataExchangeLog',
              name: '数据交换执行日志',
              component: () => import('@/pages/dataExchange/dataExchangeLog'),
              icon: 'none',
              invisible: true,
            }
          ]
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
              name: '对账管理',
              component: () => import('@/pages/balanceAccountMgt/balanceAccountDataMgt'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/balanceAccount/balanceAccountConfigMgt',
              name: '对账方案配置管理',
              component:RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/balanceAccount/balanceAccountConfigMgt',
                  name: '对账方案配置',
                  component: () => import('@/pages/balanceAccountMgt/balanceConfigMgt/balanceConfigMgt'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/balanceAccount/balanceAccountConfigMgtDetails',
                  name: '对账方案详细页面',
                  component: () => import('@/pages/balanceAccountMgt/balanceConfigMgt/balanceConfigMgtDetails'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            }

          ]
        },

        {
          path: '/fundRiskWarning',
          name: '基金风险预警',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/fundRiskWarning/warnRuleSet',
              name: '预警规则设置',
              component: () => import('@/pages/fundRiskWarning/warnRuleSet'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/fundRiskWarning/pointManage',
              name: '疑点管理',
              component: () => import('@/pages/fundRiskWarning/pointManage'),
              icon: 'none',
              invisible: true,
            },
            {
              path: '/fundRiskWarning/checkDaily',
              name: '查看日志',
              component: () => import('@/pages/fundRiskWarning/checkDaily'),
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
              path: '/expensesPlanMgtApprovelist',
              name: '用款计划审批',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/expensesPlanMgt/expensesPlanMgtApprove',
                  name: '用款计划审批单',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtApprove/expensesPlanMgtApprove'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/expensesPlanMgt/expensesPlanMgtApproveDetails',
                  name: '用款计划审批详细页面',
                  component: () => import('@/pages/expensesPlanMgt/expensesPlanMgtApprove/expensesPlanMgtApproveDetails'),
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
              path: '/fundPayMgt/payMgt',
              name: '支付管理',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/fundPayMgt/payMgt/batchPay',
                  name: '批量支付',
                  component: () => import('@/pages/fundPayMgt/payMgt/batchPay'),
                  icon: 'none',
                  invisible: true,
                },
                {
                  path: '/fundPayMgt/payMgt/singlePay',
                  name: '单笔支付',
                  component: () => import('@/pages/fundPayMgt/payMgt/singlePay'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            },
            {
              path: '/treatManage',
              name: '待遇支付计划管理',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/treatManage/treatManage',
                  name: '待遇支付计划管理',
                  component: () => import('@/pages/fundPayMgt/treatManage/treatManage'),
                  icon: 'none',
                  invisible: true,
                }
              ]
            },
            {
              path: '/outStanding',
              name: '收支台账查询',
              component: RouteView,
              icon: 'none',
              invisible: true,
              children: [
                {
                  path: '/outStanding/outStanding',
                  name: '基金支出台账查询',
                  component: () => import('@/pages/fundPayMgt/outStanding/outStanding'),
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
            }
          ]
        },
        {
          path: '/socialBankPlat',
          name: '社银平台',
          component: RouteView,
          icon: 'dashboard',
          invisible: true,
          children: [
            {
              path: '/socialBankPlat/accessBankConfig',
              name: '接入银行配置',
              component: () => import('@/pages/socialBankPlat/accessBankConfig'),
              icon: 'none',
              invisible: true,
            }
          ]
        }
      ]
    }
  ]
})
