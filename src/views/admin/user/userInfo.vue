<template>
  <el-form ref="userData" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="用户名:" prop="userName" v-if="operation===1||operation===2">
      <el-input v-model="form.userName" clearable></el-input>
    </el-form-item>

    <el-form-item label="密码:" prop="password" v-if="operation===operationEnum.append||operation===operationEnum.changePassword">
      <el-input type="password" v-model="form.password" clearable auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="姓名:" prop="realName" v-if="operation===operationEnum.append||operation===operationEnum.edit">
      <el-input v-model="form.realName" clearable></el-input>
    </el-form-item>

    <el-form-item label="手机号:" prop="phone" v-if="operation===operationEnum.append||operation===operationEnum.edit">
      <el-input v-model="form.phone" clearable></el-input>
    </el-form-item>

    <el-form-item label="邮箱:" prop="email" v-if="operation===operationEnum.append||operation===operationEnum.edit">
      <el-input v-model="form.email" clearable></el-input>
    </el-form-item>

    <el-form-item label="头像:" :prop="'headPortrait'" v-if="operation===operationEnum.append||operation===operationEnum.edit">
      <uploadImg :imgUrl="form.headPortrait" :fileName="'userheadPortrait'" @uploadSuccess="addUploadImg" @removeImg="addRemoveImg"></uploadImg>
      <el-input class="left" type="hidden" v-model="form.headPortrait"></el-input>
    </el-form-item>

    <el-form-item style="text-align:center;" label-width="0px">
      <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
      <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import uploadImg from '@/components/upload/uploadImg';
import java from '@/utils/javaApiRequest';
export default {
  data() {
    // 手机号验证
    let validatePhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      } else {
        callback();
      }
    };
    // 密码验证
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        const reg = /^\w+$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('密码只能为数字、字母和下划线'));
        }
      }
    };
    return {
      form: {
        // 用户名
        userName: '',
        // 密码
        password: '',
        // 姓名
        realName: '',
        // 电话
        phone: '',
        // 邮箱
        email: '',
        // 头像
        headPortrait: '',
      },
      rules: {
        userName: [
          { required: true, message: '用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, message: '请输入至少6位字符', trigger: 'blur' }
        ],
        realName: [
          { required: false, message: '姓名', trigger: 'blur' },
        ],
        phone: [
          { required: false, validator: validatePhone, trigger: 'blur' },
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
      },
      // 操作枚举 1:新增,2:编辑,3:修改密码
      operationEnum: { append: 1, edit: 2, changePassword: 3 },
    };
  },
  props: {
    operation: {
      type: Number,
      default: 1
    },
  },
  components: {
    'uploadImg': uploadImg
  },
  methods: {
    // 上传头像
    addUploadImg(data, imgUrl) {
      this.form.headPortrait = imgUrl;
    },
    // 删除头像
    addRemoveImg(url) {
      this.form.headPortrait = url;
    },
    // 提交数据
    submitForm() {
      let _self = this;
      _self.$refs['userData'].validate((valid) => {
        if (valid) {
          let postData = _self.form;
          let postUrl = '/mall_manage/back/addUser';
          if (_self.operation === _self.operationEnum.edit || _self.operation === _self.operationEnum.changePassword) {
            postUrl = '/mall_manage/back/updateUser';
            if (_self.operation === _self.operationEnum.edit) {
              // 编辑操作不提交password字段
              delete postData['password'];
            } else if (_self.operation === _self.operationEnum.changePassword) {
              postData = {
                userId: postData.userId,
                password: postData.password,
              };
            }
          }
          java.post(postUrl, postData).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: 'success'
              });
              this.$emit('formSubmitSuccess');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
        else {
          return false;
        }
      });
    },
    // 重置
    resetForm() {
      this.form.userName = '';
      this.form.password = '';
      this.form.realName = '';
      this.form.phone = '';
      this.form.email = '';
      this.form.headPortrait = '';
    },
    // 设置userData
    setFormData(data) {
      let _self = this;
      if (data) {
        for (let key in _self.form) {
          if (data.hasOwnProperty(key)) {
            if (_self.operation === _self.operationEnum.edit || _self.operation === _self.operationEnum.changePassword) {
              if (key === 'password') {
                continue;
              }
            }
            _self.$set(_self.form, key, data[key]);
          }
        }
        if ((_self.operation === _self.operationEnum.edit || _self.operation === _self.operationEnum.changePassword) && data.hasOwnProperty('userId')) {
          _self.$set(_self.form, 'userId', data['userId']);
        }
      }
    }
  },
};
</script>
