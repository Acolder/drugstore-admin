// export function formatDate(date, time) {
//   let fmt = time;
//   if (/(y+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
//   }
//   let o = {
//     'M+': date.getMonth() + 1,
//     'd+': date.getDate(),
//     'h+': date.getHours(),
//     'm+': date.getMinutes(),
//     's+': date.getSeconds()
//   };
//   for (let k in o) {
//     if (new RegExp(`(${k})`).test(fmt)) {
//       let str = `${o[k]}`;
//       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
//     }
//   }
//   return fmt;
// }

// function padLeftZero(str) {
//   return ('00' + str).substr(str.length);
// }
function add0(m) { return m < 10 ? '0' + m : m }
// 时间戳转化成时间格式
export function formatDate(timestamp) {
  let time = new Date(timestamp);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
}

export function getMaxDate(y, m) {
  let month = Number(m);
  let year = Number(y);
  if (Number.isNaN(year) || Number.isNaN(month)) {
    return 0;
  }
  let leap = (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0) ? true : false;
  if (month === 2) {
    if (leap) {
      return 29;
    } else {
      return 28;
    }
  } else if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
    return 31;
  } else {
    return 30;
  }
}

export function formatMonth(m, p, l) {
  let t = Object.prototype.toString.call(m);
  if (t !== '[object Date]') {
    return '1970-01-01 00:00:00';
  }
  let year = m.getFullYear();
  let month = m.getMonth() + 1;
  let date = 1;
  let time = ' 00:00:00';
  if (p === 'end') {
    date = getMaxDate(year, month);
    time = ' 23:59:59';
  }
  if (l) {
    return year + '-' + add0(month) + '-' + add0(date) + time;
  } else {
    return year + '-' + add0(month) + '-' + add0(date);
  }
}
