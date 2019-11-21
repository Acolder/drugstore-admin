<template>
  <div class="list">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="商户名称">
          <el-input v-model.trim="searchInfo.sellerName" placeholder="请输入商户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户手机号">
          <el-input v-model.trim="searchInfo.mobile" placeholder="请输入商户手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="当前状态:">
          <el-select v-model="searchInfo.withdrawStatus" placeholder="请选择状态" clearable >
              <el-option label="待审核" value="10"></el-option>
              <el-option label="待付款" value="20"></el-option>
              <el-option label="已完成" value="30"></el-option>
              <el-option label="已取消" value="40"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          <el-button type="default" size="small" icon="el-icon-delete" @click="clear">清空</el-button>
          <el-button type="default" @click="exportList" icon="el-icon-share" style="background: #67c23a; color: #fff;">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageNum" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 审核二次确认对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="auditoShow"
      width="380px"
      center
      top="35vh"
      :modal-append-to-body="false">
      <h2 class="auditor-title">该提现申请审核是否通过？</h2>
      <span class="auditor-subtitle">提现金额：</span><span class="pic">￥{{pic}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditor(id, 30, sellerUserId)">不通过</el-button>
        <el-button type="primary" @click="auditor(id, 20, sellerUserId)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      searchInfo: {
        sellerName: '',
        withdrawId: '',
        mobile: '',
        withdrawStatus: '',
        pageNum: 1,
        pageSize: 10,
        orderBy: 'desc'
      },
      tableData: [],
      columns: this.getColumns(),
      total: 0,
      auditoShow: false,
      pic: '',
      id: '',
      sellerUserId: ''
    };
  },
  methods: {
    // 查询
    query() {
      this.getListData();
    },
    // 清除
    clear() {
      this.searchInfo = {
        sellerName: '',
        withdrawId: '',
        mobile: '',
        withdrawStatus: '',
        pageNum: 1,
        pageSize: 10,
        orderBy: 'desc'
      };
      this.getListData();
    },
    // 导出
    exportList() {
      // 22
    },
    // 自定义事件
    customCompFunc(params) {
      if (params.type === 'seeRow') { // 查看详情
        this.$router.push('/forward/detail?id=' + params.rowData.withdrawId);
      } else if (params.type === 'auditorRow') { // 审核
        this.auditoShow = true;
        this.pic = params.rowData.withdrawPrice;
        this.id = params.rowData.withdrawId;
        this.sellerUserId = params.rowData.sellerUserId;
      } else if (params.type === 'payRow') { // 已付款
        this.auditor(params.rowData.withdrawId, 40, params.rowData.sellerUserId);
      }
    },
    getColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 10,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'sellerName', title: '提现商户', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '商户手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'withdrawPrice', title: '提现金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '提现时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'withdrawStatus', title: '当前状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'openingBank', title: '收款银行', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'bankCardNumber', title: '收款账户', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-forward', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'withdrawStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 10) {
              return '<span style="color:green">待审核</span>';
            } else if (value === 20) {
              return '<span style="color:green">待付款</span>';
            } else if (value === 30) {
              return '<span style="color:red">已取消</span>';
            } else if (value === 40) {
              return '<span style="color:green">已完成</span>';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'withdrawPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = '￥' + rowData[field];
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
      this.searchInfo.pageNum = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = pageSize;
      this.getListData();
    },
    // 审核付款
    auditor(id, status, sellerUserId) {
      let obj = {
        withdrawStatus: status,
        withdrawId: id,
        sellerUserId: sellerUserId
      };
      this.auditoShow = false;
      javaRequest.post('/mall_manage/back/wallet/updateWithdrawCash', obj).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getListData();
        }
      });
    },
    getListData() {
      javaRequest.post('/mall_manage/back/wallet/querywithdrawCashforPC', this.searchInfo).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
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
.auditor-title{
  margin-left: 25px;
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 20px;
}
.auditor-subtitle{
  font-size: 20px;
  margin-left: 25px;
}
.pic{
  font-size: 20px;
  color: red;
}
</style>
