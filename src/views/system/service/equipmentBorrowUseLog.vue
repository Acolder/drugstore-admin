<template>
  <div>
    <!-- <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="medium">
        <el-form-item label="mac">
          <el-input v-model="requestData.MAC" placeholder="mac"></el-input>
        </el-form-item>
        <el-form-item label="用户账号">
          <el-input v-model="requestData.PATH" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="title">
        <div class="mac"><span>用户账号：{{this.$route.query.user}}</span></div>
        <div class="size"><span>联系方式：{{this.$route.query.phone}}</span></div>
        <div class="time"><span>注册时间：{{this.$route.query.regis_time}}</span></div>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=44 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination :page-index="currentPage" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
    </div>
   <!-- 设备使用详情 -->
    <el-dialog
      title="用户借用详情"
      :visible.sync="detailShow"
      width="480px"
      center
      top="20vh"
      :modal-append-to-body="false">
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>Mac编码：</span>
          <span class="rights">{{detailData.mac}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>货品型号：</span>
          <span class="rights">{{detailData.type}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>租借时间(天)：</span>
          <span class="rights">{{detailData.borrow_days}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>当前状态：</span>
          <span class="rights">{{
                                 detailData.order_status === 0 ? '待支付':
                                 detailData.order_status === 1 ? '待发货':
                                 detailData.order_status === 2 ? '待用户签收':
                                 detailData.order_status === 3 ? '使用中':
                                 detailData.order_status === 4 ? '归还中':
                                 detailData.order_status === 5 ? '已归还': '已取消'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>订单提交时间：</span>
          <span class="rights">{{detailData.created_time || '-'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>开始时间：</span>
          <span class="rights">{{detailData.start_time || '-'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>到期时间：</span>
          <span class="rights">{{detailData.end_time || '-'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>退还时间：</span>
          <span class="rights">{{detailData.back_time || '-'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>收到设备时间：</span>
          <span class="rights">{{detailData.back_affim_time || '-'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>检测次数：</span>
          <span class="rights">{{detailData.testing_count}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>成交订单数：</span>
          <span class="rights">{{detailData.order_count}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>成交金额数：</span>
          <span class="rights">{{detailData.order_money}}</span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      columns: this.getColumns(),
      pageIndex: 0,
      pageSize: 20,
      total: 0,
      user: this.$route.query.user,
      tableData: [],
      requestData: {
        // mac
        MAC: '',
        // 用户账号
        PATH: ''
      },
      logPop: false,
      detailData: {},
      detailShow: false,
      currentPage: 1
    };
  },
  created() {
    this.getTableData();
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
          let index = _self.pageIndex * _self.pageSize + rowIndex + 1;
          return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        },
        isFrozen: true,
        isResize: true
      },
      { field: 'mac', title: 'Mac编码', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'type', title: '货品型号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'borrow_days', title: '租借时间（天）', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'order_status', title: '当前状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'created_time', title: '订单提交时间', width: 110, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'start_time', title: '开始时间', width: 110, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'end_time', title: '到期时间', width: 110, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'back_time', title: '退还时间', width: 110, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'back_affim_time', title: '收到设备时间', width: 110, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'testing_count', title: '检测次数', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'order_count', title: '成交订单数', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'order_money', title: '成交金额数', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'option', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-useLog', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          // console.log(rowData);
          let value = rowData[field];
          // console.log(value);
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'order_status') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            // console.log(value);
            if (value === 0) {
              return '<span style="color:blueviolet">待支付</span>';
            } else if (value === 1) {
              return '<span style="color:skyblue">待发货</span>';
            } else if (value === 2) {
              return '<span style="color:orange">待用户签收</span>';
            } else if (value === 3) {
              return '<span style="color:green">使用中</span>';
            } else if (value === 4) {
              return '<span style="color:purple">归还中</span>';
            } else if (value === 5) {
              return '<span style="color:hotpink">已归还</span>';
            } else if (value === -1) {
              return '<span style="color:red">已取消</span>';
            }
          };
        }
        if (item.field === 'testing_count') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) return value;
            return '-';
          };
        }
        if (item.field === 'order_count') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) return value;
            return '-';
          };
        }
        if (item.field === 'order_money') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) return value;
            return '-';
          };
        }
      }
      return columns;
    },
    getTableData() {
      this.requestData.PageIndex = this.pageIndex + 1;
      this.requestData.pageSize = this.pageSize;
      this.requestData.user = this.user;
      console.log(this.requestData.user);
      ajax.post(`/api/borrow/GetDeviceBorrowLog`, this.requestData).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.data.rcount;
          this.tableData = res.data.data.data;
        }
      });
    },
    // query() {
    //   this.pageIndex = 0;
    //   // this.getTableData();
    //   this.pageChange();
    // },
    pageChange(pageIndex) {
      this.currentPage = pageIndex;
      this.pageIndex = pageIndex - 1;
      console.log(this.pageIndex);
      this.getTableData(pageIndex);
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 0;
      this.pageSize = pageSize;
      this.getTableData();
    },
    customCompFunc(params) {
      if (params.type === 'see') {
        let {
          mac,
          type,
          consignee_phone,
          borrow_days,
          order_status,
          created_time,
          start_time,
          end_time,
          back_time,
          back_affim_time,
          testing_count,
          order_count,
          order_money,
        }  = params.rowData;
        this.detailData = {
          mac,
          type,
          consignee_phone,
          borrow_days,
          order_status,
          created_time,
          start_time,
          end_time,
          back_time,
          back_affim_time,
          testing_count,
          order_count,
          order_money,
        };
        this.detailShow = true;
        console.log(params);

      }
    }
  }
};

</script>
<style lang="less" scoped>
.col-wrap{
  padding: 5px 50px;
  display: flex;
  justify-content: flex-start;
  text-align: left;
  span{
    &:nth-child(1){
      // padding: 1px 20px;
      height: 20px;
      width: 120px;
      text-align: right;
      display: inline-block;
    }
  }
  .rights{
    margin-left: 20px;
  }
}
.title {
  width: 100%;
  height: 80px;
  // background: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  div {
    height: 100%;
    padding: 0 10px;
    font-weight: 700;
    line-height: 100%;
    display: flex;
    align-items: center;
 }
}
</style>
