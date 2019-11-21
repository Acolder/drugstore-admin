<template>
  <div class="box">
    <h2>
      <i class="el-icon-warning"></i>
      数据统计范围为今日0点到当前时间点，数据计算可能会存在5分钟左右的延迟。
    </h2>
    <!-- 今日实时数据 -->
    <el-radio-group v-model="tabPosition" style="margin-bottom: 10px;">
      <el-radio-button label="1">美团</el-radio-button>
      <el-radio-button label="2">饿百</el-radio-button>
      <el-radio-button label="4">京东</el-radio-button>
      <el-radio-button label="5">全部</el-radio-button>
    </el-radio-group>
    <div class="business-box">
      <div class="business-til">
        <h3>
          今日实时数据
        </h3>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="getTodayPoiData">刷新</el-button>
      </div>
      <div class="business-info">
        <ul class="listData" v-if="todayPoiData">
          <li>
            <div>
              营业额
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="营业额为商家的真实流水总额，包含商品原价，餐盒费。针对自配送，众包配送订单，会同时包含顾客实付配送费；针对其他配送类型订单，营业额将不再包含用户支付的配送费">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="todayPoiData.tTurnover != null">
                {{todayPoiData.tTurnover.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比昨日同时段
              <span v-if="todayPoiData.turnoverRatio > 0" class="red">
                ↑{{todayPoiData.turnoverRatio}}%
              </span>
              <span v-else-if="todayPoiData.turnoverRatio < 0" class="green">
                ↓{{todayPoiData.turnoverRatio.substring(1)}}%
              </span>
              <span v-else-if="todayPoiData.turnoverRatio == 0" class="green">
                {{todayPoiData.turnoverRatio}}%
              </span>
            </div>
          </li>
          <li>
            <div>
              预计订单收入
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="营业额扣除商家支出（包括商家补贴，平台服务费等）后的净收入，仅做数据展示，不做结算使用">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="todayPoiData.tWmPoiReceiveCent != null">
                {{todayPoiData.tWmPoiReceiveCent.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比昨日同时段
              <span v-if="todayPoiData.wmPoiReceiveCentRatio > 0" class="red">
                ↑{{todayPoiData.wmPoiReceiveCentRatio}}%
              </span>
              <span v-else-if="todayPoiData.wmPoiReceiveCentRatio < 0" class="green">
                ↓{{todayPoiData.wmPoiReceiveCentRatio.substring(1)}}%
              </span>
              <span v-else-if="todayPoiData.wmPoiReceiveCentRatio == 0" class="green">
                {{todayPoiData.wmPoiReceiveCentRatio}}%
              </span>
            </div>
          </li>
          <li>
            <div>
              有效订单量
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="商家已接单后，且未被取消的订单量">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span>
                {{todayPoiData.tOrderSum}}
              </span>
              <span>单</span>
            </div>
            <div>
              比昨日同时段
              <span v-if="todayPoiData.orderSumRatio > 0" class="red">
                ↑{{todayPoiData.orderSumRatio}}%
              </span>
              <span v-else-if="todayPoiData.orderSumRatio < 0" class="green">
                ↓{{todayPoiData.orderSumRatio.substring(1)}}%
              </span>
              <span v-else-if="todayPoiData.orderSumRatio == 0" class="green">
                {{todayPoiData.orderSumRatio}}%
              </span>
            </div>
          </li>
          <li>
            <div>
              单均价
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="有效订单的平均单价">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="todayPoiData.tAvgOrder != null">
                {{todayPoiData.tAvgOrder.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比昨日同时段
              <span v-if="todayPoiData.avgOrderRatio > 0" class="red">
                ↑{{todayPoiData.avgOrderRatio}}%
              </span>
              <span v-else-if="todayPoiData.avgOrderRatio < 0" class="green">
                ↓{{todayPoiData.avgOrderRatio.substring(1)}}%
              </span>
              <span v-else-if="todayPoiData.avgOrderRatio == 0" class="green">
                {{todayPoiData.avgOrderRatio}}%
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 历史营业数据 -->
    <h2>
      <i class="el-icon-warning"></i>
      历史数据统计范围，为今日0点之前数据，历史数据统计会延迟1日。
    </h2>
    <el-radio-group v-model="tabType" style="margin-bottom: 10px;">
      <el-radio-button label="1">美团</el-radio-button>
      <el-radio-button label="2">饿百</el-radio-button>
      <el-radio-button label="4">京东</el-radio-button>
      <el-radio-button label="5">全部</el-radio-button>
    </el-radio-group>
    <div class="business-box">
      <div class="business-til">
        <h3>
          历史营业数据
        </h3>
        <el-date-picker :clearable="false" class="time-picker" v-model="timeFiltrate" type="daterange" range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="getHistoryPoiData"></el-date-picker>
        <!-- <el-date-picker class="time-picker" v-model="timeFiltrate" type="daterange" range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" default-time="[00:00:00,00:00:00]" @change="getHistoryPoiData"></el-date-picker> -->
      </div>
      <div class="business-info">
        <div class="relevant">
          <span></span>
          <span>收入相关</span>
        </div>
        <ul class="listData" v-if="historyPoiData">
          <li>
            <div>
              营业额
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="营业额为商家的真实流水总额，包含商品原价，餐盒费。针对自配送，众包配送订单，会同时包含顾客实付配送费；针对其他配送类型订单，营业额将不再包含用户支付的配送费">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.turnover != null">
                {{historyPoiData.turnover.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.turnoverRatio > 0" class="red">
                ↑{{historyPoiData.turnoverRatio}}%
              </span>
              <span v-else-if="historyPoiData.turnoverRatio < 0" class="green">
                ↓{{historyPoiData.turnoverRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.turnoverRatio == 0" class="green">
                {{historyPoiData.turnoverRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.turnoverRatio}}
              </span>
            </div>
          </li>
          <li>
            <div>
              预计订单收入
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="营业额扣除商家支出（包括商家补贴，平台服务费等）后的净收入，仅做数据展示，不做结算使用">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.wmPoiReceiveCent != null">
                {{historyPoiData.wmPoiReceiveCent.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.wmPoiReceiveCentRatio > 0" class="red">
                ↑{{historyPoiData.wmPoiReceiveCentRatio}}%
              </span>
              <span v-else-if="historyPoiData.wmPoiReceiveCentRatio < 0" class="green">
                ↓{{historyPoiData.wmPoiReceiveCentRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.wmPoiReceiveCentRatio == 0" class="green">
                {{historyPoiData.wmPoiReceiveCentRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.wmPoiReceiveCentRatio}}
              </span>
            </div>
          </li>
          <li>
            <div>
              有效订单量
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="商家已接单后，且未被取消的订单量">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.orderSum != null">
                {{historyPoiData.orderSum}}
              </span>
              <span>单</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.orderSumRatio > 0" class="red">
                ↑{{historyPoiData.orderSumRatio}}%
              </span>
              <span v-else-if="historyPoiData.orderSumRatio < 0" class="green">
                ↓{{historyPoiData.orderSumRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.orderSumRatio == 0" class="green">
                {{historyPoiData.orderSumRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.orderSumRatio}}
              </span>
            </div>
          </li>
          <li>
            <div>
              单均价
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="有效订单的平均单价">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.avgOrder != null">
                {{historyPoiData.avgOrder.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.avgOrderRatio > 0" class="red">
                ↑{{historyPoiData.avgOrderRatio}}%
              </span>
              <span v-else-if="historyPoiData.avgOrderRatio < 0" class="green">
                ↓{{historyPoiData.avgOrderRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.avgOrderRatio == 0" class="green">
                {{historyPoiData.avgOrderRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.avgOrderRatio}}
              </span>
            </div>
          </li>
        </ul>
        <div class="relevant">
          <span></span>
          <span>支出相关</span>
        </div>
        <ul class="listData" v-if="historyPoiData">
          <li>
            <div>
              营业支出
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="商家支出的活动补贴和平台服务费之和，仅做数据展示，不做结算使用">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.expenses != null">
                {{historyPoiData.expenses.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.expensesRatio > 0" class="red">
                ↑{{historyPoiData.expensesRatio}}%
              </span>
              <span v-else-if="historyPoiData.expensesRatio < 0" class="green">
                ↓{{historyPoiData.expensesRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.expensesRatio == 0" class="green">
                {{historyPoiData.expensesRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.expensesRatio}}
              </span>
            </div>
          </li>
          <li>
            <div>
              商家补贴
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="商家承担的那部分活动补贴费用，仅做数据展示，不做结算使用">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.couponPrice != null">
                {{historyPoiData.couponPrice.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.couponPriceRatio > 0" class="red">
                ↑{{historyPoiData.couponPriceRatio}}%
              </span>
              <span v-else-if="historyPoiData.couponPriceRatio < 0" class="green">
                ↓{{historyPoiData.couponPriceRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.couponPriceRatio == 0" class="green">
                {{historyPoiData.couponPriceRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.couponPriceRatio}}
              </span>
            </div>
          </li>
          <li>
            <div>
              平台服务费
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                content="商家付给平台的佣金费用，仅做数据展示，不做结算使用">
                <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
              </el-popover>
            </div>
            <div>
              <span v-if="historyPoiData.foodShareFee != null">
                {{historyPoiData.foodShareFee.toFixed(2)}}
              </span>
              <span>元</span>
            </div>
            <div>
              比{{historyPoiData.apart}}天前同时段
              <span v-if="historyPoiData.foodShareFeeRatio > 0" class="red">
                ↑{{historyPoiData.foodShareFeeRatio}}%
              </span>
              <span v-else-if="historyPoiData.foodShareFeeRatio < 0" class="green">
                ↓{{historyPoiData.foodShareFeeRatio.substring(1)}}%
              </span>
              <span v-else-if="historyPoiData.foodShareFeeRatio == 0" class="green">
                {{historyPoiData.foodShareFeeRatio}}%
              </span>
              <span v-else class="green">
                {{historyPoiData.foodShareFeeRatio}}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 营业统计 -->
    <h2>
      <i class="el-icon-warning"></i>
      历史门店数据统计范围，为今日0点之前数据，历史数据统计会延迟1日。
    </h2>
    <el-radio-group v-model="tabType2" style="margin-bottom: 10px;">
      <el-radio-button label="1">美团</el-radio-button>
      <el-radio-button label="2">饿百</el-radio-button>
      <el-radio-button label="4">京东</el-radio-button>
      <el-radio-button label="5">全部</el-radio-button>
    </el-radio-group>
    <div class="statisticsBox">
      <div class="statisticsTop">
        <span>营业统计  ></span>
        <span>历史门店排行</span>
      </div>
      <div class="statisticsTil">
        <div>
          <h3>历史门店排行（共{{total}}家）</h3>
          <el-date-picker :clearable="false" class="time-picker" v-model="timeFiltrate2" type="daterange" range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="getQueryPoiData"></el-date-picker>
        </div>
        <div>
        </div>
      </div>
      <div class="statisticsTable">
        <div class="feedbackFeedback">
          <v-table ref="data_table" @sort-change="sortChange" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
          row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
        </div>
        <div class="pagin-wrapper">
          <v-pagination :pageSizeOption="[10]" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageNum" :page-size="business.pageSize"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      tabPosition: '5',
      tabType: '5',
      tabType2: '5',
      // 统计美团当日实时营业数据
      todayPoiData: null,
      // 统计美团历史营业数据
      // 请求参数
      business: {
        createStart: '',
        createEnd: '',
        abutmentFlag: '5',
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate(time) {
          let _now = Date.now();
          // console.log(_now);
          return time.getTime() > _now;
          // 大于当前的时间禁止选择
        }
      },
      timeFiltrate: [],
      historyPoiData: null,
      // 查询营业数据列表
      // 请求参数
      business2: {
        createStart: '',
        createEnd: '',
        pageSize: '10',
        pageNum: '1',
        abutmentFlag: '5',
      },
      timeFiltrate2: [],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '排序', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business2.pageNum - 1) * _self.business2.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '商家名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'turnover', title: '营业额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'wmPoiReceiveCent', title: '药店应收金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'foodShareFee', title: '平台费用', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'orderSum', title: '订单数量', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'productMoney', title: '商品总金额', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'couponPrice', title: '商家补贴金额', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'actOrderChargeByThird', title: '平台补贴金额', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'turnover') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0.00`;
            }
          };
        }
        if (item.field === 'wmPoiReceiveCent') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0.00`;
            }
          };
        }
        if (item.field === 'foodShareFee') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0`;
            }
          };
        }
        if (item.field === 'productMoney') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0.00`;
            }
          };
        }
        if (item.field === 'couponPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0.00`;
            }
          };
        }
        if (item.field === 'actOrderChargeByThird') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0.00`;
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    },
    'tabPosition': function() {
      this.switchData();
    },
    'tabType': function() {
      this.switchData2();
    },
    'tabType2': function() {
      this.switchData3();
    },
    // 'tabPosition': function() {
    //   if (this.tabPosition === 'customDays') {
    //     this.customDays();
    //   }
    // },
    // 'tabPosition2': function() {
    //   if (this.tabPosition2 === 'customDays') {
    //     this.customDays2();
    //   }
    // },
  },
  methods: {
    timeconversion2(time) {
      let d = new Date(time);
      let year = d.getFullYear();
      let month = '0' + (d.getMonth() + 1);
      let date = '0' + d.getDate();
      let hour = '00';
      let minute = '00';
      let second = '00';
      return year + '-' + month.substring(month.length - 2, month.length) + '-' + date.substring(date.length - 2, date.length)
          + ' ' + hour.substring(hour.length - 2, hour.length) + ':'
          + minute.substring(minute.length - 2, minute.length) + ':'
          + second.substring(second.length - 2, second.length);
    },
    // 统计美团当日实时营业数据
    getTodayPoiData() {
      javaAjax.post(`/mall_manage/back/order/todayPoiData`, { abutmentFlag: this.tabPosition }).then((res) => {
        console.log('统计美团当日实时营业数据', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.todayPoiData = res.data.resultData;
        }
      });
    },
    // 统计美团历史营业数据
    getHistoryPoiData() {
      if (this.timeFiltrate !== null && this.timeFiltrate.length > 0) {
        this.business.createStart = this.timeFiltrate[0];
        this.business.createEnd = this.timeFiltrate[1];
      } else {
        this.business.createStart = '';
        this.business.createEnd = '';
      }
      console.log('请求参数', this.business);
      javaAjax.post(`/mall_manage/back/order/historyPoiData`, this.business).then((res) => {
        console.log('统计美团历史营业数据', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.historyPoiData = res.data.resultData;
        }
      });
    },
    // 默认日期为昨天
    defaultTime() {
      this.business.createEnd = new Date();
      this.business.createStart = new Date(this.business.createEnd.getTime() - (24 * 60 * 60 * 1000 * 1));
      this.business.createEnd = this.timeconversion2(this.business.createEnd);
      this.business.createStart = this.timeconversion2(this.business.createStart);
      this.timeFiltrate = [this.business.createStart, this.business.createEnd];
      this.getHistoryPoiData();
    },
    // 查询营业数据列表
    getQueryPoiData() {
      if (this.timeFiltrate2 !== null && this.timeFiltrate2.length > 0) {
        this.business2.createStart = this.timeFiltrate2[0];
        this.business2.createEnd = this.timeFiltrate2[1];
      } else {
        this.business2.createStart = '';
        this.business2.createEnd = '';
      }
      console.log('请求参数', this.business2);
      javaAjax.post(`/mall_manage/back/order/queryPoiData`, this.business2).then((res) => {
        console.log('查询营业数据列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data.map(item => {
            // sellerUser对象空异常处理
            let temp = '';
            // 判断是否返回sellerUser
            if (item.sellerUser) {
              //  要是返回了sellerUser 再次判断sellerUser是否有sellerName字段
              if (item.sellerUser.sellerName) {
                temp = item.sellerUser.sellerName;
              }
            } else {
              temp = item.sellerUserId;
            }
            return {
              // sellerName: item.sellerUser.sellerName,
              sellerName: temp,
              turnover: item.turnover,
              wmPoiReceiveCent: item.wmPoiReceiveCent,
              foodShareFee: item.foodShareFee,
              orderSum: item.orderSum,
              productMoney: item.productMoney,
              couponPrice: item.couponPrice,
              actOrderChargeByThird: item.actOrderChargeByThird,
            };
          });
          // this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // 默认日期为昨天
    defaultTime2() {
      this.business2.createEnd = new Date();
      this.business2.createStart = new Date(this.business2.createEnd.getTime() - (24 * 60 * 60 * 1000 * 1));
      this.business2.createEnd = this.timeconversion2(this.business2.createEnd);
      this.business2.createStart = this.timeconversion2(this.business2.createStart);
      this.timeFiltrate2 = [this.business2.createStart, this.business2.createEnd];
      this.getQueryPoiData();
    },
    // 首字母大写
    titleCase(str) {
      return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    },
    // 排序
    sortChange(params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          let name = 'orderBy' + this.titleCase(key);
          this.$delete(this.business2, name);
          let value = params[key];
          if (value) {
            this.$set(this.business2, name, value);
          }
        }
      }
      this.getQueryPoiData();
    },
    // 查询
    query() {
      this.getQueryPoiData();
    },
    // 全选反选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 分页
    pageChange(pageIndex) {
      this.business2.pageNum = pageIndex;
      this.getQueryPoiData();
    },
    pageSizeChange(pageSize) {
      this.business2.pageSize = pageSize;
      this.getQueryPoiData();
    },
    // 切换类型
    switchData() {
      console.log(this.tabPosition);
      this.getTodayPoiData();
    },
    // 切换类型
    switchData2() {
      console.log(this.tabType);
      this.business.abutmentFlag = this.tabType;
      this.getHistoryPoiData();
    },
    // 切换类型
    switchData3() {
      console.log(this.tabType2);
      this.business2.pageNum = '1';
      this.business2.abutmentFlag = this.tabType2;
      this.getQueryPoiData();
    }
  },
  created() {
    this.getTodayPoiData();
    this.defaultTime();
    this.defaultTime2();
  },
};
</script>
<style lang="less" scoped>
.box{
  padding:10px;
  background: #f7f7fa;
  h2{
    margin-top: 10px;
    margin-bottom: 10px;
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: bold;
    border:1px solid #f8e5b4;
    background: #f7f1e1;
    i{
      color:#E6A23C;
    }
  }
}
.business-box{
  padding:10px;
  background: #fff;
}
.business-til{
  height: 40px;
  display: flex;
  margin-bottom: 20px;
  padding: 5px 0;
  h3{
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #3e4056;
    margin-right: 50px;
  }
}
.business-info{
  padding: 10px;
}
.relevant{
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  >span{
    display: inline-block;
    height: 20px;
    line-height: 20px;
    color: #585a6f;
  }
  >span:nth-child(1){
    width: 5px;
    background: #585a6f;
    margin-right: 10px;
  }
}
.listData{
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  li{
    width: 25%;
    height: 100px;
    >div:nth-child(1){
      height: 30px;
      line-height: 30px;
      /deep/ .el-button{
        padding: 0;
        border: none;
        background: none;
      }
    }
    >div:nth-child(2){
      height: 40px;
      line-height: 40px;
      font-size: 30px;
      >span:last-child{
        font-size: 14px;
      }
    }
    >div:nth-child(3){
      height: 30px;
      line-height: 30px;
      .red{
        color: red;
      }
      .green{
        color: green;
      }
    }
  }
}
.statisticsBox{
  background: #fff;
  .statisticsTop{
    // background: #f7f7fa;
    padding-left: 10px;
    height: 40px;
    display: flex;
    line-height: 40px;
    color: #858894;
    >span:last-child{
      color: #000;
    }
  }
  .statisticsTil{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;
    padding:0 10px;
    >div:nth-child(1){
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      h3{
        font-size: 20px;
        color: #000;
        margin-right: 40px;
      }
    }
  }
  .statisticsTable{
    margin-top: 10px;
    padding:0 10px;
  }
}
</style>