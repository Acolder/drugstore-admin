<template>
  <div id="foodsWrap">
    <div class="toolbar-wrapper">
      <el-form :inline="true" :model="searchData" size="small" >
        <el-form-item label="预约人：">
          <el-input v-model="searchData.name" placeholder="请输入预约人" clearable></el-input>
        </el-form-item>
        <el-form-item label="预约手机号：">
          <el-input v-model="searchData.phone" placeholder="请输入预约手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="当前状态：">
          <el-select v-model="searchData.status" placeholder="请选择" clearable >
            <el-option label="全部" :value=-1></el-option>
            <el-option label="预约中" :value=0></el-option>
            <el-option label="预约成功" :value=1></el-option>
            <el-option label="已完成" :value=2></el-option>
            <el-option label="取消" :value=-10></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button-group style="margin:0 0 10px 10px;">
      <el-button type="default" size="small" icon="el-icon-upload2" @click="exportList">导出</el-button>
      <el-button type="default" size="small" icon="el-icon-refresh" @click="queryList">刷 新</el-button>
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
    <el-dialog title="预约理疗订单详情" :visible.sync="DetailShow" width="800px" :center="true" :modal-append-to-body="false" class="details">
      <div class="details">
        <p class="details_p"><label class="details_left">理疗项目</label><span class="details_right">{{detailData.service_name}}</span></p><br>
        <p class="details_p"><label class="details_left">服务份数</label><span class="details_right">{{detailData.service_num}}</span></p><br>
        <p class="details_p"><label class="details_left">预约时间</label><span class="details_right">{{detailData.reserve_date}}</span></p><br>
        <p class="details_p"><label class="details_left">预约金额</label><span class="details_right" v-if="detailData.service_paymoney">{{detailData.service_paymoney}}元</span></p><br>
        <p class="details_p"><label class="details_left">预约人</label><span class="details_right">{{detailData.reserve_name}}</span></p><br>
        <p class="details_p"><label class="details_left">预约地址</label><span class="details_right">{{detailData.reserve_detail_address}}</span></p><br>
        <p class="details_p"><label class="details_left">手机号</label><span class="details_right">{{detailData.reserve_phone}}</span></p><br>
        <p class="details_p"><label class="details_left">留言</label><span class="details_right">{{detailData.reserve_remark}}</span></p><br>
        <p class="details_p"><label class="details_left">预约状态</label><span class="details_right">{{detailsData}}</span></p><br>
        <p class="details_p"><label class="details_left">订单编号</label><span class="details_right">{{detailData.id}}</span></p><br>
        <p class="details_p last"><label class="details_left">订单创建时间</label><span class="details_right">{{detailData.created_time}}</span></p>
        <p class="details_p last"><label class="details_left">客服备注</label><span class="details_right">{{detailData.service_remark}}</span></p>
      </div>
    </el-dialog>
    <!--  是否预约订单  -->
    <el-dialog title="是否确认预约订单" :visible.sync="orderShow" top="15vw" :modal-append-to-body="false" :append-to-body="true" width="330px" center>
      <el-form size="small" label-width="80px" >
        <div class="stick">
          <el-button plain class="stick_button" @click="Appointment(0)" style="margin-right:5px;">取消预约</el-button>
          <el-button plain class="stick_button" @click="Appointment(1)" style="margin-left:5px;">确定预约</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--  客服备注  -->
    <el-dialog title="客服备注" :visible.sync="remarkShow" :modal-append-to-body="false" :append-to-body="true" width="500px" @close="cancel" center>
      <el-form :model="formData" :rules="remark_rules" size="small" label-width="85px">
        <el-form-item label="备注信息:" prop="service_remark" class="source" >
          <el-input type="textarea" :rows="4" v-model="formData.service_remark" style="width:95%" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item class="form-button">
          <el-button type="default" @click="remarkShow = false" icon="el-icon-circle-close">取消</el-button>
          <el-button size="small" type="primary" @click="save" icon="el-icon-check">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      searchData: {
        name: '',
        phone: '',
        status: -1,  //  -1：全部 0：预约中 1：预约成功 2：已完成 -10：取消
        pageIndex: 1,
        pageSize: 10
      },
      DetailShow: false,
      detailData: {},
      detailsData: '',
      orderShow: false,
      remarkShow: false,
      formData: {
        id: '',
        service_remark: '',
      },
      remark_rules: {
        service_remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }]
      }
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 50, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 20, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'service_name', title: '理疗项目', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'reserve_name', title: '预约人', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'reserve_phone', title: '预约手机号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'service_paymoney', title: '预约金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'reserve_date', title: '预约时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'reserve_status', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'created_time', title: '创建时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-Appointment', isResize: true },
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
        if (item.field === 'service_paymoney') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              if (Number.isInteger(value)) {
                let double = parseFloat(value);
                value = double.toFixed(2);
              }
              return '<span style="color:red;">' + value + '</span>';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'reserve_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green">预约中</span>';
            } else if (value === 1) {
              return '<span style="color:green">预约成功</span>';
            } else if (value === 2) {
              return '<span style="color:green">已完成</span>';
            } else if (value === -10) {
              return '<span style="color:green">取消</span>';
            }
          };
        }
        if (item.field === 'reserve_date') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            let time = rowData['reserve_mintime'];
            if (value && time) {
              return value + '&nbsp;' + time;
            } else {
              return '';
            }
          };
        }
      }
      return columns;
    }
  },
  methods: {
    // 导出
    exportList() {
      let _self = this;
      if (_self.selection.length > 0) {
        this.$confirm('此操作将导出勾选中的订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            name: _self.searchData.name,
            phone: _self.searchData.phone,
            status: _self.searchData.status,
          };
          window.open(`${process.env.BASE_HOST}/api/jinmu/GetPhysiotherapyOrderExeclData?name=` + param.name + '&phone=' + param.phone + '&status=' + param.status);
          _self.selection = [];
          _self.getTable();
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        _self.$alert('请勾选需要导出的订单', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 清除查询
    clean() {
      this.searchData.name = '';
      this.searchData.phone = '';
      this.searchData.status = -1;
      this.getTable();
    },
    // 查询
    query() {
      this.searchData.pageIndex = 1;
      this.getTable();
    },
    // 刷新
    queryList() {
      this.searchData.pageIndex = 1;
      this.getTable();
    },
    // 预约订单
    Appointment(data) {
      let _self = this;
      let param = {};
      if (data === 1) {
        param.status = 1;
      } else if (data === 0) {
        param.status = -10;
      }
      param.id = _self.orderId;
      ajax.get(`/api/jinmu/UpdatePhysiotherapyOrderStatus/` + param.id + '/' + param.status).then((res) => {
        if (res.status === 200 & res.data.code === 0) {
          _self.$message({
            type: 'success',
            message: '操作成功'
          });
          _self.orderShow = false;
          _self.getTable();
        }
      });
    },
    // 清除备注信息
    cancel() {
      this.formData.service_remark = '';
    },
    // 查看客服备注
    getDetail(id) {
      ajax.get(`/api/jinmu/GetPhysiotherapyOrderDetail/` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.formData.service_remark = res.data.data.service_remark;
        }
      });
    },
    // 保存备注信息
    save() {
      let _self = this;
      let param = _self.formData;
      ajax.post(`/api/jinmu/UpdatePhysiotherapyOrderServiceRemark`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            type: 'success',
            message: '操作成功'
          });
          _self.remarkShow = false;
          _self.formData.service_remark = '';
          _self.getTable();
        }
      });
    },
    // 查看详情
    getOrderDetail(id) {
      let _self = this;
      ajax.get(`/api/jinmu/GetPhysiotherapyOrderDetail/` + id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.detailData = res.data.data;
          if (Number.isInteger(_self.detailData.service_price)) {
            let double = parseFloat(_self.detailData.service_price);
            _self.detailData.service_price = double.toFixed(2);
          }
          if (_self.detailData.reserve_status === 0) {
            _self.detailsData = '预约中';
          } else if (_self.detailData.reserve_status === 1) {
            _self.detailsData = '预约成功';
          } else if (_self.detailData.reserve_status === 2) {
            _self.detailsData = '已完成';
          } else if (_self.detailData.reserve_status === -10) {
            _self.detailsData = '取消';
          }
        }
      });
    },
    customCompFunc(params) {
      let _self = this;
      if (params.type === 'detail') {
        _self.DetailShow = true;
        _self.getOrderDetail(params.rowData.id);
      } else if (params.type === 'handle') {
        _self.orderId = params.rowData.id;
        _self.orderShow = true;
      } else if (params.type === 'remark') {
        _self.remarkShow = true;
        _self.formData.id = params.rowData.id;
        this.getDetail(params.rowData.id);
      }
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.searchData;
      ajax.post(`/api/jinmu/GetPhysiotherapyOrderPageList`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data.details;
          _self.total = res.data.data.rcounr;
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
    },
  },
  created() {
    this.getTable();
  },
};
</script>

<style lang="less" scoped>
.imgFood {
  width: 105px;
  height: 75px;
  border-radius: 3px;
}
.details {
  padding: 0 50px 0 50px;
  .details_p{
    height: 20px;
    line-height: 20px;
    font-size: 16px;
  }
  .details_left{
    float: left;
  }
  .details_right{
    float: right;
    width: 550px;
    // text-emphasis:
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
  .last{
    margin-bottom: 20px
  }
}
.stick {
  width: 100%;;
  height: 50px;
  text-align: center;
  /deep/ .el-button {
    padding: 0;
    margin-left: 0px;
  }
  .stick_button {
    // margin-bottom: 15px;
    width: 100px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-radius: 5px;
  }
}
.form-button{
  text-align: center;
  margin: 20px 0 0 -80px;
}
</style>
