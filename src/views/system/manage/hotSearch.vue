<template>
  <div id="hotSearch">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" icon="el-icon-plus" size="small" @click="add">添加</el-button>
        <el-button type="default" icon="el-icon-delete" size="small" @click="allDelete">删除</el-button>
        <el-button type="default" icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
      </el-button-group>
    </div>
    <!-- 添加热门关键词 -->
    <el-dialog title="添加热门关键词" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="40%" center>
      <el-form :model="addData" ref="ruleForm" :rules="rules">
        <el-form-item label="分类"  label-width="100px" prop="KeyType">
          <el-select v-model="addData.KeyType" placeholder="请选分类">
            <el-option label="首页" value="1"></el-option>
            <el-option label="搜索" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" label-width="100px" prop="Keyword">
          <el-input v-model="addData.Keyword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择图片：" label-width="100px" prop="ImageUrl">
          <uploadSingleImg :imgUrl="addData.ImageUrl" :fileName="'Image'" @uploadSuccess="addDatauploadImg" @removeImg="addDataremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="addData.ImageUrl"></el-input>
        </el-form-item>
        <el-form-item label="链接地址：" label-width="100px" prop="LinkUrl">
          <el-input v-model="addData.LinkUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="100px" prop="Sort">
          <el-input v-model.number="addData.Sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="100px">
          <el-input v-model="addData.Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog title="修改热门关键词" :visible.sync="modifyFormVisible" :modal-append-to-body="false" width="40%" center>
      <el-form :model="modifyData" ref="modifyForm" :rules="rules">
        <el-form-item label="分类"  label-width="100px" prop="KeyType">
          <el-select v-model="modifyData.KeyType">
            <el-option label="首页" value="1"></el-option>
            <el-option label="搜索" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" label-width="100px" prop="Keyword">
          <el-input v-model="modifyData.Keyword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择图片：" label-width="100px"  prop="ImageUrl">
          <uploadSingleImg :imgUrl="modifyData.ImageUrl" :fileName="'Image'" @uploadSuccess="modifyDatauploadImg" @removeImg="modifyDataremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="modifyData.ImageUrl"></el-input>
        </el-form-item>
        <el-form-item label="链接地址：" label-width="100px"  prop="LinkUrl">
          <el-input v-model="modifyData.LinkUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="100px" prop="Sort">
          <el-input v-model.number="modifyData.Sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="100px">
          <el-input v-model="modifyData.Remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryModify">确 定</el-button>
      </div>
    </el-dialog>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-index="hotInfo.pageIndex" :page-size="hotInfo.pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
import uploadSingleImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      // 请求参数
      hotInfo: {
        pageIndex: 1,
        pageSize: 10
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
        KeyType: '',
        Keyword: '',
        ImageUrl: '',
        LinkUrl: '',
        Sort: 1,
        Remark: '',
      },
      modifyFormVisible: false,
      modifyData: {
        Id: '',
        KeyType: '',
        Keyword: '',
        ImageUrl: '',
        LinkUrl: '',
        Sort: null,
        Remark: '',
      },
      sidebarValue: this.sidebarStatus,
      // 数据验证
      rules: {
        KeyType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        // Keyword: [{ required: true, message: '请输入关键词', trigger: 'blur' }],
        // LinkUrl: [{ required: false, message: '请输入图片链接地址', trigger: 'blur' }],
        Keyword: [{ required: true, validator: this.validKeyword, trigger: 'blur' }],
        LinkUrl: [{ required: true, validator: this.validLinkUrl, trigger: 'blur' }],
        ImageUrl: [{ required: false, message: '请选择图片地址', trigger: 'blur' }],
        Sort: [{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]
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
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.hotInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'KeyType', title: '类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'Keyword', title: '关键词', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'Image', title: '图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'ImageUrl', title: '图片地址', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'LinkUrl', title: '链接地址', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'Remark', title: '备注', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'Sort', title: '排序', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-hotSearch', isResize: true }
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
        if (item.field === 'Image') {
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
    // 链接地址验证
    isvalidLinkUrl(str) {
      let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      return reg.test(str);
    },
    validLinkUrl(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入链接地址'));
      } else if (!this.isvalidLinkUrl(value)) {
        callback(new Error('请输入正确的链接地址'));
      } else {
        callback();
      }
    },
    // 关键词验证
    isvalidKeyword(str) {
      let nameReg = /[^a-zA-Z0-9_\u4e00-\u9fa5]/g;
      return nameReg.test(str);
    },
    validKeyword(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入关键词'));
      } else if (this.isvalidKeyword(value)) {
        callback(new Error('关键词不支持特殊符号'));
      } else {
        callback();
      }
    },
    // 添加关键词 上传图片
    addDatauploadImg(data) {
      this.addData.ImageUrl = data.url;
    },
    // 添加关键词 删除图片
    addDataremoveImg() {
      this.addData.ImageUrl = '';
    },
    // 修改关键词 上传图片
    modifyDatauploadImg(data) {
      this.modifyData.ImageUrl = data.url;
      console.log(this.modifyData.ImageUrl);
    },
    // 修改关键词 删除图片
    modifyDataremoveImg() {
      this.modifyData.ImageUrl = '';
    },
    // 删除列表数据
    removeTableData(Ids) {
      // console.log(Ids);
      ajax.post('/api/admin/deleteHotKey', Ids).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.$message(res.data.message);
        }
        this.getTableData();
      });
    },
    // 批量删除
    allDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该意见反馈, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = [];
          for (let item of this.selection) {
            Ids.push(item.Id);
          }
          this.removeTableData(Ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$alert('请选择删除的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 添加
    add() {
      this.dialogFormVisible = true;
    },
    queryAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/admin/addHotKey', this.addData).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.addData.Keyword = '';
              this.addData.ImageUrl = '';
              this.addData.LinkUrl = '';
              this.addData.Sort = null;
              this.addData.Remark = '';
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 修改
    modify() {
      this.modifyFormVisible = true;
    },
    queryModify() {
      let _self = this;
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          this.modifyData.KeyType = this.toNumber(this.modifyData.KeyType);
          ajax.post('/api/admin/updateHotKey', _self.modifyData).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.getTableData();
              this.modifyFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 更新
    refresh() {
      this.hotInfo.pageIndex = 1;
      this.hotInfo.pageSize = 10;
      this.getTableData();
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 删除操作
      if (params.type === 'delete') { // do edit operation
        this.$confirm('此操作将永久删除该搜索, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = [params.rowData.Id];
          console.log(Ids);
          this.removeTableData(Ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      // 修改操作
      else if (params.type === 'modify') { // do delete operation
        this.modifyData.Id = params.rowData.Id;
        this.modifyData.KeyType = params.rowData.KeyType;
        this.modifyData.Keyword = params.rowData.Keyword;
        this.modifyData.ImageUrl = params.rowData.ImageUrl;
        this.modifyData.LinkUrl = params.rowData.LinkUrl;
        this.modifyData.Sort = params.rowData.Sort;
        this.modifyData.Remark = params.rowData.Remark;
        this.modify();
      }
    },
    // 转换文字
    toString(val) {
      if (val === 1) {
        return '首页';
      } else {
        return '搜索';
      }
    },
    // 转换数字
    toNumber(val) {
      if (val === '首页') {
        return 1;
      } else {
        return 2;
      }
    },
    // 获取热门关键词列表
    getTableData() {
      let _self = this;
      ajax.post('/api/admin/getHotKeyList', _self.hotInfo).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          let newData = res.data.data.map(item => {
            return {
              Createtime: item.createtime,
              Id: item.id,
              KeyType: _self.toString(item.keytype),
              Keyword: item.keyword,
              Image: item.imageurl,
              ImageUrl: item.imageurl,
              LinkUrl: item.linkurl,
              Remark: item.remark,
              Sort: item.sort
            };
          });
          this.tableData = newData;
        }
      });
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
      this.hotInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.hotInfo.pageSize = pageSize;
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
    // 请求反馈列表数据
    this.getTableData();
    // 查看大图
    window.previewImg = this.previewImg;
  }
};
</script>

<style>
.el-button.el-button--text span{
  color: #333;
}
table{ border-collapse:collapse;}
</style>
