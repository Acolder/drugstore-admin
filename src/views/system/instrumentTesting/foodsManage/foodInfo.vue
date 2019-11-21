<template>
  <div id="foodInfoWrap">
    <el-form ref="foodData" :model="foodData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="食材名称" prop="food_name" class="source">
            <el-input style="width:45%;" v-model.trim="foodData.food_name" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入脏食材名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="食材配图" :prop="'pic_url'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}">
            <uploadImg :imgUrl="foodData.pic_url" :fileName="'pic_url'" @uploadSuccess="uploadImgMain" @removeImg="removeImgMain" class="upImg1"></uploadImg>
            <el-input class="left" type="hidden" v-model="foodData.pic_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="食材物性" prop="food_property">
            <el-input type="textarea" :rows="4" v-model="foodData.food_property" style="width:45%" placeholder="请勿输入特殊字符，以免提交失败"></el-input>
            <span class="commonSpan">请勿输入特殊字符（@#￥%...），以免保存失败</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="食材功效" prop="food_effect">
            <el-input type="textarea" :rows="4" v-model="foodData.food_effect" style="width:45%" placeholder="请勿输入特殊字符，以免提交失败"></el-input>
            <span class="commonSpan">请勿输入特殊字符（@#￥%...），以免保存失败</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="食材详情" prop="food_details">
            <el-input type="textarea" :rows="4" v-model="foodData.food_details" style="width:45%" placeholder="请勿输入特殊字符，以免提交失败"></el-input>
            <span class="commonSpan">请勿输入特殊字符（@#￥%...），以免保存失败</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="如何挑选" prop="how_choose">
            <el-input type="textarea" :rows="4" v-model="foodData.how_choose" style="width:45%" placeholder="请勿输入特殊字符，以免提交失败"></el-input>
            <span class="commonSpan">请勿输入特殊字符（@#￥%...），以免保存失败</span>
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
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      foodData: {
        food_name: '',
        pic_url: '',
        food_property: '', // 物性
        food_effect: '', // 功效
        food_details: '', // 详情
        how_choose: '',  // 挑选
      },
      rules: {
        food_name: [
          { required: true, message: '请输入食材名', trigger: 'blur' },
        ],
        food_property: [
          { required: false, message: '请输入食材名', trigger: 'blur' },
        ],
        food_effect: [
          { required: false, message: '请输入食材名', trigger: 'blur' },
        ],
        food_details: [
          { required: false, message: '请输入食材名', trigger: 'blur' },
        ],
        how_choose: [
          { required: false, message: '请输入食材名', trigger: 'blur' },
        ],
      }
    };
  },
  props: {
    addFood: Boolean
  },
  components: {
    'uploadImg': uploadImg,
  },
  methods: {
    // 上传图
    uploadImgMain(data, imgUrl) {
      this.foodData.pic_url = imgUrl;
    },
    // 删除图
    removeImgMain(url) {
      this.foodData.pic_url = url;
    },
    resetForm() {
      this.$refs['foodData'].resetFields();
    },
    // 提交
    submitForm() {
      let _self = this;
      _self.$refs['foodData'].validate((valid) => {
        if (valid) {
          this.commit();
        }
        else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    commit() {
      let _self = this;
      let param = _self.foodData;
      let url;
      if (_self.addFood) {
        url = `/api/borrow/CreateFoodManageInfo`;
      } else {
        url = `/api/borrow/UpdateFoodManageInfo`;
      }
      ajax.post(url, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.$router.push({
            path: '/instrumentTesting/foodsManage/foodsList',
            query: ''
          });
        } else {
          return false;
        }
      });
    },
    // 获取详情
    getFoodDetail() {
      let _self = this;
      let id = _self.$route.query.id;
      ajax.get(`/api/borrow/GetFoodManageInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.foodData = res.data.data;
        }
      });
    }
  },
  created() {
    if (!this.addFood) {
      this.getFoodDetail();
    }
  }
};
</script>

<style lang="less" scoped>
.footer{
  text-align: center;
  margin-left: -100px;
  margin-bottom: 70px;
}
.commonSpan{
  color: red;
}
</style>

