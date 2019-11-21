<template>
  <div class="doctor-detail">
    <el-dialog title="关联医院" :visible.sync="dialogFormVisible" label-width="100px;" :modal-append-to-body="false" class="refer-wrapper" :width="'450px'">
      <el-form :model="referhosForm" label-width="120px">
        <el-form-item label="所在省份">
          <el-select placeholder="请选择" @change="changeProvince" v-model="pIndex">
            <el-option v-for="(val,index) of address" :key="index" :label="val.name" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市">
          <el-select placeholder="请选择" v-model="cIndex" @change="changeCity">
            <el-option :key="-1" :label="'全部'" :value="-1"></el-option>
            <el-option v-for="(val,index) of city" :key="index" :label="val.name" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在区域">
          <el-select placeholder="请选择" v-model="tIndex" v-show="!hasTown" @change="changeTown">
            <el-option :key="-1" :label="'全部'" :value="-1"></el-option>
            <el-option v-for="(val,index) of town" :key="index" :label="val.name" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院名">
          <el-col :span="16">
            <el-input v-model="hospitalName"></el-input>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="6">
            <el-button type="primary" round @click="queryHos">搜索</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="医院">
          <el-select placeholder="请选择" v-model="hospitalModel" value-key="id">
            <el-option v-for="h of hospitalList" :key="h.id" :label="h.hos_name" :value="h">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="referHos">确 定</el-button>
      </div>
    </el-dialog>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-check" @click.stop="saveHandler">保存</el-button>
        <el-button type="danger" size="small" icon="el-icon-close" @click.stop="cancel">取消</el-button>
        <el-button type="success" size="small" icon="el-icon-upload" v-show="doctor.isauth===2" @click.stop="submit">提交认证</el-button>
        <el-button type="success" size="small" icon="el-icon-upload" v-show="doctor.isauth===0||doctor.isauth===1||doctor.isauth===3" @click.stop="pass">审核通过</el-button>
        <el-button type="danger" size="small" icon="el-icon-warning" v-show="doctor.isauth===0||doctor.isauth===1||doctor.isauth===3" @click.stop="refuse">审核不通过</el-button>
      </el-button-group>
    </div>
    <hr />
    <div class="form-wrapper clearfix">
      <div class="left">
        <el-form ref="doctorform" :model="doctor" label-width="120px" :rules="rules">
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="doctor.realname"></el-input>
          </el-form-item>
          <el-form-item label="医生填写医院">
            <el-input v-model="doctor.referhosname" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联医院" prop="hosid">
            <el-col :span="16">
              <el-input v-model="hospitalModel.hos_name" disabled></el-input>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="4">
              <el-button type="success" round @click="dialogFormVisible=true;">关联</el-button>
            </el-col>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="科室" prop="departid">
                <el-select v-model="doctor.departid" @change="changeDepartId">
                  <el-option v-for="d in depts" :label="d.departname" :value="d.departid" :key="d.departid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="药柜编码" prop="boxcodes">
                <el-input v-model="doctor.boxcodes" type="text" disabled=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="职称" prop="titleid">
            <el-select v-model="doctor.titleid">
              <el-option v-for="t in titles" :label="t.name" :value="t.code" :key="t.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="doctor.gender">
              <el-option v-for="g in genders" :label="g.gender" :value="g.id" :key="g.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker v-model="doctor.birthday" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="doctor.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="doctor.emailaccount"></el-input>
          </el-form-item>
          <el-form-item label="中药系数">
            <el-input v-model="doctor.pricerate" type="number" step="0.01"></el-input>
          </el-form-item>
          <el-form-item label="西药系数">
            <el-input v-model="doctor.priceratewest" type="number" step="0.01"></el-input>
          </el-form-item>
          <el-form-item label="膏方系数">
            <el-input v-model="doctor.priceratepaste" type="number" step="0.01"></el-input>
          </el-form-item>
          <el-form-item label="丸剂系数">
            <el-input v-model="doctor.priceratepill" type="number" step="0.01"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="doctor.registertime" disabled></el-input>
          </el-form-item>
          <el-form-item label="最后上线时间">
            <el-input v-model="doctor.onlinetime" disabled></el-input>
          </el-form-item>
          <el-form-item label="数字签名">
            <img :src="doctor.digitalsignature" alt="" style="width: 80px;height: 80px;">
          </el-form-item>
            <el-form-item label="个人介绍">
              <el-input type="textarea" v-model="doctor.personalinfo" :rows="personalinfo_rows"></el-input>
            </el-form-item>
            <el-form-item label="擅长治疗">
              <el-input type="textarea" v-model="doctor.expert" :rows="expert_rows"></el-input>
            </el-form-item>
            <el-form-item label="身份证号码" prop="idcardno">
              <el-input v-model="doctor.idcardno"></el-input>
            </el-form-item>
            <el-form-item label="职业资格证号" prop="practicecertificateno">
              <el-input v-model="doctor.practicecertificateno"></el-input>
            </el-form-item>
            <el-form-item label="执业证书">
              <uploadSingleImg :imgUrl="doctor.practicecertificate" :limit="10" :fileName="'practiceImg'" @uploadSuccess="uploadPracticeImg" @removeImg="removePracticeImg"></uploadSingleImg>
            </el-form-item>
            <el-form-item label="医生工作证书">
              <uploadSingleImg :imgUrl="doctor.doctorcertificate" :limit="10" :fileName="'doctorImg'" @uploadSuccess="uploadDoctorImg" @removeImg="removeDoctorImg"></uploadSingleImg>
            </el-form-item>
          <el-form-item label="版本名称">
            <el-input v-model="doctor.docappversionnum" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机信息">
            <el-input v-model="doctor.brand" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <div class="status" :class="{danger:doctor.isauth!==2&&doctor.isauth!==4}">{{checkStatus[doctor.isauth]}}</div>
        <div class="avator-wrapper" @click="selectAvatar" ref="avatar_wrapper">
          <input type="file" style="display: none;" ref="avatarUploader" @change="fileSelected" accept="image/*">
          <img :src="doctor.avatar" alt="">
        </div>
          <div class="connections">
            <div class="patient">
              <p class="number">{{doctor.patientcount}}</p>
              <p class="desc">关联患者</p>
            </div>
            <div class="prec">
              <p class="number">{{doctor.prescriptioncount}}</p>
              <p class="desc">已开处方</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { uploadImg } from '@/api/hospitalManage.js';
import address from '@/components/addressPicker/address-data.js';
import { Loading } from 'element-ui';
import ajax from '@/utils/yilinAjax';
import uploadSingleImg from '@/components/upload/uploadImg';
import { mapGetters } from 'vuex';
export default {
  data() {
    let checkHos = (rule, value, callback, maxValue) => {
      let hosid = Number(value);
      if (value === '' || hosid === 0) {
        callback(new Error(`请关联医院`));
      } else {
        callback();
      }
    };
    return {
      doctor: { personalinfo: '', expert: '' },
      depts: [],
      titles: [{ code: 13, name: '执业医师' }, { code: 14, name: '住院医师' }, { code: 15, name: '主治医师' }, { code: 16, name: '主任' }, { code: 17, name: '副主任' }, { code: 18, name: '教授' }, { code: 19, name: '副教授' }],
      genders: [{ id: 0, gender: '男' }, { id: 1, gender: '女' }],
      checkStatus: {
        '0': '未审核',
        '1': '审核中',
        '2': '审核通过',
        '3': '审核失败',
        '4': '认证成功(医网签)',
        '5': '认证失败(医网签)',
        '6': '认证中(医网签)'
      },
      rules: {
        realname: [{ required: true, message: '请输入医医生姓名', trigger: 'blur' }],
        departid: [{ required: true, message: '请选择科室', trigger: 'blur' }],
        titleid: [{ required: true, message: '请选择职称', trigger: 'blur' }],
        idcardno: [{ required: true, message: '请填写身份证号码', trigger: 'blur' }],
        practicecertificateno: [{ required: true, message: '请填写职业资格证号码', trigger: 'change' }],
        hosid: [{ validator: checkHos, trigger: 'blur' }]
      },
      referhosForm: {},
      dialogFormVisible: false,
      pIndex: 0,
      cIndex: -1,
      tIndex: -1,
      address: address,
      hospitalList: [],
      hospitalName: '',
      hospitalModel: { hos_name: '', hos_id: 0 }
    };
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
    personalinfo_rows: function() {
      if (this.doctor.personalinfo.length <= 0) {
        return 1;
      }
      let temp = this.doctor.personalinfo.replace(/[^ -~]/g, 'aa');
      return Math.ceil(temp.length / 64);
    },
    expert_rows: function() {
      if (this.doctor.expert.length <= 0) {
        return 1;
      }
      let temp = this.doctor.expert.replace(/[^ -~]/g, 'aa');
      return Math.ceil(temp.length / 64);
    },
    province() {
      return this.address[this.pIndex];
    },
    city() {
      return this.address[this.pIndex].cityList.length === 1 ? this.address[this.pIndex].cityList[0].areaList : this.address[this.pIndex].cityList;
    },
    town() {
      if (this.cIndex === -1) {
        return [];
      }
      return this.address[this.pIndex].cityList.length === 1 ? [] : this.address[this.pIndex].cityList[this.cIndex].areaList;
    },
    hasTown() {
      return this.address[this.pIndex].cityList.length === 1;
    }
  },
  mounted() {
    let p = this.$route.query;
    this.getDoctorDetail(p.userid);
    this.getDepts();
  },
  methods: {
    getDoctorDetail(userid) {
      let url = '/api/hospitalManage/getdocuserinfo';
      ajax.get(url, {
        params: { userId: userid }
      }).then((res) => {
        let result = res.data;
        if (res.status === 200 && result && result.code === 0) {
          this.doctor = result.data;
          this.doctor.sourceid = 1;
          this.doctor.isdisturb = 0;
          this.doctor.organizationid = 0;
          this.doctor.nodisturbtime = '0';
          this.doctor.invitemark = 0;
          this.doctor.ywqnoaudit = 0;
          this.doctor.doctorinviterid = 0;
          if (!Number.isNaN(this.doctor.hosid)) {
            this.getHosById(this.doctor.hosid);
          }
        }
      });
    },
    getDepts() {
      let url = '/api/hospitalManage/getdepartall';
      ajax.get(url, {
        params: { state: 0 }
      }).then((res) => {
        let result = res.data;
        if (res.status === 200 && result && result.code === 0) {
          this.depts = result.data;
        }
      });
    },
    buildFileList(files) {
      let result = [];
      let filelist = files.split(',');
      for (let i = 0; i < filelist.length; i++) {
        if (filelist[i]) {
          result.push({ name: '', url: filelist[i] });
        }
      }
      return result;
    },
    uploadPracticeImg(file, filelist) {
      this.doctor.practicecertificate = filelist;
    },
    removePracticeImg(filelist) {
      this.doctor.practicecertificate = filelist;
    },
    uploadDoctorImg(file, filelist) {
      this.doctor.doctorcertificate = filelist;
    },
    removeDoctorImg(filelist) {
      this.doctor.doctorcertificate = filelist;
    },
    selectAvatar() {
      let el = this.$refs['avatarUploader'];
      el.click();
    },
    fileSelected() {
      let el = this.$refs['avatarUploader'];
      if (el.files && el.files[0] && Object.prototype.toString.call(el.files[0]) === '[object File]') {
        let aw = this.$refs['avatar_wrapper'];
        let loading = Loading.service({ target: aw });
        uploadImg(this, el.files[0]).then((res) => {
          loading.close();
          if (res && res.status === 200 && res.data) {
            this.doctor.avatar = res.data[0].url;
          }
        });
      }
    },
    saveHandler() {
      this.preSave(false, -1, '');
    },
    saveDoctor(isauth) {
      let url = '/api/hospitalManage/savedocuserinfo';
      let temp = this.doctor.isauth;
      if (isauth > 0) {
        this.doctor.isauth = isauth;
      }
      ajax.post(url, this.doctor).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 0) {
          this.$message({
            type: 'info',
            message: '操作成功'
          });
        } else {
          this.doctor.isauth = temp;
        }
      }).catch(() => {
        this.doctor.isauth = temp;
      });
    },
    preSave(need, isauth, authesc) {
      let birthday = new Date(this.doctor.birthday);
      let year = Number(birthday.getFullYear());
      let month = Number(birthday.getMonth() + 1);
      let day = Number(birthday.getDate());
      if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        this.doctor.birthday = '1970-01-01';
      } else {
        this.doctor.birthday = year + '-' + month + '-' + day;
      }
      if (isauth === 3 && !!authesc) {
        this.doctor.authdesc = authesc;
      }
      if (need) {
        this.$refs['doctorform'].validate((v) => {
          if (v) {
            this.saveDoctor(isauth);
          }
        });
      } else {
        this.saveDoctor(isauth);
      }
    },
    validateDoc() {
      this.$refs['doctorform'].validate((v) => {
        if (v) {
          this.changeStatus(6, this.doctor.authesc);
        }
      });
    },
    changeStatus(auth, authesc) {
      let userid = this.doctor.userid;
      let temp = this.doctor.isauth;
      let url = '/api/hospitalManage/updatedocuserauthbyuserid';
      let params = { userid: userid, auth: auth, authesc: authesc };
      ajax.post(url, params).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'info',
            message: '提交认证成功！'
          });
        } else {
          this.doctor.isauth = temp;
        }
      }).catch(() => {
        this.doctor.isauth = temp;
      });
    },
    goListPage() {
      this.closeMe();
      let tap = {
        name: 'doctorList',
        path: '/hospital/doctorList',
        meta: {
          title: '医生列表'
        }
      };
      this.$store.dispatch('addVisitedViews', tap);
      this.tabValue = tap.name;
      this.$router.push({
        name: tap.name
      });
    },
    cancel() {
      this.$confirm('取消，所填写数据将不会保存，确定要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.goListPage();
      }).catch(() => {});
    },
    submit() {
      this.$confirm('确定要提交认证吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.validateDoc();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交认证'
        });
      });
    },
    pass() {
      this.$confirm('确定要审核通过吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.preSave(true, 2, '');
      });
    },
    refuse() {
      this.$prompt('请输入不通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.preSave(false, 3, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消了操作'
        });
      });
    },
    queryHos() {
      let a = this.getAddress();
      let request = {
        hosName: this.hospitalName,
        provinceCode: a.province.code,
        cityCode: a.city.code,
        areaCode: a.town.code
      };
      ajax.get(`/api/hospitalManage/getdochospitallist`, { params: request }).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 0) {
          this.hospitalList = res.data.data;
        }
      });
    },
    referHos() {
      this.dialogFormVisible = false;
      this.doctor.hosid = this.hospitalModel.id;
    },
    getHosById(id) {
      let url = '/api/hospitalManage/getdochospitaldetail';
      ajax.get(url, {
        params: { hosId: id }
      }).then((res) => {
        if (res.data && res.data.code === 0) {
          let hos = res.data.data;
          if (hos) {
            this.hospitalModel.id = hos.id;
            this.hospitalModel.hos_name = hos.hos_name;
          }
        }
      });
    },
    changeProvince(pi) {
      this.pIndex = pi;
      this.cIndex = -1;
      this.tIndex = -1;
      this.$emit('ok', this.getAddress());
    },
    changeCity(ci) {
      this.cIndex = ci;
      this.tIndex = -1;
      this.$emit('ok', this.getAddress());
    },
    changeTown(ti) {
      this.tIndex = ti;
      this.$emit('ok', this.getAddress());
    },
    getAddress() {
      let pro = this.province;
      let cit;
      if (this.cIndex === -1) {
        cit = { name: '', code: '' };
      } else {
        cit = this.city[this.cIndex];
      }

      let town;
      if (this.tIndex === -1) {
        town = { name: '', code: '' };
      } else {
        town = this.town[this.tIndex];
      }
      return {
        province: { name: pro.name, code: pro.code },
        city: { name: cit.name, code: cit.code },
        town: { name: town.name, code: town.code }
      };
    },
    initAddress(addressObj) {
      let _this = this;
      let province = addressObj.province;
      let city = addressObj.city;
      let area = addressObj.area;
      let cityList = [];
      let areaList = [];
      for (let i = 0; i < _this.address.length; i++) {
        if (province === _this.address[i].code) {
          cityList = _this.address[i].cityList;
          _this.pIndex = i;
          break;
        }
      }
      for (let i = 0; i < cityList.length; i++) {
        if (city === cityList[i].code) {
          areaList = cityList[i].areaList;
          _this.cIndex = i;
          break;
        }
      }
      for (let i = 0; i < areaList.length; i++) {
        if (area === areaList[i].code) {
          _this.tIndex = i;
          break;
        }
      }
    },
    closeMe() {
      let currentTap = {
        name: this.$route.name,
        path: this.$route.path
      };
      this.$store.dispatch('delVisitedViews', currentTap);
    },
    // 科室改变
    changeDepartId() {
      let departId = this.doctor.departid;
      let index = this.depts.findIndex(v => v.departid === departId);
      this.doctor.boxcodes = this.depts[index].boxcodes;
    }
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  }
};

</script>
<style lang="less" scoped="">
.refer-wrapper {
  /deep/.el-form-item__content {
    width: 240px;
  }
}

.doctor-detail {
  /deep/.el-textarea__inner {
    resize: none !important;
    word-break: break-all;
    word-wrap: break-word;
  }

  padding-bottom: 100px;
  height: 100%;

  .form-wrapper {
    width: 1200px;
    height: 100%;
    padding-top: 30px;
    position: relative;

    .left {
      width: 600px;
    }

    .right {
      position: absolute;
      right: 0;
      top: 30px;
      width: 400px;
      height: 500px;
      overflow: hidden;

      .status {
        position: relative;
        height: 30px;
        background-color: #67c23a;
        text-align: center;
        color: #fff;
        line-height: 30px;
        font-size: 18px;
        font-weight: bold;

        &.danger {
          background-color: #f56c6c;
        }

        &:after {
          content: "";
          display: block;
          width: 0;
          height: 0;
          border-width: 15px;
          border-style: solid;
          border-color: transparent #fff transparent transparent;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 1;
        }
      }

      .avator-wrapper {
        width: 400px;
        height: 370px;
        border: 1px solid #ccc;
        border-top: none;

        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }

      .connections {
        display: flex;
        justify-content: space-around;
        height: 100px;
        padding-top: 30px;

        .patient,
        .prec {
          flex: 0 1 1;
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 110px;
          height: 70px;
          border: 1px solid #ccc;
          justify-content: space-around;

          .number {
            color: #409eff;
            font-weight: bold;
          }
        }
      }
    }
  }
}

</style>
