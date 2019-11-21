import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import { getToken, serializeData } from '@/utils/auth';


// create an axios instance
const service = axios.create({
  baseURL: process.env.RIDER_HOST,
  timeout: 15000
});

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  let token = getToken();
  if (token) {
    config.headers['usertoken'] = token;
  }
  if (config.method.toLowerCase() === 'post') {
    if (config.data) {
      let dataStr = JSON.stringify(config.data);
      config.data = serializeData({ param: dataStr });
    }
  }
  return config;
}, error => {
  console.log(error);
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => {
    // console.log(response.data);
    if (response.data) {
      try {
        // let res_data = JSON.parse(response.data);
        // response.data = res_data;
        if (response.data.resultCode === '-2') {
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
