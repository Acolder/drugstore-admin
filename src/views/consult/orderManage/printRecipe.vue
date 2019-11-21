<template>
  <div id="recipeEntry">
    <div v-if="btnShow">
      <el-button id="printBtn" type="primary" plain class="printBtn" @click="print">打印</el-button>
    </div>
    <input type="hidden" id="order_id" value="848257605485727744">
    <div class="container">
      <div class="header">
        <div class="title1"></div>
        <div class="title2">门诊处方笺</div>
        <img class="tips" src="./imgs/tips.png"></div>
      <div class="info">
        <ul class="info_detail clearfix">
          <li>姓名：{{recipeDetail.username}}</li>
          <li>性别：{{recipeDetail.gender === 1 ? '男' : '女'}}</li>
          <li>年龄：{{recipeDetail.age}}</li>
        </ul>
        <ul class="clearfix">
          <li>初步诊断：{{recipeDetail.Diagnosis}}</li>
        </ul>
      </div>
      <div class="content"><img class="orderlogo" src="./imgs/orderlogo.png">
        <ul class="orderlist clearfix">
          <li v-for="(item ,index) in recipeDetail.docprescriptiondetails " :key="index">
            {{item.medicines}}<span>{{item.dose}}{{item.unit}}</span></li>
        </ul>
        <div class="doctor_advice">医嘱：</div>
      </div>
      <div class="footer"><span class="yishi">医师：{{recipeDetail.realname}}</span><span
        class="qianzhang">医生签章：</span><span>日期：{{recipeDetail.docprescriptiondetails[0].createtime}}</span></div>
    </div>
  </div>
</template>
<script>
import ElRow from 'element-ui/packages/row/src/row';
import yilin from '@/utils/yilinAjax';
export default {
  components: { ElRow },
  data() {
    return {
      btnShow: true,
      recipeDetail: {}
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {},
  methods: {
    getInfo() {
      let orderid = this.$route.query.orderid;
      yilin.get('https://taddocapi.kangmei.com.cn/api/ordermanage/getdocprescriptiondetail', {
        params: { 'orderId': orderid }
      }).then((res) => {
        this.recipeDetail = res.data.data;
        console.info('获取详情!,res.data.data:', res.data.data);
      });
    },
    print() {
      this.btnShow = false;
      setTimeout(() => {
        let printHtml = document.getElementById('recipeEntry').innerHTML;
        document.body.innerHTML = printHtml;
        window.print();
        location.reload();
        setTimeout(() => {
          this.btnShow = true;
        });
      });
    }
  },
  mounted: function () {
    this.getInfo();
  }
};
</script>
<style lang="less" scoped>
  #recipeEntry {
    position: relative;
  }
  .container {
    margin: 0 auto;
    width: 700px;
    height: 1070px;
    font-family: "微软雅黑";
    padding-top: 50px;
  }
  .header { position: relative; margin-bottom: 8px; }
  .title1, .title2 { text-align: center; }
  .title1 { font-size: 20px; margin-bottom: 15px; height: 26px; }
  .title2 { font-size: 30px; letter-spacing: 8px; }
  .tips { position: absolute; top: 0px; right: 0; width: 90px; }
  .info { font-size: 16px; border-top: solid 2px #000; border-bottom: solid 2px #000; }
  .info ul { display: block; margin: 15px 0; padding: 0; }
  .info ul li { float: left; }
  .info_detail li { width: 160px; }
  .content { position: relative; height: 750px; font-size: 16px; }
  .orderlogo { margin-top: 20px; width: 40px; }
  .orderlist { padding: 0; margin: 5px 0; max-height: 615px; }
  .orderlist li { min-width: 220px; float: left; margin: 8px 0; margin-right: 10px; }
  .orderlist li span { margin-left: 8px; }
  .doctor_advice { position: absolute; bottom: 15px; }
  .footer { border-top: solid 2px #000; padding-top: 30px; }
  .footer span { display: inline-block; }
  .yishi { width: 200px; }
  .qianzhang { width: 250px; }
  .printBtn { position: fixed; top: 120px; left: 250px; width: 100px; font-size: 20px; z-index: 9999; }
</style>
