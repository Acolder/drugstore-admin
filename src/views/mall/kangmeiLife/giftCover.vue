<template>
  <div id="giftCoverWrap">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addCover">新 增</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="cleanCover">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="queryList">刷 新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="coverData.pageSize" :page-index="coverData.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  新增 编辑 -->
    <el-dialog :title="title" :visible.sync="addData" width="550px" :center="true" :modal-append-to-body="false" :append-to-body="true" class="details" @close="close">
      <el-form ref="addData" :model="addForm" :rules="addRules" :inline="true" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="封面小图：" :prop="'image2'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}">
              <uploadImg :imgUrl="addForm.image2" :fileName="'1'" @uploadSuccess="uploadImgMain" @removeImg="removeImgMain" class="upImg1"></uploadImg>
              <el-input class="left" type="hidden" v-model="addForm.image2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="封面大图：" :prop="'image1'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}">
              <uploadImg :imgUrl="addForm.image1" :fileName="'2'" @uploadSuccess="uploadImgMain1" @removeImg="removeImgMain1" class="upImg1"></uploadImg>
              <el-input class="left" type="hidden" v-model="addForm.image1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="封面排序："  prop="sort" class="line">
              <el-input v-model.number="addForm.sort" placeholder="请输入封面排序" clearable style="width: 290px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否显示：" prop="isShow">
              <el-radio-group v-model="addForm.isShow">
                <el-radio :label='1'>是</el-radio>
                <el-radio :label='0'>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="赠言：" prop="code">
              <el-input type="textarea"  :rows="4" v-model="addForm.code" style="width: 290px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="form-button-wrapper">
          <el-button @click="cancel" icon="el-icon-circle-close-outline" size="small">取消</el-button>
          <el-button @click="save" type="primary" icon="el-icon-check" size="small">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import java from '@/utils/javaApiRequest';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      coverData: {
        code: '',
        pageIndex: 1,
        pageSize: 10,
      },
      title: '',
      addData: false,
      addForm: {
        image2: '',
        image1: '',
        sort: '',
        isShow: 1,
        code: '',
      },
      addRules: {
        sort: [{ required: true, message: '请输入封面排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
      }
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.coverData.pageIndex - 1) * _self.coverData.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'id', title: '封面编号', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'image2', title: '封面小图', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'image1', title: '封面大图', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'code', title: '赠言', width: 220, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '排序', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isShow', title: '是否显示', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 120, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-doctorCategoryList', isResize: true },
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
        if (item.field === 'image2') {
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
        if (item.field === 'image1') {
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
        if (item.field === 'isShow') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return '是';
            } else {
              return '否';
            }
          };
        }
      }
      return columns;
    }
  },
  components: {
    'uploadImg': uploadImg,
  },
  watch: {
    'addForm.isShow': function() {
      if (this.addForm.isShow === '1') {
        this.addForm.isShow = 1;
      } else if (this.addForm.isShow === '0') {
        this.addForm.isShow = 0;
      }
    },
  },
  methods: {
    previewImg(url) { // 自定义弹窗
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    // 上传小图
    uploadImgMain(data, imgUrl) {
      this.addForm.image2 = imgUrl;
    },
    // 删除小图
    removeImgMain(url) {
      this.addForm.image2 = url;
    },
    // 上传大图
    uploadImgMain1(data, imgUrl) {
      this.addForm.image1 = imgUrl;
    },
    // 删除大图
    removeImgMain1(url) {
      this.addForm.image1 = url;
    },
    close() {
      this.cancel();
      this.getTableList();
    },
    // 新增
    addCover() {
      this.addData = true;
      this.title = '新增封面';
    },
    // 刷新
    queryList() {
      this.getTableList();
    },
    cancel() {
      this.addData = false;
      this.addForm.image1 = '';
      this.addForm.image2 = '';
      this.addForm.sort = '';
      this.addForm.isShow = 1;
      this.addForm.code = '';
    },
    // 提交确认
    save() {
      let _self = this;
      let param = _self.addForm;
      let url;
      if (_self.title === '新增封面') {
        url = `/mall_manage/back/insertPackageCover`;
      } else {
        url = `/mall_manage/back/updatePackageCover`;
      }
      _self.$refs['addData'].validate((valid) => {
        if (valid) {
          java.post(url, param).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                type: 'success',
                message: '提交成功'
              });
              _self.cancel();
              _self.getTableList();
            } else {
              return false;
            }
          });
        }
        else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    // 获取列表
    getTableList() {
      let _self = this;
      let param = _self.coverData;
      java.post(`/mall_manage/back/queryPackageCoverList`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    // 删除
    remove(ids) {
      let param;
      if (Array.isArray(ids) === true) {
        param = {
          ids: ids.join(',')
        };
      } else {
        param = {
          ids: ids
        };
      }
      java.post(`/mall_manage/back/deletePackageCover`, param).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableList();
        }
      });
    },
    // 批量删除
    cleanCover() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id);
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
    customCompFunc(param) {
      if (param.type === 'remove') {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(param.rowData.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (param.type === 'edit') {
        this.addData = true;
        this.title = '修改封面';
        this.addForm = param.rowData;
        this.addForm.sort = Number(param.rowData.sort);
        if (!param.rowData.isShow) {
          this.addForm.isShow = '';
        }
      }
    },
    pageChange(pageIndex) {
      this.coverData.pageIndex = pageIndex;
      this.getCustomerData();
    },
    pageSizeChange(pageSize) {
      this.coverData.pageIndex = 1;
      this.coverData.pageSize = pageSize;
      this.getCustomerData();
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    }
  },
  created() {
    this.getTableList();
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
.form-button-wrapper{
  width: 100%;
  text-align: center;
}
</style>
