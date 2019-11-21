<template>
  <div id="addRecommendWrapper">
    <el-form :model="addRecommendData" :rules="rules" ref="addRecommend" class="addRecommendForm" label-width="100px" size="small">
      <h2>{{titleTxt}}推荐</h2>
      <div class="bannerInfo">
        <el-form-item label="标题:" prop="title">
          <el-input v-model.number="addRecommendData.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input placeholder="请输入排序" v-model.number="addRecommendData.sort" clearable></el-input>
        </el-form-item>
        <el-form-item label="版本号:" prop="version" >
          <el-input v-model.number="addRecommendData.version" placeholder="请输入版本号（例：v1.0）" clearable></el-input>
        </el-form-item>
        <el-form-item label="url:" prop="pictureUrl" >
          <el-input v-model.number="addRecommendData.pictureUrl" placeholder="请输入url" clearable></el-input>
        </el-form-item>
        <el-form-item label="请选择图片:" :prop="'picturePath'"  :rules="{
                required: true, message: '请选择图片', trigger: 'change'
              }">
          <uploadSingleImg :imgUrl="addRecommendData.picturePath" :fileName="'picturePath'" @uploadSuccess="uploadthumbnailImg" @removeImg="removethumbnailImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="addRecommendData.picturePath"></el-input>
        </el-form-item>
      </div>
      <!-- 商品信息 -->
      <div class="picWrapper">
        <!-- <span class="clean" @click="clean()">×</span> -->
        <h2>商品信息</h2>
        <div class="itemList">
          <el-button-group>
            <el-button type="default" size="small" @click="addRecommend" icon="el-icon-plus" style="margin-bottom: 10px;">添加商品</el-button>
            <el-button type="default" size="small" @click="batchDelete" icon="el-icon-delete" style="margin-left: 10px;">批量删除商品</el-button>
          </el-button-group>
          <div class="table-wrapper">
            <v-table ref="data_table" is-horizontal-resize style="width:100%" :columns="columns" :table-data="subTableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
            </v-table>
          </div>
        </div>
        <el-dialog title="请选择新增的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
          <iframe :src="outSelectedInfoUrl" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
        </el-dialog>
      </div>
      <el-form-item class="form-button-wrapper">
        <el-button @click="resetForm" icon="el-icon-circle-close-outline">重置</el-button>
        <el-button type="primary" @click="commit" icon="el-icon-check">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
import uploadSingleImg from '@/components/upload/uploadImg';
import outSelectedInfo from './outSelectedInfo.vue';
export default {
  data() {
    return {
      recommendId: '',
      addRecommendData: {
        sort: '',
        title: '',
        picturePath: '',
        version: '',
        pictureUrl: ''
      },
      selection: [],
      value: '',
      subTableData: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '请输入精选好药排序', trigger: 'blur' },
          { type: 'number', message: '排序必须为数字值' }
        ],
        version: [
          { required: true, message: '请输入版本号（例：v1.0）', trigger: 'blur' },
        ]
      },
      productShow: false,
      titleTxt: '新增',
      deleteIdList: [],
      // reGoodsList: [],
      outSelectedInfoUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=11&index=`,
    };
  },
  components: {
    outSelectedInfo: outSelectedInfo,
    uploadSingleImg: uploadSingleImg,
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  created() {
    // this.setSelectedList();
    this.getInt();
    window.setSelectedList = this.setSelectedList;
  },
  computed: {
    columns() {
      // let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productid', title: '商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productname', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productmainimage', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productmarkprice', title: '商品价格', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 50, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-addRecommend', isResize: true }
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
        if (item.field === 'productmainimage') {
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
      console.log(columns);
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ]),
  },
  methods: {
    getInt() {
      this.recommendId = this.$route.query.id;
      if (this.recommendId) {
        this.titleTxt = '编辑';
        this.getGoodsDetail(this.recommendId);
        // this.getGoodsList(this.recommendId);
      }
    },
    // 获取推荐
    getGoodsDetail(rId) {
      ajax.get(`/api/admin/getGoodsBannerDetail/${rId}`).then(res => {
        console.log(res);
        if (res.data.code === 0 && res.status === 200) {
          console.log(res);
          let resData = res.data.data;
          this.addRecommendData = {
            sort: resData.sort,
            title: resData.title,
            picturePath: resData.picturepath,
            version: resData.version,
            pictureUrl: resData.picture_url
          };
          this.subTableData = resData.products ? resData.products : [];
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取推荐下的商品
    getGoodsList(rId) {
      ajax.get(`/api/admin/getGoodsProductList/${rId}`).then(res => {
        console.log(res);
        if (res.data.code === 0 && res.status === 200) {
          console.log(res);
          // let proData = [{
          //   productId: data[0].productId,
          //   productName: data[0].productName,
          //   productMainImage: data[0].productMainImage,
          //   productMarkprice: data[0].productMarkprice,
          // }];
          // let resData = res.data.data;
          // this.reGoodsList = [...this.reGoodsList, ...resData];
          // this.subTableData = resData;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 添加/编辑推荐
    addGoodsBanner() {
      let url = '';
      let postDataList = [];
      if (this.subTableData.length > 0) {
        this.subTableData.forEach((res, i) => {
          console.log(res);
          let postData = {
            ProductId: res.productid,
            getByself: res.getByself ? res.getByself : res.getbyself,
            getCommon: res.getCommon ? res.getCommon : res.getcommon,
            getFast: res.getFast ? res.getFast : res.getfast,
            transnational: res.transnational,
            Sort: i + 1
          };
          postDataList.push(postData);
        });
      }
      let postData = {
        title: this.addRecommendData.title,
        sort: this.addRecommendData.sort,
        picturePath: this.addRecommendData.picturePath,
        version: this.addRecommendData.version,
        PictureUrl: this.addRecommendData.pictureUrl,
        Products: postDataList
      };
      if (!this.recommendId) {
        url = '/api/admin/addGoodsBanner';
      }
      else {
        url = '/api/admin/updateGoodsBanner';
        postData.id = this.recommendId;
      }
      return new Promise((resolve, reject) => {
        ajax.post(url, postData).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.$router.push('/manage/recommend');
            // let rId = this.recommendId ? this.recommendId : res.data.data;
            // if (!this.recommendId) {
            //   this.addGoodsProduct(rId, this.subTableData);
            // }
            // if (this.recommendId) {
            //   let isDeleteGood = [];
            //   let isAddGood = [];
            //   // 删除商品
            //   if (this.deleteIdList.length > 0) {
            //     this.reGoodsList.forEach(reGid => {
            //       console.log('reGid' + reGid.id);
            //       this.deleteIdList.forEach(deGid => {
            //         console.log('deGid' + deGid);
            //         if (reGid.id === deGid) {
            //           isDeleteGood.push(deGid);
            //         }
            //       });
            //     });
            //     isDeleteGood = Array.from(new Set(isDeleteGood));
            //     console.log(isDeleteGood);
            //     if (isDeleteGood.length > 0) {
            //       // this.deleteGoods(this.deleteIdList);
            //       this.deleteGoods(isDeleteGood);
            //     }
            //   }
            //   // 添加商品
            //   if (this.subTableData.length > 0) {
            //     if (this.reGoodsList.length <= 0) {
            //       isAddGood = this.subTableData;
            //     }
            //     else {
            //       console.log(this.reGoodsList);
            //       isAddGood = [...isAddGood, ...this.subTableData];
            //       this.reGoodsList.forEach(item => {
            //         isAddGood.splice(isAddGood.findIndex(v => v.id === item.id), 1);
            //       });
            //     }
            //     if (isAddGood.length > 0) {
            //       this.addGoodsProduct(rId, isAddGood);
            //     }
            //   }
            // }
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    // 添加商品
    addRecommend() {
      this.productShow = true;
    },
    // 选择商品
    setSelectedList(data, productNum) {
      // let _self = this;
      console.log(data);
      if (data !== false && productNum === true) {
        let proDataList = [];
        data.forEach(res => {
          console.log(res);
          let proData = {
            productid: res.productId,
            productname: res.productName,
            productmainimage: res.productMainImage,
            productmarkprice: res.productMarkprice,
            productSource: res.productSource,
            // sellerUserId: res.productStocks[0].sellerUserId
            getByself: res.getByself,
            getCommon: res.getCommon,
            getFast: res.getFast,
            transnational: res.transnational
          };
          proDataList.push(proData);
        });
        console.log(proDataList);
        console.log(this.subTableData);
        this.subTableData = [...this.subTableData, ...proDataList];
        let hash = {};
        this.subTableData = this.subTableData.reduceRight((item, next) => {
          /* eslint-disable */
          hash[next.productid] ? '' : hash[next.productid] = true && item.push(next);
          return item;
        }, []);
        this.productShow = false;
      } else if (data === false) {
        this.productShow = false;
      }
    },
    // 提交
    commit() {
      this.$refs['addRecommend'].validate((valid) => {
        if (valid) {
          let _self = this;
          let postData = {};
          postData.sort = _self.addRecommendData.sort;
          postData.picturePath = _self.addRecommendData.picturePath;
          postData.version = _self.addRecommendData.version;
          postData.PictureUrl = _self.addRecommendData.pictureUrl;
          // postData.Product = '';
          // else {
          //   postData = this.addSwiperData;
          // }
          this.addGoodsBanner();
        }
        else {
          return false;
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs['addRecommend'].resetFields();
      this.value = '';
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除这些商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Ids = [];
          for (let item of this.selection) {
            Ids.push(item.productid);
          }
          this.selection.forEach(item => {
            this.subTableData.splice(this.subTableData.findIndex(v => v.productid === item.productid), 1);
          });
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
    // 上传缩略图
    uploadthumbnailImg(data) {
      this.addRecommendData.picturePath = data.url;
    },
    // 删除缩略图
    removethumbnailImg() {
      this.addRecommendData.picturePath = '';
    },
    customCompFunc(params) {
      if (params.type === 'delete') {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subTableData.splice(this.subTableData.findIndex(v => v.productid === params.rowData.productid), 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') {
        // this.modify(params.rowData.id);
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
    }
  }
};
</script>
<style lang="less" scoped>
.el-col {
  margin: 8px 0;
}
.addRecommendForm{
   margin-bottom: 94px;

  .bannerInfo, .itemList {
    padding: 15px;
    border: 1px solid #e0e0e0;
    margin-bottom: 20px;
    //overflow: hidden;
    padding-bottom: 5px;
    .el-form-item__label {
      width: 150px;
    }
    /deep/.img-wrapper {
      padding: 0;
    }
  }
  .itemList::after {
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
}
</style>
