<template>
  <div>
    <el-form :model="modifyData" ref="ruleFormModify" :rules="rules">
      <el-form-item label="发帖用户id" label-width="100px" prop="tuid">
          <el-select v-model="modifyData.tuid">
            <el-option
              v-for="item in doctorArrayList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="标题" label-width="100px" prop="ttopic">
        <el-input v-model="modifyData.ttopic"></el-input>
      </el-form-item>
      <el-form-item label="主帖图片url" label-width="100px">
        <uploadSingleImg :imgUrl="modifyData.tpicture" :fileName="'Image'" @uploadSuccess="modifyDatauploadImg" @removeImg="modifyDataremoveImg"></uploadSingleImg>
        <el-input class="left" type="hidden" v-model="modifyData.tpicture"></el-input>
      </el-form-item>
      <!-- <el-form-item label="发帖时间" label-width="100px" prop="ttime">
        <el-date-picker type="date" placeholder="选择日期" v-model="modifyData.ttime"></el-date-picker>
      </el-form-item> -->
        <el-form-item label="内容" label-width="100px" prop="tcontents">
        <textarea id="modifytcontents" v-model="modifyData.tcontents" style="display:none;"></textarea>
        <ueditor :id="'modifytcontents_ueditor'" ref="modifytcontents_ueditor"></ueditor>
      </el-form-item>
      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="queryModify">提 交</el-button>
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
      id: this.$route.query.id,
      modifyData: {
        tid: '',
        ttopic: '',
        tcontents: '',
        tpicture: '',
        // ttime: '',
        tuid: '',
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
    // 请求医生列表
    getdocuserlist() {
      ajax.get('/api/hospitalManage/getdocuserall').then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.doctorArrayList = data.data.data;
          console.log(this.doctorArrayList);
        }
      });
      // ajax.get('/api/hospitalManage/getdocuserlist?pageindex=1&pagesize=999').then(data => {
      //   if (data.status === 200 && data.data.code === 0) {
      //     this.doctorArrayList = data.data.data;
      //   }
      // });
    },
    // 添加帖子上传图片
    modifyDatauploadImg(data) {
      this.modifyData.tpicture = data.url;
    },
    // 添加帖子删除图片
    modifyDataremoveImg() {
      this.modifyData.tpicture = '';
    },
    // 重置表单数据
    resetForm() {
      this.Body_editor.setContent('');
      this.$refs['ruleFormModify'].resetFields();
      this.modifyData.tcontents = '';
      // this.modifyData.ttime = '';
    },
    // 获取帖子详细信息 编辑操作
    getPostTopicDetail() {
      ajax.get('/api/PostManage/GetPostTopicDetail?Id=' + this.id).then(data => {
        if (data.status === 200 && data.data.code === 0) {
          console.log(data.data.data);
          this.modifyData.tid = data.data.data.tid;
          this.modifyData.tpicture = data.data.data.tpicture;
          this.modifyData.ttopic = data.data.data.ttopic;
          this.modifyData.tcontents = data.data.data.tcontents;
          this.modifyData.tuid = data.data.data.tuid;
          let tempVal =  this.modifyData.tcontents;
          this.Body_editor.setContent(tempVal);
        }
      });
    },
    // 修改操作
    queryModify() {
      this.modifyData.tcontents = this.Body_editor.getContent();
      console.log(this.modifyData);
      this.$refs['ruleFormModify'].validate((valid) => {
        if (valid) {
          // if (this.modifyData.ttime) {
          //   this.modifyData.ttime = this.timeToTimestamp(this.modifyData.ttime);
          // }
          ajax.post('/api/postmanage/UpdateTopic', this.modifyData).then(data => {
            console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.modifypostAudit();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.Body_editor = this.$refs.modifytcontents_ueditor;
    this.getPostTopicDetail();
  },
  created() {
    this.getdocuserlist();
  }
};
</script>