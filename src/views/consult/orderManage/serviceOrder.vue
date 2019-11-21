<template>
  <div>
    <el-form ref="Prescriptions" :model="Prescriptions" label-width="200px" class="demo-ruleForm"  size="small" label-position="left" :rules="rules">
      <el-form-item label="选择照片，最多三张" prop="recipe_pic_url">
        <uploadSingleImg :limit=3 :imgUrl="Prescriptions.recipe_pic_url" :fileName="'subImage'" @uploadSuccess="uploadSubImg" @removeImg="removeSubImg"></uploadSingleImg>
        <el-input class="left" type="hidden" v-model="Prescriptions.recipe_pic_url"></el-input>
      </el-form-item>
      <el-form-item label="选择医生" prop="doc_uid">
        <el-select v-model="Prescriptions.doc_uid" placeholder="请选择医生" filterable style="width: 500px">
          <el-option v-for="item in doctorList" :key="item.userid" :label='item.realname+"("+item.mobile+")"' :value='item.userid' ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="诊金" prop="treat_fee">
        <el-input v-model.number="Prescriptions.treat_fee" style="width: 500px"></el-input>
      </el-form-item>
      <el-row label-position="top">
        <!--<el-col :span="6">-->
        <el-form-item label="是否煎煮">
          <el-radio v-model="Prescriptions.is_suffering" label="1">是</el-radio>
          <el-radio v-model="Prescriptions.is_suffering" label="0">否</el-radio>
        </el-form-item>
        <!--</el-col>-->
        <el-form-item label="是否孕妇">
          <el-radio v-model="Prescriptions.is_pregnant" label="1">是</el-radio>
          <el-radio v-model="Prescriptions.is_pregnant" label="0">否</el-radio>
        </el-form-item>
      </el-row>
      <el-form-item label="订单备注" >
        <el-input class="orderMark" type="textarea" v-model="Prescriptions.remark" style="width: 500px;" ></el-input>
      </el-form-item>
      <el-form-item class="form-button-wrapper">
        <el-button type="primary" @click='onSubmit("Prescriptions")' icon="el-icon-check">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import ylajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      // 医生列表
      doctorList: [],
      // 处方
      Prescriptions: {
        // 处方拍照
        recipe_pic_url: '',
        // 是否煎煮
        is_suffering: '0',
        // 是否孕妇
        is_pregnant: '0',
        // 医生id
        doc_uid: '',
        // 诊金
        treat_fee: '',
        // 订单备注
        remark: '',
      },
      // 验证
      rules: {
        recipe_pic_url: [
          { required: true, message: '请选择至少一个文件上传', trigger: 'change' },
        ],
        doc_uid: [
          { required: true, message: '请选择医生', trigger: 'change' },
        ],
        treat_fee: [
          { required: true, message: '请输入诊金', trigger: 'change' },
          { type: 'number', message: '请输入数字', trigger: 'change' },
        ],
      }
    };
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  methods: {
    onSubmit(formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证成功，提交
          let datas = {
            // 0:数字订单 1：照片订单
            order_type: 1,
            // 0无图片1有图片
            recipe_pic_status: 1,
            doc_uid: this.Prescriptions.doc_uid,
            treat_fee: this.Prescriptions.treat_fee,
            remark: this.Prescriptions.remark,
            Prescriptions: [{
              is_suffering: parseInt(this.Prescriptions.is_suffering, 10),
              is_pregnant: parseInt(this.Prescriptions.is_pregnant, 10),
              recipe_pic_url: this.Prescriptions.recipe_pic_url
            }]
          };
          ylajax.post('/api/ordermanage/SaveCustomerPrescription', datas).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              // 验证成功后重置
              this.$refs[formName].resetFields();
              this.Prescriptions = {
                recipe_pic_url: '',
                is_suffering: '0',
                is_pregnant: '0',
                doc_uid: '',
                treat_fee: '',
                remark: '',
              };
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 上传照片
    uploadSubImg(data, imgUrl) {
      this.Prescriptions.recipe_pic_url = imgUrl;
    },
    // 删除照片
    removeSubImg(url) {
      this.Prescriptions.recipe_pic_url = url;
    },
    // 获取医生列表
    getDoctorData() {
      ylajax.get('/api/ordermanage/GetAllDocdoctorList').then((res) => {
        if (res.status === 200 && !!res.data) {
          this.doctorList = res.data.data;
        }
      });
    }
  },
  created() {
    this.getDoctorData();
  }
};
</script>
<style lang="less" scoped="">
  .form-button-wrapper {
    height: 80px;
    // text-align: center;
    margin: 25px 0 0 170px;
  }
  .orderMark{
    width: 300px;
    /deep/ .el-textarea__inner{
      height: 90px;
    }
  }
</style>
