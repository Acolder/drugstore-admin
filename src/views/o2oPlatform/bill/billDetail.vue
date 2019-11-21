<template>
  <div class="list">
    <!-- <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="订单号">
          <el-input v-model="searchInfo.orderId" placeholder="请输入商户名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          <el-button type="default" @click="exportList" icon="el-icon-share">导 出</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoading" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- <div class="table-wrapper">
      <p class="title">操作信息</p>
      <p class="item">账单生成时间：2018-12-6 14:25</p>
      <p class="item">账单确认时间：2018-12-6 14:25</p>
      <p class="item">账单审核时间：2018-12-6 14:25</p>
      <p class="item">账单打款时间：2018-12-6 14:25</p>
      <p class="item">账单完成时间：2018-12-6 14:25</p>
      <p class="item">审核人：王某某</p>
      <p class="item">打款人：张某某</p>
    </div> -->
    <!-- <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div> -->
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      searchInfo: {
        // sellerName: '',
        // withdrawId: '',
        // mobile: '',
        // withdrawStatus: '',
        // pageNum: 1,
        // pageSize: 10,
        // orderBy: 'desc'
        // pageIndex: 1,
        // pageSize: 10,
        billId: this.$route.query.id, // id
        // orderId: ''
      },
      tableData: [],
      columns: this.getColumns(),
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
      if (params.type === 'seeOrderDetail') { // 查看详情
        this.$router.push('/o2oPlatform/bill/settlement?id=' + params.rowData.settlementId);
      }
    },
    getColumns() {
      // let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 10,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'salesAmount', title: '销售金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'postageAmount', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'servicesAmount', title: '服务费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'payAmount', title: '支付金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'preferentialAmount', title: '优惠金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'receivableAmount', title: '应收金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startTime', title: '日结算账单', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'endTime', title: '账单结束时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-billdetail', isResize: true },
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
        if (item.field === 'startTime') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            if (value) {
              return value.slice(0, -8);
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'receivableAmount' || item.field === 'salesAmount' || item.field === 'postageAmount' || item.field === 'servicesAmount' || item.field === 'payAmount' || item.field === 'preferentialAmount') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = '￥' + rowData[field].toFixed(2);
            if (value) {
              return '<span style="color:red">' + value + '</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    pageChange(pageIndex) {
      this.searchInfo.pageIndex = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = pageSize;
      this.getListData();
    },
    getListData() {
      javaRequest.post('/mall_manage/back/settlement/findBillDetail', this.searchInfo).then(res => {
        this.isLoading = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData;
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
// .list{
//   width: 100%;
//   height: 100%;
//   background-color: #f6f8f8;
//   padding: 20px;
// }
</style>
