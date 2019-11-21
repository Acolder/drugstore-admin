<template>
  <el-form ref="roleData" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="form.roleName" clearable></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remark">
      <el-input type="textarea" v-model="form.remark" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
      <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import java from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      form: {
        roleName: '',
        remark: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ],
      },
    };
  },
  props: {
    // 是否新增
    isAdd: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    // 提交数据
    submitForm() {
      let _self = this;
      _self.$refs['roleData'].validate((valid) => {
        if (valid) {
          let param = _self.form;
          let postUrl = '/mall_manage/back/insertRole';
          if (!_self.isAdd) {
            postUrl = '/mall_manage/back/updateRole';
          }
          java.post(postUrl, param).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: 'success'
              });
              _self.$emit('formSubmitSuccess');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
        else {
          _self.$alert('表单验证失败,请检查填写数据是否完整、有效', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    setFormData(data) {
      // console.log(data);
      let _self = this;
      if (data) {
        for (let key in _self.form) {
          if (data.hasOwnProperty(key)) {
            _self.$set(_self.form, key, data[key]);
          }
        }
        if (data.hasOwnProperty('roleId')) {
          _self.$set(_self.form, 'roleId', data['roleId']);
        }
      }
    },
    // 重置
    resetForm() {
      this.$refs['roleData'].resetFields();
    },
  }
};
</script>

