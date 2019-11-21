<template>
  <div class="detail">
    <div class="box-list" v-if="detailData">
      <h2>店铺信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span class="label">药店名称：</span>
            <span>{{detailData.sellerName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">联系人：</span>
            <span>{{detailData.sellerUserName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">联系人电话：</span>
            <span>{{detailData.contact}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">门店电话：</span>
            <span>{{detailData.mobile}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">门店区域：</span>
            <span>{{detailData.addressProvince}}{{'/' + detailData.addressCity}}{{'/' + detailData.addressDistrict}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">门店地址：</span>
            <span>{{detailData.detailAddress}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">所在地图位置：</span>
            <i class="el-icon-location" @click="seeMap" style="cursor: pointer;color:#409EFF">点击查看</i>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">门脸照：</span>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <img :src="detailData.frontPhotos" alt="" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.frontPhotos" alt="">
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">门店照：</span>
            <el-tooltip placement="top"  effect="light">
              <div slot="content">
                <img :src="detailData.storePhotos" alt="" class="floatimg" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.storePhotos" alt="">
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">门店Logo：</span>
            <el-tooltip placement="top"  effect="light">
              <div slot="content">
                <img :src="detailData.storeLogo" alt="" class="floatimg" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.storeLogo" alt="">
            </el-tooltip>
          </el-col>
        </el-row>

      </div>
    </div>
    <div class="box-list" v-if="detailData">
      <h2>资质信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span class="label">营业执照：</span>
            <el-tooltip placement="top"  effect="light">
              <div slot="content">
                <img :src="detailData.businessLicense" alt="" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.businessLicense" alt="">
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">营业执照名称：</span>
            <span>{{detailData.businessLicenseName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label restnum">注册号/统一社会信用代码：</span>
            <span>{{detailData.registrationNumber}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">法定代表人：</span>
            <span>{{detailData.legalPerson}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">经营场所：</span>
            <span>{{detailData.premises}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">营业执照有效期：</span>
            <span>{{detailData.validity}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">注册/成立日期：</span>
            <span>{{detailData.recordDate}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">发证/登记机关：</span>
            <span>{{detailData.registrationAuthority}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">核准日期：</span>
            <span>{{detailData.approvalDate}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">法人身份证照片正面：</span>
            <el-tooltip placement="top"  effect="light">
              <div slot="content">
                <img :src="detailData.idPhotoPositive" alt="" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.idPhotoPositive" alt="">
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">法人身份证照片反面：</span>
            <el-tooltip placement="top"  effect="light">
              <div slot="content">
                <img :src="detailData.idPhotoNegative" alt="" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.idPhotoNegative" alt="">
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="label">药品经营许可证：</span>
            <el-tooltip placement="top"  effect="light">
              <div slot="content">
                <img :src="detailData.drugLicenses" alt="" width="500px" height="300px">
              </div>
              <img class="img" :src="detailData.drugLicenses" alt="">
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="btn-box" v-if="detailData">
      <el-button type="success" @click="examine(2)" v-if="detailData.auditStatus === '1'">审核通过</el-button>
      <el-button type="danger" @click="examine(3)" v-if="detailData.auditStatus === '1'">审核不通过</el-button>
      <el-button type="warning" @click="examine(4)" v-if="detailData.auditStatus === '2'">停用</el-button>
      <el-button type="warning" @click="examine(2, '启用')" v-if="detailData.auditStatus === '4'">启用</el-button>
    </div>
    <!-- 审核不通过原因 （新）-->
    <el-dialog title="审核说明" :visible.sync="auditCauseVisible"  :modal-append-to-body="false" :append-to-body="true" width="600px" center>
      <div class="auditCause">
        <span>不通过原因</span>
        <textarea name="" id="" cols="45" rows="10" v-model.trim="auditMark" placeholder="请输入审核不通过原因"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditCauseVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <div id="allmap"></div> -->
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
import { formatDate } from '@/utils/date';
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
      auditMark: '',
      dataSure: {
        sellerUserId: this.$route.query.id,
        auditStatus: '',
      },
      map: '',
      dialogVisible: false,
      auditCauseVisible: false, // 控制审核不通过弹窗（新）
    };
  },
  methods: {
    getDetail() {
      let param = {
        sellerUserId: this.id
      };
      javaAjax.post('/mall_manage/authority/queryBusinessDetails', param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          console.log(res);
          this.detailData = res.data.resultData[0];
          this.detailData.recordDate = formatDate(this.detailData.recordDate);
          this.detailData.approvalDate = formatDate(this.detailData.approvalDate);
        }
      });
    },
    examine(type, key) {
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
        this.dataSure = { sellerUserId: this.detailData.sellerUserId, auditStatus: type };
        if (type === 3) {
          this.auditCauseVisible = true; // 审核不通过弹窗（新）
        }
        else {
          javaAjax.post('/mall_manage/authority/audit', this.dataSure).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              let path = this.$route.query.isExamine === 'true' ? '/sellBusiness/toExamine' : '/sellBusiness/list';
              this.$router.push(path + '?index=' + this.$route.query.index);
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }
          });
        }

      });
    },
    // 核审不通过
    sure() {
      if (!this.auditMark) {
        this.$message({
          type: 'warning',
          message: '请输入核审不通过的原因'
        });
      } else {
        this.dataSure.auditMark = this.auditMark;
        javaAjax.post('/mall_manage/authority/audit', this.dataSure).then(res => {
          if (res.status === 200 && res.data.resultCode === '0') {
            let path = this.$route.query.isExamine === 'true' ? '/sellBusiness/toExamine' : '/sellBusiness/list';
            this.$router.push(path + '?index=' + this.$route.query.index);
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.auditCauseVisible = false;
          }
        });
      }
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
    this.map.centerAndZoom('深圳', 16);
    this.map.enableScrollWheelZoom(true);
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="less" scoped>

.detail{
  padding-bottom: 60px;
  .box-list{
    h2{
      height: 50px;
      line-height: 50px;
      background: #f0f0f0;
      padding-left: 35px;
    }
    .info{
      // padding: 0px 40px;
      // background: #f0f0f0;
      margin-bottom: 25px;
      /deep/ .el-row{
        margin-top: 25px;
        vertical-align: middle;
        .el-col{
          display: flex;
          align-items: center;
          .label{
            width: 160px;
            text-align: right;
            margin-right: 20px;
          }
          .restnum{
            width: 180px;
            margin-left: -20px;
          }
        }
      }
      .img{
        width: 100px;
        height: 60px;
      }
    }
  }
  .btn-box{
    text-align: center;
    margin-top: 60px;
    padding-bottom: 30px;
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

// 审核不通过原因
.auditCause{
  padding-left: 10%;
  display: flex;
  text-align: center;
  textarea{
    margin-left: 10px;
    padding: 4px 4px;
  }
}
</style>
