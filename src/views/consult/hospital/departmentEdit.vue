<template>
  <div class="edit">
    <div class="toolbar-wrapper">
      <el-form ref="editDepartmentForm" label-width="100px" size="small" :model="editData">
        <el-form-item label="科室名称:" style="width: 360px;" prop="departname">
          <el-input type="text" placeholder="请输入科室名称" v-model="editData.departname">
          </el-input>
        </el-form-item>
        <el-form-item label="药柜编码:" style="width: 360px;" prop="boxcodes">
          <el-input type="text" placeholder="请输入药柜编码" v-model="editData.boxcodes">
          </el-input>
          可绑定多个药柜,以逗号(,)分隔
        </el-form-item>
        <el-form-item label="开放状态:" style="width: 360px;" prop="state">
          <el-radio-group v-model="editData.state" @change="selectState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">屏蔽</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:" style="width: 360px;" prop="remark">
          <el-input placeholder="请输入科室备注信息" type="textarea" :rows="3" v-model="editData.remark">
          </el-input>
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
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      editData: {
        departname: '',
        remark: '',
        boxcodes: '',
        state: 1,
        departid: 0
      },
      rules: {
        departname: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入科室备注信息', trigger: 'blur' }],
        boxcodes: [{ required: true, message: '请输入药柜编码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 提交新增咨询
    submitForm() {
      this.$refs['editDepartmentForm'].validate().then((v) => {
        if (v) {
          let url = '/api/hospitalManage/savedocdepartinfo';
          ajax.post(url, this.editData).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              this.closeMe();
              let data = {
                name: 'departmentList',
                path: '/hospital/departmentList',
                meta: {
                  title: '科室列表'
                }
              };
              this.$store.dispatch('addVisitedViews', data);
              this.tabValue = data.name;
              this.$router.push({
                name: data.name
              });
            }
          });
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs['editDepartmentForm'].resetFields();
    },
    selectState(v) {
      this.editData.state = v;
    },
    closeMe() {
      let currentTap = {
        name: this.$route.name,
        path: this.$route.path
      };
      this.$store.dispatch('delVisitedViews', currentTap);
    }
  },
  mounted() {
    if (this.$route.params) {
      let d = this.$route.params;
      this.editData = d;
    }
  }
};
</script>
<style>
  textarea {
    resize: none !important;
  }
</style>
