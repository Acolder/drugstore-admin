<template>
  <div id="specialProduct">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="专题名称">
          <el-input class="el-input" v-model.trim="searchInfo.specialName" placeholder="请输入专题名称" clearable ></el-input>
        </el-form-item>
        <el-form-item label="是否显示:">
          <el-select v-model="searchInfo.isDisplay" placeholder="请选择" clearable >
            <el-option label="否" value="否"></el-option>
            <el-option label="是" value="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 空</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
        <el-button-group>
          <el-button type="default" size="small" @click="add" icon="el-icon-plus">添加</el-button>
          <el-button type="default" size="small" @click="Delete" icon="el-icon-delete">批量删除</el-button>
          <el-button type="default" size="small" @click="refresh" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize"
      :page-index="searchInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 专题弹窗 -->
    <el-dialog :title=title :visible.sync="specialShow" :modal-append-to-body="false" :append-to-body="true" width="500px" center @close="cancelSpecial">
      <el-form ref="addData" :model="addForm" :rules="addRules" :inline="true" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="专题名称:"  prop="specialName" class="line">
              <el-input class="el-input" v-model.trim="addForm.specialName" clearable ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否显示:" prop="isDisplay">
              <el-select v-model="addForm.isDisplay" placeholder="请选择" clearable >
                <el-option label="否" value="否"></el-option>
                <el-option label="是" value="是"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="展示序号:" prop="serialNumber">
              <el-input v-model.number="addForm.serialNumber" placeholder="请输入封面排序" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="footerWrapper">
          <el-button @click="cancelSpecial" icon="el-icon-circle-close-outline" size="small">取消</el-button>
          <el-button @click="saveSpecial" type="primary" icon="el-icon-check" size="small">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/javaApiRequest';
import uploadImg from '@/components/upload/uploadImg';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
export default {
  data() {
    // 排序
    let validateSort = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内，大于0的正整数'));
        }
      } else {
        // callback();
        return callback(new Error('请输入10位数以内，大于0的正整数'));
      }
    };
    return {
      title: '',
      total: 0,
      selection: [],
      tableData: [],
      searchInfo: {
        specialName: '',
        isDisplay: '',
        specialType: 1,
        pageSize: 10,
        pageNum: 1,
        orderBy: 'asc',
      },
      specialShow: false,
      addForm: {
        specialName: '',
        specialImg: '',
        serialNumber: '',
        isDisplay: '',
        specialType: 1,
      },
      addRules: {
        serialNumber: [{ required: true, validator: validateSort, trigger: 'blur' }],
        specialName: [{ required: true, message: '请输入专题名称', trigger: 'change' }],
        isDisplay: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
      }
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'specialName', title: '专题名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'serialNumber', title: '展示序号', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isDisplay', title: '是否显示', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-productSpecial', isResize: true }
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
            if (value) {
              return formatDate(value);
            } else {
              return '';
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ]),
  },
  components: {
    'uploadImg': uploadImg,
  },
  methods: {
    // 清空查询
    clean() {
      this.searchInfo.specialName = '';
      this.searchInfo.isDisplay = '';
      this.getTable();
    },
    // 查询
    query() {
      this.searchInfo.pageNum = 1;
      this.getTable();
    },
    // 添加
    add() {
      this.specialShow = true;
      this.title = '添加专题';
    },
    // 刷新
    refresh() {
      this.query();
    },
    remove(data) {
      let param = {
        specialId: data,
      };
      ajax.post(`mall_manage/back/kmSpecial/delKmSpecial`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getTable();
        }
      });
    },
    // 批量删除
    Delete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.specialId.toString());
          }
          let str = idList.join(',');
          this.remove(str);
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
    // 操作
    customCompFunc(params) {
      let _self = this;
      if (params.type === 'edit') { // 修改
        _self.specialShow = true;
        _self.title = '修改专题';
        let temData = JSON.stringify(params.rowData);
        _self.addForm = JSON.parse(temData);
      }
      else if (params.type === 'delete') { //  删除
        _self.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = params.rowData.specialId;
          _self.remove(Ids);
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      else if (params.type === 'manage') {   // 商品管理
        _self.$router.push('/drug-control/KS_productManage?id=' + params.rowData.specialId);
      }
    },
    // 取消专题
    cancelSpecial() {
      this.specialShow = false;
      this.$refs['addData'].resetFields();
      this.addForm.isDisplay = '';
    },
    // 提交专题
    saveSpecial() {
      let _self = this;
      let param = this.addForm;
      _self.$refs['addData'].validate((valid) => {
        let url;
        if (valid) {
          if (this.title === '添加专题') {
            let arr_name = this.tableData.map(function(item, index, data) {
              return item.specialName;
            });
            if (arr_name.indexOf(this.addForm.specialName) === -1) {
              url = 'mall_manage/back/kmSpecial/addKmSpecial';
            } else {
              this.$message({
                type: 'warning',
                message: '专题列表已有该专题名称，请重新输入'
              });
            }
          } else {
            url = 'mall_manage/back/kmSpecial/updateKmSpecial';
          }
          ajax.post(url, param).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getTable();
              this.cancelSpecial();
            }
          });
        }
        else {
          return false;
        }
      });
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
    // 分页
    pageChange(pageIndex) {
      this.searchInfo.pageNum = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageNum = 1;
      this.searchInfo.PageSize = pageSize;
      this.getTable();
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.searchInfo;
      ajax.post(`mall_manage/back/kmSpecial/queryKmSpecial`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
  },
  created() {
    this.getTable();
  }
};
</script>

<style lang="less" scoped>
.footerWrapper{
  display: block;
  text-align: center;
}
</style>
