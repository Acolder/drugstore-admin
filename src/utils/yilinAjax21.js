import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import {
  getToken,
  removeToken,
  aesEncrypt,
  getNoncestr,
  getTimestamp,
  getSign,
  setAccesstoken,
  getAccesstoken,
  removeAccesstoken,
} from '@/utils/auth';

const appid = '8145955969';
const appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';
const accessTokenName = 'doctorAccessToken';

function get_access_token() {
  let accessToken = '';
  accessToken = getAccesstoken(accessTokenName);
  if (accessToken) {
    return accessToken;
  }
  let requestObj;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    requestObj = new XMLHttpRequest();
  } else { // code for IE6, IE5
    /* eslint-disable */
    requestObj = new ActiveXObject('Microsoft.XMLHTTP');
  }
  // let url = `${process.env.YILIN_HOST}/api/system/Token?appid=${aesEncrypt(appid)}&appSecret=${aesEncrypt(appSecret)}`;
  let url = `${process.env.YILIN_HOST2}/api/system/Token?appid=${aesEncrypt(appid)}&appSecret=${aesEncrypt(appSecret)}`;
  requestObj.open('get', url, false);
  requestObj.send('');
  let obj = requestObj.response;
  if (typeof obj !== 'object') {
    obj = JSON.parse(obj);
  }
  if (obj.code === 0) {
    accessToken = obj.data.accesstoken;
  }
  if (accessToken) {
    setAccesstoken(accessTokenName, accessToken);
  }
  return accessToken;
}


// create an axios instance
const service = axios.create({
  baseURL: process.env.YILIN_HOST,
  timeout: 5000
});


// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  let token = getToken();
  let accessToken = get_access_token();
  let timestamp = getTimestamp();
  let noncestr = getNoncestr();
  let sign = getSign(accessToken, appid, appSecret, noncestr, timestamp);
  if (token) {
    config.headers['usertoken'] = token;
  }
  if (accessToken) {
    config.headers['accesstoken'] = accessToken;
  }
  if (timestamp) {
    config.headers['timestamp'] = timestamp;
  }
  if (noncestr) {
    config.headers['noncestr'] = noncestr;
  }
  if (sign) {
    config.headers['sign'] = sign;
  }
  config.headers['status'] = 1;
  return config;
}, error => {
  // Do something with request error
  console.log(error);
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.data && response.data.code === -2) {
      let returnUrl = location.href;
      sessionStorage.setItem('returnUrl', returnUrl);
      router.push('/login');
    }
    if (response.data && response.data.code === -3) {
      removeToken();
      removeAccesstoken(accessTokenName);
    }
    if (response.data && response.data.code !== 0) {
      let errorMsg = response.data.message;
      errorMsg = !!errorMsg ? errorMsg : '网络错误，请稍后再试。';
      Message({
        message: errorMsg,
        type: 'error'
      });
    }
    return response;
  },
  error => {
    console.log('error' + error);
  }
);

export default service;
