<template>
  <div class="RP_seller_list">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" ref="query_form">
        <el-form-item label="药店名称" prop="sellerName">
          <el-input v-model="searchInfo.sellerName" placeholder="名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="name">
          <el-select v-model="searchInfo.status" placeholder="请选择">
            <el-option v-for="item in statusArray" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="name">
          <el-select v-model="searchInfo.province" placeholder="请选择">
              <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <el-select v-model="searchInfo.city" placeholder="请选择">
              <el-option v-for="(item, index) in cityOptions" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="defult" @click="clear">清除</el-button>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="small" @click="batchEnasdis">批量禁用</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table"
        :is-loading="isLoding"
        column-width-drag
        is-horizontal-resize
        style="width:100%"
        :columns="columns"
        :table-data="tableData"
        row-hover-color="#eee"
        row-click-color="#edf7ff"
        @on-custom-comp="customCompFunc"
        :select-all="selectALL"
        :select-change="selectChange"
        :select-group-change="selectGroupChange">
      </v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
        :total="total"
        :page-size="pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { city } from '@/utils/city';
export default {
  data() {
    return {
      searchInfo: {
        sellerName: '',
        status: '',
        province: '',
        city: '',
        area: ''
      },
      pageIndex: 1,
      pageSize: 10,
      statusArray: [
        { value: '待审核', key: '0' },
        { value: '审核通过', key: '1' },
        { value: '审核不通过', key: '2' },
        { value: '审核中', key: '3' },
        { value: '已失效', key: '-1' },
      ],
      isLoding: false,
      tableData: [], // 表格数据源
      total: 0,
      selection: [],
      provinceOptions: city(),
      cityOptions: []
    };
  },
  watch: {
    'searchInfo.province': function() {
      if (this.searchInfo.province) {
        this.cityOptions = this.provinceOptions.find(x => x.name === this.searchInfo.province).city;
        this.searchInfo.city = '';
      }
    },
  },
  computed: {
    columns: function() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * _self.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'enterprise_type', title: '药店类型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'enterprise_name', title: '药店名称', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'enterprise_detail_address', title: '药店地址', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'enterprise_regis_phone', title: '注册手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'enterprise_status', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-RPseller', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i <= 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'enterprise_type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '连锁药店';
            } else {
              return '单体药店';
            }
          };
        }
        if (item.field === 'enterprise_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:#d98600">待审核</span>';
            } else if (value === 1) {
              return '<span style="color:green">审核通过</span>';
            } else if (value === 2) {
              return '<span style="color:red">审核不通过</span>';
            } else if (value === -1) {
              return '<span style="color:red">已失效</span>';
            } else if (value === 3) {
              return '<span style="color:#d98600">审核中</span>';
            }
          };
        }
      }
      return columns;
    }
  },
  methods: {
    customCompFunc(param) {
      console.log(param);
      if (param.type === 'see') {
        if (param.rowData.enterprise_status === 0) {
          // this.examine(3, '');
          let obj = {
            id: param.rowData.id,
            status: 3,
            check_fail: 'fail'
          };
          ajax.get('/api/Pharmacy/ApprovePharmacySystemInfoByid', { params: obj }).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$router.push('/RPseller/detail?id=' + param.rowData.id);
            }
          });
        } else {
          this.$router.push('/RPseller/detail?id=' + param.rowData.id);
        }
      } else if (param.type === 'enable') { // 启用
        this.$confirm('此操作将启用该药店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let ids = [param.rowData.id];
          let obj = {
            id: param.rowData.id,
            status: 0,
            check_fail: ''
          };
          ajax.get('/api/Pharmacy/ApprovePharmacySystemInfoByid', { params: obj }).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$message.success(res.data.message);
              this.getTableData();
            }
          });
        });
      } else if (param.type === 'disables') { // 禁用
        this.$confirm('此操作将禁用该药店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [param.rowData.id];
          this.enasdis(ids);
        });
      }
    },
    // 禁用
    enasdis(ids) {
      let param = {
        id: ids.join(',')
      };
      ajax.get('/api/Pharmacy/UpdatePharmacySystemStatusByid', { params: param }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.$message.success(res.data.message);
          this.getTableData();
        }
      });
    },
    add() {
      // 新增
      this.$router.push('/RPseller/detail');
    },
    // 批量禁用
    batchEnasdis() {
      // ll
      if (this.selection.length === 0) {
        this.$message.warning('请选择需要禁用的药店');
        return;
      }
      let ids = this.selection.map(item => {
        return item.id;
      });
      this.enasdis(ids);
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
    // 分页
    pageChange(index) {
      this.pageIndex = index;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    // 查询
    query() {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    clear() {
      this.searchInfo = {
        sellerName: '',
        status: '',
        province: '',
        city: '',
        area: ''
      };
      this.query();
    },
    // 获取数据
    getTableData() {
      let param = {
        enterprise_name: this.searchInfo.sellerName,

        enterprise_status: this.searchInfo.status,

        enterprise_province: this.searchInfo.province,

        enterprise_city: this.searchInfo.city,

        enterprise_area: this.searchInfo.area,

        PageIndex: this.pageIndex,

        PageSize: this.pageSize
      };
      this.isLoding = true;
      ajax.post(`/api/Pharmacy/GetPharmacySystemInfo`, param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.isLoding = false;
          this.tableData = res.data.data;
          // this.tableData.map(item => {
          //   if (item.enterprise_status !== 1) {
          //     this.$set(item, '_disabled', true);
          //   }
          //   return item;
          // });
          console.log(this.tableData);
          this.total = res.data.recordscount;
        }
      });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>

</style>
