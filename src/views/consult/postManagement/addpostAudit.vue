<template>
  <div>
    <el-form :model="addData" ref="ruleForm" :rules="rules">
      <div class="display-box">
        <el-form-item label="发帖用户id" label-width="100px" prop="tuid">
          <el-select v-model="addData.tuid">
            <el-option
              v-for="item in doctorArrayList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否正常内容"  label-width="120px" prop="is_url">
          <el-select v-model="addData.is_url">
            <el-option label="正常内容" value="0"></el-option>
            <el-option label="链接" value="1"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="是否管理员"  label-width="100px" prop="is_admin">
        <el-select v-model="addData.is_admin">
          <el-option label="医生" value="0"></el-option>
          <el-option label="管理员" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" label-width="100px" prop="ttopic">
        <el-input v-model="addData.ttopic"></el-input>
      </el-form-item>
      <el-form-item label="主帖图片url" label-width="100px">
        <uploadSingleImg :imgUrl="addData.tpicture" :fileName="'Image'" @uploadSuccess="addDatauploadImg" @removeImg="addDataremoveImg"></uploadSingleImg>
        <el-input class="left" type="hidden" v-model="addData.tpicture"></el-input>
      </el-form-item>
      <el-form-item label="内容" label-width="100px" prop="tcontents">
        <textarea id="addtcontents" v-model="addData.tcontents" style="display:none;"></textarea>
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
import uploadSingleImg from '@/components/upload/uploadImg';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      Body_editor: null,
      addData: {
        tuid: '',
        ttopic: '',
        tcontents: '',
        tpicture: '',
        status: '0',
        is_admin: ''
      },
      // 医生数组
      doctorArrayList: [],
      // 数据验证
      rules: {
        tuid: [{ required: true, message: '请输入发帖用户id', trigger: 'blur' }],
        ttopic: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        tcontents: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        tpicture: [{ required: true, message: '请输入主帖图片url', trigger: 'blur' }],
        is_url: [{ required: true, message: '请输入是否正常内容', trigger: 'blur' }],
        tid: [{ required: true, message: '请输入帖子ID', trigger: 'blur' }],
        ttime: [{ required: true, message: '请输入发帖时间', trigger: 'blur' }],
        focus_title: [{ required: true, message: '请输入焦点图标题', trigger: 'blur' }],
        loopicture: [{ required: true, message: '请输入轮播图片地址', trigger: 'blur' }],
        is_loop: [{ required: true, message: '请输入是否轮播', trigger: 'blur' }],
        sequence: [{ required: true, message: '请输入焦点图排序号', trigger: 'blur' }],
        is_admin: [{ required: true, message: '请输入是否为管理员', trigger: 'blur' }],
      },
    };
  },
  components: {
    'uploadSingleImg': uploadSingleImg,
    'ueditor': ueditor,
  },
  methods: {
    // 中国标准时间转换
    timeToTimestamp(timestamp) {
      let d = new Date(timestamp);
      let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return youWant;
    },
    // 添加帖子上传图片
    addDatauploadImg(data) {
      this.addData.tpicture = data.url;
    },
    // 添加帖子删除图片
    addDataremoveImg() {
      this.addData.tpicture = '';
    },
    // 请求医生列表
    getdocuserlist() {
      ajax.get('/api/hospitalManage/getdocuserall').then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.doctorArrayList = data.data.data;
          console.log(this.doctorArrayList);
        }
      });
      // ajax.get('/api/hospitalManage/getdocuserlist?pageindex=1&pagesize=99isAuth=').then(data => {
      // ajax.get('/api/hospitalManage/getdocuserlist?pageindex=1&pagesize=999').then(data => {
      //   if (data.status === 200 && data.data.code === 0) {
      //     console.log(data.data.data);
      //     this.doctorArrayList = data.data.data;
      //   }
      // });
    },
    // 重置表单数据
    resetForm() {
      this.Body_editor.setContent('');
      this.$refs['ruleForm'].resetFields();
      this.addData.tcontents = '';
      this.addData.is_admin = '';
    },
    // 添加操作
    queryAdd() {
      this.addData.tcontents = this.Body_editor.getContent();
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // if (this.addData.ttime) {
          //   this.addData.ttime = this.timeToTimestamp(this.addData.ttime);
          // }
          ajax.post('/api/postmanage/CreateTopic', this.addData).then(data => {
            console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.addpostAudit();
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
  created() {
    this.getdocuserlist();
  }
};
</script>
