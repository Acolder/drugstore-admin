<template>
  <div id="versionControl">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">新增使用帮助说明</el-button>
      </el-button-group>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="医生端app" name="first">
        <div class="table-wrapper">
          <v-table ref="table1" column-width-drag is-horizontal-resize style="width:100%" :columns="columns1" :table-data="tableData1" row-hover-color="#eee"
          row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL1" :select-change="selectChange1" :select-group-change="selectGroupChange1"></v-table>
        </div>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange1" @page-size-change="pageSizeChange1" :total="total1" :page-size="business1.pageSize"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="业务员app" name="second">
        <div class="table-wrapper">
          <v-table ref="table2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
          row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL2" :select-change="selectChange2" :select-group-change="selectGroupChange2"></v-table>
        </div>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange2" @page-size-change="pageSizeChange2" :total="total2" :page-size="business2.pageSize"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增使用帮助说明 -->
    <el-dialog title="新增使用帮助说明" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="60%" center :close-on-click-modal="false" >
      <iframe :src="dialogFormVisibleUrl" frameborder="0" style="width:100%;height:700px;background-color:#FFF;"></iframe>
    </el-dialog>
    <!--  编辑使用帮助说明 -->
    <el-dialog title="编辑使用帮助说明" :visible.sync="dialogFormVisible2" :modal-append-to-body="false" width="60%" center @close="closeDialog" :close-on-click-modal="false" >
      <iframe :src="dialogFormVisible2Url" frameborder="0" style="width:100%;height:700px;background-color:#FFF;"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      activeName: 'first',
      tabIndex: 0,
      sidebarValue: this.sidebarStatus,
      tab: 1,
      // 请求参数
      business1: {
        pageIndex: 1,
        pageSize: 10,
      },
      business2: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 表格数据
      tableData1: [],
      tableData2: [],
      // 选择的记录
      selection1: [],
      selection2: [],
      // 总数
      total1: 0,
      total2: 0,
      // 添加弹出层
      dialogFormVisible: false,
      dialogFormVisibleUrl: `${process.env.WEB_HOST}/versionManagement/adduseHelp`,
      // 修改弹出层
      dialogFormVisible2: false,
      modifyId: '',
      initializationUrl: `${process.env.WEB_HOST}/versionManagement/modifyuseHelp?id=`,
      dialogFormVisible2Url: '',
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['table1'].resize();
      this.$refs['table2'].resize();
    }
  },
  computed: {
    columns1() {
      let _self = this;
      let columns1 = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business1.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '标题', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'updatetime', title: '更新时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'opertor', title: '操作者', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-useHelp', isResize: true }
      ];
      for (let i = 0; i < columns1.length; i++) {
        let item = columns1[i];
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
      return columns1;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business2.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '标题', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'updatetime', title: '更新时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'opertor', title: '操作者', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-useHelp', isResize: true }
      ];
      for (let i = 0; i < columns2.length; i++) {
        let item = columns2[i];
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
      return columns2;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 表格tab切换
    handleClick(tab) {
      this.activeName = tab.name;
      this.$refs['table1'].resize();
      this.$refs['table2'].resize();
    },
    // 请求接口数据1
    getTableData1() {
      ajax.get('/api/VersionManage/getdochelperlist?pageIndex=' + this.business1.pageIndex + '&pageSize=' + this.business1.pageSize).then(data => {
        console.log(data);
        if (data.status === 200 && data.data.code === 0) {
          this.total1 = data.data.recordscount;
          this.tableData1 = data.data.data;
        }
      });
    },
    // 请求接口数据2
    getTableData2() {
      ajax.get('/api/VersionManage/getdochelperlist?pageIndex=' + this.business1.pageIndex + '&pageSize=' + this.business1.pageSize).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.total2 = data.data.recordscount;
          this.tableData2 = data.data.data;
        }
      });
    },
    // 添加操作
    add() {
      this.dialogFormVisible = true;
    },
    adduseHelp() {
      this.dialogFormVisible = false;
      this.getTableData1();
    },
    // 编辑操作
    modifyuseHelp() {
      this.dialogFormVisible2 = false;
      this.getTableData1();
    },
    closeDialog() {
      this.dialogFormVisible2Url = '';
      this.getTableData1();
    },
    // 删除列表数据
    removeTableData(params) {
      ajax.post('/api/VersionManage/deldochelperinfo', { id: params.rowData.id }).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.$message({
            type: 'info',
            message: data.data.message
          });
          this.getTableData1();
        }
      });
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 删除操作
      if (params.type === 'deleteRow') { // do edit operation
        this.$confirm('此操作将永久删除该搜索, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeTableData(params);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 编辑操作
      else if (params.type === 'modify') { // do delete operation
        // this.$router.push({
        //   path: '/versionManagement/modifyuseHelp?id=' + params.rowData.id,
        // });
        this.dialogFormVisible2Url = this.initializationUrl + params.rowData.id;
        this.dialogFormVisible2 = true;
      }
    },
    // 全选反选1
    selectALL1(selection) {
      this.selection1 = selection;
    },
    selectChange1(selection, rowData) {
      this.selection1 = selection;
    },
    selectGroupChange1(selection) {
      this.selection1 = selection;
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
    // 分页1
    pageChange1(pageIndex) {
      this.business1.pageIndex = pageIndex;
      this.getTableData1();
    },
    pageSizeChange1(pageSize) {
      this.business1.pageSize = pageSize;
      this.getTableData1();
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
  mounted() {
    this.$refs['table1'].resize();
    this.$refs['table2'].resize();
  },
  created() {
    this.getTableData1();
    window.adduseHelp = this.adduseHelp;
    window.modifyuseHelp = this.modifyuseHelp;
    // this.getTableData2();
  }
};
</script>

<style lang="less" scoped>
</style>