<template>
<div id="equipmentBorrowInfo">
  <!-- 企业合作页面样式以及操作 -->
  <div class="enterprise">
    <div class="search-wrapper">
      <el-form :inline="true" :model="enterprise" size="small">
        <el-form-item label="电话或邮箱">
          <el-input v-model="enterprise.mobileEmail" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="enterprise.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"  :page-index="enterprise.pageIndex" :page-size="enterprise.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
  <!-- 查看详情 -->
    <el-dialog title="详情" :visible.sync="detailDataFormVisible" :modal-append-to-body="false" width="50%" center>
      <div class="detailData-item"><span>手机号或邮箱:</span>{{detailData.mobileemail}}</div>
      <div class="detailData-item"><span>用户名:</span>{{detailData.username}}</div>
      <div class="detailData-item"><span>用户留言:</span>{{detailData.content}}</div>
      <div class="detailData-item"><span>备注:</span>{{detailData.remark}}</div>
      <div class="detailData-item"><span>处理时间:</span>{{detailData.processtime}}</div>
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
      userid: sessionStorage.getItem('userid') ? sessionStorage.getItem('userid') : '',
      nickname: sessionStorage.getItem('nickname') ? sessionStorage.getItem('nickname') : '',
      // 企业合作
      enterprise: {
        pageIndex: 1,
        pageSize: 10,
        mobileEmail: '',
        username: ''
      },
      // 企业合作表格数据
      tableData: [],
      // 企业合作总数
      total: 0,
      // 选择企业合作的记录
      selection: [],
      // 详情数据
      detailDataFormVisible: false,
      detailData: {},
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
            let index = (_self.enterprise.pageIndex - 1) * _self.enterprise.pageSize + rowIndex + 1;
            return '<span style="color:red;font-weight: bold;">' + index + '</span>';
          }, isFrozen: true, isResize: true
        },
        { field: 'mobileemail', title: '电话或邮箱', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'username', title: '姓名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'content', title: '留言', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'processtime', title: '处理时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-equipmentRemarks', isResize: true }
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
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 企业合作列表的数据
    getTableData() {
      ajax.get(`/api/borrow/GetCompanyCooperationList`, {
        params: this.enterprise
      }).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          this.tableData = res.data.data;
        }
      });
    },
    // 企业合作列表清空
    empty() {
      this.enterprise.pageIndex = 1;
      this.enterprise.pageSize = 10;
      this.enterprise.mobileEmail = '';
      this.enterprise.username = '';
      this.getTableData();
    },
    // 企业合作列查询
    query() {
      this.getTableData();
    },
    // 企业合作类型的自定义组件操作
    customCompFunc(params) {
      // 删除操作
      if (params.type === 'delete') {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/borrow/DelCompanyCooperationByid?id=' + params.rowData.id).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                type: 'info',
                message: res.data.message
              });
              this.getTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        // ajax.get('/api/borrow/DelCompanyCooperationByid?id=' + params.rowData.id).then(res => {
        //   console.log(res);
        //   if (res.status === 200 && res.data.code === 0) {
        //     this.$message({
        //       type: 'info',
        //       message: res.data.message
        //     });
        //     this.getTableData();
        //   }
        // });
      }
      // 详情操作
      if (params.type === 'detailed') {
        ajax.get('/api/borrow/GetCompanyCooperationByid?id=' + params.rowData.id).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.detailData = res.data.data;
            this.detailDataFormVisible = true;
          }
        });
      }
      // 备注操作
      if (params.type === 'remarks') { // do edit operation
        this.$prompt('请输入备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '备注信息不能为空'
        })
          .then(({ value }) => {
            let data = {
              Id: params.rowData.id,
              Remark: value,
              ProcessUserId: this.userid,
              ProcessName: this.nickname,
            };
            ajax.post('/api/borrow/RemarkCompanyCooperation', data).then(res => {
              console.log(res);
              if (res.status === 200 && res.data.code === 0) {
                this.$message({
                  type: 'info',
                  message: res.data.message
                });
                this.getTableData();
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
      }
    },
    // 企业合作全选反选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 企业合作分页
    pageChange(pageIndex) {
      this.enterprise.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.enterprise.pageSize = pageSize;
      this.getTableData();
    },
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.detailData-item{
  height: 40px;
  line-height: 40px;
  >span{
    display: inline-block;
    width: 150px;
  }
}
</style>