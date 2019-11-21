<template>
    <!-- 积分获取 -->
    <el-form label-width="100px" ref="level_Data" class="demo-ruleForm" style="margin-bottom: 300px;">
      <button @click="modify">修改</button>
      <!-- 完善账户 -->
       <div class="title">
          <p>完善账户</p>
          <li class="rules_list" v-for="(item, index) in accountData" :key="index">
            <el-checkbox-group v-model="accountChecked[index]">
              <el-checkbox  :label="item.id" :disabled="disabled" @change="handleChange(1,item.id,item.quantity)" style="padding-top: 3px;">
                <div class="info"> 完善个人信息赠送 <input class="number" v-model="item.quantity" type="text" :disabled="disabled"> 积分</div>
              </el-checkbox>
            </el-checkbox-group>
          </li>
          <div class="ruls">限制规则：个人信息中所有项目在首次完成录入并提交保存时赠送积分，之后修改不再赠送</div>
      </div>
      <!-- 互动活跃 -->
      <div class="title">
        <p>互动活跃</p>
          <li class="rules_list" v-for="(item, index) in activeData" :key="index" >
            <el-checkbox-group v-model="activeChecked[index]">
              <el-checkbox :label="item.id" :disabled="disabled" @change="handleChange(2,item.id,item.quantity)" style="padding-top: 3px;">
                <div class="info" v-if="item.type === 'DayLogin'">每天登录赠送 <input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分</div>
                <div class="info" v-if="item.type === 'EvaluateProduct'">每次评价商品赠送 <input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分</div>
                <div class="info" v-if="item.type === 'ShareProduct'">每次分享商品赠送 <input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分</div>
                <div class="info" v-if="item.type === 'OrderByDoctor'">每次问医并成功交易赠送 <input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分</div>
                <div class="info" v-if="item.type === 'OrderByMedicine'">每次问药并成功交易赠送 <input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分</div>
                </el-checkbox>
            </el-checkbox-group>
                <div class="interaction_ruls" v-if="item.type === 'DayLogin'">限制规则：登录每天最多赠送1次</div>
                <div class="interaction_ruls" v-if="item.type === 'ShareProduct'">限制规则：分享每天最多赠送限 <input class="number" :disabled="disabled" type="text" v-model="item.param.DayMax">积分</div>
          </li>
      </div>
      <!-- 购物消费 -->
      <div class="title">
        <p>购物消费</p>
        <li class="rules_list" v-for="(item, index) in shopingData" :key="index">
          <el-checkbox-group v-model="shopingChecked[index]">
            <el-checkbox :label="item.id" :disabled="disabled" @change="handleChange(3,item.id,item.quantity)" style="padding-top: 3px;">
              <div class="info" v-if="item.type === 'ConsumptionAmount'">
                消费金额每消费 <input class="number" :disabled="disabled" type="text" v-model="item.param.Unit">
                元赠送<input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分
              </div>
              <div class="info" v-if="item.type === 'OrderQuantityReach'">
                每月成交订单满 <input class="number" :disabled="disabled" type="text" v-model="item.param.Unit">
                笔赠送<input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分
              </div>
              <div class="info" v-if="item.type === 'OrderAmountReach'">
                每月成交金额满 <input class="number" :disabled="disabled" type="text" v-model="item.param.Unit">
                元赠送<input class="number" :disabled="disabled" type="text" v-model="item.quantity"> 积分
              </div>
            </el-checkbox>
          </el-checkbox-group>
              <div class="interaction_ruls" v-if="item.type === 'OrderQuantityReach'">限制规则：单个月内超过笔数不再叠加赠送</div>
              <div class="interaction_ruls" v-if="item.type === 'OrderAmountReach'">限制规则：单个月内超过金额不再叠加赠送</div>
        </li>
      </div>
      <!-- 修改完成 -->
      <div class="modify_success" v-if="modifyShow === true" @click="modifySuccess">修改完成</div>
    </el-form>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      ListData: [], // 获取积分列表数据
      accountData: [], // 完善账户数据
      activeData: [], // 互动活跃数据
      shopingData: [], // 购物消费数据
      accountChecked: [],  // 完善账户默认选中的数据
      activeChecked: [],  // 互动活跃默认选中的数据
      shopingChecked: [], // 购物消费默认选中的数据
      checkedRules: [],  // 选中的全部数据
      disabled: true,
      modifyShow: false,
    };
  },
  methods: {
    // 请求积分获取规则列表的数据
    getTable() {
      let _self = this;
      ajax.get(`/api/integral/rulelist`).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.ListData = res.data.data;  // 全部数据
        }
        // 分别获取完善用户，互动活跃，购物消费的数据
        for (let i = 0; i < _self.ListData.length; i++) {
          if (_self.ListData[i].type === 'ComplementInfo') {  // 获取完善用户部分的数据
            this.accountData.push(_self.ListData[i]);
          } else if ((_self.ListData[i].type === 'DayLogin') || (_self.ListData[i].type === 'EvaluateProduct') || (_self.ListData[i].type === 'ShareProduct') || (_self.ListData[i].type === 'OrderByDoctor') || (_self.ListData[i].type === 'OrderByMedicine')) {
            _self.activeData.push(_self.ListData[i]);  // 获取互动活跃部分的数据
          } else {
            _self.shopingData.push(_self.ListData[i]);  // 获取购物消费部分的数据
          }
          if ((_self.ListData[i].param.indexOf('DayMax') > -1) || (_self.ListData[i].param.indexOf('Unit') > -1)) {  // 处理param数据格式
            _self.ListData[i].param = JSON.parse(_self.ListData[i].param); // 把param字符串转为对象
          }
        }
        // 完善账户的初始化默认选中状态
        for (let k = 0; k < _self.accountData.length; k++) {
          let checkArr = [];
          let item = _self.accountData[k].status;
          if (item === 'Normal') {
            checkArr.push(_self.accountData[k].id);
            _self.accountChecked.push(checkArr);
          } else {
            _self.accountChecked.push([]);
          }
        }
        // 互动活跃的初始化默认选中状态
        for (let k = 0; k < _self.activeData.length; k++) {
          let checkArr = [];
          let item = _self.activeData[k].status;
          if (item === 'Normal') {
            checkArr.push(_self.activeData[k].id);
            _self.activeChecked.push(checkArr);
          } else {
            _self.activeChecked.push([]);
          }
        }
        // 购物消费的初始化默认选中状态
        for (let k = 0; k < _self.shopingData.length; k++) {
          let checkArr = [];
          let item = _self.shopingData[k].status;
          if (item === 'Normal') {
            checkArr.push(_self.shopingData[k].id);
            _self.shopingChecked.push(checkArr);
          } else {
            _self.shopingChecked.push([]);
          }
        }
      });
    },
    // 修改获取规则列表，选中积分或者取消选中
    modify() {
      this.modifyShow = true;
      this.disabled = false;
    },
    // 勾选积分方法
    handleChange(type, id, quantity) {
      if (type === 1) {    // 完善用户
        this.postData(this.accountData, id, quantity); // 调用函数
      }
      else if (type === 2) { // 互动活跃
        this.postData(this.activeData, id, quantity);  // 调用函数
      }
      else if (type === 3) { // 购物消费
        this.postData(this.shopingData, id, quantity); // 调用函数
      }
    },
    // 勾选的积分数据
    postData(checkedData, id, quantity) {
      for (let i = 0; i < checkedData.length; i++) {
        if (checkedData[i].status === 'Normal' && checkedData[i].id === id) { // 取消勾选
          checkedData[i].status = 'Disable';
          for (let j = 0; j < this.ListData.length; j++) {
            if (this.ListData[j].id === id) {
              this.ListData[j].status = checkedData[i].status;
            }
          }
        }
        else if (checkedData[i].status === 'Disable' && checkedData[i].id === id) { // 勾选积分
          checkedData[i].status = 'Normal';
          for (let j = 0; j < this.ListData.length; j++) {
            if (this.ListData[j].id === id) {
              this.ListData[j].param = checkedData[i].param;
              this.ListData[j].quantity = checkedData[i].quantity;
              this.ListData[j].sort = checkedData[i].sort;
              this.ListData[j].type = checkedData[i].type;
              this.ListData[j].status = checkedData[i].status;
            }
          }
        }
      }
    },
    // 修改完成
    modifySuccess() {
      for (let i = 0; i < this.ListData.length; i++) { // 处理param数据格式
        if (typeof (this.ListData[i].param) === 'object') { // 判断param是否为对象
          for (let j in this.ListData[i].param) {
            if (typeof (this.ListData[i].param.DayMax) === 'string') { // 判断param对象的属性值是否为字符串
              this.ListData[i].param[j] = Number(this.ListData[i].param[j]); // 把字符串形式的属性值转为数字
            }
          }
          this.ListData[i].param = JSON.stringify(this.ListData[i].param); // 把param对象转为字符串
        } else {
          this.ListData[i].param = this.ListData[i].param;
        }
      }
      let param = this.ListData;
      ajax.post(`api/integral/ruleedit`, param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.modifyShow = false;
          this.disabled = true;
          this.accountData = [];  // 完善账户数据
          this.activeData = [];   // 互动活跃数据
          this.shopingData = [];  // 购物消费数据
          this.getTable();
        }
      });
    },
  },
  created() {
    this.getTable();
  },
};
</script>

<style lang="less" scoped>
input{
  border: none;
}
button{
  position: absolute;
  top: -23px;
  border: none;
  right: 2px;
  color: #0066CC;
}
.modify_success {
  width: 100px;
  color:#fff;
  background: #0066CC;
  line-height: 35px;
  text-align: center;
  border-radius: 8px;
  margin-left: 50%;
  margin-top: 20px;
}
.demo-ruleForm{
  position: relative;
}
.number{
  width: 55px;
  line-height: 25px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  margin: 0px 4px;
}
.title{
  width: 98%;
  margin: 30px 20px 0px 20px;
  border: 1px solid #ccc;
  padding-bottom: 5px;
  p{
    line-height: 40px;
    background: #f5f5f5;
    padding: 0px 20px;
    margin-bottom: 25px;
  }
  .rules_list{
    display: flex;
    padding: 0px 20px;
    margin-bottom: 10px;
    .info{
      display: inline-block;
    }
    .interaction_ruls{
      display: inline-block;
      line-height: 25px;
      padding: 0;
      margin-left: 100px;
    }
  }
  .ruls{
    padding: 0px 20px;
    margin: 20px 0px;
  }
}
</style>
