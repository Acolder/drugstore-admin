<template>
  <div class="upload-wrapper">
    <div v-if="!packageUrl" class="noneData">
      <el-button type="default" plain icon="el-icon-upload2" @click="openLocals" v-loading="uploadLoading">上传安装包
      </el-button>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="fileChanged"/>
      </form>
    </div>
    <div v-else class="havaData">
      <el-tag closable @close="removePackage()">
        <img src="https://uploads.kangmei.com.cn/Files/20190117/nubeewtw.jns.jpg" alt="">
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
    // 安装包地址
    packageUrl: {
      type: String,
      default: '',
      required: true
    },
  },
  methods: {
    // 删除
    removePackage() {
      let _self = this;
      _self.$emit('removePackage');
    },
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
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
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      axios.post(`${process.env.UPLOAD_HOST}`, formdata1).then((response) => {
        console.log(response);
        _self.uploadLoading = false;
        let data = response.data;
        if (data) {
          let resultObj = data;
          _self.$emit('uploadSuccess', resultObj[0]);
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
  height: 100px;
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
</style>
