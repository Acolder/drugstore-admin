<template>
  <div class="detail">
    <div class="box-list">
      <h2>商户信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span>药店名称：{{detailData.sellerName}}</span>
          </el-col>
          <el-col :span="8">
            <span>所属商户：{{detailData.a}}</span>
          </el-col>
          <el-col :span="8">
            <span>商户类型：{{typeList[detailData.businessType]}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>所属品牌：{{detailData.brand}}</span>
          </el-col>
          <el-col :span="8">
            <span>手机号：{{detailData.mobile}}</span>
          </el-col>
          <el-col :span="8">
            <span>所在区域：<span v-if="detailData.addressProvince">{{detailData.addressProvince}}/{{detailData.addressCity}}/{{detailData.addressDistrict}}</span></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>详细地址：{{detailData.detailAddress}}</span>
          </el-col>
          <el-col :span="8">
            <span>所在地图位置：</span>
            <i class="el-icon-location" @click="seeMap" style="cursor: pointer;"></i>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box-list">
      <h2>账户信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span>开户人：{{detailData.accountHolder}}</span>
          </el-col>
          <el-col :span="8">
            <span>银行卡号：{{detailData.bankCardNumber}}</span>
          </el-col>
          <el-col :span="8">
            <span>开户行：{{detailData.openingBank}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box-list">
      <h2>其他信息信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span>商户法人：{{detailData.legalPerson}}</span>
          </el-col>
          <el-col :span="8">
            <span>身份证号：{{detailData.idCard}}</span>
          </el-col>
          <el-col :span="8">
            <span>法人联系方式：{{detailData.contact}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>营业执照</span>
            <img :src="detailData.businessLicense" alt="" width="80px" height="80px">
          </el-col>
          <el-col :span="8">
            <span>经营许可证：</span>
            <img :src="detailData.drugLicenses" alt="" width="80px" height="80px">
          </el-col>
          <el-col :span="8">
            <span>法人身份证照片：</span>
            <img :src="detailData.idcardPhoto" alt="" width="80px" height="80px">
          </el-col>
        </el-row>
      </div>
    </div>
     <div class="box-list">
      <h2>操作</h2>
      <div class="info">
        <el-row>
          <el-col :span="12"  v-if="detailData.auditStatus === '1'" style="text-align:center">
            <el-button @click="examine(2)">审核通过</el-button>
          </el-col>
          <el-col :span="12"  v-if="detailData.auditStatus === '1'" style="text-align:center">
            <el-button @click="examine(3)">审核不通过</el-button>
          </el-col>
          <el-col :span="24" v-if="detailData.auditStatus === '2'" style="text-align:center">
            <el-button @click="examine(4)">停用</el-button>
          </el-col>
          <el-col :span="24" v-if="detailData.auditStatus === '4'" style="text-align:center">
            <el-button @click="examine(2, '启用')">启用</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div :class="dialogVisible ? 'map_box' : 'none'">
      <div class="box_wrap">
        <div id="allmap"></div>
        <i class="el-icon-close close" @click="close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import BMap from 'BMap';
export default {
  data() {
    return {
      id: this.$route.query.id,
      detailData: '',
      typeList: {
        '1': '仓库',
        '2': '药店',
        '3': '药柜',
        '4': '跨境电商'
      },
      map: '',
      dialogVisible: false
    };
  },
  methods: {
    getDetail() {
      let param = {
        sellerUserId: this.id
      };
      javaAjax.post('/mall_manage/authority/queryBusinessDetails', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detailData = res.data.resultData[0];
        }
      });
    },
    examine(type, key) {
      console.log(1);
      let text = '';
      if (type === 2 && key === '启用') {
        text = '启用';
      } else
      if (type === 2) {
        text = '审核通过';
      } else if (type === 3) {
        text = '审核不通过';
      } else if (type === 4) {
        text = '停用';
      }
      this.$confirm('此操作将' + text + '该商户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = { sellerUserId: this.detailData.sellerUserId, auditStatus: type };
        javaAjax.post('/mall_manage/authority/audit', param).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.resultCode === '0') {
            console.log(this.$route.query.isExamine);
            this.$router.push('/o2oPlatform/store/subordinateStore?index=' + this.$route.query.index);
            this.$message({
              type: 'success',
              message: res.data.msg
            });
          }
        });
      });

    },
    seeMap() {
      // if () {
      this.dialogVisible = true;
      this.map.clearOverlays();
      let new_point = new BMap.Point(this.detailData.longitude, this.detailData.latitude);
      let marker = new BMap.Marker(new_point);  // 创建标注
      this.map.addOverlay(marker);              // 将标注添加到地图中
      this.map.panTo(new_point);
      // }
    },
    close() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.map = new BMap.Map('allmap');
    this.map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11);
    this.map.enableScrollWheelZoom(true);
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="less" scoped>
.box-list{
  h2{
    height: 50px;
    line-height: 50px;
  }
  .info{
    padding: 20px 60px;
    background: #f0f0f0;
    /deep/ .el-row{
      margin-top: 15px;
    }
  }
}
#allmap{
  width: 1550px;
  height: 500px;
}
.detail .none{
  z-index: -1;
  opacity: 0;
  width: 0;
  height: 0;
  #allmap{
    // display: none;
  }
  position: absolute;
}
.map_box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,0.5);
  z-index: 10;
  .box_wrap{
    width: 1600px;
    height: 550px;
    padding: 30px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    .close{
      position: absolute;
      top: 8px;
      right: 10px;
      cursor: pointer;
    }
  }
}
</style>