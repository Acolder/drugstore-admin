<template>
  <div class="indexBanner">
    <el-form :inline="true" :model="searchInfo" size="small" style="margin-left: 10px;" >
      <el-form-item label="版本号：">
        <el-input v-model="searchInfo.Version" placeholder="请输入版本号（例：v1.0）" clearable></el-input>
      </el-form-item>
      <el-form-item label="广告类型：">
        <el-select v-model="searchInfo.AdvertinsingType" placeholder="请选择" class="select-list">
          <el-option label="全部" :value="92"></el-option>
          <el-option label="启动页广告" :value="7"></el-option>
          <el-option label="首页广告" :value="11"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
        <el-button type="primary" @click="getTableData" icon="el-icon-search">查 询</el-button>
      </el-form-item>
    </el-form>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="getTableData">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 查看广告详情 -->
    <el-dialog title="查看广告详情" center :visible.sync="detailShow" :append-to-body="true" @close="closeDetail" width="900px">
      <el-row>
        <el-col :span="8">
          <el-col :span="8" style="text-align:right">广告名称：</el-col>
          <el-col :span="16">{{detailData.title}}</el-col>
        </el-col>
        <el-col :span="4">
          <el-col :span="12" style="text-align:right">广告分类：</el-col>
          <el-col :span="12">{{detailData.category === '1' ? 'url' : '商品'}}</el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6" style="text-align:right">广告ID：</el-col>
          <el-col :span="18">{{detailData.id}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="8">
          <el-col :span="8" style="text-align:right">广告图片：</el-col>
          <el-col :span="10"><img :src="detailData.picturepath" alt="" style="width:60px;height:30px"></el-col>
        </el-col>
        <el-col :span="4">
          <el-col :span="12" style="text-align:right">广告排序：</el-col>
          <el-col :span="12">{{detailData.sort}}</el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6" style="text-align:right">创建时间：</el-col>
          <el-col :span="18">{{detailData.createtime}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
          <el-col :span="8">
            <el-col :span="8" style="text-align:right">展示时间：</el-col>
            <el-col :span="16">{{detailData.displaytime}}</el-col>
          </el-col>
          <el-col :span="4">
            <el-col :span="12" style="text-align:right">广告版本：</el-col>
            <el-col :span="12">{{detailData.version}}</el-col>
          </el-col>
          <el-col :span="12" v-show="detailData.category === '1' || detailData.category === '7'">
            <el-col :span="6" style="text-align:right">链接地址：</el-col>
            <el-col :span="18">{{detailData.pictureurl}}</el-col>
          </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="8">
          <el-col :span="8" style="text-align:right">到期时间：</el-col>
          <el-col :span="16">{{detailData.displaydate}}</el-col>
        </el-col>
        <el-col :span="4">
          <el-col :span="12" style="text-align:right">是否显示：</el-col>
          <el-col :span="12">{{detailData.sendmessage === 0 ? '否' : '是'}}</el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6" style="text-align:right">发布时间：</el-col>
          <el-col :span="16">{{detailData.publishdate}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px" v-if="detailData.category === '2'">
        <el-col :span="24">
          <el-col :span="8" style="text-align:right">
            <el-col :span="8">商品信息：</el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px" v-if="detailData.category === '2'">
        <el-col :span="24">
          <ul class="mall-list">
            <li>商品ID</li>
            <li>商品图片</li>
            <li>商品名称</li>
            <li>市场价</li>
          </ul>
          <ul class="mall-list">
            <li>{{detailData.product.productid}}</li>
            <li><img :src="detailData.product.productmainimage" alt="" style="width:60px;height:30px"></li>
            <li>{{detailData.product.productname}}</li>
            <li>{{detailData.product.productmarkprice}}</li>
          </ul>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      tableData: [],
      columns: this.getColumns(),
      searchInfo: {
        AdvertinsingType: 7, // 92-全部广告 7-启动页广告 11-首页广告
        Version: '', // 版本号
        pageIndex: 1,
        pageSize: 10
      },
      detailShow: false,
      detailData: '',
      total: 0,
      selection: []
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
        { field: 'title', title: '广告名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'bannercategory', title: '广告类型', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '排序', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'category', title: '类别', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'displaytime', title: '显示时间(s)', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sendmessage', title: '是否推送', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'picturepath', title: '广告图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'version', title: '版本号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 180, titleAlign: 'center', columnAlign: 'center', componentName: 'adverIndex', isResize: true }
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
        if (item.field === 'picturepath') {
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
        if (item.field === 'category') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '2') {
              return '商品';
            } else {
              return 'URL';
            }
          };
        }
        if (item.field === 'bannercategory') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 7) {
              return '启动页广告';
            } else if (value === 11) {
              return '首页广告';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'sendmessage') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '否';
            } else if (value === 1) {
              return '是';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value1 = new Date(rowData['displaydate'].replace(/-/g, '/')); // 过期时间
            let value = new Date();
            if (value > value1) {
              return '已过期';
            } else if (value < value1) {
              return '正常';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(params) {
      if (params.type === 'deleta') { // do delete operation
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete([params.rowData.id]);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation 修改
        this.$router.push('/advertisements/edit?id=' + params.rowData.id);
      } else if (params.type === 'detail') { // 查看详情
        this.detailShow = true;
        this.getDeail(params.rowData.id);
      }
    },
    // 关闭详情弹窗
    closeDetail() {
      this.detailData = '';
    },
    // 获取详情
    getDeail(id) {
      let _self = this;
      ajax.get('/api/admin/getHomeBannerDetail/' + id).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.detailData = res.data.data;
        }
      });
    },
    clean() {
      this.searchInfo.Version = '';
      this.searchInfo.AdvertinsingType = 92;
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = 10;
      this.getTableData();
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
      this.$router.push('/advertisements/add');
    },
    // 删除
    delete(id) {
      let _self = this;
      let ids = id;
      ajax.post('/api/admin/deleteAdvertisement', ids).then(res => {
        console.log(res);
        _self.$message({
          message: res.data.message,
          type: 'success'
        });
        _self.getTableData();
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.selection.map(res => {
            return res.id;
          });
          this.delete(ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          type: 'warning',
          message: '还没有选择任何商品'
        });
      }
    },
    getTableData() {
      let _self = this;
      ajax.post('/api/admin/GetBannerList', _self.searchInfo).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
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

<style lang="less" scoped>
.mall-list{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #cacaca;
  border-right: none;
  &:nth-child(2){
    border-top: none;
  }
  li{
    width: 25%;
    text-align: center;
    line-height: 40px;
    border-right: 1px solid #cacaca;
    img{
      margin-top: 5px;
    }
  }
}
</style>
