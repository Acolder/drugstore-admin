<template>
  <div id="business">
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="exportTable">导出</el-button>
    </el-row>
    <el-tabs v-model="activeStatus" type="card" @tab-click="statusChange">
      <!--1.已确认-->
      <el-tab-pane label="已确认" name="hadConfirm">
        <div class="confirmNum">
          已确认条数:
          <span class="badge badge-danger">{{total}}</span>
        </div>
        <div class="search-wrapper">
          <el-form :inline="true" size="small" label-width="100px" :model="searchInfo">
            <el-row>
              <el-form-item label="订单编号">
                <el-input placeholder="订单编号" v-model="searchInfo.orderId"
                          @keyup.enter.native="searchProduct"></el-input>
              </el-form-item>
              <el-form-item label="下单医生">
                <el-input placeholder="下单医生" v-model="searchInfo.docName"
                          @keyup.enter.native="searchProduct"></el-input>
              </el-form-item>
              <el-form-item label="患者姓名">
                <el-input placeholder="患者姓名" v-model="searchInfo.patientName"
                          @keyup.enter.native="searchProduct"></el-input>
              </el-form-item>
              <el-form-item label="业务员姓名">
                <el-input placeholder="业务员姓名" v-model="searchInfo.saleName"
                          @keyup.enter.native="searchProduct"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="患者电话">
                <el-input placeholder="患者电话" v-model="searchInfo.patientTel"
                          @keyup.enter.native="searchProduct"></el-input>
              </el-form-item>
              <el-form-item label="是否开发票">
                <el-select v-model="searchInfo.isInvoice" placeholder="请选择">
                  <el-option label="无" value=""></el-option>
                  <el-option label="否" value="0"></el-option>
                  <el-option label="是" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单状态">
                <el-select v-model="searchInfo.orderStatus" placeholder="请选择">
                  <el-option label="无" value=""></el-option>
                  <el-option label="用户已确认" value="10"></el-option>
                  <el-option label="后台已确认" value="15"></el-option>
                  <el-option label="派送完毕" value="20"></el-option>
                  <el-option label="系统放弃(医患端)," value="98"></el-option>
                  <el-option label="医生放弃" value="99"></el-option>
                  <el-option label="患者放弃" value="97"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="处方类型">
                <el-select v-model="searchInfo.prescrType" placeholder="请选择">
                  <el-option label="无" value=""></el-option>
                  <el-option label="中药" value="0">
                  </el-option>
                  <el-option label="西药" value="1">
                  </el-option>
                  <el-option label="膏方" value="2">
                  </el-option>
                  <el-option label="丸剂" value="3">
                  </el-option>
                  <el-option label="固定膏方" value="5">
                  </el-option>
                  <el-option label="类型异常" value="4">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-form-item label="确认日期">
              <el-date-picker v-model="searchInfo.startOrderTime" align="right" type="date"
                              :picker-options="pickerOptions1" value-format="yyyy-MM-dd">
              </el-date-picker>
              -
              <el-date-picker v-model="searchInfo.endOrderTime" align="right" type="date"
                              :picker-options="pickerOptions1" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="btn-wrapper">
              <el-button type="primary" icon="el-icon-delete" @click="clear()">清空</el-button>
            </el-form-item>
            <el-form-item class="btn-wrapper">
              <el-button type="primary" icon="el-icon-search" @click="searchProduct()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <v-table ref="data_table" column-width-drag is-horizontal-resize :row-height=60 style="width:100%"
                 :columns="columns_hadConfirm" is-vertical-resize :table-data="tableData" row-hover-color="#eee"
                 row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
                        :page-size="business.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
      <!--2.待确认-->
      <el-tab-pane label="待确认" num="30" name="waitConfirm">
        <div class="confirmNum">
          剩余确认条数:
          <span class="badge badge-danger">{{total}}</span>
        </div>
        <div class="search-wrapper">
          <el-form :inline="true" size="small" label-width="100px" :model="searchInfo">
            <el-form-item label="订单编号">
              <el-input placeholder="订单编号" v-model="searchInfo.orderId" @keyup.enter.native="searchProduct"></el-input>
            </el-form-item>
            <el-form-item label="下单医生">
              <el-input placeholder="下单医生" v-model="searchInfo.docName" @keyup.enter.native="searchProduct"></el-input>
            </el-form-item>
            <el-form-item label="患者姓名">
              <el-input placeholder="患者姓名" v-model="searchInfo.patientName"
                        @keyup.enter.native="searchProduct"></el-input>
            </el-form-item>
            <el-form-item label="患者电话">
              <el-input placeholder="患者电话" v-model="searchInfo.patientTel"
                        @keyup.enter.native="searchProduct"></el-input>
            </el-form-item>
            <el-form-item label="是否开发票">
              <el-select v-model="searchInfo.isInvoice" placeholder="请选择">
                <el-option label="无" value=""></el-option>
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单日期">
              <el-date-picker v-model="searchInfo.startOrderTime" align="right" type="date"
                              :picker-options="pickerOptions1" value-format="yyyy-MM-dd">>
              </el-date-picker>
              -
              <el-date-picker v-model="searchInfo.endOrderTime" align="right" type="date"
                              :picker-options="pickerOptions1" value-format="yyyy-MM-dd">>
              </el-date-picker>
            </el-form-item>
            <el-form-item class="btn-wrapper">
              <el-button type="primary" icon="el-icon-delete" @click="clear()">清空</el-button>
            </el-form-item>
            <el-form-item class="btn-wrapper">
              <el-button type="primary" icon="el-icon-search" @click="searchProduct()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <v-table ref="data_table" column-width-drag is-horizontal-resize :row-height=60 style="width:100%"
                 :columns="columns"
                 :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
                 @on-custom-comp="customCompFunc"></v-table>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
                        :page-size="business.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 查看物流信息 -->
    <el-dialog title="物流信息" :visible.sync="dialogStepVisible" :center='true' :modal-append-to-body="false"
               width="800px">
      <div class="none" v-if="logisticsData.status == '400'">
        <p style="text-align:center;font-weight:900"><i class="el-icon-info"></i>暂无物流信息</p>
      </div>
      <div class="logistics-detail" style="position:relative" v-else>
        <div class="num" :style="'margin-bottom:15px;'">
          <el-row>
            <el-col :span="12">
              <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">订单号：</el-col>
              <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                {{logisticsData.mt_peisong_id}}
                <!--orderId-->
                {{orderid}}
              </el-col>
            </el-col>
            <el-col :span="12" v-if="logisticsData.mt_peisong_id">
              <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">配送单号：</el-col>
              <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                {{logisticsData.mt_peisong_id}}
              </el-col>
            </el-col>
            <el-col :span="12" v-else>
              <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">物流单号：</el-col>
              <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                {{logisticsData.nu}}
              </el-col>
            </el-col>
          </el-row>
        </div>
        <p class="status" style="position:absolute;top:-25px;right:-10px;font-size:20px;color:#F00"
           v-if="logisticsData.com === '美团'">{{logisticsData.status}}</p>
        <div>
          <el-row>
            <el-col :span="12" style="margin-bottom:10px;">
              <el-col :span="8" :style="'text-align:right'">配送方式：</el-col>
              <el-col :span="16">
                <span>{{logisticsData.com}}</span>
              </el-col>
            </el-col>
            <el-col :span="12" style="margin-bottom:10px;" v-if="logisticsData.com === '美团'">
              <el-col :span="8" :style="'text-align:right'">订单确认时间：</el-col>
              <el-col :span="16">
                <span>{{logisticsData.operate_time}}</span>
              </el-col>
            </el-col>
            <div v-if="(logisticsData.status !== '待接单' && logisticsData.status !== '已取消') && logisticsData.com === '美团'"
                 style="margin-bottom:10px;">
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right'">配送员：</el-col>
                <el-col :span="16">
                  <span>{{logisticsData.courier_name}}</span>
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right'">配送员电话：</el-col>
                <el-col :span="16">
                  <span>{{logisticsData.courier_phone}}</span>
                </el-col>
              </el-col>
            </div>
            <div v-if="logisticsData.status === '已取消'" style="margin-bottom:10px;">
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right'">取消原因：</el-col>
                <el-col :span="16">
                  <span>{{logisticsData.cancel_reason ? logisticsData.cancel_reason : '其他原因'}}</span>
                </el-col>
              </el-col>
            </div>
          </el-row>
        </div>
        <div v-if="logisticsData.status === '待接单'">
          <h2 :style="'text-align:center;font-size:24px;margin-top:50px;color:#ccc;'">暂无骑手接单~</h2>
        </div>
      </div>
      <div class="logistics-node" v-if="logisticsData.data">
        <div v-for="(item,index) in logisticsData.data" :key="index" class="item">
          <div class="item-left">{{item.time}}</div>
          <div class="item-right">{{item.context}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogStepVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import yilin from '@/utils/yilinAjax21';
import java from '@/utils/javaApiRequest';
/* import { formatDate } from '@/utils/date'; */
export default {
  data() {
    return {
      orderid: '',
      dialogStepVisible: false, //  物流弹框
      logisticsData: {},  //  物流数据
      // 时间快捷键
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      // 是否开发票
      optionsInvoice: [
        {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }
      ],
      // 账号类型
      optionsType: [
        {
          value: '1',
          label: '手机'
        }, {
          value: '0',
          label: '邮箱'
        }
      ],
      searchInfo: {},
      searchParams: {},
      sidebarValue: this.sidebarStatus,
      activeStatus: 'waitConfirm',
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        status: 5
      },
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 弹出层
      dialogFormVisible: false,
      addData: {
        resource: '',
        type: ''
      },
      // 弹出框商户审核
      toExamineAdopt: false,
      detailed: {},
      modifyData: {
        resource: ''
      }
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    // 1.待确认
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'kmorderid',
          title: '康美订单号',
          width: 140,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'orderid',
          title: '订单号',
          width: 140,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'ordersource',
          title: '订单来源',
          width: 60,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'ordertype',
          title: '订单类型',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'doctorname',
          title: '下单医生',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'patientname',
          title: '患者姓名',
          width: 90,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'patienttel',
          title: '患者电话',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'machine_id',
          title: '药品编号',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'extractcode',
          title: '药柜取货码',
          width: 110,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'paymethod',
          title: '支付方式',
          width: 70,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'paystatus',
          title: '支付状态',
          width: 70,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            if (rowData.paystatus === '已支付') {
              return '<span style="background-color:green;color: #FFF">' + rowData.paystatus + '</span>';
            } else {
              return rowData.paystatus;
            }
          }
        },
        {
          field: 'isinvoice',
          title: '发票类型',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let result = '';
            if (rowData.isinvoice === 0) {
              result = '否';
            } else {
              result = '是';
            }
            return result;
          },
        },
        {
          field: 'createtime',
          title: '下单时间',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'inputtime',
          title: '录入时间',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'orderstatus',
          title: '订单状态',
          width: 110,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: '',
          title: '操作',
          width: 140,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-waitConfirm',
        }
      ];
      return columns;
    },
    // 已确认columns
    columns_hadConfirm()
    {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 60,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: false
        },
        {
          field: 'orderid',
          title: '订单号',
          width: 160,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'kmorderid',
          title: '业务订单号(智慧药房)',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'ordersource',
          title: '订单来源',
          width: 75,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'ordertype',
          title: '订单类型',
          width: 40,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'doctorname',
          title: '下单医生',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'patientname',
          title: '患者姓名',
          width: 70,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'machine_id',
          title: '药品编号',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'extractcode',
          title: '药柜取货码',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'salename',
          title: '业务员姓名',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'paymethod',
          title: '支付方式',
          width: 70,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'paystatus',
          title: '支付状态',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            if (rowData.paystatus === '已支付') {
              return '<span style="background-color:green;color: #FFF">' + rowData.paystatus + '</span>';
            } else {
              return rowData.paystatus;
            }
          }
        },
        {
          field: 'isinvoice',
          title: '发票类型',
          width: 40,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let result = '';
            if (rowData.isinvoice === 0) {
              result = '否';
            } else {
              result = '是';
            }
            return result;
          },
        },
        {
          field: 'createtime',
          title: '下单时间',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'inputtime',
          title: '录入时间',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'confirmtime',
          title: '确认时间',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'orderstatus',
          title: '订单状态',
          width: 120,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'prescriptionmoney',
          title: '处方金额',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'ordermoney',
          title: '订单金额',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowData.ordermoney.toFixed(2);
          },
        },
        {
          field: '',
          title: '操作',
          width: 280,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-hadConfirm',
          isFrozen: true
        }
      ];
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 查看物流信息
    checkLogistics(orderid)
    {
      this.orderid = orderid;
      this.dialogStepVisible = true;
      let info = {
        logisticsNumber: '',
        logisticsType: '',
        orderId: orderid
      };
      // orderid = '181030150734663032';
      // 先获取物流id
      java.post(process.env.STORE_BASE_HOST + '/mall_manage_seller/back/order/queryOrderDetailByOrderId',
        { orderId: orderid }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          if (res.data.resultData) {
            info.logisticsNumber = res.data.resultData.logisticsNumber;
            info.logisticsType = res.data.resultData.logisticsType;
            this.getLogisticsData(info);
          }
        }
      });
    },
    // 获取物流信息
    getLogisticsData(info)
    {
      this.logisticsData = '';
      java.post(process.env.STORE_BASE_HOST + '/mall_manage_seller/back/order/logisticsInfo', info).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          // console.log(res.data.resultData.status);
          this.dialogStepVisible = true;
          this.logisticsData = res.data.resultData;
        }
      });
    },
    initSearchParams()
    {
      let searchParams = {
        orderId: this.$route.query.orderId,
        docName: this.$route.query.docName,
        patientName: this.$route.query.patientName,
        saleName: this.$route.query.saleName,
        patientTel: this.$route.query.patientTel,
        isInvoice: this.$route.query.isInvoice,
        orderStatus: this.$route.query.orderStatus,
        prescrType: this.$route.query.prescrType,
        startOrderTime: this.$route.query.startOrderTime,
        endOrderTime: this.$route.query.endOrderTime,
        pageIndex: this.$route.query.pageIndex,
        pageSize: this.$route.query.pageSize,
        status: this.$route.query.status,
        tapType: this.$route.query.tapType,
      };
      this.searchInfo = searchParams;
      this.searchParams = searchParams;
      if (this.$route.query.pageIndex) {
        this.business = {
          pageIndex: parseInt(this.$route.query.pageIndex, 10),
          pageSize: parseInt(this.$route.query.pageSize, 10),
          status: parseInt(this.$route.query.status, 10),
        };
        this.activeStatus = this.$route.query.tapType;
      }
      if (this.$route.query.tapType) {
        this.activeStatus = this.$route.query.tapType;
      }
    },
    getSearchParams()
    {
      return Object.assign({}, this.searchParams, this.business, { tapType: this.activeStatus });
    },
    clear()
    {
      this.searchParams = {};
      this.searchInfo = {};
    },
    // 导出
    exportTable()
    {
      let _params = Object.assign({}, this.business, this.searchParams);
      let url = process.env.YILIN_HOST + '/api/ordermanage/exportconfirmorder';
      let urlAppend = '';
      for (let key in _params) {
        if (_params[key]) {
          urlAppend = urlAppend + key + '=' + _params[key] + '&';
        }
      }
      urlAppend = urlAppend.substring(0, (urlAppend.length - 1));
      url = url + '?' + urlAppend;
      let newWindow = window.open(url);
      newWindow.location.href = url;
    },
    searchProduct()
    {
      this.searchParams = Object.assign({}, this.searchInfo);
      this.getOrderList(this.searchParams);
    },
    // 获取订单信息
    getOrderList(params)
    {
      let _params = Object.assign({}, params, this.business);
      console.log(_params);
      yilin.get('/api/ordermanage/getdocorderconfirmlist', { params: _params }).then((res) => {
        console.info('link Success, res:', res);
        if (res.status === 200 && res.statusText === 'OK') {
          console.info('成功!,res.data.data:', res.data.data);
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    // 确认状态变更
    statusChange()
    {
      if (this.activeStatus === 'hadConfirm') {
        this.business.status = null;
      } else {
        this.business.status = 5;
      }
      this.business.pageIndex = 1;
      this.getOrderList(this.searchParams);
    },
    // 清空
    empty()
    {
      console.log('清空');
    },
    // 自定义组件删改操作
    customCompFunc(rowParams)
    {
      // 1.确认操作
      if (rowParams.type === 'confirm') {
        let param;
        if (rowParams.rowData.ordersource) {
          param = {
            orderid: rowParams.rowData.orderid,
            ordersource: rowParams.rowData.ordersource,
            type: 'viewDetail',
            sourcePage: rowParams.sourcePage
          };
        } else {
          param = {
            orderid: rowParams.rowData.orderid,
          };
        }
        param = Object.assign(param, this.getSearchParams());
        this.$router.push({
          path: '/orderManage/recipeCheck',
          query: param
        });
      }
      // 2.点击物流
      else if (rowParams.type === 'viewLogistics') {
        let logisticsID = rowParams.rowData.kmorderid === '' ? rowParams.rowData.orderid : rowParams.rowData.kmorderid;
        if (rowParams.rowData.kmorderid) {
          let url = 'http://www.kmzhyf.cn:8182/zyf/search.htm?order_id=' + logisticsID;
          window.open(url);
        } else {
          this.checkLogistics(logisticsID);
        }
      }
      // 3.查看詳情
      else if (rowParams.type === 'viewDetail') {
        let param = {
          orderid: rowParams.rowData.orderid,
          type: 'viewDetail',
          sourcePage: rowParams.sourcePage
        };
        param = Object.assign(param, this.getSearchParams());
        this.$router.push({
          path: '/orderManage/recipeCheck',
          query: param
        });
      }
      // 4.打印处方
      else if (rowParams.type === 'printRecipe') {
        this.$router.push({
          path: '/orderManage/printRecipe',
          query: {
            orderid: rowParams.rowData.orderid
          }
        });
      }
    },
    // 分页
    pageChange(pageIndex)
    {
      this.business.pageIndex = pageIndex;
      this.getOrderList(this.searchParams);
    },
    pageSizeChange(pageSize)
    {
      this.business.pageSize = pageSize;
      this.getOrderList(this.searchParams);
    },
  },
  created()
  {
    console.log(1);
  },
  mounted: function () {
    this.initSearchParams();
    this.getOrderList(this.searchParams);
  }
};
</script>
<style lang="less" scoped>
  .confirmNum {
    color: red;
    margin: 10px 10px 15px 0px;
  }
  .btn-blue {
  }
  #business {
    /deep/ .el-button + .el-button {
      margin-left: 10px;
    }
  }
</style>
