<template>
  <div id="programmeWrap">
    <el-form ref="programme" :model="programmeForm" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="理疗方案:" prop="programme_name" class="source">
            <el-input style="width:40%;" v-model.trim="programmeForm.programme_name" display="inline-block"
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" clearable placeholder="请输入理疗方案"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="展示图:" :prop="'programme_picurl'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}">
            <uploadImg :imgUrl="programmeForm.programme_picurl" :fileName="'programme_picurl'" @uploadSuccess="uploadImgMain" @removeImg="removeImgMain" class="upImg1"></uploadImg>
            <el-input class="left" type="hidden" v-model="programmeForm.programme_picurl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="width:40%;" label="项目价格:" prop="programme_price">
            <el-input v-model="programmeForm.programme_price" placeholder="请输入大于0的项目价格（最多保留两位小数,不能以0开头）" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="width:40%;" label="项目时长:" prop="programme_time">
            <el-input v-model="programmeForm.programme_time" placeholder="文本格式，请输入项目时长" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="banner图:" :prop="'banner_picurl'" :rules="{ required: false, message: '请选择10张以内的图片', trigger: 'change'}">
            <uploadImg :imgUrl="programmeForm.banner_picurl" :fileName="'banner_picurl'" @uploadSuccess="uploadImgBanner" @removeImg="removeImgBanner" :limit="10" class="upImg1"></uploadImg>
            <el-input class="left" type="hidden" v-model="programmeForm.banner_picurl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="适宜脏腑辩证:" prop="viscera" style="width:90%">
            <el-button icon="el-icon-plus" type="default" size="small" @click="zfShow = true" v-if="zfDetail === ''">请选择脏腑</el-button>
            <el-tag
              :key="tag"
              v-for="tag in tags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              class="tag">
              {{tag}}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="理疗方案标题描述:" prop="programme_description" style="width:90%">
            <el-input type="textarea" :rows="4" v-model="programmeForm.programme_description" placeholder="请对理疗方案标题进行描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="图文介绍:" prop="image_description" style="width:90%" class="source">
            <textarea id="symptom" v-model="programmeForm.image_description" style="display:none;"></textarea>
            <ueditor :id="'introduce_ueditor'" ref="introduce_ueditor"></ueditor>
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
    <!-- 选择脏腑 -->
    <el-dialog title="选择脏腑" :visible.sync="zfShow" :modal-append-to-body="false" width="1500px" :append-to-body="true" center>
      <iframe :src="zfURL" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
import uploadImg from '@/components/upload/uploadImg';
import ueditor from '@/components/ueditor/editor';
export default {
  data() {
    // 项目价格
    let validatePrice = (rule, value, callback) => {
      if (value) {
        const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确格式的项目价格'));
        }
      } else {
        callback();
      }
    };
    // 方案名称
    let validateName = (rule, value, callback) => {
      let _self = this;
      if (value && _self.$route.query.tip === 1) {
        if (_self.$route.query.name.indexOf(_self.programmeForm.programme_name) === -1) {
          callback();
        }
        else {
          return callback(new Error('该方案已存在门店列表，请重新输入方案名称'));
        }
      } else {
        callback();
      }
    };
    return {
      introduce_symptom: {},
      programmeForm: {
        physiotherapy_id: this.$route.query.id,
        programme_name: '',  // 方案名称
        programme_picurl: '',  // 展示图
        programme_price: '',  // 价格
        programme_time: '',  // 时长
        banner_picurl: '',  // banner图
        viscera: '',  // 适宜脏腑
        programme_description: '',  // 简介描述
        image_description: '',  // 图文展示
      },
      tags: [],
      zfShow: false,
      zfDetail: '',
      rules: {
        programme_name: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
        programme_price: [
          { required: true, validator: validatePrice, trigger: 'blur' },
        ],
        programme_time: [{ required: true, message: '请输入项目时长', trigger: 'blur' }],
      },
      zfURL: `${process.env.WEB_HOST}/instrumentTesting/physiotherapy/Visceracomponent`,
      getData: {},
      dataParse: '',
      zfListShow: false,
    };
  },
  components: {
    'uploadImg': uploadImg,
    'ueditor': ueditor,
  },
  props: {
    addProgramme: Boolean,
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 上传展示图
    uploadImgMain(data, imgUrl) {
      this.programmeForm.programme_picurl = imgUrl;
    },
    // 删除展示图
    removeImgMain(url) {
      this.programmeForm.programme_picurl = url;
    },
    // 上传banner图
    uploadImgBanner(data, imgUrl) {
      this.programmeForm.banner_picurl = imgUrl;
    },
    // 删除banner图
    removeImgBanner(url) {
      this.programmeForm.banner_picurl = url;
    },
    resetForm() {
      this.introduce_symptom.setContent('');
      this.$refs['programme'].resetFields();
      this.programmeForm = {
        image_description: '',
      };
      this.tags = [];
    },
    // 获取详情
    getDetail() {
      let _self = this;
      let param = {
        id: _self.$route.query.id,
      };
      ajax.get(`/api/borrow/GetPhysiotherapyProgrammeInfoByid`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.programmeForm = res.data.data;
          if (_self.programmeForm.image_description) {
            _self.introduce_symptom.setContent(_self.programmeForm.image_description);
          }
          if (_self.programmeForm.viscera) {
            let arr = _self.programmeForm.viscera.split(',');
            _self.tags = arr;
          }
        }
      });
    },
    // 提交
    submitForm() {
      let _self = this;
      _self.programmeForm.image_description = _self.introduce_symptom.getContent();
      _self.$refs['programme'].validate((valid) => {
        if (valid) {
          let param = _self.programmeForm;
          let url;
          if (_self.addProgramme) {
            url = '/api/borrow/CreatePhysiotherapyStoreProgrammeInfo';
          } else {
            url = '/api/borrow/UpdatePhysiotherapyStoreProgrammeInfo';
          }
          ajax.post(url, param).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功',
              });
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
                  path: '/instrumentTesting/physiotherapy/manageProgramme',
                  query: {
                    id: _self.programmeForm.physiotherapy_id
                  }
                });
              });
            }
          });
        } else {
          _self.$alert('请将带 * 的填写完整。', '提示', {
            type: 'error'
          });
          return false;
        }
      });
    },
    // 删除适宜脏腑
    handleClose(tag) {
      let _self = this;
      this.tags.splice(this.tags.indexOf(tag), 1);
      let visceraArr = _self.tags.join(',');
      _self.programmeForm.viscera = visceraArr;
    },
    // 选择适宜脏腑
    zfList(data, false1) {
      let _self = this;
      if (data) {
        if (_self.tags.indexOf(data.name) === -1) {
          _self.tags.push(data.name);
          let visceraArr = _self.tags.join(',');
          _self.programmeForm.viscera = visceraArr;
          _self.zfShow = false;
        } else {
          _self.$message({
            type: 'warning',
            message: '该脏腑已存在，请重新选择',
          });
        }
      } else if (false1 === false) {
        _self.zfShow = false;
      }
    },
  },
  mounted() {
    this.introduce_symptom = this.$refs.introduce_ueditor;
  },
  created() {
    let _self = this;
    window.zfList = _self.zfList;
    if (!this.addProgramme) {
      _self.getDetail();
    }
  }
};
</script>

<style lang="less" scoped>
.footer{
  text-align: center;
  margin-left: -100px;
  margin-bottom: 50px;
}
.tag{
  margin-right: 10px;
}
</style>
