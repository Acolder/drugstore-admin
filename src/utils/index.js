export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      /* 编码decodeURIComponent */
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}
/**
 * 获取URL请求参数
 * @param {string} name
 */
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let url = window.location.href;
  let r = url.substr(url.indexOf('?') + 1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

/**
 * 获取URL参数
 */
export function getRequest() {
  let url = location.search; // 获取url中"?"符后的字串
  /* eslint-disable */
  let theRequest = new Object();
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

/**
 * 生成URL参数字符串
 * @param {object} obj
 */
export function getParamString(obj, url) {
  let paramStr = '';
  if (obj) {
      for(let key in obj) {
        paramStr += key + "=" + obj[key] + "&";
      };
  }
  let length = paramStr.length;
  paramStr = paramStr.substring(0, length-1);
  if (url) {
    if (url.indexOf('?') < 0) {
      url += '?' + paramStr;
    } else {
      if(url.endsWith('&')) {
        url += paramStr;
      } else {
        url += '&' + paramStr;
      }
    }
    return url;
  } else {
    return paramStr;
  }
}

/**
 * 去掉所有的html标记
 * @param {*} str
 */
export function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g, "");
}

/**
 * 判断浏览器
 */
export function browser() {
  let mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
  let webkit = /webkit/.test(navigator.userAgent.toLowerCase());
  let opera = /opera/.test(navigator.userAgent.toLowerCase());
  let msie = /msie/.test(navigator.userAgent.toLowerCase());
  return {
    mozilla,
    webkit,
    opera,
    msie
  };
}

/**
 * 生成guid
 */
export function newGuid() {
  let guid = '';
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    // if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) guid += '-';
  }
  return guid;
}
