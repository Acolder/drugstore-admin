<template>
  <div id="opinion-list">
    <div class="search-wrapper">
      <el-form :inline="true" :model="raredrugData"  size="small">
        <el-form-item label="是否解决:">
          <el-select v-model="raredrugData.screenInfo.isResolve" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugData.raredrugOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" size="small" icon="el-icon-delete" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="queryByOrder">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-delete" size="small" @click="Delete">删除</el-button>
        <el-button type="default" icon="el-icon-refresh" size="small" @click="toUpdate">更新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="raredrugData.screenInfo.pageIndex" :page-size="raredrugData.screenInfo.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 处理操作 -->
    <el-dialog title="修改素材信息" :visible.sync="modifyFormVisible" :modal-append-to-body="true" :append-to-body='true' width="40%" center>
      <el-form :model="modifyData" ref="modifyForm" :rules="rules">
        <el-form-item label="是否解决"  label-width="100px" prop="IsResolve">
          <el-select v-model="modifyData.IsResolve">
            <el-option label="已解决" :value=1></el-option>
            <el-option label="未解决" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理描述" label-width="100px" prop="ProcessDescription">
          <el-input v-model="modifyData.ProcessDescription"></el-input>
        </el-form-item>
        <el-form-item label="处理人" label-width="100px" prop="ProcessName">
          <el-input v-model="modifyData.ProcessName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryModify">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from 'vue';
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      raredrugData: {
        screenInfo: {
          keyWord: '',
          email: '',
          isResolve: null,
          pageIndex: 1,
          pageSize: 10
        },
        raredrugOptions: [
          { value: 0, label: '未解决' },
          { value: 1, label: '已解决' }
        ]
      },
      // 处理弹出层
      modifyFormVisible: false,
      modifyData: {
        ID: '',
        IsResolve: '',
        ProcessDescription: '',
        ProcessName: ''
      },
      // 数据验证
      rules: {
        IsResolve: [{ required: true, message: '请输入是否已解决', trigger: 'blur' }],
        ProcessDescription: [{ required: true, message: '请输入处理描述', trigger: 'blur' }],
        ProcessName: [{ required: true, message: '请输入处理人', trigger: 'blur' }],
      },
      sidebarValue: this.sidebarStatus,
      tableData: [],
      selection: [],
      total: 0,
      noteInformation: ''
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
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.raredrugData.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'content', title: '内容', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sumbittime', title: '提交时间', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'email', title: '邮箱', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createdname', title: '提交人账号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'appversion', title: '反馈App版本号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isresolve', title: '是否解决', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'processdescription', title: '处理描述', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'processname', title: '处理人', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'processtime', title: '处理时间', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-feedback', isResize: true }
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
        if (item.field === 'isresolve') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:red;">未解决</span>`;
            } else if (value === 1) {
              return `<span style="color:green;">已解决</span>`;
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
    // 清空
    empty() {
      this.raredrugData.screenInfo.isResolve = null;
      this.raredrugData.screenInfo.pageIndex = 1;
      this.raredrugData.screenInfo.pageSize = 10;
      this.getTableData();
    },
    // 查询
    queryByOrder() {
      this.getTableData();
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 删除操作
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该意见反馈, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = { Ids: [params.rowData.id] };
          this.removeTableData(obj);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        // 备注
      } else if (params.type === 'remark') { // do edit operation
        this.$prompt('请输入备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '备注信息不能为空'
        })
          .then(({ value }) => {
            ajax.post('/api/admin/updatesuggest', { Ids: [params.rowData.id], Remark: value }).then(res => {
              console.log(res);
              this.getTableData();
            });
            this.$message({
              type: 'success',
              message: '你输入的备注是: ' + value
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
      // 处理操作
      } else if (params.type === 'handle') { // do edit operation
        this.modifyData.ID = params.rowData.id;
        this.modifyData.IsResolve = params.rowData.isresolve;
        this.modifyData.ProcessDescription = params.rowData.processdescription;
        this.modifyData.ProcessName = params.rowData.processname;
        this.modifyFormVisible = true;
      }
    },
    // 处理提交
    queryModify() {
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          console.log(this.modifyData);
          ajax.post('/api/admin/processsuggest', this.modifyData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.getTableData();
              this.modifyFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 获取意见反馈列表数据
    getTableData() {
      let _self = this;
      ajax.get('/api/admin/getsuggestlist', {
        params: _self.raredrugData.screenInfo
      }).then(res => {
        console.log(res.data.data);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          let newData = res.data.data;
          this.tableData = newData;
        }
      });
    },
    // 删除列表数据
    removeTableData(idList) {
      ajax.post('/api/admin/deletesuggest', idList).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message(res.data.message);
        }
        this.getTableData();
      });
    },
    // 批量删除
    Delete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该意见反馈, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            Ids: []
          };
          for (let item of this.selection) {
            obj.Ids.push(item.id);
          }
          this.removeTableData(obj);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$alert('请选择删除的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 刷新
    toUpdate() {
      this.getTableData();
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
      this.raredrugData.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.raredrugData.screenInfo.pageSize = pageSize;
      this.getTableData();
    }
  },
  created() {
    // 请求反馈列表数据
    this.getTableData();
  }
};
</script>

<style>
.el-button.el-button--text span{
  color: #333;
}
table{ border-collapse:collapse;}
</style>
