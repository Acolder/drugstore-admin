<template>
  <div id="special-warp">
    <div class="filter">
      <el-form :inline="true" :model="recommendData" size="small" style="margin-left: 10px;">
        <el-form-item label="版本号：">
          <el-input v-model.trim="recommendData.Version" placeholder="请输入版本号（例：v1.0）" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="getTableData" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
      <div class="toolbar-wrapper">
        <el-button-group>
          <el-button type="default" size="small" @click="addGoods" icon="el-icon-plus">添加推荐</el-button>
          <el-button type="default" size="small" @click="Delete" icon="el-icon-delete">批量删除</el-button>
          <el-button type="default" size="small" @click="query" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </div>
      <div class="table-wrapper">
        <v-table ref="data_table" is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
        @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
        </v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="recommendData.PageSize"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
      <el-dialog title="信息详情" :visible.sync="dialogVisible" width="50%" :modal-append-to-body='false' :append-to-body='true' class="goodsDetail">
        <div class="box">
          <span class="strong">ID：</span>{{goodsDetail.id}}</div>
        <div class="box">
          <span class="strong">排序：</span>{{goodsDetail.sort}}</div>
        <div class="box pic-box">
          <span class="strong pic-adress">图 片：</span>
          <img :src="goodsDetail.picturepath" alt="" style="width:600px;height:350px;">
        </div>
        <div class="good-list-box">
          <span class="strong">推荐商品：</span>
          <v-table ref="data_table" is-horizontal-resize style="width:100%" :columns="columnsProduct" :table-data="goodsDetail.products" row-hover-color="#eee" row-click-color="#edf7ff">
          </v-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      recommendData: {
        AdvertinsingType: 4,
        PageIndex: 1,
        PageSize: 10,
        Version: ''
      },
      tableData: [],
      selection: [],
      total: 0,
      dialogVisible: false,
      goodsDetail: [],
      goodsDetailList: [],
      detail: false
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.recommendData.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '标题', width: 10, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'picturepath', title: '图片地址', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'version', title: '版本号', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 50, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-swiper', isResize: true }
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
        if (item.field === 'categoryname') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'URL') {
              return 'url';
            }
            if (value === 'Product') {
              return '商品';
            }
          };
        }
        if (item.field === 'picturepath') {  // 图片预览
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="100px" height="38px" style="margin-top:1px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="100px" height="38px" style="margin-top:1px;"/></a>`;
            }
          };
        }
      }
      return columns;
    },
    columnsProduct() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.recommendData.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productid', title: '商品ID', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productname', title: '商品名', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productmainimage', title: '商品图片', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productmarkprice', title: '商品价格', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'productmainimage') {  // 图片预览
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="100px" height="38px" style="margin-top:1px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="100px" height="38px" style="margin-top:1px;"/></a>`;
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ]),
  },
  methods: {
    previewImg(url) { // 预览图片
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    addGoods() {  // 跳转至添加为你推荐
      this.$router.push('/manage/addRecommend');
    },
    // 添加、修改、查看详情为你推荐操作
    customCompFunc(params) {
      let _self = this;
      if (params.type === 'modify') { // 修改
        _self.$router.push('/manage/addRecommend?id=' + params.rowData.id);
      }
      else if (params.type === 'delete') { // do edit operation  删除
        this.$confirm('此操作将永久删除该推荐, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = [params.rowData.id];
          this.removeTableData(Ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      else if (params.type === 'goodsDetail') {   // 查看详情
        ajax.get(`/api/admin/getGoodsBannerDetail/` + params.rowData.id).then(res => {
          // console.log(res);
          if (res.data.code === 0 && res.status === 200) {
            _self.goodsDetail = res.data.data;
            _self.dialogVisible = true;
            if (_self.goodsDetail.category === '1') {
              _self.detail = false;
            }
            else {
              _self.detail = true;
            }
          }
        });
      }
    },
    // 获取为你推荐数据
    getTableData() {
      let bannerData = this.recommendData;
      ajax.post('/api/admin/getBannerList', bannerData).then(res => {
        // console.log(res);
        if (res.data.code === 0 && res.status === 200) {
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    // 删除列表数据
    removeTableData(Ids) {
      ajax.post('/api/admin/deleteBanner', Ids).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: res.data.message,
          });
        }
        this.getTableData();
      });
    },
    // 批量删除
    Delete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该轮播, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = [];
          for (let item of this.selection) {
            Ids.push(item.id);
          }
          this.removeTableData(Ids);
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
    clean() {
      this.recommendData.Version = '';
      this.getTableData();
    },
    query() {
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
      this.recommendData.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.recommendData.PageIndex = 1;
      this.recommendData.PageSize = pageSize;
      this.getTableData();
    },
  },
  created() {
    this.getTableData();    // 点击获取轮播数据
    window.previewImg = this.previewImg;  // 预览图片
  }
};
</script>

<style lang="less" scoped>
  .el-input{
  width: 95%;
  }
  #special-warp{
    position: relative;
    .filter{
      .explain{
        border: none;
        padding: 0;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 72px;
        right: 490px;
        // background: url(./img/icon-Explain.png) no-repeat;
      }
      .goodsDetail{
        .strong{
          display: inline-block;
          width: 100px;
          text-align: right;
          font-weight: bold;
          margin-right: 8px;
        }
        .box{
          margin-bottom: 20px;
        }
        .pic-box {
          height: 100px;
          line-height: 100px;
          .pic_img{
            width: 50px;
            height: 50px;
              // vertical-align: middle;
          }
        }
      }
    }
  }
</style>
