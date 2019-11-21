<template>
  <div id="users">
    <div class="search-werap">
      <el-form :inline="true" :model="searchData" size="small" ref="searchData">
        <el-form-item label="角色名称:">
          <el-input v-model="searchData.roleName" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="searchData.remark" placeholder="请输入备注信息" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :page-index="searchData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  新增/编辑 弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="closeDialog" @open="openDialog" width="450px" :center="true" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false">
      <roleInfo ref="roleInfo" :isAdd="isAdd" @formSubmitSuccess="formSubmitSuccess"></roleInfo>
    </el-dialog>
    <!-- 设置权限 -->
    <el-dialog title="设置权限" :visible.sync="permissionDialgVisible" @close="permissionDialgClose" width="600px" center :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false">
      <el-tree ref="permissionTree" :props="permissionTreeProps" :data="permissionTreeData" show-checkbox node-key="menuId" :expand-on-click-node="false">
        <span slot-scope="{ node, data }">
          <span>{{data.title}}</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="permissionDialgVisible=false">取 消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="savePermission">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import java from '@/utils/javaApiRequest';
import roleInfo from './roleInfo';
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
        roleName: '',
        remark: '',
      },
      dialogTitle: '新增角色',
      dialogVisible: false,
      isAdd: true,
      roleData: null,
      permissionDialgVisible: false,
      permissionTreeProps: {
        label: 'title',
        children: 'child',
      },
      permissionTreeData: {},
      // 当前操作角色
      currentRole: null,
      currentRolePermission: [],
    };
  },
  components: {
    'roleInfo': roleInfo,
  },
  methods: {
    // 清除查询内容
    clean() {
      this.searchData.pageIndex = 1;
      this.searchData.roleName = '';
      this.searchData.remark = '';
      this.queryByNews();
    },
    // 刷新
    refresh() {
      this.clean();
    },
    // 查询,获取列表信息
    queryByNews() {
      this.searchData.pageIndex = 1;
      this.gettableData();
    },
    gettableData() {
      let _self = this;
      let param = _self.searchData;
      java.post(`/mall_manage/back/queryRoleList`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          // _self.searchData.pageIndex = 1;
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
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
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'roleId', title: '角色编号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'roleName', title: '角色名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 210, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-role', isResize: true }
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
    // 删除
    remove(id) {
      let _self = this;
      let param = { roleIds: id };
      java.post('/mall_manage/back/deleteRole', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
        _self.refresh();
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let roleidList = [];
          for (let item of this.selection) {
            roleidList.push(item.roleId);
          }
          let roidStr = roleidList.join(',');
          this.remove(roidStr);
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
    // 新增角色
    addRole() {
      this.dialogTitle = '新增角色';
      this.isAdd = true;
      this.dialogVisible = true;
    },
    editRole(data) {
      this.dialogTitle = '编辑角色';
      this.roleData = data;
      this.isAdd = false;
      this.dialogVisible = true;
    },
    setPermission(data) {
      this.currentRole = data;
      this.permissionDialgVisible = true;
      java.post('/mall_manage/back/queryRoleMenu', { roleId: data.roleId })
        .then((res) => {
          if (res.status === 200 && res.data.resultCode === '0') {
            let rolePermission = res.data.resultData;
            this.currentRolePermission = [];
            this.getCurrentRolePermission(rolePermission);
            this.currentRolePermission.forEach((item) => {
              this.$refs.permissionTree.setChecked(item, true);
            });
          }
        });
    },
    getCurrentRolePermission(data) {
      data.forEach((item) => {
        if (item.checked === true) {
          this.currentRolePermission.push(item.menuId);
        }
        if (item.child && item.child.length > 0) {
          this.getCurrentRolePermission(item.child);
        }
      });
    },
    savePermission() {
      let _self = this;
      let ids = _self.getPermissionSelectIds();
      if (ids) {
        let postData = {
          roleId: _self.currentRole.roleId,
          menuIds: ids
        };
        java.post('/mall_manage/back/updateRoleMenu', postData).then((res) => {
          if (res.status === 200 && res.data.resultCode === '0') {
            _self.$message({
              message: '提交成功',
              type: 'success'
            });
            _self.permissionDialgVisible = false;
          }
        }).catch(() => {
          _self.$message({
            message: '提交失败',
            type: 'error'
          });
        });
      } else {
        this.$message('请选择要设置的权限');
      }
    },
    permissionDialgClose() {
      this.currentRolePermission = [];
      let selectNodes = this.$refs.permissionTree.getCheckedNodes(false, true);
      selectNodes.forEach((item) => {
        this.$refs.permissionTree.setChecked(item, false);
      });
    },
    customCompFunc(params) {
      if (params.type === 'deleteRole') { // do delete operation
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.roleId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'modifyRole') {
        this.editRole(params.rowData);
      } else if (params.type === 'setPermission') {
        this.setPermission(params.rowData);
      }
    },
    openDialog() {
      let _self = this;
      if (_self.isAdd) {
        _self.$refs.roleInfo.setFormData();
      } else {
        setTimeout(function () {
          _self.$refs.roleInfo.setFormData(_self.roleData);
        }, 500);
      }
    },
    closeDialog() {
      this.$refs.roleInfo.resetForm();
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
    getPermissionData() {
      let url = `/mall_manage/back/queryMenuList`;
      let postData = {
        pageIndex: 0,
        pageSize: 500,
      };
      java.post(url, postData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let data = res.data.resultData;
          this.permissionTreeData = data;
        }
      });
    },
    getPermissionSelectIds() {
      let selectedNodes = this.$refs.permissionTree.getCheckedNodes(false, true);
      let ids = selectedNodes.map((item) => {
        return item.menuId;
      });
      return ids.join(',');
    },
  },
  created() {
    this.gettableData();
    this.getPermissionData();
  },
};
</script>
<style lang="less" scoped>
</style>
