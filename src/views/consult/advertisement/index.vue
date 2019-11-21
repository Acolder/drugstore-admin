<template>
  <div class="indexBanner">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <!-- <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button> -->
        <el-button type="default" size="small" icon="el-icon-refresh" @click="getTableData">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import yilinAjax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      tableData: [],
      columns: this.getColumns(),
      searchInfo: {
        status: '',
        startTime: '',
        validTime: '',
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      selection: [],
      isLoding: true
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        // { field: 'categoryname', title: '广告名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'picurl', title: '广告图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderseq', title: '展示顺序', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isurl', title: '是否链接', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '广告状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'starttime', title: '开始时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'validtime', title: '结束时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'author', title: '作者', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 180, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-adverBanner', isResize: true }
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
        if (item.field === 'picurl') {
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
        if (item.field === 'isurl') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '内容';
            } else {
              return '链接';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green;">正常</span>';
            } else {
              return '<span style="color:red;">屏蔽</span>';
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete(params.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation 修改
        this.$router.push('/advertisement/editBanner?id=' + params.rowData.id);
      } else if (params.type === 'start') { // 启用
        let _self = this;
        let startInfo = {
          ID: params.rowData.id,
          Status: '0'
        };
        yilinAjax.post('/api/adsmanage/updatedocbannerstatus', startInfo).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            _self.$message({
              message: res.data.message,
              type: 'success'
            });
            _self.getTableData();
          }
        });
      } else if (params.type === 'disable') { // 禁用
        let _self = this;
        let startInfo = {
          ID: params.rowData.id,
          Status: '1'
        };
        yilinAjax.post('/api/adsmanage/updatedocbannerstatus', startInfo).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            _self.$message({
              message: res.data.message,
              type: 'success'
            });
            _self.getTableData();
          }
        });
      }
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
      this.searchInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = pageSize;
      this.getTableData();
    },
    // 增加
    add() {
      this.$router.push('/advertisement/addBanner');
    },
    // 删除
    delete(id) {
      let _self = this;
      let ids = {
        Id: id
      };
      yilinAjax.post('/api/adsmanage/deldocbanner', ids).then(res => {
        console.log(res);
        _self.$message({
          message: res.data.message,
          type: 'success'
        });
        _self.getTableData();
      });
    },
    // 批量删除
    // batchDelete() {
    //   console.log('删除');
    // },
    getTableData() {
      yilinAjax.get('/api/adsmanage/getdocbannerlist', {
        params: this.searchInfo
      }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.isLoding = false;
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>

</style>
