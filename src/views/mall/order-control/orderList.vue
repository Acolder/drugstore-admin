<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form" label-width="90px" style="padding-right:20px;">
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model.trim="requestData.orderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="requestData.orderStatus" placeholder="请选择">
            <el-option v-for="item in orderStatusArray" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送方式" prop="orderTransport">
          <el-select v-model="requestData.orderTransport" placeholder="请选择">
            <el-option v-for="item in orderTransportArray" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否测试单" prop="isTest">
          <el-select v-model="requestData.isTest" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="isOtc">
          <el-select v-model="requestData.isOtc" placeholder="请选择" clearable>
            <el-option label="处方药" value="2"></el-option>
            <el-option label="非处方药" value="1"></el-option>
            <el-option label="全部"  value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取货码" prop="extractCode">
          <el-input v-model="requestData.extractCode" placeholder="取货码"></el-input>
        </el-form-item>
        <el-form-item label="物流类型" prop="logisticsType">
          <el-select v-model="requestData.logisticsType" placeholder="请选择">
            <el-option v-for="item in logisticsTypeArray" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源" prop="abutmentFlag">
          <el-select v-model="requestData.abutmentFlag" placeholder="请选择">
            <el-option v-for="item in abutmentFlagOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货人" prop="addressName">
          <el-input v-model.trim="requestData.addressName" placeholder="收货人"></el-input>
        </el-form-item>
        <el-form-item label="订单时间" class="orderTime">
          <el-date-picker
            v-model="requestData.createStart"
            align="right"
            type="date"
            placeholder="选择开始日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:180px">
          </el-date-picker>至
          <el-date-picker
            v-model="valueDate"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="pickerOptions2"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:180px">
          </el-date-picker>
          <p style="color:red" v-if="errorShow">结束时间必须大于开始时间</p>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="seach" icon="el-icon-search">查询</el-button>
          <el-button type="default" size="small" @click="exportActive">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoading" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>
.search-wrapper {
  .orderTime {
    .date-picker {
      width: 150px;
    }
  }
  .dateInput{
    /deep/ .el-range-separator{
      width: 26px;
    }
  }
}

</style>
<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  name: 'orderQuery',
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      isLoading: false,
      requestData: {
        orderId: '',
        extractCode: '',
        logisticsNumber: '',
        createStart: '',
        createEnd: '',
        orderStatus: '',
        orderTransport: '',
        isOtc: '',
        orderBy: 'desc',
        sellerUserId: '',
        logisticsType: '',
        abutmentFlag: null,
        addressName: '',
        isTest: ''
      },
      logisticsTypeArray: [
        { label: '全部', value: '' },
        { label: '美团', value: 1 },
        { label: '自行', value: 2 },
        { label: '商城配送', value: 3 },
      ],
      abutmentFlagOption: [
        { label: '全部', value: null },
        { label: '药葫芦', value: 0 },
        { label: '美团', value: 1 },
        { label: '京东到家', value: 4 },
        { label: '饿了么', value: 2 },
      ],
      exportInfo: '',
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
      valueDate: '',
      orderStatusMap: {
        '': '全部',
        '0': '已取消',
        '10': '待付款',
        '20': '待确认',
        '30': '配送中',
        '40': '交易成功',
        '50': '已退款',
        '60': '部分退款',
        '70': '退款中',
        '80': '待评价',
        '90': '待审核',
        '100': '处方未通过审核',
      },
      transports: {
        '': '全部',
        '1': '普通物流',
        '2': '28分钟达',
        '3': '自提',
        '4': '跨境电商'
      },
      errorShow: false
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ]),
    orderStatusArray: function() {
      let array = [];
      for (let item in this.orderStatusMap) {
        if (!this.orderStatusMap.hasOwnProperty(item)) {
          continue;
        }
        array.push({ key: item, value: this.orderStatusMap[item] });
      }
      return array;
    },
    orderTransportArray: function() {
      let array = [];
      for (let item in this.transports) {
        if (!this.transports.hasOwnProperty(item)) {
          continue;
        }
        array.push({ key: item, value: this.transports[item] });
      }
      return array;
    },
  },
  methods: {
    // 导出按钮
    exportActive() {
      let token =  this.exportInfo.sellerUserId;
      let status = this.exportInfo.orderStatus;
      let orderTransport = this.exportInfo.orderTransport;
      let createStart = this.exportInfo.createStart;
      let createEnd = this.exportInfo.createEnd;
      let orderId = this.exportInfo.orderId;
      let orderBy = this.exportInfo.orderBy;
      let isOtc = this.exportInfo.isOtc;
      let logisticsNumber = this.exportInfo.logisticsNumber;
      let logisticsType = this.exportInfo.logisticsType;
      let abutmentFlag = this.exportInfo.abutmentFlag ? this.exportInfo.abutmentFlag : '-99';
      let addressName = this.exportInfo.addressName;
      let isTest = this.exportInfo.isTest;
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage/back/order/exportExcleOrder?usertoken=` + token + '&status=' + status +
      '&orderTransport=' + orderTransport + '&createStart=' + createStart + '&createEnd=' + createEnd + '&orderId=' + orderId +
      '&orderBy=' + orderBy + '&isOtc=' + isOtc + '&logisticsNumber=' + logisticsNumber + '&logisticsType=' + logisticsType + '&abutmentFlag=' + abutmentFlag + '&addressName=' + addressName + '&isTest=' + isTest);
    },
    getColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 20,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'orderId', title: '订单号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderPayment', title: '金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'foodShareFee', title: '平台费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderStatus', title: '订单状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isOtc', title: '产品类型', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderTransport', title: '配送方式', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'extractCode', title: '取货码', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'logisticsType', title: '物流类型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isTest', title: '是否测试单', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'abutmentFlag', title: '订单来源', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'address_name', title: '收货人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '订单时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'sellerName', title: '商户名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 220, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-roder', isResize: true },
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
        if (item.field === 'modifyDate' || item.field === 'orderPaymentTime' || item.field === 'createDate') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            } else {
              return '-';
            }
          };
        } else if (item.field === 'orderTransport') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData[field];
            return _self.transports[v] || '-';
          };
        } else if (item.field === 'sellerAddress') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData['sellerUserPo'];
            return v.sellerAddress || '-';
          };
        } else if (item.field === 'orderStatus') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData[field];
            let value = _self.orderStatusMap[v];
            if (value === '配送中' && rowData['orderTransport'] === '3') {
              value = '待取货';
            }
            if (value === '待确认' || value === '待审核') {
              return `<span style='color:#f00'>${value}</span>`;
            } else {
              return value;
            }
          };
        } else if (item.field === 'sellerName') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData['sellerUserPo'];
            return v['sellerName'] || '-';
          };
        } else if (item.field === 'address_name') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData['addressPo'];
            return v.addressName || '-';
          };
        } else if (item.field === 'address_phone') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData['addressPo'];
            return v.addressPhone || '-';
          };
        } else if (item.field === 'total_address') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = rowData['addressPo'];
            return v.totalAddress || '-';
          };
        } else if (item.field === 'orderPayment') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = '￥' + rowData['orderPayment'].toFixed(2);
            return `<span style='color:#f00'>${v}</span>` || '-';
          };
        }
        else if (item.field === 'isOtc') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 订单类型
            let value = rowData[field];
            if (value === 1) {
              return '非处方';
            } else if (value === 2) {
              return `<span style='color:#f00'>处方</span>`;
            } else {
              return '-';
            }
          };
        }
        else if (item.field === 'logisticsType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 订单类型
            let value = rowData[field];
            let a = '';
            if (value) {
              switch (value) {
                case 'yunda':
                  a = '韵达';
                  break;
                case 'shunfeng':
                  a = '顺丰';
                  break;
                case 'huitongkuaidi':
                  a = '百世汇通';
                  break;
                case 'zhongtong':
                  a = '中通';
                  break;
                case 'yuantong':
                  a = '圆通';
                  break;
                case 'guotongkuaidi':
                  a = '国通';
                  break;
                case 'tianitan':
                  a = '天天';
                  break;
                case 'youshuwuliu':
                  a = '优速';
                  break;
                case 'kuaijiesudi':
                  a = '快捷';
                  break;
                case 'quanfengkuaidi':
                  a = '全峰';
                  break;
                case 'youzhengguonei':
                  a = '邮政包裹';
                  break;
                default:
                  a = value;
              }
            } else {
              a = '-';
            }
            return a;
          };
        }
        else
        if (item.field === 'isTest') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 是否测试
            let value = rowData[field];
            if (value === 0) {
              return `<span style='color:green'>正常</span>`;
            } else if (value === 1) {
              return `<span style='color:red'>测试单</span>`;
            } else {
              return '-';
            }
          };
        }
        else
        if (item.field === 'abutmentFlag') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 是否测试
            let value = rowData[field];
            if (value === 0) {
              return `药葫芦`;
            } else if (value === 1) {
              return `美团`;
            } else if (value === 2) {
              return `饿了么`;
            } else if (value === 4) {
              return `京东到家`;
            } else {
              return '-';
            }
          };
        } else
        // 平台费
        if (item.field === 'foodShareFee') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value || value === 0) {
              return '￥' + value.toFixed(2);
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'detail') {
        this.$router.push('/order-control/orderDetail?id=' + param.rowData.orderId);
      }
      if (param.type === 'sign') {
        this.$confirm('此操作将会把订单标记为测试订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let request = {
            orderId: param.rowData.orderId,
            isTest: 1
          };
          this.setSign(request);
        });
      }
      if (param.type === 'signnormal') {
        this.$confirm('此操作将会把订单标记为正常订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let request = {
            orderId: param.rowData.orderId,
            isTest: 0
          };
          this.setSign(request);
        });
      }
    },
    setSign(request) {
      ajax.post(`/mall_manage/back/order/updateIsTestOrder`, request).then((res) => {
        if (res && res.status === 200 && res.data && String(res.data.resultCode) === '0') {
          this.$message.success(res.data.msg);
          this.getDataList();
        }
      });
    },
    getQueryParams: function() {
      this.requestData.createEnd = this.valueDate ? this.valueDate + ' 23:59:59' : '';
      if (this.requestData.createEnd < this.requestData.createStart) {
        this.errorShow = true;
      } else {
        this.errorShow = false;
      }
      this.requestData.pageNum = this.pageIndex;
      this.requestData.pageSize = this.pageSize;
      return this.requestData;
    },
    getDataList() {
      let _self = this;
      let request = this.getQueryParams();
      this.exportInfo = request;
      this.isLoading = true;
      ajax.post(`/mall_manage/back/order/queryConditionOrder`, request).then((res) => {
        this.isLoading = false;
        if (res && res.status === 200 && res.data && String(res.data.resultCode) === '0') {
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
        }
      });
    },
    seach() {
      this.pageIndex = 1;
      this.getDataList();
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      this.requestData.createStart = '';
      this.valueDate = '';
      this.seach();
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getDataList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getDataList();
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
    this.getDataList();
  }
};

</script>
