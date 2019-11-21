<template>
  <div>
  <el-form ref="paste" :model="paste" label-width="200px" class="demo-ruleForm"  size="small" label-position="left" :rules="rules">
    <el-form-item label="膏方类别">
      <el-input v-model="category_name" style="width: 400px" disabled></el-input>
    </el-form-item>
    <el-form-item label="膏方编码" prop="id" v-show="showId">
      <el-input v-model="paste.id" style="width: 400px"></el-input>
    </el-form-item>
    <el-form-item label="膏方名称" prop="name">
      <el-input v-model="paste.name" style="width: 400px"></el-input>
    </el-form-item>
    <el-form-item label="原籍" prop="originally_from">
      <el-input type="textarea" v-model="paste.originally_from"></el-input>
    </el-form-item>
    <el-form-item label="制法" prop="creation_method">
      <el-input type="textarea" v-model="paste.creation_method"></el-input>
    </el-form-item>
    <el-form-item label="功用" >
      <el-input type="textarea" v-model="paste.usage"></el-input>
    </el-form-item>
    <el-form-item label="主治" >
      <el-input type="textarea" v-model="paste.indication"></el-input>
    </el-form-item>
    <el-form-item label="评议" >
      <el-input type="textarea" v-model="paste.deliberate"></el-input>
    </el-form-item>
    <el-form-item label="出处" >
      <el-input type="textarea" v-model="paste.source"></el-input>
    </el-form-item>
    <el-form-item label="注意" >
      <el-input type="textarea" v-model="paste.notice"></el-input>
    </el-form-item>
    <el-row class="recipeContainer" id="CNMedicine" >
      <el-row class="table" style="margin-top: 20px;margin-bottom: 20px;">
        <div class="tableHeader title">
          <el-row>
            <span class="title-name">中药清单</span>
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
    <el-form-item class="form-button-wrapper">
      <el-button type="primary" @click='onSubmit("paste")' icon="el-icon-check" >提交</el-button>
    </el-form-item>

  </el-form>
</div>
</template>
<script>
import ylajax from '@/utils/yilinAjax';
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // 膏方类别列表
      category_name: '',
      showId: false,
      // 处方
      paste: {
        id: '',
        category_id: '',
        name: '',
        originally_from: '',
        creation_method: '',
        usage: '',
        indication: '',
        deliberate: '',
        source: '',
        notice: '',
      },
      docprescriptiondetails: [
      ],
      // 验证
      rules: {
        id: [
          { required: true, message: '请输入膏方编码', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入膏方名称', trigger: 'blur' },
        ],
        originally_from: [
          { required: true, message: '请输入原籍', trigger: 'blur' },
        ],
        creation_method: [
          { required: true, message: '请输入制法', trigger: 'blur' },
        ],
      },
      // 表格验证
      isCheckFalse: false
    };
  },
  methods: {
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableValid();
          if (this.isCheckFalse) {
            let urlPaste = '';
            let datasPaste = {};
            if (this.$route.name === 'addClassicpasteList') {
              // 新增
              urlPaste = '/api/ordermanage/CreatePasteStandard';
              datasPaste = {
                id: this.paste.id,
                name: this.paste.name,
                originally_from: this.paste.originally_from,
                creation_method: this.paste.creation_method,
                usage: this.paste.usage,
                indication: this.paste.indication,
                deliberate: this.paste.deliberate,
                source: this.paste.source,
                notice: this.paste.notice,
                category_id: this.paste.category_id,
                type: 0,
                prescr_type: 2,
                amount: 1,
                create_time: 0,
                docpastedetailsfixeds: this.docprescriptiondetails
              };
            } else if (this.$route.name === 'editClassicpasteList') {
              // 编辑
              urlPaste = '/api/ordermanage/UpdatePasteStandard';
              datasPaste = {
                id: this.$route.query.id,
                name: this.paste.name,
                originally_from: this.paste.originally_from,
                creation_method: this.paste.creation_method,
                usage: this.paste.usage,
                indication: this.paste.indication,
                deliberate: this.paste.deliberate,
                source: this.paste.source,
                notice: this.paste.notice,
                category_id: this.paste.category_id,
                type: 0,
                prescr_type: 2,
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
                    path: '/orderManage/classicPasteList',
                    query: {
                      from: _self.$route.name,
                      name: _self.$route.query.name ? _self.$route.query.name : '',
                      id: _self.$route.query.fid,
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
    // 获取膏方类别列表
    getListData() {
      this.paste.category_id = this.$route.query.fid;
      let queryId = { id: this.paste.category_id };
      ylajax.get('api/ordermanage/GetPasteStandardName', { params: queryId }).then((res) => {
        if (res.status === 200 && !!res.data) {
          this.category_name = res.data.data[0].name;
        }
      });
    },
    // 获取数据-编辑
    getPasteData(id) {
      ylajax.get('/api/ordermanage/GetPasteStandardDetailList', {
        params: { id: id }
      }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.paste = res.data.data;
          this.paste = {
            id: res.data.data.id,
            name: res.data.data.name,
            originally_from: res.data.data.originally_from,
            creation_method: res.data.data.creation_method,
            usage: res.data.data.usage,
            indication: res.data.data.indication,
            deliberate: res.data.data.deliberate,
            source: res.data.data.source,
            notice: res.data.data.notice,
            category_id: res.data.data.category_id,
            // add
            type: res.data.data.type,
            prescr_type: res.data.data.type,
            amount: res.data.data.amount,
          };
          if (res.data.data.docpastedetailsfixeds) {
            this.docprescriptiondetails = res.data.data.docpastedetailsfixeds;
          }
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
    this.getListData();
    if (this.$route.name === 'editClassicpasteList') {
      this.getPasteData(this.$route.query.id);
    } else {
      this.showId = true;
    }
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
<style lang="less" scoped>
@import '../../../../styles/medicine.less';
</style>
<style lang="less">
  .form-button-wrapper {
    height: 80px;
    text-align: center;
    margin-left: 0px;
    .el-form-item__content{
      margin-left: 0px;
    }
  }
</style>

