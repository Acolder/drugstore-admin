<template>
  <div class="homepage_wrapper clearfix">
    <div class="homepage_left">
      <div class="business_data">
        <div class="business_data_title">
          运营数据
        </div>
        <div class="business_data_row">
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">今日注册用户数</div>
              <div class="cell_content_data">{{businessData.today_regisuser}}</div>
            </div>
          </div>
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">今日订单数</div>
              <div class="cell_content_data">{{businessData.today_order}}</div>
            </div>
          </div>
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">今日销售额</div>
              <div class="cell_content_data">￥{{businessData.today_turnover}}</div>
            </div>
          </div>
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">本月订单数</div>
              <div class="cell_content_data">{{businessData.month_order}}</div>
            </div>
          </div>
        </div>
        <div class="business_data_row">
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">昨日注册用户数</div>
              <div class="cell_content_data">{{businessData.yesterday_regisuser}}</div>
            </div>
          </div>
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">昨日订单数</div>
              <div class="cell_content_data">{{businessData.yesterday_order}}</div>
            </div>
          </div>
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">昨日销售额</div>
              <div class="cell_content_data">￥{{businessData.yesterday_turnover}}</div>
            </div>
          </div>
          <div class="business_data_cell">
            <div class="cell_inner"></div>
            <div class="cell_content">
              <div class="cell_content_title">本月销售额</div>
              <div class="cell_content_data">￥{{businessData.month_turnover}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="business_report" style="display:none;">
        <div class="business_report_title">
          运营报表
        </div>
        <div class="business_searchbar">
          <el-form :inline="true" :model="queryParams" size="small" ref="home_query_form">
            <el-form-item>
              <el-select v-model="queryModel" placeholder="请选择" @change="queryModelChange">
                <el-option label="按日统计" :value="0">
                </el-option>
                <el-option label="按月统计" :value="1">
                </el-option>
                <el-option label="按年统计" :value="2">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="queryParams.startTime" :type="datePickerType" placeholder="选择起始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item> <span style="color: #ccc;">-</span></el-form-item>
            <el-form-item>
              <el-date-picker v-model="queryParams.endTime" :type="datePickerType" placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getReportData" :disabled="btnStatus">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="exportExcel" :disabled="btnStatus">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="business_report_chart" ref="chart_wrapper">
          <v-businesschart :options="options" :styles="styles" ref="businessChart"></v-businesschart>
        </div>
      </div>
    </div>
    <div class="homepage_right">
      <div class="homepage_notice_title">
        公告
      </div>
      <ul class="homepage_notice_list">
        <li class="notice_item">暂无</li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
.homepage_wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;

  .homepage_left {
    width: 60%;
    margin-right: 50px;
    float: left;

    .business_data {
      margin-bottom: 50px;

      .business_data_title {
        margin: 10px 0;
      }

      .business_data_row {
        margin-bottom: 10px;
        display: flex;

        .business_data_cell {
          flex: 1;
          position: relative;
          border: 1px solid #ccc;
          margin: 0 5px;
          overflow: hidden;

          &:last-child {
            margin: 0 0 0 5px;
          }

          &:first-child {
            margin: 0 5px 0 0;
          }

          .cell_inner {
            margin: 75%;
          }

          .cell_content {
            position: absolute;
            padding: 20px 0;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;

            .cell_content_title {
              font-size: 20px;
            }

            .cell_content_data {
              font-size: 22px;
              color: red;
              font-weight: bold;
            }
          }
        }
      }
    }

    .business_report {
      .business_report_title {
        margin-bottom: 10px;
      }
    }
  }

  .homepage_right {
    float: left;
    width: 30%;

    .homepage_notice_title {
      margin: 10px 0;
    }

    .homepage_notice_list {
      border: 1px solid #ccc;
      width: 100%;
      height: 400px;
      padding: 14px;
    }
  }
}

</style>
<script>
import businesschart from '@/components/businessChart/businessChart';
import netAjax from '@/utils/ajax';
import { Loading } from 'element-ui';
import { getMaxDate } from '@/utils/date';
export default {
  data() {
    return {
      btnStatus: false,
      businessData: {},
      queryParams: { startTime: '', endTime: '' },
      queryModel: 1,
      datePickerType: 'month',
      reportData: [],
      options: {
        credits: {
          enabled: false
        },
        title: {
          text: '业绩数据'
        },
        subtitle: {
          text: '数据来源：康美药业'
        },
        yAxis: {
          title: {
            text: '数据'
          }
        },
        xAxis: {
          title: {
            text: '时间'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        series: [],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      },
      styles: {
        width: 1000,
        height: 400
      }
    };
  },
  components: {
    'v-businesschart': businesschart
  },
  methods: {
    async getBusinessData() {
      let url = '/api/statistics/homeindextop';
      let res = await netAjax.post(url, { transport: '' });
      if (res.status === 200 && res.data && res.data.code === 0) {
        this.businessData = res.data.data;
      }
    },
    async getReportData() {
      let st = this.queryParams.startTime;
      let et = this.queryParams.endTime;
      if (!this.validate(st, et) || this.btnStatus) {
        return;
      }
      let aw = this.$refs['chart_wrapper'];
      let loading = Loading.service({ target: aw });
      this.btnStatus = true;
      let stObj = {
        year: st.getFullYear(),
        month: st.getMonth() + 1,
        date: st.getDate()
      };
      let etObj = {
        year: et.getFullYear(),
        month: et.getMonth() + 1,
        date: et.getDate()
      };
      if (this.queryModel === 1) {
        stObj.date = 1;
        etObj.date = getMaxDate(etObj.year, etObj.month);
      }
      if (this.queryModel === 2) {
        stObj.date = 1;
        stObj.month = 1;
        etObj.date = 31;
        etObj.month = 12;
      }
      let typeObj = {
        0: 'Day',
        1: 'Month',
        2: 'Year'
      };
      let url = '/api/statistics/homeindexbottom';
      let reportRes = await netAjax.post(url, {
        'type': typeObj[this.queryModel],
        'begin_year': stObj.year,
        'begin_month': stObj.month,
        'begin_day': stObj.date,
        'end_year': etObj.year,
        'end_month': etObj.month,
        'end_day': etObj.date
      });
      loading.close();
      this.btnStatus = false;
      if (reportRes.status === 200 && reportRes.data && reportRes.data.code === 0) {
        let rd = reportRes.data.data;
        let regisuser = rd.regisuser;
        let order = rd.order;
        let turnover = rd.turnover;
        let timeArr = [];
        let regisuserArr = [];
        let orderArr = [];
        let turnoverArr = [];
        for (let r in regisuser) {
          if (regisuser.hasOwnProperty(r)) {
            timeArr.push(r);
            regisuserArr.push(regisuser[r]);
          }
        }

        for (let o in order) {
          if (order.hasOwnProperty(o)) {
            orderArr.push(order[o]);
          }
        }

        for (let t in turnover) {
          if (turnover.hasOwnProperty(t)) {
            turnoverArr.push(turnover[t]);
          }
        }
        this.reportData.length = 0;
        this.reportData.push({ name: '注册用户数', data: regisuserArr });
        this.reportData.push({ name: '订单数', data: orderArr });
        this.reportData.push({ name: '销售额', data: turnoverArr });
        this.options.series = this.reportData;
        this.options.xAxis.categories = timeArr;
        this.$refs['businessChart'].initChart(this.options);
      }

    },
    exportExcel() {
      let st = this.queryParams.startTime;
      let et = this.queryParams.endTime;
      if (!this.validate(st, et) || this.btnStatus) {
        return;
      }
      let aw = this.$refs['chart_wrapper'];
      let loading = Loading.service({ target: aw });
      this.btnStatus = true;
      let stObj = {
        year: st.getFullYear(),
        month: st.getMonth() + 1,
        date: st.getDate()
      };
      let etObj = {
        year: et.getFullYear(),
        month: et.getMonth() + 1,
        date: et.getDate()
      };
      let typeObj = {
        0: 'Day',
        1: 'Month',
        2: 'Year'
      };
      if (this.queryModel === 1) {
        stObj.date = 1;
        etObj.date = getMaxDate(etObj.year, etObj.month);
      }
      if (this.queryModel === 2) {
        stObj.date = 1;
        stObj.month = 1;
        etObj.date = 31;
        etObj.month = 12;
      }
      let r = {
        '1': typeObj[this.queryModel],
        '2': stObj.year,
        '3': stObj.month,
        '4': stObj.date,
        '5': etObj.year,
        '6': etObj.month,
        '7': etObj.date
      };
      let url = `${process.env.BASE_HOST}/api/statistics/exporthomeindexbottom?type=${r['1']}&begin_year=${r['2']}&begin_month=${r['3']}&begin_day=${r['4']}&end_year=${r['5']}&end_month=${r['6']}&end_day=${r['7']}`;
      let a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.btnStatus = false;
      loading.close();
    },
    validate(st, et) {
      if (!st || !et) {
        this.$alert('请选择开始时间和结束时间');
        return false;
      }
      if (st > et) {
        this.$alert('开始时间不能大于结束时间');
        return false;
      }
      if (this.queryModel === 0) {
        let dis = (et - st) / (1000 * 60 * 60 * 24);
        if (dis > 30) {
          this.$alert('按日统计时间跨度不能大于30天');
          return false;
        }
      }
      if (this.queryModel === 1) {
        let ms = this.getMonths(st, et);
        if (ms > 30) {
          this.$alert('按月统计时间跨度不能大于30个月');
          return false;
        }
      }
      return true;
    },
    getMonths(st, et) {
      let sy = st.getFullYear();
      let ey = et.getFullYear();
      let sm = st.getMonth() + 1;
      let em = et.getMonth() + 1;
      let dis = 0;
      if (sy === ey) {
        dis = em - sm;
      } else if (ey > sy) {
        dis = (ey - sy) * 12 - sm + em;
      }
      return dis;
    },
    queryModelChange(v) {
      if (v === 0) {
        this.datePickerType = 'date';
        this.queryParams.startTime = new Date();
        this.queryParams.endTime = new Date();
      } else if (v === 1) {
        this.datePickerType = 'month';
        this.queryParams.startTime = new Date();
        this.queryParams.endTime = new Date();
      } else {
        this.datePickerType = 'year';
        this.queryParams.startTime = new Date();
        this.queryParams.endTime = new Date();
      }
    }
  },
  mounted() {
    this.getBusinessData();
    this.queryParams.startTime = new Date();
    this.queryParams.endTime = new Date();
    this.getReportData();
  }
};

</script>
