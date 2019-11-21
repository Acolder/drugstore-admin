<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="资讯标题：">
          <el-input v-model="screenInfo.Title" placeholder="请输入资讯标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="screenInfo.StatusFlag" placeholder="请选择" clearable >
            <el-option label="审核通过" :value=2></el-option>
            <el-option label="待审核" :value=1></el-option>
            <el-option label="未编辑" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资讯分类:">
          <el-select v-model="screenInfo.category_id" placeholder="请选择" clearable>
            <el-option v-for="item in CategoryOptions" :key="item.category_id" :label="item.categoryname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资讯类型:">
          <el-select v-model="screenInfo.NewsType" placeholder="请选择">
            <el-option label="全部" :value=0></el-option>
            <el-option label="图文" :value=1></el-option>
            <el-option label="视频" :value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.PageSize" :page-index="screenInfo.PageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <div class="search-wrapper" style="text-align:center;margin-bottom:15px;">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="Determine">确定</el-button>
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
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      CategoryOptions: [], // 分类
      columns: this.getColumns(),
      dialogFormVisible: false,
      rules: {
        categoryName: [{ required: true, message: '请输入商品分类名称', trigger: 'blur' }],
        categoryLevel: [{ required: true, message: '请输入分类级别', trigger: 'blur' }],
        parentCode: [{ required: true, message: '请输入目录层级', trigger: 'blur' }],
        categoryCode: [{ required: true, message: '请输入分类code', trigger: 'blur' }]
      },
      // 选择的记录
      selection: [],
      proudctNum: '',
      limit: this.$route.query.limit,
      screenInfo: {
        Title: '',
        StatusFlag: '',
        PageIndex: 1,
        PageSize: 10,
        ShowType: '',
        category_id: '',
        NewsType: 0,
        Content: '',
      },
      newsDetail: false,
      detailData: {},
      modifyData: [],
      modifyID: ''
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
    'screenInfo.StatusFlag': function() {
      if (this.screenInfo.StatusFlag.value === 2) {
        this.screenInfo.StatusFlag.label = '核审通过';
      }
      if (this.screenInfo.StatusFlag.value === 1) {
        this.screenInfo.StatusFlag.label = '待核审';
      }
      if (this.screenInfo.StatusFlag.value === 0) {
        this.screenInfo.StatusFlag.label = '未编辑';
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 清除查询框中的内容
    clean() {
      this.screenInfo.PageIndex = 1;
      this.screenInfo.Title = '';
      this.screenInfo.StatusFlag = '';
      this.screenInfo.category_id = '';
      this.screenInfo.PageIndex = 1;
      this.screenInfo.NewsType = 0;
      this.screenInfo.Content = '';
      this.getTableData();
    },
    // 查询
    queryByNews() {
      this.screenInfo.PageIndex = 1;
      this.screenInfo.PageSize = 10;
      this.getTableData();
    },
    // 更新
    query() {
      this.clean();
    },
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
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * _self.screenInfo.PageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'categoryname', title: '资讯分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '资讯标题', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'mainimage', title: '资讯图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sourcename', title: '来源名称', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'readingquantity', title: '阅读量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'statusflag', title: '是否审核', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'auditname', title: '审核人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'audittimestr', title: '审核时间', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'releasetime', title: '发布时间', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
              let down = '未编辑';
              return '<span style="color: red;">' + down + '</span>';
            } else if (value === 1) {
              let wait = '待审核';
              return '<span style="color: orange;">' + wait + '</span>';
            } else if (value === 2) {
              let up = '核审通过';
              return '<span style="color: green;">' + up + '</span>';
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
        if (res.status === 200 && res.data.code === 0) {
          let CategoryData = res.data.data.map(function (item, index, data) {
            return item;
          });
          this.CategoryOptions = CategoryData;
        }
      });
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
      if (selection.length > this.limit) {
        this.$message({
          message: '只能选' + this.limit + '个',
          type: 'error'
        });
        this.proudctNum = false;
      } else {
        this.selection = selection;
        this.proudctNum = true;
      }
    },
    selectChange(selection, rowData) {
      if (selection.length > this.limit) {
        this.$message({
          message: '只能选' + this.limit + '个',
          type: 'error'
        });
        this.proudctNum = false;
      } else {
        this.selection = selection;
        this.proudctNum = true;
      }
    },
    selectGroupChange(selection) {
      if (selection.length > this.limit) {
        this.$message({
          message: '只能选' + this.limit + '个',
          type: 'error'
        });
        this.proudctNum = false;
      } else {
        this.selection = selection;
        this.proudctNum = true;
      }
    },
    cancel() {
      parent.window.selectNewList(false);
    },
    Determine() {
      parent.window.selectNewList(this.selection, this.proudctNum);
    },
  },
  created() {
    this.getTableData();
    this.getClassify();
    window.previewImg = this.previewImg;
    if (this.$route.query.pageIndex) {
      this.screenInfo.PageIndex = Number(this.$route.query.pageIndex);
    }
    if (this.$route.query.Title) {
      this.screenInfo.Title = this.$route.query.Title;
    }
    if (this.$route.query.StatusFlag === 0) {
      this.screenInfo.StatusFlag = 0;
    }
    else if (this.$route.query.StatusFlag) {
      this.screenInfo.StatusFlag = this.$route.query.StatusFlag;
    }
    if (this.$route.query.category_id) {
      this.screenInfo.category_id = this.$route.query.category_id;
    }
  }
};
</script>
