<template>
  <div id="cardList">
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
      <el-form :model="formData" size="small" ref="formData" :rules="addrules" label-width="100px">
        <el-form-item label="用户手机号:" prop="mobile" class="source" >
          <el-input v-model="formData.mobile" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="作者简介:" prop="author_introduction"  class="source" style="width:100%;">
          <el-input type="textarea" :rows="4" v-model="formData.author_introduction" placeholder="请输入作者简介（50字以内）"></el-input>
        </el-form-item>
        <el-form-item class="form-wrapper">
          <el-button type="default" @click="cancel" icon="el-icon-circle-close">取消</el-button>
          <el-button size="small" type="primary" @click="save" icon="el-icon-search">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        name: '',
        mobile: '',
        type: 3,
        content: '',
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        role_type: 3,
        mobile: '',
        author_introduction: '',
      },
      addrules: {
        mobile: [{ required: true, message: '请输入用户手机号', trigger: 'blur' }],
        author_introduction: [{ required: false, message: '请输入排序', trigger: 'blur' }],
      },
      title: '',  // 新增、编辑标题
      doctorShow: false,
      doctorDetail: '',
      NewList: false,
      // NewListURL: `${process.env.WEB_HOST}/manage/outNewList`,
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'role_type_name', title: '用户昵称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'mobile', title: '用户手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        // { field: 'food_property', title: '展示排序', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true },
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
      this.query();
    },
    query() {
      this.getTable();
    },
    addDoctor() {
      this.title = '添加作者';
      this.doctorShow = true;
    },
    cancel() {
      this.formData.mobile = '';
      this.formData.author_introduction = '';
      this.doctorShow = false;
    },
    // 保存编辑
    save() {
      let _self = this;
      let param = _self.formData;
      let url;
      _self.$refs['formData'].validate((valid) => {
        if (valid) {
          if (_self.title === '添加作者') {
            url = `/api/news/CreatePostUserRoleInfo`;
          } else {
            url = `/api/news/UpdatePostUserRoleInfo`;
          }
          // console.log(param);
          ajax.post(url, param).then((res) => {
            // console.log(res);
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
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
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
      if (params.type === 'querySelect') { // do select operation
        parent.window.selectAuthor(params.rowData);
      }
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.get(`/api/news/GetPostUserRoleInfo`, { params: param }).then((res) => {
        // console.log(res);
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
