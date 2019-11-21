<template>
  <div id="rider">
    <div class="search-wrapper">
      <el-form :inline="true" :model="search" size="small" ref="serachFrom">
        <el-row>
          <el-col :span="5">
            <el-form-item label="骑手姓名">
              <el-input v-model.trim="search.riderName" placeholder="请输入骑手姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="骑手电话">
              <el-input  v-model="search.phone" placeholder="请输入骑手电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="default" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
              <!-- <el-button type="primary" icon="el-icon-share" size="small" @click="query">导出</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addRider">新增骑手</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="search.pageSize" :page-index="search.pageNum"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 新增编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="riderShow"
      width="480px"
      center
      top="15vh"
      :modal-append-to-body="false"
      @close="clsoeActive('FormRules')">
      <el-form :model="addRiderinfo" ref="FormRules" size="small"  label-width="130px" :rules="rules" class="riderFrom">
        <el-form-item label="骑手姓名：" prop="riderName">
          <el-input v-model="addRiderinfo.riderName" placeholder="请输入店员姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="addRiderinfo.phone" placeholder="请输入手机号"  :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select v-model="addRiderinfo.sex" size='small'>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-select v-model="addRiderinfo.province" size='small' @change="provinceChange">
            <el-option
              v-for="item in addressProvinceArray"
              :key="item.provinceId"
              :label="item.province"
              :value="item.province">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-select v-model="addRiderinfo.city" size='small' @change="cityChange">
            <el-option
              v-for="item in addressCityArray"
              :key="item.cityId"
              :label="item.city"
              :value="item.city">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区/县" prop="district">
          <el-select v-model="addRiderinfo.district" size='small'>
            <el-option
              v-for="item in addressDistrictArray"
              :key="item.areaId"
              :label="item.area"
              :value="item.area">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-select v-model="addRiderinfo.state" size='small'>
            <el-option label="正常" :value="1"></el-option>
            <!-- <el-option label="待激活" :value="2" v-if="!isAdd"></el-option> -->
            <el-option label="冻结" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责药店：" prop="riderConnectionArray">
          <el-tag closable :disable-transitions="false" v-for="(item, index) in addRiderinfo.riderConnectionArray" :key="item.sellerUserId" @close="tagClose(index)">{{item.sellerName}}</el-tag>
          <el-button @click="sellerShow = true">选择药店</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="save">完成</el-button>
      </span>
    </el-dialog>
    <!-- 商户列表 -->
    <el-dialog
      title="选择药店"
      :visible.sync="sellerShow"
      width="70%"
      center
      top="15vh"
      :modal-append-to-body="false"
      @close="tableClose">
      <v-table ref="data_table_seller" column-width-drag is-horizontal-resize style="width:100%" :columns="Sellercolumns" :table-data="seller.sellerData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
      <div class="pagin-wrapper">
        <v-pagination @page-change="SellerpageChange" @page-size-change="SellerpageSizeChange" :total="seller.total" :page-size="seller.pageSize" :page-index="seller.pageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sellerShow = false">取 消</el-button>
        <el-button type="primary" @click="selctSeller">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from 'vue';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
import javaAjax from '@/utils/riderAjax';
export default {
  data() {
    return {
      // 请求参数
      search: {
        riderName: '',
        phone: '',
        pageNum: 1,
        pageSize: 10,
        orderBy: 'asc'
      },
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 省份列表
      addressProvinceArray: [],
      // 城市列表
      addressCityArray: [],
      // 区县
      addressDistrictArray: [],
      // 总数
      total: 0,
      // 新增字段
      addRiderinfo: {
        riderName: '',
        phone: '',
        sex: '',
        province: '',
        city: '',
        district: '',
        state: '',
        riderConnectionArray: []
      },
      // 弹窗
      riderShow: false,
      // 弹窗标题
      title: '',
      // 修改禁用
      isAdd: true,
      rules: {
        riderName: [
          { required: true, validator: this.isvalidName, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: this.validatePhone, trigger: 'blur' },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'blur' },
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'blur' },
        ],
        district: [
          { required: true, message: '请选择区县', trigger: 'blur' },
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
        riderConnectionArray: [
          { required: true, message: '请选择负责药店', trigger: 'blur' },
        ],
      },
      // 药店
      seller: {
        sellerData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      selctSellerData: [],
      sellerShow: false
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    },
    'addRiderinfo.province': function() {
      if (this.addRiderinfo.province) {
        this.getCitiesByProvincial();
        this.seller.sellerData = [];
      }
    },
    'addRiderinfo.city': function() {
      if (this.addRiderinfo.city) {
        this.getareasByCity();
        this.getSellerByAddres();
        this.seller.sellerData = [];
      }
    },
    'sellerShow': function() {
      try {
        this.$refs['data_table_seller'].resize();
      } catch (error) {
        console.log(error);
      }
    }
  },
  props: {
    isExamine: Boolean,
    // index: Number
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.search.pageNum - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'riderName', title: '姓名', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sex', title: '性别', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'city', title: '所在城市', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'riderConnectionPo', title: '负责药店', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'phone', title: '手机号', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-rider', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            }
          };
        }
        if (item.field === 'city') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v1 = rowData[field];
            let v2 = rowData['district'];
            let value = v1 + v2;
            return value || '-';
          };
        }
        if (item.field === 'riderConnectionPo') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field] ? rowData[field].sellerName : '';
            return value || '-';
          };
        }
        if (item.field === 'state') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              if (rowData['receiptState'] === 1) {
                return `<span style="color:green">正常<span style="color:red">(休息中)</span></span>`;
              } else if (rowData['receiptState'] === 2) {
                return `<span style="color:green">正常</span>`;
              } else {
                return `<span style="color:green">正常</span>`;
              }
            } else if (value === 2) {
              return '<span style="color:red">待激活</span>';
            } else if (value === 3) {
              return '<span style="color:red">冻结</span>';
            } else if (value === 4) {
              return '<span style="color:red">已删除</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ]),
    Sellercolumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.seller.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '商户名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'businessType', title: '商户类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'brand', title: '所属品牌', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressProvince', title: '省份', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '商户地址', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'auditStatus', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'numberDrugs', title: '商户药品品规数量', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-business', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            }
          };
        }
      }
      return columns;
    }
  },
  methods: {
    cityChange() {
      // this.getareasByCity();
      // this.getSellerByAddres();
      this.addRiderinfo.district = '';
      this.addRiderinfo.riderConnectionArray = [];
      this.seller.sellerData = [];
    },
    provinceChange() {
      // this.getCitiesByProvincial();
      this.addRiderinfo.city = '';
      this.addRiderinfo.district = '';
      this.addRiderinfo.riderConnectionArray = [];
      this.seller.sellerData = [];
    },
    // 手机号验证
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    },
    // 姓名验证
    isvalidName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入骑手姓名'));
      } else {
        const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入中文的骑手姓名'));
        }
      }
    },
    // 清空
    empty() {
      this.search.riderName = '';
      this.search.phone = '';
      this.search.pageNum = 1;
      this.search.pageSize = 10;
      this.getTableDataCondition();
    },
    // 查询
    query() {
      this.search.pageNum = 1;
      this.getTableDataCondition();
    },
    addRider() {
      this.riderShow = true;
      this.isAdd = true;
    },
    save() {
      let url = '';
      if (this.isAdd) {
        url = '/mall_abutment/back/rider/addRiderUser';
      } else {
        url = '/mall_abutment/back/rider/updateRiderUser';
      }
      this.$refs['FormRules'].validate((valid) => {
        if (valid) {
          this.riderShow = false;
          let _self = this;
          javaAjax.post(url, this.addRiderinfo).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    clsoeActive(from) {
      // clsoeActive
      // this.$refs[from].resetFields();
      this.addRiderinfo = {
        riderName: '',
        phone: '',
        sex: '',
        province: '',
        city: '',
        district: '',
        state: '',
        riderConnectionArray: []
      };
      this.seller.sellerData = [];
    },
    tableClose() {
      this.$refs['data_table_seller'].resize();
    },
    tagClose(index) {
      this.addRiderinfo.riderConnectionArray.splice(index, 1);
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 删除
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将删除该骑手, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          javaAjax.post('/mall_abutment/back/rider/delRider', { phone: params.rowData.phone }).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.getTableDataCondition();
            }
          });
        });
      } else if (params.type === 'edit') {
        this.getDetail(params.rowData.phone);
      }
    },
    // 查询骑手信息列表
    getTableDataCondition() {
      let _self = this;
      let url = '/mall_abutment/back/rider/queryRiderUser';
      let param = _self.search;
      javaAjax.post(url, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
        }
      });
    },
    getDetail(phone) {
      // ?获取修改数据
      let param = {
        phone: phone
      };
      javaAjax.post(`/mall_abutment/back/rider/queryRiderDetails`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.riderShow = true;
          this.isAdd = false;
          this.addRiderinfo = {
            riderUserId: res.data.resultData.riderUserId,
            riderName: res.data.resultData.riderName,
            phone: res.data.resultData.phone,
            sex: res.data.resultData.sex,
            province: res.data.resultData.province,
            city: res.data.resultData.city,
            district: res.data.resultData.district,
            state: res.data.resultData.state === 2 ? '待激活' : res.data.resultData.state,
            riderConnectionArray: res.data.resultData.riderConnectionArray ? res.data.resultData.riderConnectionArray : []
          };
        }
      });
    },
    // 分页
    pageChange(pageIndex) {
      this.search.pageNum = pageIndex;
      this.getTableDataCondition();
    },
    pageSizeChange(pageSize) {
      this.search.pageSize = pageSize;
      this.getTableDataCondition();
    },
    SellerpageChange(pageIndex) {
      this.seller.pageIndex = pageIndex;
      this.getSellerByAddres();
    },
    SellerpageSizeChange(pageSize) {
      this.seller.pageSize = pageSize;
      this.getSellerByAddres();
    },
    selectALL(selection) {
      this.selctSellerData = selection.map(item => {
        return {
          sellerUserId: item.sellerUserId,
          sellerName: item.sellerName
        };
      });
    },
    selectChange(selection, rowData) {
      this.selctSellerData = selection.map(item => {
        return {
          sellerUserId: item.sellerUserId,
          sellerName: item.sellerName
        };
      });
    },
    selectGroupChange(selection) {
      this.selctSellerData = selection.map(item => {
        return {
          sellerUserId: item.sellerUserId,
          sellerName: item.sellerName
        };
      });
    },
    // 确认选择药店
    selctSeller() {
      this.sellerShow = false;
      this.addRiderinfo.riderConnectionArray = this.uniq(this.addRiderinfo.riderConnectionArray.concat(this.selctSellerData));
      // console.log(this.addRiderinfo.riderConnectionArray);
    },
    // 将对象元素转换成字符串以作比较
    objkey(obj, keys) {
      let n = keys.length;
      let key = [];
      while (n--) {
        key.push(obj[keys[n]]);
      }
      return key.join('|');
    },
    // 数组去重
    uniq(array) {
      let arr = [];
      let hash = {};
      for (let i = 0, j = array.length; i < j; i++) {
        let k = this.objkey(array[i], ['sellerUserId']);
        if (!(k in hash)) {
          hash[k] = true;
          arr.push(array[i]);
        }
      }
      return arr;
    },
    getProvincials() {
      // 省
      javaAjax.post(`mall_abutment/back/rider/getProvincials`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.map(item => {
            return {
              province: item.province,
              provinceId: item.provinceId
            };
          });
          this.addressProvinceArray = newData;
        }
      });
    },
    getCitiesByProvincial() {
      // 市
      javaAjax.post(`/mall_abutment/back/rider/getCitiesByProvincial`, { province: this.addRiderinfo.province, provinceId: '' }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.cities.map(item => {
            return {
              city: item.city,
              cityId: item.cityId,
            };
          });
          this.addressCityArray = newData;
        }
      });
    },
    getareasByCity() {
      // 区
      javaAjax.post(`/mall_abutment/back/rider/getAreasByCity`, { city: this.addRiderinfo.city, cityId: '' }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.cities[0].areas.map(item => {
            return {
              area: item.area,
              areaId: item.areaId
            };
          });
          this.addressDistrictArray = newData;
        }
      });
    },
    getSellerByAddres() {
      // 根据地区获取药店
      let param = {
        pageNum: this.seller.pageIndex,
        pageSize: this.seller.pageSize,
        sellerName: '',
        brand: '',
        addressProvince: '',
        addressCity: this.addRiderinfo.city,
        mobile: '',
        sellerAddress: '',
        businessType: ''
      };
      javaAjax.post(`/mall_abutment/back/rider/queryLikeSellUser`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.seller.sellerData = res.data.resultData.data;
          this.seller.total = res.data.resultData.total;
          // console.log(this.seller.sellerData);
        }
      });
    },
  },
  created() {
    // 获取骑手列表信息
    this.getTableDataCondition();
    this.getProvincials();
  }
};
</script>

<style lang="less" scoped>

.display-box{
  margin-bottom: 5px;
  .txt{
    display: block;
    font-weight: bold;
    margin-right: 8px;
    width: 200px;
  }
  .box-flex{
    white-space: normal;
    word-break: break-all;
    line-height: 24px;
  }
}
.riderFrom{
  /deep/ .el-select{
    width: 100%;
  }
  /deep/ .el-tag{
    margin-right: 8px;
  }
}
</style>
