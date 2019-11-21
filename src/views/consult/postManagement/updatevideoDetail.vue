<template>
  <div>
    <el-form :model="editingAssociationData" ref="ruleFormeditingAssociation" :rules="rules">
      <div class="display-box">
        <el-form-item label="音频编号" label-width="120px" prop="num">
          <el-input v-model="editingAssociationData.num"></el-input>
        </el-form-item>
        <el-form-item label="音频标题" label-width="120px" prop="title">
          <el-input v-model="editingAssociationData.title"></el-input>
        </el-form-item>
      </div>
      <div class="display-box">
        <el-form-item label="发帖人Id" label-width="120px" prop="u_id">
          <el-select v-model="editingAssociationData.u_id">
            <el-option
              v-for="item in doctorArrayList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用"  label-width="120px" prop="is_disable">
          <el-select v-model="editingAssociationData.is_disable">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="display-box">
        <!-- <el-form-item label="所属音频目录ID" label-width="140px" prop="v_id">
          <el-input v-model="editingAssociationData.v_id"></el-input>
        </el-form-item> -->
      </div>
      <div class="display-box">
        <el-form-item label="音频类型"  label-width="120px" prop="type">
          <el-select v-model="editingAssociationData.type" @change="typeAction">
            <el-option label="音频" :value="0"></el-option>
            <el-option label="视频" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音频时长(毫秒)" label-width="120px" prop="time_length">
          <el-input v-model="editingAssociationData.time_length" placeholder="请输入毫秒数" :disabled="true"></el-input>
        </el-form-item>
      </div>
      <!-- <el-form-item label="音频链接地址" label-width="120px" prop="video_url">
        <el-input v-model="editingAssociationData.video_url"></el-input>
      </el-form-item> -->
      <el-form-item label="音视频背景图" label-width="120px" prop="pic_url">
        <uploadSingleImg :imgUrl="editingAssociationData.pic_url" :fileName="'Image'" @uploadSuccess="editingAssociationuploadImg" @removeImg="editingAssociationremoveImg"></uploadSingleImg>
        <el-input class="left" type="hidden" v-model="editingAssociationData.pic_url"></el-input>
      </el-form-item>
      <el-form-item label="音频内容" label-width="120px" prop="content">
        <uploadAudio v-if="mediaType == 0" :audioUrl="editingAssociationData.content" :fileName="'Audio'" @uploadSuccess="addAudio" @removeAudio="removeAudioUrl"></uploadAudio>
        <uploadVideo v-else :videoUrl="editingAssociationData.content" :fileName="'Video'" @uploadSuccess="addVideo" @removeVideo="removeVideoUrl"></uploadVideo>
        <el-input class="left" type="hidden" v-model="editingAssociationData.content"></el-input>
      </el-form-item>
      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="queryeditingAssociation">确 定</el-button>
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
      editingAssociationData: {
        id: '',
        num: '',
        title: '',
        u_id: '',
        is_disable: '',
        content: '',
        video_url: '',
        v_id: '',
        type: '',
        time_length: '',
        pic_url: ''
      },
      // 医生数组
      doctorArrayList: [],
      // 数据验证
      rules: {
        id: [{ required: true, message: '请输入音频ID', trigger: 'blur' }],
        num: [{ required: true, message: '请输入音频编号', trigger: 'blur' }],
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
      // console.log(val);
      if (val === 0) {
        this.mediaType = '0';
      } else {
        this.mediaType = '1';
      }
      this.editingAssociationData.content = '';
      this.editingAssociationData.time_length = '';
      this.editingAssociationData.video_url = '';
    },
    // 编辑关联音频上传图片
    editingAssociationuploadImg(data) {
      this.editingAssociationData.pic_url = data.url;
    },
    // 编辑关联音频删除图片
    editingAssociationremoveImg() {
      this.editingAssociationData.pic_url = '';
    },
    // 上传音频内容
    addAudio(data) {
      this.editingAssociationData.content = data.url;
      this.editingAssociationData.time_length = Math.round(data.duration);
      this.editingAssociationData.video_url = data.url;
    },
    // 删除音频内容
    removeAudioUrl() {
      this.editingAssociationData.content = '';
      this.editingAssociationData.time_length = '';
      this.editingAssociationData.video_url = '';
    },
    // 上传视频内容
    addVideo(data) {
      this.editingAssociationData.content = data.url;
      this.editingAssociationData.time_length = Math.round(data.duration);
      this.editingAssociationData.video_url = data.url;
    },
    // 删除视频内容
    removeVideoUrl() {
      this.editingAssociationData.content = '';
      this.editingAssociationData.time_length = '';
      this.editingAssociationData.video_url = '';
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
    // 获取关联音频详细信息
    getvideoDetailoList() {
      ajax.get('/api/postmanage/GetvideoDetailoList?Id=' + this.id).then(data => {
        console.log(data);
        if (data.status === 200 && data.data.code === 0) {
          this.editingAssociationData = data.data.data;
          // this.editingAssociationData.type = data.data.data.type;
          if (this.editingAssociationData.type === 0) {
            this.mediaType = '0';
          } else if (this.editingAssociationData.type === 1) {
            this.mediaType = '1';
          }
          // this.editingAssociationData.id = data.data.data.id;
          // this.editingAssociationData.num = data.data.data.num;
          // this.editingAssociationData.title = data.data.data.title;
          // this.editingAssociationData.u_id = data.data.data.u_id;
          // this.editingAssociationData.is_disable = data.data.data.is_disable;
          // this.editingAssociationData.content = data.data.data.content;
          // this.editingAssociationData.video_url = data.data.data.video_url;
          // this.editingAssociationData.v_id = data.data.data.v_id;
          this.editingAssociationData.time_length = Math.round(data.data.data.time_length);
          // this.editingAssociationData.pic_url = data.data.data.pic_url;
        }
      });
    },
    // 重置表单数据
    resetForm() {
      this.$refs['ruleFormeditingAssociation'].resetFields();
      this.editingAssociationData.content = '';
    },
    // 编辑关联音频操作
    queryeditingAssociation() {
      this.$refs['ruleFormeditingAssociation'].validate((valid) => {
        if (valid) {
          ajax.post('/api/postmanage/UpdatevideoDetail', this.editingAssociationData).then(data => {
            // console.log(data);
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.updatevideoDetail();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getvideoDetailoList();
    this.getdocuserlist();
  }
};
</script>