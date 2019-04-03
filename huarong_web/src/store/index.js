import Vue from 'vue'
import Vuex from 'vuex' 
import BaseInfo from './myinfo/baseinfo'
import Information from './myinfo/subinfo' 
import Msgdata from './msgdata/dialogshow' 

Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
    state: {
    	// 后台接口地址
    	Interface: {
    		'login': '/service/hrweb/login',//登录
    		'sm': '/service/hrweb/sm',//系统管理
    		'msglist': '/service/hrweb/msg',//消息中心接口
    		'hi': '/service/hrweb/hi',//人员信息
    		'wa':'/service/hrweb/wa', //薪资
            'as':'/service/hrweb/as',//绩效评分
            'grade':'/service/hrweb/grade' //绩效评级  	
    	},
    	
    	//固定的参照类型数据
    	ReferInit: { 
    		//身份证类型
    		'idtype': [
    			{'code': 'CN01', 'name': '身份证', 'pk_defdoc': '1001Z01000000000AI36'},
    			{'code': 'CN02', 'name': '护照', 'pk_defdoc': '1001Z01000000000CHUJ'},
    			{'code': 'CN03', 'name': '回乡证', 'pk_defdoc': '1001Z01000000000CHUL'},
    			{'code': 'CN04', 'name': '外国人永久居留证', 'pk_defdoc': '1001Z01000000000CHUP'},
    			{'code': 'HK01', 'name': '香港居民身份证', 'pk_defdoc': '1001Z01000000000CHUK'},
    			{'code': 'MO01', 'name': '澳门居民身份证', 'pk_defdoc': '1001Z01000000000CHUN'},
    			{'code': 'TW01', 'name': '台湾身份证', 'pk_defdoc': '1001Z01000000000CHUM'},
    			{'code': 'TW02', 'name': '台胞证', 'pk_defdoc': '1001Z01000000000CHUO'}
    		],
    		//血型
    		'bloodtype': [
    			{'code': '1', 'name': 'O', 'pk_defdoc': '1'},
    			{'code': '2', 'name': 'A', 'pk_defdoc': '2'},
    			{'code': '3', 'name': 'B', 'pk_defdoc': '3'},
    			{'code': '4', 'name': 'AB', 'pk_defdoc': '4'},
    			{'code': '5', 'name': '其他', 'pk_defdoc': '5'}
    		]
    	}
    },
    modules: { 
        Information, //员工信息子集相关配置数据
        BaseInfo,//员工基本信息配置数据
        Msgdata
    }
});   