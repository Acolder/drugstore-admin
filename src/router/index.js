import Vue from 'vue';
import Router from 'vue-router';
import layout from '../views/layout/layout2.vue';
const _import = require('./_import_' + process.env.NODE_ENV);

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router);

// 公用路由(iframe中的路由、component!=layout的一级路由)
export const constantRouterMap = [
  // 通用页面
  { path: '/login', component: _import('login/login') },
  // 修改密码
  { path: '/modifyPassword', component: _import('modifyPassword/modifyPassword') },
  { path: '/externalList', component: _import('external/list') }, // 饮片导入导出
  {
    path: '/home',
    name: 'home',
    component: layout,
    children: [
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '我的桌面'
        },
        component: _import('home/default')
      }
    ]
  },
  {
    path: '/',
    name: 'default-name',
    redirect: '/home/index'
  },
  { path: '/401', component: _import('errorPage/401') },
  { path: '/404', component: _import('errorPage/404') },
  { path: '/demo', component: _import('demo/index') },
  // 系统设置
  {  // 选择商品列表
    path: '/manage/outSelectedInfo',
    component: _import('system/manage/outSelectedInfo'),
    name: 'outSelectedInfo',
    meta: {
      title: '外部专题药品列表',
      show: false
    }
  },
  // 选择头条资讯
  {
    path: '/manage/outNewList',
    component: _import('system/manage/outNewList'),
    name: 'outNewList',
    meta: {
      title: '外部头条资讯列表',
      show: false
    }
  },
  // 固定膏方列表
  {
    path: '/PhysiqueTest/healthLife/fixedPaste',
    component: _import('system/PhysiqueTest/healthLife/fixedPaste'),
    name: 'fixedPasteCommon',
    meta: {
      title: '固定膏方列表',
      show: false
    }
  },
  // 电商中心
  // 查看药品
  {
    path: '/drug-control/viewDrug',
    component: _import('mall/drug-control/viewDrug'),
    name: 'viewDrug',
    meta: {
      title: '查看药品',
      show: false
    }
  },
  // 外部药品列表
  {
    path: '/drug-control/outsideDrugList',
    component: _import('mall/drug-control/outsideDrugList'),
    name: 'outsideDrugList',
    meta: {
      title: '外部药品列表',
      show: false
    }
  },
  // 脉诊仪运营报表
  {
    path: '/home/apparatusOperate',
    component: _import('system/service/apparatusOperate'),
    name: 'apparatusOperateReport'
  },
  // 脉诊仪借用数据列表
  {
    path: '/home/equipmentBorrowDataList',
    component: _import('system/service/equipmentBorrow'),
    name: 'equipmentBorrowDataList',
  },
  {
    path: '/service/equipmentBorrowInfoDetail',
    component: _import('system/service/equipmentBorrowInfo'),
    name: 'equipmentBorrowInfoDetail',
  },
  {
    path: '/service/apparatusOrderList',
    component: _import('system/service/apparatusOrderList'),
    name: 'apparatusOrderList',
  },
  // 食材组件
  {
    path: '/instrumentTesting/Viscera/commonFoodsList',
    component: _import('system/instrumentTesting/Viscera/commonFoodsList'),
    name: 'commonFoodsList',
    meta: {
      title: '食材列表',
      show: false
    }
  },
  // 新版资讯
  {
    path: '/cardManage/newInformationComponent',
    component: _import('system/cardManage/newInformationComponent'),
    name: 'newInformationComponent',
    meta: {
      title: '资讯列表',
      show: false
    }
  },
  // 坐堂医生
  {
    path: '/cardManage/doctorManageComponent',
    component: _import('system/cardManage/doctorManageComponent'),
    name: 'doctorManageComponent',
    meta: {
      title: '坐堂医生',
      show: false
    }
  },
  // 脏腑组件
  {
    path: '/instrumentTesting/physiotherapy/Visceracomponent',
    component: _import('system/instrumentTesting/physiotherapy/Visceracomponent'),
    name: 'Visceracomponent',
    meta: {
      title: '脏腑列表',
      show: false
    }
  },
  // 订单详情
  {
    path: '/home/orderDetails',
    component: _import('mall/order-control/orderDetail'),
    name: 'morderDetails'
  },
  // 选择资讯标题
  {
    path: '/informationManage/outInformationList',
    component: _import('system/informationManage/outInformationList'),
    name: 'outInformationList',
    meta: {
      title: '选择资讯标题',
      show: false
    }
  },
  // 选择作者
  {
    path: '/informationManage/information/authorComponent',
    component: _import('system/informationManage/information/authorComponent'),
    name: 'authorComponent',
    meta: {
      title: '选择作者',
      show: false
    }
  },
  // 选择商品（可多选）
  {
    path: '/cardManage/productComponent',
    component: _import('system/cardManage/productComponent'),
    name: 'productComponent',
    meta: {
      title: '选择商品',
      show: false
    }
  },
  // 选择单个商品
  {
    path: '/cardManage/productOne',
    component: _import('system/cardManage/productOne'),
    name: 'productOne',
    meta: {
      title: '选择单个商品',
      show: false
    }
  },
  // 优惠券管理
  {
    path: '/integralManage/couponComponent',
    component: _import('mall/integralManage/couponComponent'),
    name: 'couponComponent',
    meta: {
      title: '添加优惠券',
      show: false
    }
  },
];
// 系统服务系统服务
export const systemRouterMap = [
  {
    path: '/service',
    component: layout,
    name: 'service',
    meta: {
      title: '系统服务',
      show: true
    },
    children: [
      {
        path: '/service/raredrugList',
        component: _import('system/service/raredrugList'),
        name: 'raredrugList',
        meta: {
          title: '寻稀缺药列表',
          show: true
        }
      },
      {
        path: '/service/prescriptionList',
        component: _import('system/service/prescriptionList'),
        name: 'prescriptionList',
        meta: {
          title: '处方药列表',
          show: true
        }
      },
      {
        path: '/service/opinionFeedbackList',
        component: _import('system/service/opinionFeedbackList'),
        name: 'opinionFeedbackList',
        meta: {
          title: '意见反馈列表',
          show: true
        }
      },
      {
        path: '/service/userLog',
        component: _import('system/service/userLog'),
        name: 'userLog',
        meta: {
          title: '用户日志',
          show: true
        }
      },
      // 单个设备的使用记录
      {
        path: '/service/useLog',
        component: _import('system/service/useLog'),
        name: 'useLog',
        meta: {
          title: '设备使用记录',
          show: false
        }
      },
      // 脉诊仪借方借用记录
      {
        path: '/service/equipmentBorrowUseLog',
        component: _import('system/service/equipmentBorrowUseLog'),
        name: 'equipmentBorrowUseLog',
        meta: {
          title: '用户借用记录',
          show: false
        }
      },
      // 脉诊仪检测记录
      {
        path: '/service/testRecord',
        component: _import('system/service/testRecord'),
        name: 'testRecord',
        meta: {
          title: '脉诊仪检测记录',
          show: true
        }
      },
      {
        path: '/service/errorLog',
        component: _import('system/service/errorLog'),
        name: 'errorLog',
        meta: {
          title: '错误日志',
          show: true
        }
      },
      {
        path: '/service/paymentLog',
        component: _import('system/service/paymentLog'),
        name: 'paymentLog',
        meta: {
          title: '支付日志',
          show: true
        }
      },
      {
        path: '/service/ExtensionList',
        component: _import('system/service/Extension-list/list'),
        name: 'ExtensionList',
        meta: {
          title: '推广员管理',
          show: true
        }
      },
      {
        path: '/service/EquipmentList',
        component: _import('system/service/Equipment-list/list'),
        name: 'EquipmentList',
        meta: {
          title: '脉诊仪管理',
          show: true
        }
      },
      {
        path: '/service/miniCicle',
        component: _import('system/service/MiniCicle/miniCicleList'),
        name: 'miniCicleManage',
        meta: {
          title: '微循环检测管理',
          show: true
        }
      },
      {
        path: '/service/miniCicleInfo',
        component: _import('system/service/MiniCicle/miniCicleSchemeInfo'),
        name: 'miniCicleInfo',
        meta: {
          title: '微循环检测方案详情',
          show: false
        }
      },
      {
        path: '/service/miniCicleScheme',
        component: _import('system/service/MiniCicle/miniCicleSchemeList'),
        name: 'miniCicleScheme',
        meta: {
          title: '微循环检测方案设置',
          show: true
        }
      },
      // 新增体质结果
      {
        path: '/instrumentTesting/PhysicalResult/addResult',
        component: _import('system/instrumentTesting/PhysicalResult/addResult'),
        name: 'addResult',
        meta: {
          title: '新增体质结果',
          show: false
        }
      },
      // 编辑体质结果
      {
        path: '/instrumentTesting/PhysicalResult/editResult',
        component: _import('system/instrumentTesting/PhysicalResult/editResult'),
        name: 'editResult',
        meta: {
          title: '修改体质结果',
          show: false
        }
      },
      // 脉诊仪借还
      {
        path: '/service/equipmentBorrow',
        component: _import('system/service/equipmentBorrow'),
        name: 'equipmentBorrow',
        meta: {
          title: '脉诊仪借还',
          show: true
        }
      },
      // 脉诊仪企业合作
      {
        path: '/service/equipmentCooperation',
        component: _import('system/service/equipmentCooperation'),
        name: 'equipmentCooperation',
        meta: {
          title: '脉诊仪企业合作',
          show: false
        }
      },
      // 脉诊仪借还操作
      {
        path: '/service/equipmentBorrowInfo',
        component: _import('system/service/equipmentBorrowInfo'),
        name: 'equipmentBorrowInfo',
        meta: {
          title: '脉诊仪借还操作',
          show: false
        }
      },
      // 脉诊仪运营
      {
        path: '/service/apparatusOperate',
        component: _import('system/service/apparatusOperate'),
        name: 'apparatusOperate',
        meta: {
          title: '脉诊仪运营数据',
          show: true
        }
      },
      // 脉诊仪订单数据
      {
        path: '/service/OrderList',
        component: _import('system/service/OrderList'),
        name: 'OrderList',
        meta: {
          title: '脉诊仪订单',
          show: false
        }
      }
    ]
  },
  // 首页管理
  {
    path: '/manage',
    component: layout,
    name: 'manage',
    meta: {
      title: '首页管理',
      show: true
    },
    children: [
      {
        path: '/manage/swiper',
        component: _import('system/manage/swiper'),
        name: 'swiper',
        meta: {
          title: '轮播图管理',
          show: true
        }
      },
      {
        path: '/manage/swiper-info/addSwiperInfo',
        component: _import('system/manage/swiper-info/addSwiperInfo'),
        name: 'addSwiperInfo',
        meta: {
          title: '添加轮播',
          show: false
        }
      },
      {
        path: '/manage/swiper-info/editSwiperInfo',
        component: _import('system/manage/swiper-info/editSwiperInfo'),
        name: 'editSwiperInfo',
        meta: {
          title: '修改轮播',
          show: false
        }
      },
      {
        path: '/manage/selected',
        component: _import('system/manage/selected'),
        name: 'selected',
        meta: {
          title: '药品专题',
          show: true
        }
      },
      {
        path: '/manage/addSelectedInfo',
        component: _import('system/manage/selected-Info/addSelectedInfo'),
        name: 'addSelectedInfo',
        meta: {
          title: '新增药品专题',
          show: false
        }
      },
      {
        path: '/manage/modifySelectedInfo',
        component: _import('system/manage/selected-Info/modifySelectedInfo'),
        name: 'modifySelectedInfo',
        meta: {
          title: '修改药品专题',
          show: false
        }
      },
      {
        path: '/manage/hotSearch',
        component: _import('system/manage/hotSearch'),
        name: 'hotSearch',
        meta: {
          title: '热门搜索',
          show: true
        }
      },
      {
        path: '/manage/HeadlineList',
        component: _import('system/manage/HeadlineList'),
        name: 'HeadlineList',
        meta: {
          title: '健康头条',
          show: true
        }
      },
      {
        path: '/manage/recommend',
        component: _import('system/manage/recommend'),
        name: 'recommend',
        meta: {
          title: '为你推荐',
          show: true
        }
      },
      {
        path: '/manage/addRecommend',
        component: _import('system/manage/addRecommend'),
        name: 'addRecommend',
        meta: {
          title: '新增/编辑推荐',
          show: false
        }
      }
    ]
  },
  // 资讯管理
  {
    path: '/news',
    redirect: 'noredirect',
    name: 'newsManage',
    component: layout,
    meta: {
      title: '资讯管理',
      show: false
    },
    children: [
      {
        path: '/news/newsList',
        component: _import('system/news/newsList'),
        name: 'newsList',
        meta: {
          title: '资讯列表',
          show: true
        }
      },
      { // 添加资讯
        path: '/news/newsAdd',
        component: _import('system/news/newsAdd'),
        name: 'newsAdd',
        meta: {
          title: '新增资讯',
          show: false
        }
      },
      { // 编辑资讯
        path: '/news/newsEdit',
        component: _import('system/news/newsEdit'),
        name: 'newsEdit',
        meta: {
          title: '修改资讯',
          show: false
        }
      },
      {
        path: '/news/tags',
        component: _import('system/news/tags'),
        name: 'tags',
        meta: {
          title: '标签管理',
          show: true
        }
      },
      {
        path: '/news/category',
        component: _import('system/news/category'),
        name: 'category',
        meta: {
          title: '新闻分类',
          show: true
        }
      },
      {
        path: '/news/comment',
        component: _import('system/news/comment'),
        name: 'comment',
        meta: {
          title: '评论管理',
          show: true
        }
      },
    ]
  },
  // 广告管理
  {
    path: '/',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '广告管理',
      show: true
    },
    children: [
      {
        path: '/advertisements/index',
        component: _import('system/advertisement/index'),
        name: 'advertisementIndexr',
        meta: {
          title: '广告列表',
          show: true
        }
      },
      {
        path: '/advertisements/edit',
        component: _import('system/advertisement/Info/edit'),
        name: 'advertisementEdit',
        meta: {
          title: '编辑广告',
          show: false
        }
      },
      {
        path: '/advertisements/add',
        component: _import('system/advertisement/Info/add'),
        name: 'advertisementAdd',
        meta: {
          title: '新增广告',
          show: false
        }
      }]
  },
  // 帖子管理
  {
    path: '/',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '帖子管理',
      show: true
    },
    children: [
      {
        path: '/cardManage/cardList',
        component: _import('system/cardManage/cardList'),
        name: 'cardList',
        meta: {
          title: '帖子列表',
          show: true
        }
      },
      {
        path: '/cardManage/superMan',
        component: _import('system/cardManage/superMan'),
        name: 'superMan',
        meta: {
          title: '达人管理',
          show: true
        }
      },
      {
        path: '/cardManage/doctorManage',
        component: _import('system/cardManage/doctorManage'),
        name: 'doctorManage',
        meta: {
          title: '医生管理',
          show: true
        }
      },
      {
        path: '/cardManage/topicManage',
        component: _import('system/cardManage/topicManage'),
        name: 'topicManage',
        meta: {
          title: '话题管理',
          show: true
        }
      },
      {
        path: '/cardManage/setCatecory',
        component: _import('system/cardManage/setCatecory'),
        name: 'setCatecory',
        meta: {
          title: '分类设置',
          show: true
        }
      },
      {
        path: '/cardManage/talkHall/talkList',
        component: _import('system/cardManage/talkHall/talkList'),
        name: 'talkList',
        meta: {
          title: '议堂设置',
          show: true
        }
      },
      {
        path: '/cardManage/talkHall/addTalkHall',
        component: _import('system/cardManage/talkHall/addTalkHall'),
        name: 'addTalkHall',
        meta: {
          title: '新增议堂',
          show: false
        }
      },
      {
        path: '/cardManage/talkHall/editTalkHall',
        component: _import('system/cardManage/talkHall/editTalkHall'),
        name: 'editTalkHall',
        meta: {
          title: '编辑议堂',
          show: false
        }
      },
    ]
  },
  // 中体体质测试
  {
    path: '/PhysiqueTest',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '中医体质测试',
      show: true
    },
    children: [
      {
        path: '/PhysiqueTest/suggestList',
        component: _import('system/PhysiqueTest/suggestList'),
        name: 'suggestList',
        meta: {
          title: '诊疗建议',
          show: true
        }
      },
      {
        path: '/PhysiqueTest/drugs/DrugsList',
        component: _import('system/PhysiqueTest/drugs/DrugsList'),
        name: 'DrugsList',
        meta: {
          title: '相关药品',
          show: true
        }
      },
      {
        path: '/PhysiqueTest/drugs/addDrugs',
        component: _import('system/PhysiqueTest/drugs/addDrugs'),
        name: 'addDrugs',
        meta: {
          title: '新增药品',
          show: false
        }
      },
      {
        path: '/PhysiqueTest/drugs/EditDrugs',
        component: _import('system/PhysiqueTest/drugs/EditDrugs'),
        name: 'EditDrugs',
        meta: {
          title: '修改药品',
          show: false
        }
      },
      {
        path: '/PhysiqueTest/healthLife/healthLifeList',
        component: _import('system/PhysiqueTest/healthLife/healthLifeList'),
        name: 'healthLifeList',
        meta: {
          title: '养生推荐',
          show: true
        }
      },
      {
        path: '/PhysiqueTest/healthLife/healthAddDrugs',
        component: _import('system/PhysiqueTest/healthLife/healthAddDrugs'),
        name: 'healthAddDrugs',
        meta: {
          title: '新增药材',
          show: false
        }
      },
      {
        path: '/PhysiqueTest/healthLife/healthAddGao',
        component: _import('system/PhysiqueTest/healthLife/healthAddGao'),
        name: 'healthAddGao',
        meta: {
          title: '新增膏方',
          show: false
        }
      },
      {
        path: '/PhysiqueTest/healthLife/healthEditGao',
        component: _import('system/PhysiqueTest/healthLife/healthEditGao'),
        name: 'healthEditGao',
        meta: {
          title: '修改固定膏方',
          show: false
        }
      },
      {
        path: '/PhysiqueTest/healthLife/healthEditDrugs',
        component: _import('system/PhysiqueTest/healthLife/healthEditDrugs'),
        name: 'healthEditDrugs',
        meta: {
          title: '修改药材',
          show: false
        }
      },
    ]
  },
  // 脉诊仪检测
  {
    path: '/instrumentTesting',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '脉诊仪检测',
      show: true
    },
    children: [
      {
        path: '/instrumentTesting/foodsManage/foodsList',
        component: _import('system/instrumentTesting/foodsManage/foodsList'),
        name: 'foodsList',
        meta: {
          title: '食材管理',
          show: true
        }
      },
      {
        path: '/instrumentTesting/foodsManage/addFood',
        component: _import('system/instrumentTesting/foodsManage/addFood'),
        name: 'addFood',
        meta: {
          title: '新增食材',
          show: false
        }
      },
      {
        path: '/instrumentTesting/foodsManage/editFood',
        component: _import('system/instrumentTesting/foodsManage/editFood'),
        name: 'editFood',
        meta: {
          title: '编辑食材',
          show: false
        }
      },
      {
        path: '/instrumentTesting/PhysicalResult/PhysicalResultList',
        component: _import('system/instrumentTesting/PhysicalResult/PhysicalResultList'),
        name: 'PhysicalResultList',
        meta: {
          title: '体质结果',
          show: true
        }
      },
      {
        path: '/instrumentTesting/Viscera/VisceraList1',
        component: _import('system/instrumentTesting/Viscera/VisceraList1'),
        name: 'VisceraList1',
        meta: {
          title: '脏腑辩证',
          show: true
        }
      },
      {
        path: '/instrumentTesting/Viscera/addViscera',
        component: _import('system/instrumentTesting/Viscera/addViscera'),
        name: 'addViscera',
        meta: {
          title: '新增调养建议',
          show: false
        }
      },
      {
        path: '/instrumentTesting/Viscera/editViscera',
        component: _import('system/instrumentTesting/Viscera/editViscera'),
        name: 'editViscera',
        meta: {
          title: '修改调养建议',
          show: false
        }
      },
      {
        path: '/instrumentTesting/physiotherapy/beforePhysiotherapy',
        component: _import('system/instrumentTesting/physiotherapy/beforePhysiotherapy'),
        name: 'beforePhysiotherapy',
        meta: {
          title: '理疗预约订单管理',
          show: true
        }
      },
      {
        path: '/instrumentTesting/physiotherapy/physiotherapyList',
        component: _import('system/instrumentTesting/physiotherapy/physiotherapyList'),
        name: 'physiotherapyList',
        meta: {
          title: '理疗门店',
          show: true
        }
      },
      {
        path: '/instrumentTesting/physiotherapy/addStore',
        component: _import('system/instrumentTesting/physiotherapy/addStore'),
        name: 'addStore',
        meta: {
          title: '新增门店信息',
          show: false
        }
      },
      {
        path: '/instrumentTesting/physiotherapy/editStore',
        component: _import('system/instrumentTesting/physiotherapy/editStore'),
        name: 'editStore',
        meta: {
          title: '编辑门店信息',
          show: false
        }
      },
      // 门店理疗方案
      {
        path: '/instrumentTesting/physiotherapy/manageProgramme',
        component: _import('system/instrumentTesting/physiotherapy/manageProgramme'),
        name: 'manageProgramme',
        meta: {
          title: '门店理疗方案',
          show: false
        }
      },
      // 新增理疗方案
      {
        path: '/instrumentTesting/physiotherapy/addProgramme',
        component: _import('system/instrumentTesting/physiotherapy/addProgramme'),
        name: 'addProgramme',
        meta: {
          title: '新增理疗方案',
          show: false
        }
      },
      // 编辑理疗方案
      {
        path: '/instrumentTesting/physiotherapy/editProgramme',
        component: _import('system/instrumentTesting/physiotherapy/editProgramme'),
        name: 'editProgramme',
        meta: {
          title: '编辑理疗方案',
          show: false
        }
      },
      {
        path: '/instrumentTesting/commonIll/illList',
        component: _import('system/instrumentTesting/commonIll/illList'),
        name: 'illList',
        meta: {
          title: '常见病管理',
          show: true
        }
      },
      {
        path: '/instrumentTesting/commonIll/addIll',
        component: _import('system/instrumentTesting/commonIll/addIll'),
        name: 'addIll',
        meta: {
          title: '新增常见病',
          show: false
        }
      },
      {
        path: '/instrumentTesting/commonIll/editIll',
        component: _import('system/instrumentTesting/commonIll/editIll'),
        name: 'editIll',
        meta: {
          title: '编辑常见病',
          show: false
        }
      },
    ]
  },
  // 修身私塾
  {
    path: '/',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '健康头条',
      show: true
    },
    children: [
      {
        path: '/informationManage/information/informationList',
        component: _import('system/informationManage/information/informationList'),
        name: 'informationList',
        meta: {
          title: '资讯列表',
          show: true
        }
      },
      {
        path: '/informationManage/information/addInformation',
        component: _import('system/informationManage/information/addInformation'),
        name: 'addInformation',
        meta: {
          title: '新增资讯',
          show: false
        }
      },
      {
        path: '/informationManage/information/editInformation',
        component: _import('system/informationManage/information/editInformation'),
        name: 'editInformation',
        meta: {
          title: '编辑资讯',
          show: false
        }
      },
      {
        path: '/informationManage/informationCatecory',
        component: _import('system/informationManage/informationCatecory'),
        name: 'informationCatecory',
        meta: {
          title: '资讯分类',
          show: true
        }
      },
      {
        path: '/informationManage/authorManage',
        component: _import('system/informationManage/authorManage'),
        name: 'authorManage',
        meta: {
          title: '作者管理',
          show: true
        }
      },
    ]
  },
  // 微信公众号菜单
  {
    path: '/system/weixinMenu',
    redirect: 'noredirect',
    component: layout,
    name: 'weixinMenuManage',
    meta: {
      title: '微信公众号菜单',
      show: true,
    },
    children: [
      {
        path: '/system/weixinMenu/index',
        component: _import('system/weixinMenu/index'),
        name: 'weixinMenuList',
        meta: {
          title: '公众号菜单列表',
          show: true,
        }
      }
    ]
  },
  // 扁鹊平台/开放平台申请管理
  {
    path: '/bianquPlatform',
    redirect: 'noredirect',
    component: layout,
    name: 'bianquPlatform',
    meta: {
      title: '扁鹊平台',
      show: true,
    },
    children: [
      {
        path: '/bianquPlatform/applayUser',
        component: _import('system/bianquPlatform/applayUser'),
        name: 'applayUser',
        meta: {
          title: '开放平台申请管理',
          show: true,
        }
      }
    ]
  },
];
// 电商中心
export const mallRouterMap = [
  // 商品管理
  {
    path: '/drug-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '商品管理',
      show: true
    },
    children: [
      {
        path: '/drug-control/addDrug',
        component: _import('mall/drug-control/addDrug'),
        name: 'addDrug',
        meta: {
          title: '新增药品',
          show: false
        }
      },
      {
        path: '/drug-control/editDrug',
        component: _import('mall/drug-control/editDrug'),
        name: 'editDrug',
        meta: {
          title: '编辑药品',
          show: false
        }
      },
      {
        path: '/drug-control/list',
        component: _import('mall/drug-control/list'),
        name: 'drugList',
        meta: {
          title: '商品列表',
          show: true
        }
      },
      {
        path: '/drug-control/shortTimeList',
        component: _import('mall/drug-control/shortTimeList'),
        name: 'shortTimeList',
        meta: {
          title: '临时商品表',
          show: true
        }
      },
      {
        path: '/drug-control/classification',
        component: _import('mall/drug-control/classification'),
        name: 'drugClassification',
        meta: {
          title: '商品分类',
          show: true
        }
      },
      {
        path: '/drug-control/doctorProCategory/doctorProCategoryList',
        component: _import('mall/drug-control/doctorProCategory/doctorProCategoryList'),
        name: 'doctorProCategoryList',
        meta: {
          title: '医生商品分类',
          show: true
        }
      },
      {
        path: '/drug-control/productSpecial',
        component: _import('mall/drug-control/productSpecial'),
        name: 'productSpecial',
        meta: {
          title: '商品专题',
          show: true
        }
      },
      {
        path: '/drug-control/KS_productManage',
        component: _import('mall/drug-control/KS_productManage'),
        name: 'KS_productManage',
        meta: {
          title: '商品专题-商品管理',
          show: false
        }
      },
      {
        path: '/drug-control/giftSpecial',
        component: _import('mall/drug-control/giftSpecial'),
        name: 'giftSpecial',
        meta: {
          title: '礼品专题',
          show: true
        }
      },
      {
        path: '/drug-control/gift_productManage',
        component: _import('mall/drug-control/gift_productManage'),
        name: 'gift_productManage',
        meta: {
          title: '礼品专题-商品管理',
          show: false
        }
      },
    ]
  },
  // 营销活动
  {
    path: '/activet',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '营销活动管理',
      show: true
    },
    children: [
      {
        path: '/activet/list',
        component: _import('mall/activet/list'),
        name: 'activetlist',
        meta: {
          title: '营销活动列表',
          show: true
        }
      },
      {
        path: '/activet/detail',
        component: _import('mall/activet/detail'),
        name: 'activetdetail',
        meta: {
          title: '活动详情',
          show: false
        }
      },
    ]
  },
  // 骑手
  {
    path: '/riderList',
    redirect: 'noredirect',
    component: layout,
    name: 'rider',
    meta: {
      title: '骑手管理',
      show: true
    },
    children: [
      {
        path: '/rider-cpntrol/riderList',
        component: _import('mall/rider-cpntrol/riderList'),
        name: 'riderList',
        meta: {
          title: '骑手列表',
          show: true
        }
      }
    ]
  },
  // 订单管理
  {
    path: '/order-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '订单管理',
      show: true
    },
    children: [
      {
        path: '/order-control/giftList/giftList',
        component: _import('mall/order-control/giftList/giftList'),
        name: 'giftList',
        meta: {
          title: '礼单列表',
          show: true
        }
      },
      {
        path: '/order-control/giftList/giftDetail',
        component: _import('mall/order-control/giftList/giftDetail'),
        name: 'giftDetail',
        meta: {
          title: '礼包详情',
          show: false
        }
      },
      {
        path: '/order-control/giftList/gift_OrderDetail',
        component: _import('mall/order-control/giftList/gift_OrderDetail'),
        name: 'gift_OrderDetail',
        meta: {
          title: '订单详情',
          show: false
        }
      },
      {
        path: '/order-control/orderList',
        component: _import('mall/order-control/orderList'),
        name: 'orderQuery',
        meta: {
          title: '订单列表',
          show: true
        }
      },
      {
        path: '/order-control/orderDetail',
        component: _import('mall/order-control/orderDetail'),
        name: 'orderDetail',
        meta: {
          title: '订单详情',
          show: false
        }
      },
      {
        path: '/order-control/orderControl/orderControlList',
        component: _import('mall/order-control/orderControl/orderControlList'),
        name: 'orderControlList',
        meta: {
          title: '订单监控',
          show: true
        }
      },
      {
        path: '/order-control/orderControl/order_Details',
        component: _import('mall/order-control/orderControl/order_Details'),
        name: 'order_Details',
        meta: {
          title: '订单详情',
          show: false
        }
      },
    ]
  },
  // 客服管理
  {
    path: '/CustomerService',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '客服管理',
      show: true
    },
    children: [
      {
        path: '/CustomerService/orderFollowing',
        component: _import('mall/CustomerService/orderFollowing'),
        name: 'orderFollowing',
        meta: {
          title: '订单跟踪',
          show: true
        }
      },
      {
        path: '/CustomerService/CustomerList',
        component: _import('mall/CustomerService/CustomerList'),
        name: 'CustomerList',
        meta: {
          title: '客服列表',
          show: true
        }
      },
      {
        path: '/CustomerService/CustomerRecord',
        component: _import('mall/CustomerService/CustomerRecord'),
        name: 'CustomerRecord',
        meta: {
          title: '客服记录',
          show: false
        }
      },
    ]
  },
  // 商户管理
  {
    path: '/sellBusiness',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '商户管理',
      show: true
    },
    children: [
      {
        path: '/sellBusiness/toExamine',
        component: _import('mall/sellBusiness/toExamine'),
        name: 'toExamine',
        meta: {
          title: '商户审核',
          show: true
        }
      },
      {
        path: '/sellBusiness/list',
        component: _import('mall/sellBusiness/list'),
        name: 'sellList',
        meta: {
          title: '商户列表',
          show: true
        }
      },
      {
        path: '/sellBusiness/detail',
        component: _import('mall/sellBusiness/detail'),
        name: 'detail',
        meta: {
          title: '商户详情',
          show: false
        }
      }
    ]
  },
  // 白名单管理
  {
    path: '/whiteList',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '白名单管理',
      show: true
    },
    children: [
      {
        path: '/whiteList/list',
        component: _import('mall/whiteList/list'),
        name: 'whiteList',
        meta: {
          title: '白名单列表',
          show: true
        }
      },
    ]
  },
  // 提现
  {
    path: '/forward',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '提现管理',
      show: true
    },
    children: [
      {
        path: '/forward/list',
        component: _import('mall/forward/list'),
        name: 'forward-list',
        meta: {
          title: '提现列表',
          show: true
        }
      },
      {
        path: '/forward/detail',
        component: _import('mall/forward/detail'),
        name: 'forward-detail',
        meta: {
          title: '提现详情',
          show: false
        }
      }]
  },
  // 优惠券
  {
    path: '/market',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '优惠券管理',
      show: true
    },
    children: [
      {
        path: '/market/list',
        component: _import('mall/market/list'),
        name: 'market-list',
        meta: {
          title: '优惠券列表',
          show: true
        }
      },
      {
        path: '/market/detail',
        component: _import('mall/market/couponDetail'),
        name: 'market-detail',
        meta: {
          title: '优惠券详情',
          show: false
        }
      }]
  },
  // 电子围栏管理
  {
    path: '/enclosure',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '电子围栏管理',
      show: true
    },
    children: [
      {
        path: '/enclosure/index',
        component: _import('mall/enclosure/index'),
        name: 'enclosure-index',
        meta: {
          title: '电子围栏',
          show: true
        }
      }
    ]
  },
  // APP用户管理
  {
    path: '/userManage',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '用户管理',
      show: true,
    },
    children: [
      {
        path: '/userManage/userList',
        component: _import('mall/userManage/userList'),
        name: 'userList',
        meta: {
          title: '用户列表',
          show: true,
        }
      },
      {
        path: '/userManage/userDetail',
        component: _import('mall/userManage/userDetail'),
        name: 'userDetail',
        meta: {
          title: '用户详情',
          show: false,
        }
      },
    ]
  },
  // 康美人生
  {
    path: '/kangmeiLife',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '康美人生',
      show: true,
    },
    children: [
      {
        path: '/kangmeiLife/giftCover',
        component: _import('mall/kangmeiLife/giftCover'),
        name: 'giftCover',
        meta: {
          title: '礼卡封面',
          show: true,
        }
      },
      {
        path: '/kangmeiLife/storeManage',
        component: _import('mall/kangmeiLife/storeManage'),
        name: 'storeManage',
        meta: {
          title: '门店管理',
          show: true,
        }
      },
    ]
  },
  // 积分成长体系
  {
    path: '/growthSystem',
    redirect: 'noredirect',
    component: layout,
    name: 'growthSystem',
    meta: {
      title: '成长体系',
      show: true,
    },
    children: [
      {
        path: '/growthSystem/growthGuide',
        component: _import('mall/growthSystem/growthGuide'),
        name: 'growthGuide',
        meta: {
          title: '成长指南',
          show: true,
        }
      },
      {
        path: '/growthSystem/growthLevel',
        component: _import('mall/growthSystem/growthLevel'),
        name: 'growthLevel',
        meta: {
          title: '成长等级',
          show: true,
        }
      },
      {
        path: '/growthSystem/addLevel',
        component: _import('mall/growthSystem/addLevel'),
        name: 'addLevel',
        meta: {
          title: '添加等级',
          show: false,
        }
      },
      {
        path: '/growthSystem/editLevel',
        component: _import('mall/growthSystem/editLevel'),
        name: 'editLevel',
        meta: {
          title: '修改等级',
          show: false,
        }
      },
    ]
  },
  // 积分成长体系
  {
    path: '/integralManage',
    redirect: 'noredirect',
    name: 'integralManage',
    component: layout,
    meta: {
      title: '积分管理',
      show: true,
    },
    children: [
      {
        path: '/integralManage/integralGet',
        component: _import('mall/integralManage/integralGet'),
        name: 'integralGet',
        meta: {
          title: '积分获取',
          show: true,
        }
      },
      {
        path: '/integralManage/integralDescription',
        component: _import('mall/integralManage/integralDescription'),
        name: 'integralDescription',
        meta: {
          title: '积分说明',
          show: true,
        }
      },
      {
        path: '/integralManage/commodManage',
        component: _import('mall/integralManage/commodManage'),
        name: 'commodManage',
        meta: {
          title: '商品管理',
          show: true,
        }
      },
      {
        path: '/integralManage/addCommod',
        component: _import('mall/integralManage/addCommod'),
        name: 'addCommod',
        meta: {
          title: '添加商品',
          show: false,
        }
      },
      {
        path: '/integralManage/editCommod',
        component: _import('mall/integralManage/editCommod'),
        name: 'editCommod',
        meta: {
          title: '修改商品',
          show: false,
        }
      },
      {
        path: '/integralManage/exchangeRecord',
        component: _import('mall/integralManage/exchangeRecord'),
        name: 'exchangeRecord',
        meta: {
          title: '兑换记录',
          show: true,
        }
      },
      {
        path: '/integralManage/exchangeDetail',
        component: _import('mall/integralManage/exchangeDetail'),
        name: 'exchangeDetail',
        meta: {
          title: '兑换详情',
          show: false,
        }
      },
    ]
  },
];
// 问诊管理
export const consultRouterMap = [
  // 订单管理
  {
    path: '/orderManage',
    redirect: 'noredirect',
    name: 'orderManage',
    component: layout,
    meta: {
      title: '订单管理',
      show: true
    },
    children: [
      {
        path: '/orderManage/msgEntry',
        component: _import('consult/orderManage/msgEntry'),
        name: 'msgEntry',
        meta: {
          title: '信息录入',
          show: true
        }
      },
      {
        path: '/orderManage/msgConfirm',
        component: _import('consult/orderManage/msgConfirm'),
        name: 'msgConfirm',
        meta: {
          title: '订单确认',
          show: true
        }
      },
      {
        path: '/orderManage/recipeEntry',
        component: _import('consult/orderManage/recipeEntry'),
        name: 'recipeEntry',
        meta: {
          title: '拍照处方录入',
          show: false
        }
      },
      {
        path: '/orderManage/printRecipe',
        component: _import('consult/orderManage/printRecipe'),
        name: 'printRecipe',
        meta: {
          title: '打印处方信息',
          show: false
        }
      },
      {
        path: '/orderManage/recipeCheck',
        component: _import('consult/orderManage/recipeEntry'),
        name: 'recipeCheck',
        meta: {
          title: '审核处方信息',
          show: false
        }
      },
      {
        path: '/orderManage/smsSend',
        component: _import('consult/orderManage/smsSend'),
        name: 'smsSend',
        meta: {
          title: '短信发送',
          show: true
        }
      }, {
        path: '/orderManage/serviceOrder',
        component: _import('consult/orderManage/serviceOrder'),
        name: 'serviceOrder',
        meta: {
          title: '客服下单',
          show: true
        }
      }, {
        path: '/orderManage/StandardPrescription',
        component: _import('consult/orderManage/StandardPrescription/StandardPrescription'),
        name: 'StandardPrescription',
        meta: {
          title: '标准处方',
          show: true
        }
      }, {
        path: '/orderManage/addStandardPrescription',
        component: _import('consult/orderManage/StandardPrescription/addStandardPrescription'),
        name: 'addStandardPrescription',
        meta: {
          title: '新增标准处方',
          show: false
        }
      }, {
        path: '/orderManage/editStandardPrescription',
        component: _import('consult/orderManage/StandardPrescription/editStandardPrescription'),
        name: 'editStandardPrescription',
        meta: {
          title: '编辑标准处方',
          show: false
        }
      }, {
        path: '/orderManage/fixedPaste',
        component: _import('consult/orderManage/fixedPaste/fixedPaste'),
        name: 'fixedPaste',
        meta: {
          title: '固定膏方',
          show: true
        }
      }, {
        path: '/orderManage/addfixedpaste',
        component: _import('consult/orderManage/fixedPaste/addfixedpaste'),
        name: 'addfixedpaste',
        meta: {
          title: '新增固定膏方',
          show: false
        }
      }, {
        path: '/orderManage/editfixedpaste',
        component: _import('consult/orderManage/fixedPaste/editfixedpaste'),
        name: 'editfixedpaste',
        meta: {
          title: '编辑固定膏方',
          show: false
        }
      }, {
        path: '/orderManage/classicPaste',
        component: _import('consult/orderManage/classicPaste/classicPaste'),
        name: 'classicPaste',
        meta: {
          title: '经典膏方',
          show: true
        }
      }, {
        path: '/orderManage/addClassicpaste',
        component: _import('consult/orderManage/classicPaste/addClassicpaste'),
        name: 'addClassicpaste',
        meta: {
          title: '新增经典膏方模板',
          show: false
        }
      }, {
        path: '/orderManage/editClassicpaste',
        component: _import('consult/orderManage/classicPaste/editClassicpaste'),
        name: 'editClassicpaste',
        meta: {
          title: '编辑经典膏方模板',
          show: false
        }
      }, {
        path: '/orderManage/classicPasteList',
        component: _import('consult/orderManage/classicPaste/classicPasteList'),
        name: 'classicPasteList',
        meta: {
          title: '经典膏方列表',
          show: false
        }
      }, {
        path: '/orderManage/addClassicpasteList',
        component: _import('consult/orderManage/classicPaste/addClassicpasteList'),
        name: 'addClassicpasteList',
        meta: {
          title: '新增经典膏方列表',
          show: false
        }
      }, {
        path: '/orderManage/editClassicpasteList',
        component: _import('consult/orderManage/classicPaste/editClassicpasteList'),
        name: 'editClassicpasteList',
        meta: {
          title: '编辑经典膏方列表',
          show: false
        }
      }, {
        path: '/orderManage/chinesedrug',
        component: _import('consult/drugMgr/chineseDrug'),
        name: 'chinesedruglist',
        meta: {
          title: '中药管理',
          show: true
        }
      }, {
        path: '/orderManage/westdrug',
        component: _import('consult/drugMgr/westDrug'),
        name: 'westdruglist',
        meta: {
          title: '西药管理',
          show: true
        }
      }, {
        path: '/orderManage/editchinesedrug',
        component: _import('consult/drugMgr/editChineseDrug'),
        name: 'editchinesedrug',
        meta: {
          title: '编辑中药',
          show: false
        }
      }, {
        path: '/orderManage/editwestdrug',
        component: _import('consult/drugMgr/editWestDrug'),
        name: 'editwestdrug',
        meta: {
          title: '编辑西药',
          show: false
        }
      }
    ]
  },
  // 发帖管理
  {// 新增帖子
    path: '/postManagement/addpostAudit',
    component: _import('consult/postManagement/addpostAudit'),
    name: 'addpostAudit',
    meta: {
      title: '新增帖子',
      show: false
    }
  },
  {// 修改帖子
    path: '/postManagement/modifypostAudit',
    component: _import('consult/postManagement/modifypostAudit'),
    name: 'modifypostAudit',
    meta: {
      title: '修改帖子',
      show: false
    }
  },
  {// 新增音频
    path: '/postManagement/addaudioManagement',
    component: _import('consult/postManagement/addaudioManagement'),
    name: 'addaudioManagement',
    meta: {
      title: '新增音频',
      show: false
    }
  },
  {// 修改音频
    path: '/postManagement/modifyaudioManagement',
    component: _import('consult/postManagement/modifyaudioManagement'),
    name: 'modifyaudioManagement',
    meta: {
      title: '修改音频',
      show: false
    }
  },
  {// 新增关联音频
    path: '/postManagement/createvideoDetail',
    component: _import('consult/postManagement/createvideoDetail'),
    name: 'createvideoDetail',
    meta: {
      title: '新增关联音频',
      show: false
    }
  },
  {// 修改关联音频
    path: '/postManagement/updatevideoDetail',
    component: _import('consult/postManagement/updatevideoDetail'),
    name: 'updatevideoDetail',
    meta: {
      title: '修改关联音频',
      show: false
    }
  },
  {
    path: '/postManagement',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '发帖管理',
      show: true
    },
    children: [
      {
        path: '/postManagement/postAudit',
        component: _import('consult/postManagement/postAudit'),
        name: 'postAudit',
        meta: {
          title: '发帖审核',
          show: true
        }
      },
      {
        path: '/postManagement/weChatMaterial',
        component: _import('consult/postManagement/weChatMaterial'),
        name: 'weChatMaterial',
        meta: {
          title: '微信素材管理',
          show: true
        }
      },
      {
        path: '/postManagement/weChatToken',
        component: _import('consult/postManagement/weChatToken'),
        name: 'weChatToken',
        meta: {
          title: '微信Token',
          show: true
        }
      },
      {
        path: '/postManagement/audioManagement',
        component: _import('consult/postManagement/audioManagement'),
        name: 'audioManagement',
        meta: {
          title: '音频管理',
          show: true
        }
      }]
  },
  // 药店管理
  {
    path: '/RPseller',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '药店管理',
      show: true
    },
    children: [
      {
        path: '/RPseller/list',
        component: _import('consult/RPseller/list'),
        name: 'RPsellerList',
        meta: {
          title: '药店列表',
          show: true
        }
      },
      {
        path: '/RPseller/detail',
        component: _import('consult/RPseller/detail'),
        name: 'RPsellerdetail',
        meta: {
          title: '药店详情',
          show: false
        }
      }]
  },
  // 广告管理
  {
    path: '/advertisement',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '广告管理',
      show: true
    },
    children: [
      {
        path: '/advertisement/index',
        component: _import('consult/advertisement/index'),
        name: 'advertisementIndexBanner',
        meta: {
          title: '首页Banner',
          show: true
        }
      },
      {
        path: '/advertisement/editBanner',
        component: _import('consult/advertisement/banner/editBanner'),
        name: 'advertisementEditBanner',
        meta: {
          title: '编辑首页banner',
          show: false
        }
      },
      {
        path: '/advertisement/addBanner',
        component: _import('consult/advertisement/banner/addBanner'),
        name: 'advertisementAddBanner',
        meta: {
          title: '新增首页banner',
          show: false
        }
      },
      {
        path: '/advertisement/flashing',
        component: _import('consult/advertisement/flashing-info'),
        name: 'flashing',
        meta: {
          title: '广告闪页',
          show: true
        }
      }]
  },
  // 业务管理
  {
    path: '/salesManage',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '业务管理',
      show: true
    },
    children: [
      {
        path: '/salesManage/salesmanList',
        component: _import('consult/salesManage/salesmanList'),
        name: 'salesmanList',
        meta: {
          title: '业务员列表',
          show: true
        }
      }]
  },
  // 版本管理
  {// 新增版本控制
    path: '/versionManagement/addversionControl',
    component: _import('consult/versionManagement/addversionControl'),
    name: 'addversionControl',
    meta: {
      title: '新增版本控制',
      show: false
    }
  },
  {// 新增使用帮助
    path: '/versionManagement/adduseHelp',
    component: _import('consult/versionManagement/adduseHelp'),
    name: 'adduseHelp',
    meta: {
      title: '新增使用帮助',
      show: false
    }
  },
  {// 修改使用帮助
    path: '/versionManagement/modifyuseHelp',
    component: _import('consult/versionManagement/modifyuseHelp'),
    name: 'modifyuseHelp',
    meta: {
      title: '修改使用帮助',
      show: false
    }
  },
  {
    path: '/versionManagement',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '版本管理',
      show: true
    },
    children: [
      {
        path: '/versionManagement/versionControl',
        component: _import('consult/versionManagement/versionControl'),
        name: 'versionControl',
        meta: {
          title: '版本控制',
          show: true
        }
      },
      {
        path: '/versionManagement/feedbackFeedback',
        component: _import('consult/versionManagement/feedbackFeedback'),
        name: 'feedbackFeedback',
        meta: {
          title: '意见反馈',
          show: true
        }
      },
      {
        path: '/versionManagement/useHelp',
        component: _import('consult/versionManagement/useHelp'),
        name: 'useHelp',
        meta: {
          title: '使用帮助',
          show: true
        }
      }]
  },
  // 医院管理
  {
    path: '/hospital',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '医院管理',
      show: true
    },
    children: [
      {
        path: '/hospital/hospitalList',
        component: _import('consult/hospital/hospitalList'),
        name: 'hospitalList',
        meta: {
          title: '医院列表',
          show: true
        }
      },
      {
        path: '/hospital/eidtHospital',
        component: _import('consult/hospital/eidtHospital'),
        name: 'eidtHospital',
        meta: {
          title: '编辑医院',
          show: false
        }
      },
      {
        path: '/hospital/departmentList',
        component: _import('consult/hospital/departmentList'),
        name: 'departmentList',
        meta: {
          title: '科室列表',
          show: true
        }
      },
      {
        path: '/hospital/departmentEdit',
        component: _import('consult/hospital/departmentEdit'),
        name: 'departmentEdit',
        meta: {
          title: '编辑科室',
          show: false
        }
      },
      {
        path: '/hospital/doctorList',
        component: _import('consult/hospital/doctorList'),
        name: 'doctorList',
        meta: {
          title: '医生列表',
          show: true
        }
      },
      {
        path: '/hospital/doctorDetail',
        component: _import('consult/hospital/doctorDetail'),
        name: 'doctorDetail',
        meta: {
          title: '医生详情',
          show: false
        }
      },
      {
        path: '/hospital/pharmacist',
        component: _import('consult/hospital/pharmacist'),
        name: 'pharmacist',
        meta: {
          title: '药师列表',
          show: true
        }
      },
      {
        path: '/hospital/pharmacistDetail',
        component: _import('consult/hospital/pharmacistDetail'),
        name: 'pharmacistDetail',
        meta: {
          title: '药师详情',
          show: false
        }
      }
    ]
  }
];
// 第三方O2O平台管理后台
export const o2oPlatformRouterMap = [
  // 首页管理
  {
    path: '/o2oPlatform/home',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformHome',
    meta: {
      title: '首页管理',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/home/index',
        component: _import('o2oPlatform/home/index'),
        name: 'o2oPlatformHomeIndex',
        meta: {
          title: '首页',
          show: true
        }
      },
    ]
  },
  // 订单管理
  {
    path: '/o2oPlatform/order',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformOrder',
    meta: {
      title: '订单管理',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/order/listMonitor',
        component: _import('o2oPlatform/order/listMonitor'),
        name: 'o2oPlatformOrderListMonitor',
        meta: {
          title: '订单监控',
          show: true
        }
      },
      {
        path: '/o2oPlatform/order/machineOrder',
        component: _import('o2oPlatform/order/machineOrder'),
        name: 'o2oPlatformOrdermachineOrder',
        meta: {
          title: '药柜订单',
          show: true
        }
      },
      {
        path: '/o2oPlatform/order/list',
        component: _import('o2oPlatform/order/list'),
        name: 'o2oPlatformOrderList',
        meta: {
          title: '历史订单',
          show: true
        }
      },
      {
        path: '/o2oPlatform/order/heatMap',
        component: _import('o2oPlatform/order/heatMap'),
        name: 'o2oPlatformOrderHeatMap',
        meta: {
          title: '第三方订单热力图',
          show: false
        }
      },
      {
        path: '/o2oPlatform/order/markersMap',
        component: _import('o2oPlatform/order/markersMap'),
        name: 'o2oPlatformOrderMarkersMap',
        meta: {
          title: '第三方订单点聚合图',
          show: false
        }
      },
    ]
  },
  // 门店管理
  {
    path: '/o2oPlatform/store',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformStore',
    meta: {
      title: '门店管理',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/store/mainStore',
        component: _import('o2oPlatform/store/mainStore'),
        name: 'storeMainStore',
        meta: {
          title: '主店列表',
          show: true
        }
      },
      {
        path: '/o2oPlatform/store/subordinateStore',
        component: _import('o2oPlatform/store/subordinateStore'),
        name: 'storeSubordinateStore',
        meta: {
          title: '查看列表',
          show: false
        }
      },
      {
        path: '/o2oPlatform/store/basicInfo',
        component: _import('o2oPlatform/store/basicInfo'),
        name: 'storeBasicInfo',
        meta: {
          title: '基本信息',
          show: false
        }
      },
      {
        path: '/o2oPlatform/store/qualifications',
        component: _import('o2oPlatform/store/qualifications'),
        name: 'storeQualifications',
        meta: {
          title: '资质管理',
          show: false
        }
      },
      {
        path: '/o2oPlatform/store/storeInfo',
        component: _import('o2oPlatform/store/storeInfo'),
        name: 'storeStoreInfo',
        meta: {
          title: '店铺信息管理',
          show: false
        }
      },
    ]
  },
  // 经营分析
  {
    path: '/o2oPlatform/businessAnalysis',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformBusinessAnalysis',
    meta: {
      title: '经营分析',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/businessAnalysis/business',
        component: _import('o2oPlatform/businessAnalysis/business'),
        name: 'businessAnalysisBusiness',
        meta: {
          title: '营业分析',
          show: true
        }
      },
    ]
  },
  // 账单管理
  {
    path: '/o2oPlatform/bill',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformBill',
    meta: {
      title: '账单管理',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/bill/billList',
        component: _import('o2oPlatform/bill/billList'),
        name: 'billList',
        meta: {
          title: '账单列表',
          show: true
        }
      },
      {
        path: '/o2oPlatform/bill/billDetail',
        component: _import('o2oPlatform/bill/billDetail'),
        name: 'billDetail',
        meta: {
          title: '账单明细',
          show: false
        }
      },
      {
        path: '/o2oPlatform/bill/settlement',
        component: _import('o2oPlatform/bill/settlement'),
        name: 'settlement',
        meta: {
          title: '结算明细',
          show: false
        }
      },
    ]
  },
  // 渠道管理
  {
    path: '/o2oPlatform/channel',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformChannel',
    meta: {
      title: '渠道管理',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/channel/store',
        component: _import('o2oPlatform/channel/store'),
        name: 'channelStore',
        meta: {
          title: '渠道门店管理',
          show: true
        }
      },
      {
        path: '/o2oPlatform/channel/businessSetup',
        component: _import('o2oPlatform/channel/businessSetup'),
        name: 'channelBusinessSetup',
        meta: {
          title: '门店营业设置管理',
          show: true
        }
      },
      {
        path: '/o2oPlatform/channel/activity',
        component: _import('o2oPlatform/channel/activity'),
        name: 'channelActivity',
        meta: {
          title: '渠道活动商品管理',
          show: false
        }
      },
    ]
  },
  // 药品管理
  {
    path: '/o2oPlatform/drugs',
    redirect: 'noredirect',
    component: layout,
    name: 'o2oPlatformDrugs',
    meta: {
      title: '药品管理',
      show: true
    },
    children: [
      {
        path: '/o2oPlatform/drugs/other',
        component: _import('o2oPlatform/drugs/other'),
        name: 'otherDrugs',
        meta: {
          title: '第三方药品',
          show: true
        }
      },
      {
        path: '/o2oPlatform/drugs/local',
        component: _import('o2oPlatform/drugs/local'),
        name: 'localDrugs',
        meta: {
          title: '本地药品',
          show: false
        }
      },
    ]
  },
];
// 系统设置
export const adminRouterMap = [
  // 角色管理
  {
    path: '/role',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '角色管理',
      show: true
    },
    children: [
      {
        path: '/role/roleList',
        component: _import('admin/role/roleList'),
        name: 'roleList',
        meta: {
          title: '角色列表',
          show: true
        }
      }
    ]
  },
  // 菜单管理
  {
    path: '/menu',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '菜单管理',
      show: true
    },
    children: [
      {
        path: '/menu/menuList',
        component: _import('admin/menu/list'),
        name: 'menuList',
        meta: {
          title: '菜单列表',
          show: true
        }
      },
    ]
  },
  { // 权限管理
    path: '/power',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '权限管理',
      show: false,
    },
    children: [
      {
        path: '/power/powerList',
        component: _import('admin/power/powerList'),
        name: 'powerList',
        meta: {
          title: '权限列表',
          show: true
        }
      },
    ]
  },
  // 用户管理
  {
    path: '/user',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '用户管理',
      show: true
    },
    children: [
      {
        path: '/user/userList',
        component: _import('admin/user/userList'),
        name: 'manageUserList',
        meta: {
          title: '用户列表',
          show: true
        }
      },
      // 操作日志
      {
        path: '/user/optionsLog',
        component: _import('admin/user/optionsLog'),
        name: 'optionsLog',
        meta: {
          title: '操作日志',
          show: true
        }
      },
    ]
  },
];


export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
