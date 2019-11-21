<template>
  <div class="edit">
    <div class="toolbar-wrapper">
      <el-form ref="edit_chinesedrug_form" label-width="100px" size="small" :model="editData" :rules="rules">
        <el-form-item label="商品编号:" style="width: 360px;" prop="GoodsNum">
          <el-input type="text" placeholder="请输入商品编号" v-model="editData.GoodsNum">
          </el-input>
        </el-form-item>
        <el-form-item label="商品名称:" style="width: 360px;" prop="DrugName">
          <el-input type="text" placeholder="请输入商品名称" v-model="editData.DrugName">
          </el-input>
        </el-form-item>
        <el-form-item label="单位:" style="width: 360px;" prop="Unit">
          <el-input type="text" placeholder="请输入单位" v-model="editData.Unit">
          </el-input>
        </el-form-item>
        <el-form-item label="价格:" style="width: 360px;" prop="UnitPrice">
          <el-input type="text" placeholder="请输入每单位价格" v-model="editData.UnitPrice">
          </el-input>
        </el-form-item>
        <el-form-item label="代码:" style="width: 360px;" prop="PyCode">
          <el-input type="text" placeholder="请输入代码" v-model="editData.PyCode">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select v-model="editData.Status">
            <el-option :label="'启用'" :value="0"></el-option>
            <el-option :label="'禁用'" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="药品图片:" style="width: 600px;" prop="GoodsPic">
          <uploadSingleImg :imgUrl="editData.GoodsPic" :limit="1" :fileName="'drugImg'" @uploadSuccess="uploadImg" @removeImg="removeImg"></uploadSingleImg>
        </el-form-item>
        <el-form-item style="width: 360px;">
          <el-button @click="resetForm()">重置</el-button>
          <el-button @click="submitForm()" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      editData: {
        ID: '',
        GoodsNum: '',
        DrugName: '',
        Unit: '',
        UnitPrice: '',
        PyCode: '',
        Status: 0,
        GoodsPic: ''
      },
      rules: {
        GoodsNum: [{ required: true, message: '请输入商品编号', trigger: 'blur' }],
        DrugName: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        Unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        UnitPrice: [{ required: true, message: '请输入没单位价格', trigger: 'blur' }],
        PyCode: [{ required: true, message: '请输入代码', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    let drugId = this.$route.query.drugId;
    if (drugId) {
      let url = '/api/ordermanage/getdocherbschinesedetail';
      ajax.get(url, {
        'params': { 'id': drugId }
      }).then((res) => {
        if (res.data && res.data.code === 0) {
          let drug = res.data.data;
          this.editData.ID = drug.id;
          this.editData.GoodsNum = drug.goodsnum;
          this.editData.DrugName = drug.drugname;
          this.editData.PyCode = drug.pycode;
          this.editData.Unit = drug.unit;
          this.editData.UnitPrice = drug.unitprice;
          this.editData.Status = drug.status;
          this.editData.GoodsPic = drug.goodspic;
        }
      });
    }
  },
  methods: {
    submitForm() {
      this.$refs['edit_chinesedrug_form'].validate((valid) => {
        if (valid) {
          let url = `/api/ordermanage/updatechinesedocherbs`;
          if (!this.editData.ID) {
            this.editData.ID = 0;
          }
          ajax.post(url, this.editData).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              this.closeMe();
              let tap = {
                name: 'chinesedruglist',
                path: '/orderManage/chinesedrug',
                meta: {
                  title: '中药管理'
                }
              };
              this.$store.dispatch('addVisitedViews', tap);
              this.tabValue = tap.name;
              this.$router.push({
                name: tap.name
              });
            }
          });
        }
      });
    },
    uploadImg(file, filelist) {
      this.editData.GoodsPic = filelist;
    },
    removeImg(filelist) {
      this.editData.GoodsPic = filelist;
    },
    // 重置
    resetForm() {
      this.$refs['edit_chinesedrug_form'].resetFields();
      this.editData.GoodsPic = '';
    },
    closeMe() {
      let currentTap = {
        name: this.$route.name,
        path: this.$route.path
      };
      this.$store.dispatch('delVisitedViews', currentTap);
    }
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  }
};

</script>
<style>
textarea {
  resize: none !important;
}

</style>
