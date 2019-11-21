export function goodTime(str) {
  let nowTime = new Date().getTime();
  let oldTime = new Date(str).getTime();
  let difference = nowTime - oldTime;
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let year = month * 12;
  let _year = parseInt(difference / year, 10);
  let _month = parseInt(difference / month, 10);
  let _week = parseInt(difference / (7 * day), 10);
  let _day = parseInt(difference / day, 10);
  let _hour = parseInt(difference / hour, 10);
  let _min = parseInt(difference / minute, 10);
  // let _min = parseInt((difference % (1000 * 60 * 60)) / minute, 10);
  if (_year >= 1) { result = _year + '年前' }
  else if (_month >= 1 && _month < 12) { result = _month + '个月前' }
  else if (_week >= 1 && _week <= 7) { result = _week + '周前' }
  else if (_day >= 1 && _day < 7) { result = _day + '天前' }
  else if (_hour >= 1 && _hour < 24) { result = _hour + '个小时前' }
  else if (_min >= 1 && _min < 60) { result = _min + ' 分钟前' }
  else { result = '刚刚' }
  return result;
}
