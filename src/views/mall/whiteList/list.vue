<template>
  <div id="hotSearch">
    <div class="search-wrapper">
      <el-form :inline="true" :model="listInfo"  size="small">
        <el-form-item label="手机号码">
          <el-input class="el-width1" v-model.trim="listInfo.Mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" size="small" icon="el-icon-delete" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="queryByOrder">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">新增白名单</el-button>
        <el-button type="primary" size="small" class="exportList" @click="exportList" style="margin-left:25px;">导出</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="listInfo.pageIndex" :page-size="listInfo.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 编辑白名单 -->
    <el-dialog title="编辑白名单" :visible.sync="modifyFormVisible" width="30%" center :modal-append-to-body="false" :append-to-body="true">
      <el-form :model="modifyData" ref="modifyForm" :rules="rules">
        <el-form-item label="用户ID" label-width="100px">
          <el-input v-model="modifyData.UserId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="Mobile">
          <el-input v-model.trim="modifyData.Mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryModify">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增白名单 -->
    <el-dialog title="新增白名单" :visible.sync="dialogFormVisible" width="70%" center :modal-append-to-body="false" :append-to-body="true">
      <div class="search-wrapper">
        <el-form :inline="true" :model="UserInfo"  size="small">
          <el-form-item label="手机号码">
            <el-input class="el-width1" v-model="UserInfo.Mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="default" size="small" icon="el-icon-delete" @click="empty2">清空</el-button>
            <el-button type="primary" icon="el-icon-search" size="small" @click="queryByOrder2">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-wrapper">
        <v-table ref="data_table2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
        row-click-color="#edf7ff" @on-custom-comp="customCompFunc2" :select-all="selectALL2" :select-change="selectChange2" :select-group-change="selectGroupChange2"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange2" @page-size-change="pageSizeChange2" :total="total2"  :page-index="UserInfo.pageIndex" :page-size="UserInfo.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from 'vue';
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      // 请求参数
      listInfo: {
        Mobile: '',
        pageIndex: 1,
        pageSize: 10
      },
      UserInfo: {
        Mobile: '',
        pageIndex: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      tableData2: [],
      // 选择的记录
      selection: [],
      selection2: [],
      // 总数
      total: 0,
      total2: 0,
      // 编辑弹出
      modifyFormVisible: false,
      modifyData: {
        UserId: '',
        Mobile: '',
      },
      // 数据验证
      rules: {
        Mobile: [{ required: true, message: '请输入账号', trigger: 'blur' }]
      },
      // 弹出层
      dialogFormVisible: false,
      addData: {
      },
      sidebarValue: this.sidebarStatus,
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
      this.$refs['data_table2'].resize();
    }
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.listInfo.pageIndex - 1) * _self.listInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'userid', title: 'userid', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '电话', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-whiteList', isResize: true }
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
      }
      return columns;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.UserInfo.pageIndex - 1) * _self.UserInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'userid', title: 'userid', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '电话', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-addWhiteList', isResize: true }
      ];
      for (let i = 0; i < columns2.length; i++) {
        let item = columns2[i];
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
      }
      return columns2;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 清空
    empty() {
      this.listInfo.pageIndex = 1;
      this.listInfo.pageSize = 10;
      this.listInfo.Mobile = '';
      this.getTableData();
    },
    empty2() {
      this.UserInfo.Mobile = '';
      this.UserInfo.pageIndex = 1;
      this.UserInfo.pageSize = 10;
      this.getUserTableData();
    },
    // 查询
    queryByOrder() {
      this.getTableData();
    },
    queryByOrder2() {
      this.getUserTableData();
    },
    // 导出
    exportList() {
      window.open(`${process.env.BASE_HOST}/api/admin/ExportUserWhite?mobile=""&pageIndex=` + this.listInfo.pageIndex + '&pageSize=' + this.listInfo.pageSize);
    },
    // 编辑
    queryModify() {
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/admin/UpdateUserWhite', this.modifyData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.modifyFormVisible = false;
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 添加
    add() {
      this.dialogFormVisible = true;
      this.getUserTableData();
    },
    queryAdd(params) {
      ajax.post('/api/admin/AddUserWhite', { UserId: params.userid, Mobile: params.mobile }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'info',
            message: res.data.message
          });
          this.dialogFormVisible = false;
          this.getTableData();
          this.getUserTableData();
        }
      });
    },
    // 删除
    removeTableData(params) {
      ajax.post('/api/admin/DeleteUserWhite', { UserId: params.userid, Mobile: params.mobile }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'info',
            message: res.data.message
          });
          this.getTableData();
        }
      });
    },
    // 自定义组件删改操作modifyRow
    customCompFunc(params) {
      // 编辑操作
      if (params.type === 'modifyRow') { // do edit operation
        this.modifyData.UserId = params.rowData.userid;
        this.modifyData.Mobile = params.rowData.mobile;
        this.modifyFormVisible = true;
      }
      // 删除操作
      if (params.type === 'deleteRow') { // do edit operation
        this.$confirm('是否删除该账号线下转账权限？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeTableData(params.rowData);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    customCompFunc2(params) {
      // 删除操作
      if (params.type === 'addWhite') { // do edit operation
        this.$confirm('此操作将添加至白名单列表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.queryAdd(params.rowData);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 获取查询白名单列表
    getTableData() {
      let _self = this;
      ajax.post('/api/admin/GetUserWhiteList', _self.listInfo).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          this.tableData = res.data.data;
        }
      });
    },
    // 获取查询用户列表
    getUserTableData() {
      let _self = this;
      ajax.post('/api/admin/GetUserList', _self.UserInfo).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.total2 = res.data.recordscount;
          this.tableData2 = res.data.data;
        }
      });
    },
    // 全选反选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    selectALL2(selection) {
      this.selection2 = selection;
    },
    selectChange2(selection, rowData) {
      this.selection2 = selection;
    },
    selectGroupChange2(selection) {
      this.selection2 = selection;
    },
    // 分页
    pageChange(pageIndex) {
      this.listInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.listInfo.pageSize = pageSize;
      this.getTableData();
    },
    pageChange2(pageIndex) {
      this.UserInfo.pageIndex = pageIndex;
      this.getUserTableData();
    },
    pageSizeChange2(pageSize) {
      this.UserInfo.pageSize = pageSize;
      this.getUserTableData();
    },
  },
  created() {
    // 请求反馈列表数据
    this.getTableData();
    this.getUserTableData();
  }
};
</script>

<style>
.el-button.el-button--text span{
  color: #333;
}
table{ border-collapse:collapse;}
</style>
