<template>
  <div id="integralDescription">
    <el-form ref="formData" :model="form" label-width="0px" id="addNews">
      <el-row>
        <p class="header">
          积分说明
          <span class="modify" @click="editContent(1)">修改</span>
        </p>
        <el-col :span="24">
          <el-form-item prop="content" class="body">
            <textarea id="content" v-model="form.content" style="display:none;"></textarea>
            <ueditor :id="'content_ueditor'" ref="body_content" class="body_content"></ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="footer" v-if="tip === 1">
        <el-button @click="cancelForm" type="primary" icon="el-icon-close" size="small">取消修改</el-button>
        <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ueditor from '@/components/ueditor/editor';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      Body_editor: null,
      form: {
        content: '',
      },
      tip: '',
    };
  },
  components: {
    'ueditor': ueditor,
  },
  methods: {
    editContent(data) {
      this.tip = data;
    },
    // 取消修改
    cancelForm() {
      this.tip = '';
      this.getTable();
    },
    // 确认修改
    submitForm() {
      this.tip = '';
      this.form.content = this.Body_editor.getContent();
      let param = this.form;
      ajax.post(`api/integral/explain/edit`, param).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getTable();
        }
      });
    },
    getTable() {
      ajax.get(`api/integral/explain/get`).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.form.content = res.data.data;
          if (this.form.content) {
            this.Body_editor.setContent(this.form.content);
          }
        }
      });
    },
  },
  mounted() {
    this.Body_editor = this.$refs.body_content;
    // setTimeout(function() {
    //   this.Body_editor = this.$refs.content_ueditor;
    //   console.log(this.Body_editor);
    // }, 1000);
  },
  created() {
    this.getTable();
  }
};
</script>

<style lang="less" scoped>
#integralDescription{
  margin-bottom: 80px;
  .header{
    border: 1px solid #d7d7d7;
    height: 40px;
    line-height: 40px;
    color: #333333;
    background-color: #f2f2f2;
    border-bottom: 1px solid #d7d7d7;
    padding: 0 15px;
    .modify{
      display: inline-block;
      float: right;
      color: rgb(0, 102, 204);
      cursor: pointer;
    }
  }
  .content{
    h4{
      margin: 0 0 13px 0;
    }
    p{
      color: #666666;
    }
    padding: 0 22px;
  }
  .body_content {
    /deep/ .view p img{
      width: 100px;
      height: 100px;
    }
  }
  .footer{
    text-align: center;
    margin: 20px 0 40px 0;
  }
}
</style>
