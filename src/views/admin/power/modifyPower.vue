<template>
  <div id="addPower">
    <el-form ref="modifyData" :model="formPower" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题：" prop="title" style="width:80%">
            <el-input class="el-input" v-model="formPower.title" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件：" prop="component"  style="width:80%">
            <el-input class="el-input" v-model="formPower.component" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="权限名称：" prop="permissionsName"  style="width:80%">
            <el-input class="el-input" v-model="formPower.permissionsName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限路径：" prop="permissionsUrl"  style="width:80%">
            <el-input class="el-input" v-model="formPower.permissionsUrl" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作人：" prop="createBy"  style="width:80%">
            <el-input class="el-input" v-model="formPower.createBy" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：" prop="remark"  style="width:80%">
            <el-input class="el-input" v-model="formPower.remark" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form-button-wrapper">
        <el-form-item>
          <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
          <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">修改</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import java from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      formPower: {
        title: '',  //     标题
        component: '',  //   组件
        permissionsUrl: '',  // 权限Url
        permissionsName: '',  //   权限名称
        remark: '',  //   备注
        createBy: '',  //   操作人
      },
      rules: {
        title: [
          { required: true, message: '请输入菜单ID', trigger: 'blur' },
        ],
        component: [
          { required: true, message: '请输入组件名称', trigger: 'blur' },
        ],
        permissionsUrl: [
          { required: true, message: '请输入权限路径', trigger: 'blur' },
        ],
        permissionsName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
        ],
        createBy: [
          { required: true, message: '请输入操作人', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请输入备注信息', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    getPowerData() {  // 获取权限数据
      let _self = this;
      console.log(JSON.parse(_self.$route.query.rowData));
      let modifyPowerData = JSON.parse(_self.$route.query.rowData);
      _self.formPower.title = modifyPowerData.title;
      _self.formPower.component = modifyPowerData.component;
      _self.formPower.permissionsName = modifyPowerData.permissionsName;
      _self.formPower.permissionsUrl = modifyPowerData.permissionsUrl;
      _self.formPower.createBy = modifyPowerData.createBy;
      _self.formPower.remark = modifyPowerData.remark;
    },
    submitForm() {  // 提交修改
      let _self = this;
      let param = _self.formPower;
      let Id = JSON.parse(_self.$route.query.rowData);
      // console.log(Id);
      param.permissionsId = Id.permissionsId;
      // console.log(param);
      java.post(`/mall_manage/back/updatePermissions`, param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'success'
          });
          this.$router.push('/power/powerList');
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    resetForm() {  // 重置
      this.$refs['modifyData'].resetFields();
      this.formPower.title = '';
      this.formPower.component = '';
      this.formPower.permissionsName = '';
      this.formPower.permissionsUrl = '';
      this.formPower.createBy = '';
      this.formPower.remark = '';
    }
  },
  created() {
    this.getPowerData();
  }
};
</script>
<style lang="less" scoped>
#addPower{
  .form-button-wrapper {
    text-align: center;
    margin-left: -200px;
  }
}

</style>
