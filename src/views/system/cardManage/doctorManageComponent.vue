<template>
  <div id="cardList">
    <div class="toolbar-wrapper">
      <el-button-group>
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
        type: 2,
        content: '',
        pageIndex: 1,
        pageSize: 10
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
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'role_type_name', title: '用户昵称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'mobile', title: '用户手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
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
    query() {
      this.getTable();
    },
    cancel() {
      this.formData.mobile = '';
      this.formData.doctor_description = '';
      this.doctorShow = false;
    },
    customCompFunc(params) {
      parent.window.doctorList(params.rowData);
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
    text-overflow:ellipsis; //文本溢出显示省略号
    white-space:nowrap; //文本不会换行（单行文本溢出）
    width:280px;
    position: relative;
    .detailTitle{
      position: absolute;
      top: 0px;
      right: 0px;
      cursor: pointer;
    }
  }
  .form-button-wrapper{
    text-align: center;
    margin-left: -100px;
  }
</style>
