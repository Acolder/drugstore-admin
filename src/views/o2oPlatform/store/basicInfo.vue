<template>
  <div class="box">
    <div class="info-til">
      <div class="info-btn">基本信息</div>
    </div>
    <div class="info-box">
      <div class="layered">
        <div class="layered-til">
          机构品牌:
        </div>
        <div class="layered-info">
          {{storeBasicInfo.organizationAbbreviation}}
        </div>
      </div>
      <div class="layered">
        <div class="layered-til">
          主店名称:
        </div>
        <div class="layered-info">
          {{storeBasicInfo.realName}}
        </div>
      </div>
      <div class="layered">
        <div class="layered-til">
          主店地址:
        </div>
        <div class="layered-info">
          {{storeBasicInfo.address}}
        </div>
      </div>
      <div class="layered">
        <div class="layered-til">
          账号:
        </div>
        <div class="layered-info">
          {{storeBasicInfo.userName}}
        </div>
      </div>
      <div class="layered">
        <div class="layered-til">
          密码:
        </div>
        <div class="layered-info">
          <div>
            *******
          </div>
          <div><el-button type="primary" plain @click="modifyPassword">修改密码</el-button></div>
        </div>
      </div>
      <div class="layered">
        <div class="layered-til">
          绑定手机号:
        </div>
        <div class="layered-info">
          <div>
            {{storeBasicInfo.phone}}
          </div>
          <div>
            <el-button type="primary" plain @click="modifyPhone">更换手机号</el-button>
          </div>
        </div>
      </div>
      <!-- <div class="layered">
        <div class="layered-til">
          首次登录验证手机:
        </div>
        <div class="layered-info">
          <div>
            已关闭
          </div>
          <div>
            <el-switch v-model="value3"></el-switch>
          </div>
        </div>
      </div> -->
      <!-- <div class="large-layered">
        <div class="layered-til">
          最近登录:
        </div>
        <div class="layered-info">
          <ul>
            <li>
              <div>
                <p>Windows</p>
                <p>2019.01.01  广东 深圳 Chrome</p>
              </div>
              <div>
                本机登录
              </div>
            </li>
          </ul>
          <div class="layered-til txtRight">
            <el-button type="primary" plain @click="seeRecord">更多记录</el-button>
          </div>
        </div>
      </div> -->
    </div>
    <div class="info-til">
      <div class="info-btn">打款信息</div>
    </div>
    <div class="info-box">
      <div class="layered">
        <div class="layered-til">
          开户行:
        </div>
        <div class="layered-info">
          {{storeBasicInfo.openingBank}}
        </div>
      </div>
      <div class="layered">
        <div class="layered-til">
          银行账号:
        </div>
        <div class="layered-info">
          {{storeBasicInfo.bankCardNumber}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      // userId: 'DS_Token_YD00040006',
      userId: this.$route.query.userId,
      storeBasicInfo: {},
      // value3: true,
      modifyData: {
        userId: this.$route.query.userId,
        password: '',
        phone: '',
      }
    };
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  methods: {
    getTableData() {
      let data = {
        userId: this.userId
      };
      console.log(data);
      javaAjax.post(`/mall_manage/store/third/baseMessage`, data).then((res) => {
        console.log('店主基础信息', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.storeBasicInfo = res.data.resultData;
        }
      });
    },
    // 修改密码
    modifyPassword() {
      this.$prompt('请输入新密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\w]{6,12}$/,
        inputErrorMessage: '密码的格式为6-12位，只能是字母、数字和下划线'
      }).then(({ value }) => {
        this.modifyData.password = value;
        console.log(this.modifyData.password);
        javaAjax.post(`/mall_manage/store/third/updateMessage`, this.modifyData).then((res) => {
          console.log('修改主店密码、手机号', res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.$message({
              type: 'success',
              message: res.data.msg,
            });
            this.modifyData.password = '';
            this.getTableData();
          } else {
            this.modifyData.password = '';
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
      });
    },
    // 更换手机号
    modifyPhone() {
      this.$prompt('请输入手机号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^1[34578]\d{9}$/,
        inputErrorMessage: '请输入正确的手机号码'
      }).then(({ value }) => {
        this.modifyData.phone = value;
        // this.modifyData.phone = Number(value);
        // console.log(this.modifyData.phone);
        javaAjax.post(`/mall_manage/store/third/updateMessage`, this.modifyData).then((res) => {
          console.log('修改主店密码、手机号', res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.$message({
              type: 'success',
              message: res.data.msg,
            });
            this.modifyData.phone = '';
            this.getTableData();
          } else {
            this.modifyData.phone = '';
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
      });
    },
    // 更多记录
    seeRecord() {
      console.log('更多记录');
    }
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang="less" scoped>
.info-til{
  height: 40px;
  background: #36A9E1;
  display: flex;
  color: #000;
  margin: 5px 0;
  .info-btn{
    font-weight: bold;
    height: 100%;
    line-height: 40px;
    padding: 0 10px;
  }
}
.info-box{
  padding: 10px;
  border: 1px solid #000;
  .layered{
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .layered-til{
      width: 200px;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .layered-info{
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .layered:last-child{
    border-bottom: none;
  }
  .large-layered{
    display: flex;
    justify-content: space-between;
    .layered-til{
      width: 200px;
      height: 60px;
      display: flex;
      align-items: center;
    }
    .txtRight{
      justify-content: flex-end;
    }
    .layered-info{
      flex: 1;
      display: flex;
      justify-content: space-between;
      ul{
        flex: 1;
      }
      li{
        height: 60px;
        display: flex;
        justify-content: space-between;
        >div{
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
}
</style>