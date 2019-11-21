<template>
  <div class="list">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" label-width="72px">
        <el-form-item label="名称:">
          <el-input v-model="searchInfo.activityName" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="searchInfo.activityType" clearable>
            <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchInfo.activityState" clearable>
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="default" @click="clean">清空</el-button>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="exportActive">导出</el-button>
          </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import { getToken, base64Encrypt } from '@/utils/auth';
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      searchInfo: {
        activityName: '',
        activityType: '',
        activityState: '',
        orderBy: 'desc',
        pageNum: 1,
        pageSize: 10
      },
      isLoding: true,
      columns: this.Columns(),
      tableData: [],
      total: 0,
      couponTypeList: [
        { label: '特价商品', value: '1' },
        { label: '商品满减', value: '2' },
        { label: '商品折扣', value: '3' },
        { label: '商品买赠', value: '4' },
        { label: '商品换购', value: '5' },
      ],
      stateList: [
        { label: '已删除', value: '0' },
        { label: '进行中', value: '1' },
        { label: '未开始', value: '2' },
        { label: '已结束', value: '3' },
      ],
      totalInfo: '',
      exportData: ''
    };
  },
  methods: {
    addSpecial() {
      // 新增特价商品
      this.$router.push('/market-control/activities/offerlist');
    },
    addFull() {
      // 新增满减商品
      this.$router.push('/market-control/activities/addfull');
    },
    addDiscount() {
      // 新增商品折扣
      this.$router.push('/market-control/activities/adddiscount');
    },
    addGift() {
      // 新增商品满赠
      this.$router.push('/market-control/activities/addgift');
    },
    addRepurchase() {
      // 新增商品换购
      this.$router.push('/market-control/activities/addchase');
    },
    Columns() {
      // 自定义表格
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'activityName', title: '名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'activityType', title: '类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'activityState', title: '状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'participableGroup', title: '对象', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantityOfActiveCommodities', title: '活动商品数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '起止时间', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'effectiveDate', title: '有效时间', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'limitCollarPerPerson', title: '限领', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'distributionQuantity', title: '发行量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'alreadyReceived', title: '已领取', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-activit', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
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
        if (item.field === 'activityType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '1': '特价商品',
              '2': '商品满减',
              '3': '商品折扣',
              '4': '商品买赠',
              '5': '商品换购',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'activityState') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '已删除',
              '1': '进行中',
              '2': '未开始',
              '3': '已结束',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'participableGroup') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '1': '全部用户',
              '2': '活动期间的新用户',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'startDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let a = rowData['endDate'];
            if (v) {
              return `<div><span>起:${v}</span>  <span>止:${a}</span></div>`;
            } else { return '-' }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
    // 自定义操作按钮
      if (param.type === 'seeMarke') {
        this.$router.push('/activet/detail?id=' + param.rowData.marketingActivitiesId);
      }
      // if (param.type === 'editMarke') {
      //   let url = '';
      //   if (param.rowData.activityType === 1) {
      //     url = '/market-control/activities/offerrEdit';
      //   } else if (param.rowData.activityType === 2) {
      //     url = '/market-control/activities/fullEdit';
      //   } else if (param.rowData.activityType === 3) {
      //     url = '/market-control/activities/discountEdit';
      //   } else if (param.rowData.activityType === 4) {
      //     url = '/market-control/activities/giftEdit';
      //   } else if (param.rowData.activityType === 5) {
      //     url = '/market-control/activities/chaseEdit';
      //   }
      //   this.$router.push(`${url}?id=` + param.rowData.marketingActivitiesId);
      // }
      if (param.type === 'endMarke') {
        this.$confirm('此操作将执行结束该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            marketingActivitiesId: param.rowData.marketingActivitiesId,
            activityState: '3'
          };
          this.marketOption(obj);
        });
      }
      if (param.type === 'delateMarke') {
        this.$confirm('此操作将执行删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            marketingActivitiesId: param.rowData.marketingActivitiesId,
            activityState: '0'
          };
          this.marketOption(obj);
        });
      }
    },
    marketOption(param) {
      javaRequest.post('/mall_manage/back/marketing/activities/updateMarketingActivitiesDataBinding', param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getTableData();
        }
      });
    },
    // 切换分页
    pageChange(pageIndex) {
      this.searchInfo.pageNum = pageIndex;
      this.getTableData();
    },
    // 切换每页显示的数量
    pageSizeChange(pageSize) {
      this.searchInfo.pageSize = pageSize;
      this.getTableData();
    },
    getTableData() {
      // 获取表格数据
      this.exportData = this.searchInfo;
      javaRequest.post('/mall_manage/back/marketing/activities/queryMarketingActivities', this.searchInfo).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
          this.isLoding = false;
        }
      });
    },
    exportActive() {
      // 导出
      let token = getToken();
      let param = {
        activityName: this.exportData.activityName,
        activityType: this.exportData.activityType,
        activityState: this.exportData.activityState,
        orderBy: 'desc',
      };
      param = base64Encrypt(JSON.stringify(param));
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/marketing/activities/exportExcleMarketingActivities?usertoken=` + token + '&param=' + param);
    },
    // 重置查询
    clean() {
      this.searchInfo = {
        activityName: '',
        activityType: '',
        activityState: '',
        orderBy: 'desc',
        pageNum: 1,
        pageSize: 10
      };
      this.getTableData();
    },
    // 查询
    query() {
      this.searchInfo.pageNum = 1;
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.list{
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  .toolbar-wrapper{
    margin-bottom: 30px;
  }
}

.conut-wrap{
  overflow: hidden;
}
.conut{
  display: block;
  width: 117px;
  text-align: center;
  padding-top: 10px;
  float: left;
}
</style>
