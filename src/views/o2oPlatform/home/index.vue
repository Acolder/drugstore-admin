<template>
  <div>
    <h2>订单数据:</h2>
    <el-row>
      <el-col :span="8" v-for="item in tableData" :key='item.index'>
        <div class="box">
          <div class="til">{{item.type}}</div>
          <div class="txt">
            <i>订单日期:</i>
            <span class="first">今日</span>
            <span>昨天</span>
            <span>前日</span>
          </div>
          <div class="txt">
            <i>订单数量:</i>
            <span class="first">{{item.todayOrderCount}}</span>
            <span>{{item.yesOrderCount}}</span>
            <span>{{item.beforeOrderCount}}</span>
          </div>
          <div class="txt">
            <i>订单金额:</i>
            <span class="first">{{item.todayOrderPayment}}</span>
            <span>{{item.yesOrderPayment}}</span>
            <span>{{item.beforeOrderPayment}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <h2>平台统计:</h2>
     <div class="feedbackFeedback">
      <v-table ref="data_table1" column-width-drag is-horizontal-resize style="width:100%" :columns="columns1" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff"></v-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      tableData: [],
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table1'].resize();
    }
  },
  computed: {
    columns1() {
      let columns1 = [
        { field: 'type', title: '平台名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sellerCount', title: '店铺数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'prdouctCount', title: '商品数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns1.length; i++) {
        let item = columns1[i];
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
        if (item.field === 'sellerCount') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
        if (item.field === 'prdouctCount') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
      }
      return columns1;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    getTableData() {
      javaAjax.post(`/mall_manage/back/order/dataStatistics`).then((res) => {
        console.log('首页数据', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.list;
        }
      });
    }
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
h2{
  line-height: 60px;
  font-weight: normal;
  font-size: 30px;
}
.el-col{
  padding-right: 10px;
}
.box{
  width: 100%;
  height: 210px;
  >div{
    padding-left: 20px;
  }
  .til{
    height: 30px;
    line-height: 30px;
    font-size: 15px;
  }
  .txt{
    height: 60px;
    display: flex;
    align-items: center;
    font-size: 12px;
    i{
      display: inline-block;
      width: 60px;
    }
    >span{
      display: inline-block;
      width: 50px;;
      text-align: center;
      margin-left: 10px;
      font-size: 12px;
    }
    .first{
      font-size: 16px;
      font-weight: bold;
    }
  }
}
.el-row{
  .el-col:nth-child(1){
    .box{
      border: 1px solid #f37b1d;
      .til{
        background: #f37b1d;
      }
    }
  }
  .el-col:nth-child(2){
    .box{
      border: 1px solid #3bb4f2;
      .til{
        background: #3bb4f2;
      }
    }
  }
  .el-col:nth-child(3){
    .box{
      border: 1px solid red;
      .til{
        background: red;
      }
    }
  }
}
</style>

