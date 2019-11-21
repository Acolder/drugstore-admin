<template>
  <div class="detail">
    <div class="header list">
      <p class="subtitle">
        <span>当前礼包状态：</span>
        <span>{{(orderDetailData.orderStatus === '配送中' && orderDetailData.orderTransport === '3') ? '待取货' : orderDetailData.orderStatus}}</span>
      </p>
    </div>
    <div class="mall-list list">
      <p class="subtitle">礼品列表</p>
      <v-table ref="detail_table" column-width-drag is-horizontal-resize style="width:100%" :columns="detailColumns"
      :table-data="orderDetailData.orderDetail" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
    </div>
    <div class="mall-list list">
      <div class="pay con">
        <p class="subtitle">礼包信息</p>
        <p>礼品数量：<span>{{orderDetailData.productSum}}</span></p>
        <p>礼包编号：{{orderDetailData.orderId}}</p>
        <p>订单编号：{{orderDetailData.parentOrderId}}</p>
        <p>创建时间：{{orderDetailData.createDate}}</p>
      </div>
      <div class="white con"></div>
      <div class="invo con">
        <p class="subtitle">提货信息</p>
        <div>
          <p>手机号：{{orderDetailData.addressPo ? orderDetailData.addressPo.addressPhone : ''}}</p>
          <p>提货码：{{orderDetailData.orderStatus === '已提货' ? orderDetailData.extractCode : ''}}</p>
          <p>提货门店：{{orderDetailData.seller ? orderDetailData.seller.sellerName : ''}}</p>
          <p>提货时间：{{orderDetailData.extractDate}}</p>
        </div>
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
      orderDetailData: '',
    };
  },
  computed: {
    //  礼品列表
    detailColumns() {
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'price', title: '商品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantity', title: '商品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '商品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
      }
      return columns;
    },
  },
  methods: {
    // 获取订单详情数据
    getDetailData() {
      let param = {
        orderId: this.$route.query.id,
      };
      javaRequest.post('/mall_manage/back/queryPresentDetail', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.orderDetailData = res.data.resultData;
          this.orderDetailData.orderStatus = this.HandleOrder(this.orderDetailData);
          this.orderDetailData.createDate = formatDate(this.orderDetailData.createDate);
          this.orderDetailData.extractDate = this.orderDetailData.extractDate ? formatDate(this.orderDetailData.extractDate) : '';
        }
      });
    },
    // 处理药店订单状态
    HandleOrder(detail) {
      if (detail.orderStatus === '0') {
        return '已取消';
      } else if (detail.orderStatus === '10') {
        return '待付款';
      } else if (detail.orderStatus === '20') {
        return '待领取';
      } else if (detail.orderStatus === '30') {
        return '待提货';
      } else if (detail.orderStatus === '40') {
        return '已提货';
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
    margin-bottom: 5px;
  }
  .list{
    background: #f3f3f3;
    padding: 0 20px 15px 30px;
    margin-bottom: 15px;
    overflow: hidden;
    p{
      line-height: 30px;
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
      height: 185px;
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
  .order-operation {
    padding: 0 20px 20px 30px;
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

