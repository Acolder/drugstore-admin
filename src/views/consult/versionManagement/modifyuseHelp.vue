<template>
  <div>
    <el-form :model="modifyData" ref="ruleFormModify" :rules="rules">
      <el-form-item label="类型"  label-width="100px" prop="Type">
        <el-select v-model="modifyData.Type">
          <el-option label="医生" value="0"></el-option>
          <!-- <el-option label="业务员APP" value="1"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="标题" label-width="100px" prop="Title">
        <el-input v-model="modifyData.Title"></el-input>
      </el-form-item>
      <el-form-item label="操作者" label-width="100px" prop="Opertor">
        <el-input v-model="modifyData.Opertor"></el-input>
      </el-form-item>
      <el-form-item label="类型"  label-width="100px" prop="Status">
        <el-select v-model="modifyData.Status">
          <el-option label="删除" value="0"></el-option>
          <el-option label="不删除" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" label-width="100px" prop="Remark">
        <el-input v-model="modifyData.Remark"></el-input>
      </el-form-item>
      <el-form-item label="内容说明" label-width="100px" prop="Content">
        <textarea id="modifyContent" v-model="modifyData.Content" style="display:none;"></textarea>
        <ueditor :id="'content_ueditor'" ref="content_ueditor"></ueditor>
      </el-form-item>
      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="queryModify">确 定</el-button>
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
      id: this.$route.query.id,
      modifyData: {
        Id: '',
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
      this.$refs['ruleFormModify'].resetFields();
      this.Body_editor.setContent('');
      this.modifyData.Content = '';
    },
    // 查询帮助详情
    getdochelperinfo() {
      let _self = this;
      ajax.get('/api/VersionManage/getdochelperinfo?id=' + this.id).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.modifyData.Id = data.data.data.id;
          this.modifyData.Remark = data.data.data.remark;
          this.modifyData.Opertor = data.data.data.opertor;
          this.modifyData.Content = data.data.data.content;
          this.modifyData.Status = data.data.data.status;
          this.modifyData.Type = data.data.data.type;
          if (this.modifyData.Type === 0) {
            this.modifyData.Type = '医生';
          } else if (this.modifyData.Type === 1) {
            this.modifyData.Type = '业务员';
          }
          if (this.modifyData.Status === 0) {
            this.modifyData.Status = '不删除';
          } else if (this.modifyData.Status === 1) {
            this.modifyData.Status = '删除';
          }
          this.modifyData.Title = data.data.data.title;
          _self.Body_editor.setContent(_self.modifyData.Content);
        }
      });
    },
    // 修改操作
    queryModify() {
      if (this.modifyData.Type === '医生') {
        this.modifyData.Type = '0';
      } else if (this.modifyData.Type === '业务员') {
        this.modifyData.Type = '1';
      }
      if (this.modifyData.Status === '不删除') {
        this.modifyData.Status = '0';
      } else if (this.modifyData.Status === '删除') {
        this.modifyData.Status = '1';
      }
      this.modifyData.Content = this.Body_editor.getContent();
      this.$refs['ruleFormModify'].validate((valid) => {
        if (valid) {
          ajax.post('/api/VersionManage/adddochelperinfo', this.modifyData).then(data => {
            console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.modifyuseHelp();
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
    this.getdochelperinfo();
  },
  created() {
    // this.getdochelperinfo();
  }
};
</script>