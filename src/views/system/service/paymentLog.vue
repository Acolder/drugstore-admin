<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" size="small" >
        <el-form-item label="订单号">
          <el-input v-model="requestData.OrderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" size="small" icon="el-icon-delete" @click="empty">清空</el-button>
          <el-button type="primary" size="small" @click="query" icon="el-icon-search" >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" ></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination  @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="requestData.PageIndex" :page-size="requestData.PageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
    </div>
    <!-- 查看详情 -->
    <el-dialog title="支付日志详情" :visible.sync="paymentLog" :modal-append-to-body="false" width="50%" center>
      <div class="display-box">
        <label class="txt">订单号: </label>
        <label class="box-flex">{{detailData.orderid}}</label>
      </div>
      <div class="display-box">
        <label class="txt">事件名: </label>
        <label class="box-flex">{{detailData.eventname}}</label>
      </div>
      <div class="display-box">
        <label class="txt">请求时间: </label>
        <label class="box-flex">{{detailData.requesttime}}</label>
      </div>
      <div class="display-box">
        <label class="txt">请求地址: </label>
        <label class="box-flex">{{detailData.requesturl}}</label>
      </div>
      <div class="display-box">
        <label class="txt">请求参数: </label>
        <label class="box-flex">{{detailData.requestparam}}</label>
      </div>
      <div class="display-box">
        <label class="txt">请求返回结果: </label>
        <label class="box-flex">{{detailData.responseresult}}</label>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import Vue from 'vue';
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      columns: this.getColumns(),
      // 参数对象
      requestData: {
        OrderId: '',
        PageIndex: 1,
        PageSize: 10
      },
      sidebarValue: this.sidebarStatus,
      // 条数
      total: 10,
      // 表格数据
      tableData: [],
      // 详情数据
      paymentLog: false,
      detailData: {},
    };
  },
  created() {
    this.getTableData();
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.requestData.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'orderid', title: '订单号', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'eventname', title: '事件名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'requesttime', title: '请求时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'requesturl', title: '请求地址', width: 280, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'requestparam', title: '请求参数', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'responseresult', title: '请求返回结果', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 130, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
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
        if (item.field === 'message') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              if (value.indexOf('xml') >= 0) {
                return 'xml...';
              }
              return value;
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 获取数据
    getTableData() {
      ajax.post(`/api/admin/getPayLogList`, this.requestData).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          this.tableData = res.data.data;
        }
      });
    },
    // 清空
    empty() {
      this.requestData.OrderId = '';
      this.requestData.PageIndex = 1;
      this.requestData.PageSize = 10;
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 查看详情
    detailed(params) {
      this.paymentLog = true;
      this.detailData = params.rowData;
    },
    // 分页
    pageChange(pageIndex) {
      this.requestData.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.requestData.PageSize = pageSize;
      this.getTableData();
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 查看详情
      if (params.type === 'detail') { // do edit operation
        this.detailed(params);
      }
    },
  }
};
</script>
<style lang="less" scoped>
.display-box{
  margin-bottom: 8px;
  .txt{
    display: block;
    font-weight: bold;
    margin-right: 8px;
  }
  .box-flex{
    white-space: normal;
    word-break: break-all;
    line-height: 24px;
  }
}
p{
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #ccc;
}
</style>

