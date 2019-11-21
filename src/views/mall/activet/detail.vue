<template>
<div>
  <h2 class="title">{{detail.activityType === 1 ? '特价商品' : detail.activityType === 2 ? '商品满减' : detail.activityType === 3 ? '商品折扣' : detail.activityType === 4 ? '商品买赠' : detail.activityType === 5 ? '商品换购' : ''}}活动详情</h2>
  <div class="detail">
    <el-row>
      <el-col :span="12">
        <span>活动名称：{{detail.activityName}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>起止时间：{{detail.startDate}}至{{detail.endDate}}</span>
        <!-- <span v-else>有效时间：{{detail.effectiveDate}}天后</span> -->
      </el-col>
    </el-row>
    <el-row :span="12" v-if="detail.activityType === 2">
      <el-col>
        <span>满减规则：满{{detail.full}}减{{detail.reduce}}</span>
        <!-- <span v-else>有效时间：{{detail.effectiveDate}}天后</span> -->
      </el-col>
    </el-row>
    <el-row v-if="detail.activityType === 3">
      <el-col :span="12">
        <span>折扣类型：{{detail.discountType === 1 ? '全场折扣' : '商品折扣'}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>可参与群体：{{detail.participableGroup === 0 ? '全部用户' : '活动期间的新用户'}}</span>
      </el-col>
    </el-row>
  </div>
  <h2 class="title">活动商品详情</h2>
  <div class="detail">
    <v-table
    ref="data_table"
    column-width-drag
    is-horizontal-resize
    style="width:100%"
    :columns="detail.activityType === 1 ? Columns : detail.activityType === 2 ? fullColumns : detail.activityType === 3 ? countColums : detail.activityType === 4 ? giftColums : detail.activityType === 5 ? chaseColums : []"
    :table-data="detail.commodityScope"
    row-hover-color="#eee"
    row-click-color="#edf7ff">
    </v-table>
  </div>
  <div v-if="detail.activityType === 5">
    <h2 class="title">换购商品详情</h2>
    <div class="detail">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="subchaseColums" :table-data="detail.repurchaseJson" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
    </div>
  </div>
</div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      detail: {},
      ids: this.$route.query.id,
      // columns: this.Columns(),
    };
  },
  computed: {
    countColums() {
      // 自定义折扣商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'discount', title: '折扣', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'participableProductNumber', title: '参与活动商品数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'surplusQuantity', title: '剩余数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    fullColumns() {
      // 自定义满减商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'participableProductNumber', title: '参与活动商品数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'surplusQuantity', title: '剩余数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    Columns() {
      // 自定义特价商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'specialOffer', title: '特价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'participableProductNumber', title: '参与活动商品数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'surplusQuantity', title: '剩余数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    chaseColums() {
      // 自定义换购活动商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    subchaseColums() {
      // 自定义换购商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'repurchaseProductName', title: '换购商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'repurchaseOriginalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'repurchaseProductPrice', title: '换购商品价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'repurchaseProductNumber', title: '换购商品数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'surplusQuantity', title: '剩余数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    giftColums() {
      // 自定义买赠商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '换购商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson1', title: '赠品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson2', title: '赠品价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson3', title: '赠送数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson4', title: '赠品数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson5', title: '剩余数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'giftJson1') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData['giftJson'][0].giftName;
            console.log(v);
            return v;
          };
        }
        if (item.field === 'giftJson2') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData['giftJson'][0].giftPrice;
            return v;
          };
        }
        if (item.field === 'giftJson3') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData['giftJson'][0].quantityOfDonation;
            return v;
          };
        }
        if (item.field === 'giftJson4') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData['giftJson'][0].numberOfGifts;
            return v;
          };
        }
        if (item.field === 'giftJson5') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData['giftJson'][0].surplusQuantity;
            return v;
          };
        }
      }
      return columns;
    },
  },
  methods: {
    getDatail() {
      let param = {
        marketingActivitiesId: this.ids
      };
      javaRequest.post('/mall_manage/back/marketing/activities/queryActivityDetails', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detail = res.data.resultData;
        }
      });
    },
    customCompFunc() {
      // 自定义
    },
  },
  created() {
    this.getDatail();
  }
};
</script>

<style lang="less" scoped>
.title{
  line-height: 60px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  background: #fff;
  padding-left: 30px;
  margin-top: 15px;
  border: 1px solid #edf1f2;
  background: #f0f3f4;
}
.detail{
  padding: 15px 30px;
  // background: ;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  /deep/ .el-row{
    margin: 15px 0;
  }
}
</style>
