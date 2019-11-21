<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="hosquery_form" label-width="100px">
        <el-form-item label="医院名称" prop="hosName">
          <el-input v-model="requestData.hosName" placeholder="医院名称"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <v-addressPicker ref="addresspicker"></v-addressPicker>
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
        <!-- <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button> -->
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
import addressPicker from '@/components/addressPicker/addressPicker';
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
        hosName: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
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
  components: {
    'v-addressPicker': addressPicker
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
        { field: 'hos_code', title: '医院ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'hos_name', title: '医院名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'level', title: '医院等级', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'is_hospital_mode', title: '医院模式', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        {
          field: 'longitude',
          title: '经度',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'latitude',
          title: '纬度',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'provincename',
          title: '地区',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            return rowData.provincename + rowData.cityname + rowData.areaname;
          }
        },
        { field: 'address_detail', title: '地址', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-hospitallist', isResize: true }
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
              return '<span style="color:green;">启用</span>';
            } else if (value === 2) {
              return '<span style="color:red;">禁用</span>';
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
        if (item.field === 'is_hospital_mode') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '是';
            } else if (value === 0) {
              return '否';
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
      let address = this.$refs['addresspicker'].getAddress();
      this.requestData.provinceCode = address.province;
      this.requestData.cityCode = address.city;
      this.requestData.areaCode = address.town;
      return this.requestData;
    },
    getDataList(query) {
      let _self = this;
      let request = this.getQueryParams();
      if (query) {
        request = query;
      }
      ajax.get(`/api/hospitalManage/getdochospitallist`, { params: request }).then((res) => {
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
      this.$refs['hosquery_form'].resetFields();
      this.$refs['addresspicker'].clear();
      this.seach();
    },
    pageChange(pageIndex) {
      let tab = this.visitedViews.find((x) => x.name === this.$route.name);
      if (tab.query) {
        tab.query.pageIndex = pageIndex;
      } else {
        tab.query = { pageIndex: pageIndex };
      }
      this.pageIndex = pageIndex;
      this.getDataList();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.seach();
    },
    // table operaion
    customCompFunc(params) {
      let hos = params.rowData;
      if (params.type === 'delete') { // do delete operation
        this.deleteHos(hos.id);
      } else if (params.type === 'details') { // do edit operation
        let _self = this;
        let hospitalId = params.rowData.id;
        _self.goEditPage(hospitalId);
      } else if (params.type === 'disable') {
        this.disable(hos);
      }
    },
    disable(row) {
      let title = '启用';
      let state = 1;
      if (String(row.state) === '1') {
        title = '禁用';
        state = 2;
      }
      this.$confirm('是否确定要' + title + '该医院？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/hospitalManage/updatedochospitalstatebyid';
        ajax.post(url, { hosId: row.id, state: state }).then((res) => {
          this.getDataList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + title
        });
      });
    },
    goEditPage(hospitalId) {
      let query = this.getQueryParams();
      query.hospitalId = hospitalId;
      let data = {
        name: 'eidtHospital',
        path: '/hospital/eidtHospital',
        meta: {
          title: '编辑医院'
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
        name: 'eidtHospital',
        path: '/hospital/eidtHospital',
        meta: {
          title: '新增医院'
        },
        query: query
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      this.$router.push({ path: data.path, query: query });
    },
    deleteHos(id) {
      this.$confirm('确定要删除该医院?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/hospitalManage/delDocHospitalbyhosId';
        let p = { 'hosId': id };
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
  mounted() {
    let query = this.$route.query || null;
    if (query) {
      this.pageIndex = query.pageIndex || 1;
    }
    this.getDataList(query);
  }
};

</script>
