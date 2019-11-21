<template>
  <div id="wrapper">
    <div class="search-werap">
      <el-form :inline="true" :model="searchData" size="small" ref="searchData">
        <el-form-item label="体质" class="newsId">
          <el-select v-model="searchData.categoryName" placeholder="请选择" clearable >
            <el-option v-for="item in options" :key="item.categoryName" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" class="newsId">
          <el-input v-model.trim="searchData.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" class="newsId" style="margin-right:20px">
          <!-- <el-input v-model="searchData.type" placeholder="请输入推荐名称" clearable></el-input> -->
          <el-select v-model="searchData.type" placeholder="请选择" clearable>
            <el-option label="中药方" :value=1></el-option>
            <el-option label="中成药" :value=2></el-option>
          </el-select>
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
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pagesize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  新增弹窗  -->
    <el-dialog title="新增诊疗建议" :visible.sync="suggestAdd" width="50%" :center="true" :modal-append-to-body="false" :append-to-body="true" class="addfilter" :close-on-click-modal="false" >
      <el-form ref="suggestData" :model="Form" :rules="rules" label-width="100px" class="addRoles">
        <el-row>
          <el-col :span="12">
            <el-form-item label="体质" class="newsId" style="margin-right:20px" prop="prescriptmaincategory">
              <el-select v-model="Form.prescriptmaincategory" placeholder="请选择">
                <el-option v-for="item in options1" :key="item.prescriptmaincategory" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="role">
            <el-form-item label="类型" prop="prescripttype" style="width:90%">
              <!-- <el-input class="el-input" v-model.number="form.prescripttype" clearable></el-input> -->
              <el-select v-model="Form.prescripttype" placeholder="请选择" clearable>
                <el-option label="中药方" :value=1></el-option>
                <el-option label="中成药" :value=2></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="prescriptname" style="width:90%">
              <el-input class="el-input" v-model="Form.prescriptname" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="role">
            <el-form-item label="内容" prop="prescriptcontent" style="width:95%">
              <el-input type="textarea" :rows="4" v-model="Form.prescriptcontent" clearable></el-input>
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
    <el-dialog title="修改诊疗建议" :visible.sync="suggestEdit" width="50%" :center="true" :modal-append-to-body="false"  @close="closeDialog" :append-to-body="true" class="addfilter" :close-on-click-modal="false" >
      <el-form ref="suggestData" :model="Form" :rules="rules" label-width="100px" class="addRoles">
        <el-row>
          <el-col :span="12" >
            <el-form-item label="体质" style="margin-right:20px" prop="prescriptmaincategory">
              <el-select v-model="Form.prescriptmaincategory" placeholder="请选择">
                <el-option v-for="item in options1" :key="item.state" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="role">
            <el-form-item label="类型" prop="prescripttype" style="width:90%">
              <el-select v-model="Form.prescripttype" placeholder="请选择" clearable>
                <el-option label="中药方" :value=1></el-option>
                <el-option label="中成药" :value=2></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="prescriptname" style="width:90%">
              <el-input class="el-input" v-model="Form.prescriptname" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="role">
            <el-form-item label="内容" prop="prescriptcontent" style="width:95%">
              <el-input type="textarea" :rows="4" v-model="Form.prescriptcontent" clearable></el-input>
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
        type: '',
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
      options1: [
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
      suggestAdd: false,
      suggestEdit: false,
      Form: {
        prescripttype: '',
        prescriptname: '',
        prescriptcontent: '',
        prescriptmaincategory: '',
      },
      rules: {
        prescripttype: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        prescriptname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        prescriptcontent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        prescriptmaincategory: [{ required: true, message: '请选择主类别', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 清空搜索
    cleanSearch() {
      this.searchData.type = '';
      this.searchData.name = '';
      this.searchData.categoryName = '';
      this.queryData();
    },
    // 查询
    queryData() {
      let _self = this;
      let param = _self.searchData;
      ajax.get(`/api/admin/GetDocDiagnosisProposalList`, { params: param }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    closeDialog() {
      this.resetForm();
      this.queryData();
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
            let index = (_self.searchData.pageindex - 1) * _self.searchData.pagesize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'prescripttypename', title: '药方类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'prescriptname', title: '名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'prescriptcontent', title: '内容', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'prescriptmaincategory', title: '体质', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'state') {
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
    // 新增
    add() {
      this.suggestAdd = true;
    },
    // 删除
    remove(data) {
      let _self = this;
      let id = { id: data };
      ajax.post(`/api/admin/DelDiagnosisProposalById`, id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.queryData();
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
          ajax.post(`/api/admin/BatchDelDiagnosisProposalById`, deteId).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              _self.queryData();
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
      } else if (params.type === 'edit') { // do edit operation
        _self.suggestEdit = true;
        _self.getData(params.rowData.id);
      } else if (params.type === 'up') { // do edit operation
        data.state = 1;
        _self.$confirm('此操作讲上架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (params.rowData.state !== 1) {
            ajax.post(`/api/admin/UpdateDiagnosisProposalTypeById`, data).then(res => {
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
              message: '该商品已上架'
            });
          }
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'down') { // do edit operation
        data.state = 2;
        _self.$confirm('此操作讲下架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (params.rowData.state !== 2) {
            ajax.post(`/api/admin/UpdateDiagnosisProposalTypeById`, data).then(res => {
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
              message: '该商品已下架'
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
    // 获取数据
    getData(data) {
      let _self = this;
      ajax.get(`/api/admin/GetDocDiagnosisProposalDetail?id=` + data).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.Form = res.data.data;
        }
      });
    },
    // 提交数据
    submitForm() {
      let _self = this;
      _self.$refs['suggestData'].validate((valid) => {
        if (valid) {
          let url = `/api/admin/SaveDiagnosisProposal`;
          if (_self.suggestAdd) {
            _self.suggestAdd = false;
          }
          else if (_self.suggestEdit) {
            _self.suggestEdit = false;
          }
          ajax.post(url, _self.Form).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: res.data.message
              });
              // _self.searchData.categoryName = _self.Form.prescriptmaincategory;
              _self.resetForm();
              _self.queryData();
            }
          });
        }
        else {
          return false;
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs['suggestData'].resetFields();
      this.Form.prescripttype = '';
      this.Form.prescriptname = '';
      this.Form.prescriptcontent = '';
      this.Form.prescriptmaincategory = '';
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
    if (this.suggestEdit) {
      this.getData();
    }
  }
};
</script>

<style>
.form-button-wrapper{
  width: 95%;
  text-align: center;
  margin-left: -24px;
}
</style>
