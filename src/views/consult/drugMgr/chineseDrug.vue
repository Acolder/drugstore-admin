<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="chinesedrug_query_form" label-width="100px">
        <el-form-item label="药品名称" prop="drugName">
          <el-input v-model.trim="requestData.drugName" placeholder="药品名称"></el-input>
        </el-form-item>
        <el-form-item label="药品编号" prop="goodsNum">
          <el-input v-model.trim="requestData.goodsNum" placeholder="药品编号"></el-input>
        </el-form-item>
        <el-form-item label="代码" prop="pyCode">
          <el-input v-model.trim="requestData.pyCode" placeholder="代码"></el-input>
        </el-form-item>
        <el-form-item label="编辑日期">
          <el-date-picker v-model="requestData.startUpdateTime" align="right" type="date">
          </el-date-picker>
          -
          <el-date-picker v-model="requestData.endUpdateTime" align="right" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="seach" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="seach">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>
.search-wrapper {
  .btn-wrapper {
    padding: 0 30px;
  }
}

</style>
<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      requestData: {
        drugName: '',
        goodsNum: '',
        pyCode: '',
        startUpdateTime: '',
        endUpdateTime: ''
      }
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ])
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'goodsnum', title: '商品编号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'drugname', title: '药品名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'pycode', title: '代码', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'unit', title: '单位', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'unitprice', title: '价格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'updatetime', title: '编辑日期', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-drugmgr', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'status') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green;">已启用</span>';
            } else if (value === 1) {
              return '<span style="color:red;">已禁用</span>';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'provincename') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            return rowData.provincename + rowData.cityname + rowData.areaname;
          };
        }
      }
      return columns;
    },
    getQueryParams: function() {
      this.requestData.pageIndex = this.pageIndex;
      this.requestData.pageSize = this.pageSize;
      return this.requestData;
    },
    getDataList() {
      let _self = this;
      let request = this.getQueryParams();
      ajax.get(`/api/ordermanage/getchinesedocherbslist`, { params: request }).then((res) => {
        if (res && res.status === 200 && res.data && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
        }
      });
    },
    seach() {
      this.pageIndex = 1;
      this.getDataList();
    },
    resetForm() {
      this.$refs['chinesedrug_query_form'].resetFields();
      this.requestData.endUpdateTime = '';
      this.requestData.startUpdateTime = '';
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getDataList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getDataList();
    },
    // table operaion
    customCompFunc(params) {
      let drug = params.rowData;
      if (params.type === 'delete') { // do delete operation
        this.deleteDrug(drug.id);
      } else if (params.type === 'details') { // do edit operation
        let _self = this;
        let drugId = params.rowData.id;
        _self.goEditPage(drugId);
      } else if (params.type === 'disable') {
        this.disable(drug);
      }
    },
    disable(row) {
      let title = '启用';
      let status = 0;
      if (String(row.status) === '0') {
        title = '禁用';
        status = 1;
      }
      this.$confirm('是否确定要' + title + '该中药？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/ordermanage/updatedocherbsstatus';
        ajax.post(url, { ID: row.id, Status: status }).then((res) => {
          this.getDataList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + title
        });
      });
    },
    goEditPage(drugId) {
      let query = this.getQueryParams();
      query.drugId = drugId;
      let data = {
        name: 'editchinesedrug',
        path: '/orderManage/editchinesedrug',
        meta: {
          title: '编辑中药'
        },
        query: query
      };
      this.$router.push({
        path: data.path,
        query: query
      });
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
    // 新增
    add() {
      let query = this.getQueryParams();
      let data = {
        name: 'editchinesedrug',
        path: '/orderManage/editchinesedrug',
        meta: {
          title: '新增中药'
        },
        query: query
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      this.$router.push({ path: data.path, query: query });
    },
    deleteDrug(id) {
      this.$confirm('确定要删除该中药?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/ordermanage/delwesterndocherbs';
        let p = { 'Id': id };
        ajax.post(url, p).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.seach();
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        let idList = [];
        for (let item of this.selection) {
          idList.push(item.productId);
        }
        alert('delete:' + idList.join(','));
      }
    },
  },
  created() {
    this.getDataList();
  }
};

</script>
