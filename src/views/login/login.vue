<template>
  <div id="particles-js">
    <div class="loginBox">
    <h2 class="title">药葫芦中控后台管理系统</h2>
    <el-form :model="user" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="login-container">
      <el-form-item prop="account">
        <el-input type="text" v-model="user.account" auto-complete="off" placeholder="账号" class="inputPassword"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="user.checkPass" auto-complete="off" placeholder="密码" @keydown.enter="handleSubmit2" class="inputPassword1"></el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input type="text" v-model="user.verifyCode" auto-complete="off" placeholder="图形验证码" @keyup.enter.native="handleSubmit2" class="verifyCodeText"></el-input>
        <img :src="codeUrl" alt=""  @click="refreshImg" class="verifyCodeImg">
      </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="success" class="login" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
          </el-button>
        </el-form-item>
    </el-form>
    </div>
  </div>
</template>
<script>
import { javaLogin } from '@/api/user';
import { setToken } from '@/utils/auth';
require('particles.js');
export default {
  data() {
    return {
      logining: false,
      user: {
        account: '',
        checkPass: '',
        verifyCode: '',
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          // { validator: validaePass }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { validator: validaePass2 }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      checked: true,
      codeUrl: `${process.env.MALL_BASE_HOST}/mall_manage/back/login/authCode`
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    async handleSubmit2(ev) {
      let _self = this;

      _self.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          if (_self.user.checkPass) {
            javaLogin(_self.user.account, _self.user.checkPass, _self.user.verifyCode).then((res) => {
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
                const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                let value = reg.test(_self.user.checkPass);
                if (!reg.test(value)) {
                  // console.log(value);
                  if (value === true) {
                    _self.pageRedirect();
                  } else {
                    _self.$router.push({
                      path: '/modifyPassword',
                      query: {
                        id: sessionStorage.getItem('userid'),
                        tip: 1,
                      }
                    });
                  }
                }
              }
            });
            /*
              }
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
            */
          } else {
            return false;
          }
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
    },
    refreshImg() {
      let random = this.getRandom(8);
      this.codeUrl = `${process.env.MALL_BASE_HOST}/mall_manage/back/login/authCode?v=${random}`;
    },
    getRandom(n) {
      let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      let res = '';
      for (let i = 0; i < n; i++) {
        let id = Math.ceil(Math.random() * 35);
        res += chars[id];
      }
      return res;
    },
    particlesInit() {
      /* eslint-disable */
      particlesJS('particles-js', {
        'particles': {
          'number': {
            'value': 100,
            'density': {
              'enable': true,
              'value_area': 900
            }
          },
          'color': {
            'value': '#ffffff'
          },
          'shape': {
            'type': 'triangle',
            'stroke': {
              'width': 0,
              'color': '#ffffff'
            },
            'polygon': {
              'nb_sides': 5
            },
            'image': {
              'src': 'img/github.svg',
              'width': 100,
              'height': 100
            }
          },
          'opacity': {
            'value': 0.5,
            'random': false,
            'anim': {
              'enable': false,
              'speed': 1,
              'opacity_min': 0.1,
              'sync': false
            }
          },
          'size': {
            'value': 3,
            'random': true,
            'anim': {
              'enable': false,
              'speed': 40,
              'size_min': 0.1,
              'sync': false
            }
          },
          'line_linked': {
            'enable': true,
            'distance': 150,
            'color': '#ffffff',
            'opacity': 0.4,
            'width': 1
          },
          'move': {
            'enable': false,
            'speed': 6,
            'direction': 'none',
            'random': false,
            'straight': false,
            'out_mode': 'out',
            'bounce': false,
            'attract': {
              'enable': false,
              'rotateX': 600,
              'rotateY': 1200
            }
          }
        },
        'interactivity': {
          'detect_on': 'canvas',
          'events': {
            'onhover': {
              'enable': true,
              'mode': 'grab'
            },
            'onclick': {
              'enable': true,
              'mode': 'push'
            },
            'resize': true
          },
          'modes': {
            'grab': {
              'distance': 140,
              'line_linked': {
                'opacity': 1
              }
            },
            'bubble': {
              'distance': 400,
              'size': 40,
              'duration': 2,
              'opacity': 8,
              'speed': 3
            },
            'repulse': {
              'distance': 200,
              'duration': 0.4
            },
            'push': {
              'particles_nb': 4
            },
            'remove': {
              'particles_nb': 2
            }
          }
        },
        'retina_detect': true
      });
    }
  },
  mounted() {
    this.particlesInit();
  }
};

</script>
<style lang="less" scoped>
#particles-js  {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #2e3344;
  background-image: url("");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  /deep/canvas {
    display: block;
    vertical-align: bottom;
  }
  .loginBox {
    width:440px;
    height: 400px;
    background-color: #fff;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;;
    margin-top: -220px;
    margin-left: -220px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .title {
    text-align: center;
    color: #505458;
    margin: 0 10px 20px 10px;
  }

  .login-container {
    margin: auto;
    width: 380px;
    .inputPassword {
      /deep/ .el-input__inner {
        height: 46px;
        border-color: #e7ecee;
      }
    }

    .inputPassword1 {
      /deep/ .el-input__inner {
        height: 46px;
        border-color: #e7ecee;
      }
    }

    .verifyCodeText {
      width: calc(100% - 100px);

      /deep/ .el-input__inner {
        width: 100%;
        height: 46px;
        border-color: #e7ecee;
        vertical-align: middle;
      }
    }

    .verifyCodeImg {
      display: inline-block;
      width: 90px;
      height: 46px;
      vertical-align: middle;
      border: 0;
    }

    .remember {
      margin: 5px 0px 20px 0px;

      /deep/ .el-checkbox__inner {
        background-color: #67c23a;
        border-color: #67c23a;
      }

      /deep/ .el-checkbox__label {
        color: #67c23a;
      }
    }
  }

  .login {
    border: 0;
  }
}

</style>
