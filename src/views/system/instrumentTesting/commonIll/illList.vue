<template>
  <div id="foodsWrap">
    <div class="toolbar-wrapper">
      <el-form :inline="true" :model="searchData" size="small" >
        <el-form-item label="资讯标题：">
          <el-input v-model="searchData.name" placeholder="请输入常见病名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button-group style="margin:0 0 10px 10px;">
      <el-button type="default" size="small" icon="el-icon-plus" @click="addIll">新 增</el-button>
    </el-button-group>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :page-index="searchData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  查看详情  -->
    <el-dialog title="查看详情" :visible.sync="illDetailShow" width="1000px" :center="true" :modal-append-to-body="false" class="details">
      <el-form ref="foodData" :model="detailData" label-width="90px">
        <el-row>
          <el-col :span="24" >
            <el-form-item label="食材名称:" prop="name" class="source">
              <el-input style="width:60%" v-model.trim="detailData.name" readonly display="inline-block"
              onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div></div>
            <el-form-item label="图文介绍：" prop="detail" style="margin-right:20px;">
              <div v-html="detailData.detail"></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import ueditor from '@/components/ueditor/editor';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      searchData: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      illDetailShow: false,
      imgAndText_symptom: null,
      detailData: {
        name: '',
        detail: '',
      },
    };
  },
  components: {
    'ueditor': ueditor,
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 5, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'name', title: '常见病名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detail', title: '常见病介绍', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 120, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-foodManage', isResize: true },
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
    }
  },
  methods: {
    addIll() {
      this.$router.push('/instrumentTesting/commonIll/addIll');
    },
    // 批量删除
    clean() {
      this.searchData.name = '';
      this.getTable();
    },
    query() {
      this.searchData.pageIndex = 1;
      this.getTable();
    },
    remove(id) {
      let _self = this;
      let param = {
        id: id,
      };
      ajax.post(`api/jinmu/commondiseases/delete`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.getTable();
        }
      });
    },
    // 查看详情
    getIllDetail(data) {
      let _self = this;
      ajax.get(`api/jinmu/commondiseases/get?id=` + data).then((res) => {
        if (res.status === 200 & res.data.code === 0) {
          _self.detailData = res.data.data;
        }
      });
    },
    customCompFunc(param) {
      if (param.type === 'remove') {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(param.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (param.type === 'edit') {
        this.$router.push({
          path: '/instrumentTesting/commonIll/editIll',
          query: {
            id: param.rowData.id,
          }
        });
      } else if (param.type === 'seeDetail') {
        this.illDetailShow = true;
        this.getIllDetail(param.rowData.id);
      }
    },
    // 获取列表
    getTable() {
      let _self = this;
      ajax.get(`api/jinmu/commondiseases/page`, { params: _self.searchData }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    pageChange(pageIndex) {
      this.searchData.pageIndex = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageIndex = 1;
      this.searchData.pageSize = pageSize;
      this.getTable();
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    }
  },
  created() {
    this.getTable();
  },
  mounted() {
    this.imgAndText_symptom = this.$refs.imgAndText_ueditor;
  }
};
</script>

<style lang="less" scoped>
.imgFood {
  width: 105px;
  height: 75px;
  border-radius: 3px;
}
</style>
