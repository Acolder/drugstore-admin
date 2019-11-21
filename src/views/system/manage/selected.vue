<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="版本号：">
          <el-input v-model.trim="screenInfo.Version" placeholder="请输入版本号（例：v1.0）" clearable></el-input>
        </el-form-item>
        <el-form-item label="专题类别：">
              <el-select v-model="screenInfo.AdvertinsingType" clearable style="width: 260px">
                <el-option v-for="item in TopicCategorySelected" :key="item.value" :value="item.value" :label="item.text"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="发布渠道：">
          <el-select v-model="targetSelect" multiple clearable style="width: 250px">
            <el-option v-for="item in publishtargetSelected" :key="item.value" :value="item.value" :label="item.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <span class="version_tip" icon="el-icon-info"><em>注释:</em> 药品专题版本号v3.0对应药葫芦v4.0.0</span>
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :pageIndex="screenInfo.pageIndex" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>
.version_tip{
  float: left;
  color:#aaa;
  font-size: 15px;
  em{
    color:red;
  }
}
</style>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      sidebarValue: this.sidebarStatus,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      TopicCategorySelected: [
        { value: '91', text: '全部' },
        { value: '2', text: '商城专题' },
        { value: '14', text: '快送专题' },
      ],
      targetSelect: [],
      publishtargetSelected: [
        { value: '1', text: 'app' },
        { value: '2', text: 'h5' },
        { value: '3', text: '小程序' },
      ],
      screenInfo: {
        AdvertinsingType: '91',
        pageIndex: 1,
        pageSize: 10,
        Version: ''
      }
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 30, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        // { field: 'category', title: '专题分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'title', title: '专题名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'picturepath', title: '专题图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '排序', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'bannercategory', title: '专题类别', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'publishtarget', title: '发布渠道', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'version', title: '版本号', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createtime', title: '创建时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-drug', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value !== '' && value !== null && value !== 'undefined') {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'bannercategory') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 2) {
              return '商城专题';
            }
            if (value === 14) {
              return '快送专题';
            }
          };
        }
        if (item.field === 'publishtarget') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return 'app';
            } else if (value === '2,1') {
              return 'h5 app';
            } else if (value === '1,2') {
              return 'app h5';
            } else if (value === '2') {
              return 'h5';
            } else if ((value === '1,2,3') || (value === '1,3,2') || (value === '2,1,3') || (value === '2,3,1') || (value === '3,2,1') || (value === '3,1,2')) {
              return 'app h5 小程序';
            } else if ((value === '1,3') || (value === '3,1')) {
              return 'app 小程序';
            } else if ((value === '2,3') || (value === '3,2')) {
              return 'h5 小程序';
            }
          };
        }
        if (item.field === 'picturepath') {
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
    // 处理精选好药分类
    // getClass(ify) {
    //   let a = '';
    //   switch (ify)
    //   {
    //     case '1':
    //       a = '康美精品';
    //       break;
    //     case '2':
    //       a = '美容养颜';
    //       break;
    //     case '3':
    //       a = '当季常备';
    //       break;
    //     case '4':
    //       a = '其他专题';
    //       break;
    //   }
    //   return a;
    // },
    // 处理时间格式
    conversionTime(tim) {
      let d = new Date(tim);
      let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return datetime;
    },
    // 获取精选好药数据
    getTableData() {
      let _self = this;
      ajax.post('/api/admin/getBannerList', _self.screenInfo).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.total = res.data.recordscount;
          _self.tableData = res.data.data;
          _self.tableData = _self.tableData.map(item => {
            return {
              // category: this.getClass(item.category),
              categoryname: item.categoryname,
              createtime: item.createtime ? this.conversionTime(item.createtime) : '',
              picturepath: item.picturepath,
              sort: item.sort,
              id: item.id,
              pictureurl: item.pictureurl,
              title: item.title,
              version: item.version,
              publishtarget: item.publishtarget,
              bannercategory: item.bannercategory,
            };
          });
        }
      });
    },
    // 清除
    clean() {
      this.screenInfo.Version = '';
      this.screenInfo.AdvertinsingType = '91'; // 轮播图类别默认值
      this.targetSelect = []; // 发布渠道默认值
      this.screenInfo.publishtarget = '';
      this.getTableData();
    },
    // 查询
    query() {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.publishtarget = this.targetSelect.join(',');
      if (this.screenInfo.AdvertinsingType === '') {
        this.screenInfo.AdvertinsingType = '91';
      }
      this.getTableData();
    },
    // 刷新
    refresh() {
      this.screenInfo.AdvertinsingType = '91'; // 轮播图类别默认值
      this.targetSelect = []; // 发布渠道默认值
      this.getTableData();
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该专题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove([params.rowData.id.toString()]);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation
        this.modify(params.rowData.id);
      }
    },
    // 全选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 新增
    add() {
      this.$router.push('/manage/addSelectedInfo?pageIndex=' + this.screenInfo.pageIndex + '&pageSize=' + this.screenInfo.pageSize + '&AdvertinsingType=' + this.screenInfo.AdvertinsingType + '&version=' + this.screenInfo.Version);
    },
    // 删除
    remove(ids) {
      let _self = this;
      ajax.post('api/admin/deleteBanner', ids).then(res => {
        if (res.status === 200 && res.data.code === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
        }
        _self.query();
      });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该专题, 是否继续?', '提示', {
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
    // 修改分类
    modify(id) {
      this.$router.push('/manage/modifySelectedInfo?id=' + id + '&pageIndex=' + this.screenInfo.pageIndex + '&pageSize=' + this.screenInfo.pageSize + '&AdvertinsingType=' + this.screenInfo.AdvertinsingType + '&version=' + this.screenInfo.Version);
    },
    // 分页
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTableData();
    }
  },
  created() {
    if (this.$route.query.pageIndex) {
      this.screenInfo.pageIndex = Number(this.$route.query.pageIndex);
    }
    if (this.$route.query.pageSize) {
      this.screenInfo.pageSize = Number(this.$route.query.pageSize);
    }
    if (this.$route.query.version) {
      this.screenInfo.Version = this.$route.query.version;
    }
    if (this.$route.query.AdvertinsingType) {
      this.screenInfo.AdvertinsingType = this.$route.query.AdvertinsingType;
    }
    this.getTableData();
    window.previewImg = this.previewImg;
  }
};
</script>
