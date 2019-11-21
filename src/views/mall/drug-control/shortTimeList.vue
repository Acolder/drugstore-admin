<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchForm" size="small" ref="searchForm" label-width="100px">
        <!-- <el-form-item label="导入商品ID" prop="productImportId">
          <el-input-number v-model="searchForm.productImportId" :min="0" label="导入的商品ID" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="插入商品表ID" prop="productId">
          <el-input-number v-model="searchForm.productId" :min="0" label="插入到商品表的ID" style="width:200px"></el-input-number>
        </el-form-item> -->
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="searchForm.productName" placeholder="商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="isOtc">
          <el-select v-model="searchForm.isOtc" placeholder="请选择" clearable>
            <el-option label="非处方药" :value="1"></el-option>
            <el-option label="处方药" :value="2"></el-option>
            <el-option label="其他" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="productSpecification">
          <el-input v-model="searchForm.productSpecification" placeholder="规格" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品sku" prop="productSku">
          <el-input v-model="searchForm.productSku" placeholder="商品sku" clearable></el-input>
        </el-form-item>
        <el-form-item label="批准文号" prop="productApprovalNumber">
          <el-input v-model="searchForm.productApprovalNumber" placeholder="批准文号" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核状态" prop="isChecked">
          <el-select v-model="searchForm.isChecked" placeholder="请选择" clearable>
            <el-option label="初始化数据" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核不通过" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小商品ID" prop="minProductImportId">
          <el-input-number v-model="searchForm.minProductImportId" :min="0" label="最小商品ID" style="width:200px" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="最大商品ID" prop="maxProductImportId">
          <el-input-number v-model="searchForm.maxProductImportId" :min="0" label="最大商品ID" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="生产产商" prop="productProducingPlace">
          <el-input v-model="searchForm.productProducingPlace" placeholder="生产产商" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否同步" prop="isSyn">
          <el-select v-model="searchForm.isSyn" placeholder="请选择" clearable>
            <el-option label="已同步" :value="1"></el-option>
            <el-option label="未同步" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="temporarySearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-download" @click="importData">导入数据</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-sort" @click="isochronousData">同步到商品表</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="getDataList">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :multiple-sort="false" mul :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="formPage.total" :page-size="formPage.pageSize" :page-index="formPage.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <el-dialog title="对比商品" :visible.sync="comparisontShow" :modal-append-to-body="false" width="80%" center>
      <el-form :inline="true" :model="comparisonData" size="small" ref="comparisonData">
        <el-form-item>
          <el-checkbox v-model="conChecked.productName" @change="checkedChange('productName')">商品名称</el-checkbox>
          <el-input v-model="comparisonData.productName" placeholder="商品名称" class="contrast-input" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="conChecked.productSpecification" @change="checkedChange('productSpecification')">规格</el-checkbox>
          <el-input v-model="comparisonData.productSpecification" placeholder="规格" class="contrast-input" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="conChecked.productApprovalNumber" @change="checkedChange('productApprovalNumber')">批准文号</el-checkbox>
          <el-input v-model="comparisonData.productApprovalNumber" placeholder="批准文号" class="contrast-input" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="conChecked.productProducingPlace" @change="checkedChange('productProducingPlace')">生产产商</el-checkbox>
          <el-input v-model="comparisonData.productProducingPlace" placeholder="生产产商" class="contrast-input" clearable></el-input>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="primary" @click="contrastSearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-wrapper">
        <v-table ref="comparison_table" column-width-drag :multiple-sort="false" mul :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="comparisonColumns" :table-data="comparisonTable" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="contrastCompFunc"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="contrastPageChange" @page-size-change="contrastPageSizeChange" :total="comparisonPage.total" :page-size="comparisonPage.pageSize" :page-index="comparisonPage.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
      <div class="product-txt">
        <span>
          <label class="txt1">商品名称:</label>
          <label class="txt2">{{comparisonData.productName}}</label>
        </span>
        <span>
          <label class="txt1">规格:</label>
          <label class="txt2">{{comparisonData.productSpecification}}</label>
        </span>
        <span>
          <label class="txt1">批准文号:</label>
          <label class="txt2">{{comparisonData.productApprovalNumber}}</label>
        </span>
        <span>
          <label class="txt1">生产产商:</label>
          <label class="txt2">{{comparisonData.productProducingPlace}}</label>
        </span>
      </div>
      <div class="revise-state">
        <el-form :inline="true" size="small">
          <el-form-item label="审核状态" :class="(showErrorTxt && reviseState === '') ? 'is-error' : ''">
            <el-select v-model="reviseState" placeholder="请选择" clearable>
              <el-option label="初始化数据" :value="0"></el-option>
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="审核不通过" :value="2"></el-option>
            </el-select>
            <label class="state-error" v-show="showErrorTxt && reviseState === ''">请选择审核状态</label>
          </el-form-item>
          <el-form-item class="btn-wrapper">
            <el-button type="primary" @click="submitState" icon="el-icon-check">提交</el-button>
            <el-button type="info" @click="cancelRevise">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="导入数据" class="import-data" :visible.sync="showImport" :modal-append-to-body="false" width="50%" center>
      <form name="serForm" method="post">
        <div class="change-file">
          <el-button type="default" size="small" icon="el-icon-tickets">选择文件</el-button>
          <input type="file" name="file" @change="getFile($event)" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
        </div>
        <label v-if="fileInfo" class="file-name">
          <i class="el-icon-document"></i>{{fileInfo.name}}</label>
        <el-button type="primary" @click="uploadImport($event)">上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </form>
      <div class="el-loading-mask" style="background-color: rgba(0, 0, 0, 0.8);" v-show="uploadLoading">
        <div class="el-loading-spinner">
          <i class="el-icon-loading"></i>
          <p class="el-loading-text">上传中</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  .search-wrapper {
    /deep/.el-form-item__content {
      width: 200px;
    }
    .btn-wrapper {
      padding: 0 30px;
    }
  }
  .el-dialog .el-form {
    padding: 0 12px;
  }
  .import-data{
    /deep/.el-dialog__body {
      padding: 62px 0;
      text-align: center !important;
    }
    .change-file {
      display: inline-block;
      position: relative;
      margin-right: 20px;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
    .file-name {
      display: inline-block;
      margin-right: 26px;
      .el-icon-document {
        margin-right: 8px;
      }
    }
  }
  .contrast-input {
    width: 180px;
    margin: 0 18px 0 5px;
  }
  .product-txt {
    margin-bottom: 20px;
    span {
      display: inline-block;
      line-height: 28px;
      margin: 0 28px 0 12px;
      .txt1 {
        display: inline-block;
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
  .revise-state {
    .state-error {
      display: block;
      color: #f56c6c;
    }
    .btn-wrapper {
      margin-left: 20px;
    }
  }
  /deep/.el-dialog--center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    margin: 0 !important;
  }
</style>
<script>
// import { mapGetters } from 'vuex';
// import { Loading } from 'element-ui';
import { base64Decrypt } from '@/utils/auth';
import ajax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      comparisontShow: false,   // 显示对比弹窗
      // 临时商品表查询条件
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        isChecked: '',     // 审核状态
        productName: '',  // 药品名称
        isOtc: '',       // 产品类型
        productApprovalNumber: '',  // 批准文号
        productProducingPlace: '',  // 生产厂商
        productSku: '',   // 商品sku
        productSpecification: '',   // 规格
        minProductImportId: '',   // 最小商品ID
        maxProductImportId: '',   // 最大商品ID
        isSyn: ''  // 是否同步
      },
      queryData: {
        pageNum: 1,
        pageSize: 10
      },
      // 临时商品表数据
      tableData: [],
      columns: this.getColumns(),
      // 临时商品表页码信息
      formPage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      // 对比商品信息
      comparisonData: {
        productName: '',
        productSpecification: '',
        productApprovalNumber: '',
        productProducingPlace: ''
      },
      // 对比商品表查询条件
      comparisonForm: {
        pageNum: 1,
        pageSize: 10,
        productName: '',
        productSpecification: '',
        productApprovalNumber: '',
        productProducingPlace: ''
      },
      // comparisonData: {
      //   pageNum: 1,
      //   pageSize: 10
      // },
      // 对比商品表数据
      comparisonTable: [],
      comparisonColumns: this.getContrastColumns(),
      conChecked: {
        productName: true,
        productSpecification: true,
        productApprovalNumber: true,
        productProducingPlace: true
      },
      // 对比商品表页码信息
      comparisonPage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      reviseState: '',  // 修改审核状态
      showErrorTxt: false,
      showImport: false,  // 显示导入商品
      fileInfo: '',
      uploadLoading: false
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取临时表数据
    getDataList() {
      this.$set(this.searchForm, 'pageNum', this.formPage.pageIndex);
      this.$set(this.searchForm, 'pageSize', this.formPage.pageSize);
      ajax.post(`/mall_manage/back/productImport/queryProductImport`, this.searchForm).then((res) => {
        if (res.status === 200) {
          let resData = res.data;
          if (resData.resultCode === '0') {
            this.formPage.total = resData.resultData.count;
            this.tableData = resData.resultData.productList;
          }
          else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        }
      });
    },
    // 获取对比表数据
    getContrastData() {
      this.$set(this.comparisonForm, 'pageNum', this.comparisonPage.pageIndex);
      this.$set(this.comparisonForm, 'pageSize', this.comparisonPage.pageSize);
      ajax.post('/mall_manage/back/productImport/queryProduct', this.comparisonForm).then((res) => {
        if (res.status === 200) {
          let resData = res.data;
          if (resData.resultCode === '0') {
            this.comparisonPage.total = resData.resultData.count;
            this.comparisonTable = resData.resultData.productList;
          }
          else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        }
      });
    },
    // 对比表条件筛选(多选)
    checkedChange(res, val) {
      this.comparisonForm[res] = this.conChecked[res] ? this.comparisonData[res] : '';
      this.getContrastData();
    },
    // 临时表数据展示
    getColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 45, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.formPage.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productImportId', title: '导入商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productId', title: '插入商品表ID', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '商品名称', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isOtc', title: '产品类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSku', title: '商品sku', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productApprovalNumber', title: '批准文号', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isChecked', title: '审核状态', width: 90, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productId', title: '同步状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产产商', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-temporary', isResize: true }
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
        if (item.field === 'isOtc') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '非处方药';
            } else if (value === 2) {
              return '处方药';
            } else {
              return '其他';
            }
          };
        }
        if (item.field === 'isChecked') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '<span style="color:green;">审核通过</span>';
            } else if (value === 2) {
              return '<span style="color:red;">审核不通过</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 对比表数据展示
    getContrastColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 45, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.comparisonPage.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productId', title: '商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '商品名称', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSku', title: '商品sku', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productApprovalNumber', title: '批准文号', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产产商', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-temporary', isResize: true }
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-contrast', isResize: true }
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
      }
      return columns;
    },
    // 临时表查询
    temporarySearch() {
      this.formPage.pageIndex = 1;
      this.getDataList();
    },
    // 对比表查询
    contrastSearch() {
      this.comparisonPage.pageIndex = 1;
      for (let key in this.conChecked) {
        if ({}.hasOwnProperty.call(this.conChecked, key)) {
          this.comparisonForm[key] = this.conChecked[key] ? this.comparisonData[key] : '';
        }
      }
      this.getContrastData();
    },
    // 临时表搜索重置(清空)
    resetForm() {
      let emptySearchData = {
        isChecked: '',     // 审核状态
        productName: '',  // 药品名称
        isOtc: '',       // 产品类型
        productApprovalNumber: '',  // 批准文号
        productProducingPlace: '',  // 生产厂商
        productSku: '',   // 商品sku
        productSpecification: '',   // 规格
        minProductImportId: '',   // 最小商品ID
        maxProductImportId: '',   // 最大商品ID
        // productId: '',     // 插入到商品表的ID
        // productImportId: '',    // 导入的商品ID
        isSyn: ''  // 是否同步
      };
      this.searchForm = emptySearchData;
      this.temporarySearch();
    },
    // 临时表分页索引选择
    pageChange(pageIndex) {
      this.formPage.pageIndex = pageIndex;
      this.getDataList();
    },
    // 临时表分页数量选择
    pageSizeChange(pageSize) {
      this.formPage.pageIndex = 1;
      this.formPage.pageSize = pageSize;
      this.getDataList();
    },
    // 对比表分页索引选择
    contrastPageChange(pageIndex) {
      this.comparisonPage.pageIndex = pageIndex;
      this.getContrastData();
    },
    // 对比表分页数量选择
    contrastPageSizeChange(pageSize) {
      this.comparisonPage.pageIndex = 1;
      this.comparisonPage.pageSize = pageSize;
      this.getContrastData();
    },
    // 临时表操作
    customCompFunc(params) {
      // 对比
      if (params.type === 'comparison') {
        this.getContrastData();
        let rowData = params.rowData;
        this.comparisonData = {
          productImportId: rowData.productImportId,
          productName: rowData.productName,
          productSpecification: rowData.productSpecification,
          productApprovalNumber: rowData.productApprovalNumber,
          productProducingPlace: rowData.productProducingPlace,
          productSku: rowData.productSku,
          source: rowData.source
        };
        this.comparisonForm.productName = rowData.productName;
        this.comparisonForm.productSpecification = rowData.productSpecification;
        this.comparisonForm.productApprovalNumber = rowData.productApprovalNumber;
        this.comparisonForm.productProducingPlace = rowData.productProducingPlace;
        for (let key in this.conChecked) {
          if ({}.hasOwnProperty.call(this.conChecked, key)) {
            this.conChecked[key] = true;
          }
        }
        // this.comparisonForm = {
        //   pageNum: 1,
        //   pageSize: 10,
        //   productName: '',
        //   productSpecification: '',
        //   productApprovalNumber: '',
        //   productProducingPlace: ''
        // };
        this.comparisontShow = true;
      }
    },
    // 对比表操作
    contrastCompFunc(params) {
      // 对比
      if (params.type === 'guideInto') {
        let rowData = params.rowData;
        let productId = rowData.productId;
        let productSku = this.comparisonData.productSku;
        let source = this.comparisonData.source;
        let data = {
          productId: productId,
          productSku: productSku,
          source: source
        };
        ajax.post('/mall_manage/back/productImport/synSku', data).then((res) => {
          if (res.status === 200) {
            let resData = res.data;
            if (resData.resultCode === '0') {
              this.$message({
                type: 'success',
                message: '同步成功'
              });
              this.getContrastData();
            }
            else {
              this.$message({
                type: 'error',
                message: resData.msg
              });
            }
          }
        });
      }
    },
    // 导入数据
    importData() {
      this.showImport = true;
    },
    // 上传文件
    getFile(event) {
      this.fileInfo = event.target.files[0];
      let fileName = this.fileInfo.name;
      let index = fileName.indexOf('.');
      let suffix = fileName.substring(index + 1);
      if (suffix !== 'xls' && suffix !== 'xlsx') {
        this.$message({
          type: 'error',
          message: '请上传"xls"或者"xlsx"的Excel表格'
        });
        return false;
      }
    },
    // 上传数据
    uploadImport(event) {
      event.preventDefault();
      if (!this.fileInfo) {
        this.$message({
          type: 'error',
          message: '请选择文件'
        });
        return false;
      }
      let fileName = this.fileInfo.name;
      let index = fileName.indexOf('.');
      let suffix = fileName.substring(index + 1);
      if (suffix !== 'xls' && suffix !== 'xlsx') {
        this.$message({
          type: 'error',
          message: '请上传"xls"或者"xlsx"的Excel表格'
        });
        return false;
      }
      this.uploadLoading = true;
      let formData = new FormData();
      formData.append('file', this.fileInfo);
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      this.$http.post(`${process.env.MALL_BASE_HOST}/mall_manage/back/productImport/upload`, formData, config).then(function (res) {
        if (res.status === 200) {
          let resData = JSON.parse(base64Decrypt(res.data));
          if (resData.resultCode === '0') {
            this.$message({
              type: 'success',
              message: '上传成功'
            });
            this.showImport = false;
            this.getDataList();
          }
          else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
          this.uploadLoading = false;
        }
        else {
          this.$message({
            type: 'error',
            message: '上传失败'
          });
        }
      });
    },
    // 同步数据
    isochronousData() {
      this.$confirm('确定同步数据到商品表吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(`/mall_manage/back/productImport/productImportToProduct`).then((res) => {
          if (res.status === 200) {
            let resData = res.data;
            if (resData.resultCode === '0') {
              this.$message({
                type: 'success',
                message: '同步成功'
              });
              this.getDataList();
            }
            else {
              this.$message({
                type: 'error',
                message: resData.msg
              });
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消同步'
        });
      });
    },
    // 修改状态
    submitState() {
      if (this.reviseState === '') {
        this.showErrorTxt = true;
        return false;
      }
      let data = [{ isChecked: this.reviseState, productImportId: this.comparisonData.productImportId }];
      ajax.post(`/mall_manage/back/productImport/updateProductImportIsChecked`, data).then((res) => {
        if (res.status === 200) {
          let resData = res.data;
          if (resData.resultCode === '0') {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.getDataList();
            this.comparisontShow = false;
          }
          else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        }
      });
    },
    // 取消修改
    cancelRevise() {
      this.comparisontShow = false;
    }
  }
};
</script>
