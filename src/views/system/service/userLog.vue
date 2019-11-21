<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="medium">
        <el-form-item label="方法名">
          <el-input v-model="requestData.MethodName" placeholder="方法名"></el-input>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="requestData.Path" placeholder="请求地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination :page-index="currentPage" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
    </div>
    <!-- 查看详情 -->
    <el-dialog title="日志详情" :visible.sync="logPop" :modal-append-to-body="false" width="50%" center>
      <div class="display-box">
        <label class="txt">方法名: </label>
        <label class="box-flex">{{detailData.methodname}}</label>
      </div>
      <div class="display-box">
        <label class="txt">请求地址: </label>
        <label class="box-flex">{{detailData.path}}</label>
      </div>
      <div class="display-box">
        <label class="txt">类名: </label>
        <label class="box-flex">{{detailData.servicename}}</label>
      </div>
      <div class="display-box">
        <label class="txt">请求参数: </label>
        <label class="box-flex">{{detailData.parameters}}</label>
      </div>
      <div class="display-box">
        <label class="txt">执行时间: </label>
        <label class="box-flex">{{detailData.executiontime}}</label>
      </div>
      <div class="display-box">
        <label class="txt">客户端IP: </label>
        <label class="box-flex">{{detailData.ClientIpAddress}}</label>
      </div>
      <div class="display-box">
        <label class="txt">浏览器: </label>
        <label class="box-flex">{{detailData.browserinfo}}</label>
      </div>
      <div class="display-box">
        <label class="txt">异常: </label>
        <label class="box-flex">{{detailData.exception}}</label>
      </div>
      <div class="display-box">
        <label class="txt">HttpClient返回结果: </label>
        <label class="box-flex">{{detailData.auditlog}}</label>
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
        // 方法名
        MethodName: '',
        // 请求地址
        Path: ''
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
      let columns = [{
        field: 'custome',
        title: '序号',
        width: 50,
        titleAlign: 'center',
        columnAlign: 'center',
        formatter: function(rowData, rowIndex, pagingIndex, field) {
          let index = _self.pageIndex * 10 + rowIndex + 1;
          return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        },
        isFrozen: true,
        isResize: true
      },
      { field: 'methodname', title: '方法名', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'path', title: '请求地址', width: 220, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'servicename', title: '类名', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'parameters', title: '请求参数', width: 280, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'executiontime', title: '执行时间', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'clientipaddress', title: '客户端IP', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'userid', title: '用户', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'browserinfo', title: '浏览器', width: 280, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'exception', title: '异常', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'auditlog', title: 'HttpClient返回结果', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'operation', title: '操作', width: 130, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations', isResize: true }
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
        if (item.field === 'exception') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
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
      ajax.post(`/api/admin/getAuditLogList`, this.requestData).then((res) => {
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
      this.detailData.methodname = params.rowData.methodname;
      this.detailData.servicename = params.rowData.servicename;
      this.detailData.path = params.rowData.path;
      this.detailData.parameters = params.rowData.parameters;
      this.detailData.executiontime = params.rowData.executiontime;
      this.detailData.clientname = params.rowData.clientname;
      this.detailData.browserinfo = params.rowData.browserinfo;
      this.detailData.exception = params.rowData.exception;
      this.detailData.auditlog = params.rowData.auditlog;
      this.logPop = true;
    }
  }
};

</script>
<style lang="less" scoped>
.display-box {
  margin-bottom: 8px;

  .txt {
    display: block;
    font-weight: bold;
    margin-right: 8px;
  }

  .box-flex {
    white-space: normal;
    word-break: break-all;
    line-height: 24px;
  }
}

</style>
