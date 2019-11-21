<template>
  <div class="list">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="打款账户:">
          <el-input v-model="searchInfo.intoAccount" placeholder="请输入打款账户" clearable></el-input>
        </el-form-item>
        <el-form-item label="药店名称:">
          <el-input v-model="searchInfo.sellerName" placeholder="请输入药店名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="当前状态:">
          <el-select v-model="searchInfo.status" placeholder="请选择状态" clearable >
              <!-- <el-option label="待审核" value="10"></el-option> -->
              <el-option label="未结算" value="2"></el-option>
              <el-option label="已结算" value="4"></el-option>
              <!-- <el-option label="审核未通过的" value="40"></el-option> -->
              <el-option label="全部" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="账单生成时间:">
          <el-date-picker
            v-model="date"
            align="right"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="dateChange">
          </el-date-picker>
          <!--  :picker-options="pickerOptions" -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          <!-- <el-button type="default" @click="exportList" icon="el-icon-share">导 出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="medium" @click="batch" :disabled="disabled">批量打款</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoading" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 打款二次确认对话框 -->
    <el-dialog
      title="打款确认"
      :visible.sync="auditoShow"
      width="380px"
      center
      top="35vh"
      :modal-append-to-body="false">
      <!-- <h2 class="auditor-title">该账单审核是否通过？</h2> -->
      <!-- <span class="auditor-subtitle">提现金额：</span><span class="pic">￥{{pic}}</span> -->
      <div class="contnt">
        <!-- <span>商户名：</span> -->
        <p>打款金额：<span style="color:#f00">￥{{pic}}</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditoShow = false">取消打款</el-button>
        <el-button type="primary" @click="auditor">确认打款</el-button>
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
        // sellerName: '',
        // withdrawId: '',
        // mobile: '',
        // withdrawStatus: '',
        // pageNum: 1,
        // pageSize: 10,
        // orderBy: 'desc'
        pageIndex: 1,
        pageSize: 10,
        status: '2', // 2未结算， 4已结算
        end: '',
        start: '',
        intoAccount: '', // 账户
        sellerName: '', // 药店
        // endTime: '',
        // salesAmount: '',
        // receivableAmount: ''
      },
      date: [],
      tableData: [],
      columns: this.getColumns(),
      total: 0,
      auditoShow: false,
      pic: 0,
      id: [],
      disabled: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      isLoading: true,
      defaultTime: ['00:00:00', '23:59:59'],
      // sellerUserId: ''
    };
  },
  methods: {
    query() {
      this.searchInfo.pageIndex = 1;
      this.getListData();
    },
    dateChange() {
      // 22
      this.searchInfo.start = this.date[0];
      this.searchInfo.end = this.date[1];
    },
    batch() {
      if (this.id.length > 0) {
        this.auditoShow = true;
      } else {
        this.$message.warning('请选择需要批量打款的商户');
      }

    },
    // 自定义事件
    customCompFunc(params) {
      if (params.type === 'seeOrderDetail') { // 查看详情
        this.$router.push('/o2oPlatform/bill/billDetail?id=' + params.rowData.billId);
      } else if (params.type === 'query') { // 打款
        this.auditoShow = true;
        this.pic = params.rowData.salesAmount;
        this.id.push(params.rowData.billId);
        // this.sellerUserId = params.rowData.sellerUserId;
      }
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 10,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'sellerName', title: '药店名称', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'intoAccount', title: '打款账户', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'intoCard', title: '打款卡号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'openingBank', title: '打款银行', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'receivableAmount', title: '应收金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'salesAmount', title: '销售金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'postageAmount', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'servicesAmount', title: '服务费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'payAmount', title: '支付金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'preferentialAmount', title: '优惠金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'incomeAmount', title: '药店收益', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '当前状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createTime', title: '账单生成时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '账单周期', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-bill', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i <= 1) {
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
        if (item.field === 'startDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            let value2 = formatDate(rowData['endDate']);
            if (value && value2) {
              return value.slice(0, -8) + '~' + value2.slice(0, -8);
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'createTime') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            if (value || value === 0) {
              return value;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 2) {
              return '<span style="color:red">未结算</span>';
            } else if (value === 4) {
              return '<span style="color:red">已结算</span>';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'incomeAmount' || item.field === 'salesAmount' || item.field === 'postageAmount' || item.field === 'servicesAmount' || item.field === 'payAmount' || item.field === 'preferentialAmount') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // console.log(rowData[field]);
            // '￥' + rowData[field] ? rowData[field].toFixed(2) : ''
            let value = rowData[field];
            if (value || value === 0) {
              value = '￥' + value.toFixed(2);
            }
            if (value || value === 0) {
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
    // 审核付款
    auditor() {
      let obj = {
        billIds: this.id
      };
      this.auditoShow = false;
      javaRequest.post('/mall_manage/back/settlement/transferMoney', obj).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getListData();
          this.disabled = true;
          this.id = [];
        }
      });
    },
    getListData() {
      this.isLoading = true;
      javaRequest.post('/mall_manage/back/settlement/findBillSettledPage', this.searchInfo).then(res => {
        this.isLoading = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          for (let i = 0; i < res.data.resultData.list.length; i++) {
            if (res.data.resultData.list[i].status !== 2 || !res.data.resultData.list[i].intoAccount) {
              res.data.resultData.list[i]._disabled = true;
            }
          }
          this.tableData = res.data.resultData.list;
          this.total = res.data.resultData.total;
          console.log(this.tableData);
        }
      });
    },
    selectALL(selection) {
      for (let i = 0; i < selection.length; i++) {
        this.pic += selection[i].salesAmount;
      }
      this.id = selection.map(item => {
        return item.billId;
      });
      if (this.id.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    selectChange(selection, rowData) {
      this.id = selection.map(item => {
        return item.billId;
      });
      if (this.id.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    selectGroupChange(selection) {
      this.id = selection.map(item => {
        return item.billId;
      });
      if (this.id.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
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
