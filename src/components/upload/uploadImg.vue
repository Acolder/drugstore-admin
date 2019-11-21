/* 单个图片文件上传 */
<template>
  <div class="upload-wrapper">
    <div v-show="limit-imgList.length>0">
      <el-button-group class="btn-wrapper">
        <el-button type="default" plain icon="el-icon-picture" @click="openLocals" v-loading="uploadLoading">上传本地图片
        </el-button>
        <el-button type="default" plain icon="el-icon-upload" @click="openPrompt">添加网络图片</el-button>
      </el-button-group>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="fileChanged" v-model="filePath" class="selectfile"/>
        <el-button icon="el-icon-picture" plain @click="openPrompt" class="appendNetImg">添加网络图片</el-button>
      </form>
    </div>
    <div class="img-wrapper">
      <el-tag v-for="(url,index) in imgList" :key="index" closable @close="removeImg(url)" v-if="url">
        <!--<span>{{attachmentName}}</span>
        <i class="el-icon-zoom-in"></i>-->
        <img :src="url" alt="" @click="preview(url)"/>
      </el-tag>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .btn-wrapper {
    /deep/ .el-button {
      border: 1px dotted #DCDFE6;
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
    /deep/ .el-input__inner {
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
    line-height: 0 !;
    background-color: #FFF;
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
    border: 1px dashed #DCDFE6;
  }
  span {
    float: left;
  }
</style>
<script>
import $ from 'jquery';
import '@static/js/jquery.form';
import axios from 'axios';
import { base64Decrypt } from '@/utils/auth';
// import { Loading } from 'element-ui';
// import { browser } from '@utils/index';
export default {
  data() {
    return {
      filePath: '',
      imgUrlList: '',
      uploadLoading: false,
    };
  },
  computed: {
    imgList: {
      get: function () {
        // console.log(this.imgUrl);
        let urls = this.imgUrl;
        if (urls) {
          let list = this.imgUrl.split(',');
          return list;
        } else {
          return [];
        }
      }
    }
  },
  // watch: {
  //   imgList(newValue, oldValue) {
  //     // console.log(newValue);
  //   },
  //   imgUrl(newValue, oldValue) {
  //     // console.log(newValue);
  //   }
  // },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    },
    // 图片地址,多个图片用逗号隔开
    imgUrl: {
      type: String,
      default: '',
      required: true
    },
    // 上传数量
    limit: {
      type: Number,
      default: 1
    },
    isMark: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    openPrompt() {
      let _self = this;
      let tip = '';
      if (this.limit > 1) {
        tip = '请输入网络地址,多张图片地址用","号隔开。';
      } else {
        tip = '请输入网络地址.';
      }
      this.$prompt(tip, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
        inputErrorMessage: '图片地址不正确'
      }).then(({ value }) => {
        let array = value.split(',');
        let count = _self.limit - (array.length + _self.imgList.length);
        if (count < 0) {
          this.$message({
            type: 'error',
            message: '添加失败，添加图片数超出限额！'
          });
          return false;
        }
        _self.appendImgUrl(value);
        _self.$emit('uploadSuccess', { url: value }, _self.imgUrlList);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    /* preview(url) {
     this.$emit('previewImg', url);
     }, */
    preview(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // 删除 imgUrl的图片url
    removeImgUrl(url) {
      let array = [];
      for (let i = 0; i < this.imgList.length; i++) {
        let item = this.imgList[i];
        if (item !== url) {
          array.push(item);
        }
      }
      let value = array.join(',');
      this.imgUrlList = value;
    },
    // 添加 imgUrl的图片url
    appendImgUrl(url) {
      // console.log(url);
      // console.log(this.imgList);
      let array = this.imgList;
      array.push(url);
      let value = array.join(',');
      this.imgUrlList = value;
      // console.log(this.imgUrlList);
    },
    // 删除一张图片
    removeImg(url) {
      let _self = this;
      _self.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.filePath = '';
        _self.removeImgUrl(url);
        _self.$emit('removeImg', _self.imgUrlList);
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    fileChanged() {
      if (this.isMark) {
        this.uploadMarkImage();
      } else {
        this.uploadImage();
      }
    },
    uploadImage() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.bmp') {
        _self.$alert('仅支持.jpg、.png、.gif、.jpeg、.bmp的图片格式', '提示');
        return;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      axios.post(`${process.env.UPLOAD_HOST}`, formdata1, config).then((response) => {
        _self.uploadLoading = false;
        let data = response.data;
        if (data) {
          // console.log(data);
          let resultObj = data;
          _self.appendImgUrl(resultObj[0].url);
          _self.$emit('uploadSuccess', resultObj[0], _self.imgUrlList);
        }
      });
    },
    // 打水印上传
    uploadMarkImage() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.bmp') {
        _self.$alert('仅支持.jpg、.png、.gif、.jpeg、.bmp的图片格式', '提示');
        return;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      formdata1.append('doCondense', '0');
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      axios.post(`${process.env.MALL_BASE_HOST}/mall_manage/back/file/markAndUploadImg`, formdata1, config).then((response) => {
        _self.uploadLoading = false;
        let str = base64Decrypt(response.data);
        let data = JSON.parse(str);
        if (data && Number(data.resultCode) === 0) {
          _self.appendImgUrl(data.resultData);
          _self.$emit('uploadSuccess', data.resultData, _self.imgUrlList);
        } else {
          let msg = data.msg;
          msg = msg ? msg : '上传失败！';
          _self.$alert(msg, '提示');
        }
      });
    }
  },
};
</script>
