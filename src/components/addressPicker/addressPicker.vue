<template>
  <div class="picker">
    <el-select placeholder="请选择" @change="changeProvince" style="width: 150px;" v-model="pCode">
      <el-option v-for="(p,index) of provinces" :key="index" :label="p.region_name" :value="p.region_code">
      </el-option>
    </el-select>
    <el-select placeholder="请选择" style="margin-left: 10px;width: 150px;" v-model="cCode" @change="changeCity">
      <el-option v-for="(c,index) of cities" :key="index" :label="c.regionname" :value="c.regioncode">
      </el-option>
    </el-select>
    <el-select placeholder="请选择" style="margin-left: 10px;width: 150px;" v-model="tCode" @change="changeTown" v-show="towns.length>0">
      <el-option v-for="(t,index) of towns" :key="index" :label="t.regionname" :value="t.regioncode">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      pCode: '',
      cCode: '',
      tCode: '',
      provinces: [],
      cities: [],
      towns: []
    };
  },
  mounted() {
    this.getProvinces();
  },
  methods: {
    changeProvince(pc) {
      this.pCode = pc;
      this.getCities(pc).then(() => {
        this.cCode = '';
        this.tCode = '';
        this.towns = [];
      });
    },
    changeCity(cc) {
      this.cCode = cc;
      this.getTowns(cc).then((res) => {
        this.tCode = '';
      });
    },
    changeTown(tc) {
      this.tCode = tc;
    },
    getAddress() {
      return {
        province: this.pCode,
        city: this.cCode,
        town: this.tCode
      };
    },
    async getProvinces() {
      let url = '/api/provinces/getprovinceslist';
      let rs = await ajax.get(url).then((res) => {
        if (res.status === 200 && res.data) {
          this.provinces = res.data.data;
        }
      });
      return rs;
    },
    async getCities(pcode) {
      let url = '/api/provicecity/getprovicecitylist';
      let rs = await ajax.get(url, {
        params: { regionCode: pcode }
      }).then((res) => {
        if (res.status === 200 && res.data) {
          this.cities = res.data.data;
        }
      });
      return rs;
    },
    async getTowns(ccode) {
      let url = '/api/cityareas/getcityareaslist';
      let rs = await ajax.get(url, {
        params: { regionCode: ccode }
      }).then((res) => {
        if (res.status === 200 && res.data) {
          this.towns = res.data.data;
        }
      });
      return rs;
    },
    clear() {
      this.pCode = '';
      this.cCode = '';
      this.tCode = '';
      this.$emit('ok', this.getAddress());
    },
    async initAddress(addressObj) {
      let province = addressObj.province;
      let city = addressObj.city;
      let area = addressObj.area;
      this.pCode = province;
      await this.getCities(province);
      this.cCode = city;
      await this.getTowns(city);
      this.tCode = area;
    }
  }
};

</script>
<style scoped>
.picker {
  width: 100%;
  display: flex;

  div {
    flex: 0 1 1;
  }
}

</style>
