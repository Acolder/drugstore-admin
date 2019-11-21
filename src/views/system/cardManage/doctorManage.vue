<template>
  <div id="cardList">
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="用户手机号">
          <el-input v-model="screenInfo.mobile" placeholder="请输入用户手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addDoctor">添加医生</el-button>
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
    <el-dialog :title="title" :visible.sync="doctorShow" :modal-append-to-body="false" :append-to-body="true" @close="cancel" width="450px" center>
      <el-form :model="formData" ref="addData" size="small" :rules="addrules" label-width="100px">
        <el-form-item label="用户手机号:" prop="mobile" class="source" >
          <el-input v-model="formData.mobile" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="大夫简介:" prop="doctor_description"  class="source" style="margin: 20px 0">
          <el-input type="textarea" :rows="4" v-model="formData.doctor_description" placeholder="请输入大夫简介（50字以内）"></el-input>
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
    // 作者简介
    let authorLength = (rule, value, callback) => {
      if (value.length <= 50) {
        callback();
      } else {
        return callback(new Error('请输入小于50个字以内的文字'));
      }
    };
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
        // callback();
        return callback(new Error('请输入正确的手机号'));
      }
    };
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        name: '',
        mobile: '',
        type: 2,
        content: '',
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        role_type: 2,
        mobile: '',
        doctor_description: '',
      },
      addrules: {
        mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        doctor_description: [{ required: false, validator: authorLength, trigger: 'blur' }],
      },
      title: '',  // 新增、编辑标题
      doctorShow: false,
      doctorDetail: '',
      NewList: false,
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
        { field: 'doctor_description', title: '医生简介', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
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
      this.screenInfo.mobile = '';
      this.getTable();
    },
    query() {
      this.getTable();
    },
    addDoctor() {
      this.title = '添加医生';
      this.doctorShow = true;
    },
    cancel() {
      this.formData.mobile = '';
      this.formData.doctor_description = '';
      this.doctorShow = false;
    },
    // 保存编辑
    save() {
      let _self = this;
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          let param = _self.formData;
          let url;
          if (_self.title === '添加医生') {
            url = `/api/news/CreatePostUserRoleInfo`;
          } else {
            url = `/api/news/UpdatePostUserRoleInfo`;
          }
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
        this.doctorShow = true;
        this.title = '编辑医生';
        // 利用深拷贝，防止数据变更
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
.newTitle{
    display: block;
    overflow: hidden;
    text-overflow:ellipsis;//文本溢出显示省略号
    white-space:nowrap;//文本不会换行（单行文本溢出）
    width:280px;
    position: relative;
    .detailTitle{
      position: absolute;
      top: 0px;
      right: 0px;
      cursor: pointer;
    }
  }
  .form-wrapper{
    text-align: center;
    margin-left: -100px;
  }
</style>
