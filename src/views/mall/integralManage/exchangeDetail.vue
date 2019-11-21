<template>
  <div id="exchangeDetail">
    <!-- 兑换详情标题状态 -->
    <div class="status" v-if="detailData.order_receive_status === 'None'">无</div>
    <div class="status" v-if="detailData.order_receive_status === 'WaitPay'">待支付</div>
    <div class="status" v-if="detailData.order_receive_status === 'WaitSend'">待发货</div>
    <div class="status" v-if="detailData.order_receive_status === 'WaitConfirm'">待收货</div>
    <div class="status" v-if="detailData.order_receive_status === 'Finish'">已完成</div>
    <!-- 兑换详情内容 -->
    <div class="detail_content">
      <!-- 商品信息 -->
      <div class="detail_title">
        <h2>商品信息</h2>
        <div class="info">
          <v-table ref="detail_table" column-width-drag is-horizontal-resize style="width:98%" :columns="detailColumns"
            :table-data="shopInfoData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
        </div>
      </div>
      <!-- 支付信息 -->
      <div class="detail_title operation_notes">
        <h2>支付信息</h2>
        <div class="info">
          <ul>
            <li>消费积分：{{detailData.order_integral}} 个</li>
            <li>兑换单号：{{detailData.order_num}}</li>
            <li>兑换时间：{{detailData.order_create_time}}</li>
          </ul>
          <ul>
            <li>消费现金：{{detailData.order_money}}</li>
            <li>支付方式：---</li>
            <li>支付时间：{{detailData.order_pay_time}}</li>
          </ul>
        </div>
      </div>
      <!-- 收货信息 -->
      <div class="detail_title operation_notes" v-if="detailData.type === 'Reality'">
        <h2>收货信息</h2>
        <div class="info">
          <ul>
            <li>收货人：{{detailData.order_user_name}}</li>
            <li>联系电话：{{detailData.order_user_contact}}</li>
            <li>收货地址：{{detailData.order_user_address}}</li>
          </ul>
          <ul>
            <li>物流公司：{{detailData.order_express_name}}</li>
            <li>物流单号：{{detailData.order_express_num}}</li>
          </ul>
        </div>
      </div>
      <!-- 操作信息 -->
      <div class="detail_title operation_notes" v-if="detailData.order_send_time">
      <!-- <div class="detail_title operation_notes" v-if="detailData.order_confirm_time !== '0001-01-01 00:00:00'"> -->
        <h2>操作信息</h2>
        <div class="info">
          <ul>
            <li>发货操作员：{{detailData.order_send_user}}</li>
            <li>发货操作时间：{{detailData.order_send_time}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 确认按钮 -->
    <button class="statusBtn" v-if="(detailData.order_receive_status === 'WaitSend') && (detailData.type === 'Reality')" @click="confirmSend">确认发货</button>
    <!-- 弹窗 -->
    <el-dialog :title="confirmTitle" :visible.sync="isShow" :modal-append-to-body="false" :append-to-body="true" @close="cleanInput" width="600px" center >
      <!--确认发货部分-->
      <div class="logistics_info" v-if="detailData.order_receive_status === 'WaitSend'">
        物流公司：<input type="text" placeholder="请输入物流公司" v-model.trim="order_express_name" @keyup="btnStatus"><br/>
        物流单号：<input type="text" placeholder="请输入物流单号" v-model.trim="order_express_num" @keyup="btnStatus">
      </div>
      <!--确认发货部分-->
      <div class="tip_info" v-if="detailData.order_receive_status === 'WaitSend'">
        <p>请核对信息，确认输入无误</p>
        <p>确定后将无法更改并影响兑换状态，请谨慎操作。</p>
      </div>
      <!-- 确认发货或确认签收签收改变兑换状态按钮 -->
      <div class="dialog_bottom">
        <el-button size="medium" type="primary" :disabled="isUsable" @click="confirm" style="margin-top:15px;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      detailData: [],
      shopInfoData: [], // 商品信息数据
      isShow: false,
      confirmTitle: '',
      order_express_name: '', // 物流公司
      order_express_num: '', // 物流单号
      isUsable: true, // 最终确认按钮是否禁用
      date: '',
    };
  },
  computed: {
    //  商品信息
    detailColumns() {
      let columns = [
        { field: 'name', title: '商品名称', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'icon', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'type', title: '商品分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'specifications', title: '商品规格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'original_price', title: '商品标价', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_integral', title: '积分值', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'order_money', title: '现金', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'order_quantity', title: '商品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'Reality') {
              return '实体';
            } else if (value === 'Virtual') {
              return '虚拟';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'icon') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<img src="${value}" alt="" width="50px" height="35px" style="margin:1px 0px;" />`;
            } else {
              return `<img src="${defaultImg}" alt="" width="50px" height="35px" style="margin:1px 0px;" />`;
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'realName', 'name' // （后台操作员）发货用户名字和用户账号
    ])
  },
  watch: { // 监听确认发货弹窗的物流公司和物流单号输入框的值的变化
    'order_express_name': function (newVal, oldVal) {
    },
    'order_express_num': function (newVal, oldVal) {
    }
  },
  methods: {
    // 获取兑换详情数据
    getDetailData() {
      ajax.get('/api/integral/GetIntegralProExchangeLogByid?id=' + this.$route.params.id).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.detailData = res.data.data; // 对象数据
          this.shopInfoData.push(this.detailData); // 把对象转为数组对象
        }
        else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      });
    },
    // 确认发货按钮
    confirmSend() {
      this.isShow = true;
      this.confirmTitle = '确认发货';
    },
    // 改变确认收货时的按钮状态
    btnStatus() {
      if ((this.order_express_name) && (this.order_express_num)) {
        this.isUsable = false;
      } else {
        this.isUsable = true;
      }
    },
    // 获取确认收货或签收时的时间
    getConfirmTime(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let min = date.getMinutes();
      let second = date.getSeconds();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      } if (hours < 10) {
        hours = '0' + hours;
      } if (min < 10) {
        min = '0' + min;
      } if (second < 10) {
        second = '0' + second;
      }
      this.date = year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + second;
    },
    // 最终确认发货或签收并改变兑换状态按钮
    confirm() {
      this.isShow = false;
      this.shopInfoData = [];
      this.date = new Date(); // 获取当前时间
      this.getConfirmTime(this.date);
      if (this.detailData.order_receive_status === 'WaitSend') { // 确认发货且兑换状态变为待收货
        let param = {
          id: this.detailData.id,
          order_express_name: this.order_express_name,
          order_express_num: this.order_express_num,
          username: this.name
        };
        this.detailData.order_send_time = this.date;
        ajax.get(`/api/integral/DeliveryIntegralProInfoByid`, { params: param }).then(res => {
          if (res.data.code === 0 && res.status === 200) {
            this.$message({
              type: 'success',
              message: '确认发货成功'
            });
          }
          else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
          this.getDetailData();
        });
      }
    },
    // 关闭弹窗并清空输入框内容
    cleanInput() {
      this.order_express_name = '';
      this.order_express_num = '';
    }
  },
  created() {
    this.getDetailData();
    this.$store.dispatch('getUserInfo');
  }
};
</script>

<style lang="less" scoped>
h2{
  font-size: 24px;
  font-weight: normal;
}
#exchangeDetail{
  margin-bottom: 150px;
}
// 兑换商品的状态
.status{
  width: 100%;
  height: 60px;
  font-size: 24px;
  color: #222;
  line-height: 60px;
  background: #f5f5f5;
  border-radius: 5px;
  text-align: center;
}
// 详情
.detail_content{
  width: 100%;
  border: 1px solid #ccc;
  margin-top: 25px;
  margin-bottom: 40px;
  .detail_title{
    padding: 25px 0px 25px 25px;
    h2{
      color:#222;
      line-height: 40px;
    }
    .info{
      width: 100%;
      padding-left: 45px;
      padding-top: 25px;
      display: flex;
      ul{
        width: 50%;
        font-size: 20px;
        color: #777;
        line-height: 20px;
        li{
          margin-bottom: 20px;
        }
      }
    }
  }
  .operation_notes{
    border-top: 20px solid #f5f5f5;
  }
}
// 状态按钮
.statusBtn {
  width: 180px;
  height: 50px;
  font-size: 22px;
  color:#222;
  line-height: 22px;
  margin-left: 45%;
  border: 1px solid #333;
  border-radius: 7px;
}
// 确认弹窗
.el-dialog__header{
  background: #f5f5f5;
}
// 弹窗物流信息
.logistics_info{
  width: 100%;
  text-align: center;
  padding: 30px 0;
  input{
    width: 260px;
    height: 30px;
    line-height: 25px;
    margin-bottom: 25px;
    border-radius: 3px;
    border: 1px solid #ccc;
    padding-left: 4px;
  }
}
// 弹窗提示信息
.tip_info{
  width: 100%;
  font-size: 18px;
  color: red;
  text-align: center;
  margin-bottom: 50px;
  p{
    line-height: 40px;
  }
}
.dialog_bottom{
  border-top: 1px solid #ccc;
  width: 100%;
  text-align: center;
  span{
    display: block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    background: #ccc;
    color: #fff;
    margin-left: 45%;
    margin-top: 20px;
    border-radius: 4px;
  }
}
</style>
