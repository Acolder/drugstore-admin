<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="5">
            <el-form-item label="药店名称">
              <el-select v-model="business.name" size='small' placeholder="请选择">
                <el-option
                  v-for="item in drugstoreNameArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="渠道">
              <el-select v-model="business.channel" size='small' placeholder="请选择">
                <el-option
                  v-for="item in abutmentflagArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="时间筛选">
              <el-date-picker class="el-date-picker" v-model="business.startttime" type="datetime" placeholder="开始日期"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <el-date-picker class="el-date-picker" v-model="business.endttime" type="datetime" placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="baiduMap">
      <div id="allmap"></div>
    </div>
  </div>
</template>
<script>
import BMap from 'BMap';
import BMapLib from 'BMapLib';
import { mapGetters } from 'vuex';
// import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        name: '',
        channel: '',
        startttime: '',
        endttime: '',
      },
      // 药店数组
      drugstoreNameArray: [],
      // 渠道
      abutmentflagArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    getTableData() {
      console.log(1);
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 百度地图API功能
    ready() {
      let map = new BMap.Map('allmap');
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 4);
      map.enableScrollWheelZoom();
      let MAX = 20;
      let markers = [];
      let pt = null;
      let i = 0;
      for (; i < MAX; i++) {
        pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
        console.log(pt);
        markers.push(new BMap.Marker(pt));
      }
      // 最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
      let markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers });
      console.log(markerClusterer);
    }
  },
  mounted() {
    this.ready();
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
.baiduMap{
  body, html {width: 100%;height: 100%;margin:0;font-family:"微软雅黑";}
  #allmap{width:100%;height:500px;}
  p{margin-left:5px; font-size:14px;}
}
</style>