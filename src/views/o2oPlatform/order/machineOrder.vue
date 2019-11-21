<template>
  <div class="warp">
    <div class="cabinetList">
      <div class="search-wrapper">
        <el-form :inline="true" :model="search" size="small" ref="querycabinet_form" label-width="82px" style="padding-right:20px;">
          <el-form-item label="机器分组：" prop="MGID">
            <el-select filterable v-model="search.MGID" placeholder="请选择" @change="groupidChange" clearable>
              <el-option v-for="item in groupArray" :key="item.MGID" :label="item.MGName" :value="item.MGID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机器编号：" prop="MID">
            <el-select filterable v-model="search.MID" placeholder="请选择" clearable>
              <el-option v-for="item in numberArray" :key="item.MId" :label="item.MiAlias" :value="item.MId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单类型：" prop="OrderType">
            <el-select v-model="search.OrderType" placeholder="请选择" clearable>
              <el-option label="本机零售自提" value="0"></el-option>
              <el-option label="预约配送购药" value="1"></el-option>
              <el-option label="药葫芦自提" value="2"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态：" prop="OrderState">
            <el-select v-model="search.OrderState" placeholder="请选择" clearable>
              <el-option label="待支付" value="0"></el-option>
              <el-option label="已支付" value="1"></el-option>
              <el-option label="退款中" value="2"></el-option>
              <el-option label="已退款" value="3"></el-option>
              <el-option label="已完成" value="4"></el-option>
              <el-option label="退款失败" value="-3"></el-option>
              <el-option label="交易失败" value="-4"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品订单号" prop="OrderNo">
            <el-input v-model="search.OrderNo" placeholder="商品订单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="支付流水号" prop="TradeNo">
            <el-input v-model="search.TradeNo" placeholder="支付订单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="CreateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="selectCreatTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="支付时间：">
            <el-date-picker
              v-model="PayTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="selectPayTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="btn-wrapper">
            <el-button type="default" icon="el-icon-delete" @click="resetSearchForm">清空</el-button>
            <el-button type="primary" @click="queryMacChine" icon="el-icon-search">查询</el-button>
            <el-button type="default" size="small" @click="macchineExport">导 出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-wrapper">
        <v-table ref="data_table" :is-loading="isMacLoading" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="MacChineColumns" :table-data="macChineData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="MACpageChange" @page-size-change="MACpageSizeChange" :total="macChineTotal" :page-size="search.rows" :page-index="search.page" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </div>
    <!-- 药柜导出订单 -->
    <el-dialog
      title="导出订单"
      :visible.sync="exportShow"
      width="800px"
      center
      top="15vh"
      :modal-append-to-body="false"
      @close="exportSearchClose">
      <div class="search-wrapper">
        <el-form :inline="true" :model="exportSearch" size="small" ref="queryExport_form" label-width="82px" style="padding-right:20px;">
          <el-form-item label="机器分组：" prop="MGID">
            <el-select filterable v-model="exportSearch.MGID" placeholder="请选择" @change="groupidChange" clearable>
              <el-option v-for="item in groupArray" :key="item.MGID" :label="item.MGName" :value="item.MGID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机器编号：" prop="MID">
            <el-select filterable v-model="exportSearch.MID" placeholder="请选择" clearable>
              <el-option v-for="item in numberArray" :key="item.MId" :label="item.MiAlias" :value="item.MId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单类型：" prop="OrderType">
            <el-select v-model="exportSearch.OrderType" placeholder="请选择" clearable>
              <el-option label="本机零售自提" value="0"></el-option>
              <el-option label="预约配送购药" value="1"></el-option>
              <el-option label="药葫芦自提" value="2"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态：" prop="OrderState">
            <el-select v-model="exportSearch.OrderState" placeholder="请选择" clearable>
              <el-option label="待支付" value="0"></el-option>
              <el-option label="已支付" value="1"></el-option>
              <el-option label="退款中" value="2"></el-option>
              <el-option label="已退款" value="3"></el-option>
              <el-option label="已完成" value="4"></el-option>
              <el-option label="退款失败" value="-3"></el-option>
              <el-option label="交易失败" value="-4"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单金额：" class="moneySum" prop="OrderMoneyStart">
            <el-input v-model="exportSearch.OrderMoneyStart" placeholder="订单金额" clearable></el-input>
            <span>至</span>
            <el-input v-model="exportSearch.OrderMoneyEnd" placeholder="订单金额" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单时间：">
            <el-date-picker
              v-model="OrderTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="selectOrderTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="btn-wrapper">
            <el-button type="primary" size="small" @click="queryExport">导 出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 药柜订单详情 -->
    <el-dialog
      title="订单详情"
      :visible.sync="detailShow"
      width="1100px"
      center
      top="15vh"
      :modal-append-to-body="false"
      class="detail-wrap">
      <el-row>
        <el-col :span="8">
          <p>订单号：{{macChineDetail.OrderNO}}</p>
        </el-col>
        <el-col :span="8">
          <p>机器号：{{macChineDetail.MID}}</p>
        </el-col>
        <el-col :span="8">
          <p>订单类型：{{macChineDetail.OrderTypeAlias}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p>订单状态：{{macChineDetail.OrderStateAlias}}</p>
        </el-col>
        <el-col :span="8">
          <p>支付状态：{{macChineDetail.OrderPayStateAlias}}</p>
        </el-col>
        <el-col :span="8">
          <p>支付方式：{{macChineDetail.PayMethodAlias}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p>订单金额：{{macChineDetail.OrderMoney}}</p>
        </el-col>
        <el-col :span="8">
          <p>实付金额：{{macChineDetail.PayMoney}}</p>
        </el-col>
        <el-col :span="8">
          <p>支付时间：{{macChineDetail.PayTime}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p>支付流水号：{{macChineDetail.TradeNo}}</p>
        </el-col>
        <el-col :span="8">
          <p>取货码：{{macChineDetail.FetchCode}}</p>
        </el-col>
        <el-col :span="8">
          <p>订单来源：{{macChineDetail.OrderSourceAlias}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p>创建时间：{{macChineDetail.CreateTime}}</p>
        </el-col>
        <el-col :span="8" v-if="macChineDetail.OrderType == 1">
          <p>收货人姓名{{macChineDetail.ConsigneeName}}</p>
        </el-col>
        <el-col :span="8" v-if="macChineDetail.OrderType == 1">
          <p>收货人电话{{macChineDetail.ConsigneeNumber}}</p>
        </el-col>
      </el-row>
      <el-row v-if="macChineDetail.OrderType == 1">
        <el-col :span="8">
          <p>收货人地址：{{macChineDetail.ConsigneeAddress}}</p>
        </el-col>
      </el-row>
      <el-row>
        <v-table ref="data_table" column-width-drag :row-height="50" :is-horizontal-resize="true" style="width:100%" :columns="MachineDetailColumns" :table-data="macChineDetail.ProductList" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
      </el-row>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.search-wrapper {
  // .btn-wrapper {
    // padding: 0 30px;
  // }
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
.moneySum{
  /deep/ .el-input{
    display: inline-block;
    width: 215px;
  }
}
.detail-wrap{
  /deep/ .el-row{
    padding: 10px 20px;
  }
}

</style>
<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import  group  from './group';
import  machineIds  from './machineId';
// https://tkmvem.kangmeiyaohulu.com
export default {
  data() {
    return {
      MacChineColumns: this.getMacChineColumns(), // 药柜订单表格展示
      MachineDetailColumns: this.getMachineDetailColumns(), // 订单详情商品表格展示
      // 药柜订单搜索
      search: {
        MGID: '',
        MID: '',
        OrderNo: '',
        TradeNo: '',
        OrderType: '',
        OrderSource: '',
        OrderState: '',
        CreateTimeStart: '',
        CreateTimeEnd: '',
        PayTimeStart: '',
        PayTimeEnd: '',
        LoginAccount: 'admin',
        page: 1,
        rows: 10,
        sidx: 'CreateTime',
        sord: 'desc'
      },
      // 药柜机器分组
      groupArray: group.group,
      // 药柜机器id
      numberArray: machineIds.ids,
      // 药柜订单数据
      macChineData: [],
      macChineTotal: 0,
      yaohuluType: 'primary',
      macChineType: 'detault',
      isMacLoading: true,
      PayTime: '',
      CreateTime: '',
      exportShow: false,
      // 导出搜索
      exportSearch: {
        MGID: '',
        MID: '',
        OrderType: '',
        OrderState: '',
        OrderTimeStart: '',
        OrderTimeEnd: '',
        OrderMoneyStart: '',
        OrderMoneyEnd: '',
        LoginAccount: 'admin',
      },
      // 订单时间
      OrderTime: '',
      // 订单弹窗详情框
      detailShow: false,
      macChineDetail: ''
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
  },
  methods: {
    // 清空药柜搜索
    resetSearchForm() {
      this.$refs['querycabinet_form'].resetFields();
      this.PayTime = '';
      this.CreateTime = '';
      this.search.page = 1;
      this.search.rows = 10;
      this.search.CreateTimeStart = '';
      this.search.CreateTimeEnd = '';
      this.search.PayTimeStart = '';
      this.search.PayTimeEnd = '';
      this.seachMacchine();
    },
    // 选择分组发生改变
    groupidChange() {
      this.search.MID = '';
      if (this.search.MGID) {
        this.numberArray = this.searchNumber(this.search.MGID);
      } else {
        this.numberArray = machineIds.ids;
      }
    },
    searchNumber(name) {
      let rs = [];
      if (name === '') {
        return [];
      }
      for (let i = 0; i < machineIds.ids.length; i++) {
        let ls = machineIds.ids[i];
        if (name === ls.MiGroup) {
          rs.push(ls);
        }
      }
      return rs;
    },
    MACpageChange(pageIndex) {
      this.search.page = pageIndex;
      this.seachMacchine();
    },
    MACpageSizeChange(pageSize) {
      this.search.page = 1;
      this.search.rows = pageSize;
      this.seachMacchine();
    },
    // 药柜搜索
    queryMacChine() {
      this.search.page = 1;
      this.search.rows = 10;
      this.seachMacchine();
    },
    // 获取药柜数据
    seachMacchine() {
      this.isMacLoading = true;
      axios.post(`${process.env.CONTAINER_HOST}/api/Order/GetList`, this.search).then(res => {
        console.log(res);
        this.isMacLoading = false;
        if (res.status === 200) {
          this.macChineData = res.data.rows;
          this.macChineTotal = res.data.records;
        }
      });
    },
    // 选择创建时间变化
    selectCreatTime() {
      console.log(this.CreateTime);
      if (this.CreateTime) {
        this.search.CreateTimeStart = this.CreateTime[0];
        this.search.CreateTimeEnd = this.CreateTime[1];
      } else {
        this.search.CreateTimeStart = '';
        this.search.CreateTimeEnd = '';
      }
    },
    selectPayTime() {
      if (this.PayTime) {
        this.search.PayTimeStart = this.PayTime[0];
        this.search.PayTimeEnd = this.PayTime[1];
      } else {
        this.search.PayTimeStart = '';
        this.search.PayTimeEnd = '';
      }
    },
    selectOrderTime() {
      if (this.OrderTime) {
        this.exportSearch.OrderTimeStart = this.OrderTime[0];
        this.exportSearch.OrderTimeEnd = this.OrderTime[1];
      } else {
        this.exportSearch.OrderTimeStart = '';
        this.exportSearch.OrderTimeEnd = '';
      }
    },
    // 药柜导出按钮
    macchineExport() {
      this.exportShow = true;
    },
    // 弹窗关闭
    exportSearchClose() {
      this.$refs['queryExport_form'].resetFields();
      this.exportSearch.OrderMoneyEnd = '';
      this.OrderTime = '';
      this.exportSearch.OrderTimeStart = '';
      this.exportSearch.OrderTimeEnd = '';
    },
    // 药柜确认导出按钮
    queryExport() {
      axios.post(`${process.env.CONTAINER_HOST}/api/Order/OrderSearchExportData`, this.exportSearch).then(res => {
        console.log(res);
        // this.isMacLoading = false;
        if (res.status === 200 && res.data.Code === 0) {
          this.exportShow = false;
          window.open(`${process.env.CONTAINER_HOST}/api/Order/DownloadExcel?filename=` + res.data.Data);
        } else {
          this.$message.warning(res.data.Message);
        }
      });
    },
    getMacChineColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 40,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.search.page - 1) * _self.search.rows + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'MID', title: '机器编号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'BusinessCode', title: '客商编码', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'StoreCode', title: '门店名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'OrderNO', title: '商品订单号', width: 220, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'TradeNo', title: '支付流水号', width: 220, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'OrderTypeAlias', title: '订单类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'extractCode', title: '商品名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'logisticsType', title: 'SKU/货号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'isTest', title: '单价', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'abutmentFlag', title: '购买数量', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'OrderMoney', title: '订单总额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'PayMoney', title: '实付金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'OrderStateAlias', title: '订单状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'PayMethodAlias', title: '支付方式', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'MerchantID', title: '收款账号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'BuyerID', title: '买家账号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'PayTime', title: '支付时间', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'CreateTime', title: '订单创建时间', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 130, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-machineorder', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'OrderMoney' || item.field === 'PayMoney') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = Number(rowData[field]).toFixed(2);
            if (value) {
              return `<span style="color:red">￥${value}</span>`;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'OrderStateAlias') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '交易失败') {
              return `<span style="color:red">${value}</span>`;
            } else {
              return value;
            }
          };
        }
      }
      return columns;
    },
    getMachineDetailColumns() {
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 40,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'ProductName', title: '商品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ProductCode', title: '商品编码', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ProductImage', title: '商品图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ProductPrice', title: '单价', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'SerialNumber', title: '出货流水号', width: 220, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ShipmentState', title: '出货状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ShipmentCoilInfo', title: '货道', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ShipmentDateTime', title: '出货时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'ProductImage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field].split(';')[0];
            if (value) {
              return `<img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" />`;
            } else {
              return `<img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" />`;
            }
          };
        }
        if (item.field === 'ProductPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = Number(rowData[field]).toFixed(2);
            if (value) {
              return `<span style="color:red">￥${value}</span>`;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'ShipmentState') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:green">出货成功</span>`;
            } else if (value) {
              return `<span style="color:red">出货失败</span>`;
            } else {
              return `未出货`;
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'detail') {
        this.detailShow = true;
        this.getDetail(param.rowData.OrderNO);
      }
    },
    getDetail(OrderNO) {
      axios.post(`${process.env.CONTAINER_HOST}/api/Order/GetOrderDetail?orderno=${OrderNO}`).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.Code === 0) {
          this.macChineDetail = res.data.Data;
        } else {
          this.$message.warning(res.data.Message);
          console.log(1);
        }
      });
    }
  },
  created() {
    this.seachMacchine();
  }
};
</script>
