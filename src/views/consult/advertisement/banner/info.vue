<template>
  <div class="edit">
    <div class="toolbar-wrapper">
      <el-form :inline="true" :model="editData" :rules="rules" ref="editValidateForm" label-width="100px" size="small">
         <el-row>
          <el-col :span="12">
            <el-form-item label="链接地址：" prop="tcontents">
              <el-input v-model.number.trim="editData.tcontents" placeholder="请输入链接地址" clearable></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="广告主图：" prop="picurl">
              <uploadSingleImg :imgUrl="editData.picurl" :fileName="'mainImage'" @uploadSuccess="uploadMianImg" @removeImg="removeMainImg"></uploadSingleImg>
              <el-input class="left" type="hidden" v-model="editData.picurl"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="广告状态：" prop="status">
              <el-select v-model.number="editData.status" placeholder="请选择广告状态">
                <el-option label="正常" :value=0></el-option>
                <el-option label="屏蔽" :value=1></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="展示排序：" prop="orderseq">
              <el-select v-model="editData.orderseq" placeholder="请选择展示排序">
                <el-option :label="i" :value="i" v-for="i in 10" :key="i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="展示时间：" prop="starttime">
              <el-date-picker
                v-model="editData.starttime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="关联帖子：" prop="tid">
              <el-select v-model.number="editData.tid" placeholder="请选择关联帖子">
                <el-option v-for="(item, index) in tidList" :value="item.tid" :label="item.ttopic" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item class="form-button-wrapper">
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="commit">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import uploadSingleImg from '@/components/upload/uploadImg';
import yilinAjax from '@/utils/yilinAjax';
export default {
  data() {
    return {
      editData: {
        id: '0',
        tcontents: '',
        status: '',
        orderseq: '1',
        starttime: '',
        picurl: '',
        tid: '',
        validtime: ''
      },
      tidList: [],
      rules: {
        tcontents: [{ required: false, message: '请输入链接地址', trigger: 'blur' }, { type: 'url', message: '链接地址必须为url', trigger: 'blur' }],
        status: [{ required: true, message: '请选择广告状态', trigger: 'change' }],
        orderseq: [{ required: true, message: '请选择广告展示排序', trigger: 'change' }],
        starttime: [{ required: true, message: '请选择广告展示时间及结束时间', trigger: 'change' }],
        picurl: [{ required: true, message: '请选择广告主图', trigger: 'change' }],
        tid: [{ required: true, message: '请选择广告主题', trigger: 'change' }]
      }
    };
  },
  props: {
    isAdd: Boolean
  },
  components: {
    'uploadSingleImg': uploadSingleImg
  },
  methods: {
    // 上传广告主图
    uploadMianImg(data) {
      this.editData.picurl = data.url;
    },
    // 删除广告主图
    removeMainImg() {
      this.editData.picurl = '';
    },
    // 重置
    resetForm() {
      this.$refs['editValidateForm'].resetFields();
    },
    // 提交
    commit() {
      this.$refs['editValidateForm'].validate((valid) => {
        if (valid) {
          // this.addData.StartTime = this.addData.StartTime[0];
          // this.addData.ValidTime = this.addData.StartTime[1];
          this.submitData();
        } else {
          return false;
        }
      });
    },
    submitData() {
      let _self = this;
      this.editData.validtime = this.editData.starttime[1];
      this.editData.starttime = this.editData.starttime[0];
      // console.log(this.editData.ValidTime);
      yilinAjax.post('/api/adsmanage/updatedocbanner', _self.editData).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.$message({
            message: res.data.message,
            type: 'success'
          });
          _self.$router.go(-1);
        }
      });
    },
    // 广告详情
    getEditData() {
      let _self = this;
      yilinAjax.get('/api/adsmanage/getdocbannerdetail', {
        params: {
          id: _self.$route.query.id
        }
      }).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.editData = res.data.data;
          _self.editData.starttime = [_self.editData.starttime, _self.editData.validtime];
          _self.editData.tid = Number(_self.editData.tid);
          console.log(_self.editData.tid);
        }
      });
    },
    // 广告主题
    getTid() {
      let _self = this;
      yilinAjax.get('/api/adsmanage/getdoctopiclist').then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          _self.tidList = res.data.data;
          console.log(_self.tidList);
        }
      });
    }
  },
  created() {
    this.getTid();
    if (!this.isAdd) {
      this.getEditData();
    }
  }
};
</script>

<style lang="less" scoped>
.form-button-wrapper{
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
