<template>
  <div id="commodManage">
    <div class="search-wrapper">
      <el-form  ref="form_Data" :inline="true" :model="screenInfo" :rules="rules" size="small" >
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model.trim="screenInfo.name" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类:" prop="type">
          <el-select v-model="screenInfo.type" placeholder="请选择" clearable >
            <el-option label="全部" :value='""'></el-option>
            <el-option label="实体" :value='"Reality"'></el-option>
            <el-option label="虚拟" :value='"Virtual"'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条 形 码:" prop="bar_code">
            <el-input v-model.trim="screenInfo.bar_code" placeholder="请输入内容条形码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品状态:"  prop="status">
          <el-select v-model="screenInfo.status" placeholder="请选择">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="已上架" :value='"On"'></el-option>
            <el-option label="已下架" :value='"Off"'></el-option>
          </el-select>
        </el-form-item>
        <!-- <br> -->
        <el-form-item label="需要积分:" prop="min_integral">
          <el-input v-model.trim="screenInfo.min_integral" placeholder="请输入最小积分" style="display:inline-block;width:140px" clearable></el-input>
        </el-form-item>
        <span style="dispaly:inline-block;line-height:33px;">至 </span>
        <el-form-item label=" " prop="max_integral">
          <el-input v-model.trim="screenInfo.max_integral" placeholder="请输入最大积分" style="display:inline-block;width:140px" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addGrade">添加商品</el-button>
        <el-button type="default" size="small" icon="el-icon-success" @click="batchEnable">批量上架</el-button>
        <el-button type="default" size="small" icon="el-icon-error" @click="batchProhibit">批量下架</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="queryList">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex"
      :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 查看详情 -->
    <el-dialog title="优惠券详情" :visible.sync="proDetail" width="1000px" :center="true" :modal-append-to-body="false" class="details">
      <h2 class="commomH">优惠券信息</h2>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">优惠券名称：</span><i class="title">{{couponData.couponname}}</i></div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">使用范围：</span>商城商品</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">发行数量：</span>{{couponData.distributionquantity}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">优惠券券面：</span>{{couponData.sellername}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">使用群体：</span>{{couponData.accessiblegroup}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">有效时间：</span>{{couponData.usetimetype}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">规则描述：</span>{{couponData.ruledescription}}</div></el-col>
      </el-row>
      <h2 class="commomH">基本信息</h2>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">商品名称：</span>{{proDetailData.name}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">商品分类：</span>{{proDetailData.type == 'Virtual' ? '虚拟' : '实体'}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">商品规格：</span>{{proDetailData.specifications}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">商品库存：</span>{{proDetailData.stock}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">条 形 码 ：</span>{{proDetailData.bar_code}}</div></el-col>
      </el-row>
      <h2 class="commomH">前端展示</h2>
      <el-row>
        <el-col :span="6"><div class="grid-content bg-purple"><span class="strong1">全积分：</span>{{proDetailData.integral}}</div></el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple1"><span class="strong1 img">商品图片：</span>
            <img style="width:50px;height:50px;" :src="proDetailData.icon" alt="">
          </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"><span class="strong1">商品标价：</span>{{proDetailData.original_price}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"><span class="strong1">前端排序：</span>{{proDetailData.sort}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="strong">商品描述：</span>{{proDetailData.desc}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple"><span class="strong">商品详情：</span><div v-html="proDetailData.detail"></div></div></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    // 全积分
    let validateIntegral = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内，大于0的正整数'));
        }
      } else {
        return callback(new Error('请输入10位数以内，大于0的正整数'));
      }
    };
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        name: '',
        type: '',
        status: '',
        bar_code: '',
        min_integral: '',
        max_integral: '',
        pageSize: 10,
        pageIndex: 1,
      },
      rules: {
        max_integral: [{ required: false, validator: validateIntegral, trigger: 'blur' }],
        min_integral: [{ required: false, validator: validateIntegral, trigger: 'blur' }],
        name: [{ required: false, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: false, message: '请选择分类', trigger: 'blur' }],
        status: [{ required: false, message: '请选择状态', trigger: 'blur' }],
        bar_code: [{ required: false, message: '请输入条形码', trigger: 'blur' }],
      },
      statusData: '',
      couponData: '',
      proDetail: false,
      proDetailData: '',
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 50, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'name', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'type', title: '商品分类', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'integral', title: '全积分', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'original_price', title: '商品标价', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'exchange_quantity', title: '已兑换数', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'stock', title: '库存', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'specifications', title: '商品规格', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'bar_code', title: '条形码', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sort', title: '前端排序', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '商品状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-integralManage', isResize: true },
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
        if (item.field === 'stock' || item.field === 'integral' || item.field === 'exchange_quantity') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return value;
            } else {
              return 0;
            }
          };
        }
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'Reality') {
              return '实体';
            } else {
              return '虚拟';
            }
          };
        }
        if (item.field === 'original_price') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return '<span style="color:red;">' + value + ' 元</span>';
            } else {
              return '<span style="color:red;">' + 0 + ' 元</span>';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 'On') {
              return '<span style="color:green;">上架</span>';
            } else {
              value = 'Off';
              return '<span style="color:red;">下架</span>';
            }
          };
        }
      }
      return columns;
    }
  },
  methods: {
    // 添加商品
    addGrade() {
      this.$router.push('/integralManage/addCommod');
    },
    clean() {
      this.screenInfo.name = '';
      this.screenInfo.type = '';
      this.screenInfo.status = '';
      this.screenInfo.bar_code = '';
      this.screenInfo.min_integral = '';
      this.screenInfo.max_integral = '';
      this.gettable();
    },
    queryList() {
      this.screenInfo.pageIndex = 1;
      this.clean();
    },
    query() {
      let value = this.screenInfo.min_integral;
      let value2 = this.screenInfo.max_integral;
      if (value && value2) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value) && reg.test(value2)) {
          this.screenInfo.pageIndex = 1;
          this.gettable();
        } else {
          this.$alert('请输入10位数以内，大于0的正整数', '提示', {
            confirmButtonText: '确定',
          });
        }
      } else if (value || value2) {
        this.$alert('请输入10位数以内，大于0的正整数', '提示', {
          confirmButtonText: '确定',
        });
      } else {
        this.screenInfo.pageIndex = 1;
        this.gettable();
      }
    },
    // 批量上架
    batchEnable() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将上架选中的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let onArr = this.selection.map(function(item, index, data) {
            return item.status;
          });
          for (let i in onArr) {
            if (onArr[i] !== 'On') {
              this.statusData = 'On';
              let idList = [];
              for (let item of this.selection) {
                idList.push(item.id);
              }
              this.upDownManage(idList.join(','));
            } else {
              this.$message({
                type: 'warning',
                message: '选中的数据已经上架'
              });
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else {
        this.$alert('请选择上架的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 批量下架
    batchProhibit() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将下架选中的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let downArr = this.selection.map(function(item, index, data) {
            return item.status;
          });
          for (let i in downArr) {
            if (downArr[i] !== 'Off') {
              this.statusData = 'Off';
              let idList = [];
              for (let item of this.selection) {
                idList.push(item.id);
              }
              this.upDownManage(idList.join(','));
            } else {
              this.$message({
                type: 'warning',
                message: '选中的数据已经下架'
              });
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else {
        this.$alert('请选择下架的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.id);
          }
          this.remove(idList.join(','));
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
    // 删除
    remove(data) {
      let param = {
        id: data,
      };
      ajax.get(`/api/integral/DelIntegralProInfoByid`, { params: param }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.gettable();
        }
      });
    },
    // 上下架管理
    upDownManage(data) {
      let _self = this;
      let param = {
        status: _self.statusData,
        id: data.toString(),
      };
      ajax.get(`/api/integral/OnOffIntegralProInfoByid`, { params: param }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.gettable();
        }
      });
    },
    customCompFunc(params) {
      let _self = this;
      if (params.type === 'edit') {  // 编辑
        this.$router.push('/integralManage/editCommod?id=' + params.rowData.id);
      } else if (params.type === 'up') { // 上架
        if (params.rowData.status !== 'On') {
          this.$confirm('是否上架: ( ' + params.rowData.name + '  ) 这条数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.statusData = 'On';
            this.upDownManage(params.rowData.id.toString());
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消上架'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '该数据已上架'
          });
        }
      } else if (params.type === 'down') { //  下架
        if (params.rowData.status !== 'Off') {
          this.$confirm('是否下架: ( ' + params.rowData.name + '  ) 这条数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.statusData = 'Off';
            this.upDownManage(params.rowData.id.toString());
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下架'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '该数据已下架'
          });
        }
      } else if (params.type === 'delete') {  // 删除
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.id.toString());
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'look') {
        let id = params.rowData.id;
        ajax.get(`/api/integral/GetIntegralProInfoByid?id=` + id).then(res => {
          if (res.status === 200 && res.data.code === 0) {
            _self.proDetailData = res.data.data;
            if (_self.proDetailData.coupondto.length !== 0) {
              _self.couponData = _self.proDetailData.coupondto[0];
            }
            _self.proDetail = true;
          } else {
            return false;
          }
        });
      }
    },
    // 获取列表
    gettable() {
      let param = this.screenInfo;
      ajax.get(`/api/integral/GetIntegralProInfo`, { params: param }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.recordscount;
        }
      });
    },
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.gettable();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.gettable();
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
    this.gettable();
  }
};
</script>

<style lang="less" scoped>
.details {
  /deep/ .el-dialog--center{
    padding: 0 20px;
    box-sizing: border-box;
  }
  .commomH{
    height: 60px;
    line-height: 60px;
  }
  .grid-content {
    line-height: 35px;
  }
  .strong{
    font-weight: bold;
  }
  .strong1{
    display: inline-block;
    font-weight: bold;
    line-height: 80px;
  }
  .bg-purple1{
    height: 50px;
    line-height: 50px;
  }
  .img{
    margin-top: -10px;
  }
}

</style>
