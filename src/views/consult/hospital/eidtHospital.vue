<template>
  <div class="edit">
    <div class="toolbar-wrapper">
      <el-form ref="editHospitalForm" label-width="100px" size="small" :model="editData" :rules="rules">
        <el-form-item label="医院名称:" style="width: 360px;" prop="hos_name">
          <el-input type="text" placeholder="请输入医院名称" v-model="editData.hos_name">
          </el-input>
        </el-form-item>
        <el-form-item label="医院等级:" style="width: 360px;" prop="level">
          <el-input type="text" placeholder="请输入医院等级" v-model="editData.level">
          </el-input>
        </el-form-item>
        <el-form-item label="省市区:">
          <v-addressPicker ref="addresspicker"></v-addressPicker>
        </el-form-item>
        <el-form-item label="详细地址:" style="width: 360px;" prop="address_detail">
          <el-input placeholder="请输入医院详细地址" type="textarea" :rows="3" v-model="editData.address_detail">
          </el-input>
        </el-form-item>
        <el-form-item label="经度:" style="width: 360px;" prop="longitude">
          <el-input placeholder="请输入经度" v-model="editData.longitude" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="纬度:" style="width: 360px;" prop="latitude">
          <el-input placeholder="请输入纬度" v-model="editData.latitude" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="医院模式:" style="width: 360px;" prop="state">
          <el-radio-group v-model="editData.is_hospital_mode" @change="selectState">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="width: 360px;">
          <el-button @click="resetForm()">重置</el-button>
          <el-button @click="submitForm()" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import addressPicker from '@/components/addressPicker/addressPicker';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    let checkLocation = (rule, value, callback, maxValue, type) => {
      let location = Number(value);
      let empty = /\s+/g;
      if (value === '' || empty.test(value)) {
        callback(new Error(`${type}不能为空`));
      }
      if (Number.isNaN(location)) {
        callback(new Error('请输入数字值'));
      } else {
        if (location < 0 || location > maxValue) {
          callback(new Error(`${type}范围必须在0~${maxValue}之间`));
        } else {
          callback();
        }
      }
    };
    let checkLongitude = (rule, value, callback) => {
      checkLocation(rule, value, callback, 180, '经度');
    };
    let checkLatitude = (rule, value, callback) => {
      checkLocation(rule, value, callback, 90, '纬度');
    };
    return {
      editData: {
        id: 0,
        hos_name: '',
        level: '',
        address_detail: '',
        longitude: 0,
        latitude: 0,
        province_code: '',
        city_code: '',
        area_code: '',
        is_hospital_mode: 0 // 是否医院模式（1：是，0：否），默认是0
      },
      rules: {
        hos_name: [{ required: true, message: '请输入医院名称', trigger: 'blur' }],
        level: [{ required: true, message: '请输入医院等级', trigger: 'blur' }],
        address_detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        longitude: [{ validator: checkLongitude, trigger: 'blur' }],
        latitude: [{ validator: checkLatitude, trigger: 'blur' }]
      }
    };
  },
  mounted() {
    let hospitalId = this.$route.query.hospitalId;
    if (hospitalId) {
      let url = '/api/hospitalManage/getdochospitaldetail';
      ajax.get(url, {
        'params': { 'hosId': hospitalId }
      }).then((res) => {
        if (res.data && res.data.code === 0) {
          let hos = res.data.data;
          this.editData = hos;
          this.$refs['addresspicker'].initAddress({
            province: hos.province_code,
            city: hos.city_code,
            area: hos.area_code
          });
        }
      });
    }
  },
  methods: {
    submitForm() {
      let a = this.$refs['addresspicker'].getAddress();
      this.editData.province_code = a.province;
      this.editData.city_code = a.city;
      this.editData.area_code = a.town;
      this.$refs['editHospitalForm'].validate((valid) => {
        if (valid) {
          let url = `/api/hospitalManage/savedochospital`;
          ajax.post(url, this.editData).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              this.closeMe();
              let tap = {
                name: 'hospitalList',
                path: '/hospital/hospitalList',
                meta: {
                  title: '医院列表'
                }
              };
              this.$router.push({
                path: tap.path,
                query: this.$route.query
              });
            }
          });
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs['editHospitalForm'].resetFields();
      this.$refs['addresspicker'].initAddress({
        province: '110000',
        city: '110100',
        area: '110101'
      });
    },
    closeMe() {
      let currentTap = {
        name: this.$route.name,
        path: this.$route.path
      };
      this.$store.dispatch('delVisitedViews', currentTap);
    }
  },
  components: {
    'v-addressPicker': addressPicker
  }
};

</script>
<style scoped>
textarea {
  resize: none !important;
}

</style>
