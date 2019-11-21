<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true"  size="small" label-width="100px" :model="searchInfo">
        <el-form-item label="膏方名称">
          <el-input  placeholder="膏方名称" v-model="searchInfo.name"  @keyup.enter.native="searchProduct"></el-input>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="primary" icon="el-icon-search" @click="searchProduct()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh"  @click="refresh()">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" v-loading="loading" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" ></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .search-wrapper {
    /deep/.el-form-item__content {
      width: 200px;
    }
    .btn-wrapper {
      padding: 0 30px;
    }
  }
</style>
<style lang="less">
  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
<script>
import ylajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      id: 0,
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      columns: this.getColumns(),
      // 表格数据
      tableData: [],
      searchInfo: {
        name: ''
      }
    };
  },
  methods: {
    // 新增
    add() {
      this.$router.push({
        path: '/orderManage/addClassicpasteList',
        query: {
          fid: this.$route.query.id,
          name: this.searchInfo.name,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      });
    },
    // 刷新
    refresh() {
      this.getFormData();
    },
    // 获取数据
    getFormData() {
      let fromData = {
        id: this.$route.query.id,
        name: this.searchInfo.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      ylajax.get('/api/ordermanage/GetPasteStandardList', { params: fromData }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data;
          this.pageSize = res.data.pagesize;
          this.pageIndex = res.data.pageindex;
          this.total = res.data.recordscount;
          this.loading = false;
        }
      });
    },
    // 查询数据
    searchProduct() {
      this.pageIndex = 1;
      this.getFormData();
    },
    // 表格数据
    getColumns() {
      let columns = [
        { field: 'id', title: '编号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '膏方名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'usage', title: '功用', width: 250, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'indication', title: '主治', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'table-standard-prescription', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-salesmanList', isResize: true }
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
    // 表格模板操作
    customCompFunc(params) {
      // 修改状态
      if (params.type === 'use') {
        if (params.rowData.status === 0) {
          this.$confirm('确定将状态改为禁用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let useData = {
              ID: params.rowData.id,
              status: 1
            };
            ylajax.get('/api/ordermanage/ChangePasteStandard', { params: useData }).then((res) => {
              if (res.status === 200 && res.data.code === 0) {
                this.$message({
                  message: '状态成功修改为禁用',
                  type: 'success'
                });
                this.getFormData();
              } else {
                this.$message.error('状态修改失败');
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        } else if (params.rowData.status === 1) {
          this.$confirm('确定将状态改为启用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let useData = {
              ID: params.rowData.id,
              status: 0
            };
            ylajax.get('/api/ordermanage/ChangePasteStandard', { params: useData }).then((res) => {
              if (res.status === 200 && res.data.code === 0) {
                this.$message({
                  message: '状态成功修改为启用',
                  type: 'success'
                });
                this.getFormData();
              } else {
                this.$message.error('状态修改失败');
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      }
      if (params.type === 'delete') {
        // 删除处方
        this.$confirm('确定删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let delData = {
            id: params.rowData.id
          };
          ylajax.get('/api/ordermanage/DelPasteStandardById', { params: delData }).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getFormData();
            } else {
              this.$message.error('删除失败');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      if (params.type === 'edit') {
        // 编辑处方
        this.$router.push({
          path: '/orderManage/editClassicpasteList',
          query: {
            id: params.rowData.id,
            fid: this.$route.query.id,
            name: this.searchInfo.name,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        });
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getFormData();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getFormData();
    },
    // 获取路径参数
    getRoute() {
      if (this.$route.query.id) {
        this.searchInfo.id = this.$route.query.id;
      }
      if (this.$route.query.name) {
        this.searchInfo.name = this.$route.query.name;
      }
      if (this.$route.query.pageIndex) {
        this.pageIndex = parseInt(this.$route.query.pageIndex, 10);
      }
      if (this.$route.query.pageSize) {
        this.pageSize = parseInt(this.$route.query.pageSize, 10);
      }
    }
  },
  created() {
    if (this.$route.query.from) {
      this.getRoute();
    }
    this.getFormData();
  }
};
</script>

