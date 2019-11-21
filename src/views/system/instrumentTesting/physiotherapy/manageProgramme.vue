<template>
  <div id="programmeWrap">
    <el-form ref="programme" :model="Form" label-width="50px">
      <!-- 门店理疗方案 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="" style="width:80%;"><span class="commonCss">门店理疗方案：</span><br/>
            <div id="RecommendWrapper">
              <div class="Recommend">
                <el-button-group>
                  <el-button type="default" size="small" @click="addmedicine" icon="el-icon-plus" style="margin-bottom: 10px;">添加方案</el-button>
                </el-button-group>
                <v-table ref="medicine_Data" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="conditioningColumns" @on-custom-comp="customConditioning"
                :table-data="medicineData" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row>
        <el-form-item class="footer">
          <el-button size="middle" @click="submitForm" type="primary" icon="el-icon-check">返回列表</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      Form: {
        physiotherapy: [],
      },
      getListData: {
        name: '',
        physiotherapy_id: this.$route.query.id,
        pageIndex: 1,
        pageSize: '',
      },
      medicineData: [],   //  中医调理
      medicineName: [],
    };
  },
  components: {
    'uploadImg': uploadImg,
  },
  computed: {
    // 中医调理(添加方案)
    conditioningColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome1', title: '序号', width: 20, titleAlign: 'center', columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.getListData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'programme_name', title: '调理方案名称', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'programme_picurl', title: '展示图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'programme_price', title: '项目价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'editAndremove', isResize: true }
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
        if (item.field === 'programme_picurl') {
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
        if (item.field === 'programme_price') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              if (Number.isInteger(value)) {
                let double = parseFloat(value);
                value = double.toFixed(2);
              }
              return '<span style="color:red">' + value + '</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 自定义图片弹窗
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    // 添加方案
    addmedicine() {
      let _self  = this;
      // 关闭当前也并跳转新增方案页面
      let currentName = _self.$route.name;
      let currentTab = _self.visitedViews.find((x) => x.name === currentName);
      _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
        let query = _self.$route.query;
        query.from = _self.$route.name;
        query.id = _self.$route.query.id;
        if (query.id) {
          delete query.id;
        }
        _self.$router.push({
          path: '/instrumentTesting/physiotherapy/addProgramme',
          query: {
            id: _self.getListData.physiotherapy_id,
            name: _self.medicineName,
            tip: 1
          }
        });
      });
    },
    // 删除方案
    remove(id) {
      let _self = this;
      let param = {
        id: id,
      };
      ajax.get(`/api/borrow/DelPhysiotherapyStoreProgrammeInfoByid`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            type: 'success',
            message: '删除成功'
          });
        }
        _self.getListTable();
      });
    },
    // 中医调理
    customConditioning(params) {
      let _self = this;
      if (params.type === 'remove') {  // 删除
        _self.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.remove(params.rowData.programme_id);
          _self.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      else if (params.type === 'edit') {
        let _self = this;
        // 关闭当前也并跳转新增方案页面
        let currentName = _self.$route.name;
        let currentTab = _self.visitedViews.find((x) => x.name === currentName);
        _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
          let query = _self.$route.query;
          query.from = _self.$route.name;
          if (query.id) {
            delete query.id;
          }
          _self.$router.push({
            path: '/instrumentTesting/physiotherapy/editProgramme',
            query: {
              id: params.rowData.programme_id,
              name: _self.medicineName,
              tip: 0
            }
          });
        });
      }
    },
    // 获取列表信息
    getListTable() {
      let _self = this;
      let param = _self.getListData;
      ajax.get(`/api/borrow/GetPhysiotherapyStoreProgrammeInfo`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.medicineData = res.data.data;
          let medicineName = _self.medicineData.map(function(item, index, data) {
            return item.programme_name;
          });
          _self.medicineName = medicineName;
        }
      });
    },
    submitForm() {
      let _self  = this;
      // 关闭当前也并跳转列表页
      let currentName = _self.$route.name;
      let currentTab = _self.visitedViews.find((x) => x.name === currentName);
      _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
        let query = _self.$route.query;
        query.from = _self.$route.name;
        if (query.id) {
          delete query.id;
        }
        _self.$router.push({
          path: '/instrumentTesting/physiotherapy/physiotherapyList',
        });
      });
    },
  },
  created() {
    let _self = this;
    if (_self.$route.query) {
      _self.getListTable();
    }
    window.previewImg = this.previewImg;
  }
};
</script>

<style lang="less" scoped>
.footer{
  text-align: center;
  margin: 50px 0 50px -100px;
}
#allmap{width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
</style>
