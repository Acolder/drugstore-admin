<template>
  <div id="audioManagement">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="标题">
          <el-input class="el-width1" v-model="business.title"></el-input>
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
          <el-date-picker class="el-date-picker" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" v-model="business.startttime"></el-date-picker>
          <el-date-picker class="el-date-picker" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" v-model="business.endttime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">新增</el-button>
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
    <!-- 新增音频 -->
    <el-dialog title="新增音频" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="60%" center :close-on-click-modal="false" >
      <iframe :src="dialogFormVisibleUrl" frameborder="0" style="width:100%;height:500px;background-color:#FFF;"></iframe>
    </el-dialog>
    <!-- 修改音频 -->
    <el-dialog title="修改音频" :visible.sync="modifyFormVisible" :modal-append-to-body="false" width="60%" center  @close="closeDialog" :close-on-click-modal="false" >
      <iframe :src="modifyFormVisibleUrl" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
    </el-dialog>
    <!-- 名医推荐图 -->
    <el-dialog title="名医推荐图设置" :visible.sync="famousDoctor" :modal-append-to-body="false" width="60%" center>
      <el-form :model="famousDoctorData" ref="ruleFormfamousDoctor" :rules="rules">
        <el-form-item label="推荐图" label-width="100px" prop="recommend_picture">
          <uploadSingleImg :imgUrl="famousDoctorData.recommend_picture" :fileName="'Image'" @uploadSuccess="famousDoctoruploadImg" @removeImg="famousDoctorremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="famousDoctorData.recommend_picture"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="famousDoctor = false">取 消</el-button>
        <el-button type="primary" @click="queryFamousDoctor">提交</el-button>
      </div>
    </el-dialog>
    <!-- 上传焦点图 -->
    <el-dialog title="上传焦点图" :visible.sync="setFocus" :modal-append-to-body="false" width="60%" center>
      <el-form :model="setFocusData" ref="ruleFormsetFocus" :rules="rules">
        <el-form-item label="音频ID" label-width="100px">
          <el-input v-model="setFocusData.id"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="轮播标题" label-width="100px" prop="focus_title">
          <el-input v-model="setFocusData.focus_title"></el-input>
        </el-form-item>
        <el-form-item label="音频图片链接地址" label-width="100px" prop="loop_picture">
          <uploadSingleImg :imgUrl="setFocusData.loop_picture" :fileName="'Image'" @uploadSuccess="setFocusuploadImg" @removeImg="setFocusremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="setFocusData.loop_picture"></el-input>
        </el-form-item>
        <el-form-item label="是否焦点图"  label-width="100px" prop="is_focus">
          <el-select v-model="setFocusData.is_focus">
            <el-option label="是焦点图" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="焦点图排序" label-width="100px" prop="sequence">
          <el-input v-model="setFocusData.sequence" maxlength="2" placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setFocus = false">取 消</el-button>
        <el-button type="primary" @click="querysetFocus">提交</el-button>
      </div>
    </el-dialog>
    <!-- 关联目录 -->
    <el-dialog title="关联目录" :visible.sync="relation" :modal-append-to-body="false" width="80%" center>
      <div class="toolbar-wrapper">
        <el-button-group>
          <el-button type="default" icon="el-icon-plus" size="small" @click="addNewAssociation">新增</el-button>
        </el-button-group>
      </div>
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="已关联" name="first">
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
        <el-tab-pane label="未关联" name="second">
          <div class="toolbar-wrapper">
            <el-button-group>
              <el-button type="default" icon="el-icon-plus" size="small" @click="createAssociations">关联</el-button>
            </el-button-group>
          </div>
          <div class="table-wrapper">
            <v-table ref="table3" column-width-drag is-horizontal-resize style="width:100%" :columns="columns3" :table-data="tableData3" row-hover-color="#eee"
            row-click-color="#edf7ff" @on-custom-comp="customCompFunc3" :select-all="selectALL3" :select-change="selectChange3" :select-group-change="selectGroupChange3"></v-table>
          </div>
          <div class="pagin-wrapper">
            <v-pagination @page-change="pageChange3" @page-size-change="pageSizeChange3" :total="total3" :page-index="business3.pageIndex" :page-size="business3.pageSize"
            :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
            </v-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 新增关联音频 -->
    <el-dialog title="新增关联音频" :visible.sync="newAssociation" :modal-append-to-body="false" width="70%" center  @close="closeDialog2" :close-on-click-modal="false" >
      <iframe :src="newAssociationUrl" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
    </el-dialog>
    <!-- 编辑关联音频 -->
    <el-dialog title="编辑关联音频" :visible.sync="editingAssociation" :modal-append-to-body="false" width="70%" center  @close="closeDialog2" :close-on-click-modal="false" >
      <iframe :src="editingAssociationUrl" frameborder="0" style="width:100%;height:650px;background-color:#FFF;"></iframe>
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
      sidebarValue: this.sidebarStatus,
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        startttime: '',
        endttime: '',
        title: '',
        status: ''
      },
      business2: {
        pageIndex: 1,
        pageSize: 10,
        id: ''
      },
      business3: {
        pageIndex: 1,
        pageSize: 10,
        id: ''
      },
      raredrugOptions: [
        { value: 0, label: '未审核' },
        { value: 1, label: '审核成功' },
        { value: 2, label: '审核失败' },
      ],
      // 表格数据
      tableData: [],
      tableData2: [],
      tableData3: [],
      // 选择的记录
      selection: [],
      selection2: [],
      selection3: [],
      // 总数
      total: 0,
      total2: 0,
      total3: 0,
      // 添加弹出层
      dialogFormVisible: false,
      dialogFormVisibleUrl: `${process.env.WEB_HOST}/postManagement/addaudioManagement`,
      // 编辑弹出层
      modifyFormVisible: false,
      tempmodifyFormVisibleUrl: `${process.env.WEB_HOST}/postManagement/modifyaudioManagement?id=`,
      modifyFormVisibleUrl: '',
      // 数据验证
      rules: {
        id: [{ required: true, message: '请输入音频ID', trigger: 'blur' }],
        num: [{ required: true, message: '请输入音频编号', trigger: 'blur' }],
        title: [{ required: true, message: '请输入音频标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入音频内容', trigger: 'blur' }],
        pic_url: [{ required: true, message: '请输入音频图片链接地址', trigger: 'blur' }],
        type: [{ required: true, message: '请输入音频类型', trigger: 'blur' }],
        u_id: [{ required: true, message: '请输入发帖人Id', trigger: 'blur' }],
        focus_title: [{ required: true, message: '请输入轮播标题', trigger: 'blur' }],
        is_loop: [{ required: true, message: '请输入是否轮播图', trigger: 'blur' }],
        is_focus: [{ required: true, message: '请输入是否轮播图', trigger: 'blur' }],
        recommend_picture: [{ required: true, message: '请输入名医推荐图', trigger: 'blur' }],
        loop_picture: [{ required: true, message: '请输入焦点图', trigger: 'blur' }],
        is_disable: [{ required: true, message: '请输入是是否禁用', trigger: 'blur' }],
        sequence: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        video_url: [{ required: true, message: '请输入音频链接地址', trigger: 'blur' }],
        v_id: [{ required: true, message: '请输入所属音频目录ID', trigger: 'blur' }],
        time_length: [{ required: true, message: '请输入音频时长', trigger: 'blur' }],
      },
      // 名医推荐图
      famousDoctor: false,
      famousDoctorData: {
        id: '',
        focus_title: '',
        recommend_picture: '',
        is_loop: '',
      },
      // 上传焦点图
      setFocus: false,
      setFocusData: {
        id: '',
        focus_title: '',
        loop_picture: '',
        is_focus: '1',
        sequence: '0'
      },
      // 关联目录
      relation: false,
      activeName2: 'first',
      // 新增关联音频
      newAssociation: false,
      newAssociationId: '',
      tempnewAssociationUrl: `${process.env.WEB_HOST}/postManagement/createvideoDetail?id=`,
      newAssociationUrl: '',
      // 编辑关联音频
      editingAssociation: false,
      tempeditingAssociationUrl: `${process.env.WEB_HOST}/postManagement/updatevideoDetail?id=`,
      editingAssociationUrl: '',
      SetvideoDetail: {
        v_id: '',
        didlist: []
      },
      // 医生数组
      doctorArrayList: []
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
      this.$refs['table2'].resize();
      this.$refs['table3'].resize();
    }
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'num', title: '编号', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'creat_time', title: '发贴时间', width: 70, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '状态', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'is_focus', title: '焦点图', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'is_hot', title: '热门', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'is_recommend', title: '推荐', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'type', title: '类型', width: 20, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 800, height: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-audioManagement', isResize: true }
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
              return `<span style="color:green;">审核成功</span>`;
            } else if (value === 2) {
              return `<span style="color:red;">审核失败</span>`;
            }
          };
        }
        if (item.field === 'is_focus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:red;">否</span>`;
            } else if (value === 1) {
              return `<span style="color:green;">是</span>`;
            }
          };
        }
        if (item.field === 'is_hot') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:red;">否</span>`;
            } else if (value === 1) {
              return `<span style="color:green;">是</span>`;
            }
          };
        }
        if (item.field === 'is_recommend') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:red;">不推荐</span>`;
            } else if (value === 1) {
              return `<span style="color:green;">推荐</span>`;
            }
          };
        }
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `音频`;
            } else if (value === 1) {
              return `视频`;
            }
          };
        }
      }
      return columns;
    },
    columns2() {
      let _self = this;
      let columns2 = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business2.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'id', title: 'ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'num', title: '编号', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'creat_time', title: '发贴时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'type', title: '类型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-associatedAudio', isResize: true }
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
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `音频`;
            } else if (value === 1) {
              return `视频`;
            }
          };
        }
      }
      return columns2;
    },
    columns3() {
      let _self = this;
      let columns3 = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business3.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'id', title: 'ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'num', title: '编号', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'creat_time', title: '发贴时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'type', title: '类型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-unassociatedAudio', isResize: true }
      ];
      for (let i = 0; i < columns3.length; i++) {
        let item = columns3[i];
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
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `音频`;
            } else if (value === 1) {
              return `视频`;
            }
          };
        }
      }
      return columns3;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  components: {
    'uploadSingleImg': uploadSingleImg,
  },
  methods: {
    // 数字正则
    isvalidPhone(str) {
      const reg = /^[0-9]*$/;
      return reg.test(str);
    },
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入排序值'));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的数字排序值'));
      } else {
        callback();
      }
    },
    // 表格tab切换
    handleClick(tab) {
      this.activeName = tab.name;
      this.$refs['table2'].resize();
      this.$refs['table3'].resize();
    },
    // 中国标准时间转换
    timeToTimestamp(timestamp) {
      let d = new Date(timestamp);
      let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return youWant;
    },
    // 名医推荐图上传图片
    famousDoctoruploadImg(data) {
      this.famousDoctorData.recommend_picture = data.url;
    },
    // 名医推荐图删除图片
    famousDoctorremoveImg() {
      this.famousDoctorData.recommend_picture = '';
    },
    // 焦点图上传图片
    setFocusuploadImg(data) {
      this.setFocusData.loop_picture = data.url;
    },
    // 焦点图删除图片
    setFocusremoveImg() {
      this.setFocusData.loop_picture = '';
    },
    // 请求医生列表
    getdocuserlist() {
      ajax.get('/api/hospitalManage/getdocuserlist?pageindex=1&pagesize=999').then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.doctorArrayList = data.data.data;
        }
      });
    },
    // 获取音频管理
    getTableData() {
      // if (this.business.startttime) {
      //   this.business.startttime = this.timeToTimestamp(this.business.startttime);
      // }
      // if (this.business.endttime) {
      //   this.business.endttime = this.timeToTimestamp(this.business.endttime);
      // }
      ajax.get('/api/PostManage/GetvideoList?pageIndex=' + this.business.pageIndex + '&pageSize=' + this.business.pageSize + '&title=' + this.business.title + '&startttime=' + this.business.startttime + '&endttime=' + this.business.endttime + '&status=' + this.business.status).then(data => {
        console.log(data);
        if (data.status === 200 && data.data.code === 0) {
          this.total = data.data.recordscount;
          this.tableData = data.data.data;
        }
      });
    },
    // 添加操作
    add() {
      this.dialogFormVisible = true;
    },
    adddialogFormVisible() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    // 编辑操作
    modifyaudioManagement() {
      this.modifyFormVisible = false;
      this.getTableData();
    },
    closeDialog() {
      this.modifyFormVisibleUrl = '';
      this.getTableData();
    },
    // 名师推荐图操作
    queryFamousDoctor() {
      this.$refs['ruleFormfamousDoctor'].validate((valid) => {
        if (valid) {
          ajax.post('/api/postmanage/SetDocPicvideo', this.famousDoctorData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.famousDoctor = false;
              this.getTableData();
            }
          });
        }
      });
    },
    // 上传焦点图
    querysetFocus() {
      this.$refs['ruleFormsetFocus'].validate((valid) => {
        if (valid) {
          ajax.post('/api/postmanage/Setfocusvideo', this.setFocusData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.setFocus = false;
              this.getTableData();
            }
          });
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.startttime = '';
      this.business.endttime = '';
      this.business.title = '';
      this.business.status = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 删除列表数据
    removeTableData(params) {
      ajax.get('/api/postmanage/DelvideoById/?id=' + params.rowData.id).then(data => {
        // console.log(data);
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
      // 关联目录操作
      else if (params.type === 'catalog') { // do delete operation
        this.associationDirectory(params);
        this.unrelatedCatalogues(params);
        this.newAssociationId = params.rowData.id;
        this.SetvideoDetail.v_id = params.rowData.id;
        this.relation = true;
      }
      // 编辑操作
      else if (params.type === 'modify') { // do delete operation
        this.modifyFormVisibleUrl = this.tempmodifyFormVisibleUrl + params.rowData.id;
        this.modifyFormVisible = true;
      }
      // 审核成功操作
      else if (params.type === 'setExamine') { // do delete operation
        this.$confirm('此操作将审核成功, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/Approvevideo?id=' + params.rowData.id + '&status=' + 1).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
        this.$confirm('此操作将审核失败, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/Approvevideo?id=' + params.rowData.id + '&status=' + 2).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
      // 设置热门
      else if (params.type === 'setHot') { // do delete operation
        this.$confirm('此操作将设置热门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/Sethotspotvideo?id=' + params.rowData.id + '&hotspot=' + 1).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
      // 取消热门
      else if (params.type === 'cancelHot') { // do delete operation
        this.$confirm('此操作将取消热门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/Sethotspotvideo?id=' + params.rowData.id + '&hotspot=' + 0).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
      // 设置推荐
      else if (params.type === 'setRecommend') { // do delete operation
        this.$confirm('此操作将设置推荐, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/Setrecommendvideo?id=' + params.rowData.id + '&recommend=' + 1).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
      // 取消推荐
      else if (params.type === 'cancelRecommend') { // do delete operation
        this.$confirm('此操作将取消推荐, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/Setrecommendvideo?id=' + params.rowData.id + '&recommend=' + 0).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
        this.setFocusData.id = params.rowData.id;
        this.setFocusData.focus_title = params.rowData.focus_title;
        this.setFocusData.loop_picture = params.rowData.loop_picture;
        // this.setFocusData.sequence = params.rowData.sequence;
        this.setFocus = true;
      }
      // 取消焦点图
      else if (params.type === 'cancelFocus') { // do delete operation
        this.$confirm('确定要取消焦点图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/CannelFocusVideo?id=' + params.rowData.id).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
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
      // 名医推荐图操作
      else if (params.type === 'famousDoctor') { // do delete operation
        this.famousDoctorData.id = params.rowData.id;
        this.famousDoctorData.focus_title = params.rowData.focus_title;
        this.famousDoctorData.recommend_picture = params.rowData.recommend_picture;
        this.famousDoctorData.is_loop = params.rowData.is_loop;
        this.famousDoctor = true;
      }
    },
    // 获取关联音频管理
    getTableData2() {
      ajax.get('/api/PostManage/GetvideodetailList?pageIndex=' + this.business2.pageIndex + '&pageSize=' + this.business2.pageSize + '&id=' + this.business2.id + '&idnum=').then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.total2 = data.data.recordscount;
          this.tableData2 = data.data.data;
        }
      });
    },
    // 获取未关联音频管理
    getTableData3() {
      ajax.get('/api/PostManage/GetvideodetailList?pageIndex=' + this.business3.pageIndex + '&pageSize=' + this.business3.pageSize + '&id=' + this.business3.id + '&idnum=1').then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.total3 = data.data.recordscount;
          this.tableData3 = data.data.data;
        }
      });
    },
    // 关联目录
    associationDirectory(params) {
      this.business2.id = params.rowData.id;
      this.getTableData2();
    },
    // 未关联目录
    unrelatedCatalogues(params) {
      this.business3.id = params.rowData.id;
      this.getTableData3();
    },
    // 新增关联音频
    addNewAssociation() {
      this.newAssociationUrl = this.tempnewAssociationUrl + this.newAssociationId;
      this.newAssociation = true;
    },
    createvideoDetail() {
      this.newAssociation = false;
      this.getTableData2();
      this.getTableData3();
    },
    // 编辑关联音频
    updatevideoDetail() {
      this.editingAssociation = false;
      this.getTableData2();
      this.getTableData3();
    },
    closeDialog2() {
      this.editingAssociationUrl = '';
      this.newAssociationUrl = '';
      this.getTableData2();
      this.getTableData3();
    },
    // 关联操作
    createAssociations() {
      for (let item of this.selection3) {
        this.SetvideoDetail.didlist.push({ d_id: item.id });
      }
      if (this.selection3.length !== 0) {
        ajax.post('/api/postmanage/SetvideoDetail', this.SetvideoDetail).then(data => {
        // console.log(data);
          this.SetvideoDetail.didlist = [];
          if (data.status === 200 && data.data.code === 0) {
            this.$message({
              type: 'success',
              message: data.data.message
            });
            this.getTableData();
            this.getTableData2();
            this.getTableData3();
          }
        });
      } else {
        this.$message({
          type: 'info',
          message: '请选择需要关联的数据'
        });
      }
    },
    // 已关联
    customCompFunc2(params) {
      // 编辑
      if (params.type === 'modify') { // do delete operation
        this.editingAssociationUrl = this.tempeditingAssociationUrl + params.rowData.id;
        this.editingAssociation = true;
      }// 解除
      else if (params.type === 'relieveRelation') { // do delete operation
        this.$confirm('此操作将解除关联音频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/DelvideoDetailRelationById/?v_id=' + params.rowData.v_id + '&d_id=' + params.rowData.id).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
                message: data.data.message
              });
              this.getTableData();
              this.getTableData2();
              this.getTableData3();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 未关联
    customCompFunc3(params) {
      // 编辑
      if (params.type === 'modify') { // do delete operation
        this.editingAssociationUrl = this.tempeditingAssociationUrl + params.rowData.id;
        this.editingAssociation = true;
      }
      // 删除
      else if (params.type === 'deleteRow') { // do edit operation
        this.$confirm('此操作将删除关联音频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.get('/api/postmanage/DelvideoDetailById/?id=' + params.rowData.id).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'success',
                message: data.data.message
              });
              this.getTableData3();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 全选反选1
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 分页1
    pageChange(pageIndex) {
      this.business.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.business.pageSize = pageSize;
      this.getTableData();
    },
    // 关联目录
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
    // 全选反选3
    selectALL3(selection) {
      this.selection3 = selection;
    },
    selectChange3(selection, rowData) {
      this.selection3 = selection;
    },
    selectGroupChange3(selection) {
      this.selection3 = selection;
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
    // 分页3
    pageChange3(pageIndex) {
      this.business3.pageIndex = pageIndex;
      this.getTableData3();
    },
    pageSizeChange3(pageSize) {
      this.business3.pageSize = pageSize;
      this.getTableData3();
    }
  },
  created() {
    this.getTableData();
    this.getdocuserlist();
    window.adddialogFormVisible = this.adddialogFormVisible;
    window.modifyaudioManagement = this.modifyaudioManagement;
    window.createvideoDetail = this.createvideoDetail;
    window.updatevideoDetail = this.updatevideoDetail;
  }
};
</script>

<style lang="less" scoped>
#audioManagement{
  .display-box{
    display: flex;
    justify-content: space-between;
  }
  .table-wrapper {
    padding: 0px;
    display: flex;
    .table-operation-btns{
      .el-button {
        padding: 0px!important;
      }
      .el-button+.el-button {
        margin-left: 0px;
      }
    }
  }
}
</style>