<template>
  <div class="applayUser">
    <!-- 标题 -->
    <div class="title">
      <h2>开放平台申请管理</h2>
    </div>
    <!-- 表格内容 -->
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :multiple-sort="false" mul :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="userList" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页器 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="userForm.total" :page-size="userForm.pageSize" :page-index="userForm.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <el-dialog title="请输入备注" :center="true" :visible.sync="dialogVisible" width="30%" :modal-append-to-body="false" >
      <textarea class="remarkArea" v-model="remark" @keyup="remarkBtn" ></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="isUsable" @click="conform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/bianquAjax';

export default {
  data() {
    return {
      userForm: {  // 申请用户列表查询条件
        pageIndex: 1,
        pageSize: 10
      },
      userList: [], // 申请用户列表数据,
      id: '',
      remark: '', // 备注
      isUsable: true,
      dialogVisible: false,
    };
  },
  watch: {
    'remark': function (newVal, oldVal) {
    },
  },
  mounted() {
    this.getDataList();
  },
  computed: {
    // 申请用户数据展示
    columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 15, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.userForm.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'account_name', title: '用户账号', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'apply_time', title: '申请时间', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'company_name', title: '企业名称', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'company_header', title: '对接人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'company_mobile', title: '对接电话', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '审核状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-applayUserManage', isResize: true }
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
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '正常';
            } else if (value === 1) {
              return '审核通过';
            } else if (value === -1) {
              return '审核不通过';
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
    // 获取申请用户列表数据
    getDataList() {
      ajax.post('/api/user/GetUserInfoListInfo', this.userForm).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.userList = res.data.data;
          this.userForm.total = res.data.recordscount;
        }
        else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      });
    },
    // 分页索引选择
    pageChange(pageIndex) {
      this.userForm.pageIndex = pageIndex;
      this.getDataList();
    },
    // 分页数量选择
    pageSizeChange(pageSize) {
      this.userForm.pageIndex = 1;
      this.userForm.pageSize = pageSize;
      this.getDataList();
    },
    // 添加备注
    addRemarks(id) {
      this.dialogVisible = true;
      this.id = id;
    },
    remarkBtn() {
      if (this.remark) {
        this.isUsable = false;
      } else {
        this.isUsable = true;
      }
    },
    // 确定添加备注
    conform() {
      this.dialogVisible = false;
      ajax.get('/api/user/UpdateUserInfoRemarkByid?id=' + this.id + '&remark=' + this.remark).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.message
          });
        }
        else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
        this.getDataList();
      });
    },
    // 审核通过
    checkPass(id) {
      let status = 1;
      ajax.get('/api/user/ApproveUserInfoByid?id=' + id + '&status=' + status).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.message
          });
        }
        else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
        this.getDataList();
      });
    },
    // 审核不通过
    checkReject(id) {
      let status = -1;
      ajax.get('/api/user/ApproveUserInfoByid?id=' + id + '&status=' + status).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.message
          });
        }
        else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
        this.getDataList();
      });
    },
    // 操作
    customCompFunc(params) {
      // 对比
      if (params.type === 'addRemarks') { // 添加备注
        let id = params.rowData.id;
        this.remark = params.rowData.remark;
        this.addRemarks(id);
      } else if (params.type === 'checkPass') { // 审核通过
        this.$confirm('此操作将使 “' + params.rowData.account_name + '” 用户审核通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = params.rowData.id;
          this.checkPass(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else if (params.type === 'checkReject') { // 审核不通过
        this.$confirm('此操作将使 “' + params.rowData.account_name + '” 用户审核不通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = params.rowData.id;
          this.checkReject(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
  }
};
</script>

<style lang="less" scoped>
h2{
  font-weight: normal;
}
.title{
  margin: 20px 0px 40px 20px;
}
.remarkArea{
  width: 100%;
  height: 150px;
  border: 2px solid #bbb;
  border-radius: 5px;
  padding: 10px 10px;
}
</style>