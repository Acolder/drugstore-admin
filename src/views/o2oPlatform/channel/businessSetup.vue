<template>
  <div class="box">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="渠道">
              <el-select v-model="business.type" size='small' placeholder="请选择">
                <el-option
                  v-for="item in typeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店状态">
              <el-select v-model="business.openLevel" size='small' placeholder="请选择">
                <el-option
                  v-for="item in openLevelArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
    <div class="feedbackFeedback">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="business.pageIndex" :page-size="business.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 门店信息设置 -->
    <el-dialog title="门店信息设置" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="50%" center>
      <el-form :model="modifyData" ref="modifyForm" :rules="rules">
        <el-form-item label="门店名称:" label-width="140px">
          <el-input v-model="modifyDataName" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="门店id:" label-width="140px">
          <el-input v-model="modifyData.appPoiCode" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="门店的营业状态"  label-width="140px" prop="openLevel">
          <el-select v-model.number="modifyData.openLevel">
            <el-option label="可配送" :value="1"></el-option>
            <el-option label="休息中" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间段:" label-width="140px" >
          <el-time-select
            placeholder="起始时间"
            v-model="startTime"
            :clearable="true"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00'
            }">
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              minTime: startTime
            }">
          </el-time-select>
          <el-button type="default" size="small" @click="addTime">添加营业时间</el-button>
        </el-form-item>
        <el-form-item label="营业时间段:" label-width="140px" prop="shippingTime">
          <el-input v-model="modifyData.shippingTime" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryModify">保 存</el-button>
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
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        type: 1,
        name: '',
        openLevel: '',
      },
      // 渠道
      typeArray: [
        { value: 1, label: '美团' },
        { value: 2, label: '饿了么' },
        { value: 4, label: '京东到家' },
      ],
      // 门店状态
      openLevelArray: [
        { value: 1, label: '可配送' },
        { value: 3, label: '休息中' },
      ],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      dialogFormVisible: false,
      modifyDataName: '',
      modifyData: {
        type: '',
        appPoiCode: '',
        shippingTime: '',
        openLevel: '',
      },
      // 数据验证
      rules: {
        shippingTime: [{ required: true, validator: this.validShippingTime, trigger: 'blur' }],
        openLevel: [{ required: true, message: '请输入门店的营业状态', trigger: 'blur' }],
      },
      // 时间
      timeArray: [],
      startTime: '',
      endTime: '',
    };
  },
  computed: {
    columns() {
      let columns = [
        { field: 'type', title: '渠道', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '药店名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'shippingFee', title: '配送费', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'shippingTime', title: '营业时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderCount', title: '已完成订单', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderPayment', title: '营业额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'openLevel', title: '门店营业状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isOnline', title: '门店上下线状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'table-o2oPlatformChannelBusinessSetup', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 0) {
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
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:#f37b1d;">美团</span>`;
            } else if (value === '2') {
              return `<span style="color:#3bb4f2;">饿了么</span>`;
            } else if (value === '4') {
              return `<span style="color:red;">京东到家</span>`;
            }
          };
        }
        if (item.field === 'shippingFee') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return `0`;
            }
          };
        }
        if (item.field === 'openLevel') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:green;">可配送</span>`;
            } else if (value === 3) {
              return `<span style="color:red;">休息中</span>`;
            }
          };
        }
        if (item.field === 'isOnline') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:red;">下线</span>`;
            } else if (value === 1) {
              return `<span style="color:green;">上线</span>`;
            } else if (value === 2) {
              return `<span style="color:gray;">上单中</span>`;
            } else if (value === 3) {
              return `<span style="color:green;">审核通过可上线</span>`;
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
    addTime() {
      if (!this.startTime) {
        this.$message({
          type: 'warning',
          message: '请选择开始时间!'
        });
        return false;
      }
      if (!this.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择结束时间!'
        });
        return false;
      }
      let tempTime = this.startTime + '-' + this.endTime;
      this.startTime = '';
      this.endTime = '';
      this.timeArray.push(tempTime);
      this.modifyData.shippingTime = this.timeArray.toString();
      console.log(this.modifyData.shippingTime);
    },
    // 时间验证
    isvalidShippingTime(str) {
      let han = /^[^\u4e00-\u9fa5]+$/;
      return han.test(str);
    },
    validShippingTime(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入时间段!'));
      } else if (!this.isvalidShippingTime(value)) {
        callback(new Error('时间段不支持汉字!'));
      } else {
        callback();
      }
    },
    getTableData() {
      console.log(this.business);
      javaAjax.post(`/mall_manage/store/third/selectStoreToday`, this.business).then((res) => {
        console.log('渠道门店营业时间列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.type = 1;
      this.business.openLevel = '';
      this.business.name = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 保存
    queryModify() {
      console.log(this.modifyData);
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          javaAjax.post(`/mall_manage/store/third/updateStoreShippingTime`, this.modifyData).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'info',
                message: res.data.msg
              });
              this.getTableData();
              this.timeArray = [];
              this.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 自定义组件操作
    customCompFunc(params) {
      // 编辑操作
      if (params.type === 'edit') {
        console.log(params.rowData);
        this.modifyDataName = params.rowData.name;
        this.modifyData.type = this.business.type.toString();
        this.modifyData.appPoiCode = params.rowData.appPoiCode;
        this.modifyData.shippingTime = params.rowData.shippingTime;
        this.modifyData.openLevel = params.rowData.openLevel;
        this.dialogFormVisible = true;
      }
    },
    // 全选反选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
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
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
</style>