<template>
  <div>
    <el-form :model="addData" ref="ruleForm" :rules="rules" label-width="100px">
      <!-- <div class="display-box"> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="音频编号" prop="num" class="input_common">
            <el-input v-model.number="addData.num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="音频标题" prop="title" class="input_common">
            <el-input v-model="addData.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="音频图片" prop="pic_url">
            <uploadSingleImg :imgUrl="addData.pic_url" :fileName="'Image'" @uploadSuccess="addDatauploadImg" @removeImg="addDataremoveImg"></uploadSingleImg>
            <el-input class="left" type="hidden" v-model="addData.pic_url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发帖人Id" prop="u_id">
            <el-select v-model="addData.u_id">
              <el-option
                v-for="item in doctorArrayList"
                :key="item.userid"
                :label="item.nickname"
                :value="item.userid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="音频类型" prop="type">
            <el-select v-model="addData.type" placeholder="请选择" @change="typeAction">
              <el-option label="音频" value="0"></el-option>
              <el-option label="视频" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核审状态" prop="status">
            <el-select v-model="addData.status" placeholder="请选择">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核成功" value="1"></el-option>
              <el-option label="审核失败" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="音频内容" prop="content">
            <uploadAudio v-if="mediaType == 0" :audioUrl="addData.content" :fileName="'Audio'" @uploadSuccess="addAudio" @removeAudio="removeAudioUrl"></uploadAudio>
            <uploadVideo v-else :videoUrl="addData.content" :fileName="'Video'" @uploadSuccess="addVideo" @removeVideo="removeVideoUrl"></uploadVideo>
            <el-input class="left" type="hidden" v-model="addData.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="浏览数" prop="click_rate" class="input_common">
            <el-input v-model="addData.click_rate" placeholder="请输入浏览数"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="点赞数" prop="click_like" class="input_common">
            <el-input v-model="addData.click_like" placeholder="请输入点赞数"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="轮播标题" prop="focus_title" class="input_common">
            <el-input v-model="addData.focus_title" placeholder="请输入轮播标题"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="发布时间" prop="creat_time">
              <el-date-picker v-model="addData.creat_time" type="datetime" placeholder="选择日期时间" clearable value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="是否为焦点图" prop="is_focus">
            <el-select v-model="addData.is_focus">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否为热门" prop="is_hot">
            <el-select v-model="addData.is_hot">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="是否禁用" prop="is_disable">
            <el-select v-model="addData.is_disable">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="轮播图" prop="is_loop">
            <el-select v-model="addData.is_loop">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="是否推荐" prop="is_recommend">
            <el-select v-model="addData.is_recommend">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <div></div> -->
      <div class="form-footer">
        <el-button type="primary" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="queryAdd">确 定</el-button>
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
.input_common{
  width: 90%;
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
      mediaType: '0',
      addData: {
        // id: '',
        num: '',  // 编号
        title: '',  // 标题
        pic_url: '',   //  图片链接地址
        type: '0',    //  类型
        u_id: '',   // 发帖人Id
        content: '',  // 音频内容
        status: '',  // 核审状态
        focus_title: '',  // 轮播标题
        click_rate: '',  // 浏览数
        click_like: '',  // 点赞数
        // creat_time: '2019-01-25 11:11:01',   // 创建时间
        is_focus: '0',  // 焦点
        is_hot: '0',  // 热门
        is_disable: '0',  // 禁用
        is_loop: '0',  // 是否轮播
        is_recommend: '0',  // 是否推荐
      },
      // 医生数组
      doctorArrayList: [],
      // 数据验证
      rules: {
        num: [{ required: true, message: '请输入音频编号', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }],
        title: [{ required: true, message: '请输入音频标题', trigger: 'blur' }],
        pic_url: [{ required: true, message: '请输入音频图片链接地址', trigger: 'blur' }],
        u_id: [{ required: true, message: '请输入发帖人Id', trigger: 'blur' }],
        type: [{ required: true, message: '请输入音频类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择核审状态', trigger: 'blur' }],
        content: [{ required: true, message: '请输入音频内容', trigger: 'blur' }],
        focus_title: [{ required: true, message: '请输入轮播标题', trigger: 'blur' }],
        creat_time: [{ required: true, message: '请选择日期时间', trigger: 'blur' }],
        click_rate: [{ required: true, message: '请输入浏览数', trigger: 'blur' }],
        click_like: [{ required: true, message: '请输入点赞数', trigger: 'blur' }],
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
      this.addData.content = '';
    },
    // 新增音频上传图片
    addDatauploadImg(data) {
      this.addData.pic_url = data.url;
    },
    // 新增音频删除图片
    addDataremoveImg() {
      this.addData.pic_url = '';
    },
    // 上传音频内容
    addAudio(data) {
      console.log(data);
      this.addData.content = data.url;
    },
    // 删除音频内容
    removeAudioUrl() {
      this.addData.content = '';
    },
    // 上传视频内容
    addVideo(data) {
      this.addData.content = data.url;
    },
    // 删除视频内容
    removeVideoUrl() {
      this.addData.content = '';
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
      this.$refs['ruleForm'].resetFields();
      this.addData.content = '';
    },
    // 添加操作
    queryAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/postmanage/Createvideo', this.addData).then(data => {
            if (data.status === 200 && data.data.code === 0) {
              this.$message({
                type: 'info',
                message: data.data.message
              });
              this.resetForm();
              parent.window.adddialogFormVisible();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getdocuserlist();
  }
};
</script>