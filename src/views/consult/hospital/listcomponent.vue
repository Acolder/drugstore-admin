<template>
  <div class="list">
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      activeName: 'first',
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      tableData: []
    };
  },
  props: {
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ])
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.resize();
    }
  },
  methods: {
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.$emit('pageChange', pageIndex);
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.$emit('sizeChange', pageSize);
    },
    customCompFunc(params) {
      let row = params.rowData;
      if (params.type === 'details') {
        this.$emit('details', row);
      } else if (params.type === 'disable') {
        this.disable(row);
      }
    },
    disable(row) {
      let title = '启用';
      if (String(row.isdisabled) === '0') {
        title = '禁用';
      }
      this.$confirm('是否确定要' + title + '这个账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('disable', row);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + title
        });
      });
    },
    bindData(doctors, pageIndex) {
      this.tableData = doctors.data;
      this.pageIndex = pageIndex || this.pageIndex;
      this.total = doctors.recordscount;
    },
    resize() {
      this.$refs['data_table'].resize();
    }
  }
};

</script>
