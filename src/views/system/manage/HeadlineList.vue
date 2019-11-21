<template>
  <div class="category">
    <div class="search-wrapper">
      <el-form :inline="true" :model="search" size="small" >
        <el-form-item label="版本号：">
          <el-input v-model.trim="search.Version" placeholder="请输入版本号（例：v1.0）" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="getTableData" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addHeadline">新增头条</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="search.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 新增修改头条 -->
    <el-dialog :title="categoryTitle" :visible.sync="HeadlineShow" :modal-append-to-body="false" :append-to-body="true" width="33%" top="23vh" center @close="closeCategory">
      <el-form ref="categoryfrom" :model="HeadlineData" size="small" :inline="true" style="padding-left:60px" :rules="rules">
        <el-form-item label="资讯标题：" prop="newsinfo.title">
          <el-button type="default" size="small" @click="NewList = true" v-if="HeadlineData.newsinfo.title === ''" style="width:100px;">选择资讯</el-button>
          <span class="newTitle" v-if="HeadlineData.newsinfo.title">
            {{HeadlineData.newsinfo.title}}
            <i class="el-icon-error detailTitle" @click="detailTitle"></i>
          </span>
        </el-form-item>
        <el-form-item label="头条标题：" prop="sort" style="display: none">
          <el-input v-model="HeadlineData.title" placeholder="请输入头条标题" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="头条主图：" prop="picturepath" class="headMainPic">
          <uploadSingleImg style="float: left;" :imgUrl="HeadlineData.picturepath" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
          <el-input  style="float:left;" type="hidden" v-model="HeadlineData.picturepath" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="分类排序：" prop="sort">
          <el-input v-model="HeadlineData.sort" placeholder="请输入分类排序" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="版本号：" prop="version" style="margin-left: 13px;">
          <el-input v-model.number="HeadlineData.version" placeholder="请输入版本号（例：v1.0）" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="头条链接：" prop="pictureurl" style="margin-left: 10px;">
          <el-input v-model.number="HeadlineData.pictureurl" placeholder="请输入头条链接" clearable class="inputWidth"></el-input>
        </el-form-item>

        <!-- <el-form-item label="资讯分类：" prop="sort">
          <el-select v-model="HeadlineData.newsinfo.categoryname" placeholder="请选择" clearable >
            <el-option :label="item.categoryname" :value="item.categoryname" v-for="item in categoryData" :key="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item style="padding-left: 50%;margin-left: -102px;">
          <el-button type="default" @click="HeadlineShow = false">取消</el-button>
          <el-button type="primary" @click="addQuery" v-if="categorySubtile === '确认新增'">确认新增</el-button>
          <el-button type="primary" @click="editQuery" v-if="categorySubtile === '确认修改'">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="选择资讯" :visible.sync="NewList" :modal-append-to-body="false" width="1200px" :append-to-body="true" center @close="closedetail">
      <iframe :src="NewListURL" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
    <el-dialog title="分类详情" :visible.sync="detailShow" :modal-append-to-body="false" width="650px" center @close="closedetail">
      <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">头条id：</el-col>
          <el-col :span="18">{{HeadlineData.id}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">头条标题：</el-col>
          <el-col :span="18">{{HeadlineData.title}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">头条图片：</el-col>
          <el-col :span="18"><img style="width:50px;height:30px;" :src="HeadlineData.picturepath" alt=""></el-col>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">分类排序：</el-col>
          <el-col :span="18">{{HeadlineData.sort}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">链接地址：</el-col>
          <el-col :span="18">{{HeadlineData.pictureurl}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" style="margin-bottom:15px">
          <el-col :span="6" style="text-align:right">版本号：</el-col>
          <el-col :span="18">{{HeadlineData.version}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-col :span="6" style="text-align:right">资讯标题：</el-col>
          <el-col :span="18" v-if="HeadlineData.newsinfo">{{HeadlineData.newsinfo.title}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-col :span="6" style="text-align:right">资讯分类：</el-col>
          <el-col :span="18" v-if="HeadlineData.newsinfo">{{HeadlineData.newsinfo.categoryname}}</el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import { mapGetters } from 'vuex';
// import { formatDate } from '@/utils/date';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      search: {
        AdvertinsingType: 5,
        PageIndex: 1,
        PageSize: 10,
        Version: ''
      },
      tableData: [],
      columns: this.Columns(),
      total: 0,
      selection: [],
      HeadlineShow: false,
      HeadlineData: {
        title: '',
        version: '',
        category: 5,
        picturepath: '',
        sort: '',
        pictureurl: '',
        newsinfo: {
          newsid: '',
          categoryname: '',
          title: ''
        }
      },
      categoryTitle: '',
      categorySubtile: '',
      detailShow: false,
      // detailData: {},
      rules: {
        title: [
          { required: true, message: '请输入头条名称', trigger: 'blur' },
        ],
        picturepath: [
          { required: true, message: '请选择头条图片', trigger: 'change' }
        ],
        sort: [
          { required: true, validator: this.validnumber, trigger: 'blur' },
        ],
        pictureurl: [
          { required: false, message: '请输入头条链接地址', trigger: 'blur' },
        ],
        'newsinfo.title': [
          { required: true, message: '请选择新闻资讯', trigger: 'blur' },
        ],
        version: [
          { required: true, message: '请输入版本号（例：v1.0）', trigger: 'blur' },
        ],
      },
      categoryData: [],
      NewList: false,
      NewListURL: `${process.env.WEB_HOST}/manage/outNewList`
    };
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    numberPoint(str) {
      const reg = /^[1-9]\d*$/;
      return reg.test(str);
    },
    validnumber(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入排序'));
      } else if (!this.numberPoint(value)) {
        callback(new Error('请输入正确的排序(只能为正整数)'));
      }
      else {
        callback();
      }
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // 上传头条主图
    uploadMianImg(data) {
      this.HeadlineData.picturepath = data.url;
    },
    // 删除上传头条主图
    removeMainImg() {
      this.HeadlineData.picturepath = '';
    },
    // 清除
    clean() {
      // this.query();
      this.search.Version = '';
      this.getTableData();
    },
    Columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.search.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '头条标题', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'picturepath', title: '头条主图', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '展示排序', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'pictureurl', title: '链接地址', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'version', title: '版本号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'adverIndex', isResize: true }
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
        if (item.field === 'picturepath') {
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
    // 新增
    addHeadline() {
      this.HeadlineShow = true;
      this.categoryTitle = '新增分类';
      this.categorySubtile = '确认新增';
    },
    addQuery() {
      let _self = this;
      _self.$refs['categoryfrom'].validate((valid) => {
        if (valid) {
          ajax.post('/api/admin/saveAdvertisement', _self.HeadlineData).then(res => {
            console.log(res);
            this.HeadlineShow = false;
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除资讯标题
    detailTitle() {
      this.HeadlineData.newsinfo.title = '';
      this.HeadlineData.picturepath = '';
    },
    // 关闭弹窗
    closeCategory() {
      this.HeadlineData = {
        title: '',
        version: '',
        category: 5,
        picturepath: '',
        sort: '',
        pictureurl: '',
        newsinfo: {
          newsid: '',
          categoryname: '',
          title: ''
        }
      };
      this.$refs['categoryfrom'].clearValidate();
    },
    closedetail() {
      // this.HeadlineData = {};
    },
    // 修改
    editQuery() {
      let _self = this;
      _self.$refs['categoryfrom'].validate((valid) => {
        if (valid) {
          ajax.post('/api/admin/saveAdvertisement', _self.HeadlineData).then(res => {
            console.log(res);
            this.HeadlineShow = false;
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              this.getTableData();
            }
          });
        } else {
          return false;
        }
      });

    },
    // 删除头条
    delete(id) {
      let _self = this;
      ajax.post('/api/admin/deleteAdvertisement', id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          this.getTableData();
        }
      });
    },
    // 批量删除
    batchDelete() {
      let ids = this.selection.map(res => {
        return res.id;
      });
      this.delete(ids);
    },
    // 刷新
    query() {
      this.search = {
        PageIndex: 1,
        PageSize: 10,
        CategoryName: '',
        AdvertinsingType: 5,
        Version: ''
      };
      this.getTableData();
    },
    // 获取健康头条列表
    getTableData() {
      let _self = this;
      ajax.post('/api/admin/getBannerList', _self.search).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    // 获取头条详情
    getDetail(id) {
      let _self = this;
      ajax.get('/api/admin/GetHomeBannerDetail/' + id).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.HeadlineData = res.data.data;
          // this.total = res.data.recordscount;
          _self.HeadlineData = {
            title: res.data.data.title,
            version: res.data.data.version,
            category: res.data.data.category,
            picturepath: res.data.data.picturepath,
            sort: res.data.data.sort,
            pictureurl: res.data.data.pictureurl,
            id: res.data.data.id,
            newsinfo: {
              newsid: res.data.data.newsinfo.newsid,
              categoryname: res.data.data.newsinfo.categoryname,
              title: res.data.data.newsinfo.title
            }
          };
        }
      });
    },
    /*
      // 获取新闻分类列表
      // getCategoryData() {
      //   let _self = this;
      //   let param = {
      //     PageIndex: '1',
      //     PageSize: '10',
      //     CategoryName: ''
      //   };
      //   ajax.post('/api/news/GetNewsCategoryListByPage', param).then(res => {
      //     console.log(res);
      //     if (res.status === 200 && res.data.code === 0) {
      //       _self.categoryData = res.data.data;
      //     }
      //   });
      // },
    */
    customCompFunc(params) {
      if (params.type === 'deleta') { // do delete operation
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete([params.rowData.id]);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation 修改
      //   let data = {};
      //   /* eslint-disable */
      // for (let key in params.rowData) {
      //   data[key] = params.rowData[key];
      // }
        // this.HeadlineData = data;
        this.getDetail(params.rowData.id);
        this.HeadlineShow = true;
        this.categoryTitle = '修改分类';
        this.categorySubtile = '确认修改';
      } else if (params.type === 'detail') { // 查看详情
        this.detailShow = true;
        this.getDetail(params.rowData.id);
        // console.log(this.HeadlineData);
        // this.detailData = params.rowData;
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
      this.search.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.search.PageIndex = 1;
      this.search.pageSize = pageSize;
      this.getTableData();
    },
    selectNewList(data) {
      // console.log(data);
      this.NewList = false;
      this.HeadlineData.newsinfo = {
        newsid: data.id,
        categoryname: data.categoryname,
        title: data.title
      };
      this.HeadlineData.title = data.title;
      this.HeadlineData.picturepath = data.mainimage;
    }
  },
  created() {
    this.getTableData();
    window.previewImg = this.previewImg;
    window.selectNewList = this.selectNewList;
  }
};
</script>

<style lang="less" scoped>
  .newTitle{
    display: block;
    overflow: hidden;
    text-overflow:ellipsis;//文本溢出显示省略号
    white-space:nowrap;//文本不会换行（单行文本溢出）
    width:280px;
    position: relative;
    .detailTitle{
      position: absolute;
      top: 0px;
      right: 0px;
      cursor: pointer;
    }
  }
  .inputWidth{
    width: 130%;
  }
  .headMainPic{
    display: block;
  }
</style>
