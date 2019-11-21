<template>
  <div>
    <el-form ref="resultData" :model="Form" :rules="rules" label-width="100px" class="addRoles">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="体质结果" class="newsId" prop="name">
            <el-input style="width:40%" v-model.trim="Form.name" placeholder="请输入体质结果"
            display="inline-block" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="表现症状" prop="symptom" style="width:80%">
            <textarea id="symptom" v-model="Form.symptom" style="display:none;"></textarea>
            <ueditor :id="'symptom_ueditor'" ref="symptom_ueditor"></ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="调理建议：" prop="suggestion" style="width:80%">
            <textarea id="suggestion" v-model="Form.suggestion" style="display:none;"></textarea>
            <ueditor :id="'suggestion_ueditor'" ref="suggestion_ueditor"></ueditor>
          </el-form-item>
          </el-col>
      </el-row>
      <!-- 推荐汤品 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="推荐汤品" style="width:80%;"><span readonly style="color:red">添加汤品，请选择药店来源为汤品的药店</span><br/>
            <div id="soupWrap">
              <div class="Recommend">
                <el-button-group>
                  <el-button type="default" size="small" @click="addinformation" icon="el-icon-plus" style="margin-bottom: 10px;">添加汤品</el-button>
                  <el-button type="default" size="small" @click="cleanSoup" icon="el-icon-delete" style="margin-left: 15px;">清空汤品列表</el-button>
                </el-button-group>
                <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="pruductsColumns" @on-custom-comp="customCompFuncProduct"
                :table-data="soupTableData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
              </div>
              <el-dialog title="请选择需要推荐的汤品" :visible.sync="soupShow" :modal-append-to-body="false" width="80%" center>
                <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
              </el-dialog>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 推荐商品 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="推荐商品" style="width:80%;"><span readonly style="color:red">添加商品，请选择药店来源</span><br/>
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
      <!-- 饮食建议 -->
      <div class="diet">
        <span class="commonCss Suggest dietSuggest">饮食建议</span><br/>
        <table width="1228" border=1 cellspacing="0" align="center" class="tableList">
          <tr style="background-color:#f6f8f8">
            <td class="tdCommom" style="width:100px;">所属宜忌</td>
            <td class="tdCommom tdSuggest">建议</td>
            <td class="tdCommom tdSuggest">食材</td>
            <td class="tdCommom" style="width:300px;">操作</td>
          </tr>
          <tr>
            <td class="tdCommom" style="width:100px;">宜</td>
            <td class="tdSuggest">{{fitSuggest}}</td>
            <td class="tdCommom tdSuggest">{{foodFit}}</td>
            <td class="tdCommom" style="width:300px;">
              <el-button type="primary" plain size="small" icon="el-icon-edit" @click="editSuggest(1)">编辑</el-button>
              <el-button type="primary" plain size="small" icon="el-icon-plus" @click="foodManage(1)" >食材管理</el-button>
            </td>
          </tr>
          <tr>
            <td class="tdCommom" style="width:100px;">忌</td>
            <td>
              <p class="tdSuggest">{{notfitSuggest}}</p>
            </td>
            <td class="tdCommom tdSuggest">{{foodNotFit}}</td>
            <td class="tdCommom" style="width:300px;">
              <el-button type="primary" plain size="small" icon="el-icon-edit" @click="editSuggest(0)" >编辑</el-button>
              <el-button type="primary" plain size="small" icon="el-icon-plus" @click="foodManage(0)" >食材管理</el-button>
            </td>
          </tr>
        </table>
      </div>
      <el-form-item class="form-button-wrapper sure">
        <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重 置</el-button>
        <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">保 存</el-button>
      </el-form-item>
    </el-form>
    <!--  编辑商品描述  -->
    <el-dialog title="商品描述" :visible.sync="proDes" :modal-append-to-body="false" :append-to-body="true" width="45%" center>
      <el-form :model="productDes" size="small" label-width="80px">
        <el-form-item label="商品名:" prop="name" class="source" style="width:30%;">
            <el-input v-model="productDes.name" readonly></el-input>
          </el-form-item>
        <el-form-item label="商品描述:" prop="productDes">
            <el-input type="textarea" :rows="5" v-model="productDes.description" style="width:60%"></el-input>
          </el-form-item>
        <el-form-item class="form-button-wrapper editDes">
          <el-button type="default" @click="cleanDes" icon="el-icon-delete">取 消</el-button>
          <el-button type="primary" @click="saveDescription" icon="el-icon-search">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 食材管理 -->
    <el-dialog title="请选择需要的食材" :visible.sync="foodShow" :modal-append-to-body="false" width="85%" top="12vh" center>
      <iframe :src="foodUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
    <!-- 编辑饮食 -->
    <el-dialog title="饮食建议" :visible.sync="dietSuggest" :modal-append-to-body="false" width="600px" top="12vh" center>
      <el-form :model="suggestFood" size="small" label-width="60px">
        <el-form-item label="建议:" prop="description">
          <el-input type="textarea" :rows="6" v-model="suggestFood.description" ></el-input>
        </el-form-item>
        <el-form-item label="食材:" prop="TabIds" v-if="this.foodFit || this.foodNotFit">
          <div v-if="_self.foodWay === 1">
            <el-tag v-model="suggestFood.name" :key="tag.index" v-for="tag in foodFitArr" class="tagsSpan" closable :disable-transitions="false" @close="handleClose(tag)">
              <span>{{tag}}</span>
            </el-tag>
          </div>
          <div v-else>
            <el-tag v-model="suggestFood.name" :key="tag.index" v-for="tag in foodNotFitArr" class="tagsSpan" closable :disable-transitions="false" @close="handleClose(tag)">
              <span>{{tag}}</span>
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item class="form-button-wrapper editDes suggest">
          <el-button type="default" @click="cancelSuggest" icon="el-icon-circle-close">取消</el-button>
          <el-button type="primary" @click="saveSuggest" icon="el-icon-search">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ueditor from '@/components/ueditor/editor';
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    // 体质结果不能为空
    return {
      Body_symptom: null,
      Body_suggestion: null,
      Form: {
        type: 1,
        name: '', // 体质结果
        symptom: '', // 表现症状
        suggestion: '', // 调理建议
        soup: [], // 汤品
        product: [],  // 商品
        life: [],   // 滋补品
        ingredients: [{  // 饮食建议
          ingredients_type: '',  // 食材类型 0：忌 1：宜
          ingredients_type_name: '',  // 宜 或者 忌
          ingredients_introduce: '', // 适宜文字描述
          ingredients_name: '',
          items: []
        },
        {
          ingredients_type: '',  // 食材类型 0：忌 1：宜
          ingredients_type_name: '',  // 宜 或者 忌
          ingredients_introduce: '', // 适宜文字描述
          ingredients_name: '',
          items: []
        }],
        prescription: { // 推荐方剂
          name: '',
          prescription: '',
          effect: '',
        },
      },
      rules: {
        name: [{ required: true, message: '请输入体质结果', trigger: 'blur' }],
        symptom: [{ required: true, message: '请输入表现症状', trigger: 'blur' }],
        suggestion: [{ required: true, message: '请输入调理建议', trigger: 'blur' }],
        'prescription.name': [{ required: false, message: '请输入推荐方剂名称', trigger: 'blur' }],
        'prescription.prescription': [{ required: false, message: '请输入剂量信息', trigger: 'blur' }],
        'prescription.effect': [{ required: false, message: '请输入功效', trigger: 'blur' }],
      },
      soupTableData: [],  // 汤品
      soupShow: false,
      productData: [], // 商品
      productShow: false,
      kangmeiData: [],  // 康美人生
      kangmeiShow: false,
      pruductsColumns: this.productColunms(),
      ProductsUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
      productDes: {
        name: '',
        description: ''
      },
      proDes: false,
      soupOrpro: '',
      rowData: '',
      rowIndex: '',
      foodShow: false,
      foodUrl: `${process.env.WEB_HOST}/instrumentTesting/Viscera/commonFoodsList?limit=1&index=`, // 食材管理
      foodWay: '',
      foodFit: '',  // 宜
      foodNotFit: '',  // 忌
      foodFitArr: [],
      foodNotFitArr: [],
      fitFoodPicArr: [],  // 食材宜图片
      notFitFoodPicArr: [],  // 食材忌图片
      dietSuggest: false,  // 饮食建议
      suggestFood: {
        description: '',
        name: ''
      },
      fitSuggest: '',  // 宜建议
      notfitSuggest: '',  // 忌建议
    };
  },
  components: {
    'ueditor': ueditor,
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  props: {
    addPhysical: Boolean,
  },
  methods: {
    previewImg(url) { // 自定义弹窗
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    // 添加汤品
    addinformation() {
      this.soupShow = true;
      this.soupOrpro = 1;
    },
    // 删除汤品列表
    cleanSoup() {
      if (this.soupTableData.length !== 0) {
        this.$confirm('此操作将执行清空推荐汤品列表数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.soupTableData = [];
          this.Form.soup = [];
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
      this.soupOrpro = 2;
    },
    // 删除商品列表
    cleanpro() {
      if (this.productData.length !== 0) {
        this.$confirm('此操作将执行清空推荐商品列表数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.productData = [];
          this.Form.product = [];
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
    // 添加康美商品
    addKangmei() {
      this.kangmeiShow = true;
      this.soupOrpro = 3;
    },
    // 删除康美列表
    cleanKangmei() {
      if (this.kangmeiData.length !== 0) {
        this.$confirm('此操作将执行清空推荐滋补商品列表数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.kangmeiData = [];
          this.Form.life = [];
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
    // 食材建议
    editSuggest(data) {
      let _self = this;
      _self.foodWay = data;
      if (_self.foodWay === 1) {
        _self.suggestFood.description = _self.fitSuggest;
        _self.foodFitArr = _self.foodFit.split(',');
      } else {
        _self.suggestFood.description = _self.notfitSuggest;
        _self.foodNotFitArr = _self.foodNotFit.split(',');
      }
      _self.dietSuggest = true;
    },
    // 关闭食材弹窗
    cancelSuggest() {
      this.dietSuggest = false;
    },
    // 删除食材
    handleClose(tag) {
      if (this.foodWay === 1) {
        this.foodFitArr.splice(this.foodFitArr.indexOf(tag), 1);
        this.Form.ingredients[0].items.splice(this.Form.ingredients[0].items.indexOf(tag), 1);
        this.Form.ingredients[0].ingredients_name = this.foodFitArr.join(',');
      } else {
        this.foodNotFitArr.splice(this.foodNotFitArr.indexOf(tag), 1);
        this.Form.ingredients[1].items.splice(this.Form.ingredients[1].items.indexOf(tag), 1);
        this.Form.ingredients[1].ingredients_name = this.foodNotFitArr.join(',');
      }
    },
    // 保存饮食建议
    saveSuggest(data) {
      let _self = this;
      if (_self.foodWay === 1) {
        _self.fitSuggest = _self.suggestFood.description;
        _self.Form.ingredients[0].ingredients_type = 1;
        _self.Form.ingredients[0].ingredients_type_name = '宜';
        _self.Form.ingredients[0].ingredients_introduce = _self.fitSuggest;
        _self.foodFit = _self.foodFitArr.join(',');
        _self.dietSuggest = false;
      } else {
        _self.notfitSuggest = _self.suggestFood.description;
        _self.Form.ingredients[1].ingredients_type = 0;
        _self.Form.ingredients[1].ingredients_type_name = '忌';
        _self.Form.ingredients[1].ingredients_introduce = _self.notfitSuggest;
        _self.foodNotFit = _self.foodNotFitArr.join(',');
        _self.dietSuggest = false;
      }
    },
    // 食材管理
    foodManage(data) {
      this.foodWay = data;
      this.foodShow = true;
    },
    // 汤品商品
    customCompFuncProduct(params) {
      let _self = this;
      if (params.type === 'delete') {  // 删除
        this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (params.rowData.type === 1) {
            this.soupTableData.splice(params.index, 1);
            this.Form.soup = this.soupTableData;
          } else if (params.rowData.type === 2) {
            this.productData.splice(params.index, 1);
            this.Form.product = this.productData;
          } else if (params.rowData.type === 3) {
            this.kangmeiData.splice(params.index, 1);
            this.Form.life = this.kangmeiData;
          }
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
      else if (params.type === 'editDes') {
        this.rowIndex = params.index;
        this.proDes = true;
        this.productDes.name = params.rowData.product_name;
        this.productDes.description = params.rowData.description;
        this.rowData = params.rowData;
      }
      else if (params.type === 'sortUp') {
        _self.$confirm('此操作将上移该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (params.rowData.type === 1) {
            if (params.index > 0) {
              let temp = _self.soupTableData[params.index - 1];
              _self.$set(_self.soupTableData, params.index - 1, _self.soupTableData[params.index]);
              _self.$set(_self.soupTableData, params.index, temp);
              _self.$message({
                type: 'success',
                message: '上移成功'
              });
            } else {
              this.$message({
                type: 'warning',
                message: '该数据已在第一'
              });
            }
          }
          else if (params.rowData.type === 2) {
            if (params.index > 0) {
              let temp = _self.productData[params.index - 1];
              _self.$set(_self.productData, params.index - 1, _self.productData[params.index]);
              _self.$set(_self.productData, params.index, temp);
              _self.$message({
                type: 'success',
                message: '上移成功'
              });
            } else {
              this.$message({
                type: 'warning',
                message: '该数据已在第一'
              });
            }
          }
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消上移'
          });
        });
      }
    },
    // 关闭编辑描述
    cleanDes() {
      this.productDes.description = '';
    },
    // 编辑商品描述
    saveDescription() {
      if (this.rowData.type === 1) {
        this.soupTableData[this.rowIndex].description = this.productDes.description;
      } else if (this.rowData.type === 2) {
        this.productData[this.rowIndex].description = this.productDes.description;
      } else if (this.rowData.type === 3) {
        this.kangmeiData[this.rowIndex].description = this.productDes.description;
      }
      this.productDes.description = '';
      this.proDes = false;
    },
    productColunms() {
      let columns = [
        { field: 'product_id', title: '商品ID', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_name', title: '商品名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product_pic', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_introduce', title: '商品功效', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'description', title: '推荐商品文案', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product_price', title: '价格', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-proDescriptionis', isResize: true }
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
        if (item.field === 'product_pic') {
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
        if (item.field === 'product_price') {
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
    resetForm() {
      this.$refs['resultData'].resetFields();
      this.Form.name = '';
      this.Body_symptom.setContent('');
      this.Form.symptom = '';
      this.Body_suggestion.setContent('');
      this.Form.suggestion = '';
      this.Form.soup = [];
      this.Form.product = [];
      this.Form.prescription.name = '';
      this.Form.prescription.prescription = '';
      this.Form.prescription.effect = '';
      this.soupTableData = [];
      this.productData = [];
      this.foodFit = '';
      this.foodNotFit = '';
      this.fitSuggest = '';
      this.notfitSuggest = '';
    },
    // 获取详情
    getDetails() {
      let _self = this;
      ajax.get(`/api/jinmu/GetContentDescribeInfoByID/` + _self.$route.query.id).then((res) => {
        if (res.status === 200 & res.data.code === 0) {
          _self.Form = res.data.data;
          if (_self.Form.suggestion) {
            _self.Body_suggestion.setContent(_self.Form.suggestion);
          }
          if (_self.Form.symptom) {
            _self.Body_symptom.setContent(_self.Form.symptom);
          }
          if (_self.Form.product) {
            _self.productData = _self.Form.product;
            _self.Form.product = _self.Form.product;
          }
          if (_self.Form.soup) {
            _self.soupTableData = _self.Form.soup;
            _self.Form.soup = _self.Form.soup;
          }
          if (_self.Form.life) {
            _self.kangmeiData = _self.Form.life;
            _self.Form.life = _self.Form.life;
          }
          _self.fitSuggest = _self.Form.ingredients[0].ingredients_introduce;
          _self.notfitSuggest = _self.Form.ingredients[1].ingredients_introduce;
          if (_self.Form.ingredients[0].items) {
            let fitFoodName = _self.Form.ingredients[0].items.map(function(item, index, data) {
              return item.product_name;
            });
            _self.foodFitArr = fitFoodName;
            _self.foodFit = fitFoodName.join(',');
          } else {
            _self.Form.ingredients[0].items = [];
          }
          if (_self.Form.ingredients[1].items) {
            let fitFoodName1 = _self.Form.ingredients[1].items.map(function(item, index, data) {
              return item.product_name;
            });
            _self.foodNotFitArr = fitFoodName1;
            _self.foodNotFit = fitFoodName1.join(',');
          } else {
            _self.Form.ingredients[1].items = [];
          }
        }
      });
    },
    // 提交
    submitForm() {
      let _self = this;
      let param = _self.Form;
      let symptomDetail = _self.Body_symptom.getContent();
      let suggestionDetail = _self.Body_suggestion.getContent();
      _self.Form.symptom = symptomDetail;
      _self.Form.suggestion = suggestionDetail;
      _self.$refs['resultData'].validate((valid) => {
        if (valid) {
          let url;
          if (_self.addPhysical) {
            url = `/api/jinmu/AddContentDescribe`;
          } else {
            param.id = this.$route.query.id;
            url = `/api/jinmu/UpdateContentDescribe`;
          }
          let config = {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          };
          ajax.post(url, param, config).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: res.data.message
              });
              _self.resetForm();
              _self.$router.push({
                path: '/instrumentTesting/PhysicalResult/PhysicalResultList',
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 选择推荐商品
    // eslint-disable-next-line complexity
    setSelectedList(data, productNum, sellerUserId) {
      let _self = this;
      let noProID = _self.productData.map(function(item, index, data) {
        return Number(item.product_id);
      });
      let noSoupID = _self.soupTableData.map(function(item, index, data) {
        return Number(item.product_id);
      });
      let kangmeiID = _self.kangmeiData.map(function(item, index, data) {
        return Number(item.product_id);
      });
      if (data.length !== 0 && productNum === true) {
        let productInfo = {
          product_id: data[0].productId,
          product_name: data[0].productName,
          product_pic: data[0].productMainImage,
          product_price: data[0].productMarkprice,
          product_introduce: data[0].description,
          description: '',
          getbyself: data[0].getByself,
          getfast: data[0].getFast,
          getcommon: data[0].getCommon,
          transnational: data[0].transnational,
        };
        if (data[0].isChecked === 1) {
          if (!productInfo.getbyself && !productInfo.getfast && !productInfo.getcommon && !productInfo.transnational && _self.soupOrpro === 1) {
            if (noSoupID.indexOf(data[0].productId) === -1) {
              productInfo.getFast = sellerUserId;
              _self.soupTableData.push(productInfo);
              _self.Form.soup = _self.soupTableData;
              _self.$set(productInfo, 'type', 1);
              _self.soupShow = false;
            } else {
              _self.$message({
                message: '该商品已存在列表中，请选择其他商品',
                type: 'warning'
              });
            }
          } else if (this.soupOrpro === 1) {
            _self.$message({
              message: '请选择‘药店来源’为汤品的药店',
              type: 'warning'
            });
          } else if (this.soupOrpro === 2) {
            if (noProID.indexOf(data[0].productId) === -1) {
              _self.productData.push(productInfo);
              _self.Form.product = _self.productData;
              _self.$set(productInfo, 'type', 2);
              _self.productShow = false;
            } else {
              _self.$message({
                message: '该商品已存在列表中，请选择其他商品',
                type: 'warning'
              });
            }
          } else if (_self.soupOrpro === 3) {
            if (kangmeiID.indexOf(data[0].productId) === -1) {
              _self.kangmeiData.push(productInfo);
              _self.Form.life = _self.kangmeiData;
              _self.$set(productInfo, 'type', 3);
              _self.kangmeiShow = false;
            } else {
              _self.$message({
                message: '该商品已存在列表中，请选择其他商品',
                type: 'warning'
              });
            }
          } else {
            _self.$message({
              message: '请选择‘药店来源’为商品的药店',
              type: 'warning'
            });
          }
        } else {
          _self.$message({
            message: '请选择审批状态‘已审核’的商品',
            type: 'warning'
          });
        }
      } else if (data === false) {
        _self.productShow = false;
        _self.soupShow = false;
        _self.kangmeiShow = false;
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
    // 选择食材返回
    selectFoodList(data) {
      let _self = this;
      let data1 = {
        product_id: data.id,
        product_name: data.food_name,
        product_pic: data.pic_url,
        description: data.food_effect,
      };
      if (_self.foodWay === 1) {
        if (_self.foodFitArr.indexOf(data.food_name) === -1) {
          _self.foodFitArr.push(data.food_name);
          _self.foodFit = _self.foodFitArr.join(',');
          _self.Form.ingredients[0].items.push(data1);
          _self.foodShow = false;
        } else {
          _self.$message({
            message: '该食材已存在列表中，请选择其他食材',
            type: 'warning'
          });
        }
      } else if (_self.foodWay === 0) {
        if (_self.foodNotFitArr.indexOf(data.food_name) === -1) {
          _self.foodNotFitArr.push(data.food_name);
          _self.foodNotFit = _self.foodNotFitArr.join(',');
          _self.Form.ingredients[1].items.push(data1);
          _self.foodShow = false;
        } else {
          _self.$message({
            message: '该食材已存在列表中，请选择其他食材',
            type: 'warning'
          });
        }
      } else if (data === false) {
        _self.foodShow = false;
      }
    },
  },
  mounted() {
    this.Body_symptom = this.$refs.symptom_ueditor;
    this.Body_suggestion = this.$refs.suggestion_ueditor;
  },
  created() {
    window.previewImg = this.previewImg;
    window.setSelectedList = this.setSelectedList;
    window.selectFoodList = this.selectFoodList;
    if (this.addPhysical === false) {
      this.getDetails();
    }
  }
};
</script>

<style lang="less" scoped>
.form-button-wrapper {
  text-align: center;
  margin:0px 0 40px -180px;
}
.sure{
  margin: 40px 0 80px 0;;
}
.editDes{
  margin:30px 0 20px -80px;
}
.diet{
  margin-left: 100px;
  .Suggest{
    display: inline-block;
    height: 40px;
    line-height: 30px;
  }
  .tableList{
    // margin: 0 0 0 20px;
    .headPhoto{
      width: 150px;
      text-align: center;
    }
    tr{
      td,th{
        height: 40px;
        line-height: 25px;
        padding: 0 20px;
        border: 1px solid rgba(221, 221, 221, 1);
        text-align: left;
      }
      .tdCommom{
        text-align: center;
        width: 180px;
      }
      .tdSuggest{
        width: 363.5px;
        // text-overflow: ellipsis;
        white-space: wrap;
        // overflow: hidden;
      }
    }
  }
}
.suggest{
  text-align: center;
  margin: 0 0 0 -60px;
}
.dietSuggest{
  margin-left: -70px;
  color: #606266
}
.tagsSpan{
  margin: 0 5px 0 0;
}
</style>
