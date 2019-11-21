/* eslint-disable complexity */
/* eslint-disable no-extra-semi */
<template>
  <div id="wrapper">
    <div class="search-wrapper">
      <el-form :inline="true" :model="orderSearch" size="small" label-width="80px">
        <el-form-item label="订单编号:" class="commonItem">
          <el-input v-model="orderSearch.orderId" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态:" class="commonItem">
          <el-select v-model="orderSearch.orderStatus" placeholder="请选择订单状态" clearable >
            <el-option label="全部" :value="''"></el-option>
            <el-option label="已取消" :value='0'></el-option>
            <el-option label="待付款" :value='10'></el-option>
            <el-option label="待确认" :value='20'></el-option>
            <el-option label="配送中" :value='30'></el-option>
            <el-option label="交易成功" :value='40'></el-option>
            <el-option label="已退款" :value='50'></el-option>
            <el-option label="部分退款" :value='60'></el-option>
            <el-option label="退款中" :value='70'></el-option>
            <el-option label="待评价" :value='80'></el-option>
            <el-option label="待审核" :value='90'></el-option>
            <el-option label="处方未通过审核" :value='100'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送类型:" class="commonItem">
          <el-select v-model="orderSearch.orderTransport" placeholder="请选择配送类型" clearable >
            <el-option label="商城配送" :value='1'></el-option>
            <el-option label="药店速达" :value='2'></el-option>
            <el-option label="药柜自提" :value='3'></el-option>
            <el-option label="跨境电商" :value='4'></el-option>
            <el-option label="大客户线下付款" :value='5'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="isOtc" class="commonItem">
          <el-select v-model="orderSearch.isOtc" placeholder="请选择" clearable>
            <el-option label="处方药" value="2"></el-option>
            <el-option label="非处方药" value="1"></el-option>
            <el-option label="全部"  value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号:" class="commonItem">
          <el-input v-model="orderSearch.userMobile" placeholder="请输入用户账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户ID:" class="commonItem">
          <el-input v-model="orderSearch.sellerUserName" placeholder="请输入商户ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="物流号:" class="commonItem">
          <el-input v-model="orderSearch.logisticsNumber" placeholder="请输入物流号" clearable></el-input>
        </el-form-item>
        <el-form-item label="取货码:" class="commonItem">
          <el-input v-model="orderSearch.extractCode" placeholder="请输入取货码" clearable></el-input>
        </el-form-item>
        <el-form-item label="下单时间:" class="commonItem startTime">
          <el-date-picker v-model="orderSearch.createStart" align="right" type="date" placeholder="选择开始日期" :picker-options="pickerOptions"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" style="width:180px">
          </el-date-picker>
          至
          <el-date-picker v-model="valueDate" align="right" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:180px">
          </el-date-picker>
          <p style="color:red" v-if="errorShow">结束时间必须大于开始时间</p>
        </el-form-item>
        <el-form-item class="searchWrap">
          <el-button type="default" @click="clean" icon="el-icon-delete" size="small">清空</el-button>
          <el-button type="primary" @click="querySearch" icon="el-icon-search" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="orderWrap" v-for="(item, index) in tableListData" :key="index">
      <div class="orderHeader">
        <input type="checkbox" name="check" class="checked">
        <span class="give">{{item.orderTransport}}</span>
        <span class="number">订单编号：{{item.orderId}}</span>
        <span class="time">下单时间：{{item.createDate}}</span>
        <span v-if="item.orderTransport !== '【药柜自提】'" class="Consignee">收货人：{{item.addressPo.addressName}}</span>
        <span v-if="item.orderTransport !== '【药柜自提】'" class="phone">手机：{{item.addressPo.addressPhone}}</span>
        <span class="address" v-if="item.orderTransport === '【药柜自提】'">取货地址：{{item.addressPo.totalAddress}}</span>
        <span class="address" v-else>收货地址：{{item.addressPo.totalAddress}}</span>
      </div>
      <div class="orderBody">
        <div class="giveTime">
          <input type="text" id="timetext" :value="item.orderTiming" readonly>
        </div>
        <div class="user" v-if="item.orderStatus === '配送中' && (item.orderTransport === '【商城配送】' || item.orderTransport === '【药店速达】')">
          <label class="extractCode" v-if="item.orderTransport === '【商城配送】'">物流号：<span>{{item.logisticsNumber}}</span></label>
          <label class="extractCode" v-else>配送方：<span>{{item.logisticsJson.com}}</span></label>

          <label v-if="item.orderTransport === '【商城配送】'">物流公司：<span>{{item.logisticsType}}</span></label>
          <label class="extractCode" v-else>配送员电话：<span>{{item.logisticsJson ? item.logisticsJson.courier_phone : ''}}</span></label>
        </div>
        <div class="user" v-else>
          <label>用户：<span>{{item.userNickname}}({{item.userMobile}})</span></label>
          <label class="extractCode" v-if="item.orderTransport === '【药柜自提】'">取货码：<span>{{item.extractCode}}</span></label>
          <label v-else>商家：<span >{{item.sellerUserPo.sellerName}}({{item.sellerUserPo.mobile}})</span></label>
        </div>
        <div class="shu"></div>
        <div class="status">{{item.orderStatus}}</div>
        <div class="operation">
          <el-button type="primary" size="middle" @click="seeDetail(index)">查看</el-button>
          <el-button type="info" size="middle" disabled v-if="item.isOtcStr === '已跟踪'">跟踪</el-button>
          <el-button type="primary" size="middle" v-else @click="TrackActive(index)">跟踪</el-button>
        </div>
      </div>
    </div>
    <div id="orderFooter">
      <div class="checkAll">
        <input type="checkbox" id="all" @click="allCheck">
        <span style="margin-left:20px">全选</span>
        <el-button type="default" size="small" style="margin-left: 10px;" @click="exportOrder">导出</el-button>
      </div>
      <div class="table">
        <div class="pagin-wrapper">
          <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="orderSearch.pageSize" :page-index="orderSearch.pageNum"
          :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
          </v-pagination>
        </div>
      </div>
    </div>
    <!-- 跟踪订单 -->
    <el-dialog title="跟踪订单" :visible.sync="orderTrack" :center="true" :modal-append-to-body="false" :append-to-body="true" width="500px">
      <el-form :model="orderTrackData" ref="addData" :rules="rules" size="small" label-width="50px">
        <p class="trackOrderID">订单编号：<span >{{orderTrackData.orderId}}</span></p>
        <p class="content trackcontent">请备注跟踪理由:</p>
        <el-form-item label="" prop="productDes">
          <el-input type="textarea" :rows="5" v-model.trim="orderTrackData.content" style="width:90%"></el-input>
        </el-form-item>
        <p class="content color">此操作将关联到订单详情中</p>
        <el-form-item class="form-button-wrapper">
          <el-button type="default" @click="cleanTarck" icon="el-icon-delete">取 消</el-button>
          <el-button type="primary" @click="saveTrack" icon="el-icon-search">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import java from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      total: 0,
      Track: true,
      tableListData: [],
      orderSearch: {
        orderId: '', // 订单编号
        orderStatus: '', // 订单状态
        createStart: '', // 下单开始时间
        createEnd: '',
        orderTransport: '', // 配送类型
        isOtc: '',  // 是否为处方单
        userMobile: '', // 用户账号
        sellerUserName: '', // 商户账号
        logisticsNumber: '', // 物流号
        extractCode: '', // 取货码
        pageNum: 1,
        pageSize: 10
      },
      orderTrack: false,
      orderTrackData: {  // 确认跟踪
        content: '',
        orderId: '',
      },
      rules: {
        content: [
          { required: true, message: '请输入跟踪说明', trigger: 'blur' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      valueDate: '',
      errorShow: false,
      orderTime: [], // 下单时间集合
      timeValue: '',  // 计时器
      hour: 0,  // 时
      minute: 0,  // 分
      second: 0,  // 秒
      allCheckList: '', // 全选
      checked: '',
      timestamp: [],  // 时间戳
      itemIndex: '',  // 保存下标
      exportList: [],  // 导出订单
      timer: '',  // 定时器
    };
  },
  methods: {
    // 清空查询
    clean() {
      this.orderSearch.pageNum = 1;
      this.orderSearch.pageSize = 10;
      this.orderSearch.orderId = '';
      this.orderSearch.orderStatus = '';
      this.orderSearch.createStart = '';
      this.orderSearch.createEnd = '';
      this.valueDate = '';
      this.orderSearch.orderTransport = '';
      this.orderSearch.isOtc = '';
      this.orderSearch.userMobile = '';
      this.orderSearch.sellerUserName = '';
      this.orderSearch.logisticsNumber = '';
      this.orderSearch.extractCode = '';
      this.getTableData();
    },
    // 查询
    querySearch() {
      this.orderSearch.pageNum = 1;
      this.getTableData();
    },
    // 跟踪
    TrackActive(index) {
      this.itemIndex = index;
      this.orderTrackData.orderId = this.tableListData[index].orderId;
      this.orderTrack = true;
    },
    cleanTarck() {
      this.orderTrack = false;
    },
    // 确认跟踪
    saveTrack() {
      let _self = this;
      let index = _self.itemIndex;
      if (_self.tableListData[index].orderStatus === '已取消') {
        _self.tableListData[index].orderStatus = 0;
      } else if (_self.tableListData[index].orderStatus === '待付款') {
        _self.tableListData[index].orderStatus = 10;
      } else if (_self.tableListData[index].orderStatus === '待确认') {
        _self.tableListData[index].orderStatus = 20;
      } else if (_self.tableListData[index].orderStatus === '配送中') {
        _self.tableListData[index].orderStatus = 30;
      } else if (_self.tableListData[index].orderStatus === '交易成功') {
        _self.tableListData[index].orderStatus = 40;
      } else if (_self.tableListData[index].orderStatus === '已退款') {
        _self.tableListData[index].orderStatus = 50;
      } else if (_self.tableListData[index].orderStatus === '部分退款') {
        _self.tableListData[index].orderStatus = 60;
      } else if (_self.tableListData[index].orderStatus === '退款中') {
        _self.tableListData[index].orderStatus = 70;
      } else if (_self.tableListData[index].orderStatus === '待评价') {
        _self.tableListData[index].orderStatus = 80;
      } else if (_self.tableListData[index].orderStatus === '待核审') {
        _self.tableListData[index].orderStatus = 90;
      } else if (_self.tableListData[index].orderStatus === '处方未通过核审') {
        _self.tableListData[index].orderStatus = 100;
      }
      let param = {
        orderId: _self.tableListData[index].orderId,
        content: _self.orderTrackData.content,
        status: 1,
        orderStatus: _self.tableListData[index].orderStatus,
      };
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          java.post(`/mall_manage/back/logService/insertLogContent`, param).then((res) => {
            if (res.status === 200 && res.data.resultData.resultCode === '0') {
              _self.$message({
                message: '跟踪成功',
                type: 'success'
              });
              _self.orderTrackData.content = '';
              _self._self.tableListData[index].isOtcStr = false;
              _self.orderTrack = false;
              this.getTableData();
            }
          });
        }
        else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    // 查看详情
    seeDetail(index) {
      let id = this.tableListData[index].orderId;
      if (this.tableListData[index].orderStatus === '已取消') {
        this.tableListData[index].orderStatus = 0;
      } else if (this.tableListData[index].orderStatus === '待付款') {
        this.tableListData[index].orderStatus = 10;
      } else if (this.tableListData[index].orderStatus === '待确认') {
        this.tableListData[index].orderStatus = 20;
      } else if (this.tableListData[index].orderStatus === '配送中') {
        this.tableListData[index].orderStatus = 30;
      } else if (this.tableListData[index].orderStatus === '交易成功') {
        this.tableListData[index].orderStatus = 40;
      } else if (this.tableListData[index].orderStatus === '已退款') {
        this.tableListData[index].orderStatus = 50;
      } else if (this.tableListData[index].orderStatus === '部分退款') {
        this.tableListData[index].orderStatus = 60;
      } else if (this.tableListData[index].orderStatus === '退款中') {
        this.tableListData[index].orderStatus = 70;
      } else if (this.tableListData[index].orderStatus === '待评价') {
        this.tableListData[index].orderStatus = 80;
      } else if (this.tableListData[index].orderStatus === '待核审') {
        this.tableListData[index].orderStatus = 90;
      } else if (this.tableListData[index].orderStatus === '处方未通过核审') {
        this.tableListData[index].orderStatus = 100;
      }
      this.$router.push({
        path: '/order-control/orderControl/order_Details',
        query: {
          id: id,
          orderStatus: this.tableListData[index].orderStatus
        }
      });
    },
    // 获取列表数据
    getTableData() {
      let _self = this;
      let param = this.getQueryParams();
      java.post(`/mall_manage/back/order/queryOrderMonitoring`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableListData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
          // eslint-disable-next-line complexity
          let orderInfo = _self.tableListData.map((item, index, data) => {
            if (item.orderStatus === '0') {
              item.orderStatus = '已取消';
            } else if (item.orderStatus === '10') {
              item.orderStatus = '待付款';
            } else if (item.orderStatus === '20') {
              item.orderStatus = '待确认';
            } else if (item.orderStatus === '30') {
              item.orderStatus = '配送中';
            } else if (item.orderStatus === '40') {
              item.orderStatus = '交易成功';
            } else if (item.orderStatus === '50') {
              item.orderStatus = '已退款';
            } else if (item.orderStatus === '60') {
              item.orderStatus = '部分退款';
            } else if (item.orderStatus === '70') {
              item.orderStatus = '退款中';
            } else if (item.orderStatus === '80') {
              item.orderStatus = '待评价';
            } else if (item.orderStatus === '90') {
              item.orderStatus = '待核审';
            } else if (item.orderStatus === '100') {
              item.orderStatus = '处方未通过核审';
            }
            // 下单时间
            if (item.createDate) {
              item.createDate = formatDate(item.createDate);
            }
            // 配送方式
            if (item.orderTransport === '1') {
              item.orderTransport = '【商城配送】';
            } else if (item.orderTransport === '2') {
              item.orderTransport = '【药店速达】';
            } else if (item.orderTransport === '3') {
              item.orderTransport = '【药柜自提】';
            } else if (item.orderTransport === '4') {
              item.orderTransport = '【跨境电商】';
            } else if (item.orderTransport === '5') {
              item.orderTransport = '【大客户线下付款】';
            }
            // 计时器
            if (item.orderStatus === '配送中' || item.orderStatus === '待确认') {
              let day;
              let hour;
              let minute;
              if (item.day > 0) {
                day = item.day + '天';
              } else {
                day = '';
              }
              if (item.hour > 0) {
                hour = item.hour + '时';
              } else {
                hour = '';
              }
              if (item.minute > 0) {
                minute = item.minute + '分';
              } else {
                minute = 0;
              }
              item.orderTiming = day + hour + minute;
            } else {
              item.orderTiming = 0;
            }
            return {
              orderTiming: item.orderTiming,
            };
          });
          this.timestamp = orderInfo;
        }
      });
    },
    // 计时器
    transTime(data) {
      let _self = this;
      _self.timer = setInterval(this.getTableData(), 60000);
    },
    // 导出订单
    exportOrder() {
      let _self = this;
      _self.allCheckList = document.getElementById('all');
      _self.checked = document.getElementsByName('check');
      for (let i = 0; i < _self.tableListData.length; i++) {
        if (_self.checked[i].checked === true) {
          _self.exportList.push(_self.tableListData[i].orderId);
        }
      }
      if (_self.exportList.length > 0) {
        this.$confirm('此操作将导出勾选中的订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let orderId = _self.exportList.join(',');
          window.open(`${process.env.MALL_BASE_HOST}/mall_manage/back/order/exportExcleOrderMonitoring?orderId=` + orderId);
          _self.exportList = [];
          _self.allCheckList = document.getElementById('all');
          _self.checked = document.getElementsByName('check');
          for (let i = 0; i < _self.tableListData.length; i++) {
            if (_self.allCheckList.checked === true || _self.checked[i].checked === true) {
              _self.checked[i].checked = null;
            }
          }
          _self.allCheckList.checked = null;
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        _self.$alert('请勾选需要导出的订单', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 全选
    allCheck() {
      this.allCheckList = document.getElementById('all');
      this.checked = document.getElementsByName('check');
      for (let i = 0; i < this.tableListData.length; i++) {
        if (this.allCheckList.checked) {
          this.checked[i].checked = true;
        } else {
          this.checked[i].checked = null;
        }
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.orderSearch.pageNum = pageIndex;
      this.allCheckList = document.getElementById('all');
      this.checked = document.getElementsByName('check');
      for (let i = 0; i < this.tableListData.length; i++) {
        if (this.allCheckList.checked === true || this.checked[i].checked === true) {
          this.checked[i].checked = null;
        }
      }
      this.allCheckList.checked = null;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.orderSearch.pageNum = 1;
      this.orderSearch.pageSize = pageSize;
      this.getTableData();
    },
    getQueryParams: function() {
      this.orderSearch.createEnd = this.valueDate ? this.valueDate + ' 23:59:59' : '';
      if (this.orderSearch.createEnd < this.orderSearch.createStart) {
        this.errorShow = true;
      } else {
        this.errorShow = false;
      }
      return this.orderSearch;
    },
  },
  created() {
    this.getTableData();
    this.transTime();
  }
};
</script>

<style lang="less" scoped>
#wrapper{
  padding: 0 40px 0 0;
  box-sizing: border-box;
  .searchWrap{
    display: block;
  }
}
.commonItem{
  width: 300px;
}
.startTime{
  width: 480px;
}
#orderWrap{
  width: 100%;
  .orderHeader{
    background: #f2f2f2;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e4e4e4;
    color: #333333;
    padding: 0 0 0 8px;
    box-sizing: border-box;
    font-size: 14px;
    position: relative;
    span{
      display: inline-block;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .checked{
      overflow: hidden;
      position: absolute;
      left: 10px;
      top: 13px;
    }
    .give{
      font-weight: bold;
      padding-right: 0px;
      width: 137px;
      color: #ff0000;
      margin-left: 10px;
      text-align: center;
    }
    .Consignee{
      width: 140px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .address{
      width: 350px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .orderBody{
    width: 100%;
    height: 89px;
    line-height: 89px;
    padding: 16px 0;
    box-sizing: border-box;
    font-size: 14px;
    div{
      display: inline-block;
      float: left;
    }
    .giveTime{
      width: 125px;
      height: 54px;
      border: 1px solid #797979;
      margin: 0 25px 0 9px;
      position: relative;
      #timetext{
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -7px;
        border: 0;
      }
    }
    .user{
      width: 270px;
      font-size: 14px;
      height: 100%;
      line-height: 54px;
      color: #666666;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      box-sizing: border-box;
      label{
        height: 27px;
        line-height: 27px;
        width: 270px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .shu{
      border: .5px solid #e4e4e4;
      width: 1px;
      height: 56px;
      margin: 0 100px 0 100px;
    }
    .status{
      color: #009900;
      font-size: 16px;
      line-height: 54px;
    }
    .operation{
      line-height: 56px;
      float: right;
      margin-right: 10px;
    }
  }
}
#orderFooter{
  // width: 95%;
  width: 100%;
  height: 80px;
  line-height: 80px;
  margin: 0 0 80px 0;
  border-top: 1px solid #e4e4e4;
  .checkAll{
    padding-left: 8px;
    width: 50%;
    line-height:80px;
    position: relative;
    float: left;
    #all{
      position: absolute;
      top: 34px;
      left: 8px;
    }
  }
  .table{
    float: right;
    width: 50%;
    line-height:80px;
  }
}
.content{
  margin: 0 0 0 50px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}
.trackcontent{
  margin-bottom: 8px;
}
.trackOrderID{
  text-align: center;
  margin: -25px 0 25px 0;
}
.color{
  margin-top: -12px;
  font-size: 12px;
  color: #999;
}
.form-button-wrapper{
  text-align: center;
  margin: 25px 0 0px -50px;
}
</style>
