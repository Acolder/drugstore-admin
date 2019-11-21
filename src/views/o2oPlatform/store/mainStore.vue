<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="品牌">
          <el-input v-model="business.brand"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="business.isEnable" size='small' placeholder="请选择状态">
            <el-option
              v-for="item in statusArray"
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
    <!-- 设置弹窗 -->
    <el-dialog title="设置" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="50%" center>
      <el-form :model="setUpData" ref="setUpForm" :rules="rules">
        <el-form-item label="结算周期:" label-width="120px" prop="cycle">
          <el-input v-model="setUpData.cycle"></el-input>
        </el-form-item>
        <el-form-item label="结算方式:" label-width="120px" prop="checking">
          <el-radio-group v-model="setUpData.checking">
            <el-radio :label="1">手动结账</el-radio>
            <el-radio :label="2">自动结账</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="querysetUp">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      // 状态
      statusArray: [
        { value: 2, label: '全部' },
        { value: 1, label: '启用' },
        { value: -1, label: '禁用' },
      ],
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        brand: '',
        isEnable: 2,
      },
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 设置弹窗
      dialogFormVisible: false,
      setUpData: {
        userId: '',
        cycle: '',
        checking: ''
      },
      // 数据验证
      rules: {
        cycle: [{ required: true, validator: this.validCycle, trigger: 'blur' }],
        checking: [{ required: true, message: '请勾选结算方式', trigger: 'blur' }],
      },
    };
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
        { field: 'organizationAbbreviation', title: '机构简称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'userName', title: '账号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'realName', title: '真实名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'phone', title: '电话', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isEnable', title: '状态', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'checking', title: '结账方式', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'cycle', title: '结算周期', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 350, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformStoreMainStore', isResize: true }
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
        if (item.field === 'isEnable') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:green;">启用</span>`;
            } else if (value === -1) {
              return `<span style="color:red;">禁用</span>`;
            }
          };
        }
        if (item.field === 'checking') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `手动结账`;
            } else if (value === 2) {
              return `自动结账`;
            }
          };
        }
        if (item.field === 'cycle') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value + '天';
            } else {
              return '0天';
            }
          };
        }
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              value = formatDate(value);
              return value;
            } else {
              return `-`;
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
    // 结算周期验证
    isValidCycle(str) {
      let numReg = /^[0-9]*$/;
      return numReg.test(str);
    },
    validCycle(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入结算周期'));
      } else if (!this.isValidCycle(value)) {
        callback(new Error('结算周期只能为数字'));
      } else {
        callback();
      }
    },
    // 主店列表
    getTableData() {
      console.log(this.business);
      javaAjax.post(`/mall_manage/store/third/otoStore`, this.business).then((res) => {
        console.log('主店列表返回数据', res);
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
      this.business.brand = '';
      this.business.isEnable = 2;
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 自定义组件操作
    customCompFunc(params) {
      let that = this;
      // 禁用
      if (params.type === 'prohibit') { // do edit operation
        this.$confirm('此操作将禁用该店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('禁用');
          let data = {
            userId: params.rowData.userId,
            isEnable: -1,
          };
          console.log(data);
          javaAjax.post(`/mall_manage/store/third/updateIsEnable`, data).then((res) => {
            console.log('主店账号-- 停用、启用', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'info',
                message: res.data.msg
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
      }
      // 启用
      if (params.type === 'enable') {
        this.$confirm('此操作将启用该店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('禁用');
          let data = {
            userId: params.rowData.userId,
            isEnable: 1,
          };
          console.log(data);
          javaAjax.post(`/mall_manage/store/third/updateIsEnable`, data).then((res) => {
            console.log('主店账号-- 停用、启用', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'info',
                message: res.data.msg
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
      }
      // 设置
      if (params.type === 'setUp') {
        that.setUpData.userId = params.rowData.userId;
        that.setUpData.cycle = params.rowData.cycle;
        that.setUpData.checking = params.rowData.checking;
        this.dialogFormVisible = true;
      }
      // 信息
      if (params.type === 'seeInfo') {
        this.$router.push('/o2oPlatform/store/basicInfo?userId=' + params.rowData.userId);
      }
      // 查看门店
      if (params.type === 'seeStore') {
        sessionStorage.setItem('seeStore', params.rowData.userId);
        this.$router.push('/o2oPlatform/store/subordinateStore');
      }
    },
    // 主店 修改结账周期
    querysetUp() {
      console.log(this.setUpData);
      this.$refs['setUpForm'].validate((valid) => {
        if (valid) {
          javaAjax.post(`/mall_manage/store/third/updateCycle`, this.setUpData).then((res) => {
            console.log('主店 修改结账周期', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'info',
                message: res.data.msg
              });
              this.dialogFormVisible = false;
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });
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
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
.search-wrapper{
  display: flex;
  justify-content: space-between;
}
</style>