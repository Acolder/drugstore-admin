<template>
  <div class="apparatus-page">
    <div class="title">脉诊仪运营数据</div>
    <div class="display-box num-data">
      <div class="box-flex box">
        <label class="tlt">脉诊仪总数</label>
        <label v-if="deviceData">{{deviceData.sum_count}}台</label>
      </div>
      <div class="box-flex box">
        <label class="tlt">已借台数</label>
        <label v-if="deviceData">{{deviceData.lead_count}}台</label>
      </div>
      <div class="box-flex box">
        <label class="tlt">付费借出</label>
        <label v-if="deviceData"><a :href="commonBorrowDataListUrl" target="_blank" style="color:#409EFF;">{{deviceData.lead_pay_count}}台</a></label>
      </div>
      <div class="box-flex box">
        <label class="tlt">内部借出</label>
        <label v-if="deviceData"><a :href="internalBorrowDataListUrl" target="_blank" style="color:#409EFF;">{{deviceData.lead_nopay_count}}台</a></label>
      </div>
      <div class="box-flex box">
        <label class="tlt">可借台数</label>
        <label v-if="deviceData">{{deviceData.allow_lead_count}}台</label>
      </div>
      <div class="box-flex box">
        <label class="tlt">测量总次数</label>
        <label v-if="deviceData">{{deviceData.testCount}}次</label>
      </div>
      <div class="box-flex box">
        <label class="tlt">日均测量次数</label>
        <label v-if="deviceData">{{deviceData.days_avg}}次</label>
      </div>
      <div class="box-flex box">
        <label class="tlt">累计测量人次</label>
        <label v-if="deviceData">{{deviceData.user_count}}次</label>
      </div>
    </div>
    <div class="apparatus_query_wrapper">
      <el-form ref="requestForm" label-width="80px" size="small" :model="requestModel" :inline="true">
        <el-form-item label="设备地址">
          <el-select placeholder="请选择" v-model="requestModel.mac" filterable clearable style="width: 130px;">
            <el-option v-for="(m,mi) in macs" :key="mi" :label="m.mac" :value="m.mac">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测地区">
          <el-select placeholder="请选择" v-model="requestModel.area" filterable clearable style="width: 130px;">
            <el-option v-for="(p,pi) in provinces" :key="pi" :label="p" :value="p">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备去处">
          <el-select placeholder="请选择" v-model="requestModel.give" filterable clearable style="width: 130px;">
            <el-option v-for="(g,gi) in gives" :key="gi" :label="g.give" :value="g.give">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" label-width="50px;">
          <el-date-picker style="width: 300px;" class="time-picker" v-model="timeFiltrate" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="drainage-box">
      <label class="r-title">脉诊仪使用统计</label>
      <div class="btn-box">
        <el-button @click="usageQuery('1')" :type="usageFlag==='1' ? 'primary' : ''">测量次数</el-button>
        <el-button @click="usageQuery('3')" :type="usageFlag==='3' ? 'primary' : ''">活跃设备</el-button>
        <el-button @click="usageQuery('2')" :type="usageFlag==='2' ? 'primary' : ''">活跃用户</el-button>
        <el-button @click="usageQuery('4')" :type="usageFlag==='4' ? 'primary' : ''">日均分时测量统计</el-button>
        <el-button @click="usageQuery('5')" :type="usageFlag==='5' ? 'primary' : ''">日均测量频次统计</el-button>
        <el-button type="primary" class="export_excel" @click.stop="export_usage_excel">导出</el-button>
      </div>
      <div id="usageInfo" class="height420"></div>
    </div>
    <div class="drainage-box">
      <label class="r-title">脉诊仪引流统计</label>
      <div class="drainage_summary">
        <div class="drainage_summary_item">
          <div class="summary_item_title">
            累计检测用户（人）
          </div>
          <div class="summary_item_number">
            {{testNum}}
          </div>
        </div>
        <div class="drainage_summary_item">
          <div class="summary_item_title">
            累计注册用户（人）
          </div>
          <div class="summary_item_number">
            {{registerNum}}
          </div>
        </div>
        <div class="drainage_summary_item">
          <div class="summary_item_title">
            累计订单量（单）
          </div>
          <div class="summary_item_number">
            <!-- <a :href="internalOrder_ListUrl" target="_blank" style="color:#409EFF;">{{orderQuantity}}</a> -->
            <span @click="inOrderLst(orderQuantity, saleNum)" class="hover" style="color:#409EFF;">{{orderQuantity}}</span>
          </div>
        </div>
        <div class="drainage_summary_item">
          <div class="summary_item_title">
            累计订单金额（元）
          </div>
          <div class="summary_item_number">
            <!-- <a :href="internalOrder_ListUrl" target="_blank" style="color:#409EFF;">{{saleNum}}</a> -->
            <span @click="inOrderLst(orderQuantity, saleNum)" class="hover" style="color:#409EFF;">{{saleNum}}</span>
          </div>
        </div>
      </div>
      <div class="btn_box">
        <el-button :type="regisFlg ? 'primary' : ''" @click="drainageHanlder('regisFlg')">注册用户</el-button>
        <el-button :type="orderFlg ? 'primary' : ''" @click="drainageHanlder('orderFlg')">下单量</el-button>
        <el-button :type="saleFlg ? 'primary' : ''" @click="drainageHanlder('saleFlg')">销售额</el-button>
        <el-button type="primary" class="export_excel" @click="GetStatisticsExecl">导出</el-button>
      </div>
      <div id="drainageCharts" class="height420"></div>
    </div>
    <label class="r-title">用户特征统计</label>
    <div style="border: 1px solid #eee; padding: 0 30px;">
      <div class="display-box user-result">
        <div class="user-feature">
          <div class="sex-percentage">
            <p class="user-feature-title">
              性别分布
            </p>
            <div class="display-box charts" v-if="sexPercent">
              <div class="box-flex">
                <span class="display-box">
                <el-tooltip class="item" effect="dark" :content="`男性: ${sexPercent.malePercent.count} (${sexPercent.malePercent.percentage}%)`" placement="bottom" :style="`width:${sexPercent.malePercent.percentage}%`">
                  <label class="male">男{{sexPercent.malePercent.percentage}}%</label>
                </el-tooltip>
                <el-tooltip class="item box-flex" effect="dark" :content="`女性: ${sexPercent.femalePercent.count} (${sexPercent.femalePercent.percentage}%)`" placement="bottom">
                  <label class="female" v-if="sexPercent.femalePercent.percentage > 0">女{{sexPercent.femalePercent.percentage}}%</label>
                </el-tooltip>
              </span>
              </div>
            </div>
          </div>
          <div class="user-feature-split">
          </div>
          <div class="self-other">
            <p class="user-feature-title">
              使用分布
            </p>
            <div class="display-box charts" v-if="typePercent">
              <div class="box-flex">
                <span class="display-box">
                <el-tooltip class="item" effect="dark" :content="`本人: ${typePercent.selfPercent.count} (${typePercent.selfPercent.percentage}%)`" placement="bottom" :style="`width:${typePercent.selfPercent.percentage}%`">
                  <label :style="`width:${typePercent.selfPercent.percentage}%`" class="self">本人{{typePercent.selfPercent.percentage}}%</label>
                </el-tooltip>
                <el-tooltip class="item box-flex" effect="dark" :content="`他人: ${typePercent.otherPercent.count} (${typePercent.otherPercent.percentage}%)`" placement="bottom">
                  <label class="box-flex other" v-if="typePercent.otherPercent.percentage > 0">他人{{typePercent.otherPercent.percentage}}%</label>
                </el-tooltip>
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="area-distribute" style="margin: 20px 0;position: relative; width: 100%;">
        <p class="r-txt" style="margin-bottom: 10px;">区域分布(检测次数统计)</p>
        <div id="mapResult" class="height450" style="width: 50%"></div>
        <div class="legend" style="height: 450px;">
          <div id="trans_mapResult">
            <div class="trans_map_item" v-for="(item,index) in regionDistribute" :key="index" v-if="index<10">
              <div class="map_item_province">{{(index + 1) + '. ' + item.name}}</div>
              <div class="map_item_bar">
                <span :style="'width:'+item.percentage+ '%;background-color:'+colorList[index]"></span><i>{{item.percentage+ '%'}}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="physique" style="margin: 20px 0;position: relative; width: 100%;">
        <p class="r-txt" style="margin-bottom: 10px;">体质结果分布</p>
        <div id="physiqueResult" class="height390" style="width: 50%"></div>
        <div class="legend" style="height: 390px;">
          <div id="trans_physiqueResult">
            <div class="trans_map_item" v-for="(item,index) in constitution" :key="index" v-if="index<10">
              <div class="map_item_province width200">{{(index + 1) + '. ' + item.name}}</div>
              <div class="map_item_bar width200">
                <span :style="'width:'+item.percentage+ '%;background-color:'+colorList[index] "></span><i>{{item.percentage+ '%'}}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="physique" style="position: relative; width: 100%;">
        <p class="r-txt" style="margin-bottom: 10px;">脏腑结果分布</p>
        <div id="visceraResult" class="height390" style="width: 50%"></div>
        <div class="legend" style="height: 390px;">
          <div id="trans_visceraResult">
            <div class="trans_map_item" v-for="(item,index) in viscera" :key="index" v-if="index<10">
              <div class="map_item_province width200">{{(index + 1) + '. ' + item.name}}</div>
              <div class="map_item_bar width200">
                <span :style="'width:'+item.percentage+ '%;background-color:'+colorList[index]"></span><i>{{item.percentage+ '%'}}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="订单详情" width="80%" :modal="true" :visible.sync="viewDialogVisible" :modal-append-to-body="false" center>
      <iframe id="viewIframe" :src="viewUrl" class="" frameborder="0" style="width:100%;height:800px;background-color:#fff;"></iframe>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import ajax from '@/utils/ajax';
import echarts from 'echarts';
import 'echarts/map/js/china.js';
import { queryParams } from '@/utils/urlParse';
export default {
  data() {
    return {
      requestModel: {
        starttime: '',
        endtime: '',
        mac: '',
        area: '',
        give: ''
      },
      viewDialogVisible: false,
      viewUrl: '',
      internalBorrowDataListUrl: `${process.env.WEB_HOST}/home/equipmentBorrowDataList?from=report&utype=2`,
      commonBorrowDataListUrl: `${process.env.WEB_HOST}/home/equipmentBorrowDataList?from=report&utype=1`,
      orderData: [],
      usageFlag: '1',
      firstChart: null,
      deviceData: null,
      timeFiltrate: null,
      getDateTime: null, // 起始时间和结束时间
      sexPercent: null, // 男女
      typePercent: null, // 本人他人
      constitution: null, // 体质结果
      viscera: null, // 脏腑结果
      regionDistribute: null, // 区域分布
      userStateRatio: [], // 新老用户
      hoursFrequency: null, // 一天分时段测量频次
      oneDayFrequency: null, // 一天测量频次
      regisFlg: true, // 注册用户数图表
      orderFlg: false, // 订单量图表
      saleFlg: false, // 销售额图表
      drainageData: null, // 引流数据
      drainageType: 'regisFlg',
      drainageChartEl: null,
      testNum: 0,
      registerNum: 0,
      orderQuantity: 0,
      saleNum: 0,
      searchFlg: 0,
      pickerOptions: {
        disabledDate(time) {
          let times = time.getTime();
          let oldTime = times < (new Date('2018-9-20')).getTime();
          let futureTime = times > Date.now();
          return (oldTime || futureTime);
        },
        shortcuts: [{
          text: '过去7天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '过去30天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '过去60天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 59);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      errorShow: false,
      provinces: [
        '安徽省',
        '北京市',
        '重庆市',
        '福建省',
        '甘肃省',
        '广东省',
        '广西壮族',
        '贵州省',
        '海南省',
        '河北省',
        '河南省',
        '黑龙江省',
        '湖北省',
        '湖南省',
        '吉林省',
        '江苏省',
        '江西省',
        '辽宁省',
        '内蒙古',
        '宁夏',
        '青海省',
        '山东省',
        '山西省',
        '陕西省',
        '上海市',
        '四川省',
        '天津市',
        '西藏',
        '新疆',
        '云南省',
        '浙江省'
      ],
      colorList: ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'],
      gives: [],
      macs: [],
      testCount: 0,   // 总数
      testAvg: 0,    // 日均数
      usePercentage: 0   // 使用率
    };
  },
  computed: {
    apparatusOrdersUrl() {
      return `${process.env.WEB_HOST}/service/apparatusOrderList?st=${this.requestModel.starttime}&et=${this.requestModel.endtime}`;
    }
  },
  mounted() {
    this.defaultTime();
    this.getDeviceData();
    this.searchData();
    this.getGives();
    this.getMacs();
  },
  methods: {
    // 默认日期(其实时间为1个月前)
    defaultTime() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      this.timeFiltrate = [`${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`, `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()}`];
    },
    // 脉诊仪运营数据
    getDeviceData() {
      ajax.get('/api/jinmu/GetDeviceInfoStatistics').then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          let data1 = res.data.data.data1;
          this.deviceData = res.data.data.data0;
          this.testNum = data1.testing_u_count;
          this.registerNum = data1.regis_u_count;
          this.orderQuantity = data1.order_number_count;
          this.saleNum = data1.order_money_count;
        }
      });
    },
    // 用户特征和脉诊结果分布接口
    getUserResult() {
      this.requestModel.starttime = this.timeFiltrate[0];
      this.requestModel.endtime = this.timeFiltrate[1];
      ajax.get(`/api/jinmu/GetUserFeaturesOrResultStatistics`, { params: this.requestModel }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          let resData = res.data.data;
          let malePercent = resData.men;
          let femalePercent = resData.women;
          let selfPercent = resData.this_test;
          let otherPercent = resData.outer_test;
          this.sexPercent = {
            malePercent: malePercent,
            femalePercent: femalePercent
          };
          this.typePercent = {
            selfPercent: selfPercent,
            otherPercent: otherPercent
          };
          this.constitution = resData.constitution;
          this.viscera = resData.viscera;
          this.regionDistribute = resData.region;
          this.getphysiqueResult();
          this.getVisceraResult();
          this.getMapResult();
        }
      });
    },
    // 订单页
    inOrderLst(orderQuantity, saleNum) {
      this.$router.push({
        path: '/service/OrderList',
        query: {
          orderQuantity: orderQuantity,
          saleNum: saleNum
        }
      });
    },
    // 体质结果饼图
    getphysiqueResult() {
      if (!this.constitution) {
        return false;
      }
      let myChart = echarts.init(document.getElementById('physiqueResult'));
      let constitution = [];
      this.constitution.forEach(res => {
        let con = {
          name: res.name,
          value: res.rcount
        };
        constitution.push(con);
      });
      let option = {
        backgroundColor: '#f8f8f8',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
          name: '体质结果',
          type: 'pie',
          radius: '55%',
          center: ['50%', '45%'],
          data: constitution,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
    },
    // 脏腑结果饼图
    getVisceraResult() {
      if (!this.viscera) {
        return false;
      }
      let myChart = echarts.init(document.getElementById('visceraResult'));
      let viscera = [];
      this.viscera.forEach(res => {
        let con = {
          // name: `${res.name} ${res.rcount} ${res.percentage}%`,
          name: res.name,
          value: res.rcount
        };
        viscera.push(con);
      });
      let option = {
        backgroundColor: '#f8f8f8',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
          name: '脏腑结果',
          type: 'pie',
          radius: '55%',
          center: ['50%', '45%'],
          data: viscera,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
    },
    // 区域分布
    getMapResult() {
      if (!this.regionDistribute) {
        return false;
      }
      let myChart = echarts.init(document.getElementById('mapResult'));
      let data = [];
      this.regionDistribute.forEach(res => {
        let resData = {
          name: res.name,
          value: res.rcount
        };
        data.push(resData);
      });
      let optionMap = {
        backgroundColor: '#f8f8f8',
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.value) {
              return params.name + ' : ' + params.value;
            } else {
              return params.name + '0';
            }
          }
        },
        // 左侧小导航图标
        visualMap: {
          show: true,
          x: 'left',
          y: 'center',
          calculable: true,
          color: ['#00467f', '#7cc1f9'],
        },
        // 配置属性
        series: [{
          name: '数据',
          type: 'map',
          mapType: 'china',
          roam: true,
          label: {
            normal: {
              show: true // 省份名称
            },
            emphasis: {
              show: false
            }
          },
          data: data // 数据
        }]
      };
      myChart.setOption(optionMap);
    },
    // 新老用户饼图
    getUserStateRatio() {
      let myChart = echarts.init(document.getElementById('userStateRatio'));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [{
          name: '新老用户',
          type: 'pie',
          radius: '55%',
          center: ['50%', '45%'],
          data: this.userStateRatio,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
    },
    // 日均分时测量统计
    getHoursFrequency() {
      if (!this.hoursFrequency) {
        return false;
      }
      if (this.firstChart) {
        this.firstChart.dispose();
      }
      this.firstChart = echarts.init(document.getElementById('usageInfo'));
      let yData = [];
      let sumData1 = [];
      let sumData2 = [];
      this.hoursFrequency.forEach(res => {
        yData.push(res.name);
        sumData1.push(res.sum1.count);
        sumData2.push(res.sum2.count);
      });
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['测量次数统计', '脉诊仪活跃量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: yData
        },
        yAxis: {
          type: 'value',
        },
        series: [{
            name: '测量次数统计',
            type: 'line',
            data: sumData2
          },
          {
            name: '脉诊仪活跃量',
            type: 'line',
            data: sumData1
          },
        ]
      };
      this.firstChart.setOption(option);
    },
    // 日均测量频次统计
    getOneDayFrequency() {
      if (!this.oneDayFrequency) {
        return false;
      }
      if (this.firstChart) {
        this.firstChart.dispose();
      }
      this.firstChart = echarts.init(document.getElementById('usageInfo'));
      let yData = [];
      let sumData1 = [];
      let sumData2 = [];
      this.oneDayFrequency.forEach(res => {
        yData.push(res.name + '次');
        sumData1.push(res.sum1.count);
        sumData2.push(res.sum2.count);
      });
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['测量次数统计', '脉诊仪活跃量']
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: yData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
            name: '测量次数统计',
            type: 'line',
            data: sumData2
          },
          {
            name: '脉诊仪活跃量',
            type: 'line',
            data: sumData1
          }
        ]
      };
      this.firstChart.setOption(option);
    },
    // 引流统计
    getDrainageCharts(flg) {
      let cData = null;
      let unit = '';
      let title = '注册用户';
      let color = '#C33531';
      let mi = 1;
      let drainageData = this.drainageData;
      if (flg === 'regisFlg') {
        color = '#C33531';
        unit = '人';
        title = '注册用户';
        cData = drainageData.user;
        mi = 1;
      } else if (flg === 'orderFlg') {
        color = '#64BD3D';
        unit = '单';
        title = '下单量';
        cData = drainageData.ordernumber;
        mi = 1;
      } else if (flg === 'saleFlg') {
        color = '#16A085';
        unit = '元';
        title = '销售额';
        cData = drainageData.ordermoney;
        mi = 0;
      }
      if (!cData) {
        return;
      }
      if (this.drainageChartEl) {
        this.drainageChartEl.dispose();
      }
      this.drainageChartEl = echarts.init(document.getElementById('drainageCharts'));
      let xData = [];
      let sData = [];
      cData.items.forEach(res => {
        xData.push(res.date);
        sData.push(res.val);
      });
      let option = {
        title: {
          text: `总共${cData.rcount}${unit}   日均${cData.avg_rcount}${unit}`,
          axisPointer: {
            type: 'shadow'
          }
        },
        tooltip: {},
        legend: {
          data: [title]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          data: xData,
          boundaryGap: [0, 0.01],
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          minInterval: mi
        },
        series: [{
          name: title,
          type: 'bar',
          data: sData,
          barWidth: '45%',
          itemStyle: {
            normal: {
              color: color
            }
          }
        }]
      };
      this.drainageChartEl.setOption(option);
    },
    // 引流按钮点击
    drainageHanlder(flg) {
      // 注册用户
      this.drainageType = flg;
      if (flg === 'regisFlg' && !this.regisFlg) {
        this.regisFlg = true;
        this.orderFlg = false;
        this.saleFlg = false;
        // this.getDrainageCharts(flg);
      }
      // 订单量
      if (flg === 'orderFlg' && !this.orderFlg) {
        this.orderFlg = true;
        this.saleFlg = false;
        this.regisFlg = false;
        // this.getDrainageCharts(flg);
      }
      // 销售额
      if (flg === 'saleFlg' && !this.saleFlg) {
        this.saleFlg = true;
        this.regisFlg = false;
        this.orderFlg = false;
      }
      this.getDrainageCharts(flg);
    },

    // 引流统计接口调用
    async getDrainageData() {
      let url = '/api/jinmu/GetOrderStatistics';
      this.requestModel.starttime = this.timeFiltrate[0];
      this.requestModel.endtime = this.timeFiltrate[1];
      let res = await ajax.get(url, { params: this.requestModel });
      if (res.status === 200 && res.data && res.data.code === 0) {
        this.drainageData = res.data.data;
      }
      return true;
    },
    // 搜索
    searchData() {
      this.getUserResult();
      this.usageQuery(this.usageFlag);
      this.getDrainageData().then((res) => {
        if (res && this.drainageData) {
          this.getDrainageCharts(this.drainageType);
        }
      });
    },
    usageQuery(flag) {
      this.usageFlag = flag;
      switch (flag) {
        case '1':
          this.getUsageData(1, '测量次数', '#4BABDE');
          break;
        case '2':
          this.getUsageData(2, '活跃用户', '#ca8622');
          break;
        case '3':
          this.getUsageData(3, '活跃设备', '#E43C59');
          break;
        case '4':
          this.getUsageData(4);
          break;
        case '5':
          this.getUsageData(5);
          break;
        default:
          break;
      }
    },
    async getUsageData(type, title, color) {
      this.requestModel.starttime = this.timeFiltrate[0];
      this.requestModel.endtime = this.timeFiltrate[1];
      let url = '/api/jinmu/GetDeviceUseStatistics';
      let reportRes = await ajax.get(url, { params: this.requestModel });
      if (reportRes.status === 200 && reportRes.data && reportRes.data.code === 0) {
        let rs = null;
        if (type === 1) {
          rs = reportRes.data.data.testing;
        } else if (type === 2) {
          rs = reportRes.data.data.user;
        } else if (type === 3) {
          rs = reportRes.data.data.device;
        } else if (type === 4) {
          this.hoursFrequency = reportRes.data.data.hours;
          this.getHoursFrequency();
          return;
        } else if (type === 5) {
          this.oneDayFrequency = reportRes.data.data.days;
          this.getOneDayFrequency();
          return;
        }
        this.testCount = rs.rcount;
        this.testAvg = rs.day_avg;
        this.usePercentage = rs.percentage;
        this.buildUsageChart(this.chartAdapter(rs), title, color, type);
      }
    },

    // 适配图表需要的数据
    chartAdapter(dt) {
      let xAxis = [],
        data = [];
      for (let i = 0; i < dt.dates.length; i++) {
        xAxis.push(dt.dates[i].date);
        data.push(dt.dates[i].r0);
      }
      return { xAxis, data };
    },

    buildUsageChart(chartData, title, color, type) {
      if (!chartData) {
        return;
      }
      if (this.firstChart) {
        this.firstChart.dispose();
      }
      let unit = type === 2 ? '人' : type === 3 ? '台' : '次';
      this.firstChart = echarts.init(document.getElementById('usageInfo'));
      let optionText = `总共${this.testCount}${unit}   日均${this.testAvg}${unit}`;
      // 活跃设备
      if (type === 3) {
        optionText += `   使用率${this.usePercentage}%`;
      }
      let option = {
        title: {
          text: optionText,
          axisPointer: {
            type: 'shadow'
          }
        },
        tooltip: {},
        legend: {
          data: [title]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          data: chartData.xAxis,
          boundaryGap: [0, 0.01],
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
          name: title,
          type: 'bar',
          data: chartData.data,
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: color
            }
          }
        }]
      };
      this.firstChart.setOption(option);
    },
    // 导出引流数据
    GetStatisticsExecl() {
      this.requestModel.starttime = this.timeFiltrate[0];
      this.requestModel.endtime = this.timeFiltrate[1];
      let params = queryParams(this.requestModel);
      let url = `${process.env.BASE_HOST}/api/jinmu/GetStatisticsExeclOld?${params}`;
      let a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    // 导出使用数据
    export_usage_excel() {
      this.requestModel.starttime = this.timeFiltrate[0];
      this.requestModel.endtime = this.timeFiltrate[1];
      let params = queryParams(this.requestModel);
      let url = `${process.env.BASE_HOST}/api/jinmu/GetStatisticsExecl?${params}`;
      let a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    getGives() {
      let url = '/api/jinmu/GetAllGives';
      ajax.get(url).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 0) {
          this.gives = res.data.data;
        }
      });
    },
    getMacs() {
      let url = '/api/jinmu/GetAllMacs';
      ajax.get(url).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 0) {
          this.macs = res.data.data;
        }
      });
    }
  }
};

</script>
<style lang="less" scoped>
@border-line: solid 1px #e6e6e6;

// /deep/.el-container{
//   position: relative;
//   height: auto;
// }
.apparatus-page {
  padding: 0 100px 50px 100px;
}

.title {
  font-size: 24px;
  text-align: center;
  padding: 25px 0 10px;
}

.r-title {
  display: block;
  padding: 22px 0 36px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;

  &.usage_title {
    text-align: left;
  }
}

.r-txt {
  display: block;
  font-size: 16px;
  // font-weight: bold;
}

.txt-left,
.txt-right {
  display: block;
  color: #333;
}

.txt-left {
  padding-right: 15px;
}

.txt-right {
  padding-left: 15px;
}

.height390 {
  width: 100%;
  height: 390px;
}

.height420 {
  width: 100%;
  height: 420px;
}

.height450 {
  width: 100%;
  height: 450px;
}

.num-data {
  width: auto;
  border: @border-line;
  border-right: none;
  margin: 60px 0;
  text-align: center;

  .box {
    border-right: @border-line;
    padding: 10px 20px;
    font-size: 16px;

    label {
      display: block;
      line-height: 36px;
    }

    .tlt {
      font-weight: bold;
    }
  }
}

/*
.time-filtrate {
  text-align: center;

  .txt {
    display: inline-block;
  }

  .time-picker {
    margin: 0 25px;
  }
}*/

.user-result {
  margin: 56px 0;

  // .user-feature,
  // .measure-result {
  //   padding: 0 18px;
  // }

  .user-feature {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .user-feature-title {
      font-size: 16px;
    }
    .sex-percentage {
      flex: 1;
    }

    .user-feature-split {
      width: 100px;
      flex: none;
    }

    .self-other {
      flex: 1;
    }

  }

  .user-feature {
    margin-right: 18px;

    .self-other {
      margin: 60px 0;
    }

    .charts {
      width: calc(100% -30px);
      height: 44px;
      margin: 16px 0 36px;
      line-height: 44px;
      color: #fff;
      text-align: center;

      .male {
        background: #3b8eaf;
      }

      .female {
        background: #dd4f50;
      }

      .self {
        background: #55Bfcb;
      }

      .other {
        background: #acbad6;
      }
    }
  }
}

.user-situation {
  .r-txt {
    margin: 10px 0 25px;
    text-align: center;
  }
}

.drainage-box {
  width: 100%;
  margin: 80px 0;

  .drainage_summary {
    display: flex;
    width: 100%;
    border: 1px solid #eee;
    align-items: center;

    .drainage_summary_item {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #eee;

      &:last-child {
        border-right: none;
      }

      .summary_item_title {
        font-size: 14px;
        color: #666;
        padding: 10px 0;
      }

      .summary_item_number {
        font-size: 18px;
        color: #333;
        padding: 10px 0;
      }
    }
  }

  .btn_box {
    width: 100%;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 30px;
    position: relative;

    .export_excel {
      position: absolute;
      right: 20px;
      top: 0;
    }
  }

  .btn-box {
    text-align: center;
    position: relative;
    margin-bottom: 30px;

    .export_excel {
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
}

.legend {
  position: absolute;
  width: 50%;
  background-color: #f8f8f8;
  right: 0;
  top: 30px;
  padding: 30px;
  overflow: hidden;

  /deep/.trans_map_item {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .map_item_province {
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.width200 {
        width: 200px;
      }
    }

    .map_item_bar {
      width: calc(100% - 80px);
      display: flex;
      align-items: center;

      &.width200 {
        width: calc(100% - 200px);
      }

      height: 10px;
      font-size: 12px;
      color: #888;

      span {
        display: inline-block;
        height: 100%;
        background-color: red;
        margin-right: .5em;
      }
    }
  }
}

.hover:hover {
  cursor: pointer;
}

</style>
