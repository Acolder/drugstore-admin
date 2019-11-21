<template>
  <div id="miniCicle">
    <!--微循环管理-->
    <div class="table-wrapper">
      <!--微循环管理列表-->
      <v-table ref="data_table" :row-height=60 column-width-drag is-horizontal-resize style="width:100%"
               :columns="columns_list"
               :table-data="tableData" row-hover-color="#eee"
               @on-custom-comp="customCompFunc"
               row-click-color="#edf7ff"></v-table>
    </div>
    <!--分页-->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize"
                    :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 诊断 -->
    <el-dialog title="诊断选择" @close="confirmShow=false" :visible.sync="confirmShow" :modal-append-to-body="false"
               width="30%" center>
      <v-table ref="data_table" :row-height=60 column-width-drag is-horizontal-resize style="width:100%"
               :columns="scheme_list"
               :table-data="DetectionList.tableData" row-hover-color="#eee"
               :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"
               row-click-color="#edf7ff">
      </v-table>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChangeDetectionList" @page-size-change="pageSizeChangeDetectionList"
                      :total="DetectionList.total" :page-size="DetectionList.pageSize"
                      :page-index="DetectionList.pageIndex"
                      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="confirmShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="btnConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      /* 表格数据 */
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      microcirculationDetail: {},
      // 诊断
      confirmShow: false,
      selection: [],
      DetectionList: {
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      }
    };
  },
  computed: {
    columns_list() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'user_id',
          title: '用户ID',
          width: 230,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'user_name',
          title: '用户昵称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'mobile',
          title: '手机号',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'sub_time',
          title: '提交时间',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'picurl',
          title: '图像',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'status',
          title: '状态',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'process_time',
          title: '处理时间',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'create_time',
          title: '创建时间',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'processresult',
          title: '处理结果',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'TB-remove-confirm',
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
        if (item.field === 'picurl') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let imagesList = value.split(',');
              let str = '';
              for (let i = 0; i < imagesList.length; i++) {
                str = str +
                  `<a href="javascript:previewImg('${imagesList[i]}');" ><img src="${imagesList[i]}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a> `;
              }
              return str;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<span style="background-color: lightgreen">已处理</span>`;
            } else {
              return `待处理`;
            }
          };
        }
      }
      return columns;
    },
    scheme_list() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'processresult',
          title: '检测结果',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'picurl',
          title: '配图',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
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
        if (item.field === 'picurl') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
      }
      return columns;
    },
  },
  components: {},
  mounted() {
    console.info(
      '--------------------------------------------------------------------------------------------page init');
    this.getList();
  },
  methods: {
    previewImg(url) { // 自定义弹窗
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    getSchemeList() {
      console.info('getSchemeList');
      ajax.get('/api/Microcirculation/GetMicrocirculationDetectionList?pageIndex=' + this.DetectionList.pageIndex +
        '&pageSize=' + this.DetectionList.pageSize).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          console.info(res.data);
          this.DetectionList.tableData = res.data.data;
          this.DetectionList.total = res.data.recordscount;
          console.info('this.DetectionList.tableData', this.DetectionList.tableData);
        }
      });
    },
    getList() {
      ajax.get('/api/Microcirculation/GetMicrocirculationManageList?pageIndex=' + this.pageIndex + '&pageSize=' +
        this.pageSize).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          console.info(res.data);
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    removeTableData(requestData) {
      ajax.get('/api/Microcirculation/DelMicrocirculationManageByid?id=' + requestData.id).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        }
      });
    },
    // 诊断
    confirm(params) {
      this.confirmShow = true;
      this.microcirculationDetail = params.rowData;
      this.getSchemeList();
    },
    // 诊断确认
    btnConfirm() {
      if (this.selection.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择至少一个'
        });
      } else {
        let id = this.selection.map((item) => {
          return item.id;
        }).join(',');
        let processresult = this.selection.map((item) => {
          return item.processresult;
        }).join(',');
        this.UpdateMicrocirculationManage(id, processresult);
        this.confirmShow = false;
      }
    },
    UpdateMicrocirculationManage(id, processresult) {
      let requestData = Object.assign(this.microcirculationDetail,
        { detectionid: id, status: 1, processresult: processresult });
      ajax.post('/api/Microcirculation/UpdateMicrocirculationManage', requestData).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: '确诊成功!'
          });
          this.getList();
        }
      });
    },
    customCompFunc(params) {
      if (params.type === 'confirm') { // 启用
        this.confirm(params);
      }
      else if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = { id: [params.rowData.id] };
          this.removeTableData(obj);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getList();
    },
    pageChangeDetectionList(pageIndex) {
      this.DetectionList.pageIndex = pageIndex;
      this.getSchemeList();
    },
    pageSizeChangeDetectionList(pageSize) {
      this.DetectionList.pageIndex = 1;
      this.DetectionList.pageSize = pageSize;
      this.getSchemeList();
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
  },
  created() {
    window.previewImg = this.previewImg;
  }
};
</script>

