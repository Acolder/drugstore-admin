<template>
  <div id="userList">
    <!-- 查询条件 -->
    <div class="search-wrapper">
      <!--
      <el-form :inline="true" :model="requestData" size="medium">
        <el-form-item label="账号">
          <el-input v-model="requestData.MethodName" placeholder="请输入操作员编号"></el-input>
        </el-form-item>
        <el-form-item label="操作员">
          <el-input v-model="requestData.Path" placeholder="请输入操作员用户名"></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-select v-model="valueTime" clearable placeholder="请选择时间段">
           <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      -->
    </div>
    <!-- 操作功能 -->
    <div class="toolbar-wrapper">
        <el-button  size="mini" @click="Delete">删除</el-button>
        <div class="rightBtn">
          <el-button type="info" size="small" @click="clean">清空</el-button>
          <el-button type="primary" size="small"  @click="query">查询</el-button>
        </div>
    </div>
    <!-- 操作日志内容 -->
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <!-- 分页器 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :page-index="searchData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
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
    query() {
      this.searchData.pageIndex = 1;
      this.gettableData();
    },
    // 清空操作日志
    clean() {
      console.log('清空日志');
    },
    // 删除日志
    Delete() {
      console.log('删除日志');
    },
    // 获取操作日志列表数据
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
    /*
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
    */
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 2, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'userName', title: '账号', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'phone', title: '用户名', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'headPortrait', title: '角色名称', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'email', title: 'IP地址', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作记录', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作时间', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true }
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
  }
};
</script>
<style lang="less" scoped>
.rightBtn{
  float: right;
  margin-right: 25px;
}
</style>

