<template>
  <div class="list" v-loading="islodingwarp" element-loading-text="拼命导入中">
    <el-container>
      <el-header class="header-wrap" heght="60px;">
        <header class="header">
          <!-- <div class="toggle-menu">
            <a href="javascript:void(0);" @click="toggleSidebar">
              <span class="el-icon-menu"></span>
            </a>
          </div> -->
          <div class="header_left">
            <img src="./img/pic_icon@2x.png" alt="">
            <span class="title">药葫芦</span>
          </div>
        </header>
      </el-header>
      <el-main>
        <div class="content">
          <div class="search-wrapper">
            <el-form :inline="true" :model="screenInfo" size="small" ref="query_form">
              <el-form-item label="名称" prop="name">
                <el-input v-model="screenInfo.name" placeholder="名称" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="toolbar-wrapper">
            <el-button-group>
              <el-button type="default" size="medium" icon="el-icon-plus" @click="importData">导入文件</el-button>
            </el-button-group>
          </div>
          <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
            <el-input type="file" :name="fileName" @change="fileChanged" v-model="filePath" class="selectfile" />
          </form>
          <!-- 表格区域 -->
          <div class="table-wrapper">
            <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
          </div>
          <!-- 分页区域 -->
          <div class="pagin-wrapper">
            <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
            </v-pagination>
          </div>
        </div>
      </el-main>
      <!-- 弹窗 -->
      <!-- <el-dialog title="导入饮片" :visible.sync="importVisible" :modal-append-to-body="false" @close="importClose" width="400px">
        <el-form :model="importInfo" size="small" :rules="rules" ref="importForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="importInfo.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="importInfo.describe" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="importData">确 定</el-button>
        </div>
      </el-dialog> -->
    </el-container>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import { formatDate } from '@/utils/date';
import { serializeData, base64Encrypt } from '@/utils/auth';
export default {
  data() {
    return {
      tableData: [],
      isLoding: false,
      total: 0,
      fileName: 'upLoad',
      filePath: '',
      screenInfo: {
        pageSize: 10,
        pageNum: 1,
        identification: '',
        name: '',
        describe: '',
        orderBy: 'desc'
      },
      islodingwarp: false,
      // importVisible: false,
      importInfo: {
        name: '', // 名字
        describe: '' // 描述
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        describe: [{ required: true, message: '请输入描述', trigger: 'blur' }],
      },
      // closeType: ''
    };
  },
  computed: {
    columns: function() {
      // let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        // {
        //   field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
        //   formatter: function (rowData, rowIndex, pagingIndex, field) {
        //     let index = (_self.screenInfo.pageNum - 1) * _self.screenInfo.pageSize + rowIndex + 1;
        //     return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        //   }, isFrozen: true, isResize: true
        // },
        { field: 'medicineInfoId', title: '记录ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'name', title: '文件名称', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'describe', title: '描述', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '导入时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'modifyDate', title: '修改时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-export', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'createDate' || item.field === 'modifyDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            return value;
          };
        }
      }
      return columns;
    },
  },
  methods: {
    importClose() {
      // this.$refs['importForm'].resetFields();
      // console.log(this.closeType);
      if (!this.closeType) {
        this.$refs['importForm'].resetFields();
      }
    },
    query() {
      this.screenInfo.pageNum = 1;
      this.getTableData();
    },
    // 导入
    // importButon() {
    //   this.importVisible = true;
    // },
    importData() {
      $(`input[type='file'][name='${this.fileName}']`).click();
      // this.$refs['importForm'].validate((valid) => {
      //   if (valid) {
      //     this.importVisible = false;
      //     this.closeType = 1;
      //     $(`input[type='file'][name='${this.fileName}']`).click();
      //   } else {
      //     return false;
      //   }
      // });
    },
    fileChanged() {
      let _self = this;
      _self.islodingwarp = true;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      // console.log(ext);
      if (ext !== '.xlsx' && ext !== '.xls') {
        _self.$alert('仅支持.xlsx和.xls格式', '提示');
        return;
      }
      let file = fileElement[0].files[0];
      // let file = fileElement[0].value;
      let formdata1 = new FormData();
      let param = JSON.stringify(this.importInfo);
      // param = serializeData({ param: param });
      // console.log(file, fileElement);
      formdata1.append('file', file, file.name);
      formdata1.append('param', param);
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      _self.fromloaData(formdata1, config);
    },
    fromloaData(formdata1, config) {
      let _self = this;
      axios.post(`${process.env.MALL_BASE_HOST}/mall_manage/medicineExcel/importMedicineByExcel`, formdata1, config).then((response) => {
        let data = response.data;
        // _self.$emit('closeAction');
        _self.filePath = '';
        // console.log(data);
        if (data.resultCode === '成功') {
          _self.islodingwarp = false;
          this.$message.success('导入成功');
          // this.$refs['importForm'].resetFields();
          this.getTableData();
        } else {
          this.$message.error('导入失败，请重试');
        }
      });
    },
    customCompFunc(param) {
      if (param.type === 'down') {
        // let params = {
        //   identification: param.rowData.identification
        // };
        // params = base64Encrypt(JSON.stringify(params));// 要发送到后台的数据
        // // let from = {
        // //   param: params
        // // };
        // axios({ // 用axios发送post请求
        //   method: 'post',
        //   url: `${process.env.MALL_BASE_HOST}/mall_manage/medicineExcel/exportExcleMedicine`, // 请求地址
        //   data: { param: params }, // 参数
        //   responseType: 'blob' // 表明返回服务器返回的数据类型
        // })
        //   .then((res) => { // 处理返回的文件流
        //     const content = res;
        //     const blob = new Blob([content]);
        //     const fileName = '测试表格123.xls';
        //     if ('download' in document.createElement('a')) { // 非IE下载
        //       const elink = document.createElement('a');
        //       elink.download = fileName;
        //       elink.style.display = 'none';
        //       elink.href = URL.createObjectURL(blob);
        //       document.body.appendChild(elink);
        //       elink.click();
        //       URL.revokeObjectURL(elink.href); // 释放URL 对象
        //       document.body.removeChild(elink);
        //     } else { // IE10+下载
        //       navigator.msSaveBlob(blob, fileName);
        //     }
        //   });


        let params = {
          identification: param.rowData.identification
        };
        params = base64Encrypt(JSON.stringify(params));
        window.open(`${process.env.MALL_BASE_HOST}/mall_manage/medicineExcel/exportExcleMedicine?param=${params}`);
      }
    },
    // 分页切换
    pageSizeChange(pageSize) {
      this.screenInfo.pageNum = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTableData();
    },
    pageChange(pageNum) {
      this.screenInfo.pageNum = pageNum;
      this.getTableData();
    },
    // 获取数据
    getTableData() {
      // let config = {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   // headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      // };
      // let param = {
      //   param: this.screenInfo
      // };
      let param = JSON.stringify(this.screenInfo);
      param = serializeData({ param: param });
      this.isLoding = true;
      axios.post(`${process.env.MALL_BASE_HOST}/mall_manage/medicineExcel/queryMedicineInfo`, param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
          this.isLoding = false;
        } else {
          this.isLoding = false;
          this.$message.error('网络错误，请重试');
        }
      });
    }
  },
  created() {
    this.getTableData();
    document.title = 'Excel转换工具';
  }
};
</script>

<style lang="less" scoped>
.list{
  background: #F7F8FA!important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /deep/.el-button--small{
    background: #0ccdd3;
    border-color: #0ccdd3;
  }
  /deep/.el-dialog__header{
    border-bottom: 1px solid #DCDFE6;
  }
  .header-wrap{
    background: #fff;
    display: flex;
    align-items: center;
    width: 1500px;
    margin: 0 auto;
    .header_left{
      display: flex;
      align-items: center;
      img{
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      .title{
        font-size: 20px;
        // font-weight: 600;
        margin-right: 5px;
        color: #0ccdd3;
        font-family: "Hiragino Sans GB"
      }
    }
  }
  .content{
    width: 1500px;
    margin: 30px auto;
  }
}
</style>
