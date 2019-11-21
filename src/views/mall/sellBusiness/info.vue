<template>
  <div id="business">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="商户名称">
          <el-input v-model.trim="business.sellerName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <!-- <el-col :span="6">
          <el-form-item label="所属品牌">
            <el-input  v-model="business.brand" placeholder="请输入所属品牌"></el-input>
          </el-form-item>
        </el-col> -->
        <el-form-item label="商户地址">
          <el-input v-model.trim="business.sellerAddress" placeholder="请输入商户地址"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="business.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="商户类型">
          <el-select style="width:205px;" v-model.trim="business.businessType" size='small'>
            <el-option
              v-for="item in raredrugOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属省份">
          <el-select v-model="business.addressProvince" size='small'>
            <el-option
              v-for="item in addressProvinceArray"
              :key="item.provinceId"
              :label="item.province"
              :value="item.provinceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属城市">
          <el-select v-model="business.addressCity" size='small'>
            <el-option
              v-for="item in addressCityArray"
              :key="item.cityId"
              :label="item.city"
              :value="item.cityId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 申请类型 （新）-->
        <el-form-item label="申请类型">
          <el-select v-model="business.applaytype" size='small'>
            <el-option
              v-for="item in applyType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 申请时间（新） -->
        <el-form-item label="申请时间" class="applyTime">
          <el-date-picker v-model="applayDate" type="datetimerange" align="right" style="width:350px" unlink-panels :picker-options="pickerOptions2"
          range-separator='至' start-placeholder="选择开始时间" end-placeholder="选择结束时间" value-format="yyyy-MM-dd" >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
          <!-- <el-button type="primary" icon="el-icon-share" size="small" @click="query">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="business.pageSize" :page-index="business.pageIndex"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    // console.log(this.$route.query.index);
    return {
      // 请求参数
      business: {
        pageIndex: this.$route.query.index ? Number(this.$route.query.index) : 1,
        pageSize: 10,
        sellerName: '',  // 商户名称
        brand: '', // 商户所属品牌
        addressProvince: '', // 门店所属省份
        addressCity: '', // 门店所属城市
        mobile: '', // 手机号
        sellerAddress: '', // 商户地址
        businessType: '', // 商户类型
        applyDateStart: '', // 申请开始时间(新)
        applyDateEnd: '',  // 申请结束时间(新)
        applaytype: '',  // 申请类型
      },
      applayDate: [], // 申请时间(新)
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      applyType: [  // 申请类型(新)
        { value: '', label: '全部' },
        { value: '1', label: '新增店铺' },
        { value: '2', label: '修改店铺信息' },
      ],
      raredrugOptions2: [
        { value: '1', label: '仓库' },
        { value: '2', label: '药店' },
        { value: '3', label: '药柜' },
        { value: '4', label: '跨境电商' },
        { value: '', label: '全部' }
      ],
      // 省份列表
      addressProvinceArray: [],
      // 城市列表
      addressCityArray: [],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 弹出框详情数据
      merchant: false,
      sellerUserId: '',
      detailData: {},
      activeName2: 'first',
      tabIndex: 0,
      tabName: '',
      typeList: {
        '1': '仓库',
        '2': '药店',
        '3': '药柜',
        '4': '跨境电商'
      }
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    },
    'business.addressProvince': function() {
      this.getCitiesByProvincial();
    },
    'applayDate': function () {
      if (!this.applayDate) {
        this.business.applyDateStart = '';
        this.business.applyDateEnd = '';
      } else {
        this.business.applyDateStart = this.applayDate[0];
        this.business.applyDateEnd = this.applayDate[1];
      }
    }
  },
  props: {
    isExamine: Boolean,
    // index: Number
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '药店名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'businessType', title: '药店类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'brand', title: '所属品牌', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressProvince', title: '所属省份', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '所属城市', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '商户地址', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'contact', title: '联系人电话', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'modifyDate', title: '申请时间', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'applyType', title: '申请类型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'auditStatus', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'numberDrugs', title: '商户药品品规数量', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-business', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
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
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            }
          };
        }
        if (item.field === 'businessType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let value = _self.typeList[v];
            return value || '-';
          };
        }
        if (item.field === 'modifyDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            }
          };
        }
        if (item.field === 'applyType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '新增店铺';
            } else if (value === 2) {
              return '修改店铺信息';
            }
          };
        }
        if (item.field === 'auditStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return '<span style="color:red">未审核</span>';
            } else if (value === '2') {
              let a = _self.isExamine ? '审核通过' : '正常';
              return '<span style="color:green">' + a + '</span>';
            } else if (value === '3') {
              return '<span style="color:red">审核未通过</span>';
            } else if (value === '4') {
              return '<span style="color:red">停用</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 清空
    empty() {
      this.business.sellerName = '';
      this.business.brand = '';
      this.business.addressProvince = '';
      this.business.addressCity = '';
      this.business.mobile = '';
      this.business.sellerAddress = '';
      this.business.businessType = '';
      this.business.applaytype = '';
      this.business.applyDateStart = '';
      this.business.applyDateEnd = '';
      this.applayDate = [];
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.getTableDataCondition();
    },
    // 查询
    query() {
      this.getTableDataCondition();
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 查看商户全部信息
      if (params.type === 'seeInformation') { // do delete operation
        this.$router.push('/sellBusiness/detail?id=' + params.rowData.sellerUserId + '&index=' + this.business.pageIndex + '&isExamine=' + this.isExamine);
      }
    },
    // 查询商户信息列表
    getTableDataCondition() {
      let _self = this;
      let url = this.isExamine ? '/mall_manage/authority/querySellerUserAudit' : '/mall_manage/authority/queryLikeSellUser';
      javaAjax.post(url, _self.business).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.total = res.data.resultData.sellerUserList.total;
          this.tableData = res.data.resultData.sellerUserList.data;
        }
      });
    },
    getProvincials() {
      // 省
      javaAjax.post(`/mall_manage/address/getProvincials`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.map(item => {
            return {
              province: item.province,
              provinceId: item.provinceId
            };
          });
          this.addressProvinceArray = newData;
        }
      });
    },
    getCitiesByProvincial() {
      // 市
      javaAjax.post(`/mall_manage/address/getCitiesByProvincial`, { provinceId: this.business.addressProvince }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.cities.map(item => {
            return {
              city: item.city,
              cityId: item.cityId,
              provinceId: item.provinceId,
            };
          });
          this.addressCityArray = newData;
        }
      });
    },
    // 分页
    pageChange(pageIndex) {
      this.business.pageIndex = pageIndex;
      this.getTableDataCondition();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableDataCondition();
    },
  },
  created() {
    // 获取省列表
    this.getProvincials();
    // 获取全部商户列表信息
    this.getTableDataCondition();
  }
};
</script>

<style lang="less" scoped>
#business{
  /deep/.el-select{
    width: 200px;
  }
}
.applyTime {
  /deep/ .el-range-separator{
    width: 10%;
  }
}
</style>
