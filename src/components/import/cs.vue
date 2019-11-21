/* 单个图片文件上传 */
<template>
  <div class="upload-wrapper">
    <div>
      <el-button-group class="btn-wrapper">
        <el-button type="default" plain icon="el-icon-upload2" @click="openLocals" v-loading="uploadLoading">上传本地文件</el-button>
        <el-button type="default" plain icon="el-icon-download" @click="openPrompt">下载模板</el-button>
      </el-button-group>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="fileChanged" v-model="filePath" class="selectfile" />
        <!-- <el-button icon="el-icon-picture" plain @click="openPrompt" class="appendNetImg">添加网络图片</el-button> -->
      </form>
    </div>
    <div class="img-wrapper">
      <el-tag @close="removeImg()">
      </el-tag>
    </div>
  </div>
</template>
<style lang="less" scoped>
.btn-wrapper {
  /deep/.el-button {
    border: 1px dotted #dcdfe6;
  }
}
.img-wrapper {
  padding: 10px 0;
  zoom: 1;
  &::after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.selectfile {
  width: auto;
  /deep/.el-input__inner {
    border: none;
    padding: 0;
  }
}
.appendNetImg {
  float: right;
  border: none;
}
.el-tag {
  height: auto;
  line-height: 0!;
  background-color: #fff;
  border: none;
  &:hover {
    cursor: pointer;
  }
  .el-icon-close {
    right: 0;
  }
}

.pload-wrapper {
  float: left;
}

img {
  height: 50px;
  float: left;
  border: 1px dashed #dcdfe6;
}

span {
  float: left;
}
</style>
<script>
import $ from 'jquery';
import '@static/js/jquery.form';
// import axios from 'axios';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      filePath: '',
      // imgUrlList: '',
      uploadLoading: false,
    };
  },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    },
  },
  methods: {
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    openPrompt() {
      window.open(`${process.env.BASE_HOST}/api/jinmu/GetExeclTemplate/2`);
    },
    fileChanged() {
      console.log(1);
      this.uploadImage();
    },
    uploadImage() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xlsx') {
        _self.$alert('仅支持.xlsx格式', '提示');
        return;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      // let config = {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // };
      ajax.post(`${process.env.BASE_HOST}/api/jinmu/ImportExeclToDevice/null`, formdata1).then((response) => {
        let data = response.data;
        _self.uploadLoading = false;
        _self.$emit('closeAction');
        _self.filePath = '';
        if (data.code === 0) {
          console.log(data);
          // let resultObj = data;
          // console.log(resultObj);
          // _self.imgUrlList = resultObj.url;
          // _self.$emit('uploadSuccess', resultObj[0], _self.imgUrlList);
          _self.$message.success('上传成功');
          // _self.filePath = '';
        }
      });
    },
  }
};

</script>
