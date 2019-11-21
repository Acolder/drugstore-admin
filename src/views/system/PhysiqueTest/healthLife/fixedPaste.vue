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
    <!-- <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
      </el-button-group>
    </div> -->
    <div class="table-wrapper">
      <v-table ref="data_table"  v-loading="loading" column-width-drag :is-vertical-resize="true" :is-horizontal-resize="true" style="width:100%"  :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- <div class="search-wrapper" style="text-align:center">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="Determine">确定</el-button>
    </div> -->
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
<script>
import ylajax from '@/utils/yilinAjax';
import { currency } from '@/utils/currency';
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      columns: this.getColumns(),
      tableData: [],
      searchInfo: {
        name: ''
      },
      selection: [],
      proudctNum: '',
      index: '',
      information: true,
    };
  },
  methods: {
    // 获取数据
    getFormData() {
      let fromData = {
        name: this.searchInfo.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      ylajax.get('/api/ordermanage/GetPasteFixedTemplateList', { params: fromData }).then((res) => {
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
      this.getFormData();
    },
    // 绑定数据
    getColumns() {
      let columns = [
        { field: 'id', title: '编号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '膏方名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'indication', title: '适宜人群', width: 250, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'retail_price', title: '零售价', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-salesmanList', isResize: true }
        { field: 'operation', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true }
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
        if (item.field === 'retail_price') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // 0 中药；1 西药；2 膏方；4 类型异常
            let value = rowData[field];
            if (value) {
              return currency(value, '¥', 2);
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 表格模板操作
    customCompFunc(params) {
      if (params.type === 'querySelect') { // do delete operation
        parent.window.selectGaoList(params.rowData);
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
      if (this.$route.query.name) {
        this.searchInfo.name = this.$route.query.name;
      }
      if (this.$route.query.pageIndex) {
        this.pageIndex = parseInt(this.$route.query.pageIndex, 10);
      }
      if (this.$route.query.pageSize) {
        this.pageSize = parseInt(this.$route.query.pageSize, 10);
      }
    },
    // cancel() {
    //   parent.window.setSelectedList(false);
    // },
    Determine() {
      parent.window.setSelectedData(this.selection, this.proudctNum, this.index, this.information, this.durgfrom);
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

