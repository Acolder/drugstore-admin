<template>
    <div id="Physical">
      <div class="toolbar-wrapper">
        <el-button-group>
            <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button type="default" size="small" icon="el-icon-upload" @click="batchImport">导入</el-button>
            <el-button type="default" size="small" icon="el-icon-delete" @click="deletaList">批量删除</el-button>
            <el-button type="default" size="small" icon="el-icon-refresh" @click="refreshList">刷新</el-button>
        </el-button-group>
      </div>
      <div class="table-wrapper">
        <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
          row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange">
        </v-table>
      </div>
      <div class="pagin-wrapper">
        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.PageSize" :page-index="screenInfo.PageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
      <!--  查看详情  -->
      <el-dialog title="查看详情" :visible.sync="ResultDetail" width="1000px" :center="true" :modal-append-to-body="false" class="details">
        <el-row><el-col :span="24"><div class="grid-content bg-purple commonH"><span class="strong">体质结果：</span><i class="title">{{detailData.name}}</i></div></el-col></el-row>
        <el-row><el-col :span="24"><div class="grid-content bg-purple commonH"><span class="strong">修改时间：</span>{{detailData.date}}</div></el-col></el-row>
        <el-row><el-col :span="24"><div class="grid-content bg-purple commonH"><span class="strong">体质简介：</span><div class="common" v-html="detailData.suggestion"></div></div></el-col></el-row>
        <el-row><el-col :span="24"><div class="grid-content bg-purple commonH"><span class="strong">调理建议：</span><div class="common" v-html="detailData.symptom"></div></div></el-col></el-row>
        <!-- 推荐汤品 -->
        <el-row>
          <el-col :span="24">
            <div>
              <span class="strong">推荐汤品</span>
              <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="pruductsColumns"
              :table-data="soupTableData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
            </div>
          </el-col>
        </el-row><br/>
        <!-- 推荐商品 -->
        <el-row>
          <el-col :span="24">
            <div>
              <span class="strong">推荐商品</span>
              <v-table ref="prodata_table" column-width-drag :is-horizontal-resize="true" style="width:80%;float:left" class="common" :columns="pruductsColumns"
              :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
            </div>
          </el-col>
        </el-row><br/>
        <!-- 饮食建议 -->
        <el-row>
          <el-col :span="24">
            <div class="diet">
              <span class="commonCss Suggest dietSuggest strong">饮食建议</span><br/>
              <table width="760px" border=1 cellspacing="0" align="center" class="tableList">
                <tr style="background-color:#f6f8f8">
                  <td class="tdCommom" style="width:100px;">所属宜忌</td>
                  <td class="tdCommom tdSuggest">建议</td>
                  <td class="tdCommom tdFood">食材</td>
                </tr>
                <tr>
                  <td class="tdCommom" style="width:100px;">宜</td>
                  <td class="tdSuggest">{{fitSuggest}}</td>
                  <td class="tdCommom tdFood">{{foodFit}}</td>
                </tr>
                <tr>
                  <td class="tdCommom" style="width:100px;">忌</td>
                  <td>
                    <p class="tdSuggest">{{notfitSuggest}}</p>
                  </td>
                  <td class="tdCommom tdFood">{{foodNotFit}}</td>
                </tr>
              </table>
            </div>
          </el-col>
        </el-row><br/>
      </el-dialog>
      <!--  导入  -->
      <el-dialog title="导入体质结果数据" :visible.sync="importData" width="40%" :center="true" :modal-append-to-body="false" :append-to-body="true" class="details">
        <el-form ref="resultData" :model="importForm" :rules="importRules" label-width="100px" class="addRoles">
          <input type="file" id="fileField" class="import" :name="fileName" @change="fileChanged" >
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
      columns: this.getColumns(),
      screenInfo: {
        PageIndex: 1,
        PageSize: 10,
        type: 1,
      },
      detaildsId: '',
      ResultDetail: false,
      detailData: {},
      importData: false,
      importForm: {

      },
      importRules: {},
      fileName: 'a',
      ImportName: '',
      soupTableData: [],
      pruductsColumns: this.productColunms(),
      productData: [],
      kangmeiData: [],
      fitSuggest: '',  // 宜建议
      notfitSuggest: '',  // 忌建议
      foodFit: '',  // 宜
      foodNotFit: '',  // 忌
    };
  },
  components: {
    'importExcel': importExcel,
  },
  methods: {
    // 下载excel模块
    downloadMould() {
      window.open(`${process.env.BASE_HOST}/api/jinmu/GetExeclTemplate/1`);
    },
    // 新增
    add() {
      this.$router.push({
        path: '/instrumentTesting/PhysicalResult/addResult',
      });
    },
    // 导入
    batchImport() {
      this.importData = true;
    },
    resetImport() {
      this.importData = false;
    },
    fileChanged() {
      this.ImportName = document.getElementById('fileField').files[0].name;
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
      ajax.post(`/api/jinmu/ImportExeclToContentDescribe/` + 1, formdata1, config).then((res) => {
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
    refreshList() {
      this.getTableData();
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
        this.$confirm('此操作将永久删除该体质结果, 是否继续?', '提示', {
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
    // table operaion
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该体质结果, 是否继续?', '提示', {
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
        this.detaildsId = params.rowData.id;
        this.$router.push({
          path: '/instrumentTesting/PhysicalResult/editResult?id=' + this.detaildsId,
        });
      } else if (params.type === 'see') {  // 查看详情
        this.ResultDetail = true;
        this.getResultDetails(params.rowData.id);
      }
    },
    productColunms() {
      let columns = [
        { field: 'product_name', title: '商品名', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product_pic', title: '商品图片', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_price', title: '价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
    // 查看详情
    getResultDetails(data) {
      let _self = this;
      ajax.get(`/api/jinmu/GetContentDescribeInfoByID/` + data).then((res) => {
        if (res.status === 200 & res.data.code === 0) {
          _self.detailData = res.data.data;
          _self.productData = res.data.data.product;
          _self.soupTableData = res.data.data.soup;
          _self.kangmeiData = res.data.data.life;
          _self.fitSuggest = _self.detailData.ingredients[0].ingredients_introduce;
          _self.notfitSuggest = _self.detailData.ingredients[1].ingredients_introduce;
          let fitFoodName = _self.detailData.ingredients[0].items.map(function(item, index, data) {
            return item.product_name;
          });
          _self.foodFit = fitFoodName.join(', ');
          let fitFoodName1 = _self.detailData.ingredients[1].items.map(function(item, index, data) {
            return item.product_name;
          });
          _self.foodNotFit = fitFoodName1.join(', ');
        }
      });
    },
    getTableData() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.post(`/api/jinmu/GetContentDescribePageList`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.data.rcounr;
          _self.tableData = res.data.data.details;
        }
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.PageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'name', title: '体质结果', width: 175, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'symptom', title: '体质简介', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'suggestion', title: '调理建议', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'soup', title: '推荐汤品', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'product', title: '推荐药品', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'newsinfo-product-PhysicalResult', isResize: true }
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
        if (item.field === 'soup') {
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
      }
      return columns;
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
.addRoles{
  width: 500px;
  margin: 0 auto;
}
.import{
  margin: 0 0 0 50px;
}
.strong{
  width: 85px;
  text-align: left;
  font-weight: bold;
  margin-right: 20px;
  float: left;
}
.common{
  float: left;
}
.form-button-wrapper{
  text-align: center;
  margin: 20px 0 20px -38px;
}
.strong{
  font-weight: bold;
  margin-right: 20px;
  float: left;
}
.fangji{
  margin-left: 20px;
}
.commonH{
  height: 25px;
  line-height: 25px;
}
.diet{
  margin-left: 70px;
  .Suggest{
    display: inline-block;
    height: 40px;
    line-height: 30px;
  }
  .tableList{
    // margin: 0 0 0 20px;
    .headPhoto{
      width: 150px;
      text-align: center;
    }
    tr{
      td,th{
        height: 40px;
        line-height: 25px;
        padding: 0 20px;
        border: 1px solid rgba(221, 221, 221, 1);
        text-align: left;
      }
      .tdCommom{
        text-align: center;
        width: 180px;
      }
      .tdSuggest{
        width: 280px;
        // text-overflow: ellipsis;
        white-space: wrap;
        // overflow: hidden;
      }
      .tdFood{
        width: 180px;
      }
    }
  }
}
.suggest{
  text-align: center;
  margin: 0 0 0 -60px;
}
.dietSuggest{
  margin-left: -70px;
  color: #606266
}
</style>
