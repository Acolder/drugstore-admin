<template>
  <div id="commentWrap">
    <div class="search-werap">
      <el-form :inline="true" :model="searchData" :rules="rules" size="small" ref="searchData">
        <el-form-item label="资讯标题" class="newsId" style="margin-right:20px">
          <el-input v-model="searchData.title" placeholder="请输入资讯标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="评论内容" class="newsId">
          <el-input v-model="searchData.content" placeholder="请输入评论内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addComment">新增用户</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  新增弹窗  -->
    <el-dialog title="新增评论" :visible.sync="commentAdd" width="50%" :center="true" :modal-append-to-body="false" :append-to-body="true" class="addfilter" :close-on-click-modal="false" >
      <el-form ref="commonData" :model="form" :rules="rules" label-width="100px" class="addRoles">
        <el-row>
          <el-col :span="12" class="role">
            <el-form-item label="资讯ID" prop="newsId" style="width:90%">
              <el-input class="el-input" v-model.number="form.newsId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父ID" prop="parentId" style="width:90%">
              <el-input class="el-input" v-model.number="form.parentId" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="role">
            <el-form-item label="评论内容" prop="content" style="width:95%">
              <el-input type="textarea" :rows="4" v-model="form.content" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="form-button-wrapper">
            <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
            <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <!--  修改弹窗  -->
    <el-dialog title="编辑评论" :visible.sync="commentEdit" width="50%" :center="true" :modal-append-to-body="false" @close="closeDialog" :append-to-body="true" class="addfilter" :close-on-click-modal="false" >
      <el-form ref="commonData" :model="form" :rules="rules" label-width="100px" class="addRoles">
        <el-row>
          <el-col :span="12" class="role">
            <el-form-item label="资讯ID" prop="newsId" style="width:90%">
              <el-input class="el-input" v-model.number="form.newsId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父ID" prop="parentId" style="width:90%">
              <el-input class="el-input" v-model.number="form.parentId" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="role">
            <el-form-item label="评论内容" prop="content" style="width:95%">
              <el-input type="textarea" :rows="4" v-model="form.content" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="form-button-wrapper">
            <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
            <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import java from '@/utils/javaApiRequest';
import { formatDate } from '../../../utils/date.js';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      columns: this.getColumns(),
      searchData: {
        title: '',  // 资讯标题
        content: '',  // 评论
        pageIndex: 1,
        pageSize: 10,
      },
      commentAdd: false,
      commentEdit: false,
      form: {
        newsId: '',  // 资讯id
        parentId: '',  // 父评论
        content: '',  // 评论内容
      },
      rules: {
        newsId: [
          { required: true, message: '请输入咨询ID', trigger: 'blur' },
          { type: 'number', message: '咨询ID只能为数字', trigger: 'blur' },
        ],
        parentId: [
          { required: true, message: '请输入父ID', trigger: 'blur' },
          { type: 'number', message: '父ID只能为数字', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 清除搜索
    clean() {
      this.searchData.content = '';
      this.searchData.title = '';
      this.queryByNews();
    },
    // 查询
    queryByNews() {
      let _self = this;
      let param = {};
      param = _self.searchData;
      java.post(`/mall_manage/back/newsComment/queryNewsComment`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    // 刷新
    query() {
      this.queryByNews();
    },
    // 删除评论
    remove(id) {
      let _self = this;
      let param = { commentId: id };
      java.post(`/mall_manage/back/newsComment/delNewsComment`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
        _self.queryByNews();
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.commentId);
          }
          let userIdList = idList.join(',');
          this.remove(userIdList);
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
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'newsTitle', title: '资讯标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'content', title: '评论内容', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'parentId', title: '父ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'childNewsComment', title: '二级评论', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'modifyDate', title: '修改时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 210, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-comment', isResize: true }
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
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            return formatDate(value);
          };
        }
        if (item.field === 'modifyDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            return formatDate(value);
          };
        }
      }
      return columns;
    },
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.commentId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation
        this.commentEdit = true;
        this.getComment(params.rowData);
      }
    },
    // 添加评论
    addComment() {
      this.commentAdd = true;
    },
    // 获取信息
    getComment(rowData) {
      this.form = rowData;
    },
    // 提交数据
    submitForm() {
      let _self = this;
      let param = _self.form;
      _self.$refs['commonData'].validate((valid) => {
        if (valid) {
          if (_self.commentAdd) {
            java.post(`/mall_manage/back/newsComment/insertNewsComment`, param).then(res => {
              if (res.status === 200 && res.data.resultCode === '0') {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success'
                });
                _self.commentAdd = false;
                _self.resetForm();
                _self.queryByNews();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
          else if (_self.commentEdit) {
            java.post(`/mall_manage/back/newsComment/updateNewsComment`, param).then(res => {
              if (res.status === 200 && res.data.resultCode === '0') {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success'
                });
                _self.commentEdit = false;
                _self.queryByNews();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        } else {
          _self.$alert('表单验证失败,请检查填写数据是否完整、有效', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    closeDialog() {
      this.resetForm();
      this.queryByNews();
    },
    // 重置
    resetForm() {
      this.$refs['commonData'].resetFields();
      this.form.newsId = ''; // 资讯id
      this.form.parentId = ''; // 父评论
      this.form.content = ''; // 评论内容
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
    pageChange(pageIndex) {
      this.searchData.pageIndex = pageIndex;
      this.queryByNews();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageIndex = 1;
      this.searchData.pageSize = pageSize;
      this.queryByNews();
    },
  },
  created() {
    this.queryByNews();
  }
};
</script>
<style lang="less" scoped>
.newsId{
  margin: 0 10px;
}
.form-button-wrapper {
  width: 95%;
  text-align: center;
  margin-left: -24px;
}
</style>

