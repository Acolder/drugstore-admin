<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" class="cityBox">
              <el-input v-model="business.city" suffix-icon="el-icon-search" @blur="cityBlur" @focus="cityFocus" placeholder="请选择城市"></el-input>
              <ul v-show="cityDialog">
                <li v-for="item in cityTempArray" :key="item.index" @click="choiceCity(item.city)">{{item.city}}</li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店状态">
              <el-select v-model="business.auditStatus" size='small' placeholder="请选择">
                <el-option
                  v-for="item in auditStatusArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第三方药店名称">
              <el-input v-model="business.name" placeholder="请输入药店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="feedbackFeedback">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageIndex" :page-size="business.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 编辑药品列表 -->
    <el-dialog title="编辑药品列表" :visible.sync="drugsList" :modal-append-to-body="false" width="70%" center>
      <div class="search-wrapper">
        <el-form :inline="true" :model="business2" size="small">
          <el-form-item label="药品名称">
            <el-input v-model="business2.productName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="default" icon="el-icon-delete" size="small" @click="empty2">清空</el-button>
            <el-button type="primary" icon="el-icon-search" size="small" @click="query2">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="operation">
        <el-button type="primary" size="small" @click="addDrugs">添加药品</el-button>
        <el-button type="primary" size="small" @click="emptyDrugs">清空商品</el-button>
      </div>
      <div class="feedbackFeedback">
        <v-table ref="data_table2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
        row-click-color="#edf7ff" @on-custom-comp="customCompFunc2" :select-all="selectALL2" :select-change="selectChange2" :select-group-change="selectGroupChange2"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange2" @page-size-change="pageSizeChange2" :total="total2" :page-index="business2.pageIndex" :page-size="business2.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </el-dialog>
    <!-- 弹框新增药品表格 -->
    <el-dialog title="请选择新增的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center @close="closeDialog" :close-on-click-modal="false" >
      <iframe :src="dialogFormVisibleUrl" frameborder="0" style="width:100%;height:700px;background-color:#FFF;"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // 城市
      cityDialog: false,
      cityTempArray: [],
      cityTempNum: '',
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        auditStatus: '',
        city: '',
        name: '',
      },
      // 渠道
      typeArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 门店状态
      auditStatusArray: [
        { value: 1, label: '审核中' },
        { value: 2, label: '上架' },
        { value: 3, label: '未通过' },
        { value: 4, label: '停用' },
      ],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 药品列表
      drugsList: false,
      // 请求参数
      business2: {
        pageIndex: 1,
        pageSize: 10,
        productName: '',
      },
      // 表格数据
      tableData2: [],
      // 选择的记录
      selection2: [],
      // 总数
      total2: 0,
      // 新增药品弹窗
      productShow: false,
      dialogFormVisibleUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '药店名称', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '地址', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'auditStatus', title: '门店状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformDrugsLocal', isResize: true }
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
        if (item.field === 'auditStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:gray;">审核中</span>`;
            } else if (value === '2') {
              return `<span style="color:green;">上架</span>`;
            } else if (value === '3') {
              return `<span style="color:red;">未通过</span>`;
            } else if (value === '4') {
              return `<span style="color:red;">停用</span>`;
            }
          };
        }
      }
      return columns;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business2.pageIndex - 1) * _self.business2.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '药品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appMedicineStatus', title: '第三方库存', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appMedicinePrice', title: '第三方价格', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformChannelActivity', isResize: true }
      ];
      for (let i = 0; i < columns2.length; i++) {
        let item = columns2[i];
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
      return columns2;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
      this.$refs['data_table2'].resize();
    },
    'business.city': function() {
      if (!this.business.city) {
        this.getCityData();
      } else {
        this.cityTempArray = this.cityTempArray.filter((item, index, arr) => {
          return item.city.indexOf(this.business.city) !== -1;
        });
      }
    },
  },
  methods: {
    // 加载城市
    getCityData() {
      javaAjax.post(`/mall_manage/store/third/selectCity`).then((res) => {
        console.log('加载城市', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.cityTempArray = res.data.resultData;
          this.cityTempNum = this.cityTempArray.length;
        }
      });
    },
    cityFocus() {
      this.cityDialog = true;
    },
    cityBlur() {
      let _this = this;
      setTimeout(function () {
        _this.cityDialog = false;
      }, 1000);
    },
    choiceCity(res) {
      console.log(res);
      this.business.city = res;
      this.cityDialog = false;
    },
    getTableData() {
      console.log(this.business);
      javaAjax.post(`/mall_manage/store/third/selectStore`, this.business).then((res) => {
        console.log('渠道门店管理列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    getTableData2() {
      console.log(this.business2);
      // javaAjax.post(`/mall_manage/third/medicine/queryThirdMedicineList`, this.business2).then((res) => {
      //   console.log('药品列表', res);
      //   if (res.status === 200 && res.data.resultCode === '0') {
      //     this.tableData2 = res.data.resultData.data;
      //     this.total2 = res.data.resultData.total;
      //   }
      // });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.city = '';
      this.business.auditStatus = '';
      this.business.name = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 自定义组件操作
    customCompFunc(params) {
      // 药品列表
      if (params.type === 'drugs') {
        // this.business2.appPoiCode = params.rowData.appPoiCode;
        // this.business2.type = params.rowData.type;
        // this.getTableData2();
        // this.drugsList = true;
        this.$message({
          type: 'error',
          message: '本地药品功能暂不支持!'
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
      this.business.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableData();
    },
    // 自定义组件操作2
    customCompFunc2(params) {
      // 删除操作
      if (params.type === 'deleteRow') {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('删除');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 清空2
    empty2() {
      this.business2.pageIndex = 1;
      this.business2.pageSize = 10;
      this.getTableData2();
    },
    // 查询2
    query2() {
      this.getTableData2();
    },
    // 添加药品
    addDrugs() {
      this.productShow = true;
      console.log('添加药品');
    },
    setSelectedList(data, productNum) {
      if (data !== false && productNum === true) {
        console.log(data);
        this.productShow = false;
      } else if (data === false) {
        this.productShow = false;
      } else {
        this.$message({
          message: '只能选1个',
          type: 'error'
        });
      }
    },
    // 清空商品
    emptyDrugs() {
      console.log('清空商品');
    },
    closeDialog() {
      // this.getTableData2();
    },
    // 全选反选2
    selectALL2(selection) {
      this.selection2 = selection;
    },
    selectChange2(selection, rowData) {
      this.selection2 = selection;
    },
    selectGroupChange2(selection) {
      this.selection2 = selection;
    },
    // 分页2
    pageChange2(pageIndex) {
      this.business2.pageIndex = pageIndex;
      this.getTableData2();
    },
    pageSizeChange2(pageSize) {
      this.business2.pageSize = pageSize;
      this.getTableData2();
    },
  },
  created() {
    this.getCityData();
    this.getTableData();
    window.setSelectedList = this.setSelectedList;
  },
};
</script>
<style lang="less" scoped>
.box{
  /deep/ .el-dialog.el-dialog--center{
    height: 700px;
    overflow-y: auto;
  }
  // 城市选择
  .cityBox{
    position: relative;
    ul{
      left: 0;
      right: 0;
      position: absolute;
      height: 140px;
      overflow-y: auto;
      background: #fff;
      z-index: 10000;
      padding: 10px 0px;
      border-radius: 5px;
      border: 1px solid #ccc;
      li{
        padding: 0px 10px;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
      }
    }
  }
}
.operation{
  margin-bottom: 10px;
}
</style>