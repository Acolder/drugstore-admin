<template>
  <div class="orderList">
      <div class="order_list_box">
        <div class="title">
            <h4 style="padding-left: 12px;">累计订单量（单）: <span style="color:#409EFF;">{{this.$route.query.orderQuantity}}</span></h4>
            <h4 style="padding-left: 12px;">累计订单金额（元）: <span style="color:#409EFF;">{{this.$route.query.saleNum}}</span></h4>
       </div>
      <div class="table-wrapper">
        <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="orderData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
      </div>
        <div class="pagin-wrapper">
                <v-pagination :page-index="currentPage" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
        </div>
    </div>
    <el-dialog title="订单详情" width="80%" :modal="true" :visible.sync="viewDialogVisible" :modal-append-to-body="false" center>
      <iframe id="viewIframe" :src="viewUrl" class="" frameborder="0" style="width:100%;height:800px;background-color:#fff;"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      columns: this.getColumns(),
      orderData: [],
      viewDialogVisible: false,
      viewUrl: '',
      // timeFiltrate: {},
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      tableData: [],
      requestData: {
        pageIndex: 1,
        pageSize: 5,
        // start_time: '',
        // end_time: '',
        num: '',
        status
      },
      currentPage: 1,
      transports: {
        '': '全部',
        '1': '普通物流',
        '2': '28分钟达',
        '3': '自提',
        '4': '跨境电商'
      },
      orderStatusMap: {
        '': '全部',
        '0': '已取消',
        '10': '待付款',
        '20': '待确认',
        '30': '配送中',
        '40': '交易成功',
        '50': '已退款',
        '60': '部分退款',
        '70': '退款中',
        '80': '待评价',
        '90': '待审核',
        '100': '处方未通过审核',
      },
    };
  },
  mounted() {
    // this.defaultTime();
    this.getOrderList();
  },
  methods: {
    // 默认日期(其实时间为1个月前)
    // defaultTime() {
    //   let nowDate = new Date();
    //   let nowYear = nowDate.getFullYear();
    //   let nowMonth = nowDate.getMonth() + 1;
    //   let nowDay = nowDate.getDate();
    //   let nowTime = nowYear + '-' + nowMonth + '-' + nowDay;
    //   let threeMonthTime = this.getAgoTime(nowDate);
    //   this.timeFiltrate.threeMonthTime = threeMonthTime;
    //   this.timeFiltrate.nowTime = nowTime;
    //   this.getDateTime = {
    //     start: threeMonthTime,
    //     end: nowTime
    //   };
    // },
    // getAgoTime(nowDate) {
    //   let nowYear = nowDate.getFullYear();
    //   let nowMonth = nowDate.getMonth() + 1;
    //   let nowDay = nowDate.getDate();
    //   let agoYear = nowYear;
    //   let agoMonth = nowMonth - 1;
    //   if (Number(nowMonth) === 1) {
    //     agoYear--;
    //     agoMonth = 12;
    //   }
    //   return agoYear + '-' + agoMonth + '-' + nowDay;
    // },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 30,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            // let index = (_self.pageIndex - 1) * _self.pageSize + rowIndex + 1;
            let index = _self.pageIndex * _self.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'order_id', title: '订单号', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'seller_user_name', title: '商户名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_payment', title: '金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_status', title: '状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'logistics_number', title: '物流号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'address_name', title: '收货人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'address_phone', title: '收货人电话', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'create_date', title: '订单时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'create_date') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            } else {
              return '-';
            }
          };
        } else if (item.field === 'order_transport') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData[field];
            return _self.transports[v] || '-';
          };
        } else if (item.field === 'order_status') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData[field];
            let value = _self.orderStatusMap[v];
            if (value === '配送中' && rowData['order_transport'] === '3') {
              value = '待取货';
            }
            if (value === '待确认' || value === '待审核') {
              return `<span style='color:#f00'>${value}</span>`;
            } else {
              return value;
            }
          };
        } else if (item.field === 'order_payment') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = '￥' + rowData['order_payment'].toFixed(2);
            return `<span style='color:#f00'>${v}</span>` || '-';
          };
        } else if (item.field === 'is_otc') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) { // 订单类型
            let value = rowData[field];
            if (value === 1) {
              return '非处方';
            } else if (value === 2) {
              return `<span style='color:#f00'>处方</span>`;
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    getQueryParams() {
      // this.requestData.start_time = this.timeFiltrate.threeMonthTime ? this.timeFiltrate.threeMonthTime : '';
      // this.requestData.end_time = this.timeFiltrate.nowTime ? this.timeFiltrate.nowTime : '';
      // this.requestData.start_time = '';
      // this.requestData.end_time = '';
      this.requestData.pageIndex = this.pageIndex + 1;
      this.requestData.pageSize = this.pageSize;
      this.requestData.status = '30,40,80';
      return this.requestData;
    },
    getOrderList() {
      let request = this.getQueryParams();
      console.log(request);
      ajax.get(`/api/jinmu/getorders`, { params: request }).then((res) => {
        console.log(res);
        if (res && res.status === 200 && res.data && String(res.data.code) === '0') {
          this.total = res.data.recordscount;
          this.orderData = res.data.data;
          console.log(this.orderData);
        }
      });
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // query() {
    //   this.pageIndex = 0;
    //   // this.getTableData();
    //   this.pageChange();
    // },
    pageChange(pageIndex) {
      this.currentPage = pageIndex;
      this.pageIndex = pageIndex - 1;
      console.log(this.pageIndex);
      this.getOrderList(pageIndex);
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 0;
      this.pageSize = pageSize;
      this.getOrderList();
    },
    // sizeChange(pz) {
    //   this.pageIndex = 1;
    //   this.pageSize = pz;
    //   this.getOrderList();
    // },
    customCompFunc(params) {
      if (params.type === 'detail') {
        let url = this.$router.resolve({
          path: '/home/orderDetails',
          query: {
            id: params.rowData.order_id,
            from: 'apparatus'
          }
        });
        this.viewUrl = url.href;
        this.viewDialogVisible = true;
        let iframe = document.getElementById('viewIframe');
        if (iframe) {
          iframe.contentWindow.location.reload(true);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.orderList {
  .order_list_box {
    .title{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    h4:nth-child(2) {
      margin-left: 50px;
      }
    }
  }
}
</style>
