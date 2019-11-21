<template>
  <div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="getDataList">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="sizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
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
<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      columns: this.getColumns(),
      selection: [],
      requestData: {
        hosname: '',
        orderByDate: 'desc',
        pageIndex: 1,
        pageSize: 10
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
    pageChange(pi) {
      console.log(pi);
      this.pageIndex = pi;
      let tab = this.visitedViews.find((x) => x.name === this.$route.name);
      if (tab.query) {
        tab.query.pageIndex = pi;
      } else {
        tab.query = { pageIndex: pi };
      }
      this.seach();
    },
    sizeChange(pz) {
      this.pageIndex = 1;
      this.pageSize = pz;
      this.seach();
    },
    getColumns() {
      let _this = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_this.pageIndex - 1) * _this.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'departcode', title: 'ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'departname', title: '科室名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-drug', isResize: true }
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
        if (item.field === 'state') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '<span style="color:green;">正常</span>';
            } else if (value === 2) {
              return '<span style="color:red;">屏蔽</span>';
            } else {
              return '-';
            }
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
    getDataList(query) {
      let url = '/api/hospitalManage/getdocdepartlist';
      let _self = this;
      let request = query || this.getQueryParams();
      ajax.get(url, { params: request }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    seach() {
      this.getDataList();
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      this.seach();
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.singleDelete(params.rowData.departid);
      } else if (params.type === 'edit') { // do edit operation
        let _self = this;
        _self.goEditPage(params.rowData);
      }
    },
    goEditPage(row) {
      let query = this.getQueryParams();
      let data = {
        name: 'departmentEdit',
        path: '/hospital/departmentEdit',
        meta: {
          title: '编辑科室'
        }
      };
      this.$router.push({
        name: data.name,
        params: row,
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
    // 审核药品
    checkedDrug(productId) {
      let _self = this;
      let postData = {
        productId: productId,
        isChecked: 1
      };
      postData[_self.from] = 'all';
      ajax.post('/mall_manage/back/product/updateProductCheckStatusById', postData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          });
          _self.getDataList();
        }
      });

    },
    // 新增
    add() {
      let query = this.getQueryParams();
      let data = {
        name: 'departmentEdit',
        path: '/hospital/departmentEdit',
        meta: {
          title: '新增科室'
        }
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      this.$router.push({
        path: data.path,
        query: query
      });
    },
    singleDelete(id) {
      let p = {};
      let url = '/api/hospitalManage/deldocdepartbydepartid';
      p = { 'departid': id };
      this.$confirm('确定要删除该科室?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(url, p).then((res) => {
          if (res.data && res.data.code === 0) {
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
      let idList = [];
      let p = {};
      let url = '/api/hospitalManage/delbatchdocdepartbydepartid';
      if (this.selection.length > 0) {
        for (let item of this.selection) {
          idList.push(item.departid);
        }
        p = { 'str': idList.join(',') };
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的科室'
        });
        return;
      }
      this.$confirm('确定要删除选定的科室?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(url, p).then((res) => {
          if (res.data && res.data.code === 0) {
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
  },
  mounted() {
    window.previewImg = this.previewImg;
    let query = this.$route.query || {};
    if (query.from) {
      this.pageIndex = parseInt(query.pageNum, 10);
      this.pageSize = parseInt(query.pageSize, 10);
    }
    this.pageIndex = query.pagingIndex || 1;
    this.getDataList(query);
  }
};

</script>
