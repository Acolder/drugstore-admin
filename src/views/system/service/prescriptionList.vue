<template>
  <div id="raredrug-list">
    <div class="search-wrapper">
      <el-form :inline="true" :model="raredrugData" size="small">
        <el-form-item label="处方药名称：">
          <el-input v-model="raredrugData.screenInfo.name" placeholder="处方药名称" clearable ></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="raredrugData.screenInfo.mobile" placeholder="手机号" type="number"  clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByOrder" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" @click="Delete" icon="el-icon-delete">批量删除</el-button>
        <el-button type="default" size="small" @click="Export">全部导出</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="raredrugData.screenInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      raredrugData: {
        screenInfo: {
          name: '',
          mobile: '',
          pageIndex: 1,
          pageSize: 10
        }
      },
      tableData: [],
      selection: [],
      total: 0
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.raredrugData.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'prescriptionpid', title: '处方要货号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'prescriptionname', title: '药品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createdtime', title: '时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-one', isResize: true }
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
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 点击查询
    queryByOrder() {
      this.getTableData();
    },
    // 清除
    clean() {
      this.raredrugData.screenInfo.name = '';
      this.raredrugData.screenInfo.mobile = '';
      this.getTableData();
    },
    // 删改操作
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            Ids: [params.rowData.id]
          };
          this.removeTableData(obj);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation
        this.$confirm('此操作将该订单更新为已读, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updataRead({ Ids: [params.rowData.id] });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更新'
          });
        });
      }
    },
    // 获取列表数据
    getTableData() {
      let _self = this;
      ajax.get('/api/admin/getpresuggestlist', {
        params: _self.raredrugData.screenInfo
      }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    // 删除列表数据
    removeTableData(idList) {
      let _self = this;
      ajax.post('/api/admin/deletepresuggest', idList).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        _self.getTableData();
      });
    },
    // 更新为已读
    updataRead(idList) {
      let _self = this;
      ajax.post('/api/admin/updatepresuggestreply', idList).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        _self.getTableData();
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
    // 批量删除
    Delete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            Ids: []
          };
          for (let item of this.selection) {
            obj.Ids.push(item.id);
          }
          this.removeTableData(obj);
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
    // 批量导出
    Export() {
      window.open(`${process.env.BASE_HOST}/api/admin/exportpresuggest?pageSize=` + this.total);
    },
    // 分页
    pageChange(pageIndex) {
      this.raredrugData.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.raredrugData.screenInfo.pageSize = pageSize;
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>

</style>
