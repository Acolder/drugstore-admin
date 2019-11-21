<template>
  <div class="info">
    <div class="button_wrap">
      <el-button-group>
        <el-button type="primary" icon="el-icon-success" @click="submitForm">保存</el-button>
        <el-button type="danger" icon="el-icon-error" @click="cancel" v-if="$route.query.id">取消修改</el-button>
        <el-button type="success" icon="el-icon-success" @click="examineSuccess" v-if="infoForm.enterprise_status === 0 || infoForm.enterprise_status === 3">审核通过</el-button>
        <el-button type="danger" icon="el-icon-warning" @click="examineError" v-if="infoForm.enterprise_status === 0 || infoForm.enterprise_status === 3">审核不通过</el-button>
      </el-button-group>
    </div>
    <el-dialog title="" :visible.sync="failvisible" width="500px" :modal-append-to-body="false" center @close="examineErrorClose">
      <el-form :model="failFrom" ref="failFormRule">
        <el-form-item label="" prop="code" class="code_img">
          <el-input v-model.trim="failFrom.text" type="textarea" maxlength="70" placeholder="请输入审核不通过原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="queryExamineError">确 定</el-button>
      </div>
    </el-dialog>
    <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="160px" class="info-ruleForm">
      <div class="info_box">
        <div class="box_header">
          <div class="header_line"></div>
          基本信息
        </div>
        <div class="box">
          <el-form-item label="机构类型：" prop="enterprise_type">
            <el-radio-group v-model="infoForm.enterprise_type">
              <el-radio :label="1">连锁药店</el-radio>
              <el-radio :label="2">单体药店</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="企业名称：" prop="enterprise_name">
            <el-input v-model.trim="infoForm.enterprise_name"></el-input>
          </el-form-item>
          <el-form-item label="营业执照注册号：" prop="enterprise_number">
            <el-input v-model.trim="infoForm.enterprise_number"></el-input>
          </el-form-item>
          <el-form-item label="注册手机号：" prop="enterprise_regis_phone">
            <el-input v-model.trim="infoForm.enterprise_regis_phone" :disabled="$route.query.id ? true : false"></el-input>
            <span class="tips" v-if="!$route.query.id">用户账号为该手机号，默认密码为手机号后6位</span>
          </el-form-item>
          <el-form-item label="企业负责人：" prop="enterprise_boss">
            <el-input v-model.trim="infoForm.enterprise_boss"></el-input>
          </el-form-item>
          <el-form-item label="负责人联系方式：" prop="enterprise_boss_phone">
            <el-input v-model.trim="infoForm.enterprise_boss_phone"></el-input>
          </el-form-item>
          <el-form-item label="企业地区：" prop="enterprise_area" class="select_option">
            <el-select v-model="infoForm.enterprise_province" placeholder="请选择">
              <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <el-select v-model="infoForm.enterprise_city" placeholder="请选择">
              <el-option v-for="(item, index) in cityOptions" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <el-select v-model="infoForm.enterprise_area" placeholder="请选择">
              <el-option v-for="(item, index) in areaOptions" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业地址：" prop="enterprise_detail_address" class="address">
            <el-input v-model.trim="infoForm.enterprise_detail_address" maxlength="70" placeholder="请输入企业地址"></el-input>
            <span class="surplus">还剩{{addressSurplus}}字</span>
          </el-form-item>
          <el-form-item label="企业简介：" prop="enterprise_introduce" class="brief">
            <el-input type="textarea" maxlength="200" autosize resize="none" placeholder="请输入企业简介" v-model.trim="infoForm.enterprise_introduce"></el-input>
            <span class="surplus">还剩{{introduceSurplus}}字</span>
          </el-form-item>
          <el-form-item label="企业logo：" prop="enterprise_logo" class="logo_img">
            <div v-show="!infoForm.enterprise_logo">
              <el-button type="primary" icon="el-icon-plus" @click="uoloadLogo(1)" :loading="logoLoding">选择上传图片</el-button>
              <span class="surplus">图片大小不超过5M，支持GIF、JPG、JPEG、PNG、BMP格式</span>
            </div>
            <el-tag class="logo" v-show="infoForm.enterprise_logo" closable @close="removeImg">
              <img :src="infoForm.enterprise_logo" alt="">
              <!-- <i class="el-icon-circle-close-outline"></i> -->
            </el-tag >
          </el-form-item>
        </div>
      </div>
      <div class="info_box">
        <div class="box_header">
          <div class="header_line"></div>
          资质信息
        </div>
        <div class="box">
          <div class="QTitem_wrap">
            <div class="QTitem">
              <div class="title">企业营业执照</div>
              <el-form-item label="证件照片：" prop="enterprise_business_license" class="QT_img">
                <span class="rqstd">格式要求JPG、JPEG、PNG、BMP格式，文件不超过4M</span>
                <div class="upload_box" v-show="!infoForm.enterprise_business_license" @click="uoloadLogo(2)" v-loading="businessLoding">
                  <div class="box_center">
                    <div class="add_icon">
                      <img src="./img/sc.png" alt="">
                    </div>
                    <span>点击上传</span>
                  </div>
                </div>
                <el-tag class="upload_img" v-show="infoForm.enterprise_business_license" closable @close="removeBusiness">
                  <img :src="infoForm.enterprise_business_license" alt="">
                </el-tag>
              </el-form-item>
              <el-form-item label="有效期至：" prop="enterprise_business_license_endtime" class="QT_img">
                <el-date-picker v-model="infoForm.enterprise_business_license_endtime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
            <div class="QTitem">
              <div class="title">企业税务登记证</div>
              <el-form-item label="证件照片：" prop="enterprise_tax_registration" class="QT_img">
                <span class="rqstd">格式要求JPG、JPEG、PNG、BMP格式，文件不超过4M</span>
                <div class="upload_box" v-show="!infoForm.enterprise_tax_registration" @click="uoloadLogo(3)" v-loading="tax_Loding">
                  <div class="box_center">
                    <div class="add_icon">
                      <img src="./img/sc.png" alt="">
                    </div>
                    <span>点击上传</span>
                  </div>
                </div>
                <el-tag class="upload_img" v-show="infoForm.enterprise_tax_registration" closable @close="removeTax">
                  <img :src="infoForm.enterprise_tax_registration" alt="">
                </el-tag>
              </el-form-item>
              <el-form-item label="有效期至：" prop="enterprise_tax_registration_endtime" class="QT_img">
                <el-date-picker v-model="infoForm.enterprise_tax_registration_endtime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="QTitem_wrap">
            <div class="QTitem">
              <div class="title">药品经营许可证</div>
              <el-form-item label="证件照片：" prop="enterprise_licence" class="QT_img">
                <span class="rqstd">格式要求JPG、JPEG、PNG、BMP格式，文件不超过4M</span>
                <div class="upload_box" v-show="!infoForm.enterprise_licence" @click="uoloadLogo(4)" v-loading="enterpriseLoding">
                  <div class="box_center">
                    <div class="add_icon">
                      <img src="./img/sc.png" alt="">
                    </div>
                    <span>点击上传</span>
                  </div>
                </div>
                <el-tag class="upload_img" v-show="infoForm.enterprise_licence" closable @close="removeeEnterprise">
                  <img :src="infoForm.enterprise_licence" alt="">
                </el-tag>
              </el-form-item>
              <el-form-item label="有效期至：" prop="enterprise_licence_endtime" class="QT_img">
                <el-date-picker v-model="infoForm.enterprise_licence_endtime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
            <div class="QTitem">
              <div class="title">药品经营质量管理规范认证证书</div>
              <el-form-item label="证件照片：" prop="enterprise_quality_assurance" class="QT_img">
                <span class="rqstd">格式要求JPG、JPEG、PNG、BMP格式，文件不超过4M</span>
                <div class="upload_box" v-show="!infoForm.enterprise_quality_assurance" @click="uoloadLogo(5)" v-loading="qualityLoding">
                  <div class="box_center">
                    <div class="add_icon">
                      <img src="./img/sc.png" alt="">
                    </div>
                    <span>点击上传</span>
                  </div>
                </div>
                <el-tag class="upload_img" v-show="infoForm.enterprise_quality_assurance" closable @close="removeeQuality">
                  <img :src="infoForm.enterprise_quality_assurance" alt="">
                </el-tag>
              </el-form-item>
              <el-form-item label="有效期至：" prop="enterprise_quality_assurance_endtime" class="QT_img">
                <el-date-picker v-model="infoForm.enterprise_quality_assurance_endtime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <!-- <div class="btn_box">
      <button class="button submit" @click="submitForm">提交</button>
    </div> -->
    <el-input ref="uploadImg" type="file" name="fileName" @change="fileChanged" v-model="filePath" class="selectfile" id="uploadImg" style="display:none;"/>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import axios from 'axios';
import { city } from '@/utils/city';
export default {
  data() {
    return {
      failvisible: false,
      failFrom: { // 审核不通过原因
        text: ''
      },
      filePath: '',
      infoForm: {
        login_id: '',
        // id: '',
        enterprise_type: 1, // 企业类型 1：连锁药店 2：单体药店
        enterprise_name: '', // 企业名称
        enterprise_number: '', // 企业执照注册号
        enterprise_regis_phone: '', // 注册手机号
        enterprise_boss: '', // 负责人
        enterprise_boss_phone: '', // 负责人联系方式
        enterprise_province: '', // 省
        enterprise_city: '', // 市
        enterprise_area: '', // 区
        enterprise_detail_address: '', // 详细地址
        enterprise_introduce: '', // 企业简介
        enterprise_logo: '', // 企业logo
        enterprise_business_license: '', // 营业执照
        enterprise_business_license_endtime: '', // 营业执照有效期
        enterprise_tax_registration: '', // 税务登记证
        enterprise_tax_registration_endtime: '', // 税务登记证有效期
        enterprise_licence: '', // 药品经营许可证
        enterprise_licence_endtime: '', // 药品经营许可证有效期
        enterprise_quality_assurance: '', // 药品经营质量管理证书
        enterprise_quality_assurance_endtime: '', // 药品经营质量管理证书有效期
      },
      rules: {
        enterprise_type: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
        enterprise_name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        enterprise_number: [{ required: true, message: '请输入企业企业执照注册号', trigger: 'blur' }],
        enterprise_regis_phone: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        enterprise_boss: [{ required: true, message: '请输入企业负责人', trigger: 'blur' }],
        enterprise_boss_phone: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        enterprise_area: [{ required: true, message: '请选择企业所在地区', trigger: 'blur' }],
        enterprise_detail_address: [{ required: true, message: '请输入企业详细地址', trigger: 'blur' }],
        enterprise_introduce: [{ required: true, message: '请输入企业简介', trigger: 'blur' }],
        enterprise_logo: [{ required: true, message: '请选择企业logo', trigger: 'blur' }],
        enterprise_business_license: [{ required: true, message: '请选择营业执照', trigger: 'blur' }],
        enterprise_business_license_endtime: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        enterprise_tax_registration: [{ required: true, message: '请选择税务登记证', trigger: 'blur' }],
        enterprise_tax_registration_endtime: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        enterprise_licence: [{ required: true, message: '请选择药品经营许可证', trigger: 'blur' }],
        enterprise_licence_endtime: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        enterprise_quality_assurance: [{ required: true, message: '请选择药品经营质量管理证书', trigger: 'blur' }],
        enterprise_quality_assurance_endtime: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
      },
      provinceOptions: city(),
      cityOptions: [],
      areaOptions: [],
      uploadImgNu: '',
      logoLoding: false, // 上传logo的loding
      businessLoding: false, // 上传营业执照的loding
      tax_Loding: false, // 上传税务登记证的loding
      enterpriseLoding: false, // 经营许可证的loding
      qualityLoding: false, // 经营质量管理证的loding
      addressSurplus: 70, // 地址剩余长度
      introduceSurplus: 200, // 简介剩余长度
    };
  },
  watch: {
    'infoForm.enterprise_province': function() {
      if (this.infoForm.enterprise_province) {
        this.cityOptions = this.provinceOptions.find(x => x.name === this.infoForm.enterprise_province).city;
        this.infoForm.enterprise_city = '';
        this.infoForm.enterprise_area = '';
      }
    },
    'infoForm.enterprise_city': function() {
      if (this.infoForm.enterprise_city) {
        this.areaOptions = this.cityOptions.find(x => x.name === this.infoForm.enterprise_city).districtAndCounty;
        this.infoForm.enterprise_area = '';
      }
    },
    'infoForm.enterprise_detail_address': function() {
      this.addressSurplus = 70 - this.infoForm.enterprise_detail_address.length;
    },
    'infoForm.enterprise_introduce': function() {
      this.introduceSurplus = 200 - this.infoForm.enterprise_introduce.length;
    },
  },
  props: {
    isAdd: Boolean
  },
  methods: {
    // 审核通过
    examineSuccess() {
      this.$confirm('此操作将审核通过该药店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.examine(1, '');
      });
    },
    examine(status, fail) {

      let param = {
        id: this.infoForm.id,
        status: status,
        check_fail: fail
      };
      ajax.get('/api/Pharmacy/ApprovePharmacySystemInfoByid', { params: param }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          // if (this.infoForm.enterprise_status !== 0) {
          this.$message.success(res.data.message);
          this.$router.push('/RPseller/list');
          // }
        }
      });

    },
    // 审核不通过
    examineError() {
      this.failvisible = true;
    },
    queryExamineError() {
      this.failvisible = false;
      this.examine(2, this.failFrom.text);
    },
    examineErrorClose() {
      this.$refs['failFormRule'].resetFields();
    },
    // 取消
    cancel() {
      this.$router.push('/RPseller/list');
    },
    // 保存
    submitForm() {
      let url = '';
      let id = this.$route.query.id;
      if (id) {
        url = '/api/Pharmacy/UpdatePharmacySystemInfoInfoByid';
      } else {
        url = '/api/Pharmacy/AddPharmacySystemInfoInfoByid';
      }
      this.$refs['infoForm'].validate(valid => {
        if (valid) {
          ajax.post(url, this.infoForm).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$message.success(res.data.message);
              if (this.$route.query.id) {
                this.getDetail();
              } else {
                this.$router.push('/RPseller/list');
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    // 表单提交
    fileChanged() {
      if (this.uploadImgNu === 1) {
        this.logoLoding = true;
      }
      if (this.uploadImgNu === 2) {
        this.businessLoding = true;
      }
      if (this.uploadImgNu === 3) {
        this.tax_Loding = true;
      }
      if (this.uploadImgNu === 4) {
        this.enterpriseLoding = true;
      }
      if (this.uploadImgNu === 5) {
        this.qualityLoding = true;
      }
      let _self = this;
      let fileElement = document.getElementById('uploadImg');
      let filename = fileElement.value;
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif' && ext !== '.bmp') {
        _self.$alert('仅支持.jpg,jpeg,png,gif,bmp格式', '提示');
        return;
      }
      let file = fileElement.files[0];
      console.log(file);
      let formdata1 = new FormData();
      formdata1.append('files', file, file.name);
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      _self.fromloaData(formdata1, config);
    },
    fromloaData(formdata1, config) {
      let _self = this;
      axios.post(`${process.env.UPLOAD_HOST}`, formdata1, config).then((response) => {
        let data = response.data;
        _self.filePath = '';
        if (data) {
          // console.log(data);
          let resultObj = data[0].url;
          if (this.uploadImgNu === 1) {
            _self.logoLoding = false;
            this.infoForm.enterprise_logo = resultObj;
          }
          if (this.uploadImgNu === 2) {
            _self.businessLoding = false;
            this.infoForm.enterprise_business_license = resultObj;
          }
          if (this.uploadImgNu === 3) {
            this.tax_Loding = false;
            this.infoForm.enterprise_tax_registration = resultObj;
          }
          if (this.uploadImgNu === 4) {
            this.enterpriseLoding = false;
            this.infoForm.enterprise_licence = resultObj;
          }
          if (this.uploadImgNu === 5) {
            this.qualityLoding = false;
            this.infoForm.enterprise_quality_assurance = resultObj;
          }
        }
      });
    },
    // 手机号验证
    isvalidPhone(str) {
      const reg = /^1[3-9][0-9]\d{8}$/;
      return reg.test(str);
    },
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入电话号码'));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    },
    // 上传图片
    uoloadLogo(nu) {
      // nu 1、logo  2、营业执照
      this.uploadImgNu = nu;
      document.getElementById('uploadImg').click();
    },
    // 删除logo
    removeImg() {
      this.infoForm.enterprise_logo = '';
    },
    // 删除营业执照
    removeBusiness() {
      this.infoForm.enterprise_business_license = '';
    },
    // 删除税务证
    removeTax() {
      this.infoForm.enterprise_tax_registration = '';
    },
    // 删除经营许可证
    removeeEnterprise() {
      this.infoForm.enterprise_licence = '';
    },
    // 删除经营质量管理证
    removeeQuality() {
      this.infoForm.enterprise_quality_assurance = '';
    },
    // 获取详情数据
    getDetail() {
      let id = this.$route.query.id;
      if (id) {
        let obj = {
          id: id
        };
        ajax.get('/api/Pharmacy/GetPharmacySystemInfoByid', { params: obj }).then(res => {
          if (res.status === 200 && res.data.code === 0) {
            console.log(res);
            let data = {};
            /* eslint-disable */
            for (let key in res.data.data) {
              data[key] = res.data.data[key];
            }
            this.infoForm = res.data.data;
            setTimeout(() => {
              this.infoForm.enterprise_city = data.enterprise_city;
              setTimeout(() => {
                this.infoForm.enterprise_area = data.enterprise_area;
              }, 100);
            }, 100);
            // if (res.data.data.enterprise_status === 0) {
            //   this.examine(3, '');
            // }
          // setTimeout(() => {
          //   this.infoForm.enterprise_area = res.data.data.enterprise_area;
          //   console.log(res.data.data.enterprise_area);
          // }, 500);
        }
      });
      }
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="less">
  .info{
    padding: 0 0 100px 50px;
    .button_wrap{
      float: right;
      margin-right: 120px;
    }
  }
  .info_box{
    .box_header{
      display: flex;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 35px;
      .header_line{
        width: 4px;
        height: 20px;
        background-color: #0ccdd4;
        margin-right: 9px;
      }
    }
    .box{
      .tips{
        color: #ccc;
        margin-left: 15px;
      }
      /deep/.el-input{
        width: 290px;
      }
      /deep/.el-radio__inner{
        width: 16px;
        height: 16px;
      }
      /deep/.is-checked {
        .el-radio__inner{
          border-color: #fff;
          background: url('./img/xz.png') no-repeat;
          background-size: 100% 100%;
          width: 18px;
          height: 18px;
          &::after{
            width: 0;
            height: 0;
          }
        }
        .el-radio__label{
          color: #606266;
        }
      }
      .select_option{
        /deep/.el-select{
          margin-right: 16px;
          .el-input{
            width: 135px;
          }
        }
      }
      .logo_img{
        .logo{
          margin-top: 15px;
          width: 100px;
          height: 40px;
          background: #fff;
          border: none;
          /deep/.el-icon-close{
            top: -30px;
          }
          img{
            width: 100px;
            height: 40px;
          }
        }
      }
      .address{
        /deep/.el-input{
          width: 650px;
        }
      }
      .surplus{
        padding-left: 10px;
        color: #cccccc;
      }
      .brief{
        /deep/.el-textarea{
          width: 650px;
          height: 112px;
        }
        textarea{
          height: 100% !important;
        }
      }
      .QTitem_wrap{
        display: flex;
        // justify-content: space-between;
        padding-right: 20px;
        &:nth-child(2){
          margin-top: 30px;
        }
      }
      .QTitem{
        width: 502px;
        // height: 367px;
        border-radius: 4px;
        border: solid 1px #dbdbdb;
        padding: 20px 40px 0px 25px;
        margin-right: 250px;
        .title{
          padding-left: 12px;
          font-size: 16px;
          font-weight: 600;
        }
        .QT_img{
          margin-top: 15px;
          .rqstd{
            font-size: 14px;
            color: #999;
          }
          .upload_box{
            width: 350px;
            height: 200px;
            background-color: #fbfbfb;
            border-radius: 4px;
            border: solid 1px #cccccc;
            display: flex;
            justify-content: space-around;
            align-items: center;
            cursor: pointer;
            .box_center{
              text-align: center;
              color: #999;
            }
            .add_icon{
              width: 78px;
              height: 78px;
              border: solid 1px #cccccc;
              border-radius: 50%;
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
          }
          .upload_img{
            width: 350px;
            height: 200px;
            border: none;
            background: #fff;
            img{
              width: 100%;
              height: 100%;
            }
            /deep/.el-icon-close {
              top: -190px;
            }
          }
          /deep/.el-form-item__label{
            width: 82px !important;
            text-align: left;
            padding: 0;
          }
          /deep/.el-form-item__content{
            margin-left: 82px !important;
          }
          /deep/.el-input {
            width: 100%;
          }
        }
      }
    }
  }
  .btn_box{
    margin: 50px 0;
    text-align: center;
    .button{
      cursor: pointer;
      width: 120px;
      height: 42px;
      border-radius: 4px;
      border: solid 1px #0ccdd4;
      display: inline-block;
      color: #0ccdd4;
    }
    .submit{
      background: #0ccdd4;
      color: #fff;
      margin-left: 40px;
    }
  }
</style>
