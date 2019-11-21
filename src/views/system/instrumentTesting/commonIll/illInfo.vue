<template>
  <div id="programmeWrap">
    <el-form ref="programme" :model="illForm" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="常见病名称：" prop="name" class="source">
            <el-input style="width:40%;" v-model.trim="illForm.name" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入理疗方案"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="图文介绍：" prop="detail" style="width:90%" class="source">
            <textarea id="symptom" v-model="illForm.detail" style="display:none;"></textarea>
            <ueditor :id="'imgAndText_ueditor'" ref="imgAndText_ueditor"></ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="footer">
          <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
          <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import uploadImg from '@/components/upload/uploadImg';
import ueditor from '@/components/ueditor/editor';
export default {
  data() {
    return {
      imgAndText_symptom: null,
      illForm: {
        name: '',
        detail: '',
      },
      rules: {
        name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入介绍内容', trigger: 'blur' }],
      },
      userlocation: { lng: '', lat: '' },
    };
  },
  props: {
    addIll: Boolean
  },
  components: {
    'uploadImg': uploadImg,
    'ueditor': ueditor,
  },
  methods: {
    resetForm() {
      this.$refs['programme'].resetFields();
      this.imgAndText_symptom.setContent('');
      this.illForm.detail = '';
    },
    // 获取详情
    getDetail() {
      let _self = this;
      ajax.get(`api/jinmu/commondiseases/get?id=` + _self.$route.query.id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.illForm = res.data.data;
          if (_self.illForm.detail) {
            _self.imgAndText_symptom.setContent(_self.illForm.detail);
          }
        }
      });
    },
    submitForm() {
      let _self = this;
      _self.illForm.detail = _self.imgAndText_symptom.getContent();
      let param = _self.illForm;
      _self.$refs['programme'].validate((valid) => {
        if (valid) {
          let url;
          if (_self.addIll) {
            url = `api/jinmu/commondiseases/create`;
          } else {
            url = `api/jinmu/commondiseases/update`;
          }
          ajax.post(url, param).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功'
              });
              _self.$router.push({
                path: '/instrumentTesting/commonIll/illList',
                query: ''
              });
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
  },
  created() {
    if (!this.addIll) {
      this.getDetail();
    }
  },
  mounted() {
    this.imgAndText_symptom = this.$refs.imgAndText_ueditor;
  }
};
</script>

<style lang="less" scoped>
.footer{
  text-align: center;
  margin-left: -100px;
  margin-bottom: 50px;
}
#allmap{width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
</style>
