<template>
  <div id="specialProduct">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="商品名称">
            <el-input v-model.trim="searchInfo.productName" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryCode">
              <el-select v-model="searchInfo.categoryCode" placeholder="请选择商品分类" clearable>
                <el-option v-for="item in category" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode"></el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="商品ID">
            <el-input v-model.trim="searchInfo.productId" placeholder="请输入商品ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="生产厂商">
            <el-input v-model.trim="searchInfo.productProducingPlace" placeholder="请输入生产厂商" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 空</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
        <el-button-group>
          <el-button type="default" size="small" @click="add" icon="el-icon-plus">添加商品</el-button>
          <el-button type="default" size="small" @click="Delete" icon="el-icon-delete">批量删除</el-button>
          <el-button type="default" size="small" @click="refresh" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize"
      :page-index="searchInfo.pageNum" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 添加商品弹窗 -->
    <el-dialog title="请选择需要推荐的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
      <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog title="商品详情" :visible.sync="DetailShow" width="800px" :center="true" :modal-append-to-body="false" class="details">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品名称：</span><span class="common_span">{{detailData.productName}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品分类：</span><span class="common_span">{{detailData.categoryName}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品图片：</span>
          <img :src="detailData.productMainImage" alt="" class="productImg"></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品市场价：</span><span class="common_span">{{detailData.productMarkprice}}元</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">标准规格：</span><span class="common_span">{{detailData.productSpecification}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品描述：</span><span class="common_span">{{detailData.description}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">生产厂商：</span><span class="common_span">{{detailData.productProducingPlace}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">销量：</span><span class="common_span">{{detailData.productSalesVolume}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品sku：</span><span class="common_span">{{detailData.productSku}}</span></div></el-col>
      </el-row>
    </el-dialog>
    <!-- 编辑排序 -->
    <el-dialog title="编辑排序" :visible.sync="sortShow" width="500px" :center="true" :modal-append-to-body="false" >
      <el-form :model="sortData" ref="addData" size="small" :rules="addrules" label-width="100px" >
        <el-form-item label="商品排序:" prop="serialNumber" >
          <el-input v-model="sortData.serialNumber" clearable placeholder="请输入商品排序"></el-input>
        </el-form-item>
        <el-form-item class="footer">
          <el-button type="default" @click="cleanSort" icon="el-icon-close">取 消</el-button>
          <el-button type="primary" @click="saveSort" icon="el-icon-check">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/javaApiRequest';
import { mapGetters } from 'vuex';
export default {
  data() {
    // 排序
    let validateSort = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内，大于0的正整数'));
        }
      } else {
        // callback();
        return callback(new Error('请输入10位数以内，大于0的正整数'));
      }
    };
    return {
      total: 0,
      selection: [],
      tableData: [],
      category: [],
      searchInfo: {
        specialId: Number(this.$route.query.id),
        productName: '',
        productId: '',
        categoryCode: '',
        productProducingPlace: '',
        specialType: 1,
        pageNum: 1,
        pageSize: 10,
        orderBy: 'asc'
      },
      productShow: false,
      ProductsUrl: `${process.env.WEB_HOST}/cardManage/productComponent`,
      DetailShow: false,
      detailData: '',
      sortShow: false,
      sortData: {
        specialId: Number(this.$route.query.id),
        productId: '',
        serialNumber: ''
      },
      addrules: {
        serialNumber: [{ required: true, validator: validateSort, trigger: 'blur' }],
      },
      indexSort: '',  //  序号
      tip: '',
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productId', title: '商品ID', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'productName', title: '商品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'description', title: '商品描述', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'categoryCode', title: '商品分类', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'productMainImage', title: '商品图片', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '标准规格', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'productMarkprice', title: '商品市场价', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'productSku', title: '商品sku', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'productProducingPlace', title: '生产厂商', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'productSalesVolume', title: '销量', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'sort', title: '排序', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-specialManage', isResize: true }
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
        if (item.field === 'productMarkprice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '<span style="color:red;">' + value + '元</span>';
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
            }
          };
        }
        if (item.field === 'productMainImage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              // let pic =  value.split(',');
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        // if (item.field === 'sort') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     let value = rowData[field];
        //     if (value) {
        //       return value;
        //     }
        //   };
        // }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ]),
  },
  methods: {
    // 清空查询
    clean() {
      this.searchInfo.productName = '';
      this.searchInfo.productId = '';
      this.searchInfo.productProducingPlace = '';
      this.searchInfo.categoryCode = '';
      this.query();
    },
    // 查询
    query() {
      this.searchInfo.pageNum = 1;
      this.getTable();
    },
    // 添加
    add() {
      this.productShow = true;
    },
    // 刷新
    refresh() {
      this.query();
    },
    // 删除
    remove(Pro_ID) {
      let _self = this;
      let param = {
        specialId: _self.$route.query.id,
        productId: Pro_ID.toString(),
      };
      ajax.post(`mall_manage/back/kmSpecial/delKmSpecialProduct`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            type: 'success',
            message: '操作成功'
          });
          _self.getTable();
        }
      });
    },
    // 批量删除
    Delete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.productId.toString());
          }
          let str = idList.join(',');
          this.remove(str);
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
    // 添加、修改、查看详情轮播操作
    customCompFunc(params) {
      let _self = this;
      if (params.type === 'delete') { // do edit operation  删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.productId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      else if (params.type === 'detail') {   // 预览
        let param = {
          productId: params.rowData.productId,
          getCommon: 'all',
        };
        ajax.post(`mall_manage/back/product/queryProductById`, param).then(res => {
          if (res.data.resultCode === '0' && res.status === 200) {
            _self.DetailShow = true;
            _self.detailData = res.data.resultData;
            let categoryDetail = _self.category.find((x) => x.categoryCode === _self.detailData.categoryCode.toString());
            _self.$set(_self.detailData, 'categoryName', categoryDetail.categoryName);
          }
        });
      }
      else if (params.type === 'editSort') {
        _self.sortShow = true;
        _self.sortData.productId = params.rowData.productId;
      }
    },
    // 取消排序
    cleanSort() {
      this.sortShow = false;
      this.sortData.serialNumber = '';
    },
    // 提交排序
    saveSort() {
      let _self = this;
      let arr = [];
      arr.push(_self.sortData);
      let param = {
        kmSpecial: arr,
      };
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          ajax.post(`mall_manage/back/kmSpecial/updateSort`, param).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              _self.getTable();
              _self.cleanSort();
            }
          });
        }
        else {
          return false;
        }
      });
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.searchInfo;
      ajax.post(`/mall_manage/back/kmSpecial/querySpecialProduct`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    // 商品分类
    getCategory() {
      let _self = this;
      ajax.get(`/mall_manage/back/category/getAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.category = res.data.resultData;
        }
      });
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
      this.searchInfo.pageNum = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = pageSize;
      this.getTable(this.searchInfo.pageSize);
    },
    // 弹窗添加商品
    setSelectedList(data, proudctNum, sellerUserId) {
      let _self = this;
      let arr_isChecked = data.map(function(item, index, data) {
        return Number(item.isChecked);
      });
      for (let i in arr_isChecked) {
        if (arr_isChecked[i] !== 1) {
          _self.tip = 0;
        } else {
          _self.tip = 1;
        }
      }
      if (data.length === 0) {
        _self.$message({
          message: '请选择需要推荐的商品',
          type: 'warning'
        });
      } else if (data && (data[0].getByself || data[0].getCommon || data[0].getFast || data[0].transnational)) {
        let arr_proId = data.map(function(item, index, data) {
          return item.productId;
        });
        let param = {
          specialId: this.searchInfo.specialId,
          productId: arr_proId.toString(),
          specialType: 1,
        };
        if (_self.tip === 1) {
          ajax.post(`mall_manage/back/kmSpecial/addKmSpecialProduct`, param).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                type: 'success',
                message: '添加成功'
              });
              _self.productShow = false;
              _self.getTable();
            }
          });
        } else {
          _self.$message({
            message: '请选择已核审的商品',
            type: 'warning'
          });
        }
      } else if (data === false) {
        _self.productShow = false;
      } else if (!sellerUserId) {
        _self.$message({
          message: '请选择药店来源',
          type: 'warning'
        });
      } else if (!data[0].getByself && !data[0].getCommon && !data[0].getFast && !data[0].transnational) {
        _self.$message({
          type: 'warning',
          message: '暂不支持添加药店来源为汤品的药店'
        });
      }
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
  },
  created() {
    this.getTable();
    this.getCategory();
    window.setSelectedList = this.setSelectedList;
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
.productImg{
  width: 50px;
  height: 50px;
  border: 1px dotted #DCDFE6;
}
.details{
  /deep/ .el-dialog__body{
    padding: 25px 40px 30px;
  }
}
.grid-content{
  line-height: 40px;
  display: inline-block;
}
.strong{
  display: inline-block;
  width: 85px;
  text-align: left;
}
.footer{
  text-align: center;
  margin: 30px 0 0 -100px;
}
</style>
