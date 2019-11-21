<template>
  <div>
    <el-form ref="paste" :model="paste" label-width="200px" class="demo-ruleForm"  size="small" label-position="left" :rules="rules">
      <el-form-item label="膏方名称" prop="name">
        <el-input v-model="paste.name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="膏方介绍" prop="description">
        <el-input type="textarea" v-model="paste.description" :autosize="{ minRows: 7}"></el-input>
      </el-form-item>
      <el-form-item label="备注"  prop="remark">
        <el-input type="textarea" v-model="paste.remark" :autosize="{ minRows: 7}"></el-input>
      </el-form-item>
      <el-form-item label="其他" >
        <el-input type="textarea" v-model="paste.param1"  :autosize="{ minRows: 7}"></el-input>
      </el-form-item>
      <el-form-item class="form-button-wrapper">
        <el-button type="primary" @click='onSubmit("paste")' icon="el-icon-check" >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ylajax from '@/utils/yilinAjax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // 膏方
      paste: {
        name: '',
        description: '',
        remark: '',
        param1: ''
      },
      // 验证
      rules: {
        name: [
          { required: true, message: '请输入膏方名称', trigger: 'blur' },
          { max: 255, message: '膏方名称最多输入255个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入膏方介绍', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 编辑获取列表
    getPasteData(id) {
      ylajax.get('/api/ordermanage/GetPasteStandardCategoryDetailList', {
        params: { id: id }
      }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.paste = res.data.data;
          this.paste = {
            name: res.data.data.name,
            description: res.data.data.description,
            remark: res.data.data.remark,
            param1: res.data.data.param1
          };
        }
      });
    },
    // 提交
    onSubmit(formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let urlPaste = '';
          let datasPaste = {};
          if (this.$route.name === 'addClassicpaste') {
            // 新增
            urlPaste = '/api/ordermanage/CreatePasteStandardCategory';
            datasPaste = datasPaste = {
              name: this.paste.name,
              description: this.paste.description,
              remark: this.paste.remark,
              param1: this.paste.param1,
              state: 0
            };
          } else if (this.$route.name === 'editClassicpaste') {
            // 编辑
            urlPaste = '/api/ordermanage/UpdatePasteStandardCategory';
            datasPaste = {
              id: this.$route.query.id,
              name: this.paste.name,
              description: this.paste.description,
              remark: this.paste.remark,
              param1: this.paste.param1
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
                  path: '/orderManage/classicPaste',
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
        } else {
          return false;
        }
      });
    },
  },
  created() {
    if (this.$route.name === 'editClassicpaste') {
      this.getPasteData(this.$route.query.id);
    }
  }
};
</script>
<style lang="less" scoped="">
  .form-button-wrapper {
    height: 80px;
    text-align: center;
  }
  textarea{
    min-height: 50px;
  }
</style>
