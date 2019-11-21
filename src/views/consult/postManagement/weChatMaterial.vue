<template>
  <div id="business">
    <div class="search-wrapper">
      <el-form :inline="true" :model="business" size="small">
        <el-form-item label="标题">
          <el-input class="el-width1" v-model="business.titel"></el-input>
        </el-form-item>
        <el-form-item label="素材类型">
          <el-select v-model="business.type" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="business.state" size='small' placeholder="请选择">
              <el-option
                v-for="item in raredrugOptions2"
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
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">添加</el-button>
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
    <!-- 新增素材信息 -->
    <el-dialog title="新增素材信息" :visible.sync="dialogFormVisible" :modal-append-to-body="true" :append-to-body='true' width="40%" center>
      <el-form :model="addData" ref="ruleForm" :rules="rules">
        <!-- <el-form-item label="微信素材ID" label-width="100px" prop="id">
          <el-input v-model="addData.id"></el-input>
        </el-form-item> -->
        <el-form-item label="标题" label-width="100px" prop="titel">
          <el-input v-model="addData.titel"></el-input>
        </el-form-item>
        <el-form-item label="图片url" label-width="100px" prop="pic_url">
          <uploadSingleImg :imgUrl="addData.pic_url" :fileName="'Image'" @uploadSuccess="addDatauploadImg" @removeImg="addDataremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="addData.pic_url"></el-input>
        </el-form-item>
        <el-form-item label="跳转URL链接" label-width="100px" prop="link_url">
          <el-input v-model="addData.link_url"></el-input>
        </el-form-item>
        <el-form-item label="所属类型"  label-width="100px" prop="type">
          <el-select v-model="addData.type">
            <el-option label="康美药膳" value="1"></el-option>
            <el-option label="居家知识" value="2"></el-option>
            <el-option label="药房资讯" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"  label-width="100px" prop="state">
          <el-select v-model="addData.state">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" label-width="100px" prop="sort">
          <el-input v-model="addData.sort" maxlength="2" placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="创建人" label-width="100px" prop="createman">
          <el-input v-model="addData.createman"></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间" label-width="100px">
          <el-date-picker type="date" placeholder="选择日期" v-model="addData.create_time"></el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改素材信息 -->
    <el-dialog title="修改素材信息" :visible.sync="modifyFormVisible" :modal-append-to-body="true" :append-to-body='true' width="40%" center>
      <el-form :model="modifyData" ref="modifyForm" :rules="rules">
        <!-- <el-form-item label="微信素材ID" label-width="100px" prop="id">
          <el-input v-model="modifyData.id" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="标题" label-width="100px" prop="titel">
          <el-input v-model="modifyData.titel"></el-input>
        </el-form-item>
        <el-form-item label="图片url" label-width="100px" prop="pic_url">
          <uploadSingleImg :imgUrl="modifyData.pic_url" :fileName="'Image'" @uploadSuccess="modifyDatauploadImg" @removeImg="modifyDataremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="modifyData.pic_url"></el-input>
        </el-form-item>
        <el-form-item label="跳转URL链接" label-width="100px" prop="link_url">
          <el-input v-model="modifyData.link_url"></el-input>
        </el-form-item>
        <el-form-item label="所属类型"  label-width="100px" prop="type">
          <el-select v-model="modifyData.type">
            <el-option label="康美药膳" value="1"></el-option>
            <el-option label="居家知识" value="2"></el-option>
            <el-option label="药房资讯" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"  label-width="100px" prop="state">
          <el-select v-model="modifyData.state">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" label-width="100px" prop="sort">
          <el-input v-model="modifyData.sort" maxlength="2" placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="创建人" label-width="100px" prop="createman">
          <el-input v-model="modifyData.createman"></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间" label-width="100px">
          <el-date-picker type="date" placeholder="选择日期" v-model="modifyData.create_time"></el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryModify">确 定</el-button>
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
      sidebarValue: this.sidebarStatus,
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        titel: '',
        type: '',
        state: ''
      },
      raredrugOptions: [
        { value: 1, label: '康美药膳' },
        { value: 2, label: '居家知识' },
        { value: 3, label: '药房资讯' },
      ],
      raredrugOptions2: [
        { value: 1, label: '有效' },
        { value: 2, label: '无效' }
      ],
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 新增弹出层
      dialogFormVisible: false,
      addData: {
        // id: '',
        titel: '',
        pic_url: '',
        link_url: '',
        type: '',
        sort: '',
        state: '',
        createman: '',
        // create_time: '',
      },
      // 修改弹出层
      modifyFormVisible: false,
      details: '',
      modifyData: {
        id: '',
        titel: '',
        pic_url: '',
        link_url: '',
        type: '',
        sort: '',
        state: '',
        createman: '',
        // create_time: '',
      },
      // 数据验证
      rules: {
        id: [{ required: true, message: '请输入微信素材ID', trigger: 'blur' }],
        titel: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        pic_url: [{ required: true, message: '请输入图片url', trigger: 'blur' }],
        link_url: [{ required: true, message: '请输入跳转URL链接', trigger: 'blur' }],
        type: [{ required: true, message: '请输入所属类别', trigger: 'blur' }],
        sort: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        state: [{ required: true, message: '请输入状态', trigger: 'blur' }],
        createman: [{ required: true, message: '请输入创建人', trigger: 'blur' }],
        create_time: [{ required: true, message: '请输入创建时间', trigger: 'blur' }]
      },
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
        { field: 'type', title: '所属类别', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'titel', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'pic_url', title: '图片url', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'link_url', title: '跳转URL链接', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createman', title: '创建人', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'create_time', title: '创建时间', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '排序', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: '', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-weChatMaterial', isResize: true }
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
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `康美药膳`;
            } else if (value === '2') {
              return `居家知识`;
            } else if (value === '3') {
              return `药房资讯`;
            }
          };
        }
        if (item.field === 'state') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return `<span style="color:green;">有效</span>`;
            } else if (value === '2') {
              return `<span style="color:red;">无效</span>`;
            }
          };
        }
        if (item.field === 'pic_url') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
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
    // 中国标准时间转换
    timeToTimestamp(timestamp) {
      let d = new Date(timestamp);
      let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return youWant;
    },
    // 添加关键词 上传图片
    addDatauploadImg(data) {
      this.addData.pic_url = data.url;
    },
    // 添加关键词 删除图片
    addDataremoveImg() {
      this.addData.pic_url = '';
    },
    // 焦点图 上传图片
    modifyDatauploadImg(data) {
      this.modifyData.pic_url = data.url;
    },
    // 焦点图 删除图片
    modifyDataremoveImg() {
      this.modifyData.pic_url = '';
    },
    // 获取微信素材
    getTableData() {
      ajax.get('/api/PostManage/GetMaterialList?pageIndex=' + this.business.pageIndex + '&pageSize=' + this.business.pageSize + '&titel=' + this.business.titel + '&type=' + this.business.type + '&state=' + this.business.state).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.total = data.data.recordscount;
          this.tableData = data.data.data;
          console.log(this.tableData);
        }
      });
    },
    // 清空
    empty() {
      this.business.pageIndex = 1;
      this.business.pageSize = 10;
      this.business.titel = '';
      this.business.type = '';
      this.business.state = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.getTableData();
    },
    // 新增操作
    add() {
      this.dialogFormVisible = true;
    },
    queryAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.addData.create_time) {
            this.addData.create_time = this.timeToTimestamp(this.addData.create_time);
          }
          ajax.post('/api/PostManage/CreateMaterial', this.addData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              console.log(data);
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.$refs['ruleForm'].resetFields();
              // this.addData.id = '';
              // this.addData.titel = '';
              // this.addData.pic_url = '';
              // this.addData.link_url = '';
              // this.addData.type = '';
              // this.addData.sort = '';
              // this.addData.state = '';
              // this.addData.createman = '';
              // this.addData.create_time = '';
              this.getTableData();
            }
            this.dialogFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 修改操作
    modify(params) {
      this.modifyData.id = params.rowData.id;
      this.modifyData.titel = params.rowData.titel;
      this.modifyData.pic_url = params.rowData.pic_url;
      this.modifyData.link_url = params.rowData.link_url;
      this.modifyData.type = params.rowData.type;
      this.modifyData.sort = params.rowData.sort;
      this.modifyData.state = params.rowData.state;
      this.modifyData.createman = params.rowData.createman;
      // this.modifyData.create_time = params.rowData.create_time;
      this.modifyFormVisible = true;
    },
    queryModify() {
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          if (this.modifyData.create_time) {
            this.modifyData.create_time = this.timeToTimestamp(this.modifyData.create_time);
          }
          ajax.post('/api/postmanage/UpdateMaterial', this.modifyData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.modifyFormVisible = false;
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除列表数据
    removeTableData(id) {
      ajax.get('/api/PostManage/DelMaterialById/?id=' + id).then(data => {
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
          this.removeTableData(params.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      // 修改操作
      else if (params.type === 'modify') { // do delete operation
        this.modify(params);
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
      this.$alert(`<img src="${url}" alt='' width="300px" height="300px"/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
  },
  created() {
    this.getTableData();
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
</style>