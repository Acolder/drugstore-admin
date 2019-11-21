<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="渠道">
              <el-select v-model="business.type" size='small' placeholder="请选择">
                <el-option
                  v-for="item in typeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三方药店名称">
              <el-input v-model="business.name" placeholder="请输入药店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="search-wrapper">
      <!-- <el-button type="primary" size="small" style="height:32px;" @click="synchronousInventory">一键同步库存</el-button> -->
      <el-button type="primary" size="small" style="height:32px;" @click="synchronousDrugs">同步药品</el-button>
      <el-button type="primary" size="small" style="height:32px;" @click="synchronousInventory">同步库存</el-button>
      <el-button type="primary" size="small" style="height:32px;" @click="SynchronizationOfDrugPrices">同步药品价格</el-button>
      <el-button v-if="isHungry == 1" type="primary" size="small" @click="bindingClassification">绑定分类</el-button>
    </div>
    <div class="feedbackFeedback">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageIndex" :page-size="business.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 门店药品管理 -->
    <el-dialog title="门店药品管理" :visible.sync="commodityList" :modal-append-to-body="false"  width="70%" center>
      <div class="region">
        <div v-if="business2.type == 1">美团</div>
        <div v-if="business2.type == 2">饿了么</div>
        <div v-if="business2.type == 4">京东到家</div>
        <div>药品列表</div>
      </div>
      <div class="search-wrapper">
        <el-form :inline="true" :model="business2" size="small" class="operation">
          <div>
            <el-form-item label="药品名称">
              <el-input v-model="business2.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty2">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query2">查询</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <!-- <el-button v-if="business2.type == 2" type="primary" size="small" @click="bindingClassification">绑定分类</el-button> -->
            <el-button type="primary" size="small" @click="exportCommodity">导出药品</el-button>
            <!-- <el-button type="primary" size="small" @click="synchronousStock">同步库存</el-button>
            <el-button type="primary" size="small" @click="synchronousPrice">同步价格</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="feedbackFeedback">
        <v-table ref="data_table2" :is-loading="isLoding2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
        row-click-color="#edf7ff" @on-custom-comp="customCompFunc2" :select-all="selectALL2" :select-change="selectChange2" :select-group-change="selectGroupChange2"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange2" @page-size-change="pageSizeChange2" :total="total2" :page-index="business2.pageIndex" :page-size="business2.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </el-dialog>
    <!-- 编辑药品 -->
    <el-dialog title="编辑药品" :visible.sync="editedGoods" :modal-append-to-body="false" width="40%" center>
      <el-form :model="modifyDrugs" ref="modifyDrugsForm" :rules="rules">
        <el-form-item label="药品名称:" label-width="140px">
          <el-input v-model="modifyDrugsName" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型:" label-width="140px">
          <el-select v-model="modifyDrugs.type" placeholder="请选择" :disabled="true">
            <el-option label="美团" value="1"></el-option>
            <el-option label="饿了么" value="2"></el-option>
            <el-option label="京东到家" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="药品分类名称:" label-width="140px">
          <el-input v-model="modifyDrugs.categoryName" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="第三方门店id:" label-width="140px">
          <el-input v-model="modifyDrugs.appPoiCode" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="药品code:" label-width="140px">
          <el-input v-model="modifyDrugs.appMedicineCode" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="药品价格:" label-width="140px" prop="appMedicinePrice">
          <el-input v-model="modifyDrugs.appMedicinePrice" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="药品分类code:" label-width="140px">
          <el-input v-model="modifyDrugs.categoryCode" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editedGoods = false">取 消</el-button>
        <el-button type="primary" @click="queryModifyDrugs">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 门店药品分类管理 -->
    <el-dialog title="门店药品分类管理" :visible.sync="classification" :modal-append-to-body="false"  width="70%" center>
      <div class="region">
        <div v-if="business3.type == 1">美团</div>
        <div v-if="business3.type == 2">饿了么</div>
        <div v-if="business3.type == 4">京东到家</div>
        <div>分类管理</div>
      </div>
      <!-- <div class="search-wrapper">
        <el-form :inline="true" :model="business3" size="small" class="operation">
          <div>
            <el-form-item label="分类名称">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty3">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query3">查询</el-button>
            </el-form-item>
          </div>
          <div>
            <el-button type="primary" size="small" @click="initialization">同步药品分类</el-button>
          </div>
        </el-form>
      </div> -->
      <div class="search-wrapper">
        <el-button type="primary" size="small" @click="initialization">同步药品分类</el-button>
      </div>
      <div class="feedbackFeedback">
        <v-table ref="data_table3" :is-loading="isLoding3" column-width-drag is-horizontal-resize style="width:100%" :columns="columns3" :table-data="tableData3" row-hover-color="#eee"
        row-click-color="#edf7ff" @on-custom-comp="customCompFunc3" :select-all="selectALL3" :select-change="selectChange3" :select-group-change="selectGroupChange3"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange3" @page-size-change="pageSizeChange3" :total="total3" :page-index="business3.pageIndex" :page-size="business3.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="editedClassification" :modal-append-to-body="false" width="40%" center>
      <el-form :model="modifyClassification" ref="modifyClassificationForm" :rules="rules">
        <el-form-item label="类型:" label-width="140px">
          <el-select v-model.number="modifyClassification.type" placeholder="请选择" :disabled="true">
            <el-option
              v-for="item in typeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="第三方门店id:" label-width="140px">
          <el-input v-model="modifyClassification.appPoiCode" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类code:" label-width="140px">
          <el-input v-model="modifyClassification.categoryCode" placeholder="请输入" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="分类名称:" label-width="140px" prop="categoryName">
          <el-input v-model="modifyClassification.categoryName" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editedClassification = false">取 消</el-button>
        <el-button type="primary" @click="queryModifyClassification">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 门店未同步药品 -->
    <el-dialog title="门店未同步药品" :visible.sync="unsynchronized" :modal-append-to-body="false"  width="70%" center>
      <div class="search-wrapper">
        <!-- <el-button type="primary" size="small" @click="synchronousCommodity">同步药品</el-button> -->
        <el-button type="primary" size="small" @click="exportCommodity2">导出药品</el-button>
      </div>
      <div class="feedbackFeedback">
        <v-table ref="data_table4" :is-loading="isLoding4" column-width-drag is-horizontal-resize style="width:100%" :columns="columns4" :table-data="tableData4" row-hover-color="#eee"
        row-click-color="#edf7ff"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange4" @page-size-change="pageSizeChange4" :total="total4" :page-index="business4.pageIndex" :page-size="business4.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
import { base64Encrypt } from '@/utils/auth';
export default {
  data() {
    return {
      isHungry: 0,
      // 渠道
      typeArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 门店状态
      openLevelArray: [
        { value: 1, label: '可配送' },
        { value: 3, label: '休息中' },
      ],
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        type: 1,
        name: '',
        openLevel: '',
      },
      isLoding: true,
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 药品列表 分类列表
      appPoiCode: '',
      sellerId: '',
      // 门店药品管理
      commodityList: false,
      // 请求参数
      business2: {
        pageIndex: 1,
        pageSize: 10,
        type: '',
        appPoiCode: '',
        productName: '',
      },
      isLoding2: true,
      // 表格数据
      tableData2: [],
      // 选择的记录
      selection2: [],
      // 总数
      total2: 0,
      // 编辑药品
      editedGoods: false,
      modifyDrugsName: '',
      modifyDrugs: {
        type: '',
        appPoiCode: '',
        appMedicineCode: '',
        appMedicinePrice: '',
        categoryCode: '',
        categoryName: '',
      },
      // 门店分类管理
      classification: false,
      // 请求参数
      business3: {
        pageIndex: 1,
        pageSize: 10,
        appPoiCode: '',
        type: '',
      },
      isLoding3: true,
      // 表格数据
      tableData3: [],
      // 选择的记录
      selection3: [],
      // 总数
      total3: 0,
      // 编辑分类
      editedClassification: false,
      modifyClassification: {
        type: '',
        appPoiCode: '',
        categoryCode: '',
        categoryName: '',
      },
      // 未同步药品列表
      unsynchronized: false,
      // 请求参数
      business4: {
        pageIndex: 1,
        pageSize: 10,
        appPoiCode: '',
        type: '',
        sellerId: '',
      },
      isLoding4: true,
      // 表格数据
      tableData4: [],
      // 选择的记录
      selection4: [],
      // 总数
      total4: 0,
      // 数据验证
      rules: {
        appMedicinePrice: [{ required: true, validator: this.validAppMedicinePrice, trigger: 'blur' }],
        categoryName: [{ required: true, validator: this.validCategoryName, trigger: 'blur' }],
      },
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 40, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'type', title: '渠道', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '药店名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sellerUserId', title: '本地id', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appPoiCode', title: '第三方id', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 300, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformDrugsOther', isResize: true }
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
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:#f37b1d;">美团</span>`;
            } else if (value === '2') {
              return `<span style="color:#3bb4f2;">饿了么</span>`;
            } else if (value === '4') {
              return `<span style="color:red;">京东到家</span>`;
            }
          };
        }
      }
      return columns;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        // { width: 50, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        // {
        //   field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
        //   formatter: function (rowData, rowIndex, pagingIndex, field) {
        //     let index = (_self.business2.pageIndex - 1) * _self.business2.pageSize + rowIndex + 1;
        //     return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        //   }, isFrozen: true, isResize: true
        // },
        { field: 'productName', title: '药品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categoryName', title: '所属分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productId', title: '本地id', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productPrice', title: '本地价格', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productStock', title: '本地库存', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appMedicineCode', title: '第三方id', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appMedicinePrice', title: '第三方价格', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appMedicineStock', title: '第三方库存', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformDrugsOtherDeletion', isResize: true }
      ];
      for (let i = 0; i < columns2.length; i++) {
        let item = columns2[i];
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
        if (item.field === 'productPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              value = _self.fractionalProcessing(value);
              return value;
            } else {
              return `-`;
            }
          };
        }
        if (item.field === 'productStock') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              value = _self.fractionalProcessing0(value);
              return value;
            } else {
              return `-`;
            }
          };
        }
      }
      return columns2;
    },
    columns3() {
      let _self = this;
      let columns3 = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business3.pageIndex - 1) * _self.business3.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'category_name', title: '分类名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sequence', title: '分类排序', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformDrugsOtherClassification', isResize: true }
      ];
      for (let i = 0; i < columns3.length; i++) {
        let item = columns3[i];
        if (i < 1) {
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
      return columns3;
    },
    columns4() {
      let _self = this;
      let columns4 = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business4.pageIndex - 1) * _self.business4.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productId', title: '药品id', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSku', title: '商品SKU', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '药品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '规格', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂家', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productApprovalNumber', title: '批准文号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productPrice', title: '价格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productBarCode', title: '条形码', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns4.length; i++) {
        let item = columns4[i];
        if (i < 1) {
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
      return columns4;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
      this.$refs['data_table2'].resize();
      this.$refs['data_table3'].resize();
      this.$refs['data_table4'].resize();
    }
  },
  methods: {
    // 小数处理
    fractionalProcessing(val) {
      return Number(val).toFixed(2);
    },
    fractionalProcessing0(val) {
      return Number(val).toFixed(0);
    },
    // 价格验证
    isvalidAppMedicinePrice(str) {
      let price = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      return price.test(str);
    },
    validAppMedicinePrice(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入价格'));
      } else if (!this.isvalidAppMedicinePrice(value)) {
        callback(new Error('请输入正确的价格值'));
      } else {
        callback();
      }
    },
    // 分类名称验证
    isvalidCategoryName(str) {
      let nameReg = /[^a-zA-Z0-9_\u4e00-\u9fa5]/g;
      return nameReg.test(str);
    },
    validCategoryName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入分类名称'));
      } else if (this.isvalidCategoryName(value)) {
        callback(new Error('分类名称不支持特殊符号'));
      } else {
        callback();
      }
    },
    getTableData() {
      console.log(this.business);
      javaAjax.post(`/mall_manage/store/third/selectStoreToday`, this.business).then((res) => {
        console.log('第三方药店列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.isLoding = false;
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
          if (this.business.type === 2) {
            this.isHungry = 1;
          } else {
            this.isHungry = 0;
          }
        } else {
          this.isLoding = false;
        }
      });
    },
    getTableData2() {
      console.log(this.business2);
      javaAjax.post(`/mall_manage/third/medicine/queryThirdMedicineList`, this.business2).then((res) => {
        console.log('查询药品列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.isLoding2 = false;
          this.tableData2 = res.data.resultData.data;
          this.total2 = res.data.resultData.total;
        } else {
          this.isLoding2 = false;
        }
      });
    },
    getTableData3() {
      console.log('查询分类列表参数', this.business3);
      javaAjax.post(`/mall_manage/third/medicine/listMedicineCat`, this.business3).then((res) => {
        console.log('查询分类列表结果', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.isLoding3 = false;
          this.tableData3 = res.data.resultData.data;
          this.total3 = res.data.resultData.total;
        } else {
          this.tableData3 = [];
          this.total3 = 0;
          this.isLoding3 = false;
        }
      });
    },
    getTableData4() {
      console.log(this.business4);
      javaAjax.post(`/mall_manage/third/medicine/queryNotSysMedicineList`, this.business4).then((res) => {
        console.log('未同步药品列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.isLoding4 = false;
          this.tableData4 = res.data.resultData.data;
          this.total4 = res.data.resultData.total;
        } else {
          this.isLoding4 = false;
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.type = 1;
      this.business.openLevel = '';
      this.business.name = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 一键同步库存
    // synchronousInventory() {
    //   javaAjax.post(`/mall_manage/third/medicine/synMedicineStockAll`, {}).then((res) => {
    //     console.log('一键同步所有第三方门店库存', res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.$message({
    //         type: 'success',
    //         message: res.data.msg
    //       });
    //       this.getTableData();
    //     }
    //   });
    // },
    // 同步药品
    synchronousDrugs() {
      console.log(this.selection);
      if (this.selection.length <= 0) {
        this.$message({
          message: '请先先勾选药店',
          type: 'error'
        });
        return false;
      }
      let temp = [];
      for (let i = 0; i < this.selection.length; i++) {
        temp.push(this.selection[i].sellerUserId);
      }
      let data = {
        sellerIds: temp.toString(),
        type: this.business.type
      };
      console.log('同步药品参数', data);
      javaAjax.post(`/mall_manage/third/medicine/synMedicine`, data).then((res) => {
        console.log('同步药品结果', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getTableData();
        }
      });
    },
    // 同步库存
    synchronousInventory() {
      console.log(this.selection);
      if (this.selection.length <= 0) {
        this.$message({
          message: '请先先勾选药店',
          type: 'error'
        });
        return false;
      }
      let temp = [];
      for (let i = 0; i < this.selection.length; i++) {
        temp.push(this.selection[i].sellerUserId);
      }
      let data = {
        sellerIds: temp.toString(),
        type: this.business.type
      };
      console.log('同步库存参数', data);
      javaAjax.post(`/mall_manage/third/medicine/synMedicineStock`, data).then((res) => {
        console.log('同步库存结果', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getTableData();
        }
      });
    },
    // 同步药品价格
    SynchronizationOfDrugPrices() {
      console.log(this.selection);
      if (this.selection.length <= 0) {
        this.$message({
          message: '请先先勾选药店',
          type: 'error'
        });
        return false;
      }
      let temp = [];
      for (let i = 0; i < this.selection.length; i++) {
        temp.push(this.selection[i].sellerUserId);
      }
      let data = {
        sellerIds: temp.toString(),
        type: this.business.type
      };
      console.log('同步药品价格参数', data);
      javaAjax.post(`/mall_manage/third/medicine/synMedicinePrice`, data).then((res) => {
        console.log('同步药品价格结果', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getTableData();
        }
      });
    },
    // 绑定分类
    bindingClassification() {
      console.log(this.selection);
      if (this.selection.length <= 0) {
        this.$message({
          message: '请先先勾选药店',
          type: 'error'
        });
        return false;
      }
      let temp = [];
      for (let i = 0; i < this.selection.length; i++) {
        temp.push(this.selection[i].sellerUserId);
      }
      let data = {
        sellerIds: temp.toString(),
      };
      console.log('绑定分类参数', data);
      javaAjax.post(`/mall_manage/third/medicine/skuShopCategoryMap`, data).then((res) => {
        console.log('绑定药品与自定义分类结果', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getTableData();
        }
      });
    },
    // 自定义组件操作1
    customCompFunc(params) {
      this.appPoiCode = params.rowData.appPoiCode;
      this.sellerId = params.rowData.sellerUserId;
      // 药品列表
      if (params.type === 'drugs') {
        this.business2.type = this.business.type;
        this.business2.appPoiCode = params.rowData.appPoiCode;
        this.getTableData2();
        this.commodityList = true;
      }
      // 分类列表
      if (params.type === 'classification') {
        this.business3.type = this.business.type;
        this.business3.appPoiCode = params.rowData.appPoiCode;
        this.getTableData3();
        this.classification = true;
      }
      // 未同步药品列表
      if (params.type === 'unsynchronized') {
        this.business4.appPoiCode = params.rowData.appPoiCode;
        this.business4.type = this.business.type;
        this.business4.sellerId = params.rowData.sellerUserId;
        this.getTableData4();
        this.unsynchronized = true;
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
      this.business.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableData();
    },
    // 清空2
    empty2() {
      this.business2.pageIndex = 1;
      this.business2.pageSize = 10;
      this.business2.productName = '';
      this.getTableData2();
    },
    // 查询2
    query2() {
      this.getTableData2();
    },
    // 自定义组件操作2
    customCompFunc2(params) {
      console.log(params.rowData);
      // 编辑药品
      if (params.type === 'edit') {
        this.modifyDrugsName = params.rowData.productName;
        this.modifyDrugs.type = params.rowData.type;
        this.modifyDrugs.appPoiCode = params.rowData.appPoiCode;
        this.modifyDrugs.appMedicineCode = params.rowData.appMedicineCode;
        this.modifyDrugs.appMedicinePrice = params.rowData.appMedicinePrice;
        this.modifyDrugs.categoryCode = params.rowData.categoryCode;
        this.modifyDrugs.categoryName = params.rowData.categoryName;
        this.editedGoods = true;
      }
      // 删除药品
      if (params.type === 'deleteRow') {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            type: params.rowData.type,
            appPoiCode: params.rowData.appPoiCode,
            appMedicineCode: params.rowData.appMedicineCode,
          };
          console.log(data);
          javaAjax.post(`/mall_manage/third/medicine/deleteThirdMedicine`, data).then((res) => {
            console.log('删除药品', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.getTableData2();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 修改药品
    queryModifyDrugs() {
      console.log(this.modifyDrugs);
      this.$refs['modifyDrugsForm'].validate((valid) => {
        if (valid) {
          javaAjax.post(`/mall_manage/third/medicine/updateThirdMedicine`, this.modifyDrugs).then((res) => {
            console.log('修改药品', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.getTableData2();
              this.editedGoods = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 全选反选
    selectALL2(selection) {
      this.selection2 = selection;
    },
    selectChange2(selection, rowData) {
      this.selection2 = selection;
    },
    selectGroupChange2(selection) {
      this.selection2 = selection;
    },
    // 分页
    pageChange2(pageIndex) {
      this.business2.pageIndex = pageIndex;
      this.getTableData2();
    },
    pageSizeChange2(pageSize) {
      this.business2.pageSize = pageSize;
      this.getTableData2();
    },
    // 绑定分类
    // bindingClassification() {
    //   let data = {
    //     appPoiCode: this.appPoiCode,
    //     type: this.business2.type,
    //   };
    //   console.log(data);
    //   javaAjax.post(`/mall_manage/third/medicine/skuShopCategoryMap`, data).then((res) => {
    //     console.log('绑定药品与自定义分类', res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.$message({
    //         type: 'success',
    //         message: res.data.msg
    //       });
    //       this.getTableData2();
    //     }
    //   });
    // },
    // 导出药品 全部的
    exportCommodity() {
      console.log('导出药品');
      let param = {
        appPoiCode: this.appPoiCode,
        type: this.business2.type,
        productName: this.business2.productName,
      };
      param = JSON.stringify(param);
      param = base64Encrypt(param);
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage/third/medicine/exportMedicine?param=` + param);
    },
    // 同步库存
    // synchronousStock() {
    //   let data = {
    //     appPoiCode: this.appPoiCode,
    //     type: this.business2.type,
    //   };
    //   console.log(data);
    //   javaAjax.post(`/mall_manage/third/medicine/synMedicineStock`, data).then((res) => {
    //     console.log('同步库存', res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.$message({
    //         type: 'success',
    //         message: res.data.msg
    //       });
    //       this.getTableData2();
    //     }
    //   });
    // },
    // // 同步价格
    // synchronousPrice() {
    //   let data = {
    //     appPoiCode: this.appPoiCode,
    //     type: this.business2.type,
    //   };
    //   console.log(data);
    //   javaAjax.post(`/mall_manage/third/medicine/synMedicinePrice`, data).then((res) => {
    //     console.log('同步价格', res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.$message({
    //         type: 'success',
    //         message: res.data.msg
    //       });
    //       this.getTableData2();
    //     }
    //   });
    // },
    // 清空3
    empty3() {
      this.business3.pageIndex = 1;
      this.business3.pageSize = 10;
      this.getTableData3();
    },
    // 查询3
    query3() {
      this.getTableData3();
    },
    // 自定义组件操作3
    customCompFunc3(params) {
      console.log(params);
      // 上移
      if (params.type === 'upMove') {
        console.log(params.rowData);
        let data = {
          appPoiCode: params.rowData.app_poi_code,
          categoryCode: params.rowData.category_code,
          operateType: 'up',
          type: this.business3.type,
        };
        console.log('上移分类参数', data);
        javaAjax.post(`/mall_manage/third/medicine/updateMedicineCatSequence`, data).then((res) => {
          console.log('上移分类', res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.getTableData3();
          }
        });
      }
      // 下移
      if (params.type === 'downMove') {
        console.log(params.rowData);
        let data = {
          appPoiCode: params.rowData.app_poi_code,
          categoryCode: params.rowData.category_code,
          operateType: 'down',
          type: this.business3.type,
        };
        console.log('下移分类参数', data);
        javaAjax.post(`/mall_manage/third/medicine/updateMedicineCatSequence`, data).then((res) => {
          console.log('下移分类', res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.getTableData3();
          }
        });
      }
      // 编辑分类
      if (params.type === 'edit') {
        this.modifyClassification.type = this.business3.type;
        this.modifyClassification.appPoiCode = params.rowData.app_poi_code;
        this.modifyClassification.categoryCode = params.rowData.category_code;
        this.modifyClassification.categoryName = params.rowData.category_name;
        this.editedClassification = true;
        // this.$prompt('请输入分类名称', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputPattern: /\S/,
        //   inputErrorMessage: '分类名称不能为空'
        // })
        //   .then(({ value }) => {
        //     this.modifyClassification.categoryName = value;
        //     console.log(this.modifyClassification);
        //     javaAjax.post(`/mall_manage/third/medicine/updateMedicineCat`, this.modifyClassification).then((res) => {
        //       console.log('修改分类', res);
        //       if (res.status === 200 && res.data.resultCode === '0') {
        //         this.$message({
        //           type: 'success',
        //           message: res.data.msg
        //         });
        //         this.getTableData3();
        //       }
        //     });
        //   }).catch(() => {
        //     this.$message({
        //       type: 'info',
        //       message: '取消输入'
        //     });
        //   });
      }
      // 删除分类
      if (params.type === 'deleteRow') {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            type: this.business3.type,
            appPoiCode: params.rowData.app_poi_code,
            categoryCode: params.rowData.category_code,
          };
          console.log('删除分类参数', data);
          javaAjax.post(`/mall_manage/third/medicine/deleteMedicineCat`, data).then((res) => {
            console.log('删除分类结果', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.getTableData3();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 同步药品分类
    initialization() {
      let data = {
        appPoiCode: this.appPoiCode,
        type: this.business3.type,
      };
      console.log('同步药品分类', data);
      javaAjax.post(`/mall_manage/third/medicine/synMedicineCat`, data).then((res) => {
        console.log('同步药品分类', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getTableData3();
        }
      });
    },
    // 修改分类
    queryModifyClassification() {
      console.log(this.modifyClassification);
      this.$refs['modifyClassificationForm'].validate((valid) => {
        if (valid) {
          javaAjax.post(`/mall_manage/third/medicine/updateMedicineCat`, this.modifyClassification).then((res) => {
            console.log('修改分类', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.getTableData3();
              this.editedClassification = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 全选反选
    selectALL3(selection) {
      this.selection3 = selection;
    },
    selectChange3(selection, rowData) {
      this.selection3 = selection;
    },
    selectGroupChange3(selection) {
      this.selection3 = selection;
    },
    // 分页
    pageChange3(pageIndex) {
      this.business3.pageIndex = pageIndex;
      this.getTableData3();
    },
    pageSizeChange3(pageSize) {
      this.business3.pageSize = pageSize;
      this.getTableData3();
    },
    // 同步药品
    // synchronousCommodity() {
    //   let data = {
    //     appPoiCode: this.appPoiCode,
    //     sellerId: this.sellerId,
    //     type: this.business4.type,
    //   };
    //   console.log(data);
    //   javaAjax.post(`/mall_manage/third/medicine/synMedicine`, data).then((res) => {
    //     console.log('同步药品', res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.$message({
    //         type: 'success',
    //         message: res.data.msg
    //       });
    //       this.getTableData4();
    //     }
    //   });
    // },
    // 导出药品 未同步的
    exportCommodity2() {
      console.log('导出药品');
      let param = {
        appPoiCode: this.appPoiCode,
        type: this.business4.type,
        sellerId: this.sellerId,
      };
      console.log(param);
      param = JSON.stringify(param);
      param = base64Encrypt(param);
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage/third/medicine/exportNotSysMedicine?param=` + param);
    },
    // 分页
    pageChange4(pageIndex) {
      this.business4.pageIndex = pageIndex;
      this.getTableData4();
    },
    pageSizeChange4(pageSize) {
      this.business4.pageSize = pageSize;
      this.getTableData4();
    },
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
.box{
  /deep/ .el-dialog.el-dialog--center{
    height: 700px;
    overflow-y: auto;
  }
}
.region{
  display: flex;
  height: 40px;
  >div:first-child{
    font-size: 30px;
    margin-right: 20px;
  }
  >div:last-child{
    font-size: 15px;
  }
}
.operation{
  display: flex;
  justify-content: space-between;
}
</style>