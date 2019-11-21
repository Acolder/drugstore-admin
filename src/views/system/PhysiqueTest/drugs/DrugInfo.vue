<template>
  <div id="drugsWrapper">
    <el-form ref="drugsData" :model="Form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24" >
            <el-form-item label="体质:" style="margin-right:20px" prop="commoditymaincategory" class="labelItem">
              <el-select v-model="Form.commoditymaincategory" placeholder="请选择" class="mainCategory">
                <el-option v-for="item in options" :key="item.commoditymaincategory" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="商品名称:" style="margin-right:20px" prop="commodityname">
              <el-button type="default" size="small" @click="addDrugs" v-if="Form.commodityname === ''">选择商品</el-button>
              <span class="newTitle" v-if="Form.commodityname">
                {{Form.commodityname}}
                <i class="el-icon-error detailTitle" @click="detailTitle"></i>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="推荐图片:" prop="commodityimage" class="headMainPic">
              <uploadSingleImg style="float: left;" :imgUrl="Form.commodityimage" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
              <el-input  style="float:left;" type="hidden" v-model="Form.commodityimage" class="inputWidth"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="商品描述:" style="margin-right:20px" prop="commoditydescription">
            <el-input type="textarea" :rows="4" v-model="Form.commoditydescription" style="width:40%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--商品弹窗-->
      <el-dialog title="请选择需要推荐的商品" :visible.sync="drugsShow" :modal-append-to-body="false" top="12vh" width="80%" center>
        <iframe :src="ProductsUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
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
        commoditymaincategory: '',  // 主类名
        commoditystate: '',  // 状态1: 上，2：下
        commodityname: '',  // 药品名
        commoditycode: '',  // 添加商品ID
        commodityimage: '',
        commoditydescription: '',
        commoditycommon: '',
        commodityfast: '',
        commoditybyself: '',
        commoditytransnational: '',
      },
      rules: {
        commoditymaincategory: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        commoditystate: [{ required: false, message: '请选择状态', trigger: 'blur' }],
        commodityname: [{ required: true, message: '请选择药品', trigger: 'blur' }],
        commodityimage: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        commoditydescription: [{ required: false, message: '请填写商品描述', trigger: 'blur' }],
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
      drugsShow: false,
      ProductsUrl: `${process.env.WEB_HOST}/manage/outSelectedInfo?limit=1&index=`,
    };
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  props: {
    drugAdd: Boolean,
  },
  methods: {
    // 上传图片
    uploadMianImg(data) {
      this.Form.commodityimage = data.url;
    },
    removeMainImg() {
      this.Form.commodityimage = '';
    },
    // 添加药品
    addDrugs() {
      this.drugsShow = true;
    },
    // 删除商品名
    detailTitle() {
      this.$confirm('此操作将执行删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Form.commodityname = '';
        this.Form.commodityimage = '';
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
    // 获取数据
    getData() {
      let _self = this;
      ajax.get(`/api/admin/GetDocRelatedDrugsDetail?id=` + _self.$route.query.id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.Form = res.data.data;
        }
      });
    },
    // 选择推荐商品返回数据
    setSelectedList(data, productNum, index, information, drugfrom) {
      let _self = this;
      if (data.length !== 0 && productNum === true) {
        if (data[0].isChecked === 1) {
          if (!data[0].getCommon && !data[0].getFast && !data[0].getByself && !data[0].transnational) {
            _self.$message({
              message: '该商品来源为空，请选择药店来源（如已选择药店来源，请选择其他有来源的商品）',
              type: 'warning'
            });
          } else {
            _self.Form.commoditycommon = data[0].getCommon;
            _self.Form.commodityfast = data[0].getFast;
            _self.Form.commoditybyself = data[0].getByself;
            _self.Form.commoditytransnational = data[0].transnational;
            _self.Form.commodityname = data[0].productName;
            _self.Form.commoditycode = data[0].productId;
            _self.Form.commodityimage = data[0].productMainImage;
            _self.drugsShow = false;
          }
        } else {
          _self.$message({
            message: '请选择已核审的商品',
            type: 'warning'
          });
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
    // 提交数据
    submitForm(ischecked) {
      let _self = this;
      _self.$refs['drugsData'].validate((valid) => {
        if (valid) {
          if (ischecked === true) {
            _self.Form.commoditystate = 1;
          } else {
            _self.Form.commoditystate = 2;
          }
          let url;
          if (this.drugAdd) {   // 新增
            url = `/api/admin/SaveRelatedDrugs`;
          }
          else if (!this.drugAdd) {  // 修改
            _self.Form.id = _self.$route.query.id;
            url = `/api/admin/SaveRelatedDrugs`;
          }
          ajax.post(url, _self.Form).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                showClose: true,
                message: res.data.message,
                type: 'success'
              });
              if (this.drugAdd) {
                _self.$router.push('/PhysiqueTest/drugs/DrugsList?categoryName=' + _self.Form.commoditymaincategory);
              } else {
                _self.$router.push('/PhysiqueTest/drugs/DrugsList?categoryName=' + _self.Form.commoditymaincategory + '&pageindex=' + _self.$route.query.pageindex);
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
    resetForm() {
      this.Form.commoditymaincategory = '';
      this.Form.commoditystate = '';
      this.Form.commodityname = '';
      this.Form.commoditycode = '';
      this.Form.commodityimage = '';
      this.Form.commoditydescription = '';
      this.Form.commoditycommon = '';
      this.Form.commodityfast = '';
      this.Form.commoditybyself = '';
      this.Form.commoditytransnational = '';
    },
  },
  created() {
    window.setSelectedList = this.setSelectedList;
    if (!this.drugAdd) {
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
#drugsWrapper{
  .mainCategory{
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
    margin-left: -260px;
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
