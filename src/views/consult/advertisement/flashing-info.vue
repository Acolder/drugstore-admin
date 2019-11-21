<template>
  <div class="flashing">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <!-- <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button> -->
        <el-button type="default" size="small" icon="el-icon-refresh" @click="getTableData">刷新</el-button>
      </el-button-group>
    </div>
    <!-- 添加闪页弹窗 -->
    <!-- <el-dialog title="添加广告闪页" center :visible.sync="addVisible" :append-to-body="true" @close="closeAdd" width="40%">
      <el-form :model="addData" ref="addValidateForm" :rules="rules" label-width="100px">
        <el-form-item label="广告主图：" prop="PicUrl">
          <uploadSingleImg :imgUrl="addData.PicUrl" :fileName="'addImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="addData.PicUrl"></el-input>
        </el-form-item>
        <el-form-item label="广告状态：" prop="Status">
          <el-select v-model="addData.Status" clearable placeholder="请选择广告状态" :style="'width:85%'">
            <el-option label="正常" value="0"></el-option>
            <el-option label="屏蔽" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示排序：" prop="OrderSeq">
          <el-select v-model="addData.OrderSeq" placeholder="请选择展示排序" :style="'width:85%'">
            <el-option :label="i" :value="i" v-for="i in 10" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址：" prop="Tcontents">
          <el-input v-model.number.trim="addData.Tcontents" placeholder="请输入链接地址" clearable :style="'width:85%'"></el-input>
        </el-form-item>
        <el-form-item label="广告主题：" prop="Tid">
          <el-select v-model="addData.Tid" placeholder="请选择广告主题" :style="'width:85%'">
            <el-option :label="item.ttopic" :value="item.tid" v-for="(item, index) in tidList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" :style="'text-align:center'">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="query">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- 编辑闪页弹窗 -->
    <el-dialog :title="title" center :visible.sync="modifyVisible" :append-to-body="true" @close="closeModify" width="40%">
      <el-form :model="editData" ref="editValidateForm" :rules="rules2" label-width="100px">
        <el-form-item label="广告主图：" prop="picurl">
          <uploadSingleImg :imgUrl="editData.picurl" :fileName="'editImage'" @uploadSuccess="uploadMianImgedit" @removeImg="removeMainImgedit"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="editData.picurl"></el-input>
        </el-form-item>
        <el-form-item label="广告状态：" prop="status">
          <el-select v-model.number="editData.status" clearable placeholder="请选择广告状态" :style="'width:85%'">
            <el-option label="正常" :value=0></el-option>
            <el-option label="屏蔽" :value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示排序：" prop="orderseq">
          <el-select v-model="editData.orderseq" placeholder="请选择展示排序" :style="'width:85%'">
            <el-option :label="i" :value="i" v-for="i in 10" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址：" prop="tcontents">
          <el-input v-model.number.trim="editData.tcontents" placeholder="请输入链接地址" clearable :style="'width:85%'"></el-input>
        </el-form-item>
        <el-form-item label="广告主题：" prop="tid">
          <el-select v-model.number="editData.tid" placeholder="请选择广告主题" :style="'width:85%'">
            <el-option :label="item.ttopic" :value="item.tid" v-for="(item, index) in tidList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" :style="'text-align:center'">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="editquery">确 定</el-button>
      </div>
    </el-dialog>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import { mapGetters } from 'vuex';
import yilinAjax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      tableData: [],
      columns: this.getColumns(),
      searchInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      selection: [],
      // addVisible: false,
      // addData: {
      //   ID: '0',
      //   Tcontents: '',
      //   Status: '',
      //   OrderSeq: '1',
      //   PicUrl: '',
      //   Tid: '',
      // },
      modifyVisible: false,
      editData: {
        id: '0',
        tcontents: '',
        status: '',
        orderseq: '1',
        picurl: '',
        tid: '',
      },
      tidList: [],
      // rules: {
      //   Tcontents: [{ required: true, message: '请输入链接地址', trigger: 'blur' }, { type: 'url', message: '链接地址必须为url', trigger: 'blur' }],
      //   Status: [{ required: true, message: '请选择广告状态', trigger: 'change' }],
      //   OrderSeq: [{ required: true, message: '请选择广告展示排序', trigger: 'change' }],
      //   PicUrl: [{ required: true, message: '请选择广告主图', trigger: 'change' }],
      //   Tid: [{ required: true, message: '请选择广告主题', trigger: 'change' }]
      // },
      rules2: {
        tcontents: [{ required: true, message: '请输入链接地址', trigger: 'blur' }, { type: 'url', message: '链接地址必须为url', trigger: 'blur' }],
        status: [{ required: true, message: '请选择广告状态', trigger: 'change' }],
        orderseq: [{ required: true, message: '请选择广告展示排序', trigger: 'change' }],
        picurl: [{ required: true, message: '请选择广告主图', trigger: 'change' }],
        tid: [{ required: true, message: '请选择广告主题', trigger: 'change' }]
      },
      title: '',
      isAdd: true
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    // 上传广告主图
    // uploadMianImg(data) {
    //   this.addData.PicUrl = data.url;
    // },
    // // 删除广告主图
    // removeMainImg() {
    //   this.addData.PicUrl = '';
    // },
    // 上传编辑广告主图
    uploadMianImgedit(data) {
      this.editData.picurl = data.url;
    },
    // 删除编辑广告主图
    removeMainImgedit() {
      this.editData.picurl = '';
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'picurl', title: '图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isurl', title: '是否链接', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '广告状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderseq', title: '展示排序', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'tcontents', title: '链接地址', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 180, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-adverBanner', isResize: true }
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
        if (item.field === 'picurl') {
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
        if (item.field === 'isurl') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '内容';
            } else {
              return '链接';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green;">正常</span>';
            } else {
              return '<span style="color:red;">屏蔽</span>';
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该资讯, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete(params.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation
        this.modifyVisible = true;
        this.getEditData(params.rowData.id);
        this.title = '编辑广告闪页';
      } else if (params.type === 'start') { // 启用
        let _self = this;
        let startInfo = {
          ID: params.rowData.id,
          Status: '0'
        };
        yilinAjax.post('/api/adsmanage/updatedocbannerstatus', startInfo).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            _self.$message({
              message: res.data.message,
              type: 'success'
            });
            _self.getTableData();
          }
        });
      } else if (params.type === 'disable') { // 禁用
        let _self = this;
        let startInfo = {
          ID: params.rowData.id,
          Status: 1
        };
        yilinAjax.post('/api/adsmanage/updatedocbannerstatus', startInfo).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            _self.$message({
              message: res.data.message,
              type: 'success'
            });
            _self.getTableData();
          }
        });
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
      this.searchInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = pageSize;
      this.getTableData();
    },
    // 增加
    add() {
      this.modifyVisible = true;
      this.title = '新增广告闪页';
    },
    // query() {
    //   let _self = this;
    //   _self.$refs['addValidateForm'].validate((valid) => {
    //     if (valid) {
    //       _self.addVisible = false;
    //       yilinAjax.post('/api/adsmanage/updatedocbannerflash', _self.addData).then(res => {
    //         if (res.status === 200 && res.data.code === 0) {
    //           this.getTableData();
    //           _self.$message({
    //             message: res.data.message,
    //             type: 'success'
    //           });
    //         }
    //       });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 删除
    delete(id) {
      let _self = this;
      let ids = {
        Id: id
      };
      yilinAjax.post('/api/adsmanage/deldocbanner', ids).then(res => {
        console.log(res);
        _self.$message({
          message: res.data.message,
          type: 'success'
        });
        _self.getTableData();
      });
    },
    // 批量删除
    // batchDelete() {
    //   console.log('删除');
    // },
    getTableData() {
      yilinAjax.get('/api/adsmanage/getdocbannerflashlist', {
        params: this.searchInfo
      }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data;
        }
      });
    },
    // 关闭添加弹窗
    // closeAdd() {
    //   this.addData = {
    //     ID: '0',
    //     Tcontents: '',
    //     Status: '',
    //     OrderSeq: '',
    //     PicUrl: '',
    //     Tid: '',
    //   };
    //   this.$refs['addValidateForm'].resetFields();
    // },
    // 广告详情
    getEditData(id) {
      let _self = this;
      yilinAjax.get('/api/adsmanage/getdocbannerflashdetail', {
        params: {
          id: id
        }
      }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.editData = res.data.data;
          _self.editData.tid = Number(_self.editData.tid);
        }
      });
    },
    // 提交编辑
    editquery() {
      let _self = this;
      _self.$refs['editValidateForm'].validate((valid) => {
        if (valid) {
          _self.modifyVisible = false;
          yilinAjax.post('/api/adsmanage/updatedocbannerflash', _self.editData).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.getTableData();
              _self.editData = {
                id: '0',
                tcontents: '',
                status: '',
                orderseq: '1',
                picurl: '',
                tid: '',
              };
              _self.$refs['editValidateForm'].resetFields();
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 关闭编辑弹窗
    closeModify() {
      this.editData = {
        id: '0',
        tcontents: '',
        status: '',
        orderseq: '1',
        picurl: '',
        tid: '',
      };
      this.$refs['editValidateForm'].resetFields();
    },
    // 广告主题
    getTid() {
      let _self = this;
      yilinAjax.get('/api/adsmanage/getdoctopiclist').then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.tidList = res.data.data;
        }
      });
    }
  },
  created() {
    this.getTableData();
    window.previewImg = this.previewImg;
    this.getTid();
  }
};
</script>

<style>

</style>
