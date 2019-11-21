<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="咨询标题：">
          <el-input v-model="screenInfo.title" placeholder="请输入咨询标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="资讯分类:">
          <el-select v-model="screenInfo.category_id" placeholder="请选择" clearable>
            <el-option v-for="item in CategoryOptions" :key="item.category_id" :label="item.categoryname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="screenInfo.StatusFlag" placeholder="请选择" clearable >
              <el-option label="审核通过" :value=2></el-option>
              <el-option label="待审核" :value=1></el-option>
              <el-option label="未编辑" :value=0></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="资讯类型:">
          <el-select v-model="screenInfo.NewsType" placeholder="请选择">
            <el-option label="全部" :value=0></el-option>
            <el-option label="图文" :value=1></el-option>
            <el-option label="视频" :value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容:">
          <el-input v-model="screenInfo.Content" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" @on-custom-comp="customCompFunc" row-click-color="#edf7ff"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>
.strong{
  font-weight: bold;
  width: 70px;
  float: left;
}
.details{
  margin-top: -5vh;
}
.title{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 290px;
  float: left;
}
.addfilter{
  margin-top: -10vh;
  .addnews{
    width: 100%;
    height: 1000px;;
  }
}
</style>
<script>
import { mapGetters } from 'vuex';
// import { formatDate } from '@/utils/date';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      CategoryOptions: [], // 分类
      // 选择的记录
      selection: [],
      screenInfo: {
        title: '',
        StatusFlag: '',
        category_id: '',
        pageIndex: 1,
        pageSize: 10,
        NewsType: 0,
        Content: '',
      },
      sidebarValue: this.sidebarStatus,
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ])
  },
  methods: {
    previewImg(url) { // 自定义弹窗
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'categoryname', title: '资讯分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '资讯标题', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'mainimage', title: '资讯图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sourcename', title: '来源名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'readingquantity', title: '阅读量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'statusflag', title: '是否审核', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'auditname', title: '审核人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'releasetime', title: '发布时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true }
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
        if (item.field === 'mainimage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let pic =  value.split(',');
              return `<a href="javascript:previewImg('${pic[0]}');"><img src="${pic[0]}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'statusflag') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '未编辑';
            } else if (value === 1) {
              return '待审核';
            } else if (value === 2) {
              return '审核通过';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 获取资讯列表
    getTableData() {
      let _self = this;
      ajax.post('/api/admin/getNewsList', _self.screenInfo).then((res) => {
        // console.log(res.data);
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
        }
      });
    },
    // 分类查询
    getClassify() {
      let param = {
        PageIndex: '1',
        PageSize: '50',
        CategoryName: ''
      };
      ajax.post(`/api/news/GetNewsCategoryListByPage`, param).then(res => {
        // console.log(res.data);
        if (res.status === 200 && res.data.code === 0) {
          let CategoryData = res.data.data.map(function (item, index, data) {
            return item;
          });
          this.CategoryOptions = CategoryData;
        }
      });
    },
    // 查询
    queryByNews() {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = 10;
      this.getTableData();
    },
    // 更新
    query() {
      this.getTableData();
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'querySelect') { // do delete operation
        parent.window.selectNewList(params.rowData);
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
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
    // 清除查询框中的内容
    clean() {
      this.screenInfo.title = '';
      this.screenInfo.StatusFlag = '';
      this.screenInfo.category_id = '';
      this.getTableData();
    },
  },
  created() {
    this.getTableData();
    this.getClassify();
  }
};
</script>
