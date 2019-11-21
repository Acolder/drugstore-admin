<template>
  <div id="raredrug-list">
    <div>
      <el-form :model="selectedData" :rules="rules" ref="dynamicValidateForm" label-width="100px" size="small">
          <h2>链接信息</h2>
          <!-- 链接信息 -->
          <div class="wrapInfo">
            <el-row>
              <el-col :span="4">
                <el-form-item label="标题名称：" prop="title">
                  <el-input v-model="selectedData.title" placeholder="请输入标题名称" clearable style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
             </el-row>
             <el-row>
              <el-col :span="4">
                <el-form-item label="发布渠道：" prop="publishtarget">
                  <el-select v-model="selectedData.publishtarget " multiple placeholder="请选择" style="width: 300px">
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
              <el-col :span="4">
                <el-form-item label="专题排序：" prop="sort">
                  <el-input v-model="selectedData.sort" placeholder="请输入专题排序" clearable style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-form-item label="跳转类型：" prop="jumptype">
                  <el-select v-model="selectedData.jumptype" style="width: 300px">
                    <el-option :label="'未选择'" :value="0" v-if="!isAdd"></el-option>
                    <el-option :label="'H5'" :value="1"></el-option>
                    <el-option :label="'礼品'" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="专题主图：" prop="picturepath">
                  <uploadSingleImg :imgUrl="selectedData.picturepath" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
                  <el-input class="left" type="hidden" v-model="selectedData.picturepath" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="versionsellect">
              <el-col :span="8">
                <el-form-item label="版本号：" prop="version" :rules="{
                  required: true, message: '请输入版本号', trigger: 'blur'
                }">
                  <el-select
                    v-model.trim="selectedData.version"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    popper-class='downClass'
                    :popper-append-to-body="false"
                    placeholder="请输入版本号,如v1.0,按回车键可输入多个" style="width: 300px">
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
              <el-col :span="8">
                <el-form-item label="专题类别：" prop="topiccategory">
                      <el-select v-model="selectedData.topiccategory" style="width: 300px">
                        <el-option :label="'商城专题'" :value="2"></el-option>
                        <el-option :label="'快送专题'" :value="14"></el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="专题链接：" prop="pictureurl">
                  <el-input v-model.number="selectedData.pictureurl" placeholder="请输入专题链接地址" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="1">
                <el-button size="mini" icon="el-icon-edit" @click="specialVisible = true"></el-button>
              </el-col>
            </el-row>
          </div>
          <h2>实体详情信息</h2>
          <!-- 标题信息 -->
          <div class="wrapInfo" v-if="selectedData.template.content">
            <!-- 新增实体分类 -->
            <div class="add">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="实体类型：" prop="template.content">
                    <el-select v-model="value" clearable placeholder="请选择要添加的分类">
                      <el-option label="药品实体" value="0"></el-option>
                      <el-option label="链接实体" value="1"></el-option>
                    </el-select>
                    <el-button type="default" @click="add()">确认新增</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="selectedData.template != null">
              <div class="detailWrap" v-for="(Contents, index) in selectedData.template.content" :key="index">
                <!-- 删除按钮 -->
                <div class="delete" @click="clera(index)">
                  ×
                </div>
                <!-- 实体类标题 -->
                <el-row>
                  <el-col :span="24" v-if="Contents.titlecategory == 1">
                    <h2>药品类实体</h2>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" v-if="Contents.titlecategory == 2">
                    <h2>链接类实体</h2>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="标题：" label-width="60px" :prop="'template.content.' + index + '.title'">
                      <el-input v-model="Contents.title" placeholder="请输入标题" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 新增药品按钮 -->
                <el-row>
                  <el-col :span="24" v-if="Contents.titlecategory == 1">
                    <el-button type="default" size="small" icon="el-icon-plus" @click="addProduct(index)">添加药品</el-button>
                  </el-col>
                </el-row>
                <!-- 新增后显示的药品列表 -->
                <div class="proudt" v-if="Contents.titlecategory == 1">
                  <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="subColumns" @on-custom-comp="customCompFunc(arguments, index)" :table-data="Contents.product" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
                </div>
                <!-- 弹框新增药品表格 -->
                <el-dialog title="请选择新增的商品" :visible.sync="productShow" :modal-append-to-body="false" width="80%" center @close="closeIfram">
                  <iframe name="getAllRoom" :src="outSelectedInfoUrl + index" class="" frameborder="0" style="width:100%;height:600px;background-color:#FFF;"></iframe>
                </el-dialog>
                <!-- 链接类 -->
                <div class="entity" v-if="Contents.titlecategory == 2">
                  <!-- 新增链接按钮 -->
                  <el-row>
                    <el-col :span="24">
                      <el-button type="default" size="small" icon="el-icon-plus" @click="addLink(index)">新增</el-button>
                    </el-col>
                  </el-row>
                  <div v-for="(Links, j) in selectedData.template.content[index].link" :key="j">
                    <el-row>
                      <el-col :span="24">
                        <el-col :span="8">
                          <el-form-item label="链接标题：" :prop="'template.content.' + index + '.link.' + j + '.title'"
                          :rules="{
                            required: true, message: '请输入标题', trigger: 'blur'
                          }">
                            <el-input v-model="Links.title" placeholder="请输入标题" clearable></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="链接地址：" :prop="'template.content.' + index + '.link.' + j + '.url'"
                          >
                            <el-input v-model="Links.url" placeholder="请输入链接" clearable></el-input>
                          </el-form-item>
                        </el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="图片：" :prop="'template.content.' + index + '.link.' + j + '.image'"
                          :rules="{
                            required: true, message: '请选择图片', trigger: 'change'
                          }">
                            <uploadSingleImg :imgUrl="Links.image" :fileName="'LinkImage'+ index + j " @uploadSuccess="uploadEntityImg(arguments, index, j)" @removeImg="removeEntityImg(index, j)"></uploadSingleImg>
                            <el-input class="left" type="hidden" v-model="Links.image"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <!-- 弹框选择专题地址 -->
            <el-dialog title="专题" class="sDialog" :visible.sync="specialVisible" width="746px" center :modal-append-to-body="false">
              <el-table
                    :data="specialData"
                    height="250"
                    border
                    style="width: 100%"
                    class="tB"
                    >
                    <el-table-column
                      prop="special"
                      label="专题名称"
                      width="348"
                      align="center">
                    </el-table-column>
                    <!-- <el-table-column
                      prop="img"
                      label="专题图片"
                      width="230"
                      align="center">
                      <template slot-scope="scope">
                        <img :src="scope.row.img" alt="" @click="seeClick(scope.row)" style="width: 50px;height: 50px">
                      </template>
                    </el-table-column> -->
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="348"
                      align="center">
                      <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="primary" size="small">测试</el-button>
                        <el-button @click="handleClick2(scope.row)" type="primary" size="small">正式</el-button>
                        <!-- <el-button @click="seeClick(scope.row)" type="primary" size="small">查看</el-button> -->
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-dialog
                  width="30%"
                  title="专题图片"
                  center
                  :visible.sync="innerVisible"
                  append-to-body
                  class="intab">
                  <template>
                        <img :src="imgurl" alt="" style="width: 100%; height: auto">
                  </template>
                </el-dialog>
            </el-dialog>
          </div>
        <div>
          <el-form-item class="form-button-wrapper">
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="commit">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 更改商品图片 -->
    <el-dialog title="更换商品图片" :visible.sync="replacePic" :modal-append-to-body="false" :append-to-body="true" width="40%" center>
      <el-form :model="replaceData" size="small"  ref="ruleFormreplaceData" :rules="rules">
        <el-form-item label="图片" label-width="100px" prop="productmainimage">
          <uploadSingleImg :imgUrl="replaceData.productmainimage" :fileName="'Image'" @uploadSuccess="replaceuploadImg" @removeImg="replaceremoveImg"></uploadSingleImg>
          <el-input class="left" type="hidden" v-model="replaceData.productmainimage"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replacePic = false">取 消</el-button>
        <el-button type="primary" @click="queryReplacePic">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import { Data } from './special.js';
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
// import { base64Encrypt } from '@/utils/auth.js';
export default {
  data() {
    // 排序
    let validateSort = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入大于0的正整数'));
        }
      } else {
        // callback();
        return callback(new Error('请输入大于0的正整数'));
      }
    };
    return {
      replacePic: false,
      replaceData: {},
      replaceIndex1: '',
      replaceIndex2: '',
      specialVisible: false,
      specialData: [],
      specialID: '',
      imgurl: '',
      innerVisible: false,
      selectedData: {
        title: '',
        version: [],
        topiccategory: 2,
        category: '',
        sort: '',
        jumptype: null,
        pictureurl: '',
        picturepath: '',
        publishtarget: '',
        template: {
          backgroundimg: '',
          backgroundcolor: '',
          banner: '',
          content: []
        }
      },
      versionOption: [
        {
          value: '',
          label: ''
        }
      ],
      options: [{ label: 'app', value: '1' }, { label: 'h5', value: '2' }, { label: '小程序', value: '3' }],
      rules: {
        title: [{ required: true, message: '请输入标题名称名称', trigger: 'blur' }],
        topiccategory: [{ required: true, message: '请选择专题类别', trigger: 'blur' }],
        sort: [{ required: true, validator: validateSort, trigger: 'blur' }],
        picturepath: [{ required: true, message: '请选择专题主图', trigger: 'change' }],
        productmainimage: [{ required: true, message: '请先选择图片', trigger: 'blur' }],
        publishtarget: [{ required: true, message: '请选择发布到的位置', trigger: 'blur' }],
        jumptype: [{ required: true, message: '请选择跳转的类型', trigger: 'blur' }],
        'template.content': [{ required: true, message: '请选择至少一种商品或者链接', trigger: 'blur' }]
      },
      subColumns: this.getSubColumns(),
      value: '',
      productShow: false,
      total: 0,
      subTableData: [],
      outSelectedInfoUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
      num: null
    };
  },
  props: {
    isAdd: Boolean
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  methods: {
    // seeClick(a) {
    //   this.innerVisible = true;
    //   this.imgurl = a.img;
    // },
    // 测试
    handleClick(a) {
      if (this.$route.query.id) {
        this.selectedData.pictureurl = a.addr + this.$route.query.id;
      } else {
        this.selectedData.pictureurl = a.addr;
      }
      this.specialVisible = false;
    },
    // 正式
    handleClick2(a) {
      if (this.$route.query.id) {
        this.selectedData.pictureurl = a.addr_2 + this.$route.query.id;
      } else {
        this.selectedData.pictureurl = a.addr_2;
      }
      this.specialVisible = false;
    },
    // 更换商品图片
    replaceuploadImg(data) {
      this.replaceData.productmainimage = data.url;
    },
    replaceremoveImg() {
      this.replaceData.productmainimage = '';
    },
    // 确定修改商品图片
    queryReplacePic() {
      this.$refs['ruleFormreplaceData'].validate((valid) => {
        if (valid) {
          // 取出之前保留的下标 把修改之后的数据进行替换
          this.$set(this.selectedData.template.content[this.replaceIndex1].product[this.replaceIndex2], 'productmainimage', this.replaceData.productmainimage);
          this.replacePic = false;
        }
      });
    },
    // 上传精选好药主图
    uploadMianImg(data) {
      this.selectedData.picturepath = data.url;
    },
    // 删除精选好药主图
    removeMainImg() {
      this.selectedData.picturepath = '';
    },
    // 上传实体图片
    uploadEntityImg(data, index, j) {
      this.selectedData.template.content[index].link[j].image = data[0].url;
    },
    // 上传实体图片
    removeEntityImg(index, j) {
      this.selectedData.template.content[index].link[j].image = '';
    },
    // 添加主题
    add() {
      if (this.value === '0') {
        this.selectedData.template.content.push({
          title: '',
          titlecategory: '1',
          product: [
          ]
        });
      } else if (this.value === '1') {
        this.selectedData.template.content.push({
          title: '',
          titlecategory: '2',
          link: [
            {
              title: '',
              image: '',
              url: ''
            }
          ]
        });
      }
    },
    // 删除主题
    clera(index) {
      this.$confirm('此操作将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedData.template.content.splice(index, 1);
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
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    deepClone(obj) {
      let _self = this;
      let objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === 'object') {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = _self.deepClone(obj[key]);
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    },
    customCompFunc(params, index) {
      // console.log(params, index);
      // 更改商品图片
      if (params[0].type === 'modifyImg') { // do delete operation
        // console.log(this.selectedData);
        // 取出需要修改的商品
        let data = params[0].rowData;
        // 使用深拷贝得到值
        this.replaceData = this.deepClone(data);
        // 保存修改商品的下标
        this.replaceIndex1 = index;
        this.replaceIndex2 = params[0].index;
        // console.log(this.replaceData);
        this.replacePic = true;
      }
      if (params[0].type === 'deleteRow') { // do delete operation
        this.selectedData.template.content[index].product.splice(params[0].index, 1);
      }
    },
    // 商品选择后表格
    getSubColumns() {
      let columns = [
        { field: 'productId', title: '商品id', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '商品图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '商品名', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productmarkprice', title: '商品价格', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-special', isResize: true }
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
            let value2 = rowData['productmainimage'];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else if (value2) {
              return `<a href="javascript:previewImg('${value2}');"><img src="${value2}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'productId') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            let value2 = rowData['productid'];
            if (value) {
              return value;
            } else {
              return value2;
            }
          };
        }
        if (item.field === 'productName') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            let value2 = rowData['productname'];
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
    closeIfram() {
      this.outSelectedInfoUrl = '';
    },
    // 添加药品
    addProduct(index) {
      this.productShow = true;
      this.outSelectedInfoUrl = `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`;
      this.num = index;
    },
    // 选择商品
    setSelectedList(data, productNum, index) {
      let res = data.map(item => {
        return {
          productid: item.productId,
          description: item.description,
          getbyself: item.getByself,
          getcommon: item.getCommon,
          getfast: item.getFast,
          productmainimage: item.productMainImage,
          productmarkprice: item.productStocks,
          productname: item.productName,
          productspecification: item.productSpecification,
          sort: 0,
          transnational: item.transnational,
          isChecked: item.isChecked,
        };
      });
      if (data !== false && productNum === true) {
        let ids = this.selectedData.template.content[this.num].product.map(item => {
          return item.productid;
        });
        for (let i = 0; i < res.length; i++) {
          res[i].productmarkprice = res[i].productmarkprice[i].productPrice;
          if (res[i].isChecked === 2) {
            this.$message({
              message: '该商品还未审核，请选择已审核的商品',
              type: 'error'
            });
          }
          else {
            if (ids.indexOf(res[i].productid) > -1) {
              this.$message({
                message: '已存在相同的商品，不能重复添加',
                type: 'error'
              });
            } else {
              this.selectedData.template.content[this.num].product = [...res, ...this.selectedData.template.content[this.num].product];
            }
          }
        }
        this.productShow = false;
      } else if (data === false) {
        this.productShow = false;
      } else {
        this.$message({
          message: '只能选1个',
          type: 'error'
        });
      }
    },
    addLink(index) {
      this.selectedData.template.content[index].link.push({
        title: '',
        image: '',
        url: ''
      });
    },
    // 重置
    resetForm() {
      this.$refs['dynamicValidateForm'].resetFields();
    },
    // 提交
    commit() {
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid && this.selectedData.template.content !== []) {
          this.submitData();
        } else {
          return false;
        }
      });
    },
    submitData() {
      let _self = this;
      if ((_self.selectedData.version.length !== 0) && (_self.selectedData.publishtarget.length !== 0)) {
        _self.selectedData.version = _self.selectedData.version.join(',');
        _self.selectedData.publishtarget = _self.selectedData.publishtarget.join(',');
      }
      let url;
      if (this.isAdd) {
        url = '/api/admin/addGoodDrugBanner';
      } else {
        url = '/api/admin/updateGoodDrugBanner';
      }
      // let aaa = JSON.stringify(_self.selectedData);
      // console.log(base64Encrypt(aaa));
      ajax.post(url, _self.selectedData).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          // 关闭当前也并跳转列表页
          let currentName = _self.$route.name;
          let currentTab = _self.visitedViews.find((x) => x.name === currentName);
          _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
            _self.$router.push('/manage/selected?pageIndex=' + this.$route.query.pageIndex + '&pageSize=' + this.$route.query.pageSize + '&AdvertinsingType=' + this.$route.query.AdvertinsingType + '&version=' + this.$route.query.version);
          });
        }// 修改成功后返回
      });
    },

    // 获取修改数据
    getSelectedData() {
      let _self = this;
      ajax.get('/api/admin/getGoodDrugBannerDetail/' + this.$route.query.id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          if (res.data.data.template === null) {
            let tmp = {
              backgroundimg: '',
              backgroundcolor: '',
              banner: '',
              content: []
            };
            res.data.data.template = tmp;
          }
          _self.selectedData = res.data.data;
          if (res.data.data.pictureurl.indexOf(res.data.data.id) === -1) {
            _self.selectedData.pictureurl = res.data.data.pictureurl + res.data.data.id;
          }
          _self.selectedData.publishtarget = _self.selectedData.publishtarget.split(',');
          _self.selectedData.version = _self.selectedData.version.split(',');
        }
      });
    }
  },
  created() {
    this.specialData = Data();
    if (!this.isAdd) {
      this.getSelectedData();
    }
    window.setSelectedList = this.setSelectedList;
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
@import "kindeditor/themes/default/default.css";

#raredrug-list{
  padding-bottom: 50px;
  /deep/.downClass{
    display: none;
  }
}
  .versionsellect{
    /deep/.el-input__suffix{
      display: none;
    }
    /deep/.el-select{
      width: 100%;
    }
    & /deep/ .el-col-2 {
      padding-left: 20px;
    }
  }
  .wrapInfo{
    padding: 15px;
    border: 1px solid #dee5e7;
    background: #f6f8f8;
    padding-bottom: 5px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
  h2{
      line-height: 50px;
      font-size: 16px;
      font-weight: normal;
    }
  .detailWrap{
    padding: 20px;
    border: 1px solid #e0e0e0;
    height: auto;
    // overflow: hidden;
    padding-bottom: 0;
    margin-bottom: 15px;
    position: relative;
  }
  .detailWrap::after {
    content: ".";
    clear: both;
    display: block;
    overflow: hidden;
    font-size: 0;
    height: 0;
}
.form-button-wrapper{
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.add{
  height: 63px;
  margin-top: 10px;
}
.delete{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
  z-index: 50;
}
.delete:hover{
  background: #409eff;
  color: #fff;
}
.proudt{
  margin-top: 15px;
}
// .sDialog {
//   & /deep/ .el-dialog .el-dialog__body .el-table {
//    height: 80%!important;
//   }
// }
.tB {
   height: 500px!important;
}
</style>
