<template>
  <div class="exchangeRecord">
    <!-- 搜索查询条件 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchForm" size="small" ref="searchForm" label-width="100px">
        <el-form-item label="兑换单号 :" prop="order_num" style="width: 30%;">
          <el-input v-model.trim="searchForm.order_num" placeholder="请输入兑换单号" clearable style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="兑换状态 :" prop="order_receive_status" style="width: 30%;">
          <el-select v-model="searchForm.order_receive_status" clearable style="width: 300px;">
            <el-option v-for="item in selectedData" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换时间 :" style="width: 30%;">
          <div style="width: 300px;">
            <el-date-picker style="width: 129px;" v-model="searchForm.star_order_create_time" type="date" value-format="yyyy-MM-dd"></el-date-picker> &nbsp;至 &nbsp;
            <el-date-picker style="width: 129px;" v-model="searchForm.end_order_create_time" type="date" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="用户账号 :" prop="order_user_account" style="width: 30%;">
          <el-input v-model.trim="searchForm.order_user_account" placeholder="请输入用户账号" clearable style="width: 300px;"></el-input>
        </el-form-item><el-form-item label="收货人 :" prop="order_user_name" style="width: 30%;">
          <el-input v-model.trim="searchForm.order_user_name" placeholder="请输入收货人名称" clearable style="width: 300px;"></el-input>
        </el-form-item><el-form-item label="联系电话 :" prop="order_user_contact" style="width: 30%;">
          <el-input v-model.trim="searchForm.order_user_contact" placeholder="请输入联系电话" clearable style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item class="btn-wrapper" style="float: right; margin-right: 30px;">
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="temporarySearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格内容 -->
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :multiple-sort="false" mul :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页器 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="formPage.total" :page-size="formPage.pageSize" :page-index="formPage.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      searchForm: {  // 兑换记录查询条件
        order_num: '',
        order_receive_status: '',
        star_order_create_time: '',
        end_order_create_time: '',
        order_user_account: '',
        order_user_name: '',
        order_user_contact: '',
        PageIndex: '1',
        PageSize: '10'
      },
      tableData: [], // 兑换记录数据
      selectedData: [
        { value: 'WaitSend', text: '待发货' },
        { value: 'WaitConfirm', text: '待收货' },
        { value: 'Finish', text: '已完成' },
      ],
      formPage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.getDataList();
  },
  computed: {
    // 兑换记录数据展示
    columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 45, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.formPage.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'order_num', title: '兑换单号', width: 210, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_receive_status', title: '兑换状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_integral', title: '消费积分', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_money', title: '消费现金', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '商品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'type', title: '商品分类', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '用户账号', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_user_name', title: '收货人', width: 90, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_user_contact', title: '联系电话', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_create_time', title: '兑换时间', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-IntegralCommodManage', isResize: true }
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
        if (item.field === 'order_receive_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'None') {
              return '无';
            } else if (value === 'WaitPay') {
              return '待支付';
            } else if (value === 'WaitSend') {
              return '待发货';
            } else if (value === 'WaitConfirm') {
              return '待收货';
            } else if (value === 'Finish') {
              return '已完成';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'Reality') {
              return '实体';
            } else if (value === 'Virtual') {
              return '虚拟';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
  },
  methods: {
    // 获取兑换记录数据
    getDataList() {
      this.$set(this.searchForm, 'PageIndex', this.formPage.pageIndex);
      this.$set(this.searchForm, 'PageSize', this.formPage.pageSize);
      ajax.post('/api/integral/GetIntegralProExchangeLogInfo', this.searchForm).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.tableData = res.data.data;
          this.formPage.total = res.data.recordscount;
        }
        else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      });
    },
    // 搜索查询
    temporarySearch() {
      this.formPage.pageIndex = 1;
      this.getDataList();
    },
    // 搜素清空
    resetForm() {
      let emptySearchData = {
        order_num: '',
        order_receive_status: '',
        star_order_create_time: '',
        end_order_create_time: '',
        order_user_account: '',
        order_user_name: '',
        order_user_contact: '',
        PageIndex: '1',
        PageSize: '10'
      };
      this.searchForm = emptySearchData;
      this.temporarySearch();
    },
    // 分页索引选择
    pageChange(pageIndex) {
      this.formPage.pageIndex = pageIndex;
      this.getDataList();
    },
    // 分页数量选择
    pageSizeChange(pageSize) {
      this.formPage.pageIndex = 1;
      this.formPage.pageSize = pageSize;
      this.getDataList();
    },
    // 查看详情(跳转详情页)
    detail(id) {
      this.$router.push({
        name: 'exchangeDetail',
        params: { id: id }
      });
    },
    // 查看详情操作
    customCompFunc(params) {
      // 对比
      if (params.type === 'detail') {
        let id = params.rowData.id;
        this.detail(id);
      }
    },
  }
};
</script>

<style lang="less" scoped>
  .search-wrapper {
    /deep/.el-form-item__content {
      width: 200px;
    }
    .btn-wrapper {
      padding: 0 30px;
    }
  }
  .el-dialog .el-form {
    padding: 0 12px;
  }
</style>