<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" class="cityBox">
              <el-select v-model="business.city" size='small' placeholder="请选择">
                <el-option
                  v-for="item in cityArray"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="门店状态">
              <el-select v-model="business.auditStatus" size='small' placeholder="请选择">
                <el-option
                  v-for="item in auditStatusArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="第三方药店名称">
              <el-input v-model="business.name" placeholder="请输入药店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="search-wrapper">
      <el-button type="primary" size="small" @click="addPharmacy">增加药店</el-button>
      <el-button type="primary" size="small" @click="batchSwitch">批量开关店</el-button>
    </div>
    <div class="feedbackFeedback">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageIndex" :page-size="business.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 增加药店 -->
    <el-dialog title="增加药店" :visible.sync="addToPharmacy" :modal-append-to-body="false" width="50%" center>
      <el-form :model="addData" ref="addRuleForm" :rules="rules" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="已选药店Id" label-width="120px" prop="sellerUserId">
              <el-input v-model="addData.sellerUserId" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="第三方平台" label-width="120px" prop="type">
              <el-select v-model="addData.type" placeholder="请选择">
                <el-option
                  v-for="item in typeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="第三方药店ID" label-width="120px" prop="appPoiCode">
              <el-select v-model="addData.appPoiCode" placeholder="请输入药店ID">
                <el-option
                  v-for="item in platformIds"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" size="small" @click="queryId">查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="第三方药店名称" label-width="120px">
              <el-input v-model="pharmacyName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addToPharmacy = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量开关店1 -->
    <el-dialog title="批量开关店" :visible.sync="batchSwitch1" :modal-append-to-body="false" width="50%" center>
      <h2>城市选择</h2>
      <div class="cityName">城市名称</div>
      <div class="city-item" v-for="item in cityArray" :key="item.index" @click="city(item)">{{item}}</div>
    </el-dialog>
    <!-- 批量开关店2 -->
    <el-dialog title="批量开关店" :visible.sync="batchSwitch2" :modal-append-to-body="false" width="70%" center>
      <div class="region">
        <div>药店列表</div>
        <div>{{business2.city}}</div>
      </div>
      <div>
        <el-form>
        <el-form-item>
          <el-radio-group  v-model="platformChoice">
            <el-radio label="美团"></el-radio>
            <el-radio label="饿了么"></el-radio>
            <el-radio label="京东到家"></el-radio>
          </el-radio-group>
        </el-form-item>
        </el-form>
      </div>
      <div class="operation">
        <el-button type="primary" size="small" @click="back">返回</el-button>
        <div>
          <el-button type="primary" size="small" @click="batchOpen">批量开店</el-button>
          <el-button type="primary" size="small" @click="batchShut">批量关店</el-button>
        </div>
      </div>
      <div class="feedbackFeedback">
        <v-table ref="data_table2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
        row-click-color="#edf7ff" :select-all="selectALL2" :select-change="selectChange2" :select-group-change="selectGroupChange2"></v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange2" @page-size-change="pageSizeChange2" :total="total2" :page-index="business2.pageIndex" :page-size="business2.pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // 城市
      cityArray: [
        '广州市',
        '佛山市',
        '深圳市',
        '揭阳市',
        '重庆市',
        '昆明市',
      ],
      cityDialog: false,
      cityTempArray: [],
      cityTempNum: '',
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        auditStatus: 2,
        city: '',
        name: '',
      },
      // 渠道
      typeArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 门店状态
      auditStatusArray: [
        { value: 1, label: '审核中' },
        { value: 2, label: '上架' },
        { value: 3, label: '未通过' },
        { value: 4, label: '停用' },
      ],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 门店id列表
      platformIds: [],
      // 选择的个数是否正确
      numLength: 1,
      proudctNum: false,
      selectionData: {},
      // 增加药店 第三方平台
      addToPharmacy: false,
      pharmacyName: '待查询',
      addData: {
        sellerUserId: '',
        type: 1,
        appPoiCode: '',
      },
      // 数据验证
      rules: {
        sellerUserId: [{ required: true, message: '请输入药店Id', trigger: 'blur' }],
        type: [{ required: true, message: '请先选择第三方平台', trigger: 'blur' }],
        appPoiCode: [{ required: true, message: '请先选择第三方药店ID', trigger: 'blur' }],
        // appPoiCode: [{ required: true, validator: this.validAppPoiCode, trigger: 'blur' }],
      },
      // 批量开关店1
      batchSwitch1: false,
      // 请求参数
      business2: {
        pageIndex: 1,
        pageSize: 10,
        city: '',
        type: '',
      },
      // 批量开关店2
      batchSwitch2: false,
      platformChoice: '美团',
      // 表格数据
      tableData2: [],
      // 选择的记录
      selection2: [],
      // 总数
      total2: 0,
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * _self.business.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '药店名称', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '地址', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'auditStatus', title: '本地门店状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'meituanStatus', title: '美团(第三方)状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'baiduStatus', title: '饿百(第三方)状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'jingdongStatus', title: '京东(第三方)状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'auditStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:gray;">审核中</span>`;
            } else if (value === '2') {
              return `<span style="color:green;">上架</span>`;
            } else if (value === '3') {
              return `<span style="color:red;">未通过</span>`;
            } else if (value === '4') {
              return `<span style="color:red;">停用</span>`;
            }
          };
        }
        if (item.field === 'meituanStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:green;">营业</span>`;
            } else if (value === '3') {
              return `<span style="color:gray;">休息</span>`;
            } else {
              return `<span style="color:red;">未创建</span>`;
            }
          };
        }
        if (item.field === 'baiduStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:green;">营业</span>`;
            } else if (value === '3') {
              return `<span style="color:gray;">休息</span>`;
            } else {
              return `<span style="color:red;">未创建</span>`;
            }
          };
        }
        if (item.field === 'jingdongStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:green;">营业</span>`;
            } else if (value === '3') {
              return `<span style="color:gray;">休息</span>`;
            } else {
              return `<span style="color:red;">未创建</span>`;
            }
          };
        }
      }
      return columns;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business2.pageIndex - 1) * _self.business2.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'appPoiCode', title: '药店id', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '药店名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isOnline', title: '门店的上下线状态', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns2.length; i++) {
        let item = columns2[i];
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
        if (item.field === 'isOnline') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:green;">上线</span>`;
            } else {
              return `<span style="color:red;">下线</span>`;
            }
          };
        }
      }
      return columns2;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    },
    'platformChoice': function() {
      if (this.platformChoice === '美团') {
        this.business2.type = 1;
      } else if (this.platformChoice === '饿了么') {
        this.business2.type = 2;
      } else if (this.platformChoice === '京东到家') {
        this.business2.type = 4;
      }
      this.getTableData2();
    },
    'addData.type': function() {
      if (this.addData.type === 1) {
        this.addData.appPoiCode = '';
        this.pharmacyName = '待查询';
        this.getMeituanIds();
      } else if (this.addData.type === 2) {
        this.addData.appPoiCode = '';
        this.pharmacyName = '待查询';
        this.getBaiduIds();
      } else if (this.addData.type === 4) {
        this.addData.appPoiCode = '';
        this.pharmacyName = '待查询';
        this.getJingdongIds();
      }
    },
  },
  methods: {
    // 渠道门店管理列表
    getTableData() {
      console.log(this.business);
      javaAjax.post(`/mall_manage/store/third/selectStore`, this.business).then((res) => {
        console.log('渠道门店管理列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // 药店ID验证
    isvalidAppPoiCode(str) {
      let han = /^[\u4e00-\u9fa5]+$/;
      return han.test(str);
    },
    validAppPoiCode(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入药店ID!'));
      } else if (this.isvalidAppPoiCode(value)) {
        callback(new Error('药店ID不支持汉字!'));
      } else {
        callback();
      }
    },
    // 美团获取门店id列表
    getMeituanIds() {
      javaAjax.post(`/mall_manage/store/getIds`).then((res) => {
        console.log('美团获取门店id列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.platformIds = res.data.resultData;
        }
      });
    },
    // 饿了么获取门店id列表
    getBaiduIds() {
      javaAjax.post(`/mall_manage/store/third/getIdsEbai`).then((res) => {
        console.log('饿了么获取门店id列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.platformIds = res.data.resultData;
        }
      });
    },
    // 京东到家获取门店id列表
    getJingdongIds() {
      javaAjax.post(`/mall_manage/store/third/getIdsJdList`).then((res) => {
        console.log('京东到家获取门店id列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.platformIds = res.data.resultData;
        }
      });
      // this.platformIds = [];
    },
    // 批量开关店加载列表
    getTableData2() {
      if (this.platformChoice === '美团') {
        this.business2.type = 1;
      } else if (this.platformChoice === '饿了么') {
        this.business2.type = 2;
      } else if (this.platformChoice === '京东到家') {
        this.business2.type = 4;
      }
      console.log(this.business2);
      javaAjax.post(`/mall_manage/store/third/queryOpenCloseStoreList`, this.business2).then((res) => {
        console.log('批量开关店加载列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData2 = res.data.resultData.data;
          this.total2 = res.data.resultData.total;
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.city = '';
      this.business.auditStatus = 2;
      this.business.name = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 全选反选
    selectALL(selection) {
      if (selection.length > this.numLength) {
        this.$message({
          message: '只能选' + this.numLength + '个',
          type: 'error'
        });
        this.proudctNum = false;
      } else {
        this.selection = selection;
        this.proudctNum = true;
      }
    },
    selectChange(selection, rowData) {
      if (selection.length > this.numLength) {
        this.$message({
          message: '只能选' + this.numLength + '个',
          type: 'error'
        });
        this.proudctNum = false;
      } else {
        this.selection = selection;
        this.proudctNum = true;
      }
    },
    selectGroupChange(selection) {
      if (selection.length > this.numLength) {
        this.$message({
          message: '只能选' + this.numLength + '个',
          type: 'error'
        });
        this.proudctNum = false;
      } else {
        this.selection = selection;
        this.proudctNum = true;
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.business.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableData();
    },
    // 增加药店
    addPharmacy() {
      this.selectionData = this.selection[0];
      console.log(this.selectionData);
      if (!this.proudctNum) {
        this.$message({
          message: '勾选的药店数量必须为' + this.numLength + '个',
          type: 'error'
        });
        return false;
      }
      this.addData.sellerUserId = this.selectionData.sellerUserId;
      console.log(this.addData);
      this.addToPharmacy = true;
    },
    // 查询ID
    queryId() {
      console.log('查询ID类型', this.addData.type);
      this.$refs['addRuleForm'].validate((valid) => {
        if (valid) {
          let url = '';
          let data = {};
          if (this.addData.type === 1) {
            url = '/mall_manage/store/third/selectStoreApiId';
            data = {
              type: this.addData.type,
              sellerUserId: this.addData.sellerUserId,
              appPoiCode: this.addData.appPoiCode
            };
          } else if (this.addData.type === 2) {
            url = '/mall_manage/store/third/selectStoreApiId';
            data = {
              type: this.addData.type,
              sellerUserId: this.addData.sellerUserId,
              appPoiCode: this.addData.appPoiCode
            };
          } else if (this.addData.type === 4) {
            url = '/mall_manage/store/third/selectStoreApiId';
            data = {
              type: this.addData.type,
              sellerUserId: this.addData.sellerUserId,
              appPoiCode: this.addData.appPoiCode
            };
          }
          javaAjax.post(url, data).then(res => {
            console.log('查询ID', res);
            if (res.status === 200 && res.data.resultCode === '0') {
              if (res.data.resultData) {
                this.$message({
                  type: 'info',
                  message: res.data.msg
                });
                this.pharmacyName = res.data.resultData;
              } else {
                this.$message({
                  type: 'warning',
                  message: '该ID未能查询到'
                });
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    // 增加药店 确定
    determine() {
      if (this.pharmacyName === '待查询') {
        this.$message({
          type: 'warning',
          message: '请先查询出药店才能添加！'
        });
        return false;
      }
      let url = '';
      let data = {};
      // console.log(this.addData);
      if (this.addData.type === 1) {
        url = '/mall_manage/store/third/saveThirdSeller';
        data = {
          type: this.addData.type,
          sellerUserId: this.addData.sellerUserId,
          appPoiCode: this.addData.appPoiCode
        };
      } else if (this.addData.type === 2) {
        url = '/mall_manage/store/third/insertEbai';
        data = {
          type: this.addData.type,
          sellerUserId: this.addData.sellerUserId,
          appPoiCode: this.addData.appPoiCode
        };
      } else if (this.addData.type === 4) {
        url = '/mall_manage/store/third/insertJd';
        data = {
          type: this.addData.type,
          sellerUserId: this.addData.sellerUserId,
          appPoiCode: this.addData.appPoiCode
        };
      }
      console.log('增加药店', url, data);
      javaAjax.post(url, data).then(res => {
      // javaAjax.post('/mall_manage/store/third/saveThirdSeller', this.addData).then(res => {
        console.log('增加药店', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'info',
            message: res.data.msg
          });
          // this.addToPharmacy = false;
          // this.pharmacyName = '待查询';
        }
      });
    },
    // 批量开关店
    batchSwitch() {
      this.batchSwitch1 = true;
    },
    // 选择城市
    city(res) {
      this.business2.city = res;
      this.batchSwitch1 = false;
      this.batchSwitch2 = true;
      this.getTableData2();
    },
    // 返回
    back() {
      // this.business.city = '';
      this.business2.city = '';
      this.batchSwitch1 = true;
      this.batchSwitch2 = false;
    },
    // 批量开店
    batchOpen() {
      console.log(this.selection2);
      if (this.selection2.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先选择药店！'
        });
        return false;
      }
      let IdsArray = [];
      for (let item of this.selection2) {
        IdsArray.push(item.appPoiCode);
      }
      let Ids = IdsArray.toString();
      let data = {
        type: this.business2.type,
        appPoiCodes: Ids,
        isOnline: 1
      };
      console.log(data);
      javaAjax.post(`/mall_manage/store/third/updateOpenCloseStore`, data).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'info',
            message: res.data.msg
          });
          this.selection2 = [];
          this.getTableData();
          this.getTableData2();
        }
      });
    },
    // 批量关店
    batchShut() {
      console.log(this.selection2);
      if (this.selection2.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先选择药店！'
        });
        return false;
      }
      let IdsArray = [];
      for (let item of this.selection2) {
        IdsArray.push(item.appPoiCode);
      }
      let Ids = IdsArray.toString();
      let data = {
        type: this.business2.type,
        appPoiCodes: Ids,
        isOnline: 0
      };
      console.log(data);
      javaAjax.post(`/mall_manage/store/third/updateOpenCloseStore`, data).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'info',
            message: res.data.msg
          });
          this.selection2 = [];
          this.getTableData();
          this.getTableData2();
        }
      });
    },
    // 全选反选2
    selectALL2(selection) {
      this.selection2 = selection;
    },
    selectChange2(selection, rowData) {
      this.selection2 = selection;
    },
    selectGroupChange2(selection) {
      this.selection2 = selection;
    },
    // 分页2
    pageChange2(pageIndex) {
      this.business2.pageIndex = pageIndex;
      this.getTableData2();
    },
    pageSizeChange2(pageSize) {
      this.business2.pageSize = pageSize;
      this.getTableData2();
    },
  },
  created() {
    this.getTableData();
    this.getMeituanIds();
  },
};
</script>
<style lang="less" scoped>
.box{
  /deep/ .el-dialog.el-dialog--center{
    height: 700px;
    overflow-y: auto;
  }
  // 城市选择
  .cityBox{
    position: relative;
    ul{
      left: 0;
      right: 0;
      position: absolute;
      height: 140px;
      overflow-y: auto;
      background: #fff;
      z-index: 10000;
      padding: 10px 0px;
      border-radius: 5px;
      border: 1px solid #ccc;
      li{
        padding: 0px 10px;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
      }
    }
  }
  // 批量开关1  城市选择
  h2{
    margin-bottom: 10px;
  }
  .cityName{
    background: #f4f9fd;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdcdc;
  }
  .input-item{
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdcdc;
    padding-left: 15px;
    input{
      padding-left: 5px;
      height: 34px;
      border-radius: 5px;
      outline: none;
    }
  }
  .city-item{
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdcdc;
    border-top: none;
    padding-left: 15px;
    color: #0e90d1;
  }
  // 批量开关2
  .region{
    display: flex;
    height: 40px;
    >div:first-child{
      font-size: 30px;
      margin-right: 20px;
    }
    >div:last-child{
      font-size: 15px;
    }
  }
  .operation{
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
}
</style>