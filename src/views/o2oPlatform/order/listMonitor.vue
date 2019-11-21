<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="渠道选择">
              <el-select v-model="business.abutmentFlag" size='small' placeholder="请选择">
                <el-option
                  v-for="item in abutmentflagArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态">
              <el-select v-model.number="business.status" size='small' placeholder="请选择">
                <el-option
                  v-for="item in statusArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input v-model.number="business.orderId" placeholder="请输入订单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店id">
              <el-input v-model.number="business.sellerId" placeholder="请输入门店id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input v-model.number="business.addressPhone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名称">
              <el-input v-model.number="business.addressName" placeholder="请输入用户名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 无数据 -->
    <div v-if="tableData.length<=0" class="no-tableData">
      <p></p>
      <span>暂无数据</span>
      <p></p>
    </div>
    <!-- 有数据 -->
    <ul>
      <li class="list-box" v-for="item in tableData" :key="item.index">
        <div class="box-flex list-top">
          <div class="box-flex list-top1">
            <div v-if="item.abutmentFlag == 1" class="meituan">
              美团
            </div>
            <div v-if="item.abutmentFlag == 2" class="eleme">
              饿了么
            </div>
            <div v-if="item.abutmentFlag == 4" class="jingdong">
              京东到家
            </div>
            <p class="state">立即送达</p>
            <p>创建订单时间：{{item.createDate}}</p>
          </div>
          <div class="list-top2 colorRed">
            <span  v-if="item.orderStatus == 0">订单已取消</span>
            <span  v-if="item.orderStatus == 10">待付款</span>
            <span  v-if="item.orderStatus == 20">待发货</span>
            <span  v-if="item.orderStatus == 30">订单配送中</span>
            <span  v-if="item.orderStatus == 40">订单已完成</span>
            <span  v-if="item.orderStatus == 50">订单已退款</span>
            <span  v-if="item.orderStatus == 60">部分退款</span>
            <span  v-if="item.orderStatus == 70">退款中</span>
            <span  v-if="item.orderStatus == 80">待评价</span>
            <span  v-if="item.orderStatus == 90">处方待审核</span>
            <span  v-if="item.orderStatus == 100">处方审核未通过</span>
          </div>
        </div>
        <div class="box-flex list-center">
          <div class="list-center1">
            <div>
              <p>{{item.timeConsuming}}</p>
            </div>
          </div>
          <div class="list-center2">
            <p class="box-flex">
              <span class="label100">客户：</span>
              <span class="flex1">{{item.userNickname}}  （电话： {{item.userMobile}}）</span>
            </p>
            <p class="box-flex">
              <span class="label100">地址：</span>
              <span class="flex1">{{item.userAddress}}</span>
            </p>
            <p class="box-flex">
              <span class="label100">订单编号：</span>
              <span class="flex1">{{item.orderId}}</span>
            </p>
            <p class="box-flex">
              <span class="label100">门店：</span>
              <span class="flex1">{{item.sellerName}}</span>
            </p>
            <p class="box-flex colorRed">
              <span class="label100">备注：</span>
              <span class="flex1">{{item.caution}}</span>
            </p>
          </div>
          <div class="list-center3">
            <p>
              <span class="label120">客户实付：</span>
              <span>¥ {{item.orderPayment}}</span>
            </p>
            <p>
              <span class="label120">商家活动支出：</span>
              <span>-¥ {{item.couponPrice}}</span>
            </p>
            <p>
              <span class="label120">平台活动支出：</span>
              <span>-¥ {{item.actOrderChargeByThird}}</span>
            </p>
            <p>
              <span class="label120">配送费：</span>
              <span>-¥ {{item.orderPostage}}</span>
            </p>
            <p>
              <span class="label120">平台费用：</span>
              <span>-¥ {{item.foodShareFee}}</span>
            </p>
            <p>
              <span class="label120">商家预计收入：</span>
              <span>¥ {{item.wmPoiReceiveCent}}</span>
            </p>
          </div>
        </div>
        <div class="box-flex list-bottom">
          <el-button type="success" size="mini" @click="seeOrder(item.orderId)">查看订单</el-button>
        </div>
      </li>
    </ul>
    <div class="pagin-wrapper">
      <v-pagination :pageSizeOption="[5]" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageNum" :page-size="business.pageSize"
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
        <div class="totalAmount">合计： ¥ {{detailData.prdouctSumMoney}}</div>
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
      // 请求参数
      business: {
        pageNum: 1,
        pageSize: 5,
        abutmentFlag: '',
        status: '',
        orderId: '',
        sellerId: '',
        addressPhone: '',
        addressName: '',
      },
      // 渠道
      abutmentflagArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 订单状态
      statusArray: [
        { value: 0, label: '订单已取消' },
        { value: 30, label: '订单配送中' },
        { value: 40, label: '订单已完成' },
        { value: 50, label: '订单已退款' },
      ],
      // 监控耗时
      timestamp: '',
      timer: '',
      // 全部数据
      // 表格数据
      tableData: [],
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
      this.$refs['data_table2'].resize();
    },
  },
  computed: {
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
      let month = '0' + d.getMonth() + 1;
      let date = '0' + d.getDate();
      let hour = '0' + d.getHours();
      let minute = '0' + d.getMinutes();
      let second = '0' + d.getSeconds();
      return year + '-' + month.substring(month.length - 2, month.length) + '-' + date.substring(date.length - 2, date.length)
          + ' ' + hour.substring(hour.length - 2, hour.length) + ':'
          + minute.substring(minute.length - 2, minute.length) + ':'
          + second.substring(second.length - 2, second.length);
    },
    // 耗时计算
    consumingTime(val1, val2) {
      let tem = val1 - val2;
      let hours = Math.floor(tem / (1000 * 60 * 60));
      let minutes = Math.floor((tem % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((tem % (1000 * 60)) / 1000);
      // console.log('总秒数为:' + tem, hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 ');
      if (hours === 0) {
        return minutes + ' 分钟 ' + seconds + ' 秒 ';
      } else if (hours === 0 && minutes === 0) {
        return seconds + ' 秒 ';
      } else {
        return hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 ';
      }
    },
    getTableData() {
      let _this = this;
      // clearInterval(_this.timer);
      console.log('请求参数', this.business);
      javaAjax.post(`/mall_manage/back/order/orderMonitor`, this.business).then((res) => {
        console.log('第三方订单监控返回数据', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data.map(item => {
            // sellerUser对象空异常处理
            // let temp = '';
            // let temp2 = '';
            // let temp3 = '';
            // let temp4 = '';
            // // 判断是否返回sellerUser
            // if (item.sellerUser) {
            //   //  要是返回了sellerUser 再次判断sellerUser是否有sellerName字段
            //   if (item.sellerUser.sellerName) {
            //     temp = item.sellerUser.sellerName;
            //   }
            // }
            // // 判断是否返回userAddress
            // if (item.userAddress) {
            //   //  要是返回了userAddress 再次判断userAddress是否有addressName字段
            //   if (item.userAddress.addressName) {
            //     temp2 = item.userAddress.addressName;
            //   }
            //   if (item.userAddress.addressPhone) {
            //     temp3 = item.userAddress.addressPhone;
            //   }
            //   if (item.userAddress.addressDetail) {
            //     temp4 = item.userAddress.addressDetail;
            //   }
            // }
            return {
              temSystemTime: item.systemTime,
              temCreateDate: item.createDate,
              createDate: this.timeConversion(item.createDate),
              timeConsuming: this.consumingTime(item.systemTime, item.createDate),
              orderStatus: item.orderStatus,
              abutmentFlag: item.abutmentFlag,
              sellerName: item.sellerUser.sellerName,
              userNickname: item.userAddress.addressName,
              userMobile: item.userAddress.addressPhone,
              userAddress: item.userAddress.addressDetail,
              // 使用空异常处理过的值
              // sellerName: temp,
              // userNickname: temp2,
              // userMobile: temp3,
              // userAddress: temp4,
              orderId: item.orderId,
              caution: item.caution,
              orderPayment: item.orderPayment,
              couponPrice: item.couponPrice,
              actOrderChargeByThird: item.actOrderChargeByThird,
              orderPostage: item.orderPostage,
              foodShareFee: item.foodShareFee,
              wmPoiReceiveCent: item.wmPoiReceiveCent,
            };
          });
          this.total = res.data.resultData.total;
          if (res.data.resultData.total > 0) {
            console.log('列表有数据的时候需要开启动态刷新时间');
            clearInterval(_this.timer);
            this.refreshTime();
          } else {
            console.log('列表无数据的时候无需动态刷新时间');
            clearInterval(_this.timer);
          }
        }
      });
    },
    getTimeData() {
      this.tableData = this.tableData.map(item => {
        return {
          temSystemTime: (item.temSystemTime + 1000),
          temCreateDate: item.temCreateDate,
          createDate: item.createDate,
          timeConsuming: this.consumingTime(item.temSystemTime, item.temCreateDate),
          orderStatus: item.orderStatus,
          abutmentFlag: item.abutmentFlag,
          sellerName: item.sellerName,
          userNickname: item.userNickname,
          userMobile: item.userMobile,
          userAddress: item.userAddress,
          orderId: item.orderId,
          caution: item.caution,
          orderPayment: item.orderPayment,
          couponPrice: item.couponPrice,
          actOrderChargeByThird: item.actOrderChargeByThird,
          orderPostage: item.orderPostage,
          foodShareFee: item.foodShareFee,
          wmPoiReceiveCent: item.wmPoiReceiveCent,
        };
      });
    },
    // 动态刷新时间
    refreshTime() {
      let _this = this;
      clearInterval(_this.timer);
      _this.timer = setInterval(function () {
        _this.getTimeData();
      }, 1000);
    },
    // 清空
    empty() {
      this.business.pageNum = 1;
      this.business.pageSize = 5;
      this.business.abutmentflag = '';
      this.business.status = '';
      this.business.orderId = '';
      this.business.sellerId = '';
      this.business.addressPhone = '';
      this.business.addressName = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 查看订单
    seeOrder(id) {
      console.log(id);
      let that = this;
      let data = {
        orderId: id
      };
      javaAjax.post(`/mall_manage/back/order/queryAbutmentOrderDetail`, data).then((res) => {
        console.log('查看订单', res);
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
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
.box{
  /deep/ .el-dialog.el-dialog--center{
    height: 700px;
    overflow-y: auto;
  }
}
.box-flex{
  display: flex;
}
.ellipsis{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.no-tableData{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  >p{
    width: 45%;
    height: 1px;
    border-bottom:1px dashed #ccc;
  }
}
// 列表
.list-box{
  height: 250px;
  border:1px solid #ccc;
  .colorRed{
    color: red;
    font-weight: bold;
  }
  .meituan{
    background: #FFBD27;
  }
  .eleme{
    background: #3bb4f2;
  }
  .jingdong{
    background: red;
  }
}
.list-top{
  height: 50px;
  padding: 5px 10px;
  border-bottom: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  .list-top1{
    width: 80%;
    display: flex;
    align-items: center;
    >div:first-child{
      height: 40px;
      line-height: 40px;
      margin-right: 20px;
      padding: 0 20px;
      font-weight: bold;
    }
  }
  .list-top2{
    width: 20%;
  }
  .state{
    margin-right: 30px;
    font-weight: bold;
  }
}
.list-center{
  justify-content: space-between;
  height: 160px;
  padding: 0 10px;
  padding-top: 10px;
  .label100{
    width: 100px;
  }
  .label120{
    width: 120px;
  }
  .flex1{
    flex: 1;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  p{
    height: 25px;
    display: flex;
    align-items: center;
  }
  .list-center1{
    width: 15%;
    height: 100%;
    >div{
      width: 90%;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      box-shadow: darkgrey 3px 3px 3px 3px ;//边框阴影
    }
  }
  .list-center2{
    width: 65%;
    height: 100%;
  }
  .list-center3{
    width: 20%;
    height: 100%;
  }
}
.list-bottom{
  padding:0px 10px;
  height: 40px;
  border-top: 1px dashed #ccc;
  display: flex;
  align-items: center;
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

