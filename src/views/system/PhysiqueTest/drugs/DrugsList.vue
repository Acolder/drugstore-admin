<template>
  <div id="wrapper">
    <div class="search-werap">
      <el-form :inline="true" :model="searchData" size="small" ref="searchData">
        <el-form-item label="体质" class="newsId" >
          <el-select v-model="searchData.categoryName" placeholder="请选择" clearable>
            <el-option v-for="item in options" :key="item.categoryName" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" class="newsId" style="margin: 0 20px 0 10px">
          <el-input v-model.trim="searchData.name" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="cleanSearch" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryData" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pagesize" :page-index="searchData.pageindex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      tableData: [],
      selection: [],
      total: 0,
      searchData: {
        pageindex: 1,
        pagesize: 10,
        name: '',
        categoryName: ''
      },
      options: [
        { value: '', label: '全部' },
        { value: '阳虚质', label: '阳虚质' },
        { value: '气虚质', label: '气虚质' },
        { value: '平和质', label: '平和质' },
        { value: '阴虚质', label: '阴虚质' },
        { value: '痰湿质', label: '痰湿质' },
        { value: '湿热质', label: '湿热质' },
        { value: '血瘀质', label: '血瘀质' },
        { value: '气郁质', label: '气郁质' },
        { value: '特禀质', label: '特禀质' }
      ],
      columns: this.getColumns(),
    };
  },
  methods: {
    // 清空搜索
    cleanSearch() {
      this.searchData.name = '';
      this.searchData.categoryName = '';
      this.queryData();
    },
    // 查询
    queryData() {
      let _self = this;
      let param = _self.searchData;
      ajax.get(`/api/admin/GetDocRelatedDrugsList`, { params: param }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    // 更新
    refresh() {
      this.searchData.categoryName = '';
      this.queryData();
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageindex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'commodityname', title: '名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'commodityimage', title: '图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'commoditymaincategory', title: '体质', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'commoditystate', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 210, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-physique', isResize: true }
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
        if (item.field === 'commodityimage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let pic =  value.split(',');
              return `<a href="javascript:previewImg('${pic[0]}');"><img src="${pic[0]}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'commoditystate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              let up = '上架';
              return '<span style="color: green;">' + up + '</span>';
            } else if (value === 2) {
              let down = '下架';
              return '<span style="color: red;">' + down + '</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 添加商品
    add() {
      this.$router.push('/PhysiqueTest/drugs/addDrugs');
    },
    customCompFunc(params) {
      let _self = this;
      let data = {
        id: params.rowData.id,
        state: ''
      };
      if (params.type === 'delete') { // do delete operation
        _self.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.remove(params.rowData.id);
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑修改
        _self.$router.push({
          path: '/PhysiqueTest/drugs/EditDrugs',
          query: {
            id: params.rowData.id,
            pageindex: _self.searchData.pageindex,
            categoryName: _self.searchData.categoryName
          }
        });
      } else if (params.type === 'up') { // 上架
        data.state = 1;
        _self.$confirm('此操作讲上架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (params.rowData.commoditystate !== 1) {
            ajax.post(`/api/admin/UpdateRelatedDrugsById`, data).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                _self.$message({
                  type: 'success',
                  message: res.data.message
                });
                _self.queryData();
              }
            });
          } else {
            _self.$message({
              type: 'warning',
              message: '该商品已上架',
            });
          }
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'down') { // 下架
        data.state = 2;
        _self.$confirm('此操作讲下架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (params.rowData.commoditystate !== 2) {
            ajax.post(`/api/admin/UpdateRelatedDrugsById`, data).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                _self.$message({
                  type: 'success',
                  message: res.data.message
                });
                _self.queryData();
              }
            });
          } else {
            _self.$message({
              type: 'warning',
              message: '该商品已下架',
            });
          }
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    // 删除
    remove(data) {
      let _self = this;
      let id = { id: data };
      ajax.post(`/api/admin/DelRelatedDrugsById`, id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.queryData();
        } else {
          _self.$message.error(res.data.message);
        }
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _self = this;
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id);
          }
          let userIdList = idList.join(',');
          let deteId = { str: userIdList };
          ajax.post(`/api/admin/BatchDelRelatedDrugsById`, deteId).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              _self.queryData();
            }
            else {
              _self.$message.error(res.data.message);
            }
          });
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
    pageChange(pageindex) {
      this.searchData.pageindex = pageindex;
      this.queryData();
    },
    pageSizeChange(pagesize) {
      this.searchData.pageindex = 1;
      this.searchData.pagesize = pagesize;
      this.queryData();
    },
  },
  created() {
    this.queryData();
    // if (this.$route.query.categoryName) {
    //   this.searchData.categoryName = this.$route.query.categoryName;
    // }
    if (this.$route.query.pageindex) {
      this.searchData.pageindex = Number(this.$route.query.pageindex);
      this.queryData();
    }
  }
};
</script>

<style>
</style>
