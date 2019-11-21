<template>
  <div id="powerWrap">
    <div>
      <el-form :inline="true" label-width="80px" :model="powerData" size="small" ref="powerList">
        <el-form-item label="标题">
          <el-input v-model="powerData.title" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限ID">
          <el-input v-model="powerData.permissionsId" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="权限名称">
          <el-input v-model="powerData.permissionsName" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限路径">
          <el-input v-model="powerData.permissionsUrl" clearable></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="powerData.component" clearable></el-input>
        </el-form-item><br/>
        <el-form-item label="创建人">
          <el-input v-model="powerData.createBy" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="powerData.remark" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin-left:18px;">
            <el-button type="default" @click="cleanSearch" icon="el-icon-delete">清 除</el-button>
            <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addNews">新增权限</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="powerData.pageSize" :page-index="powerData.pageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  新增弹窗  -->
    <el-dialog title="新增权限" :visible.sync="powerAdd" width="35%" :center="true" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false" >
      <el-form ref="addPowerData" :model="formPower" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题：" prop="title" style="width:90%">
              <el-input class="el-input" v-model="formPower.title" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组件：" prop="component"  style="width:90%">
              <el-input class="el-input" v-model="formPower.component" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="权限名称：" prop="permissionsName"  style="width:90%">
              <el-input class="el-input" v-model="formPower.permissionsName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限路径：" prop="permissionsUrl"  style="width:90%">
              <el-input class="el-input" v-model="formPower.permissionsUrl" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作人：" prop="createBy"  style="width:90%">
              <el-input class="el-input" v-model="formPower.createBy" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark"  style="width:90%">
              <el-input class="el-input" v-model="formPower.remark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-button-wrapper" style="text-align:center;margin-left:-100px;">
          <el-form-item>
            <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
            <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <!--  编辑弹窗  -->
    <el-dialog title="修改权限" :visible.sync="powerEdit" width="35%" :center="true" @close="closeDialog" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false" >
      <el-form ref="addPowerData" :model="formPower" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题：" prop="title" style="width:90%">
              <el-input class="el-input" v-model="formPower.title" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组件：" prop="component"  style="width:90%">
              <el-input class="el-input" v-model="formPower.component" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="权限名称：" prop="permissionsName"  style="width:90%">
              <el-input class="el-input" v-model="formPower.permissionsName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限路径：" prop="permissionsUrl"  style="width:90%">
              <el-input class="el-input" v-model="formPower.permissionsUrl" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作人：" prop="createBy"  style="width:90%">
              <el-input class="el-input" v-model="formPower.createBy" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark"  style="width:90%">
              <el-input class="el-input" v-model="formPower.remark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-button-wrapper" style="text-align:center;margin-left:-100px;">
          <el-form-item>
            <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
            <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>

</style>
<script>
import java from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      powerData: {
        pageIndex: 1,
        pageSize: 10,
        title: '',  // 标题
        component: '',  // 组件
        permissionsId: '',  // 权限ID
        permissionsName: '',  // 权限名称
        permissionsUrl: '',  // 权限路径
        createBy: '',  // 创建人
        remark: '',  // 备注
      },
      selection: [],
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      powerAdd: false,
      powerEdit: false,
      formPower: {
        title: '',  //     标题
        component: '',  //   组件
        permissionsUrl: '',  // 权限Url
        permissionsName: '',  //   权限名称
        remark: '',  //   备注
        createBy: '',  //   操作人
      },
      rules: {
        title: [
          { required: true, message: '请输入菜单ID', trigger: 'blur' },
        ],
        component: [
          { required: false, message: '请输入组件名称', trigger: 'blur' },
        ],
        permissionsUrl: [
          { required: true, message: '请输入权限路径', trigger: 'blur' },
          // { type: 'url', message: '请输入正确的路径', trigger: 'blur' },
        ],
        permissionsName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
        ],
        createBy: [
          { required: false, message: '请输入操作人', trigger: 'blur' },
        ],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    cleanSearch() { // 清除查询
      this.powerData.pageIndex = 1;
      this.powerData.title = '';
      this.powerData.component = '';
      this.powerData.permissionsId = '';
      this.powerData.permissionsName = '';
      this.powerData.permissionsUrl = '';
      this.powerData.createBy = '';
      this.powerData.remark = '';
      this.query();
    },
    query() { // 查询
      this.powerData.pageIndex = 1;
      this.gettableData();
    },
    // 获取列表数据
    gettableData() {
      let _self = this;
      let param = _self.powerData;
      java.post(`/mall_manage/back/queryPermissions`, param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          // this.powerData.pageIndex = 1;
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
        }
      });
    },
    Refresh() { // 刷新
      this.cleanSearch();
      // this.query();
    },
    addNews() { // 新增
      // this.$router.push('/power/addPower');
      this.powerAdd = true;
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'deletePower') { // do delete operation
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.permissionsId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'modifyPower') { // do edit operation
        this.powerEdit = true;
        this.getPowerData(params.rowData);
      }
    },
    remove(id) { // 点击删除
      console.log(id);
      let _self = this;
      let param = { permissionsId: id };
      java.post('/mall_manage/back/deletePermissions', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
        _self.query();
      });
    },
    batchDelete() { // 批量删除
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let permissionsIdList = [];
          for (let item of this.selection) {
            permissionsIdList.push(item.permissionsId);
          }
          let permissionsIdListStr = permissionsIdList.join(',');
          console.log(permissionsIdListStr);
          this.remove(permissionsIdListStr);
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
            let index = (_self.powerData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'permissionsId', title: '权限ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'permissionsName', title: '权限名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'permissionsUrl', title: '权限路径', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'component', title: '组件', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'createBy', title: '创建人', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 210, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-powerManage', isResize: true }
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
    getPowerData(data) {  // 获取权限数据
      let _self = this;
      // console.log(data);
      _self.formPower = data;
      _self.formPower.permissionsId = data.permissionsId;
    },
    // 提交数据
    submitForm() {
      let _self = this;
      _self.$refs['addPowerData'].validate((valid) => {
        if (valid) {
          let param = _self.formPower;
          if (_self.powerAdd === true) {
            java.post(`/mall_manage/back/savePermissions`, param).then(res => {
              // console.log(res);
              if (res.status === 200 && res.data.resultCode === '0') {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success'
                });
                _self.powerAdd = false;
                _self.resetForm();
                _self.query();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
          else if (_self.powerEdit === true) {
            java.post(`/mall_manage/back/updatePermissions`, param).then(res => {
              // console.log(res);
              if (res.status === 200 && res.data.resultCode === '0') {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success'
                });
                _self.powerEdit = false;
                // _self.resetForm();
                _self.query();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
        else {
          _self.$alert('表单验证失败,请检查填写数据是否完整、有效', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    closeDialog() {
      this.resetForm();
      this.query();
    },
    // 重置
    resetForm() {
      this.$refs['addPowerData'].resetFields();
      this.formPower.title = '';
      this.formPower.component = '';
      this.formPower.permissionsName = '';
      this.formPower.permissionsUrl = '';
      this.formPower.createBy = '';
      this.formPower.remark = '';
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
      this.powerData.pageIndex = pageIndex;
      this.gettableData();
    },
    pageSizeChange(pageSize) {
      this.powerData.pageIndex = 1;
      this.powerData.pageSize = pageSize;
      this.gettableData();
    },
  },
  created() {
    this.gettableData();
  },
  watch: {}
};
</script>
