<template>
  <div class="drug-info">
    <div class="option-wrapper">
      <el-button size="small" type="danger" icon="el-icon-more" @click="selectDialog">选择采集药品填充</el-button>
    </div>
    <el-form ref="form_data" :model="form" :rules="rules" label-width="100px" size="small">
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="form.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品分类" prop="categoryCode">
            <el-select v-model="form.categoryCode" placeholder="请选择商品分类" style="width:100%;">
              <el-option v-for="item in category" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="医生分类">
            <el-select v-model="form.parentCategoryDoctors" placeholder="请选择" clearable>
              <el-option label="中成药" :value=2></el-option>
              <el-option label="西药" :value=3></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label-width="0px" prop="categoryDoctors" class="doctor-category">
            <el-select v-model="form.categoryDoctors" placeholder="请选择商品分类">
              <el-option v-for="item in doctorCategory" :key="item.categoryDoctors" :label="item.categoryName" :value="item.categoryDoctors.toString()"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品sku" prop="productSku">
            <el-input v-model="form.productSku"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品标题" prop="productSubtitle">
            <el-input v-model="form.productSubtitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品主图" prop="productMainImage">
            <uploadImg :imgUrl="form.productMainImage" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg" :isMark="true"></uploadImg>
            <el-input class="left" type="hidden" v-model="form.productMainImage"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品子图" prop="productSubImages">
            <uploadImg :limit=15 :imgUrl="form.productSubImages" :fileName="'subImage'" @uploadSuccess="uploadSubImg" @removeImg="removeSubImg" :isMark="true"></uploadImg>
            <el-input class="left" type="hidden" v-model="form.productSubImages"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="计量单位" prop="productUnit">
            <el-input v-model="form.productUnit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条形码" prop="productBarCode">
            <el-input v-model="form.productBarCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品市场价" prop="productMarkprice">
            <el-input v-model.number="form.productMarkprice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销量" prop="productSalesVolume">
            <el-input v-model.number="form.productSalesVolume"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="批准文号" prop="productApprovalNumber">
            <el-input v-model="form.productApprovalNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="剂型" prop="productDosageForm">
            <el-input v-model="form.productDosageForm"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="储藏条件" prop="productStorageConditions">
            <el-input v-model="form.productStorageConditions"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性状" prop="productCharacter">
            <el-input v-model="form.productCharacter"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="验收标准" prop="productAcceptanceCriteria">
            <el-input v-model="form.productAcceptanceCriteria"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标准规格" prop="productSpecification">
            <el-input v-model="form.productSpecification"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生产厂商" prop="productProducingPlace">
            <el-input v-model="form.productProducingPlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原产地" prop="productOriginPlace">
            <el-input v-model="form.productOriginPlace"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="产品类型" prop="isOtc">
            <el-select v-model="form.isOtc" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in productTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="切制规格" prop="productCutSpecification">
            <el-input v-model="form.productCutSpecification"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="炮制规格" prop="productPrepareSpecification">
            <el-input v-model="form.productPrepareSpecification"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="药品成分" prop="pharmaceuticalIngredients">
            <el-select v-model="form.pharmaceuticalIngredients" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in productElements" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品描述" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品详情" prop="productDetail">
            <textarea id="productDetail" v-model="form.productDetail" style="display:none;"></textarea>
            <!-- <script id="productDetail_Ueditor" style="height:400px;width:100%;" type="text/plain"></script> -->
            <ueditor :id="'productDetail_ueditor'" ref="productDetail_ueditor"></ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="说明书" prop="instructions">
            <textarea id="instructions" v-model="form.instructions" style="display:none;"></textarea>
            <!-- <script id="instructions_ueditor" style="height:400px;width:100%;" type="text/plain"></script> -->
            <ueditor :id="'instructions_ueditor'" ref="instructions_ueditor"></ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="form.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="form-button-wrapper">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline">重置</el-button>
          <el-button @click="submitForm" icon="el-icon-check" type="primary">提交</el-button>
          <el-button @click="submitForm(true)" icon="el-icon-circle-check-outline" type="success">提交并上架</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog title="采集药品列表" width="80%" :modal="true" :visible.sync="selectDialogVisible" :modal-append-to-body="false" center>
      <iframe :src="outsideDrugListUrl" class="" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
    </el-dialog>
    <el-dialog title="选择替换表单字段" width="600px" :modal="true" :visible.sync="exchangeSelectDialogVisibale" @close="exchangeSelectDialogClose" :modal-append-to-body="false" center>
      <el-form>
        <el-row v-for="(item,index) in outsideDrugInfo" :key="index">
          <el-col :span="20">
            <el-form-item :label="item.mapField.title+':'" :label-width="'100px'" style=" margin-bottom:0;height:40px;overflow:hidden;">
              <el-row>
                <el-col :span="24">
                  {{item.value}}
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="4" style=" text-align:right;">
            <el-switch v-model="item.isSelected" style="margin-top:10px"></el-switch>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exchangeSelectDialogVisibale = false">取 消</el-button>
        <el-button @click="exchangeFormField" type="primary">替换已选择</el-button>
        <el-button @click="exchangeFormField(true)" type="success">替换所有</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.drug-info {
  /deep/.doctor-category .el-form-item__label {
    width: 110px !important;
  }
  .option-wrapper {
    padding: 10px;
    text-align: right;
  }
  .form-button-wrapper {
    height: 80px;
    text-align: center;
  }
}
</style>

<script>
import ajax from '@/utils/javaApiRequest';
import { mapGetters } from 'vuex';
import uploadImg from '@/components/upload/uploadImg';
import ueditor from '@/components/ueditor/editor';
export default {
  data() {
    return {
      instructions_editor: null,
      productDetail_editor: null,
      category: [],
      allDoctorCategory: [],
      doctorCategory: [],
      selectDialogVisible: false,
      exchangeSelectDialogVisibale: false,
      outsideDrugListUrl: `${process.env.WEB_HOST}/drug-control/outsideDrugList`,
      // 药品类型
      productTypeList: [
        { label: '甲类OTC', value: 1 },
        { label: '乙类OTC', value: 3 },
        { label: '处方', value: 2 },
        { label: '医疗器械类', value: 4 },
        { label: '保健食品', value: 5 },
        { label: '食品', value: 6 },
        { label: '消字号', value: 7 },
        { label: '妆字号', value: 8 },
        { label: '其他', value: 0 },
      ],
      // 药品成分
      productElements: [
        { label: '中成药', value: 1 },
        { label: '化学药', value: 2 },
        { label: '生物制剂', value: 3 },
        { label: '进口药品', value: 4 },
        { label: '中药饮片', value: 5 },
        { label: '其他', value: 0 },
      ],
      form: {
        // 商品名称
        productName: '',
        // 分类
        categoryCode: '',
        // 医生商品父分类
        parentCategoryDoctors: 3,
        // 医生商品分类
        categoryDoctors: '',
        // 商品sku
        productSku: '',
        // 商品主图
        productMainImage: '',
        // 商品子图
        productSubImages: '',
        // 商品标题
        productSubtitle: '',
        // 计量单位
        productUnit: '',
        // 条形码
        productBarCode: '',
        // 批准文号
        productApprovalNumber: '',
        // 剂型
        productDosageForm: '',
        // 储藏条件
        productStorageConditions: '',
        // 批注文号
        productAcceptanceCriteria: '',
        // 性状
        productCharacter: '',
        // 标准规格
        productSpecification: '',
        // 生产产地
        productProducingPlace: '',
        // 原产地
        productOriginPlace: '',
        // 商品市场价
        productMarkprice: 0,
        // 销量
        productSalesVolume: 0,
        //  详情
        productDetail: '',
        // 说明书
        instructions: '',
        // 商品描述
        description: '',
        // 0-其他药方  1-非处方  2-处方
        productType: '',
        isOtc: '',
        // 切制规格
        productCutSpecification: '',
        // 炮制规格
        productPrepareSpecification: '',
        // 药品成分
        pharmaceuticalIngredients: '',
        // 备注
        remarks: ''
      },
      rules: {
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        categoryCode: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        // categoryDoctors: [
        //   { required: true, message: '请选择医生商品分类', trigger: 'change' }
        // ],
        productSku: [
          { required: true, message: '请输入商品sku', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        /* productSubtitle: [
          { required: true, message: '请输入商品标题', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur'
          }
        ],
        productUnit: [
          { required: true, message: '请输入计量单位', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productBarCode: [
          { required: true, message: '请输入条形码', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        productApprovalNumber: [
          { required: true, message: '请输入批注文号', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        productDosageForm: [
          { required: true, message: '请输入剂型', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        productStorageConditions: [
          { required: true, message: '请输入储藏条件', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur'
          }
        ],
        productAcceptanceCriteria: [
          { required: true, message: '请输入验收标准', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        productCharacter: [
          { required: true, message: '请输入性状', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        productSpecification: [
          { required: true, message: '请输入标准规格', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        productProducingPlace: [
          { required: true, message: '请输入生产产地', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        productOriginPlace: [
          { required: true, message: '请输入原产地', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        productMarkprice: [
          { required: true, message: '请输入商品市场价', trigger: 'blur' },
          { type: 'number', message: '市场价必须为数字值' }
        ],
        productSalesVolume: [
          { required: true, message: '请输入商品销量', trigger: 'blur' },
          { type: 'number', message: '销量必须为数字值' }
        ],
                isOtc: [
          { required: true, message: '请选择是否处方药', trigger: 'blur' }
        ],
        productDetail: [
          { required: true, message: '请输入详情', trigger: 'blur' }
        ], */
        instructions: [
          { required: true, message: '请输入说明书', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      // 填充匹配字段信息
      mapFieldData: [
        {
          name: 'productname',
          mapField: {
            name: 'productName',
            title: '商品名称'
          },
        },
        {
          name: 'tongyongname',
          mapField: {
            name: 'productSubtitle',
            title: '商品副标题'
          }
        },
        {
          name: 'price',
          mapField: {
            name: 'productMarkprice',
            title: '商品市场价'
          }
        },
        {
          name: 'category',
          mapField: {
            name: 'categoryCode',
            title: '商品分类'
          }
        },
        {
          name: 'doctorCategory',
          mapField: {
            name: 'categoryDoctors',
            title: '医生商品分类'
          }
        },
        {
          name: 'mainimg',
          mapField: {
            name: 'productMainImage',
            title: '商品主图'
          },
        },
        {
          name: 'otherimg',
          mapField: {
            name: 'productSubImages',
            title: '商品子图'
          },
        },
        {
          name: 'shiyingzheng',
          mapField: {
            name: 'description',
            title: '商品描述'
          }
        },
        {
          name: 'picturedetails',
          mapField: {
            name: 'productDetail',
            title: '商品详情'
          },
        },
        {
          name: 'shuomingshu',
          mapField: {
            name: 'instructions',
            title: '说明书'
          },
        },
        {
          name: 'pizhunwenhao',
          mapField: {
            name: 'productApprovalNumber',
            title: '批准文号'
          },
        },
        {
          name: 'shengchanqiye',
          mapField: {
            name: 'productProducingPlace',
            title: '生产厂商'
          },
        },
        {
          name: 'jixing',
          mapField: {
            name: 'productDosageForm',
            title: '剂型'
          },
        },
        {
          name: 'guige',
          mapField: {
            name: 'productSpecification',
            title: '标准规格'
          },
        },
      ],
      // 从药品下载列表选择的药品信息
      outsideDrugInfo: []
    };
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  components: {
    'uploadImg': uploadImg,
    'ueditor': ueditor,
  },
  watch: {
    'form.parentCategoryDoctors': function (value, oldValue) {
      if (value) {
        this.doctorCategory = this.allDoctorCategory.filter(item => item.parentCode === value);
      } else {
        this.doctorCategory = this.allDoctorCategory;
      }
    },
    'form.categoryDoctors': function (value, oldValue) {
      if (value) {
        let item = this.allDoctorCategory.find((x) => {
          return x.categoryDoctors === parseInt(value, 10);
        });
        if (item) {
          this.$set(this.form, 'parentCategoryDoctors', item.parentCode);
        }
      }
    }
  },
  methods: {
    // 上传主图
    uploadMianImg(data, imgUrl) {
      this.form.productMainImage = imgUrl;
    },
    // 上传子图
    uploadSubImg(data, imgUrl) {
      this.form.productSubImages = imgUrl;
    },
    // 删除主图
    removeMainImg(url) {
      this.form.productMainImage = url;
    },
    // 删除子图
    removeSubImg(url) {
      this.form.productSubImages = url;
    },
    getCategory() {
      let _self = this;
      ajax.get(`/mall_manage/back/category/getAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.category = res.data.resultData;
        }
      });
    },
    // 获取医生商品分类
    getDoctorCategory() {
      let _self = this;
      ajax.get(`/mall_manage/back/category/getDoctorsAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.allDoctorCategory = res.data.resultData;
          if (_self.form.parentCategoryDoctors) {
            _self.doctorCategory = _self.allDoctorCategory.filter(item => item.parentCode === _self.form.parentCategoryDoctors);
          } else {
            _self.doctorCategory = _self.allDoctorCategory;
          }
        }
      });
    },
    submitForm(ischecked) {
      let _self = this;
      console.log(_self.productDetail_editor.getContent());
      let detail = _self.productDetail_editor.getContent();
      let instructions = _self.instructions_editor.getContent();
      _self.form.productDetail = detail;
      _self.form.instructions = instructions;
      _self.$refs['form_data'].validate(valid => {
        if (valid) {
          let url = '';
          let msg = '操作成功';
          if (_self.$route.name === 'addDrug') {
            _self.form.isChecked = 2;
            url = '/mall_manage/back/product/addProduct';
            msg = '新增成功';
          } else if (_self.$route.name === 'editDrug') {
            _self.form.productId = _self.$route.query.productId;
            url = '/mall_manage/back/product/updateProduct';
            msg = '修改成功';
          }
          if (url === '') {
            _self.$message.error('页面信息异常,请联系管理员');
            return;
          }
          if (ischecked === true) {
            _self.form.isChecked = 1;
          }
          let postdata = _self.form;
          let query = _self.$route.query;
          query.getByself = query.getByself;
          postdata.getFast = query.getFast;
          postdata.getCommon = query.getCommon;
          postdata.transnational = query.transnational;
          ajax.post(url, postdata).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                showClose: true,
                message: msg,
                type: 'success'
              });
              // 关闭当前也并跳转列表页
              console.log(_self.$route);
              let currentName = _self.$route.name;
              let currentTab = _self.visitedViews.find((x) => x.name === currentName);
              console.log(currentTab);
              _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                let query = _self.$route.query;
                query.from = _self.$route.name;
                if (query.productId) {
                  delete query.productId;
                }
                _self.$router.push({
                  path: '/drug-control/list',
                  query: query
                });
              });
            }
          });
        } else {
          _self.$alert('表单验证失败,请检查填写数据是否完整、有效', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['form_data'].resetFields();
      this.productDetail = '';
      this.productDetail_editor.setContent('');
      this.instructions = '';
      this.instructions_editor.setContent('');
    },
    getDrugData() {
      let _self = this;
      let query = _self.$route.query;
      let postData = {
        productId: query.productId,
        getByself: query.getByself,
        getFast: query.getFast,
        getCommon: query.getCommon,
        transnational: query.transnational,
      };

      ajax.post('/mall_manage/back/product/getProductById', postData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let drugData = res.data.resultData;
          for (let key in _self.form) {
            if (drugData.hasOwnProperty(key)) {
              _self.$set(_self.form, key, drugData[key]);
            }
          }
          if (_self.form.productDetail) {
            // setTimeout(() => {
            _self.productDetail_editor.setContent(_self.form.productDetail);
            // }, 2000);
          }
          if (_self.form.instructions) {
            // setTimeout(() => {
            _self.instructions_editor.setContent(_self.form.instructions);
            // }, 2000);
          }
        }
      });
    },
    selectDialog() {
      this.selectDialogVisible = true;
    },
    setDrugInfoFromDialogList(data) {
      let _self = this;
      /* eslint-disable */
      if (data) {
        for (let key in data) {
          let mapdata = _self.mapFieldData.find((x) => x.name === key);
          if (mapdata) {
            let value = data[mapdata.name];
            if (value) {
              mapdata.value = value;
              _self.outsideDrugInfo.push(mapdata);
            }
          }
        }
      } else {
        this.$message({
          showClose: true,
          message: '选择数据为空',
          type: 'error'
        });
      }
      this.selectDialogVisible = false;
      this.exchangeSelectDialogVisibale = true;
    },
    exchangeSelectDialogClose() {
      this.outsideDrugInfo = [];
    },
    // 替换表单字段值
    exchangeFormField(isAll) {
      let infoStr = '';
      let selectFieldCount = 0;
      for (let i = 0; i < this.outsideDrugInfo.length; i++) {
        let mapdata = this.outsideDrugInfo[i];
        let value = mapdata.value;
        if (isAll !== true && mapdata.isSelected !== true) {
          continue;
        }
        if (mapdata.name === 'category') {
          this.$notify({
            title: '参考信息',
            message: '商品分类:' + value,
            type: 'info',
            position: 'top-left',
            duration: 0
          });
          continue;
        }
        if (mapdata.name === 'price') {
          this.$notify({
            title: '参考信息',
            message: '商品市场价:' + value,
            type: 'info',
            position: 'top-left',
            duration: 0
          });
          continue;
        }
        selectFieldCount++;
        infoStr = infoStr + mapdata.mapField.title + '、';
        this.form[mapdata.mapField.name] = value;
        if (mapdata.mapField.name === 'productDetail') {
          this.productDetail_editor.setContent(value);
        }
        if (mapdata.mapField.name === 'instructions') {
          this.instructions_editor.setContent(value);
        }
      }
      if (selectFieldCount <= 0) {
        this.$alert('请选择要替换的字段', '提示');
      } else {
        infoStr = infoStr + '已替换！';
        this.$notify({
          title: '替换成功',
          message: infoStr,
          type: 'success',
          duration: 0
        });
        this.exchangeSelectDialogVisibale = false;
      }
    }
  },
  mounted() {
    this.instructions_editor = this.$refs.instructions_ueditor;
    this.productDetail_editor = this.$refs.productDetail_ueditor;
  },
  created() {
    this.getCategory();
    this.getDoctorCategory();
    if (this.$route.name === 'editDrug') {
      this.$set(this.form, 'categoryDoctors', null);
      this.getDrugData();
    }
    window.setDrugInfoFromDialogList = this.setDrugInfoFromDialogList;
  }
};
</script>
