<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="查找">
          <el-input v-model="business.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-circle-plus" size="small" style="height:32px;" @click="addActivity">添加活动商品</el-button>
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
    <!-- 添加活动商品 -->
    <el-dialog title="添加活动商品" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="70%" center>
      <el-form :model="addData" ref="addForm" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="门店id:" label-width="120px" prop="storeId">
              <el-input v-model="addData.storeId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="渠道"  label-width="120px" prop="type">
              <el-select v-model="addData.type" size='small' placeholder="请选择">
                <el-option
                  v-for="item in typeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三方活动id:" label-width="120px" prop="activityId">
              <el-input v-model="addData.activityId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三方活动名称:" label-width="120px" prop="activityName">
              <el-input v-model="addData.activityName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品id:" label-width="120px" prop="commodityId">
              <el-input v-model="addData.commodityId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称:" label-width="120px" prop="commodityName">
              <el-input v-model="addData.commodityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品数量:" label-width="120px" prop="num">
              <el-input v-model="addData.num"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryadd">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
// import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // 渠道
      typeArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        name: '',
      },
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      dialogFormVisible: false,
      // dialogFormVisible: true,
      addData: {
        type: '',
        activityId: '',
        activityName: '',
        commodityId: '',
        commodityName: '',
        num: '',
        storeId: '',
      },
      // 数据验证
      rules: {
        storeId: [{ required: true, message: '请输入门店id', trigger: 'blur' }],
        type: [{ required: true, message: '请输入第三方平台', trigger: 'blur' }],
        activityId: [{ required: true, message: '请输入第三方活动id', trigger: 'blur' }],
        activityName: [{ required: true, message: '请输入第三方活动名称', trigger: 'blur' }],
        commodityId: [{ required: true, message: '请输入商品id', trigger: 'blur' }],
        commodityName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],

      },
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 40, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'type', title: '渠道', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'storeId', title: '药店id', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'activityId', title: '活动id', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'activityName', title: '活动名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'commodityId', title: '赠送商品id', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'commodityName', title: '赠送商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'num', title: '赠送商品数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformChannelActivity', isResize: true }
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
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:#f37b1d;">美团</span>`;
            } else if (value === '2') {
              return `<span style="color:#3bb4f2;">饿了么</span>`;
            } else if (value === '4') {
              return `<span style="color:red;">京东到家</span>`;
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
    getTableData() {
      // javaAjax.post(`/mall_manage/back/order/queryByAbutment`, this.business).then((res) => {
      //   console.log(res);
      //   if (res.status === 200 && res.data.resultCode === '0') {
      //     this.tableData = res.data.resultData.data;
      //     this.total = res.data.resultData.total;
      //     this.$message({
      //       type: 'info',
      //       message: res.data.msg
      //     });
      //   }
      // });
      console.log(this.tableData);
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 添加活动商品
    addActivity() {
      this.dialogFormVisible = true;
    },
    // 确定添加
    queryadd() {
      console.log(this.addData);
    },
    // 自定义组件操作
    customCompFunc(params) {
      // 删除操作
      if (params.type === 'deleteRow') {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(params.index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
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