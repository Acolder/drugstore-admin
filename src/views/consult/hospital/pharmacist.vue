<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form" >
        <el-form-item label="用户名" class="search-field" prop="username">
          <el-input v-model="requestData.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="药师姓名" class="search-field" prop="realname">
          <el-input v-model="requestData.realname" placeholder="药师姓名"></el-input>
        </el-form-item>
        <el-form-item label="医院名称" class="search-field" prop="hosname">
          <el-input v-model="requestData.hosname" placeholder="医院名称"></el-input>
        </el-form-item>
        <el-form-item label="认证时间">
          <el-date-picker v-model="varifytDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="searchHandle" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="first">
        <v-list v-if="activeName==='first'" ref="all_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="未审核" name="second">
        <v-list v-if="activeName==='second'" ref="wsh_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="审核中" name="third">
        <v-list v-if="activeName==='third'" ref="shz_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="审核通过" name="forth">
        <v-list v-if="activeName==='forth'" ref="shtg_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="审核失败" name="fifth">
        <v-list v-if="activeName==='fifth'" ref="shsb_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="less" scoped>
.search-wrapper {
  .search-field {
    /deep/.el-form-item__content {
      width: 120px;
    }
  }

  .btn-wrapper {
    padding: 0 30px;
  }
}

</style>
<script>
import ajax from '@/utils/yilinAjax';
import list from './listcomponent';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      'sidebarValue': this.sidebarStatus,
      'tabIndex': '-1',
      'total': 0,
      'tableData': [],
      'varifytDate': [],
      'columns': this.getColumns(),
      'activeName': 'first',
      // 选择的记录
      'selection': [],
      'requestData': {
        'pageIndex': 1,
        'pageSize': 10,
        'username': '',
        'realname': '',
        'hosname': '',
        'begindate': '',
        'enddate': '',
        'isauth': -1
      },
      'views': {
        '-1': 'all_list',
        '0': 'wsh_list',
        '1': 'shz_list',
        '2': 'shtg_list',
        '3': 'shsb_list',
      }
    };
  },
  watch: {
    requestData: {
      handler(n, o) {
        this.seach(this.views[this.tabIndex]);
      },
      deep: true
    }
  },
  components: {
    'v-list': list
  },
  mounted() {
    let query = this.$route.query || null;
    if (query && query.pagingIndex) {
      this.requestData.pageIndex = query.pageIndex;
    }
    this.seach(this.views['-1'], query);
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ])
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.requestData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'username', title: '用户名', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'emailaccount', title: '邮箱账号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'realname', title: '药师姓名', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'storename', title: '所属药店', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        {
          field: 'hosname',
          title: '医院',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'titlename',
          title: '职称',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        { field: 'isdisabled', title: '账号状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'dictname', title: '认证状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-doctorlist', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'isdisabled') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green;">已启用</span>';
            } else if (value === 1) {
              return '<span style="color:red;">已禁用</span>';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'provincename') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            return rowData.provincename + rowData.cityname + rowData.areaname;
          };
        }
      }
      return columns;
    },
    getQueryParams: function() {
      this.requestData.pageNum = this.pageIndex;
      this.requestData.pageSize = this.pageSize;
      return this.requestData;
    },
    seach(view, query) {
      let request = this.getQueryParams();
      if (query) {
        request = query;
      }
      ajax.get(`/api/hospitalManage/getpharmacistlist`, { params: request }).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 0) {
          this.$refs[view].bindData(res.data, request.pageIndex);
        }
      });
    },
    searchHandle() {
      this.seach(this.views[this.tabIndex]);
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      this.varifytDate = [];
      this.requestData.begindate = '';
      this.requestData.enddate = '';
      this.seach(this.views[this.tabIndex]);
    },
    pageChange(pi) {
      this.requestData.pageIndex = pi;
      let tab = this.visitedViews.find((x) => x.name === this.$route.name);
      if (tab.query) {
        tab.query.pageIndex = pi;
      } else {
        tab.query = { pageIndex: pi };
      }
      this.seach(this.views[this.tabIndex]);
    },
    sizeChange(pz) {
      this.requestData.pageIndex = 1;
      this.requestData.pageSize = pz;
      this.seach(this.views[this.tabIndex]);
    },
    handleClick(tab, event) {
      this.requestData.isauth = tab.index - 1;
      this.tabIndex = String(tab.index - 1);
      this.seach(this.views[String(tab.index - 1)]);
    },
    // table operaions
    disable(r) {
      let request = JSON.parse(JSON.stringify(r));
      let url = '/api/hospitalManage/updatedocuseraccountstate';
      let accountState = '0';
      if (String(request.isdisabled) === '0') {
        accountState = '1';
      }
      let params = { userId: request.userid, accountState: accountState };
      ajax.post(url, params).then((res) => {
        if (res.data && res.data.code === 0) {
          this.seach(this.views[this.tabIndex]);
        } else {
          this.$alert(res.data.message);
        }
      });
    },
    details(r) {
      let data = {
        name: 'pharmacistDetail',
        path: '/hospital/pharmacistDetail',
        meta: {
          title: '药师详情'
        }
      };
      let query = Object.assign({ userid: r.userid }, this.requestData);
      this.$router.push({
        path: data.path,
        query: query
      });
    },
    // table operaions end
    dateChange(v) {
      if (Object.prototype.toString.call(v) === '[object Array]' && v.length === 2) {
        this.requestData.begindate = v[0].toLocaleDateString().replace(/\//g, '-');
        this.requestData.enddate = v[1].toLocaleDateString().replace(/\//g, '-');
      } else {
        this.requestData.begindate = '';
        this.requestData.enddate = '';
      }
    }
  }
};

</script>
