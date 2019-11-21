<template>
  <div class="lsit">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="推广员姓名：">
          <el-input v-model="searchInfo.name" placeholder="请输入推广员姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="getListData" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <!-- <el-button icon="el-icon-plus" size="small" @click="addPeople">推广员</el-button> -->
        <el-button icon="el-icon-delete" size="small" @click="allDelete">批量删除</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="toUpdate">导出</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 新增编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="editShow"
      width="380px"
      center
      top="35vh"
      :modal-append-to-body="false">
      <el-form :model="editData" ref="editForm" size="small"  label-width="130px">
        <el-form-item label="推广员姓名：" prop="spreadname"
        :rules="{
          required: true, message: '请输入推广员姓名', trigger: 'blur'
        }">
          <el-input v-model="editData.spreadname" placeholder="请输入推广员姓名"></el-input>
        </el-form-item>
        <el-form-item label="推广员手机号：" prop="spreadphone"
        :rules="{
          required: true, message: '请输入正确的推广员手机号',validator: validPhone, trigger: 'blur'
        }">
          <el-input v-model="editData.spreadphone" placeholder="请输入推广员手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      searchInfo: {
        name: '',
        pageSize: 10,
        pageIndex: 1
      },
      tableData: [],
      columns: this.getColumns(),
      total: 0,
      title: '',
      editShow: false,
      editData: {
        spreadname: '',
        spreadphone: ''
      },
      selection: [],
      // name: ''
    };
  },
  methods: {
    // 手机号正则
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入电话号码'));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 20,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        // { field: 'serialnumber', title: '推广员编号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'mobile', title: '推广员状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '注册时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'spreadname', title: '推广员姓名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'spreadphone', title: '推广员手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'scannumber', title: '扫码次数', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'newusernumber', title: '新用户注册数', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'state', title: '状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'spreadqrurl', title: '推广二维码', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-extension', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'scannumber') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return 0;
            }
          };
        }
        if (item.field === 'newusernumber') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return 0;
            }
          };
        }
        if (item.field === 'state') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:red">禁用</span>';
            } else if (value === 1) {
              return '<span style="color:green">启用</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'start') { // 启用
        this.setStata(param.rowData.id, 1);
      } else if (param.type === 'deleteRow') {
        this.$confirm('此操作将永久删除该推广员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            id: param.rowData.id
          };
          ajax.post('/api/admin/DelSpreadInfoById', obj).then(res => {
            if (res.data.code === 0 && res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getListData();
            }
          });
        });
      } else if (param.type === 'stop') { // 停用
        this.setStata(param.rowData.id, 0);
      } else if (param.type === 'edit') {
        this.title = '推广员信息修改';
        this.editData = {
          spreadname: param.rowData.spreadname,
          spreadphone: param.rowData.spreadphone,
          id: param.rowData.id
        };
        this.editShow = true;
      }
    },
    setStata(id, state) {
      let obj = {
        id: id,
        state: state
      };
      ajax.post('/api/admin/UpdateSpreadStateById', obj).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: '成功!'
          });
          this.getListData();
        }
      });
    },
    pageChange(pageIndex) {
      this.searchInfo.pageIndex = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = pageSize;
      this.getListData();
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
    clean() {
      this.searchInfo.name = '';
      this.getListData();
    },
    // 新增
    addPeople() {
      this.editShow = true;
      this.title = '新增推广员';
    },
    // 保存
    save() {
      ajax.post('/api/admin/SaveSpreadInfo', this.editData).then(res => {
        console.log(res);
        this.editShow = false;
        if (res.data.code === 0 && res.status === 200) {
          this.$message.success(res.data.message);
          this.getListData();
        }
      });
    },
    allDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该推广员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = [];
          for (let item of this.selection) {
            data.push(item.id);
          }
          let obj = { str: data.join(',') };
          ajax.post('/api/admin/BatchDelSpreadInfoById', obj).then(res => {
            if (res.data.code === 0 && res.status === 200) {
              this.$message.success(res.data.message);
              this.getListData();
            }
          });
        });
      } else {
        this.$message.warning('请选择要删除的数据');
      }
    },
    toUpdate() {
      // let url = `${process.env.BASE_HOST}/api/admin/ExportSpreadInfo?pageIndex=1&pageSize=10&name=` + this.name;
      window.open(`${process.env.BASE_HOST}/api/admin/ExportSpreadAll`);
      // window.open(url);
    },
    getListData() {
      // this.name = this.searchInfo.name;
      this.searchInfo.pageSize = 10;
      this.searchInfo.pageIndex = 1;
      ajax.get('/api/admin/GetSpreadInfoList', { params: this.searchInfo }).then(res => {
        console.log(res);
        if (res.data.code === 0 && res.status === 200) {
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    }
  },
  created() {
    this.getListData();
  }
};
</script>

<style>

</style>
