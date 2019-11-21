<template>
  <div id="miniCicleScheme">
    <!--微循环方案设置管理-->
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" @click="addScheme" icon="el-icon-plus">添加方案</el-button>
      </el-button-group>
    </div>
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
    <!-- 编辑方案 -->
    <el-dialog title="新增/编辑方案" @close="dialogShow=false" :visible.sync="dialogShow" :modal-append-to-body="false"
               width="70%" center>
      <Scheme ref="schemeDetail" @on-save-sucess="saveSuccess">
      </Scheme>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
import Scheme from './miniCicleSchemeInfo.vue';
export default {
  data() {
    return {
      /* 表格数据 */
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      // 弹框 新增/编辑弹框
      dialogShow: false,
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
          field: 'id',
          title: 'ID',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
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
        {
          field: 'lifeproposal',
          title: '生活运动建议',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'recommendedproduct',
          title: '调养商品推荐',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'askingadvice',
          title: '问医就诊建议',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'health_information',
          title: '健康资讯推荐',
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
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'TB-edit-delete',
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
  components: {
    'Scheme': Scheme,
  },
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
    /* 获取列表 */
    getList() {
      ajax.get('/api/Microcirculation/GetMicrocirculationDetectionList?pageIndex=' + this.pageIndex + '&pageSize=' +
        this.pageSize).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          console.info(res.data);
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    /* 添加方案 */
    addScheme() {
      let requestData = {
        'processresult': '',
        'symptom': '',
        'picurl': '',
        'lifeproposal': '',
        'recommendedproduct': '',
        'askingadvice': '',
        'health_information': '',
        'Docmicrocirculationdetectionhealthrecommand': ''
      };
      ajax.post('/api/Microcirculation/CreateMicrocirculationDetection', requestData).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.getList();
          this.$message({
            type: 'success',
            message: '添加方案成功'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '添加失败'
        });
      });
    },
    /* 删除方案 */
    removeTableData(requestData) {
      ajax.get('/api/Microcirculation/DelMicrocirculationDetectionByid?id=' + requestData.id).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.getList();
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        });
      });
    },
    editScheme(params) {
      this.dialogShow = true;
      let _this = this;
      setTimeout(() => {
        _this.$refs.schemeDetail.getDetail(params.rowData.id);
      }, 100);
    },
    btnConfirm() {
      this.dialogShow = false;
    },
    saveSuccess() {
      this.dialogShow = false;
      this.getList();
    },
    /* 操作 */
    customCompFunc(params) {
      if (params.type === 'edit') { // 启用
        this.editScheme(params);
      } else if (params.type === 'removeRow') { // do delete operation
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
  },
  created() {
    window.setSelectedList = this.setSelectedList;
    window.previewImg = this.previewImg;
  }
};
</script>

