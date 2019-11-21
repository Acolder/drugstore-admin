<template>
  <div>
    <el-form ref="addData" :model="form" :rules="rules" label-width="100px" id="addNews">
      <el-row>
        <el-col :span="12">
          <el-form-item label="咨讯标题" prop="title">
            <el-input class="el-input" v-model="form.title" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布时间" prop="releaseTime">
            <div class="block">
              <el-date-picker v-model="form.releaseTime" type="datetime" placeholder="选择日期时间" clearable value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资讯分类" prop="categoryId" class="CategoryId" style="width:40%;">
            <el-select v-model="form.categoryId"  @change="categoryIdList" clearable>
              <el-option v-for="item in CategoryOptions" :key="item.categoryId" :label="item.categoryname" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort" class="Sort" style="width:40%;">
            <el-input class="el-input sortInput" v-model.number="form.sort"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="阅读量" prop="readingQuantity">
            <el-input class="el-input" v-model.number="form.readingQuantity"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="来源URL" prop="sourceUrl" class="source" style="width:82%;">
            <el-input style="width:94%;" v-model="form.sourceUrl" display="inline-block"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源名称" prop="sourceName" class="source" style="width:84.5%;">
            <el-input style="width:91%;" v-model="form.sourceName" display="inline-block"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否为原创" prop="isCopyRight">
            <el-radio-group v-model="form.isCopyRight">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否置顶" prop="isTop">
            <el-radio-group v-model="form.isTop">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :span=12 style="display:none">
          <el-form-item label="核审状态" prop="statusFlag">
            <el-select v-model="form.statusFlag" placeholder="请选择" style="width:50%;">
              <el-option label="未编辑" :value=0></el-option>
              <el-option label="待核审" :value=1></el-option>
              <el-option label="核审通过" :value=2></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="资讯样式" prop="showType">
            <el-select v-model="form.showType" placeholder="请选择" style="width:50%;" @change="changePic">
              <el-option label="无图仅标题" :value=0></el-option>
              <el-option label="一张小图" :value=1></el-option>
              <el-option label="一张大图" :value=2></el-option>
              <el-option label="三张小图" :value=3></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div v-if="mainPic">
            <el-form-item label="主图" :prop="'mainImage'" :rules="{ required: false, message: '请选择相应数量的图片', trigger: 'change'}">
              <uploadImg :imgUrl="form.mainImage" :fileName="'mainImage'" @uploadSuccess="uploadImgMain" @removeImg="removeImgMain" class="upImg1"></uploadImg>
              <el-input class="left" type="hidden" v-model="form.mainImage"></el-input>
            </el-form-item>
          </div>
          <div class="imgupload" style="width:83%" v-if='uploadImghide'>
            <el-form-item label="资讯展示图" :prop="'picUrl'" :rules="{ required: true, message: '请选择相应数量的图片', trigger: 'change'}">
              <uploadImg :imgUrl="form.picUrl" :fileName="'1'" @uploadSuccess="uploadthumbnailImg" @removeImg="removethumbnailImg" class="upImg1" :limit="picSum"></uploadImg>
              <el-input class="left" type="hidden" v-model="form.picUrl"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标签" prop="TabIds">
            <el-tag v-model="form.TabIds" :key="tag.index" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
              <span @click="tagActive" class="tagsSpan">{{tag}}</span>
            </el-tag>
            <el-button class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资讯类型" prop="newsType">
            <el-select v-model="form.newsType" placeholder="请选择资讯类型" style="width:50%;" clearable>
              <el-option label="图文" :value=1></el-option>
              <el-option label="视频" :value=2></el-option>
              <el-option label="图文+视频" :value=3></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="摘要" prop="abstract">
            <el-input type="textarea" v-model="form.abstract" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否推送" prop="sendMessage">
            <el-radio-group v-model="form.sendMessage">
              <el-radio :label=1>是</el-radio>
              <el-radio :label=0>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="资讯内容" prop="body">
            <textarea id="content" v-model="form.body" style="display:none;"></textarea>
            <ueditor :id="'content_ueditor'" ref="content_ueditor"></ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 推荐资讯 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="资讯推荐" >
            <div id="RecommendWrapper">
              <div class="Recommend">
                <el-button-group>
                  <el-button type="default" size="small" @click="addinformation" icon="el-icon-plus" style="margin-bottom: 10px;">添加资讯</el-button>
                  <el-button type="default" size="small" @click="cleanNews" icon="el-icon-delete" style="margin-left: 15px;">清空资讯列表</el-button>
                </el-button-group>
                <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="subColumns" @on-custom-comp="customCompFuncNews"
                :table-data="subTableData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
              </div>
              <el-dialog title="请选择需要推荐的资讯" :visible.sync="newsShow" :modal-append-to-body="false" width="80%" center>
                <iframe :src="NewListURL" frameborder="0" style="width:100%;height:600px;"></iframe>
              </el-dialog>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 推荐商品 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品推荐" >
            <div id="RecommendWrapper">
              <div class="Recommend">
                <el-button-group>
                  <el-button type="default" size="small" @click="addProduct" icon="el-icon-plus" style="margin-bottom: 10px;">添加商品</el-button>
                  <el-button type="default" size="small" @click="cleanpro" icon="el-icon-delete" style="margin-left: 15px;">清空商品列表</el-button>
                </el-button-group>
                <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="pruductsColumns" @on-custom-comp="customCompFuncProduct"
                :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
              </div>
              <el-dialog title="请选择需要推荐的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
                <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
              </el-dialog>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="form-button-wrapper">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
          <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 标签弹窗 -->
    <el-dialog title="标签" :visible.sync="tagsVisible" :modal-append-to-body="false" width="35%" :center="true" class="labelWrap">
      <el-row>
        <el-checkbox-group v-model="tagList" size="medium">
          <el-checkbox  v-for="(item, index) in labels" :label="item.tagName" :key="index" class="tagItem">{{item.tagName}}</el-checkbox>
        </el-checkbox-group>
      </el-row>
      <div slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改商品图片 -->
    <el-dialog title="更换商品图片" :visible.sync="replacePic" :modal-append-to-body="false" :append-to-body="true" width="40%" center>
      <el-form :model="productPicData" size="small" >
        <el-form-item label="商品图:" :prop="'proPic'" :rules="{ required: false, message: '请选择相应的图片', trigger: 'change'}">
          <uploadProImg :imgUrl="productPicData.proPic" :fileName="'productImg'" @uploadSuccess="uploadProImg" @removeImg="removeProImg" :isMark="true" :limit="1" style="width:100%"></uploadProImg>
          <el-input class="left" type="hidden" v-model="productPicData.proPic"></el-input>
        </el-form-item>
        <el-form-item class="footer">
          <el-button type="default" @click="cleanPic" icon="el-icon-delete">取 消</el-button>
          <el-button type="primary" @click="queryByNewsPic" icon="el-icon-search">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.el-input{
  width:75%;
}
.source{
  display: inline-block;
}
.appendNetImg[data-v-2dfd9857]{
  float: left;
}
.upload-wrapper{
  width:66%;
}
.form-button-wrapper {
  text-align: center;
  margin:0 0 80px -100px;
}
#addNews{
  .Sort{
    display: inline-block;
    .sortInput{
      width: 91%;
    }
  }
  .imgupload{
    display: flex;
    .upImg1{
    width: 100%;
  }
    .upImg{
      width: 68%;
      margin-left: -75px;
    }
  }
  .appendNetImg{
    display: none;
  }
}
.CategoryId{
  display: inline-block;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .tagsSpan{
    cursor: pointer;
  }
  .tagItem {
    display: inline-block;
    margin-bottom: 10px;
    cursor: pointer;
    margin: 0 15px 16px 0;
  }
#RecommendWrapper{
  padding: 15px 20px;
  border: 1px solid #e0e0e0;
  height: auto;
  margin: 8px 0;
  position: relative;
  h2{
    line-height: 44px;
    font-size: 17px;
    font-weight: normal;
  }
  .clean{
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
  }
}
.footer{
  text-align: center;
}
</style>
<script>
import uploadImg from '@/components/upload/uploadImg';
import ueditor from '@/components/ueditor/editor';
import ajax from '@/utils/ajax';
import java from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date.js';
export default {
  data() {
    return {
      tempics: [],   // 存放picUrl的数组
      Body_editor: null,
      CategoryOptions: [], // 分类
      form: {
        title: '', // 咨询标题
        releaseTime: this.dateFormatter(new Date()),  // 发布时间
        categoryId: '',
        categoryName: '',
        sourceUrl: '',  // 来源路径
        sourceName: '',  // 来源路径
        readingQuantity: '',  // 阅读量
        abstract: '',  // 摘要
        body: '',  // 咨询详情
        mainImage: '',  // 主图
        sort: 1,  // 排序
        isCopyRight: '', // 是否原创
        isTop: 1, // 是否置顶
        statusFlag: '',  // 核审状态（一般不传 0：未编辑，1：待审核，2：审核通过）
        picUrl: '',   // 图片路径
        showType: '',  // 资讯样式（1：一张大图 2：一张小图 3：三张小图 0：无图仅标题）
        TabIds: '1',  // 标签编号
        productList: [], // 商品列表
        RecommendList: [],  // 推荐资讯
        newsType: 1,  // 资讯类型（1：图文，2：视频 3.两者都有  默认图文）
        video_src: '', // 视频地址
        sendMessage: 0,  // 推送 0 否 1 是
      },
      mainPic: true, // 主图
      uploadImghide: false, // 资讯展示图
      modifyData: [], // 接收获取信息
      dynamicTags: [],  // 标签
      inputVisible: false,  // 标签隐藏
      inputValue: '',      // 绑定标签值
      tagsVisible: false,   // 标签弹窗
      picSum: null,  // limit图片数
      labels: [],
      searchData: {
        tagId: '',  // 标签ID
        pageNum: 1,
        pageSize: 80,
        total: '',
        orderBy: 'asc',
      },
      rules: {
        title: [
          { required: true, message: '请输入咨询标题', trigger: 'blur' },
        ],
        releaseTime: [
          { required: true, message: '请选择发布时间' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        sort: [
          { required: true, message: '请选择排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        readingQuantity: [
          { required: true, message: '请输入浏览人数', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        sourceUrl: [
          { required: false, message: '请输入来源路径', trigger: 'blur' },
          { type: 'url', message: '请输入正确的url路径', trigger: 'blur' },
        ],
        sourceName: [
          { required: false, message: '请输入来源名称', trigger: 'blur' },
        ],
        isCopyRight: [
          { required: true, message: '请选择是否原创', trigger: 'change' },
        ],
        IsTop: [
          { required: true, message: '请选择是否置顶', trigger: 'change' },
        ],
        abstract: [
          { required: false, message: '请输入摘要内容', trigger: 'blur' },
        ],
        showType: [
          { required: true, message: '请选择资讯样式', trigger: 'blur' },
        ],
        body: [
          { required: true, message: '请输入资讯内容', trigger: 'blur' },
        ],
        newsType: [
          { required: true, message: '请选择资讯类型', trigger: 'change' },
        ],
        sendMessage: [
          { required: true, message: '请选择是否推送', trigger: 'change' },
        ],
      },
      tagList: [], // 标签弹窗,标签名
      subTableData: [],
      productData: [],
      newsShow: false,
      productShow: false,
      subColumns: this.getSubColumns(),
      pruductsColumns: this.getProColumns(),
      ProductsUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
      NewListURL: `${process.env.WEB_HOST}/manage/outNewList`,
      productMiddle: [],
      returnPageIndex: '',  // 页码
      productPicData: {
        proPic: '',  // 更改商品图片
      },
      replacePic: false
    };
  },
  props: {
    newsAdd: Boolean
  },
  components: {
    'uploadImg': uploadImg,
    'uploadProImg': uploadImg,
    'ueditor': ueditor,
  },
  watch: {
    'form.showType': function () {
      if (this.form.showType === 0) {
        this.uploadImghide = false;
        this.mainPic = true;
        this.picSum = 0;
      }
      else if (this.form.showType === 1) {
        this.form.mainImage = '';
        this.uploadImghide = true;
        this.mainPic = false;
        this.picSum = 1;
      }
      else if (this.form.showType === 2) {
        this.form.mainImage = '';
        this.uploadImghide = true;
        this.mainPic = false;
        this.picSum = 1;
      }
      else if (this.form.showType === 3) {
        this.form.mainImage = '';
        this.picSum = 3;
        this.uploadImghide = true;
        this.mainPic = false;
      }
    }
  },
  methods: {
    // 资讯样式
    changePic(index) {
      this.form.picUrl = '';
    },
    // 上传展示图
    uploadthumbnailImg(data, imgUrl) {
      this.form.picUrl = imgUrl;
    },
    // 删除展示图
    removethumbnailImg(url) {
      this.form.picUrl = url;
    },
    // 上传主图
    uploadImgMain(data, imgUrl) {
      this.form.mainImage = imgUrl;
    },
    // 删除主图
    removeImgMain(url) {
      this.form.mainImage = url;
    },
    // 获取资讯分类
    getClassify() {
      let param = {
        PageIndex: '1',
        PageSize: '100',
        CategoryName: ''
      };
      ajax.post(`/api/news/GetNewsCategoryListByPage`, param).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let CategoryData = res.data.data.map(function (item, index, data) {
            return item;
          });
          this.CategoryOptions = CategoryData;
        }
      });
    },
    // 根据ID获取分类名
    categoryIdList(item) {
      this.form.categoryId = item;
      ajax.get('/api/news/GetNewsCategoryDetail/' + item).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.form.categoryName = res.data.data.categoryname;
        } else {
          this.form.categoryName = '-';
        }
      });
    },
    // 删除列表标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      let selectedTagIdList = [];
      for (let i = 0; i < this.dynamicTags.length; i++) {
        let tagName = this.dynamicTags[i];
        let tag = this.labels.find((x) => x.tagName === tagName);
        if (tag) {
          selectedTagIdList.push(tag.tagId);
        }
      }
      this.form.TabIds = selectedTagIdList.join(',');
    },
    // 阅读量随机数
    randomNum() {
      let random = Math.floor(Math.random(1, 100) * 500);
      this.form.readingQuantity = random;
    },
    // 新增标签
    showInput() {
      this.inputVisible = true;
      this.tagsVisible = true;
    },
    // 获取标签
    queryByNews() {
      let _self = this;
      let param = {};
      param = _self.searchData;
      java.post(`/mall_manage/back/newsInfo/queryTagPo`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let labelData = res.data.resultData.data.map(function (item, index, data) {
            return {
              tagName: item.tagName,
              tagId: item.tagId,
            };
          });
          _self.labels = labelData;
        }
      });
    },
    // 标签弹出框
    tagActive() {
      this.tagsVisible = true;
    },
    // 标签提交上传
    confirm() {
      let msg = '请选择标签';
      let message = '操作成功';
      if (this.tagList.length === 0) {
        this.$message({
          showClose: false,
          message: msg,
          type: 'warning'
        });
      } else {
        this.dynamicTags = this.tagList;
        let selectedTagIdList = [];
        for (let i = 0; i < this.dynamicTags.length; i++) {
          let tagName = this.dynamicTags[i];
          let tag = this.labels.find((x) => x.tagName === tagName);
          if (tag) {
            selectedTagIdList.push(tag.tagId);
          }
        }
        this.form.TabIds = selectedTagIdList.join(',');
        this.tagsVisible = false;
        this.$message({
          showClose: true,
          message: message,
          type: 'success'
        });
      }
    },
    // 取消标签上传
    cancel() {
      let msg = '已取消';
      this.tagsVisible = false;
      this.$message({
        message: msg,
        type: 'info'
      });
    },
    // 添加资讯
    addinformation() {
      this.newsShow = true;
    },
    // 资讯Columns
    getSubColumns() {
      let columns = [
        { field: 'id', title: '资讯ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '资讯标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'categoryname', title: '资讯分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createdtime', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '排序', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-listDelete', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'createdtime') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            }
          };
        }
      }
      return columns;
    },
    // 添加推荐资讯
    selectNewList(data) {
      let _self = this;
      _self.subTableData.push(data);
      let newsShare = _self.subTableData.map(function (item, index, data) {
        return {
          id: item.id,
          title: item.title,
          sort: item.sort,
        };
      });
      _self.form.RecommendList = newsShare;
      _self.newsShow = false;
    },
    // 删除单个资讯数据
    customCompFuncNews(params) {
      if (params.type === 'delete') {  // 删除
        this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subTableData.splice(params.index, 1);
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    // 清除所有推荐资讯
    cleanNews() {
      if (this.subTableData.length !== 0) {
        this.$confirm('此操作将执行清空推荐资讯操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subTableData = [];
          this.form.RecommendList = [];
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          type: 'info',
          message: '列表无数据'
        });
      }
    },
    // 添加商品
    addProduct() {
      this.productShow = true;
    },
    // 选择更改图
    uploadProImg(img) {
      this.productPicData.proPic = img;
    },
    // 删除更改图
    removeProImg(Url) {
      this.productPicData.proPic = Url;
    },
    // 取消更换图片
    cleanPic() {
      let msg = '已取消';
      this.tagsVisible = false;
      this.$message({
        message: msg,
        type: 'info'
      });
      this.replacePic = false;
    },
    // 确定更换商品图
    queryByNewsPic() {
      let index = this.$route.query.index;
      let productMainPic = this.productPicData.proPic;
      if (productMainPic !== '') {
        this.productData[index].product_main_image = productMainPic;
        this.$nextTick(function() {
          this.$message({
            message: '更改成功',
            type: 'success'
          });
        });
        this.form.productList = this.productData;
        this.productPicData.proPic = '';
      }
      this.replacePic = false;
    },
    // 商品Columns
    getProColumns() {
      let columns = [
        { field: 'product_id', title: '商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_name', title: '商品名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'categoryname', title: '商品分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_main_image', title: '商品图片', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_markprice', title: '价格', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'newsinfo-product-operations', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'product_main_image') {
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
        if (item.field === 'product_markprice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '<span style="color: red">' + value + '</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 选择推荐商品返回数据
    setSelectedList(data, productNum, index, information, drugfrom) {
      let _self = this;
      if (data.length !== 0 && productNum === true) {
        let source = {
          common_id: data[0].getCommon,
          fast_id: data[0].getFast,
          self_id: data[0].getByself,
          transnational_id: data[0].transnational,
          product_id: data[0].productId,
          product_name: data[0].productName,
          product_main_image: data[0].productMainImage,
          product_markprice: data[0].productMarkprice,
          product_describe: data[0].description,
          goods_norms: data[0].productSpecification,
        };
        _self.productData.push(source);
        _self.form.productList = _self.productData;
        _self.productShow = false;
      } else if (data === false) {
        _self.productShow = false;
      } else if (data.length === 0) {
        _self.$message({
          message: '请选择推荐商品',
          type: 'error'
        });
      } else {
        _self.$message({
          message: '该商品只能选择一个',
          type: 'error'
        });
      }
    },
    // 删除单个商品数据
    customCompFuncProduct(params) {
      if (params.type === 'delete') {  // 删除
        this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.productData.splice(params.index, 1);
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'seePic') {
        let data = {
          id: this.$route.query.id,
          pageIndex: this.$route.query.pageIndex,
          pageSize: this.$route.query.pageSize,
          index: params.index,
        };
        if (this.newsAdd) {
          this.$router.push({
            path: '/news/newsAdd',
            query: data,
          });
        } else {
          this.$router.push({
            path: '/news/newsEdit',
            query: data,
          });
        }
        this.replacePic = true;
      }
    },
    // 清空商品推荐
    cleanpro() {
      if (this.productData.length !== 0) {
        this.$confirm('此操作将执行清空推荐商品操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.productData = [];
          this.form.productList = [];
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          type: 'info',
          message: '列表无数据'
        });
      }
    },
    // 获取资讯信息
    modifybefore() {
      let _self = this;
      let param = {
        newsId: _self.$route.query.id,
      };
      _self.returnPageIndex = _self.$route.query.pageIndex;
      java.post(`/mall_manage/back/newsInfo/queryNewsInfo`, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.modifyData = res.data.resultData;
          _self.form = res.data.resultData;
          _self.form.abstract = _self.modifyData.abstracts;
          // 发布时间处理
          let time = _self.modifyData.releaseTime;
          if (time) {
            _self.form.releaseTime = formatDate(time);
          }
          _self.form.categoryName = _self.modifyData.newsCategory.categoryName;
          if (_self.modifyData.videoSrc) {
            sessionStorage.setItem('video_src', _self.modifyData.videoSrc);
          }
          // 展示图片处理
          _self.tempics = _self.modifyData.picUrl.split('http');
          let pic = _self.tempics.map(function (item, index, data) {
            return 'http' + item;
          });
          let picLong = pic.slice(1, 4);
          _self.form.picUrl = picLong.join('');
          // 标签处理
          let tagItemList = _self.modifyData.tagList.map(function (item, index, data) {
            return {
              tagName: item.tagName,
              tagId: item.tagId
            };
          });
          let tagNameList = tagItemList.map(function (item, index, data) {
            return item.tagName;
          });
          _self.dynamicTags = tagNameList;
          _self.tagList = _self.dynamicTags;
          let tagIdList = tagItemList.map(function (item, index, data) {
            return item.tagId;
          });
          _self.form.TabIds = tagIdList.join(',');
          // 推送
          if (!_self.modifyData.sendMessage) {
            _self.form.sendMessage = 0;
          }
          if (_self.form.body) {
            _self.Body_editor.setContent(_self.form.body);
          }
          // 推荐资讯处理
          let RecommendList = _self.modifyData.newsRecommendList;
          let replace = RecommendList.map(function (item, index, data) {
            return {
              id: item.recommendId,
              title: item.recommendTitle,
              sort: item.sort,
              createdtime: item.createdTime,
            };
          });
          _self.subTableData = replace;
          _self.form.RecommendList = _self.subTableData;
          // 推荐商品处理
          let proDuctList = _self.modifyData.productList;
          let replace2 = proDuctList.map(function (item, index, data) {
            return {
              common_id: item.getCommon,
              fast_id: item.getFast,
              self_id: item.getByself,
              transnational_id: item.transnational,
              product_id: item.productId,
              product_name: item.productName,
              product_main_image: item.productMainImage,
              product_markprice: item.productMarkprice,
              product_describe: item.description,
              goods_norms: item.productSpecification,
            };
          });
          _self.productData = replace2;
          if (proDuctList.length !== 0) {
            _self.productMiddle = replace2;
          } else {
            _self.productMiddle = [];
          }
        }
        _self.form.productList = _self.productMiddle;
      });
    },
    // 提交咨询
    submitForm() {
      let _self = this;
      _self.form.body = _self.Body_editor.getContent();
      let video_src = sessionStorage.getItem('video_src');
      if (video_src) {
        if (video_src.indexOf('http') < 0) {
          video_src = process.env.UPLOAD_HOST + '/ue/' + video_src;
        }
        _self.form.video_src = video_src;
      }
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          this.commit();
        }
        else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    // 提交
    commit() {
      let _self = this;
      let picUrlArray = _self.form.picUrl.split(',');
      if (_self.picSum === 0) {
        picUrlArray.length = 0;
      } else {
        _self.form.mainImage = picUrlArray[0];
      }
      let postdata = _self.form;
      postdata.news_type = _self.form.newsType;
      if (picUrlArray.length === _self.picSum) {
        // ----新增资讯-----
        let url;
        if (this.newsAdd) {
          url = `/api/admin/addNews`;
        }
        // ----修改资讯-----
        else {
          url = `/api/admin/updateNews`;
          _self.form.Id = _self.$route.query.id;
        }
        ajax.post(url, postdata).then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            _self.$message({
              showClose: true,
              message: res.data.message,
              type: 'success'
            });
            _self.resetForm();
            _self.$router.push({
              path: '/news/newsList',
              query: {
                pageIndex: _self.returnPageIndex,
                pageSize: _self.$route.query.pageSize,
                Title: _self.$route.query.Title,
                StatusFlag: _self.$route.query.StatusFlag,
                category_id: _self.$route.query.category_id,
              },
            });
          } else {
            _self.$message.error(res.data.message);
          }
        });
      } else {
        _self.$message({
          showClose: true,
          message: '请选择相应数量图片',
          type: 'error'
        });
      }
    },
    // 重置
    resetForm() {
      this.$refs['addData'].resetFields();
      this.body = '';
      this.Body_editor.setContent('');
      this.dynamicTags = [];
      this.tempimg = [];
      this.form.picUrl = '';
      this.subTableData = [];
      this.productData = [];
      this.form.productList = [];
      this.form.RecommendList = [];
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // yyyy-MM-dd HH-mm-ss
    dateFormatter(str) {
      let newDate = new Date(str);
      let year = newDate.getFullYear();
      let month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
      let day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
      let hour = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
      let minute = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
      let second = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
      return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
    }
  },
  mounted() {
    this.Body_editor = this.$refs.content_ueditor;
  },
  created() {
    this.queryByNews();
    this.getClassify();
    if (!this.newsAdd) {
      this.modifybefore();
    }
    this.randomNum();
    window.previewImg = this.previewImg;
    window.selectNewList = this.selectNewList;
    window.setSelectedList = this.setSelectedList;
  }
};
</script>
