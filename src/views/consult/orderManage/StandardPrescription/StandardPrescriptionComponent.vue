<template>
  <div>
    <el-form ref="ListData" :model="ListData" label-width="200px" class="demo-ruleForm" size="small"
             label-position="left" :rules="rules">
      <el-form-item label="处方类别" prop="category_id">
        <el-select v-model="ListData.category_id" placeholder="请选择" filterable>
          <el-option v-for="item in pList" :key="item.id" :label='item.name' :value='item.id'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处方名称" prop="name">
        <el-input v-model="ListData.name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="原籍" prop="originally_from">
        <el-input type="textarea" v-model="ListData.originally_from "></el-input>
      </el-form-item>
      <el-form-item label="功用" prop="indication">
        <el-input type="textarea" v-model="ListData.indication"></el-input>
      </el-form-item>
      <el-form-item label="主治" prop="symptom">
        <el-input type="textarea" v-model="ListData.symptom"></el-input>
      </el-form-item>
      <el-form-item label="出处">
        <el-input type="textarea" v-model="ListData.source"></el-input>
      </el-form-item>
      <el-form-item label="其他">
        <el-input type="textarea" v-model="ListData.others"></el-input>
      </el-form-item>
      <el-form-item class="form-button-wrapper">
        <el-button type="primary" @click='onSubmit("ListData")' icon="el-icon-check">提交</el-button>
      </el-form-item>
      <!--4.处方表单表单-->
      <div class="btn-group" v-show="pageType ==='entry'">
        <el-button size="small" class="el-icon-plus" @click="tapTable(0)">添加中药处方</el-button>
        <el-button size="small" class="el-icon-plus" @click="tapTable(2)">添加膏方</el-button>
        <el-button size="small" class="el-icon-plus" @click="tapTable(1)">添加西药处方</el-button>
      </div>
      <div class="table-tab-box" style="margin-bottom: 100px;">
        <!--1.中药处方表单-->
        <el-row class="recipeContainer" id="CNMedicine" v-show="recipeDetail.prescr_type === 0">
          <el-row class="table">
            <div class="tableHeader title">
              <el-row>
                <span class="title-name">中药清单</span>
              </el-row>
              <el-row type="flex" justify="space-between" class='dose'>
                <el-col :span="8">
                  <el-form-item label="剂数:" label-width="50px">
                    <el-input-number size="mini" controls-position="right"
                                     v-model="recipeDetail.amount"
                                     :min="1" :max="10000"
                                     label="描述文字"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="width: 88px" v-if="this.pageType === 'entry'">
                  <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
                </el-col>
              </el-row>
            </div>
            <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                     :columns="pageType !== 'entry'?coloumsDetail : columnsChinieseMedicine"
                     :cell-edit-done="cellEditDone"
                     :table-data="docprescriptiondetails" row-hover-color="#eee"
                     row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
          </el-row>
        </el-row>
        <!--2.膏方表单-->
        <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescr_type === 2">
          <div class="table">
            <div class="tableHeader title">
              <span class="title-name">膏方清单</span>
              <el-row type="flex" justify="space-between" class='dose'>
                <el-col :span="8">
                  <el-form-item label="剂数:" label-width="50px">
                    <el-input-number size="mini" disabled controls-position="right"
                                     :min="0" :max="1000000" label="描述文字"
                                     value="1"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="width: 88px" v-if="pageType === 'entry'">
                  <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
                </el-col>
              </el-row>
            </div>
            <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                     :columns="pageType !== 'entry'?coloumsDetail : columnsPlaster"
                     :cell-edit-done="cellEditDone"
                     :table-data="docprescriptiondetails" row-hover-color="#eee"
                     row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
          </div>
        </el-row>
        <!--3.西药表单-->
        <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescr_type === 1">
          <div class="table">
            <div class="tableHeader title">
              <span class="title-name">西药清单</span>
              <el-row type="flex" justify="end" class='dose'>
                <el-col :span="2" style="width: 88px" v-if="this.pageType === 'entry'">
                  <el-button class="button el-icon-plus" size="small" @click="addDrug(1)">添加药材</el-button>
                </el-col>
              </el-row>
            </div>
            <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                     :columns="isEdit ? columnsWester:columnsWesterDetail"
                     :cell-edit-done="cellEditDone"
                     :table-data="docprescriptiondetails" row-hover-color="#eee"
                     row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
          </div>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import yilin from '@/utils/yilinAjax';
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      pList: [],
      ListData: {
        name: '',
        category_id: '',
        originally_from: '',
        indication: '',
        symptom: '',
        source: '',
        others: ''
      },
      // 验证
      rules: {
        category_id: [
          { required: true, message: '请选择处方类别', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入处方名称', trigger: 'blur' }
        ],
        originally_from: [
          { required: true, message: '请输入原籍', trigger: 'blur' }
        ],
        indication: [
          { required: true, message: '请输入适宜人群', trigger: 'blur' }
        ],
        symptom: [
          { required: true, message: '请输入主治', trigger: 'blur' }
        ],
      },
      // 1.中药清单表格
      docprescriptiondetails: [],
      pageType: 'entry',
      recipeDetail: {
        prescr_type: 0,
        amount: 1
      },
      isCheckFalse: false
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    isEdit() {
      return this.pageType === 'entry' ? true : false;
    },
    // 1.中药清单列表
    columnsChinieseMedicine() {
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowIndex + 1;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'drug_name',
          title: '*药品名',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true,
          componentName: 'table-table-operation-drug-selectDrug', // 中药清单药品名称
        },
        {
          field: 'dose',
          title: '*剂量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'left',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'm_usage',
          title: '用法',
          width: 180,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-classic-drug-usage',
        },
        {
          field: 'unit_price',
          title: '*药价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.dose * rowData.unit_price).toFixed(4);
          },
          isResize: true,
          isEdit: true
        },
        {
          field: 'medicines',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-table-operation-drug-selectDrug', // 中药清单药品名称
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
        }
      ];
      return columns;
    },
    // 2.膏药清单列表
    columnsPlaster() {
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowIndex + 1;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'drug_name',
          title: '*药品名',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true,
          componentName: 'table-table-operation-drug-selectDrug', // 中药清单药品名称
        },
        {
          field: 'dose',
          title: '*剂量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'left',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'm_usage',
          title: '用法',
          width: 180,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-classic-drug-usage',
        },
        {
          field: 'unit_price',
          title: '*药价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.dose * rowData.unit_price).toFixed(4);
          },
          isResize: true,
          isEdit: true
        },
        {
          field: 'medicines',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-table-operation-drug-selectDrug', // 中药清单药品名称
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
        }
      ];
      return columns;
    },
    // 3.西药清单列表
    columnsWester() {
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowIndex + 1;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'drug_name',
          title: '*药品名',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true,
          componentName: 'table-table-operation-drug-selectDrug', // 中药清单药品名称
        },
        {
          field: 'dose',
          title: '*剂量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'left',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'goods_norms',
          title: '规格',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'goods_orgin',
          title: '产地',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'unit_price',
          title: '*药价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.dose * rowData.unit_price).toFixed(4);
          },
          isResize: true,
          isEdit: true
        },
        {
          field: 'm_usage',
          title: '用法',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'medicines',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-table-operation-drug-selectDrug', // 中药清单药品名称
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
        }
      ];
      return columns;
    },
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 表格验证
    tableValid() {
      let tableObj = this.docprescriptiondetails;
      if (tableObj.length === 0) {
        this.$alert('请添加药材', '提示');
        this.isCheckFalse = false;
        return;
      }
      try {
        tableObj.forEach((item, index) => {
          if (!item.drug_name) {
            this.$alert('请选择药品', '提示');
            throw new Error('StopIteration');
          } else if (!item.medicines) {
            this.$alert('请选择药生开具药品名', '提示');
            throw new Error('StopIteration');
          } else if (!item.dose) {
            this.$alert('剂量不能为空和0', '提示');
            throw new Error('StopIteration');
          } else if (!item.unit_price) {
            this.$alert('药价不能为空', '提示');
            throw new Error('StopIteration');
          } else if (index === tableObj.length - 1 && !!item.drug_name && !!item.medicines && !!item.dose &&
            !!item.unit_price) {
            this.isCheckFalse = true;
          }
        });
      } catch (e) {
        if (e.message === 'StopIteration ') {
          this.isCheckFalse = false;
        }
      }
    },
    // 提交-表单验证
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableValid();
          if (this.isCheckFalse) {
            let urlPaste = '';
            let datasPaste = {};
            if (this.$route.name === 'addStandardPrescription') {
              // 新增
              urlPaste = '/api/ordermanage/CreatePrescriptionsStandard';
              datasPaste = {
                id: 0,
                name: this.ListData.name,
                pic: this.ListData.pic,
                category_id: this.ListData.category_id,
                originally_from: this.ListData.originally_from,
                indication: this.ListData.indication,
                symptom: this.ListData.symptom,
                source: this.ListData.source,
                others: this.ListData.others,
                type: this.recipeDetail.prescr_type,
                prescr_type: this.recipeDetail.prescr_type,
                amount: this.recipeDetail.amount,
                status: 0,
                create_time: '2018-04-20 14:52:39',
                docPrescriptionDetailsStandards: this.docprescriptiondetails
              };
            } else if (this.$route.name === 'editStandardPrescription') {
              // 编辑
              urlPaste = '/api/ordermanage/UpdatePrescriptionsStandard';
              datasPaste = {
                id: this.$route.query.id,
                name: this.ListData.name,
                pic: this.ListData.pic,
                category_id: this.ListData.category_id,
                originally_from: this.ListData.originally_from,
                indication: this.ListData.indication,
                symptom: this.ListData.symptom,
                source: this.ListData.source,
                others: this.ListData.others,
                type: this.recipeDetail.prescr_type,
                prescr_type: this.recipeDetail.prescr_type,
                amount: this.recipeDetail.amount,
                status: this.ListData.status,
                docPrescriptionDetailsStandards: this.docprescriptiondetails
              };
            }
            yilin.post(urlPaste, datasPaste).then((res) => {
              if (res.status === 200 && res.data.code === 0) {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                let _self = this;
                // 关闭当前页并跳转列表页
                let currentName = _self.$route.name;
                let currentTab = _self.visitedViews.find((x) => x.name === currentName);
                _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                  _self.$router.push({
                    path: '/orderManage/StandardPrescription',
                    query: {
                      from: _self.$route.name,
                      name: _self.$route.query.name ? _self.$route.query.name : '',
                      indication: _self.$route.query.indication ? _self.$route.query.indication : '',
                      pageIndex: _self.$route.query.pageIndex,
                      pageSize: _self.$route.query.pageSize
                    }
                  });
                });
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error'
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 获取详情
    getDetailData() {
      let id = { id: this.$route.query.id };
      yilin.get('/api/ordermanage/GetPrescriptionsStandardDetailList', { params: id }).then((res) => {
        if (res.status === 200 && !!res.data) {
          let resData = res.data.data;
          this.ListData = resData;
          if (resData.docprescriptiondetailsstandards) {
            this.docprescriptiondetails = resData.docprescriptiondetailsstandards;
          }
          this.recipeDetail = {
            prescr_type: resData.prescr_type,
            amount: resData.amount
          };
        }
      });
    },
    // 获取处方类别
    getpList() {
      yilin.get('/api/ordermanage/getPrescriptionsStandardCategory').then((res) => {
        if (res.status === 200 && !!res.data) {
          let resData = res.data.data;
          this.pList = resData;
        }
      });
    },
    // 1.中药清单-添加中药药材
    addDrug(value) {
      let type = value;
      this.docprescriptiondetails.push(
        {
          id: '',
          paste_id: '',
          drug_name: '',
          medicines: '',
          dose: 1,
          m_usage: '无',
          type: type,
          unit: '',
          goods_num: '',
          remark: '',
          unit_price: 0,
          // 商品规格，产地
          goods_norms: '',
          goods_orgin: '',
        });
    },
    // 2.中药清单单元格编辑回调
    cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
      this.docprescriptiondetails[rowIndex][field] = newValue;
      // 接下来处理你的业务逻辑，数据持久化等...
    },
    // 5.表单切换sssss
    tapTable(type) {
      this.recipeDetail.prescr_type = type;
      this.docprescriptiondetails = [];
      let drugType = type === 1 ? 1 : 0;
      this.addDrug(drugType);
    },
    // 自定义组件删改操作
    customCompFunc(params)
    {
      // 验证添加的药材是否一样
      let isSame = false;
      // 1.中药清单-移除药材
      if (params.type === 'removeChineseMedicine') {
        this.docprescriptiondetails.splice(params.index, 1);
      }
      // 2.中药清单-药材改变
      else if (params.type === 'medicineChange') {
        this.docprescriptiondetails.map((item) => {
          if (item.drug_name === params.value) {
            isSame = true;
            this.docprescriptiondetails[params.index].drug_name = '';
            this.docprescriptiondetails[params.index].medicines = '';
            this.docprescriptiondetails[params.index].unit = '';
            this.docprescriptiondetails[params.index].unit_price = '';
            this.docprescriptiondetails[params.index].goods_norms = '';
            this.docprescriptiondetails[params.index].goods_orgin = '';
            this.docprescriptiondetails = Object.assign([], this.docprescriptiondetails);
            this.$alert('药品重复', '提示');
            return item;
          }
          return item;
        });
        if (!isSame) {
          this.docprescriptiondetails[params.index].drug_name = params.value;
          this.docprescriptiondetails[params.index].medicines = params.value;
          this.docprescriptiondetails[params.index].unit = params.unit;
          this.docprescriptiondetails[params.index].unit_price = params.unitprice;
          this.docprescriptiondetails[params.index].goods_norms = params.goodsnorms;
          this.docprescriptiondetails[params.index].goods_orgin = params.goodsorgin;
        }
      }
      // 3.中药清单-用法改变
      else if (params.type === 'usageChange') {
        this.docprescriptiondetails[params.index].m_usage = params.value;
      }
      // 3.中药清单-剂量增加
      else if (params.type === 'numChange') {
        this.docprescriptiondetails[params.index].dose = params.value;
      }
    },
  },
  created() {
    this.getpList();
    // 编辑-获取详情
    if (this.$route.name === 'editStandardPrescription') {
      this.getDetailData();
    }
  }
};
// 中药清单-选择药品
Vue.component('table-table-operation-drug-selectDrug', {
  template: `<div class="input-remote">
  <el-select
    v-model="rowData.medicines"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    @change="changeValue"
    :loading="loading">
    <el-option
      v-for="item in options4"
      :key="item.key"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</div>`,
  components: {
    yilin,
  },
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      options4: [],
      value9: [],
      list: [{}],
      loading: false,
    };
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        let type = this.rowData.type;
        yilin.get('/api/ordermanage/searchherbslist', {
          params: { 'pyCode': query, 'count': 8, 'type': type }
        }).then((res) => {
          if (res.status === 200 && res.statusText === 'OK') {
            let list = res.data.data;
            this.options4 = list.map(item => {
              return Object.assign(item, { label: item.drugname, value: item.drugname });
            });
          }
        });
        this.loading = false;
      } else {
        this.options4 = [];
      }
    },
    changeValue(value) {
      let item = this.options4.filter(item => {
        return item.label === value;
      });
      this.$emit('on-custom-comp',
        Object.assign(item[0], { type: 'medicineChange', index: this.index, rowData: this.rowData }));
    }
  }
});
</script>
<style lang="less">
  .form-button-wrapper {
    height: 80px;
    text-align: center;
  }
</style>
<style lang="less" scoped>
  @import '../../../../styles/medicine.less';
</style>

