/**
 * 身份证验证
 * 规则：
 * 	15位：1.只允许是数字；2.生日符合实际
 * 	18位：1.前17位是数字；2.生日符合实际；3.校验位
 * @author zyl
 * @date 2018-02-28 09:15:00
 */

import {dateStr2Long} from "./formatDate.js";

export { //很关键
	IDCardValidate
}

function IDCardValidate(id) {
	
	let result = {
		status: false,
		msg: '',
		sex: 2,
		birthdate: '',
	};
	
	let province = {
		11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
		21: "辽宁", 22: "吉林", 23: "黑龙江",
		31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
		41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
		50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
		61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
		71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
	};

	id = trimAll(id);

	// 15位
	if(15 === id.length) {
		var reg = /(^\d{15}$)/;
		if(false === reg.test(id)) {
			result.msg = "15位身份证号中存在非数字！";
			result.status = false;
			return result;
		}
		
		if(!checkProvince(id, province)) {
			result.msg = "15位身份证号的省份不正确！";
			result.status = false;
			return result;
		}
		
		let vb = verifyBirthday("19" + id.substring(6, 12));
		if(0 === vb) {
			result.status = true;
			result.msg = "验证通过";
			if(parseInt(id.charAt(14)) % 2 == 0) {
				result.sex = 2; // 女
			} else {
				result.sex = 1; // 男
			}
			
			result.birthdate = dateStr2Long("19" + id.substring(6, 8) + "-" 
							 + id.substring(8, 10) + "-" + id.substring(10, 12));
			return result;
		} else if(1 === vb) {
			result.msg = "身份证号中日期不正确！";
			result.status = false;
			return result;
		} else if(2 === vb) {
			result.msg = "身份证号中生日不正确！";
			result.status = false;
			return result;
		}
		
	} else if(18 === id.length) {	// 18位
		
		var reg = /(^\d{17}$)/;
		if(false === reg.test(id.substring(0, 17))) {
			result.msg = "18位身份证号的前17位存在非数字！";
			result.status = false;
			return result;
		}
		
		let lastReg = /(^(\d|X)$)/;
		if(false === lastReg.test(id.charAt(17))) {
			result.msg = "18位身份证号的末位必须是0-9或X！";
			result.status = false;
			return result;
		}
		
		if(!checkProvince(id, province)) {
			result.msg = "15位身份证号的省份不正确！";
			result.status = false;
			return result;
		}
		
		let vb = verifyBirthday(id.substring(6, 14));
		if(0 === vb) {
			
			result.birthdate = dateStr2Long(id.substring(6, 10) + "-" 
							 + id.substring(10, 12) + "-" + id.substring(12, 14));
			
			if(checkParity(id)) {
				result.status = true;
				result.msg = "验证通过";
				if(parseInt(id.charAt(16)) % 2 == 0) {
					result.sex = 2; // 女
				} else {
					result.sex = 1; // 男
				}
				
				return result;
			} else {
				result.msg = "当前证件号不是合法的身份证号！";
				result.status = false;
				return result;
			}
		} else if(1 === vb) {
			result.msg = "身份证号中日期不正确！";
			result.status = false;
			return result;
		} else if(2 === vb) {
			result.msg = "身份证号中生日不正确！";
			result.status = false;
			return result;
		}
		
	} else {
		result.msg = "输入的身份证不是15或18位！";
		result.status = false;
	}
	return result;
}

/**
 * 取身份证前两位，校验省份
 * @param id
 * @param vprovince
 */
function checkProvince(id, vprovince) {
	var province = id.substr(0, 2);
	if(undefined == vprovince[province]) {
		return false;
	}
	return true;
};

/**
 * 校验生日
 * @param birth
 */
function verifyBirthday(birth) {

	let birthYear = birth.substring(0, 4);
	let birthMonth = birth.substring(4, 6);
	let birthDay = birth.substring(6);

	birthYear = Number(birthYear);
	birthMonth = Number(birthMonth);
	birthDay = Number(birthDay);

	if(birthMonth < 1 || birthMonth > 12) {
		return 1;
	}

	let md = getDate(birthYear, birthMonth);
	if(birthDay < 1 || birthDay > md) {
		return 1;
	}
	
	let now = new Date();
	let nowYear = now.getFullYear();
	let nowMonth = now.getMonth() + 1;
	let nowDay = now.getDate();

	// 年之差
	let yearDiff = nowYear - birthYear;
	if(0 > yearDiff) {
		return 2;
	} else if(0 == yearDiff) {
		// 月之差
		let monthDiff = nowMonth - birthMonth;
		if(0 > monthDiff) {
			return 2;
		} else if(0 == monthDiff) {
			// 日之差
			let dayDiff = nowDay - birthDay;
			if(0 > dayDiff) {
				return 2;
			} else {
				return 0;
			}
		}
	} else if(100 < yearDiff) {// 大于100岁了……
		return 2;
	} else {
		return 0;
	}

}

/**
 * 根据年、月获取该月的天数
 * @param year
 * @param month
 */
function getDate(year, month) {
	let mds = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if(2 == month) {
		if(0 == year % 4) {
			if(0 == year % 100) {
				if(0 == year % 400) {
					return 29;
				}
				return 28;
			}
			return 29;
		}
		return 28;
	}
	return mds[month - 1];
	
}

/**
 * 校验身份证的校验位
 * @param id 身份证号码
 * @return
 */
function checkParity(id) {

	// 加权因子
	let wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	// 身份证验证位值
	let validateCode = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');

	let sum = 0;

	// 加权求和
	for(let i = 0; i < 17; i++) {
		sum += wi[i] * id[i];
	}

	let mo = sum % 11;
	let addcode = validateCode[mo];

	if(id.charAt(17) === addcode) {
		return true;
	} else {
		return false;
	}

}

/**
 * 去掉字符串中的所有空格
 * @param str 字符串
 */
function trimAll(str){  
	return str.replace(/\s+/g, "");  
}
