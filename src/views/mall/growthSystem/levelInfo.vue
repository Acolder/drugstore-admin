<template>
  <div id="levelWrap">
    <el-form ref="level_Data" :model="levelForm" :rules="rules" label-width="100px">
      <!-- 成长等级 -->
      <div class="growthGrade">
        <p class="title">成长等级</p>
        <div class="growthContent">
          <el-row>
            <el-col :span="8">
              <el-form-item label="等级名称：" prop="name" style="width:80%;">
                <el-input class="el-input" v-model="levelForm.name" clearable ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="会员头衔：" prop="title" class="header">
                <el-select v-model="levelForm.title" placeholder="请选择">
                  <el-option label="无" :value="0"></el-option>
                  <el-option label="达人" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等级图标：" prop="icon" :rules="{ required: false, message: '请选择图标', trigger: 'change'}">
                <uploadImg :imgUrl="levelForm.icon" :fileName="'levelForm.icon'" @uploadSuccess="uploadImg" @removeImg="removeImg"></uploadImg>
                <el-input type="hidden" v-model="levelForm.icon"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="等级排序：" prop="level" style="width:80%;">
                <el-input class="el-input sortInput" v-model.number="levelForm.level"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="启用状态：" prop="status">
                <el-radio v-model="levelForm.status" label="Normal">启用</el-radio>
                <el-radio v-model="levelForm.status" label="Disable">禁用</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 等级指标 -->
      <div class="Gradeindex growthGrade">
        <p class="title">等级指标</p>
        <!-- 互动行为 -->
        <div class="GradeContent margin_top">
          <p class="common_P">
            <span>互动行为</span>
            <el-switch
              class="switch"
              v-model="levelForm.infos[0].status"
              active-color="#13ce66"
              active-text="启用"
              inactive-color="#cccccc">
            </el-switch>
          </p>
          <div class="fgx_padding">
            <div class="p_wrap">
              <p class="djzb_p">{{levelForm.infos[0].tip}}</p>
              <p class="djzb_p">升级至本等级需要达到以下指标：</p>
            </div>
            <el-row style="margin-top:8px;" v-if="levelForm_hdxw.actions">
              <el-col :span="6">
                <el-form-item label="点赞" class="shu">
                  <el-input class="el-input" v-model="levelForm_hdxw.actions[0].quantity" clearable></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收藏" class="shu">
                  <el-input class="el-input" v-model="levelForm_hdxw.actions[1].quantity" clearable></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="评论" class="shu">
                  <el-input class="el-input" v-model="levelForm_hdxw.actions[2].quantity" clearable></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="分享" style="width:81%">
                  <el-input class="el-input" v-model="levelForm_hdxw.actions[3].quantity" clearable ></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 发帖行为 -->
        <div class="GradeContent">
          <p class="common_P">
            <span>发帖行为</span>
            <el-switch
              class="switch"
              v-model="levelForm.infos[1].status"
              active-color="#13ce66"
              active-text="启用"
              inactive-color="#cccccc">
            </el-switch>
          </p>
          <div class="fgx_padding">
            <div class="p_wrap">
              <p class="djzb_p">{{levelForm.infos[1].tip}}</p>
              <p class="djzb_p">升级至本等级需要满足以下条件：</p>
            </div>
            <!-- 优质要求 -->
            <el-row class="fgx" v-if="levelForm_ftxw[0]">
              <div class="ftxw_title">
                <span>优质要求</span>
              </div>
              <el-col :span="4.5">
                <el-form-item label="获点赞">
                  <el-input class="el-input" v-model="levelForm_ftxw[0].childs[0].actions[0].quantity" clearable ></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="4.5">
                <el-form-item label="获收藏">
                  <el-input class="el-input" v-model="levelForm_ftxw[0].childs[0].actions[1].quantity" clearable ></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="4.5">
                <el-form-item label="邀请医生点评">
                  <el-input class="el-input" v-model="levelForm_ftxw[0].childs[0].actions[2].quantity" clearable ></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="4.5">
                <el-form-item label="获医生好评">
                  <el-input class="el-input" v-model="levelForm_ftxw[0].childs[0].actions[3].quantity" clearable ></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
              <el-col :span="4.5">
                <el-form-item label="获分享">
                  <el-input class="el-input" v-model="levelForm_ftxw[0].childs[0].actions[4].quantity" clearable ></el-input>&nbsp; 次
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 所有帖子 -->
            <el-row class="fgx" v-if="levelForm_ftxw[0]">
              <div class="ftxw_title">
                <span>所有帖子</span>
              </div>
              <el-col :span="24" class="bootom">
                  <label for="">发布的优质帖子数达到</label>
                  <el-input class="el-input tz_p" v-model="levelForm_ftxw[0].actions[0].quantity" clearable ></el-input> &nbsp; 篇
              </el-col>
            </el-row>
            <!-- 话题帖 -->
            <el-row class="fgx" v-if="levelForm_ftxw[1]">
              <div class="ftxw_title">
                <span>
                  <el-checkbox v-model="levelForm_ftxw[1].status"></el-checkbox>
                  话题帖
                </span>
              </div>
              <el-col :span="24" class="bootom">
                <el-select v-model="levelForm_ftxw[1].formula" style="width:5%" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                 &nbsp;
                <label for="">发布的优质话题帖</label>
                <el-input class="el-input tz_p" v-model="levelForm_ftxw[1].actions[0].quantity" clearable ></el-input> &nbsp; 篇
              </el-col>
            </el-row>
            <!-- 视频帖 -->
            <el-row class="fgx" v-if="levelForm_ftxw[2]">
              <div class="ftxw_title">
                <span>
                  <el-checkbox v-model="levelForm_ftxw[2].status"></el-checkbox>
                  视频帖
                </span>
              </div>
              <el-col :span="24" class="bootom">
                <el-select v-model="levelForm_ftxw[2].formula" style="width:5%" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                 &nbsp;
                <label for="">发布的优质视频帖</label>
                <el-input class="el-input tz_p" v-model="levelForm_ftxw[2].actions[0].quantity" clearable ></el-input> &nbsp; 篇
              </el-col>
            </el-row>
            <!-- 参与话题的视频帖 -->
            <el-row class="fgx last_fgx" v-if="levelForm_ftxw[3]">
              <div class="ftxw_title">
                <span>
                  <el-checkbox v-model="levelForm_ftxw[3].status"></el-checkbox>
                  参与话题的视频帖
                </span>
              </div>
              <el-col :span="24" class="bootom">
                <el-select v-model="levelForm_ftxw[3].formula" style="width:5%" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                 &nbsp;
                <label for="">参与话题的优质视频帖</label>
                <el-input class="el-input tz_p" v-model="levelForm_ftxw[3].actions[0].quantity" clearable ></el-input> &nbsp; 篇
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 锦囊标题 -->
      <div class="growthbag">
        <p class="title">锦囊标题</p>
        <div class="growthbag">
          <el-row>
            <el-col :span="24">
              <el-input class="el-input" v-model="levelForm.strategy_title" clearable placeholder="请输入锦囊标题" ></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 锦囊内容 -->
      <div class="growthbag">
        <p class="title">成长锦囊</p>
        <div class="growthbag">
          <el-row>
            <el-col :span="24">
                <el-input  type="textarea" :rows="6" v-model="levelForm.strategy_content" clearable placeholder="请简要描述成长锦囊" ></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 升级通知 -->
      <div class="growthbag">
        <p class="title">升级通知</p>
        <div class="growthbag">
          <el-row>
            <el-col :span="24">
                <el-input  type="textarea" :rows="6" v-model="levelForm.notify" clearable placeholder="请输入升级通知文案" ></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-form-item class="form-submit">
        <el-button size="small" type="default" @click="cancel" icon="el-icon-circle-close">重置</el-button>
        <el-button size="small" type="primary" @click="save" icon="el-icon-search">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadImg from '@/components/upload/uploadImg';
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      options: [
        {
          value: 'And',
          label: '其中'
        }, {
          value: 'Or',
          label: '或者'
        }
      ],
      levelForm: {
        name: '',     //  等级名称
        title: '',     //  会员头衔
        icon: '',     //   等级图标
        level: '',     //  排序
        status: '',   //   启禁用
        strategy_content: '',  // 锦囊内容
        strategy_title: '',  // 锦囊标题
        notify: '',  // 升级通知
        infos: [
          {
            sort: 1,
            type: 'Interaction',
            tip: '',
            status: 'Disable',
            details: [],
          },
          {
            sort: 1,
            type: 'Interaction',
            tip: '',
            status: 'Disable',
            details: [],
          }
        ],
        switch: '',   //   启用开关
      },
      levelForm_hdxw: '',   // 互动行为
      levelForm_ftxw: '',   // 发帖行为
      rules: {
        name: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入会员头衔', trigger: 'blur' }],
        level: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        status: [{ required: true, message: '请选择启禁用', trigger: 'blur' }],
      },
    };
  },
  components: {
    'uploadImg': uploadImg,
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 上传图标
    uploadImg(data, imgUrl) {
      this.levelForm.icon = imgUrl;
    },
    // 删除图标
    removeImg(url) {
      this.levelForm.icon = url;
    },
    // 获取列表
    getTable() {
      let _self = this;
      ajax.get(`api/vip/tmpl/get`).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.levelForm = res.data.data;
          _self.levelForm.level = 1;
          _self.levelForm_hdxw = _self.levelForm.infos[0].details[0];
          _self.levelForm_ftxw = _self.levelForm.infos[1].details;
          _self.levelForm_hdxw.formula = 'And';
          _self.levelForm_ftxw[0].childs[0].formula = 'And';
          _self.levelForm_ftxw[1].childs[0].formula = 'And';
          _self.levelForm_ftxw[2].childs[0].formula = 'And';
          _self.levelForm_ftxw[3].childs[0].formula = 'And';
          _self.levelForm_ftxw[0].formula = 'And';
          _self.levelForm_ftxw[1].formula = 'And';
          _self.levelForm_ftxw[2].formula = 'And';
          _self.levelForm_ftxw[3].formula = 'And';
          if (_self.levelForm.infos[0].status === 'Normal') {
            _self.levelForm.infos[0].status = true;
          } else {
            _self.levelForm.infos[0].status = false;
          }
          if (_self.levelForm.infos[1].status === 'Normal') {
            _self.levelForm.infos[1].status = true;
          } else {
            _self.levelForm.infos[0].status = false;
          }
        }
      });
    },
    // 获取详情
    getDetail() {
      let _self = this;
      let id = _self.$route.query.id;
      ajax.get(`api/vip/get?id=` + id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.levelForm = res.data.data;
          _self.levelForm_hdxw = _self.levelForm.infos[0].details[0];
          _self.levelForm_ftxw = _self.levelForm.infos[1].details;
          if (_self.levelForm.title === 'Empty') {
            _self.levelForm.title = 0;
          } else {
            _self.levelForm.title = 1;
          }
          // 发帖行为/互动行为是否禁用
          if (this.levelForm.infos[0].status === 'Normal') {
            this.levelForm.infos[0].status = true;
          } else if (this.levelForm.infos[0].status === 'Disable' || this.levelForm.infos[0].status === 'None') {
            this.levelForm.infos[0].status = false;
          }
          if (this.levelForm.infos[1].status === 'Normal') {
            this.levelForm.infos[1].status = true;
          } else if (this.levelForm.infos[1].status === 'Disable' || this.levelForm.infos[0].status === 'None') {
            this.levelForm.infos[1].status = false;
          }
          // 发帖行为-帖子是否勾选
          if (this.levelForm.infos[1].details[1].status === 'Normal') {
            this.levelForm.infos[1].details[1].status = true;
          } else {
            this.levelForm.infos[1].details[1].status = false;
          }
          if (this.levelForm.infos[1].details[2].status === 'Normal') {
            this.levelForm.infos[1].details[2].status = true;
          } else {
            this.levelForm.infos[1].details[2].status = false;
          }
          if (this.levelForm.infos[1].details[3].status === 'Normal') {
            this.levelForm.infos[1].details[3].status = true;
          } else {
            this.levelForm.infos[1].details[3].status = false;
          }
        }
      });
    },
    // 取消
    cancel() {
      this.getTable();
    },
    // 确定提交
    save() {
      let _self = this;
      let param = _self.levelForm;
      if (param.infos[1].details[0].childs[0].actions[0].quantity !== 0) {
        param.infos[1].details[1].childs[0].actions[0].quantity =
        param.infos[1].details[2].childs[0].actions[0].quantity =
        param.infos[1].details[3].childs[0].actions[0].quantity = param.infos[1].details[0].childs[0].actions[0].quantity;
      }
      if (param.infos[1].details[0].childs[0].actions[1].quantity !== 0) {
        param.infos[1].details[1].childs[0].actions[1].quantity =
        param.infos[1].details[2].childs[0].actions[1].quantity =
        param.infos[1].details[3].childs[0].actions[1].quantity = param.infos[1].details[0].childs[0].actions[1].quantity;
      }
      if (param.infos[1].details[0].childs[0].actions[2].quantity !== 0) {
        param.infos[1].details[1].childs[0].actions[2].quantity =
        param.infos[1].details[2].childs[0].actions[2].quantity =
        param.infos[1].details[3].childs[0].actions[2].quantity = param.infos[1].details[0].childs[0].actions[2].quantity;
      }
      if (param.infos[1].details[0].childs[0].actions[3].quantity !== 0) {
        param.infos[1].details[1].childs[0].actions[3].quantity =
        param.infos[1].details[2].childs[0].actions[3].quantity =
        param.infos[1].details[3].childs[0].actions[3].quantity = param.infos[1].details[0].childs[0].actions[3].quantity;
      }
      if (param.infos[1].details[0].childs[0].actions[4].quantity !== 0) {
        param.infos[1].details[1].childs[0].actions[4].quantity =
        param.infos[1].details[2].childs[0].actions[4].quantity =
        param.infos[1].details[3].childs[0].actions[4].quantity = param.infos[1].details[0].childs[0].actions[4].quantity;
      }
      if (param.infos[1].details[1].status === true) {
        param.infos[1].details[1].status = 'Normal';
      } else {
        param.infos[1].details[1].status = 'Disable';
      }
      if (param.infos[1].details[2].status === true) {
        param.infos[1].details[2].status = 'Normal';
      } else {
        param.infos[1].details[2].status = 'Disable';
      }
      if (param.infos[1].details[3].status === true) {
        param.infos[1].details[3].status = 'Normal';
      } else {
        param.infos[1].details[3].status = 'Disable';
      }
      if (param.title === 1) {
        param.title = 'DaRen';
      } else {
        param.title = 'Empty';
      }
      if (param.infos[0].status === true) {
        param.infos[0].status = 'Normal';
      } else if (param.infos[0].status === false || param.infos[0].status === 'None') {
        param.infos[0].status = 'Disable';
      }
      if (param.infos[1].status === true) {
        param.infos[1].status = 'Normal';
      } else if (param.infos[1].status === false || param.infos[0].status === 'None') {
        param.infos[1].status = 'Disable';
      }
      _self.$refs['level_Data'].validate((valid) => {
        if (valid) {
          ajax.post(`api/vip/edit`, param).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功'
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
                  path: '/growthSystem/growthLevel',
                });
              });
            }
          });
        }
      });
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail();
    } else {
      this.getTable();
    }
  }
};
</script>

<style lang="less" scoped>
#levelWrap{
  padding: 0 30px;
  .title{
    padding-left: 5px;
    color: #6b6b6b;
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    margin: 45px 0 0 0;
  }
  .commonH{
    line-height: 60px;
  }
  .growthGrade{
    .growthContent{
      padding: 30px 40px 0;
      background-color: #f2f2f2;
      /deep/ .img-wrapper[data-v-2dfd9857]{
        padding: 0;
      };
      /deep/ .el-form-item__content{
        height: 60px;
      }
    }
  }
  .GradeContent{
    margin: 0 0 28px 0;
    border: 1px solid #d7d7d7;
    .common_P{
      background: #f2f2f2;
      color: #333333;
      line-height: 40px;
      height: 40px;
      border-bottom: 1px solid #d7d7d7;
      padding: 0 16px;
      span{
        float: left;
      }
      .switch{
        float: right;
        margin-top: 9px;
      }
    }
    .p_wrap{
      padding: 10px 0;
      .djzb_p{
        height: 38px;
        line-height: 38px;
        font-size: 16px;
        color: #666666;
      }
    }
    .el-input{
      width: 40%;
      /deep/ .el-input__inner{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .shu{
      border-right: 1px solid #f2f2f2;
      width: 81%;
    }
    .fgx_padding{
      padding: 0 16px;
      .fgx{
        margin-top:8px;
        border-bottom: 1px solid #d7d7d7;
          .ftxw_title{
          height: 53px;
          margin: 13px 0 0 0;
          span{
            display: inline-block;
            padding: 10px;
            background-color: #d7d7d7;
          }
        }
        .bootom{
          margin-bottom: 20px;
          .tz_p{
            width: 5%;
          }
        }
      }
      .last_fgx{
        border: none;
      }
    }
  }
  .form-submit{
    text-align: center;
    margin: 20px 0 100px -100px;
  }
}
</style>
