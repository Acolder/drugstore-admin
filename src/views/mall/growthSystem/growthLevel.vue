<template>
  <div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addGrade">添加等级</el-button>
        <el-button type="default" size="small" icon="el-icon-success" @click="batchEnable">批量启用</el-button>
        <el-button type="default" size="small" icon="el-icon-error" @click="batchProhibit">批量禁用</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <!-- <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button> -->
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      selection: [],
      screenInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      status: '',
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 50, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'name', title: '成长等级', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'icon', title: '等级图标', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'level', title: '等级排序', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'title', title: '会员头衔', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'strategy_content', title: '成长锦囊', width: 600, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'status', title: '启用状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'icon') {
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
        if (item.field === 'level') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return Number(value) + '级';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'title') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'DaRen') {
              return '达人';
            } else {
              return '暂无头衔';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'Normal') {
              return '启用';
            } else {
              return '禁用';
            }
          };
        }
      }
      return columns;
    },
  },
  methods: {
    // 添加等级
    addGrade() {
      this.$router.push('/growthSystem/addLevel');
    },
    // 批量启用
    batchEnable() {
      this.status = 'Normal';
      if (this.selection.length > 0) {
        this.$confirm('此操作将启用选中的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id);
          }
          this.remove(idList);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else {
        this.$alert('请选择启用的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 批量禁用
    batchProhibit() {
      this.status = 'Disable';
      if (this.selection.length > 0) {
        this.$confirm('此操作将禁用选中的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id);
          }
          this.remove(idList);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else {
        this.$alert('请选择禁用的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 批量删除
    batchDelete() {
      this.status = 'Delete';
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id);
          }
          this.remove(idList);
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
    // 删除、禁用、启用
    remove(data) {
      let arr_id;
      if (Array.isArray(data)) {
        arr_id = data;
      } else {
        arr_id = [data.id];
      }
      let param = {
        status: this.status,
        id_array: arr_id,
      };
      ajax.post(`api/vip/status/update`, param).then(res => {
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
          this.status = 'Delete';
          this.remove(params.rowData);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.$router.push('/growthSystem/editLevel?id=' + params.rowData.id);
      }
    },
    // 获取列表
    getTable() {
      ajax.get(`api/vip/list`).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.data.length;
        }
      });
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
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
  },
  created() {
    this.getTable();
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
.table-wrapper{
  margin-bottom: 40px;
}
</style>
