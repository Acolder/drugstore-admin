<template>
  <div class="physiotherapy">
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="门店名称：">
          <el-input v-model.trim="screenInfo.name" placeholder="请输入门店名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="地区：" class="provincename">
          <el-input style="width:20%;" v-model.trim="screenInfo.provincename" display="inline-block"
          onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable  placeholder="省"></el-input>
          <el-input style="width:20%;" v-model.trim="screenInfo.cityname" display="inline-block"
          onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable  placeholder="市"></el-input>
          <el-input style="width:20%;" v-model.trim="screenInfo.areaname" display="inline-block"
          onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable  placeholder="区"></el-input>
        </el-form-item>
        <el-form-item class="search">
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
          <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="getColunms" :table-data="tableData" row-hover-color="#eee"
        row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
      </v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  查看详情  -->
    <el-dialog title="门店详情" :visible.sync="storeDetailShow" width="600px" :center="true" :modal-append-to-body="false" :append-to-body="true" class="details">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple commonH">
            <span class="strong">门店名称： </span> {{detailData.store_name}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple commonH">
            <span class="strong">营业时间： </span> {{detailData.business_hours}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple commonH">
            <span class="strong">联系方式： </span> {{detailData.contact_information}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple commonH">
            <span class="strong">地区： </span> {{detailData.areaname}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple commonH">
            <span class="strong">详细地址： </span> {{detailData.address}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple commonH">
            <span class="strong">所在地： </span> {{detailData.location}}
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      screenInfo: {
        pageIndex: 1,
        pageSize: 10,
        name: '',   // 门店名称
        provincename: '',  // 省
        cityname: '',  // 市
        areaname: '',  // 区县
      },
      addressProvinceArray: [],
      addressCityArray: [],
      addressDistrictArray: [],
      storeDetailShow: false,
      detailData: '',
    };
  },
  computed: {
    getColunms() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 20, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'store_name', title: '门店名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'contact_information', title: '联系方式', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'province', title: '地区', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'address', title: '详细地址', width: 250, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 320, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-storeList', isResize: true }
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
        if (item.field === 'areaname') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
  },
  watch: {
    'screenInfo.province': function() {
      this.province = this.screenInfo.province;
      this.getCitiesByProvincial(); // 获取市
      this.screenInfo.area = '';
      this.screenInfo.city = '';
    },
    'screenInfo.city': function() {
      this.city = this.screenInfo.city;
      this.getAreasByCity(); // 获取区
      this.screenInfo.area = '';
    },
  },
  methods: {
    // 清除查询
    clean() {
      this.screenInfo.name = '';
      this.screenInfo.provincename = '';
      this.screenInfo.cityname = '';
      this.screenInfo.areaname = '';
      this.getTableData();
    },
    // 查询
    queryByNews() {
      this.getTableData();
    },
    // 新增门店信息
    add() {
      this.$router.push('/instrumentTesting/physiotherapy/addStore');
    },
    // 删除单个数据
    remove(id) {
      let _self = this;
      ajax.get(`/api/borrow/DelPhysiotherapyStoreInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.getTableData();
        }
      });
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.$router.push('/instrumentTesting/physiotherapy/editStore?id=' + params.rowData.id);
      } else if (params.type === 'seeDetail') {  // 查看详情
        this.storeDetailShow = true;
        this.getDetail(params.rowData.id);
      } else if (params.type === 'manage') {  // 管理理疗套餐
        this.$router.push({
          path: '/instrumentTesting/physiotherapy/manageProgramme',
          query: {
            id: params.rowData.id,
            name: params.rowData.store_name,
          }
        });
      }
    },
    // 详情
    getDetail(id) {
      let _self = this;
      ajax.get(`/api/borrow/GetPhysiotherapyStoreInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.detailData = res.data.data;
          _self.detailData.business_hours = _self.detailData.business_hours.replace(/,/g, '-');
        }
      });
    },
    // 获取列表
    getTableData() {
      let _self = this;
      ajax.get(`/api/borrow/GetPhysiotherapyStoreManageInfo`, { params: _self.screenInfo }).then((res) => {
        // console.log(res.data.data);
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
        }
      });
    },
    // 分页
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTableData();
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
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.common{
  width: 150px;
}
.search{
  margin-left: -230px;
}
.strong{
  display: inline-block;
  width: 80px;
  text-align: right;
}
.commonH{
  font-size: 15px;
  height: 28px;
  line-height: 28px;
}
</style>
