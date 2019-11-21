import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import { getToken, base64Encrypt, base64Decrypt, serializeData } from '@/utils/auth';
// import {
//   getToken,
//   aesEncrypt,
//   getNoncestr,
//   getTimestamp,
//   // getSign,
//   // setAccesstoken,
//   getAccesstoken,
//   // removeAccesstoken,
//   serializeData,
//   base64Encrypt,
//   base64Decrypt,
//    getAccount
// } from '@/utils/auth';


// create an axios instance
const service = axios.create({
  baseURL: process.env.MALL_BASE_HOST,
  timeout: 15000
});
// const appid = '8145955969';
// const appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';
// const accessTokenName = 'accessToken';
// function get_access_token() {
//   let accessToken = '';
//   let token = getToken();
//   accessToken = getAccesstoken(accessTokenName);
//   if (accessToken) {
//     return accessToken;
//   }
//   let requestObj;
//   if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
//     requestObj = new XMLHttpRequest();
//   } else { // code for IE6, IE5
//     /* eslint-disable */
//     requestObj = new ActiveXObject('Microsoft.XMLHTTP');
//   }
//   let  queryData= {
//     appid: "8145955969",
//     appsecret: "l8y70yhm8vonwc904i6ugjs3s1zfqo77"
//   }
//   let url = `${process.env.MALL_BASE_HOST}/mall_manage/back/token/getToken?appid=${aesEncrypt(appid)}&appSecret=${aesEncrypt(appSecret)}`;
//   requestObj.open('get', url, true);
//   // requestObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
//   requestObj.setRequestHeader("appid","8145955969");
//   requestObj.setRequestHeader("appsecret","l8y70yhm8vonwc904i6ugjs3s1zfqo77");
//   requestObj.setRequestHeader("usertoken",token);
//   requestObj.send('');
//   console.log(requestObj.response);
//   let obj = base64Decrypt(requestObj.response);
//   console.log(obj);
//   if (typeof obj !== 'object') {
//     obj = JSON.parse(obj);
//   }
//   if (obj.code === 0) {
//     accessToken = obj.data.accesstoken;
//   }
//   if (accessToken) {
//     setAccesstoken(accessTokenName, accessToken);
//   }
//   return accessToken;
// }

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  let token = getToken();
  // let account = getAccount();
  // let accessToken = get_access_token();
  // let timestamp = getTimestamp();
  // let noncestr = getNoncestr();
  // let sign = getSign(accessToken, appid, appSecret, noncestr, timestamp);
  if (token) {
    config.headers['usertoken'] = token;
  }
  // if (account) {
  //   config.headers['account'] = account;
  // }
  // if (accessToken) {
  //   config.headers['accesstoken'] = accessToken;
  // }
  // if (timestamp) {
  //   config.headers['timestamp'] = timestamp;
  // }
  // if (noncestr) {
  //   config.headers['noncestr'] = noncestr;
  // }
  if (config.method.toLowerCase() === 'post') {
    if (config.data) {
      let dataStr = JSON.stringify(config.data);
      let base64Str = base64Encrypt(dataStr);
      config.data = serializeData({ param: base64Str });
    }
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error);
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.data) {
      try {
        let str = base64Decrypt(response.data);
        let res_data = JSON.parse(str);
        response.data = res_data;
        if (res_data.resultCode === '-2') {
          let returnUrl = location.href;
          sessionStorage.setItem('returnUrl', returnUrl);
          router.push('/login');
        }
        if (response.data && response.data.resultCode !== '0') {
          let errorMsg = response.data.msg;
          errorMsg = errorMsg ? errorMsg : '网络错误，请稍后再试。';
          Message({
            message: errorMsg,
            type: 'error'
          });
        }
      } catch (e) {
        console.log('出错了，' + e + '，接口返回数据：' + response.data);
      }
    }
    return response;
  },
  error => {
    console.log('error' + error);
  }
);

export default service;
