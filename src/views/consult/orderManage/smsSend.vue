<template>
  <div>
    <el-form ref="form" :model="form" label-width="200px" class="demo-ruleForm"  size="small" label-position="top" :rules="rules">
      <el-form-item label="电话号码" prop="mobile">
        <el-input v-model="form.mobile" placeholder='多个电话号码请用","隔开'></el-input>
      </el-form-item>
      <el-form-item label="短信内容" prop="content">
        <el-input type="textarea" v-model="form.content" placeholder="尽量不要包含特殊字符"></el-input>
      </el-form-item>
      <el-form-item class="form-button-wrapper" style="text-align:center;">
        <el-button type="primary" @click='onSubmit("form")' icon="el-icon-check" >发送短信</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ylajax from '@/utils/yilinAjax';
export default {
  data() {
    let mobileRe = (rule, value, callback) => {
      let re = /^1[34578][0-9]{9}(,1[34578][0-9]{9})*$/;
      if (value === '') {
        callback(new Error('请输入电话号码'));
      } else if (re.test(value)) {
        callback();
      } else {
        callback(new Error('电话号码格式输入错误'));
      }
    };
    return {
      form: {
        mobile: '',
        content: ''
      },
      // 验证
      rules: {
        mobile: [
          { validator: mobileRe, trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入短信内容', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证成功，提交
          ylajax.post('/api/ordermanage/sendMessage', this.form).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _this.$alert('发送成功', '发送结果', {
                confirmButtonText: '确定'
              });
            } else {
              _this.$alert('发送失败', '发送结果', {
                confirmButtonText: '确定'
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
