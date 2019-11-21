<template>
  <div id="doctorCategory">
    <div class="toolbar-wrapper">
      <el-button-group>
          <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button type="default" size="small" icon="el-icon-refresh" @click="refreshList">刷新</el-button>
      </el-button-group>
    </div>
    <el-tabs v-model="activeStatus" type="card" @tab-click="statusChange">
      <!--中成药-->
      <el-tab-pane label="中成药" name="ChineseDrug">
        <div class="entryNum">
          中药条数: <span class="badge badge-danger">{{total}}</span>
        </div>
        <v-table ref="data_table" :row-height = 60  column-width-drag  is-horizontal-resize style="width:100%"
                 :columns="columns_ChineseDrug"
                 :table-data="tableData" row-hover-color="#eee" :column-cell-class-name="columnCellClass"
                 row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL"
                 :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
                        :page-size="screenInfo.PageSize"
                        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
      <!--西药-->
      <el-tab-pane label="西药" num="30" name="WesternDrug">
        <div class="entryNum">
          西药条数: <span class="badge badge-danger">{{total}}</span>
        </div>
        <v-table ref="data_table" :row-height = 60 column-width-drag  is-horizontal-resize is-vertical-resize
                 style="width:100%" :columns="columns"
                 :table-data="tableData" row-hover-color="#eee" :column-cell-class-name="columnCellClass"
                 row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
                        :page-size="screenInfo.PageSize"
                        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--  新增 编辑 -->
    <el-dialog :title="title" :visible.sync="addData" width="400px" :center="true" :modal-append-to-body="false" :append-to-body="true" class="details" @close="close">
      <el-form ref="addData" :model="addForm" :rules="addRules" :inline="true" label-width="80px">
        <el-form-item label="分类名:"  prop="categoryName" class="line">
          <el-input v-model.trim="addForm.categoryName" placeholder="请输入分类名" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="parentCode">
          <!-- <el-input v-model.trim="addForm.categoryName" placeholder="请输入分类名" clearable></el-input> -->
          <el-select v-model="addForm.parentCode" placeholder="请选择" clearable>
            <el-option label="中成药" :value=2></el-option>
            <el-option label="西药" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-button-wrapper">
          <el-button @click="cancel" icon="el-icon-circle-close-outline" size="small">取消</el-button>
          <el-button @click="save" type="primary" icon="el-icon-check" size="small">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import java from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      activeStatus: 'WesternDrug',
      title: '',
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        parentCode: 3,
        PageIndex: 1,
        PageSize: 10,
      },
      addData: false,
      addForm: {
        categoryName: '',
        parentCode: '',
      },
      addRules: {
        categoryName: [{ required: true, message: '请输入分类名', trigger: 'blur' }],
        parentCode: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
      categoryDoctorsId: ''
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    // 中成药
    columns_ChineseDrug() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'categoryName',
          title: '分类名称',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: '',
          title: '操作',
          width: 300,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operations-doctorCategoryList',
        }
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
    // 西药
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'categoryName',
          title: '分类名称',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: '',
          title: '操作',
          width: 300,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operations-doctorCategoryList',
        }
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
    columnCellClass(rowIndex, columnName, rowData) {
      if (columnName === 'categoryName') {
        return 'column-cell-class-name-test';
      }
    },
    // 切换中西药
    statusChange() {
      if (this.activeStatus === 'ChineseDrug') {
        this.screenInfo.parentCode = 2;
      } else {
        this.screenInfo.parentCode = 3;
      }
      this.screenInfo.PageIndex = 1;
      this.getTreeData();
    },
    close() {
      this.cancel();
    },
    // 刷新
    refreshList() {
      this.clean();
    },
    // 新增
    add() {
      this.title = '新增分类';
      this.addData = true;
    },
    cancel() {
      this.addData = false;
      this.addForm.categoryName = '';
      this.addForm.parentCode = '';
    },
    // 保存数据
    save() {
      let _self = this;
      let param = this.addForm;
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          let url;
          if (this.title === '新增分类') {
            url = `/mall_manage/back/category/addCategoryDoctors`;
          } else {
            param.categoryDoctors = this.categoryDoctorsId;
            url = `/mall_manage/back/category/updateCategoryDoctors`;
          }
          java.post(url, param).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.cancel();
              this.getTreeData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.categoryDoctors);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.title = '修改分类';
        this.addData = true;
        this.addForm.categoryName = params.rowData.categoryName;
        this.addForm.parentCode = params.rowData.parentCode;
        this.categoryDoctorsId = params.rowData.categoryDoctors;
      }
    },
    // 删除
    remove(data) {
      let _self = this;
      let param = {
        categoryDoctors: data,
      };
      java.post(`/mall_manage/back/category/deleteCategoryDoctors`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            type: 'success',
            message: '删除成功'
          });
          _self.getTreeData();
        }
      });
    },
    // 获取列表
    getTreeData() {
      java.post(`/mall_manage/back/category/queryCategoryByParentCode`, this.screenInfo).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData;
          this.total = res.data.resultData.length;
        }
      });
    },
    // 分页
    pageChange(pageIndex) {
      this.screenInfo.PageIndex = pageIndex;
      this.getTreeData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.PageIndex = 1;
      this.screenInfo.PageSize = pageSize;
      this.getTreeData();
    },
    // 全反选
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
  mounted: function () {
    this.getTreeData();
  }
};
</script>
<style lang="less" scoped>
.line{
  display: block;
}
.toolbar-wrapper{
  margin: 0 0 0 -10px;
}
.entryNum {
    color: red;
    margin: 10px 10px 15px 5px;
  }
.form-button-wrapper{
  display: block;
  text-align: center;
  margin: 10px 0 0px 0px;
}
</style>
