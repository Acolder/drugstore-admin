<template>
  <div class="market-list">
    <!-- 搜索区域 -->
    <div class="search-wrappe">
      <el-form :inline="true" :model="searchInfo" size="small" label-width="90px" style="margin-left:7px;">
        <el-form-item label="优惠券名称:">
          <el-input v-model="searchInfo.couponName" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean">清空</el-button>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      isLoding: false,
      searchInfo: {
        couponName: '',
        couponType: 1,
        state: 1,
        businessType: 1,
        pageNum: 1,
        pageSize: 10,
        orderBy: 'asc'
      },
      tableData: [],
      columns: this.getColumns(),
      total: 0,
      exportData: ''
    };
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '店铺', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'couponName', title: '名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'preferentialAmount', title: '面额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'useTheThreshold', title: '门槛', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'distributionQuantity', title: '发行量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '使用时间', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'effectiveDate', title: '有效时间', width: 110, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 120, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true }
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
        if (item.field === 'startDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let a = rowData['endDate'];
            if (v) {
              return `<div><span>起：${v}</span><span>止：${a}</span></div>`;
            } else { return '-' }
          };
        }
        if (item.field === 'effectiveDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            if (v) {
              return `<span>领取后${v}天内</span>`;
            } else { return '-' }

          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'querySelect') {
        parent.window.selectCoupon(param.rowData);
      }
    },
    // 切换分页
    pageChange(pageIndex) {
      this.searchInfo.pageNum = pageIndex;
      this.getTableData();
    },
    // 切换每页显示的数量
    pageSizeChange(pageSize) {
      this.searchInfo.pageSize = pageSize;
      this.query();
    },
    clean() {
      this.searchInfo.couponName = '';
      this.query();
    },
    query() {
      this.searchInfo.pageNum = 1;
      this.exportData = this.searchInfo;
      this.getTableData();
    },
    // 查询优惠券
    getTableData() {
      let param = this.searchInfo;
      javaRequest.post('/mall_manage/back/coupon/queryCouponBasicInformation', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.toolbar-wrapper{
  padding: 0px;
  margin-bottom: 30px;
}
.title{
  margin: 15px 0;
}
</style>
