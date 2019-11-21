<template>
  <div>
    <el-form ref="fixed" :model="fixed" label-width="200px" class="demo-ruleForm"  size="small" label-position="left" :rules="rules">
      <el-form-item label="膏方名称" prop="name">
        <el-input v-model="fixed.name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="膏方编码" prop="param1" v-if="showParam">
        <el-input v-model="fixed.param1" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="膏方单位" prop="param2" v-if="showParam">
        <el-input v-model="fixed.param2" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="膏方零售价" prop="retail_price">
        <el-input v-model.number="fixed.retail_price" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="适宜人群" prop="indication">
        <el-input type="textarea" v-model="fixed.indication"></el-input>
      </el-form-item>
      <el-form-item label="膏方概述" prop="symptom">
        <textarea id="productDetail" v-model="fixed.symptom" style="width:100%;height:450px;"></textarea>
      </el-form-item>
      <el-form-item label="加工工艺" prop="introduction">
        <textarea id="instructions" v-model="fixed.introduction" style="width:100%;height:350px;"></textarea>
      </el-form-item>
      <el-row class="recipeContainer" id="CNMedicine" >
        <el-row class="table" style="margin-top: 20px;margin-bottom: 20px;">
          <div class="tableHeader title">
            <el-row>
              <span class="title-name">中药清单 - 膏方</span>
            </el-row>
            <el-row type="flex" justify="space-between" class='dose'>
              <el-col :span="8">
                <el-form-item label="剂数:" label-width="50px">
                  <el-input-number size="mini" controls-position="right"
                                   :min="0" :max="10000" value="1"
                                   label="描述文字" disabled></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="width: 88px">
                <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
              </el-col>
            </el-row>
          </div>
          <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%;"
                   :columns="columnsChinieseMedicine"
                   :cell-edit-done="cellEditDone"
                   :table-data="docprescriptiondetails" row-hover-color="#eee"
                   row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
        </el-row>
      </el-row>
      <el-form-item class="form-button-wrapper" style="height: 80px;text-align: center">
        <el-button type="primary" @click='onSubmit("fixed")' icon="el-icon-check" >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less">
  @import "kindeditor/themes/default/default.css";
</style>
<style lang="less" scoped>
  @import '../../../../styles/medicine.less';
</style>
<script>
import ylajax from '@/utils/yilinAjax';
import 'kindeditor';
import 'kindeditor/lang/zh-CN.js';
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      showParam: false,
      fixed: {
        id: 0,
        name: '',
        param1: '',
        param2: '',
        // 零售价
        retail_price: '',
        // 适宜人群
        indication: '',
        // 膏方概述
        symptom: '',
        // 加工工艺
        introduction: ''
      },
      // 膏方表格
      docprescriptiondetails: [
      ],
      // 验证
      rules: {
        name: [
          { required: true, message: '请输入膏方名称', trigger: 'blur' }
        ],
        param1: [
          { required: true, message: '请输入膏方编码', trigger: 'blur' }
        ],
        param2: [
          { required: true, message: '请输入膏方单位', trigger: 'blur' }
        ],
        retail_price: [
          { required: true, message: '请输入膏方零售价', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        indication: [
          { required: true, message: '请输入适宜人群', trigger: 'blur' }
        ],
        symptom: [
          { required: true, message: '请输入膏方概述', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入加工工艺', trigger: 'blur' }
        ]
      }
    };
  },
  components: {
  },
  computed: {
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
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 编辑器
    createKindEditor() {
      /* eslint-disable */
      this.symptom_editor = KindEditor.create("#productDetail");
      this.introduction_editor = KindEditor.create("#instructions");
    },
    // 编辑-获取详情数据
    getEditData() {
      let id = { id: this.fixed.id };
      ylajax.get('/api/ordermanage/GetPasteFixedTemplateDetailList', { params: id }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          let resData = res.data.data;
          this.fixed = resData;
          if (resData.symptom) {
            this.symptom_editor.html(resData.symptom);
          }
          if (resData.introduction) {
            this.introduction_editor.html(resData.introduction);
          }
          if (resData.docpastedetailsfixeds) {
            this.docprescriptiondetails = res.data.data.docpastedetailsfixeds;
          }
        }
      });
    },
    // 表格验证
    tableValid() {
      let tableObj = this.docprescriptiondetails;
      if (tableObj.length === 0) {
        this.$alert('请添加中药清单-膏方药材', '提示');
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
          } else if (index === tableObj.length - 1 && !!item.drug_name && !!item.medicines && !!item.dose && !!item.unit_price) {
            this.isCheckFalse = true;
          }
        });
      } catch (e) {
        if (e.message === 'StopIteration ') {
          this.isCheckFalse = false;
        }
      }
    },
    // 表单验证
    onSubmit(formName) {
      // 获取编辑器内容
      this.fixed.symptom = this.symptom_editor.html();
      this.fixed.introduction = this.introduction_editor.html();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableValid();
          if (this.isCheckFalse) {
            let urlPaste = '';
            let datasPaste = {};
            if (this.$route.name === 'addfixedpaste') {
              // 新增
              urlPaste = '/api/ordermanage/CreatePasteFixedTemplate';
              datasPaste = {
                id: 0,
                name: this.fixed.name,
                retail_price: this.fixed.retail_price,
                indication: this.fixed.indication,
                symptom: this.fixed.symptom,
                introduction: this.fixed.introduction,
                // 膏方编码
                param1: this.fixed.param1,
                // 单位
                param2: this.fixed.param2,
                // 0启用1禁用
                status: 0,
                docpastedetailsfixeds: this.docprescriptiondetails
              };
            } else if (this.$route.name === 'editfixedpaste') {
              // 编辑
              urlPaste = '/api/ordermanage/UpdatePasteFixedTemplate';
              datasPaste = {
                id: this.$route.query.id,
                name: this.fixed.name,
                retail_price: this.fixed.retail_price,
                indication: this.fixed.indication,
                symptom: this.fixed.symptom,
                introduction: this.fixed.introduction,
                status: this.fixed.status,
                docpastedetailsfixeds: this.docprescriptiondetails
              };
            }
            ylajax.post(urlPaste, datasPaste).then((res) => {
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
                    path: '/orderManage/fixedPaste',
                    query: {
                      from: _self.$route.name,
                      name: _self.$route.query.name ? _self.$route.query.name : '',
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
    // 中药清单-添加中药药材
    addDrug() {
      this.docprescriptiondetails.push(
        {
          id: '',
          paste_id: '',
          drug_name: '',
          medicines: '',
          dose: 1,
          m_usage: '无',
          type: 0,
          unit: '',
          goods_num: '',
          remark: '',
          unit_price: 0,
          // 商品规格，产地
          goods_norms: '',
          goods_orgin: '',
        });
    },
    // 中药清单单元格编辑回调
    cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
      this.docprescriptiondetails[rowIndex][field] = newValue;
      // 接下来处理你的业务逻辑，数据持久化等...
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      // 1.中药清单-移除药材
      if (params.type === 'removeChineseMedicine') { // do remove operation
        alert(params.index);
        this.docprescriptiondetails.splice(params.index, 1);
      }
      // 2.中药清单-药材改变
      else if (params.type === 'medicineChange') { // do change medicines
        this.docprescriptiondetails[params.index].drug_name = params.value;
        this.docprescriptiondetails[params.index].medicines = params.value;
        this.docprescriptiondetails[params.index].unit = params.unit;
        this.docprescriptiondetails[params.index].unit_price = params.unitprice;
        this.docprescriptiondetails[params.index].goods_norms = params.goodsnorms;
        this.docprescriptiondetails[params.index].goods_orgin = params.goodsorgin;
      }
      // 3.中药清单-用法改变
      else if (params.type === 'usageChange') { // do change medicines
        this.docprescriptiondetails[params.index].m_usage = params.value;
      }
      // 3.中药清单-剂量增加
      else if (params.type === 'numChange') { // do change numChange
        this.docprescriptiondetails[params.index].dose = params.value;
      }
    }
  },
  created() {
    // 编辑-查询数据
    if (this.$route.name === 'editfixedpaste') {
      this.fixed.id = this.$route.query.id;
      this.getEditData();
    } else {
      this.showParam = true;
    }
  },
  mounted() {
    this.createKindEditor();
  },
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
    ylajax,
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
        ylajax.get('/api/ordermanage/searchherbslist', {
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


