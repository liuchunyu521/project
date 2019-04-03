
// 将时间戳转化为时间
export function formatDate (time, fmt) {
  if(!time){
    return '至今';
  }
  const date = new Date(time);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

export function dateStr2Long (strdate) {
  var date = new Date(strdate.replace(/-/g, '/'));
  return date.getTime();
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}
