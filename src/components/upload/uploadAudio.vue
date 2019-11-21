<template>
  <div class="upload-wrapper">
    <div v-if="!audioUrl" class="noneData">
      <el-button type="default" plain icon="el-icon-upload2" @click="openLocals" v-loading="uploadLoading">上传音频
      </el-button>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="fileChanged"/>
      </form>
    </div>
    <div v-else class="havaData">
      <el-tag closable @close="removeAudio()">
       <audio :src="audioUrl" controls>
         您的浏览器不支持音频播放，无法展示。
       </audio>
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
    audioUrl: {
      type: String,
      default: '',
      required: true
    },
  },
  methods: {
    // 删除
    removeAudio() {
      let _self = this;
      _self.$emit('removeAudio');
    },
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    fileChanged() {
      this.uploadAudio();
    },
    uploadAudio() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.mp3' && ext !== '.wma' && ext !== '.wav' && ext !== '.ogg') {
        this.$message({
          message: '仅支持后缀.mp3、.wma、.wav、.ogg的文件',
          type: 'warning'
        });
        return false;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      // 获取录音时长
      let url = URL.createObjectURL(file);
      let audioElement = new Audio(url);
      let duration;
      audioElement.addEventListener('loadedmetadata', function (_event) {
        duration = audioElement.duration * 1000;
        console.log('录音时长(毫秒)', duration);
      });
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      axios.post(`${process.env.UPLOAD_HOST}`, formdata1).then((response) => {
        console.log(response);
        _self.uploadLoading = false;
        let data = response.data;
        if (data) {
          // let resultObj = data;
          // 将上传的音频url以及时长取出
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
  height: 50px;
}
.el-tag {
  width: 350px;
  height: 100%;
  background-color: #FFF;
  border: none;
  display: flex;
  justify-content: space-between;
  align-content: center;
  video{
    width: 335px;
    height: 100%;
  }
}
</style>