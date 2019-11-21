<template>
  <div class="upload-wrapper">
    <form class="apk-upload-form">
      <el-button type="default" plain icon="el-icon-upload2" @click="openLocals">选择安装包</el-button>
      <el-input type="file" id="file" :name="fileName" @change="fileChanged" style="display: none;" />
      <input type="text" id="token" style="display: none" />
      <span id="apk-name" class="apk-name"></span>
      <section class="progress" id="progress">
        <div class="box">
          <div class="bar" id="progress-bar"></div>
        </div>
      </section>
      <div class="btn-wrapper">
        <el-button type="primary" size="small" round  @click="start">开始上传</el-button>
        <el-button size="small" round @click="stop">暂停上传</el-button>
      </div>
    </form>
  </div>
</template>
<script>
import $ from 'jquery';
import '@static/js/jquery.form';
// import axios from 'axios';
import Uploader from './script/upload';
export default {
  data() {
    return {
      uploadLoading: false,
      host: '',
      running: '',
      completed: '',
      file: '',
      token: '',
      completeData: '',
    };
  },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    },
    // 安装包地址
    // packageUrl: {
    //   type: String,
    //   default: '',
    //   required: true
    // },
  },
  methods: {
    // 删除
    removePackage() {
      let _self = this;
      _self.$emit('removePackage');
    },
    openLocals() {
      // $(`input[type='file'][name='${this.fileName}']`).click();
      document.getElementById('file').click();
    },
    fileChanged() {
      this.uploadPackage();
    },
    uploadPackage() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.apk' && ext !== '.rar') {
        this.$message({
          message: '仅支持后缀.apk、.rar的文件',
          type: 'warning'
        });
        return false;
      }
      document.getElementById('apk-name').innerText = document.getElementById('file').files[0].name;
    },
    start() {
      let _this = this;
      let apkValue = document.getElementById('file').value;
      if (!apkValue) {
        this.$message({
          message: '文件不能为空！',
          type: 'warning'
        });
        return false;
      }
      let instance = new Uploader(document.getElementById('file').files[0]);
      if (window['instance'] == null)
      {
        instance.onerror = function (data)
        {
          window.setTimeout(function () { instance.start() }, 1000);
        };
        instance.onprogress = function (data)
        {
          document.getElementById('token').value = data.Token;
          let element = document.getElementById('progress-bar');
          element.style.width = data.Progress * 100 + '%';
          element.innerText = Math.floor(data.Progress * 100) + '%';
        };
        instance.oncomplete = function (data)
        {
          document.getElementById('progress').innerText = data.url;
          _this.$emit('returnApkUrl', data.url);
        };
      }
      instance.start(document.getElementById('token').value);
    },
    stop() {
      let instance = new Uploader(document.getElementById('file').files[0]);
      if (window['instance'] != null) {
        instance.stop();
      }
    }
  },
};
</script>
<style lang="less" scoped>
.upload-wrapper{
  height: auto;
  margin: 10px 0;
  display: flex;
}
.noneData,.havaData{
  height: 100%;
}
.el-tag {
  width: 150px;
  height: 100%;
  background-color: #FFF;
  border: none;
  display: flex;
  justify-content: space-between;
  align-content: center;
  img{
    width: 100px;
    height: 100%;
    border: 1px solid #ccc;
  }
}
.apk-upload-form {
  width: 100%;
}
.progress {
  width: 30%;
  min-width: 300px;
  padding: 5px 0;
  margin: 5px 0;
  .box {
    border: solid 1px #ccc;
    border-radius: 5px;
    height: 20px;
    background: #f0f0f0;
  }
  .bar {
    background-color: deepskyblue;
    color: white;
    text-align: right;
    height: 20px;
    line-height: 20px;
    width: 0%;
    font-size: 12px;
  }
}
</style>
