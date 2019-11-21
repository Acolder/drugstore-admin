<template>
<div>
  <h2>优惠券详情</h2>
  <div class="detail">
    <el-row>
      <el-col :span="12">
        <span>名称：{{detail.couponName}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>可领用群体：{{detail.accessibleGroup}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>规则：{{detail.ruleDescription}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span v-if="detail.startDate">使用时间：{{detail.startDate}}至{{detail.endDate}}</span>
        <span v-else>有效时间：{{detail.effectiveDate}}天后</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>优惠金额：{{detail.preferentialAmount}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>使用门槛：{{detail.useTheThreshold}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>发行数量：{{detail.distributionQuantity}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>每人限领：{{detail.limitCollarPerPerson}}</span>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      detail: {},
      ids: {
        couponId: this.$route.query.id,
        securitiesInformationId: this.$route.query.secuId
      }
    };
  },
  methods: {
    getDatail() {
      javaRequest.post('/mall_manage/back/coupon/queryDetailsOfCoupons', this.ids).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detail = res.data.resultData;
        }
      });
    }
  },
  created() {
    this.getDatail();
  }
};
</script>

<style lang="less" scoped>
.detail{
  padding: 15px 30px;
  background: #ccc;
  margin-top: 20px;
  /deep/ .el-row{
    margin: 15px 0;
  }
}
</style>
