<template>
  <div id="programmeWrap">
    <el-form ref="programme" :model="Form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="分类名称:" prop="title" class="source">
            <el-input style="width:40%;" v-model.trim="Form.title" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入分类名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="分类排序:" prop="sort" class="source">
            <el-input style="width:40%;" v-model="Form.sort" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入分类排序"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否显示" prop="is_show">
            <el-radio-group v-model="Form.is_show">
              <el-radio :label=1>是</el-radio>
              <el-radio :label=0>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="详情里的配图:" :prop="'detail_images'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}">
            <uploadImg :imgUrl="Form.detail_images" :fileName="'detail_images'" @uploadSuccess="uploadDetailImg" @removeImg="removeDetailImg" ></uploadImg>
            <el-input class="left" type="hidden" v-model="Form.detail_images"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="描述:" prop="description" class="source">
            <el-input type="textarea" rows="5" v-model="Form.description" style="width:60%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="配图:" :prop="'images'" :rules="{ required: false, message: '请选择图片', trigger: 'change'}">
            <uploadImg :imgUrl="Form.images" :fileName="'images'" @uploadSuccess="uploadImgChart" @removeImg="removeImgChart" ></uploadImg>
            <el-input class="left" type="hidden" v-model="Form.images"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 修身法宝 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="修身法宝" style="width:80%;"><span readonly style="color:red"></span><br/>
            <div id="soupWrap">
              <div class="Recommend">
                <el-button-group>
                  <el-button type="default" size="small" @click="addInformation" icon="el-icon-plus" style="margin-bottom: 10px;">添加商品</el-button>
                </el-button-group>
                <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="pruductsColumns" @on-custom-comp="customCompFuncProduct"
                :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
              </div>
              <el-dialog title="请选择需要推荐的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
                <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
              </el-dialog>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 坐堂医生 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="坐堂医生" style="width:80%;"><span readonly style="color:red"></span><br/>
            <div id="soupWrap">
              <div class="Recommend">
                <el-button-group>
                  <el-tag
                    :key="tag"
                    v-for="tag in tags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    class="tag">
                    {{tag}}
                  </el-tag>
                  <el-button type="default" size="small" @click="addDoctor" icon="el-icon-setting" class="doctor">设置</el-button>
                </el-button-group>
              </div>
              <el-dialog title="请选择需要的坐堂医生" :visible.sync="doctorShow" :modal-append-to-body="false" width="80%" center>
                <iframe :src="doctorUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
              </el-dialog>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="footer">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
          <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 推荐资讯 -->
    <el-dialog title="请选择需要推荐的资讯" :visible.sync="newsShow" :modal-append-to-body="false" width="80%" center>
      <iframe :src="informationUrl" frameborder="1" style="width:100%;height:600px;"></iframe>
    </el-dialog>
    <!-- 推荐资讯 -->
    <el-dialog title="请选择替换的商品" :visible.sync="productOneShow" :modal-append-to-body="false" width="80%" center>
      <iframe :src="productOne" frameborder="2" style="width:100%;height:600px;"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
import uploadImg from '@/components/upload/uploadImg';
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
      productData: [],
      Form: {
        title: '',
        sort: '',
        is_show: '',
        description: '',  // 描述
        images: '',     // 配图
        detail_images: '',   // 详情里的配图
        test_description: '',  //  测一测描述
        test_link: '',  // 测一测链接
        test_operate: '',  // 测一测操作
        doctor: '',   // 坐堂医生
        sectionproductdto: [],  // 修身法宝
      },
      productShow: false,
      ProductsUrl: `${process.env.WEB_HOST}/cardManage/productComponent?limit=10&index=`,
      newsShow: false,
      informationUrl: `${process.env.WEB_HOST}/cardManage/newInformationComponent?limit=1&index=`,
      doctorShow: false,
      doctorUrl: `${process.env.WEB_HOST}/cardManage/doctorManageComponent?limit=10&index=`,
      productOne: `${process.env.WEB_HOST}/cardManage/productOne`,
      tags: [],
      rules: {
        title: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
        is_show: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
        sort: [
          { required: true, validator: validateSort, trigger: 'blur' },
        ],
        test_link: [{ required: false, message: '请输入链接地址', trigger: 'blur' },
          { type: 'url', message: '请输入正确的链接地址', trigger: 'blur' }],
      },
      screenInfo: {
        PageIndex: 1,
        PageSize: 10,
      },
      introduceIndex: '',
      productOneShow: false,
      proIndex: '',
      tip: '',
    };
  },
  components: {
    'uploadImg': uploadImg,
  },
  props: {
    'addTalkHall': Boolean
  },
  computed: {
    pruductsColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '排序', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'product_name', title: '药品名称', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'news_title', title: '药品介绍', width: 260, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 230, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-setPresent', isResize: true }
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
      }
      return columns;
    },
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    resetForm() {
      this.$refs['programme'].resetFields();
      this.Form.doctor = '';
      this.tags = [];
      this.productData = [];
      this.Form.sectionproductdto = [];
    },
    // 上传图
    uploadImgChart(data, imgUrl) {
      this.Form.images = imgUrl;
    },
    // 删除图
    removeImgChart(url) {
      this.Form.images = url;
    },
    // 上传详情里的配图
    uploadDetailImg(data, imgUrl) {
      this.Form.detail_images = imgUrl;
    },
    // 删除详情配图
    removeDetailImg(url) {
      this.Form.detail_images = url;
    },
    addInformation() {
      this.productShow = true;
    },
    // 操作修身法宝列表
    customCompFuncProduct(params) {
      let _self = this;
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.productData.splice(params.index, 1);
          this.Form.sectionproductdto = this.productData;
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
      else if (params.type === 'setPrevent') {
        _self.newsShow = true;
        _self.introduceIndex = params.index;
      } else if (params.type === 'replace') {
        _self.productOneShow = true;
        _self.proIndex = params.index;
      }
    },
    // 获取详情
    getDetail() {
      let _self = this;
      ajax.get(`/api/news/GetPostSectionInfoByid?id=` + _self.$route.query.id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.Form = res.data.data;
          if (_self.Form.doctor) {
            ajax.get(`/api/news/GetPostUserRoleInfoByid?id=` + _self.Form.doctor).then((res) => {
              if (res.status === 200 && res.data.code === 0) {
                if (res.data.data) {
                  _self.tags = res.data.data.role_type_name.split(',');
                }
              }
            });
          }
          if (_self.Form.is_show === true) {
            _self.Form.is_show = 1;
          } else {
            _self.Form.is_show = 0;
          }
          if (_self.Form.test_operate === '0') {
            _self.Form.test_operate = 0;
          } else {
            _self.Form.test_operate = 1;
          }
          if (_self.Form.sectionproductdto.length !== 0) {
            _self.productData = _self.Form.sectionproductdto;
          }
        }
      });
    },
    // 提交
    submitForm() {
      let _self = this;
      let param = _self.Form;
      _self.$refs['programme'].validate((valid) => {
        if (valid) {
          let url;
          if (_self.addTalkHall) {
            url = `/api/news/CreatePostSectionInfo`;
          } else {
            url = `/api/news/UpdatePostSectionInfo`;
          }
          ajax.post(url, param).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功'
              });
              // 关闭当前也并跳转列表页
              let currentName = _self.$route.name;
              let currentTab = _self.visitedViews.find((x) => x.name === currentName);
              _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                let query = _self.$route.query;
                query.from = _self.$route.name;
                if (query.id) {
                  delete query.id;
                }
                _self.$router.push({
                  path: '/cardManage/talkHall/talkList',
                });
              });
            }
          });
        }
        else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    // 选择推荐商品
    setSelectedList(data, productNum, sellerUserId) {
      let _self = this;
      let pro_Id = _self.productData.map(function(item, index, data) {
        return Number(item.product_id);
      });
      if (data.length !== 0 && sellerUserId) {
        let data_Id = data.map(function(item, index, data) {
          return Number(item.productId);
        });
        for (let i in data_Id) {
          if (pro_Id.indexOf(data_Id[i]) === -1) {
            _self.tip = 1;
          }
          else {
            _self.tip = 0;
          }
        }
        if (productNum === true && _self.tip === 1) {
          let xsfb_arr = data.map(function(item, index, data) {
            return {
              product_id: item.productId,
              product_name: item.productName,
              product_pic: item.productMainImage,
              product_price: item.productMarkprice,
              news_title: '',
              getByself: item.getByself,
              getFast: item.getFast,
              getCommon: item.getCommon,
              transnational: item.transnational,
            };
          });
          _self.productData = [...xsfb_arr, ..._self.productData];
          _self.Form.sectionproductdto = _self.productData;
          _self.productShow = false;
        } else if (_self.tip !== 1) {
          _self.$message({
            message: '选中的商品在列表已存在，请重新选择',
            type: 'warning'
          });
        }
      } else if (data === false) {
        _self.productShow = false;
      } else if (!sellerUserId) {
        _self.$message({
          message: '请选择药店来源',
          type: 'warning'
        });
      } else if (data.length === 0) {
        _self.$message({
          message: '请选择需要推荐的商品',
          type: 'warning'
        });
      }
    },
    // 替换商品
    oneProduct(data) {
      let _self = this;
      if (data) {
        let pro_Id = _self.productData.map(function(item, index, data) {
          return Number(item.product_id);
        });
        if (pro_Id.indexOf(data.productId) === -1) {
          let oneData = {
            product_id: data.productId,
            product_name: data.productName,
            product_pic: data.productMainImage,
            product_price: data.productMarkprice,
            news_title: '',
            getByself: data.getByself,
            getFast: data.getFast,
            getCommon: data.getCommon,
            transnational: data.transnational,
          };
          _self.Form.sectionproductdto.splice(_self.Form.sectionproductdto[_self.proIndex], 1, oneData);
          _self.productOneShow = false;
        } else {
          _self.$message({
            message: '该商品已存在列表，请重新选择',
            type: 'warning'
          });
        }
      }
    },
    // 选择介绍资讯
    selectNewList(data, proudctNum) {
      let _self = this;
      if (data.length === 1 && proudctNum === true && data[0].statusflag === 2) {
        _self.productData[_self.introduceIndex].news_title = data[0].title;
        _self.productData[_self.introduceIndex].news_id = data[0].id;
        _self.Form.sectionproductdto[_self.introduceIndex] = _self.productData[_self.introduceIndex];
        _self.newsShow = false;
      } else if (data === false) {
        _self.newsShow = false;
      } else if (data.length === 0) {
        _self.$message({
          type: 'warning',
          message: '请选择资讯',
        });
      } else if (data[0].statusflag !== 2) {
        _self.$message({
          type: 'warning',
          message: '请选择已通过核审状态的资讯',
        });
      } else {
        _self.$message({
          type: 'warning',
          message: '该资讯只能选择一个，请重试',
        });
      }
    },
    // 添加医生
    addDoctor() {
      this.doctorShow = true;
    },
    // 删除坐堂医生
    handleClose(tag) {
      let _self = this;
      _self.tags.splice(_self.tags.indexOf(tag), 1);
      _self.Form.doctor = '';
    },
    // 选择医生
    doctorList(data) {
      let _self = this;
      if (data) {
        if (_self.tags.indexOf(data.role_type_name) === -1) {
          let name = data.role_type_name;
          _self.tags = name.split(',');
          _self.Form.doctor = data.role_id;
          _self.$message({
            message: '操作成功',
            type: 'success'
          });
          _self.doctorShow = false;
        } else {
          _self.$message({
            message: '该医生已被选择，请重新选择',
            type: 'warning'
          });
        }
      }
    },
  },
  created() {
    window.setSelectedList = this.setSelectedList;
    window.selectNewList = this.selectNewList;
    window.oneProduct = this.oneProduct;
    window.doctorList = this.doctorList;
    if (!this.addTalkHall) {
      this.getDetail();
    }
  },
};
</script>

<style lang="less" scoped>
.footer{
  text-align: center;
  margin-left: -100px;
  margin-bottom: 50px;
}
.testWrap{
  width: 80%;
  padding: 15px;
  color: #333;
  .test{
    height: 30px;
    line-height: 30px;
    font-size: 18px;
  }
}
.tag{
  margin: 0 10px;
}
.Recommend{
  .doctor{
    margin-top: 4px;
  }
}
.tips{
  margin: 0 0 0 10px;
  color: red;
}
</style>
