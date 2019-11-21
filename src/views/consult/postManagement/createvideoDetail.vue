<template>
  <div>
    <el-form :model="newAssociationData" ref="ruleFormnewAssociation" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="音频编号" prop="num">
            <el-input v-model.number="newAssociationData.num" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="音频标题" prop="title">
            <el-input v-model="newAssociationData.title" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发帖人Id" prop="u_id" >
            <el-select v-model="newAssociationData.u_id">
              <el-option
                v-for="item in doctorArrayList"
                :key="item.userid"
                :label="item.nickname"
                :value="item.userid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否禁用" prop="is_disable">
            <el-select v-model="newAssociationData.is_disable">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="音频链接地址" prop="video_url">
            <el-input v-model="newAssociationData.video_url" :disabled="true"></el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="所属音频目录ID" prop="v_id">
            <el-input v-model="newAssociationData.v_id" :disabled="true"></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="音频类型" prop="type">
            <el-select v-model="newAssociationData.type" placeholder="请选择" @change="typeAction">
              <el-option label="音频" value="0"></el-option>
              <el-option label="视频" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="音频时长(毫秒)"  :disabled="true"  style="width:90%" prop="time_length">
            <el-input v-model="newAssociationData.time_length" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="音视频背景图" prop="pic_url">
            <uploadSingleImg :imgUrl="newAssociationData.pic_url" :fileName="'Image'" @uploadSuccess="newAssociationuploadImg" @removeImg="newAssociationremoveImg"></uploadSingleImg>
            <el-input class="left" type="hidden" v-model="newAssociationData.pic_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="音频内容" prop="content">
            <uploadAudio v-if="mediaType == 0" :audioUrl="newAssociationData.content" :fileName="'Audio'" @uploadSuccess="addAudio" @removeAudio="removeAudioUrl"></uploadAudio>
            <uploadVideo v-else :videoUrl="newAssociationData.content" :fileName="'Video'" @uploadSuccess="addVideo" @removeVideo="removeVideoUrl"></uploadVideo>
            <el-input class="left" type="hidden" v-model="newAssociationData.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="querynewAssociation">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import uploadAudio from '@/components/upload/uploadAudio';
import uploadVideo from '@/components/upload/uploadVideo';
import ajax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      mediaType: '0',
      newAssociationData: {
        // id: '',
        num: '',
        title: '',
        u_id: '',
        is_disable: '',
        content: '',
        video_url: '',
        v_id: '',
        type: '0',
        time_length: '',
        pic_url: ''
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
      if (val === '0') {
        this.mediaType = '0';
      } else {
        this.mediaType = '1';
      }
      this.newAssociationData.content = '';
      this.newAssociationData.time_length = '';
      this.newAssociationData.video_url = '';
    },
    // 新增关联音频上传图片
    newAssociationuploadImg(data) {
      this.newAssociationData.pic_url = data.url;
    },
    // 新增关联音频删除图片
    newAssociationremoveImg() {
      this.newAssociationData.pic_url = '';
    },
    // 上传音频内容
    addAudio(data) {
      this.newAssociationData.video_url = data.url;
      this.newAssociationData.content = data.url;
      // eslint-disable-next-line no-undef
      this.newAssociationData.time_length = Math.round(data.duration);
    },
    // 删除音频内容
    removeAudioUrl() {
      this.newAssociationData.content = '';
      this.newAssociationData.time_length = '';
      this.newAssociationData.video_url = '';
    },
    // 上传视频内容
    addVideo(data) {
      this.newAssociationData.video_url = data.url;
      this.newAssociationData.content = data.url;
      this.newAssociationData.time_length = Math.round(data.duration);
    },
    // 删除视频内容
    removeVideoUrl() {
      this.newAssociationData.content = '';
      this.newAssociationData.time_length = '';
      this.newAssociationData.video_url = '';
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
    // 重置表单数据
    resetForm() {
      this.$refs['ruleFormnewAssociation'].resetFields();
      this.newAssociationData.content = '';
    },
    // 新增关联音频操作
    querynewAssociation() {
      this.$refs['ruleFormnewAssociation'].validate((valid) => {
        if (valid) {
          ajax.post('/api/PostManage/CreatevideoDetail', this.newAssociationData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.createvideoDetail();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.newAssociationData.v_id = this.$route.query.id;
    this.getdocuserlist();
  }
};
</script>

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
