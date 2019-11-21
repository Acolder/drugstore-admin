<template>
  <div>
    <el-form :model="addData" ref="ruleForm" :rules="rules">
      <el-form-item label="类型"  label-width="100px" prop="Type">
        <el-select v-model="addData.Type">
          <el-option label="医生" value="0"></el-option>
          <!-- <el-option label="业务员APP" value="1"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="标题" label-width="100px" prop="Title">
        <el-input v-model="addData.Title"></el-input>
      </el-form-item>
      <el-form-item label="操作者" label-width="100px" prop="Opertor">
        <el-input v-model="addData.Opertor"></el-input>
      </el-form-item>
      <el-form-item label="类型"  label-width="100px" prop="Status">
        <el-select v-model="addData.Status">
          <el-option label="删除" value="0"></el-option>
          <el-option label="不删除" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" label-width="100px" prop="Remark">
        <el-input v-model="addData.Remark"></el-input>
      </el-form-item>
        <el-form-item label="内容说明" label-width="100px" prop="Content">
        <textarea id="addContent" v-model="addData.Content" style="display:none;"></textarea>
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
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      Body_editor: null,
      addData: {
        Remark: '',
        Opertor: '',
        Content: '',
        Status: '',
        Type: '',
        Title: ''
      },
      // 数据验证
      rules: {
        Id: [{ required: true, message: '请输入帖子ID', trigger: 'blur' }],
        Remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        Opertor: [{ required: true, message: '请输入操作者', trigger: 'blur' }],
        Content: [{ required: true, message: '请输入内容说明', trigger: 'blur' }],
        Status: [{ required: true, message: '请输入状态', trigger: 'blur' }],
        Type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        Title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
    };
  },
  components: {
    'ueditor': ueditor,
  },
  methods: {
    // 重置表单数据
    resetForm() {
      this.$refs['ruleForm'].resetFields();
      this.Body_editor.setContent('');
      this.addData.Content = '';
    },
    // 添加操作
    queryAdd() {
      this.addData.Content = this.Body_editor.getContent();
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/VersionManage/adddochelperinfo', this.addData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.adduseHelp();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.Body_editor = this.$refs.content_ueditor;
  },
};
</script>