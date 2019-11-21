<template>
  <div id="cardList">
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="分类名称">
          <el-input v-model.trim="screenInfo.name" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addClass">添加分类</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  新增、编辑  -->
    <el-dialog :title="title" :visible.sync="categoryShow" :modal-append-to-body="false" :append-to-body="true" @close="cancel" width="400px" center>
      <el-form :model="formData" ref="addData" size="small" :rules="addrules" label-width="100px">
        <el-form-item label="分类名称:" prop="title" class="source" style="width:85%;margin-bottom: 18px;">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="分类排序:" prop="sort" class="source" style="width:85%;margin-bottom: 18px;">
          <el-input v-model="formData.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:" prop="is_show" class="catecory" style="width:85%;margin-bottom: 18px;">
          <el-select v-model="formData.is_show" placeholder="请选择">
            <el-option label="是" :value=1></el-option>
            <el-option label="否" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="formwrapper">
          <el-button type="default" @click="cancel" icon="el-icon-circle-close">取消</el-button>
          <el-button size="small" type="primary" @click="save" icon="el-icon-check">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    // 排序
    let validateSort = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内，大于0的正整数'));
        }
      } else {
        return callback(new Error('请输入10位数以内，大于0的正整数'));
      }
    };
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        type: 1,
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      categoryShow: false,
      formData: {
        type: 1,
        title: '',
        sort: '',
        is_show: ''
      },
      addrules: {
        title: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        sort: [{ required: true, validator: validateSort, trigger: 'blur' }],
        is_show: [{ required: true, message: '是否显示', trigger: 'blur' }],
      },
      title: '',  // 新增、编辑标题
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '标签名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'sort', title: '展示排序', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'is_show', title: '是否显示', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'editAndremove', isResize: true },
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
        if (item.field === 'is_show') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === true) {
              return '是';
            } else {
              return '否';
            }
          };
        }
      }
      return columns;
    },
  },
  methods: {
    clean() {
      this.screenInfo.name = '';
      this.getTable();
    },
    query() {
      this.getTable();
    },
    addClass() {
      this.categoryShow = true;
      this.title = '新增分类';
    },
    cancel() {
      this.formData.title = '';
      this.formData.sort = '';
      this.formData.is_show = '';
      this.categoryShow = false;
    },
    // 保存编辑
    save() {
      let _self = this;
      let param = _self.formData;
      let url;
      if (_self.title === '新增分类') {
        url = `/api/news/CreatePostCategoryInfo`;
      } else {
        url = `/api/news/UpdatePostCategoryInfo`;
      }
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          ajax.post(url, param).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功',
              });
              _self.cancel();
              _self.getTable();
            }
          });
        } else {
          return false;
        }
      });

    },
    // 删除
    remove(id) {
      let param = {
        id: id,
      };
      ajax.get(`/api/news/DelPostCategoryInfoByid`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getTable();
        }
      });
    },
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.category_id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.categoryShow = true;
        this.title = '修改分类';
        // 利用深拷贝，防止数据变更
        let temData = JSON.stringify(params.rowData);
        this.formData = JSON.parse(temData);
        if (this.formData.is_show === true) {
          this.formData.is_show = 1;
        } else {
          this.formData.is_show = 0;
        }
      }
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.get(`/api/news/GetPostCategoryInfo`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTable();
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
  },
  created() {
    this.getTable();
  }
};
</script>

<style lang="less" scoped>
.formwrapper{
    text-align: center;
    margin-left: -100px;
  }
</style>
