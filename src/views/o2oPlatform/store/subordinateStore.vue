<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="状态">
          <el-select v-model="business.status" size='small' placeholder="请选择状态">
            <el-option
              v-for="item in statusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="business.city"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="business.name"></el-input>
        </el-form-item>
         <el-form-item label="品牌">
          <el-input v-model="business.brand"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <h2>
      搜索结果 （共{{total}}家）
    </h2>
    <div class="feedbackFeedback">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageIndex" :page-size="business.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // 状态
      statusArray: [
        { value: '1', label: '待申请' },
        { value: '2', label: '审核通过' },
        { value: '3', label: '审核未通过' },
        { value: '4', label: '停用' },
      ],
      typeList: {
        '1': '仓库',
        '2': '药店',
        '3': '药柜',
        '4': '跨境电商'
      },
      // 请求参数
      business: {
        pageIndex: this.$route.query.index ? Number(this.$route.query.index) : 1,
        pageSize: 10,
        // userId: 'f6639d500e83468b805b080acbb69d4f',
        // userId: this.$route.query.userId,
        name: '',
        city: '',
        status: '',
        userId: '',
        brand: '',
      },
      isLoding: true,
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 40, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '商户名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'businessType', title: '商户类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'brand', title: '所属品牌', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressProvince', title: '省份', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '商户地址', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'auditStatus', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-subordinateStore', isResize: true }
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
        if (item.field === 'businessType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let value = _self.typeList[v];
            return value || '-';
          };
        }
        if (item.field === 'auditStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return '<span style="color:red">待申请</span>';
            } else if (value === '2') {
              return '<span style="color:green">审核通过</span>';
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
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  methods: {
    // oto店铺列表
    getTableData() {
      console.log(this.business);
      if (!this.business.userId) {
        this.isLoding = false;
        return false;
      }
      javaAjax.post(`/mall_manage/store/third/querySellerUser`, this.business).then((res) => {
        this.isLoding = false;
        console.log('oto店铺列表返回数据', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.status = '';
      this.business.city = '';
      this.business.name = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 自定义组件操作
    customCompFunc(params) {
      // 查看店铺信息
      if (params.type === 'storeInfo') {
        let isExamine = true;
        if (params.rowData.auditStatus === '2' || params.rowData.auditStatus === '4') {
          isExamine = false;
        }
        this.$router.push('/o2oPlatform/store/storeInfo?id=' + params.rowData.sellerUserId + '&index=' + this.business.pageIndex + '&isExamine=' + isExamine);
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
  },
  created() {
    // if (sessionStorage.getItem('seeStore')) {
    //   this.userId = sessionStorage.getItem('seeStore');
    //   console.log('userId', this.userId);
    //   this.getTableData();
    // } else {
    //   this.getTableData();
    // }
    this.business.userId = sessionStorage.getItem('seeStore');
    // this.business.userId = 'f6639d500e83468b805b080acbb69d4f';
    console.log(sessionStorage.getItem('seeStore'));
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
.search-wrapper{
  display: flex;
  justify-content: space-between;
}
h2{
  font-size: 20px;
  line-height: 30px;
}
</style>