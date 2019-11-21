<template>
  <div id="foodsWrap">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchData" size="small" >
        <el-form-item label="食材名称">
          <el-input v-model="searchData.name" placeholder="请输入食材名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :page-index="searchData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import uploadImg from '@/components/upload/uploadImg';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      searchData: {
        pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      foodDetailShow: false,
      detailData: {},
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 50, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 5, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'food_name', title: '食材名称', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'pic_url', title: '食材配图', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'food_property', title: '食材物性', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'food_effect', title: '食材功效', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'food_details', title: '食材详情', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'how_choose', title: '如何挑选', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 120, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true },
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
        if (item.field === 'pic_url') {
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
      }
      return columns;
    }
  },
  components: {
    'uploadImg': uploadImg,
  },
  methods: {
    clean() {
      this.searchData.name = '';
      this.getTable();
    },
    query() {
      this.searchData.pageIndex = 1;
      this.getTable();
    },
    customCompFunc(param) {
      if (param.type === 'querySelect') {
        parent.window.selectFoodList(param.rowData);
      }
    },
    // 获取列表
    getTable() {
      let _self = this;
      ajax.get(`/api/borrow/GetFoodManageInfo`, { params: _self.searchData }).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    pageChange(pageIndex) {
      this.searchData.pageIndex = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageIndex = 1;
      this.searchData.pageSize = pageSize;
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
    }
  },
  created() {
    this.getTable();
  }
};
</script>

<style lang="less" scoped>
.imgFood {
  width: 105px;
  height: 75px;
  border-radius: 3px;
}
.listCommon{
  width: 250%
}
</style>
