<template>
  <div class="detail">
    <div class="header list">
      <p class="subtitle">
        <span>当前订单状态：</span>
        <span :style="detailData.withdrawStatus===30?'color:red':''">{{getStatus(detailData.withdrawStatus)}}</span>
      </p>
    </div>
    <div class="info list">
      <p class="subtitle">提现信息</p>
      <div class="info-list">
        <p>提现商户：{{detailData.sellerName?detailData.sellerName:'暂无'}}</p>
        <p>手机号：{{detailData.mobile?detailData.mobile:'暂无'}}</p>
        <p>金额：<span style="color:red">￥{{detailData.withdrawPrice?detailData.withdrawPrice:'暂无'}}</span></p>
      </div>
    </div>
    <div class="info list">
      <p class="subtitle">收款信息</p>
      <div class="info-list">
        <p>收款行：{{detailData.openingBank?detailData.collectingBank:'暂无'}}</p>
        <p>收款账户：{{detailData.bankCardNumber?detailData.bankCardNumber:'暂无'}}</p>
        <p>开户行：{{detailData.withdrawPrice?detailData.openingBank:'暂无'}}</p>
      </div>
    </div>
    <div class="info list">
      <p class="subtitle">操作</p>
    </div>
    <div class="buttom">
      <el-button type="primary" class="button" v-if="detailData.withdrawStatus===10" @click="examine">审核</el-button>
      <el-button type="primary" class="button" v-if="detailData.withdrawStatus===20" @click="auditor(40)">已付款</el-button>
    </div>
    <!-- 审核二次确认对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="auditoShow"
      width="380px"
      center
      top="35vh"
      :modal-append-to-body="false">
      <h2 class="auditor-title">该提现申请审核是否通过？</h2>
      <span class="auditor-subtitle">提现金额：</span><span class="pic">￥{{detailData.withdrawPrice?detailData.withdrawPrice:'暂无'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditor(30)">不通过</el-button>
        <el-button type="primary" @click="auditor(20)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      detailData: {},
      auditoShow: false
    };
  },
  methods: {
    getDetail() {
      let param = {
        withdrawId: this.$route.query.id
      };
      javaRequest.post('/mall_manage/back/wallet/queryOne', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detailData = res.data.resultData;
        }
      });
    },
    getStatus(status) {
      let a = '';
      switch (status) {
        case 10:
          a = '待审核';
          break;
        case 20:
          a = '待付款';
          break;
        case 30:
          a = '已取消';
          break;
        case 40:
          a = '已完成';
          break;
      }
      return a;
    },
    // 审核二次确认
    examine() {
      this.auditoShow = true;
    },
    auditor(status) {
      let obj = {
        withdrawStatus: status,
        withdrawId: this.detailData.withdrawId
      };
      this.auditoShow = false;
      javaRequest.post('/mall_manage/back/wallet/updateWithdrawCash', obj).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getDetail();
        }
      });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="less" scoped>
// .detail{
//   color: #f00;
// }
.header{
    height: 62px;
    width: 100%;
    .subtitle{
    line-height: 62px;
    font-weight: 900;
  }
}
.list{
    background: #f3f3f3;
    padding-left: 30px;
    margin-bottom: 10px;
    p{
      line-height: 26px;
    }
    .subtitle{
    font-size:18px;
    font-weight: 900;
    margin-bottom: 10px;
  }
}
.buttom{
  text-align: center;
  button{
    margin-left: 30px;
  }
}
.auditor-title{
  margin-left: 25px;
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 20px;
}
.auditor-subtitle{
  font-size: 20px;
  margin-left: 25px;
}
.pic{
  font-size: 20px;
  color: red;
}
</style>
