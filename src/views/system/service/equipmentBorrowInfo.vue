<template>
<div id="equipmentBorrowInfo">
  <!-- 普通用户页面样式以及操作 -->
  <div v-if="this.detailsData.borrow_type == 1" class="ordinary">
    <h2>订单信息:</h2>
    <div class="paragraph">
      <el-row>
        <el-col :span="8">
          <div>用户账号: {{detailsData.borrow_account}}</div>
        </el-col>
        <el-col :span="8">
          <div>数量: {{detailsData.borrow_number}}</div>
        </el-col>
        <el-col :span="8">
          <div>借用时间: {{detailsData.borrow_days}}天</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div>租借费用：{{detailsData.borrow_money}}</div>
        </el-col>
        <el-col :span="8">
          <div>罚金：{{detailsData.borrow_fine}}</div>
        </el-col>
        <el-col :span="8">
          <div style="color:red;font-weight:bold;">当前状态:
            <span v-if="detailsData.order_status == 1">待发货</span>
            <span v-if="detailsData.order_status == 2">已发货</span>
            <span v-if="detailsData.order_status == 3">使用中</span>
            <span v-if="detailsData.order_status == 4">归还中</span>
            <span v-if="detailsData.order_status == 5">已归还</span>
            <span v-if="detailsData.order_status == -1">已取消</span>
            <span v-if="detailsData.order_status == 0">待支付</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <h2>设备信息:</h2>
    <div class="paragraph equipmentList">
      <div v-for="item in equipmentList" :key="item.index">设备编码: {{item.device_mac}}</div>
    </div>
    <h2>订单流程:</h2>
    <div class="paragraph" v-if="detailsData.order_status == -1">
      <el-row>
        <el-col :span="8">
          <div>订单提交时间: {{detailsData.created_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>取消时间: {{detailsData.cancel_time}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="paragraph" v-else>
      <el-row>
        <el-col :span="8">
          <div>订单提交时间: {{detailsData.created_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>开始时间: {{detailsData.start_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>退还时间: {{detailsData.back_time}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div>收到设备时间: {{detailsData.back_affim_time}}</div>
        </el-col>
      </el-row>
    </div>
    <div>
      <h2>收货信息:</h2>
      <div class="paragraph">
        <el-row>
          <el-col :span="8">
            <div>收货人: {{detailsData.consignee_name}}</div>
          </el-col>
          <el-col :span="8">
            <div>手机号: {{detailsData.consignee_phone}}</div>
          </el-col>
          <el-col :span="8">
            <div>收货地址: {{detailsData.consignee_address}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>详细地址: {{detailsData.consignee_detail_address}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="detailsData.order_status != -1">
      <h2>物流信息:</h2>
      <div class="paragraph">
        <el-row>
          <el-col :span="8">
            <div>发货信息: {{detailsData.send_logis_company}}</div>
          </el-col>
          <el-col :span="8">
            <div>物流编号: {{detailsData.send_logis_number}}</div>
          </el-col>
        </el-row>
        <!-- <el-row  v-if="detailsData.order_status == 4 || detailsData.order_status == 5"> -->
        <el-row>
          <el-col :span="8">
            <div>收货信息: {{detailsData.back_logis_company}}</div>
          </el-col>
          <el-col :span="8">
            <div>物流编号: {{detailsData.back_logis_number}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 订单操作 -->
    <div v-if="from===''">
    <!-- 待支付 -->
    <div v-if="detailsData.order_status == 0">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="cancel">取消订单</el-button>
        <!-- <el-button type="primary" size="small" @click="payment">支付订单</el-button> -->
      </div>
    </div>
    <!-- 待发货 -->
    <div v-if="detailsData.order_status == 1">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="sendOut">发放设备</el-button>
        <el-button type="primary" size="small" @click="cancel">取消订单</el-button>
      </div>
    </div>
    <!-- 已发货 -->
    <div v-if="detailsData.order_status == 2">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="cancel">取消订单</el-button>
      </div>
    </div>
    <!-- 使用中 -->
    <div v-if="detailsData.order_status == 3">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="modifyStartTime">修改开始时间</el-button>
      </div>
    </div>
    <!-- 归还中 -->
    <div v-if="detailsData.order_status == 4">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <!-- <el-button type="primary" size="small" @click="modifyStartTime">修改开始时间</el-button> -->
        <el-button type="primary" size="small" @click="confirmReceipt">确认收到设备</el-button>
        <!-- <el-button type="primary" size="small" @click="discontinuation">停用设备</el-button> -->
      </div>
    </div>
    </div>
  </div>
  <!-- 集团内部页面样式以及操作 -->
  <div v-if="this.detailsData.borrow_type == 2" class="group">
    <h2>订单信息:</h2>
    <div class="paragraph">
      <el-row>
        <el-col :span="8">
          <div>用户账号: {{detailsData.borrow_account}}</div>
        </el-col>
        <el-col :span="8">
          <div>数量: {{detailsData.borrow_number}}</div>
        </el-col>
        <el-col :span="8">
          <div>借用时间: {{detailsData.borrow_days}}天</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div>租借费用：{{detailsData.borrow_money}}</div>
        </el-col>
        <el-col :span="8">
          <div>罚金：{{detailsData.borrow_fine}}</div>
        </el-col>
        <el-col :span="8">
          <div style="color:red;font-weight:bold;">当前状态:
            <span v-if="detailsData.order_status == 1">待发货</span>
            <span v-if="detailsData.order_status == 2">已发货</span>
            <span v-if="detailsData.order_status == 3">使用中</span>
            <span v-if="detailsData.order_status == 4">归还中</span>
            <span v-if="detailsData.order_status == 5">已归还</span>
            <span v-if="detailsData.order_status == -1">已取消</span>
            <span v-if="detailsData.order_status == 0">待支付</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
        <div>单位名称: {{detailsData.borrow_company}}</div>
        </el-col>
        <el-col :span="8">
        <div>所属部门: {{detailsData.borrow_dept}}</div>
        </el-col>
        <el-col :span="8">
        <div>姓名: {{detailsData.borrow_name}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
        <div>个人工号: {{detailsData.borrow_word_number}}</div>
        </el-col>
      </el-row>
    </div>
    <h2>设备信息:</h2>
    <div class="paragraph equipmentList">
      <div v-for="item in equipmentList" :key="item.index">设备编码: {{item.device_mac}}</div>
    </div>
    <h2>订单流程:</h2>
    <div class="paragraph" v-if="detailsData.order_status == -1">
      <el-row>
        <el-col :span="8">
          <div>订单提交时间: {{detailsData.created_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>取消时间: {{detailsData.cancel_time}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="paragraph" v-else>
      <el-row>
        <el-col :span="8">
          <div>订单提交时间: {{detailsData.created_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>开始时间: {{detailsData.start_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>到期时间: {{detailsData.end_time}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div>退还时间: {{detailsData.back_time}}</div>
        </el-col>
        <el-col :span="8">
          <div>收到设备时间: {{detailsData.back_affim_time}}</div>
        </el-col>
      </el-row>
    </div>
    <div v-if="this.detailsData.send_delivery_mode === 1">
      <h2>收货信息:</h2>
      <div class="paragraph">
        用户自取
      </div>
    </div>
    <div  v-if="this.detailsData.send_delivery_mode === 2">
      <h2>收货信息:</h2>
      <div class="paragraph">
        <el-row>
          <el-col :span="8">
            <div>收货人: {{detailsData.consignee_name}}</div>
          </el-col>
          <el-col :span="8">
            <div>手机号: {{detailsData.consignee_phone}}</div>
          </el-col>
          <el-col :span="8">
            <div>收货地址: {{detailsData.consignee_address}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>详细地址: {{detailsData.consignee_detail_address}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 订单操作 -->
    <div v-if="from===''">
    <!-- 待支付 -->
    <div v-if="detailsData.order_status == 0">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="cancel">取消订单</el-button>
      </div>
    </div>
    <!-- 待发货 -->
    <div v-if="detailsData.order_status == 1">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="sendOut">发放设备</el-button>
        <el-button type="primary" size="small" @click="cancel">取消订单</el-button>
      </div>
    </div>
    <!-- 已发货 -->
    <!-- <div v-if="detailsData.order_status == 2">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="cancel">取消订单</el-button>
      </div>
    </div> -->
    <!-- 使用中 -->
    <div v-if="detailsData.order_status == 3">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="modifyStartTime">修改开始时间</el-button>
        <el-button type="primary" size="small" @click="confirmReceipt">用户已归还</el-button>
        <!-- <el-button type="primary" size="small" @click="discontinuation" v-if="detailsData.device_status == 0">停用设备</el-button> -->
      </div>
    </div>
    <!-- 归还中 -->
    <div v-if="detailsData.order_status == 4">
      <h2>订单操作:</h2>
      <div class="paragraph">
        <el-button type="primary" size="small" @click="modifyStartTime">修改开始时间</el-button>
        <el-button type="primary" size="small" @click="confirmReceipt">确认收到设备</el-button>
        <!-- <el-button type="primary" size="small" @click="discontinuation" v-if="detailsData.device_status == 0">停用设备</el-button> -->
      </div>
    </div>
    </div>
  </div>
  <!-- 发放设备弹窗 -->
  <el-dialog title="发放设备" :visible.sync="dialogFormVisible" :modal-append-to-body="true" :append-to-body='true' width="40%" center>
    <el-form :model="addData" ref="ruleForm" :rules="rules">
      <el-form-item label="选择设备" label-width="150px">
        <el-button type="primary" size="small" @click="choice">选择</el-button>
      </el-form-item>
      <el-form-item label="设备Mac编码" label-width="150px">
        <div v-for="(item, index) in addData.details" :key='index'>{{item.device_mac}} <el-button type="default" icon="el-icon-delete" size="small" @click="eliminate(item, index)">删除该设备更换</el-button></div>
      </el-form-item>
      <div v-if="this.detailsData.send_delivery_mode === 2">
        <el-form-item label="配送方式" label-width="150px">
          <el-radio-group v-model="send_delivery_mode">
            <el-radio label="快递"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流公司" label-width="150px">
          <el-select v-model="addData.send_logis_company" size='small' placeholder="请选择">
              <el-option
                v-for="item in logistics"
                :key="item.id"
                :label="item.logistic_name"
                :value="item.logistic_name">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="物流单号" label-width="150px">
          <el-input v-model.trim="addData.send_logis_number"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="queryAdd">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 选择设备弹窗 -->
  <el-dialog title="选择设备" :visible.sync="choicedialogFormVisible" :modal-append-to-body="true" :append-to-body='true' width="70%" center>
    <div class="search-wrapper">
      <el-form :inline="true" :model="equipment" size="small">
        <el-form-item label="设备mac地址">
          <el-input v-model="equipment.mac"></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="equipment.status" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"  :page-index="equipment.pageIndex" :page-size="equipment.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </el-dialog>
  <!-- 修改时间弹窗 -->
  <el-dialog title="修改时间" :visible.sync="timedialogFormVisible" :modal-append-to-body="true" :append-to-body='true' width="20%" center>
    <el-date-picker class="el-date-picker" v-model="startttime" type="datetime" placeholder="开始日期"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
    <el-button @click="timedialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="queryTime">确 定</el-button>
  </el-dialog>
</div>
</template>

<script>
import ajax from '@/utils/ajax';
// import javaAjax from '@/utils/javaApiRequest';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // 页面来源-是否外部页面引用等
      from: '',
      sidebarValue: this.sidebarStatus,
      userid: sessionStorage.getItem('userid') ? sessionStorage.getItem('userid') : '',
      nickname: sessionStorage.getItem('nickname') ? sessionStorage.getItem('nickname') : '',
      id: this.$route.query.id,
      detailsData: {},
      // 订单下的设备列表
      equipmentList: [],
      // 设备列表
      equipment: {
        pageIndex: 1,
        pageSize: 10,
        mac: '',
        status: -1
      },
      raredrugOptions: [
        { value: -1, label: '全部' },
        { value: 0, label: '正常' },
        { value: 1, label: '报修' },
        { value: 2, label: '禁用' },
      ],
      // 设备列表表格数据
      tableData: [],
      // 设备列表总数
      total: 0,
      // 选择设备列表的记录
      selection: [],
      // 选择设备列表弹窗
      choicedialogFormVisible: false,
      // 物流公司
      logistics: [],
      // 发放设备弹出层
      dialogFormVisible: false,
      // 发放方式1自取，2快递
      send_delivery_mode: '',
      // 发放设备提交数据
      addData: {
        id: this.$route.query.id,
        // 发货物流公司
        send_logis_company: '',
        // 发货物流公司代码
        send_logis_code: '',
        // 发货物流单号
        send_logis_number: '',
        // 发放设备列表
        details: [

        ]
      },
      // 修改时间弹窗
      timedialogFormVisible: false,
      // 修改时间
      startttime: '',
      // 数据验证
      rules: {
        device_mac: [{ required: true, message: '请输入设备Mac编码', trigger: 'blur' }],
      },
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
      this.$refs['data_table2'].resize();
    }
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.equipment.pageIndex - 1) * 10 + rowIndex + 1;
            return '<span style="color:red;font-weight: bold;">' + index + '</span>';
          }, isFrozen: true, isResize: true
        },
        { field: 'mac', title: '设备mac地址', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '设备状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'check_status', title: '验收状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'model', title: '设备型号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ext_status', title: '借还状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-equipmentChoice', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:green;">正常</span>`;
            } else if (value === 1) {
              return `<span style="color:red;">报修</span>`;
            } else if (value === 2) {
              return `<span style="color:red;">禁用</span>`;
            }
          };
        }
        if (item.field === 'check_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:green;">合格</span>`;
            } else if (value === 1) {
              return `<span style="color:red;">不合格</span>`;
            }
          };
        }
        if (item.field === 'ext_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:green;">未借出</span>`;
            } else if (value === 1) {
              return `<span style="color:red;">已借出</span>`;
            }
          };
        }
        if (item.field === 'model') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `基础版`;
            } else if (value === 1) {
              return `带外盒`;
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 获取物流公司
    getLogistics() {
      // javaAjax.post('/mall_manage/back/express/getExpressAll').then(res => {
      //   console.log('java物流公司', res);
      //   if (res.status === 200 && res.data.resultCode === '0') {
      //     this.logistics = res.data.resultData;
      //   }
      // });
      ajax.get(`/api/borrow/GetLogisticNameInfo`).then((res) => {
        console.log('.net物流公司', res);
        if (res.status === 200 && res.data.code === 0) {
          this.logistics = res.data.data;
        }
      });
    },
    // 获取脉诊仪设备列表
    getEquipment() {
      ajax.post(`/api/jinmu/GetDevicePageList`, this.equipment).then((res) => {
        console.log('设备列表', res);
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data.details;
          this.total = res.data.data.rcounr;
        }
      });
    },
    // 设备列表清空
    empty() {
      this.equipment.pageIndex = 1;
      this.equipment.pageSize = 10;
      this.equipment.mac = '';
      this.equipment.status = -1;
      this.getEquipment();
    },
    // 设备列表查询
    query() {
      this.getEquipment();
    },
    // 获取单个借还数据的详细的数据
    getDetailsData() {
      // ajax.get(`/api/borrow/GetBorrowDetail/` + this.id).then((res) => {
      // v2接口
      ajax.get(`/api/borrow/GetBorrowOrderDetail/` + this.id).then((res) => {
        console.log('订单详情', res);
        if (res.status === 200 && res.data.code === 0) {
          this.detailsData = res.data.data;
          this.equipmentList = res.data.data.details;
          if (res.data.data.send_delivery_mode === 1) {
            this.send_delivery_mode = '自取';
          }
          if (res.data.data.send_delivery_mode === 2) {
            this.send_delivery_mode = '快递';
          }
        }
      });
    },
    // 发放设备 弹窗显示
    sendOut() {
      this.getEquipment();
      this.dialogFormVisible = true;
    },
    // 选择脉诊仪设备 弹窗显示
    choice() {
      this.choicedialogFormVisible = true;
    },
    // 脉诊仪设备列表的自定义组件操作
    customCompFunc(params) {
      // 选择操作
      if (params.type === 'choice') { // do edit operation
        if (params.rowData.status === 1 || params.rowData.status === 2) {
          this.$message({
            type: 'info',
            message: '该设备出现故障，请勿选择该设备了'
          });
          return false;
        }
        if (params.rowData.check_status === 1) {
          this.$message({
            type: 'info',
            message: '该设备验收状态不合格，请勿选择该设备了'
          });
          return false;
        }
        if (params.rowData.ext_status === 1) {
          this.$message({
            type: 'info',
            message: '该设备已经被借出，请勿选择该设备了'
          });
          return false;
        }
        if ((this.addData.details.length + 1) > this.detailsData.borrow_number) {
          this.$message({
            type: 'info',
            message: '添加的设备数量大于申请的数量，请勿选择了'
          });
          return false;
        }
        if (this.detailsData.borrow_number === 1) {
          this.addData.details = [];
          this.addData.details[0] = ({ device_mac: params.rowData.mac });
          this.choicedialogFormVisible = false;
        }
        if (this.detailsData.borrow_number > 1) {
          for (let i = 0; i < this.addData.details.length; i++) {
            if (params.rowData.mac === this.addData.details[i].device_mac) {
              this.$message({
                type: 'info',
                message: '设备已经选择，请勿重复选择'
              });
              return false;
            }
          }
          this.addData.details.push({ device_mac: params.rowData.mac });
          this.choicedialogFormVisible = false;
        }
      }
    },
    // 删除某个设备
    eliminate(val, index) {
      this.addData.details.splice(index, 1);
    },
    // 发货操作
    queryAdd() {
      if (this.addData.details.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择设备'
        });
        return false;
      }
      if (this.addData.details.length !== this.detailsData.borrow_number) {
        this.$message({
          type: 'info',
          message: '选择设备的数量必须跟申请的数量为一致'
        });
        return false;
      }
      // 名字正则
      let nameReg = /[^a-zA-Z0-9_\u4e00-\u9fa5]/g;
      // 汉字正则
      let hanziReg = /[\u4E00-\u9FA5]/;
      // 当为快递时候 需要进行验证物流信息填入addData.send_logis_company,addData.send_logis_number
      if (this.detailsData.send_delivery_mode === 2) {
        if (!this.addData.send_logis_company) {
          this.$message({
            type: 'info',
            message: '请填写物流公司'
          });
          return false;
        }
        if (!this.addData.send_logis_number) {
          this.$message({
            type: 'info',
            message: '请填写物流单号'
          });
          return false;
        } else if (nameReg.test(this.addData.send_logis_number)) {
          this.$message({
            type: 'info',
            message: '物流单号不支持特殊符号！'
          });
          return false;
        } else if (hanziReg.test(this.addData.send_logis_number)) {
          this.$message({
            type: 'info',
            message: '物流单号不能为汉字！'
          });
          return false;
        }
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(this.addData);
          ajax.post(`/api/borrow/SendOrderBorrowDevices`, this.addData).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                type: 'info',
                message: res.data.message
              });
              this.$refs['ruleForm'].resetFields();
              this.dialogFormVisible = false;
              this.getDetailsData();
              this.getEquipment();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消订单
    cancel() {
      this.$confirm('此操作将取消该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.get(`/api/borrow/CancelBorrowOrder/` + this.user + '/' + this.id).then((res) => {
        // v2接口
        // ajax.get(`/api/borrow/CancelBorrowOrder/` + this.user + '/' + this.id).then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.$message({
              type: 'info',
              message: res.data.message
            });
            this.getDetailsData();
            this.getEquipment();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 支付订单
    payment() {
      let data = {
        pay_id: this.detailsData.pay_deposit.id,
        type: 1,
        pay_mode: 1,
        pay_no: 1061646232,
        pay_money: 0.01,
      };
      ajax.post(`/api/borrow/PaySyncOrderStatus`, data).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'info',
            message: res.data.message
          });
          this.getDetailsData();
          this.getEquipment();
        }
      });
    },
    // 修改开始时间
    modifyStartTime() {
      this.timedialogFormVisible = true;
    },
    // 确定时间
    queryTime() {
      if (this.startttime < this.detailsData.created_time) {
        this.$message({
          type: 'info',
          message: '修改时间必须大于申请订单的提交时间'
        });
        return false;
      }
      ajax.get(`/api/borrow/UpdateStartTime/` + this.id + '/' + this.startttime).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'info',
            message: res.data.message
          });
          this.getDetailsData();
          this.getEquipment();
        }
      });
      this.timedialogFormVisible = false;
    },
    // 用户已归还
    restitution() {
      this.$confirm('此操作将确定用户已归还, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.id,
          // give: '',
          // contact: '',
          // phone: '',
          // fine: '',
        };
        ajax.post(`/api/borrow/BackOrderBorrowDevices`, data).then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.$message({
              type: 'info',
              message: res.data.message
            });
            this.getDetailsData();
            this.getEquipment();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 停用设备
    discontinuation() {
      this.$confirm('此操作将停用设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.get(`/api/borrow/BatchUpdateDeviceStatusByBorrowID/` + this.id + '/2').then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.$message({
              type: 'info',
              message: res.data.message
            });
            this.getDetailsData();
            this.getEquipment();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 确认收到设备
    confirmReceipt() {
      this.$confirm('此操作将确认收到设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.id,
          // give: '',
          // contact: '',
          // phone: '',
          // fine: '',
        };
        ajax.post(`/api/borrow/BackOrderBorrowDevices`, data).then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.$message({
              type: 'info',
              message: res.data.message
            });
            this.getDetailsData();
            this.getEquipment();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 设备全选反选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 设备分页
    pageChange(pageIndex) {
      this.equipment.pageIndex = pageIndex;
      this.getEquipment();
    },
    pageSizeChange(pageSize) {
      this.equipment.pageSize = pageSize;
      this.getEquipment();
    },
  },
  created() {
    this.from = this.$route.query.from;
    this.getLogistics();
    this.getDetailsData();
    this.getEquipment();
  }
};
</script>

<style lang="less" scoped>
#equipmentBorrowInfo{
  font-size: 18px;
  padding-bottom: 100px;
  .paragraph{
    background: #eee;
    padding: 10px 20px;
    .el-row{
      padding: 10px 0;
      border-bottom:1px solid #fff;
    }
  }
  .equipmentList{
    display: flex;
    flex-wrap: wrap;
    >div{
      width: 33%;
      padding: 10px 0;
      border-bottom:1px solid #fff;
    }
  }
  h2{
    line-height: 60px;
    font-weight: normal;
    font-size: 30px;
  }
  .el-row{
    margin: 10px 0;
  }
}
</style>
