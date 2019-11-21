<template>
  <div class="list">
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoading" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 订单详情
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
            <span v-if="detailData.abutmentFlag == 3">饿了么</span>
            <span v-if="detailData.abutmentFlag == 3">药葫芦</span>
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
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      searchInfo: {
        settlementId: this.$route.query.id, // id
      },
      tableData: [],
      columns: this.getColumns(),
      // detailDataLog: false
      isLoading: true
    };
  },
  methods: {
    query() {
      this.getListData();
    },
    exportList() {
      // 22
    },
    // 自定义事件
    customCompFunc(params) {
      if (params.type === 'detail') { // 查看详情
        this.$router.push('/order-control/orderDetail?id=' + params.rowData.orderId);
      }
    },
    getColumns() {
      // let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 20,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'orderId', title: '订单编号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderPayment', title: '订单金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'foodShareFee', title: '平台费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderPostage', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '订单时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 220, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-roder', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'createDate') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            } else {
              return '-';
            }
          };
        } else if (item.field === 'orderPayment' || item.field === 'foodShareFee' || item.field === 'orderPostage') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = '￥' + rowData[field].toFixed(2);
            return `<span style='color:#f00'>${v}</span>` || '-';
          };
        }
        // else if (item.field === 'isOtc') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 订单类型
        //     // let value = rowData[field];
        //     let value = rowData[field];
        //     // console.log(value);
        //     if (value === 1) {
        //       return '非处方';
        //     } else if (value === 2) {
        //       return `<span style='color:#f00'>处方</span>`;
        //     } else {
        //       return '-';
        //     }
        //   };
        // }
        // else if (item.field === 'logisticsType') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 订单类型
        //     // let value = rowData[field];
        //     let value = rowData[field];
        //     let a = '';
        //     if (value) {
        //       switch (value) {
        //         case 'yunda':
        //           a = '韵达';
        //           break;
        //         case 'shunfeng':
        //           a = '顺丰';
        //           break;
        //         case 'huitongkuaidi':
        //           a = '百世汇通';
        //           break;
        //         case 'zhongtong':
        //           a = '中通';
        //           break;
        //         case 'yuantong':
        //           a = '圆通';
        //           break;
        //         case 'guotongkuaidi':
        //           a = '国通';
        //           break;
        //         case 'tianitan':
        //           a = '天天';
        //           break;
        //         case 'youshuwuliu':
        //           a = '优速';
        //           break;
        //         case 'kuaijiesudi':
        //           a = '快捷';
        //           break;
        //         case 'quanfengkuaidi':
        //           a = '全峰';
        //           break;
        //         case 'youzhengguonei':
        //           a = '邮政包裹';
        //           break;
        //         default:
        //           a = value;
        //       }
        //     } else {
        //       a = '-';
        //     }
        //     return a;
        //   };
        // } else
        // // 平台费
        // if (item.field === 'foodShareFee') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     // let value = rowData[field];
        //     let value = rowData[field];
        //     if (value || value === 0) {
        //       return '￥' + value.toFixed(2);
        //     }
        //   };
        // }
      }
      return columns;
    },
    // pageChange(pageIndex) {
    //   this.searchInfo.pageIndex = pageIndex;
    //   this.getListData();
    // },
    // pageSizeChange(pageSize) {
    //   this.searchInfo.pageIndex = 1;
    //   this.searchInfo.pageSize = pageSize;
    //   this.getListData();
    // },
    getListData() {
      javaRequest.post('/mall_manage/back/settlement/selectSettlementDetail', this.searchInfo).then(res => {
        this.isLoading = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.orderList;
        }
      });
    }
  },
  created() {
    this.getListData();
  }
};
</script>

<style lang="less" scoped>
.title{
  font-size: 26px;
  padding: 10px 0;
}
.item{
  margin-top: 10px;
}
// 详情弹窗
// .info-til{
//   height: 40px;
//   background: #36A9E1;
//   display: flex;
//   color: #000;
//   margin: 5px 0;
//   .info-btn{
//     font-weight: bold;
//     height: 100%;
//     line-height: 40px;
//     padding: 0 10px;
//   }
//   .order-status{
//     margin-left: 20px;
//     font-weight: bold;
//     line-height: 40px;
//     color: red;
//   }
// }
// .info-box{
//   padding: 10px;
//   border: 1px solid #000;
//   .layered{
//     display: flex;
//     >p{
//       width: 25%;
//       height: 30px;
//       line-height: 30px;
//       overflow: hidden;
//       text-overflow:ellipsis;
//       white-space: nowrap;
//     }
//     >p:last-child{
//       width: 50%;
//     }
//   }
//   .totalAmount{
//     height: 30px;
//     line-height: 30px;
//     color: #000;
//     text-align: right;
//     padding-right: 50px;
//     font-weight: bold;
//   }
//   h3{
//     height: 30px;
//     line-height: 30px;
//     color: #000;
//   }
// }
// .logistics-wrapper{
//   padding-left: 20px;
//   li{
//     display: flex;
//     height: 50px;
//     position: relative;
//     padding-left: 20px;
//     .logistics-line{
//       position: absolute;
//       width: 1px;
//       height: 50px;
//       background: #ccc;
//       top: 0px;
//       left: 0px;
//       i{
//         width: 10px;
//         height: 10px;
//         border-radius: 50%;
//         background: #ccc;
//         position: absolute;
//         top: 0px;
//         left: -4.5px;
//       }
//     }
//   }
//   li:last-child{
//     .logistics-line{
//       i{
//         background: orange;
//       }
//     }
//   }
// }
// .dispatche,.refund{
//   line-height: 50px;
// }
// .dispatcheStatus{
//   width: 300px;
// }
// .refund-box{
//   >p{
//     width: 50%;
//     height: 30px;
//     line-height: 30px;
//     color: #000;
//   }
// }
// .refund-txt{
//   width: 300px;
//   line-height: 25px;
// }
// .refund-txt-t{
//   color: #000;
// }
// .refund-txt-b{
//   color: #666;
// }
</style>
