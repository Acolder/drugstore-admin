<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="requestData.userName" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="requestData.realName" placeholder="真实姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医院名称" prop="hosName">
              <el-input v-model="requestData.hosName" placeholder="医院名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账号类型" prop="accountType">
              <el-select placeholder="请选择" v-model="requestData.accountType" clearable>
                <el-option :key="1" :label="'手机'" :value="1">
                </el-option>
                <el-option :key="2" :label="'邮箱'" :value="2">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="认证时间">
              <div class="block">
                <el-date-picker v-model="registDate" type="daterange" @change="dateChange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="btn-wrapper">
              <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
              <el-button type="primary" @click="searchHandle" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="first">
        <v-list v-if="activeName==='first'" ref="all_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="未认证" name="second">
        <v-list v-if="activeName==='second'" ref="wrz_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="审核中" name="third">
        <v-list v-if="activeName==='third'" ref="rzz_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="审核通过" name="forth">
        <v-list v-if="activeName==='forth'" ref="shtg_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="审核失败" name="fifth">
        <v-list v-if="activeName==='fifth'" ref="shsb_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="认证成功（医网签）" name="sixth">
        <v-list v-if="activeName==='sixth'" ref="rzcgy_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="认证失败（医网签）" name="seventh">
        <v-list v-if="activeName==='seventh'" ref="rzsby_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
      <el-tab-pane label="认证中（医网签）" name="eighth">
        <v-list v-if="activeName==='eighth'" ref="rzzy_list" @pageChange="pageChange" @sizeChange="sizeChange" @disable="disable" @details="details" :columns="getColumns()"></v-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import list from './listcomponent';
import ajax from '@/utils/yilinAjax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      'activeName': 'first',
      'registDate': [],
      'tabIndex': '-1',
      'requestData': {
        'pageIndex': 1,
        'pageSize': 10,
        'accountType': '',
        'userName': '',
        'realName': '',
        'hosName': '',
        'isAuth': -1,
        'beginDate': '',
        'endDate': ''
      },
      'views': {
        '-1': 'all_list',
        '0': 'wrz_list',
        '1': 'rzz_list',
        '2': 'shtg_list',
        '3': 'shsb_list',
        '4': 'rzcgy_list',
        '5': 'rzsby_list',
        '6': 'rzzy_list'
      }
    };
  },
  mounted() {
    let query = this.$route.query || null;
    if (query && query.pageIndex) {
      this.requestData.pageIndex = query.pageIndex;
    }
    this.seach(this.views['-1'], query);
  },
  components: {
    'v-list': list
  },
  watch: {
    requestData: {
      handler(n, o) {
        this.seach(this.views[this.tabIndex]);
      },
      deep: true
    }
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
            let index = (_self.requestData.pageIndex - 1) * _self.requestData.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'userid', title: '医生ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'username', title: '用户名', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'emailaccount', title: '邮箱', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'realname', title: '姓名', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'hosname', title: '医院', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'departname', title: '科室', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'titlename', title: '职位', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isdisabled', title: '账号状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'dictname', title: '认证状态', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-doctorlist', isResize: true }
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
      }
      return columns;
    },
    handleClick(tab, event) {
      this.requestData.pageIndex = 1;
      this.requestData.isAuth = tab.index - 1;
      this.tabIndex = String(tab.index - 1);
      this.seach(this.views[String(tab.index - 1)]);
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      this.registDate = [];
      this.requestData.beginDate = '';
      this.requestData.endDate = '';
      this.seach(this.views[this.tabIndex]);
    },
    seach(view, query) {
      let request = this.requestData;
      if (query) {
        request = query;
      }
      ajax.get('/api/hospitalManage/getdocuserlist', { params: request }).then((res) => {
        let result = res.data;
        if (result.code === 0) {
          this.$refs[view].bindData(result, request.pageIndex);
        }
      });
    },
    dateChange(v) {
      if (Object.prototype.toString.call(v) === '[object Array]' && v.length === 2) {
        this.requestData.beginDate = this.registDate[0].toLocaleDateString().replace(/\//g, '-');
        this.requestData.endDate = this.registDate[1].toLocaleDateString().replace(/\//g, '-');
      } else {
        this.requestData.beginDate = '';
        this.requestData.endDate = '';
      }
    },
    searchHandle() {
      this.seach(this.views[this.tabIndex]);
    },
    pageChange(pi) {
      this.requestData.pageIndex = pi;
      let tab = this.visitedViews.find((x) => x.name === this.$route.name);
      console.log(tab);
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
    disable(r) {
      let request = r;
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
        name: 'doctorDetail',
        path: '/hospital/doctorDetail',
        meta: {
          title: '医生详情'
        }
      };
      let query = Object.assign({ userid: r.userid }, this.requestData);
      this.$router.push({
        path: data.path,
        query: query
      });
    }
  }
};

</script>
<style lang="less" scoped="">
.btn-wrapper {
  display: flex;
  justify-content: center;
}

</style>
