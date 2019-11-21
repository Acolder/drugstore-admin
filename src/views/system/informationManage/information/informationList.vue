<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="资讯标题：">
          <el-input v-model="screenInfo.title" placeholder="请输入资讯标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="screenInfo.statusFlag" placeholder="请选择" clearable >
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
          <el-select v-model="screenInfo.newsType" placeholder="请选择">
            <el-option label="全部" :value=0></el-option>
            <el-option label="图文" :value=1></el-option>
            <el-option label="视频" :value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示方式:">
          <el-select v-model="screenInfo.showType" placeholder="请选择">
            <el-option label="无图" :value=0></el-option>
            <el-option label="左边展示" :value=1></el-option>
            <el-option label="右边展示" :value=2></el-option>
            <el-option label="中间展示大图" :value=3></el-option>
            <el-option label="文字图片" :value=4></el-option>
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
        <el-button type="default" size="small" icon="el-icon-plus" @click="addNews">新增资讯</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <!-- 查看详情 -->
    <el-dialog title="资讯详情" :visible.sync="newsDetail" width="60%" :center="true" :modal-append-to-body="false" :append-to-body="true" class="details">
      <el-form ref="detailData" id="addNews">
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">资讯标题：</span><i class="title">{{detailData.title}}</i></div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">资讯分类：</span>{{detailData.categoryname}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">来源名称：</span>{{detailData.sourcename}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">阅读量：</span>{{detailData.readingquantity}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">排序：</span>{{detailData.sort}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">发布时间：</span>{{detailData.releasetime}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">是否置顶：</span>{{detailData.istop == 1 ? '是' : '否'}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">是否原创：</span>{{detailData.iscopyright == 1 ? '是' : '否'}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">是否审核：</span>{{detailData.statusflag == 0 ? '未编辑' : detailData.statusflag == 1 ? '待审核' : '审核通过'}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">是否推送：</span>{{detailData.sendmessage == 1 ? '是' : '否'}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">摘要：</span>{{detailData.abstract}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">审核时间：</span>{{detailData.audittimestr}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">资讯内容：</span><div v-html="detailData.body"></div></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品推荐" >
              <v-table ref="pro_Data" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="productColumns"
              :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="getColumns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { formatDate } from '@/utils/date';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      CategoryOptions: [], // 分类
      dialogFormVisible: false,
      rules: {
        categoryName: [{ required: true, message: '请输入商品分类名称', trigger: 'blur' }],
        categoryLevel: [{ required: true, message: '请输入分类级别', trigger: 'blur' }],
        parentCode: [{ required: true, message: '请输入目录层级', trigger: 'blur' }],
        categoryCode: [{ required: true, message: '请输入分类code', trigger: 'blur' }]
      },
      // 选择的记录
      selection: [],
      screenInfo: {
        title: '',
        statusFlag: '',
        pageIndex: 1,
        pageSize: 10,
        showType: '',
        category_id: '',
        newsType: 0,
        content: '',
        version: 'v2.0',
      },
      newsDetail: false,
      detailData: {},
      modifyData: [],
      modifyID: '',
      productData: []
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
    ]),
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'categoryname', title: '资讯分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '资讯标题', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'mainimage', title: '资讯图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sourcename', title: '来源名称', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'readingquantity', title: '阅读量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'statusflag', title: '是否审核', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'auditname', title: '审核人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'audittimestr', title: '审核时间', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'releasetime', title: '发布时间', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 300, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-informationList', isResize: true }
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
    // 商品Columns
    productColumns() {
      let columns = [
        { field: 'product_id', title: '商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_name', title: '商品名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'categoryname', title: '商品分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_main_image', title: '商品图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_markprice', title: '价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'newsinfo-product-operations', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'product_main_image') {
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
        if (item.field === 'product_markprice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '<span style="color: red">' + value + '</span>';
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
    // 自定义弹窗
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    // 清除查询框中的内容
    clean() {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.title = '';
      this.screenInfo.statusFlag = '';
      this.screenInfo.showType = 0;
      this.screenInfo.category_id = '';
      this.screenInfo.pageIndex = 1;
      this.screenInfo.newsType = 0;
      this.screenInfo.content = '';
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
      this.getTableData();
    },
    // 获取资讯列表
    getTableData() {
      let _self = this;
      ajax.post('/api/v2/news/list', _self.screenInfo).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
        }
      });
    },
    // 删除
    remove(Ids) {
      let _self = this;
      ajax.post('/api/v2/news/delete', Ids).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        _self.query();
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该资讯, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id.toString());
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
    // 核审资讯
    release(Ids) {
      let _self = this;
      ajax.post(`/api/v2/news/audit`, Ids).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        _self.query();
      });
    },
    // 获取资讯详情
    getDetail(id) {
      let _self = this;
      ajax.get(`/api/v2/news/detail/` + id).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          _self.detailData = res.data.data;
          _self.productData = _self.detailData.productlist;
        }
      });
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') {  // 删除
        this.$confirm('此操作将永久删除该资讯, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove([params.rowData.id.toString()]);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.modifynews = true;
        let queryData = {
          id: params.rowData.id,
          pageIndex: this.screenInfo.PageIndex,
          pageSize: this.screenInfo.PageSize,
          Title: this.screenInfo.Title,
          StatusFlag: this.screenInfo.StatusFlag,
          category_id: this.screenInfo.category_id,
        };
        this.$router.push({
          path: '/informationManage/information/editInformation',
          query: queryData,
        });
      } else if (params.type === 'seeDetail') {  // 查看详情
        this.newsDetail = true;
        this.getDetail(params.rowData.id);
      } else if (params.type === 'release') { // 核审
        if (params.rowData.statusflag === 0 || params.rowData.statusflag === 1) {
          this.$confirm('是否上架: ( ' + params.rowData.title + '  ) 这条资讯?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.release([params.rowData.id.toString()]);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '该资讯已上架'
          });
        }
      } else if (params.type === 'down') {
        if (params.rowData.statusflag === 2) {
          this.$confirm('是否下架: ( ' + params.rowData.title + '  ) 这条资讯?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.downNews([params.rowData.id.toString()]);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '该资讯已下架'
          });
        }
      }
    },
    downNews(Ids) {
      let _self = this;
      ajax.post(`/api/v2/news/cancelAudit`, Ids).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        _self.query();
      });
    },
    // 修改成功后弹框消失，更新界面
    modifNewsProps(modifynews) {
      if (!modifynews) {
        this.modifynews = false;
        this.getTableData();
      }
    },
    // 新增
    addNews() {
      this.$router.push({
        path: '/informationManage/information/addInformation',
        query: {
          pageIndex: this.screenInfo.pageIndex,
          pageSize: this.screenInfo.pageSize,
          Title: this.screenInfo.title,
          StatusFlag: this.screenInfo.statusFlag,
          category_id: this.screenInfo.category_id,
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
  // float: left;
}
.addfilter{
  margin-top: -10vh;
  .addnews{
    width: 100%;
    height: 1000px;;
  }
}
</style>
