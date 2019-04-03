/**
 * Created by yangchd on 2018/4/17.
 * 根据期限（月）和开始时间计算结束时间
 */

export {
	dateAddMonth
}

function dateAddMonth(date, month) {
	let now = new Date(date);
	let intYear = now.getFullYear();
	let intMonth = now.getMonth() + 1 + parseInt(month);
	let intDay = now.getDate();

	// 先进行月份的进位
	while(intMonth > 12) {
		intYear++;
		intMonth = intMonth - 12;
	}
	// 如果是每月一号，结束应该是上一个月的最后一天
	if(intDay === 1) {
		intMonth--; //减少一个月
		if(intMonth === 0) {
			intYear--; //0:减少一年
			intMonth = 12;
			intDay = 31;
		} else if(intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) {
			intDay = 30; //4,6,9,11:30天
		} else if(intMonth === 2) {
			intDay = 28; //2:28/29
			if(intYear % 4 === 0) {
				intDay = 29;
			}
		} else {
			intDay = 31; //1,3,5,7,8,10,12 :31天
		}
	} else {
		if(intMonth === 2 && intDay > 28) {
			if(intYear % 4 === 0) {
				intDay = 29;
			} else {
				intDay = 28;
			}
		}
		intDay--;
	}
	let strMonth = (intMonth) < 10 ? "0" + (intMonth).toString() : (intMonth).toString();
	let strDay = (intDay) < 10 ? "0" + (intDay).toString() : (intDay).toString();
	let strEndDate = intYear + "-" + strMonth + "-" + strDay;
	return new Date(strEndDate);
}