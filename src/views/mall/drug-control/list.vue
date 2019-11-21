<template>
  <div>
    <div class="search-wrapper">
      <div class="header-top">
        <div class="right">
          <span class="take" @click="condition">{{conditionValue}}</span>
        </div>
      </div>
      <el-form :inline="true" :model="searchForm" size="small" ref="searchForm" label-width="100px">
        <el-form-item label="药店来源" prop="sellerUserId">
          <el-select v-model="searchForm.sellerUserId" placeholder="请选择药店来源" clearable filterable>
            <!-- <div>
              <el-option label="所有" value=""></el-option>
            </div> -->
            <div v-for="(sellerUser,i) in sellerUserList" :key="sellerUser[i]">
              <el-option :label="sellerUser.sellerName" :value='sellerUser.sellerUserId'></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="searchForm.productName" placeholder="商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" prop="productProducingPlace">
          <el-input v-model="searchForm.productProducingPlace" placeholder="生产厂商" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryCode">
          <el-select v-model="searchForm.categoryCode" placeholder="请选择商品分类">
            <el-option v-for="item in category" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode" clearable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生分类" prop="categoryDoctors">
          <el-select v-model="searchForm.categoryDoctors" placeholder="请选择医生分类">
            <el-option v-for="item in doctorCategory" :key="item.categoryDoctors" :label="item.categoryName" :value="item.categoryDoctors" clearable></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="药品来源">
            <el-select v-model="durgfrom" placeholder="请选择药品来源">
              <el-option label="仓库商品" :value='"getCommon"'></el-option>
              <el-option label="快送商品" :value='"getFast"'></el-option>
              <el-option label="药柜商品" :value='"getByself"'></el-option>
              <el-option label="外贸商品" :value='"transnational"'></el-option>
            </el-select>
          </el-form-item> -->
        <!-- <el-form-item label="产品类型" prop="isOtc">
          <el-select v-model="searchForm.isOtc" placeholder="请选择" clearable>
            <el-option v-for="item in productTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- ///// -->
        <!-- {{searchForm.isOtc}} -->
        <el-form-item label="产品类型" prop="isOtc" :rules="{
                  message: '请输入', trigger: 'blur'
                }">
                  <!-- <el-input v-model="selectedData.version" placeholder="请输入版本号,如v1.0" clearable></el-input> -->
                  <el-select
                    v-model="searchForm.isOtc"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    popper-class='downClass'
                    :popper-append-to-body="false"
                    placeholder="请选择">
                    <el-option
                    v-for="item in productTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
          </el-form-item>
          <!-- <el-form-item label="审核状态" v-show="moreCondition" prop="isChecked">
                <el-select v-model="searchForm.isChecked" placeholder="请选择审核状态">
                  <el-option label="全部" :value="''"></el-option>
                  <el-option label="已审核" :value="'1'"></el-option>
                  <el-option label="未审核" :value="'2'"></el-option>
                  <el-option label="其他" :value="'0'"></el-option>
                </el-select>
          </el-form-item> -->
          <!-- //// -->
          <!-- {{searchForm.isChecked}} -->
          <el-form-item label="审核状态" v-show="moreCondition" prop="isChecked" :rules="{
                  message: '请输入', trigger: 'blur'
                }">
                  <!-- <el-input v-model="selectedData.version" placeholder="请输入版本号,如v1.0" clearable></el-input> -->
                  <el-select
                    v-model="searchForm.isChecked"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    popper-class='downClass'
                    :popper-append-to-body="false"
                    placeholder="请选择审核状态">
                    <el-option
                    v-for="item in isCheckedList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
        </el-form-item>
        <el-form-item label="商品SKU" prop="productSku" v-show="moreCondition">
          <el-input v-model="searchForm.productSku" placeholder="商品SKU" clearable></el-input>
        </el-form-item>
        <el-form-item label="最小商品ID" prop="minProductId" v-show="moreCondition">
          <el-input-number v-model="searchForm.minProductId" :min="0" label="最小商品ID" style="width:200px" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="最大商品ID" prop="maxProductId" v-show="moreCondition">
          <el-input-number v-model="searchForm.maxProductId" :min="0" label="最大商品ID" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="批准文号" prop="productApprovalNumber" v-show="moreCondition">
          <el-input v-model="searchForm.productApprovalNumber" placeholder="批准文号" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="切制规格" prop="productCutSpecification" v-show="moreCondition">
            <el-input v-model="searchForm.productCutSpecification" placeholder="切制规格" clearable></el-input>
          </el-form-item>
          <el-form-item label="炮制规格" prop="productPrepareSpecification" v-show="moreCondition">
            <el-input v-model="searchForm.productPrepareSpecification" placeholder="炮制规格" clearable></el-input>
          </el-form-item> -->
        <el-form-item label="商品描述" prop="description" v-show="moreCondition">
          <el-input v-model="searchForm.description" placeholder="商品描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" v-show="moreCondition">
          <el-input v-model="searchForm.remarks" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="药品成分" prop="pharmaceuticalIngredients" v-show="moreCondition">
          <el-select v-model="searchForm.pharmaceuticalIngredients" placeholder="请选择" style="width:100%;">
            <el-option v-for="item in productElements" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="isPrdouctImg" v-show="moreCondition">
          <el-select v-model="searchForm.isPrdouctImg" placeholder="请选择图片类型" style="width:100%">
            <el-option :value="'1'" :label="'无图片'"></el-option>
            <el-option :value="'2'" :label="'有图片'"></el-option>
            <el-option :value="''" :label="'所有'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品条形码" prop="productBarCode" v-show="moreCondition">
          <el-input v-model="searchForm.productBarCode" placeholder="商品条形码" clearable></el-input>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="seach" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <!-- <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button> -->
        <el-button type="default" size="small" icon="el-icon-refresh" @click="getDataList">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :multiple-sort="false" @sort-change="sortChange" mul :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
        @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <el-dialog title="查看药品" width="80%" :modal="true" :visible.sync="viewDialogVisible" :modal-append-to-body="false" center>
      <iframe id="viewDrugIframe" :src="viewDrugUrl" class="" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
  .search-wrapper {
    .header-top {
      height: 30px;
      .left {
        float: left;
        span {
          color: #999;
        }
        i {
          color: #999;
        }
      }
      .right {
        float: right;
        .take {
          color: #333;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    /deep/.el-form-item__content {
      width: 200px;
    }
    .btn-wrapper {
      padding: 0 30px;
    }
  }
</style>

<script>
import {
  mapGetters
} from 'vuex';
import ajax from '@/utils/javaApiRequest';
import {
  getParamString
} from '@/utils/index';
export default {
  data() {
    return {
      moreCondition: false,
      conditionValue: '展开高级搜索',
      viewDialogVisible: false,
      viewDrugUrlBase: `${process.env.WEB_HOST}/drug-control/viewDrug`,
      viewDrugUrl: '',
      category: [],
      doctorCategory: [],
      sidebarValue: this.sidebarStatus,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 搜索区活动name
      activeNames: ['1'],
      // 选择的记录
      selection: [],
      // 药品来源
      durgfrom: 'getCommon',
      // sellerFrom: '',
      sellerUserList: null,
      // 药品类型
      productTypeList: [{
        label: '甲类OTC',
        value: '1'
      },
      {
        label: '乙类OTC',
        value: '3'
      },
      {
        label: '处方',
        value: '2'
      },
      {
        label: '医疗器械类',
        value: '4'
      },
      {
        label: '保健食品',
        value: '5'
      },
      {
        label: '食品',
        value: '6'
      },
      {
        label: '消字号',
        value: '7'
      },
      {
        label: '妆字号',
        value: '8'
      },
      {
        label: '其他',
        value: '0'
      },
      ],
      // 审核状态
      isCheckedList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已审核',
          value: '1'
        },
        {
          label: '未审核',
          value: '2'
        },
        {
          label: '其他',
          value: '0'
        }
      ],
      // 药品成分
      productElements: [{
        label: '中成药',
        value: '1'
      },
      {
        label: '化学药',
        value: '2'
      },
      {
        label: '生物制剂',
        value: '3'
      },
      {
        label: '进口药品',
        value: '4'
      },
      {
        label: '中药饮片',
        value: '5'
      },
      {
        label: '其他',
        value: '0'
      },
      ],
      searchForm: {
        // 药品名称
        productName: '',
        // 商品SKU
        productSku: '',
        // 分类ID
        categoryCode: '',
        // 审核状态 1已审核 2未审核
        isChecked: [],
        // 生产厂商
        productProducingPlace: '',
        // 最小商品ID
        minProductId: 0,
        // 最大商品ID
        maxProductId: 0,
        // 批准文号
        productApprovalNumber: '',
        // 切制规格
        productCutSpecification: '',
        // 炮制规格
        productPrepareSpecification: '',
        // 产品类型
        // productType: '',
        isOtc: [],
        // 商品描述
        description: '',
        // 备注
        remarks: '',
        // 药品成分
        pharmaceuticalIngredients: '',
        // 药品来源
        sellerUserId: '',
        // 医生分类
        categoryDoctors: '',
        // 查询是否有图片
        isPrdouctImg: '',
      },
      queryData: {
        pageNum: 1,
        pageSize: 10,
        /* 商品来源 */
        getByself: '',
        getFast: '',
        getCommon: '',
        transnational: '',
        // 排序
        orderByProductId: 'desc',
        sellerUserId: ''
      }
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
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
    // 高级搜索
    condition() {
      this.moreCondition = !this.moreCondition;
      if (this.moreCondition === true) {
        this.conditionValue = '收起高级搜索';
      } else {
        this.conditionValue = '展开高级搜索';
      }
    },
    getSellUser() {
      let data = {
        userToken: '',
        pageIndex: 1,
        pageSize: 1000
      };
      ajax.post('/mall_manage/authority/queryLikeSellUser', data).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.sellerUserList = res.data.resultData.sellerUserList.data;
          // this.getDataList();
        }
      });
    },
    getColumns() {
      let _self = this;
      let columns = [{
        width: 60,
        titleAlign: 'center',
        columnAlign: 'center',
        type: 'selection',
        isFrozen: true
      },
      {
        field: 'custome',
        title: '序号',
        width: 45,
        titleAlign: 'center',
        columnAlign: 'center',
        formatter: function(rowData, rowIndex, pagingIndex, field) {
          let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
          return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        },
        isFrozen: true,
        isResize: true
      },
      {
        field: 'productId',
        title: '商品ID',
        width: 60,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true,
        orderBy: 'desc'
      },
      {
        field: 'productName',
        title: '商品名称',
        width: 180,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true,
        orderBy: 'desc'
      },
      {
        field: 'productSpecification',
        title: '标准规格',
        width: 80,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
      {
        field: 'productMainImage',
        title: '商品图片',
        width: 60,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
      {
        field: 'productBarCode',
        title: '商品条形码',
        width: 80,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
      {
        field: 'categoryCode',
        title: '分类',
        width: 80,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
      {
        field: 'categoryDoctors',
        title: '医生分类',
        width: 80,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
        // { field: 'productSku', title: '商品sku', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
      {
        field: 'isChecked',
        title: '审批状态',
        width: 80,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true,
        orderBy: 'desc'
      },
        // { field: 'productDosageForm', title: '剂型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
      {
        field: 'productApprovalNumber',
        title: '批准文号',
        width: 100,
        titleAlign: 'center',
        columnAlign: 'left',
        isResize: true,
        orderBy: 'desc'
      },
      {
        field: 'productProducingPlace',
        title: '生产厂商',
        width: 200,
        titleAlign: 'center',
        columnAlign: 'left',
        isResize: true
      },
        // { field: 'productMarkprice', title: '商品市场价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productSalesVolume', title: '销量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      {
        field: 'isOtc',
        title: '产品类型',
        width: 100,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
      {
        field: 'pharmaceuticalIngredients',
        title: '药品成分',
        width: 100,
        titleAlign: 'center',
        columnAlign: 'center',
        isResize: true
      },
        // { field: 'getFast', title: '快送', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'getByself', title: '药柜', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'getCommon', title: '仓库', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'transnational', title: '外贸', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
      {
        field: 'operation',
        title: '操作',
        width: 250,
        titleAlign: 'center',
        columnAlign: 'center',
        componentName: 'table-operation-druglist',
        isResize: true
      }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'productMainImage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'categoryCode') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
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
        if (item.field === 'categoryDoctors') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let c = _self.doctorCategory.find((x) => x.categoryDoctors.toString() === value.toString());
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
        if (item.field === 'isChecked') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '<span style="color:green;">已审核</span>';
            } else if (value === 2) {
              return '<span style="color:red;">未审核</span>';
            } else if (!value) {
              return '其他';
            } else {
              return '其他';
            }
          };
        }
        // 生产厂商
        if (item.field === 'productProducingPlace') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:void(0)');" title="${value}">${value}</a>`;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'productMarkprice') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let productStocks = rowData['productStocks'];
            if (productStocks && productStocks.length > 0) {
              let price = productStocks[0]['productPrice'];
              if (price) {
                return '<span style="color:red;">药店价￥' + price + '</span>';
              } else {
                return '-';
              }
            } else {
              let value = rowData[field];
              if (value) {
                return '<span style="color:red;">参考价￥' + value + '</span>';
              } else {
                return '-';
              }
            }

          };
        }
        if (item.field === 'isOtc') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let obj = _self.productTypeList.find((x) => x.value === value.toString());
              if (obj) {
                return obj.label;
              } else {
                return '其他';
              }
            } else {
              return '其他';
            }
          };
        }
        if (item.field === 'pharmaceuticalIngredients') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let obj = _self.productElements.find((x) => x.value === value.toString());
              if (obj) {
                return obj.label;
              } else {
                return '其他';
              }
            } else {
              return '其他';
            }
          };
        }
      }
      return columns;
    },
    getQueryParams: function() {
      if (!this.$route.query.from) {
        this.$set(this.queryData, 'pageNum', this.pageIndex);
        this.$set(this.queryData, 'pageSize', this.pageSize);
        this.$set(this.queryData, 'getByself', '');
        this.$set(this.queryData, 'getFast', '');
        this.$set(this.queryData, 'getCommon', '');
        this.$set(this.queryData, 'transnational', '');
        this.$set(this.queryData, this.durgfrom, 'all');
        this.$set(this.queryData, 'sellerUserId', this.sellerUserId);
        // this.requestData.sellerUserId = this.sellerFrom;
        // 添加搜索表单内容
        let searchData = this.searchForm;
        for (let key in searchData) {
          if (key) {
            this.$set(this.queryData, key, searchData[key]);
          }
        }
        if (this.queryData.productId) {
          this.$delete(this.queryData, 'productId');
        }
        if (this.queryData.minProductId === 0 || !!this.queryData.minProductId === false) {
          this.$delete(this.queryData, 'minProductId');
        }
        if (this.queryData.maxProductId === 0 || !!this.queryData.maxProductId === false) {
          this.$delete(this.queryData, 'maxProductId');
        }
        if (!this.queryData.isChecked) {
          this.$delete(this.queryData, 'isChecked');
        }
      } else {
        this.$delete(this.queryData, 'from');
        // 绑定搜索表单内容
        let searchData = this.searchForm;
        for (let key in searchData) {
          if (key) {
            this.searchForm[key] = this.queryData[key];
          }
        }
      }
      if (this.queryData.isOtc !== '') {
        let str = null;
        let array = [];
        let values = [];
        str = this.queryData.isOtc;
        if (typeof (str) === 'string') {
          array = str.split(',');
          for (let i = 0; i < array.length; i++) {
            let value = array[i];
            values.push(value);
          }
          this.searchForm.isOtc = values;
        } else {
          this.searchForm.isOtc = this.queryData.isOtc;
          this.queryData.isOtc = this.queryData.isOtc.join(',');
        }
      }
      if (this.queryData.isChecked !== '') {
        let str = null;
        let array = [];
        let values = [];
        str = this.queryData.isChecked;
        if (typeof (str) === 'string') {
          array = str.split(',');
          for (let i = 0; i < array.length; i++) {
            let value = array[i];
            values.push(value);
          }
          this.searchForm.isChecked = values;
        } else {
          this.searchForm.isChecked = this.queryData.isChecked;
          this.queryData.isChecked = this.queryData.isChecked.join(',');
        }
      }
      // console.log(this.searchForm);
      // console.log(this.queryData);
      return this.queryData;
    },
    setDrugFrom() {
      let query = this.$route.query;
      if (query.getByself) {
        this.durgfrom = 'getByself';
      } else if (query.getFast) {
        this.durgfrom = 'getFast';
      } else if (query.transnational) {
        this.durgfrom = 'transnational';
      } else {
        this.durgfrom = 'getCommon';
      }
    },
    getDataList() {
      let _self = this;
      let query = _self.getQueryParams();
      ajax.post(`/mall_manage/back/product/query`, query).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
        }
      });
    },
    seach() {
      this.pageIndex = 1;
      this.getDataList();
    },
    getCategory() {
      let _self = this;
      ajax.get(`/mall_manage/back/category/getAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.category = res.data.resultData;
        }
      });
    },
    resetForm() {
      // 因返URL中可能带搜索条件，故采用调整方式清空
      // let link = location.href;
      // location.href = link.substring(0, link.indexOf('?'));
      // this.$router.push({
      //   path: '/drug-control/list',
      //   query: {}
      // });

      let emptySearchData = {
        // 药品名称
        productName: '',
        // 商品SKU
        productSku: '',
        // 分类ID
        categoryCode: '',
        // 审核状态 1已审核 2未审核
        isChecked: [],
        // 生产厂商
        productProducingPlace: '',
        // 最小商品ID
        minProductId: 0,
        // 最大商品ID
        maxProductId: 0,
        // 批准文号
        productApprovalNumber: '',
        // 切制规格
        productCutSpecification: '',
        // 炮制规格
        productPrepareSpecification: '',
        // 药品成分
        pharmaceuticalIngredients: '',
        // 产品类型
        productType: '',
        // 备注
        remarks: '',
        // 产品类型
        isOtc: [],
        // 产品来源
        sellerUserId: '',
        // 医生分类
        categoryDoctors: '',
        // 商品图片
        isPrdouctImg: '',
        // 条形码
        productBarCode: '',
      };
      this.searchForm = emptySearchData;
      this.durgfrom = 'getCommon';
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
    // 首字母大写
    titleCase(str) {
      return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    },
    sortChange(params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          let name = 'orderBy' + this.titleCase(key);
          this.$delete(this.queryData, name);
          let value = params[key];
          if (value) {
            this.$set(this.queryData, name, value);
          }
        }
      }
      this.seach();
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        // alert(`删除商品：${params.rowData.productName}`);
        this.$alert('完善中...');
      } else if (params.type === 'edit') {
        let _self = this;
        let productId = params.rowData.productId;
        let getFast = params.rowData.getFast;
        let getByself = params.rowData.getByself;
        let getCommon = params.rowData.getCommon;
        let transnational = params.rowData.transnational;
        let source = null;
        if (getFast || getByself || getCommon || transnational) {
          source = {
            getFast: getFast,
            getByself: getByself,
            getCommon: getCommon,
            transnational: transnational
          };
        }

        _self.goEditPage(productId, source);
      } else if (params.type === 'check_pass') {
        let _self = this;
        _self.$confirm(`确定将药品"${params.rowData.productName}"上架吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.checkedDrug(params.rowData.productId, true);
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      } else if (params.type === 'check_reject') {
        let _self = this;
        _self.$confirm(`确定将药品"${params.rowData.productName}"下架吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.checkedDrug(params.rowData.productId, false);
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      } else if (params.type === 'view') {
        let _self = this;
        let data = {};
        let productId = params.rowData.productId;
        data.productId = productId;
        let getFast = params.rowData.getFast;
        let getByself = params.rowData.getByself;
        let getCommon = params.rowData.getCommon;
        let transnational = params.rowData.transnational;
        if (getFast || getByself || getCommon || transnational) {
          data.getFast = getFast;
          data.getByself = getByself;
          data.getCommon = getCommon;
          data.transnational = transnational;
        } else {
          data.getCommon = 'all';
        }
        _self.viewDialogVisible = true;
        let url = getParamString(data, _self.viewDrugUrlBase);
        _self.viewDrugUrl = url;
        let iframe = document.getElementById('viewDrugIframe');
        if (iframe) {
          iframe.contentWindow.location.reload(true);
        }
      }
    },
    goEditPage(productId, source) {
      let query = this.getQueryParams();
      query.productId = productId;
      if (source) {
        query.getFast = source.getFast;
        query.getByself = source.getByself;
        query.getCommon = source.getCommon;
        query.transnational = source.transnational;
      }
      let data = {
        name: 'editDrug',
        path: '/drug-control/editDrug',
        meta: {
          title: '编辑商品'
        },
        query: query
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      this.$router.push({
        path: data.path,
        query: query
      });
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
    // 审核药品
    checkedDrug(productId, pass) {
      let _self = this;
      let ischecked = pass === true ? 1 : 2;
      let msg = pass === true ? '上架成功' : '下架成功';
      let postData = {
        productId: productId,
        isChecked: ischecked
      };
      postData[_self.durgfrom] = 'all';
      postData[_self.from] = 'all';
      ajax.post('/mall_manage/back/product/updateProductCheckStatusById', postData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            showClose: true,
            message: msg,
            type: 'success'
          });
          _self.getDataList();
        }
      });

    },
    // 新增
    add() {
      let query = this.getQueryParams();
      let data = {
        name: 'addDrug',
        path: '/drug-control/addDrug',
        meta: {
          title: '新增商品'
        },
        query: query
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      this.$router.push({
        path: data.path,
        query: query
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        let idList = [];
        for (let item of this.selection) {
          idList.push(item.productId);
        }
        alert('delete:' + idList.join(','));
      }
    },
    // 获取医生商品分类
    getDoctorCategory() {
      let _self = this;
      ajax.get(`/mall_manage/back/category/getDoctorsAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.doctorCategory = res.data.resultData;
        }
      });
    },
  },
  created() {
    this.getSellUser();
    this.getCategory();
    this.getDoctorCategory();
    window.previewImg = this.previewImg;
    this.setDrugFrom();
    // 根据返回参数赋值搜索表单
    if (this.$route.query.from) {
      this.pageIndex = parseInt(this.$route.query.pageNum, 10);
      this.pageSize = parseInt(this.$route.query.pageSize, 10);
      this.queryData = this.$route.query;
    }
    this.getDataList();
  }
};
</script>
