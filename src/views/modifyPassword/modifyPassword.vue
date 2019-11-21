<template>
  <div id="particles-js">
    <div class="formBox">
    <h2 class="title">药葫芦中控后台管理系统</h2>
    <p class="tip" v-if="this.$route.query.tip == 1">该密码不符合安全规范，请修改密码</p>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="login-container">
      <el-form-item prop="password">
        <el-input type="password" v-model.trim="ruleForm.password" placeholder="请输入密码,密码必须为6-16位的数字和字母的组合" autocomplete="off" class="inputPassword"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model.trim="ruleForm.checkPass" placeholder="再次确认密码" @keyup.enter="submitForm(ruleForm)" autocomplete="off" class="inputPassword1"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="account">
        <el-input type="text" v-model="user.account" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="user.checkPass" auto-complete="off" placeholder="请再次输入密码"></el-input>
      </el-form-item> -->
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" class="login" style="width:100%;background-color:#7266ba" @click.native.prevent="submitForm(ruleForm)" :loading="logining">确认修改
        </el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import java from '@/utils/javaApiRequest';
require('particles.js');
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      // /^[A-Za-z0-9]{6,16}$/   /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!reg.test(value)) {
        // console.log(value);
        callback(new Error('密码必须为6-16位的数字和字母的组合'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        userId: this.$route.query.id,
        password: '',
        checkPass: '',
      },
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
      },
      logining: false,
    };
    /*
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
        },
      return {
        user: {
          pass: '',
          checkPass: ''
        },
        rules2: {
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            // { validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请再次确认密码', trigger: 'blur' },
            // { validator: validaePass2 }
          ]
        },
      };
    */
  },
  methods: {
    submitForm(formName) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          java.post(`/mall_manage/back/updateUser`, this.ruleForm).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              });
              this.$router.push('/login');
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
#particles-js{
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
  .formBox {
    width:440px;
    height: 300px;
    background-color: #fff;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;;
    margin-top: -150px;
    margin-left: -220px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .title {
    text-align: center;
    color: #505458;
    padding: 0 0 20px 0;
  }
  .tip{
    color: red;
    text-align: center;
    margin-bottom: 10px;
  }
  .login-container {
    margin: auto;
    width: 380px;
    .inputPassword{
      border-color: #4d5558;
      /deep/ .el-input__inner{
        height: 46px;
      }
    }
    .inputPassword1{
      /deep/ .el-input__inner{
        height: 46px;
      }
    }
  }
}
.login{
  border: 0;
}
</style>
