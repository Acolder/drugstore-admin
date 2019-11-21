<template>
  <div class="category">
    <div class="search-wrapper">
      <el-form :inline="true" :model="search" size="small" >
        <el-form-item label="分类名称：">
          <el-input v-model="search.CategoryName" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="getTableData" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addcategory">新增分类</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="search.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 新增修改分类 -->
    <el-dialog :title="categoryTitle" :visible.sync="categoryShow" :modal-append-to-body="false" width="450px" center @close="closeCategory">
      <el-form ref="categoryfrom" :model="categoryData" size="small" :inline="true" style="padding-left:60px" :rules="rules">
        <el-form-item label="分类名称：" prop="categoryname">
          <el-input v-model="categoryData.categoryname" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类排序：" prop="sort">
          <el-input v-model.number="categoryData.sort" placeholder="请输入分类排序" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否显示：" prop="isshow">
          <el-select v-model="categoryData.isshow" placeholder="请选择" clearable >
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left:70px;">
          <el-button type="default" @click="categoryShow = false">取消</el-button>
          <el-button type="primary" @click="addQuery" v-if="categorySubtile === '确认新增'">确认新增</el-button>
          <el-button type="primary" @click="editQuery" v-if="categorySubtile === '确认修改'">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="分类详情" :visible.sync="detailShow" :modal-append-to-body="false" width="650px" center @close="closedetail">
      <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">分类id：</el-col>
          <el-col :span="18">{{detailData.id}}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="10" style="text-align:right">分类名称：</el-col>
          <el-col :span="14">{{detailData.categoryname}}</el-col>
        </el-col>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">分类排序：</el-col>
          <el-col :span="18">{{detailData.sort}}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="10" style="text-align:right">是否显示：</el-col>
          <el-col :span="14">{{detailData.isshow}}</el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { formatDate } from '@/utils/date';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      search: {
        PageIndex: 1,
        PageSize: 10,
        CategoryName: ''
      },
      tableData: [],
      columns: this.Columns(),
      total: 0,
      selection: [],
      categoryShow: false,
      categoryData: {
        categoryname: '',
        sort: '',
        isshow: ''
      },
      categoryTitle: '',
      categorySubtile: '',
      detailShow: false,
      detailData: {},
      rules: {
        categoryname: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '请输入分类排序', trigger: 'blur' },
          { type: 'number', message: '排序必须为数字值' }
        ],
        isshow: [
          { required: true, message: '请选择是否显示', trigger: 'change' },
        ]
      },
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 清除
    clean() {
      this.query();
    },
    Columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.search.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'categoryname', title: '分类名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '展示排序', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isshow', title: '是否显示', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'adverIndex', isResize: true }
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
        if (item.field === 'isshow') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === true) {
              return '<span style="color:green;">是</span>';
            } else {
              return '<span style="color:red;">否</span>';
            }
          };
        }
      }
      return columns;
    },
    // 新增
    addcategory() {
      this.categoryShow = true;
      this.categoryTitle = '新增分类';
      this.categorySubtile = '确认新增';
    },
    addQuery() {
      let _self = this;
      this.categoryShow = false;
      _self.$refs['categoryfrom'].validate((valid) => {
        if (valid) {
          ajax.post('/api/news/saveNewsCategory', _self.categoryData).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗
    closeCategory() {
      this.categoryData = {};
      this.$refs['categoryfrom'].clearValidate();
    },
    closedetail() {
      this.detailData = '';
    },
    // 修改
    editQuery() {
      let _self = this;
      _self.$refs['categoryfrom'].validate((valid) => {
        if (valid) {
          this.categoryShow = false;
          ajax.post('/api/news/saveNewsCategory', _self.categoryData).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });

    },
    delete(id) {
      let _self = this;
      ajax.post('/api/news/deleteNewsCategory', id).then(res => {
        this.categoryShow = false;
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          this.getTableData();
        }
      });
    },
    // 批量删除
    batchDelete() {
      let ids = this.selection.map(res => {
        return res.id;
      });
      this.delete(ids);
    },
    // 刷新
    query() {
      this.search = {
        PageIndex: 1,
        PageSize: 10,
        CategoryName: ''
      };
      this.getTableData();
    },
    // 获取分类列表
    getTableData() {
      let _self = this;
      ajax.post('/api/news/GetNewsCategoryListByPage', _self.search).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    customCompFunc(params) {
      if (params.type === 'deleta') { // do delete operation
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete([params.rowData.id]);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation 修改
        let data = {};
        /* eslint-disable */
      for (let key in params.rowData) {
        data[key] = params.rowData[key];
      }
        this.categoryData = data;
        this.categoryShow = true;
        this.categoryTitle = '修改分类';
        this.categorySubtile = '确认修改';
      } else if (params.type === 'detail') { // 查看详情
        this.detailShow = true;
        this.detailData = params.rowData;
      }
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
    pageChange(pageIndex) {
      this.search.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.search.PageIndex = 1;
      this.search.pageSize = pageSize;
      this.getTableData();
    },
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>

</style>
