<template>
  <div id="miniCicleSchemeInfo">
    <!-- 编辑方案 -->
    <el-form :model="SchemeDeatail" ref="schemeForm" size="small" label-width="140px">
      <el-form-item label="检测结果" label-width="140px" prop="processresult"
                    :rules="{required: true, message: '请输入检测结果', trigger: 'blur'}"
      >
        <el-input v-model="SchemeDeatail.processresult" placeholder="请输入检测结果"></el-input>
      </el-form-item>
      <el-form-item label="方案配图" label-width="140px" prop="picurl"
                    :rules="{required: true, message: '请上传方案配图', trigger: 'blur'}"
      >
        <uploadSingleImg :imgUrl="SchemeDeatail.picurl" :fileName="'Image'" @uploadSuccess="addDatauploadImg"
                         @removeImg="addDataremoveImg"></uploadSingleImg>
        <el-input class="left" type="hidden" v-model="SchemeDeatail.picurl"></el-input>
      </el-form-item>
      <el-form-item label="症状判断" label-width="140px">
        <el-input type="textarea" :rows="4" v-model="SchemeDeatail.symptom" clearable></el-input>
      </el-form-item>
      <el-form-item label="生活运动建议" label-width="140px">
        <el-input type="textarea" :rows="4" v-model="SchemeDeatail.lifeproposal" clearable></el-input>
      </el-form-item>
      <!--调养商品推荐-->
      <el-form-item label="调养商品推荐" label-width="140px">
        <div id="RecommendWrapper">
          <div class="Recommend">
            <el-button-group>
              <el-button type="default" size="small" @click="addProduct" icon="el-icon-plus"
                         style="margin-bottom: 10px;">添加商品
              </el-button>
              <el-button type="default" size="small" @click="cleanpro" icon="el-icon-delete" style="margin-left: 15px;">
                清空商品列表
              </el-button>
            </el-button-group>
            <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:100%"
                     :columns="pruductsColumns" @on-custom-comp="customCompFuncProduct"
                     :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
          <el-dialog title="请选择需要推荐的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center>
            <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="问医就诊建议" label-width="140px">
        <el-input type="textarea" :rows="4" v-model="SchemeDeatail.askingadvice" clearable></el-input>
      </el-form-item>
      <!--健康资讯推荐-->
      <el-form-item label="健康资讯推荐">
        <div id="RecommendWrapper">
          <div class="Recommend">
            <el-button-group>
              <el-button type="default" size="small" @click="addinformation" icon="el-icon-plus"
                         style="margin-bottom: 10px;">添加资讯
              </el-button>
              <el-button type="default" size="small" @click="cleanNews" icon="el-icon-delete"
                         style="margin-left: 15px;">清空资讯列表
              </el-button>
            </el-button-group>
            <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:100%"
                     :columns="subColumns" @on-custom-comp="customCompFuncNews"
                     :table-data="subTableData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
          <el-dialog title="请选择需要推荐的资讯" :visible.sync="newsShow" :modal-append-to-body="false" width="80%" center>
            <iframe :src="NewListURL" frameborder="0" style="width:100%;height:600px;"></iframe>
          </el-dialog>
        </div>
      </el-form-item>
      <!--保存-->
      <div class="dialog-footer" style="text-align: center">
        <el-button size="small" type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
import uploadSingleImg from '@/components/upload/uploadImg';
import { formatDate } from '@/utils/date.js';
export default {
  props: {
    'scheme': Object
  },
  data() {
    return {
      SchemeDeatail: {
        askingadvice: 'infoinit',
        create_time: '2018-11-13 20:47:23',
        health_information: 'init',
        id: '5beac051f865d421b3645a68',
        lifeproposal: 'init',
        picurl: 'https://uploads.kangmei.com.cn/Files/20181113/u1zdvpf3.4ux.jpg',
        processresult: 'infoinit',
        recommendedproduct: '1',
        symptom: 'infoinit'
      },
      rules: {
        processresult: [{ required: true, message: '请输入最晚用药时间', trigger: 'change' }],
      },
      // 推荐商品
      form: {
        productList: [], // 商品列表
        RecommendList: [],  // 推荐资讯
      },
      productShow: false,
      newsShow: false,
      subTableData: [],
      productData: [],
      pruductsColumns: this.getProColumns(),
      subColumns: this.getSubColumns(),
      ProductsUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
      NewListURL: `${process.env.WEB_HOST}/manage/outNewList`,
    };
  },
  computed: {},
  components: {
    'uploadSingleImg': uploadSingleImg,
  },
  mounted() {
    console.info('----------------------------------------------------------------------------------------page init');
  },
  methods: {
    // 重置
    resetForm() {
      this.$refs['schemeForm'].resetFields();
    },
    getDetail(id) {
      ajax.get('/api/Microcirculation/GetMicrocirculationDetectionById?id=' + id).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.SchemeDeatail = res.data.data;
          this.subTableData = [];
          this.form.RecommendList = [];
          this.productData = [];
          this.form.productList = [];
          if (res.data.data.detectionhealthnewsdto && res.data.data.detectionhealthnewsdto.length > 0) {
            this.subTableData = res.data.data.detectionhealthnewsdto;
            this.form.RecommendList = res.data.data.detectionhealthnewsdto;
          }
          if (res.data.data.detectionhealthrecoutputdto && res.data.data.detectionhealthrecoutputdto.length > 0) {
            this.productData = res.data.data.detectionhealthrecoutputdto;
            this.form.productList = res.data.data.detectionhealthrecoutputdto;
          }
        }
      });
    },
    submitForm() {
      // 验证信息
      this.$refs['schemeForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: '验证通过',
            type: 'success'
          });
        } else {
          this.$message({
            message: '请填写带*号的必填项',
            type: 'info'
          });
          return false;
        }
      });
      // 1.存储推荐商品id
      let productList = [];
      if (this.form.productList.length > 0) {
        productList = this.form.productList.map((item) => {
          return item.product_id;
        });
      }
      this.SchemeDeatail.recommendedproduct = productList.join(',');
      // 2.存储推荐资讯id
      let RecommendList = [];
      if (this.form.RecommendList.length > 0) {
        RecommendList = this.form.RecommendList.map((item) => {
          return item.id;
        });
      }
      this.SchemeDeatail.health_information = RecommendList.join(',');
      this.SchemeDeatail.Docmicrocirculationdetectionhealthrecommand = this.form.productList;
      this.saveSchemeDetail();
    },
    saveSchemeDetail() {
      let _this = this;
      ajax.post('/api/Microcirculation/UpdateMicrocirculationDetection', this.SchemeDeatail).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          _this.$emit('on-save-sucess');
          setTimeout(() => {
            _this.$message({
              type: 'success',
              message: '保存成功'
            });
          });
          _this.resetForm();
        }
      });
    },
    btnConfirm() {
      this.dialogShow = false;
    },
    //  上传图片
    addDatauploadImg(data) {
      this.SchemeDeatail.picurl = data.url;
    },
    //  删除图片
    addDataremoveImg() {
      this.SchemeDeatail.picurl = '';
    },
    // 添加商品
    addProduct() {
      this.productShow = true;
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
        // console.log(params.index);
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
    // 商品Columns
    getProColumns() {
      let columns = [
        {
          field: 'product_id',
          title: '商品ID',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'product_name',
          title: '商品名',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'recommand_img',
          title: '商品图片',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'operation',
          title: '操作',
          width: 250,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'newsinfo-delete-operations',
          isResize: true
        }
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
        if (item.field === 'recommand_img') {
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
      // console.log(data);
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
          recommand_img: data[0].productMainImage,
          recommand_name: data[0].product_name,
          product_type: 1,
          product_tag: data[0].remarks,
          product_brief: data[0].description,
        };
        _self.productData.push(source);
        _self.form.productList = _self.productData;
        // console.log(_self.form.productList);
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
    // 添加资讯
    addinformation() {
      this.newsShow = true;
    },
    // 资讯Columns
    getSubColumns() {
      let columns = [
        {
          field: 'id',
          title: '资讯ID',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'title',
          title: '资讯标题',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'release_time',
          title: '发布时间',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'operation',
          title: '操作',
          width: 250,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operations-listDelete',
          isResize: true
        }
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
        if (item.field === 'release_time') {
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
      let source = {
        id: data.id,
        title: data.title,
        release_time: data.releasetime,
      };
      _self.subTableData.push(source);
      _self.form.RecommendList = _self.subTableData;
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
          // console.log(params.index);
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
  },
  created() {
    window.selectNewList = this.selectNewList;
    window.setSelectedList = this.setSelectedList;
  },
  watch: {
    scheme: function (newVal, oldVal) {
      this.SchemeDeatail = newVal;
    }
  }
};
</script>

