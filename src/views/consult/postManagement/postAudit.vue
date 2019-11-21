<template>
  <div id="business">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="标题">
          <el-input class="el-width1" v-model="business.ttopic"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="business.status" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发贴日期">
          <el-date-picker class="el-date-picker" v-model="business.startttime" type="datetime" placeholder="开始日期"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker class="el-date-picker" v-model="business.endttime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">新增帖子</el-button>
      </el-button-group>
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
    <!-- 新增帖子 -->
    <el-dialog title="新增帖子" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="60%" center :close-on-click-modal="false" >
      <iframe :src="dialogFormVisibleUrl" frameborder="0" style="width:100%;height:700px;background-color:#FFF;"></iframe>
    </el-dialog>
    <!-- 详情编辑 -->
    <el-dialog title="详情编辑" :visible.sync="toExamineAdopt" :modal-append-to-body="false" width="60%" center @close="closeDialog" :close-on-click-modal="false" >
      <iframe :src="toExamineAdoptUrl" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
    </el-dialog>
    <!-- 上传焦点图 -->
    <el-dialog title="上传焦点图：" :visible.sync="uploadFocus" :modal-append-to-body="false" width="60%" center>
      <el-form :model="focusData" ref="ruleFormFocus" :rules="rules">
        <!-- <el-form-item label="帖子ID" label-width="100px" prop="tid">
          <el-input v-model="focusData.tid" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="焦点图标题" label-width="100px" prop="focus_title">
          <el-input v-model="focusData.focus_title"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" label-width="100px" prop="loopicture">
          <uploadSingleImg :imgUrl="focusData.loopicture" :fileName="'Image'" @uploadSuccess="focusDatauploadImg" @removeImg="focusDataremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="focusData.loopicture"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否焦点图"  label-width="100px" prop="is_loop">
          <el-select v-model="focusData.is_loop">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="焦点图排序"  label-width="100px" prop="sequence">
          <el-select v-model="focusData.sequence">
            <el-option  value="1"></el-option>
            <el-option  value="2"></el-option>
            <el-option  value="3"></el-option>
            <el-option  value="4"></el-option>
            <el-option  value="5"></el-option>
            <el-option  value="6"></el-option>
            <el-option  value="7"></el-option>
            <el-option  value="8"></el-option>
            <el-option  value="9"></el-option>
            <el-option  value="10"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadFocus = false">取 消</el-button>
        <el-button type="primary" @click="queryFocus">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/yilinAjax';
import uploadSingleImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      Body_editor: null,
      sidebarValue: this.sidebarStatus,
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        ttopic: '',
        startttime: '',
        endttime: '',
        status: ''
      },
      raredrugOptions: [
        { value: 0, label: '未认证' },
        { value: 1, label: '认证成功' },
        { value: 2, label: '认证失败' },
      ],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 添加弹出层
      dialogFormVisible: false,
      dialogFormVisibleUrl: `${process.env.WEB_HOST}/postManagement/addpostAudit`,
      // 弹出框详情编辑
      toExamineAdopt: false,
      modifyId: '',
      initializationUrl: `${process.env.WEB_HOST}/postManagement/modifypostAudit?id=`,
      toExamineAdoptUrl: '',
      // 数据验证
      rules: {
        tuid: [{ required: true, message: '请输入发帖用户id', trigger: 'blur' }],
        ttopic: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        tcontents: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        tpicture: [{ required: true, message: '请输入主帖图片url', trigger: 'blur' }],
        is_url: [{ required: true, message: '请输入是否正常内容', trigger: 'blur' }],
        tid: [{ required: true, message: '请输入帖子ID', trigger: 'blur' }],
        ttime: [{ required: true, message: '请输入发帖时间', trigger: 'blur' }],
        focus_title: [{ required: true, message: '请输入焦点图标题', trigger: 'blur' }],
        loopicture: [{ required: true, message: '请输入轮播图片地址', trigger: 'blur' }],
        is_loop: [{ required: true, message: '请输入是否焦点图', trigger: 'blur' }],
        sequence: [{ required: true, message: '请输入焦点图排序号', trigger: 'blur' }],
      },
      // 弹出层上传焦点图
      uploadFocus: false,
      focusData: {
        tid: '',
        focus_title: '',
        loopicture: '',
        is_loop: '1',
        sequence: '',
      }
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'ttopic', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ttime', title: '发贴时间', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'tcontents', title: '内容', width: 300, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'is_loop', title: '焦点图', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'hotspot', title: '热门', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 500, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-postAudit', isResize: true }
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
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:red;">未审核</span>`;
            } else if (value === 1) {
              return `<span style="color:green;">审核通过</span>`;
            } else if (value === 2) {
              return `<span style="color:red;">审核失败</span>`;
            } else if (value === 3) {
              return `<span style="color:red;">删除</span>`;
            }
          };
        }
        if (item.field === 'hotspot') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:green;">是</span>`;
            } else if (value === 0) {
              return `<span style="color:red;">否</span>`;
            }
          };
        }
        if (item.field === 'is_loop') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return `<span style="color:green;">是</span>`;
            } else {
              return `<span style="color:red;">否</span>`;
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
  components: {
    'uploadSingleImg': uploadSingleImg,
  },
  methods: {
    // 中国标准时间转换
    timeToTimestamp(timestamp) {
      let d = new Date(timestamp);
      let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return youWant;
    },
    // 焦点图 上传图片
    focusDatauploadImg(data) {
      this.focusData.loopicture = data.url;
    },
    // 焦点图 删除图片
    focusDataremoveImg() {
      this.focusData.loopicture = '';
    },
    // 获取帖子列表数据
    getTableData() {
      // if (this.business.startttime) {
      //   this.business.startttime = this.timeToTimestamp(this.business.startttime);
      // }
      // if (this.business.endttime) {
      //   this.business.endttime = this.timeToTimestamp(this.business.endttime);
      // }
      ajax.get('/api/PostManage/GetPostTopicList?pageIndex=' + this.business.pageIndex + '&pageSize=' + this.business.pageSize + '&ttopic=' + this.business.ttopic + '&startttime=' + this.business.startttime + '&endttime=' + this.business.endttime + '&status=' + this.business.status).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.total = data.data.recordscount;
          this.tableData = data.data.data;
        }
      });
    },
    // 清空
    empty() {
      console.log('清空');
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.ttopic = '';
      this.business.startttime = '';
      this.business.endttime = '';
      this.business.status = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 添加操作
    add() {
      this.dialogFormVisible = true;
    },
    addpostAudit() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    // 修改操作
    modifypostAudit() {
      this.toExamineAdopt = false;
      this.getTableData();
    },
    closeDialog() {
      this.toExamineAdoptUrl = '';
      this.getTableData();
    },
    // 设置焦点图
    setFocus(params) {
      this.focusData.tid = params.rowData.tid;
      this.focusData.focus_title = params.rowData.focus_title;
      this.focusData.loopicture = params.rowData.loopicture;
      // this.focusData.is_loop = params.rowData.is_loop;
      this.focusData.sequence = params.rowData.sequence;
      // if (this.focusData.is_loop === 0) {
      //   this.focusData.is_loop = '否';
      // } else if (this.focusData.is_loop === 1) {
      //   this.focusData.is_loop = '是';
      // }
      this.uploadFocus = true;
    },
    // 设置焦点图提交
    queryFocus(ruleFormFocus) {
      // if (this.focusData.is_loop === '否') {
      //   this.focusData.is_loop = '0';
      // } else if (this.focusData.is_loop === '是') {
      //   this.focusData.is_loop = '1';
      // }
      this.$refs['ruleFormFocus'].validate((valid) => {
        if (valid) {
          ajax.post('/api/postmanage/SetfocusTopic', this.focusData).then(data => {
            console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
            }
            this.uploadFocus = false;
            this.getTableData();
          });
        }
      });
    },
    // 删除列表数据
    removeTableData(params) {
      ajax.get('/api/postmanage/DelTopicById/?id=' + params.rowData.tid).then(data => {
        console.log(data);
        if (data.status === 200 && data.data.code === 0) {
          this.$message({
            type: 'info',
            message: data.data.message
          });
          this.getTableData();
        }
      });
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 删除操作
      if (params.type === 'deleteRow') { // do edit operation
        this.$confirm('此操作将永久删除该搜索, 是否继续?', '提示', {
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
      // 审核成功操作
      else if (params.type === 'setExamine') { // do delete operation
        this.$confirm('确定要认证成功该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/ApproveTopic/?id=' + params.rowData.tid + '&status=1').then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.getTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 审核失败操作
      else if (params.type === 'cancelExamine') { // do delete operation
        this.$confirm('确定要认证失败该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/ApproveTopic/?id=' + params.rowData.tid + '&status=2').then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.getTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 设置热门操作
      else if (params.type === 'setHot') { // do delete operation
        this.$confirm('确定要设置热门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/SethotspotTopic/?id=' + params.rowData.tid + '&hotspot=1').then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.getTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 取消热门操作
      else if (params.type === 'cancelHot') { // do delete operation
        this.$confirm('确定要取消热门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/SethotspotTopic/?id=' + params.rowData.tid + '&hotspot=0').then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.getTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 设置焦点图
      else if (params.type === 'setFocus') { // do delete operation
        this.setFocus(params);
      }
      // 取消焦点图
      else if (params.type === 'cancelFocus') { // do delete operation
        console.log('取消焦点图');
        this.$confirm('确定要取消焦点图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/CannelfocusTopic?id=' + params.rowData.tid).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.getTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 详情编辑操作
      else if (params.type === 'readDetail') { // do delete operation
        // console.log('详情编辑操作');
        // this.$router.push({
        //   path: 'modifypostAudit?id=' + params.rowData.tid,
        // });
        this.toExamineAdoptUrl = this.initializationUrl + params.rowData.tid;
        this.toExamineAdopt = true;
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
    // 查看大图
    previewImg(url) {
      this.$alert(`<img src="${url}" alt='' width="200px" height="200px"/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
  },
  created() {
    this.getTableData();
    window.addpostAudit = this.addpostAudit;
    window.modifypostAudit = this.modifypostAudit;
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
@import "kindeditor/themes/default/default.css";
.display-box{
  display: flex;
  justify-content: space-between;
}
</style>