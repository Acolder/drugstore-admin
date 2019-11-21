<template>
  <div id="business">
    <div class="search-wrapper">
      <el-form  :model="business" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="省份">
              <el-select v-model="business.addressProvince" size='small'>
                <el-option
                  v-for="item in provinceArray"
                  :key="item.index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <el-select v-model="business.addressCity" size='small'>
                <el-option
                  v-for="item in cityArray"
                  :key="item.index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区域">
              <el-select v-model="business.addressDistrict" size='small'>
                <el-option
                  v-for="item in districtArray"
                  :key="item.index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="药店名称">
              <el-select v-model="business.sellerUserId" size='small'>
                <el-option
                  v-for="item in sellerUserList"
                  :key="item.index"
                  :label="item.sellerName"
                  :value="item.sellerUserId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <!-- 操作 -->
              <el-button type="primary" icon="el-icon-edit" size="small" @click="edit">编辑</el-button>
              <el-button type="primary" icon="el-icon-error" size="small" @click="clearAll">重绘</el-button>
              <el-button type="primary" icon="el-icon-success" size="small" @click="preservation">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="enclosureTil">
      <div>绘制电子围栏多边形图案完成时，请双击鼠标左键 确定完成图案的绘制结束;点击编辑电子围栏的范围时，请将地图右上角的绘制工具替换成 <img src="./imgs/1.png" alt=""> 第一个小手的编辑状态。</div>
      <div>绘制圆形和矩形的时候，需要点击鼠标右上角的小手来结束绘制的状态。</div>
    </div>
    <div>
      <div id="allmap" style="overflow:hidden;zoom:1;position:relative;">
        <div id="map" style="height:100%;-webkit-transition: all 0.5s ease-in-out;transition: all 0.5s ease-in-out;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import BMap from 'BMap';
import BMapLib from 'BMapLib';
import BMAP_ANCHOR_TOP_RIGHT from 'BMAP_ANCHOR_TOP_RIGHT';
export default {
  data() {
    return {
      business: {
        addressProvince: '', // 省份
        addressCity: '', // 城市
        addressDistrict: '', // 区域
        sellerName: '', // 药店
        sellerUserId: '', // 药店id
      },
      // 省份列表
      provinceArray: [],
      // 城市列表
      cityArray: [],
      // 区域列表
      districtArray: [],
      // 药店列表
      // sellerNameArray: [],
      // 药店信息列表
      sellerUserList: [],
      // 商户信息
      merchantInfo: '',
      // 保存围栏的数据
      fence: {
        sellerUserId: '',
        shippingArea: [],
        // backupsShippingArea: []
      },
      // 百度地图
      map: '',
      // 围栏数据
      overlays: [],
      // 绘制围栏得到的坐标值
      coordinate: [],
      // 围栏样式
      styleOptions: {
        strokeColor: 'red',    // 边线颜色。
        fillColor: '#ccc',      // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2,       // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid'   // 边线的样式，solid或dashed。
      },
      // 鼠标绘制工具
      drawingManager: {},
      // 商户id
      sellerUserId: '',
      isWholeCountry: 1,
    };
  },
  watch: {
    // 省份
    'business.addressProvince': function() {
      this.business.addressCity = '';
      this.business.addressDistrict = '';
      this.business.sellerName = '';
      this.business.sellerUserId = '';
      this.isWholeCountry = 0;
      this.getCity();
    },
    // 市
    'business.addressCity': function() {
      this.business.addressDistrict = '';
      this.business.sellerName = '';
      this.business.sellerUserId = '';
      this.getArea();
    },
    // 区
    'business.addressDistrict': function() {
      this.business.sellerName = '';
      this.business.sellerUserId = '';
      this.getPharmacy();
    },
    // 药店
    'business.sellerUserId': function() {
      if (this.business.sellerUserId) {
        this.queryMerchant();
      }
    },
  },
  methods: {
    // 选择范围重置坐标点
    resetCoordinate(sellerUserList) {
      // 建立坐标点：
      // lng：经度 lat：纬度
      let points = sellerUserList.map(item => {
        return {
          lng: item.longitude,
          lat: item.latitude,
          sellerUserId: item.sellerUserId,
          sellerName: item.sellerName,
          shippingArea: item.shippingArea,
          businessDate: item.businessDate
        };
      });
      // 清除之前的坐标点
      let allOverlay = this.map.getOverlays();
      for (let i = 0; i < allOverlay.length - 1; i++) {
        this.map.removeOverlay(allOverlay[i]);
      }
      this.createCoordinate(points);
    },
    // 省
    getProvince() {
      javaAjax.post(`/mall_manage/authority/queryThreeLevelLinkage`, this.business).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.provinceArray = res.data.resultData.provinceArray;
          // this.sellerNameArray = res.data.resultData.sellerNameArray;
          this.sellerUserList = res.data.resultData.sellerUserList;
        }
      });
    },
    // 市
    getCity() {
      javaAjax.post(`/mall_manage/authority/queryThreeLevelLinkage`, this.business).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.cityArray = res.data.resultData.cityArray;
          // this.sellerNameArray = res.data.resultData.sellerNameArray;
          this.sellerUserList = res.data.resultData.sellerUserList;
          this.resetCoordinate(res.data.resultData.sellerUserList);
        }
      });
    },
    // 区
    getArea() {
      javaAjax.post(`/mall_manage/authority/queryThreeLevelLinkage`, this.business).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.districtArray = res.data.resultData.districtArray;
          // this.sellerNameArray = res.data.resultData.sellerNameArray;
          this.sellerUserList = res.data.resultData.sellerUserList;
          this.resetCoordinate(res.data.resultData.sellerUserList);
        }
      });
    },
    // 药店
    getPharmacy() {
      javaAjax.post(`/mall_manage/authority/queryThreeLevelLinkage`, this.business).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          // this.sellerNameArray = res.data.resultData.sellerNameArray;
          this.sellerUserList = res.data.resultData.sellerUserList;
          this.resetCoordinate(res.data.resultData.sellerUserList);
        }
      });
    },
    // 查询商户详细的信息
    queryMerchant() {
      javaAjax.post(`/mall_manage/authority/queryAppointSellerUser`, this.business).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let tempData = res.data.resultData[0];
          console.log(tempData);
          this.merchantInfo = tempData;
          this.fence.sellerUserId = tempData.sellerUserId;
          // 显示的地图范围移动至选择的药店附近
          let new_point = new BMap.Point(tempData.longitude, tempData.latitude);
          this.map.centerAndZoom(new_point, 15);
          this.map.panTo(new_point);
          this.ready(tempData.longitude, tempData.latitude);
          this.resetCoordinate(res.data.resultData);
          // 初始化电子围栏
          this.clearAll();
          // 当商户有围栏信息的时候将会绘制原本商户已有的围栏
          if (tempData.shippingArea) {
            let xyArray =  JSON.parse(tempData.shippingArea);
            // 显示商户的电子围栏区域
            if (xyArray.length > 0) {
              let polylinePointsArray = [];
              for (let i = 0; i < xyArray.length; i++) {
                polylinePointsArray[i] = new BMap.Point(xyArray[i].y, xyArray[i].x);
              }
              let polygon = new BMap.Polygon(polylinePointsArray, this.styleOptions);  // 创建多边形
              this.map.addOverlay(polygon);   // 增加多边形
              this.overlays.push(polygon); // 是否把该图像加入到编辑和删除行列
              this.overlays[0].enableEditing();// 开启编辑状态
            }
          }
        }
      });
    },
    // 百度坐标转火星坐标
    bd_decrypt(bd_lng, bd_lat) {
      let X_PI = Math.PI * 3000.0 / 180.0;
      let x = bd_lng - 0.0065;
      let y = bd_lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
      let gg_lng = z * Math.cos(theta);
      let gg_lat = z * Math.sin(theta);
      return { y: gg_lng, x: gg_lat };
    },
    // 百度地图API功能初始化
    ready(longitude, latitude) {
      let lon  = longitude ? longitude : 114.066519;
      let lat  = latitude ? latitude : 22.549303;
      let _this = this;
      // 创建Map实例
      _this.map = new BMap.Map('map');
      // 初始化地图,设置中心点坐标和地图级别
      // let poi = new BMap.Point(114.066519, 22.549303);
      let poi = new BMap.Point(lon, lat);
      _this.map.centerAndZoom(poi, 15);
      // 启用滚轮放大缩小，默认禁用
      _this.map.enableScrollWheelZoom();
      // 绘制工具事件
      let overlaycomplete = function(e) {
        _this.clearAll();
        _this.overlays = [];
        _this.coordinate = [];
        _this.overlays.push(e.overlay);
        let path = e.overlay.getPath();// Array<Point> 返回多边型的点数组'y:' + path[i].lng + ',x:' + path[i].lat
        console.log(path);
        for (let i = 0; i < path.length; i++) {
          _this.coordinate.push({ x: path[i].lat, y: path[i].lng });
          // 百度坐标转火星坐标
          // let t = _this.bd_decrypt(path[i].lng, path[i].lat);
          // _this.coordinate.push(t);
        }
        console.log(_this.coordinate);
      };
      // 实例化鼠标绘制工具
      _this.drawingManager = new BMapLib.DrawingManager(_this.map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: true, // 是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(5, 5), // 偏离值
        },
        circleOptions: _this.styleOptions, // 圆的样式
        polylineOptions: _this.styleOptions, // 线的样式
        polygonOptions: _this.styleOptions, // 多边形的样式
        rectangleOptions: _this.styleOptions // 矩形的样式
      });
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      _this.drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    },
    // 编辑
    edit() {
      this.overlays[0].enableEditing();
    },
    // 保存
    preservation() {
      if (this.overlays.length === 0) {
        this.$message('请先绘制电子围栏才能保存');
        return false;
      }
      this.overlays[0].disableEditing();
      // this.coordinate = [];
      // let path = this.overlays[0].getPath();// Array<Point> 返回多边型的点数组
      // for (let i = 0; i < path.length; i++) {
      //   this.coordinate.push({ y: path[i].lng, x: path[i].lat });
      // }
      this.fence.shippingArea = this.coordinate;
      // this.fence.backupsShippingArea = this.coordinate;
      console.log(this.fence);
      javaAjax.post(`/mall_manage/authority/updateShippingAreea`, this.fence).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message(res.data.msg);
          // 保存成功之后刷新页面上的数据
        }
      });
    },
    // 重绘
    clearAll() {
      for (let i = 0; i < this.overlays.length; i++) {
        this.map.removeOverlay(this.overlays[i]);
      }
      this.overlays = [];
      this.coordinate = [];
    },
    // 编写信息显示方法
    showInfo(thisMarker, point, _this) {
      console.log(point);
      _this.fence.sellerUserId = point.sellerUserId;
      // 点击坐标点的时候显示的地图范围移动至选择的药店附近
      let new_point = new BMap.Point(point.lng, point.lat);
      this.map.centerAndZoom(new_point, 15);
      this.map.panTo(new_point);
      // 初始化电子围栏
      _this.clearAll();
      // 当商户有围栏信息的时候将会绘制原本商户已有的围栏
      if (point.shippingArea) {
        let xyArray =  JSON.parse(point.shippingArea);
        // 显示商户的电子围栏区域
        if (xyArray.length > 0) {
          let polylinePointsArray = [];
          for (let i = 0; i < xyArray.length; i++) {
            polylinePointsArray[i] = new BMap.Point(xyArray[i].y, xyArray[i].x);
          }
          let polygon = new BMap.Polygon(polylinePointsArray, _this.styleOptions);  // 创建多边形
          _this.map.addOverlay(polygon);   // 增加多边形
          _this.overlays.push(polygon); // 是否把该图像加入到编辑和删除行列
          _this.overlays[0].enableEditing();// 开启编辑状态
        }
      }
      // 获取点的信息
      let sContent =
        '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
        + '<li style="line-height: 26px;font-size: 15px;">'
        + '<span style="width: 200px;display: inline-block;">药店id：</span>' + point.sellerUserId + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">'
        + '<span style="width: 200px;display: inline-block;">药店名称：</span>' + point.sellerName + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">'
        + '<span style="width: 200px;display: inline-block;">营业日期：</span>' + point.businessDate + '</li>'
        + '</ul>';
      let infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
      thisMarker.openInfoWindow(infoWindow); // 图片加载完后重绘infoWindow
    },
    // 创建坐标点
    createCoordinate(points) {
      let _this = this;
      // 循环建立标注点
      for (let i = 0, pointsLen = points.length; i < pointsLen; i++) {
        let point = new BMap.Point(points[i].lng, points[i].lat); // 将标注点转化成地图上的点
        let marker = new BMap.Marker(point); // 将点转化成标注点
        this.map.addOverlay(marker);  // 将标注点添加到地图上
        // 添加监听事件
        (function() {
          let thePoint = points[i];
          marker.addEventListener('click',
            // 显示信息的方法
            function() {
              _this.showInfo(this, thePoint, _this);
            });
        })();
      }
    },
    // 查询全国数据的所有商户电子围栏
    wholeCountry() {
      this.isWholeCountry = 1;
      javaAjax.post(`/mall_manage/authority/queryShippingAreeaIsNotNull`, { 'sellerUserId': this.sellerUserId }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let tempData = res.data.resultData;
          // 建立坐标点：
          // lng：经度 lat：纬度
          let points = tempData.map(item => {
            return {
              lng: item.longitude,
              lat: item.latitude,
              sellerUserId: item.sellerUserId,
              sellerName: item.sellerName,
              shippingArea: item.shippingArea,
              businessDate: item.businessDate
            };
          });
          this.createCoordinate(points);
        }
      });
    }
  },
  mounted() {
    this.ready();
  },
  created() {
    // 查询全国数据的所有商户电子围栏
    this.wholeCountry();
    // 获取省列表
    this.getProvince();
  }
};
</script>

<style lang="less" scoped>
#allmap,#editMap {
  width: 100%; height:500px; overflow: hidden;
  border: 1px solid #ccc;
  /deep/ .BMapLib_box.BMapLib_marker,/deep/ .BMapLib_box.BMapLib_polyline{
    display: none;
  }
}
dl,dt,dd,ul,li{
  margin:0;
  padding:0;
  list-style:none;
}
p{font-size:12px;}
dt{
  font-size:14px;
  font-family:"微软雅黑";
  font-weight:bold;
  border-bottom:1px dotted #000;
  padding:5px 0 5px 5px;
  margin:5px 0;
}
dd{
  padding:5px 0 0 5px;
}
li{
  line-height:28px;
}
.enclosureTil{
  div{
    line-height: 20px;
    font-size: 16px;
    color: red;
  }
  img{
    width: 30px;
    height: 30px;
  }
}
</style>