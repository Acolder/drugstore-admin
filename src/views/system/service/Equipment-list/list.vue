<template>
  <div class="lsit">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="Mac编码：">
          <el-input v-model="searchInfo.mac" placeholder="请输入mac编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备状态：">
          <el-select v-model="searchInfo.status">
            <el-option label="正常" value="0"></el-option>
            <el-option label="报修" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
            <el-option label="全部" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="借还状态：">
          <el-select v-model="searchInfo.ex_status">
            <el-option label="未借出" value="0"></el-option>
            <el-option label="已借出" value="1"></el-option>
            <el-option label="全部" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备去处：">
          <el-input v-model="searchInfo.give" placeholder="请输入设备去处" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="searchInfo.contacts" placeholder="请输入联系人" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="searchInfo.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          <el-button type="primary" @click="exportActive">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button icon="el-icon-plus" size="small" @click="addPeople">脉诊仪</el-button>
        <el-button icon="el-icon-upload2" size="small" @click="toUpdate">批量导入</el-button>
        <el-button icon="el-icon-delete" size="small" @click="allDelete">批量删除</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 新增编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="editShow"
      width="480px"
      center
      top="15vh"
      :modal-append-to-body="false"
      @close="clsoeActive">
      <el-form :model="editData" ref="editForm" size="small"  label-width="130px" :rules="rules">
        <el-form-item label="Mac编码：" prop="mac">
          <el-input v-model.trim="editData.mac" placeholder="请输入Mac编码"></el-input>
        </el-form-item>
        <el-form-item label="货品型号：" prop="model">
          <el-select v-model.number.trim="editData.model" placeholder="请选择" class="select-list">
            <el-option label="基础版" :value="0"></el-option>
            <el-option label="皮套版" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态：" prop="status">
          <el-select v-model.number.trim="editData.status" placeholder="请选择" class="select-list">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="报修中" :value="1"></el-option>
            <el-option label="已停用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="借还状态：" prop="ext_status">
          <el-select v-model.number.trim="editData.ext_status" placeholder="请选择" class="select-list">
            <el-option label="未借出" :value="0"></el-option>
            <el-option label="已借出" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货品入库备注：">
          <el-input v-model.trim="editData.add_remark" placeholder="请输入库备注"></el-input>
        </el-form-item>
        <el-form-item label="货品验收结果：" prop="check_status">
          <el-select v-model.number.trim="editData.check_status" placeholder="请选择" class="select-list">
            <el-option label="合格" :value="0"></el-option>
            <el-option label="不合格" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="验收备注：">
          <el-input v-model.trim="editData.check_remark" placeholder="请输验收备注"></el-input>
        </el-form-item>
        <el-form-item label="设备去处：" prop="give">
          <el-input v-model.trim="editData.give" placeholder="请输入设备去处"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="contact">
          <el-input v-model.trim="editData.contact" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model.trim="editData.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取消</el-button>
        <el-button type="primary" @click="save" v-if="title === '新增脉诊仪'">新增</el-button>
        <el-button type="primary" @click="saveEdit" v-if="title === '修改脉诊仪'">保存修改</el-button>
      </span>
    </el-dialog>
    <!-- 脉诊仪详情 -->
    <el-dialog
      title="设备信息详情"
      :visible.sync="detailShow"
      width="480px"
      center
      top="20vh"
      :modal-append-to-body="false">
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>Mac编码：</span>
          <span class="rights">{{detailData.mac}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>货品型号：</span>
          <span class="rights">{{detailData.model === 0 ? '基础版' : '皮套版'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>设备状态：</span>
          <span class="rights">{{detailData.status === 0 ? '正常' : detailData.status === 1 ? '报修中': '已停用'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>货品入库备注：</span>
          <span class="rights">{{detailData.add_remark}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>货品验收结果：</span>
          <span class="rights">{{detailData.check_status === 0 ? '合格' : '不合格'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>验收备注：</span>
          <span class="rights">{{detailData.check_remark}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>设备去处：</span>
          <span class="rights">{{detailData.give}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>联系人：</span>
          <span class="rights">{{detailData.contact}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="col-wrap">
          <span>联系电话：</span>
          <span class="rights">{{detailData.phone}}</span>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 导入设备 -->
    <el-dialog
      title="导入设备信息"
      :visible.sync="exportShow"
      width="480px"
      center
      top="35vh"
      :modal-append-to-body="false">
      <cs :fileName="Noncestr" @closeAction="closeAction"></cs>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import cs from '@/components/import/cs';
export default {
  data() {
    return {
      exportData: '',
      Noncestr: 'upload',
      exportShow: false,
      searchInfo: {
        mac: '', // mac编码
        status: '-1', // 设备状态
        ex_status: '-1', // 借还状态
        give: '', // 去处
        contacts: '', // 联系人
        phone: '', // 联系电话
        pageSize: 10,
        pageIndex: 1
      },
      tableData: [],
      columns: this.getColumns(),
      total: 0,
      title: '',
      editShow: false,
      editData: {
        mac: '', // mac地址
        model: '', // 货品型号
        status: '', // 设备状态
        add_remark: '', // 入库备注
        check_status: '', // 验收结果
        check_remark: '', // 验收备注
        give: '', // 设备去处
        contact: '', // 联系人
        phone: '', // 联系电话
        ext_status: '', // 借还状态
      },
      detailShow: false,
      detailData: {},
      selection: [],
      // name: ''
      rules: {
        mac: [{ required: true, message: '请输入Mac编码', trigger: 'blur' }],
        model: [{ required: true, message: '请选择货品型号', trigger: 'change' }],
        status: [{ required: true, message: '请选择设备状态', trigger: 'change' }],
        check_status: [{ required: true, message: '请选择验收结果', trigger: 'change' }],
        ext_status: [{ required: true, message: '请选择借还状态', trigger: 'change' }],
        give: [{ required: true, message: '请输入设备去处', trigger: 'blur' }],
        contact: [{ required: true, validator: this.validPassword, trigger: 'blur' }],
        // phone: [{ required: false, validator: this.validPhone, trigger: 'blur' }],
      }
    };
  },
  components: {
    'cs': cs
  },
  methods: {
    // 导出
    exportActive() {
      let mac = this.exportData.mac;
      let status = this.exportData.status;
      let ex_status = this.exportData.ex_status;
      let give = this.exportData.give;
      let contact = this.exportData.contact;
      let phone = this.exportData.phone;
      window.open(`${process.env.BASE_HOST}/api/jinmu/GetDeviceExeclData?mac =` + mac + '&status=' + status + '&ex_status=' + ex_status + '&give=' + give + '&contact=' + contact + '&phone=' + phone);
    },
    // 搜索
    query() {
      this.searchInfo.pageIndex = 1;
      this.getListData();
    },
    // 手机号正则
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入电话号码'));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    },
    // 姓名验证
    isvalidPassword(str) {
      const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
      return reg.test(str);
    },
    validPassword(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入联系人'));
      } else if (!this.isvalidPassword(value)) {
        callback(new Error('请输入正确的联系人'));
      } else {
        callback();
      }
    },
    closeAction() {
      this.exportShow = false;
      this.getListData();
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 20,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageIndex - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'mac', title: 'Mac编码', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'model', title: '货品型号', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '设备状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'ext_status', title: '借还状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'check_status', title: '验收状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'created_time', title: '创建时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'give', title: '设备去处', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'contact', title: '联系人', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'phone', title: '联系电话', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 400, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operations-equipment', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          // console.log(rowData[field]);
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'model') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '基础版';
            } else if (value === 1) {
              return '皮套版';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'check_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '合格';
            } else if (value === 1) {
              return '不合格';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green">正常</span>';
            } else if (value === 1) {
              return '<span style="color:red">报修中</span>';
            } else if (value === 2) {
              return '<span style="color:red">已停用</span>';
            }
          };
        }
        if (item.field === 'ext_status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return `<span style="color:green;">未借出</span>`;
            } else if (value === 1) {
              return `<span style="color:red;">已借出</span>`;
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'see') { // 查看
        this.detailShow = true;
        this.getDetail(param.rowData.id);
      } else if (param.type === 'deleteRow') {
        this.$confirm('此操作将永久删除该脉诊仪, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = [param.rowData.id];
          this.deleteRow(arr);
        });
      } else if (param.type === 'repair') { // 报修
        // this.setStata(param.rowData.id, 0);
        this.$confirm('此操作将报修脉诊仪, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            id: param.rowData.id,
            status: 1
          };
          ajax.post('/api/jinmu/UpdateDeviceStatus', obj).then(res => {
            if (res.data.code === 0 && res.status === 200) {
              this.$message.success(res.data.message);
              this.getListData();
            }
          });
        });
      } else if (param.type === 'edit') {
        this.title = '修改脉诊仪';
        this.editData = {
          mac: param.rowData.mac, // mac地址
          model: param.rowData.model, // 货品型号
          status: param.rowData.status, // 设备状态
          add_remark: param.rowData.add_remark, // 入库备注
          check_status: param.rowData.check_status, // 验收结果
          check_remark: param.rowData.check_remark, // 验收备注
          give: param.rowData.give, // 设备去处
          contact: param.rowData.contact, // 联系人
          phone: param.rowData.phone, // 联系电话
          ext_status: param.rowData.ext_status, // 借还状态
          id: param.rowData.id, // 主键id
        };
        this.editShow = true;
      } else if (param.type === 'useLog') {
        console.log(param);
        this.$router.push({
          name: 'useLog',
          query: {
            mac: param.rowData.mac,
            model: param.rowData.status,
            created_time: param.rowData.created_time
          }
        });
      }
    },
    setStata(id, state) {
      let obj = {
        id: id,
        state: state
      };
      ajax.post('/api/admin/UpdateSpreadStateById', obj).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message({
            type: 'success',
            message: '成功!'
          });
          this.getListData();
        }
      });
    },
    pageChange(pageIndex) {
      this.searchInfo.pageIndex = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = pageSize;
      this.getListData();
    },
    // 全选反选
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    clean() {
      this.searchInfo.mac = '';
      this.searchInfo.status = '-1';
      this.searchInfo.ex_status = '-1';
      this.searchInfo.give = '';
      this.searchInfo.contacts = '';
      this.searchInfo.phone = '';
      this.getListData();
    },
    // 新增
    addPeople() {
      this.editShow = true;
      this.title = '新增脉诊仪';
    },
    // 新增保存
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/jinmu/AddDevice', this.editData).then(res => {
            this.editShow = false;
            if (res.data.code === 0 && res.status === 200) {
              this.$message.success(res.data.message);
              this.getListData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 修改保存
    saveEdit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          ajax.post('/api/jinmu/UpdateDevice', this.editData).then(res => {
            this.editShow = false;
            if (res.data.code === 0 && res.status === 200) {
              this.$message.success(res.data.message);
              this.getListData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗
    clsoeActive() {
      this.editData = {};
      this.$refs['editForm'].resetFields();
    },
    // 批量删除
    allDelete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久选择的删除脉诊仪, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = [];
          for (let item of this.selection) {
            data.push(item.id);
          }
          this.deleteRow(data);
        });
      } else {
        this.$message.warning('请选择要删除的数据');
      }
    },
    // 多条或单条删除
    deleteRow(arr) {
      ajax.post('/api/jinmu/DeleteDevices', arr).then(res => {
        if (res.data.code === 0 && res.status === 200) {
          this.$message.success(res.data.message);
          this.getListData();
        }
      });
    },
    // 获取详情
    getDetail(id) {
      ajax.get('/api/jinmu/GetDeviceInfo/' + id).then(res => {
        console.log(res);
        if (res.data.code === 0 && res.status === 200) {
          this.detailData = res.data.data;
        }
      });
    },
    toUpdate() {
      // let url = `${process.env.BASE_HOST}/api/admin/ExportSpreadInfo?pageIndex=1&pageSize=10&name=` + this.name;
      // window.open(`${process.env.BASE_HOST}/api/admin/ExportSpreadAll`);
      // window.open(url);
      this.exportShow = true;
    },
    getListData() {
      this.exportData = this.searchInfo;
      ajax.post('/api/jinmu/GetDevicePageList', this.searchInfo).then(res => {
        console.log(res);
        if (res.data.code === 0 && res.status === 200) {
          this.tableData = res.data.data.details;
          this.total = res.data.data.rcounr;
          console.log(this.total);
        }
      });
    }
  },
  created() {
    this.getListData();
  }
};
</script>

<style lang="less" scoped>
.select-list{
  width: 300px;
}
.col-wrap{
  padding: 5px 100px;
  span{
    &:nth-child(1){
      width: 100px;
      text-align: right;
      display: inline-block;
    }
  }
  .rights{
    margin-left: 20px;
  }
}
</style>
