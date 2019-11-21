<template>
  <div id="raredrug-list">
    <div class="search-wrapper">
      <el-form :inline="true" :model="raredrugData" size="small" >
        <el-form-item label="是否回访:">
          <el-select v-model="raredrugData.screenInfo.isReply" placeholder="请选择" clearable >
              <el-option
                v-for="item in raredrugData.raredrugOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByOrder" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" @click="Delete" icon="el-icon-delete">批量删除</el-button>
        <el-button type="default" size="small" @click="Export">全部导出</el-button>
      </el-button-group>
    </div>
    <!-- 填写回访记录 -->
    <el-dialog title="回访记录" @close="visiClose" :visible.sync="visibleShow" :modal-append-to-body="false" width="30%" center>
      <el-form :model="visitData" ref="ruleForm" :rules="rules" size="small"  label-width="130px">
        <el-form-item label="最快用药时间：" prop="firstdrugusetime">
          <el-date-picker
            v-model="visitData.firstdrugusetime"
            type="datetime"
            placeholder="选择最快用药时间"
            default-time="12:00:00"
            style="width:100%"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最晚用药时间：" prop="lastdrugusetime">
          <el-date-picker
            v-model="visitData.lastdrugusetime"
            type="datetime"
            placeholder="选择最晚用药时间"
            default-time="12:00:00"
            style="width:100%"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用药人年龄：" prop="userage">
            <el-input v-model="visitData.userage" placeholder="请输入用药人年龄"></el-input>
        </el-form-item>
        <el-form-item label="用药人性别：" prop="usergender">
          <el-select v-model="visitData.usergender" clearable placeholder="请选择用药人性别" style="width:100%">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货人姓名：" prop="receivername">
          <el-input v-model="visitData.receivername" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址：" prop="receiveraddress">
          <el-input v-model="visitData.receiveraddress" placeholder="请输入收货人地址"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话：" prop="receivermobile">
          <el-input v-model="visitData.receivermobile" placeholder="请输入收货人电话"></el-input>
        </el-form-item>
        <el-form-item label="其他：" prop="other">
          <el-input v-model="visitData.other" placeholder="请输入其他信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visibleShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="queryAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看回访记录 -->
    <el-dialog title="回访记录" @close="seeVisiClose" :visible.sync="seeVisibleShow" :modal-append-to-body="false" width="40%" center>
      <el-row>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">最早用药时间：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.firstdrugusetime}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">用药人年龄：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.userage}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">最晚用药时间：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.lastdrugusetime}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">用药人性别：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.usergender}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">回访时间：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.createtime}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">收货人姓名：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.receivername}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">收货人手机号：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.receivermobile}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">收货人地址：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.receiveraddress}}</span>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="9" :style="'text-align:right'">其他：</el-col>
          <el-col :span="15">
            <span>{{seeVisibleData.other}}</span>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 填写备注 -->
    <el-dialog title="备注信息" @close="remarkClose" :visible.sync="remarkShow" :modal-append-to-body="false" width="30%" center>
      <el-form :model="remarksData" ref="remarksForm" :rules="rules" size="small"  label-width="130px">
      <el-form-item label="备注：" prop="Remark"
        :rules="{
          required: true, message: '请输入备注信息', trigger: 'blur'
        }">
          <el-input v-model="remarksData.Remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="remarkShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="remarkAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 填写物流信息 -->
    <el-dialog title="物流信息" @close="logisticsClose" :visible.sync="logisticsShow" :modal-append-to-body="false" width="30%" center>
      <el-form :model="logisticsData" ref="logisticsForm" :rules="rules" size="small"  label-width="130px">
        <el-form-item label="物流公司：" prop="FastmailName"
          :rules="{
            required: true, message: '请输入物流单号', trigger: 'blur'
          }">
          <el-select v-model="logisticsData.FastmailName" placeholder="请选择" style="width:100%">
            <el-option v-for="item in logistics" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号：" prop="FastmailNo"
          :rules="{
            required: true, message: '请输入物流单号', trigger: 'blur'
          }">
          <el-input v-model="logisticsData.FastmailNo" placeholder="请输入物流单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="logisticsShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="logisticsAdd">确 定</el-button>
      </div>
    </el-dialog>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="raredrugData.screenInfo.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      raredrugData: {
        screenInfo: {
          isReply: '',
          pageIndex: 1,
          pageSize: 10
        },
        raredrugOptions: [
          { value: 0, label: '未回访' },
          { value: 1, label: '已回访' }
        ]
      },
      tableData: [],
      selection: [],
      total: 0,
      visibleShow: false,
      visitData: {
        ID: '',
        seekraredrugid: '',
        firstdrugusetime: '',
        lastdrugusetime: '',
        userage: '',
        usergender: '',
        receivername: '',
        receivermobile: '',
        receiveraddress: '',
        other: ''
      },
      remarkShow: false,
      remarksData: {
        ID: '',
        Remark: ''
      },
      logisticsShow: false,
      logisticsData: {
        ID: '',
        SeekRaredrugId: '',
        FastmailName: '',
        FastmailNo: ''
      },
      logistics: [],
      seeVisibleShow: false,
      seeVisibleData: {},
      rules: {
        lastdrugusetime: [{ required: true, message: '请输入最晚用药时间', trigger: 'change' }],
        firstdrugusetime: [{ required: true, message: '请输入最快用药时间', trigger: 'change' }],
        userage: [{ required: true, message: '请输入用药人年龄', trigger: 'blur' }],
        usergender: [{ required: true, message: '请输入用药人性别', trigger: 'change' }],
        receivername: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        receiveraddress: [{ required: true, message: '请输入收货人地址', trigger: 'blur' }],
        receivermobile: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        other: [{ required: true, message: '请输入其他信息', trigger: 'blur' }]
      },
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.raredrugData.screenInfo.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'drugname', title: '药品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'prescriptionurl', title: '稀缺药图片', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'drugoriginplace', title: '稀缺药来源', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isreply', title: '是否回访', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'fastmail', title: '物流信息', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 450, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-tow', isResize: true }
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
        if (item.field === 'prescriptionurl') {
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
        if (item.field === 'isreply') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '已回访') {
              return '<span style="color:green;">已回访</span>';
            } else {
              return '<span style="color:red;">未回访</span>';
            }
          };
        }
      }
      return columns;
    },
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
    queryByOrder() {
      this.raredrugData.screenInfo.pageIndex = 1;
      this.raredrugData.screenInfo.pageSize = 10;
      this.getTableData();
    },
    // 自定义组件删改操作
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = { Ids: [params.rowData.id] };
          this.removeTableData(obj);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') {
        this.visibleShow = true;
        this.visitData.seekraredrugid = params.rowData.id;
      } else if (params.type === 'copy') {
        let oInput = document.createElement('input');
        oInput.value = params.rowData.prescriptionurl;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand('Copy');
        oInput.className = 'oInput';
        document.body.removeChild(oInput);
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      } else if (params.type === 'logistics') {
        this.logisticsShow = true;
        this.logisticsData.SeekRaredrugId = params.rowData.id;
        this.getLogistics();
      } else if (params.type === 'remarks') {
        this.remarkShow = true;
        this.remarksData.ID = params.rowData.id;
      } else if (params.type === 'search') {
        this.seeVisibleShow = true;
        this.getSeeVisiData(params.rowData.visitid);
      } else if (params.type === 'modify') {
        this.visibleShow = true;
        let noSee = 0;
        this.getSeeVisiData(params.rowData.visitid, noSee, params.rowData.id);
        // this.visitData = this.seeVisibleData;
        // console.log(this.seeVisibleData);
      }
    },
    // 获取稀缺药数据
    getTableData() {
      let _self = this;
      ajax.get('/api/admin/getseekraredruglist', {
        params: _self.raredrugData.screenInfo
      }).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    // 删除列表数据
    removeTableData(idList) {
      let _self = this;
      ajax.post('/api/admin/deleteraredrug', idList).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        _self.getTableData();
      });
    },
    // 批量删除
    Delete() {
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            Ids: []
          };
          for (let item of this.selection) {
            obj.Ids.push(item.id);
          }
          this.removeTableData(obj);
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
    // 批量导出
    Export() {
      window.open(`${process.env.BASE_HOST}/api/admin/exportraredrug?pageSize=` + this.total);
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
    // 分页
    pageChange(pageIndex) {
      this.raredrugData.screenInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.raredrugData.screenInfo.pageSize = pageSize;
      this.getTableData();
    },
    // 提交填写回访记录
    queryAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.visibleShow = false;
          let _self = this;
          ajax.post('/api/admin/updateraredrugvisit', this.visitData).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
            }
            this.getTableData();
          });
        } else {
          return false;
        }
      });
    },
    visiClose() {
      this.visitData = {
        ID: '',
        seekraredrugid: '',
        firstdrugusetime: '',
        lastdrugusetime: '',
        userage: '',
        usergender: '',
        receivername: '',
        receivermobile: '',
        receiveraddress: '',
        other: ''
      };
      this.$refs['ruleForm'].resetFields();
    },
    // 查看回访记录
    getSeeVisiData(ids, noSee, seekraredrugid) {
      let _self = this;
      ajax.get('/api/admin/getseekraredrugvisit', {
        params: { id: ids }
      }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.seeVisibleData = res.data.data;
          if (noSee === 0) {
            _self.visitData = res.data.data;
            _self.visitData.seekraredrugid = seekraredrugid;
          }
        }
      });
    },
    seeVisiClose() {
      this.seeVisibleData = {};
    },
    // 填写备注
    remarkAdd() {
      this.$refs['remarksForm'].validate((valid) => {
        if (valid) {
          this.remarkShow = false;
          let _self = this;
          ajax.post('/api/admin/updateraredrugremark', this.remarksData).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
            }
            _self.getTableData();
          });
        } else {
          return false;
        }
      });
    },
    remarkClose() {
      this.remarksData = {
        ID: '',
        Remark: ''
      };
      this.$refs['remarksForm'].resetFields();
    },
    // 获取物流字典
    getLogistics() {
      javaRequest.post('/mall_manage/back/express/getExpressAll').then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.logistics = res.data.resultData;
        }
      });
    },
    // 填写物流信息
    logisticsAdd() {
      this.$refs['logisticsForm'].validate((valid) => {
        if (valid) {
          this.logisticsShow = false;
          let _self = this;
          ajax.post('/api/admin/updateraredrugfastmail', this.logisticsData).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                message: res.data.message,
                type: 'success'
              });
            }
            _self.getTableData();
          });
        } else {
          return false;
        }
      });
    },
    logisticsClose() {
      this.logisticsData = {
        ID: '',
        SeekRaredrugId: '',
        FastmailName: '',
        FastmailNo: ''
      };
      this.$refs['logisticsForm'].resetFields();
    },
    // 清除
    clean() {
      this.raredrugData.screenInfo.isReply = '';
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
    window.previewImg = this.previewImg;
  }
};
</script>

<style>

</style>
