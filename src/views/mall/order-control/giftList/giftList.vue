<template>
  <div id="giftWrap">
    <div class="search-werap">
      <el-form :inline="true" :model="giftListData" size="small" ref="searchData">
        <el-form-item label="礼包状态:" class="commonItem">
          <el-select v-model="giftListData.orderStatus" placeholder="请选择" clearable >
            <el-option label="待付款" :value='10'></el-option>
            <el-option label="待领取" :value='20'></el-option>
            <el-option label="待提货" :value='30'></el-option>
            <el-option label="已提货" :value='40'></el-option>
            <el-option label="已过期" :value='50'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="礼包编号:">
          <el-input v-model="giftListData.orderId" placeholder="请输入礼包编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单编号:"  style="margin-left:10px">
          <el-input v-model="giftListData.parentOrderId" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="提货手机号:" style="margin-right:15px">
          <el-input v-model="giftListData.addressPhone" placeholder="请输入提货手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="提货门店:" class="commonItem">
          <el-select v-model="giftListData.extractSellerId" placeholder="请选择门店" clearable >
            <el-option v-for="item in getStoreData" :key="item.sellerUserId" :label="item.sellerName" :value="item.sellerUserId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:" class="commonItem startTime">
          <el-date-picker v-model="giftListData.startDate" align="right" type="date" placeholder="选择开始日期" :picker-options="pickerOptions"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" style="width:180px">
          </el-date-picker>
          至
          <el-date-picker v-model="valueDate" align="right" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:180px">
          </el-date-picker>
          <p style="color:red" v-if="errorShow">截止时间必须大于创建时间</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Search" icon="el-icon-search">查 询</el-button>
          <el-button type="default" @click="cleanSearch" icon="el-icon-delete">清 除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="giftListData.PageSize" :page-index="giftListData.PageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
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
      selection: [],
      tableData: [],
      getStoreData: [],
      giftListData: {
        orderStatus: '', // 订单状态
        parentOrderId: '', // 订单id
        orderId: '',  // 礼包编号
        addressPhone: '',  // 提货手机
        extractSellerId: '',  // 提货门店
        startDate: '',  // 创建时间
        endDate: '',  // 截止时间
        pageIndex: 1,
        pageSize: 10,
      },
      errorShow: false,
      valueDate: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 20, titleAlign: 'center', columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.giftListData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'parentOrderId', title: '订单编号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderId', title: '礼包编号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderStatus', title: '礼包状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressPo', title: '提货手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'extractSellerId', title: '提货门店', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'extractSellerName', title: '提货门店', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'extractDate', title: '提货时间', width: 90, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'createDate', title: '创建时间', width: 90, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-seegiftListDetail', isResize: true },
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
        if (item.field === 'extractDate' || item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'orderStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '0') {
              return '已取消';
            } else if (value === '10') {
              return '待付款';
            } else if (value === '20') {
              return '待领取';
            } else if (value === '30') {
              return '待提货';
            } else if (value === '40') {
              return '已提货';
            } else if (value === '50') {
              return '已过期';
            }
          };
        }
        if (item.field === 'addressPo') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value.addressPhone;
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    }
  },
  methods: {
    cleanSearch() {
      this.giftListData.pageIndex = 1;
      this.giftListData.orderStatus = '';
      this.giftListData.parentOrderId = '';
      this.giftListData.orderId = '';
      this.giftListData.addressPhone = '';
      this.giftListData.extractSellerId = '';
      this.giftListData.startDate = '';
      this.giftListData.endDate = '';
      this.gettableData();
    },
    Search() {
      this.giftListData.pageIndex = 1;
      this.gettableData();
    },
    // 获取门店
    getStore() {
      let _self = this;
      let param = {
        // sellerName: '',
        // pageIndex: 1,
        // pageSize: 10,
      };
      java.post(`/mall_manage/back/queryStoreList`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.storeTotal = res.data.resultData.total;
          let storeList = res.data.resultData.map(function(item, index, data) {
            return item;
          });
          _self.getStoreData = storeList;
        }
      });
    },
    getQueryParams: function() {
      this.giftListData.endDate = this.valueDate ? this.valueDate + ' 23:59:59' : '';
      if (this.giftListData.endDate < this.giftListData.startDate) {
        this.errorShow = true;
      } else {
        this.errorShow = false;
      }
      return this.giftListData;
    },
    // 列表
    gettableData() {
      let _self = this;
      let param = _self.getQueryParams();
      if (this.errorShow === false) {
        java.post(`/mall_manage/back/queryPresentList`, param).then((res) => {
          if (res.status === 200 && res.data.resultCode === '0') {
            _self.tableData = res.data.resultData.data;
            _self.total = res.data.resultData.total;
          }
        });
      }
    },
    customCompFunc(param) {
      if (param.type === 'seeOrderDetail') {
        this.$router.push({
          path: '/order-control/giftList/gift_OrderDetail',
          query: {
            id: param.rowData.parentOrderId,
          },
        });
      } else if (param.type === 'seeGiftDetail') {
        this.$router.push({
          path: '/order-control/giftList/giftDetail',
          query: {
            id: param.rowData.orderId,
          },
        });
      }
    },
    pageChange(pageIndex) {
      this.giftListData.pageIndex = pageIndex;
      this.gettableData();
    },
    pageSizeChange(pageSize) {
      this.giftListData.pageIndex = 1;
      this.giftListData.pageSize = pageSize;
      this.gettableData();
    },
    handleCurrentChange(value) {
      this.giftListData.pageIndex = value;
      this.gettableData();
    },
    handleSizeChange(value) {
      this.giftListData.pageIndex = value;
      this.gettableData();
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
  },
  created() {
    this.gettableData();
    this.getStore();
  }
};
</script>

<style lang="less" scoped>

</style>
