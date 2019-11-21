<template>
  <div class="Viscera">
      <div class="table-wrapper">
        <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="getColunms" :table-data="tableData" row-hover-color="#eee"
          row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
        </v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.PageSize" :page-index="screenInfo.PageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
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
      tableData: [],
      selection: [],
      screenInfo: {
        PageIndex: 1,
        PageSize: 10,
        type: 2,
      },
      index: ''
    };
  },
  computed: {
    // 列表
    getColunms() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 40, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'name', title: '脏腑辩证', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'symptom', title: '表现症状', width: 250, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product', title: '推荐中成药', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'soup', title: '推荐汤品', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'life', title: '推荐滋补品', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'prescriptions', title: '推荐方剂', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true }
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
        if (item.field === 'soup' || item.field === 'life') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let soupName = value.map(function(item, index, data) {
                return item.product_name;
              });
              let soupNameStr = soupName.join(' , ');
              return soupNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'product') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let productName = value.map(function(item, index, data) {
                return item.product_name;
              });
              let productNameStr = productName.join(' , ');
              return productNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'life') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let productName = value.map(function(item, index, data) {
                return item.product_name;
              });
              let repairNameStr = productName.join(' , ');
              return repairNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'prescriptions') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let readtName = value.map(function(item, index, data) {
                return item.name;
              });
              let readtNameStr = readtName.join(' , ');
              return readtNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'physiotherapy') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let motionName = value.map(function(item, index, data) {
                return item.programme;
              });
              let motionNameStr = motionName.join(' , ');
              return motionNameStr;
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
  },
  methods: {
    // 列表
    getTableData() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.post(`/api/jinmu/GetContentDescribePageList`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.data.rcounr;
          _self.tableData = res.data.data.details;
        }
      });
    },
    customCompFunc(params) {
      if (params.type === 'querySelect') {  // 删除
        parent.window.zfList(params.rowData);
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.screenInfo.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.PageIndex = 1;
      this.screenInfo.PageSize = pageSize;
      this.getTableData();
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
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.strong{
  width: 85px;
  text-align: left;
  font-weight: bold;
  margin-right: 20px;
  float: left;
}
.fangji{
  margin-left: 25px;
  width: 60px;
}
.common{
  float: left;
}
.commonH{
  height: 25px;
  line-height: 25px;
}
.form-button-wrapper {
  text-align: center;
  margin: 20px 0 20px -38px;
}
.addRoles{
  width: 500px;
  margin: 0 auto;
  // display: flex;
}
.import{
  // float: left;
  margin: 0 0 0 50px;
}
</style>
