<template>
  <div class="import_wrap">
    <div class="importFile">
      <el-button-group class="btn-wrapper">
        <!-- <el-button type="default" plain icon="el-icon-tickets" @click="openLocals" class="import">导入本地Excel数据</el-button> -->
        <input type="file" class="import" value="fileExcelName">
        <el-button type="default" plain icon="el-icon-upload" @click="downloadMould" class="download">下载Excel模板</el-button>
      </el-button-group>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="uploadExcel" v-model="filePath" class="selectfile" />
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      fileName: 'a',
      filePath: '',
      fileExcelName: ''
    };
  },
  methods: {
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    // 下载excel模块
    downloadMould() {
      window.open(`${process.env.BASE_HOST}/api/jinmu/GetExeclTemplate/1`);
    },
    // 导入
    uploadExcel() {
      let _self = this;
      // let param = this.ImportName;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xlsx') {
        _self.$alert('仅支持.xlsm', '提示');
        return;
      }
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      formdata1.append('doCondense', '0');
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      ajax.post(`/api/jinmu/ImportExeclToContentDescribe/null`, null, config).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.importData = false;
          this.getTableData();
        } else {
          let msg = res.data.message;
          msg = msg ? msg : '上传失败！';
          _self.$alert(msg, '提示');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .btn-wrapper{
    width: 100%;
  }
  .import{
    margin-left: 50px;
    float: left;
  }
  .fileName{
    float: left;
    display: inline;
    padding: 0 10px;
    margin: 0 0 0 10px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    // border: 1px solid #000;
  }
  .download{
    float: right;
    margin-right: 100px;
  }
</style>
