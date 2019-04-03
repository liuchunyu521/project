import axios from 'axios';  

export default {
    state: {
    	//弹框显示的字段，根据单据类型的不同显示
    	entryrequest: {//入职申请字段
    		"billCode":"申请单编码",
    		"name":'入职人',
    		"deptname":"入职部门",
    		"postname":"入职岗位",
    		"jobname":"入职职务",
			"psntype":"人员类别",
			"begindate":"入职日期"
    	},
    	becomerequest:{
    		"billCode":"申请单编码",
    		"name":'转正人',
    		"probation_type":"试用类型",
			"begin_date":"试用开始时间",
			"end_date":"试用结束时间",
			"trialresult":"试用结果",
			"orgname":"转正后组织",
			"deptname":"转正后部门",
			"postname": "转正后岗位",
			"jobname":"转正后职务",
			"jobgradename":"转正后职级",
			"psntype":"转正后人员类别"
    	},
    	tunerequest:{
    		"billCode":"申请单编码",
    		"name":'调配人',
    		"stapply_mode":"调配方式",
			"trnstypename":"调配业务类型",
			"reason":"调配原因",
			"orgname":"调配后组织",
			"deptname":"调配后部门",
			"postname":"调配后岗位",
			"jobname":"调配后职务",
			"levelname":"调配后职级",
			"psntype":"调配后人员类别"
    	},
    	partjobrequest:{
    		"billCode":"申请单编码",
    		"name":'兼职人',
    		"orgname":"兼职组织",
			"deptname":"兼职部门",
			"postname":"兼职岗位",
			"jobname":"兼职职务",
			"levelname":"兼职职级",
			"jobrankname":"兼职职等",
			"psntype":"兼职人员类别",
			"jobtype":"兼职任职类型",
			"begindate":"兼职日期"
    	},
    	leaverequest:{
    		"billCode":"申请单编码",
    		"name":'离职人',
    		"orgname":"组织",
			"deptname":"部门",
			"postname":"职位",
			"jobname":"职务",
			"trnstypename":"离职业务类型",
			"reason":"离职原因",
			"memo":"离职说明",
			"effectdate":"离职日期"
    	}
    },
    mutations: {  
    },
    actions: { 
    }
}