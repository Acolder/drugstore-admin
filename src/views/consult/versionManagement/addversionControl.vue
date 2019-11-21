<template>
  <div>
    <el-form :model="addData" ref="ruleForm" :rules="rules">
      <div class="display-box">
        <el-form-item label="类型"  label-width="120px" prop="AppType">
          <el-select v-model="addData.AppType">
            <el-option label="医生app" value="0"></el-option>
            <!-- <el-option label="业务员app" value="1"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" label-width="120px" prop="VersionCode">
          <el-input v-model="addData.VersionCode"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="版本名称" label-width="120px" prop="Version">
        <el-input v-model="addData.Version"></el-input>
      </el-form-item>
      <el-form-item label="更新说明" label-width="120px" prop="Remark">
        <el-input type="textarea" v-model="addData.Remark"></el-input>
      </el-form-item>
      <el-form-item label="设备类型"  label-width="120px" prop="DeviceType">
        <el-select v-model="addData.DeviceType">
          <el-option label="Android" value="0"></el-option>
          <el-option label="ios设备" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="软件下载地址" label-width="120px" prop="Download">
        <el-input v-model="addData.Download" style="display: none;"></el-input>
        <upload-apk :fileName="'apk'" @returnApkUrl="getApkUrl"></upload-apk>
      </el-form-item>
      <div class="display-box">
        <el-form-item label="是否强制更新"  label-width="120px" prop="IsCoerce">
          <el-select v-model="addData.IsCoerce">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"  label-width="120px" prop="Status">
          <el-select v-model="addData.Status">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="功能说明" label-width="120px" prop="FuncTional">
        <textarea id="FuncTional" v-model="addData.FuncTional" style="display:none;"></textarea>
        <ueditor :id="'content_ueditor'" ref="content_ueditor"></ueditor>
      </el-form-item>
      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="queryAdd">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="less">
.form-footer{
  display: flex;
  justify-content: center;
}
</style>

<script>
import ueditor from '@/components/ueditor/editor';
import uploadApk from '@/components/upload/uploadApk';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      Body_editor: null,
      addData: {
        VersionCode: '',
        Version: '',
        Remark: '',
        DeviceType: '',
        Download: '',
        IsCoerce: '',
        FuncTional: '',
        AppType: '',
        Status: '',
      },
      // 数据验证
      rules: {
        VersionCode: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        Version: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
        Remark: [{ required: true, message: '请输入更新说明', trigger: 'blur' }],
        FuncTional: [{ required: true, message: '请输入功能说明', trigger: 'blur' }],
        Status: [{ required: true, message: '请输入状态', trigger: 'blur' }],
        AppType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        DeviceType: [{ required: true, message: '请输入设备类型', trigger: 'blur' }],
        Download: [{ required: true, message: '请输入软件下载地址', trigger: 'blur' }],
        IsCoerce: [{ required: true, message: '请输入是否强制更新', trigger: 'blur' }],
      },
    };
  },
  // watch: {
  //   'addData.FuncTional': function() {
  //     console.log(1);
  //   },
  // },
  components: {
    'ueditor': ueditor,
    'upload-apk': uploadApk
  },
  methods: {
    // 重置表单数据
    resetForm() {
      this.$refs['ruleForm'].resetFields();
      this.Body_editor.setContent('');
      this.addData.DeviceType = '';
      this.addData.FuncTional = '';
      this.addData.Download = '';
      this.addData.IsCoerce = '';
    },
    // 添加操作
    queryAdd() {
      this.addData.FuncTional = this.Body_editor.getContent();
      console.log(this.addData);
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/VersionManage/AddDocVersionInfo', this.addData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.addversionControl();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 获取apk地址
    getApkUrl(url) {
      this.addData.Download = url;
    }
  },
  mounted() {
    this.Body_editor = this.$refs.content_ueditor;
  },
};
</script>
