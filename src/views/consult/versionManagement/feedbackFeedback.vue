<template>
  <div id="feedbackFeedback">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">新增</el-button>
      </el-button-group>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="医生端app" name="first">
        <div class="search-wrapper">
          <el-form :inline="true" :model="business1" size="small">
            <el-form-item label="医生姓名">
              <el-input class="el-width1" v-model="business1.docUserName"></el-input>
            </el-form-item>
            <el-form-item label="反馈内容">
              <el-input class="el-width1" v-model="business1.feedStr"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker class="el-date-picker" type="date" placeholder="开始日期" v-model="business1.beginDate"></el-date-picker>
              <el-date-picker class="el-date-picker" type="date" placeholder="结束日期" v-model="business1.endDate"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty1">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query1">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-wrapper">
          <v-table ref="table1" column-width-drag is-horizontal-resize style="width:100%" :columns="columns1" :table-data="tableData1" row-hover-color="#eee"
          row-click-color="#edf7ff" @on-custom-comp="customCompFunc1" :select-all="selectALL1" :select-change="selectChange1" :select-group-change="selectGroupChange1"></v-table>
        </div>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange1" @page-size-change="pageSizeChange1" :total="total1" :page-index="business1.pageIndex" :page-size="business1.pageSize"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="业务员app" name="second">
        <div class="search-wrapper">
          <el-form :inline="true" :model="business2" size="small">
            <el-form-item label="业务员姓名">
              <el-input class="el-width1" v-model="business2.docUserName"></el-input>
            </el-form-item>
            <el-form-item label="反馈内容">
              <el-input class="el-width1" v-model="business2.feedStr"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker class="el-date-picker" type="date" placeholder="开始日期" v-model="business2.beginDate"></el-date-picker>
              <el-date-picker class="el-date-picker" type="date" placeholder="结束日期" v-model="business2.endDate"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty2">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query2">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-wrapper">
          <v-table ref="table2" column-width-drag is-horizontal-resize style="width:100%" :columns="columns2" :table-data="tableData2" row-hover-color="#eee"
          row-click-color="#edf7ff" @on-custom-comp="customCompFunc2" :select-all="selectALL2" :select-change="selectChange2" :select-group-change="selectGroupChange2"></v-table>
        </div>
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange2" @page-size-change="pageSizeChange2" :total="total2" :page-index="business2.pageIndex" :page-size="business2.pageSize"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增 -->
    <el-dialog title="添加反馈信息" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="40%" center>
      <el-form :model="addData" ref="ruleForm" :rules="rules">
        <!-- <el-form-item label="医生ID" label-width="100px" prop="Uid">
          <el-input v-model="addData.Uid"  :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="医生ID" label-width="100px" prop="Uid">
          <el-select v-model="addData.Uid">
            <el-option
              v-for="item in doctorArrayList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型"  label-width="100px" prop="Type">
          <el-select v-model="addData.Type">
            <el-option label="医生app" value="0"></el-option>
            <!-- <el-option label="业务员app" value="1"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="反馈信息" label-width="100px" prop="Content">
          <el-input v-model="addData.Content"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="100px" prop="Pic">
          <uploadSingleImg :imgUrl="addData.Pic" :fileName="'Image'" @uploadSuccess="addDatauploadImg" @removeImg="addDataremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="addData.Pic"></el-input>
        </el-form-item>
        <el-form-item label="类型"  label-width="100px" prop="Status">
          <el-select v-model="addData.Status">
            <el-option label="已经收到" value="0"></el-option>
            <el-option label="已经处理" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog title="医生版APP-意见详情" :visible.sync="dialogFormVisible1" :modal-append-to-body="false" width="40%" center>
      <div class="display-box">
        <label class="txt">姓名: </label>
        <label class="box-flex">{{detailedData.username}}</label>
      </div>
      <!-- <div class="display-box">
        <label class="txt">所属医院: </label>
        <label class="box-flex"></label>
      </div> -->
      <div class="display-box">
        <label class="txt">手机号码: </label>
        <label class="box-flex">{{detailedData.mobile}}</label>
      </div>
      <div class="display-box">
        <label class="txt">设备类型: </label>
        <label class="box-flex">{{detailedData.brand}}</label>
      </div>
      <div class="display-box">
        <label class="txt">版本名称: </label>
        <label class="box-flex">{{detailedData.docappbersionnum}}</label>
      </div>
      <div class="display-box">
        <label class="txt">创建时间: </label>
        <label class="box-flex">{{detailedData.createtime}}</label>
      </div>
      <div class="display-box">
        <label class="txt">反馈内容: </label>
        <label class="box-flex">{{detailedData.content}}</label>
      </div>
      <!-- <div class="display-box">
        <label class="txt">图片: </label>
        <img class="el_dialogImg" src="https://api.vtrois.com/image/50x50" alt="">
        <img class="el_dialogImg" src="https://api.vtrois.com/image/50x50" alt="">
        <img class="el_dialogImg" src="https://api.vtrois.com/image/50x50" alt="">
      </div> -->
    </el-dialog>
    <el-dialog title="业务员版APP-意见详情" :visible.sync="dialogFormVisible2" :modal-append-to-body="false" width="40%" center>
      <div class="display-box">
        <label class="txt">姓名: </label>
        <label class="box-flex">{{detailedData.username}}</label>
      </div>
      <div class="display-box">
        <label class="txt">手机号码: </label>
        <label class="box-flex">{{detailedData.mobile}}</label>
      </div>
      <div class="display-box">
        <label class="txt">设备类型: </label>
        <label class="box-flex">{{detailedData.brand}}</label>
      </div>
      <div class="display-box">
        <label class="txt">创建时间: </label>
        <label class="box-flex">{{detailedData.createtime}}</label>
      </div>
      <div class="display-box">
        <label class="txt">反馈内容: </label>
        <label class="box-flex">{{detailedData.content}}</label>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import uploadSingleImg from '@/components/upload/uploadImg';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      activeName: 'first',
      tabIndex: 0,
      sidebarValue: this.sidebarStatus,
      tab: 1,
      // 请求参数
      business1: {
        pageIndex: 1,
        pageSize: 10,
        docUserName: '',
        feedStr: '',
        beginDate: '',
        endDate: ''
      },
      business2: {
        pageIndex: 1,
        pageSize: 10,
        docUserName: '',
        feedStr: '',
        beginDate: '',
        endDate: ''
      },
      // 表格数据
      tableData1: [],
      tableData2: [],
      // 选择的记录
      selection1: [],
      selection2: [],
      // 总数
      total1: 0,
      total2: 0,
      // 添加弹出层
      dialogFormVisible: false,
      addData: {
        Type: '0',
        Uid: '',
        Content: '',
        Pic: '',
        Status: ''
      },
      // 详情数据
      detailedData: {},
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      // 数据验证
      rules: {
        // Type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        Uid: [{ required: true, message: '请输入医生ID', trigger: 'blur' }],
        Content: [{ required: true, message: '请输入反馈信息', trigger: 'blur' }],
        Pic: [{ required: true, message: '请输入图片地址', trigger: 'blur' }],
        Status: [{ required: true, message: '请输入状态', trigger: 'blur' }],
      },
      // 医生数组
      doctorArrayList: []
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['table1'].resize();
      this.$refs['table2'].resize();
    }
  },
  computed: {
    columns1() {
      let _self = this;
      let columns1 = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business1.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'username', title: '医生姓名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '所属医院', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号码', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '设备类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'docappbersionnum', title: '版本名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'content', title: '反馈内容', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-feedbackFeedback', isResize: true }
      ];
      for (let i = 0; i < columns1.length; i++) {
        let item = columns1[i];
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
      }
      return columns1;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business2.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'username', title: '业务员姓名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '账号类型', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '手机号码', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '设备类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '反馈内容', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-feedbackFeedback', isResize: true }
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
      }
      return columns2;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  components: {
    'uploadSingleImg': uploadSingleImg,
  },
  methods: {
    // 表格tab切换
    handleClick(tab) {
      this.activeName = tab.name;
      this.$refs['table1'].resize();
      this.$refs['table2'].resize();
    },
    // 中国标准时间转换
    timeToTimestamp(timestamp) {
      let d = new Date(timestamp);
      let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return youWant;
    },
    // 添加关键词 上传图片
    addDatauploadImg(data) {
      this.addData.Pic = data.url;
    },
    // 添加关键词 删除图片
    addDataremoveImg() {
      this.addData.Pic = '';
    },
    // 请求医生列表
    getdocuserlist() {
      // ajax.get('/api/hospitalManage/getdocuserlist?pageindex=1&pagesize=999').then(data => {
      ajax.get('/api/hospitalManage/getdocuserall').then(data => {
        console.log('医生列表', data);
        if (data.status === 200 && data.data.code === 0) {
          this.doctorArrayList = data.data.data;
        }
      });
    },
    // 请求接口数据1
    getTableData1() {
      if (this.business1.beginDate) {
        this.business1.beginDate = this.timeToTimestamp(this.business1.beginDate);
      }
      if (this.business1.endDate) {
        this.business1.endDate = this.timeToTimestamp(this.business1.endDate);
      }
      ajax.get('/api/VersionManage/getdocfeedbacklist?pageIndex=' + this.business1.pageIndex + '&pageSize=' + this.business1.pageSize + '&docUserName=' + this.business1.docUserName + '&feedStr=' + this.business1.feedStr + '&beginDate=' + this.business1.beginDate + '&endDate=' + this.business1.endDate).then(data => {
        console.log('医生端', data);
        if (data.status === 200 && data.data.code === 0) {
          this.total1 = data.data.recordscount;
          this.tableData1 = data.data.data;
        }
      });
    },
    // 请求接口数据2
    getTableData2() {
      if (this.business2.beginDate) {
        this.business2.beginDate = this.timeToTimestamp(this.business2.beginDate);
      }
      if (this.business2.endDate) {
        this.business2.endDate = this.timeToTimestamp(this.business2.endDate);
      }
      ajax.get('/api/VersionManage/getdocfeedbacklist?pageIndex=' + this.business2.pageIndex + '&pageSize=' + this.business2.pageSize + '&docUserName=' + this.business2.docUserName + '&feedStr=' + this.business2.feedStr + '&beginDate=' + this.business2.beginDate + '&endDate=' + this.business2.endDate).then(data => {
        console.log('业务员', data);
        if (data.status === 200 && data.data.code === 0) {
          this.total2 = data.data.recordscount;
          this.tableData2 = data.data.data;
        }
      });
    },
    // 详情
    getdocfeedbackinfo(id) {
      ajax.get('/api/VersionManage/getdocfeedbackinfo?uId=' + id).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.detailedData = data.data.data;
          console.log(this.detailedData);
        }
      });
    },
    // 清空
    empty1() {
      this.business1.pagingIndex = 1;
      this.business1.pageSize = 10;
      this.business1.docUserName = '';
      this.business1.feedStr = '';
      this.business1.beginDate = '';
      this.business1.endDate = '';
      this.getTableData1();
    },
    empty2() {
      this.business2.pagingIndex = 1;
      this.business2.pageSize = 10;
      this.business2.docUserName = '';
      this.business2.feedStr = '';
      this.business2.beginDate = '';
      this.business2.endDate = '';
      this.getTableData2();
    },
    // 查询
    query1() {
      this.getTableData1();
    },
    query2() {
      this.getTableData2();
    },
    // 添加操作
    add() {
      this.dialogFormVisible = true;
    },
    queryAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/VersionManage/adddocfeedbackinfo', this.addData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.dialogFormVisible = false;
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.$refs['ruleForm'].resetFields();
              // this.addData.Uid = '';
              // this.addData.Content = '';
              // this.addData.Pic = '';
              // this.addData.Status = '';
              this.getTableData1();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除列表数据
    removeTableData(params) {
      ajax.post('/api/VersionManage/deldocfeedbackinfo', { id: params.rowData.id }).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.$message({
            type: 'info',
            message: data.data.message
          });
          this.getdocuserlist();
          this.getTableData1();
          // this.getTableData2();
        }
      });
    },
    // 自定义组件操作
    customCompFunc1(params) {
      // 查看详情操作
      if (params.type === 'readDetail') { // do edit operation
        this.dialogFormVisible1 = true;
        this.getdocfeedbackinfo(params.rowData.id);
      }
      // 删除
      else if (params.type === 'deleteRow') {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeTableData(params);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    customCompFunc2(params) {
      // 查看详情操作
      if (params.type === 'readDetail') { // do edit operation
        this.dialogFormVisible2 = true;
        this.getdocfeedbackinfo(params.rowData.id);
      }
      // 删除
      else if (params.type === 'deleteRow') {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeTableData(params);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 全选反选1
    selectALL1(selection) {
      this.selection1 = selection;
    },
    selectChange1(selection, rowData) {
      this.selection1 = selection;
    },
    selectGroupChange1(selection) {
      this.selection1 = selection;
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
    // 分页1
    pageChange1(pageIndex) {
      this.business1.pageIndex = pageIndex;
      this.getTableData1();
    },
    pageSizeChange1(pageSize) {
      this.business1.pageSize = pageSize;
      this.getTableData1();
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
  mounted() {
    this.$refs['table1'].resize();
    this.$refs['table2'].resize();
  },
  created() {
    this.getdocuserlist();
    this.getTableData1();
    // this.getTableData2();
  }
};
</script>

<style lang="less" scoped>
.display-box{
  display: flex;
  margin-bottom: 5px;
  .txt{
    display: block;
    font-weight: bold;
    margin-right: 8px;
    width: 100px;
  }
  .box-flex{
    white-space: normal;
    word-break: break-all;
    line-height: 24px;
  }
  img{
    margin-right: 8px;
  }
}
</style>
