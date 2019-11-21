<template>
  <div id="business">
    <el-tabs v-model="activeStatus" type="card" @tab-click="statusChange">
      <!--1.已录入-->
      <el-tab-pane label="已录入" name="hadEntry">
        <div class="entryNum">
          已录入条数: <span class="badge badge-danger">{{total}}</span>
        </div>
        <v-table ref="data_table" :row-height = 60  column-width-drag  is-horizontal-resize style="width:100%"
                 :columns="columns_hadEntry"
                 :table-data="tableData" row-hover-color="#eee" :column-cell-class-name="columnCellClass"
                 row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL"
                 :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
                        :page-size="business.pageSize"
                        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
      <!--2.待录入-->
      <el-tab-pane label="待录入" num="30" name="waitEntry">
        <div class="entryNum">
          剩余录入条数: <span class="badge badge-danger">{{total}}</span>
        </div>
        <v-table ref="data_table" :row-height = 60 column-width-drag  is-horizontal-resize is-vertical-resize
                 style="width:100%" :columns="columns"
                 :table-data="tableData" row-hover-color="#eee" :column-cell-class-name="columnCellClass"
                 row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
                        :page-size="business.pageSize"
                        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import yilin from '@/utils/yilinAjax21';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      activeStatus: 'waitEntry',
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        status: 0
      },
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 弹出层
      dialogFormVisible: false,
      addData: {
        resource: '',
        type: ''
      },
      // 弹出框商户审核
      toExamineAdopt: false,
      detailed: {},
      modifyData: {
        resource: ''
      }
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    // 1.待录入
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'orderid',
          title: '订单号',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'ordersource',
          title: '订单来源',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'doctorname',
          title: '下单医生',
          width: 300,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'salemanname',
          title: '业务员',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'createtime',
          title: '下单时间',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-waitEntry',
        }
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
    // 已录入columns
    columns_hadEntry() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'orderid',
          title: '订单号',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'ordersource',
          title: '订单来源',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'doctorname',
          title: '下单医生',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'salemanname',
          title: '业务员',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'createtime',
          title: '下单时间',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'orderstatusstr',
          title: '订单状态',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          componentName: 'table-operation-hadEntry',
        }
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
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    columnCellClass(rowIndex, columnName, rowData) {
      if (columnName === 'orderid') {
        return 'column-cell-class-name-test';
      }
    },
    // 获取订单信息
    getOrderList() {
      yilin.get('/api/ordermanage/getdocorderlist', {
        params: this.business
      }).then((res) => {
        // console.info('link Success, res:', res);
        if (res.status === 200 && res.statusText === 'OK') {
          // console.info('成功!,res.data.data:', res.data.data);
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    // 录入状态变更
    statusChange() {
      if (this.activeStatus === 'hadEntry') {
        this.business.status = null;
      } else {
        this.business.status = 0;
      }
      this.business.pageIndex = 1;
      this.getOrderList();
    },
    // 清空
    empty() {
      // console.log('清空');
    },
    // 查询
    query() {
      // console.log('查询');
    },
    // 添加操作
    add() {
      this.dialogFormVisible = true;
    },
    queryAdd() {
      this.$refs['ruleForm'].validate(() => {
        // console.log(this.addData);
        this.dialogFormVisible = false;
      });
    },
    // 审核提交
    queryModify() {
      // console.log(this.modifyData);
    },
    // 删除列表数据
    removeTableData() {
      // console.log('删除');
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 1.删除操作
      if (params.type === 'delete') { // do edit operation
        this.$confirm('此操作将永久删除该搜索, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeTableData();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      // 2.审核操作
      else if (params.type === 'modify') { // do delete operation
        this.$confirm('确定要认证成功该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log('审核成功');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 3.详情操作
      else if (params.type === 'detail') { // do delete operation
        // console.log('详情操作');
      }
      // 1.录入操作
      else if (params.type === 'entry') {
        let param;
        if (params.rowData.ordersource) {
          param = {
            orderid: params.rowData.orderid,
            ordersource: params.rowData.ordersource
          };
        } else {
          param = {
            orderid: params.rowData.orderid,
          };
        }
        this.$router.push({
          path: '/orderManage/recipeEntry',
          query: param
        });
      }
      // 2.查看物流
      else if (params.type === 'viewLogistics') {
        let url = 'http://www.kmzhyf.cn:8192/zyf/search.htm?order_id=' + params.rowData.orderid;
        window.open(url);
      }
      // 3.查看詳情
      else if (params.type === 'viewDetail') {
        this.$router.push({
          path: '/orderManage/recipeCheck',
          query: {
            orderid: params.rowData.orderid,
            type: 'viewDetail'
          }
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
      this.getOrderList();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getOrderList();
    },
  },
  created() {
    // console.log(1);
  },
  mounted: function () {
    this.getOrderList();
  }
};
</script>
<style lang="less" scoped>
  .entryNum {
    color: red;
    margin: 10px 10px 15px 0px;
  }
  .btn-blue {
  }
  #business {
    /deep/ .v-table-row {
    }
    .column-cell-class-name-test {
      background: blue;
      color: #0F0;
    }
  }
</style>
