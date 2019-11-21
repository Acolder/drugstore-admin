<template>
  <div>
    <el-form :model="modifyData" ref="ruleFormModify" :rules="rules">
      <!-- <div class="display-box">
        <el-form-item label="音频ID" label-width="100px">
          <el-input v-model="modifyData.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="音频编号" label-width="100px" prop="num">
          <el-input v-model.number="modifyData.num" :disabled="true"></el-input>
        </el-form-item>
      </div> -->
      <el-form-item label="音频标题" label-width="100px" prop="title">
        <el-input v-model="modifyData.title"></el-input>
      </el-form-item>
      <el-form-item label="音频图片" label-width="100px" prop="pic_url">
        <uploadSingleImg :imgUrl="modifyData.pic_url" :fileName="'Image'" @uploadSuccess="modifyDatauploadImg" @removeImg="modifyDataremoveImg"></uploadSingleImg>
        <el-input class="left" type="hidden" v-model="modifyData.pic_url"></el-input>
      </el-form-item>
      <div class="display-box">
        <el-form-item label="音频类型"  label-width="100px" prop="type">
          <el-select v-model="modifyData.type" @change="typeAction">
            <el-option label="音频" :value="0"></el-option>
            <el-option label="视频" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发帖人Id" label-width="100px" prop="u_id">
          <el-select v-model="modifyData.u_id">
            <el-option
              v-for="item in doctorArrayList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="音频内容" prop="content">
            <uploadAudio v-if="mediaType == 0" :audioUrl="modifyData.content" :fileName="'Audio'" @uploadSuccess="addAudio" @removeAudio="removeAudioUrl"></uploadAudio>
            <uploadVideo v-else :videoUrl="modifyData.content" :fileName="'Video'" @uploadSuccess="addVideo" @removeVideo="removeVideoUrl"></uploadVideo>
            <el-input class="left" type="hidden" v-model="modifyData.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="queryModify">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="less">
.display-box{
  display: flex;
  justify-content: space-between;
}
.form-footer{
  display: flex;
  justify-content: center;
}
</style>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import uploadAudio from '@/components/upload/uploadAudio';
import uploadVideo from '@/components/upload/uploadVideo';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      mediaType: '',
      id: this.$route.query.id,
      modifyData: {
        id: '',
        num: '',
        title: '',
        content: '',
        pic_url: '',
        type: '',
        u_id: ''
      },
      // 医生数组
      doctorArrayList: [],
      // 数据验证
      rules: {
        id: [{ required: true, message: '请输入音频ID', trigger: 'blur' }],
        num: [{ required: true, message: '请输入音频编号', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }],
        title: [{ required: true, message: '请输入音频标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入音频内容', trigger: 'blur' }],
        pic_url: [{ required: true, message: '请输入音频图片链接地址', trigger: 'blur' }],
        type: [{ required: true, message: '请输入音频类型', trigger: 'blur' }],
        u_id: [{ required: true, message: '请输入发帖人Id', trigger: 'blur' }],
        focus_title: [{ required: true, message: '请输入轮播标题', trigger: 'blur' }],
        is_loop: [{ required: true, message: '请输入是否轮播图', trigger: 'blur' }],
        is_focus: [{ required: true, message: '请输入是否轮播图', trigger: 'blur' }],
        is_disable: [{ required: true, message: '请输入是是否禁用', trigger: 'blur' }],
        sequence: [{ required: true, message: '请输入焦点图排序号', trigger: 'blur' }],
        video_url: [{ required: true, message: '请输入音频链接地址', trigger: 'blur' }],
        v_id: [{ required: true, message: '请输入所属音频目录ID', trigger: 'blur' }],
        time_length: [{ required: true, message: '请输入音频时长', trigger: 'blur' }],
      },
    };
  },
  components: {
    'uploadSingleImg': uploadSingleImg,
    'uploadVideo': uploadVideo,
    'uploadAudio': uploadAudio,
  },
  methods: {
    typeAction(val) {
      if (val === 0) {
        this.mediaType = '0';
      } else {
        this.mediaType = '1';
      }
      this.modifyData.content = '';
    },
    // 编辑音频上传图片
    modifyDatauploadImg(data) {
      this.modifyData.pic_url = data.url;
    },
    // 编辑音频删除图片
    modifyDataremoveImg() {
      this.modifyData.pic_url = '';
    },
    // 上传音频内容
    addAudio(data) {
      this.modifyData.content = data.url;
    },
    // 删除音频内容
    removeAudioUrl() {
      this.modifyData.content = '';
    },
    // 上传视频内容
    addVideo(data) {
      this.modifyData.content = data.url;
    },
    // 删除视频内容
    removeVideoUrl() {
      this.modifyData.content = '';
    },
    // 请求医生列表
    getdocuserlist() {
      // ajax.get('/api/hospitalManage/getdocuserlist?pageindex=1&pagesize=999').then(data => {
      ajax.get('/api/hospitalManage/getdocuserall').then(data => {
        if (data.status === 200 && data.data.code === 0) {
          this.doctorArrayList = data.data.data;
        }
      });
    },
    // 获取帖子详细信息 编辑操作
    getvideoDetail() {
      ajax.get('/api/PostManage/GetvideoDetail?Id=' + this.id).then(data => {
        // console.log(data);
        if (data.status === 200 && data.data.code === 0) {
          this.modifyData = data.data.data;
          // this.modifyData.type = data.data.data.type;
          if (this.modifyData.type === 0) {
            this.mediaType = '0';
          } else if (this.modifyData.type === 1) {
            this.mediaType = '1';
          }
          // this.modifyData.id = data.data.data.id;
          // this.modifyData.u_id = data.data.data.u_id;
          // this.modifyData.num = data.data.data.num;
          // this.modifyData.title = data.data.data.title;
          // this.modifyData.content = data.data.data.content;
          // this.modifyData.pic_url = data.data.data.pic_url;
        }
      });
    },
    // 重置表单数据
    resetForm() {
      this.$refs['ruleFormModify'].resetFields();
      this.modifyData.content = '';
    },
    // 编辑操作
    queryModify() {
      this.$refs['ruleFormModify'].validate((valid) => {
        if (valid) {
          ajax.post('/api/postmanage/Updatevideo', this.modifyData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.modifyaudioManagement();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getvideoDetail();
    this.getdocuserlist();
  }
};
</script>