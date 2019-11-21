<template>
  <el-form :model="user" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">药葫芦中控后台管理系统</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="user.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="user.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
      </el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
import { javaLogin } from '@/api/user';
import { setToken } from '@/utils/auth';
// import { initRoute } from '@/router/generateRouter';
export default {
  data() {
    return {
      logining: false,
      user: {
        account: '',
        checkPass: ''
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          // { validator: validaePass }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    handleSubmit2(ev) {
      let _self = this;
      _self.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          javaLogin(_self.user.account, _self.user.checkPass).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              let userToken = res.data.resultData.usertoken;
              if (userToken) {
                setToken(userToken);
              }
              // 保存userid
              let userid = res.data.resultData.userId;
              if (userid) {
                sessionStorage.setItem('userid', userid);
              }
              // 保存锁定名字
              let nickname = res.data.resultData.account;
              if (nickname) {
                sessionStorage.setItem('nickname', nickname);
              }
              _self.$store.dispatch('setNavs', []);
              _self.$store.dispatch('setPermission', []);
              _self.pageRedirect();
            }
          });
        } else {
          return false;
        }
      });
    },
    pageRedirect() {
      this.$router.push('/home/index');
      // let returnUrl = sessionStorage.getItem('returnUrl');
      // if (returnUrl) {
      //   sessionStorage.removeItem('returnUrl');
      //   location.href = returnUrl;
      // } else {
      //   this.$router.push('/home/index');
      //   // let url = `${process.env.WEB_HOST}/home/index`;
      //   // location.href = url;
      // }
    }
  }
};
</script>
<style lang="less" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  position: relative;
  top: 180px;
  background-clip: padding-box;
  margin: auto;
  width: 450px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
