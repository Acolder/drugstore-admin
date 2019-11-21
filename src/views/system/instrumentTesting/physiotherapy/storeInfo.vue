<template>
  <div id="programmeWrap">
    <el-form ref="programme" :model="programmeForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="门店名称" prop="store_name" class="source">
            <el-input style="width:40%;" v-model.trim="programmeForm.store_name" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入调理方案名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="营业时间" prop="business_hours" class="source">
            <el-input style="width:40%;" v-model.trim="programmeForm.business_hours" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入营业时间"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="联系方式" prop="contact_information" class="source">
            <el-input style="width:40%;" v-model.trim="programmeForm.contact_information" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="所在地" prop="location" class="locationWrap">
            <el-input v-model.trim="programmeForm.location" display="inline-block" style="width: 30.7%" class="locationInput"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" readonly clearable placeholder="请点击选择地址" focus="chooseAddress">
            <span icon="el-icon-location"></span>
            </el-input>
            <el-button icon="el-icon-location" size="small" @click="chooseAddress" class="location">选择地址</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="地区" class="provincename">
            <el-input style="width:13.2%;" v-model.trim="programmeForm.provincename" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable readonly placeholder="省"></el-input>
            <el-input style="width:13.1%;" v-model.trim="programmeForm.cityname" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable readonly placeholder="市"></el-input>
            <el-input style="width:13%;" v-model.trim="programmeForm.areaname" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable readonly placeholder="区"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="详细地址" prop="address" class="source">
            <el-input style="width:40%;" v-model.trim="programmeForm.address" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="footer">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
          <el-button @click="submitForm" style="margin-left: 20px" type="primary" icon="el-icon-check" size="small">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 地图弹窗 -->
    <div :class="mapShow ? 'map_box' : 'none'">
      <div class="box_wrap">
        <div class="baidumap" id="allmap"></div>
        <div class="map-footer">
          <el-button @click="mapShow = false">取 消</el-button>
          <el-button type="primary" @click="query">确 定</el-button>
        </div>
        <i class="el-icon-close close" @click="close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import BMap from 'BMap';
import { mapGetters } from 'vuex';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    // 手机号验证
    let validatePhone = (rule, value, callback) => {
      if (value) {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的号码（座机号：077-54328560，手机号：13512345678）'));
        }
      } else {
        callback();
      }
    };
    return {
      programmeForm: {
        store_name: '',    // 门店名
        business_hours: '',    // 营业时间
        contact_information: '',   // 手机号
        address: '',  // 地址
        // detailAddress: '',  // 详细地址
        location: '',   // 所在地
        latitude: '',
        longitude: '',
        province: '', // 所属省份
        city: '', // 城市
        area: '', // 区县
        provincename: '',
        cityname: '',
        areaname: '',
      },
      addressProvinceArray: [],
      addressCityArray: [],
      addressDistrictArray: [],
      rules: {
        store_name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
        business_hours: [{ required: true, message: '请输入营业时间', trigger: 'blur' }],
        contact_information: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        location: [{ required: true, message: '请选择所在地', trigger: 'blur' }],
        area: [{ required: true, message: '请选择地址', trigger: 'blur' }],
      },
      mapShow: false,  // 地图
      location: '',
      userlocation: { lng: '', lat: '' },
      proviceName: '',
      cityName: '',
      areaName: '',
    };
  },
  props: {
    addStore: Boolean,
    id: String
  },
  components: {
    'uploadImg': uploadImg,
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 百度地图API功能初始化
    ready(longitude, latitude) {
      let _self = this;
      let lon = _self.programmeForm.longitude ? _self.programmeForm.longitude : 114.066519;
      let lat = _self.programmeForm.latitude ? _self.programmeForm.latitude : 22.549303;
      let lonat = { lng: lon, lat: lat };
      // 创建Map实例
      _self.map = new BMap.Map('allmap');
      // 初始化地图,设置中心点坐标和地图级别
      let poi = new BMap.Point(lon, lat);
      _self.map.centerAndZoom(poi, 14);
      let marker = new BMap.Marker(lonat); // 创建点
      _self.map.addOverlay(marker);      // 将标注添加到地图中
      _self.map.panTo(poi);
      // 启用滚轮放大缩小，默认禁用
      _self.map.enableScrollWheelZoom();
      let geoc = new BMap.Geocoder();
      this.map.addEventListener('click', showInfo);
      function showInfo(e) {
        _self.programmeForm.latitude = e.point.lat;
        _self.programmeForm.longitude = e.point.lng;
        _self.location = '经度：' + e.point.lng + ', 纬度：' + e.point.lat;
        _self.map.clearOverlays();
        _self.map.addOverlay(new BMap.Marker(e.point));
        _self.map.panTo(new BMap.Point(e.point.lng, e.point.lat));
        let pt = e.point;
        geoc.getLocation(pt, function(rs) {
        // addressComponents对象可以获取到详细的地址信息
          let addComp = rs.addressComponents;
          let site = addComp.province + '-' + addComp.city + '-' + addComp.district;
          // 将对应的地区赋值
          _self.programmeForm.province = site;
          _self.programmeForm.provincename = addComp.province;
          _self.programmeForm.cityname = addComp.city;
          _self.programmeForm.areaname = addComp.district;
        });
      }
    },
    query() {
      this.mapShow = false;
      this.programmeForm.location = this.location;
    },
    close() {
      this.mapShow = false;
    },
    // 上传图
    uploadImgMain(data, imgUrl) {
      this.programmeForm.banner = imgUrl;
    },
    // 删除图
    removeImgMain(url) {
      this.programmeForm.banner = url;
    },
    // 选择地址
    chooseAddress() {
      this.mapShow = true;
    },
    resetForm() {
      this.$refs['programme'].resetFields();
      this.programmeForm.provincename = '';
      this.programmeForm.areaname = '';
      this.programmeForm.cityname = '';
    },
    // 提交表单
    submitForm() {
      let _self = this;
      let param = _self.programmeForm;
      _self.$refs['programme'].validate((valid) => {
        if (valid) {
          let url;
          if (_self.addStore) {
            url = `/api/borrow/CreatePhysiotherapyStoreInfo`;
          } else {
            url = `/api/borrow/UpdatePhysiotherapyStoreInfo`;
          }
          ajax.post(url, param).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功'
              });
              // 关闭当前也并跳转列表页
              let currentName = _self.$route.name;
              let currentTab = _self.visitedViews.find((x) => x.name === currentName);
              _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                let query = _self.$route.query;
                query.from = _self.$route.name;
                if (query.id) {
                  delete query.id;
                }
                _self.$router.push({
                  path: '/instrumentTesting/physiotherapy/physiotherapyList',
                });
              });
            }
          });
        }
        else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    // 获取详情
    getDetail() {
      let _self = this;
      ajax.get(`/api/borrow/GetPhysiotherapyStoreInfoByid?id=` + _self.$route.query.id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          let data = res.data.data;
          _self.programmeForm = data;
          this.ready();
        }
      });
    },
  },
  mounted() {
    // 调用上面个的函数
    if (!this.addStore) {
      this.getDetail();
    } else {
      this.ready();
    }
  }
};
</script>

<style lang="less" scoped>
#programmeWrap{
  padding: 30px 0px 0px 40px;
}
.footer{
  margin-left: 8%;
  margin-top: 20px;
}
.none{
  z-index: -10;
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.baidumap{
  width: 1250px;
  height: 600px;
}
.map_box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,0.5);
  z-index: 10;
  .box_wrap{
    width: 1300px;
    height: 700px;
    padding: 30px 30px 70px 30px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    .close{
      position: absolute;
      top: 8px;
      right: 10px;
      cursor: pointer;
    }
    .map-footer{
      margin-top: 15px;
      text-align: center;
    }
  }
}
.locationWrap{
  // width: 725px;
  // position: relative;
  .location{
    // border: 0;
    // position: absolute;
    // right: 5px;
    // top: 5px;
    width:9%;
    height: 40px;
    text-align: center;
  }
}
.commonLocation{
  width: 205px;
}

</style>
