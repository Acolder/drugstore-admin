<template>
  <div id="userList">
    <div class="search-werap">
      <el-form :inline="true" :model="searchData" size="small" ref="searchData">
        <el-form-item label="用户名:">
          <el-input v-model.number="searchData.userName" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model.number="searchData.phone" placeholder="请输入电话号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮  箱:" class="email">
          <el-input v-model="searchData.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addUser">新增用户</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :page-index="searchData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--新增/编辑-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="closeDialog" @open="openDialog" width="450px" :center="true" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false">
      <userInfo ref="userInfo" :operation="operation" @formSubmitSuccess="formSubmitSuccess"></userInfo>
    </el-dialog>
    <!--设置角色-->
    <el-dialog title="设置角色" :visible.sync="rolesDialgVisible" @close="rolesDialogClose" width="800px" center :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false">
      <div class="rolesList">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllRoles" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="currentUserRoles" @change="handleCheckedChange">
          <el-checkbox v-for="role in roleList" :label="role.roleId" :key="role.roleId">{{role.roleName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="rolesDialgVisible=false">取 消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="saveRoles">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import java from '@/utils/javaApiRequest';
import userInfo from './userInfo';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      selection: [],
      columns: this.getColumns(),
      searchData: {
        pageIndex: 1,
        pageSize: 10,
        userId: '', //  用户id
        userName: '', // 用户名
        phone: '', // 电话
        headPortrait: '', //  头像
        email: '', // 邮箱
        // orderBy: 'asc'
      },
      dialogTitle: '新增用户',
      dialogVisible: false,
      userData: null,
      rolesDialgVisible: false,
      // 角色信息
      roleList: null,
      // 用户拥有的角色
      currentUserRoles: [],
      checkAllRoles: false,
      isIndeterminate: false,
      // 操作枚举 1:新增,2:编辑,3:修改密码
      operationEnum: { append: 1, edit: 2, changePassword: 3 },
      operation: 1,
    };
  },
  components: {
    'userInfo': userInfo,
  },
  methods: {
    // 查询
    queryByNews() {
      this.searchData.pageIndex = 1;
      this.gettableData();
    },
    // 获取列表数据
    gettableData() {
      let _self = this;
      let param = {};
      param = _self.searchData;
      java.post(`/mall_manage/back/queryUserList`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          // _self.searchData.pageIndex = 1;
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    // 清除查询
    clean() {
      this.searchData.pageIndex = 1;
      this.searchData.userName = '';
      this.searchData.phone = '';
      this.searchData.email = '';
      this.queryByNews();
    },
    // 查询
    query() {
      this.clean();
      this.queryByNews();
    },
    // 删除
    remove(id) {
      let _self = this;
      let param = { userIds: id };
      java.post('/mall_manage/back/deleteUser', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
        _self.queryByNews();
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '询问', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.userId);
          }
          let userIdList = idList.join(',');
          this.remove(userIdList);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$alert('请选择删除的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'userName', title: '用户名', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'phone', title: '手机号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'headPortrait', title: '头像', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'email', title: '邮箱', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-userManage', isResize: true }
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
        if (item.field === 'headPortrait') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(params) {
      if (params.type === 'deleteUser') {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.userId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'modifyUser') {
        this.editUser(params.rowData);
      } else if (params.type === 'changePassword') {
        this.changePassword(params.rowData);
      } else if (params.type === 'setRoles') {
        this.setRoles(params.rowData);
      }
    },
    // 新增用户
    addUser() {
      this.dialogTitle = '新增用户';
      this.operation = this.operationEnum.append;
      this.dialogVisible = true;
    },
    // 编辑用户
    editUser(data) {
      this.dialogTitle = '编辑用户';
      this.userData = data;
      this.operation = this.operationEnum.edit;
      this.dialogVisible = true;
    },
    // 修改密码
    changePassword(data) {
      this.dialogTitle = '修改密码';
      this.userData = data;
      this.operation = this.operationEnum.changePassword;
      this.dialogVisible = true;
    },
    // 设置角色
    setRoles(data) {
      let _self = this;
      _self.userData = data;
      _self.rolesDialgVisible = true;
      java.post('/mall_manage/back/queryUserRole', { userId: _self.userData.userId }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.currentUserRoles = [];
          let userRoles = res.data.resultData;
          userRoles.forEach((item) => {
            if (item.checked) {
              _self.currentUserRoles.push(item.roleId);
            }
          });
          // _self.currentUserRoles = userRoles.map((x) => {
          //   if (x.checked) {
          //     return x.roleId;
          //   } else {
          //     return null;
          //   }
          // });
        }
      });
    },
    saveRoles() {
      let _self = this;
      let roles = _self.currentUserRoles;
      // if (roles.length > 1) {
      //   this.$alert('目前只能设置一个角色哦~', '提示');
      //   return;
      // }
      let roleIds = roles.join(',');
      let postData = {
        userId: _self.userData.userId,
        roleIds: roleIds,
      };
      java.post('/mall_manage/back/updateUserRole', postData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: '提交成功',
            type: 'success',
          });
          _self.rolesDialgVisible = false;
        }
      }).catch(() => {
        _self.$message({
          message: '提交失败',
          type: 'error',
        });
      });
    },
    openDialog() {
      let _self = this;
      if (_self.operation === _self.operationEnum.edit || _self.operation === _self.operationEnum.changePassword) {
        setTimeout(function () {
          _self.$refs.userInfo.setFormData(_self.userData);
        }, 500);
      }
    },
    closeDialog() {
      this.$refs.userInfo.resetForm();
    },
    rolesDialogClose() {
      this.userData = null;
      this.currentUserRoles = [];
    },
    formSubmitSuccess() {
      this.dialogVisible = false;
      this.queryByNews();
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
    // 分页
    pageChange(pageIndex) {
      this.searchData.pageIndex = pageIndex;
      this.gettableData();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageIndex = 1;
      this.searchData.pageSize = pageSize;
      this.gettableData();
    },
    getRoleData() {
      let _self = this;
      let param = _self.searchData;
      java.post(`/mall_manage/back/queryRoleList`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.roleList = res.data.resultData.data;
        }
      });
    },
    handleCheckAllChange(value) {
      let currentUserRoles = value ? this.roleList : [];
      let idList = currentUserRoles.map((x) => {
        return x.roleId;
      });
      this.currentUserRoles = idList;
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAllRoles = checkedCount === this.roleList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length;
    }
  },
  created() {
    this.gettableData();
    this.getRoleData();
  }
};
</script>
<style lang="less" scoped>
.rolesList {
  /deep/.el-checkbox-group{
      label.el-checkbox{
        width:150px;
        margin-left: 0!important;
        margin-top: 15px;
      }
  }
}
</style>

