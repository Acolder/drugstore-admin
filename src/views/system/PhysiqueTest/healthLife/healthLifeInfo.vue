<template>
  <div id="drugsWrapper">
    <el-form ref="drugsData" :model="Form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="体质" prop="physiquename" class="labelItem">
            <el-select v-model="Form.physiquename" placeholder="请选择" class="mainCategory">
              <el-option v-for="item in options" :key="item.physiquename" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="RecommendName">
          <el-form-item label="推荐名称" prop="recommandname"   placeholder="请输入推荐名称" :rules="{ required: true, message: '请输入推荐名称', trigger: 'blur'}">
            <el-input class="el-input" v-model="Form.recommandname" clearable style="width:400px;margin-right:20px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"  v-if="RecommendTag">
          <el-form-item label="商品标签" prop="producttag">
          <el-tag v-model="Form.producttag" :key="index" v-for="(tag, index) in tagBox" :closable="true" :disable-transitions="false" @close="handleClose(tag)" class="tagsSpan">
            <span>{{tag}}</span>
          </el-tag>
          <el-button class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
        </el-form-item>
        </el-col>
      </el-row>
      <!--商品弹窗-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品名称" prop="productname" style="margin-right:20px">
            <el-button type="default" size="small" @click="addDrugs" v-if="Form.productname === ''">选择商品</el-button>
            <span class="newTitle" v-if="Form.productname">
              {{Form.productname}}
              <i class="el-icon-error detailTitle" @click="detailTitle"></i>
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="推荐图片" prop="recommandimg" class="headMainPic">
            <uploadSingleImg style="float: left;" :imgUrl="Form.recommandimg" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
            <el-input  style="float:left;" type="hidden" v-model="Form.recommandimg" class="inputWidth"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="商品描述:" style="margin-right:20px" prop="productbrief">
            <el-input type="textarea" :rows="4" v-model="Form.productbrief" style="width:40%" clearable=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 标签弹窗 -->
      <el-dialog title="标签" :visible.sync="tagsVisible" :modal-append-to-body="false" width="35%" :center="true" class="labelWrap">
        <el-row>
          <el-input v-model="Tag"  placeholder="请输入标签内容" clearable></el-input>
        </el-row>
        <div slot="footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 商品弹窗 -->
      <el-dialog title="请选择需要推荐的商品" :visible.sync="drugsShow" :modal-append-to-body="false" width="80%" top="12vh" center>
        <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
      </el-dialog>
      <!-- 膏方弹窗 -->
      <el-dialog title="请选择需要推荐的膏方" :visible.sync="gaoShow" :modal-append-to-body="false" width="85%" top="12vh" center>
        <iframe :src="gaoUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
      </el-dialog>
      <el-row>
        <el-form-item class="form-button-wrapper">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
          <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
          <el-button @click="submitForm(true)" icon="el-icon-circle-check-outline" type="success" size="small">提交并上架</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import uploadSingleImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      Form: {
        physiquename: '',  // 体质
        producttype: '', // 商品类型 1.膏方 2.药材
        recommandname: '',  // 推荐膏方名
        productname: '',  // 膏方名
        productid: '',  // 膏方id
        recommandimg: '',  // 推荐图片
        producttag: [],  // 商品标签
        productbrief: '',  // 商品简介
        status: 1,  // 状态
      },
      rules: {
        physiquename: [{ required: true, message: '请选择体质', trigger: 'blur' }],
        producttype: [{ required: true, message: '请选择商品类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择药品', trigger: 'blur' }],
        producttag: [{ required: true, message: '请选择标签', trigger: 'blur' }],
        productname: [{ required: true, message: '请选择商品', trigger: 'blur' }],
        recommandimg: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        productbrief: [{ required: false, message: '请输入药品概述', trigger: 'blur' }],
      },
      options: [
        { value: '阳虚质', label: '阳虚质' },
        { value: '气虚质', label: '气虚质' },
        { value: '平和质', label: '平和质' },
        { value: '阴虚质', label: '阴虚质' },
        { value: '痰湿质', label: '痰湿质' },
        { value: '湿热质', label: '湿热质' },
        { value: '血瘀质', label: '血瘀质' },
        { value: '气郁质', label: '气郁质' },
        { value: '特禀质', label: '特禀质' }
      ],
      drugsShow: false,  // 药品
      gaoShow: false,  // 膏方
      tagsVisible: false,
      Tag: '',
      RecommendName: false,
      RecommendTag: false,
      ProductsUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
      gaoUrl: `${process.env.WEB_HOST}/PhysiqueTest/healthLife/fixedPaste?limit=1&index=`,
      tagBox: []
    };
  },
  props: {
    healthLife: Number,
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  methods: {
    // 上传图片
    uploadMianImg(data) {
      this.Form.recommandimg = data.url;
    },
    removeMainImg() {
      this.Form.recommandimg = '';
    },
    // 新增标签
    showInput() {
      this.tagsVisible = true;
    },
    // 标签提交上传
    confirm() {
      if (this.Tag) {
        this.$message({
          showClose: false,
          message: '操作成功',
          type: 'success'
        });
        this.tagBox.push(this.Tag);
        this.Form.producttag = this.tagBox;
      }
      this.tagsVisible = false;
      this.Tag = '';
    },
    // 取消标签上传
    cancel() {
      this.tagsVisible = false;
      this.$message({
        message: '已取消',
        type: 'info'
      });
    },
    // 删除列表标签
    handleClose(tag) {
      this.tagBox.splice(this.tagBox.indexOf(tag), 1);
      this.Form.producttag = this.tagBox;
    },
    // 删除商品名称
    detailTitle() {
      this.$confirm('确认执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Form.productname = '';
        this.Form.recommandimg = '';
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
    },
    // 添加药品
    addDrugs() {
      if (this.healthLife === 1 || this.healthLife === 3) {
        this.gaoShow = true;
      } else {
        this.drugsShow = true;
      }
    },
    // 返回数据推荐商品
    setSelectedList(data, productNum, index, information, drugfrom) {
      let _self = this;
      if (data.length !== 0 && productNum === true) {
        _self.Form.productname = data[0].productName;
        _self.Form.productid = JSON.stringify(data[0].productId);
        _self.Form.recommandimg = data[0].productMainImage;
        if (_self.Form.producttype === 1) {
          _self.Form.recommandname = _self.Form.productname;
        } else if (this.healthLife === 2 || this.healthLife === 4) {
          if (data[0].isChecked === 1) {
            if (!data[0].getCommon && !data[0].getFast && !data[0].getByself && !data[0].transnational) {
              _self.$message({
                message: '该商品来源为空，请选择药店来源（如已选择药店来源，请选择其他有来源的商品）',
                type: 'warning'
              });
            } else {
              _self.Form.commonid = data[0].getCommon;
              _self.Form.fastid = data[0].getFast;
              _self.Form.selfid = data[0].getByself;
              _self.Form.transnationalid = data[0].transnational;
              _self.drugsShow = false;
            }
          } else {
            _self.$message({
              message: '请选择已核审的商品',
              type: 'warning'
            });
          }
        }
      } else if (data === false) {
        _self.drugsShow = false;
      } else if (data.length === 0) {
        _self.$message({
          message: '请选择商品',
          type: 'warning'
        });
      } else {
        _self.$message({
          message: '只能选1个',
          type: 'error'
        });
      }
    },
    // 返回数据固定膏方
    selectGaoList(data) {
      let _self = this;
      _self.Form.productname = data.name;
      _self.Form.productid = data.id;
      _self.Form.recommandname = _self.Form.productname;
      _self.gaoShow = false;
    },
    // 获取详情数据
    getData() {
      let _self = this;
      ajax.get(`/api/admin/getHealthRecDetail?id=` + _self.$route.query.id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.Form = res.data.data;
          if (_self.Form.producttype === 1) {
            _self.RecommendName = false;
            _self.RecommendTag = false;
            _self.Form.recommandname = _self.Form.productname;
          }
          _self.tagBox = _self.Form.producttaglist;
          _self.Form.producttag = _self.tagBox;
        }
      });
    },
    // 提交数据
    submitForm(ischecked) {
      let _self = this;
      _self.$refs['drugsData'].validate((valid) => {
        if (valid) {
          _self.Form.producttag = _self.Form.producttag.join(',');
          let data = _self.Form;
          if (ischecked === true) {
            _self.Form.status = 1;
          } else {
            _self.Form.status = 0;
          }
          let url;
          if (_self.healthLife === 1) {   // 新增膏方
            _self.Form.producttype = 1;
            url = `/api/admin/addHealthRecommand`;
          }
          else if (_self.healthLife === 2) {   // 新增药材
            _self.Form.producttype = 2;
            url = `/api/admin/addHealthRecommand`;
          }
          else if (this.healthLife === 3 || this.healthLife === 4) {  // 修改膏方/药方
            _self.Form.id = _self.$route.query.id;
            url = `/api/admin/updateHealthRecommand`;
          }
          ajax.post(url, data).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                showClose: true,
                message: res.data.message,
                type: 'success'
              });
              if (_self.healthLife === 1 || _self.healthLife === 2) {
                _self.$router.push('/PhysiqueTest/healthLife/healthLifeList?PhysiqueName=' + _self.Form.physiquename);
              } else {
                _self.$router.push('/PhysiqueTest/healthLife/healthLifeList?PhysiqueName=' + _self.Form.physiquename + '&pageindex=' + _self.$route.query.pageindex);
              }
              _self.resetForm();
            } else {
              _self.$message.error(res.data.message);
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
    // 重置
    resetForm() {
      this.Form.physiquename = '';
      // this.Form.producttype = '';
      this.Form.recommandname = '';
      this.Form.productname = '';
      this.Form.productid = '';
      this.Form.recommandimg = '';
      this.Form.producttag = [];
      this.tagBox = [];
      this.Form.productbrief = '';
      this.Form.status = '';
    },
  },
  created() {
    window.setSelectedList = this.setSelectedList;
    window.selectGaoList = this.selectGaoList;
    if (this.healthLife === 3 || this.healthLife === 4) {
      this.getData();
    }
    if (this.healthLife === 1) {
      this.Form.producttype = 1;
      this.RecommendTag = false;
    } else {
      this.Form.producttype = 2;
      this.RecommendName = true;
      this.RecommendTag = true;
    }
  }
};
</script>

<style lang="less" scoped>
#drugsWrapper{
  .mainCategory{
    width: 400px;
    /deep/ .el-input__inner{
      padding-right: 200px;
    }
  }
  .labelItem{
    /deep/ .el-form-item__label{
      text-align: center;
    }
  }
  .form-button-wrapper{
    text-align: center;
    margin-left: -350px;
  }
  .tagsSpan{
    margin: 0 5px;
  }
  .newTitle{
    display: inline-block;
    text-align: left;
    .detailTitle{
      margin-left: 50px;
      cursor: pointer;
    }
  }
}
</style>
