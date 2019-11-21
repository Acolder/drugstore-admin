<template>
  <div id="special-warp">
    <div class="filter">
      <el-form :inline="true" :model="swiperData" size="small" style="margin-left: 10px;" >
        <el-form-item label="版本号：">
          <el-input v-model.trim="swiperData.Version" placeholder="请输入版本号（例：v1.0）" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="轮播图类别：">
          <el-select v-model="swiperData.AdvertinsingType" clearable style="width: 250px">
            <el-option v-for="item in bannerCatatySelected" :key="item.value" :value="item.value" :label="item.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布渠道：">
          <el-select v-model="targetSelect" multiple clearable style="width: 250px">
            <el-option v-for="item in publishtargetSelected" :key="item.value" :value="item.value" :label="item.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
      <div class="toolbar-wrapper">
        <el-button-group>
          <el-button type="default" size="small" @click="addSwiper" icon="el-icon-plus">添加轮播</el-button>
          <el-button type="default" size="small" @click="Delete" icon="el-icon-delete">批量删除</el-button>
          <el-button type="default" size="small" @click="refresh" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </div>
      <div class="table-wrapper">
        <v-table ref="data_table" is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
        @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
        </v-table>
      </div>
      <div class="pagin-wrapper">
      <span class="version_tip" icon="el-icon-info"><em>注释:</em> 轮播图版本号v2.0对应药葫芦v4.0.0</span>
        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="swiperData.PageSize" :page-index="swiperData.PageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
      <el-dialog title="信息详情" :center="true" :visible.sync="dialogVisible" width="40%" :modal-append-to-body=false  class="goodsDetail">
        <p><span class="strong">ID：</span>{{_self.goodsDetail.id}}</p>
        <p><span class="strong">排序：</span>{{_self.goodsDetail.sort}}</p>
        <p><span class="strong">商品分类：</span>{{_self.goodsDetail.category}}</p>
        <p><span class="strong">创建时间：</span>{{_self.goodsDetail.createtime}}</p>
        <p><span class="strong picAdress">图片地址：</span><img :src="_self.goodsDetail.picturepath" alt="" class="pic_img"></p>
        <p><span class="strong">图片链接地址：</span>{{_self.goodsDetail.pictureurl}}</p>
        <p v-if="detail"><span class="strong">商品ID：</span>{{_self.goodsDetail.product.productid}}</p>
        <p v-if="detail"><span class="strong">商品名：</span>{{_self.goodsDetail.product.productname}}</p>
        <p v-if="detail"><span class="strong">商品售价：</span>{{_self.goodsDetail.product.productmarkprice}}</p>
        <p v-if="detail"><span class="strong">商品图片地址：</span><img :src="_self.goodsDetail.product.productmainimage" alt="" class="pic_img"></p>
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
      swiperData: {
        AdvertinsingType: '90',
        PageIndex: 1,
        PageSize: 10,
        Version: '',
        publishtarget: ''
      },
      bannerCatatySelected: [
        { value: '90', text: '全部' },
        { value: '1', text: '商城轮播图' },
        { value: '13', text: '快送轮播图' },
        { value: '15', text: '商城长轮播图' },
      ],
      targetSelect: [],
      publishtargetSelected: [
        { value: '1', text: 'app' },
        { value: '2', text: 'h5' },
        { value: '3', text: '小程序' },
      ],
      tableData: [],
      selection: [],
      total: 0,
      dialogVisible: false,
      goodsDetail: [],
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
            let index = (_self.swiperData.PageIndex - 1) * _self.swiperData.PageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'category', title: '类别', width: 10, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'picturepath', title: '图片地址', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'bannercategory', title: '轮播图类别', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'publishtarget', title: '发布渠道', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'version', title: '版本号', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '排序', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 140, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-swiper', isResize: true }
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
        if (item.field === 'category') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return 'url';
            }
            if (value === '2') {
              return '商品';
            }
          };
        }
        if (item.field === 'bannercategory') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '商城轮播图';
            }
            if (value === 13) {
              return '快送轮播图';
            }
            if (value === 15) {
              return '商城长轮播图';
            }
          };
        }
        if (item.field === 'publishtarget') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return 'app';
            } else if (value === '2,1') {
              return 'h5 app';
            } else if (value === '1,2') {
              return 'app h5';
            } else if (value === '2') {
              return 'h5';
            } else if ((value === '1,2,3') || (value === '1,3,2') || (value === '2,1,3') || (value === '2,3,1') || (value === '3,2,1') || (value === '3,1,2')) {
              return 'app h5 小程序';
            } else if ((value === '1,3') || (value === '3,1')) {
              return 'app 小程序';
            } else if ((value === '2,3') || (value === '3,2')) {
              return 'h5 小程序';
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
    ...mapGetters([
      'sidebarStatus'
    ]),
  },
  methods: {
    // 预览图片
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
    // 清除
    clean() {
      this.swiperData.Version = '';
      this.swiperData.AdvertinsingType = '90'; // 轮播图类别默认值
      this.targetSelect = []; // 发布渠道默认值
      this.getTableData();
    },
    // 查询
    query() {
      this.swiperData.PageIndex = 1;
      this.swiperData.publishtarget = this.targetSelect.join(',');
      if (this.swiperData.AdvertinsingType === '') {
        this.swiperData.AdvertinsingType = '90';
      }
      this.getTableData();
    },
    // 刷新
    refresh() {
      this.swiperData.AdvertinsingType = '90'; // 轮播图类别默认值
      this.targetSelect = []; // 发布渠道默认值
      this.getTableData();
    },
    // 跳转至添加轮播
    addSwiper() {
      this.$router.push('/manage/swiper-info/addSwiperInfo?pageIndex=' + this.swiperData.PageIndex + '&pageSize=' + this.swiperData.PageSize + '&AdvertinsingType=' + this.swiperData.AdvertinsingType + '&version=' + this.swiperData.Version);
    },
    // 添加、修改、查看详情轮播操作
    customCompFunc(params) {
      let _self = this;
      if (params.type === 'modify') { // 修改
        _self.$router.push('/manage/swiper-info/editSwiperInfo?id=' + params.rowData.id + '&pageIndex=' + this.swiperData.PageIndex + '&pageSize=' + this.swiperData.PageSize + '&AdvertinsingType=' + this.swiperData.AdvertinsingType + '&version=' + this.swiperData.Version);
      }
      else if (params.type === 'delete') { // do edit operation  删除
        this.$confirm('此操作将永久删除该轮播, 是否继续?', '提示', {
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
        ajax.get(`/api/admin/getHomeBannerDetail/` + params.rowData.id).then(res => {
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
    // 获取轮播图数据
    getTableData() {
      let bannerData = this.swiperData;
      ajax.post('/api/admin/getBannerList', bannerData).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].sort = this.tableData[i].sort ? this.tableData[i].sort : 1;
          }
        }
      });
    },
    // 删除
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
      this.swiperData.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.swiperData.PageIndex = 1;
      this.swiperData.PageSize = pageSize;
      this.getTableData();
    },
  },
  created() {
    if (this.$route.query.pageIndex) {
      this.swiperData.PageIndex = Number(this.$route.query.pageIndex);
    }
    if (this.$route.query.pageSize) {
      this.swiperData.PageSize = Number(this.$route.query.pageSize);
    }
    if (this.$route.query.version) {
      this.swiperData.Version = this.$route.query.version;
    }
    if (this.$route.query.AdvertinsingType) {
      this.swiperData.AdvertinsingType = this.$route.query.AdvertinsingType;
    }
    this.getTableData();    // 点击获取轮播数据
    window.previewImg = this.previewImg;  // 预览图片
  }
};
</script>

<style lang="less" scoped>
.el-input{
width: 95%;
}
.filter{
  position: relative;
  .explain{
    border: none;
    padding: 0;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 72px;
    right: 490px;
    background: url(./img/icon-Explain.png) no-repeat;
  }
  .goodsDetail{
    .strong{
      display: inline-block;
      width: 100px;
      text-align: right;
      font-weight: bold;
      margin: 0px 10px 0px 15px;
    }
    p{
      line-height: 28px;
      // .picAdress{
        // display: inline-block;
      // }
      .pic_img{
          width: 20%;
          height: 20%;
      }
    }
  }
}
.version_tip{
  float: left;
  color:#aaa;
  font-size: 15px;
  em{
    color:red;
  }
}
</style>
