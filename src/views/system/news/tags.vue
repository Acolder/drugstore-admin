<template>
<div>
  <div id="tags">
    <el-form :inline="true" :model="searchData" size="small" >
        <el-form-item label="标签名" style="padding-left:8px">
          <el-input v-model="searchData.tagName" placeholder="请输入标签名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
    </el-form>
  </div>
  <div class="toolbar-wrapper">
    <el-button-group>
      <el-button type="default" size="small" icon="el-icon-plus" @click="addTagsactive">新增标签</el-button>
      <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
      <el-button type="default" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </el-button-group>
  </div>
  <div class="table-wrapper">
    <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
    @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
  </div>
  <div class="pagin-wrapper">
    <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
    </v-pagination>
  </div>
  <!--新增标签-->
  <el-dialog title="新增标签" :visible.sync="addTagsShow" width="35%" :center="true" :modal-append-to-body="false" :append-to-body="true" top="22vh" :close-on-click-modal="false" class="details">
    <el-form ref="addData" :model="addTags" :rules="rules" label-width="100px" id="addNews">
      <el-row>
        <el-col :span="24">
          <el-form-item label="标签名" prop="tagName" style="width:100%;">
            <el-input class="el-input" v-model="addTags.tagName"></el-input>
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
  <!--修改标签-->
  <el-dialog title="修改标签" :visible.sync="modifyTagsShow" width="35%" :center="true" :modal-append-to-body="false" top="22vh" @close="closeDialog" :append-to-body="true" :close-on-click-modal="false" class="details">
    <el-form ref="addData" :model="addTags" :rules="rules" label-width="100px" id="addNews">
      <el-row>
        <el-col :span="24">
          <el-form-item label="标签名" prop="tagName" style="width:100%;">
            <el-input class="el-input" v-model="addTags.tagName"></el-input>
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
      tableData: [],
      selection: [],
      columns: this.getColumns(),
      searchData: {
        tagId: '',  // 标签ID
        tagName: '',  // 标签名
        pageNum: 1,
        pageSize: 10,
        orderBy: 'desc',
      },
      addTagsShow: false,
      modifyTagsShow: false,
      addTags: {
        tagName: '', // 标签名
      },
      rules: {
        tagName: [{ required: true, message: '请输入标签名', trigger: 'blur' }]
      }
    };
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageNum - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'tagName', title: '标签名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'modifyDate', title: '修改时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 210, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-Tags', isResize: true }
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
          } else if (value === null) {
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
    // 查询
    queryByNews() {
      let _self = this;
      let param = {};
      param = _self.searchData;
      java.post(`/mall_manage/back/tag/queryTagPo`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    // 清除查询
    clean() {
      this.searchData.tagName = '';
      this.queryByNews();
    },
    // 删除标签
    remove(id) {
      let _self = this;
      let param = { tagId: id };
      java.post('/mall_manage/back/tag/delTagPo', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
        _self.queryByNews();
      });
    },
    // 批量删除标签
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tagId = [];
          for (let item of this.selection) {
            tagId.push(item.tagId.toString());
          }
          let strID = tagId.join(',');
          this.remove(strID);
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
    refresh() {  // 刷新
      this.queryByNews();
    },
    // 新增标签
    addTagsactive() {
      this.addTagsShow = true;
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'deleteTags') { // do delete operation
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.tagId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'modifyTags') { // do edit operation
        this.modifyTagsShow = true;
        this.modifyTags(params);
      }
    },
    modifyTags(params) { // 获取数据
      let _self = this;
      _self.addTags = params.rowData;
    },
    // 提交数据
    submitForm() {
      let _self = this;
      let param = _self.addTags;
      if (_self.addTags.tagName) {
        if (_self.addTagsShow) {
          java.post(`/mall_manage/back/tag/addTagPo`, param).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
              _self.addTagsShow = false;
              _self.resetForm();
              _self.queryByNews();
            }
            else {
              this.$message.error(res.data.msg);
            }
          });
        }
        else if (_self.modifyTagsShow) {
          java.post(`/mall_manage/back/tag/updateTagPo`, _self.addTags).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              _self.modifyTagsShow = false;
              _self.queryByNews();
              _self.modifyForm();
              _self.searchData.pageNum = 1;
            }
          });
        }
      } else {
        this.$alert('表单验证失败,请检查填写数据是否完整、有效', '提示', {
          type: 'error'
        });
        return false;
      }
    },
    closeDialog() {
      this.resetForm();
      this.queryByNews();
    },
    resetForm() {  // 新增重置
      this.$refs['addData'].resetFields();
      this.addTags.tagName = '';
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
    pageChange(pageNum) {
      this.searchData.pageNum = pageNum;
      this.queryByNews();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageNum = 1;
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
.form-button-wrapper {
  // height: 165px;
  text-align: center;
  // margin-left: -100px;
}
</style>
