<template>
  <div id="cardList">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addClass">新增议堂</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!--  查看详情  -->
    <el-dialog title="议堂详情" :visible.sync="talkHallShow" :modal-append-to-body="false" :append-to-body="true" width="1000px" center>
      <el-form :model="formData" size="small" label-width="100px">
        <el-form-item label="分类名称:" prop="title" class="source" >
          <el-input v-model="formData.title" readonly></el-input>
        </el-form-item>
        <el-form-item label="分类排序:" prop="sort" class="source">
          <el-input v-model="formData.sort" readonly></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="is_show">
          <el-radio-group v-model="formData.is_show">
            <el-radio :label=1>是</el-radio>
            <el-radio :label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="详情里的配图:" :prop="'detail_images'">
          <uploadImg v-if="formData.detail_images" :imgUrl="formData.detail_images" :fileName="'detail_images'" class="img"></uploadImg>
        </el-form-item>
        <el-form-item label="描述:" prop="description" class="source">
          <el-input type="textarea" rows="5" v-model="formData.description" readonly></el-input>
        </el-form-item>
        <el-form-item label="配图:" :prop="'images'">
          <uploadImg v-if="formData.images" :imgUrl="formData.images" :fileName="'images'" class="img"></uploadImg>
        </el-form-item>
        <!-- 修身法宝 -->
        <el-form-item label="修身法宝"><span readonly style="color:red"></span><br/>
          <div id="soupWrap">
            <div class="Recommend">
              <v-table ref="subdata_table" column-width-drag :is-horizontal-resize="true" style="width:700px" :columns="pruductsColumns"
              :table-data="productData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
            </div>
          </div>
        </el-form-item>
        <!-- 坐堂医生 -->
        <el-form-item label="坐堂医生"><span readonly style="color:red"></span><br/>
          <div id="soupWrap">
            <div class="Recommend">
              <el-tag
                :key="tag"
                v-for="tag in tags"
                :disable-transitions="false"
                class="tag">
                {{tag}}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      talkHallShow: false,
      formData: {
        name: '',
        sort: '',
        description: '',
        images: '',
        test_description: '',
        test_link: '',
        test_operate: '',
        show: ''
      },
      productData: [],
      tags: [],
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'title', title: '分类名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'sort', title: '展示排序', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'is_show', title: '是否显示', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'tb-edit-detail-delete', isResize: true },
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
        if (item.field === 'is_show') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === true) {
              return '是';
            } else {
              return '否';
            }
          };
        }
      }
      return columns;
    },
    pruductsColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '排序', width: 20, titleAlign: 'center', columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'product_name', title: '药品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'news_title', title: '药品介绍', width: 250, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
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
      }
      return columns;
    },
  },
  components: {
    'uploadImg': uploadImg,
  },
  methods: {
    query() {
      this.getTable();
    },
    addClass() {
      this.$router.push('/cardManage/talkHall/addTalkHall');
    },
    // 删除议堂
    remove(id) {
      ajax.get(`/api/news/DelPostSectionInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTable();
        }
      });
    },
    customCompFunc(params) {
      if (params.type === 'remove') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.section_id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // 编辑
        this.$router.push({
          path: '/cardManage/talkHall/editTalkHall',
          query: {
            id: params.rowData.section_id,
          }
        });
      } else if (params.type === 'detail') {  // 查看详情
        this.getDetail(params.rowData.section_id);
      }
    },
    // 获取详情
    getDetail(id) {
      ajax.get(`/api/news/GetPostSectionInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          console.log(res);
          this.talkHallShow = true;
          this.formData = res.data.data;
          if (this.formData.test_operate === '0') {
            this.formData.test_operate = 0;
          } else {
            this.formData.test_operate = 1;
          }
          if (this.formData.doctor) {
            ajax.get(`/api/news/GetPostUserRoleInfoByid?id=` + this.formData.doctor).then((res) => {
              if (res.status === 200 && res.data.code === 0) {
                if (res.data.data) {
                  this.tags = res.data.data.role_type_name.split(',');
                }
              }
            });
          }
          if (this.formData.sectionproductdto.length !== 0) {
            this.productData = this.formData.sectionproductdto;
          }
          if (this.formData.is_show === true) {
            this.formData.is_show = 1;
          } else {
            this.formData.is_show = 0;
          }
        }
      });
    },
    // 获取列表
    getTable() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.get(`/api/news/GetPostSectionInfo`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTable();
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
    this.getTable();
  }
};
</script>

<style lang="less" scoped>
.source{
  width: 80%;
}
/deep/ .img .el-tag__close {
  display: none;
}
</style>
