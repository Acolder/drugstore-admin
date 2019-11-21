<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form" label-width="100px">
        <el-form-item label="业务员编号" prop="salesId">
          <el-input v-model="requestData.salesId" placeholder="业务员编号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="salesName">
          <el-input v-model="requestData.salesName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="requestData.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="requestData.invitationCode" placeholder="邀请码"></el-input>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-select v-model="requestData.accountType" placeholder="请选择账号类型">
            <el-option label="招商业务员" :value="1"></el-option>
            <el-option label="业务员经理" :value="2"></el-option>
            <el-option label="推广业务员" :value="3"></el-option>
            <el-option label="机构业务员" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="requestData.department" placeholder="请选择所属部门">
            <el-option label="招商一部" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="default" icon="el-icon-delete">清空</el-button>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-download">导出</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="table_data" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'salesmanList',
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      requestData: {
        salesId: '', // 业务员编号
        salesName: '', // 业务员姓名
        username: '', // 用户名
        invitationCode: '', // 邀请码
        accountType: '', // 账号类型
        department: '' // 所属部门
      },
      tableData: [], // 表格数据
      columns: this.getColumns(), // 表格标题
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getColumns() {
      // 表格标题
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'salesId', title: '业务员编号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'salesName', title: '业务员姓名', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'username', title: '用户名', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'invitationCode', title: '邀请码', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'accountType', title: '账号类型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'department', title: '所属部门', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'superior', title: '所属上级', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'associatedDoctor', title: '关联医生数', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-salesmanList', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              console.log(value);
              return '已开启';
            }
          };
        }
      }
      return columns;
    },
    getTableData() {
      let _this = this;
      let item = {
        salesId: '1001',
        salesName: '张三',
        username: '13313313313',
        invitationCode: '1000',
        accountType: '招商业务员',
        department: '招商一部',
        superior: '王总',
        associatedDoctor: '手机账号: 1   |  邮箱账号: 0',
        status: 1
      };
      for (let i = 0; i < 20; i++) {
        _this.tableData.push(item);
        _this.total += 1;
      }
    },
    customCompFunc(params) {
      // 按钮事件
      if (params.type === 'edit') {
        this.$alert('修改中...');
      }
      if (params.type === 'delete') {
        this.$alert('删除中...');
      }
    },
    selectALL() {
      // 全选
    },
    selectChange() {
      // 触发某一项checkbox
    },
    selectGroupChange() {
      // 选中项发生变化
    },
    pageChange(pageIndex) {
      // 页码改变
      this.pageIndex = pageIndex;
    },
    pageSizeChange(pageSize) {
      // 每页条数改变
      this.pageIndex = 1;
      this.pageSize = pageSize;
    },
  }
};
</script>

<style lang="less" scoped>
  .search-wrapper {
    .btn-wrapper {
      padding: 0 30px;
    }
  }
</style>
