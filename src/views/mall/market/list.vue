<template>
  <div class="market-list">
    <!-- 搜索区域 -->
    <div class="search-wrappe">
      <el-form :inline="true" :model="searchInfo" size="small" label-width="72px">
        <el-form-item label="名称:">
          <el-input v-model.trim="searchInfo.couponName" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="searchInfo.couponType" clearable>
            <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchInfo.state" clearable>
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <!-- <el-button type="default" @click="clean">清空</el-button> -->
            <el-button type="default" icon="el-icon-share" @click="exportActive" style="background: #67c23a; color: #fff;">导出</el-button>
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
import { getToken, base64Encrypt } from '@/utils/auth';
export default {
  name: 'market-list',
  data() {
    return {
      isLoding: false,
      searchInfo: {
        couponName: '',
        couponType: '',
        state: '',
        orderBy: 'desc',
        pageNum: 1,
        pageSize: 10
      },
      couponTypeList: [
        { label: '全部', value: '' },
        { label: '店铺优惠券', value: '1' },
        { label: '商品优惠券', value: '2' },
      ],
      stateList: [
        { label: '全部', value: '' },
        { label: '已删除', value: '0' },
        { label: '领取中', value: '1' },
        { label: '已结束', value: '2' },
      ],
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
            let index = (_self.searchInfo.pageNum - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '店铺', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'couponName', title: '名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'couponType', title: '类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'preferentialAmount', title: '面额', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'useTheThreshold', title: '门槛', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '使用时间', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'effectiveDate', title: '有效时间', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'limitCollarPerPerson', title: '限领', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'distributionQuantity', title: '发行量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-marke', isResize: true }
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
        if (item.field === 'state') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let typeList = {
              '0': '已删除',
              '1': '领取中',
              '2': '已结束'
            };
            let value = typeList[v];
            if (value === '已删除' || value === '已结束') {
              return `<span style="color:red">${value}</span>`;
            } else if (value === '领取中') {
              return `<span style="color:green">${value}</span>`;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'couponType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '1': '店铺优惠券',
              '2': '商品优惠券'
            };
            let value = stateList[v];
            return value || '-';
          };
        }
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
      // 22
      if (param.type === 'seeMarke') {
        this.$router.push('/market/detail?id=' + param.rowData.couponId + '&secuID=' + param.rowData.securitiesInformationId);
      }
      if (param.type === 'endMarke') {
        this.$confirm('此操作将执行结束优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            couponId: param.rowData.couponId,
            state: '2'
          };
          this.marketOption(obj);
        });
      }
      if (param.type === 'delateMarke') {
        this.$confirm('此操作将执行删除优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            couponId: param.rowData.couponId,
            state: '0'
          };
          this.marketOption(obj);
        });
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
      this.getTableData();
    },
    query() {
      this.searchInfo.pageNum = 1;
      this.exportData = this.searchInfo;
      this.getTableData();
    },
    exportActive() {
      let token = getToken();
      // let couponName = this.exportData.couponName;
      // let couponType = this.exportData.couponType;
      // let state = this.exportData.state;
      // window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/coupon/exportExcleCoupon?usertoken=` + token + '&couponName=' + couponName +
      // '&couponType=' + couponType + '&state=' + state + '&orderBy=asc');
      let param = {
        couponName: this.exportData.couponName,
        couponType: this.exportData.couponType,
        state: this.exportData.state,
        orderBy: 'asc'
      };
      param = JSON.stringify(param);
      param = base64Encrypt(param);
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage/back/coupon/exportExcleCoupon?usertoken=` + token + '&param=' + param);
    },
    getTableData() {
      javaRequest.post('/mall_manage/back/coupon/queryCouponBasicInformation', this.searchInfo).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // 优惠券状态修改
    marketOption(param) {
      javaRequest.post('/mall_manage/back/coupon/delCoupons', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getTableData();
        }
      });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.toolbar-wrapper{
  // border: 1px solid #ccc;
  padding: 0px;
  margin-bottom: 30px;
}
.title{
  margin: 15px 0;
}
</style>
