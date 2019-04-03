/**
 * 人员验证
 * @author zhangyl5
 * @date 2018-03-06 15:15:00
 */

import {formatDate} from "./formatDate.js";

export {
	validateLegalEmpAge
}

/**
 * 校验是否达到法定雇佣年龄16周岁
 * @param birthdate 生日
 */
function validateLegalEmpAge(birthdate) {
	birthdate = formatDate(birthdate,'yyyy-MM-dd');
	let birthYear = Number(birthdate.substring(0, 4));
	let birthMonth = birthdate.substring(5, 7);
	let birthDay = birthdate.substring(8);
	let year16 = birthYear + 16;

	let date16 = new Date(Date.parse(year16 + '/' + birthMonth + '/' + birthDay));

	let now = new Date();

	if(date16 > now) {
		// 不够16岁
		return false;

	} else {
		return true;
	}

}