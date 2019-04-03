/*======== ajaxData 异步加载数据 ========
 * @param: url 数据源地址
 * @param: param 请求参数
 * @param: call 请求成功之后的回调
 * */
import axios from 'axios';
import Cookies from 'js-cookie';
import Qs from 'qs';
import store from 'store';

//console.log(UserInfo)
export function ajaxData(url, param, call) {
	if(typeof(arguments[1]) == "function") { //没有参数的时候发get请求

		axios({
			method: 'post',
			url: url
		}).then((response) => {
			var _data = response.data;

			if(_data.flag == "0") {
				param(_data.data);
			} else if(_data.flag == "1") {
				this.$message.error(_data.des);
			};
		}).catch((err) => {
			var _status = err.request.status;
			if(_status && _status == 500) {
				this.$message.error( '网络错误' ); 
			} else {
				this.$message.error( _status ); 
			};
		});

	} else { //有参数的时候发post请求     
			axios.post(url, Qs.stringify(param), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
				}
			}).then((response) => {
				var _data = response.data;
				if(_data.flag == "0") {
					call(_data.data);
				} else if(_data.flag == "1") {
					this.$message.error(_data.des);
				};
			}).catch((err) => {
				if(err.request) {
					var _status = err.request.status;
					if(_status && _status == 500) {
						this.$message.error( '网络错误' ); 
					} else {
						this.$message.error( _status ); 
					};
				};
			});
	};
};

/*==== 通过比较原始数据和当前数据，获取被更新的数据 ====*/
export function getUpdateParam(sdata, cdata) {
	var _tempdata = {};
	for(var i in cdata) {
		if(cdata[i] != sdata[i]) {
			_tempdata[i] = cdata[i];
		};
	};
	return _tempdata;
};