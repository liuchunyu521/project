import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login/login';//登录引用
import Index from '@/components/main/index';//公共部分
import homepage from '@/components/main/homepage';//主页内容
//import refresh from '@/components/public/refresh';//菜单刷新
//我的信息部分
import myInfo from '@/components/person/myinfo/info';
import Employeelist from '@/components/person/employee/list';  
import Employeeinfo from '@/components/person/employee/info';   

//消息中心
import Warningmessagelist from '@/components/messagecenter/warning/warninglist';
import Informmessagelist from '@/components/messagecenter/inform/informlist';
import Handlemessagelist from '@/components/messagecenter/handle/handlelist';

//薪资查询
import Mysalary from '@/components/salary/mysalary';
import myTaxReport from '@/components/salary/myTaxReport';

////考核测评
import assessScore from '@/components/assessment/assessScore/assessScore';
import lookup from '@/components/assessment/assessScore/lookup';
import submit from '@/components/assessment/assessScore/submit';
import assessRank from '@/components/assessment/assessRank/assessRank';
import check from '@/components/assessment/assessRank/check';
import rank from '@/components/assessment/assessRank/rank';





Vue.use(Router)
export default new Router({  
  routes: [
  	{
  	  path: '/',
      name: '/Login',
      component: Login
  	},
    {
      path: '/Index',
      name: '/Index',
      component: Index,
		  children: [  
		    { 
		    	path: "/",
		    	name: '/homepage',
		    	component: homepage 
		    },
		    {
		    	path: "/myInfo",
		    	name: '/myInfo',
		    	component: myInfo 
		    },
		    {
		    	path: "/Employeelist",
		    	name: '/Employeelist',
		    	component: Employeelist 
		    }, 
		    {
		    	path: "/Employeeinfo/:id",
		    	name: '/Employeeinfo',
		    	component: Employeeinfo 
		    },
		    {
		    	path: "/Warningmessagelist",
		    	name: '/Warningmessagelist',
		    	component: Warningmessagelist 
		    },
		    {
		    	path: "/Informmessagelist",
		    	name: '/Informmessagelist',
		    	component: Informmessagelist 
		    },
		    {
		    	path: "/Handlemessagelist",
		    	name: '/Handlemessagelist',
		    	component: Handlemessagelist 
		    },
		    {
		    	path: "/Mysalary",
		    	name: '/Mysalary',
		    	component: Mysalary 
		    },
		    {
		    	path: "/myTaxReport",
		    	name: '/myTaxReport',
		    	component: myTaxReport 
		    },
		    {
		    	path: "/assessScore",
		    	name: '/assessScore',
		    	component: assessScore 
		    },
		    {
		    	path:"/assessRank",
		    	name:'/assessRank',
		    	component:assessRank
		    },
		    {
		    	path:"/assessRank/check",
		    	name:'/assessRank/check',
		    	component:check
		    },
		    {
		    	path:"/assessRank/rank",
		    	name:'/assessRank/rank',
		    	component:rank
		    },
		    {
		    	path:"/assessScore/lookup",
		    	name:'/assessScore/lookup',
		    	component:lookup
		    },
		    {
		    	path:"/assessScore/submit",
		    	name:'/assessScore/submit',
		    	component:submit
		    }

		    
		  ]  
    }
    
  ]
})
