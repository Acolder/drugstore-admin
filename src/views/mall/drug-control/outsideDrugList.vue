<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="requestData.productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" prop="shengChanQiYe">
          <el-input v-model="requestData.shengChanQiYe" placeholder="生产厂商"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="requestData.category" placeholder="分类"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="requestData.source" placeholder="来源"></el-input>
        </el-form-item>
        <el-form-item label="来源URL" prop="sourceurl">
          <el-input v-model="requestData.sourceurl" placeholder="来源URL"></el-input>
        </el-form-item>
        <el-form-item label="标准规格" prop="guiGe">
          <el-input v-model="requestData.guiGe" placeholder="标准规格"></el-input>
        </el-form-item>
        <el-form-item label="批准文号" prop="piZhunWenHao">
          <el-input v-model="requestData.piZhunWenHao" placeholder="批准文号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="seach" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper" v-show="false">
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      category: [],
      sidebarValue: this.sidebarStatus,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      requestData: {
        // 药品名称
        productName: '',
        // 分类
        category: '',
        // 规格
        guiGe: '',
        // 批准文号
        piZhunWenHao: '',
        // 来源
        source: '',
        // 来源网站
        sourceurl: '',
        // 生产厂商
        shengChanQiYe: ''
      }
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ])
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productname', title: '商品名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mainimg', title: '商品图片', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'category', title: '分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'shengchanqiye', title: '生产厂商', width: 200, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'jixing', title: '剂型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'price', title: '商品市场价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'guige', title: '标准规格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'pizhunwenhao', title: '批注文号', width: 100, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'source', title: '来源', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sourceurl', title: '来源URL', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-selectRow', isResize: true }
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
        if (item.field === 'mainimg') {
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
        if (item.field === 'categoryCode') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let c = _self.category.find((x) => x.categoryCode === value.toString());
              if (c) {
                return c.categoryName;
              } else {
                return value;
              }
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    getDataList() {
      let _self = this;
      _self.requestData.pageNum = this.pageIndex;
      _self.requestData.pageSize = this.pageSize;
      ajax.get(`/api/admin/getDrugsDataList`, {
        params: _self.requestData
      }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
        }
      });
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    seach() {
      this.pageIndex = 1;
      this.getDataList();
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      this.seach();
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getDataList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getDataList();
    },
    sortChange(params) {

      if (params.height.length > 0) {

        this.tableConfig.tableData.sort(function (a, b) {

          if (params.height === 'asc') {

            return a.height - b.height;
          } else if (params.height === 'desc') {

            return b.height - a.height;
          } else {
            return 0;
          }
        });
      }
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'selectRow') {
        parent.window.setDrugInfoFromDialogList(params.rowData);
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
    }
  },
  created() {
    this.getDataList();
    window.previewImg = this.previewImg;
  }
};
</script>