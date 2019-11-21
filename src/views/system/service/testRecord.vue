<template>
  <div class="record">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small">
        <el-form-item label="Mac编码：">
          <el-input v-model.trim="searchInfo.mac" placeholder="请输入mac编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备去处：">
          <el-input v-model.trim="searchInfo.give" placeholder="请输入设备去处" clearable></el-input>
        </el-form-item>
        <div class="block">
          <span class="demonstration">检测时间： </span>
          <el-date-picker v-model="value" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :unlink-panels="true" align="right" size="small">
          </el-date-picker>
        </div>
        <el-form-item label="联系人：">
          <el-input v-model="searchInfo.contact" placeholder="请输入联系人" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：">
          <el-input v-model.trim="searchInfo.phone" placeholder="请输入联系人电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="检测人电话：" class="ph">
          <el-input v-model.trim="searchInfo.tag_phone" placeholder="请输入检测人电话" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查 询</el-button>
          <el-button type="primary" @click="exportActive">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- {{searchInfo}} -->
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=44 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination :page-index="currentPage" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
    </div>
    <el-dialog title="" :visible.sync="detailShow" width="424px" center top="10vh" :modal-append-to-body="false">
      <!-- <el-row> -->
      <!-- <el-col :span="24" class="col-wrap"> -->
      <div class="phone">
        <iframe :src="url" width="100%" height="100%" frameborder="0" align="bottom" scrolling="no">
        </iframe>
      </div>
      <!-- </el-col> -->
      <!-- </el-row> -->
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      columns: this.getColumns(),
      pageIndex: 0,
      pageSize: 20,
      total: 0,
      mac: this.$route.query.mac,
      tableData: [],
      requestData: {},
      detailData: {},
      detailShow: false,
      currentPage: 1,
      dialogVisible: false,
      // date: new Date().getTime(),
      url: `https://mob.kangmei.com.cn/physique/reportnew`,
      searchInfo: {
        mac: '',
        give: '',
        starttime: '',
        endtime: '',
        contact: '',
        phone: '',
        tag_phone: '',
      },
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value: []
    };
  },
  created() {
    this.getTableData();
    // console.log(this.date);
    // this.url += `&time=${this.date}`;
    // console.log(this.url);
  },
  watch: {
    'value': function () {
      if (!this.value) {
        this.searchInfo.starttime = '';
        this.searchInfo.endtime = '';
      } else {
        this.searchInfo.starttime = this.value[0];
        this.searchInfo.endtime = this.value[1];
      }
    }
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [{
        field: 'custome',
        title: '序号',
        width: 50,
        titleAlign: 'center',
        columnAlign: 'center',
        formatter: function (rowData, rowIndex, pagingIndex, field) {
          let index = _self.pageIndex * _self.pageSize + rowIndex + 1;
          return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        },
        isFrozen: true,
        isResize: true
      },
      { field: 'test_date', title: '检测时间', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'tag_user', title: '检测人电话', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'constitution', title: '体质结果', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'test_user', title: '用户账号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'mac', title: 'Mac编码', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'give', title: '设备去处', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'contact', title: '联系人', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'phone', title: '联系人电话', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
      { field: 'option', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-testRecord', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          // console.log(rowData);
          let value = rowData[field];
          // console.log(value);
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
      }
      return columns;
    },
    getTableData(searchInfo) {
      this.requestData.PageIndex = this.pageIndex + 1;
      this.requestData.pageSize = this.pageSize;
      if (searchInfo) {
        for (let key in searchInfo) {
          if (searchInfo.hasOwnProperty(key)) {
            this.requestData[key] = searchInfo[key];
          }
        }
      }
      ajax.post(`/api/jinmu/GetReportRecordPageList`, this.requestData).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.data.rcount;
          this.tableData = res.data.data.data;
          console.log(this.tableData);
        }
      });
    },
    // 查询
    query() {
      // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      // if (this.searchInfo.phone !== '' || this.searchInfo.tag_phone !== '') {
      // if ((this.searchInfo.phone !== '' && reg.test(this.searchInfo.phone) === false) || (this.searchInfo.tag_phone !== '' && reg.test(this.searchInfo.tag_phone) === false)) {
      //   const h = this.$createElement;
      //   this.$notify.error({
      //     title: '错误！！',
      //     message: h('i', { style: 'color: red' }, '电话号码输入错误！！！')
      //   });
      // } else {
      // this.getTableData(this.searchInfo);
      // }
      // } else {
      //   this.getTableData(this.searchInfo);
      // }
      this.getTableData(this.searchInfo);
    },
    // 导出
    exportActive() {
      // alert('你点击了导出！！！！');
      let mac = this.searchInfo.mac;
      let give = this.searchInfo.give;
      let starttime = this.searchInfo.starttime;
      let endtime = this.searchInfo.endtime;
      let contact = this.searchInfo.contact;
      let phone = this.searchInfo.phone;
      let tag_phone = this.searchInfo.tag_phone;
      // ajax.get('/api/jinmu/GetReportRecordExecl?mac =' + mac + '&give=' + give + '&starttime=' + starttime + '&endtime=' + endtime + '&contact=' + contact + '&phone=' + phone + '&tag_phone=' + tag_phone).then(res => {
      //   console.log(res);
      // });
      window.open(`${process.env.BASE_HOST}/api/jinmu/GetReportRecordExecl?mac=` + mac + '&give=' + give + '&starttime=' + starttime + '&endtime=' + endtime + '&contact=' + contact + '&phone=' + phone + '&tag_phone=' + tag_phone);
    },
    pageChange(pageIndex) {
      this.currentPage = pageIndex;
      this.pageIndex = pageIndex - 1;
      console.log(this.pageIndex);
      this.getTableData(pageIndex);
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 0;
      this.pageSize = pageSize;
      this.getTableData();
    },
    customCompFunc(params) {
      console.log(params);
      this.detailShow = true;
      this.url = `https://mob.kangmei.com.cn/physique/reportnew?record_id=${params.rowData.record_id}`;
      console.log(this.url);
      // alert('没有h5页面T—T');
    }
  }
};

</script>
<style lang="less" scoped>
.col-wrap{
  padding: 5px 50px;
  display: flex;
  justify-content: flex-start;
  text-align: left;
  span{
    &:nth-child(1){
      // padding: 1px 20px;
      height: 20px;
      width: 120px;
      text-align: right;
      display: inline-block;
    }
  }
  .rights{
    margin-left: 20px;
  }
}
.title {
  width: 100%;
  height: 80px;
  // background: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  div {
    height: 100%;
    padding: 0 10px;
    font-weight: 700;
    line-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.search-wrapper{
  & /deep/ .el-form--inline {
    margin-left: -50px;
  }
  & /deep/ .el-form-item__label {
  width: 130px;
 }
  & .ph {
      margin-left: 12px;
  }
  & /deep/ .block {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
    margin-bottom: 18px;
    margin-left: 66px;
    .demonstration {
      margin-left: -20px;
      margin-right: 10px;
    }
 }
}
.record {
  & /deep/ .el-dialog{
   background-color: #000;
   height: 800px;
   background: url(../../../assets/img/iphone_ver.png);
   background-size: cover;
   background-position: center center;
   position: relative;
   & /deep/ .el-dialog__body {
     position: absolute;
     left: 50%;
     bottom: 123px;
     transform: translateX(-50%);
     padding: 0;
     margin-left: 2px;
     height: 536px;
     width: 369px;
     & .phone {
       width: 100%;
       height: 100%;
      }
    }
  }
}
</style>
