<template>
  <div id="addSwiperWrapper">
    <el-form :model="addSwiperData" :rules="rules" ref="addSwiper" label-width="108px" size="small">
      <!-- 添加轮播 -->
      <div id="swiper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序号:" prop="Sort">
              <el-input placeholder="请输入排序号" v-model="addSwiperData.Sort" clearable style="width: 336px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item label="版本号:" prop="Version">
              <el-input v-model.number="addSwiperData.Version" placeholder="请输入版本号（例：v1.0）" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="版本号：" prop="version" :rules="{
                  required: true, message: '请输入版本号', trigger: 'blur'
                }">
                  <!-- <el-input v-model="selectedData.version" placeholder="请输入版本号,如v1.0" clearable></el-input> -->
                  <el-select
                    style="width: 336px"
                    v-model.trim="addSwiperData.version"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    popper-class='downClass'
                    :popper-append-to-body="false"
                    placeholder="请输入版本号,如v1.0,按回车键可输入多个">
                    <el-option
                    v-for="item in versionOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片:" :prop="'PicturePath'" :rules="{
                required: true, message: '请选择图片', trigger: 'change'
              }">
              <uploadSingleImg :imgUrl="addSwiperData.PicturePath" :fileName="'PicturePath'" @uploadSuccess="uploadthumbnailImg" @removeImg="removethumbnailImg"></uploadSingleImg>
              <el-input class="left" type="hidden" v-model="addSwiperData.PicturePath" style="width: 336px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容类别:" prop="Category">
              <el-select style="width: 336px" v-model="addSwiperData.Category" clearable placeholder="请选择类别" @change="replaceCategory">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
              <el-col :span="12">
                <el-form-item label="跳转类型：">
                  <el-select style="width: 336px" v-model="addSwiperData.jumptype" props="jumptype">
                    <el-option :label="'H5'" :value="1"></el-option>
                    <el-option :label="'礼品'" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="发布渠道：" prop="publishtarget">
                  <el-select style="width: 336px" v-model="addSwiperData.publishtarget " multiple placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="轮播图类别：" prop="bannerCategory">
                  <el-select style="width: 336px" v-model="addSwiperData.bannerCategory">
                    <el-option :label="'商城轮播图'" :value="1"></el-option>
                    <el-option :label="'快送轮播图'" :value="13"></el-option>
                    <el-option :label="'商城长轮播图'" :value="15"></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 图片链接地址 -->
      <div v-if="pic_url" class="picWrapper">
        <span class="clean" @click="clean()">×</span>
        <h2>图片链接地址</h2>
        <div id="swiper">
          <el-row>
            <el-col :span="24">
              <el-form-item label="链接地址:" prop="PictureUrl">
                <el-input placeholder="请输入图片链接地址" v-model="addSwiperData.PictureUrl" style="width:800px" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 商品信息 -->
      <div v-if="goodsDetails" class="picWrapper">
        <h2>商品信息</h2>
        <div id="swiper">
          <el-button-group>
            <el-button type="default" size="small" @click="addSwiper" icon="el-icon-plus" style="margin-bottom: 10px;">添加/替换商品</el-button>
            <el-button type="default" size="small" @click="deletePro" icon="el-icon-delete" style="margin-left: 10px;">删除商品</el-button>
          </el-button-group>
          <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="subColumns" :table-data="subTableData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
        </div>
        <el-dialog title="请选择新增的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
          <iframe :src="outSelectedInfoUrl" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
        </el-dialog>
      </div>
      <el-row>
        <el-form-item class="form-button-wrapper">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline">重置</el-button>
          <el-button type="primary" @click="commit" icon="el-icon-check">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
import uploadSingleImg from '@/components/upload/uploadImg';
import outSelectedInfo from '../outSelectedInfo.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    // 排序
    let validateSort = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内，大于0的正整数'));
        }
      } else {
        return callback(new Error('请输入10位数以内，大于0的正整数'));
      }
    };
    return {
      addSwiperData: {
        Sort: '',
        PicturePath: '',
        PictureUrl: '',
        version: [],
        Category: '',
        jumptype: null,
        publishtarget: [],
        bannerCategory: 1,
        Product: {
          productId: '',   // 商品Id
          getCommon: '1',   // 商品来源
        },
      },
      selected: 1,
      versionOption: [
        {
          value: '',
          label: ''
        }
      ],
      // Content: [],
      modifyData: [],
      pic_url: false,
      goodsDetails: false,
      categoryOptions: [
        { value: '1', label: 'h5' },
        { value: '2', label: 'app' },
      ],
      options: [
        { value: '1', label: 'app' },
        { value: '2', label: 'h5' },
        { value: '3', label: '小程序' },
      ],
      value: '',
      subTableData: [],
      rules: {
        Sort: [{ required: true, validator: validateSort, trigger: 'blur' }],
        Category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        publishtarget: [{ required: true, message: '请选择发布渠道', trigger: 'blur' }],
        bannerCategory: [{ required: true, message: '请选择轮播图类别', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本号（例：v1.0）', trigger: 'blur' }],
        PictureUrl: [{ required: false, message: '请输入图片链接地址', trigger: 'blur' }, { type: 'url', message: '请输入正确的url图片链接地址' }],
      },
      subColumns: this.getSubColumns(),
      productShow: false,
      outSelectedInfoUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
    };
  },
  components: {
    outSelectedInfo: outSelectedInfo,
    uploadSingleImg: uploadSingleImg,
  },
  props: {
    isAdd: Boolean,
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 上传缩略图
    uploadthumbnailImg(data) {
      this.addSwiperData.PicturePath = data.url;
    },
    // 删除缩略图
    removethumbnailImg() {
      this.addSwiperData.PicturePath = '';
    },
    // 添加商品
    addSwiper() {
      this.productShow = true;
    },
    // 商品选择后表格
    getSubColumns() {
      let columns = [
        { field: 'productId', title: '商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMarkprice', title: '商品价格', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'productMainImage') {
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
    // 选择商品
    setSelectedList(data, productNum) {
      let _self = this;
      if (data !== false && productNum === true) {
        let proData = [{
          productId: data[0].productId,
          productName: data[0].productName,
          productMainImage: data[0].productMainImage,
          productMarkprice: data[0].productStocks[0].productPrice,
          isChecked: data[0].isChecked,
        }];
        for (let i = 0; i < proData.length; i++) {
          if (proData[i].isChecked === 2) {
            this.$message({
              message: '该商品还未审核，请选择已审核的商品',
              type: 'error'
            });
          }
          else {
            _self.subTableData = proData;
            _self.productShow = false;
            _self.addSwiperData.Product.productId = data[0].productId;
          }
        }
      } else if (data === false) {
        _self.productShow = false;
      } else {
        _self.$message({
          message: '只能选1个商品',
          type: 'error'
        });
      }
    },
    // 删除商品列表信息
    deletePro() {
      if (this.subTableData.length !== 0) {
        this.$confirm('此操作将执行删除商品列表操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subTableData = [];
          this.$message({
            type: 'success',
            message: '删除成功!'
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
    // 获取轮播数据
    modifySwiperBefore() {
      let _self = this;
      ajax.get(`/api/admin/getHomeBannerDetail/` + _self.$route.query.id).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          _self.modifyData = res.data.data;
          _self.addSwiperData.Sort = Number(_self.modifyData.sort);
          _self.addSwiperData.PicturePath = _self.modifyData.picturepath;
          _self.addSwiperData.Category = _self.modifyData.category;
          _self.addSwiperData.PictureUrl = _self.modifyData.pictureurl;
          _self.addSwiperData.jumptype = _self.modifyData.jumptype;
          _self.addSwiperData.bannerCategory = _self.modifyData.bannercategory;
          _self.selected = _self.addSwiperData.bannerCategory;
          if (_self.modifyData.product) {
            let ProductData = {
              productId: _self.modifyData.product.productid,
              productName: _self.modifyData.product.productname,
              productMainImage: _self.modifyData.product.productmainimage,
              productMarkprice: _self.modifyData.product.productmarkprice,
            };
            _self.subTableData.push(ProductData);
            _self.addSwiperData.Product.productId = _self.modifyData.product.productid;
          }
          if (_self.modifyData.version !== '') {
            _self.addSwiperData.version = _self.modifyData.version.split(',');
          }
          if (_self.modifyData.publishtarget !== '') {
            _self.addSwiperData.publishtarget = _self.modifyData.publishtarget.split(',');
          }
        }
      });
    },
    // 提交
    commit() {
      let _self = this;
      let postData = {};
      if (_self.addSwiperData.Category === '1') { // --- url------
        postData = _self.addSwiperData;
        postData.Product = '';
      } else if (_self.addSwiperData.Category === '2') {   // --------------- 商品-----------
        if (_self.subTableData.length === 0) {
          _self.$message({
            message: '请选择商品',
            type: 'error'
          });
          return false;
        }
        postData = _self.addSwiperData;
      }
      if ((_self.addSwiperData.version.length !== 0) && (_self.addSwiperData.publishtarget.length !== 0)) {
        postData.version = _self.addSwiperData.version.join(',');
        postData.publishtarget = _self.addSwiperData.publishtarget.join(',');
      }
      postData.bannerCategory = _self.addSwiperData.bannerCategory;
      let url;
      if (!this.isAdd) {
        _self.addSwiperData.Id = _self.$route.query.id;
        url = '/api/admin/updateHomeBanner';
      } else {
        url = '/api/admin/addHomeBanner';
      }
      this.$refs['addSwiper'].validate((valid) => {
        if (valid) {
          ajax.post(url, postData).then(res => {
            if (res.data.code === 0 && res.status === 200) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              // 关闭当前页并跳转列表页
              let currentName = _self.$route.name;
              let currentTab = _self.visitedViews.find((x) => x.name === currentName);
              _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                _self.$router.push('/manage/swiper?pageIndex=' + this.$route.query.pageIndex + '&pageSize=' + this.$route.query.pageSize + '&AdvertinsingType=' + this.$route.query.AdvertinsingType + '&version=' + this.$route.query.version);
              });
            } else {
              _self.$message.error(res.data.msg);
            }
          });
        }
        else {
          return false;
        }
      });
    },
    // 切换类别时，清空链接地址和展示商品
    replaceCategory(data) {
      if (this.addSwiperData.Category === '1') {
        this.addSwiperData.PictureUrl = '';
      }
      if (this.addSwiperData.Category === '2') {
        this.subTableData = [];
      }
    },
    // 重置
    resetForm() {
      this.$refs['addSwiper'].resetFields();
      this.goodsDetails = false;
      this.pic_url = false;
      this.value = '';
    },
  },
  watch: {
    'addSwiperData.Category': function () {
      if (this.addSwiperData.Category === '1') {
        this.categoryOptions.label = 'url';
        this.pic_url = true;
        this.goodsDetails = false;
      }
      if (this.addSwiperData.Category === '2') {
        this.categoryOptions.label = '商品信息';
        this.goodsDetails = true;
        this.pic_url = false;
      }
    }
  },
  created() {
    if (!this.isAdd) {
      this.modifySwiperBefore();
    }
    window.setSelectedList = this.setSelectedList;
    window.previewImg = this.previewImg;  // 预览图片
  }
};
</script>
<style lang="less" scoped>
#addSwiperWrapper{
  margin-bottom: 80px;
}
.el-col {
  margin: 8px 0;
}
// .el-col-12 >>> .el-form-item__label{
//   width: 110px;
// }
// .el-form-item__label{
//   width: 110px !important;
// }
#swiper {
  padding: 15px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
  //overflow: hidden;
  padding-bottom: 5px;
   & /deep/ .downClass{
    display: none;
  }
  .el-form-item__label {
    width: 150px;
  }
  .commom {
    margin-left: -110px;
  }
  .lengthCommon {
    width: 80%;
  }
}
#swiper::after {
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}
.picWrapper {
  padding: 10px 20px 0;
  border: 1px solid #e0e0e0;
  height: auto;
  margin-bottom: 15px;
  position: relative;
}
h2 {
  line-height: 50px;
  font-size: 16px;
  font-weight: normal;
}
.form-button-wrapper {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.clean {
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
}
</style>

