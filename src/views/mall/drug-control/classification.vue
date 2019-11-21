<template>
  <div class="ification">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增分类</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <!-- 新增分类 -->
    <el-dialog :title="title" @close="addClose" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :append-to-body="true" width="30%" center>
      <el-form :model="addData" ref="ruleForm" :rules="rules" size="small" label-width="100px">
        <el-form-item label="分类名称：" prop="categoryName">
          <el-input v-model="addData.categoryName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类级别：" prop="categoryLevel">
          <el-input v-model="addData.categoryLevel" placeholder="请输入分类级别"></el-input>
        </el-form-item>
        <el-form-item label="分类排序：" prop="categorySort">
          <el-input v-model.number="addData.categorySort" placeholder="请输入分类排序"></el-input>
        </el-form-item>
        <el-form-item label="父层级：" prop="parentCode">
          <!-- <el-input v-model="addData.parentCode" auto-complete="off"></el-input> -->
          <el-select v-model="addData.parentCode" placeholder="请选择父层级" :style="'width:100%'">
            <el-option v-for="(item,index) in tableData" :key="index" :label="item.categoryName" :value="item.categoryCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类图片：" prop="categoryImg">
          <uploadSingleImg :imgUrl="addData.categoryImg" :fileName="'addcategoryImg'" @uploadSuccess="uploadcategoryImg" @removeImg="removecategoryImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="addData.categoryImg"></el-input>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-select v-model.number="addData.isShow" :style="'width:100%'">
            <el-option label="是" :value="2"></el-option>
            <el-option label="否" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="queryModify" v-if="isEdit">确 定</el-button>
        <el-button size="small" type="primary" @click="queryAdd" v-else>确 定</el-button>
      </div>
    </el-dialog>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { formatDate } from '@/utils/date';
import javaRequest from '@/utils/javaApiRequest';
import uploadSingleImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      dialogFormVisible: false,
      addData: {
        categoryName: '',
        categoryLevel: '',
        parentCode: '',
        categorySort: 1,
        categoryImg: '',
        isShow: 2
      },
      rules: {
        categoryName: [{ required: true, validator: this.validNmae, trigger: 'blur' }],
        categoryLevel: [{ required: false, message: '请输入分类级别', trigger: 'blur' }],
        parentCode: [{ required: false, message: '请选择父层级', trigger: 'change' }],
        categorySort: [{ required: true, message: '请输入分类排序', trigger: 'blur' }, { type: 'number', message: '排序必须为数字值' }],
        categoryImg: [{ required: false, message: '请选择分类图片', trigger: 'change' }]
      },
      modifyFormVisible: false,
      isEdit: '',
      title: '',
      // 选择的记录
      selection: []
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 名称验证
    isvalidName(str) {
      const reg = /^[\u4e00-\u9fa5]{1,4}$/;
      return reg.test(str);
    },
    validNmae(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入分类名称'));
      } else if (!this.isvalidName(value)) {
        callback(new Error('请输入正确的分类名称'));
      } else {
        callback();
      }
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    getColumns() {
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'categoryName', title: '分类名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categoryCode', title: '商品分类code', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categoryImg', title: '分类图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categoryLevel', title: '分类级别', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categorySort', title: '分类排序', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'modifyDate', title: '修改时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isShow', title: '是否显示', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-class', isResize: true }
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
        if (item.field === 'categoryImg') {
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
        if (item.field === 'isShow') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 2) {
              return '<span style="color:green;">是</span>';
            } else if (value === 1) {
              return '<span style="color:red;">否</span>';
            }
          };
        }
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
    getTableData() {
      let _self = this;
      javaRequest.get('/mall_manage/back/category/getAsTree').then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.total = res.data.resultData.length;
          _self.tableData = res.data.resultData;
        }
      });
    },
    query() {
      this.getTableData();
    },
    // 上传新增图片
    uploadcategoryImg(data) {
      this.addData.categoryImg = data.url;
    },
    removecategoryImg() {
      this.addData.categoryImg = '';
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') {
        this.remove({ categoryCode: params.rowData.categoryCode });
      } else if (params.type === 'edit') {
        this.dialogFormVisible = true;
        this.isEdit = true;
        this.title = '修改分类';
        this.getDetail(params.rowData.categoryCode);
      }

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
    // 新增
    add() {
      this.dialogFormVisible = true;
      this.isEdit = false;
      this.title = '新增分类';
    },
    queryAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let _self = this;
          javaRequest.post('/mall_manage/back/category/addCategory', this.addData).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
            _self.query();
            _self.addClose();
          });
        } else {
          return false;
        }
      });
    },
    addClose() {
      this.addData = {
        categoryName: '',
        categoryLevel: '',
        parentCode: '',
        categorySort: 1,
        categoryImg: '',
        isShow: 2
      };
      this.$refs['ruleForm'].resetFields();
    },
    // 删除
    remove(categoryCode) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _self = this;
        javaRequest.post('/mall_manage/back/category/deleteCategoryByCode', categoryCode).then(res => {
          if (res.status === 200 && res.data.resultCode === '0') {
            _self.$message({
              message: res.data.msg,
              type: 'success'
            });
          }
          _self.query();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        let idList = [];
        for (let item of this.selection) {
          idList.push(item.categoryCode);
        }
        this.remove({ categoryCode: idList.join(',') });
      }
    },
    getDetail(code) {
      let _self = this;
      let param = {
        categoryCode: code
      };
      javaRequest.post('/mall_manage/back/category/getCategoryByCode', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.addData = res.data.resultData;
          _self.addData.categorySort = Number(_self.addData.categorySort);
        }
      });
    },
    queryModify() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let _self = this;
          javaRequest.post('/mall_manage/back/category/updateCategory', this.addData).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
            _self.addClose();
            _self.query();
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getTableData();
    window.previewImg = this.previewImg;
  }
};
</script>
<style lang="less" scoped>
.ification {
  padding-bottom:60px;
}
</style>
