<template>
  <div id="storeManageWrap">
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="storeData.pageSize" :page-index="storeData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import java from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      storeData: {
        sellerName: '',
        pageIndex: 1,
        pageSize: 10,
      }
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerUserId', title: '门店编号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sellerName', title: '门店名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sellerAddress', title: '门店地址', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '交通描述', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '门店电话', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
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
    }
  },
  methods: {
    gettableData() {
      let _self = this;
      let param = _self.storeData;
      java.post(`/mall_manage/back/querySellerList`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    pageChange(pageIndex) {
      this.storeData.pageIndex = pageIndex;
      this.gettableData();
    },
    pageSizeChange(pageSize) {
      this.storeData.pageIndex = 1;
      this.storeData.pageSize = pageSize;
      this.gettableData();
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
    this.gettableData();
  }
};
</script>

<style lang="less" scoped>

</style>
