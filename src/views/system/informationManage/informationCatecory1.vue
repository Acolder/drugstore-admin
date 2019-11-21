<template>
  <div id="cardList">
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="分类名称">
          <el-input v-model="screenInfo.categoryname" placeholder="请输入资讯标题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addCategory">新增分类</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
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
    <el-dialog :title="title" :visible.sync="categoryShow" :modal-append-to-body="false" :append-to-body="true" width="400px" @close="cancel" center>
      <el-form :model="formData" size="small" ref="formData" :rules="addrules" label-width="100px">
        <el-form-item label="分类名称:" prop="categoryname" class="source" >
          <el-input v-model="formData.categoryname" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="展示图:" :prop="'picture_path'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}">
            <uploadImg :imgUrl="formData.picture_path" :fileName="'picture_path'" @uploadSuccess="uploadImg" @removeImg="removeImg" ></uploadImg>
            <el-input class="left" type="hidden" v-model="formData.picture_path"></el-input>
          </el-form-item>
        <el-form-item label="分类排序:" prop="sort" class="source">
          <el-input v-model.number="formData.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:" prop="isshow" class="source">
          <el-select v-model="formData.isshow" placeholder="请选择">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设为专栏:" prop="is_column" class="source">
          <el-select v-model="formData.is_column" placeholder="请选择">
            <el-option label="否" :value="1"></el-option>
            <el-option label="专栏一" :value="2"></el-option>
            <el-option label="专栏二" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-button-wrapper">
          <el-button type="default" @click="cancel" icon="el-icon-circle-close">取消</el-button>
          <el-button type="primary" @click="save" icon="el-icon-search">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        categoryname: '',
        version: 'v2.0',
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        id: null,
        categoryname: '',
        // photo_path: '',
        picture_path: '',
        isshow: '',
        sort: '',
        version: 'v2.0',
        is_column: '',
      },
      addrules: {
        categoryname: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }],
        isshow: [{ required: true, message: '是否显示', trigger: 'blur' }],
        is_column: [{ required: true, message: '请设置专栏', trigger: 'blur' }],
      },
      title: '',  // 新增、编辑标题
      categoryShow: false,
    };
  },
  components: {
    'uploadImg': uploadImg,
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'categoryname', title: '分类名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'picture_path', title: '分类展示图', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'is_column', title: '设为专栏', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '分类排序', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isshow', title: '是否显示', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'picture_path') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'is_column') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '专栏一';
            } else if (value === 1) {
              return '专栏二';
            } else if (value === 2) {
              return '专栏三';
            } else if (value === 3) {
              return '专栏四';
            }
          };
        }
        if (item.field === 'isshow') {
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
      this.screenInfo.categoryname = '';
      this.getTableData();
    },
    query() {
      this.getTableData();
    },
    uploadImg(data, imgUrl) {
      this.formData.picture_path = imgUrl;
    },
    removeImg(url) {
      this.formData.picture_path = url;
    },
    addCategory() {
      this.title = '添加分类';
      this.categoryShow = true;
    },
    // 删除分类
    remove(id) {
      // console.log(id);
      ajax.post(`/api/news/deleteNewsCategory`, id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData();
        }
      });
    },
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = [];
          for (let item of this.selection) {
            Ids.push(item.id);
          }
          this.remove(Ids);
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
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [params.rowData.id];
          this.remove(ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.categoryShow = true;
        let temData = JSON.stringify(params.rowData);
        this.formData = JSON.parse(temData);
        this.title = '修改分类';
      }
    },
    // 保存编辑
    save() {
      let _self = this;
      let param = _self.formData;
      let url;
      _self.$refs['formData'].validate((valid) => {
        if (valid) {
          url = `/api/v2/news/category/save`;
          ajax.post(url, param).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功'
              });
              _self.cancel();
              _self.getTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消保存
    cancel() {
      this.$refs['formData'].resetFields();
      this.categoryShow = false;
    },
    // 获取列表
    getTableData() {
      let _self = this;
      ajax.post('/api/v2/news/category/list', _self.screenInfo).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
        }
      });
    },
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTableData();
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
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.source{
  width: 80%;
}
</style>
