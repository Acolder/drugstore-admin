<template>
  <div id="userWrapper">
    <div class="search-werap">
      <el-form :inline="true" :model="searchData" size="small" ref="searchData">
        <el-form-item label="用户账号:"  style="margin-left:10px">
          <el-input v-model.trim="searchData.account" placeholder="请输入用户账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户昵称:">
          <el-input v-model.trim="searchData.nickName" placeholder="请输入用户昵称" clearable></el-input>
        </el-form-item>
        <el-form-item label="注册时间:" style="margin-right:15px">
          <el-input v-model="searchData.regisTime" placeholder="请输入注册时间" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="cleanSearch" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="Search" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.PageSize" :page-index="searchData.PageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      columns: this.getColumns(),
      searchData: {
        account: '',  //  账号
        nickName: '', // 昵称
        regisTime: '', // 注册时间
        mobile: '',  // 手机号
        PageIndex: 1,
        PageSize: 10
      },
      integralNum: '', // 积分测试数据
      isShow: false, // 积分测试数据
      userId: '' // 积分测试数据
    };
  },
  methods: {
    // 清除
    cleanSearch() {
      this.searchData.account = '';
      this.searchData.nickName = '';
      this.searchData.regisTime = '';
      this.getListData();
    },
    // 查询
    Search() {
      this.getListData();
    },
    customCompFunc(params) {
      if (params.type === 'details') { // 查看详情
        this.$router.push({
          path: '/userManage/userDetail',
          query: {
            id: params.rowData.userid,
          }
        });
      }
    },
    // 获取列表数据
    getListData() {
      let _self = this;
      let param = _self.searchData;
      ajax.post(`/api/userinfo/page`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.PageIndex - 1) * _self.searchData.PageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'mobile', title: '用户账号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'nickname', title: '用户昵称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'consumptionamount', title: '消费金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'orderquantity', title: '订单数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'consumptionavg', title: '订单均价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'lasttime', title: '最近消费时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '注册时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-details', isResize: true }
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
        if (item.field === 'consumptionamount') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<span style='color:#f00'>${value}</span>`;
            }
          };
        }
        if (item.field === 'orderquantity') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<span style='color:green'>${value}</span>`;
            }
          };
        }
        if (item.field === 'consumptionavg') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<span style='color:red'>${value.toFixed(3)}</span>`;
            }
          };
        }
      }
      return columns;
    },
    pageChange(pageIndex) {
      this.searchData.PageIndex = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageIndex = 1;
      this.searchData.PageSize = pageSize;
      this.getListData();
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
    this.getListData();
  }
};
</script>

<style lang="less" scoped>
.integral_num{
  text-align: center;
  margin: 40px 0px 80px 0px;
  input{
    padding-left: 6px;
    margin: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 26px;
    width: 200px;
  }
}
.dialog_bottom{
  text-align: center;
}
</style>
