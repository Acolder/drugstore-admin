<template>
  <div class="edit">
    <div class="toolbar-wrapper">
      <el-form :inline="true" :model="editData" :rules="rules" ref="editValidateForm" label-width="120px" size="small">
         <el-row>
          <el-col :span="24">
            <el-form-item label="广告名称：" prop="title" >
              <el-input style="width: 300px;" v-model="editData.title" maxlength="20" placeholder="请输入广告名称" clearable></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="广告类型：" prop="bannercategory">
              <el-select v-model="editData.bannercategory" placeholder="请选择广告类型"  @change="categoryActive" style="width: 300px;">
                <el-option label="启动页广告" :value="7"></el-option>
                <el-option label="首页广告" :value="11"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         </el-row>
          <el-col :span="24">
            <el-form-item label="广告主图：" prop="picturepath">
              <!-- <uploadSingleImg :imgUrl="editData.picturepath" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
              <el-input class="left" type="hidden" v-model="editData.picturepath"></el-input> -->
              <uploadSingleImg :imgUrl="editData.picturepath" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
              <el-input class="left" type="hidden" v-model="editData.picturepath"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="广告排序：" prop="sort">
              <el-input  maxlength="5" v-model.number="editData.sort" placeholder="请输入广告排序" clearable style="width: 300px;"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="广告时间(s):" prop="displaytime">
              <el-input  maxlength="5" v-model.number="editData.displaytime" placeholder="请输入广告时间" clearable style="width: 300px;"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="发布时间:" prop="publishdate">
              <el-date-picker
                v-model="editData.publishdate"
                type="datetime"
                placeholder="选择发布时间"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="过期时间:" prop="displaydate">
              <el-date-picker
                v-model="editData.displaydate"
                type="datetime"
                placeholder="选择过期时间"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="版本号:" prop="version">
              <el-input v-model="editData.version" placeholder="请输入版本号（例：v1.0）" clearable style="width: 300px;"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="是否推送:" prop="sendmessage">
              <el-radio v-model="editData.sendmessage" :label="0">否</el-radio>
              <el-radio v-model="editData.sendmessage" :label="1">是</el-radio>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="广告跳转：" prop="category">
              <el-select v-model="editData.category" placeholder="请选择广告跳转"  @change="categoryActive" style="width: 300px;">
                <el-option label="URL" value="1"></el-option>
                <el-option label="商品" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24" v-if="editData.category === '1'">
            <div class="link">
              <p class="title">图片链接地址</p>
              <div class="content">
                <el-form-item label="链接地址：" prop="pictureurl">
                  <el-input v-model.number.trim="editData.pictureurl" placeholder="请输入链接地址" clearable style="width: 400%"></el-input>
                </el-form-item>
              </div>
            </div>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24" v-if="editData.category === '2'">
            <div class="mall">
              <p class="title">商品信息</p>
              <div class="content">
                <el-button icon="el-icon-plus" class="addMall" @click="productShow = true">新增商品</el-button>
                <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData"
                row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
              </div>
              <!-- <el-form-item label="" prop="product.productId" :rules="{
                    required: true, message: '请选择商品', trigger: 'blur'
                  }">
              </el-form-item> -->
            </div>
          </el-col>
         </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item class="form-button-wrapper">
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="commit">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-dialog title="请选择新增的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
        <iframe :src="outSelectedInfoUrl" class="" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import ajax from '@/utils/ajax';
// import JAVAajax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      columns: this.Columns(),
      // category: [],
      editData: {
        title: '',
        picturepath: '',
        bannercategory: '',
        ticturepath: '',
        Version: '',
        sort: '',
        displaytime: '',
        displaydate: '',
        sendmessage: 0,
        category: '', // 分类 1.url 2.商品
        pictureUrl: '',
        product: {
          productId: '',
          getCommon: '1',
          getByself: '',
          getFast: '',
          transnational: '',
        }
      },
      productShow: false,
      tableData: [],
      outSelectedInfoUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1`,
      // tidList: [],
      rules: {
        title: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
        picturepath: [{ required: true, message: '请选择广告主图', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入广告排序', trigger: 'change' }, { type: 'number', message: '排序必须为数字值' }],
        displaytime: [{ required: true, message: '请输入广告时间', trigger: 'change' }, { type: 'number', message: '时间必须为数字值' }],
        category: [{ required: true, message: '请选择广告跳转类型', trigger: 'change' }],
        displaydate: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
        publishdate: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        bannercategory: [{ required: true, message: '请选择广告类型', trigger: 'change' }],
      },
      // ProiD: '',
    };
  },
  props: {
    isAdd: Boolean
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  methods: {
    Columns() {
      // let _self = this;
      let columns = [
        { field: 'productId', title: '商品ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '商品图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMarkprice', title: '商品市场价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData ? rowData[field] : '';
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'productMainImage') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            // let value2 = rowData['productmainimage'];
            let value = rowData ? rowData[field] : '';
            let value2 = rowData ? rowData['productmainimage'] : '';
            // console.log(value2);
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else if (value2) {
              return `<a href="javascript:previewImg('${value2}');"><img src="${value2}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'productId') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            // let value2 = rowData['productid'];
            let value = rowData ? rowData[field] : '';
            let value2 = rowData ? rowData['productid'] : '';
            if (value) {
              return value;
            } else {
              return value2;
            }
          };
        }
        if (item.field === 'productName') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            // let value2 = rowData['productname'];
            let value = rowData ? rowData[field] : '';
            let value2 = rowData ? rowData['productname'] : '';
            if (value) {
              return value;
            } else {
              return value2;
            }
          };
        }
        if (item.field === 'productMarkprice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            // let value2 = rowData['productmarkprice'];
            let value = rowData ? rowData[field] : '';
            let value2 = rowData ? rowData['productmarkprice'] : '';
            if (value) {
              return value;
            } else {
              return value2;
            }
          };
        }
      }
      return columns;
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // 上传广告主图
    uploadMianImg(data) {
      this.editData.picturepath = data.url;
    },
    // 删除广告主图
    removeMainImg(e) {
      this.editData.picturepath = '';
      console.log(this.editData.picturepath);
    },
    // 重置
    resetForm() {
      this.$refs['editValidateForm'].resetFields();
      this.tableData = [];
      this.editData.Product.productId = '';
    },
    // 提交
    commit() {
      this.$refs['editValidateForm'].validate((valid) => {
        if (valid) {
          // this.addData.StartTime = this.addData.StartTime[0];
          // this.addData.ValidTime = this.addData.StartTime[1];
          this.submitData();
        } else {
          return false;
        }
      });
    },
    submitData() {
      let _self = this;
      let a = {};
      // this.editData.validtime = this.editData.starttime[1];
      // this.editData.starttime = this.editData.starttime[0];
      // console.log(this.editData.ValidTime);
      if (_self.editData.category === '1') {
        a = {
          // Id: _self.editData.id,
          title: _self.editData.title,
          bannercategory: _self.editData.bannercategory,
          picturepath: _self.editData.picturepath,
          Version: _self.editData.version,
          Sort: _self.editData.sort,
          displaytime: _self.editData.displaytime,
          displaydate: _self.editData.displaydate,
          publishdate: _self.editData.publishdate,
          category: _self.editData.category, // 分类 1.url 2.商品
          pictureurl: _self.editData.pictureurl,
          sendmessage: _self.editData.sendmessage
        };
        if (!_self.isAdd) {
          a.id = _self.editData.id;
        }
        ajax.post('/api/admin/saveAdvertisement', a).then(res => {
          if (res.status === 200 && res.data.code === 0) {
            _self.$message({
              message: res.data.message,
              type: 'success'
            });
            _self.$router.push('/advertisements/index');
            // _self.$router.go(-1);
          }
        });
      } else {
        // a = _self.editData;
        a = {
          // Id: _self.editData.id,
          title: _self.editData.title,
          bannercategory: _self.editData.bannercategory,
          picturepath: _self.editData.picturepath,
          Version: _self.editData.version,
          Sort: _self.editData.sort,
          displaytime: _self.editData.displaytime,
          displaydate: _self.editData.displaydate,
          publishdate: _self.editData.publishdate,
          category: _self.editData.category, // 分类 1.url 2.商品
          sendmessage: _self.editData.sendmessage,
          product: {
            productid: _self.editData.product.productId,
            getcommon: _self.editData.product.getCommon,
            getByself: _self.editData.product.getByself,
            getFast: _self.editData.product.getFast,
            transnational: _self.editData.product.transnational,
          }
        };
        if (_self.editData.product.productid !== '') {
          if (!_self.isAdd) {
            a.id = _self.editData.id;
          }
          ajax.post('/api/admin/saveAdvertisement', a).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
              _self.$router.push('/advertisements/index');
              // _self.$router.go(-1);
            }
          });
        } else {
          _self.$message({
            message: '请选择商品',
            type: 'error'
          });
        }
      }
    },
    setSelectedList(data, productNum) {
      if (data.length !== 0 && productNum) {
        this.productShow = false;
        this.tableData = data;
        this.editData.product = data[0];
      } else if (!data || data.length === 0) {
        this.productShow = false;
      } else {
        this.$message({
          message: '只能选1个',
          type: 'error'
        });
      }
    },
    categoryActive() {
      // console.log(data);
      if (this.editData.category === '1') {
        this.editData.pictureurl = '';
      }
      if (this.editData.category === '2') {
        this.tableData = [];
        this.editData.product = {};
      }
    },
    /* 获取分类
      // getCategory() {
      //   let _self = this;
      //   JAVAajax.get(`/mall_manage/back/category/getAsTree`).then((res) => {
      //     console.log(res);
      //     if (res.status === 200 && res.data.resultCode === '0') {
      //       _self.category = res.data.resultData;
      //     }
      //   });
      // },
    */
    // 获取详情
    getDeail(id) {
      let _self = this;
      ajax.get('/api/admin/getHomeBannerDetail/' + id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.editData = res.data.data;
          _self.editData.displaytime = Number(_self.editData.displaytime);
          if (!_self.editData.product) {
            _self.editData.product = {
              productId: '',
              getCommon: '1',
              getByself: '',
              getFast: '',
              transnational: '',
            };
          }
          this.tableData.push(_self.editData.product);
          // this.tableData = [_self.editData.product];
        }
      });
    },
    // 广告主题
    // getTid() {
    //   let _self = this;
    //   yilinAjax.get('/api/adsmanage/getdoctopiclist').then(res => {
    //     console.log(res);
    //     if (res.status === 200 && res.data.code === 0) {
    //       _self.tidList = res.data.data;
    //       console.log(_self.tidList);
    //     }
    //   });
    // }
  },
  created() {
    window.setSelectedList = this.setSelectedList;
    window.previewImg = this.previewImg;
    // this.getCategory();
    if (!this.isAdd) {
      this.getDeail(this.$route.query.id);
    }
    // console.log(JSON.parse(this.$route.query.info));
    // this.addData = JSON.parse(this.$route.query.info);
    // this.getTid();
    // this.getAddData();
  }
};
</script>

<style lang="less" scoped>
.link{
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #cacaca;
  padding: 10px;
  margin-left: 26px;
  .title {
    margin: 15px 0 10px;
    font-size: 18px;
  }
  .content{
    border: 1px solid #cacaca;
    padding: 20px 0 5px;
  }
}
.form-button-wrapper{
  margin: 50px auto;
  display: flex;
  justify-content: center;
}
.mall{
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #cacaca;
  padding: 10px;
  margin-left: 26px;
  /deep/.el-form-item__error{
    width: 100px;
  }
  .title {
    margin: 15px 0 10px;
    font-size: 18px;
  }
  .content{
    border: 1px solid #cacaca;
    padding: 20px 10px;
    .addMall{
      margin-bottom: 10px;
    }
  }
}
</style>
