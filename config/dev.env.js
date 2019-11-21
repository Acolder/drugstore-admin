'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 测试环境
  // 站点域名
  WEB_HOST: '"http://localhost:8180/#"',
  // .net 接口 默认host
  BASE_HOST: '"https://tdyao.kangmeiyaohulu.com"',
  // java 电商模块 默认host
  MALL_BASE_HOST: '"https://taddmall.kangmeiyaohulu.com"',
  // java 电商模块 默认host
  ES_BASE_HOST: '"https://tsearch.kangmeiyaohulu.com"',
  // 医林api 默认host
  YILIN_BASE_HOST: '"https://tdocker.kangmeiyaohulu.com"',
  // 医林后台API
  YILIN_HOST: '"https://taddocapi.kangmeiyaohulu.com"',
  // 医林后台API2
  YILIN_HOST2: '"https://tdocapi.kangmeiyaohulu.com"',
  // 药柜接口
  CONTAINER_HOST: '"https://tkmvem.kangmeiyaohulu.com"',
  // 骑手接口
  RIDER_HOST: '"https://tsend.kangmeiyaohulu.com"',
  // 文件上传 HOST
  UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // // 扁鹊接口
  BIANQU_HOST: '"https://tadbqapi.kangmeiyaohulu.com"',

  // 生产环境
  // 站点域名
  // WEB_HOST: '"https://yadmin.kangmei.com.cn/#"',
  // WEB_HOST: '"http://localhost:8180/#"',
  // // .net 接口 默认host
  // BASE_HOST: '"https://yaoadmin.kangmei.com.cn"',
  // // java 电商模块 默认host
  // MALL_BASE_HOST: '"https://addmall.kangmei.com.cn"',
  // // java 电商模块 默认host
  // ES_BASE_HOST: '"https://search.kangmei.com.cn"',
  // // 医林api 默认host
  // YILIN_BASE_HOST: '"https://docker.kangmei.com.cn"',
  // // 医林后台API
  // YILIN_HOST: '"https://addocapi.kangmei.com.cn"',
  // // 医林后台API2
  // YILIN_HOST2: '"https://docapi.kangmei.com.cn"',
  // // 文件上传 HOST
  // UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // // 药柜接口
  // CONTAINER_HOST: '"https://kmvem.kangmeiyaohulu.com"',
  // // 骑手接口
  // RIDER_HOST: '"https://send.kangmei.com.cn"',
  // // 扁鹊接口
  // BIANQU_HOST: '"https://tadbqapi.kangmeiyaohulu.com"',

})
