<template>
  <div class="upload-wrapper">
    <div v-if="!videoUrl" class="noneData">
      <el-button type="default" plain icon="el-icon-upload2" @click="openLocals" v-loading="uploadLoading">上传视频
      </el-button>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="fileChanged"/>
      </form>
    </div>
    <div v-else class="havaData">
      <el-tag closable @close="removeVideo()">
        <video :src="videoUrl" controls>
          您的浏览器不支持视频播放，无法展示。
        </video>
      </el-tag>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import '@static/js/jquery.form';
import axios from 'axios';
export default {
  data() {
    return {
      uploadLoading: false,
    };
  },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    },
    // 视频地址
    videoUrl: {
      type: String,
      default: '',
      required: true
    },
  },
  methods: {
    // 删除
    removeVideo() {
      let _self = this;
      console.log('removeVideo');
      _self.$emit('removeVideo');
    },
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    fileChanged() {
      this.uploadVideo();
    },
    uploadVideo() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.avi' && ext !== '.rmvb' && ext !== '.rm' && ext !== '.asf' && ext !== '.divx' && ext !== '.mpg' && ext !== '.mpeg' && ext !== '.mpe' && ext !== '.wmv' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.vob') {
        this.$message({
          message: '仅支持后缀.avi、.rmvb、.rm、.asf、.divx、.mpg、.mpeg、.mpe、.wmv、.mp4、.mkv、.vob的文件',
          type: 'warning'
        });
        return false;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      // 获取视频时长
      let url = URL.createObjectURL(file);
      let audioElement = new Audio(url);
      let duration;
      audioElement.addEventListener('loadedmetadata', function (_event) {
        duration = audioElement.duration * 1000;
        console.log('视频时长(毫秒)', duration);
      });
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      // axios.post('http://upload.jkbat.com/bigfile/', formdata1).then((response) => {
      axios.post(`${process.env.UPLOAD_HOST}`, formdata1).then((response) => {
        console.log(response);
        _self.uploadLoading = false;
        let data = response.data;
        if (data) {
          // let resultObj = data;
          // 将上传的视频url以及时长取出
          let resultObj = {
            url: data[0].url,
            duration: duration,
          };
          _self.$emit('uploadSuccess', resultObj);
        }
      }).catch(() => {
        this.$message({
          message: '文件上传失败',
          type: 'error'
        });
        _self.uploadLoading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.upload-wrapper{
  margin: 10px 0;
  display: flex;
}
.noneData{
  height: 100px;
  height: 100%;
}
.havaData{
  height: 200px;
}
.el-tag {
  width: 400px;
  height: 100%;
  background-color: #FFF;
  border: none;
  display: flex;
  justify-content: space-between;
  align-content: center;
  video{
    width: 380px;
    height: 100%;
  }
}
</style>