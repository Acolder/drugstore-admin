/* eslint-disable no-loop-func */
<template>
  <div class="customerListWrap">
    <div class="customerHeader">
      <div class="people border">
        <p>客服人数</p>
        <span>{{orderData.userCount}}</span>
      </div>
      <div class="orderNum border">
        <p>今日处理订单数</p>
        <span>{{orderData.dayServiceSize}}</span>
      </div>
      <div class="orderTotal border">
        <p>处理订单总数</p>
        <span>{{orderData.serviceSize}}</span>
      </div>
    </div>
    <div class="tableList">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="Columns" :table-data="tableDataList" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="customerList.pageSize" :page-index="customerList.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import java from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      total: 0,
      tableDataList: [],
      selection: [],
      orderData: '',
      customerList: {
        pageIndex: 1,
        pageSize: 10,
      },
      Columns: this.getColumns(),
    };
  },
  methods: {
    getColumns() {
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'userName', title: '客服人员', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'allOrdersDay', title: '今日处理订单数', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'allOrders', title: '处理订单总数', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '添加时间', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'loginTime', title: '最后登录时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-seeRecord', isResize: true },
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
        if (item.field === 'createDate' || item.field === 'loginTime') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'seeRecord') {
        this.$router.push({
          path: '/CustomerService/CustomerRecord',
          query: {
            id: param.rowData.userId,
            realName: param.rowData.userName,
          },
        });
      }
    },
    getCustomerData() {
      let param = this.customerList;
      java.post(`/mall_manage/back/logService/selectLogService`, param).then((res) => {
        if (res.status === 200 && res.data.resultData.resultCode === '0') {
          this.orderData = res.data.resultData.resultData;
          this.tableDataList = res.data.resultData.resultData.sysUserPo;
          this.total = res.data.resultData.resultData.userCount;
        }
      });
    },
    pageChange(pageIndex) {
      this.customerList.pageIndex = pageIndex;
      this.getCustomerData();
    },
    pageSizeChange(pageSize) {
      this.customerList.pageIndex = 1;
      this.customerList.pageSize = pageSize;
      this.getCustomerData();
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    }
  },
  created() {
    this.getCustomerData();
  },
};
</script>

<style lang="less" scoped>
.customerHeader{
  display: flex;
  justify-content: space-around;
  .border{
    text-align: center;
    width: 300px;
    height: 125px;
    border: 1px solid #cacaca;
    border-radius: 3px;
    font-size: 18px;
    color:#444;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    p{
      height: 30px;
      line-height: 30px;
    }
    span{
      margin-bottom: 20px;
      font-size: 20px;
    }
  }
}
.tableList{
  margin: 50px 0 0 0;
}
</style>
