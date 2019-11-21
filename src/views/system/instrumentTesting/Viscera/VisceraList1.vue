<template>
  <div class="Viscera">
    <div class="toolbar-wrapper">
      <el-button-group>
          <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button type="default" size="small" icon="el-icon-upload" @click="batchImport">导入</el-button>
          <el-button type="default" size="small" icon="el-icon-delete" @click="deletaList">批量删除</el-button>
          <el-button type="default" size="small" icon="el-icon-refresh" @click="refreshList">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="getColunms" :table-data="tableData" row-hover-color="#eee"
        row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
      </v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.PageSize" :page-index="screenInfo.PageIndex"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  查看详情  -->
    <el-dialog title="查看详情" :visible.sync="visceraDetail" width="60%" :center="true" :modal-append-to-body="false" class="details">
      <el-row><el-col :span="24"><div class="grid-content bg-purple commonH"><span class="strong">体质结果</span>{{detailData.name}}</div></el-col></el-row>
      <el-row><el-col :span="24"><div class="grid-content bg-purple commonH"><span class="strong">操作时间</span>{{detailData.date}}</div></el-col></el-row>
      <el-row><el-col :span="24">
        <div class="grid-content bg-purple commonH"><span class="strong">表现症状</span><div class="common" v-html="detailData.symptom"></div></div>
      </el-col></el-row><br/>
      <!-- 中成药调理 -->
      <el-row>
        <el-col :span="24">
          <div>
            <span class="strong">中成药调理</span>
            <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="productColunms"
            :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
        </el-col>
      </el-row><br/>
      <!-- 中医方剂 -->
      <el-row>
        <el-col :span="24">
          <div>
            <span class="strong">推荐方剂</span>
            <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="prescriptionColumns"
            :table-data="prescriptionData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
        </el-col>
      </el-row><br/>
      <!-- 推荐汤品 -->
      <el-row>
        <el-col :span="24">
          <div>
            <span class="strong">推荐汤品</span>
            <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="productColunms"
            :table-data="soupTableData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
        </el-col>
      </el-row><br/>
      <!-- 推荐滋补品 -->
      <el-row>
        <el-col :span="24">
          <div>
            <span class="strong">推荐滋补品</span>
            <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="productColunms"
            :table-data="kangmeiData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
        </el-col>
      </el-row><br/>
      <!-- 推荐资讯 -->
      <el-row>
        <el-col :span="24">
          <div>
            <span class="strong">推荐资讯</span>
            <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="newsColumns"
            :table-data="readData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
        </el-col>
      </el-row><br/>
      <!-- 运动保健 -->
      <el-row>
        <el-col :span="24">
          <div>
            <span class="strong">运动保健</span>
            <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="newsColumns"
            :table-data="motionData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </div>
        </el-col>
      </el-row><br/>
    </el-dialog>
    <!--  导入  -->
    <el-dialog title="导入体质结果数据" :visible.sync="importData" width="40%" :center="true" :modal-append-to-body="false" :append-to-body="true" class="details">
      <el-form ref="resultData" :model="importForm" :rules="importRules" label-width="100px" class="addRoles">
        <input type="file" id="fileField" :name="fileName" class="import">
        <el-button type="default" plain icon="el-icon-upload" @click="downloadMould" class="download">下载Excel模板</el-button>
        <el-form-item class="form-button-wrapper">
          <el-button @click="resetImport" icon="el-icon-circle-close-outline" size="small">取消</el-button>
          <el-button @click="submitImport" type="primary" icon="el-icon-check" size="small">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery';
import ajax from '@/utils/ajax';
import importExcel from '@/components/import/importExcel';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      selection: [],
      screenInfo: {
        PageIndex: 1,
        PageSize: 10,
        type: 2,
      },
      visceraDetail: false,
      detailData: {},
      soupTableData: [],   // soup汤品
      kangmeiData: [],   //  life滋补品
      productData: [],  //  product商品（中医调理）
      readData: [],  //  read资讯（养生堂）
      motionData: [],  //  motion资讯（运动保健）prescriptionData
      prescriptionData: [],  //  prescriptionData  推荐方剂
      doctorData: [],  //  prescriptionData  中医调理（physiotherapy-方案）
      importData: false,
      importForm: {
      },
      importRules: {},
      fileName: 'a',
      ImportName: '',
      index: ''
    };
  },
  computed: {
    // 列表
    getColunms() {
      let _self = this;
      let columns = [
        { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 40, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'name', title: '脏腑辩证', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'symptom', title: '表现症状', width: 250, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product', title: '推荐中成药', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'soup', title: '推荐汤品', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'life', title: '推荐滋补品', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'prescriptions', title: '推荐方剂', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        // { field: 'physiotherapy', title: '推荐理疗方案', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 230, titleAlign: 'center', columnAlign: 'center', componentName: 'newsinfo-product-PhysicalResult', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'soup' || item.field === 'life') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let soupName = value.map(function(item, index, data) {
                return item.product_name;
              });
              let soupNameStr = soupName.join(' , ');
              return soupNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'product') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let productName = value.map(function(item, index, data) {
                return item.product_name;
              });
              let productNameStr = productName.join(' , ');
              return productNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'life') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let productName = value.map(function(item, index, data) {
                return item.product_name;
              });
              let repairNameStr = productName.join(' , ');
              return repairNameStr;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'prescriptions') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let readtName = value.map(function(item, index, data) {
                return item.name;
              });
              let readtNameStr = readtName.join(' , ');
              return readtNameStr;
            } else {
              return '-';
            }
          };
        }
        // if (item.field === 'physiotherapy') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     let value = rowData[field];
        //     if (value) {
        //       let motionName = value.map(function(item, index, data) {
        //         return item.programme;
        //       });
        //       let motionNameStr = motionName.join(' , ');
        //       return motionNameStr;
        //     } else {
        //       return '-';
        //     }
        //   };
        // }
      }
      return columns;
    },
    // 商品（中成药调理）
    productColunms() {
      let columns = [
        { field: 'product_name', title: '商品名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product_pic', title: '商品图片', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_price', title: '价格', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'product_pic') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'product_price') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '<span style="color: red">' + value + '</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // 资讯
    newsColumns() {
      let columns = [
        { field: 'description', title: '资讯标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_name', title: '资讯分类', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product_pic', title: '资讯配图', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'product_pic') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
      }
      return columns;
    },
    // 推荐方剂
    prescriptionColumns() {
      let columns = [
        { field: 'name', title: '方剂名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'prescription', title: '方剂剂量', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'effect', title: '方剂功效', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
      }
      return columns;
    },
    // 中医理疗（推荐方案）
    doctorColunms() {
      let columns = [
        { field: 'programme', title: '方案名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'img_ico', title: '展示图', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'introduce', title: '图文介绍', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        // { field: 'title', title: '标题描述', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'img_ico') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
      }
      return columns;
    },
  },
  components: {
    'importExcel': importExcel,
  },
  methods: {
    // 下载excel模块
    downloadMould() {
      window.open(`${process.env.BASE_HOST}/api/jinmu/GetExeclTemplate/1`);
    },
    refreshList() {
      this.getTableData();
    },
    add() {
      this.$router.push({
        path: '/instrumentTesting/Viscera/addViscera',
      });
    },
    // 导入
    batchImport() {
      this.importData = true;
    },
    resetImport() {
      this.importData = false;
    },
    submitImport() {
      let _self = this;
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
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      ajax.post(`/api/jinmu/ImportExeclToContentDescribe/` + 2, formdata1, config).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.importData = false;
          this.getTableData();
        }
      });
    },
    // 列表
    getTableData() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.post(`/api/jinmu/GetContentDescribePageList`, param).then((res) => {
        console.log(res.data.data);
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.data.rcounr;
          _self.tableData = res.data.data.details;
        }
      });
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.$router.push({
          path: '/instrumentTesting/Viscera/editViscera',
          query: {
            id: params.rowData.id,
          }
        });
        this.detaildsId = params.rowData.id;
      } else if (params.type === 'see') {  // 查看详情
        this.visceraDetail = true;
        this.getVisceraDetails(params.rowData.id);
      }
    },
    // 查看详情
    getVisceraDetails(data) {
      ajax.get(`/api/jinmu/GetContentDescribeInfoByID/` + data).then((res) => {
        // console.log(res.data);
        if (res.status === 200 & res.data.code === 0) {
          this.detailData = res.data.data;
          this.productData = res.data.data.product;
          this.soupTableData = res.data.data.soup;
          this.kangmeiData = res.data.data.life;
          this.motionData = res.data.data.motion;
          this.readData = res.data.data.read;
          this.prescriptionData = res.data.data.prescriptions;
          this.doctorData = res.data.data.physiotherapy;
        }
      });
    },
    // 删除
    remove(ids) {
      let _self = this;
      let param;
      if (Array.isArray(ids) === true) {
        param = ids;
      } else {
        param = [ids];
      }
      ajax.post(`/api/jinmu/DeleteContentDescribeByIDs`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.getTableData();
        }
      });
    },
    // 批量删除
    deletaList() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该脏腑辩证, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id.toString());
          }
          this.remove(idList);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$alert('请选择删除的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.screenInfo.PageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.PageIndex = 1;
      this.screenInfo.PageSize = pageSize;
      this.getTableData();
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.strong{
  width: 85px;
  text-align: left;
  font-weight: bold;
  margin-right: 20px;
  float: left;
}
.fangji{
  margin-left: 25px;
  width: 60px;
}
.common{
  float: left;
}
.commonH{
  height: 25px;
  line-height: 25px;
}
.form-button-wrapper {
  text-align: center;
  margin: 20px 0 20px -38px;
}
.addRoles{
  width: 500px;
  margin: 0 auto;
}
.import{
  // float: left;
  margin: 0 0 0 50px;
}
</style>
