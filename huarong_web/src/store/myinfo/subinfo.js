import axios from 'axios';
import {validForm} from '@/assets/js/validform.js';
export default {
    state: {
    	baseInfo: [], //基本信息
    	//工作记录表头
    	workTheadData: [{ param: ['begindate','enddate'], text: '起止时间' },
    		{ param: 'jobglbdef2', text: '任职终止日期' },
	    	{ param: 'org_name', text: '组织' },
	    	{ param: 'dept_name', text: '部门' },
	    	{ param: 'postname', text: '岗位' },
	    	{ param: 'jobname', text: '职务'},
	    	{ param: 'jobgradename', text: '职级' },
	    	{ param: 'jobrankname', text: '职等' },
	    	{ param: 'trnsevent', text: '异动事件' },
	    	{ param: 'trnstypename', text: '异动类型' },
	    	{ param: 'transtypereason', text: '异动原因' },
    		{ param: 'pk_psncl', text: '人员类别' },
    		{ param: 'jobglbdef3', text: '任职地点' },
	    	{ param: 'jobglbdef10', text: '是否备案' },
	    	{ param: 'series', text: '职务类别' },
	    	{ param: 'trial_flag', text: '是否试用' },
//	    	{ param: 'trial_type', text: '试用类型' },
//	    	{ param: 'jobglbdef12', text: '试用开始日期' },
//	    	{ param: 'jobglbdef13', text: '试用结束日期' },
	    	{ param: 'memo', text: '备注' },
	    	{ param: 'jobglbdef4', text: '任现职级时间' },
	    	{ param: 'jobglbdef5', text: '党委会通过时间' }],
	    //履历记录表头
	    jobTheadData: [{ param: ['begindate','enddate'], text: '起止时间', required: true },
	    	{ param: 'workcorp', text: '工作单位', required: true },
	    	{ param: 'workdept', text: '部门', required: true },
	    	{ param: 'workpost', text: '岗位' },
	    	{ param: 'workjob', text: '职务' },
	    	{ param: 'workduty', text: '主要职责' },
	    	{ param: 'glbdef2', text: '是否兼职' },
	    	{ param: 'glbdef3', text: '兼职所在机构' },
	    	{ param: 'certifier', text: '证明人' },
	    	{ param: 'workachive', text: '主要业绩' },
	    	{ param: 'work_addr', text: '工作地址' },
	    	{ param: 'dimission_reason', text: '离职原因' },
	    	{ param: 'linkphone', text: '联系电话' },
	    	{ param: 'certiphone', text: '证明人电话' },
	    	{ param: 'memo', text: '备注' }],
	    //身份证表头
	    psncertTheadData: [{ param: 'idtype', text: '证件类型', required: true},
	    	{ param: 'id', text: '证件号码', required: true },
	    	{ param: 'begindate', text: '发证日期' },
	    	{ param: 'enddate', text: '有效期限' },
	    	{ param: 'extend_org', text: '发证机构' },
	    	{ param: "iseffect", "text": "有效", },
		    { param: "isstart", "text": "默认", },
		    { param: "memo", "text": "说明" }],
	    //家庭信息表头
	    jiatingTheadData: [
	    	{ param: 'mem_relation', text: '与本人关系' ,required: true},
	    	{ param: 'mem_name', text: '家庭成员姓名' ,required: true},
	    	{ param: 'mem_birthday', text: '出生日期' },
	    	{ param: 'mem_corp', text: '工作单位' },
	    	{ param: 'glbdef1', text: '称谓' },
	    	// { param: 'glbdef2', text: '年龄' },
	    	{ param: 'glbdef3', text: '文化程度'},
	    	{ param: 'glbdef4', text: '配偶移居国外' },
	    	{ param: 'glbdef5', text: '子女移居国外' },
	    	{ param: 'glbdef9', text: '子女婚姻状况' },
	    	{ param: 'glbdef8', text: '子女婚配国籍' },
	    	{ param: 'glbdef6', text: '民族' },
	    	{ param: 'mem_job', text: '职务' },
	    	{ param: 'glbdef10', text: '职级' },
	    	{ param: 'relaaddr', text: '联系地址' },
	    	{ param: 'profession', text: '职业' },
	    	{ param: 'politics', text: '政治面貌' },
	    	{ param: 'glbdef7', text: '司法状况' },
	    	{ param: 'memo', text: '备注' }
	    ],
	    //合同信息表头
	    hetongTheadData: [{ param: 'conttype', text: '业务类型' },
	    	{ param: 'signdate', text: '业务发生日期' },
	    	{ param: 'termtype', text: '合同期限类型' },
	    	{ param: ['begindate','enddate'], text: '合同起止日期' },
	    	{ param: ['probegindate', 'probenddate'], text: '试用起止日期' },
	    	{ param: 'pk_majorcorp', text: '合同主体单位' },
	    	{ param: 'signaddr', text: '签订地点' },
		    { param: 'contractnum', text: '合同编号', "valid": [{ validator: validForm.cardno, trigger: 'change' }] },
		    { param: 'termmonth', text: '合同期限' },
		    { param: 'cont_unit', text: '合同期限单位' },
		    { param: 'ifprop', text: '需要试用' },
		    { param: 'promonth', text: '试用期限' },
		    { param: 'prop_unit', text: '试用期限单位' },
		    { param: 'pk_conttext', text: '劳动合同模板' },
		    { param: 'judgedate', text: '鉴证日期' },
		    { param: 'pk_org', text: '业务发生组织' },
	    	{ param: 'memo', text: '备注' },],
	    //学历信息表头
	    xueliTheadData: [{ param: ['begindate','enddate'], text: '起止时间', required: true },
	    	{ param: 'school', text: '学校', required: true },
	    	{ param: 'schooltype', text: '学校类型' },
		    { param: 'glbdef2', text: '专业院系' },
	    	{ param: 'major', text: '专业' },
	    	{ param: 'majortype', text: '学历专业类别' },
	    	{ param: 'education', text: '全日制学历' },
	    	{ param: 'pk_degree', text: '全日制学位' },
	    	{ param: 'studymode', text: '学习方式' },
	   	 	{ param: 'lasteducation', text: '全日制最高' },
		    { param: 'edusystem', text: '学制' },
		    { param: 'degreedate', text: '学位授予日期' },
		    { param: 'degreeunit', text: '学位授予单位' },
		    { param: 'educationctifcode', text: '学历证书编号' },
		    { param: 'certifcode', text: '学位证书编号' },
		    { param: 'glbdef5', text: '最高' },
		    { param: 'glbdef3', text: '非全日制最高学历' },
		    { param: 'glbdef4', text: '非全日制最高学位' },
		    { param: 'glbdef1', text: '非全日制最高' },
	    	{ param: 'memo', text: '备注' },],

	    //职称表头
	    zhichenTheadData: [
	    	// { param: ['begindate','enddate'], text: '起止时间', required: true },
	    	{ param: 'pk_techposttitle', text: '获得职称', required: true },
	    	{ param: 'begindate', text: '评定日期',required: true },
	    	{ param: 'enddate', text: '结束日期' },
	    	{ param: 'titlerank', text: '职称等级' },
	    	{ param: 'assorg', text: '评定机构' },
	    	{ param: 'certifcode', text: '证书编号' },
	    	{ param: 'tiptop_flag', text: '最高' },
		    { param: 'achive', text: '获得成就' },
		    { param: 'strongsuit', text: '专长' },
		    { param: 'summ', text: '简要说明' },
		    { param: 'glbdef1', text: '是否符合岗位要求' }],
	    //党派表头
	    dangpaiTheadData: [
	    	// { param: ['begindate','enddate'], text: '起止时间', required: true },
	    	{ param: 'partydate', text: '参加时间', required: true },
	    	{ param: 'partyname', text: '政治面貌及党籍情况', required: true },
	    	{ param: 'partyunit', text: '参加党派时所在单位', required: true },
	    	{ param: 'partyduedate', text: '转正时间', required: true },
		    { param: 'exreason', text: '异常原因' },
		    { param: 'exsort', text: '异常类别' },
		    // { param: 'glbdef2', text: '党龄'},
		    { param: 'partypsn', text: '介绍人1' },
		    { param: 'glbdef7', text: '介绍人2' },
		    { param: 'glbdef8', text: '介绍人3' }],

	    //奖励表头
	    jiangliTheadData: [{ param: 'encourdate', text: '奖励日期', required: true },
	    	{ param: 'encourtype', text: '奖励类型', required: true },
	    	{ param: 'encourrank', text: '奖励级别', required: true },
	    	{ param: 'encourorg', text: '奖励机构', required: true },
	    	{ param: 'encourmatter', text: '奖励事由', required: true },
	    	{ param: 'encourmeas', text: '奖励措施', required: true }],

	    //华融人员组织关系表头
	    psnOrgTheadData: [
	    	{ param: 'empforms', text: '用工形式'},
	    	{ param: 'begindate', text: '进入当前单位时间'},
	    	{ param: 'orgglbdef2', text: '司龄' },
	    	{ param: 'joinsysdate', text: '进入华融时间'},
	    	{ param: 'corpworkage', text: '华融工龄' }],
	   //考核记录
	    assTheadData:[
	    	{ param: 'workname', text: '绩效等级'},
	    	{ param: 'period_year', text: '绩效年度'}],

	    //职业资格
	    zhiyeTheadData:[
	    	{ param: 'pk_perank', text: '职业资格'},
	    	{ param: 'occupation', text: '职业'},
	    	{ param: 'worklevel', text: '资格等级'},
	    	{ param: 'certificatenum', text: '证书编号'},
	    	{ param: 'workunitname', text: '评定机构'},
	    	{ param: 'workdate', text: '获得时间'},
	    	{ param: 'glbdef1', text: '失效日期'},
	    	{ param: 'istop', text: '是否最高'},
	    	{ param: 'remark', text: '备注'}],

	    //紧急联系人
	    jinjiTheadData: [{ param: 'linkman', text: '联系人' },
		    { param: 'relation', text: '与联系人关系' },
		    { param: 'ismain', text: '主要联系人' },
		    { param: 'linkaddr', text: '联系地址' },
		    { param: 'postalcode', text: '邮政编码' },
		    { param: 'officephone', text: '办公电话' },
		    { param: 'homephone', text: '家庭电话' },
		    { param: 'mobile', text: '手机' },
		    { param: 'fax', text: '传真' },
		    { param: 'email', text: '电子邮件' }],
	    //语言能力
	    yuyanTheadData: [{ param: 'langsort', text: '语种' },
		    { param: 'langskill', text: '语种熟练程度' },
		    { param: 'langlev', text: '掌握语种水平的级别' },
		    { param: 'certifname', text: '证书名称' },
		    { param: 'certifcode', text: '证书编号' },
		    { param: 'certifdate', text: '获证日期' },
		    { param: 'memo', text: '备注' }],


		//培训记录
		peixunTheadData: [
	    	{ param: 'act_name', text: '培训活动名称'},
	    	{ param: 'begindate', text: '培训开始日期'},
	    	{ param: 'enddate', text: '培训结束日期'},
	    	{ param: 'tra_type', text: '培训类型'},
	    	{ param: 'tra_mode', text: '培训方式'},
	    	{ param: 'activetype', text: '活动类别'},
	    	{ param: 'traim', text: '培训目标'},
	    	{ param: 'tra_content', text: '培训内容'},
	    	{ param: 'trm_location', text: '培训地点'},
	    	{ param: 'tra_time', text: '培训学时'},
	    	{ param: 'tra_cost', text: '培训费用'},
	    	{ param: 'contcode', text: '培训协议编号'},
	    	{ param: 'trm_certif_code', text: '培训证书编号'},
	    	{ param: 'trm_certif_name', text: '培训证书名称'},
	    	{ param: 'certificate_date', text: '获证日期'},
	    	{ param: 'certificate_unit', text: '颁证单位'},
	    	{ param: 'source_type', text: '参训来源'},
	    	{ param: 'signon_dt', text: '报名日期'},
	    	{ param: 'taketrm_method', text: '参训方式'},
	    	{ param: 'entrepreneur', text: '主办单位'},
	    	{ param: 'assist_unit', text: '协办单位'},
	    	{ param: 'purveyor', text: '承办单位'},
	    	{ param: 'isallduty', text: '全勤'},
	    	{ param: 'absence_count', text: '缺勤次数'},
	    	{ param: 'ass_result', text: '考核成绩'},
	    	{ param: 'ass_option', text: '考核评价'},
	    	{ param: 'memo', text: '备注'}],

	   	//出国境情况
	    chuguoTheadData: [
	    	// { param: 'begindate', text: '起始日期'},
	    	// { param: 'enddate', text: '终止日期'},
	    	{ param: 'abroaddate', text: '出国(出境)时间'},
	    	{ param: 'abroadway', text: '出国(出境)目的'},
	    	{ param: 'abroadarea', text: '所去国家(地区)'},
	    	{ param: 'abroadunit', text: '所去单位'},
	    	{ param: 'abroadout', text: '派出单位'},
	    	{ param: 'abroadgroup', text: '团组名称'},
	    	{ param: 'abroadoutlay', text: '经费来源'},
	    	{ param: 'abroadpro', text: '审批单位'},
	    	{ param: 'abroadprodate', text: '审批时间'},
	    	{ param: 'abroadnumber', text: '审批文号'},
	    	{ param: 'abroadreturn', text: '回国时间'},
	    	{ param: 'abroadex', text: '异常情况'}],

		//--------以下是弹框卡片--------
	    //履历表单配置
	    jobFormConfig: [{ "id": "begindate", "text": "开始日期", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }]},
	    	{ "id": "enddate", "text": "结束日期", "type": "date", "valid": [{ required: false,validator: validForm.ymd, trigger: 'blur' }]},
	    	{ "id": "workcorp", "text": "工作单位", "valid": [{ required: true, message: '不能为空', trigger: 'change' }]},
	    	{ "id": "workdept", "text": "部门", "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "workpost", "text": "岗位" },
	    	{ "id": "workjob", "text": "职务" },
	    	{ "id": "certifier", "text": "证明人" },

	    	{ "id": "workduty", "text": "主要职责" },
	    	{ "id": "glbdef2", "text": "是否兼职", "type": "radio", "typedata": [{"Y": "是", "N": "否" }] },
	    	{ "id": "glbdef3", "text": "兼职所在机构" },
	    	{ "id": "workachive", "text": "主要业绩" },
	    	{ "id": "work_addr", "text": "工作地址" },
	    	{ "id": "dimission_reason", "text": "离职原因" },
	   	 	// { "id": "linkphone", "text": "联系电话", "valid": [{ validator: validForm.tel, trigger: 'change' }] },
	   	 	{ "id": "linkphone", "text": "联系电话" },
	    	// { "id": "certiphone", "text": "证明人电话", "valid": [{ validator: validForm.tel, trigger: 'change' }] },
	    	{ "id": "certiphone", "text": "证明人电话" },
	    	{ "id": "memo", "text": "备注","type": "textarea" }],
	    //合同表单配置
	    hetongFormConfig: [{ "id": "conttype", "text": "业务类型" },
	    	{ "id": "begindate", "text": "合同开始日期", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }] },
	    	{ "id": "enddate", "text": "合同结束日期", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }] },
	    	{ "id": "signdate", "text": "业务发生日期", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }]  },
	    	{ "id": "pk_majorcorp", "text": "合同主体单位" },
	    	{ "id": "termtype", "text": "合同期限类型" },
	    	{ "id": "memo", "text": "备注","type": "textarea" },
	    	{ "id": "probegindate", "text": "试用结束日期", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }]  },
	    	{ "id": "probenddate ", "text": "试用结束日期", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }]  },
	    	{ "id": "signaddr", "text": "签订地点" },
		    { id: 'contractnum', text: '合同编号' },
		    { id: 'termmonth', text: '合同期限' },
		    { id: 'cont_unit', text: '合同期限单位' },
		    { id: 'ifprop', text: '需要试用' },
		    { id: 'promonth', text: '试用期限' },
		    { id: 'prop_unit', text: '试用期限单位' },
		    { id: 'pk_conttext', text: '劳动合同模板' },
		    { id: 'judgedate', text: '鉴证日期' },
		    { id: 'pk_org', text: '业务发生组织' }
		    ],
	    //学历表单配置
	    xueliFormConfig: [
	    	{ id: "begindate", "text": "入学日期", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }] },
	    	// { id: "enddate", "text": "毕业日期", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }] },
	    	{ id: "enddate", "text": "毕业日期", "type": "date" },
	    	{ id: "school", "text": "学校", "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ id: 'schooltype', text: '学校类型' },
	    	{ id: 'glbdef2', text: '专业院系' },
	    	{ id: "major", "text": "专业" },
	    	{ id: 'majortype', text: '学历专业类别', "type": "refer", "typedata": [{"code": "HR010_0xx"}] },
	    	{ id: "education", "text": "全日制学历", "type": "refer", "typedata": [{"code": "HR008_0xx"}] },
	    	{ id: "pk_degree", "text": "全日制学位", "type": "refer", "typedata": [{"code": "HR009_0xx"}] },
	    	{ id: "studymode", "text": "学习方式", "type": "refer", "typedata": [{"code": "HR023_0xx"}] },
	    	{ id: "lasteducation", "text": "全日制最高学历", "type": "radio", "typedata": [{"Y": "是", "N": "否" }] },
	    	// { id: 'edusystem', text: '学制' },
	    	{ id: 'edusystem', text: '学制',"valid": [{ validator: validForm.num, trigger: 'change' }] },
		    { id: 'degreedate', text: '学位授予日期', "type": "date" },
		    { id: 'degreeunit', text: '学位授予单位' },
		    { id: 'educationctifcode', text: '学历证书编号'},
		    // { id: 'certifcode', text: '学位证书编号', "valid": [{ validator: validForm.cardno, trigger: 'change' }] },
		    { id: 'certifcode', text: '学位证书编号'},
		    { id: 'glbdef5', text: '最高', "type": "radio", "typedata": [{"Y": "是", "N": "否" }] },
		    { id: 'glbdef3', text: '非全日制最高学历', "type": "refer", "typedata": [{"code": "HR008_0xx"}] },
		    { id: 'glbdef4', text: '非全日制最高学位', "type": "refer", "typedata": [{"code": "HR009_0xx"}] },
		    { id: 'glbdef1', text: '非全日制最高', "type": "radio", "typedata": [{"Y": "是", "N": "否" }] },
		    { id: 'memo', text: '备注' ,"type": "textarea"}
	    ],
	    //身份证表单配置
	    psncertFormConfig: [{ "id": "idtype", "text": "证件类型", "type": "refer", "typedata": [{"code": "idtype"}], "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "id", "text": "证件号码", "valid": [{ validator: validForm.cardno, required: true, trigger: 'change' }] },
	    	{ "id": "extend_org", "text": "发证机构" },
	    	{ "id": "begindate", "text": "发证日期", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }] },
	    	{ "id": "enddate", "text": "有限期限", "type": "date" },
		    { "id": "iseffect", "text": "有效", "type": "radio", "typedata": [{"Y": "是", "N": "否" }]  },
		    { "id": "isstart", "text": "默认", "type": "radio", "typedata": [{"Y": "是", "N": "否" }]  },
		    { "id": "memo", "text": "说明" ,"type": "textarea"}],
	    //家庭信息表单配置
	    jiatingFormConfig: [{ "id": "mem_relation", "text": "与本人关系", "type": "refer", "typedata": [{"code": "HR024_0xx"}], "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "mem_name", "text": "家庭成员姓名", "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "mem_corp", "text": "工作单位" },
	    	{ "id": "mem_birthday", "text": "出生日期", "type": "date", "valid": [{ validator: validForm.ymd,required: true, trigger: 'blur' }] },
	    	{ id: 'glbdef1', text: '称谓' },
	    	// { id: 'glbdef2', text: '年龄',"valid": [{ validator: validForm.num, required: true, trigger: 'change' }] },
	    	// { id: 'glbdef2', text: '年龄',"disabled":true,"valid": [{ validator: validForm.num, required: false, trigger: 'change' }] },
	    	{ id: 'glbdef3', text: '文化程度' },
	    	{ id: 'glbdef4', text: '配偶移居国外', "type": "radio", "typedata": [{"Y": "是", "N": "否" }]  },
	    	{ id: 'glbdef5', text: '子女移居国外', "type": "radio", "typedata": [{"Y": "是", "N": "否" }]  },
	    	{ id: 'glbdef9', text: '子女婚姻状况', "type": "refer", "typedata": [{"code": "HR001_0xx"}]},
	    	{ id: 'glbdef8', text: '子女婚配国籍', "type": "refer", "typedata": [{"code": "country", "cascPrevKey": 'pk_country'}] },
	    	{ id: 'glbdef6', text: '民族',"type": "refer", "typedata": [{"code": "HR002_0xx"}] },
	    	{ id: 'mem_job', text: '职务' },
	    	{ id: 'glbdef10', text: '职级' },
	    	{ id: 'relaaddr', text: '联系地址' },
	    	{ id: 'profession', text: '职业' },
	    	{ id: 'politics', text: '政治面貌', "type": "refer", "typedata": [{"code": "HR011_0xx"}] },
	    	{ id: 'glbdef7', text: '司法状况' },
	    	{ id: 'memo', text: '备注',"type": "textarea" }],
	    //职称表单配置
	    zhichenFormConfig: [{ "id": "begindate", "text": "评定日期", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }] },
	    	// { "id": "enddate", "text": "结束时间", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }] },
	    	{ "id": "enddate", "text": "结束时间", "type": "date" },
	    	{ "id": "pk_techposttitle", "text": "获得职称", "type": "tech", "typedata": [{"code": "HR019_0xx"}], "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "titlerank", "text": "职称等级", "type": "refer", "typedata": [{"code": "HR025_0xx"}] },
	    	{ "id": "assorg", "text": "评定机构" },
	    	{ "id": "certifcode", "text": "证书编号"},
	    	{ "id": "tiptop_flag", "text": "最高", "type": "radio", "typedata": [{"Y": "是", "N": "否" }] },
	    	{ id: 'achive', text: '获得成就' },
		    { id: 'strongsuit', text: '专长' },
		    { id: 'summ', text: '简要说明',"type": "textarea" },
		    { id: 'glbdef1', text: '是否符合岗位要求', "type": "radio", "typedata": [{"Y": "是", "N": "否" }] }],
	    //党派表单配置
	    dangpaiFormConfig: [
	    	// { "id": "begindate", "text": "开始时间", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }] },
	    	// { "id": "enddate", "text": "结束时间", "type": "date", "valid": [{ validator: validForm.ymd, trigger: 'blur' }] },
	    	{ "id": "partydate", "text": "参加时间", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }] },
	    	// { "id": "partyduedate", "text": "转正时间", "type": "date", "valid": [{required: true, validator: validForm.ymd, trigger: 'blur' }]},
	    	{ "id": "partyduedate", "text": "转正时间", "type": "date"},
	    	{ "id": "partyname", "text": "政治面貌及党籍情况", "type": "refer", "typedata": [{"code": "HR011_0xx"}], "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "partyunit", "text": "参加党派时所在单位", "valid": { required: true, message: '不能为空'} },
	    	{ "id": "partypsn", "text": "介绍人1"},
	    	{ id: 'exreason', text: '异常原因' },
		    { id: 'exsort', text: '异常类别',"type": "refer", "typedata": [{"code": "HR013_0xx"}]},
		    // { id: 'glbdef2', text: '党龄',"disabled": true},
		    { id: 'glbdef7', text: '介绍人2' },
	    	{ id: 'glbdef8', text: '介绍人3' }],
	    //奖励表单配置
	    jiangliFormConfig: [{ "id": "encourdate", "text": "奖励日期", "type": "date", "valid": [{ validator: validForm.ymd, required: true, trigger: 'blur' }] },
	    	{ "id": "encourtype", "text": "奖励类型", "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "encourrank", "text": "奖励级别", "type": "refer", "typedata": [{"code": "HR026_0xx"}], "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "encourorg", "text": "奖励机构", "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": "encourmatter", "text": "奖励事由", "valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
	    	{ "id": 'encourmeas', text: '奖励措施' }],

	    //紧急联系人表单配置
	    jinjiFormConfig: [{ id: 'linkman', text: '联系人',"valid": [{ required: true, message: '不能为空', trigger: 'change' }] },
		    { id: 'relation', text: '与联系人关系' },
		    { id: 'ismain', text: '主要联系人',"type": "radio", "typedata": [{"Y": "是", "N": "否" }] },
		    { id: 'linkaddr', text: '联系地址' },
		    { id: 'postalcode', text: '邮政编码',"valid": [{required: false,validator: validForm.num, trigger: 'change' }]  },
		    { id: 'officephone', text: '办公电话',"valid": [{required: false,validator: validForm.tel, trigger: 'change' }] },
		    { id: 'homephone', text: '家庭电话',"valid": [{required: false, validator: validForm.tel, trigger: 'change' }] },
		    { id: 'mobile', text: '手机',"valid": [{ required: true,validator: validForm.phone,trigger: 'change' }]},
		    { id: 'fax', text: '传真',"valid": [{ required: false,validator: validForm.tel, trigger: 'change' }] },
		    { id: 'email', text: '电子邮件',"valid": [{ required: false,validator: validForm.email, trigger: 'change' }] }],
	    //语言能力表单配置
	    yuyanFormConfig: [
	    	{ id: 'langsort', text: '语种',"type": "refer", "typedata": [{"code": "HR014_0xx"}] },
		    { id: 'langskill', text: '语种熟练程度',"type": "refer", "typedata": [{"code": "HR015_0xx"}] },
		    { id: 'langlev', text: '掌握语种水平的级别' },
		    { id: 'certifname', text: '证书名称' },
		    { id: 'certifcode', text: '证书编号'},
		    { id: 'certifdate', text: '获证日期',"type": "date" },
		    { id: 'memo', text: '备注' ,"type": "textarea"}],

	   	//出国境情况表单配置
	    chuguoFormConfig: [
	    	// { id: 'begindate', text: '起始日期',"type": "date"},
	    	// { id: 'enddate', text: '终止日期',"type": "date"},
	    	{ id: 'abroaddate', text: '出国(出境)时间',"type": "date","valid": [{ required: true, message: '不能为空', trigger: 'change' }]},
	    	{ id: 'abroadway', text: '出国(出境)目的',"type": "refer", "typedata": [{"code": "HRHI011_0xx"}],"valid": [{ required: true, message: '不能为空', trigger: 'change' }]},
	    	{ id: 'abroadarea', text: '所去国家(地区)', "type": "refer", "typedata": [{"code": "country" }],"valid": [{ required: true, message: '不能为空', trigger: 'change' }]},
	    	{ id: 'abroadunit', text: '所去单位'},
	    	{ id: 'abroadout', text: '派出单位'},
	    	{ id: 'abroadgroup', text: '团组名称'},
	    	{ id: 'abroadoutlay', text: '经费来源'},
	    	{ id: 'abroadpro', text: '审批单位'},
	    	{ id: 'abroadprodate', text: '审批时间',"type": "date"},
	    	{ id: 'abroadnumber', text: '审批文号'},
	    	{ id: 'abroadreturn', text: '回国时间',"type": "date"},
	    	{ id: 'abroadex', text: '异常情况'}]
    },
    mutations: {
        SET_BASE_INFO( state, { list } ){
        	state.baseInfo = list;
        }
    },

    actions: {
    	//请求基本信息数据
    	loadbaseinfo({commit}, url) {
            axios.get( url ).then((response) => {
				commit('SET_BASE_INFO', { list: response.data } )
	    	}).catch((err) => {

			});
        }
    }
}
