<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="渠道选择">
              <el-select v-model="business.abutmentflag" size='small' placeholder="请选择渠道">
                <el-option
                  v-for="item in abutmentflagArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <el-select v-model.number="business.status" size='small' placeholder="请选择状态">
                <el-option
                  v-for="item in statusArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市：">
              <el-input v-model="business.addressCity" placeholder="请输入城市名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单编号">
              <el-input v-model="business.orderId" placeholder="请输入订单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="药店id：">
              <el-input v-model="business.sellerId" placeholder="请输入药店id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
              <el-button type="default" size="small" @click="exportActive">导 出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="时间筛选">
              <!-- <el-date-picker class="time-picker"
                v-model="timeFiltrate"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker> -->
              <el-date-picker class="time-picker"
                v-model="timeFiltrate"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <!-- <el-date-picker class="el-date-picker" v-model="business.createStart" type="datetime" placeholder="开始日期"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker> -->
              <!-- <el-date-picker class="el-date-picker" v-model="business.createEnd" type="datetime" placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="sumOfMoney">
      <div class="sumOfMoney-til">金额汇总</div>
      <div class="sumOfMoney-line border-bot">
          <p>平台费用：¥{{orderListData.foodShareFeeSum}}</p>
          <p>平台优惠汇总金额：¥{{orderListData.actOrderChargeByThirdSum}}</p>
          <p>运费汇总金额：¥{{orderListData.orderPostageSum}}</p>
      </div>
      <div class="sumOfMoney-line">
          <p>商家优惠汇总金额：¥{{orderListData.couponPriceSum}}</p>
          <p>实付汇总金额：¥{{orderListData.orderAggregateSum}}</p>
          <p>
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              content="商家预计收入计算规则：实际付款金额-配送费用-平台扣费。">
              <el-button slot="reference"> <i class="el-icon-question"></i> </el-button>
            </el-popover>
            商家应收汇总金额：¥{{orderListData.wmPoiReceiveCentSum}}
          </p>
      </div>
    </div>
    <div class="feedbackFeedback">
      <v-table ref="data_table"  @sort-change="sortChange" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination :pageSizeOption="[15]" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageNum" :page-size="business.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
     <!-- 查看详情 -->
    <el-dialog title="订单详情" :visible.sync="detailDataLog" :modal-append-to-body="false" width="85%" center>
      <div class="info-til">
        <div class="info-btn">基本信息</div>
        <div class="order-status">
          <span  v-if="detailData.orderStatus == 0">订单已取消</span>
          <span  v-if="detailData.orderStatus == 10">待付款</span>
          <span  v-if="detailData.orderStatus == 20">待发货</span>
          <span  v-if="detailData.orderStatus == 30">订单配送中</span>
          <span  v-if="detailData.orderStatus == 40">订单已完成</span>
          <span  v-if="detailData.orderStatus == 50">订单已退款</span>
          <span  v-if="detailData.orderStatus == 60">部分退款</span>
          <span  v-if="detailData.orderStatus == 70">退款中</span>
          <span  v-if="detailData.orderStatus == 80">待评价</span>
          <span  v-if="detailData.orderStatus == 90">处方待审核</span>
          <span  v-if="detailData.orderStatus == 100">处方审核未通过</span>
        </div>
      </div>
      <div class="info-box">
        <div class="layered">
          <p>客户名称：{{userAddress.addressName}}</p>
          <p>客户电话：{{userAddress.addressPhone}}</p>
          <p>收货地址：{{userAddress.totalAddress}}</p>
        </div>
        <div class="layered">
          <p>发票抬头：{{invoiceInfo.invoiceType}}</p>
          <p>名称：{{invoiceInfo.invoiceTitle}}</p>
          <p>纳税号：{{invoiceInfo.taxNum}}</p>
        </div>
        <div class="layered">
          <p>客户实付：¥ {{detailData.orderPayment}}</p>
          <p>商品金额：¥ {{detailData.prdouctSumMoney}}</p>
          <p>运费：¥ {{detailData.orderPostage}}</p>
        </div>
        <div class="layered">
          <p>商家活动支出：¥ {{detailData.couponPrice}}</p>
          <p>第三方活动支出：¥ {{detailData.actOrderChargeByThird}}</p>
          <p>商家预收入：¥ {{detailData.wmPoiReceiveCent}}</p>
        </div>
        <div class="layered">
          <p>第三方平台扣费：¥ {{detailData.foodShareFee}}</p>
          <p>下单时间：{{createDate}}</p>
          <p>备注：{{detailData.caution}}</p>
        </div>
        <div class="layered">
          <p>订单编号：{{detailData.orderId}}</p>
          <p>门店：{{sellerUser.sellerName}}</p>
          <p>地址：{{sellerUser.sellerAddress}}</p>
        </div>
        <div class="layered">
          <p>
            渠道：
            <span v-if="detailData.abutmentFlag == 1">美团</span>
            <span v-if="detailData.abutmentFlag == 2">饿了么</span>
            <span v-if="detailData.abutmentFlag == 4">京东到家</span>
          </p>
          <p>渠道订单号：{{detailData.channelOrderId}}</p>
        </div>
      </div>
      <div class="info-til">
        <div class="info-btn">药品信息</div>
      </div>
      <div class="info-box">
        <div class="feedbackFeedback">
          <v-table ref="data_table2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
          row-click-color="#edf7ff"></v-table>
        </div>
        <div class="totalAmount">合计： ¥ {{Number(detailData.prdouctSumMoney).toFixed(2)}}</div>
      </div>
      <div class="info-til">
        <div class="info-btn">配送&退款信息</div>
      </div>
      <div class="info-box">
        <div v-if="informationPo.length>0">
          <h3>骑手姓名：{{informationPo[0].dispatcherName}}    {{informationPo[0].dispatcherMobile}}</h3>
          <ul class="logistics-wrapper">
            <li class="logistics-item" v-for="item in informationPo" :key="item.index">
              <div class="logistics-line"><i></i></div>
              <div class="dispatche dispatcheStatus">
                <span v-if="item.logisticsStatus == 0">配送单发往配送</span>
                <span v-if="item.logisticsStatus == 10">配送单已确认</span>
                <span v-if="item.logisticsStatus == 15">骑手已到店</span>
                <span v-if="item.logisticsStatus == 20">骑手已取药</span>
                <span v-if="item.logisticsStatus == 40">骑手已送达</span>
                <span v-if="item.logisticsStatus == 100">配送单已取消</span>
              </div>
              <div class="dispatche dispatcheTime">{{item.time}}</div>
            </li>
          </ul>
        </div>
        <div v-if="mtRefundPo.notifyType">
          <h3>退款信息</h3>
          <div class="refund-box">
            <p>
              通知类型：
              <span v-if="mtRefundPo.notifyType == 'apply'">发起退款</span>
              <span v-if="mtRefundPo.notifyType == 'agree'">确认退款</span>
              <span v-if="mtRefundPo.notifyType == 'reject'">驳回退款</span>
              <span v-if="mtRefundPo.notifyType == 'cancelRefund'">用户取消退款申请</span>
            </p>
            <p>退款原因：{{mtRefundPo.reason}}</p>
          </div>
          <div class="refund-box">
            <p>
              退款处理：
              <span v-if="mtRefundPo.resType == 0">未处理</span>
              <span v-if="mtRefundPo.resType == 1">商家驳回退款请求</span>
              <span v-if="mtRefundPo.resType == 2">商家同意退款</span>
              <span v-if="mtRefundPo.resType == 3">客服驳回退款请求</span>
              <span v-if="mtRefundPo.resType == 4">客服帮商家同意退款</span>
              <span v-if="mtRefundPo.resType == 5">超过3小时自动同意</span>
              <span v-if="mtRefundPo.resType == 6">系统自动确认</span>
              <span v-if="mtRefundPo.resType == 7">用户取消退款申请</span>
              <span v-if="mtRefundPo.resType == 8">用户取消退款申诉</span>
            </p>
            <p>
              是否申诉退款：
              <span v-if="mtRefundPo.isAppeal == 0">否</span>
              <span v-if="mtRefundPo.isAppeal == 1">是</span>
            </p>
          </div>
        </div>
        <!-- <ul class="logistics-wrapper">
          <li class="logistics-item">
            <div class="logistics-line"><i></i></div>
            <div>
              <div class="refund-txt refund-txt-t">用户取消退款申诉</div>
              <div class="refund-txt refund-txt-b">用户取消退款申诉</div>
            </div>
            <div class="refund">2019-1-15：23:11</div>
          </li>
        </ul> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // 药店数组
      drugstoreNameArray: [],
      // 请求参数
      business: {
        pageNum: 1,
        pageSize: 15,
        addressCity: '',
        sellerId: '',
        orderId: '',
        abutmentflag: '',
        status: '',
        createStart: '',
        createEnd: '',
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
        }]
      },
      timeFiltrate: [],
      // 渠道
      abutmentflagArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 订单状态
      statusArray: [
        { value: 0, label: '订单已取消' },
        // { value: 10, label: '待付款' },
        // { value: 20, label: '待发货' },
        { value: 30, label: '订单配送中' },
        { value: 40, label: '订单已完成' },
        { value: 50, label: '订单已退款' },
        // { value: 60, label: '部分退款' },
        // { value: 70, label: '退款中' },
        // { value: 80, label: '待评价' },
        // { value: 90, label: '处方待审核' },
        // { value: 100, label: '处方审核未通过' },
      ],
      // 全部数据
      orderListData: {},
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      detailDataLog: false,
      // 订单全部详情数据
      detailData: {},
      // 订单创建时间
      createDate: '',
      // 发票信息
      invoiceInfo: {},
      // 用户信息
      userAddress: {},
      // 商户信息
      sellerUser: {},
      // 商品表格数据
      tableData2: [],
      // 美团配送物流
      informationPo: [],
      // 退款信息
      mtRefundPo: {
        notifyType: '',
        reason: '',
        resType: '',
        isAppeal: '',
      }
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
      this.$refs['data_table2'].resize();
    },
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageNum - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        // { field: 'abutmentFlag', title: '渠道', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'channelOrderId', title: '渠道订单号', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'sellerName', title: '药店名称', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'sellerUserId', title: '药店id', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'orderId', title: '药葫芦订单id', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'orderStatus', title: '订单状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'foodShareFee', title: '第三方扣费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // // { field: 'actOrderChargeByThird', title: '第三方优惠金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // // { field: 'orderPostage', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'orderPayment', title: '实付金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'wmPoiReceiveCent', title: '商家应收金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        // { field: 'createDate', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: 'abutmentFlag', title: '渠道', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'orderId', title: '订单编号', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'sellerName', title: '门店名称', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'addressCity', title: '所在城市', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'orderPayment', title: '客户实付', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'orderPostage', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'activitySupport', title: '优惠支出', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'orderStatus', title: '订单状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, },
        { field: 'createDate', title: '下单时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: '' },
        { field: '', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformOrderList', isResize: true }
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
        if (item.field === 'abutmentFlag') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:#f37b1d;">美团</span>`;
            } else if (value === 2) {
              return `<span style="color:#3bb4f2;">饿了么</span>`;
            } else if (value === 4) {
              return `<span style="color:red;">京东到家</span>`;
            }
          };
        }
        if (item.field === 'orderStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '0') {
              return `<span style="color:gray;">订单已取消</span>`;
            } else if (value === '10') {
              return `待付款`;
            } else if (value === '20') {
              return `待发货`;
            } else if (value === '30') {
              return `订单配送中`;
            } else if (value === '40') {
              return `<span style="color:green;">订单已完成</span>`;
            } else if (value === '50') {
              return `订单已退款`;
            } else if (value === '60') {
              return `部分退款`;
            } else if (value === '70') {
              return `退款中`;
            } else if (value === '80') {
              return `待评价`;
            } else if (value === '90') {
              return `处方待审核`;
            } else if (value === '100') {
              return `<span style="color:red;">处方审核未通过</span>`;
            }
          };
        }
        if (item.field === 'orderPayment') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0`;
            }
          };
        }
        if (item.field === 'orderPostage') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0`;
            }
          };
        }
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              value = _self.timeConversion(value);
              return value;
            } else {
              return `-`;
            }
          };
        }
      }
      return columns;
    },
    columns2() {
      let columns2 = [
        { field: 'productName', title: '商品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productId', title: '商品id', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂家', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productApprovalNumber', title: '批准文号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '商品规格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'price', title: '商品价格', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantity', title: '商品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns2.length; i++) {
        let item = columns2[i];
        if (i < 0) {
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
        if (item.field === 'price') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '¥ ' + value.toFixed(2);
            } else {
              return `¥ 0`;
            }
          };
        }
      }
      return columns2;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 时间戳转换时间
    timeConversion(timeStamp) {
      let unixtimestamp = new Date(timeStamp);
      let year = 1900 + unixtimestamp.getYear();
      let month = '0' + (unixtimestamp.getMonth() + 1);
      let date = '0' + unixtimestamp.getDate();
      let hour = '0' + unixtimestamp.getHours();
      let minute = '0' + unixtimestamp.getMinutes();
      let second = '0' + unixtimestamp.getSeconds();
      return year + '-' + month.substring(month.length - 2, month.length) + '-' + date.substring(date.length - 2, date.length)
          + ' ' + hour.substring(hour.length - 2, hour.length) + ':'
          + minute.substring(minute.length - 2, minute.length) + ':'
          + second.substring(second.length - 2, second.length);
    },
    // 中国标准时间转换时间
    timeconversion2(time) {
      let d = new Date(time);
      let year = d.getFullYear();
      let month = '0' + (d.getMonth() + 1);
      let date = '0' + d.getDate();
      let hour = '0' + d.getHours();
      let minute = '0' + d.getMinutes();
      let second = '0' + d.getSeconds();
      return year + '-' + month.substring(month.length - 2, month.length) + '-' + date.substring(date.length - 2, date.length)
          + ' ' + hour.substring(hour.length - 2, hour.length) + ':'
          + minute.substring(minute.length - 2, minute.length) + ':'
          + second.substring(second.length - 2, second.length);
    },
    // 默认日期为最近三天
    defaultTime() {
      // this.business.createEnd = new Date();
      // this.business.createStart = new Date(this.business.createEnd.getTime() - (24 * 60 * 60 * 1000 * 3));
      // this.business.createEnd = this.timeconversion2(this.business.createEnd);
      // this.business.createStart = this.timeconversion2(this.business.createStart);
      // this.timeFiltrate = [this.business.createStart, this.business.createEnd];
      // this.getTableData();
      this.business.createEnd = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
      let tempTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
      this.business.createStart = new Date(tempTime.getTime() - (24 * 60 * 60 * 1000 * 3));
      this.business.createEnd = this.timeconversion2(this.business.createEnd);
      this.business.createStart = this.timeconversion2(this.business.createStart);
      this.timeFiltrate = [this.business.createStart, this.business.createEnd];
      this.getTableData();
    },
    // 列表数据
    getTableData() {
      if (this.timeFiltrate !== null && this.timeFiltrate.length > 0) {
        this.business.createStart = this.timeFiltrate[0];
        this.business.createEnd = this.timeFiltrate[1];
      } else {
        this.business.createStart = '';
        this.business.createEnd = '';
      }
      console.log('请求参数', this.business);
      javaAjax.post(`/mall_manage/back/order/queryByAbutment`, this.business).then((res) => {
        console.log('第三方订单列表返回数据', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.orderListData = res.data.resultData;
          this.tableData = res.data.resultData.data.map(item => {
            // sellerUser对象空异常处理
            let temp = '';
            let temp2 = '';
            // 判断是否返回sellerUser
            if (item.sellerUser) {
              //  要是返回了sellerUser 再次判断sellerUser是否有sellerName字段
              if (item.sellerUser.sellerName) {
                temp = item.sellerUser.sellerName;
              }
              if (item.sellerUser.addressCity) {
                temp2 = item.sellerUser.addressCity;
              }
            }
            return {
              // 使用空异常处理过的值
              sellerName: temp,
              addressCity: temp2,
              abutmentFlag: item.abutmentFlag,
              orderId: item.orderId,
              orderPayment: item.orderPayment,
              orderPostage: item.orderPostage,
              activitySupport: '商家:¥ ' + item.couponPrice + '丨 平台:¥ ' + item.actOrderChargeByThird,
              orderStatus: item.orderStatus,
              createDate: item.createDate,
            };
          });
          this.total = res.data.resultData.total;
        }
      });
    },
    // 首字母大写
    titleCase(str) {
      return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    },
    // 排序
    sortChange(params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          let name = 'orderBy';
          this.$delete(this.business2, name);
          let value = params[key];
          if (value) {
            this.$set(this.business2, name, value);
          }
        }
      }
      this.getTableData();
    },
    // 清空
    empty() {
      this.business.pageNum = 1;
      this.business.pageSize = 15;
      this.business.orderId = '';
      this.business.sellerId = '';
      this.business.abutmentflag = '';
      this.business.addressCity = '';
      this.business.status = '';
      this.business.createStart = '';
      this.business.createEnd = '';
      // this.timeFiltrate = [this.business.createStart, this.business.createEnd];
      this.timeFiltrate = [];
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 导出按钮
    exportActive() {
      let orderId =  this.business.orderId;
      let sellerId = this.business.sellerId;
      let status = this.business.status;
      let abutmentflag = this.business.abutmentflag;
      let createStart = this.business.createStart;
      let createEnd = this.business.createEnd;
      let addressCity = this.business.addressCity;

      window.open(`${process.env.MALL_BASE_HOST}/mall_manage/back/order/exportAbutmentOrder?orderId=` + orderId + '&sellerId=' + sellerId +
      '&status=' + status + '&abutmentflag=' + abutmentflag + '&createStart=' + createStart + '&createEnd=' + createEnd +
      '&addressCity=' + addressCity);
    },
    // 自定义组件操作
    customCompFunc(params) {
      let that = this;
      // 详情
      if (params.type === 'seeDetails') { // do edit operation
        let data = {
          orderId: params.rowData.orderId
        };
        javaAjax.post(`/mall_manage/back/order/queryAbutmentOrderDetail`, data).then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.resultCode === '0') {
            //  订单全部详情数据
            this.detailData = res.data.resultData;
            // 订单创建时间
            this.createDate = this.timeConversion(res.data.resultData.createDate);
            // 商品信息
            if (res.data.resultData.orderDetail) {
              this.tableData2 = res.data.resultData.orderDetail;
            } else {
              this.tableData2 = [];
            }
            // 用户信息
            if (res.data.resultData.userAddress) {
              this.userAddress = res.data.resultData.userAddress;
            } else {
              this.userAddress = {};
            }
            // 商户信息
            if (res.data.resultData.sellerUser) {
              this.sellerUser = res.data.resultData.sellerUser;
            } else {
              this.sellerUser = {};
            }
            // 发票信息
            if (res.data.resultData.invoiceInfo) {
              this.invoiceInfo = res.data.resultData.invoiceInfo;
            } else {
              this.invoiceInfo = {};
            }
            // 美团配送物流
            if (res.data.resultData.informationPo) {
              this.informationPo = res.data.resultData.informationPo.map(item => {
                return {
                  dispatcherName: item.dispatcherName,
                  dispatcherMobile: item.dispatcherMobile,
                  logisticsStatus: item.logisticsStatus,
                  time: that.timeConversion(item.time * 1000)
                };
              });
            } else {
              this.informationPo = [];
            }
            // 发退款信息
            if (res.data.resultData.mtRefundPo) {
              this.mtRefundPo.notifyType = res.data.resultData.mtRefundPo.notifyType;
              this.mtRefundPo.reason = res.data.resultData.mtRefundPo.reason;
              this.mtRefundPo.resType = res.data.resultData.mtRefundPo.resType;
              this.mtRefundPo.isAppeal = res.data.resultData.mtRefundPo.isAppeal;
            } else {
              this.mtRefundPo = {};
            }
            this.detailDataLog = true;
          }
        });
      }
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
    pageChange(pageNum) {
      this.business.pageNum = pageNum;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableData();
    },
  },
  created() {
    this.defaultTime();
  },
};
</script>
<style lang="less" scoped>
.box{
  /deep/ .el-dialog.el-dialog--center{
    height: 700px;
    overflow-y: auto;
    color: #000;
  }
}
// 金额汇总
.sumOfMoney{
  width: 100%;
  height: 80px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  position: relative;
  .sumOfMoney-til{
    position: absolute;
    left: 50%;
    margin-left: -50px;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #fff;
    top: -20px;
    font-weight: bold;
  }
  .sumOfMoney-line{
    display: flex;
    padding: 0 10px;
    /deep/ .el-button{
     padding: 0;
     border: none;
     background: none;
    }
    >p{
      height: 40px;
      line-height: 40px;
      width: 33.3333%;
    }
  }
  .border-bot{
    border-bottom:1px dashed #ccc;
  }
}
// 详情弹窗
.info-til{
  height: 40px;
  background: #36A9E1;
  display: flex;
  color: #000;
  margin: 5px 0;
  .info-btn{
    font-weight: bold;
    height: 100%;
    line-height: 40px;
    padding: 0 10px;
  }
  .order-status{
    margin-left: 20px;
    font-weight: bold;
    line-height: 40px;
    color: red;
  }
}
.info-box{
  padding: 10px;
  border: 1px solid #000;
  .layered{
    display: flex;
    >p{
      width: 25%;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    >p:last-child{
      width: 50%;
    }
  }
  .totalAmount{
    height: 30px;
    line-height: 30px;
    color: #000;
    text-align: right;
    padding-right: 50px;
    font-weight: bold;
  }
  h3{
    height: 30px;
    line-height: 30px;
    color: #000;
  }
}
.logistics-wrapper{
  padding-left: 20px;
  li{
    display: flex;
    height: 50px;
    position: relative;
    padding-left: 20px;
    .logistics-line{
      position: absolute;
      width: 1px;
      height: 50px;
      background: #ccc;
      top: 0px;
      left: 0px;
      i{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ccc;
        position: absolute;
        top: 0px;
        left: -4.5px;
      }
    }
  }
  li:last-child{
    .logistics-line{
      i{
        background: orange;
      }
    }
  }
}
.dispatche,.refund{
  line-height: 50px;
}
.dispatcheStatus{
  width: 300px;
}
.refund-box{
  >p{
    width: 50%;
    height: 30px;
    line-height: 30px;
    color: #000;
  }
}
.refund-txt{
  width: 300px;
  line-height: 25px;
}
.refund-txt-t{
  color: #000;
}
.refund-txt-b{
  color: #666;
}
</style>

