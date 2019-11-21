<template>
  <div class="detail">
    <div class="header list">
      <p class="subtitle">
        <span>当前订单状态：</span>
        <span>{{(orderDetailData.orderStatus === '配送中' && orderDetailData.orderTransport === '3') ? '待取货' : orderDetailData.orderStatus}}</span>
      </p>
    </div>
    <div class="info list" v-if="orderDetailData.orderTransport !== '3'">
      <p class="subtitle">收货信息</p>
      <div class="info-list" v-if="orderDetailData.userAddress">
        <p>收货人：{{orderDetailData.userAddress.addressName}}</p>
        <p>手机号：{{orderDetailData.userAddress.addressPhone}}</p>
        <p>地址：{{orderDetailData.userAddress.totalAddress}}</p>
      </div>
    </div>
    <div class="mall-list list">
      <p class="subtitle">商品信息</p>
      <v-table ref="detail_table" column-width-drag is-horizontal-resize style="width:100%" :columns="detailColumns" :table-data="orderDetailData.orderDetail" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
      <p style="text-align:right;padding:15px 0 10px 0;font-size:18px;">商品总金额：￥{{orderDetailData.prdouctSumMoney ? orderDetailData.prdouctSumMoney.toFixed(2) : orderDetailData.prdouctSumMoney}}</p>
    </div>
    <div class="mall-list list">
      <div class="pay con">
        <p class="subtitle">付款信息</p>
        <p>付款方式：<span v-if="orderDetailData.payinfoPlatorm">{{orderDetailData.payinfoPlatorm === 'alipay' ? '支付宝' : '微信'}}</span></p>
        <p>付款时间：{{orderDetailData.payTime}}</p>
        <p>商品总金额：￥{{orderDetailData.prdouctSumMoney ? orderDetailData.prdouctSumMoney.toFixed(2) : orderDetailData.prdouctSumMoney}}</p>
        <p>平台费：<span v-if="orderDetailData.foodShareFee || orderDetailData.foodShareFee === 0">￥{{orderDetailData.foodShareFee.toFixed(2)}}</span></p>
        <p>运费：<span v-if="orderDetailData.orderPostage || orderDetailData.orderPostage === 0">￥{{orderDetailData.orderPostage.toFixed(2)}}</span></p>
        <p>促销活动：<span v-if="orderDetailData.maTotalPrice || orderDetailData.maTotalPrice === 0">-￥{{orderDetailData.maTotalPrice.toFixed(2)}}</span></p>
        <p>优惠券：{{orderDetailData.couponBasicInformation}}</p>
        <p>实付金额：{{orderDetailData.realPayment ? orderDetailData.realPayment.toFixed(2) : orderDetailData.realPayment}}</p>
        <div class="meituanInfo" v-if="orderDetailData.abutmentFlag === 1">
        <p>商家应收金额：<span v-if="orderDetailData.wmPoiReceiveCent || orderDetailData.wmPoiReceiveCent === 0">￥{{orderDetailData.wmPoiReceiveCent.toFixed(2)}}</span></p>
        <p>订单总金额：<span v-if="orderDetailData.orderMoneySum || orderDetailData.orderMoneySum === 0">￥{{orderDetailData.orderMoneySum.toFixed(2)}}</span></p>
        <p>第三方优惠金额：<span v-if="orderDetailData.actOrderChargeByThird || orderDetailData.actOrderChargeByThird === 0">￥{{orderDetailData.actOrderChargeByThird.toFixed(2)}}</span></p>
        <p>商家优惠金额：<span v-if="orderDetailData.couponPrice || orderDetailData.couponPrice === 0">-￥{{orderDetailData.couponPrice.toFixed(2)}}</span></p>
        </div>
      </div>
      <div class="white con"></div>
      <div class="invo con">
        <p class="subtitle">发票信息</p>
        <div v-if="orderDetailData.invoiceInfo">
          <p>发票类型：电子普通发票</p>
          <p>发票抬头：{{orderDetailData.invoiceInfo.invoiceType}}</p>
          <p v-if="orderDetailData.invoiceInfo.invoiceType === '个人'">个人姓名：{{orderDetailData.invoiceInfo.invoiceTitle}}</p>
          <div v-else>
            <p>公司名称：{{orderDetailData.invoiceInfo.invoiceTitle}}</p>
            <p>纳税号：{{orderDetailData.invoiceInfo.taxNum}}</p>
          </div>
          <p>收票邮箱：{{orderDetailData.invoiceInfo.email}}</p>
        </div>
        <div v-else>
          该订单无需开具发票
        </div>
      </div>
    </div>
    <div class="order-info list">
      <p class="subtitle">订单信息</p>
      <p>订单号：{{orderDetailData.orderId}}</p>
      <div v-if="orderDetailData.orderTransport === '3'">
        <p>取货码：{{orderDetailData.extractCode}}</p>
        <p>药柜编号：{{orderDetailData.sellerUserId}}</p>
      </div>
      <p>创建时间：{{orderDetailData.createDate}}</p>
      <p>商品件数：共<i v-if="orderDetailData.orderDetail">{{orderDetailData.productSum}}</i>件</p>
    </div>
    <div class="prescri-info list" v-if="orderDetailData.orderOtcAdd">
      <p class="subtitle">处方信息</p>
      <img v-for="(item,index) in orderDetailData.orderOtcAdd.otcImages" :key="index" :src="item" alt="" @click="selectIMG(item)">
    </div>
    <div class="operation list">
      <p class="subtitle">配送信息</p>
      <div v-if="orderDetailData.orderStatus === '待确认' || orderDetailData.orderStatus === '配送中' || orderDetailData.orderStatus === '待评价'">
        <div v-if="orderDetailData.orderStatus === '配送中'  || orderDetailData.orderStatus === '待评价'">
          <div v-if="orderDetailData.orderTransport === '1'">
            <p>物流公司：{{orderDetailData.logistics ? orderDetailData.logistics.com : ''}}</p>
            <p>物流单号：{{orderDetailData.logistics ? orderDetailData.logistics.nu : ''}}</p>
          </div>
          <div v-else-if="orderDetailData.orderTransport === '2'">
            <p>配送方：{{orderDetailData.logisticsType}}</p>
            <p>配送员电话：{{orderDetailData.logistics ? orderDetailData.logistics.courier_phone : '无'}}</p>
          </div>
          <div v-else>
            <span>暂无~</span>
          </div>
        </div>
      </div>
      <div v-else>
        <span>暂无~</span>
      </div>
    </div>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      searchDetail: {
        orderId: this.$route.query.id
      },
      orderDetailData: {},
    };
  },
  computed: {
    detailColumns() {
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '药品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '药品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'oldPrice', title: '药品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantity', title: '药品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '药品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂商', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
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
        if (item.field === 'productMainImage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<img src="${value}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            } else {
              return `<img src="${defaultImg}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            }
          };
        }
        if (item.field === 'oldPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (rowData['productType'] === 6) {
              return '0.00';
            } else {
              return value;
            }
          };
        }
      }
      return columns;
    },
  },
  methods: {
    // 获取订单详情数据
    getDetailData() {
      this.orderDetailData = '';
      javaRequest.post('/mall_manage/back/order/queryOrderDetailByOrderId', this.searchDetail).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          if (res.data.resultData) {
            this.orderDetailData = res.data.resultData;
            this.orderDetailData.createDate = formatDate(this.orderDetailData.createDate);
            this.orderDetailData.payTime = this.orderDetailData.payTime ? formatDate(this.orderDetailData.payTime) : '';
            this.orderDetailData.orderStatus = this.HandleOrder(this.orderDetailData);
            if (this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') {
              this.Transport = '2';
            }
          } else {
            this.$message({
              type: 'eroor',
              message: '您要查找的订单不存在'
            });
          }
        }
        this.orderDetailData.orderOtcAdd ? this.orderDetailData.orderOtcAdd.otcImages = this.orderDetailData.orderOtcAdd.otcImages.split(',') : this.orderDetailData.orderOtcAdd = this.orderDetailData.orderOtcAdd;
        this.print = this.orderDetailData;
      });
    },
    // 处理药店订单状态
    HandleOrder(detail) {
      if (detail.orderStatus === '90') {
        return '待审核';
      } else if (detail.orderStatus === '20') {
        return '待确认';
      } else if (detail.orderStatus === '50') {
        return '已退款';
      } else if (detail.orderStatus === '30') {
        return '配送中';
      } else if (detail.orderStatus === '40') {
        return '已完成';
      } else if (detail.orderStatus === '60') {
        return '部分退款';
      } else if (detail.orderStatus === '80') {
        return '待评价';
      } else if (detail.orderStatus === '0') {
        return '已取消';
      } else if (detail.orderStatus === '10') {
        return '待付款';
      } else if (detail.orderStatus === '70') {
        return '退款中';
      } else if (detail.orderStatus === '100') {
        return '审核未通过';
      }
    },
  },
  created() {
    this.getDetailData();
  }
};
</script>

<style lang="less" scoped>
.detail{
  padding-right: 20px;
  padding-bottom: 100px;
  .subtitle{
    font-size:18px;
    font-weight: 900;
    margin-bottom: 10px;
  }
  .list{
    background: #f3f3f3;
    padding-left: 30px;
    margin-bottom: 10px;
    overflow: hidden;
    padding-right: 15px;
    p{
      line-height: 26px;
    }
    img{
      width: 100px;
      height: 120px;
      margin-right: 10px;
    }
    .con{
      float: left;
    }
    .pay{
      margin-right: 500px;
    }
    .white{
      width: 15px;
      background-color: #fff;
      height: 244px;
    }
    .invo{
      margin-left: 30px;
    }
  }
  .header{
    height: 62px;
    width: 100%;
    .subtitle{
    line-height: 62px;
    }
  }
  .button-list{
    width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }
}
.seeImg{
  width: 500px;
  background: #fff;
  position: fixed;
  z-index: 3000;
  top: 10%;
  left: 40%;
  border: 1px solid #000;
  padding: 20px;
  .close{
    display: block;
    position: absolute;
    top: 15px;
    right: 25px;
    cursor: pointer;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    &:hover{
      background: #c0c4cc;
      color: #fff;
    }
  }
  .title{
    img{
      width:50px;
      height: 50px;
    }
  }
  .img-body{
    text-align: center;
    margin-bottom: 35px;
    img{
      width: 400px;
      height: 500px;
    }
  }
}
.TipsInfo{
  .title{
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }
  .text{
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
    .red{
      color: #f00;
      font-size: 18px;
    }
  }
}
</style>
