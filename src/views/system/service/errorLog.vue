<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="medium" >
        <el-form-item label="日志名">
          <el-input v-model="requestData.LoggerName" placeholder="日志名"></el-input>
        </el-form-item>
        <el-form-item label="方法名">
          <el-input v-model="requestData.ActionsClick" placeholder="方法名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search" >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" ></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination :page-index="currentPage"  @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
    </div>
    <!-- 查看详情 -->
    <el-dialog title="错误日志详情" :visible.sync="logPop" :modal-append-to-body="false" width="50%" center>
      <div class="display-box">
        <label class="txt">日志名: </label>
        <label class="box-flex">{{detailData.loggername}}</label>
      </div>
      <div class="display-box">
        <label class="txt">方法名: </label>
        <label class="box-flex">{{detailData.actionsclick}}</label>
      </div>
      <div class="display-box">
        <label class="txt">日志级别: </label>
        <label class="box-flex">{{detailData.level}}</label>
      </div>
      <div class="display-box">
        <label class="txt">执行时间: </label>
        <label class="box-flex">{{detailData.timestamp}}</label>
      </div>
      <div class="display-box">
        <label class="txt">异常: </label>
        <label class="box-flex">{{detailData.message}}</label>
      </div>
      <div class="display-box">
        <label class="txt">堆栈: </label>
        <label class="box-flex">{{detailData.stacktrace}}</label>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      columns: this.getColumns(),
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      tableData: [],
      requestData: {
        // 日志名
        LoggerName: '',
        // 方法
        ActionsClick: ''
      },
      sidebarValue: this.sidebarStatus,
      logPop: false,
      detailData: {},
      currentPage: 1
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
            let index = _self.pageIndex * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'loggername', title: '日志名', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'actionsclick', title: '方法名', width: 220, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'level', title: '日志级别', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'timestamp', title: '执行时间', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'message', title: '异常', width: 280, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'stacktrace', title: '堆栈', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
    getTableData() {
      this.requestData.PageIndex = this.pageIndex;
      this.requestData.PageSize = this.pageSize;
      ajax.post(`api/admin/getErrorLogList`, this.requestData).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          this.tableData = res.data.data;
        }
      });
    },
    query() {
      this.pageIndex = 0;
      // this.getTableData();
      this.pageChange(1);
    },
    pageChange(pageIndex) {
      this.currentPage = pageIndex;
      this.pageIndex = pageIndex - 1;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 0;
      this.pageSize = pageSize;
      this.getTableData();
    },
    customCompFunc(params) {
      this.detailData.loggername = params.rowData.loggername;
      this.detailData.actionsclick = params.rowData.actionsclick;
      this.detailData.level = params.rowData.level;
      this.detailData.timestamp = params.rowData.timestamp;
      this.detailData.message = params.rowData.message;
      this.detailData.stacktrace = params.rowData.stacktrace;
      this.logPop = true;
    }
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
</style>

