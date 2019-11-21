<template>
  <div id="business">
    <div class="title" v-if="from==='report'">脉诊仪租借列表</div>
    <div class="search-wrapper equipmentBorrow">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="用户账号">
          <el-input class="el-width1" v-model="business.account"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="business.utype" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-select v-model="business.status" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true"  size="small" v-if="from===''">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="enterpriseCooperation">企业合作</el-button>
        </el-form-item>
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
    <el-dialog title="借用详情" width="80%" :modal="true" :visible.sync="viewDialogVisible" :modal-append-to-body="false" center>
      <div id="viewIframe">
        <iframe :src="viewUrl" class="" frameborder="0" style="width:100%;height:800px;background-color:#fff;"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      viewDialogVisible: false,
      viewUrl: '',
      // 页面来源-是否外部页面引用等
      from: '',
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        // 租借单状态，必填，全部给空
        status: '',
        // 用户类型，必填，全部给-1
        utype: -1,
        // 用户账号，可空
        account: '',
      },
      raredrugOptions: [
        { value: -1, label: '全部用户' },
        { value: 1, label: '普通用户' },
        { value: 2, label: '集团单位' },
      ],
      raredrugOptions2: [
        { value: '', label: '全部' },
        { value: '0', label: '待支付' },
        { value: '1', label: '待发货' },
        { value: '2', label: '已发货' },
        { value: '3', label: '使用中' },
        { value: '4', label: '归还中' },
        { value: '5', label: '已归还' },
        { value: '-1', label: '已取消' },
      ],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        // { field: 'borrow_account', title: '用户账号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'borrow_company', title: '单位名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'borrow_number', title: '数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'borrow_days', title: '租借时间（天）', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'order_status', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'created_time', title: '订单提交时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'start_time', title: '开始时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'end_time', title: '到期时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'back_time', title: '退还时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'back_affim_time', title: '收到设备时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_account', title: '用户账号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'consignee_name', title: '租借人', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_type', title: '用户类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_number', title: '数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_days', title: '租借时间（天）', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_money', title: '租借费用', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_deposit', title: '押金', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'borrow_fine', title: '罚金', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_status', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'created_time', title: '订单提交时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-equipmentBorrow', isResize: true }
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
        if (item.field === 'borrow_type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:green;">用户租借</span>`;
            } else if (value === 2) {
              return `<span style="color:orange;">内部租借</span>`;
            }
          };
        }
        if (item.field === 'borrow_days') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
        if (item.field === 'borrow_money') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
        if (item.field === 'borrow_deposit') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
        if (item.field === 'borrow_fine') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
        if (item.field === 'order_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:red;">待发货</span>`;
            } else if (value === 2) {
              return `已发货`;
            } else if (value === 3) {
              return `<span style="color:#333;">使用中</span>`;
            } else if (value === 4) {
              return `归还中`;
            } else if (value === 5) {
              return `<span style="color:green;">已归还</span>`;
            } else if (value === -1) {
              return `<span style="color:gray;">已取消</span>`;
            } else if (value === 0) {
              return `待支付`;
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
    // 获取列表的数据
    getTableData() {
      ajax.post(`/api/borrow/GetBorrowRequestPageList`, this.business).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.data.rcount;
          this.tableData = res.data.data.data;
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.account = '';
      this.business.utype = -1;
      this.business.status = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 企业合作列表数据
    enterpriseCooperation() {
      this.$router.push('/service/equipmentCooperation');
    },
    // 自定义组件操作
    customCompFunc(params) {
      // 查看操作
      if (params.type === 'see') { // do edit operation
        let url = `${process.env.WEB_HOST}/service/equipmentBorrowInfoDetail?id=${params.rowData.id}&from=${this.from ? this.from : ''}`;
        this.viewUrl = url;
        this.viewDialogVisible = true;
        let iframeWrapper = document.getElementById('viewIframe');
        if (iframeWrapper) {
          iframeWrapper.innerHTML = "<iframe  src='" + url + "' height='800' width='100%'></iframe>";
        }
      } else if (params.type === 'borrow') {
        this.$router.push({
          name: 'equipmentBorrowUseLog',
          query: {
            user: params.rowData.borrow_account,
            phone: params.rowData.consignee_phone,
            regis_time: params.rowData.regis_time
            // user:
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
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableData();
    },
  },
  created() {
    this.from = this.$route.query.from;
    let utype = this.$route.query.utype;
    if (utype) {
      this.$set(this.business, 'utype', parseInt(utype, 10));
    }
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 24px;
  text-align: center;
  padding: 25px 0 10px;
  margin-bottom: 50px;
}
.equipmentBorrow{
  display: flex;
  justify-content: space-between;
}
</style>
