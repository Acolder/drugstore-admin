<template>
  <div id="cardList">
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="用户昵称">
          <el-input v-model.trim="screenInfo.name" placeholder="请输入用户昵称" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model.trim="screenInfo.mobile" placeholder="请输入用户手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addSuperMan">添加达人</el-button>
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
    <el-dialog :title="title" :visible.sync="superShow" :modal-append-to-body="false" :append-to-body="true" @close="cancel" width="400px" center>
      <el-form :model="formData" ref="addData" size="small" :rules="addrules" label-width="100px">
        <el-form-item label="用户手机号:" prop="mobile" class="source" placeholder="请输入用户手机号"  style="margin: 0 0 20px 0">
          <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
        <el-form-item class="form-wrapper">
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
    // 手机号验证
    let validatePhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      } else {
        return callback(new Error('请输入正确的手机号'));
      }
    };
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        type: 1,
        name: '',
        mobile: '',
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        role_type: 1,
        mobile: '',
      },
      addrules: {
        mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      },
      title: '',  // 新增、编辑标题
      superShow: false,
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
        { field: 'role_type_name', title: '用户昵称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'mobile', title: '用户手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
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
      }
      return columns;
    },
  },
  methods: {
    clean() {
      this.screenInfo.name = '';
      this.screenInfo.mobile = '';
      this.getTable();
    },
    query() {
      this.getTable();
    },
    addSuperMan() {
      this.title = '新增达人';
      this.superShow = true;
    },
    cancel() {
      this.formData.mobile = '';
      this.superShow = false;
    },
    // 保存编辑
    save() {
      let _self = this;
      let param = _self.formData;
      let url;
      if (_self.title === '新增达人') {
        url = `/api/news/CreatePostUserRoleInfo`;
      } else {
        url = `/api/news/UpdatePostUserRoleInfo`;
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
      ajax.get(`/api/news/DelPostUserRoleInfoByid`, { params: param }).then((res) => {
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
          this.remove(params.rowData.role_id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.superShow = true;
        this.title = '编辑达人';
        // 利用深拷贝，防止数据变更污染数据
        let temData = JSON.stringify(params.rowData);
        this.formData = JSON.parse(temData);
      }
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.get(`/api/news/GetPostUserRoleInfo`, { params: param }).then((res) => {
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
.form-wrapper{
    text-align: center;
    margin-left: -100px;
  }
</style>
